---
title: "Weather & pitch conditions — ownership + determinism (FMX-66)"
status: draft
tags: [research, weather, pitch, determinism, replay, rng, environment, match, fmx-66]
created: 2026-06-05
updated: 2026-06-05
type: research
binding: false
related:
  - [[raw-perplexity/raw-weather-realworld-2026-06-05]]
  - [[raw-perplexity/raw-weather-games-2026-06-05]]
  - [[raw-perplexity/raw-weather-determinism-2026-06-05]]
  - [[determinism-and-replay]]
  - [[../10-Architecture/09-Decisions/ADR-0077-environment-and-climate-context-weather-and-pitch]]
  - [[../50-Game-Design/GD-0029-weather-and-pitch-design-model]]
  - [[../10-Architecture/state-machines/pitch-condition]]
  - [[../10-Architecture/bounded-context-map]]
---

# Weather & pitch conditions — research synthesis (FMX-66)

Grounds **FMX-66** (epic E2 — Match Determinism & Tactical Contracts; gap **G23**):
assign an owner to weather generation and define a replay-safe RNG/determinism
path, the weather parameter set, and forecast-vs-live behaviour. Three Perplexity
strands were captured verbatim: real-world football weather
([[raw-perplexity/raw-weather-realworld-2026-06-05]]), prior-art games
([[raw-perplexity/raw-weather-games-2026-06-05]]) and deterministic generation
best-practice ([[raw-perplexity/raw-weather-determinism-2026-06-05]]). This note
distils them; decisions land in
[[../10-Architecture/09-Decisions/ADR-0077-environment-and-climate-context-weather-and-pitch]]
(architecture) and [[../50-Game-Design/GD-0029-weather-and-pitch-design-model]]
(design). Status `draft` — direction, not authority.

## 1. What the vault already fixes (pre-existing constraints)

- **`WeatherRng` already exists** as locked stream **#5** in
  [[determinism-and-replay]] §2.2: *"Match-day weather, pitch conditions; isolated
  so weather refactors don't affect physical events"* (World-save persistence).
  Weather is therefore **not** a `WorldRng` sub-label (the FMX-66 ticket text
  predates the locked-9 stream table — corrected here). Seed derivation is by
  hashed label (`xxhash32(label, masterSeed)`, PCG32 per stream); adding new
  streams/labels never breaks existing replays (§2.3); a stream must never draw
  from another stream (§2.4).
- **Consumers already named, generation unowned:** Stadium Operations publishes
  `PitchConditionChanged` and Match consumes `StadiumCapacitySnapshot` +
  `PitchConditionChanged` at `lineup_locked`; the Matchday-Event-Engine consumes
  weather for "Pyro / weather / catering / medical / security" policies; Audience
  & Atmosphere folds **weather** into its atmosphere multiplier
  ([[../10-Architecture/bounded-context-map]] §1). **No context owns weather
  generation** — the G23 gap.
- **Lock-time snapshot rule:** Match seeds at `lineup_locked` and replays
  byte-identically from committed inputs; any weather/pitch a match consumes must
  be a frozen snapshot at/before lock (Reference + Snapshot pattern, as Tactics
  and Stadium Ops already do).
- **Per-fixture weather needs a stable fixture identity** — `matchId` /
  `fixtureOrdinalWithinSeason` from ADR-0068 fixture scheduling (the ticket's
  E1-2 dependency).

## 2. Real-world grounding (realism targets)

- **Parameters that matter:** precipitation (skid → unpredictable bounce, slips,
  GK handling, shorter passing), wind (long-ball / set-piece / cross dispersion;
  head/tail/cross), temperature & humidity via **WBGT** (fatigue), cold/snow
  (muscle-injury risk, visibility, footing), fog (visibility), plus altitude/air
  density (ball flight + fatigue) as a stadium attribute.
- **Hard thresholds that exist:** FIFA **WBGT ≥ 32 °C → cooling breaks** (drinks
  breaks ~26–32 °C); waterlogging judged by **"ball won't bounce/roll normally"**
  (Law 5 referee discretion, no numeric rainfall standard); frozen pitch + no
  undersoil heating → unplayable.
- **Pitch playability = surface × drainage × undersoil heating × usage.** States:
  playable-wet, waterlogged, frozen. Decided by pre-match inspection (current
  state + forecast + remediation time); safety usually decisive.
