// Mining Economics Dashboard
// Chapter 8: Mining and Computational Economics
let containerWidth;
let canvasWidth = 400;
let drawHeight = 550;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

let priceSlider, elecSlider, hashSlider, hwCostSlider;
let minerSelect, resetBtn;

const presets = {
  'Custom': { price: 60000, elec: 0.08, hash: 100, hwCost: 5000 },
  'Antminer S21': { price: 60000, elec: 0.08, hash: 200, hwCost: 6000 },
  'Whatsminer M50S': { price: 60000, elec: 0.08, hash: 126, hwCost: 3500 },
  'Home Miner': { price: 60000, elec: 0.12, hash: 40, hwCost: 2000 }
};

// Bitcoin network constants (approximate)
const BLOCK_REWARD = 3.125; // BTC after 2024 halving
const BLOCKS_PER_DAY = 144;
const NETWORK_HASHRATE = 550e6; // 550 EH/s in TH/s
const WATTS_PER_THS = 20; // approximate J/TH

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  minerSelect = createSelect();
  minerSelect.parent(document.querySelector('main'));
  for (let name in presets) minerSelect.option(name);
  minerSelect.changed(() => {
    let p = presets[minerSelect.value()];
    if (p) {
      priceSlider.value(p.price);
      elecSlider.value(p.elec * 100);
      hashSlider.value(p.hash);
      hwCostSlider.value(p.hwCost);
    }
  });

  priceSlider = createSlider(10000, 200000, 60000, 1000);
  priceSlider.parent(document.querySelector('main'));

  elecSlider = createSlider(1, 20, 8, 1);
  elecSlider.parent(document.querySelector('main'));

  hashSlider = createSlider(20, 200, 100, 5);
  hashSlider.parent(document.querySelector('main'));

  hwCostSlider = createSlider(2000, 15000, 5000, 500);
  hwCostSlider.parent(document.querySelector('main'));

  resetBtn = createButton('Reset');
  resetBtn.parent(document.querySelector('main'));
  resetBtn.mousePressed(() => {
    priceSlider.value(60000);
    elecSlider.value(8);
    hashSlider.value(100);
    hwCostSlider.value(5000);
    minerSelect.value('Custom');
  });
}

