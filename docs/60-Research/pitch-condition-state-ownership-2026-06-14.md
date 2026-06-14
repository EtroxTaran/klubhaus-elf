---
title: Pitch-condition state ownership reconciliation
status: current
tags: [research, ddd, pitch, weather, stadium, bounded-context, ownership, fmx-142]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
linear: FMX-142
sourceType: synthesis
related:
  - [[raw-perplexity/raw-pitch-condition-state-ownership-ddd-2026-06-14]]
  - [[raw-perplexity/raw-pitch-condition-realworld-operations-2026-06-14]]
  - [[raw-perplexity/raw-pitch-condition-game-precedents-2026-06-14]]
  - [[../10-Architecture/bounded-context-map]]
  - [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
  - [[../10-Architecture/09-Decisions/ADR-0077-environment-and-climate-context-weather-and-pitch]]
  - [[../10-Architecture/state-machines/pitch-condition]]
  - [[../50-Game-Design/GD-0029-weather-and-pitch-design-model]]
  - [[../40-Execution/fmx-142-pitch-condition-state-ownership-decision-queue-2026-06-14]]
---

# Pitch-condition state ownership reconciliation

## Question

FMX-142 asks whether the accepted weather/pitch line still has one clear
owner after ADR-0077, ADR-0089 and later map/status cleanups: does
**Environment & Climate** own pitch-condition state, or does **Stadium
Operations** own it while consuming weather facts?

## Summary

No new architecture fork is needed. FMX-142 applies the already-ratified
ADR-0077 boundary consistently across the front-door docs:

- **Stadium Operations owns pitch-condition state:** facility condition,
  drainage, undersoil heating, maintenance, accumulated usage/wear, pre-match
  pitch snapshot and `PitchConditionChanged`.
- **Environment & Climate owns weather facts and derivation rules:** seasonal
  climate templates, weather regimes, resolved match weather, fallible forecast
  and the versioned pitch-weather model rules that Stadium Operations consumes.
- **Match consumes only a frozen snapshot** at `lineup_locked`; replay uses the
  persisted pre-match snapshot, not a live join across contexts.
- **Audience & Atmosphere, Matchday-Event-Engine and CommercialPortfolio**
  consume weather and pitch facts through published language; none becomes a
  pitch-state writer.

The inconsistent wording was the map shorthand that still listed Environment &
Climate as "pitch-state owner" and exposed `PitchConditionChanged`. The fix is a
documentation reconciliation, not a new ADR.

## Evidence

### DDD and ownership

DDD guidance points to keeping aggregate invariants with one owner. Pitch
condition is an accumulated state whose invariants depend on local facility
and usage facts: drainage capacity, heating effectiveness, maintenance level,
minutes played and recovery windows. Weather is an upstream input, not the
aggregate's home. Published language, anti-corruption layers and event-carried
state let Environment & Climate publish weather facts without becoming a second
pitch-state writer.

### Real-world football operations

Football operations evidence points the same way. Stadium/facility/grounds
teams own pitch maintenance, surface preparation, drainage, irrigation, covers,
heating and recovery work. Governing bodies define standards; match officials
may rule on playability; weather services provide forecasts. None of those
external parties is the ongoing owner of the venue's pitch-condition state.

### Comparable games

Sports-management precedent supports separating weather from local surface
condition. OOTP models venue/city/month weather as contextual match input, while
football-manager guidance makes poor pitch condition a tactical constraint for
the manager. The product lesson matches ADR-0077: weather should be subtle and
deterministic, while pitch/infrastructure is the actionable club-management
lever.

## Options assessed

| Option | Meaning | Assessment |
|---|---|---|
| **A. Apply the accepted split** | Stadium Operations owns pitch-condition state and `PitchConditionChanged`; Environment & Climate owns weather facts and derivation rules. | **Recommended and applied.** Matches ADR-0077, DDD invariants, real-world operations and game precedent. |
| B. Move pitch-condition aggregate into Environment & Climate | Environment & Climate owns both weather and pitch state. | Reopens ADR-0077, duplicates Stadium facility/usage invariants and weakens venue gameplay levers. |
| C. Create a projection/composite owner | A third read-model or Match-side projection owns pitch snapshots. | Adds unnecessary authority ambiguity. Useful as a query/projection only, not as the state writer. |

## Applied recommendation

FMX-142 applies **Option A**:

```text
Weather facts flow from Environment & Climate.
Pitch-condition state changes in Stadium Operations.
Match receives a frozen pitch/weather snapshot at lineup lock.
```

Vault implications applied:

- `bounded-context-map.md` now lists Environment & Climate outputs as weather
  facts and forecast/snapshot queries, not `PitchConditionChanged`.
- `bounded-context-map.md` keeps `PitchConditionChanged` under Stadium
  Operations and makes pitch-condition state explicit there.
- ADR-0018 venue/systemic-event wording is aligned from old Club Management
  ownership to the Stadium Operations / Environment & Climate split.
- ADR-0077 no longer carries stale "map patch not applied" or "20th context"
  wording for this boundary.
- `state-machines/pitch-condition.md` remains a non-binding companion but points
  to ADR-0077 and the map as the binding owner surface.

## Non-goals

- Does not change `weatherModelVersion`, weather RNG labels or effect
  magnitudes.
- Does not add a new bounded context, state machine or ADR.
- Does not implement postponement/abandonment/re-fixturing; that remains a
  reserved League issue per ADR-0077 D4.
- Does not change the MVP decision that weather/pitch appears as in-match
  modifiers only.

## Related

- [[raw-perplexity/raw-pitch-condition-state-ownership-ddd-2026-06-14]]
- [[raw-perplexity/raw-pitch-condition-realworld-operations-2026-06-14]]
- [[raw-perplexity/raw-pitch-condition-game-precedents-2026-06-14]]
- [[../10-Architecture/09-Decisions/ADR-0077-environment-and-climate-context-weather-and-pitch]]
- [[../10-Architecture/bounded-context-map]]
- [[../10-Architecture/state-machines/pitch-condition]]
