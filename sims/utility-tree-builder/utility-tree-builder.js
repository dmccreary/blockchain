// Utility Tree Builder MicroSim
// Interactive tree builder for quality attributes
let containerWidth;
let canvasWidth = 400;
let drawHeight = 480;
let controlHeight = 70;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

let addBranchBtn, addSubBtn, addScenarioBtn, resetBtn, summaryBtn;
let attrSel;
let selectedNode = null;
let hoveredNode = null;
let showSummary = false;
let scrollOffset = 0;

// Tree data
let tree = {
  label: 'Overall Utility',
  type: 'root',
  children: [],
  expanded: true
};

let qualityAttrs = ['Performance', 'Security', 'Availability', 'Modifiability', 'Auditability', 'Cost'];
let subAttrs = {
  'Performance': ['Throughput', 'Latency', 'Finality Time'],
  'Security': ['Confidentiality', 'Integrity', 'Key Management'],
  'Availability': ['Uptime', 'Fault Tolerance', 'Recovery'],
  'Modifiability': ['Upgradability', 'Extensibility', 'Configurability'],
  'Auditability': ['Traceability', 'Compliance', 'Transparency'],
  'Cost': ['Infrastructure', 'Transaction Fees', 'Development']
};

let scenarioTemplates = {
  'Throughput': '10x transaction spike during peak',
  'Latency': 'Sub-second response for payment',
  'Finality Time': 'Settlement within 30 seconds',
  'Confidentiality': 'Private data visible only to parties',
  'Integrity': 'Detect tampered transaction records',
  'Key Management': 'Recover from lost validator key',
  'Uptime': '99.99% availability SLA',
  'Fault Tolerance': '1/3 of nodes go offline',
  'Recovery': 'Restore after network partition',
  'Upgradability': 'Deploy new smart contract version',
  'Extensibility': 'Add new token type to platform',
  'Configurability': 'Change consensus parameters',
  'Traceability': 'Trace asset through 5 transfers',
  'Compliance': 'GDPR right-to-erasure request',
  'Transparency': 'Auditor verifies all transactions',
  'Infrastructure': 'Scale to 50 validator nodes',
  'Transaction Fees': 'Gas cost under $0.10 per tx',
  'Development': 'New feature in under 2 sprints'
};

let nextId = 1;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));

  addBranchBtn = createButton('Add Quality Attribute');
  addBranchBtn.parent(document.querySelector('main'));
  addBranchBtn.mousePressed(addBranch);

  addSubBtn = createButton('Add Sub-Attribute');
  addSubBtn.parent(document.querySelector('main'));
  addSubBtn.mousePressed(addSubAttribute);

  addScenarioBtn = createButton('Add Scenario');
  addScenarioBtn.parent(document.querySelector('main'));
  addScenarioBtn.mousePressed(addScenario);

  resetBtn = createButton('Reset');
  resetBtn.parent(document.querySelector('main'));
  resetBtn.mousePressed(() => {
    tree.children = [];
    selectedNode = null;
    showSummary = false;
    nextId = 1;
  });

  summaryBtn = createButton('Priority Summary');
  summaryBtn.parent(document.querySelector('main'));
  summaryBtn.mousePressed(() => { showSummary = !showSummary; });

  describe('Interactive utility tree builder for ATAM quality attribute analysis.');
}

function addBranch() {
  if (tree.children.length >= 6) return;
  let available = qualityAttrs.filter(a => !tree.children.find(c => c.label === a));
  if (available.length === 0) return;
  let attr = available[0];
  tree.children.push({
    id: nextId++, label: attr, type: 'branch', children: [], expanded: true,
    importance: 'M', difficulty: 'M'
  });
}

function addSubAttribute() {
  if (!selectedNode || selectedNode.type !== 'branch') return;
  let subs = subAttrs[selectedNode.label] || ['Custom Sub-Attribute'];
  let available = subs.filter(s => !selectedNode.children.find(c => c.label === s));
  if (available.length === 0) return;
  selectedNode.children.push({
    id: nextId++, label: available[0], type: 'sub', children: [], expanded: true,
    importance: 'M', difficulty: 'M'
  });
}

