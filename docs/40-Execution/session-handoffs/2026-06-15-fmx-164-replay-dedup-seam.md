---
title: Handoff - FMX-164 replay/dedup ownership seam
status: promoted
tags: [meta, execution, handoff, replay-protection, idempotency, offline-sync, audit, fmx-164]
created: 2026-06-15
updated: 2026-06-15
type: handoff
binding: false
linear: FMX-164
related:
  - [[../../60-Research/replay-dedup-ownership-seam-offline-sync-vs-audit-2026-06-15]]
  - [[../../10-Architecture/09-Decisions/ADR-0119-command-reception-dedup-seam]]
  - [[../fmx-164-replay-dedup-seam-decision-queue-2026-06-15]]
---

# Handoff: FMX-164 replay/dedup ownership seam (2026-06-15)

## Linear

- Issue: FMX-164

## Done this session

- Claimed FMX-164 and moved it to `In Progress`.
- Created branch/worktree `codex/fmx-164-replay-dedup-seam`.
- Captured Perplexity first-pass research and source checks.
- Recorded Nico's approved D1-D3 packet in the decision queue.
- Added accepted/binding ADR-0119 for the command-reception replay/dedup seam.
- Patched related ADRs and front-door vault notes.

## Open / next step

- Code-phase follow-up: define processed-command schema, response replay
  envelope and idempotency/security tests when command APIs are authored.

## Blockers

- None for this docs packet.

## Changed vault paths

- `docs/60-Research/raw-perplexity/raw-replay-dedup-command-reception-2026-06-15.md`
- `docs/60-Research/raw-perplexity/raw-replay-dedup-source-checks-2026-06-15.md`
- `docs/60-Research/replay-dedup-ownership-seam-offline-sync-vs-audit-2026-06-15.md`
- `docs/10-Architecture/09-Decisions/ADR-0119-command-reception-dedup-seam.md`
- `docs/40-Execution/fmx-164-replay-dedup-seam-decision-queue-2026-06-15.md`
- `docs/40-Execution/session-handoffs/2026-06-15-fmx-164-replay-dedup-seam.md`
- Related ADRs/indexes patched for the new seam.

## Needs promotion

- None. Durable outcome promoted into ADR-0119, Current-State, Decision-Log,
  Architecture-Map and Research Summary in this packet.
