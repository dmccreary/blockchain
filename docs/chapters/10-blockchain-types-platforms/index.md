---
title: Blockchain Types and Platforms
description: Public, private, permissioned, and consortium blockchains; Bitcoin, Ethereum, and Hyperledger platforms; interoperability; and on-chain, off-chain, and consortium governance models.
generated_by: claude skill chapter-content-generator
date: 2026-03-22
version: 0.05
---
# Blockchain Types and Platforms

## Summary

This chapter surveys the landscape of blockchain implementations, from fully open permissionless networks to tightly controlled private and consortium chains. Students will compare Ethereum, Bitcoin, and enterprise platforms like Hyperledger, understanding the architectural tradeoffs each makes. The chapter also covers interoperability challenges and why the choice between blockchain types has significant implications for cost, governance, and trust.

## Concepts Covered

This chapter covers the following 13 concepts from the learning graph:

1. Permissioned Blockchain
2. Permissionless Blockchain
3. Public Blockchain
4. Private Blockchain
5. Consortium Blockchain
6. Hyperledger
7. Ethereum Overview
8. Bitcoin Overview
9. Interoperability
10. Governance
11. On-Chain Governance
12. Off-Chain Governance
13. Consortium Governance

## Prerequisites

This chapter builds on concepts from:

- [Chapter 5: Distributed Systems and Ledgers](../05-distributed-systems-ledgers/index.md)
- [Chapter 7: Consensus Mechanisms](../07-consensus-mechanisms/index.md)
- [Chapter 9: Smart Contracts and Tokens](../09-smart-contracts-tokens/index.md)

---

!!! mascot-welcome "Rex Says: Trust, but Verify!"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Rex welcomes you">
    Welcome back, fellow analysts! Not all blockchains are created equal — and that's
    actually the point. Bitcoin, Ethereum, Hyperledger, and dozens of other platforms
    each make fundamentally different design choices about who can participate, who
    validates, and who governs. Choosing the wrong blockchain type for your use case
    is like choosing a submarine when you needed a bicycle. Let's map the landscape.
    Trust, but verify — especially the vendor's platform recommendation!

## Learning Objectives

After completing this chapter, you will be able to:

- Distinguish between permissioned and permissionless blockchains and their trust models
- Compare public, private, and consortium blockchain architectures
- Describe the key characteristics of Bitcoin, Ethereum, and Hyperledger platforms
- Explain interoperability challenges between blockchain networks
- Differentiate between on-chain, off-chain, and consortium governance models
- Select the appropriate blockchain type for a given use case based on requirements analysis

## The Blockchain Spectrum

The blockchain ecosystem is not monolithic. Different implementations make fundamentally different tradeoffs along two key axes: **access control** (who can participate) and **validation authority** (who can write blocks). These choices determine the trust model, performance characteristics, and governance structure of the entire system.

Understanding these axes is the foundation for platform selection:

| Dimension | Open | Restricted |
|-----------|------|------------|
| **Who can read?** | Public | Private |
| **Who can write/validate?** | Permissionless | Permissioned |

These dimensions are independent. A blockchain can be public but permissioned (anyone can read, but only approved validators can write) or private and permissionless (only members can access, but any member can validate). In practice, four common combinations dominate the landscape.

## Permissionless Blockchains

A **permissionless blockchain** allows anyone to participate in the network — reading data, submitting transactions, and validating blocks — without obtaining approval from any authority. There are no gatekeepers, no registration requirements, and no identity verification.

Key properties of permissionless systems:

- **Open participation** — anyone with internet access and appropriate software can join
- **Pseudonymous** — participants are identified by cryptographic addresses, not real-world identities
- **Censorship resistant** — no single entity can prevent a valid transaction from being included
- **Sybil resistance through economics** — PoW (computational cost) or PoS (staked capital) prevents fake identity attacks

The tradeoff for this openness is performance. Permissionless blockchains must assume adversarial participants, which requires expensive consensus mechanisms and limits throughput. Bitcoin processes approximately 7 transactions per second; even Ethereum manages only 15-30 TPS on its base layer. These are not temporary engineering limitations — they are architectural consequences of the trust model.

## Permissioned Blockchains

A **permissioned blockchain** restricts who can validate blocks, submit transactions, or both. Participants must be approved by an authority or consortium before joining the network. Identity is known, and participants can be held accountable through legal and contractual means.

Key properties of permissioned systems:

- **Known validators** — participants are identified and vetted
- **Higher throughput** — because adversarial assumptions are relaxed, consensus is faster
- **Configurable privacy** — transaction data can be restricted to relevant parties
- **Accountability** — misbehavior can be addressed through legal channels, not just protocol penalties

The skeptic's question: if participants are known and accountable, what does the blockchain add over a shared database with access controls? The honest answer is: sometimes very little. Permissioned blockchains provide value when multiple organizations need a shared record but do not fully trust each other's database administration — a genuine but narrow use case.

!!! mascot-thinking "Key Insight"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Rex is thinking">
    The distinction between permissioned and permissionless blockchains is more than
    technical — it's philosophical. Permissionless systems embody the cypherpunk ideal:
    trustless, censorship-resistant, open to all. Permissioned systems embody enterprise
    pragmatism: identified participants, legal accountability, regulatory compliance.
    Most enterprise blockchain projects that started with permissionless ambitions
    eventually migrated to permissioned architectures when they encountered regulatory
    reality. When evaluating a blockchain proposal, ask whether the trust model matches
    the actual operating environment — not the aspirational one.

## Public Blockchains

A **public blockchain** makes all transaction data visible to anyone. Every transaction, balance (at the address level), and smart contract interaction is recorded on a ledger that anyone can inspect. Bitcoin and Ethereum are the most prominent public blockchains.

Public visibility enables:

- **Auditability** — anyone can verify the chain's integrity
- **Transparency** — all transactions are observable (though participants are pseudonymous)
- **Research and analysis** — blockchain analytics firms can trace fund flows

Public visibility also creates challenges:

- **Privacy concerns** — once an address is linked to an identity, all transactions are exposed
- **Competitive intelligence** — businesses' transaction patterns are visible to competitors
- **Regulatory complications** — immutable public records may conflict with data protection laws like GDPR's "right to be forgotten"

## Private Blockchains

A **private blockchain** restricts data visibility to authorized participants. Transaction details, balances, and contract states are accessible only to members of the network. A single organization or tightly controlled group typically operates the network.

When critics argue that "a private blockchain is just a database," they have a point worth examining:

| Feature | Private Blockchain | Traditional Shared Database |
|---------|-------------------|---------------------------|
| Multi-party writes | Yes, with consensus | Yes, with access control |
| Immutable audit trail | Yes (cryptographic) | Yes (append-only logs) |
| Known participants | Yes | Yes |
| Trusted administrator | Often yes | Yes |
| Throughput | Hundreds to thousands TPS | Tens of thousands TPS |
| Operational complexity | High | Moderate |
| Cost | High | Lower |

The private blockchain's advantage narrows to scenarios where: (1) multiple organizations share the database, (2) no single organization is trusted as the administrator, and (3) the cryptographic audit trail provides regulatory or legal value beyond what traditional database logs offer.

## Consortium Blockchains

A **consortium blockchain** is operated by a group of organizations that collectively manage the network. No single member controls the infrastructure, and governance decisions require agreement among consortium participants. This model occupies the middle ground between fully public and fully private blockchains.

Consortium blockchains are the most common enterprise deployment model. Notable examples include:

- **R3 Corda** — financial services consortium for trade finance and banking
- **Hyperledger Fabric** — modular framework used across industries
- **TradeLens** (IBM/Maersk) — supply chain tracking (discontinued 2022)
- **We.trade** — trade finance platform (discontinued 2022)
- **Marco Polo** — trade finance network (filed for insolvency 2023)

The discontinuation of several high-profile consortium blockchains deserves attention. TradeLens, We.trade, and Marco Polo were each backed by major corporations, had significant investment, and addressed real business problems. Their failures were not technical — they were governance, adoption, and business model failures. Getting competitors to cooperate on shared infrastructure is an organizational challenge that technology alone cannot solve.

!!! mascot-warning "Bias Alert"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Rex warns you">
    When a vendor presents a consortium blockchain as "decentralized," ask: decentralized
    among how many organizations? If five banks run a blockchain together, it's
    distributed among five known parties with legal agreements — not decentralized in
    the way Bitcoin is decentralized. This is a legitimate architecture, but calling
    it "decentralized" borrows credibility from the permissionless blockchain narrative
    while operating under a completely different trust model. Precision in language
    matters when millions of dollars are at stake.

## Bitcoin Overview

**Bitcoin** is the first and most widely recognized blockchain, launched in 2009 by the pseudonymous Satoshi Nakamoto. It remains the reference implementation against which all other blockchains are compared.

