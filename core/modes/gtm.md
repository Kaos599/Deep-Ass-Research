# Mode Playbook · COMPANY / GTM / people

**When DAR picks this mode:** the question is about a specific company, its go-to-market, and the people behind it — "map X's GTM", "what does founder Y actually believe", "how does company Z position itself" — where primary sources are company filings/sites plus the operators' own words.

Refines `methodology.md` for company/people work; feeds `orchestration.md` (charter `SC#` in step 1a; gate anchors at the gate; bindings in preflight). **This mode usually requires `BROWSE`** — verify it's bound in task-aware preflight (capabilities.md Pass 2) before spending budget.

---

## 1. Decomposition skeleton (→ charter `SC#` in orchestration step 1a)

- **SC: company** — disambiguate the exact entity (right legal name, not a namesake).
- **SC: what & how they do it** — product, motion, revenue model, in their own primary words.
- **SC: industry context** — the market they sit in and who they sell against.
- **SC: key people** — founders/execs who set strategy.
- **SC: their stated beliefs** — what those people publicly assert about the market/strategy.
- **SC: strategic implications** — what the above means for the decision the charter serves.

## 2. Search-backend preference order (capability verbs)

| Step | Verb (`kind`) | Prefer (example binding) | Why |
|---|---|---|---|
| Anchor the company | `SEARCH(entity)` → `FETCH` | Exa `category:company` → Tavily extract | get to the official site/filings, not a directory |
| Read primaries | `FETCH(url)` | Tavily extract / Exa fetch → cache in `raw/` | site copy, filings, press |
| Find people | `SEARCH(entity)` | Exa `category:people` / `category:company` | surface the operators |
| Stated beliefs / social | `BROWSE(task)` | TinyFish web automation — **fresh session per call**, use the logged-in profile for X/LinkedIn; dump transcript to `raw/` | posts are behind auth/JS; only `BROWSE` reaches them |
| Adversarial / third-party | `SEARCH(news)` | date-filtered Tavily | independent checks on self-reported claims |

Degrade loudly: no `BROWSE` → the stated-beliefs `SC#` is skipped or capped at low confidence, logged in `_session.md`.

## 3. Gate anchors (breadth→depth `charter anchors hit` criterion)

Depth is **forbidden** until breadth has all of:
- **entity disambiguated** — no fatal ambiguity about which company/person this is;
- **≥1 official source** (company site, filing, or first-party statement) cached;
- **≥1 third-party / adversarial source** (so the picture isn't only self-reported).

## 4. Numbered methodology

**Breadth (cheap `SEARCH`-only scouts):**
1. `SEARCH(entity)` the company; confirm the exact entity and create the `entities/<Company>.md` note (Snapshot · What they do/how · Industry context · Key people · Metrics · Open leads).
2. `SEARCH(entity)` for key people; stub `entities/<Person>.md` for each, `affiliation: [[Company]]`.
3. `SEARCH(news)` date-filtered for third-party coverage and any adversarial takes; append leads to `_open-threads.md` with `serves: SC#`.
4. Stop when coverage saturates → **GATE**.

**Depth (loop-until-dry; divers `FETCH`/`BROWSE` primaries):**
5. **Anchor the company entity:** `FETCH` the official site/filings into `raw/`; extract what/how into atomic claim notes (`source_kind: primary`).
6. **Industry context:** claim notes for market structure and named competitors (link to `entities/`).
7. **Stated beliefs via `BROWSE`:** a **fresh session per call**, logged-in profile for X/LinkedIn, **dump the full transcript into `raw/`** (verifiers read the raw, not the paraphrase). Each belief becomes a **verbatim primary-source claim note** linked from the person entity's `## Stated beliefs (sourced)` list.
8. Self-reported metrics: cache the primary, then look for an independent corroborator (`corroborated_by`); a self-report caps `confidence` even when `source_kind: primary`.
9. Append every new lead (recent posts, unverified metric) to `_open-threads.md` with its `serves: SC#`.

## 5. What the finished vault should contain

- `entities/` — one company note + one note per key person, each person carrying a sourced `## Stated beliefs` list.
- `sources/` — atomic claim notes: what/how, industry context, each stated belief as a verbatim primary, each metric.
- `raw/` — official-page dumps **and** the per-call `BROWSE` transcripts.
- `threads/` — synthesizer-owned. The synthesizer **chains company → people → beliefs → implication**, where **each hop is a `[[link]]` justified by a source note**. Any **stated-belief-vs-observed-metric tension** goes in the thread's `## Counter-evidence`. Confidence is explicit.
- `_MOC.md` + `99-report.md` — per-`SC#` status; strategic implications stated with their confidence and open questions.
