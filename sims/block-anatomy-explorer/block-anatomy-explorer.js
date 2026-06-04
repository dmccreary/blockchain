// Block Anatomy Explorer
// Chapter 5: Distributed Systems and Ledgers
let containerWidth;
let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

let formatSelect, merkleBtn, resetBtn;
let selectedField = -1;
let showMerkle = false;
let blockFormat = 'bitcoin';

const btcHeader = [
  { name: 'Version', value: '0x20000000', desc: 'Block version number indicating which validation rules to follow' },
  { name: 'Previous Block Hash', value: '00000000000000000003a...', desc: 'SHA-256d hash of the previous block header, creating the chain link' },
  { name: 'Merkle Root', value: '4a5e1e4baab89f3a32518...', desc: 'Root hash of Merkle tree of all transactions in this block' },
  { name: 'Timestamp', value: '2024-01-15 14:23:07 UTC', desc: 'Approximate creation time (seconds since Unix epoch)' },
  { name: 'Difficulty Target', value: '0x1703a4cd (bits)', desc: 'Compact representation of the target hash threshold' },
  { name: 'Nonce', value: '2,083,236,893', desc: 'Counter iterated by miners to find a hash below the target' }
];

const ethHeader = [
  { name: 'Parent Hash', value: '0x5e9a0a5b8e71c89f7...', desc: 'Keccak-256 hash of the parent block header' },
  { name: 'State Root', value: '0xd7f8974fb5ac78d9a...', desc: 'Root hash of the world state trie after all transactions' },
  { name: 'Transactions Root', value: '0x56e81f171bcc55a6f...', desc: 'Root hash of the transaction trie for this block' },
  { name: 'Receipts Root', value: '0x1dcc4de8dec75d7aa...', desc: 'Root hash of transaction receipts trie' },
  { name: 'Block Number', value: '19,234,567', desc: 'Sequential block number (height) in the chain' },
  { name: 'Gas Used / Gas Limit', value: '15.2M / 30M', desc: 'Total gas consumed and maximum gas allowed in this block' },
  { name: 'Base Fee', value: '25.3 Gwei', desc: 'EIP-1559 base fee that is burned per unit of gas' },
  { name: 'Timestamp', value: '2024-01-15 14:23:19 UTC', desc: 'Block creation time (12-second slot)' }
];

