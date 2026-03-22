// Case Study Analysis Dashboard MicroSim
// Chapter 17: Industry Case Studies
let containerWidth;
let canvasWidth = 400;
let drawHeight = 600;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

let industries = ['Supply Chain', 'Healthcare', 'Finance', 'E-Commerce', 'Retail'];
let industryColors;

let caseStudies = [
  {name:'Walmart Food Track', industry:0, evStrength:0.85, valueAdd:0.80, outcome:'success',
   problem:'Food safety traceability across complex supply chain.',
   arch:'Hyperledger Fabric with IBM Food Trust.',
   result:'Reduced trace time from 7 days to 2.2 seconds.',
   counterfactual:'Centralized DB could achieve similar with full vendor cooperation.',
   lessons:'Success driven by Walmart\'s market power, not blockchain per se.'},
  {name:'Maersk TradeLens', industry:0, evStrength:0.60, valueAdd:0.35, outcome:'failure',
   problem:'Global shipping documentation and tracking.',
   arch:'Hyperledger Fabric consortium blockchain.',
   result:'Shut down in 2022 due to low industry adoption.',
   counterfactual:'API-based platform would have lower adoption barriers.',
   lessons:'Competitor reluctance to join rival-controlled platform.'},
  {name:'MedRec Health', industry:1, evStrength:0.45, valueAdd:0.55, outcome:'mixed',
   problem:'Patient medical record portability and consent.',
   arch:'Ethereum-based with off-chain storage.',
   result:'Pilot showed promise but scaling challenges remain.',
   counterfactual:'FHIR standards with OAuth solve most interop needs.',
   lessons:'Regulatory complexity in healthcare limits blockchain value.'},
  {name:'Pharma Track', industry:1, evStrength:0.70, valueAdd:0.65, outcome:'success',
   problem:'Drug supply chain verification (DSCSA compliance).',
   arch:'Private blockchain with serialization.',
   result:'Achieved regulatory compliance with audit trail.',
   counterfactual:'Centralized track-and-trace also meets DSCSA requirements.',
   lessons:'Blockchain adds marginal value over centralized alternatives.'},
  {name:'JPM Onyx', industry:2, evStrength:0.75, valueAdd:0.70, outcome:'success',
   problem:'Wholesale payments and repo market settlement.',
   arch:'Quorum (Ethereum fork) private network.',
   result:'$300B+ in intraday repo transactions processed.',
   counterfactual:'Existing RTGS systems handle similar volumes.',
   lessons:'Value in reducing settlement time, not decentralization.'},
  {name:'ASX CHESS Replace', industry:2, evStrength:0.80, valueAdd:0.20, outcome:'failure',
   problem:'Replace equity clearing and settlement system.',
   arch:'Digital Asset\'s DAML on VMware blockchain.',
   result:'Abandoned after 7 years and $250M+ investment.',
   counterfactual:'Conventional database upgrade was the eventual path.',
   lessons:'Blockchain added complexity without proportional benefit.'},
  {name:'De Beers Tracr', industry:4, evStrength:0.55, valueAdd:0.60, outcome:'mixed',
   problem:'Diamond provenance from mine to retail.',
   arch:'Private blockchain with IoT integration.',
   result:'Tracks millions of diamonds; adoption varies by region.',
   counterfactual:'Centralized certification databases already exist (Kimberley).',
   lessons:'Value depends on trust gaps between specific participants.'},
  {name:'Shopify NFT', industry:3, evStrength:0.35, valueAdd:0.25, outcome:'failure',
   problem:'Customer loyalty and digital collectibles.',
   arch:'Polygon-based NFT minting for merchants.',
   result:'Low merchant and consumer adoption; feature deprioritized.',
   counterfactual:'Traditional loyalty points programs more effective.',
   lessons:'Consumer crypto literacy too low for mass-market adoption.'},
  {name:'VeChain Wine', industry:4, evStrength:0.50, valueAdd:0.50, outcome:'mixed',
   problem:'Wine authenticity and provenance tracking.',
   arch:'VeChainThor public blockchain with NFC tags.',
   result:'Adopted by some premium brands; limited mass-market traction.',
   counterfactual:'QR codes with centralized DB achieve similar UX.',
   lessons:'Premium segment values provenance story more than technology.'}
];

