---
title: ADR-0029 3D Presentation Layer (Stadium, Cutscenes, Backdrop)
status: accepted
tags: [adr, presentation, 3d, three-js, r3f, stadium, cutscene, pwa, mobile]
created: 2026-05-20
updated: 2026-05-22
accepted_at: 2026-05-20
type: adr
binding: true
supersedes:
amends: []
amended_by: [[ADR-0041-presentation-renderer-strategy]]
related: [[../../60-Research/performance-budgets]], [[../../20-Features/feature-stadium-builder]], [[../../20-Features/feature-3d-presentation-layer]], [[../../30-Implementation/3d-presentation-architecture]], [[ADR-0008-mobile-first-ui]], [[ADR-0010-design-system]], [[ADR-0017-observability-logging]], [[ADR-0019-modular-monolith-ddd]], [[ADR-0020-hybrid-online-mvp-offline-ready]], [[ADR-0021-revised-tech-stack]], [[ADR-0022-animation-game-feel]], [[ADR-0024-match-renderer-abstraction]], [[ADR-0026-match-frame-contract]], [[ADR-0041-presentation-renderer-strategy]], [[../08-Crosscutting]], [[../bounded-context-map]]
---

# ADR-0029: 3D Presentation Layer (Stadium, Cutscenes, Backdrop)

## Status

Accepted (2026-05-20). Precises — does **not** supersede — the locked
2026-05-17 "no 3D ever" decision recorded in
[[../../60-Research/performance-budgets]] §6, [[../08-Crosscutting]] §Match
render policy, and [[../../00-Index/Current-State]] §Performance Budgets.

The original wording read literally as "no 3D match view on the roadmap,
ever (permanent product decision)". Read in context — and confirmed by
Nico on 2026-05-20 — the binding scope of that decision is the **live
match-rendering pipeline** (22 players, ball, referee, crowd, live
camera). It is not a global ban on every browser GPU surface in the
product.

This ADR makes that distinction explicit and reusable for future
contributors who would otherwise stop at the literal "no 3D ever" wording.

> **AMENDED 2026-05-22 by [[ADR-0041-presentation-renderer-strategy]].** The
> Three.js/R3F 3D Presentation Layer remains accepted. ADR-0041 tightens the
> renderer portfolio: PixiJS is no longer a planned match-view upgrade, and
> Babylon.js / PlayCanvas are not planned fallback engines.

## Date

2026-05-20

## Context

The Bericht [3D-Rendering-Frameworks für den Fußballmanager — Tiefenvergleich
Three.js R3F, Babylon.js & PlayCanvas] (sources reused in
[[../../30-Implementation/3d-presentation-architecture]]) evaluates three
browser 3D options against our PWA stack. Three product-side use cases
emerged that are **not** match-render:

1. **Isometric stadium / club-campus view** — a slot-based upgrade board
   (20–60 modules) replacing or sitting next to today's 2D-SVG family in
   [components/composites/stadium/](../../../apps/web/src/components/composites/stadium/).
2. **Event cutscenes** — kuratierte, kurze (10–30 s) Highlight-Szenen
   bound to roguelite/career events: walkout (Einlauf), trophy lift
   (Pokalfeier), goal celebration (Jubel).
3. **Highlight backdrops** — statische 3D-Atmosphäre (Stadionsilhouette,
   Flutlicht-HDRI) hinter bestehender 2D-UI.

Live match rendering (Spielszene, Live-Kamera, 22 animierte Spieler) is
out of scope and remains forbidden.

Constraints driving the design:

- Permanent decision against 3D match render (preserved).
- Mobile-first, multi-tier device matrix (Floor / Standard / Premium) per
  [[../../60-Research/performance-budgets]].
- PWA bundle budgets (initial critical ≤ 200 KB, total session ≤ 700 KB).
- Service-ready modular monolith with DDD bounded contexts
  ([[ADR-0019-modular-monolith-ddd]]); no new context for presentation.
- TanStack-Start + shadcn + Storybook design-system rules
  ([[ADR-0010-design-system]]); Storybook is canonical visual reference.
- iOS Safari WebGL `webglcontextlost` is a well-documented platform bug,
  not a framework bug, and any 3D surface must recover gracefully.
- Capacitor packaging is anticipated post-MVP; architecture must keep
  WebView deployment open without binding it now.

## Options Considered

