// Implementation Phase Gate Dashboard MicroSim
// Chapter 20: Implementation and Capstone
let containerWidth;
let canvasWidth = 400;
let drawHeight = 600;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

let phases = [
  {name:'Discovery &\nAssessment', duration:'6 weeks', budget:'$120K', status:'completed',
   deliverables:['Requirements analysis','Stakeholder mapping','Initial risk assessment','Architecture options'],
   projected:[20,40,60,80,100,120], actual:[22,45,65,85,108,118]},
  {name:'Proof of\nConcept', duration:'8 weeks', budget:'$200K', status:'in-progress',
   deliverables:['PoC implementation','Performance benchmarks','Security audit','Integration test'],
   projected:[140,165,190,215,240,265,290,320], actual:[145,175,210,250,285,310]},
  {name:'Pilot\nDeployment', duration:'12 weeks', budget:'$350K', status:'not-started',
   deliverables:['Pilot environment','User training','Monitoring setup','Feedback collection'],
   projected:[340,370,400,430,460,490,520,550,580,610,640,670], actual:[]},
  {name:'Production\nRollout', duration:'10 weeks', budget:'$500K', status:'not-started',
   deliverables:['Production deploy','Data migration','Full monitoring','Handoff to ops'],
   projected:[690,730,770,810,850,890,930,970,1010,1050], actual:[]}
];

let gates = [
  {name:'Gate 1: PoC Go/No-Go', criteria:['Business case validated','Architecture selected','Budget approved','Team assembled'],
   metrics:{projected:'$120K', actual:'$118K'}, decision:'GO'},
  {name:'Gate 2: Pilot Go/No-Go', criteria:['PoC meets benchmarks','Security audit passed','Stakeholder buy-in','Pilot plan approved'],
   metrics:{projected:'$320K', actual:'$310K (est.)'}, decision:'PENDING'},
  {name:'Gate 3: Production Go/No-Go', criteria:['Pilot success metrics met','User acceptance','Ops readiness','Rollback plan tested'],
   metrics:{projected:'$670K', actual:'TBD'}, decision:'FUTURE'},
  {name:'Gate 4: Handoff Complete', criteria:['SLA compliance verified','Documentation complete','Team trained','Support process active'],
   metrics:{projected:'$1.05M', actual:'TBD'}, decision:'FUTURE'}
];

let selectedPhase = null;
let selectedGate = null;
let trlSlider;
let showOverrun = false;
let overrunCB, resetBtn;
let trlValue = 6;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  trlSlider = createSlider(3, 9, 6, 1);
  trlSlider.parent(document.querySelector('main'));
  trlSlider.style('width', '140px');
  trlSlider.style('margin', '4px 8px');

  overrunCB = createCheckbox('Simulate Cost Overrun', false);
  overrunCB.parent(document.querySelector('main'));
  overrunCB.style('font-size', '13px');
  overrunCB.style('margin', '4px 8px');
  overrunCB.changed(() => { showOverrun = overrunCB.checked(); });

  resetBtn = createButton('Reset');
  resetBtn.parent(document.querySelector('main'));
  resetBtn.style('font-size', '13px');
  resetBtn.style('margin', '4px');
  resetBtn.mousePressed(() => {
    selectedPhase = null;
    selectedGate = null;
    showOverrun = false;
    overrunCB.checked(false);
  });
}

