---
title: Implementation and Capstone
description: Complete implementation process from evaluation to deployment, including proof of concept design, pilot programs, implementation roadmaps, and a capstone project synthesizing all course knowledge.
generated_by: claude skill chapter-content-generator
date: 2026-03-22
version: 0.05
---
# Implementation and Capstone

## Summary

This final chapter guides students through the complete process of taking a trust architecture recommendation from evaluation to implementation. Students will design proofs of concept, plan pilot programs, create implementation roadmaps, and synthesize all course knowledge into a capstone project — a complete trust architecture recommendation for a real-world scenario including technology selection, cost projections, risk mitigation, and stakeholder presentation.

## Concepts Covered

This chapter covers the following 5 concepts from the learning graph:

1. Proof of Concept
2. Pilot Program
3. Implementation Roadmap
4. Capstone Project
5. Technology Readiness Level

## Prerequisites

This chapter builds on concepts from all previous chapters. Students should complete the full course sequence before attempting the capstone project.

---

!!! mascot-welcome "Rex Says: Trust, but Verify!"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Rex welcomes you">
    Welcome to the final chapter, fellow analysts! This is where everything
    comes together. You have learned the cryptographic foundations, examined
    the architectures, mastered the evaluation frameworks, and studied the
    real-world evidence. Now it is time to apply all of that knowledge to
    build something real — a complete trust architecture implementation plan.
    Trust, but verify — and then ship it!

## Learning Objectives

After completing this chapter, you will be able to:

- Design a proof of concept that tests the specific hypotheses most critical to an architecture decision
- Plan a pilot program with measurable success criteria, defined scope, and clear go/no-go decision gates
- Create a phased implementation roadmap that manages risk through incremental deployment
- Apply Technology Readiness Level assessment to determine appropriate deployment scope and risk budgeting
- Complete a capstone project that synthesizes all course concepts into a professional trust architecture recommendation

## From Evaluation to Implementation

The architecture evaluation process (Chapters 16 and 19) produces a recommendation. The implementation process translates that recommendation into a deployed system. The gap between these two activities is where the majority of technology projects fail — not because the evaluation was wrong, but because the implementation plan was unrealistic, the organizational change was underestimated, or the technology's production behavior differed from its evaluation-stage behavior.

The implementation process follows a staged approach designed to manage risk through incremental commitment:

$$\text{Risk} = \text{Probability of failure} \times \text{Cost of failure}$$

At each stage, the organization invests more resources but also has more evidence about whether the investment will pay off. The staged approach ensures that the most expensive commitments are made only after the most uncertain assumptions have been validated.

| Stage | Investment Level | Evidence Gained | Go/No-Go Decision |
|-------|-----------------|----------------|-------------------|
| Proof of Concept | Low ($50K-200K) | Technical feasibility confirmed or denied | Can the technology do what we need? |
| Pilot Program | Medium ($200K-1M) | Operational viability at limited scale | Does it work in our environment with real data? |
| Limited Production | High ($500K-3M) | Production behavior under real conditions | Does it deliver the expected business value? |
| Full Deployment | Very High ($1M-10M+) | Full-scale operational data | Ongoing optimization and evolution |

The cost ranges above are illustrative for mid-sized enterprise deployments. Actual costs vary significantly based on industry, regulatory requirements, integration complexity, and the number of participating organizations. The key principle is not the specific dollar amounts but the progressive increase in investment as evidence accumulates.

## Designing a Proof of Concept

A **proof of concept (PoC)** is a small-scale implementation designed to validate or invalidate specific technical hypotheses before committing to a full implementation. The PoC is not a demo, not a prototype, and not a minimum viable product — it is an experiment with a clearly defined hypothesis and success criteria.

The distinction matters. A demo shows that something looks good. A prototype shows that something can be built. A PoC answers a specific question: "Can this technology achieve outcome X under conditions Y?" If the answer is no, the organization has spent a small amount to avoid a large mistake. If the answer is yes, the organization proceeds with increased confidence.

### PoC Design Principles

**Principle 1: Test the riskiest assumption first.**

Every architecture decision rests on assumptions. The PoC should test the assumption whose failure would most decisively invalidate the recommendation. For a blockchain deployment, this might be:

