# DAR Provenance, Confidence & Linking

How DAR ties every claim to evidence, marks how sure it is, and weaves notes into a navigable graph. This is the "don't fool yourself" layer — read it before writing any source note.

## The citation discipline

1. **No claim without a `source_url` + a verbatim quote.** A source note with an empty `## Verbatim support` block is invalid. If you can't quote it, you haven't read it.
2. **`raw/` is the provenance floor.** Before citing, dump the fetched page/transcript into `raw/` (`fetch-<date>-<slug>.md`, `clip-<slug>.md`, `tinyfish-run-<uuid>.md`) and point the source note's `raw:` field at it. This makes "read the primary, not the summary" enforceable — the primary stays re-openable and diffable later.
3. **Follow secondary sources to their primary.** If you find a claim in reporting, chase it to the originating document and re-cite the primary; note the chase in `## Assessment`.

## Primary / secondary / tertiary (`source_kind`)

| Kind | What it is | Rule |
|---|---|---|
| **primary** | the originator: company filing/blog, the actual paper, the person's own post/talk, a dataset, a court doc | preferred for any load-bearing claim |
| **secondary** | reporting/analysis *about* a primary (news article, analyst note) | acceptable with corroboration; chase to primary when possible |
| **tertiary** | aggregations (Wikipedia, listicles) | may *point you* to a primary but **never** the sole citation for a load-bearing claim |

## Status vs confidence (two independent axes)

`status` = the evidentiary state of the claim. `confidence` = *your* epistemic state given source quality, corroboration, recency, and incentive-to-distort. They differ: self-reported revenue is `source_kind: primary` but confidence is capped because the source has an incentive to inflate.

**Status drives the `## Assessment` callout** so epistemic state is unmissable in reading view:

| `status` | Callout | Meaning |
|---|---|---|
| `unverified` | `> [!warning] Unverified` | single source, not yet chased to a primary |
| `corroborated` | `> [!question] Corroborated` | ≥2 independent sources agree, but none primary (or primary unreachable) |
| `verified` | `> [!success] Verified` | primary obtained (ideally + 1 independent corroboration) |
| `disputed` | `> [!failure] Disputed` | sources conflict; the note records **both** sides |
| `refuted` | `> [!danger] Refuted` | kept on purpose as disconfirming evidence — **never deleted** |

Special case: a paywalled/unfetchable primary → `confidence: low`, `status: unverified` (treated as auto-CONTESTED in Verify so it can't quietly become load-bearing).

**Propagation:** a thread's confidence ≤ its weakest load-bearing source; the MOC states overall confidence. Write down disconfirming evidence always (the mandatory `## Disconfirming` / `## Counter-evidence` sections). Contradictions get **downgraded**, never erased.

## Backlinks without a central registry

The **filename is the registry** — Obsidian resolves `[[Title]]` by filename. Rules:

1. **Entity notes** are titled by canonical proper name (`Perplexity AI.md`); link via `[[Perplexity AI]]`; variants go in `aliases:` so `[[Perplexity]]` still resolves.
2. **Source notes**: `S-NNN-<slug>` where `S-NNN` is the collision-free part. Each parallel agent owns a **hundreds block** (agent 1 → S-100+) — no shared counter needed.
3. **Thread notes**: semantic `T-<slug>` (synthesizer is single-writer → no collisions).
4. **Link eagerly, even to notes that don't exist yet.** A `[[Company X]]` that has no file is a valid Obsidian *unresolved link* — it shows up ready to be filled. The synthesizer creates the missing notes later and the backlinks auto-populate. This is the registry-free mechanism: writers link; the synthesizer reconciles.
5. **Source notes are immutable evidence; threads are interpretation.** The synthesizer *links to* source notes but never edits their claims. Interpretation, connection, and narrative live only in `threads/` and `_MOC.md`.

## Representing a reasoning chain

A chain like *company → person → stated belief → thesis* is a numbered `## Reasoning chain` list of `[[links]]` in a thread note, each hop justified by a source note, mirrored in the entity's `## Stated beliefs (sourced)` list:

```
[[Perplexity AI]] ──affiliation──▶ [[Aravind Srinivas]] ──belief──▶ [[S-002-srinivas-answer-engine-thesis]]
                                                                              │ supports
                                                                              ▼
                                                          [[T-answer-engine-positioning]]  (thesis)
```

Because each arrow's justification is a source note, the chain is auditable end-to-end. The synthesizer may also drop a Mermaid `graph` in the MOC with clickable `class Node internal-link;` nodes.
