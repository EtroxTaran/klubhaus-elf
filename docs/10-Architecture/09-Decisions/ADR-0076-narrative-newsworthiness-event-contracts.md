---
title: ADR-0076 Narrative Newsworthiness Event Contracts
status: proposed
tags: [adr, architecture, narrative, newsworthiness, events, contracts, ddd, fmx-83]
created: 2026-06-04
updated: 2026-06-05
type: adr
binding: false
supersedes:
superseded_by:
related:
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[ADR-0030-llm-out-of-authoritative-state]]
  - [[ADR-0043-notification-and-messaging-platform]]
  - [[ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[ADR-0065-narrative-media-press-content-ownership]]
  - [[ADR-0073-player-contract-lifecycle-fsm]]
  - [[ADR-0078-player-discipline-suspension-contracts]]
  - [[../../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
  - [[../../20-Features/feature-ai-narration-mvp-pillar]]
  - [[../../30-Implementation/ai-narration-contract-testing-framework]]
  - [[../../60-Research/newsworthiness-event-publication-semantics-2026-06-04]]
  - [[../../60-Research/raw-perplexity/raw-newsworthiness-event-publication-semantics-2026-06-04]]
  - [[../../60-Research/player-discipline-sub-aggregate-2026-06-05]]
  - [[../../60-Research/raw-perplexity/raw-player-discipline-sub-aggregate-2026-06-05]]
  - [[../../60-Research/domain-model-audit-and-backlog-2026-06-02]]
---

# ADR-0076: Narrative Newsworthiness Event Contracts

## Status

proposed

> **`proposed` / `binding: false`.** Nico selected FMX-83 as the next issue
> and said "go on"; D1-D4 below are therefore authored as recommended proposed
> defaults, not ratified decisions. This ADR closes gap G14 at the contract
> layer. It does not accept Narrative as a context, does not implement schemas,
> and does not define `PlayerSuspended`; ADR-0078 now proposes Squad & Player
> as the sole owner of that schema.

## Date

- Proposed: 2026-06-04 (FMX-83)

## Context

ADR-0054 proposes Narrative as the owner of scene/storylet selection,
`NarrativeContextCard` assembly, fallback templates, validation, provenance and
eval evidence. ADR-0065 proposes Narrative as the press/media content owner.
Both assume that authoritative contexts publish facts that Narrative can render,
but gap G14 asks for the missing published-language contracts:

- Who decides an injury, contract expiry, board-pressure change, transfer
  rumour or suspension is publishable/newsworthy?
- What payload shape lets Narrative render without joining back into
  authoritative tables?
- How do rumours carry confidence, attribution, decay and supersession?
- How does FMX avoid duplicate ownership of `PlayerSuspended` between FMX-83
  and the Discipline issue?

Grounded in
[[../../60-Research/newsworthiness-event-publication-semantics-2026-06-04]]
(raw:
[[../../60-Research/raw-perplexity/raw-newsworthiness-event-publication-semantics-2026-06-04]]).

Scope:

- Narrative-facing integration-event envelope and payload checklist.
- Four publication facets: `InjuryOccurred`, `ContractExpiring`,
  `BoardPressureChanged`, `TransferRumourPublished`.
- `PlayerSuspended` projection requirements only.
- `NarrativeNewsFactProjection` consumer shape and invariants.
- Zod 4 future implementation guidance.

Out of scope:

- FMX-80 player-discipline state machine and `PlayerSuspended` schema
  (proposed in [[ADR-0078-player-discipline-suspension-contracts]]).
- FMX-82 media outlet cadence/stance/reach/reliability rules.
- FMX-87 dialogue-intent effect matrix.
- Final salience weights, article volume, cooldowns and content calibration.
- Runtime code, package layout or dependency changes.

## Decision options

### D1 - Event model

| Option | Description | Trade-off |
|---|---|---|
| **A. Distinct publisher events + shared projection** | Each source context publishes its own event family; Narrative folds them into a shared projection/checklist. | **Recommended default.** Preserves source ubiquitous language and ownership while keeping Narrative consumption uniform. |
| B. Generic `NarrativeFactPublished` | Every source emits one generic event type with a large union payload. | Easy consumer path, but weak source language and likely becomes a dumping ground. |
| C. Hybrid generic wrapper + source event | Source event is wrapped into a generic transport event. | Flexible but doubles vocabulary for little docs-phase value. |

### D2 - Transfer rumour origin

| Option | Description | Trade-off |
|---|---|---|
| **A. Transfer publishes rumour facts** | Transfer owns rumour existence/stage/confidence and emits `TransferRumourPublished`. | **Recommended default.** Keeps market truth in Transfer; Narrative only renders. |
| B. Narrative derives rumours from transfer signals | Narrative inspects public facts and creates speculative rumours. | More flavour, but makes Narrative an implicit market-state owner. |
| C. Split official interest vs media speculation | Transfer publishes official/agent signals; Media/Narrative may create low-confidence speculation from explicit rules. | Future-flexible but needs FMX-82 media policy first. |

### D3 - `PlayerSuspended`

| Option | Description | Trade-off |
|---|---|---|
| **A. Consume FMX-80 schema, list requirements here** | FMX-83 defines no suspension event shape, only the data Narrative will need. | **Recommended default.** Removes the duplicate-schema risk called out by the audit. ADR-0078 now supplies the proposed canonical schema. |
| B. Block FMX-83 until FMX-80 lands | Avoided delay while FMX-80 was open; now historical option because ADR-0078 exists as a proposal. |
| C. Define provisional suspension schema here | Fastest for Narrative, but likely creates divergent authoritative schemas. |

### D4 - Payload granularity

| Option | Description | Trade-off |
|---|---|---|
| **A. Banded display snapshot** | Include display names, bands, source/confidence/legal/privacy metadata and salience inputs; no raw internals. | **Recommended default.** Realistic, privacy-aware and renderable without joins. |
| B. Thin IDs-only payload | Consumers query back for detail. | Violates the no-cross-context-join goal. |
| C. Full raw domain payload | Consumers get every source detail. | Overexposes internals, privacy/medical/legal detail and schema volatility. |

## Decision (proposed default)

**D1 = A, D2 = A, D3 = A, D4 = A.**

Source domains own publication decisions and emit distinct, self-contained
integration events. Narrative consumes them into `NarrativeNewsFactProjection`
and never joins back into authoritative state while rendering.

## Event envelope

Every Narrative-facing newsworthy event uses the same envelope:

```text
NewsworthyEventEnvelope =
  eventId
  eventType
  eventVersion
  producerContext
  aggregateRef
  occurredAt
  publishedAt
  schemaVersion
  sourceTraceRef
  idempotencyKey
  storyThreadId
  supersedesEventId?
  audienceScopeHint
  decayHint
  cooldownKey?
```

Every payload carries the same metadata block:

```text
NewsworthinessMetadata =
  salienceInputs
  sourceType
  sourceConfidence
  attributionRequired
  privacyDetailLevel
  legalRiskClass
  templateCompatibilityTag?
```

Definitions:

- `sourceType`: `official`, `clubStatement`, `agent`, `journalist`,
  `mediaOutlet`, `supporterSignal`, `internalProjection`, `regulator`.
- `sourceConfidence`: `confirmed`, `high`, `medium`, `low`, `speculative`.
- `audienceScopeHint`: `privateInbox`, `clubLocal`, `leagueWide`,
  `continental`, `global`.
- `decayHint`: `none`, `short`, `medium`, `long`, `untilSuperseded`.
- `privacyDetailLevel`: `public`, `limited`, `privateRedacted`.
- `legalRiskClass`: `none`, `sensitive`, `highReview`.

## Event families

### `SquadAndPlayer.InjuryOccurredV1`

Purpose: publish an injury as a self-contained football fact for reports,
media, fan/board/player dialogue and weekly summaries.

Payload:

```text
InjuryOccurredV1 =
  envelope
  metadata
  playerRef
  playerDisplayNameSnapshot
  clubRef
  clubDisplayNameSnapshot
  occurrenceContext
  matchRef?
  trainingSessionRef?
  injuryLocationBand
  injuryTypeBand
  severityTimeLossBand
  returnWindowBand
  recurrenceFlag
  availabilityImpactBand
  medicalPrivacyFlag
```

`severityTimeLossBand` uses the football injury consensus bins as game bands:
`none`, `oneToThreeDays`, `fourToSevenDays`, `eightToTwentyEightDays`,
`twentyNineToNinetyDays`, `ninetyOneToOneEightyDays`, `moreThanOneEightyDays`.
Career-ending and rare catastrophic cases are separate authored event types, not
normal injury-news defaults.

### `SquadAndPlayer.ContractExpiringV1`

Purpose: publish contract expiry pressure without Narrative or Notification
querying Squad/Transfer/Regulations. This aligns with ADR-0073's existing
`ContractExpiring` lifecycle payload; FMX-83 adds Narrative metadata, not a
second source of contract truth.

Payload:

```text
ContractExpiringV1 =
  envelope
  metadata
  playerRef
  playerDisplayNameSnapshot
  clubRef
  clubDisplayNameSnapshot
  contractRef
  expiryWindowBand
  monthsRemainingBand
  talksStatusBand
  extensionOptionFlag
  playerImportanceBand
  publicFinancialDisclosureBand
  recommendedNarrativeHooks
  nextRefreshTrigger
  sourceRuleSetVersion
```

### `ClubManagement.BoardPressureChangedV1`

Purpose: publish a board/ownership pressure movement as a banded public-facing
fact for media, board scenes and summaries.

Payload:

```text
BoardPressureChangedV1 =
  envelope
  metadata
  clubRef
  clubDisplayNameSnapshot
  subjectRef
  subjectDisplayNameSnapshot
  pressureBand
  previousPressureBand?
  changeDirection
  triggerReasonBand
  fixtureContextRef?
  tableContextBand?
  backingStatementFlag
  denialStatementFlag
  boardPatienceBand?
```

`pressureBand`: `none`, `watching`, `concerned`, `underPressure`,
`critical`, `terminal`. `terminal` should normally be a pre-decision state, not
a hidden dismissal outcome.

### `Transfer.TransferRumourPublishedV1`

Purpose: publish an attributed rumour object that can decay, be reinforced,
confirmed, contradicted or superseded.

Payload:

```text
TransferRumourPublishedV1 =
  envelope
  metadata
  playerRef
  playerDisplayNameSnapshot
  currentClubRef?
  currentClubDisplayNameSnapshot?
  linkedClubRef
  linkedClubDisplayNameSnapshot
  rumourStageBand
  storyType
  transferWindowContext
  feeBand?
  wageBand?
  sourceAttribution
  reinforcementCount
  contradictionCount
  expiresAt?
  confirmationEventRef?
```

`storyType`: `interest`, `scouting`, `bidPrepared`, `bidRejected`,
`agentTalks`, `contractTerms`, `loanInterest`, `freeAgentInterest`.
Narrative may render rumour flavour only from this event; it may not create
authoritative transfer interest from prose.

### `PlayerSuspended` projection requirements only

FMX-83 does not define the event name, envelope or state machine for
`PlayerSuspended`. ADR-0078 proposes Squad & Player as the schema and
availability owner.

Narrative requires at least:

- player and club display snapshots;
- reason band;
- competition scope;
- suspension duration band;
- start/end window or match-count band;
- appeal status;
- source/regulator confidence;
- legal/privacy risk class;
- story thread/supersession fields.

## Narrative consumer contract

`NarrativeNewsFactProjection` is a rebuildable, non-authoritative projection:

```text
NarrativeNewsFactProjection =
  eventId
  eventType
  eventVersion
  storyThreadId
  producerContext
  publishedAt
  occurredAt
  audienceScopeHint
  decayHint
  salienceInputs
  sourceType
  sourceConfidence
  attributionRequired
  privacyDetailLevel
  legalRiskClass
  displaySnapshot
  domainPayloadSnapshot
  projectionStatus
  supersedesEventId?
  closedByEventId?
```

Rules:

- idempotent upsert by `eventId`;
- grouped and superseded by `storyThreadId`;
- stores immutable source snapshots, not mutable truth;
- may derive storylet eligibility/cooldown fields;
- does not perform cross-context joins;
- does not emit domain commands or mutate authoritative facts;
- generated prose/provenance from ADR-0054 attaches to display snapshots, not
  to the source fact.

## Zod 4 implementation guidance

When implementation resumes:

- define each event as a top-level `z.strictObject()` boundary schema;
- use `z.discriminatedUnion('eventType', [...])` for the consumer union;
- export JSON Schema from the same Zod schemas via `z.toJSONSchema()` where API
  or provider structured-output schemas are needed;
- use schema metadata/descriptions for provider/test documentation;
- use additive optional fields for compatible changes;
- use a new `eventVersion` for breaking semantic changes;
- reject unknown keys at context boundaries.

No dependency is added or upgraded by this docs-only ADR.

## Invariants

| # | Invariant |
|---|---|
| C1 | The source context decides that a fact exists and is publishable/newsworthy. |
| C2 | Narrative consumes immutable snapshots and never joins back into source context tables while rendering. |
| C3 | Every event is self-contained enough for a fallback template, a press/media storylet and an inbox/feed snapshot. |
| C4 | Rumours carry source confidence, attribution, decay and supersession; Narrative never invents transfer truth. |
| C5 | Medical, financial, legal and pressure details are banded unless already explicitly public in-world. |
| C6 | `PlayerSuspended` is not defined here; ADR-0078 / Squad & Player is the sole proposed schema owner. |
| C7 | Events publish through ADR-0028 transactional outbox after the source transaction commits; consumers are idempotent and replay-safe. |
| C8 | Runtime LLM may phrase only the rendered surface; it cannot create, alter or confirm news facts. |

## Consequences

Positive:

- Closes G14 with a standard event-publication template.
- Gives Narrative/Notification enough data to render without source joins.
- Keeps source-domain ownership clear and DDD language intact.
- Reduces duplication risk around suspensions and contract-expiry warnings.
- Gives FMX-82 and FMX-87 stable inputs without deciding their policies.

Negative / constraints:

- Every source domain must now define a publication facet, not just an internal
  event.
- Narrative projections become version-sensitive and need replay/idempotency
  tests.
- Salience weights and cooldowns remain unresolved until media/content
  calibration.
- ADR-0078 must be ratified before suspension stories can ship from the
  proposed `PlayerSuspendedV1` schema.

## Supersedes

None.

## Related Docs

- [[../../60-Research/newsworthiness-event-publication-semantics-2026-06-04]]
- [[../../60-Research/raw-perplexity/raw-newsworthiness-event-publication-semantics-2026-06-04]]
- [[ADR-0054-narrative-context-and-ai-narration-framework]]
- [[ADR-0065-narrative-media-press-content-ownership]]
- [[ADR-0073-player-contract-lifecycle-fsm]]
- [[../../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
- [[../../20-Features/feature-ai-narration-mvp-pillar]]
- [[../../30-Implementation/ai-narration-contract-testing-framework]]