Key architectural characteristics:

- **Consensus:** Proof of Work (SHA-256 mining)
- **Block time:** ~10 minutes
- **Throughput:** ~7 TPS (base layer)
- **Smart contracts:** Limited scripting (Bitcoin Script — not Turing-complete)
- **Supply:** Capped at 21 million BTC
- **Governance:** Off-chain (informal developer consensus, BIPs)

Bitcoin's design philosophy prioritizes security and decentralization above all else. It deliberately sacrifices throughput, programmability, and upgrade agility to maintain the simplest possible trust model. Bitcoin's scripting language is intentionally limited to reduce the attack surface — a design choice that Ethereum explicitly rejected.

The Bitcoin network's track record is remarkable: it has operated continuously since January 3, 2009, with no successful double-spend on the main chain and no extended downtime. This operational resilience, achieved without any central operator, is Bitcoin's strongest empirical argument.

## Ethereum Overview

**Ethereum**, launched in 2015 by Vitalik Buterin and others, extended Bitcoin's concept from a payment network to a programmable platform. Its key innovation was the Ethereum Virtual Machine (EVM) — a Turing-complete execution environment that runs smart contracts.

Key architectural characteristics:

- **Consensus:** Proof of Stake (since September 2022, previously PoW)
- **Block time:** ~12 seconds
- **Throughput:** ~15-30 TPS (base layer), higher with Layer 2 solutions
- **Smart contracts:** Full Turing-complete programming (Solidity, Vyper)
- **Supply:** No hard cap (but net issuance reduced post-merge and EIP-1559)
- **Governance:** Off-chain (EIPs, core developer calls, community rough consensus)

Ethereum's programmability enabled the explosion of DeFi, NFTs, and dApps. It also introduced smart contract risks, gas fee volatility, and a dramatically larger attack surface than Bitcoin. Every smart contract deployed on Ethereum is a potential vulnerability.

The Ethereum ecosystem's approach to scalability centers on **Layer 2 solutions** — rollups (Optimistic and ZK) that process transactions off-chain and post compressed proofs to the Ethereum base layer. This strategy explicitly acknowledges that the base layer cannot scale to meet demand and instead positions Ethereum as a settlement and security layer.

## Hyperledger

**Hyperledger** is not a single blockchain but an umbrella project hosted by the Linux Foundation, comprising multiple enterprise blockchain frameworks and tools. The most prominent is **Hyperledger Fabric**.

Key characteristics of Hyperledger Fabric:

- **Consensus:** Pluggable (Raft, Kafka — not PoW or PoS)
- **Permissions:** Fully permissioned with certificate-based identity
- **Privacy:** Channel architecture isolates data between participant subgroups
- **Smart contracts:** "Chaincode" written in Go, Java, or JavaScript
- **No native cryptocurrency** — designed for enterprise use without speculative tokens
- **Governance:** Consortium-based with membership service providers

Hyperledger Fabric's architecture differs fundamentally from public blockchains:

| Feature | Bitcoin/Ethereum | Hyperledger Fabric |
|---------|-----------------|-------------------|
| Identity | Pseudonymous | Known (certificate-based) |
| Consensus | PoW/PoS (adversarial) | Raft/Kafka (crash-fault tolerant) |
| Smart contracts | Public, permissionless deployment | Private, authorized deployment |
| Data visibility | All transactions public | Channel-based privacy |
| Cryptocurrency | Required (incentive mechanism) | Optional/none |
| Throughput | 7-30 TPS | 1,000-3,000 TPS |

Hyperledger Fabric is best suited for scenarios where: organizations know each other, regulatory compliance is required, data privacy between participants is essential, and no public token economics are desired.

!!! mascot-thinking "Key Insight"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Rex is thinking">
    Comparing Bitcoin, Ethereum, and Hyperledger directly is like comparing a tank,
    a sports car, and a delivery truck. They serve fundamentally different purposes
    with fundamentally different design constraints. Bitcoin optimizes for censorship
    resistance and sound money. Ethereum optimizes for programmability and a developer
    ecosystem. Hyperledger optimizes for enterprise compliance and privacy. Evaluating
    any of them outside their intended use case will yield misleading conclusions.
    Always start with requirements, not platforms.

## Interoperability

**Interoperability** is the ability of different blockchain networks to communicate, share data, and transfer assets between each other. It remains one of the most significant unsolved challenges in the blockchain ecosystem.

