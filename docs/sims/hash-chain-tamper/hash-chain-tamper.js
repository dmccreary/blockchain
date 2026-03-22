// Hash Chain Visualization with Tamper Detection
// Chapter 2: Cryptographic Foundations
let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

let resetBtn, recalcBtn, speedSlider;
let blocks = [];
let editingBlock = -1;
let inputField;
let recalculating = false;
let recalcIndex = -1;
let recalcTimer = 0;

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    let ch = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + ch;
    hash |= 0;
  }
  let hex = Math.abs(hash).toString(16).toUpperCase();
  while (hex.length < 8) hex = '0' + hex;
  return hex.substring(0, 8);
}

function initBlocks() {
  blocks = [];
  let data = ['Genesis', 'Alice->Bob: 5', 'Bob->Carol: 3', 'Carol->Dan: 2', 'Dan->Eve: 1'];
  for (let i = 0; i < data.length; i++) {
    let prevHash = i === 0 ? '00000000' : blocks[i - 1].hash;
    let content = data[i];
    let hash = simpleHash(prevHash + content);
    blocks.push({
      index: i,
      data: content,
      prevHash: prevHash,
      hash: hash,
      valid: true
    });
  }
}

function validateChain() {
  for (let i = 0; i < blocks.length; i++) {
    let prevHash = i === 0 ? '00000000' : blocks[i - 1].hash;
    let expectedHash = simpleHash(prevHash + blocks[i].data);
    blocks[i].prevHash = prevHash;
    blocks[i].valid = (blocks[i].hash === expectedHash && blocks[i].prevHash === (i === 0 ? '00000000' : blocks[i - 1].hash));
  }
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  resetBtn = createButton('Reset');
  resetBtn.parent(document.querySelector('main'));
  resetBtn.mousePressed(() => {
    initBlocks();
    editingBlock = -1;
    if (inputField) inputField.hide();
    recalculating = false;
  });

  recalcBtn = createButton('Recalculate Chain');
  recalcBtn.parent(document.querySelector('main'));
  recalcBtn.mousePressed(() => {
    recalculating = true;
    recalcIndex = 0;
    // find first invalid
    for (let i = 0; i < blocks.length; i++) {
      let prevHash = i === 0 ? '00000000' : blocks[i - 1].hash;
      let expected = simpleHash(prevHash + blocks[i].data);
      if (blocks[i].hash !== expected) {
        recalcIndex = i;
        break;
      }
    }
    recalcTimer = 0;
  });

  speedSlider = createSlider(1, 10, 5, 1);
  speedSlider.parent(document.querySelector('main'));

  inputField = createInput('');
  inputField.parent(document.querySelector('main'));
  inputField.hide();
  inputField.input(onFieldInput);

  initBlocks();
}

function onFieldInput() {
  if (editingBlock >= 0 && editingBlock < blocks.length) {
    blocks[editingBlock].data = inputField.value();
    // Invalidate from this block onward
    for (let i = editingBlock; i < blocks.length; i++) {
      let prevHash = i === 0 ? '00000000' : blocks[i - 1].hash;
      let expected = simpleHash(prevHash + blocks[i].data);
      if (blocks[i].hash !== expected) {
        blocks[i].valid = false;
      }
    }
    validateChain();
  }
}