function addScenario() {
  if (!selectedNode || (selectedNode.type !== 'sub' && selectedNode.type !== 'branch')) return;
  let template = scenarioTemplates[selectedNode.label] || 'Custom scenario for ' + selectedNode.label;
  selectedNode.children.push({
    id: nextId++, label: template, type: 'scenario',
    importance: 'H', difficulty: 'H'
  });
}

function getNodeColor(node) {
  if (node.type === 'root') return '#455A64';
  if (!node.importance) return '#BDBDBD';
  if (node.importance === 'H' && node.difficulty === 'H') return '#E53935';
  if (node.importance === 'H' && node.difficulty === 'M') return '#FF9800';
  return '#BDBDBD';
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
  textSize(14);
  textAlign(CENTER, TOP);
  text('Utility Tree Builder', canvasWidth / 2, 6);

  hoveredNode = null;

  if (showSummary) {
    drawSummaryPanel();
  } else {
    // Draw tree
    let treeX = margin;
    let treeY = 30 - scrollOffset;
    drawTreeNode(tree, treeX, treeY, 0);
  }

  // Controls
  let cy = drawHeight + 5;
  addBranchBtn.position(margin, cy);
  addSubBtn.position(margin + 140, cy);
  addScenarioBtn.position(margin + 260, cy);
  resetBtn.position(margin, cy + 28);
  summaryBtn.position(margin + 60, cy + 28);

  fill('#666');
  noStroke();
  textSize(9);
  textAlign(LEFT, CENTER);
  let selLabel = selectedNode ? 'Selected: ' + selectedNode.label : 'Click a node to select it';
  text(selLabel, margin + 180, cy + 40);

  // Tooltip
  if (hoveredNode && hoveredNode !== selectedNode) {
    let tip = hoveredNode.label;
    if (hoveredNode.importance) tip += ' [' + hoveredNode.importance + ',' + hoveredNode.difficulty + ']';
    fill(255, 255, 230, 240);
    stroke('#999');
    strokeWeight(1);
    textSize(10);
    let tw = textWidth(tip) + 14;
    let tx = constrain(mouseX + 10, 0, canvasWidth - tw);
    rect(tx, mouseY - 22, tw, 20, 3);
    fill('#333');
    noStroke();
    textAlign(LEFT, CENTER);
    text(tip, tx + 7, mouseY - 12);
  }
}

let drawY = 0;
function drawTreeNode(node, x, y, depth) {
  let nodeW = Math.min(180, canvasWidth - x - margin - 40);
  let nodeH = node.type === 'scenario' ? 28 : 24;
  drawY = y;

  let col = getNodeColor(node);
  let isSelected = node === selectedNode;
  let isHover = mouseX > x && mouseX < x + nodeW && mouseY > y && mouseY < y + nodeH;
  if (isHover) hoveredNode = node;

  // Node box
  fill(isSelected ? '#FFE082' : isHover ? '#FFF9C4' : '#fff');
  stroke(col);
  strokeWeight(isSelected ? 3 : 1);
  rect(x, y, nodeW, nodeH, 4);

  // Color indicator
  fill(col);
  noStroke();
  rect(x, y, 5, nodeH, 4, 0, 0, 4);

  // Label
  fill('#333');
  noStroke();
  textSize(node.type === 'scenario' ? 8 : 10);
  textAlign(LEFT, CENTER);
  let displayLabel = node.label;
  if (displayLabel.length > 30) displayLabel = displayLabel.substring(0, 28) + '...';
  text(displayLabel, x + 10, y + nodeH / 2);

  // Importance/difficulty badge
  if (node.importance && node.type !== 'root') {
    let badge = '[' + node.importance + ',' + node.difficulty + ']';
    textSize(8);
    fill(col);
    textAlign(RIGHT, CENTER);
    text(badge, x + nodeW - 4, y + nodeH / 2);
  }

  // Expand indicator
  if (node.children && node.children.length > 0) {
    fill('#888');
    textSize(10);
    textAlign(LEFT, CENTER);
    text(node.expanded ? '-' : '+', x + nodeW + 4, y + nodeH / 2);
  }

  // Draw children
  let childY = y + nodeH + 6;
  if (node.expanded && node.children) {
    for (let i = 0; i < node.children.length; i++) {
      let child = node.children[i];
      let childX = x + 25;

      // Connecting line
      stroke('#ccc');
      strokeWeight(1);
      line(x + 12, y + nodeH, x + 12, childY + 12);
      line(x + 12, childY + 12, childX, childY + 12);

      drawTreeNode(child, childX, childY, depth + 1);
      childY = drawY + 6;
    }
  }
  drawY = childY;
}

