// Trust Model Spectrum
// Chapter 1: Trust and Digital Networks
let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

let resetBtn;
let selectedIdx = -1;
let compareMode = false;
let compareBtn;
let compareSelections = [];

const systems = [
  {
    name: 'Traditional Bank',
    defaultX: 0.08,
    trustEntity: 'Central bank / government',
    costPerTx: '$0.20 - $2.00',
    tps: '10,000+',
    tradeoff: 'High throughput but single point of failure and censorship risk'
  },
  {
    name: 'Certificate Authority',
    defaultX: 0.22,
    trustEntity: 'Root CA organizations',
    costPerTx: '$0.01 (amortized)',
    tps: 'N/A (issuance)',
    tradeoff: 'Enables web trust but CA compromise breaks entire chain'
  },
  {
    name: 'Federated System',
    defaultX: 0.38,
    trustEntity: 'Federation of known entities',
    costPerTx: '$0.001 - $0.05',
    tps: '1,000 - 10,000',
    tradeoff: 'Moderate decentralization with governance overhead'
  },
  {
    name: 'Consortium Blockchain',
    defaultX: 0.55,
    trustEntity: 'Known validator set',
    costPerTx: '$0.01 - $0.10',
    tps: '100 - 3,000',
    tradeoff: 'Permissioned access limits censorship resistance'
  },
  {
    name: 'Public Blockchain',
    defaultX: 0.75,
    trustEntity: 'Protocol rules + validators',
    costPerTx: '$0.10 - $50.00',
    tps: '15 - 65',
    tradeoff: 'Open participation but high cost and low throughput'
  },
  {
    name: 'Bitcoin',
    defaultX: 0.92,
    trustEntity: 'PoW consensus (no authority)',
    costPerTx: '$1.00 - $30.00',
    tps: '3 - 7',
    tradeoff: 'Maximum decentralization but very low throughput and high energy cost'
  }
];

let markerX = [];
let dragging = -1;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  resetBtn = createButton('Reset Positions');
  resetBtn.parent(document.querySelector('main'));
  resetBtn.mousePressed(resetPositions);

  compareBtn = createButton('Compare Mode: Off');
  compareBtn.parent(document.querySelector('main'));
  compareBtn.mousePressed(() => {
    compareMode = !compareMode;
    compareSelections = [];
    selectedIdx = -1;
    compareBtn.html('Compare Mode: ' + (compareMode ? 'On' : 'Off'));
  });

  resetPositions();
}

function resetPositions() {
  markerX = systems.map(s => s.defaultX);
  selectedIdx = -1;
  compareSelections = [];
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  // Title
  noStroke();
  fill(40);
  textSize(16);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text('Trust Model Spectrum', canvasWidth / 2, 8);
  textStyle(NORMAL);

  let barLeft = margin + 10;
  let barRight = canvasWidth - margin - 10;
  let barW = barRight - barLeft;
  let barY = 70;
  let barH = 20;

  // Gradient bar
  for (let x = barLeft; x < barRight; x++) {
    let t = (x - barLeft) / barW;
    let r = lerp(70, 50, t);
    let g = lerp(130, 180, t);
    let b = lerp(200, 80, t);
    stroke(r, g, b);
    line(x, barY, x, barY + barH);
  }

  // Labels
  noStroke();
  fill(60);
  textSize(11);
  textAlign(LEFT, TOP);
  text('Fully Centralized', barLeft, barY + barH + 4);
  textAlign(RIGHT, TOP);
  text('Fully Decentralized', barRight, barY + barH + 4);

  // Tick marks
  stroke(120);
  strokeWeight(1);
  for (let i = 0; i <= 10; i++) {
    let tx = barLeft + (barW * i) / 10;
    line(tx, barY + barH, tx, barY + barH + 3);
  }

  // Draw markers
  let markerY = barY + barH / 2;
  for (let i = 0; i < systems.length; i++) {
    let mx = barLeft + markerX[i] * barW;
    let isSelected = selectedIdx === i || compareSelections.includes(i);
    let isHovered = dist(mouseX, mouseY, mx, markerY) < 16;

    // Marker circle
    strokeWeight(2);
    if (isSelected) {
      stroke(200, 80, 30);
      fill(255, 200, 100);
    } else if (isHovered) {
      stroke(100);
      fill(255, 240, 200);
    } else {
      stroke(80);
      fill(255);
    }
    ellipse(mx, markerY, 26, 26);

    // Label
    noStroke();
    fill(40);
    textSize(10);
    textAlign(CENTER, TOP);
    let labelY = markerY + 18 + (i % 2) * 14;
    text(systems[i].name, mx, labelY);

    // Line from marker to label
    stroke(150);
    strokeWeight(0.5);
    line(mx, markerY + 13, mx, labelY);
  }

  // Detail panel
  let panelY = 150;
  if (compareMode && compareSelections.length === 2) {
    drawComparePanel(panelY, barLeft, barW);
  } else if (selectedIdx >= 0) {
    drawDetailPanel(selectedIdx, panelY, barLeft, barW);
  } else {
    noStroke();
    fill(120);
    textSize(13);
    textAlign(CENTER, CENTER);
    text('Click a marker to see details. Drag markers to reposition.',
      canvasWidth / 2, panelY + 60);
  }

  // Control region
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();
  fill(80);
  textSize(12);
  textAlign(CENTER, CENTER);
  let modeText = compareMode ? 'Compare mode: select two markers' : 'Click markers for details, drag to reposition';
  text(modeText, canvasWidth / 2, drawHeight + controlHeight / 2);
}

