---
title: Agent Memory Protocol
status: current
tags: [meta, agents, vault]
created: 2026-05-16
updated: 2026-05-17
type: protocol
binding: true
related:
  - [[vault-governance]]
---

# Agent Memory Protocol

All agents use the vault as project memory. The entry path is short by design:
`AGENTS.md` or `CLAUDE.md` points here, and this note points to the durable
context.

## Session Start

Before substantial work:

1. Read [../00-Index/Agent-Onboarding.md](../00-Index/Agent-Onboarding.md).
2. Read [../00-Index/Current-State.md](../00-Index/Current-State.md).
3. Read relevant maps from [../00-Index/Home.md](../00-Index/Home.md).
4. Read the decision indexes
   ([../00-Index/Decision-Log.md](../00-Index/Decision-Log.md),
   [../50-Game-Design/README.md](../50-Game-Design/README.md)) for the task.
   As of the 2026-05-27 reopen, ADRs/GDDRs are `draft`; implement only after
   Nico re-ratifies a record to `accepted` / `approved`. Chain: research →
   game design → architecture → implementation.
5. Read the linked Linear issue when one exists.
6. Read the latest session handoff if the work continues a prior thread.

## During Work

- Prefer `current` process/meta notes and re-ratified `accepted` / `approved`
  decisions.
- Do not implement from `draft`, `superseded`, `archived`, old plans, old issue mirrors, or chat history.
- `draft`/`idea` notes are the recognized intent layer: read them for
  direction and to avoid re-deciding, but never implement from or cite them as
  settled. See [vault-governance.md](vault-governance.md) § Draft / idea layer.
- Treat user docs as output docs for players, not implementation specifications.
- Use Ref for library/framework documentation.
- Use Perplexity for external research; it is wired automatically via
  `.cursor/mcp.json` (see [mcp-memory-integration.md](mcp-memory-integration.md)).
- Operational tracking is Linear (team FMX,
  <https://linear.app/coding-x/team/FMX/active>). No issues exist yet and there
  is no task-tracking process doc — agree lightweight conventions before
  creating issues.
- Follow [mcp-memory-integration.md](mcp-memory-integration.md) for approved MCP usage.
- Follow [vault-governance.md](vault-governance.md) for memory classes, the
  canonical-location rule, and supersede discipline.
- Use the `vault-memory` skill (`.cursor/skills/vault-memory/SKILL.md`) for the
  repeatable start/update/wrap-up checklist.
- Keep private credentials, API keys, and local Obsidian state out of the vault.

## Updating Memory

Update the vault in the same PR when work changes:

- Architecture or technical approach (the relevant ADR).
- Product scope, gameplay, or game-system behavior (the relevant GDDR in
  `../50-Game-Design/`; see [vault-governance.md](vault-governance.md)
  § Game design layer).
- Operational process.
- User-facing behavior that should be documented.
- Research conclusions that future agents need.

When an approach changes:

1. Create or update the replacement note.
2. Mark the old note `status: superseded`.
3. Link both directions with `supersedes` and `superseded_by`.
4. Add a visible supersession note near the top of the old note.
5. Update [../00-Index/Current-State.md](../00-Index/Current-State.md) and relevant maps.

## Session Wrap-Up

Before handing off substantial work:

1. Write or update a handoff note under
   [../40-Execution/session-handoffs/](../40-Execution/session-handoffs/) using
   [templates/handoff.md](templates/handoff.md).
2. Record completed work, open tasks, blockers, and changed vault paths.
3. List any decisions that still need promotion into ADRs, feature specs, game design notes, or rules.
4. Link the final vault paths from Linear when a Linear issue exists.

Session handoffs are working memory. Durable decisions must be promoted into
current-state pages, re-accepted ADRs, re-approved game design notes, feature
specs, or implementation docs.
## Related

- [[vault-governance]]
