// Consensus Mechanism Comparison — Radar Chart
// Chapter 7: Consensus Mechanisms
let containerWidth;
let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

let checkboxes = [];
let useCaseSelect;
let compareAllBtn;
let hoveredAxis = -1;

const axes = ['Security', 'Performance', 'Decentralization', 'Energy Efficiency'];
const axisDesc = [
  'Resistance to attacks (51%, Sybil, nothing-at-stake)',
  'Transaction throughput and confirmation speed',
  'Number of independent validators and openness',
  'Energy consumed per transaction or per consensus round'
];

const mechanisms = [
  { name: 'PoW', color: [247, 147, 26], scores: [9, 2, 9, 1] },
  { name: 'PoS', color: [98, 126, 234], scores: [7, 6, 7, 8] },
  { name: 'DPoS', color: [0, 200, 130], scores: [5, 8, 4, 9] },
  { name: 'PBFT', color: [200, 80, 120], scores: [6, 7, 2, 9] }
];

const useCases = [
  { name: 'Select a use case...', best: -1 },
  { name: 'Public cryptocurrency', best: 0, reason: 'Maximum security and decentralization needed' },
  { name: 'Supply chain consortium', best: 3, reason: 'Known participants, need finality and speed' },
  { name: 'Financial settlement', best: 3, reason: 'Fast finality critical, permissioned network acceptable' },
  { name: 'DeFi platform', best: 1, reason: 'Balance of security, decentralization, and efficiency' },
  { name: 'Social media tokens', best: 2, reason: 'High throughput needed, some centralization acceptable' }
];