- "Can the platform sustain our required transaction throughput with production data volumes?"
- "Can five competing organizations agree on governance rules and data sharing policies?"
- "Can our legacy ERP system integrate with the blockchain platform within acceptable latency bounds?"

**Principle 2: Use production-representative data.**

PoCs that use synthetic data or simplified schemas routinely produce misleading results. Production data contains edge cases, inconsistencies, and volumes that synthetic data cannot replicate. Wherever legally and practically possible, use anonymized production data for the PoC.

**Principle 3: Define success and failure criteria before starting.**

Before writing a line of code, document what measurable outcomes will constitute success and what will constitute failure. This prevents the common failure mode where a PoC produces ambiguous results that are interpreted optimistically by advocates and pessimistically by skeptics.

**Principle 4: Set a time box.**

PoCs should have a fixed duration — typically 4-8 weeks for a technology evaluation PoC. Without a time box, PoCs drift into extended development projects that consume resources without producing a clear verdict.

!!! mascot-thinking "Key Insight"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Rex is thinking">
    The most valuable PoC outcome is failure. A PoC that conclusively
    demonstrates that a technology cannot meet requirements saves the
    organization from a much larger investment in a doomed project. Teams
    that view PoC failure as a negative outcome have the wrong mental model.
    The purpose of the PoC is to generate evidence, not to validate a
    decision that has already been made.

### PoC Deliverables

A completed PoC should produce the following deliverables:

- **Hypothesis statement** — the specific technical question the PoC was designed to answer
- **Test environment specification** — hardware, software, network configuration, and data characteristics
- **Test methodology** — step-by-step procedure for the tests performed, sufficient for replication
- **Results data** — raw performance metrics, error rates, integration test outcomes
- **Analysis** — interpretation of results against the pre-defined success criteria
- **Recommendation** — proceed to pilot, modify approach and re-test, or abandon the technology option
- **Lessons learned** — unexpected findings, assumptions that proved incorrect, risks not previously identified

## Planning a Pilot Program

A **pilot program** extends the PoC into a limited real-world deployment with actual users, real data, and production-like operational conditions. While the PoC tests technical feasibility in a controlled environment, the pilot tests operational viability in the messy reality of organizational workflows, user behavior, and integration with live systems.

The pilot program bridges the gap between TRL 5-6 (validated in relevant environment) and TRL 7-8 (system prototype demonstrated in operational environment). This is the "valley of death" where the majority of technology projects fail, and it requires careful planning to navigate successfully.

### Pilot Scope Definition

The pilot scope must be narrow enough to be manageable but broad enough to generate meaningful evidence. Key scoping decisions include:

- **User population** — which users or departments will participate? Start with early adopters who are motivated and technically capable.
- **Data scope** — which data sets, product lines, or transaction types will be included? Choose a representative subset, not the simplest cases.
- **Geographic scope** — which locations or regions will participate? For multi-party deployments, start with 2-3 partners, not the full consortium.
- **Duration** — how long will the pilot run? Minimum 3 months for enterprise systems to capture seasonal patterns and operational edge cases.
- **Parallel operation** — will the pilot system run alongside the existing system, or replace it? Parallel operation is strongly recommended to provide a safety net and enable direct comparison.

### Success Criteria and Decision Gates

The pilot must have pre-defined success criteria and decision gates — specific checkpoints where stakeholders review progress and decide whether to continue, modify, or terminate the pilot.

| Decision Gate | Timing | Key Questions | Possible Outcomes |
|--------------|--------|--------------|-------------------|
| Gate 1: Technical readiness | Pre-launch | Is the pilot environment stable? Are integrations functional? | Launch / Delay / Redesign |
| Gate 2: Early operational check | Week 4-6 | Are users able to complete core workflows? Are error rates acceptable? | Continue / Adjust / Escalate |
| Gate 3: Mid-pilot review | Month 2-3 | Are performance metrics on track? Are users adopting the system? | Continue / Modify scope / Terminate |
| Gate 4: Pilot conclusion | End of pilot | Did the pilot meet success criteria? What is the go/no-go recommendation? | Proceed to production / Extend pilot / Abandon |

Each gate should have documented criteria — not vague assessments like "things are going well" but quantified thresholds like "transaction error rate below 0.1%" and "90% of pilot users completing daily workflows without support escalation."

