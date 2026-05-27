---
title: MCP Integration
status: current
tags: [meta, agents, mcp]
created: 2026-05-17
updated: 2026-05-27
type: protocol
binding: true
related:
  - [[agent-memory-protocol]]
  - [[vault-governance]]
---

# MCP Integration

Project memory is **file-based in the `docs/` vault**. There is intentionally
no MCP-backed memory server. This note documents which MCP servers are wired
into the project, how they are configured, and the rules around them.

## Allowed MCP servers

Enforced by `.cursor/hooks/mcp-allowlist.js`. The hook is the source of truth;
this list mirrors it.

Library / docs:

- **Context7** — library / framework documentation lookup.
- **Ref** — alternate docs lookup (preferred per user rule when available).

Operational:

- **Linear** — issue tracking (team FMX, <https://linear.app/coding-x/team/FMX/active>); no issues created yet.
- **Figma** — design references.

External research:

- **Perplexity** — real-time web research with citations. Configured in
 `.cursor/mcp.json` so every Cursor desktop session and cloud agent picks it up
 automatically. See [Perplexity setup](#perplexity-setup) below.

Reserved (allowed by the hook, not currently configured):

- **Obsidian** (`obsidian-mcp-server`), **Memory** (`mcp-memory-service`). The
 hook keeps them on the allowlist for future opt-in; no memory MCP is wired
 today (see [Rules](#rules) below).

Any server name not in the hook is denied at runtime.

## Perplexity setup

Workspace MCP config (committed to git): `.cursor/mcp.json`.

```json
{
 "mcpServers": {
 "perplexity": {
 "type": "stdio",
 "command": "npx",
 "args": ["-y", "@perplexity-ai/mcp-server"],
 "env": {
 "PERPLEXITY_API_KEY": "${env:perplexity-key}"
 }
 }
 }
}
```

Secret `perplexity-key` is provisioned via Cursor Dashboard → Cloud Agents →
Secrets. It is injected as an env var into every cloud-agent VM and is also
available to local Cursor sessions that have the secret exported. The mcp.json
uses Cursor's `${env:perplexity-key}` interpolation so no key value lives in
the repo.

Tools exposed by `@perplexity-ai/mcp-server` (v0.9+):

| Tool | Model | Use for |
|---|---|---|
| `perplexity_search` | Search API | Ranked URL results, finding sources |
| `perplexity_ask` | `sonar-pro` | Quick conversational research with citations |
| `perplexity_research` | `sonar-deep-research` | Long-form comprehensive research |
| `perplexity_reason` | `sonar-reasoning-pro` | Step-by-step analysis / decisions |

Agent usage:

- Use Perplexity for **external research** (web, current events, market scan,
 competitive analysis). Use Context7 / Ref first for library/framework docs.
- Substantial research output belongs in the vault under
 `docs/60-Research/`. Raw transcripts go under
 [[../60-Research/raw-perplexity/README]] with `status: raw`; synthesised notes sit
 alongside other research notes with proper status, related links, and chain
 back to the raw transcript.
- Do not paste API responses verbatim into Linear comments or PR descriptions
 without trimming and citing.

## Rules

- Durable memory belongs in vault notes per [[agent-memory-protocol]] and
 [[vault-governance]], not in an external MCP store.
- Linear holds operational/hot state; the vault holds durable/cold state.
- Do not add an MCP **memory** server without a re-accepted ADR and an update to
 the allowlist hook in the same PR.
- Adding any new MCP server requires updating `.cursor/hooks/mcp-allowlist.js`
 and this note in the same PR. Workspace-scoped configs go in
 `.cursor/mcp.json` (committed); never commit secret values — use
 `${env:VAR_NAME}` interpolation against a Cursor-managed secret.

If a memory MCP server is ever adopted, this note becomes the integration
contract and must be promoted accordingly.
## Related

- [[agent-memory-protocol]]
- [[vault-governance]]
