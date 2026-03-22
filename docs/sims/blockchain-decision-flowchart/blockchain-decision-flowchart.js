// Blockchain Decision Flowchart MicroSim
// Interactive flowchart: "Should you use blockchain?"
let containerWidth;
let canvasWidth = 400;
let drawHeight = 480;
let controlHeight = 70;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

let resetBtn, scenarioSel;
let currentNode = 0;
let path = [];
let hoveredNode = -1;

let nodes = [
  { id: 0, type: 'decision', q: 'Do multiple parties\nneed write access?', y: 0, yes: 1, no: 'db' },
  { id: 1, type: 'decision', q: 'Do you need a\ntrusted third party?', y: 1, yes: 'db', no: 2 },
  { id: 2, type: 'decision', q: 'Do all writers\ntrust each other?', y: 2, yes: 'private', no: 3 },
  { id: 3, type: 'decision', q: 'Is public\nverifiability needed?', y: 3, yes: 'public', no: 4 },
  { id: 4, type: 'decision', q: 'Need high\nthroughput (>1K TPS)?', y: 4, yes: 'consortium', no: 'public' }
];

let outcomes = {
  db: { label: 'Use a Database', color: '#78909C', reason: 'A traditional database is simpler, faster, and cheaper for your use case.' },
  private: { label: 'Private Blockchain', color: '#7B1FA2', reason: 'Trusted writers can use a private chain for shared record-keeping.' },
  consortium: { label: 'Consortium Blockchain', color: '#1565C0', reason: 'A consortium chain provides shared governance with high throughput.' },
  public: { label: 'Public Blockchain', color: '#E53935', reason: 'Public blockchain provides maximum transparency and trustlessness.' }
};

let scenarios = {
  'Hospital Records': [true, false, true],
  'Supply Chain': [true, false, false, false, true],
  'Cryptocurrency': [true, false, false, true],
  'Voting System': [true, false, false, true],
  'Company Ledger': [false]
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));

  resetBtn = createButton('Reset');
  resetBtn.parent(document.querySelector('main'));
  resetBtn.mousePressed(resetFlow);

  scenarioSel = createSelect();
  scenarioSel.parent(document.querySelector('main'));
  scenarioSel.option('-- Scenario --');
  for (let s in scenarios) scenarioSel.option(s);
  scenarioSel.changed(loadScenario);

  describe('Interactive decision flowchart for determining whether to use blockchain.');
}

function resetFlow() {
  currentNode = 0;
  path = [];
  scenarioSel.selected('-- Scenario --');
}

function loadScenario() {
  let name = scenarioSel.value();
  if (name === '-- Scenario --') return;
  resetFlow();
  let steps = scenarios[name];
  for (let ans of steps) {
    if (currentNode < 0) break;
    let node = nodes[currentNode];
    path.push({ nodeId: currentNode, answer: ans });
    let next = ans ? node.yes : node.no;
    if (typeof next === 'string') { currentNode = -1; break; }
    currentNode = next;
  }
}

