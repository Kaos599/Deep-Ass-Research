# DAR Note Schemas

Literal templates for every file DAR writes. Copy these shapes exactly — the `[[wikilinks]]`, frontmatter field names, and mandatory sections are what make the vault navigable and auditable. Linking/provenance rules live in `provenance.md`.

**Decision: one note per atomic claim, not per source.** A source yields many claims; a claim may be backed by many sources. Verification, confidence, and linking all attach to a *claim*. The source URL lives in frontmatter; the raw page is cached once in `raw/`.

---

## 1. Source / claim note — `sources/S-NNN-<claim-slug>.md`

```markdown
---
id: S-001
type: source
claim: "Perplexity reached ~$100M annualized revenue by mid-2025"
mode: gtm
agent: diver-2
status: verified          # unverified | corroborated | verified | disputed | refuted
confidence: high          # low | medium | high
source_kind: primary      # primary | secondary | tertiary
source_url: https://www.perplexity.ai/hub/blog/...
source_title: "Perplexity Q2 update"
source_author: "Perplexity AI (company blog)"
source_date: 2025-07-10
accessed: 2026-06-22
backend: tinyfish-fetch    # which capability binding fetched it
raw: "[[fetch-2026-06-22-perplexity-blog-arr]]"
serves: [SC1]              # which success criteria this claim advances; or [exploratory]
corroborated_by: ["[[S-014-the-information-arr-estimate]]"]
related: ["[[Perplexity AI]]", "[[T-answer-engine-positioning]]"]
tags: [dar/source, mode/gtm, metric/revenue]
---

# S-001 · Perplexity reached ~$100M ARR by mid-2025

## Claim
Perplexity hit ~$100M annualized revenue by mid-2025, up from ~$35M at the start of the year.

## Verbatim support
> [!quote] Primary source
> "We crossed $100M in annualized revenue this quarter…"
> — [Perplexity Q2 update](https://www.perplexity.ai/hub/blog/...), 2025-07-10

## Assessment
> [!success] Verified
> Primary (company self-report), corroborated by an independent estimate in [[S-014-the-information-arr-estimate]]. Self-reported → magnitude is directional, not audited (this caps confidence even though source_kind is primary).

## Disconfirming / caveats
> [!warning] Watch
> "Annualized" = run-rate, not booked annual revenue. No GAAP figure published.
```

**Mandatory:** the `## Verbatim support` quote (if you can't quote it, you haven't read it) and the `## Disconfirming / caveats` section (write `None found as of {accessed}` if empty). The `## Assessment` callout type tracks `status` (see `provenance.md`).

---

## 2. Synthesis / thread note — `threads/T-<slug>.md` (synthesizer-only)

```markdown
---
id: T-answer-engine-positioning
type: thread
title: "Answer-engine positioning vs. search incumbents"
mode: gtm
agent: synthesizer
status: drafted           # drafted | reviewed
confidence: medium
question: "How does Perplexity differentiate vs Google/OpenAI?"
serves: [SC2]
sources: ["[[S-001-perplexity-arr-reached-100m]]", "[[S-002-srinivas-answer-engine-thesis]]"]
related: ["[[Perplexity AI]]", "[[Aravind Srinivas]]", "[[T-founder-belief-chain]]"]
tags: [dar/thread, mode/gtm]
---

# Answer-engine positioning vs. search incumbents

> [!abstract] Thesis
> Perplexity positions as an "answer engine" (not a search engine), monetizing via subscription + emerging ads, betting incumbents can't cannibalize ad-search revenue fast enough. **Confidence: medium** — strategy stated by the founder ([[S-002-srinivas-answer-engine-thesis]]); execution metrics partly self-reported ([[S-001-perplexity-arr-reached-100m]]).

## Reasoning chain
1. Founder frames the category as "answer engine" → [[S-002-srinivas-answer-engine-thesis]]
2. Revenue trajectory supports subscription pull → [[S-001-perplexity-arr-reached-100m]]
3. ∴ positioning is coherent — see the belief chain in [[T-founder-belief-chain]]

## Counter-evidence
> [!failure] Tension
> [[S-022-google-ai-overviews-launch]] shows the incumbent moving faster than the thesis assumes.

## Open questions
- Ad-model unit economics unverified → [[_open-threads#^T-ad-economics]]
```

**Mandatory:** the `## Thesis` (the contribution), a stated **confidence**, and a `## Counter-evidence` section.

---

## 3. Entity note — `entities/<Canonical Name>.md`

Title = the canonical display name so `[[Perplexity AI]]` / `[[Aravind Srinivas]]` resolve naturally. `entity_kind` ∈ `company | person | concept`.

