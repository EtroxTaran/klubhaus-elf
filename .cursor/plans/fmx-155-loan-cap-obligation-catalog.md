---
title: FMX-155 Loan Cap and Obligation Catalog Plan
status: current
tags: [plan, fmx-155, transfer, loan, regulations, decision]
created: 2026-06-16
updated: 2026-06-16
type: plan
binding: false
related:
  - [[../../docs/60-Research/loan-cap-and-obligation-catalog-2026-06-16]]
  - [[../../docs/40-Execution/fmx-155-loan-cap-obligation-catalog-decision-queue-2026-06-16]]
  - [[../../docs/10-Architecture/09-Decisions/ADR-0075-loan-orchestration-process-manager]]
  - [[../../docs/50-Game-Design/GD-0006-transfers]]
  - [[../../docs/50-Game-Design/regulations-and-compliance]]
---

# FMX-155 Loan Cap and Obligation Catalog Plan

## Goal

Close the Regulations data follow-up left by ADR-0075 for deterministic
`LoanCapVerdict` and `EvaluateObligationToBuy` without implementing code.

## Steps

1. Claim Linear FMX-155 and work in a clean `codex/fmx-155-*` worktree from
   current `origin/main`.
2. Preserve Perplexity-first research and targeted source checks under
   `docs/60-Research/raw-perplexity/`.
3. Synthesize a dated research note with real-world, comparable-game and DDD
   recommendations.
4. Record Nico's live decisions as an accepted/current decision queue.
5. Patch canonical vault homes:
   - ADR-0075 for the resolved Regulations data follow-up;
   - GD-0006 for accepted player-facing transfer/loan design;
   - `regulations-and-compliance.md` for the detailed Regulations-owned data
     catalog;
   - front-door maps/indexes and session handoff.
6. Run docs validation and status consistency checks, then open a PR linked to
   FMX-155.

## HITL Decisions Already Resolved

Nico selected the recommended packet on 2026-06-16:

- Layered `LoanRegulationProfile` profiles.
- Focused `ObligationConditionCatalog`.
- Regulations profile as the data owner.
- Static per-save rule snapshot.
- Exact inspectable clause visibility.

