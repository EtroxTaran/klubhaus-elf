---
title: MCP Memory Integration
status: current
tags: [meta, agents, mcp]
created: 2026-05-17
updated: 2026-05-17
type: protocol
binding: true
related: [[agent-memory-protocol]]
---

# MCP Memory Integration

Project memory is **file-based in the `docs/` vault**. There is intentionally
no MCP-backed memory server.

## Allowed MCP servers

Enforced by `.cursor/hooks/mcp-allowlist.js`:

- **Context7** — library / framework documentation lookup.
- **Linear** — operational issue tracking (see [[../30-Implementation/linear-task-tracking]]).
- **Figma** — design references.

Any other MCP server is denied by the hook. No memory/knowledge-graph MCP
server is approved.

## Rules

- Durable memory belongs in vault notes per [[agent-memory-protocol]] and
  [[vault-governance]], not in an external MCP store.
- Linear holds operational/hot state; the vault holds durable/cold state.
- Do not add an MCP memory server without an accepted ADR and an update to the
  allowlist hook in the same PR.

If a memory MCP server is ever adopted, this note becomes the integration
contract and must be promoted accordingly.
