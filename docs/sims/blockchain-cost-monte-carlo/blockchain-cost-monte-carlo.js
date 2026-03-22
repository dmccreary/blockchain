// Blockchain Cost Monte Carlo MicroSim
// Monte Carlo simulation with histogram output
let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

let nodeSlider, growthSlider, uncertaintySlider;
let volatilitySel, runBtn, showCentralized;
let results = [];
let centralizedCost = 0;
let stats = {};
let hasRun = false;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));

  nodeSlider = createSlider(5, 50, 10, 1);
  nodeSlider.parent(document.querySelector('main'));
  nodeSlider.style('width', '140px');

  growthSlider = createSlider(10, 100, 30, 5);
  growthSlider.parent(document.querySelector('main'));
  growthSlider.style('width', '140px');

  volatilitySel = createSelect();
  volatilitySel.parent(document.querySelector('main'));
  volatilitySel.option('Low');
  volatilitySel.option('Medium');
  volatilitySel.option('High');
  volatilitySel.selected('Medium');

  uncertaintySlider = createSlider(1.0, 3.0, 1.5, 0.1);
  uncertaintySlider.parent(document.querySelector('main'));
  uncertaintySlider.style('width', '140px');

  runBtn = createButton('Run 1,000 Trials');
  runBtn.parent(document.querySelector('main'));
  runBtn.mousePressed(runSimulation);

  showCentralized = createCheckbox('Show centralized line', true);
  showCentralized.parent(document.querySelector('main'));

  describe('Monte Carlo simulation of blockchain deployment costs with histogram output.');
}

function runSimulation() {
  let numNodes = nodeSlider.value();
  let growthRate = growthSlider.value() / 100;
  let vol = volatilitySel.value();
  let uncert = uncertaintySlider.value();

  let volMultiplier = vol === 'Low' ? 0.5 : vol === 'Medium' ? 1.0 : 2.0;

  results = [];
  for (let t = 0; t < 1000; t++) {
    let totalCost = 0;

    // Infrastructure: nodes * $5K-$15K per year * 3 years
    let infraPerNode = 5000 + randomGaussian() * 2000;
    infraPerNode = Math.max(3000, infraPerNode);
    totalCost += numNodes * infraPerNode * 3;

    // Development: base $200K * uncertainty multiplier
    let devCost = 200000 * (uncert + randomGaussian() * 0.3 * uncert);
    devCost = Math.max(100000, devCost);
    totalCost += devCost;

    // Transaction fees over 3 years with growth
    let baseTxns = 100000;
    let gasCost = (0.5 + randomGaussian() * 0.3 * volMultiplier);
    gasCost = Math.max(0.05, gasCost);
    for (let yr = 0; yr < 3; yr++) {
      let txns = baseTxns * Math.pow(1 + growthRate, yr);
      totalCost += txns * gasCost;
    }

    // Operations: $50K-$150K per year
    let opsCost = 80000 + randomGaussian() * 25000;
    totalCost += opsCost * 3;

    results.push(totalCost);
  }

  results.sort((a, b) => a - b);

  // Centralized comparison
  centralizedCost = 100000 * 3 + 150000 + 50000 * 3; // infra + dev + ops

  // Stats
  let sum = results.reduce((a, b) => a + b, 0);
  stats.mean = sum / results.length;
  stats.median = results[499];
  stats.p75 = results[749];
  stats.p90 = results[899];
  let variance = results.reduce((a, b) => a + (b - stats.mean) ** 2, 0) / results.length;
  stats.stddev = Math.sqrt(variance);
  hasRun = true;
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
  text('Monte Carlo Cost Simulation (3-Year TCO)', canvasWidth / 2, 6);

  if (!hasRun) {
    fill('#888');
    textSize(14);
    textAlign(CENTER, CENTER);
    text('Adjust parameters below and click\n"Run 1,000 Trials" to start', canvasWidth / 2, drawHeight / 2);
  } else {
    drawHistogram();
  }

  // Control labels and positions
  let cy = drawHeight + 10;
  fill('#333');
  noStroke();
  textSize(11);
  textAlign(LEFT, TOP);

  text('Nodes: ' + nodeSlider.value(), margin, cy);
  nodeSlider.position(margin + 80, cy);

  text('Growth: ' + growthSlider.value() + '%', margin, cy + 25);
  growthSlider.position(margin + 80, cy + 25);

  text('Gas Vol:', margin, cy + 50);
  volatilitySel.position(margin + 80, cy + 50);

  let col2 = canvasWidth / 2 + 20;
  text('Dev Uncert: ' + uncertaintySlider.value().toFixed(1) + 'x', col2, cy);
  uncertaintySlider.position(col2 + 90, cy);

  runBtn.position(col2, cy + 30);
  showCentralized.position(col2, cy + 55);
}

