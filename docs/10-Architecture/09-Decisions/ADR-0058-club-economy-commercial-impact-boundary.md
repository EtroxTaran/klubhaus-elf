---
title: ADR-0058 Club Economy Commercial Impact Boundary
status: accepted
tags: [adr, architecture, economy, commercial, contract-lifecycle, breach, club-management, commercial-portfolio, cup, competition, matchday, catering, merchandise, operations, fan-service, investor, entitlement, fmx-32, fmx-41, fmx-44, fmx-45, fmx-46, fmx-47, fmx-48, fmx-50, accepted]
context: [club-management-economy, commercial-portfolio]
created: 2026-05-28
updated: 2026-06-08
type: adr
binding: true
supersedes:
superseded_by:
related:
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[ADR-0050-club-economy-accounting-ledger]]
  - [[ADR-0056-regulations-compliance-context]]
  - [[ADR-0057-rivalry-system-context]]
  - [[ADR-0061-club-management-sub-aggregate-audit]]
  - [[ADR-0062-audience-and-atmosphere-context]]
  - [[../../50-Game-Design/GD-0008-finance-economy]]
  - [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../../50-Game-Design/economy-system]]
  - [[../../60-Research/club-economy-impact-map-and-commercial-contracts-2026-05-28]]
  - [[../../60-Research/commercial-contract-lifecycle-and-breach-model-2026-05-28]]
  - [[../../60-Research/cup-and-competition-revenue-profiles-2026-05-28]]
  - [[../../60-Research/matchday-operating-costs-and-risk-cost-settlement-2026-05-29]]
  - [[../../60-Research/fan-service-campaign-catalog-and-effects-2026-06-01]]
  - [[../../60-Research/club-management-sub-aggregate-audit-2026-05-28]]
  - [[../../30-Implementation/club-economy-accounting-ledger]]
  - [[../../30-Implementation/club-economy-commercial-contracts]]
  - [[../bounded-context-map]]
---

# ADR-0058: Club Economy Commercial Impact Boundary

## Status

accepted

## Ratification note

Concurrent ratification with FMX-32 audit (ADR-0061 + ADR-0062) on
2026-05-28 by Nico. **The original §Recommendation below (Option
C = Club Management commercial sub-aggregate, no new BC) is
superseded by the FMX-32 boundary audit.** Nico ratified the
FMX-32 best-practice landing — the §Options "Option B — New
Commercial Operations bounded context" that this ADR originally
deferred is **now the accepted shape**, instantiated as the
**CommercialPortfolio** bounded context (FMX-32 CommercialPortfolio
= Option C, includes Ticketing & Commercial Settlement as Option D
sub-Aggregate). The boundary rules below are amended accordingly:

- **CommercialPortfolio bounded context** owns commercial policies
  (ticketing, season-ticket strategy, commercial contract
  portfolio, fan-event campaign choices) + commercial contract
  lifecycle state + version history + obligation fulfilment +
  breach cases + renewal policy + exclusivity graph + per-fixture
  commercial settlement Saga + `MatchdayOperatingCostProfile` +
  matchday operating-cost settlement Saga + IFRS 15 accrual
  schedule + credit / refund liability pool + instalment
  receivables + Investor entitlement grant policy.
- **Club Management** owns the ledger entries caused by commercial
  settlement; CommercialPortfolio emits settlement events
  consumed via Customer-Supplier + ACL per Vernon canonical
  pattern (ADR-0050 remains the sole writer of finance tables).
- **Audience & Atmosphere** owns `FanDemandForecast` +
  `TicketingTrustState` consumed by CommercialPortfolio (ADR-0062).
- **Stadium Operations** owns `StadiumCommercialSnapshot` +
  `StadiumCapacitySnapshot` consumed by CommercialPortfolio
  (ADR-0061).
- **Rivalry System** supplies `RivalryCommercialSignal` per
  ADR-0057.
- **League Orchestration** supplies `FixtureCommercialProfile` +
  `CompetitionRevenueProfile`.
- **Regulations & Compliance** supplies `EffectiveRuleSet`
  (UEFA FSR + PL APT + La Liga PSR + GDPR + DSA + CRA + Late
  Payment Directive + CEN-EN 17210 obligations).

The §Public contract direction below is amended: commands +
events + read models previously listed as "owned by Club
Management" are now owned by **CommercialPortfolio**; the listed
input facts are now consumed by CommercialPortfolio from their
respective owning BCs.

