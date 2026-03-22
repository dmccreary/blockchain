// Capstone Project Workflow MicroSim
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

let deliverables = [
  {id:0, name:'Problem\nAnalysis', chapters:'Ch 1-4', status:'not-started', color:[33,150,243],
   requirements:['Identify trust problem','Map stakeholders','Define success metrics','Document constraints and assumptions'],
   frameworks:['Trust gap analysis','Stakeholder mapping','SMART criteria'],
   weeks:[1,2,3]},
  {id:1, name:'Technology\nAssessment', chapters:'Ch 5-9', status:'not-started', color:[76,175,80],
   requirements:['Evaluate blockchain platforms','Assess consensus mechanisms','Analyze cryptographic requirements','Compare with alternatives'],
   frameworks:['TRL assessment','Platform comparison matrix','Consensus tradeoff analysis'],
   weeks:[3,4,5]},
  {id:2, name:'Architecture\nEvaluation', chapters:'Ch 10-12', status:'not-started', color:[255,152,0],
   requirements:['Build utility tree','Conduct ATAM analysis','Calculate TCO for 3 options','Identify sensitivity points'],
   frameworks:['ATAM method','Utility tree builder','TCO calculator','Risk theme analysis'],
   weeks:[5,6,7,8]},
  {id:3, name:'Bias\nAudit', chapters:'Ch 15', status:'not-started', color:[156,39,176],
   requirements:['Apply 12-bias checklist','Conduct pre-mortem analysis','Document debiasing actions','Get external review'],
   frameworks:['Bias checklist','Pre-mortem protocol','Red team review','Devil\'s advocate'],
   weeks:[8,9]},
  {id:4, name:'Implementation\nPlan', chapters:'Ch 16-19', status:'not-started', color:[244,67,54],
   requirements:['Design phase gate roadmap','Build management presentation','Address top 5 objections','Define rollback criteria'],
   frameworks:['Phase gate template','Pyramid principle','Objection handling matrix'],
   weeks:[9,10,11]},
  {id:5, name:'Final\nPresentation', chapters:'All', status:'not-started', color:[0,150,136],
   requirements:['Executive summary (1 page)','Full technical report','Slide deck (15 min)','Risk register with mitigations'],
   frameworks:['Pyramid presentation','Evidence hierarchy','TCO summary','Decision flowchart'],
   weeks:[11,12,13]}
];

// Dependencies: [from, to]
let dependencies = [[0,1],[1,2],[2,3],[3,4],[4,5],[0,2],[2,4]];

let selectedNode = null;
let hoveredNode = null;
let viewMode = 'workflow'; // 'workflow' or 'timeline'
let showChecklist = false;
let timelineBtn, checklistBtn, resetBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  timelineBtn = createButton('Timeline View');
  timelineBtn.parent(document.querySelector('main'));
  timelineBtn.style('font-size', '13px');
  timelineBtn.style('margin', '4px');
  timelineBtn.mousePressed(() => {
    viewMode = viewMode === 'workflow' ? 'timeline' : 'workflow';
    timelineBtn.html(viewMode === 'workflow' ? 'Timeline View' : 'Workflow View');
  });

  checklistBtn = createButton('Checklist');
  checklistBtn.parent(document.querySelector('main'));
  checklistBtn.style('font-size', '13px');
  checklistBtn.style('margin', '4px');
  checklistBtn.mousePressed(() => { showChecklist = !showChecklist; });

  resetBtn = createButton('Reset Progress');
  resetBtn.parent(document.querySelector('main'));
  resetBtn.style('font-size', '13px');
  resetBtn.style('margin', '4px');
  resetBtn.mousePressed(() => {
    for (let d of deliverables) d.status = 'not-started';
    selectedNode = null;
  });
}