function draw() {
  updateCanvasSize();

  let btcPrice = priceSlider.value();
  let elecCost = elecSlider.value() / 100;
  let hashRate = hashSlider.value();
  let hwCost = hwCostSlider.value();

  // Calculations
  let myShare = hashRate / NETWORK_HASHRATE;
  let dailyBTC = myShare * BLOCK_REWARD * BLOCKS_PER_DAY;
  let dailyRevenue = dailyBTC * btcPrice;
  let dailyPowerKWH = (hashRate * WATTS_PER_THS * 24) / 1000;
  let dailyElecCost = dailyPowerKWH * elecCost;
  let dailyProfit = dailyRevenue - dailyElecCost;
  let monthlyProfit = dailyProfit * 30;
  let breakEvenElec = dailyRevenue / dailyPowerKWH;
  let paybackDays = dailyProfit > 0 ? hwCost / dailyProfit : Infinity;

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  // Title
  noStroke();
  fill(40);
  textSize(15);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text('Mining Economics Dashboard', canvasWidth / 2, 6);
  textStyle(NORMAL);

  // Slider labels
  let labelX = margin;
  let valX = canvasWidth - margin;
  textSize(11);
  textAlign(LEFT, TOP);
  fill(70);
  let ly = 30;
  text('BTC Price: $' + btcPrice.toLocaleString(), labelX, ly);
  ly += 18;
  text('Electricity: $' + elecCost.toFixed(2) + '/kWh', labelX, ly);
  ly += 18;
  text('Hash Rate: ' + hashRate + ' TH/s', labelX, ly);
  ly += 18;
  text('Hardware Cost: $' + hwCost.toLocaleString(), labelX, ly);

  // === Daily Metrics ===
  let metricsY = 105;
  let colW = (canvasWidth - margin * 2) / 3;

  drawMetricBox(margin, metricsY, colW - 5, 70, 'Daily Revenue',
    '$' + dailyRevenue.toFixed(2), [50, 150, 50]);
  drawMetricBox(margin + colW, metricsY, colW - 5, 70, 'Daily Electric',
    '$' + dailyElecCost.toFixed(2), [200, 100, 50]);
  drawMetricBox(margin + colW * 2, metricsY, colW - 5, 70, 'Daily Profit',
    '$' + dailyProfit.toFixed(2), dailyProfit >= 0 ? [50, 150, 50] : [200, 50, 50]);

  // === Bar Chart: Revenue vs Cost ===
  let barY = 190;
  let barH = 90;
  let barAreaW = canvasWidth - margin * 2;

  noStroke();
  fill(60);
  textSize(12);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Monthly Revenue vs Cost', margin, barY);
  textStyle(NORMAL);

  let monthlyRevenue = dailyRevenue * 30;
  let monthlyElec = dailyElecCost * 30;
  let maxVal = max(monthlyRevenue, monthlyElec, 1);
  let barW = barAreaW * 0.35;

  // Revenue bar
  let revBarH = (monthlyRevenue / maxVal) * (barH - 20);
  fill(50, 180, 50);
  rect(margin + barAreaW * 0.15, barY + barH - revBarH + 18, barW, revBarH, 3, 3, 0, 0);
  fill(60);
  textSize(10);
  textAlign(CENTER, BOTTOM);
  text('$' + monthlyRevenue.toFixed(0), margin + barAreaW * 0.15 + barW / 2, barY + barH - revBarH + 16);
  textAlign(CENTER, TOP);
  text('Revenue', margin + barAreaW * 0.15 + barW / 2, barY + barH + 20);

  // Cost bar
  let costBarH = (monthlyElec / maxVal) * (barH - 20);
  fill(200, 80, 50);
  rect(margin + barAreaW * 0.55, barY + barH - costBarH + 18, barW, costBarH, 3, 3, 0, 0);
  fill(60);
  textSize(10);
  textAlign(CENTER, BOTTOM);
  text('$' + monthlyElec.toFixed(0), margin + barAreaW * 0.55 + barW / 2, barY + barH - costBarH + 16);
  textAlign(CENTER, TOP);
  text('Electricity', margin + barAreaW * 0.55 + barW / 2, barY + barH + 20);

  // === 12-month projection ===
  let projY = 310;
  let projH = 100;
  let projW = canvasWidth - margin * 2;

  noStroke();
  fill(60);
  textSize(12);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('12-Month Profitability Projection', margin, projY);
  textStyle(NORMAL);

  // Chart area
  let chartY = projY + 18;
  let chartH = projH - 18;
  stroke(200);
  strokeWeight(1);
  line(margin, chartY + chartH, margin + projW, chartY + chartH);
  line(margin, chartY, margin, chartY + chartH);

  // Zero line
  let cumValues = [];
  let cumVal = -hwCost;
  let minCum = -hwCost;
  let maxCum = -hwCost;
  for (let m = 0; m < 12; m++) {
    // Simulate 5% difficulty increase per month
    let diffMult = pow(1.05, m);
    let mRevenue = (dailyRevenue / diffMult) * 30;
    let mCost = dailyElecCost * 30;
    cumVal += mRevenue - mCost;
    cumValues.push(cumVal);
    minCum = min(minCum, cumVal);
    maxCum = max(maxCum, cumVal);
  }

  let range = max(abs(minCum), abs(maxCum), 1);
  let zeroY = chartY + chartH / 2;

  // Zero line
  stroke(150);
  strokeWeight(0.5);
  drawingContext.setLineDash([3, 3]);
  line(margin, zeroY, margin + projW, zeroY);
  drawingContext.setLineDash([]);

  // Profit line
  noFill();
  strokeWeight(2);
  beginShape();
  for (let m = 0; m < 12; m++) {
    let x = margin + (m / 11) * projW;
    let y = zeroY - (cumValues[m] / range) * (chartH / 2 - 5);
    y = constrain(y, chartY + 2, chartY + chartH - 2);
    if (cumValues[m] >= 0) {
      stroke(50, 180, 50);
    } else {
      stroke(200, 80, 50);
    }
    vertex(x, y);
  }
  endShape();

  // Month labels
  noStroke();
  fill(120);
  textSize(8);
  textAlign(CENTER, TOP);
  for (let m = 0; m < 12; m += 2) {
    text('M' + (m + 1), margin + (m / 11) * projW, chartY + chartH + 2);
  }

  // Breakeven label
  fill(100);
  textSize(9);
  textAlign(RIGHT, CENTER);
  text('$0', margin - 4, zeroY);

  // === Summary stats ===
  let sumY = 425;
  noStroke();
  fill(60);
  textSize(11);
  textAlign(LEFT, TOP);

  text('Break-even electricity: $' + breakEvenElec.toFixed(4) + '/kWh', margin, sumY);
  text('Payback period: ' + (paybackDays < 10000 ? Math.ceil(paybackDays) + ' days' : 'Never (unprofitable)'), margin, sumY + 18);
  text('Daily BTC earned: ' + dailyBTC.toFixed(8) + ' BTC', margin, sumY + 36);

  // Network stats
  let netY = sumY + 60;
  fill(40);
  textStyle(BOLD);
  textSize(11);
  text('Network Overview', margin, netY);
  textStyle(NORMAL);
  fill(80);
  textSize(10);
  text('Network hash rate: ~550 EH/s', margin, netY + 16);
  text('Your share: ' + (myShare * 100).toExponential(2) + '%', margin, netY + 32);
  let networkEnergy = NETWORK_HASHRATE * WATTS_PER_THS / 1e6;
  text('Est. network power: ~' + networkEnergy.toFixed(0) + ' MW', margin, netY + 48);

  // Profit/Loss indicator
  let indicatorX = canvasWidth - margin - 80;
  let indicatorY = sumY;
  fill(dailyProfit >= 0 ? color(40, 160, 40) : color(200, 50, 50));
  textSize(28);
  textAlign(CENTER, TOP);
  text(dailyProfit >= 0 ? '✓' : '✗', indicatorX + 40, indicatorY);
  textSize(11);
  text(dailyProfit >= 0 ? 'Profitable' : 'Unprofitable', indicatorX + 40, indicatorY + 34);

  // Control region
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();
  fill(80);
  textSize(11);
  textAlign(CENTER, CENTER);
  text('Adjust sliders to explore mining economics', canvasWidth / 2, drawHeight + controlHeight / 2);
}

function drawMetricBox(x, y, w, h, label, value, col) {
  fill(255, 255, 255, 200);
  stroke(col[0], col[1], col[2]);
  strokeWeight(2);
  rect(x, y, w, h, 6);

  noStroke();
  fill(col[0], col[1], col[2]);
  textSize(18);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(value, x + w / 2, y + h / 2 - 6);
  textStyle(NORMAL);
  fill(80);
  textSize(10);
  text(label, x + w / 2, y + h / 2 + 16);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
  containerWidth = select('main').width;
  canvasWidth = containerWidth;
}
