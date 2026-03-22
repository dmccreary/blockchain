---
name: Total Energy Cost Calculations
description: When comparing system costs, always include data movement energy costs alongside CPU computation costs — never compare CPU cost alone.
type: feedback
---

When comparing energy costs across architectures (blockchain vs centralized, PoW vs PoS, etc.), always account for TOTAL energy including data movement, not just CPU computation.

**Why:** In many data centers, the energy cost of data movement between systems (network switches, routers, inter-node communication, storage I/O) is a significant portion of total system energy. Blockchain networks replicate data to every node, meaning data movement energy scales with node count. Comparing only CPU costs understates blockchain's energy overhead relative to centralized systems.

**How to apply:** In any chapter content, MicroSim, cost analysis, or glossary entry that discusses energy consumption or computational cost, ensure the comparison includes:
1. CPU/computation energy
2. Network/data movement energy (inter-node communication, block propagation, transaction broadcasting)
3. Storage I/O energy
4. Cooling overhead for all of the above

This is especially relevant in Chapters 6, 8, 11, and 12 where cost and performance comparisons are central.
