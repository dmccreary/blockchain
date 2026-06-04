// Token Types Comparison MicroSim
// Side-by-side fungible vs NFT comparison
let containerWidth;
let canvasWidth = 400;
let drawHeight = 430;
let controlHeight = 70;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

let resetBtn;
let showMetadata = false;
let metadataCheck;

// Wallet state
let walletA = { fungible: 100, nfts: [0, 1] };
let walletB = { fungible: 50, nfts: [2] };

let nftData = [
  { id: 0, name: 'CryptoKitty #42', rarity: 'Rare', color: '#E91E63', price: '2.5 ETH' },
  { id: 1, name: 'Bored Ape #101', rarity: 'Epic', color: '#9C27B0', price: '80 ETH' },
  { id: 2, name: 'Punk #7890', rarity: 'Common', color: '#00BCD4', price: '5 ETH' }
];

let transferAnim = null; // { type, fromA, progress }
let selectedNFT = -1;
let hoveredItem = null;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));

  resetBtn = createButton('Reset Wallets');
  resetBtn.parent(document.querySelector('main'));
  resetBtn.mousePressed(() => {
    walletA = { fungible: 100, nfts: [0, 1] };
    walletB = { fungible: 50, nfts: [2] };
    transferAnim = null;
  });

  metadataCheck = createCheckbox('Show Metadata', false);
  metadataCheck.parent(document.querySelector('main'));
  metadataCheck.changed(() => { showMetadata = metadataCheck.checked(); });

  describe('Side-by-side comparison of fungible ERC-20 tokens and non-fungible ERC-721 tokens.');
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
  text('Token Types Comparison', canvasWidth / 2, 8);

  let halfW = canvasWidth / 2;
  hoveredItem = null;

  // Left panel: Fungible
  drawPanel(margin, 30, halfW - margin * 1.5, drawHeight - 40, 'Fungible (ERC-20)', '#4CAF50');
  // Right panel: NFT
  drawPanel(halfW + margin * 0.5, 30, halfW - margin * 1.5, drawHeight - 40, 'Non-Fungible (ERC-721)', '#2196F3');

  // Fungible wallets
  let fLeft = margin + 10;
  let fW = halfW - margin * 1.5 - 20;
  drawFungibleWallet('Wallet A', walletA.fungible, fLeft, 80, fW, 70, true);
  drawFungibleWallet('Wallet B', walletB.fungible, fLeft, 170, fW, 70, false);

  // Fungible properties
  let propY = 260;
  fill('#333');
  noStroke();
  textSize(10);
  textAlign(LEFT, TOP);
  let props = ['Divisible: Yes', 'Interchangeable: Yes', 'Unique: No', 'Standard: ERC-20', 'Analogy: Dollar bills'];
  for (let i = 0; i < props.length; i++) {
    text(props[i], fLeft + 5, propY + i * 14);
  }

  // NFT wallets
  let nLeft = halfW + margin * 0.5 + 10;
  let nW = halfW - margin * 1.5 - 20;
  drawNFTWallet('Wallet A', walletA.nfts, nLeft, 80, nW, 90, true);
  drawNFTWallet('Wallet B', walletB.nfts, nLeft, 190, nW, 90, false);

  // NFT properties
  propY = 300;
  fill('#333');
  noStroke();
  textSize(10);
  textAlign(LEFT, TOP);
  let nProps = ['Divisible: No', 'Interchangeable: No', 'Unique: Yes', 'Standard: ERC-721', 'Analogy: Baseball cards'];
  for (let i = 0; i < nProps.length; i++) {
    text(nProps[i], nLeft + 5, propY + i * 14);
  }

  // Transfer animation
  if (transferAnim) {
    transferAnim.progress += 0.03;
    if (transferAnim.progress >= 1) {
      transferAnim = null;
    } else {
      fill('#FFD700');
      noStroke();
      let ax = transferAnim.fromA ? canvasWidth / 4 : canvasWidth * 3 / 4;
      let bx = transferAnim.fromA ? canvasWidth * 3 / 4 : canvasWidth / 4;
      let cy = lerp(transferAnim.fromA ? 115 : 205, transferAnim.fromA ? 205 : 115, transferAnim.progress);
      let cx = lerp(ax, bx, transferAnim.progress);
      ellipse(cx, cy, 16, 16);
    }
  }

  // Tooltip
  if (hoveredItem) {
    fill(255, 255, 230, 240);
    stroke('#999');
    strokeWeight(1);
    let tw = textWidth(hoveredItem) + 16;
    let tx = constrain(mouseX + 10, 0, canvasWidth - tw);
    rect(tx, mouseY - 22, tw, 20, 3);
    fill('#333');
    noStroke();
    textSize(10);
    textAlign(LEFT, CENTER);
    text(hoveredItem, tx + 8, mouseY - 12);
  }

  // Controls
  fill('#333');
  noStroke();
  textSize(11);
  textAlign(LEFT, CENTER);
  text('Click wallets to transfer tokens between them.', margin, drawHeight + 15);
  resetBtn.position(margin, drawHeight + 30);
  metadataCheck.position(margin + 120, drawHeight + 30);
}

