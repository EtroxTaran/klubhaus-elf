---
title: ADR-0041 Two-Renderer Presentation Strategy
status: draft
tags: [adr, architecture, rendering, pwa, 3d, stadium]
created: 2026-05-22
updated: 2026-06-03
accepted_at: 2026-05-22
type: adr
binding: true
supersedes:
superseded_by:
amended_by: [[ADR-0047-babylon-3d-presentation-engine]]
amends: [[ADR-0024-match-renderer-abstraction]], [[ADR-0029-3d-presentation-layer]]
related: [[ADR-0024-match-renderer-abstraction]], [[ADR-0026-match-frame-contract]], [[ADR-0029-3d-presentation-layer]], [[ADR-0025-mobile-delivery]], [[ADR-0019-modular-monolith-ddd]], [[ADR-0072-in-match-control-seam]], [[../../60-Research/presentation-renderer-strategy]], [[../../60-Research/performance-budgets]], [[../../50-Game-Design/match-engine]], [[../../50-Game-Design/stadium-and-campus]]
---

# ADR-0041: Two-Renderer Presentation Strategy

> **CONTROL SEAM noted 2026-06-03 by [[ADR-0072-in-match-control-seam]] (FMX-100;
> decision unchanged).** ADR-0072 specifies the in-match control seam and the MVP
> main-thread Canvas-2D render decision + perf-validation protocol. The
> two-renderer principle and Canvas-2D-only match render here are unchanged; no
> non-Canvas-2D match renderer is introduced.

> **AMENDED 2026-05-27 by [[ADR-0047-babylon-3d-presentation-engine]].** The optional
> 3D engine is now **Babylon.js** (replaces Three.js/R3F in the Decision below); the
> "no Babylon without a superseding ADR" guardrail is satisfied by ADR-0047. The
> two-renderer principle and Canvas-2D match render are unchanged.

## Status

accepted

## Date

2026-05-22

## Temporal Lineage

- **2026-05-19:** [[ADR-0024-match-renderer-abstraction]] accepted Canvas 2D
  first and originally kept PixiJS as a later effects upgrade.
- **2026-05-19:** [[ADR-0026-match-frame-contract]] pinned the deterministic
  engine-renderer seam and did not change the renderer choice.
- **2026-05-20:** [[ADR-0029-3d-presentation-layer]] accepted the post-MVP
  Three.js/R3F 3D Presentation Layer, while still carrying ADR-0024's planned
  PixiJS effects-upgrade wording for the match renderer.
- **2026-05-22:** This ADR accepts the presentation-layer strategy and amends
  the earlier PixiJS path and ADR-0029's fallback wording: Canvas 2D remains the
  match renderer; PixiJS is not a planned migration; Three.js/R3F is the only
  planned optional 3D/2.5D stack.

## Context

The project has a binding 2D-first match strategy: Text & Stats plus Canvas 2D
at MVP ([[ADR-0024-match-renderer-abstraction]],
[[ADR-0026-match-frame-contract]]). The attached May 2026 report asks whether
Three.js or another renderer should already be considered for future stadium,
infrastructure, celebration and highlight presentation.

Follow-up architecture review rejected a roadmap that keeps PixiJS, Three.js,
Babylon.js and PlayCanvas as parallel planned renderer options. Avoiding later
engine switches is more important than keeping every plausible rendering
technology open.

There is a real boundary to preserve: a browser PWA must stay performant,
offline-ready and deterministic. A 3D renderer must not become a match engine,
domain service or multiplayer authority.

## Decision

Adopt a **two-renderer presentation strategy**:

- The MVP and default match presentation remain **Text & Stats plus Canvas 2D**.
- There is no interactive or authoritative browser 3D match view.
- **PixiJS is no longer a planned match-view upgrade.** It may be reconsidered
  only by a new ADR if measured Canvas 2D performance fails and the required
  surface is still purely 2D.
