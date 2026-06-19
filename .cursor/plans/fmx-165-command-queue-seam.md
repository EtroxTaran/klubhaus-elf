---
title: FMX-165 Command Queue Seam Propagation Plan
status: current
tags: [plan, fmx-165, offline-sync, pwa, command-queue, conflict-resolution]
created: 2026-06-18
updated: 2026-06-18
type: plan
binding: false
linear: FMX-165
related:
  - [[../../docs/10-Architecture/09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[../../docs/10-Architecture/09-Decisions/ADR-0119-command-reception-dedup-seam]]
  - [[../../docs/30-Implementation/hybrid-online-pwa-strategy]]
  - [[../../docs/10-Architecture/bounded-context-map]]
  - [[../../docs/60-Research/adr-0090-command-queue-seam-propagation-2026-06-18]]
---

# FMX-165 Command Queue Seam Propagation Plan

## Goal

Propagate the already accepted ADR-0090 command-queue seam and conflict strategy
into the downstream implementation and context-map notes that still describe the
seam as future/generic.

## Scope

- Preserve Perplexity-first discovery and source checks.
- Keep ADR-0090's accepted D1=A and D2=A unchanged.
- Update `hybrid-online-pwa-strategy`, `bounded-context-map`, ADR-0090 wording,
  Decision Log, Current State and research front doors.
- Record that FMX-165 makes no new architecture/gameplay decision.

## Execution

1. Sync from current `origin/main`; claim FMX-165; create
   `codex/fmx-165-command-queue-seam`.
2. Source-check the propagation model against Replicache, MDN Background Sync,
   Dexie, Microsoft Event Sourcing, Yjs and Fowler bounded-context guidance.
3. Save raw research, source checks, synthesis, decision record and handoff.
4. Patch canonical downstream notes so the accepted seam is visible in the map
   and current PWA strategy.
5. Validate with `pnpm docs:check`, `node scripts/status-consistency-check.mjs`
   and `git diff --check`.

## Acceptance

- PWA strategy names `CommandQueue`, `commandId`, `expectedVersion`,
  `lastSeenVersion`, command-oriented API, event rehydration and ADR-0090's
  server-authoritative rebase strategy.
- Bounded-context map shows Offline Sync as the client queue/retry/rebase owner
  without moving server replay/dedup out of Audit & Security.
- ADR-0090 no longer says the context-map row did not need any downstream
  propagation.
- No new decision is self-ratified; this is propagation of accepted ADR-0090
  and ADR-0119.
