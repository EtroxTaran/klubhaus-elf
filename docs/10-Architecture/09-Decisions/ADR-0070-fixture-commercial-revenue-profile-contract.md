---
title: ADR-0070 FixtureCommercialProfile + CompetitionRevenueProfile publication contract
status: accepted
tags: [adr, architecture, league, competition, fixture, commercial, revenue, published-language, outbox, acl, quality-profile, fmx-78, fmx-147]
context: [league-orchestration, commercial-portfolio]
created: 2026-06-03
updated: 2026-06-13
accepted_at: 2026-06-03
type: adr
binding: true
supersedes:
superseded_by:
related:
  - [[ADR-0066-competition-registry-sub-aggregate]]
  - [[ADR-0068-fixture-scheduling-contract]]
  - [[ADR-0058-club-economy-commercial-impact-boundary]]
  - [[ADR-0050-club-economy-accounting-ledger]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[ADR-0019-modular-monolith-ddd]]
  - [[../bounded-context-map]]
  - [[../../60-Research/fixture-commercial-revenue-profiles-2026-06-03]]
  - [[../../60-Research/quality-profile-enum-settlement-path-2026-06-12]]
  - [[../../60-Research/raw-perplexity/raw-fixture-commercial-revenue-profiles-2026-06-03]]
  - [[../../60-Research/cup-and-competition-revenue-profiles-2026-05-28]]
  - [[../../60-Research/matchday-operating-costs-and-risk-cost-settlement-2026-05-29]]
  - [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../../30-Implementation/club-economy-commercial-contracts]]
  - [[ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract]]
---

# ADR-0070: FixtureCommercialProfile + CompetitionRevenueProfile publication contract

## Status

accepted

> **Ratified by Nico 2026-06-03** with the recommended landing:
> **D1 = A** event-plus-query, **D2 = A** League-owned stable fixture/commercial
> rule facts only, **D3 = A** League owns rule/cadence profiles while
> CommercialPortfolio owns accrual and settlement interpretation.

> **FMX-147 schema amendment accepted 2026-06-13.** Nico confirmed ADR-0101 D3: this ADR now uses
> `FixtureCommercialProfilesPublished.schemaVersion: 2`, replacing the old three-value
> `qualityProfileClass` sketch with canonical `qualityProfile` (`competitive-full`,
> `interactive-standard`, `background-detailed`, `background-fast`) plus derived
> `settlementPath`. Because FMX is still docs-vault-only with no live v1 events, saves, external
> consumers or durable integration fixtures, this is recorded as a pre-1.0 replacement rather than a
> compatibility burden. Future breaking changes after implementation/publication require a new
> version or upcaster path.

## Date

- Proposed: 2026-06-03
- Accepted (Nico): 2026-06-03

## Context

ADR-0066 ratified the Competition & Season registry as a sub-aggregate cluster
inside League Orchestration and made it the producer of
`FixtureCommercialProfile`, `CompetitionRevenueProfile` and `SeasonAdvanced`.
ADR-0068 then locked deterministic fixture generation and immutable
`FixturesPublished`.

CommercialPortfolio (ADR-0058) owns commercial policy, per-fixture settlement,
`AccrualSchedule` and `MatchdayOperatingCostProfile`. Club Management (ADR-0050)
is the sole ledger writer. FMX-45 already identified the competition-revenue
concepts that must be representable: prize schedules, gate sharing, ticket
allocation, media/facility payments, settlement delays, recognition policies,
neutral venue handling, replay/two-leg handling, forecast policy and solidarity.

The gap: the promised League -> CommercialPortfolio published language is still
only named, not specified. FMX-78 closes that contract.

Grounding: [[../../60-Research/fixture-commercial-revenue-profiles-2026-06-03]]
and raw Perplexity capture
[[../../60-Research/raw-perplexity/raw-fixture-commercial-revenue-profiles-2026-06-03]].

## Decision options

### D1 - Publication mechanism

