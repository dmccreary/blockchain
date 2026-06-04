// Quality Attribute Radar Chart
// Chapter 14: Risk Analysis and Quality Attributes
let containerWidth;
let canvasWidth = 400;
let drawHeight = 550;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

let attributes = ['Security', 'Availability', 'Reliability', 'Performance', 'Modifiability', 'Maintainability', 'Cost Efficiency'];
let numAxes = 7;

let archNames = ['Public Blockchain', 'Consortium Blockchain', 'Centralized Database'];
let archColors;

let defaultRatings = [
  [5, 3, 4, 2, 1, 2, 1],  // Public Blockchain
  [4, 4, 4, 3, 3, 3, 3],  // Consortium
  [3, 5, 4, 5, 5, 5, 5]   // Centralized DB
];

let ratings;
let rationale = [
  ['Cryptographic security; immutable','Depends on node count; variable','Byzantine fault tolerant','Low TPS; high latency','Hard fork required','Complex; specialized skills','High energy/storage costs'],
  ['Permissioned access; good security','Managed nodes; good uptime','Shared validation; reliable','Moderate TPS','Governance vote needed','Shared maintenance burden','Moderate infrastructure costs'],
  ['Access control based; well-understood','Proven HA patterns; mature','ACID transactions; mature','High TPS; low latency','Standard update processes','Widely available expertise','Low operational costs']
];

let showArch = [true, true, true];
let customizeMode = false;
let hoverVertex = null;
let checkboxes = [];
let customizeBtn, resetBtn;
let editSliders = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');
  archColors = [color(33, 150, 243, 120), color(255, 152, 0, 120), color(76, 175, 80, 120)];
  ratings = defaultRatings.map(r => [...r]);

  for (let i = 0; i < 3; i++) {
    let cb = createCheckbox(archNames[i], true);
    cb.parent(document.querySelector('main'));
    cb.style('font-size', '13px');
    cb.style('margin', '2px 8px');
    cb.style('display', 'inline-block');
    let idx = i;
    cb.changed(() => { showArch[idx] = cb.checked(); });
    checkboxes.push(cb);
  }

  customizeBtn = createButton('Customize Ratings');
  customizeBtn.parent(document.querySelector('main'));
  customizeBtn.style('font-size', '13px');
  customizeBtn.style('margin', '4px');
  customizeBtn.mousePressed(() => { customizeMode = !customizeMode; });

  resetBtn = createButton('Reset to Defaults');
  resetBtn.parent(document.querySelector('main'));
  resetBtn.style('font-size', '13px');
  resetBtn.style('margin', '4px');
  resetBtn.mousePressed(() => {
    ratings = defaultRatings.map(r => [...r]);
    customizeMode = false;
  });
}

