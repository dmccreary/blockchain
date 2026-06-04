// Digital Signature Process
// Chapter 3: Keys, Signatures, and Identity
let containerWidth;
let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

let msgInput, signBtn, verifyBtn, tamperBtn, resetBtn;
let message = 'Hello, blockchain!';
let signed = false;
let verified = 0; // 0=none, 1=valid, -1=invalid
let tampered = false;
let signedHash = '';
let signedMsg = '';
let currentHash = '';
let signature = '';
let animStep = 0;
let animTimer = 0;
let animating = false;
let animType = ''; // 'sign' or 'verify'

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).toUpperCase().padStart(8, '0').substring(0, 8);
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  msgInput = createInput(message);
  msgInput.parent(document.querySelector('main'));
  msgInput.size(200);
  msgInput.input(() => {
    message = msgInput.value();
    if (signed && message !== signedMsg) {
      tampered = true;
    }
    verified = 0;
  });

  signBtn = createButton('Sign');
  signBtn.parent(document.querySelector('main'));
  signBtn.mousePressed(() => {
    animating = true;
    animType = 'sign';
    animStep = 0;
    animTimer = 0;
    verified = 0;
    tampered = false;
  });

  verifyBtn = createButton('Verify');
  verifyBtn.parent(document.querySelector('main'));
  verifyBtn.mousePressed(() => {
    if (!signed) return;
    animating = true;
    animType = 'verify';
    animStep = 0;
    animTimer = 0;
  });

  tamperBtn = createButton('Tamper');
  tamperBtn.parent(document.querySelector('main'));
  tamperBtn.mousePressed(() => {
    if (!signed) return;
    message = message + '!';
    msgInput.value(message);
    tampered = true;
    verified = 0;
  });

  resetBtn = createButton('Reset');
  resetBtn.parent(document.querySelector('main'));
  resetBtn.mousePressed(() => {
    message = 'Hello, blockchain!';
    msgInput.value(message);
    signed = false;
    verified = 0;
    tampered = false;
    signedHash = '';
    signature = '';
    animating = false;
  });
}

