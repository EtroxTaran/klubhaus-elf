---
title: GD-0021 Player and Staff Development and Decision Influence
status: accepted
tags: [game-design, gddr, player-development, staff, transfers, skills, fmx-38]
created: 2026-05-28
updated: 2026-06-15
type: game-design
binding: false
supersedes:
superseded_by:
related:
  - [[README]]
  - [[GD-0003-squad-players]]
  - [[GD-0005-training]]
  - [[GD-0006-transfers]]
  - [[GD-0007-youth]]
  - [[GD-0020-eos-player-skills-personas-and-people]]
  - [[GD-0027-hidden-attribute-substrate-mapping]]
  - [[squad-and-club-structure]]
  - [[youth-academy-and-development]]
  - [[training-load-and-medicine]]
  - [[scouting-and-recruitment]]
  - [[transfer-market-and-contracts]]
  - [[tactics-system]]
  - [[../60-Research/player-staff-development-decision-model-2026-05-28]]
  - [[../60-Research/eos-player-staff-skills-and-personas-2026-05-28]]
  - [[../60-Research/staff-skill-mvp-scope-2026-06-15]]
  - [[../60-Research/hidden-attribute-reveal-owner-reconciliation-2026-06-14]]
  - [[../60-Research/systemic-events-player-development-venue-ops]]
  - [[../60-Research/player-strength-presentation]]
  - [[../60-Research/transfer-market-simulation]]
  - [[../20-Features/feature-eos-player-skills-and-people-context]]
  - [[../20-Features/feature-player-lifecycle]]
  - [[../20-Features/feature-training-medicine]]
  - [[../20-Features/feature-transfer-market-ai-and-contracts]]
  - [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]]
---

# GD-0021: Player and Staff Development and Decision Influence

## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `draft`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

> **History (pre-ratification banner, demoted 2026-06-11 per ADR-0092 / FMX-143; reconciled
> 2026-06-14 by FMX-154):** This record proposed the canonical factor-matrix layer for
> how player, staff and People-context facts influence gameplay and transfer decisions.
> The current `accepted` frontmatter/body status is the single source of truth.

## Date

2026-05-28

## Player experience goal

Squad and staff decisions should feel causal: the manager understands why a
player develops, stalls, wants to move, fits a role, resists a transfer, or
benefits from a specific coach. The game should explain trade-offs without
turning people into a single overall number or hiding everything behind black
box modifiers.

## Decided / strong

- **Keep 16+4+8 as the player attribute basis.** Visible attributes, GK extras
  and hidden meta remain the base capability model from [[../60-Research/data-generators]]
  and [[tactics-system]]. Skills/personas do not expand it.
- **No global OVR.** Player choice, scouting, transfer and squad views use
  Impact Lens, role/tactic context, ranges and explanations.
- **Separate layers stay separate.** Attributes measure football capability;
  tendencies influence action choice; skills/perks apply bounded effects when a
  declared trigger fires; OCEAN/persona supports social consistency and dialogue;
  relationships provide provenance-backed context.
- **Use factor matrices before formulas.** This GDDR names factors, owners,
  consumers and affected decisions. It does not approve numeric weights,
  thresholds, tier names, caps or decay values.
- **Domain ownership stays intact.** Squad & Player owns player base facts,
  Training owns training/load/development signals, Transfer owns negotiations
  and valuation, Staff Operations owns staff lifecycle/pipeline coverage, and
  People owns persona, relationships and skill profiles per accepted ADR-0052.
- **Generated prose is presentation only.** Narrative or LLM phrasing never
  creates relationship deltas, promises, transfer facts, injuries, development
  deltas, match effects or economy facts.
- **Player skills are the first active skill slice per accepted GD-0020.**
  They are visible specialisations, not attributes and not mandatory meta-builds.
- **Staff skills are re-opened as an MVP decision.** The recommended planning
  option is narrow staff pipeline modifiers, but this requires Nico approval.

## Phase model

| Layer | MVP foundation | MVP decision gate | Post-MVP planned |
|---|---|---|---|
| Player attributes and hidden meta | Active base model | None | Further tuning only |
| Impact Lens and scouting ranges | Active presentation model | None | More role weights and expert explanations |
| Weekly player development | Active foundation | Final formula/caps later | Deeper loans and long-save tuning |
| Player skills/perks | Accepted active slice | Catalog, caps, snapshot policy | Larger catalog and deeper acquisition |
| Staff Operations | Active context | None | Staff continuity/turnover depth |
| Staff skills | Target model | Option A/B/C below | Full staff skill UI/catalog if approved |
| People/persona/relationships | Accepted context and narration input | Relationship mechanics depth gates | Deeper relationship UI and agent game |
| Transfer decision influence | Active foundation | People read-model bridge | Richer agent and media pressure |

## Factor matrices

### Player development

