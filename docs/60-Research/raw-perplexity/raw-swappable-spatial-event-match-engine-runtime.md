---
title: Raw Perplexity - Swappable Spatial-Event Match Engine Runtime
status: raw
tags: [research, raw, perplexity, match-engine, runtime, rust, typescript, wasm, spatial-event]
created: 2026-05-27
updated: 2026-05-27
type: research
binding: false
related:
  - [[../swappable-spatial-event-match-engine-2026-05-27]]
  - [[../match-engine-runtime-strategy]]
  - [[../../10-Architecture/09-Decisions/ADR-0049-swappable-spatial-event-match-engine]]
  - [[../../50-Game-Design/match-engine]]
---

# Raw Perplexity: Swappable Spatial-Event Match Engine Runtime

Raw research capture for FMX-10. This note preserves the Perplexity research
prompts and high-signal conclusions from the 2026-05-27 session. It is input
material only; the synthesized, source-checked planning note is
[[../swappable-spatial-event-match-engine-2026-05-27]].

## Prompt 1 - Runtime strategy

Question: For a server-authoritative football manager match engine targeting a
PWA, compare TypeScript/Node worker, Rust native service, Rust/WASM, and dual
prototype first for a swappable spatial-event engine. Evaluate development
speed, deterministic replay, CPU scaling, observability, browser/client reuse,
and migration risk. Provide an ADR-style recommendation and decision gates.

Key Perplexity conclusion:

- TypeScript/Node is the fastest first-production path when the model is still
  changing quickly, mainly because iteration and observability are easier.
- Rust native is stronger for long-term CPU throughput, memory predictability,
  latency and match-worker scalability.
- Rust/WASM is useful for browser replay/sandbox reuse but adds server-side
  complexity and JS/WASM boundary costs.
- A full dual V1 is too expensive; a small contract-identical spike is useful
  if runtime choice is high risk.

FMX interpretation after Nico's decision: use a **contract-identical TS-vs-Rust
spike with Rust native as the default production candidate** unless the spike
shows clear disadvantages.

## Prompt 2 - Simulation model

Question: Research spatial-event vs outcome-first vs full agent-based match
simulation for a football manager game requiring 2D display, tactical influence,
star-player visibility, xG/chance modelling, live ticker and scalable server-side
simulation.

Key Perplexity conclusion:

- Outcome-first is cheap but makes 2D, tactics and star-player visibility feel
  decorative.
- Full agent-based simulation is most expressive but expensive to tune,
  calibrate and scale.
- Hybrid spatial-event is the best trade-off: event decisions are driven by
  spatial state, pressure, roles, player attributes, xG/EPV and tactical
  coefficients; 2D animation interpolates committed event/spatial samples.
- Validation needs both deterministic replay tests and statistical tests for
  goals, xG, shots, pass maps, pressure/press effects and star involvement.

## Prompt 3 - Open-source candidates

Question: Find realistic open-source football/soccer simulation engines,
manager-game engines, RL football environments, and physics/ECS libraries that
could be reused or studied for a spatial-event match engine. Include license,
language, maturity, reuse fit, inspiration fit and risks.

Key Perplexity conclusion, verified against primary sources where relevant:

- OpenFootball is the most serious direct-study candidate: Rust, Apache-2.0,
  simulation engine focus, match simulation and performance tooling.
- OpenFootManager is useful for study but GPLv3 makes direct reuse risky unless
  the whole downstream licensing posture accepts copyleft.
- Google Research Football and RoboCup 2D are research references, not likely
  product foundations for FMX.
- Rapier/Bevy can support Rust simulation architecture or physics experiments,
  but neither provides football-manager match semantics.
- Planck.js/Matter.js are useful for quick physics prototypes, not likely
  long-term authoritative server cores.

## Prompt 4 - Engine replacement and determinism

Question: For a swappable football match engine that may move from TypeScript to
Rust native or Rust/WASM, what contracts and tests are required to preserve
deterministic replay, historical match compatibility, statistical balance and
engine replacement?

Key Perplexity conclusion:

- The boundary needs versioned input, event-log, replay, RNG and capability
  contracts.
- Engine records must store `engineId`, `engineVersion`, `contractVersion`,
  `rngVersion`, seed, quality profile and replay/log version.
- Determinism needs explicit PRNG test vectors, no platform random/time calls,
  stable iteration order, fixed-point or explicit quantization/rounding, golden
  masters, cross-runtime parity and bulk statistical regression tests.
- Replacement needs capability negotiation, shadow runs, replay fallback policy,
  idempotent queue processing and observability keyed by engine version.

## Raw source links checked

- OpenFootball: <https://github.com/ZOXEXIVO/open-football>
- OpenFootManager: <https://github.com/openfootmanager/openfootmanager>
- Google Research Football: <https://github.com/google-research/football>
- RoboCup rcssserver: <https://github.com/rcsoccersim/rcssserver>
- Rapier: <https://rapier.rs/>
- Bevy: <https://bevy.org/>
- Planck.js: <https://github.com/piqnt/planck.js>
- Matter.js: <https://github.com/liabru/matter-js>
