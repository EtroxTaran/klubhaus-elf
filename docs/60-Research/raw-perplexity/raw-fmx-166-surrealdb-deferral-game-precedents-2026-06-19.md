---
title: Raw Perplexity - FMX-166 Game and Product Precedents
status: raw
tags: [research, raw, perplexity, fmx-166, surrealdb, football-manager, graph, realtime, read-model, gameplay]
created: 2026-06-19
updated: 2026-06-19
type: research
binding: false
linear: FMX-166
sourceType: perplexity
related:
  - [[../surrealdb-deferral-reevaluation-watch-2026-06-19]]
  - [[raw-fmx-166-surrealdb-deferral-source-checks-2026-06-19]]
  - [[../../40-Execution/fmx-166-surrealdb-deferral-watch-decision-queue-2026-06-19]]
  - [[../../10-Architecture/09-Decisions/ADR-0021-revised-tech-stack]]
---

# Raw Perplexity - FMX-166 Game and Product Precedents

## Prompt

Analyze real-world and game-world cases where a football-management game might
benefit from a graph/live projection store, and where PostgreSQL/read models
remain the better fit.

## Raw capture

Perplexity suggested that a graph/live store becomes interesting only if FMX's
product direction creates explicit multi-hop relationship or live-projection
needs, such as:

- scouting knowledge networks: scouts, regions, observations, sources and
  player relationships;
- social/influence networks: player morale, locker-room cliques, staff
  influence, agent relationships and fan/media reactions;
- tactical interaction graphs: passing lanes, pressing triggers, player
  chemistry and opponent-style relationships;
- complex regulatory or contract dependency graphs: eligibility, loan clauses,
  obligations and rule-pack effects;
- collaborative spectator/watch surfaces that need live graph-like read models.

Perplexity also emphasized that many football-management workloads stay better
served by PostgreSQL plus typed read models:

- fixtures, standings, league tables and history;
- player/staff attributes and deterministic progression;
- contracts, wages, finances and ledgers;
- training/injury/availability facts;
- ordinary dashboards and list/table screens.

## Source-quality note

The game/product precedents were useful for product thinking but citation
quality was mixed. The synthesis therefore treats them as design hypotheses:
SurrealDB can move from deferred to trial only when an FMX feature demonstrates
one of these needs against measurable targets that PostgreSQL/materialized
views/in-memory graph logic cannot meet well enough.

