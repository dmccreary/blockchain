// Technology Readiness Level Assessment Tool MicroSim
// Chapter 18: Emerging Trust Technologies
let containerWidth;
let canvasWidth = 400;
let drawHeight = 550;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

let technologies = [
  {name:'Blockchain', abbr:'BC', trl:7,
   justification:'Production deployments exist (Bitcoin, Ethereum) but enterprise scaling challenges remain.',
   milestones:['Improved scalability solutions','Energy efficiency standards','Regulatory clarity'],
   timeline:'1-2 years to TRL 9',
   risk:'Low risk at current TRL. Proven in specific use cases.'},
  {name:'Zero-Knowledge\nProofs', abbr:'ZKP', trl:5,
   justification:'Working prototypes (zk-SNARKs, zk-STARKs) but limited production deployments.',
   milestones:['Prover efficiency improvements','Developer tooling maturity','Standardization efforts'],
   timeline:'3-5 years to TRL 9',
   risk:'Medium risk. Technology works but implementation expertise is scarce.'},
  {name:'Verifiable\nCredentials', abbr:'VC', trl:6,
   justification:'W3C standard ratified; pilot deployments in education and government.',
   milestones:['Wallet interoperability','Revocation mechanisms','User adoption'],
   timeline:'2-3 years to TRL 9',
   risk:'Medium-low risk. Standards exist but ecosystem is fragmented.'},
  {name:'Decentralized\nIdentifiers', abbr:'DID', trl:5,
   justification:'W3C standard exists; limited real-world adoption beyond pilots.',
   milestones:['Method convergence','Resolver infrastructure','Integration with existing IdP'],
   timeline:'3-4 years to TRL 9',
   risk:'Medium risk. Multiple competing methods create fragmentation.'},
  {name:'Self-Sovereign\nIdentity', abbr:'SSI', trl:4,
   justification:'Conceptual frameworks proven; few complete implementations beyond demos.',
   milestones:['Usable wallet UX','Recovery mechanisms','Legal recognition'],
   timeline:'4-6 years to TRL 9',
   risk:'High risk. Depends on DID+VC maturity plus user behavior change.'}
];

let selectedTech = null;
let hoveredTech = null;
let riskTolerance = 1; // 0=Low, 1=Medium, 2=High
let riskSlider;
let compareMode = false;
let compareCB;
let comparePair = [0, 1];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  riskSlider = createSlider(0, 2, 1, 1);
  riskSlider.parent(document.querySelector('main'));
  riskSlider.style('width', '150px');
  riskSlider.style('margin', '4px 8px');

  compareCB = createCheckbox('Compare Mode', false);
  compareCB.parent(document.querySelector('main'));
  compareCB.style('font-size', '13px');
  compareCB.style('margin', '4px 8px');
  compareCB.changed(() => { compareMode = compareCB.checked(); selectedTech = null; });
}

function trlColor(level) {
  if (level <= 3) return color(244, 67, 54);
  if (level <= 6) return color(255, 193, 7);
  return color(76, 175, 80);
}

function draw() {
  updateCanvasSize();
  riskTolerance = riskSlider.value();
  background('aliceblue');
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Title
  fill(30); noStroke(); textSize(16); textAlign(CENTER, TOP);
  text('Technology Readiness Level Assessment', canvasWidth / 2, 8);

  // Risk tolerance label
  let riskLabels = ['Low', 'Medium', 'High'];
  fill(80); textSize(11); textAlign(LEFT, CENTER);
  text('Risk Tolerance: ' + riskLabels[riskTolerance], 10, 32);

  // Acceptable TRL range
  let minAcceptableTRL = [7, 5, 3][riskTolerance];
  fill(100); textSize(10);
  text('Min acceptable TRL: ' + minAcceptableTRL, 10, 48);

  if (compareMode) {
    drawCompareView();
  } else {
    drawThermometers();
  }

  // Control region
  fill('white'); stroke('silver'); strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);
  fill(80); noStroke(); textSize(11); textAlign(CENTER, CENTER);
  text('Click thermometers for details. Adjust risk tolerance with slider.', canvasWidth / 2, drawHeight + 20);
}