let visible = [true, true, false, false];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  for (let i = 0; i < mechanisms.length; i++) {
    let cb = createCheckbox(mechanisms[i].name, visible[i]);
    cb.parent(document.querySelector('main'));
    let idx = i;
    cb.changed(() => { visible[idx] = cb.checked(); });
    checkboxes.push(cb);
  }

  useCaseSelect = createSelect();
  useCaseSelect.parent(document.querySelector('main'));
  for (let uc of useCases) {
    useCaseSelect.option(uc.name);
  }

  compareAllBtn = createButton('Compare All');
  compareAllBtn.parent(document.querySelector('main'));
  compareAllBtn.mousePressed(() => {
    for (let i = 0; i < mechanisms.length; i++) {
      visible[i] = true;
      checkboxes[i].checked(true);
    }
  });
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  // Title
  noStroke();
  fill(40);
  textSize(15);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text('Consensus Mechanism Tradeoffs', canvasWidth / 2, 6);
  textStyle(NORMAL);

  // Radar chart
  let cx = canvasWidth * 0.42;
  let cy = drawHeight * 0.45;
  let maxR = min(canvasWidth * 0.3, drawHeight * 0.3);
  let numAxes = axes.length;

  // Grid rings
  for (let ring = 2; ring <= 10; ring += 2) {
    let r = (ring / 10) * maxR;
    stroke(210);
    strokeWeight(0.5);
    noFill();
    beginShape();
    for (let a = 0; a < numAxes; a++) {
      let angle = (TWO_PI / numAxes) * a - HALF_PI;
      vertex(cx + cos(angle) * r, cy + sin(angle) * r);
    }
    endShape(CLOSE);

    // Ring label
    noStroke();
    fill(180);
    textSize(8);
    textAlign(RIGHT, CENTER);
    text(ring, cx - 4, cy - r);
  }

  // Axis lines and labels
  hoveredAxis = -1;
  for (let a = 0; a < numAxes; a++) {
    let angle = (TWO_PI / numAxes) * a - HALF_PI;
    let ex = cx + cos(angle) * maxR;
    let ey = cy + sin(angle) * maxR;
    stroke(160);
    strokeWeight(1);
    line(cx, cy, ex, ey);

    // Label
    let lx = cx + cos(angle) * (maxR + 18);
    let ly = cy + sin(angle) * (maxR + 18);
    noStroke();
    fill(50);
    textSize(11);
    textAlign(CENTER, CENTER);
    text(axes[a], lx, ly);

    // Hover detection
    if (dist(mouseX, mouseY, lx, ly) < 40) {
      hoveredAxis = a;
    }
  }

  // Draw mechanism polygons
  for (let m = 0; m < mechanisms.length; m++) {
    if (!visible[m]) continue;
    let mech = mechanisms[m];

    fill(mech.color[0], mech.color[1], mech.color[2], 40);
    stroke(mech.color[0], mech.color[1], mech.color[2]);
    strokeWeight(2);
    beginShape();
    for (let a = 0; a < numAxes; a++) {
      let angle = (TWO_PI / numAxes) * a - HALF_PI;
      let r = (mech.scores[a] / 10) * maxR;
      vertex(cx + cos(angle) * r, cy + sin(angle) * r);
    }
    endShape(CLOSE);

    // Score dots
    for (let a = 0; a < numAxes; a++) {
      let angle = (TWO_PI / numAxes) * a - HALF_PI;
      let r = (mech.scores[a] / 10) * maxR;
      fill(mech.color[0], mech.color[1], mech.color[2]);
      noStroke();
      ellipse(cx + cos(angle) * r, cy + sin(angle) * r, 8, 8);
    }
  }

  // Legend
  let legendX = canvasWidth * 0.75;
  let legendY = drawHeight * 0.15;
  noStroke();
  textSize(11);
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  fill(40);
  text('Mechanisms:', legendX, legendY - 14);
  textStyle(NORMAL);
  for (let m = 0; m < mechanisms.length; m++) {
    let ly = legendY + m * 22;
    let mech = mechanisms[m];
    if (visible[m]) {
      fill(mech.color[0], mech.color[1], mech.color[2]);
    } else {
      fill(200);
    }
    rect(legendX, ly - 5, 12, 12, 2);
    fill(visible[m] ? 60 : 160);
    textSize(10);
    text(mech.name, legendX + 18, ly + 1);
    // Show scores
    if (visible[m]) {
      fill(120);
      textSize(9);
      text(mech.scores.join(' / '), legendX + 18, ly + 13);
    }
  }

  // Axis description labels
  let scoreLabelsY = legendY + mechanisms.length * 22 + 10;
  fill(120);
  textSize(9);
  textAlign(LEFT, TOP);
  text('Scores: Sec / Perf / Dec / Eff', legendX, scoreLabelsY);

  // Use case recommendation
  let ucName = useCaseSelect.value();
  let uc = useCases.find(u => u.name === ucName);
  if (uc && uc.best >= 0) {
    let recY = drawHeight - 55;
    fill(255, 255, 240);
    stroke(200);
    strokeWeight(1);
    let recW = min(canvasWidth - 40, 340);
    rect(canvasWidth / 2 - recW / 2, recY, recW, 45, 5);
    noStroke();
    fill(40);
    textSize(11);
    textStyle(BOLD);
    textAlign(CENTER, TOP);
    text('Recommended: ' + mechanisms[uc.best].name + ' for ' + ucName, canvasWidth / 2, recY + 4);
    textStyle(NORMAL);
    fill(80);
    textSize(10);
    text(uc.reason, canvasWidth / 2, recY + 22, recW - 20, 24);
  }

  // Axis tooltip
  if (hoveredAxis >= 0) {
    let tipW = min(canvasWidth - 20, 240);
    let tipX = constrain(mouseX + 10, 10, canvasWidth - tipW - 10);
    let tipY = constrain(mouseY - 30, 10, drawHeight - 35);
    fill(40, 40, 40, 220);
    noStroke();
    rect(tipX, tipY, tipW, 26, 4);
    fill(255);
    textSize(10);
    textAlign(LEFT, CENTER);
    text(axisDesc[hoveredAxis], tipX + 6, tipY + 13);
  }

  // Control region
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();
  fill(80);
  textSize(11);
  textAlign(CENTER, CENTER);
  text('Toggle mechanisms and select use cases above', canvasWidth / 2, drawHeight + controlHeight / 2);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
  containerWidth = select('main').width;
  canvasWidth = containerWidth;
}
