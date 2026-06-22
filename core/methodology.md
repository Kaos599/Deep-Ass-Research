# DAR Methodology

The principles DAR is built on, and the phase model that operationalizes them. This is the "why"; `orchestration.md` is the "how" (the numbered steps). Read both before a run.

## The one-line idea

**Range before depth.** Map a topic broadly first; only commit to going deep once a direction is clear; then adversarially verify; then synthesize into a navigable, backlinked knowledge graph. Steer continuously against an explicit charter — *a compass, not a cage*.

## Principles → mechanics

DAR's design is downstream of how good researchers actually work (Hamming, Schulman, Karpathy, Nielsen, Olah). Every principle maps to a concrete mechanism — the methodology *is* the framework.

| Principle | Mechanism in DAR |
|---|---|
| **Reason backward from the outcome** — pick the question by the decision it serves | The **Charter** (step 1): decompose the task, then write enumerated success criteria `SC1…SCn` and the *decision this research feeds* into `_session.md`. Every finding must trace to an `SC#`. |
| **Breadth as insurance before depth** | The **Breadth** phase + the **Gate**: depth is forbidden until coverage saturates and threads are rankable. |
| **Tighten the loop / cheap disposable passes first** | Scouts do `SEARCH`-only landscape passes (cheap, disposable); only committed threads get expensive `FETCH`/`BROWSE` depth. |
| **Read the primary source, not the summary thread** | Divers must `FETCH` the **full** primary (incl. appendix & limitations) into `raw/`. A claim sourced only to a summary/aggregator is **quarantined** (`status: unverified`), never load-bearing. |
| **Don't fool yourself** | The **Verify** phase: skeptics try to *refute* each load-bearing claim; a 2-of-3 majority decides; disconfirming evidence is written *into the note*. Contradictions are downgraded, never deleted. |
| **Stare at raw outputs** | Verifiers read the cached `raw/` text, not the diver's paraphrase. The orchestrator spot-reads scout dumps at the gate. |
| **Notice when you're wandering** | The **Drift Guard** (step 4.5) scores each depth batch against the charter and forces an explicit CONTINUE / REFOCUS / ESCALATE / CONCLUDE decision. |
| **Research debt: a clear synthesis is itself the contribution** | The **Synthesizer** is a first-class role; the `_MOC.md` map + `[[wikilink]]` graph + `99-report.md` are the deliverable, not a byproduct. |

## Phase model (the spine)

```
0  Preflight        confirm capabilities, bind verbs                     (capabilities.md)
1  Decompose &      decompose by business logic → clarify with user →    ← CHARTER
   Charter          write _session.md (SC1..n, scope, need-beforehand)     (front of steering)
2  Breadth          cheap parallel SEARCH-only scouts map the landscape
── GATE ──          saturated + rankable + anchors hit + unambiguous? → ONE human check-in
3  Depth            loop-until-dry: divers FETCH full primaries, write atomic claim notes
4.5 Drift Guard     score the batch vs the charter → call-off decision   ← STEERING (back)
4  Verify           skeptics refute load-bearing claims; 2-of-3 majority; arbiter for ties
5  Synthesize       librarian (links/dedupe) → synthesizer (MOC, report, reconcile threads)
6  Deliver          present MOC + report + per-SC# status + open questions
```

(Steps are numbered as in `orchestration.md`; Drift Guard runs *between* Depth batches, hence "4.5".)

## The steering system (two halves, one spine)

The **charter's decomposition** is the spine shared by both halves of steering:
- **Front — Charter:** decompose the task by the domain's business logic, clarify scope with the user, and pin success criteria + a "need-beforehand" resource list *before* spending search budget.
- **Back — Drift Guard:** every depth batch is scored against those criteria; the call-off classifier keeps the run honest.

**Compass, not a cage.** Threads outside the `SC#` set are allowed — tagged `serves: exploratory` — and pursued when cheap. The Drift Guard *promotes* an exploratory thread that earns its keep into a real criterion, and *prunes* the rest. Serendipity is preserved but disciplined.

## The gate criteria (the one expensive commitment)

Commit breadth→depth only when **all** hold (or the breadth-budget guard trips ~35% of budget):
1. **Coverage saturation** — the latest scout wave surfaced <20% new distinct sources/subtopics vs. the prior wave.
2. **Rankable threads** — a top 3–6 list where each thread already has ≥2 candidate primary sources.
3. **Charter anchors hit** — each `SC#` has at least one lead.
4. **No fatal ambiguity** — the topic resolves to one interpretation (the right entity, the right sense of the term).

If criteria fail because the topic is too broad/ambiguous, that's a **scope** problem → loop back to a narrowing `ASK_USER`, don't spend depth budget on mush.

## Stopping (termination)

Research ends when the Drift Guard returns **CONCLUDE**, which fires when any of: (a) every `SC#` has ≥1 CONFIRMED claim; (b) loop-until-dry + budget/`MAX_DEPTH` reached with no still-tractable unmet criterion; (c) drift is unrecoverable and the user confirms stop; (d) the question is judged unanswerable with available sources. The final report always states **which criteria were met, which weren't, and why.** Calling off is a first-class, logged decision — never a silent fade.
