---
title: Smart Contracts and Tokens
description: Programmable blockchain logic, smart contract risks, the oracle problem, fungible and non-fungible tokens, tokenization, wallets, dApps, and cross-chain bridges.
generated_by: claude skill chapter-content-generator
date: 2026-03-22
version: 0.05
---
# Smart Contracts and Tokens

## Summary

This chapter examines programmable blockchain logic and digital assets. Students will learn what smart contracts can and cannot do, the risks they introduce (including the oracle problem), and how tokens represent value on blockchain networks. The chapter covers fungible and non-fungible tokens, tokenization, and the practical aspects of managing digital assets through wallets. A critical perspective on smart contract security is emphasized throughout.

## Concepts Covered

This chapter covers the following 12 concepts from the learning graph:

1. Smart Contract
2. Smart Contract Risks
3. Oracle Problem
4. Token
5. Fungible Token
6. Non-Fungible Token
7. Tokenization
8. Wallet
9. Cold Storage
10. Hot Wallet
11. Decentralized Application
12. Cross-Chain Bridge

## Prerequisites

This chapter builds on concepts from:

- [Chapter 5: Distributed Systems and Ledgers](../05-distributed-systems-ledgers/index.md)
- [Chapter 7: Consensus Mechanisms](../07-consensus-mechanisms/index.md)

---

!!! mascot-welcome "Rex Says: Trust, but Verify!"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Rex welcomes you">
    Welcome back, fellow analysts! We've covered how blockchains store data and reach
    consensus. Now we enter the programmable layer — smart contracts that execute
    automatically and tokens that represent digital (and physical) assets. Sounds
    powerful, right? It is — but "code is law" means bugs are also law. Let's
    examine both the promise and the peril. Trust, but verify — especially the code!

## Learning Objectives

After completing this chapter, you will be able to:

- Define smart contracts and explain how they execute on blockchain networks
- Identify the major categories of smart contract risks and vulnerabilities
- Explain the oracle problem and why it limits smart contract capabilities
- Distinguish between fungible tokens, non-fungible tokens, and tokenized assets
- Compare hot wallets and cold storage in terms of security and usability
- Describe how decentralized applications and cross-chain bridges extend blockchain functionality
- Evaluate smart contract proposals with appropriate skepticism about security and reliability

## What Is a Smart Contract?

A **smart contract** is a program stored on a blockchain that executes automatically when predetermined conditions are met. The term was coined by Nick Szabo in 1994, but the concept gained practical implementation with Ethereum's launch in 2015.

Despite the name, smart contracts are neither smart nor contracts in the legal sense. They are deterministic programs — given the same inputs, they always produce the same outputs. They cannot access external information, exercise judgment, or adapt to circumstances not anticipated by their programmers. The word "contract" is misleading because they lack the flexibility, interpretation, and enforceability mechanisms of legal contracts.

A smart contract works as follows:

1. A developer writes code defining the contract's logic
2. The code is compiled to bytecode and deployed to the blockchain
3. The contract receives a unique address on the blockchain
4. Users interact with the contract by sending transactions to that address
5. The contract executes deterministically on every node in the network
6. Results (state changes) are recorded on the blockchain permanently

The most important property of smart contracts is **immutability**: once deployed, the code cannot be changed. This is presented as a feature — "code is law" — but it is also a profound limitation. If the code contains a bug, that bug is permanent and may be exploitable.

## Smart Contract Risks

**Smart contract risks** encompass a broad category of vulnerabilities that are unique to blockchain-based programs. Unlike traditional software where bugs can be patched with updates, smart contract bugs exist on an immutable ledger managing real money.

The major risk categories include:

| Risk Category | Description | Example |
|---------------|-------------|---------|
| **Coding errors** | Logic bugs in the contract code | The DAO hack (2016) — $60M stolen via reentrancy bug |
| **Reentrancy** | A contract calls back into the calling contract before state updates | Attacker drains funds by recursively calling withdraw() |
| **Integer overflow/underflow** | Arithmetic exceeds variable bounds | Token balances wrap around, creating tokens from nothing |
| **Access control failures** | Missing or incorrect permission checks | Anyone can call administrative functions |
| **Front-running** | Miners or bots see pending transactions and act first | MEV extraction by sandwich attacks on DEX trades |
| **Upgrade risks** | Proxy patterns introduce centralization | Admin key compromised, contract logic replaced maliciously |

