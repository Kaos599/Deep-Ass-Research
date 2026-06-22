# Deep Ass Research (DAR)

An **IDE-agnostic** framework for rigorous, multi-source research. DAR maps a topic broadly, commits to depth only once a direction is clear, **adversarially verifies** what it finds, and **synthesizes** everything into a navigable, backlinked Obsidian vault with an honest report and a list of still-open questions.

It works in any agentic IDE that can read files and call tools. The methodology is portable markdown (`core/`); thin per-host **adapters** bind it to each host's primitives.

## How it works (one screen)

```
Preflight → Decompose & Charter → Breadth → ┤GATE├ → Depth ⟲ Drift Guard → Verify → Synthesize → Deliver
            (decompose · clarify ·          (human    (loop:    (compass,     (refute,    (MOC +
             success criteria SC1..n)        check-in) divers)   not a cage)   2-of-3)     report)
```

- **Range before depth.** Cheap `SEARCH`-only scouts map the landscape; a scored gate (with one human check-in) decides when to commit expensive depth.
- **Read the primary, not the summary.** Divers `FETCH` full primary sources into `raw/` and write atomic, cited claim notes; summary-only claims are quarantined.
- **Don't fool yourself.** Skeptics try to *refute* load-bearing claims (2-of-3 majority); disconfirming evidence is written into the notes; contradictions are downgraded, never deleted.
- **Steer continuously.** A charter of success criteria (`SC#`) is the spine; a drift guard scores every depth batch and decides CONTINUE / REFOCUS / ESCALATE / CONCLUDE. The charter is a *compass, not a cage* — useful tangents get promoted, dead ones pruned.
- **Synthesis is the contribution.** The deliverable is a `_MOC.md` map + `[[wikilink]]` graph + a `99-report.md` answering each `SC#`.

## Bundle layout

```
deep-ass-research/
├── SKILL.md                     # Claude Code entry (this dir works as a drop-in skill)
├── README.md
├── core/                        # PORTABLE methodology — names no host tool
│   ├── capabilities.md  PREREQUISITES.md  methodology.md  orchestration.md
│   ├── vault-layout.md  note-schemas.md  provenance.md
│   ├── roles/   (scout, deep-diver, skeptic, arbiter, librarian, synthesizer, relevance-monitor)
│   └── modes/   (academic, gtm, technical, market)
└── adapters/
    ├── generic/   AGENTS.md + SYSTEM_PROMPT.md     (universal baseline)
    ├── claude-code/ dar-pipeline.workflow.js + plugin/   (optional accelerator + distribution)
    ├── cursor/    deep-ass-research.mdc + dar.command.md
    └── opencode/  deep-ass-research.md + opencode.json + subagents/
```

**Start at `core/orchestration.md`** — it's the runbook every adapter points to.

## Capabilities (what DAR needs)

DAR depends on 7 abstract verbs, bound per host during preflight: `WRITE_FILE`, `ASK_USER`, `SPAWN_SUBAGENT`, `SEARCH`, `FETCH`, `BROWSE`, `READ_DOCS`. It runs on a host's built-ins; it's **maximized** by the recommended toolset (Tavily, Exa, TinyFish, Context7, Ref) — see `core/PREREQUISITES.md`. Missing capabilities degrade loudly (logged in `_session.md`), never silently.

## Install per host

```bash
git clone https://github.com/Kaos599/Deep-Ass-Research.git
```
Then follow **[INSTALL.md](INSTALL.md)** for step-by-step instructions per host. Quick reference:

| Host | Install |
|---|---|
| **Claude Code (skill)** | Symlink the clone into `~/.claude/skills/deep-ass-research` → invoke `/deep-ass-research` or just ask for "deep research". Zero assembly. |
| **Claude Code (plugin)** | Assemble per `adapters/claude-code/plugin/BUILD.md`, then `/plugin marketplace add …` + `/plugin install`. Auto-wires the prerequisite MCP servers. |
| **Cursor** | Copy `adapters/cursor/deep-ass-research.mdc` → `.cursor/rules/`, `adapters/cursor/dar.command.md` → `.cursor/commands/dar.md`; make `core/` readable from the workspace; optionally add a `.cursor/mcp.json`. |
| **opencode** | Copy `adapters/opencode/deep-ass-research.md` → `~/.config/opencode/agent/` and merge `adapters/opencode/opencode.json`; or just place the bundle in `.claude/skills/` (opencode reads it natively). |
| **Anything else** | Load `adapters/generic/AGENTS.md`, or paste `adapters/generic/SYSTEM_PROMPT.md` into the agent's system prompt. |

## Output

A self-contained vault at `~/research/dar/<date>-<topic>-<id>/` (override with `DAR_VAULT_ROOT`): atomic cited claim notes (`sources/`), entity notes, synthesis threads, cached primaries (`raw/`), a `_verify-log.md`, a `_MOC.md` front door, and a `99-report.md`. Every claim ties to a primary source and carries an explicit `status` + `confidence`.
