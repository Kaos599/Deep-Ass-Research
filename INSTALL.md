# Installing Deep Ass Research (DAR)

DAR is one portable bundle (`core/` + `adapters/`). Pick the install path for your agent. The methodology is identical everywhere; only the thin adapter changes.

```bash
git clone https://github.com/Kaos599/Deep-Ass-Research.git
cd Deep-Ass-Research
```

> **Prerequisites (optional but recommended).** DAR runs on your host's built-in web tools, but is *maximized* by Tavily / Exa / TinyFish / Context7 / Ref — see `core/PREREQUISITES.md`. Set the API keys you have in your environment (`TAVILY_API_KEY`, `EXA_API_KEY`, …). Missing tools degrade loudly, never silently.

---

## 1. Claude Code — as a **skill** (recommended, zero assembly)

The repo root *is* a skill (it has `SKILL.md` + `core/`). Make it discoverable:

```bash
# symlink the clone into your skills dir (edits in the repo stay live):
ln -s "$(pwd)" ~/.claude/skills/deep-ass-research
#   …or copy it if you prefer no symlink:
# cp -R "$(pwd)" ~/.claude/skills/deep-ass-research
```

Then in Claude Code just ask for *"deep research on X"* or run `/deep-ass-research`. That's it.

## 2. Claude Code — as a **plugin** (shareable; registers role subagents + `/dar` + auto-wires MCP)

The plugin scaffold lives in `adapters/claude-code/plugin/`. It must be **assembled once** from the canonical `core/` (so the role prompts aren't duplicated by hand), then installed via a marketplace.

```bash
# assemble the plugin (copies SKILL.md + core/ in, generates agents/dar-*.md from core/roles/):
cd adapters/claude-code/plugin
bash -c '
BUNDLE="$(cd ../../.. && pwd)"; set -e
mkdir -p skills/deep-ass-research agents
cp "$BUNDLE/SKILL.md" skills/deep-ass-research/SKILL.md
cp -R "$BUNDLE/core" skills/deep-ass-research/core
for r in scout deep-diver skeptic arbiter librarian synthesizer relevance-monitor; do
  d=$(grep -m1 "^# Role:" "$BUNDLE/core/roles/$r.md" | sed "s/^# Role: *//")
  { printf -- "---\nname: dar-%s\ndescription: \"DAR — %s\"\nmodel: inherit\n---\n\n" "$r" "${d:-$r}"; cat "$BUNDLE/core/roles/$r.md"; } > "agents/dar-$r.md"
done
echo "assembled $(ls agents | wc -l) agents"'
cd -
```

Then point Claude Code at it (a local marketplace works; or host the assembled `plugin/` dir as its own repo):

```bash
# the plugin dir contains .claude-plugin/{plugin.json,marketplace.json}, .mcp.json, commands/, skills/, agents/
/plugin marketplace add ./adapters/claude-code/plugin
/plugin install deep-ass-research@dar-marketplace
```

Installing **auto-wires** the prerequisite MCP servers from `.mcp.json` (you enable/approve them once). Verify: the skill loads, the role subagents appear under `/agents`, the command is `/deep-ass-research:dar`, and the servers show under `/mcp`. Full details + field-format caveats: `adapters/claude-code/plugin/BUILD.md`.

> Tip: for the simplest experience, use the **skill** path (#1). Use the plugin when you want one-shot install + MCP auto-wiring across a team.

## 3. Cursor

```bash
mkdir -p .cursor/rules .cursor/commands
cp adapters/cursor/deep-ass-research.mdc .cursor/rules/deep-ass-research.mdc
cp adapters/cursor/dar.command.md       .cursor/commands/dar.md   # plain markdown, no frontmatter
```
Make `core/` readable from the workspace (vendor the repo in, or adjust the path in the rule). Cursor reads `.claude/agents/` natively, so the role agents can be reused there; or it spawns them via the `Task` tool. Optionally add a `.cursor/mcp.json` for Tavily/Exa/Context7. The rule auto-loads when you ask for deep research; `/dar` runs the command.

## 4. opencode

```bash
mkdir -p ~/.config/opencode/agent
cp adapters/opencode/deep-ass-research.md ~/.config/opencode/agent/
# merge adapters/opencode/opencode.json into your opencode.json (MCP servers + the dar-* role subagents)
```
Or simply place the whole bundle in `.claude/skills/` — opencode reads `.claude/skills/.../SKILL.md` natively. Built-in `websearch` needs `OPENCODE_ENABLE_EXA=1` (or the Zen provider); otherwise rely on the configured Tavily/Exa MCP.

## 5. Anything else (Codex, Aider, Gemini CLI, custom)

Load `adapters/generic/AGENTS.md`, or paste `adapters/generic/SYSTEM_PROMPT.md` into the agent's system prompt. If the host can't spawn sub-agents, DAR runs the roles sequentially in-context — same methodology.

---

## What you get

A self-contained Obsidian vault at `~/research/dar/<date>-<topic>-<id>/` (override with `DAR_VAULT_ROOT`): atomic, primary-sourced claim notes with explicit `status` + `confidence`, entity notes, synthesis threads, cached primaries in `raw/`, a `_verify-log.md`, a `_MOC.md` front door, and a `99-report.md` answering each success criterion — plus an honest list of what's still open.

See `core/orchestration.md` for exactly how a run proceeds.
