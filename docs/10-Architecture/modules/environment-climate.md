---
title: Environment & Climate module
status: draft
tags: [architecture, module, environment, climate, weather]
context: environment-climate
created: 2026-06-20
updated: 2026-06-20
type: module
binding: false
related: [[../05-Building-Blocks]], [[../bounded-context-map]], [[../09-Decisions/ADR-0077-environment-and-climate-context-weather-and-pitch]], [[../09-Decisions/ADR-0027-postgres-data-model]], [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
---

# Environment & Climate Boundary

## Purpose

Single owner of match-day weather: generates a deterministic seasonal climate
template per `(region, season)`, realizes per-fixture weather truth + a fallible
forecast, and supplies the pitch-weather derivation rules that Stadium Operations
applies to its own pitch-condition state (ADR-0077).

## Owns

- `SeasonClimateTemplate` — regime chain (Fine / Unsettled / Stormy / Heatwave /
  Freeze) + wet/dry Markov + distribution parameters per `(regionId, seasonId)`;
  a **pure, recomputable** function of `(regionId, seasonId, masterSeed)`, never
  persisted as authoritative daily state.
- `MatchWeatherRealization` — per-fixture **truth** + **forecast** for each
  scheduled fixture, snapshotted for Match at `lineup_locked`.
- The **pitch-weather interaction / derivation rules** (weather input → pitch
  playability read) — Stadium Operations owns the resulting pitch-condition state.
- The `WeatherRng` sub-label taxonomy (reserved locked stream #5).

## Public contract

Commands:

- `GenerateSeasonClimateTemplate(regionId, seasonId)` — idempotent, pure.
- `ResolveMatchWeather(matchId, regionId, seasonId, weekIndex, venueProfile)` —
  produces truth + forecast for a fixture.
- `SnapshotMatchWeatherAtLock(matchId)` — freezes the consumed snapshot at
  `lineup_locked`.

Queries (read-only):

- `SeasonClimateProfile(regionId, seasonId)` — template summary (UI/forecast).
- `MatchWeatherForecast(matchId)` — forecast read (pre-match planning).
- `MatchWeatherSnapshot(matchId)` — locked truth snapshot (Match consumes).

Domain events (self-contained payloads, no consumer joins):

- `WeatherForecastPublished` — `{ eventId, matchId, regionId, seasonId,
  forecastVersion, forecast { precip{type, intensityBand}, temperatureC,
  wind{speedBand, directionDeg}, wbgtBand, visibilityBand, confidenceBand },
  publishedForMatchDate }`.
- `MatchWeatherResolved` — `{ eventId, matchId, regionId, seasonId, modelVersion,
  regime, conditions { precip{type, intensityBand}, temperatureC, humidityPct,
  wind{speedBand, directionDeg}, wbgt, visibilityBand, altitudeBand },
  coolingBreakTriggered, resolvedAtLock }`.

`PitchConditionChanged` is **not** emitted here — it stays Stadium-Operations-owned;
this context only supplies the weather input + derivation rules it applies.

## Storage ownership

- Own per-save schema; cross-context references are opaque branded UUIDs, **no
  cross-context joins / `references()`** (ADR-0121 no-shared-tables fitness
  function, ADR-0027 data model).
- `SeasonClimateTemplate` is **derived, not stored authoritatively** — at most a
  memoised cache keyed by `(regionId, seasonId, modelVersion)`.
- The per-match resolved snapshot + forecast persist **with the match record**
  (Reference + Snapshot, replay support). All emitted events go through the
  transactional outbox.

## Consumers / Producers

Consumes (facts it reads, never generates):

- League Orchestration — fixture identity + dates + venue climate-zone reference
  (via `ClubId` / venue location).
- Stadium Operations — venue / facility profile inputs (altitude, undersoil
  heating, drainage) for the derivation rules.

Produces (who consumes its outputs):

- Match — `MatchWeatherSnapshot` (frozen at `lineup_locked`).
- Audience & Atmosphere — `MatchWeatherResolved` (atmosphere multiplier).
- Matchday-Event-Engine — weather facts (weather / medical / security policies).
- Stadium Operations — weather input + derivation rules feeding its
  `PitchConditionChanged`.
- CommercialPortfolio — `MatchWeatherResolved` as a matchday-operating-cost risk
  driver.

## Invariants

- All weather/pitch randomness draws from **`WeatherRng` only** (stream #5); no
  stream draws from another (EC1).
- Seasonal template is a **pure function** of `(regionId, seasonId, masterSeed)` —
  recomputable, never persisted as authoritative daily state (EC2).
- Truth + forecast derive from **distinct, immutable, versioned labels**
  (`...:v1:truth:<feature>` / `...:v1:forecast:<feature>`), one sub-stream per
  feature; a shipped label's draw count + purpose are frozen, new behaviour uses a
  new `:vN:` label (EC3/EC4).
- Match consumes weather + pitch only as a **frozen snapshot at `lineup_locked`**
  (Reference + Snapshot); generation never happens inside the match stream (EC5).
- Forecast is a **derived read** that may differ from truth but recomputes from the
  seed; Match never treats it as authoritative (EC6).
- Pitch condition is accumulated state + a pre-match snapshot; single-match replay
  reconstructs from the snapshot independent of earlier matches (EC7).
- Cooling-break trigger fires at **WBGT ≥ 32 °C** (band is calibration; the rule is
  fixed) (EC8).
- Writes **no finance ledger rows** and mutates no foreign aggregate; effects are
  commands / queries / events (EC9).
- Postponement / abandonment is **reserved** (named `PitchPlayabilityRuling` hook +
  future FSM transition); MVP produces modifiers only (EC10).
- Determinism: same `worldSeed` → byte-identical weather + forecast sequence for
  the same fixtures (EC11).

## Dependencies

- [[../09-Decisions/ADR-0077-environment-and-climate-context-weather-and-pitch]]
  (context definition; accepted/binding — do not implement yet)
- [[../09-Decisions/ADR-0027-postgres-data-model]] (per-save schema)
- [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
  (no shared tables / no cross-context joins)
- [[../state-machines/pitch-condition]] (pitch ladder amplified by weather;
  Stadium-Operations-owned state)
- Boundary input identity: League Orchestration fixture identity; venue profile
  from Stadium Operations.

## Open items

- **Numeric calibration**: every magnitude — effect sizes, regime probabilities,
  pitch-decay rates, WBGT / visibility bands, forecast-error σ — is deferred to
  GD-0043 `environment.weatherPitch` behind `weatherModelVersion` (not pinned by
  ADR-0077).
- **`PitchPlayabilityRuling` hook**: postponement / abandonment + League
  re-fixturing is reserved (named hook + future pitch-condition FSM transition),
  out of scope for MVP; the command/event surface for it is unspecified pending a
  later E2/League issue.
- The internal command set may grow at implementation; ADR-0077 marks the listed
  commands/queries as **draft** contract direction.
