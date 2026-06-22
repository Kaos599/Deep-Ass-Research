# Mode Playbook · MARKET / competitive intel

**When DAR picks this mode:** the question is about a sector and its competitive field — "map the X market", "who are the players in Y and how are they positioned", "where is Z heading" — where the deliverable is a positioning matrix plus a read on momentum.

Refines `methodology.md` for market work; feeds `orchestration.md` (charter `SC#` in step 1a; gate anchors at the gate; bindings in preflight). Pricing pages usually need `BROWSE` — verify it's bound in task-aware preflight (capabilities.md Pass 2).

---

## 1. Decomposition skeleton (→ charter `SC#` in orchestration step 1a)

- **SC: sector map** — what the market is, its size, and how it segments.
- **SC: players** — the named companies competing in it (one entity note each).
- **SC: positioning** — how each player frames itself and which segment it targets.
- **SC: signals** — pricing, funding, and trend signals that show where the market is moving.

## 2. Search-backend preference order (capability verbs)

| Step | Verb (`kind`) | Prefer (example binding) | Why |
|---|---|---|---|
| Sector map | `SEARCH(news)` | date-filtered Tavily ("state of X 2026") | sizes and segments the market with a recency cutoff |
| Enumerate players | `SEARCH(entity)` | Exa `category:company` | one entity per real competitor |
| Positioning | `SEARCH(entity)` → `FETCH` | Exa → Tavily extract → `raw/` | each player's own framing |
| **Pricing** | `BROWSE(task)` | TinyFish web automation (pricing pages are gated/JS) | live tiers, not stale screenshots |
| Funding | `SEARCH(news)` | **dated** Tavily / Exa | last raise, amount, date |
| Trend signals | `SEARCH(news)` | date-filtered Tavily | direction-of-travel evidence |

Degrade loudly: no `BROWSE` → pricing captured from public surface only, capped low and logged in `_session.md`.

## 3. Gate anchors (breadth→depth `charter anchors hit` criterion)

Depth is **forbidden** until breadth has all of:
- **a market-size source** — at least one cited figure/estimate sizing the sector;
- **≥3 named players** — the field is real and rankable;
- **a recency cutoff** — an explicit "as of" date the whole map is anchored to (so signals are comparable).

## 4. Numbered methodology

**Breadth (cheap `SEARCH`-only scouts):**
1. **Sector map:** `SEARCH(news)` date-filtered ("state of X 2026"); cache the sizing source; create the sector `entities/` concept note with the recency cutoff stated.
2. **Enumerate players:** `SEARCH(entity)` (Exa `category:company`); create **one `entities/` note per player**; append a thread per player to `_open-threads.md` with `serves: SC#`.
3. Stop when coverage saturates (<20% new distinct players/segments per wave) → **GATE**.

**Depth (loop-until-dry; divers `FETCH`/`BROWSE`):**
4. **Positioning:** `FETCH` each player's primary framing into `raw/`; one atomic claim note for how they position + which segment.
5. **Pricing via `BROWSE`:** capture live tiers from each pricing page; claim note with `source_kind: primary`, `source_date` = access date.
6. **Funding via dated `SEARCH`:** last raise (amount, round, **date**) as a claim note; prefer a primary/filing, corroborate self-reports.
7. **Trend signals:** claim notes for direction-of-travel evidence (hiring, launches, churn signals), each dated.
8. Conflicting signals (e.g. one source says growing, another shrinking) are kept and downgraded — they surface later in the thread's `## Counter-evidence`, never deleted.

## 5. What the finished vault should contain

- `entities/` — the sector concept note + one company note per player.
- `sources/` — atomic claim notes: market size, each player's positioning, each pricing tier, each funding event, each trend signal — all **dated** against the recency cutoff.
- `raw/` — cached positioning pages, `BROWSE` pricing-page transcripts, funding sources.
- `threads/` — synthesizer-owned. The synthesizer builds a **positioning matrix (player × segment × price × last-raise × momentum)** and **flags where the market is moving**; **conflicting signals go to `## Counter-evidence`**. Confidence is explicit.
- `_MOC.md` + `99-report.md` — per-`SC#` status; the matrix plus a stated read on momentum, its confidence, and open questions.
