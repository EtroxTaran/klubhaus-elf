---
title: Media-Outlet Operational Behaviour & Ownership (FMX-82)
status: current
tags: [research, media, outlets, press, narrative, media-ecology, editorial-stance, reach, cadence, determinism, ddd, fmx-82]
context: media-ecology
created: 2026-06-07
updated: 2026-06-07
type: research
binding: false
linear: FMX-82
related:
  - [[raw-perplexity/raw-media-outlet-games-2026-06-07]]
  - [[raw-perplexity/raw-media-outlet-realworld-2026-06-07]]
  - [[raw-perplexity/raw-media-outlet-ddd-determinism-2026-06-07]]
  - [[../10-Architecture/09-Decisions/ADR-0085-media-ecology-context-and-outlet-operational-behaviour]]
  - [[../50-Game-Design/GD-0034-media-outlet-ecology-model]]
  - [[../10-Architecture/09-Decisions/ADR-0065-narrative-media-press-content-ownership]]
  - [[../10-Architecture/09-Decisions/ADR-0076-narrative-newsworthiness-event-contracts]]
  - [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[../10-Architecture/09-Decisions/ADR-0043-notification-and-messaging-platform]]
  - [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
  - [[../10-Architecture/09-Decisions/ADR-0071-ai-world-simulation-context-and-drift-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0062-audience-and-atmosphere-context]]
  - [[../10-Architecture/bounded-context-map]]
  - [[domain-model-audit-and-backlog-2026-06-02]]
---

# Media-Outlet Operational Behaviour & Ownership (FMX-82)

FMX-82 closes domain-audit gap **G17**: media outlets (publication policy, cadence,
editorial stance, reach) are referenced across **Narrative**, **People/Persona**,
**Notification** and **Audience & Atmosphere**, but **no context owns their operational
behaviour**. It is the last open child of **E4 / FMX-60** (Narrative, Dialogue &
Newsworthiness — the only High-priority epic). This note grounds the ownership decision and
the outlet operational model in three Perplexity passes (prior-art games, real-world media
ecology, DDD/determinism) plus the vault's existing narrative contracts.

## What is already decided (constraints, not re-opened)

- **ADR-0065** (proposed) gives **Narrative** the press/media **content authoring** — article
  templates, conference response trees, `ToneProfileLibrary`, `PressPublicationPolicy`,
  fallback rendering, provenance. This is the *representation* side ("how it's written").
- **ADR-0076 / FMX-83** (proposed) defines the **newsworthiness integration events**
  (`InjuryOccurred`, `ContractExpiring`, `BoardPressureChanged`, `TransferRumourPublished`,
  `PlayerSuspended` projection) on a shared `NewsworthyEventEnvelope` +
  `NewsworthinessMetadata` (`salienceInputs`, `sourceType` — explicitly incl. `mediaOutlet` —
  `sourceConfidence`, `audienceScopeHint` local→global, `decayHint`, `legalRiskClass`). It
  **explicitly reserves "FMX-82 media outlet cadence/stance/reach/reliability rules" as out of
  scope**. These events are this work's **input**.
- **ADR-0043** (accepted) Notification = durable delivery / inbox / preferences only — not
  content meaning. **ADR-0052** People owns journalist/persona truth and **explicitly excludes**
  outlet publication cadence/stance/delivery. **ADR-0030** LLM out of authoritative state —
  generated prose is display-only. **ADR-0062** Audience & Atmosphere owns fan segments / mood /
  atmosphere, not editorial behaviour.

**The precise gap:** the **media outlet as an operational actor** — its identity & persistence,
editorial stance/bias, reach/audience-scope, and the cadence + fact-selection (salience) policy
deciding *which* newsworthiness facts each outlet publishes and *with what slant*.

## Evidence summary

### Prior art (games) — [[raw-perplexity/raw-media-outlet-games-2026-06-07]]
Most sims treat outlets as **lightweight flavour skins**. **Football Manager** is the genre
benchmark but persists identity at the **journalist/relationship level, not the outlet** (outlets
are static labels; bias lives in journalist hidden traits + manager "Media Handling"). OOTP =
one editable "paper" per league (a UI wrapper, neutral + templated). EA FC/FIFA = cosmetic
branding + morale levers. Anstoss = strong comedic flavour/art but global narration, no per-outlet
AI. Motorsport Manager = generic feed + media-day morale choices. **The documented pitfalls** are
exactly what a deeper model must beat: repetitive template-obvious press, **fake-feeling identical
outlets**, **no memory**, shallow choices. Media feels *alive* with: persistent identities w/
coherent behaviour, a **structured outlet model** (reach/type/alignment + type-specific impact
weights), **narrative threads** with memory, dynamic relationship/context-driven stance, and
**multi-system consequences**.

### Real-world media ecology — [[raw-perplexity/raw-media-outlet-realworld-2026-06-07]]
The ecology collapses cleanly to a **small attribute set per outlet**: **Type · Stance · Reach ·
Reliability · Cadence**. Eight type archetypes (broadsheet, tabloid, regional/local, club-aligned/
in-house, broadcaster, wire, online/aggregator, fan media) differ predictably. Stance decomposes
into `ClubAffinity`, `Sensationalism`, `Independence`, `AccessDependence`, `CommercialFocus`,
driven by ownership/revenue-model/access-journalism/regional-loyalty/rivalry. Reach = geographic
scope × audience size × composition; coverage of a club scales with a per-club **"news gravity"**
(size × history × star power × league prestige). Cadence = base (by club size × outlet type) +
matchday/transfer-window/crisis/big-event factors. Rivalries, results and the **manager↔outlet
relationship** modulate tone and volume; stance realistically **drifts** over a season.

### DDD / determinism — [[raw-perplexity/raw-media-outlet-ddd-determinism-2026-06-07]]
On bounded-context criteria (**ubiquitous language, cohesion, volatility, ownership**) the
outlet *operational simulation* ("who covers what, cadence, stance drift" — agents in the world)
is a **different capability and change-rhythm** from Narrative's *content rendering* → a strong
hint to **separate it from Narrative**. Recommended deterministic selection = **per-outlet scoring
+ per-edition budget** (finite front page), with `noise` from a **seeded PRNG per (outletId,
eventId, seasonSeed)**, implemented as a **pure function**; cadence as `OutletEditionOpened/Closed`
domain events. Outlets should be **persistent named aggregates** (created at world-gen, stable
identity + memory, stance drift as replayable events), with optional ephemeral micro-outlet
fillers. Stance reacts to other contexts via **integration events → local projections (no cross-
context joins)**, with `OutletStanceAdjusted` emitted so drift is inspectable. A clean three-layer
split keeps **outlet reach** (Media Ecology domain) ≠ **delivery** (Notification read-model) ≠
**player feed** (UI, non-authoritative).

## Decisions (Nico, live, 2026-06-07)

| # | Question | Choice | Summary |
|---|---|---|---|
| **D1** | Ownership / BC boundary | **B** | **New "Media Ecology" bounded context (20th).** Overrides the issue's "fold into Narrative" recommendation. Outlet operational simulation is separated from Narrative content rendering on cohesion/volatility/ownership grounds. Map patch **proposed, not applied** (ratify gate). |
| **D2** | Persistence/identity | **A** | **Persistent named outlets** generated at world-gen; stable identity + memory (affinity/relationship drift, narrative-thread history); optional ephemeral micro-outlet fillers; IP-safe names (ADR-0007/GD-0015). |
| **D3** | Stance model | **A** | **Base archetype + deterministic dynamic drift** from read-only signals via integration events → local projections (no joins); drift is a replayable `OutletStanceAdjusted` event. |
| **D4** | Cadence + selection | **A** | **Per-outlet scoring + per-edition budget**, seeded PRNG per `(outlet,event)`; per-outlet cadence config; reach = domain attr (maps to ADR-0076 `audienceScopeHint`) ≠ Notification delivery ≠ UI feed. |

These ground **ADR-0085** (architecture/boundary) and **GD-0034** (gameplay model), both authored
`proposed`/`draft` per never-self-accept.

## Open issue-questions — resolved

- *Is editorial stance influenced by Rivalry / Audience signals, via which read models?* — **Yes**
  (D3): Media Ecology projects `RivalryIntensityChanged`, `FanSentimentUpdated`,
  `BoardPressureChanged` and match/form facts into a **local** `ClubNarrativeSignals` projection;
  stance drift reads only that projection + the `MediaOutlet` aggregate. No cross-context joins.
- *Persistent named entities or per-fixture ephemeral?* — **Persistent named** (D2), with optional
  ephemeral fillers.
- *Does reach interact with Notification delivery preferences?* — **No coupling** (D4): reach is a
  Media-Ecology domain attribute mapping to ADR-0076 `audienceScopeHint` and feeding Audience &
  Atmosphere; Notification independently routes coverage to per-user inboxes; the UI feed filters
  non-authoritatively.

## Honest limitations / deferred

- **All magnitudes are calibration debt** → **FMX-52**, behind `mediaEcologyModelVersion`: scoring
  weights `w_*`, per-edition budgets, salience thresholds, cadence base/factors, stance-drift rates,
  reach weights, news-gravity formula, outlet-roster size per market.
- **RNG label** for the selection `noise`/world-gen roster: proposed to **reuse `WorldAiMgmtRng`**
  with a media sub-label (outlets are AI-world actors), rather than a new locked stream — an **open
  ratification item** for Nico (ADR-0085 §Open ratification item).
- Outlet→effect **magnitudes on fan mood/board/morale** are directions only here; the effect
  *application* stays with the owning contexts (Audience & Atmosphere, Club Management, Squad &
  Player) per ADR-0030 / ADR-0076 invariants — Media Ecology emits facts/intents, never writes them.
- Genre evidence is shape-only (FM/OOTP internals are not public to numeric precision).
