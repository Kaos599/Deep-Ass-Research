# Building the DAR Claude Code plugin

This directory holds the plugin **scaffold** (manifests + config + command). The skill body and the role subagents are **not** duplicated here — they're generated from the canonical `core/` so there's one source of truth. Run the assembly script below to produce a complete, installable plugin.

> **Verify before publishing** (formats move): confirm the current `.claude-plugin/plugin.json` + `marketplace.json` fields, the plugin `.mcp.json` shape (flat map vs `mcpServers` wrapper, and `type: http`/`sse` for remote servers), and the `agents/`/`commands/` conventions against the live Claude Code plugin docs.

## Layout (after assembly)
```
plugin/
├── .claude-plugin/{plugin.json, marketplace.json}
├── .mcp.json                     # prerequisite MCP servers, auto-wired on install
├── commands/dar.md               # /deep-ass-research:dar
├── skills/deep-ass-research/     # ← copied from the bundle (SKILL.md + core/)
└── agents/dar-<role>.md          # ← generated from core/roles/*.md
```

## Assembly script
Run from this `plugin/` directory (the bundle root is three levels up):
```bash
BUNDLE="$(cd ../../.. && pwd)"           # …/skills/deep-ass-research
set -e

# 1) Skill component: the SKILL.md + the portable core/
mkdir -p skills/deep-ass-research
cp "$BUNDLE/SKILL.md" skills/deep-ass-research/SKILL.md
cp -R "$BUNDLE/core" skills/deep-ass-research/core

# 2) Role subagents, generated from core/roles/ (no duplication of content by hand)
mkdir -p agents
for r in scout deep-diver skeptic arbiter librarian synthesizer relevance-monitor; do
  desc=$(grep -m1 '^# Role:' "$BUNDLE/core/roles/$r.md" | sed 's/^# Role: *//')
  {
    printf -- '---\nname: dar-%s\ndescription: "DAR — %s"\nmodel: inherit\n---\n\n' "$r" "${desc:-$r}"
    cat "$BUNDLE/core/roles/$r.md"
  } > "agents/dar-$r.md"
done
echo "Assembled DAR plugin: $(ls -1 agents | wc -l | tr -d ' ') agents, skill copied."
```

## Install / distribute
```bash
# from the repo that contains this plugin dir as its root:
/plugin marketplace add <owner/repo>           # or a local path / git URL
/plugin install deep-ass-research@dar-marketplace
```
Installing auto-wires the `.mcp.json` servers (the user still enables/approves them once). Confirm registration: the skill appears via the skill list, role subagents under `/agents`, the command as `/deep-ass-research:dar`, and the servers under `/mcp`.

## Notes
- `${CLAUDE_PLUGIN_ROOT}` resolves to the installed plugin dir if you need absolute paths inside configs.
- Set real `TAVILY_API_KEY` / `EXA_API_KEY` in the environment; the `.mcp.json` references them.
- Bump `version` in `plugin.json` to push updates to installed users.
