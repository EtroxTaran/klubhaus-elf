---
title: Raw branch protection, CODEOWNER and ruleset research
status: raw
tags: [research, raw, perplexity, ci, github, rulesets, branch-protection, codeowners, fmx-181]
created: 2026-06-16
updated: 2026-06-16
type: research
binding: false
linear: FMX-181
related:
  - [[../branch-protection-codeowner-activation-2026-06-16]]
  - [[raw-branch-protection-codeowner-source-checks-2026-06-16]]
  - [[../../30-Implementation/ci-and-review-process]]
  - [[../../30-Implementation/code-phase-dod-transition-contract]]
  - [[../../10-Architecture/09-Decisions/ADR-0044-cicd-and-merge-policy]]
  - [[../../40-Execution/fmx-181-branch-protection-ruleset-activation-decision-record-2026-06-16]]
---

# Raw branch protection, CODEOWNER and ruleset research

This note preserves the Perplexity discovery pass for FMX-181. It is raw input,
not canonical policy. The canonical policy is the synthesis and ADR-0044
amendment after source checking.

## Query

For a small solo-lead GitHub repository that is docs-vault-only today and will
later enter a code phase, research current best practices for migrating from
classic branch protection to GitHub repository rulesets while preserving
docs-only velocity. Context: `main` currently requires PRs, `docs-check` and
Linear issue status checks, blocks force pushes/deletions, but has 0 required
reviews and no CODEOWNERS enforcement. We want to activate a ruleset mirror now,
keep classic branch protection until verified, allow only the lead owner
PR-bypass, and later phase in one approval plus CODEOWNER reviews once real code
paths and `quality`/`e2e`/`security` CI checks exist and have green evidence.

## Perplexity findings

- Rulesets and classic branch protection can run together. Multiple rulesets
  and protection rules are additive; the most restrictive matching rule wins.
- A ruleset mirror is the safest migration shape: keep the classic branch
  protection in place, create a default-branch ruleset matching the current
  docs-phase protection, then remove redundant classic settings only after
  observed stability.
- If GitHub Enterprise `evaluate` mode is available, use it before enforcement.
  In this repository, active enforcement was chosen because the mirror is
  minimal, the current classic protection stays in place and Nico has PR-only
  bypass.
- Docs-phase should keep only proven required checks:
  `docs-check` and `linear-id`.
- Code-phase gates should be staged. First create the real scripts/workflows,
  run them as reporting/non-required checks, prove green behavior on real PRs,
  then make `quality`, `e2e` and `security` required.
- Reviews and CODEOWNER review should not be required while the repository is
  docs-vault-only and solo-led. Add 1 required approval and CODEOWNER review
  only when code paths exist and CODEOWNERS patterns are validated.
- CODEOWNERS pitfalls: missing default owner, owners without write access,
  overly broad patterns, and enabling code-owner review before enough eligible
  reviewers exist.
- Required check names are brittle. Renaming a workflow job can block merges
  until the ruleset/protection entry is updated.

## Recommended staged policy from discovery

| Stage | Enforcement | Required checks | Reviews | CODEOWNERS | Notes |
|---|---|---|---|---|---|
| Stage 0 docs mirror | Active ruleset mirror plus classic protection kept | `docs-check`, `linear-id` | 0 | Not required | Current FMX-181 activation. |
| Stage 1 code bootstrap | Add real code workflows as non-required/reporting first | Existing docs checks plus non-required `quality`/`e2e`/`security` evidence | 0 unless a code PR touches sensitive path by manual review | CODEOWNERS file validated but not yet hard gate | Prove green evidence before hardening. |
| Stage 2 code protection | Ruleset becomes primary source after classic protection is retired | `quality`, `e2e`, `security` plus traceability checks | 1 | Required for code-owned paths | Activation requires code paths, stable checks and Nico approval trail. |
| Stage 3 scale-up | Layer additional org/release/tag rulesets as needed | Context-specific | Possibly 2 | Domain owners/teams | Future multi-lead/team mode, not current scope. |

## Source-quality notes

- Perplexity cited official GitHub docs and also blogs, community discussions
  and Stack Overflow. The canonical FMX wording uses official GitHub docs and
  live API verification only.
- The source-check note records the official documentation and the exact live
  ruleset created for this issue.
