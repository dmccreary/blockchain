// Bias Interaction Network Diagram
// Chapter 15: Cognitive Bias in Technology Decisions
let containerWidth;
let canvasWidth = 400;
let drawHeight = 550;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

let biases = [
  {id:0, name:'Bandwagon\nEffect'},
  {id:1, name:'Confirmation\nBias'},
  {id:2, name:'Authority\nBias'},
  {id:3, name:'Sunk Cost\nFallacy'},
  {id:4, name:'Anchoring\nBias'},
  {id:5, name:'Novelty\nBias'},
  {id:6, name:'Status Quo\nBias'},
  {id:7, name:'Survivorship\nBias'},
  {id:8, name:'Dunning-\nKruger'},
  {id:9, name:'Availability\nBias'},
  {id:10, name:'Optimism\nBias'},
  {id:11, name:'Framing\nEffect'}
];

// Edges: [from, to, strength(1-3), description]
let edges = [
  [0,1,3,'Bandwagon makes confirming evidence easier to find'],
  [1,3,2,'Confirming prior choice reinforces sunk cost commitment'],
  [2,0,2,'Expert endorsement amplifies bandwagon pressure'],
  [5,0,2,'Novelty excitement feeds herd adoption'],
  [0,10,2,'Everyone adopting fuels optimistic projections'],
  [1,7,3,'Seeking confirmation leads to studying only successes'],
  [7,10,2,'Seeing only successes inflates optimism'],
  [10,4,2,'Optimistic anchors set unrealistic expectations'],
  [4,3,2,'Anchored estimates make sunk costs seem recoverable'],
  [3,6,2,'Large investment makes change feel too costly'],
  [8,10,2,'Overconfidence feeds optimistic timelines'],
  [9,1,2,'Vivid recent events confirm existing beliefs'],
  [11,1,2,'How info is framed shapes what confirms beliefs'],
  [5,8,1,'Excitement about new tech inflates confidence'],
  [6,3,1,'Resistance to change reinforces sunk cost logic'],
  [2,1,2,'Authority claims become confirming evidence']
];

let interventions = [
  {between:[0,1], name:'Red Team\nReview', desc:'Assign team to argue against blockchain'},
  {between:[1,7], name:'Failure\nAnalysis', desc:'Require study of failed projects'},
  {between:[10,4], name:'Reference\nClass', desc:'Use base rates from similar projects'},
  {between:[3,6], name:'Prospective\nAnalysis', desc:'Evaluate as if starting fresh'},
  {between:[8,10], name:'External\nAudit', desc:'Get independent expert assessment'}
];

let selectedNode = null;
let hoveredNode = null;
let cascadeActive = false;
let cascadeNode = null;
let cascadeTime = 0;
let activatedNodes = new Set();
let showInterventions = false;
let cascadeBtn, resetBtn, interventionCB;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  cascadeBtn = createButton('Cascade Simulation');
  cascadeBtn.parent(document.querySelector('main'));
  cascadeBtn.style('font-size', '13px');
  cascadeBtn.style('margin', '4px');
  cascadeBtn.mousePressed(() => {
    if (selectedNode !== null) {
      cascadeActive = true;
      cascadeNode = selectedNode;
      cascadeTime = 0;
      activatedNodes = new Set([cascadeNode]);
    }
  });

  resetBtn = createButton('Reset');
  resetBtn.parent(document.querySelector('main'));
  resetBtn.style('font-size', '13px');
  resetBtn.style('margin', '4px');
  resetBtn.mousePressed(() => {
    selectedNode = null;
    cascadeActive = false;
    activatedNodes = new Set();
  });

  interventionCB = createCheckbox('Show debiasing interventions', false);
  interventionCB.parent(document.querySelector('main'));
  interventionCB.style('font-size', '13px');
  interventionCB.style('margin', '4px 8px');
  interventionCB.changed(() => { showInterventions = interventionCB.checked(); });
}

function getNodePos(i) {
  let cx = canvasWidth / 2;
  let cy = 230;
  let r = min(canvasWidth, 420) * 0.34;
  let angle = -HALF_PI + (TWO_PI / 12) * i;
  return {x: cx + cos(angle) * r, y: cy + sin(angle) * r};
}

