---
title: Governance and Scalability
description: Scalability trilemma, on-chain vs off-chain processing, Layer 1 and Layer 2 solutions, state channels, sidechains, performance attributes, blockchain limitations, and when not to use blockchain.
generated_by: claude skill chapter-content-generator
date: 2026-03-22
version: 0.05
---
# Governance and Scalability

## Summary

This chapter addresses two critical challenges for blockchain adoption: how blockchain networks are governed and how they scale. Students will examine the scalability trilemma, understand why on-chain and off-chain approaches make different tradeoffs, and evaluate Layer 1 and Layer 2 solutions including state channels and sidechains. The interplay between governance decisions and scalability constraints is a recurring theme.

## Concepts Covered

This chapter covers the following 10 concepts from the learning graph:

1. Scalability
2. Scalability Trilemma
3. On-Chain vs Off-Chain
4. Layer 1
5. Layer 2 Solutions
6. State Channel
7. Sidechain
8. Performance Attribute
9. Blockchain Limitations
10. When Not to Use Blockchain

## Prerequisites

This chapter builds on concepts from:

- [Chapter 6: Nodes, Throughput, and Network Performance](../06-nodes-throughput-performance/index.md)
- [Chapter 9: Smart Contracts and Tokens](../09-smart-contracts-tokens/index.md)
- [Chapter 10: Blockchain Types and Platforms](../10-blockchain-types-platforms/index.md)

---

!!! mascot-welcome "Rex Says: Trust, but Verify!"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Rex welcomes you">
    Welcome back, fellow analysts! We've explored what blockchains are, how they
    work, and the platforms available. Now comes the hard part: can they actually
    scale? And who decides what happens when they can't? Scalability and governance
    are where blockchain's grand promises meet engineering reality. Spoiler: there
    are no free lunches. Trust, but verify — especially the throughput claims!

## Learning Objectives

After completing this chapter, you will be able to:

- Explain the scalability trilemma and why it constrains all blockchain designs
- Compare on-chain and off-chain processing approaches and their tradeoffs
- Describe Layer 1 scaling strategies and their limitations
- Evaluate Layer 2 solutions including state channels, sidechains, and rollups
- Assess blockchain performance attributes using quantifiable metrics
- Identify blockchain's fundamental limitations and determine when not to use blockchain

## Scalability: The Central Challenge

**Scalability** is the ability of a system to handle increasing workload without proportional degradation in performance. For blockchain networks, scalability is measured primarily by:

- **Throughput** — transactions processed per second (TPS)
- **Latency** — time from transaction submission to finality
- **Cost** — fee per transaction under load
- **State growth** — rate at which the blockchain's stored data increases

To contextualize blockchain's scalability challenge, consider the demands of global-scale systems:

| System | Throughput | Finality | Cost per Transaction |
|--------|-----------|----------|---------------------|
| Visa network | ~65,000 TPS (peak) | Seconds (settlement in days) | ~$0.05-$0.10 |
| PayPal | ~1,000 TPS | Seconds | ~$0.30 |
| Bitcoin | ~7 TPS | ~60 minutes (6 confirmations) | $1-$60 (variable) |
| Ethereum (L1) | ~15-30 TPS | ~12 minutes (64 blocks) | $0.50-$200 (variable) |
| Solana | ~4,000 TPS (theoretical) | ~0.4 seconds | ~$0.001 |
| Hyperledger Fabric | ~1,000-3,000 TPS | Seconds | Minimal (private network) |

The gap between blockchain throughput and traditional payment networks is not a matter of engineering immaturity — it reflects fundamental architectural tradeoffs. Understanding why this gap exists requires understanding the scalability trilemma.

## The Scalability Trilemma

The **scalability trilemma**, articulated by Vitalik Buterin, states that a blockchain system can optimize for at most two of three properties simultaneously:

- **Decentralization** — the degree to which the network avoids concentration of control
- **Security** — resistance to attacks (double-spending, censorship, network takeover)
- **Scalability** — the ability to process a high volume of transactions