- **Option A — Three.js + React Three Fiber (R3F).** Smallest bundle
  (~168 kB gzipped), native React bindings, on-demand rendering, mature
  `react-three-offscreen` worker path. Largest community (5M+
  weekly downloads).
- **Option B — Babylon.js 9.0.** Most cinematic out-of-box (Animation
  Retargeting, Node Particle Editor, volumetric lights, clustered
  lighting). Bundle ~1.4 MB, no native React bindings, larger learning
  curve.
- **Option C — PlayCanvas 2.9.** Visual cloud editor, indirect-draw
  WebGPU compute. Editor-centric workflow creates a second frontend
  silo; weakest fit for a developer-driven React/TypeScript team.
- **Option D — No 3D at all.** Keep the literal reading of the 2026-05-17
  decision; ship presentation polish in 2D forever.

## Decision

### 1. The 2026-05-17 "no 3D" decision is scoped to match render only

A 3D Presentation Layer is permitted **only** for the three use cases in
§Context above (stadium/campus, cutscenes, backdrop). Live match render
remains the locked 2D Canvas + Text & Stats policy from
[[../../60-Research/performance-budgets]] §6.

### 2. Framework: Three.js + React Three Fiber

R3F is adopted as the canonical 3D Presentation framework. Babylon.js
and PlayCanvas are not adopted. ADR-0041 later tightens this from "future
switch reserved" to "not planned unless a superseding ADR proves measured
Three/R3F failure"; the `SceneDescriptor` contract below keeps domain code
independent from renderer APIs.

Packages permitted: `three`, `@react-three/fiber`, `@react-three/drei`,
`@react-three/offscreen`, `three-stdlib`. No further 3D packages
without a new ADR.

### 3. SceneDescriptor as the hard boundary

The 3D layer accepts **only** immutable JSON `SceneDescriptor` objects,
never bounded-context state or match-engine signals. The
canonical TypeScript type lives in
`apps/web/src/domain/_shared/scene.ts` and is the only contract the
renderer reads. Domain → SceneDescriptor mapping happens in adapters
under `apps/web/src/lib/scene-mapper/*`.

This protects [[ADR-0019-modular-monolith-ddd]] context boundaries and
prevents the recurring "we just need a tiny bit of match logic in the
renderer" scope creep that the framework Bericht flags as the largest
risk.

### 4. Floor-tier fallback is mandatory

A `CapabilityGate` composite picks 2D or 3D per render. 2D is rendered
when **any** of these hold:

| Condition | Source |
|---|---|
| device-tier resolves to `floor` | [[../../60-Research/performance-budgets]] |
| `prefers-reduced-motion: reduce` | OS-level signal |
| `navigator.connection.saveData === true` | OS-level signal |
| `prefers-reduced-data` honoured | per Crosscutting §Performance |
| two `webglcontextlost` events within 60 s | session-scoped trip flag |
| WebGL init throws | hard runtime failure |

The existing 2D composite family under
[components/composites/stadium/](../../../apps/web/src/components/composites/stadium/)
remains fully maintained, consumes the same read-models, and is not
deprecated. Storybook ships a 2D pendant story for every 3D composite
so the visual diff is auditable.

### 5. Performance discipline is enforced, not aspirational

- `<Canvas frameloop="demand" dpr={[1, 2]}>` for the non-animated iso
  stadium view.
- `react-three-offscreen` worker render path for all 3D composites where
  `OffscreenCanvas` is supported (iOS Safari ≥ 16.4, Chromium, Firefox).
- Draw-call budget ≤ 150 per scene, enforced via a Vitest test that
  reads `renderer.info.render.calls` from `@react-three/test-renderer`.
- All repeatable stadium modules via `InstancedMesh`.
- glTF assets Draco-compressed; textures ≤ 1024×1024; HDRI ≤ 1 k.
- The 3D code path lives in a dedicated Vite `manualChunk` and is
  lazy-loaded by route; initial-critical bundle stays unchanged.

### 6. iOS Safari context-loss recovery is layered

Pure page-reload fallback is forbidden as the only strategy. The
required layered recovery (see
[[../../30-Implementation/3d-presentation-architecture]] §Context Loss):

1. `visibilitychange` pauses the demand-frameloop while tab hidden.
2. `webglcontextlost` is `preventDefault`-ed; loop paused; no eager dispose.
3. `webglcontextrestored` rebuilds the scene deterministically from the
   last `SceneDescriptor` (JSON, immutable → safe to replay).
