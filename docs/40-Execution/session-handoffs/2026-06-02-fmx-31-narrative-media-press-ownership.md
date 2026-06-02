---
title: Handoff FMX-31 Narrative Media and Press Content Ownership
status: wrapped
tags: [meta, execution, handoff, narrative, media, press, fmx-31]
created: 2026-06-02
updated: 2026-06-02
type: handoff
related:
  - [[../../60-Research/narrative-content-bounded-context-2026-06-02]]
  - [[../../10-Architecture/09-Decisions/ADR-0065-narrative-media-press-content-ownership]]
  - [[../../00-Index/Current-State]]
---

# Handoff: FMX-31 Narrative Media and Press Content Ownership (2026-06-02)

## Goals

- Resolve ownership for media / press / narrative-content authoring after
  ADR-0052 (People) and ADR-0054 (Narrative) left residual scope open.
- Keep Notification as delivery/inbox owner and People as persona/context-card
  owner.
- Encode deterministic fallback + optional LLM paraphrase controls for press
  articles and conference response trees.

## Completed

- Ran five Perplexity research passes: genre, DDD ownership, interactive
  narrative authoring, LLM controls and newsroom/CMS workflow.
- Captured Nico's HITL defaults:
  - Narrative extended as owner;
  - Narrative owns publish/conference/tone events;
  - strict deterministic template-first + optional validated LLM paraphrase.
- Added raw research and synthesis notes.
- Added proposed ADR-0065 with options, recommendation, public contract
  direction, determinism/storage/LLM rules and map-patch proposal.
- Anchored Decision-Log, Current-State, Architecture/Research maps and this
  handoff.

## Open Tasks

- Formal Nico ratification of ADR-0054 / ADR-0065 and map-apply.
- Future content-volume planning for initial press storylets, article templates
  and tone variants.
- Later effect-intent taxonomy with Squad & Player, Audience & Atmosphere,
  Club Management, Transfer and People.
- Release/legal review of AI disclosure surface per ADR-0030.

## Decisions Made

- None accepted/binding in this beat.
- Proposed recommendation: ADR-0054 Narrative owns Press/Media content
  authoring; Notification delivers; People supplies persona/context cards.

## Blockers

- ADR-0065 cannot become binding until Nico ratifies it.
- ADR-0054 remains draft; Narrative implementation still gated.

## Durable Notes Updated

- `docs/60-Research/raw-perplexity/raw-narrative-content-bounded-context-2026-06-02.md`
- `docs/60-Research/narrative-content-bounded-context-2026-06-02.md`
- `docs/10-Architecture/09-Decisions/ADR-0065-narrative-media-press-content-ownership.md`
- `docs/00-Index/Decision-Log.md`
- `docs/00-Index/Current-State.md`
- `docs/00-Index/Architecture-Map.md`
- `docs/00-Index/Research-Map.md`
- `docs/60-Research/raw-perplexity/README.md`
- `docs/40-Execution/session-handoffs/README.md`

## Promotion Needed

- If Nico ratifies: flip ADR-0065 to accepted/binding, apply the map patch
  alongside ADR-0054 ratification handling, and move FMX-31 to Done after PR
  merge.
