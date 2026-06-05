---
title: "RAW Perplexity — Deterministic replay-safe weather generation (FMX-66)"
status: raw
tags: [research, raw, perplexity, weather, determinism, replay, rng, fmx-66]
created: 2026-06-05
updated: 2026-06-05
type: research-raw
binding: false
related:
  - [[../weather-and-pitch-conditions-2026-06-05]]
  - [[../../10-Architecture/09-Decisions/ADR-0077-environment-and-climate-context-weather-and-pitch]]
  - [[../determinism-and-replay]]
---

# RAW — Deterministic, replay-safe weather generation best practice

Verbatim Perplexity (Sonar) capture. Prompt: best deterministic structure for
weather over a decades-long replay-strict save (per-fixture draw vs seasonal
template vs continuous Markov); label/RNG taxonomy for future-proof extensibility;
deterministic forecast-vs-actual; deterministic pitch condition with accumulating
usage; transferable real-world weather-generator (WGEN/Richardson) concepts.
Captured 2026-06-05 for FMX-66. **Status: raw** — synthesis is
[[../weather-and-pitch-conditions-2026-06-05]].

---

## 1. Structure choice over decades
Recommended: **(b) seasonal/regional climate template + simple local realisations**, with a light Markov/AR flavour for persistence, not a fully free-running continuous process. Real-world stochastic weather generators (Richardson-type, WGEN, LARS-WG) define a stationary/slowly-varying climate (monthly/seasonal stats per location) and run a short-memory stochastic process within it (1st-order Markov wet/dry + conditional amount/temperature).

- **(a) Pure per-fixture independent draw** — `weather = f(regionId, seasonId, matchIndex, masterSeed)` via WeatherRng. Pros: trivially deterministic, no cross-match state. Cons: no temporal correlation (back-to-back fixtures swing wildly), hard to impose realistic spells. Pick for arcade/cosmetic.
- **(b) Seasonal/regional template + per-fixture realization (recommended baseline)** — once per (region, seasonYear) generate a climate template (per week/day slot: wet-day probability, mean rain, mean temp, variance, maybe a regime label); per fixture do a local draw. Template seed `WeatherRng:climate:region:<r>:season:<y>`; fixture seed from (region, season, fixtureId). Pros: matches WGEN/Richardson; deterministic; very tunable (per-league wetter winters) without code changes; episodic correlation without long global state. Cons: must choose template resolution + regime persistence.
- **(c) Continuous Markov/AR day-by-day** — advance `X_{t+1}=F(X_t, ε_t)` every day. Pros: highest realism (multi-day persistence/clustering). Cons: global temporal coupling — any scheduling change/skipped sim/load-order can desync old replays unless fully recomputable; store state every step (big save) or replay entire daily process (expensive/brittle); harder to tune/debug.

**Pragmatic hybrid (recommended):** adopt (b) templates as the canonical "seasonal climate"; inside template generation use bounded Markov/AR — e.g. per week draw a regime (normal/wet-spell/dry-spell) via a small Markov chain on regimes; per day/fixture draw weather conditional on the regime. Keep template generation pure/stateless (depends only on (region, seasonYear) + master seed) so it always recomputes for replay without storing daily state. Mirrors weather generators where Markov chains run on daily states inside a fixed climate period, not over arbitrarily long histories.

