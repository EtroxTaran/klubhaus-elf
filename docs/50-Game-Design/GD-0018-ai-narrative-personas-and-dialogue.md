---
title: GD-0018 AI Narrative Personas and Dialogue
status: draft
tags: [game-design, gddr, narrative, ai, llm, personas, dialogue]
created: 2026-05-27
updated: 2026-06-05
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
  - [[../60-Research/ai-narration-scope-freeze-and-fallback-coverage-2026-06-04]]
  - [[../60-Research/raw-perplexity/raw-ai-narration-scope-freeze-fallback-coverage-2026-06-04]]
  - [[../60-Research/newsworthiness-event-publication-semantics-2026-06-04]]
  - [[../60-Research/raw-perplexity/raw-newsworthiness-event-publication-semantics-2026-06-04]]
  - [[../60-Research/dialogue-intent-taxonomy-effect-matrix-2026-06-05]]
  - [[../60-Research/raw-perplexity/raw-dialogue-intent-taxonomy-effect-matrix-2026-06-05]]
  - [[../60-Research/player-discipline-sub-aggregate-2026-06-05]]
  - [[../60-Research/raw-perplexity/raw-player-discipline-sub-aggregate-2026-06-05]]
  - [[../60-Research/swappable-spatial-event-match-engine-2026-05-27]]
  - [[../60-Research/raw-perplexity/raw-ai-llm-usage]]
  - [[../60-Research/raw-perplexity/raw-character-personality-and-dialogue]]
  - [[../60-Research/narrative-content-pipeline]]
  - [[../60-Research/eos-player-staff-skills-and-personas-2026-05-28]]
  - [[GD-0020-eos-player-skills-personas-and-people]]
  - [[GD-0028-dialogue-intent-taxonomy-effect-matrix]]
  - [[../20-Features/feature-ai-narration-mvp-pillar]]
  - [[../30-Implementation/ai-narration-contract-testing-framework]]
  - [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
  - [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[../10-Architecture/09-Decisions/ADR-0076-narrative-newsworthiness-event-contracts]]
  - [[../10-Architecture/09-Decisions/ADR-0077-player-discipline-suspension-contracts]]
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
- **MVP Runtime-LLM scope is frozen as Broad Full Dialogue.** Candidate
  surfaces: player one-to-one, staff advice/disagreement, board meetings,
  press/journalist questions, fan-rep scenes, post-match newspaper snippets,
  injury/event reports, weekly summaries, transfer/agent flavour after the
  result is fixed, and selected match ticker key-event wording after committed
  facts. Source:
  [[../60-Research/ai-narration-world-and-dialogue-mvp-2026-05-28]].
  FMX-88 freezes this as an MVP surface boundary, not as a provider/model
  decision: optional LLM may phrase prose across these surfaces, but all facts,
  choices, intents and effects remain deterministic.
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
- **Newsworthy football facts arrive as self-contained events.** FMX-83
  proposes that injuries, contract-expiry pressure, board-pressure changes and
  transfer rumours reach Narrative as source-owned published-language payloads
  with display snapshots, source/confidence, salience inputs and decay hints.
  Narrative renders and remembers the story thread; it does not query the
  source context for missing facts or create the fact itself.
- **Template fallback stays mandatory.** Every AI-enhanced line has a
  deterministic local template fallback and the game remains complete without
  provider access.
- **Fallback coverage is CI-manifested.** FMX-88 requires every prose point to
  appear in a `FallbackCoverageManifest` with fallback template, fixture,
  deterministic render test and provenance assertion before runtime LLM release.
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

## FMX-88 frozen MVP line

Nico selected these FMX-88 planning choices on 2026-06-04:

| # | Decision | Choice |
|---|---|---|
| D1 | Runtime-LLM scope | **Broad Full Dialogue:** all active narrative dialogue/prose surfaces may use optional LLM phrasing after deterministic scene selection, facts, intents, options, effects and fallback templates exist. |
| D2 | Fallback coverage | **CI manifest:** every `NarrativeSceneType` / prose point needs fallback template, fixture, deterministic render test and provenance assertion. |
| D3 | Article 50 gate | **Nico + external legal/compliance review:** this GDDR records the release blocker, not the legal conclusion. |
| D4 | Export/share | **No generated-text export/share in MVP:** future export/social/publication policy is a later legal-gated feature. |

Gameplay line:

- LLM can improve the *voice* of player/staff/board/media/fan/agent scenes,
  reports, summaries and selected committed match-ticker lines.
- LLM cannot write player-choice labels, create new choices, determine effects,
  alter morale/pressure/trust/finance/transfer/match/rule facts or generate
  authoritative state.
- If LLM is disabled, offline, over budget, killed, unsafe or invalid, the same
  scene renders through deterministic templates and remains a complete game
  experience.

## FMX-87 dialogue-intent effect line

Nico selected these FMX-87 planning choices on 2026-06-05:

| # | Decision | Choice |
|---|---|---|
| D1 | Surface scope | **Broad MVP:** player, staff, board, press/media, fan-rep and agent surfaces all receive finite `DialogueIntent` coverage. |
| D2 | Effect precision | **Bands:** effect direction and magnitude class are locked here; exact numeric values route to FMX-52 calibration. |
| D3 | Persona influence | **Gate plus bounded scale:** persona/relationship facts may gate availability and explicitly scale effects, but owning domains still resolve the command. |

Draft [[GD-0028-dialogue-intent-taxonomy-effect-matrix]] is the proposed
taxonomy/effect matrix. Its core rule is that Narrative may surface the allowed
intent and phrase it through template/LLM prose, but the primary effect owner
applies the result: Squad & Player for player morale/trust/status, Staff
Operations for staff-resolution facts, Club Management for board pressure and
commitments, Audience & Atmosphere for fan-rep sentiment, Transfer for
agent/transfer readiness and the relevant owning domain for press/media effects.

## Open

- Exact MVP actor counts per world size: outlets, journalists, named fan groups,
  fan reps and agents.
- Exact persona trait list and scale for players, staff, board contacts,
  journalists, fan reps and agents.
- Exact mechanics affected by each trait and intent.
- Exact numeric tuning, caps, cooldowns and decay for dialogue-effect bands
  (FMX-52 calibration).
- Final salience weights, cooldown caps and media-volume rules for newsworthy
  event publication.
- Canonical `PlayerSuspended` schema from
  [[../10-Architecture/09-Decisions/ADR-0077-player-discipline-suspension-contracts]];
  GD-0018 may only consume it for suspension narrative surfaces.
- Exact first-exposure and settings/help disclosure copy, and the legal memo
  that closes the EU AI Act Article 50 release gate.
- Final OpenRouter model/provider routing, cost caps and cache policy.
- Content volume targets for template-only fallback quality across the Full
  Dialogue surfaces.
- Future generated-text export/share policy, if the MVP no-export rule changes.
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
  [[../60-Research/ai-narration-scope-freeze-and-fallback-coverage-2026-06-04]] ·
  [[../60-Research/newsworthiness-event-publication-semantics-2026-06-04]] ·
  [[../60-Research/dialogue-intent-taxonomy-effect-matrix-2026-06-05]] ·
  [[../60-Research/raw-perplexity/raw-ai-llm-usage]] ·
  [[../60-Research/raw-perplexity/raw-character-personality-and-dialogue]] ·
  [[../60-Research/narrative-content-pipeline]]
- Decisions: [[GD-0013-narrative-inbox]] ·
  [[GD-0028-dialogue-intent-taxonomy-effect-matrix]] ·
  [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]] ·
  [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]] ·
  [[../10-Architecture/09-Decisions/ADR-0076-narrative-newsworthiness-event-contracts]]
- Implementation: [[../30-Implementation/ai-narration-contract-testing-framework]]
- [[README]] - Game Design Log
