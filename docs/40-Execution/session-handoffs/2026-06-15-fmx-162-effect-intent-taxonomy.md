---
title: FMX-162 Effect-intent taxonomy handoff
status: current
tags: [execution, handoff, effect-intent, narrative, media-ecology, press, dialogue, fmx-162]
created: 2026-06-15
updated: 2026-06-15
type: handoff
binding: false
linear: FMX-162
related:
  - [[../../60-Research/effect-intent-taxonomy-cross-producer-2026-06-15]]
  - [[../../10-Architecture/09-Decisions/ADR-0126-cross-producer-effect-intent-taxonomy]]
  - [[../fmx-162-effect-intent-taxonomy-decision-queue-2026-06-15]]
---

# FMX-162 Effect-intent taxonomy handoff

## Branch

`codex/fmx-162-effect-intent-taxonomy`

## Linear

FMX-162 was moved from `Backlog` to `In Progress` on 2026-06-15 before branch
or file work. Nico approved D1-D7 on 2026-06-19; the packet is accepted.

## Durable notes updated

- [[../../60-Research/effect-intent-taxonomy-cross-producer-2026-06-15]]
- [[../../60-Research/raw-perplexity/raw-effect-intent-taxonomy-realworld-2026-06-15]]
- [[../../60-Research/raw-perplexity/raw-effect-intent-taxonomy-game-precedents-2026-06-15]]
- [[../../60-Research/raw-perplexity/raw-effect-intent-taxonomy-ddd-contracts-2026-06-15]]
- [[../../60-Research/raw-perplexity/raw-effect-intent-taxonomy-source-checks-2026-06-15]]
- [[../../10-Architecture/09-Decisions/ADR-0126-cross-producer-effect-intent-taxonomy]]
- [[../fmx-162-effect-intent-taxonomy-decision-queue-2026-06-15]]

## Packet status

Draft/non-binding. Nico decisions are pending.

Recommended packet: **D1-D7 = A/A/A/A/A/A/A**:

- one canonical published-language catalog, not a shared domain model;
- advisory intents only, with owner-context validation/application;
- dedicated ADR-0126 as catalog governance home;
- full v1 catalog accounting for GD-0028, ADR-0065 and ADR-0085 names;
- People supplies persona/receptivity gates and scalers for v1;
- visible bounded outcomes plus history/audit rows;
- future code-phase exhaustive mapping conformance test.

## Promotion needed

If Nico accepts D1-D7, promote:

- [[../../10-Architecture/09-Decisions/ADR-0126-cross-producer-effect-intent-taxonomy]]
  to `accepted` / `binding: true`;
- ADR-0065 and ADR-0085 deferred taxonomy flags from placeholders to resolved
  pointers at ADR-0126;
- the bounded-context-map clause proposed in ADR-0126;
- future code-phase contract-test planning for
  `effect-intent-catalog-exhaustive-mapping`.

Do not promote numeric magnitudes here. They remain in GD-0043 calibration
slots.

## Blockers

- Nico must answer D1-D7 before ADR-0126 becomes binding.
