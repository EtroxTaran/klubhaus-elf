---
title: GD-0018 AI Narrative Personas and Dialogue
status: draft
tags: [game-design, gddr, narrative, ai, llm, personas, dialogue]
created: 2026-05-27
updated: 2026-05-27
type: game-design
binding: false
supersedes:
superseded_by:
related:
  - [[README]]
  - [[GD-0013-narrative-inbox]]
  - [[GD-0010-ai-world]]
  - [[../60-Research/ai-narrative-runtime-integration]]
  - [[../60-Research/raw-perplexity/raw-ai-llm-usage]]
  - [[../60-Research/raw-perplexity/raw-character-personality-and-dialogue]]
  - [[../60-Research/narrative-content-pipeline]]
  - [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
---

# GD-0018: AI Narrative Personas and Dialogue

## Status

draft

> Draft only. This record captures the current best design direction for AI
> narrative personas and Runtime-LLM evaluation. It is not implementable until
> Nico approves it and the linked ADR is accepted.

## Date

2026-05-27

## Player experience goal

The player should feel that a save generated *their* football story: recurring
journalists, difficult players, board personalities, fan groups and media arcs
remember what happened and react in ways that feel specific to the world.

## Decided / strong

- **Simulation facts remain authoritative.** AI text may phrase what happened;
  it must never invent injuries, scores, transfers, morale changes, pressure or
  financial facts. Source: [[../60-Research/raw-perplexity/raw-ai-llm-usage]],
  [[../60-Research/narrative-content-pipeline]].
- **Traits may affect gameplay; generated prose may not.** Player,
  journalist, board and fan-rep traits can feed deterministic mechanics. The
  final text string is presentation only. Source:
  [[../60-Research/ai-narrative-runtime-integration]].
- **Dialogue is intent-based, not free chat.** The player chooses from explicit
  intents. Intent plus actor traits drives any morale, trust, pressure or
  transfer-readiness effect. The LLM, if enabled, only phrases lines. Source:
  [[../60-Research/raw-perplexity/raw-character-personality-and-dialogue]].
- **MVP Runtime-LLM candidate is async flavour only.** Candidate surfaces:
  post-match newspaper snippets, injury/event reports, weekly summaries and
  transfer negotiation flavour after the result is fixed. Source:
  [[../60-Research/ai-narrative-runtime-integration]].
- **Press and player talks are future tracks.** They are important for the
  long-term "my story" goal, but are not the first Runtime-LLM candidate due to
  session length, balance, UX, latency and disclosure risk.
- **Template fallback stays mandatory.** Every AI-enhanced line has a
  deterministic local template fallback and the game remains complete without
  provider access.
- **No raw user data or PII goes to LLMs.** User-authored names and free text are
  replaced with placeholders. MVP avoids free-form user input entirely.

## Open

- Whether Runtime-LLM is allowed in MVP at all; see
  [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]].
- Exact persona trait list for players, journalists, board and fan reps.
- Exact mechanics affected by each trait and intent.
- Whether the info/settings-level AI disclosure preference satisfies EU AI Act
  Article 50 for the intended in-game surfaces.
- Final OpenRouter model/provider routing, cost caps and cache policy.
- Content volume targets for async flavour after the deterministic template
  baseline is updated.

## Rationale

The reports align with the existing narrative pipeline on the most important
point: calculation first, narrative second. The new design value is not simply
more text variation; it is coherent world memory. Stable actor personas and
deterministic trait effects make the world feel alive even when LLM output is
disabled.

## Consequences

Positive:

- Stronger long-save identity and better "tell a story about my save" value.
- Reuses the existing inbox, newspaper, event-family and voice-card direction.
- Keeps LLM optional because personas/intents/templates exist without it.

Negative / constraints:

- Adds balancing work for trait and intent effects.
- Adds legal review before Runtime-LLM can ship.
- Requires content and telemetry discipline to avoid repetitive or misleading
  generated narrative.
- Requires strict architecture guards so generated text never becomes gameplay
  state.

## Supersedes

None

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]

## Related

- Research: [[../60-Research/ai-narrative-runtime-integration]] ·
  [[../60-Research/raw-perplexity/raw-ai-llm-usage]] ·
  [[../60-Research/raw-perplexity/raw-character-personality-and-dialogue]] ·
  [[../60-Research/narrative-content-pipeline]]
- Decisions: [[GD-0013-narrative-inbox]] ·
  [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
- [[README]] - Game Design Log
