---
title: ADR-0051 Manager and Legacy Context
status: draft
tags: [adr, architecture, ddd, manager, legacy, roguelite, fmx-16]
created: 2026-05-27
updated: 2026-05-27
type: adr
binding: false
supersedes:
superseded_by:
related:
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0020-hybrid-online-mvp-offline-ready]]
  - [[ADR-0027-postgres-data-model]]
  - [[../../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]]
  - [[../../50-Game-Design/mode-create-a-club-roguelite]]
  - [[../../60-Research/manager-archetype-roguelite-2026-05-27]]
  - [[../../60-Research/late-game-systems]]
---

# ADR-0051: Manager and Legacy Context

## Status

draft

## Date

2026-05-27

## Context

FMX-16 promotes manager-archetype roguelite progression from raw research into a
draft planning path. The domain concept cuts across many existing contexts:
League knows run lifecycle, Club Management knows economy and insolvency, Match
knows tactical output, Transfer knows market behaviour, Squad & Player knows
youth/development, and Training knows development work.

None of the existing eleven contexts is a clean owner for cross-run manager
identity, run analysis, archetype candidates, legacy configuration and
prestige/challenge selection. Hiding those rules inside League or Identity would
turn orchestration/account ownership into game-design ownership.

## Options Considered

- **League Orchestration owns it.** Reuses run lifecycle state, but overloads
  League with manager identity, style analysis and cross-save progression.
- **Identity + League split.** Stores global manager profile near the user
  account and run analysis near League, but creates a weak domain language and
  coupling between account state and game state.
- **New Manager & Legacy context.** Adds a proposed twelfth context that owns
  manager identity, run analysis, style signals, archetype candidates, legacy
  setup and prestige selection.

## Decision

Propose a dedicated **Manager & Legacy** bounded context.

If ratified, Manager & Legacy owns:

- manager profile and starting background;
- run analysis snapshots;
- manager style signals and confidence;
- archetype candidates;
- legacy unlock catalog and selected legacy configuration;
- prestige/challenge profile;
- cross-save manager meta that is safe for deterministic save creation.

MVP scope is limited to the contract hooks: capture run-end facts, derive coarse
style signals and expose a post-run reflection read model. Full perk unlocks,
legacy carry selection and prestige ladders remain post-MVP planning until Nico
expands scope.

## Public contract direction

Draft commands:

- `CreateManagerProfile`
- `RecordRunAnalysisSnapshot`
- `ConfirmPostRunReflection`
- `SelectLegacyConfigurationForNewRun`
- `SelectPrestigeProfileForNewRun`

Draft events:

- `ManagerProfileCreated`
- `RunAnalysisRecorded`
- `ManagerStyleSignalsUpdated`
- `ArchetypeCandidateDetected`
- `LegacyConfigurationSelected`
- `PrestigeProfileSelected`

Draft read models:

- `ManagerLegacyProfile`
- `RunRetrospective`
- `PostRunReflection`
- `ArchetypeCandidateBoard`
- `LegacyUnlockCatalog`
- `PrestigeLadder`

Draft consumed facts:

- `RogueliteRunEnded` from League Orchestration.
- `InsolvencyStageChanged` and economy summaries from Club Management.
- Match result and tactical aggregate events from Match.
- Transfer profit, wage and scouting summaries from Transfer.
- Youth promotion and player-growth summaries from Squad & Player / Training.

## Determinism and storage rules

- Manager & Legacy may own platform-scope cross-save meta and save-scope run
  snapshots.
- A running save must never read mutable cross-save meta after creation.
- New save creation may receive a selected legacy/prestige configuration as an
  explicit generation parameter.
- The selected configuration is copied into the save snapshot. Replay and reload
  use that copied value, not the current global meta file.
- Cross-context inputs arrive through public events/queries only. Manager &
  Legacy does not join across context tables.
- Money, match, transfer and player facts remain owned by their original
  contexts. Manager & Legacy stores analysis snapshots, not alternate truth.

## Rationale

Manager archetypes are a durable gameplay identity, not account management and
not league scheduling. A dedicated context keeps the ubiquitous language clean:
manager, run, style signal, archetype candidate, legacy, prestige. It also keeps
the determinism rule explicit: global meta can shape a new world only at
creation time, never during a running save.

## Consequences

Positive:

- Clear owner for the FMX-16 design without polluting League or Identity.
- Contracts-first path for MVP hooks and post-MVP progression.
- Deterministic cross-save boundary is explicit from day one.
- Playtest tuning can change signal weights without touching source contexts.

Negative:

- Adds one proposed bounded context to the map if accepted.
- Requires event summaries from multiple contexts before full implementation.
- Needs careful UI wording so MVP hooks do not overpromise final perks.

## Supersedes

None

## Related Docs

- [[../../60-Research/manager-archetype-roguelite-2026-05-27]]
- [[../../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]]
- [[../../50-Game-Design/mode-create-a-club-roguelite]]
- [[../../20-Features/feature-roguelite-mvp-first-playable]]
- [[ADR-0019-modular-monolith-ddd]]
- [[ADR-0020-hybrid-online-mvp-offline-ready]]
- [[ADR-0027-postgres-data-model]]