function draw() {
  updateCanvasSize();

  // Recalculation animation
  if (recalculating && recalcIndex < blocks.length) {
    recalcTimer += speedSlider.value() * 0.5;
    if (recalcTimer > 30) {
      let prevHash = recalcIndex === 0 ? '00000000' : blocks[recalcIndex - 1].hash;
      blocks[recalcIndex].prevHash = prevHash;
      blocks[recalcIndex].hash = simpleHash(prevHash + blocks[recalcIndex].data);
      blocks[recalcIndex].valid = true;
      recalcIndex++;
      recalcTimer = 0;
      if (recalcIndex >= blocks.length) {
        recalculating = false;
        validateChain();
      }
    }
  }

  // Draw region
  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  // Title
  noStroke();
  fill(40);
  textSize(16);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text('Hash Chain — Tamper Detection', canvasWidth / 2, 8);
  textStyle(NORMAL);

  // Count invalid blocks
  let invalidCount = blocks.filter(b => !b.valid).length;
  textSize(12);
  fill(invalidCount > 0 ? color(200, 50, 50) : color(50, 150, 50));
  text('Blocks to recalculate: ' + invalidCount, canvasWidth / 2, 30);

  // Draw blocks
  let numBlocks = blocks.length;
  let blockW = min(120, (canvasWidth - margin * 2 - (numBlocks - 1) * 20) / numBlocks);
  let blockH = 280;
  let totalW = numBlocks * blockW + (numBlocks - 1) * 20;
  let startX = (canvasWidth - totalW) / 2;
  let blockY = 50;

  for (let i = 0; i < numBlocks; i++) {
    let bx = startX + i * (blockW + 20);
    let b = blocks[i];
    let isRecalcTarget = recalculating && i === recalcIndex;

    // Block border
    strokeWeight(2);
    if (isRecalcTarget) {
      stroke(255, 165, 0);
      fill(255, 250, 230);
    } else if (b.valid) {
      stroke(50, 150, 50);
      fill(240, 255, 240);
    } else {
      stroke(200, 50, 50);
      fill(255, 235, 235);
    }
    rect(bx, blockY, blockW, blockH, 6);

    // Block content
    noStroke();
    fill(40);
    textSize(11);
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    text('Block ' + i, bx + blockW / 2, blockY + 6);
    textStyle(NORMAL);

    // Previous hash
    textSize(9);
    fill(100);
    textAlign(LEFT, TOP);
    text('Prev:', bx + 4, blockY + 28);
    fill(60);
    textSize(8);
    text(b.prevHash, bx + 4, blockY + 40, blockW - 8, 20);

    // Data field (clickable)
    let dataY = blockY + 65;
    let dataH = 100;
    fill(255, 255, 240);
    stroke(180);
    strokeWeight(1);
    rect(bx + 4, dataY, blockW - 8, dataH, 3);

    noStroke();
    fill(100);
    textSize(9);
    textAlign(LEFT, TOP);
    text('Data:', bx + 8, dataY + 4);
    fill(40);
    textSize(10);
    text(b.data, bx + 8, dataY + 18, blockW - 16, dataH - 22);

    // Click hint
    if (editingBlock !== i) {
      fill(150);
      textSize(8);
      textAlign(CENTER, BOTTOM);
      text('click to edit', bx + blockW / 2, dataY + dataH - 2);
    }

    // Hash
    let hashY = blockY + 180;
    noStroke();
    fill(100);
    textSize(9);
    textAlign(LEFT, TOP);
    text('Hash:', bx + 4, hashY);
    fill(b.valid ? color(50, 130, 50) : color(200, 50, 50));
    textStyle(BOLD);
    textSize(9);
    text(b.hash, bx + 4, hashY + 14, blockW - 8, 20);
    textStyle(NORMAL);

    // Status icon
    textSize(20);
    textAlign(CENTER, TOP);
    if (b.valid) {
      fill(50, 150, 50);
      text('✓', bx + blockW / 2, hashY + 35);
    } else {
      fill(200, 50, 50);
      text('⚠', bx + blockW / 2, hashY + 35);
    }

    // Arrow to next block
    if (i < numBlocks - 1) {
      let arrowX = bx + blockW + 2;
      let arrowEndX = arrowX + 16;
      let arrowY = blockY + blockH / 2;
      stroke(120);
      strokeWeight(2);
      line(arrowX, arrowY, arrowEndX, arrowY);
      fill(120);
      noStroke();
      triangle(arrowEndX, arrowY - 4, arrowEndX, arrowY + 4, arrowEndX + 5, arrowY);
    }
  }

  // Position input field if editing
  if (editingBlock >= 0) {
    let bx = startX + editingBlock * (blockW + 20);
    let dataY = blockY + 65;
    inputField.position(bx + 6, dataY + 16);
    inputField.size(blockW - 14, 20);
  }

  // Control region
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();
  fill(80);
  textSize(11);
  textAlign(LEFT, CENTER);
  text('Speed:', margin, drawHeight + controlHeight / 2);
}

function mousePressed() {
  let numBlocks = blocks.length;
  let blockW = min(120, (canvasWidth - margin * 2 - (numBlocks - 1) * 20) / numBlocks);
  let blockH = 280;
  let totalW = numBlocks * blockW + (numBlocks - 1) * 20;
  let startX = (canvasWidth - totalW) / 2;
  let blockY = 50;
  let dataY = blockY + 65;
  let dataH = 100;

  let clicked = -1;
  for (let i = 0; i < numBlocks; i++) {
    let bx = startX + i * (blockW + 20);
    if (mouseX > bx + 4 && mouseX < bx + blockW - 4 &&
        mouseY > dataY && mouseY < dataY + dataH) {
      clicked = i;
      break;
    }
  }

  if (clicked >= 0) {
    editingBlock = clicked;
    inputField.value(blocks[clicked].data);
    inputField.show();
  } else {
    editingBlock = -1;
    inputField.hide();
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