function draw() {
  updateCanvasSize();
  trlValue = trlSlider.value();
  background('aliceblue');
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Title
  fill(30); noStroke(); textSize(16); textAlign(CENTER, TOP);
  text('Implementation Phase Gate Dashboard', canvasWidth / 2, 8);

  // TRL indicator (upper right)
  let trlX = canvasWidth - 90;
  let trlY = 30;
  drawTRLIndicator(trlX, trlY, trlValue);

  // TRL slider label
  fill(80); noStroke(); textSize(10); textAlign(LEFT, CENTER);
  text('TRL at Selection: ' + trlValue, 10, 32);

  // Timeline
  let tlY = 60;
  let tlH = 60;
  let tlLeft = 30;
  let tlRight = canvasWidth - 30;
  let tlW = tlRight - tlLeft;
  let totalWeeks = 36;

  // Timeline background
  fill(245); stroke(200); strokeWeight(1);
  rect(tlLeft, tlY, tlW, tlH, 5);

  // Phase blocks
  let weekPositions = [0, 6, 14, 26, 36];
  let statusColors = {
    'completed': color(76, 175, 80),
    'in-progress': color(33, 150, 243),
    'not-started': color(200),
    'blocked': color(244, 67, 54)
  };

  for (let i = 0; i < 4; i++) {
    let x1 = tlLeft + (weekPositions[i] / totalWeeks) * tlW;
    let x2 = tlLeft + (weekPositions[i + 1] / totalWeeks) * tlW;
    let pw = x2 - x1 - 2;
    let isHover = mouseX > x1 && mouseX < x2 && mouseY > tlY && mouseY < tlY + tlH;
    let isSel = selectedPhase === i;

    fill(statusColors[phases[i].status]);
    stroke(isSel ? color(0, 0, 0) : isHover ? color(100) : color(180));
    strokeWeight(isSel ? 3 : 1);
    rect(x1 + 1, tlY + 1, pw, tlH - 2, 3);

    fill(phases[i].status === 'not-started' ? 80 : 255);
    noStroke(); textSize(9); textAlign(CENTER, CENTER);
    text(phases[i].name, x1 + pw / 2 + 1, tlY + 20);
    textSize(7);
    text(phases[i].duration + ' | ' + phases[i].budget, x1 + pw / 2 + 1, tlY + 45);
  }

  // Gate markers
  for (let i = 0; i < 4; i++) {
    let gx = tlLeft + (weekPositions[i + 1] / totalWeeks) * tlW;
    let isGateHover = dist(mouseX, mouseY, gx, tlY + tlH + 15) < 12;
    let isGateSel = selectedGate === i;

    let gateColor = gates[i].decision === 'GO' ? color(76, 175, 80) :
                    gates[i].decision === 'PENDING' ? color(255, 193, 7) : color(200);

    fill(gateColor); stroke(isGateSel ? 0 : 150); strokeWeight(isGateSel ? 3 : 1);
    // Diamond gate marker
    let gy = tlY + tlH + 15;
    beginShape();
    vertex(gx, gy - 10);
    vertex(gx + 10, gy);
    vertex(gx, gy + 10);
    vertex(gx - 10, gy);
    endShape(CLOSE);

    fill(gates[i].decision === 'FUTURE' ? 120 : 255);
    noStroke(); textSize(7); textAlign(CENTER, CENTER);
    text('G' + (i + 1), gx, gy);
  }

  // Cost tracking chart
  let chartY = tlY + tlH + 40;
  let chartH = 140;
  let chartW = tlW;
  let chartL = tlLeft;

  fill(255); stroke(200); strokeWeight(1);
  rect(chartL, chartY, chartW, chartH, 3);

  // Chart title
  fill(80); noStroke(); textSize(10); textAlign(LEFT, TOP);
  text('Cost Tracking ($K)', chartL + 5, chartY + 3);

  // Y-axis
  let maxCost = showOverrun ? 1400 : 1100;
  for (let v = 0; v <= maxCost; v += 200) {
    let y = chartY + chartH - (v / maxCost) * (chartH - 20);
    stroke(240); strokeWeight(0.5);
    line(chartL, y, chartL + chartW, y);
    fill(150); noStroke(); textSize(7); textAlign(RIGHT, CENTER);
    text(v, chartL - 3, y);
  }

  // Projected cost line
  let allProjected = [];
  for (let p of phases) allProjected = allProjected.concat(p.projected);
  stroke(33, 150, 243); strokeWeight(2); noFill();
  beginShape();
  for (let i = 0; i < allProjected.length; i++) {
    let x = chartL + (i / (allProjected.length - 1)) * chartW;
    let y = chartY + chartH - (allProjected[i] / maxCost) * (chartH - 20);
    vertex(x, y);
  }
  endShape();

  // Actual cost line
  let allActual = [];
  for (let p of phases) allActual = allActual.concat(p.actual);
  if (showOverrun) {
    // Add overrun projection
    let lastActual = allActual[allActual.length - 1] || 0;
    let overrunFactor = 1.3;
    for (let i = allActual.length; i < allProjected.length; i++) {
      allActual.push(allProjected[i] * overrunFactor);
    }
  }
  stroke(255, 87, 34); strokeWeight(2); noFill();
  beginShape();
  for (let i = 0; i < allActual.length; i++) {
    let x = chartL + (i / (allProjected.length - 1)) * chartW;
    let y = chartY + chartH - (allActual[i] / maxCost) * (chartH - 20);
    vertex(x, y);
  }
  endShape();

  // Chart legend
  let legY = chartY + chartH + 5;
  fill(33, 150, 243); noStroke();
  rect(chartL + 10, legY, 20, 3);
  fill(80); textSize(8); textAlign(LEFT, CENTER);
  text('Projected', chartL + 35, legY + 2);
  fill(255, 87, 34); noStroke();
  rect(chartL + 100, legY, 20, 3);
  fill(80);
  text('Actual' + (showOverrun ? ' (with overrun)' : ''), chartL + 125, legY + 2);

  // Detail panels
  let detailY = chartY + chartH + 20;
  if (selectedPhase !== null) {
    let p = phases[selectedPhase];
    let panelH = drawHeight - detailY - 10;
    fill(255, 250, 240); stroke(200); strokeWeight(1);
    rect(15, detailY, canvasWidth - 30, panelH, 5);

    fill(30); noStroke(); textSize(12); textAlign(LEFT, TOP);
    textStyle(BOLD);
    text(p.name.replace('\n', ' '), 25, detailY + 8);
    textStyle(NORMAL); textSize(10); fill(50);
    text('Duration: ' + p.duration + '  |  Budget: ' + p.budget + '  |  Status: ' + p.status, 25, detailY + 26);
    text('Deliverables:', 25, detailY + 44);
    textSize(10);
    for (let j = 0; j < p.deliverables.length; j++) {
      text('  ' + (j + 1) + '. ' + p.deliverables[j], 25, detailY + 58 + j * 14);
    }
  } else if (selectedGate !== null) {
    let g = gates[selectedGate];
    let panelH = drawHeight - detailY - 10;
    fill(255, 250, 240); stroke(200); strokeWeight(1);
    rect(15, detailY, canvasWidth - 30, panelH, 5);

    fill(30); noStroke(); textSize(12); textAlign(LEFT, TOP);
    textStyle(BOLD);
    text(g.name, 25, detailY + 8);
    textStyle(NORMAL); textSize(10); fill(50);
    text('Decision: ' + g.decision + '  |  Budget: ' + g.metrics.projected + ' projected, ' + g.metrics.actual + ' actual', 25, detailY + 26);
    text('Gate Criteria:', 25, detailY + 44);
    for (let j = 0; j < g.criteria.length; j++) {
      let passed = g.decision === 'GO';
      fill(passed ? color(76, 175, 80) : 80);
      text((passed ? '[PASS] ' : '[ ] ') + g.criteria[j], 30, detailY + 58 + j * 14);
    }
  }

  // Control region
  fill('white'); stroke('silver'); strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);
  fill(80); noStroke(); textSize(11); textAlign(CENTER, CENTER);
  text('Click phases or gate markers for details. Adjust TRL slider for contingency.', canvasWidth / 2, drawHeight + 20);
}

