---
title: "Raw - Babylon renderer stack cleanup (FMX-158)"
status: raw
tags: [research, raw, perplexity, renderer, babylon, pwa, performance, fmx-158]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-158
related:
  - [[../babylon-vs-three-floor-tier-budget-2026-06-15]]
  - [[raw-babylon-renderer-stack-source-checks-2026-06-15]]
  - [[../../40-Execution/fmx-158-babylon-renderer-stack-decision-queue-2026-06-15]]
  - [[../../10-Architecture/09-Decisions/ADR-0047-babylon-3d-presentation-engine]]
  - [[../../10-Architecture/08-Crosscutting]]
---

# Raw - Babylon renderer stack cleanup (FMX-158)

## Research prompt

Perplexity was asked on 2026-06-15:

> FMX-158: The vault still says Three.js/R3F is the only planned optional 3D
> presentation stack, but accepted ADR-0047 chooses Babylon.js as the single
> optional 3D/2.5D presentation engine behind SceneDescriptor/CapabilityGate.
> Research current best practices and risks for confirming Babylon.js as the
> only optional presentation stack in a PWA football-manager game. Include:
> current Babylon stable/version evidence, Babylon vs Three/R3F only as
> historical context, PWA/mobile bundle and memory budget risks,
> lazy-loading/device-gating/fallback best practices, and comparable
> sports-management/game UI precedent for optional non-authoritative 3D scenes.
> Produce implementation-facing recommendations and lead-architect decision
> questions.

## Source-quality note

Perplexity did not surface authoritative Babylon release, npm or official
documentation sources for the current version claim. It explicitly marked
current-version and sports-management precedent evidence as low-confidence.
This raw capture is therefore discovery input only. FMX-158 source-checked the
actual version and implementation constraints separately in
[[raw-babylon-renderer-stack-source-checks-2026-06-15]].

## Extracted findings

- Treat Babylon.js as the single optional 3D/2.5D presentation engine if
  ADR-0047 remains accepted; keep Three.js/R3F only as historical context.
- Keep the 3D layer non-authoritative: it consumes read-only descriptors and
  never owns match state, rules, RNG, results, or simulation authority.
- Lazy-load Babylon and scene assets only for routes/screens that need optional
  3D; never put it on the PWA baseline path.
- Gate the optional scene by device class, memory/GPU capability,
  `prefers-reduced-motion`, prior scene failure and user intent.
- Keep a first-class 2D/static fallback. If Babylon fails to load, loses GPU
  context, breaches time/memory budgets or targets an unsupported device, the
  app remains fully usable.
- Bundle size is only one risk. Runtime memory, texture upload, GPU frame time,
  thermal throttling and tab eviction are the bigger mobile-PWA risks.
- Suggested telemetry for the implementation phase: engine init success/failure,
  time to first frame, fallback activation, memory warnings and device class.

## Decision questions surfaced

- D1: Is FMX-158 a cleanup under already-accepted ADR-0047, or a re-opening of
  the renderer decision?
- D2: Should all active stale guidance be cleaned now, or only the exact
  08-Crosscutting sentence from the issue?
- D3: Should exact Babylon bundle/memory thresholds be locked now, or should
  current Floor/Standard/Premium budgets stand until implementation-time
  measurement?

## Perplexity citations surfaced

Perplexity returned broad web-stack sources rather than useful Babylon primary
sources:

- <https://mustafafurniturewala.com/writing/tech-stack-recommendations/>
- <https://blog.nobledesktop.com/best-web-development-stacks>
- <https://www.fingent.com/blog/top-7-tech-stacks-that-reign-software-development/>
- <https://dashdevs.com/blog/10-tips-to-choose-tech-stack-for-web-app-development/>
- <https://www.techrepublic.com/forums/discussions/whats-the-best-tech-stack-for-building-scalable-web-apps-in-2025/>
- <https://www.visartech.com/blog/visartech-tech-stack-frontend/>

These links are not used as authoritative FMX-158 evidence.

## Related

- [[../babylon-vs-three-floor-tier-budget-2026-06-15]]
- [[raw-babylon-renderer-stack-source-checks-2026-06-15]]
- [[../../40-Execution/fmx-158-babylon-renderer-stack-decision-queue-2026-06-15]]