function draw() {
  updateCanvasSize();

  // Animation
  if (animating) {
    animTimer++;
    if (animTimer > 40) {
      animStep++;
      animTimer = 0;
      if (animType === 'sign' && animStep > 3) {
        signedMsg = message;
        signedHash = simpleHash(message);
        signature = simpleHash('PRV+' + signedHash);
        signed = true;
        animating = false;
      }
      if (animType === 'verify' && animStep > 3) {
        currentHash = simpleHash(message);
        let decryptedHash = signedHash;
        verified = (currentHash === decryptedHash) ? 1 : -1;
        animating = false;
      }
    }
  }

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  let halfW = canvasWidth / 2;

  // Title
  noStroke();
  fill(40);
  textSize(15);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text('Digital Signature Process', canvasWidth / 2, 6);
  textStyle(NORMAL);

  // Divider
  stroke(180);
  strokeWeight(1);
  line(halfW, 28, halfW, drawHeight - 10);

  // Panel headers
  noStroke();
  textSize(14);
  textStyle(BOLD);
  fill(70, 100, 180);
  textAlign(CENTER, TOP);
  text('Signing', halfW / 2, 30);
  fill(50, 140, 70);
  text('Verification', halfW + halfW / 2, 30);
  textStyle(NORMAL);

  let boxW = halfW - 30;
  let leftX = 15;
  let rightX = halfW + 15;
  let stepY = 60;
  let stepH = 70;

  // === SIGNING PANEL ===
  // Step 1: Message
  drawStepBox(leftX, stepY, boxW, stepH, '1', 'Message',
    message.substring(0, 20), [100, 149, 237],
    animType === 'sign' && animStep >= 0);

  // Step 2: Hash
  let hashVal = signed ? signedHash : (animType === 'sign' && animStep >= 1 ? simpleHash(message) : '--------');
  drawStepBox(leftX, stepY + stepH + 15, boxW, stepH, '2', 'Hash (SHA-256)',
    hashVal, [100, 149, 237],
    animType === 'sign' && animStep >= 1);

  // Arrow
  drawArrow(leftX + boxW / 2, stepY + stepH, stepY + stepH + 15);

  // Step 3: Encrypt with Private Key
  let sigVal = signed ? signature : (animType === 'sign' && animStep >= 2 ? simpleHash('PRV+' + simpleHash(message)) : '--------');
  drawStepBox(leftX, stepY + (stepH + 15) * 2, boxW, stepH, '3', 'Encrypt w/ Private Key',
    'Sig: ' + sigVal, [100, 149, 237],
    animType === 'sign' && animStep >= 2);

  drawArrow(leftX + boxW / 2, stepY + stepH + (stepH + 15), stepY + (stepH + 15) * 2);

  // Key icon
  noStroke();
  textSize(22);
  textAlign(CENTER, CENTER);
  fill(180, 60, 60);
  text('🔒', leftX + boxW - 20, stepY + (stepH + 15) * 2 + stepH / 2);

  // === VERIFICATION PANEL ===
  // Step 1: Received message
  let recvMsg = signed ? message : '(not yet signed)';
  drawStepBox(rightX, stepY, boxW, stepH, '1', 'Received Message',
    recvMsg.substring(0, 20), [50, 160, 80],
    animType === 'verify' && animStep >= 0);

  // Step 2: Re-hash
  let rehash = (animType === 'verify' && animStep >= 1) ? simpleHash(message) : (verified !== 0 ? simpleHash(message) : '--------');
  drawStepBox(rightX, stepY + stepH + 15, boxW, stepH, '2', 'Re-Hash Message',
    rehash, [50, 160, 80],
    animType === 'verify' && animStep >= 1);

  drawArrow(rightX + boxW / 2, stepY + stepH, stepY + stepH + 15);

  // Step 3: Decrypt signature with public key
  let decVal = (animType === 'verify' && animStep >= 2) ? signedHash : (verified !== 0 ? signedHash : '--------');
  drawStepBox(rightX, stepY + (stepH + 15) * 2, boxW, stepH, '3', 'Decrypt w/ Public Key',
    'Hash: ' + decVal, [50, 160, 80],
    animType === 'verify' && animStep >= 2);

  drawArrow(rightX + boxW / 2, stepY + stepH + (stepH + 15), stepY + (stepH + 15) * 2);

  // Key icon
  noStroke();
  textSize(22);
  textAlign(CENTER, CENTER);
  fill(50, 140, 50);
  text('🔓', rightX + boxW - 20, stepY + (stepH + 15) * 2 + stepH / 2);

  // Comparison result
  let resultY = stepY + (stepH + 15) * 3 + 10;
  if (verified === 1) {
    fill(40, 160, 40);
    textSize(28);
    textAlign(CENTER, CENTER);
    text('✓', halfW + halfW / 2, resultY);
    textSize(14);
    text('Valid Signature', halfW + halfW / 2, resultY + 24);
  } else if (verified === -1) {
    fill(200, 50, 50);
    textSize(28);
    textAlign(CENTER, CENTER);
    text('✗', halfW + halfW / 2, resultY);
    textSize(14);
    text('Invalid — Tampered!', halfW + halfW / 2, resultY + 24);
  }

  // Tamper warning
  if (tampered && signed) {
    fill(200, 50, 50);
    textSize(11);
    textAlign(CENTER, BOTTOM);
    text('Message was modified after signing!', canvasWidth / 2, drawHeight - 5);
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
  text('Enter message, Sign, then Verify. Try Tamper to see failure.', canvasWidth / 2, drawHeight + controlHeight / 2);
}

function drawStepBox(x, y, w, h, stepNum, title, content, col, highlight) {
  strokeWeight(highlight ? 2.5 : 1);
  stroke(highlight ? color(col[0], col[1], col[2]) : color(180));
  fill(255, 255, 255, highlight ? 240 : 180);
  rect(x, y, w, h, 5);

  noStroke();
  // Step number circle
  fill(col[0], col[1], col[2]);
  ellipse(x + 16, y + 16, 22, 22);
  fill(255);
  textSize(12);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(stepNum, x + 16, y + 16);

  // Title
  fill(40);
  textSize(11);
  textAlign(LEFT, TOP);
  text(title, x + 32, y + 8);
  textStyle(NORMAL);

  // Content
  fill(70);
  textSize(10);
  text(content, x + 10, y + 35, w - 20, 30);
}

function drawArrow(x, y1, y2) {
  stroke(150);
  strokeWeight(1.5);
  line(x, y1 + 2, x, y2 - 2);
  fill(150);
  noStroke();
  triangle(x - 4, y2 - 6, x + 4, y2 - 6, x, y2 - 1);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
  containerWidth = select('main').width;
  canvasWidth = containerWidth;
}
