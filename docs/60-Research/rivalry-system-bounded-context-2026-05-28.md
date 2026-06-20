---
title: Rivalry System Bounded Context - Ownership Synthesis 2026-05-28
status: draft
tags: [research, rivalry, derby, bounded-context, fmx-34]
context: rivalry
created: 2026-05-28
updated: 2026-05-28
type: research
binding: false
linear: FMX-34
sourceType: external
related:
  - [[raw-perplexity/raw-rivalry-system-2026-05-28]]
  - [[fan-culture-segmentation-research]]
  - [[../50-Game-Design/rivalry-system]]
  - [[../50-Game-Design/fan-ecology]]
  - [[../50-Game-Design/matchday-event-engine]]
  - [[../20-Features/feature-rivalry-system]]
  - [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
  - [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]]
  - [[../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]]
  - [[../10-Architecture/bounded-context-map]]
---

# Rivalry System Bounded Context - Ownership Synthesis 2026-05-28

## Question

The 15-context bounded-context map has no Rivalry owner.
`rivalry-system.md` (GDDR draft) designs a concrete five-sub-score
emergent model (regional, historical, sporting, fan-incident,
transfer-tension) with threshold tiers (None / Mild / Strong / High /
Volatile), per-season decay rules, an explicit consumer list and a
documented effect chain. But no context claims the rule catalog +
sub-score computation + threshold FSM + graph.

**Who owns the Rivalry System?**

## Status

This is a sourced ownership dossier for FMX-34. It does not change the
bounded-context map. The recommendation feeds a new draft ADR-0057
(`status: proposed`, `binding: false`) that Nico ratifies separately.

`raw research -> this synthesis -> ADR-0057 §Options + §Recommendation -> Nico decision`

## Summary

**Recommendation: Option C (Rivalry System as own bounded context,
16th).** Five-of-six DDD split criteria fire (own ubiquitous language
- rivalry / derby / sub-score / intensity tier / fan-incident memory;
own lifecycle - threshold-tier FSM + per-season decay; own storage
boundary - rivalry-edge graph; multiple consumers - Fan Ecology +
Matchday-Event-Engine + Watch Party + Manager & Legacy + Notification
+ Match + Tactics + Regulations + People + Narrative; cross-cutting
role). Vernon's canonical scoring-context pattern (credit rating,
customer affinity, recommendation, supplier relationship) is the
direct DDD analogue. Real-world precedent (UEFA risk-match
classification, Premier League Category A/B/C, Bundesliga Rotspiel)
confirms rivalry is operationally distinct from league orchestration
and club management. The scope is smaller than Tactics or Regulations
- a single aggregate type plus graph plus light FSM - which is a
real risk worth naming, but the cross-cutting consumer count and
independent lifecycle outweigh it.

## Findings

### Finding F1: Rivalry has rich design with concrete formula and consumers, but no named owner

- **Source:** [[../50-Game-Design/rivalry-system]] (draft); [[../20-Features/feature-rivalry-system]] (draft).
- **Confidence:** High (direct quotation).
- **Finding:** Rivalry GDDR designs:
  - **5 sub-scores** weighted into `rivalry_score` 0-100 (regional
    0.25, historical 0.20, sporting 0.25, fan-incident 0.15,
    transfer-tension 0.15).
  - **Regional** 0-30 / 30-60 / 60-100 by distance bands; +5 for
    shared cultural/linguistic markers.
  - **Historical** +10 per decade shared league, +5 per important
    moment, decay -1 per 10 seasons no contact.
  - **Sporting** +5 per recent decisive loss (5 seasons), +10 per
    major decider lost, +3 per close derby loss, decay -2 per season.
  - **Fan-incident** +10 per match-day security incident, +5 per
    high-profile media incident, +3 per minor incident, decay -3 per
    season.
  - **Transfer-tension** +15 per "icon" leaving to rival, +5 per any
    senior transfer, +3 per agent/contract dispute, decay -2 per
    season.
  - **Threshold tiers**: 0-20 None, 20-40 Mild, 40-65 Strong, 65-85
    High, 85-100 Volatile.
  - **Mechanical effects**: atmosphere ×1.15 (Strong) / higher
    security event probability + higher catering per fan + watch-
    party auto-proposal (Strong+).
  - **Constraint**: emergent only (no player nomination); symmetry
    approximate.
  - **UI tiers**: Quick (badge + 1-line history), Standard (rivalry
    card with sub-score breakdown), Expert (full graph view + incident
    timeline).
