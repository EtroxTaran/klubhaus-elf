---
title: GD-0008 Finance, Economy & Stadium
status: draft
tags: [game-design, gddr, finance, economy, accounting, fmx-13]
created: 2026-05-17
updated: 2026-05-27
type: game-design
binding: false
linear: FMX-13
related:
  - [[README]]
  - [[economy-system]]
  - [[stadium-and-campus]]
  - [[sponsorship-portfolio]]
  - [[mode-create-a-club-roguelite]]
  - [[../60-Research/club-economy-blueprint-2026-05-27]]
  - [[../20-Features/feature-club-economy-mvp-pillar]]
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
---

# GD-0008: Finance, Economy & Stadium

## Status

draft

All game-design decisions are reopened. This record captures the FMX-13 draft
direction and must be ratified by Nico before implementation authority.

## Date

2026-05-27

## Player experience goal

Money should feel like a real club constraint, not a decorative balance. The
player should understand the next few dangerous weeks, see how sporting
ambition creates liabilities, and recover from financial pressure through clear
choices before the run collapses.

## Decided / strong draft direction

- **Economy is an MVP pillar.** The first playable needs more than a
  post-match cash badge: it needs the finance spine that makes Create-a-Club
  Roguelite stakes credible.
- **Weekly ledger is the target tick.** Every week posts deterministic finance
  facts; monthly and season reports are projections.
- **Full accounting is the long-term model.** Cash, P&L, balance-sheet-like
  statements, amortisation, liabilities, receivables, reserves and compliance
  ratios are separate views over one Club-owned ledger.
- **Liquidity, profit and compliance are distinct.** A club can be cash-poor
  but profitable, profitable but non-compliant, or solvent while violating board
  risk policy.
- **Insolvency is staged.** Negative cash starts a crisis path: warning,
  overdraft/freeze, arrears, licence review and finally run end or control loss.
- **Transfer budget is not cash.** Transfer packages create immediate cash
  movements, scheduled liabilities, amortisation, wage obligations and future
  contingent events.
- **Country economy profiles are data.** Germany, England, France, Italy and
  Spain get profile-specific payment cadence, licence/compliance and economy
  rules, with an abstract fallback.
- **Ranges and formulas beat final constants.** This record defines invariants
  and calibration ranges; final numbers require soak tests and owner sign-off.
- **Progressive disclosure stays mandatory.** Quick shows runway and action
  cards; Standard shows KPIs and forecast; Expert shows accounting statements
  and schedules.
- **Investor rescue is not MVP.** It remains an SP-only future-scope
  monetisation decision, not a finance-system requirement.

## Open before approval

- Final thresholds for staged insolvency and licence loss.
- Which accounting read models appear in the very first playable.
- Country-profile ranges for lower tiers.
- Balance-test targets for healthy insolvency rate, wage ratio and runaway cash.
- Monetisation decision for Investor rescue, including legal and community risk.

## Rationale

The raw economy report and external sources both point to the same design
lesson: football finance is mostly timing, obligation and risk, not one bank
number. FMX's differentiator is the feedback loop between club building, sport,
fans, stadium and debt. A weekly ledger plus full accounting keeps that loop
auditable, testable and explainable.

## Consequences

Positive:

- Economy can carry Roguelite tension from the first playable onward.
- Transfer, stadium, sponsor and fan decisions get real cost surfaces.
- Expert depth can grow without changing the underlying model.
- Long-save balance tests can target ledger projections instead of UI strings.

Negative / constraints:

- More modelling work than a cash-only MVP.
- Requires Club Management contracts before code.
- Requires careful onboarding so first-run players are not buried in accounting.
- Final constants cannot be guessed; they need simulation evidence.

## Supersedes

None. This updates the reopened draft record; no approved decision is being
silently superseded.

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
- [[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]]

## Related

- Research: [[../60-Research/club-economy-blueprint-2026-05-27]] ·
  [[../60-Research/raw-perplexity/raw-club-economy-simulation]]
- System note: [[economy-system]]
- Feature: [[../20-Features/feature-club-economy-mvp-pillar]]
- Architecture: [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
- [[README]] — Game Design Log
