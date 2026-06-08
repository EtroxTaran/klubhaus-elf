---
title: GD-0028 Dialogue Intent Taxonomy and Effect Matrix
status: accepted
tags: [game-design, gddr, narrative, dialogue, intents, effects, ai, llm, fmx-87, gap-g13]
created: 2026-06-05
updated: 2026-06-08
type: game-design
binding: false
related:
  - [[README]]
  - [[GD-0018-ai-narrative-personas-and-dialogue]]
  - [[GD-0020-eos-player-skills-personas-and-people]]
  - [[GD-0021-player-staff-development-and-decision-influence]]
  - [[GD-0006-transfers]]
  - [[audience-and-atmosphere]]
  - [[../60-Research/dialogue-intent-taxonomy-effect-matrix-2026-06-05]]
  - [[../60-Research/raw-perplexity/raw-dialogue-intent-taxonomy-effect-matrix-2026-06-05]]
  - [[../20-Features/feature-ai-narration-mvp-pillar]]
  - [[../30-Implementation/ai-narration-contract-testing-framework]]
  - [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
  - [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[../10-Architecture/09-Decisions/ADR-0065-narrative-media-press-content-ownership]]
  - [[../10-Architecture/09-Decisions/ADR-0076-narrative-newsworthiness-event-contracts]]
---

# GD-0028: Dialogue Intent Taxonomy and Effect Matrix

## Status

draft

> **Draft / `binding: false`.** Closes audit gap **G13** (FMX-87). Nico chose
> D1-D3 live on 2026-06-05, but this record is not implementable until ratified.
> It defines the deterministic intent/effect design layer; exact numeric deltas
> remain FMX-52 calibration inputs.

## Date

2026-06-05

## Player experience goal

Dialogue should feel consequential without becoming free-form simulation input.
The player chooses clear managerial approaches - reassure a player, challenge a
leader, defend a strategy, shut down a rumour, negotiate with an agent - and the
game applies deterministic effects through the owning domain. Optional LLM prose
may make the scene feel personal, but the selected intent is the only mechanical
input.

## Fixed frame

- [[GD-0018-ai-narrative-personas-and-dialogue]]: Dialogue is intent-based and
  generated prose may not create facts, choices or effects.
- [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]:
  LLM output is presentation-only and cannot be parsed into domain commands.
- [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]:
  Narrative owns scene/storylet selection, context cards, fallback/LLM
  rendering, validation and provenance.
- [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  is still draft; persona gates/modifiers below are proposed interface
  assumptions until People is ratified.

## Decisions (D1-D3)

| # | Decision | Selected | Rationale |
|---|---|---|---|
| D1 | Surface scope | **Broad MVP**: player, staff, board, press/media, fan-rep and agent surfaces. | Matches FMX-88 Broad Full Dialogue and avoids a partial taxonomy that downstream Narrative must later break. |
| D2 | Effect precision | **Banded effects** (`minor`, `moderate`, `major`, `critical`) with exact numbers deferred. | Stable design language; calibration remains FMX-52 work. |
| D3 | Persona influence | **Gate plus bounded scale**. | Keeps options legible while still letting persona/relationship context matter; owning domains remain authoritative. |

## Causality rule

```text
Narrative scene selected
  -> Narrative offers allowed DialogueIntent options
  -> player selects one intent
  -> owning domain validates and applies effect
  -> owning domain emits result event
  -> Narrative renders follow-up prose from the result event
```

Forbidden:

- LLM/prose creates a new intent, option, policy key, command payload, effect ID,
  numeric delta, promise or event.
- Narrative writes morale, trust, pressure, fan sentiment, relationship or
  transfer-readiness state.
- A rendered text string is parsed back into an authoritative command.

## Effect bands

| Band | Meaning | Calibration handling |
|---|---|---|
| `none` | No mechanical change; prose/telemetry only. | Stable. |
| `minor` | Small nudge, mostly short-lived or local. | FMX-52 exact value. |
| `moderate` | Noticeable state movement or promise creation. | FMX-52 exact value + cap. |
| `major` | Strong trust/pressure/disposition movement; likely follow-up story. | FMX-52 exact value + cooldown. |
| `critical` | Reserved for rare crisis/ultimatum paths. | Nico-gated and scenario-tested. |

All bands are direction + magnitude class, not numbers. Diminishing returns,
decay, stack caps and cooldowns are calibration parameters.

## Surface taxonomy

### Player one-to-one

Primary owner: Squad & Player for morale, trust, squad status and promises.
People may contribute persona/relationship gates once ADR-0052 is ratified.

| Intent | Availability | Primary effect |
|---|---|---|
| `player.reassure_role` | Player has role/minutes concern or recent demotion. | Squad & Player: morale/trust `minor` to `moderate`; may create role-clarity fact. |
| `player.promise_minutes` | Manager can plausibly offer role/minutes target. | Squad & Player: creates typed minutes promise; trust risk if unrealistic. |
| `player.challenge_form` | Poor form/training context exists. | Squad & Player: morale/trust directional band based on fairness; may flag motivation. |
| `player.praise_form` | Recent strong match/training context exists. | Squad & Player: morale `minor`/`moderate`; trust `minor`. |
| `player.discipline_warning` | Behaviour/professionalism issue exists. | Squad & Player: trust risk; discipline/attitude warning fact. |
| `player.accept_transfer_request` | Player wants move or is surplus. | Transfer + Squad & Player: transfer disposition moves toward exit; trust may improve if honest. |
| `player.refuse_transfer_request` | Player wants move and club can block. | Squad & Player: trust/morale pressure; Transfer consumes disposition later. |
| `player.apologise` | Broken promise, selection mismatch or public contradiction exists. | Squad & Player: trust repair band; may reduce authority if repeated. |

### Staff advice / disagreement

Primary owner: Staff Operations for staff-role relationship facts and advice
outcomes; consuming domains decide whether advice creates effects.

| Intent | Availability | Primary effect |
|---|---|---|
| `staff.accept_advice` | Staff recommendation is pending. | Staff Operations: staff trust `minor`; target domain receives accepted-advice fact. |
| `staff.reject_advice` | Staff recommendation is pending. | Staff Operations: staff trust `minor` negative; no target-domain command. |
| `staff.request_alternative` | Recommendation has at least one alternative. | Staff Operations: follow-up recommendation requested; no gameplay delta. |
| `staff.challenge_assessment` | Expert/Standard surface with contradictory evidence. | Staff Operations: relationship/trust band; may improve advice fit if justified. |
| `staff.delegate_topic` | Topic can be delegated by policy. | Staff Operations/Notification: delegation preference fact. |

### Board meeting

Primary owner: Club Management / board policy. Board dialogue affects
objectives, budgets, job security and board pressure, never match facts.

| Intent | Availability | Primary effect |
|---|---|---|
| `board.request_time` | Results under target or rebuild context. | Club Management: board pressure `minor`/`moderate` down if credible; promise/ultimatum risk. |
| `board.adjust_expectation` | Objective mismatch or new season review. | Club Management: objective proposal; board trust/pressure band. |
| `board.request_budget` | Window/resource context and financial room exist. | Club Management: budget-request case; board trust/pressure band. |
| `board.defend_strategy` | Board questions tactics, youth, transfer or finance approach. | Club Management: alignment fact; pressure band by evidence. |
| `board.accept_condition` | Board offers condition/ultimatum. | Club Management: typed board commitment. |
| `board.reject_condition` | Board condition exists and manager has leverage. | Club Management: pressure/job-security risk. |

### Press / media

Primary owner: Narrative for press storylet/rendering only. Source effects route
to Squad & Player, Club Management, Audience & Atmosphere or Transfer depending
on the subject.

| Intent | Availability | Primary effect |
|---|---|---|
| `press.protect_player` | Named player under scrutiny. | Squad & Player: player morale/trust `minor`/`moderate`; Audience/Narrative story pressure may shift. |
| `press.challenge_player` | Named player performance/attitude story exists. | Squad & Player: morale/trust risk; possible motivation band. |
| `press.accept_blame` | Bad result/incident. | Club Management/Audience: public pressure `minor` down; board trust may move by context. |
| `press.deflect_blame` | Bad result/incident. | Audience/Narrative: public narrative shift; trust risk if overused. |
| `press.raise_expectation` | Strong form or target discussion. | Club Management/Audience: pressure `minor`/`moderate` up; fan confidence risk/reward. |
| `press.lower_expectation` | Underdog, injuries, rebuild or fixture congestion. | Club Management/Audience: pressure band; may anger ambitious board/fans. |
| `press.address_rumour` | Transfer rumour/news fact exists. | Transfer: rumour stance fact; Narrative renders only. |
| `press.no_comment` | Any press question. | Narrative/Audience: low effect; may preserve privacy but frustrate outlets. |

### Fan-rep scene

Primary owner: Audience & Atmosphere for supporter trust, identity fit and
atmosphere trajectory; Club Management consumes board-pressure facts later.

| Intent | Availability | Primary effect |
|---|---|---|
| `fan.reassure_project` | Poor run, rebuild or youth plan anxiety. | Audience & Atmosphere: supporter trust `minor`/`moderate`; patience trajectory. |
| `fan.affirm_identity` | Club identity/style/youth/local-player concern exists. | Audience & Atmosphere: identity-fit trust band. |
| `fan.apologise` | Fan protest, ticketing issue, poor derby/cup result. | Audience & Atmosphere: trust repair band; board pressure may later consume. |
| `fan.defend_decision` | Controversial sale, price, selection or style decision. | Audience & Atmosphere: trust risk/reward by evidence. |
| `fan.promise_action` | Domain can represent a concrete future action. | Audience & Atmosphere or Club Management: typed supporter commitment. |

### Agent / transfer talk

Primary owner: Transfer for agent posture, transfer-readiness and negotiation
cases; Squad & Player owns resulting player promises/status where applicable.

| Intent | Availability | Primary effect |
|---|---|---|
| `agent.express_interest` | Target player is eligible for contact policy. | Transfer: interest/disposition fact; no club agreement implied. |
| `agent.ask_terms` | Agent contact available. | Transfer: terms/readiness snapshot; no state mutation beyond contact history. |
| `agent.promise_role` | Role promise can be represented and club can offer. | Transfer + Squad & Player: creates proposed role promise if deal advances. |
| `agent.improve_offer` | Negotiation case open. | Transfer: negotiation posture; wage/role package changes only through offer command. |
| `agent.hold_line` | Negotiation case open. | Transfer: agent trust/readiness risk; no automatic rejection. |
| `agent.withdraw_respectfully` | Negotiation case open. | Transfer: closes/pauses case with relationship-preserving band. |
| `agent.warn_walkaway` | Negotiation case open and manager has leverage. | Transfer: pressure band; high agent-trust risk. |

## Persona and relationship policy

Persona and relationship inputs may influence an intent in two explicit ways:

1. **Availability gate:** an intent is visible or hidden because the actor,
   relationship or context makes it plausible. Example: a high-trust player may
   receive `player.promise_minutes`; a hostile agent may block
   `agent.withdraw_respectfully` from preserving relationship value.
2. **Bounded scaling:** an owning domain may scale an effect band within a
   documented corridor. Example: a volatile player receives a larger negative
   trust movement from harsh public criticism.

Rules:

- Gates and scalers must be listed on the intent/effect row or a referenced
  policy table.
- Persona never changes the owner of the effect.
- Persona cannot promote prose into state.
- Until ADR-0052 is ratified, People-sourced persona facts are proposal inputs,
  not implementation authority.

## Command and event contracts (planning)

`DialogueIntentSelected` is the presentation-to-domain handoff. It is a
self-contained command request, not an authoritative result event.

```text
DialogueIntentSelected =
  schemaVersion
  sceneId
  surface
  intentId
  intentVersion
  speakerActorRef
  targetActorRefs[]
  ownerContext
  authoritativeFactRefs[]
  personaGateRefs[]
  expectedEffectBand
  selectedAtGameTime
  idempotencyKey
```

The owning domain validates the command and emits a domain-owned result event,
for example:

- `PlayerDialogueEffectApplied`
- `StaffDialogueResolutionRecorded`
- `BoardDialogueCommitmentRecorded`
- `PressDialogueEffectApplied`
- `FanRepDialogueEffectApplied`
- `AgentDialogueEffectApplied`
- `DialogueIntentRejected`

Result events carry the applied band, affected signal, promise/commitment refs,
rejection reason and projection hints for Narrative. Narrative consumes the
result read-only for follow-up rendering and provenance.

## Invariants

- D1. Every selectable dialogue option maps to exactly one `DialogueIntent`.
- D2. Every `DialogueIntent` maps to one primary effect owner.
- D3. Narrative never applies authoritative effects.
- D4. LLM/template prose may paraphrase an intent or result event, but may not
  create or alter either.
- D5. Effect magnitudes are bands here; exact numbers live in FMX-52 calibration.
- D6. Promise-like intents create typed promises/commitments or are not offered.
- D7. Cross-surface contradictions are facts, not hidden prose judgments.
- D8. Rejected intents emit deterministic feedback with a reason.

## Open / calibration

- Exact numeric values, caps, decay, stack limits and cooldowns for every band
  are FMX-52 calibration work.
- FMX-82 owns final media-outlet cadence/reach/stance interactions with
  press/media intents.
- ADR-0052 ratification must settle final People/persona ownership before
  implementation.
- Content authoring must add fallback templates and manifest fixtures per
  intent before runtime LLM can use the surface.

## Supersedes

None. Resolves GD-0018 "Exact `DialogueIntent` taxonomy per surface" as a
draft proposed design.

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
- [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]

## Related

- [[../60-Research/dialogue-intent-taxonomy-effect-matrix-2026-06-05]]
- [[../60-Research/raw-perplexity/raw-dialogue-intent-taxonomy-effect-matrix-2026-06-05]]
- [[GD-0018-ai-narrative-personas-and-dialogue]]
- [[GD-0020-eos-player-skills-personas-and-people]]
- [[../20-Features/feature-ai-narration-mvp-pillar]]
- [[../30-Implementation/ai-narration-contract-testing-framework]]