function draw() {
  updateCanvasSize();
  background('aliceblue');
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Title
  fill(30); noStroke(); textSize(16); textAlign(CENTER, TOP);
  text('Bias Interaction Network', canvasWidth / 2, 8);

  // Cascade animation
  if (cascadeActive) {
    cascadeTime += deltaTime / 1000;
    if (cascadeTime > 0.8) {
      cascadeTime = 0;
      let newActivated = new Set(activatedNodes);
      for (let e of edges) {
        if (activatedNodes.has(e[0]) && !activatedNodes.has(e[1])) {
          newActivated.add(e[1]);
        }
      }
      if (newActivated.size === activatedNodes.size) cascadeActive = false;
      activatedNodes = newActivated;
    }
  }

  // Draw edges
  for (let e of edges) {
    let p1 = getNodePos(e[0]);
    let p2 = getNodePos(e[1]);
    let isHighlighted = selectedNode !== null && (e[0] === selectedNode || e[1] === selectedNode);
    let isActivated = activatedNodes.has(e[0]) && activatedNodes.has(e[1]);

    if (isActivated) {
      stroke(255, 87, 34, 200);
      strokeWeight(e[2] * 2);
    } else if (isHighlighted) {
      stroke(33, 150, 243, 200);
      strokeWeight(e[2] * 1.5);
    } else {
      stroke(180, 180, 180, 120);
      strokeWeight(e[2] * 0.8);
    }

    // Draw arrow
    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;
    let d = sqrt(dx * dx + dy * dy);
    let nx = dx / d, ny = dy / d;
    let ax = p1.x + nx * 22, ay = p1.y + ny * 22;
    let bx = p2.x - nx * 22, by = p2.y - ny * 22;
    line(ax, ay, bx, by);

    // Arrowhead
    let aSize = 6;
    let ang = atan2(by - ay, bx - ax);
    fill(isActivated ? color(255, 87, 34) : isHighlighted ? color(33, 150, 243) : color(180));
    noStroke();
    triangle(bx, by, bx - aSize * cos(ang - 0.4), by - aSize * sin(ang - 0.4),
             bx - aSize * cos(ang + 0.4), by - aSize * sin(ang + 0.4));
  }

  // Draw intervention nodes
  if (showInterventions) {
    for (let iv of interventions) {
      let p1 = getNodePos(iv.between[0]);
      let p2 = getNodePos(iv.between[1]);
      let ix = (p1.x + p2.x) / 2;
      let iy = (p1.y + p2.y) / 2;
      fill(76, 175, 80, 200); stroke(56, 142, 60); strokeWeight(1);
      ellipse(ix, iy, 28, 28);
      fill(255); noStroke(); textSize(7); textAlign(CENTER, CENTER);
      text(iv.name, ix, iy);
    }
  }

  // Draw nodes
  hoveredNode = null;
  for (let i = 0; i < 12; i++) {
    let p = getNodePos(i);
    let isSelected = selectedNode === i;
    let isActivated = activatedNodes.has(i);
    let isHover = dist(mouseX, mouseY, p.x, p.y) < 22;
    if (isHover) hoveredNode = i;

    if (isActivated) {
      // Pulsing effect
      let pulse = sin(millis() / 200) * 3 + 3;
      fill(255, 87, 34, 40); noStroke();
      ellipse(p.x, p.y, 44 + pulse * 2);
      fill(255, 87, 34); stroke(200, 60, 20); strokeWeight(2);
    } else if (isSelected) {
      fill(33, 150, 243); stroke(25, 118, 210); strokeWeight(2);
    } else if (isHover) {
      fill(100, 181, 246); stroke(66, 165, 245); strokeWeight(2);
    } else {
      fill(230, 240, 250); stroke(150); strokeWeight(1);
    }
    ellipse(p.x, p.y, 44, 44);

    fill(isActivated || isSelected ? 255 : 40); noStroke();
    textSize(8); textAlign(CENTER, CENTER);
    text(biases[i].name, p.x, p.y);
  }

  // Detail panel
  if (selectedNode !== null) {
    let panelY = 435;
    let panelH = drawHeight - panelY - 5;
    fill(255, 250, 240); stroke(200); strokeWeight(1);
    rect(10, panelY, canvasWidth - 20, panelH, 5);

    let b = biases[selectedNode];
    fill(30); noStroke(); textSize(12); textAlign(LEFT, TOP);
    textStyle(BOLD);
    text(b.name.replace('\n', ' '), 20, panelY + 8);
    textStyle(NORMAL); textSize(10);
    let connections = [];
    for (let e of edges) {
      if (e[0] === selectedNode) connections.push('-> ' + biases[e[1]].name.replace('\n', ' ') + ': ' + e[3]);
      if (e[1] === selectedNode) connections.push('<- ' + biases[e[0]].name.replace('\n', ' ') + ': ' + e[3]);
    }
    text('Interactions:\n' + connections.join('\n'), 20, panelY + 28, canvasWidth - 50, panelH - 35);
  }

  // Control region
  fill('white'); stroke('silver'); strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);
  fill(80); noStroke(); textSize(11); textAlign(CENTER, CENTER);
  text('Click a bias node, then "Cascade Simulation" to see reinforcement propagation.', canvasWidth / 2, drawHeight + 20);
}

function mousePressed() {
  for (let i = 0; i < 12; i++) {
    let p = getNodePos(i);
    if (dist(mouseX, mouseY, p.x, p.y) < 22) {
      selectedNode = (selectedNode === i) ? null : i;
      cascadeActive = false;
      activatedNodes = new Set();
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
