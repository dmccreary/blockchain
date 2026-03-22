// Client-Server vs Peer-to-Peer Network Topology
// Chapter 1: Trust and Digital Networks
let containerWidth;
let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

let resetBtn, animateBtn;
let csNodes = [];
let p2pNodes = [];
let animating = false;
let packets = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  resetBtn = createButton('Reset');
  resetBtn.parent(document.querySelector('main'));
  resetBtn.mousePressed(resetNetwork);

  animateBtn = createButton('Animate Data Flow');
  animateBtn.parent(document.querySelector('main'));
  animateBtn.mousePressed(startAnimation);

  resetNetwork();
}

function resetNetwork() {
  animating = false;
  packets = [];
  csNodes = [];
  p2pNodes = [];

  // Client-server: server at center, clients in circle
  let halfW = canvasWidth / 2;
  let cx = halfW / 2;
  let cy = drawHeight / 2 + 20;
  let r = min(halfW, drawHeight) * 0.3;

  csNodes.push({ x: cx, y: cy, label: 'S', active: true, isServer: true, r: 22 });
  for (let i = 0; i < 8; i++) {
    let angle = (TWO_PI / 8) * i - HALF_PI;
    csNodes.push({
      x: cx + cos(angle) * r,
      y: cy + sin(angle) * r,
      label: '' + (i + 1),
      active: true,
      isServer: false,
      r: 14
    });
  }

  // P2P: nodes in circle with mesh connections
  let px = halfW + halfW / 2;
  let py = drawHeight / 2 + 20;
  for (let i = 0; i < 8; i++) {
    let angle = (TWO_PI / 8) * i - HALF_PI;
    p2pNodes.push({
      x: px + cos(angle) * r,
      y: py + sin(angle) * r,
      label: '' + (i + 1),
      active: true,
      r: 16
    });
  }
}

function startAnimation() {
  animating = true;
  packets = [];
  // CS packets: server to random clients
  for (let i = 1; i < csNodes.length; i++) {
    if (csNodes[0].active && csNodes[i].active) {
      packets.push({ from: csNodes[0], to: csNodes[i], t: random(0, 0.5), type: 'cs' });
    }
  }
  // P2P packets: random node pairs
  for (let i = 0; i < 6; i++) {
    let a = floor(random(p2pNodes.length));
    let b = floor(random(p2pNodes.length));
    if (a !== b && p2pNodes[a].active && p2pNodes[b].active) {
      packets.push({ from: p2pNodes[a], to: p2pNodes[b], t: random(0, 0.5), type: 'p2p' });
    }
  }
}

function draw() {
  updateCanvasSize();

  // Draw region
  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  let halfW = canvasWidth / 2;

  // Divider
  stroke(180);
  strokeWeight(1);
  line(halfW, 0, halfW, drawHeight);

  // Titles
  noStroke();
  fill(40);
  textSize(14);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text('Client-Server', halfW / 2, 8);
  text('Peer-to-Peer', halfW + halfW / 2, 8);
  textStyle(NORMAL);

  // Draw CS connections
  for (let i = 1; i < csNodes.length; i++) {
    let s = csNodes[0];
    let c = csNodes[i];
    if (!s.active || !c.active) {
      stroke(200, 80, 80, 120);
      strokeWeight(1);
      drawingContext.setLineDash([4, 4]);
    } else {
      stroke(160);
      strokeWeight(1.5);
      drawingContext.setLineDash([]);
    }
    line(s.x, s.y, c.x, c.y);
  }
  drawingContext.setLineDash([]);

  // Draw P2P connections (each node connected to 3 neighbors)
  for (let i = 0; i < p2pNodes.length; i++) {
    for (let j = i + 1; j < p2pNodes.length; j++) {
      if (abs(i - j) <= 2 || abs(i - j) >= p2pNodes.length - 2) {
        let a = p2pNodes[i];
        let b = p2pNodes[j];
        if (!a.active || !b.active) {
          stroke(200, 80, 80, 120);
          strokeWeight(1);
          drawingContext.setLineDash([4, 4]);
        } else {
          stroke(160);
          strokeWeight(1.5);
          drawingContext.setLineDash([]);
        }
        line(a.x, a.y, b.x, b.y);
      }
    }
  }
  drawingContext.setLineDash([]);

  // Draw CS nodes
  for (let n of csNodes) {
    drawNode(n, n.isServer ? [70, 130, 200] : [100, 180, 100]);
  }

  // Draw P2P nodes
  for (let n of p2pNodes) {
    drawNode(n, [0, 150, 150]);
  }

  // Animate packets
  if (animating) {
    for (let p of packets) {
      p.t += 0.012;
      if (p.t > 1) p.t -= 1;
      let px = lerp(p.from.x, p.to.x, p.t);
      let py = lerp(p.from.y, p.to.y, p.t);
      fill(255, 140, 0);
      noStroke();
      ellipse(px, py, 8, 8);
    }
  }

  // Stats
  let csActive = csNodes.filter(n => n.active).length;
  let csConnected = csNodes[0].active ? csNodes.filter((n, i) => i > 0 && n.active).length : 0;
  let p2pActive = p2pNodes.filter(n => n.active).length;

  textSize(11);
  textAlign(CENTER, BOTTOM);
  fill(60);
  noStroke();
  text('Active: ' + csActive + '/' + csNodes.length + '  Connected clients: ' + csConnected + '/' + (csNodes.length - 1),
    halfW / 2, drawHeight - 6);
  text('Active: ' + p2pActive + '/' + p2pNodes.length,
    halfW + halfW / 2, drawHeight - 6);

  // Control region
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke();
  fill(80);
  textSize(12);
  textAlign(CENTER, CENTER);
  text('Click any node to toggle failure', canvasWidth / 2, drawHeight + controlHeight / 2);
}

function drawNode(n, baseColor) {
  if (n.active) {
    fill(baseColor[0], baseColor[1], baseColor[2]);
    stroke(baseColor[0] - 30, baseColor[1] - 30, baseColor[2] - 30);
    strokeWeight(2);
    ellipse(n.x, n.y, n.r * 2, n.r * 2);
    fill(255);
    noStroke();
    textSize(n.isServer ? 14 : 11);
    textAlign(CENTER, CENTER);
    text(n.label, n.x, n.y);
  } else {
    fill(220, 220, 220);
    stroke(200, 80, 80);
    strokeWeight(2);
    ellipse(n.x, n.y, n.r * 2, n.r * 2);
    // Red X
    stroke(200, 50, 50);
    strokeWeight(3);
    let o = n.r * 0.5;
    line(n.x - o, n.y - o, n.x + o, n.y + o);
    line(n.x + o, n.y - o, n.x - o, n.y + o);
  }
}

function mousePressed() {
  // Check CS nodes
  for (let n of csNodes) {
    if (dist(mouseX, mouseY, n.x, n.y) < n.r + 4) {
      n.active = !n.active;
      return;
    }
  }
  // Check P2P nodes
  for (let n of p2pNodes) {
    if (dist(mouseX, mouseY, n.x, n.y) < n.r + 4) {
      n.active = !n.active;
      return;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  resetNetwork();
}

function updateCanvasSize() {
  containerWidth = select('main').width;
  canvasWidth = containerWidth;
}