function getHexPos(i) {
  // Arrange 6 hexagons in a 2-row layout
  let cx = canvasWidth / 2;
  let cy = 200;
  let spacingX = min(140, (canvasWidth - 80) / 3);
  let spacingY = 110;
  let positions = [
    {x: cx - spacingX, y: cy - spacingY / 2},
    {x: cx, y: cy - spacingY / 2},
    {x: cx + spacingX, y: cy - spacingY / 2},
    {x: cx - spacingX / 2, y: cy + spacingY / 2},
    {x: cx + spacingX / 2, y: cy + spacingY / 2},
    {x: cx, y: cy + spacingY * 1.1}
  ];
  return positions[i];
}

function drawHexagon(cx, cy, r) {
  beginShape();
  for (let a = 0; a < 6; a++) {
    let angle = -HALF_PI + (TWO_PI / 6) * a;
    vertex(cx + cos(angle) * r, cy + sin(angle) * r);
  }
  endShape(CLOSE);
}

function isInsideHex(mx, my, cx, cy, r) {
  return dist(mx, my, cx, cy) < r * 0.9;
}

function draw() {
  updateCanvasSize();
  background('aliceblue');
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Title
  fill(30); noStroke(); textSize(16); textAlign(CENTER, TOP);
  text('Capstone Project Tracker', canvasWidth / 2, 8);

  // Progress bar
  let completed = deliverables.filter(d => d.status === 'completed').length;
  let inProgress = deliverables.filter(d => d.status === 'in-progress').length;
  let progW = canvasWidth - 60;
  fill(230); stroke(200); strokeWeight(1);
  rect(30, 30, progW, 14, 7);
  if (completed > 0) {
    fill(76, 175, 80); noStroke();
    rect(30, 30, progW * (completed / 6), 14, 7, 0, 0, 7);
  }
  if (inProgress > 0) {
    fill(33, 150, 243, 150); noStroke();
    rect(30 + progW * (completed / 6), 30, progW * (inProgress / 6), 14);
  }
  fill(50); noStroke(); textSize(9); textAlign(CENTER, CENTER);
  text(Math.round((completed / 6) * 100) + '% Complete  (' + completed + '/6 deliverables)', 30 + progW / 2, 37);

  if (viewMode === 'workflow') {
    drawWorkflowView();
  } else {
    drawTimelineView();
  }

  // Control region
  fill('white'); stroke('silver'); strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);
  fill(80); noStroke(); textSize(11); textAlign(CENTER, CENTER);
  text('Click hexagons to view details. Click status to toggle completion.', canvasWidth / 2, drawHeight + 20);
}

function drawWorkflowView() {
  let hexR = min(48, (canvasWidth - 100) / 6);

  // Draw dependency arrows
  for (let dep of dependencies) {
    let p1 = getHexPos(dep[0]);
    let p2 = getHexPos(dep[1]);
    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;
    let d = sqrt(dx * dx + dy * dy);
    let nx = dx / d, ny = dy / d;
    let ax = p1.x + nx * (hexR + 5);
    let ay = p1.y + ny * (hexR + 5);
    let bx = p2.x - nx * (hexR + 5);
    let by = p2.y - ny * (hexR + 5);

    stroke(180); strokeWeight(1.5);
    line(ax, ay, bx, by);

    // Arrowhead
    let ang = atan2(by - ay, bx - ax);
    fill(180); noStroke();
    triangle(bx, by, bx - 7 * cos(ang - 0.4), by - 7 * sin(ang - 0.4),
             bx - 7 * cos(ang + 0.4), by - 7 * sin(ang + 0.4));
  }

  // Draw hexagonal nodes
  hoveredNode = null;
  for (let i = 0; i < 6; i++) {
    let d = deliverables[i];
    let p = getHexPos(i);
    let isHover = isInsideHex(mouseX, mouseY, p.x, p.y, hexR);
    if (isHover) hoveredNode = i;
    let isSel = selectedNode === i;

    let statusColor = d.status === 'completed' ? color(76, 175, 80) :
                      d.status === 'in-progress' ? color(33, 150, 243) :
                      color(220);

    fill(red(statusColor), green(statusColor), blue(statusColor), isSel ? 220 : isHover ? 180 : 120);
    stroke(isSel ? 0 : isHover ? color(d.color[0], d.color[1], d.color[2]) : 150);
    strokeWeight(isSel ? 3 : isHover ? 2 : 1);
    drawHexagon(p.x, p.y, hexR);

    // Node content
    fill(d.status === 'completed' ? 255 : 40);
    noStroke(); textSize(9); textAlign(CENTER, CENTER);
    textStyle(BOLD);
    text(d.name, p.x, p.y - 8);
    textStyle(NORMAL); textSize(7);
    fill(d.status === 'completed' ? 230 : 100);
    text(d.chapters, p.x, p.y + 14);

    // Status indicator
    if (d.status === 'completed') {
      fill(255); textSize(14);
      text('✓', p.x + hexR - 12, p.y - hexR + 12);
    }
  }

  // Detail panel
  if (selectedNode !== null) {
    drawDetailPanel(selectedNode);
  }

  // Checklist overlay
  if (showChecklist) {
    drawChecklistPanel();
  }
}

