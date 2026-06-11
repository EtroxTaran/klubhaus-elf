---
title: "ADR-0047: Babylon.js as the 3D / Isometric Presentation Engine"
status: accepted
tags: [adr, presentation, 3d, babylon, isometric, stadium, pwa]
created: 2026-05-27
updated: 2026-06-11
type: adr
binding: false
supersedes:
superseded_by:
amends: [[ADR-0029-3d-presentation-layer]], [[ADR-0041-presentation-renderer-strategy]]
related: [[ADR-0029-3d-presentation-layer]], [[ADR-0041-presentation-renderer-strategy]], [[ADR-0024-match-renderer-abstraction]], [[ADR-0026-match-frame-contract]], [[../bounded-context-map]], [[../../30-Implementation/3d-presentation-architecture]], [[../../60-Research/presentation-renderer-strategy]], [[../../00-Index/Decision-Log]]
---

# ADR-0047: Babylon.js as the 3D / Isometric Presentation Engine

## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `draft`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

> **History (pre-ratification banner, demoted 2026-06-11 per ADR-0092 / FMX-143):**
> **Amends [[ADR-0029-3d-presentation-layer]] §2 (framework choice) and
> [[ADR-0041-presentation-renderer-strategy]] (decision + guardrail).** It replaces
> **Three.js / React Three Fiber** with **Babylon.js** as the optional 3D/2.5D
> presentation engine. The `SceneDescriptor` / `SceneRenderer` / `CapabilityGate`
> contract, the 2D fallback, the iOS context-loss handling and the performance
> budgets are **unchanged** — only the engine implementation behind the seam changes.
> **Live match render stays Canvas 2D** (ADR-0024/0026, untouched).

## Date

2026-05-27

## Context

The current draft ADRs select Three.js/R3F as the only planned optional 3D stack and
explicitly bar Babylon.js "without a superseding ADR with measured evidence"
([[ADR-0041-presentation-renderer-strategy]] §Guardrails). Research surfaced
**isometric and 3D views** (iso stadium/campus, cutscenes, backdrops) as desired
post-MVP presentation. Nico evaluated the options in his own tests and **decided on
Babylon.js**. This ADR records that decision and satisfies ADR-0041's superseding-ADR
requirement. (Phase is research/architecture; no app exists yet — this is a recorded
decision, not an implementation.)

## Options Considered

- **Three.js + React Three Fiber** — prior choice (smallest bundle, native React
  bindings, demand-driven rendering).
- **Babylon.js** — full-featured web 3D engine (scene graph, animation, particles,
  built-in context-loss handling); stronger for richer iso/cutscene scenes.
- **PlayCanvas / PixiJS** — not adopted (engine-switch risk / 2D only).

## Decision

Adopt **Babylon.js** as the single optional **3D / isometric presentation engine**
(iso stadium/campus, cutscenes, backdrops), implemented as the `SceneRenderer` behind
the **unchanged** `SceneDescriptor` + `CapabilityGate` contract
([[../../30-Implementation/3d-presentation-architecture]]). Three.js/R3F is no longer
planned. **Canvas 2D remains the match renderer** (ADR-0024/0026). All ADR-0029/0041
boundaries stay: presentation-only (no domain authority/RNG), versioned descriptors
from authoritative read-models/event-logs, mandatory 2D/still fallback, no 3D on
Floor-tier, perf-verified on Standard-tier mobile.

## Rationale

The renderer abstraction was deliberately engine-agnostic, so swapping R3F → Babylon
only touches the renderer implementation, not domain or descriptor code. Babylon's
engine-grade scene/animation/particle tooling and first-class context-loss handling
fit the iso-stadium + cutscene ambition; Nico's tests confirmed the fit. As the chosen
single 3D stack it does not reintroduce a multi-engine portfolio.

## Consequences

Positive:

- One optional 3D engine (Babylon), match render unchanged (Canvas 2D).
- Engine-grade iso/cutscene capability; robust WebGL context-loss recovery.
- Contract/fallback/budgets reused unchanged — low blast radius.

Negative:

- Babylon's bundle is larger than R3F's → strict lazy-load + Floor-tier 2D fallback
  matter more; verify against [[../../60-Research/performance-budgets]].
- No native React bindings like R3F → a thin mount/adapter is needed (still client-only, lazy).
- ADR-0029/0041 prose must be read together with this amendment.

## Supersedes

None (full). Amends ADR-0029 §2 and ADR-0041 (engine choice + guardrail).

## Related Docs

- [[ADR-0029-3d-presentation-layer]] · [[ADR-0041-presentation-renderer-strategy]] · [[ADR-0024-match-renderer-abstraction]]
- [[../../30-Implementation/3d-presentation-architecture]] · [[../../60-Research/presentation-renderer-strategy]] · [[../bounded-context-map]]