const transactions = [
  { from: 'Alice', to: 'Bob', amount: '0.5 BTC', hash: 'a1b2c3d4' },
  { from: 'Carol', to: 'Dan', amount: '1.2 BTC', hash: 'e5f6a7b8' },
  { from: 'Eve', to: 'Frank', amount: '0.05 BTC', hash: 'c9d0e1f2' },
  { from: 'Grace', to: 'Heidi', amount: '2.0 BTC', hash: '34567890' }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  formatSelect = createSelect();
  formatSelect.parent(document.querySelector('main'));
  formatSelect.option('Bitcoin');
  formatSelect.option('Ethereum');
  formatSelect.changed(() => {
    blockFormat = formatSelect.value().toLowerCase();
    selectedField = -1;
  });

  merkleBtn = createButton('Show Merkle Tree');
  merkleBtn.parent(document.querySelector('main'));
  merkleBtn.mousePressed(() => {
    showMerkle = !showMerkle;
    merkleBtn.html(showMerkle ? 'Hide Merkle Tree' : 'Show Merkle Tree');
  });

  resetBtn = createButton('Reset');
  resetBtn.parent(document.querySelector('main'));
  resetBtn.mousePressed(() => {
    selectedField = -1;
    showMerkle = false;
    merkleBtn.html('Show Merkle Tree');
  });
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  let header = blockFormat === 'bitcoin' ? btcHeader : ethHeader;
  let headerColor = [70, 120, 200];
  let bodyColor = [60, 160, 80];

  // Title
  noStroke();
  fill(40);
  textSize(15);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text('Block Anatomy — ' + (blockFormat === 'bitcoin' ? 'Bitcoin' : 'Ethereum'), canvasWidth / 2, 6);
  textStyle(NORMAL);

  let blockX = margin;
  let blockW = showMerkle ? canvasWidth * 0.55 : canvasWidth - margin * 2;
  let blockY = 30;

  // Header section
  let headerH = header.length * 28 + 30;
  strokeWeight(2);
  stroke(headerColor[0], headerColor[1], headerColor[2]);
  fill(headerColor[0], headerColor[1], headerColor[2], 20);
  rect(blockX, blockY, blockW, headerH, 6, 6, 0, 0);

  noStroke();
  fill(headerColor[0], headerColor[1], headerColor[2]);
  textSize(12);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('HEADER', blockX + 10, blockY + 6);
  textStyle(NORMAL);

  // Header fields
  for (let i = 0; i < header.length; i++) {
    let fy = blockY + 26 + i * 28;
    let isHovered = mouseX > blockX + 6 && mouseX < blockX + blockW - 6 &&
                    mouseY > fy && mouseY < fy + 26;
    let isSelected = selectedField === i;

    if (isSelected) {
      fill(headerColor[0], headerColor[1], headerColor[2], 30);
    } else if (isHovered) {
      fill(headerColor[0], headerColor[1], headerColor[2], 15);
    } else {
      fill(255, 255, 255, 60);
    }
    noStroke();
    rect(blockX + 6, fy, blockW - 12, 26, 3);

    fill(60);
    textSize(10);
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    text(header[i].name, blockX + 12, fy + 13);
    textStyle(NORMAL);
    fill(100);
    textAlign(RIGHT, CENTER);
    let valTrunc = header[i].value.substring(0, 22);
    text(valTrunc, blockX + blockW - 12, fy + 13);
  }

  // Body section
  let bodyY = blockY + headerH;
  let bodyH = transactions.length * 26 + 30;
  strokeWeight(2);
  stroke(bodyColor[0], bodyColor[1], bodyColor[2]);
  fill(bodyColor[0], bodyColor[1], bodyColor[2], 20);
  rect(blockX, bodyY, blockW, bodyH, 0, 0, 6, 6);

  noStroke();
  fill(bodyColor[0], bodyColor[1], bodyColor[2]);
  textSize(12);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('BODY — Transactions', blockX + 10, bodyY + 6);
  textStyle(NORMAL);

  for (let i = 0; i < transactions.length; i++) {
    let ty = bodyY + 26 + i * 26;
    let tx = transactions[i];
    fill(60);
    textSize(10);
    textAlign(LEFT, CENTER);
    text(tx.from + ' → ' + tx.to + ': ' + tx.amount, blockX + 14, ty + 13);
    fill(140);
    textAlign(RIGHT, CENTER);
    text('#' + tx.hash, blockX + blockW - 12, ty + 13);
  }

  // Previous block ghost
  if (selectedField === (blockFormat === 'bitcoin' ? 1 : 0)) {
    let ghostX = blockX - 60;
    let ghostW = 50;
    fill(200, 200, 200, 80);
    stroke(180);
    strokeWeight(1);
    rect(ghostX, blockY + 20, ghostW, 60, 4);
    noStroke();
    fill(160);
    textSize(9);
    textAlign(CENTER, CENTER);
    text('Prev\nBlock', ghostX + ghostW / 2, blockY + 50);
    stroke(180);
    strokeWeight(1.5);
    line(ghostX + ghostW, blockY + 50, blockX, blockY + 50);
    fill(180);
    noStroke();
    triangle(blockX - 5, blockY + 50, blockX - 10, blockY + 46, blockX - 10, blockY + 54);
  }

  // Selected field description
  if (selectedField >= 0 && selectedField < header.length) {
    let descY = bodyY + bodyH + 8;
    let descW = blockW;
    fill(255, 255, 240);
    stroke(200);
    strokeWeight(1);
    rect(blockX, descY, descW, 50, 5);
    noStroke();
    fill(40);
    textSize(11);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text(header[selectedField].name, blockX + 8, descY + 4);
    textStyle(NORMAL);
    fill(70);
    textSize(10);
    text(header[selectedField].desc, blockX + 8, descY + 20, descW - 16, 28);
  }

  // Merkle tree
  if (showMerkle) {
    let treeX = blockX + blockW + 15;
    let treeW = canvasWidth - treeX - margin;
    let treeY = blockY + 20;

    noStroke();
    fill(220, 150, 40);
    textSize(11);
    textStyle(BOLD);
    textAlign(CENTER, TOP);
    text('Merkle Tree', treeX + treeW / 2, treeY);
    textStyle(NORMAL);

    // Leaf hashes
    let leafY = treeY + 140;
    let leafSpacing = treeW / 4;
    for (let i = 0; i < 4; i++) {
      let lx = treeX + leafSpacing * i + leafSpacing / 2;
      fill(220, 150, 40, 30);
      stroke(220, 150, 40);
      strokeWeight(1);
      rect(lx - 20, leafY, 40, 22, 3);
      noStroke();
      fill(100);
      textSize(8);
      textAlign(CENTER, CENTER);
      text('H(' + transactions[i].hash + ')', lx, leafY + 11);
    }

    // Intermediate hashes
    let midY = treeY + 90;
    for (let i = 0; i < 2; i++) {
      let mx = treeX + leafSpacing * (i * 2 + 1);
      fill(220, 150, 40, 20);
      stroke(220, 150, 40);
      strokeWeight(1);
      rect(mx - 24, midY, 48, 22, 3);
      noStroke();
      fill(100);
      textSize(8);
      textAlign(CENTER, CENTER);
      text('H(H0+H1)', mx, midY + 11);

      // Lines to leaves
      stroke(200, 150, 40, 100);
      strokeWeight(1);
      line(mx, midY + 22, treeX + leafSpacing * (i * 2) + leafSpacing / 2, leafY);
      line(mx, midY + 22, treeX + leafSpacing * (i * 2 + 1) + leafSpacing / 2, leafY);
    }

    // Root
    let rootX = treeX + treeW / 2;
    let rootY = treeY + 40;
    fill(220, 150, 40, 40);
    stroke(220, 150, 40);
    strokeWeight(2);
    rect(rootX - 30, rootY, 60, 24, 3);
    noStroke();
    fill(60);
    textSize(9);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text('Merkle Root', rootX, rootY + 12);
    textStyle(NORMAL);

    // Lines to intermediates
    stroke(200, 150, 40, 100);
    strokeWeight(1);
    line(rootX, rootY + 24, treeX + leafSpacing, midY);
    line(rootX, rootY + 24, treeX + leafSpacing * 3, midY);
  }

  // Control region
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();
  fill(80);
  textSize(11);
  textAlign(CENTER, CENTER);
  text('Click header fields to see descriptions', canvasWidth / 2, drawHeight + controlHeight / 2);
}

function mousePressed() {
  let header = blockFormat === 'bitcoin' ? btcHeader : ethHeader;
  let blockX = margin;
  let blockW = showMerkle ? canvasWidth * 0.55 : canvasWidth - margin * 2;
  let blockY = 30;

  for (let i = 0; i < header.length; i++) {
    let fy = blockY + 26 + i * 28;
    if (mouseX > blockX + 6 && mouseX < blockX + blockW - 6 &&
        mouseY > fy && mouseY < fy + 26) {
      selectedField = (selectedField === i) ? -1 : i;
      return;
    }
  }
  selectedField = -1;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
  containerWidth = select('main').width;
  canvasWidth = containerWidth;
}