function drawPanel(x, y, w, h, title, color) {
  fill(255, 255, 255, 80);
  stroke(color);
  strokeWeight(2);
  rect(x, y, w, h, 6);
  fill(color);
  noStroke();
  textSize(12);
  textAlign(CENTER, TOP);
  text(title, x + w / 2, y + 5);
}

function drawFungibleWallet(name, amount, x, y, w, h, isA) {
  fill('#E8F5E9');
  stroke('#4CAF50');
  strokeWeight(1);
  rect(x, y, w, h, 5);

  fill('#333');
  noStroke();
  textSize(11);
  textAlign(LEFT, TOP);
  text(name + ': ' + amount + ' USDC', x + 8, y + 8);

  // Draw coin stack
  let coins = Math.min(Math.floor(amount / 10), 10);
  for (let i = 0; i < coins; i++) {
    fill('#FFD700');
    stroke('#DAA520');
    strokeWeight(1);
    ellipse(x + 20 + i * 14, y + 45, 12, 12);
    fill('#333');
    noStroke();
    textSize(7);
    textAlign(CENTER, CENTER);
    text('$', x + 20 + i * 14, y + 45);
  }

  // Hover check
  if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
    hoveredItem = 'Click to transfer 10 USDC to ' + (isA ? 'Wallet B' : 'Wallet A');
  }
}

function drawNFTWallet(name, nftIds, x, y, w, h, isA) {
  fill('#E3F2FD');
  stroke('#2196F3');
  strokeWeight(1);
  rect(x, y, w, h, 5);

  fill('#333');
  noStroke();
  textSize(11);
  textAlign(LEFT, TOP);
  text(name + ' (' + nftIds.length + ' NFTs)', x + 8, y + 8);

  // Draw NFT cards
  for (let i = 0; i < nftIds.length; i++) {
    let nft = nftData[nftIds[i]];
    let cx = x + 15 + i * 60;
    let cy = y + 35;
    fill(nft.color);
    stroke('#666');
    strokeWeight(1);
    rect(cx, cy, 50, 40, 4);
    fill('#fff');
    noStroke();
    textSize(7);
    textAlign(CENTER, CENTER);
    text(nft.name.substring(0, 12), cx + 25, cy + 12);
    if (showMetadata) {
      textSize(6);
      text(nft.rarity, cx + 25, cy + 22);
      text(nft.price, cx + 25, cy + 32);
    }

    // Hover
    if (mouseX > cx && mouseX < cx + 50 && mouseY > cy && mouseY < cy + 40) {
      hoveredItem = nft.name + ' - ' + nft.rarity + ' - ' + nft.price + ' (click to transfer)';
      selectedNFT = nftIds[i];
    }
  }
}

function mousePressed() {
  let halfW = canvasWidth / 2;
  let fLeft = margin + 10;
  let fW = halfW - margin * 1.5 - 20;

  // Fungible wallet A click
  if (mouseX > fLeft && mouseX < fLeft + fW && mouseY > 80 && mouseY < 150) {
    if (walletA.fungible >= 10) {
      walletA.fungible -= 10;
      walletB.fungible += 10;
      transferAnim = { fromA: true, progress: 0 };
    }
  }
  // Fungible wallet B click
  if (mouseX > fLeft && mouseX < fLeft + fW && mouseY > 170 && mouseY < 240) {
    if (walletB.fungible >= 10) {
      walletB.fungible -= 10;
      walletA.fungible += 10;
      transferAnim = { fromA: false, progress: 0 };
    }
  }

  // NFT clicks
  let nLeft = halfW + margin * 0.5 + 10;
  let nW = halfW - margin * 1.5 - 20;

  if (mouseX > nLeft && mouseX < nLeft + nW) {
    if (mouseY > 80 && mouseY < 170 && selectedNFT >= 0 && walletA.nfts.includes(selectedNFT)) {
      walletA.nfts = walletA.nfts.filter(id => id !== selectedNFT);
      walletB.nfts.push(selectedNFT);
    } else if (mouseY > 190 && mouseY < 280 && selectedNFT >= 0 && walletB.nfts.includes(selectedNFT)) {
      walletB.nfts = walletB.nfts.filter(id => id !== selectedNFT);
      walletA.nfts.push(selectedNFT);
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
