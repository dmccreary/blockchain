// Risk Theme Heat Map MicroSim
// Chapter 14: Risk Analysis and Quality Attributes
let containerWidth;
let canvasWidth = 400;
let drawHeight = 550;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

let themes = [
  'Immutability\nas Liability',
  'Governance\nFragility',
  'Expertise\nConcentration',
  'Single Point of\nCompromise',
  'Opacity & Audit\nResistance',
  'Regulatory\nUncertainty'
];

let architectures = ['Public\nBlockchain', 'Private\nBlockchain', 'Consortium\nBlockchain', 'Centralized\nDatabase'];

// Default risk ratings [theme][arch] — values 1-10
let defaultRatings = [
  [8, 7, 6, 2],  // Immutability
  [9, 5, 6, 3],  // Governance
  [8, 6, 7, 4],  // Expertise
  [3, 6, 5, 8],  // Single Point
  [4, 7, 5, 3],  // Opacity
  [9, 6, 7, 3]   // Regulatory
];

let ratings;
let weightMode = 'Expected Value';
let weightSelect;
let resetBtn;
let showMitigationCB;
let selectedCell = null; // {row, col}
let hoverCell = null;

// Mitigation data per theme-architecture
let mitigations = [
  ['Hard forks costly; data cannot be removed','Admin key can purge but undermines trust','Governance vote to amend; slow process','Standard DB delete/update operations'],
  ['No central authority; DAO vulnerabilities','Single org controls; key-person risk','Committee deadlocks possible','Clear org hierarchy; documented processes'],
  ['Solidity/crypto specialists scarce','Vendor-specific platform skills','Multi-vendor skill requirements','Widely available SQL/DevOps talent'],
  ['Distributed nodes; no single target','Admin keys are single point','Fewer nodes than public','Single server/cloud region risk'],
  ['Public ledger; full auditability','Permissioned read access; limited','Shared audit among members','Full audit logs if configured'],
  ['Unclear legal status of tokens/DAOs','Fewer regulatory concerns','Shared compliance burden','Well-established legal frameworks']
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');
  ratings = defaultRatings.map(r => [...r]);

  weightSelect = createSelect();
  weightSelect.parent(document.querySelector('main'));
  weightSelect.option('Weight by Expected Value');
  weightSelect.option('Weight by Likelihood');
  weightSelect.option('Weight by Impact');
  weightSelect.selected('Weight by Expected Value');
  weightSelect.style('font-size', '13px');
  weightSelect.style('margin', '4px');

  resetBtn = createButton('Reset to Defaults');
  resetBtn.parent(document.querySelector('main'));
  resetBtn.style('font-size', '13px');
  resetBtn.style('margin', '4px');
  resetBtn.mousePressed(() => {
    ratings = defaultRatings.map(r => [...r]);
    selectedCell = null;
  });

  showMitigationCB = createCheckbox('Show Mitigation Costs', false);
  showMitigationCB.parent(document.querySelector('main'));
  showMitigationCB.style('font-size', '13px');
  showMitigationCB.style('margin', '4px');
}

