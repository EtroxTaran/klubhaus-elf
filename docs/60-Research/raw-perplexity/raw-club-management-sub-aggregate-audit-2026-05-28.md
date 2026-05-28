---
title: Raw - Club Management Sub-Aggregate Ownership Audit Research (FMX-32)
status: raw
tags: [research, raw, perplexity, club-management, stadium, fan-ecology, sponsorship, ticketing, commercial-portfolio, bounded-context, fmx-32]
created: 2026-05-28
updated: 2026-05-28
type: raw-research
binding: false
linear: FMX-32
sourceType: perplexity
related:
  - [[../club-management-sub-aggregate-audit-2026-05-28]]
---

# Raw - Club Management Sub-Aggregate Ownership Audit Research (FMX-32)

> Twelve Perplexity queries run during FMX-32 to support the boundary
> audit on four Club-Management sub-aggregate candidates: **Stadium /
> Venue Operations**, **Audience & Atmosphere** (formerly *Fan
> Ecology*), **CommercialPortfolio** (Sponsorship + Catering +
> Merchandise + Hospitality) and **Ticketing & Commercial Settlement**.
> Each candidate received three queries (Genre precedent / DDD
> authority / Real-world football operations 2023-2026). Raw input;
> not implementation authority. Synthesis at
> [[../club-management-sub-aggregate-audit-2026-05-28]].

## Why these queries

The 16-context map (`docs/10-Architecture/bounded-context-map.md`
§1 line 38, `binding: true`) lists Stadium/Venue Operations, Fan
Ecology and Sponsorship as sub-aggregates of **Club Management**.
Each, however, has visible own-FSM / own-loop / own-language signals
in `stadium-and-campus.md`, `fan-ecology.md`, `sponsorship-portfolio.md`
and `matchday-event-engine.md`. Drafts ADR-0050 (Club Economy
Accounting Ledger) and ADR-0058 (Club Economy Commercial Impact
Boundary) currently pre-commit all three to Club Management and add
Ticketing & Commercial Settlement as a fourth sub-aggregate.

The economy wave that landed 2026-05-27/28 (FMX-41 Economy Impact
Map, FMX-42 Fan Demand & Price Elasticity, FMX-43 Season-Ticket
Lifecycle & Accounting) pushed substantial new own-FSM and
own-published-contract surface onto exactly these four candidates.
FMX-32 is the natural moment to audit whether any should be promoted
from sub-aggregate to own bounded context.

Three queries per candidate target the boundary decision:

1. **Genre precedent** - how do leading football management sims
   2023-2026 (FM, EA FC Career Mode, OOTP, FIFA Manager, Anstoss)
   plus cross-genre analogues model the candidate? Is it a separate
   UI / data area with own lifecycle, or a sub-aggregate?
2. **DDD authority** - what is the canonical DDD pattern for the
   candidate's subdomain shape? Vernon, Evans, Fowler, Context
   Mapper, MS Learn references; real-world DDD analogues. Specifically:
   is "own loop independence" a Vernon split criterion?
3. **Real-world** - how is the candidate organised at top-tier
   European football clubs 2023-2026 (Bundesliga, Premier League, La
   Liga, Serie A, Ligue 1)? Reporting lines, KPIs, regulatory
   constraints, P&L independence.

---

## Candidate 1: Stadium / Venue Operations

### Query 1.1 - Genre precedent

**Prompt:** How do leading football management simulators 2023-2026
- Football Manager 23/24/25, EA Sports FC Career Mode 24/25/26, Out
of the Park Baseball 24/25/26, FIFA Manager legacy, Anstoss series -
model stadium and venue operations? Specifically: is matchday
operations (pitch condition, catering throughput, hospitality
inventory, fan-zone activation, security, weather impact) and
non-matchday operations (concerts, community days, conferences,
venue-event calendar, facility maintenance) a structurally separate
persistent area with its own UI/data surface inside the club model,
or buried inside the generic Club Management / Finance screens as a
sub-aggregate? Do they expose facility-decay, maintenance
scheduling, capacity-by-seat-class inventory, hospitality NPS or
pitch quality as first-class signals? Cite each sim's UI structure,
mod tools, save-format docs, official blogs and patch notes. Also
include cross-genre analogues for context: Anno 1800 production
buildings, Theme Park / Planet Coaster operational loops, Football
Chairman venue model, F1 Manager facility upgrades.

**Answer summary:** Stadium / venue operations in current sports
management sims are **mostly a sub-aggregate of generic Club /
Finances**, not a first-class bounded context.

- **Football Manager 23/24/25:** Stadium is a tab under Club ->
  Facilities with static attributes + upgrade buttons (capacity,
  seating/standing split, pitch type, roof, under-soil heating,
  corporate/TV facilities level, pitch condition). Matchday revenue
  is summarised under Finances. No event calendar per venue,
  no non-matchday events as revenue sources you explicitly schedule,
  no staffing levels / catering throughput / security as explicit
  entities, no capacity by block beyond crude seated vs standing,
  no hospitality NPS or per-concession performance. Mods like Mini
  Stadiums Superpack are pure ID-to-image mapping. Stadium is a
  rich entity, but Stadium Operations is not a separate bounded
  context.
- **EA Sports FC / FIFA Career Mode 24/25/26:** Stadium related
  actions live under Office / Finances / Club and cosmetic Stadium /
  Branding menus. Stadium menus let you change stadium model, seat
  colors, tifos, goal songs, pitch pattern - largely cosmetics. No
  navigable venue-operations interface with own state. Career mode
  UI is fundamentally player-squad-centric; stadium is asset
  attribute of the club.
- **OOTP 24/25/26:** Ballpark & Financials or Team Settings /
  Ballpark screen for stadium attributes (dimensions, park factors,
  capacity, roof / indoor, turf vs grass). Separate Finances &
  Tickets screen for budgets, ticket prices, attendance. Ballpark
  is a facet of team; no self-contained Venue Operations module
  with own workflows. No explicit maintenance schedules or facility
  decay; occasional construction / renovation events as news items.
- **FIFA Manager (10-14):** One of the few football series that tried
  a more detailed stadium & infrastructure model. Stadium &
  Facilities screens for building / upgrading stands (capacity, roof,
  comfort), VIP areas, restaurants, fan shops, parking, youth
  camps. Ticket prices per stand category. Facility decay and
  maintenance cost system (higher quality facilities have ongoing
  costs; old stands can be renovated or demolished). But all of
  this is inside Club Infrastructure menus, tightly coupled to
  financial and fan-mood models. No explicit non-matchday event
  scheduling.
- **Anstoss series:** Similar to FIFA Manager — stadium expansion,
  VIP boxes, rename stands, detailed ticket prices, safety
  measures, catering, fan comfort as settings. Maintenance / upkeep
  as periodic costs. All under Club / Infrastructure / Stadium menu
  cluster. No separate non-matchday event system.

**Cross-genre analogues:**
- **Anno 1800:** Each production building has own input / output
  logic, production time, workforce type, upkeep cost,
  attractiveness, dedicated building UI. Operations are core
  gameplay → Production / Logistics is clearly a separate bounded
  context.
- **Theme Park / Planet Coaster:** Park / venue is the product. Rides
  and shops have capacity per cycle, throughput, queue time,
  reliability, maintenance status, staff allocation, guest
  satisfaction metrics, pricing. Maintenance explicit (breakdowns,
  scheduled inspections). NPS-like guest satisfaction per ride / area.
  Full venue ops promoted to own context.
- **F1 Manager (Frontier):** Dedicated Facilities / HQ screen for
  car development facilities (wind tunnel, CFD, design centre) and
  race operations facilities (hospitality, simulator, boardroom,
  memorabilia) with level, build / upgrade time, cost, running cost,
  sometimes decay. Facilities affect sponsor attractiveness, staff
  development, car R&D efficiency. Race-weekend operations are NOT
  themselves simulated as entities; facilities modify high-level
  KPIs. Facilities as separate screen and process but still under
  Team Management bounded context.
- **Football Chairman (mobile):** Stadium upgrades as discrete
  upgrades with construction times and maintenance costs. Matchday
  income impacted by capacity, ticket prices, success but no
  detailed operational modelling.

**Implication for FMX-32.** Empirical genre precedent is mixed: all
five football management sims treat Stadium as sub-aggregate under
Club / Finance, with FIFA Manager and Anstoss having the most
explicit decay / maintenance model. Cross-genre evidence
(Theme Park, Anno, Planet Coaster) shows promotion to own context
happens when operations are *the* gameplay product. F1 Manager is
the closest analogue where facilities are richer than FM/EA but
still sub-aggregate of Team Management.

**Confidence:** medium-high (multiple converging sim references,
clear pattern across the football-sim cluster).

**Sources cited:** fmscout.com / Stadiums Revolution mod docs,
sortitoutsi FM 2025 databases, footballmanager.com features pages,
ESSMA stadium industry news 2026, en.wikipedia.org European stadiums
capacity list, sportcal.com UEFA finals tender, footballbenchmark.com
European Champions Report 2026.

---

### Query 1.2 - DDD authority

**Prompt:** What is the canonical Domain-Driven Design pattern for a
"physical venue / facility operations" subdomain in long-running
simulation games or operations-intensive enterprise systems?
Specifically: when an operations area has (a) its own finite-state
machine (matchday timeline preparation -> doors-open -> kickoff ->
halftime -> settlement -> reset), (b) its own scheduled loop
(facility decay weekly, maintenance project lifecycle), (c) its own
KPIs (utilisation %, hospitality NPS, pitch quality index),
(d) multi-context consumers (Match consumes capacity,
Matchday-Event-Engine consumes facility triggers, Regulations
consumes compliance, Club Management consumes ledger inputs) - but
financial settlement still posts to a parent Finance / Club ledger -
what is the canonical DDD move? Options: (a) Sub-aggregate inside
parent Finance BC; (b) Hybrid named Aggregate Root with published
contract surface; (c) own bounded context. Compare Vaughn Vernon
IDDD (operations-subdomain classification + Customer-Supplier +
ACL), Evans Blue Book, Fowler bliki, Context Mapper, MS Learn,
Schimak / Rücker process-manager literature. Real-world DDD
analogues: hotel PMS (Opera, Mews), theme-park-attraction ops,
retail-store ops, facilities-management (CMMS systems like IBM
Maximo, Infor EAM).

**Answer summary:** Canonical DDD move is **(c) its own bounded
context**, modelled as a **supporting "Operations / Venue
Operations" subdomain** that integrates with the Club Management /
Finance context via **Customer-Supplier + Anti-Corruption Layer
and/or domain events**, not as a sub-aggregate of Finance.

**1. Strategic DDD fit: subdomain & bounded context classification.**

Venue ops has all hallmarks of a separate subdomain with its own
bounded context:
- Distinct language: doors open, kickoff, halftime, settlement,
  reset; utilization; decay; maintenance work orders; compliance
  inspections — not Finance / Club Management vocabulary.
- Own complexity & rules: own FSMs, scheduled loops, KPIs,
  regulatory / compliance rules.
- Multi-context consumers: Match, Matchday-Event-Engine, Regulations,
  Club Management / Finance — cross-cutting usage.

Evans Blue Book ch. 5 "Subdomains" separates Core / Supporting /
Generic; physical facility ops in a football manager world is a
**supporting subdomain** (essential, complex, business-specific, not
the strategic differentiator vs squad management and tactics).

Vernon IDDD ch. 9 "Subdomains" and ch. 10 "Context Mapping" makes
the same point: each subdomain gets one or more bounded contexts
with high internal cohesion and clear external contracts.
Operations-style models are classic candidates for supporting
bounded contexts consumed via well-defined interfaces.

MS Learn microservices DDD guidance: model each cohesive area of
business responsibility as one or more bounded contexts and warn
against bundling state machines into another context "just because"
data is related.

**Strategic design summary:**
- Subdomain: Venue / Facility Operations → Supporting subdomain.
- Bounded context: Venue Operations BC (or Stadium Operations BC).
- Club Management & Finance remains a separate bounded context,
  likely in the core domain.

**2. Why not "sub-aggregate inside Finance"?**

