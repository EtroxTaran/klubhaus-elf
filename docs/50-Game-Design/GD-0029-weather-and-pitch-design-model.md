---
title: GD-0029 Weather & Pitch Design Model
status: accepted
tags: [game-design, gddr, weather, pitch, match, environment, fmx-66]
created: 2026-06-05
updated: 2026-06-11
type: game-design
binding: false
supersedes:
superseded_by:
related:
  - [[README]]
  - [[../10-Architecture/09-Decisions/ADR-0077-environment-and-climate-context-weather-and-pitch]]
  - [[../10-Architecture/state-machines/pitch-condition]]
  - [[../60-Research/weather-and-pitch-conditions-2026-06-05]]
  - [[match-engine]]
  - [[stadium-and-campus]]
  - [[audience-and-atmosphere]]
  - [[../30-Implementation/economy-calibration-and-soak-test-runbook]]
---

# GD-0029: Weather & Pitch Design Model

## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `draft`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

## Date

2026-06-05

## Player experience goal

Weather should feel like *believable football weather* — a wet derby, a windy
away day, a sun-baked late-season run — that subtly colours how a match plays and
rewards reading the forecast, **without** ever feeling like a dice roll that
decides the result. The meaningful, investable lever is the **pitch** and the
infrastructure that protects it.

## Decided / strong

Companion design model to
[[../10-Architecture/09-Decisions/ADR-0077-environment-and-climate-context-weather-and-pitch]]
(architecture, ownership, determinism). This GDDR fixes the **shape and effect
*directions*** only; every magnitude is **FMX-52 calibration** behind
`weatherModelVersion`. Nico chose **D1–D4 = C/A/A/A** live (2026-06-05).

- **Weather parameter vector** (per fixture, consumed at `lineup_locked`)
  (raw-weather-realworld; FM/OOTP precedent):
  - `precip { type: none|rain|sleet|snow, intensityBand }`
  - `temperatureC`, `humidityPct`
  - `wind { speedBand, directionDeg }`
  - derived **`wbgt`** (heat-stress index from temp + humidity + sun + wind)
  - `visibilityBand`
  - `altitudeBand` (venue attribute — affects ball flight + fatigue).
- **Regime taxonomy** driving the seasonal template (raw-weather-determinism;
  Richardson/WGEN regimes): **Fine · Unsettled · Stormy · Heatwave · Freeze**,
  selected by a bounded weekly Markov chain per region/season; regimes give
  realistic *spells* (a wet week, a cold snap) rather than independent per-match
  noise.
- **Pitch-condition ladder** (the main amplifier — FM/OOTP lesson):
  - wet axis: `firm → soft → muddy → waterlogged`
  - cold axis: `firm → hard → frozen`
  - driven by weather + drainage + undersoil heating + accumulated usage (Stadium
    Operations owns the facility/usage inputs). Detail + transitions in
    [[../10-Architecture/state-machines/pitch-condition]].
- **In-match effect directions** (magnitudes = calibration; kept *small* for
  weather, *larger* via pitch):
  - **Rain / wet pitch:** ball skids faster then holds up; ↑ first-touch errors,
    ↑ slips, ↓ short-passing reliability, ↑ goalkeeper fumbles.
  - **Wind (above a gust band):** ↑ dispersion on long passes / crosses / shots /
    set pieces; direction matters (head/tail/cross).
  - **Heat (high WBGT):** ↑ fatigue accumulation; **WBGT ≥ 32 °C → cooling
    break** (real FIFA threshold; drinks-break band reserved).
  - **Cold / frozen:** ↑ muscle-injury risk; faster/less predictable bounce on
    hard ground; ↓ visibility with snow.
  - **Altitude:** ↑ ball-flight distance; ↑ fatigue until acclimatised.
  - **Pitch condition** is the amplifier: a muddy/waterlogged surface materially
    reduces short-passing and raises injury risk, pushing teams toward long/direct
    play — the believable tactical consequence.