## Status (original draft text)

draft

## Date

2026-05-28

## Context

FMX-13 established a Club Management-owned weekly accounting ledger. FMX-41 adds
the missing commercial impact graph: fan demand, season tickets, top-match
pricing, catering, merchandise, sponsor side conditions, cup-game settlement,
fan-service campaigns and the singleplayer Investor cash purchase. FMX-44
refines the commercial contract side into a shared lifecycle and breach model
for sponsorship, catering, merchandise, hospitality, supplier and
venue-activation deals.

FMX-45 refines the cup and competition side: League/Competition and
Regulations own `CompetitionRevenueProfile` rule data, while
CommercialPortfolio owns the settlement that turns those profiles into cash,
receivable, cost, sponsor, merchandise and forecast-shock facts. Club
Management posts the resulting ledger entries through ADR-0050.

FMX-46 refines the matchday operating-cost side: Stadium Operations, Audience
& Atmosphere, Rivalry, Regulations, League/Competition and Matchday Event
Engine provide risk and venue facts; CommercialPortfolio owns the per-fixture
`MatchdayOperatingCostProfile` and operating settlement; Club Management posts
the resulting ledger entries through ADR-0050.

FMX-48 refines the fan-service campaign side: CommercialPortfolio owns
`FanEventCampaign` policy, sponsor/fulfilment obligations, settlement and
cooldown, while Audience & Atmosphere owns mood/trust/atmosphere/demand effects,
Stadium Operations owns venue/crowd-flow facts, Regulations owns alcohol/travel/
safety constraints and Club Management posts ledger entries through ADR-0050.

After FMX-32, the bounded-context map separates Club Management finance truth
from Stadium Operations, Audience & Atmosphere and CommercialPortfolio. The
boundary matters because ticketing and commercial contracts need causal inputs
from Audience & Atmosphere, Rivalry, League, Match, Stadium Operations,
Regulations, Transfer and Staff, but they must not let every domain write money
directly.

## Options considered

### Option A - Cash-only ledger expansion

Keep all commercial effects as simple ledger categories and avoid explicit
contract or policy models.

- **Pros:** Smallest model; fast to explain.
- **Cons:** Cannot model season-ticket opportunity cost, contract clauses,
  own-versus-outsourced catering, merchandise inventory/royalty risk or cup
  fixture settlement. Expert UI would be fake detail over flat numbers.
- **Fit:** Reject. It contradicts Nico's request for realistic contracts and
  detailed/expert commercial surfaces.

### Option B - New Commercial Operations bounded context

Create a separate bounded context for ticketing, catering, merchandise,
sponsorship contracts and fan-event campaigns.

- **Pros:** Clear commercial ubiquitous language; future service extraction if
  commercial lifecycle becomes large.
- **Cons:** Adds another context while Club Management already owns finance,
  stadium economics, sponsors, board policy and fan economy. The first MVP
  commercial model mainly settles into the Club ledger and is not yet large
  enough to justify a separate lifecycle.
- **Fit:** Keep as future option if commercial contracts grow into a standalone
  product surface with separate lifecycle, permissions and team ownership.

### Option C - Club Management commercial sub-aggregate with external fact contracts

Club Management owns ticketing policy, commercial contracts, commercial
settlement and ledger posting. Other contexts publish facts or read models:
Fan Ecology provides demand and fan-fit risk, Rivalry provides derby/top-match
intensity, League and Competition provide fixture and payout profiles, Stadium
provides capacity, venue capabilities and service-level facts, Match provides
final settlement inputs, Regulations provides constraints/sanctions, and
platform/payment code provides Investor entitlement confirmation.

- **Pros:** Matches the existing Club Management finance boundary, keeps one
  ledger truth, avoids cross-context money writes, and still gives Commercial a
  named internal model and contract language. FMX-44's shared
  `CommercialContract` lifecycle stays inside this sub-aggregate and avoids a
  premature new context. FMX-45's competition revenue profiles stay external
  input facts; Club Management consumes them without owning competition rules.
- **Cons:** Club Management grows broader; requires discipline and explicit
  public contracts so it does not become a generic "everything club" context.
- **Fit:** Recommended draft for MVP planning.

## Recommendation

Recommend **Option C** for MVP planning: Club Management gets a named
commercial sub-aggregate, but no new bounded context is added by this ADR.

