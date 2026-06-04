// Scalability Trilemma Explorer MicroSim
// Triangle with draggable platform markers
let containerWidth;
let canvasWidth = 400;
let drawHeight = 440;
let controlHeight = 60;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

let resetBtn;
let hoveredPlatform = null;
let draggedPlatform = -1;

// Triangle vertices (will be computed in draw)
let triA, triB, triC; // top=Decentralization, bottom-left=Security, bottom-right=Scalability

let platforms = [
  { name: 'Bitcoin',        d: 0.90, s: 0.95, sc: 0.10, color: '#F7931A', desc: 'Most decentralized & secure, very low throughput (~7 TPS)' },
  { name: 'Ethereum L1',    d: 0.75, s: 0.85, sc: 0.20, color: '#627EEA', desc: 'Strong decentralization, moderate throughput (~30 TPS)' },
  { name: 'Ethereum + L2',  d: 0.55, s: 0.70, sc: 0.65, color: '#8C9EFF', desc: 'Rollups trade some decentralization for scalability' },
  { name: 'Solana',         d: 0.30, s: 0.60, sc: 0.90, color: '#14F195', desc: 'High throughput (~4000 TPS) but fewer validators' },
  { name: 'Hyperledger',    d: 0.10, s: 0.80, sc: 0.85, color: '#2E7D32', desc: 'Permissioned: very fast, but centralized governance' },
  { name: 'Polygon PoS',    d: 0.45, s: 0.65, sc: 0.75, color: '#8247E5', desc: 'Sidechain with moderate decentralization, good throughput' }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));

  resetBtn = createButton('Reset Positions');
  resetBtn.parent(document.querySelector('main'));
  resetBtn.mousePressed(resetPositions);

  describe('Scalability trilemma triangle with draggable platform markers showing tradeoffs.');
}

function resetPositions() {
  platforms[0] = { ...platforms[0], d: 0.90, s: 0.95, sc: 0.10 };
  platforms[1] = { ...platforms[1], d: 0.75, s: 0.85, sc: 0.20 };
  platforms[2] = { ...platforms[2], d: 0.55, s: 0.70, sc: 0.65 };
  platforms[3] = { ...platforms[3], d: 0.30, s: 0.60, sc: 0.90 };
  platforms[4] = { ...platforms[4], d: 0.10, s: 0.80, sc: 0.85 };
  platforms[5] = { ...platforms[5], d: 0.45, s: 0.65, sc: 0.75 };
}

function baryToCart(d, s, sc) {
  // Normalize so they sum to 1 for barycentric coords
  let total = d + s + sc;
  if (total === 0) total = 1;
  let nd = d / total, ns = s / total, nsc = sc / total;
  let x = nd * triA.x + ns * triB.x + nsc * triC.x;
  let y = nd * triA.y + ns * triB.y + nsc * triC.y;
  return { x, y };
}

