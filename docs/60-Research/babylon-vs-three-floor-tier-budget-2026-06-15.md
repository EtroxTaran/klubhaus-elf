---
title: "Babylon renderer stack cleanup and Floor-tier budget check (FMX-158)"
status: current
tags: [research, synthesis, renderer, babylon, pwa, performance, fmx-158]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-158
related:
  - [[raw-perplexity/raw-babylon-renderer-stack-2026-06-15]]
  - [[raw-perplexity/raw-babylon-renderer-stack-source-checks-2026-06-15]]
  - [[../40-Execution/fmx-158-babylon-renderer-stack-decision-queue-2026-06-15]]
  - [[../10-Architecture/08-Crosscutting]]
  - [[../10-Architecture/09-Decisions/ADR-0047-babylon-3d-presentation-engine]]
  - [[../10-Architecture/09-Decisions/ADR-0041-presentation-renderer-strategy]]
  - [[performance-budgets]]
---

# Babylon renderer stack cleanup and Floor-tier budget check (FMX-158)

## Scope

FMX-158 closes a stale active-doc contradiction: `08-Crosscutting` still named
Three.js/R3F as the only planned optional 3D stack after ADR-0047 accepted
Babylon.js as the single optional 3D/2.5D presentation engine.

This beat does not add dependencies, implement a renderer, alter match
authority or reopen ADR-0047.

## Current facts

| Area | Finding |
|---|---|
| Accepted decision | ADR-0047 accepts Babylon.js as the single optional 3D/isometric presentation engine and amends ADR-0029/0041. |
| Current package check | `@babylonjs/core` latest is `9.12.0` on npm as checked 2026-06-15. |
| Release artifact | GitHub release `9.12.0` is public, non-draft and non-prerelease, published 2026-06-11. |
| Package-size signal | npm metadata reports `dist.unpackedSize: 66572178` and `fileCount: 9767`; this is package size metadata, not a final app bundle measurement. |
| Active stale text | `08-Crosscutting` still said Three.js/R3F was the only planned optional 3D presentation stack. |
| Existing budgets | The active Floor tier keeps Text & Stats forced and has strict heap / JS transfer limits. Optional 3D is post-MVP, lazy-loaded, device-gated and fallback-safe. |

## Findings

### Babylon remains the accepted single optional stack

The source checks found no reason to re-open ADR-0047. FMX-158 should therefore
update active documentation to point to Babylon.js and keep Three.js/R3F only as
historical context in ADRs that describe the old path.

### The risk is implementation discipline, not decision ambiguity

Babylon's current package metadata and official optimization docs reinforce
ADR-0047's already documented risk: the optional 3D path must not affect the
initial PWA shell, Floor-tier default path or match-authoritative pipeline.

### Official Babylon guidance matches the existing FMX guardrails

Official Babylon docs support:

- freezing static materials, world matrices and active meshes where valid;
- reducing draw calls through instances/thin instances or shared geometry;
- avoiding unnecessary pointer picking, post-processing, shadows, render targets
  and expensive pipeline features on constrained devices;
- using `SceneOptimizer` to degrade quality toward a target frame rate;
- managing memory by being deliberate about IndexedDB asset caching,
  context-loss restoration, cached vertex data and cached texture buffers;
- using dynamic loader registration and module-level loader functions instead
  of static all-loader imports;
- using progressive glTF LOD/range-loading only when assets and hosting support
  it.

### Game/UI precedent pattern

The relevant pattern is presentation-only visualization over authoritative
simulation. In FMX terms: a Babylon scene can visualize committed career,
venue, trophy, campus or curated-highlight descriptors, but the scene cannot
produce authoritative match events, outcomes, RNG draws, save state or economy
effects. A fully disabled 3D path must leave gameplay and simulation outcomes
unchanged.

## Decision record

Nico selected FMX-158 and instructed implementation of the proposed plan on
2026-06-15. Applied defaults:

- D1 = consistency cleanup under accepted ADR-0047; do not re-open renderer
  choice.
- D2 = update active stale guidance, not only the single issue line.
- D3 = keep existing Floor/Standard/Premium budgets and defer exact Babylon
  bundle/scene thresholds to implementation-time measurement.

See
[[../40-Execution/fmx-158-babylon-renderer-stack-decision-queue-2026-06-15]].

## Resulting guidance

- Babylon.js is the only planned optional 3D/2.5D presentation engine.
- Three.js/R3F is historical context only unless a future ADR supersedes
  ADR-0047.
- Canvas 2D remains the match renderer and match-authoritative visualization
  path.
- Optional 3D scenes are post-MVP, lazy-loaded, device-gated, fallback-safe and
  derived from committed descriptors/read models.
- No 3D scene may compute or mutate authoritative simulation state.
- First implementation must measure real app bundle and runtime memory on the
  accepted device matrix before committing package pins or scene budgets.

## Sources

- Raw Perplexity capture:
  [[raw-perplexity/raw-babylon-renderer-stack-2026-06-15]]
- Source checks:
  [[raw-perplexity/raw-babylon-renderer-stack-source-checks-2026-06-15]]
- npm package metadata:
  <https://registry.npmjs.org/@babylonjs/core/latest>
- GitHub release:
  <https://github.com/BabylonJS/Babylon.js/releases/tag/9.12.0>
- Official Babylon docs checked through Context7 and Ref:
  <https://github.com/babylonjs/documentation/blob/master/content/features/featuresDeepDive/scene/optimize_your_scene.md>,
  <https://github.com/babylonjs/documentation/blob/master/content/features/featuresDeepDive/scene/reducingMemoryUsage.md>,
  <https://github.com/BabylonJS/Documentation/blob/master/content/features/featuresDeepDive/scene/sceneOptimizer.md>,
  <https://github.com/BabylonJS/Documentation/blob/master/content/features/featuresDeepDive/importers/loadingFileTypes.md>,
  <https://github.com/babylonjs/documentation/blob/master/content/features/featuresDeepDive/importers/glTF/progressiveglTFLoad.md>

## Related

- [[../40-Execution/fmx-158-babylon-renderer-stack-decision-queue-2026-06-15]]
- [[../10-Architecture/08-Crosscutting]]
- [[../10-Architecture/09-Decisions/ADR-0047-babylon-3d-presentation-engine]]

