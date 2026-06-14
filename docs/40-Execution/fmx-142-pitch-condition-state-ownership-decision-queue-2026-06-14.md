---
title: FMX-142 pitch-condition state ownership decision queue
status: current
tags: [execution, decision-queue, pitch, weather, stadium, ownership, fmx-142]
created: 2026-06-14
updated: 2026-06-14
type: decision-queue
binding: false
linear: FMX-142
related:
  - [[../60-Research/pitch-condition-state-ownership-2026-06-14]]
  - [[../60-Research/raw-perplexity/raw-pitch-condition-state-ownership-ddd-2026-06-14]]
  - [[../60-Research/raw-perplexity/raw-pitch-condition-realworld-operations-2026-06-14]]
  - [[../60-Research/raw-perplexity/raw-pitch-condition-game-precedents-2026-06-14]]
  - [[../10-Architecture/bounded-context-map]]
  - [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
  - [[../10-Architecture/09-Decisions/ADR-0077-environment-and-climate-context-weather-and-pitch]]
  - [[../10-Architecture/state-machines/pitch-condition]]
---

# FMX-142 pitch-condition state ownership decision queue

This queue records the FMX-142 decision trail. It exists even though the packet
does not create a new architecture decision, because the issue required the
research and decision chain to be saved.

## D1 - canonical pitch-condition state owner

| Option | Meaning | Assessment |
|---|---|---|
| **A. Stadium Operations owns state; Environment & Climate owns weather inputs/rules** | Stadium Operations owns facility/usage state, accumulated pitch condition and `PitchConditionChanged`. Environment & Climate publishes weather facts, forecasts and pitch-weather derivation rules. | **Approved. Recommended.** Matches ADR-0077, DDD aggregate ownership, real-world stadium operations and comparable-game precedent. |
| B. Environment & Climate owns pitch-condition state | Move the pitch aggregate and `PitchConditionChanged` out of Stadium Operations. | Reopens an accepted boundary and splits facility/usage invariants away from their operational owner. |
| C. Dual owner / projection owner | Keep both contexts able to publish pitch-condition facts, or let Match/Analytics own a composite snapshot. | Creates duplicate authority. Projections are fine for reads, not for state-changing ownership. |

**Decision:** A.

## D2 - public map/event wording

| Option | Meaning | Assessment |
|---|---|---|
| **A. Map weather outputs and pitch outputs separately** | Environment & Climate exposes `WeatherForecastPublished`, `MatchWeatherResolved` and weather/forecast/snapshot queries; Stadium Operations exposes `PitchConditionChanged`. | **Approved. Recommended.** Keeps public contracts self-explanatory and prevents a false `PitchConditionChanged` producer. |
| B. Leave shorthand as "weather/pitch snapshots" | Keep existing map wording and rely on ADR body text for nuance. | This is the source of the FMX-142 ambiguity. |
| C. Create a new shared `WeatherPitchSnapshotPublished` event now | Add a neutral composite event name. | Premature contract surface for a docs cleanup; would need a new ADR/GDDR pass. |

**Decision:** A.

## D3 - documentation treatment

| Option | Meaning | Assessment |
|---|---|---|
| **A. Apply as accepted-boundary cleanup** | Amend map, ADR-0018, ADR-0077 wording, pitch-condition companion note and front-door indexes without creating a new ADR. | **Approved. Recommended.** No new decision is being made; the accepted ADR-0077 split is being made consistent. |
| B. Create ADR-0110 for pitch-state owner | Treat the cleanup as a new architecture decision. | Too heavy and risks duplicating ADR-0077. |
| C. Keep only a research note | Save research but leave canonical maps unchanged. | Fails the issue because future agents would still see conflicting ownership. |

**Decision:** A.

## Decision record

- 2026-06-14: FMX-142 selected by Nico from the live Linear shortlist.
- 2026-06-14: FMX-142 moved to `In Progress`.
- 2026-06-14: Perplexity/Web research saved for DDD ownership, real-world
  stadium/pitch operations and comparable-game weather/pitch precedent.
- 2026-06-14: Nico instructed implementation of the proposed FMX-142 plan.
- 2026-06-14: Vault reconciliation applied to the bounded-context map, ADR-0018,
  ADR-0077, pitch-condition companion note and front-door indexes.

## Approved packet

Apply **D1=A, D2=A, D3=A**.
