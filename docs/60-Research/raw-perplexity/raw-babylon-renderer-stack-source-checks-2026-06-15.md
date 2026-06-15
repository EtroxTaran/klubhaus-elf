---
title: "Raw - Babylon renderer stack source checks (FMX-158)"
status: raw
tags: [research, raw, source-check, renderer, babylon, pwa, performance, fmx-158]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-158
related:
  - [[../babylon-vs-three-floor-tier-budget-2026-06-15]]
  - [[raw-babylon-renderer-stack-2026-06-15]]
  - [[../../40-Execution/fmx-158-babylon-renderer-stack-decision-queue-2026-06-15]]
  - [[../../10-Architecture/09-Decisions/ADR-0047-babylon-3d-presentation-engine]]
---

# Raw - Babylon renderer stack source checks (FMX-158)

## Source-check summary

FMX-158 used Perplexity as the discovery pass, then checked current facts
against package/release metadata and official Babylon documentation via
Context7 and Ref.

## Version and release checks

| Source | Checked fact | Result |
|---|---|---|
| npm registry `@babylonjs/core/latest` | Latest package version | `9.12.0` |
| npm registry `@babylonjs/core/latest` | Package metadata | `type: module`, `license: Apache-2.0`, `dist.unpackedSize: 66572178`, `fileCount: 9767` |
| GitHub release API `BabylonJS/Babylon.js/releases/latest` | Latest release artifact | tag `9.12.0`, published 2026-06-11, `draft: false`, `prerelease: false` |

Commands used:

```bash
curl -s https://registry.npmjs.org/@babylonjs/core/latest
gh api repos/BabylonJS/Babylon.js/releases/latest --jq '{tag_name, name, prerelease, draft, published_at, html_url}'
```

## Official documentation checks

Context7 resolved Babylon.js to `/babylonjs/documentation` and returned
official documentation matches for scene optimization, scene optimizer,
asset loading and glTF loading.

Ref source reads:

- Babylon optimize scene:
  <https://github.com/babylonjs/documentation/blob/master/content/features/featuresDeepDive/scene/optimize_your_scene.md>
- Babylon reducing memory footprint:
  <https://github.com/babylonjs/documentation/blob/master/content/features/featuresDeepDive/scene/reducingMemoryUsage.md>
- Babylon scene optimizer:
  <https://github.com/BabylonJS/Documentation/blob/master/content/features/featuresDeepDive/scene/sceneOptimizer.md>
- Babylon loading file types:
  <https://github.com/BabylonJS/Documentation/blob/master/content/features/featuresDeepDive/importers/loadingFileTypes.md>
- Babylon progressive glTF loading:
  <https://github.com/babylonjs/documentation/blob/master/content/features/featuresDeepDive/importers/glTF/progressiveglTFLoad.md>

## Extracted implementation constraints

- Scene performance depends heavily on reducing draw calls, culling work,
  shader/material churn, pointer picking, render targets and post-processing.
- Static or semi-static presentation scenes should freeze materials, freeze
  world matrices and freeze active mesh lists where valid.
- Repeated objects should use instances/thin instances or shared geometry rather
  than many independent meshes.
- The `SceneOptimizer` supports progressive runtime degradation toward a target
  frame rate, including mesh merge, shadow, post-process, particle, texture,
  render-target and hardware-scaling optimizations.
- Babylon's memory guidance calls out trade-offs around IndexedDB asset caching,
  WebGL context-loss restoration, cached vertex data and cached texture buffers.
- Loader guidance favors module-level scene loader functions and dynamic loader
  registration. Static all-loader imports are explicitly discouraged when
  dynamic registration can keep bundles smaller.
- glTF progressive loading with LODs/range requests can reduce time to first
  render, but it requires authored LODs and HTTP range support.

## FMX interpretation

- The package/release checks support recording `@babylonjs/core` 9.12.0 as the
  current source-checked artifact on 2026-06-15, not as a committed dependency
  pin. The repo is docs-only and no package should be added here.
- The large unpacked package metadata reinforces the existing ADR-0047
  consequence: Babylon must stay out of the baseline app shell and be lazy,
  capability-gated and fallback-safe.
- No source check justifies reopening ADR-0047. The issue is a stale-doc cleanup
  against an already accepted renderer decision.

## Related

- [[../babylon-vs-three-floor-tier-budget-2026-06-15]]
- [[raw-babylon-renderer-stack-2026-06-15]]
- [[../../10-Architecture/09-Decisions/ADR-0047-babylon-3d-presentation-engine]]

