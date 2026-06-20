---
title: Scouting module
status: draft
tags: [architecture, module, scouting, recruitment, intelligence-context]
context: scouting
created: 2026-06-20
updated: 2026-06-20
type: module
binding: false
related: [[../05-Building-Blocks]], [[../bounded-context-map]], [[../09-Decisions/ADR-0064-scouting-activity-context]], [[../09-Decisions/ADR-0027-postgres-data-model]], [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
---

# Scouting Boundary

## Purpose

Supporting / intelligence bounded context that owns scout *activity* —
assignments, the scout-report lifecycle, network coverage, persistent
long-/short-lists, and the confidence-gated hidden-flag reveal. It *feeds but
does not control* Transfer (negotiation) and Squad & Player (assessment), and
publishes facts to consumers rather than exposing internal tables (ADR-0064).

## Owns

- **`ScoutAssignment` aggregate** (per-save, per-scout): scope (region / nation /
  competition / club / player) + type filters + purpose (recruitment /
  youth-discovery / *opposition — reserved hook*), mode (ongoing / fixed),
  progress, cost; FSM `active → completed | expired | cancelled | recalled`.
  Scout identity referenced as a People `ActorRef` — never owned here.
- **`ScoutingReport` aggregate** (per-save, per-club-per-player): per-club
  scouted *view* distinct from player truth; `knowledge%` confidence;
  opacity-layered banded/numeric estimates; recommendation; role/tactic-fit +
  valuation-band confidence inputs; FSM `filed → refreshed → aged → stale →
  archived` with a last-scouted clock.
- **`CoveragePlan` aggregate** (per-save, per-club): region / league coverage
  tiers (fully / partially / uncovered) driving discovery probability + baseline
  report error.
- **`CandidateList` aggregate** (per-save, per-club): persistent long-list +
  short-list with per-entry trust meter, last-update, role/tactic Impact context
  and persistence policy.
- **`HiddenFlagRevealLedger`** (per-save, per-club-per-player): which hidden
  flags (injury-proneness, big-match temperament, professionalism, adaptability,
  ambition) have crossed their knowledge% reveal threshold for this club —
  *reveal state only*, never the flag truth.
- **Process Manager / Saga** for the weekly scouting loop: assignment tick →
  knowledge accumulation → report aging/staleness → coverage recompute → list
  refresh → hidden-flag reveal evaluation → discovery of new candidates.

## Public contract

Commands (ADR-0064 draft):

- `AssignScoutToRegion`, `RecallScout`, `CancelScoutAssignment`
- `RequestPlayerScouting`, `RefreshScoutReport`
- `AddPlayerToLongList`, `PromotePlayerToShortList`, `RemoveFromList`,
  `SetListPersistencePolicy`
- `AllocateScoutingBudget`
- `OppositionScoutingRequested` — **reserved placeholder** (recruitment-only at
  MVP; not implemented)

Domain events (ADR-0064 draft):

- `ScoutAssigned` / `ScoutAssignmentCompleted` / `ScoutAssignmentExpired`
- `ScoutReportFiled` *(Transfer: valuation-band confidence; Squad & Player:
  Impact-Lens scouting input per §3.1; Notification: inbox copy)*
- `ScoutReportRefreshed` / `ScoutReportBecameStale`
- `LongListUpdated` / `ShortListUpdated`
- `HiddenFlagSurfaced` *(reveal-state only; Squad & Player + Transfer +
  Notification)*
- `CandidateIdentifiedForRecruitment` *(Transfer — opens a target via
  Reference+Snapshot)*
- `ExternalYouthProspectIdentified` *(Youth Academy intake gate, ADR-0060)*
- `CoverageTierChanged` *(internal projection event)*
- `ScoutingBudgetAllocated` *(Club Management ledger via ACL, ADR-0050)*

Queries / read models (ADR-0064 draft):

- `ScoutReport`, `LongListBoard`, `ShortListBoard`, `ScoutCoverageMap`,
  `ScoutAssignmentBoard`, `RecruitmentNeedsBoard`, `HiddenFlagRevealState`

## Storage ownership

- Per-save schema only (`save_<uuidv7hex>` per ADR-0027); no platform-scope
  cross-save state.
- Owns reports + knowledge% + coverage + lists + hidden-flag *reveal* ledger.
- No shared tables and no cross-context joins (ADR-0121 + §3.1): the scouted
  view is populated from published events / queries; consumers receive views and
  accept eventual consistency.
- Events delivered through the ADR-0028 transactional outbox.

## Consumers / Producers

Consumers of Scouting outputs:

- **Transfer** — `CandidateIdentifiedForRecruitment` (Snapshot) +
  `ScoutReportFiled` (valuation-band confidence).
- **Squad & Player** — `ScoutReportFiled` / `HiddenFlagSurfaced` as Impact-Lens
  inputs (§3.1).
- **Youth Academy** (ADR-0060) — `ExternalYouthProspectIdentified`.
- **Notification** (ADR-0043) — report / new-target inbox rendering.
- **Club Management** (ADR-0050) — `ScoutingBudgetAllocated` via ACL.

Facts Scouting consumes (no table joins; ACL on each):

- `PersonSkillProfile` / scout `ActorRef` from People (ADR-0052).
- `ActiveScoutRoster` from Staff Operations (ADR-0053).
- `PlayerTruthSnapshot` from Squad & Player (masked/banded by knowledge%).
- `MarketValuationBand` from Transfer.
- `EligibilityForTransfer` / work-permit status from Regulations & Compliance
  (ADR-0056).
- `SeasonAdvanced` from League Orchestration (weekly tick + report aging).
- `SaveSnapshotInitialised` at save creation (ADR-0027 + ADR-0051).

## Invariants

- The scouted view (`ScoutingReport`) is strictly separate from the player's
  true profile; truth is masked/banded by knowledge% *inside* Scouting's read
  view — Scouting never joins across context tables (§3.1 + ADR-0121).
- Hidden-flag *truth* is never copied into Scouting; only reveal-state (threshold
  crossed yes/no per club-player) is stored. A revealed flag's display reads
  truth from People / Squad & Player at query time.
- Scouting owns scout *activity*, not scout *identity* (People), hire/fire/wage
  (Staff Operations), negotiation/valuation bands (Transfer), player base data /
  Impact-Lens (Squad & Player), youth intake/cohort (Youth Academy), finance
  ledger entries (Club Management), inbox delivery (Notification), or
  eligibility rules (Regulations & Compliance).
- Opposition / match-prep scouting is recruitment-only at MVP;
  `OppositionScoutingRequested` is a reserved hook, the full model deferred.
- The weekly loop uses a dedicated RNG sub-label `ScoutingRng(saveId, clubId,
  week)` of `WorldRng` (ADR-0018 §3); no cross-RNG draws, no `Math.random` /
  `Date.now` in simulation paths; report aging uses the deterministic clock.
- `ScoutAssignment` and `ScoutingReport` FSMs are deterministic; the concrete
  FSM library is an implementation-phase selection.
- IP-clean: no real scout / agency / data-provider names embedded as samples
  (GD-0015 + ADR-0007).

## Dependencies

- [[../09-Decisions/ADR-0064-scouting-activity-context]] (draft — context
  definition; do not implement yet)
- [[../09-Decisions/ADR-0027-postgres-data-model]] (per-save schema convention)
- [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
  (no shared tables / no cross-context joins)
- [[../09-Decisions/ADR-0019-modular-monolith-ddd]] (modular-monolith ground rules)
- [[../09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]] (`ScoutingRng`)
- [[../09-Decisions/ADR-0028-postgres-transactional-outbox]] (event delivery)
- [[../09-Decisions/ADR-0052-people-persona-and-skills-context]] (scout identity)
- [[../09-Decisions/ADR-0053-staff-operations-context]] (active-scout roster)
- [[../09-Decisions/ADR-0050-club-economy-accounting-ledger]] (budget expense via ACL)
- [[../09-Decisions/ADR-0060-youth-academy-context]] (youth intake gate)
- [[../09-Decisions/ADR-0056-regulations-compliance-context]] (work-permit hint)
- [[../09-Decisions/ADR-0043-notification-and-messaging-platform]] (inbox rendering)

## Open items

- **Opposition-scouting model.** `OppositionScoutingRequested` is a reserved
  placeholder only; the full opposition / match-prep model and its Tactics /
  Match coupling are deferred to a later Tactics-adjacent ticket (ADR-0064 HITL
  decision 2; FMX-157 recommends Scouting produces the report, Tactics
  interprets it). Contract unspecified at this stage.
- **Upstream-ratification gaps.** People (ADR-0052) and Youth Academy (ADR-0060)
  are still draft/proposed; until they ratify, scout identity is stubbed from the
  assignment roster and `ExternalYouthProspectIdentified` is emitted but
  unconsumed (ADR-0064 Consequences).
- **FSM library selection** (XState v5 vs in-house deterministic FSM) is left to
  the implementation phase (ADR-0064 Determinism & storage rules).
