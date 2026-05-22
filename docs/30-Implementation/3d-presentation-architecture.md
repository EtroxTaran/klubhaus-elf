---
title: 3D Presentation Architecture (Three.js + R3F)
status: current
tags: [implementation, presentation, 3d, three-js, r3f, stadium, cutscene, pwa, mobile, offscreen-canvas, context-loss]
created: 2026-05-20
updated: 2026-05-20
type: implementation
binding: true
linear:
adr: [[../10-Architecture/09-Decisions/ADR-0029-3d-presentation-layer]]
related: [[../10-Architecture/09-Decisions/ADR-0029-3d-presentation-layer]], [[../20-Features/feature-3d-presentation-layer]], [[../60-Research/performance-budgets]], [[../10-Architecture/08-Crosscutting]], [[../10-Architecture/bounded-context-map]], [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]], [[../10-Architecture/09-Decisions/ADR-0017-observability-logging]], [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]], [[mvp-implementation-roadmap]]
supersedes:
superseded_by:
---

# 3D Presentation Architecture

> Authority: [[../10-Architecture/09-Decisions/ADR-0029-3d-presentation-layer]]
> Feature: [[../20-Features/feature-3d-presentation-layer]]
> Roadmap: Phase 2 (after MVP slice 6) — see [[mvp-implementation-roadmap]].

## Purpose

Implementation-level guide for the 3D Presentation Layer: file
structure, the `SceneDescriptor` contract, the `CapabilityGate`
2D/3D-fallback machine, the OffscreenCanvas worker path, the iOS
context-loss recovery layers, and the stock-asset pipeline. This note
is the canonical "how to build it" reference; the "why" lives in
ADR-0029 and the framework Bericht synthesis below.

## Boundaries

- **Applies to:** isometric stadium / campus view, kuratierte
  Event-Cutscenes (walkout, trophy lift, goal celebration), static
  highlight backdrops, and any future composite that consumes a
  `SceneDescriptor`.
- **Does not apply to:** live match rendering (2D Canvas + Text & Stats
  per [[../60-Research/performance-budgets]] §6 — non-negotiable),
  animated full-stadium crowds, in-game video playback.

## 1. Scope split vs. the locked decision

The 2026-05-17 "no 3D ever" decision is precised by ADR-0029:

- **Forbidden:** 3D match render (22 players, ball, referee, live cam).
- **Allowed under this note:** stadium iso view, cutscenes (≤ 30 s),
  static backdrops — all driven by `SceneDescriptor` JSON.

Match-context code MUST NOT import from `components/3d/**`; the renderer
MUST NOT import from `domain/match/**`.

## 2. SceneDescriptor contract

The 3D layer's single public input. Lives in
`apps/web/src/domain/_shared/scene.ts`.

```ts
export type DeviceTier = 'floor' | 'standard' | 'premium'

export interface DeviceCapabilities {
  tier: DeviceTier
  prefersReducedMotion: boolean
  saveData: boolean
  prefersReducedData: boolean
  contextLossTrip: boolean // session-flag after two losses in 60 s
}

export type StadiumModuleId =
  | 'main-stand'
  | 'side-stand-east'
  | 'side-stand-west'
  | 'fanzone'
  | 'wuerstchenbude'
  | 'bierstand'
  // … keep in lockstep with feature-stadium-builder modules

export type SceneDescriptor =
  | {
      kind: 'iso-stadium'
      capacityTier: 1 | 2 | 3 | 4 | 5
      modules: StadiumModuleId[]
      daypart: 'day' | 'evening' | 'night'
    }
  | {
      kind: 'cutscene-trophy-lift'
      clubCrestId: string
      trophy: 'cup' | 'league' | 'promotion'
    }
  | {
      kind: 'cutscene-walkout'
      clubCrestId: string
      opponentCrestId?: string
    }
  | {
      kind: 'backdrop'
      preset: 'stadium-silhouette' | 'floodlight' | 'rainy-night'
    }

export interface SceneRenderer {
  supports(descriptor: SceneDescriptor, capabilities: DeviceCapabilities): boolean
  render(descriptor: SceneDescriptor): React.ReactNode
}
```

