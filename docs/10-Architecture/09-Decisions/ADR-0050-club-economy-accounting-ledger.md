---
title: ADR-0050 Club Economy Accounting Ledger
status: draft
tags: [adr, architecture, economy, accounting, club-management, commercial, cup, competition, fmx-13, fmx-41, fmx-45]
created: 2026-05-27
updated: 2026-05-28
type: adr
binding: false
supersedes:
superseded_by:
related:
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[../../50-Game-Design/GD-0008-finance-economy]]
  - [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../../50-Game-Design/economy-system]]
  - [[../../60-Research/club-economy-blueprint-2026-05-27]]
  - [[../../60-Research/club-economy-impact-map-and-commercial-contracts-2026-05-28]]
  - [[../../60-Research/cup-and-competition-revenue-profiles-2026-05-28]]
  - [[../../30-Implementation/club-economy-accounting-ledger]]
  - [[../../30-Implementation/club-economy-commercial-contracts]]
  - [[ADR-0058-club-economy-commercial-impact-boundary]]
---

# ADR-0050: Club Economy Accounting Ledger

## Status

draft

## Date

2026-05-27

## Context

FMX-13 promotes the club-economy blueprint from raw research into the planning
baseline. Nico selected a high-fidelity target: Economy as an MVP pillar, weekly
ledger, full accounting, staged insolvency crisis, country-specific profiles and
progressive UI.

FMX-41 extends the ledger target with the commercial impact graph: ticketing,
season tickets, catering, merchandise, sponsorship, cup-game settlement,
fan-service events and singleplayer Investor cash grants. ADR-0058 is the draft
boundary proposal for those commercial contracts.

FMX-45 refines the cup-game settlement line. The ledger must distinguish
competition cash, earned receivables, travel/security costs and non-spendable
future cup EV. Elimination shock updates forecasts; it does not become a cash
ledger loss unless a previously recorded receivable is reversed.

The existing DDD map already places finances, infrastructure, sponsors, board
and fans in the **Club Management** bounded context. The missing architecture
decision is how these facts are represented and exchanged without letting
finance become cross-context glue.

## Options Considered

- **Single cash balance.** Simple, but cannot represent transfer instalments,
  amortisation, receivables, compliance ratios or liquidity-vs-profit tension.
- **UI-only accounting projections.** Keeps persistence simple, but would make
  finance rules hard to audit and easy to diverge across screens.
- **Club-owned accounting ledger.** Append-only finance facts inside Club
  Management; accounting statements and KPIs are projections.

## Decision

Use a Club Management-owned accounting ledger as the source for all finance
facts.

Key rules:

- The authoritative tick is weekly.
- Ledger entries are append-only domain facts.
- Cashflow, P&L, balance-sheet-like summaries, amortisation schedules,
  liabilities, budget pots and compliance ratios are projections derived from
  the ledger plus Club-owned policy tables.
- Club Management owns finance, budget, sponsor, stadium economics, board
  pressure and insolvency stage.
- Other contexts never write finance tables directly. They emit or request
  domain facts through public commands/events.
- Money values are integer minor units; ratios use basis points.
- Country-specific economy rules are data profiles, not branches scattered
  across handlers.

## Public contract direction

Draft commands:

- `PostFinanceLedgerEntry`
- `AdvanceClubEconomyWeek`
- `SetBudgetPolicy`
- `AcceptSponsorContract`
- `ScheduleFacilityProject`
- `RequestCrisisAction`

Draft events:

- `FinanceLedgerEntryPosted`
- `EconomyWeekAdvanced`
- `BudgetThresholdBreached`
- `InsolvencyStageChanged`
- `SponsorContractActivated`
- `SponsorConditionBreached`
- `FacilityProjectCommitted`
- `LeagueLicenceFinancialCheckFailed`
- `MatchdayCommercialSettlementPosted`
- `InvestorCashGrantPosted`
- `CompetitionPrizeReceivableRecorded`
- `CompetitionPrizeCashReceived`
- `CupGateShareSettled`
- `CupMediaFacilityFeeSettled`
- `CupTravelCostPosted`
- `CupSecurityCostPosted`
- `CupSponsorBonusTriggered`
- `CupMerchandiseSpikePosted`
- `CupNeutralVenueAllocationSettled`
- `CupForecastUpdated`
- `CupEliminationForecastShockRecorded`

Draft read models:

- `ClubEconomySnapshot`
- `WeeklyCashflowStatement`
- `AccountingStatement`
- `LiabilitySchedule`
- `BudgetEnvelope`
- `InsolvencyCrisisState`
- `LeagueEconomyProfile`
- `CommercialForecastSnapshot`
- `CommercialContractPortfolio`
- `MatchdayCommercialSettlement`
- `CupRunRevenueForecast`

## Rationale

The ledger model supports the player-facing design without sacrificing DDD
boundaries:

- Weekly cash tension is explicit and auditable.
- Expert accounting depth is possible without polluting every context.
- Transfers, matchday operations and league payments remain owned by their
  domains but become finance facts only through Club Management contracts.
- Staged insolvency can be replayed and tested as a state machine.
- Future country/community profiles can tune economy without rewriting core
  finance handlers.

## Consequences

Positive:

- One canonical finance truth per club.
- Strong audit trail for economy balance, replays and future multiplayer trust.
- Easier long-soak balance tests for wage inflation, debt and insolvency rates.
- UI can expose Quick / Standard / Expert depth from the same read models.

Negative:

- Higher upfront modelling cost than a cash-only MVP.
- Requires explicit event contracts from Transfer, Match, League and Club
  subsystems before implementation.
- Balance tests become mandatory before any final constants are accepted.

## Supersedes

None

## Related Docs

- [[../../60-Research/club-economy-blueprint-2026-05-27]]
- [[../../60-Research/club-economy-impact-map-and-commercial-contracts-2026-05-28]]
- [[../../60-Research/cup-and-competition-revenue-profiles-2026-05-28]]
- [[../../50-Game-Design/GD-0008-finance-economy]]
- [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
- [[../../50-Game-Design/economy-system]]
- [[../../30-Implementation/club-economy-accounting-ledger]]
- [[../../30-Implementation/club-economy-commercial-contracts]]
- [[ADR-0058-club-economy-commercial-impact-boundary]]
- [[ADR-0019-modular-monolith-ddd]]
- [[ADR-0027-postgres-data-model]]
- [[ADR-0028-postgres-transactional-outbox]]