- **Impact on FMX-34:** The catalog + formula exist concretely in
  design. Naming an owner is necessary for MVP storage, schema, event-
  ingest contract and read-model exposure. Naming none keeps multiple
  consumers in design limbo.

### Finding F2: Fan Ecology + Matchday-Event-Engine already consume rivalry_score concretely

- **Source:** [[../50-Game-Design/fan-ecology]] §3 + §4 + §6;
  [[../50-Game-Design/matchday-event-engine]] (approved, binding).
- **Confidence:** High.
- **Finding:**
  - **Fan Ecology §3 atmosphere engine pseudocode** lists
    `rivalry_score * 0.20` as one input to atmosphere computation.
  - **Fan Ecology §4 per-capita revenue model** includes `derby_
    factor` as one input.
  - **Fan Ecology §6 "rivalry-driven fan loading"**: high score →
    segment population temporarily ↑ for the derby; high score →
    atmosphere multiplier ×1.3; high score → risk-event probabilities
    ↑.
  - **Matchday-Event-Engine (binding)** uses rivalry_score as an
    input to Pyro-incident probability: "High `rivalry_score`, recent
    fan-incident memory, low security upgrade." Effect: fine, partial
    sector closure, media event.
- **Impact on FMX-34:** Concrete cross-context consumption is already
  designed. Fan Ecology reads rivalry as a query; Matchday-Event-
  Engine reads rivalry as a trigger input. The Vernon canonical
  pattern (Query 2) - consumers treat scores as external facts and
  apply their own policies in their own contexts - is already the
  implicit design intent. Naming the producer is the missing piece.

### Finding F3: ADR-0056 Regulations sanction chain consumes rivalry-driven security escalation

- **Source:** [[../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]]
  + [[fan-culture-segmentation-research]] §5.
- **Confidence:** High.
- **Finding:** Regulations & Compliance (accepted 2026-05-28) owns
  the sanction catalog (warning → fine → points deduction →
  registration block → licence refusal). Sanction trigger sequence:
  Rivalry-System computes rivalry_score → Matchday-Event-Engine uses
  it as Pyro-incident trigger → Security event fires → Sanction chain
  escalates via Regulations. The high-security classification (per
  matchday-event-engine §4.3 + fan-culture §5) is "triggered when
  rivalry + table situation + fan-risk profile align".
- **Impact on FMX-34:** Rivalry sits *upstream* of Regulations'
  sanction chain. The producer must be a clean upstream context
  publishing rivalry-status read models that Matchday-Event-Engine
  (owned by Club Management) consumes. Embedding rivalry inside Club
  Management or Regulations confuses the producer/consumer direction.

### Finding F4: DDD canonical pattern - cross-cutting scoring system as own bounded context

- **Source:**
  [[raw-perplexity/raw-rivalry-system-2026-05-28]] Query 2; Vaughn
  Vernon strategic design; Microsoft Learn DDD guidance; Vaadin DDD
  primer.
- **Confidence:** High.
- **Finding:** Vernon-style answer: cross-cutting scoring system
  warrants its own bounded context when:
  - Distinct ubiquitous language (scores, decay, thresholds, ranking,
    calibration, features) - applies ✓.
  - Multiple upstream inputs (Match, Transfer, Incident, Geography) +
    multiple downstream consumers (Ticketing, Marketing, Scheduling,
    Media, Compliance) - applies ✓ (FMX: Match + Transfer + Fan
    Ecology incidents + Geography).
  - Independent lifecycle + deployment (change scoring algorithm
    without coordinating Club/League) - applies ✓.
  - Different non-functional needs (batch / streaming / decay
    computation vs transactional Club/League ops) - applies ✓ (per-
    season decay is deterministic batch).
  - Substantial domain rules (lifecycle, decay, thresholds) - applies
    ✓ (5 sub-scores + decay rates + 5-tier FSM).
  - Real-world DDD analogues converging on the same answer:
    - **Credit rating / risk score** - own BC; upstream of Sales /
      Trading / Compliance.
    - **Customer affinity / propensity / segmentation** - own BC;
      Marketing / Recommendation / CRM downstream.
    - **Recommendation relevance scores** - own BC; Vernon explicitly
      discusses reporting/analytics as separate contexts.
    - **Supplier relationship / supplier score** - own BC.
