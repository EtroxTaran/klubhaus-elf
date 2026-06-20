---
title: Media Ecology module
status: draft
tags: [architecture, module, media-ecology, media, outlets]
context: media-ecology
created: 2026-06-20
updated: 2026-06-20
type: module
binding: false
related: [[../05-Building-Blocks]], [[../bounded-context-map]], [[../09-Decisions/ADR-0085-media-ecology-context-and-outlet-operational-behaviour]], [[../09-Decisions/ADR-0100-story-thread-ownership-and-cross-context-naming]], [[../09-Decisions/ADR-0065-narrative-media-press-content-ownership]], [[../09-Decisions/ADR-0027-postgres-data-model]], [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
---

# Media Ecology Boundary

## Purpose

Owns the media outlet as a **non-authoritative** operational actor: persistent
opinionated outlets that consume newsworthiness facts plus read-only world
signals, apply a deterministic stance + scoring/budget selection, and emit
coverage facts that Narrative renders, Audience & Atmosphere consumes and
Notification delivers (ADR-0085).

## Owns

- **`MediaOutlet`** — long-lived per-save aggregate generated at world-gen:
  identity (`outletId`, IP-safe `displayName`, `outletType`), `reach`
  (`audienceScope`, `reachWeight`, optional `reachByRegion` /
  `reachByClubCluster`), `stance` (`clubAffinity`, `sensationalism`,
  `independence`, `accessDependence`, `commercialFocus` — banded), `reliability`
  (`factReliability`, `rumorReliability`, `perceivedAuthority`), `cadence`
  (`cadenceProfile`, `eventSensitivity`, `lastEditionWatermark`) and `memory`
  (outlet-manager relationship, per-club coverage history, active thread refs).
- **`MediaEdition`** — per-outlet publication cycle (the finite-budget "front page").
- **`CoverageThread`** — outlet-side coverage arc of a story
  (`emerging → heating → climax → resolved`), grouped by `storyThreadId`
  (renamed from `NarrativeThread` per ADR-0100; Narrative owns the player-facing
  `StoryThread`, this context owns the outlet coverage arc).
- **`CoverageDecision`** — the deterministic scoring + per-edition-budget
  selection policy (pure function of outlet, candidate events, edition config,
  club signals).

## Public contract

Commands (deterministic; triggered by the simulation clock / source events):

- `GenerateMediaRoster` — world-gen the persistent outlet roster from `worldSeed`.
- `OpenMediaEdition` / `CloseMediaEdition` — run selection for an outlet's edition.
- `AdjustOutletStance` — apply a deterministic stance-drift rule; emits `OutletStanceAdjusted`.

Domain events (published via the ADR-0028 transactional outbox):

- `MediaRosterGenerated`
- `OutletEditionOpened` / `OutletEditionClosed`
- `OutletPublishedStory` — the single cross-context coverage hand-off
  (`outletId`, `editionId`, `slot`, `eventId`, `storyThreadId`, `angleCode`,
  `tone`, `prominence`, `effectiveAudienceScope`, `reachWeight`); may carry
  advisory deterministic effect-intent metadata.
- `OutletIgnoredStory` / `OutletReframedStory`
- `OutletStanceAdjusted`
- `CoverageThreadOpened` / `CoverageThreadAdvanced` / `CoverageThreadResolved`
  (the `NarrativeThread*` events of ADR-0085, renamed per ADR-0100)

Queries / read models:

- `OutletCatalog` — read-only roster (identity, type, reach, current stance bands).
- `MediaCoverageFeed` — published coverage facts for Narrative / Notification / UI.
- `ClubNarrativeSignalsProjection` — **local** per-club projection of consumed
  world signals (recent form, fan anger, board pressure, rivalry tension); the
  only input stance-drift reads.
- `OutletClubAffinityProjection` — per-`(outlet, club)` affinity snapshot.

## Storage ownership

- Outlets, editions, coverage threads, coverage facts and the local projections
  are persisted **per-save** in Media Ecology's own schema/tables (ADR-0027).
  Roster archetype/templates are versioned; saves record the version used.
- No shared tables and **no cross-context joins** at runtime (ADR-0121, ME4):
  consumed world signals enter only as outbox events / read models projected
  locally; stance-drift reads only the local `ClubNarrativeSignalsProjection` +
  the `MediaOutlet` aggregate.
- All numeric magnitudes (scoring weights, budgets, thresholds, cadence factors,
  drift rates, reach weights, roster size) sit behind `mediaEcologyModelVersion`
  (FMX-52 calibration).

## Consumers / Producers

Consumers of this context's outputs:

- **Narrative** — renders `OutletPublishedStory` (`angleCode` + context cards) into
  deterministic-fallback-first prose (content authoring stays in Narrative, ADR-0065).
- **Audience & Atmosphere** — consumes coverage facts (`effectiveAudienceScope` /
  `reachWeight`) as one input to fan mood / pressure (ADR-0062).
- **Notification** — consumes coverage facts to build inbox/feed delivery records;
  owns delivery, not coverage (ADR-0043).

Facts this context consumes (events / read models only):

- ADR-0076 newsworthiness events (the publishable candidate set).
- Match / Competition outcome + form facts; **Transfer** `RivalryIntensityChanged`;
  **Club Management** `BoardPressureChanged`; **Audience & Atmosphere** `FanSentimentUpdated`.
- **People** `PersonaContextCard` for journalist facades (read-only, ADR-0052).
- **League Orchestration** deterministic clock facts (`SeasonAdvanced`) for edition cadence.
- The `WorldAiMgmtRng:media:*` seeded sub-label family for selection `noise` and
  roster-gen (owned by ADR-0071's `WorldAiMgmtRng` stream; not a new top-level stream).

## Invariants

- **Non-authoritative (ME1):** never writes football, morale, fan, board, transfer
  or persona state (ADR-0030 conformant).
- **Selects, does not declare (ME2):** the source context decides a fact is
  publishable/newsworthy (ADR-0076 C1); this context only selects and slants it.
- **Deterministic (ME3):** selection and stance-drift are pure functions of events
  + config + seeded PRNG; same `worldSeed` + event history → byte-identical coverage.
- **No cross-context joins (ME4):** stance-drift reads only the local
  `ClubNarrativeSignalsProjection` + the `MediaOutlet` aggregate.
- **Budget-bounded (ME5):** coverage selection is finite per edition; a stable sort
  (`eventId` tiebreaker) guarantees deterministic ties.
- **Persistent identity (ME6):** outlets are persistent named aggregates with stable
  `outletId`; identity and stance survive a save; drift is event-sourced.
- **Domain reach (ME7):** `reachWeight` / `effectiveAudienceScope` never depend on
  Notification delivery preferences or the UI feed.
- **Prose is display-only (ME8):** generated prose can phrase but never create, alter
  or confirm a coverage fact (ADR-0030).
- **Advisory effect-intent (ME9, ADR-0126):** effect-intent metadata is advisory;
  owning contexts validate and emit their own state events.
- **IP-clean names (ME10):** generated outlet names are evocative-but-clearly-not-real
  (ADR-0007 / GD-0015); no real outlet/broadcaster/journalist names embedded.
- **Outbox publication (ME11):** coverage facts publish via the ADR-0028 outbox after
  the producing transaction commits; consumers are idempotent and replay-safe.

## Dependencies

- [[../09-Decisions/ADR-0085-media-ecology-context-and-outlet-operational-behaviour]] (draft — primary owner)
- [[../09-Decisions/ADR-0100-story-thread-ownership-and-cross-context-naming]] (amends ADR-0085: `NarrativeThread` → `CoverageThread`, `storyThreadId` correlation-key)
- [[../09-Decisions/ADR-0065-narrative-media-press-content-ownership]] (Narrative content-authoring seam)
- [[../09-Decisions/ADR-0027-postgres-data-model]] (per-save storage)
- [[../09-Decisions/ADR-0028-postgres-transactional-outbox]] (event publication)
- [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]] (no shared tables / cross-context joins)
- [[../09-Decisions/ADR-0030-llm-out-of-authoritative-state]] (LLM out of authoritative state)
- [[../09-Decisions/ADR-0076-narrative-newsworthiness-event-contracts]] (consumed candidate facts)
- [[../09-Decisions/ADR-0071-ai-world-simulation-context-and-drift-contract]] (`WorldAiMgmtRng:media:*`)
- [[../09-Decisions/ADR-0062-audience-and-atmosphere-context]], [[../09-Decisions/ADR-0043-notification-and-messaging-platform]], [[../09-Decisions/ADR-0126-cross-producer-effect-intent-taxonomy]] (consumers / effect-intent)
- Storage shapes from [[db-schema]].

## Open items

- **Concrete tables / DDL.** ADR-0085 / ADR-0027 establish per-save ownership but no
  table names or columns for outlets, editions, coverage threads or projections are
  specified — schema design is FMX-52 / implementation scope.
- **RNG label ratification.** ADR-0085 §Open ratification item proposes reusing
  `WorldAiMgmtRng:media:*` vs a dedicated `MediaRng`; ADR-0100 D3 recommends the
  reuse but the choice is still flagged for Nico's explicit ratification.
- **Numeric magnitudes.** All scoring weights, per-edition budgets, thresholds,
  cadence factors, drift rates, reach weights and roster size are unresolved behind
  `mediaEcologyModelVersion` (FMX-52 calibration).
- **Effect-intent vocabulary.** The concrete outlet→fan-mood/board/morale intent codes
  are prepared by ADR-0126 (FMX-162); the bare examples in ADR-0085 remain advisory.
