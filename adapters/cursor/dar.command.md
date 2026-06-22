<!--
Cursor command. Install: copy to `.cursor/commands/dar.md` (the filename becomes the command name → `/dar`).
NOTE: Cursor commands are PLAIN MARKDOWN with NO YAML frontmatter — do not add a `---` block (that's the Claude Code format; Cursor would treat it as literal prompt text). This HTML comment is stripped/ignored; keep the body below as the command.
-->

# Deep Ass Research

Run the Deep Ass Research (DAR) process on the topic I provide.

1. Read `core/orchestration.md` from the DAR bundle and follow it exactly.
2. Start with the preflight and the Decompose & Charter step — ask me the clarifying questions (scope, the decision this feeds, recency, seed sources) before spending search budget.
3. Use Cursor subagents (the `Task` tool) for the scout/diver/skeptic/synthesizer roles in `core/roles/`, in parallel where possible.
4. Write everything into a new Obsidian vault under `~/research/dar/` per `core/vault-layout.md`, and at the end show me the Map of Content, the per-success-criterion status, and the open questions.
