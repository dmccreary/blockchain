// Throughput vs Latency Comparison
// Chapter 6: Nodes, Throughput, and Network Performance
let containerWidth;
let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

let decentSlider, labelToggle, resetBtn;
let showLabels = true;
let hoveredPoint = -1;

const systems = [
  { name: 'Bitcoin', tps: 7, latency: 600, nodes: 15000, color: [247, 147, 26],
    detail: 'Block time: 10 min | Block size: 1 MB | Cost: $1-30/tx' },
  { name: 'Ethereum', tps: 30, latency: 75, nodes: 8000, color: [98, 126, 234],
    detail: 'Block time: 12 sec | Gas limit: 30M | Cost: $0.50-50/tx' },
  { name: 'Solana', tps: 4000, latency: 0.4, nodes: 2000, color: [0, 255, 163],
    detail: 'Block time: 400ms | Parallel exec | Cost: $0.00025/tx' },
  { name: 'Hyperledger Fabric', tps: 3000, latency: 2, nodes: 20, color: [45, 140, 180],
    detail: 'Permissioned | Modular consensus | Cost: ~$0.01/tx' },
  { name: 'Visa', tps: 65000, latency: 2, nodes: 1, color: [26, 31, 113],
    detail: 'Centralized | Peak: 65K TPS | Cost: $0.10-0.25/tx' },
  { name: 'PostgreSQL', tps: 100000, latency: 0.01, nodes: 1, color: [51, 103, 145],
    detail: 'Single DB | No consensus | Cost: ~$0.0001/tx' }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  decentSlider = createSlider(0, 20000, 0, 100);
  decentSlider.parent(document.querySelector('main'));

  labelToggle = createCheckbox('Show labels', true);
  labelToggle.parent(document.querySelector('main'));
  labelToggle.changed(() => { showLabels = labelToggle.checked(); });

  resetBtn = createButton('Reset View');
  resetBtn.parent(document.querySelector('main'));
  resetBtn.mousePressed(() => { decentSlider.value(0); });
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  // Title
  noStroke();
  fill(40);
  textSize(14);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text('Throughput vs Latency', canvasWidth / 2, 6);
  textStyle(NORMAL);

  // Chart area
  let chartL = margin + 50;
  let chartR = canvasWidth - margin - 10;
  let chartT = 50;
  let chartB = drawHeight - 60;
  let chartW = chartR - chartL;
  let chartH = chartB - chartT;

  // Quadrant shading
  let midX = chartL + chartW / 2;
  let midY = chartT + chartH / 2;
  fill(200, 230, 200, 40);
  noStroke();
  rect(midX, chartT, chartW / 2, chartH / 2); // top-right: fast+high
  fill(230, 200, 200, 40);
  rect(chartL, midY, chartW / 2, chartH / 2); // bottom-left: slow+low

  // Quadrant labels
  fill(140);
  textSize(8);
  textAlign(CENTER, CENTER);
  text('Fast + High Volume', midX + chartW / 4, chartT + 12);
  text('(Traditional)', midX + chartW / 4, chartT + 22);
  text('Slow + Low Volume', chartL + chartW / 4, chartB - 15);

  // Axes
  stroke(100);
  strokeWeight(1.5);
  line(chartL, chartB, chartR, chartB);
  line(chartL, chartT, chartL, chartB);

  // X-axis: TPS (log scale, 1 to 100000)
  let tpsMin = 0; // log10(1)
  let tpsMax = 5; // log10(100000)

  // Y-axis: Latency (log scale, 0.01 to 1000 seconds), INVERTED (low latency = top = fast)
  let latMin = -2; // log10(0.01)
  let latMax = 3;  // log10(1000)

  // Axis labels
  noStroke();
  fill(60);
  textSize(11);
  textAlign(CENTER, TOP);
  text('Throughput (TPS, log scale)', chartL + chartW / 2, chartB + 8);

  push();
  translate(chartL - 40, chartT + chartH / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, BOTTOM);
  text('Confirmation Latency (s)', 0, 0);
  pop();

  // Tick marks X
  textSize(9);
  textAlign(CENTER, TOP);
  fill(100);
  for (let p = 0; p <= 5; p++) {
    let x = chartL + (p / (tpsMax - tpsMin)) * chartW;
    stroke(220);
    strokeWeight(0.5);
    line(x, chartT, x, chartB);
    noStroke();
    text(pow(10, p).toLocaleString(), x, chartB + 2);
  }

  // Tick marks Y (inverted: low latency at top)
  textAlign(RIGHT, CENTER);
  for (let p = -2; p <= 3; p++) {
    let y = chartT + ((p - latMin) / (latMax - latMin)) * chartH;
    stroke(220);
    strokeWeight(0.5);
    line(chartL, y, chartR, y);
    noStroke();
    fill(100);
    let val = pow(10, p);
    text(val < 1 ? val.toFixed(2) : val.toFixed(0), chartL - 4, y);
  }

  let threshold = decentSlider.value();

  // Draw points
  hoveredPoint = -1;
  for (let i = 0; i < systems.length; i++) {
    let s = systems[i];
    let px = chartL + (log(s.tps) / LOG10E - tpsMin) / (tpsMax - tpsMin) * chartW;
    let py = chartT + (log(s.latency) / LOG10E - latMin) / (latMax - latMin) * chartH;
    px = constrain(px, chartL, chartR);
    py = constrain(py, chartT, chartB);

    // Size by node count (log scale)
    let nodeSize = map(log(max(s.nodes, 1)) / LOG10E, 0, 5, 12, 40);

    let grayed = s.nodes < threshold;
    let isHover = dist(mouseX, mouseY, px, py) < nodeSize / 2 + 5;
    if (isHover) hoveredPoint = i;

    // Point
    strokeWeight(2);
    if (grayed) {
      fill(200, 200, 200, 100);
      stroke(180);
    } else if (isHover) {
      fill(s.color[0], s.color[1], s.color[2]);
      stroke(40);
    } else {
      fill(s.color[0], s.color[1], s.color[2], 200);
      stroke(s.color[0], s.color[1], s.color[2]);
    }
    ellipse(px, py, nodeSize, nodeSize);

    // Label
    if (showLabels && !grayed) {
      noStroke();
      fill(40);
      textSize(10);
      textAlign(LEFT, CENTER);
      text(s.name, px + nodeSize / 2 + 4, py);
    }
  }

  // Tooltip
  if (hoveredPoint >= 0) {
    let s = systems[hoveredPoint];
    let tipW = min(canvasWidth - 20, 280);
    let tipH = 52;
    let tipX = constrain(mouseX + 12, 10, canvasWidth - tipW - 10);
    let tipY = constrain(mouseY - tipH - 10, chartT, chartB - tipH);

    fill(40, 40, 40, 230);
    noStroke();
    rect(tipX, tipY, tipW, tipH, 5);
    fill(255);
    textSize(11);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text(s.name + ' — ' + s.tps.toLocaleString() + ' TPS, ' + s.latency + 's latency', tipX + 8, tipY + 6);
    textStyle(NORMAL);
    textSize(10);
    fill(200);
    text(s.detail, tipX + 8, tipY + 24, tipW - 16, 26);
    textSize(9);
    fill(160);
    text('Nodes: ' + s.nodes.toLocaleString(), tipX + 8, tipY + 40);
  }

  // Control region
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();
  fill(80);
  textSize(11);
  textAlign(LEFT, CENTER);
  text('Min nodes: ' + threshold.toLocaleString(), margin, drawHeight + controlHeight / 2);
  fill(120);
  textSize(9);
  textAlign(RIGHT, CENTER);
  text('Point size = node count', canvasWidth - margin, drawHeight + controlHeight / 2);
}

const LOG10E = Math.log(10);

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
  containerWidth = select('main').width;
  canvasWidth = containerWidth;
}
