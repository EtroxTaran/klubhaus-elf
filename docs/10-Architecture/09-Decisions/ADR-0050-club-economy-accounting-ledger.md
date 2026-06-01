---
title: ADR-0050 Club Economy Accounting Ledger
status: accepted
tags: [adr, architecture, economy, accounting, club-management, commercial, cup, competition, matchday, catering, merchandise, operations, fmx-13, fmx-32, fmx-41, fmx-45, fmx-46, fmx-47, accepted]
created: 2026-05-27
updated: 2026-06-01
type: adr
binding: true
supersedes:
superseded_by:
related:
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[ADR-0058-club-economy-commercial-impact-boundary]]
  - [[ADR-0061-club-management-sub-aggregate-audit]]
  - [[ADR-0062-audience-and-atmosphere-context]]
  - [[../../50-Game-Design/GD-0008-finance-economy]]
  - [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../../50-Game-Design/economy-system]]
  - [[../../60-Research/club-economy-blueprint-2026-05-27]]
  - [[../../60-Research/club-economy-impact-map-and-commercial-contracts-2026-05-28]]
  - [[../../60-Research/cup-and-competition-revenue-profiles-2026-05-28]]
  - [[../../60-Research/matchday-operating-costs-and-risk-cost-settlement-2026-05-29]]
  - [[../../60-Research/club-management-sub-aggregate-audit-2026-05-28]]
  - [[../../30-Implementation/club-economy-accounting-ledger]]
  - [[../../30-Implementation/club-economy-commercial-contracts]]
---

# ADR-0050: Club Economy Accounting Ledger

## Status

accepted

## Ratification note

Concurrent ratification with FMX-32 audit (ADR-0061 + ADR-0062)
on 2026-05-28 by Nico. The FMX-32 audit refines the Club Management
ownership scope: **stadium economics** moves to the new **Stadium
Operations** bounded context (FMX-32 Stadium = Option C);
**commercial sub-aggregate ownership** (sponsor / catering /
merchandise / hospitality contracts + ticketing & commercial
settlement) moves to the new **CommercialPortfolio** bounded
context (FMX-32 CommercialPortfolio = Option C, includes
Ticketing & Settlement as Option D sub-Aggregate); **fan signals**
(segment demand + atmosphere + trust state + politics events) move
to the new **Audience & Atmosphere** bounded context (ADR-0062).
Club Management remains the **sole writer of finance ledger
entries** + owner of budget envelopes + board pressure + insolvency
state; all four FMX-32 contexts (Stadium Operations, Audience &
Atmosphere, CommercialPortfolio with Ticketing & Settlement nested)
emit fact events that Club Management consumes via Customer-
Supplier + ACL per Vernon canonical pattern. §Decision below is
amended accordingly.

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

FMX-46 refines the matchday operating-cost line. The ledger must be able to
post separate stewarding, security, policing-style contribution, medical,
cleaning/waste, energy, temporary staff, officials, pitch recovery,
insurance/compliance, damage reserve, sanction, sector-closure, ghost-match,
away-fan restriction and alcohol restriction entries. CommercialPortfolio owns
the operating settlement profile and emits settlement events; Club Management
remains the sole ledger writer.

The accepted DDD map now keeps finance ledger truth in **Club Management**
while Stadium Operations, Audience & Atmosphere and CommercialPortfolio own
their operational, supporter and commercial facts. The missing architecture
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
- Club Management owns the **finance ledger** (sole writer), budget envelopes,
  board pressure and insolvency stage. **Stadium economics** is owned by the
  Stadium Operations BC (FMX-32, ADR-0061); **sponsor + catering +
  merchandise + hospitality contracts + ticketing & commercial settlement**
  are owned by the CommercialPortfolio BC (FMX-32, ADR-0061); **fan signals**
  (segment demand, atmosphere, trust state, politics events) are owned by the
  Audience & Atmosphere BC (FMX-32, ADR-0062). All four contexts emit fact
  events consumed by Club Management via Customer-Supplier + ACL; Club
  Management posts the resulting ledger entries.
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
- `MatchdayOperatingCostForecasted`
- `MatchdayStewardingCostPosted`
- `MatchdaySecurityCostPosted`
- `MatchdayPoliceContributionPosted`
- `MatchdayMedicalEmergencyCostPosted`
- `MatchdayCleaningWasteCostPosted`
- `MatchdayEnergyCostPosted`
- `MatchdayTemporaryStaffCostPosted`
- `MatchdayOfficialsCostPosted`
- `PitchRecoveryCostPosted`
- `MatchdayInsuranceComplianceCostAllocated`
- `MatchdayDamageReserveAdjusted`
- `MatchdaySanctionFinePosted`
- `SectorClosureRevenueImpactRecorded`
- `GhostMatchSettlementRecorded`
- `AwayFanRestrictionApplied`
- `AlcoholRestrictionApplied`
- `RiskTierReclassified`
- `MitigationActionSettled`
- `MatchdayCateringSettled` (FMX-47: revenue + COGS + labour + waste lines)
- `CateringStockoutRecorded` (FMX-47)
- `CateringWastePosted` (FMX-47)
- `MerchandiseStockPlanCommitted` (FMX-47)
- `MerchandiseSalesSettled` (FMX-47: full-price + spike lines)
- `MerchandiseMarkdownApplied` (FMX-47)
- `MerchandiseStockWrittenDown` (FMX-47: IAS 2 net-realisable-value)
- `MerchandiseReturnsSettled` (FMX-47)
- `CommercialRoyaltyTrueUpRecognised` (FMX-47: sales-based royalty exception)
- `CommercialGuaranteeShortfallRecognised` (FMX-47)

These FMX-47 events are posted by Club Management on settlement facts emitted by
CommercialPortfolio (Customer-Supplier + ACL); they keep revenue, COGS,
labour/opex, royalty/MAG true-up, guarantee shortfall, waste and stock
write-down as separate lines rather than one net catering/merch number.

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
- `MatchdayOperatingCostSettlement`
- `CupRunRevenueForecast`
- `CateringOperationsBoard` (FMX-47: per-point capacity, queue, stockout, COGS, waste)
- `MerchandiseInventoryBoard` (FMX-47: stock vs forecast, markdown, write-down, returns)

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
- [[../../60-Research/matchday-operating-costs-and-risk-cost-settlement-2026-05-29]]
- [[../../60-Research/catering-and-merchandise-operations-2026-06-01]]
- [[../../50-Game-Design/GD-0008-finance-economy]]
- [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
- [[../../50-Game-Design/economy-system]]
- [[../../30-Implementation/club-economy-accounting-ledger]]
- [[../../30-Implementation/club-economy-commercial-contracts]]
- [[ADR-0058-club-economy-commercial-impact-boundary]]
- [[ADR-0019-modular-monolith-ddd]]
- [[ADR-0027-postgres-data-model]]
- [[ADR-0028-postgres-transactional-outbox]]
