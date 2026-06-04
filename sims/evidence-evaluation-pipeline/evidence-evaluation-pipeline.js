// Evidence-Based Evaluation Pipeline Diagram
// Chapter 16: Evidence-Based Evaluation
let containerWidth;
let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

let stages = [
  {
    id: 0, name: 'Problem\nDefinition', color: [33, 150, 243],
    activities: ['Identify trust requirements', 'Map stakeholders', 'Define success metrics', 'Document constraints'],
    inputs: ['Business requirements', 'Stakeholder interviews', 'Regulatory landscape'],
    outputs: ['Trust requirement spec', 'Stakeholder map', 'Success criteria'],
    tools: ['ATAM scenarios', 'Stakeholder analysis', 'Requirements template']
  },
  {
    id: 1, name: 'Evidence\nCataloging', color: [76, 175, 80],
    activities: ['Survey academic literature', 'Collect case studies', 'Gather vendor claims', 'Rate evidence quality'],
    inputs: ['Trust requirement spec', 'Literature databases', 'Vendor documentation'],
    outputs: ['Evidence inventory', 'Quality ratings', 'Gap analysis'],
    tools: ['Evidence hierarchy', 'Quality rubric', 'Literature review template']
  },
  {
    id: 2, name: 'ATAM\nAnalysis', color: [255, 152, 0],
    activities: ['Build utility tree', 'Identify architecture approaches', 'Analyze tradeoffs', 'Identify sensitivity points'],
    inputs: ['Evidence inventory', 'Candidate architectures', 'Quality attribute scenarios'],
    outputs: ['Tradeoff matrix', 'Risk catalog', 'Sensitivity points'],
    tools: ['Utility tree builder', 'Tradeoff matrix', 'Risk theme analysis']
  },
  {
    id: 3, name: 'Bias\nCheck', color: [156, 39, 176],
    activities: ['Apply bias checklist', 'Red team review', 'Check for sunk costs', 'Validate assumptions'],
    inputs: ['Tradeoff analysis', 'Decision rationale', 'Stakeholder preferences'],
    outputs: ['Bias assessment', 'Corrected analysis', 'Assumption log'],
    tools: ['Bias checklist', 'Pre-mortem analysis', 'Devil\'s advocate protocol']
  },
  {
    id: 4, name: 'TCO\nComparison', color: [244, 67, 54],
    activities: ['Calculate 5-year TCO', 'Model risk scenarios', 'Compare alternatives', 'Present recommendation'],
    inputs: ['Corrected analysis', 'Cost data', 'Risk assessments'],
    outputs: ['TCO comparison', 'Risk-adjusted recommendation', 'Executive summary'],
    tools: ['TCO calculator', 'Monte Carlo simulation', 'Pyramid presentation']
  }
];

let visitedStages = new Set();
let expandedStage = null;
let checklistItems = [];
let resetBtn, checklistBtn;
let showChecklist = false;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  resetBtn = createButton('Reset');
  resetBtn.parent(document.querySelector('main'));
  resetBtn.style('font-size', '13px');
  resetBtn.style('margin', '4px');
  resetBtn.mousePressed(() => {
    visitedStages = new Set();
    expandedStage = null;
    checklistItems = [];
    showChecklist = false;
  });

  checklistBtn = createButton('Export Checklist');
  checklistBtn.parent(document.querySelector('main'));
  checklistBtn.style('font-size', '13px');
  checklistBtn.style('margin', '4px');
  checklistBtn.mousePressed(() => { showChecklist = !showChecklist; });
}

