---
title: Fixture commercial and competition revenue profile publication contract (FMX-78)
status: current
tags: [research, league, competition, fixture, commercial, revenue, ddd, eventing, game-design, fmx-78]
context: [league-orchestration, commercial-portfolio]
created: 2026-06-03
updated: 2026-06-03
type: research
binding: false
linear: FMX-78
sourceType: external
related:
  - [[raw-perplexity/raw-fixture-commercial-revenue-profiles-2026-06-03]]
  - [[../10-Architecture/09-Decisions/ADR-0070-fixture-commercial-revenue-profile-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0066-competition-registry-sub-aggregate]]
  - [[../10-Architecture/09-Decisions/ADR-0068-fixture-scheduling-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[cup-and-competition-revenue-profiles-2026-05-28]]
  - [[matchday-operating-costs-and-risk-cost-settlement-2026-05-29]]
  - [[fan-demand-price-elasticity-2026-05-28]]
  - [[../30-Implementation/club-economy-commercial-contracts]]
  - [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
---

# Fixture commercial and competition revenue profile publication contract (FMX-78)

## Question

ADR-0066 makes the Competition & Season registry inside League Orchestration the
producer of `FixtureCommercialProfile`, `CompetitionRevenueProfile` and
`SeasonAdvanced`. ADR-0068 now publishes immutable fixtures through
`FixturesPublished`. ADR-0058 makes CommercialPortfolio the owner of commercial
policy, per-fixture settlement, accrual schedules and matchday operating-cost
settlement. ADR-0050 keeps Club Management the sole ledger writer.

FMX-78 asks what exact **published language** League Orchestration should expose:

- `FixtureCommercialProfile` per fixture;
- `CompetitionRevenueProfile` per competition season;
- publication trigger and mechanism;
- ACL direction into CommercialPortfolio;
- field mapping to FMX-45 revenue concepts;
- background-fast hook for `MatchdayOperatingCostSummary`.

## Summary

The recommended answer is **event-plus-query with League-owned stable
competition/fixture commercial facts only**. League Orchestration should publish
versioned, self-contained profiles through the outbox:

- `CompetitionRevenueProfilePublished` during season setup / `SeasonAdvanced`
  for each active `CompetitionSeason`;
- `FixtureCommercialProfilesPublished` after `FixturesPublished`, as a batch of
  fixture profiles keyed to the immutable fixture set and the active competition
  revenue profile version;
- snapshot queries only for bootstrap, diagnostics and reconciliation.

CommercialPortfolio consumes these through an ACL, stores immutable
consumer-owned projections, composes them with separate Rivalry, Audience,
Stadium, Regulations and Weather/Calendar facts, then emits commercial and
operating settlement events to Club Management. The profile must not copy
Rivalry/Audience/Stadium-owned demand or atmosphere signals; it should only carry
League-owned stable fixture/competition facts and fixture-specific slices of
competition commercial rules.

Nico ratified the recommended A/A/A options on 2026-06-03 in
accepted/binding [[../10-Architecture/09-Decisions/ADR-0070-fixture-commercial-revenue-profile-contract]].

## Inputs (binding/relevant vault)

- [[../10-Architecture/09-Decisions/ADR-0066-competition-registry-sub-aggregate]]
  - Competition & Season registry is inside League Orchestration and is the
  producer of profile facts.
- [[../10-Architecture/09-Decisions/ADR-0068-fixture-scheduling-contract]]
  - `FixturesPublished` is immutable, self-contained and the trigger that
  downstream consumers use to learn fixture identity/date/home/away.
- [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  - CommercialPortfolio owns commercial settlement, `AccrualSchedule`,
  `FixtureSettlement` and `MatchdayOperatingCostProfile`.
- [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - Club Management remains the only ledger writer.
- [[cup-and-competition-revenue-profiles-2026-05-28]]
  - FMX-45 revenue concepts: prize schedule, gate sharing, ticket allocation,
  media/facility payment, settlement delay, recognition, neutral venue,
  replay/two-leg, forecast policy and solidarity.
- [[matchday-operating-costs-and-risk-cost-settlement-2026-05-29]]
  - Operating-cost settlement consumes fixture/competition profile facts but is
  owned by CommercialPortfolio.

## Findings

### F1 - Real football competitions split fixture-level matchday rules from competition-season revenue rules

Domestic cups need fixture-level facts for host/organizer, home/away/neutral
venue status, replays, gate-sharing basis, allowable deductions and ticket
allocation. Competition-season profiles need prize ladders, media/facility
payment rules, solidarity, settlement timing and recognition policies. UEFA-style
continental competitions add central distribution pillars and neutral final
ticketing/commercial treatment.

**Source:** FA Cup prize fund and 2025-26 rules; UEFA Champions League 2025-26
regulations; UEFA men's competitions distribution explainer; Premier League
central revenue explainer and publications; FMX-45 source base.

**Confidence:** high for the split; medium for exact field names because FMX uses
fictional/IP-clean profile families, not copied rulebooks.

### F2 - League should publish stable facts; CommercialPortfolio should compose volatile commercial signals

`FixtureCommercialProfile` currently mixes League facts with Rivalry/Audience
and Match-context demand facts. That is convenient but blurs ownership:
`rivalryTier`, `opponentDrawPower`, `starPullBand`, `homeFormBand`,
`weatherBand`, `boycottRisk` and similar demand/risk inputs belong to Rivalry,
Audience & Atmosphere, Match/Calendar, Stadium Operations or Regulations. League
should publish stage/round/tie/venue/organizer and the fixture-specific commercial
rule slices. CommercialPortfolio composes that with downstream facts when it
settles demand, pricing, matchday revenue and operating cost.

**Source:** ADR-0058, ADR-0061, ADR-0062 and bounded-context map ownership rows;
Perplexity DDD event/query pass; Vernon/Evans Customer-Supplier and
Published-Language pattern as already used in the vault.

**Confidence:** high.

### F3 - Event-plus-query is the best publication mechanism

Settlement needs the profile version that was active when the fixture was
published or the season advanced. Event-plus-query gives CommercialPortfolio an
immutable audit trail and consumer-owned projection while retaining a supplier
query for rebuild, diagnostics and reconciliation. Event-only is pure but harder
to operate; query-only is simpler but creates runtime coupling and temporal drift
risk.

**Source:** Perplexity DDD pass; Microsoft event-driven architecture guidance
for decoupled publishers/subscribers; Fowler's published language /
bounded-context patterns.

**Confidence:** high.

### F4 - The two payloads should be self-contained and profile-versioned

A consumer should be able to validate and store each event payload without a
cross-context join to League tables. The competition profile carries the full
competition-season rule set. The fixture profile carries fixture identity plus
the fixture-specific slices required for settlement and a
`competitionRevenueProfileVersion` for reconciliation. Idempotency keys and
profile versions are mandatory because profile data becomes settlement evidence.

**Source:** ADR-0028 outbox contract style, ADR-0068 self-contained
`FixturesPublished`, DDD pass.

**Confidence:** high.

### F5 - Game UX should expose the same settlement facts at three depths

Game precedent is consistent: expert players accept dense finance tables
(`Football Manager`, OOTP-style simulations), but quick/background users need a
small event-level result and narrative explanation (Motorsport Manager
race-summary style; Anstoss-style sponsor/finance reports). FMX should therefore
use one settlement core and three presentation depths:

- Quick/background: post-match money card + season-review competition tile.
- Standard: fixture and competition breakdown with trends and explanations.
- Expert: full gate-sharing, prize, payment timing, recognition and forecast
  tables.

**Source:** Perplexity game-precedent pass; Sports Interactive manual pages for
finance screens; public OOTP manual/wiki finance surfaces; FMX progressive
disclosure research.

**Confidence:** medium, because UI precedent evidence includes community sources.

## Recommended payload taxonomy

### `CompetitionRevenueProfile`

Published by League Orchestration for one `competitionSeasonId`. It contains
competition-season rules, not per-fixture outcomes.

| Field group | Fields | Consumer / FMX-45 mapping |
|---|---|---|
| Identity/version | `competitionRevenueProfileId`, `competitionRevenueProfileVersion`, `competitionId`, `competitionSeasonId`, `seasonId`, `countryProfileId`, `competitionKind`, `effectiveFromWeek`, `provenance` | ACL validation, settlement audit, IP-clean source profile, profile versioning. |
| Organizer/rights | `organizerKind`, `commercialRightsModel`, `mediaRightsModel`, `centralInventoryPolicy` | Media/facility payment, neutral venue, central commercial carve-outs. |
| Prize rules | `prizeSchedule`, `participationRules`, `performanceBonusRules`, `progressionBonusRules`, `winnerRunnerUpRules`, `solidarityRule` | `CompetitionPrizeReceivableRecorded`, `CompetitionPrizeCashReceived`, solidarity and forecast policy. |
| Gate rules | `defaultGateSharingByStage`, `netReceiptsDefinition`, `deductibleExpenseBands`, `organizerLevyPolicy`, `neutralVenueOverrides` | `CupGateShareSettled`, neutral semi/final handling. |
| Ticket/allocation | `ticketAllocationByStage`, `awayAllocationRule`, `finalistAllocationRule`, `protectedAllocationRule`, `pricingConstraintRule` | Ticket allocation, away/final allocation and season-ticket cup material-right hooks. |
| Media/facility | `mediaDistributionRule`, `facilityFeeRule`, `liveSelectionRule`, `paymentCadence`, `withholdingAdjustmentRule` | `CupMediaFacilityFeeSettled`, delayed receivables, central distribution. |
| Tie rules | `drawResolutionRule`, `replayPolicy`, `twoLegPolicy`, `finalVenuePolicy` | Replay/two-leg settlement and extra fixture publication. |
| Recognition/forecast | `recognitionPolicy`, `settlementDelay`, `forecastPolicy`, `eliminationShockPolicy`, `receivableRiskBand` | Accrual schedule, secured vs receivable vs future EV, elimination shock. |
| Community/IP | `communityOverridePolicy`, `ipCleanSourceProfile` | Community-pack override boundary and no licensed competition cloning. |

### `FixtureCommercialProfile`

Published by League Orchestration after the immutable fixture set exists. It
contains the fixture-specific commercial rule slice.

| Field group | Fields | Consumer / FMX-45 mapping |
|---|---|---|
| Identity/version | `fixtureCommercialProfileId`, `fixtureCommercialProfileVersion`, `fixtureId`, `competitionSeasonId`, `competitionRevenueProfileVersion`, `seasonId`, `round`, `matchday`, `scheduledDate`, `homeClubId`, `awayClubId`, `provenance` | Idempotent ACL projection; ties to `FixturesPublished`. |
| Fixture shape | `fixtureKind`, `stageBand`, `roundBand`, `tieShape`, `legNumber`, `aggregateTieId`, `isReplay`, `isNeutralVenue`, `isFinal` | Fixture settlement kind, replay/two-leg/neutral/final logic. |
| Organizer/venue | `organizerKind`, `hostClubId`, `venueResponsibilityKind`, `ticketingOperatorKind`, `commercialInventoryPolicy` | Host/organizer responsibility, neutral/final handling, local vs central rights. |
| Gate/ticket slice | `gateSharingRuleSnapshot`, `netReceiptsDefinitionSnapshot`, `ticketAllocationRuleSnapshot`, `awayAllocationRuleSnapshot` | Gate sharing, ticket allocation and supporter allocation settlement. |
| Prize/media slice | `fixturePrizeTrigger`, `facilityFeeTrigger`, `broadcastSelectionBand`, `paymentTrigger`, `recognitionTrigger` | Prize/media/facility receivables and accrual timing. |
| Calendar/accounting | `accountingPeriod`, `settlementDueRule`, `postponementHandling`, `abandonmentHandling` | Timing, refunds/credits, deferred recognition. |
| Background-fast hook | `commercialSettlementAttachmentKey`, `operatingCostAttachmentKey`, `qualityProfileClass` | CommercialPortfolio attaches `MatchdayOperatingCostSummary` without recomputing source joins during background simulation. |

Fields intentionally **not** carried by League-owned
`FixtureCommercialProfile`: `rivalryTier`, `opponentDrawPower`, `starPullBand`,
`homeFormBand`, `weatherBand`, `awayDemandBand`, `boycottRisk`,
`atmosphereMultiplier`, final demand or final cost. Those arrive through
separate consumer inputs.

## Publication mechanism options for Nico

### D1 - Publication mechanism

| Option | Trade-off |
|---|---|
| **A. Event-plus-query** - publish profile events through the outbox; expose snapshot queries for bootstrap/reconciliation. **Recommended.** | Strong audit/replay, low settlement coupling, operationally recoverable. More contract surface than query-only. |
| B. Event-only | Strongest decoupling, but rebuild and diagnostics require complete replay tooling from day one. |
| C. Query/read-model only | Fastest to implement, but settlement depends on supplier availability/latest state and weakens profile-version audit. |

### D2 - `FixtureCommercialProfile` scope

| Option | Trade-off |
|---|---|
| **A. League-owned stable facts only.** **Recommended.** | Clean ownership; no stale copied rivalry/audience/weather facts; CommercialPortfolio composes all signals. Requires consumers to manage several projections. |
| B. Enriched profile includes rivalry/atmosphere/weather/demand bands | Convenient for one consumer, but duplicates other contexts' facts and risks stale profile state. |
| C. Minimal identity-only profile | Safest ownership, but too weak for FMX-78 acceptance and pushes all commercial rule lookup into CommercialPortfolio. |

### D3 - Competition revenue cadence ownership

| Option | Trade-off |
|---|---|
| **A. League owns competition rule/cadence profiles; CommercialPortfolio owns accrual/settlement interpretation.** **Recommended.** | Matches ADR-0066/0058: League knows competition rules, CommercialPortfolio knows commercial accounting and settlement. |
| B. League owns full payment/prize calculations and amounts | Makes League too commercial/financial and risks contradicting CommercialPortfolio ownership. |
| C. CommercialPortfolio owns competition profiles entirely | Simplifies consumer implementation, but contradicts the bounded-context map promise that League supplies the profiles. |

## Inputs for ADR-0070

- Public contract: `CompetitionRevenueProfilePublished`,
  `FixtureCommercialProfilesPublished`,
  `CompetitionRevenueProfileSnapshot`,
  `FixtureCommercialProfileSnapshot`.
- Consumer ACL: CommercialPortfolio validates schema/profile version,
  idempotency, provenance and IP-clean source profile before storing snapshots.
- Storage rule: consumer-owned immutable projection in CommercialPortfolio; League
  remains supplier and does not expose tables for joins.
- Determinism/audit: profile events are versioned and immutable for the active
  fixture/season; retroactive changes create a new profile version plus explicit
  adjustment event, never silent mutation.
- Background-fast: `operatingCostAttachmentKey` is the per-fixture point where
  CommercialPortfolio attaches `MatchdayOperatingCostSummary`.

## No new GDDR

This beat refines a publication contract and presentation implications for
existing draft [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]].
No new gameplay pillar is created. GD-0022 should be amended only to clarify that
League-owned `FixtureCommercialProfile` carries stable fixture/competition facts,
while player-facing demand/cost explanations are composed in CommercialPortfolio.

## Sources

- Raw Perplexity capture: [[raw-perplexity/raw-fixture-commercial-revenue-profiles-2026-06-03]]
- FA Cup prize fund: <https://www.thefa.com/competitions/thefacup/prize-fund>
- FA Cup rules 2025-26: <https://www.thefa.com/-/media/thefacom-new/files/competitions/2025-26/rules/rules-of-the-fa-challenge-cup-2025-26.ashx>
- UEFA Champions League 2025-26 regulations: <https://documents.uefa.com/r/Regulations-of-the-UEFA-Champions-League-2025/26>
- UEFA Champions League Article 67 financial rules: <https://documents.uefa.com/r/Regulations-of-the-UEFA-Champions-League-2025/26/Article-67-Financial-rules-play-offs-and-UEFA-Champions-League-matches-Online>
- UEFA men's competitions distribution explainer: <https://www.uefa.com/news-media/news/028c-1a963496826a-bf40705cb183-1000--men-s-competitions/>
- UEFA UCL revenue distribution: <https://www.uefa.com/uefachampionsleague/about/revenue-distribution/>
- Premier League central revenue explainer: <https://www.premierleague.com/en/news/1693127>
- Premier League publications: <https://www.premierleague.com/publications>
- EFL rules and regulations: <https://www.efl.com/governance/efl-rules-regulations/>
- IFRS 15: <https://www.ifrs.org/issued-standards/list-of-standards/ifrs-15-revenue-from-contracts-with-customers/>
- Sports Interactive finance manual page: <https://community.sports-interactive.com/sigames-manual/football-manager-2023/finances-r4734/>
- OOTP 25 manual: <https://manuals.ootpdevelopments.com/index.php?man=ootp25>
- Martin Fowler, Published Language: <https://martinfowler.com/eaaCatalog/publishedLanguage.html>
- Microsoft event-driven architecture guide: <https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/event-driven>
