---
title: MCP Memory Integration
status: current
tags: [meta, mcp, agents, vault]
created: 2026-05-16
updated: 2026-05-16
type: implementation
binding: true
related: [[agent-memory-protocol]], [[vault-governance]], [[obsidian-config]]
---

# MCP Memory Integration

MCP tools are access layers around the vault. They do not replace `docs/` as the
durable project memory.

## Approved Uses

| MCP | Use | Rule |
| --- | --- | --- |
| Ref | Library, framework, API, SDK, and tool documentation | Use before answering or coding against external docs. |
| Perplexity | Broader external research | Use for research when credentials work; write durable findings into `docs/60-Research/` or an ADR input section. |
| Linear | Operational issue state | Link progress, PRs, blockers, and final vault paths. |
| Obsidian MCP or Local REST API | Local vault search, active-note access, frontmatter patching, and Obsidian-native automation | Optional local workflow only; never required for critical context. |
| Memory MCP | Semantic cache, graph associations, repeated facts | Cache only. Promote durable facts into `docs/`. |
| Figma | Design artifacts and design-system workflows | Use only for visual/design tasks. |

## Obsidian MCP Guidance

Obsidian MCP servers commonly expose note read/update, global search,
frontmatter management, tags, and list operations via the Obsidian Local REST API
plugin. If enabled locally:

- Store the Obsidian API key outside Git.
- Scope the server to the `docs/` vault.
- Prefer read/search/frontmatter operations over broad overwrite operations.
- Do not delete notes through MCP.
- Run `pnpm docs:check` after MCP-driven vault changes.

## Perplexity Credential State

The `user-perplexity-ask` MCP server is configured, but the last attempted call
returned `401 Unauthorized`. The API key must be fixed outside the repository.
Do not commit Perplexity credentials or examples containing real keys.

## Allowlist Policy

Project hooks should allow only the approved MCP servers needed for this
workflow. If server identifiers differ by client, include both the friendly name
and the configured server id.

## Promotion Rule

Any research, memory, or graph result that future agents need must be promoted
into the vault:

1. Research findings go to `docs/60-Research/`.
2. Architecture decisions go to ADRs.
3. Gameplay/product decisions go to game design or feature notes.
4. Agent workflow lessons go to rules, skills, or meta notes.
