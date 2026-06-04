// Hype Cycle Bias Map MicroSim
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

let phases = [
  {name: 'Innovation\nTrigger', xFrac: 0.08},
  {name: 'Peak of Inflated\nExpectations', xFrac: 0.25},
  {name: 'Trough of\nDisillusionment', xFrac: 0.45},
  {name: 'Slope of\nEnlightenment', xFrac: 0.65},
  {name: 'Plateau of\nProductivity', xFrac: 0.88}
];

let biasHotspots = [
  {name:'Novelty Bias', phase:0, t:0.06, desc:'Fascination with newness overrides rational evaluation.', example:'Bitcoin whitepaper generates excitement beyond technical merit.', debiasing:'Apply "10-year test": would this still matter in a decade?'},
  {name:'Bandwagon Effect', phase:1, t:0.18, desc:'Adopting because everyone else is adopting.', example:'Companies launch blockchain pilots because competitors did.', debiasing:'Require independent justification before following trends.'},
  {name:'Authority Bias', phase:1, t:0.25, desc:'Over-weighting opinions of famous advocates.', example:'Celebrity crypto endorsements drive enterprise interest.', debiasing:'Evaluate claims on evidence, not source prestige.'},
  {name:'Confirmation Bias', phase:1, t:0.30, desc:'Seeking info that confirms blockchain is the answer.', example:'Cherry-picking successful pilots while ignoring failures.', debiasing:'Assign a "red team" to argue against blockchain.'},
  {name:'Sunk Cost Fallacy', phase:2, t:0.40, desc:'Continuing investment due to prior spending.', example:'Continuing failed pilot because $2M already spent.', debiasing:'Use prospective analysis: ignore past costs in go/no-go.'},
  {name:'Anchoring Bias', phase:2, t:0.48, desc:'Fixating on initial estimates or promises.', example:'Anchoring to early ROI projections despite poor results.', debiasing:'Regularly update estimates with current data.'},
  {name:'Status Quo Bias', phase:3, t:0.58, desc:'Preferring current state over change.', example:'Refusing to pivot from blockchain after trough lessons.', debiasing:'Frame decisions as new choices, not changes.'},
  {name:'Survivorship Bias', phase:3, t:0.68, desc:'Only seeing successful blockchain projects.', example:'Studying only Ethereum success, ignoring thousands of dead tokens.', debiasing:'Actively seek and study failure cases.'},
  {name:'Dunning-Kruger', phase:4, t:0.82, desc:'Overestimating understanding of complex technology.', example:'Teams underestimate blockchain implementation complexity.', debiasing:'Require external expert review of assumptions.'},
  {name:'Availability Bias', phase:4, t:0.90, desc:'Overweighting recent or vivid information.', example:'Recent hack dominates risk assessment vs. base rates.', debiasing:'Use systematic data collection, not anecdotes.'}
];

let timelineEvents = [
  {t: 0.05, label:'Bitcoin 2009'},
  {t: 0.22, label:'ICO Boom 2017'},
  {t: 0.35, label:'Crypto Winter 2018'},
  {t: 0.50, label:'Pilot Failures 2019'},
  {t: 0.62, label:'DeFi Rise 2020'},
  {t: 0.75, label:'Enterprise Pivot 2022'},
  {t: 0.88, label:'Selective Adoption 2025'}
];

let selectedBias = null;
let markerT = 0.5;
let draggingMarker = false;
let showTimeline = false;
let showAllBiases = true;
let timelineCB, biasBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  timelineCB = createCheckbox('Show blockchain timeline', false);
  timelineCB.parent(document.querySelector('main'));
  timelineCB.style('font-size', '13px');
  timelineCB.style('margin', '4px 8px');
  timelineCB.changed(() => { showTimeline = timelineCB.checked(); });

  biasBtn = createButton('Show All Biases');
  biasBtn.parent(document.querySelector('main'));
  biasBtn.style('font-size', '13px');
  biasBtn.style('margin', '4px');
  biasBtn.mousePressed(() => {
    showAllBiases = !showAllBiases;
    biasBtn.html(showAllBiases ? 'Show Phase Biases Only' : 'Show All Biases');
  });
}

function hypeCurveY(t) {
  // Attempt a smooth hype cycle shape
  // t in [0,1], returns y in [0,1] where 0=top
  if (t < 0.1) return 0.7 - t * 2;
  if (t < 0.3) return 0.5 - 3.5 * (t - 0.1) + 2 * pow((t - 0.1), 2) * 25;
  if (t < 0.32) return 0.5 - 3.5 * 0.2 + 2 * pow(0.2, 2) * 25;
  // Simple parametric
  let peak = 0.12;
  let peakY = 0.08;
  let troughT = 0.48;
  let troughY = 0.78;
  let plateauY = 0.45;

  if (t <= peak) return lerp(0.7, peakY, t / peak);
  if (t <= troughT) {
    let p = (t - peak) / (troughT - peak);
    return lerp(peakY, troughY, p * p);
  }
  let p = (t - troughT) / (1 - troughT);
  return lerp(troughY, plateauY, 1 - pow(1 - p, 2));
}

