---
title: ADR-0085 Media Ecology Context and Outlet Operational Behaviour
status: accepted
tags: [adr, architecture, ddd, media, media-ecology, outlets, press, narrative, audience, notification, determinism, fmx-82, accepted]
created: 2026-06-07
updated: 2026-06-19
type: adr
binding: true
supersedes:
superseded_by:
amended_by: [[ADR-0100-story-thread-ownership-and-cross-context-naming]]
related:
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[ADR-0030-llm-out-of-authoritative-state]]
  - [[ADR-0043-notification-and-messaging-platform]]
  - [[ADR-0052-people-persona-and-skills-context]]
  - [[ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[ADR-0062-audience-and-atmosphere-context]]
  - [[ADR-0065-narrative-media-press-content-ownership]]
  - [[ADR-0071-ai-world-simulation-context-and-drift-contract]]
  - [[ADR-0076-narrative-newsworthiness-event-contracts]]
  - [[ADR-0126-cross-producer-effect-intent-taxonomy]]
  - [[../bounded-context-map]]
  - [[../../50-Game-Design/GD-0034-media-outlet-ecology-model]]
  - [[../../50-Game-Design/GD-0013-narrative-inbox]]
  - [[../../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
  - [[../../50-Game-Design/GD-0015-ip-clean-data]]
  - [[../../60-Research/media-outlet-operational-behaviour-2026-06-07]]
  - [[../../60-Research/effect-intent-taxonomy-cross-producer-2026-06-15]]
  - [[../../60-Research/raw-perplexity/raw-media-outlet-games-2026-06-07]]
  - [[../../60-Research/raw-perplexity/raw-media-outlet-realworld-2026-06-07]]
  - [[../../60-Research/raw-perplexity/raw-media-outlet-ddd-determinism-2026-06-07]]
  - [[../../60-Research/domain-model-audit-and-backlog-2026-06-02]]
---

# ADR-0085: Media Ecology Context and Outlet Operational Behaviour

> **RATIFIED on 2026-06-19.** Nico approved the linked FMX decision
> queue via `APPROVE ALL RECOMMENDED`; this ADR/amendment is now
> binding according to its approved scope.


> **AMENDED on 2026-06-08 by [[ADR-0100-story-thread-ownership-and-cross-context-naming]]**
> — the **thread-ownership / thread-naming portions only** (StoryThread origination /
> `storyThreadId` correlation-key semantics now live in ADR-0100); the outlet model, cadence, stance drift, determinism and RNG-label choice stand unchanged
> and remain `accepted`. Recorded as a partial supersession on the amendment pattern
> (Nico, 2026-06-11, FMX-143).

## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `proposed`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

> **History (pre-ratification banner, demoted 2026-06-11 per ADR-0092 / FMX-143):**
> **`proposed` / `binding: false`.** Authored after Nico chose the FMX-82 decisions
> live (2026-06-07). Closes domain-audit gap **G17**. It does **not** flip any context
> to accepted, does **not** implement schemas, and does **not** edit
> `bounded-context-map.md` (the 19→20 patch lands only at the ratify gate, per
> [[../../90-Meta/vault-governance]]; same discipline as ADR-0077 / ADR-0064 / ADR-0075).

## Date

- Proposed: 2026-06-07 (FMX-82)

## Context

FMX-82 (child of E4 / FMX-60) resolves gap **G17**: media outlets — their publication
policy, cadence, editorial stance and reach — are referenced across Narrative,
People/Persona, Notification and Audience & Atmosphere, but **no context owns their
operational behaviour**. Without an owner, outlet generation and "which outlet publishes
what, when, with what slant" would scatter across three contexts.

The vault already split the *content* concern cleanly:

- **ADR-0065** (proposed) makes **Narrative** own press/media **content authoring**
  (article templates, conference response trees, `ToneProfileLibrary`,
  `PressPublicationPolicy`, fallback rendering, provenance) — the *representation* side.
- **ADR-0076** (proposed) defines the **newsworthiness integration events** that source
  contexts publish (`InjuryOccurred`, `ContractExpiring`, `BoardPressureChanged`,
  `TransferRumourPublished`, `PlayerSuspended` projection) on a shared envelope +
  metadata block (`salienceInputs`, `sourceType` incl. `mediaOutlet`, `sourceConfidence`,
  `audienceScopeHint`, `decayHint`, `legalRiskClass`). It **explicitly reserves** the
  outlet cadence/stance/reach/reliability rules for **FMX-82**.
- **ADR-0043** (accepted) Notification = delivery/inbox only. **ADR-0052** People = persona
  truth, excludes outlet publication. **ADR-0030** keeps LLM prose out of authoritative
  state. **ADR-0062** Audience & Atmosphere owns fan mood/atmosphere, not editorial behaviour.

What remains unowned is the **media outlet as an operational actor**: its identity and
persistence, its editorial stance/bias profile, its reach/audience-scope, and the
**cadence + fact-selection (salience) policy** deciding which newsworthiness facts each
outlet publishes and with what slant.

Grounded in [[../../60-Research/media-outlet-operational-behaviour-2026-06-07]] (three
Perplexity passes: prior-art games, real-world media ecology, DDD/determinism). Gameplay
model in [[../../50-Game-Design/GD-0034-media-outlet-ecology-model]].

Scope:

- The ownership / bounded-context boundary decision (G17, `needsHumanDecision`).
- The `MediaOutlet` operational model (type, stance, reach, reliability, cadence).
- The deterministic publication-cadence + fact-selection policy.
- The coverage event/read-model contracts to Narrative, Audience & Atmosphere and Notification.
- IP-safe outlet naming.

Out of scope:

- Newsworthiness event contracts themselves (ADR-0076, consumed here).
- Notification delivery mechanics (ADR-0043).
- Fan-segment mood/atmosphere computation (ADR-0062).
- Article prose / press-conference copy generation (Narrative, ADR-0065 / ADR-0054).
- All numeric magnitudes (→ FMX-52 calibration).

## Decision options

### D1 — Ownership / bounded-context boundary

| Option | Description | Trade-off |
|---|---|---|
| A. Fold into Narrative | Outlet operational behaviour is a sub-aggregate inside Narrative (extends ADR-0065/ADR-0054); 19-context map unchanged. | The issue's G17 recommendation; matches the vault's "no new BC" trend. But mixes outlet *simulation* with content *rendering* — different change-rhythms; risks a Narrative god-context. |
| **B. New "Media Ecology" bounded context** | A 20th context owns outlet identity, stance, reach, cadence and selection; emits coverage events; Narrative renders, Audience consumes, Notification delivers. | **Chosen (Nico).** Strongest DDD fit (distinct ubiquitous language, cohesion, volatility, ownership — outlet behaviour is world-simulation, not formatting). Grows the map to 20; reopens the "no new BC" posture for this concern. |
| C. Audience & Atmosphere submodule | Put outlets under Audience & Atmosphere because coverage feeds fan mood. | Rejected: mixes editorial behaviour with fan-segment/atmosphere truth; weak ubiquitous-language fit; contradicts ADR-0062 scope. |

### D2 — Outlet persistence / identity

| Option | Description | Trade-off |
|---|---|---|
| **A. Persistent named outlets** | A small bounded roster generated deterministically at world-gen; stable `OutletId` + memory (affinity/relationship drift, narrative-thread history); optional ephemeral micro-outlet fillers. | **Chosen.** What makes media feel *alive*; replay-safe as event-sourced aggregates. Cost: per-outlet save state (bounded roster mitigates). |
| B. Ephemeral per-event | Outlet is a label attached to each coverage at render time; no identity/memory. | Smallest save; but the documented #1 pitfall (fake-feeling skins; no "tabloid X always hates us"). |
| C. Hybrid | Two-tier persistent core + ephemeral fillers as a first-class rule. | Essentially A with the filler tier promoted; folded into A. |

### D3 — Editorial stance / bias model

| Option | Description | Trade-off |
|---|---|---|
| **A. Base archetype + deterministic drift** | Static type-driven base stance + modulation from read-only world signals (results, rivalry, board pressure, fan mood) consumed via integration events → local projections (no joins); drift emitted as `OutletStanceAdjusted`. | **Chosen.** Realistic, replayable, inspectable, future-open. |
| B. Static archetype only | Stance fixed at generation; never drifts. | Simple/deterministic but flat; no warm/sour arcs over a save. |
| C. Fully dynamic | Recompute stance each cycle from current world state. | Most reactive; hardest to tune/stabilise; risks erasing outlet identity. |

### D4 — Publication cadence + fact-selection (salience)

| Option | Description | Trade-off |
|---|---|---|
| **A. Scoring + per-edition budget** | Per-outlet deterministic score (salience × bias-alignment × decay × legal-risk + seeded noise) + finite per-edition budget; per-outlet cadence config. | **Chosen.** "Finite front page" realism; tunable; replay-safe. |
| B. Salience threshold only | Publish everything above a threshold. | Spiky "busy-day" floods; loses finite-front-page feel. |
| C. Central scheduler | One global scheduler assigns stories to all outlets. | Easier global balance; erodes per-outlet identity/independence. |

## Decision (proposed)

**D1 = B, D2 = A, D3 = A, D4 = A** (Nico, live, 2026-06-07).

Introduce a new **Media Ecology** bounded context (the **20th**) owning the media outlet as
an operational, **non-authoritative** actor. It **consumes** ADR-0076 newsworthiness events
plus read-only world signals, applies per-outlet stance + a deterministic scoring/budget
selection policy, and **emits coverage facts** that Narrative renders (ADR-0065),
Audience & Atmosphere consumes for fan mood (ADR-0062) and Notification delivers (ADR-0043).
Media Ecology never writes authoritative football, morale, fan, board or transfer state.

## Public contract direction

Draft aggregates / value objects:

- **`MediaOutlet`** (long-lived aggregate, per save, generated at world-gen):
  - identity: `outletId`, IP-safe `displayName`, `outletType`
    (`broadsheet | tabloid | regional | inHouse | broadcaster | wire | aggregator | fanMedia`);
  - **reach**: `audienceScope` (`local | regional | national | continental | global`),
    `reachWeight`, optional `reachByRegion` / `reachByClubCluster`;
  - **stance**: `clubAffinity[clubOrCluster]`, `sensationalism`, `independence`,
    `accessDependence[clubOrLeague]`, `commercialFocus` (all banded/integer);
  - **reliability**: `factReliability`, `rumorReliability`, `perceivedAuthority`;
  - **cadence**: `cadenceProfile` (`dailyEdition | breakingContinuous | weeklyMagazine`),
    `eventSensitivity` weights, `lastEditionWatermark`;
  - **memory**: `outletManagerRelationship`, per-club coverage history, active narrative-thread refs.
- **`MediaEdition`** — a per-outlet publication cycle (the "front page" with a finite budget).
- **`NarrativeThread`** — first-class storyline (`emerging → heating → climax → resolved`)
  grouped by `storyThreadId` (aligns with ADR-0076 `storyThreadId`).
- **`CoverageDecision`** — pure-function output `(MediaOutlet, candidateEvents, editionConfig,
  clubSignals) → [{ eventId, slot, angleCode, tone, prominence, effectiveAudienceScope, reachWeight }]`.

Draft commands (deterministic, triggered by the simulation clock / source events):

- `GenerateMediaRoster` — world-gen the persistent outlet roster from `worldSeed`.
- `OpenMediaEdition` / `CloseMediaEdition` — run selection for an outlet's edition.
- `AdjustOutletStance` — apply a deterministic stance-drift rule; emits `OutletStanceAdjusted`.

Draft events (via ADR-0028 transactional outbox):

- `MediaRosterGenerated`
- `OutletEditionOpened` / `OutletEditionClosed`
- `OutletPublishedStory` — the cross-context coverage fact (`outletId`, `editionId`, `slot`,
  `eventId`, `storyThreadId`, `angleCode`, `tone`, `prominence`, `effectiveAudienceScope`,
  `reachWeight`).
- `OutletIgnoredStory` / `OutletReframedStory`
- `OutletStanceAdjusted`
- `NarrativeThreadOpened` / `NarrativeThreadAdvanced` / `NarrativeThreadResolved`

Draft read models:

- `OutletCatalog` — read-only roster (identity, type, reach, current stance bands).
- `MediaCoverageFeed` — published coverage facts for Narrative/Notification/UI.
- `ClubNarrativeSignalsProjection` — **local** projection of consumed world signals per club
  (recent form, fan anger, board pressure, rivalry tension) — the only thing stance-drift reads.
- `OutletClubAffinityProjection` — per `(outlet, club)` affinity snapshot.

Draft consumed facts (events / read models only — **no cross-context joins**):

- ADR-0076 newsworthiness events (the publishable candidate set).
- Match / Competition outcome + form facts; **Transfer** rivalry/`RivalryIntensityChanged`;
  **Club Management** `BoardPressureChanged`; **Audience & Atmosphere** `FanSentimentUpdated`.
- **People** `PersonaContextCard` for journalist facades (ADR-0052) — read-only.
- League Orchestration deterministic clock facts (`SeasonAdvanced`) for edition cadence.

Draft effect-intent boundary:

- `OutletPublishedStory` may carry deterministic effect-intent metadata (e.g.
  `amplify_fan_mood`, `increase_board_scrutiny`, `dent_player_confidence`). **Owning contexts**
  (Audience & Atmosphere, Club Management, Squad & Player) interpret intents through their own
  policies and emit their own state events. **Media Ecology writes none of those facts.**

## Relationship to existing contexts

- **Narrative (ADR-0065/ADR-0054)** subscribes to `OutletPublishedStory` and turns `angleCode`
  + context cards into deterministic-fallback-first (optionally LLM-paraphrased) prose. Narrative
  no longer needs to own outlet *behaviour*; ADR-0065's press *content authoring* stays intact.
  An additive Related pointer to ADR-0085 is proposed for ADR-0065/ADR-0054 (decisions unchanged).
- **Audience & Atmosphere (ADR-0062)** subscribes to coverage facts (using `effectiveAudienceScope`
  / `reachWeight`) as one input to fan mood/pressure.
- **Notification (ADR-0043)** consumes coverage facts to build per-inbox feed/delivery records;
  it owns delivery, not coverage.
- **People (ADR-0052)** remains the source of journalist/persona truth; Media Ecology references
  personas read-only as outlet "facades".

## Determinism, storage and RNG rules

- Selection and stance-drift are **pure functions** of the event stream + deterministic per-outlet
  config + seeded PRNG. No wall-clock; the simulation clock is a domain concept. No live LLM in
  authoritative paths.
- Selection scoring (per outlet, per edition):
  `score = w_s·salience + w_b·biasAlignment + w_o·outletPriority + w_d·decay(t) − w_l·legalRiskPenalty + noise`,
  then **budget-bounded** top-N with a stable sort (`eventId` tiebreaker) and a minimum threshold.
- `noise` is a **seeded PRNG keyed by `(outletId, eventId, seasonSeed)`** — variety that is
  byte-identical on replay.
- Outlets are **persisted per-save** (ADR-0027) with creation events; stance drift, editions and
  coverage are events (ADR-0028), idempotent and replay-safe. Authored roster archetypes/templates
  are versioned; saves record the version used.
- All magnitudes (`w_*`, budgets, thresholds, cadence base/factors, drift rates, reach weights,
  news-gravity, roster size) are **FMX-52 calibration** behind `mediaEcologyModelVersion`.
- **IP-clean posture** (ADR-0007 + GD-0015): generated outlet names are evocative-but-clearly-not-real;
  no real outlet/broadcaster/journalist names embedded.

## Invariants

| # | Invariant |
|---|---|
| ME1 | Media Ecology is **non-authoritative** — it never writes football, morale, fan, board, transfer or persona state (ADR-0030 conformant). |
| ME2 | The source context decides a fact is publishable/newsworthy (ADR-0076 C1); Media Ecology only **selects and slants** it. |
| ME3 | Selection and stance-drift are **pure functions** of events + config + seeded PRNG; same `worldSeed` + event history → byte-identical coverage. |
| ME4 | No cross-context joins at runtime; stance-drift reads only the local `ClubNarrativeSignalsProjection` + the `MediaOutlet` aggregate. |
| ME5 | Coverage selection is **budget-bounded** per edition (finite front page); a stable sort guarantees deterministic ties. |
| ME6 | Outlets are **persistent named aggregates** with stable `outletId`; identity and stance survive across a save; drift is event-sourced. |
| ME7 | `reachWeight` / `effectiveAudienceScope` is a **domain** attribute; it never reads from or depends on Notification delivery preferences or the UI feed. |
| ME8 | Generated prose (Narrative/ADR-0054) attaches to the coverage display surface only; it can phrase but never create, alter or confirm a coverage fact (ADR-0030). |
| ME9 | Effect-intent metadata on coverage is advisory; owning contexts validate and emit their own state events. |
| ME10 | Generated outlet names satisfy the IP-clean naming rule (ADR-0007 / GD-0015). |
| ME11 | Coverage facts publish via the ADR-0028 outbox after the producing transaction commits; consumers are idempotent and replay-safe. |

## Map patch proposal (not applied — ratify-gated)

On ratification, [[../bounded-context-map]] gains a **20th** bounded context, **Media Ecology**,
with:

- Core elements: `MediaOutlet` aggregate (type/stance/reach/reliability/cadence + memory),
  `MediaEdition`, `NarrativeThread`, the deterministic `CoverageDecision` selection policy.
- Exposed outputs: `OutletPublishedStory` / `OutletReframedStory` / `OutletStanceAdjusted` /
  `NarrativeThread*` events; `OutletCatalog` / `MediaCoverageFeed` queries.
- Consumers: **Narrative** (renders `OutletPublishedStory` → prose), **Audience & Atmosphere**
  (coverage → fan mood), **Notification** (coverage → inbox/feed delivery). Producers it consumes:
  the ADR-0076 newsworthiness publishers + Match/Competition, Transfer (rivalry), Club Management
  (board pressure), Audience & Atmosphere (fan sentiment), People (persona cards), League (clock).
- The Narrative row gains a clause noting outlet *behaviour* moved to Media Ecology while Narrative
  keeps press/media *content authoring* (ADR-0065). The context-count line (19) becomes **20**, and
  `src/domain/` gains a `media-ecology/` folder.

The map file is **not** edited until Nico ratifies (per [[../../90-Meta/vault-governance]]; same
discipline as ADR-0077 / ADR-0064 / ADR-0075). This also means the parallel "20th context"
proposals (ADR-0077 Environment & Climate; ADR-0081 Statistics; etc.) are each **independently
ratify-gated** — the final ratified count is reconciled at the gate, not assumed here.

## Open ratification item

**RNG label.** The selection `noise` and the world-gen roster need a seeded stream. This ADR
proposes **reusing the existing `WorldAiMgmtRng`** (ADR-0071) with a media sub-label —
`WorldAiMgmtRng:media:outlet:<id>:edition:<e>` and `WorldAiMgmtRng:media:rostergen:<worldSeed>` —
rather than minting a new locked top-level stream, because media outlets are AI-world actors
(same family as AI club/owner drift). Flagged for Nico's explicit ratification (same treatment as
ADR-0077's RNG note); a dedicated `MediaRng` stream is the alternative if outlet variation should
be isolated from world-AI drift for replay-debugging.

> **2026-06-07 (open-decisions sweep) recommendation — reuse `WorldAiMgmtRng:media:*` (no new
> top-level stream).** Grounded in the ADR-0018 §3 stream discipline (reuse an existing locked
> top-level RNG with a versioned sub-label; never mint a new top-level `*Rng` unless a concern is
> genuinely independent) and the established FMX precedent (FMX-66/67/80/92 all reused existing
> streams via sub-labels). Media outlets are AI-world actors, so the `WorldAiMgmtRng` family is the
> correct home; a dedicated `MediaRng` is only warranted if replay-debug isolation later proves
> necessary. See [[../../00-Index/Open-Decisions-Dossier]] (mini-point M1).

## Consequences

Positive:

- One owner + one determinism contract for outlet behaviour; clean split from Narrative content
  authoring (ADR-0065) and Notification delivery (ADR-0043).
- Persistent, memory-bearing outlets with drifting stance and narrative threads — directly targets
  the genre's documented "fake-feeling outlets / no memory" pitfalls.
- Gives Audience & Atmosphere and Notification stable coverage inputs without source joins.
- Keeps People/Persona, Notification and Audience & Atmosphere within their documented boundaries.

Negative / constraints:

- Adds a **20th bounded context** (cross-context wiring + a new `src/domain` folder) for a concern
  the issue had recommended folding into Narrative; the Narrative↔Media Ecology seam needs careful
  ratification to avoid two owners of "media".
- More events/projections to version and replay-test (editions, coverage, stance drift).
- Salience weights, budgets, cadence numbers and effect magnitudes remain unresolved until FMX-52.
- Outlet count × edition cadence must be bounded to avoid coverage-history explosion (ME state).

## HITL gate

Authored `proposed` after Nico chose the FMX-82 planning defaults live (2026-06-07): **D1 = B**
(new Media Ecology context), **D2 = A** (persistent named outlets), **D3 = A** (base archetype +
deterministic drift), **D4 = A** (scoring + per-edition budget).

Remaining ratification / follow-up items before implementation:

- the **RNG label** (`WorldAiMgmtRng` media sub-label vs dedicated `MediaRng`) — §Open ratification item;
- all numeric magnitudes → **FMX-52** behind `mediaEcologyModelVersion`;
- additive Related pointers to ADR-0065 / ADR-0054 / ADR-0062 / ADR-0076 (apply on ratify);
- the bounded-context-map 19→20 patch (apply on ratify);
- the outlet→fan-mood/board/morale effect-intent taxonomy is prepared by
  FMX-162 in [[ADR-0126-cross-producer-effect-intent-taxonomy]] and remains
  binding after Nico approved it on 2026-06-19 that packet.

## Supersedes

None.

## Related Docs

- [[../../60-Research/media-outlet-operational-behaviour-2026-06-07]]
- [[../../60-Research/effect-intent-taxonomy-cross-producer-2026-06-15]]
- [[../../60-Research/raw-perplexity/raw-media-outlet-games-2026-06-07]]
- [[../../60-Research/raw-perplexity/raw-media-outlet-realworld-2026-06-07]]
- [[../../60-Research/raw-perplexity/raw-media-outlet-ddd-determinism-2026-06-07]]
- [[../../50-Game-Design/GD-0034-media-outlet-ecology-model]]
- [[ADR-0065-narrative-media-press-content-ownership]]
- [[ADR-0076-narrative-newsworthiness-event-contracts]]
- [[ADR-0054-narrative-context-and-ai-narration-framework]]
- [[ADR-0043-notification-and-messaging-platform]]
- [[ADR-0052-people-persona-and-skills-context]]
- [[ADR-0062-audience-and-atmosphere-context]]
- [[ADR-0071-ai-world-simulation-context-and-drift-contract]]
- [[ADR-0126-cross-producer-effect-intent-taxonomy]]