| Factor | Owner | Consumer | Influence | Phase |
|---|---|---|---|---|
| Age phase and PA curve | Squad & Player / generation | Squad & Player, Training | Growth pace, ceiling, decline | MVP foundation |
| Training focus/intensity | Training | Training | Development direction and fatigue trade-off | MVP foundation |
| Staff pipeline quality | Staff Operations | Training | Training quality and specialist support | MVP hook |
| Match minutes and level | Match / League | Squad & Player, Training | Readiness, evidence, learning pressure | MVP foundation |
| Role fit and tactic familiarity | Tactics / Training | Training, Squad & Player | Role learning and explanation tags | MVP foundation |
| Morale and role happiness | Squad & Player | Training, Transfer | Development efficiency and sell/player-terms pressure | MVP foundation |
| Health and injury history | Squad & Player | Squad & Player, Transfer | Growth suppression, availability, market risk | MVP foundation |
| Hidden meta labels | People derivation truth + Scouting reveal gate + Squad & Player banded presentation | Training, Scouting, Transfer | Professionalism, pressure, adaptability, consistency | MVP foundation |
| Mentoring relationship | People + Training/Squad facts | Squad & Player, Training | Slow hidden-meta/tendency influence | MVP hook |
| Skill acquisition evidence | Training, Match, People | People | Player skill candidate creation | MVP player-skill slice |
| Loan environment | Transfer / League | Squad & Player | Development, integration, risk | Post-MVP depth |

### Match, tactics and player selection

| Factor | Owner | Consumer | Influence | Phase |
|---|---|---|---|---|
| Visible attributes | Squad & Player | Match, Impact Lens | Base football outcomes and role fit | MVP foundation |
| Position, role, duty, instructions | Tactics / Match setup | Match | Eligibility, action selection, shape | MVP foundation |
| Tendencies | Squad & Player / Training evidence | Match | Action-choice probabilities | MVP foundation |
| PlayerSkillProfileSnapshot | People | Match | Bounded trigger effects locked at line-up/tactic lock | MVP player-skill slice |
| Tactical familiarity | Training / Tactics | Match | Shape correctness and execution | MVP foundation |
| Fatigue/readiness/sharpness | Training + Squad & Player | Match, Impact Lens | Availability and current performance projection | MVP foundation |
| Leadership/captaincy | Squad & Player + People labels | Squad & Player, Match projection | Morale/status context and mentoring | MVP hook |

### Transfer, contract and squad-planning decisions

| Factor | Owner | Consumer | Influence | Phase |
|---|---|---|---|---|
| Impact Lens | Squad & Player | Transfer UI, Scouting | Role/tactic fit, shortlist ranking | MVP foundation |
| Scouting confidence | Scouting / Transfer | Transfer UI | Ranges, trust, hidden-label reveal | MVP foundation |
| PlayerMarketProfile | Transfer from public inputs | Transfer | Reference value, asking band, availability label | MVP foundation |
| Contract/wage state | Squad & Player, Club Management | Transfer | Contract risk, wage burden, affordability | MVP foundation |
| Player agency labels | Squad & Player + People | Transfer | Player terms and wantaway pressure | MVP foundation |
| Relationship with manager/director | People | Transfer | Terms fit, negotiation temperature, leak risk | MVP hook |
| Agent profile | Transfer + People actor identity | Transfer | Fee preference, patience, leak tendency | MVP simple agent identity |
| Fan/board attachment | Fan Ecology / Club Management | Transfer | Protection score, backlash, shock-sale risk | MVP hook |
| Injury/adaptation risk | Squad & Player + People labels | Transfer | Risk discount and integration warnings | MVP foundation |
| Recruitment pipeline quality | Staff Operations | Transfer / Scouting | Discovery, report accuracy, shortlist quality | MVP hook |

### Staff pipeline and staff-skill influence

| Factor | Owner | Consumer | Influence | Phase |
|---|---|---|---|---|
| Staff contract lifecycle | Staff Operations | Club Management, Notification | Active staff availability and wage schedule | MVP foundation |
| Role assignment | Staff Operations | Training, Transfer, Squad & Player, Match | Pipeline coverage and specialist availability | MVP foundation |
| PipelineCoverageSnapshot | Staff Operations | UI and consuming domains | Bottleneck explanations and quality multipliers | MVP foundation |
| Staff specialisation metadata | Staff Operations | Consuming domains | Coach/scout/medical/set-piece emphasis | MVP hook |
| StaffSkillProfileSnapshot | People | Staff Operations + consumers | Optional staff-skill-aware pipeline effects | Decision gate |
| Staff persona/relationships | People | Narrative, Training/Transfer as context | Advice tone, trust/conflict, future staff dynamics | MVP narration; mechanics gated |
| Staff continuity/turnover | Staff Operations + People | Training, Squad & Player | Disruption and adaptation effects | Post-MVP |

## Staff-skill MVP decision

Nico needs to decide whether staff skills become active in MVP.

