// Certificate Chain of Trust
// Chapter 4: Certificate Authorities and PKI
let containerWidth;
let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

let verifyBtn, breakBtn, resetBtn;
let expandedCard = -1;
let verifyStep = -1;
let verifyTimer = 0;
let verifying = false;
let chainBroken = false;
let verifyResults = [-1, -1, -1]; // -1=unchecked, 0=fail, 1=pass

const certs = [
  {
    level: 'Root CA',
    subject: 'GlobalTrust Root CA',
    issuer: 'Self-signed',
    keyBits: 'RSA 4096-bit',
    sig: 'Self-signed SHA-256',
    detail: 'Pre-installed in operating systems and browsers. Highest level of trust anchor.',
    color: [70, 100, 180]
  },
  {
    level: 'Intermediate CA',
    subject: 'SecureWeb Intermediate CA',
    issuer: 'GlobalTrust Root CA',
    keyBits: 'RSA 2048-bit',
    sig: 'SHA-256 signed by Root',
    detail: 'Issued by Root CA. Limits blast radius if compromised. Can be revoked without affecting Root.',
    color: [60, 150, 130]
  },
  {
    level: 'End Entity',
    subject: 'www.example.com',
    issuer: 'SecureWeb Intermediate CA',
    keyBits: 'RSA 2048-bit',
    sig: 'SHA-256 signed by Intermediate',
    detail: 'Website certificate. Proves server identity to browsers. Short validity period (90 days - 1 year).',
    color: [180, 120, 50]
  }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  verifyBtn = createButton('Verify Chain');
  verifyBtn.parent(document.querySelector('main'));
  verifyBtn.mousePressed(() => {
    verifying = true;
    verifyStep = 2; // start from end entity, go up
    verifyTimer = 0;
    verifyResults = [-1, -1, -1];
  });

  breakBtn = createButton('Break Chain');
  breakBtn.parent(document.querySelector('main'));
  breakBtn.mousePressed(() => {
    chainBroken = true;
    verifyResults = [-1, -1, -1];
    verifying = false;
    verifyStep = -1;
  });

  resetBtn = createButton('Reset');
  resetBtn.parent(document.querySelector('main'));
  resetBtn.mousePressed(() => {
    chainBroken = false;
    verifying = false;
    verifyStep = -1;
    verifyResults = [-1, -1, -1];
    expandedCard = -1;
  });
}