FMX-44 makes this recommendation acceptance-ready, not accepted: the contract
model is now explicit enough to evaluate Option C against the alternative
Commercial Operations bounded context, but Nico still needs to ratify or reopen
the boundary.

Key boundary rules:

- Club Management owns commercial policies: ticketing, season-ticket strategy,
  commercial contract portfolio, fan-event campaign choices and settlement.
- Club Management owns commercial contract lifecycle state, version history,
  obligation fulfilment, breach cases, renewal policy and exclusivity graph.
- Club Management owns the ledger entries caused by commercial settlement.
- Fan Ecology, Rivalry System, League Orchestration, Match, Stadium/Campus,
  Regulations and other contexts own their causal facts.
- Consumers never insert ledger rows directly.
- Cross-context inputs are snapshots/events, not shared tables.
- Investor purchase confirmation is an entitlement input, not an ownership or
  finance-policy model.
- If commercial operations later needs independent lifecycle, staffing,
  permissions or service extraction, supersede this ADR and evaluate Option B.

## Public contract direction

Draft commands owned by Club Management:

- `SetTicketingPolicy`
- `OpenSeasonTicketCampaign`
- `SelectCommercialContract`
- `IssueCommercialOffer`
- `CounterCommercialOffer`
- `AmendCommercialContract`
- `RenewCommercialContract`
- `OpenCommercialBreach`
- `ResolveCommercialBreach`
- `TerminateCommercialContract`
- `ScheduleFanEventCampaign`
- `SetMatchdayCommercialPolicy`
- `ApplyInvestorEntitlementGrant`
- `SetCommercialDisclosureAcknowledged`
- `InitiateInvestorPurchase` (FMX-50)
- `ConfirmInvestorEntitlement` (FMX-50, idempotent by `storeTransactionRef`)
- `ReconcileInvestorEntitlement` (FMX-50, refund / void / chargeback)

Draft input facts/read models from other domains:

- `FanDemandForecast`
- `FixtureCommercialProfile`
- `StadiumCommercialSnapshot`
- `CompetitionRevenueProfile`
- `MatchdaySettlementInput`
- `LicenceCommercialConstraint`
- `RivalryCommercialSignal`
- `PlayerStarDemandSignal`
- `InvestorEntitlementGrant`

Draft Club-owned events/read models:

- `TicketingPolicyChanged`
- `SeasonTicketCampaignClosed`
- `CommercialContractActivated`
- `CommercialContractAmended`
- `CommercialContractRenewalDue`
- `CommercialExclusivityConflictDetected`
- `CommercialBreachOpened`
- `CommercialBreachCured`
- `CommercialPenaltyApplied`
- `CommercialContractTerminated`
- `FanEventCampaignScheduled`
- `FanEventCampaignCostCommitted`
- `FanEventSponsorContributionRecognised`
- `FanEventCampaignCancelled`
- `FanEventMakeGoodGranted`
- `FanEventCampaignSettled`
- `FanEventLowUptakeRecorded`
- `FanEventSegmentEffectPublished`
- `AwayTravelSubsidySettled`
- `ChoreoSupportSettled`
- `BeverageRewardCampaignSettled`
- `CommunityTicketBlockSettled`
- `FanEventCooldownApplied`
- `MatchdayCommercialSettlementPosted`
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
- `InvestorCashGrantPosted`
- `InvestorEntitlementRevoked` (FMX-50)
- `InvestorPaymentFailed` (FMX-50)
- `InvestorDisclosureAcknowledged` (FMX-50, versioned)
- `CommercialForecastSnapshot`
- `CommercialContractPortfolio`
- `CommercialContractRegister`
- `CommercialExclusivityGraph`
- `CupRunRevenueForecast`
- `MatchdayOperatingCostSettlement`

## FMX-44 acceptance-ready amendment

If Nico accepts Option C, the architecture direction should include these
contract-level constraints:

- `CommercialContract` is a Club Management sub-aggregate, not a cross-domain
  table.
- Contract lifecycle events are Club-owned events; other contexts only provide
  facts that may influence them.
- Cash schedule, recognition schedule and breach/penalty postings feed
  ADR-0050's ledger through Club Management.
- Sponsorship, catering, merchandise, hospitality, supplier and
  venue-activation deals share one lifecycle shell and add family-specific
  schedules.
