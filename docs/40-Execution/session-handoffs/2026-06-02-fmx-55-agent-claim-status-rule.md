---
title: Handoff FMX-55 Agent Claim Status Rule
status: wrapped
tags: [meta, execution, handoff, linear, workflow, agents, fmx-55]
created: 2026-06-02
updated: 2026-06-02
type: handoff
related:
  - [[../../30-Implementation/linear-task-tracking]]
  - [[../../30-Implementation/agent-workflow-pattern]]
  - [[../../00-Index/Current-State]]
---

# Handoff: FMX-55 Agent Claim Status Rule (2026-06-02)

## Goals

- Make agent task ownership visible in Linear before branch/PR creation.
- Prevent duplicate pickup of claimable Backlog tasks by different agents.
- Keep GitHub PR automation as traceability/fallback, not the first claim signal.

## Completed

- Created FMX-55 and immediately moved it from `Backlog` to `In Progress` as the
  first visible claim action.
- Updated the canonical Linear workflow so agents may claim `Backlog` or `Todo`
  issues by moving them to `In Progress` after checking for active ownership.
- Updated the agent workflow loop to require claim before branch/worktree or file
  edits.
- Updated the Cursor Linear tracking rule so local/cloud agents see the same
  claim rule.
- Added a Current-State pointer for the operational change.

## Open Tasks

- None for the documentation beat.

## Decisions Made

- Agent claim states are `Backlog` and `Todo`.
- Claiming is an explicit Linear-MCP status move to `In Progress` before branch,
  worktree or file edits.
- Agents still never move issues to `Done` or `Canceled`.

## Blockers

- None.

## Durable Notes Updated

- `docs/30-Implementation/linear-task-tracking.md`
- `docs/30-Implementation/agent-workflow-pattern.md`
- `.cursor/rules/02-linear-tracking.mdc`
- `docs/00-Index/Current-State.md`

## Promotion Needed

- None; this is an operational workflow rule, not an ADR/GDDR decision.
