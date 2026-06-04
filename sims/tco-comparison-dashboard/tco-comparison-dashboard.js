// TCO Comparison Dashboard MicroSim
// Stacked area chart comparing blockchain vs traditional TCO
let containerWidth;
let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

let volumeSlider, partnersSlider, horizonSlider;
let typeSel, calcBtn;
let hasCalculated = false;
let blockchainCosts = [];
let traditionalCosts = [];
let categories = ['Infrastructure', 'Development', 'Operations', 'Governance', 'Transaction Fees'];
let catColors = ['#1565C0', '#E65100', '#2E7D32', '#7B1FA2', '#C62828'];
let breakEvenYear = -1;
let hoveredYear = -1;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));

  volumeSlider = createSlider(4, 7, 5, 0.1); // log10 scale: 10K to 10M
  volumeSlider.parent(document.querySelector('main'));
  volumeSlider.style('width', '130px');

  partnersSlider = createSlider(2, 20, 5, 1);
  partnersSlider.parent(document.querySelector('main'));
  partnersSlider.style('width', '130px');

  horizonSlider = createSlider(1, 7, 5, 1);
  horizonSlider.parent(document.querySelector('main'));
  horizonSlider.style('width', '130px');

  typeSel = createSelect();
  typeSel.parent(document.querySelector('main'));
  typeSel.option('Public');
  typeSel.option('Private');
  typeSel.option('Consortium');
  typeSel.selected('Consortium');

  calcBtn = createButton('Calculate TCO');
  calcBtn.parent(document.querySelector('main'));
  calcBtn.mousePressed(calculateTCO);

  calculateTCO();
  describe('Dashboard comparing total cost of ownership between blockchain and traditional architectures.');
}

function calculateTCO() {
  let annualVol = Math.pow(10, volumeSlider.value());
  let partners = partnersSlider.value();
  let horizon = horizonSlider.value();
  let bType = typeSel.value();

  blockchainCosts = [];
  traditionalCosts = [];

  let bcTxFeeRate = bType === 'Public' ? 0.50 : bType === 'Consortium' ? 0.02 : 0.01;
  let bcInfraBase = bType === 'Public' ? 20000 : 40000 * partners;
  let bcDevBase = bType === 'Public' ? 300000 : 250000;
  let bcOpsBase = bType === 'Public' ? 60000 : 80000;
  let bcGovBase = bType === 'Public' ? 5000 : 30000 * Math.sqrt(partners);

  let tradInfraBase = 50000;
  let tradDevBase = 150000;
  let tradOpsBase = 40000;
  let tradGovBase = 10000;
  let tradTxFeeRate = 0.001;

  for (let yr = 0; yr < horizon; yr++) {
    let vol = annualVol * Math.pow(1.2, yr);

    let bc = {
      infra: bcInfraBase * (1 + yr * 0.05),
      dev: yr === 0 ? bcDevBase : bcDevBase * 0.15,
      ops: bcOpsBase * (1 + yr * 0.1),
      gov: bcGovBase,
      txFees: vol * bcTxFeeRate * (1 + yr * 0.1)
    };
    blockchainCosts.push(bc);

    let trad = {
      infra: tradInfraBase * (1 + yr * 0.1),
      dev: yr === 0 ? tradDevBase : tradDevBase * 0.2,
      ops: tradOpsBase * (1 + yr * 0.15),
      gov: tradGovBase,
      txFees: vol * tradTxFeeRate
    };
    traditionalCosts.push(trad);
  }

  // Find break-even
  breakEvenYear = -1;
  let bcCum = 0, tradCum = 0;
  for (let yr = 0; yr < horizon; yr++) {
    bcCum += sumCosts(blockchainCosts[yr]);
    tradCum += sumCosts(traditionalCosts[yr]);
    if (bcCum < tradCum && breakEvenYear < 0) {
      breakEvenYear = yr + 1;
    }
  }
  hasCalculated = true;
}

