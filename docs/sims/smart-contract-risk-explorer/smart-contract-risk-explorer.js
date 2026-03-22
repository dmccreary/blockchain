// Smart Contract Risk Explorer MicroSim
// Interactive tree diagram of vulnerability categories
let containerWidth;
let canvasWidth = 400;
let drawHeight = 480;
let controlHeight = 70;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

let riskTree = [];
let selectedNode = null;
let hoveredNode = null;
let resetBtn;

let categories = [
  {
    name: 'Coding Errors', color: '#E53935', severity: 'High',
    children: [
      { name: 'Reentrancy', loss: '$60M', example: 'The DAO (2016)', mitigation: 'Use checks-effects-interactions pattern' },
      { name: 'Integer Overflow', loss: '$0.9M', example: 'BEC Token (2018)', mitigation: 'Use SafeMath libraries' },
      { name: 'Uninitialized Storage', loss: '$30M', example: 'Parity Wallet (2017)', mitigation: 'Always initialize state variables' }
    ]
  },
  {
    name: 'Economic Exploits', color: '#FF9800', severity: 'High',
    children: [
      { name: 'Flash Loan Attacks', loss: '$200M+', example: 'bZx, Cream Finance', mitigation: 'Use TWAP oracles, limit flash loan exposure' },
      { name: 'Front-Running', loss: '$100M+/yr', example: 'MEV extraction', mitigation: 'Use commit-reveal schemes' },
      { name: 'Price Manipulation', loss: '$130M', example: 'Mango Markets (2022)', mitigation: 'Use decentralized oracle networks' }
    ]
  },
  {
    name: 'Oracle Failures', color: '#7B1FA2', severity: 'Medium',
    children: [
      { name: 'Stale Data', loss: '$10M+', example: 'Synthetix sKRW (2019)', mitigation: 'Check data freshness, use circuit breakers' },
      { name: 'Single Oracle', loss: '$25M', example: 'Harvest Finance', mitigation: 'Use multiple oracle sources' }
    ]
  },
  {
    name: 'Access Control', color: '#1565C0', severity: 'High',
    children: [
      { name: 'Missing Auth', loss: '$31M', example: 'Parity Multisig', mitigation: 'Use OpenZeppelin AccessControl' },
      { name: 'Privilege Escalation', loss: '$15M', example: 'Ronin Bridge (2022)', mitigation: 'Multi-sig governance, time locks' }
    ]
  },
  {
    name: 'Upgrade Risks', color: '#00897B', severity: 'Medium',
    children: [
      { name: 'Proxy Collision', loss: '$5M', example: 'Audius (2022)', mitigation: 'Use transparent proxy pattern' },
      { name: 'Logic Bug in Upgrade', loss: '$80M', example: 'Compound Gov (2021)', mitigation: 'Thorough testing, staged rollouts' }
    ]
  }
];

