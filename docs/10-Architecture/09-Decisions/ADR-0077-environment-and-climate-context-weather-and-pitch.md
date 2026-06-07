---
title: ADR-0077 Environment & Climate Context (Weather + Pitch)
status: proposed
tags: [adr, architecture, ddd, environment, climate, weather, pitch, match, stadium, league, determinism, replay, fmx-66]
created: 2026-06-05
updated: 2026-06-05
type: adr
binding: false
supersedes:
superseded_by:
related:
  - [[../bounded-context-map]]
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[ADR-0061-club-management-sub-aggregate-audit]]
  - [[ADR-0062-audience-and-atmosphere-context]]
  - [[ADR-0066-competition-registry-sub-aggregate]]
  - [[ADR-0068-fixture-scheduling-contract]]
  - [[ADR-0067-set-piece-variant-selection-determinism]]
  - [[ADR-0026-match-frame-contract]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[ADR-0019-modular-monolith-ddd]]
  - [[../state-machines/pitch-condition]]
  - [[../state-machines/match]]
  - [[../../50-Game-Design/GD-0029-weather-and-pitch-design-model]]
  - [[../../60-Research/weather-and-pitch-conditions-2026-06-05]]
  - [[../../60-Research/raw-perplexity/raw-weather-realworld-2026-06-05]]
  - [[../../60-Research/raw-perplexity/raw-weather-games-2026-06-05]]
  - [[../../60-Research/raw-perplexity/raw-weather-determinism-2026-06-05]]
  - [[../../60-Research/determinism-and-replay]]
---

# ADR-0077: Environment & Climate Context (Weather + Pitch)

## Status

proposed

> **`proposed` / `binding: false`.** FMX-66 (E2 epic FMX-58) closes audit gap
> **G23** by pinning an owner + a replay-safe determinism path for weather and
> pitch conditions. **D1–D4 were chosen live by Nico on 2026-06-05 = C, A, A, A.**
> This ADR **proposes a new (20th) bounded context, "Environment & Climate"** but
> **does not edit the binding `bounded-context-map.md`** — the map patch in
> §"Map patch proposal" is applied only on ratification (per
> [[../../90-Meta/vault-governance]], mirroring ADR-0064 / ADR-0075). It locks
> **no numeric constants**: every magnitude, band, regime probability,
> pitch-decay rate, WBGT band and forecast-error σ is **FMX-52 calibration debt**
> behind a `weatherModelVersion`. One boundary item is **left open for Nico's
> ratification** (see §"Open ratification item": the exact pitch-condition *state*
> ownership split between Environment & Climate and Stadium Operations).

## Date

- Proposed: 2026-06-05

## Context

Weather and pitch conditions are an **unowned generation concern** (gap **G23**,
severity medium). The vault already names every *consumer* but no *producer*:

- [[determinism-and-replay]] §2.2 reserves locked RNG stream **#5 `WeatherRng`**
  — *"Match-day weather, pitch conditions; isolated so weather refactors don't
  affect physical events"* (World-save persistence). Weather therefore is **not**
  a `WorldRng` sub-label; the FMX-66 ticket text (written before the locked-9
  table) is corrected here to use `WeatherRng`.
- [[../bounded-context-map]] §1: **Stadium Operations** publishes
  `PitchConditionChanged` and **Match** consumes `StadiumCapacitySnapshot` +
  `PitchConditionChanged` at `lineup_locked`; the **Matchday-Event-Engine**
  consumes weather for "Pyro / weather / catering / medical / security" policies;
  **Audience & Atmosphere** folds **weather** into its atmosphere multiplier
  (`rivalry × table × utilisation × form × weather × security × choreo`).
- **Match** seeds at `lineup_locked` and replays byte-identically from committed
  inputs ([[../state-machines/match]] §5), so any weather/pitch a match consumes
  must be a **frozen snapshot** at/before lock (Reference + Snapshot, as Tactics
  and Stadium Ops already do).
