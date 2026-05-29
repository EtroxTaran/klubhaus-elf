---
title: ADR-0062 Audience & Atmosphere Context
status: accepted
tags: [adr, architecture, ddd, audience-and-atmosphere, fan-ecology, scoring-context, supporting-subdomain, fmx-32, accepted]
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
  - [[ADR-0052-people-persona-and-skills-context]]
  - [[ADR-0053-staff-operations-context]]
  - [[ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[ADR-0056-regulations-compliance-context]]
  - [[ADR-0057-rivalry-system-context]]
  - [[ADR-0058-club-economy-commercial-impact-boundary]]
  - [[ADR-0059-community-overlay-pipeline-context]]
  - [[ADR-0061-club-management-sub-aggregate-audit]]
  - [[../bounded-context-map]]
  - [[../../50-Game-Design/GD-0015-ip-clean-data]]
  - [[../../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
  - [[../../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]]
  - [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../../50-Game-Design/fan-ecology]]
  - [[../../50-Game-Design/matchday-event-engine]]
  - [[../../60-Research/club-management-sub-aggregate-audit-2026-05-28]]
  - [[../../60-Research/raw-perplexity/raw-club-management-sub-aggregate-audit-2026-05-28]]
  - [[../../60-Research/fan-demand-price-elasticity-2026-05-28]]
  - [[../../60-Research/season-ticket-lifecycle-and-accounting-2026-05-28]]
---

# ADR-0062: Audience & Atmosphere Context

## Status

accepted

## Date

- Proposed: 2026-05-28
- Accepted: 2026-05-28 by Nico

## Ratification note

Nico ratified Option C (own bounded context Audience & Atmosphere)
on 2026-05-28 as part of the FMX-32 audit ratification (ADR-0061
§Ratification note). Audience & Atmosphere becomes the **18th**
bounded context (Club Management → 17 contexts after Stadium
Operations carve-out, +1 for A&A). Combined with the
CommercialPortfolio carve-out (ADR-0061), the map grows to 19
contexts in this ratification event. Cross-save dependencies on
People (ADR-0052 draft) + Narrative (ADR-0054 draft) + Manager &
Legacy (ADR-0051 accepted) + Community Overlay Pipeline (ADR-0059
proposed) remain as documented; `NamedSupporterGroup` aggregate
stays opt-in via FMX-54-gated command until FMX-54 (Fan Ecology
persona privacy & creative-IP-safe-naming review) ratifies.

## Context

FMX-32 audits the four Club Management sub-aggregate candidates
(Stadium / Venue Operations, Audience & Atmosphere, CommercialPortfolio,
Ticketing & Commercial Settlement). The audit synthesis
[[../../60-Research/club-management-sub-aggregate-audit-2026-05-28]]
recommends per-candidate landings; Audience & Atmosphere (formerly
*Fan Ecology* per `bounded-context-map.md` §1 line 38 + `fan-ecology.md`
GDDR) is the strongest candidate for Option C (own bounded context)
with **six-of-six DDD split-criteria firing**.

Per the FMX-32 plan §2 ("Combined ADR + spin-off if any candidate
splits"), ADR-0061 records the audit-level decision; this spin-off
ADR-0062 carries the **standalone ratification frame** for Audience
& Atmosphere so Nico can ratify it independently of the other three
candidates if preferred. ADR-0061 and ADR-0062 can ratify
concurrently, or ADR-0062 alone (leaving Stadium + CommercialPortfolio
+ Ticketing & Settlement to ADR-0061's per-candidate decisions), or
ADR-0061 alone (rejecting Audience & Atmosphere Option C and falling
back to Option B inside Club Management).

The wave-2 economy work (FMX-41 Economy Impact Map + FMX-42 Fan
Demand & Price Elasticity + FMX-43 Season-Ticket Lifecycle &
Accounting) loaded substantial own-FSM, own-loop, own-published-
contract surface onto Fan Ecology:

- **FMX-42** made Fan Ecology own `FanDemandForecast` per-segment
  with segment-specific elasticity (Option C — Segment Elasticity +
  Latent Demand + Trust Guardrail) and persistent `ticketingTrustState`
  with three-season shock memory.
- **FMX-43** added the 8-state season-ticket campaign lifecycle that
  consumes per-segment renewal probability and per-segment cohort
  state.
- **FMX-41 + FMX-58** (commercial impact map) loaded `FanIncidentLogged`
  as a Rivalry sub-score input (consumed by ADR-0057) and `SegmentFit`
  as a sponsor-category risk input (consumed by CommercialPortfolio
  per draft ADR-0058).

The audit synthesis §F4.2 documents the six-of-six firing:

1. **Own ubiquitous language ✓ strong** — segment, loyalty,
   volatility, mood, atmosphere, engagement, utilisation probability,
   waitlist pressure, ticketing trust, propensity, fan politics,
   choreo, boycott, ouster-call, trust-shock memory, reference-price,
   price-sensitivity, latent demand, fixture attractiveness,
   atmosphere multiplier.
2. **Own FSM ✓** — segment mood state + per-segment cohort FSM
   (latent → active → mobilised → politicised → reconciled) + politics-
   event FSM (choreo / protest / boycott / ouster-call threshold-
   triggered).
3. **Own storage ✓** — per-segment state, atmosphere history, fan-
   incident log, ticketing-trust-state per segment, politics-event
   log, renewal probability per segment, named-group overlay.
4. **Multiple consumers ✓ strong** — seven consumers: Club Management
   (via CommercialPortfolio's `FanDemandForecast` consumption +
   board-pressure), Rivalry System (`FanIncidentLogged` per
   ADR-0057), Matchday-Event-Engine (atmosphere multiplier + security
   risk per `matchday-event-engine.md` §3-4), Notification (fan-
   politics events per ADR-0043), Manager & Legacy (archetype hook
   per GD-0019), CommercialPortfolio (segment-fit risk for sponsor-
   category alignment), Ticketing & Settlement (latent demand +
   trust state for pricing + renewal probability).
5. **Cross-cutting role ✓ strong** — segment mood is economic
   signal + regulatory signal (UEFA SLO + Premier League IFAB) +
   atmosphere signal + political signal (board pressure + ouster-
   call) + brand signal (sponsor-fit risk) + persona signal (named-
   group dialogue scenes via Narrative per ADR-0054). Six cross-
   cutting roles. No single existing context can host without
   language leak.
6. **Low co-change with neighbours ✓** — atmosphere weekly tick
   evolves independently of ledger postings; segment loyalty
   evolves independently of Club Management budget cycle; fan-
   politics triggers fire on threshold crossings independent of
   fixture schedule. Per the Vernon IDDD ch. 3 + 5 split signal
   ("different life cycles and process rhythms"), criterion 6
   fires.

Total: **6/6** — matches the FMX-29 / FMX-33 wave high; stronger
than FMX-26 / 28 / 30 / 34 wave five-of-six.

The audit synthesis §F3.2 documents **Vernon IDDD canonical scoring-
context + customer-loyalty + Customer-Supplier with ACL** as the
DDD authority pattern, with the following real-world analogues all
classifying as own BC:

- Net Promoter / customer-loyalty platforms (Salesforce Marketing
  Cloud, Braze, Iterable, Klaviyo, HubSpot CDP).
- Credit scoring services (Schufa, Experian, FICO Falcon).
- Streaming engagement scoring (Spotify, Netflix recommendation,
  YouTube watch-time).
- Retail customer-affinity (Amazon, Tesco Clubcard).
- Loyalty programs (airlines miles, hotel point systems —
  marketing/scoring layer, not the points-ledger layer).

Cross-genre precedent §F2.2 is unanimous: Crusader Kings III vassal
opinion, Civilization VI Loyalty, Cities: Skylines districts mood,
Total War Three Kingdoms public order — all promote segmented
audience / loyalty subsystems to **own bounded context with own UI
+ per-segment state + own update tick**.

Real-world football operations §F5.2 anchors a distinct regulatory
subdomain:

- **SLO (Supporter Liaison Officer)** — UEFA Club Licensing
  mandate since 2010, reinforced 2024-2025; DFB-DFL Sicherheitsfaktoren
  + SLO-Konzept; Premier League Independent Fan Advisory Boards
  mandated 2024-2025.
- **GDPR Art. 6** lawful basis for supporter-segment data; **Art.
  9** special-category data for implicit religious / political
  affiliation captured by ultras / anti-racism networks.
- **DSA Art. 16** notice-and-action obligations on UGC from
  supporter groups.

Cross-save dependencies:

- **Persona overlay** for named supporter-group representatives
  flows through People context (ADR-0052 draft) — the named-group
  rep is a Person with persona + skill profile; Audience & Atmosphere
  owns the *group* aggregate referencing the Person.
- **Narrative integration** for fan-incident storylets flows through
  Narrative context (ADR-0054) — generated storylets consume
  Audience & Atmosphere `SegmentMoodBoard` + `FanIncidentTimeline`
  as context cards.
- **Community overlay** for segment-name catalogs + atmosphere-
  multiplier tweaks + named-group archetype templates flows through
  Community Overlay Pipeline (ADR-0059 proposed) at save creation
  only; Audience & Atmosphere BC owns semantic validation per
  Vernon canonical pattern (same as Regulations + Rivalry + Youth
  Academy).
- **Legacy seeds** for named-group archetype templates + segment-
  population baselines flow through Manager & Legacy (ADR-0051)
  at save creation only.

The remaining concrete-detail items (named-group persona privacy
hardening, creative-IP-safe-naming generator pattern, GDPR Art. 6
consent flows for named-group representatives) are deferred to
follow-up ticket **FMX-54 Fan Ecology persona privacy & creative-
IP-safe-naming review** (already created 2026-05-28, sibling to
FMX-32 under parent FMX-24, `risk:legal` label).

## Options considered

This ADR re-presents the per-candidate Options from ADR-0061
Candidate 2 (Audience & Atmosphere) in standalone form so Nico can
ratify Audience & Atmosphere independently.

### Option A — Stay as sub-aggregate inside Club Management

Leave Fan Ecology as pure sub-aggregate of Club Management's "fans"
responsibility per `bounded-context-map.md` §1 line 38.

- **Coupling:** segment state + atmosphere loop + politics-event
  triggers all inside Club Management aggregates.
- **Test isolation:** weak — atmosphere weekly tick collides with
  Club ledger week-tick; segment-mood logic pollutes Club's
  ledger / FFP / board-pressure language.
- **DDD pattern:** Vernon scoring-context + customer-loyalty
  pattern argues strongly for own BC. Salesforce Marketing Cloud,
  Schufa, Spotify recommendation, Tesco Clubcard all separate
  bounded contexts / separate products. Staying as pure sub-aggregate
  fights this.
- **Cross-genre precedent:** CK3 + Civ VI + Cities + TW Three
  Kingdoms unanimous — all separate segmented audience / loyalty
  subsystems from parent context.
- **Real-world precedent:** SLO regulatory anchor + segment-
  specific GDPR + DSA Art. 16 form distinct regulatory subdomain
  that Club Management cannot cleanly host.
- **Trade-off:** weakest — fights DDD authority + cross-genre +
  regulatory anchor + 6/6 firing. Same anti-pattern as FMX-26
  ("Staff in Club Management") if forced.

### Option B — Hybrid named Aggregate inside Club Management

Promote to named Aggregate inside Club Management with published
contract surface (`FanDemandForecast`, `FanIncidentLogged`,
`AtmosphereSnapshot`, `TicketingTrustStateChanged`).

- **Coupling:** atmosphere weekly tick published as event stream.
- **Test isolation:** improved but still inside Club Management's
  modular surface; Vernon IDDD ch. 10 small-aggregate rule fires
  against the cohort + atmosphere + politics model size (six
  aggregates: `SupporterSegment`, `AtmosphereSnapshot`, `FanIncident`,
  `TicketingTrustLedger`, `NamedSupporterGroup`, plus politics-
  event sub-FSM — too large for a single named Aggregate).
- **DDD pattern:** transitional state, not stable architecture.
  Per Vernon (IDDD ch. 7): once you give the cohort + scoring
  model its own language and published surface and treat
  Club Management as a consumer, you have effectively defined a
  separate bounded context anyway.
- **Cross-genre precedent:** fights cross-genre unanimous
  (CK3 + Civ VI + Cities + TW separated).
- **Trade-off:** transitional — only useful if team / deployment
  constraints force colocation; in FMX no such constraint exists.
  The published contract surface (`FanDemandForecast` +
  `ticketingTrustState`) was already established by FMX-42; the
  conceptual boundary already exists. Option B leaves the
  multi-aggregate cohort model inside Club Management's modular
  surface where it doesn't belong.

### Option C — Own bounded context (Audience & Atmosphere)

Carve Audience & Atmosphere as own bounded context with own
`SupporterSegment` + `AtmosphereSnapshot` + `FanIncident` +
`TicketingTrustLedger` + `NamedSupporterGroup` aggregates.

- **Coupling:** clean — own per-save schema per ADR-0027;
  Customer-Supplier with Club Management (CommercialPortfolio
  ticketing + Club Management board-pressure) via ACL; Published
  Language to Rivalry + Matchday-Event-Engine + Notification +
  Manager & Legacy + CommercialPortfolio + Ticketing & Settlement.
- **Test isolation:** strongest — own per-save schema + deterministic
  event fixtures drive tests.
- **Service extractability:** matches ADR-0019 §5 — extraction is
  a deployment change.
- **Data sovereignty:** explicit. `save_<uuidv7hex>` schema for
  per-segment state + atmosphere snapshots + fan-incident log +
  ticketing-trust ledger + named-group overlay.
- **DDD pattern:** Vernon scoring-context canonical (IDDD ch. 3 +
  7); Evans Blue Book ch. 14 (different language → different BC);
  Fowler bliki credit-scoring + recommendation as separate contexts;
  MS Learn supporting-subdomain pattern.
- **Real-world analogues:** Salesforce Marketing Cloud, Braze,
  Iterable, Klaviyo, HubSpot CDP, Schufa, Experian, FICO Falcon,
  Spotify recommendation engine, Netflix recommendation, Tesco
  Clubcard, airlines miles / hotel points marketing layer — all
  separate scoring / loyalty BCs from parent CRM / ledger / catalog.
- **Cross-genre analogues:** CK3 vassal opinion, Civ VI Loyalty,
  Cities Skylines districts mood, TW Three Kingdoms public order —
  all separated segmented audience / loyalty as own context.
- **Regulatory anchor:** UEFA SLO + DFB-DFL SLO-Konzept + Premier
  League IFAB + GDPR Art. 6 segment data + GDPR Art. 9 special-
  category data + DSA Art. 16 UGC obligations — distinct regulatory
  subdomain.
- **Trade-off:** adds one bounded context to the map. Marginal cost
  justified by six-of-six firing + Vernon scoring-context canonical
  + cross-genre unanimous + real-world regulatory anchor + the
  wave-2 surface already published as a contract.

### Option D — Sub-context inside CommercialPortfolio

Nest Audience & Atmosphere as a sub-context inside CommercialPortfolio
(if CommercialPortfolio = Option C per ADR-0061).

- **Coupling:** would couple audience-scoring lifecycle to
  commercial-contract lifecycle, which have **different rhythms**
  (atmosphere weekly tick vs contract-term boundary).
- **DDD pattern:** Vernon: sub-context-inside-context is an
  anti-pattern — bounded contexts are flat, not nested.
- **Cross-genre:** no precedent. CK3 / Civ VI / Cities / TW all
  separate loyalty / opinion from commerce.
- **Real-world:** SLO function is separate from Commercial / CCO
  reporting line; segment data privacy is a separate GDPR concern
  from sponsor-partner data.
- **Trade-off:** weakest — Vernon anti-pattern + fights cross-genre
  + fights real-world org separation.

## Recommendation

**Option C (own bounded context Audience & Atmosphere).** Three
converging arguments:

1. **F4 DDD criteria fire strongest in wave (six-of-six).** Matches
   the FMX-29 / 33 wave high; stronger than FMX-26 / 28 / 30 / 34
   five-of-six. Vernon IDDD scoring-context canonical pattern + Open
   Host Service + Published Language + ACL fits Audience &
   Atmosphere's seven-consumer surface (Club Management,
   CommercialPortfolio, Rivalry, Matchday-Event-Engine, Notification,
   Manager & Legacy, Ticketing & Settlement). The weekly atmosphere
   loop is conceptually independent of Club Management's economy-week
   tick per F3.2's resolution of the cadence-independence question.

2. **F2 cross-genre precedent + F3 DDD industry analogues
   unanimous.** Crusader Kings III vassal opinion + Civilization VI
   Loyalty + Cities Skylines districts mood + Total War Three
   Kingdoms public order all separate segmented audience / loyalty.
   Salesforce Marketing Cloud + Schufa + Spotify + Tesco Clubcard +
   airlines / hotels marketing-scoring layers all separate scoring
   BC from parent CRM / ledger. Vernon IDDD ch. 3 supporting-
   subdomain classification + IDDD ch. 7 Customer-Supplier with ACL
   directly apply.

3. **F5 real-world regulatory anchor.** UEFA SLO mandate + DFB-DFL
   SLO-Konzept + Premier League IFAB + GDPR Art. 6 / 9 + DSA Art.
   16 form a distinct regulatory subdomain that Club Management
   cannot cleanly host without language leak. The persona-overlay
   surface (named supporter-group representatives appearing in
   controlled dialogue scenes via People + Narrative) makes the
   regulatory + privacy boundary even sharper.

### Named risks

- **Map growth.** Adds the 17th bounded context (or 18th-20th
  depending on landing order with ADR-0059 / ADR-0060 / ADR-0061
  CommercialPortfolio). Modular monolith stays one process per
  ADR-0019. Mitigation: ADR-0019 §5 keeps extraction a deployment
  change, not a refactor.
- **Coordination with seven consumers.** Mitigation: explicit
  Customer-Supplier contracts via published events; Snapshot
  pattern on `FanDemandForecast` → CommercialPortfolio keeps
  coupling loose; ACL on every customer side.
- **Persona overlay scope.** `NamedSupporterGroup` aggregate
  references People (ADR-0052 draft) for the named-group
  representative as a Person. Mitigation: FMX-54 follow-up ticket
  (Fan Ecology persona privacy & creative-IP-safe-naming review)
  hardens GDPR Art. 6 / 9 consent flows + DSA Art. 16 UGC
  obligations + community-overlay persona-data handling. Named-
  group overlay is **opt-in via FMX-54-gated command**, not
  default-on at MVP.
- **Cadence-independence resolution.** Vernon does not explicitly
  name "weekly loop independence" as a split criterion. The
  dossier resolves this via IDDD ch. 3 + 5 ("different life cycles
  and process rhythms"). Mitigation: research-grounded outcome
  rather than assumption; FMX-32 §F3.2 documents the resolution.
- **Cross-save legacy + community-overlay seeds.** Per ADR-0051 +
  ADR-0059 (proposed). Audience & Atmosphere BC owns semantic
  validation; schema validation flows through Community Overlay
  Pipeline if ADR-0059 ratifies. Mitigation: same Vernon pattern
  as Regulations + Rivalry + Youth Academy.
- **Creative IP-safe naming.** No real supporter-group names
  (Ultras Frankfurt, Curva Sud, Yellow Wall, Spion Kop) embedded
  as samples; all sample names follow Nico's vault-wide evocative-
  but-clearly-not-real rule. Mitigation: FMX-54 follow-up handles
  the creative-naming generator pattern.

Status stays `proposed` / `binding: false` until Nico ratifies.

## Decision

Propose a dedicated **Audience & Atmosphere** bounded context
(renamed from *Fan Ecology* per FMX-32 plan §8 locked naming
direction).

If ratified, Audience & Atmosphere owns:

- **`SupporterSegment` aggregate** (per-club, per-segment): segment
  population, loyalty floor, mood, volatility, attendance
  probability, season-ticket renewal probability, price sensitivity
  per segment, propensity (catering / merch / hospitality / sponsor-
  fit), reference-price memory. Six default segments per
  `fan-ecology.md` §1 (Ultras / Hardcore, Core, Family, Fair-
  weather, Corporate, Casual); community overlay (ADR-0059) can
  customise segment names + thresholds.
- **`AtmosphereSnapshot` aggregate** (per-club, per-fixture):
  atmosphere multiplier derived from rivalry × table × utilisation
  × form × weather × security × choreo participation. Consumed by
  Matchday-Event-Engine for atmosphere + security input; by Match
  for home-advantage multiplier; by Notification for storylet copy.
- **`FanIncident` aggregate** (per-club, per-incident): threshold-
  triggered FSM for choreo / protest banner / ticket boycott /
  ouster-call / scarf-down. Each incident has lifecycle (triggered
  → active → decay → resolved). Consumed by Rivalry System as fan-
  incident sub-score input per ADR-0057.
- **`TicketingTrustLedger` aggregate** (per-club): persistent trust
  state per segment with three-season shock memory per `fan-demand-
  price-elasticity-2026-05-28.md` §Trust state. Trust shocks fire
  on aggressive-pricing detection, sponsor-misalignment events,
  fan-engagement scandals; decay rate per segment varies.
- **`NamedSupporterGroup` aggregate** (per-club, per-group) — **FMX-
  54-gated**: opt-in overlay for named ultras / curva representatives
  with persona link to People (ADR-0052 draft) for controlled
  dialogue scenes via Narrative (ADR-0054). Default off at MVP;
  enabled per save creation via community overlay (ADR-0059) or
  manual scenario configuration.
- **Process Manager / Saga** for weekly atmosphere loop + season-
  ticket campaign cohort feedback + politics-event escalation +
  ticketing-trust-shock evaluation. Orchestrates atmosphere
  weekly tick → segment cohort update → campaign-cohort feedback
  → fan-politics trigger evaluation → trust-shock decay.

Audience & Atmosphere does **not** own:

- Ticketing policy + price grid + season-ticket campaign FSM
  (owned by CommercialPortfolio per ADR-0061; Audience & Atmosphere
  supplies `FanDemandForecast` + `TicketingTrustState` for pricing
  + renewal-probability inputs).
- Fan engagement digital platform / app / CRM segmentation
  (future-scope; would belong to a Digital / CRM bounded context
  if scope expands).
- Stadium capacity / hospitality inventory / accessibility allocation
  (owned by Club Management's StadiumOperations Aggregate per
  ADR-0061 Option B, or Stadium BC if Option C).
- Rivalry-edge graph + rivalry sub-score formula (owned by Rivalry
  System per ADR-0057; Audience & Atmosphere emits
  `FanIncidentLogged` consumed by Rivalry as fan-incident sub-score).
- Tactical lineup snapshot (owned by Tactics per ADR-0055).
- Match per-fixture simulation (owned by Match).
- People / Person actor registry (owned by People per ADR-0052
  draft; Audience & Atmosphere references Person IDs in
  `NamedSupporterGroup` aggregate but does not own Person identity).
- Narrative storylet generation (owned by Narrative per ADR-0054;
  Audience & Atmosphere supplies `SegmentMoodBoard` +
  `FanIncidentTimeline` as context cards consumed by Narrative).
- Cross-save manager identity / archetype taxonomy / prestige
  ladder (owned by Manager & Legacy per ADR-0051; Audience &
  Atmosphere emits `FanPipelineQualityUpdated` consumed by Manager
  & Legacy archetype hook).
- Community overlay pack validation + IP-safety gate (owned by
  Community Overlay Pipeline per ADR-0059 proposed; Audience &
  Atmosphere owns semantic validation for segment-name overlays +
  threshold tweaks + named-group archetype templates).
- Finance ledger entries (owned by Club Management per ADR-0050;
  Audience & Atmosphere does not write money facts).
- Regulatory rule catalog (owned by Regulations & Compliance per
  ADR-0056; Audience & Atmosphere consumes `EffectiveRuleSet` for
  UEFA SLO + GDPR Art. 6 / 9 + DSA Art. 16 obligations).

## Public contract direction

Draft commands:

- `RecordFanIncident` — emit a fan-incident from external trigger
  (ticketing shock, sporting result, sponsor-misalignment event).
- `RegisterChoreoCampaign` — register fan-organised choreo planning.
- `ConfirmBoycottThreshold` — confirm boycott threshold crossed for
  one or more segments.
- `EscalateOusterCall` — escalate ouster-call to board-pressure
  signal consumed by Club Management.
- `ResetTicketingTrustShock` — clear trust-shock memory after
  reconciliation event.
- `OnboardNamedSupporterGroup` — FMX-54-gated opt-in for named-
  group overlay.
- `UpdateSegmentDemand` — internal command for weekly atmosphere
  tick.
- `ApplyAtmosphereSnapshot` — internal command for per-fixture
  atmosphere computation.

Draft events:

- `FanDemandForecasted` *(consumed by CommercialPortfolio for
  season-ticket campaign + per-fixture pricing per ADR-0061)*
- `FanIncidentLogged` *(consumed by Rivalry System as fan-incident
  sub-score per ADR-0057; consumed by Notification for storylet
  copy per ADR-0043)*
- `AtmosphereSnapshotPublished` *(consumed by Matchday-Event-Engine
  for atmosphere + security; consumed by Match for home-advantage
  multiplier; consumed by Notification for matchday narrative
  copy)*
- `SegmentRenewalProbabilityUpdated` *(consumed by CommercialPortfolio
  for season-ticket campaign waitlist allocation per FMX-43)*
- `TicketingTrustStateChanged` *(consumed by CommercialPortfolio
  for pricing decisions per ADR-0058 + FMX-42)*
- `OusterCallEscalated` *(consumed by Club Management for board-
  pressure signal; consumed by Manager & Legacy for archetype
  hook; consumed by Notification for narrative copy)*
- `BoycottThresholdConfirmed`
- `ChoreoCampaignRegistered`
- `FanPipelineQualityUpdated` *(consumed by Manager & Legacy
  archetype hook aggregation per GD-0019)*
- `NamedSupporterGroupOnboarded` (FMX-54-gated)
- `SegmentMoodUpdated` (internal projection event)

Draft read models:

- `FanDemandForecast` — per-segment latent demand + reference-
  price + ticketing-trust state + propensity (catering / merch /
  hospitality / sponsor-fit). Consumed by CommercialPortfolio.
- `AtmosphereSnapshot` — per-fixture atmosphere multiplier.
  Consumed by Matchday-Event-Engine + Match.
- `SegmentMoodBoard` — per-segment mood + loyalty + volatility +
  attendance probability dashboard. Consumed by Notification +
  Narrative.
- `TicketingTrustStateSnapshot` — per-segment trust state with
  shock history. Consumed by CommercialPortfolio.
- `FanIncidentTimeline` — per-club fan-incident log. Consumed by
  Notification + Narrative + Audit (per ADR-0053 audit-trail
  pattern).
- `NamedSupporterGroupRoster` — FMX-54-gated.
- `OusterCallEscalationBoard` — current ouster-call escalation
  tier per club. Consumed by Club Management + Manager & Legacy.
- `FanPipelineQualitySnapshot` — pipeline-quality signal aggregated
  for Manager & Legacy.

Draft consumed facts:

- `RivalryTierTransitioned` from Rivalry System per ADR-0057
  *(consumed for atmosphere multiplier + fan-incident probability
  uplift)*.
- `MatchResolved` from Match *(consumed for segment mood update
  + attendance feedback)*.
- `SeasonAdvanced` from League Orchestration *(consumed for
  weekly atmosphere tick scheduling + segment population evolution)*.
- `StadiumCapacitySnapshot` from Club Management's StadiumOperations
  Aggregate (or Stadium BC if ADR-0061 lands Option C for Stadium)
  *(consumed for utilisation computation)*.
- `SeasonTicketCampaignClosed` from CommercialPortfolio per
  ADR-0061 *(consumed for renewal-cohort feedback)*.
- `CommercialContractActivated` / `CommercialBreachOpened` from
  CommercialPortfolio *(consumed for sponsor-misalignment
  detection + trust-shock evaluation)*.
- `EffectiveRuleSet` from Regulations & Compliance per ADR-0056
  *(consumed for UEFA SLO + GDPR Art. 6 / 9 + DSA Art. 16
  obligations)*.
- `SaveSnapshotInitialised` from Save creation per ADR-0027 +
  ADR-0051 *(cross-save legacy seeds + community-overlay segment
  customisation at save creation only)*.
- `SegmentNameOverridePack` / `AtmosphereMultiplierOverridePack` /
  `NamedSupporterGroupArchetypePack` from Community Overlay
  Pipeline per ADR-0059 *(pack overrides at save creation only;
  Audience & Atmosphere owns semantic validation; only relevant
  if ADR-0059 ratifies)*.

## Determinism and storage rules

- Audience & Atmosphere owns per-save tables only
  (`save_<uuidv7hex>` schema per ADR-0027). No platform-scope
  cross-save state.
- New save creation may receive legacy-configured fan-base seed
  (segment-population baselines, named-group archetype templates,
  default ticketing-trust posture) as explicit generation
  parameter when ADR-0051 Manager & Legacy supplies one (post-MVP);
  the seed is copied into the save snapshot at creation and never
  re-read during a running save.
- Community-overlay pack data (segment names, atmosphere-multiplier
  tweaks, named-group archetype templates) is copied into the save
  snapshot at creation per ADR-0059 (proposed); Audience &
  Atmosphere BC owns schema + semantic validation per Vernon
  canonical pattern (same as Regulations + Rivalry + Youth
  Academy).
- Cross-context inputs arrive through public events / queries
  only. Audience & Atmosphere does not join across context tables.
- Weekly atmosphere tick uses
  `AtmosphereRng(saveId, clubId, week)` sub-label of `WorldRng`
  per ADR-0018 §3. Politics-event triggers use
  `PoliticsRng(saveId, clubId, week)`. Trust-shock evaluation uses
  `TrustRng(saveId, clubId, week)`. No cross-RNG draws. No
  `Math.random` or `Date.now` in simulation paths.
- All state transitions use deterministic clocks (per ADR-0027 +
  ADR-0051); no `Date.now`.
- Domain events emitted through ADR-0028 transactional outbox;
  Club Management, CommercialPortfolio, Rivalry, Matchday-Event-
  Engine, Notification, Manager & Legacy, Match consume via ACL.
- **GDPR / DSGVO posture:** segment-level aggregate state only;
  no individual fan records inside `SupporterSegment`. Named-group
  representative data inside `NamedSupporterGroup` flows through
  People (ADR-0052) under Person identity governance + FMX-54
  hardening.
- **DSA Art. 16 posture:** fan-incident log queryable for notice-
  and-action workflows; community-overlay imports per ADR-0059
  validated by Audience & Atmosphere BC.
- **UEFA SLO + DFB-DFL SLO-Konzept posture:** `SLOLiaisonContact`
  read model exposes per-club Supporter Liaison Officer identity
  (Person reference per ADR-0052) for regulatory compliance
  consumed by Regulations & Compliance.

## Rationale

Audience & Atmosphere is a first-class **supporting subdomain** in
Vernon's IDDD ch. 3 classification: complex policy-heavy model,
own ubiquitous language, own life cycle and process rhythm, own
multi-input scoring formula, own multi-consumer published contract
surface, own regulatory subdomain. The wave-2 economy work (FMX-42
+ FMX-43) already established the published contract surface
(`FanDemandForecast` + `ticketingTrustState`) — the conceptual
boundary already exists. Option C ratifies what is already true
in the design.

Hiding it inside Club Management (Option A) buries the cohort +
atmosphere + politics model in Club's ledger / FFP / board-pressure
language and forces six cross-cutting consumers to query Club for
non-Club concerns. Same anti-pattern as FMX-26 (Staff in Club
Management) or FMX-33 (Community Overlay in Offline Sync). Promoting
to named Aggregate inside Club Management (Option B) is a
transitional state, not a stable architecture — Vernon IDDD ch. 7
makes clear that once a sub-aggregate has its own language and
published surface and treats the parent as consumer, you have
effectively defined a separate bounded context anyway. Nesting
inside CommercialPortfolio (Option D) is a Vernon anti-pattern
(bounded contexts are flat, not nested) and fights real-world org
separation (SLO function is separate from Commercial / CCO).

DDD authorities (Evans Blue Book ch. 14 + Vernon IDDD ch. 3 + 7 +
10 + Fowler bliki credit-scoring + recommendation + Context Mapper
+ MS Learn) and real-world enterprise analogues (Salesforce
Marketing Cloud + Schufa + Spotify + Tesco Clubcard) and cross-
genre precedent (CK3 + Civ VI + Cities + TW) and real-world football
regulatory framework (UEFA SLO + DFB-DFL + Premier League IFAB +
GDPR + DSA) all converge: **when an audience-scoring subdomain has
its own ubiquitous language, weekly scoring loop, storage, multiple
consumers, cross-cutting role and regulatory anchor, it deserves
its own bounded context.** The marginal cost (one extra context in
the modular monolith, extraction = deployment change per ADR-0019
§5) is small compared with the coupling debt of leaving Audience &
Atmosphere as sub-aggregate after the wave-2 surface load.

## Consequences

Positive:

- Clear owner for cohort-mood loop + multi-input scoring formula +
  politics-event triggers + persona overlay without polluting
  Club Management's ledger / FFP / board-pressure language.
- Contracts-first path: commands, events, read models, consumed
  facts all named at draft precision.
- Snapshot pattern on `FanDemandForecast` keeps CommercialPortfolio
  loosely coupled (canonical Reference + Snapshot pattern from
  FMX-28 Tactics).
- Published Language pattern on `FanIncidentLogged` keeps Rivalry
  loosely coupled (canonical scoring-context pattern from FMX-34).
- SLO + GDPR + DSA regulatory anchor has named home; Regulations &
  Compliance consumes via ACL per ADR-0056 Tax-catalog pattern.
- Mirrors real-world Supporter Liaison Officer + Independent Fan
  Advisory Board organisational structure — playtesters recognise
  the model.
- Named-group persona overlay (FMX-54-gated, opt-in) gives a clear
  contract surface for community-overlay segment customisation +
  controlled dialogue scenes via Narrative.
- Six-of-six DDD criteria firing means the wave-2 surface (FMX-42
  segment elasticity + FMX-43 season-ticket cohort feedback) lands
  in the architecturally correct owner from day one.
- Audit can revisit Stadium / CommercialPortfolio Option C
  recommendations from ADR-0061 independently of Audience &
  Atmosphere — the ADR-0062 spin-off decouples the four-candidate
  ratification into separable decisions.

Negative:

- Adds one bounded context to the map (17th if FMX-32 lands before
  ADR-0059 + ADR-0060 + ADR-0061 CommercialPortfolio; 18th-20th
  depending on landing order).
- Requires event consumption across CommercialPortfolio + Club
  Management + Rivalry + Matchday-Event-Engine + Notification +
  Manager & Legacy + Match + Ticketing & Settlement. Coordination
  grows.
- Named-group persona overlay scope tied to FMX-54 outcome; until
  FMX-54 ratifies, `NamedSupporterGroup` aggregate stays opt-in
  via FMX-54-gated command and `OnboardNamedSupporterGroup` /
  `NamedSupporterGroupOnboarded` are stubbed (no persona link to
  People).
- Cross-save legacy + community-overlay seeds dependency chain
  (ADR-0051 + ADR-0059 + ADR-0052) means Audience & Atmosphere
  cannot fully express until those upstream ADRs ratify.
- Cadence-independence resolution is research-grounded (Vernon
  IDDD ch. 3 + 5 "different life cycles and process rhythms")
  rather than Vernon-named — a future Vernon edition naming this
  criterion would simply confirm the resolution.

## Map patch proposal

Order-tolerant proposal that applies when this ADR is accepted.
Sequencing: if ADR-0061 (CommercialPortfolio + Stadium B + Ticketing
& Settlement D) is ratified first, Audience & Atmosphere is the
18th-20th bounded context; if ADR-0062 lands first, Audience &
Atmosphere is the 17th. Both apply-PRs are independent; the
apply-PR for whichever lands second renumbers the prose accordingly.

### §1 table — new row

````diff
 | **Rivalry System** | RivalryEdge graph (club pair × sub-score history × threshold-tier FSM)... | RivalryScore / IsDerbyFixture... |
+| **Audience & Atmosphere** | `SupporterSegment` Aggregate (per-segment loyalty + mood + volatility + attendance probability + season-ticket renewal probability + price sensitivity + propensity), `AtmosphereSnapshot` Aggregate (per-fixture atmosphere multiplier derived from rivalry × table × utilisation × form × weather × security × choreo participation), `FanIncident` Aggregate (choreo + protest banner + ticket boycott + ouster-call threshold-triggered FSM), `TicketingTrustLedger` Aggregate (persistent trust state with 3-season shock memory), `NamedSupporterGroup` Aggregate (FMX-54-gated named-group overlay with persona link to People context per ADR-0052) | `FanDemandForecast` / `AtmosphereSnapshot` / `SegmentMoodBoard` / `TicketingTrustStateSnapshot` / `FanIncidentTimeline` / `NamedSupporterGroupRoster` / `OusterCallEscalationBoard` / `FanPipelineQualitySnapshot` queries; `FanDemandForecasted` / `FanIncidentLogged` / `AtmosphereSnapshotPublished` / `SegmentRenewalProbabilityUpdated` / `TicketingTrustStateChanged` / `OusterCallEscalated` / `BoycottThresholdConfirmed` / `ChoreoCampaignRegistered` / `FanPipelineQualityUpdated` / `NamedSupporterGroupOnboarded` / `SegmentMoodUpdated` events |
 | **Offline Sync** | MVP: cache/draft status... | Draft/cache status now; sync status later |
````

### §1 prose — new paragraph (insert above Offline Sync paragraph)

````diff
+Audience & Atmosphere was proposed 2026-05-28 via ADR-0062
+(spin-off of ADR-0061 FMX-32 audit). It owns the per-segment
+cohort model (Ultras / Hardcore + Core + Family + Fair-weather +
+Corporate + Casual per `fan-ecology.md` §1), the weekly atmosphere
+engine, the persistent ticketing-trust state with three-season
+shock memory, and the politics-event triggers (choreo / protest /
+boycott / ouster-call). CommercialPortfolio consumes
+`FanDemandForecast` as a Snapshot at season-ticket campaign
+opening + per-fixture pricing decision. Rivalry System consumes
+`FanIncidentLogged` for the fan-incident sub-score per ADR-0057.
+Matchday-Event-Engine consumes `AtmosphereSnapshot` for atmosphere
+multiplier + security risk input. Manager & Legacy consumes
+`FanPipelineQualityUpdated` for archetype hook aggregation per
+GD-0019. Notification renders `OusterCallEscalated` per ADR-0043.
+Cross-save legacy fan-base seeds (named-group archetype templates,
+segment-population baselines, default ticketing-trust posture)
+flow through ADR-0051 Manager & Legacy at save creation only.
+Cross-save community pack overrides (segment names, atmosphere-
+multiplier tweaks, named-group archetype templates) flow through
+ADR-0059 Community Overlay Pipeline (proposed) at save creation
+only; Audience & Atmosphere BC owns semantic validation per
+Vernon (same pattern as Regulations + Rivalry + Youth Academy).
+`NamedSupporterGroup` Aggregate is FMX-54-gated (Fan Ecology
+persona privacy & creative-IP-safe-naming review, sibling FMX-54
+ticket under parent FMX-24, `risk:legal` label); default off at
+MVP. UEFA SLO + DFB-DFL SLO-Konzept + Premier League Independent
+Fan Advisory Board posture exposed via `SLOLiaisonContact` read
+model consumed by Regulations & Compliance. `risk:legal` hardline
+applies per GD-0015 IP-clean data + ADR-0007 naming schema (no
+real club, supporter-group, fan-incident or person names embedded
+as samples).
````

### §2 high-level Mermaid — new node + edges

````diff
     Rival["Rivalry System"]
+    AAtmo["Audience & Atmosphere"]
     Offline["Offline Sync"]
     Audit["Audit & Security"]
````

````diff
     Rival --> Reg
+    Match --> AAtmo
+    Rival --> AAtmo
+    League --> AAtmo
+    Club --> AAtmo
+    AAtmo --> Club
+    AAtmo --> Rival
+    AAtmo --> Match
+    AAtmo --> Notif
+    AAtmo --> ML
     Training --> Squad
````

(Edges to CommercialPortfolio handled in ADR-0061 §2 Mermaid;
ADR-0062 only introduces AAtmo node + edges to / from contexts
already in the map; CommercialPortfolio edges become valid only
when ADR-0061 CommercialPortfolio also lands.)

### §4 source mapping — new folder

````diff
   rivalry/
   youth-academy/
+  audience-and-atmosphere/
   sync/
   audit/
````

### §5 prose — extraction order (no change required)

Audience & Atmosphere joins the "likely co-located unless real
scaling signal forces a split" group per ADR-0019 §5.

## Supersedes

None — ADR-0062 introduces a new bounded context. The previously
draft GDDR `fan-ecology.md` (`binding: false`) is renamed to
`audience-and-atmosphere.md` if ratified, with the old filename
retained as a redirect or supersession banner per
[[../../90-Meta/vault-governance]] § Supersede discipline.

## Related Docs

- [[ADR-0061-club-management-sub-aggregate-audit]] — parent audit
  ADR (this ADR is its spin-off).
- [[../../60-Research/club-management-sub-aggregate-audit-2026-05-28]] —
  FMX-32 ownership synthesis (this ADR's decision basis).
- [[../../60-Research/raw-perplexity/raw-club-management-sub-aggregate-audit-2026-05-28]] —
  FMX-32 raw research (Q2.1 / Q2.2 / Q2.3 directly support
  Audience & Atmosphere Option C).
- [[../../60-Research/fan-demand-price-elasticity-2026-05-28]] —
  FMX-42 Fan Demand & Price Elasticity (established `FanDemandForecast`
  + `ticketingTrustState` published contract).
- [[../../60-Research/season-ticket-lifecycle-and-accounting-2026-05-28]] —
  FMX-43 Season-Ticket Lifecycle & Accounting (established
  per-segment renewal-cohort feedback).
- [[../../50-Game-Design/fan-ecology]] — Fan Ecology GDDR (will be
  renamed to `audience-and-atmosphere.md` on ratification).
- [[../../50-Game-Design/GD-0015-ip-clean-data]] — IP-clean
  hardline.
- [[../../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]] —
  named-group persona overlay consumed by Narrative.
- [[../../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]] —
  archetype hook consumed via `FanPipelineQualityUpdated`.
- [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]] —
  commercial impact via `FanDemandForecast`.
- [[../../50-Game-Design/matchday-event-engine]] — atmosphere
  multiplier + security risk input consumer.
- [[ADR-0018-systemic-events-and-player-lifecycle]] — WorldEventDirector
  + RNG sub-label discipline (`AtmosphereRng` / `PoliticsRng` /
  `TrustRng`).
- [[ADR-0019-modular-monolith-ddd]] — modular monolith ground
  rules.
- [[ADR-0027-postgres-data-model]] — per-save schema convention.
- [[ADR-0028-postgres-transactional-outbox]] — event delivery.
- [[ADR-0050-club-economy-accounting-ledger]] — Club Management
  ledger (no direct writes from A&A).
- [[ADR-0051-manager-and-legacy-context]] — cross-save legacy
  seeds.
- [[ADR-0052-people-persona-and-skills-context]] — named-group
  representative as Person.
- [[ADR-0053-staff-operations-context]] — SLO as staff role.
- [[ADR-0054-narrative-context-and-ai-narration-framework]] —
  narrative storylet consumer of `SegmentMoodBoard` +
  `FanIncidentTimeline`.
- [[ADR-0056-regulations-compliance-context]] — Regulations ACL
  consumer for UEFA SLO + GDPR + DSA obligations.
- [[ADR-0057-rivalry-system-context]] — scoring-context pattern
  precedent; Rivalry consumes `FanIncidentLogged` as fan-incident
  sub-score.
- [[ADR-0058-club-economy-commercial-impact-boundary]] — `FanDemandForecast`
  + `ticketingTrustState` published contract origin (FMX-42).
- [[ADR-0059-community-overlay-pipeline-context]] — pack-manifest
  validation upstream (proposed); Audience & Atmosphere BC owns
  semantic validation when ADR-0059 ratifies.
- [[../bounded-context-map]] — target of §Map patch proposal.
- [[../../30-Implementation/domain-research-workflow]] — six-phase
  workflow that produced this ADR.
- Linear FMX-32 (parent audit) + Linear FMX-54 (Fan Ecology
  persona privacy & creative-IP-safe-naming follow-up).
