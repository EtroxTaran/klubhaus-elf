---
title: ADR-0080 Opposition-template AI Consumption Contract
status: accepted
tags: [adr, architecture, tactics, opposition, ai, match, determinism, replay, fmx-67]
created: 2026-06-05
updated: 2026-06-11
type: adr
binding: false
supersedes:
superseded_by:
related:
  - [[ADR-0055-tactics-context]]
  - [[ADR-0026-match-frame-contract]]
  - [[ADR-0067-set-piece-variant-selection-determinism]]
  - [[ADR-0071-ai-world-simulation-context-and-drift-contract]]
  - [[ADR-0072-in-match-control-seam]]
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0049-swappable-spatial-event-match-engine]]
  - [[../bounded-context-map]]
  - [[../state-machines/match]]
  - [[../../50-Game-Design/tactics-system]]
  - [[../../60-Research/tactics-and-formations]]
  - [[../../60-Research/determinism-and-replay]]
  - [[../../60-Research/opposition-template-ai-consumption-contract-2026-06-05]]
  - [[../../60-Research/raw-perplexity/raw-opposition-template-ai-consumption-2026-06-05]]
---

# ADR-0080: Opposition-template AI Consumption Contract

## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `proposed`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

> **History (pre-ratification banner, demoted 2026-06-11 per ADR-0092 / FMX-143):**
> **`proposed` / `binding: false`.** FMX-67 closes E2 gap **G11** by pinning how
> AI match-prep consumes Tactics-owned `OppositionTemplate` records and how Match
> freezes the selected result. **Nico chose D1-D3 live on 2026-06-05 = split
> event model, final immutability at `lineup_locked`, `WorldAiMgmtRng` sub-label.**
> No new bounded context and no map-structure change. Tactics owns the
> deterministic catalog selection and selection event; AI-management contexts own
> the planning context; Match only consumes the frozen result.

## Date

- Proposed: 2026-06-05 (FMX-67)

## Context

ADR-0055 owns the persistent Tactics catalog: tactic presets, set-piece routine
variants, `OppositionTemplate` records, role/duty configurations and
`TacticalIdentityFingerprint`. Match owns match lifecycle, simulation and
results. The match state machine freezes line-up and tactic at `lineup_locked`;
ADR-0026 keeps the replay boundary deterministic; ADR-0067 requires set-piece
variant selection to be pure over the frozen `TacticSnapshot`.

The remaining gap is **who chooses the opponent-specific template and when that
choice becomes immutable**. If Match resolves templates by reading live Tactics
or AI planning state at replay time, two replays can diverge after template edits
or AI-model changes. If the plan is fixed too early, the system cannot react to
the actual opponent lineup and shape.

Research basis:
[[../../60-Research/opposition-template-ai-consumption-contract-2026-06-05]]
and raw capture
[[../../60-Research/raw-perplexity/raw-opposition-template-ai-consumption-2026-06-05]].

## Options Considered

### D1 - Consumption model

| Option | Description | Trade-off |
|---|---|---|
| A. Match selects at lock-time | Match queries Tactics/AI and resolves the template at `lineup_locked`. | Simple for Match setup, but puts planning policy in Match and creates a temptation to read mutable catalog/planning state during replay. |
| B. Early fixed pre-match | AI planning selects at `lineup_open` or MD-1 and the result cannot change. | Stable previews, but weak response to actual lineup/shape and late team news. |
| **C. Split event model (chosen)** | AI-management planning builds the planning context; Tactics resolves and publishes a self-contained selection event; Match freezes it at `lineup_locked`. | **Chosen.** Matches real-world prep, FM/OOTP genre precedent and FMX's Reference + Snapshot rule. Slightly more ceremony, but keeps each owner clean. |

### D2 - Final immutability timing

| Option | Description | Trade-off |
|---|---|---|
| A. `lineup_open` | Selection is immutable as soon as lineup editing opens. | Most stable pre-match UI; least realistic after late lineup reveal. |
| **B. `lineup_locked` (chosen)** | A candidate may exist during `lineup_open`; the final event is immutable at lock. | **Chosen.** Reacts to actual final lineups while preserving the Match freeze boundary. |
| C. worker start | Freeze only when the worker starts. | Maximum liveness, but weakens the established lock boundary and creates race risk. |

### D3 - RNG lane

| Option | Description | Trade-off |
|---|---|---|
| A. No RNG | Pure deterministic ranking only. | Simplest and highly auditable, but makes AI manager personality less expressive. |
| B. `MatchCoreRng` | Template selection draws from Match RNG. | Keeps all match setup near Match, but selection is out-of-match planning and would perturb MatchCoreRng. |
| **C. `WorldAiMgmtRng` (chosen)** | Template selection uses a dedicated AI-management sub-label. | **Chosen.** Isolates out-of-match AI planning from Match replay and set-piece sub-labels. |

## Decision

Nico selected **D1 = C, D2 = B, D3 = C** live on 2026-06-05.

### 1. Ownership split

- **AI-management planning** owns *why and when* a planning context is requested:
  fixture stakes, manager style, scouting confidence, opponent projection,
  rivalry/stakes and risk posture. Under the current map this remains the
  existing AI-management lane (League / Club / Transfer split); if ADR-0071 is
  ratified, **AI World Simulation** may become the planning-source context.
- **Tactics** owns deterministic catalog selection from that supplied planning
  context and is the authoritative publisher of
  `OppositionTemplateSelectedForMatchV1`.
- **Match** consumes the selection event and freezes the selected template into
  the lock-time `TacticSnapshot`. Match never selects templates and never joins
  Tactics/AI tables.

