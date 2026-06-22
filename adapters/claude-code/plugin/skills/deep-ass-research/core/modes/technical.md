# Mode Playbook · GENERAL / technical topic

**When DAR picks this mode:** the question is "how do I / should I do X technically" — competing libraries, protocols, architectures, or patterns — where the answer is a reasoned recommendation grounded in primary docs and specs, not a single blog post.

Refines `methodology.md` for technical work; feeds `orchestration.md` (charter `SC#` in step 1a; gate anchors at the gate; bindings in preflight).

---

## 1. Decomposition skeleton (→ charter `SC#` in orchestration step 1a)

- **SC: concept landscape** — what the problem space is and the vocabulary used in it.
- **SC: competing approaches** — the 2–4 real contenders (one thread each).
- **SC: trade-offs** — the axes that actually decide between them (perf, cost, maturity, lock-in, failure modes).
- **SC: recommendation** — the choice this research feeds, with its stated assumptions.

## 2. Search-backend preference order (capability verbs)

| Step | Verb (`kind`) | Prefer (example binding) | Why |
|---|---|---|---|
| Map the space | `SEARCH(docs)` | Tavily / Exa | name the approaches and the vocabulary |
| **Primary docs** | `READ_DOCS` | Context7 (resolve → query) | version-accurate API/usage — the primary for libraries |
| **Specs / RFCs** | `READ_DOCS` | Ref | authoritative standard text |
| Criticism / failure modes | `SEARCH(news)` → `FETCH` | date-filtered Tavily / Exa → extract to `raw/` | known gotchas, postmortems |
| Chase a blog to its source | `FETCH(url)` | Tavily extract / Exa fetch | blogs are **secondary** — chase to the spec |

**Blogs are secondary, chase to the spec.** A claim sourced only to a blog/aggregator is quarantined (`status: unverified`) until grounded in `READ_DOCS`.

## 3. Gate anchors (breadth→depth `charter anchors hit` criterion)

Depth is **forbidden** until breadth has all of:
- **canonical docs located** — the primary documentation/spec for each competing approach is found and reachable via `READ_DOCS`;
- **≥1 known-criticism / failure-mode source** — at least one independent account of where an approach breaks (so the comparison isn't marketing copy).

## 4. Numbered methodology

**Breadth (cheap `SEARCH`-only scouts):**
1. `SEARCH(docs)` the concept to **map the landscape** and fix the vocabulary; dump to `_scout/`. Create `entities/` concept notes for the space.
2. **Enumerate competing approaches — one thread each** in `_open-threads.md`, each with `serves: SC#` and ≥2 candidate primary docs.
3. Locate the canonical docs/spec for each approach (`READ_DOCS` resolve step) and one criticism source.
4. Stop when coverage saturates → **GATE**.

**Depth (loop-until-dry):**
5. For each approach thread, `READ_DOCS` the **primary docs** (Context7 query) and **specs/RFCs via Ref** — read these, not the blog summarizing them.
6. Write **versioned source notes**: `source_date` = the **doc version** (e.g. v18.2, RFC 9110), `source_kind: primary`, `backend:` the docs binding used.
7. Extract atomic claim notes for each trade-off axis — capability, constraint, perf characteristic, failure mode — one claim per note, with a verbatim quote from the doc/spec.
8. Put each approach's **known failure modes / limitations** in the note's `## Disconfirming / caveats` (the criticism source backs these); contradictions are downgraded, never deleted.
9. When a blog made a claim, chase it to the doc/spec and re-source the note; if it can't be grounded, leave it `status: unverified` and log it.

## 5. What the finished vault should contain

- `entities/` — concept notes for the space and one per competing approach.
- `sources/` — versioned atomic claim notes per trade-off axis, primaries from `READ_DOCS`, failure modes in Disconfirming.
- `raw/` — cached spec/doc text and any criticism sources fetched.
- `threads/` — synthesizer-owned. The synthesizer writes an **A-vs-B-vs-C comparison thread** with an **explicit recommendation** and its **stated assumptions** (the `## Thesis`), trade-offs reasoned over the claim notes, and counter-cases / when-the-recommendation-flips in `## Counter-evidence`. Confidence is explicit.
- `_MOC.md` + `99-report.md` — per-`SC#` status; the recommendation stated with assumptions, confidence, and the conditions under which it would change.
