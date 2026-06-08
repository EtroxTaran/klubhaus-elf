---
title: ADR-0049 Swappable Spatial-Event Match Engine
status: superseded
tags: [adr, architecture, match-engine, runtime, rust, typescript, wasm, spatial-event, determinism]
created: 2026-05-27
updated: 2026-06-08
type: adr
binding: false
supersedes: ADR-0003-match-engine
superseded_by: ADR-0096-match-engine-cross-runtime-determinism-numeric-surface
related:
  - [[../../60-Research/swappable-spatial-event-match-engine-2026-05-27]]
  - [[../../60-Research/match-engine-runtime-strategy]]
  - [[../../60-Research/match-engine-simulation-model]]
  - [[../../60-Research/determinism-and-replay]]
  - [[../../50-Game-Design/match-engine]]
  - [[../../50-Game-Design/GD-0002-match-engine]]
  - [[ADR-0011-server-authoritative-multiplayer]]
  - [[ADR-0020-hybrid-online-mvp-offline-ready]]
  - [[ADR-0023-realtime-transport]]
  - [[ADR-0024-match-renderer-abstraction]]
  - [[ADR-0026-match-frame-contract]]
  - [[ADR-0030-llm-out-of-authoritative-state]]
---

# ADR-0049: Swappable Spatial-Event Match Engine

## Status

draft

> Draft only. This ADR records Nico's current target direction after the
> 2026-05-27 re-evaluation. It replaces ADR-0003 as the proposed match-engine
> planning target, but it still needs formal ratification before implementation.

## Date

2026-05-27

## Context

The original match-engine direction assumed a deterministic TypeScript engine
shared by browser worker and server worker. The project has since been reset to
docs-only and all decisions are reopened. Nico explicitly raised the match
engine as the component most likely to create later scaling, realism and
replacement problems.

The engine must support:

- server-authoritative canonical match results;
- credible 2D Canvas display;
- live ticker and replay from the same committed facts;
- tactical influence and visible star-player impact;
- future runtime replacement without touching UI, persistence, realtime or LLM
  consumers;
- optional future local/offline and browser replay paths without making MVP
  local-authoritative.

## Decision

FMX will plan the match engine as a **swappable spatial-event engine** behind a
versioned port.

1. The target model is spatial-event: event decisions are driven by normalized
   pitch state, pressure, roles, tactics, attributes, xG/EPV and deterministic
   RNG.
2. The first authoritative runtime is decided by a short contract-identical
   spike. Runtime stance is **Spike, Rust-default**:
   - implement the same minimal contract slice in TypeScript and Rust native;
   - compare determinism, event/spatial output, modelling ergonomics,
     observability and p95 runtime;
   - choose Rust native as first authoritative production runtime unless the
     spike shows clear disadvantages.
3. TypeScript may be a reference/prototype adapter. It is not the default
   authoritative production commitment.
4. Rust/WASM is a future browser replay/sandbox option, not the default server
   authority path.
5. Open-source engines may be studied or used in spikes only. No OSS code is
   adopted without a separate license/code-audit ADR.

## Engine Boundary

All consumers call a port; no consumer imports concrete engine internals.

Required contracts:

- `MatchEnginePort`
  - `simulate(request): MatchResult`
  - `simulateStreaming(request): MatchEventStream`
  - `describeCapabilities(): EngineCapabilities`
- `MatchInput`
  - frozen teams, roles, tactics, set pieces, rules, context, seed, quality
    profile, dataset/rules versions and intervention schedule;
- `MatchEventLog`
  - append-only canonical events for result, stats, replay, ticker and audit;
- `SpatialSample`
  - normalized pitch coordinates, ball/player positions, phase, pressure,
    compactness, line height, zone control and active event reference;
- `MatchSummary`
  - result, goals, xG, shots, cards, injuries, substitutions, fatigue deltas,
    ratings and downstream domain effects;
- `EngineCapabilities`
  - supported contract/input/log/replay/RNG versions, quality profiles, spatial
    density, live intervention support and deterministic guarantees;
- `ReplayRecord`
  - immutable package containing `engineId`, `engineVersion`,
    `contractVersion`, `rngVersion`, seed, quality profile, input hash and
    event/log metadata.