function getOutcome() {
  if (path.length === 0) return null;
  let last = path[path.length - 1];
  let node = nodes[last.nodeId];
  let next = last.answer ? node.yes : node.no;
  if (typeof next === 'string') return outcomes[next];
  return null;
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('#333');
  noStroke();
  textSize(14);
  textAlign(CENTER, TOP);
  text('Should You Use Blockchain?', canvasWidth / 2, 6);

  hoveredNode = -1;
  let cx = canvasWidth / 2;
  let nodeW = 150;
  let nodeH = 45;
  let stepH = 75;
  let startY = 30;

  // Draw nodes
  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i];
    let ny = startY + i * stepH;
    let answered = path.find(p => p.nodeId === i);
    let isCurrent = currentNode === i;
    let isPast = answered !== undefined;
    let dimmed = !isCurrent && !isPast && path.length > 0;

    // Connecting line from previous
    if (i > 0) {
      let prevAns = path.find(p => p.nodeId === i - 1);
      // Only draw if previous node leads here
      stroke(dimmed ? '#ddd' : '#888');
      strokeWeight(dimmed ? 1 : 2);
      line(cx, ny - stepH + nodeH / 2 + 10, cx, ny - nodeH / 2 - 5);
    }

    // Diamond
    let col = isCurrent ? '#FFD54F' : isPast ? '#CFD8DC' : '#E0E0E0';
    if (dimmed) col = '#F5F5F5';

    push();
    fill(col);
    stroke(dimmed ? '#ddd' : '#666');
    strokeWeight(1);
    beginShape();
    vertex(cx, ny - nodeH / 2 - 5);
    vertex(cx + nodeW / 2 + 10, ny);
    vertex(cx, ny + nodeH / 2 + 5);
    vertex(cx - nodeW / 2 - 10, ny);
    endShape(CLOSE);

    fill(dimmed ? '#bbb' : '#333');
    noStroke();
    textSize(9);
    textAlign(CENTER, CENTER);
    let lines = node.q.split('\n');
    for (let li = 0; li < lines.length; li++) {
      text(lines[li], cx, ny - 5 + li * 12);
    }
    pop();

    // Check hover
    if (mouseX > cx - nodeW / 2 - 10 && mouseX < cx + nodeW / 2 + 10 && mouseY > ny - nodeH / 2 - 5 && mouseY < ny + nodeH / 2 + 5) {
      hoveredNode = i;
    }

    // Answer label or buttons
    if (isPast) {
      fill(answered.answer ? '#4CAF50' : '#E53935');
      noStroke();
      textSize(10);
      textAlign(CENTER, TOP);
      text(answered.answer ? 'YES' : 'NO', cx + (answered.answer ? -70 : 70), ny + nodeH / 2);

      // If answer leads to outcome and this is last
      let next = answered.answer ? node.yes : node.no;
      if (typeof next === 'string' && i === path[path.length - 1].nodeId) {
        // Draw outcome
        let oy = ny + stepH;
        stroke('#888');
        strokeWeight(2);
        line(cx, ny + nodeH / 2 + 5, cx, oy - 15);

        let oc = outcomes[next];
        fill(oc.color);
        stroke('#444');
        strokeWeight(2);
        rect(cx - 110, oy - 15, 220, 60, 8);
        fill('#fff');
        noStroke();
        textSize(12);
        textAlign(CENTER, TOP);
        text(oc.label, cx, oy - 8);
        textSize(8);
        fill('#eee');
        // Wrap reason
        let words = oc.reason.split(' ');
        let ln = '';
        let ly = oy + 10;
        for (let w of words) {
          if (textWidth(ln + w) > 200) { text(ln, cx, ly); ly += 11; ln = w + ' '; }
          else ln += w + ' ';
        }
        if (ln) text(ln, cx, ly);
      }
    } else if (isCurrent) {
      // Draw yes/no buttons
      let btnY = ny + nodeH / 2 + 3;
      fill('#4CAF50');
      stroke('#388E3C');
      strokeWeight(1);
      rect(cx - 80, btnY, 50, 20, 4);
      fill('#fff');
      noStroke();
      textSize(10);
      textAlign(CENTER, CENTER);
      text('Yes', cx - 55, btnY + 10);

      fill('#E53935');
      stroke('#C62828');
      strokeWeight(1);
      rect(cx + 30, btnY, 50, 20, 4);
      fill('#fff');
      noStroke();
      text('No', cx + 55, btnY + 10);
    }
  }

  // Reasoning chain
  if (path.length > 0) {
    let ry = drawHeight - 55;
    fill('#F5F5F5');
    stroke('#ddd');
    strokeWeight(1);
    rect(margin, ry, canvasWidth - 2 * margin, 50, 4);
    fill('#333');
    noStroke();
    textSize(9);
    textAlign(LEFT, TOP);
    text('Reasoning chain:', margin + 5, ry + 3);
    let chain = '';
    for (let p of path) {
      let n = nodes[p.nodeId];
      chain += n.q.replace('\n', ' ') + ' -> ' + (p.answer ? 'Yes' : 'No') + ' -> ';
    }
    let oc = getOutcome();
    if (oc) chain += oc.label;
    else chain += '...';
    // Wrap
    let words = chain.split(' ');
    let ln = '';
    let ly = ry + 15;
    textSize(8);
    fill('#555');
    for (let w of words) {
      if (textWidth(ln + w) > canvasWidth - 2 * margin - 15) { text(ln, margin + 5, ly); ly += 11; ln = w + ' '; }
      else ln += w + ' ';
    }
    if (ln) text(ln, margin + 5, ly);
  }

  // Controls
  fill('#666');
  noStroke();
  textSize(11);
  textAlign(LEFT, CENTER);
  text('Answer yes/no at each step.', margin, drawHeight + 12);
  resetBtn.position(margin, drawHeight + 28);
  scenarioSel.position(margin + 70, drawHeight + 28);
}

function mousePressed() {
  if (currentNode < 0 || currentNode >= nodes.length) return;

  let cx = canvasWidth / 2;
  let ny = 30 + currentNode * 75;
  let btnY = ny + 45 / 2 + 3;

  if (mouseY > btnY && mouseY < btnY + 20) {
    if (mouseX > cx - 80 && mouseX < cx - 30) answerNode(true);
    else if (mouseX > cx + 30 && mouseX < cx + 80) answerNode(false);
  }
}

function answerNode(ans) {
  let node = nodes[currentNode];
  path.push({ nodeId: currentNode, answer: ans });
  let next = ans ? node.yes : node.no;
  if (typeof next === 'string') currentNode = -1;
  else currentNode = next;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
  containerWidth = select('main').width;
  canvasWidth = containerWidth;
}
