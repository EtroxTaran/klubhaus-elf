---
title: "Session handoff: FMX-174 branch-naming reconciliation"
status: current
tags: [handoff, workflow, branch-naming, fmx-174]
created: 2026-06-17
updated: 2026-06-17
type: handoff
binding: false
linear: FMX-174
related:
  - [[../../60-Research/branch-naming-workflow-reconciliation-2026-06-17]]
  - [[../fmx-174-branch-naming-decision-record-2026-06-17]]
  - [[../../10-Architecture/09-Decisions/ADR-0045-issue-first-worktree-workflow]]
  - [[../../10-Architecture/09-Decisions/ADR-0103-multi-agent-orchestration-conflict-serialization]]
---

# Session handoff: FMX-174 branch-naming reconciliation

## Scope

Reconciled branch-naming drift between ADR-0045, ADR-0103, the Decision Log, and the live `linear-link-check` workflow.

## Decision

Nico selected strict issue-key branch naming on 2026-06-17:

```text
agents: claude|codex|cursor/fmx-<n>-<slug>
humans: feat/fmx-<n>-<slug>
```

`tool/<theme>` is historical/non-normal. It is not a standing accepted branch family. Explicit no-issue work needs Nico approval and replacement traceability before branch creation.

## Updated artifacts

- [[../../60-Research/raw-perplexity/raw-branch-naming-workflow-2026-06-17]]
- [[../../60-Research/raw-perplexity/raw-branch-naming-source-checks-2026-06-17]]
- [[../../60-Research/branch-naming-workflow-reconciliation-2026-06-17]]
- [[../fmx-174-branch-naming-decision-record-2026-06-17]]
- [[../../10-Architecture/09-Decisions/ADR-0045-issue-first-worktree-workflow]]
- [[../../10-Architecture/09-Decisions/ADR-0103-multi-agent-orchestration-conflict-serialization]]
- [[../../00-Index/Decision-Log]]
- [[../../30-Implementation/agent-workflow-pattern]]
- [[../../30-Implementation/linear-task-tracking]]

## Validation

- Run `pnpm docs:check`.
- Run `git diff --check`.
- Confirm any remaining `tool/<theme>`/`tool/<thema>` mentions are historical or explicit-override wording.
