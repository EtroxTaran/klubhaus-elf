---
title: GD-0018 AI Narrative Personas and Dialogue
status: draft
tags: [game-design, gddr, narrative, ai, llm, personas, dialogue]
created: 2026-05-27
updated: 2026-05-28
type: game-design
binding: false
supersedes:
superseded_by:
related:
  - [[README]]
  - [[GD-0013-narrative-inbox]]
  - [[match-engine]]
  - [[GD-0010-ai-world]]
  - [[../60-Research/ai-narrative-runtime-integration]]
  - [[../60-Research/ai-narration-world-and-dialogue-mvp-2026-05-28]]
  - [[../60-Research/ai-narration-testing-framework-2026-05-28]]
  - [[../60-Research/swappable-spatial-event-match-engine-2026-05-27]]
  - [[../60-Research/raw-perplexity/raw-ai-llm-usage]]
  - [[../60-Research/raw-perplexity/raw-character-personality-and-dialogue]]
  - [[../60-Research/narrative-content-pipeline]]
  - [[../60-Research/eos-player-staff-skills-and-personas-2026-05-28]]
  - [[GD-0020-eos-player-skills-personas-and-people]]
  - [[../20-Features/feature-ai-narration-mvp-pillar]]
  - [[../30-Implementation/ai-narration-contract-testing-framework]]
  - [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
  - [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
---

# GD-0018: AI Narrative Personas and Dialogue

## Status

draft

> Draft only. This record captures the current best design direction for AI
> narrative personas, Full Dialogue and Runtime-LLM evaluation. It is not
> implementable until Nico approves it and the linked ADR is accepted.

## Date

2026-05-27

## Player experience goal

The player should feel that a save generated *their* football story: recurring
journalists, difficult players, board personalities, fan groups and media arcs
remember what happened and react in ways that feel specific to the world.

For the MVP, AI narration is not decorative polish. It is a proposed emotional
pillar: the system should generate enough structured world context that the
first playable can already produce memorable characters, conflicts and media/fan
reactions.

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
- **Persona context cards come from structured People facts.** FMX-23 proposes
  [[GD-0020-eos-player-skills-personas-and-people]] and
  [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  as the source for actor labels, relationship edges, recent facts, allowed
  intents and forbidden claims. Dialogue consumes those cards; it does not own
  persona or relationship state.
- **MVP Runtime-LLM candidate is Full Dialogue plus async flavour.** Candidate
  surfaces: player one-to-one, staff advice/disagreement, board meetings,
  press/journalist questions, fan-rep scenes, post-match newspaper snippets,
  injury/event reports, weekly summaries, transfer/agent flavour after the
  result is fixed, and selected match ticker key-event wording after committed
  facts. Source:
  [[../60-Research/ai-narration-world-and-dialogue-mvp-2026-05-28]].
- **All active actor classes need generated persona context in MVP.** The first
  implementation wave should cover players, staff, board contacts, media
  outlets, journalists, fan segments, named fan groups, fan reps and agents.
  These actors can appear in templates/LLM scenes from the first playable.
- **Match ticker LLM is not match AI.** It may phrase goals, big chances,
  cards, injuries, substitutions, halftime and full-time from the committed
  event log. Routine lines remain template-first. The output never changes the
  event, stat, rating or replay. Source:
  [[../60-Research/swappable-spatial-event-match-engine-2026-05-27]].
- **Fan groups are active story actors, not only aggregate mood.** Fan Ecology
  still owns segment facts, but MVP narrative should generate named fan groups
  and representatives so fan pressure can become personal and repeatable.
- **Media is a generated ecosystem.** Outlets have reach, cadence, reliability,
  audience and editorial stance. Journalists have beat, tone, stance, fairness
  and relationships. The LLM phrases articles/questions; it does not decide
  whether a rumour, scandal or board-pressure event exists.
- **Template fallback stays mandatory.** Every AI-enhanced line has a
  deterministic local template fallback and the game remains complete without
  provider access.
- **No raw user data or PII goes to LLMs.** User-authored names and free text are
  replaced with placeholders. MVP avoids free-form user input entirely.
- **First-exposure disclosure is the draft product posture.** The first AI
  narration/dialogue surface explains that some in-game text is AI-generated;
  settings/help keeps the persistent explanation. Each generated output still
  carries machine-readable provenance.
- **Narrative needs its own context owner.** The draft architecture target is a
  dedicated Narrative context for scenes, templates, context-card assembly,
  validation, provenance, evaluation and provider adapters. People owns
  personhood; Notification owns delivery.
- **Playtest First is the quality posture.** Early MVP narration quality is
  tuned through structured playtests and eval cases before hard numeric quality
  thresholds are frozen. This does not relax the hard state-boundary,
  fallback, safety, privacy or disclosure gates.

## Open

- Exact MVP actor counts per world size: outlets, journalists, named fan groups,
  fan reps and agents.
- Exact persona trait list and scale for players, staff, board contacts,
  journalists, fan reps and agents.
- Exact mechanics affected by each trait and intent.
- Exact `DialogueIntent` taxonomy per surface.
- Whether first-exposure plus central disclosure satisfies EU AI Act Article 50
  for the intended in-game surfaces.
- Final OpenRouter model/provider routing, cost caps and cache policy.
- Content volume targets for template-only fallback quality across the Full
  Dialogue surfaces.
- Final quantitative thresholds for contradiction rate, fallback rate, persona
  drift, repetition and unsafe-output rejection after the first playtest corpus
  establishes a baseline.

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
- Makes media, fan groups, staff and board emotionally present in the MVP rather
  than deferring them to a later narrative pass.

Negative / constraints:

- Adds balancing work for trait and intent effects.
- Adds legal review before Runtime-LLM can ship.
- Requires content and telemetry discipline to avoid repetitive or misleading
  generated narrative.
- Requires strict architecture guards so generated text never becomes gameplay
  state.
- Adds a larger test matrix before MVP because Full Dialogue must be evaluated
  across actor classes and a season-long memory loop.

## Supersedes

None

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
- [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]

## Related

- Research: [[../60-Research/ai-narrative-runtime-integration]] ·
  [[../60-Research/ai-narration-world-and-dialogue-mvp-2026-05-28]] ·
  [[../60-Research/ai-narration-testing-framework-2026-05-28]] ·
  [[../60-Research/raw-perplexity/raw-ai-llm-usage]] ·
  [[../60-Research/raw-perplexity/raw-character-personality-and-dialogue]] ·
  [[../60-Research/narrative-content-pipeline]]
- Decisions: [[GD-0013-narrative-inbox]] ·
  [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]] ·
  [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
- Implementation: [[../30-Implementation/ai-narration-contract-testing-framework]]
- [[README]] - Game Design Log
