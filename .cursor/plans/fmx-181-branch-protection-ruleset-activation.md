---
title: FMX-181 Branch Protection Ruleset Activation Plan
status: current
tags: [plan, fmx-181, github, rulesets, branch-protection, codeowners, ci]
created: 2026-06-16
updated: 2026-06-16
type: plan
binding: false
related:
  - [[../../docs/60-Research/branch-protection-codeowner-activation-2026-06-16]]
  - [[../../docs/40-Execution/fmx-181-branch-protection-ruleset-activation-decision-record-2026-06-16]]
  - [[../../docs/10-Architecture/09-Decisions/ADR-0044-cicd-and-merge-policy]]
  - [[../../docs/30-Implementation/ci-and-review-process]]
---

# FMX-181 Branch Protection Ruleset Activation Plan

## Goal

Close FMX-181 by activating a GitHub repository ruleset mirror for `main`,
preserving the current docs-phase velocity, and documenting the staged path to
code-phase review/CODEOWNER enforcement.

## Steps

1. Claim FMX-181 in Linear and work from a clean
   `codex/fmx-181-branch-protection-ruleset-activation` worktree.
2. Source-check GitHub ruleset, branch-protection and CODEOWNERS behavior using
   current official docs and the live repository API.
3. Create an active repository ruleset mirror for the default branch while
   keeping the existing classic branch protection in place until verified.
4. Preserve raw Perplexity research, official source checks, synthesis and the
   accepted FMX-181 decision record in the vault.
5. Amend ADR-0044 and the CI/process front doors so future agents know:
   docs-phase ruleset mirror is active now; code-phase review/CODEOWNER gates
   activate only after real code paths and `quality`/`e2e`/`security` CI checks
   exist and have green evidence.
6. Validate the vault, open a PR and move Linear to review.

## HITL Decisions Resolved

Nico approved the implementation choices on 2026-06-16:

- Document FMX-181 as an ADR-0044 amendment, not a new ADR.
- Use phased activation: mirror now, stricter gates later.
- Migrate toward GitHub rulesets now, with classic protection kept until the
  mirror is verified.
- Give only Nico PR-bypass; no direct-push bypass expansion.
- Trigger Stage 1 review/CODEOWNER gates only after real code paths plus
  backing `quality`, `e2e` and `security` checks have green evidence.
