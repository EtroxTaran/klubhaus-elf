---
title: ADR-0080 Opposition-template AI Consumption Contract
status: accepted
tags: [adr, architecture, tactics, opposition, ai-world, match, determinism, replay, snapshot, fmx-67, fmx-136]
created: 2026-06-05
updated: 2026-06-19
type: adr
binding: true
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
  - [[../../60-Research/opposition-template-ai-consumption-ratification-2026-06-14]]
  - [[../../60-Research/manager-legacy-scouting-youth-feed-followups-2026-06-19]]
  - [[../../60-Research/raw-perplexity/raw-opposition-template-ai-consumption-ratification-2026-06-14]]
  - [[../../60-Research/raw-perplexity/raw-fmx-157-opposition-scouting-2026-06-19]]
  - [[../../60-Research/raw-perplexity/raw-fmx-157-source-checks-2026-06-19]]
  - [[../../40-Execution/fmx-136-opposition-template-ratification-decision-queue-2026-06-14]]
  - [[../../40-Execution/fmx-157-manager-legacy-scouting-youth-feed-decision-queue-2026-06-19]]
---

# ADR-0080: Opposition-template AI Consumption Contract

## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `proposed`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).
> **FMX-136 binding cleanup (2026-06-14):** Nico approved D4-D6:
> **AI World Simulation** is the canonical planning source,
> no valid selection at `lineup_locked` fails with
> `opposition_template_selection_missing`, and
> `BuildTacticSnapshotForMatch` embeds the selected-template slice in
> `TacticSnapshot`. `binding: true`.

> **History (pre-ratification banner, demoted 2026-06-11 per ADR-0092 / FMX-143):**
> **`proposed` / `binding: false`.** FMX-67 closes E2 gap **G11** by pinning how
> AI match-prep consumes Tactics-owned `OppositionTemplate` records and how Match
> freezes the selected result. **Nico chose D1-D3 live on 2026-06-05 = split
> event model, final immutability at `lineup_locked`, `WorldAiMgmtRng` sub-label.**
> No new bounded context and no map-structure change. Tactics owns the
> deterministic catalog selection and selection event; AI-management contexts own
> the planning context; Match only consumes the frozen result.

> **FMX-157 accepted follow-up (2026-06-19):**
> [[../../60-Research/manager-legacy-scouting-youth-feed-followups-2026-06-19]]
> recommends keeping `OppositionScoutingRequested` as a split hook upstream of
> this ADR: Scouting owns report execution/freshness/confidence and Tactics owns
> interpretation into the existing opposition-template/match-plan surfaces. This
> does not reopen ADR-0080's accepted AI World/Tactics/Match ownership split and
> is binding after Nico accepted FMX-157 D4-D6.

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
FMX-136 source-owner / fail-fast / snapshot refresh:
[[../../60-Research/opposition-template-ai-consumption-ratification-2026-06-14]]
and raw capture
[[../../60-Research/raw-perplexity/raw-opposition-template-ai-consumption-ratification-2026-06-14]].

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

### D4 - Planning source after ADR-0071

| Option | Description | Trade-off |
|---|---|---|
| **A. AI World Simulation (chosen)** | `planningContext.sourceContext` is `ai-world-simulation`; League, Club and Transfer supply input facts/projections. | **Chosen.** Matches accepted ADR-0071 and removes the stale source-owner fork. |
| B. Four-source union | Keep League / Club / Transfer / AI World as possible source owners. | More flexible historically, but ambiguous after AI World ratification. |
| C. Legacy lane until code | Preserve the older split until implementation exists. | Lowest doc churn, but contradicts the accepted bounded-context map. |

### D5 - Missing selection at lock

| Option | Description | Trade-off |
|---|---|---|
| **A. Fail fast (chosen)** | Match lock fails with `opposition_template_selection_missing`. | **Chosen.** Strongest replay and audit behavior; no hidden template enters authoritative Match state. |
| B. Explicit default event | Tactics emits a versioned fallback-template event. | Valid future path if product wants soft failure, but it needs its own contract. |
| C. Mode split | Competitive matches fail; background matches fallback. | Premature and risks divergent replay semantics. |

### D6 - Replay-safe payload

| Option | Description | Trade-off |
|---|---|---|
| **A. Snapshot in `TacticSnapshot` (chosen)** | Event carries identity/provenance/hash; `BuildTacticSnapshotForMatch` embeds the selected-template slice. | **Chosen.** Match replays without live Tactics or AI World joins while avoiding a full catalog copy. |
| B. Full template body on event only | Event stores the full selected template; Match snapshot keeps only the event ref. | Auditable but heavier and forces replay to dereference event storage. |
| C. ID + version only | Store only template id/version and recompute from Tactics catalog. | Too weak after catalog/model edits; replay can drift. |