The trilemma is not a proven theorem but an observed engineering constraint. No blockchain has convincingly achieved all three at production scale. The tradeoffs manifest as follows:

**Decentralization + Security (sacrifice Scalability):**
Bitcoin and Ethereum (base layer). Every node validates every transaction. The network is highly decentralized and secure, but throughput is limited because the bottleneck is the slowest honest node.

**Scalability + Security (sacrifice Decentralization):**
Solana, DPoS chains, and permissioned networks. High throughput achieved by reducing the validator set — fewer nodes means faster consensus. But fewer validators means greater concentration of power.

**Scalability + Decentralization (sacrifice Security):**
Some experimental sharding approaches. Dividing the network into subgroups (shards) that process transactions in parallel. Each shard has fewer validators, potentially weakening security guarantees for individual shards.

The trilemma can be expressed as an impossibility condition. Let $D$, $S$, and $T$ represent decentralization, security, and throughput respectively. The constraint is:

$$D \times S \times T \leq C$$

where $C$ is a constant determined by network physics (bandwidth, latency, computation). Increasing any one dimension requires decreasing at least one other.

!!! mascot-thinking "Key Insight"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Rex is thinking">
    When a blockchain project claims to have "solved" the scalability trilemma, the
    skeptic's first question should be: which dimension did they quietly sacrifice?
    High throughput claims almost always come with reduced decentralization (fewer
    validators, higher hardware requirements) or weakened security assumptions (shorter
    finality, smaller validator sets per shard). The trilemma is not a problem to be
    solved — it is a constraint to be managed. Every design decision is a tradeoff.

## On-Chain vs. Off-Chain

**On-chain processing** means that every computation and data storage occurs directly on the blockchain, validated by all nodes. **Off-chain processing** moves some computation or data storage outside the blockchain, using the chain only for final settlement or dispute resolution.

This distinction is fundamental to every scaling strategy:

| Aspect | On-Chain | Off-Chain |
|--------|----------|-----------|
| **Validation** | All nodes validate | Subset of parties validate |
| **Data availability** | Guaranteed (on every node) | Depends on off-chain infrastructure |
| **Cost** | Full gas/transaction fees | Reduced (only settlement fees) |
| **Throughput** | Constrained by block size/time | Can be much higher |
| **Security** | Full blockchain security | Inherited partially; may have weaker guarantees |
| **Finality** | Determined by consensus | Delayed until settlement on-chain |

The trend across the blockchain ecosystem is clear: move computation off-chain and use the blockchain as a settlement and verification layer. This is an implicit acknowledgment that blockchains are too slow and expensive for general-purpose computation. The blockchain becomes the court of last resort — not where business happens, but where disputes are settled.

## Layer 1: Base Layer Scaling

**Layer 1** refers to the base blockchain protocol itself. Layer 1 scaling strategies attempt to increase throughput by modifying the fundamental protocol parameters or architecture.

Common Layer 1 approaches include:

**Increasing block size** — larger blocks contain more transactions. Bitcoin Cash (BCH) forked from Bitcoin in 2017 specifically to increase the block size from 1 MB to 8 MB (later 32 MB). The tradeoff: larger blocks require more bandwidth and storage, increasing the hardware requirements to run a full node, which reduces decentralization. This is the trilemma in action.

**Reducing block time** — shorter intervals between blocks increase throughput. Ethereum's ~12-second block time versus Bitcoin's ~10-minute block time represents this approach. The tradeoff: shorter block times increase the rate of orphaned blocks (blocks produced simultaneously by different miners) and require faster network propagation.

**Sharding** — partitioning the network into subgroups (shards) that process transactions in parallel. Ethereum's roadmap includes danksharding as a key scaling component. Each shard processes a subset of transactions, and the results are aggregated on the main chain (beacon chain). The tradeoff: individual shards have fewer validators, potentially weakening security guarantees. Cross-shard communication adds complexity and latency.

