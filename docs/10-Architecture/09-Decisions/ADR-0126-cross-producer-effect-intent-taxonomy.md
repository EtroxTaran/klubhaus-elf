---
title: ADR-0126 Cross-producer effect-intent taxonomy
status: draft
tags: [adr, architecture, ddd, effect-intent, narrative, media-ecology, press, dialogue, published-language, fmx-162]
created: 2026-06-15
updated: 2026-06-15
type: adr
binding: false
linear: FMX-162
supersedes:
superseded_by:
related:
  - [[../../60-Research/effect-intent-taxonomy-cross-producer-2026-06-15]]
  - [[../../60-Research/raw-perplexity/raw-effect-intent-taxonomy-realworld-2026-06-15]]
  - [[../../60-Research/raw-perplexity/raw-effect-intent-taxonomy-game-precedents-2026-06-15]]
  - [[../../60-Research/raw-perplexity/raw-effect-intent-taxonomy-ddd-contracts-2026-06-15]]
  - [[../../60-Research/raw-perplexity/raw-effect-intent-taxonomy-source-checks-2026-06-15]]
  - [[../../40-Execution/fmx-162-effect-intent-taxonomy-decision-queue-2026-06-15]]
  - [[ADR-0030-llm-out-of-authoritative-state]]
  - [[ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[ADR-0065-narrative-media-press-content-ownership]]
  - [[ADR-0085-media-ecology-context-and-outlet-operational-behaviour]]
  - [[ADR-0100-story-thread-ownership-and-cross-context-naming]]
  - [[../../50-Game-Design/GD-0028-dialogue-intent-taxonomy-effect-matrix]]
  - [[../../50-Game-Design/GD-0034-media-outlet-ecology-model]]
  - [[../../50-Game-Design/GD-0043-gameplay-calibration-ownership-and-acceptance-gate]]
---

# ADR-0126: Cross-producer effect-intent taxonomy

## Status

draft

> **Decision gate.** This is the FMX-162 proposal only. It is non-binding until
> Nico answers D1-D7 in
> [[../../40-Execution/fmx-162-effect-intent-taxonomy-decision-queue-2026-06-15]].

## Context

FMX already has two advisory producers:

- **Narrative** emits finite dialogue/press selections such as
  `ConferenceResponseSelected` and the broader `DialogueIntentSelected` flow
  from [[ADR-0054-narrative-context-and-ai-narration-framework]] /
  [[../../50-Game-Design/GD-0028-dialogue-intent-taxonomy-effect-matrix]].
- **Media Ecology** emits `OutletPublishedStory` coverage facts from
  [[ADR-0085-media-ecology-context-and-outlet-operational-behaviour]].

Both producers may carry deterministic effect-intent metadata. Existing docs
already require that metadata to remain advisory:

- generated prose never applies state ([[ADR-0030-llm-out-of-authoritative-state]]);
- Narrative and Media Ecology never write morale, fan mood, board pressure,
  relationship deltas or transfer willingness;
- owner contexts validate and emit their own result events.

The gap: the catalog is not one current truth. ADR-0065 names
`protect_player`, `criticize_board`, `appease_fans`, `escalate_media_feud` and
`deflect_transfer_rumour`; ADR-0085 names `amplify_fan_mood`,
`increase_board_scrutiny` and `dent_player_confidence`; GD-0028 defines a much
larger dialogue surface taxonomy. No record says whether these are one shared
catalog, two producer-local vocabularies, or consumer-local policy keys.

## Proposed decision

If accepted, FMX uses **one cross-producer effect-intent catalog as published
language**, not as a shared domain model.

- This ADR is the catalog governance home.
- Narrative and Media Ecology publish advisory `EffectIntentId` metadata on
  committed producer facts.
- Every `EffectIntentId` maps to exactly one primary `effectOwnerContext`, one
  `effectPolicyKey`, one band source and one visibility posture.
- Owner contexts interpret the policy key through local ACL/policy code and
  emit authoritative result events.
- Secondary outcomes happen only through owner result events or projections,
  not as extra producer writes.
- People/persona input is a gate/scaler unless a People-owned effect row is
  explicitly accepted later.

## Options considered

### D1 - Taxonomy shape

| Option | Meaning | Assessment |
|---|---|---|
| **A. One canonical published-language catalog** | A single catalog gives every advisory intent one owner/policy mapping; owners still translate locally. | **Recommended.** Closes the cross-producer gap without shared-model coupling. |
| B. Producer-local vocabularies | Narrative and Media Ecology publish separate IDs; owners map each separately. | Avoids central coordination but duplicates semantics and lets press/media drift apart. |
| C. Owner-local accepted keys only | Producers emit generic tags; each owner publishes accepted keys. | Too weak for ADR-0054's "one owner + one policy key" invariant. |

### D2 - Authority boundary

| Option | Meaning | Assessment |
|---|---|---|
| **A. Advisory intent -> owner validation -> owner result** | Producers emit only advisory metadata; owners validate/apply/reject. | **Recommended.** Matches ADR-0030/0054/0065/0085 and DDD event boundaries. |
| B. Producer emits effect commands | Producers target another context with command-like effects. | Blurs authority and makes replay/debug harder. |
| C. Producer writes minor effects directly | Narrative/Media may write small deltas. | Rejected; violates the accepted non-authoritative posture. |

### D3 - Catalog ownership

| Option | Meaning | Assessment |
|---|---|---|
| **A. Dedicated ADR contract home** | This ADR owns the published catalog; each consumer owns policy-key semantics. | **Recommended.** Avoids giving one producer control over consumer mappings. |
| B. Narrative owns the catalog | All press/media/dialogue effects live under Narrative. | Too much Narrative overreach; weak for Media Ecology-originated coverage. |
| C. Every consumer owns its own accepted-key list | No cross-producer catalog. | Preserves local ownership but fails discoverability and conformance. |

## Contract shape

Planning fields:

```text
EffectIntentMapping =
  effectIntentId
  producerContext
  producerEvent
  intentVersion
  effectOwnerContext
  effectPolicyKey
  mechanicalEffectBand
  effectVisibility
  gateInputs
  expiryWindow
  auditVisibility
```

Producer event metadata should carry:

```text
AdvisoryEffectIntent =
  schemaVersion
  sourceEventId
  correlationId
  causationId
  storyThreadId?
  effectIntentId
  intentVersion
  targetRefs[]
  authoritativeFactRefs[]
  proposedBand
  proposedVisibility
  expiresAtGameTime?
  provenance
```

Owner result events should carry accepted/clamped/rejected outcome, policy key,
applied band, rejection reason when applicable, affected signal and a projection
hint for Narrative/UI history. Exact event names remain owner-context design.

## Proposed v1 catalog

Band values below are classes, not numbers. Exact magnitudes, caps, decay and
cooldowns stay in [[../../50-Game-Design/GD-0043-gameplay-calibration-ownership-and-acceptance-gate]]
slots such as `dialogue.trustMorale`, `media.ecology` and
`transfer.escalation`.

| EffectIntentId | Producer/event | Primary owner | effectPolicyKey | Band | Visibility |
|---|---|---|---|---|---|
| `player.reassure_role` | Narrative / `DialogueIntentSelected` | Squad & Player | `player_role_reassurance` | minor/moderate | private result |
| `player.promise_minutes` | Narrative / `DialogueIntentSelected` | Squad & Player | `minutes_promise_created` | moderate | commitment visible |
| `player.challenge_form` | Narrative / `DialogueIntentSelected` | Squad & Player | `form_challenge_response` | minor/moderate | private result |
| `player.praise_form` | Narrative / `DialogueIntentSelected` | Squad & Player | `form_praise_response` | minor/moderate | private result |
| `player.discipline_warning` | Narrative / `DialogueIntentSelected` | Squad & Player | `discipline_warning_recorded` | minor/moderate | private result |
| `player.accept_transfer_request` | Narrative / `DialogueIntentSelected` | Transfer | `transfer_request_acceptance` | moderate | case/history visible |
| `player.refuse_transfer_request` | Narrative / `DialogueIntentSelected` | Transfer | `transfer_request_refusal` | moderate/major | case/history visible |
| `player.apologise` | Narrative / `DialogueIntentSelected` | Squad & Player | `trust_repair_apology` | minor/moderate | private result |
| `staff.accept_advice` | Narrative / `DialogueIntentSelected` | Staff Operations | `staff_advice_accepted` | minor | staff/history visible |
| `staff.reject_advice` | Narrative / `DialogueIntentSelected` | Staff Operations | `staff_advice_rejected` | minor | staff/history visible |
| `staff.request_alternative` | Narrative / `DialogueIntentSelected` | Staff Operations | `staff_alternative_requested` | none/minor | staff/history visible |
| `staff.challenge_assessment` | Narrative / `DialogueIntentSelected` | Staff Operations | `staff_assessment_challenged` | minor/moderate | staff/history visible |
| `staff.delegate_topic` | Narrative / `DialogueIntentSelected` | Staff Operations | `staff_topic_delegated` | none/minor | staff/history visible |
| `board.request_time` | Narrative / `DialogueIntentSelected` | Club Management | `board_time_request` | minor/moderate | board history |
| `board.adjust_expectation` | Narrative / `DialogueIntentSelected` | Club Management | `board_expectation_adjustment` | moderate | board history |
| `board.request_budget` | Narrative / `DialogueIntentSelected` | Club Management | `board_budget_request` | moderate | board history |
| `board.defend_strategy` | Narrative / `DialogueIntentSelected` | Club Management | `board_strategy_defence` | minor/moderate | board history |
| `board.accept_condition` | Narrative / `DialogueIntentSelected` | Club Management | `board_condition_accepted` | moderate/major | commitment visible |
| `board.reject_condition` | Narrative / `DialogueIntentSelected` | Club Management | `board_condition_rejected` | moderate/major | board history |
| `press.protect_player` | Narrative / `ConferenceResponseSelected` | Squad & Player | `public_player_protection` | minor/moderate | public + player history |
| `press.challenge_player` | Narrative / `ConferenceResponseSelected` | Squad & Player | `public_player_challenge` | minor/moderate | public + player history |
| `press.accept_blame` | Narrative / `ConferenceResponseSelected` | Audience & Atmosphere | `public_blame_absorbed` | minor/moderate | public sentiment history |
| `press.deflect_blame` | Narrative / `ConferenceResponseSelected` | Audience & Atmosphere | `public_blame_deflected` | minor/moderate | public sentiment history |
| `press.raise_expectation` | Narrative / `ConferenceResponseSelected` | Club Management | `public_expectation_raised` | minor/moderate | board/public history |
| `press.lower_expectation` | Narrative / `ConferenceResponseSelected` | Club Management | `public_expectation_lowered` | minor/moderate | board/public history |
| `press.address_rumour` | Narrative / `ConferenceResponseSelected` | Transfer | `transfer_rumour_addressed` | minor/moderate | rumour history |
| `press.no_comment` | Narrative / `ConferenceResponseSelected` | Audience & Atmosphere | `public_no_comment_response` | none/minor | public sentiment history |
| `press.criticize_board` | Narrative / `ConferenceResponseSelected` | Club Management | `public_board_criticism` | moderate/major | board/public history |
| `press.appease_fans` | Narrative / `ConferenceResponseSelected` | Audience & Atmosphere | `fan_appeasement_attempt` | minor/moderate | public sentiment history |
| `press.escalate_media_feud` | Narrative / `ConferenceResponseSelected` | Media Ecology | `outlet_relationship_feud_escalated` | minor/moderate | outlet/history visible |
| `press.deflect_transfer_rumour` | Narrative / `ConferenceResponseSelected` | Transfer | `transfer_rumour_deflected` | minor/moderate | rumour history |
| `fan.reassure_project` | Narrative / `DialogueIntentSelected` | Audience & Atmosphere | `supporter_project_reassurance` | minor/moderate | supporter history |
| `fan.affirm_identity` | Narrative / `DialogueIntentSelected` | Audience & Atmosphere | `supporter_identity_affirmed` | minor/moderate | supporter history |
| `fan.apologise` | Narrative / `DialogueIntentSelected` | Audience & Atmosphere | `supporter_apology_received` | minor/moderate | supporter history |
| `fan.defend_decision` | Narrative / `DialogueIntentSelected` | Audience & Atmosphere | `supporter_decision_defended` | minor/moderate | supporter history |
| `fan.promise_action` | Narrative / `DialogueIntentSelected` | Audience & Atmosphere | `supporter_action_promised` | moderate | commitment visible |
| `agent.express_interest` | Narrative / `DialogueIntentSelected` | Transfer | `agent_interest_expressed` | minor | case/history visible |
| `agent.ask_terms` | Narrative / `DialogueIntentSelected` | Transfer | `agent_terms_requested` | none/minor | case/history visible |
| `agent.promise_role` | Narrative / `DialogueIntentSelected` | Transfer | `agent_role_promise_proposed` | moderate | case/history visible |
| `agent.improve_offer` | Narrative / `DialogueIntentSelected` | Transfer | `agent_offer_improved` | moderate | case/history visible |
| `agent.hold_line` | Narrative / `DialogueIntentSelected` | Transfer | `agent_line_held` | minor/moderate | case/history visible |
| `agent.withdraw_respectfully` | Narrative / `DialogueIntentSelected` | Transfer | `agent_withdrawal_respectful` | minor | case/history visible |
| `agent.warn_walkaway` | Narrative / `DialogueIntentSelected` | Transfer | `agent_walkaway_warning` | moderate/major | case/history visible |
| `media.amplify_fan_mood` | Media Ecology / `OutletPublishedStory` | Audience & Atmosphere | `coverage_fan_mood_amplified` | media.ecology | coverage history |
| `media.increase_board_scrutiny` | Media Ecology / `OutletPublishedStory` | Club Management | `coverage_board_scrutiny_increased` | media.ecology | board/public history |
| `media.dent_player_confidence` | Media Ecology / `OutletPublishedStory` | Squad & Player | `coverage_player_confidence_dented` | media.ecology | player/public history |

## Alias rule

ADR-0065's bare press IDs are normalized aliases:

| Legacy/bare ID | Canonical v1 ID |
|---|---|
| `protect_player` | `press.protect_player` |
| `criticize_board` | `press.criticize_board` |
| `appease_fans` | `press.appease_fans` |
| `escalate_media_feud` | `press.escalate_media_feud` |
| `deflect_transfer_rumour` | `press.deflect_transfer_rumour` |
| `amplify_fan_mood` | `media.amplify_fan_mood` |
| `increase_board_scrutiny` | `media.increase_board_scrutiny` |
| `dent_player_confidence` | `media.dent_player_confidence` |

## Conformance rule

When implementation resumes, FMX should add a contract test named
`effect-intent-catalog-exhaustive-mapping`:

- every `EffectIntentId` enum value has exactly one mapping row;
- no mapping row points at an unknown owner context or policy key;
- no producer event carries an unknown effect intent;
- every owner emits accepted, clamped or rejected result evidence;
- duplicate advisory intents are idempotent by `sourceEventId` +
  `effectIntentId` + target refs;
- expired intents reject deterministically;
- generated prose is never an input to conformance.

Zod 4's exhaustive enum-key record validation is the recommended implementation
shape, but no code dependency or schema is added in this docs-only beat.

## Map patch proposal

No bounded-context-map row changes are needed if this ADR is accepted.

Suggested clause for [[../bounded-context-map]] once ratified:

```text
Effect-intent contract: Narrative and Media Ecology publish advisory
EffectIntentId metadata through the ADR-0126 catalog. Each intent has exactly
one primary owner context and one effectPolicyKey. Producers never apply
effects; owner contexts validate, clamp/reject and emit authoritative result
events. People/persona projections may gate or scale owner policies, but
generated prose never creates or changes effects.
```

## Consequences

Positive:

- One current truth for the advisory intent vocabulary.
- ADR-0054's one-owner / one-policy-key invariant becomes checkable.
- ADR-0065 and ADR-0085 no longer carry unowned bare intent strings after Nico
  accepts the packet.
- Owner contexts keep authority and can reject/clamp effects.
- The UI/history/replay layer can show why a press/media action mattered.

Negative / constraints:

- The catalog creates cross-context coordination overhead.
- Staff Operations and Media Ecology appear as primary owners for a small
  number of rows even though the original issue highlights five consumer
  contexts; this preserves existing GD-0028/GD-0034 ownership lines.
- Numeric tuning is still unresolved and remains in GD-0043 slots.
- Policy-key names will need future code-phase schema review before becoming
  executable.

## Promotion path

If Nico accepts D1-D7:

- promote this ADR to `accepted` / `binding: true`;
- update ADR-0065 and ADR-0085 to point their deferred taxonomy flags here as
  resolved;
- update GD-0028/GD-0034 related notes to reference this catalog as the shared
  effect-intent contract;
- update the bounded-context map clause above;
- keep GD-0043 as the owner of numeric effect calibration.

## Related

- [[../../60-Research/effect-intent-taxonomy-cross-producer-2026-06-15]]
- [[../../40-Execution/fmx-162-effect-intent-taxonomy-decision-queue-2026-06-15]]
- [[ADR-0054-narrative-context-and-ai-narration-framework]]
- [[ADR-0065-narrative-media-press-content-ownership]]
- [[ADR-0085-media-ecology-context-and-outlet-operational-behaviour]]
- [[../../50-Game-Design/GD-0028-dialogue-intent-taxonomy-effect-matrix]]
- [[../../50-Game-Design/GD-0034-media-outlet-ecology-model]]
- [[../../50-Game-Design/GD-0043-gameplay-calibration-ownership-and-acceptance-gate]]