- **Canonical context-mapping pattern**:
  - Separate bounded context for scoring.
  - Input via domain events from each source context.
  - Process manager / saga inside scoring context for long-running
    event reactions (sequence-based escalation).
  - Domain service for actual scoring calculation.
  - CQRS-style read models for consumer access.
  - Consumers treat scores as external facts; apply own policies in
    own contexts.
- **Where does the relationship graph live?** Inside the scoring
  context. Club provides identity (ClubId); Scoring stores
  `RivalryEdge(ClubA, ClubB, score, history, state)`.
- **Anti-pattern Vernon explicitly warns against:** "On-demand
  Domain Service called by each consumer" - leaks cross-context
  model.
- **Impact on FMX-34:** Strong direct DDD support for Option C
  (Rivalry as own bounded context).

### Finding F5: Real-world rivalry classification is operationally distinct from league + club management

- **Source:**
  [[raw-perplexity/raw-rivalry-system-2026-05-28]] Query 3; UEFA
  Stadium and Security Regulations 2023-2024; SGSA Green Guide;
  Bundesliga DFL Rotspiel documentation.
- **Confidence:** High.
- **Finding:** Real-world 2024-2026 rivalry classification systems:
  - **UEFA Stadium and Security Regulations** classify matches Low /
    Medium / High risk via match-risk-assessment process. Inputs:
    history of incidents, rivalries + derby character, political /
    ethnic / religious tensions, expected away following, kick-off
    time, public order intelligence. High-risk consequences:
    increased steward/police presence with specific ratios,
    segregation + buffer zones, enhanced entry controls, alcohol
    controls, Security Officer + SLO coordination, enhanced CCTV +
    command/control centres.
  - **Premier League + SGSA** use Category A / B / C. C = high-risk
    (more officers + specialist resources). Inputs: historical
    disorder data, fixture rivalry profile, match timing, alcohol
    risk, pyrotechnic intelligence, away allocation size, distance,
    transport.
  - **Bundesliga + DFL** use **Rotspiel** ("red match") designation.
    Inputs: police records, rivalry + fan-scene classifications,
    expected away numbers + travel patterns, political / ideological
    conflicts. Consequences: massive police deployment, intensified
    entry controls, alcohol restrictions, wider buffer zones, more
    segregated access.
- **Real-world incident decay (3 overlapping systems):**
  - Police / public order maintain databases tied to fixtures + clubs
    + groups. Recent incidents weighted more; uneventful fixtures
    downgraded after several seasons. Football banning orders 3-10
    years.
  - Leagues / federations (UEFA + national FAs + leagues) maintain
    disciplinary histories. Repeat-offender escalators within window.
    Probation periods where future offences reactivate suspended
    sanctions.
  - Clubs internal records with rolling look-back (3-5 seasons,
    higher weight on last 1-2).
- **Documented derby attendance + revenue premiums**: higher
  attendance vs baseline (econometric studies, several percentage
  points of capacity); higher ticket prices / yield per ticket;
  elevated hospitality + corporate demand (close to 100% sell-
  through); greater broadcast viewership → long-term rights value.
- **Impact on FMX-34:** Real-world precedent strongly supports a
  distinct rivalry-classification subsystem feeding both operational
  (security + sanction) and commercial (attendance + revenue)
  consumers. The FMX rivalry-system.md design closely mirrors this
  structure. Option C aligns with industry practice; Option A
  (League sub-aggregate) or Option B (Club sub-aggregate) would
  bury an operationally-distinct concern inside an unrelated context.

### Finding F6: Genre precedent is thin but not contradictory

- **Source:**
  [[raw-perplexity/raw-rivalry-system-2026-05-28]] Query 1.
- **Confidence:** Low (source-thin).
- **Finding:** FM has pre-authored rivalry relationships in the
  database; exact formula NOT publicly documented. The FM match
  engine is highly multi-factor + data-driven; rivalry-specific
  inputs not exposed. EA FC Career, OOTP, FIFA Manager, Anstoss not
  verifiable from retrieved sources. No surveyed title has documented
  an explicit emergent 5-sub-score rivalry-intensity engine.