Aggregates are consistency boundaries for clusters of entities /
value objects modelled around invariants that must hold
transactionally. Venue / facility has:
- Own lifecycle and invariants ("cannot open doors if safety
  inspection failed", "cannot schedule maintenance in a time slot
  reserved for a match", "pitch quality cannot fall below X without
  triggering regulation alarms").
- Own time-driven behaviour (weekly decay, maintenance lifecycle)
  proceeding independently of financial postings.
- Multiple consumers wanting to collaborate without coupling to
  Finance model.

Embedding as sub-aggregate inside Finance would force Finance's
aggregate to know about operations state machine details, violating
cohesion and single responsibility; or bloating aggregates; or using
Finance aggregates as "entity bags" for unrelated behaviour (Vernon
strongly advises against).

MS Learn tactical DDD: aggregates should be small and cohesive;
cross-cutting processes and workflows should be modelled via
sagas / process managers, not by stretching aggregate boundaries.

So option (a) contradicts both tactical (aggregate cohesion) and
strategic (context boundaries) DDD.

**3. Why not "hybrid named aggregate inside parent BC"?**

Useful inside one BC to modularize, but does not address the
strategic mismatch:
- Club Management / Finance uses budgets, ledgers, cashflow,
  insolvency, FFP rules, board pressure.
- Venue Operations uses slot schedules, capacity, maintenance work
  orders, matchday readiness, safety compliance, hospitality
  quality.

Evans and Vernon both clear that when ubiquitous language and
invariants diverge, the clean move is a separate bounded context.
Retrofitting as "special aggregate" inside another BC results in
confused language, overcoupled release cycles, difficulty evolving
operations logic independently. From Context Mapping point of view,
the right capture is Customer-Supplier and / or Conformist
relationships, not nested aggregate roots. Vernon uses
Customer-Supplier + ACL for cases where one context supplies
critical data to another operational context while preserving
distinct models.

(b) is at best a transitional solution when contexts cannot yet be
split; it is not canonical DDD.

**4. Canonical pattern: own BC + Customer-Supplier & ACL.**

Using Vernon terminology:
- Venue Operations BC = Supplier of capacity & availability to
  Match / Matchday BC, triggers / events / signals to
  Matchday-Event-Engine, compliance & inspection results to
  Regulations BC.
- Club Management / Finance BC = Customer of settlement amounts,
  usage statistics, facility-related costs and revenues from Venue
  Ops.
- Customer-Supplier relationship between Club Management and Venue
  Ops: Finance depends on inputs but does not dictate the model.
- Anti-Corruption Layer on Customer side (Finance) to adapt Venue
  Ops concepts ("hospitality event X with sales Y and comped
  tickets Z") to ledger postings and financial events.

This matches Vernon Customer-Supplier and ACL chapters: keep each
BC's model pure; translate via ACL to shield the customer from
supplier model changes; optionally have the supplier publish domain
events that the customer consumes.

**5. Tactical modelling inside the Venue Operations BC.**

- Aggregate roots:
  - Venue / Stadium aggregate with FSM:
    `Preparing → DoorsOpen → InPlay / Kickoff → Halftime →
    SettlementPending → Reset`.
  - Possibly separate aggregates for MaintenanceProject / WorkOrder
    with own lifecycle.
- Scheduled loop:
  - Implement via Process Manager / Saga (Schimak / Rücker process
    managers) or application service that kicks off weekly decay,
    progresses maintenance lifecycles, schedules inspections.
- KPIs:
  - Some derived from domain events (MatchPlayedAtVenue,
    HospitalityBookingCompleted, MaintenanceCompleted).
  - Others persisted value objects or projections / read models.
- Multi-context consumers:
  - Match / Matchday BC: consumes capacity & availability;
    Reserve capacity / Schedule match at slot X commands.
  - Matchday Event Engine: subscribes to venue state changes
    (DoorsOpened, Kickoff, Halftime, VenueReset).
  - Regulations BC: consumes compliance events
    (SafetyInspectionFailed, CertificationExpired); may issue
    commands back (Close section, Reduce capacity).
  - Club Management / Finance: subscribes to settlement / cost /
    revenue events and translates to ledger postings.

**6. Real-world analogues confirm.**

- Hotel PMS (Opera, Mews): Separate product / context from
  Accounting / General Ledger. PMS manages room inventory,
  housekeeping, check-in / out, maintenance with own language and
  state machines. Financial postings exported to accounting via
  interfaces — Customer-Supplier + ACL.
- Theme park attraction operations: Ride ops / scheduling /
  maintenance distinct system from park accounting. Safety
  inspections, ride availability, queue management, capacity in
  operations BC feeding financial and analytics.
- Retail store ops: Store operations, inventory & fulfilment
  separate contexts from financial accounting. Store ops produces
  events accounting translates into financial postings.
- Facilities management / CMMS (IBM Maximo, Infor EAM): handles
  assets, maintenance plans, work orders, inspections. Integrates
  with ERP / Finance via interfaces, not as module inside the
  ledger.

All reflect the same DDD shape: ops as own BC with lifecycle state
machines, resource scheduling, maintenance and decay processes,
KPIs and compliance data; Finance / Core management contexts
consume summarized or transformed information via contracts and
translation layers, not via shared aggregates.

football-manager-x venue context is analogous to PMS / CMMS
relative to an ERP's Finance module.

**Concrete recommendation:**

1. Define "Venue Operations" as own bounded context, part of a
   supporting subdomain ("Infrastructure / Facilities Operations").
2. Inside Venue Ops BC: Venue / Stadium aggregate with matchday FSM,
   capacity & configuration, hooks to maintenance / inspections;
   MaintenanceProject / WorkOrder as separate aggregates if needed;
   process managers for scheduled decay and maintenance.
3. Between Venue Ops and Club Management / Finance: domain events
   (`MatchHostedAtVenue`, `HospitalityEventCompleted`,
   `MaintenanceExpenseIncurred`, `SettlementCalculated`); ACL on
   Finance side translating into ledger entries / cashflows / FFP /
   board pressure inputs. Customer-Supplier relationship.
4. Between Venue Ops and other BCs (Match, Matchday Engine,
   Regulations): Context Maps documenting Customer-Supplier,
   Conformist, optionally Shared Kernel.
5. Keep Finance aggregates focused on financial invariants only.

Options assessment:
- (a) Sub-aggregate inside Finance BC: avoid.
- (b) Hybrid aggregate root inside parent with contract surface:
  only if forced to keep single deployment; still mentally treat as
  separate BC and plan to extract.
- (c) Own bounded context: **canonical DDD move**.

**Confidence:** high (Vernon, Evans, MS Learn all converge; multiple
real-world enterprise analogues).

**Sources cited:** deviq.com / domain-driven-design / subdomain,
microservices.io physical-design-ddd-socal, learn.microsoft.com
azure architecture microservices model domain-analysis, vaadin.com
ddd strategic-domain-driven-design, javapro.io strategic-DDD missing-link,
microsoftpressstore.com article 3192407, en.wikipedia.org
Domain-driven_design.

---

### Query 1.3 - Real-world football operations

**Prompt:** How are stadium and venue operations organised at
top-tier European football clubs 2023-2026 (Bundesliga, Premier
League, La Liga, Serie A, Ligue 1)? Org structure (Head of Stadium /
Venue General Manager / Matchday Director / Director of Stadium
Operations / Director of Facility Management — reporting to CEO,
CFO, COO or Sporting Director?), KPIs (utilisation %, no-show %,
dwell time, hospitality NPS, pitch quality index, non-matchday event
nights / year, facility-cost per matchday), regulatory boundaries
(UEFA Stadium Infrastructure Regulations 2024, Premier League Ground
Regulations + Sustainability Strategy 2030, DFL Lizenzhandbuch
facility category, FA EPPP Cat 1-4 venue requirements, Green Guide /
Sports Grounds Safety Authority, EU CEN-EN 17210), independence
(separate stadium companies / venue P&L vs sub-functions of broader
Club Operations / Finance). Cite specific clubs (Bayern Munich,
Borussia Dortmund, FC Barcelona, Real Madrid, Manchester City,
Manchester United, Liverpool FC, Tottenham Hotspur, Inter Milan).

**Answer summary:** Top-tier European clubs typically organise
**stadium / venue operations as a non-sport, business-side function
reporting into CEO / COO or a Business Operations / Operations
board member, not into the Sporting Director.** Within that, there
is often a **dedicated stadium / arena company** (e.g. Bayern,
Dortmund, Spurs) with its own management and P&L, covering
maintenance, matchday, and non-matchday events.

**1. Org structure — pattern across 2023-2026:**

- Board member for operations / business / infrastructure (or CEO)
  owns stadium / venue.
- Sporting director / director of football has **no** line
  responsibility for stadium operations.
- Matchday operations (security, stewarding, access, crowd
  management, safety officer) sit inside stadium / operations
  function but heavily regulated by league / national authorities;
  often matrix links to security & legal.
- Non-matchday events (concerts, conferences, NFL games, tours)
  either in a separate stadium company with own MD / CEO (Bayern,
  Dortmund, Spurs) or run by Commercial / Events working closely
  with Stadium Operations (Liverpool, Man City, Barça, Madrid).

Where titles differ (Director of Stadium Operations, Venue General
Manager, Facilities Director) they almost always sit below a C-level
operations / business leader, **not** Finance or Sporting, although
budgeting and capex approval involves CFO.

**Club-specific:**

- **Bayern Munich (Allianz Arena):** Owned and operated by
  **Allianz Arena München Stadion GmbH**, a subsidiary of FC Bayern
  München AG. Stadium company headed by Managing Director / CEO
  reporting into FC Bayern AG Vorstand for operations / finance, not
  the sporting board member. Stadium operations (facility
  management, maintenance, security, matchday operations) sit
  within this GmbH; non-matchday events also run there. Head of
  Facility Management / Stadium Operations reports to stadium GmbH
  MD; MD reports to FC Bayern AG CEO / Vorstand Operations.
  **Implication: Allianz Arena is effectively its own bounded
  context** with internal sub-domains (facility, matchday operations,
  events).

- **Borussia Dortmund (SIGNAL IDUNA PARK):** Stadium operations
  bundled in **BVB Stadionmanagement GmbH**, a wholly owned
  subsidiary of Borussia Dortmund GmbH & Co. KGaA. Responsible for
  all stadium infrastructure and matchday operations including
  maintenance, safety, access control, non-matchday use. Own
  Geschäftsführer reporting to business / operations board member,
  not sporting director. **Same pattern as Bayern: stadium
  structurally separated with own management and accounting.**

- **Real Madrid (Santiago Bernabéu):** Real Madrid CF operates the
  Bernabéu directly but has created a joint venture with **Legends
  and Sixth Street** to commercialise stadium revenues, including
  non-matchday events. Governance splits between fútbol and
  patrimonio / estadio; Director de Infraestructuras / Estadio
  reports into Managing Director / CEO side, not sporting. New
  Bernabéu non-matchday programming (concerts, NFL / other sports,
  events, hospitality) handled by dedicated stadium business unit
  working with Legends, separate from team sporting operations.
  Matchday safety and stadium operations part of operations /
  infrastructure area under Director of Operations / Stadium;
  revenue optimisation jointly with commercial JV.
  **Implication: Real Madrid treats stadium as strategic
  commercial asset with JV arrangements; operationally an
  operations / infrastructure context, not sporting.**

- **FC Barcelona (Spotify Camp Nou / Espai Barça):** Structure
  distinguishes "Área de Ingresos" from "Área de Infraestructuras y
  Patrimonio", with stadium works and facilities under the latter.
  Espai Barça project governed by dedicated project organisation
  reporting to CEO and Board; stadium operations report into
  Operations / Infrastructure area. Matchday operations within
  operations area; non-matchday events and tours co-managed with
  Commercial. **No indication Sporting Director has line authority
  over stadium / venue.**

- **Manchester City (Etihad Stadium / CFA):** City Football Group
  structures operations in Manchester around "Operations" and
  "Infrastructure & Facilities", under COO / Managing Director.
  Etihad Campus (stadium + City Football Academy) facilities
  management, maintenance and matchday operations report into
  Operations / Infrastructure function. Non-matchday events handled
  jointly by Stadium Events / Venue team and Commercial; operations
  (safety, cleaning, catering logistics) stay within Operations.
  Sporting director limited to football performance and recruitment;
  **clear separation between sport and venue operations.**

- **Manchester United (Old Trafford):** Stadium operations and
  facilities under Chief Operating Officer (or same board member
  for Venue and Events). Venue function covers Old Trafford
  operations, safety, non-matchday events; hospitality partly
  outsourced to catering partner but overseen by Venue / Operations.
  Stadium tours and museum are revenue items under commercial,
  operations delivered by venue operations team. Matchday Director /
  Safety Officer reports to Head of Stadium Operations and
  ultimately to COO; not Football Director.

- **Liverpool FC (Anfield):** Stadium Operations / Facilities under
  VP or Director of Operations reporting to Managing Director / CEO.
  Anfield matchday operations (stewarding, access control, safety)
  within Stadium Operations; non-matchday events and tours run by
  dedicated "Anfield Events" / hospitality team aligned with
  Commercial. Expansion projects (Main Stand, Anfield Road Stand)
  managed by stadium development project team under Infrastructure /
  Capital Projects reporting to board, separate from sporting.

- **Tottenham Hotspur (Tottenham Hotspur Stadium):** Operated by
  dedicated internal Stadium / Venues division under board member
  for Operations / Venues. NFL partnership for two NFL games per
  year coordinated by Stadium Director working with dedicated
  Non-Football Events & NFL liaison team. Own commercial event
  business (concerts, boxing, F1 karting, conferences) with P&L
  responsibility. Catering / hospitality largely operated in-house
  with some partner relationships. **One of the clearest examples
  of venue operations as its own business context** (multi-sport,
  multi-event, independent revenue model).

- **Inter Milan (San Siro & planned new stadium):** Stadio Giuseppe
  Meazza (San Siro) owned by City of Milan; Inter and Milan are
  tenants. Internal Matchday & Operations unit reporting to COO /
  CEO. For planned new stadium projects, Inter positions stadium
  business as separate future asset with dedicated project and
  future operating company; as of 2023-2026 still mainly tenancy
  model.

**2. KPIs:**

- **Utilisation %:** Average home attendance as % of stadium
  capacity. Bundesliga and Premier League clubs often target >95%.
  Internal ops teams break into ticketed vs scanned attendance
  (no-shows).
- **Non-matchday utilisation:** Event days / nights per year +
  conference / banqueting days + stadium tour days. Spurs, Real
  Madrid, Bayern track number of non-football event days. ESSMA /
  Stadiaworld benchmarks highlight non-matchday event nights as key
  KPI.
- **No-show rate:** Many large clubs now monitor tickets sold vs
  turnstile entries because it affects atmosphere, secondary spend,
  regulatory reporting. Particularly in England; fan-engagement and
  ticketing platforms.
- **Dwell time and per-capita spend:** Stadium ops + commercial
  teams track dwell time using turnstile and POS timestamps to
  optimise staffing, concourse congestion, F&B per head. Hospitality
  / premium areas have separate KPIs for length of stay and spend
  per guest.
- **Hospitality / fan satisfaction: NPS & surveys:** Premier League
  Fan Surveys, internal club surveys use NPS or equivalent for
  hospitality customers and general admission fan experience.
- **Pitch quality indices:**
  - Premier League / FA: FA Pitch Grading System; Playing Surface
    Committee + match officials effectively rate pitches; poor
    pitches lead to improvement requirements.
  - Bundesliga / DFL: pitch panel + technical requirements in
    Lizenzhandbuch (heating, drainage, grass type); pitches
    monitored throughout season.
- **Non-matchday event nights per year:** Spurs (concerts, NFL,
  boxing, rugby, motorsport-style), Real Madrid (concerts, basketball,
  corporate at new Bernabéu), Bayern + Dortmund (concerts,
  corporate, stadium tours) via stadium GmbHs.
- **Facility cost per matchday:** Stadium ops track OPEX per event /
  per match (direct matchday OPEX + allocated facility costs).
  Public documents rarely show per match; stadium-specific
  subsidiaries (Allianz Arena GmbH, BVB Stadionmanagement GmbH)
  report total operating expenses.

**3. Regulatory boundaries 2023-2026:**

- **UEFA Stadium Infrastructure Regulations 2024:** Stadium
  categories 1-4 with requirements for hosting UEFA competition
  matches. Cat 4 (CL / EL / Conference League later stages + finals)
  detailed requirements on capacity (with updated minimums for
  finals from 2026), safety and security, pitch dimensions and
  quality, dressing rooms / media, VIP / hospitality, lighting, VAR
  infrastructure. UEFA decided May 2023: finals from 2026 onward
  only Cat 4 stadiums with specific minimum capacities.
- **Premier League Ground Regulations + Sustainability Strategy
  2030:** Each PL club must comply with PL Handbook requirements +
  Ground Regulations posted at each stadium. PL Environmental
  Sustainability Strategy 2030 covers lower carbon emissions,
  improved energy efficiency and waste management, fan travel and
  resource management.
- **DFL Lizenzhandbuch:** Facility and stadium requirements for
  Bundesliga / 2. Bundesliga clubs (minimum stadium capacity,
  floodlighting, undersoil heating, camera platforms, media
  workspaces, safety control room, segregated sectors). Stadium
  compliance is licensing precondition. DFL sustainability focus
  expanding in recent editions.
- **FA EPPP Cat 1-4 venue requirements:** Mainly training grounds
  but includes pitch and training venue standards for Cat 1-4
  academies. Stadium / match venues for youth / U23 matches must
  meet standards, often overseen by same facilities management team
  as first-team stadium.
- **Green Guide / Sports Grounds Safety Authority (SGSA):** UK
  "Guide to Safety at Sports Grounds" by SGSA is core reference for
  stadium safety management. Defines required Safety Management
  arrangements (Safety Officer, safety policy, steward training),
  capacity calculations, entry / exit routes, crush barriers,
  emergency planning and command structures. Compliance enforced
  via Safety Certificates granted by local authorities.
  **Parallel regulatory sub-domain that stadium operations must
  satisfy.**
- **EU CEN-EN 17210:** European standard for accessibility of built
  environment including stadiums (accessible seating and viewing
  points, accessible routes, toilets, services, signage,
  wayfinding, information). Many leagues + national associations
  reference or align accessible stadia policies with EN 17210;
  major stadium projects (new Bernabéu, Espai Barça, Anfield Road
  expansion, Spurs) have documented commitments.

**4. Independence and P&L:**

Clear cases of separate stadium companies / P&L:
- **Bayern Munich — Allianz Arena München Stadion GmbH:** Separate
  legal entity, maintains own P&L and balance sheet consolidating
  into FC Bayern München AG. Facility maintenance, matchday
  operations, non-matchday events; shared services for HR / IT /
  finance.
- **Borussia Dortmund — BVB Stadionmanagement GmbH:** Separate GmbH
  responsible for stadium management. Owns operational
  responsibilities and costs; receives rental / usage fees from
  the club. Manages non-matchday events and stadium tours,
  effectively a venue business unit.
- **Tottenham Hotspur — Stadium business:** Not always presented as
  stand-alone company; in practice stadium run as its own business
  line emphasised by NFL partnership, concerts, motorsport-style
  events, F&B / hospitality focus. Own Executive / Stadium Director.
  In internal reporting club disaggregates stadium revenues
  (matchday, non-matchday, NFL) with associated costs.
- **Real Madrid — Bernabéu commercial JV with Legends / Sixth
  Street:** Stadium exploitation (non-football events, hospitality,
  tours) partially carved out into commercial joint venture with
  own revenue-sharing model. Operationally stadium facilities
  remain within club infrastructure area; commercial rights and
  event programming have quasi-separate P&L at JV level.

Clubs where stadium is major but internal division:
- **Manchester United:** Old Trafford operated within club but
  "matchday, venue & events" reported as distinct revenue line.
  Venue / Stadium Operations sub-function within Club Operations /
  COO. **Combination of distinct KPIs, processes, external
  regulatory constraints support treating it as its own bounded
  context.**
- **Manchester City:** Etihad Campus (stadium + CFA) managed
  centrally; operations & facilities distinct function. Stadium
  tours / events as product line under commercial; rely on
  operations & facilities. **Strong candidate bounded context even
  if not separate legal entity.**
- **Liverpool FC:** Anfield operations and non-matchday events
  ("Anfield Events") managed as distinct business line within
  broader club entity. Stadium expansion projects separate capex
  programmes.
- **FC Barcelona / Inter Milan:** Barça stadium within
  Infrastructure / Patrimonio with huge capex and specific stadium
  revenue lines (museum, tours). Future Espai Barça planned similar
  to Madrid and Spurs as diversified venue business. Inter as San
  Siro tenant has limited control; new stadium plans envisage
  dedicated stadium company.

Catering / hospitality:
- In-house vs outsourced: Spurs, new Bernabéu, several Bundesliga
  clubs run much of hospitality & catering in-house or via JVs,
  tightly linking to stadium operations. Others use major catering
  partners (Delaware North, Sodexo, Levy) but maintain Hospitality /
  Catering Management function inside the club to specify service
  standards and manage the partner.
- DDD: catering / hospitality has own menu of services, pricing,
  quality / NPS metrics, contracts; integrates with both
  Stadium / Venue context (for operations) and Commercial context
  (for sales).

**DDD implications — should Stadium / Venue Operations be its own
bounded context?**

Empirically 2023-2026:
- Top clubs either create dedicated stadium companies / business
  units (Bayern, Dortmund, Spurs, Real's JV), or
- at least run Venue / Stadium / Facilities as a clearly separated
  functional area with specialist regulation, KPIs and processes
  (United, City, Liverpool, Barca, Inter plans).

Key reasons supporting **promoting Stadium / Venue Operations from
sub-aggregate to own bounded context:**
1. Distinct ubiquitous language (Safety Certificate, Green Guide
   compliance, UEFA Category 4, Safety Officer, turnstile scans,
   ingress / egress curves, stewarding plans, pitch grading,
   event day operations).
2. Strong external regulatory subdomain (UEFA Stadium Infrastructure,
   DFL Lizenzhandbuch, PL Handbook, SGSA / Green Guide, EN 17210,
   local safety legislation impose hard invariants independent of
   sporting decisions).
3. Different core KPIs (safety, availability, utilisation, fan
   experience, pitch quality, operating cost per event — not the
   same as sporting KPIs or pure financial KPIs).
4. Frequent legal / structural separation (separate GmbHs, JVs,
   explicit venue P&Ls).
5. Integration points rather than shared models (Ticketing / CRM,
   Commercial, Finance, Football — own model and boundaries,
   sharing only well-defined contracts / events).

Audit can justifiably argue that in top-tier European club setting
**Stadium / Venue Operations is best treated as its own bounded
context**, potentially subdividing into Safety & Compliance,
Matchday Operations, Facilities & Maintenance, Non-Matchday Events,
Hospitality & Catering.

**Confidence:** high (multiple clubs with separate legal entities,
multi-regulator framework documented).

**Sources cited:** essma.eu stadium industry news 2026, youtube.com
match references, sportcal.com UEFA opens tender for club competition
final hosting 2026-2027, en.wikipedia.org European stadiums by
capacity, stadiaworld.com focus-data, espn.com UEFA picks bigger
stadiums Conference League finals, footballbenchmark.com European
Champions Report 2026.

---

## Candidate 2: Audience & Atmosphere (Fan Ecology)

### Query 2.1 - Genre precedent

**Prompt:** How do leading football management sims 2023-2026
(FM 23/24/25, EA Sports FC Career Mode 24/25/26, OOTP 24/25/26,
FIFA Manager legacy, Anstoss series) model fan ecology — supporter
segments, atmosphere engine, loyalty / mood dynamics, fan politics
(choreo / protest / boycott / call-for-ouster), price sensitivity
and ticketing-trust state? Is fan ecology a structurally separate
persistent area with own UI / dashboard / weekly tick, or buried
inside Club Management economy / board screen? What cadence? Per
segment vs aggregate? Multi-input atmosphere engine? Price elasticity
per segment? Fan politics triggers? Cross-genre: Total War Three
Kingdoms court, Crusader Kings III vassal opinion, Civilization VI
Loyalty, Cities Skylines districts mood, Stardew Valley town-friendship,
NBA 2K MyGM fan-base influence.

**Answer summary:** Football management and strategy sims mostly
treat **fans as a single aggregated variable** ("supporter
confidence", "fan happiness") embedded in club / economy / reputation
systems, **rather than a structurally separate, persistent "fan
ecology" context** with own rich lifecycle and segment-level state.
Where segmentation exists (FM Supporter Confidence) it is coarse
with limited mechanical consequences; protest / boycott / atmosphere
systems are scripted or rule-of-thumb add-ons, not full bounded
contexts.

**1. Football Manager 2023-2026:**

- Supporter Profile / Confidence lives under Club Info → Supporters
  and Club Vision / Club Supporter Confidence screens, **not** as
  standalone "Fans" top-level area (it sits beside Board, Finances).
  In DDD terms: fan ecology embedded into Club Management /
  Reputation & Finances aggregates, not own bounded context.
- Cadence: **event-based** updates after matches and key events;
  some medium-term attributes have monthly / seasonal updates.
  No publicly documented "weekly supporter tick".
- Segmentation: FM24/25 Supporter Profile explicitly introduces fan
  segments (Hardcore, Core, Family, Fair-weather, Corporate, sometimes
  Casual) with simple derived traits but **does not expose per-segment
  numeric state**. Aggregates to global Supporter Confidence bar
  with sub-bars + descriptor. FM models multiple supporter cohorts
  but **flattens output** into global confidence metrics.
- Atmosphere: mostly cosmetic + simple modifiers (matchday
  presentation reacts to match type, sell-out, goal events).
  Rivalries / derbies boost attendance and chant variety; form /
  league position feed attendance and supporter confidence;
  weather mostly affects attendance / injuries. **No exposed
  atmosphere value formula.** Mechanically feeds back into home
  advantage and ticket sales via reputation / form.
- Price elasticity: ticket prices board-controlled; manager rarely
  sets directly. No visible per-segment elasticity curve. No fan
  "trust state" around price gouging. No concept of "fans remember
  3 seasons of aggressive pricing" beyond generic reputation.
- Fan politics: limited scripted events ("calling for your head",
  protesting poor form or controversial moves) as narrative items
  impacting job security and board confidence. **No explicit
  mechanics** for ticketing boycotts beyond generic low attendance,
  no organising choreo / tifos as a system, no protest banners
  with explicit trigger thresholds. **Emergent narrative over
  global supporter / board confidence variables, not stateful
  fan-politics engine.**

**2. EA Sports FC / FIFA Career Mode (24/25/26):**

- Single "Fan Happiness" / "Fan Confidence" metric in broader
  Manager Rating / Critical Success Factors area, alongside Board
  Confidence and Brand / Financial objectives. **No dedicated
  Fanbase tab.** Embedded into generic Manager Rating / Club
  Objectives aggregate.
- Cadence: event-based after matches and objective milestones.
- Segmentation: **none.** Single fan satisfaction / manager
  popularity rating, sometimes broken down by competition (Domestic
  Success, Continental Success, Brand Exposure) but these are
  *board* categories not supporter cohorts.
- Atmosphere: primarily presentation system; crowd volume / chants
  vary with match type, scoreline, home / away. Home field
  advantage statistical, **not exposed as simulational atmosphere
  stat.** No multi-input atmosphere engine UI or design doc.
- Price elasticity: **no granular control** over ticket prices.
  Financials show gate receipts as function of matches and club
  size. No fan trust or price sensitivity variables.
- Fan politics: press / board commentary about "fans are unhappy"
  tied to manager rating; **no boycott / choreo planning**;
  fully abstracted into manager rating system.

**3. OOTP 24/25/26:**

- Closer to what you are thinking of, but still falls short.
- Fan Interest (0-100) and Fan Loyalty (Low / Normal / High) on
  Team Home / Finances screens, plus Market Size, Owner Personality,
  Team Popularity. **Part of financial model, not separate Fans
  module.** No dedicated Supporter Dashboard.
- Cadence: event-based after significant events; influences season
  ticket sales, single-game attendance, merchandise each game / season;
  OOTP runs daily tick for financial projections using these values.
  Effectively **continuous at game's daily simulation granularity**
  with discrete jumps from key events.
- Segmentation: single Fan Interest number + Fan Loyalty descriptor.
  **No segmentation** into ultras / family / corporate analogues.
  Some implied via Market Size + demographics but not exposed.
- Atmosphere: not modelled; focus on attendance / financial impact.
- **Price elasticity: relatively detailed.** Set ticket prices, game
  calculates attendance response using fan interest, loyalty, market
  size. Overprice → attendance falls. Underprice → fill seats but
  lower revenue. Fan loyalty and interest have **persistence**:
  winning seasons or exciting signings raise; decay after poor
  seasons. **Crude trust / memory mechanism.** No segment-level
  elasticity.
- Fan politics: only news items modify Fan Interest. No explicit
  boycotts / protest banners / organised politics.

**4. FIFA Manager (legacy 13/14 era):**

- Fan data in Club → Finances & Stadium + Club Environment panel
  showing Fan Mood + sometimes Fan Expectation. No dedicated
  top-level Fans module but more fan-facing options than FIFA
  Career Mode (marketing, fan shops, ticket categories, stadium
  expansions).
- Cadence: event-based after matches and ticket price / transfer
  changes.
- Segmentation: ticket categories (standing, seating, VIP); some
  versions distinguish Family stands — **seat-type segments, not
  psychological cohorts.** Fan mood mostly single aggregate bar.
- Atmosphere: basic "Stadium Atmosphere" concept driven by stadium
  expansion + fan mood + match importance + occupancy; affected
  home advantage in simple way.
- Price elasticity: changing ticket prices affects attendance and
  fan mood directly; repeated overpricing → sustained low mood +
  lower season ticket sales. **Global fan mood, not per-segment.**
- Fan politics: narrative events about fan demonstrations / banners
  / protests as cut-scenes; impact club image / occasional board
  pressure.

**5. Anstoss series:**

- Fan data appears in Club → Stadium / Finances with Attendance,
  Fan Mood, textual fan reactions. **No standalone fan dashboard;
  rolled into economy / club reputation areas.**
- Cadence: event-based.
- Segmentation: single population; mini-games mention "hardcore
  supporters" without mechanical segmentation.
- Atmosphere: match commentary mentions; some versions allow
  investment in Stadium Atmosphere upgrades (loudspeakers).
- Price elasticity: ticket price sliders directly affect attendance
  + fan mood; repeated high prices → lower long-term attendance.
  **Global.**
- Fan politics: scripted fan protests with humorous outcomes.
  **Discrete events, not ongoing political simulation.**

**6. Cross-genre analogues:**

- **Total War Three Kingdoms — Court loyalty / Public Order:**
  Per-commandery stat influenced by taxes, characters, buildings,
  corruption, garrisons, events. Represents "people's mood" and
  drives **rebellions**. Updates each turn. In DDD terms,
  separate "Public Order" context with own UI panels, separate
  from economy / warfare though tightly coupled.

- **Crusader Kings III — Vassal Opinion:** Each vassal has Opinion
  score influenced by traits, actions, religion, culture, hooks.
  Updates event-based + daily tick via passive modifiers. Low
  opinion → factions, rebellion, plots. **Segment-level loyalty
  system** (each vassal effectively cohort) inside clear "Vassal &
  Realm Politics" bounded context.

- **Civilization VI — Loyalty:** Each city has Loyalty score
  influenced by nearby cities, governors, amenities, policies,
  Golden / Dark Ages, occupied status. Loyalty ticks each turn;
  too low → rebels / flips. **Discrete loyalty subsystem with own
  UI and explicit formulas.**

- **Cities: Skylines — District mood / Happiness:** Citizens and
  districts have Happiness influenced by services, taxes, noise,
  pollution, traffic. Continuous updates. **Population categories**
  (residential, commercial, industrial, offices) effectively act as
  segments with own response curves to services and taxes.

- **Stardew Valley — Town friendship:** Each villager has
  Friendship points influenced by gifts, dialogue, quests, events.
  Event-based + daily decay. **Each NPC as segment with own state
  and unlocks** in own Relationship context.

- **Football Chairman:** Fan base stat changes with results,
  signings, ticket prices, facilities. Largely single aggregate
  but more prominent fan UI than FIFA Career Mode.

- **NBA 2K MyGM / MyLeague — Fan interest:** Fan Interest + Team
  Chemistry metrics in Franchise → Finances / Team Information.
  Updates after games and transactions. Aggregate, not segmented.

**7. Mapping to your design decision:**

- Across football sims listed: **none** have truly separate
  "Fan Ecology / Audience & Atmosphere" bounded context with own
  full navigation entry and lifecycle. Closest is FM Supporter
  Profile & Confidence — still nested under Club Info / Vision as
  sub-aggregate of "Club Reputation & Expectations". OOTP closest
  in mechanical consequence but conceptually inside Finances
  aggregate.
- **If wanting fan ecology first-class: going beyond industry
  standard, not following it.**
- Cross-genre analogues (CK3, Civ, Cities, TW) treat analogous
  systems (vassal / city loyalty, public order, citizen happiness)
  as separate but strongly coupled bounded contexts. **If design
  goal is depth comparable to CK3 / Civ / Cities rather than
  FM / EA**, Audience & Atmosphere should be own bounded context.

Given features you listed (segment-specific mood / loyalty,
atmosphere engine, fan politics, price-trust dynamics) **naturally
cluster together, have own ubiquitous language (segments / choreo /
boycott / trust / atmosphere), have distinct lifecycle and rules**.
That strongly argues for treating **Audience & Atmosphere as own
bounded context**, even though current football management sims
mostly do not.

**Confidence:** medium-high (clear convergence on aggregate-fan
pattern in football sims; strong cross-genre precedent for
segmented loyalty as own context).

**Sources cited:** fmscout.com FM26 features, youtube.com FM /
Football coverage videos.

---

### Query 2.2 - DDD authority

**Prompt:** What is the canonical Domain-Driven Design pattern for
"audience scoring / customer-affinity / loyalty-and-churn"
subdomains in operations-intensive systems? When a subdomain owns
(a) per-segment cohort model with individual cohort state (loyalty,
mood, volatility, attendance probability), (b) own scheduled
weekly-tick atmosphere / mood loop independent of parent ledger
week, (c) own multi-input scoring formula (price sensitivity ×
loyalty × volatility × fixture attractiveness × trust state), (d)
publishes rich read model to 4-7 consumers (Finance / Club, Rivalry
scoring, Match-Event Engine, Notification, Manager & Legacy),
(e) emits fan-incident events to separate Rivalry scoring context —
but never writes parent ledger directly — what is canonical DDD
move? Options: (a) Sub-aggregate inside parent Finance / Club BC;
(b) Hybrid named Aggregate Root with published contract surface;
(c) own bounded context. Compare Vernon IDDD scoring-context +
customer-loyalty + Customer-Supplier with ACL, Evans, Fowler bliki
credit-scoring + recommendation, Context Mapper, MS Learn. Real-world
analogues: Net Promoter / loyalty platforms (Salesforce Marketing
Cloud, Braze, Iterable, Klaviyo, HubSpot CDP); Credit scoring
(Schufa, Experian, FICO Falcon); Streaming engagement scoring
(Spotify / Netflix recommendation, YouTube watch-time); Retail
customer-affinity (Amazon, Tesco Clubcard); Loyalty programs
(airlines miles, hotel point systems). Is "weekly loop independence"
one of Vernon's split criteria? Where in IDDD?

**Answer summary:** This "Audience & Atmosphere" is **not** a
sub-aggregate of Club / Finance; it is a **separate bounded context**
with supplier role and explicit contracts to Club Management,
Rivalry, Notifications. Canonical DDD move is **(c) own bounded
context**, very likely a **supporting subdomain** containing one or
more aggregate roots for cohorts and incidents.

**1. How DDD would classify "Audience & Atmosphere":**

Subdomain owns:
- Own conceptual model (segment cohort, loyalty, mood, volatility,
  attendance probability).
- Own simulation cadence (weekly tick independent of ledger tick).
- Own domain-specific algorithms (multi-input scoring formula).
- Publishes rich read model to 4-7 consumers and emits own domain
  events.
- Never writes parent ledger; interaction via read models / events /
  contracts.

**That is exactly what strategic DDD calls a separate bounded context
with Customer-Supplier relationship and ACL at the edges, rather than
an aggregate buried inside another BC.**

- Evans defines bounded contexts as boundaries within which a model
  applies and Ubiquitous Language is consistent (Blue Book ch. 14
  "Maintaining Model Integrity"). Within Club Management "fan"
  likely means ticket purchaser / seat holder / revenue line; in
  Audience & Atmosphere it means "cohort member with volatility and
  mood". **That alone is a classic split signal.**
- Vernon emphasizes BC boundaries drawn where there are different
  models, different language, different life cycles, different
  consistency needs — not just different tables (IDDD ch. 3
  "Strategic Design with Subdomains and Bounded Contexts").

Subdomain classification:
- **Not core** to running matches (Club / Match / Finance is core)
  but strategically valuable.
- Closer to a **supporting subdomain**: supports decision-making,
  pricing, notifications, rivalry modelling via scoring and
  predictions (Vernon IDDD ch. 3 Core / Supporting / Generic).
- Tactically an **Analytical / Scoring / Recommendation context**
  similar to credit scoring or recommendation engines.

→ option (c) own bounded context is the DDD-aligned classification.

**2. Why not sub-aggregate inside parent Club / Finance?**

To be sub-aggregate of Club / Finance, scoring state would need to
share:
- Same transactional boundaries (same invariants, same consistency
  rules).
- Same lifecycle (created / updated / archived with parent).
- Same Ubiquitous Language ("fan" means same in both).

A&A violates all three:
1. Different invariants / consistency model. Club / Finance =
   financial correctness, board approval, regulatory reporting.
   A&A = probabilistic state, prediction quality, mood dynamics,
   churn propensity. These do not belong in same aggregate. Vernon
   IDDD ch. 10 Aggregates: aggregates enforce one cluster of
   invariants, small with clear transactional rules.
2. Different lifecycle and cadence. Club / Finance's key ticks are
   ledger postings, fixture confirmations, board cycles. A&A runs
   weekly atmosphere loop updating cohort state even if nothing in
   ledger changed. Vernon repeatedly calls out **differing life
   cycles** and "independent evolution" as signals for separate
   aggregates and, at strategic level, separate bounded contexts
   when models diverge (IDDD ch. 5 + ch. 7).
3. Different model and language. A&A introduces volatility,
   attendance probability, mood — pollutes Finance's model if
   embedded directly. DDD aim is to localize specialized models,
   not produce mega-aggregates (Evans ch. 5).

Option (a) violates both tactical (aggregate) and strategic
(bounded context) guidance.

**3. Why not "hybrid named aggregate root with contract surface"?**

The hybrid is really a **tactical choice inside a bounded context**,
not a substitute for the BC split itself:
- Within the **Audience & Atmosphere BC** you have one or more
  aggregates (Cohort, Segment, FanIncident). These expose **domain
  services**, API operations, and **domain events** as a contract.
- Other BCs (Club, Rivalry, Notification) consume via
  Customer-Supplier relationship with ACL (Vernon IDDD ch. 7 Context
  Mapping).

(b) is correct tactically but **assumes you already chose (c) at
the strategic level**. More precise:
- Audience & Atmosphere is its own bounded context.
- Inside it the audience scoring model is implemented as one or
  more aggregate roots and exposed via a stable published language
  (Open Host Service / ACL).

**4. Comparison with real-world analogues:**

Use these as litmus test:

- **Net Promoter / customer-loyalty platforms (Salesforce Marketing
  Cloud, Braze, Iterable, Klaviyo, HubSpot CDP):** Real-world
  classification = separate bounded contexts / separate products.
  ERP / CRM / booking is the "Club Management" analogue; loyalty /
  marketing clouds run separate scoring / segmentation / campaign
  models and integrate via events and APIs. Own cadence (daily or
  intra-day recompute, campaign schedules) independent of invoice /
  ledger closure. DDD: supporting subdomain / Marketing & Loyalty
  BC with Customer-Supplier to Sales or Club Management. → A&A
  behaves like Salesforce Marketing Cloud.

- **Credit-scoring services (Schufa, Experian, FICO):** Fowler
  explicitly treats credit scoring as own bounded context or
  external subsystem that upstream domains call into. Bank core
  ledger does not embed FICO as aggregate; calls scoring BC or
  external service. Vernon uses similar Customer-Supplier + ACL
  examples. → Separate BC, supplier of scores to ledger BC.

- **Streaming engagement scoring (Spotify / Netflix / YT):**
  Recommendation / ranking / watch-time optimization in separate
  "Recommender" BC with own ML pipelines, data model, scoring
  schedule, feeding Playback / Catalog / Billing contexts. Own
  cadences (batch, near-real-time), feature flags, experimentation.
  → A&A is a **football-stadium recommendation & engagement BC.**

- **Retail customer-affinity scoring (Amazon, Tesco Clubcard):**
  Separate Marketing / Analytics / Affinity contexts with own
  schema (cohorts, segments, RFM scores, propensity to buy) and
  own job schedules (nightly, per-event). **Do not live inside
  Order aggregate.** Textbook supporting subdomains.

- **Loyalty programs (airlines, hotels):** Split into two patterns:
  - Ledger-like points accounting (earn, spend, liabilities) —
    often separate "Loyalty Ledger" BC.
  - Scoring / tier / churn / campaign — marketing / scoring BC,
    connected via context mapping.
  A&A looks more like the **second**: loyalty state, volatility,
  mood, attendance probability rather than points liabilities.
  Pushes strongly toward separate scoring BC.

**5. Weekly loop independence: is it a Vernon split criterion?**

Vernon does NOT use the phrase **"weekly loop independence"**, but
he repeatedly uses **different life cycles / different process
rhythms / separate transactions and policies** as criteria for
drawing bounded contexts and aggregates:

- IDDD ch. 3 "Strategic Design with Subdomains and Bounded
  Contexts": split contexts when models use different terminology
  with different goals; different teams need to evolve models
  independently; the model supports different business processes
  and life cycles.
- IDDD ch. 5 "Discovering Bounded Contexts": processes with
  distinct process flows and update rhythms should not be forced
  into same model; create separate contexts and define
  relationships.
- IDDD ch. 7 "Context Mapping": Customer-Supplier and Separate
  Ways assume each side may have **own cadence and schedule**;
  supplier must manage own model and availability.

Translating to A&A:
- Club Management tick = ledger posting, fixture creation, budgeting
  cycles.
- A&A tick = weekly simulation loop over cohorts, potentially
  influenced by but not synchronized with ledger events.

Falls under Vernon's **"different life cycles and process rhythms"**
criterion as **informal rule:** if the model needs to update on its
own schedule, independently of parent's transactions, **consider
a separate BC.** (IDDD ch. 3 & 5; ch. 10 for aggregate transaction
boundaries.)

So:
- **Yes:** cadence independence is a split signal in Vernon's sense
  (different life cycle / process).
- **No:** he does not label it "weekly loop independence" by name;
  part of more general "different life cycles and invariants"
  guidance.

**6. Other Vernon split criteria firing for A&A:**

1. **Different Ubiquitous Language / model.** Terms: cohort,
   atmosphere, mood, volatility, fixture attractiveness, fan
   incident. Not natural residents of Club / Finance model. Vernon
   IDDD ch. 3: different language → different model → different BC.
2. **Different team / expertise / algorithmic complexity.** A&A
   likely sits with data / ML or behavioral modeling experts;
   Club / Finance with financial, board, operations stakeholders.
   Vernon IDDD ch. 3 + ch. 8: team boundaries and required
   knowledge as major drivers.
3. **Different non-functional concerns and tech stack.** A&A may
   need experimentation, ML features, batch / computation,
   specialized storage. Club BC = more transactional, strongly
   consistent, RDBMS-centric. Vernon IDDD ch. 3 + ch. 6: different
   persistence or deployment needs as split signal.
4. **Context-mapping role: Customer-Supplier with ACL.** A&A
   supplies scores to Club / Finance, Rivalry, Notification,
   Manager UIs. Club = customer, A&A = supplier. Rich read model
   to 4-7 consumers matches Vernon's **Open Host Service + Published
   Language + ACL** pattern (IDDD ch. 7). Exactly the
   scoring / loyalty / subscription example.
5. **Independently evolving scoring formula.** Your formula
   evolves frequently; Club ledger rules relatively stable. Vernon
   IDDD ch. 3: highly changeable, complex rules benefit from own
   model and BC to evolve without breaking core. Evans ch. 15
   "Distillation" makes same point.

When lined up, A&A hits almost every strategic split signal Vernon
calls out.

**7. Description for the audit:**

- Parent context: **Club Management BC** (subdomains Finance,
  Board Governance, Fixture & Ticketing, High-level Fan Relations).
  Responsibilities: ledgers, budgets, contracts, board decisions,
  regulatory outputs.
- Candidate subdomain: **Audience & Atmosphere BC** (supporting
  subdomain).
  Responsibilities:
  - Maintain cohort-level fan state (loyalty, mood, volatility,
    attendance probability).
  - Run independent weekly atmosphere loop.
  - Apply scoring formulas (price sensitivity, fixture
    attractiveness, rivalry intensity, trust).
  - Publish rich read model (scores, segments, incidents) to Club
    Management (pricing / board), Rivalry & Incident BC, Match
    Event Engine, Notification / Campaign BC, Manager UI & legacy
    integrations.
  - Emit fan-incident domain events consumed by Rivalry Scoring BC;
    never write Club ledger.
- Context-mapping:
  - **Customer-Supplier:** Club Management, Rivalry, Match,
    Notification are customers of A&A scoring + state.
  - **ACL / Open Host Service:** A&A exposes stable read model &
    events; other BCs translate via ACL.

Short classification line:
> **Audience & Atmosphere** — supporting bounded context (scoring /
> loyalty & atmosphere) with own model and weekly simulation
> lifecycle; acts as Customer-Supplier to Club Management and
> Rivalry through published read model and events; does not
> participate in ledger transactions.

**8. Mapping to authorities:**

- **Vernon IDDD:** scoring / loyalty context pattern as supporting
  BC providing scores back to core domain (ch. 3 & 7);
  Customer-Supplier with ACL (ch. 7); split criteria met (different
  language, different life cycles, different invariants, separate
  evolution, different tech concerns).
- **Evans DDD:** bounded contexts where models diverge especially
  analytic vs transactional (ch. 14); Distillation / supporting
  domains for advanced analytics separate from core (ch. 15).
- **Fowler bliki (credit-scoring, recommendation):** credit scoring
  and recommendation engines as separate contexts; core systems
  call into them and interpret results. **Analytical or external
  subsystems**, not aggregates of transactional core.
- **Context Mapper / MS Learn DDD:** split BCs where there is
  different Ubiquitous Language, different responsibilities,
  different teams / technology. A&A fits supporting BC supplying
  scores to core BC, reachable via context map.

**9. One-sentence practical guideline:**

> Whenever a subsystem runs its own time-based simulation or
> scoring loop, holds its own inferential / behavioral state,
> exposes scores / read models / events to multiple consumers, and
> does not share transactional invariants with the ledger, DDD
> treats it as a separate bounded context (often supporting /
> analytical "scoring" or "recommendation" context), not as
> sub-aggregate of the parent ledger context.

**Confidence:** high (Vernon, Evans, Fowler, MS Learn all converge;
multiple commercial-grade real-world analogues).

**Sources cited:** alexhyett.com domain-driven-design, axoniq.io
concepts ddd, mirkosertic.de blog 2012 ddd overview, learn.microsoft.com
archive msdn-magazine 2009 ddd intro, vaadin.com blog ddd strategic,
dev.to peholmst strategic-ddd.

---

### Query 2.3 - Real-world football operations

**Prompt:** How are fan engagement, supporter relations and
ticketing-trust functions organised at top-tier European football
clubs 2023-2026? Org structure (Head of Fan Engagement, SLO
UEFA-mandated, Director of Membership, Director of Ticketing &
Membership, CRM Director — reporting to CEO, CMO, CFO or Commercial
Director?), KPIs (renewal rate, NPS, atmosphere score, choreo
budget, boycott escalation tier, complaint volume, fan-incident
frequency), regulatory + best-practice baseline 2023-2026 (UEFA
Club Licensing FSR SLO requirement reinforced 2024, DFB-DFL
Sicherheitsfaktoren + SLO-Konzept, Premier League Independent Fan
Advisory Boards mandated 2024-2025, DSA Art. 16, GDPR Art. 6 lawful
basis season-ticket-holder vs casual purchaser, GDPR Art. 9
special-category data ultras affiliation), independence (Bayern
Fanbeauftragten, BVB Fan- und Förderabteilung, FC St. Pauli
Vereinsvorstand-level fan power). Cite specific clubs (Bayern,
BVB, Barça, Liverpool, United, City, Inter, Atlético, PSG, FC St.
Pauli).

**Answer summary:** Top-tier European clubs typically **do not run
fan engagement as a fully independent unit**; more often embedded
in *Commercial*, *Marketing*, *CRM / Customer Experience*, or
*Communications*, while the **SLO** function is the clearest
regulatory exception (typically handled through formal fan-relations
or safety interface rather than pure marketing).

> ⚠️ **Caveat from Perplexity:** the available search results did
> not include club annual reports, UEFA / DFL / PL regulatory texts
> or club organograms needed to support detailed club-by-club
> reporting lines, KPI definitions and legal citations. The available
> results were mostly general fan-engagement platform articles and
> did not substantiate club-specific governance facts. The answer
> below is therefore **inference from general patterns + best
> practice**, not source-grounded for specific clubs.

What can be said safely from the available material:

- **Fan engagement commonly treated as commercial / digital
  capability** aimed at loyalty, content, and revenue uplift,
  consistent with placement under Marketing, Commercial, or CRM
  rather than as an autonomous support function.
- Specific clubs named (Bayern, BVB, Barça, Liverpool, United, City,
  Inter, Atlético, PSG, FC St. Pauli) require club documents or
  official staffing pages to verify whether relevant roles report
  to CEO, CMO, CFO or Commercial Director; current search results
  do not provide that evidence.
- Fan-owned / fan-led governance such as **FC St. Pauli** is
  conceptually distinct from investor-led clubs, but the provided
  results do not include official governance documents needed to
  describe its current board-level fan power with precision.

**Provisional DDD boundary model:**

- **Fan Ecology / Supporter Relations:** own unit if club has
  dedicated supporter engagement office, SLO coordination,
  community / fan governance, complaints and matchday liaison.
- **Ticketing Trust:** usually sub-domain of Ticketing, CRM, or
  Revenue Operations, covering season tickets, allocation rules,
  fraud, refund policy, dispute handling.
- **Fan Engagement Platform / Digital Engagement:** usually under
  Marketing, Content, or Commercial — app, CRM segmentation,
  loyalty, monetisation.

**Regulatory questions (UEFA Club Licensing + FSR SLO, DFL /
DFB Sicherheitsfaktoren / SLO-Konzept, PL Independent Fan Advisory
Boards, DSA Art. 16, GDPR Art. 6 / 9) cannot be responsibly
asserted without additional sources** beyond the search results.

**Confidence:** low (Perplexity flagged sourcing gap explicitly).
Treat as orientation only; FMX-32 synthesis must cross-reference
with vault notes that already capture some of these regulatory
positions (e.g. ADR-0050 commentary on board pressure; ADR-0057
on rivalry / fan-incident; pre-mortem PM-2026-05-20-08 legal /
consumer-law / tax; PM-2026-05-20-13 community moderation).

**Sources cited:** cortextech.io best fan-engagement platforms,
seedblink.com future of football empowering fans through ownership,
worldfootballindex.com fan engagement, en.wikipedia.org list
fan-owned sports teams, efcfootball.com European Football Clubs +
EA Sports FC announcement, wefunder.com fan-owned-club, pwc.com
industries tmt digital fan engagement.

---

## Candidate 3: CommercialPortfolio (Sponsorship + Catering + Merchandise + Hospitality)

### Query 3.1 - Genre precedent

**Prompt:** How do leading football management sims 2023-2026
(FM 23/24/25, EA Sports FC Career Mode 24/25/26, OOTP 24/25/26,
FIFA Manager legacy, Anstoss series) model commercial contracts —
sponsorship, kit / jersey deal, stadium naming rights, catering /
merchandise rights, hospitality packages, fan-event campaigns? Is
commercial contract lifecycle (Available → Negotiating → Active →
Renewing → Terminated, with side-conditions, exclusivity categories,
performance bonuses, asset valuation formulas) a structurally
separate persistent area with own UI + portfolio dashboard, or
aggregated into single sponsor-value slider? Cross-genre: OOTP
ad-deal lifecycle, F1 Manager sponsor portfolio, Motorsport
Manager partner system, NBA 2K MyGM / MyLeague endorsement deals,
Cities Skylines specialised industry contracts.

**Answer summary:** Almost all listed games treat sponsorship and
commercial income as **aggregated financial parameters**, not as a
first-class persistent "contract lifecycle" subsystem with own
portfolio UI. Where explicit deals exist (notably motorsport games
and some basketball / F1 modes) they are mostly limited to a small
roster of sponsors with simple conditionals and expiry dates — not
a DDD-worthy CommercialPortfolio bounded context comparable to
player contracts or transfers.

**1. Football Manager 23/24/25/26:**

Reasonably rich club finance and club vision model but **commercial
contracts not modelled as first-class individually inspectable
contract objects** in UI.

- Sponsors / Sponsors income / Corporate & Hospitality income as
  line items + graphs in Finances → Income / Projection.
- News items: "Main kit sponsorship deal set to expire" or "New
  sponsorship deal signed"; one-shot increases in projected
  sponsorship income; but **no contracts index** (list of all
  sponsor deals with start / end, value, bonuses, clauses), **no
  negotiation UI**.
- Sponsorship effectively **emergent parameter managed by AI
  board**, similar to TV money + prize money — not a subsystem you
  can architect over.
- Treats sponsorship as **aggregate scalar** ("Sponsorship income
  per year" + "Corporate / Hospitality income per year"), not
  CommercialContract aggregate with lifecycle semantics.

Lifecycle answer: not exposed as Available → Negotiating → Active →
Renewing → Terminated objects. Only resulting cash flows; negotiation
abstracted by board.

Side-conditions: FM has detailed clauses around player contracts +
transfers (appearance bonuses, goal bonuses, loyalty bonuses,
minimum fee release, sell-on percentage) exposed in fully-fledged
contract UI — but those are on **employment + transfer contracts**,
not commercial sponsors. **No UI for sponsor side-conditions**
(youth-focus minimums, family-friendly image, continental
qualification, no controversial signings). Such constraints exist
in **Board / Club Vision** as separate bounded context with own
rules.

Asset inventory: **none.** No configurable slots for jersey
front / sleeve / shorts / training, no stadium naming / stand
naming controlled by sponsorship UI, no LED boards / app banners /
fan-zone activations as discrete objects.

Performance bonuses, breach penalties, valuation formulas:
**none exposed for commercial deals.**

Catering, merchandising, hospitality: abstracted into Corporate &
Hospitality income + Match Day Commercial & Retail income. No
choice between in-house vs concession vs revenue-share. Board
actions sometimes "Improve corporate facilities" or stadium
expansions changing projected corporate / hospitality income, but
**no contract-design UI.** From DDD viewpoint: catering / merchandise /
hospitality as derived financial flows driven by facilities,
fanbase size, reputation, competition.

**2. EA Sports FC / FIFA Career Mode 24/25/26:**

Very thin commercial layer:
- Sponsors / objectives in some iterations as seasonal objectives
  granting budget / XP, not persistent sponsors with contracts.
- Club side mostly shows Budget, Revenue, Expenses with high-level
  categories. **No sponsor-contract portfolio screen.**
- Sponsor-like objectives implemented as simple goals ("Sell X
  shirts", "Finish at least Y", "Reach knockout stage"). Not modelled
  as contract clauses attached to specific sponsors.
- Asset inventory: **none.** Stadium naming rights as explicit
  deals: no. Catering / merchandise business model choices: no.
  Merchandising as single scalar "Shirt Sales".

**3. OOTP 24/25/26:**

More detailed financial model but sponsorship still **not
first-class negotiable contract family.**
- Core finance engine: media contracts, local / national TV,
  attendance, merchandising, optionally custom financials via
  league settings.
- Team focus, budgets, owner goals exist; sponsors not managed as
  individual deals via contract UI in standard game.
- Third-party mods or custom leagues can script aspects; shipped
  UI: commercial revenue as collection of aggregated scalars.
- No lifecycle UI, no explicit asset inventory, no catering model
  choice.

**4. FIFA Manager (legacy 10-14):**

Did more on club-business side than modern FM.

- Sponsorship screen lists available sponsors with contract term +
  yearly amount.
- Choose main shirt sponsors, secondary sponsors, sometimes stadium
  ad deals.
- See expiries and renew / replace via sponsor selection UI in
  Office / Finances area.
- Closer to **portfolio dashboard** than single slider but still
  relatively simple.
- Lifecycle: essentially **Offered → Signed (Active) → Expires.**
  Renewal via replacement; **no multi-stage negotiation**
  (counter-offers, clause editing).
- Side-conditions: rudimentary (occasionally sponsor requiring
  league level). Not clause-rich behavioural constraints.
- Asset inventory: named slots (shirt sponsor, stadium sponsor,
  perimeter advertising) filled from offers but not granular.
- Performance bonuses: existed mostly as "higher offer if club is
  successful" — no per-contract bonus clause editor.
- Catering, merchandise, hospitality as separate management areas
  (build / upgrade fan shops, stadium catering); **no explicit
  contract model** — infrastructure investments leading to revenue
  multipliers.

→ FIFA Manager comes closest to treating Sponsorship as
**sub-aggregate under Club Finances**: minimal portfolio of deals
but not enough complexity to justify own bounded context.

**5. Anstoss series:**

Structurally similar to FIFA Manager:
- Sponsor selection screen presenting offers for main sponsor and
  sometimes additional sponsors.
- Choose contract length + payout.
- Lifecycle: **Offer → Selected (Active) → Expiry**, occasional
  mid-term renegotiation events.
- No deep clause system or side-conditions beyond league level or
  performance.
- Mainly main sponsor (jersey / club) and maybe stadium
  advertisement, not full asset inventory.
- Catering / merchandise managed via facilities and pricing, not
  contract objects.

**6. Cross-genre:**

- **F1 Manager (Frontier):** Sponsors section in Finances or Staff /
  Team HQ. Typically Title Sponsor + multiple Sponsors with
  contract length, fixed payment, **per-race performance incentives**
  (finish X or better, qualifying in top Y, both drivers
  finishing). Displayed as discrete sponsor tiles / cards with
  progress bars per race / season. Lifecycle: sign for N seasons →
  Active → renew or sign new. UI clearly shows active contracts,
  remaining term, objectives. Negotiation simple (select from
  offers); structurally **persistent portfolio with own screen and
  state machine.** Side-conditions = performance objectives,
  triggering bonus / penalty if unmet. No image / brand-alignment,
  youth-development, asset-level allocation. **DDD mapping:**
  Sponsor Portfolio close to candidate bounded context or at least
  rich sub-aggregate.

- **Motorsport Manager:** Sponsor slots on car and race series
  (primary + secondary sponsors). Each offer card: upfront and / or
  per-race payment, **bonus for finishing at / above position,**
  contract length. Dedicated Sponsorship screen showing all current
  contracts, remaining races, available new offers. Accepting fills
  specific slot. Expiry → slot available again. Side-conditions:
  performance-based + region / series exclusivity. Asset inventory
  mild (slots represent physical car / signage locations). **Excellent
  analogue for CommercialPortfolio as sub-aggregate** with own
  rules and UI separate from team staff, drivers, car development.

- **NBA 2K MyGM / MyLeague / MyNBA:** Commercial side in two ways:
  - **Franchise finances:** ticket prices, merchandise sales,
    local / national media revenue, luxury tax. Aggregated like
    OOTP.
  - **Endorsements (MyCAREER):** player gets endorsement deals
    with shoe companies + brands — contract length, payout
    structure, performance / popularity targets. Dedicated
    Endorsement screen with current deals + progress tracking.
    **Player-centric, not club-wide commercial portfolios.**
    Side-conditions = generic targets, not structural clauses about
    conduct or youth strategy.

- **Cities Skylines — specialised industry & service contracts:**
  Industry / trade contracts but resource / industry not sponsorship.
  Some mods or DLC service policies with private operators (supply
  contracts: selling goods, mail, power) but not brand / marketing
  sponsors. **Not close analogue** to commercial sponsorship
  portfolios.

**7. Implications for DDD bounded-context decision:**

- **Football / baseball sims (FM, EA FC, OOTP)** keep sponsorship
  as derived financial attributes within broader Club Finances
  context. No first-class contract aggregates. Player has almost
  no control. Commercial flows react to other contexts (Reputation,
  Competition Success, Facilities) rather than drive them.
- **Classic "business-heavy" football managers (FIFA Manager,
  Anstoss)** implement sponsorship as small sub-aggregate of Club
  Finances. Simple portfolio (handful of deals, no complex
  clauses). Tight coupling to club status and finances. No separate
  notion of sponsor-side policy or obligations beyond performance.
- **Motorsport titles (F1 Manager, Motorsport Manager)** elevate
  sponsorship to something approximating **own sub-domain**:
  dedicated UI(s), explicit contract entities with lifecycle
  (duration, slot, objectives), behavioural rules less about
  finance per se and more about sponsor relationships and
  risk / reward.
- **No mainstream sim** models unified "CommercialPortfolio"
  jointly tracking Sponsorship + Catering + Merchandise +
  Hospitality contracts as separate bounded context.

Industry precedent:
- For football / baseball: **CommercialPortfolio stays sub-aggregate
  under Club / Finances** because complexity is modest relative to
  Transfers, Squad / Player contracts, Tactics.
- Only when **intentionally increasing contract complexity**
  (multiple assets, explicit clauses, negotiation, reputational
  constraints, breach handling) and giving dedicated UI + decision-
  making loop (F1 / Motorsport) does it become candidate for
  separate bounded context.

If FMX-32 design goal = match or slightly exceed FM / OOTP / EA FC:
keep CommercialPortfolio as **sub-aggregate of Club Management /
Finances**. If goal = innovate toward richer sponsor-asset-contract
simulation with described features: CommercialPortfolio carries own
ubiquitous language (Assets, Packages, Activations, Exclusivities,
Obligations, KPIs), rules differ substantially from other club
operations, architecturally + cognitively cleaner to **promote to
own bounded context.**

**Confidence:** medium-high (football-sim cluster clear, motorsport
analogues clear, FMX-32 commercial scope explicitly richer than FM).

**Sources cited:** fmscout.com FM2023 hints, youtube.com FM coverage,
footballmanager.fandom.com Contract, footballmanager.com features
smarter-transfers-squad-building-and-finance.

---

### Query 3.2 - DDD authority

**Prompt:** What is the canonical Domain-Driven Design pattern for
"contract lifecycle / portfolio management / partner relationship"
subdomains in long-running enterprise systems? When a subdomain
owns (a) contract FSM (Available → Negotiating → Active → Renewing →
Terminated + Cool-down), (b) side-condition catalog with breach
detection, (c) asset inventory taxonomy, (d) multi-input asset
valuation formula (reach × brand safety × utilisation × fan profile
× media resonance × exclusivity premium), (e) exclusivity graph,
(f) renewal-window policy, (g) breach-resolution Process Manager —
but financial settlement still posts to a parent Finance / Club
ledger — what is canonical DDD move? Options: (a) Sub-aggregate
inside parent Finance BC; (b) Hybrid; (c) own bounded context.
Compare Vernon IDDD (contract-aggregate, Process Manager / Saga
for breach, Customer-Supplier with ACL), Evans, Fowler, Context
Mapper. Real-world: Salesforce CRM + CPQ; SAP Commercial Contract
Management / SAP S/4HANA Sales Contract; Stripe Connect platform;
Insurance policy lifecycle (Guidewire PolicyCenter); Telecom
subscription (Amdocs, Netcracker); Advertising exchanges (Google Ad
Manager, The Trade Desk publisher contracts); Media-rights &
broadcasting contracts. (i) when contract lifecycle is independent
of ledger week-tick, own loop alone warrant BC? (ii) small contract
count (30-50) vs richness counter-signal? (iii) canonical industry
pattern = sub-aggregate of Finance or own Commercial Operations / CLM
BC?

**Answer summary:** Canonical DDD move = **(c) own bounded context**
— a **Commercial Contracts / Contract Lifecycle Management BC** —
integrated with Finance as a separate **Customer-Supplier**
relationship (with an ACL if needed), not a sub-aggregate of
Finance. Within that BC, the "contract" is an **Aggregate Root**
with a Process Manager / Saga for breach / resolution and renewal
workflows, and Finance treats it as an external upstream system
that posts settlement events or ledger entries.

**1. Vernon & Evans slice:**

Contract subdomain owns contract lifecycle FSM, rich policy / side-
condition model + breach detection, asset inventory / taxonomy of
rights, valuation model, exclusivity graph, time-based renewal
windows independent of ledger tick, Process Manager / Saga for
breach resolution. Finance is only ledger / settlement sink.

In IDDD Vernon is explicit that **contract management, policy
lifecycle, subscription lifecycle, and similar "commercial
operations" domains are separate bounded contexts from the general
ledger / finance context.** He repeatedly shows examples where:
- Order Management, Shipping, Invoicing, Accounting are separate
  BCs even when sharing concepts like money and customer.
- Policy / contract lifecycle and claims distinct from billing and
  accounting in insurance and telecom examples.

Evans Blue Book: "A bounded context is not drawn around databases
or UI layers but around a coherent domain model and its ubiquitous
language." Model has extremely different language from Finance
(rights, slots, exclusivities, activations, brand safety) →
**own BC, not Finance sub-aggregate.**

Strategic patterns in both Evans and Vernon → Contract Lifecycle /
Commercial Operations BC; Finance is separate BC consuming
settlement events.

**2. Vernon's split criteria (IDDD Part II + Strategic Design
chapter):**

- Different Ubiquitous Language.
- Different lifecycle / invariants.
- Different consumers and use cases.
- Different performance characteristics / transaction models.
- Team ownership and autonomy.

Contract BC ticks all of these:
- Language: contracts, rights packages, assets, exclusivity,
  valuation, youth-focus, brand-safety scoring.
- Lifecycle: contract-term driven; Finance is ledger-period driven.
- Invariants: no two breweries, exclusivity graph, breach
  conditions — unrelated to ledger balancing invariants.
- Workflows: negotiation, re-pricing, breach resolution, renewal —
  business-process-heavy and long-running; ledger postings discrete,
  transactional.

→ Exactly the "split here" signature in IDDD.

**3. Aggregate vs BC decision in IDDD:**

**Why not sub-aggregate in Finance?** Vernon aggregate rules:
- Aggregate enforces cohesive set of invariants in single
  transactional boundary.
- Should be small, focused on truly-must-be-consistent invariants.
- Should not be bloated for reporting or across-subdomain concerns.

Contract invariants ("No two breweries in overlapping asset
categories", "youth-focus and brand-safety thresholds must be
satisfied", "renewal offers and breach resolution must follow
particular state transitions") are **not Finance invariants**.

Finance invariants: ledger balanced, posting rules for revenue
recognition + accruals obeyed, tax + accounting policies per
jurisdiction.

Embedding contract lifecycle inside Finance:
- Huge Finance aggregate with wide invariant surface.
- Coupling expensive business-heavy workflows to lean predictable
  ledger.
- Difficulty evolving contract semantics independently.

**Precisely what Vernon warns against**: aggregates that conflate
multiple domain purposes and become change magnets.

**Why not "just" Finance hybrid?** Option (b) "named Aggregate Root
with published contract surface" is what Vernon would still call
**its own Aggregate Root in its own BC** with public API / domain
events. Once language diverges, **you have effectively defined a
separate bounded context**, even if sharing repository or database
technically.

Vernon Customer-Supplier and Conformist (IDDD ch. 7): supplier BC
holds complex model; customer BC (Finance) depends on simplified
representation via ACL, published language, or domain events. Not
sub-aggregates of each other; independent contexts.

→ Canonical: **Contract is Aggregate Root in Contract BC that
supplies Finance.** Finance maintains local simpler model of
"contract settlement obligations" if needed.

**4. Answers to specific questions:**

### (i) "Own loop" alone warrant own BC?

**Alone: no. In combination with clearly distinct model and
invariants: yes.**

Vernon does not say "independent loop → automatic new BC" as
binary. But uses lifecycle independence as **strong split signal**
when:
- The lifecycle drives its own business value and decision-making.
- The invariants and language around it are distinct from those of
  other context.

Contract lifecycle is **term-boundary driven** (renewal windows,
cool-downs, breach detection) — not tied to Finance's week or
month tick. That is **one of several strong signals** for distinct
model.

Given richness of contract model + independence from ledger
invariants: exactly the kind of "own loop + own language + own
invariants" that Vernon uses to justify separate BC + often
separate service.

- Own loop alone: not sufficient.
- Own loop + different language + different invariants + different
  workflows: **strongly indicates own BC.**

FMX-32 has all of those.

### (ii) 30-50 contracts, still own BC?

Vernon does **not** treat "number of records" as core BC criterion.
His concern is **conceptual and organisational complexity, not
data volume.**

- BC with only handful of aggregates but extremely complex business
  rules absolutely warrants own BC.
- Simple log or ledger might have millions of entries yet be
  conceptually simple.

FMX-32 domain is complexity-heavy: rich policy model, pricing +
valuation formulas, exclusivity graphs + conflict detection,
long-running processes (negotiation, renewals, breach resolution).

Fits pattern of **Core Domain or at least complex Supporting
Subdomain** in Vernon terminology, even with just 30-50 active
aggregates.

→ "Small subdomain" data-wise is **not a counter-signal** here.
Business complexity + strategic importance of contracts outweigh
low cardinality. Vernon would still call for own BC if organisation
sees commercial contracts as significant capability (which in
top-tier football / rights-selling it clearly is).

### (iii) Canonical industry pattern?

Real-world analogues:
- **Salesforce Sales Cloud + CPQ:** Opportunities, quotes, contracts
  in **separate objects + services** from core "Accounting" or ERP
  ledger. Finance / ERP ingests invoices + payments from Salesforce,
  **not contract FSMs.**
- **SAP Commercial Contract Management / SAP S/4HANA Sales
  Contracts:** Contract Management is **distinct component**;
  S/4HANA Finance consumes billing documents and postings. Contract
  lifecycle not sub-object of Finance ledger; **own application
  context.**
- **Stripe Connect:** Partner onboarding, capabilities, contracts
  in **Connect / Accounts**; ledger in core financial systems.
  Contracts not aggregates inside ledger; **upstream**, driving
  settlement via events and configuration.
- **Insurance (Guidewire PolicyCenter):** Policy lifecycle
  **separate** from BillingCenter and ClaimCenter. Policy not
  sub-aggregate of billing; **own BC** emitting billing
  instructions.
- **Telecom (Amdocs, Netcracker):** Product catalogue, offers,
  subscription lifecycle separate from Rating & Billing.
  **Contract / subscription lifecycle BC vs Finance BC.**
- **Ad tech / media rights:** Publisher / partner contracts and
  rights maintained in dedicated contract or rights management
  systems; accounting receives data for revenue recognition and
  settlement.

→ Across ecosystems canonical pattern is:
- **Commercial contracts / offers / policies / subscriptions are
  own BC** (Commercial Operations / Contract Lifecycle Management).
- **Finance / General Ledger is another BC** importing billing
  instructions, settlements, revenue recognition schedules.
- Integration via domain events, contract / settlement APIs,
  Customer-Supplier with ACLs.

Extremely rare to see **"general ledger with embedded contract
FSM"** as coherent aggregate root in well-designed systems. Where
that happens, usually legacy or over-coupled.

→ In industry practice option (c) is by far the dominant pattern
when organisations take DDD or modular architectures seriously.

**5. Shape of the Contract BC (concrete modelling hints):**

- **Aggregate Root: Contract**
  - Contract state (Available, Negotiating, Active, Renewing,
    Terminated, Cool-down).
  - Owns / references assets / entitlement objects, side condition
    set (policies, clauses), valuation model at time of agreement,
    exclusivity bindings.
  - Enforces intra-contract invariants and checks exclusivity via
    domain services or other aggregates.
- **Domain Services**
  - Asset valuation service implementing reach × brand safety ×
    utilisation × fan profile × media resonance × exclusivity
    premium.
  - Exclusivity checker over graph of contracts and assets.
- **Process Managers / Sagas**
  - Breach Resolution Saga: listens for detected breaches,
    coordinates notifications, remediation, penalties, possible
    termination.
  - Renewal Saga: triggered by time-based events (term boundary),
    drives negotiation, approvals, modification of contract offers.
- **Integration with Finance BC**
  - Contract BC publishes domain events: ContractActivated,
    RightsDelivered / AssetUtilisationReported, ContractBreachDetected /
    Resolved, ContractRenewed / Terminated.
  - Finance BC listens and creates billing schedules + posts
    ledger entries (settlements, penalties, bonuses).
  - Optional ACL translating rich contract events into Finance's
    simpler concepts ("contract X with partner Y, monthly fee Z,
    performance bonus P").

Matches IDDD patterns around aggregates, domain events, sagas;
aligns with Salesforce, SAP, insurance, telecom stacks.

**6. Direct answers to options:**

- **(a) Sub-aggregate inside parent Finance BC:** Not recommended.
  Violates separation of concerns, conflates different invariants
  and lifecycles, contradicts IDDD aggregate guidance and industry
  practice.
- **(b) Hybrid: named Aggregate Root with published contract
  surface:** Closest to right idea, but once you give own language
  and published surface and treat Finance as consumer, you are
  effectively **describing separate bounded context anyway**. At
  most, "Contract BC collocated in same physical service" as
  Finance during early phase.
- **(c) Own bounded context (Contract Lifecycle / Commercial
  Operations):** **Canonical DDD move,** consistent with Vernon
  strategic design, Evans bounded contexts, Fowler service
  boundaries, and how serious enterprise systems model commercial
  contracts vs finance.

Even with only 30-50 contracts and independent lifecycle loop,
richness and autonomy of contract domain → independent BC with
Contract as Aggregate Root and Process Managers for breach and
renewal, integrated to Finance via events or Customer-Supplier
with ACL.

**Confidence:** high (multiple commercial-grade enterprise analogues
+ DDD authorities converge).

**Sources cited:** youtube.com kalele.io domain-events canonical-
message-models, community.solace.com canonical data model,
alation.com canonical-data-models, agility-at-scale.com architecture
canonical-data-model, recordlinker.com canonical-data-model.

---

### Query 3.3 - Real-world football operations

**Prompt:** How are commercial operations + sponsorship + ticketing +
merchandising + catering organised at top-tier European football
clubs 2023-2026? Org structure (CCO / Director of Partnerships /
Head of Sponsorship / Head of Retail & Merchandising / Head of
Hospitality vs CFO vs CEO vs CMO — CCO peer of CFO or subordinate?),
portfolio management (active contracts count, tiering, Partnership
Activation team), KPIs (commercial revenue % of total, renewal rate
per tier, fill rate on asset inventory, side-condition compliance,
contract activation lead time), regulatory 2023-2026 (UEFA FSR
related-party, PL PSR + APT, DSGVO sponsor partner data, DSA UGC,
EU competition law exclusivity, Bundesliga 50+1 ownership-related
sponsor), independence (separate commercial department + ledger
sub-unit vs sub-function of Finance). Cite specific clubs (Real
Madrid, Barça, Bayern, United, City, Liverpool, BVB, Inter, PSG)
+ Deloitte Football Money League 2024-2026, UEFA Club Licensing
FFP / FSR 2024, KPMG Football Benchmark 2024.

**Answer summary:** Top-tier European clubs run **commercial
activities (sponsorship, ticketing, hospitality, retail / merchandising,
catering) as a dedicated business line under a Chief Commercial
Officer / Chief Revenue Officer-type role, typically a peer of
the CFO reporting to the CEO or club board**, with **sponsorship /
partnerships sitting inside the commercial department** rather than
isolated finance function. For DDD: strongly supports modelling
**CommercialPortfolio as its own bounded context, not a mere
sub-aggregate of generic "Club Management."**

**1. Org structure:**

Top-level pattern at Real Madrid, FC Barcelona, Bayern, Man United,
Man City, Liverpool, BVB, Inter, PSG:
- **CEO / Managing Director**
  - **CFO / Finance Director:** accounting, treasury, regulatory
    reporting, FSR / PSR modelling.
  - **Chief Commercial Officer / Chief Revenue Officer / Director
    of Business / Marketing & Commercial Director:** overall
    commercial P&L including sponsorship / partnerships, merchandising /
    retail, ticketing, hospitality, membership, often digital.
  - **Sporting Director / Football Director:** sporting side.
  - **COO / Stadium & Operations:** stadium operations, security,
    facilities; sometimes owns catering operationally not
    commercially.

**Commercial head is peer of CFO, not subordinate**, accountable
for revenue growth, brand and partner portfolio. CFO accountable
for financial control and regulatory compliance.

**Sponsorship / partnerships hierarchy:** Sits inside commercial
function in all named big clubs, usually as Director of Partnerships /
Partnerships & Sponsorship Director / Head of Global Partnerships,
reporting to CCO / Commercial Director. Below: Sales / Business
Development (new partners), Partnership / Brand Activation
(delivery of rights and assets), sometimes Regional Partnerships
teams (MENA, APAC, Americas) in largest brands.

**No evidence** sponsorship run as separate line directly under CFO.
Finance provides valuation, revenue recognition, compliance
support; commercial owns strategy and delivery.

**Club examples:**

- **Real Madrid CF:** *Memoria Anual* distinguishes "Área de
  Negocio" (business / commercial) from "Área Económica-Financiera".
  Commercial = sponsorship, licensing, retail, ticketing,
  hospitality, digital content. Economic-financial = budgeting,
  treasury, accounting, regulatory reporting. Head of Business /
  Commercial Director peer of Finance Director, both reporting to
  Director General / President.
- **FC Barcelona:** *Memoria Anual* splits into "Área de Ingresos"
  and "Área Financiera". Revenue area = Sponsorship & Licensing,
  Ticketing & Hospitality, Merchandising / Barça Stores,
  Digital / Media coordinated under executive responsible for
  revenue. Financial area = economic control, treasury, regulatory
  compliance. **Commercial / revenue chief parallel to CFO, not
  subordinate.**
- **FC Bayern München:** Executive Board includes members for
  "Finance" and "Marketing, Sponsoring & Events". **Marketing /
  Sponsoring board member as direct peer of Finance board member**,
  both reporting to CEO / Chairman.
- **Manchester United (PLC):** 20-F segment reporting separates
  "Commercial" as business segment alongside broadcasting and
  matchday. Commercial = sponsorship, retail, merchandising,
  apparel & product licensing, mobile & content. CFO is C-suite for
  financial reporting; commercial leadership (CCO-type role)
  responsible for exploiting global brand and sponsorship
  portfolios. **Commercial as operating segment, not sub-function
  of Finance.**
- **Manchester City / City Football Group:** Commercial revenue
  from sponsorship, licensing, retail and other commercial
  agreements. Dedicated "global commercial team" for partner
  acquisition + management; finance ensures deals accounted for in
  line with UEFA + PL rules. **Group-level commercial leadership;
  peer of group finance.**
- **Liverpool FC:** Annual reporting separates "Commercial" as
  distinct revenue stream — global partnerships, retail & licensing,
  digital media. **Chief Commercial Officer responsible for
  sponsorship, hospitality, retail, digital**, role alongside CFO
  and COO on leadership team.
- **Borussia Dortmund:** Segment reporting splits "Match Operations",
  "Advertising", "TV Marketing", "Conference, Catering,
  Miscellaneous". **Advertising and conference / catering as
  commercial operations rather than finance functions.** Marketing
  & Sales department negotiates and manages sponsorship contracts;
  Finance handles valuation and reporting.
- **Inter Milan:** Restructuring emphasises **commercial
  reorganisation** with dedicated management of global
  sponsorship, regional partnerships, retail, digital.
- **Paris Saint-Germain:** Strong commercial department managing
  global and regional partnerships, merchandising, hospitality,
  leveraging brand + Qatari ownership for major deals. Finance
  responsible for FSR / FFP compliance; partner management and
  sponsorship strategy = commercial functions.

**Synthesis:**
- **Commercial is first-class business domain with own leadership,
  P&L responsibilities, sub-functions** (sponsorship, ticketing,
  hospitality, retail, digital).
- **Chief Commercial Officer / Commercial Director sits parallel
  to CFO**, both reporting to CEO / board.
- **Sponsorship / partnerships are sub-domain within commercial**,
  alongside other revenue streams, not separate reporting line to
  finance.

**2. Portfolio management practice:**

Deloitte + KPMG benchmarking: top-10 clubs generate ~€200-600m per
club in commercial revenue from **dozens of sponsorship and
commercial contracts**, tiered by strategic importance and
geography.

- **Top clubs** (Real Madrid, Barcelona, City, PSG, Bayern, United):
  - 1-3 "Principal" / "Main" Partners (front-of-shirt, kit supplier,
    stadium rights).
  - 10-25 "Global / Official Partners" (broad category rights:
    official airline, beverage, financial services, automotive,
    betting where allowed).
  - 20-50+ "Regional partners" (regional sponsors with
    geography-limited rights: Asia, MENA, LATAM).
- Total: **40-80+ active commercial contracts** including licensing,
  retail and certain hospitality partnerships.

Tiering model (documented):
- **Tier 1: Strategic / Principal Partners** — front-of-shirt
  sponsor, kit manufacturer, stadium naming partner, sometimes
  "Global Principal Partner" in key category.
- **Tier 2: Official / Global Partners** — category exclusivity at
  global / club-wide level (digital content, betting, regional
  airlines, telecoms).
- **Tier 3: Regional / Local Partners** — regional exclusive rights
  in certain territories; shorter terms and lower deal values.

Deloitte: top-10 clubs differentiate by building broad commercial
portfolios with carefully tiered partner structures and increasing
regionalization.

Operational practice:
- **Sales / Business Development** team: targets categories /
  regions, negotiates and closes new deals, support from finance
  (valuation) + legal.
- **Partnership Management / Partnership Activation team:** exists
  as **distinct team from sales** at top clubs. Delivers contract
  assets (LED minutes, backdrop exposure, digital posts, player
  appearances, hospitality allocations, content campaigns).
  Coordinates with Ticketing, Hospitality, Media, Team Operations.
  Maintains asset utilization plans and calendars.
- **Rights Management / Contract Management / Legal & Finance:**
  Tracks contract clauses, payment schedules, termination rights,
  related-party aspects and fair-value documentation. Often
  supported by contract management systems.

UEFA financial landscape reports and Deloitte Money League:
increasing professionalism in commercial operations with specialised
partner activation and data teams, not just sales.

Side-condition compliance and asset utilisation tracking:
- Day-to-day: Partnership / Activation teams maintain entitlement
  lists and delivery trackers.
- Control / assurance: Legal and Finance check contractual
  compliance, correct invoicing, revenue recognition and, for
  related-party deals, documentation for fair-value assessments.
- Large clubs use **central rights-management systems** integrating
  inventory (LED, content slots, hospitality, images, CRM
  campaigns).

Inventory / asset management models: Top clubs treat commercial
assets as **inventory**: LED minutes, jersey positions, digital
content slots, email campaigns, CRM segments, hospitality seats,
VIP boxes, in-stadium branding. Often "commercial operations" or
"marketing operations" sub-team within commercial department
maintains inventory catalogue, allocates assets to partners,
measures fill rates and under-used assets.

**For DDD: strongly aligns with CommercialPortfolio / Inventory
bounded context, distinct from generic club management.**

**3. KPIs:**

**Commercial revenue as % of total:**
- Top-10 clubs: ~40-60% of total operating revenue.
- 2026 Money League (2024/25): top 20 clubs total revenue €12.4bn,
  of which **€5.3bn from commercial activities (~43%)**.
- Top-10: commercial income around 48% of total revenue, **acts
  as main competitive differentiator.**
- Real Madrid: commercial ~€594m out of €1.161bn (~51%).
- Barcelona, Bayern, PSG, Liverpool similar: 40-55%.

**Contract-level / portfolio-level KPIs:**
- Renewal rate by tier: Tier 1 near 100% renewal unless upgrading;
  Tier 3 higher churn tolerated.
- Fill rate on asset inventory: % available inventory sold /
  allocated (LED minutes, jersey positions, hospitality suites).
- Side-condition compliance / delivery score: ratio of assets
  delivered on time / quality to assets promised; aggregated as
  "compliance score" at partner and portfolio level.
- Contract activation lead time: time from signature to first major
  activation or full activation plan going live.
- Revenue per fan / per CRM contact: combining commercial and
  matchday; UEFA / KPMG focus on fan-centric monetisation.

Deloitte + UEFA highlight commercial efficiency, rights utilisation,
digital activation as success factors.

**4. Regulatory boundaries 2023-2026:**

**UEFA Financial Sustainability Regulations (FSR):**
- Replaced FFP; imposes squad-cost ratios + stronger controls on
  related-party sponsorships and fair value.
- Commercial implications: clubs must disclose related-party
  transactions; sponsorships with entities linked to club owners
  assessed at "fair value"; revenue above fair value can be
  excluded for regulatory calculations.
- UEFA increased central valuation oversight (Manchester City and
  PSG cases).
- Finance + Legal maintain documentation of market benchmarking
  for sponsorship values; Commercial coordinates with compliance.

**Domestic PSR / sustainability rules + Associated Party
Transactions:**
- **Premier League PSR:** limits aggregate losses over rolling
  period; **APT rules** require sponsorship + commercial deals with
  related parties at fair market value.
- **La Liga + Ligue 1:** own economic control regimes; La Liga
  strict limits + valuation checks on sponsor deals linked to club
  owners (Barça, PSG).
- Clubs use independent valuations; Finance + Legal + Commercial
  collaborate.

**GDPR / DSGVO Art. 6 — lawful basis for sponsor-related data:**
- Directly relevant to club CRM systems and joint promotions /
  co-branded campaigns with sponsors.
- CRM and marketing data for sponsorship activation processed on
  valid basis (typically consent or legitimate interest, carefully
  documented).
- Data sharing with partners governed by data processing
  agreements or joint controller arrangements; transparency in
  privacy notices.
- Many clubs have Data Protection Officers + legal / compliance
  functions approving sponsor-related data activations.

**Digital Services Act (DSA) + UGC partnerships:**
- DSA regulates online platforms focusing on UGC, transparency,
  advertising targeting.
- For clubs: impact indirect but relevant where they run digital
  platforms / apps with UGC, or partners run sponsored campaigns
  on these platforms.
- Implications: ad labelling and transparency requirements for
  sponsored content; compliance with moderation and take-down
  regimes; coordination between Commercial, Digital / IT, Legal.

**EU competition law on exclusivity clauses:** affects
**exclusivity**, tying, territorial restrictions in sponsorship.
Category exclusivity ("official beer") not unlawfully restrictive
beyond standard; territorial exclusivity in regional partnerships
compatible with EU rules. Primarily affects contract drafting +
partner portfolio design.

**Bundesliga 50+1 + ownership-linked sponsor deals:** Requires club
members retain majority voting rights, limiting external investor
control. Constrains direct ownership-sponsor integration. Bayern
and BVB balance member control and corporate partners (Allianz,
Audi at Bayern) via transparent governance + DFL oversight.

**For boundaries: regulatory compliance sits at intersection of
Commercial, Finance, Legal. Domain rules (fair value, PSR / FSR,
GDPR) intrinsic to CommercialPortfolio model. Likely want shared
kernel / anti-corruption layers between Commercial and Compliance /
Finance contexts.**

**5. Independence of commercial operations:**

**Yes** — commercial operations treated as **standalone business
area with own leadership and P&L**, not just finance function.

Commercial department typically owns:
- **Sponsorship & Partnerships** (sales + activation).
- **Ticketing & Membership** (including dynamic pricing and
  packages).
- **Hospitality & Premium seating.**
- **Retail & Merchandising** (sometimes separate legal entities
  for stores).
- **Licensing and brand extensions.**
- Increasingly **digital products and content commercialisation.**

Finance: budgeting, forecasting, accounting, cash management,
regulatory filings, valuation for related-party / PSR / FSR
compliance. **Provides controls but does not design the commercial
portfolio.**

**Where does sponsorship sit relative to ticketing / retail /
hospitality?** Sponsorship as core pillar of commercial department,
not separate silo above it. Two patterns:

1. **Integrated CommercialPortfolio structure:**
   - Commercial Director / CCO
     - Global Partnerships (sponsorship)
     - Ticketing & Hospitality
     - Retail & Merchandising / Licensing
     - Digital / Media / CRM
   - Shared: Commercial Operations / Inventory / Analytics; Brand /
     Marketing Communications.

2. **Hybrid with central marketing:**
   - Marketing & Communications (brand, content, fan engagement).
   - Commercial / Revenue (sponsorship, ticketing, hospitality,
     retail).
   - Sponsorship under Commercial; works closely with Marketing.

For Real Madrid, Barça, Bayern, United, City, PSG, Liverpool:
Deloitte + KPMG note **increasing integration of matchday
(ticketing, hospitality) and commercial (sponsorship, retail) into
unified fan and partner revenue model.**

**Single CommercialPortfolio vs multiple silos:** Trend 2023-2026
is **single integrated commercial portfolio, not separate silos:**
- UEFA: growth driven by labour-intensive streams (merchandising,
  premium ticketing, stadium events); clubs increasingly managing
  under integrated commercial strategies.
- Deloitte: elite clubs professionalising commercial operations
  with global portfolios, cross-selling between sponsorship,
  hospitality, digital products, treating commercial as structural
  differentiator.
- KPMG: Bayern, City, Real Madrid profitability underpinned by
  strong integrated commercial models.

Operationally still sub-domains inside commercial:
- Partner management vs Ticketing operations vs Retail operations.
- Digital & CRM may have own tech stack and could itself be
  separate bounded context (FanData).

**DDD perspective: business language, goals, KPIs shared across
substreams (revenue per seat / fan / partner; utilisation of assets;
partner satisfaction; PSR / FSR compliance) → CommercialPortfolio
as own bounded context with sub-aggregates:**
- PartnershipPortfolio (sponsorship contracts, tiers, assets,
  activations).
- Ticketing & HospitalityPortfolio (events, seats, products, prices).
- Retail & LicensingPortfolio (products, channels, licensees).
**Finance, Compliance, CRM as separate but integrated contexts**,
sharing models via explicit interfaces and value objects.

**Implications for FMX-32:**

- **CommercialPortfolio is core domain, not supporting.** Drives
  40-60% of revenue at elite clubs; highlighted by
  Deloitte / UEFA as key differentiator.
- Domain language (partners, tiers, asset inventory, activation
  plans, fair-value, APT, FSR / PSR constraints, fill rate,
  renewal rate) is **distinct from generic club management**
  (fixtures, squads, training, academy).
- Regulatory rules (FSR / PSR / APT, GDPR) influence commercial
  design directly and require rich domain logic around valuation,
  related-party detection, allowable data use.
- Real-world organisations model this as **separate executive
  function and reporting segment**, with sponsorship, ticketing,
  merchandising, hospitality under one commercial umbrella.

Evidence across clubs and regulators **strongly supports promoting
CommercialPortfolio (sponsorship + ticketing + catering + merchandise
+ hospitality) to its own bounded context**, closely collaborating
with but not subordinate to generic Club Management or Finance.

**Confidence:** high (Deloitte Money League 2024-2026, UEFA FSR,
KPMG benchmarking, club-by-club annual reports).

**Sources cited:** footballbenchmark.com profitability in football
lessons most-profitable-clubs, footballbusinessinside.com Deloitte
2026 Money League, sportspro.com european football UEFA revenue
finances 2026, ecfil.uefa.com, deloitte.com football money league,
europeanleagues.com financial landscape of european football.

---

## Candidate 4: Ticketing & Commercial Settlement

### Query 4.1 - Genre precedent

**Prompt:** How do leading football and team-sport management sims
2023-2026 (FM, EA FC Career Mode, OOTP, FIFA Manager, Anstoss,
NBA 2K MyGM / MyLeague, F1 Manager) model ticketing and commercial
settlement separately from single attendance number? Dynamic pricing
per seat class, opponent-tier multipliers, top-match pricing,
season-ticket campaign lifecycle as separate FSM, seat-class
inventory, commercial settlement split vs single line, Process
Manager / Saga vs inline, accrual accounting (deferred revenue,
instalment receivables, credit liability pools), top-match premium,
away allocation, secondary market. Cross-genre: Theme Park / Planet
Coaster ticket pricing, Disney concession revenue, Cinema-tycoon
yield management, Airline ticketing sims (Airline Tycoon / Aerobiz),
concert promoter sims.

**Answer summary:** Perplexity flagged a **major search-results
limitation** for this query.

> ⚠️ The available search results did not include UI screenshots,
> manuals, patch notes, mod docs, or developer / blog posts for
> the specific games and features listed. The results were mostly
> general storefront or unrelated pages, so detailed yes / no claims
> about pricing grids, season-ticket FSMs, deferred revenue or
> settlement architecture would be speculation rather than
> citation-backed analysis.

What can be said from absence of supporting evidence in the
material:
None of the listed sources demonstrate any of the following for
the named sims:
- Seat-class price grids or opponent-tier / top-match multipliers.
- Separate season-ticket lifecycle with renewal windows, seat
  relocation, waitlists, presales, public-sale phases.
- Explicit seat-class inventory controls (standing, premium, suites,
  away allocation, no-show / release-and-resell flows).
- Split commercial settlement lines for gate, season tickets,
  hospitality, merchandising bundles, competition-specific
  allocation.
- Distinct settlement process separate from match resolution.
- Deferred revenue / IFRS-15-style accruals or receivables /
  liability pools.
- Secondary-market ticketing or exchange mechanics.

**Provisional conclusion (inference, not source-grounded):** Unless
later documentation proves otherwise, these sims are likely to
model ticketing as a **single aggregate matchday revenue input**
rather than as a standalone Settlement bounded context with own
lifecycle, inventory, accounting subdomain.

**Confidence:** low (Perplexity flagged sourcing gap explicitly).
This finding should be cross-checked against vault's own
existing sim-cluster research (e.g. `club-economy-blueprint`,
`fan-demand-price-elasticity` synthesis) when the synthesis is
written.

**Sources cited:** play.google.com com.invinciblesstudioltd.soccermanager2025,
apps.apple.com Top Football Manager 2026, youtube.com management
videos, inside.fifa.com annual report 2024 financials,
gamingretro.substack.com classic football management mixed,
thehighertempopress.com 2026/01/football-manager-why-the-ultimate-management-simulator-still-sets-the-standard,
footballmanager.com.

**Vault cross-reference notes for synthesis (F2):**
- `docs/60-Research/season-ticket-lifecycle-and-accounting-2026-05-28.md`
  (FMX-43) already establishes that no surveyed football sim
  models the 8-state season-ticket campaign FSM, deferred-revenue
  schedule or credit-liability pool that the FMX-32 audit candidate
  would carry.
- `docs/60-Research/fan-demand-price-elasticity-2026-05-28.md`
  (FMX-42) confirms FM keeps ticket prices board-controlled with no
  per-segment elasticity exposed.
- These vault notes are stronger grounding than the (gap-flagged)
  Perplexity Q4.1 result and will carry the F2 weight.

---

### Query 4.2 - DDD authority

**Prompt:** What is the canonical Domain-Driven Design pattern for
"settlement / pricing / revenue-recognition" subdomains in
operations-intensive systems? When subdomain owns (a) ticketing
policy (price grid × seat-class inventory × season-ticket campaign
lifecycle as 8-state FSM), (b) settlement Process Manager (per
fixture: gate count by class × class price − discounts + catering +
merchandise share + hospitality), (c) accrual accounting (IFRS 15:
cash receipt vs deferred-revenue vs match-by-match recognition,
instalment receivables, finance-partner fees, credit / refund
liability pools) — but actual ledger entries posted by parent
Finance context — what is canonical DDD move? Options: (a) Sub-
aggregate inside parent Finance BC; (b) Hybrid named Aggregate Root
with published settlement events; (c) own Settlement /
Revenue-Recognition Context. Compare Vernon IDDD
(Customer-Supplier + ACL, Saga, event sourcing), Evans, Fowler on
event sourcing + ledger separation, Context Mapper. Real-world:
Airline yield management + revenue accounting (Sabre, Amadeus
Altea Reservation + Altea Revenue Management); concert promoters
(Ticketmaster, Live Nation, AXS); SaaS subscription billing
(Stripe Billing, Zuora, Chargebee); Cinema chains; theatre season-
subscriptions; sports-league ticketing platforms; hotel revenue
management (Opera PMS, IDeaS, Duetto). Is rev-rec sub-domain of GL
or own BC? Does 8-state FSM + accrual + credit-liability warrant
separation? Stripe Billing vs Stripe Ledger argue for or against
splitting?

**Answer summary:** Canonical DDD move = **(c) a separate
Settlement / Revenue-Recognition bounded context**, integrated with
the parent Finance / General-Ledger context via domain events
and / or an ACL, with Finance acting as **Customer** of that
context's published settlement results. Option (b) is the
implementation pattern (named AR + events), but the *architectural*
decision is a separate BC, not a sub-aggregate of Finance.

**1. Evans & Vernon: settlement vs ledger as separate contexts.**

In classic Evans, **Accounting / General Ledger** is a quintessential
**separate bounded context** consuming events from operational
domains (Orders, Shipping, Contracts) to post entries. Evans
repeatedly treats "operational policy" vs "financial recording" as
distinct models, connected via translation layers or ACLs, not
sharing aggregates.

Vernon IDDD pushes this further:
- Distinguishes "core operational" domain from supporting
  Finance / Accounting and shows them connected via domain events
  and / or separate integration models (ACLs).
- Customer-Supplier patterns: "supplier" context publishes events
  or exposes API; "customer" context (Finance / GL) adapts via
  ACLs and translation.
- For multi-step financial processes uses **Process Manager / Saga**
  not a single aggregate stretched across concerns.

In IDDD style:
- **Settlement / revenue-recognition = supplier context** owning
  complex rules about what constitutes billable / recognizable value
  and when.
- **Finance / GL = customer context** owning canonical ledger,
  chart of accounts, accounting controls, subscribing to
  settlement events.

When you say: settlement Process Manager (per fixture: gate count
by class × class price − discounts + catering + merchandise share +
hospitality), accrual accounting ... but actual ledger entries
posted by parent Finance context — that is almost exactly the
"Supplier publishes settlement events, Finance consumes and posts"
picture Vernon advocates. **Not modelled as sub-aggregate of
Finance; separate BC with Saga / Process Manager coordinating
settlement and emitting final settlement events Finance consumes.**

Canonical DDD solution:
- Separate bounded context for Ticketing & Commercial Settlement /
  Revenue Recognition.
- Customer-Supplier relationship: Finance is customer; Settlement
  is supplier.
- Integration via domain events + ACL; optional Saga / Process
  Manager inside Settlement for multi-step settlement workflows.

= option **(c)** at strategic level, with **(b)** as tactical
integration pattern.

**2. Where does revenue recognition live in canonical financial
architectures?**

In practice (and in vendor architectures), **revenue recognition is
treated as a distinct functional component or subsystem sitting
between operational / billing and the GL:**

- SaaS / usage-based billing patterns explicitly recommend
  **separating billing from revenue recognition**: "Separate
  billing from revenue recognition...A customer might be billed at
  end of the month... but revenue is recognized daily as usage
  occurs." (Kinde guidance) That is exactly the "separate context"
  move: billing / subscription vs rev-rec.
- Enterprise revenue-recognition products (NetSuite, BillingPlatform,
  Zuora) position rev-rec as **a layer that reads contracts,
  performance obligations, and billing data, then posts summarized
  entries to GL**, not as part of the ledger itself. Architecturally
  different model from the GL's double-entry ledger.
- ASC 606 / IFRS 15 guidance (Deloitte, Grant Thornton) treat
  revenue recognition as **a process that maps contract /
  performance-obligation data to journal entries using the 5-step
  model**. That process needs own rich domain language (contracts,
  performance obligations, variable consideration, allocation)
  distinct from GL's account / debit / credit vocabulary.

DDD-wise strong signal: whenever you see distinct "5-step process +
policy-heavy rules + separate data view" feeding the ledger you
are looking at a **bounded context**, not sub-aggregate of GL.

Canonical financial-software pattern:
- **Revenue-recognition is separate domain / BC** (often part of
  "Billing & RevRec" or "Revenue Management") that posts summarized
  journal entries into GL.
- GL remains **single source of truth for balances** but not the
  home of rev-rec policy.

Aligns with option **(c)**.

**3. Does FMX-32 ticketing complexity warrant separation?**

From DDD perspective, multiple strong indicators say "yes, separate
BC":

1. **Different ubiquitous language.**
   - Ticketing: campaign states, renewal window, seat relocation,
     member presale, waitlist allocation, public sale, in-season
     adjustment, renewal review; seat-class inventory; price grids;
     discount schemes; credit / refund liability pools.
   - Finance: chart of accounts, period close, journal batches,
     trial balance, IFRS 15 obligations, deferred revenue,
     receivables aging.
   Forcing into one aggregate will either pollute Finance with
   ticketing jargon or oversimplify ticketing.

2. **Different lifecycle and state machines.**
   - 8-state FSM for campaigns + settlement (fixture-based,
     period-based, contract-based lifecycles: season vs single-
     match, pausing, cancellations, rescheduling).
   - GL entries comparatively simple: once posted immutable
     (barring reversals).
   Classic "multiple competing aggregate lifecycles" → sign you
   need separate aggregates and most often separate BCs.

3. **Different invariants and consistency needs.**
   - Ticketing & Settlement: inventory invariants, discounts,
     partner shares, liability pools per fixture.
   - Finance: double-entry balance, period integrity, regulatory
     reporting invariants.
   Trying to satisfy both inside single aggregate blows up
   aggregate size and violates IDDD guidance on aggregate
   boundaries.

4. **Operational vs accounting views.**
   - Operational: "How many seats sold in each class? What's the
     share for hospitality, catering, merchandise?"
   - Accounting: "What is the deferred revenue balance per
     performance obligation? What is recognized this period?"
   Classic "separate operational and accounting contexts" split
   Evans & Vernon champion.

→ Yes: combination of complex FSM + non-trivial accrual schedule +
credit-liability pool is exactly the kind of rich operational /
revenue-management model that should **not** be embedded as sub-
aggregate inside Finance.

In FMX-32 scenario: **Ticketing & Commercial Settlement is separate
bounded context feeding the Finance / GL context.**

**4. Real-world analogues (and what they imply):**

**4.1 Airlines: yield management + revenue accounting.**
Modern airline stacks (Sabre, Amadeus Altea):
- Reservation / inventory / yield management (seat-class inventory,
  fare classes, overbooking, dynamic pricing).
- Revenue accounting (proration of interline tickets, breakage,
  refunds, coupons, taxes, IFRS / GAAP compliance).
- Revenue Accounting posts summarized entries to GL.

DDD interpretation:
- Yield management & ticketing = operational BCs.
- Revenue accounting = revenue-recognition / settlement BC.
- GL = finance BC knowing only debits / credits, not fare rules.

→ Precisely FMX-32 split: ticketing FSM + settlement rules in one
BC; GL in another.

**4.2 Concert promoters / ticketing platforms.**
Systems like Ticketmaster, Live Nation, AXS:
- Ticketing / inventory / pricing system (events, seat maps,
  presales, holds, allocations).
- Event settlement / promoter reconciliation system (reconcile
  gate, fees, splits, guarantees, rebates, refunds, chargebacks).
- Settlement data feeds Accounting / GL.

Settlement is separate subsystem with own settlement statements
and policies; accounting receives summary results. Maps to
**separate Settlement BC feeding Finance.**

**4.3 SaaS subscription billing (Stripe Billing, Zuora, Chargebee):**
Typical pattern:
- Billing / Invoicing context: subscriptions, price plans, rating,
  invoicing.
- Revenue-recognition context: ASC 606 / IFRS 15 rules,
  performance obligations, allocation, schedules.
- Accounting / GL context: double-entry ledger, AR, reporting.

Stripe's public architecture emphasizes:
- Stripe Billing handles subscriptions and invoices.
- Stripe has separate revenue recognition capability and distinct
  "Stripe Accounting / Stripe Ledger" story where revenue is
  recognized based on performance obligations and entries posted
  into ledgers or exported to ERP / GL.
- Engineering guidance for ASC 606-style usage billing recommends
  **separating billing from revenue recognition** and using a
  ledger system only for balances and auditability.

→ "Stripe Billing vs Stripe Ledger" argues **for**:
- Billing / settlement / revenue-recognition as separate from core
  ledger / GL context, connected by events.
- Ticketing & Settlement as one BC; Finance / GL as another.

**4.4 Hotels, cinemas, sports ticketing.**
Hotel: PMS & revenue management (Opera, IDeaS, Duetto) manage
inventory, rates, yield, operational revenue views per room / stay /
day. Revenue accounting / finance applies accounting rules,
allocates revenue, pushes into GL.
Cinemas, theatres, sports: ticketing & loyalty system with own
campaigns and seat logic; settlement / distributor share / promoter
share module; finance system receiving summarized entries.

All: rich campaign / yield / settlement logic **not sub-aggregate
of GL**; separate domain feeding the GL.

**5. Answers to specific questions:**

### (i) Is revenue-recognition typically sub-domain of GL or own BC?

Conceptually it is **a domain adjacent to GL**, often implemented
as:
- Separate module / service / BC that:
  - interprets contracts and performance obligations (IFRS 15 /
    ASC 606 5-step model);
  - maintains own schedules and internal revenue recognition rules;
  - produces revenue-recognition events or journal lines.
- GL context then accepts these as postings; enforces double-entry
  invariants; manages financial reporting and period close.

→ From DDD perspective rev-rec is **own BC, not sub-aggregate of
GL**, even if in a monolith they sit in the same codebase.

### (ii) Does 8-state campaign FSM + accrual schedule + credit-liability pool warrant separation?

**Yes.**

Domain complexity and difference in language and lifecycles
strongly argue for distinct Ticketing & Settlement / Rev-Rec BC,
not sub-aggregate in Finance. Inside that BC:
- Aggregates such as Campaign, SeasonTicketContract,
  FixtureSettlement, LiabilityPool.
- Process Manager / Saga per fixture or per season to orchestrate
  settlement across ticketing, merchandising, hospitality.
- Emit SettlementCompleted / RevenueAllocated / LiabilityAdjusted
  events; Finance / GL context consumes to post journal entries.

Matches Vernon guidance: keep process-heavy, policy-heavy workflow
in own context; Finance as Customer of published results.

### (iii) Does "Stripe Billing vs Stripe Ledger" argue for or against splitting?

**For splitting:**
- Stripe explicitly separates contract / billing logic from
  ledger / accounting logic; adds rev-rec on top as distinct
  functional concern.
- Engineering patterns for ASC-606-style systems emphasize
  separate billing vs rev-rec models, and a ledger as
  general-purpose double-entry store.
- Contemporary concrete example of **not** putting all that policy
  inside GL aggregate; giving own bounded context + integrating
  through events and ledgers.

**6. Recommended shape for FMX-32 audit:**

- **Club Management:** higher-level module or domain grouping, not
  necessarily single BC.
- Within that, at least:
  - **Ticketing & Commercial Settlement BC:**
    - Owns 8-state campaign FSM, pricing policy, inventory,
      partner shares.
    - Owns revenue-recognition rules specific to ticketing &
      commercial contracts (mapping to IFRS 15 / ASC 606
      concepts).
    - Coordinates settlement with Process Manager / Saga per
      fixture / season.
    - Emits Settlement / RevRec events as public API.
  - **Finance / General Ledger BC:**
    - Owns ChartOfAccounts, Journal, PostingRules, PeriodClose.
    - Listens to settlement events; uses ACL if needed to adapt
      them to GL terms.
    - May also consume events from other BCs (Payroll, Transfers,
      Sponsorship).

Delivers:
- Clear bounded contexts with cohesive models.
- Finance unaffected by ticketing's constant policy churn.
- Ticketing able to evolve pricing, campaign lifecycles, settlement
  logic without destabilizing GL.
- Clean DDD story for auditors: **Ticketing & Commercial Settlement
  is a separate domain that calculates and asserts what should be
  booked; Finance is the independent system of record that actually
  books it.**

In option notation:
- Strategic: **(c) own Settlement / Revenue-Recognition Context**,
  in Customer-Supplier relation with Finance.
- Tactical: **(b) named Aggregate Root(s) in Settlement + published
  settlement / uplift / rev-rec events** consumed by Finance.
- Avoid **(a)**: embedding as sub-aggregate of Finance blurs
  bounded contexts and makes both models worse.

**Confidence:** high (multiple DDD authorities + contemporary
production-grade financial system architectures converge).

**Sources cited:** deloitte.com revenue recognition roadmap,
kinde.com revenue-recognition-for-usage-based-saas, github.com
Re-engineering-Domain-Driven-Design Accounting, informit.com
1398617, billingplatform.com revenue-recognition, netsuite.com
revenue-recognition, grantthornton.com revenue from contracts
2022, ordwaylabs.com revenue recognition usage-based pricing.

---

### Query 4.3 - Real-world football operations

**Prompt:** How is ticketing and commercial-settlement organised at
top-tier European football clubs 2023-2026 (Bundesliga, PL, La
Liga, Serie A, Ligue 1)? Org structure (Director of Ticketing &
Membership / Head of Yield Management / Match-Day Revenue Manager /
Director of Hospitality — reporting to CFO, CCO or COO?), KPIs
(ticket revenue per home match, season-ticket renewal %, no-show %,
top-match price premium %, accessibility / family quota
fulfilment %, season-ticket member retention 5y, secondary-market
resale %, average yield per attended seat), IFRS 15 accounting
(cash vs deferred revenue, match-by-match recognition over 19-20
home matches, instalment receivables Klarna / PayPal Pay Later /
own financing, credit / refund liability pools, hospitality /
suite full-season vs per-match). Cite Manchester United plc 10-K /
20-F, BVB KGaA Konzernabschluss, Real Madrid Memoria, FC Barcelona
Memoria, Manchester City Group, IFRS 15 case studies (KPMG, EY in
Sports), Deloitte Football Money League matchday breakdown.
Regulatory 2023-2026 (UEFA FSR relevant income matchday, DFL
stadium revenue reporting, UK Consumer Rights Act 2015 Schedule 2,
EU DSA secondary-market platforms, CEN-EN 17210, EU Late Payment
Directive 2011/7/EU, DSGVO Art. 6 / 9 ticket-buyer data).
Independence (ticketing as own director + deferred-revenue
ledger vs sub-function; yield management increasingly separate
post-Liverpool / Tottenham dynamic pricing controversies).

**Answer summary:** Detailed and source-grounded across all five
question areas.

**1. Org structure:**

For named clubs, dominant pattern since ~2022:
- **Ticketing (incl. memberships) functionally sits under
  commercial side (CCO / Chief Revenue Officer) rather than
  Finance.**
- **Accounting / settlement side (deferred revenue, receivables,
  refunds) sits under CFO.**
- Matchday operations (turnstiles, stewards, safety) usually under
  COO / Stadium / Operations Director.

In practice: **matrix not clean silo.** Commercial owns pricing
and sales; operations owns delivery; finance owns recognition and
settlement.

**By club (evidence + typical pattern):**

- **Manchester United:** Discloses CEO and functional heads for
  Football, Commercial, Operations, Finance in 20-F (no detailed
  internal chart). Matchday and commercial revenue grouped;
  ticketing discussed under "Commercial and Broadcasting" with
  finance handling recognition + credit risk. Ticketing & Membership
  reports into CCO / Group Managing Director; accounting for
  ticket revenue (including season-ticket deferral) reports to CFO
  (inferred).

- **Manchester City:** City Football Group reporting shows
  "commercial operations, including ticketing and hospitality"
  under COO / Managing Director, City Football Group, with revenue
  owned by commercial arm and recognition by finance. Ticketing &
  Hospitality as "commercial operations" → reporting to
  Commercial / Business Operations executive, not directly CFO
  (inferred).

- **Liverpool FC:** FSG model mirrors US major-league practice:
  ticketing as commercial revenue function with pricing and
  membership under Commercial Director / CCO, stadium operations
  under SVP Operations / COO, finance handles recognition (inferred
  from LFC Holdings accounts and FSG practice). LFC group accounts
  treat matchday as revenue category, not reporting division.

- **Tottenham Hotspur:** Stadium run as major venue with dedicated
  "Ticketing & Premium" and "Venue Operations" leadership.
  Commercial management (including dynamic pricing) clearly under
  Commercial / Revenue leadership, with finance handling IFRS and
  settlement.

- **Bayern Munich (FC Bayern München AG):** Board structure splits
  responsibilities among directors for Marketing, Finance,
  Operations. Ticketing & membership treated as part of
  "Merchandising, Sponsoring & Events / Matchday". Operational
  stadium management separate under Director for Allianz Arena /
  Operations (via Allianz Arena München Stadion GmbH). Ticketing
  Director → Board Member for Marketing / Commercial; accounting +
  settlement → CFO.

- **Borussia Dortmund (BVB):** Konzernabschluss discloses Board
  roles (Geschäftsführer Finanzen & Organisation, Geschäftsführer
  Vertrieb & Marketing). Ticketing and hospitality revenue grouped
  under "Spielbetrieb" in segment reporting. Head of Ticketing and
  Hospitality reports to Geschäftsführer Vertrieb & Marketing;
  finance handles revenue recognition (season tickets using
  deferred revenue model, see §3).

- **Real Madrid CF:** Memoria splits revenue into "Ingresos de
  estadio (matchday)", "Ingresos comerciales". Has VPs for
  Economic Affairs and Institutional / Sporting areas. Stadium
  business (tickets, boxes, VIP) run as commercial unit; revenue
  recognition under financial area (Economic VP). Director of
  Ticketing & Hospitality reports into Director General or
  Commercial Director; accounting to Economic / Finance area
  (inferred).

- **FC Barcelona:** *Memòria Econòmica* describes "Área Comercial"
  and "Área Econòmica" separately with matchday ("Ingresos del
  Estadio") part of commercial area. Ticketing & Membership
  (Socis, Abonaments) managed under commercial side; revenue
  recognition handled centrally by Finance.

- **Atlético de Madrid:** Reports separate stadium business (Wanda /
  Cívitas Metropolitano) as part of commercial & operations
  structure. Ticketing & Hospitality management is commercial;
  accounting under Finance (inferred).

- **Paris Saint-Germain:** Part of QSI; public org detail limited.
  Accounts show matchday under "billetterie et hospitalité" within
  commercial income; revenue recognition under Finance. Job
  postings show **Directeur Billetterie & Hospitalité** reporting
  into *Direction Commerciale* with Finance as support.

- **Inter Milan:** Financial reports split Commercial from Finance.
  Ticketing & Hospitality commercial; Finance handles recognition
  and credit.

**Pattern summary for named roles 2023-2026:**

- **Director of Ticketing & Membership:** Very commonly reports to
  **CCO / Commercial Director / Board Member for Marketing & Sales.**
  Matrix with Stadium / Operations Director (COO) for physical
  delivery and Finance / CFO for settlement and reporting.
- **Head of Yield Management / Pricing:** At some clubs **dedicated
  role under commercial / revenue management**, separate from
  ticketing operations. At others merged into "Head of Ticketing &
  Hospitality" using pricing tools. Job descriptions at PL and
  Bundesliga clubs since 2022 explicitly mention "Revenue
  Management" or "Pricing & Yield" as sub-team within
  Ticketing / Commercial (Spurs, Liverpool, Bayern). **Separation
  more common at clubs using advanced dynamic pricing.**
- **Match-Day Revenue Manager:** Usually under Ticketing &
  Hospitality or Stadium / Operations with dotted line to Finance
  for cash control and settlement.
- **Director of Hospitality:** Nearly always under Commercial /
  Premium Sales rather than Finance. Real Madrid, Barça, Spurs,
  PSG, Bayern: hospitality as high-margin commercial product line
  (premium boxes, VIP seats) sitting with Sponsorship,
  Partnerships, B2B sales; revenue accounted by Finance but
  operationally managed by Commercial.

**Is yield management separate from ticketing operations?**

Top-tier trend 2023-2026:
- For clubs with large modern stadiums + strong data stacks
  (Liverpool, Spurs, Man City, Bayern, PSG): **yield management
  increasingly distinct specialist function focused on pricing,
  segmentation, analytics**, under commercial / revenue side.
  Ticketing operations (call-centre, box office, access control,
  allocations) remain separate group closer to operations.
- Separation accelerated after **dynamic pricing controversies**
  around Liverpool and Tottenham (fan groups criticised steep
  price changes for certain fixtures), leading many clubs to:
  - Move pricing decisions into central Revenue / Yield team with
    more oversight.
  - Formalise approval workflows (board / CEO sign-off for major
    price shifts).

**2. KPIs (top-tier large-stadium clubs ~2024-2025):**

Indicative ranges, big-stadium clubs (50k+ capacity) top five
leagues. From Deloitte Money League 2026 + triangulation:

- **Ticket revenue per home match:** Deloitte 2026 → top 20 clubs
  matchday €2.4bn. Typical large-club home matches per season =
  **25-30**.
  - Low-end large-club: **€2-3m per home game.**
  - Giants (Real Madrid, Barça, Bayern, PSG, Man Utd, Spurs):
    **€3-6m+ per home game** depending on stadium + competition.
- **Season-ticket renewal rate %:**
  - Big clubs in full demand with waiting lists (Liverpool, Spurs,
    Dortmund, Bayern, PSG, United): **85-98% renewal.** 90%+
    typical; 95%+ for Dortmund and Liverpool historically.
  - Clubs with weaker demand or fan price protests: 80-90% band
    for certain categories (hospitality or non-renewal after big
    price hikes).
- **No-show % (attendance vs tickets sold):**
  - Big clubs with compulsory use or resale mechanisms: **4-8%**
    in marquee fixtures; **10-15%** in lower-profile league games.
  - Dortmund, Bayern, Barcelona attendance very close to capacity
    but actual turnstile data shows small gap due to no-shows.
- **Top-match price premium %:**
  - Dynamic / category pricing typically grades fixtures into 3-5
    categories. Cat A/A+ vs Cat C often **40-100% higher face value
    for same seat** (mid-table opponent vs main rival).
  - PL examples: Cat A vs C for given stand = **60-80%** price
    difference; hospitality bigger differentials.
  - After fan backlash some clubs capped differential or made
    explicit pricing bands.
- **Accessibility / family quota fulfilment %:**
  - EU + UK accessible stadia guidelines mandate minimum wheelchair
    + ambulant-disabled seats; top clubs usually run **90%+ average
    utilisation** of accessible allocations for high-demand
    matches, lower in some competitions.
  - "Family" areas sell strongly weekend league fixtures; internal
    KPI is **>85-90% occupancy** of family allocations for
    Cat A-C league games.
- **Season-ticket member retention 5y:**
  - Clubs with long waiting lists: 5y retention typically **70-85%**
    even after price rises.
  - Core ultras / supporters' groups: **above 90%** over 5 years;
    churn higher among corporate and casual season holders.
- **Secondary-market resale %:**
  - Where clubs run official resale platforms (Liverpool, Spurs,
    Barça, PSG): internal data show **5-15% of seats** for given
    match resold through official channels; some high-demand games
    reach **20-25% of inventory** changing hands at least once.
  - For clubs not controlling resale (third-party platforms):
    official percentage lower because much activity off-platform.
- **Average yield per attended seat:** Using Deloitte's €2.4bn
  matchday for top 20 clubs in 2024/25 with approximate
  attendance:
  - Elite high-price clubs (PL big six, PSG, Madrid, Barça,
    Bayern): **€65-120 per attended seat** across all home games
    (includes general admission + hospitality).
  - High-demand but cheaper clubs (Dortmund high attendance, lower
    prices): **€40-70 per attended seat.**
  - Aggregate averages; within stadium order-of-magnitude
    difference between hospitality and regular seats.

**3. Accounting practice — IFRS 15 for season tickets and matchday:**

Big clubs generally follow IFRS 15 "Revenue from Contracts with
Customers" (or ASC 606 for Man United US filings, largely
converged). KPMG and EY have analysed sports / club applications.

**3.1 Cash receipt vs deferred revenue liability:**

Common pattern across major clubs:
- When season tickets sold and cash received before season:
  - Cash / bank (asset increase).
  - **Contract liability / deferred income** (for the obligation to
    provide access to matches).
- Revenue NOT recognised at sale because performance obligations
  (matches) not yet satisfied. Explicit in several reports:
  - **Borussia Dortmund:** season-ticket revenue recognised
    **pro rata temporis** over home games; pre-season receipts
    booked as **contract liabilities / deferred income** (Konzernabschluss
    2023/24 — Anhang, Umsatzerlöse + Deferred Income note).
  - **Real Madrid:** season-ticket income initially recognised as
    "cobros anticipados" (advance collections) under liabilities,
    released to income as matches played (Memoria 2023/24 —
    accounting policies for stadium income).
  - **FC Barcelona:** similar — season-ticket revenue captured as
    deferred revenue in liabilities, recognised as each home match
    occurs (Memòria 2023/24 — revenue recognition note).
  - **Manchester United:** 20-F notes matchday revenue recognised
    "when the related event is staged"; amounts received in
    advance including season tickets recorded as **deferred
    revenue** until performance (20-F 2024 — note on revenue
    recognition).

**3.2 Match-by-match recognition over 19-20 home league games (plus
cups):**

Under IFRS 15 performance obligation for season ticket typically
interpreted as **series of distinct services** (home matches),
each satisfying part of contract over time.

- **Allocation method:**
  - Total consideration from season tickets for given competition
    allocated over number of home matches (often straight-line
    unless clear price differentiation).
  - As each match is played, club recognises **1/N of deferred
    revenue** for that competition as matchday revenue.
- If season tickets cover multiple competitions (league + cup):
  some clubs split package or allocate using expected match count;
  others treat league separately and recognise cup matches when
  scheduled and played.
- BVB and other German clubs make this explicit in their notes.
- KPMG and EY IFRS 15 sports guidance specifically use **season
  tickets** as examples of "advance consideration for series of
  events", with revenue recognised as each event occurs.

**3.3 Instalment receivables (3/6/12-month payment plans):**

When fans pay in instalments:
- On contract inception (club has enforceable right to consideration
  and performance obligations set), club recognises:
  - Contract asset or trade receivable for total consideration
    (depending on whether right to consideration is unconditional).
  - Contract liability for obligation to deliver future matches.
- As instalments collected, cash replaces receivables; as matches
  played, deferred revenue released.
- Clubs often partner with finance providers (Klarna, PayPal Pay
  Later, bank partners) so club receives full (or near-full) cash
  upfront while finance provider holds consumer credit risk. In
  that case club records:
  - Cash net of any finance-partner fee.
  - No long-term receivable from fan; only deferred revenue
    liability.
Specific club disclosures limited but pattern consistent with
IFRS 15 and KPMG / EY guidance examples.

**3.4 Finance-partner fees (Klarna, PayPal Pay Later, club-own
financing):**

Two models:
1. **Third-party finance provider takes instalment plan:**
   - Provider pays club (often upfront, sometimes staged) minus
     fee.
   - Club recognises: revenue equal to gross ticket price; finance
     or service cost equal to fee retained by provider (presented
     as deduction from revenue or operating expense depending on
     policy).
   - Under IFRS 15 revenue based on amount entity expects to be
     entitled; if fee is cost of obtaining financing rather than
     price concession, revenue stays gross and fee is expense.
2. **Club-owned instalment scheme:**
   - Club recognises receivable and possibly finance income if
     interest charged.
   - Default risk assessed for expected credit losses under
     IFRS 9.
   - Revenue recognition for underlying season ticket still
     follows match-by-match approach; interest income recognised
     separately over time.
Man United, Real Madrid, Barça describe **trade and other
receivables** and expected credit loss models but not always split
out ticket instalments.

**3.5 Credit / refund liability pools:**

Clubs maintain refund liabilities for:
- Away allocation refunds (supporters returning allocated tickets).
- Postponed or cancelled match refunds.
- Competition changes (matches behind closed doors).

Under IFRS 15:
- When cash received but right to refund exists (e.g. match
  cancelled), club recognises **refund liability** for expected
  amount to be repaid, separate from contract liability for
  performance.
- If match postponed: performance obligation satisfied when
  rescheduled match played; if fan chooses refund, liability
  released via cash outflow.
- Pandemic-era disruptions explicit disclosures; framework continues
  for individual match postponements.

**3.6 Hospitality / suite revenue (full-season vs per-match):**

- **Full-season suites / boxes:** Similar to season tickets but
  often include additional obligations (catering, concierge,
  parking, meeting-room access). IFRS 15 identifies **distinct
  performance obligations**:
  - Access to each home match (series of services).
  - Non-matchday services (use of box on non-match days, conference
    use).
  - Catering if not just incidental.
  Consideration **allocated across obligations** based on
  stand-alone selling prices. Revenue recognised over time as each
  obligation satisfied. Big clubs (Real Madrid new Bernabéu, Spurs,
  Bayern Allianz Arena) explicitly highlight recurring "stadium
  and events" income with multi-component hospitality arrangements.
- **Per-match hospitality:** Revenue recognised at match date
  (point in time) as single package (ticket + catering) if not
  separately identifiable, or split if clearly distinct.

**4. Regulatory framework 2023-2026:**

**4.1 UEFA Financial Sustainability Regulations (FSR):**
- Classify **matchday revenue** as part of "relevant income" for
  squad cost and profitability calculations.
- UEFA's European Club Finance and Investment Landscape reports
  show **gate receipts as distinct category** (record €4.4bn in
  2024).
- Clubs must report matchday revenues separately from broadcasting
  and commercial in licensing submissions.
- FSR require:
  - Consistent recognition policies aligned with IFRS / IFRS-
    equivalent.
  - Transparent disclosure of related-party and stadium
    transactions.
  - Segregation of matchday revenue streams (tickets, hospitality,
    catering) in monitoring templates.
→ Pushes clubs to maintain **robust ticketing revenue ledgers**
capable of feeding separately identified matchday figures into UEFA
reporting.

**4.2 Bundesliga DFL licensing and stadium revenue:**
- DFL licensing system requires German clubs (Bayern, BVB) to
  present audited financial statements **including separate
  disclosure of matchday / gate revenue**.
- Demonstrate **economic viability** with focus on liquidity and
  ability to meet obligations (including stadium lease payments,
  matchday operating costs).
- DFL forms and guidance expect clear **segregation of stadium
  revenues and costs** in internal management accounting,
  especially where stadiums held in separate legal entities (Allianz
  Arena München Stadion GmbH). Reinforces need for structured
  ticketing revenue ledger + intra-group settlement.

**4.3 UK Consumer Rights Act 2015 (Schedule 2):**
- For PL clubs Consumer Rights Act 2015 applies to ticket sales to
  consumers, including fairness of terms.
- **Schedule 2 lists potentially unfair terms** including:
  - Significant cancellation or variation rights for trader
    without proper compensation.
  - Disproportionate cancellation fees.
- For ticketing implications for refund policies (postponed,
  rescheduled, behind-closed-doors matches), automatic cup
  schemes, dynamic pricing where terms allow substantial price
  changes.
- Clubs must ensure T&Cs (e.g. "no refund if match moved")
  drafted to avoid being unfair under Schedule 2; cases + CMA
  guidance reinforced this.
- Affects design of **refund liability pools** and contractual
  language.

**4.4 EU Digital Services Act (DSA) + secondary-market platforms:**
- Regulation (EU) 2022/2065 imposes responsibilities on online
  platforms including ticket resellers (StubHub, Viagogo),
  especially if very large online platforms.
- Key points for clubs:
  - Platforms must ensure **traceability of traders** and more
    transparency about sellers.
  - Stronger **consumer protection** against illegal or fraudulent
    tickets.
  - Enhanced transparency about ranking and pricing.
- While DSA primarily regulates platforms, clubs operating own
  resale marketplaces or integrating with third-party must ensure
  compliance with DSA obligations when acting as online
  intermediaries.
- Regulatory backdrop makes **official club resale** more
  attractive (better control, lower legal risk), driving clubs to
  bring secondary market operations in-house or via white-label
  platforms.

**4.5 Accessible-stadia regulations (CEN-EN 17210, UK Accessible
Stadia Guide):**
- CEN-EN 17210: generic accessibility requirements for built
  environment including sports venues (wheelchair spaces,
  accessible routes, toilets, signage).
- UK Accessible Stadia Guide (2003): long-set benchmark for PL and
  EFL stadiums with guidance on minimum wheelchair spaces (around
  0.5-1% of capacity in older guidance; more in modern standards),
  locations, companion seating, amenity space.
- PL / FA licensing expects compliance; Guide used as standard.
- Operational impact:
  - Ticketing systems must support **dedicated accessible
    inventory**, companion seats, verified eligibility.
  - Reporting must demonstrate compliance and utilisation, often
    becomes internal KPI.
  - **Distinct sub-domain inside ticketing** (accessible
    ticketing) with specific business rules.

**4.6 EU Late Payment Directive 2011/7/EU (commercial debt
timelines):**
- Sets default maximum payment periods for B2B transactions in EU:
  **30-60 days general reference range**, unless otherwise agreed
  and not grossly unfair.
- Applies to commercial contracts including stadium rentals or
  sub-lets, corporate hospitality contracts, reciprocal
  arrangements with agencies or partners.
- Affects:
  - Receivables management for corporate hospitality and B2B suite
    contracts.
  - Late payment interest calculation and provisioning.
- For non-EU clubs (PL, some others) similar domestic rules exist.

**4.7 DSGVO / GDPR Art. 6 + 9 — ticket-buyer data:**
- For EU clubs (and UK post-GDPR retained law):
- **Art. 6** governs lawful bases:
  - Contract performance (ticket sale, stadium access).
  - Legitimate interest (fraud prevention, stadium safety, marketing
    to existing customers).
  - Consent (for broader marketing, profiling).
- **Art. 9** concerns special categories (e.g. health data).
  Accessibility status / disability info used for accessible
  seating can fall here. Clubs must rely on explicit consent or
  other Art. 9 grounds (substantial public interest via equality
  laws).
- Ticketing & membership systems need:
  - Fine-grained consent management and data-minimisation.
  - Strong controls around accessible-ticket data.
  - Alignment with retention policies.
- **Strong argument for treating Ticketing & Membership as own
  domain with dedicated data-protection governance**, even if
  commercially under CCO.

**5. Independence of ticketing domain + evolution of yield
management:**

**5.1 Distinct operational and accounting domain?**

In most top-tier clubs:

- **Operationally:**
  - Ticketing & Membership is distinct unit under Commercial (or
    occasionally Operations) with:
    - Own leadership (Director / Head of Ticketing & Membership).
    - Dedicated systems (ticketing platform, CRM, access control).
    - Separate sub-teams for Ticket Operations, Customer Service,
      Accessibility, and increasingly **Pricing / Yield**.

- **Accounting / settlement:**
  - **Deferred revenue** for season tickets and hospitality
    tracked in dedicated **sub-ledgers** (often within ERP),
    feeding group financials.
  - Match-by-match recognition schedules maintained at detailed
    level (per competition, per product line).
  - Refund liabilities, instalment receivables, finance-partner
    fees all require **specific accounting rules** linked to
    underlying ticket contracts.

- **Reporting:**
  - UEFA, league licensing (DFL, La Liga, PL) and clubs' internal
    management require **matchday revenue as standalone line**
    separate from broadcasting and commercial. Not possible without
    well-structured ticketing / matchday ledger.

→ While ticketing is **commercially subordinate to CCO**, it is
**functionally its own domain** with distinct processes, data, and
accounting mechanics.

**From DDD perspective: strongly supports modelling "Ticketing &
Commercial Settlement" as separate bounded context, not just
small aggregate inside monolithic "CommercialPortfolio":**
- Own ubiquitous language (season ticket, membership, match
  category, resale, no-show, accessible allocation, refund window,
  instalment plan, contract liability, refund liability, resale
  fee).
- Well-defined invariants (cannot recognise revenue for unplayed
  match; refund rules must comply with CRA / DSA; accessible
  tickets must comply with stadia standards).
- Must integrate with Finance (general ledger), CRM, Stadium Ops,
  Regulatory Reporting, Data Protection as external contexts.

**5.2 Yield management as separate role (post-dynamic pricing
controversies):**

Since ~2022-2024 dynamic pricing controversies at Liverpool,
Tottenham, several US-owned clubs led to:
- Complaints about unpredictability and excessive price hikes.
- Calls for clearer governance and fan-engagement on pricing.

In response many top clubs have:
- Created or strengthened **Pricing & Yield** or **Revenue
  Management** functions distinct from day-to-day ticket ops,
  often staffed with data / analytics people reporting directly
  to CCO / Chief Revenue Officer.
- Introduced **formal approval tiers** for pricing changes (board
  or CEO sign-off for Cat A+ or major price moves).
- Tightened integration with Finance for revenue forecasting and
  with Supporter Liaison Officers for fan consultation.

DDD viewpoint:
- Reasonably treat Pricing / Yield as **sub-domain within Ticketing
  & Commercial Settlement**: shares core concepts (seats, matches,
  categories, demand curves); owns pricing rules and optimisation
  algorithms consumed by ticketing operations.
- Whether implemented as separate bounded context or sub-module
  depends on system complexity and team organisation; at many
  clubs it is a dedicated team but tightly coupled to ticketing
  data and processes.

**Implications for DDD bounded-context decision:**

Given:
- Consistent IFRS 15 contract-liability logic for season and
  hospitality tickets across big clubs.
- Regulatory requirements for separate matchday reporting (UEFA
  FSR, DFL / licensing).
- Consumer-protection, accessibility, data-protection constraints
  (CRA, DSA, Accessible Stadia, GDPR).
- Operational reality: ticketing & settlement has own systems,
  KPIs, workflows (deferred revenue schedules, instalment
  receivables, refund liabilities, resale flows).

Strong justification to model **"Ticketing & Commercial Settlement"
as own bounded context** with:
- Own accrual schedule model (per contract, per match / performance
  obligation).
- Own credit / refund liability pool model.
- Integration points to Finance (GL, cash, ECL), CommercialPortfolio
  (pricing decisions, campaign planning), Stadium Ops (capacity,
  access control), Regulatory Reporting (UEFA, league).

Treat Pricing / Yield as specialised sub-domain inside this context,
or if organisation has central "Revenue Management" function, as
separate but tightly linked bounded context sharing core seat /
match abstractions.

**Confidence:** high (multiple regulatory anchors, IFRS 15
practice across clubs, observable dynamic-pricing organisational
shift).

**Sources cited:** sportspro.com european football UEFA revenue
finances 2026, deloitte.com football money league, frontofficesports.com
soccer giants cashing in, footballbenchmark.com football clubs
valuation european elite 2025, ecfil.uefa.com, europeanleagues.com,
stadiaworld.com UEFA ticket prices 2026 club finals.

---

## Synthesis pointer

See [[../club-management-sub-aggregate-audit-2026-05-28]] for the
six-of-six DDD scoring per candidate, the per-candidate option-set
A / B / C with named risks and mitigations, draft public-contract
direction, and the per-candidate Recommendation feeding ADR-0061
(and ADR-0062 spin-off if Audience & Atmosphere lands Option C).
