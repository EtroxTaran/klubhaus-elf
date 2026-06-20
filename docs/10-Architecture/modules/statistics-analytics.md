---
title: Statistics & Analytics module
status: draft
tags: [architecture, module, statistics, analytics]
context: statistics-analytics
created: 2026-06-20
updated: 2026-06-20
type: module
binding: false
related: [[../05-Building-Blocks]], [[../bounded-context-map]], [[../09-Decisions/ADR-0081-statistics-analytics-read-model-owner]], [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]], [[../09-Decisions/ADR-0027-postgres-data-model]]
---

# Statistics & Analytics Boundary

## Purpose

Projection-only read-model owner (ADR-0081): turns source-owned match, player,
team, competition and season facts into a single rebuildable, versioned metric
layer — standings history, stat lines, league leaders, derived analytics and
immutable handoff snapshots — without holding command authority.

## Owns

- Match, player, team, competition and season statistics read models.
- Standings history/display projections and league leaders.
- Metric definitions and metric-set versions (`AnalyticsMetricDefinition`).
- Derived analytics outputs: xG/xA/xGA, PPDA, field tilt, shot/pass maps,
  heatmaps, zone control, form and comparison views.
- Immutable `SeasonAnalyticsHandoffSnapshot` records for Manager & Legacy /
  Hall-of-Fame handoff.
- Projection-version and rebuild/migration state (`projectionVersion`,
  consumer offsets / processed-event tracking).

It does **not** own: match simulation/results/event truth; competition format,
fixtures, official ordering, tie-break authority, promotion/relegation,
qualification or season lifecycle; player/squad/contract identity; finance/board
state; Manager & Legacy scoring or HoF rules; product/user telemetry analytics.

## Public contract

### Queries

- `GetAnalyticsHub { saveId, managerScope, window } -> AnalyticsHubProjection`
- `GetMatchAnalytics { fixtureId } -> MatchAnalyticsProjection`
- `GetPlayerStatHistory { playerId, scope, metricSetVersion } -> PlayerStatHistory`
- `GetTeamForm { clubId, window, metricSetVersion } -> TeamFormWindow`
- `GetCompetitionStandingsHistory { competitionSeasonId, roundRange? } -> CompetitionStandingsHistory` (display/history projection; not structural authority)
- `GetLeagueLeaders { competitionSeasonId, metricId, filters? } -> LeagueLeaderboard`
- `GetPlayerComparison { playerIds, scope, metricSetVersion } -> PlayerComparisonProjection`
- `GetTeamComparison { clubIds, scope, metricSetVersion } -> TeamComparisonProjection`

### Projections (read-model payloads)

`MatchAnalyticsProjection`, `PlayerSeasonStatLine`, `PlayerCareerStatLine`,
`TeamSeasonAnalytics`, `TeamFormWindow`, `CompetitionStandingsHistory`,
`LeagueLeaderboard`, `AnalyticsMetricDefinition`, `SeasonAnalyticsHandoffSnapshot`.

### Commands / Domain Events

None are defined in ADR-0081 or the BCM exposed-outputs column — see Open items.
This context is projection-only: it publishes read-model queries/projections,
not commands, and ADR-0081 does not enumerate any outbound domain events.

## Storage ownership

- Owns its own projection schema/tables under the ADR-0027 Postgres data model;
  per-save projections plus immutable snapshot records.
- Per ADR-0121 (no shared tables): no Statistics query may join private
  source-context tables (invariant SA2); reads of source facts go through
  public queries / published events / denormalised projections.

## Consumers / Producers

**Consumes (source facts, public only):**

- Match — result, event, spatial and analytics output layers.
- League Orchestration — competition/season rule snapshots, `FixturesPublished`,
  `SeasonAdvanced`, competition-status lifecycle, `CompetitionStandingsFinalizedV1`
  and official standings snapshots (ADR-0066).
- Squad & Player — player/squad identity snapshots, roster membership,
  eligibility labels, public player facts.
- Club Management — club identity and season club labels only (no ledger joins).
- Tactics — optional `TacticSnapshot` / tactical-style labels.

**Consumed by:**

- Manager & Legacy — imports immutable `SeasonAnalyticsHandoffSnapshot` records
  only (no live read dependency during command handling).
- Analytics Hub / standings / league-leaders / season-history surfaces — via the
  public queries above.

## Invariants

- **SA1** Projections are read models, not command authority; cannot decide
  champion, qualification, promotion/relegation or season rollover.
- **SA2** No query joins private source-context tables.
- **SA3** Projection handlers are idempotent (ADR-0028 consumer offsets /
  processed-event tracking).
- **SA4** Rebuild with same source facts + `metricSetVersion` is deterministic.
- **SA5** Standings projections derive from Match result facts + League rules
  and/or `CompetitionStandingsFinalizedV1`; never mutate League state; never read
  by the Pyramid-rollover process manager.
- **SA6** Derived metrics carry `metricSetVersion`; official counts vs model
  estimates labelled separately in payloads.
- **SA7** Manager & Legacy consumes immutable snapshots, not live analytics joins.
- **SA8** Rebuild/migration supports side-by-side projection versions before
  consumer switch.
- **SA9** In-world football statistics are separate from product/user telemetry
  and inherit no telemetry consent semantics.

## Open items

- ADR-0081 and the BCM define no outbound **Domain Events** for this context
  (e.g. a "projection ready / snapshot frozen" signal); whether
  `SeasonAnalyticsHandoffSnapshot` availability is event-driven or pull-only is
  unspecified.
- No **Commands** are defined; rebuild/migration (SA8) and snapshot freezing
  (SA7) imply operations but the triggering command/contract is not pinned down.
- Concrete schema/table names are not enumerated in the source (only that the
  context owns its own tables under ADR-0027 / ADR-0121).

## Dependencies

- [[../09-Decisions/ADR-0081-statistics-analytics-read-model-owner]] (context owner; accepted/binding)
- [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]] (no shared tables)
- [[../09-Decisions/ADR-0027-postgres-data-model]] (data model)
- [[../09-Decisions/ADR-0028-postgres-transactional-outbox]] (idempotent projection consumers)
- [[../09-Decisions/ADR-0066-competition-registry-sub-aggregate]] (official standings source: `GetOfficialCompetitionStandings` / `CompetitionStandingsFinalizedV1`)
