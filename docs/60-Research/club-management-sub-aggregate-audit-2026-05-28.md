---
title: Club Management Sub-Aggregate Ownership Audit Synthesis (FMX-32)
status: draft
tags: [research, synthesis, club-management, stadium, fan-ecology, audience-and-atmosphere, sponsorship, commercial-portfolio, ticketing, settlement, bounded-context, ddd, fmx-32]
created: 2026-05-28
updated: 2026-05-28
type: research-synthesis
binding: false
linear: FMX-32
related:
  - [[raw-perplexity/raw-club-management-sub-aggregate-audit-2026-05-28]]
  - [[../10-Architecture/09-Decisions/ADR-0061-club-management-sub-aggregate-audit]]
  - [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]
  - [[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]]
  - [[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]]
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]]
  - [[../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]]
  - [[../10-Architecture/09-Decisions/ADR-0057-rivalry-system-context]]
  - [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  - [[../10-Architecture/09-Decisions/ADR-0060-youth-academy-context]]
  - [[../10-Architecture/bounded-context-map]]
  - [[../50-Game-Design/stadium-and-campus]]
  - [[../50-Game-Design/fan-ecology]]
  - [[../50-Game-Design/sponsorship-portfolio]]
  - [[../50-Game-Design/matchday-event-engine]]
  - [[../50-Game-Design/economy-system]]
  - [[../50-Game-Design/GD-0008-finance-economy]]
  - [[../50-Game-Design/GD-0015-ip-clean-data]]
  - [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[club-economy-blueprint-2026-05-27]]
  - [[club-economy-impact-map-and-commercial-contracts-2026-05-28]]
  - [[commercial-contract-lifecycle-and-breach-model-2026-05-28]]
  - [[fan-demand-price-elasticity-2026-05-28]]
  - [[season-ticket-lifecycle-and-accounting-2026-05-28]]
  - [[../30-Implementation/club-economy-accounting-ledger]]
  - [[../30-Implementation/club-economy-commercial-contracts]]
  - [[../30-Implementation/domain-research-workflow]]
---

# Club Management Sub-Aggregate Ownership Audit Synthesis (FMX-32)

> Six-phase domain-research-workflow synthesis (Phase 3) for FMX-32.
> Phase 1 vault grounding + Phase 2 twelve Perplexity queries (four
> candidates × three queries: Genre / DDD / Real-world) archived at
> [[raw-perplexity/raw-club-management-sub-aggregate-audit-2026-05-28]].
> This note is the decision-ready brief feeding
> [[../10-Architecture/09-Decisions/ADR-0061-club-management-sub-aggregate-audit]]
> (and, if Audience & Atmosphere lands Option C, spin-off
> [[../10-Architecture/09-Decisions/ADR-0062-audience-and-atmosphere-context]]).

## Question

Who owns the four Club Management sub-aggregate candidates today and
should any be promoted from sub-aggregate to own bounded context?

Candidates audited (per the FMX-32 ticket plus the scope expansion to
add Ticketing & Commercial Settlement, since ADR-0058 just minted it
as a named sub-aggregate):

1. **Stadium / Venue Operations** — matchday FSM + facility-decay
   loop + capacity-by-seat-class inventory + non-matchday event
   calendar + hospitality + catering + venue-event regulations.
2. **Audience & Atmosphere** (formerly *Fan Ecology*) — six-segment
   cohort model + weekly atmosphere loop + multi-input scoring
   formula (price sensitivity × loyalty × volatility × fixture
   attractiveness × trust state) + politics-event triggers
   (choreo / protest / boycott / ouster-call) + persona / named-group
   overlay.
3. **CommercialPortfolio** (Sponsorship + Catering + Merchandise +
   Hospitality) — contract lifecycle FSM
   (Available → Negotiating → Active → Renewing → Terminated +
   Cool-down) + side-condition catalog + asset-inventory taxonomy +
   multi-input valuation formula + exclusivity graph + breach
   Process Manager.
4. **Ticketing & Commercial Settlement** — price grid × seat-class
   inventory + season-ticket campaign 8-state FSM (planning →
   renewal-window → seat-relocation → member-presale →
   waitlist-allocation → public-sale → closed →
   in-season-adjustment → renewal-review) + settlement Process
   Manager + accrual accounting (cash receipt vs deferred revenue
   vs match-by-match recognition, instalment receivables,
   finance-partner fees, credit / refund liability pools).

Today's owner for all four: **Club Management** per the binding
16-context map (`bounded-context-map.md` §1 line 38) and the draft
boundary proposal in `ADR-0058 §Recommendation` lines 97-112 ("Club
Management gets a named commercial sub-aggregate, but no new
bounded context is added by this ADR").

## Summary

The 16-context map (`binding: true`, post-FMX-40 ratification
2026-05-28) and draft ADR-0058 currently keep all four candidates as
sub-aggregates of Club Management. FMX-41 (Economy Impact Map),
FMX-42 (Fan Demand & Price Elasticity), FMX-43 (Season-Ticket
Lifecycle & Accounting) added substantial own-FSM, own-loop and
own-published-contract surface onto exactly these four candidates
in the past 24 hours. FMX-32 is the natural boundary audit.

**Per-candidate six-of-six DDD split-criteria firing** (per §F4
below):

| Candidate | Own UL | Own FSM | Own storage | Multi consumer | Cross-cutting | Low co-change | Total | Lean |
|---|---|---|---|---|---|---|---|---|
| Stadium / Venue Operations | ✓ partial | ✓ | ✓ | ✓ | ✓ | ✗ (high Match / Matchday-Event coupling) | **5/6** | **Hybrid (B)** with Option C plausible |
| Audience & Atmosphere | ✓ strong | ✓ partial | ✓ | ✓ strong (4-7 consumers) | ✓ strong | ✓ (weekly atmosphere tick conceptually independent of ledger tick) | **6/6** | **Split (C)** — spin-off ADR-0062 |
| CommercialPortfolio | ✓ strong | ✓ (5-state contract FSM) | ✓ (asset inventory + exclusivity graph + valuation formula) | ✓ (mostly Club-internal; cross-cuts Audience, Stadium, Regulations, Manager & Legacy) | ✓ strong (40-60% of revenue + FSR / PSR / APT regulatory anchor) | ✓ (term-based, not weekly) | **6/6** | **Split (C)** |
| Ticketing & Commercial Settlement | ✓ strong | ✓ (8-state campaign FSM + per-fixture settlement Saga) | ✓ (deferred-revenue schedule + receivables + refund liability pools) | ✓ | ✓ (UEFA FSR matchday-segregation + IFRS 15 + DSA / CRA / GDPR) | ✓ (accrual schedule independent of weekly economy tick) | **6/6** | **Sub-Aggregate inside CommercialPortfolio** (or own Settlement BC if CommercialPortfolio stays sub-aggregate of Club) |

Three of four candidates fire six-of-six (matching the FMX-29 and
FMX-33 wave high; stronger than FMX-26 / 28 / 30 / 34 which fired
five-of-six). Stadium fires five-of-six (own-loop, own-language,
own-FSM, own-storage and cross-cutting role all confirmed; low
co-change is genuinely weak because matchday FSM ties tightly to
the Match per-fixture FSM and to Club Management ledger postings).

**Vault-binding tension.** ADR-0058 is `status: draft` /
`binding: false` and explicitly states "no new bounded context is
added by this ADR." FMX-32 does not *supersede* a binding ADR; it
refines a draft ADR before ratification. The amendment hunks
proposed in `ADR-0061 §Map patch` are therefore in-line
refinements to draft ADR-0058 (and, where the ledger contract
boundary moves, to draft ADR-0050) rather than `Supersedes` chains
against accepted ADRs. The binding ADRs that *are* affected are
ADR-0019 (modular-monolith DDD ground rules, accepted) and ADR-0027
(per-save schema convention, accepted) — both stay compatible with
the per-candidate Option C recommendations because the new
contexts respect ADR-0019's "one process per modular monolith" rule
and ADR-0027's `save_<uuidv7hex>` per-save schema convention.

**Recommendation.** Per-candidate per-Option matrix follows in
§Recommendation. The audit converges on:

- **Stadium / Venue Operations:** Option B (Hybrid named Aggregate
  inside Club Management with published contract surface). Option
  C (own BC `StadiumOperations`) is defensible and has the
  strongest real-world organisational evidence in the wave (Bayern
  Allianz Arena München Stadion GmbH; BVB Stadionmanagement GmbH;
  Spurs venue business; Real Madrid Bernabéu Legends JV), but the
  matchday FSM ties tightly to Match and Matchday-Event-Engine.
  Defer Option C to a future audit beat after MVP if the matchday
  coupling holds; promote to Option B now to give the candidate a
  named contract surface (`StadiumCommercialSnapshot`,
  `StadiumCapacitySnapshot`, `PitchConditionChanged`,
  `VenueEventBooked`).
- **Audience & Atmosphere** (renamed from Fan Ecology):
  **Option C** (own bounded context). Six-of-six fires; the
  customer-affinity / scoring-context DDD pattern is canonical
  (Vernon IDDD ch. 3 + 7); the real-world Supporter Liaison Officer
  + GDPR Art. 6 / 9 + DSA Art. 16 surface is a distinct regulatory
  subdomain; cross-genre precedent (CK3 vassal opinion, Civ VI
  Loyalty, Cities Skylines districts, Total War Three Kingdoms
  public order) all separate. Spin off **ADR-0062
  `audience-and-atmosphere-context`** as a stub-ADR with
  Recommendation Option C; ADR-0061 references back. Audience &
  Atmosphere becomes the **17th** bounded context (or 18th /
  19th / 20th depending on landing order with ADR-0059 community
  overlay pipeline + ADR-0060 youth academy + any other
  ADR-0061-promoted candidates).
- **CommercialPortfolio:** **Option C** (own bounded context). The
  CCO-peer-of-CFO real-world pattern is decisive; the 40-60%
  commercial-revenue share at top clubs makes CommercialPortfolio
  a strategically core domain; the FSR / PSR / Associated Party
  Transaction regulatory framework is intrinsic to commercial
  model design. DDD Vernon: contract management is a textbook
  separate BC (Salesforce CPQ, SAP S/4HANA Sales Contract, Stripe
  Connect, Guidewire PolicyCenter, Amdocs subscription lifecycle
  all separate from Finance ledger). Becomes the **17th-20th**
  bounded context depending on landing order.
- **Ticketing & Commercial Settlement:** **Sub-Aggregate inside
  CommercialPortfolio** (assuming CommercialPortfolio = Option C).
  Even though Ticketing & Settlement fires six-of-six on its own,
  it does not deserve a *separate* bounded context above and
  beyond CommercialPortfolio — the airline yield-management +
  revenue accounting + IFRS 15 / Stripe Billing-vs-Ledger evidence
  supports nesting inside CommercialPortfolio rather than
  splitting again. **Fallback:** if Nico chooses Option B
  (Hybrid) for CommercialPortfolio instead of Option C,
  Ticketing & Settlement promotes to **own Settlement BC** because
  the 8-state campaign FSM + IFRS 15 accrual schedule + credit
  liability pool warrant separation from a sub-aggregate-of-Club
  CommercialPortfolio.

The dossier presents the per-candidate Option matrix in ADR-0061
and lets Nico ratify per-candidate; the working recommendation is
**Option B / C / C / sub-Aggregate-of-CommercialPortfolio** which
yields **two** new bounded contexts (Audience & Atmosphere via
ADR-0062 spin-off; CommercialPortfolio via ADR-0061), bringing the
16-context map to 18 contexts. A more conservative landing is
**B / C / B / sub-Aggregate-of-CommercialPortfolio** (one new BC,
Audience & Atmosphere); a more aggressive landing is
**C / C / C / sub-Aggregate-of-CommercialPortfolio** (three new
BCs).

> **Standing IP-naming directive.** All fictional names introduced
> in this dossier — sample stadium / arena names, supporter-group
> labels, sponsor brand examples, fan-incident personas — follow
> Nico's vault-wide creative IP-safe-naming rule (evocative-but-
> clearly-not-real). Real-world organisations are cited as
> analytical evidence only (Bayern Allianz Arena München Stadion
> GmbH, FC St. Pauli, La Liga, Deloitte Football Money League);
> no real-world clubs, sponsors, venues, fan groups or persons are
> embedded as samples inside the proposed contexts.

## Findings

### F1 — Vault binding state (Phase 1 grounding)

**Source:** [[../10-Architecture/bounded-context-map]] (§1 line 38,
**binding: true**) · [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
(`status: draft`, **binding: false**, lines 67-79) ·
[[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
(`status: draft`, **binding: false**, §Recommendation lines 97-112) ·
[[../50-Game-Design/stadium-and-campus]] (`status: draft`,
**binding: true**) · [[../50-Game-Design/fan-ecology]]
(`status: draft`, **binding: false**) ·
[[../50-Game-Design/sponsorship-portfolio]] (`status: draft`,
**binding: false**) ·
[[../50-Game-Design/matchday-event-engine]] (`status: draft`,
**binding: true**) ·
[[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
(`status: draft`, **binding: false**) ·
[[club-economy-impact-map-and-commercial-contracts-2026-05-28]] ·
[[fan-demand-price-elasticity-2026-05-28]] ·
[[season-ticket-lifecycle-and-accounting-2026-05-28]] ·
[[commercial-contract-lifecycle-and-breach-model-2026-05-28]].

**Confidence:** high.

**Today's binding owner.** `bounded-context-map.md` §1 line 38 is
binding and assigns Club Management ownership of "**Finance ledger,
accounting projections, budgets, infrastructure, sponsors, board,
fans, insolvency state**" with exposed outputs "Club state, economy
snapshots, board pressure, facility modifiers". The map header note
explicitly adds: "FMX-41 commercial economy planning is captured in
draft ADR-0058. **It does not add a seventeenth bounded context.**
The draft recommendation is a Club Management commercial
sub-aggregate."

**Game-design binding.** Only `stadium-and-campus.md` is
`binding: true` among the three candidate GDDRs. `fan-ecology.md`
(`binding: false`, post-FMX-42 / 43 amendments) and
`sponsorship-portfolio.md` (`binding: false`, post-FMX-41 / 44
amendments) are draft. The Stadium GDDR binding state matters: any
boundary recommendation for Stadium must respect its approved
header line ("Venue operations are a Club Management system with
football consequences, not a detached tycoon minigame"). Option C
(own BC `StadiumOperations`) does **not** contradict this because
the proposed BC remains *part of* Club Management's bounded-context
group; it merely receives a named contract surface and own
internal FSM. The GDDR allows that.

**ADR draft status.** ADR-0050 (`status: draft`, lines 67-79)
states: "Club Management owns finance, budget, sponsor, stadium
economics, board pressure and insolvency stage. Other contexts
never write finance tables directly." ADR-0058 (`status: draft`,
lines 97-112) refines: "Club Management gets a named commercial
sub-aggregate, but no new bounded context is added by this ADR…
If commercial operations later needs independent lifecycle,
staffing, permissions or service extraction, supersede this ADR
and evaluate Option B." Both are explicitly amendable; FMX-32
*refines* draft proposals before ratification, not supersedes
binding ADRs.

**Wave-2 surface loaded onto candidates.**

| Wave-2 ticket | Pushed responsibility | Onto |
|---|---|---|
| FMX-13 / FMX-41 | `StadiumCommercialSnapshot` → ledger input; weekly facility decay; venue-event calendar | Stadium |
| FMX-41 | Unified `CommercialContract` shell across ticketing / catering / merch / sponsorship; fan-event campaign funding | CommercialPortfolio |
| FMX-42 | Segment-specific elasticity (Option C — Segment Elasticity + Latent Demand + Trust Guardrail); `FanDemandForecast` per-segment read model; persistent `ticketingTrustState` | Audience & Atmosphere |
| FMX-43 | 8-state season-ticket campaign FSM (planning → renewalWindow → seatRelocation → memberPresale → waitlistAllocation → publicSale → closed → inSeasonAdjustment → renewalReview); IFRS-15 accrual schedule; instalment receivables; credit liability pool | Ticketing & Commercial Settlement |
| FMX-44 | Contract-lifecycle FSM (Available → Negotiating → Active → Renewing → Terminated + Cool-down); side-condition catalog; breach Process Manager | CommercialPortfolio |

**Inference.** The wave-2 economy work loaded substantial own-FSM,
own-loop, own-published-contract and own-regulatory-anchor surface
onto exactly the four candidates within the past 24 hours. The
boundary audit moment is now.

### F2 — Genre precedent (Perplexity Q1.1 / 2.1 / 3.1 / 4.1)

**Source:**
[[raw-perplexity/raw-club-management-sub-aggregate-audit-2026-05-28]]
§§ Q1.1 / Q2.1 / Q3.1 / Q4.1 (Football Manager 23/24/25 + EA
Sports FC Career Mode 24/25/26 + OOTP 24/25/26 + FIFA Manager
legacy + Anstoss series + cross-genre Anno 1800 / Theme Park /
Planet Coaster / F1 Manager / Total War Three Kingdoms / Crusader
Kings III / Civilization VI / Cities Skylines / Stardew Valley /
Football Chairman / NBA 2K MyGM).

**Confidence:** medium-high for football-sim cluster (multiple
converging references, clear pattern); low for the
Ticketing & Settlement candidate (Perplexity Q4.1 flagged search
gap — see §F2.4 for vault-cross-reference fallback).

**F2.1 — Stadium / Venue Operations.** All five football
management sims treat Stadium as **sub-aggregate under Club /
Finance**. FM exposes Stadium as a tab under Club → Facilities
with static attributes + upgrade buttons (capacity, seating /
standing split, pitch type, roof, under-soil heating, corporate /
TV facilities level, pitch condition). Matchday revenue
summarised under Finances. **No event calendar per venue, no
non-matchday events as revenue sources, no staffing / catering
throughput / security as explicit entities, no capacity by block
beyond crude seated vs standing, no hospitality NPS, no
per-concession performance.** EA FC / FIFA Career Mode and OOTP
even thinner. **FIFA Manager 10-14 and Anstoss show the most
explicit decay / maintenance model** (stand-by-stand UI, VIP
areas, restaurants, fan shops, parking, youth camps, facility
decay + maintenance cost) but still under Club Infrastructure
menus — **no explicit non-matchday event scheduling**.

Cross-genre: **Anno 1800, Theme Park / Planet Coaster, F1 Manager
facilities** all promote venue / facility ops to **own UI area
with continuous operational loop** (capacity per cycle,
throughput, queue time, reliability, maintenance status, staff
allocation, guest satisfaction). The pattern fires when
**operations are the gameplay product**, not when operations are
infrastructure for sporting gameplay.

**Implication for FMX-32.** Industry-baseline football sims keep
Stadium as sub-aggregate. The FMX project's stated stadium scope
(matchday + facility decay + capacity-by-class + non-matchday
events + Anstoss-style fan-zone differentiator per
`stadium-and-campus.md` §1) is **richer than FM / EA but lighter
than Theme Park / Anno**. Genre precedent supports Option B
(Hybrid) over either pure sub-aggregate or own BC. The richer
non-matchday + multi-regulator surface is what tips toward Option
C for some clubs (see §F5).

**F2.2 — Audience & Atmosphere (Fan Ecology).** All five football
management sims treat fans as **single aggregated variable**
("supporter confidence" / "fan happiness") embedded in club /
economy / reputation systems. FM is closest with the Supporter
Profile (Hardcore / Core / Family / Fair-weather / Corporate /
Casual segments) but **flattens output to global Supporter
Confidence bar** — no per-segment numeric state exposed. OOTP has
detailed price elasticity but **no segment cohorts**. None expose
multi-input atmosphere formula, persistent fan trust state, or
fan-politics state machines.

**Cross-genre is decisive.** Crusader Kings III, Civilization VI,
Cities Skylines, Total War Three Kingdoms all treat analogous
audience / loyalty / opinion systems as **segmented bounded
contexts with own UI + per-segment state + own update tick**:
- CK3 Vassal Opinion: per-vassal score with traits, actions,
  religion, culture, hooks; **each vassal effectively a cohort**;
  low opinion → factions, rebellion, plots.
- Civ VI Loyalty: per-city score with nearby cities, governors,
  amenities, policies; loyalty ticks each turn; too low → rebel /
  flip.
- Cities Skylines District Mood: **population categories**
  (residential, commercial, industrial, offices) effectively act
  as segments with own response curves to services and taxes.
- TW Three Kingdoms Public Order: per-commandery with taxes /
  characters / buildings / corruption / events; **updates each
  turn**; drives rebellions.

**Implication for FMX-32.** The desired FMX feature set (segment
cohorts with own loyalty / mood / volatility / attendance
probability, multi-input atmosphere engine, fan politics state
machine, persistent trust state, segment-specific price
elasticity) is **beyond industry-standard football sims** but
**inside cross-genre strategy-sim baseline**. Genre precedent
supports Option C (own BC) once the design commits to depth
beyond FM.

**F2.3 — CommercialPortfolio (Sponsorship + Catering + Merch +
Hospitality).** Football sims treat sponsorship as **aggregated
financial parameter**. FM does not expose a sponsor portfolio
screen; sponsorship is emergent parameter managed by AI board.
FIFA Manager has a basic Sponsorship screen with main + secondary
sponsors and term + yearly amount but **no multi-stage
negotiation, no clause editor, no asset-level allocation, no
breach process**. Anstoss similar. OOTP has no sponsor portfolio.

**F1 Manager and Motorsport Manager are the closest analogues.**
F1 Manager: dedicated Sponsors section with Title Sponsor +
multiple Sponsors with contract length, fixed payment, per-race
performance incentives. Discrete sponsor tiles / cards with
progress bars per race / season. **Persistent portfolio with own
screen and state machine** — but still inside Team Management BC.
Motorsport Manager: sponsor slots on car + race series with
upfront / per-race payment + bonus for finishing position +
contract length + region / series exclusivity. **Dedicated
Sponsorship screen** showing all current contracts, remaining
races, available new offers. Accepting fills specific slot
(physical car / signage location). **Excellent analogue for
CommercialPortfolio as sub-aggregate** with own rules + UI.

**Implication for FMX-32.** The desired FMX feature set
(contract lifecycle FSM, side-condition catalog with breach
detection, asset-inventory taxonomy, multi-input valuation
formula, exclusivity graph, breach Process Manager) is **more
complex than F1 Manager / Motorsport Manager sponsor portfolios**
because it also bundles catering + merchandising + hospitality
under the same CommercialContract shell per FMX-41 + FMX-44.
Genre precedent shows a sponsor-portfolio sub-aggregate is
defensible (F1 Manager pattern); the breadth and depth of the
FMX scope push toward own BC.

**F2.4 — Ticketing & Commercial Settlement.** Perplexity Q4.1
**returned a search-gap-flagged result** ("the available search
results did not include UI screenshots, manuals, patch notes, mod
docs, or developer / blog posts for the specific games and
features listed"). The provisional inference from absence of
evidence: "these sims are likely to model ticketing as a single
aggregate matchday revenue input rather than as a standalone
Settlement bounded context with own lifecycle, inventory,
accounting subdomain."

**Vault cross-reference (stronger grounding).**
[[fan-demand-price-elasticity-2026-05-28]] (FMX-42, post-economy-
wave) confirms FM keeps ticket prices board-controlled with no
per-segment elasticity exposed; OOTP has detailed elasticity but
no segments. [[season-ticket-lifecycle-and-accounting-2026-05-28]]
(FMX-43) confirms **no surveyed football sim models the 8-state
season-ticket campaign FSM, deferred-revenue schedule, instalment
receivables or credit-liability pool** that the FMX-32
Ticketing & Settlement candidate carries.

**Implication for FMX-32.** Industry-baseline football sims have
**no analogue** for the FMX Ticketing & Settlement scope. The
closest analogues are cross-industry (airline yield management +
revenue accounting; concert promoter settlement; SaaS subscription
billing vs ledger; hotel revenue management vs accounting — see
§F3.4 and §F5.4). Genre precedent is **insufficient** to argue
either way; the DDD authority (§F3) and the real-world football
operations + regulatory frame (§F5) carry the F4 weight.

### F3 — DDD authority and pattern (Perplexity Q1.2 / 2.2 / 3.2 / 4.2)

**Source:**
[[raw-perplexity/raw-club-management-sub-aggregate-audit-2026-05-28]]
§§ Q1.2 / Q2.2 / Q3.2 / Q4.2 (Vaughn Vernon *Implementing
Domain-Driven Design* + Eric Evans *Blue Book* + Martin Fowler
bliki + Context Mapper / SummerSoC papers + Microsoft Learn DDD
guidance + Schimak / Rücker process-manager literature; real-world
analogues for each candidate).

**Confidence:** high (all four queries converged on **Option C
own BC** as the canonical DDD move; Vernon, Evans, MS Learn,
Fowler all aligned; multiple commercial-grade enterprise analogues
documented per candidate).

**F3.1 — Stadium / Venue Operations.** Canonical DDD move = **own
bounded context** modelled as **supporting "Operations / Venue
Operations" subdomain** integrating with Club Management / Finance
via Customer-Supplier + Anti-Corruption Layer and / or domain
events. Real-world DDD analogues: Hotel PMS (Opera, Mews) is
separate product / context from Accounting / General Ledger;
financial postings exported via interfaces (Customer-Supplier +
ACL pattern). Theme park attraction ops, retail store ops, CMMS
(IBM Maximo, Infor EAM) all follow the same shape: **ops as own
BC with lifecycle state machines, resource scheduling,
maintenance and decay processes, KPIs and compliance data;
Finance / Core management contexts consume summarized or
transformed information via contracts and translation layers**.
Evans Blue Book ch. 5 "Subdomains" (supporting subdomain) + Vernon
IDDD ch. 9 + 10 (separate BC with high internal cohesion and
clear external contracts) + MS Learn microservices DDD all
converge.

**Tactical modelling inside the Venue Operations BC** (per Vernon
IDDD ch. 10 + Schimak / Rücker process-manager pattern):
- Aggregate roots: `Venue` / `Stadium` with FSM
  `Preparing → DoorsOpen → InPlay / Kickoff → Halftime →
  SettlementPending → Reset`; optional separate
  `MaintenanceProject` / `WorkOrder` aggregates.
- Scheduled loop via Process Manager / Saga (weekly facility
  decay; maintenance project lifecycle).
- KPIs derived from domain events (`MatchPlayedAtVenue`,
  `HospitalityEventCompleted`, `MaintenanceCompleted`) or
  projections / read models.
- Multi-context consumers: Match / Matchday BC consumes capacity &
  availability; Matchday-Event-Engine subscribes to venue state
  changes; Regulations consumes compliance events; Club Management /
  Finance subscribes to settlement / cost / revenue events via
  ACL.

**F3.2 — Audience & Atmosphere (Fan Ecology).** Canonical DDD
move = **own bounded context** as **supporting subdomain
(Scoring / Loyalty & Atmosphere context)** — exactly the pattern
Vernon uses for credit-scoring + customer-loyalty + recommendation
contexts (IDDD ch. 3 + 7). Five-of-five Vernon split criteria fire:
1. **Different Ubiquitous Language** — cohort, atmosphere, mood,
   volatility, fixture attractiveness, fan incident vs Club /
   Finance's ledger / budget / FFP / board pressure language.
2. **Different team / expertise / algorithmic complexity** — data /
   ML / behavioral modeling vs financial / board / operations
   stakeholders.
3. **Different non-functional concerns and tech stack** — A&A may
   need experimentation, ML features, batch / computation,
   specialized storage; Club BC = transactional, strongly
   consistent, RDBMS-centric.
4. **Customer-Supplier with ACL** — A&A supplies scores to Club /
   Finance, Rivalry, Notification, Manager UIs. Open Host Service
   + Published Language + ACL (IDDD ch. 7).
5. **Independently evolving scoring formula** — A&A formula
   evolves frequently; Club ledger rules relatively stable.
6. **Different life cycles and process rhythms** — Club Management
   tick = ledger postings, fixture confirmations, budgeting
   cycles; A&A tick = weekly simulation loop over cohorts.

**Resolving the Fan Ecology weekly-loop independence question**
(Nico-gated open item per the FMX-32 plan): Vernon does **not**
use the phrase "weekly loop independence" by name, but the IDDD
ch. 3 + 5 + 7 split criteria use **"different life cycles and
process rhythms"** as a strong split signal. A&A's weekly
atmosphere tick is **conceptually independent** of Club's
economy-week tick even if they share a clock trigger — the
atmosphere loop fires regardless of whether anything in the
ledger changed, and consumes facts (rivalry, fixture
attractiveness, weather, security) that have nothing to do with
ledger postings. This is the DDD-resolved answer: criterion 6
(low co-change) **fires for A&A**, and the dossier records this
as a research-grounded outcome rather than a Nico-gated
assumption.

**Real-world analogues classify A&A clearly as own BC:**
- Net Promoter / customer-loyalty platforms (Salesforce Marketing
  Cloud, Braze, Iterable, Klaviyo, HubSpot CDP) — separate
  bounded contexts / separate products from CRM ledger.
- Credit scoring services (Schufa, Experian, FICO) — separate
  scoring BCs that upstream domains call into; bank core ledger
  does not embed FICO as aggregate.
- Streaming engagement scoring (Spotify / Netflix recommendation
  engines, YouTube watch-time) — separate "Recommender" BC with
  own ML pipelines, data model, scoring schedule.
- Retail customer-affinity scoring (Amazon, Tesco Clubcard) —
  separate Marketing / Analytics / Affinity contexts with own
  schema and job schedules.
- Loyalty programs (airlines miles, hotel points) — scoring / tier /
  churn / campaign as marketing / scoring BC, connected via
  context mapping.

A&A is the **football-stadium recommendation & engagement BC**.

**F3.3 — CommercialPortfolio.** Canonical DDD move = **own
bounded context** modelled as **Commercial Contracts / Contract
Lifecycle Management BC**, integrated with Finance as separate
Customer-Supplier relationship with ACL. Vernon IDDD: contract
management, policy lifecycle, subscription lifecycle, and similar
"commercial operations" domains are **separate bounded contexts
from the general ledger / finance context**. Vernon's split
criteria all fire:
- **Language:** contracts, rights packages, assets, exclusivity,
  valuation, youth-focus, brand-safety scoring vs Finance's
  chart-of-accounts / journal / period-close / IFRS-15 obligation
  language.
- **Lifecycle:** contract-term driven (renewal windows, cool-downs,
  breach detection) vs ledger-period driven (week / month tick).
- **Invariants:** "no two breweries in overlapping asset
  categories", "youth-focus and brand-safety thresholds must be
  satisfied", "renewal offers and breach resolution follow state
  transitions" — none of these are Finance invariants.
- **Workflows:** negotiation, re-pricing, breach resolution,
  renewal — long-running business processes vs discrete
  transactional ledger postings.

**Real-world analogues classify CommercialPortfolio clearly as own
BC:**
- Salesforce Sales Cloud + CPQ: opportunities, quotes, contracts
  in **separate objects + services** from ERP ledger.
- SAP Commercial Contract Management / SAP S/4HANA Sales
  Contracts: contract management as **distinct component**;
  S/4HANA Finance consumes billing documents.
- Stripe Connect: partner onboarding, capabilities, contracts in
  **Connect / Accounts**; ledger in core financial systems.
- Guidewire PolicyCenter: policy lifecycle **separate** from
  BillingCenter and ClaimCenter.
- Amdocs / Netcracker telecom: product catalogue + offers +
  subscription lifecycle separate from Rating & Billing.
- Ad tech / media rights: publisher / partner contracts +
  rights maintained in dedicated contract / rights-management
  systems; accounting receives data for revenue recognition.

**Specific Vernon answers** to FMX-32 plan questions:
- **(i)** Own loop alone warrant own BC? *Not sufficient alone but
  strongly indicates own BC in combination with different
  language + invariants + workflows.* CommercialPortfolio has all
  four.
- **(ii)** Does small contract count (30-50) override richness?
  *No.* Vernon does not treat data volume as a core criterion;
  **business complexity and strategic importance outweigh low
  cardinality**. A BC with handful of aggregates but complex rules
  absolutely warrants own BC.
- **(iii)** Canonical industry pattern? *Own Commercial Operations
  / CLM BC*, not sub-aggregate of Finance. **Extremely rare to see
  "general ledger with embedded contract FSM" as coherent
  aggregate root in well-designed systems.**

**F3.4 — Ticketing & Commercial Settlement.** Canonical DDD move
= **own Settlement / Revenue-Recognition bounded context**,
integrated with parent Finance / GL via domain events and / or
ACL, with Finance as **Customer** of context's published settlement
results.

**Vernon + Evans + Fowler all converge:** classic Evans treats
Accounting / General Ledger as separate BC consuming events from
operational domains (Orders, Shipping, Contracts) to post entries;
Vernon IDDD pushes this further with Customer-Supplier publishing
domain events / exposing APIs, Process Manager / Saga for
multi-step financial processes. **Settlement / revenue-recognition
= supplier context** owning complex rules about what constitutes
billable / recognizable value and when; **Finance / GL = customer
context** owning canonical ledger, chart of accounts, accounting
controls, subscribing to settlement events.

**Real-world canonical financial architectures separate
revenue-recognition from GL:**
- Airline yield management + revenue accounting (Sabre, Amadeus
  Altea Reservation + Altea Revenue Management as separate
  domains; revenue accounting posts summarized entries to GL).
- Concert promoters (Ticketmaster, Live Nation, AXS): separate
  ticketing / inventory / pricing system + separate event
  settlement / promoter reconciliation system + accounting / GL.
- SaaS subscription billing — Stripe explicitly separates billing
  (Stripe Billing) from revenue recognition from ledger / accounting
  (Stripe Ledger story). Engineering guidance for ASC 606 / IFRS 15
  systems explicitly recommends **separating billing from revenue
  recognition** and using ledger only for balances and auditability.
- Hotel revenue management (Opera PMS revenue module + IDeaS /
  Duetto): separate from accounting / finance.

**Specific Vernon answers** to FMX-32 plan questions:
- **(i)** In canonical financial-software architectures, is
  revenue-recognition typically a sub-domain of GL or own BC?
  **Own BC** — a domain adjacent to GL, interpreting contracts +
  performance obligations (IFRS 15 / ASC 606 5-step model),
  maintaining own schedules and rev-rec rules, producing
  rev-rec events or journal lines. GL accepts these as postings.
- **(ii)** Does 8-state campaign FSM + accrual + credit liability
  warrant separation? **Yes.** Combination of complex FSM +
  non-trivial accrual schedule + credit liability pool is exactly
  the kind of rich operational / revenue-management model that
  should not be embedded as sub-aggregate inside Finance.
- **(iii)** Does "Stripe Billing vs Stripe Ledger" argue for or
  against splitting? **For splitting.** Stripe explicitly
  separates contract / billing logic from ledger / accounting
  logic; adds rev-rec on top as distinct functional concern.
  Concrete contemporary example of not putting all that policy
  inside GL aggregate.

**Open question — should this be a *separate* BC above and
beyond CommercialPortfolio, or nested as primary Aggregate inside
CommercialPortfolio?** This is the FMX-32 dossier's key
recommendation nuance, addressed in §Recommendation 4 below.
Short answer: **nest inside CommercialPortfolio if
CommercialPortfolio = Option C (own BC); split into own
Settlement BC if CommercialPortfolio = Option B (Hybrid
sub-aggregate of Club)**.

### F4 — Six-of-six DDD split-criteria firing per candidate

**Source:** F1 + F2 + F3 applied to each candidate with the FMX-29
precedent's six-of-six rubric:
1. **Own ubiquitous language** distinct from parent context's
   language.
2. **Own FSM** with states unrelated to parent context state.
3. **Own storage** (per-save schema tables not naturally JOINed
   with parent tables).
4. **Multiple consumers** beyond parent context.
5. **Cross-cutting role** that no single existing context can
   host without leaking outside its language.
6. **Low co-change with neighbours** — cadence + concerns
   independent.

**Confidence:** high — rubric grounded in F3 DDD authority and F2
genre + cross-genre evidence; per-candidate scoring derived from
named GDDR surface + ADR draft surface.

#### F4.1 — Stadium / Venue Operations (5/6 fire)

1. **Own ubiquitous language ✓ partial.** Operational terms
   — capacity tier, seat mix, venue module, construction phase,
   pitch condition, facility-age decay, dwell time, fan-zone
   activation, matchday vs non-matchday revenue split, hospitality
   inventory, catering throughput, safety certificate, ingress /
   egress curves, stewarding plan, pitch grading, event-day
   operations — are distinct from Club's ledger / budget / FFP /
   board-pressure language. **Partial fire** because some
   operational terms ("budget allocation", "revenue") **are
   shared with Club ledger**; Stadium speaks an operational
   *extension* of Club's economic language rather than a fully
   distinct language.
2. **Own FSM ✓.** Matchday timeline as canonical operations FSM
   (Preparing → DoorsOpen → InPlay / Kickoff → Halftime →
   SettlementPending → Reset, per F3.1 + Vernon IDDD ch. 10).
   Facility-decay sub-FSM (new → degrading → maintenance-heavy)
   plus venue-event-calendar cycle (pre-event → active →
   post-event) per `stadium-and-campus.md` §4-6. **No FSM
   currently documented in `state-machines/`** (separable cleanup
   ticket per FMX-32 plan §10).
3. **Own storage ✓.** Capacity-by-seat-class tables (standing,
   seating, family, premium, suites, accessibility), facility-age
   counters, maintenance project ledger, venue-event-calendar
   bookings, pitch-condition history, hospitality inventory,
   matchday OPEX history. Per-save schema per ADR-0027.
4. **Multiple consumers ✓.** Match (capacity + pitch condition for
   per-fixture FSM); Matchday-Event-Engine (facility triggers per
   `matchday-event-engine.md` §3-4); Regulations & Compliance
   (Safety Certificate + UEFA Stadium Infrastructure compliance +
   DFL Lizenzhandbuch facility category + FA Pitch Grading);
   Club Management (matchday + non-matchday revenue → ledger);
   Audience & Atmosphere (capacity-utilisation as atmosphere
   input); CommercialPortfolio (asset inventory for stadium-naming
   + LED + hospitality). **Five-plus consumers** matching Vernon's
   multi-consumer threshold (IDDD ch. 7).
5. **Cross-cutting role ✓.** Matchday operations cross-cut
   sporting (Match FSM), commercial (revenue), regulatory (safety
   + accessibility), narrative (atmosphere via Audience &
   Atmosphere) and brand (hospitality NPS). **No single existing
   context can host the cross-cutting surface without leaking
   outside its language.**
6. **Low co-change with neighbours ✗.** **The criterion does not
   fire cleanly.** Matchday FSM ties tightly to Match per-fixture
   FSM (rivalry classification at lineup_locked per ADR-0057;
   tactical lineup at lineup_locked per ADR-0055; weather affects
   pitch which affects Match engine). Facility decay weekly tick
   has moderate independence but matchday FSM has high coupling.
   **Co-change risk: changes to Match FSM (extra-time, VAR review
   pauses, evacuation protocols) propagate into Stadium's matchday
   timeline.**

**Total: 5/6 fire** (criterion 1 partial; criteria 2-5 fire;
criterion 6 does not fire). Five-of-six matches FMX-26 / 28 / 30 /
34 wave level; one criterion short of the FMX-29 / 33 wave high.

**Lean:** Option B (Hybrid named Aggregate) inside Club Management
with published contract surface is the cleanest landing for the
five-of-six profile. Option C (own BC) is defensible per F3.1
DDD authority + F5.1 real-world separation evidence (Bayern, BVB,
Spurs, Real Madrid legal-entity-level separation) but the matchday-
FSM coupling to Match makes it premature for MVP. Reserve Option C
for a future audit beat after MVP if matchday coupling holds.

#### F4.2 — Audience & Atmosphere (6/6 fire)

1. **Own ubiquitous language ✓ strong.** Segment, loyalty,
   volatility, mood, atmosphere, engagement, utilisation
   probability, waitlist pressure, ticketing trust, propensity,
   fan politics, choreo, boycott, ouster-call, trust-shock memory,
   reference-price, price-sensitivity, latent demand, fixture
   attractiveness, atmosphere multiplier. **Fully distinct from
   Club Management's ledger / budget / board-pressure / insolvency
   language.** Cross-genre support: CK3 vassal opinion, Civ VI
   loyalty, Cities Skylines district mood all carry distinct
   languages independent of their parent economy / governance
   contexts.
2. **Own FSM ✓ partial.** Segment mood state per fan-ecology.md
   §2-3 (mood -100..+100 + loyalty lag + attendance-floor
   thresholds + politics-event triggers: choreo, protest, ticket
   boycott, ouster-call). Per-segment cohort FSM (latent →
   active → mobilised → politicised → reconciled). FMX-43
   adds 8-state season-ticket campaign FSM that lives partially
   here (renewal-window + waitlist-allocation cohort dynamics)
   and partially in Ticketing & Settlement (the campaign
   commercial settlement). **Partial fire** because Audience &
   Atmosphere does not yet have a single canonical aggregate FSM
   in `state-machines/`; sub-FSMs (mood, politics-event, campaign-
   participation) are inline in `fan-ecology.md` §2-5.
3. **Own storage ✓.** Per-segment population, per-segment state
   (loyalty, mood, volatility), atmosphere history, fan-incident
   log, ticketing-trust-state per segment, politics-event log,
   renewal probability per segment, named-group overlay per
   `fan-ecology.md` §5a. Per-save schema per ADR-0027.
4. **Multiple consumers ✓ strong.** Club Management
   (`FanDemandForecast` for ticketing + commercial contracts per
   ADR-0058 §input facts); Rivalry System (`FanIncidentLogged`
   as fan-incident sub-score per ADR-0057); Matchday-Event-Engine
   (atmosphere multiplier + security risk input); Notification
   (fan-politics events as narrative pipeline per ADR-0043);
   Manager & Legacy (future archetype-style signal per GD-0019);
   CommercialPortfolio (segment fit for sponsor-category alignment
   per `sponsorship-portfolio.md` §3); Ticketing & Settlement
   (latent demand + trust state for pricing + renewal probability
   per `fan-demand-price-elasticity-2026-05-28.md`). **Seven
   consumers** strongly matching Vernon's multi-consumer threshold
   — same firing level as ADR-0057 Rivalry's "10+ consumers"
   justification.
5. **Cross-cutting role ✓ strong.** Segment mood is **economic
   signal** (Club ledger via `FanDemandForecast`) **and
   regulatory signal** (UEFA SLO supporter-relations obligations)
   **and atmosphere signal** (Matchday-Event-Engine + match home
   advantage) **and political signal** (board pressure +
   ouster-call) **and brand signal** (sponsor-fit risk per
   sponsorship-portfolio.md §3) **and persona signal** (named-
   group dialogue scenes via Narrative per ADR-0054). **Six
   cross-cutting roles.** No single existing context can host
   without language leak.
6. **Low co-change with neighbours ✓.** Atmosphere weekly tick
   updates segment state regardless of ledger postings; segment
   loyalty evolves independently of Club Management budget cycle;
   fan-politics triggers fire on threshold crossings independent
   of fixture schedule. The atmosphere loop **is conceptually
   independent** of Club's economy-week tick per F3.2's
   resolution of the Fan Ecology weekly-loop independence
   question. **Co-change risk is low:** changes to A&A scoring
   formula (segment elasticity coefficients, atmosphere
   multipliers, trust-decay rates) do not propagate into Club
   Management ledger logic.

**Total: 6/6 fire.** Matches the FMX-29 / 33 wave high; stronger
than FMX-26 / 28 / 30 / 34.

**Lean:** Option C (own bounded context) with the recommended
naming **Audience & Atmosphere** (evocative, distinct from
real-world "Fan Engagement" department titles, captures both the
segment audience and the matchday-mood loop). Spin off to
**ADR-0062 `audience-and-atmosphere-context`** per the FMX-32
plan §2 trigger condition (six-of-six firing for any candidate
warrants Option C spin-off). ADR-0061 references back to ADR-0062.

#### F4.3 — CommercialPortfolio (6/6 fire)

1. **Own ubiquitous language ✓ strong.** Asset class, side
   condition, fit / risk, exclusivity category, cash cadence,
   recognition period, asset value, brand-safety, utilisation
   factor, media resonance, asset inventory taxonomy (jersey
   front / sleeve / shorts / training / stadium name / stand
   naming / VIP suites / LED boards / app banner / fan-zone
   activation / catering exclusivity), partnership tier (Tier 1
   strategic / Tier 2 official / Tier 3 regional), activation
   plan, fill rate. **Distinct from Club Management's ledger /
   budget / insolvency language.** Real-world support: top clubs
   (Real Madrid, Barcelona, Bayern) explicitly structure their
   organisation as "Área de Negocio" / "Área de Ingresos" /
   "Marketing, Sponsoring & Events" board roles **distinct from
   the financial area**.
2. **Own FSM ✓.** Contract lifecycle per `sponsorship-portfolio.md`
   §6: `Available → Negotiating ⇄ Active → Renewing ⇄
   Terminated + Cool-down`. FMX-44 adds shared `CommercialContract`
   lifecycle covering ticketing / catering / merchandise /
   hospitality / sponsorship. Each contract is independent of
   Club ledger week-tick — renewals fire on contract-term
   boundary, not weekly. **Currently documented inline in
   `sponsorship-portfolio.md` §6, not in `state-machines/`**
   (separable cleanup ticket).
3. **Own storage ✓.** Contract tables (term, renewal window, break
   clauses, cash cadence, recognised revenue period, performance
   bonuses / penalties, exclusivity category, side-conditions,
   termination rules), asset inventory + slot allocation, asset
   valuation snapshots, exclusivity graph, breach case log,
   activation-plan delivery tracker, fan-event campaign log.
   Per-save schema per ADR-0027.
4. **Multiple consumers ✓.** Club Management (ledger posting +
   InvestorCashGrantPosted per ADR-0050); Audience & Atmosphere
   (segment-fit risk for sponsor-category alignment); Stadium /
   Venue Operations (asset-inventory for LED + stadium naming +
   fan-zone activations + hospitality); Rivalry System (rivalry
   commercial signal for sponsor-fit + pricing per ADR-0058
   §input facts); Manager & Legacy (commercial-success archetype
   signal via GD-0019); Regulations & Compliance (FSR / PSR /
   APT fair-value documentation + DSGVO sponsor-partner data +
   exclusivity vs EU competition law); Notification (sponsor
   activation copy + renewal-due alerts). **Seven consumers.**
5. **Cross-cutting role ✓ strong.** **CommercialPortfolio drives
   40-60% of revenue at top clubs** per Deloitte Money League
   2024-2026 + KPMG Football Benchmark; the regulatory anchor
   (UEFA FSR fair-value related-party assessment + Premier League
   PSR Associated Party Transaction rules + La Liga PSR + GDPR
   Art. 6 sponsor-partner data + DSA Art. 16 sponsored content
   moderation + EU competition law exclusivity + Bundesliga 50+1
   ownership-related sponsor deals) is **intrinsic to commercial
   model design**, not Finance design. No single existing context
   can host this regulatory surface without leaking outside its
   language.
6. **Low co-change with neighbours ✓.** Contract lifecycle is
   term-based (not weekly); side-condition evaluation is
   contract-specific; asset valuation recalculation is on
   sponsor-onboarding boundary not weekly tick. **Co-change risk
   is low:** changes to contract clause taxonomy or valuation
   formula or exclusivity rules do not propagate into Club
   Management ledger structure (only the posted ledger entries
   change shape).

**Total: 6/6 fire.** Matches FMX-29 / 33 wave high.

**Lean:** Option C (own bounded context). Naming
**`CommercialPortfolio`** (covers Sponsorship + Catering + Merch +
Hospitality + Ticketing & Settlement umbrella per Nico's locked
decision in the plan). Real-world organisational pattern is
decisive: CCO peer of CFO at all surveyed clubs; sponsorship sits
inside commercial department, not finance.

#### F4.4 — Ticketing & Commercial Settlement (6/6 fire)

1. **Own ubiquitous language ✓ strong.** Price grid, seat-class
   inventory (standing / seating / family / premium / suite /
   accessibility / away allocation), opponent-tier multiplier,
   top-match premium, season-ticket campaign state, renewal
   window, seat relocation, member presale, waitlist allocation,
   public sale, in-season adjustment, renewal review, no-show
   release, deferred revenue, instalment receivable, refund
   liability pool, accrual schedule, performance obligation,
   contract liability, finance-partner fee, secondary-market
   resale, accessible-ticket eligibility, IFRS 15 5-step model.
   **Fully distinct from Club Management's
   chart-of-accounts / journal / period-close / FFP-ratio
   language.**
2. **Own FSM ✓.** 8-state season-ticket campaign FSM (FMX-43)
   plus per-fixture settlement Saga (gate count by class × class
   price − discounts + catering + merchandise share +
   hospitality) plus contract-lifecycle FSM for hospitality
   suites + per-product accrual schedule FSM (cash receipt →
   deferred revenue → match-by-match recognition → refund-
   liability release on no-show / postponement). **Strongest FSM
   surface in the wave.**
3. **Own storage ✓.** Season-ticket-cohort tables, instalment
   receivable tables, deferred-revenue schedule, refund-liability
   pool tables, no-show release log, accessible-ticket
   allocation log, secondary-market resale log, hospitality-suite
   contract log, fixture-settlement event store. Per-save schema
   per ADR-0027.
4. **Multiple consumers ✓.** Club Management (ledger postings via
   settlement events); CommercialPortfolio (campaign-portfolio
   view of season-ticket revenue); Audience & Atmosphere (no-show
   per segment + trust state per segment from pricing decisions);
   Stadium / Venue Operations (seat-class inventory + accessibility
   allocation); Regulations & Compliance (UEFA FSR matchday
   reporting + DFL stadium revenue reporting + UK CRA 2015
   Schedule 2 refund-policy compliance + EU DSA secondary-market
   + CEN-EN 17210 accessibility quota + GDPR Art. 6 / 9 ticket-
   buyer data); Notification (renewal-due alerts + waitlist-
   allocation outcome); Manager & Legacy (commercial-success
   archetype signal). **Seven consumers.**
5. **Cross-cutting role ✓ strong.** **Strongest regulatory anchor
   in the wave:** IFRS 15 / ASC 606 5-step rev-rec model is a
   distinct functional domain mapped to performance obligations;
   UEFA FSR matchday-segregation; DFL Lizenzhandbuch separate
   disclosure of matchday revenue; UK Consumer Rights Act 2015
   Schedule 2 unfair terms; EU Digital Services Act 2022/2065 on
   secondary-market platforms (StubHub, Viagogo); CEN-EN 17210
   accessibility compliance; EU Late Payment Directive
   2011/7/EU; GDPR Art. 6 + 9 ticket-buyer + season-ticket-holder
   + accessible-ticket data. Six concurrent regulatory frameworks.
   No single existing context can host without language leak.
6. **Low co-change with neighbours ✓.** Accrual schedule is
   per-performance-obligation independent of weekly economy
   tick; refund-liability pool evolves on
   postponement / cancellation events not weekly; instalment
   receivable tracking evolves on payment-plan boundary;
   secondary-market resale evolves on resale-event boundary.
   **Co-change risk is low:** IFRS 15 rule changes (e.g. revised
   transaction-price allocation rules) do not propagate into
   Club Management ledger schema, only into the
   revenue-recognition module that supplies ledger events.

**Total: 6/6 fire** with the strongest regulatory anchor in the
wave.

**Lean:** **Sub-Aggregate inside CommercialPortfolio** (if
CommercialPortfolio = Option C). Even though Ticketing &
Settlement fires six-of-six on its own, the airline yield
management + revenue accounting + Stripe Billing-vs-Ledger
analogue evidence supports nesting Ticketing & Settlement as the
primary Aggregate Root inside CommercialPortfolio rather than
splitting it again. **Fallback:** if Nico ratifies Option B
(Hybrid) for CommercialPortfolio instead of Option C, promote
Ticketing & Settlement to **own Settlement BC** because the
8-state campaign FSM + IFRS 15 accrual schedule + credit-
liability pool would warrant separation from a sub-aggregate-of-
Club CommercialPortfolio.

### F5 — Real-world football operations structure (Perplexity Q1.3 / 2.3 / 3.3 / 4.3)

**Source:**
[[raw-perplexity/raw-club-management-sub-aggregate-audit-2026-05-28]]
§§ Q1.3 / Q2.3 / Q3.3 / Q4.3 (UEFA Stadium Infrastructure
Regulations 2024, Premier League Ground Regulations +
Sustainability Strategy 2030, DFL Lizenzhandbuch, FA EPPP, SGSA
Green Guide, CEN-EN 17210, UEFA Financial Sustainability
Regulations, Premier League PSR + APT, La Liga PSR, GDPR Art. 6 /
9, EU DSA, EU competition law, Bundesliga 50+1, IFRS 15 / ASC
606, UK Consumer Rights Act 2015 Schedule 2, EU Late Payment
Directive 2011/7/EU, Deloitte Money League 2024-2026, KPMG
Football Benchmark 2024, club annual reports for Bayern Munich +
Borussia Dortmund + FC Barcelona + Real Madrid + Manchester City +
Manchester United + Liverpool FC + Tottenham Hotspur + Inter
Milan + Atlético Madrid + PSG).

**Confidence:** high for Stadium / CommercialPortfolio / Ticketing &
Settlement (Deloitte + UEFA + IFRS 15 case studies + multi-club
annual report evidence); low for Audience & Atmosphere (Perplexity
Q2.3 flagged sourcing gap on club-by-club governance specifics —
the dossier therefore relies on the SLO regulatory anchor and the
F3.2 DDD authority as primary evidence rather than per-club org
charts).

**F5.1 — Stadium / Venue Operations.** Top-tier European clubs
2023-2026 organise stadium / venue operations as a non-sport
business-side function reporting into CEO / COO or a Business
Operations / Operations board member — **not into the Sporting
Director**. Within that, **there is often a dedicated stadium /
arena company with own management and P&L**:

- **Bayern Munich → Allianz Arena München Stadion GmbH.** Separate
  legal entity with own MD reporting to FC Bayern AG Vorstand;
  facility management, maintenance, security, matchday operations,
  non-matchday events all inside the GmbH.
- **Borussia Dortmund → BVB Stadionmanagement GmbH.** Separate
  GmbH owning all stadium infrastructure and matchday operations
  + non-matchday use + stadium tours. Own Geschäftsführer.
- **Tottenham Hotspur → Stadium business as dedicated internal
  Stadium / Venues division** under board member for Operations /
  Venues. Multi-sport venue (NFL partnership) with own
  Non-Football Events & NFL liaison team. Own commercial event
  business with P&L responsibility.
- **Real Madrid → Bernabéu commercial JV with Legends + Sixth
  Street.** Stadium exploitation (non-football events,
  hospitality, tours) partially carved out into commercial JV
  with own revenue-sharing model. Operationally stadium remains
  within club's infrastructure area; commercial rights have
  **quasi-separate P&L at JV level**.
- **Manchester United, Manchester City, Liverpool, FC Barcelona,
  Inter Milan** run stadium as **major internal division** with
  own director / VP reporting to COO / Managing Director — not
  to Finance or Sporting.

**Multi-regulator surface:** UEFA Stadium Infrastructure
Regulations 2024 (Cat 1-4); Premier League Ground Regulations +
Sustainability Strategy 2030; DFL Lizenzhandbuch facility
requirements; FA EPPP Cat 1-4 venue requirements; SGSA Green
Guide safety management; CEN-EN 17210 accessibility. **Parallel
regulatory sub-domain** that stadium operations must satisfy
independent of sporting decisions.

**Implication for FMX-32.** Real-world organisational evidence is
the strongest pro-Option-C signal for Stadium in the wave —
multiple clubs already legally separate stadium operations into
own GmbH / division with own director, own P&L, own multi-
regulator framework. **However**, the F4 six-of-six scoring fires
only 5/6 (matchday FSM coupling to Match), so the dossier still
recommends Option B (Hybrid) as the cleaner landing for MVP and
notes Option C as defensible future-scope.

**F5.2 — Audience & Atmosphere.** Perplexity Q2.3 flagged sourcing
gap on club-by-club governance specifics. What can be safely said:

- **SLO (Supporter Liaison Officer)** mandate is UEFA Club
  Licensing requirement (since 2010, reinforced 2024-2025).
- **DFB-DFL Sicherheitsfaktoren + SLO-Konzept** in Germany.
- **Premier League Independent Fan Advisory Boards** mandated
  2024-2025.
- Fan engagement commonly treated as commercial / digital
  capability under Marketing / Commercial / CRM — **not as
  autonomous support function**, except where the SLO and
  ticketing-trust functions intersect with safety + supporter-
  group representation.
- **FC St. Pauli's fan-led governance model** is conceptually
  distinct from investor-led clubs but the dossier evidence is
  inference, not source-grounded.

**Regulatory anchor (provisional):**
- GDPR Art. 6 lawful basis for supporter-segment data (consent,
  legitimate interest, contract performance).
- GDPR Art. 9 special-category data — religious / political
  affiliation captured implicitly by ultras groups or anti-racism
  networks.
- DSA Art. 16 notice-and-action obligations on user-generated
  content from supporter groups.
- UEFA Club Licensing SLO requirement + national league SLO
  concepts.

**Implication for FMX-32.** Real-world organisational evidence is
weaker than for Stadium or CommercialPortfolio but the SLO
regulatory anchor + segment-specific GDPR concerns + DSA UGC
obligations form a distinct **regulatory subdomain** that Club
Management cannot cleanly own without leaking into its language.
This is the second-strongest pro-Option-C signal after the F3.2
DDD authority. **Spawn follow-up ticket FMX-54** (Fan Ecology
persona privacy & creative-IP-safe-naming review, already created
2026-05-28) to harden the regulatory framing post-MVP.

**F5.3 — CommercialPortfolio.** Decisive. Top-tier European clubs
2023-2026 run commercial activities (sponsorship, ticketing,
hospitality, retail / merchandising, catering) as a **dedicated
business line under a Chief Commercial Officer / Chief Revenue
Officer-type role**, typically a **peer of the CFO reporting to
CEO or club board**. Sponsorship sits inside commercial
department, not isolated finance function.

- **Real Madrid:** *Memoria Anual* distinguishes "Área de Negocio"
  from "Área Económica-Financiera". Commercial = sponsorship,
  licensing, retail, ticketing, hospitality, digital content.
  **Head of Business / Commercial Director peer of Finance
  Director, both reporting to Director General / President.**
- **FC Barcelona:** *Memoria Anual* splits into "Área de Ingresos"
  and "Área Financiera". Revenue area = Sponsorship & Licensing +
  Ticketing & Hospitality + Merchandising + Digital / Media.
  **Commercial / revenue chief parallel to CFO.**
- **FC Bayern München:** Executive Board includes members for
  "Finance" and "Marketing, Sponsoring & Events". **Marketing /
  Sponsoring board member as direct peer of Finance board member**,
  both reporting to CEO / Chairman.
- **Manchester United (PLC):** 20-F segment reporting separates
  "Commercial" as business segment alongside broadcasting and
  matchday. Commercial = sponsorship, retail, merchandising,
  apparel & product licensing, mobile & content. **Commercial as
  operating segment, not sub-function of Finance.**
- **Manchester City / City Football Group, Liverpool FC, Borussia
  Dortmund, Inter Milan, PSG** all follow the same CCO-peer-of-CFO
  pattern.

**Portfolio scale.** Top-10 clubs typically have **40-80+ active
commercial contracts** (1-3 Principal / Main Partners + 10-25
Global / Official Partners + 20-50+ Regional partners). Commercial
revenue is **40-60% of total operating revenue** at top clubs;
Deloitte 2026 Money League shows top 20 clubs total commercial
revenue ~€5.3bn out of ~€12.4bn (~43%). Real Madrid commercial
~€594m of €1.161bn (~51%). **Commercial = main competitive
differentiator.**

**Multi-regulator surface:** UEFA Financial Sustainability
Regulations 2024 (related-party transactions + fair-value);
Premier League PSR + Associated Party Transaction rules
(Manchester City, PSG cases); La Liga PSR (Barça); GDPR Art. 6
sponsor-partner data; DSA Art. 16 sponsored content; EU
competition law on exclusivity clauses; Bundesliga 50+1 on
ownership-related sponsor deals. **Intrinsic to commercial model
design**, not Finance design.

**Implication for FMX-32.** Real-world organisational evidence
**decisively supports Option C** (own bounded context). The
CCO-peer-of-CFO pattern is universal across top clubs; commercial
is a **first-class business domain with own leadership and P&L**;
the regulatory anchor is intrinsic to commercial model design.
Strongest pro-Option-C signal in the wave.

**F5.4 — Ticketing & Commercial Settlement.** Distinct operational
+ accounting + regulatory domain at top-tier clubs 2023-2026.

**Org structure pattern:**
- **Ticketing & Membership** functionally sits under **commercial
  side (CCO / Chief Revenue Officer)** rather than Finance.
- **Accounting / settlement side** (deferred revenue, receivables,
  refunds) sits under CFO.
- Matchday operations (turnstiles, stewards, safety) usually under
  COO / Stadium Operations Director.
- **Matrix not clean silo:** commercial owns pricing and sales;
  operations owns delivery; finance owns recognition and
  settlement.

**Yield management trend 2023-2026:** post-Liverpool / Tottenham
dynamic pricing controversies, top clubs (Liverpool, Spurs, Man
City, Bayern, PSG) created or strengthened **Pricing & Yield /
Revenue Management functions distinct from day-to-day ticket
ops**, reporting directly to CCO / Chief Revenue Officer.
Formal approval tiers for pricing changes (board / CEO sign-off
for Cat A+ moves).

**IFRS 15 accounting practice** (consistent across BVB, Real
Madrid, Barça, Man United):
- Cash received before season → **contract liability / deferred
  income** for performance obligation; revenue recognised
  **pro rata temporis** over home matches.
- Multi-match performance obligation typically allocated over
  19-20 league home games + cups using straight-line method
  unless clear price differentiation.
- Instalment receivables: third-party finance providers (Klarna,
  PayPal Pay Later) take instalment plan → club records cash
  net of fee + deferred revenue liability; club-owned scheme →
  receivable + finance income + ECL.
- **Refund liability pools** for away allocation refunds +
  postponed match refunds + behind-closed-doors refunds —
  separate from contract liability for performance.
- **Hospitality / suite revenue** = multi-component (matchday
  access + non-matchday services + catering); consideration
  allocated across distinct performance obligations.

**Multi-regulator surface** (six concurrent frameworks):
- UEFA FSR on matchday "relevant income" + separate matchday
  reporting requirement.
- DFL Lizenzhandbuch on separate disclosure of matchday revenue +
  intra-group settlement when stadium in separate legal entity
  (Allianz Arena GmbH).
- UK Consumer Rights Act 2015 Schedule 2 on unfair terms +
  refund policies.
- EU Digital Services Act on secondary-market platforms (StubHub,
  Viagogo) → drives clubs toward official resale platforms.
- CEN-EN 17210 + UK Accessible Stadia Guide 2003 on accessibility
  inventory + utilisation reporting.
- EU Late Payment Directive 2011/7/EU on B2B commercial debt
  (30-60 day reference range) for corporate hospitality.
- GDPR Art. 6 + 9 on ticket-buyer + accessible-ticket data.

**Implication for FMX-32.** Real-world organisational evidence
**strongly supports Option C** (own Settlement / Revenue-
Recognition context) but the trend is toward **integrated
commercial portfolio** (single CCO umbrella over sponsorship +
ticketing + hospitality + retail), which fits the
**sub-Aggregate-inside-CommercialPortfolio** landing for FMX-32
better than a standalone Settlement BC. The yield-management-as-
distinct-role trend 2023-2026 supports Pricing / Yield as a named
sub-domain inside CommercialPortfolio.

### F6 — Cross-context integration pattern (synthesis)

**Source:** F3 Vernon Customer-Supplier + Process Manager +
Reference / Snapshot patterns applied to the FMX-32 candidates +
the current 16-context map.

**Confidence:** high.

If the working recommendation (B / C / C / sub-Aggregate-of-
CommercialPortfolio) is accepted, the cross-context integration
surface looks like:

| Integration | Pattern | Direction | Mechanism |
|---|---|---|---|
| `StadiumCommercialSnapshot` → CommercialPortfolio (Hospitality) | **Reference** | Stadium → CommercialPortfolio | CommercialPortfolio queries Stadium for capacity + hospitality inventory before signing a hospitality contract. |
| `StadiumCommercialSnapshot` → Club Management (ledger inputs for matchday + non-matchday revenue) | Customer-Supplier + ACL | Stadium → Club Management | Stadium named-Aggregate publishes weekly snapshot; Club Management ACL translates to ledger entries per ADR-0050. |
| `MatchdayEventTriggered` (Pyro / weather / capacity incidents) | Published Language | Stadium → Matchday-Event-Engine | Stadium publishes event triggers consumed by Matchday-Event-Engine per `matchday-event-engine.md` §3-4. |
| `FacilityComplianceCheck` (Safety Certificate, UEFA Cat 4, DFL Lizenzhandbuch facility tier) | Customer-Supplier | Stadium → Regulations & Compliance | Regulations evaluates facility compliance; Stadium consumes pass / fail + remediation orders. |
| `FanDemandForecast` → CommercialPortfolio (Ticketing & Settlement sub-Aggregate) | **Snapshot** | Audience & Atmosphere → CommercialPortfolio | Per-segment latent demand + reference price + ticketing-trust state consumed at season-ticket campaign opening + per-fixture pricing decision per `fan-demand-price-elasticity-2026-05-28.md`. |
| `FanIncidentLogged` → Rivalry System (fan-incident sub-score) | Published Language | Audience & Atmosphere → Rivalry | Per ADR-0057. |
| `SegmentAtmosphereSnapshot` → Matchday-Event-Engine (atmosphere multiplier + security risk) | Published Language | Audience & Atmosphere → Matchday-Event-Engine | Per `matchday-event-engine.md` §3 + `fan-ecology.md` §3-5. |
| `FanPipelineQualityUpdated` → Manager & Legacy (commercial-success archetype signal) | Published Language | Audience & Atmosphere → Manager & Legacy | Per GD-0019 archetype hook aggregation. |
| `FanCampaignParticipationSnapshot` → CommercialPortfolio (fan-event campaigns funding) | Reference | Audience & Atmosphere → CommercialPortfolio | CommercialPortfolio reads fan campaign participation forecast when scheduling sponsor-funded fan-event campaigns. |
| `CommercialContractActivated` / `CommercialContractRenewalDue` / `CommercialBreachOpened` / `CommercialBreachResolved` / `CommercialContractTerminated` → Club Management (ledger postings) | Customer-Supplier + ACL | CommercialPortfolio → Club Management | Settlement events consumed by Club Management ledger per ADR-0050; ACL translates to chart-of-accounts. |
| `MatchdayCommercialSettlementPosted` (per-fixture settlement: gate + class × price + catering + merch + hospitality) | Customer-Supplier + ACL | CommercialPortfolio (Ticketing & Settlement sub-Aggregate) → Club Management | Per-fixture Saga emits final settlement event; Club Management ACL posts ledger entries; deferred-revenue release tracked inside CommercialPortfolio. |
| `SeasonTicketCampaignClosed` → Audience & Atmosphere (renewal-cohort feedback) | Reference | CommercialPortfolio → Audience & Atmosphere | Renewal outcomes per segment feed back into A&A's segment-state evolution. |
| `InvestorCashGrantPosted` → Club Management (singleplayer Investor entitlement) | Customer-Supplier | CommercialPortfolio → Club Management | Per ADR-0058. |
| `CommercialFairValueAssessment` → Regulations & Compliance (UEFA FSR + PL APT + La Liga PSR documentation) | Customer-Supplier + ACL | CommercialPortfolio → Regulations | Regulations evaluates related-party + fair-value; CommercialPortfolio consumes pass / fail + remediation requirements. |
| `CommercialContractCommercialSignal` ← Rivalry System | Reference | Rivalry → CommercialPortfolio | Per ADR-0058 §input facts. |
| `FixtureCommercialProfile` ← League Orchestration | Reference | League → CommercialPortfolio | Per `club-economy-commercial-contracts.md` §FixtureCommercialProfile. |
| `Audience-Atmosphere annual Process Manager` (atmosphere weekly tick + season-ticket campaign opening + segment-mood update + ouster-call escalation) | **Saga inside Audience & Atmosphere BC** | — | Orchestrates weekly atmosphere loop → segment cohort update → campaign-cohort feedback → fan-politics trigger evaluation. |
| `CommercialPortfolio Process Manager` (contract lifecycle Saga + breach resolution + renewal-window evaluation + season-ticket campaign lifecycle + per-fixture settlement Saga) | **Saga inside CommercialPortfolio BC** | — | Orchestrates Available → Negotiating → Active → Renewing → Terminated FSM + breach detection + IFRS 15 accrual schedule + refund-liability evaluation. |

The pattern matches FMX-29 (Process Manager + Snapshot per Vernon
canonical) and FMX-33 (Process Manager + Open Host Service per
Vernon canonical).

## Inputs for decisions

If Option C is accepted for Audience & Atmosphere (ADR-0062 spin-
off) and CommercialPortfolio (inside ADR-0061), the dossier
proposes the following surface for each new BC. Final names and
contracts subject to Nico ratification.

### Audience & Atmosphere — proposed surface

- **Owner.** Audience & Atmosphere bounded context.
- **Aggregates.**
  - `SupporterSegment` (per-club, per-segment): segment population,
    loyalty floor, mood, volatility, attendance probability,
    season-ticket renewal probability, price sensitivity,
    ticketing-trust state, propensity (catering / merch /
    hospitality / sponsor-fit).
  - `AtmosphereSnapshot` (per-club, per-fixture): atmosphere
    multiplier derived from rivalry × table × utilisation ×
    form × weather × security × choreo participation.
  - `FanIncident` (per-club, per-incident): choreo, protest
    banner, ticket boycott, ouster-call, scarf-down. Threshold-
    triggered state machine.
  - `TicketingTrustLedger` (per-club): persistent trust state
    with shock memory (3-season decay) per
    `fan-demand-price-elasticity-2026-05-28.md` §Trust state.
  - `NamedSupporterGroup` (per-club, per-group): named ultras /
    curva representatives with persona overlay. **Subject to
    follow-up FMX-54 privacy + creative-IP-safe-naming review.**
- **Public contract direction.**
  - Commands: `RecordFanIncident`, `RegisterChoreoCampaign`,
    `ConfirmBoycottThreshold`, `ResetTicketingTrustShock`,
    `OnboardNamedSupporterGroup` (FMX-54-gated).
  - Events: `FanDemandForecasted`, `FanIncidentLogged`,
    `AtmosphereSnapshotPublished`, `SegmentRenewalProbabilityUpdated`,
    `TicketingTrustStateChanged`, `OusterCallEscalated`,
    `FanPipelineQualityUpdated`.
  - Read models: `FanDemandForecast`, `AtmosphereSnapshot`,
    `SegmentMoodBoard`, `TicketingTrustStateSnapshot`,
    `FanIncidentTimeline`, `NamedSupporterGroupRoster`,
    `OusterCallEscalationBoard`.
  - Consumed facts: `RivalryTierTransitioned` from Rivalry
    System (ADR-0057); `MatchResolved` from Match;
    `SeasonAdvanced` from League Orchestration;
    `StadiumCapacitySnapshot` from Stadium (or Club Management if
    Stadium stays sub-aggregate); `SeasonTicketCampaignClosed`
    from CommercialPortfolio.
- **Determinism + storage rules.**
  - Per-save schema only (`save_<uuidv7hex>` per ADR-0027).
  - Weekly atmosphere tick uses
    `AtmosphereRng(saveId, clubId, week)` sub-label of `WorldRng`
    per ADR-0018 §3.
  - All cohort state transitions via deterministic clocks; no
    `Date.now` / `Math.random`.
  - Domain events through ADR-0028 transactional outbox.
  - **GDPR / DSGVO posture:** segment-level aggregate state only;
    no individual fan records; named-group overlay consents
    flow through FMX-54 follow-up.
  - **DSA Art. 16 posture:** fan-incident log queryable for
    notice-and-action workflows; community-overlay imports per
    ADR-0059 validated by Audience & Atmosphere BC.

### CommercialPortfolio — proposed surface

- **Owner.** CommercialPortfolio bounded context (covers
  sponsorship + catering + merchandise + hospitality + ticketing
  & commercial settlement umbrella).
- **Aggregates.**
  - `CommercialContract` (per-club, per-contract): unified shell
    across sponsorship + catering + merchandise + hospitality +
    season-ticket bundles per FMX-44.
  - `AssetInventory` (per-club): jersey front / sleeve / shorts /
    training / stadium-name / stand-naming / VIP-suites / LED-
    boards / app-banner / fan-zone-activation / catering-
    exclusivity slots with allocation state.
  - `ExclusivityGraph` (per-club): category-exclusivity edges (no
    two breweries, no two energy drinks).
  - `SeasonTicketCampaign` (per-club, per-season): 8-state FSM
    per FMX-43.
  - `FixtureSettlement` (per-club, per-fixture): per-fixture
    settlement Saga combining gate + class × price + catering +
    merch share + hospitality.
  - `AccrualSchedule` (per-contract, per-performance-obligation):
    IFRS 15 5-step model state.
  - `CreditLiabilityPool` (per-club, per-fixture): refund /
    no-show / postponement liability.
  - `InstalmentReceivable` (per-club, per-payer): payment-plan
    state.
  - `CommercialFairValueAssessment` (per-contract): related-party +
    fair-value documentation for UEFA FSR + PL APT + La Liga PSR.
  - `FanEventCampaign` (per-club, per-campaign): paid fan-service
    campaign (away trains, family / summer events, choreo
    support, beer-per-goal activations) per `club-economy-impact-
    map-and-commercial-contracts-2026-05-28.md`.
- **Public contract direction.**
  - Commands: `IssueCommercialOffer`, `CounterCommercialOffer`,
    `AcceptCommercialOffer`, `AmendCommercialContract`,
    `RenewCommercialContract`, `OpenCommercialBreach`,
    `ResolveCommercialBreach`, `TerminateCommercialContract`,
    `OpenSeasonTicketCampaign`, `AdvanceSeasonTicketCampaign`,
    `CloseSeasonTicketCampaign`, `SetTicketingPolicy`,
    `SetMatchdayCommercialPolicy`, `ScheduleFanEventCampaign`,
    `ApplyInvestorEntitlementGrant`,
    `RecordCommercialFairValueAssessment`,
    `RegisterAccessibleAllocation`, `ReleaseUnusedTicket`.
  - Events: `CommercialContractActivated`,
    `CommercialContractRenewalDue`,
    `CommercialContractRenewed`, `CommercialBreachOpened`,
    `CommercialBreachResolved`, `CommercialContractTerminated`,
    `SeasonTicketCampaignAdvanced`, `SeasonTicketCampaignClosed`,
    `TicketingPolicyChanged`, `MatchdayCommercialSettlementPosted`,
    `InvestorCashGrantPosted`, `FanEventCampaignScheduled`,
    `CommercialFairValueAssessed`, `RefundLiabilityRecognised`,
    `RefundLiabilityReleased`, `DeferredRevenueRecognised`.
  - Read models: `CommercialContractPortfolio`,
    `CommercialForecastSnapshot`, `AssetInventoryDashboard`,
    `ExclusivityGraphSnapshot`, `SeasonTicketCampaignBoard`,
    `MatchdayCommercialSettlement`, `RefundLiabilitySnapshot`,
    `InstalmentReceivableAging`, `FairValueEvidencePack`,
    `FanEventCampaignCalendar`.
  - Consumed facts: `FanDemandForecast` from Audience &
    Atmosphere; `StadiumCommercialSnapshot` from Stadium (or
    Club Management); `RivalryTierTransitioned` from Rivalry;
    `FixtureCommercialProfile` from League Orchestration;
    `CurrentTransferWindow` + `EffectiveRuleSet` from Regulations
    & Compliance; `MatchResolved` from Match.
- **Determinism + storage rules.**
  - Per-save schema only (`save_<uuidv7hex>` per ADR-0027).
  - Sponsor-onboarding RNG sub-label
    `CommercialRng(saveId, clubId, season)` per ADR-0018 §3.
  - All accrual schedule transitions via deterministic clocks.
  - Domain events through ADR-0028 transactional outbox.
  - **IFRS 15 posture:** per-performance-obligation accrual
    schedule; cash receipt → contract liability → match-by-match
    recognition; instalment receivables tracked separately with
    ECL per IFRS 9.
  - **UEFA FSR / PL APT / La Liga PSR posture:** every related-
    party CommercialContract carries a `CommercialFairValueAssessment`
    aggregate evidencing market benchmarking; Regulations
    consumes for compliance reporting.
  - **GDPR / DSGVO posture:** sponsor-partner data access governed
    by data-processing agreements; per-buyer ticket data
    segregated with explicit consent for marketing activations.
  - **DSA Art. 16 posture:** sponsored-content moderation queue
    queryable; secondary-market resale platform integration
    audited.
  - **CEN-EN 17210 + UK Accessible Stadia Guide posture:**
    `AccessibleAllocation` sub-aggregate with verified-eligibility
    state; utilisation reporting to Regulations.

### Stadium / Venue Operations — proposed surface (Option B)

If Option B (Hybrid named Aggregate inside Club Management) is
accepted, the candidate becomes a **named Aggregate
`StadiumOperations`** inside Club Management with a published
contract surface. No new bounded context. The named Aggregate
gets:

- **Sub-aggregates.**
  - `MatchdayTimeline` (per-fixture): matchday FSM.
  - `FacilityCondition` (per-facility): age + decay + maintenance
    project lifecycle.
  - `VenueEventCalendar` (per-club): non-matchday event bookings.
  - `SeatClassInventory` (per-club): capacity by class + accessible
    + family + premium allocation.
  - `HospitalityInventory` (per-club): suite + box inventory
    (revenue accounting in CommercialPortfolio).
- **Public contract direction.**
  - Events: `StadiumCommercialSnapshotPublished`,
    `MatchdayTimelineAdvanced`, `MatchdayEventTriggered`,
    `PitchConditionChanged`, `FacilityComplianceChecked`,
    `VenueEventBooked`, `VenueEventCompleted`,
    `MaintenanceProjectScheduled`, `MaintenanceProjectCompleted`,
    `SeatClassInventoryRebalanced`.
  - Read models: `StadiumCommercialSnapshot`,
    `StadiumCapacitySnapshot`, `MatchdayTimelineBoard`,
    `FacilityComplianceSnapshot`, `VenueEventCalendarBoard`,
    `PitchQualitySnapshot`, `HospitalityInventorySnapshot`.
- **Determinism + storage rules** unchanged from ADR-0050 +
  ADR-0027.

### Ticketing & Commercial Settlement — proposed surface (sub-Aggregate inside CommercialPortfolio)

Already covered in CommercialPortfolio proposed surface above.
Primary Aggregates: `SeasonTicketCampaign`, `FixtureSettlement`,
`AccrualSchedule`, `CreditLiabilityPool`, `InstalmentReceivable`,
`AccessibleAllocation`.

If Nico ratifies Option B for CommercialPortfolio instead of
Option C, Ticketing & Settlement promotes to **own Settlement BC**
with the same Aggregate set as the primary domain (no longer
nested inside CommercialPortfolio).

## Why not Option A (Sub-aggregate inside Club Management)?

Per-candidate:

**Stadium / Venue Operations — why not A?**
- Five-of-six DDD criteria fire per §F4.1, including own
  ubiquitous language (partial), own FSM (matchday + facility
  decay), own storage, multiple consumers, cross-cutting role.
- Real-world organisational evidence is decisive: Bayern, BVB,
  Spurs, Real Madrid all have **separate legal entities or
  internal divisions** for stadium operations.
- Multi-regulator surface (UEFA Stadium Infrastructure + Premier
  League Ground + DFL Lizenzhandbuch + FA EPPP + SGSA Green
  Guide + CEN-EN 17210) is intrinsic to venue ops, not Finance.
- Same anti-pattern as FMX-26 ("Staff in Club Management") if
  forced as pure sub-aggregate without published contract surface.

**Audience & Atmosphere — why not A?**
- Six-of-six DDD criteria fire per §F4.2; strongest signal in the
  wave together with CommercialPortfolio and Ticketing &
  Settlement.
- Vernon IDDD scoring-context pattern: customer-affinity / loyalty /
  recommendation subdomains are **textbook separate BCs** in
  every real-world analogue (Salesforce Marketing Cloud, Schufa,
  Spotify recommendation, Tesco Clubcard).
- A&A's ubiquitous language (segment, mood, volatility, atmosphere,
  trust state, choreo, boycott) would pollute Club Management's
  ledger / FFP / board-pressure language.
- Cross-genre precedent is unanimous: CK3 vassal opinion, Civ VI
  loyalty, Cities Skylines districts, TW Three Kingdoms public
  order all promote audience / loyalty to own context.

**CommercialPortfolio — why not A?**
- Six-of-six DDD criteria fire per §F4.3.
- **Industry pattern is unanimous:** Salesforce CPQ, SAP S/4HANA
  Sales Contract, Stripe Connect, Guidewire PolicyCenter, Amdocs
  subscription lifecycle all separate contract management from
  Finance ledger. "General ledger with embedded contract FSM" is
  extremely rare in well-designed systems.
- Real-world CCO-peer-of-CFO pattern is universal across top
  clubs; sponsorship sits inside commercial department, not
  finance.
- Commercial revenue = 40-60% of total at top clubs; treating
  CommercialPortfolio as sub-aggregate **buries the strategic
  differentiator** inside a generic ledger context.
- Regulatory anchor (UEFA FSR + PL APT + La Liga PSR + GDPR +
  DSA + EU competition law + Bundesliga 50+1) is intrinsic to
  commercial model design.

**Ticketing & Commercial Settlement — why not A?**
- Six-of-six DDD criteria fire per §F4.4.
- Airline yield management + revenue accounting + Stripe Billing-
  vs-Ledger pattern is decisive: revenue-recognition is
  **canonically a separate BC** that posts summarized journal
  entries into GL. "Embedding rev-rec inside GL aggregate" is the
  anti-pattern Stripe + Salesforce + Zuora explicitly avoid.
- IFRS 15 5-step model + 8-state campaign FSM + credit-liability
  pool would inflate Club Management's aggregate beyond Vernon's
  small-aggregate rule.
- Multi-regulator surface (UEFA FSR + DFL + CRA Schedule 2 + DSA +
  CEN-EN 17210 + Late Payment Directive + GDPR Art. 6/9) is
  intrinsic to ticketing settlement, not Finance.

## Why not Option B (Hybrid named Aggregate inside Club Management)?

**Stadium / Venue Operations — why not B?** Option B is the
**recommended landing for Stadium** (see §Recommendation). Five-
of-six criteria fire which is the boundary level where Hybrid is
genuinely defensible. No "why not" — this is the proposed
landing.

**Audience & Atmosphere — why not B?**
- B is a **transitional state**, not a stable architecture.
  Once A&A has own published contract surface (which the wave-2
  ticket FMX-42 already established with `FanDemandForecast` +
  `ticketingTrustState`), the conceptual boundary already exists.
- B keeps the A&A scoring formula inside Club Management's
  modular surface, where Vernon ch. 10 small-aggregate rule fires
  — A&A's cohort + atmosphere + politics model is too big to be
  one Club aggregate.
- The "hybrid named aggregate" pattern is only useful when team /
  deployment constraints force colocation; in FMX-32 there is no
  such constraint.

**CommercialPortfolio — why not B?**
- Same as A&A: B is transitional. Once CommercialPortfolio has
  unified `CommercialContract` shell per FMX-44 with side-condition
  catalog + breach Process Manager, the conceptual boundary
  exists.
- Real-world organisational evidence is decisive: every top club
  treats commercial as own department with CCO peer of CFO. B
  fights this pattern.
- The 40-60% revenue share + regulatory anchor make
  CommercialPortfolio a **strategic core domain**, not a
  supporting sub-aggregate. B would bury the differentiator.

**Ticketing & Commercial Settlement — why not B?**
- If CommercialPortfolio = Option C: Ticketing & Settlement does
  not need its own BC; nesting inside CommercialPortfolio is
  cleaner. **Option B for Ticketing & Settlement is replaced by
  "primary Aggregate inside CommercialPortfolio."**
- If CommercialPortfolio = Option B: Ticketing & Settlement
  promotes to own Settlement BC (the F4.4 six-of-six firing is
  too strong to keep as sub-sub-aggregate).

## Why not Option C (own bounded context)?

**Stadium / Venue Operations — why not C?**
- Six-of-six does not fire (5/6 per §F4.1) — the
  low-co-change criterion fails because matchday FSM ties tightly
  to Match per-fixture FSM (extra-time + VAR review +
  evacuation protocols + lineup_locked + tactic-snapshot all flow
  through both contexts).
- The proposed Option B published contract surface
  (`StadiumCommercialSnapshot`, `MatchdayTimelineAdvanced`,
  `PitchConditionChanged`) is sufficient to give Stadium a
  named-Aggregate boundary without splitting it into own BC.
- Premature Option C would add a 17th-20th BC to the map for
  marginal benefit; future audit beat can revisit after MVP if
  matchday coupling holds.

**Audience & Atmosphere — why not C?** C is the **recommended
landing**. No "why not".

**CommercialPortfolio — why not C?** C is the **recommended
landing**. No "why not".

**Ticketing & Commercial Settlement — why not C?** Standalone
Settlement BC is **defensible but redundant** if CommercialPortfolio
= Option C. The airline yield-management + concert promoter
+ Stripe Billing-vs-Ledger pattern supports a single
CommercialPortfolio umbrella covering ticketing settlement, not
a separate Settlement BC alongside CommercialPortfolio.

## Future-scope notes (classified future-scope)

These items are referenced by the synthesis but are **not Option
ratification blockers**; they belong to subsequent beats:

1. **FSM extraction to `state-machines/`**. Stadium matchday FSM,
   facility-decay sub-FSM, season-ticket campaign 8-state FSM,
   commercial contract lifecycle FSM, breach Process Manager,
   refund-liability evaluation, A&A segment-mood FSM, A&A
   politics-event FSM all live inline in their GDDRs today. FMX-32
   does **not** extract them per the locked plan §6 ("strict
   boundary audit only; FSM extraction becomes follow-up
   ticket"). Spawn FMX-XX `FSM extraction batch` after FMX-32
   ratifies.

2. **FMX-54 Fan Ecology persona privacy & creative-IP-safe-naming
   review.** Sibling ticket already created 2026-05-28. Handles
   GDPR / DSGVO + named-group persona overlay + DSA Art. 16 +
   creative-naming generator pattern for fan-group / sponsor /
   venue / person samples vault-wide.

3. **Yield Management as named sub-domain inside CommercialPortfolio.**
   Post-Liverpool / Tottenham dynamic-pricing-controversy
   organisational trend supports `YieldManagement` named
   sub-Aggregate inside CommercialPortfolio with own approval-tier
   policy. Promote in a follow-up ticket once base CommercialPortfolio
   landed.

4. **Secondary-market resale platform integration.** EU DSA Art. 16
   + traceability-of-traders + Bethesda-style upload-gate +
   provenance + audit-trail per ADR-0059 community overlay
   pipeline. Becomes its own surface only if FMX builds in-house
   official resale. Future-scope.

5. **AccessibleAllocation eligibility verification.** CEN-EN 17210
   + UK Accessible Stadia Guide 2003 + GDPR Art. 9
   special-category data. Standalone sub-Aggregate inside
   CommercialPortfolio or own privacy-sensitive sub-context. Future-scope
   tied to FMX-54.

6. **Stadium GmbH-style legal-entity separation pattern**
   (Allianz Arena GmbH / BVB Stadionmanagement GmbH analogue).
   Per-save organisational template option; community-overlay
   per ADR-0059. Post-MVP.

7. **Investor entitlement ledger separation.** ADR-0058 +
   FMX-41 already isolate Investor cash grants. If FMX scope
   expands to non-Investor monetisation (cosmetics, season-pass
   non-pay-to-win) the entitlement BC may need to split.
   Future-scope.

8. **Multi-club stadium / venue sharing** (Inter / Milan at San
   Siro analogue). Stadium-tenant-vs-owner separation, lease
   accounting, intra-club venue settlement. Future-scope; relevant
   if FMX builds multi-club or multi-tenant scenarios.

9. **Catering / merchandise insourcing-vs-outsourcing decision
   model.** Currently inside `sponsorship-portfolio.md` +
   `club-economy-impact-map-and-commercial-contracts-2026-05-28.md`
   as policy choice; full Process Manager for partner-onboarding /
   contract-rebid lifecycle is future-scope.

10. **Per-segment fan-loyalty narrative integration with
    AI-Narration Narrative context** (ADR-0054). Generated
    narrative consumes A&A segment context cards; A&A consumes
    narrative-validated fan-incident provenance. Future-scope
    after Narrative MVP.

## Recommendation

**Per-candidate recommendation matrix.** The dossier proposes Nico
ratify per-candidate; the working recommendation column is the
audit's lean based on six-of-six scoring + DDD authority + real-
world organisational evidence. ADR-0061 carries the per-candidate
Option matrix; ADR-0062 spin-off carries Audience & Atmosphere
in isolation if Option C is ratified.

| Candidate | Six-of-six | DDD authority | Real-world | Recommendation | Effect |
|---|---|---|---|---|---|
| **Stadium / Venue Operations** | 5/6 | Own BC canonical (Hotel PMS / CMMS / Theme Park) | Decisive separation evidence (Bayern Allianz Arena GmbH, BVB Stadionmanagement GmbH, Spurs venue business, Real Madrid Bernabéu Legends JV) | **Option B** (Hybrid named Aggregate inside Club Management with published contract surface) | Refines draft ADR-0058 §Recommendation; no new BC; Stadium gets named-Aggregate boundary + published events |
| **Audience & Atmosphere** | 6/6 | Vernon scoring-context canonical (Salesforce Marketing Cloud, Schufa, Spotify, Tesco Clubcard) + cross-genre unanimous (CK3, Civ VI, Cities, TW) | SLO regulatory anchor + segment-specific GDPR + DSA Art. 16 | **Option C** (own bounded context) + **spin-off ADR-0062** | New BC (17th-20th depending on landing order); ADR-0061 refines draft ADR-0058; map patch in ADR-0062 |
| **CommercialPortfolio** | 6/6 | Vernon CLM canonical (Salesforce CPQ, SAP, Stripe Connect, Guidewire, Amdocs) | CCO-peer-of-CFO universal at top clubs; 40-60% of revenue; multi-regulator anchor (FSR + PSR + APT + GDPR + DSA + EU competition + 50+1) | **Option C** (own bounded context) | New BC (17th-20th depending on landing order); refines draft ADR-0058 (which can be ratified concurrently after FMX-32 lands) |
| **Ticketing & Commercial Settlement** | 6/6 | Vernon settlement-context + airline yield-mgmt vs rev-accounting + Stripe Billing-vs-Ledger canonical | UEFA FSR matchday-segregation + IFRS 15 universal practice (BVB, Real Madrid, Barça, Man United) + multi-regulator anchor (CRA Schedule 2 + DSA + CEN-EN 17210 + Late Payment Directive + GDPR) | **Sub-Aggregate inside CommercialPortfolio** (if CommercialPortfolio = Option C) or **Option C own Settlement BC** (if CommercialPortfolio = Option B) | If recommended: no extra BC; nested as primary Aggregate inside CommercialPortfolio |

**Three converging arguments for the working recommendation as a
whole:**

1. **F4 DDD criteria fire strongest in wave for three of four
   candidates.** Six-of-six fires for Audience & Atmosphere,
   CommercialPortfolio, Ticketing & Settlement (matching FMX-29 /
   33 wave high; stronger than FMX-26 / 28 / 30 / 34). Vernon
   IDDD scoring-context + Customer-Supplier with ACL + Process
   Manager / Saga patterns apply per-candidate. Stadium fires
   5/6 (Hybrid Option B clean landing).

2. **F5 real-world organisational + regulatory evidence is
   decisive for CommercialPortfolio + Stadium.** CCO-peer-of-CFO
   universal pattern at top clubs supports CommercialPortfolio
   as own BC. Separate legal entities or internal divisions for
   stadium operations (Bayern Allianz Arena GmbH, BVB
   Stadionmanagement GmbH, Spurs venue business, Real Madrid
   Bernabéu Legends JV) support Stadium named-Aggregate. SLO +
   GDPR + DSA regulatory anchor supports Audience & Atmosphere
   regulatory subdomain. UEFA FSR + IFRS 15 + multi-regulator
   anchor supports Ticketing & Settlement nesting inside
   CommercialPortfolio.

3. **F2 cross-genre precedent + F3 DDD industry analogues
   unanimous.** Audience & Atmosphere: CK3, Civ VI, Cities,
   TW Three Kingdoms cross-genre + Salesforce Marketing Cloud /
   Schufa / Spotify / Tesco Clubcard industry. CommercialPortfolio:
   F1 Manager / Motorsport Manager sponsor portfolios + Salesforce
   CPQ / SAP S/4HANA / Stripe Connect / Guidewire industry.
   Ticketing & Settlement: airline yield management vs revenue
   accounting + concert promoter ticketing vs settlement + Stripe
   Billing vs Stripe Ledger industry. Stadium: Hotel PMS / CMMS /
   Theme Park / Anno cross-genre showing operations promotion to
   own context when ops becomes strategic.

**Named risks (mitigations in ADR-0061 §Determinism + §Map
patch + ADR-0062 §Risks):**

- **Map growth.** Working recommendation adds **2** bounded
  contexts (Audience & Atmosphere via ADR-0062, CommercialPortfolio
  via ADR-0061). Combined with ADR-0059 + ADR-0060 in-flight
  drafts, the map could grow from 16 → 19-20 contexts. Modular
  monolith stays one process per ADR-0019. Mitigation: ADR-0019
  §5 keeps extraction a deployment change, not a refactor.
  Same pattern as FMX-26 / 28 / 30 / 34 wave.
- **Coordination growth.** CommercialPortfolio has 7 consumers
  + 6 suppliers; Audience & Atmosphere has 7 consumers + 4
  suppliers. Discipline required. Mitigation: explicit
  Customer-Supplier contracts via published events; Reference +
  Snapshot patterns keep coupling loose.
- **Matchday FSM coupling (Stadium).** Option B for Stadium
  leaves matchday FSM inside Club Management's named
  StadiumOperations Aggregate, coupled to Match per-fixture FSM
  via lineup_locked + tactic-snapshot + rivalry-classification.
  Mitigation: published contract surface (`StadiumCommercialSnapshot`,
  `MatchdayTimelineAdvanced`) gives the named-Aggregate a clean
  external API; Match consumes via Reference pattern, not joint
  transaction.
- **IFRS 15 + multi-regulator surface on Ticketing & Settlement.**
  IFRS 15 5-step model + UEFA FSR matchday-segregation + UK CRA
  Schedule 2 refund-policy + DSA secondary-market + CEN-EN 17210
  accessibility + Late Payment Directive + GDPR Art. 6/9 form a
  dense regulatory subdomain. Mitigation: nesting inside
  CommercialPortfolio keeps the regulatory anchor co-located
  with the contract lifecycle anchor; Regulations & Compliance
  consumes via Customer-Supplier per ADR-0056 Tax-catalog
  pattern.
- **Creative IP-safe naming.** All proposed sample names
  (segments, sponsors, supporter groups, venues, hospitality
  partners) follow Nico's vault-wide evocative-but-clearly-not-
  real rule. Mitigation: FMX-54 follow-up ticket already created
  to harden the naming generator pattern + persona / GDPR
  framing.
- **Sub-aggregate-inside-CommercialPortfolio fallback for
  Ticketing & Settlement.** If Nico ratifies Option B for
  CommercialPortfolio (Hybrid sub-aggregate of Club), Ticketing
  & Settlement promotes to own Settlement BC. Mitigation:
  ADR-0061 documents both landings; ratification chooses one.
- **Refines draft ADR-0050 + ADR-0058 rather than supersedes
  binding ADRs.** Both target ADRs are `status: draft` /
  `binding: false`. Mitigation: ADR-0061 inline amendment hunks
  proposed against §Recommendation lines 97-112 (ADR-0058) and
  §lines 67-79 (ADR-0050); no supersession chain needed; draft
  ADRs can ratify concurrently after FMX-32 lands.

Status stays `proposed` / `binding: false` for ADR-0061 (and
ADR-0062 if spun off) until Nico ratifies.

## Cross-references

- Phase 1 grounding: [[../10-Architecture/bounded-context-map]] §1
  line 38 ·
  [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  §lines 67-79 ·
  [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  §Recommendation lines 97-112 ·
  [[../50-Game-Design/stadium-and-campus]] §4-6 ·
  [[../50-Game-Design/fan-ecology]] §2/§3/§5/§5a/§7 ·
  [[../50-Game-Design/sponsorship-portfolio]] §2/§4/§6/§8 ·
  [[../50-Game-Design/matchday-event-engine]] §3/§4 ·
  [[../50-Game-Design/GD-0008-finance-economy]] ·
  [[../50-Game-Design/GD-0015-ip-clean-data]] ·
  [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]] ·
  [[club-economy-impact-map-and-commercial-contracts-2026-05-28]] ·
  [[fan-demand-price-elasticity-2026-05-28]] ·
  [[season-ticket-lifecycle-and-accounting-2026-05-28]] ·
  [[commercial-contract-lifecycle-and-breach-model-2026-05-28]] ·
  [[../30-Implementation/club-economy-commercial-contracts]] ·
  [[../30-Implementation/club-economy-accounting-ledger]] ·
  [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]] ·
  [[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]] ·
  [[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]] ·
  [[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]] ·
  [[../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]] ·
  [[../10-Architecture/09-Decisions/ADR-0057-rivalry-system-context]] ·
  [[../10-Architecture/09-Decisions/ADR-0060-youth-academy-context]].
- Phase 2 raw research:
  [[raw-perplexity/raw-club-management-sub-aggregate-audit-2026-05-28]].
- Phase 4 draft ADR:
  [[../10-Architecture/09-Decisions/ADR-0061-club-management-sub-aggregate-audit]]
  (and spin-off
  [[../10-Architecture/09-Decisions/ADR-0062-audience-and-atmosphere-context]]
  if Audience & Atmosphere Option C is recommended).
- Workflow: [[../30-Implementation/domain-research-workflow]].
- Linear: FMX-32 (audit) + FMX-54 (Fan Ecology persona privacy &
  creative-IP-safe-naming follow-up).