- **Fallible forecast as a mechanic (D3):** a pre-match forecast (range + a
  confidence band) that **can legitimately differ** from the realized conditions,
  letting the manager plan kit / tactics / squad under uncertainty. Derived
  deterministically (ADR-0077 §D3) — never a save-scummable reroll.
- **Infrastructure-as-mitigation:** undersoil heating, drainage and pitch
  maintenance (Stadium Operations / [[stadium-and-campus]]) reduce weather impact
  and pitch degradation — a clean investment payoff for technical sides.

## Open (Wave 2)

- **Postponement / abandonment** (waterlogged / frozen / dense fog → unplayable)
  and pre-match pitch inspection — **reserved** (out of MVP per D4); pulls in
  League re-fixturing + refund/economy. Named hook `PitchPlayabilityRuling` +
  `postponed`/`abandoned` future FSM transition.
- All **numeric magnitudes**: effect sizes per condition, regime transition
  probabilities, gust/visibility/WBGT bands, pitch-decay + recovery rates,
  forecast-error σ / skill — **FMX-52** calibration (banded ranges, evidence
  gate), not locked from intuition.
- Dynamic in-match weather change (rain starting mid-match) — reserved; MVP fixes
  conditions at `lineup_locked`.
- Per-region climate-zone catalog depth + altitude catalog — data follow-up
  (IP-clean, GD-0015 / ADR-0007).
- Drinks-break band (WBGT ~26–32 °C) — reserved alongside the cooling break.

## Rationale

Prior art is unambiguous: the games that handle weather well (FM, OOTP) keep the
**direct** weather effect modest and make the **pitch + infrastructure** the
system the player actually engages with; the games that make weather swingy
(OOTP wind, CM frozen pitches) or cosmetic (FIFA/PES) are the cautionary cases.
Grounding the seasonal model in real regional/monthly climate (and the FIFA WBGT
cooling-break rule) buys believability cheaply, while the regime/template
structure delivers realistic spells deterministically. A fallible forecast turns
a normally-cosmetic UI element into a small, fair decision — explicitly the
differentiator the research flags as available.

## Consequences

Positive:

- Believable, regionally-varied weather with realistic spells; subtle match
  colour that shapes style without dominating outcomes.
- A real planning surface (forecast) + a real investment payoff (pitch
  infrastructure) — both fair and replay-safe.
- Effect *directions* fixed now; tuning deferred to the calibration capstone, so
  no magic numbers get baked from intuition.

Negative / constraints:

- Effect realism is only as good as FMX-52 calibration; un-tuned, the model is
  inert or swingy — the two documented failure modes.
- Postponements (a memorable narrative beat) are deferred, so MVP weather drama is
  limited to in-match colour + the forecast gamble.
- Pitch-condition believability depends on Stadium Operations facility/usage
  fidelity being present.

## Supersedes

None

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0077-environment-and-climate-context-weather-and-pitch]]
  (ownership, RNG/determinism, event contracts, forecast determinism, MVP scope).

## Related

- Research: [[../60-Research/weather-and-pitch-conditions-2026-06-05]]
  (+ raw: [[../60-Research/raw-perplexity/raw-weather-realworld-2026-06-05]],
  [[../60-Research/raw-perplexity/raw-weather-games-2026-06-05]],
  [[../60-Research/raw-perplexity/raw-weather-determinism-2026-06-05]]).
- Decisions: [[../10-Architecture/09-Decisions/ADR-0077-environment-and-climate-context-weather-and-pitch]];
  state machine [[../10-Architecture/state-machines/pitch-condition]].
- Calibration: [[../30-Implementation/economy-calibration-and-soak-test-runbook]] (FMX-52).
- [[README]] — Game Design Log (hub) · siblings: GD-0026 set-piece-coach readiness, GD-0028 dialogue-intent.
