# DAR Orchestration

This is the runbook. You are the **orchestrator**. Follow these steps in order, using only the capability verbs from `capabilities.md` (your adapter tells you which concrete tool each verb maps to). You spawn focused sub-agents by pasting the matching `roles/<role>.md` file as the sub-agent's prompt plus the task context.

> **Read first:** `methodology.md` (why), `capabilities.md` (the verbs + preflight), `vault-layout.md` + `note-schemas.md` + `provenance.md` (what you write). Pick a mode and load that `modes/<mode>.md` playbook.

DAR's steering has two halves sharing one spine (the charter's decomposition): a **Charter** up front and a **Drift Guard** throughout. The charter is a **compass, not a cage**.

---

## 0 · Preflight (generic)
Confirm `WRITE_FILE`, `ASK_USER`, `SPAWN_SUBAGENT` exist; detect available `SEARCH`/`FETCH`/`BROWSE`/`READ_DOCS` tools and pick the best binding for each (see `capabilities.md`). You'll record bindings in `_session.md` at step 1c. If `SPAWN_SUBAGENT` is unavailable, you will run each role **inline and sequentially** in your own context — the steps below are unchanged, only the dispatch differs.

## 1 · Decompose & Charter  (front of steering — spend NO search budget yet)
- **1a Decompose by business logic.** Classify the mode (academic / gtm / technical / market) and load its playbook. Use the playbook's **decomposition skeleton** to break the task into sub-questions.
- **1b Clarify with the user** — `ASK_USER` *deliberately* (not only when ambiguous): scope boundaries (in / out / watch-but-don't-chase), depth & recency expectations, **the decision this research feeds**, known seed sources/entities, hard constraints.
- **1c Write the charter** → `_session.md` (see the template in `note-schemas.md`): question, **enumerated success criteria `SC1…SCn`**, scope boundaries, and a **need-beforehand** list (capabilities, seed entities/sources, access).
- **1d Task-aware capability check.** Confirm the specific tools this charter needs are bound (e.g. GTM needs `BROWSE`). Record `## Capability bindings` + any `Degraded` verbs in `_session.md` now — before spending budget.
- Seed `_open-threads.md` (5–8 candidate threads, each tagged `serves: SC#`; `exploratory` allowed) and `_progress.md` (the phase checklist).

## 2 · Breadth
`SPAWN_SUBAGENT(scout)` for each candidate thread — **in parallel if supported, else sequentially**. Assign each scout an `S-NNN` hundreds block. Scouts do `SEARCH`-only passes, write `_scout/*.md` + stub source notes, and append leads. Collect their returns. Run a 2nd wave only if the gate isn't met.

## GATE  (the one expensive, irreversible commitment)
Check the criteria in `methodology.md`: coverage saturation (<20% new), rankable top 3–6 threads (each ≥2 candidate primary sources), charter anchors hit (each `SC#` has a lead), no fatal ambiguity. If the topic is too broad/ambiguous, loop back to a narrowing `ASK_USER` — don't spend depth budget on mush.

Then **one** `ASK_USER` check-in (the first of two sanctioned human touchpoints): present the ranked threads + what you're dropping and why; options **[Proceed (default)] / [Re-rank] / [Widen one wave] / [Narrow scope]**. If running unattended, proceed on the default and state the assumption. Record the decision + final thread set in `_session.md`.

## 3 · Depth  (loop-until-dry)
Maintain the work-queue from `_open-threads.md` (ready threads, ranked). Loop, with `MAX_DEPTH ≈ 4` and respecting budget:
1. Take the top batch (~5 ready threads).
2. `SPAWN_SUBAGENT(deep-diver)` per thread (parallel if supported). Divers `FETCH` full primaries into `raw/`, write atomic claim notes (`serves: SC#`), and append new sub-threads.
3. After each batch, run **step 4.5** (Drift Guard) and act on its decision.
4. A thread that returns `dry: true` is retired. The loop ends when no ready threads remain, or budget/`MAX_DEPTH` is hit, or the Drift Guard says CONCLUDE.

## 4.5 · Drift Guard  (back of steering — between depth batches)
`SPAWN_SUBAGENT(relevance-monitor)` (or judge inline on small runs) with the charter + the batch's claims + the backlog. Act on its `recommendation`:
- **CONTINUE** → keep looping.
- **REFOCUS** → prune `threadsToPrune`, promote `threadsToPromote` into new `SC#` (update `_session.md`), re-rank the backlog toward unmet `SC#`. No user.
- **ESCALATE** → `ASK_USER` with its `ask_user` question (second sanctioned human touchpoint): re-scope / narrow / redirect / stop.
- **CONCLUDE** → exit the depth loop, go to Verify.
Log every non-CONTINUE decision in `_session.md` → `## Call-off log`.

## 4 · Verify  (adversarial — don't fool yourself)
Collect all `loadBearing` or non-`high`-confidence claims. For each, `SPAWN_SUBAGENT(skeptic)` ×3 (independent) to **refute** it from the cached `raw/` source. Tally a **2-of-3 majority**: ≥2 REFUTED → `DISPUTED`; 1 REFUTED → `CONTESTED`; 0 → `CONFIRMED`. Write verdicts + dissent to `_verify-log.md` and update each note's `status`. Then `SPAWN_SUBAGENT(arbiter)` over only the CONTESTED/DISPUTED set to CONFIRM / KILL / OPEN_QUESTION.

## 5 · Synthesize  (pay down research debt)
`SPAWN_SUBAGENT(librarian)` (dedupe, resolve `[[links]]`, create entity notes, tag, flag) → then `SPAWN_SUBAGENT(synthesizer)` (write `threads/*.md`, `_MOC.md`, `99-report.md` answering each `SC#`, reconcile `_open-threads.md` into Answered / Still-open / Contradictions).

## 6 · Deliver
Present to the user: the `_MOC.md` summary, per-`SC#` status, headline open questions, and the vault path. Mark `_progress.md` complete and set `_session.md` status to `done` (or `called-off`, with the reason).

---

## Budget discipline (don't exhaust tokens in the loop)
The loops are the token sink — bound them explicitly:
- **Breadth:** ≤2 waves, ≤8 scouts each, `SEARCH`-only (no `FETCH`). Cap breadth at ~35% of budget (the gate's budget guard).
- **Depth:** `MAX_DEPTH ≈ 4` iterations, ≤5 divers per batch. Retire dry threads immediately. Stop early if the Drift Guard says CONCLUDE.
- **Verify (the biggest sink — skeptics × claims):** only verify `loadBearing` or non-`high`-confidence claims; **rank by importance and cap the count** (≈24); use 3 skeptics normally but **drop to 1** when budget is tight; claims you skip stay at their stated confidence — **log what you skipped, never silently drop it.**
- **Reserve for synthesis:** always hold back enough budget to synthesize (the deliverable). If budget runs low mid-depth, stop diving and go straight to Synthesize on what you have, listing everything still open.
- The Claude Code workflow (`adapters/claude-code/dar-pipeline.workflow.js`) encodes all of the above as hard caps + `budget.remaining()` checks; on other hosts, apply them by hand.

## Stopping (termination)
End when the Drift Guard returns **CONCLUDE**: every `SC#` has ≥1 CONFIRMED claim; OR loop-until-dry + budget/`MAX_DEPTH` with no still-tractable unmet criterion; OR drift unrecoverable + user confirms stop; OR the question is unanswerable with available sources. The report always states which criteria were met, which weren't, and why. **Calling off is a logged decision, never a silent fade.**

## Edge cases (quick reference)
Contradictions → keep both linked claims, route to arbiter, report as open question if unresolved (never average). Dead leads → retired by the diver's `dry` flag. Backend down → fall back per `capabilities.md`, mark the thread `blocked` (visible), never silently dropped. Junk sub-agent output → re-dispatch once, then quarantine the thread. Paywalled primary → `confidence: low`, `status: unverified` (auto-CONTESTED). Missing capability → degrade + log in `_session.md`. Budget exhaustion mid-depth → go straight to Synthesize on what exists and list everything still open.

## Host acceleration (optional)
On a host with a deterministic workflow engine (e.g. Claude Code's `Workflow` tool), the **Depth → Drift → Verify → Synthesize** stretch MAY be driven by a script for resumability and budget control — see `adapters/claude-code/dar-pipeline.workflow.js`. The control flow is identical to steps 3–5; only the dispatch is deterministic. Every other host follows the instruction loop above directly.