function drawThermometers() {
  let count = 5;
  let spacing = (canvasWidth - 60) / count;
  let thermW = min(40, spacing * 0.5);
  let thermH = 220;
  let thermTop = 70;
  let thermBot = thermTop + thermH;

  hoveredTech = null;

  for (let i = 0; i < count; i++) {
    let t = technologies[i];
    let cx = 40 + i * spacing + spacing / 2;
    let isSelected = selectedTech === i;
    let isHover = mouseX > cx - thermW && mouseX < cx + thermW && mouseY > thermTop && mouseY < thermBot + 30;
    if (isHover) hoveredTech = i;

    // Thermometer outline
    fill(240); stroke(180); strokeWeight(isSelected ? 3 : 1);
    if (isSelected) stroke(33, 150, 243);
    rect(cx - thermW / 2, thermTop, thermW, thermH, thermW / 2);

    // Fill level
    let fillH = (t.trl / 9) * thermH;
    let fillY = thermBot - fillH;

    // Gradient fill
    for (let y = fillY; y < thermBot; y++) {
      let level = map(y, thermBot, fillY, 1, t.trl);
      let c = trlColor(level);
      stroke(c); strokeWeight(1);
      line(cx - thermW / 2 + 2, y, cx + thermW / 2 - 2, y);
    }

    // TRL scale ticks
    for (let lvl = 1; lvl <= 9; lvl++) {
      let y = thermBot - (lvl / 9) * thermH;
      stroke(120); strokeWeight(0.5);
      line(cx + thermW / 2, y, cx + thermW / 2 + 5, y);
      fill(120); noStroke(); textSize(8); textAlign(LEFT, CENTER);
      text(lvl, cx + thermW / 2 + 7, y);
    }

    // TRL value
    fill(30); noStroke(); textSize(16); textAlign(CENTER, CENTER);
    textStyle(BOLD);
    text(t.trl, cx, thermBot - fillH / 2);
    textStyle(NORMAL);

    // Acceptable range overlay
    let minTRL = [7, 5, 3][riskTolerance];
    let cutoffY = thermBot - (minTRL / 9) * thermH;
    if (t.trl < minTRL) {
      fill(244, 67, 54, 30); noStroke();
      rect(cx - thermW / 2, thermTop, thermW, cutoffY - thermTop);
    }

    // Acceptable indicator
    if (t.trl >= minTRL) {
      fill(76, 175, 80); noStroke(); textSize(10);
      text('✓', cx, thermTop - 8);
    } else {
      fill(244, 67, 54); noStroke(); textSize(10);
      text('✗', cx, thermTop - 8);
    }

    // Technology name
    fill(50); noStroke(); textSize(10); textAlign(CENTER, TOP);
    text(t.name, cx, thermBot + 8);

    // Bulb at bottom
    fill(trlColor(1)); stroke(180); strokeWeight(1);
    ellipse(cx, thermBot + 2, thermW + 6);
  }

  // Detail panel
  if (selectedTech !== null) {
    let t = technologies[selectedTech];
    let panelY = 340;
    let panelH = drawHeight - panelY - 10;
    fill(255, 250, 240); stroke(200); strokeWeight(1);
    rect(15, panelY, canvasWidth - 30, panelH, 5);

    fill(30); noStroke(); textSize(13); textAlign(LEFT, TOP);
    textStyle(BOLD);
    text(t.name.replace('\n', ' ') + ' — TRL ' + t.trl, 25, panelY + 8);
    textStyle(NORMAL); textSize(10); fill(50);

    let yy = panelY + 28;
    text('Justification: ' + t.justification, 25, yy, canvasWidth - 60, 30); yy += 35;
    text('Key Milestones: ' + t.milestones.join(', '), 25, yy, canvasWidth - 60, 30); yy += 35;
    text('Timeline: ' + t.timeline, 25, yy); yy += 18;
    text('Risk: ' + t.risk, 25, yy, canvasWidth - 60, 30);
  }

  // Hover tooltip
  if (hoveredTech !== null && selectedTech !== hoveredTech) {
    let t = technologies[hoveredTech];
    let tip = t.name.replace('\n', ' ') + ': TRL ' + t.trl;
    fill(50, 50, 50, 220); noStroke();
    let tw = textWidth(tip) + 16;
    rect(mouseX + 10, mouseY - 22, tw, 20, 4);
    fill(255); textSize(10); textAlign(LEFT, CENTER);
    text(tip, mouseX + 18, mouseY - 12);
  }
}