!!! mascot-tip "Rex's Tip"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Rex shares a tip">
    Build the rollback plan before you launch the pilot, not after it fails.
    Every pilot should have a documented rollback procedure that restores
    the previous system within a defined timeframe. If you cannot describe
    how to undo the pilot, you are not piloting — you are deploying.

### Pilot Anti-Patterns

The following anti-patterns are common in blockchain pilot programs and should be actively avoided:

- **The showcase pilot** — designed to produce impressive demos for executives rather than to generate honest operational data. Characterized by hand-picked data, dedicated support staff, and scripted workflows that do not represent real operations.
- **The endless pilot** — runs indefinitely without clear decision gates. Stakeholders avoid making a go/no-go decision because the pilot provides the appearance of progress without the risk of commitment.
- **The isolated pilot** — runs on a separate infrastructure with no integration to existing systems. Validates that blockchain works in isolation but provides no evidence about the integration challenges that dominate production deployment.
- **The success-only pilot** — measures only the scenarios where blockchain adds value while ignoring the scenarios where it adds complexity. Produces a biased evidence set that does not support honest decision-making.

## Creating an Implementation Roadmap

An **implementation roadmap** is a phased plan that transitions from pilot success to full production deployment. The roadmap specifies what will be deployed, when, by whom, at what cost, and with what decision gates along the way.

### Roadmap Structure

A well-structured implementation roadmap consists of phases, each with defined scope, timeline, resource requirements, deliverables, and success criteria.

**Phase 1: Foundation (Months 1-3)**

- Finalize production architecture based on pilot lessons learned
- Establish development and staging environments
- Complete vendor contracts and SLAs
- Hire or train specialized development resources
- Define security and compliance controls
- Deliverable: Production-ready infrastructure and development team

**Phase 2: Core Implementation (Months 3-9)**

- Develop production application components
- Implement integrations with existing enterprise systems
- Conduct security penetration testing and code audit
- Perform load testing at projected production volumes
- Deliverable: Tested, integrated application ready for limited production

**Phase 3: Limited Production (Months 9-12)**

- Deploy to a subset of users, locations, or transaction types
- Monitor performance, error rates, and user adoption metrics
- Address production issues identified during limited deployment
- Validate cost projections against actual operational costs
- Deliverable: Operational evidence from real production use

**Phase 4: Full Production (Months 12-18)**

- Expand deployment to remaining users, locations, and transaction types
- Decommission parallel legacy systems (after stability is confirmed)
- Establish ongoing operational monitoring and support processes
- Conduct post-implementation review and ROI assessment
- Deliverable: Fully operational system with measured business outcomes

### Roadmap Visualization

The roadmap should be visualized in two forms:

- **Gantt-style timeline** — showing phases, milestones, and dependencies for the project management audience
- **Decision gate diagram** — showing the key go/no-go decisions for the executive audience

Each phase should include explicit off-ramps: if the phase fails to meet its success criteria, what happens? An implementation roadmap without off-ramps is not a plan — it is a commitment to spend the full budget regardless of results.

!!! mascot-thinking "Key Insight"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Rex is thinking">
    The best implementation roadmaps are designed to fail cheaply. Each phase
    gates the next: if Phase 2 load testing reveals that the platform cannot
    meet throughput requirements, the organization has spent $500K to discover
    this — not $5M. The phased approach is not slower than a big-bang
    deployment; it is faster, because it avoids the costly rework that follows
    when big-bang deployments encounter reality.

### Cost Tracking and ROI Measurement

The implementation roadmap must include a cost tracking plan that compares actual costs against the TCO projections from the evaluation phase. This serves two purposes: it enables course correction if costs are trending above projections, and it builds the evidence base for future technology evaluations.

Key cost metrics to track:

- **Infrastructure cost** — cloud resources, network, storage (monthly tracking)
- **Development cost** — internal and external development resources (sprint/monthly tracking)
- **Integration cost** — effort spent connecting to existing systems (monthly tracking)
- **Operational cost** — monitoring, support, incident response (monthly tracking post-deployment)
- **Training cost** — user training, documentation, change management (phase tracking)
- **Opportunity cost** — value of resources that could have been deployed on other projects (quarterly assessment)

The ROI calculation should compare actual measured outcomes against the business case:

$$\text{ROI} = \frac{\text{Measured Benefits} - \text{Actual Total Cost}}{\text{Actual Total Cost}} \times 100\%$$