function drawTimelineView() {
  let tlLeft = 60;
  let tlRight = canvasWidth - 20;
  let tlW = tlRight - tlLeft;
  let tlTop = 60;
  let rowH = 55;
  let totalWeeks = 13;

  // Week headers
  fill(80); noStroke(); textSize(8); textAlign(CENTER, CENTER);
  for (let w = 1; w <= 13; w++) {
    let x = tlLeft + ((w - 0.5) / totalWeeks) * tlW;
    text('W' + w, x, tlTop - 8);
  }

  // Week grid lines
  for (let w = 0; w <= 13; w++) {
    let x = tlLeft + (w / totalWeeks) * tlW;
    stroke(230); strokeWeight(0.5);
    line(x, tlTop, x, tlTop + 6 * rowH);
  }

  // Deliverable rows
  hoveredNode = null;
  for (let i = 0; i < 6; i++) {
    let d = deliverables[i];
    let ry = tlTop + i * rowH;

    // Row background
    fill(i % 2 === 0 ? 248 : 255); noStroke();
    rect(tlLeft, ry, tlW, rowH);

    // Row label
    fill(50); textSize(9); textAlign(RIGHT, CENTER);
    text(d.name.replace('\n', ' '), tlLeft - 5, ry + rowH / 2);

    // Week blocks
    let statusColor = d.status === 'completed' ? color(76, 175, 80) :
                      d.status === 'in-progress' ? color(33, 150, 243) :
                      color(d.color[0], d.color[1], d.color[2], 100);

    for (let w of d.weeks) {
      let wx = tlLeft + ((w - 1) / totalWeeks) * tlW;
      let ww = tlW / totalWeeks;
      let isHover = mouseX > wx && mouseX < wx + ww && mouseY > ry && mouseY < ry + rowH;
      if (isHover) hoveredNode = i;

      fill(statusColor);
      stroke(d.status === 'not-started' ? 180 : color(d.color[0], d.color[1], d.color[2]));
      strokeWeight(1);
      rect(wx + 1, ry + 8, ww - 2, rowH - 16, 3);
    }
  }

  // Detail panel
  if (selectedNode !== null) {
    drawDetailPanel(selectedNode);
  }
}

