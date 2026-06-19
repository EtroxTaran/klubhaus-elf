---
title: FMX-161 ICU-MF1 Risk Register Reconciliation Plan
status: current
tags: [plan, fmx-161, i18n, locale, risk-register, paraglide, intl]
created: 2026-06-18
updated: 2026-06-18
type: plan
binding: false
linear: FMX-161
related:
  - [[../../docs/10-Architecture/11-Risks]]
  - [[../../docs/10-Architecture/09-Decisions/ADR-0094-i18n-stack-and-locale-scope]]
  - [[../../docs/60-Research/icu-mf1-risk-register-reconciliation-2026-06-18]]
---

# FMX-161 ICU-MF1 Risk Register Reconciliation Plan

## Goal

Reconcile the stale `11-Risks` ICU-MF1 row with ADR-0094's 2026-06-09
validation note: the headline ICU-MF1 risk is resolved for the MVP locale scope,
while first Slavic/case-heavy locale support remains a reopen gate.

## Scope

- Preserve Perplexity-first discovery and source checks.
- Keep ADR-0094 as the decision source; do not reopen the i18n stack choice.
- Update the risk register and decision front doors to stop saying ICU-MF1
  validation is still broadly pending for the MVP locale set.
- Surface Nico's confirmation question for near-term PL/CZ/RU or other
  case-heavy locale expansion.

## Execution

1. Claim FMX-161 and create `codex/fmx-161-icu-mf1-risk-reconciliation`.
2. Source-check Paraglide variants/formatting, ICU plugin posture,
   `Intl.PluralRules`, FormatJS/CLDR plural categories and the current vault
   locale scope.
3. Save raw research, source checks, synthesis, decision queue and handoff.
4. Patch `11-Risks`, Decision Log, Current State and research front doors with
   the resolved-for-MVP plus residual-gate wording.
5. Validate with `pnpm docs:check`, `node scripts/status-consistency-check.mjs`
   and `git diff --check`.

## Acceptance

- `11-Risks` no longer says the MVP i18n stack is blocked on broad ICU-MF1
  validation.
- The remaining exposure is explicitly the first Slavic/case-heavy locale or an
  ICU-syntax authoring migration.
- Decision Log and Current State point at the FMX-161 packet.
- Nico can answer the residual locale-scope question before the PR is marked
  ready.
