---
title: ADR-0061 Club Management Sub-Aggregate Ownership Audit
status: accepted
tags: [adr, architecture, ddd, club-management, stadium, audience-and-atmosphere, fan-ecology, sponsorship, commercial-portfolio, ticketing, settlement, fmx-32, accepted]
context: club-management-economy
created: 2026-05-28
updated: 2026-06-08
type: adr
binding: true
supersedes:
superseded_by:
related:
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[ADR-0050-club-economy-accounting-ledger]]
  - [[ADR-0053-staff-operations-context]]
  - [[ADR-0056-regulations-compliance-context]]
  - [[ADR-0057-rivalry-system-context]]
  - [[ADR-0058-club-economy-commercial-impact-boundary]]
  - [[ADR-0060-youth-academy-context]]
  - [[ADR-0062-audience-and-atmosphere-context]]
  - [[../bounded-context-map]]
  - [[../../50-Game-Design/GD-0008-finance-economy]]
  - [[../../50-Game-Design/GD-0015-ip-clean-data]]
  - [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../../50-Game-Design/stadium-and-campus]]
  - [[../../50-Game-Design/fan-ecology]]
  - [[../../50-Game-Design/sponsorship-portfolio]]
  - [[../../50-Game-Design/matchday-event-engine]]
  - [[../../60-Research/club-management-sub-aggregate-audit-2026-05-28]]
  - [[../../60-Research/raw-perplexity/raw-club-management-sub-aggregate-audit-2026-05-28]]
  - [[../../60-Research/club-economy-impact-map-and-commercial-contracts-2026-05-28]]
  - [[../../60-Research/fan-demand-price-elasticity-2026-05-28]]
  - [[../../60-Research/season-ticket-lifecycle-and-accounting-2026-05-28]]
  - [[../../60-Research/commercial-contract-lifecycle-and-breach-model-2026-05-28]]
---

# ADR-0061: Club Management Sub-Aggregate Ownership Audit

## Status

accepted

## Date

- Proposed: 2026-05-28
- Accepted: 2026-05-28 by Nico

## Ratification note

