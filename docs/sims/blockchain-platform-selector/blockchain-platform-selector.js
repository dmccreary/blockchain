// Blockchain Platform Selector MicroSim
// Decision tree for platform selection
let containerWidth;
let canvasWidth = 400;
let drawHeight = 460;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

let resetBtn, scenarioSel;
let currentQuestion = 0;
let answers = [];
let hoveredNode = null;

let questions = [
  { q: 'Do participants trust each other?', yes: 1, no: 2 },
  { q: 'Need immutable audit trail?', yes: 'private', no: 'database' },
  { q: 'Is regulatory compliance required?', yes: 3, no: 4 },
  { q: 'Need high throughput (>1000 TPS)?', yes: 'consortium', no: 'permissioned' },
  { q: 'Is public transparency important?', yes: 'public', no: 5 },
  { q: 'Need programmable logic (smart contracts)?', yes: 'public', no: 'consortium' }
];

let outcomes = {
  database: { name: 'Traditional Database', color: '#78909C', desc: 'A centralized database is sufficient. No blockchain needed.', platforms: ['PostgreSQL', 'MongoDB', 'MySQL'] },
  private: { name: 'Private Blockchain', color: '#7B1FA2', desc: 'A private blockchain provides audit trails within a trusted organization.', platforms: ['Hyperledger Fabric', 'Corda', 'Quorum'] },
  consortium: { name: 'Consortium Blockchain', color: '#1565C0', desc: 'A consortium chain balances trust and performance among known parties.', platforms: ['Hyperledger Fabric', 'R3 Corda', 'Quorum'] },
  permissioned: { name: 'Permissioned Public', color: '#00897B', desc: 'A permissioned public chain satisfies compliance with some openness.', platforms: ['Ethereum (permissioned)', 'Polygon Supernets'] },
  public: { name: 'Public Blockchain', color: '#E53935', desc: 'A fully public blockchain maximizes transparency and decentralization.', platforms: ['Ethereum', 'Bitcoin', 'Solana', 'Polygon'] }
};

let scenarios = {
  'Supply Chain': [false, null, true, true],
  'DeFi Protocol': [false, null, false, true],
  'Identity Mgmt': [false, null, true, false],
  'Internal Audit': [true, true],
  'Simple App': [true, false]
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));

  resetBtn = createButton('Reset');
  resetBtn.parent(document.querySelector('main'));
  resetBtn.mousePressed(resetTree);

  scenarioSel = createSelect();
  scenarioSel.parent(document.querySelector('main'));
  scenarioSel.option('-- Select Scenario --');
  for (let s in scenarios) scenarioSel.option(s);
  scenarioSel.changed(loadScenario);

  describe('Interactive decision tree for selecting the appropriate blockchain platform.');
}

function resetTree() {
  currentQuestion = 0;
  answers = [];
  scenarioSel.selected('-- Select Scenario --');
}

function loadScenario() {
  let name = scenarioSel.value();
  if (name === '-- Select Scenario --') return;
  resetTree();
  let path = scenarios[name];
  for (let a of path) {
    if (a === null) continue;
    let q = questions[currentQuestion];
    answers.push({ qIdx: currentQuestion, answer: a });
    let next = a ? q.yes : q.no;
    if (typeof next === 'string') { currentQuestion = -1; break; }
    currentQuestion = next;
  }
}

