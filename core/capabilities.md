# DAR Capability Interface

DAR is **host-agnostic**. It never calls a host-specific tool by name in its methodology. Instead it depends on **seven abstract capability verbs**. A host adapter (or the agent itself, during preflight) **binds** each verb to whatever that host actually provides. This file is the contract every other `core/` file is written against.

> If you are reading this as the orchestrator: do the **preflight** (below) first, write the chosen bindings into `_session.md`, then follow `orchestration.md`.

---

## The verbs

| Verb | What it must do | Recommended binding | Common alternatives | Fallback if the host lacks it |
|---|---|---|---|---|
| `WRITE_FILE(path, content)` | Create/append a file in the vault | host file-write/edit tool | any editor tool | Emit the content in chat with its intended path; ask the user to save it. Log the degradation. |
| `ASK_USER(question, options?)` | Pause and get a human decision | host ask/question UI | a plain chat question | State a sensible default, proceed, and record the assumption in `_session.md`. |
| `SPAWN_SUBAGENT(role, context)` | Run a focused sub-agent from a role prompt, ideally several in parallel | host sub-agent / task tool | parallel agents | **Run the role inline, sequentially, in the orchestrator's own context** (or via repeated CLI invocations). |
| `SEARCH(query, kind)` | Broad web / entity / paper / docs search; returns candidate sources, not full content | Tavily + Exa | native host web-search, a browser, `curl` + a search API | This is the **required floor**. If there is genuinely no search, `ASK_USER` for seed sources and proceed in a degraded mode. |
| `FETCH(url)` | Retrieve the **full** content of one source and cache it in `raw/` | Tavily extract / Exa fetch | native host web-fetch, `curl` | `ASK_USER` to paste the source text; cache that into `raw/`. |
| `BROWSE(task)` | Interactive / authenticated / dynamic navigation (X, LinkedIn, gated pricing pages, JS-heavy sites) | TinyFish web automation | a Playwright / browser MCP | Degrade to `SEARCH` + `FETCH` on the public surface; log "reduced coverage: no BROWSE". |
| `READ_DOCS(lib_or_topic)` | Version-accurate library / API / spec documentation | Context7 + Ref | the official docs site via `FETCH` | `SEARCH` + `FETCH` against official docs URLs. |

`kind` for `SEARCH` is a hint: `web` (general), `paper` (academic), `entity` (a named company/person), `docs` (technical), `news` (dated/recent).

---

## Preflight (run before any research; see `orchestration.md` steps 0 & 1d)

DAR confirms its toolbelt instead of assuming it. Preflight is **two passes**:

### Pass 1 — generic (orchestration step 0)
1. **Confirm the three "almost-always-present" verbs:** `WRITE_FILE`, `ASK_USER`, `SPAWN_SUBAGENT`. These exist in virtually every agentic IDE — confirm quickly; only reach for a fallback if one is genuinely missing.
2. **Detect the research verbs:** which concrete tools can satisfy `SEARCH`, `FETCH`, `BROWSE`, `READ_DOCS`? Pick the best available per the table above.

### Pass 2 — task-aware (orchestration step 1d, after the charter exists)
3. Once the charter (`_session.md`) lists what *this specific* research needs, confirm those exact tools are bound. Example: a GTM charter that must read a founder's X posts **requires `BROWSE`** — verify it's available now, before spending budget.
4. **Record bindings** in `_session.md` under a `## Capability bindings` heading: verb → concrete tool chosen. This makes a run reproducible and tells a reader exactly which tools shaped the result.

---

## Two rules that keep DAR honest

- **Degrade loudly, never silently.** Any verb with no binding gets written into `_session.md` as a known limitation (e.g. "no `BROWSE` → social-belief sourcing for SC2 skipped; those claims capped at low confidence"). A reader must be able to see what the absence cost.
- **Native parallel sub-agents are the norm, the fallback is the exception.** Claude Code, Cursor (2.4+), and opencode all have real, parallel sub-agents — bind `SPAWN_SUBAGENT` to them directly. The sequential-in-context fallback is only for a bare `AGENTS.md`-style agent with no spawn primitive. Likewise, each major host has a built-in web search/fetch as a zero-config floor for `SEARCH`/`FETCH`, upgraded by Tavily/Exa when available.

---

## Task tracking is file-based (portable by default)

DAR does **not** depend on a host TODO UI. Two markdown files in the vault are the source of truth:
- `_progress.md` — the fixed methodology checklist (orchestrator-owned). See `orchestration.md`.
- `_open-threads.md` — the dynamic research-lead backlog. See `vault-layout.md` / `note-schemas.md`.

If the host *has* a native task/TODO UI (detect in preflight), an adapter MAY mirror `_progress.md` into it for visibility — but the files remain authoritative.

See `PREREQUISITES.md` for the recommended concrete toolset that maximizes each verb.