The blockchain landscape today resembles the early internet before standardized protocols — isolated networks that cannot natively exchange information. Each blockchain has its own data format, consensus mechanism, finality model, and address scheme.

Approaches to interoperability include:

- **Cross-chain bridges** — lock assets on one chain, mint equivalents on another (see Chapter 9)
- **Relay chains** — intermediary blockchains that validate cross-chain messages (Polkadot, Cosmos)
- **Atomic swaps** — cryptographic protocols for trustless cross-chain exchange
- **Sidechains** — separate blockchains pegged to a main chain
- **Standardization efforts** — common interfaces and protocols (still nascent)

The interoperability challenge is not purely technical. It also involves governance (who decides the rules of cross-chain communication?), economics (who pays for cross-chain operations?), and security (the weakest chain in an interoperable network may compromise the strongest).

For enterprise architects, the interoperability question has a practical implication: choosing a blockchain platform today may lock you into an ecosystem, much as choosing an ERP vendor does. The switching costs and integration complexity are real and should be factored into platform selection.

## Governance

**Governance** in the blockchain context refers to the processes and structures by which decisions about protocol changes, upgrades, parameter adjustments, and dispute resolution are made. Despite blockchain's "decentralized" narrative, every blockchain has a governance structure — the question is whether it is formal or informal, transparent or opaque.

## On-Chain Governance

**On-chain governance** encodes decision-making rules directly into the blockchain protocol. Token holders vote on proposals, and approved changes are implemented automatically without requiring manual intervention or social coordination.

Examples include:

- **Tezos** — token holders vote on protocol amendments; approved changes are auto-deployed
- **MakerDAO** — MKR token holders vote on risk parameters and protocol changes
- **Compound** — COMP token holders propose and vote on protocol upgrades

Advantages of on-chain governance:

- Transparent — all votes are recorded on the blockchain
- Deterministic — outcomes are executed automatically
- Inclusive — any token holder can participate

Criticisms of on-chain governance:

- **Plutocratic** — voting power proportional to token holdings (wealth = influence)
- **Low participation** — typical voter turnout in DAOs is 5-15% of eligible tokens
- **Whale dominance** — a small number of large holders often control outcomes
- **Attack surface** — governance mechanisms themselves can be exploited (flash loan governance attacks)

## Off-Chain Governance

**Off-chain governance** relies on social processes, community discussion, and informal consensus outside the blockchain protocol. Bitcoin and Ethereum both use off-chain governance.

Bitcoin's governance process:

1. A developer proposes a Bitcoin Improvement Proposal (BIP)
2. Community discusses the proposal on mailing lists, forums, and social media
3. Core developers evaluate technical merits and security implications
4. If rough consensus forms, the change is implemented in reference software
5. Miners and nodes choose whether to upgrade

Ethereum follows a similar process through Ethereum Improvement Proposals (EIPs) and AllCoreDev calls.

Off-chain governance is often criticized as opaque and dominated by a small group of core developers. The counterargument is that it allows for nuanced technical discussion, avoids the plutocratic dynamics of token-weighted voting, and has proven resilient over more than a decade of operation.

## Consortium Governance

**Consortium governance** applies to permissioned blockchains operated by a group of organizations. Governance decisions — who can join, what consensus rules apply, how upgrades are deployed, how disputes are resolved — are typically governed by legal agreements and organizational structures outside the blockchain.

Common consortium governance mechanisms:

- **Membership agreements** — legal contracts defining participation rules
- **Steering committees** — representative bodies from member organizations
- **Voting structures** — one-member-one-vote or weighted voting
- **Exit provisions** — how members leave and what happens to their data
- **Dispute resolution** — arbitration, mediation, or legal proceedings

The irony of consortium governance is that it looks remarkably similar to traditional inter-organizational governance — committees, votes, legal agreements, and arbitration. The blockchain infrastructure does not eliminate the need for human governance; it merely provides a shared technical platform on which that governance operates.

!!! mascot-tip "Skeptic's Toolkit"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Rex has a tip">
    When evaluating any blockchain platform, create a requirements matrix before
    looking at vendor materials. Define your needs across these dimensions: throughput
    requirements, privacy requirements, regulatory constraints, participant trust
    level, governance model, interoperability needs, and total cost tolerance. Then
    evaluate platforms against your matrix — not the other way around. Many failed
    blockchain projects started with a platform and went looking for a problem.

#### Diagram: Blockchain Type Decision Matrix

