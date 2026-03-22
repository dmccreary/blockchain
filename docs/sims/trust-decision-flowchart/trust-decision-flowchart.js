// Trust Architecture Decision Flowchart MicroSim
// Chapter 16: Evidence-Based Evaluation
let containerWidth;
let canvasWidth = 400;
let drawHeight = 600;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

// Decision tree nodes
let nodes = [
  {id:0, type:'decision', q:'Do multiple parties need to\nwrite shared data?', yes:1, no:8},
  {id:1, type:'decision', q:'Do these parties trust\neach other?', yes:7, no:2},
  {id:2, type:'decision', q:'Is a trusted intermediary\nacceptable?', yes:9, no:3},
  {id:3, type:'decision', q:'Do you need public\nverifiability?', yes:4, no:5},
  {id:4, type:'terminal', label:'Public Blockchain', reason:'Multiple untrusted writers need public verification.', complexity:'high'},
  {id:5, type:'decision', q:'Is the participant set\nknown and stable?', yes:6, no:4},
  {id:6, type:'terminal', label:'Consortium Blockchain', reason:'Known participants, no single trusted party, private verification.', complexity:'medium'},
  {id:7, type:'terminal', label:'Shared Database', reason:'Trusted parties can share a conventional database.', complexity:'low'},
  {id:8, type:'terminal', label:'Centralized Database', reason:'Single writer needs only a standard database.', complexity:'low'},
  {id:9, type:'terminal', label:'Trusted Third Party\n+ Database', reason:'Intermediary handles trust; blockchain adds no value.', complexity:'low'}
];

let currentNode = 0;
let pathHistory = [];
let showAllPaths = false;
let animProgress = 1;
let startOverBtn, showAllBtn;

let complexityColors;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');
  complexityColors = {
    low: color(76, 175, 80),
    medium: color(255, 193, 7),
    high: color(255, 87, 34)
  };

  startOverBtn = createButton('Start Over');
  startOverBtn.parent(document.querySelector('main'));
  startOverBtn.style('font-size', '13px');
  startOverBtn.style('margin', '4px');
  startOverBtn.mousePressed(() => {
    currentNode = 0;
    pathHistory = [];
    animProgress = 1;
    showAllPaths = false;
  });

  showAllBtn = createButton('Show All Paths');
  showAllBtn.parent(document.querySelector('main'));
  showAllBtn.style('font-size', '13px');
  showAllBtn.style('margin', '4px');
  showAllBtn.mousePressed(() => {
    showAllPaths = !showAllPaths;
    showAllBtn.html(showAllPaths ? 'Hide All Paths' : 'Show All Paths');
  });
}

function draw() {
  updateCanvasSize();
  background('aliceblue');
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Title
  fill(30); noStroke(); textSize(16); textAlign(CENTER, TOP);
  text('Trust Architecture Decision Flowchart', canvasWidth / 2, 8);

  if (showAllPaths) {
    drawFullTree();
  } else {
    drawCurrentNode();
    drawSidebar();
  }

  // Control region
  fill('white'); stroke('silver'); strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);
  fill(80); noStroke(); textSize(11); textAlign(CENTER, CENTER);
  text('Answer Yes/No at each decision point to find the right architecture.', canvasWidth / 2, drawHeight + 20);
}

