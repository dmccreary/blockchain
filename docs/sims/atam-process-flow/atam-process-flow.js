// ATAM Process Flow MicroSim
// Four-phase flowchart (blockchain-specific)
let containerWidth;
let canvasWidth = 400;
let drawHeight = 460;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

let stepBtn, resetBtn;
let currentPhase = -1; // -1 = overview, 0-3 = phases
let hoveredBox = null;
let infoText = '';

let phaseColors = ['#1565C0', '#E65100', '#2E7D32', '#7B1FA2'];
let phaseNames = ['Phase 1: Presentation', 'Phase 2: Investigation', 'Phase 3: Stakeholder Input', 'Phase 4: Documentation'];

let phases = [
  {
    activities: [
      { label: 'Present\nBusiness Drivers', desc: 'Stakeholders present the business goals for adopting blockchain: reducing intermediaries, increasing transparency, enabling trustless transactions among parties.' },
      { label: 'Present Candidate\nArchitectures', desc: 'Evaluation team presents both blockchain-based and traditional architectures. For example: Hyperledger Fabric consortium chain vs. a centralized database with API access.' }
    ]
  },
  {
    activities: [
      { label: 'Construct\nUtility Tree', desc: 'Build a utility tree with blockchain-relevant quality attributes: immutability, throughput, finality latency, smart contract security, regulatory compliance.' },
      { label: 'Generate\nScenarios', desc: 'Create scenarios like: "Transaction throughput increases 10x during token sale" or "A node operator becomes malicious."' },
      { label: 'Analyze Architecture\nResponses', desc: 'Evaluate how each architecture handles scenarios. How does the blockchain handle 51% attacks vs. how does the database handle a compromised admin?' }
    ]
  },
  {
    activities: [
      { label: 'Stakeholder\nScenario Generation', desc: 'Business stakeholders add scenarios from their perspective: "Regulator requests transaction audit within 24 hours" or "Partner organization leaves the consortium."' },
      { label: 'Scenario\nPrioritization', desc: 'Prioritize scenarios by importance and difficulty. High-importance, high-difficulty scenarios like "cross-chain interoperability" get the most analysis attention.' }
    ]
  },
  {
    activities: [
      { label: 'Document\nRisks', desc: 'Record identified risks: smart contract vulnerabilities, key management failures, consensus mechanism weaknesses, regulatory non-compliance risks.' },
      { label: 'Document\nSensitivity Points', desc: 'Identify parameters that significantly affect quality: block size, gas limits, number of validator nodes, confirmation time requirements.' },
      { label: 'Document\nTradeoff Points', desc: 'Record architectural tradeoffs: decentralization vs. throughput, privacy vs. auditability, immutability vs. right-to-be-forgotten compliance.' },
      { label: 'Present\nRecommendations', desc: 'Deliver final assessment: Is blockchain justified? Which architecture best satisfies the quality attribute requirements given the identified tradeoffs?' }
    ]
  }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));

  stepBtn = createButton('Step Through');
  stepBtn.parent(document.querySelector('main'));
  stepBtn.mousePressed(() => {
    currentPhase++;
    if (currentPhase > 3) currentPhase = -1;
  });

  resetBtn = createButton('Reset');
  resetBtn.parent(document.querySelector('main'));
  resetBtn.mousePressed(() => { currentPhase = -1; infoText = ''; });

  describe('ATAM four-phase flowchart applied to trust technology evaluation.');
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
  text('ATAM Process Flow for Trust Technologies', canvasWidth / 2, 6);

  // Progress indicator
  let progY = 24;
  for (let i = 0; i < 4; i++) {
    let px = margin + i * ((canvasWidth - 2 * margin) / 4);
    let pw = (canvasWidth - 2 * margin) / 4 - 4;
    fill(i <= currentPhase ? phaseColors[i] : '#E0E0E0');
    noStroke();
    rect(px, progY, pw, 6, 3);
  }

  hoveredBox = null;

  // Draw swim lanes
  let laneH = (drawHeight - 50) / 4;
  let laneY = 36;

  for (let p = 0; p < 4; p++) {
    let ly = laneY + p * laneH;
    let isActive = currentPhase === -1 || currentPhase === p;
    let isDone = currentPhase > p;
    let alpha = isActive ? 255 : (isDone ? 180 : 80);

    // Lane background
    let c = color(phaseColors[p]);
    c.setAlpha(isActive ? 25 : 10);
    fill(c);
    stroke(phaseColors[p]);
    strokeWeight(isActive ? 2 : 1);
    rect(margin, ly, canvasWidth - 2 * margin, laneH - 4, 4);

    // Phase label
    fill(phaseColors[p]);
    c.setAlpha(alpha);
    noStroke();
    textSize(10);
    textAlign(LEFT, TOP);
    text(phaseNames[p], margin + 5, ly + 4);

    // Activity boxes
    let phase = phases[p];
    let boxW = (canvasWidth - 2 * margin - 20) / phase.activities.length - 10;
    boxW = Math.min(boxW, 140);
    let boxH = laneH - 40;
    let boxY = ly + 22;

    for (let a = 0; a < phase.activities.length; a++) {
      let act = phase.activities[a];
      let bx = margin + 10 + a * (boxW + 10);

      // Arrow from previous
      if (a > 0) {
        stroke(isActive ? phaseColors[p] : '#ccc');
        strokeWeight(isActive ? 2 : 1);
        let arrowX1 = bx - 8;
        let arrowY = boxY + boxH / 2;
        line(arrowX1 - 5, arrowY, arrowX1 + 2, arrowY);
        line(arrowX1 + 2, arrowY, arrowX1 - 2, arrowY - 3);
        line(arrowX1 + 2, arrowY, arrowX1 - 2, arrowY + 3);
      }

      let isHover = mouseX > bx && mouseX < bx + boxW && mouseY > boxY && mouseY < boxY + boxH;
      if (isHover) {
        hoveredBox = act;
        infoText = act.desc;
      }

      fill(isHover ? '#FFE082' : '#fff');
      stroke(isActive ? phaseColors[p] : '#ccc');
      strokeWeight(isActive ? 2 : 1);
      rect(bx, boxY, boxW, boxH, 5);

      fill(isActive ? '#333' : '#aaa');
      noStroke();
      textSize(9);
      textAlign(CENTER, CENTER);
      let lines = act.label.split('\n');
      for (let li = 0; li < lines.length; li++) {
        text(lines[li], bx + boxW / 2, boxY + boxH / 2 - 5 + li * 12);
      }
    }

    // Arrow to next phase
    if (p < 3) {
      let nextLy = laneY + (p + 1) * laneH;
      stroke(isActive ? '#888' : '#ddd');
      strokeWeight(1);
      let arrowX = canvasWidth / 2;
      line(arrowX, ly + laneH - 4, arrowX, nextLy + 2);
      line(arrowX, nextLy + 2, arrowX - 4, nextLy - 4);
      line(arrowX, nextLy + 2, arrowX + 4, nextLy - 4);
    }
  }

  // Info panel in control region
  let infoY = drawHeight + 8;
  fill('#F5F5F5');
  stroke('#ddd');
  strokeWeight(1);
  rect(margin, infoY + 20, canvasWidth - 2 * margin, 55, 4);

  fill('#333');
  noStroke();
  textSize(11);
  textAlign(LEFT, TOP);
  text('Phase: ' + (currentPhase === -1 ? 'Overview (all phases)' : phaseNames[currentPhase]), margin, infoY + 4);

  if (infoText) {
    textSize(9);
    fill('#555');
    let words = infoText.split(' ');
    let ln = '';
    let ly = infoY + 25;
    for (let w of words) {
      if (textWidth(ln + w) > canvasWidth - 2 * margin - 16) { text(ln, margin + 8, ly); ly += 12; ln = w + ' '; }
      else ln += w + ' ';
    }
    if (ln) text(ln, margin + 8, ly);
  } else {
    textSize(9);
    fill('#888');
    text('Hover over activity boxes to see trust technology examples.', margin + 8, infoY + 30);
  }

  stepBtn.position(canvasWidth - 200, infoY + 2);
  resetBtn.position(canvasWidth - 100, infoY + 2);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
  containerWidth = select('main').width;
  canvasWidth = containerWidth;
}
