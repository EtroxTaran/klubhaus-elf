---
title: Handoff - fmx-66-weather (2026-06-05)
status: open
tags: [meta, execution, handoff, fmx-66, weather, pitch, environment]
created: 2026-06-05
updated: 2026-06-05
type: handoff
binding: false
related:
  - [[../../10-Architecture/09-Decisions/ADR-0077-environment-and-climate-context-weather-and-pitch]]
  - [[../../50-Game-Design/GD-0029-weather-and-pitch-design-model]]
  - [[../../60-Research/weather-and-pitch-conditions-2026-06-05]]
  - [[../../10-Architecture/state-machines/pitch-condition]]
---

# Handoff: fmx-66-weather (2026-06-05)

## Linear

- Issue: **FMX-66** — Weather ownership + RNG/determinism path (E2 epic FMX-58; gap G23).
  Moved to **In Progress**; branch `claude/fmx-66-weather-ownership-rng-determinism`.

## Done this session

- Ran 3 grounded Perplexity researches (real-world football weather; prior-art
  games; deterministic weather-generators) → saved verbatim + a synthesis note.
- Surfaced the 4 open decisions live to Nico with recommendations.
  **Nico chose D1–D4 = C/A/A/A (2026-06-05):** new **Environment & Climate**
  bounded context / seasonal template + regimes → realization / fallible
  deterministic forecast / in-match modifiers only (postponement reserved).
- Authored proposed **ADR-0077** (architecture: ownership, `WeatherRng`
  determinism path + versioned per-feature sub-labels, event contracts, forecast
  determinism, pitch-condition determinism, MVP scope, 11 invariants, map-patch
  proposal not applied) + draft **GD-0029** (design model) + draft
  `pitch-condition` state machine.
- Claimed numbers in the indices: **ADR-0077** (Decision-Log) + **GD-0029**
  (Game-Design README) — note GD-0028 was already taken (FMX-87), so this is
  GD-0029. Updated Current-State hot memory.

## Open / next step

1. **Nico ratification** of ADR-0077 (D1–D4 = C/A/A/A) + the **open ratification
   item**: exact pitch-condition *state* ownership boundary (Environment & Climate
   vs Stadium Operations).
2. On ratify: apply the **bounded-context-map** patch (19 → 20 contexts; add
   Environment & Climate; Stadium Ops row weather-input clause; `src/domain/`
   `environment-climate/` folder).
3. Later issue (E2/League): the reserved **postponement / abandonment +
   re-fixturing** slice (`PitchPlayabilityRuling` hook).
4. **FMX-52** calibration: weather effect magnitudes, regime probabilities,
   pitch-decay/recovery rates, WBGT/visibility bands, forecast-error σ — banded
   behind `weatherModelVersion`.

## Blockers

- None blocking the proposal. Implementation gated on Nico ratify (ask-first
  gate) + FMX-52 calibration for magnitudes.

## Changed vault paths

- NEW `docs/10-Architecture/09-Decisions/ADR-0077-environment-and-climate-context-weather-and-pitch.md` (proposed)
- NEW `docs/50-Game-Design/GD-0029-weather-and-pitch-design-model.md` (draft)
- NEW `docs/10-Architecture/state-machines/pitch-condition.md` (draft)
- NEW `docs/60-Research/weather-and-pitch-conditions-2026-06-05.md` (draft synthesis)
- NEW `docs/60-Research/raw-perplexity/raw-weather-realworld-2026-06-05.md` (raw)
- NEW `docs/60-Research/raw-perplexity/raw-weather-games-2026-06-05.md` (raw)
- NEW `docs/60-Research/raw-perplexity/raw-weather-determinism-2026-06-05.md` (raw)
- EDIT `docs/00-Index/Decision-Log.md` (ADR-0077 row + frontmatter)
- EDIT `docs/50-Game-Design/README.md` (GD-0029 row + section + frontmatter)
- EDIT `docs/00-Index/Current-State.md` (FMX-66 hot line + frontmatter)
- NOT edited (ratify gate): `docs/10-Architecture/bounded-context-map.md`

## Needs promotion

- ADR-0077 `proposed → accepted` + GD-0029 `draft → approved` on Nico ratify, in
  the same PR as the bounded-context-map patch.
