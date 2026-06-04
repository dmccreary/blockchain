// Architecture Decision Communication Flow MicroSim
// Chapter 19: Alternative Architectures and Decision Frameworks
let containerWidth;
let canvasWidth = 400;
let drawHeight = 550;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

let scenarios = [
  {name: 'Supply Chain Traceability',
   recommendation: 'Use private blockchain with API gateway',
   arguments: ['Multi-party trust gap requires shared ledger', 'Existing EDI integration feasible', 'Regulatory compliance met'],
   evidence: [['3 case studies show 40% trace time reduction','TCO analysis: 15% premium over centralized'],
              ['API gateway reduces integration cost by 60%','Vendor lock-in risk mitigated by Hyperledger'],
              ['GDPR compliance achieved via off-chain PII','FDA 21 CFR Part 11 requirements met']]},
  {name: 'Payment Settlement',
   recommendation: 'Upgrade existing RTGS with atomic settlement',
   arguments: ['Current system handles volume adequately', 'Blockchain adds latency without proportional benefit', 'Regulatory risk outweighs efficiency gains'],
   evidence: [['Transaction volume analysis: 99.9% uptime achieved','Scaling projections met for 5-year horizon'],
              ['Benchmark: 3-second vs 0.1-second settlement','No trust gap between known counterparties'],
              ['Central bank digital currency timeline uncertain','Compliance cost of DLT: $2M+ annually']]},
  {name: 'Identity Verification',
   recommendation: 'Implement SSI with verifiable credentials',
   arguments: ['User privacy requirements demand decentralization', 'Existing IdP creates single point of failure', 'W3C standards provide interoperability path'],
   evidence: [['GDPR Article 17 compliance requires user control','Privacy impact assessment: high risk with centralized'],
              ['3 outages in 12 months cost $500K each','Vendor dependency score: critical'],
              ['W3C DID/VC standards ratified 2022','Pilot results: 85% user satisfaction']]}
];

let currentScenario = 0;
let expandedSection = null; // 'rec', 'arg0', 'arg1', 'arg2', 'ev0', 'ev1', 'ev2'
let showObjections = false;
let showPreview = false;
let scenarioSelect, objectionBtn, previewBtn;

let objections = [
  {q: 'Why not just use a database?', a: 'Document specific trust gaps that databases cannot address without a trusted intermediary.'},
  {q: 'What about scalability?', a: 'Present benchmark data comparing throughput requirements vs architecture capacity.'},
  {q: 'How do we handle regulatory risk?', a: 'Show regulatory analysis with contingency plans for three scenarios.'},
  {q: 'What is the exit strategy?', a: 'Present modular architecture that allows component replacement without full rebuild.'},
  {q: 'Why is the TCO higher?', a: 'Break down TCO premium by category and show risk-adjusted ROI over 5-year horizon.'}
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  scenarioSelect = createSelect();
  scenarioSelect.parent(document.querySelector('main'));
  for (let s of scenarios) scenarioSelect.option(s.name);
  scenarioSelect.style('font-size', '13px');
  scenarioSelect.style('margin', '4px');
  scenarioSelect.changed(() => {
    currentScenario = scenarios.findIndex(s => s.name === scenarioSelect.value());
    expandedSection = null;
  });

  objectionBtn = createButton('Common Objections');
  objectionBtn.parent(document.querySelector('main'));
  objectionBtn.style('font-size', '13px');
  objectionBtn.style('margin', '4px');
  objectionBtn.mousePressed(() => { showObjections = !showObjections; showPreview = false; });

  previewBtn = createButton('Preview Slides');
  previewBtn.parent(document.querySelector('main'));
  previewBtn.style('font-size', '13px');
  previewBtn.style('margin', '4px');
  previewBtn.mousePressed(() => { showPreview = !showPreview; showObjections = false; });
}