| Option | Decision | Outcome |
|---|---|---|
| A - Target-only | Staff skills stay documented for future design only. | Staff has contracts, roles, coverage and specialisations, but no skill-profile mechanics. |
| B - Narrow pipeline modifiers | Staff skills can affect only Staff Operations pipeline-quality read models consumed by Training, Scouting, Medical and Match-Day. | Recommended. Staff matters mechanically without full staff-card gameplay. |
| C - Full staff skill cards | Staff skill profiles are visible and mechanically active across systems. | Richest fantasy, but too broad without a catalog, UI and balance pass. |

Recommendation: **Option B**. It is the smallest useful MVP activation. It must
still be approved explicitly; until then, implementation keeps staff skills as
target-model hooks only.

FMX-152 refreshed this gate on 2026-06-15 with Perplexity-first research,
source checks and a Nico decision queue:
[[../60-Research/staff-skill-mvp-scope-2026-06-15]] and
[[../40-Execution/fmx-152-staff-skill-mvp-scope-decision-queue-2026-06-15]].
The recommendation remains Option B, but no staff-skill MVP mechanic is binding
until Nico accepts the FMX-152 D1-D4 packet.

## Candidate read models

These are planning names, not approved public APIs:

- `DevelopmentDecisionContext`
- `TransferDecisionContext`
- `PeopleImpactSummary`
- `PlayerSkillProfileSnapshot`
- `StaffSkillProfileSnapshot`
- `StaffPipelineCoverageSnapshot`

ADR-0052 is accepted: People owns persona, relationship and skill-profile read
models. Consuming contexts apply effects through their own rules and never query
People internals.

## Acceptance scenarios

```gherkin
Feature: Player and staff decision influence

  Scenario: Development report explains a player stall
    Given a young player has high potential
    And the player received poor role-fit minutes
    And the player trained under weak development coverage
    When the weekly development report is produced
    Then the report explains the stall with visible causes
    And it does not expose the hidden PA value directly

  Scenario: Transfer terms can fail after club agreement
    Given two clubs agree a transfer package
    And the player has low role-happiness fit with the buyer
    And the player relationship context makes the move unattractive
    When player terms are evaluated
    Then the deal may collapse at the player/agent gate
    And Transfer records the reason without duplicating People internals

  Scenario: Staff pipeline bottleneck affects training quality
    Given the club has a weak development pipeline coverage snapshot
    When a training week is processed
    Then Training may apply a bounded quality penalty
    And Staff Operations remains the owner of staff roles and coverage

  Scenario: Match locks skill effects before kick-off
    Given a player has an active skill profile
    When line-up and tactic are locked
    Then Match receives a PlayerSkillProfileSnapshot
    And later skill changes do not alter that match

  Scenario: Narrative cannot create facts
    Given a press scene describes a player conflict
    When optional generated prose is rendered
    Then it may phrase existing facts
    But it cannot create a transfer request, injury, relationship edge or promise
```

## Open

- Staff-skill MVP option A/B/C.
- Final first player skill catalog, tier names, caps and trigger envelopes.
- Exact `DevelopmentDecisionContext` and `TransferDecisionContext` fields.
- Relationship edge thresholds, decay and anti-spam rules.
- Whether staff-skill effects are visible in MVP UI or only explained through
  pipeline coverage.

## Rationale

The system should avoid both extremes: a spreadsheet where every person is just
attributes, and a vague narrative layer where personality appears to change
mechanics magically. Factor matrices keep gameplay causal and testable while
leaving the exact weights tunable for playtest.

## Consequences

Positive:

- Gives future implementation a clear owner/consumer map.
- Makes transfers, development and staff decisions explainable.
- Preserves 16+4+8, no-global-OVR and deterministic simulation rules.
- Lets staff become meaningful without forcing full staff-card scope.

Negative / constraints:

- Keeps an accepted factor-matrix GDDR aligned with GD-0020, GD-0027 and ADR-0052.
- Requires discipline so People does not duplicate Squad, Training or Transfer
  facts.
- Staff-skill activation cannot proceed until Nico resolves the option gate.

## Supersedes

None

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
- [[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]]
- Future ADR/GDDR if staff-skill MVP activation is accepted.

## Related

- Research: [[../60-Research/player-staff-development-decision-model-2026-05-28]], [[../60-Research/hidden-attribute-reveal-owner-reconciliation-2026-06-14]]
- Game design: [[GD-0020-eos-player-skills-personas-and-people]], [[GD-0027-hidden-attribute-substrate-mapping]], [[youth-academy-and-development]], [[training-load-and-medicine]], [[transfer-market-and-contracts]]
- Feature specs: [[../20-Features/feature-eos-player-skills-and-people-context]], [[../20-Features/feature-player-lifecycle]], [[../20-Features/feature-training-medicine]], [[../20-Features/feature-transfer-market-ai-and-contracts]]
