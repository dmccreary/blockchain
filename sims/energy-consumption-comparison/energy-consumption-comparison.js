// Energy Consumption Comparison MicroSim
// Log-scale bar chart comparing energy per transaction
let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

let viewToggle; // per-transaction vs annual
let volumeInput;
let hoveredBar = -1;

let systems = [
  { name: 'Bitcoin (PoW)',    kwh: 707,       annual: 127e9,  type: 'pow',   color: '#E53935' },
  { name: 'Ethereum (PoS)',   kwh: 0.03,      annual: 2.6e6,  type: 'pos',   color: '#FDD835' },
  { name: 'Solana (PoS)',     kwh: 0.00051,   annual: 1.8e6,  type: 'pos',   color: '#AB47BC' },
  { name: 'Visa',             kwh: 0.0015,    annual: 7.5e8,  type: 'trad',  color: '#43A047' },
  { name: 'Mastercard',       kwh: 0.0012,    annual: 6.0e8,  type: 'trad',  color: '#2E7D32' },
  { name: 'ACH Transfer',     kwh: 0.001,     annual: 3.0e7,  type: 'trad',  color: '#66BB6A' },
  { name: 'SWIFT',            kwh: 0.005,     annual: 2.5e7,  type: 'trad',  color: '#81C784' },
  { name: 'Database Write',   kwh: 0.0000005, annual: 5.0e4,  type: 'trad',  color: '#A5D6A7' }
];

let perTransactionView = true;
let customVolume = 10000;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));

  viewToggle = createButton('Switch to Annual View');
  viewToggle.parent(document.querySelector('main'));
  viewToggle.mousePressed(() => {
    perTransactionView = !perTransactionView;
    viewToggle.html(perTransactionView ? 'Switch to Annual View' : 'Switch to Per-Transaction View');
  });

  volumeInput = createSlider(100, 1000000, 10000, 100);
  volumeInput.parent(document.querySelector('main'));
  volumeInput.style('width', '180px');

  describe('Log-scale bar chart comparing energy per transaction across blockchain and traditional systems.');
}

function draw() {
  updateCanvasSize();

  // Draw region
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control region
  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  customVolume = volumeInput.value();

  // Title
  fill('#333');
  noStroke();
  textSize(15);
  textAlign(CENTER, TOP);
  let titleText = perTransactionView ? 'Energy per Transaction (kWh) - Log Scale' : 'Annual Network Energy (kWh) - Log Scale';
  text(titleText, canvasWidth / 2, 8);

  // Chart area
  let chartLeft = 120;
  let chartRight = canvasWidth - margin;
  let chartTop = 35;
  let chartBottom = drawHeight - 60;
  let chartW = chartRight - chartLeft;
  let chartH = chartBottom - chartTop;

  let barH = chartH / systems.length - 4;
  hoveredBar = -1;

  // Determine log range
  let values = systems.map(s => perTransactionView ? s.kwh : s.annual);
  let minLog = Math.floor(Math.log10(Math.min(...values)));
  let maxLog = Math.ceil(Math.log10(Math.max(...values)));

  // Draw grid lines
  stroke('#ddd');
  strokeWeight(1);
  textSize(10);
  textAlign(CENTER, TOP);
  fill('#888');
  for (let e = minLog; e <= maxLog; e++) {
    let x = map(e, minLog, maxLog, chartLeft, chartRight);
    line(x, chartTop, x, chartBottom);
    noStroke();
    text('10^' + e, x, chartBottom + 2);
    stroke('#ddd');
  }

  // Draw bars
  for (let i = 0; i < systems.length; i++) {
    let s = systems[i];
    let val = perTransactionView ? s.kwh : s.annual;
    let logVal = Math.log10(val);
    let barW = map(logVal, minLog, maxLog, 0, chartW);
    let y = chartTop + i * (chartH / systems.length) + 2;

    // Check hover
    if (mouseX >= chartLeft && mouseX <= chartLeft + barW && mouseY >= y && mouseY <= y + barH) {
      hoveredBar = i;
    }

    // Bar
    fill(hoveredBar === i ? '#FFE082' : s.color);
    noStroke();
    rect(chartLeft, y, Math.max(barW, 2), barH, 0, 3, 3, 0);

    // Label
    fill('#333');
    textAlign(RIGHT, CENTER);
    textSize(11);
    text(s.name, chartLeft - 5, y + barH / 2);
  }

  // Tooltip
  if (hoveredBar >= 0) {
    let s = systems[hoveredBar];
    let val = perTransactionView ? s.kwh : s.annual;
    let householdHrs = (val / 1.2).toFixed(val < 1 ? 6 : 1);
    let tip = s.name + ': ' + val.toExponential(2) + ' kWh';
    if (perTransactionView) tip += '\n~ ' + householdHrs + ' hrs household electricity';

    fill(255, 255, 230, 240);
    stroke('#999');
    strokeWeight(1);
    let tw = textWidth(tip.split('\n')[0]) + 20;
    let tx = constrain(mouseX + 10, 0, canvasWidth - tw);
    let ty = constrain(mouseY - 40, 0, drawHeight - 50);
    rect(tx, ty, tw, perTransactionView ? 38 : 22, 4);
    fill('#333');
    noStroke();
    textAlign(LEFT, TOP);
    textSize(11);
    let lines = tip.split('\n');
    for (let li = 0; li < lines.length; li++) {
      text(lines[li], tx + 5, ty + 4 + li * 16);
    }
  }

  // Custom volume panel
  let panelY = drawHeight - 55;
  fill(255, 255, 255, 200);
  stroke('#ccc');
  rect(chartLeft, panelY, chartW, 50, 4);
  fill('#333');
  noStroke();
  textSize(11);
  textAlign(LEFT, TOP);
  text('Custom volume: ' + customVolume.toLocaleString() + ' txns', chartLeft + 8, panelY + 4);
  // Show top 3 costs
  let sorted = systems.slice().sort((a, b) => b.kwh - a.kwh);
  for (let i = 0; i < Math.min(3, sorted.length); i++) {
    let cost = (sorted[i].kwh * customVolume);
    text(sorted[i].name + ': ' + cost.toExponential(1) + ' kWh total', chartLeft + 8, panelY + 18 + i * 12);
  }

  // Controls labels
  fill('#333');
  noStroke();
  textSize(12);
  textAlign(LEFT, CENTER);
  text('Volume slider: ' + customVolume.toLocaleString(), margin, drawHeight + 20);
  viewToggle.position(canvasWidth - 200, drawHeight + 40);
  volumeInput.position(margin, drawHeight + 35);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
  containerWidth = select('main').width;
  canvasWidth = containerWidth;
}
