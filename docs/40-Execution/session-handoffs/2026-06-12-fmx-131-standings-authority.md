---
title: Handoff - FMX-131 Standings authority
status: wrapped
tags: [meta, execution, handoff, fmx-131, standings, league, statistics]
created: 2026-06-12
updated: 2026-06-12
type: handoff
binding: false
related:
  - [[../../60-Research/standings-authority-league-vs-statistics-2026-06-12]]
  - [[../../60-Research/raw-perplexity/raw-standings-authority-league-vs-statistics-2026-06-12]]
  - [[../../10-Architecture/09-Decisions/ADR-0066-competition-registry-sub-aggregate]]
  - [[../../10-Architecture/09-Decisions/ADR-0068-fixture-scheduling-contract]]
  - [[../../10-Architecture/09-Decisions/ADR-0081-statistics-analytics-read-model-owner]]
  - [[../../10-Architecture/bounded-context-map]]
  - [[../../50-Game-Design/GD-0031-analytics-hub-and-statistics]]
---

# Handoff: FMX-131 standings authority (2026-06-12)

## Linear

- Issue: FMX-131
- Branch: `codex/fmx-131-standings-authority`

## Done this session

- Claimed FMX-131 by moving Linear to `In Progress`.
- Confirmed Nico's selected line:
  - League Orchestration owns tie-break rules, official current/final ordering,
    promotion/relegation, qualification and season rollover.
  - Statistics & Analytics owns display/history projections, league leaders and
    analytics surfaces.
  - League publishes `GetOfficialCompetitionStandings` /
    `CompetitionStandingsFinalizedV1`; Statistics consumes it but is never the
    rollover command source.
- Ran two Perplexity research passes:
  - DDD/CQRS command authority vs projection consistency risk.
  - Real-world football/game authority for standings and tie-breakers.
- Created raw and synthesis research notes.
- Amended ADR-0066, ADR-0068 and ADR-0081 in place with dated FMX-131 notes.
- Updated the bounded-context map, Current State, Decision Log, Architecture Map,
  Game Design Map, Feature Map, research indexes and GD-0031/feature wording.

## Open / next step

- Run `node scripts/docs-check.mjs`.
- Fix any validator findings.
- Commit, push and open the FMX-131 PR.
- Add final vault paths to Linear and move the issue according to PR state.

## Blockers

- None known after Nico's FMX-131 decisions were selected.

## Changed vault paths

- `docs/60-Research/raw-perplexity/raw-standings-authority-league-vs-statistics-2026-06-12.md`
- `docs/60-Research/standings-authority-league-vs-statistics-2026-06-12.md`
- `docs/10-Architecture/09-Decisions/ADR-0066-competition-registry-sub-aggregate.md`
- `docs/10-Architecture/09-Decisions/ADR-0068-fixture-scheduling-contract.md`
- `docs/10-Architecture/09-Decisions/ADR-0081-statistics-analytics-read-model-owner.md`
- `docs/10-Architecture/bounded-context-map.md`
- `docs/10-Architecture/README.md`
- `docs/50-Game-Design/GD-0031-analytics-hub-and-statistics.md`
- `docs/20-Features/feature-statistics-analytics-hub-mvp.md`
- `docs/00-Index/Current-State.md`
- `docs/00-Index/Decision-Log.md`
- `docs/00-Index/Architecture-Map.md`
- `docs/00-Index/Game-Design-Map.md`
- `docs/00-Index/Feature-Map.md`
- `docs/00-Index/Research-Map.md`
- `docs/60-Research/00-summary.md`
- `docs/60-Research/raw-perplexity/README.md`
- `docs/20-Features/README.md`
- `docs/50-Game-Design/README.md`
- `docs/40-Execution/session-handoffs/README.md`

## Needs promotion

- No further promotion needed for FMX-131. ADR-0066/0068/0081 and GD-0031 now
  carry the accepted authority split; the Analytics Hub feature remains draft
  by design until a later implementation/UI beat.