function drawSummaryPanel() {
  fill('#333');
  noStroke();
  textSize(12);
  textAlign(LEFT, TOP);
  text('Priority Summary - High Priority Scenarios', margin, 30);

  let sy = 50;
  textSize(10);

  // Collect all scenarios
  let highPriority = [];
  collectScenarios(tree, highPriority);

  let hh = highPriority.filter(s => s.importance === 'H' && s.difficulty === 'H');
  let hm = highPriority.filter(s => s.importance === 'H' && s.difficulty === 'M');

  fill('#E53935');
  text('(H,H) - Highest Priority:', margin, sy); sy += 16;
  fill('#333');
  if (hh.length === 0) { text('  None yet', margin, sy); sy += 14; }
  for (let s of hh) {
    text('  - ' + s.label, margin, sy); sy += 14;
  }

  sy += 8;
  fill('#FF9800');
  text('(H,M) - High Priority:', margin, sy); sy += 16;
  fill('#333');
  if (hm.length === 0) { text('  None yet', margin, sy); sy += 14; }
  for (let s of hm) {
    text('  - ' + s.label, margin, sy); sy += 14;
  }

  sy += 12;
  fill('#666');
  textSize(9);
  text('Total scenarios: ' + highPriority.length + ' | High priority: ' + (hh.length + hm.length), margin, sy);
}

function collectScenarios(node, arr) {
  if (node.type === 'scenario') arr.push(node);
  if (node.children) {
    for (let c of node.children) collectScenarios(c, arr);
  }
}

function mousePressed() {
  if (mouseY > drawHeight) return;

  // Find clicked node
  let clicked = findNodeAt(tree, margin, 30 - scrollOffset, mouseX, mouseY);
  if (clicked) {
    if (clicked === selectedNode && clicked.children) {
      // Toggle expand
      clicked.expanded = !clicked.expanded;
    } else {
      selectedNode = clicked;
    }
    // Cycle importance/difficulty on double-click area (right side)
    if (clicked.importance && mouseX > canvasWidth - 80) {
      // Cycle importance
      let levels = ['H', 'M', 'L'];
      let idx = levels.indexOf(clicked.importance);
      clicked.importance = levels[(idx + 1) % 3];
    }
  }
}

function findNodeAt(node, x, y, mx, my) {
  let nodeW = Math.min(180, canvasWidth - x - margin - 40);
  let nodeH = node.type === 'scenario' ? 28 : 24;

  if (mx > x && mx < x + nodeW + 15 && my > y && my < y + nodeH) {
    return node;
  }

  let childY = y + nodeH + 6;
  if (node.expanded && node.children) {
    for (let child of node.children) {
      let found = findNodeAt(child, x + 25, childY, mx, my);
      if (found) return found;
      childY = estimateNodeHeight(child, childY);
    }
  }
  return null;
}

function estimateNodeHeight(node, startY) {
  let nodeH = node.type === 'scenario' ? 28 : 24;
  let y = startY + nodeH + 6;
  if (node.expanded && node.children) {
    for (let child of node.children) {
      y = estimateNodeHeight(child, y);
    }
  }
  return y;
}

function mouseWheel(event) {
  scrollOffset += event.delta * 0.5;
  scrollOffset = Math.max(0, scrollOffset);
  return false;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
  containerWidth = select('main').width;
  canvasWidth = containerWidth;
}
