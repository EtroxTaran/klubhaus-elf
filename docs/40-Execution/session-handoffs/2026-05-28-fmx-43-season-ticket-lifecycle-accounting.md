---
title: FMX-43 Season-Ticket Lifecycle and Accounting Handoff
status: promoted
tags: [handoff, economy, season-tickets, accounting, fmx-43]
created: 2026-05-28
updated: 2026-05-28
type: handoff
binding: false
linear: FMX-43
related:
  - [[../../60-Research/season-ticket-lifecycle-and-accounting-2026-05-28]]
  - [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../../50-Game-Design/economy-system]]
  - [[../../50-Game-Design/fan-ecology]]
  - [[../../50-Game-Design/stadium-and-campus]]
  - [[../../30-Implementation/club-economy-commercial-contracts]]
---

# FMX-43 Season-Ticket Lifecycle and Accounting Handoff

## Goals

- Fully plan the next economy domain issue after FMX-42.
- Ground season-ticket lifecycle and accounting in current football-club and
  accounting practice.
- Keep the model realistic but fair: full accrual accounting, progressive UI
  and no individual supporter simulation.

## Completed

- Added [[../../60-Research/season-ticket-lifecycle-and-accounting-2026-05-28]]
  with source-backed synthesis for renewal, relocation, presale, waitlist,
  public-sale, no-show, seat-release, payment-plan and accounting patterns.
- Recommended fan-group lifecycle plus full accrual schedule as the draft
  model, rejecting both cash-only sliders and individual supporter
  marketplaces.
- Added draft contract surfaces:
  `SeasonTicketCampaign` and `SeasonTicketAccountingSchedule`.
- Refined [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  with lifecycle states, cohort policy, accrual rules, Quick / Standard /
  Expert season-ticket surfaces and acceptance scenarios.
- Refined [[../../50-Game-Design/economy-system]] with the distinction between
  cash receipt, receivables, deferred revenue, recognised revenue and
  credit/refund liabilities.
- Refined [[../../50-Game-Design/fan-ecology]] to publish renewal,
  utilisation, waitlist and compensation-sensitivity cohort outputs.
- Refined [[../../50-Game-Design/stadium-and-campus]] to expose
  season-ticket-eligible capacity, protected family/accessibility quotas and
  no-show/utilisation pressure.
- Updated the research/game-design maps, current-state hot memory, feature
  pillar and session-handoff index.

## Open Tasks

- Nico decision: default season-ticket share and discount ranges per country
  profile and club archetype.
- Nico decision: Quick-mode waitlist visibility.
- Nico decision: internal instalment receivable risk at MVP versus
  finance-partner default.
- Nico decision: how much cup priority / material-right accounting is visible
  before the cup-economy implementation beat.
- Nico decision: strictness of "use it or release it" without individual
  supporter modelling.

## Decisions Made

None ratified. All outputs remain draft planning. The recommended draft stance
is Option C: fan-group lifecycle plus full accrual schedule.

## Blockers

No implementation blocker in the docs vault. Gameplay approval and calibration
remain blocked on Nico decisions above.

## Durable Notes Updated

- [[../../60-Research/season-ticket-lifecycle-and-accounting-2026-05-28]]
- [[../../30-Implementation/club-economy-commercial-contracts]]
- [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
- [[../../50-Game-Design/economy-system]]
- [[../../50-Game-Design/fan-ecology]]
- [[../../50-Game-Design/stadium-and-campus]]
- [[../../20-Features/feature-club-economy-mvp-pillar]]
- [[../../60-Research/00-summary]]
- [[../../00-Index/Research-Map]]
- [[../../00-Index/Game-Design-Map]]
- [[../../50-Game-Design/README]]
- [[../../00-Index/Current-State]]

## Promotion Needed

- If Nico approves the direction, promote the relevant parts into approved
  GDDR / ADR status and keep calibration values in profile data, not prose.
- The next economy beat should likely cover cup-match revenue settlement or
  catering/merchandise contract presets, because FMX-43 now defines the
  season-ticket side of matchday inventory and accounting.