The financial impact of smart contract vulnerabilities is staggering. Between 2016 and 2025, over $10 billion has been lost to smart contract exploits, hacks, and rug pulls across DeFi protocols. This is not a theoretical risk — it is a recurring, empirically documented pattern.

**Formal verification** — mathematically proving that code behaves as intended — offers partial mitigation, but it is expensive, limited to simple properties, and cannot verify that the specification itself is correct. **Audits** by specialized security firms are standard practice, but audits are point-in-time assessments that cannot guarantee the absence of all vulnerabilities.

!!! mascot-thinking "Key Insight"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Rex is thinking">
    "Code is law" sounds empowering until the code has a bug. Traditional legal
    contracts have ambiguity, but they also have courts, arbitration, and the ability
    to correct errors after the fact. Smart contracts trade all of that flexibility for
    deterministic execution. When The DAO was exploited in 2016, the Ethereum community
    had to hard-fork the entire blockchain to reverse the theft — a decision that
    contradicted the very immutability principle smart contracts are built on. The
    lesson: immutable code managing mutable real-world situations creates a
    fundamental tension that no amount of auditing fully resolves.

## The Oracle Problem

The **oracle problem** is one of the most fundamental limitations of smart contracts. Because blockchains are deterministic, closed systems, smart contracts cannot natively access information from the outside world — stock prices, weather data, sports scores, delivery confirmations, or any other off-chain data.

An **oracle** is a service that feeds external data into a blockchain so that smart contracts can use it. However, this introduces a critical trust dependency: the entire smart contract's reliability now depends on the oracle's accuracy and honesty.

This creates a paradox: blockchain's value proposition is removing trusted intermediaries, but smart contracts that depend on real-world data must trust an oracle — reintroducing the very intermediary the system was designed to eliminate.

Oracle solutions attempt to mitigate this through various approaches:

- **Decentralized oracle networks** (e.g., Chainlink) — aggregate data from multiple sources and use economic incentives to discourage dishonesty
- **Prediction markets** — use economic bets to crowdsource data accuracy
- **Trusted hardware** (e.g., Intel SGX) — use hardware enclaves to guarantee computation integrity

None of these fully solves the problem. Decentralized oracles reduce single points of failure but introduce their own consensus overhead, cost, and attack surfaces. The oracle problem means that any smart contract claiming to automate real-world processes must be evaluated on the trustworthiness of its data sources, not just its code.

## Tokens: Digital Representations of Value

A **token** is a digital asset created and managed by a smart contract on a blockchain. Unlike native cryptocurrencies (ETH, BTC) which are integral to the protocol, tokens are application-layer constructs that can represent almost anything — currency, assets, rights, identity, or access.

Tokens are defined by token standards — agreed-upon interfaces that ensure interoperability between wallets, exchanges, and applications.

The two primary categories are:

- **Fungible tokens** — interchangeable, like currency
- **Non-fungible tokens** — unique, like a deed or certificate

## Fungible Tokens

A **fungible token** is one where every unit is identical and interchangeable. One token of a given type is worth exactly the same as any other token of that type. The dominant standard is Ethereum's **ERC-20**, which defines a common interface for creating and transferring fungible tokens.

ERC-20 tokens power much of the blockchain ecosystem:

- **Stablecoins** (USDC, USDT) — tokens pegged to fiat currency values
- **Governance tokens** — tokens that grant voting rights in a protocol
- **Utility tokens** — tokens that provide access to a service or platform
- **Wrapped tokens** — tokens representing assets from other blockchains

The ease of creating ERC-20 tokens is both a strength and a risk. Anyone can deploy a new token contract in minutes for less than $100 in gas fees. This has enabled legitimate innovation but also rampant fraud — thousands of tokens have been created solely to extract money from buyers through "rug pulls" (where creators sell their holdings after attracting buyers).

