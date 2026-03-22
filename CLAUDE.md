# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

**Blockchain: A Skeptic's Guide to Trust Technologies** — an MkDocs Material intelligent textbook providing a comprehensive, balanced examination of blockchain and related trust technologies from a critical, evidence-based perspective. The course has 20 chapters covering trust fundamentals, cryptography, PKI, distributed ledgers, consensus mechanisms, cost analysis, architecture tradeoff methods (ATAM), cognitive biases, case studies, emerging trust technologies, and structured decision-making frameworks.

- **Site URL**: https://dmccreary.github.io/blockchain/
- **Repo**: https://github.com/dmccreary/blockchain
- **Target audience**: Business professionals, software architects, technology managers, and technical decision-makers
- **Tone**: Evidence-based, skeptical, analytical, direct. Not anti-blockchain — pro-evidence.
- **Theme colors**: Blue-gray primary (#546e7a), Deep orange accent (#ff7043)

## Content Generation Style Guide

### Writing Voice

- **Analytical and evidence-based** — every claim must be supported with data, citations, or logical reasoning
- **Skeptical but fair** — present proponents' arguments accurately before analyzing their weaknesses
- **Direct and concise** — avoid hedging language, filler, or unnecessary qualifiers
- **Use American English** spelling (color, center, analyze)
- **Accessible to business audience** — define technical jargon on first use; don't assume all readers are developers or cryptographers
- **Cost-conscious** — consistently tie architectural choices back to real-world costs and business value

### Chapter Structure

Every chapter should follow this structure:

1. **Rex welcome admonition** at the top (mascot-welcome) introducing the chapter theme
2. **Learning objectives** listed after the welcome
3. **Body sections** with concepts, evidence, analysis
4. **2-3 mascot-thinking admonitions** at key analytical insights
5. **mascot-tip and mascot-warning admonitions** as needed for study tips and common mistakes
6. **Chapter summary** with a mascot-celebration admonition at the end

### Non-Text Elements

When generating chapter content, include placeholders and suggestions for:

- **Diagrams**: Architecture comparison diagrams, trust model diagrams, network topology illustrations
- **MicroSims**: Interactive simulations (p5.js preferred) for concepts like cost modeling, consensus visualization, transaction throughput comparison, utility tree construction
- **Tables**: For comparing trust architectures, listing cognitive biases, tracking cost projections, quality attribute scenarios
- **Mermaid diagrams**: For flowcharts, decision trees, and process flows (e.g., ATAM workflow, blockchain decision flowchart)

### Admonition Usage (Non-Mascot)

Use standard MkDocs admonitions for content that doesn't need Rex:

- `!!! note` — supplementary information
- `!!! example` — worked examples or case studies
- `!!! quote` — direct quotes from researchers, press releases, or reports
- `!!! abstract` — chapter summaries or key takeaways
- `!!! info` — background context or definitions

Reserve mascot admonitions for Rex's voice (see below).

Do not place two admonitions back to back. Always put in at least one paragraph of text between admonitions.

### iframe Elements

When adding an iframe element, never use a style attribute and always add `scrolling="no"`.

---

## Learning Mascot: Rex the Raccoon

### Character Overview

- **Name**: Rex (analytical, rigorous — examines everything closely)
- **Species**: Raccoon (examines everything with his hands, sees through the dark, natural investigator)
- **Personality**: Wise, precise, thoughtful, slightly wry — a scholarly skeptic who demands evidence
- **Catchphrase**: "Trust, but verify!"
- **Visual**: Sleek gray raccoon with signature black mask markings, small round glasses, magnifying glass on a cord around his neck. Sharp, intelligent eyes with a slightly wry, knowing expression.

### Voice Characteristics

- Uses direct, analytical language with occasional wry observations
- Uses investigation metaphors ("Let's examine this more closely", "Something doesn't add up here")
- Refers to students as "fellow analysts" or "fellow investigators"
- Never credulous — always asks for evidence, even when presenting positive content about blockchain
- Matches the book's tone: pro-evidence, not anti-blockchain
- **Signature phrases**:
    - "Trust, but verify!"
    - "Let's examine the evidence!"
    - "What's the real cost?"
    - "But what does the data actually say?"
    - "Let's look more closely."
    - "Have you checked the assumptions?"

### Admonition Syntax and Placement

Each mascot admonition uses a custom CSS type and includes an inline image in the body. Always follow this exact pattern:

```markdown
!!! mascot-welcome "Rex Says: Trust, but Verify!"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Rex welcomes you">
    Welcome, fellow analysts! In this chapter we'll examine [topic].
    Trust, but verify — let's look at the evidence!
```

**Image path note**: The `src` path is relative to the HTML output, not the markdown file. For chapters at `chapters/NN-name/index.md`, use `../../img/mascot/POSE.png`. For pages at `docs/page.md`, use `img/mascot/POSE.png`. For pages in subdirectories like `learning-graph/page.md`, use `../img/mascot/POSE.png`.

### Placement Rules

| Context | Admonition Type | Image File | Frequency | Rex's Tone |
|---------|----------------|------------|-----------|------------|
| Chapter opening | `mascot-welcome` | welcome.png | Every chapter | Enthusiastic but skeptical — sets up what we'll investigate |
| Key analytical insight | `mascot-thinking` | thinking.png | 2-3 per chapter | Analytical — highlights a critical realization or cost implication |
| Study technique or analytical tool | `mascot-tip` | tip.png | As needed | Helpful — shares a technique for evaluating trust architectures |
| Common mistake or cognitive bias | `mascot-warning` | warning.png | As needed | Alert — flags where people get fooled by hype or biased reasoning |
| Section/chapter completion | `mascot-celebration` | celebration.png | End of major sections | Proud — celebrates mastery of an analytical framework |
| Difficult content | `mascot-encourage` | encouraging.png | Where students may struggle | Supportive — normalizes difficulty, encourages persistence |
| General sidebar | `mascot-neutral` | neutral.png | As needed | Calm — provides context or a general observation |

### Example Admonitions for This Course

**Chapter opening:**
```markdown
!!! mascot-welcome "Rex Says: Trust, but Verify!"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Rex welcomes you">
    Welcome, fellow analysts! In this chapter we'll examine the real
    computational and network costs of running blockchain infrastructure.
    The marketing says "decentralized and trustless." But what does the
    balance sheet say? Trust, but verify!
```

**Key insight:**
```markdown
!!! mascot-thinking "Key Insight"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Rex is thinking">
    Notice the cost asymmetry: a certificate authority can validate a
    transaction in milliseconds for fractions of a cent, while a proof-of-work
    blockchain requires thousands of nodes spending real energy to achieve
    the same result. The question isn't "can blockchain do this?" but
    "should it?"
```

**Analytical tip:**
```markdown
!!! mascot-tip "Rex's Tip"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Rex shares a tip">
    When evaluating a blockchain proposal, always ask three questions:
    Who are the participants? Do they need to distrust each other?
    What's the total cost of ownership compared to a centralized alternative?
    That filters out most hype instantly.
```

**Cognitive bias warning:**
```markdown
!!! mascot-warning "Bias Alert"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Rex warns you">
    Watch for the bandwagon effect here. "Everyone is adopting blockchain"
    is not a technical argument. Popularity tells you nothing about whether
    the architecture fits your specific business requirements.
```

**Encouragement on hard material:**
```markdown
!!! mascot-encourage "You've Got This!"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Rex encourages you">
    Utility tree construction can feel abstract at first. But once you map
    your actual business requirements to quality attributes and score the
    alternatives, the right architecture choice often becomes strikingly clear.
    Stick with the framework.
```

**Chapter completion:**
```markdown
!!! mascot-celebration "Excellent Analytical Work!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Rex celebrates">
    You can now construct a utility tree, identify sensitivity points, and
    compare trust architectures using structured evidence. That's a decision-making
    superpower. Outstanding work, fellow analyst!
```

### Do's and Don'ts

**Do:**

- Use Rex to introduce every chapter with skeptical curiosity
- Include the catchphrase ("Trust, but verify!") in welcome admonitions
- Keep Rex's dialogue brief (1-3 sentences)
- Match the pose/image to the content type
- Have Rex reference specific evidence, costs, or analytical frameworks
- Use Rex for warnings about cognitive biases — this is his strongest use case
- Ensure at least one `mascot-thinking` and one `mascot-warning` per chapter

**Don't:**

- Use Rex more than 5-6 times per chapter
- Put mascot admonitions back-to-back (at least one section of regular content between them)
- Use the mascot for purely decorative purposes — every appearance should add analytical value
- Change Rex's personality or speech patterns
- Make Rex credulous or uncritically enthusiastic about blockchain claims
- Have Rex hold objects in image prompts (images are too small to render detail; the magnifying glass is on a cord)
- Use mascot admonitions where a standard admonition (`note`, `example`, `quote`) would be more appropriate

---

## Build Process

Use `mkdocs build` to check the `mkdocs.yml` file is valid.

Use `mkdocs gh-deploy` to publish the website to GitHub pages.

Assume the user is running `mkdocs serve` in a separate shell.

## Configuration (`mkdocs.yml`)

Key settings:

- Theme: MkDocs Material, primary color blue-gray, accent deep orange
- No `navigation.tabs` — this book uses side navigation only (never add `navigation.tabs`)
- Markdown extensions: `admonition`, `pymdownx.details`, `pymdownx.superfences`, `attr_list`
- `watch: [docs, mkdocs.yml]` for live reload

## Learning Graph Data (`docs/learning-graph/`)

Supporting data files:

- `learning-graph.csv` — dependency graph with columns: ConceptID, ConceptLabel, Dependencies, TaxonomyID
- `learning-graph.json` — vis-network format with `metadata`, `groups`, `nodes`, and `edges` elements
- `concept-taxonomy.md` — 13 taxonomy categories (FOUND, CRYPT, PKI, DLT, CONS, SCALE, ECOSS, COST, ATAM, BIAS, CASE, EMRG, DECIDE)
- `taxonomy-names.json` — mapping of taxonomy IDs to human-readable names

## Content Generation Architecture

### Content Layer (`docs/`)

- `docs/index.md` — Home page with cover image, Open Graph metadata in frontmatter
- `docs/course-description.md` — The authoritative source document; all learning graph concepts derive from it
- `docs/learning-graph/` — Learning graph data and analysis pages
- `docs/img/mascot/` — 7 Rex PNG files (transparent background, ≤100 KB each)
- `docs/css/mascot.css` — All 7 mascot admonition color styles + `.mascot-admonition-img` float rule
- `docs/sims/` — Interactive MicroSim directories

### CSS Architecture

- `mascot.css` — all 7 mascot admonition variants + shared image float rules

**Mascot CSS pattern:**

- Each admonition type gets its own `border-color` + `background-color` block
- CSS variables: `--mascot-primary` (#546e7a), `--mascot-secondary` (#ff7043), `--mascot-bg`, `--mascot-size`
- `.mascot-admonition-img` uses `float: right; margin: 0 0 0.5em 1em` to place the image right of text
- `--mascot-size: 60px` controls image size in admonitions

### Mascot Images

7 PNG files at `docs/img/mascot/`:
`neutral.png`, `welcome.png`, `thinking.png`, `tip.png`, `warning.png`, `celebration.png`, `encouraging.png`

- Format: PNG with transparent background
- Target: 1024x1024 px generated, displayed at 60x60 px via CSS variable
- Generation prompts: `docs/img/mascot/README.md`

---

## Chapter Content Guidelines

### MicroSim Embedding

Interactive simulations are built as self-contained iframes (HTML + JS). MicroSim files live at `docs/sims/<sim-name>/`.

**MicroSim file naming convention:** The interactive HTML file in every MicroSim folder must be named `main.html` — never `index.html`. The MkDocs page file remains `index.md`.

#### MicroSim background color

All interactive MicroSims must use `background: aliceblue` on the `<body>` element. This provides a consistent visual cue so students can immediately recognize an embedded MicroSim as an interactive element.

### Embedding a MicroSim in a Chapter

```markdown
## Cost Comparison Simulator

<iframe src="../../sims/cost-comparison/main.html" height="730" width="100%" scrolling="no"></iframe>

*[View Cost Comparison MicroSim Fullscreen](../../sims/cost-comparison/main.html)*

The simulation above lets you explore how transaction volume and node count
affect the total cost of ownership for blockchain vs. traditional trust architectures.
```

Rules for iframe embeds in chapters:

- Never add a `style` attribute to the `<iframe>` element
- Always include `scrolling="no"`
- Add a `[View {NAME} MicroSim Fullscreen](...)` link immediately after the iframe
- Write 2-4 sentences of prose around the iframe — do not just drop the iframe with no context

### Superscript Exponents in MicroSims

**Always use Unicode superscript characters for exponents — never the `^` caret.**

Include this helper function at the top of any MicroSim JS file that displays powers of 10:

```javascript
function toSuperscript(n) {
    const sup = { '0':'⁰','1':'¹','2':'²','3':'³','4':'⁴',
                  '5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','-':'⁻' };
    return String(n).split('').map(function(c) { return sup[c] || c; }).join('');
}
```

### Updating the Site Navigation Menu

When finished creating a new MicroSim, add the new sim to `mkdocs.yml` nav under the MicroSims section.

---

## Token Efficiency: Serial Processing Only

These skills target teachers on the **Claude Pro plan**, which has a limited token budget. Teachers are **not sensitive to run times** — a task that takes 3 minutes instead of 1 minute is fine, but a task that burns excess tokens means they can do fewer tasks.

**NEVER use parallel agents unless the user explicitly requests it.** Always use a single serial agent for all generation tasks (quizzes, glossaries, FAQs, chapter content, MicroSims, etc.). Each parallel Task agent costs ~12K tokens in startup overhead, and spawning 4 agents wastes ~36K tokens that could be used for actual content generation. Do not offer parallel execution as an option — just use serial.
