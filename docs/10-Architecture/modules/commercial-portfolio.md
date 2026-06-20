---
title: CommercialPortfolio module
status: draft
tags: [architecture, module, commercial-portfolio, commercial, contract-lifecycle]
context: commercial-portfolio
created: 2026-06-20
updated: 2026-06-20
type: module
binding: false
related: [[../05-Building-Blocks]], [[../bounded-context-map]], [[../09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]], [[../09-Decisions/ADR-0061-club-management-sub-aggregate-audit]], [[../09-Decisions/ADR-0050-club-economy-accounting-ledger]], [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]], [[../09-Decisions/ADR-0027-postgres-data-model]], [[../state-machines/commercial-portfolio]]
---

# CommercialPortfolio Boundary

## Purpose

Owns commercial policy, the unified commercial-contract lifecycle, per-fixture
commercial settlement and Investor entitlement-grant posting; turns venue,
fixture, demand and rivalry facts into contract value and settlement events for
the finance ledger. It never writes finance tables itself (ADR-0058 / ADR-0050).

## Owns

(aggregates / state owned by this context, per the BCM row + ADR-0058)

- `CommercialContract` — unified shell across sponsorship + catering +
  merchandise + hospitality + season-ticket bundles
  (Available → Negotiating → Active → Renewing → Terminated + Cool-down FSM).
- `AssetInventory` — asset taxonomy + slot allocation.
- `ExclusivityGraph` — category-exclusivity edges.
- `SeasonTicketCampaign` — 8-state campaign FSM.
- `FixtureSettlement` — per-fixture settlement Saga.
- `AccrualSchedule` — IFRS 15 5-step recognition model.
- `CreditLiabilityPool` — refund + no-show + postponement liability.
- `InstalmentReceivable` — payment-plan state + IFRS 9 ECL.
- `CommercialFairValueAssessment` — UEFA FSR + PL APT + La Liga PSR documentation.
- `FanEventCampaign` — paid fan-service campaigns.

See [[../state-machines/commercial-portfolio]] for the owned FSMs.

## Public contract

Faithful transcription of the BCM `CommercialPortfolio` row (exposed outputs)
and the ADR-0058 §Public contract direction. Where the two diverge see
`## Open items`.

### Commands (ADR-0058)

`SetTicketingPolicy`, `OpenSeasonTicketCampaign`, `SelectCommercialContract`,
`IssueCommercialOffer`, `CounterCommercialOffer`, `AmendCommercialContract`,
`RenewCommercialContract`, `OpenCommercialBreach`, `ResolveCommercialBreach`,
`TerminateCommercialContract`, `ScheduleFanEventCampaign`,
`SetMatchdayCommercialPolicy`, `ApplyInvestorEntitlementGrant`,
`SetCommercialDisclosureAcknowledged`, `InitiateInvestorPurchase`,
`ConfirmInvestorEntitlement` (idempotent by `storeTransactionRef`),
`ReconcileInvestorEntitlement`.

### Queries / read models (BCM exposed outputs)

`CommercialContractPortfolio`, `CommercialForecastSnapshot`,
`AssetInventoryDashboard`, `ExclusivityGraphSnapshot`,
`SeasonTicketCampaignBoard`, `MatchdayCommercialSettlement`,
`RefundLiabilitySnapshot`, `InstalmentReceivableAging`, `FairValueEvidencePack`,
`FanEventCampaignCalendar`, `CommercialKpiBoard`.

### Domain events (BCM exposed outputs)

`CommercialContractActivated`, `CommercialContractRenewalDue`,
`CommercialContractRenewed`, `CommercialBreachOpened`,
`CommercialBreachResolved`, `CommercialContractTerminated`,
`SeasonTicketCampaignAdvanced`, `SeasonTicketCampaignClosed`,
`TicketingPolicyChanged`, `MatchdayCommercialSettlementPosted`,
`InvestorCashGrantPosted`, `FanEventCampaignScheduled`,
`CommercialFairValueAssessed`, `RefundLiabilityRecognised`,
`RefundLiabilityReleased`, `DeferredRevenueRecognised`.

> ADR-0058 §Public contract direction additionally lists a broader, finer-grained
> event set drafted while these were still "Club-owned" (e.g.
> `CommercialContractAmended`, `CommercialExclusivityConflictDetected`,
> `CommercialPenaltyApplied`, and the `FanEvent*` / `Cup*` settlement events).
> That list predates the CommercialPortfolio BC split and is not reconciled into
> one published-language version in the sources; treated as `## Open items`.

## Storage ownership

- Owns its own schema/tables; no other context reads or writes them
  (ADR-0027 data model; ADR-0121 no-shared-tables fitness function).
- No cross-context joins — inbound facts arrive as snapshots/events, never as
  shared tables (ADR-0058; ADR-0121).
- Never writes finance ledger tables: Club Management is the sole ledger writer;
  CommercialPortfolio emits settlement events consumed via Customer-Supplier +
  ACL (ADR-0050 / ADR-0058).
- Concrete schema/table names are not enumerated in the sources read — see
  `## Open items`.

## Consumers / Producers

Producers (facts this context consumes):

- Audience & Atmosphere — `FanDemandForecast`, `TicketingTrustState`
  (campaign opening + per-fixture pricing).
- Stadium Operations — `StadiumCommercialSnapshot`, `StadiumCapacitySnapshot`,
  `HospitalityInventorySnapshot` (matchday + hospitality settlement).
- League Orchestration — `CompetitionRevenueProfilePublished`,
  `FixtureCommercialProfilesPublished` + profile snapshot queries,
  `SeasonAdvanced`.
- Rivalry System — `RivalryTierTransitioned` / `RivalryCommercialSignal`
  (top-match pricing + sponsor-fit risk).
- Regulations & Compliance — `EffectiveRuleSet` (IFRS / refund / accessibility /
  data-law interpretation).
- Match — `MatchResolved` (final settlement input).
- (ADR-0058 also lists `PlayerStarDemandSignal`, `MatchdaySettlementInput`,
  `InvestorEntitlementGrant` as input facts.)

Consumers (contexts consuming this context's outputs):

- Club Management — settlement + ledger-posting events
  (`MatchdayCommercialSettlementPosted`, `CommercialContractActivated`,
  `InvestorCashGrantPosted`, …) via Customer-Supplier + ACL per ADR-0050.
- Manager & Legacy — `CommercialKpiBoard` (archetype hook aggregation, GD-0019).
- Notification — sponsor-activation / renewal-due / breach alerts (ADR-0043).

## Invariants

- CommercialPortfolio never writes finance/ledger tables directly; Club
  Management is the sole ledger writer (ADR-0050 / ADR-0058).
- Cross-context inputs are snapshots/events only — no shared tables, no
  cross-context joins (ADR-0121 / ADR-0058).
- `CommercialContract` is the unified contract aggregate across all commercial
  types; lifecycle state, version history and breach state stay inside this
  context (ADR-0058 / ADR-0061).
- `risk:legal` hardline: no real-world sponsor or club names embedded as samples;
  regulatory references stay abstract via the Regulations & Compliance catalog
  (GD-0015 / ADR-0007 / ADR-0056).
- Schema + semantic validation of community/cross-save commercial seed data is
  owned by this BC, not by importers (ADR-0058).