function sumCosts(c) {
  return c.infra + c.dev + c.ops + c.gov + c.txFees;
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('#333');
  noStroke();
  textSize(14);
  textAlign(CENTER, TOP);
  text('TCO Comparison: Blockchain vs Traditional', canvasWidth / 2, 6);

  if (hasCalculated) {
    drawCharts();
  }

  // Controls
  let cy = drawHeight + 8;
  fill('#333');
  noStroke();
  textSize(10);
  textAlign(LEFT, TOP);

  let vol = Math.pow(10, volumeSlider.value());
  let volLabel = vol >= 1e6 ? (vol / 1e6).toFixed(1) + 'M' : (vol / 1e3).toFixed(0) + 'K';
  text('Annual Txns: ' + volLabel, margin, cy);
  volumeSlider.position(margin + 90, cy);

  text('Partners: ' + partnersSlider.value(), margin, cy + 25);
  partnersSlider.position(margin + 90, cy + 25);

  text('Horizon: ' + horizonSlider.value() + 'yr', margin, cy + 50);
  horizonSlider.position(margin + 90, cy + 50);

  let col2 = canvasWidth / 2 + 30;
  text('Type:', col2, cy);
  typeSel.position(col2 + 40, cy);

  calcBtn.position(col2, cy + 28);

  // Summary stats
  if (hasCalculated) {
    let horizon = horizonSlider.value();
    let bcTotal = 0, tradTotal = 0;
    for (let yr = 0; yr < horizon; yr++) {
      bcTotal += sumCosts(blockchainCosts[yr]);
      tradTotal += sumCosts(traditionalCosts[yr]);
    }
    textSize(9);
    fill('#1565C0');
    text('BC ' + horizon + 'yr: $' + (bcTotal / 1000).toFixed(0) + 'K', col2, cy + 55);
    fill('#E65100');
    text('Trad ' + horizon + 'yr: $' + (tradTotal / 1000).toFixed(0) + 'K', col2 + 100, cy + 55);
    fill('#333');
    text('Break-even: ' + (breakEvenYear > 0 ? 'Year ' + breakEvenYear : 'Never'), col2, cy + 68);
  }
}