function draw() {
  updateCanvasSize();
  background('aliceblue');
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  let plotL = 60, plotR = canvasWidth - 30;
  let plotT = 50, plotB = 340;
  let plotW = plotR - plotL;
  let plotH = plotB - plotT;

  // Title
  fill(30); noStroke(); textSize(16); textAlign(CENTER, TOP);
  text('Hype Cycle Bias Map', canvasWidth / 2, 8);

  // Axes
  stroke(150); strokeWeight(1);
  line(plotL, plotB, plotR, plotB);
  line(plotL, plotT, plotL, plotB);
  fill(80); noStroke(); textSize(10); textAlign(CENTER, TOP);
  text('Maturity / Time', (plotL + plotR) / 2, plotB + 5);
  push(); translate(plotL - 15, (plotT + plotB) / 2); rotate(-HALF_PI);
  textAlign(CENTER, CENTER); text('Expectations', 0, 0); pop();

  // Draw hype curve
  noFill(); stroke(70, 130, 180); strokeWeight(3);
  beginShape();
  for (let i = 0; i <= 100; i++) {
    let t = i / 100;
    let x = plotL + t * plotW;
    let y = plotT + hypeCurveY(t) * plotH;
    vertex(x, y);
  }
  endShape();

  // Phase labels
  textSize(9); fill(100); noStroke(); textAlign(CENTER, TOP);
  for (let p of phases) {
    let x = plotL + p.xFrac * plotW;
    text(p.name, x, plotB + 18);
  }

  // Phase dividers
  stroke(220); strokeWeight(1);
  let dividers = [0.15, 0.35, 0.55, 0.78];
  for (let d of dividers) {
    let x = plotL + d * plotW;
    line(x, plotT, x, plotB);
  }

  // Current position marker
  let markerPhase = getPhaseForT(markerT);
  let mx = plotL + markerT * plotW;
  let my = plotT + hypeCurveY(markerT) * plotH;
  fill(255, 0, 0); noStroke();
  triangle(mx, my - 15, mx - 8, my - 25, mx + 8, my - 25);
  textSize(9); textAlign(CENTER, BOTTOM); fill(200, 0, 0);
  text('You are here', mx, my - 27);

  // Bias hotspots
  let hoveredBias = null;
  for (let b of biasHotspots) {
    if (!showAllBiases && b.phase !== markerPhase) continue;
    let bx = plotL + b.t * plotW;
    let by = plotT + hypeCurveY(b.t) * plotH;
    let isSelected = selectedBias === b;
    let isHovered = dist(mouseX, mouseY, bx, by) < 10;
    if (isHovered) hoveredBias = b;

    fill(isSelected ? color(255, 87, 34) : isHovered ? color(255, 152, 0) : color(255, 193, 7));
    stroke(isSelected ? color(200, 60, 20) : 150);
    strokeWeight(isSelected ? 2 : 1);
    ellipse(bx, by, isSelected ? 16 : 12);

    if (isSelected || isHovered) {
      fill(50); noStroke(); textSize(9); textAlign(CENTER, BOTTOM);
      text(b.name, bx, by - 10);
    }
  }

  // Timeline events
  if (showTimeline) {
    for (let ev of timelineEvents) {
      let ex = plotL + ev.t * plotW;
      stroke(100, 180, 100); strokeWeight(1);
      line(ex, plotB, ex, plotB + 50);
      fill(60, 130, 60); noStroke(); textSize(8);
      push(); translate(ex, plotB + 52); rotate(QUARTER_PI);
      textAlign(LEFT, CENTER); text(ev.label, 0, 0); pop();
    }
  }

  // Detail panel
  if (selectedBias) {
    let panelY = 360;
    let panelH = drawHeight - panelY - 10;
    fill(255, 250, 240); stroke(200); strokeWeight(1);
    rect(15, panelY, canvasWidth - 30, panelH, 5);

    fill(30); noStroke(); textSize(13); textAlign(LEFT, TOP);
    textStyle(BOLD);
    text(selectedBias.name, 25, panelY + 8);
    textStyle(NORMAL); textSize(11);
    let content = selectedBias.desc + '\n\nBlockchain Example: ' + selectedBias.example + '\n\nDebiasing: ' + selectedBias.debiasing;
    text(content, 25, panelY + 28, canvasWidth - 60, panelH - 35);
  }

  // Hover tooltip
  if (hoveredBias && hoveredBias !== selectedBias) {
    let tip = hoveredBias.name + ' - Click for details';
    fill(50, 50, 50, 220); noStroke();
    let tw = textWidth(tip) + 16;
    rect(mouseX + 10, mouseY - 22, tw, 20, 4);
    fill(255); textSize(10); textAlign(LEFT, CENTER);
    text(tip, mouseX + 18, mouseY - 12);
  }

  // Control region
  fill('white'); stroke('silver'); strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);
  fill(80); noStroke(); textSize(11); textAlign(CENTER, CENTER);
  text('Drag red marker along curve. Click hotspots for bias details.', canvasWidth / 2, drawHeight + 20);
}

function getPhaseForT(t) {
  if (t < 0.15) return 0;
  if (t < 0.35) return 1;
  if (t < 0.55) return 2;
  if (t < 0.78) return 3;
  return 4;
}

function mousePressed() {
  let plotL = 60, plotR = canvasWidth - 30;
  let plotT = 50, plotB = 340;
  let plotW = plotR - plotL;
  let plotH = plotB - plotT;

  // Check marker drag
  let mx = plotL + markerT * plotW;
  let my = plotT + hypeCurveY(markerT) * plotH;
  if (dist(mouseX, mouseY, mx, my) < 20) {
    draggingMarker = true;
    return;
  }

  // Check bias hotspots
  for (let b of biasHotspots) {
    let bx = plotL + b.t * plotW;
    let by = plotT + hypeCurveY(b.t) * plotH;
    if (dist(mouseX, mouseY, bx, by) < 12) {
      selectedBias = (selectedBias === b) ? null : b;
      return;
    }
  }
  selectedBias = null;
}

function mouseDragged() {
  if (draggingMarker) {
    let plotL = 60, plotR = canvasWidth - 30;
    let plotW = plotR - plotL;
    markerT = constrain((mouseX - plotL) / plotW, 0, 1);
  }
}

function mouseReleased() {
  draggingMarker = false;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
  containerWidth = select('main').width;
  canvasWidth = containerWidth;
}