| Option | Description | Trade-off |
|---|---|---|
| **A. Event-plus-query** | League publishes profile events through the transactional outbox; exposes snapshot queries for bootstrap, diagnostics and reconciliation. | **Recommended.** Best audit/replay posture and lowest runtime settlement coupling. Slightly larger contract surface. |
| B. Event-only | Settlement consumes only immutable events. | Cleanest decoupling, but rebuild/debugging depends on complete event replay from day one. |
| C. Query/read-model only | CommercialPortfolio queries League snapshots when it needs profiles. | Lowest initial surface, but creates runtime dependency and temporal drift risk. |

### D2 - `FixtureCommercialProfile` scope

| Option | Description | Trade-off |
|---|---|---|
| **A. League-owned stable facts only** | Fixture profile carries immutable fixture/competition commercial rule facts: stage, round, tie shape, organizer, venue responsibility, gate/ticket/prize/media rule slices and accounting triggers. Rivalry/Audience/Stadium/Weather facts stay separate. | **Recommended.** Clean ownership and no stale copied downstream facts. Requires CommercialPortfolio to compose several projections. |
| B. Enriched fixture profile | League publishes one enriched payload including rivalry/atmosphere/weather/demand bands. | Convenient for one consumer, but copies facts owned elsewhere and risks stale profile state. |
| C. Minimal identity-only profile | League publishes only fixture identity plus competition profile reference. | Safest ownership but too weak for FMX-78 acceptance; CommercialPortfolio must reconstruct rule slices. |

### D3 - Competition revenue cadence ownership

| Option | Description | Trade-off |
|---|---|---|
| **A. League owns rule/cadence profiles; CommercialPortfolio owns accrual/settlement interpretation** | League publishes competition-season rule and cadence profiles. CommercialPortfolio turns them into accrual schedules, receivables and settlement events. | **Recommended.** Matches ADR-0066/0058 ownership. |
| B. League owns full payment/prize calculations | League calculates full competition payout amounts/timings and publishes finance-ready records. | Blurs League with commercial/finance responsibility. |
| C. CommercialPortfolio owns competition profiles entirely | CommercialPortfolio owns and derives competition revenue profiles. | Simplifies consumer implementation but contradicts the current bounded-context map supplier promise. |

## Decision (ratified - Nico 2026-06-03)

Nico ratified **D1 = A, D2 = A, D3 = A**:

1. League Orchestration publishes profile events and snapshot queries.
2. `FixtureCommercialProfile` carries only League-owned stable fixture and
   competition-rule facts.
3. `CompetitionRevenueProfile` rule/cadence facts are League-owned, while
   CommercialPortfolio owns settlement, accrual and consumer interpretation.

## Public contract sketch (ratified A/A/A + FMX-147 D3)

