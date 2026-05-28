---
title: ADR-0057 Rivalry System Context
status: accepted
tags: [adr, architecture, ddd, rivalry, derby, fmx-34, fmx-40, accepted]
created: 2026-05-28
updated: 2026-05-28
type: adr
binding: true
supersedes:
superseded_by:
related:
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[ADR-0050-club-economy-accounting-ledger]]
  - [[ADR-0051-manager-and-legacy-context]]
  - [[ADR-0053-staff-operations-context]]
  - [[ADR-0055-tactics-context]]
  - [[ADR-0056-regulations-compliance-context]]
  - [[ADR-0052-people-persona-and-skills-context]]
  - [[ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[ADR-0016-community-dataset-overrides]]
  - [[../../50-Game-Design/rivalry-system]]
  - [[../../50-Game-Design/fan-ecology]]
  - [[../../50-Game-Design/matchday-event-engine]]
  - [[../../20-Features/feature-rivalry-system]]
  - [[../../60-Research/rivalry-system-bounded-context-2026-05-28]]
  - [[../../60-Research/raw-perplexity/raw-rivalry-system-2026-05-28]]
---

# ADR-0057: Rivalry System Context

## Status

accepted

## Date

2026-05-28 (proposed) · 2026-05-28 (FMX-40 accepted by Nico, Option C)

## Ratification

Nico accepted Option C on 2026-05-28 after reviewing the FMX-34 dossier
(PR [#95](https://github.com/EtroxTaran/football-manager-x/pull/95)).
The §Recommendation below names Option C; the synthesis at
[[../../60-Research/rivalry-system-bounded-context-2026-05-28]]
documents the three converging arguments (DDD canonical scoring-
context pattern with credit-rating / customer-affinity /
recommendation real-world analogues, real-world UEFA risk-match +
Premier League Category A/B/C + Bundesliga Rotspiel precedent, and
concrete cross-context consumer designs in Fan Ecology + Matchday-
Event-Engine).

Application:

- Status flipped `proposed` → `accepted`; `binding: false` → `true`.
- The §Map patch proposal that lived in this ADR was applied to
  [[../bounded-context-map]] in the same PR (FMX-40). Rivalry System
  is now the **sixteenth bounded context** in the live map.
- The §Map patch proposal section is removed from this ADR as a
  result - its content lives in the map. Future amendments to the
  map go through normal ADR supersession
  ([[../../90-Meta/vault-governance]]).

## Context

The 15-context bounded-context map (after FMX-37 + FMX-39
ratifications) has no Rivalry owner. The GDDR
`rivalry-system.md` (draft 2026-05-16) designs a concrete emergent
five-sub-score model:

- **Regional** (weight 0.25): 0-30 / 30-60 / 60-100 by distance band;
  +5 for shared cultural/linguistic markers.
- **Historical** (weight 0.20): +10 per decade of shared league, +5
  per important historical moment, decay -1 per 10 seasons no
  contact.
- **Sporting** (weight 0.25): +5 per recent decisive loss (5
  seasons), +10 per major decider lost (10 seasons), +3 per close
  derby loss, decay -2 per season.
- **Fan-incident** (weight 0.15): +10 per match-day security
  incident, +5 per high-profile media incident, +3 per minor
  incident, decay -3 per season.
- **Transfer-tension** (weight 0.15): +15 per "icon" leaving to
  rival, +5 per any senior transfer, +3 per agent/contract dispute,
  decay -2 per season.

Aggregated to `rivalry_score` 0-100 with threshold tiers None (0-20)
/ Mild (20-40) / Strong (40-65) / High (65-85) / Volatile (85-100).
Mechanical effects: atmosphere ×1.15 (Strong) + higher security event
probability + higher catering per fan + watch-party auto-proposal
(Strong+).

Cross-context consumers exist concretely:

- **Fan Ecology** consumes `rivalry_score` in §3 atmosphere engine
  (`atmosphere = base + rivalry_score * 0.20 + table_context_score *
  0.15 + ...`), §4 per-capita revenue model (`derby_factor`), §6
  rivalry-driven fan loading (high score → atmosphere multiplier
  ×1.3 + risk-event probabilities ↑).
- **Matchday-Event-Engine** (binding) uses `rivalry_score` as
  Pyro-incident trigger input: "High `rivalry_score`, recent fan-
  incident memory, low security upgrade."
- **Regulations & Compliance** (ADR-0056 accepted) downstream
  consumer of Pyro-incident sanction chain triggered by rivalry-
  driven security escalation.
- **Watch Party** (post-MVP per `rivalry-system.md`) auto-proposes
  Strong+ fixtures.
- **Manager & Legacy** (ADR-0051 accepted, future-scope per GD-0019)
  "derby specialist" archetype signal aggregation.
- **Notification** (post-MVP) rivalry-themed inbox copy.
- **Match** derby-classification marker at `lineup_locked` for
  match-day operations.
- **Tactics** (ADR-0055 accepted, future-scope) derby-specific
  opposition awareness query.
- **People** (ADR-0052 draft) journalist / fan-rep persona derby
  framing when ratified.
- **Narrative** (ADR-0054 draft) derby-specific media framing when
  ratified.

`bounded-context-map.md` §1 attributes none of this. No closest
candidate context owns the rivalry catalog + sub-score computation +
threshold FSM + graph. The
[[../../60-Research/rivalry-system-bounded-context-2026-05-28]]
synthesis evaluates three options + Option D anti-pattern against
DDD authorities, genre precedent (thin) and real-world precedent
(UEFA risk matches + Premier League Category A/B/C + Bundesliga
Rotspiel).

## Options considered

### Option A - Sub-aggregate inside Club Management

Club Management absorbs rivalry as a sub-aggregate; locality with Fan
Ecology + matchday-event-engine already inside Club's domain.

- **Coupling:** weak - rivalry is a **between-club** concern; Club
  Management owns *single-club* state. The rivalry graph spans all
  clubs; embedding it in Club Management means every club aggregate
  references all others, violating Vernon aggregate boundary rules.
- **Test isolation:** weak - Club's runtime FSM (week + matchday +
  insolvency) and the rivalry-edge FSM share one context.
- **Service extractability:** weak.
- **Data sovereignty:** weak - cross-context consumers (Watch Party,
  Manager & Legacy, Tactics for opposition awareness, Match for derby
  classification marker, Notification for derby-themed copy) would
  query Club Management just to get rivalry; mixes single-club state
  with relationship-graph state.
- **Trade-off:** ADR-0050 Club Management ledger boundary is already
  substantial (finance + budget + sponsor + board + fan +
  infrastructure + insolvency). Adding rivalry as a sub-aggregate
  continues the "Club absorbs everything" pattern; FMX-32 (pending)
  is opened specifically to evaluate this growth.

### Option B - Sub-aggregate inside League Orchestration

League absorbs rivalry; locality with fixtures + historical
begegnungen + table context already in League.

- **Coupling:** weak - League's ubiquitous language is orchestration
  (season + week + match-day + mode + pause + quorum); rivalry's
  language is scoring (sub-score + decay + threshold tier +
  intensity). Same meaning-drift Evans warns about.
- **Test isolation:** weak - League runtime FSM and rivalry FSM
  coexist.
- **Service extractability:** weak.
- **Data sovereignty:** weak - multi-input streams (Match results +
  Transfer events + Fan incidents) cross context boundaries; League
  would consume facts from contexts it doesn't otherwise interact
  with (Transfer signals + Fan Ecology incidents).
- **Trade-off:** Club has identity (ClubId), rivalry is a
  relationship over identities. League would store a between-club
  graph it doesn't own the nodes of - DDD anti-pattern.

### Option C - New "Rivalry System" bounded context

Carve a dedicated context owning the rivalry-edge graph + sub-score
computation + threshold FSM + decay policy. Exposes Open Host Service
+ Published Language via CQRS-style read models. Consumers (Fan
Ecology, Matchday-Event-Engine via Club, Watch Party, Manager &
Legacy, Notification, Match, Tactics, Regulations, future People +
Narrative) treat rivalry-tier + score + derby-classification as
external facts and apply their own policies in their own contexts.

- **Coupling:** clean. Each consumer queries via published contract;
  rivalry graph + score formula + decay lives in one place.
- **Test isolation:** strong. Rivalry owns its own storage
  (`save_<uuidv7hex>` schema per ADR-0027); deterministic event
  fixtures drive tests.
- **Service extractability:** matches ADR-0019 §5 - extraction is a
  deployment change because all contracts are JSON-serialisable.
- **Data sovereignty:** explicit. Club provides identity (ClubId);
  Rivalry stores `RivalryEdge(ClubA, ClubB, score, history, state)`
  per Vernon's canonical scoring-context pattern. Graph traversal
  logic + threshold FSM + decay batch all live in Rivalry context.
- **Trade-off:** adds another bounded context to the map. The map is
  at 15 ratified + ADR-0052 (People) + ADR-0054 (Narrative) drafts.
  Adding Rivalry brings the potential total to 18 if all four drafts
  ratify. Modular-monolith stays one process per ADR-0019 §5.

### Option D (rejected as anti-pattern) - Cross-cutting Policy Service / Domain Service called by each consumer

A `RivalryPolicy` domain service is called by each consumer; rule
catalog has no dedicated context.

- **Trade-off:** Vernon's explicit anti-pattern (synthesis F4 raw
  research). "On-demand Domain Service called by each consumer"
  leaks cross-context model into everyone else's language, leads to
  tight coupling and duplication. Vernon warns against placing cross-
  cutting domain logic into shared services with no bounded context.
  Listed for completeness; rejected.

## Recommendation

**Option C (Rivalry System as own bounded context).** Three converging
arguments:

1. **DDD canonical pattern (synthesis F4) is decisive.** Vernon-style
   strategic design treats cross-cutting scoring system with own
   ubiquitous language + lifecycle (decay + thresholds + states) +
   multiple input streams + multiple downstream consumers as own
   bounded context. Real-world DDD analogues converge: **credit
   rating / risk score** (own BC upstream of Sales/Trading/
   Compliance), **customer affinity / propensity / segmentation**
   (Analytics BC upstream of Marketing/Recommendation/CRM),
   **recommendation relevance scores** (Vernon explicitly discusses
   as own context), **supplier relationship / supplier score** (own
   BC). Canonical pattern: separate BC + input via domain events +
   process manager / saga inside scoring context + domain service for
   calculation + CQRS read models exposed to consumers. Five-of-six
   DDD split criteria fire affirmative.

2. **Real-world structural precedent (synthesis F5) confirms rivalry
   classification is operationally distinct.** UEFA risk-match
   classification (Low / Medium / High), Premier League SGSA
   Category A / B / C, Bundesliga DFL Rotspiel are all distinct
   operational subsystems separate from league orchestration and
   club management. Inputs (geographic distance + head-to-head
   history + sporting stakes + fan-incident memory with decay +
   transfer-tension) match the FMX-rivalry-system.md design directly.
   Operational effects (security deployment + sanction escalation +
   attendance + revenue premiums) are documented across 2023-2026
   leagues. The FMX-rivalry-system.md design closely mirrors this
   structure; Option C aligns with industry practice; Option A / B
   would bury an operationally-distinct concern inside an unrelated
   context.

3. **Cross-context consumer concrete + designed (synthesis F2 + F3).**
   Fan Ecology + Matchday-Event-Engine already consume `rivalry_
   score` in their binding/draft designs; Regulations (accepted)
   downstream consumer of sanction chain. The Vernon canonical
   pattern (consumers treat scores as external facts and apply own
   policies in own contexts) is already the implicit design intent -
   naming the producer is the missing piece. Smallest carve that
   makes the cross-context contract explicit.

### Named risks

- **Map growth.** The map was 11 contexts on 2026-05-16; with
  FMX-25/26/28/30 ratified it is 15; adding Rivalry brings 16; if
  ADR-0052 People and ADR-0054 Narrative also ratify, total is 18.
  Modular-monolith stays one process per ADR-0019 §5; service
  extraction is a deployment change.
- **Scope is smaller than Tactics / Regulations.** Rivalry has
  roughly one aggregate (`RivalryEdge` + graph) + threshold FSM +
  decay policy. Lighter than Tactics (four aggregate types) or
  Regulations (five aggregate types + multi-regulator catalog).
  Real risk: the lighter scope could justify a sub-aggregate in an
  existing context. Mitigation: the cross-cutting consumer count (10+
  consumers across binding + draft + future-scope) and the
  Vernon canonical pattern decide the carve. **Lighter context is
  fine - DDD authorities (Query 2) confirm Recommendation /
  Analytics / Scoring contexts are routinely smaller than core
  contexts.**
- **Genre precedent is thin** (synthesis F6, low confidence). FMX
  would lead the genre with the explicit 5-sub-score emergent design.
  Not a contradiction; just a leadership claim.
- **Process Manager / Saga inside Rivalry for event-aggregation.**
  Pattern is well-established (ADR-0056 Process Manager for transfer
  eligibility; ADR-0053 Customer-Supplier + ACL for wage events).
  Curve tuning is GDDR territory.

Status stays `proposed` / `binding: false` until Nico ratifies.

## Decision

Propose a dedicated **Rivalry System** bounded context.

If ratified, Rivalry System owns:

- `RivalryEdge` aggregate (per club pair: ClubA × ClubB → sub-score
  graph + history; threshold-tier FSM with 5 states None / Mild /
  Strong / High / Volatile).
- `RivalrySubScoreHistory` (per RivalryEdge: timeline of sub-score
  updates with source-event references).
- `RivalryGraphSlice` projection (per club: top-N rivals snapshot for
  UI + read-model queries).
- Decay policy (deterministic per-season application).
- Threshold-tier classification rules.

Rivalry System does **not** own:

- Single-club state (Club Management owns club identity + state +
  fan-segment populations + atmosphere computation).
- Match results themselves (Match owns; Rivalry consumes
  `MatchResolved` for sporting sub-score).
- Transfer events themselves (Transfer owns; Rivalry consumes
  `TransferCompleted` for transfer-tension sub-score).
- Fan-incident classification (Fan Ecology owns incident events;
  Rivalry consumes for fan-incident sub-score).
- Pyro-incident trigger logic (Matchday-Event-Engine owns; consumes
  rivalry-score as one input).
- Sanction escalation (Regulations & Compliance owns sanction chain
  downstream).
- Atmosphere computation (Fan Ecology owns formula; consumes
  rivalry-score as one input).
- Watch-party auto-proposal logic (Watch Party owns; consumes
  rivalry-tier signal).
- Derby-themed media copy / persona framing (Notification + future
  Narrative / People own).
- Manager-archetype derby-specialist signal aggregation (Manager &
  Legacy owns; consumes derby-win-rate read model future-scope).
- AI-manager rivalry-driven behaviour (League / Club / Transfer AI
  consumers per `bounded-context-map.md` §7).

## Public contract direction

Draft commands:

- `RegisterRivalryPairCandidate` (lazy on first fixture between two
  clubs)
- `RecordIncidentSignal`
- `RecordTransferTensionSignal`
- `ApplyEndOfSeasonDecay`
- `ReclassifyTierBoundary` (admin / community-overlay override)
- `ImportRivalrySeedFromOverlay` (FMX-33 Community Overlay Pipeline
  surface)

Draft events:

- `RivalrySubScoreUpdated`
- `RivalryTierTransitioned` (None → Mild → Strong → High → Volatile
  with deterministic cause)
- `RivalrySnapshotTakenForFixture`
- `RivalryDecayApplied`
- `RivalryOverrideValidated`
- `RivalryOverrideRejected`

Draft read models:

- `RivalryScore(clubA, clubB, date)` - composite score + tier
  classification + sub-score breakdown.
- `IsDerbyFixture(matchId)` - boolean + tier label + supporting
  reasons (regional / historical / sporting / fan-incident /
  transfer-tension).
- `TopRivalsForClub(clubId, limit)` - ranked rival list for UI.
- `RivalryIncidentTimeline(rivalryEdgeId)` - Expert-tier UI consumer.
- `RivalryGraphSnapshot(saveDate)` - full graph for analyst / Manager
  & Legacy retrospective consumption.
- `DerbyContext(matchId)` - composite read model for Tactics + Match
  + Narrative consumption (tier + supporting reasons + historical
  highlights).

Draft consumed facts:

- `MatchResolved` from Match - sporting sub-score updates per
  rivalry-system.md sporting scoring rules.
- `TransferCompleted` from Transfer - transfer-tension sub-score
  updates.
- `FanIncidentLogged` from Fan Ecology - fan-incident sub-score
  updates.
- `ClubFoundedInLocation`, `ClubRelocatedToLocation` (rare) from
  Club Management - regional sub-score base.
- `SeasonAdvanced` from League Orchestration - triggers deterministic
  per-season decay batch.

## Determinism and storage rules

- Rivalry owns per-save tables only (`save_<uuidv7hex>` schema per
  ADR-0027). No platform-scope cross-save rivalry state.
- New save creation may receive a legacy-configured rivalry seed
  (historical rivalries pre-populated from era profile, or community-
  overlay-pack-provided seeds via ADR-0016) as explicit generation
  parameter when ADR-0051 Manager & Legacy supplies one (post-MVP);
  the seed is copied into the save snapshot at creation and never
  re-read during a running save.
- Cross-context inputs arrive through public events / queries only.
  Rivalry does not join across context tables.
- Sub-score updates fire `RivalrySubScoreUpdated` through ADR-0028
  transactional outbox; consumers subscribe via their existing read
  patterns.
- Per-season decay is a deterministic batch triggered by
  `SeasonAdvanced` from League Orchestration. Decay rates per sub-
  score (per `rivalry-system.md`): historical -1 per 10 seasons, no
  contact; sporting -2 per season; fan-incident -3 per season;
  transfer-tension -2 per season. Regional has no decay (stable
  geographic base).
- Threshold-tier FSM is **derived** from current `rivalry_score`
  (not stored independently); transition events emitted when score
  crosses tier boundary in either direction.
- Scoring computation follows Vernon canonical pattern: domain
  service `RivalryScoringService` owns the formula; process manager
  `RivalryEventAggregator` inside Rivalry context consumes upstream
  domain events + updates `RivalryEdge` aggregates; CQRS read models
  published via Open Host Service for query consumers.

## Rationale

Rivalry has three structural properties that DDD canonically resolves
as "own bounded context":

1. **Own ubiquitous language** - rivalry, derby, sub-score, intensity
   tier (None/Mild/Strong/High/Volatile), fan-incident memory,
   transfer tension, decay rate. These terms have specific meaning
   only in the scoring / relationship domain; consuming contexts
   speak different language (club, fixture, ledger entry, persona).

2. **Own lifecycle independent of any consumer** - per-season decay
   batch + threshold-tier transitions + sub-score updates on
   upstream events. None of these change in lockstep with any single
   consumer's transaction.

3. **Multiple consumers with their own rich models** - Fan Ecology
   (atmosphere formula), Matchday-Event-Engine (Pyro trigger),
   Watch Party (proposal logic), Manager & Legacy (archetype
   signal), Notification (copy generation), Match (derby
   classification marker), Tactics (opposition awareness future-
   scope), Regulations (sanction chain downstream of Pyro), People
   (journalist persona future-scope), Narrative (media framing
   future-scope). Each consumes rivalry differently and applies its
   own policy in its own aggregate.

Vernon's canonical scoring-context pattern (credit rating + customer
affinity + recommendation + supplier score) is the direct DDD
analogue. Real-world rivalry classification (UEFA + Premier League +
Bundesliga) confirms operational distinctness. Genre precedent (thin
but non-contradictory) shows no surveyed sim has documented an
explicit emergent scoring model - FMX leads the genre.

