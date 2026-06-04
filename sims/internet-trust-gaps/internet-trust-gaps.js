// Internet Protocol Stack and Trust Gaps
// Chapter 1: Trust and Digital Networks
let containerWidth;
let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

let trustToggle;
let showTrust = false;
let hoveredLayer = -1;

const layers = [
  {
    name: 'Application',
    protocols: 'HTTP, FTP, SMTP, DNS',
    trustGap: 'Data can be read or modified by any intermediary',
    attack: 'Phishing attack: Fake website mimics legitimate bank login',
    overlay: 'TLS/SSL encryption, HTTPS',
    color: [100, 149, 237],
  },
  {
    name: 'Transport',
    protocols: 'TCP, UDP',
    trustGap: 'No guarantee sender is who they claim to be',
    attack: 'Session hijacking: Attacker takes over established TCP session',
    overlay: 'TLS handshake, certificate verification',
    color: [72, 209, 204],
  },
  {
    name: 'Network',
    protocols: 'IP, ICMP, ARP',
    trustGap: 'Packets can be intercepted at any routing hop',
    attack: 'Man-in-the-middle: Attacker intercepts traffic between two parties',
    overlay: 'IPSec, VPN tunneling',
    color: [255, 165, 79],
  },
  {
    name: 'Link',
    protocols: 'Ethernet, Wi-Fi, PPP',
    trustGap: 'Physical medium can be tapped or spoofed',
    attack: 'ARP spoofing: Attacker redirects local network traffic',
    overlay: 'WPA3, MAC filtering, 802.1X',
    color: [205, 133, 198],
  }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  trustToggle = createButton('Show With Trust Overlay');
  trustToggle.parent(document.querySelector('main'));
  trustToggle.mousePressed(() => {
    showTrust = !showTrust;
    trustToggle.html(showTrust ? 'Show Without Trust' : 'Show With Trust Overlay');
  });
}

function draw() {
  updateCanvasSize();

  // Draw region
  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  // Title
  fill(40);
  noStroke();
  textSize(18);
  textAlign(CENTER, TOP);
  text('TCP/IP Protocol Stack — Trust Gaps', canvasWidth / 2, 12);

  // Determine hovered layer
  hoveredLayer = -1;
  let layerH = 90;
  let startY = 50;
  let layerW = canvasWidth - margin * 2;
  for (let i = 0; i < layers.length; i++) {
    let ly = startY + i * (layerH + 8);
    if (mouseX > margin && mouseX < margin + layerW &&
        mouseY > ly && mouseY < ly + layerH) {
      hoveredLayer = i;
    }
  }

  // Draw layers
  for (let i = 0; i < layers.length; i++) {
    let ly = startY + i * (layerH + 8);
    let layer = layers[i];
    let c = layer.color;

    // Layer background
    strokeWeight(2);
    stroke(c[0], c[1], c[2]);
    if (hoveredLayer === i) {
      fill(c[0], c[1], c[2], 40);
    } else {
      fill(c[0], c[1], c[2], 20);
    }
    rect(margin, ly, layerW, layerH, 6);

    noStroke();
    textAlign(LEFT, TOP);

    // Layer name and protocols
    fill(40);
    textSize(15);
    textStyle(BOLD);
    text(layer.name + ' Layer', margin + 12, ly + 8);
    textStyle(NORMAL);
    textSize(12);
    fill(80);
    text('Protocols: ' + layer.protocols, margin + 12, ly + 28);

    if (showTrust) {
      // Trust overlay
      fill(34, 139, 34);
      textSize(12);
      text('✓ ' + layer.overlay, margin + 12, ly + 48);

      // Green check icon
      fill(34, 139, 34);
      textSize(22);
      textAlign(RIGHT, CENTER);
      text('✓', margin + layerW - 12, ly + layerH / 2);
    } else {
      // Trust gap
      fill(180, 40, 40);
      textSize(12);
      text('⚠ ' + layer.trustGap, margin + 12, ly + 48);

      // Red warning icon
      fill(200, 40, 40);
      textSize(22);
      textAlign(RIGHT, CENTER);
      text('⚠', margin + layerW - 12, ly + layerH / 2);
    }

    // Connection arrow between layers
    if (i < layers.length - 1) {
      let arrowY = ly + layerH + 1;
      stroke(150);
      strokeWeight(1);
      line(canvasWidth / 2, arrowY, canvasWidth / 2, arrowY + 6);
      fill(150);
      noStroke();
      triangle(canvasWidth / 2 - 4, arrowY + 4, canvasWidth / 2 + 4, arrowY + 4, canvasWidth / 2, arrowY + 8);
    }
  }

  // Tooltip for hovered layer
  if (hoveredLayer >= 0) {
    let layer = layers[hoveredLayer];
    let tipW = min(canvasWidth - 20, 340);
    let tipH = 52;
    let tipX = constrain(mouseX + 10, 10, canvasWidth - tipW - 10);
    let tipY = constrain(mouseY - tipH - 10, 10, drawHeight - tipH - 10);

    fill(50, 50, 50, 230);
    noStroke();
    rect(tipX, tipY, tipW, tipH, 6);
    fill(255);
    textSize(12);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    text('Attack Example:', tipX + 8, tipY + 8);
    textStyle(NORMAL);
    text(layer.attack, tipX + 8, tipY + 26, tipW - 16, 30);
  }

  // Control region
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Status text in control area
  noStroke();
  fill(60);
  textSize(13);
  textAlign(CENTER, CENTER);
  let modeLabel = showTrust ? 'Viewing: With Trust Overlay' : 'Viewing: Without Trust (raw stack)';
  text(modeLabel, canvasWidth / 2, drawHeight + controlHeight / 2);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
  containerWidth = select('main').width;
  canvasWidth = containerWidth;
}