function draw() {
  updateCanvasSize();
  background('aliceblue');
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  let cx = canvasWidth * 0.45;
  let cy = drawHeight * 0.48;
  let maxR = min(canvasWidth, drawHeight) * 0.32;

  // Title
  fill(30); noStroke(); textSize(16); textAlign(CENTER, TOP);
  text('Quality Attribute Radar Chart', canvasWidth / 2, 8);

  // Draw concentric rings
  noFill(); stroke(200); strokeWeight(0.5);
  for (let level = 1; level <= 5; level++) {
    let r = (level / 5) * maxR;
    beginShape();
    for (let i = 0; i < numAxes; i++) {
      let angle = -HALF_PI + (TWO_PI / numAxes) * i;
      vertex(cx + cos(angle) * r, cy + sin(angle) * r);
    }
    endShape(CLOSE);
  }

  // Draw axes and labels
  for (let i = 0; i < numAxes; i++) {
    let angle = -HALF_PI + (TWO_PI / numAxes) * i;
    let ex = cx + cos(angle) * maxR;
    let ey = cy + sin(angle) * maxR;
    stroke(180); strokeWeight(0.5);
    line(cx, cy, ex, ey);

    // Labels
    let lx = cx + cos(angle) * (maxR + 20);
    let ly = cy + sin(angle) * (maxR + 20);
    fill(50); noStroke(); textSize(11);
    textAlign(CENTER, CENTER);
    text(attributes[i], lx, ly);
  }

  // Scale labels
  textSize(9); fill(150); textAlign(RIGHT, CENTER);
  for (let level = 1; level <= 5; level++) {
    let r = (level / 5) * maxR;
    text(level, cx - 5, cy - r);
  }

  // Draw polygons
  hoverVertex = null;
  for (let a = 0; a < 3; a++) {
    if (!showArch[a]) continue;
    let c = archColors[a];
    fill(red(c), green(c), blue(c), 60);
    stroke(red(c), green(c), blue(c), 200);
    strokeWeight(2);
    beginShape();
    for (let i = 0; i < numAxes; i++) {
      let angle = -HALF_PI + (TWO_PI / numAxes) * i;
      let r = (ratings[a][i] / 5) * maxR;
      let vx = cx + cos(angle) * r;
      let vy = cy + sin(angle) * r;
      vertex(vx, vy);
    }
    endShape(CLOSE);

    // Vertices and values
    for (let i = 0; i < numAxes; i++) {
      let angle = -HALF_PI + (TWO_PI / numAxes) * i;
      let r = (ratings[a][i] / 5) * maxR;
      let vx = cx + cos(angle) * r;
      let vy = cy + sin(angle) * r;
      fill(red(c), green(c), blue(c), 220);
      noStroke();
      ellipse(vx, vy, 8, 8);
      fill(30); textSize(10); textAlign(CENTER, CENTER);
      text(ratings[a][i], vx + 10, vy - 8);

      if (dist(mouseX, mouseY, vx, vy) < 12) {
        hoverVertex = {arch: a, attr: i, x: vx, y: vy};
      }
    }
  }

  // Legend
  let legX = 15;
  let legY = 35;
  for (let a = 0; a < 3; a++) {
    let c = archColors[a];
    fill(red(c), green(c), blue(c), 200);
    noStroke();
    rect(legX, legY + a * 18, 12, 12, 2);
    fill(50); textSize(11); textAlign(LEFT, CENTER);
    text(archNames[a], legX + 16, legY + a * 18 + 6);
  }

  // Tooltip
  if (hoverVertex) {
    let h = hoverVertex;
    let tip = archNames[h.arch] + '\n' + attributes[h.attr] + ': ' + ratings[h.arch][h.attr] + '/5\n' + rationale[h.arch][h.attr];
    fill(50, 50, 50, 230);
    noStroke();
    let tw = 220;
    let th = 55;
    let tx = min(h.x + 15, canvasWidth - tw - 10);
    let ty = max(h.y - th - 5, 5);
    rect(tx, ty, tw, th, 5);
    fill(255); textSize(10); textAlign(LEFT, TOP);
    text(tip, tx + 8, ty + 5, tw - 16, th - 10);
  }

  // Customize mode panel
  if (customizeMode) {
    let panelX = canvasWidth - 180;
    let panelY = 40;
    fill(255, 250, 240, 240);
    stroke(200); strokeWeight(1);
    rect(panelX, panelY, 170, 250, 5);
    fill(30); noStroke(); textSize(11); textAlign(LEFT, TOP);
    textStyle(BOLD);
    text('Edit Ratings', panelX + 10, panelY + 8);
    textStyle(NORMAL);
    textSize(9);
    text('Click +/- to adjust', panelX + 10, panelY + 24);

    let yy = panelY + 42;
    for (let a = 0; a < 3; a++) {
      if (!showArch[a]) continue;
      fill(red(archColors[a]), green(archColors[a]), blue(archColors[a]), 200);
      noStroke();
      textSize(10); textAlign(LEFT, CENTER);
      text(archNames[a].substring(0, 12), panelX + 10, yy);
      yy += 14;
      for (let i = 0; i < numAxes; i++) {
        fill(80); textSize(9); textAlign(LEFT, CENTER);
        text(attributes[i].substring(0, 8) + ': ' + ratings[a][i], panelX + 12, yy);
        yy += 12;
      }
      yy += 4;
    }
  }

  // Control region
  fill('white'); stroke('silver'); strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);
  fill(80); noStroke(); textSize(11); textAlign(CENTER, CENTER);
  text('Hover vertices for details. Toggle architectures with checkboxes.', canvasWidth / 2, drawHeight + 20);
}

function mousePressed() {
  if (customizeMode) {
    // Simple click cycling: click on a vertex to increment its rating
    if (hoverVertex) {
      let a = hoverVertex.arch;
      let i = hoverVertex.attr;
      ratings[a][i] = (ratings[a][i] % 5) + 1;
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
