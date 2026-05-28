---
title: ADR-0058 Club Economy Commercial Impact Boundary
status: accepted
tags: [adr, architecture, economy, commercial, contract-lifecycle, breach, club-management, commercial-portfolio, cup, competition, fmx-32, fmx-41, fmx-44, fmx-45, accepted]
created: 2026-05-28
updated: 2026-05-28
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
  settlement Saga + IFRS 15 accrual schedule + credit / refund
  liability pool + instalment receivables + Investor entitlement
  grant policy.
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
Regulations own `CompetitionRevenueProfile` rule data, while Club Management
owns the settlement that turns those profiles into cash, receivable, cost,
sponsor, merchandise and forecast-shock facts.

The current bounded-context map already gives Club Management finance,
infrastructure, sponsors, board and fans. However, the richer commercial model
could be placed in several ways. The boundary matters because ticketing and
commercial contracts need causal inputs from Fan Ecology, Rivalry, League,
Match, Stadium, Regulations, Transfer and Staff, but they must not let every
domain write money directly.

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
- `InvestorCashGrantPosted`
- `CommercialForecastSnapshot`
- `CommercialContractPortfolio`
- `CommercialContractRegister`
- `CommercialExclusivityGraph`
- `CupRunRevenueForecast`

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

If Nico accepts Option C, the architecture direction should also include these
cup and competition constraints:

- `CompetitionRevenueProfile` is external rule/profile data owned by
  League/Competition and Regulations, not by Club Management.
- Club Management owns cup commercial settlement and ledger posting after it
  receives the profile plus fixture, fan, rivalry, stadium and match facts.
- Competition cash, receivables, costs and non-spendable future EV stay
  separated in read models and ledger projections.
- Elimination shock is a forecast/read-model event, not a cash loss, unless an
  already-earned receivable must be reversed.
- Fixture congestion remains a profile hook; fatigue/injury outcomes stay with
  the sporting systems.
- Default profile templates must be IP-clean and data-driven, with real-world
  sources used only for calibration ranges.

## Rationale

Option C keeps the economy coherent. The ledger, commercial contract lifecycle
and commercial settlement belong together, but causal truth stays with the
domain that creates it. This matches the FMX-13 direction, avoids a premature
additional context, and still gives future implementers enough contract names to
build realistic tickets, contracts, cup revenue and fan-service events.

## Consequences

Positive:

- One finance owner remains responsible for cash, accrual, contracts and
  commercial settlement.
- Contract lifecycle, renewal, exclusivity and breach rules are explicit enough
  for Quick / Standard / Expert UI without creating legal-software depth.
- Commercial modelling can become deep without letting Match, Rivalry or Fan
  Ecology write money directly.
- Quick / Standard / Expert UI can read one commercial forecast.
- Investor entitlement is isolated from ownership, debt and multiplayer.

Negative / constraints:

- Club Management's internal model becomes larger.
- Contract boundaries must be tested early to avoid Club Management depending
  on other contexts' private schemas.
- A future Commercial Operations context may still be justified if lifecycle
  complexity grows.
- ADR-0050 ledger tests must cover commercial cash-vs-recognition schedules,
  penalties, make-goods, true-ups and termination settlements.

## Supersedes

None.

## Related Docs

- [[../../60-Research/club-economy-impact-map-and-commercial-contracts-2026-05-28]]
- [[../../60-Research/commercial-contract-lifecycle-and-breach-model-2026-05-28]]
- [[../../60-Research/cup-and-competition-revenue-profiles-2026-05-28]]
- [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
- [[../../50-Game-Design/GD-0008-finance-economy]]
- [[../../50-Game-Design/economy-system]]
- [[../../30-Implementation/club-economy-commercial-contracts]]
- [[ADR-0050-club-economy-accounting-ledger]]
