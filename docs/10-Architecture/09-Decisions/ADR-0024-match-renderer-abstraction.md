---
title: ADR-0024 Match Renderer Abstraction
status: accepted
tags: [adr, architecture, ui, match-view]
created: 2026-05-19
updated: 2026-05-19
accepted_at: 2026-05-19
type: adr
binding: true
supersedes:
superseded_by:
related: [[ADR-0021-revised-tech-stack]], [[ADR-0022-animation-game-feel]], [[ADR-0003-match-engine]], [[ADR-0026-match-frame-contract]]
---

# ADR-0024: Match Renderer Abstraction

> **AMENDED 2026-05-19 by [[ADR-0026-match-frame-contract]] (wording clarified,
> decision unchanged).** The renderer abstraction + Canvas2D-first / PixiJS-
> later decision is unchanged. Wording correction: the engine emits a typed
> **event log**, never typed frame snapshots — `MatchFrame` is an ephemeral,
> derived, in-memory projection built per [[ADR-0026-match-frame-contract]]
> (reconciles this ADR with the determinism rule "no persisted snapshots").
> The renderer still only draws frames. The "typed frame-snapshot contract
> must be defined" follow-up below is **now defined** in ADR-0026.

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

Introduce a renderer-agnostic **`MatchRenderer` interface** that consumes
typed **`MatchFrame`** values (defined by [[ADR-0026-match-frame-contract]] —
ephemeral, derived projections of the engine's event log; never persisted).
Ship a **Canvas 2D** implementation first (hand-written loop, GSAP-tweened
state values, client-only React boundary). **PixiJS v8 (WebGL renderer)** is
the planned effects upgrade — a contained swap behind the interface, not a
rewrite.

The engine emits a typed event log (ADR-0003); the caller projects it into
`MatchFrame`s via the ADR-0026 builder; the renderer only draws frames; GSAP
tweens *state values*, not draw calls — so the Canvas→PixiJS switch replaces
one implementation.

## Rationale

22 dots + ball + highlights is far below where WebGL pays off; Canvas 2D is the
most reliable across the wide range of mobile GPUs a PWA hits and is
SSR-trivial. Domain type-safety is equal regardless of renderer (the scene
model is our own typed code); the interface is what de-risks the upgrade —
mirroring the project-wide "reversible bet behind an interface" posture.

## Consequences

Positive:

- Lively match view shipped fast with zero WebGL/WebGPU/SSR risk.
- PixiJS effects later cost a contained implementation swap, not a rewrite.

Negative:

- We own the Canvas render loop and hit-testing initially.
- The typed frame-snapshot contract is **defined** in
  [[ADR-0026-match-frame-contract]] (resolved follow-up).

## Supersedes

None.

## Related Docs

- [[ADR-0021-revised-tech-stack]] · [[ADR-0022-animation-game-feel]] · [[ADR-0003-match-engine]] · [[ADR-0026-match-frame-contract]]