## Non-Fungible Tokens

A **Non-Fungible Token (NFT)** is a unique digital asset with a distinct identifier that cannot be interchanged with any other token. The dominant standard is Ethereum's **ERC-721**. Each NFT has a unique token ID and can carry metadata pointing to associated content.

Critical distinctions about NFTs:

- An NFT is a record on a blockchain — it is not the digital file itself
- Most NFT metadata and media files are stored off-chain (on IPFS, Arweave, or centralized servers)
- Owning an NFT does not necessarily confer copyright, intellectual property rights, or legal ownership of the underlying asset
- If the off-chain storage goes offline, the NFT may point to nothing

The NFT market experienced extreme speculation in 2021-2022, with some individual tokens selling for millions of dollars. By 2024, the market had contracted by over 90%, with many NFT collections effectively valueless. This cycle illustrates a recurring pattern in blockchain markets: technology capability is conflated with investment value, leading to speculative bubbles.

!!! mascot-warning "Bias Alert"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Rex warns you">
    The phrase "you own it on the blockchain" is technically true and practically
    misleading. An NFT proves you control a token ID in a smart contract. It does not
    prove you own the artwork, the intellectual property, or any real-world asset
    unless a separate legal framework enforces that connection. Blockchain proves
    possession of a token. Legal systems prove ownership of property. These are
    different things, and conflating them has cost people significant money.

## Tokenization

**Tokenization** is the process of representing real-world assets as tokens on a blockchain. Proponents argue this enables fractional ownership, 24/7 trading, and reduced settlement times for traditionally illiquid assets like real estate, fine art, or private equity.

Potential benefits of tokenization:

- **Fractional ownership** — dividing expensive assets into affordable shares
- **Liquidity** — enabling trading of traditionally illiquid assets
- **Transparency** — on-chain ownership records visible to all participants
- **Automation** — smart contracts can automate dividend distribution, compliance, and transfers

However, tokenization faces significant challenges:

- **Legal enforceability** — a token representing a building has no legal meaning unless the jurisdiction recognizes it
- **Regulatory compliance** — most tokenized assets are securities under existing law, requiring registration and compliance
- **Off-chain dependency** — the token's value depends on the real-world asset being maintained, insured, and legally protected through traditional means
- **Oracle dependency** — price feeds, appraisals, and status updates require trusted oracles

The skeptic's question for any tokenization proposal: what does the token add that a traditional database entry with proper legal documentation cannot provide? If the answer requires trusting the same intermediaries either way, the blockchain layer may add cost without adding value.

## Wallets: Managing Digital Assets

A **wallet** is software (or hardware) that manages the cryptographic keys needed to interact with blockchain networks. Despite the name, a wallet does not "contain" cryptocurrency — it contains the private keys that authorize transactions. The actual token balances exist on the blockchain.

Wallets exist on a spectrum between convenience and security:

### Hot Wallets

A **hot wallet** is connected to the internet and ready for immediate transactions. Examples include browser extensions (MetaMask), mobile apps (Trust Wallet), and exchange-hosted wallets.

**Advantages:**

- Instant access for transactions
- Easy to use for daily interactions
- Supports dApp connectivity

**Risks:**

- Vulnerable to malware, phishing, and remote exploits
- Exchange-hosted wallets mean a third party controls your keys ("not your keys, not your coins")
- Browser extension wallets can be compromised by malicious websites

### Cold Storage

**Cold storage** refers to keeping private keys on devices or media that are never connected to the internet. Hardware wallets (Ledger, Trezor), paper wallets, and air-gapped computers are common forms.

**Advantages:**

- Immune to remote attacks and malware
- Suitable for long-term storage of significant holdings
- Physical control over keys

**Risks:**

- Physical loss or damage means permanent loss of funds
- Less convenient for frequent transactions
- Supply chain attacks on hardware wallets (tampered devices)
- Social engineering attacks targeting wallet recovery phrases