function cartToBary(px, py) {
  let v0x = triC.x - triA.x, v0y = triC.y - triA.y;
  let v1x = triB.x - triA.x, v1y = triB.y - triA.y;
  let v2x = px - triA.x, v2y = py - triA.y;
  let dot00 = v0x * v0x + v0y * v0y;
  let dot01 = v0x * v1x + v0y * v1y;
  let dot02 = v0x * v2x + v0y * v2y;
  let dot11 = v1x * v1x + v1y * v1y;
  let dot12 = v1x * v2x + v1y * v2y;
  let inv = 1 / (dot00 * dot11 - dot01 * dot01);
  let u = (dot11 * dot02 - dot01 * dot12) * inv;
  let v = (dot00 * dot12 - dot01 * dot02) * inv;
  return { d: 1 - u - v, s: v, sc: u };
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
  text('Scalability Trilemma Explorer', canvasWidth / 2, 8);

  // Compute triangle
  let cx = canvasWidth / 2;
  let triSize = Math.min(canvasWidth - 100, drawHeight - 120) * 0.45;
  let triCenterY = drawHeight / 2 + 10;
  triA = { x: cx, y: triCenterY - triSize };               // Top: Decentralization
  triB = { x: cx - triSize * 0.87, y: triCenterY + triSize * 0.5 }; // Bottom-left: Security
  triC = { x: cx + triSize * 0.87, y: triCenterY + triSize * 0.5 }; // Bottom-right: Scalability

  // Draw triangle
  fill(240, 248, 255, 100);
  stroke('#90A4AE');
  strokeWeight(2);
  triangle(triA.x, triA.y, triB.x, triB.y, triC.x, triC.y);

  // Vertex labels
  fill('#333');
  noStroke();
  textSize(12);
  textAlign(CENTER, BOTTOM);
  text('Decentralization', triA.x, triA.y - 8);
  textAlign(RIGHT, TOP);
  text('Security', triB.x - 8, triB.y + 8);
  textAlign(LEFT, TOP);
  text('Scalability', triC.x + 8, triC.y + 8);

  // Handle dragging
  if (mouseIsPressed && draggedPlatform >= 0) {
    let bary = cartToBary(mouseX, mouseY);
    // Clamp to positive barycentric
    bary.d = Math.max(0.05, Math.min(0.95, bary.d));
    bary.s = Math.max(0.05, Math.min(0.95, bary.s));
    bary.sc = Math.max(0.05, Math.min(0.95, bary.sc));
    let total = bary.d + bary.s + bary.sc;
    platforms[draggedPlatform].d = bary.d / total;
    platforms[draggedPlatform].s = bary.s / total;
    platforms[draggedPlatform].sc = bary.sc / total;
  }

  hoveredPlatform = null;

  // Draw platform dots
  for (let i = 0; i < platforms.length; i++) {
    let p = platforms[i];
    let pos = baryToCart(p.d, p.s, p.sc);

    let isHover = dist(mouseX, mouseY, pos.x, pos.y) < 14;
    if (isHover) hoveredPlatform = p;

    fill(p.color);
    stroke('#333');
    strokeWeight(isHover ? 3 : 1);
    ellipse(pos.x, pos.y, isHover ? 20 : 16, isHover ? 20 : 16);

    fill('#333');
    noStroke();
    textSize(9);
    textAlign(CENTER, TOP);
    text(p.name, pos.x, pos.y + 12);
  }

  // Tooltip
  if (hoveredPlatform && !mouseIsPressed) {
    let p = hoveredPlatform;
    let tipLines = [
      p.name,
      'Dec: ' + (p.d * 100).toFixed(0) + '% | Sec: ' + (p.s * 100).toFixed(0) + '% | Scl: ' + (p.sc * 100).toFixed(0) + '%',
      p.desc
    ];
    let maxW = 0;
    textSize(10);
    for (let l of tipLines) maxW = Math.max(maxW, textWidth(l));
    let tw = maxW + 16;
    let th = tipLines.length * 15 + 10;
    let tx = constrain(mouseX + 12, 0, canvasWidth - tw);
    let ty = constrain(mouseY - th - 5, 0, drawHeight - th);

    fill(255, 255, 230, 245);
    stroke('#999');
    strokeWeight(1);
    rect(tx, ty, tw, th, 4);

    fill('#333');
    noStroke();
    textAlign(LEFT, TOP);
    for (let li = 0; li < tipLines.length; li++) {
      textSize(li === 0 ? 11 : 9);
      if (li === 0) fill('#333'); else fill('#555');
      text(tipLines[li], tx + 8, ty + 5 + li * 15);
    }
  }

  // Legend
  let lx = margin;
  let ly = drawHeight - 45;
  fill('#333');
  noStroke();
  textSize(9);
  textAlign(LEFT, TOP);
  text('Drag platforms to explore tradeoffs', lx, ly);
  for (let i = 0; i < platforms.length; i++) {
    let p = platforms[i];
    let row = Math.floor(i / 3);
    let col = i % 3;
    fill(p.color);
    noStroke();
    ellipse(lx + col * 120 + 6, ly + 16 + row * 14, 8, 8);
    fill('#333');
    textSize(8);
    textAlign(LEFT, CENTER);
    text(p.name, lx + col * 120 + 14, ly + 16 + row * 14);
  }

  // Controls
  fill('#666');
  noStroke();
  textSize(11);
  textAlign(LEFT, CENTER);
  text('Drag platform dots within the triangle.', margin, drawHeight + 15);
  resetBtn.position(margin, drawHeight + 30);
}

function mousePressed() {
  for (let i = 0; i < platforms.length; i++) {
    let pos = baryToCart(platforms[i].d, platforms[i].s, platforms[i].sc);
    if (dist(mouseX, mouseY, pos.x, pos.y) < 14) {
      draggedPlatform = i;
      return;
    }
  }
}

function mouseReleased() {
  draggedPlatform = -1;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
  containerWidth = select('main').width;
  canvasWidth = containerWidth;
}