- Breach severity is a game-level policy tier: curable, material or critical.
- Exclusivity is structured as category × territory × asset × carve-outs.
- AI-club decision hooks are read-only factors reserved for FMX-51 and do not
  move ownership out of Club Management.

Extraction trigger: supersede this ADR and re-evaluate Option B only if
commercial operations later needs independent permissions, staffing,
simulation cadence, team ownership or service deployment.

## FMX-45 competition revenue amendment

After the FMX-32 ratification, the cup and competition direction includes these
constraints:

- `CompetitionRevenueProfile` is external rule/profile data owned by
  League/Competition and Regulations, not by CommercialPortfolio or Club
  Management.
- CommercialPortfolio owns cup commercial settlement after it receives the
  profile plus fixture, audience, rivalry, stadium and match facts.
- Club Management posts the resulting ledger entries through ADR-0050.
- Competition cash, receivables, costs and non-spendable future EV stay
  separated in read models and ledger projections.
- Elimination shock is a forecast/read-model event, not a cash loss, unless an
  already-earned receivable must be reversed.
- Fixture congestion remains a profile hook; fatigue/injury outcomes stay with
  the sporting systems.
- Default profile templates must be IP-clean and data-driven, with real-world
  sources used only for calibration ranges.

## FMX-46 matchday operating-cost amendment

The FMX-32 ratification supersedes the old Option C wording above. The
matchday operating-cost direction is:

- `MatchdayOperatingCostProfile` is a per-fixture CommercialPortfolio model,
  not a direct Stadium Operations or Club ledger table.
- CommercialPortfolio consumes venue/service facts from Stadium Operations,
  demand and crowd-mix facts from Audience & Atmosphere, rivalry signals from
  Rivalry, restriction and sanction facts from Regulations, profile context
  from League/Competition and incident outcomes from Matchday Event Engine.
- Risk tiers are data contracts (`routine`, `guarded`, `elevated`,
  `highRisk`, `restricted`, `closedDoor`), not hard-coded legal conclusions.
- Sector closures, away-fan restrictions, alcohol restrictions and ghost
  matches must show both revenue impact and operating-cost impact.
- High-risk fixtures must provide a forecast and mitigation surface before the
  player can be surprised by material cost, unless the cost is caused by a
  post-match incident.
- Club Management remains the sole finance-ledger writer; it posts ADR-0050
  entries after receiving CommercialPortfolio settlement events.

## FMX-47 catering and merchandise operations amendment

FMX-47 deepens the catering and merchandise families without moving a boundary:

- Catering and merchandise operations (operating model, COGS, labour, waste,
  inventory lifecycle, stockout, fulfilment, supplier exclusivity) are owned
  inside **CommercialPortfolio** as part of the unified `CommercialContract`;
  Club Management remains sole ledger writer and posts the FMX-47 operations
  events (ADR-0050) from CommercialPortfolio settlement facts via
  Customer-Supplier + ACL.
- Throughput and dwell are **Stadium Operations** facts
  (`StadiumCommercialSnapshot`); demand, service-quality reaction and NPS are
  **Audience & Atmosphere** facts (`FanDemandForecast` + service-quality
  consumption). CommercialPortfolio consumes both; it does not own throughput or
  fan mood.
- The ledger keeps revenue, COGS, labour/opex, royalty/MAG true-up, guarantee
  shortfall, waste and stock write-down as separate facts (never one net number),
  with cash-vs-recognition per IFRS 15 by operating model.
- Catering supplier pouring-rights/exclusivity reuse the FMX-44 exclusivity graph
  (category × territory × asset × carve-outs); no new exclusivity model.
- All operational numbers remain IP-clean calibration ranges, never final
  constants; in-game supplier/brand names follow GD-0015 + ADR-0007.

## FMX-50 Investor entitlement and payment boundary note

FMX-50 details the Investor entitlement/compliance side without moving a boundary.
CommercialPortfolio keeps the Investor entitlement grant policy; Club Management
stays the sole ledger writer (`InvestorCashGrantPosted`). The payment path
(`apple-iap` / `google-iap` / `web-psp`) sits behind a `PaymentProviderPort`; the
entitlement is a server-authoritative, idempotent state machine
(`created → paid → entitled → refunded|revoked`) bound to the account, not the
save. SKU catalog, refund/revocation, age-rating, EU/DE/UK/US consumer-law
disclosure, abuse prevention and audit are specified in proposed
[[ADR-0063-investor-entitlement-and-payment-boundary]] (research:
[[../../60-Research/investor-compliance-and-entitlement-boundary-2026-06-01]]).
Final vendor (MoR vs direct), refund-of-spent-cash policy and activation timing
are HITL/legal gates. `risk:legal`.