!!! mascot-tip "Skeptic's Toolkit"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Rex has a tip">
    When evaluating a blockchain project's wallet architecture, ask: who controls the
    private keys? If users control their own keys, they bear full responsibility for
    security — and key management is hard for average users. If a custodian controls
    the keys, you've reintroduced a trusted intermediary, which undermines the
    decentralization argument. There is no free lunch in key management: either
    the user bears the risk or a trusted party does.

## Decentralized Applications (dApps)

A **Decentralized Application (dApp)** is an application that uses smart contracts as its backend logic instead of (or in addition to) traditional servers. The term suggests full decentralization, but the reality is more nuanced.

A typical dApp architecture includes:

| Layer | Component | Actually Decentralized? |
|-------|-----------|------------------------|
| **Frontend** | Website/mobile app | No — hosted on traditional servers or CDNs |
| **API layer** | Backend services, indexing | No — centralized services (e.g., Infura, Alchemy) |
| **Smart contract** | On-chain logic | Yes — executed by blockchain nodes |
| **Storage** | Media, large data | Partially — IPFS is distributed but not guaranteed |
| **Data feeds** | Oracles, price feeds | Partially — decentralized oracle networks |

The uncomfortable truth: most "decentralized" applications have significant centralized dependencies. If the frontend goes down, users can still interact with the smart contract directly, but most lack the technical ability to do so. If the API provider (like Infura) experiences an outage, dApps built on that provider become inaccessible — as happened during notable Infura outages affecting the Ethereum ecosystem.

Major dApp categories include:

- **Decentralized Finance (DeFi)** — lending, borrowing, trading without traditional intermediaries
- **Decentralized Exchanges (DEXs)** — token trading via automated market makers
- **DAOs** — organizations governed by smart contract voting
- **Gaming and metaverse** — blockchain-based virtual worlds and economies

## Cross-Chain Bridges

A **cross-chain bridge** is a protocol that enables the transfer of assets or data between different blockchain networks. Because blockchains are isolated by design — Bitcoin cannot natively communicate with Ethereum — bridges fill the interoperability gap.

Bridges typically work through one of these mechanisms:

- **Lock and mint** — lock assets on the source chain, mint equivalent tokens on the destination chain
- **Burn and mint** — burn assets on the source chain, mint on the destination
- **Atomic swaps** — cryptographic protocols enabling simultaneous exchange across chains
- **Relay chains** — intermediary blockchains that validate cross-chain messages

Cross-chain bridges have proven to be among the most vulnerable components in the blockchain ecosystem. Bridge exploits include:

| Bridge | Year | Amount Lost | Vulnerability |
|--------|------|-------------|---------------|
| Ronin (Axie Infinity) | 2022 | $625M | Compromised validator keys |
| Wormhole | 2022 | $326M | Smart contract vulnerability |
| Nomad | 2022 | $190M | Verification bypass |
| Harmony Horizon | 2022 | $100M | Compromised multisig keys |

The pattern is clear: bridges concentrate risk at the interface between chains. They must hold or control large pools of locked assets, making them high-value targets. Their security often depends on a small set of validators or multisig holders — precisely the centralized trust model that blockchain was designed to avoid.

!!! mascot-thinking "Key Insight"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Rex is thinking">
    Cross-chain bridges reveal a fundamental design tension. Blockchains achieve security
    through isolation — each chain validates its own state independently. Bridges break
    that isolation, creating trust dependencies between chains. The result is that bridge
    security is typically weaker than either chain's native security. Vitalik Buterin
    himself has warned about the "fundamental limits of bridge security." When evaluating
    multi-chain architectures, treat bridges as the weakest link in the security chain.

#### Diagram: Smart Contract Risk Taxonomy

<details markdown="1">
<summary>Interactive Smart Contract Vulnerability Explorer</summary>
Type: MicroSim
**sim-id:** smart-contract-risk-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective:** Analyze (L4) — Categorize smart contract vulnerabilities by type, severity, and historical financial impact, and evaluate mitigation strategies for each risk category.