## Decision

Nico selected **D1 = C, D2 = B, D3 = C** live on 2026-06-05 and
**D4 = A, D5 = A, D6 = A** live on 2026-06-14.

### 1. Ownership split

- **AI World planning** owns *why and when* a planning context is requested:
  fixture stakes, manager style, scouting confidence, opponent projection,
  rivalry/stakes and risk posture. Under the accepted map, **AI World
  Simulation** is the canonical planning-source context; League Orchestration,
  Club Management and Transfer provide source facts/projections through their
  published language, not planning-source ownership.
- **Tactics** owns deterministic catalog selection from that supplied planning
  context and is the authoritative publisher of
  `OppositionTemplateSelectedForMatchV1`.
- **Match** consumes the selection event and freezes the selected template into
  the lock-time `TacticSnapshot`. Match never selects templates and never joins
  Tactics or AI World tables.

This amends ADR-0055's open wording without moving AI manager personality or
world-drift ownership into Tactics: Tactics owns the catalog selector; the AI
planning source owns the planning context.

### 2. Timing / liveness

`lineup_open` may expose a **candidate** selection for planning UI, but only the
final `OppositionTemplateSelectedForMatchV1` event produced for
`lineup_locked` is immutable. The event is idempotent per `(fixtureId,
selectingClubId, lockVersion, modelVersion)`.

If no valid selection exists at lock-time, the Match lock must fail fast with a
domain error (`opposition_template_selection_missing`). Match must not silently
choose a template. A future default-template fallback would require an
explicitly versioned Tactics-published event or ADR amendment.

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
    templateSnapshotHash: string
    archetypeKey: string
    subArchetypeKey: string | null
    managerSignatureKey: string | null
  }

  planningContext: {
    sourceContext: 'ai-world-simulation'
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

type TacticSnapshotOppositionTemplate = {
  selectedTemplateEventId: EventId
  oppositionTemplateId: OppositionTemplateId
  templateVersion: int
  templateSnapshotHash: string
  archetypeKey: string
  subArchetypeKey: string | null
  managerSignatureKey: string | null
  planningSourceContext: 'ai-world-simulation'
  planningContextInputHash: string
  selectorModelVersion: string
}

type BuildTacticSnapshotForMatchResult = {
  tacticSnapshot: TacticSnapshot & {
    oppositionTemplate: TacticSnapshotOppositionTemplate
  }
}
```

`SelectOppositionTemplateForMatch` and `BuildTacticSnapshotForMatch` are Tactics
public queries/commands in the planned `context-contracts/` surface. Match calls
only the lock-time snapshot surface and receives immutable JSON. Match replays
from `TacticSnapshot.oppositionTemplate`, not from live Tactics catalog rows,
AI World planning state or mutable selector output.

## Invariants

| # | Invariant |
|---|---|
| **OT1** | Match never chooses an opposition template; it consumes a Tactics-published selection event or fails lock explicitly. |
| **OT2** | Same planning input hash + same `WorldAiMgmtRng` label + same selector version produces the same selected template. |
| **OT3** | The final selected template is immutable at `lineup_locked`; later catalog edits do not affect the in-flight match or replay. |
| **OT4** | MatchCoreRng and `setpiece:*` sub-labels are not used by template selection. |
| **OT5** | `OppositionTemplateSelectedForMatchV1` plus `TacticSnapshot.oppositionTemplate` are self-contained for Match; no cross-context joins are required. |
| **OT6** | Set-piece variant resolution inside the selected template remains governed by ADR-0067. |
| **OT7** | AI World Simulation is the canonical planning-source context; source-domain facts remain owned by their source contexts and arrive through published language. |
| **OT8** | Missing selection at `lineup_locked` fails with `opposition_template_selection_missing`; no silent fallback/default template is valid. |

## Consequences

Positive:

- Closes G11 without adding a bounded context.
- Keeps Tactics as catalog owner, Match as runtime owner and AI World Simulation
  as planning-source owner.
- Preserves replay stability across future template edits and AI model changes.
- Lets pre-match UI show candidates while keeping the final lock-time truth clean.

Negative / constraints:

- Adds one new published event and one selector/query surface.
- Requires `inputHash` and selector model-version discipline before any
  implementation.
- Requires the Tactics snapshot builder to embed the selected-template slice in
  every replay-bearing `TacticSnapshot`.
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
- [[../../60-Research/opposition-template-ai-consumption-ratification-2026-06-14]]
- [[../../60-Research/raw-perplexity/raw-opposition-template-ai-consumption-ratification-2026-06-14]]
- [[../../40-Execution/fmx-136-opposition-template-ratification-decision-queue-2026-06-14]]