## FMX-48 fan-service campaign amendment

FMX-48 deepens fan-service campaigns without moving a boundary:

- `FanEventCampaign` is owned inside **CommercialPortfolio** as campaign policy,
  lifecycle, sponsor/fulfilment obligation, settlement, KPI/make-good and
  cooldown state. It is not a new bounded context and not owned by Club
  Management.
- **Audience & Atmosphere** owns the resulting segment mood, trust, atmosphere,
  demand and campaign-fatigue memory. CommercialPortfolio publishes
  `FanEventSegmentEffectPublished` facts but does not mutate fan state.
- **Stadium Operations** owns venue feasibility facts: fan-zone capacity,
  crowd-flow, temporary structures, weather fallback, choreo/material support
  and away-travel arrival/parking constraints.
- **Regulations & Compliance** owns profile constraints for alcohol, travel,
  safety, child/family safeguarding and digital/UGC rules.
- **Club Management** remains sole ledger writer and posts campaign cost,
  sponsor contribution, refund, make-good and settlement entries after
  CommercialPortfolio emits settlement facts via Customer-Supplier + ACL.
- Sponsor contribution is modelled as cash, goods, services, media, staff,
  community grant or digital tooling; low uptake and cancellation create
  make-good rules rather than hidden sponsor satisfaction changes.
- Campaign frequency is bounded by cooldown/fatigue policy so sponsor
  activations cannot be spammed for unbounded positive fan or ROI effects.

## Rationale

The FMX-32 ratification keeps the economy coherent by separating two truths:
CommercialPortfolio owns commercial policy, contract lifecycle, accrual
schedule and settlement, while Club Management owns finance-ledger posting.
Causal truth still stays with the domain that creates it. This gives
implementers enough contract names to build realistic tickets, contracts, cup
revenue, matchday operating costs and fan-service events without allowing every
domain to write money directly.

## Consequences

Positive:

- CommercialPortfolio has one commercial owner for policy, contracts, accrual
  schedules and settlement.
- Club Management remains the sole finance-ledger writer for cash, P&L,
  liability and compliance projections.
- Contract lifecycle, renewal, exclusivity and breach rules are explicit enough
  for Quick / Standard / Expert UI without creating legal-software depth.
- Commercial modelling can become deep without letting Match, Rivalry or
  Audience & Atmosphere write money directly.
- Matchday operating risk becomes forecastable and tunable without giving
  non-finance contexts direct ledger access.
- Quick / Standard / Expert UI can read one commercial forecast.
- Investor entitlement is isolated from ownership, debt and multiplayer.

Negative / constraints:

- CommercialPortfolio's model becomes broad and must stay modular internally.
- Contract boundaries must be tested early to avoid CommercialPortfolio or
  Club Management depending on other contexts' private schemas.
- ADR-0050 ledger tests must cover commercial cash-vs-recognition schedules,
  penalties, make-goods, true-ups and termination settlements.
- ADR-0050 ledger tests must also cover stewarding, security, policing
  contribution, medical, cleaning, energy, pitch recovery, sanction, closure
  and ghost-match settlement entries.

## Supersedes

None.

## Related Docs

- [[../../60-Research/club-economy-impact-map-and-commercial-contracts-2026-05-28]]
- [[../../60-Research/commercial-contract-lifecycle-and-breach-model-2026-05-28]]
- [[../../60-Research/cup-and-competition-revenue-profiles-2026-05-28]]
- [[../../60-Research/matchday-operating-costs-and-risk-cost-settlement-2026-05-29]]
- [[../../60-Research/catering-and-merchandise-operations-2026-06-01]]
- [[../../60-Research/investor-compliance-and-entitlement-boundary-2026-06-01]]
- [[ADR-0063-investor-entitlement-and-payment-boundary]]
- [[../../60-Research/fan-service-campaign-catalog-and-effects-2026-06-01]]
- [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
- [[../../50-Game-Design/GD-0008-finance-economy]]
- [[../../50-Game-Design/economy-system]]
- [[../../30-Implementation/club-economy-commercial-contracts]]
- [[ADR-0050-club-economy-accounting-ledger]]