The marginal cost (one more context in the modular monolith, with
extraction as a deployment change per ADR-0019 §5) is small compared
with the coupling debt the alternatives accumulate. The lighter scope
than Tactics / Regulations is acknowledged but does not change the
recommendation: DDD literature explicitly supports Recommendation /
Analytics / Scoring contexts as routinely smaller than core contexts.

## Consequences

Positive:

- Clear owner for rivalry graph + sub-score formula + threshold FSM
  + decay policy.
- Contracts-first path: commands, events, read models, consumed
  facts all named at draft precision.
- Fan Ecology atmosphere consumer + Matchday-Event-Engine Pyro
  trigger consumer + Regulations sanction-chain downstream + Watch
  Party auto-propose + Manager & Legacy future archetype signal +
  Notification derby copy + Match derby classification + Tactics
  derby opposition awareness + future People/Narrative derby framing
  all get a defined source.
- Vernon canonical scoring-context pattern with Open Host Service +
  Published Language + CQRS read models is applied directly.
- Mirrors real-world risk-match classification (UEFA / Premier
  League / Bundesliga) - playtesters recognise the model.
- FMX leads the football-sim genre with an explicit emergent 5-sub-
  score rivalry model.

Negative:

- Adds one bounded context to the map (16th if accepted before
  ADR-0052 / ADR-0054; 17th / 18th depending on acceptance order).
