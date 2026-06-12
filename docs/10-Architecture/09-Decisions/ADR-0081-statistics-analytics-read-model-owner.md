---
title: ADR-0081 Statistics & Analytics read-model owner
status: accepted
tags: [adr, architecture, statistics, analytics, standings, read-model, cqrs, ddd, projections, fmx-94, fmx-131]
created: 2026-06-05
updated: 2026-06-12
type: adr
binding: true
supersedes:
superseded_by:
related:
  - [[../../60-Research/statistics-analytics-read-model-owner-2026-06-05]]
  - [[../../60-Research/raw-perplexity/raw-statistics-analytics-read-model-owner-2026-06-05]]
  - [[../../60-Research/standings-authority-league-vs-statistics-2026-06-12]]
  - [[../../60-Research/raw-perplexity/raw-standings-authority-league-vs-statistics-2026-06-12]]
  - [[../../50-Game-Design/GD-0031-analytics-hub-and-statistics]]
  - [[../../20-Features/feature-statistics-analytics-hub-mvp]]
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[ADR-0068-fixture-scheduling-contract]]
  - [[ADR-0051-manager-and-legacy-context]]
  - [[ADR-0074-tactical-identity-fingerprint-aggregation]]
  - [[../bounded-context-map]]
---

# ADR-0081: Statistics & Analytics read-model owner

## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `proposed`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

Nico selected the planning line live on 2026-06-05: dedicated projection-only
owner, per-save projections plus immutable Manager & Legacy / HoF handoff
snapshots, full MVP Analytics Hub, and the core-plus-model metric set.

> **FMX-131 amendment 2026-06-12.** Statistics & Analytics owns standings
> history/display projections, league leaders and analytics snapshots. It does
> **not** own official ordering, tie-break authority, promotion/relegation,
> qualification or season rollover. League Orchestration owns those structural
> outcomes via ADR-0066's `GetOfficialCompetitionStandings` /
> `CompetitionStandingsFinalizedV1`.

## Date

- Proposed: 2026-06-05
- Accepted (vault-wide ratification): 2026-06-08
- Amended (FMX-131, Nico): 2026-06-12

## Context

Gap **G19** from the domain-model audit states that no context owns per-match,
per-season and career statistics aggregation beyond Squad & Player's local
Impact Lens. [[ADR-0068-fixture-scheduling-contract]] also deliberately leaves
`CompetitionStatus.standingsRef` as a reference to a separate standings read
model and asks a follow-up to name the statistics owner.

The answer must preserve FMX's DDD rules:

- source contexts own authoritative facts and command invariants;
- cross-context reads use public queries, published events or denormalised
  projections;
- projections use [[ADR-0028-postgres-transactional-outbox]] idempotency and
  schema-validated event contracts;
- Manager & Legacy must not read mutable cross-save or cross-context state in a
  running save.

## Options considered

| Option | Description | Assessment |
|---|---|---|
| A | Dedicated projection-only **Statistics & Analytics** owner | Best fit. One canonical owner for standings, stat lines, leaders, match analytics, versioned metrics and long-save handoff snapshots. |
| B | Squad & Player owns the projection family | Too narrow. It fits Impact Lens but not standings, team analytics, match maps, competition leaders or Manager & Legacy handoffs. |
| C | UI/API composition over source read models | Too weak for MVP. It creates edge joins, fragmented metric semantics and no rebuild/version owner. |

## Decision

**Statistics & Analytics** is a projection-only bounded context owner.

It owns:

- match, player, team, competition and season statistics read models;
- standings history/display projections and league leaders;
- metric definitions and metric-set versions;
- derived analytics outputs such as xG/xA/xGA, PPDA, field tilt, shot/pass
  maps, heatmaps, zone control, form and comparison views;
- immutable `SeasonAnalyticsHandoffSnapshot` records for Manager & Legacy /
  Hall-of-Fame and prestige follow-ups.

It does **not** own:

- match simulation, results or event truth;
- competition format, fixtures, official ordering, tie-break authority,
  promotion/relegation, qualification or season lifecycle;
- player identity, squad membership, contracts, injuries or eligibility;
- finance/board/club command state;
- Manager & Legacy scoring formulas, prestige decisions or HoF induction rules;
- product/user telemetry analytics.

## Public queries

