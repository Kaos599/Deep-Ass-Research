# DAR Prerequisites & Recommended Toolset

> **Placeholder to finalize at go-live.** DAR runs with whatever tools the host already has (see the fallbacks in `capabilities.md`). This file lists the **free / recommended** tools that *maximize* DAR by giving each capability verb its best binding. Treat the list below as the default recommendation and adjust it for your environment before publishing.

DAR needs **nothing installed** to function — every host has a web-search/fetch floor and a file-write tool. The toolset below upgrades quality, recency, and coverage.

## Recommended bindings (verb → tool)

| Verb | Recommended tool | Why | Install / access |
|---|---|---|---|
| `SEARCH` (structured) | **Tavily** | Clean, structured, date-filterable results; good `extract`/`crawl`/`map` | MCP server `tavily-mcp` (needs `TAVILY_API_KEY`) |
| `SEARCH` (semantic) | **Exa** | Neural/semantic search; `category:` filters for people & companies; finds papers | MCP `https://mcp.exa.ai/mcp` (needs `EXA_API_KEY`) |
| `FETCH` | **Tavily extract** / **Exa fetch** | Full-page content extraction into `raw/` | (same servers as above) |
| `BROWSE` | **TinyFish** | Interactive/authenticated/social navigation (X, LinkedIn, gated pages); browser automation | TinyFish MCP |
| `READ_DOCS` | **Context7** + **Ref** | Version-accurate library/API/spec docs; avoids stale training knowledge | Context7 MCP (`https://mcp.context7.com/mcp`) + Ref MCP |
| floor for `SEARCH`/`FETCH` | host built-ins | zero-config baseline | Cursor `WebSearch`/`WebFetch`; opencode `websearch`/`webfetch`; Claude Code `WebSearch`/`WebFetch` |

## Per-host notes (verified mid-2026)

- **Claude Code (plugin packaging):** the recommended servers can be **auto-wired** by shipping a `.mcp.json` in the plugin — installing the plugin sets them up, no manual `/mcp` step. See the plugin packaging in the plan.
- **Cursor:** ship a `.cursor/mcp.json` in the repo; the user must still **enable** the servers once (the Cursor CLI needs `--approve-mcps`). Built-in `WebSearch`/`WebFetch` exist but are unreliable under the **Auto** model — prefer a named model or the MCP servers.
- **opencode:** put servers under the `mcp` block in `opencode.json`. The built-in Exa-backed `websearch` is **gated** — it only works with the Zen provider or when `OPENCODE_ENABLE_EXA=1` is set; for reliability, configure a Tavily/Exa MCP explicitly.

## Minimum viable setup

Pick **one** `SEARCH`/`FETCH` provider (Tavily *or* Exa) + the host's native web tools, and DAR works end-to-end for the technical and academic modes. Add **TinyFish** before running GTM/people mode (social sourcing needs `BROWSE`). Add **Context7/Ref** to make technical mode authoritative.
