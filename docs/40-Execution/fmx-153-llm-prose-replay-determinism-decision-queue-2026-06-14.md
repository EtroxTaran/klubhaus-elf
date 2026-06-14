---
title: FMX-153 LLM prose replay determinism decision queue
status: current
tags: [execution, decision-queue, ai, llm, narrative, replay, determinism, fmx-153]
created: 2026-06-14
updated: 2026-06-14
type: decision-queue
binding: false
linear: FMX-153
related:
  - [[../60-Research/llm-prose-replay-determinism-floor-2026-06-14]]
  - [[../10-Architecture/09-Decisions/ADR-0117-narrative-display-snapshot-replay-determinism-floor]]
  - [[../30-Implementation/ai-narration-contract-testing-framework]]
---

# FMX-153 LLM prose replay determinism decision queue

This is the HITL decision record for FMX-153. Unlike draft queues that still
await approval, this queue records the options presented to Nico and the
selected outcomes that were promoted into accepted ADR-0117.

## D1 - replay text invariant

| Option | Meaning | Assessment |
|---|---|---|
| **A. Exact Snapshot** | Persist every player-visible revisitable Template/LLM line as exact display text plus provenance; replay/reopen renders it verbatim. | **Selected. Recommended.** Best for trust, audit, offline replay and provider independence. |
| B. Regenerate from prompt/model/cache metadata | Store prompt/model/cache fields and try to reproduce old LLM prose on demand. | Rejected; seed/cache fields are not durable output history. |
| C. Template-only replay | Store only facts/template IDs and replay deterministic fallback wording. | Rejected as primary; kept as recovery when a snapshot is missing/corrupt. |

**Decision:** A.

## D2 - storage home

| Option | Meaning | Assessment |
|---|---|---|
| **A. Per-save Narrative log** | Narrative owns `NarrativeDisplaySnapshot` / provenance records in per-save storage and references source facts/events. | **Selected. Recommended.** Matches ADR-0054 ownership and ADR-0027 per-save persistence. |
| B. Match event log | Store match commentary prose inside match events. | Rejected; presentation would pollute match authority. |
| C. Save envelope top-level field | Add a dedicated envelope field for generated prose. | Rejected for this beat; export/envelope shape remains separate. |

**Decision:** A.

## D3 - match boundary

| Option | Meaning | Assessment |
|---|---|---|
| **A. Commentary Artifact** | `CommentaryLine` / ticker prose is a Narrative display artifact over committed match events, not match state. | **Selected. Recommended.** Keeps ADR-0026 and replay hashes intact. |
| B. MatchFrame extension | Commentary is part of the derived frame. | Rejected; `MatchFrame` is ephemeral and non-persisted. |
| C. Match event payload | Commentary text becomes replay-bearing match event data. | Rejected; generated prose must never become simulation truth. |

**Decision:** A.

## Decision record

- 2026-06-14: FMX-153 selected from the live Linear shortlist.
- 2026-06-14: FMX-153 moved from `Backlog` to `In Progress`.
- 2026-06-14: branch/worktree created:
  `codex/fmx-153-llm-prose-replay-determinism`.
- 2026-06-14: Perplexity-first research and targeted source checks saved.
- 2026-06-14: Nico approved the recommended D1-D3 packet by selecting
  A/A/A in the HITL plan prompt.
- 2026-06-14: accepted
  [[../10-Architecture/09-Decisions/ADR-0117-narrative-display-snapshot-replay-determinism-floor|ADR-0117]]
  promoted the selected floor.

## Accepted approval packet

Approved **D1=A, D2=A, D3=A**:

- exact snapshot for visible/revisitable prose;
- per-save Narrative-owned snapshot/provenance store;
- match commentary as Narrative artifact, not `MatchFrame` or replay-bearing
  match state.

## Related

- [[../60-Research/llm-prose-replay-determinism-floor-2026-06-14]]
- [[../10-Architecture/09-Decisions/ADR-0117-narrative-display-snapshot-replay-determinism-floor]]
- [[../30-Implementation/ai-narration-contract-testing-framework]]
