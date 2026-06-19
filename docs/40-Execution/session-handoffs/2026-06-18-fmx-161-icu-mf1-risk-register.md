---
title: "Session handoff: FMX-161 ICU-MF1 risk register reconciliation"
status: current
tags: [handoff, fmx-161, i18n, locale, risk-register, paraglide, intl]
created: 2026-06-18
updated: 2026-06-18
type: handoff
binding: false
linear: FMX-161
related:
  - [[../../60-Research/icu-mf1-risk-register-reconciliation-2026-06-18]]
  - [[../fmx-161-icu-mf1-risk-register-decision-queue-2026-06-18]]
  - [[../../10-Architecture/11-Risks]]
  - [[../../10-Architecture/09-Decisions/ADR-0094-i18n-stack-and-locale-scope]]
---

# Session handoff: FMX-161 ICU-MF1 risk register reconciliation

## Goals

Reconcile the stale `i18n ICU-MF1 validation pending` risk row with ADR-0094's
resolved-for-MVP validation note and preserve the residual first
Slavic/case-heavy locale gate.

## Completed

- Saved raw Perplexity discovery, source checks, synthesis and decision queue.
- Source-checked Paraglide variants/formatting, ICU plugin posture,
  FormatJS/CLDR plural categories, MDN `Intl.PluralRules` and local runtime
  category sets.
- Updated the risk register and decision front doors to say the broad risk is
  resolved for MVP while the residual locale gate remains active.
- Captured the nuance that FR/ES/IT can expose `many` categories in current
  CLDR/Intl data, so the control is catalog QA, not one/other-only assumptions.

## Open Tasks

- Nico should answer FMX-161 D1-D4 before the PR is marked ready.
- If Nico wants PL/CZ/RU or another case-heavy locale near-term, keep the
  residual risk active and run an i18n spike before the locale migration.
- Optional follow-up: clean stale body/open-question wording inside ADR-0094
  without changing the accepted decision.

## Decisions Made

None new. FMX-161 applies ADR-0094's accepted validation note to a stale risk
register/front-door line.

## Blockers

Nico confirmation is needed for near-term locale scope before treating the row
as fully closed rather than residual-active.

## Durable Notes Updated

- [[../../60-Research/raw-perplexity/raw-icu-mf1-risk-register-reconciliation-2026-06-18]]
- [[../../60-Research/raw-perplexity/raw-icu-mf1-risk-register-source-checks-2026-06-18]]
- [[../../60-Research/icu-mf1-risk-register-reconciliation-2026-06-18]]
- [[../fmx-161-icu-mf1-risk-register-decision-queue-2026-06-18]]
- [[../../10-Architecture/11-Risks]]
- [[../../00-Index/Decision-Log]]
- [[../../00-Index/Current-State]]
- [[../../00-Index/Research-Map]]
- [[../../60-Research/00-summary]]
- [[../../60-Research/raw-perplexity/README]]

## Promotion Needed

No ADR promotion is needed. ADR-0094 remains the decision source. If D1-D3 are
approved, mark the PR ready; if a Slavic/case-heavy locale is near-term, keep the
residual risk active and add an i18n spike task.