function draw() {
  updateCanvasSize();
  background('aliceblue');
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  let sc = scenarios[currentScenario];

  // Title
  fill(30); noStroke(); textSize(16); textAlign(CENTER, TOP);
  text('Architecture Presentation Builder', canvasWidth / 2, 8);

  // Progress bar
  let completed = 0;
  if (expandedSection === 'rec') completed++;
  for (let i = 0; i < 3; i++) {
    if (expandedSection === 'arg' + i) completed++;
    if (expandedSection === 'ev' + i) completed++;
  }
  let progW = canvasWidth - 60;
  fill(230); stroke(200); strokeWeight(1);
  rect(30, 30, progW, 10, 5);
  fill(76, 175, 80); noStroke();
  rect(30, 30, progW * min(1, completed / 4), 10, 5);
  fill(80); textSize(9); textAlign(RIGHT, CENTER);
  text('Completion', canvasWidth - 35, 35);

  if (showObjections) {
    drawObjectionsPanel();
  } else if (showPreview) {
    drawPreviewPanel(sc);
  } else {
    drawPyramid(sc);
  }

  // Control region
  fill('white'); stroke('silver'); strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);
  fill(80); noStroke(); textSize(11); textAlign(CENTER, CENTER);
  text('Click pyramid sections to expand. Build your presentation bottom-up.', canvasWidth / 2, drawHeight + 20);
}

