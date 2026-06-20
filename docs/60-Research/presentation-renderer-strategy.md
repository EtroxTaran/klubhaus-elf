---
title: Presentation Renderer Strategy - Canvas 2D plus Babylon.js
status: current
binding: true
tags: [research, rendering, pwa, 3d, stadium, presentation, babylon, fmx-158]
context: match
created: 2026-05-22
updated: 2026-06-15
type: research
related: [[../10-Architecture/09-Decisions/ADR-0041-presentation-renderer-strategy]], [[performance-budgets]], [[../10-Architecture/09-Decisions/ADR-0024-match-renderer-abstraction]], [[../10-Architecture/09-Decisions/ADR-0026-match-frame-contract]], [[../50-Game-Design/match-engine]], [[../50-Game-Design/stadium-and-campus]], [[systemic-events-player-development-venue-ops]]
---

# Presentation Renderer Strategy - Canvas 2D plus Babylon.js

> **2026-05-27 — engine updated by [[../10-Architecture/09-Decisions/ADR-0047-babylon-3d-presentation-engine]].**
> The optional 3D/2.5D engine is now **Babylon.js** (not Three.js/R3F). This note's
> reasoning about the *seam* (descriptor-driven, fallback-safe, presentation-only, one
> optional 3D stack) stands; only the engine name changes. Match render stays Canvas 2D.

This note promotes the attached May 2026 renderer report and the follow-up
architecture review into durable vault memory. It does **not** re-open the MVP
match-renderer decision. The MVP remains Text & Stats plus Canvas 2D.

The corrected decision is intentionally narrower than the initial report:
planning PixiJS, Three.js/R3F, Babylon.js and PlayCanvas in parallel would make
later engine switches more likely, not less.

Temporal reading rule: older accepted notes that mention PixiJS as a planned
upgrade are superseded on that point by
[[../10-Architecture/09-Decisions/ADR-0041-presentation-renderer-strategy]].
Superseded research notes may still mention broader candidate sets as history;
they are not implementation guidance.

## 1. Goal

The goal is to keep the football manager credible as a PWA while leaving one
clear path to richer presentation:

- ship the first playable with Canvas 2D match presentation and data-rich UI;
- make stadium, campus and venue operations visually readable through
  isometric/2.5D board views before any full 3D ambition;
- allow later curated 3D scenes for stadium inspection, walk-in scenes, trophy
  presentations, celebrations or short highlight moments;
- avoid planned renderer churn by having one 2D path and one optional 3D path.

The product should not generate AI videos for these moments. If richer scenes
are built, they should be deterministic, authored and replayable from structured
scene data.

## 2. Existing constraints to preserve

- [[../50-Game-Design/match-engine]] stays event-based and deterministic.
- [[../10-Architecture/09-Decisions/ADR-0024-match-renderer-abstraction]]
  keeps the match renderer Canvas 2D first.
- [[performance-budgets]] keeps the MVP device matrix, bundle budgets, memory
  budgets and Floor-tier Text & Stats policy.
- [[../50-Game-Design/stadium-and-campus]] owns the venue gameplay: capacity,
  seat mix, experience quality, commercial modules and campus process quality.
- Rendering must not leak hidden simulation data, create local multiplayer
  advantages, or change deterministic match outcomes.

## 3. Scope boundary

| In scope | Out of scope |
|---|---|
| Text & Stats plus Canvas 2D match view | Full 3D match engine in the browser |
| Canvas/SVG/DOM data overlays | Frame-by-frame physics simulation |
| Optional Babylon.js stadium/campus viewer | AI-generated video pipeline |
| Curated non-interactive scenes: walk-in, trophy, celebration, selected highlight beat | Authoritative computation inside the renderer |
| Scene contracts derived from committed event logs and venue read models | Required 3D on Floor tier |

The practical wording is: **no interactive or authoritative 3D match view**.
Curated 3D presentation scenes may exist later if they are lazy-loaded,
fallback-safe and derived from already-authoritative data.

## 4. Technology decision

### 4.1 Canvas 2D - mandatory 2D path

Canvas 2D remains the match-view and UI-adjacent 2D renderer.

Good for:

- Top-down pitch with 22 players, ball, event markers, trails and overlays.
- Deterministic replay from `MatchFrame` values.
- Mobile reliability, SSR simplicity and small first-install footprint.
- Stadium/campus board prototypes where the product need is data readability,
  not free-camera 3D.

Limits:

- We own the render loop, hit-testing conventions and effect discipline.
- Heavy particle systems or shader-like effects are not the target.
- If measured Canvas performance fails, the team must write a new ADR instead
  of quietly adopting a GPU 2D library.

Decision: Canvas 2D is enough until proven otherwise by performance data.

### 4.2 Babylon.js - only planned optional 3D path

Babylon.js is the only planned optional stack for PWA-native 2.5D/3D scenes.

Good for:

- Isometric or simple 3D cameras for stadium/campus views.
- Small curated scenes with glTF assets: stadium inspection, trophy lift,
  tunnel/walk-in, short authored highlight beat.
- Engine-grade scene, animation, material, particle and context-loss tooling
  behind a thin lazy client adapter.
- Explicit render-loop scheduling so resting scenes do not continuously render.
- Lazy client-only mounting behind `PresentationSceneRenderer`.

Limits:

- Babylon's package footprint is larger than the previous Three/R3F option, so
  modular imports, lazy chunks and Floor-tier fallback matter more.
- It has no native React binding in the accepted stack, so the app needs a thin
  lifecycle adapter rather than a component-level 3D DSL.
- Scene orchestration, asset rules, animation conventions, LOD and perf
  discipline are project responsibilities.
- WebGPU is a later capability gate, not a required runtime.
- Complex character animation pipelines, crowds and cinematic tooling require a
  separate feature spec before adoption.

Decision: If we later need 3D, start with Babylon.js behind the
`PresentationSceneRenderer` seam and make it succeed before considering an
engine switch.

## 5. Rejected planned paths

| Technology | Decision | Reason |
|---|---|---|
| PixiJS | Not planned | Adds another scene graph and WebGL/WebGPU-backed renderer mainly for 2D effects. With Canvas 2D plus Babylon.js, this duplicates GPU/runtime complexity without a current product need. |
| Three.js/R3F | Not planned | Prior optional 3D choice, superseded by ADR-0047. Reconsider only if an accepted feature cannot be built responsibly with Babylon.js and a future ADR accepts the switch. |
| PlayCanvas | Not planned | Full web game engine/editor ecosystem. Valuable for editor-first teams, but currently too likely to become a second frontend runtime. |

PixiJS is only a future contingency if **all** of the following are true:

- Canvas 2D misses measured Standard-tier performance or effect requirements.
- The required surface is still purely 2D.
- Babylon.js would be inappropriate because the feature does not need 3D.
- A new ADR accepts the added dependency, testing matrix and fallback policy.

## 6. Use-case fit

| Use case | Preferred route | Rationale |
|---|---|---|
| MVP match view | Canvas 2D via [[../10-Architecture/09-Decisions/ADR-0024-match-renderer-abstraction]] | Lowest risk, mobile reliable, already locked |
| 2D match effects | Canvas 2D first; reduce or simplify effects before adding a renderer | Avoids PixiJS as a speculative planned migration |
| Stadium/campus build-out board | DOM/SVG/Canvas first; Babylon.js only if real 3D assets are required | Building slots, upgrades and overlays matter more than free camera |
| Infrastructure overlays | DOM/SVG/Canvas over venue read models | KPI layers, queues, sponsor activation and heatmaps are data UI first |
| Stadium inspection / campus viewer | Babylon.js | Optional, lazy-loaded, presentation-only |
| Walk-in / trophy / celebration scene | Babylon.js | Small authored scene, no gameplay authority |
| Match highlight beat | 2D event replay first; optional curated Babylon.js scene later | Only from committed event logs; never a realtime 3D match engine |
| Non-developer scene authoring | New ADR required | Do not reserve PlayCanvas without a concrete pipeline decision |

## 7. Renderer contract direction

The future renderer boundary should be a separate presentation contract, not an
extension of the match engine:

```ts
type PresentationSceneKind =
  | 'stadium-campus'
  | 'venue-overlay'
  | 'match-highlight'
  | 'walk-in'
  | 'trophy'
  | 'celebration'

interface PresentationSceneDescriptor {
  kind: PresentationSceneKind
  sceneVersion: string
  source: 'venue-read-model' | 'match-event-log' | 'career-event'
  devicePolicy: 'premium-only' | 'standard-plus' | 'all-with-fallback'
  deterministicSeed: string
  assets: ReadonlyArray<SceneAssetRef>
  payload: unknown
}
```

Contract rules:

- Inputs are read models, committed event logs or career facts.
- The renderer returns no domain decisions.
- All scene descriptors are versioned and deterministic.
- The scene has a fallback descriptor for static image, 2D animation, Canvas or
  text summary.