- Per-fixture realization needs a **stable fixture identity** — `matchId` /
  `fixtureOrdinalWithinSeason` from [[ADR-0068-fixture-scheduling-contract]] (the
  ticket's E1-2 dependency, now satisfied).

Research is filed in [[../../60-Research/weather-and-pitch-conditions-2026-06-05]]
(raw verbatim captures:
[[../../60-Research/raw-perplexity/raw-weather-realworld-2026-06-05|real-world]],
[[../../60-Research/raw-perplexity/raw-weather-games-2026-06-05|games]],
[[../../60-Research/raw-perplexity/raw-weather-determinism-2026-06-05|determinism]]).
It grounds the design in (a) real-world football weather — FIFA **WBGT ≥ 32 °C**
cooling-break trigger, Law 5 "ball won't bounce/roll" waterlogging test,
frozen-pitch/undersoil-heating playability, regional+monthly seasonality;
(b) genre precedent — FM/OOTP region+month climate models with per-fixture
realization, the **"weather subtle, pitch + infrastructure the big lever"**
best-practice lesson, and the under-used *fallible forecast*; and (c) the
deterministic weather-generator literature (Wilks & Wilby; Richardson/WGEN:
separate wet/dry occurrence from gamma amount, seasonal harmonic modulation,
bounded weekly regimes) which favours a **seasonal template + per-fixture
realization** over a replay-fragile continuous day-by-day process.

Per the binding communication rules ([[ADR-0019-modular-monolith-ddd]]), contexts
interact only via commands + queries/read-models + domain events (JSON/Zod), with
**no cross-context joins**; **Club Management is the sole finance-ledger writer**;
all stochastic draws declare a `*Rng` sub-label and resolve inside the lock-time
snapshot ([[ADR-0018-systemic-events-and-player-lifecycle]] §3).

## Options Considered

- **D1 ownership:** League sub-aggregate · Stadium Ops owns both ·
  **new Environment & Climate context (chosen)** · Match per-fixture draw.
- **D2 generation model:** **seasonal template + bounded Markov regimes →
  per-fixture realization (chosen)** · pure per-fixture table draw · continuous
  day-by-day Markov/AR.
- **D3 forecast:** **fallible deterministic forecast (chosen)** · forecast ==
  actual · no forecast.
- **D4 MVP scope:** **in-match modifiers + cooling break only (chosen)** ·
  include postponement/abandonment + re-fixturing.

## Decision

Nico selected the four planning defaults live (2026-06-05): **D1 = new
Environment & Climate context**, **D2 = seasonal template + regimes →
per-fixture realization**, **D3 = fallible deterministic forecast**,
**D4 = in-match modifiers only at MVP** (postponement reserved).

### D1 — Ownership: a new "Environment & Climate" bounded context

| Option | Description | Trade-off |
|---|---|---|
| A. League Orchestration sub-aggregate | League (owns season/region/fixtures/seed) generates a seasonal climate template + per-fixture realization. | Reuses existing season+seed ownership, no new context; but loads weather/pitch physics onto a scheduling context. |
| B. Stadium Operations owns both | Co-locate weather generation with the pitch-condition + facility-decay it already owns. | One environmental owner; but weather is regional/calendar-scoped, not per-venue, so it sits awkwardly under a per-stadium context. |
| **C. New "Environment & Climate" context** | A dedicated 20th bounded context owns weather generation (seasonal template + per-fixture truth + forecast) and the pitch-weather interaction model. | **Chosen (Nico).** Cleanest conceptual boundary; a single publisher of self-contained `WeatherForecastPublished` / `MatchWeatherResolved` facts; weather/pitch physics evolve without touching League or Stadium internals. Cost: a new context (19 → 20) + cross-context wiring. |
| D. Match per-fixture draw at lock-time | Match draws weather itself at `lineup_locked`. | Simplest; but loses seasonal spells and scatters climate logic into Match. |

**Chosen: Option C.** A new **Environment & Climate** bounded context owns:

- the **seasonal climate template** per `(region, season)` (regime chain + wet/dry
  + distribution parameters), generated once and recomputable (pure);
- the **per-fixture weather realization** (truth) and the **forecast** for each
  scheduled fixture, snapshotted for Match at `lineup_locked`;
- the **pitch-weather interaction model** — the derivation rules that turn weather
  + pitch inputs into a pitch-condition/playability read.

It **owns no foreign aggregate**; it coordinates by commands, queries and events.
Ownership of the inputs/outputs around it:

- **League Orchestration** supplies fixture identity + dates + the climate-zone
  reference of the home venue (via `ClubId`/venue location); it does **not**
  generate weather.
- **Stadium Operations** continues to own **facility state** — undersoil heating,
  drainage, pitch maintenance/decay, usage/minutes-played — and **remains the
  `PitchConditionChanged` emitter** at the matchday FSM. Environment & Climate
  supplies the **weather input + derivation rules**; Stadium Ops applies them to
  its owned facility/usage state. *(The precise state-vs-rules split is the one
  open ratification item — see §"Open ratification item".)*
- **Match** consumes a frozen `MatchWeatherSnapshot` + the Stadium
  `PitchConditionChanged` snapshot at `lineup_locked`; it never generates either.
- **Audience & Atmosphere** consumes `MatchWeatherResolved` for its atmosphere
  multiplier (replacing today's implicit "weather" input).
- **Matchday-Event-Engine** consumes weather facts for weather/medical/security
  event policies.
- **CommercialPortfolio** matchday-operating-cost risk reads weather as a risk
  driver (pitch recovery, medical, cleanup) — consistent with ADR-0070 which
  explicitly excludes Weather from the League commercial profile, leaving it a
  separate fact.

### D2 — Generation model: seasonal template + bounded regimes → per-fixture realization

| Option | Description | Trade-off |
|---|---|---|
| **A. Seasonal template + regimes → realization** | Per `(region, season)` generate a deterministic climate template (weekly Markov **regime** chain — Fine/Unsettled/Stormy/Heatwave/Freeze — + wet/dry Markov + gamma amount + conditional temp/wind, seasonal harmonic modulation + small annual anomalies). Per fixture, draw a realization from the template. | **Chosen.** Matches the WGEN/Richardson paradigm + FM/OOTP; realistic spells, fully replay-safe (pure template recompute), highly tunable, extensible via versioned labels. Cost: choose template resolution + regime persistence. |
| B. Pure per-fixture table draw | Independent draw conditioned on a region+month probability table (classic CM/Anstoss). | Simplest deterministic model; no multi-day spells/heatwaves; back-to-back home games swing unrealistically. |
| C. Continuous day-by-day Markov/AR | Advance a weather process every in-game day. | Highest temporal realism, but globally history-coupled → replay-fragile and expensive to reconstruct; research advises against under a replay-strict save. |

**Chosen: Option A.** Determinism path (all draws from `WeatherRng`, PCG32 +
`xxhash32(label, masterSeed)` per [[determinism-and-replay]]):

- **Climate template (one-shot, pure):** seed
  `WeatherRng:climate:region:<regionId>:season:<seasonId>:v1:core` →
  per-season annual anomalies, per-week regime (small Markov chain), and per-week
  W/D transition matrix + precip/temperature/wind/cloud distribution parameters.
  Template depends only on `(regionId, seasonId, masterSeed)` and is **recomputed
  on demand** — never stored as authoritative daily state.
- **Per-fixture realization (truth):**
  `WeatherRng:match:<matchId>:v1:truth:<feature>` with **one sub-stream per
  feature** (`:rain`, `:temp`, `:wind`, `:cloud`, …). Uses the template
  parameters for the fixture's region/season/week. Feature streams are
  independent so adding `:wind` after shipping `:rain` never perturbs shipped
  draws.
- **Versioned labels:** every shipped label is frozen — never change its draw
  count or purpose; new behaviour gets a new `:vN:` label (e.g. `:v2:fog`),
  keeping old replays bit-identical. Labels use only **immutable** components
  (`regionId`, `seasonId`, `matchId`), never reschedulable indices.

### D3 — Forecast vs actual: fallible deterministic forecast

| Option | Description | Trade-off |
|---|---|---|
| **A. Fallible forecast (truth + noised forecast)** | Forecast derived from a separate `:forecast` label as a deterministic noisy/biased transform of truth; both recompute from the seed, so forecast may legitimately differ yet replays are bit-identical. | **Chosen.** A lightweight, real planning gamble (kit/tactics/squad under uncertainty), zero replay cost; differentiator vs FM where forecast == actual. |
| B. Forecast == actual | Show a forecast equal to realized weather. | Pure planning aid, simplest; no decision tension. |
| C. No forecast | Reveal at kickoff only. | Minimal scope; removes a UI/planning surface. |

**Chosen: Option A.** `WeatherForecastPublished` is computed from
`WeatherRng:match:<matchId>:v1:forecast:<feature>` as a deterministic transform of
the truth realization (e.g. `forecastTemp = truthTemp + N(0, σ_forecast)`;
precip-probability biased toward the regime). Forecast skill / σ are **calibration
inputs**. The published forecast carries a `forecastVersion` so that, if the
forecast transform is later revised, historical "what the user saw" can still be
reproduced by dispatching the versioned deterministic function. Forecast is a
**derived read** — Match never consumes the forecast as truth.

### D4 — MVP scope: in-match modifiers + cooling break; postponement reserved

| Option | Description | Trade-off |
|---|---|---|
| **A. Modifiers only at MVP** | Weather + pitch ship as in-match modifiers + a WBGT ≥ 32 °C cooling-break trigger; weather kept subtle, pitch condition the main amplifier. Postponement/abandonment + re-fixturing is a reserved hook/stub. | **Chosen.** Lowest blast radius; ships a coherent slice; honours the FM/OOTP "weather subtle, pitch the lever" lesson; avoids coupling FMX-66 to League re-scheduling + economy refund paths. |
| B. Include postponements at MVP | Add pre-match inspection → postponement/abandonment with League re-fixturing. | More realistic/dramatic, but couples to League scheduling, calendar congestion and refund/economy — larger scope. |

**Chosen: Option A.** MVP exposes:

- a **weather vector** consumed at `lineup_locked` (precip type + intensity,
  temperature, wind speed + direction, derived **WBGT**, visibility; altitude as a
  venue attribute) — effect *directions* in GD-0029, magnitudes in FMX-52;
- a **cooling-break trigger** at **WBGT ≥ 32 °C** (drinks-break band reserved);
- a **pitch-condition read** (ladder in
  [[../state-machines/pitch-condition]]) that **amplifies** weather effects;
- **`MatchWeatherResolved`** + **`WeatherForecastPublished`** events.

**Reserved (not MVP):** pitch-driven **postponement / abandonment**, pre-match
inspection AI, and League re-fixturing — named as the `PitchPlayabilityRuling`
hook + a `postponed`/`abandoned` future transition in the pitch-condition FSM,
explicitly out of scope here (a later issue under E2/League coordinates it).

## Public contract direction

Draft Environment & Climate commands:

- `GenerateSeasonClimateTemplate(regionId, seasonId)` — idempotent, pure.
- `ResolveMatchWeather(matchId, regionId, seasonId, weekIndex, venueProfile)` —
  produces truth + forecast for a fixture.
- `SnapshotMatchWeatherAtLock(matchId)` — freezes the consumed snapshot at
  `lineup_locked`.

Draft queries (read-only):

- `SeasonClimateProfile(regionId, seasonId)` — template summary (UI/forecast).
- `MatchWeatherForecast(matchId)` — forecast read (pre-match planning).
- `MatchWeatherSnapshot(matchId)` — the locked truth snapshot (Match consumes).

Draft events emitted (self-contained payloads, no consumer joins):

```text
WeatherForecastPublished =
  eventId
  matchId
  regionId
  seasonId
  forecastVersion
  forecast {
    precip { type: none|rain|sleet|snow, intensityBand }
    temperatureC
    wind { speedBand, directionDeg }
    wbgtBand
    visibilityBand
    confidenceBand            # forecast skill -> calibration
  }
  publishedForMatchDate

MatchWeatherResolved =
  eventId
  matchId
  regionId
  seasonId
  modelVersion              # weatherModelVersion
  regime                    # Fine|Unsettled|Stormy|Heatwave|Freeze
  conditions {
    precip { type, intensityBand }
    temperatureC
    humidityPct
    wind { speedBand, directionDeg }
    wbgt                     # derived; >=32 -> cooling-break flag
    visibilityBand
    altitudeBand             # from venue profile
  }
  coolingBreakTriggered: boolean
  resolvedAtLock: boolean
```

Pitch-condition fact stays **Stadium-Operations-owned** (`PitchConditionChanged`,
already in the map); Environment & Climate supplies the **weather input** and the
**derivation rules** it applies. Match consumes both as a Reference + Snapshot at
`lineup_locked`.

## Invariants

| # | Invariant |
|---|---|
| **EC1** | All weather/pitch randomness draws from **`WeatherRng`** only (never `WorldRng`/`MatchCoreRng`/etc.); no stream draws from another stream. |
| **EC2** | The seasonal climate template is a **pure function** of `(regionId, seasonId, masterSeed)` — recomputable, never persisted as authoritative daily state. |
| **EC3** | Per-fixture truth + forecast derive from **distinct, immutable, versioned labels** (`...:v1:truth:<feature>` / `...:v1:forecast:<feature>`); one sub-stream per feature. |
| **EC4** | A shipped label's draw count and purpose are **frozen**; new behaviour uses a new `:vN:` label — old replays stay byte-identical. |
| **EC5** | Match consumes weather + pitch only as a **frozen snapshot at `lineup_locked`** (Reference + Snapshot); generation never happens inside the match stream. |
| **EC6** | Forecast is a **derived read** that may differ from truth but is recomputable from the seed; Match never treats forecast as authoritative. |
| **EC7** | Pitch condition is **accumulated state + a pre-match snapshot**; single-match replay reconstructs from the snapshot, independent of the global sequence of earlier matches. |
| **EC8** | Cooling-break trigger fires at **WBGT ≥ 32 °C** (band/threshold is calibration; the rule is fixed). |
| **EC9** | Environment & Climate writes **no finance ledger rows** and mutates no foreign aggregate; effects are commands/queries/events; matchday-cost risk reads weather as a fact. |
| **EC10** | Postponement/abandonment is **reserved** (named hook + future FSM transition); MVP weather/pitch produce modifiers only. |
| **EC11** | Determinism invariant: **same `worldSeed` → byte-identical weather + forecast sequence** for the same fixtures. |

## Determinism, persistence and tests

### Determinism ([[ADR-0018-systemic-events-and-player-lifecycle]] §3)

Uses the **existing `WeatherRng` stream #5** (no new stream). Sub-label taxonomy
declared above; clock/calendar-driven resolution is a deterministic function of
fixture date + template + `weatherModelVersion`. No `Math.random()`/`Date.now()`.

### Persistence ([[ADR-0027-postgres-data-model]] / [[ADR-0028-postgres-transactional-outbox]])

Per-save schema; cross-context references as opaque branded UUIDs (no
cross-context `references()`). Climate template is **derived** (not stored
authoritatively) — at most a memoised cache keyed by `(regionId, seasonId,
modelVersion)`. The per-match resolved snapshot + forecast are persisted with the
match record (Reference + Snapshot, supports replay). Outbox for all emitted
events.

### Test strategy

- **Golden determinism:** same `worldSeed` + fixtures → byte-identical
  `MatchWeatherResolved` + `WeatherForecastPublished` streams (EC11).
- **Label-stability:** adding a new feature label (e.g. `:v1:wind` then `:v2:fog`)
  leaves all prior feature draws bit-identical (EC3/EC4).
- **Forecast determinism:** forecast recomputes identically and may differ from
  truth within calibrated bounds (EC6).
- **Pitch snapshot replay:** reconstruct a single match's pitch from its pre-match
  snapshot regardless of extra sims run between replays (EC7).
- **Boundary tests:** Match consumes only locked snapshots (EC5); no `WeatherRng`
  draw outside the declared labels (EC1); cooling break fires at WBGT ≥ 32 (EC8);
  no ledger write (EC9).
- **Contract tests:** Audience & Atmosphere consumes `MatchWeatherResolved`;
  Matchday-Event-Engine consumes weather facts; Stadium Ops `PitchConditionChanged`
  consumes the weather input; CommercialPortfolio matchday-cost risk reads weather.

## Map patch proposal (not applied — ratify-gated)

On ratification, [[../bounded-context-map]] gains a **20th** bounded context,
**Environment & Climate**, with:

- Core elements: `SeasonClimateTemplate` (regime chain + W/D + distributions),
  `MatchWeatherRealization` (truth + forecast), pitch-weather interaction model.
- Exposed outputs: `WeatherForecastPublished`, `MatchWeatherResolved`;
  `SeasonClimateProfile` / `MatchWeatherForecast` / `MatchWeatherSnapshot` queries.
- Consumers: Match (snapshot @ `lineup_locked`), Audience & Atmosphere
  (atmosphere multiplier), Matchday-Event-Engine (weather policies), Stadium
  Operations (weather input to `PitchConditionChanged`), CommercialPortfolio
  (matchday-cost risk). The Stadium Operations row gains a clause noting weather
  is a **consumed input** to pitch condition. The context count line (19) becomes
  20, and `src/domain/` gains an `environment-climate/` folder.

The map file is **not** edited until Nico ratifies (per
[[../../90-Meta/vault-governance]]; same discipline as ADR-0064 / ADR-0075).

## Open ratification item

**Pitch-condition *state* ownership boundary.** D1 (Option C) gives the new
context the weather + pitch-weather *model*. Stadium Operations already owns the
**facility/usage state** that pitch condition depends on (undersoil heating,
drainage, decay, minutes-played) and emits `PitchConditionChanged`. This ADR
proposes the clean split — **Environment & Climate owns the weather input + the
derivation rules; Stadium Operations keeps the facility/usage state and remains
the emitter** — but flags the exact line (e.g. whether the pitch-condition
*aggregate* moves into Environment & Climate, or stays in Stadium Ops consuming a
weather fact) as a point for Nico's explicit ratification rather than deciding it
unilaterally.

> **2026-06-07 (open-decisions sweep) recommendation — Stadium Operations keeps the pitch-condition
> *state*/aggregate; Environment & Climate owns weather as a consumed input.** Grounded in the DDD
> keep-invariants-together heuristic: pitch condition is a function of facility/usage state (undersoil
> heating, drainage, decay, minutes-played) that Stadium Operations already owns and is the
> `PitchConditionChanged` emitter for; splitting the aggregate across two contexts would cut a tight
> invariant. Environment & Climate stays the upstream weather/forecast owner. See
> [[../../00-Index/Open-Decisions-Dossier]] (mini-point M3).

## Consequences

Positive:

- One owner + one determinism contract for weather/pitch; the existing reserved
  `WeatherRng` stream gets a real producer and a future-proof label taxonomy.
- Realistic seasonal weather (spells, regional/monthly variation) that is fully
  replay-safe and calibration-deferred; a fallible forecast becomes a genuine
  planning mechanic.
- Weather stays subtle, pitch + Stadium infrastructure stay the meaningful lever
  (the FM/OOTP best-practice lesson), and existing consumers (Match, Audience,
  Matchday-Event-Engine, CommercialPortfolio) keep their boundaries.

Negative / constraints:

- Adds a **20th bounded context** (cross-context wiring + a new `src/domain`
  folder) for a concern some teams fold into League/Stadium.
- The Environment ↔ Stadium pitch-state boundary needs explicit ratification to
  avoid two owners of pitch condition.
- Per-fixture realization depends on stable fixture identity (ADR-0068) and the
  venue climate-zone reference being available before lock.

## HITL gate

Authored `proposed` after Nico chose the FMX-66 planning defaults live
(2026-06-05): **D1 = C** (new Environment & Climate context), **D2 = A**
(seasonal template + regimes → realization), **D3 = A** (fallible forecast),
**D4 = A** (modifiers only at MVP).

Remaining ratification / follow-up items before implementation:

- the pitch-condition **state ownership** boundary (Environment & Climate vs
  Stadium Operations) — §"Open ratification item";
- all numeric magnitudes (effect sizes, regime probabilities, pitch-decay rates,
  WBGT/visibility bands, forecast-error σ) → **FMX-52** calibration behind
  `weatherModelVersion`;
- the postponement/abandonment + re-fixturing slice (reserved hook) → a later
  E2/League issue;
- the 1-row+context bounded-context-map patch (apply on ratify).

## Supersedes

None

## Related Docs

- [[../../60-Research/weather-and-pitch-conditions-2026-06-05]]
- [[../../60-Research/raw-perplexity/raw-weather-realworld-2026-06-05]]
- [[../../60-Research/raw-perplexity/raw-weather-games-2026-06-05]]
- [[../../60-Research/raw-perplexity/raw-weather-determinism-2026-06-05]]
- [[../../50-Game-Design/GD-0029-weather-and-pitch-design-model]]
- [[../state-machines/pitch-condition]]
- [[../bounded-context-map]]
- [[ADR-0018-systemic-events-and-player-lifecycle]]
- [[ADR-0068-fixture-scheduling-contract]]
- [[ADR-0062-audience-and-atmosphere-context]]
- [[../../60-Research/determinism-and-replay]]
