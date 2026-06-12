---
title: "Raw - Standings authority: League vs Statistics (FMX-131)"
status: raw
tags: [research, raw, perplexity, standings, league, statistics, analytics, cqrs, ddd, process-manager, promotion, relegation, fmx-131]
created: 2026-06-12
updated: 2026-06-12
type: research
binding: false
linear: FMX-131
related:
  - [[../standings-authority-league-vs-statistics-2026-06-12]]
  - [[../../10-Architecture/09-Decisions/ADR-0066-competition-registry-sub-aggregate]]
  - [[../../10-Architecture/09-Decisions/ADR-0068-fixture-scheduling-contract]]
  - [[../../10-Architecture/09-Decisions/ADR-0081-statistics-analytics-read-model-owner]]
---

# Raw capture - Standings authority (Perplexity, 2026-06-12)

Perplexity capture for **FMX-131**. Status `raw`: this is source input only; the
synthesis is [[../standings-authority-league-vs-statistics-2026-06-12]].

No FMX private data, secrets or user data were sent. Prompts were generic
architecture/product research prompts.

## Prompt 1 - DDD/CQRS authority for binding process decisions

**Prompt.** In domain-driven design with CQRS/event sourcing, when a process
manager/saga must make a binding command decision such as promotion/relegation
from final league standings, should it read an eventually consistent
read-model/projection or a source-domain authoritative aggregate/event/query?
Research best practices, anti-patterns, consistency risks, and recommended
contract shape. Include sources.

**Key captured findings.**

- For correctness-critical command decisions, the process should use
  authoritative domain state: an aggregate, event-store-derived state, or a
  strongly consistent source-domain query. It should not decide from an
  eventually consistent projection unless the business explicitly accepts stale
  decisions and compensation.
- Read models/projections are denormalized query views. They are rebuildable,
  disposable and often eventually consistent; they should not own invariants or
  become command authority.
- A saga/process manager should normally orchestrate from source events. The
  safer contract is: the source aggregate/domain service finalizes standings and
  emits a summary event such as `SeasonFinalized` /
  `StandingsFinalized`; the process manager reacts and issues downstream
  commands.
- If the process manager must ask for state, it should call a source-domain
  authoritative query over the same event/aggregate truth, not an asynchronous
  analytics projection.
- Using a projection to decide promotion/relegation creates staleness,
  projection-lag and replay-divergence risk, and can hide domain rules inside
  read-side builders.

**Useful sources returned.**

- CQRS.com, "Domain-Driven Design":
  <https://www.cqrs.com/concepts/domain-driven-design/>
- Rico Fritzsche, "CQRS/Event Sourcing projections":
  <https://ricofritzsche.me/cqrs-event-sourcing-projections/>
- Ashraf Mageed, "CQRS, EventSourcing and the cost of tooling constraints":
  <https://www.ashrafmageed.com/cqrs-eventsourcing-and-the-cost-of-tooling-constraints/>
- Event-Driven.io, "Saga and Process Manager - distributed transactions":
  <https://event-driven.io/en/saga_process_manager_distributed_transactions/>

## Prompt 2 - Real-world football and game/analytics precedent

**Prompt.** For football competitions and football/sports management games, who
is normally authoritative for league standings, tiebreakers,
promotion/relegation and season rollover: the competition/league rules
authority, or an analytics/statistics/history subsystem? Research real-world
football tiebreaker/competition governance and comparable game/analytics
precedent. Include sources and summarize implications for a football-manager
game's bounded contexts.

**Key captured findings.**

- Real-world football competition organizers publish the official standings and
  tie-breaker procedures. The competition authority owns the ordered criteria,
  final draws/lots/commissioner decisions, champions, qualifiers and
  promotion/relegation outcomes.
- Analytics/statistics providers may provide inputs to a tie-breaker, such as a
  rating or strength metric, but the competition rule determines if and how that
  input is used.
- Sports/fantasy platforms mirror the split: league rules define standings and
  playoff seeding; a rules authority or league manager can override or finalize.
  The statistics engine computes inputs and views.
- For FMX bounded contexts, League Orchestration should own competition rules,
  tie-breaker pipeline, official current/final ordering and season rollover.
  Statistics & Analytics should own standings history, analytics projections,
  leaderboards and non-authoritative what-if/UX views.

**Useful sources returned.**

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

## Decision input captured live

Nico selected the FMX-131 planning line before implementation:

- **League authority:** League Orchestration owns tie-break rules, official
  current/final ordering and promotion/relegation/season-rollover outcomes.
- **Statistics projection:** Statistics & Analytics owns
  `CompetitionStandingsHistory`, league leaders, analytics/history views and
  non-authoritative projections.
- **Contract shape:** League publishes an official final standings event/query;
  Statistics consumes it for history/display. The Pyramid-rollover process
  manager reads League-owned official standings, never the Statistics projection.
- **Scope:** Keep ADR-0081 accepted/binding; amend ADR-0066/0068/0081 and maps
  rather than creating a competing ADR.