function drawDetailPanel(idx, py, barLeft, barW) {
  let s = systems[idx];
  let pw = min(barW, 320);
  let px = canvasWidth / 2 - pw / 2;
  let ph = 130;

  fill(255, 255, 255, 220);
  stroke(180);
  strokeWeight(1);
  rect(px, py, pw, ph, 6);

  noStroke();
  fill(40);
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  text(s.name, px + 12, py + 10);
  textStyle(NORMAL);
  textSize(12);
  fill(60);
  text('Trust entity: ' + s.trustEntity, px + 12, py + 32);
  text('Cost per transaction: ' + s.costPerTx, px + 12, py + 50);
  text('Throughput: ' + s.tps + ' TPS', px + 12, py + 68);
  fill(140, 60, 20);
  text('Tradeoff: ' + s.tradeoff, px + 12, py + 88, pw - 24, 40);
}

function drawComparePanel(py, barLeft, barW) {
  let s1 = systems[compareSelections[0]];
  let s2 = systems[compareSelections[1]];
  let pw = min(barW + 40, canvasWidth - 20);
  let px = canvasWidth / 2 - pw / 2;
  let ph = 180;
  let colW = (pw - 24) / 2;

  fill(255, 255, 255, 230);
  stroke(180);
  strokeWeight(1);
  rect(px, py, pw, ph, 6);

  // Headers
  noStroke();
  textSize(13);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  fill(70, 130, 200);
  text(s1.name, px + 12 + colW / 2, py + 8);
  fill(50, 150, 80);
  text(s2.name, px + 12 + colW + colW / 2, py + 8);
  textStyle(NORMAL);

  // Divider
  stroke(200);
  line(px + 12 + colW, py + 28, px + 12 + colW, py + ph - 8);

  let rows = [
    ['Trust', s1.trustEntity, s2.trustEntity],
    ['Cost/Tx', s1.costPerTx, s2.costPerTx],
    ['TPS', s1.tps, s2.tps],
    ['Tradeoff', s1.tradeoff, s2.tradeoff]
  ];

  noStroke();
  textSize(11);
  textAlign(LEFT, TOP);
  for (let i = 0; i < rows.length; i++) {
    let ry = py + 34 + i * 35;
    fill(100);
    textStyle(BOLD);
    text(rows[i][0] + ':', px + 12, ry);
    textStyle(NORMAL);
    fill(60);
    text(rows[i][1], px + 12, ry + 14, colW - 8, 30);
    text(rows[i][2], px + 12 + colW + 4, ry + 14, colW - 8, 30);
  }
}

function mousePressed() {
  let barLeft = margin + 10;
  let barRight = canvasWidth - margin - 10;
  let barW = barRight - barLeft;
  let barY = 70;
  let markerY = barY + 10;

  for (let i = 0; i < systems.length; i++) {
    let mx = barLeft + markerX[i] * barW;
    if (dist(mouseX, mouseY, mx, markerY) < 16) {
      if (compareMode) {
        if (compareSelections.includes(i)) {
          compareSelections = compareSelections.filter(x => x !== i);
        } else if (compareSelections.length < 2) {
          compareSelections.push(i);
        } else {
          compareSelections = [i];
        }
      } else {
        selectedIdx = (selectedIdx === i) ? -1 : i;
        dragging = i;
      }
      return;
    }
  }
}

function mouseDragged() {
  if (dragging >= 0 && !compareMode) {
    let barLeft = margin + 10;
    let barRight = canvasWidth - margin - 10;
    let barW = barRight - barLeft;
    markerX[dragging] = constrain((mouseX - barLeft) / barW, 0, 1);
  }
}

function mouseReleased() {
  dragging = -1;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
  containerWidth = select('main').width;
  canvasWidth = containerWidth;
}