## Spatial-Event Semantics

The engine must make 2D representation possible without making the renderer
authoritative.

- Outcome-first generation may be used only for low-importance background-fast
  paths and must remain distribution-compatible with richer profiles.
- Human-relevant matches produce event logs and spatial samples that explain
  why the 2D view and ticker say what they say.
- Star players must influence both action choice and action outcome, not merely
  hidden rating modifiers.
- Tactical changes are intervention events and affect only future phases from
  deterministic intervention points.

## Runtime Spike Gate

The spike is deliberately small. It is not two full engines.

Fixtures:

- equal teams;
- star attacker vs average defender;
- high press vs low block;
- red card / injury / substitution;
- big chance / high-xG shot.

Exit criteria:

- same `MatchInput` schema;
- same RNG test vectors;
- same event-log and spatial-sample schema;
- reproducible output for golden fixtures;
- benchmarked p50/p95 simulation time and output size;
- debugging and observability notes;
- recommendation recorded in a follow-up ADR update before implementation.

Default after the spike: Rust native becomes authoritative unless TypeScript
clearly wins on implementation risk without sacrificing determinism or scaling
headroom.

## Determinism and Replacement Rules

- Randomness comes only from a documented PRNG interface with versioned test
  vectors.
- The engine uses fixed-point or explicitly quantized numeric surfaces where
  cross-runtime equality matters.
- Engine records store all versions needed to replay or explain a match.
- Golden-master tests protect exact compatibility where promised.
- Statistical regression tests protect balance where exact event equality is
  intentionally versioned.
- Replacing an authoritative engine requires shadow runs, compatibility
  reporting and a rollback/fallback policy for historical replays.

## Offline and Realtime Boundaries

- MVP canonical matches are server-authoritative.
- Local engine runs are non-binding previews unless a later ADR/GDDR explicitly
  approves selective offline authority.
- Offline manager-week is preserved by command-first APIs and future Dexie
  command outbox, not by making match results local-authoritative.
- Realtime streams publish committed event/log/spatial packets with replay
  cursors. SSE remains the MVP transport; Centrifugo is the scale path when
  presence, bidirectional coordination or stream history requires it.

## LLM Boundary

LLM commentary consumes committed events only.

- LLM code is outside the match engine.
- OpenRouter experiments go through the ADR-0030 adapter boundary.
- Key-event commentary may replace a display line after validation, but it never
  changes simulation, stats, replay or downstream domain state.

## Consequences

Positive:

- Match engine can be replaced without rewriting UI, persistence, realtime,
  replay or LLM consumers.
- Rust-native authority remains open from the start instead of being a costly
  late migration.
- 2D Canvas and ticker stay grounded in the same committed match facts.
- Scaling decisions can be benchmark-based, not assumption-based.

Negative:

- Requires contract work before gameplay implementation.
- Requires a spike before coding the full engine.
- Adds cross-runtime determinism and versioning discipline early.
- Rust-first remains more complex than a pure TypeScript-only MVP if the spike
  confirms Rust.

## Verification Requirements

- Contract tests for every engine implementation.
- PRNG vector tests across TypeScript, Rust native and any future WASM build.
- Golden fixtures for deterministic replay.
- Statistical envelopes for goals, xG, shots, cards, injuries, pass completion,
  pressing wins and star-player involvement.
- Spatial sanity tests for coordinates, speed, event ordering and 2D frame
  derivation.
- Static architecture check: no concrete engine imports outside the engine
  adapter/service boundary.
- Observability by `engineId` and `engineVersion`: p50/p95 simulation time,
  queue wait, memory, event count, spatial sample size, replay size and errors.

## Supersedes

- [[ADR-0003-match-engine]] as the proposed match-engine planning target.

## Related Docs

- [[../../60-Research/swappable-spatial-event-match-engine-2026-05-27]]
- [[../../50-Game-Design/match-engine]]
- [[../../60-Research/determinism-and-replay]]
- [[ADR-0020-hybrid-online-mvp-offline-ready]]
- [[ADR-0030-llm-out-of-authoritative-state]]
