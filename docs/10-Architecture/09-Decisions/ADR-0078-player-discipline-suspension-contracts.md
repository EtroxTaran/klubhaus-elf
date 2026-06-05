---
title: ADR-0078 Player Discipline Suspension Contracts
status: proposed
tags: [adr, architecture, discipline, suspension, appeals, squad, match, regulations, narrative, ddd, fmx-80]
created: 2026-06-05
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
  - [[ADR-0052-people-persona-and-skills-context]]
  - [[ADR-0056-regulations-compliance-context]]
  - [[ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[ADR-0076-narrative-newsworthiness-event-contracts]]
  - [[../state-machines/match]]
  - [[../state-machines/player-discipline]]
  - [[../../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
  - [[../../60-Research/player-discipline-sub-aggregate-2026-06-05]]
  - [[../../60-Research/raw-perplexity/raw-player-discipline-sub-aggregate-2026-06-05]]
  - [[../../60-Research/domain-model-audit-and-backlog-2026-06-02]]
---

# ADR-0078: Player Discipline Suspension Contracts

## Status

proposed

> **`proposed` / `binding: false`.** Nico selected FMX-80 and approved the
> planning defaults D1-D4 live on 2026-06-05. This ADR closes audit gap G18 at
> the ownership/contract layer. It does not add runtime code, does not ratify a
> new bounded context and does not lock numeric thresholds or ban lengths.

## Date

- Proposed: 2026-06-05 (FMX-80)

## Context

Match owns match events and in-match sending-off consequences. Regulations owns
the versioned rule/sanction catalog and exposes published verdict/profile
contracts. Squad & Player owns player records and player availability. FMX-83
requires a canonical `PlayerSuspended` event but deliberately did not define it.

Gap G18 asks who owns:

- card-accumulation counters;
- suspension-window availability;
- straight-red appeal state;
- card -> suspension threshold processing;
- the canonical suspension event consumed by Narrative and Notification.

Grounded in
[[../../60-Research/player-discipline-sub-aggregate-2026-06-05]]
(raw:
[[../../60-Research/raw-perplexity/raw-player-discipline-sub-aggregate-2026-06-05]]).

Scope:

- Player discipline ownership split.
- Published contracts for card facts, rule profiles, suspensions and appeals.
- `PlayerSuspended` canonical payload.
- State-machine pointer for availability/appeal lifecycle.
- Narrative/Notification consumer boundary.

Out of scope:

- Final numeric yellow thresholds, ban lengths, appeal probabilities or
  frivolous-appeal penalties.
- Staff bans, club fines, hearings, points deductions or regulator-case
  management.
- User-interface design for the appeal inbox or squad-screen warning states.
- Runtime implementation, database schema and package boundaries.

## Decision options

### D1 - Accumulation and suspension owner

| Option | Description | Trade-off |
|---|---|---|
| **A. Squad & Player process manager/sub-aggregate** | Match emits card facts; Regulations supplies profiles; Squad & Player owns player ledgers, suspension windows, appeals and eligibility. | **Selected.** Keeps availability truth with the squad owner and matches ADR-0056's consumer-owned process-manager rule. |
| B. Regulations owns discipline state | Regulations owns card counters, suspensions and appeal state. | Strong blank-slate DDD option, but contradicts FMX's current split where Regulations owns profiles/verdicts and consumers own applied process state. |
| C. New Discipline bounded context | Separate context owns all discipline and appeals. | Future-flexible, but too much boundary weight for MVP player availability only. |

### D2 - MVP appeal scope

| Option | Description | Trade-off |
|---|---|---|
| **A. Straight-red appeals only** | Manager may appeal eligible straight-red sanctions; accumulation and second-yellow cases are automatic. | **Selected.** Matches common practice and creates one meaningful choice without admin sprawl. |
| B. No appeals in MVP | All discipline is automatic. | Simpler, but misses a familiar high-salience manager decision. |
| C. Broad appeals | Straight red, second yellow and accumulation can all be appealed. | More drama, but high complexity and weak realism for routine cautions. |

### D3 - Suspension scope model

| Option | Description | Trade-off |
|---|---|---|
| **A. Profile-driven scopes** | Regulations profiles define `competition`, `domestic` or `all` scope per trigger/offence band. | **Selected.** Handles league/cup/tournament variance without hard-coding competition names. |
| B. Competition-only | Every suspension is served only in the source competition. | Too weak for domestic red-card patterns. |
| C. Global by default | Every suspension blocks all competitions. | Too punitive and unrealistic for ordinary accumulation. |

### D4 - Appeal flow timing

| Option | Description | Trade-off |
|---|---|---|
| **A. Pre-next-relevant-fixture resolution** | Appeal resolves in post-match processing before the next fixture that could consume the suspension. | **Selected.** Keeps line-up eligibility deterministic and avoids pending-appeal ambiguity at lock time. |
| B. Multi-day asynchronous hearing | Appeal can remain pending across several calendar days/fixtures. | More realistic for deep modes, but adds scheduling edge cases to MVP. |
| C. Instant post-match auto-result | Appeal outcome resolves immediately when selected. | Simple, but less diegetic and removes timing policy from Regulations. |

## Decision (proposed default)

**D1 = A, D2 = A, D3 = A, D4 = A.**

FMX models player discipline as a **Squad & Player-owned process manager and
sub-aggregate**, not a new bounded context. Match publishes immutable card
facts. Regulations publishes versioned discipline profiles and verdicts. Squad
& Player owns the player ledger, suspension windows, appeal cases and line-up
eligibility projection. Narrative and Notification consume self-contained
published events.

## Ownership split

| Concern | Owner | Contract |
|---|---|---|
| In-match card and sending-off facts | Match | `CardIssued`, match event log, sent-off player cannot continue in that match. |
| Rule thresholds, scopes, appeal eligibility and sanction catalog | Regulations | `DisciplineProfile` query/read model, profile version copied/snapshotted for save determinism. |
| Player card ledger, suspension window, appeal case and eligibility | Squad & Player | `PlayerDisciplineLedger`, `SuspensionWindow`, `DisciplineAppealCase`, `PlayerEligibilitySnapshot`. |
| Suspension/appeal user communication | Narrative / Notification | Consume `PlayerSuspended`, `DisciplineAppealSubmitted`, `DisciplineAppealResolved`, `SuspensionServed`; no rule calculation. |

No cross-context joins are allowed. Consumers use published events or read-model
queries with opaque references.

## Published contracts

### `Match.CardIssuedV1`

Purpose: record an immutable match fact. It is not a suspension command.

```text
CardIssuedV1 =
  eventId
  eventVersion
  producerContext = Match
  matchRef
  fixtureRef
  competitionRef
  seasonRef
  playerRef
  clubRef
  minute
  cardType: yellow | secondYellowRed | straightRed
  reasonBand
  severityBand
  refereeDecisionTraceRef?
  priorCautionInMatch
  occurredAt
```

`reasonBand` stays IP-clean and game-oriented: `persistent_foul`,
`reckless_challenge`, `tactical_foul`, `dissent`, `time_wasting`,
`denial_of_obvious_chance`, `serious_foul_play`, `violent_conduct`,
`offensive_language`, `other`.

### `Regulations.DisciplineProfileV1`

Purpose: expose rule-profile data without making Regulations the owner of
per-player applied state.

```text
DisciplineProfileV1 =
  profileId
  profileVersion
  regulatorRef
  competitionRef
  competitionGroupRef
  effectiveSeasonRef
  accumulationPolicy
  redCardPolicy
  scopePolicy
  appealEligibilityPolicy
  servePolicy
  resetPolicy
  sourceTraceRef
```

The profile may include thresholds, cut-off windows, good-behaviour reductions,
offence bands and appeal windows as data. FMX-80 does not set the numbers.

### `SquadAndPlayer.PlayerDisciplineLedger`

Purpose: player-specific applied state.

```text
PlayerDisciplineLedger =
  playerRef
  clubRef
  seasonRef
  competitionGroupRef
  profileId
  profileVersion
  yellowAccumulationCount
  cautionHistoryRefs
  activeSuspensionRefs
  pendingAppealRefs
  warningBand
  updatedAt
```

The ledger is updated only by Squad & Player processing `CardIssuedV1` and
Regulations profile responses.

### `SquadAndPlayer.PlayerSuspendedV1`

Purpose: canonical self-contained suspension event for eligibility,
Notification and Narrative.

```text
PlayerSuspendedV1 =
  eventId
  eventVersion
  producerContext = SquadAndPlayer
  playerRef
  playerDisplayNameSnapshot
  clubRef
  clubDisplayNameSnapshot
  suspensionRef
  sourceCardRefs
  sourceMatchRef
  sourceCompetitionRef
  disciplineProfileRef
  reasonBand
  severityBand
  triggerType: yellowAccumulation | secondYellow | straightRed
  scope: competition | domestic | all
  competitionRefs
  startsAfterFixtureRef?
  matchesTotal
  matchesRemaining
  durationBand
  appealStatus: notApplicable | available | submitted | upheld | rejected | rescinded | expired
  sourceType
  sourceConfidence
  privacyDetailLevel
  legalRiskClass
  storyThreadId
  supersedesEventId?
  occurredAt
  publishedAt
```

`matchesTotal` and `matchesRemaining` are authoritative availability facts.
`durationBand` is the display/narrative band. Narrative consumes the snapshot
and never recalculates it.

### Appeal and served events

```text
DisciplineAppealSubmittedV1 =
  appealRef
  suspensionRef
  playerRef
  clubRef
  sourceCardRef
  submittedAt
  deadlineAt
  evidenceBand

DisciplineAppealResolvedV1 =
  appealRef
  suspensionRef
  playerRef
  clubRef
  outcome: upheld | rejected | rescinded
  matchesTotalAfterDecision
  matchesRemainingAfterDecision
  resolvedAt
  rationaleBand

SuspensionServedV1 =
  suspensionRef
  playerRef
  clubRef
  servedByFixtureRefs
  completedAt
```

MVP appeal eligibility is only `straightRed` where the Regulations profile marks
the reason/severity band as appealable.

## State machine

The FSM is defined in [[../state-machines/player-discipline]].

High-level flow:

```text
CardIssued
  -> Squad & Player loads DisciplineProfile
  -> ledger updated
  -> no suspension | appeal_available | suspended
  -> appeal resolved before next relevant fixture
  -> suspension served by relevant fixture count
  -> PlayerEligibilitySnapshot becomes eligible again
```

## Narrative and Notification boundary

ADR-0076 consumes `PlayerSuspendedV1` as the canonical schema.
Narrative may render:

- automatic accumulation suspension story;
- red-card suspension story;
- appeal available prompt;
- appeal submitted/outcome story;
- suspension served/return-available story.

Narrative and Notification may not:

- create or modify card facts;
- compute thresholds;
- decide appeal eligibility;
- decrement remaining matches;
- infer availability by joining Match, Squad and Regulations state.

## Persistence and replay guidance

When implementation resumes:

- store discipline ledgers and suspensions in the per-save Squad & Player schema
  per ADR-0027;
- snapshot the `DisciplineProfile` version used to create each suspension;
- apply events idempotently by `eventId` / `sourceCardRefs`;
- decrement `matchesRemaining` only from relevant fixture-completed facts;
- expose `PlayerEligibilitySnapshot` as a read model for Match line-up lock and
  UI;
- publish suspension/appeal events through ADR-0028's transactional outbox.

No dependency is added or upgraded by this docs-only ADR.

## Invariants

| # | Invariant |
|---|---|
| D1 | Match is the sole owner of card facts and in-match sending-off state. |
| D2 | Regulations owns rule/profile data, not per-player discipline counters. |
| D3 | Squad & Player owns player availability and the canonical `PlayerSuspended` event. |
| D4 | A suspended player cannot be selected at Match line-up lock for an in-scope fixture. |
| D5 | Appeals in MVP are straight-red only and resolve before the next relevant fixture. |
| D6 | Suspension scope is profile-driven: `competition`, `domestic` or `all`. |
| D7 | Narrative/Notification consume self-contained snapshots and perform no discipline calculation. |
| D8 | Numeric thresholds, ban lengths and appeal probabilities are calibration/profile data, not hard-coded architecture. |

## Consequences

- FMX-80 closes G18 and unblocks FMX-83's `PlayerSuspended` dependency.
- The solution adds no new bounded context for MVP.
- Regulations needs a future fictional discipline-profile catalog.
- Squad & Player becomes the practical availability source for line-up lock,
  squad planning and player profile discipline summaries.
- A future separate Discipline context remains possible if regulator-case
  management expands beyond player availability.

## Related

- [[../../60-Research/player-discipline-sub-aggregate-2026-06-05]]
- [[../../60-Research/raw-perplexity/raw-player-discipline-sub-aggregate-2026-06-05]]
- [[../state-machines/player-discipline]]
- [[ADR-0052-people-persona-and-skills-context]]
- [[ADR-0056-regulations-compliance-context]]
- [[ADR-0076-narrative-newsworthiness-event-contracts]]
- [[../../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
