---
title: FMX-181 Branch Protection Ruleset Activation Decision Record
status: current
tags: [execution, decision-record, ci, github, rulesets, branch-protection, codeowners, accepted, fmx-181]
created: 2026-06-16
updated: 2026-06-16
type: decision-record
binding: false
linear: FMX-181
related:
  - [[../60-Research/branch-protection-codeowner-activation-2026-06-16]]
  - [[../60-Research/raw-perplexity/raw-branch-protection-codeowner-rulesets-2026-06-16]]
  - [[../60-Research/raw-perplexity/raw-branch-protection-codeowner-source-checks-2026-06-16]]
  - [[../30-Implementation/ci-and-review-process]]
  - [[../30-Implementation/code-phase-dod-transition-contract]]
  - [[../30-Implementation/linear-task-tracking]]
  - [[../10-Architecture/09-Decisions/ADR-0044-cicd-and-merge-policy]]
---

# FMX-181 Branch Protection Ruleset Activation Decision Record

## Context

FMX-181 asked whether branch protection and CODEOWNERS enforcement should move
from the current docs-phase setup toward GitHub rulesets and staged code-phase
review gates.

The issue body still referenced older D-002-era context names. FMX-175 already
settled the future code context names as `quality`, `e2e` and `security`, so
FMX-181 treats `cursor-smoke`, `configured` and standalone `lighthouse` as
historical vocabulary only.

## Decisions Recorded

| ID | Question | Options considered | Nico decision |
|---|---|---|---|
| D1 | Documentation shape | New ADR; ADR-0044 amendment; implementation note only. | **ADR-0044 amendment.** FMX-181 changes enforcement mechanics for the existing merge policy. |
| D2 | Activation cadence | Enable strict review immediately; phased activation; defer all. | **Phased activation.** Mirror now, hard code gates only after evidence. |
| D3 | GitHub policy surface | Stay classic branch protection; migrate to rulesets; custom bot. | **Migrate toward GitHub rulesets now.** Use repository rulesets as the future source. |
| D4 | Migration scope | Replace classic protection now; active mirror first; docs-only note. | **Active mirror first.** Keep classic branch protection until verified by real PRs. |
| D5 | Bypass posture | No bypass; Nico PR bypass only; broad admin/app bypass. | **Nico PR bypass only.** No direct-push bypass expansion. |
| D6 | Stage 1 trigger | Time-boxed date; first code PR; real code paths plus green backing checks. | **Real code paths plus backing `quality`/`e2e`/`security` green evidence.** |

## Accepted Contract

- `main` has an active GitHub repository ruleset mirror:
  <https://github.com/EtroxTaran/klubhaus-elf/rules/17748728>.
- The ruleset targets the default branch and mirrors the docs-phase protection:
  PR required, deletion and force-push blocked, linear history required and
  required checks `linear-id` + `docs-check`.
- Classic branch protection remains in place until a later tracked issue proves
  the ruleset stable and retires redundant classic settings.
- Nico is the only configured bypass actor and only with PR-bypass mode.
- Docs/low-risk PRs still require 0 approvals and no CODEOWNER review.
- Code-phase hardening requires a later tracked change after real code paths,
  validated CODEOWNERS patterns and stable `quality`/`e2e`/`security` checks
  exist.

## Evidence

- Synthesis:
  [[../60-Research/branch-protection-codeowner-activation-2026-06-16]]
- Raw Perplexity:
  [[../60-Research/raw-perplexity/raw-branch-protection-codeowner-rulesets-2026-06-16]]
- Official source checks and live API verification:
  [[../60-Research/raw-perplexity/raw-branch-protection-codeowner-source-checks-2026-06-16]]

## Follow-up

- After several successful PRs under ruleset `17748728`, open a small issue to
  decide whether to retire redundant classic branch protection settings.
- Stage 2 code-phase hardening is blocked until code bootstrap creates real
  app/package paths, scripts and CI workflows with green evidence.