function drawCompareView() {
  let t1 = technologies[comparePair[0]];
  let t2 = technologies[comparePair[1]];

  // Two side-by-side thermometers
  let positions = [canvasWidth * 0.3, canvasWidth * 0.7];
  let thermW = 50;
  let thermH = 260;
  let thermTop = 70;
  let thermBot = thermTop + thermH;

  for (let idx = 0; idx < 2; idx++) {
    let t = idx === 0 ? t1 : t2;
    let cx = positions[idx];

    fill(240); stroke(180); strokeWeight(2);
    rect(cx - thermW / 2, thermTop, thermW, thermH, thermW / 2);

    let fillH = (t.trl / 9) * thermH;
    for (let y = thermBot - fillH; y < thermBot; y++) {
      let level = map(y, thermBot, thermBot - fillH, 1, t.trl);
      let c = trlColor(level);
      stroke(c); strokeWeight(1);
      line(cx - thermW / 2 + 2, y, cx + thermW / 2 - 2, y);
    }

    fill(30); noStroke(); textSize(20); textAlign(CENTER, CENTER);
    textStyle(BOLD);
    text(t.trl, cx, thermBot - fillH / 2);
    textStyle(NORMAL);

    for (let lvl = 1; lvl <= 9; lvl++) {
      let y = thermBot - (lvl / 9) * thermH;
      stroke(120); strokeWeight(0.5);
      line(cx + thermW / 2, y, cx + thermW / 2 + 5, y);
      fill(120); noStroke(); textSize(9); textAlign(LEFT, CENTER);
      text(lvl, cx + thermW / 2 + 7, y);
    }

    fill(50); noStroke(); textSize(12); textAlign(CENTER, TOP);
    text(t.name, cx, thermBot + 15);
    fill(trlColor(1)); stroke(180); strokeWeight(1);
    ellipse(cx, thermBot + 2, thermW + 8);
  }

  // Comparison panel
  let panelY = 380;
  fill(255, 250, 240); stroke(200); strokeWeight(1);
  rect(15, panelY, canvasWidth - 30, drawHeight - panelY - 10, 5);

  fill(30); noStroke(); textSize(11); textAlign(LEFT, TOP);
  textStyle(BOLD);
  text('Comparison: ' + t1.name.replace('\n', ' ') + ' vs ' + t2.name.replace('\n', ' '), 25, panelY + 8);
  textStyle(NORMAL); textSize(10); fill(50);

  let diff = t1.trl - t2.trl;
  let msg = diff > 0 ? t1.name.replace('\n', ' ') + ' is ' + diff + ' TRL levels ahead.' :
            diff < 0 ? t2.name.replace('\n', ' ') + ' is ' + (-diff) + ' TRL levels ahead.' :
            'Both at same TRL level.';
  text(msg, 25, panelY + 28);
  text(t1.name.replace('\n', ' ') + ': ' + t1.timeline, 25, panelY + 48);
  text(t2.name.replace('\n', ' ') + ': ' + t2.timeline, 25, panelY + 64);

  // Click tech labels to change compare pair
  fill(100); textSize(9); textAlign(CENTER, TOP);
  text('Click a thermometer in normal mode to select, or choose below:', canvasWidth / 2, panelY + 85);
  let btnY = panelY + 100;
  for (let i = 0; i < 5; i++) {
    let bx = 30 + i * (canvasWidth - 60) / 5;
    let isInPair = comparePair[0] === i || comparePair[1] === i;
    fill(isInPair ? color(33, 150, 243) : 220);
    stroke(isInPair ? color(25, 118, 210) : 180); strokeWeight(1);
    rect(bx, btnY, 60, 22, 4);
    fill(isInPair ? 255 : 50); noStroke(); textSize(8); textAlign(CENTER, CENTER);
    text(technologies[i].abbr, bx + 30, btnY + 11);
  }
}

function mousePressed() {
  if (compareMode) {
    // Check tech buttons in compare view
    let panelY = 380;
    let btnY = panelY + 100;
    for (let i = 0; i < 5; i++) {
      let bx = 30 + i * (canvasWidth - 60) / 5;
      if (mouseX > bx && mouseX < bx + 60 && mouseY > btnY && mouseY < btnY + 22) {
        if (comparePair[0] !== i) {
          comparePair[1] = comparePair[0];
          comparePair[0] = i;
        }
        return;
      }
    }
  } else {
    // Check thermometer clicks
    let count = 5;
    let spacing = (canvasWidth - 60) / count;
    let thermW = min(40, spacing * 0.5);
    let thermTop = 70;
    let thermBot = thermTop + 220;

    for (let i = 0; i < count; i++) {
      let cx = 40 + i * spacing + spacing / 2;
      if (mouseX > cx - thermW - 5 && mouseX < cx + thermW + 5 && mouseY > thermTop && mouseY < thermBot + 30) {
        selectedTech = (selectedTech === i) ? null : i;
        return;
      }
    }
    selectedTech = null;
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