## 2. Label/RNG taxonomy so future granularity doesn't break replays
- **Never interleave new draws into existing streams.** For each new semantic feature allocate a **new sub-stream label tree**, not new calls in an existing one.
- **Label hierarchy with explicit feature versioning:** `WeatherRng:match:<matchId>:v1:rain`; add wind later as `WeatherRng:match:<matchId>:v1:wind` (a label that didn't exist before, so old rain draws stay bit-identical). Templates: `WeatherRng:climate:region:<r>:season:<y>:v1:core`; extension `...:v2:windClimatology` without touching v1.
- **One named stream per logical output**, not one stream shared by rain/temp/wind/cloud in sequence — so adding wind doesn't shift rain/temp sequences. Use `...:match:<id>:rain`, `...:match:<id>:temp`, `...:match:<id>:wind`.
- **Version gates in data, not RNG:** rev rain logic → new `...:rain:v2` label; keep v1 for replaying old saves (xxhash32 of the label yields a different bitstream).
- **Use only semantic, stable label components** (immutable seasonId/regionId/matchId); avoid "week index in schedule" if reschedulable — prefer immutable `fixtureOrdinalWithinSeason`/`matchId`.
- Treat each RNG stream as a **versioned API**: once a label ships, never change how many draws or its purpose; add new labels for new behaviour.

## 3. Deterministic forecast vs realized conditions (with forecast error)
- **Approach A — "Truth first, noised forecast" (simplest):** from `WeatherRng:match:<id>:v1:truth` generate true conditions; from a separate `WeatherRng:match:<id>:v1:forecast` stream compute forecast as a deterministic noisy/biased transform of truth (e.g. `forecastTemp = truthTemp + N(0, σ_forecast)`). Both derive from stable labels with the same draw sequence → forecast and truth are bit-identical on replay while still differing.
- **Approach B — "Latent driver + two deterministic heads":** from `...:v1:latent` generate a latent atmosphere vector z; `weatherReal = F_real(z)`, `weatherForecast = F_forecast(z)` (noisier/biased mapping, optional `...:forecastNoise`), calibrated to a desired forecast skill (e.g. 80 % correct).
- **Consistency:** non-overlapping labelled streams for template / truth / forecast; forecast purely functional in those streams + model code (no game-state dependence). For replay, recompute forecast from seed rather than storing an approximate value; if you must preserve "what the user saw" across forecast-algorithm changes, store a `forecastVersion` per match and dispatch old vs new deterministic functions.

## 4. Deterministic pitch condition with long-term usage
- **Accumulate state every match (recommended for games):** maintain a pitch-state object (immutable: baseDrainage/soilType; dynamic: moisture, compaction, grassCover, roughness, residualDamage). After each match apply a deterministic update `state_{t+1}=G(state_t, matchWeather_t, usage_t)` and store it. For single-match replay, store a **pre-match snapshot** of `state_t` with the match (most robust) rather than replaying all previous matches. Pros: flexible, simple persistent entity. Cons: save size + schema migration.
- **Recompute from seed** alone can't honour real usage decisions (resting the pitch, friendlies, scheduling) without pseudo-replaying all usage — so for a sim where usage matters, **stateful pitch** is the right abstraction.
- **Recommended pattern:** persistent pitch state + schema version per stadium; pure update function of (prior state, deterministic match weather, usage metrics); for replays store a pre-match pitch-state snapshot + match seed + schema version; reconstruct from snapshot, independent of the global sequence of earlier matches (robust to extra sims between replays + version-gated update changes).

## 5. Real-world weather generators — what to borrow (Wilks & Wilby review)
- **Separate occurrence and amount:** precipitation occurrence (wet/dry) via Markov chain; amount on wet days via a continuous distribution (often gamma). Template stores wet-day probabilities P(W|W), P(W|D) + gamma/log-normal amount params per (region, season, week); realization samples wet/dry then intensity.
- **Markov chain for wet/dry spells (Richardson):** 1st-order chain over Wet/Dry with P_DD, P_DW, P_WD, P_WW → realistic spell lengths without long history.
- **Conditional temperature:** temperature as a stochastic process conditional on wet/dry + season, often AR(1); rainy days cooler, higher humidity.
- **Seasonal modulation via smooth functions:** vary parameters smoothly by day-of-year (splines/harmonics); draw small annual anomaly coefficients per season/year ("5 % wetter winter, slightly warmer autumn").
- **Regime / weather-type approaches:** a small set of regimes (high/low-pressure/frontal; or Stormy/Unsettled/Fine/Heatwave), each with its own parameter set; Markov chain on regimes over the season; designers tweak regime probabilities per region/league for flavour.
- **Low dimension, high control:** small number of interpretable knobs (wetness, variability, continentality, storm frequency) — matches the tunability requirement.

**Concrete recipe (region R, season S):**
1. Climate template (one-shot, deterministic) — seed `WeatherRng:climate:region:R:season:S:v1`: draw annual anomalies; per week sample a dominant regime via a Markov chain; derive wet-day probabilities + W/D transition matrix + precip/temp/wind/cloud distribution params from base climate + anomalies + regime.
2. Per-match realization — seed `WeatherRng:match:<matchId>:v1:truth`: find region/season/week; use template params; sample wet/dry then intensity/temp/wind.
3. Forecast — seed `WeatherRng:match:<matchId>:v1:forecast`: deterministic noisy view of truth.
4. Extensibility — new features get new versioned labels (`...:v2:fog`) + new template params (`climate...:v2:fogFreq`), leaving v1 intact for old replays.

Citations:
[1] https://perso.univ-rennes1.fr/valerie.monbet/doc/Wilks&Wilby.pdf
[2] https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/04326.pdf
[3] http://repository.library.noaa.gov/view/noaa/27980
[4] https://opensnow.com/news/post/ensemble-vs-deterministic-weather-models
[5] https://www.worldclimateservice.com/2021/10/12/difference-between-deterministic-and-ensemble-forecasts/
[6] https://gribstream.com/models
[7] https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2022GL101452
[8] https://www.science.org/doi/10.1126/sciadv.adx2372