```ts
GetAnalyticsHub = {
  saveId: SaveId
  managerScope: ManagerScope
  window: AnalyticsWindow
} -> AnalyticsHubProjection

GetMatchAnalytics = {
  fixtureId: FixtureId
} -> MatchAnalyticsProjection

GetPlayerStatHistory = {
  playerId: PlayerId
  scope: PlayerStatScope
  metricSetVersion: MetricSetVersion
} -> PlayerStatHistory

GetTeamForm = {
  clubId: ClubId
  window: FormWindow
  metricSetVersion: MetricSetVersion
} -> TeamFormWindow

GetCompetitionStandingsHistory = {
  competitionSeasonId: CompetitionSeasonId
  roundRange?: RoundRange
} -> CompetitionStandingsHistory // display/history projection; not structural authority

GetLeagueLeaders = {
  competitionSeasonId: CompetitionSeasonId
  metricId: MetricId
  filters?: LeaderboardFilters
} -> LeagueLeaderboard

GetPlayerComparison = {
  playerIds: PlayerId[]
  scope: PlayerStatScope
  metricSetVersion: MetricSetVersion
} -> PlayerComparisonProjection

GetTeamComparison = {
  clubIds: ClubId[]
  scope: TeamStatScope
  metricSetVersion: MetricSetVersion
} -> TeamComparisonProjection
```

## Projection catalog

```ts
MatchAnalyticsProjection = {
  fixtureId: FixtureId
  projectionVersion: ProjectionVersion
  metricSetVersion: MetricSetVersion
  sourceEventWatermark: EventWatermark
  result: MatchResultSummary
  teamStats: TeamMatchStatLine[]
  playerStats: PlayerMatchStatLine[]
  derived: {
    xg: TeamMetricPair
    xa: TeamMetricPair
    xga: TeamMetricPair
    ppda: TeamMetricPair
    fieldTilt: TeamMetricPair
    zoneControl: ZoneControlGrid
    shotMapRef: AnalyticsAssetRef
    passMapRef: AnalyticsAssetRef
    heatmapRefs: AnalyticsAssetRef[]
  }
}

PlayerSeasonStatLine = {
  playerId: PlayerId
  clubId: ClubId
  competitionSeasonId: CompetitionSeasonId
  projectionVersion: ProjectionVersion
  metricSetVersion: MetricSetVersion
  appearances: int
  starts: int
  minutes: int
  goals: int
  assists: int
  cards: CardSummary
  per90: MetricValueMap
  derived: MetricValueMap
}

PlayerCareerStatLine = {
  playerId: PlayerId
  projectionVersion: ProjectionVersion
  seasons: PlayerSeasonStatLine[]
  totals: PlayerCareerTotals
}

TeamSeasonAnalytics = {
  clubId: ClubId
  competitionSeasonId: CompetitionSeasonId
  projectionVersion: ProjectionVersion
  metricSetVersion: MetricSetVersion
  official: TeamOfficialStatLine
  derived: MetricValueMap
  percentileRanks: MetricPercentileMap
}

TeamFormWindow = {
  clubId: ClubId
  window: FormWindow
  projectionVersion: ProjectionVersion
  matches: FixtureId[]
  officialTrend: MetricTrendMap
  derivedTrend: MetricTrendMap
}

CompetitionStandingsHistory = {
  competitionSeasonId: CompetitionSeasonId
  projectionVersion: ProjectionVersion
  sourceOfficialOrderingWatermark?: EventWatermark
  rounds: StandingsRoundSnapshot[]
}

LeagueLeaderboard = {
  competitionSeasonId: CompetitionSeasonId
  metricId: MetricId
  projectionVersion: ProjectionVersion
  metricSetVersion: MetricSetVersion
  rows: LeaderboardRow[]
}

AnalyticsMetricDefinition = {
  metricId: MetricId
  metricSetVersion: MetricSetVersion
  displayName: string
  family: 'official-count' | 'derived-model' | 'visual-derived'
  unit: MetricUnit
  inputRequirements: AnalyticsInputRequirement[]
  owner: 'statistics-and-analytics'
}

SeasonAnalyticsHandoffSnapshot = {
  saveId: SaveId
  seasonId: SeasonId
  managerId: ManagerId
  projectionVersion: ProjectionVersion
  metricSetVersion: MetricSetVersion
  frozenAt: Instant
  sourceEventWatermark: EventWatermark
  clubSeasonSummaries: TeamSeasonAnalytics[]
  playerHighlights: PlayerSeasonStatLine[]
  standingsFinal: CompetitionStandingsHistory
  recordsAndLeaders: LeagueLeaderboard[]
}
```