This amends ADR-0055's open wording without moving AI manager personality or
world-drift ownership into Tactics: Tactics owns the catalog selector; the AI
planning source owns the planning context.

### 2. Timing / liveness

`lineup_open` may expose a **candidate** selection for planning UI, but only the
final `OppositionTemplateSelectedForMatchV1` event produced for
`lineup_locked` is immutable. The event is idempotent per `(fixtureId,
selectingClubId, lockVersion, modelVersion)`.

If no valid selection exists at lock-time, the Match lock must fail fast with a
domain error (`opposition_template_selection_missing`) or use an explicitly
versioned default-template fallback emitted by Tactics. Match must not silently
choose a template.

### 3. RNG sub-label

Template selection uses stream #2 `WorldAiMgmtRng` with a dedicated sub-label:

```text
worldAiMgmt:opposition-template:fixture:<fixtureId>:club:<clubId>:v1:select
```

The label is stored on the selection event with `rngVersion` and `inputHash`.
Adding future template features must add versioned sub-labels rather than
reusing the sequence.

## Public contract

### Event

```ts
type OppositionTemplateSelectedForMatchV1 = {
  eventId: EventId
  schemaVersion: 1
  idempotencyKey: string

  saveId: SaveId
  fixtureId: FixtureId
  matchId: MatchId | null
  lockVersion: int

  selectingClubId: ClubId
  opponentClubId: ClubId
  venueSide: 'home' | 'away'

  selectedTemplate: {
    oppositionTemplateId: OppositionTemplateId
    templateVersion: int
    archetypeKey: string
    subArchetypeKey: string | null
    managerSignatureKey: string | null
  }

  planningContext: {
    sourceContext:
      | 'league-orchestration'
      | 'club-management'
      | 'transfer'
      | 'ai-world-simulation'
    modelVersion: string
    inputHash: string
    scoutingConfidenceBand: 'low' | 'medium' | 'high'
    managerStyleRef: string | null
    tacticalIdentityFingerprintRef: string | null
  }

  determinism: {
    rngStream: 'WorldAiMgmtRng'
    rngLabel: string
    rngVersion: string
  }

  timing: {
    candidateAllowedFromState: 'lineup_open'
    immutableAtState: 'lineup_locked'
  }

  provenance: {
    publisher: 'tactics'
    generatedBy: 'opposition-template-selector'
    generatedAtSimTime: string
  }
}
```

The event is self-contained for Match. Consumers must store an ACL projection if
they need long-lived access; no consumer joins Tactics tables.

### Queries

```ts
type SelectOppositionTemplateForMatchQuery = {
  saveId: SaveId
  fixtureId: FixtureId
  selectingClubId: ClubId
  opponentClubId: ClubId
  lockVersion: int
  planningContextRef: string
  planningContextInputHash: string
  candidateScope: 'quick' | 'standard' | 'expert' | 'ai-full'
  rngLabel: string
  modelVersion: string
}

type SelectOppositionTemplateForMatchResult = {
  event: OppositionTemplateSelectedForMatchV1
  candidateCount: int
  rejectedCandidateReasons: ReadonlyArray<string>
}

type BuildTacticSnapshotForMatchQuery = {
  saveId: SaveId
  fixtureId: FixtureId
  clubId: ClubId
  lockVersion: int
  selectedOppositionTemplateEventId: EventId
  lineupSnapshotRef: string
}
```

`SelectOppositionTemplateForMatch` and `BuildTacticSnapshotForMatch` are Tactics
public queries/commands in the planned `context-contracts/` surface. Match calls
only the lock-time snapshot surface and receives immutable JSON.

## Invariants

| # | Invariant |
|---|---|
| **OT1** | Match never chooses an opposition template; it consumes a Tactics-published selection event or fails lock explicitly. |
| **OT2** | Same planning input hash + same `WorldAiMgmtRng` label + same selector version produces the same selected template. |
| **OT3** | The final selected template is immutable at `lineup_locked`; later catalog edits do not affect the in-flight match or replay. |
| **OT4** | MatchCoreRng and `setpiece:*` sub-labels are not used by template selection. |
| **OT5** | `OppositionTemplateSelectedForMatchV1` is self-contained for Match; no cross-context joins are required. |
| **OT6** | Set-piece variant resolution inside the selected template remains governed by ADR-0067. |
| **OT7** | AI World Simulation may become the planning-source context if ADR-0071 is ratified, but the Tactics-to-Match event shape remains stable. |

## Consequences

Positive:

- Closes G11 without adding a bounded context.
- Keeps Tactics as catalog owner, Match as runtime owner and AI-management as
  planning-context owner.
- Preserves replay stability across future template edits and AI model changes.
- Lets pre-match UI show candidates while keeping the final lock-time truth clean.

Negative / constraints:

- Adds one new published event and one selector/query surface.
- Requires `inputHash` and selector model-version discipline before any
  implementation.
- The exact scoring weights, template taxonomy, manager-style coefficients and
  scouting-confidence effects remain calibration/design debt.

## Supersedes

None.

## Related Docs

- [[ADR-0055-tactics-context]]
- [[ADR-0026-match-frame-contract]]
- [[ADR-0067-set-piece-variant-selection-determinism]]
- [[ADR-0071-ai-world-simulation-context-and-drift-contract]]
- [[../state-machines/match]]
- [[../../60-Research/opposition-template-ai-consumption-contract-2026-06-05]]
- [[../../60-Research/raw-perplexity/raw-opposition-template-ai-consumption-2026-06-05]]

