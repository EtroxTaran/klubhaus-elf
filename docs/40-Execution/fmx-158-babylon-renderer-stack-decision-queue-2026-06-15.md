---
title: "FMX-158 Babylon renderer stack cleanup decision queue"
status: current
tags: [execution, decision-queue, renderer, babylon, fmx-158]
created: 2026-06-15
updated: 2026-06-15
type: decision-log
binding: false
linear: FMX-158
related:
  - [[../60-Research/babylon-vs-three-floor-tier-budget-2026-06-15]]
  - [[../10-Architecture/08-Crosscutting]]
  - [[../10-Architecture/09-Decisions/ADR-0047-babylon-3d-presentation-engine]]
---

# FMX-158 Babylon renderer stack cleanup decision queue

## Context

FMX-158 addresses stale active-doc text that still named Three.js/R3F as the
only optional 3D presentation stack after ADR-0047 accepted Babylon.js.

Nico selected FMX-158 on 2026-06-15 and instructed implementation of the
proposed plan. No ADR/GDDR status or binding metadata changes in this beat.

## Decisions applied

| ID | Question | Applied answer | Rationale |
|---|---|---|---|
| D1 | Is this a consistency cleanup or a renderer re-confirmation? | Consistency cleanup under accepted ADR-0047. | ADR-0047 is already accepted; source checks found no reason to reopen it. |
| D2 | Clean only the exact line or all active stale renderer guidance? | Clean active stale guidance. | Single-source-of-truth requires front doors and crosscutting rules to agree. |
| D3 | Lock exact Babylon bundle/memory thresholds now? | No. Keep current budgets and defer measured thresholds to implementation. | The repo is docs-only; real bundle/runtime numbers require the future app and scene assets. |

## Recommendations carried forward

- First code-phase Babylon adoption must re-check latest stable version and pin
  exact package versions at that time.
- Babylon must be loaded only through a lazy optional path, never the baseline
  app shell.
- The first 3D scene spike must measure bundle, time-to-first-frame, frame time,
  texture/GPU memory and fallback rates on the accepted device matrix.
- A disabled or failed 3D path must never change simulation outcomes.

## Related

- [[../60-Research/babylon-vs-three-floor-tier-budget-2026-06-15]]
- [[../10-Architecture/08-Crosscutting]]
- [[../10-Architecture/09-Decisions/ADR-0047-babylon-3d-presentation-engine]]

