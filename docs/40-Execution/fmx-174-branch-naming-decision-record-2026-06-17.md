---
title: FMX-174 Branch-Naming Reconciliation Decision Record
status: current
tags: [execution, decision-record, workflow, branch-naming, accepted, fmx-174]
created: 2026-06-17
updated: 2026-06-17
type: decision-record
binding: false
linear: FMX-174
related:
  - [[../60-Research/branch-naming-workflow-reconciliation-2026-06-17]]
  - [[../10-Architecture/09-Decisions/ADR-0045-issue-first-worktree-workflow]]
  - [[../10-Architecture/09-Decisions/ADR-0103-multi-agent-orchestration-conflict-serialization]]
  - [[../00-Index/Decision-Log]]
---

# FMX-174 Branch-Naming Reconciliation Decision Record

## Decision context

FMX-174 was opened because the vault had two conflicting branch-naming statements:

- ADR-0045 and the live CI gate require issue-key branches.
- ADR-0103 and the Decision Log still implied that topic-only `tool/<theme>` branches were accepted.

The issue required Perplexity-first research, primary-source checks, and Nico approval before changing the branch/worktree contract.

## Decisions recorded

| ID | Decision | Status | Rationale |
| --- | --- | --- | --- |
| D1 | Normal PR work uses strict issue-key branches. Agents use `claude|codex|cursor/fmx-<n>-<slug>`; humans use `feat/fmx-<n>-<slug>`. | Accepted by Nico, 2026-06-17. | Best fit for Linear/GitHub traceability, existing `linear-link-check`, and multi-agent collision avoidance. |
| D2 | ADR-0045 is the canonical owner for branch/worktree naming. ADR-0103 references ADR-0045 instead of carrying an alternate D2 branch rule. | Accepted. | Keeps one current truth for operational workflow. |
| D3 | `tool/<theme>` is historical/non-normal and not a standing accepted branch family. | Accepted. | Avoids weakening CI and avoids hidden no-issue work. |
| D4 | Do not add a generic `no-ref` escape. Explicit no-issue work requires Nico's approval and replacement traceability before branch creation. | Accepted. | Preserves auditability without inventing a broad exception path. |
| D5 | Keep `.github/workflows/linear-link-check.yml` unchanged. | Accepted. | The workflow already enforces the selected strict issue-key rule. |

## Artifacts

- Raw Perplexity capture: [[../60-Research/raw-perplexity/raw-branch-naming-workflow-2026-06-17]]
- Source checks: [[../60-Research/raw-perplexity/raw-branch-naming-source-checks-2026-06-17]]
- Synthesis: [[../60-Research/branch-naming-workflow-reconciliation-2026-06-17]]
- ADR owner: [[../10-Architecture/09-Decisions/ADR-0045-issue-first-worktree-workflow]]
- ADR reference cleanup: [[../10-Architecture/09-Decisions/ADR-0103-multi-agent-orchestration-conflict-serialization]]

## Validation expectations

- `pnpm docs:check`
- `git diff --check`
- Verify remaining historical `tool/<theme>` / `tool/<thema>` mentions are annotated as historical or explicit override only.
