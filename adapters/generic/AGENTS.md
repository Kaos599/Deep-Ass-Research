# DAR — Generic Agent Adapter (AGENTS.md)

Drop this into any agent that reads `AGENTS.md` (Codex, Aider, Gemini CLI, opencode, Cursor, custom agents) — or paste `SYSTEM_PROMPT.md` into a raw LLM agent. It points the agent at the portable DAR methodology and tells it how to bind capabilities when the host has no fancy primitives.

## When to use
When the user asks for deep, multi-source, cited research on a topic, company, market, or body of literature ("deep research", "DAR", "research X properly", "build a knowledge map of X").

## What to do
1. **Read `core/orchestration.md` and follow it exactly.** That is the full runbook. Read the files it references (`core/capabilities.md`, `methodology.md`, `vault-layout.md`, `note-schemas.md`, `provenance.md`, and the chosen `core/modes/<mode>.md`) as you go.
2. **Bind the capability verbs** to whatever this host provides, per the table in `core/capabilities.md`. Run the **preflight** first and record bindings (and any degraded verbs) in `_session.md`.
3. **Spawn sub-agents** for the roles in `core/roles/`:
   - If this host has a sub-agent / task primitive, use it (paste `core/roles/<role>.md` as the sub-agent's prompt + a `## Task` context block), in parallel where possible.
   - **If it does NOT**, run each role **inline and sequentially in your own context**: adopt the role file as your instructions for that focused unit of work, produce the role's specified output, then move on. The methodology is unchanged — only the dispatch differs.
4. **Track progress** with the vault files `_progress.md` (phase checklist) and `_open-threads.md` (lead backlog). These are the source of truth — no host TODO UI required.

## Capability binding hints (generic)
- `SEARCH`/`FETCH` — use the host's web-search / URL-fetch tool; or `curl` against a search API; this is the required floor. If there's truly nothing, `ASK_USER` for seed sources.
- `BROWSE` — only if a browser tool exists; else degrade to `SEARCH`+`FETCH` and log reduced coverage.
- `READ_DOCS` — official docs via `FETCH`.
- `ASK_USER` — a plain question in chat; if unattended, state a default and log it.
- `WRITE_FILE` — the host's file tool; if absent, emit notes in chat with their intended paths.

**Degrade loudly:** record every missing capability in `_session.md` as a known limitation — never skip silently.
