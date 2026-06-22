# opencode subagents for DAR

The 7 DAR roles are registered as opencode subagents in `../opencode.json` using
`prompt: {file:./core/roles/<role>.md}` — so the role prompts are **not duplicated**;
opencode loads them straight from the portable `core/roles/`.

Two ways to wire them:

1. **Inline in `opencode.json`** (what this adapter ships) — the `agent` block defines
   `dar-scout`, `dar-deep-diver`, `dar-skeptic`, `dar-arbiter`, `dar-librarian`,
   `dar-synthesizer`, and `dar-relevance-monitor` (the last is `hidden: true` — internal).

2. **As individual markdown agents** — alternatively split each into
   `~/.config/opencode/agent/dar-<role>.md` (or `.opencode/agent/`) with frontmatter
   `mode: subagent` + a body of `{file:.../core/roles/<role>.md}`. opencode accepts both
   plural `agents/` and singular `agent/` directories.

**Path note:** the `{file:...}` paths are relative to the project root. Adjust them to
wherever the DAR bundle's `core/` lives in your setup (e.g. `.claude/skills/deep-ass-research/core/roles/...`).

The primary orchestrator agent is `../deep-ass-research.md`; it delegates to these via the
`task` tool. Routing can be gated with `permission.task` globs on the primary agent.
