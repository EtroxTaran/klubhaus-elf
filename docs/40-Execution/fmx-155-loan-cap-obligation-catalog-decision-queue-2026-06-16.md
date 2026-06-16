---
title: FMX-155 Loan Cap and Obligation Catalog Decision Queue
status: current
tags: [execution, decision-queue, transfer, loan, regulations, obligation-to-buy, accepted, fmx-155]
created: 2026-06-16
updated: 2026-06-16
type: decision-queue
binding: false
linear: FMX-155
related:
  - [[../60-Research/loan-cap-and-obligation-catalog-2026-06-16]]
  - [[../60-Research/raw-perplexity/raw-loan-cap-obligation-catalog-2026-06-16]]
  - [[../60-Research/raw-perplexity/raw-loan-cap-obligation-source-checks-2026-06-16]]
  - [[../10-Architecture/09-Decisions/ADR-0075-loan-orchestration-process-manager]]
  - [[../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]]
  - [[../50-Game-Design/GD-0006-transfers]]
  - [[../50-Game-Design/regulations-and-compliance]]
---

# FMX-155 Loan Cap and Obligation Catalog Decision Queue

## Context

FMX-155 closes the Regulations data follow-up left by accepted
[[../10-Architecture/09-Decisions/ADR-0075-loan-orchestration-process-manager]].
ADR-0075 already assigns Transfer as the loan saga owner and Regulations as the
loan-cap verdict owner, but it left the concrete domestic cap profile and
obligation-condition catalog open.

Live workflow:

- Linear FMX-155 was verified unclaimed in `Backlog` on 2026-06-16.
- The issue was moved to `In Progress` before branch/worktree edits.
- Branch: `codex/fmx-155-loan-cap-obligation-catalog`.

## Decisions asked and answered

| ID | Question | Options presented | Nico decision |
|---|---|---|---|
| D1 | How granular should loan-cap parameters be? | Layered profiles; global-only plus notes; fully legalistic rules engine. | **Layered profiles.** Global FIFA-style baseline plus domestic overlays per MVP profile and fallback. |
| D2 | How deep should obligation-to-buy conditions be? | Focused set; broad clause DSL; fixed templates only. | **Focused set.** Appearances/minutes, promotion/survival, qualification and fixed option window; shallow `single` / `allOf` / `anyOf` only. |
| D3 | Who owns the data shape? | Regulations profile; Transfer-local terms; shared kernel. | **Regulations profile.** Regulations owns `LoanRegulationProfile` and condition catalog; Transfer owns `LoanAgreement` and calls the verdict/evaluator. |
| D4 | How should rule evolution work? | Static snapshot; live legal updates; season-only scheduled changes. | **Static snapshot.** Save creation snapshots the active profile/catalog; no live legal update feed. |
| D5 | How visible are clause conditions? | Exact inspectable; summary-only; hidden expert-only. | **Exact inspectable.** Quick uses badges; Standard/Expert expose exact triggers, profile version and source facts. |

## Accepted packet

- `LoanRegulationProfile` is a Regulations-owned data aggregate/profile layered
  from global baseline plus domestic overlays.
- `LoanCapVerdict` returns pass/fail plus profile version, counted/exempt
  breakdown and stable reason codes.
- MVP profiles: England-like strict, Germany-like development, France-like
  asymmetric, Italy-like transitional, Spain-like balanced and abstract
  fallback. All are FMX fictional data profiles, not legal clones.
- `ObligationConditionCatalog` supports:
  `minimumAppearances`, `minimumMinutes`, `teamPromoted`,
  `teamAvoidedRelegation`, `teamQualifiedForCompetitionClass`,
  `fixedOptionWindow`.
- Conditions may be `single` or one-level `allOf` / `anyOf`; nested DSL,
  xG/KPI, morale, finance or custom script triggers are excluded for v1.
- `EvaluateObligationToBuy` is pure and deterministic over logged Match,
  League and Calendar facts plus the loan/rule snapshot. Missing/ambiguous
  facts produce `notTriggered` plus audit reason, never an auto-buy.
- Clause visibility is exact and inspectable in Standard/Expert UI.

## Evidence

- Raw Perplexity:
  [[../60-Research/raw-perplexity/raw-loan-cap-obligation-catalog-2026-06-16]]
- Source checks:
  [[../60-Research/raw-perplexity/raw-loan-cap-obligation-source-checks-2026-06-16]]
- Synthesis:
  [[../60-Research/loan-cap-and-obligation-catalog-2026-06-16]]

## Follow-up

No further FMX-155 decision is open. Remaining work is calibration, legal review
and code-phase contract tests:

- FMX-52 / GD-0043 for playing-time thresholds, loan-quality weights and
  penalty magnitudes.
- Legal/IP review before public claims of real-world domestic-rule equivalence.
- Implementation-time Zod/contract tests for `LoanRegulationProfile`,
  `LoanCapVerdict` and `EvaluateObligationToBuy`.

