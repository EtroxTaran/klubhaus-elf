---
title: Statistics & Analytics Read-Model Owner (FMX-94)
status: current
tags: [research, statistics, analytics, read-model, cqrs, ddd, match, league, mvp, fmx-94]
created: 2026-06-05
updated: 2026-06-05
type: research
binding: false
linear: FMX-94
related:
  - [[raw-perplexity/raw-statistics-analytics-read-model-owner-2026-06-05]]
  - [[../10-Architecture/09-Decisions/ADR-0081-statistics-analytics-read-model-owner]]
  - [[../50-Game-Design/GD-0031-analytics-hub-and-statistics]]
  - [[../20-Features/feature-statistics-analytics-hub-mvp]]
  - [[../10-Architecture/09-Decisions/ADR-0068-fixture-scheduling-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]]
  - [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
  - [[../10-Architecture/09-Decisions/ADR-0074-tactical-identity-fingerprint-aggregation]]
  - [[../10-Architecture/bounded-context-map]]
  - [[../50-Game-Design/match-engine]]
  - [[player-strength-presentation]]
---

# Statistics & Analytics Read-Model Owner (FMX-94)

FMX-94 closes domain-audit gap **G19**: no context owned match, season, career,
standings and analytics read models beyond Squad & Player's local Impact Lens.
It also resolves the dependency left by
[[../10-Architecture/09-Decisions/ADR-0068-fixture-scheduling-contract]]:
`CompetitionStatus.standingsRef` is a reference to a separate standings read
model, but ADR-0068 intentionally did not name the owner.

Important correction: the Linear issue references ADR-0013, but
[[../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]] is superseded.
The current outbox and projection reference is
[[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]].

## Selected planning line

| Decision | Nico selection | Rationale |
|---|---|---|
| Owner | Dedicated projection-only **Statistics & Analytics** owner | Cross-context stats need one canonical projection owner without moving domain invariants out of source contexts. |
| Persistence | Per-save projections + immutable Manager & Legacy / HoF handoff snapshots | Running saves need rebuildable analytics; long-save legacy needs frozen season/run summaries that do not drift after model updates. |
| MVP scope | Full MVP **Analytics Hub** | The hub is a decision-feedback and retention pillar, not only future infrastructure. |
| Metric set | Core stats + xG/xA/xGA, PPDA, field tilt, shot/pass maps, heatmaps, zone control, per-90 leaderboards, form, player/team comparisons | Matches modern football-manager expectations while keeping xT/OBV/custom reports/export/similarity search post-MVP. |

## Real-world grounding

Football analytics practice separates source facts from interpretation:

- **Official facts**: fixture, result, goals, cards, substitutions, player
  appearances, competition rule, standings/tables and official awards.
- **Counting projections**: player season/career lines, team stat lines and
  league leaders. These are factual but still computed from match and
  registration facts.
- **Derived analytics**: xG/xA/xGA, PPDA, field tilt, heatmaps, shot/pass maps,
  zone control, momentum and style indicators. These depend on model
  definitions, input coverage and aggregation rules.

Provider practice reinforces the same split: event and tracking data support
analytics, but vendor schemas/models and exact outputs differ. For FMX, all
simulated event streams are ours, but model outputs still need explicit
definition/versioning so saves remain explainable after tuning.

## Comparable games

Football Manager's Data Hub pattern supports immediate football decisions:
last-match review, key findings, team and player analysis, xG/xGA, PPDA,
pressures, per-90 comparisons, pass maps and form views. The risk is data
overload; FMX should surface curated "why it matters" findings and link from an
insight to the relevant tactic, squad, training or transfer action.

OOTP demonstrates the long-save retention side: league/team/player history,
career stat lines, records, awards, leaderboards, Hall-of-Fame surfaces and
season-over-season comparison make old saves meaningful. FMX should not wait for
a post-MVP rewrite to preserve the inputs for those surfaces. The MVP hub should
include early records/history plus immutable handoff snapshots, while deep
HoF voting, custom reports and cross-save comparison stay later.

## Architecture grounding

FMX already has the rules that make a dedicated projection owner the cleanest
answer:

- [[../10-Architecture/bounded-context-map]] forbids cross-context table joins
  and requires cross-context reads through public query layers, published
  events or denormalised projections.
- [[player-strength-presentation]] and the `ImpactLensProjection` precedent keep
  Squad & Player's local player-strength view inside Squad. It is not a global
  analytics owner.
- [[../10-Architecture/09-Decisions/ADR-0074-tactical-identity-fingerprint-aggregation]]
  shows the handoff pattern: a source/analytics projection is versioned and then
  Manager & Legacy imports an immutable run snapshot instead of reading live
  mutable data.
- [[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]]
  gives the projection substrate: self-contained domain events, schema-validated
  payloads, idempotent consumers and per-consumer event offsets.

## Options considered

| Option | Shape | Pros | Cons | Recommendation |
|---|---|---|---|---|
| A | Dedicated projection-only **Statistics & Analytics** context | One owner for shared metrics; rebuildable projections; clean standings owner; future extraction path; aligns with CQRS best practice. | Adds one context-like owner and requires explicit source event contracts. | **Selected.** |
| B | Squad & Player sub-projection | Smallest change for player stats and Impact Lens adjacency. | Wrong owner for standings, team analytics, match maps, league leaders and Manager & Legacy handoffs; risks Squad becoming a global reporting context. | Reject. |
| C | UI/API composition over source queries | Fast for simple dashboards; no new owner. | Recreates cross-context join pressure at the edge; no canonical metric definitions; poor rebuild/version story. | Reject for MVP hub. |

## Proposed owner boundary

**Statistics & Analytics** is projection-only. It owns no gameplay commands, no
match simulation, no competition scheduling, no player lifecycle, no finance
ledger and no Manager & Legacy scoring formula. It owns denormalised read models
and metric definitions built from source-owned facts.

Source authority remains:

| Source context | Owns | Statistics & Analytics consumes |
|---|---|---|
| Match | Results, event log, spatial samples, card facts, match analytics output layers | Match result/event/spatial facts for match, player, team and map projections. |
| League Orchestration | Competition/season registry, fixture lifecycle, competition rules, `FixturesPublished`, `SeasonAdvanced` | Competition structure and rule snapshots needed for standings, leaders, windows and history. |
| Squad & Player | Player identity, squad membership, contracts, injuries, Impact Lens | Public player/squad identity snapshots and availability facts needed to label stat lines. |
| Club Management | Club identity, finance/board facts | Club labels and season identity facts; no ledger reads. |
| Tactics | `TacticSnapshot`, tactical fingerprints | Optional style/shape labels and team comparison dimensions. |
| Manager & Legacy | Run analysis, archetype/prestige/HoF logic | Consumes immutable `SeasonAnalyticsHandoffSnapshot`; does not own live stats. |

## Public queries

The proposed query surface:

- `GetAnalyticsHub(saveId, managerScope, window)`
- `GetMatchAnalytics(fixtureId)`
- `GetPlayerStatHistory(playerId, scope, metricSetVersion)`
- `GetTeamForm(clubId, window, metricSetVersion)`
- `GetCompetitionStandingsHistory(competitionSeasonId, roundRange)`
- `GetLeagueLeaders(competitionSeasonId, metricId, filters)`
- `GetPlayerComparison(playerIds, scope, metricSetVersion)`
- `GetTeamComparison(clubIds, scope, metricSetVersion)`

## Projection catalog

Minimum MVP projections:

- `MatchAnalyticsProjection`
- `PlayerSeasonStatLine`
- `PlayerCareerStatLine`
- `TeamSeasonAnalytics`
- `TeamFormWindow`
- `CompetitionStandingsHistory`
- `LeagueLeaderboard`
- `AnalyticsMetricDefinition`
- `SeasonAnalyticsHandoffSnapshot`

All projections carry:

- `projectionVersion`
- `sourceEventWatermark`
- `metricSetVersion`
- `generatedAt`
- `officialOrDerived` per metric family

## MVP Analytics Hub product shape

The MVP hub should ship with seven player-facing surfaces:

1. **Overview / Key Findings**: short, ranked insights with links to relevant
   squad, tactic, training or transfer actions.
2. **Last Match**: score, xG/xGA, shot quality, PPDA, field tilt, zone control,
   event timeline, player contributions and basic shot/pass/heat maps.
3. **Team Analysis**: per-90 league comparisons for attacking, defending,
   possession/build-up, pressing and chance quality.
4. **Player Analysis**: role-aware stat cards, per-90 leaders, form and
   player comparisons without introducing a global OVR.
5. **Standings and Leaders**: standings history, league leaders and trend
   windows sourced from `CompetitionStandingsHistory` and `LeagueLeaderboard`.
6. **Form and Trend**: rolling 5/10-match windows for team and player signals.
7. **Season Summary / History Seed**: season snapshot, top performers, records
   and `SeasonAnalyticsHandoffSnapshot` for Manager & Legacy.

## Post-MVP / deferred

- xT, OBV and other possession-value models.
- Custom dashboard/report builder.
- Export/share of reports.
- Similarity search.
- Deep Hall-of-Fame voting and cross-save record books.
- Fully user-authored formulas.

## Invariants to carry into ADR-0081

- Statistics & Analytics projections are not authoritative command state.
- Rebuilds must be deterministic for the same source facts and metric versions.
- Source facts must remain queryable even if derived metric formulas change.
- Standings projection must be based on Match result facts plus League-owned
  competition rules; it must not mutate League state.
- Manager & Legacy receives immutable season/run snapshots, not live analytics
  joins.
- UI labels official facts and model estimates distinctly.
- Product/user analytics are separate from in-world football statistics and
  stay governed by privacy/telemetry ADRs.

## Open calibration and implementation follow-ups

- Exact xG/xA/xGA, PPDA, field-tilt, zone-control and heatmap formulas.
- Metric thresholds, percentiles and chart defaults for Quick/Standard/Expert.
- Minimum source-event payloads and fixtures once code returns.
- Projection rebuild runbook and blue/green migration procedure.
- Manager & Legacy scoring formula and HoF/prestige weights remain FMX-95 /
  E6-3 territory.