If the five-year business case projected $3 million in benefits and $2 million in costs (projected ROI of 50%), but actual costs are tracking at $2.8 million while benefits are tracking at $2.5 million, the actual ROI trajectory is negative. The implementation roadmap's decision gates should catch this trajectory early enough to adjust scope, timeline, or — if necessary — terminate the project.

## Technology Readiness Level in Implementation

**Technology Readiness Level (TRL)** assessment, introduced in Chapter 18, plays a direct role in implementation planning. The TRL of the chosen technology determines how much risk the implementation plan must absorb and how much contingency should be budgeted.

| Technology TRL at Selection | Implementation Implication | Recommended Contingency |
|----------------------------|--------------------------|----------------------|
| TRL 9 (proven in production) | Standard implementation risk | 10-15% budget contingency |
| TRL 7-8 (demonstrated in operational environment) | Moderate technical risk; may encounter scale issues | 20-30% budget contingency |
| TRL 5-6 (validated in relevant environment) | Significant technical risk; expect surprises at production scale | 40-60% budget contingency |
| TRL 3-4 (proof of concept validated) | High technical risk; should not proceed to production without extended piloting | 80-100% budget contingency (or reconsider) |

The contingency percentages above are derived from the historical relationship between technology maturity and project overrun frequency. Organizations that select TRL 5-6 technologies for mission-critical deployments and budget only standard contingency are statistically likely to experience significant cost overruns, schedule delays, or both.

!!! mascot-warning "Bias Alert"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Rex warns you">
    Most enterprise blockchain platforms are currently at TRL 6-7 for general
    enterprise use cases. Budget contingency accordingly. If a vendor claims
    TRL 9, ask for independent production deployment evidence at your scale
    and complexity level. A platform that is TRL 9 for cryptocurrency trading
    is not necessarily TRL 9 for healthcare record management.

#### Diagram: Implementation Phase Gate Dashboard

<details markdown="1">
<summary>Interactive Implementation Phase Gate Tracker</summary>
Type: MicroSim
**sim-id:** implementation-phase-gates<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective:** Apply (L3) — Design a phased implementation roadmap with decision gates, cost tracking, and TRL-appropriate contingency budgeting for a trust architecture deployment.

**Description:** An interactive dashboard showing the four implementation phases as a horizontal timeline with vertical gate markers between each phase. Each phase is represented as a colored block showing: phase name, duration, budget, key deliverables, and status indicator (not started, in progress, completed, blocked). Clicking a gate marker opens a detail panel showing the gate criteria, actual vs. projected metrics, and the go/no-go decision. A cost tracking chart below the timeline shows projected vs. actual cost curves over time. A TRL indicator in the upper right shows the current technology TRL with corresponding contingency recommendation. Users can simulate different scenarios by adjusting a "TRL at Selection" slider and observing how the recommended contingency changes.

**Canvas:** Responsive width, 600px height. Background: aliceblue.

**Controls:**

- Click phase blocks to see detail panels
- Click gate markers to see gate criteria and metrics
- TRL slider (3-9) to adjust contingency recommendations
- "Simulate Cost Overrun" toggle to show impact of under-budgeted contingency
- "Reset" button to restore default view

**Visual elements:**

- Horizontal timeline with 4 phase blocks and 4 gate markers
- Phase blocks with status colors (gray/blue/green/red)
- Gate markers with pass/fail indicators
- Cost tracking line chart (projected vs. actual)
- TRL thermometer gauge with contingency recommendation
- Detail panels with metrics and criteria

Implementation: p5.js with responsive canvas, interactive timeline, cost chart, slider control
</details>

## Capstone Project

The **capstone project** synthesizes all concepts from this course into a single comprehensive deliverable: a professional trust architecture recommendation for a real-world scenario. The capstone is not an exam — it is a portfolio piece that demonstrates your ability to apply evidence-based analysis to complex technology decisions.

### Capstone Scenario

Select one of the following scenarios (or propose your own with instructor approval):

**Scenario A: Pharmaceutical Supply Chain Integrity**