function getOutcome() {
  if (answers.length === 0) return null;
  let last = answers[answers.length - 1];
  let q = questions[last.qIdx];
  let next = last.answer ? q.yes : q.no;
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
  textSize(15);
  textAlign(CENTER, TOP);
  text('Blockchain Platform Selector', canvasWidth / 2, 8);

  hoveredNode = null;

  // Draw decision tree visually
  let treeY = 40;
  let nodeW = 180;
  let nodeH = 32;
  let stepH = 60;

  for (let i = 0; i <= answers.length; i++) {
    let y = treeY + i * stepH;
    let qIdx = i < answers.length ? answers[i].qIdx : currentQuestion;
    if (qIdx < 0 || qIdx >= questions.length) break;

    let q = questions[qIdx];
    let cx = canvasWidth / 2;

    // Diamond shape for decision
    let answered = i < answers.length;
    let col = answered ? '#B0BEC5' : '#FFD54F';

    // Draw connecting line from previous
    if (i > 0) {
      stroke('#888');
      strokeWeight(2);
      line(cx, y - stepH + nodeH / 2 + 10, cx, y - nodeH / 2);
    }

    // Diamond
    push();
    fill(col);
    stroke('#666');
    strokeWeight(1);
    beginShape();
    vertex(cx, y - nodeH / 2 - 5);
    vertex(cx + nodeW / 2, y);
    vertex(cx, y + nodeH / 2 + 5);
    vertex(cx - nodeW / 2, y);
    endShape(CLOSE);

    fill('#333');
    noStroke();
    textSize(10);
    textAlign(CENTER, CENTER);
    text(q.q, cx, y);
    pop();

    // Yes/No buttons or answer labels
    if (answered) {
      let ans = answers[i].answer;
      fill(ans ? '#4CAF50' : '#E53935');
      noStroke();
      textSize(10);
      textAlign(CENTER, TOP);
      text(ans ? 'YES' : 'NO', cx + (ans ? -60 : 60), y + nodeH / 2 + 2);
    } else {
      // Draw clickable yes/no
      let yesX = cx - 70;
      let noX = cx + 40;
      let btnY = y + nodeH / 2 + 2;

      fill('#4CAF50');
      stroke('#388E3C');
      strokeWeight(1);
      rect(yesX, btnY, 50, 20, 4);
      fill('#fff');
      noStroke();
      textSize(10);
      textAlign(CENTER, CENTER);
      text('Yes', yesX + 25, btnY + 10);

      fill('#E53935');
      stroke('#C62828');
      strokeWeight(1);
      rect(noX, btnY, 50, 20, 4);
      fill('#fff');
      noStroke();
      text('No', noX + 25, btnY + 10);
    }
  }

  // Show outcome
  let outcome = getOutcome();
  if (outcome) {
    let oy = treeY + answers.length * stepH + 15;
    // Connecting line
    stroke('#888');
    strokeWeight(2);
    line(canvasWidth / 2, oy - 20, canvasWidth / 2, oy);

    fill(outcome.color);
    stroke('#444');
    strokeWeight(2);
    rect(canvasWidth / 2 - 120, oy, 240, 80, 8);
    fill('#fff');
    noStroke();
    textSize(13);
    textAlign(CENTER, TOP);
    text(outcome.name, canvasWidth / 2, oy + 8);
    textSize(9);
    fill('#eee');
    // Word wrap description
    let words = outcome.desc.split(' ');
    let ln = '';
    let ly = oy + 26;
    for (let w of words) {
      if (textWidth(ln + w) > 220) { text(ln, canvasWidth / 2, ly); ly += 13; ln = w + ' '; }
      else ln += w + ' ';
    }
    if (ln) text(ln, canvasWidth / 2, ly); ly += 16;
    textSize(8);
    text('Platforms: ' + outcome.platforms.join(', '), canvasWidth / 2, ly);
  }

  // Controls
  fill('#333');
  noStroke();
  textSize(11);
  textAlign(LEFT, CENTER);
  text('Answer questions to find the right platform.', margin, drawHeight + 15);
  resetBtn.position(margin, drawHeight + 30);
  scenarioSel.position(margin + 70, drawHeight + 30);
}

function mousePressed() {
  if (currentQuestion < 0 || currentQuestion >= questions.length) return;

  let cx = canvasWidth / 2;
  let y = 40 + answers.length * 60;
  let btnY = y + 32 / 2 + 2;

  // Yes button
  if (mouseX > cx - 70 && mouseX < cx - 20 && mouseY > btnY && mouseY < btnY + 20) {
    answerQuestion(true);
  }
  // No button
  if (mouseX > cx + 40 && mouseX < cx + 90 && mouseY > btnY && mouseY < btnY + 20) {
    answerQuestion(false);
  }
}

function answerQuestion(ans) {
  let q = questions[currentQuestion];
  answers.push({ qIdx: currentQuestion, answer: ans });
  let next = ans ? q.yes : q.no;
  if (typeof next === 'string') {
    currentQuestion = -1;
  } else {
    currentQuestion = next;
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