function draw() {
  updateCanvasSize();
  background('aliceblue');

  // Draw region
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Title
  fill(30);
  noStroke();
  textSize(16);
  textAlign(CENTER, TOP);
  text('Risk Theme Heat Map', canvasWidth / 2, 8);

  let leftLabelW = 110;
  let topLabelH = 55;
  let gridLeft = leftLabelW + 10;
  let gridTop = topLabelH + 30;
  let cellW = Math.min(110, (canvasWidth - gridLeft - 20) / 4);
  let cellH = 42;
  let gridW = cellW * 4;
  let gridH = cellH * 6;

  // Column headers
  textSize(11);
  textAlign(CENTER, CENTER);
  fill(50);
  for (let c = 0; c < 4; c++) {
    let x = gridLeft + c * cellW + cellW / 2;
    text(architectures[c], x, gridTop - 20);
  }

  // Row headers and cells
  hoverCell = null;
  for (let r = 0; r < 6; r++) {
    // Row label
    textSize(10);
    textAlign(RIGHT, CENTER);
    fill(50);
    noStroke();
    text(themes[r], gridLeft - 8, gridTop + r * cellH + cellH / 2);

    for (let c = 0; c < 4; c++) {
      let x = gridLeft + c * cellW;
      let y = gridTop + r * cellH;
      let val = ratings[r][c];

      // Color mapping
      let col = riskColor(val);
      fill(col);
      stroke(255);
      strokeWeight(1);
      rect(x, y, cellW, cellH, 3);

      // Value text
      fill(val > 6 ? 255 : 30);
      noStroke();
      textSize(14);
      textAlign(CENTER, CENTER);
      text(val, x + cellW / 2, y + cellH / 2);

      // Hover detection
      if (mouseX > x && mouseX < x + cellW && mouseY > y && mouseY < y + cellH) {
        hoverCell = {row: r, col: c};
      }

      // Selected highlight
      if (selectedCell && selectedCell.row === r && selectedCell.col === c) {
        noFill();
        stroke(0, 100, 255);
        strokeWeight(3);
        rect(x, y, cellW, cellH, 3);
      }
    }
  }

  // Summary row
  let summY = gridTop + 6 * cellH + 5;
  textSize(11);
  textAlign(RIGHT, CENTER);
  fill(50);
  noStroke();
  text('Overall\nRisk Score', gridLeft - 8, summY + 15);

  for (let c = 0; c < 4; c++) {
    let total = 0;
    for (let r = 0; r < 6; r++) total += ratings[r][c];
    let avg = total / 6;
    let x = gridLeft + c * cellW;

    fill(riskColor(avg));
    stroke(255);
    strokeWeight(1);
    rect(x, summY, cellW, 30, 3);

    fill(avg > 6 ? 255 : 30);
    noStroke();
    textSize(13);
    textAlign(CENTER, CENTER);
    text(avg.toFixed(1), x + cellW / 2, summY + 15);
  }

  // Legend
  let legY = summY + 45;
  textSize(11);
  textAlign(LEFT, CENTER);
  fill(50);
  noStroke();
  text('Risk Level:', gridLeft, legY);
  let legLabels = ['Low', 'Med', 'High', 'Critical'];
  let legVals = [2, 5, 7, 9];
  for (let i = 0; i < 4; i++) {
    let lx = gridLeft + 70 + i * 65;
    fill(riskColor(legVals[i]));
    stroke(200);
    strokeWeight(1);
    rect(lx, legY - 8, 16, 16, 2);
    fill(50);
    noStroke();
    textSize(10);
    textAlign(LEFT, CENTER);
    text(legLabels[i], lx + 20, legY);
  }

  // Detail panel if cell selected
  if (selectedCell) {
    let panelY = legY + 25;
    let panelH = drawHeight - panelY - 5;
    fill(255, 250, 240);
    stroke(200);
    strokeWeight(1);
    rect(10, panelY, canvasWidth - 20, panelH, 5);

    let r = selectedCell.row;
    let c = selectedCell.col;
    fill(30);
    noStroke();
    textSize(12);
    textAlign(LEFT, TOP);
    let label = themes[r].replace('\n', ' ') + ' + ' + architectures[c].replace('\n', ' ');
    textStyle(BOLD);
    text(label, 20, panelY + 8);
    textStyle(NORMAL);
    textSize(11);
    let desc = 'Risk Rating: ' + ratings[r][c] + '/10\n' + mitigations[r][c];
    if (showMitigationCB.checked()) {
      let costs = ['$$$', '$$', '$$', '$'];
      desc += '\nMitigation Cost: ' + costs[c];
    }
    text(desc, 20, panelY + 28, canvasWidth - 50, panelH - 35);
  }

  // Hover tooltip
  if (hoverCell && !selectedCell) {
    let r = hoverCell.row;
    let c = hoverCell.col;
    let tip = themes[r].replace('\n', ' ') + ': ' + ratings[r][c] + '/10';
    fill(50, 50, 50, 220);
    noStroke();
    let tw = textWidth(tip) + 16;
    rect(mouseX + 10, mouseY - 25, tw, 22, 4);
    fill(255);
    textSize(11);
    textAlign(LEFT, CENTER);
    text(tip, mouseX + 18, mouseY - 14);
  }

  // Control region
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);
  fill(80);
  noStroke();
  textSize(11);
  textAlign(CENTER, CENTER);
  text('Click cells to view details. Adjust ratings by clicking + scrolling.', canvasWidth / 2, drawHeight + 20);
}

function mousePressed() {
  // Check cell clicks
  let leftLabelW = 110;
  let topLabelH = 55;
  let gridLeft = leftLabelW + 10;
  let gridTop = topLabelH + 30;
  let cellW = Math.min(110, (canvasWidth - gridLeft - 20) / 4);
  let cellH = 42;

  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 4; c++) {
      let x = gridLeft + c * cellW;
      let y = gridTop + r * cellH;
      if (mouseX > x && mouseX < x + cellW && mouseY > y && mouseY < y + cellH) {
        if (selectedCell && selectedCell.row === r && selectedCell.col === c) {
          selectedCell = null;
        } else {
          selectedCell = {row: r, col: c};
        }
        return;
      }
    }
  }
  selectedCell = null;
}

function mouseWheel(event) {
  if (hoverCell) {
    let r = hoverCell.row;
    let c = hoverCell.col;
    if (event.delta < 0) ratings[r][c] = min(10, ratings[r][c] + 1);
    else ratings[r][c] = max(1, ratings[r][c] - 1);
    return false;
  }
}

function riskColor(val) {
  if (val <= 3) return color(76, 175, 80);
  if (val <= 5) return color(255, 193, 7);
  if (val <= 7) return color(255, 152, 0);
  return color(244, 67, 54);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
  containerWidth = select('main').width;
  canvasWidth = containerWidth;
}