A consortium of three pharmaceutical manufacturers, two distributors, and a national regulatory authority needs to comply with the US Drug Supply Chain Security Act (DSCSA), which requires electronic, interoperable tracking of prescription drugs from manufacturer to dispenser by November 2024. The consortium must choose between a centralized track-and-trace platform operated by a third party, a consortium blockchain, and a hybrid architecture. The system must handle 50 million transaction records annually, comply with FDA regulations and GDPR (for EU operations), and achieve 99.99% availability.

**Scenario B: Cross-Border Trade Finance**

A regional bank consortium (four banks across three countries) wants to digitize letters of credit and trade document processing to reduce processing time from 5-10 days to under 24 hours. Current processing involves extensive manual document verification, multiple intermediaries, and significant fraud risk. The consortium must evaluate blockchain-based trade finance platforms against modernized centralized alternatives, considering regulatory requirements in all three jurisdictions, existing core banking system integration, and the failed TradeLens and Marco Polo precedents.

**Scenario C: Municipal Digital Identity**

A mid-sized city (population 500,000) wants to provide residents with portable digital identity credentials for accessing municipal services — library cards, transit passes, building permits, voting registration verification. The city must evaluate centralized identity management, self-sovereign identity with verifiable credentials, and blockchain-based identity against requirements including accessibility for non-technical users, privacy regulations, ADA compliance, and a limited municipal IT budget.

### Capstone Deliverables

The capstone project requires the following deliverables, each applying concepts from specific course chapters:

**Deliverable 1: Problem Analysis (Chapters 1-5)**

- Define the trust problem in the selected scenario using the frameworks from Chapters 1-5
- Identify all stakeholders and their trust relationships
- Map the data flows and identify where trust breaks down in the current system
- Specify measurable success criteria for any proposed solution

**Deliverable 2: Technology Assessment (Chapters 6-11, 18)**

- Evaluate at least three technology options (must include at least one blockchain option and one non-blockchain alternative)
- For each option: describe the architecture, consensus mechanism (if applicable), key properties, and production evidence
- Apply the Technology Readiness Level framework to assess each option's maturity
- Include at least one emerging trust technology (ZKPs, VCs, DIDs) in the assessment

**Deliverable 3: Architecture Evaluation (Chapters 12-16)**

- Apply the ATAM methodology to identify quality attribute tradeoffs
- Conduct a five-year TCO analysis for each option
- Perform risk analysis identifying top 5 risks per option with mitigation strategies
- Apply the cognitive bias checklist and document which biases were identified and mitigated
- Use the evidence-based evaluation framework to score options against weighted criteria

**Deliverable 4: Recommendation Report (Chapter 19)**

- Write a complete architecture report following the structure from Chapter 19
- Include executive summary, evaluation methodology, comparative analysis, and recommendation
- Explicitly address dissenting factors and the strongest arguments against the recommendation
- Include a sensitivity analysis: if key assumptions change, does the recommendation hold?

**Deliverable 5: Implementation Plan (Chapter 20)**

- Design a proof of concept with specific hypotheses, success criteria, and time box
- Plan a pilot program with scope, duration, decision gates, and rollback procedure
- Create an implementation roadmap with phases, milestones, cost projections, and off-ramps
- Include TRL-appropriate contingency budgeting

**Deliverable 6: Management Presentation (Chapter 19)**

- Create an 8-slide management presentation following the structure from Chapter 19
- Lead with business outcomes, not technology details
- Include quantified cost comparison and risk assessment
- Anticipate and prepare responses for three likely management objections

### Capstone Evaluation Rubric

| Criterion | Weight | Excellent (5) | Adequate (3) | Insufficient (1) |
|----------|--------|---------------|-------------|-------------------|
| Problem definition | 15% | Clear, measurable success criteria tied to business needs | General problem description with some success criteria | Vague problem statement; technology-first thinking |
| Technology assessment breadth | 15% | 3+ options with production evidence and TRL assessment | 2 options with basic comparison | Single option evaluated; no alternatives considered |
| Analytical rigor | 20% | ATAM, TCO, risk analysis, and bias checklist all applied correctly | Most frameworks applied but with gaps | Frameworks mentioned but not substantively applied |
| Evidence quality | 15% | Production data cited; vendor claims verified; counterfactuals examined | Mix of production and vendor-sourced evidence | Reliance on vendor claims without verification |
| Recommendation clarity | 15% | Specific, quantified, with dissenting factors and sensitivity analysis | Clear recommendation with basic justification | Vague recommendation without supporting evidence |
| Implementation realism | 10% | Phased plan with gates, contingency, rollback, and TRL-appropriate risk budgeting | Basic implementation timeline | Implementation plan without phases or decision gates |
| Communication quality | 10% | Professional presentation and report; pyramid principle; quantified impact | Competent writing with some structural issues | Disorganized; lacks professional presentation standards |

