---
title: Feature - EOS Player Skills and People Context
status: draft
tags: [feature, player-skills, people, persona, mvp, fmx-23]
created: 2026-05-28
updated: 2026-05-28
type: feature
binding: false
linear: FMX-23
related:
  - [[README]]
  - [[../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]]
  - [[../60-Research/eos-player-staff-skills-and-personas-2026-05-28]]
  - [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[feature-roguelite-mvp-first-playable]]
  - [[feature-player-lifecycle]]
  - [[feature-training-medicine]]
---

# Feature - EOS Player Skills and People Context

## User story

As a manager, I want players and staff to have recognizable strengths,
weaknesses, relationships and story context, so that squad decisions and
dialogues feel personal without turning the game into an attribute spreadsheet.

## MVP scope

In scope for the first active slice:

- Player skill/perk profile as a visible layer separate from attributes.
- Small player-only MVP skill catalog, names and effects still draft.
- Skill acquisition signals from training, mentoring and match evidence.
- Deterministic skill snapshots for match/tactic consumption.
- Persona context cards for players and staff as structured template/LLM input.
- Relationship provenance for mentoring/trust/conflict as planning model.
- UI copy that explains skills as specializations, not raw power.

In scope as target model, not MVP-active gameplay:

- Staff skill/perk cards.
- Board, journalist and fan-rep persona depth.
- Relationship graph UI beyond focused mentoring/dialogue contexts.
- Runtime LLM prose using the context cards.

Out of scope:

- Expanding the 16+4+8 attribute schema.
- Global OVR or universal star rating.
- Generated prose mutating state.
- Persistent competitive multiplayer advantages from perks.
- Final staff-skill balancing.
- Full media/press-conference implementation.

## Gherkin scenarios

```gherkin
Feature: EOS player skills and people context

  Scenario: Player card separates attributes and skills
    Given a player has 16+4+8 attributes
    And the player has a visible skill profile
    When I open the player card
    Then the skill is shown as a specialization
    And the attribute grid is not expanded

  Scenario: Skill snapshot is locked before a match
    Given a player has an active skill profile
    When I confirm the line-up and tactic
    Then the match receives a PlayerSkillProfileSnapshot
    And later skill changes do not alter that match

  Scenario: Skill acquisition uses evidence
    Given a player trains in a matching focus
    And match events repeatedly show the behavior
    And a mentor supports the same pattern
    When the weekly development pass resolves
    Then the system may create a skill candidate
    But it does not expose a grind checklist by default

  Scenario: Dialogue consumes structured context
    Given a player is unhappy about playing time
    And the player has a relationship history with the manager
    When a dialogue context card is built
    Then it contains authoritative facts, persona labels and allowed intents
    And it forbids inventing injuries, transfers, promises or results
```

## Acceptance criteria

- Documentation distinguishes attributes, tendencies, skills/perks, persona
  substrate and relationships.
- MVP skill/perk slice is player-focused.
- Staff skills are modeled as future target without accidental MVP scope
  expansion.
- Match, Training and Squad ownership stays clear.
- Any optional LLM path remains ADR-0030-compatible.
- `pnpm docs:check` passes after the vault update.

## Related

- [[../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]]
- [[../60-Research/eos-player-staff-skills-and-personas-2026-05-28]]
- [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
- [[feature-roguelite-mvp-first-playable]]
- [[feature-player-lifecycle]]
- [[feature-training-medicine]]