let selectedStudy = null;
let outcomeFilter = 'all';
let industryFilters = [true, true, true, true, true];
let showAlternatives = false;
let hoveredStudy = null;
let outcomeBtns = [];
let industryCBs = [];
let altCB;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');
  industryColors = [
    color(33, 150, 243),   // Supply Chain - blue
    color(76, 175, 80),    // Healthcare - green
    color(244, 67, 54),    // Finance - red
    color(156, 39, 176),   // E-Commerce - purple
    color(255, 152, 0)     // Retail - orange
  ];

  // Industry checkboxes
  for (let i = 0; i < 5; i++) {
    let cb = createCheckbox(industries[i], true);
    cb.parent(document.querySelector('main'));
    cb.style('font-size', '12px');
    cb.style('margin', '1px 6px');
    cb.style('display', 'inline-block');
    let idx = i;
    cb.changed(() => { industryFilters[idx] = cb.checked(); });
    industryCBs.push(cb);
  }

  // Outcome select
  let sel = createSelect();
  sel.parent(document.querySelector('main'));
  sel.option('All Outcomes', 'all');
  sel.option('Success', 'success');
  sel.option('Mixed', 'mixed');
  sel.option('Failure', 'failure');
  sel.style('font-size', '12px');
  sel.style('margin', '4px');
  sel.changed(() => { outcomeFilter = sel.value(); });

  altCB = createCheckbox('Show Alternative Approaches', false);
  altCB.parent(document.querySelector('main'));
  altCB.style('font-size', '12px');
  altCB.style('margin', '2px 8px');
  altCB.changed(() => { showAlternatives = altCB.checked(); });
}

