---
title: Branch-Naming Workflow Reconciliation
status: current
tags: [research, workflow, branch-naming, linear, github, agents, fmx-174]
created: 2026-06-17
updated: 2026-06-17
type: research
binding: false
linear: FMX-174
related:
  - [[raw-perplexity/raw-branch-naming-workflow-2026-06-17]]
  - [[raw-perplexity/raw-branch-naming-source-checks-2026-06-17]]
  - [[../10-Architecture/09-Decisions/ADR-0045-issue-first-worktree-workflow]]
  - [[../10-Architecture/09-Decisions/ADR-0103-multi-agent-orchestration-conflict-serialization]]
  - [[../40-Execution/fmx-174-branch-naming-decision-record-2026-06-17]]
---

# Branch-Naming Workflow Reconciliation

FMX-174 reconciles the branch-naming drift between [[../10-Architecture/09-Decisions/ADR-0045-issue-first-worktree-workflow]] and [[../10-Architecture/09-Decisions/ADR-0103-multi-agent-orchestration-conflict-serialization]].

## Current contradiction

- ADR-0045 already defines one issue, one branch/worktree, one PR, and a strict issue-key branch shape.
- ADR-0103 left D2 open between strict issue-key branches and topic-only branches.
- [[../00-Index/Decision-Log]] had interpreted ADR-0103 as accepting both branch forms.
- The live GitHub workflow `.github/workflows/linear-link-check.yml` requires `fmx-[0-9]+` in PR source branches, so topic-only `tool/<theme>` branches cannot pass CI.

## Evidence summary

| Evidence | Finding | Workflow consequence |
| --- | --- | --- |
| [[raw-perplexity/raw-branch-naming-workflow-2026-06-17]] | Strict issue-key branches are the strongest fit for Linear/GitHub traceability and multi-agent collision avoidance. | Prefer one enforced branch family instead of mixed conventions. |
| Linear GitHub documentation | Linear can link branches, PRs, and magic-word references to issues, and PR automation moves linked issues across workflow states. | Put the issue ID in branch, title, and body so automation and review use the same key. |
| GitHub issue/PR linking documentation | PR body keywords close linked issues on merge to the default branch. | Keep `Closes FMX-<n>` as PR-body first line, but do not rely on it as the only traceability key. |
| Git reference-format documentation | Slash-prefixed categories and lowercase kebab slugs are valid branch refs when invalid characters are avoided. | `codex/fmx-174-branch-naming` is a valid and reviewable format. |
| FMX `linear-link-check.yml` | Current CI already enforces an `fmx-<n>` source branch and `FMX-<n>` PR metadata. | The docs should match the stricter live gate. |

## Options

| Option | Description | Result |
| --- | --- | --- |
| A. Strict issue-key + slug | Agents use `claude|codex|cursor/fmx-<n>-<slug>`; humans use `feat/fmx-<n>-<slug>`. | **Accepted by Nico on 2026-06-17.** Best fit for current CI, Linear, review, and multi-agent worktrees. |
| B. Mixed accepted branch forms | Keep both `tool/fmx-n-slug` and `tool/<theme>` as valid normal forms. | Rejected. This preserves drift and requires either CI weakening or ad-hoc exceptions. |
| C. Topic-only by default | Use topic branches and rely on PR title/body for issue linkage. | Rejected. This weakens one-issue/one-branch traceability and increases collision risk. |

## Current rule

Normal PR work uses strict issue-key branches:

```text
agents: claude|codex|cursor/fmx-<n>-<slug>
humans: feat/fmx-<n>-<slug>
```

`tool/<theme>` is now historical/non-normal wording. It is not a standing accepted branch family.

If Nico explicitly authorizes work without a Linear issue, that approval must name the replacement traceability before branch creation. That override is instance-specific and does not create a generic `no-ref` branch escape.

## Invariants

- **BN-1:** Every normal PR branch includes `fmx-<n>`.
- **BN-2:** Every PR title/body includes `FMX-<n>`, with `Closes FMX-<n>` for completing PRs.
- **BN-3:** ADR-0045 is the canonical branch/worktree workflow owner.
- **BN-4:** ADR-0103 governs multi-agent orchestration and references ADR-0045 for branch naming.
- **BN-5:** Topic-only branch wording in older notes is historical unless explicitly corrected by Nico for one instance.

## Follow-up

- Keep `.github/workflows/linear-link-check.yml` strict. No CI change is needed.
- Keep future branch-form changes as ADR-0045 amendments, not scattered ADR-0103 notes.
- If a legitimate no-issue workflow appears later, open a new Linear/ADR decision with explicit traceability requirements.