- Scope is lighter than Tactics / Regulations - the smallest carve
  in the FMX-24 wave. Vernon literature supports smaller scoring
  contexts but reasonable architects might prefer Option A or B.
- Requires event consumption from Match, Transfer, Fan Ecology and
  League Orchestration. Coordination grows but follows the
  established pattern from FMX-25/26/28/30.
- Manager-archetype derby-specialist signal aggregation +
  derby-specific opposition templates + derby media framing all stay
  future-scope.

## Supersedes

None

## Related Docs

- [[../../60-Research/rivalry-system-bounded-context-2026-05-28]] -
  FMX-34 ratification synthesis (this ADR's decision basis).
- [[../../60-Research/raw-perplexity/raw-rivalry-system-2026-05-28]]
  - FMX-34 raw research (genre / DDD / real-world surveys).
- [[../../50-Game-Design/rivalry-system]] - GDDR; 5-sub-score
  emergent model + threshold tiers + decay rules.
- [[../../20-Features/feature-rivalry-system]] - feature scope; post-
  MVP depth.
- [[../../50-Game-Design/fan-ecology]] §3, §4, §6 - atmosphere
  consumer + per-capita revenue derby_factor + rivalry-driven fan
  loading.
- [[../../50-Game-Design/matchday-event-engine]] - Pyro-incident
  trigger consumer (binding).
- [[../../60-Research/fan-culture-segmentation-research]] §5 - high-
  security classification inputs (real-world parallel).
- [[ADR-0019-modular-monolith-ddd]] - modular monolith ground rules.
- [[ADR-0027-postgres-data-model]] - per-save schema convention.
- [[ADR-0028-postgres-transactional-outbox]] - event delivery
  mechanism.
- [[ADR-0050-club-economy-accounting-ledger]] - Club Management
  ledger boundary; consumes derby_factor revenue facts via Fan
  Ecology.
- [[ADR-0051-manager-and-legacy-context]] - cross-save legacy seeds
  for rivalry pre-population; future-scope archetype signal
  consumer.
- [[ADR-0053-staff-operations-context]] - no direct rivalry
  interaction.
- [[ADR-0055-tactics-context]] - future-scope derby-specific
  opposition awareness consumer.
- [[ADR-0056-regulations-compliance-context]] - downstream sanction
  chain via matchday-event-engine Pyro events.
- [[ADR-0052-people-persona-and-skills-context]] - parallel draft;
  no direct boundary requirement (future-scope journalist persona
  consumer).
- [[ADR-0054-narrative-context-and-ai-narration-framework]] -
  parallel draft; no direct boundary requirement (future-scope derby
  media framing consumer).
- [[ADR-0016-community-dataset-overrides]] - cross-save rivalry-seed
  override surface (FMX-33 Community Overlay Pipeline territory).
