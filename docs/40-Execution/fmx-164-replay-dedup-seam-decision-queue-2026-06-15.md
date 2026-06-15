---
title: FMX-164 replay/dedup ownership seam decision queue
status: current
tags: [execution, decision-queue, replay-protection, idempotency, offline-sync, audit, accepted, fmx-164]
created: 2026-06-15
updated: 2026-06-15
type: decision-queue
binding: false
linear: FMX-164
related:
  - [[../60-Research/replay-dedup-ownership-seam-offline-sync-vs-audit-2026-06-15]]
  - [[../10-Architecture/09-Decisions/ADR-0119-command-reception-dedup-seam]]
  - [[../10-Architecture/09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[../10-Architecture/09-Decisions/ADR-0091-audit-security-context-definition]]
  - [[../10-Architecture/09-Decisions/ADR-0115-command-integrity-and-replay-protection-posture]]
  - [[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]]
---

# FMX-164 replay/dedup ownership seam decision queue

This is the HITL decision queue for FMX-164. It records Nico's approved choices
for the replay/dedup ownership seam and points to the accepted binding home:
[[../10-Architecture/09-Decisions/ADR-0119-command-reception-dedup-seam]].

## Accepted decisions

| Decision | Nico answer | Recorded in |
|---|---|---|
| D1 - owner | Reception capability: Audit & Security owns replay/dedup policy and processed-command state through a synchronous command-reception capability; Offline Sync owns client queue/rebase UX. | ADR-0119 |
| D2 - duplicate semantics | Cached outcome: same `commandId` + same hash/binding returns the first stored outcome or pending status; mismatched hash/binding rejects before domain validation. | ADR-0119 |
| D3 - artifact shape | Dedicated ADR-0119 seam, with related ADRs amended. | ADR-0119 |

## Key rationale

- Offline Sync is a client UX/resilience owner, not an authoritative security
  source.
- Audit & Security already owns replay-protection/dedup state; FMX-164 makes
  the synchronous command-reception seam explicit.
- Domain contexts still own legal command handling and aggregate invariants.
- ADR-0028 outbox remains the post-commit domain-event publication path and
  domain mutation trail, not the pre-commit duplicate gate.
- Mature API idempotency precedent favors stable request IDs, stored first
  outcomes and mismatch rejection.

## Canonical path

```text
Receive command
-> auth/session binding
-> canonical payload hash
-> commandId dedup/replay gate
-> domain validation
-> expectedVersion / append
-> outbox + security facts
```

## Decision record

- 2026-06-15: FMX-164 selected by Nico after live Linear shortlist.
- 2026-06-15: Linear FMX-164 moved to `In Progress`.
- 2026-06-15: branch/worktree created:
  `codex/fmx-164-replay-dedup-seam`.
- 2026-06-15: Perplexity captures and source checks saved.
- 2026-06-15: Nico approved D1-D3 using the recommended options.
- 2026-06-15: ADR-0119 promoted to accepted/binding and related ADRs/indexes
  patched.

## Related

- [[../60-Research/replay-dedup-ownership-seam-offline-sync-vs-audit-2026-06-15]]
- [[../60-Research/raw-perplexity/raw-replay-dedup-command-reception-2026-06-15]]
- [[../60-Research/raw-perplexity/raw-replay-dedup-source-checks-2026-06-15]]
- [[../10-Architecture/09-Decisions/ADR-0119-command-reception-dedup-seam]]