let expandedCats = {};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));

  resetBtn = createButton('Reset');
  resetBtn.parent(document.querySelector('main'));
  resetBtn.mousePressed(() => {
    selectedNode = null;
    expandedCats = {};
  });

  for (let c of categories) expandedCats[c.name] = false;

  describe('Interactive tree diagram of smart contract vulnerability categories with severity and loss data.');
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
  text('Smart Contract Risk Taxonomy', canvasWidth / 2, 8);

  hoveredNode = null;
  let treeX = margin;
  let treeW = selectedNode ? canvasWidth * 0.55 : canvasWidth - 2 * margin;
  let y = 40;
  let rootX = treeW / 2 + treeX;

  // Root node
  drawNode(rootX, y, 'Smart Contract Risks', '#455A64', 140, 28);
  y += 45;

  // Category nodes
  let catSpacing = treeW / (categories.length + 1);
  for (let i = 0; i < categories.length; i++) {
    let cat = categories[i];
    let cx = treeX + catSpacing * (i + 1);
    let nw = 100;
    let nh = 24;

    // Line from root
    stroke('#aaa');
    strokeWeight(1);
    line(rootX, 40 + 14, cx, y - 12);

    let isHovered = mouseX > cx - nw/2 && mouseX < cx + nw/2 && mouseY > y - nh/2 && mouseY < y + nh/2;
    if (isHovered) hoveredNode = { type: 'category', data: cat };

    drawNode(cx, y, cat.name, isHovered ? '#FFE082' : cat.color, nw, nh, 10);

    // Expand indicator
    fill('#fff');
    noStroke();
    textSize(10);
    textAlign(CENTER, CENTER);
    text(expandedCats[cat.name] ? '[-]' : '[+]', cx, y + nh/2 + 8);

    // Children
    if (expandedCats[cat.name]) {
      let childY = y + 40;
      for (let j = 0; j < cat.children.length; j++) {
        let child = cat.children[j];
        let childX = cx + (j - (cat.children.length - 1) / 2) * 90;
        childX = constrain(childX, margin + 40, treeX + treeW - 40);

        stroke('#ccc');
        strokeWeight(1);
        line(cx, y + nh/2, childX, childY - 10);

        let cw = 80;
        let ch = 36;
        let childHover = mouseX > childX - cw/2 && mouseX < childX + cw/2 && mouseY > childY - ch/2 && mouseY < childY + ch/2;
        if (childHover) hoveredNode = { type: 'child', data: child, parent: cat };

        fill(childHover ? '#FFE082' : '#fff');
        stroke(cat.color);
        strokeWeight(2);
        rect(childX - cw/2, childY - ch/2, cw, ch, 5);

        fill('#333');
        noStroke();
        textSize(9);
        textAlign(CENTER, CENTER);
        text(child.name, childX, childY - 5);
        fill('#E53935');
        textSize(8);
        text(child.loss, childX, childY + 9);
      }
    }
  }

  // Detail panel
  if (selectedNode) {
    let px = canvasWidth * 0.58;
    let pw = canvasWidth * 0.4;
    fill('#FAFAFA');
    stroke('#ccc');
    strokeWeight(1);
    rect(px, 35, pw, drawHeight - 50, 6);

    fill('#333');
    noStroke();
    textSize(13);
    textAlign(LEFT, TOP);
    let py = 45;

    if (selectedNode.type === 'child') {
      let d = selectedNode.data;
      let p = selectedNode.parent;
      fill(p.color);
      text(d.name, px + 10, py); py += 22;
      fill('#666');
      textSize(11);
      text('Category: ' + p.name, px + 10, py); py += 18;
      text('Severity: ' + p.severity, px + 10, py); py += 18;
      fill('#E53935');
      text('Losses: ' + d.loss, px + 10, py); py += 22;
      fill('#333');
      textSize(11);
      text('Example:', px + 10, py); py += 16;
      fill('#555');
      text(d.example, px + 15, py); py += 22;
      fill('#333');
      text('Mitigation:', px + 10, py); py += 16;
      fill('#2E7D32');
      textSize(10);
      // Word wrap
      let words = d.mitigation.split(' ');
      let ln = '';
      for (let w of words) {
        if (textWidth(ln + w) > pw - 25) { text(ln, px + 15, py); py += 14; ln = w + ' '; }
        else ln += w + ' ';
      }
      if (ln) text(ln, px + 15, py);
    } else if (selectedNode.type === 'category') {
      let c = selectedNode.data;
      fill(c.color);
      text(c.name, px + 10, py); py += 22;
      fill('#666');
      textSize(11);
      text('Severity: ' + c.severity, px + 10, py); py += 18;
      text('Vulnerabilities: ' + c.children.length, px + 10, py); py += 22;
      for (let ch of c.children) {
        fill('#333');
        text('- ' + ch.name + ' (' + ch.loss + ')', px + 10, py); py += 16;
      }
    }
  }

  // Tooltip on hover
  if (hoveredNode && !selectedNode) {
    let tip = hoveredNode.type === 'category' ? hoveredNode.data.name + ' - ' + hoveredNode.data.severity + ' severity'
      : hoveredNode.data.name + ': ' + hoveredNode.data.loss + ' lost';
    fill(255, 255, 230, 240);
    stroke('#999');
    strokeWeight(1);
    let tw = textWidth(tip) + 16;
    rect(mouseX + 10, mouseY - 20, tw, 22, 3);
    fill('#333');
    noStroke();
    textSize(11);
    textAlign(LEFT, CENTER);
    text(tip, mouseX + 18, mouseY - 9);
  }

  // Controls
  fill('#333');
  noStroke();
  textSize(12);
  textAlign(LEFT, CENTER);
  text('Click categories to expand. Click nodes for details.', margin, drawHeight + 15);
  resetBtn.position(margin, drawHeight + 35);
}

function mousePressed() {
  // Check category clicks
  let treeW = selectedNode ? canvasWidth * 0.55 : canvasWidth - 2 * margin;
  let catSpacing = treeW / (categories.length + 1);
  let y = 85;

  for (let i = 0; i < categories.length; i++) {
    let cat = categories[i];
    let cx = margin + catSpacing * (i + 1);
    if (mouseX > cx - 50 && mouseX < cx + 50 && mouseY > y - 20 && mouseY < y + 20) {
      expandedCats[cat.name] = !expandedCats[cat.name];
      selectedNode = { type: 'category', data: cat };
      return;
    }

    if (expandedCats[cat.name]) {
      let childY = y + 40;
      for (let j = 0; j < cat.children.length; j++) {
        let child = cat.children[j];
        let childX = cx + (j - (cat.children.length - 1) / 2) * 90;
        childX = constrain(childX, margin + 40, margin + treeW - 40);
        if (mouseX > childX - 40 && mouseX < childX + 40 && mouseY > childY - 18 && mouseY < childY + 18) {
          selectedNode = { type: 'child', data: child, parent: cat };
          return;
        }
      }
    }
  }
}

function drawNode(x, y, label, col, w, h, r) {
  r = r || 6;
  fill(col);
  stroke('#666');
  strokeWeight(1);
  rect(x - w/2, y - h/2, w, h, r);
  fill('#fff');
  noStroke();
  textSize(10);
  textAlign(CENTER, CENTER);
  text(label, x, y);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
  containerWidth = select('main').width;
  canvasWidth = containerWidth;
}