function drawDetailPanel(idx) {
  let d = deliverables[idx];
  let panelY = 370;
  let panelH = drawHeight - panelY - 10;

  fill(255, 250, 240); stroke(200); strokeWeight(1);
  rect(15, panelY, canvasWidth - 30, panelH, 5);

  fill(d.color[0], d.color[1], d.color[2]);
  noStroke(); textSize(13); textAlign(LEFT, TOP);
  textStyle(BOLD);
  text(d.name.replace('\n', ' ') + ' (' + d.chapters + ')', 25, panelY + 8);
  textStyle(NORMAL);

  // Status toggle button
  let btnX = canvasWidth - 130;
  let btnY = panelY + 5;
  let statusColors = {'not-started': color(200), 'in-progress': color(33, 150, 243), 'completed': color(76, 175, 80)};
  fill(statusColors[d.status]); stroke(150); strokeWeight(1);
  rect(btnX, btnY, 100, 22, 4);
  fill(d.status === 'not-started' ? 80 : 255); noStroke(); textSize(9); textAlign(CENTER, CENTER);
  text(d.status.toUpperCase(), btnX + 50, btnY + 11);

  // Requirements
  fill(50); textSize(10); textAlign(LEFT, TOP);
  textStyle(BOLD); text('Requirements:', 25, panelY + 30);
  textStyle(NORMAL); textSize(9);
  let yy = panelY + 44;
  for (let r of d.requirements) {
    let checked = d.status === 'completed';
    text((checked ? '[x] ' : '[ ] ') + r, 30, yy);
    yy += 13;
  }

  // Frameworks
  yy += 5;
  textStyle(BOLD); textSize(10);
  text('Frameworks & Tools:', 25, yy);
  textStyle(NORMAL); textSize(9);
  yy += 14;
  for (let f of d.frameworks) {
    text('- ' + f, 30, yy);
    yy += 13;
  }

  // Schedule
  fill(100); textSize(9);
  text('Weeks: ' + d.weeks.join(', '), 25, yy + 5);
}

function drawChecklistPanel() {
  let panelY = 60;
  let panelH = drawHeight - panelY - 70;
  fill(255, 255, 255, 240); stroke(200); strokeWeight(1);
  rect(15, panelY, canvasWidth - 30, panelH, 5);

  fill(30); noStroke(); textSize(14); textAlign(LEFT, TOP);
  textStyle(BOLD);
  text('Complete Checklist', 25, panelY + 8);
  textStyle(NORMAL); textSize(9);

  let yy = panelY + 30;
  for (let d of deliverables) {
    fill(d.color[0], d.color[1], d.color[2]);
    textStyle(BOLD); textSize(10);
    text(d.name.replace('\n', ' '), 25, yy);
    textStyle(NORMAL); textSize(9); fill(50);
    yy += 14;
    for (let r of d.requirements) {
      let checked = d.status === 'completed';
      text((checked ? '[x] ' : '[ ] ') + r, 35, yy);
      yy += 12;
    }
    yy += 6;
    if (yy > panelY + panelH - 20) break;
  }
}

function mousePressed() {
  // Check status toggle button in detail panel
  if (selectedNode !== null) {
    let btnX = canvasWidth - 130;
    let btnY = 375;
    if (mouseX > btnX && mouseX < btnX + 100 && mouseY > btnY && mouseY < btnY + 22) {
      let d = deliverables[selectedNode];
      if (d.status === 'not-started') d.status = 'in-progress';
      else if (d.status === 'in-progress') d.status = 'completed';
      else d.status = 'not-started';
      return;
    }
  }

  if (viewMode === 'workflow') {
    let hexR = min(48, (canvasWidth - 100) / 6);
    for (let i = 0; i < 6; i++) {
      let p = getHexPos(i);
      if (isInsideHex(mouseX, mouseY, p.x, p.y, hexR)) {
        selectedNode = (selectedNode === i) ? null : i;
        showChecklist = false;
        return;
      }
    }
  } else {
    // Timeline view row clicks
    let tlTop = 60;
    let rowH = 55;
    for (let i = 0; i < 6; i++) {
      let ry = tlTop + i * rowH;
      if (mouseY > ry && mouseY < ry + rowH && mouseX > 60) {
        selectedNode = (selectedNode === i) ? null : i;
        showChecklist = false;
        return;
      }
    }
  }
  if (mouseY < 350) selectedNode = null;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
  containerWidth = select('main').width;
  canvasWidth = containerWidth;
}