function drawCurrentNode() {
  let node = nodes[currentNode];
  let cx = canvasWidth * 0.45;
  let cy = 200;

  if (node.type === 'decision') {
    // Diamond
    let w = 220, h = 100;
    fill(230, 240, 255); stroke(70, 130, 180); strokeWeight(2);
    beginShape();
    vertex(cx, cy - h/2);
    vertex(cx + w/2, cy);
    vertex(cx, cy + h/2);
    vertex(cx - w/2, cy);
    endShape(CLOSE);

    fill(30); noStroke(); textSize(13); textAlign(CENTER, CENTER);
    text(node.q, cx, cy);

    // Step number
    fill(70, 130, 180); textSize(10); textAlign(CENTER, BOTTOM);
    text('Question ' + (pathHistory.length + 1), cx, cy - h/2 - 5);

    // Yes/No buttons drawn as clickable areas
    let btnW = 80, btnH = 36;
    let yesX = cx - 70, noX = cx + 70;
    let btnY = cy + 90;

    // Yes button
    let yesHover = mouseX > yesX - btnW/2 && mouseX < yesX + btnW/2 && mouseY > btnY - btnH/2 && mouseY < btnY + btnH/2;
    fill(yesHover ? color(56, 142, 60) : color(76, 175, 80));
    stroke(56, 142, 60); strokeWeight(1);
    rect(yesX - btnW/2, btnY - btnH/2, btnW, btnH, 8);
    fill(255); noStroke(); textSize(15); textAlign(CENTER, CENTER);
    text('Yes', yesX, btnY);

    // No button
    let noHover = mouseX > noX - btnW/2 && mouseX < noX + btnW/2 && mouseY > btnY - btnH/2 && mouseY < btnY + btnH/2;
    fill(noHover ? color(211, 47, 47) : color(244, 67, 54));
    stroke(211, 47, 47); strokeWeight(1);
    rect(noX - btnW/2, btnY - btnH/2, btnW, btnH, 8);
    fill(255); noStroke(); textSize(15); textAlign(CENTER, CENTER);
    text('No', noX, btnY);

    // Arrows from diamond to buttons
    stroke(150); strokeWeight(1);
    line(cx - 30, cy + 50, yesX, btnY - btnH/2);
    line(cx + 30, cy + 50, noX, btnY - btnH/2);
    fill(76, 175, 80); noStroke(); textSize(10);
    text('Yes', cx - 55, cy + 65);
    fill(244, 67, 54);
    text('No', cx + 55, cy + 65);

  } else {
    // Terminal node - rectangle
    let w = 260, h = 80;
    let cc = complexityColors[node.complexity];
    fill(red(cc), green(cc), blue(cc), 40);
    stroke(cc); strokeWeight(3);
    rect(cx - w/2, cy - h/2, w, h, 10);

    fill(30); noStroke(); textSize(16); textAlign(CENTER, CENTER);
    textStyle(BOLD);
    text(node.label, cx, cy - 10);
    textStyle(NORMAL); textSize(11);
    text('Recommended Architecture', cx, cy + 15);

    // Reason panel
    fill(255, 250, 240); stroke(200); strokeWeight(1);
    rect(cx - 150, cy + 60, 300, 60, 5);
    fill(50); noStroke(); textSize(11); textAlign(CENTER, TOP);
    text(node.reason, cx, cy + 70, 280, 50);

    // Complexity badge
    fill(cc); noStroke();
    rect(cx - 40, cy + 130, 80, 24, 12);
    fill(255); textSize(10); textAlign(CENTER, CENTER);
    text(node.complexity.toUpperCase() + ' complexity', cx, cy + 142);
  }
}

function drawSidebar() {
  let sbX = canvasWidth - 180;
  let sbY = 380;
  let sbW = 170;
  let sbH = drawHeight - sbY - 10;

  fill(245, 248, 255); stroke(200); strokeWeight(1);
  rect(sbX, sbY, sbW, sbH, 5);

  fill(30); noStroke(); textSize(12); textAlign(LEFT, TOP);
  textStyle(BOLD);
  text('Decision Path', sbX + 10, sbY + 8);
  textStyle(NORMAL); textSize(10);

  let yy = sbY + 28;
  for (let i = 0; i < pathHistory.length; i++) {
    let h = pathHistory[i];
    let q = nodes[h.nodeId].q.replace('\n', ' ');
    if (q.length > 25) q = q.substring(0, 25) + '...';
    fill(h.answer === 'Yes' ? color(76, 175, 80) : color(244, 67, 54));
    text((i + 1) + '. ' + h.answer + ': ' + q, sbX + 10, yy, sbW - 20, 30);
    yy += 28;
  }

  if (pathHistory.length === 0) {
    fill(150); textSize(10);
    text('Answer questions to\nbuild your decision path.', sbX + 10, yy);
  }
}

