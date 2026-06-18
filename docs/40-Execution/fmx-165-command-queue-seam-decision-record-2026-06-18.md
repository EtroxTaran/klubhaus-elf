---
title: FMX-165 Command Queue Seam Propagation Decision Record
status: current
tags: [execution, decision-record, fmx-165, offline-sync, pwa, command-queue, accepted]
created: 2026-06-18
updated: 2026-06-18
type: decision-record
binding: false
linear: FMX-165
related:
  - [[../60-Research/adr-0090-command-queue-seam-propagation-2026-06-18]]
  - [[../60-Research/raw-perplexity/raw-adr-0090-command-queue-seam-propagation-2026-06-18]]
  - [[../60-Research/raw-perplexity/raw-adr-0090-command-queue-seam-source-checks-2026-06-18]]
  - [[../10-Architecture/09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[../10-Architecture/09-Decisions/ADR-0119-command-reception-dedup-seam]]
  - [[../10-Architecture/bounded-context-map]]
  - [[../30-Implementation/hybrid-online-pwa-strategy]]
---

# FMX-165 Command Queue Seam Propagation Decision Record

## Context

ADR-0090 is accepted and already mandates the Offline Sync command-queue
migration seam and server-authoritative conflict strategy. ADR-0119 is accepted
and already assigns replay/dedup acceptance to Audit & Security Command
Reception while keeping client queue/retry/rebase UX in Offline Sync.

FMX-165 exists because downstream notes still lag those accepted decisions:
`hybrid-online-pwa-strategy` and `bounded-context-map` describe the command
queue/rebase flow as generic or future-only, and ADR-0090 still carried
pre-ratification body text.

## Decision Recorded

No new architecture/gameplay decision is made in FMX-165.

| ID | Question | Resolution |
|---|---|---|
| D1 | Should FMX-165 reopen ADR-0090 D1/D2? | No. ADR-0090 remains accepted with D1=A thin MVP behind mandatory `CommandQueue` seam and D2=A server-authoritative re-validation + rebase. |
| D2 | Should the bounded-context map change the context count or boundary? | No. FMX-165 updates Offline Sync row/future-scope wording only. Offline Sync remains the client sync/rebase owner; Audit & Security remains replay/dedup owner. |
| D3 | Should the PWA strategy require Background Sync for correctness? | No. Source checks keep Background Sync best-effort only; foreground/open/resume retry remains required. |
| D4 | Should FMX select Replicache or a CRDT library now? | No. Replicache is cited as a pattern precedent; CRDT remains future Watch Party overlay scope only. |

## Applied Contract

- All PWA game-state writes route through `CommandQueue`.
- MVP `CommandQueue` implementation sends synchronously; future durable queue
  persistence is additive.
- Commands carry `commandId`, `expectedVersion` and serializable payload.
- Confirmed client projections carry `lastSeenVersion`.
- Command responses return an accepted new version plus emitted events, or a
  typed rejection/pending state.
- Client rehydration uses server events from `lastSeenVersion`, with future
  snapshot-plus-events optimization allowed.
- Conflicts follow ADR-0090: rehydrate from server truth, revalidate pending
  intent, rebase with fresh `expectedVersion` if legal, otherwise reject with
  inspectable copy.
- CRDT is limited to future Watch Party collaborative overlays.
- Last-write-wins is limited to cosmetic local preferences.

## Evidence

- Raw discovery:
  [[../60-Research/raw-perplexity/raw-adr-0090-command-queue-seam-propagation-2026-06-18]]
- Source checks:
  [[../60-Research/raw-perplexity/raw-adr-0090-command-queue-seam-source-checks-2026-06-18]]
- Synthesis:
  [[../60-Research/adr-0090-command-queue-seam-propagation-2026-06-18]]

## Follow-up

- Future contract work must define the exact Zod/TypeScript command envelope in
  one canonical contract/schema home.
- Future queue implementation must decide queue caps, retry/backoff timings,
  storage quota behavior and conflict-copy strings under the normal Nico gate.
- Future Watch Party overlay work can evaluate CRDTs separately; core game
  commands remain server-authoritative.