4. Two losses within 60 s → `CapabilityGate` trips to 2D for the session.
5. Page reload only if even the 2D fallback fails to initialise.

Each context-loss event is reported as a `scene.context-loss` GlitchTip
telemetry event per [[ADR-0017-observability-logging]].

### 7. 3D Presentation is **not** a new bounded context

3D lives in the UI/presentation layer of the modular monolith
([[ADR-0019-modular-monolith-ddd]], [[../bounded-context-map]]). It
consumes read-models and domain events; it never owns commands or
storage. The bounded-context map gains a clarifying note, not a new row.

### 8. Asset pipeline (MVP of this layer): stock + CC0/MIT only

Stadium modules, characters, HDRIs are sourced from CC0/MIT collections
(Kenney, Quaternius, Polygon-Free, Poly Haven). Provenance is tracked
in `apps/web/public/assets/3d/LICENSES.md`. An in-house Blender →
glTF pipeline is **not** authorised by this ADR and requires a separate
ADR + spike if/when it becomes necessary.

### 9. Capacitor packaging stays open

The SceneDescriptor contract is JSON-serialisable, asset paths are
relative, and the worker is loaded via `import.meta.url` — all
WebView-compatible. Capacitor itself is **not** activated by this ADR;
its enablement and Android-WebView FPS validation remain a separate
future ADR/beat.

### 10. Match render is governed by ADR-0024 — not by this ADR

Live match-rendering is **out of scope** for this ADR. The match
renderer is governed by [[ADR-0024-match-renderer-abstraction]]
(Canvas 2D first; PixiJS no longer planned after ADR-0041)
behind the [[ADR-0026-match-frame-contract]] seam. The locked
2026-05-17 "no 3D ever" decision, as precised here, scopes to the
live match render pipeline (22 players, ball, referee, live camera);
it does **not** authorise a 3D match renderer. ADR-0041 later removes the
previously planned ADR-0024 PixiJS WebGL upgrade from the roadmap.

Should any future need arise for a 3D match render, it would require
a new ADR that explicitly supersedes ADR-0024's renderer-implementation
plan and the precising statements in
[[../../60-Research/performance-budgets]] §6 and [[../08-Crosscutting]]
§Match render policy. This ADR does not authorise that path.

### 11. Animation stack alignment (ADR-0022)

[[ADR-0022-animation-game-feel]] picks **Motion** for UI/gesture/layout
and **GSAP** for choreographed timelines including in-canvas tweening.
For 3D Presentation composites under this ADR:

- Scene-state values (camera position, light intensity, cutscene
  beats, scripted character motion) MAY be tweened with **GSAP** —
  the same state-tweening pattern ADR-0022 prescribes for the Canvas 2D
  match view. R3F's `useFrame` reads the GSAP-tweened state on each
  demand frame.
- DOM overlays around the canvas (skip button, controls, post-cutscene
  CTA) use **Motion** per ADR-0022.
- No third animation library is permitted under this ADR. R3F's
  built-in `useAnimations` for glTF clip playback is in addition to,
  not instead of, GSAP timeline orchestration.

## Rationale

R3F over Babylon.js / PlayCanvas: the smallest bundle, the only option
with native React bindings, on-demand rendering (battery-friendly for
the non-animated stadium iso view), and the best fit for our existing
TanStack-Start + shadcn + Storybook + Worker stack. Babylon's cinematic
edge (Animation Retargeting, Node Particle Editor) is real but is
out-of-scope for the MVP of this layer (stock assets, simple trophy
lift) and is reserved as a future-ADR escalation trigger.

A hard renderer boundary via `SceneDescriptor` is the single
non-negotiable architectural choice. Every framework Bericht we read
flagged "scope creep from 3D layer back into domain logic" as the
biggest engineering risk in a manager-style PWA. The DDD contract
boundary that already protects our match engine generalises naturally
to also protect the 3D layer from absorbing domain responsibility.

Mandatory 2D fallback is not a polish item, it is a product-trust item
for floor-tier hardware and `prefers-reduced-motion` users — both of
which are first-class audiences per [[ADR-0008-mobile-first-ui]] and
[[../../60-Research/performance-budgets]].

## Consequences

Positive:

- Stadium upgrade view, trophy/walkout cutscenes and event backdrops
  become buildable on a stable, testable foundation.
- Bundle, draw-call, VRAM and context-loss budgets are codified, not
  improvised.
- 2D family is preserved as a permanent first-class fallback rather
  than ripped out.
- Renderer (Three.js) is swappable later (Babylon.js, WebGPU, even
  offline Unreal render service) without touching domain code.
- Storybook 2D-pendant rule keeps the design system auditable.

Negative:

- Adds ~168 kB (gzipped, lazy-loaded) of base 3D code in its own chunk.
- Requires explicit fallback maintenance: every new 3D composite must
  ship its 2D counterpart and a `CapabilityGate` switch.
- Introduces an asset pipeline (even stock-only), a new license-tracking
  responsibility, and an iOS context-loss telemetry surface.
- Mobile FPS in Capacitor Android WebView is not validated yet —
  Capacitor-enablement beat must close that gap before 3D is shipped
  inside a Capacitor build.

Future:

- A walkout cutscene (Slice 7d) extends this ADR's cutscene category
  without further decision work, provided performance budgets hold.
- WebGPU migration is a separate future ADR once R3F's WebGPU renderer
  reaches production stability and our shipping device matrix has the
  support.
- If `Sparkles`/drei particles look too thin for trophy/goal moments,
  the escalation path is a Babylon.js cutscene engine alongside R3F for
  iso stadium — a new ADR that this one explicitly anticipates.
- An in-house Blender pipeline becomes a separate ADR if stock assets
  feel too generic at scale.

## Compliance

- The 3D code path MUST live under `apps/web/src/components/3d/**` and
  never import from `apps/web/src/domain/{match,club,…}/**` except
  through `domain/_shared/scene.ts` and `lib/scene-mapper/**`.
- Every 3D composite MUST ship a 2D pendant story in Storybook.
- The `CapabilityGate` MUST be the only entry point that decides 2D vs
  3D rendering; route components MUST NOT branch on tier directly.
- `<Canvas>` instances MUST set `frameloop="demand"` unless an active
  cutscene requires continuous render.
- All 3D assets MUST be CC0/MIT and tracked in
  `public/assets/3d/LICENSES.md`.
- A new 3D composite PR MUST update
  [[../../20-Features/feature-3d-presentation-layer]] and
  [[../../30-Implementation/3d-presentation-architecture]] in the same
  PR (same-PR rule from [[../../90-Meta/vault-governance]]).
- Match-engine, match context and match read-models MUST NOT import
  from `components/3d/**`.

## Supersedes

None. This ADR precises the locked 2026-05-17 "no 3D" decision; it does
not replace any ADR. The original wording is amended in
[[../../60-Research/performance-budgets]] §6, [[../08-Crosscutting]]
§Match render policy, [[../../00-Index/Current-State]] §Performance
Budgets, and [[../../60-Research/wave-3-gap-analysis]] §gap D9 in the
same PR as this ADR.

## Design source

Implements presentation-layer needs anticipated by
[[../../50-Game-Design/stadium-and-campus]] and the trophy/celebration
beats in [[../../50-Game-Design/GD-0017-mvp-scope-and-mode-sequencing]].

## Sources

- [[../../30-Implementation/3d-presentation-architecture]] — architecture
  detail, framework Bericht synthesis, context-loss best practice.
- [[../../60-Research/performance-budgets]] — device tiers, bundle
  budgets, match render policy.
- [[ADR-0008-mobile-first-ui]] — mobile-first first-class audiences.
- [[ADR-0010-design-system]] — Storybook obligation, composite layering.
- [[ADR-0017-observability-logging]] — GlitchTip telemetry contract.
- [[ADR-0019-modular-monolith-ddd]] — bounded-context discipline.
- [[ADR-0020-hybrid-online-mvp-offline-ready]] — MVP authority and
  Phase-2 polish staging.

## Related

- [[../../20-Features/feature-3d-presentation-layer]]
- [[../../20-Features/feature-stadium-builder]]
- [[../../30-Implementation/3d-presentation-architecture]]
- [[../../30-Implementation/mvp-implementation-roadmap]]
- [[../bounded-context-map]]
- [[../08-Crosscutting]]
- [[../../00-Index/Current-State]]
- [[../../60-Research/wave-3-gap-analysis]]