function drawFullTree() {
  // Simplified tree view
  let positions = {};
  let levels = [[0], [1, 8], [7, 2, null, null], [9, 3, null, null], [null, 4, 5, null], [null, null, 6, null]];

  textSize(9); textAlign(CENTER, CENTER);
  let yStep = 80;
  let startY = 50;

  // BFS layout
  let queue = [{id: 0, x: canvasWidth / 2, y: startY, level: 0}];
  let drawn = new Set();

  while (queue.length > 0) {
    let item = queue.shift();
    if (drawn.has(item.id)) continue;
    drawn.add(item.id);
    let node = nodes[item.id];
    positions[item.id] = {x: item.x, y: item.y};

    if (node.type === 'decision') {
      let spread = max(60, (canvasWidth * 0.4) / (item.level + 1));
      // Draw diamond
      fill(230, 240, 255); stroke(100); strokeWeight(1);
      let s = 30;
      beginShape();
      vertex(item.x, item.y - s);
      vertex(item.x + s * 1.5, item.y);
      vertex(item.x, item.y + s);
      vertex(item.x - s * 1.5, item.y);
      endShape(CLOSE);
      fill(30); noStroke(); textSize(7);
      text(node.q.replace('\n', ' ').substring(0, 30), item.x, item.y);

      if (node.yes !== undefined && !drawn.has(node.yes)) {
        queue.push({id: node.yes, x: item.x - spread, y: item.y + yStep, level: item.level + 1});
      }
      if (node.no !== undefined && !drawn.has(node.no)) {
        queue.push({id: node.no, x: item.x + spread, y: item.y + yStep, level: item.level + 1});
      }
    } else {
      let cc = complexityColors[node.complexity];
      fill(red(cc), green(cc), blue(cc), 80);
      stroke(cc); strokeWeight(2);
      rect(item.x - 45, item.y - 15, 90, 30, 5);
      fill(30); noStroke(); textSize(8);
      text(node.label.replace('\n', ' '), item.x, item.y);
    }
  }

  // Draw edges
  for (let node of nodes) {
    if (node.type !== 'decision') continue;
    let p = positions[node.id];
    if (!p) continue;
    if (node.yes !== undefined && positions[node.yes]) {
      stroke(76, 175, 80); strokeWeight(1);
      line(p.x, p.y + 30, positions[node.yes].x, positions[node.yes].y - 15);
      fill(76, 175, 80); noStroke(); textSize(7);
      text('Y', (p.x + positions[node.yes].x) / 2 - 8, (p.y + positions[node.yes].y) / 2);
    }
    if (node.no !== undefined && positions[node.no]) {
      stroke(244, 67, 54); strokeWeight(1);
      line(p.x, p.y + 30, positions[node.no].x, positions[node.no].y - 15);
      fill(244, 67, 54); noStroke(); textSize(7);
      text('N', (p.x + positions[node.no].x) / 2 + 8, (p.y + positions[node.no].y) / 2);
    }
  }
}

function mousePressed() {
  let node = nodes[currentNode];
  if (showAllPaths || node.type !== 'decision') return;

  let cx = canvasWidth * 0.45;
  let cy = 200;
  let btnW = 80, btnH = 36;
  let yesX = cx - 70, noX = cx + 70;
  let btnY = cy + 90;

  if (mouseX > yesX - btnW/2 && mouseX < yesX + btnW/2 && mouseY > btnY - btnH/2 && mouseY < btnY + btnH/2) {
    pathHistory.push({nodeId: currentNode, answer: 'Yes'});
    currentNode = node.yes;
  } else if (mouseX > noX - btnW/2 && mouseX < noX + btnW/2 && mouseY > btnY - btnH/2 && mouseY < btnY + btnH/2) {
    pathHistory.push({nodeId: currentNode, answer: 'No'});
    currentNode = node.no;
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