<details markdown="1">
<summary>Interactive Blockchain Platform Selector</summary>
Type: MicroSim
**sim-id:** blockchain-platform-selector<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective:** Evaluate (L5) — Select the appropriate blockchain type and platform for a given set of requirements by analyzing tradeoffs across trust, performance, privacy, and governance dimensions.

**Description:** An interactive decision-tree and comparison tool. Students answer a series of questions about their use case: Do participants trust each other? Is regulatory compliance required? What throughput is needed? Is public transparency important? Based on answers, the tool recommends a blockchain type (public permissionless, public permissioned, consortium, private) and highlights matching platforms. A comparison table dynamically shows how selected platforms score across key dimensions. A "Scenario Library" offers pre-built use cases (supply chain, DeFi, identity management, cross-border payments) that students can explore.

**Canvas:** Responsive width, 550px height. Background: aliceblue.

**Controls:**

- Radio buttons for decision-tree questions
- Dropdown: Select from scenario library
- Button: Reset and start over
- Hover: Platform detail tooltips

**Visual elements:**

- Decision tree with highlighted path
- Platform comparison radar chart
- Recommendation panel with justification
- Scenario description sidebar
- Color-coded platform categories

Implementation: p5.js with decision-tree navigation, dynamic radar chart, scenario presets
</details>

#### Diagram: Governance Model Comparison

<details markdown="1">
<summary>Governance Models Visual Comparison</summary>
Type: MicroSim
**sim-id:** governance-model-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective:** Analyze (L4) — Compare on-chain, off-chain, and consortium governance models by examining their decision-making processes, power distributions, and historical outcomes.

**Description:** A three-panel visualization showing how governance works in practice for on-chain (Tezos/MakerDAO), off-chain (Bitcoin/Ethereum), and consortium (Hyperledger) models. Each panel shows the decision-making flow from proposal to implementation. An overlay shows power distribution — who actually influences outcomes — using proportional bubble charts. A timeline at the bottom shows major governance decisions and their outcomes for each model (e.g., The DAO fork, Bitcoin block size debate, Tezos protocol upgrades). Students can click on historical events to see the governance process that produced the outcome.

**Canvas:** Responsive width, 600px height. Background: aliceblue.

**Controls:**

- Click on governance events in timeline
- Toggle between flow diagram and power distribution views
- Dropdown: Select specific governance decision to explore
- Hover: Detail tooltips on process steps

**Visual elements:**

- Three-panel governance flow diagrams
- Power distribution bubble charts
- Historical event timeline
- Decision detail pop-up panels
- Color-coded governance model categories

Implementation: p5.js with multi-panel layout, timeline navigation, bubble chart rendering
</details>

## Key Takeaways

- **Permissionless blockchains** allow anyone to participate without approval — they are censorship-resistant but performance-limited by adversarial consensus requirements
- **Permissioned blockchains** restrict participation to approved entities — they achieve higher throughput but require asking whether a blockchain adds value over a shared database
- **Public blockchains** make all data visible, enabling transparency and auditability but creating privacy and regulatory challenges (GDPR conflicts)
- **Private blockchains** restrict data visibility; their value proposition narrows to multi-organization scenarios where no single administrator is trusted
- **Consortium blockchains** are the most common enterprise model, but high-profile failures (TradeLens, We.trade, Marco Polo) demonstrate that governance and adoption challenges exceed technical ones
- **Bitcoin** prioritizes security and decentralization with minimal programmability — a tank, not a sports car
- **Ethereum** prioritizes programmability with a growing Layer 2 ecosystem — powerful but with a larger attack surface
- **Hyperledger Fabric** optimizes for enterprise compliance and privacy — no native cryptocurrency, fully permissioned, channel-based data isolation
- **Interoperability** remains an unsolved challenge; platform choice may create ecosystem lock-in comparable to ERP vendor selection
- **On-chain governance** is transparent but plutocratic; **off-chain governance** is flexible but opaque; **consortium governance** resembles traditional organizational governance with a blockchain substrate

!!! mascot-celebration "Excellent Analytical Work!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Rex celebrates">
    You've now surveyed the full landscape of blockchain types and platforms — from
    Bitcoin's fortress-like simplicity to Hyperledger's enterprise pragmatism. The key
    insight is that there is no "best" blockchain — only the best fit for specific
    requirements. Next, we'll tackle governance in depth and the scalability trilemma —
    the fundamental constraint that no blockchain can optimize for security,
    decentralization, and performance simultaneously. Excellent mapping work, analyst!
