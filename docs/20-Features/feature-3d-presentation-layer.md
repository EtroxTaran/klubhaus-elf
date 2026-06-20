---
title: Feature — 3D Presentation Layer (Stadium, Cutscenes, Backdrop)
status: draft
tags: [feature, presentation, 3d, babylon, stadium, cutscene, mobile, pwa]
context: [stadium-operations, match]
created: 2026-05-20
updated: 2026-06-15
type: feature
binding: false
priority: post-mvp
milestone: phase-2-polish
linear:
adr: [[../10-Architecture/09-Decisions/ADR-0029-3d-presentation-layer]]
related: [[../10-Architecture/09-Decisions/ADR-0029-3d-presentation-layer]], [[../30-Implementation/3d-presentation-architecture]], [[feature-stadium-builder]], [[feature-venue-operations]], [[../50-Game-Design/stadium-and-campus]], [[../60-Research/performance-budgets]], [[../30-Implementation/mvp-implementation-roadmap]]
supersedes:
superseded_by:
---

# Feature — 3D Presentation Layer

> Authority: [[../10-Architecture/09-Decisions/ADR-0029-3d-presentation-layer]]
> Architecture: [[../30-Implementation/3d-presentation-architecture]]
> Renderer: Babylon.js per
> [[../10-Architecture/09-Decisions/ADR-0047-babylon-3d-presentation-engine]]
> Roadmap: Phase 2 (after MVP slice 6) — see
> [[../30-Implementation/mvp-implementation-roadmap]].

## User Story

- **As a manager**, I want to see my stadium and club campus in a
  vivid isometric 3D view so that capacity tier upgrades and
  on-grounds attractions feel like real construction progress, not
  just a number on a card.
- **As a manager**, after winning a cup / promotion / league, I want a
  short cinematic moment (Pokalfeier / Aufstiegsfeier) so that the
  payoff for a run is felt, not only displayed.
- **As a manager on a low-end device or reduced-motion preference**, I
  want the same screens to keep working in their existing 2D form so
  that the app never gets worse for me because of polish for others.

## Gameplay Rationale

The MVP roguelite loop (slices 0–6) ships a working game and proves the
hook. Phase 2 turns moments players already care about — building the
club, winning a trophy — into **felt** moments. A small, kuratiertes 3D
layer (stadium iso view + a handful of cutscenes + atmospheric
backdrops) delivers Anstoß-grade emotional payoff without the risk and
cost of a full 3D match engine, which remains permanently out of scope
per [[../10-Architecture/09-Decisions/ADR-0029-3d-presentation-layer]]
and [[../60-Research/performance-budgets]].

## Scope

### In scope (this feature)

- **Iso-stadium / campus view** for the existing `/stadion` route:
  slot-based, 5 capacity tiers, ≥ 8 on-grounds attraction modules
  (matches [[feature-stadium-builder]] data model 1:1).
- **Trophy-lift cutscene** (10–20 s) triggered by
  `RogueliteRunCompletedEvent` with a cup / league / promotion trophy.
- **Walkout cutscene** (10–20 s) before kickoff (Slice 7d, optional).
- **Static stadium backdrop** behind `/anpfiff` and `/halbzeit` screens.
- **`CapabilityGate`** that picks 2D or 3D per device tier /
  preference; 2D pendant remains fully maintained.

### Out of scope (explicit)

- Live 3D match render (out of scope per ADR-0029 §10; the match renderer is governed by [[../10-Architecture/09-Decisions/ADR-0024-match-renderer-abstraction]] — Canvas 2D, PixiJS no longer planned — behind [[../10-Architecture/09-Decisions/ADR-0026-match-frame-contract]]).
- Animated full-stadium crowd (deferred indefinitely).
- In-house Blender → glTF asset pipeline (separate ADR if needed).
- Plot-by-plot SimCity stadium layout (Expert tier; tracked in
  [[feature-stadium-builder]]).
- WebGPU renderer path (separate future ADR when Babylon's WebGPU path and the
  shipping device matrix are production-ready).
- Capacitor WebView packaging itself (separate beat).

## Acceptance Criteria

### Slice 7a — Foundation + Iso-Stadium

- [ ] `SceneDescriptor` contract lives in
  `apps/web/src/domain/_shared/scene.ts` with discriminated union for
  `iso-stadium | cutscene-trophy-lift | cutscene-walkout | backdrop`.
- [ ] `CapabilityGate` chooses 2D path for: `tier === 'floor'`,
  `prefers-reduced-motion`, `Save-Data`, `prefers-reduced-data`,
  session-trip flag, WebGL init failure.
- [ ] `/stadion` route renders the iso-stadium 3D composite on
  Standard / Premium and the existing 2D composites on Floor.
