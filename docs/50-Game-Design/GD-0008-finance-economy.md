---
title: GD-0008 Finance, Economy & Stadium
status: draft
tags: [game-design, gddr, finance, economy, accounting, commercial, fmx-13, fmx-41]
created: 2026-05-17
updated: 2026-05-28
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
  - [[../60-Research/club-economy-impact-map-and-commercial-contracts-2026-05-28]]
  - [[GD-0022-economy-commercial-impact-and-contracts]]
  - [[../20-Features/feature-club-economy-mvp-pillar]]
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  - [[../30-Implementation/club-economy-commercial-contracts]]
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
- **Commercial impact needs a first-class draft layer.** FMX-41 extends this
  GDDR through [[GD-0022-economy-commercial-impact-and-contracts]]: fan demand,
  tickets, season tickets, catering, merchandise, sponsorship, cup games and
  fan-service campaigns feed the same Club Management ledger.
- **Investor is clean SP cash if activated.** Nico rejected balance penalties
  for the real-money Investor grant. It is a singleplayer-only cash entitlement:
  no debt, no owner control, no fan backlash, no multiplayer advantage. It still
  does not repair structural overspending.

## Open before approval

- Final thresholds for staged insolvency and licence loss.
- Which accounting read models appear in the very first playable.
- Country-profile ranges for lower tiers.
- Balance-test targets for healthy insolvency rate, wage ratio and runaway cash.
- Investor activation timing and platform/legal review.
- Commercial contract boundary approval via
  [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]].

## FMX-41 commercial impact amendment

FMX-41 adds the commercial cause layer that was missing from the accounting
spine:

| Commercial input | Game-design consequence |
|---|---|
| Fan segment mix | Attendance stability, season-ticket renewal, per-capita catering, merch propensity and sponsor fit differ by club. |
| Season-ticket policy | Early cash and loyalty versus discounted future yield and lost top-match upside. |
| Rival/top match profile | Single-ticket surcharge, catering/merch spikes, security cost and fan-trust risk. |
| Cup fixture profile | Prize, media, gate sharing, travel, sponsor bonuses and fixture-congestion costs. |
| Catering model | In-house upside/risk versus concession stability or guarantee/share hybrids. |
| Merchandise model | Own inventory, partner licence, kit-supplier guarantee, royalty and campaign-drop risk. |
| Fan-service campaign | Paid loyalty/atmosphere lever with logistics, sponsor and incident risk. |
| Investor entitlement | Clean SP cash grant with ledger provenance and unchanged weekly economics. |

The player-facing rule is simple: every commercial decision must be readable in
Quick mode and inspectable in Expert mode, but both modes use the same ledger
facts.

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
  [[../60-Research/club-economy-impact-map-and-commercial-contracts-2026-05-28]] ·
  [[../60-Research/raw-perplexity/raw-club-economy-simulation]]
- System note: [[economy-system]]
- Commercial GDDR: [[GD-0022-economy-commercial-impact-and-contracts]]
- Feature: [[../20-Features/feature-club-economy-mvp-pillar]]
- Architecture: [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]] ·
  [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
- [[README]] — Game Design Log