- **Impact on FMX-34:** FMX would lead the genre with the
  rivalry-system.md design. Genre comparison is weak but does NOT
  contradict the carve. The DDD + real-world findings (F4 + F5) carry
  the load-bearing argument.

## Inputs For Decisions

If Option C is accepted, the following items encode in ADR-0057:

- **Context owner:** Rivalry System as the next bounded context (16th
  if accepted before ADR-0052 / ADR-0054; 17th / 18th depending on
  acceptance order of parallel drafts).
- **Owned aggregates:**
  - `RivalryEdge` aggregate (per club pair: ClubA × ClubB →
    sub-score graph + history; threshold-tier FSM with 5 states
    None / Mild / Strong / High / Volatile).
  - `RivalrySubScoreHistory` (per RivalryEdge: timeline of sub-score
    updates with source-event references).
  - `RivalryGraphSlice` projection (per club: top-N rivals snapshot
    for UI + read-model queries).
- **Public contract:**
  - Commands: `RegisterRivalryPairCandidate` (lazy on first match
    fixture between two clubs), `RecordIncidentSignal`,
    `RecordTransferTensionSignal`, `ApplyEndOfSeasonDecay`,
    `ReclassifyTierBoundary` (admin / community-overlay override).
  - Events: `RivalrySubScoreUpdated`, `RivalryTierTransitioned`
    (None → Mild → Strong → High → Volatile with deterministic
    causes), `RivalrySnapshotTakenForFixture`,
    `RivalryDecayApplied`.
  - Queries (read models):
    - `RivalryScore(clubA, clubB, date)` - composite score + tier
      classification + sub-score breakdown.
    - `IsDerbyFixture(matchId)` - boolean + tier label + supporting
      reasons (regional / historical / sporting / fan-incident /
      transfer-tension).
    - `TopRivalsForClub(clubId, limit)` - ranked rival list for UI.
    - `RivalryIncidentTimeline(rivalryEdgeId)` - Expert-tier UI
      consumer.
    - `RivalryGraphSnapshot(saveDate)` - full graph for analyst /
      Manager & Legacy retrospective consumption.
- **Consumed facts:**
  - `MatchResolved` from Match - sporting sub-score updates
    (decisive loss + major decider + close derby loss; per
    rivalry-system.md sporting scoring rules).
  - `TransferCompleted` from Transfer - transfer-tension sub-score
    updates (icon leaving + senior transfer + dispute).
  - `FanIncidentLogged` from Fan Ecology - fan-incident sub-score
    updates (security incident + media incident + minor).
  - `ClubFoundedInLocation`, `ClubRelocatedToLocation` (rare) from
    Club Management - regional sub-score base.
  - `SeasonAdvanced` from League Orchestration - triggers
    deterministic per-season decay batch.
- **Storage scope:** per-save schema (`save_<uuidv7hex>`) per
  ADR-0027. No platform-scope cross-save rivalry state.
- **Determinism:** Rivalry state is per-save; new save creation may
  receive a legacy-configured rivalry seed (e.g., historical rivalries
  pre-populated from era profile) via ADR-0051 Manager & Legacy
  legacy seeds when applicable; the seed is copied into the save
  snapshot at creation and never re-read.
- **Scoring computation pattern (Vernon canonical):**
  - Domain service `RivalryScoringService` owns the formula.
  - Process manager `RivalryEventAggregator` inside Rivalry context
    consumes upstream domain events and updates `RivalryEdge`
    aggregates.
  - CQRS read models published via Open Host Service for query
    consumers.
- **Map patch proposal:** insert "Rivalry System" as the next bounded
  context row in §1; add `Rival` node + edges in §2 Mermaid
  (consumes Match + Transfer + Fan Ecology incidents + League season
  ticks; publishes rivalry-status read models + tier-transition
  events to Fan Ecology + Matchday-Event-Engine via Club + Watch
  Party + Manager & Legacy + Notification + Match + Tactics); add
  `rivalry/` folder in §4 source mapping. Insert position depends on
  acceptance order of parallel drafts; the patch is order-tolerant.

## Future-scope notes (classified future-scope)

