// Governance Model Comparison MicroSim
// Three-panel governance flow comparison
let containerWidth;
let canvasWidth = 400;
let drawHeight = 460;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

let hoveredStep = null;
let selectedEvent = null;
let resetBtn;

let models = [
  {
    name: 'On-Chain', subtitle: '(Tezos/MakerDAO)', color: '#1565C0',
    steps: [
      { label: 'Submit Proposal', desc: 'Token holders submit governance proposals on-chain' },
      { label: 'Discussion Period', desc: 'Community discusses merits and risks of the proposal' },
      { label: 'Token Vote', desc: 'Token-weighted voting determines outcome' },
      { label: 'Auto-Execute', desc: 'Approved proposals execute automatically via smart contract' }
    ],
    events: [
      { year: 2020, name: 'MakerDAO MCD Launch', outcome: 'Successful migration to multi-collateral DAI' },
      { year: 2021, name: 'Tezos Granada', outcome: 'Liquidity baking feature added via on-chain vote' }
    ]
  },
  {
    name: 'Off-Chain', subtitle: '(Bitcoin/Ethereum)', color: '#E65100',
    steps: [
      { label: 'BIP/EIP Draft', desc: 'Developers draft improvement proposals (BIP/EIP)' },
      { label: 'Community Debate', desc: 'Miners, devs, and users debate on forums and social media' },
      { label: 'Rough Consensus', desc: 'Core developers assess community sentiment' },
      { label: 'Node Upgrade', desc: 'Operators voluntarily upgrade their software' }
    ],
    events: [
      { year: 2016, name: 'The DAO Fork', outcome: 'Ethereum split into ETH and ETC over $60M hack response' },
      { year: 2017, name: 'Block Size War', outcome: 'Bitcoin community split: BTC kept 1MB, BCH forked to 8MB' }
    ]
  },
  {
    name: 'Consortium', subtitle: '(Hyperledger)', color: '#2E7D32',
    steps: [
      { label: 'Steering Committee', desc: 'Governing board of member organizations meets' },
      { label: 'Technical Review', desc: 'Technical steering committee evaluates changes' },
      { label: 'Member Vote', desc: 'One-organization-one-vote among consortium members' },
      { label: 'Coordinated Deploy', desc: 'All members coordinate to deploy the update' }
    ],
    events: [
      { year: 2019, name: 'Fabric 2.0', outcome: 'Major upgrade with decentralized ordering and private data' },
      { year: 2021, name: 'Hyperledger Reorg', outcome: 'Foundation reorganized project governance structure' }
    ]
  }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));

  resetBtn = createButton('Reset');
  resetBtn.parent(document.querySelector('main'));
  resetBtn.mousePressed(() => { selectedEvent = null; });

  describe('Three-panel comparison of on-chain, off-chain, and consortium governance models.');
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
  text('Governance Model Comparison', canvasWidth / 2, 8);

  hoveredStep = null;
  let panelW = (canvasWidth - margin * 4) / 3;
  let panelH = 260;
  let panelY = 32;

  // Draw three panels
  for (let m = 0; m < models.length; m++) {
    let model = models[m];
    let px = margin + m * (panelW + margin);

    // Panel background
    fill(255, 255, 255, 150);
    stroke(model.color);
    strokeWeight(2);
    rect(px, panelY, panelW, panelH, 6);

    // Panel header
    fill(model.color);
    noStroke();
    textSize(11);
    textAlign(CENTER, TOP);
    text(model.name, px + panelW / 2, panelY + 6);
    fill('#888');
    textSize(8);
    text(model.subtitle, px + panelW / 2, panelY + 20);

    // Flow steps
    let stepH = 30;
    let stepW = panelW - 16;
    let sy = panelY + 36;

    for (let i = 0; i < model.steps.length; i++) {
      let step = model.steps[i];
      let stepY = sy + i * (stepH + 16);

      // Arrow from previous
      if (i > 0) {
        stroke(model.color);
        strokeWeight(2);
        let arrowX = px + panelW / 2;
        line(arrowX, stepY - 14, arrowX, stepY);
        // Arrow head
        line(arrowX, stepY, arrowX - 4, stepY - 6);
        line(arrowX, stepY, arrowX + 4, stepY - 6);
      }

      // Step box
      let isHover = mouseX > px + 8 && mouseX < px + 8 + stepW && mouseY > stepY && mouseY < stepY + stepH;
      if (isHover) hoveredStep = step;

      fill(isHover ? '#FFE082' : '#fff');
      stroke(model.color);
      strokeWeight(1);
      rect(px + 8, stepY, stepW, stepH, 4);

      fill('#333');
      noStroke();
      textSize(9);
      textAlign(CENTER, CENTER);
      text(step.label, px + panelW / 2, stepY + stepH / 2);
    }
  }

  // Timeline section
  let tlY = panelY + panelH + 15;
  fill('#333');
  noStroke();
  textSize(11);
  textAlign(CENTER, TOP);
  text('Historical Governance Events', canvasWidth / 2, tlY);

  tlY += 18;
  stroke('#ccc');
  strokeWeight(2);
  line(margin + 20, tlY + 10, canvasWidth - margin - 20, tlY + 10);

  // Plot events
  let allEvents = [];
  for (let m = 0; m < models.length; m++) {
    for (let e of models[m].events) {
      allEvents.push({ ...e, model: models[m] });
    }
  }
  allEvents.sort((a, b) => a.year - b.year);

  let evSpacing = (canvasWidth - 2 * margin - 40) / (allEvents.length + 1);
  for (let i = 0; i < allEvents.length; i++) {
    let ev = allEvents[i];
    let ex = margin + 20 + evSpacing * (i + 1);
    let ey = tlY + 10;

    let isHover = dist(mouseX, mouseY, ex, ey) < 10;
    fill(isHover ? '#FFE082' : ev.model.color);
    stroke('#666');
    strokeWeight(1);
    ellipse(ex, ey, 16, 16);

    fill('#333');
    noStroke();
    textSize(8);
    textAlign(CENTER, TOP);
    text(ev.year, ex, ey + 12);
    text(ev.name, ex, ey + 22);

    if (isHover) hoveredStep = { label: ev.name, desc: ev.outcome };
    if (isHover && mouseIsPressed) selectedEvent = ev;
  }

  // Selected event detail
  if (selectedEvent) {
    let dY = tlY + 50;
    fill('#FAFAFA');
    stroke('#ccc');
    strokeWeight(1);
    rect(margin, dY, canvasWidth - 2 * margin, 40, 4);
    fill('#333');
    noStroke();
    textSize(10);
    textAlign(LEFT, TOP);
    text(selectedEvent.year + ' - ' + selectedEvent.name, margin + 8, dY + 5);
    fill('#555');
    textSize(9);
    text(selectedEvent.outcome, margin + 8, dY + 20);
  }

  // Tooltip
  if (hoveredStep) {
    fill(255, 255, 230, 240);
    stroke('#999');
    strokeWeight(1);
    let tip = hoveredStep.desc;
    let tw = Math.min(textWidth(tip) + 16, 220);
    let tx = constrain(mouseX + 10, 0, canvasWidth - tw);
    let ty = constrain(mouseY - 30, 0, drawHeight - 30);
    rect(tx, ty, tw, 26, 3);
    fill('#333');
    noStroke();
    textSize(9);
    textAlign(LEFT, CENTER);
    text(tip, tx + 6, ty + 13);
  }

  // Controls
  fill('#666');
  noStroke();
  textSize(11);
  textAlign(LEFT, CENTER);
  text('Hover steps for details. Click timeline events.', margin, drawHeight + 15);
  resetBtn.position(margin, drawHeight + 35);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
  containerWidth = select('main').width;
  canvasWidth = containerWidth;
}
