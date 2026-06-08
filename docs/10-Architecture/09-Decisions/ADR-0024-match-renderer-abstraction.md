---
title: ADR-0024 Match Renderer Abstraction
status: accepted
tags: [adr, architecture, ui, match-view]
created: 2026-05-19
updated: 2026-06-08
accepted_at: 2026-05-19
type: adr
binding: true
supersedes:
superseded_by:
related: [[ADR-0021-revised-tech-stack]], [[ADR-0022-animation-game-feel]], [[ADR-0003-match-engine]], [[ADR-0026-match-frame-contract]], [[ADR-0041-presentation-renderer-strategy]], [[ADR-0072-in-match-control-seam]]
---

# ADR-0024: Match Renderer Abstraction

> **CONTROL SEAM clarified 2026-06-03 by [[ADR-0072-in-match-control-seam]] (FMX-100;
> decision unchanged).** This ADR defines the *draw* seam (engine event log →
> `MatchFrame` → renderer). The *control* seam — how player interventions reach the
> deterministic engine, and that the Canvas-2D renderer runs on the **main thread**
> at MVP (sim stays in its dedicated worker; OffscreenCanvas render-worker is a
> profiled v2) — is specified in ADR-0072. The renderer abstraction and Canvas-2D
> choice here are unchanged.

> **AMENDED 2026-05-22 by [[ADR-0041-presentation-renderer-strategy]].** The
> renderer abstraction and Canvas 2D-first decision remain binding. PixiJS is no
> longer a planned effects upgrade; any future 2D renderer change requires a new
> ADR with measured Canvas 2D failure and device/bundle evidence.

> **AMENDED 2026-05-19 by [[ADR-0026-match-frame-contract]] (wording clarified,
> decision unchanged).** The engine emits a typed **event log**, never typed
> frame snapshots. `MatchFrame` is an ephemeral, derived, in-memory projection
> built per [[ADR-0026-match-frame-contract]] and reconciles this ADR with the
> determinism rule "no persisted snapshots". The renderer still only draws
> frames. The "typed frame-snapshot contract must be defined" follow-up below is
> now defined in ADR-0026.

## Status

accepted

## Date

2026-05-19

## Context

The 2D match view (top-down pitch, ~22 moving dots + ball, event highlights, xG
strips) must feel alive and hit 60 fps on mobile, but visual ambition may grow
later (particles, lighting, trails, crowd). The team wants effects eventually
but "should not die trying in the beginning".

## Options Considered

- Plain Canvas 2D (mobile-reliable, tiny, no WebGL/SSR pitfalls; manual loop).
- react-konva (declarative React scene graph; modest overhead).
- PixiJS v8 / WebGL (future-proof for heavy FX; setup + WebGL/SSR caveats).

## Decision

Introduce a renderer-agnostic **`MatchRenderer` interface** that consumes typed
**`MatchFrame`** values (defined by [[ADR-0026-match-frame-contract]]:
ephemeral, derived projections of the engine's event log; never persisted).
Ship a **Canvas 2D** implementation first (hand-written loop, GSAP-tweened
state values, client-only React boundary). A future 2D renderer swap is possible
behind the interface, but **PixiJS is not planned** after
[[ADR-0041-presentation-renderer-strategy]].

The engine emits a typed event log (ADR-0003); the caller projects it into
`MatchFrame`s via the ADR-0026 builder; the renderer only draws frames; GSAP
tweens *state values*, not draw calls. If a future ADR accepts a renderer swap,
only the renderer implementation changes.

## Rationale

22 dots + ball + highlights is far below where WebGL pays off; Canvas 2D is the
most reliable across the wide range of mobile GPUs a PWA hits and is
SSR-trivial. Domain type-safety is equal regardless of renderer because the
scene model is our own typed code. The interface de-risks future changes without
reserving PixiJS as a default migration.

## Consequences

Positive:

- Lively match view shipped fast with zero WebGL/WebGPU/SSR risk.
- A future renderer swap would be contained if measured Canvas 2D limits justify
  it.

Negative:

- We own the Canvas render loop and hit-testing initially.
- The typed frame-snapshot contract is defined in
  [[ADR-0026-match-frame-contract]] (resolved follow-up).

## Supersedes

None.

## Related Docs

- [[ADR-0021-revised-tech-stack]]
- [[ADR-0022-animation-game-feel]]
- [[ADR-0003-match-engine]]
- [[ADR-0026-match-frame-contract]]
- [[ADR-0041-presentation-renderer-strategy]]