Invariants:

- `SceneDescriptor` is **immutable** and **JSON-serialisable**. No
  functions, no class instances, no DOM/Three references.
- A descriptor is the **only** thing crossing the boundary. Domain code
  produces it in `apps/web/src/lib/scene-mapper/*` adapters; renderer
  consumes it. Same data round-trips into Storybook fixtures.
- New scene kinds require a new discriminant + a renderer + a Storybook
  story (3D and 2D pendant) in the same PR.

## 3. File / module layout

```
apps/web/src/
  domain/_shared/scene.ts                  # SceneDescriptor, DeviceCapabilities
  lib/scene-mapper/
    club-iso-stadium.ts                    # Club read-model → iso-stadium descriptor
    club-iso-stadium.test.ts
    match-trophy-lift.ts                   # RogueliteRunCompletedEvent → trophy-lift
    match-trophy-lift.test.ts
  lib/device-capabilities/
    use-device-capabilities.ts             # tier + reduced-motion + save-data hook
    use-device-capabilities.test.ts
  components/3d/
    scene-canvas.tsx                       # <Canvas> wrapper (frameloop, dpr, context-loss)
    scene-canvas.stories.tsx
    scene-renderer.tsx                     # discriminated render dispatch
    capability-gate.tsx                    # 2D-or-3D decision wrapper
    capability-gate.test.tsx
    context-loss.ts                        # useContextLossRecovery hook + helpers
    context-loss.test.ts
    iso-stadium/
      iso-stadium.tsx                      # OrthographicCamera + InstancedMesh
      iso-stadium.stories.tsx              # 3D story
      iso-stadium-2d.stories.tsx           # 2D pendant (reuses composites/stadium)
      iso-stadium.test.tsx
    cutscene/
      trophy-lift.tsx
      trophy-lift.stories.tsx
      walkout.tsx                          # (Slice 7d, optional)
      walkout.stories.tsx
    backdrop/
      stadium-backdrop.tsx
      stadium-backdrop.stories.tsx
  public/assets/3d/
    LICENSES.md                            # provenance for every asset
    stadium/*.glb                          # Draco-compressed
    characters/*.glb
    hdri/*.hdr                             # 1k
```

The existing 2D composite family in
`apps/web/src/components/composites/stadium/` is unchanged and remains
the floor-tier fallback.

## 4. CapabilityGate (2D vs 3D)

`<CapabilityGate descriptor={d}>` resolves capabilities via
`useDeviceCapabilities()` and renders 2D **iff any** of these hold:

| Condition | Source |
|---|---|
| `tier === 'floor'` | performance-budgets device matrix |
| `prefersReducedMotion === true` | `window.matchMedia('(prefers-reduced-motion: reduce)')` |
| `saveData === true` | `navigator.connection?.saveData` |
| `prefersReducedData === true` | `window.matchMedia('(prefers-reduced-data: reduce)')` |
| `contextLossTrip === true` | persisted to `sessionStorage` by `useContextLossRecovery` |
| WebGL2 init throws | hard runtime failure trapped at canvas mount |

When 2D is selected, the gate renders a `SceneDescriptor`-to-2D adapter
that reuses the existing `stadium/*` composites or — for cutscenes —
shows a static 2D card (still image + caption). Both branches consume
the same descriptor.

The CapabilityGate is the **only** place that decides 2D vs 3D. Route
components and feature screens never read the tier directly.

## 5. SceneCanvas (`<Canvas>` wrapper)

`scene-canvas.tsx` wraps R3F's `<Canvas>` with:

- `frameloop="demand"` by default; cutscene composites can opt into
  `frameloop="always"` for their active duration.
- `dpr={[1, 2]}` — DPR clamp at 2.0 per
  [[../60-Research/performance-budgets]].
- `gl={{ powerPreference: 'high-performance', antialias: true,
  failIfMajorPerformanceCaveat: false }}`.