Nico ratified the **best-practice landing** on 2026-05-28 after
reviewing the FMX-32 dossier (PR #104). Per-candidate decision:

- **Stadium / Venue Operations = Option C** (own bounded context
  `Stadium Operations`) — Nico chose Option C over the dossier's
  working Recommendation B. The departure rests on (a) real-world
  organisational evidence (Bayern Allianz Arena München Stadion
  GmbH + BVB Stadionmanagement GmbH + Tottenham venue business +
  Real Madrid Bernabéu / Legends & Sixth Street JV — separate
  legal entities with own P&L are the empirical baseline, not the
  edge case); (b) cross-genre / DDD analogues (Hotel PMS + CMMS +
  Theme Park + Anno) all promote venue ops to own context when
  ops becomes core, and the FMX stadium scope IS core per
  `stadium-and-campus.md` ("emotional and economic heart of the
  club"); (c) matchday-FSM coupling to Match is event-based,
  handled cleanly via Customer-Supplier + ACL — the dossier's
  caution was conservative. The Option B published-contract
  surface still applies (`StadiumCommercialSnapshot`,
  `StadiumCapacitySnapshot`, `MatchdayTimelineAdvanced`,
  `PitchConditionChanged`, `VenueEventBooked`,
  `FacilityComplianceChecked`) — Stadium Operations BC simply
  becomes the owner of that contract surface in its own per-save
  schema rather than nesting inside Club Management.
- **Audience & Atmosphere = Option C** (own bounded context, via
  spin-off [[ADR-0062-audience-and-atmosphere-context]]).
- **CommercialPortfolio = Option C** (own bounded context covering
  sponsorship + catering + merchandise + hospitality + ticketing
  & commercial settlement umbrella).
- **Ticketing & Commercial Settlement = Option D** (sub-Aggregate
  inside CommercialPortfolio).
- **Concurrent ratification of draft ADR-0050 + ADR-0058** —
  both flip to `accepted` / `binding: true` at the same
  ratification event with the in-line amendment hunks proposed
  by FMX-32 applied (see ADR-0050 + ADR-0058 §Ratification
  notes).

Result: **three new bounded contexts** (Stadium Operations,
Audience & Atmosphere, CommercialPortfolio), bringing the
16-context map to **19**. Combined with FMX-29 (ADR-0060 Youth
Academy, still proposed) + FMX-33 (ADR-0059 Community Overlay
Pipeline, still proposed) the map can grow to 21 if those land
later.

The §Map patch proposal section below documents the diff hunks
applied to `bounded-context-map.md` by the FMX-32 apply-PR.

## Context

FMX-32 audits the four Club Management sub-aggregate candidates
loaded by the wave-2 economy work (FMX-13 / 41 / 42 / 43 / 44):

- **Stadium / Venue Operations** — matchday FSM + facility-decay
  loop + capacity-by-seat-class inventory + non-matchday event
  calendar + hospitality + catering + multi-regulator surface.
- **Audience & Atmosphere** (formerly *Fan Ecology*) — six-segment
  cohort model + weekly atmosphere loop + multi-input scoring
  formula + politics-event triggers + persona / named-group
  overlay.
- **CommercialPortfolio** (Sponsorship + Catering + Merchandise +
  Hospitality + Ticketing umbrella) — contract lifecycle FSM +
  side-condition catalog + asset-inventory taxonomy + multi-input
  valuation formula + exclusivity graph + breach Process Manager.
- **Ticketing & Commercial Settlement** — price grid × seat-class
  inventory + 8-state season-ticket campaign FSM + settlement
  Process Manager + IFRS 15 accrual accounting + credit / refund
  liability pools.

The 16-context map (`docs/10-Architecture/bounded-context-map.md`
§1 line 38, `binding: true`, post-FMX-40 ratification 2026-05-28)
currently assigns Club Management ownership of "Finance ledger,
accounting projections, budgets, infrastructure, sponsors, board,
fans, insolvency state". The map header note adds: "FMX-41
commercial economy planning is captured in draft ADR-0058. It does
not add a seventeenth bounded context. The draft recommendation is
a Club Management commercial sub-aggregate."

Draft ADR-0050 (Club Economy Accounting Ledger, `status: draft`,
`binding: false`) and draft ADR-0058 (Club Economy Commercial
Impact Boundary, `status: draft`, `binding: false`) both
pre-commit all four candidates to Club Management. ADR-0058
§Recommendation lines 97-112 explicitly states "Club Management
gets a named commercial sub-aggregate, but no new bounded context
is added by this ADR... If commercial operations later needs
independent lifecycle, staffing, permissions or service extraction,
supersede this ADR and evaluate Option B."

The
[[../../60-Research/club-management-sub-aggregate-audit-2026-05-28]]
synthesis evaluates per-candidate Options A (sub-aggregate inside
Club Management) / B (Hybrid named Aggregate with published
contract surface) / C (own bounded context) against the six-of-six
DDD split-criteria rubric, F2 genre + cross-genre precedent, F3
DDD authority and pattern (Vernon IDDD + Evans + Fowler + MS
Learn + Context Mapper), F5 real-world football operations
structure 2023-2026, and F6 cross-context integration pattern.

**Per-candidate six-of-six firing:**

| Candidate | Six-of-six | Lean |
|---|---|---|
| Stadium / Venue Operations | 5/6 (criterion 6 low-co-change fails: matchday FSM ties to Match) | Option B (Hybrid) |
| Audience & Atmosphere | 6/6 (matches FMX-29 / 33 wave high) | Option C (own BC) + spin-off ADR-0062 |
| CommercialPortfolio | 6/6 | Option C (own BC) |
| Ticketing & Commercial Settlement | 6/6 | Sub-Aggregate inside CommercialPortfolio (if CommercialPortfolio = C) or own Settlement BC (if CommercialPortfolio = B) |

**Vault-binding tension.** This ADR **refines draft ADRs**, it
does not supersede binding ADRs. ADR-0050 and ADR-0058 are both
`status: draft` / `binding: false`. The amendment hunks proposed
in §Map patch + §Supersedes are in-line refinements to the draft
proposals before their ratification, not supersession chains
against accepted ADRs. The accepted ADRs that constrain this
decision (ADR-0019 modular-monolith DDD; ADR-0027 per-save schema;
ADR-0028 transactional outbox) all stay compatible with the
per-candidate recommendations.

## Options considered

This ADR uses a **per-candidate matrix**: each candidate is
evaluated against Options A / B / C with own trade-offs. The
matrix lets Nico ratify per-candidate; the working recommendation
is captured in §Recommendation below.

### Candidate 1 — Stadium / Venue Operations

#### Option A — Stay as pure sub-aggregate inside Club Management

Leave Stadium / Venue Operations as a pure sub-aggregate of Club
Management with no named contract surface. The current draft
ADR-0058 default.

- **Coupling:** matchday FSM intra-context with Match; facility
  costs intra-context with Club ledger.
- **Test isolation:** weak — Stadium operational behaviour lives
  inside Club Management's aggregates; tests collide.
- **Service extractability:** weak — would require carving out a
  named Aggregate later.
- **Genre precedent:** matches FM / EA FC / OOTP / FIFA Manager
  / Anstoss — all keep Stadium as sub-aggregate.
- **DDD pattern:** Vernon (IDDD ch. 3 + 9) Hotel PMS / CMMS /
  Theme Park analogue argues for own BC; staying as pure
  sub-aggregate fights this.
- **Real-world precedent:** fights real-world organisational
  separation at Bayern (Allianz Arena München Stadion GmbH), BVB
  (BVB Stadionmanagement GmbH), Spurs (venue business), Real
  Madrid (Bernabéu Legends JV).
- **Trade-off:** weakest — fights both DDD pattern and real-world
  evidence; rejects the wave-2 surface load.

#### Option B — Hybrid named Aggregate `StadiumOperations` inside Club Management

Promote to a named Aggregate `StadiumOperations` inside Club
Management with published contract surface
(`StadiumCommercialSnapshot`, `StadiumCapacitySnapshot`,
`MatchdayTimelineAdvanced`, `PitchConditionChanged`,
`VenueEventBooked`, `MaintenanceProjectScheduled`,
`FacilityComplianceChecked`). No new bounded context. Matchday
FSM + facility-decay sub-FSM + venue-event-calendar +
seat-class-inventory + hospitality-inventory all live inside the
named Aggregate.

- **Coupling:** matchday FSM published as event stream; other
  contexts consume via Reference / Customer-Supplier patterns.
- **Test isolation:** strong — named Aggregate gets own test
  surface; Club Management aggregates depend on published
  contract only.
- **Service extractability:** moderate — extraction to own BC is
  a deployment change per ADR-0019 §5.
- **DDD pattern:** Vernon "named aggregate with contract
  surface" is **transitional** but defensible at 5/6 firing
  scoring.
- **Real-world precedent:** matches Tottenham's
  internal-division model (no separate legal entity, but
  dedicated division with own director); intermediate between
  Manchester United (sub-function of COO) and Bayern (separate
  GmbH).
- **Trade-off:** clean landing for 5/6 firing — gives Stadium
  named boundary + published contract without adding a new BC.

#### Option C — Own bounded context `StadiumOperations`

Carve Stadium / Venue Operations as own bounded context with own
matchday FSM Aggregate + facility-decay Aggregate +
venue-event-calendar Aggregate + seat-class-inventory Aggregate +
hospitality-inventory Aggregate. Becomes 17th-20th bounded context
depending on landing order with ADR-0059 / 0060 / 0062.

- **Coupling:** clean — own per-save schema per ADR-0027; Match
  consumes via Reference; Matchday-Event-Engine consumes via
  Published Language; Regulations consumes via Customer-Supplier
  + ACL.
- **Test isolation:** strongest.
- **Service extractability:** matches ADR-0019 §5.
- **DDD pattern:** Vernon canonical Hotel PMS / CMMS analogue;
  Evans Blue Book ch. 5 supporting subdomain; MS Learn align BC
  to business capability.
- **Real-world precedent:** matches Bayern + BVB + Spurs (legal-
  entity / dedicated-division separation) — strongest pro-C
  signal in the wave.
- **Trade-off:** matchday FSM coupling to Match is genuine —
  criterion 6 (low co-change) does **not** fire cleanly per F4.1.
  Premature Option C for MVP; defer to future audit beat.

### Candidate 2 — Audience & Atmosphere (Fan Ecology)

#### Option A — Stay as pure sub-aggregate inside Club Management

Leave Fan Ecology as pure sub-aggregate of Club Management's
"fans" responsibility per bounded-context-map §1 line 38.

- **Coupling:** segment state + atmosphere loop + politics-event
  triggers all inside Club Management aggregates.
- **Test isolation:** weak — atmosphere weekly tick collides with
  Club ledger week-tick; segment-mood logic pollutes Club's
  ledger / FFP / board-pressure language.
- **DDD pattern:** Vernon scoring-context + customer-loyalty
  pattern argues strongly for own BC; staying as pure
  sub-aggregate fights this.
- **Cross-genre precedent:** CK3 vassal opinion, Civ VI Loyalty,
  Cities Skylines districts, TW Three Kingdoms public order all
  promote audience / loyalty to own context.
- **Real-world precedent:** UEFA SLO + Premier League IFAB
  regulatory anchor argues for distinct regulatory subdomain.
- **Trade-off:** weakest — fights DDD authority + cross-genre +
  regulatory anchor. Same anti-pattern as FMX-26 ("Staff in Club
  Management").

#### Option B — Hybrid named Aggregate inside Club Management

Promote to named Aggregate inside Club Management with published
contract surface (`FanDemandForecast`, `FanIncidentLogged`,
`AtmosphereSnapshot`, `TicketingTrustStateChanged`).

- **Coupling:** atmosphere weekly tick published as event stream.
- **Test isolation:** improved but still inside Club Management's
  modular surface; Vernon ch. 10 small-aggregate rule fires
  against the cohort + atmosphere + politics model size.
- **DDD pattern:** transitional state, not stable architecture.
- **Trade-off:** Hybrid is only useful when team / deployment
  constraints force colocation; in FMX no such constraint
  exists. The published contract surface (`FanDemandForecast` +
  `ticketingTrustState`) was already established by FMX-42; the
  conceptual boundary already exists.

#### Option C — Own bounded context Audience & Atmosphere (renamed from Fan Ecology)

Carve Audience & Atmosphere as own bounded context with own
`SupporterSegment` Aggregate + `AtmosphereSnapshot` Aggregate +
`FanIncident` Aggregate + `TicketingTrustLedger` Aggregate +
`NamedSupporterGroup` Aggregate (FMX-54-gated). Becomes 17th-20th
bounded context depending on landing order.

- **Coupling:** clean — own per-save schema per ADR-0027;
  Customer-Supplier with Club Management (CommercialPortfolio +
  ledger consumers) via ACL; Published Language to Rivalry +
  Matchday-Event-Engine + Notification.
- **Test isolation:** strongest.
- **Service extractability:** matches ADR-0019 §5.
- **DDD pattern:** Vernon scoring-context canonical (IDDD ch. 3
  + 7); Evans Blue Book ch. 14 (different language → different
  BC); Fowler bliki credit-scoring + recommendation as separate
  contexts; MS Learn supporting-subdomain pattern. Six-of-six
  fires.
- **Cross-genre precedent:** CK3 + Civ VI + Cities + TW
  Three Kingdoms unanimous on segment-level audience / loyalty
  as own context.
- **Real-world precedent:** SLO regulatory anchor + GDPR Art.
  6 / 9 + DSA Art. 16 form distinct regulatory subdomain.
- **Trade-off:** adds one bounded context to the map. Marginal
  cost justified by six-of-six firing + cross-genre unanimous +
  Vernon canonical + regulatory anchor.

#### Spin-off trigger

Per the FMX-32 plan §2 ("Combined ADR + spin-off if any candidate
splits"), Option C for Audience & Atmosphere triggers spin-off
[[ADR-0062-audience-and-atmosphere-context]]. ADR-0061 records the
audit-level recommendation; ADR-0062 carries the standalone
ratification frame for Audience & Atmosphere with Option C
recommendation.

### Candidate 3 — CommercialPortfolio (Sponsorship + Catering + Merchandise + Hospitality + Ticketing umbrella)

#### Option A — Stay as pure sub-aggregate inside Club Management

Leave commercial as pure sub-aggregate of Club Management.

- **Coupling:** contract lifecycle FSM + breach Process Manager
  + asset inventory + exclusivity graph + valuation formula all
  inside Club Management aggregates.
- **Test isolation:** weak — contract-term cadence collides with
  Club ledger week-tick; commercial language pollutes Club's
  ledger / FFP / board-pressure language.
- **DDD pattern:** Vernon IDDD CLM canonical strongly argues for
  own BC; Salesforce CPQ + SAP S/4HANA + Stripe Connect +
  Guidewire + Amdocs industry pattern unanimous on Commercial
  Operations / CLM as separate BC.
- **Real-world precedent:** **decisively fights this.**
  CCO-peer-of-CFO pattern universal at top clubs; sponsorship
  inside commercial department, not finance; commercial revenue
  = 40-60% of total at top clubs.
- **Trade-off:** weakest in the wave — fights DDD industry pattern
  AND real-world organisational pattern AND 6/6 firing.

#### Option B — Hybrid named Aggregate inside Club Management

Promote to named Aggregate inside Club Management with published
contract surface (`CommercialContractActivated`,
`CommercialBreachOpened`, `MatchdayCommercialSettlementPosted`,
`InvestorCashGrantPosted`, `CommercialFairValueAssessed`).

- **Coupling:** improved — contract lifecycle FSM published as
  event stream.
- **Test isolation:** improved but still inside Club Management.
- **DDD pattern:** transitional state, not stable architecture.
  Vernon: once you give the contract aggregate its own language
  and published surface and treat Finance as a consumer, you
  have effectively defined a separate bounded context anyway
  (IDDD ch. 7).
- **Real-world precedent:** fights CCO-peer-of-CFO pattern.
- **Trade-off:** transitional — only useful if team / deployment
  constraints force colocation. No such constraint in FMX.

#### Option C — Own bounded context `CommercialPortfolio`

Carve CommercialPortfolio as own bounded context covering
sponsorship + catering + merchandise + hospitality + ticketing &
commercial settlement umbrella. Becomes 17th-20th bounded context
depending on landing order.

- **Aggregates:** `CommercialContract` (per-club, per-contract);
  `AssetInventory` (per-club); `ExclusivityGraph` (per-club);
  `SeasonTicketCampaign` (per-club, per-season, 8-state FSM per
  FMX-43); `FixtureSettlement` (per-club, per-fixture, settlement
  Saga); `AccrualSchedule` (per-contract, per-performance-
  obligation, IFRS 15); `CreditLiabilityPool` (per-club,
  per-fixture); `InstalmentReceivable` (per-club, per-payer);
  `CommercialFairValueAssessment` (per-contract, related-party +
  fair-value documentation); `FanEventCampaign` (per-club,
  per-campaign, paid fan-service activations).
- **Coupling:** clean — own per-save schema per ADR-0027;
  Customer-Supplier with Club Management ledger via ACL;
  Reference patterns to Stadium + Audience & Atmosphere + League
  Orchestration + Match + Regulations + Rivalry.
- **Test isolation:** strongest.
- **Service extractability:** matches ADR-0019 §5.
- **DDD pattern:** Vernon CLM canonical (IDDD ch. 3 + 7 + 10);
  Salesforce CPQ + SAP S/4HANA Sales Contract + Stripe Connect +
  Guidewire PolicyCenter + Amdocs subscription lifecycle industry
  pattern unanimous. Six-of-six fires.
- **Real-world precedent:** CCO-peer-of-CFO universal; multi-
  regulator anchor (UEFA FSR + PL APT + La Liga PSR + GDPR +
  DSA + EU competition + Bundesliga 50+1) intrinsic to
  commercial model design.
- **Trade-off:** adds one bounded context to the map. Marginal
  cost justified by six-of-six firing + Vernon CLM canonical +
  real-world CCO-peer-of-CFO + commercial = 40-60% of revenue.

### Candidate 4 — Ticketing & Commercial Settlement

#### Option A — Stay as pure sub-aggregate inside Club Management

Leave ticketing as pure sub-aggregate of Club Management.

- **Trade-off:** weakest — fights Vernon IDDD settlement-context
  + Stripe Billing-vs-Ledger industry pattern + UEFA FSR
  matchday-segregation regulatory requirement + IFRS 15 universal
  practice.

#### Option B — Hybrid named Aggregate inside Club Management

Promote to named Aggregate inside Club Management with published
settlement events.

- **Trade-off:** transitional. If CommercialPortfolio = Option C,
  this is replaced by "sub-Aggregate inside CommercialPortfolio"
  (cleaner landing). If CommercialPortfolio = Option B, Option B
  here is unstable — the 8-state campaign FSM + IFRS 15 accrual
  schedule + credit-liability pool is too big for a sub-
  aggregate-of-sub-aggregate landing.

#### Option C — Own Settlement / Revenue-Recognition bounded context

Carve as standalone Settlement BC alongside CommercialPortfolio.

- **DDD pattern:** Vernon settlement-context canonical (IDDD ch.
  3 + 7); airline yield management vs revenue accounting (Sabre,
  Amadeus Altea); concert promoter ticketing vs settlement
  (Ticketmaster, Live Nation, AXS); Stripe Billing vs Stripe
  Ledger industry pattern.
- **Trade-off:** **defensible but redundant if
  CommercialPortfolio = Option C.** Industry analogues
  (Stripe Billing + Stripe Ledger; airline yield + revenue
  accounting) bundle pricing + inventory + settlement + rev-rec
  inside the same commercial / billing context, separate only from
  the general ledger. Recommended landing: **sub-Aggregate inside
  CommercialPortfolio** as the primary domain shape, not
  standalone Settlement BC.

#### Option D (recommended) — Sub-Aggregate inside CommercialPortfolio

If CommercialPortfolio = Option C (recommended), Ticketing &
Commercial Settlement becomes the primary Aggregate Root inside
CommercialPortfolio, with `SeasonTicketCampaign`,
`FixtureSettlement`, `AccrualSchedule`, `CreditLiabilityPool`,
`InstalmentReceivable`, `AccessibleAllocation` as the primary
aggregates.

- **DDD pattern:** Vernon CLM canonical bundles pricing + inventory
  + settlement + rev-rec inside the contract lifecycle context.
- **Trade-off:** **strongest landing** — preserves the
  Customer-Supplier with Club Management ledger via ACL, keeps
  the regulatory anchor (IFRS 15 + UEFA FSR + DSA + CRA + Late
  Payment Directive) co-located with the contract lifecycle
  anchor.

## Recommendation

Per-candidate Recommendation matrix. Nico ratifies per-candidate;
the audit working recommendation is **Option B / Option C /
Option C / Option D**, yielding **two new bounded contexts**
(Audience & Atmosphere via ADR-0062 spin-off, CommercialPortfolio
via this ADR), bringing the 16-context map to 18 contexts after
ratification (or 19 / 20 depending on ADR-0059 + ADR-0060 landing
order).

| Candidate | Six-of-six | Recommended Option | Rationale (one-line) |
|---|---|---|---|
| Stadium / Venue Operations | 5/6 | **Option B** (Hybrid named Aggregate `StadiumOperations`) | Five-of-six fires cleanly but matchday FSM coupling to Match is genuine; named-Aggregate boundary + published contract is the clean landing for MVP. Option C defensible for post-MVP audit beat. |
| Audience & Atmosphere | 6/6 | **Option C** (own bounded context, spin-off ADR-0062) | Vernon scoring-context canonical + cross-genre unanimous + SLO regulatory anchor + segment-specific GDPR + DSA Art. 16. |
| CommercialPortfolio | 6/6 | **Option C** (own bounded context) | Vernon CLM canonical + CCO-peer-of-CFO universal at top clubs + 40-60% of revenue + multi-regulator anchor. |
| Ticketing & Commercial Settlement | 6/6 | **Option D** (sub-Aggregate inside CommercialPortfolio) | Vernon settlement-context bundles inside contract lifecycle; airline + Stripe + concert promoter pattern. **Fallback:** Option C standalone if CommercialPortfolio = Option B. |

### Three converging arguments (audit-level)

1. **F4 DDD criteria fire strongest in wave for three of four
   candidates.** Six-of-six fires for Audience & Atmosphere,
   CommercialPortfolio, Ticketing & Settlement; equal to the
   FMX-29 / 33 wave high; stronger than FMX-26 / 28 / 30 / 34.
   Vernon IDDD scoring-context + Customer-Supplier + ACL +
   Process Manager / Saga patterns apply per-candidate. Stadium
   fires 5/6, the boundary level where Hybrid is the clean
   landing.

2. **F5 real-world organisational + regulatory evidence is
   decisive for CommercialPortfolio + Stadium.** CCO-peer-of-CFO
   universal at top clubs supports CommercialPortfolio Option C.
   Bayern Allianz Arena München Stadion GmbH + BVB
   Stadionmanagement GmbH + Spurs venue business + Real Madrid
   Bernabéu Legends JV support Stadium named-Aggregate (Option B
   for MVP, Option C for post-MVP). SLO + GDPR + DSA anchor
   supports Audience & Atmosphere Option C. UEFA FSR + IFRS 15
   + multi-regulator anchor supports Ticketing & Settlement
   nesting inside CommercialPortfolio.

3. **F2 cross-genre precedent + F3 DDD industry analogues
   unanimous.** Audience & Atmosphere: CK3 + Civ VI + Cities +
   TW cross-genre + Salesforce Marketing Cloud / Schufa /
   Spotify / Tesco Clubcard industry. CommercialPortfolio:
   F1 Manager / Motorsport Manager sponsor portfolios + Salesforce
   CPQ / SAP S/4HANA / Stripe Connect / Guidewire industry.
   Ticketing & Settlement: airline yield management vs revenue
   accounting + concert promoter ticketing vs settlement + Stripe
   Billing vs Stripe Ledger industry. Stadium: Hotel PMS / CMMS /
   Theme Park / Anno cross-genre.

### Named risks

- **Map growth.** Working recommendation adds 2 bounded contexts.
  Combined with ADR-0059 + ADR-0060 in-flight drafts the map
  could grow from 16 → 19-20. Modular monolith stays one process
  per ADR-0019. Mitigation: ADR-0019 §5 keeps extraction a
  deployment change, not a refactor.
- **Coordination growth.** CommercialPortfolio has 7 consumers
  + 6 suppliers; Audience & Atmosphere has 7 consumers + 4
  suppliers. Discipline required. Mitigation: explicit
  Customer-Supplier contracts; Reference + Snapshot patterns;
  ACL on every customer side.
- **Matchday FSM coupling (Stadium).** Option B leaves matchday
  FSM inside Club Management's StadiumOperations named Aggregate
  coupled to Match per-fixture FSM. Mitigation: published contract
  surface (`StadiumCommercialSnapshot`, `MatchdayTimelineAdvanced`,
  `PitchConditionChanged`) gives clean external API; Match
  consumes via Reference pattern.
- **IFRS 15 + multi-regulator surface on Ticketing & Settlement.**
  Six concurrent regulatory frameworks. Mitigation: nesting inside
  CommercialPortfolio keeps regulatory anchor co-located with
  contract lifecycle anchor; Regulations & Compliance consumes
  via Customer-Supplier + ACL per ADR-0056 Tax-catalog pattern.
- **Creative IP-safe naming.** All sample names (segments,
  sponsors, supporter groups, venues, hospitality partners) follow
  the vault-wide evocative-but-clearly-not-real rule per GD-0015
  + ADR-0007. Mitigation: FMX-54 follow-up ticket created
  2026-05-28 (Fan Ecology persona privacy & creative-IP-safe-
  naming review).
- **Sub-aggregate-inside-CommercialPortfolio fallback for
  Ticketing & Settlement.** If Nico ratifies Option B for
  CommercialPortfolio instead of Option C, Ticketing & Settlement
  promotes to own Settlement BC. Mitigation: this ADR documents
  both landings; ratification chooses one.
- **Refines draft ADR-0050 + ADR-0058 rather than supersedes
  binding ADRs.** Both target ADRs are `status: draft`. ADR-0050
  §lines 67-79 ("Club Management owns finance, budget, sponsor,
  stadium economics, board pressure and insolvency stage") and
  ADR-0058 §Recommendation lines 97-112 ("Club Management gets a
  named commercial sub-aggregate, but no new bounded context is
  added by this ADR") both receive in-line amendment hunks per
  §Map patch below. No supersession chain needed; both target
  ADRs can ratify concurrently after FMX-32 lands.

Status stays `proposed` / `binding: false` until Nico ratifies.

## Decision

This ADR records the **per-candidate decision** that, if
ratified, would be applied to the bounded-context map.

### Stadium / Venue Operations — Decision (Option B)

If ratified, Stadium / Venue Operations remains a sub-aggregate of
Club Management but is promoted to a named Aggregate
`StadiumOperations` with the following composition:

- **Sub-aggregates owned:**
  - `MatchdayTimeline` (per-fixture): matchday FSM (Preparing →
    DoorsOpen → InPlay / Kickoff → Halftime → SettlementPending →
    Reset).
  - `FacilityCondition` (per-facility): age + decay + maintenance
    project lifecycle.
  - `VenueEventCalendar` (per-club): non-matchday event bookings.
  - `SeatClassInventory` (per-club): capacity by class (standing,
    seating, family, premium, suites, accessibility, away
    allocation).
  - `HospitalityInventory` (per-club): suite + box inventory
    (revenue accounting in CommercialPortfolio).
- **Sub-aggregates not owned:**
  - Hospitality revenue accounting → CommercialPortfolio
    (Option C).
  - Ticketing settlement → CommercialPortfolio (Option D).
  - Matchday rivalry classification → Rivalry System
    (ADR-0057).
  - Tactical lineup snapshot → Tactics (ADR-0055).
  - Facility-licensing rules → Regulations & Compliance
    (ADR-0056).
  - Match per-fixture simulation → Match.

### Audience & Atmosphere (Fan Ecology) — Decision (Option C, spin-off ADR-0062)

If ratified, Audience & Atmosphere becomes its own bounded context
per the spin-off [[ADR-0062-audience-and-atmosphere-context]]. The
context owns:

- **Aggregates:** `SupporterSegment`, `AtmosphereSnapshot`,
  `FanIncident`, `TicketingTrustLedger`, `NamedSupporterGroup`
  (FMX-54-gated).
- See [[ADR-0062-audience-and-atmosphere-context]] for full
  Decision detail and §Map patch.

### CommercialPortfolio — Decision (Option C)

If ratified, CommercialPortfolio becomes its own bounded context
covering sponsorship + catering + merchandise + hospitality +
ticketing & commercial settlement umbrella. The context owns:

- **Aggregates:**
  - `CommercialContract` (per-club, per-contract): unified shell
    across sponsorship + catering + merchandise + hospitality +
    season-ticket bundles per FMX-44. Contract lifecycle FSM
    (Available → Negotiating → Active → Renewing → Terminated +
    Cool-down).
  - `AssetInventory` (per-club): asset taxonomy (jersey front /
    sleeve / shorts / training / stadium-name / stand-naming /
    VIP-suites / LED-boards / app-banner / fan-zone-activation /
    catering-exclusivity) + slot allocation state.
  - `ExclusivityGraph` (per-club): category-exclusivity edges (no
    two breweries, no two energy drinks, no two telecoms).
  - `SeasonTicketCampaign` (per-club, per-season): 8-state FSM
    per FMX-43 (planning → renewalWindow → seatRelocation →
    memberPresale → waitlistAllocation → publicSale → closed →
    inSeasonAdjustment → renewalReview).
  - `FixtureSettlement` (per-club, per-fixture): per-fixture
    settlement Saga combining gate + class × price + catering +
    merch share + hospitality.
  - `AccrualSchedule` (per-contract, per-performance-obligation):
    IFRS 15 5-step model state.
  - `CreditLiabilityPool` (per-club, per-fixture): refund /
    no-show / postponement liability.
  - `InstalmentReceivable` (per-club, per-payer): payment-plan
    state with IFRS 9 ECL.
  - `CommercialFairValueAssessment` (per-contract): related-party +
    fair-value documentation for UEFA FSR + PL APT + La Liga PSR.
  - `FanEventCampaign` (per-club, per-campaign): paid fan-service
    campaigns (away trains, family / summer events, choreo
    support, beer-per-goal activations) per
    `club-economy-impact-map-and-commercial-contracts-2026-05-28.md`.
- **Process Manager / Saga:** Contract lifecycle Saga + breach
  resolution Saga + renewal-window evaluation + season-ticket
  campaign lifecycle Saga + per-fixture settlement Saga +
  refund-liability evaluation.

CommercialPortfolio does **not** own:
- Ledger entries (owned by Club Management per ADR-0050; receives
  settlement events via Customer-Supplier + ACL).
- Segment-level fan demand (owned by Audience & Atmosphere per
  ADR-0062; consumed via `FanDemandForecast`).
- Stadium capacity + hospitality inventory physical reality (owned
  by StadiumOperations Aggregate inside Club Management;
  consumed via Reference).
- Matchday rivalry classification (owned by Rivalry System per
  ADR-0057).
- Regulatory rule catalogues (owned by Regulations & Compliance
  per ADR-0056; consumed via `EffectiveRuleSet`).
- Match per-fixture simulation (owned by Match).
- Investor entitlement confirmation (platform / payment code per
  ADR-0058).

### Ticketing & Commercial Settlement — Decision (Option D)

If ratified, Ticketing & Commercial Settlement becomes the primary
Aggregate cluster inside CommercialPortfolio (no separate bounded
context). The aggregates owned are listed under CommercialPortfolio
Decision above (`SeasonTicketCampaign`, `FixtureSettlement`,
`AccrualSchedule`, `CreditLiabilityPool`, `InstalmentReceivable`,
plus `AccessibleAllocation` sub-aggregate gated by FMX-54).

If Nico ratifies Option B for CommercialPortfolio instead, this
decision flips to **Option C** (own Settlement BC) with the same
aggregates as the primary domain.

## Public contract direction

### Stadium / Venue Operations (Option B — named Aggregate inside Club Management)

Draft commands (owned by Club Management's StadiumOperations
Aggregate):
- `ScheduleMatchdayTimeline` — opens matchday FSM for a fixture.
- `AdvanceMatchdayTimeline` — transitions matchday FSM state.
- `TriggerMatchdayEvent` — publishes a matchday event (e.g.
  Pyro, evacuation) per `matchday-event-engine.md` §4.
- `BookVenueEvent` — non-matchday event booking.
- `CompleteVenueEvent` — closes venue event.
- `ScheduleMaintenanceProject` — opens facility maintenance
  lifecycle.
- `CompleteMaintenanceProject` — closes maintenance project.
- `RebalanceSeatClassInventory` — updates capacity allocation.
- `RecordPitchCondition` — updates pitch quality index.
- `RegisterFacilityComplianceCheck` — captures Regulations
  evaluation outcome.

Draft events:
- `MatchdayTimelineScheduled`
- `MatchdayTimelineAdvanced`
- `MatchdayEventTriggered`
- `VenueEventBooked`
- `VenueEventCompleted`
- `MaintenanceProjectScheduled`
- `MaintenanceProjectCompleted`
- `SeatClassInventoryRebalanced`
- `PitchConditionChanged`
- `FacilityComplianceChecked`
- `StadiumCommercialSnapshotPublished` (consumed by
  CommercialPortfolio + Club Management ledger via ACL per
  ADR-0050)

Draft read models:
- `StadiumCommercialSnapshot`
- `StadiumCapacitySnapshot`
- `MatchdayTimelineBoard`
- `FacilityComplianceSnapshot`
- `VenueEventCalendarBoard`
- `PitchQualitySnapshot`
- `HospitalityInventorySnapshot`

Draft consumed facts:
- `MatchResolved` from Match (final attendance + pitch wear
  inputs).
- `SeasonAdvanced` from League Orchestration (facility decay
  weekly trigger).
- `EffectiveRuleSet` from Regulations & Compliance (UEFA Cat 4 +
  DFL Lizenzhandbuch + SGSA Green Guide compliance).
- `RivalryTierTransitioned` from Rivalry System (atmosphere +
  security risk inputs per ADR-0057).
- `EconomyWeekAdvanced` from Club Management (facility cost
  calculation).

### Audience & Atmosphere (Option C, spin-off ADR-0062)

See [[ADR-0062-audience-and-atmosphere-context]] §Public contract
direction.

### CommercialPortfolio (Option C)

Draft commands:
- `IssueCommercialOffer`
- `CounterCommercialOffer`
- `AcceptCommercialOffer`
- `AmendCommercialContract`
- `RenewCommercialContract`
- `OpenCommercialBreach`
- `ResolveCommercialBreach`
- `TerminateCommercialContract`
- `OpenSeasonTicketCampaign`
- `AdvanceSeasonTicketCampaign`
- `CloseSeasonTicketCampaign`
- `SetTicketingPolicy`
- `SetMatchdayCommercialPolicy`
- `ScheduleFanEventCampaign`
- `ApplyInvestorEntitlementGrant`
- `RecordCommercialFairValueAssessment`
- `RegisterAccessibleAllocation` (FMX-54-gated)
- `ReleaseUnusedTicket`
- `RecordInstalmentPayment`
- `ProvisionRefundLiability`

Draft events:
- `CommercialContractActivated`
- `CommercialContractRenewalDue`
- `CommercialContractRenewed`
- `CommercialBreachOpened`
- `CommercialBreachResolved`
- `CommercialContractTerminated`
- `SeasonTicketCampaignAdvanced`
- `SeasonTicketCampaignClosed`
- `TicketingPolicyChanged`
- `MatchdayCommercialSettlementPosted` *(consumed by Club
  Management ledger per ADR-0050)*
- `InvestorCashGrantPosted` *(consumed by Club Management ledger
  per ADR-0050 / ADR-0058)*
- `FanEventCampaignScheduled`
- `CommercialFairValueAssessed` *(consumed by Regulations &
  Compliance per ADR-0056)*
- `RefundLiabilityRecognised`
- `RefundLiabilityReleased`
- `DeferredRevenueRecognised`

Draft read models:
- `CommercialContractPortfolio`
- `CommercialForecastSnapshot`
- `AssetInventoryDashboard`
- `ExclusivityGraphSnapshot`
- `SeasonTicketCampaignBoard`
- `MatchdayCommercialSettlement`
- `RefundLiabilitySnapshot`
- `InstalmentReceivableAging`
- `FairValueEvidencePack`
- `FanEventCampaignCalendar`
- `CommercialKpiBoard` (commercial revenue %, renewal rate per
  tier, fill rate, side-condition compliance, contract
  activation lead time)

Draft consumed facts:
- `FanDemandForecast` from Audience & Atmosphere per ADR-0062.
- `StadiumCommercialSnapshot` from Club Management's
  StadiumOperations Aggregate.
- `RivalryTierTransitioned` from Rivalry System per ADR-0057.
- `FixtureCommercialProfile` from League Orchestration per
  `club-economy-commercial-contracts.md`.
- `CurrentTransferWindow` + `EffectiveRuleSet` from Regulations &
  Compliance per ADR-0056.
- `MatchResolved` from Match.
- `SeasonAdvanced` from League Orchestration.

## Determinism and storage rules

Stadium (Option B — named Aggregate inside Club Management):
- Stadium's state lives inside Club Management's per-save
  schema (`save_<uuidv7hex>` per ADR-0027). Promotion to own BC
  later is a deployment change.
- Matchday FSM transitions use deterministic clocks; no
  `Date.now`.
- Facility decay weekly tick uses
  `StadiumRng(saveId, clubId, week)` sub-label of `WorldRng` per
  ADR-0018 §3.
- Domain events through ADR-0028 transactional outbox; Match,
  Matchday-Event-Engine, Regulations, CommercialPortfolio consume
  via published contract.

Audience & Atmosphere (Option C — own BC): See ADR-0062.

CommercialPortfolio (Option C — own BC):
- Per-save schema only (`save_<uuidv7hex>` per ADR-0027). No
  platform-scope cross-save state.
- Cross-save legacy seeds (Investor configuration, sponsor-
  archetype preferences, pricing-strategy preferences) flow
  through ADR-0051 Manager & Legacy at save creation only.
- Cross-save pack overrides (community-authored sponsor brand
  catalogues, asset taxonomies) flow through ADR-0059 Community
  Overlay Pipeline (proposed) at save creation only; CommercialPortfolio
  owns schema + semantic validation per Vernon canonical pattern
  (same as Regulations + Rivalry).
- Contract-onboarding RNG sub-label
  `CommercialRng(saveId, clubId, season)` per ADR-0018 §3. No
  cross-RNG draws.
- All state transitions use deterministic clocks (per ADR-0027 +
  ADR-0051); no `Date.now`.
- Domain events emitted through ADR-0028 transactional outbox;
  Club Management, Audience & Atmosphere, Stadium, Rivalry,
  Regulations, Manager & Legacy, Notification consume via ACL.
- **IFRS 15 posture:** per-performance-obligation accrual schedule;
  cash receipt → contract liability → match-by-match recognition;
  instalment receivables tracked separately with ECL per IFRS 9.
- **UEFA FSR / PL APT / La Liga PSR posture:** every related-party
  CommercialContract carries a `CommercialFairValueAssessment`
  aggregate evidencing market benchmarking; Regulations consumes
  for compliance reporting.
- **GDPR / DSGVO posture:** sponsor-partner data access governed
  by data-processing agreements; per-buyer ticket data segregated
  with explicit consent for marketing activations.
- **DSA Art. 16 posture:** sponsored-content moderation queue
  queryable; secondary-market resale platform integration audited.
- **CEN-EN 17210 + UK Accessible Stadia Guide posture:**
  `AccessibleAllocation` sub-aggregate with verified-eligibility
  state; utilisation reporting to Regulations.
- **EU Late Payment Directive 2011/7/EU posture:** B2B
  commercial debt (corporate hospitality) timelines respected;
  late payment interest provisioned.
- **UK Consumer Rights Act 2015 Schedule 2 posture:** refund
  policies drafted to avoid unfair terms; refund-liability
  evaluation respects the unfair-terms test.

## Rationale

The four candidates audited by FMX-32 all carry substantial
own-FSM, own-loop, own-storage and own-published-contract surface
loaded by the wave-2 economy work (FMX-13 / 41 / 42 / 43 / 44).
Three of four (Audience & Atmosphere, CommercialPortfolio, Ticketing
& Settlement) fire six-of-six on the DDD split-criteria rubric;
Stadium fires 5/6 with the matchday-FSM coupling to Match being
the criterion that fails.

For the three six-of-six candidates, **Vernon IDDD authority + DDD
industry analogues + real-world organisational evidence all
converge on Option C** (own bounded context):
- Vernon scoring-context (IDDD ch. 3 + 7) + Salesforce Marketing
  Cloud + Schufa + Spotify + Tesco Clubcard industry pattern for
  Audience & Atmosphere.
- Vernon CLM (IDDD ch. 3 + 7 + 10) + Salesforce CPQ + SAP S/4HANA
  Sales Contract + Stripe Connect + Guidewire PolicyCenter +
  Amdocs subscription lifecycle industry pattern + CCO-peer-of-
  CFO universal real-world pattern for CommercialPortfolio.
- Vernon settlement-context + airline yield management vs revenue
  accounting (Sabre, Amadeus Altea) + concert promoter ticketing
  vs settlement (Ticketmaster, Live Nation, AXS) + Stripe Billing
  vs Stripe Ledger industry pattern for Ticketing & Settlement
  (nested inside CommercialPortfolio per industry pattern).

For Stadium (5/6 firing), **Vernon Hotel PMS / CMMS / Theme Park
analogue argues for own BC, real-world separation evidence
(Bayern + BVB + Spurs + Real Madrid) supports it, but the
matchday-FSM coupling to Match per-fixture FSM is genuine**. Option
B (Hybrid named Aggregate) is the clean landing for MVP: it gives
Stadium a named-Aggregate boundary + published contract surface
(`StadiumCommercialSnapshot`, `MatchdayTimelineAdvanced`,
`PitchConditionChanged`) without forcing a premature BC split;
Match consumes via Reference pattern; future audit beat can
revisit Option C after MVP if matchday coupling holds.

Hiding any of the four as **pure sub-aggregate of Club Management**
(Option A) buries the cross-cutting signals (segment fan demand,
contract-portfolio fair-value, IFRS 15 accrual schedule, multi-
regulator surface) and forces Club Management's ledger / FFP /
board-pressure language to host concepts it does not own. Same
anti-pattern as FMX-26 (Staff in Club Management), FMX-28 (Tactics
in Match), FMX-33 (Community Overlay in Offline Sync).

The marginal cost (two new bounded contexts in the modular
monolith) is small compared with the coupling debt of leaving the
four candidates as pure sub-aggregates after the wave-2 surface
load.

## Consequences

Positive:

- Clear owner for matchday FSM + facility-decay loop + venue-event
  calendar + seat-class inventory + hospitality inventory (Stadium
  named Aggregate); for cohort-mood loop + multi-input scoring
  formula + politics-event triggers + persona overlay (Audience &
  Atmosphere BC); for contract lifecycle + side-condition catalog
  + asset inventory + exclusivity graph + valuation formula +
  breach Process Manager (CommercialPortfolio BC); for 8-state
  campaign FSM + per-fixture settlement Saga + IFRS 15 accrual
  schedule + credit-liability pool (Ticketing & Settlement
  primary Aggregate inside CommercialPortfolio).
- Contracts-first path: commands, events, read models, consumed
  facts all named at draft precision per candidate.
- ADR-0050 finance-ownership rule unchanged: only Club Management
  posts ledger entries; CommercialPortfolio emits settlement
  events consumed via ACL.
- ADR-0058 commercial-impact-boundary refinement (Hybrid /
  Option C choice) makes the boundary explicit: Club Management
  owns the ledger truth; CommercialPortfolio owns commercial
  policy + lifecycle.
- Real-world organisational pattern preserved: CCO-peer-of-CFO
  for CommercialPortfolio; Stadium GmbH-analogue-as-named-
  Aggregate (Option B) for Stadium; SLO + segment-specific GDPR
  + DSA anchored at Audience & Atmosphere.
- Cross-context integration follows Vernon canonical patterns
  (Customer-Supplier + ACL + Reference + Snapshot + Process
  Manager / Saga).
- Audit can revisit Stadium Option C in a future beat without
  disturbing Audience & Atmosphere or CommercialPortfolio
  decisions.

Negative:

- Adds two bounded contexts to the map (Audience & Atmosphere via
  ADR-0062 spin-off, CommercialPortfolio via this ADR).
  Combined with ADR-0059 + ADR-0060 in-flight drafts the map can
  grow from 16 → 19-20 contexts before this wave closes.
- Requires event consumption across Stadium + Audience & Atmosphere
  + CommercialPortfolio + Club Management + Rivalry + Regulations
  + Manager & Legacy + Notification + Match + League. Coordination
  grows.
- Refines (not supersedes) draft ADR-0050 + ADR-0058; both target
  ADRs must ratify concurrently or after FMX-32 lands. Until
  ratified, the in-line amendment hunks in §Map patch remain
  proposed-only.
- Stadium Option B is a deliberate compromise; future Option C
  promotion is a multi-context coordination job (Match coupling
  must be untangled). The compromise is documented and tracked.
- The fallback (Option C standalone Settlement BC for Ticketing &
  Settlement if CommercialPortfolio = Option B) adds optionality
  cost — this ADR documents both landings; ratification chooses
  one.
- FMX-54 follow-up ticket (Fan Ecology persona privacy &
  creative-IP-safe-naming review) is created but not yet
  ratified; named-group overlay scope inside Audience & Atmosphere
  depends on its outcome.

## Map patch proposal

Order-tolerant proposal that applies when this ADR is accepted.
Sequencing: if ADR-0059 (Community Overlay Pipeline) and ADR-0060
(Youth Academy) are ratified first, ADR-0061 adds at positions
19 + 20 (CommercialPortfolio + Audience & Atmosphere); if FMX-32
lands first the apply-PR for whichever ADR lands second renumbers
the prose accordingly.

### §1 table — new rows + amendment

Existing row to **amend**:

````diff
-| **Club Management** | Finance ledger, accounting projections, budgets, infrastructure, sponsors, board, fans, insolvency state | Club state, economy snapshots, board pressure, facility modifiers |
+| **Club Management** | Finance ledger, accounting projections, budgets, board pressure, insolvency state, and a named `StadiumOperations` Aggregate (matchday FSM + facility-decay sub-FSM + venue-event-calendar + seat-class inventory + hospitality inventory) | Club state, economy snapshots, board pressure, facility modifiers; `StadiumCommercialSnapshot` / `StadiumCapacitySnapshot` / `MatchdayTimelineAdvanced` / `PitchConditionChanged` / `VenueEventBooked` / `MaintenanceProjectScheduled` / `FacilityComplianceChecked` published-contract surface |
````

New rows to **add** (after `Rivalry System` row, before
`Offline Sync` row):

````diff
+| **Audience & Atmosphere** | `SupporterSegment` Aggregate (per-segment loyalty + mood + volatility + attendance probability + season-ticket renewal probability + price sensitivity + propensity), `AtmosphereSnapshot` Aggregate (per-fixture atmosphere multiplier derived from rivalry × table × utilisation × form × weather × security × choreo participation), `FanIncident` Aggregate (choreo + protest banner + ticket boycott + ouster-call threshold-triggered FSM), `TicketingTrustLedger` Aggregate (persistent trust state with 3-season shock memory), `NamedSupporterGroup` Aggregate (FMX-54-gated named-group overlay with persona link to People context per ADR-0052) | `FanDemandForecast` / `AtmosphereSnapshot` / `SegmentMoodBoard` / `TicketingTrustStateSnapshot` / `FanIncidentTimeline` / `NamedSupporterGroupRoster` / `OusterCallEscalationBoard` queries; `FanDemandForecasted` / `FanIncidentLogged` / `AtmosphereSnapshotPublished` / `SegmentRenewalProbabilityUpdated` / `TicketingTrustStateChanged` / `OusterCallEscalated` / `FanPipelineQualityUpdated` events |
+| **CommercialPortfolio** | `CommercialContract` Aggregate (unified shell across sponsorship + catering + merchandise + hospitality + season-ticket bundles; Available → Negotiating → Active → Renewing → Terminated + Cool-down FSM), `AssetInventory` Aggregate (asset taxonomy + slot allocation), `ExclusivityGraph` Aggregate (category-exclusivity edges), `SeasonTicketCampaign` Aggregate (8-state FSM per FMX-43), `FixtureSettlement` Aggregate (per-fixture settlement Saga), `AccrualSchedule` Aggregate (IFRS 15 5-step model), `CreditLiabilityPool` Aggregate (refund + no-show + postponement liability), `InstalmentReceivable` Aggregate (payment-plan state + IFRS 9 ECL), `CommercialFairValueAssessment` Aggregate (UEFA FSR + PL APT + La Liga PSR documentation), `FanEventCampaign` Aggregate (paid fan-service campaigns); contract lifecycle Saga + breach resolution Saga + renewal-window evaluation + season-ticket campaign lifecycle Saga + per-fixture settlement Saga + refund-liability evaluation | `CommercialContractPortfolio` / `CommercialForecastSnapshot` / `AssetInventoryDashboard` / `ExclusivityGraphSnapshot` / `SeasonTicketCampaignBoard` / `MatchdayCommercialSettlement` / `RefundLiabilitySnapshot` / `InstalmentReceivableAging` / `FairValueEvidencePack` / `FanEventCampaignCalendar` / `CommercialKpiBoard` queries; `CommercialContractActivated` / `CommercialContractRenewalDue` / `CommercialContractRenewed` / `CommercialBreachOpened` / `CommercialBreachResolved` / `CommercialContractTerminated` / `SeasonTicketCampaignAdvanced` / `SeasonTicketCampaignClosed` / `TicketingPolicyChanged` / `MatchdayCommercialSettlementPosted` / `InvestorCashGrantPosted` / `FanEventCampaignScheduled` / `CommercialFairValueAssessed` / `RefundLiabilityRecognised` / `RefundLiabilityReleased` / `DeferredRevenueRecognised` events; Customer-Supplier + ACL to Club Management ledger per ADR-0050 |
````

### §1 prose — new paragraphs (insert before Offline Sync paragraph)

````diff
+Audience & Atmosphere was proposed 2026-05-28 via ADR-0062
+(spin-off of ADR-0061 FMX-32 audit). It owns the per-segment cohort
+model (Ultras / Hardcore + Core + Family + Fair-weather + Corporate
++ Casual per `fan-ecology.md` §1), the weekly atmosphere engine,
+the persistent ticketing-trust state with 3-season shock memory,
+and the politics-event triggers (choreo / protest / boycott /
+ouster-call). CommercialPortfolio consumes `FanDemandForecast` as
+a Snapshot at season-ticket campaign opening + per-fixture pricing
+decision. Rivalry System consumes `FanIncidentLogged` for the
+fan-incident sub-score per ADR-0057. Matchday-Event-Engine
+consumes `AtmosphereSnapshot` for atmosphere multiplier + security
+risk input. Manager & Legacy consumes `FanPipelineQualityUpdated`
+for archetype hook aggregation per GD-0019. Notification renders
+`OusterCallEscalated` per ADR-0043. Cross-save legacy fan-base
+seeds (named-group archetype templates, segment-population
+baselines) flow through ADR-0051 Manager & Legacy at save creation
+only. Cross-save community pack overrides (segment names, regional
+yield tweaks, archetype name pools) flow through ADR-0059
+Community Overlay Pipeline (proposed) at save creation only;
+Audience & Atmosphere BC owns semantic validation per Vernon (same
+pattern as Regulations + Rivalry + Youth Academy). `risk:legal`
+hardline applies per GD-0015 IP-clean data + ADR-0007 naming
+schema (no real club, sponsor, venue, fan-group or person names
+embedded as samples); FMX-54 follow-up ticket handles GDPR / DSGVO
++ named-group persona overlay + DSA Art. 16 scope.
+
+CommercialPortfolio was proposed 2026-05-28 via ADR-0061 FMX-32
+audit. It owns commercial policy + commercial contract lifecycle
+(unified shell across sponsorship + catering + merchandise +
+hospitality + season-ticket bundles per FMX-44), asset inventory
+taxonomy, exclusivity graph, season-ticket campaign 8-state FSM
+per FMX-43, per-fixture settlement Saga, IFRS 15 accrual schedule,
+credit-liability pool, instalment receivable with IFRS 9 ECL,
+commercial fair-value assessment (UEFA FSR + PL APT + La Liga
+PSR documentation), and paid fan-service campaigns. Club
+Management consumes settlement + ledger-posting events via
+Customer-Supplier + ACL per ADR-0050; CommercialPortfolio never
+writes finance tables directly. Audience & Atmosphere supplies
+`FanDemandForecast` as Snapshot at season-ticket campaign opening
++ per-fixture pricing decision. Stadium's named StadiumOperations
+Aggregate supplies `StadiumCommercialSnapshot` (capacity by
+class + hospitality inventory + non-matchday event eligibility).
+Rivalry System supplies `RivalryTierTransitioned` (consumed for
+top-match pricing + sponsor-fit risk per ADR-0058 §input facts).
+League Orchestration supplies `FixtureCommercialProfile` +
+`SeasonAdvanced`. Regulations & Compliance supplies
+`EffectiveRuleSet` (consumed for IFRS 15 obligation interpretation
++ UEFA FSR matchday-segregation + CRA Schedule 2 refund-policy
++ DSA secondary-market + CEN-EN 17210 accessibility + Late
+Payment Directive + GDPR Art. 6/9 ticket-buyer data). Match
+supplies `MatchResolved` (final settlement input). Manager &
+Legacy consumes `CommercialKpiBoard` for archetype hook
+aggregation per GD-0019. Notification renders sponsor activation
++ renewal-due + breach alerts per ADR-0043. Cross-save legacy
+commercial seeds (sponsor-archetype templates, Investor
+entitlement state, pricing-strategy preferences) flow through
+ADR-0051 Manager & Legacy at save creation only. Cross-save
+community pack overrides (sponsor brand catalogues, asset
+taxonomies, fan-event campaign templates) flow through ADR-0059
+Community Overlay Pipeline (proposed) at save creation only;
+CommercialPortfolio BC owns semantic validation per Vernon (same
+pattern as Regulations + Rivalry + Youth Academy + Audience &
+Atmosphere). `risk:legal` hardline applies per GD-0015 + ADR-0007
+(no real-world sponsor names, no real-world club names embedded
+as samples; UEFA / DFL / FA / La Liga / Premier League regulatory
+references kept abstract via the Regulations & Compliance catalog
+per ADR-0056).
````

### §2 high-level Mermaid — new nodes + edges

````diff
     Reg["Regulations & Compliance"]
     Rival["Rivalry System"]
+    AAtmo["Audience & Atmosphere"]
+    CPort["CommercialPortfolio"]
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
+    AAtmo --> CPort
+    AAtmo --> Match
+    AAtmo --> Notif
+    AAtmo --> ML
+    Club --> CPort
+    AAtmo --> CPort
+    Stadium --> CPort
+    Rival --> CPort
+    League --> CPort
+    Match --> CPort
+    Reg --> CPort
+    CPort --> Club
+    CPort --> Reg
+    CPort --> ML
+    CPort --> Notif
     Training --> Squad
````

(Note: `Stadium` in the Mermaid is a label for the
StadiumOperations named Aggregate inside Club Management per
Option B; if Stadium later promotes to Option C own BC it gets
its own node.)

### §4 source mapping — new folders

````diff
   rivalry/
   youth-academy/
+  audience-and-atmosphere/
+  commercial-portfolio/
   sync/
   audit/
````

### §5 prose — extraction order

The §5 ordered list adds Audience & Atmosphere + CommercialPortfolio
to the "likely co-located unless real scaling signal forces split"
group. CommercialPortfolio carries the highest service-extraction
priority among the new contexts due to its 40-60% revenue share at
top clubs; future deployment changes may extract it first.

````diff
 The §5 prose retains the same order. Append note:
+
+Audience & Atmosphere and CommercialPortfolio join the modular
+monolith via ADR-0061 + ADR-0062 (FMX-32 audit). Both are
+candidate-late-extraction contexts per ADR-0019 §5;
+CommercialPortfolio's strategic-core role + 40-60% revenue share
+at top clubs makes it the highest-priority candidate for future
+independent deployment.
````

### §6 finance-ownership amendment (inline refinement to draft ADR-0050)

The map header note paragraph that references draft ADR-0058 is
amended:

````diff
-FMX-41 commercial economy planning is captured in draft
-\[\[09-Decisions/ADR-0058-club-economy-commercial-impact-boundary\]\]. It does not
-add a seventeenth bounded context. The draft recommendation is a Club
-Management commercial sub-aggregate: Club owns ticketing policy, commercial
-contracts, fan-event campaign choices, Investor entitlement ledger posting and
-commercial settlement. Fan Ecology, Rivalry System, League/Competition, Match,
-Stadium/Campus, Regulations and other contexts provide public facts such as
-`FanDemandForecast`, `FixtureCommercialProfile`,
-`CompetitionRevenueProfile` and `StadiumCommercialSnapshot`; they never write
-Club ledger rows directly.
+FMX-41 commercial economy planning is captured in draft
+\[\[09-Decisions/ADR-0058-club-economy-commercial-impact-boundary\]\]
+and refined 2026-05-28 by FMX-32 audit
+\[\[09-Decisions/ADR-0061-club-management-sub-aggregate-audit\]\].
+Per the FMX-32 audit Recommendation, commercial policy + commercial
+contract lifecycle + commercial settlement + Investor entitlement
+grant posting are owned by the new **CommercialPortfolio** bounded
+context (proposed via ADR-0061). Club Management remains the sole
+writer of finance ledger entries per ADR-0050; CommercialPortfolio
+emits settlement events consumed by Club Management via
+Customer-Supplier + ACL. Audience & Atmosphere (proposed via
+spin-off ADR-0062 from FMX-32 audit) supplies `FanDemandForecast`.
+Stadium's named `StadiumOperations` Aggregate inside Club
+Management supplies `StadiumCommercialSnapshot`. Rivalry System,
+League / Competition, Match, Regulations and other contexts
+supply their public facts; no context writes Club ledger rows
+directly.
````

## Supersedes

None — this ADR refines draft ADR-0050 + ADR-0058 via in-line
amendment hunks above. Neither draft ADR is binding; FMX-32 does
not supersede a binding ADR.

If ratified, ADR-0050 + ADR-0058 can ratify concurrently with
ADR-0061 (and ADR-0062 spin-off) — their amendment hunks become
authoritative at the same ratification event.

## Related Docs

- [[../../60-Research/club-management-sub-aggregate-audit-2026-05-28]] —
  FMX-32 ownership synthesis (this ADR's decision basis).
- [[../../60-Research/raw-perplexity/raw-club-management-sub-aggregate-audit-2026-05-28]] —
  FMX-32 raw research (12 Perplexity queries across 4 candidates ×
  3 dimensions: Genre / DDD / Real-world).
- [[ADR-0062-audience-and-atmosphere-context]] — spin-off ADR for
  Audience & Atmosphere with Option C standalone ratification
  frame.
- [[ADR-0050-club-economy-accounting-ledger]] — Club Management
  ledger ownership (draft, refined in-line by ADR-0061 §Map patch).
- [[ADR-0058-club-economy-commercial-impact-boundary]] — Commercial
  impact boundary (draft, refined in-line by ADR-0061 §Map patch).
- [[ADR-0019-modular-monolith-ddd]] — modular-monolith DDD ground
  rules.
- [[ADR-0027-postgres-data-model]] — per-save schema convention.
- [[ADR-0028-postgres-transactional-outbox]] — event delivery.
- [[ADR-0053-staff-operations-context]] — Staff Operations
  precedent (FMX-26 Customer-Supplier with Club ledger).
- [[ADR-0056-regulations-compliance-context]] — Regulations
  catalog ACL Tax-catalog pattern; FMX-32 commercial regulatory
  consumers follow same pattern.
- [[ADR-0057-rivalry-system-context]] — Rivalry scoring-context
  precedent; Audience & Atmosphere follows same pattern.
- [[ADR-0060-youth-academy-context]] — Youth Academy long-running-
  process precedent; CommercialPortfolio contract lifecycle Saga
  follows same canonical Vernon pattern.
- [[../../50-Game-Design/GD-0008-finance-economy]] — finance /
  economy binding gameplay GDDR.
- [[../../50-Game-Design/GD-0015-ip-clean-data]] — IP-clean
  hardline (vault-wide creative IP-safe naming directive).
- [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]] —
  commercial impact + contracts binding gameplay GDDR.
- [[../../50-Game-Design/stadium-and-campus]] — Stadium binding
  GDDR (`binding: true`).
- [[../../50-Game-Design/fan-ecology]] — Fan Ecology GDDR (`binding:
  false`).
- [[../../50-Game-Design/sponsorship-portfolio]] — Sponsorship
  GDDR (`binding: false`).
- [[../../50-Game-Design/matchday-event-engine]] — Matchday-Event-
  Engine binding GDDR (`binding: true`).
- [[../../60-Research/club-economy-impact-map-and-commercial-contracts-2026-05-28]] —
  FMX-41 Economy Impact Map research.
- [[../../60-Research/fan-demand-price-elasticity-2026-05-28]] —
  FMX-42 Fan Demand & Price Elasticity research.
- [[../../60-Research/season-ticket-lifecycle-and-accounting-2026-05-28]] —
  FMX-43 Season-Ticket Lifecycle & Accounting research.
- [[../../60-Research/commercial-contract-lifecycle-and-breach-model-2026-05-28]] —
  FMX-44 Commercial Contract Lifecycle & Breach Model research.
- [[../../30-Implementation/club-economy-commercial-contracts]] —
  Commercial contracts implementation spec.
- [[../../30-Implementation/club-economy-accounting-ledger]] —
  Ledger implementation spec.
- [[../bounded-context-map]] — target of §Map patch proposal.
- [[../../30-Implementation/domain-research-workflow]] — six-phase
  workflow that produced this ADR.
- Linear FMX-32 (audit) + Linear FMX-54 (Fan Ecology persona
  privacy & creative-IP-safe-naming follow-up).