```ts
CompetitionRevenueProfilePublished = {
  eventId: EventId,
  schemaVersion: 1,
  idempotencyKey: string, // competitionRevenueProfileId:version
  publishedAt: Instant,
  competitionRevenueProfile: {
    competitionRevenueProfileId: CompetitionRevenueProfileId,
    competitionRevenueProfileVersion: int,
    competitionId: CompetitionId,
    competitionSeasonId: CompetitionSeasonId,
    seasonId: SeasonId,
    countryProfileId: CountryProfileId,
    competitionKind:
      | 'domesticLeague'
      | 'domesticCup'
      | 'leagueCup'
      | 'superCup'
      | 'playoff'
      | 'continentalCup'
      | 'friendly'
      | 'finalSeries',
    effectiveFromWeek: int,
    organizerKind: 'clubHosted' | 'leagueHosted' | 'associationHosted' | 'confederationHosted',
    commercialRightsModel: 'clubLocal' | 'centralized' | 'hybrid',
    mediaRightsModel: 'none' | 'centralPool' | 'facilityFee' | 'hybrid',
    centralInventoryPolicy: CentralInventoryPolicy,
    prizeSchedule: PrizeSchedule,
    participationRules: ParticipationRules,
    performanceBonusRules: PerformanceBonusRules,
    progressionBonusRules: ProgressionBonusRules,
    winnerRunnerUpRules: WinnerRunnerUpRules,
    solidarityRule: SolidarityRule,
    defaultGateSharingByStage: StageGateSharingRule[],
    netReceiptsDefinition: NetReceiptsDefinition,
    deductibleExpenseBands: DeductibleExpenseBand[],
    organizerLevyPolicy: OrganizerLevyPolicy,
    neutralVenueOverrides: NeutralVenueRule[],
    ticketAllocationByStage: StageTicketAllocationRule[],
    awayAllocationRule: AwayAllocationRule,
    finalistAllocationRule: FinalistAllocationRule,
    protectedAllocationRule: ProtectedAllocationRule,
    pricingConstraintRule: PricingConstraintRule,
    mediaDistributionRule: MediaDistributionRule,
    facilityFeeRule: FacilityFeeRule,
    liveSelectionRule: LiveSelectionRule,
    paymentCadence: PaymentCadence,
    withholdingAdjustmentRule: WithholdingAdjustmentRule,
    drawResolutionRule: DrawResolutionRule,
    replayPolicy: ReplayPolicy,
    twoLegPolicy: TwoLegPolicy,
    finalVenuePolicy: FinalVenuePolicy,
    recognitionPolicy: RecognitionPolicy,
    settlementDelay: SettlementDelay,
    forecastPolicy: ForecastPolicy,
    eliminationShockPolicy: EliminationShockPolicy,
    receivableRiskBand: 'low' | 'medium' | 'high',
    communityOverridePolicy: CommunityOverridePolicy,
    ipCleanSourceProfile: IpCleanSourceProfile,
    provenance: ProfileProvenance
  }
}

FixtureCommercialProfilesPublished = {
  eventId: EventId,
  schemaVersion: 2,
  idempotencyKey: string, // fixturesPublishedEventId:profileVersion
  publishedAt: Instant,
  fixturesPublishedEventId: EventId,
  competitionRevenueProfileId: CompetitionRevenueProfileId,
  competitionRevenueProfileVersion: int,
  profiles: ReadonlyArray<{
    fixtureCommercialProfileId: FixtureCommercialProfileId,
    fixtureCommercialProfileVersion: int,
    fixtureId: FixtureId,
    competitionSeasonId: CompetitionSeasonId,
    seasonId: SeasonId,
    round: int,
    matchday: int,
    scheduledDate: DateOnly,
    homeClubId: ClubId,
    awayClubId: ClubId,
    fixtureKind: 'league' | 'cup' | 'playoff' | 'friendly' | 'continental' | 'final',
    stageBand: StageBand,
    roundBand: RoundBand,
    tieShape: 'single' | 'twoLeg' | 'replay' | 'leaguePhase' | 'neutralFinal',
    legNumber: int | null,
    aggregateTieId: AggregateTieId | null,
    isReplay: boolean,
    isNeutralVenue: boolean,
    isFinal: boolean,
    organizerKind: 'homeClub' | 'league' | 'association' | 'confederation',
    hostClubId: ClubId | null,
    venueResponsibilityKind: VenueResponsibilityKind,
    ticketingOperatorKind: TicketingOperatorKind,
    commercialInventoryPolicy: CentralInventoryPolicy,
    gateSharingRuleSnapshot: GateSharingRule,
    netReceiptsDefinitionSnapshot: NetReceiptsDefinition,
    ticketAllocationRuleSnapshot: TicketAllocationRule,
    awayAllocationRuleSnapshot: AwayAllocationRule,
    fixturePrizeTrigger: PrizeTrigger,
    facilityFeeTrigger: FacilityFeeTrigger,
    broadcastSelectionBand: BroadcastSelectionBand,
    paymentTrigger: PaymentTrigger,
    recognitionTrigger: RecognitionTrigger,
    accountingPeriod: AccountingPeriod,
    settlementDueRule: SettlementDueRule,
    postponementHandling: PostponementHandling,
    abandonmentHandling: AbandonmentHandling,
    commercialSettlementAttachmentKey: string,
    operatingCostAttachmentKey: string,
    qualityProfile:
      | 'competitive-full'
      | 'interactive-standard'
      | 'background-detailed'
      | 'background-fast',
    settlementPath:
      | 'foreground_per_event'
      | 'background_summary_then_reconcile'
      | 'lightweight_stateless',
    provenance: ProfileProvenance
  }>
}

CompetitionRevenueProfileSnapshot(competitionSeasonId, version?)
  -> CompetitionRevenueProfile | null

FixtureCommercialProfileSnapshot(fixtureId, version?)
  -> FixtureCommercialProfile | null
```