- [ ] Storybook ships 3D and 2D pendant stories for the iso-stadium
  composite (same data fixture).
- [ ] Vitest/Babylon scene instrumentation asserts draw calls ≤ 150.
- [ ] Provoked `WEBGL_lose_context` recovers via `webglcontextrestored`
  on first event; second loss within 60 s trips to the 2D fallback.
- [ ] Initial-critical bundle unchanged; `scene-3d` chunk lazy-loaded.
- [ ] `apps/web/public/assets/3d/LICENSES.md` lists every shipped asset
  with source URL + license; CI lint fails if any glTF lacks a row.
- [ ] [[../10-Architecture/09-Decisions/ADR-0029-3d-presentation-layer]]
  is `accepted` and the locked-notes update PR has merged.

### Slice 7b — Stadium backdrop

- [ ] `<StadiumBackdrop>` composite renders a single static frame after init
  and then returns to demand-only rendering.
- [ ] Three presets: `stadium-silhouette`, `floodlight`, `rainy-night`.
- [ ] HDRI lazy-loaded; bundle inkrement < 60 kB gzipped on top of the
  shared 3D chunk.
- [ ] Integrated as optional background layer on `/anpfiff` and
  `/halbzeit`; 2D pendant story shows the static fallback image.

### Slice 7c — Trophy-lift cutscene

- [ ] `<TrophyLiftCutscene>` plays 10–20 s, skippable by tap / Enter
  / Space at any time.
- [ ] Triggered from `RogueliteRunCompletedEvent` via
  `lib/scene-mapper/match-trophy-lift.ts`.
- [ ] Floor tier shows a static 2D pokal card instead; same trigger.
- [ ] Storybook story can play the cutscene in isolation with a fixture
  descriptor.

### Slice 7d — Walkout cutscene (optional)

- [ ] Scope decision before starting: confirm with product whether the
  ROI is there given asset cost.
- [ ] Same skippable / 2D-fallback rules as 7c.

## Asset budget

- **glTF (Draco-compressed) per scene kind:** total ≤ 1.5 MB across
  geometry + textures, lazy-loaded with the scene.
- **HDRI:** 1k, single file shared across iso-stadium and cutscenes.
- **Animation clips:** ≤ 100 KB each; reuse Mixamo-compatible rigs.
- **Initial-critical bundle:** unchanged (per
  [[../60-Research/performance-budgets]]).
- **Draw calls per scene:** ≤ 150 (enforced in CI snapshot).
- **VRAM working set:** ≤ 256 MB on iOS reference device.

## Storybook obligation

Per [[../10-Architecture/09-Decisions/ADR-0010-design-system]] and
[[../10-Architecture/09-Decisions/ADR-0029-3d-presentation-layer]] §6 of
Compliance:

- Every 3D composite ships a `*.stories.tsx` AND a `*-2d.stories.tsx`
  rendering the same `SceneDescriptor` through the 2D fallback. This
  makes the visual delta auditable and prevents the 2D family from
  silently bit-rotting.

## Implementation Notes

- **Relevant ADRs:**
  [[../10-Architecture/09-Decisions/ADR-0029-3d-presentation-layer]]
  (authority), [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]]
  (mobile-first tiers),
  [[../10-Architecture/09-Decisions/ADR-0010-design-system]] (Storybook
  obligation),
  [[../10-Architecture/09-Decisions/ADR-0017-observability-logging]]
  (context-loss telemetry),
  [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]
  (bounded-context discipline),
  [[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
  (Phase-2 staging).
- **Relevant game design:** [[../50-Game-Design/stadium-and-campus]] for
  module taxonomy; [[../50-Game-Design/GD-0017-mvp-scope-and-mode-sequencing]]
  for end-of-run trophy / promotion moments.
- **Tests:** see [[../30-Implementation/3d-presentation-architecture]] §10.
- **Code pointers:** see [[../30-Implementation/3d-presentation-architecture]] §3.

## Dependencies

- [[feature-stadium-builder]] — module taxonomy and data model.
- [[feature-venue-operations]] — venue-readiness signals consumed by
  the iso-stadium scene mapper.
- [[../60-Research/performance-budgets]] — device tiers, bundle caps,
  draw-call envelopes.
- [[../30-Implementation/mvp-implementation-roadmap]] — Phase-2 slot.

## Related

- [[../10-Architecture/09-Decisions/ADR-0029-3d-presentation-layer]]
- [[../30-Implementation/3d-presentation-architecture]]
- [[feature-stadium-builder]]
- [[feature-venue-operations]]
- [[../50-Game-Design/stadium-and-campus]]
- [[../60-Research/performance-budgets]]
- [[../30-Implementation/mvp-implementation-roadmap]]