function draw() {
  updateCanvasSize();

  // Verification animation
  if (verifying) {
    verifyTimer++;
    if (verifyTimer > 50) {
      if (verifyStep >= 0) {
        if (chainBroken && verifyStep === 1) {
          verifyResults[verifyStep] = 0;
          verifying = false;
        } else {
          verifyResults[verifyStep] = 1;
          verifyStep--;
          if (verifyStep < 0) verifying = false;
        }
        verifyTimer = 0;
      }
    }
  }

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  // Title
  noStroke();
  fill(40);
  textSize(15);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text('Certificate Chain of Trust', canvasWidth / 2, 8);
  textStyle(NORMAL);

  let cardW = min(canvasWidth - 50, 360);
  let cardH = 90;
  let expandedH = 140;
  let cardX = canvasWidth / 2 - cardW / 2;
  let startY = 40;
  let gap = 20;

  for (let i = 0; i < certs.length; i++) {
    let cert = certs[i];
    let isExpanded = expandedCard === i;
    let h = isExpanded ? expandedH : cardH;

    // Calculate Y position accounting for expanded cards above
    let cy = startY;
    for (let j = 0; j < i; j++) {
      cy += (expandedCard === j ? expandedH : cardH) + gap;
    }

    // Glow effect based on verification
    if (verifyResults[i] === 1) {
      noStroke();
      fill(50, 200, 50, 30);
      rect(cardX - 4, cy - 4, cardW + 8, h + 8, 10);
    } else if (verifyResults[i] === 0) {
      noStroke();
      fill(200, 50, 50, 30);
      rect(cardX - 4, cy - 4, cardW + 8, h + 8, 10);
    }

    // Broken indicator
    let isBrokenCert = chainBroken && i === 1;

    // Card
    strokeWeight(2);
    stroke(isBrokenCert ? color(200, 50, 50) : color(cert.color[0], cert.color[1], cert.color[2]));
    fill(255, 255, 255, 240);
    rect(cardX, cy, cardW, h, 8);

    // Level badge
    noStroke();
    fill(cert.color[0], cert.color[1], cert.color[2]);
    rect(cardX, cy, 8, h, 8, 0, 0, 8);

    // Content
    fill(40);
    textSize(13);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text(cert.level, cardX + 18, cy + 8);
    textStyle(NORMAL);

    textSize(11);
    fill(70);
    text('Subject: ' + cert.subject, cardX + 18, cy + 28);
    text('Issuer: ' + cert.issuer, cardX + 18, cy + 44);

    // Key and signature icons on right
    textAlign(RIGHT, TOP);
    fill(100);
    textSize(10);
    text('🔑 ' + cert.keyBits, cardX + cardW - 10, cy + 28);
    text('✍ ' + cert.sig, cardX + cardW - 10, cy + 44);

    if (isBrokenCert) {
      fill(200, 50, 50);
      textSize(11);
      textStyle(BOLD);
      textAlign(CENTER, TOP);
      text('⚠ INVALID CERTIFICATE', cardX + cardW / 2, cy + 62);
      textStyle(NORMAL);
    }

    // Expanded details
    if (isExpanded) {
      fill(60);
      textSize(11);
      textAlign(LEFT, TOP);
      text(cert.detail, cardX + 18, cy + (isBrokenCert ? 78 : 68), cardW - 36, 60);
    }

    // Verification icon
    if (verifyResults[i] === 1) {
      fill(40, 180, 40);
      textSize(24);
      textAlign(CENTER, CENTER);
      text('✓', cardX + cardW - 30, cy + h / 2);
    } else if (verifyResults[i] === 0) {
      fill(200, 50, 50);
      textSize(24);
      textAlign(CENTER, CENTER);
      text('✗', cardX + cardW - 30, cy + h / 2);
    }

    // Currently verifying indicator
    if (verifying && verifyStep === i) {
      fill(255, 180, 0, 150 + sin(frameCount * 0.15) * 100);
      noStroke();
      ellipse(cardX + cardW - 30, cy + h / 2, 20, 20);
    }

    // Signing arrow (downward) between cards
    if (i < certs.length - 1) {
      let arrowStartY = cy + h + 2;
      let arrowEndY = arrowStartY + gap - 4;
      let arrowX = cardX + 40;

      stroke(cert.color[0], cert.color[1], cert.color[2]);
      strokeWeight(2);
      line(arrowX, arrowStartY, arrowX, arrowEndY);
      fill(cert.color[0], cert.color[1], cert.color[2]);
      noStroke();
      triangle(arrowX - 4, arrowEndY - 4, arrowX + 4, arrowEndY - 4, arrowX, arrowEndY);

      // Arrow label
      fill(100);
      textSize(9);
      textAlign(LEFT, CENTER);
      noStroke();
      text('signs ↓', arrowX + 10, (arrowStartY + arrowEndY) / 2);

      // Verify arrow (upward) on right side
      let vx = cardX + cardW - 40;
      stroke(100, 200, 100, 120);
      strokeWeight(1.5);
      drawingContext.setLineDash([3, 3]);
      line(vx, arrowEndY, vx, arrowStartY);
      drawingContext.setLineDash([]);
      fill(100, 200, 100, 120);
      noStroke();
      triangle(vx - 3, arrowStartY + 4, vx + 3, arrowStartY + 4, vx, arrowStartY);

      fill(100, 180, 100);
      textSize(9);
      textAlign(RIGHT, CENTER);
      text('↑ verifies', vx - 10, (arrowStartY + arrowEndY) / 2);
    }
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
  text('Click cards to expand. Verify chain or break intermediate cert.', canvasWidth / 2, drawHeight + controlHeight / 2);
}

function mousePressed() {
  let cardW = min(canvasWidth - 50, 360);
  let cardH = 90;
  let expandedH = 140;
  let cardX = canvasWidth / 2 - cardW / 2;
  let startY = 40;
  let gap = 20;

  for (let i = 0; i < certs.length; i++) {
    let h = expandedCard === i ? expandedH : cardH;
    let cy = startY;
    for (let j = 0; j < i; j++) {
      cy += (expandedCard === j ? expandedH : cardH) + gap;
    }
    if (mouseX > cardX && mouseX < cardX + cardW && mouseY > cy && mouseY < cy + h) {
      expandedCard = (expandedCard === i) ? -1 : i;
      return;
    }
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
