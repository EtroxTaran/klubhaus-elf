---
title: "Effect-intent taxonomy across Narrative and Media Ecology"
status: current
tags: [research, synthesis, effect-intent, narrative, media-ecology, press, dialogue, ddd, fmx-162]
context: [narrative-dialogue, media-ecology]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-162
related:
  - [[raw-perplexity/raw-effect-intent-taxonomy-realworld-2026-06-15]]
  - [[raw-perplexity/raw-effect-intent-taxonomy-game-precedents-2026-06-15]]
  - [[raw-perplexity/raw-effect-intent-taxonomy-ddd-contracts-2026-06-15]]
  - [[raw-perplexity/raw-effect-intent-taxonomy-source-checks-2026-06-15]]
  - [[../10-Architecture/09-Decisions/ADR-0126-cross-producer-effect-intent-taxonomy]]
  - [[../40-Execution/fmx-162-effect-intent-taxonomy-decision-queue-2026-06-15]]
  - [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[../10-Architecture/09-Decisions/ADR-0065-narrative-media-press-content-ownership]]
  - [[../10-Architecture/09-Decisions/ADR-0085-media-ecology-context-and-outlet-operational-behaviour]]
  - [[../50-Game-Design/GD-0028-dialogue-intent-taxonomy-effect-matrix]]
  - [[../50-Game-Design/GD-0034-media-outlet-ecology-model]]
---

# Effect-intent taxonomy across Narrative and Media Ecology

## Scope

FMX-162 closes the planning gap left between:

- [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
  and [[../50-Game-Design/GD-0028-dialogue-intent-taxonomy-effect-matrix]],
  which require every selectable dialogue/press intent to declare one primary
  owner, one policy key, a band and a visibility posture;
- [[../10-Architecture/09-Decisions/ADR-0065-narrative-media-press-content-ownership]],
  which names press effect-intents but defers cross-context coordination;
- [[../10-Architecture/09-Decisions/ADR-0085-media-ecology-context-and-outlet-operational-behaviour]]
  and [[../50-Game-Design/GD-0034-media-outlet-ecology-model]], which allow
  `OutletPublishedStory` to carry advisory media effect-intents but defer the
  outlet -> fan/board/player taxonomy.

This synthesis is non-binding. It feeds the draft contract proposal
[[../10-Architecture/09-Decisions/ADR-0126-cross-producer-effect-intent-taxonomy]]
and the Nico decision queue
[[../40-Execution/fmx-162-effect-intent-taxonomy-decision-queue-2026-06-15]].

## Evidence synthesis

### Real-world football

The stronger football evidence supports media and press as **pressure
amplifiers**, not direct mechanical authors:

- Football Manager's official FM26 article frames morale as a major factor in
  dynamics, cohesion, training, form and preparation; it also calls out player
  departure rumours and media praise as relevant managerial levers.
- Coach-dismissal studies show that board/club pressure is expectation-relative
  and short-cycle in elite football: underperformance against expectations is a
  major dismissal driver, and Brazilian top-flight data shows frequent
  in-season coach turnover.
- Elite-coach interviews describe stakeholder, sponsor, media and fan pressure
  around dismissal and shifting expectations.

Design implication: an effect-intent should usually land as a small, owner-
validated movement in confidence, trust, fan sentiment, board scrutiny, transfer
stance or outlet hostility. It should not bypass the owner context or directly
rewrite authoritative football state.

### Comparable games

The strongest official/manual game sources support three patterns:

- EA FC 25 ties press questions to tactical choices, opponent setup and match
  statistics; its social/news surface carries achievements, results and
  transfer stories.
- Football Manager uses morale, media praise, rumours and public manager
  communication as visible managerial tools.
- OOTP links news articles, performance, personality, contracts, popularity,
  fan interest and revenue.

The weak community/game-guide leads are still useful as player-behaviour
warnings: opaque press systems tend to collapse into safe-answer heuristics and
external-guide decoding. FMX should expose enough cause/effect history that the
player does not have to infer hidden mechanics from repetition.

### DDD and contracts

The best architecture fit is **published language plus owner ACL/policy
translation**, not a shared domain model:

- Narrative and Media Ecology publish committed facts with advisory
  effect-intent metadata.
- A central catalog can define stable intent IDs, target owner contexts,
  policy-key handoff names, bands and visibility as a published-language
  registry.
- Each owner context still owns the meaning, validation, clamping, rejection and
  authoritative result event for its policy keys.
- Producer-generated prose never creates, changes or confirms an effect.

When implementation resumes, Zod 4 gives a useful conformance shape:
`z.record(z.enum(effectIntentIds), mappingSchema)` is exhaustive, so the
contract test can fail when a new `EffectIntentId` lacks one mapping entry.

## Recommended packet

Recommended Nico selections are:

| Decision | Recommendation | Reason |
|---|---|---|
| Taxonomy shape | **One canonical published-language catalog** | Closes the cross-producer gap without making a shared domain model. |
| Authority boundary | **Advisory intent only; owner contexts apply** | Matches ADR-0030/0054/0065/0085 and DDD integration-event guidance. |
| Catalog owner | **Dedicated cross-cutting ADR-0126** | Avoids making Narrative or Media Ecology the owner of consumer policy mappings. |
| V1 scope | **All named GD-0028, ADR-0065 and ADR-0085 intents** | Makes the existing contract checkable now; all numeric magnitudes stay in GD-0043 slots. |
| People role | **Gate/scaler owner, not default effect owner** | Preserves GD-0028 primary owners while still routing persona/receptivity through People-owned projections. |
| Visibility | **Small bounded visible outcomes plus audit/history** | Avoids opaque safe-answer farming and preserves deterministic replay trust. |

## Proposed contract model

`EffectIntentId` is a stable string ID in producer-facing namespaces:

- `player.*`, `staff.*`, `board.*`, `press.*`, `fan.*`, `agent.*` from
  [[../50-Game-Design/GD-0028-dialogue-intent-taxonomy-effect-matrix]];
- `media.*` from [[../10-Architecture/09-Decisions/ADR-0085-media-ecology-context-and-outlet-operational-behaviour]];
- ADR-0065 bare IDs are normalized into `press.*` aliases.

Every row declares exactly one **primary effect owner** and one
`effectPolicyKey`. Secondary consequences are not extra writes from the same
intent; they are downstream owner events or projections after the primary owner
accepts/rejects the intent.

People is represented as:

- a source of `personaGateRefs` / `receptivity` inputs;
- owner of future People-specific relationship/receptivity policy keys if Nico
  chooses that in the decision queue;
- not a silent secondary writer behind another context's accepted effect.

## Open decisions

The questions in
[[../40-Execution/fmx-162-effect-intent-taxonomy-decision-queue-2026-06-15]]
must be answered before ADR-0126 can become accepted/binding.

## Related

- [[raw-perplexity/raw-effect-intent-taxonomy-realworld-2026-06-15]]
- [[raw-perplexity/raw-effect-intent-taxonomy-game-precedents-2026-06-15]]
- [[raw-perplexity/raw-effect-intent-taxonomy-ddd-contracts-2026-06-15]]
- [[raw-perplexity/raw-effect-intent-taxonomy-source-checks-2026-06-15]]
- [[../10-Architecture/09-Decisions/ADR-0126-cross-producer-effect-intent-taxonomy]]
- [[../40-Execution/fmx-162-effect-intent-taxonomy-decision-queue-2026-06-15]]