Not ratification blockers; resolve in follow-up GDDR / ADR work:

1. **Manager & Legacy "derby specialist" archetype signal.** GD-0019
   explicitly defers ("dynamic style-tag composition, no fixed
   archetype yet"). When the signal channel lands, Rivalry publishes
   `DerbyWinRate(managerId, period)` + `DerbyLossRecovery` read
   models that Manager & Legacy consumes for archetype confidence
   weighting.
2. **Tactics derby-specific opposition awareness.** ADR-0055 Tactics
   models opposition templates as archetype-based (8 archetypes +
   25-30 sub-archetypes + 10 manager-signature). Derby-specific prep
   could surface as a `DerbyContext` query that Tactics consumes
   when preparing for high-tier fixtures - but only post-MVP per
   GD-0019 future-scope. Tactics catalog stays archetype-based;
   `DerbyContext` is a presentation-layer filter / read-model
   composition, not a tactical-state mutation.
3. **People (ADR-0052 draft) journalist / fan-rep personas with
   derby framing.** When ratified, journalists with rival-club
   association produce derby-themed Persona context cards. Rivalry
   publishes the tier-label read model that People consumes for
   persona attribution.
4. **Narrative (ADR-0054 draft) derby-specific media framing.** When
   ratified, Narrative consumes `IsDerbyFixture` + tier label for
   pre/post-match copy generation. Rivalry stays scoring-only;
   Narrative owns content authoring with deterministic fallback
   templates per ADR-0030.
5. **Watch Party auto-propose for Strong+ rivalries.** Watch Party
   subscribes to `RivalryTierTransitioned` events + queries
   `IsDerbyFixture` for upcoming fixtures.
6. **Cross-country rivalries (Phase 2 per feature-rivalry-system.md
   §Post-MVP).** Geographic sub-score model extension; rivalry
   schema supports the dimension; specific catalogs land as data
   updates.
7. **Rivalry-driven media event campaigns (Phase 2).** Out-of-first-
   release per feature-rivalry-system.md; Narrative-territory.
8. **Named ultras-group rivalries.** Per fan-ecology constraint:
   named fan groups are MVP narration overlay only; rivalry stays
   club-pair-based.
9. **Community-pack rivalry seed overrides (FMX-33 Community Overlay
   Pipeline territory).** Communities pre-populate historical
   rivalries (e.g., "Old Firm", "Superclasico") via overlay packs.
   Rivalry BC owns schema + semantic validation per Vernon
   (analogous to ADR-0056 Regulations community-override
   responsibility); FMX-33 owns import workflow.
10. **Anti-fan-bias safeguards (real-world parallel of football
    banning orders + away allocation caps).** Future-scope; rivalry
    publishes tier; consumer contexts apply policies.

## Why not Option A (Sub-aggregate inside Club Management)?

Club Management absorbs rivalry because Club already owns "fans" +
matchday revenue + atmosphere consumers.

- **Locality argument:** Fan Ecology + matchday-event-engine already
  live inside Club Management's domain scope (per bounded-context-map
  §1 Club Management row: "infrastructure, sponsors, board, fans,
  insolvency state").
- **Arguments against:**
  - Rivalry is a **between-club** concern; Club Management owns
    *single-club* state. The rivalry graph spans all clubs; embedding
    it in Club Management means every club aggregate references all
    others, violating Vernon's aggregate boundary rules.
  - Cross-context consumers (Watch Party, Manager & Legacy, Tactics
    for opposition awareness, Match for derby classification marker,
    Notification for derby-themed copy) would query Club Management
    just to get rivalry - mixing club state queries with rivalry
    queries in one context.
  - ADR-0050 Club Management ledger boundary is already substantial
    (finance + budget + sponsor + board + fan + infrastructure +
    insolvency). Adding rivalry as a sub-aggregate continues the
    "Club Management absorbs everything" pattern that FMX-32 (still
    pending) was opened to evaluate.
  - Vernon's anti-pattern: "the score is computed somewhere and
    rules are tightly coupled to its parent context's invariants" -
    rivalry's rules (decay, threshold tiers) are independent of any
    single Club's invariants.

## Why not Option B (Sub-aggregate inside League Orchestration)?

League absorbs rivalry because League already owns "fixtures, season,
table context, historical begegnungen" - calendar alignment.

- **Locality argument:** Historical fixtures (one input to historical
  sub-score) + current-season standings (one input to sporting sub-
  score) live in League's domain.
- **Arguments against:**
  - League's ubiquitous language is **orchestration**: season, week,
    match-day, mode, pause, quorum. Rivalry's language is **scoring**:
    sub-score, decay, threshold tier, intensity. Same meaning-drift
    Evans warns about - the FMX-30 Option-A counterargument applies
    identically here.
  - Cross-cutting consumers don't all live inside League's orbit.
    Fan Ecology, Matchday-Event-Engine, Tactics derby awareness,
    People journalist personas, Narrative derby framing are all
    downstream of rivalry - putting rivalry inside League makes
    League the publisher for non-League consumers.
  - Multi-input streams (Match results + Transfer events + Fan
    incidents) cross context boundaries already - if rivalry is in
    League, League consumes facts from contexts it doesn't otherwise
    interact with (Transfer signals, Fan Ecology incidents).
  - The "graph lives where its identity owner lives" anti-pattern
    Vernon warns about: Club has identity, rivalry is a relationship.
    League would store a between-club graph it doesn't own the
    nodes of.

## Why not Option D (Cross-cutting Policy Service / Domain Service called by each consumer)?

A `RivalryPolicy` domain service is called by each consumer; the rule
catalog has no dedicated context.

- **Trade-off:** this is Vernon's explicit anti-pattern (Query 2 raw
  research). "On-demand Domain Service called by each consumer" leaks
  cross-context model into everyone else's language, leads to tight
  coupling and duplication. Vernon warns against placing cross-
  cutting domain logic into shared services with no bounded context.
