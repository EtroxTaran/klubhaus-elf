---
title: Raw branch protection, CODEOWNER and ruleset source checks
status: raw
tags: [research, raw, source-check, ci, github, rulesets, branch-protection, codeowners, fmx-181]
created: 2026-06-16
updated: 2026-06-16
type: research
binding: false
linear: FMX-181
related:
  - [[../branch-protection-codeowner-activation-2026-06-16]]
  - [[raw-branch-protection-codeowner-rulesets-2026-06-16]]
  - [[../../30-Implementation/ci-and-review-process]]
  - [[../../30-Implementation/code-phase-dod-transition-contract]]
  - [[../../10-Architecture/09-Decisions/ADR-0044-cicd-and-merge-policy]]
  - [[../../40-Execution/fmx-181-branch-protection-ruleset-activation-decision-record-2026-06-16]]
---

# Raw branch protection, CODEOWNER and ruleset source checks

This note records the official-source and live-API checks used to canonize
FMX-181. It intentionally does not rely on blog/community guidance when official
GitHub docs cover the behavior.

## Official GitHub docs

| Source | Checked behavior | FMX-181 implication |
|---|---|---|
| [GitHub Docs - About rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets) | Rulesets work alongside branch protection; multiple rulesets can apply; active rulesets are visible to read-access users. Rule layering aggregates matching rules and the most restrictive version applies. | A ruleset mirror can be activated without deleting the classic `main` branch protection. Agents must check both if a PR is blocked. |
| [GitHub REST API - create repository ruleset](https://docs.github.com/en/rest/repos/rules?apiVersion=2022-11-28#create-a-repository-ruleset--parameters) | Repository rulesets support `active` enforcement, `~DEFAULT_BRANCH` conditions, `pull_request` bypass mode for branch rulesets, pull-request rules, required status checks, `required_linear_history`, deletion and non-fast-forward rules. | The FMX-181 API payload can exactly represent the Stage 0 docs-phase mirror. |
| [GitHub Docs - About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches) | Branch protection can require PR reviews, status checks, linear history and deletion/force-push protection. By default, branch protection restrictions do not apply to admins unless that setting is enabled. | Classic branch protection remains the safety net during migration; admin bypass explains why Nico is not locked out today. |
| [GitHub Docs - About CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners) | CODEOWNERS requests reviews automatically; enforcement requires "Require review from Code Owners"; when multiple code owners match, approval from any one owner is sufficient. A secure setup also owns the CODEOWNERS file itself. | CODEOWNERS file presence is not enough. FMX should hard-require code-owner review only when code paths and validated owners exist. |
| [GitHub Docs - Available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets) | Repository administrators can create/edit repository rulesets; available rules include pull request, required status checks, linear history and force-push/deletion protection. | Rulesets are the right long-term GitHub policy surface for FMX main/release/tag governance. |

## Live repository checks

Repository: `EtroxTaran/klubhaus-elf`

### Pre-activation state

- `main` classic branch protection existed.
- Required checks: `linear-id`, `docs-check`.
- Required PR review count: `0`.
- Code-owner review required: `false`.
- Dismiss stale reviews: `false`.
- Last-push approval required: `false`.
- Required linear history: `true`.
- Force pushes allowed: `false`.
- Deletions allowed: `false`.
- Admin enforcement: `false`.
- Repository rulesets before FMX-181: none.

### Ruleset created by FMX-181

- Ruleset ID: `17748728`
- Name: `FMX-181 main docs-phase protection mirror`
- URL: <https://github.com/EtroxTaran/klubhaus-elf/rules/17748728>
- Target: branch
- Condition: `~DEFAULT_BRANCH`
- Enforcement: `active`
- Bypass actor: Nico / `EtroxTaran` user ID `24548577`
- Bypass mode: `pull_request`
- Rules:
  - deletion blocked;
  - non-fast-forward blocked;
  - linear history required;
  - pull request required, squash merge method only, 0 approvals,
    code-owner review off, last-push approval off, review-thread resolution off;
  - required status checks `linear-id` and `docs-check`, both pinned to
    integration ID `15368`, strict up-to-date policy off.

### Post-activation verification

`gh api repos/EtroxTaran/klubhaus-elf/rules/branches/main` returned the
effective default-branch rules from ruleset `17748728`:

- `deletion`
- `non_fast_forward`
- `required_linear_history`
- `pull_request`
- `required_status_checks`

The classic `main` branch protection still reports `linear-id` and
`docs-check`, 0 approvals, no code-owner review, no force-push/deletion and
linear history.

## Canonical conclusions

- Stage 0 is live: GitHub ruleset mirror is active and classic branch
  protection remains in place.
- FMX must not add placeholder code checks to branch protection or the ruleset.
- FMX must not enable 1 approval or CODEOWNER review until real code paths,
  validated CODEOWNERS patterns and backing `quality`/`e2e`/`security`
  workflows exist and have green evidence.
- Once Stage 0 is proven over real PRs, a later issue may retire redundant
  classic protection and make the ruleset the primary source of truth.
