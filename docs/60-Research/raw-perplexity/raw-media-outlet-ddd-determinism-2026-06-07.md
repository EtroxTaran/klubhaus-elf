---
title: "Raw — DDD boundary + deterministic selection/persistence for media outlets (FMX-82)"
status: raw
tags: [research, raw, perplexity, ddd, determinism, bounded-context, salience, event-driven, fmx-82]
created: 2026-06-07
updated: 2026-06-07
type: research
binding: false
linear: FMX-82
related:
  - [[../media-outlet-operational-behaviour-2026-06-07]]
---

# Raw capture — DDD / determinism (Perplexity, 2026-06-07)

Verbatim-faithful capture of the Perplexity strand on the DDD boundary and the
deterministic selection/persistence design for media outlets. Synthesis in
[[../media-outlet-operational-behaviour-2026-06-07]].

## Prompt (summary)

For a deterministic, replay-safe modular-monolith football sim (transactional outbox; LLM
out of authoritative state): a Narrative BC already owns press/media CONTENT authoring; source
contexts publish self-contained newsworthiness integration events (metadata: salienceInputs,
sourceType incl. mediaOutlet, sourceConfidence, audienceScopeHint, decayHint, legalRiskClass).
Model the media OUTLET as an operational entity (identity, stance/bias, reach, cadence + salience
selection). (1) sub-aggregate in Narrative vs Audience submodule vs NEW bounded context? DDD
criteria. (2) deterministic content-selection/salience + cadence best practice. (3) persistent
named outlets vs ephemeral — trade-offs for determinism/save-size/replay/living-world. (4) how
stance reacts to read-only signals WITHOUT cross-context joins. (5) outlet reach vs delivery/
notification vs the player's feed. Concrete recommendations + named risks.

## Key findings (verbatim-faithful)

### (1) Where outlet behaviour lives — recommend a NEW "Media Ecology" BC
Use bounded-context criteria: **ubiquitous language, cohesion, volatility, ownership** (Vernon).
- Narrative language = "article/headline/tone/angle/quote/template/copy/press-conference dialogue".
- Media-outlet language = "outlet/editorial line/partisanship/coverage area/cadence/assignment
  desk/exclusive/source/rumour amplification".
- Audience language = "fan mood/sentiment/attendance/social buzz/pressure/atmosphere".
- **Cohesion & volatility**: outlet behaviour evolves on its own axis (salience/selection, bias
  params, coverage rules; later paywalled/tabloid/broadcaster behaviours, social propagation,
  echo chambers). Narrative authoring evolves on a different rhythm (templates, prompts, tone).
  Different change rhythms + conceptually different capabilities → **should not be one BC**.
- **Operational vs representational**: Narrative *renders content*; outlets *decide what gets
  coverage, who covers it, how much* — that's an operational **simulation of institutions**
  ("agents in the world"), not formatting logic.
- **Team/ownership**: a simulation team should evolve outlet dynamics without entangling content
  authoring → **Media Ecology as its own bounded context**.
- Context map: core contexts → publish `NewsworthinessIntegrationEvents`; **Media Ecology**
  subscribes, applies outlet policies, emits `MediaCoverageEvents` (`OutletPublishedStory`,
  `OutletIgnoredStory`, `OutletReframedStory`); **Narrative** subscribes to `OutletPublishedStory`
  → prose; **Audience & Atmosphere** subscribes to coverage → fan sentiment/pressure.