function drawPyramid(sc) {
  let cx = canvasWidth / 2;
  let pyrTop = 55;
  let pyrBot = 280;
  let pyrW = min(canvasWidth - 60, 500);

  // Tier 1: Recommendation (top)
  let t1Y = pyrTop;
  let t1H = 55;
  let t1W = pyrW * 0.4;
  let t1Hover = mouseX > cx - t1W/2 && mouseX < cx + t1W/2 && mouseY > t1Y && mouseY < t1Y + t1H;
  let t1Color = expandedSection === 'rec' ? color(76, 175, 80) : t1Hover ? color(200, 230, 200) : color(230);
  fill(t1Color); stroke(expandedSection === 'rec' ? color(56, 142, 60) : 180); strokeWeight(2);
  beginShape();
  vertex(cx, t1Y);
  vertex(cx + t1W/2, t1Y + t1H);
  vertex(cx - t1W/2, t1Y + t1H);
  endShape(CLOSE);
  fill(expandedSection === 'rec' ? 255 : 50); noStroke(); textSize(10); textAlign(CENTER, CENTER);
  textStyle(BOLD); text('RECOMMENDATION', cx, t1Y + 20);
  textStyle(NORMAL); textSize(9);
  text(sc.recommendation.substring(0, 35) + '...', cx, t1Y + 38);

  // Tier 2: Arguments (middle)
  let t2Y = t1Y + t1H + 5;
  let t2H = 55;
  let t2Wl = pyrW * 0.25;
  let argSpacing = pyrW * 0.6 / 3;
  for (let i = 0; i < 3; i++) {
    let ax = cx - pyrW * 0.3 + i * argSpacing + argSpacing / 2;
    let aKey = 'arg' + i;
    let aHover = mouseX > ax - t2Wl/2 && mouseX < ax + t2Wl/2 && mouseY > t2Y && mouseY < t2Y + t2H;
    let aColor = expandedSection === aKey ? color(255, 193, 7) : aHover ? color(255, 240, 200) : color(235);
    fill(aColor); stroke(expandedSection === aKey ? color(245, 170, 0) : 180); strokeWeight(1);
    rect(ax - t2Wl/2, t2Y, t2Wl, t2H, 4);
    fill(50); noStroke(); textSize(8); textAlign(CENTER, CENTER);
    textStyle(BOLD); text('ARGUMENT ' + (i + 1), ax, t2Y + 12);
    textStyle(NORMAL); textSize(7);
    text(sc.arguments[i].substring(0, 30) + '...', ax, t2Y + 32, t2Wl - 10, 20);
  }

  // Tier 3: Evidence (base)
  let t3Y = t2Y + t2H + 5;
  let t3H = 50;
  let t3Wl = pyrW * 0.25;
  for (let i = 0; i < 3; i++) {
    let ex = cx - pyrW * 0.3 + i * argSpacing + argSpacing / 2;
    let eKey = 'ev' + i;
    let eHover = mouseX > ex - t3Wl/2 && mouseX < ex + t3Wl/2 && mouseY > t3Y && mouseY < t3Y + t3H;
    let eColor = expandedSection === eKey ? color(33, 150, 243) : eHover ? color(200, 225, 250) : color(240);
    fill(eColor); stroke(expandedSection === eKey ? color(25, 118, 210) : 180); strokeWeight(1);
    rect(ex - t3Wl/2, t3Y, t3Wl, t3H, 4);
    fill(50); noStroke(); textSize(8); textAlign(CENTER, CENTER);
    textStyle(BOLD); text('EVIDENCE ' + (i + 1), ex, t3Y + 12);
    textStyle(NORMAL); textSize(7);
    text(sc.evidence[i][0].substring(0, 28) + '...', ex, t3Y + 30, t3Wl - 10, 18);
  }

  // Pyramid outline
  noFill(); stroke(100, 100, 100, 50); strokeWeight(1);
  beginShape();
  vertex(cx, pyrTop);
  vertex(cx + pyrW/2, pyrBot);
  vertex(cx - pyrW/2, pyrBot);
  endShape(CLOSE);

  // Tier labels
  fill(150); noStroke(); textSize(9); textAlign(RIGHT, CENTER);
  text('Key\nMessage', cx - pyrW/2 - 8, t1Y + t1H/2);
  text('Supporting\nArguments', cx - pyrW/2 - 8, t2Y + t2H/2);
  text('Evidence\nBase', cx - pyrW/2 - 8, t3Y + t3H/2);

  // Expanded detail panel
  if (expandedSection) {
    let panelY = t3Y + t3H + 15;
    let panelH = drawHeight - panelY - 10;
    fill(255, 250, 240); stroke(200); strokeWeight(1);
    rect(15, panelY, canvasWidth - 30, panelH, 5);

    fill(30); noStroke(); textSize(12); textAlign(LEFT, TOP);
    textStyle(BOLD);

    if (expandedSection === 'rec') {
      text('Recommendation', 25, panelY + 8);
      textStyle(NORMAL); textSize(11); fill(50);
      text(sc.recommendation, 25, panelY + 28, canvasWidth - 60, panelH - 35);
    } else if (expandedSection.startsWith('arg')) {
      let idx = parseInt(expandedSection[3]);
      text('Argument ' + (idx + 1), 25, panelY + 8);
      textStyle(NORMAL); textSize(11); fill(50);
      text(sc.arguments[idx], 25, panelY + 28, canvasWidth - 60, panelH - 35);
    } else if (expandedSection.startsWith('ev')) {
      let idx = parseInt(expandedSection[2]);
      text('Evidence for Argument ' + (idx + 1), 25, panelY + 8);
      textStyle(NORMAL); textSize(10); fill(50);
      let yy = panelY + 28;
      for (let e of sc.evidence[idx]) {
        text('• ' + e, 25, yy, canvasWidth - 60, 30);
        yy += 22;
      }
    }
  }
}

function drawObjectionsPanel() {
  let panelY = 55;
  fill(255, 250, 240); stroke(200); strokeWeight(1);
  rect(15, panelY, canvasWidth - 30, drawHeight - panelY - 10, 5);

  fill(30); noStroke(); textSize(14); textAlign(LEFT, TOP);
  textStyle(BOLD);
  text('Common Management Objections', 25, panelY + 10);
  textStyle(NORMAL);

  let yy = panelY + 35;
  for (let obj of objections) {
    fill(244, 67, 54); textSize(11); textStyle(BOLD);
    text('Q: ' + obj.q, 25, yy, canvasWidth - 60, 20);
    yy += 20;
    fill(76, 175, 80); textStyle(NORMAL); textSize(10);
    text('A: ' + obj.a, 35, yy, canvasWidth - 80, 35);
    yy += 40;
    stroke(230); strokeWeight(0.5);
    line(30, yy, canvasWidth - 30, yy);
    noStroke();
    yy += 8;
  }
}

