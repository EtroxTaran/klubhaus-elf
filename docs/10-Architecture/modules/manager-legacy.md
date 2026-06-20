---
title: Manager & Legacy module
status: draft
tags: [architecture, module, manager, legacy, roguelite]
context: manager-legacy
created: 2026-06-20
updated: 2026-06-20
type: module
binding: false
related: [[../05-Building-Blocks]], [[../bounded-context-map]], [[../09-Decisions/ADR-0051-manager-and-legacy-context]], [[../09-Decisions/ADR-0082-manager-style-signal-and-run-analysis-contract]], [[../09-Decisions/ADR-0083-awards-honours-records-and-hall-of-fame-contract]], [[../09-Decisions/ADR-0084-national-team-dual-role-and-international-window-contract]]
---

# Manager & Legacy Boundary

## Purpose

The twelfth bounded context (ADR-0051): owner of durable cross-run manager
identity, run analysis and the cross-save legacy/Hall-of-Fame/prestige layer.
It assembles deterministic post-run snapshots from facts the other contexts
publish, and shapes a new world only at save-creation time — never inside a
running save.

## Owns

- Manager profile and starting background.
- Run analysis snapshots (`RunAnalysisSnapshot`) and run retrospectives.
- Manager style signals and confidence (`ManagerStyleSignals`: the five
  non-tactical coarse signals + the five tactical signals consumed from
  ADR-0074's `TacticalIdentityFingerprint`).
- Archetype candidates (names are post-MVP, Nico-gated — not in MVP).
- Legacy unlock catalog and selected legacy configuration.
- Prestige / challenge profile.
- Awards / honours generation, the in-world (per-save) Hall of Fame and season
  awards (ADR-0083 D1=A); plus the cross-save profile-global legacy/HoF layer
  (legend ranking + manager prestige).
- Cross-save manager meta that is safe for deterministic save creation.

## Public contract

Commands (ADR-0051 draft):

- `CreateManagerProfile`
- `RecordRunAnalysisSnapshot`
- `ConfirmPostRunReflection`
- `SelectLegacyConfigurationForNewRun`
- `SelectPrestigeProfileForNewRun`

Domain events (ADR-0051 draft):

- `ManagerProfileCreated`
- `RunAnalysisRecorded`
- `ManagerStyleSignalsUpdated`
- `ArchetypeCandidateDetected`
- `LegacyConfigurationSelected`
- `PrestigeProfileSelected`

Queries / read models (ADR-0051 draft):

- `ManagerLegacyProfile`
- `RunRetrospective`
- `PostRunReflection` — MVP-mandatory, text-only (outcome + top 2-3 signal
  phrases) per ADR-0082 M8.
- `ArchetypeCandidateBoard`
- `LegacyUnlockCatalog`
- `PrestigeLadder`

Contract data shapes (ADR-0082, ADR-0083 — TS/Zod-describable; no cross-context
joins): `CoarseStyleSignal`, `ManagerStyleSignals`, `RunAnalysisSnapshot`,
`PostRunReflection`; `TrophyWin`, `AwardWin`, `RecordSet`, `LegacyFact` /
`LegacyFactBucket` (forward-additive), `LegacyScore`, `HallOfFameEntry`,
`ProfileLegacyEntry`.

BCM exposed outputs: post-run reflection projections, legacy/prestige
configuration for new-save creation, archetype candidate board.

## Storage ownership

- Owns its own storage; no cross-context table joins (ADR-0121, ADR-0027).
- Cross-save meta lives in the platform / `public` schema (cross-save manager
  prestige, top-N legend index, profile-global legacy).
- Per-save run snapshots, in-world HoF, season awards and per-save raw legacy
  facts live in the `save_<uuidv7hex>` per-save schema (ADR-0027).
- Per-save **records** stay Statistics-owned (ADR-0081); this context stores
  analysis snapshots and the legacy/HoF/prestige layer, not alternate truth.
- Forward-additive reserved-stub schema: new record/award/HoF/national-team
  inputs add a new keyed `factId`; old builds ignore unknown ids — no
  migration, no save-format break (ADR-0027, ADR-0083 §4, ADR-0084 NT6).

## Consumers / Producers

Consumes facts (published events / read models only — ADR-0051 §Draft consumed
facts):

- `RogueliteRunEnded` from [[../bounded-context-map]] League Orchestration.
- `InsolvencyStageChanged` and economy summaries from Club Management.
- Match result and tactical aggregate events from Match; `TacticalIdentityFingerprint`
  from Tactics (ADR-0074, read once at run-end).
- Transfer profit, wage and scouting summaries from Transfer.
- Youth promotion and player-growth summaries from Squad & Player / Training.
- `InternationalWindowsPublished` national-team caps/honours as a reserved
  prestige input (ADR-0084 NT6; playable dual-role is post-MVP).

Produces for consumers: the BCM exposed outputs above. Web / UI renders
Manager & Legacy projections; legacy/prestige configuration is consumed by
new-save creation as an explicit generation parameter.

## Invariants

- Snapshot assembly is a pure deterministic projection of committed facts
  ordered by `endedAtSeq`; it declares no `*Rng` sub-label (ADR-0082 M5) — it
  reads already-resolved facts.
- A running save **never reads mutable cross-save meta** after creation;
  selected legacy/prestige config is copied into the save snapshot at creation
  only and replay/reload use the copied value (ADR-0051 §Determinism, M4).
- No cross-context table joins; sources remain authoritative — this context
  stores analysis snapshots, not alternate truth (ADR-0051, ADR-0121, M2/M6).
- Cross-context inputs arrive through public events/queries only.
- `ManagerStyleSignals` carries raw signals + confidence only; it names **no
  archetype** in MVP (M1, M10).
- No soft perk affects starting finance in MVP; any future one is
  prestige-gated + hard-capped + counterweighted + a fresh Nico decision
  (M7, ADR-0082 §5).
- Cross-save prestige/HoF aggregation is read-only-at-world-gen and never
  feeds back into a running sim (ADR-0083 HF3 / D8, ADR-0084 NT7).
- IP-clean (GD-0015 / ADR-0007): club/sponsor/venue/nation branding routes
  through the fictional catalog (ADR-0084 NT8).

## Open items

- ADR-0083 lists awards/honours/HoF/prestige as **data shapes** (`TrophyWin`,
  `AwardWin`, `HallOfFameEntry`, `LegacyScore`, etc.) and ownership rules, but
  does not enumerate named commands/events/queries for that surface (e.g. a
  `GenerateSeasonAwards` command or `HallOfFameInducted` event). Not invented
  here.
- ADR-0084's playable dual-role command/query/event surface is explicitly
  post-MVP (NT9); only the reserved window-input seam is defined now.
- Concrete table/schema names within the platform and per-save schemas are not
  pinned by ADR-0027/0051/0083 beyond the platform-vs-per-save split.
- Archetype taxonomy, perk caps, prestige-ladder shape and start-finance cap
  are post-MVP, Nico-gated (M10).
