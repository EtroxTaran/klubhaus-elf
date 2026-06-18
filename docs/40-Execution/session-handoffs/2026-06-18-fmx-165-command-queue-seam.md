---
title: "Session handoff: FMX-165 command queue seam propagation"
status: current
tags: [handoff, fmx-165, offline-sync, pwa, command-queue, conflict-resolution]
created: 2026-06-18
updated: 2026-06-18
type: handoff
binding: false
linear: FMX-165
related:
  - [[../../60-Research/adr-0090-command-queue-seam-propagation-2026-06-18]]
  - [[../fmx-165-command-queue-seam-decision-record-2026-06-18]]
  - [[../../10-Architecture/09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[../../10-Architecture/09-Decisions/ADR-0119-command-reception-dedup-seam]]
  - [[../../30-Implementation/hybrid-online-pwa-strategy]]
  - [[../../10-Architecture/bounded-context-map]]
---

# Session handoff: FMX-165 command queue seam propagation

## Goals

Propagate the accepted ADR-0090 command-queue seam and ADR-0119 replay/dedup
ownership split into downstream map and PWA strategy notes.

## Completed

- Saved raw Perplexity discovery, source checks, synthesis and decision record.
- Updated ADR-0090 body-status wording and historical banner language.
- Updated `hybrid-online-pwa-strategy` with the accepted `CommandQueue`,
  `commandId`, `expectedVersion`, `lastSeenVersion`, event rehydration and
  conflict/rebase posture.
- Updated `bounded-context-map` so Offline Sync shows the current seam while
  durable queue persistence remains future-scope.
- Updated Decision Log, Open Decisions Dossier, Current State, Research Map,
  research summary, raw index and handoff index.

## Open Tasks

- Future contract/schema work must define the exact command envelope once the
  app/packages return.
- Future queue implementation must decide retry/backoff timings, queue caps,
  quota behavior and user-facing conflict copy.
- Future Watch Party overlay work may evaluate CRDT libraries separately.

## Decisions Made

None new. FMX-165 applies accepted ADR-0090 D1=A/D2=A and ADR-0119 D1/D2/D3=A.

## Blockers

None for propagation.

## Durable Notes Updated

- [[../../60-Research/raw-perplexity/raw-adr-0090-command-queue-seam-propagation-2026-06-18]]
- [[../../60-Research/raw-perplexity/raw-adr-0090-command-queue-seam-source-checks-2026-06-18]]
- [[../../60-Research/adr-0090-command-queue-seam-propagation-2026-06-18]]
- [[../fmx-165-command-queue-seam-decision-record-2026-06-18]]
- [[../../10-Architecture/09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]]
- [[../../30-Implementation/hybrid-online-pwa-strategy]]
- [[../../10-Architecture/bounded-context-map]]
- [[../../00-Index/Decision-Log]]
- [[../../00-Index/Open-Decisions-Dossier]]
- [[../../00-Index/Current-State]]
- [[../../00-Index/Research-Map]]
- [[../../60-Research/00-summary]]
- [[../../60-Research/raw-perplexity/README]]

## Promotion Needed

No ADR/GDDR promotion is needed. ADR-0090 and ADR-0119 are already accepted;
FMX-165 only propagates their accepted contract.