The contract is JSON/Zod-describable. The TypeScript sketch is vocabulary, not
implementation code.

## Publication triggers (recommended)

1. `SeasonAdvanced` / season setup creates or selects every active
   `CompetitionRevenueProfile` for the season and emits
   `CompetitionRevenueProfilePublished`.
2. `FixturesPublished` creates the per-fixture commercial profile batch for the
   immutable fixture set and emits `FixtureCommercialProfilesPublished`.
3. Postponement, abandoned-match replay, rules correction or community-pack
   ratification that changes commercial rule facts emits a new profile version
   plus an explicit adjustment/republish event. Existing versions are not
   silently mutated.

## Consumer ACL and storage

CommercialPortfolio is the customer. League Orchestration is the supplier.

CommercialPortfolio's ACL:

1. validates `schemaVersion`, `idempotencyKey`, `profileVersion`, `provenance`
   and `ipCleanSourceProfile`;
2. rejects unknown or non-IP-clean source profiles;
3. stores immutable consumer-owned projections:
   `CompetitionRevenueProfileProjection` and
   `FixtureCommercialProfileProjection`;
4. composes those projections with Rivalry, Audience & Atmosphere, Stadium
   Operations, Regulations and Match/Calendar facts for settlement;
5. emits settlement and accrual events consumed by Club Management.

No context outside Club Management writes ledger rows. League does not call the
ledger and does not expose tables for CommercialPortfolio joins.

## Field-to-consumer mapping

| Profile area | CommercialPortfolio consumer | FMX-45 concept |
|---|---|---|
| Prize schedule / triggers | AccrualSchedule + receivable settlement | prize schedule, secured income, receivable |
| Gate sharing / net receipts | FixtureSettlement | gate sharing, net/gross basis, deductions |
| Ticket allocation | Ticketing settlement + season-ticket material-right hook | away allocation, finalist allocation, protected quotas |
| Media/facility | Commercial settlement + receivable schedule | media payment, facility/live-selection fee |
| Neutral/final | FixtureSettlement + operating-cost profile | neutral venue, club share, final travel |
| Replay/two-leg | FixtureSettlement + forecast update | replay/two-leg, additional fixture and gate |
| Recognition/payment cadence | AccrualSchedule | cash vs receivable vs deferred revenue |
| Forecast/elimination | CommercialForecastSnapshot | future EV and elimination shock |
| Solidarity | Competition settlement | lower-tier/amateur/non-participant support |
| Attachment keys | Background-fast settlement envelope | G21 `MatchdayOperatingCostSummary` hook |

No orphan fields are allowed. A field must either feed a named
CommercialPortfolio projection/settlement step, support validation/provenance, or
be removed.

## Background-fast hook

`FixtureCommercialProfile.operatingCostAttachmentKey` is the per-fixture join key
inside **CommercialPortfolio's own projection**, not a cross-context join.
CommercialPortfolio attaches:

```ts
MatchdayOperatingCostSummary = {
  operatingCostAttachmentKey: string,
  fixtureId: FixtureId,
  fixtureCommercialProfileVersion: int,
  costProfileVersion: int,
  riskCostBand: 'routine' | 'elevated' | 'high' | 'restricted' | 'ghostMatch',
  estimatedOperatingCostBand: MoneyBand,
  settlementReadiness: 'estimated' | 'confirmed' | 'posted'
}
```

Background simulation can then load one commercial settlement envelope per
fixture without recomputing Rivalry/Audience/Stadium/Regulations source joins.
The summary is owned and produced by CommercialPortfolio; League only publishes
the stable attachment key.

## Invariants

| # | Invariant |
|---|---|
| **P1** | Profile events are self-contained JSON/Zod payloads; consumers never join League tables. |
| **P2** | `CompetitionRevenueProfilePublished` is emitted before fixture commercial profiles that reference its version. |
| **P3** | `FixtureCommercialProfilesPublished` references an immutable `FixturesPublished` event. |
| **P4** | Profile versions are immutable; corrections publish a new version and explicit adjustment. |
| **P5** | `FixtureCommercialProfile` contains no Rivalry/Audience/Stadium/Weather-owned demand or risk facts under D2=A. |
| **P6** | Every field maps to a named CommercialPortfolio consumer, FMX-45 concept, validation concern or provenance. |
| **P7** | CommercialPortfolio consumes through an ACL and stores consumer-owned projections. |
| **P8** | Club Management remains the sole ledger writer; CommercialPortfolio emits ledger-facing settlement events. |
| **P9** | No example uses real competition, sponsor, club or player names. |

## Map patch applied

Nico ratified D1/D2/D3 as recommended. The bounded-context map is clarified in
this ratification PR:

```diff
diff --git a/docs/10-Architecture/bounded-context-map.md b/docs/10-Architecture/bounded-context-map.md
@@
-| **League Orchestration** | Season, week, match-day, mode, pause, quorum; **Competition & Season registry** sub-aggregate cluster (ADR-0066): `Competition` + `Season` reference entities, `LeagueCompetitionSeason` edition aggregate, `PyramidConfiguration` (tier order + promotion/relegation), participants by `ClubId` ref | League status, deadlines, lifecycle events; `FixtureCommercialProfile` / `CompetitionRevenueProfile` / `SeasonAdvanced` |
+| **League Orchestration** | Season, week, match-day, mode, pause, quorum; **Competition & Season registry** sub-aggregate cluster (ADR-0066): `Competition` + `Season` reference entities, `LeagueCompetitionSeason` edition aggregate, `PyramidConfiguration` (tier order + promotion/relegation), participants by `ClubId` ref | League status, deadlines, lifecycle events; `CompetitionRevenueProfilePublished` / `FixtureCommercialProfilesPublished` / snapshot queries / `SeasonAdvanced` |
```

## Consequences

**Positive**
- Gives CommercialPortfolio a complete, versioned supplier contract for
  commercial settlement.
- Keeps volatile demand/atmosphere/cost signals in their owning contexts.
- Gives background-fast simulation a stable fixture attachment key.
- Turns FMX-45 revenue concepts into an explicit JSON/Zod contract surface.

**Negative / constraints**
- CommercialPortfolio must maintain projections for League, Rivalry, Audience,
  Stadium and Regulations facts instead of receiving one pre-enriched blob.
- Profile versioning becomes part of settlement evidence; changing field meaning
  requires schema versioning and migration thought.
- Query support must exist for reconciliation even though events are the primary
  settlement path.

## HITL gate

`accepted` / `binding: true` - Nico chose the recommended options on
2026-06-03:

1. **D1 publication mechanism:** A event-plus-query.
2. **D2 fixture-profile scope:** A stable League-owned facts only.
3. **D3 cadence ownership:** A League owns rule/cadence profiles and
   CommercialPortfolio owns settlement.

No remaining FMX-78 architecture decision is open. Future changes to field
meaning, publication cadence or ownership require ADR supersession/amendment.