- `onCreated({ gl, scene })` registers context-loss listeners and
  records a `scene.render-init` telemetry event.
- Lazy mount via `React.lazy` so the 3D chunk is loaded only on routes
  that actually render a 3D composite.

OffscreenCanvas: when `'OffscreenCanvas' in window` and not on iOS
< 16.4, `SceneCanvas` mounts via `<Canvas worker={…}>` using
`react-three-offscreen` (drop-in). Otherwise it falls back to the
main-thread `<Canvas>` automatically.

## 6. iOS Safari context-loss — layered recovery

Best practice synthesized from the framework Bericht §1.6 sources
(three.js forum threads on iOS 17 / M3 / M4 context loss, R3F docs,
PlayCanvas WebGL guidelines).

Hook: `useContextLossRecovery(canvas, descriptor)` in
`components/3d/context-loss.ts`.

Layer 1 — **Visibility pause.** `document.addEventListener
('visibilitychange', …)` flips the demand frameloop to `'never'` when
the tab is hidden and back to `'demand'` on visible. Prevents the
majority of background-induced losses.

Layer 2 — **`webglcontextlost` capture.**

```ts
canvas.addEventListener('webglcontextlost', (e) => {
  e.preventDefault()
  loopState.set('paused')
  // NO eager dispose — Three.js will reuse resource handles
  // after restore. Disposing here causes the textures-disappear bug.
  telemetry.event('scene.context-loss', { kind: descriptor.kind })
}, { passive: false })
```

Layer 3 — **Deterministic restore.**

```ts
canvas.addEventListener('webglcontextrestored', () => {
  // SceneDescriptor is immutable JSON → rebuilding is safe and idempotent.
  sceneTree.rebuildFrom(descriptor)
  loopState.set('demand')
  telemetry.event('scene.context-restored', { kind: descriptor.kind })
})
```

Layer 4 — **Trip the gate after a second loss in 60 s.**

```ts
if (lossesInLast(60_000) >= 2) {
  sessionStorage.setItem('scene.context-loss-trip', '1')
  // CapabilityGate re-reads on next render and picks 2D for the session.
}
```

Layer 5 — **Page reload only if 2D fallback also fails.** The gate
attempts the 2D branch first; only if that throws does the canvas
trigger `window.location.reload()`. This branch is logged as
`scene.fatal-fallback`.

Telemetry contract from [[../10-Architecture/09-Decisions/ADR-0017-observability-logging]]:
events go through the existing OpenTelemetry JS instrumentation; PII is
the descriptor `kind` only (no club/user identifiers).

## 7. Performance discipline

Hard rules, enforced where possible:

- **Draw calls ≤ 150 per scene.** Vitest test reads
  `renderer.info.render.calls` after first render via
  `@react-three/test-renderer`; CI ratchet.
- **Instancing mandatory** for repeated stadium modules (`InstancedMesh`).
- **glTF + Draco** for all geometry; `KTX2` for textures where supported,
  ≤ 1024×1024.
- **HDRI ≤ 1k**, shared across iso stadium + cutscenes via a small
  HDRI registry in `lib/scene-mapper/hdri.ts`.
- **Vite `manualChunks`**: `three`, `@react-three/*`, and the
  `components/3d/**` tree split into a `scene-3d` chunk, lazy-loaded.
- **Initial-critical bundle stays ≤ 200 KB gzipped** per
  [[../60-Research/performance-budgets]]. The Bundle-Size CI ratchet
  fails the PR if the initial-critical chunk grows.

## 8. Asset pipeline (stock-only)

MVP rule: **CC0 or MIT only.** Authorised sources:

| Source | License | Used for |
|---|---|---|
| Kenney Sports Pack, City Kit | CC0 | Stadium modules, props |
| Quaternius Ultimate Modular Pack, Characters | CC0 | Stadium structure, players |
| Polygon-Free / Sketchfab CC0 | CC0 | Specific props |
| Poly Haven HDRIs | CC0 | Environment maps |
| Mixamo animations | Free for commercial use; non-redistributable as standalone library | Cutscene character anims |

