---
title: Raw branch-naming source checks
status: raw
tags: [research, raw, source-check, workflow, branch-naming, linear, github, agents, fmx-174]
created: 2026-06-17
updated: 2026-06-17
type: research
binding: false
linear: FMX-174
related:
  - [[../branch-naming-workflow-reconciliation-2026-06-17]]
  - [[raw-branch-naming-workflow-2026-06-17]]
  - [[../../10-Architecture/09-Decisions/ADR-0045-issue-first-worktree-workflow]]
  - [[../../10-Architecture/09-Decisions/ADR-0103-multi-agent-orchestration-conflict-serialization]]
  - [[../../40-Execution/fmx-174-branch-naming-decision-record-2026-06-17]]
---

# Raw branch-naming source checks

## Capture metadata

- **Issue:** FMX-174
- **Date:** 2026-06-17
- **Purpose:** Validate the Perplexity recommendation with primary/current sources before changing ADR wording.

## Sources checked

| Source | Relevant finding | FMX implication | Confidence |
| --- | --- | --- | --- |
| Linear GitHub documentation: <https://linear.app/docs/github> | Linear links GitHub activity to issues from branch names, PR titles, and magic words with issue IDs. Linear also supports configurable branch-name formats when copying a branch name from an issue. | Keep the issue key in the branch name so Linear, humans, and agents share one obvious join key before the PR body is read. | High |
| Linear GitHub documentation: <https://linear.app/docs/github> | Linear PR automation can move linked issues as PRs open, merge, or close. | Branch and PR metadata should both carry `FMX-<n>`/`fmx-<n>` so status automation and review hygiene agree. | High |
| GitHub issue/PR linking documentation: <https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue> | GitHub can link PRs and branches to issues, and PR body keywords close issues when merged to the default branch. | Keep `Closes FMX-<n>` as the PR body first line, but do not rely on the body alone when branch CI already checks the branch. | High |
| Git reference-format documentation: <https://git-scm.com/docs/git-check-ref-format> | Slashes are valid path separators in refs; invalid characters include spaces, `~`, `^`, `:`, `?`, `*`, `[`, backslash, and ASCII control characters. | `codex/fmx-174-branch-naming` is valid and operationally clear; keep lowercase kebab slugs. | High |
| GitHub Actions contexts documentation: <https://docs.github.com/en/actions/reference/workflows-and-actions/contexts> | Pull request workflows can inspect the source branch through `github.head_ref`; ref-name context is available for workflow logic. | FMX's existing workflow can enforce `fmx-[0-9]+` on source branches without weakening the PR title/body checks. | High |
| Current FMX workflow: `.github/workflows/linear-link-check.yml` | The branch check fails when `github.head_ref` does not contain `fmx-[0-9]+`; PR title/body must also include `FMX-<n>`. | Topic-only `tool/<theme>` branches are already incompatible with current CI. The docs should align with CI instead of carving a standing exception. | High |

## Source-check conclusion

The primary/current source check supports the Perplexity recommendation:

- Normal PR work should use strict issue-key branches.
- The branch rule, PR title rule, and PR body rule should be redundant by design.
- `tool/<theme>` should be described as historical/non-normal wording, not as a current accepted branch family.
- Explicit no-issue work requires Nico's approval and replacement traceability before a branch exists.
