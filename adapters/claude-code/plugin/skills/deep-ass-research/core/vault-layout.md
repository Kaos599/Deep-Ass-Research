# DAR Vault Layout

DAR writes everything into one **Obsidian-style vault** per research session: plain markdown notes linked with `[[wikilinks]]`, navigable by a human afterward. This file defines where the vault lives and what goes in it. Note *templates* are in `note-schemas.md`; *provenance/linking rules* are in `provenance.md`.

## Path convention

```
<DAR_VAULT_ROOT>/<YYYY-MM-DD>-<topic-slug>-<shortid>/
```

- **`DAR_VAULT_ROOT`** — env override if set; else `~/research/dar/`; fall back to `./dar-vault/` only if `$HOME` is unwritable.
- **`<YYYY-MM-DD>`** — today's date from the session context (NOT a runtime clock call — workflow sandboxes forbid `Date.now()`).
- **`<topic-slug>`** — the topic lowercased, non-alphanumerics → `-`, collapsed, trimmed, capped ~48 chars.
- **`<shortid>`** — a stable disambiguator derived **without** a clock: `printf '%s' "<topic-slug>-<mode>" | shasum | cut -c1-6`. Re-running the same topic+mode in one session reuses the folder (idempotent appends); a genuinely new run gets a fresh id from the orchestrator/session.

Example: `~/research/dar/2026-06-22-perplexity-gtm-strategy-a3f9c1/`

## Directory tree (one session)

```
<vault>/
├── _MOC.md            # Map of Content — the human front door; exec synthesis on top. SYNTHESIZER-owned.
├── _session.md        # charter: question, success criteria SC1..n, scope, capability bindings, gate decision, status. ORCHESTRATOR-owned.
├── _progress.md       # methodology phase checklist. ORCHESTRATOR-owned.
├── _open-threads.md   # research-lead backlog. APPEND-ONLY by agents; reconciled by synthesizer.
├── _verify-log.md     # per-claim verdicts + dissent. VERIFY-phase-owned.
├── 99-report.md       # final narrative answering each SC#. SYNTHESIZER-owned.
├── sources/           # atomic CLAIM notes  S-NNN-<slug>.md  (search agents; one-writer-per-file)
├── entities/          # company / person / concept notes, titled by canonical name
├── threads/           # synthesis notes  T-<slug>.md  (synthesizer-owned)
├── raw/               # immutable primary-source dumps — the provenance floor
├── _scout/            # disposable breadth dumps (kept for audit)
└── attachments/       # screenshots, PDFs, charts referenced via ![[...]]
```

## Ownership & write-safety (so parallel agents never collide)

- **`_`-prefixed files** are infrastructure (sort to the top in Obsidian). Each has a single owner phase; agents don't co-edit them.
- **`sources/`** is **one-writer-per-file**: each note is `S-NNN-<slug>.md`, and each parallel search agent is assigned a **hundreds block** of `NNN` (agent 1 → S-100+, agent 2 → S-200+) so two divers never pick the same id.
- **`threads/`** is written **only** by the synthesizer — interpretation lives here, never in source notes.
- **`raw/`** is append-only and immutable — once a primary is dumped, it's never edited (it's the audit floor).
- **`_open-threads.md`** is **append-only** from agents (they only add leads); it is *restructured* only by the orchestrator (at the gate / drift guard) and the synthesizer (at the end).

## What each phase produces (quick map)

| Phase | Writes |
|---|---|
| Charter | `_session.md`, seeds `_open-threads.md` + `_progress.md` |
| Breadth (scouts) | `_scout/*.md`, stub `sources/*.md`, appends `_open-threads.md` |
| Depth (divers) | atomic `sources/*.md`, `raw/*.md`, appends sub-threads to `_open-threads.md` |
| Verify (skeptics/arbiter) | `_verify-log.md`, updates `status` in `sources/*.md` |
| Synthesize (librarian/synthesizer) | repairs `[[links]]`, `entities/*.md`, `threads/*.md`, `_MOC.md`, `99-report.md`, reconciles `_open-threads.md` |