function draw() {
  updateCanvasSize();
  background('aliceblue');
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Title
  fill(30); noStroke(); textSize(16); textAlign(CENTER, TOP);
  text('Evidence-Based Evaluation Pipeline', canvasWidth / 2, 8);

  // Progress bar
  let progW = canvasWidth - 60;
  let progH = 12;
  let progX = 30;
  let progY = 35;
  fill(230); stroke(200); strokeWeight(1);
  rect(progX, progY, progW, progH, 6);
  let pct = visitedStages.size / 5;
  fill(76, 175, 80); noStroke();
  rect(progX, progY, progW * pct, progH, 6);
  fill(50); textSize(10); textAlign(CENTER, CENTER);
  text(Math.round(pct * 100) + '% Complete', progX + progW / 2, progY + progH / 2);

  // Pipeline stages
  let stageW = (canvasWidth - 80) / 5;
  let stageH = 60;
  let stageY = 65;
  let startX = 30;

  for (let i = 0; i < 5; i++) {
    let s = stages[i];
    let sx = startX + i * (stageW + 5);
    let isVisited = visitedStages.has(i);
    let isCurrent = expandedStage === i;
    let isHovered = mouseX > sx && mouseX < sx + stageW && mouseY > stageY && mouseY < stageY + stageH;

    // Stage block
    if (isCurrent) {
      fill(s.color[0], s.color[1], s.color[2], 200);
      stroke(s.color[0], s.color[1], s.color[2]); strokeWeight(3);
    } else if (isVisited) {
      fill(76, 175, 80, 60); stroke(76, 175, 80); strokeWeight(2);
    } else {
      fill(isHovered ? 240 : 230); stroke(180); strokeWeight(1);
    }
    rect(sx, stageY, stageW, stageH, 5);

    // Stage number
    fill(isCurrent ? 255 : 80); noStroke();
    textSize(10); textAlign(CENTER, TOP);
    text('Stage ' + (i + 1), sx + stageW / 2, stageY + 5);
    textSize(11); textAlign(CENTER, CENTER);
    fill(isCurrent ? 255 : 40);
    text(s.name, sx + stageW / 2, stageY + 38);

    // Status icon
    if (isVisited) {
      fill(76, 175, 80); noStroke(); textSize(14);
      text('✓', sx + stageW - 12, stageY + 10);
    }

    // Arrow between stages
    if (i < 4) {
      let ax = sx + stageW + 1;
      let ay = stageY + stageH / 2;
      fill(150); noStroke();
      triangle(ax + 4, ay, ax, ay - 4, ax, ay + 4);
    }
  }

  // Expanded detail panel
  if (expandedStage !== null) {
    let s = stages[expandedStage];
    let panelY = stageY + stageH + 15;
    let panelH = showChecklist ? 170 : 260;

    fill(255, 250, 240); stroke(s.color[0], s.color[1], s.color[2]); strokeWeight(2);
    rect(20, panelY, canvasWidth - 40, panelH, 5);

    let colW = (canvasWidth - 80) / 4;
    let headers = ['Activities', 'Inputs', 'Outputs', 'Tools'];
    let data = [s.activities, s.inputs, s.outputs, s.tools];

    for (let c = 0; c < 4; c++) {
      let cx = 30 + c * colW;
      fill(s.color[0], s.color[1], s.color[2]);
      noStroke(); textSize(11); textAlign(LEFT, TOP);
      textStyle(BOLD);
      text(headers[c], cx, panelY + 10);
      textStyle(NORMAL); textSize(10); fill(50);
      for (let j = 0; j < data[c].length; j++) {
        text('• ' + data[c][j], cx, panelY + 28 + j * 16, colW - 10, 50);
      }
    }
  }

  // Checklist panel
  if (showChecklist) {
    let clY = expandedStage !== null ? 315 : 150;
    let clH = drawHeight - clY - 10;
    fill(245, 248, 255); stroke(200); strokeWeight(1);
    rect(20, clY, canvasWidth - 40, clH, 5);

    fill(30); noStroke(); textSize(12); textAlign(LEFT, TOP);
    textStyle(BOLD);
    text('Evaluation Checklist', 30, clY + 8);
    textStyle(NORMAL); textSize(10);

    if (checklistItems.length === 0) {
      fill(150);
      text('Click through pipeline stages to build your checklist.', 30, clY + 28);
    } else {
      let yy = clY + 28;
      for (let item of checklistItems) {
        if (yy > clY + clH - 15) break;
        fill(50);
        text('□ ' + item, 30, yy, canvasWidth - 80, 14);
        yy += 15;
      }
    }
  }

  // Control region
  fill('white'); stroke('silver'); strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);
  fill(80); noStroke(); textSize(11); textAlign(CENTER, CENTER);
  text('Click each pipeline stage to explore details and build a checklist.', canvasWidth / 2, drawHeight + 20);
}

function mousePressed() {
  let stageW = (canvasWidth - 80) / 5;
  let stageH = 60;
  let stageY = 65;
  let startX = 30;

  for (let i = 0; i < 5; i++) {
    let sx = startX + i * (stageW + 5);
    if (mouseX > sx && mouseX < sx + stageW && mouseY > stageY && mouseY < stageY + stageH) {
      if (expandedStage === i) {
        expandedStage = null;
      } else {
        expandedStage = i;
        if (!visitedStages.has(i)) {
          visitedStages.add(i);
          // Add checklist items from this stage
          let s = stages[i];
          for (let a of s.activities) {
            checklistItems.push('[Stage ' + (i + 1) + '] ' + a);
          }
        }
      }
      return;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
  containerWidth = select('main').width;
  canvasWidth = containerWidth;
}