Provenance file at `apps/web/public/assets/3d/LICENSES.md` lists every
shipped asset with source URL + license. CI lint fails the PR if a glTF
under `public/assets/3d/` lacks a LICENSES row.

No in-house Blender pipeline under this note. If it becomes necessary,
file a new ADR.

## 9. Capacitor future-hooks

The architecture is Capacitor-ready but **not** Capacitor-activated.
Preconditions kept in place:

- All asset URLs relative (`/assets/3d/...`), never absolute / origin-bound.
- Worker bootstrapped via `new Worker(new URL('./scene.worker.ts',
  import.meta.url), { type: 'module' })` — works in WebView.
- `SceneDescriptor` JSON-serialisable so it crosses native bridges
  unchanged if a future Capacitor plugin emits scene state from native.
- Capacitor enablement and Android-WebView FPS validation happen in
  their own future Phase-2 beat. Until that beat lands, the 3D code
  path runs only in the PWA browser context.

## 10. Test strategy

Reference: `testing-strategy` (planned).

| Layer | What | Tool |
|---|---|---|
| Unit | `scene-mapper/*` (read-model → descriptor) | Vitest |
| Unit | `useDeviceCapabilities` branches | Vitest + Testing-Library |
| Component | `CapabilityGate` all six fallback branches | Vitest + Testing-Library |
| Snapshot | R3F scene tree per descriptor | `@react-three/test-renderer` |
| Storybook | 3D story + 2D pendant story per composite | Storybook |
| Bundle | `scene-3d` chunk size + initial-critical unchanged | Bundle-Size CI |
| E2E | `/stadion` renders on `chromium` and `webkit` Playwright profiles | Playwright |
| E2E | Provoked context-loss recovers or trips to 2D | Playwright via `WEBGL_lose_context` |
| Lighthouse | Performance budget on `/stadion` route | Lighthouse CI |

JSDOM has no WebGL context, so live-pixel tests are not part of the
unit/component suite. The `@react-three/test-renderer` covers scene
graph invariants without needing a real GPU.

## 11. Roadmap slices (links)

Phase 2 (after MVP slice 6):

- **Slice 7a — Foundation + Iso-Stadium** — sets up packages, contract,
  CapabilityGate, context-loss, first iso composite.
- **Slice 7b — Stadium backdrop** — static HDRI behind `/anpfiff`,
  `/halbzeit`.
- **Slice 7c — Trophy-lift cutscene** — animated character + Sparkles
  confetti, triggered by `RogueliteRunCompletedEvent`.
- **Slice 7d (optional)** — Walkout cutscene.

Vault delta sequence: ADR-0029 + locked-notes update PR → Slice 7a code
PR → Slice 7b code PR → Slice 7c code PR. Each code PR may amend this
note (e.g. extend the `StadiumModuleId` union, add a new HDRI to the
registry); not the ADR.

## Code Pointers

- Contract: `apps/web/src/domain/_shared/scene.ts` (to be created in
  Slice 7a)
- Composites: `apps/web/src/components/3d/**` (to be created)
- Mappers: `apps/web/src/lib/scene-mapper/**` (to be created)
- Assets + licenses: `apps/web/public/assets/3d/**` (to be created)
- 2D fallback (existing, do not change): `apps/web/src/components/composites/stadium/**`

## Change History

- 2026-05-20: Initial. Authored alongside
  [[../10-Architecture/09-Decisions/ADR-0029-3d-presentation-layer]]
  and [[../20-Features/feature-3d-presentation-layer]].

## Related

- [[../10-Architecture/09-Decisions/ADR-0029-3d-presentation-layer]]
- [[../20-Features/feature-3d-presentation-layer]]
- [[../60-Research/performance-budgets]]
- [[../10-Architecture/08-Crosscutting]]
- [[../10-Architecture/bounded-context-map]]
- [[../10-Architecture/09-Decisions/ADR-0017-observability-logging]]
- [[mvp-implementation-roadmap]]