function drawCharts() {
  let horizon = blockchainCosts.length;
  let chartLeft = 65;
  let chartRight = canvasWidth - margin;
  let chartW = chartRight - chartLeft;
  let chartH1 = 130; // Stacked area height
  let chartTop1 = 28;
  let chartTop2 = chartTop1 + chartH1 + 30;

  // Find max for scaling
  let maxYearly = 0;
  for (let yr = 0; yr < horizon; yr++) {
    maxYearly = Math.max(maxYearly, sumCosts(blockchainCosts[yr]), sumCosts(traditionalCosts[yr]));
  }

  // Check hover
  hoveredYear = -1;
  if (mouseX > chartLeft && mouseX < chartRight && mouseY > chartTop1 && mouseY < drawHeight - 20) {
    hoveredYear = Math.floor((mouseX - chartLeft) / (chartW / horizon));
    hoveredYear = constrain(hoveredYear, 0, horizon - 1);
  }

  // Blockchain stacked area
  fill('#333');
  noStroke();
  textSize(10);
  textAlign(CENTER, TOP);
  text('Blockchain Costs by Year', (chartLeft + chartRight) / 2, chartTop1 - 2);

  drawStackedBars(blockchainCosts, chartLeft, chartTop1 + 12, chartW, chartH1 - 15, maxYearly, horizon);

  // Traditional stacked area
  text('Traditional Costs by Year', (chartLeft + chartRight) / 2, chartTop2 - 2);
  drawStackedBars(traditionalCosts, chartLeft, chartTop2 + 12, chartW, chartH1 - 15, maxYearly, horizon);

  // Cumulative comparison
  let cumTop = chartTop2 + chartH1 + 20;
  let cumH = drawHeight - cumTop - 25;

  fill('#333');
  textSize(10);
  textAlign(CENTER, TOP);
  text('Cumulative Cost Comparison', (chartLeft + chartRight) / 2, cumTop - 5);

  let bcCum = [], tradCum = [];
  let bc = 0, tr = 0;
  let maxCum = 0;
  for (let yr = 0; yr < horizon; yr++) {
    bc += sumCosts(blockchainCosts[yr]);
    tr += sumCosts(traditionalCosts[yr]);
    bcCum.push(bc);
    tradCum.push(tr);
    maxCum = Math.max(maxCum, bc, tr);
  }

  // Axes
  stroke('#ccc');
  strokeWeight(1);
  line(chartLeft, cumTop + cumH, chartRight, cumTop + cumH);

  // Lines
  noFill();
  strokeWeight(2);
  stroke('#1565C0');
  beginShape();
  for (let yr = 0; yr < horizon; yr++) {
    let x = chartLeft + (yr + 0.5) * chartW / horizon;
    let y = cumTop + cumH - (bcCum[yr] / maxCum) * cumH;
    vertex(x, y);
  }
  endShape();

  stroke('#E65100');
  beginShape();
  for (let yr = 0; yr < horizon; yr++) {
    let x = chartLeft + (yr + 0.5) * chartW / horizon;
    let y = cumTop + cumH - (tradCum[yr] / maxCum) * cumH;
    vertex(x, y);
  }
  endShape();

  // Break-even marker
  if (breakEvenYear > 0 && breakEvenYear <= horizon) {
    let bx = chartLeft + (breakEvenYear - 0.5) * chartW / horizon;
    stroke('#4CAF50');
    strokeWeight(2);
    drawingContext.setLineDash([3, 3]);
    line(bx, cumTop, bx, cumTop + cumH);
    drawingContext.setLineDash([]);
    fill('#4CAF50');
    noStroke();
    textSize(8);
    textAlign(CENTER, BOTTOM);
    text('Break-even', bx, cumTop - 1);
  }

  // Legend
  noStroke();
  textSize(8);
  textAlign(LEFT, CENTER);
  fill('#1565C0');
  rect(chartRight - 100, cumTop + 5, 10, 10);
  fill('#333');
  text('Blockchain', chartRight - 86, cumTop + 10);
  fill('#E65100');
  rect(chartRight - 100, cumTop + 18, 10, 10);
  fill('#333');
  text('Traditional', chartRight - 86, cumTop + 23);

  // Y-axis labels
  textSize(7);
  textAlign(RIGHT, CENTER);
  fill('#888');
  text('$' + (maxCum / 1000).toFixed(0) + 'K', chartLeft - 4, cumTop);
  text('$0', chartLeft - 4, cumTop + cumH);

  // Tooltip
  if (hoveredYear >= 0 && hoveredYear < horizon) {
    let bc = blockchainCosts[hoveredYear];
    let tr = traditionalCosts[hoveredYear];
    let tip = 'Year ' + (hoveredYear + 1) + ': BC $' + (sumCosts(bc) / 1000).toFixed(0) + 'K | Trad $' + (sumCosts(tr) / 1000).toFixed(0) + 'K';
    fill(255, 255, 230, 245);
    stroke('#999');
    strokeWeight(1);
    textSize(10);
    let tw = textWidth(tip) + 14;
    let tx = constrain(mouseX + 10, 0, canvasWidth - tw);
    rect(tx, mouseY - 22, tw, 20, 3);
    fill('#333');
    noStroke();
    textAlign(LEFT, CENTER);
    text(tip, tx + 7, mouseY - 12);
  }
}

function drawStackedBars(costs, x, y, w, h, maxVal, horizon) {
  let barW = w / horizon - 4;

  for (let yr = 0; yr < horizon; yr++) {
    let c = costs[yr];
    let vals = [c.infra, c.dev, c.ops, c.gov, c.txFees];
    let bx = x + yr * (w / horizon) + 2;
    let by = y + h;

    for (let j = 0; j < vals.length; j++) {
      let bh = (vals[j] / maxVal) * h;
      fill(catColors[j]);
      noStroke();
      rect(bx, by - bh, barW, bh);
      by -= bh;
    }

    // Year label
    fill('#555');
    noStroke();
    textSize(8);
    textAlign(CENTER, TOP);
    text('Y' + (yr + 1), bx + barW / 2, y + h + 2);
  }

  // Y-axis
  fill('#888');
  textSize(7);
  textAlign(RIGHT, CENTER);
  text('$' + (maxVal / 1000).toFixed(0) + 'K', x - 4, y);
  text('$0', x - 4, y + h);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
  containerWidth = select('main').width;
  canvasWidth = containerWidth;
}
