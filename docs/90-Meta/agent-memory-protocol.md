---
title: Agent Memory Protocol
status: current
tags: [meta, agents, vault]
created: 2026-05-16
updated: 2026-05-17
type: protocol
binding: true
related: [[vault-governance]]
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
4. Read accepted ADRs and approved game design or feature specs for the task.
5. Read the linked Linear issue when one exists.
6. Read the latest session handoff if the work continues a prior thread.

## During Work

- Prefer `current`, `accepted`, and `approved` notes.
- Do not implement from `draft`, `superseded`, `archived`, old plans, old issue mirrors, or chat history.
- `draft`/`idea` notes are the recognized intent layer: read them for
  direction and to avoid re-deciding, but never implement from or cite them as
  settled. See [vault-governance.md](vault-governance.md) § Draft / idea layer.
- Treat user docs as output docs for players, not implementation specifications.
- Use Ref for library/framework documentation.
- Use Perplexity for external research when credentials are working.
- Follow [../30-Implementation/linear-task-tracking.md](../30-Implementation/linear-task-tracking.md) for Linear ticket quality and execution tracking.
- Use [templates/linear-issue.md](templates/linear-issue.md) (and
  [templates/linear-issue-examples.md](templates/linear-issue-examples.md))
  when creating or refining substantial Linear issues.
- Follow [mcp-memory-integration.md](mcp-memory-integration.md) for approved MCP usage.
- Follow [vault-governance.md](vault-governance.md) for memory classes, the
  canonical-location rule, and supersede discipline.
- Use the `vault-memory` skill (`.cursor/skills/vault-memory/SKILL.md`) for the
  repeatable start/update/wrap-up checklist.
- Keep private credentials, API keys, and local Obsidian state out of the vault.

## Updating Memory

Update the vault in the same PR when work changes:

- Architecture or technical approach.
- Product scope, gameplay, or feature behavior.
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
current-state pages, accepted ADRs, approved game design notes, feature specs, or
implementation docs.
