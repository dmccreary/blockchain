// Cryptographic Primitives Relationship Map
// Chapter 2: Cryptographic Foundations
let containerWidth;
let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

let buildBtn, showAllBtn, resetBtn;
let selectedNode = -1;
let buildMode = false;
let buildStep = 0;
let buildTimer = 0;
let showAll = true;

const nodes = [
  // Layer 0: Foundations
  { name: 'Hash Function', def: 'One-way function mapping input to fixed-size digest', type: 'hash', layer: 0, col: 0 },
  { name: 'Symmetric Encryption', def: 'Same key encrypts and decrypts data', type: 'encrypt', layer: 0, col: 1 },
  { name: 'Random Number Generator', def: 'Produces unpredictable values for keys and nonces', type: 'encrypt', layer: 0, col: 2 },
  // Layer 1: Building blocks
  { name: 'Merkle Tree', def: 'Binary tree of hashes enabling efficient verification', type: 'hash', layer: 1, col: 0 },
  { name: 'Asymmetric Encryption', def: 'Public/private key pair for encryption', type: 'encrypt', layer: 1, col: 1 },
  { name: 'Nonce', def: 'Number used once to prevent replay attacks', type: 'encrypt', layer: 1, col: 2 },
  // Layer 2: Mechanisms
  { name: 'Digital Signature', def: 'Hash encrypted with private key proves authorship', type: 'app', layer: 2, col: 0 },
  { name: 'Key Exchange', def: 'Protocol to establish shared secret over insecure channel', type: 'encrypt', layer: 2, col: 1 },
  { name: 'Hash Chain', def: 'Sequence of hashes linking data blocks together', type: 'hash', layer: 2, col: 2 },
  // Layer 3: Applications
  { name: 'Non-repudiation', def: 'Signer cannot deny having signed a message', type: 'app', layer: 3, col: 0 },
  { name: 'Tamper Evidence', def: 'Any modification to data is detectable', type: 'app', layer: 3, col: 1 },
  { name: 'Proof of Work', def: 'Computational puzzle requiring hash with specific prefix', type: 'app', layer: 3, col: 2 }
];

const edges = [
  [0, 3], [0, 6], [0, 8], [0, 11],  // Hash Function enables
  [1, 4],                             // Symmetric -> Asymmetric
  [2, 5], [2, 4],                     // RNG -> Nonce, Asymmetric
  [3, 10],                            // Merkle -> Tamper Evidence
  [4, 6], [4, 7],                     // Asymmetric -> Signature, Key Exchange
  [5, 11], [5, 8],                    // Nonce -> PoW, Hash Chain
  [6, 9],                             // Signature -> Non-repudiation
  [8, 10],                            // Hash Chain -> Tamper Evidence
];

function nodePos(i) {
  let n = nodes[i];
  let layerCount = 4;
  let colCount = 3;
  let hSpace = (canvasWidth - margin * 2) / colCount;
  let vSpace = (drawHeight - 120) / layerCount;
  let x = margin + hSpace * n.col + hSpace / 2;
  let y = drawHeight - 60 - vSpace * n.layer;
  return { x, y };
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  buildBtn = createButton('Build Up');
  buildBtn.parent(document.querySelector('main'));
  buildBtn.mousePressed(() => {
    buildMode = true;
    buildStep = 0;
    buildTimer = 0;
    showAll = false;
    selectedNode = -1;
  });

  showAllBtn = createButton('Show All');
  showAllBtn.parent(document.querySelector('main'));
  showAllBtn.mousePressed(() => {
    showAll = true;
    buildMode = false;
    selectedNode = -1;
  });

  resetBtn = createButton('Reset');
  resetBtn.parent(document.querySelector('main'));
  resetBtn.mousePressed(() => {
    showAll = true;
    buildMode = false;
    selectedNode = -1;
  });
}