function drawPreviewPanel(sc) {
  let slideW = (canvasWidth - 80) / 3;
  let slideH = slideW * 0.75;
  let startY = 60;

  fill(30); noStroke(); textSize(12); textAlign(CENTER, TOP);
  text('Slide Preview', canvasWidth / 2, 45);

  // Slide 1: Title + Recommendation
  drawMiniSlide(30, startY, slideW, slideH, 'Recommendation', sc.recommendation, color(76, 175, 80));

  // Slide 2: Arguments
  drawMiniSlide(40 + slideW, startY, slideW, slideH, 'Key Arguments', sc.arguments.join('\n• '), color(255, 193, 7));

  // Slide 3: Evidence
  let evText = sc.evidence.map((e, i) => 'Arg ' + (i+1) + ': ' + e[0]).join('\n');
  drawMiniSlide(50 + slideW * 2, startY, slideW, slideH, 'Evidence Base', evText, color(33, 150, 243));

  // Second row
  let row2Y = startY + slideH + 20;
  drawMiniSlide(30, row2Y, slideW, slideH, 'Risk Analysis', 'Sensitivity points\nTradeoff summary\nMitigation plan', color(156, 39, 176));
  drawMiniSlide(40 + slideW, row2Y, slideW, slideH, 'TCO Comparison', '5-year projections\nRisk-adjusted costs\nBreak-even analysis', color(244, 67, 54));
  drawMiniSlide(50 + slideW * 2, row2Y, slideW, slideH, 'Next Steps', 'Phase 1 timeline\nResource needs\nSuccess metrics', color(33, 150, 243));
}

function drawMiniSlide(x, y, w, h, title, content, c) {
  fill(255); stroke(180); strokeWeight(1);
  rect(x, y, w, h, 3);
  // Title bar
  fill(c); noStroke();
  rect(x, y, w, 18, 3, 3, 0, 0);
  fill(255); textSize(8); textAlign(CENTER, CENTER);
  textStyle(BOLD); text(title, x + w/2, y + 9);
  textStyle(NORMAL);
  fill(50); textSize(6); textAlign(LEFT, TOP);
  text(content, x + 5, y + 22, w - 10, h - 25);
}

function mousePressed() {
  if (showObjections || showPreview) return;

  let sc = scenarios[currentScenario];
  let cx = canvasWidth / 2;
  let pyrW = min(canvasWidth - 60, 500);
  let pyrTop = 55;
  let t1H = 55, t2H = 55, t3H = 50;
  let t1Y = pyrTop, t2Y = t1Y + t1H + 5, t3Y = t2Y + t2H + 5;
  let t1W = pyrW * 0.4;
  let argSpacing = pyrW * 0.6 / 3;
  let t2Wl = pyrW * 0.25;

  // Check recommendation
  if (mouseX > cx - t1W/2 && mouseX < cx + t1W/2 && mouseY > t1Y && mouseY < t1Y + t1H) {
    expandedSection = expandedSection === 'rec' ? null : 'rec';
    return;
  }

  // Check arguments and evidence
  for (let i = 0; i < 3; i++) {
    let ax = cx - pyrW * 0.3 + i * argSpacing + argSpacing / 2;
    if (mouseX > ax - t2Wl/2 && mouseX < ax + t2Wl/2) {
      if (mouseY > t2Y && mouseY < t2Y + t2H) {
        let key = 'arg' + i;
        expandedSection = expandedSection === key ? null : key;
        return;
      }
      if (mouseY > t3Y && mouseY < t3Y + t3H) {
        let key = 'ev' + i;
        expandedSection = expandedSection === key ? null : key;
        return;
      }
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
