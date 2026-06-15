---
title: ADR-0051 Manager and Legacy Context
status: accepted
tags: [adr, architecture, ddd, manager, legacy, roguelite, fmx-16, fmx-25, fmx-35, accepted]
created: 2026-05-27
updated: 2026-06-08
type: adr
binding: true
supersedes:
superseded_by:
related:
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0020-hybrid-online-mvp-offline-ready]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0052-people-persona-and-skills-context]]
  - [[../../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]]
  - [[../../50-Game-Design/mode-create-a-club-roguelite]]
  - [[../../60-Research/manager-archetype-roguelite-2026-05-27]]
  - [[../../60-Research/manager-legacy-bounded-context-2026-05-28]]
  - [[../../60-Research/raw-perplexity/raw-manager-legacy-ratification-2026-05-28]]
  - [[../../60-Research/late-game-systems]]
---

# ADR-0051: Manager and Legacy Context

## Status

accepted

## Date

2026-05-27 (proposed) · 2026-05-28 (FMX-25 ratification pass added) ·
2026-05-28 (FMX-35 accepted by Nico, Option A)

## Ratification

Nico accepted Option A on 2026-05-28 after reviewing the FMX-25 dossier
(PR [#85](https://github.com/EtroxTaran/klubhaus-elf/pull/85), merged
as commit `7a4563e`). The §Recommendation below names Option A; the
synthesis at
[[../../60-Research/manager-legacy-bounded-context-2026-05-28]] documents
the three converging arguments (industry pattern, DDD correctness, ADR-0052
downstream commitments).

Application:

- Status flipped `draft` → `accepted`; `binding: false` → `true`.
- The §Map patch proposal that lived in this ADR was applied to
  [[../bounded-context-map]] in the same PR (FMX-35). Manager & Legacy is
  now the **twelfth bounded context** in the live map.
- The §Map patch proposal section is removed from this ADR as a result -
  its content lives in the map. Future amendments to the map go through
  normal ADR supersession ([[../../90-Meta/vault-governance]]).

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

Expanded by the FMX-25 ratification pass.

### Option A - Accept as proposed (new Manager & Legacy context)

Add **Manager & Legacy** as the 12th bounded context with the public-contract
surface drafted below and the determinism rule in §Determinism and storage
rules. MVP scope stays hooks-only (RunAnalysisSnapshot, ManagerStyleSignals,
PostRunReflection). Full perks, legacy carry selection and prestige ladders
remain post-MVP.

- **Coupling:** clean. League, Club Management, Match, Transfer, Squad &
  Player and Training publish facts; Manager & Legacy subscribes via the
  contracts in §Draft consumed facts. No cross-context table joins.
- **Test isolation:** strong. Manager & Legacy owns its own storage; tests
  use deterministic event fixtures.
- **Service extractability:** matches ADR-0019 §5 - extraction is a
  deployment change because all contracts are JSON-serialisable.
- **Data sovereignty:** explicit. Cross-save meta in platform schema; per-save
  run snapshots in `save_<uuidv7hex>` schema (ADR-0027). Running saves never
  read mutable cross-save meta.
- **Trade-off:** adds one bounded context to the map (and a corresponding
  storage boundary). Worth it because the alternative folds progression rules
  into contexts whose ubiquitous language does not include them.

### Option B - Defer with scope adjustment

Accept the context boundary, but narrow MVP to a single read model
(`PostRunReflection`) plus the `RogueliteRunEnded` consumer. Other commands,
events and read models stay post-MVP. Status of the ADR moves to `accepted`
on the boundary but keeps a §MVP scope addendum.

- **Coupling:** same as Option A.
- **Trade-off:** the structural decision (own context, snapshot-at-creation
  rule, consumed-fact list) is independent of which commands ship in MVP.
  GD-0019 already constrains MVP to hooks-only - the deferral is downstream
  of the GDDR, not the ADR. The deferral does not unlock more flexibility
  than acceptance already provides.

### Option C - Reject and fold into existing contexts

Manager identity → Identity. Run analysis → League Orchestration.
Legacy/prestige → post-MVP feature without a domain owner. ADR-0052's "if
ADR-0051 is ratified" references collapse into stub queries against a
post-MVP placeholder.

- **Coupling:** weak. Identity owns "user, sessions, roles, device state" -
  archetype detection and style-signal synthesis are foreign domain language
  there. League owns "season, week, match-day, mode, pause, quorum" - run
  analysis fits awkwardly inside scheduling responsibilities.
- **Trade-off:** ADR-0019 §Decision explicitly warns against overloading
  contexts. Folding requires same-beat ADR-0052 patch to drop conditional
  references. Industry pattern (Hades, Slay the Spire, Risk of Rain 2,
  Darkest Dungeon II, Against the Storm; surveyed in
  [[../../60-Research/manager-legacy-bounded-context-2026-05-28]]) all carve
  cross-run meta into its own module.

## Recommendation

**Accept (Option A).** Three converging lines of evidence:

1. **Industry pattern** - Five independent successful roguelites implement
   the same snapshot-at-creation rule that ADR-0051 §Determinism encodes.
2. **DDD correctness** - Cross-run meta with its own domain rules belongs in
   its own bounded context per ADR-0019 §Decision; folding it overloads
   Identity or League.
3. **Downstream commitments** - ADR-0052 (merged 2026-05-28) references
   ADR-0051 ratification at three named points. Rejecting requires an
   ADR-0052 patch in the same beat; deferring leaves the contract partially
   undefined.

The five scope-bounding open questions from GD-0019 §Open (taxonomy, signal
schema, post-run UI depth, prestige ladder shape, snapshot timing) are
**not ratification blockers**. They resolve by playtest tuning and follow-up
GDDR updates; none requires a different context owner. Decision-gate-ready
per [[../../60-Research/manager-legacy-bounded-context-2026-05-28]].

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

- [[../../60-Research/manager-legacy-bounded-context-2026-05-28]] - FMX-25
  ratification synthesis (this ADR's decision basis).
- [[../../60-Research/raw-perplexity/raw-manager-legacy-ratification-2026-05-28]] -
  FMX-25 raw research (industry + DDD + football-sim survey).
- [[../../60-Research/manager-archetype-roguelite-2026-05-27]] - FMX-16 prior
  synthesis.
- [[../../60-Research/late-game-systems]] - already-binding determinism rule
  and 3-tier perk ladder context.
- [[../../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]] -
  pillar binding regardless of ratification.
- [[../../50-Game-Design/mode-create-a-club-roguelite]] - mode that consumes
  Manager & Legacy contracts.
- [[../../20-Features/feature-roguelite-mvp-first-playable]] - MVP hooks.
- [[ADR-0019-modular-monolith-ddd]] - bounded-context discipline.
- [[ADR-0020-hybrid-online-mvp-offline-ready]] - MVP scope envelope.
- [[ADR-0027-postgres-data-model]] - per-save schema convention.
- [[ADR-0052-people-persona-and-skills-context]] - adjacent draft context;
  three references depend on ADR-0051 ratification.
- [[ADR-0082-manager-style-signal-and-run-analysis-contract]] - FMX-93 (proposed);
  fills this context's draft `ManagerStyleSignals` / `RunAnalysisSnapshot` /
  `PostRunReflection` surface with the non-tactical signal schema + run-analysis
  contract (additive; this ADR's decision is unchanged).
- [[ADR-0083-awards-honours-records-and-hall-of-fame-contract]] - FMX-95 (proposed);
  extends this context's scope to own awards/honours generation, the in-world Hall of
  Fame and the cross-save legacy/HoF & legend ranking + manager prestige, under this
  ADR's existing read-only-at-creation determinism rule (additive; per-save records stay
  Statistics-owned; this ADR's decision is unchanged).