### (2) Deterministic salience/cadence — scoring + constrained budget
Per outlet per "tick"/edition:
1. **Candidate set**: events in the outlet's temporal window, audience-scope compatible,
   legality-filtered (drop `legalRiskClass` above the outlet's threshold).
2. **Deterministic per-outlet score**:
   `score = w_s·salienceInput + w_b·biasAlignment + w_o·outletPriority + w_d·decay(time) +
   w_l·legalRiskPenalty + noise`, where `noise` is a **seeded PRNG per (outletId, eventId, seasonSeed)**
   — variety but replay-stable.
3. **Budget-based selection**: per-cycle budget (finite headline/minor slots); stable sort
   (eventId tiebreaker); take top-N. Threshold-only spikes on busy days and loses "finite front
   page"; budget-only can bury important news; combine budget + a minimal threshold.
**Cadence**: per-outlet config ("daily edition"/"breaking continuous"/"weekly magazine") as
time-based domain events `OutletEditionOpened/Closed`; on open, run selection and emit
`StoryPublished` (outletId, editionId, storySlot, eventId, **angleCode**). Map event type → a
small set of angle codes via stance; Narrative turns angleCode into prose. Implement selection as
a **pure function** `(OutletState, CandidateEvents, EditionConfig) → [CoverageDecision]`. No wall
clock, no real randomness; only PRNG seeded by known IDs/seeds.

### (3) Persistent vs ephemeral — recommend PERSISTENT named outlets
Simulating **institutions with identity** → persistent.
- **Persistent** (created at world-gen; stable `OutletId`; slowly-evolving stance; event-sourced):
  deterministic (state changes are events; replay reproduces decisions); "living world" feel
  (players recognise outlets, rivalries/long narratives emerge); rich modelling (stance drift,
  reach growth, rebranding); efficient replay. Cons: save size (many local outlets add up);
  migration complexity.
- **Ephemeral** (label per coverage at render time): minimal state, simple; but **no identity/
  memory** (can't say "this outlet is biased against us"), harder reach/influence over time,
  flatter feel.
- Recommendation: **`MediaOutlet` as a long-lived aggregate** with identity + static metadata,
  slowly-changing stance/bias, reach params, cadence config, persistent memory (e.g. "history of
  negative coverage of Club X"). Generate at world-gen with a deterministic seed; store creation
  events. Keep a smaller number of **ephemeral micro-outlets** only for flavour fillers.

### (4) Stance reacting to other contexts WITHOUT cross-context joins
Event-driven integration + local read models. Core contexts raise integration events
(`ClubWonMatch`/`ClubLostDerby`, `BoardPressureChanged`, `RivalryIntensityChanged`,
`FanSentimentUpdated`, etc.). Media Ecology subscribes and projects them into **local read models**
(`ClubNarrativeSignals` per club: recentForm, fanAnger, boardPressure, rivalryTension; optional
`LeagueSignals`) and per-(outlet,club) `OutletClubAffinity`. Stance updates via deterministic
rules and are themselves emitted as events (`OutletStanceAdjusted`) — replayable/inspectable.
Selection reads only from `MediaOutlet` aggregate state + local projections + the current
newsworthiness events. **No runtime cross-context query.** Integration events are versioned/additive.

### (5) Outlet reach vs delivery vs player feed — clean separation
- **Media Ecology** owns **outlet reach** (`audienceScope` local/league/continental/global +
  `reachWeight`, optionally segmented by region/club/competition) and emits **MediaCoverage events**
  with `effectiveAudienceScope` + `reachWeight` — authoritative facts: "Outlet X published this,
  potentially visible to such audience."
- **Audience & Atmosphere** uses `effectiveAudienceScope`/`reachWeight` to adjust fan mood/pressure
  (what the simulated public is assumed to see) — not what the player sees.
- **Delivery/Notification** (technical/read-model layer, not a domain BC): subscribes to coverage
  events, applies routing rules per inbox/user, writes per-user `NewsFeedItem`/Notification rows
  (outbox-like projection). 
- **Player's news feed (UI/app layer)**: filters/ranks delivered items for cognitive load; **not
  authoritative** — it never changes world state.

### Named risks + mitigations
1. **Context bloat / anemic boundaries** → keep Narrative for rendering; Media Ecology for
   simulation.
2. **Non-determinism sneaking in** → pure functions of event-stream + deterministic config +
   seeded PRNG; simulation clock as a domain concept, no `DateTime.Now`, no live LLM in
   authoritative paths.
3. **Cross-context joins / hidden coupling** → integration events + local projections only;
   projections are disposable/rebuildable.
4. **Event explosion / unbounded state** → bound the number of persistent outlets + cadences;
   snapshots/summaries; archive old coverage.
5. **Overcomplex scoring** → keep scoring linear & sparse; externalise per-type config; record
   score breakdowns for tuning.
6. **UI/domain leakage** → MediaCoverage decided with no knowledge of the human player; UI
   filtering happens after domain events via read models only.

(Architecture citations: Vernon strategic design; event-driven DDD; Fowler event-driven; outbox
pattern. Used as pattern authority, not numeric authority.)
