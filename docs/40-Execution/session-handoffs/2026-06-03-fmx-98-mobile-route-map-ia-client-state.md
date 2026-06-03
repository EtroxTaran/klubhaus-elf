---
title: Handoff FMX-98 Mobile route map, IA & client-state (ratify ADR-0008)
status: wrapped
tags: [meta, execution, handoff, ui-ux, mobile, ia, client-state, worker, fmx-98]
created: 2026-06-03
updated: 2026-06-03
related:
  - [[../../60-Research/mobile-route-map-ia-and-client-state-2026-06-03]]
  - [[../../60-Research/raw-perplexity/raw-mobile-route-map-ia-and-client-state-2026-06-03]]
  - [[../../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]]
  - [[../../50-Game-Design/GD-0016-mobile-ux-loop]]
  - [[../../10-Architecture/09-Decisions/ADR-0021-revised-tech-stack]]
---

# Handoff: FMX-98 Mobile route map, IA & client-state (2026-06-03)

## Goals

- Lock the mobile route map + IA, the client-state pattern (modal drafts,
  optimistic UI, worker bridge), and ratify ADR-0008 — unblocking the player-facing
  lane (FMX-99 onboarding, FMX-100 match controls).
- Ground every choice in 2026 best practice + real football-manager-game precedent.
- Resolve the live GD-0016 ("no Redux/Zustand") ↔ ADR-0021 ("Zustand v5") contradiction.
- Keep all architecture choices behind Nico's ask-first gate.

## Completed

- Synced `main` and created branch `claude/fmx-98-mobile-route-map-ia-client-state`.
- Claimed Linear FMX-98 by moving it to `In Progress`.
- Confirmed the **blocker chain**: FMX-99 (onboarding) is `blockedBy` FMX-98; FMX-98
  unblocks FMX-99 + FMX-100 — so FMX-98 was taken first (Nico's call).
- Read the binding constraints (3 parallel Explore passes): GD-0016, ADR-0008/0010/0021/
  0025/0020/0018/0005, onboarding-strategy, performance-budgets, bounded-context-map,
  match-engine-simulation-model — surfaced the **GD-0016↔ADR-0021 Zustand contradiction**.
- Ran 3 grounded Perplexity queries (nav IA + competitor-game survey; React/TanStack
  client-state + optimistic/draft lifecycle; Comlink-vs-postMessage worker bridge +
  topology); verified Comlink via context7. Archived raw:
  [[../../60-Research/raw-perplexity/raw-mobile-route-map-ia-and-client-state-2026-06-03]].
- Added synthesis: [[../../60-Research/mobile-route-map-ia-and-client-state-2026-06-03]].
- Put **D1–D3** to Nico with sourced options + recommendations; Nico answered **A,A,A**.
- Ratified [[../../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]]
  (`draft → accepted` / `binding: true`; banners removed): Decision/Alternatives/
  Consequences for D1–D3, MVP route map, accessibility checklist, client-state model +
  the Resilient & Optimistic UI contract, worker-bridge contract, invariants + verification.
- Reconciled [[../../50-Game-Design/GD-0016-mobile-ux-loop]] (R2-07 + R2-17 resolved;
  Zustand line reworded; R2-16 left open → FMX-100) and
  [[../../10-Architecture/09-Decisions/ADR-0021-revised-tech-stack]] (Zustand scope note).
- Anchored Current-State, Decision-Log (ADR-0008 row → accepted), Research-Map and the raw
  Perplexity index.

## Open Tasks

- Open the FMX-98 docs PR; let `docs-check` + `linear-id` gates verify; auto-merge on green.
- Move Linear FMX-98 to `In Review` after the PR exists.

## Decisions made

- **D1 = A:** bottom-nav hybrid (4–5 tabs + Club/More bottom-sheet + Home task-hub).
- **D2 = A:** layered client state + a narrow Zustand v5 client-only slice (resolves the
  GD-0016↔ADR-0021 contradiction: no Redux, no server-state god-store; client-only slice OK).
- **D3 = A:** hybrid worker bridge (Comlink control-plane + `postMessage` event stream) +
  separate dedicated deterministic engine worker; OffscreenCanvas main-thread at MVP.

## Blockers

- None. (R2-16 match-controls/rendering is out of scope by design → FMX-100.)

## Durable notes updated

- `docs/60-Research/raw-perplexity/raw-mobile-route-map-ia-and-client-state-2026-06-03.md`
- `docs/60-Research/mobile-route-map-ia-and-client-state-2026-06-03.md`
- `docs/10-Architecture/09-Decisions/ADR-0008-mobile-first-ui.md`
- `docs/50-Game-Design/GD-0016-mobile-ux-loop.md`
- `docs/10-Architecture/09-Decisions/ADR-0021-revised-tech-stack.md`
- `docs/00-Index/Current-State.md`
- `docs/00-Index/Decision-Log.md`
- `docs/00-Index/Research-Map.md`
- `docs/60-Research/raw-perplexity/README.md`

## Next step

Commit, push and open the FMX-98 docs PR (`Closes FMX-98`). Move Linear FMX-98 to
`In Review` after the PR exists. Follow-ups now unblocked: FMX-99 (onboarding 60-s flow),
FMX-100 (match rendering + in-match controls, R2-16).