### Capstone Timeline

For a semester-length course, the recommended capstone timeline is:

- **Weeks 1-2:** Scenario selection, stakeholder analysis, problem definition
- **Weeks 3-4:** Technology research, evidence gathering, TRL assessment
- **Weeks 5-6:** ATAM analysis, TCO modeling, risk assessment
- **Weeks 7-8:** Comparative evaluation, bias check, recommendation formulation
- **Weeks 9-10:** Implementation roadmap, PoC design, pilot planning
- **Weeks 11-12:** Report writing, presentation preparation, peer review
- **Week 13:** Final presentation and report submission

#### Diagram: Capstone Project Workflow

<details markdown="1">
<summary>Interactive Capstone Project Progress Tracker</summary>
Type: MicroSim
**sim-id:** capstone-project-tracker<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective:** Create (L6) — Synthesize all course concepts into a comprehensive trust architecture recommendation that integrates problem analysis, technology assessment, architecture evaluation, and implementation planning.

**Description:** An interactive project tracker showing the six capstone deliverables as interconnected hexagonal nodes arranged in a workflow diagram. Each node displays the deliverable name, associated course chapters, and completion status. Clicking a node expands it to show the specific requirements, relevant frameworks to apply, and a checklist of items to complete. Arrows between nodes show dependencies (e.g., Problem Analysis feeds into Technology Assessment). A progress bar at the top shows overall completion. A sidebar shows a timeline view mapping deliverables to the 13-week capstone schedule. Color coding indicates status: gray (not started), blue (in progress), green (completed).

**Canvas:** Responsive width, 600px height. Background: aliceblue.

**Controls:**

- Click hexagonal nodes to expand deliverable details
- "Timeline View" toggle to switch between workflow and timeline views
- "Checklist" toggle to show accumulated requirements across all deliverables
- "Reset Progress" button

**Visual elements:**

- 6 hexagonal nodes with deliverable labels and chapter references
- Directional arrows showing dependencies
- Expandable detail panels with requirements checklists
- Progress bar showing overall completion percentage
- Timeline sidebar with 13-week schedule
- Color-coded status indicators (gray/blue/green)
- Connecting lines highlighting which course concepts map to which deliverables

Implementation: p5.js with responsive canvas, hexagonal node layout, click-to-expand panels, dual view modes (workflow/timeline)
</details>

## Key Takeaways

This final chapter provided the implementation methodology to translate evidence-based evaluations into deployed systems:

- **Proof of concept** design tests the riskiest assumptions first, using production-representative data, with pre-defined success/failure criteria and a fixed time box — the most valuable PoC outcome is early failure that saves the organization from a larger mistake
- **Pilot programs** bridge the gap between controlled testing and production reality, with defined scope, decision gates, rollback plans, and explicit anti-patterns to avoid (showcase pilots, endless pilots, isolated pilots, success-only pilots)
- **Implementation roadmaps** manage risk through phased deployment, where each phase gates the next, and include explicit off-ramps — a roadmap without off-ramps is not a plan but an irrevocable commitment
- **Technology Readiness Level** directly determines implementation risk and contingency budgeting — selecting a TRL 5-6 technology for mission-critical deployment without proportional contingency is statistically likely to produce overruns
- **The capstone project** synthesizes every course concept into a professional deliverable: problem analysis, technology assessment, architecture evaluation, recommendation report, implementation plan, and management presentation

!!! mascot-celebration "Excellent Analytical Work!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Rex celebrates">
    Congratulations, fellow analyst! You have completed the full journey from
    understanding trust as a fundamental problem, through the technical
    foundations of cryptography and distributed systems, to the analytical
    frameworks for evidence-based evaluation, and finally to the practical
    skills of implementation planning. You are now equipped to evaluate any
    trust technology proposal — blockchain or otherwise — with rigor,
    skepticism, and intellectual honesty. Remember: trust, but verify.
    Always verify. Outstanding work!