**Description:** A visual taxonomy of smart contract risks displayed as an interactive tree diagram. The root node branches into categories: Coding Errors, Economic Exploits, Oracle Failures, Access Control, and Upgrade Risks. Each category expands to show specific vulnerabilities with real-world examples. Clicking a node shows a detail panel with: description, historical examples with dollar amounts lost, mitigation strategies, and a severity rating. A timeline view at the bottom shows major smart contract exploits chronologically with cumulative losses.

**Canvas:** Responsive width, 550px height. Background: aliceblue.

**Controls:**

- Click to expand/collapse tree branches
- Hover for quick tooltip descriptions
- Toggle: Tree view vs. timeline view
- Dropdown: Filter by risk category
- Button: Show cumulative losses chart

**Visual elements:**

- Interactive tree diagram with color-coded categories
- Detail panel with example and mitigation info
- Cumulative loss timeline chart
- Severity rating indicators (color-coded)
- Dollar amount annotations on exploit nodes

Implementation: p5.js with tree layout, click/hover interactions, timeline chart rendering
</details>

#### Diagram: Token Types Comparison

<details markdown="1">
<summary>Fungible vs. Non-Fungible Token Comparison</summary>
Type: MicroSim
**sim-id:** token-types-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective:** Understand (L2) — Distinguish between fungible and non-fungible tokens, explaining the properties, standards, and use cases for each type.

**Description:** A side-by-side visual comparison of fungible tokens (ERC-20) and non-fungible tokens (ERC-721). The left panel shows fungible tokens as identical, interchangeable coins that can be divided and combined. The right panel shows NFTs as unique cards with distinct properties. Students can click to "transfer" tokens between wallets, observing how fungible tokens split and merge while NFTs transfer as whole units. A properties panel below each type lists the key characteristics: divisibility, interchangeability, uniqueness, and common standards. A "Real World Analogy" section maps each type to familiar concepts (dollars vs. baseball cards).

**Canvas:** Responsive width, 500px height. Background: aliceblue.

**Controls:**

- Click to transfer tokens between wallet visualizations
- Toggle: Show/hide token metadata
- Dropdown: Select token example (USDC, CryptoKitty, etc.)
- Button: Reset wallets

**Visual elements:**

- Fungible token visualization (identical coins/bars)
- NFT visualization (unique cards with metadata)
- Wallet containers showing balances
- Transfer animations
- Properties comparison table
- Real-world analogy illustrations

Implementation: p5.js with drag-and-drop token interactions, wallet state management, animated transfers
</details>

## Key Takeaways

- **Smart contracts** are deterministic programs on a blockchain — they are not smart, not legal contracts, and once deployed, their code cannot be changed
- **Smart contract risks** are severe and empirically documented: over $10 billion lost to exploits between 2016 and 2025, with reentrancy, access control, and logic errors as recurring vulnerability patterns
- **The oracle problem** reintroduces trusted intermediaries into systems designed to eliminate them — any smart contract relying on real-world data is only as trustworthy as its data source
- **Fungible tokens** (ERC-20) are interchangeable digital assets used for currencies, governance, and utility; their ease of creation enables both innovation and fraud
- **Non-fungible tokens** (ERC-721) are unique digital records, not the assets themselves — owning an NFT is not equivalent to owning intellectual property or legal rights
- **Tokenization** promises fractional ownership and liquidity for real-world assets, but depends on legal frameworks and off-chain systems that blockchain does not control
- **Wallets** manage keys, not coins — the tradeoff between hot wallets (convenient, vulnerable) and cold storage (secure, inconvenient) has no costless solution
- **Decentralized applications** typically have significant centralized dependencies in their frontend, API, and storage layers
- **Cross-chain bridges** are the weakest link in multi-chain architectures, with billions lost to bridge exploits that concentrate risk at chain boundaries

!!! mascot-celebration "Excellent Analytical Work!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Rex celebrates">
    You've now mapped the programmable layer of blockchain — smart contracts, tokens,
    wallets, and dApps. The capabilities are real, but so are the risks. "Code is law"
    sounds clean until you realize that law without courts, appeals, or corrections is
    a harsh system. Next, we'll survey the landscape of blockchain platforms and
    types — public, private, and consortium — and examine the tradeoffs each makes.
    Outstanding critical thinking, fellow analyst!
