# Mode Playbook · ACADEMIC / literature

**When DAR picks this mode:** the question is about a body of research — "what does the literature say about X", "state of the art in Y", "is claim Z supported by studies" — where the load-bearing sources are papers, not products or people.

This playbook is the numbered methodology a researcher follows once this mode is selected. It refines the generic phase model in `methodology.md` for literature work and feeds `orchestration.md` (charter `SC#` in step 1a; gate anchors at the gate; capability bindings in preflight).

---

## 1. Decomposition skeleton (→ charter `SC#` in orchestration step 1a)

Break the task into these business-logic sub-questions; each becomes an enumerated success criterion in `_session.md`:

- **SC: core question** — what is the precise claim/phenomenon under study, framed by the decision it serves.
- **SC: subfields** — which named research communities/threads attack this, and how do they differ.
- **SC: key methods** — the dominant experimental/theoretical methods and their assumptions.
- **SC: seminal results** — the canonical findings everyone cites (with effect sizes, not vibes).
- **SC: open problems** — what is unresolved, contested, or explicitly flagged as future work.

## 2. Search-backend preference order (capability verbs)

| Step | Verb (`kind`) | Prefer (example binding) | Why |
|---|---|---|---|
| Find papers | `SEARCH(paper)` | Exa neural search → arXiv / OpenReview / Semantic Scholar | neural surfaces conceptually-near work, not just keyword hits |
| Spec / canonical defs | `READ_DOCS` | Ref | exact statements of a method/theorem |
| Recency sweep | `SEARCH(news)` | date-filtered Tavily ("survey 2026", "since 2025") | catches the latest survey + preprints |
| Read the paper | `FETCH(url)` | Exa fetch / Tavily extract → cache full PDF in `raw/` | the primary, not the abstract page |

Degrade loudly per `capabilities.md`: no `FETCH` of full PDFs → every claim stays `status: unverified` and is logged in `_session.md`.

## 3. Gate anchors (breadth→depth `charter anchors hit` criterion)

Depth is **forbidden** until breadth has surfaced **all** of:
- **≥1 seminal paper** (high-citation, foundational to the core question);
- **≥1 recent survey / review** (within the recency cutoff named in the charter);
- **named subfields** — at least the distinct research threads the question splits into, each with ≥2 candidate primaries (the `rankable threads` gate criterion).

If subfields won't resolve, that's a scope problem → loop to a narrowing `ASK_USER`, don't burn depth budget.

## 4. Numbered methodology

**Breadth (cheap, disposable, `SEARCH`-only scouts):**
1. `SEARCH(paper)` the core question + obvious synonyms; dump candidates to `_scout/`.
2. `SEARCH(news)` date-filtered for the most recent survey/review — surveys are the cheapest map of subfields and open problems.
3. From titles/abstracts only, name the subfields and stub one thread per subfield; append leads to `_open-threads.md` with `serves: SC#`. Stub `sources/*.md` for the obvious seminal papers (each scout owns its hundreds block of `S-NNN`).
4. Stop when coverage saturates (<20% new distinct papers/subfields per wave) → **GATE**.

**Depth (loop-until-dry; divers `FETCH` full primaries):**
5. For each committed thread, `FETCH` the **full PDF** into `raw/` — never work from the abstract or a citing summary.
6. **Read the methods, appendix, and limitations sections specifically.** A claim sourced only to an abstract stays `status: unverified`. The verbatim quote in the source note must come from the body, not the abstract.
7. Extract **one atomic claim note per key result** (`sources/S-NNN-<slug>.md`): the result stated with its **effect size / magnitude / n**, `source_kind: primary`, `source_date` = the paper's date, `raw:` pointing at the cached PDF.
8. Put the **paper's own stated threats-to-validity** in the note's `## Disconfirming / caveats` section (sample limits, confounds, "results may not generalize"). If the paper states none, write `None stated by authors as of {accessed}`.
9. Chain findings: when paper B replicates/refutes/extends paper A, link the claim notes (`corroborated_by` / `related`) and append a sub-thread to `_open-threads.md`.
10. Build the **citation/connection graph** — `related: [[ ]]` between claim and `entities/` concept notes; conflicting results are downgraded in `status`, never deleted.

## 5. What the finished vault should contain

- `entities/` — concept notes for the core question and each named subfield/method.
- `sources/` — one atomic claim note per seminal/key result, each with an effect size, a body-text verbatim quote, and the author-stated threats-to-validity in Disconfirming.
- `raw/` — the full cached PDFs (the provenance floor).
- `threads/` — synthesizer-owned. The synthesizer **traces an idea's lineage across papers** (who proposed it → who replicated → who challenged), writes a thread per subfield with explicit **confidence**, and puts replication failures / contested findings in `## Counter-evidence`.
- `_MOC.md` + `99-report.md` — per-`SC#` status, with open problems mapped to remaining `_open-threads.md` leads.