function drawTRLIndicator(x, y, trl) {
  let h = 60;
  let w = 16;

  // Background
  fill(240); stroke(180); strokeWeight(1);
  rect(x, y, w, h, 4);

  // Fill
  let fillH = (trl / 9) * h;
  let fillColor = trl <= 3 ? color(244, 67, 54) : trl <= 6 ? color(255, 193, 7) : color(76, 175, 80);
  fill(fillColor); noStroke();
  rect(x, y + h - fillH, w, fillH, 0, 0, 4, 4);

  // Label
  fill(30); noStroke(); textSize(12); textAlign(CENTER, CENTER);
  textStyle(BOLD); text(trl, x + w / 2, y + h / 2);
  textStyle(NORMAL); textSize(7); textAlign(CENTER, TOP);
  text('TRL', x + w / 2, y + h + 3);

  // Contingency recommendation
  let contingency = trl <= 4 ? '40-60%' : trl <= 6 ? '20-30%' : '10-15%';
  fill(80); textSize(8); textAlign(LEFT, CENTER);
  text('Contingency:\n' + contingency, x + w + 5, y + h / 2);
}

function mousePressed() {
  let tlY = 60;
  let tlH = 60;
  let tlLeft = 30;
  let tlRight = canvasWidth - 30;
  let tlW = tlRight - tlLeft;
  let totalWeeks = 36;
  let weekPositions = [0, 6, 14, 26, 36];

  // Check phase blocks
  for (let i = 0; i < 4; i++) {
    let x1 = tlLeft + (weekPositions[i] / totalWeeks) * tlW;
    let x2 = tlLeft + (weekPositions[i + 1] / totalWeeks) * tlW;
    if (mouseX > x1 && mouseX < x2 && mouseY > tlY && mouseY < tlY + tlH) {
      selectedPhase = (selectedPhase === i) ? null : i;
      selectedGate = null;
      return;
    }
  }

  // Check gate markers
  for (let i = 0; i < 4; i++) {
    let gx = tlLeft + (weekPositions[i + 1] / totalWeeks) * tlW;
    let gy = tlY + tlH + 15;
    if (dist(mouseX, mouseY, gx, gy) < 15) {
      selectedGate = (selectedGate === i) ? null : i;
      selectedPhase = null;
      return;
    }
  }

  selectedPhase = null;
  selectedGate = null;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
  containerWidth = select('main').width;
  canvasWidth = containerWidth;
}
