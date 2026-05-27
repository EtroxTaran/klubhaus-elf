---
title: Handoff AI Narrative Runtime Integration
status: wrapped
tags: [meta, execution, handoff, ai, narrative]
created: 2026-05-27
updated: 2026-05-27
type: handoff
binding: false
related:
  - [[../../60-Research/ai-narrative-runtime-integration]]
  - [[../../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
  - [[../../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
  - [[../../00-Index/Current-State]]
---

# Handoff: AI Narrative Runtime Integration (2026-05-27)

## Linear

- Issue: none linked in this session.

## Done this session

- Promoted the two narrative/LLM raw reports into a synthesis note:
  [[../../60-Research/ai-narrative-runtime-integration]].
- Added draft GDDR [[../../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
  for personas, intent-based dialogue and Runtime-LLM gameplay boundaries.
- Added draft ADR [[../../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
  for keeping Runtime-LLM outside authoritative state while evaluating async
  narrative flavour.
- Updated maps and summaries so the chain is traceable from research to GDDR to
  ADR.

## Open / next step

- Nico must decide whether ADR-0030 may be accepted for MVP async flavour.
- Legal review must decide whether the central info/settings disclosure
  preference is enough for AI Act Article 50, or whether per-output labels are
  required.
- Game design still needs the exact actor trait list and deterministic effects
  for players, journalists, board and fan reps.

## Blockers

- Runtime-LLM remains blocked until GD-0018 and ADR-0030 are ratified.
- No implementation is authorized by the new draft records.

## Changed vault paths

- `docs/60-Research/ai-narrative-runtime-integration.md`
- `docs/50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue.md`
- `docs/10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state.md`
- `docs/00-Index/Current-State.md`
- `docs/00-Index/Decision-Log.md`
- `docs/00-Index/Architecture-Map.md`
- `docs/00-Index/Game-Design-Map.md`
- `docs/00-Index/Research-Map.md`
- `docs/60-Research/00-summary.md`
- `docs/60-Research/incoming-design-research-2026-05-27.md`
- `docs/60-Research/narrative-content-pipeline.md`
- `docs/60-Research/raw-perplexity/README.md`
- `docs/50-Game-Design/README.md`
- `docs/50-Game-Design/GD-0013-narrative-inbox.md`

## Needs promotion

- GD-0018: draft -> approved only after Nico ratifies persona/intent mechanics.
- ADR-0030: draft -> accepted only after Nico ratifies Runtime-LLM scope and
  legal disclosure review is recorded.
