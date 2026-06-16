---
title: Branch Protection Ruleset and CODEOWNER Activation
status: current
tags: [research, ci, github, rulesets, branch-protection, codeowners, fmx-181]
created: 2026-06-16
updated: 2026-06-16
type: research
binding: false
linear: FMX-181
related:
  - [[raw-perplexity/raw-branch-protection-codeowner-rulesets-2026-06-16]]
  - [[raw-perplexity/raw-branch-protection-codeowner-source-checks-2026-06-16]]
  - [[../30-Implementation/ci-and-review-process]]
  - [[../30-Implementation/code-phase-dod-transition-contract]]
  - [[../30-Implementation/linear-task-tracking]]
  - [[../40-Execution/fmx-181-branch-protection-ruleset-activation-decision-record-2026-06-16]]
  - [[../10-Architecture/09-Decisions/ADR-0044-cicd-and-merge-policy]]
  - [[../10-Architecture/09-Decisions/ADR-0045-issue-first-worktree-workflow]]
---

# Branch Protection Ruleset and CODEOWNER Activation

FMX-181 activates the GitHub ruleset migration path for `main` without changing
today's docs-phase merge burden.

## Decision summary

Nico approved the staged approach on 2026-06-16:

- amend ADR-0044 instead of creating a new ADR;
- activate a GitHub repository ruleset mirror now;
- keep classic branch protection in place until the mirror has real PR evidence;
- allow only Nico as PR-bypass actor;
- defer 1 required approval and CODEOWNER review until code paths and backing
  `quality`/`e2e`/`security` CI checks exist and have green evidence.

## Current live state

Ruleset `17748728`, `FMX-181 main docs-phase protection mirror`, is active for
the default branch:

- PR required before updating `main`;
- branch deletion blocked;
- non-fast-forward / force-push blocked;
- linear history required;
- required checks: `linear-id` and `docs-check`;
- pull-request approvals: `0`;
- CODEOWNER review: off;
- Nico user ID `24548577` has `pull_request` bypass only;
- classic `main` branch protection remains present as the safety net.

## Staged activation

| Stage | Trigger | Ruleset/protection posture | Review posture |
|---|---|---|---|
| Stage 0 - docs mirror | Active now, FMX-181 | Ruleset mirrors current docs-phase protection; classic branch protection remains. Required checks are `linear-id` and `docs-check`. | 0 required reviews; no CODEOWNER review. |
| Stage 1 - code evidence | Real app/package code paths exist and real `quality`, `e2e`, `security` workflows run green as non-required evidence. | Add code checks as reporting/non-required first. Do not make placeholder contexts required. | CODEOWNERS patterns can be validated, but hard review enforcement waits. |
| Stage 2 - code protection | Green evidence proves the code checks stable on real PRs and Nico confirms activation. | Ruleset becomes the preferred source for required code checks. Classic branch protection may be simplified or retired in a separate tracked issue. | Require 1 approval plus CODEOWNER review for code-owned paths. |
| Stage 3 - scaled team/release governance | Multi-lead or release/tag governance needs appear. | Add layered branch/tag/release rulesets. | Domain/team CODEOWNERS can replace the solo-lead default where accepted. |

## Best-practice rationale

Rulesets are a better long-term policy surface than only classic branch
protection because they can be layered, can start without replacing existing
protection and are visible to repository readers. The migration risk is
complexity: if several rulesets and classic protection overlap, the most
restrictive matching rule applies. FMX therefore keeps Stage 0 simple and
documents the live ruleset ID.

CODEOWNERS should not be treated as enforcement by itself. GitHub only blocks
merges on code-owner approval when branch protection or a ruleset requires code
owner review. FMX already has `.github/CODEOWNERS`; FMX-181 does not turn it
into a hard gate because the repository is still docs-vault-only and the code
paths that ADR-0044 wants protected do not exist.

## Operational cautions

- Check names are exact strings. If `docs-check`, `linear-id`, `quality`, `e2e`
  or `security` are renamed, branch/ruleset settings must be updated in the same
  operational change.
- Ruleset debugging requires checking both rulesets and classic branch
  protection until classic protection is retired.
- A future Stage 2 issue must source-check GitHub docs again before editing the
  ruleset, because ruleset UI/API behavior can change.
- Any move to require code-owner review must verify eligible owners have write
  access and that the CODEOWNERS file/directory is itself owned.

## Related evidence

- Raw Perplexity discovery:
  [[raw-perplexity/raw-branch-protection-codeowner-rulesets-2026-06-16]]
- Official source checks and live API snapshot:
  [[raw-perplexity/raw-branch-protection-codeowner-source-checks-2026-06-16]]
- Accepted FMX-181 decision record:
  [[../40-Execution/fmx-181-branch-protection-ruleset-activation-decision-record-2026-06-16]]