**Alternative consensus mechanisms** — replacing PoW with faster consensus algorithms (PoS, DPoS, BFT variants). Ethereum's move from PoW to PoS was partly motivated by scalability. DPoS chains like EOS achieve higher throughput by limiting validators to 21 elected block producers — a direct sacrifice of decentralization.

The fundamental limitation of Layer 1 scaling: every improvement to the base layer must be adopted by the entire network through a governance process (soft fork, hard fork, or upgrade). This makes Layer 1 changes slow, politically contentious, and risky. The Bitcoin block size debate, which lasted years and resulted in a permanent chain split (Bitcoin Cash), illustrates the governance cost of Layer 1 changes.

## Layer 2 Solutions

**Layer 2 solutions** are protocols built on top of an existing blockchain (Layer 1) that handle transactions off the main chain while inheriting the security guarantees of the base layer. Layer 2 is the dominant scaling strategy for both Bitcoin and Ethereum.

The core idea: process many transactions off-chain, then post a compressed summary or proof to the base layer. This amortizes the cost of on-chain validation across many off-chain transactions.

Major Layer 2 categories:

| Solution | Mechanism | Throughput | Finality | Trust Assumption |
|----------|-----------|-----------|----------|-----------------|
| **State Channels** | Direct off-chain exchanges between parties | Very high | Instant (off-chain) | Parties must be online; disputes go to L1 |
| **Sidechains** | Separate blockchain with bridge to main chain | High | Own consensus | Sidechain validators (weaker than L1) |
| **Optimistic Rollups** | Batch transactions, assume valid, challenge period | 100-2,000 TPS | 7-day challenge window | Fraud proofs (at least one honest watcher) |
| **ZK Rollups** | Batch transactions with cryptographic validity proofs | 100-10,000 TPS | Minutes (proof generation) | Math (validity proofs are self-verifying) |

## State Channels

A **state channel** is a two-party (or multi-party) off-chain communication channel that allows participants to transact directly with each other, settling only the final result on the blockchain. Bitcoin's Lightning Network is the most prominent state channel implementation.

How a state channel works:

1. **Open** — participants lock funds in a smart contract on the main chain
2. **Transact** — participants exchange signed transactions off-chain (instant, free)
3. **Close** — the final state is submitted to the main chain, and funds are distributed

The key properties of state channels:

- **Instant finality** for off-chain transactions (both parties sign)
- **Near-zero fees** during channel operation
- **Privacy** — intermediate transactions are not visible on the main chain
- **Blockchain security** — either party can submit the latest state to the main chain if the other party cheats or goes offline

Limitations of state channels:

- **Both parties must be online** (or delegate to a watchtower service)
- **Capital lockup** — funds are locked in the channel for its duration
- **Routing complexity** — multi-hop payments (paying someone you don't have a channel with) require finding a path through the network
- **Not general-purpose** — state channels work well for payments but are complex for arbitrary smart contract interactions

The Lightning Network processes Bitcoin payments at speeds and costs comparable to traditional payment networks, but adoption has been limited. As of 2025, the Lightning Network's total capacity is approximately $500 million — significant for a scaling solution but small compared to Bitcoin's total market capitalization.

!!! mascot-thinking "Key Insight"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Rex is thinking">
    Layer 2 solutions reveal an important truth about blockchain architecture: the
    base layer is not where most activity should happen. This is analogous to how the
    internet works — TCP/IP is the base protocol, but most users interact with HTTP,
    email, and application-layer protocols built on top. The blockchain base layer
    provides security and settlement; Layer 2 provides usability and throughput.
    Evaluating a blockchain's scalability solely by its Layer 1 throughput is like
    evaluating the internet by measuring raw TCP packet rates.

## Sidechains

A **sidechain** is a separate blockchain that runs in parallel to a main chain (parent chain) and is connected through a two-way bridge (or "peg"). Assets can be transferred between the main chain and sidechain, but the sidechain operates its own consensus mechanism independently.

Key characteristics of sidechains:

- **Independent consensus** — the sidechain has its own validators and consensus rules
- **Customizable** — can optimize for specific use cases (speed, privacy, programmability)
- **Two-way peg** — assets move between chains through lock-and-release mechanisms
- **Risk isolation** — bugs or attacks on the sidechain do not directly affect the main chain (though bridged assets may be at risk)

Notable sidechain implementations:

- **Liquid Network** (Bitcoin) — a federated sidechain for faster, more confidential Bitcoin transactions among exchanges and traders
- **Polygon PoS** (Ethereum) — originally positioned as a sidechain, now evolving toward a ZK-based architecture
- **Rootstock (RSK)** (Bitcoin) — a sidechain adding smart contract capability to Bitcoin

The critical risk with sidechains is that they do **not** inherit the security of the parent chain. A sidechain's security depends on its own validator set, which is typically smaller and less decentralized than the main chain. The two-way bridge is a concentrated point of failure — if bridge validators are compromised, assets locked in the bridge can be stolen.

## Performance Attributes

**Performance attributes** for blockchain systems extend beyond simple throughput numbers. A rigorous evaluation requires measuring multiple dimensions:

- **Throughput (TPS)** — transactions processed per second under normal and peak load
- **Latency** — time from transaction submission to inclusion in a block
- **Finality time** — time until a transaction is irreversible (not just included)
- **Cost per transaction** — direct fee plus the economic cost of waiting
- **State growth rate** — how fast the blockchain's data footprint grows (GB/year)
- **Node requirements** — minimum hardware to run a validating node
- **Recovery time** — how quickly the network recovers from a partition or outage

These attributes are interconnected. Improving throughput often increases state growth rate and node requirements. Reducing finality time may weaken security guarantees. The relationships can be summarized:

$$\text{Throughput} = \frac{\text{Block Size} \times \text{Transactions per Block}}{\text{Block Time}}$$

$$\text{Annual State Growth} = \text{Throughput} \times \text{Avg. Transaction Size} \times 31{,}536{,}000 \text{ seconds/year}$$

For Bitcoin at 7 TPS with an average transaction size of 500 bytes, annual state growth is approximately:

$$7 \times 500 \times 31{,}536{,}000 \approx 110 \text{ GB/year}$$

For a system targeting 10,000 TPS with similar transaction sizes, annual state growth would be approximately 157 TB/year — requiring enterprise-grade storage infrastructure just to maintain a full node. This illustrates why high-throughput blockchains inevitably push toward fewer, more powerful nodes.

!!! mascot-tip "Skeptic's Toolkit"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Rex has a tip">
    When a blockchain project advertises its TPS number, ask five follow-up questions:
    (1) Is that theoretical maximum or measured under real-world conditions?
    (2) What is the finality time — not block inclusion time, but irreversibility?
    (3) What hardware is required to run a validating node?
    (4) How many validators are there, and who controls them?
    (5) What is the annual state growth rate, and how is it managed?
    A blockchain claiming 100,000 TPS with 21 validators on high-end servers is a
    very different system than one claiming 30 TPS with 10,000 validators on
    consumer hardware. Both claims can be technically honest while describing
    fundamentally different trust models.

## Blockchain Limitations

**Blockchain limitations** are inherent constraints that cannot be eliminated through better engineering — they are consequences of the fundamental design choices that define blockchain.

**Storage limitations:** Every full node must store the entire history of all transactions. Bitcoin's blockchain is approximately 550 GB and growing. Ethereum's state data exceeds 1 TB. Scaling throughput linearly increases storage requirements.

**Computation limitations:** On-chain computation is replicated across all validating nodes. This means the network's total computational capacity is equal to the capacity of a single node — parallelism happens through sharding, not through adding more nodes to the same shard.

**Latency limitations:** Transactions must propagate across a global network and achieve consensus. Physical network latency imposes a floor on confirmation times that cannot be reduced below the speed of light across the network diameter.

**Privacy limitations:** Public blockchains provide pseudonymity, not anonymity. On-chain data is permanently visible. Even with encryption, metadata (transaction timing, amounts, addresses) can reveal information. Compliance with privacy regulations like GDPR is structurally difficult because blockchain's immutability conflicts with the "right to erasure."

**Governance limitations:** Protocol changes require coordinated action across a decentralized network. This makes blockchains slow to adapt, difficult to upgrade, and vulnerable to governance deadlocks (as seen in the Bitcoin block size debate).

**The immutability paradox:** Blockchain's defining feature — immutable records — is also its greatest limitation. Errors, fraud, legal judgments requiring data modification, and regulatory requirements for data deletion all conflict with immutability. In practice, "immutable" blockchains have been modified through hard forks (Ethereum/The DAO), demonstrating that immutability is a social agreement, not a physical law.

!!! mascot-warning "Bias Alert"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Rex warns you">
    Beware the "blockchain can solve anything" narrative. Blockchains are specialized
    tools optimized for a narrow set of problems: situations requiring trustless
    consensus among untrusted parties where the cost of that consensus is justified
    by the value of removing a trusted intermediary. Outside that narrow band,
    blockchains add cost and complexity without proportional benefit. The hammer-nail
    fallacy is endemic in the blockchain industry — if you sell blockchains, every
    problem looks like it needs decentralized consensus.

## When Not to Use Blockchain

The most valuable skill for a technology evaluator is knowing **when not to use blockchain**. The following decision criteria help identify situations where blockchain is likely the wrong choice:

**Do not use blockchain when:**

- **A trusted party already exists and is acceptable** — if participants trust a central authority (a bank, a government registry, an industry body), a traditional database is simpler, faster, and cheaper
- **All participants are within one organization** — intra-company processes do not benefit from distributed consensus; use a database
- **High throughput is required** — if the application needs more than a few hundred TPS with low latency, centralized systems outperform by orders of magnitude
- **Data must be modifiable or deletable** — regulatory requirements for data correction (GDPR, HIPAA) conflict with blockchain immutability
- **Transactions require confidentiality** — even permissioned blockchains have weaker privacy guarantees than properly secured centralized databases
- **The problem is non-digital** — blockchain tracks records, not physical goods; the "garbage in, garbage out" problem means on-chain data is only as good as the off-chain processes that feed it
- **Cost is a primary concern** — blockchain infrastructure is more expensive to operate than equivalent centralized systems for most workloads

A useful decision flowchart:

1. Do you need to store data? (If no, blockchain won't help)
2. Do multiple parties need to write to the data? (If no, use a database)
3. Do you trust a single party to maintain the data? (If yes, use a database)
4. Do all writers know and trust each other? (If yes, consider a shared database with access controls)
5. Do you need a public, verifiable record? (If no, a permissioned shared database may suffice)
6. Only if you answered "yes" to questions 1-2, "no" to questions 3-4, and "yes" to question 5, is a blockchain a strong candidate

The evidence base supports this narrow framing. A 2023 McKinsey study found that of the blockchain projects announced across industries, fewer than 10% had progressed beyond pilot stage. The most common failure modes were not technical — they were overestimation of blockchain's value-add relative to traditional alternatives.

#### Diagram: Scalability Trilemma Explorer

<details markdown="1">
<summary>Interactive Scalability Trilemma Visualizer</summary>
Type: MicroSim
**sim-id:** scalability-trilemma-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective:** Evaluate (L5) — Analyze how different blockchain platforms position themselves within the scalability trilemma and assess the tradeoffs each makes between decentralization, security, and throughput.

**Description:** A triangular visualization with Decentralization, Security, and Scalability at the three vertices. Each blockchain platform is plotted as a point within the triangle based on its position across the three dimensions. Students can drag platform points to see how changing one dimension affects the others (maintaining the constant constraint). Predefined positions for Bitcoin, Ethereum (L1), Ethereum + L2, Solana, Hyperledger Fabric, and other platforms are shown with details on hover. A "What If" panel lets students set target values for two dimensions and calculates the maximum achievable third dimension.

**Canvas:** Responsive width, 550px height. Background: aliceblue.

**Controls:**

- Drag platform points within triangle
- Hover for platform detail cards
- Dropdown: Add/remove platforms
- Slider: Adjust constraint constant (simulating technology improvements)
- Button: Reset to empirical positions

**Visual elements:**

- Equilateral triangle with labeled vertices
- Platform position dots (color-coded)
- Dimension value readouts per platform
- "What If" calculation panel
- Trade-off zone highlighting (shaded regions)

Implementation: p5.js with barycentric coordinate mapping, draggable points, dynamic constraint calculations
</details>

#### Diagram: When to Use Blockchain Decision Tree

<details markdown="1">
<summary>Blockchain Decision Flowchart</summary>
Type: MicroSim
**sim-id:** blockchain-decision-flowchart<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective:** Apply (L3) — Apply the blockchain decision framework to real-world scenarios, determining whether blockchain is an appropriate solution based on trust requirements, performance needs, and regulatory constraints.

**Description:** An interactive decision flowchart that guides students through the "should you use blockchain?" evaluation. Each decision node poses a question (e.g., "Do multiple untrusted parties need write access?") with yes/no branches. The path highlights as students make choices, leading to a recommendation: "Use a database," "Consider a permissioned blockchain," "Consider a public blockchain," or "Blockchain is a strong candidate." A scenario panel provides pre-built use cases (hospital records, supply chain tracking, cryptocurrency exchange, voting system, land registry) that auto-navigate the flowchart with explanations at each step. A summary panel shows the reasoning chain for the final recommendation.

**Canvas:** Responsive width, 600px height. Background: aliceblue.

**Controls:**

- Click yes/no at each decision node
- Dropdown: Select pre-built scenario
- Button: Reset flowchart
- Button: Show all paths simultaneously
- Hover: Explanation tooltips at each node

**Visual elements:**

- Flowchart with decision diamonds and outcome rectangles
- Highlighted active path (green for yes, red for no)
- Scenario description sidebar
- Reasoning chain summary panel
- Color-coded outcome categories

Implementation: p5.js with flowchart layout, path highlighting, scenario auto-navigation
</details>

## Key Takeaways

- **Scalability** is measured by throughput, latency, cost, and state growth — blockchain networks lag traditional systems by orders of magnitude on throughput
- **The scalability trilemma** constrains all blockchain designs: decentralization, security, and scalability cannot all be maximized simultaneously — every platform trades one for the others
- **On-chain processing** provides full security at high cost; **off-chain processing** provides throughput at the cost of weaker security guarantees — the trend is toward using blockchain as a settlement layer, not a computation layer
- **Layer 1 scaling** (larger blocks, faster times, sharding, alternative consensus) modifies the base protocol but is limited by governance costs and the trilemma
- **Layer 2 solutions** (state channels, sidechains, rollups) move activity off the base layer while inheriting varying degrees of Layer 1 security
- **State channels** enable instant, near-free transactions between parties but require both parties online and capital lockup
- **Sidechains** offer customizable parallel chains but do not inherit main chain security — bridge vulnerabilities are a critical risk
- **Performance attributes** must be evaluated holistically: TPS alone is misleading without context on finality, node requirements, validator count, and state growth
- **Blockchain limitations** include storage scaling, computation replication, latency floors, privacy conflicts, and the immutability paradox
- **When not to use blockchain:** if a trusted party is acceptable, if data must be modifiable, if high throughput is essential, or if the problem is fundamentally non-digital — a traditional database is almost always simpler, faster, and cheaper

!!! mascot-celebration "Excellent Analytical Work!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Rex celebrates">
    You've now confronted the hardest questions in blockchain engineering: can it
    scale, who decides how, and when should you walk away entirely? The scalability
    trilemma is not a puzzle to be solved — it's a constraint to be managed. And
    knowing when NOT to use blockchain may be the most valuable skill in your
    analytical toolkit. Next, we'll put numbers on everything: total cost of
    ownership, cost-benefit analysis, and the economics of build-versus-buy.
    Truly outstanding work, fellow skeptic!