function drawHistogram() {
  let chartLeft = 70;
  let chartRight = canvasWidth - margin;
  let chartTop = 30;
  let chartBottom = drawHeight - 80;
  let chartW = chartRight - chartLeft;
  let chartH = chartBottom - chartTop;

  let numBins = 20;
  let minVal = results[0];
  let maxVal = results[results.length - 1];
  let binWidth = (maxVal - minVal) / numBins;

  // Build bins
  let bins = new Array(numBins).fill(0);
  for (let r of results) {
    let b = Math.floor((r - minVal) / binWidth);
    b = Math.min(b, numBins - 1);
    bins[b]++;
  }
  let maxBin = Math.max(...bins);

  // Draw bars
  let barW = chartW / numBins;
  for (let i = 0; i < numBins; i++) {
    let barH = (bins[i] / maxBin) * chartH;
    let x = chartLeft + i * barW;
    fill('#42A5F5');
    stroke('#1E88E5');
    strokeWeight(1);
    rect(x, chartBottom - barH, barW - 1, barH);
  }

  // Axes
  stroke('#333');
  strokeWeight(1);
  line(chartLeft, chartBottom, chartRight, chartBottom);
  line(chartLeft, chartTop, chartLeft, chartBottom);

  // X labels
  fill('#555');
  noStroke();
  textSize(8);
  textAlign(CENTER, TOP);
  for (let i = 0; i <= 4; i++) {
    let val = minVal + (maxVal - minVal) * i / 4;
    let x = chartLeft + chartW * i / 4;
    text('$' + (val / 1000).toFixed(0) + 'K', x, chartBottom + 3);
  }

  // Percentile lines
  drawPercentileLine(stats.median, chartLeft, chartRight, chartTop, chartBottom, minVal, maxVal, '#1565C0', 'P50');
  drawPercentileLine(stats.p75, chartLeft, chartRight, chartTop, chartBottom, minVal, maxVal, '#E65100', 'P75');
  drawPercentileLine(stats.p90, chartLeft, chartRight, chartTop, chartBottom, minVal, maxVal, '#C62828', 'P90');

  // Centralized comparison line
  if (showCentralized.checked() && centralizedCost >= minVal && centralizedCost <= maxVal) {
    drawPercentileLine(centralizedCost, chartLeft, chartRight, chartTop, chartBottom, minVal, maxVal, '#2E7D32', 'Central');
  }

  // Stats panel
  let sx = chartLeft;
  let sy = chartBottom + 20;
  fill('#333');
  noStroke();
  textSize(10);
  textAlign(LEFT, TOP);
  text('Mean: $' + (stats.mean / 1000).toFixed(0) + 'K', sx, sy);
  text('Median: $' + (stats.median / 1000).toFixed(0) + 'K', sx + 120, sy);
  text('Std Dev: $' + (stats.stddev / 1000).toFixed(0) + 'K', sx + 260, sy);
  text('P90: $' + (stats.p90 / 1000).toFixed(0) + 'K', sx, sy + 14);
  text('Centralized: $' + (centralizedCost / 1000).toFixed(0) + 'K', sx + 120, sy + 14);
}

function drawPercentileLine(val, left, right, top, bottom, minV, maxV, col, label) {
  let x = map(val, minV, maxV, left, right);
  stroke(col);
  strokeWeight(2);
  drawingContext.setLineDash([5, 3]);
  line(x, top, x, bottom);
  drawingContext.setLineDash([]);
  fill(col);
  noStroke();
  textSize(9);
  textAlign(CENTER, BOTTOM);
  text(label + '\n$' + (val / 1000).toFixed(0) + 'K', x, top - 2);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
  containerWidth = select('main').width;
  canvasWidth = containerWidth;
}