- **Forecast vs actual is real:** 24–48 h fairly reliable, shower timing/intensity
  off by hours; clubs prep from forecast (covers, undersoil heating, hydration).
- **Seasonality by region:** N/NW Europe wet-cold winters (undersoil heating
  saves play); Mediterranean hot Aug/May ends; continental winter breaks;
  tropical wet/dry; altitude. Justifies a **regional + monthly** climate model.

## 3. Prior-art lessons (game design)

- **FM & OOTP use a region+month climate model** with per-fixture realization,
  varying believably by month/country. FIFA/PES treat weather as cosmetic +
  minor physics; classic CM/Anstoss use simple per-nation monthly tables with
  big narrative/injury swings.
- **The dominant best-practice lesson: keep weather *subtle*; make pitch
  condition + infrastructure the meaningful lever.** FM's larger swing is the
  pitch, not weather in isolation; over-swingy weather (OOTP wind, CM frozen
  pitches) reads as unfair/streaky.
- **Forecast is a missed opportunity in FM/FIFA** (forecast == actual, pure UI).
  A *fallible* forecast is an available differentiator (plan kit/tactics/squad
  under uncertainty).
- **Infrastructure-as-mitigation** (undersoil heating, drainage, turf) is a clean,
  proven club-investment hook tied to weather — and it already lives in Stadium
  Operations (facility decay + maintenance).

## 4. Determinism best practice (replay-safe structure)

- **Recommended structure = (b) seasonal/regional climate TEMPLATE → per-fixture
  realization**, with bounded weekly **Markov regimes** inside the template (the
  Richardson/WGEN paradigm: separate wet/dry occurrence from gamma amount,
  seasonal harmonic modulation, regime types). Pure/stateless template generation
  recomputable from `(region, seasonYear, masterSeed)` — no stored daily state.
  Rejected: pure per-fixture draw (no spells/seasonality); continuous day-by-day
  AR/Markov (history-coupled → replay-fragile + expensive to reconstruct).
- **One named sub-stream per logical output + versioned labels:**
  `WeatherRng:climate:region:<r>:season:<y>:v1:core`,
  `WeatherRng:match:<matchId>:v1:truth:<feature>`,
  `WeatherRng:match:<matchId>:v1:forecast:<feature>`. Adding `wind` later as a new
  label never perturbs shipped `rain`/`temp` draws. Use only immutable label
  components (regionId, seasonId, matchId).
- **Forecast = "truth + noised forecast"** from a separate `:forecast` label —
  bit-identical on replay, legitimately different from truth; recompute from seed
  (optionally a `forecastVersion` to preserve "what the user saw").
- **Pitch condition = accumulated state + pre-match snapshot**, not
  recompute-from-genesis (usage/resting decisions are real game state). Pure
  update `G(state_t, weather_t, usage_t)`; store a pre-match snapshot with the
  match for robust single-match replay.

## 5. Open decisions carried to the gate (answered live by Nico 2026-06-05)

| # | Question | Nico's choice |
|---|---|---|
| D1 | Owner of weather generation | **New "Environment & Climate" bounded context** (owns weather + pitch-weather model) |
| D2 | Generation model / determinism structure | **Seasonal/regional template + bounded Markov regimes → per-fixture realization** |
| D3 | Forecast vs actual | **Fallible deterministic forecast** (truth + noised forecast) |
| D4 | MVP scope | **In-match modifiers + WBGT≥32 cooling break only**; postponement/abandonment = reserved stub |

Numeric magnitudes (effect sizes, regime probabilities, pitch-decay rates, WBGT
bands, forecast-error σ) are **calibration debt** routed to FMX-52, never locked
from intuition. The precise weather-vs-pitch *state* ownership boundary
(Environment & Climate vs Stadium Operations, which owns facility decay/usage) is
the one item flagged for Nico's ratification in ADR-0077.

## 6. Sources

Real-world: FIFA/IFAB Laws 1 & 5 + WBGT cooling-break guidance; sports-science
heat/humidity performance studies; pitch-drainage/undersoil-heating practice
(see raw capture citations). Games: FM/OOTP/EA FC/PES/CM/Anstoss community +
dev-documented mechanics. Determinism: Wilks & Wilby stochastic weather-generator
review (Richardson/WGEN/LARS-WG), deterministic-vs-ensemble forecasting. Full URLs
in the three raw captures.
