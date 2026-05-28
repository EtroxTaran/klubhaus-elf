---
title: Feature - AI Narration MVP Pillar
status: draft
tags: [feature, ai, llm, narrative, dialogue, mvp, fmx-3]
created: 2026-05-28
updated: 2026-05-28
type: feature
binding: false
linear: FMX-3
related:
  - [[README]]
  - [[../60-Research/ai-narration-world-and-dialogue-mvp-2026-05-28]]
  - [[../60-Research/ai-narrative-runtime-integration]]
  - [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
  - [[../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]]
  - [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
  - [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[feature-eos-player-skills-and-people-context]]
  - [[feature-fan-ecology-ui]]
---

# Feature - AI Narration MVP Pillar

## User story

As a manager, I want the MVP world to feel alive through recurring players,
staff, board contacts, media voices, fan groups and agents, so that each save
creates emotional storylines without the AI ever changing the simulation facts.

## MVP scope

In scope for the first active narration slice:

- Deterministic generation of active narrative actors: players, staff, board
  contacts, media outlets, journalists, fan segments, named fan groups, fan
  reps and agents.
- `NarrativeContextCard` assembly from authoritative facts, People/persona
  context, relationship edges, recent narrative memory, allowed intents and
  forbidden claims.
- Full controlled dialogue surfaces: player one-to-one, staff advice,
  board meeting, press/journalist question, fan-rep scene and agent flavour.
- Async narrative surfaces: post-match report/newspaper, injury/event report,
  weekly summary and selected match ticker key-event wording.
- Complete deterministic template fallback for every surface.
- Runtime LLM enhancement behind feature flags, budget caps, provider
  validation, fact checks, safety checks and kill switch.
- First-exposure AI disclosure plus central settings/help explanation and
  machine-readable provenance on generated outputs.
- Evaluation corpus for fact consistency, persona consistency, repetition,
  safety, latency, fallback rate and cost.

Out of MVP scope:

- Free-form player chat.
- LLM-driven tactics, transfers, finance, match simulation, board decisions,
  fan mood or relationship changes.
- Provider calls from the browser client.
- Export/share of AI-generated text unless a provenance and visible-disclosure
  policy is explicitly ratified.
- Per-output visible AI labels by default; legal review may still require them.

## Gherkin scenarios

```gherkin
Feature: AI narration MVP pillar

  Scenario: Player talk uses intent, not generated text
    Given a player is unhappy about playing time
    And a NarrativeContextCard lists allowed intents
    When I choose a reassurance intent
    Then morale and trust effects are computed from the intent and player facts
    And the generated wording does not affect the result

  Scenario: Journalist cannot invent facts
    Given a journalist asks about a 1-0 win
    When the LLM returns a quote claiming a 2-0 win
    Then the fact validator rejects the output
    And the deterministic fallback template is shown

  Scenario: Fan rep is generated from fan ecology
    Given the Ultras segment mood is low after a ticket-price decision
    When a fan-rep scene is selected
    Then the fan rep references only authoritative segment facts
    And any pressure effect comes from Fan Ecology and the chosen intent

  Scenario: Provider unavailable
    Given Runtime-LLM is enabled
    And the provider times out
    When the post-match report renders
    Then the template report is shown immediately
    And provenance records source template and fallback reason timeout

  Scenario: First AI exposure is disclosed
    Given the user has not seen AI narration disclosure
    When the first AI-enhanced narrative surface opens
    Then the UI shows the first-exposure AI notice
    And settings keep a persistent AI information surface
```

## Acceptance criteria

- MVP scope explicitly includes Full Dialogue and All Active actor context.
- Every LLM surface has a deterministic fallback template.
- Generated prose is never parsed into authoritative state or command payloads.
- Prompt payloads exclude clear user data, PII, secrets, raw free text and
  unmasked user-authored names.
- Provider/model selection remains gated by ADR-0030, docs verification and
  Nico approval.
- `pnpm docs:check` passes after the vault update.

## Related

- [[../60-Research/ai-narration-world-and-dialogue-mvp-2026-05-28]]
- [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
- [[../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]]
- [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
- [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
- [[feature-eos-player-skills-and-people-context]]
- [[feature-fan-ecology-ui]]