function draw() {
  updateCanvasSize();

  // Build animation
  if (buildMode) {
    buildTimer += 1;
    if (buildTimer > 60) {
      buildStep = min(buildStep + 1, 3);
      buildTimer = 0;
      if (buildStep >= 3) buildMode = false;
    }
  }

  let visibleLayer = showAll ? 3 : buildStep;

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  // Title
  noStroke();
  fill(40);
  textSize(15);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text('Cryptographic Primitives Map', canvasWidth / 2, 6);
  textStyle(NORMAL);

  // Draw edges
  for (let e of edges) {
    let fromNode = nodes[e[0]];
    let toNode = nodes[e[1]];
    if (fromNode.layer > visibleLayer || toNode.layer > visibleLayer) continue;

    let from = nodePos(e[0]);
    let to = nodePos(e[1]);

    let dimmed = selectedNode >= 0 && e[0] !== selectedNode && e[1] !== selectedNode;
    if (dimmed) {
      stroke(200, 200, 200, 60);
    } else if (selectedNode >= 0) {
      stroke(255, 140, 0);
    } else {
      stroke(160);
    }
    strokeWeight(1.5);
    line(from.x, from.y, to.x, to.y);

    // Arrow head
    let angle = atan2(to.y - from.y, to.x - from.x);
    let ax = to.x - cos(angle) * 20;
    let ay = to.y - sin(angle) * 20;
    fill(dimmed ? color(200, 200, 200, 60) : (selectedNode >= 0 && !dimmed ? color(255, 140, 0) : color(160)));
    noStroke();
    push();
    translate(ax, ay);
    rotate(angle);
    triangle(0, -3, 0, 3, 8, 0);
    pop();
  }

  // Draw nodes
  for (let i = 0; i < nodes.length; i++) {
    let n = nodes[i];
    if (n.layer > visibleLayer) continue;

    let pos = nodePos(i);
    let isHovered = dist(mouseX, mouseY, pos.x, pos.y) < 22;
    let isSelected = selectedNode === i;
    let isConnected = false;
    if (selectedNode >= 0) {
      for (let e of edges) {
        if ((e[0] === selectedNode && e[1] === i) || (e[1] === selectedNode && e[0] === i)) {
          isConnected = true;
          break;
        }
      }
    }
    let dimmed = selectedNode >= 0 && !isSelected && !isConnected;

    // Node circle
    strokeWeight(2);
    let baseColor;
    if (n.type === 'hash') baseColor = [70, 130, 200];
    else if (n.type === 'encrypt') baseColor = [50, 160, 80];
    else baseColor = [220, 140, 40];

    if (dimmed) {
      fill(baseColor[0], baseColor[1], baseColor[2], 50);
      stroke(baseColor[0], baseColor[1], baseColor[2], 50);
    } else if (isSelected || isHovered) {
      fill(baseColor[0], baseColor[1], baseColor[2]);
      stroke(40);
    } else {
      fill(baseColor[0], baseColor[1], baseColor[2], 200);
      stroke(baseColor[0] - 20, baseColor[1] - 20, baseColor[2] - 20);
    }
    ellipse(pos.x, pos.y, 40, 40);

    // Label
    noStroke();
    fill(dimmed ? color(150, 150, 150, 80) : color(40));
    textSize(9);
    textAlign(CENTER, TOP);
    text(n.name, pos.x, pos.y + 24, 90, 30);
  }

  // Definition panel
  if (selectedNode >= 0 && nodes[selectedNode].layer <= visibleLayer) {
    let n = nodes[selectedNode];
    let panelW = min(canvasWidth - 40, 300);
    let panelX = canvasWidth / 2 - panelW / 2;
    let panelY = 28;
    fill(255, 255, 255, 230);
    stroke(180);
    strokeWeight(1);
    rect(panelX, panelY, panelW, 42, 5);
    noStroke();
    fill(40);
    textSize(12);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text(n.name, panelX + 8, panelY + 4);
    textStyle(NORMAL);
    textSize(11);
    fill(70);
    text(n.def, panelX + 8, panelY + 20, panelW - 16, 30);
  }

  // Legend
  let legendY = drawHeight - 22;
  noStroke();
  textSize(10);
  textAlign(LEFT, CENTER);
  let lx = margin;
  fill(70, 130, 200); ellipse(lx + 6, legendY, 12, 12);
  fill(40); text('Hash', lx + 16, legendY);
  lx += 60;
  fill(50, 160, 80); ellipse(lx + 6, legendY, 12, 12);
  fill(40); text('Encryption', lx + 16, legendY);
  lx += 90;
  fill(220, 140, 40); ellipse(lx + 6, legendY, 12, 12);
  fill(40); text('Application', lx + 16, legendY);

  // Control region
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();
  fill(80);
  textSize(12);
  textAlign(CENTER, CENTER);
  text('Click nodes to highlight connections', canvasWidth / 2, drawHeight + controlHeight / 2);
}

function mousePressed() {
  for (let i = 0; i < nodes.length; i++) {
    let pos = nodePos(i);
    if (dist(mouseX, mouseY, pos.x, pos.y) < 22) {
      selectedNode = (selectedNode === i) ? -1 : i;
      return;
    }
  }
  selectedNode = -1;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
  containerWidth = select('main').width;
  canvasWidth = containerWidth;
}
