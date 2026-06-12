---
title: Standings Authority - League vs Statistics (FMX-131)
status: current
tags: [research, standings, league, statistics, analytics, cqrs, ddd, process-manager, promotion, relegation, fmx-131]
created: 2026-06-12
updated: 2026-06-12
type: research
binding: false
linear: FMX-131
related:
  - [[raw-perplexity/raw-standings-authority-league-vs-statistics-2026-06-12]]
  - [[../10-Architecture/09-Decisions/ADR-0066-competition-registry-sub-aggregate]]
  - [[../10-Architecture/09-Decisions/ADR-0068-fixture-scheduling-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0081-statistics-analytics-read-model-owner]]
  - [[../10-Architecture/bounded-context-map]]
  - [[../50-Game-Design/GD-0031-analytics-hub-and-statistics]]
---

# Standings Authority - League vs Statistics (FMX-131)

FMX-131 reconciles an ownership seam between
[[../10-Architecture/09-Decisions/ADR-0066-competition-registry-sub-aggregate]]
and [[../10-Architecture/09-Decisions/ADR-0081-statistics-analytics-read-model-owner]]:
ADR-0066 said the `LeagueCompetitionSeason` edition owns "schedule/standings",
while ADR-0081 made Statistics & Analytics a projection-only owner for
`CompetitionStandingsHistory`. The unresolved risk was the
Pyramid-rollover process manager reading a rebuildable/eventually consistent
projection to decide promotion/relegation.

Raw Perplexity capture:
[[raw-perplexity/raw-standings-authority-league-vs-statistics-2026-06-12]].

## Research conclusion

The safe split is:

| Concern | Owner | Reason |
|---|---|---|
| Tie-break rule order and rule version | League Orchestration | Competition rules are domain policy, not analytics policy. |
| Official current/final ordering | League Orchestration | Binding outcomes need a single source-domain authority. |
| Promotion/relegation/qualification/season rollover | League Orchestration | These are commands/structural outcomes, not read-model side effects. |
| Standings history, leaderboards, trend windows, what-if/display projections | Statistics & Analytics | These are rebuildable read models for UX/history/analytics. |
| Derived metrics used as tie-break inputs | Statistics may compute; League consumes by explicit rule | Analytics can provide an input, but League decides if/how the input participates. |

## DDD / CQRS rationale

For correctness-critical command decisions, DDD/CQRS practice keeps invariants
and business decisions in the write/source model. Read models are optimized for
queries and can be eventually consistent, rebuilt or versioned. A process
manager/saga should normally react to source-domain events or call an
authoritative source-domain query. It should not decide irreversible outcomes
from an asynchronous projection unless the domain explicitly accepts stale
decisions and compensation.

For FMX, promotion/relegation is a binding structural outcome. It affects next
season registration, schedules, finance, reputation, records and narrative.
Therefore the Pyramid-rollover process manager must read League-owned official
standings, not `CompetitionStandingsHistory`.

## Real-world and game-design rationale

Real competitions publish the official tie-breaker procedure and final ordering
through the league/conference/competition authority. Analytics metrics can appear
as inputs in those procedures, but the authority chooses the rule sequence and
final fallback. Sports platforms mirror the same pattern: league rules compute
standings/seeding, while statistics provide inputs and display surfaces.

For FMX, this maps cleanly to bounded contexts: League Orchestration owns the
competition rule and official season outcome; Statistics & Analytics consumes
official outcomes plus match/source facts to build history, leaderboards and
the Analytics Hub.

## Ratified FMX-131 line

Nico selected the following line before implementation:

- **League authority:** League owns `TieBreakerRule`, rule versions, official
  current/final ordering and structural outcomes.
- **Statistics projection:** Statistics owns `CompetitionStandingsHistory`,
  league leaders, analytics surfaces and immutable handoff snapshots.
- **Contract shape:** League publishes `CompetitionStandingsFinalizedV1` and
  exposes `GetOfficialCompetitionStandings`. Statistics consumes that event/query
  but is never the command source for League rollover.
- **ADR handling:** ADR-0081 remains accepted/binding; ADR-0066, ADR-0068 and
  ADR-0081 are amended in place with a dated FMX-131 note.

## Contract sketch

```ts
GetOfficialCompetitionStandings = {
  competitionSeasonId: CompetitionSeasonId
} -> OfficialCompetitionStandings | null

CompetitionStandingsFinalizedV1 = {
  competitionSeasonId: CompetitionSeasonId
  competitionId: CompetitionId
  seasonId: SeasonId
  ruleVersion: CompetitionRuleVersion
  sourceResultWatermark: EventWatermark
  finalizedAt: Instant
  rows: OfficialStandingRow[]
}

OfficialStandingRow = {
  rank: int
  clubId: ClubId
  played: int
  won: int
  drawn: int
  lost: int
  goalsFor: int
  goalsAgainst: int
  goalDifference: int
  points: int
  tieBreakerTrace: TieBreakerTrace[]
  structuralOutcome?: 'champion' | 'qualified' | 'promoted' | 'relegated' | 'playoff'
}
```

## Sources

- CQRS.com, "Domain-Driven Design":
  <https://www.cqrs.com/concepts/domain-driven-design/>
- Rico Fritzsche, "CQRS/Event Sourcing projections":
  <https://ricofritzsche.me/cqrs-event-sourcing-projections/>
- Event-Driven.io, "Saga and Process Manager - distributed transactions":
  <https://event-driven.io/en/saga_process_manager_distributed_transactions/>
- Sun Belt Conference, "Football Tie-Breakers":
  <https://sunbeltsports.org/sports/2018/8/30/FB_Tie-Breakers.aspx>
- ESPN Support, "Playoff Seeding: How Regular Season Standings Tiebreakers Work":
  <https://support.espn.com/hc/en-us/articles/360036952471-Playoff-Seeding-How-Regular-Season-Standings-Tiebreakers-Work>
- Big Ten, "Football Tiebreaking Procedures":
  <https://bigten.org/fb/article/blt6104802d94ebe1ab/>
- Pioneer Football League, "PFL Tiebreaker":
  <https://pioneer-football.org/sports/2024/5/21/PFL%20Tiebreaker.aspx>
- Ivy League, tiebreaker/AQ procedures:
  <https://ivyleague.com/sports/2025/9/15/general-untitled-sportfile.aspx>