- **Specifically for rivalry:** the scoring algorithm + decay rules
  + threshold tiers + graph storage all need to live *somewhere* with
  consistent invariants. A "policy service" without a bounded context
  becomes a god-service shared by all consumers without clear
  ownership of the model.
- **Where Option D collapses into Option C:** as soon as you give the
  policy service its own model + lifecycle + storage + events, it IS
  a bounded context. So Option D either becomes Option C (with extra
  steps) or stays as the anti-pattern.

## What the ratification PR includes

Per the FMX-34 plan and
[[../30-Implementation/domain-research-workflow]] Phase 5:

- This synthesis note.
- The raw research at
  [[raw-perplexity/raw-rivalry-system-2026-05-28]].
- A new draft ADR-0057 with three options + Option D anti-pattern,
  §Recommendation = Option C, Public-contract sketch, determinism +
  storage rules, §Map patch proposal as fenced diff.
- Decision-Log row for ADR-0057 (`proposed`).
- Current-State FMX-34 anchor block.
- Session handoff naming the ratify-ask:
  *"Accept Option C (recommended), choose A / B, or Defer?"*

The bounded-context map is **not** modified by this PR. The §Map
patch applies only on Nico's acceptance via a follow-up apply PR
(analog FMX-35 / FMX-36 / FMX-37 / FMX-39).

## Related vault

- [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]] -
  modular monolith ground rules.
- [[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]] -
  per-save schema convention.
- [[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]]
  - event delivery mechanism.
- [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - Club Management ledger boundary; Club ledger consumes derby_
  factor revenue facts.
- [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
  - cross-save legacy seeds; era-specific rivalry pre-population
  future-scope.
- [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]] -
  derby-specific opposition awareness future-scope consumer.
- [[../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]]
  - sanction chain downstream of Pyro-incident events triggered by
  rivalry-driven security escalation.
- [[../50-Game-Design/rivalry-system]] - GDDR with full 5-sub-score
  model + threshold tiers + decay rules + UI tiers.
- [[../20-Features/feature-rivalry-system]] - feature scope; post-
  MVP depth scope.
- [[../50-Game-Design/fan-ecology]] §3, §4, §6 - atmosphere engine
  consumer + per-capita revenue derby_factor + rivalry-driven fan
  loading.
- [[../50-Game-Design/matchday-event-engine]] - Pyro-incident trigger
  consumer.
- [[fan-culture-segmentation-research]] - high-security classification
  inputs.
- [[../30-Implementation/domain-research-workflow]] - the workflow
  this dossier follows.