- Scene chunks and assets are lazy-loaded and excluded from first-install
  budgets unless a later ADR explicitly changes that.

## 8. Performance and device gates

Any 3D/2.5D renderer must add budgets on top of [[performance-budgets]]:

| Gate | Requirement |
|---|---|
| Route loading | 3D renderer chunks lazy-loaded only; no initial app-shell impact |
| Floor tier | Text/still/2D fallback only; no required WebGL/WebGPU scene |
| Standard tier | 30 fps target for simple scenes; no route depends on 60 fps |
| Premium tier | 60 fps allowed for small scenes, still with thermal/battery fallback |
| Context loss | `webglcontextlost` / restore handling and safe fallback required |
| GPU memory | Texture compression, LOD, eager disposal and DPR clamps required |
| Data saver | Skip optional 3D scenes and use still/2D fallback |
| Reduced motion | Disable camera fly-throughs and autoplay celebration movement |
| Offline | Scene descriptor and required assets must be cache-versioned or the route falls back |

## 9. Recommendation

Adopt a **two-renderer strategy**:

1. Keep MVP match presentation on Text & Stats plus Canvas 2D.
2. Do not plan PixiJS as a normal upgrade path.
3. Use **Babylon.js** as the only planned optional PWA-native
   3D/2.5D stack.
4. Treat Three.js/R3F and PlayCanvas as rejected/reserved paths that require a
   future ADR and measured need.
5. Keep all rendering non-authoritative and behind data-first scene contracts.

This gives the game a credible path to richer moments without moving the core
product into browser-heavy 3D development or planning several renderer
migrations in advance.

## 10. Decision triggers

| Trigger | Action |
|---|---|
| First stadium/campus prototype is readable with 2D/isometric assets | Stay on DOM/SVG/Canvas; do not introduce Babylon.js |
| First stadium/campus prototype needs real 3D assets | Build a Babylon.js spike behind `PresentationSceneRenderer` |
| Canvas match view misses measured Standard-tier budget | Optimize Canvas first; if still insufficient, open a new ADR for a 2D renderer change |
| A curated 3D highlight is requested for player-facing roadmap | Add a GDDR/feature spec first; keep it post-MVP and non-authoritative |
| Browser renderer exceeds Standard-tier budgets | Fall back to 2D/still presentation; do not raise the baseline device tier |
| Babylon.js cannot meet an accepted feature after a spike | Future ADR may evaluate Three.js/R3F or PlayCanvas with measured evidence |

## 11. Sources

- Attached local renderer report, May 2026.
- [MDN CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D):
  Canvas 2D is widely available and provides drawing APIs for shapes, text,
  images and other 2D objects.
- [MDN WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices):
  WebGL requires explicit memory, context-loss, texture and draw-call
  discipline.
- [PixiJS rendering docs](https://pixijs.download/dev/docs/rendering.html):
  PixiJS renders through WebGL/WebGL2, WebGPU or Canvas; WebGL is the stable
  production recommendation, WebGPU and Canvas are not the baseline.
- [Three.js WebGLRenderer docs](https://threejs.org/docs/pages/WebGLRenderer.html):
  `WebGLRenderer` uses WebGL 2 and is the practical compatibility baseline for
  Three.js scenes.
- [React Three Fiber scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance):
  on-demand rendering via `frameloop="demand"` avoids continuous 60 fps
  rendering for resting scenes.
- [Babylon.js specifications](https://www.babylonjs.com/specifications/):
  Babylon.js offers transparent WebGL/WebGPU support and a complete scene graph,
  which makes it an engine-level choice rather than a small renderer swap.
- [[babylon-vs-three-floor-tier-budget-2026-06-15]] and
  [[raw-perplexity/raw-babylon-renderer-stack-source-checks-2026-06-15]] update
  the renderer-stack source checks after ADR-0047's Babylon amendment.
- [PlayCanvas engine README](https://github.com/playcanvas/engine):
  PlayCanvas is a full web game engine with WebGL2/WebGPU graphics, animation,
  physics, sound, input and asset streaming.

## Related

- [[../10-Architecture/09-Decisions/ADR-0041-presentation-renderer-strategy]]
- [[performance-budgets]]
- [[../10-Architecture/09-Decisions/ADR-0024-match-renderer-abstraction]]
- [[../10-Architecture/09-Decisions/ADR-0026-match-frame-contract]]
- [[../50-Game-Design/match-engine]]
- [[../50-Game-Design/stadium-and-campus]]
- [[systemic-events-player-development-venue-ops]]
