---
title: FMX-153 LLM prose replay determinism handoff
status: current
tags: [execution, handoff, ai, llm, narrative, replay, determinism, fmx-153]
created: 2026-06-14
updated: 2026-06-14
type: handoff
binding: false
linear: FMX-153
related:
  - [[../../60-Research/llm-prose-replay-determinism-floor-2026-06-14]]
  - [[../../10-Architecture/09-Decisions/ADR-0117-narrative-display-snapshot-replay-determinism-floor]]
  - [[../fmx-153-llm-prose-replay-determinism-decision-queue-2026-06-14]]
---

# FMX-153 LLM prose replay determinism handoff

## Goals

- Define the minimum deterministic replay/reopen contract for generated
  Narrative prose.
- Preserve Perplexity research, source checks, Nico decisions and canonical
  vault updates.
- Clarify ADR-0026 / ADR-0030 / ADR-0054 / ADR-0065 without reopening match
  state authority.

## Completed

- Synced `main`, claimed FMX-153 in Linear and created branch/worktree
  `codex/fmx-153-llm-prose-replay-determinism`.
- Ran Perplexity-first research for LLM replay determinism, game precedent and
  source checks.
- Recorded Nico's selected packet D1/D2/D3 = A/A/A.
- Added synthesis
  [[../../60-Research/llm-prose-replay-determinism-floor-2026-06-14]].
- Added accepted/binding
  [[../../10-Architecture/09-Decisions/ADR-0117-narrative-display-snapshot-replay-determinism-floor]].
- Amended ADR-0026, ADR-0030, ADR-0054 and ADR-0065 so canonical notes point
  at the exact snapshot floor.
- Extended
  [[../../30-Implementation/ai-narration-contract-testing-framework]] with the
  replay/reopen suite.

## Open Tasks

- Code-phase implementation must add the actual `NarrativeDisplaySnapshot`
  schemas, storage and tests when Narrative code exists.
- Export/import fixture is implementation-gated until save export scope returns.
- Any future regenerate/editorial repair feature must create new
  snapshots/versions with recorded supersession.

## Decisions Made

- D1=A: exact persisted display snapshot for visible/revisitable Template/LLM
  prose.
- D2=A: per-save Narrative log owns snapshot/provenance storage.
- D3=A: commentary is a Narrative artifact over committed match events, not
  `MatchFrame` or match authority.

## Blockers

None for the docs packet.

## Durable Notes Updated

- [[../../60-Research/llm-prose-replay-determinism-floor-2026-06-14]]
- [[../../10-Architecture/09-Decisions/ADR-0117-narrative-display-snapshot-replay-determinism-floor]]
- [[../fmx-153-llm-prose-replay-determinism-decision-queue-2026-06-14]]
- [[../../10-Architecture/09-Decisions/ADR-0026-match-frame-contract]]
- [[../../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
- [[../../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
- [[../../10-Architecture/09-Decisions/ADR-0065-narrative-media-press-content-ownership]]
- [[../../30-Implementation/ai-narration-contract-testing-framework]]
- [[../../00-Index/Current-State]]
- [[../../00-Index/Decision-Log]]
- [[../../00-Index/Research-Map]]
- [[../../60-Research/00-summary]]
- [[../../60-Research/raw-perplexity/README]]

## Promotion Needed

None. ADR-0117 is accepted/binding from Nico's FMX-153 selections.
