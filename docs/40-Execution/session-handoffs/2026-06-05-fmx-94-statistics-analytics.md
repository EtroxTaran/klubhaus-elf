---
title: Handoff FMX-94 statistics analytics read-model owner
status: wrapped
tags: [meta, execution, handoff, fmx-94, statistics, analytics, read-model]
created: 2026-06-05
updated: 2026-06-05
type: handoff
binding: false
related:
  - [[../../60-Research/statistics-analytics-read-model-owner-2026-06-05]]
  - [[../../60-Research/raw-perplexity/raw-statistics-analytics-read-model-owner-2026-06-05]]
  - [[../../10-Architecture/09-Decisions/ADR-0081-statistics-analytics-read-model-owner]]
  - [[../../50-Game-Design/GD-0031-analytics-hub-and-statistics]]
  - [[../../20-Features/feature-statistics-analytics-hub-mvp]]
---

# Handoff: FMX-94 statistics analytics read-model owner (2026-06-05)

## Goals

- Claim FMX-94 and close gap G19 with sourced research and a decision-ready
  owner assignment.
- Resolve the ADR-0068 `standingsRef` dependency without violating FMX's
  no-cross-context-join rule.
- Preserve raw research, synthesis, proposed ADR, draft GDDR, feature spec and
  index updates.

## Completed

- Linear FMX-94 moved to `In Progress`.
- Raw Perplexity/Web capture saved:
  [[../../60-Research/raw-perplexity/raw-statistics-analytics-read-model-owner-2026-06-05]].
- Research synthesis added:
  [[../../60-Research/statistics-analytics-read-model-owner-2026-06-05]].
- Proposed ADR added:
  [[../../10-Architecture/09-Decisions/ADR-0081-statistics-analytics-read-model-owner]].
- Draft GDDR added:
  [[../../50-Game-Design/GD-0031-analytics-hub-and-statistics]].
- Draft MVP feature spec added:
  [[../../20-Features/feature-statistics-analytics-hub-mvp]].
- ADR-0068 follow-up note added so the `standingsRef` dependency points at
  ADR-0081.
- Front-door maps, `Current-State`, `Decision-Log`, research summary and raw
  research index updated.

## Open Tasks

- Nico ratifies or revises ADR-0081.
- If accepted, update the ratified bounded-context table from 19 to 20 contexts.
- Future implementation must add projection fixtures, outbox consumers,
  rebuild tests and Analytics Hub UI.
- Metric formulas and thresholds remain calibration/model work.
- Manager & Legacy scoring/HoF formulas remain FMX-95 / E6-3 territory.

## Decisions Made

- D1: dedicated projection-only Statistics & Analytics owner.
- D2: per-save projections plus immutable Manager & Legacy / HoF handoff
  snapshots.
- D3: full MVP Analytics Hub.
- D4: core stats plus xG/xA/xGA, PPDA, field tilt, maps, heatmaps, zone control,
  per-90 leaderboards, form and comparisons; xT/OBV/custom reports/export and
  similarity search post-MVP.

## Blockers

- None for documentation. Implementation remains blocked by the project phase
  until architecture/design ratification.

## Durable Notes Updated

- [[../../60-Research/raw-perplexity/raw-statistics-analytics-read-model-owner-2026-06-05]]
- [[../../60-Research/statistics-analytics-read-model-owner-2026-06-05]]
- [[../../10-Architecture/09-Decisions/ADR-0081-statistics-analytics-read-model-owner]]
- [[../../50-Game-Design/GD-0031-analytics-hub-and-statistics]]
- [[../../20-Features/feature-statistics-analytics-hub-mvp]]
- [[../../10-Architecture/09-Decisions/ADR-0068-fixture-scheduling-contract]]
- [[../../10-Architecture/bounded-context-map]]
- [[../../00-Index/Current-State]]
- [[../../00-Index/Decision-Log]]
- [[../../00-Index/Research-Map]]
- [[../../00-Index/Architecture-Map]]
- [[../../00-Index/Game-Design-Map]]
- [[../../00-Index/Feature-Map]]
- [[../../60-Research/00-summary]]
- [[../../60-Research/raw-perplexity/README]]

## Promotion Needed

- Promote ADR-0081 from `proposed` to `accepted` only after Nico ratifies it.
- Promote GD-0031 / feature spec only after the architecture owner is ratified
  and Nico approves MVP UI scope.