## Source inputs

Statistics & Analytics consumes source-owned public facts only:

| Context | Input category |
|---|---|
| Match | Match result, event, spatial and analytics output layers from [[../../50-Game-Design/match-engine]]. |
| League Orchestration | Competition/season rule snapshots, `FixturesPublished`, `SeasonAdvanced`, competition status lifecycle, `CompetitionStandingsFinalizedV1` and official standings snapshots from ADR-0066. |
| Squad & Player | Player and squad identity snapshots, roster membership, eligibility labels and public player facts required to label stats. |
| Club Management | Club identity and season club labels only; no ledger joins. |
| Tactics | Optional `TacticSnapshot` / tactical-style labels for comparisons and style context. |
| Manager & Legacy | Snapshot consumer only; no live read dependency back into Statistics during command handling. |

## Invariants

| # | Invariant | Enforcement |
|---|---|---|
| **SA1** | Statistics & Analytics projections are read models, not command authority. They cannot decide champion, qualification, promotion/relegation or season rollover outcomes. | contract review |
| **SA2** | No Statistics query may join private source-context tables. | module boundary / review |
| **SA3** | Projection handlers are idempotent through ADR-0028 consumer offsets or equivalent processed-event tracking. | projection infrastructure |
| **SA4** | Rebuild with the same source facts + `metricSetVersion` produces the same projection output. | golden projection tests |
| **SA5** | Standings projections are computed from Match result facts plus League-owned rules and/or `CompetitionStandingsFinalizedV1`; the projection never mutates League state and is never read by the Pyramid-rollover process manager. | standings projector |
| **SA6** | Derived metrics carry `metricSetVersion`; official counts and model estimates are labeled separately in query payloads. | schema + UI contract |
| **SA7** | Manager & Legacy consumes immutable `SeasonAnalyticsHandoffSnapshot` records, not live mutable analytics joins. | snapshot protocol |
| **SA8** | Analytics rebuild/migration supports side-by-side projection versions before switching consumers. | rebuild runbook |
| **SA9** | In-world football statistics are separate from product/user telemetry analytics and inherit no telemetry consent semantics. | privacy review |

## Consequences

**Positive**

- Closes G19 and gives [[ADR-0068-fixture-scheduling-contract]] a concrete
  `standingsRef` owner.
- Keeps source contexts authoritative while giving the MVP Analytics Hub one
  canonical metric layer.
- Preserves long-save memory through immutable handoff snapshots.
- Gives FMX a clean future extraction path if statistics/analytics later needs
  its own service or specialized storage.

**Negative / constraints**

- Adds a projection-only bounded-context owner with rebuild/version
  obligations.
- Source contexts must publish enough self-contained facts for projections.
- Every derived metric now has versioning and rebuild obligations.
- Official standings authority stays in League Orchestration; analytics cannot
  silently add a second tie-break rule or structural ordering.

## Verification

- Fixture `CompetitionStatus.standingsRef` resolves to
  `CompetitionStandingsHistory` for display/history only.
- Promotion/relegation and season rollover use ADR-0066
  `GetOfficialCompetitionStandings` / `CompetitionStandingsFinalizedV1`, not a
  Statistics projection.
- Replaying a fixed set of Match + League source facts rebuilds byte-identical
  standings and league leaders for the same `metricSetVersion`.
- Reprocessing the same source event is a no-op.
- Switching `metricSetVersion` can rebuild side-by-side without mutating the old
  projection.
- Manager & Legacy imports `SeasonAnalyticsHandoffSnapshot` and never reads live
  projection tables during a running save.

## Related

- [[../../60-Research/statistics-analytics-read-model-owner-2026-06-05]]
- [[../../60-Research/raw-perplexity/raw-statistics-analytics-read-model-owner-2026-06-05]]
- [[../../60-Research/standings-authority-league-vs-statistics-2026-06-12]]
- [[../../60-Research/raw-perplexity/raw-standings-authority-league-vs-statistics-2026-06-12]]
- [[../../50-Game-Design/GD-0031-analytics-hub-and-statistics]]
- [[../../20-Features/feature-statistics-analytics-hub-mvp]]
- [[ADR-0068-fixture-scheduling-contract]]
- [[ADR-0028-postgres-transactional-outbox]]
- [[ADR-0051-manager-and-legacy-context]]
- [[ADR-0074-tactical-identity-fingerprint-aggregation]]