```markdown
---
type: entity
entity_kind: person
title: "Aravind Srinivas"
aliases: ["Aravind", "@AravSrinivas"]
mode: gtm
role: "Co-founder & CEO, Perplexity AI"
affiliation: "[[Perplexity AI]]"
tags: [dar/entity, entity/person]
---

# Aravind Srinivas

> [!info] Snapshot
> Co-founder & CEO of [[Perplexity AI]]. Ex-OpenAI/DeepMind researcher.

## Stated beliefs (sourced)
- "Answer engine > search engine" → [[S-002-srinivas-answer-engine-thesis]] (X post, primary)
- Ads are inevitable → [[S-019-srinivas-on-ads]] (podcast, primary)

## Relationships
- Leads → [[Perplexity AI]]
- Positioning rival → [[Sundar Pichai]]

## Open leads
- [[_open-threads#^T-srinivas-recent-posts]]
```

A **company** entity swaps the body to: Snapshot · What they do / how · Industry context · Key people (`[[ ]]` to person entities) · Metrics (→ source notes) · Open leads.

---

## 4. Map of Content — `_MOC.md` (synthesizer-owned, the front door)

```markdown
---
type: moc
title: "MOC · Perplexity GTM strategy"
mode: gtm
question: "Map Perplexity's GTM strategy, people, and stated beliefs"
status: in-progress
created: 2026-06-22
tags: [dar/moc, mode/gtm]
---

# Map of Content · Perplexity GTM strategy

> [!abstract] What this vault answers
> [2–4 sentence executive synthesis, written LAST.] **Overall confidence: medium.**

## Start here (key threads)
- [[T-answer-engine-positioning]] — core differentiation thesis
- [[T-founder-belief-chain]] — company → people → beliefs chain

## Success criteria status
- **SC1** Revenue & traction — ✅ met ([[S-001-perplexity-arr-reached-100m]], [[S-014-the-information-arr-estimate]])
- **SC2** Positioning — 🟡 partial ([[T-answer-engine-positioning]])
- **SC3** Ad economics — ❌ open ([[_open-threads#^T-ad-economics]])

## Entities
- Companies: [[Perplexity AI]] · People: [[Aravind Srinivas]]

## Open threads
See [[_open-threads]] — 4 open, 1 high priority.

## Provenance & confidence
Primary: 9 · Secondary: 5 · Unverified: 2 · Refuted (kept): 1
```

---

## 5. Lead backlog — `_open-threads.md` (append-only by agents; reconciled by synthesizer)

Each lead carries: the question, **why it matters** (links to the dependent thread), the next concrete action, priority, status. The `^block-id` lets other notes deep-link a lead.

```markdown
---
type: open-threads
mode: gtm
updated: 2026-06-22
tags: [dar/open-threads]
---

# Open threads

> [!todo] Legend
> Priority P1 (high) → P3 (low) · Status: open | in-progress | parked | blocked | closed
> Format: `- [ ] (Pn, status, src:N, serves:SC#) **id** — thread — why it matters — next action — [[seed]] ^id`

## P1
- [ ] (P1, open, src:1, serves:SC3) **T-ad-economics** — Perplexity ad unit economics unverified — *the whole monetization thesis in [[T-answer-engine-positioning]] rests on it* — next: fetch earnings/interview commentary — [[T-answer-engine-positioning]] ^T-ad-economics

## P2
- [ ] (P2, open, src:0, serves:SC2) **T-srinivas-recent-posts** — pull Srinivas's last 30 days on X — *refresh stated beliefs on [[Aravind Srinivas]]* — next: BROWSE x.com — ^T-srinivas-recent-posts

## Closed
- [x] (closed, serves:SC1) **T-arr-figure** — resolved → [[S-001-perplexity-arr-reached-100m]] ^T-arr-figure
```

---

## 6. Charter — `_session.md` (orchestrator-owned)

```markdown
---
type: session
mode: gtm
created: 2026-06-22
status: depth            # scoping | breadth | gated | depth | verify | synth | done | called-off
vault: "~/research/dar/2026-06-22-perplexity-gtm-strategy-a3f9c1"
---

# Charter · Perplexity GTM strategy

## Question
[the refined research question]

## Decision this feeds
[reason-backward: what decision/output the user will make from this]

## Success criteria
- **SC1** — [criterion]
- **SC2** — [criterion]
- **SC3** — [criterion]

## Scope boundaries
- In: …
- Out: …
- Watch but don't chase: …

## Need-beforehand
- Capabilities: requires BROWSE (founder social posts), READ_DOCS (n/a)
- Seed entities/sources: …
- Access/auth: …

## Capability bindings   (from preflight)
- SEARCH → tavily ; FETCH → tavily-extract ; BROWSE → tinyfish ; READ_DOCS → context7
- Degraded: [none] | [e.g. "no BROWSE → SC2 capped low"]

## Gate decision
[ranked threads chosen for depth; what was dropped and why; user's choice]

## Call-off log
[any REFOCUS/ESCALATE/CONCLUDE decisions from the drift guard, with reasoning]
```

---

## 7. Progress checklist — `_progress.md` (orchestrator-owned)

```markdown
# DAR Progress

- [x] 0 · Preflight (bindings recorded)
- [x] 1 · Decompose & Charter
- [x] 2 · Breadth
- [x] Gate (user: Proceed)
- [ ] 3 · Depth (loop)
- [ ] 4.5 · Drift guard
- [ ] 4 · Verify
- [ ] 5 · Synthesize
- [ ] 6 · Deliver
```
