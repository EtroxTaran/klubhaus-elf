---
title: Narrative module
status: draft
tags: [architecture, module, narrative, dialogue, press]
context: narrative-dialogue
created: 2026-06-20
updated: 2026-06-20
type: module
binding: false
related: [[../05-Building-Blocks]], [[../bounded-context-map]], [[../09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]], [[../09-Decisions/ADR-0076-narrative-newsworthiness-event-contracts]], [[../09-Decisions/ADR-0100-story-thread-ownership-and-cross-context-naming]], [[../09-Decisions/ADR-0117-narrative-display-snapshot-replay-determinism-floor]], [[../09-Decisions/ADR-0065-narrative-media-press-content-ownership]], [[../09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
---

# Narrative Boundary

## Purpose

Non-authoritative narration framework: selects scenes/storylets, assembles
context cards from public read models, renders deterministic fallbacks,
optionally enhances presentation prose via an LLM adapter, and persists display
snapshots with provenance. Generated prose never mutates authoritative state
(ADR-0030).

## Owns

- `NarrativeScene` selection and storylet eligibility; `NarrativeContextCard`
  assembly from public read models.
- Fallback template lookup and deterministic rendering; the
  `FallbackCoverageManifest`.
- Optional LLM provider adapter boundary, schema/fact/safety/repetition/persona
  validation, kill switch, budget state and fallback telemetry.
- Display snapshot/provenance records and narrative memory summaries (as
  presentation references).
- `StoryThread` origination — the player-facing story arc; `storyThreadId` is a
  correlation key only (ADR-0100, ST3).
- Press/media content authoring: `PressArticle` / `PressArticleVersion` content
  model, `ToneProfileLibrary`, `PressPublicationPolicy`, conference/article
  templates (ADR-0065).
- Per-save display-snapshot/provenance log (ADR-0117).

## Public contract

### Commands (press content authoring — ADR-0065)

- `TriggerPressConference`
- `SelectConferenceResponse`
- `PublishPressArticle`
- `ApplyTabloidTone`
- `RetirePressStorylet` / `EnablePressStorylet`

### Domain events

- `NarrativeEventQueued`, `OutletPublishedStory` hand-off to Media Ecology (BCM
  exposed outputs); `StoryThread` is the exposed correlation key (ADR-0100).
- Press events (ADR-0065): `PressConferenceTriggered`,
  `ConferenceQuestionPresented`, `ConferenceResponseSelected`,
  `PressArticleDrafted`, `TabloidToneApplied`, `PressArticlePublished`,
  `PressArticleRetired`, `NarrativePressFallbackRendered`,
  `NarrativePressEnhancementRejected`.
- Dialogue planning events (ADR-0054): `DialogueIntentSelected`,
  `DialogueIntentRejected` (the owning gameplay context applies the effect and
  projects `DialogueEffectResult` back; Narrative does not own the mechanical
  consequence).

### Queries / read models

- Press read models (ADR-0065): `PressConferenceAgenda`,
  `PressArticleDisplaySnapshot`, `PressToneCatalog`, `PressStoryletCatalog`,
  `NarrativePressProvenance`.
- `NarrativeNewsFactProjection` — rebuildable, non-authoritative projection of
  consumed newsworthy facts (ADR-0076).
- `NarrativeDisplaySnapshot` (+ `NarrativeDisplaySnapshotId`,
  `NarrativeSnapshotRef`, `NarrativeReplayPolicy`,
  `NarrativeSnapshotRecoveryReason`) — persisted player-visible prose for
  reopen/replay (ADR-0117).

### Planning contracts (first implementation wave — ADR-0054)

`NarrativeSceneType`, `NarrativeSceneId`, `ActorRef`, `ActorNarrativeCard`,
`AuthoritativeFactRef`, `RelationshipEdgeSummary`, `NarrativeMemorySnippet`,
`DialogueIntent`, `DialogueIntentSelected`, `DialogueIntentRejected`,
`DialogueEffectResult`, `ForbiddenClaim`, `NarrativeContextCard`,
`NarrativeEnhancementRequest`, `NarrativeEnhancementResult`,
`NarrativeValidationReport`, `NarrativeProvenance`, `NarrativeDisplaySnapshot`,
`NarrativeSnapshotRef`, `NarrativeReplayPolicy`,
`NarrativeSnapshotRecoveryReason`, `NarrativeEvalCase`,
`FallbackCoverageManifest`, `NarrativeSceneFallbackFixture`,
`NewsworthyEventEnvelope`, `NewsworthinessMetadata`,
`NarrativeNewsFactProjection`, `NarrativeFactSourceAttribution`.

Contracts are TypeScript + Zod 4 when implementation resumes; exact wire shapes
remain implementation-gated (ADR-0054).

## Storage ownership

Narrative owns its own per-save display-snapshot/provenance store
(table/log/projection) plus its scene/storylet, press-content, story-thread and
news-fact-projection schema. No cross-context joins; all cross-context reads go
through public queries/read models (ADR-0121 no-shared-tables, ADR-0027
per-context storage isolation). `storyThreadId` is a correlation key only —
Narrative never joins another context's thread tables (ADR-0100, ST2). The
per-save snapshot store is part of the portable save/export contract (ADR-0117).

## Consumers / Producers

Consumes (read-only, via public queries/events):

- People / Persona & Skills — actor narrative cards, persona/relationship
  summaries.
- Squad & Player — `InjuryOccurred`, `ContractExpiring`, `PlayerSuspended`
  (external Discipline contract per ADR-0078; not redefined here) and player
  status facts.
- Club Management — `BoardPressureChanged`, budget/board/club-identity facts.
- Fan Ecology — fan group/reputation/mood facts.
- Match — committed key-event narration inputs (after commit only).
- Transfer — `TransferRumourPublished` and fixed transfer/agent facts.
- League Orchestration — `SeasonAdvanced` / deterministic clock facts.

Produces / consumed by:

- Notification — approved narrative display snapshots for delivery.
- Media Ecology — `OutletPublishedStory` hand-off and the shared `storyThreadId`
  correlation key.
- UI / web — display snapshots and dialogue context cards.

## Invariants

- Runtime LLM output is presentation-only and cannot create or change
  authoritative state (ADR-0030).
- Narrative never queries another context's tables directly and never emits
  commands that mutate authoritative state based on generated prose (ADR-0054).
- Mechanics read the selected `DialogueIntent`, never generated prose; every
  selectable intent names exactly one `effectOwnerContext`, one
  `effectPolicyKey`, a `mechanicalEffectBand` and an `effectVisibility` posture
  (ADR-0054).
- Player-choice labels, option/effect IDs, facts, rules, commands and
  finance/training/transfer/match/scheduling/legal copy stay
  deterministic/template-only (ADR-0054 FMX-88).
- Every scene/prose point in the runtime flow must appear in the
  `FallbackCoverageManifest` with a fallback template, fixture, deterministic
  render test and provenance assertion; the provider adapter is not
  release-ready unless an LLM-disabled pass renders the complete manifest.
- Revisitable prose (reopen, inbox/history, match-replay) renders the persisted
  `NarrativeDisplaySnapshot` text verbatim and does not call a provider; missing
  or corrupt snapshots use deterministic recovery templates with recovery
  provenance (ADR-0117).
- `CommentaryLine` / match-ticker prose references committed match events but
  never affects match event logs, `MatchFrame` generation, replay hashes or
  ratings (ADR-0117).
- Narrative is the sole originator of a `StoryThread`; Media Ecology never
  originates a story and owns `CoverageThread` against an existing
  `storyThreadId` (ADR-0100, ST1/ST3).
- Narrative consumes newsworthy facts only as self-contained published-language
  snapshots; it does not decide a football fact exists, create rumours, or own
  board pressure / injuries / contracts / suspensions, and does not join back
  into source contexts while rendering (ADR-0076).

## Open items

- Exact wire shapes / Zod schemas of all listed contracts are
  implementation-gated and not yet specified (ADR-0054).
- Exact numeric values for dialogue `mechanicalEffectBand` / effect policy keys
  are deferred to the owning gameplay domains (ADR-0054).
- `PlayerSuspended` schema is owned externally by Squad & Player (ADR-0078) and
  is not defined by the Narrative contracts; only its projection requirements
  are consumed (ADR-0076).
- No explicit Narrative-owned scene/storylet *command* set (e.g. for
  scene/storylet authoring or LLM enhancement requests) is enumerated in the
  sources beyond the press-authoring commands (ADR-0065); the broader command
  surface is left unspecified.
- The cross-producer effect-intent taxonomy (ADR-0126) may further constrain the
  dialogue intent/effect contract; its interaction is not transcribed here.

## Dependencies

- [[../09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]] (context definition; draft — do not implement yet)
- [[../09-Decisions/ADR-0030-llm-out-of-authoritative-state]] (state-isolation boundary)
- [[../09-Decisions/ADR-0076-narrative-newsworthiness-event-contracts]] (news-fact projection)
- [[../09-Decisions/ADR-0100-story-thread-ownership-and-cross-context-naming]] (`StoryThread` origination)
- [[../09-Decisions/ADR-0117-narrative-display-snapshot-replay-determinism-floor]] (display snapshots)
- [[../09-Decisions/ADR-0065-narrative-media-press-content-ownership]] (press/media subdomain)
- [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]] (no shared tables)
- [[../09-Decisions/ADR-0027-postgres-data-model]] (per-context storage isolation)
- Consumed by [[web]] and [[../bounded-context-map]] Notification / Media Ecology.