function draw() {
  updateCanvasSize();
  background('aliceblue');
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Title
  fill(30); noStroke(); textSize(16); textAlign(CENTER, TOP);
  text('Case Study Analysis Dashboard', canvasWidth / 2, 8);

  // Scatter plot area
  let plotL = 70, plotR = canvasWidth - 30;
  let plotT = 40, plotB = 310;
  let plotW = plotR - plotL;
  let plotH = plotB - plotT;

  // Axes
  stroke(180); strokeWeight(1);
  line(plotL, plotB, plotR, plotB);
  line(plotL, plotT, plotL, plotB);

  fill(80); noStroke(); textSize(10);
  textAlign(CENTER, TOP);
  text('Evidence Strength', (plotL + plotR) / 2, plotB + 5);
  push(); translate(plotL - 18, (plotT + plotB) / 2); rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  text(showAlternatives ? 'Alternative Value' : 'Blockchain Value-Add', 0, 0);
  pop();

  // Grid lines
  stroke(230); strokeWeight(0.5);
  for (let i = 1; i <= 4; i++) {
    let x = plotL + (i / 5) * plotW;
    let y = plotT + (i / 5) * plotH;
    line(x, plotT, x, plotB);
    line(plotL, y, plotR, y);
  }

  // Quadrant labels
  fill(200); noStroke(); textSize(9); textAlign(CENTER, CENTER);
  text('Weak Evidence\nLow Value', plotL + plotW * 0.25, plotT + plotH * 0.75);
  text('Strong Evidence\nLow Value', plotL + plotW * 0.75, plotT + plotH * 0.75);
  text('Weak Evidence\nHigh Value', plotL + plotW * 0.25, plotT + plotH * 0.25);
  text('Strong Evidence\nHigh Value', plotL + plotW * 0.75, plotT + plotH * 0.25);

  // Quadrant dividers
  stroke(220); strokeWeight(1); setLineDash([5, 5]);
  line(plotL + plotW / 2, plotT, plotL + plotW / 2, plotB);
  line(plotL, plotT + plotH / 2, plotR, plotT + plotH / 2);
  setLineDash([]);

  // Plot dots
  hoveredStudy = null;
  for (let cs of caseStudies) {
    if (!industryFilters[cs.industry]) continue;
    if (outcomeFilter !== 'all' && cs.outcome !== outcomeFilter) continue;

    let valY = showAlternatives ? (1 - cs.valueAdd) * 0.8 + 0.1 : cs.valueAdd;
    let dx = plotL + cs.evStrength * plotW;
    let dy = plotT + (1 - valY) * plotH;
    let dotR = 10;

    let isHover = dist(mouseX, mouseY, dx, dy) < dotR + 3;
    if (isHover) hoveredStudy = cs;
    let isSelected = selectedStudy === cs;

    // Outcome shape border
    let c = industryColors[cs.industry];
    fill(red(c), green(c), blue(c), isSelected ? 255 : 180);
    stroke(isSelected ? 0 : 100);
    strokeWeight(isSelected ? 3 : isHover ? 2 : 1);

    if (cs.outcome === 'success') ellipse(dx, dy, dotR * 2);
    else if (cs.outcome === 'failure') {
      // X shape with filled circle
      ellipse(dx, dy, dotR * 2);
      stroke(255); strokeWeight(2);
      line(dx - 4, dy - 4, dx + 4, dy + 4);
      line(dx - 4, dy + 4, dx + 4, dy - 4);
    } else {
      // Mixed: half-filled
      ellipse(dx, dy, dotR * 2);
      fill(255, 255, 255, 100);
      noStroke();
      arc(dx, dy, dotR * 2, dotR * 2, -HALF_PI, HALF_PI);
    }

    // Label
    fill(50); noStroke(); textSize(8); textAlign(LEFT, CENTER);
    text(cs.name, dx + dotR + 3, dy);
  }

  // Legend
  let legX = plotL + 5;
  let legY = plotB + 22;
  textSize(9); textAlign(LEFT, CENTER);
  for (let i = 0; i < 5; i++) {
    fill(industryColors[i]); noStroke();
    ellipse(legX + i * 95, legY, 10);
    fill(50); text(industries[i], legX + 8 + i * 95, legY);
  }

  // Detail panel
  if (selectedStudy) {
    let panelY = plotB + 40;
    let panelH = drawHeight - panelY - 10;
    fill(255, 250, 240); stroke(200); strokeWeight(1);
    rect(15, panelY, canvasWidth - 30, panelH, 5);

    let s = selectedStudy;
    fill(30); noStroke(); textSize(13); textAlign(LEFT, TOP);
    textStyle(BOLD);
    text(s.name, 25, panelY + 8);
    textStyle(NORMAL);

    fill(industryColors[s.industry]); textSize(10);
    text(industries[s.industry] + ' | ' + s.outcome.toUpperCase(), 25, panelY + 26);

    fill(50); textSize(10);
    let details = 'Problem: ' + s.problem +
      '\nArchitecture: ' + s.arch +
      '\nOutcome: ' + s.result +
      '\nCounterfactual: ' + s.counterfactual +
      '\nLessons: ' + s.lessons;
    text(details, 25, panelY + 42, canvasWidth - 60, panelH - 50);
  }

  // Hover tooltip
  if (hoveredStudy && hoveredStudy !== selectedStudy) {
    let tip = hoveredStudy.name + ' (' + hoveredStudy.outcome + ')';
    fill(50, 50, 50, 220); noStroke();
    let tw = textWidth(tip) + 16;
    rect(mouseX + 12, mouseY - 22, tw, 20, 4);
    fill(255); textSize(10); textAlign(LEFT, CENTER);
    text(tip, mouseX + 20, mouseY - 12);
  }

  // Control region
  fill('white'); stroke('silver'); strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);
  fill(80); noStroke(); textSize(11); textAlign(CENTER, CENTER);
  text('Click dots to view case study details. Use filters to compare.', canvasWidth / 2, drawHeight + 20);
}

function setLineDash(list) {
  drawingContext.setLineDash(list);
}

function mousePressed() {
  let plotL = 70, plotR = canvasWidth - 30;
  let plotT = 40, plotB = 310;
  let plotW = plotR - plotL;
  let plotH = plotB - plotT;

  for (let cs of caseStudies) {
    if (!industryFilters[cs.industry]) continue;
    if (outcomeFilter !== 'all' && cs.outcome !== outcomeFilter) continue;

    let valY = showAlternatives ? (1 - cs.valueAdd) * 0.8 + 0.1 : cs.valueAdd;
    let dx = plotL + cs.evStrength * plotW;
    let dy = plotT + (1 - valY) * plotH;

    if (dist(mouseX, mouseY, dx, dy) < 13) {
      selectedStudy = (selectedStudy === cs) ? null : cs;
      return;
    }
  }
  selectedStudy = null;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
  containerWidth = select('main').width;
  canvasWidth = containerWidth;
}