- A later optional `PresentationSceneRenderer` may render non-authoritative
  2.5D/3D scenes for stadium/campus, infrastructure overlays, walk-in scenes,
  trophy presentations, celebrations and curated highlight beats.
- Scene inputs must be versioned descriptors derived from already-authoritative
  read models, committed match event logs or career facts.
- The renderer returns no domain decisions and must have a 2D/still/text fallback.
- **Three.js + React Three Fiber** is the only planned optional PWA-native
  3D/2.5D stack.
- **Babylon.js and PlayCanvas are not planned fallback engines.** Evaluating
  either requires a superseding ADR with measured Three/R3F failure, bundle and
  device data, and a feature spec that cannot be met with the chosen stack.

## Rationale

Canvas 2D is enough for the planned match surface: 22 players, ball, trails,
event markers, overlays and deterministic frame playback. It is the lowest-risk
browser primitive and avoids adding a WebGL/WebGPU dependency to the MVP match
view.

PixiJS would mainly buy a GPU-accelerated 2D scene graph. Its own renderer docs
position WebGL/WebGL2 as the stable production backend, WebGPU as still maturing
and Canvas as experimental. If Three/R3F is already the selected optional 3D
path, PixiJS adds a second GPU runtime for 2D effects and a third rendering
model beside DOM/Canvas and Three. That increases testing, context-loss, bundle
and ownership cost without removing a known product risk.

Three.js + React Three Fiber fits the current React/TanStack frontend best and
can be mounted as a lazy client-only adapter. React Three Fiber's demand-driven
rendering model is a good fit for mostly static management scenes such as a
stadium/campus board. Three.js WebGLRenderer is the compatibility baseline;
WebGPU is a later capability gate, not a baseline.

Babylon.js and PlayCanvas are valid web 3D engines, but planning them as
fallbacks would create the engine-switch risk this ADR is meant to avoid.
Babylon is more engine-like; PlayCanvas is a full web game engine/editor
ecosystem. Neither should be a roadmap item unless Three/R3F is proven
insufficient for a concrete accepted feature.

## Consequences

Positive:

- The roadmap has one 2D renderer and one optional 3D stack, not a portfolio of
  engines.
- Future 3D/2.5D ambition is documented without weakening the MVP.
- Stadium/campus presentation can grow from 2D/isometric to true 3D without
  changing venue gameplay.
- Curated highlight or ceremony scenes can reuse committed event/career facts
  and remain deterministic.
- PixiJS/Babylon/PlayCanvas churn is avoided unless a future ADR proves a real
  need.

Negative:

- Any 3D module adds WebGL/WebGPU, asset-pipeline and device-matrix complexity.
- Browser context loss, GPU memory and WebView performance must be handled
  explicitly.
- Canvas 2D effects remain hand-owned until metrics prove the match view needs a
  different 2D renderer.
- Engine-like cinematic tooling is deliberately deferred rather than kept as a
  parallel plan.

## Guardrails

- No 3D renderer in the initial app shell.
- No 3D requirement on Floor-tier devices.
- No more than two planned renderer technologies: Canvas 2D for match/UI-adjacent
  2D, Three.js/R3F for optional 3D/2.5D scenes.
- No PixiJS, Babylon.js or PlayCanvas dependency without a superseding ADR.
- No hidden or uncommitted match data in scene descriptors.
- No renderer-side randomness that affects domain state.
- No gameplay buffs from visual fidelity; 3D is presentation only.
- All 3D/cinematic work requires a feature spec, story/fallback states and
  perf verification on Standard-tier mobile targets.

## Related Docs

- [[../../60-Research/presentation-renderer-strategy]]
- [[ADR-0024-match-renderer-abstraction]]
- [[ADR-0026-match-frame-contract]]
- [[ADR-0025-mobile-delivery]]
- [[ADR-0019-modular-monolith-ddd]]
- [[../../60-Research/performance-budgets]]
- [[../../50-Game-Design/match-engine]]
- [[../../50-Game-Design/stadium-and-campus]]
