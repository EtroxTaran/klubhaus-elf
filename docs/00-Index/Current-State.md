---
title: Current State
status: current
tags: [meta, current-state, execution, hot]
created: 2026-05-16
updated: 2026-05-28
type: index
binding: true
related: [[Agent-Onboarding]], [[Project-Goals]], [[MVP-Scope]], [[Decision-Log]], [[../30-Implementation/mvp-implementation-roadmap]], [[../30-Implementation/ai-narration-contract-testing-framework]], [[Documentation-V1]], [[../90-Meta/collaboration-and-decision-protocol]], [[../60-Research/ai-narrative-runtime-integration]], [[../60-Research/ai-narration-world-and-dialogue-mvp-2026-05-28]], [[../60-Research/ai-narration-testing-framework-2026-05-28]], [[../60-Research/club-economy-blueprint-2026-05-27]], [[../60-Research/club-economy-impact-map-and-commercial-contracts-2026-05-28]], [[../60-Research/fan-demand-price-elasticity-2026-05-28]], [[../60-Research/season-ticket-lifecycle-and-accounting-2026-05-28]], [[../60-Research/commercial-contract-lifecycle-and-breach-model-2026-05-28]], [[../60-Research/cup-and-competition-revenue-profiles-2026-05-28]], [[../60-Research/manager-archetype-roguelite-2026-05-27]], [[../60-Research/eos-player-staff-skills-and-personas-2026-05-28]], [[../60-Research/player-staff-development-decision-model-2026-05-28]], [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]], [[../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]], [[../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]], [[../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]], [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]], [[../50-Game-Design/GD-0008-finance-economy]], [[../20-Features/feature-club-economy-mvp-pillar]], [[../20-Features/feature-roguelite-mvp-first-playable]], [[../20-Features/feature-eos-player-skills-and-people-context]], [[../20-Features/feature-ai-narration-mvp-pillar]], [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]], [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]], [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]], [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]], [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]], [[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]], [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]], [[../30-Implementation/club-economy-commercial-contracts]]
---

# Current State

Hot-memory snapshot. Update this in the same PR as any change to architecture,
scope, operations, or status. Move durable detail into ADRs, approved specs, or
current research notes.

This page is the first stop for active project context. If another note conflicts
with this page, prefer the accepted ADR or approved/current note linked here.

> **2026-05-27 — Decisions reopened.** All previously `accepted` ADRs and
> `approved` GDDRs/system notes were reset to `status: draft` for re-evaluation
> (implementation removed; the design is being re-questioned with additional
> topics). Treat **nothing** below as binding until re-ratified — the
> "accepted/approved/locked" language in the sections that follow reflects the
> pre-reopen state. See [[Decision-Log]] and [[../50-Game-Design/README]].

> **Active phase: research / analysis / architecture planning — no development.**
> Deliverables are vault notes (research, `draft` GDDRs/ADRs), not code. Roles,
> the ask-first decision gate, and this phase are defined in
> [[../90-Meta/collaboration-and-decision-protocol]]. The tech-stack details in
> the sections below are **proposed / under re-evaluation** (see [[Decision-Log]]),
> not ratified — no technology, gameplay or architecture decision is made without
> Nico (2–3 sourced options + recommendation).

> **FMX-10 match-engine re-evaluation (2026-05-27).** Nico directed that the
> match engine must be planned as an exchangeable component from day one. Draft
> [[../10-Architecture/09-Decisions/ADR-0049-swappable-spatial-event-match-engine]]
> is now the proposed target: server-authoritative spatial-event engine,
> `MatchEnginePort`, 2D/ticker/replay from committed event/spatial facts, and a
> **Spike, Rust-default** runtime posture. The older TypeScript-MVP runtime
> stance is no longer the proposed target.

> **FMX-13 Club Economy re-evaluation (2026-05-27).** Nico directed that the
> club-economy blueprint should be fully anchored, not left as raw research.
> Draft [[../60-Research/club-economy-blueprint-2026-05-27]],
> [[../50-Game-Design/GD-0008-finance-economy]],
> [[../50-Game-Design/economy-system]],
> [[../20-Features/feature-club-economy-mvp-pillar]],
> [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
> and [[../30-Implementation/club-economy-accounting-ledger]] now capture the
> proposed target: Economy as an MVP pillar, weekly ledger, full accounting,
> staged insolvency, Top-5 country profiles + abstract fallback, ranges/formulas
> before final constants and Progressive UI. FMX-41 amends the Investor line:
> if activated, Investor is clean singleplayer cash with no balance penalty,
> no debt, no ownership/control effect and no multiplayer advantage.

> **FMX-41 Economy impact map and commercial contracts (2026-05-28).** Nico
> asked for a deeper economy pass covering every direct financial-success
> domain and the full research report surface. Draft
> [[../60-Research/club-economy-impact-map-and-commercial-contracts-2026-05-28]],
> [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]],
> [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
> and [[../30-Implementation/club-economy-commercial-contracts]] now capture the
> proposed target: Club Management owns commercial policy, commercial contracts,
> fan-event campaign choices, commercial settlement and Investor cash-grant
> ledger posting; Fan Ecology / Rivalry / League / Match / Stadium /
> Regulations provide causal facts. Ticketing models season-ticket certainty
> versus single-ticket/top-match upside; fan segments drive attendance,
> renewal, catering, merch, hospitality and sponsor fit; cup games become full
> economy events; catering and merchandise support in-house, concession,
> revenue-share, guarantee, royalty and partner models; paid fan-service
> campaigns include away trains, family/summer events, choreo support and
> beer-per-goal activations. All numbers remain ranges/profile data pending
> calibration and Nico approval.

> **FMX-42 Fan demand and price elasticity (2026-05-28).** Nico asked to pick
> the first economy research ticket and go deep. Draft
> [[../60-Research/fan-demand-price-elasticity-2026-05-28]] now captures the
> proposed demand model: Fan Ecology estimates segment-specific latent demand
> before stadium capacity; Club Management applies ticketing policy,
> seat-class inventory, season-ticket allocation and commercial contracts to
> settle actual revenue. Price sensitivity is per segment, not one global
> constant; fixture attractiveness includes opponent draw, rivalry, stakes,
> form, star pull, novelty, kickoff and weather; `ticketingTrustState` carries
> perceived fairness and price-shock memory into renewal, boycott, atmosphere
> and sponsor-fit risk. Draft [[../50-Game-Design/audience-and-atmosphere]],
> [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]],
> [[../50-Game-Design/economy-system]] and
> [[../30-Implementation/club-economy-commercial-contracts]] are refined
> accordingly. Full dynamic pricing, country guardrail hardness and Quick-mode
> trust visibility remain Nico-gated decisions.

> **FMX-43 Season-ticket lifecycle and accounting (2026-05-28).** Nico asked
> to fully plan the next economy domain issue. Draft
> [[../60-Research/season-ticket-lifecycle-and-accounting-2026-05-28]] now
> captures the proposed model: season tickets are a campaign lifecycle plus
> accounting schedule, not a one-time cash slider. Club Management runs
> planning, renewal, relocation, member presale, waitlist allocation, public
> sale, closed, in-season adjustment and renewal-review states over
> fan-group cohorts. The ledger separates cash receipt, instalment receivables,
> finance-partner fees, deferred revenue, match-by-match recognition and
> aggregate credit/refund liability pools. Seat-class allocation covers
> standing, seating, family, premium/suites and accessibility while excluding
> away inventory. No-show, release, transfer and compensation are group-level
> policy effects, not individual fan records. Draft
> [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]],
> [[../50-Game-Design/economy-system]],
> [[../50-Game-Design/audience-and-atmosphere]],
> [[../50-Game-Design/stadium-and-campus]] and
> [[../30-Implementation/club-economy-commercial-contracts]] are refined
> accordingly. Default share/discount ranges, Quick-mode waitlist visibility,
> instalment-risk activation, cup material-right depth and strict utilisation
> policy remain Nico-gated decisions.

> **FMX-44 Commercial contract lifecycle and breach model (2026-05-28).** Nico
> asked for the next economy domain to be researched and planned fully. Draft
> [[../60-Research/commercial-contract-lifecycle-and-breach-model-2026-05-28]]
> now captures the proposed model: sponsorship, catering, merchandise,
> hospitality, supplier and venue-activation deals share one
> `CommercialContract` lifecycle shell with family-specific schedules. Club
> Management tracks lifecycle state, version history, cash schedule,
> recognition schedule, obligations, exclusivity, renewal policy, breach policy
> and audit trail. Breaches are curable/material/critical; exclusivity is
> category × territory × asset × carve-outs; cash and recognised revenue/cost
> remain separate ledger concepts. Draft
> [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]],
> [[../50-Game-Design/economy-system]],
> [[../50-Game-Design/sponsorship-portfolio]],
> [[../50-Game-Design/stadium-and-campus]],
> [[../20-Features/feature-club-economy-mvp-pillar]],
> [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
> and [[../30-Implementation/club-economy-commercial-contracts]] are refined
> accordingly. ADR-0058 is acceptance-ready but still draft. Nico-gated
> decisions remain: accept Option C or reopen a Commercial Operations context,
> default contract presets, Quick conflict strictness, controversial category
> availability, Standard-vs-Expert true-ups and auto-renew confirmation.

> **FMX-45 Cup and competition revenue profiles (2026-05-28).** Nico asked
> for full research and planning on cup/competition revenue. Draft
> [[../60-Research/cup-and-competition-revenue-profiles-2026-05-28]] now
> captures the proposed model: League/Competition and Regulations provide a
> `CompetitionRevenueProfile`; Club Management settles cash, receivables, costs
> and forecast shocks. Draft IP-clean preset families cover central-round
> domestic cups, shared-gate underdog cups, federation-hosting cups, seeded
> elite-entry cups, solidarity/amateur cups and continental value-pillar cups.
> The model separates secured income, earned receivables and future cup EV;
> elimination removes forecast upside instead of posting a hidden cash loss.
> Quick shows secured/upside bands, Standard shows per-fixture breakdown, and
> Expert shows probabilities, EV, payment timing and gate-share formulas. Draft
> [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]],
> [[../50-Game-Design/economy-system]],
> [[../50-Game-Design/regulations-and-compliance]],
> [[../20-Features/feature-club-economy-mvp-pillar]],
> [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]],
> [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
> and [[../30-Implementation/club-economy-commercial-contracts]] are refined
> accordingly. Final calibration, Quick budget reliance on EV, replay support
> and season-ticket cup material-right liabilities remain Nico-gated decisions.

> **FMX-16 Manager-Archetype Roguelite progression (2026-05-27).** Nico directed
> that the manager-archetype report should be anchored as MVP-relevant hooks, not
> as a full MVP perk/legacy system. Draft
> [[../60-Research/manager-archetype-roguelite-2026-05-27]],
> [[../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]],
> amended [[../20-Features/feature-roguelite-mvp-first-playable]] and draft
> [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]] now
> capture the proposed target: emergent-hybrid manager identity, proposed
> Manager & Legacy context, run-analysis hooks, reflected-not-grinded post-run
> progression, balance-corridor perks with mandatory prestige counterweight, and
> explicit playtest tunability for taxonomy, thresholds, labels and perk values.

> **FMX-29 Youth Academy ownership dossier (2026-05-28).** Annual
> youth academy lifecycle - intake calendar + cohort generation +
> intake event (3-12 prospects, HoY opinion, promote / loan / release)
> + promotion gate (age ≥17 + two youth weeks + post-season transfer
> window) + per-season investment slider (Junior Coaching / Youth
> Recruitment / Youth Facilities per GD-0007) + productivity score
> (EPPP-analogue audit) + home-grown share counter (UEFA HGP-analogue)
> - is specified in binding GD-0007 + youth-academy-and-development +
> squad-and-club-structure §1 + §4 but the 16-context map has no
> owner. ADR-0053 Staff Operations owns Head of Youth + U-team-coach
> roles as quality multipliers; ADR-0018 splits weekly dev across
> Training + Squad & Player; the academy lifecycle itself is unowned.
> Draft [[../60-Research/youth-academy-bounded-context-2026-05-28]]
> and [[../60-Research/raw-perplexity/raw-youth-academy-2026-05-28]]
> consolidate genre (FM annual March intake + HoYD + Junior Coaching
> / Youth Recruitment + Development Centre; EA FC rolling youth
> scouting + Youth Academy screen; OOTP amateur draft + Minor League
> System; FIFA Manager Youth Center; Anstoss Nachwuchsabteilung;
> medium-high), DDD (Vernon canonical long-running-process + Process
> Manager / Saga + Snapshot pattern; university-admissions cohort +
> clinical-trial subject cohort + apprenticeship as textbook own-BC
> analogues; high) and real-world 2023-2026 (Premier League EPPP
> Categories 1-4 + DFB-NLZ licensing + UEFA Home-Grown Player rule
> 8/25 with 4 club-trained 15-21 + Academy Director reporting to
> Sporting Director, exemplified by La Masia + De Toekomst + City
> Football Academy + Hohenbuschei + Liefering; medium-high) evidence.
> New draft
> [[../10-Architecture/09-Decisions/ADR-0060-youth-academy-context]]
> proposes **Youth Academy as an additional bounded context** (Option
> C) with four options + §Recommendation + §Map patch proposal +
> proposed FSM diagram in
> [[../10-Architecture/state-machines/youth-academy]]. **Six-of-six
> DDD criteria fire** (equal to FMX-33 wave high; stronger than
> FMX-26/28/30/34). Sequencing is order-tolerant: if FMX-29 ratifies
> before ADR-0059 (Community Overlay Pipeline), Youth Academy is the
> 17th bounded context; if ADR-0059 lands first, Youth Academy is the
> 18th. IP-clean rule terminology contained in one BC per GD-0015 +
> ADR-0007; `risk:legal` label set. Public contract direction names
> `YouthIntakeScheduled`, `YouthCohortPublished` (Snapshot to Squad &
> Player), `AcademyInvestmentExpensePosted` (consumed by Club
> Management ledger per ADR-0050), `HomeGrownShareRecalculated`
> (consumed by Regulations ACL per ADR-0056 Tax-catalog pattern),
> `YouthPipelineQualityUpdated` (consumed by Manager & Legacy
> archetype hook per GD-0019). Awaiting Nico ratify decision.

> **FMX-32 Club Management sub-aggregate audit + ADR-0050 +
> ADR-0058 + ADR-0061 + ADR-0062 ratification applied (2026-05-28).**
> Nico ratified the best-practice landing.
> [[../10-Architecture/09-Decisions/ADR-0061-club-management-sub-aggregate-audit]]
> and [[../10-Architecture/09-Decisions/ADR-0062-audience-and-atmosphere-context]]
> are now `status: accepted` and `binding: true`; draft
> [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
> and [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
> flipped to `accepted` / `binding: true` at the same ratification
> event with the FMX-32 in-line amendment hunks applied (ADR-0058's
> original "Option C = Club Management sub-aggregate, no new BC"
> recommendation is **superseded** by ADR-0061; the originally-
> deferred "Option B = new Commercial Operations bounded context"
> path is now the accepted shape, instantiated as CommercialPortfolio).
> Per-candidate decision: **Stadium / Venue Ops = Option C** (own
> bounded context `Stadium Operations` — Nico chose C over the
> dossier working rec B based on real-world Bayern Allianz Arena
> München Stadion GmbH + BVB Stadionmanagement GmbH + Tottenham
> venue business + Real Madrid Bernabéu Legends & Sixth Street JV
> legal-entity / dedicated-division separation evidence, the
> Hotel PMS + CMMS + Theme Park DDD analogue + cross-genre
> precedent, and event-based matchday-FSM coupling to Match
> handled via Customer-Supplier + ACL); **Audience & Atmosphere =
> Option C** (own bounded context via spin-off ADR-0062, renamed
> from the predecessor Fan-Ecology GDDR which is now `status:
> superseded` with the supersession banner pointing forward;
> [[../50-Game-Design/audience-and-atmosphere]] is the new
> binding GDDR);
> **CommercialPortfolio = Option C** (own bounded context covering
> sponsorship + catering + merchandise + hospitality + ticketing
> & commercial settlement umbrella per FMX-44 unified
> `CommercialContract` shell); **Ticketing & Commercial Settlement
> = Option D** (sub-Aggregate inside CommercialPortfolio with
> `SeasonTicketCampaign` 8-state FSM + `FixtureSettlement` Saga
> + `AccrualSchedule` IFRS 15 + `CreditLiabilityPool` +
> `InstalmentReceivable` + `AccessibleAllocation`). Adds **three
> new bounded contexts** (Stadium Operations, Audience &
> Atmosphere, CommercialPortfolio) per
> [[../10-Architecture/bounded-context-map]] §1 (16 → 19; future
> ratifications of ADR-0059 Community Overlay Pipeline + ADR-0060
> Youth Academy can grow the map to 21). Map patches applied: §1
> table amended (Club Management row narrowed to "finance ledger
> sole writer + budget envelopes + board pressure + insolvency
> state"; three new rows added for Stadium Operations / Audience
> & Atmosphere / CommercialPortfolio); §1 prose new paragraphs
> for each of the three new contexts; §2 high-level Mermaid new
> Stadium / AAtmo / CPort nodes + edges; §3 finance-ownership
> rule amended (CommercialPortfolio emits settlement events
> consumed by Club Management via Customer-Supplier + ACL;
> Stadium Operations emits facility-cost events; Staff Operations
> emits wage events; same pattern; Club Management remains sole
> ledger writer); §4 source mapping new folders
> (`stadium-operations/` + `audience-and-atmosphere/` +
> `commercial-portfolio/`); §5 extraction-order prose note flagged
> CommercialPortfolio as highest service-extraction priority due
> to 40-60% revenue share at top-tier clubs per Deloitte Money
> League 2026. Three of four candidates fire six-of-six DDD
> split-criteria (matches FMX-29 / 33 wave high). Real-world
> evidence anchors: Vernon IDDD scoring-context (A&A) + contract
> lifecycle management (CommercialPortfolio) + settlement-context
> (Ticketing & Settlement) + Hotel PMS / CMMS (Stadium); cross-
> genre CK3 / Civ VI / Cities / TW / Anno / Theme Park unanimous;
> CCO-peer-of-CFO universal at top clubs; UEFA FSR / PL APT / La
> Liga PSR / GDPR / DSA / CRA / Late Payment Directive / CEN-EN
> 17210 / UEFA SLO / DFB-DFL SLO-Konzept / Bundesliga 50+1 multi-
> regulator anchor; IFRS 15 universal practice at BVB / Real
> Madrid / Barça / Manchester United. `risk:legal` hardline per
> GD-0015 + ADR-0007 contained in three contexts; FMX-54 sibling
> follow-up (Fan Ecology persona privacy & creative-IP-safe-
> naming review) hardens `NamedSupporterGroup` aggregate scope
> + creative-naming generator pattern.

> **FMX-32 Club Management sub-aggregate ownership audit (2026-05-28).**
> Boundary audit of the four Club Management sub-aggregate
> candidates loaded by the wave-2 economy work (FMX-13 + FMX-41
> Economy Impact Map + FMX-42 Fan Demand & Price Elasticity +
> FMX-43 Season-Ticket Lifecycle & Accounting + FMX-44 Commercial
> Contract Lifecycle & Breach Model): Stadium / Venue Operations,
> Audience & Atmosphere (renamed from Fan Ecology), CommercialPortfolio
> (Sponsorship + Catering + Merchandise + Hospitality + Ticketing
> umbrella per FMX-41 unified `CommercialContract` shell), and
> Ticketing & Commercial Settlement. Today's owner per binding
> bounded-context-map §1 line 38 + draft ADR-0050 + draft ADR-0058:
> **Club Management** for all four as sub-aggregates ("It does not
> add a seventeenth bounded context"). Drafts
> [[../60-Research/club-management-sub-aggregate-audit-2026-05-28]]
> and [[../60-Research/raw-perplexity/raw-club-management-sub-aggregate-audit-2026-05-28]]
> consolidate twelve Perplexity queries across four candidates ×
> three dimensions (Genre / DDD / Real-world): genre (FM + EA FC
> Career Mode + OOTP + FIFA Manager + Anstoss treat all four as
> sub-aggregates with FIFA Manager + F1 Manager + Motorsport
> Manager as closest analogues; cross-genre CK3 + Civ VI + Cities
> Skylines + TW Three Kingdoms + Anno + Theme Park show
> segmented-audience + venue-ops promoted to own context when
> ops becomes core; medium-high), DDD (Vernon canonical scoring-
> context + contract-lifecycle-management + settlement-context +
> Hotel PMS / CMMS analogues; Salesforce CPQ + SAP S/4HANA Sales
> Contract + Stripe Connect + Guidewire PolicyCenter + Amdocs +
> Salesforce Marketing Cloud + Schufa + Spotify recommendation +
> Tesco Clubcard + airline yield mgmt + Stripe Billing-vs-Ledger +
> concert promoter ticketing-vs-settlement industry pattern; high)
> and real-world 2023-2026 (Bayern Allianz Arena München Stadion
> GmbH + BVB Stadionmanagement GmbH + Tottenham venue business +
> Real Madrid Bernabéu Legends + Sixth Street JV separation
> evidence; CCO-peer-of-CFO universal at Real Madrid + Barça +
> Bayern + Manchester United + Manchester City + Liverpool + BVB +
> Inter + PSG; commercial revenue 40-60% of total per Deloitte
> Money League 2026; UEFA Stadium Infrastructure + Premier League
> Ground Regulations + DFL Lizenzhandbuch + FA EPPP + SGSA Green
> Guide + CEN-EN 17210 + UEFA FSR + PL APT + La Liga PSR + UK
> Consumer Rights Act 2015 Schedule 2 + EU DSA Art. 16 + EU Late
> Payment Directive + GDPR Art. 6 / 9 + Bundesliga 50+1 + UEFA
> SLO + DFB-DFL SLO-Konzept + Premier League Independent Fan
> Advisory Board multi-regulator framework; IFRS 15 universal
> practice at BVB Konzernabschluss + Real Madrid Memoria + FC
> Barcelona Memòria + Manchester United 20-F with cash receipt
> / deferred revenue / match-by-match recognition / instalment
> receivables / refund liability pools / hospitality multi-
> component performance obligations; high for Stadium /
> CommercialPortfolio / Ticketing & Settlement, low for Audience
> & Atmosphere club-by-club governance — Perplexity Q2.3 flagged
> sourcing gap) evidence. New draft
> [[../10-Architecture/09-Decisions/ADR-0061-club-management-sub-aggregate-audit]]
> proposes **per-candidate Option matrix (A sub-aggregate / B
> Hybrid named Aggregate / C own BC / D sub-Aggregate-inside-
> CommercialPortfolio)** with working recommendation **Option B
> for Stadium** (Hybrid named Aggregate `StadiumOperations`
> inside Club Management with published contract surface;
> 5/6 firing, matchday-FSM coupling to Match keeps it inside Club
> Management for MVP, Option C defensible post-MVP per Bayern /
> BVB / Spurs / Real Madrid real-world separation evidence),
> **Option C for Audience & Atmosphere** (spin-off
> [[../10-Architecture/09-Decisions/ADR-0062-audience-and-atmosphere-context]];
> six-of-six firing equal to FMX-29 / 33 wave high; Vernon
> scoring-context canonical + cross-genre unanimous +
> SLO / GDPR / DSA regulatory anchor), **Option C for
> CommercialPortfolio** (six-of-six firing; Vernon CLM canonical
> + CCO-peer-of-CFO universal + 40-60% revenue share +
> multi-regulator anchor), and **Option D for Ticketing &
> Commercial Settlement** (sub-Aggregate inside CommercialPortfolio
> with `SeasonTicketCampaign` 8-state FSM + `FixtureSettlement`
> Saga + `AccrualSchedule` IFRS 15 + `CreditLiabilityPool` +
> `InstalmentReceivable` + `AccessibleAllocation`; six-of-six
> firing; airline yield mgmt + Stripe Billing-vs-Ledger +
> concert promoter industry pattern; fallback Option C standalone
> Settlement BC if CommercialPortfolio = Option B). Working
> recommendation adds two new bounded contexts (Audience &
> Atmosphere + CommercialPortfolio), bringing 16 → 18 (or
> 19-20 depending on landing order with ADR-0059 + ADR-0060).
> In-line amendment hunks proposed against draft ADR-0050
> §lines 67-79 and draft ADR-0058 §Recommendation lines 97-112;
> both target ADRs remain `binding: false`, so FMX-32 refines
> drafts rather than supersedes binding ADRs. ADR-0061 carries
> the audit-level decision; ADR-0062 carries the spin-off
> ratification frame so Nico can ratify Audience & Atmosphere
> independently. Three of four candidates fire six-of-six
> (matches FMX-29 / 33 wave high; stronger than FMX-26 / 28 /
> 30 / 34). IP-clean rule terminology contained per GD-0015 +
> ADR-0007; `risk:legal` label set on FMX-32 + sibling FMX-54
> (Fan Ecology persona privacy & creative-IP-safe-naming review)
> created 2026-05-28 under parent FMX-24. Public contract
> direction proposed per candidate: Stadium B publishes
> `StadiumCommercialSnapshot` / `MatchdayTimelineAdvanced` /
> `PitchConditionChanged` / `VenueEventBooked` /
> `FacilityComplianceChecked` (consumed by Club Management +
> Match + Matchday-Event-Engine + Regulations); Audience &
> Atmosphere publishes `FanDemandForecast` + `FanIncidentLogged`
> + `AtmosphereSnapshot` + `TicketingTrustStateChanged` +
> `FanPipelineQualityUpdated` + `OusterCallEscalated` (consumed
> by CommercialPortfolio + Rivalry + Matchday-Event-Engine +
> Manager & Legacy + Notification + Club Management);
> CommercialPortfolio publishes `CommercialContractActivated` /
> `CommercialBreachOpened` / `MatchdayCommercialSettlementPosted`
> / `InvestorCashGrantPosted` / `CommercialFairValueAssessed` /
> `DeferredRevenueRecognised` / `RefundLiabilityRecognised`
> (consumed by Club Management ledger via Customer-Supplier +
> ACL per ADR-0050 + Regulations + Manager & Legacy +
> Notification). Awaiting Nico per-candidate ratify decision.

> **FMX-33 Community Overlay Pipeline ownership dossier (2026-05-28).**
> Community pack import pipeline - manifest parsing + schema
> validation + conflict resolution + IP-safety gate + multi-BC
> semantic-validation delegation + save-creation-only activation +
> per-save activation snapshot immutability + revocation governance
> - is designed in
> [[../10-Architecture/09-Decisions/ADR-0016-community-dataset-overrides]]
> (proposed) but the 16-context map has no owner. Critically,
> ratified **ADR-0056 (Regulations) and ADR-0057 (Rivalry)** already
> explicitly delegated semantic validation to the owning BCs per
> Vernon pattern and explicitly reference "FMX-33 Community Overlay
> Pipeline" as the upstream orchestrator they delegate to - two
> ratified binding ADRs name a missing context. Draft
> [[../60-Research/community-overlay-pipeline-bounded-context-2026-05-28]]
> and [[../60-Research/raw-perplexity/raw-community-overlay-pipeline-2026-05-28]]
> consolidate genre (FM `.fmf` save-creation-only activation +
> multiple-pack selection + version-strict; medium-high), DDD
> (Vernon ingestion-as-bounded-context with Process Manager / Saga +
> Open Host Service + Published Language; Stripe Connect + Avalara
> + Salesforce + GitHub Actions + OpenStreetMap as direct analogues;
> high) and real-world 2023-2026 (Bethesda Creation Kit + Bethesda.net
> + Steam Workshop + CurseForge / Modrinth manifest-driven compliance
> + EU DSA + Bethesda paid-mods + Steam policy trends converging on
> upload gate + provenance + audit trail; medium) evidence. New draft
> [[../10-Architecture/09-Decisions/ADR-0059-community-overlay-pipeline-context]]
> proposes **Community Overlay Pipeline as an additional bounded
> context** (Option D) with four options + Option E anti-pattern +
> §Recommendation + §Map patch proposal. **Six-of-six DDD criteria
> fire** (stronger than FMX-26/28/30/34). IP-safety surface contained
> in one context per GD-0015 + ADR-0007; `risk:legal` label set.
> Ratify decision pending; map itself not yet modified.

> **FMX-34 + FMX-40 Rivalry System ratification applied (2026-05-28).**
> Nico accepted Option C.
> [[../10-Architecture/09-Decisions/ADR-0057-rivalry-system-context]]
> is now `status: accepted` and `binding: true`. Rivalry System is the
> **sixteenth bounded context** in
> [[../10-Architecture/bounded-context-map]] (table row + Mermaid +
> `rivalry/` source folder). Decision basis:
> [[../60-Research/rivalry-system-bounded-context-2026-05-28]].
> Rivalry owns the rivalry-edge graph (club pair × sub-score history
> × threshold-tier FSM), the 5-sub-score emergent formula (regional +
> historical + sporting + fan-incident + transfer-tension),
> deterministic per-season decay and threshold-tier classification
> (None / Mild / Strong / High / Volatile). Consumes Match
> `MatchResolved` (sporting sub-score), Transfer `TransferCompleted`
> (transfer-tension sub-score), Fan Ecology `FanIncidentLogged` (fan-
> incident sub-score), Club Management `ClubFoundedInLocation` /
> `ClubRelocatedToLocation` (regional base), League Orchestration
> `SeasonAdvanced` (decay batch trigger). Publishes `RivalryScore` /
> `IsDerbyFixture` / `TopRivalsForClub` / `RivalryIncidentTimeline` /
> `RivalryGraphSnapshot` / `DerbyContext` read models +
> `RivalryTierTransitioned` events to Fan Ecology (atmosphere
> multiplier), Matchday-Event-Engine via Club Management (Pyro
> trigger), Watch Party (auto-proposal), Manager & Legacy (future
> archetype signal), Notification (derby copy), Match (derby
> classification at `lineup_locked`), Tactics (future opposition
> awareness), Regulations & Compliance (downstream sanction chain).
> Consumers treat rivalry as external fact and apply own policies in
> own contexts (canonical Vernon scoring-context pattern; credit-
> rating / customer-affinity / recommendation real-world analogues).
> Cross-save rivalry pre-population flows through ADR-0051 legacy
> seeds + ADR-0016 community overlay surface per FMX-33 Community
> Overlay Pipeline; Rivalry BC owns schema + semantic validation per
> Vernon.


> **FMX-30 + FMX-39 Regulations & Compliance ratification applied
> (2026-05-28).** Nico accepted Option B.
> [[../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]]
> is now `status: accepted` and `binding: true`. Regulations &
> Compliance is the **fifteenth bounded context** in
> [[../10-Architecture/bounded-context-map]] (table row + Mermaid +
> `regulations/` source folder). Decision basis:
> [[../60-Research/regulations-compliance-bounded-context-2026-05-28]].
> Regulations & Compliance owns the versioned multi-regulator rule
> catalog (UEFA-analogue + national league + national association per
> regulator scope × competition × effective date), the transfer-window
> FSM, the work-permit catalog, the sanction catalog and licence-tier
> facility requirements. Stock catalogs in `packages/game-data`; per-
> save snapshot copied at save creation per ADR-0051 determinism rule.
> Multi-context eligibility chain runs as Vernon's Process Manager /
> Saga in the consuming BC (Transfer for signings, Squad & Player for
> registration, League Orchestration for promotion). Regulations owns
> the rule; each consumer owns its enforcement via Anticorruption
> Layer. IP-clean rule terminology hardline contained in one context
> per GD-0015 + ADR-0007; `risk:legal` label set. Cross-save preset
> sharing of community rule overrides remains FMX-33 Community Overlay
> Pipeline territory (ADR-0016); Regulations BC owns schema +
> semantic validation per Vernon.

> **FMX-28 + FMX-37 Tactics ratification applied (2026-05-28).** Nico
> accepted Option C. [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]]
> is now `status: accepted` and `binding: true`. Tactics is the
> **fourteenth bounded context** in
> [[../10-Architecture/bounded-context-map]] (table row + Mermaid +
> `tactics/` source folder). Decision basis:
> [[../60-Research/tactics-persistence-bounded-context-2026-05-28]].
> Tactics owns the persistent library: presets, set-piece routine
> variants, opposition templates, role/duty configurations and
> tactical-style signal aggregation. Match consumes a `TacticSnapshot`
> at `lineup_locked` (canonical Reference + Snapshot pattern - live
> preset may be edited after lock without affecting the in-flight
> match). Training and Transfer read `RoleProfileForPosition`; Manager
> & Legacy consumes `TacticalIdentityFingerprint` for archetype-style
> signal aggregation; Staff Operations publishes
> `SetPieceCoachReadinessUpdated` for routine-quality multipliers.
> Cross-save preset sharing remains FMX-33 Community Overlay Pipeline
> territory (ADR-0016).

> **FMX-26 + FMX-36 Staff Operations ratification applied (2026-05-28).**
> Nico accepted Option B. [[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]]
> is now `status: accepted` and `binding: true`. Staff Operations is the
> **thirteenth bounded context** in [[../10-Architecture/bounded-context-map]]
> (table row + Mermaid + `staff-operations/` source folder). Decision
> basis: [[../60-Research/staff-backroom-bounded-context-2026-05-28]].
> Staff Operations owns hire/fire/contract lifecycle, role assignment,
> pipeline coverage, wage schedule and specialisation metadata; emits
> wage events to Club Management ledger (ADR-0050) via Customer-Supplier
> + Anti-Corruption Layer pattern. Consumes People (ADR-0052, still
> draft) actor identity via query when ratified; stubs identity from own
> staff roster until then.

> **FMX-25 + FMX-35 Manager & Legacy ratification applied (2026-05-28).**
> Nico accepted Option A. [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
> is now `status: accepted` and `binding: true`. Manager & Legacy is the
> **twelfth bounded context** in [[../10-Architecture/bounded-context-map]]
> (table row + Mermaid + `manager-legacy/` source folder). Decision basis:
> [[../60-Research/manager-legacy-bounded-context-2026-05-28]]. MVP scope
> stays hooks-only per
> [[../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]];
> taxonomy, signal schema, post-run UI depth, prestige ladder and snapshot
> timing remain playtest-tunable future-scope. ADR-0052's three
> conditional "if ADR-0051 is ratified" references are now unconditionally
> satisfied.

> **FMX-23 EOS People / Skills / Personas (2026-05-28).** Nico directed that
> the Player & Staff Values report should be anchored without expanding the
> 16+4+8 attribute schema. Draft
> [[../60-Research/eos-player-staff-skills-and-personas-2026-05-28]],
> [[../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]],
> [[../20-Features/feature-eos-player-skills-and-people-context]] and draft
> [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
> now capture the proposed target: active MVP player skills/perks as a separate
> visible layer, staff skills as target model, hidden OCEAN as internal persona
> substrate, relationship constellations for character depth and a proposed
> People / Persona & Skills context. All concrete catalogs, values, storage
> shape and context acceptance remain Nico-gated draft decisions.

> **FMX-38 Player/Staff development and decision influence (2026-05-28).**
> Draft [[../60-Research/player-staff-development-decision-model-2026-05-28]]
> and [[../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]]
> now bridge attributes, hidden meta, player skills, personas, relationships,
> Staff Operations, Training, Transfers and Impact Lens through factor matrices.
> The goal is explainable development/transfer/staff decisions without formulas
> or final balance constants. Staff-skill MVP activation is re-opened as an
> explicit A/B/C decision; the documented recommendation is Option B, narrow
> pipeline modifiers, but it is not approved.

> **FMX-3 AI Narration MVP pillar expansion (2026-05-28).** Nico directed that
> narration must be ready in the MVP as the world/emotion layer, not deferred
> polish. Draft [[../60-Research/ai-narration-world-and-dialogue-mvp-2026-05-28]],
> amended [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]],
> amended [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
> and [[../20-Features/feature-ai-narration-mvp-pillar]] now capture the
> proposed target: Full Dialogue, All Active actor context, deterministic
> world/persona generation, template fallback, OpenRouter behind an adapter,
> first-exposure AI disclosure and a larger evaluation/safety gate. Generated
> prose still cannot create or mutate authoritative facts.

> **FMX-3 AI Narration framework/testing expansion (2026-05-28).** Nico chose
> the **Narrative Context** boundary and **Playtest First** quality posture for
> MVP planning. Draft [[../60-Research/ai-narration-testing-framework-2026-05-28]],
> draft [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
> and draft [[../30-Implementation/ai-narration-contract-testing-framework]]
> now define the framework structure: Narrative owns scene/storylet selection,
> context-card assembly, template fallback, validation, provenance, eval corpus,
> telemetry and provider adapter boundary; People owns persona truth,
> Notification owns delivery, and owning domains keep authoritative facts.
> Playtest First tunes emotional quality, but does not relax state isolation,
> safety/privacy, fallback, disclosure or provenance gates.

## Documentation Baseline (2026-05-22)

[[Documentation-V1]] is the current vault-wide closure
baseline. As of 2026-05-22 there are no known undocumented or unclassified
documentation/architecture gaps. Historical `open`, `draft`, `proposal` and
`Future-scope notes` text is not implementation authority unless re-listed in this
page, the baseline, an accepted ADR, an approved GDDR or a current
implementation spec.

A vault-wide **consistency + link-health pass** ran on 2026-05-22
([[../40-Execution/session-handoffs/2026-05-22-vault-consistency-pass]]): the
entry chain, arc42, accepted ADRs and current implementation specs were realigned
to PostgreSQL + Drizzle (SurrealDB stays the deferred additive option), superseded
notes self-announce, encoding/mojibake and broken wikilinks were repaired, and
`docs-check` passes with zero issues.

Use the temporal layers from the baseline:

- MVP Binding: implementable now.
- Pre-Launch Hardening: required launch evidence.
- Post-MVP Planned: additive after first playable.
- Future-Scope Gate: do not implement until the gate passes.
- Historical Memory: read-only context.

## Active Product Direction

- [Project Goals](Project-Goals.md) defines mission, boundaries, and milestones.
- The MVP is a **hybrid-online, offline-ready, IP-clean football manager PWA**
  focused on the [[MVP-Scope|Create-a-Club Roguelite first playable]].
- Selective offline-first singleplayer, Manage-a-Club Career and export/import
  remain planned future capabilities; they must not be blocked by MVP
  architecture.
- German is the primary UI language.
- User-facing docs are output documentation, not implementation authority.
- Game design lives in approved system notes and the GDDR decision-record set in
  [[../50-Game-Design/README]]. Implement only from approved records; conflicts
  between approved game-design records are stop conditions until superseded.
- **AI narrative re-evaluation (2026-05-28):** Nico wants Runtime-LLM and
  narration ready for the MVP as a draft path. The current draft target is Full
  Dialogue plus async flavour, with all active actor classes generated as
  deterministic context-card inputs. Actor traits/intents may affect mechanics
  deterministically; generated prose may not. The current framework direction
  is a dedicated Narrative context plus Playtest First quality loop.
- **Player/staff decision-influence re-evaluation (2026-05-28):** FMX-38 adds
  draft factor matrices for development, match, transfer and staff-pipeline
  influence. Use GD-0021 as the planning map for owner/consumer relationships;
  do not treat staff-skill Option B as approved until Nico decides.
- **Manager-Archetype Roguelite re-evaluation (2026-05-27):** Nico wants the
  report anchored for the MVP, but as hooks only. The first playable should
  capture run-end facts and style signals; final archetype families, thresholds,
  perk strength and prestige ladders remain playtest-tunable draft design.

## Active MVP Scope (2026-05-18)

[[MVP-Scope]] is canonical for "what ships first":

- **Playable MVP mode**: [[../50-Game-Design/mode-create-a-club-roguelite|Create-a-Club Roguelite]].
- **Visible but not playable**: [[../50-Game-Design/mode-manage-a-club-career|Manage-a-Club Career]]
  as a "comes later" tile/promise.
- **Runtime posture**: server-confirmed / online-authoritative progression,
  with Dexie caches, drafts and local UI state.
- **Offline posture**: app shell, safe cached reads and local drafts only.
  Full offline-first local authority is Phase 2+ selective offline.
- **Export/import**: post-MVP user-facing feature; envelope/versioning
  reserved from day one.

## Stack revision (2026-05-19, [[Decision-Log#Stack revision 2026-05-19 deep tech-stack review]])

A deep tech-stack review is recorded in [[../10-Architecture/09-Decisions/ADR-0021-revised-tech-stack]]
(supersedes the original tech-stack ADR; see [[Decision-Log]] for the chain):

- **DB (hybrid):** PostgreSQL + Drizzle is the system of record. **SurrealDB
  deferred** to an optional additive realtime/graph engine behind an interface.
  **Wave 2 groundwork landed 2026-05-19**: [[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]]
  (supersedes ADR-0004) and [[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]]
  (supersedes ADR-0013) lock the Postgres design (schema-per-save, A2 lazy
  migration, Drizzle source of truth + generated standalone Zod mirror, branded
  opaque cross-context UUIDs, junction-table edges, integer-only numerics,
  same-tx outbox + polling-floor/`LISTEN/NOTIFY` + native partitioning).
  [[../30-Implementation/postgres-drizzle-integration]] replaces the superseded
  SurrealDB integration spec.
- **State:** TanStack Query (server) + Zustand v5 (client/sim). **Zod 4.**
  All-in TanStack data layer (Query/Table/Virtual/Form).
- **Game-feel:** Motion + GSAP ([[../10-Architecture/09-Decisions/ADR-0022-animation-game-feel]]).
- **Realtime:** SSE now → Centrifugo planned ([[../10-Architecture/09-Decisions/ADR-0023-realtime-transport]]).
- **Notification/Messaging:** [[../10-Architecture/09-Decisions/ADR-0043-notification-and-messaging-platform]]
  locks a first-party Notification bounded context. PostgreSQL is durable
  notification truth, SurrealDB is allowed as additive graph/live projection,
  Dexie mirrors the in-app inbox offline, SSE is the MVP wake-up/update
  channel, Centrifugo is the realtime scale path, Brevo is the default
  transactional email provider with Mailjet fallback, and Web Push/native push
  are prepared behind adapters.
- **Match view:** Canvas 2D first; PixiJS no longer planned ([[../10-Architecture/09-Decisions/ADR-0024-match-renderer-abstraction]]);
  engine↔renderer seam pinned by [[../10-Architecture/09-Decisions/ADR-0026-match-frame-contract]]
  (new `packages/match-contract` leaf package, events-only engine, derived non-
  persisted frames, `chance` removed / `save` added).
- **Presentation renderer:** two-renderer strategy locked by
  [[../10-Architecture/09-Decisions/ADR-0041-presentation-renderer-strategy]]
  and [[../60-Research/presentation-renderer-strategy]]. MVP match remains Text
  & Stats + Canvas 2D; no interactive/authoritative browser 3D match view.
  Optional post-MVP 2.5D/3D stadium, campus, trophy, celebration or curated
  highlight scenes are presentation-only, lazy-loaded and fallback-safe.
  **Babylon.js** is the optional 3D/iso presentation engine
  ([[../10-Architecture/09-Decisions/ADR-0047-babylon-3d-presentation-engine]], supersedes
  the earlier Three.js/R3F choice); PixiJS/PlayCanvas/Three.js are not planned. Live match
  render stays Canvas 2D.
- **Mobile:** PWA + planned Capacitor shell ([[../10-Architecture/09-Decisions/ADR-0025-mobile-delivery]]).
- **Presentation 3D layer (post-MVP, Phase 2):** **Babylon.js** (ADR-0047)
  for isometric stadium / campus view + kuratierte Event-Cutscenes (walkout,
  trophy lift, goal celebration) + static highlight backdrops
  ([[../10-Architecture/09-Decisions/ADR-0029-3d-presentation-layer]]). Lives
  parallel to (not inside) the match renderer; gated by `SceneDescriptor`
  contract + 2D fallback on Floor / `prefers-reduced-motion` / Save-Data /
  iOS context-loss trip.
- **Observability:** lean MVP profile; Tempo/Mimir deferred (ADR-0017 amended).
- **Auth:** F2 already locked Argon2id (review premise was wrong); only library
  refined to `@node-rs/argon2`. Deps pinned + Renovate (no more `"latest"`).
- **Secrets (F11):** Category B is now Postgres `DATABASE_URL` + roles;
  [[../30-Implementation/secrets-management]] amended (no `.sops.yaml` change —
  `dsn:` matches the existing `encrypted_regex`).
- **Open ADR disposition 2026-05-19:** ADR-0006/0008/0012/0014/0015/0016 all
  carry informational "Stack-revision impact" banners; **none promoted**
  (owner directive: stop with reviews at the moment). Gate remains owner
  review / Wave-2 research closure.
- **Tech-debt tracked (non-blocking):** Storybook 8 → 9 upgrade
  ([[../10-Architecture/11-Risks#Tracked tech-debt (non-blocking)]]).
- Retained unchanged: TanStack Start/React/Tailwind/Dexie/Biome/Vitest/
  Playwright/pnpm. **Deployment: Dokploy on the existing Hetzner machine —
  owner-confirmed 2026-05-19 (Nico), stays; mandatory mitigations in
  [[../30-Implementation/deployment-dokploy]].**
- **Next engineering wave (Wave-2 → Wave-3 implementation):** real Postgres
  driver + `QueryGateway` + lazy migrator (`packages/db`), full ADR-0027
  domain schema for the bounded contexts, the outbox publisher worker +
  SSE bridge, Capacitor shell scaffold, the match-engine implementation
  against the now-locked ADR-0026 contract.

## Approved product rules (Wave 2, updated by MVP scope 2026-05-18)

- **Long-term mode matrix**: one simulation core, two content modes
  ([[../50-Game-Design/mode-create-a-club-roguelite|Create-a-Club Roguelite]]
  and [[../50-Game-Design/mode-manage-a-club-career|Manage-a-Club Career]]),
  two session modes
  ([[../50-Game-Design/singleplayer-baseline|Singleplayer]] and
  [[../50-Game-Design/async-multiplayer-private-group|Private Async Group]]).
  Private groups are locked to one content mode at creation. MVP sequencing is
  Roguelite first per [[../50-Game-Design/GD-0017-mvp-scope-and-mode-sequencing]].
- **Async cadence**: two rule sets, **Fixed** (default) and **Dynamic**
  (quorum + countdown). Switch only at season boundary.
  ([[../50-Game-Design/async-multiplayer-private-group]])
- **Progressive disclosure**: three explicit UI tiers - Quick / Standard /
  Expert. Default Standard.
  ([[../50-Game-Design/progressive-disclosure-ui]])
- **Player strength presentation**: Impact-first, no global OVR. Squad,
  tactic, scouting and transfer recommendations use role/tactic-contextual
  Impact Lens projections, category bars, status signals and scouting
  confidence instead of universal stars or Overall ratings.
  ([[../60-Research/player-strength-presentation]],
  [[../50-Game-Design/progressive-disclosure-ui]],
  [[../50-Game-Design/tactics-system]])
- **Singleplayer remains the long-term baseline**: every system ships first in
  singleplayer; multiplayer rules are additive constraints. The MVP is a
  narrower Roguelite-first slice.
  ([[../50-Game-Design/singleplayer-baseline]])
- **Match engine gameplay profile**: swappable server-authoritative
  spatial-event simulation with intervention points, Result / Event / Spatial /
  Analytics output layers, explicit match-depth profiles, 2D/ticker/replay
  consumers and Rust-default runtime spike. ([[../50-Game-Design/match-engine]],
  [[../10-Architecture/09-Decisions/ADR-0049-swappable-spatial-event-match-engine]],
  [[../60-Research/swappable-spatial-event-match-engine-2026-05-27]])
- **Club economy gameplay profile (draft)**: MVP economy pillar with weekly
  Club Management ledger, full-accounting projections, staged insolvency,
  country economy profiles, commercial impact contracts, fan-service campaigns,
  cup/competition revenue profiles, Investor clean SP cash planning and
  progressive finance UI. Final constants and approval remain Nico-gated.
  ([[../60-Research/club-economy-blueprint-2026-05-27]],
  [[../60-Research/club-economy-impact-map-and-commercial-contracts-2026-05-28]],
  [[../60-Research/cup-and-competition-revenue-profiles-2026-05-28]],
  [[../50-Game-Design/GD-0008-finance-economy]],
  [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]],
  [[../50-Game-Design/economy-system]],
  [[../20-Features/feature-club-economy-mvp-pillar]],
  [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]],
  [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]])
- **Manager & Legacy gameplay profile (draft)**: MVP run-analysis hooks for
  Manager-Archetype Roguelite progression; emergent style signals before fixed
  archetype taxonomy; balance-corridor perks only with prestige counterweight;
  full meta-progression post-MVP unless Nico expands scope.
  ([[../60-Research/manager-archetype-roguelite-2026-05-27]],
  [[../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]],
  [[../20-Features/feature-roguelite-mvp-first-playable]],
  [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]])
- **Player lifecycle and systemic events**: squad structure, player
  development, training/medicine, stadium/campus and match-day event
  specs are approved. Development is weekly and causal; PA is true hidden
  potential plus scouting uncertainty; injuries are multifactor risk
  events; venue operations are weekly/event-based Club Management rules;
  narrative is deterministic rendering of structured facts.
  ([[../60-Research/systemic-events-player-development-venue-ops]],
  [[../50-Game-Design/squad-and-club-structure]],
  [[../50-Game-Design/youth-academy-and-development]],
  [[../50-Game-Design/training-load-and-medicine]],
  [[../50-Game-Design/stadium-and-campus]],
  [[../50-Game-Design/matchday-event-engine]])

## Active Architecture

- [Decision Log](Decision-Log.md) lists accepted, draft and proposed ADRs.
- The stack baseline is TanStack Start/Router, React, shadcn/ui, Tailwind,
  PostgreSQL + Drizzle as system of record, optional additive SurrealDB behind
  an interface, Dexie, Vitest, Playwright, Biome, Docker, Dokploy, and pnpm.
- Server-only secrets stay behind server functions or server-only modules.
- Database access flows through the project DB client / query gateway and
  parameterized queries.
- Game saves live in IndexedDB via Dexie.
- Observability is self-hosted by default: OpenTelemetry JS +
  Grafana Loki / Prometheus / Tempo / Alloy + Grafana, with GlitchTip
  for crash/error reporting. See
  [[../10-Architecture/09-Decisions/ADR-0017-observability-logging]].

## Classified Future Architecture (Baseline 2026-05-22)

The Wave 2 proposal layer is no longer an active backlog list. Items that remain
draft/proposed are classified future-scope or optional cleanup by
[[Documentation-V1]]. Highlights:

- DDD modular monolith with 16 bounded contexts
  ([[../10-Architecture/bounded-context-map]]); ADR-0019 set the original
  eleven-context modular monolith; ADR-0051 ratified Manager & Legacy as
  the twelfth context on 2026-05-28 (FMX-25 + FMX-35); ADR-0053 ratified
  Staff Operations as the thirteenth context on 2026-05-28 (FMX-26 +
  FMX-36); ADR-0055 ratified Tactics as the fourteenth context on
  2026-05-28 (FMX-28 + FMX-37); ADR-0056 ratified Regulations &
  Compliance as the fifteenth context on 2026-05-28 (FMX-30 + FMX-39);
  ADR-0057 ratified Rivalry System as the sixteenth context on
  2026-05-28 (FMX-34 + FMX-40).
- Server-authoritative multiplayer with command-only clients is binding through
  ADR-0011 and current multiplayer game-design notes.
- Both async cadence models, switchable at season boundary.
- Transactional outbox for reliable domain-event publication is binding through
  ADR-0028.
- Explicit state machines for League / Transfer / Watch-Party / Match are
  future orchestration detail before runtime work changes.
- Watch parties via spectator snapshot streaming with delay are post-MVP.
- Community datasets via versioned override packs are future-scope until
  moderation/security gates exist.
- Runtime LLM is reopened only as a draft evaluation via
  [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]].
  Until accepted, no implementation may use it. The candidate is async narrative
  flavour outside authoritative state, with OpenRouter behind an adapter, no
  clear user data / PII / raw free text in prompts and template fallback as the
  baseline.

## Active Risks (Pre-Mortem 2026-05-20, 3 Iterationen)

A 6-month / 10.000-player pre-mortem was logged on 2026-05-20 covering
all major domains across **3 iterations**:

- **Iter 1**: architecture, tech & ops, gameplay, monetization (40 findings).
- **Iter 2**: security & integrity (import/export integrity, command signing,
  save trust levels), future-scope BYOC (distributed match compute), cross-
  cutting threat-model, Single-Player-Foundation-Addenda in original reports
  (+22 findings).
- **Iter 3**: 12 deep-dive reports — live-ops & client-telemetry, legal/
  consumer-law/tax (beyond DSGVO), i18n/l10n, accessibility (WCAG 2.2 AA /
  EAA-2025 / BFSG), AI/LLM dependency & fallbacks, long-term game-balance,
  community/moderation/UGC, brand/PR/crisis-comms + re-branding, browser/
  device/storage matrix, test-strategy-depth, vendor-lifecycle & sustainability,
  responsible-gaming & open-source (+129 findings).

**~191 findings total** carrying stable IDs (`PM-2026-05-20-XX-F-NN`) with
**P0–P4 priority tagging** — citable in commits, PRs and ADRs as
`Addresses PM-…`.

**Fresh-agent entry points:** [[../60-Research/pre-mortem/execution-index]]
groups all findings into **15 expertise categories** (SEC, BACKEND, PLATFORM,
FRONTEND, DETERMINISM, GAMEDESIGN, TEST, A11Y, LEGAL, PRODUCT, AI, COMM, BRAND,
FOUNDER, SUSTAIN) — each category is a self-contained briefing for a single
agent to draft documented solutions (ADRs / GDDRs / Implementation-Specs /
Runbooks). [[../60-Research/pre-mortem/prioritization-matrix]] shows P×I
heat-map, Score×Effort levers, Cross-Cutting-Cluster A–G and Sprint allocation
T-90 → T-0.

**Gap closure concept (2026-05-22):**
[[../95-Archive/gap-reports/gap-closure-concept-2026-05-22]] closes the
research/concept gap for all formerly open Pre-Mortem findings through 15
Solution Tracks, current external best-practice sources and explicit
competition differentiation. Registry/source-report status is now `mitigated`
for concept closure; `verified` remains reserved for downstream code, tests,
drills, legal sign-off or production evidence. BYOC remains `accepted-risk`.

**P0 — Pre-Launch-Blocker (13 findings):**
- [[../60-Research/pre-mortem/PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-02|01-F-02]] — SurrealDB single-node SPOF (score 25)
- [[../60-Research/pre-mortem/PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-04|02-F-04]] — Backups never restored (score 25)
- [[../60-Research/pre-mortem/PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-01|04-F-01]] — no monetization hypothesis (score 25)
- [[../60-Research/pre-mortem/PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-01|05-F-01]] — save authenticates key knowledge, not provenance (score 25)
- [[../60-Research/pre-mortem/PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-02|05-F-02]] — commands not signed / replay-protected (score 25)
- [[../60-Research/pre-mortem/PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-05|08-F-05]] / [[../60-Research/pre-mortem/PM-2026-05-20-14-brand-pr-and-crisis-comms#PM-2026-05-20-14-F-01|14-F-01]] — trademark collision SEGA/SI (score 25, **Rebrand vor Public-Launch**)
- [[../60-Research/pre-mortem/PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-06|08-F-06]] — UGC DFL trademark / club logos (score 20)
- [[../60-Research/pre-mortem/PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-11|08-F-11]] / [[../60-Research/pre-mortem/PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-01|13-F-01]] — DSA Art. 16 Notice-and-Action SLA (score 25)
- [[../60-Research/pre-mortem/PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-01|10-F-01]] — WCAG 2.5.7 Dragging Movements (Tactic-Board ohne Tastatur-Alternative, score 25)
- [[../60-Research/pre-mortem/PM-2026-05-20-15-browser-device-storage-matrix#PM-2026-05-20-15-F-01|15-F-01]] — iOS-Safari 7-Tage-Eviction (score 25, ~30 % Mobile-Markt Datenverlust)
- [[../60-Research/pre-mortem/PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-07|17-F-07]] — CRA-SBOM-Pflicht (score 25, **Stichtag 11.09.2026 Vuln-Reporting**)

**Regulatorische Stichtage 2026/2027:**
- **2026-08-02**: EU AI Act Art. 50 (Kennzeichnung synthetic content)
- **2026-09-11**: CRA Vulnerability-Reporting an ENISA (24 h ab CVSS ≥ 9.0) — **harte Pflicht**
- **2026-12-02**: AI Act Art. 50 Bestandssysteme
- **Q4 2026**: EU Digital Fairness Act Proposal erwartet
- **2027-12-11**: EU CRA volle Anwendbarkeit (SBOM, 5-Jahre-Updates) — **harte Pflicht**

**Leitsatz.** Single-player ist das Fundament — aber jedes Datenformat, jeder
Command-Pfad und jede State-Übergangsfunktion wird so entworfen, dass sie auch
unter dem strengeren Vertrauensmodell von async Multiplayer und (zukünftig)
Distributed Match Compute trägt. **Ein Stack mit zuschaltbarem Trust-Level.**
**MVP-Linie** (deliberate omissions): Runtime-LLM nur nach Ratifikation von
[[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]] und
nur ausserhalb authoritative state; kein Image-Upload, kein Free-Form-Chat, kein
aktives Marketing, kein Cloudflare-Workers-Lock, keine Lootboxes, keine
Daily-Login-Streaks.

**BYOC (Distributed Match Compute) status:** future-scope. Decision-Gate
defined in [[../60-Research/pre-mortem/PM-2026-05-20-06-distributed-match-compute]];
all 10 BYOC findings are `accepted-risk` until gate passes (compute > 500 €/Mo
+ external threat-model-review + DPIA + 1 quarter server-only baseline).

**~15 vorgeschlagene ADRs** (0026–0040) sammeln sich aus dem Cluster — siehe
[[../60-Research/pre-mortem/findings-registry]] § ADR-Vorschläge.

Cluster entry: [[../60-Research/pre-mortem/00-index]]. Threat-model:
[[../60-Research/pre-mortem/threat-model]]. Aggregated status mit
P0–P4-Sortierung: [[../60-Research/pre-mortem/findings-registry]]. Concept closure: [[../95-Archive/gap-reports/gap-closure-concept-2026-05-22]].

## Active Vault Rules

- [../90-Meta/vault-governance.md](../90-Meta/vault-governance.md)
- [../90-Meta/agent-memory-protocol.md](../90-Meta/agent-memory-protocol.md)
- Superseded notes are historical only.
- New approaches must update this page or the relevant map.

## Active Maps

- [Architecture Map](Architecture-Map.md)
- [Game Design Map](Game-Design-Map.md)
- [Feature Map](Feature-Map.md)
- [Research Map](Research-Map.md)
- [Implementation Map](Implementation-Map.md)
- [User Docs Map](User-Docs-Map.md)

## Documentation Gap Closure (2026-05-22)

[[../95-Archive/gap-reports/wave-3-gap-analysis]] is superseded as an active backlog by
[[Documentation-V1]]. Its IDs remain traceability anchors, but
not open work. The pre-mortem findings registry is concept-closed through
[[../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]:

- Pre-mortem findings are `mitigated` at research/concept level or
  `accepted-risk` for gated BYOC.
- `verified` is reserved for implementation evidence: tests, drills, legal
  sign-off, production telemetry or release artifacts.
- Draft/proposed ADRs, GDDRs and feature stubs are future-scope or optional
  cleanup unless this page explicitly promotes them.

## Threat model active (2026-05-18)

[[../60-Research/threat-model]] is the binding security reference for
the project (Wave 3 gap F1). It locks:

- **Attacker scope** (T0-T4 in, T5-T6 partial, T7-T9 out) — any
  expansion needs an ADR + update to this note.
- **STRIDE catalogue** of 41 concrete threats per bounded context with
  bound controls referencing ADR-0002 / 0005 / 0011 / 0013 / 0017 /
  0019 + OWASP ASVS v5 L2 + NIST SP 800-38D / 63B / 92 / 190 +
  SLSA v1.0.
- **Trust-boundary diagram** across Client / Edge / App / Match Worker
  / DB / Redis / Observability planes.
- **Cryptographic refinements** to ADR-0005: PBKDF2 stays MVP, Argon2id
  when portable-export UI ships; 1M-encryption soft cap per content
  key; compress-then-encrypt safe at rest; no XChaCha20-Poly1305 at
  MVP.
- **9 residual risks** explicitly accepted with re-evaluation triggers.

Anchors downstream F2 / F3 / F5 / F6 / F10 / F11 / F12 / F13 /
C6 / C8 / D18. Product-owner questions in the note are historical Q&A unless
promoted by [[Documentation-V1]] or a current issue.

## Auth flows locked (2026-05-18)

[[../30-Implementation/auth-flows]] is the binding spec for the
user-facing auth surfaces (Wave 3 gap F2). It locks:

- **Credential model** — passkey-first sign-up + login with password
  fallback; opt-in TOTP / WebAuthn-as-MFA; 10 single-use recovery
  codes; "cannot recover" stance if all credentials are lost
  (matches privacy-first posture).
- **Sensitive-op catalogue + step-up MFA** with `stepup_mfa_max_age`
  15 min and `reauth_max_age` 12 h.
- **Cookie + token shape** F3 must implement: opaque session-ID +
  Redis lookup (not JWT); `session_id` SameSite=Lax, `refresh_token`
  SameSite=Strict on Path=`/api/auth/refresh`, refresh-token
  rotation with reuse detection.
- **Three-layer CSRF defence** — SameSite + `Origin`/`Sec-Fetch-Site`
  enforcement + double-submit token.
- **`accountSecret` bootstrap contract** — once-per-device delivery
  via `GET /api/auth/account-secret/bootstrap` after authenticated
  session, immediately wrapped client-side as a non-extractable
  AES-GCM `CryptoKey` per F1 §5.4 and ADR-0005 §3.
- **No external IdP / no CAPTCHA / no SMS at MVP** — schema +
  abstraction provisioned now (`user_identity` table,
  `ExternalIdentity` value-object, `openid-client` chosen) so post-
  MVP addition is additive.
- **Redis-based progressive throttling** and **anomaly signal
  starter set** (new-device, new-country, impossible-travel,
  credential-stuffing, password-reset storm, signup storm, global
  fail spike); no auto-lockout at MVP.
- **Argon2id** for password storage with calibrated 2026 params
  (128 MiB / time 3 / parallelism 1, ~150–250 ms target).

Anchors F1 (threat model). Binds inputs for F3 Session management,
F5 Account recovery (stable account-master-key envelope), F6 GDPR
compliance (DSAR + DPIA on `accountSecret`), F12 Rate limiting.
Surfaces 7 product-owner Q&A questions and 9 follow-up tasks
(FU-1..FU-9) for the downstream gaps.
## Session management locked (2026-05-18)

[[../30-Implementation/session-management]] is the binding spec for
the server-side session and refresh-token lifecycle (Wave 3 gap F3).
It locks:

- **Redis hot store + PostgreSQL-backed outbox/audit events** as the
  persistence model; AOF + RDB on the Hetzner box; PostgreSQL never
  rehydrates Redis on cold start (force re-sign-in is the simplest
  safe behaviour).
- **Lifetimes**: 30 min idle / 12 h absolute on `session_id`;
  30 d refresh-family absolute; **15-second rotation grace window**
  with strict reuse detection outside it.
- **Slide-on-meaningful-activity** with 60 s rate-limit on Redis
  writes (Service-Worker and background prefetch never bump the
  timer).
- **Cross-tab logout/login broadcast** via BroadcastChannel +
  localStorage sentinel fallback; SSE push deferred to FU-2.
- **Revocation matrix**: 15 triggers (explicit logout, log-out-
  everywhere, per-device, password change/reset, MFA changes,
  recovery-code use, accountSecret rotation, email change, account
  lock, account delete, refresh-token reuse, operator emergency,
  idle/absolute expiry) × scope × outbox event; **hybrid
  `tokenVersion` + family-revoke** so identity-changing events take
  one atomic write while session-table family-revoke handles
  granular per-device cleanup.
- **`device` SCHEMAFULL table** with explicit separation between
  user-visible "Devices" (only after successful auth) and
  operational sessions; client-generated 128-bit `device_id` in
  IndexedDB; **no browser fingerprinting**.
- **"Trust this device"** opt-in 30-day MFA-skip with hard cap and
  anomaly-downgrade; never bypasses primary factor or step-up.
- **Per-device revoke** signs out sessions but does NOT rotate
  `accountSecret` by default (offline-first parity with Signal /
  1Password / Bitwarden); a separate "Sign out everywhere AND
  rotate security key" flow exists for known-compromise.
- **Offline-first reconnect**: silent refresh when family is still
  valid; non-modal "Cloud sync paused" banner when family expired;
  local progress never lost.
- **TanStack Start integration patterns**: `getSessionFromRequest`
  server helper, `createAuthedServerFn` higher-order wrapper
  enforcing `authorize(actor, action, resource)` + CSRF + Origin /
  `Sec-Fetch-Site` + optional step-up; `_authed/` route guard via
  `beforeLoad`; SSR hydration of minimal actor blob; singleton
  client-side CSRF interceptor; Workbox SW network-first on authed
  HTML + complete bypass of `/api/auth/**`.
- **Admin CLI** for emergency revoke at MVP (admin UI deferred to
  post-MVP).
- **Future-proof extension fields** provisioned now (`idp_provider`,
  `idp_sub`, `org_id`, `org_roles`, `session_purpose`, DPoP
  reservation per RFC 9449).
- **Compliance**: full ASVS v5.0 V7 + V8 mapping + NIST SP 800-63B
  rev. 4 §7 anchors + RFC 6819 / OAuth 2.1 draft refresh-token
  guidance.

Anchors F1 (threat model) and F2 (auth flows). Binds inputs for
F5 (stable account-master-key envelope, FU-7), F6 (DSAR + DPIA,
FU-8), F12 (edge WAF + per-endpoint quotas, FU-9). Surfaces 7
product-owner Q&A questions and 9 follow-up tasks.
## Account recovery locked (2026-05-18)

[[../30-Implementation/account-recovery]] is the binding spec for
the master-key envelope and the full recovery-flow set (Wave 3 gap
F5). It locks the architectural shift that closes F2 FU-1 and
F3 FU-7: a stable inner master key `K` survives all rotations of
the user-visible secret; only the small envelope is re-wrapped.

- **Stable inner `K`** (256-bit AES-GCM, non-extractable on every
  device, never seen by server) + **canonical user-level envelope**
  `Env_user = AES-GCM-256(K, KEK_user)` with
  `KEK_user = PBKDF2-SHA256(accountSecret, userSalt, 600 000)`.
- **No cross-device protocol on rotation**: re-wrap `Env_user` once;
  other devices fetch the new `Env_user` on re-login. Per-device
  envelopes are an optional offline-cache optimisation, not a
  security primitive.
- **Three recovery flows**: email password reset (mandatory
  `accountSecret` rotation, full session revoke); recovery-code
  use (10 single-use codes with their own envelopes, mandatory
  regeneration of the full set + `userSalt` rotation on use);
  "Sign out everywhere AND rotate security key" (Settings).
- **Cannot-recover cliff confirmed**: passkey + password + all 10
  codes lost → account unrecoverable by design; portable-export
  with remembered passphrase is the only escape path.
- **F2 → F5 lazy migration**: per user on first F5-enabled login;
  one-shot save re-encryption inside the migration transaction
  (~1-2 s for a typical user); idempotent; offline-compatible.
- **Atomic rotation algorithm** with Redis `rotation_lock` + 60-s
  TTL + idempotency-key replay protection + PostgreSQL transaction
  wrapping `accountSecret` update + `env_user` swap +
  `account_secret_version++` + `envelope_version` bump +
  `token_version++` + cache wipe + outbox emission.
- **Versioned envelope wire format** with full AAD binding;
  `envelopeVersion = 2` reserved for Argon2id (post-MVP portable
  export UI), `envelopeVersion = 3` reserved for HPKE / RFC 9180
  (post-quantum migration), `wrapMode = 'shared_save'` reserved
  for Phase-2 cloud MP per-member content keys.
- **Web Crypto mechanics** spelled out: generate `K` as
  `extractable: true` for the wrap step, then re-import as
  `extractable: false` for runtime use; `wrapKey/unwrapKey`
  semantics keep `K` out of JS heap; `CryptoKey` survives
  `IndexedDB.put()` round-trip on Chrome / Edge / Firefox /
  Safari 16+; constant-time error UX via uniform
  `InvalidEnvelopeError`.
- **10-row attack mitigation matrix** on recovery surfaces
  (reset-email intercept, recovery-code phishing / stuffing /
  replay, oracle timing, email-change → reset chain, server
  compromise, rollback, envelope transplant).
- **Compliance**: full NIST SP 800-130 + 800-63B §6 + 800-132 +
  800-38D + 800-57 Pt. 1 + OWASP ASVS v5 V6 + V11 mapping.

Anchors on F1 (threat model) + F2 (auth flows) + F3 (session
management); closes F2 FU-1 + F3 FU-7. Surfaces 6 Q&A questions
(all defaults sensible) and 9 deferred follow-ups (FU-1..FU-9)
to F4 / F6 / E10 / E11 / post-MVP.
## GDPR compliance locked (2026-05-18)

[[../60-Research/gdpr-compliance]] (research synthesis) +
[[../30-Implementation/privacy-and-consent]] (implementation
surface) jointly lock the F6 P0 compliance posture. Highlights:

- **Legal landscape**: GDPR yes, ePrivacy Directive yes (no
  ePrivacy Regulation adopted in 2026), DSA de minimis, DMA no,
  EU AI Act low-risk path (deterministic worldgen per ADR-0007),
  NIS2 no. Lead supervisory authority: **BfDI** via one-stop-shop
  (Art. 56) for our DE domicile.
- **Art. 30 RoPA**: 8 processing activities × 6 data categories;
  lawful basis Art. 6(1)(b) contract for the core service +
  Art. 6(1)(f) legitimate interest for security anomaly +
  observability (two formal three-part LIAs in the research
  note); **no Art. 9 special-category data** processed (passkey
  credentials store public-key material, not biometric).
- **No third-country transfers** — sidestepping the Chapter V
  SCC/TIA/DPF apparatus entirely; GitHub explicitly assessed as
  non-processor for user data.
- **Children's data**: 16+ self-declaration radio at signup with
  refusal flow; no DOB collected; no parental-consent flow at
  MVP per § 12 BDSG + EDPB indie-default.
- **DPIA**: voluntary (Art. 35(3) not mandatory at our scale —
  confirmed against BfDI Muss-Liste + CNIL + ICO lists). The
  DPIA lives in the research note §8 and is the documented
  paper trail.
- **DPO**: **not required** (Art. 37 + § 38 BDSG thresholds both
  below). Founder designated as Privacy Lead. Re-evaluate at
  100 k MAU or 20 employees.
- **Retention schedule**: per-category; audit outbox forever
  with one-way HMAC pseudonymisation on Art. 17 erasure
  (preserves forensic event sequence while disconnecting from
  the natural person); cryptographic erasure via F5 envelope
  burn at account-delete + 30 d grace expiry.
- **No cookie banner at MVP**: all storage is strictly necessary
  per ePrivacy Art. 5(3); passive footer Privacy Notice link
  satisfies Art. 13.
- **User rights endpoint surface**: `POST /api/me/data-export`
  (Art. 15+20 with full DSAR ZIP layout); `PATCH /api/me/profile`
  (Art. 16 with step-up MFA only on email change + dual
  confirmation + 24 h cool-down); `POST /api/me/delete-account`
  (Art. 17 with 30-day grace + cryptographic erasure on expiry
  + outbox pseudonymisation); `POST /api/me/restrict` (Art. 18);
  Art. 21 explainer modal with legitimate-interest override
  documented + account-closure escape; Art. 22 explicitly N/A
  (no auto-decisions with legal effects).
- **Breach notification runbook**: Art. 33 (BfDI within 72 h
  with WP250 partial-notification pattern) + Art. 34 (DE + EN
  user-notification template).
- **Vendor Art. 28 DPAs required**: Hetzner AVV + transactional
  email vendor only. Brevo (FR, EU residency) selected as
  default per F2 §10.7 + F6 §11.4.
- **Compliance overhead** for an indie 1-3 founder studio:
  ~7-15 founder days launch + ~3-5 days/year ongoing.

Closes F2 FU-6 + F2 FU-7 + F3 FU-8 + F5 FU-8 + F5 FU-9.
Surfaces 6 minimal product-owner Q&A (Brevo email vendor,
age-gate language, pseudonymisation, backup non-scrub
disclosure, DPIA/LIAs co-located in the research note, Privacy
Lead designation) + 10 deferred follow-ups (FU-1..FU-10).
## Secrets management runbook locked (2026-05-18)

[[../30-Implementation/secrets-management]] is the binding F11
runbook for the full secrets surface. Highlights:

- **15-category secret inventory** (A-O) with per-category
  rotation cadence + zero-downtime recipes.
- **sops + age + direnv** repo layout with `.sops.yaml`
  `encrypted_regex` (values encrypted, structure visible);
  per-env directories `secrets/{dev,staging,prod}/`; `*.enc.*`
  naming convention enforced by CI lint.
- **3-class age key hierarchy** (human / environment / CI) with
  paper-backup escrow; founder-only prod access.
- **Zero-downtime rotation recipes**: versioned HMAC pepper
  (D / G / N) with 7-30 d overlap; `accountSecret` column-
  encryption key (E) with per-row version + online migration +
  90 d old-key escrow; age key (A) via `sops updatekeys` +
  cosign re-sign; dual-user PostgreSQL (B) with 7-14 d overlap.
- **Zero-secret CI + Dokploy local decryption + tmpfs runtime
  injection** (NIST SP 800-190 + CIS Docker Benchmark). The
  only static CI secret is the bounded-scope `DOKPLOY_WEBHOOK_SECRET`.
- **Cosign keyless container signing** via GitHub OIDC +
  Sigstore Fulcio; locally-cached trust fallback on Rekor
  outage (closes F1 FU-6).
- **5-tier accidental-leak classification + 1-hour response
  playbook**; specific leaked-age-key + leaked-column-key
  playbooks; integration with F6 §9 Art. 33/34 breach
  notification.
- **Detection sources**: GitHub secret-scanning, gitleaks +
  trufflehog CI, F2 §8.5 anomaly signals, responsible-
  disclosure email.
- **Quarterly Tier-A dependency audit runbook** (closes
  F1 FU-4) — 11 initial packages, Socket.dev + OSV + GitHub
  Advisory + `npm audit signatures`; `pnpm.overrides` +
  `SECURITY_OVERRIDES.md` for security pins.
- **SLSA Level 2 target** at MVP with cosign provenance + Syft
  SBOM.
- **Backup + recovery drill schedule**: Redis-only restore
  monthly (closes F3 FU-6); PostgreSQL restore semi-annually;
  age-key recovery annually; full-system snapshot restore
  quarterly. RTO < 2 h, RPO ≤ 24 h.
- **6 DR tabletop scenarios** annually.
- **Audit integration**: every rotation / leak-response /
  drill emits an outbox event per ADR-0028.
- **`SecretsProvider` interface** in `apps/web/src/server/secrets/`
  for future-proof migration to Bitwarden SM / Infisical /
  1Password Connect when graduation triggers hit (≥ 5 devs,
  ≥ 3 envs, SOC 2 / ISO 27001 / TISAX audit, payments).

**Closes F1 FU-4 + F1 FU-6 + F3 FU-6.** Surfaces 6 minimal
product Q&A (all sensible defaults). 9 follow-ups (FU-1..FU-9)
anchored to E10 / E11 / post-MVP / founder.
## Rate limiting and anti-abuse locked (2026-05-18)

[[../30-Implementation/rate-limiting-anti-abuse]] is the binding
F12 spec for the abuse-surface layer of the platform. Highlights:

- **3-phase edge-WAF graduation pathway** (closes F1 Q5):
  Phase 1 no edge WAF at MVP (Hetzner native L3/4 + app-level
  Redis-Lua quotas sufficient; matches F6 §10 EU-residency
  posture); Phase 2 Bunny.net Shield when triggered (EU
  Slovenian; signed Art. 28 DPA; updates RoPA); Phase 3
  Cloudflare explicitly rejected unless TIA + DPA + Privacy
  Notice revision complete.
- **Full per-endpoint quota catalogue** across 7 groups (GDPR /
  auth / saves / MP commands / game reads / observability /
  admin) with `429 Too Many Requests` + IETF rate-limit
  headers; stable `reason` enum; advisory vs enforced rows.
- **6-pattern anti-griefing playbook** for MP + transfer
  surfaces: lowball storming (< 25% market value → 7-day
  cooldown), counter ping-pong (max 5 rounds), inactive member
  (host-kick after 14 in-game days), quorum spam (max 3
  votes/season/group), press-conference spam (last-write-wins
  10-min re-edit), spectator burst (60/hour + 10/10s). Each
  emits `mp.griefing_blocked` outbox event.
- **Single-VM Redis-Lua token-bucket** at MVP via hand-rolled
  Lua + ioredis; multi-VM scale-out path documented
  (shared Redis Cluster default at first trigger).
- **mCaptcha stage-1 → Friendly Captcha stage-2** activation
  thresholds (closes F2 FU-5); rejected reCAPTCHA / hCaptcha /
  Turnstile on GDPR.
- **Admin CLI**: `pnpm rate-limit:block | unblock | status |
  tighten | restore | captcha-on | captcha-off | captcha-provider`
  with SSH + admin TOTP + outbox emission.
- **Observability**: Prometheus counters + Loki structured logs
  with redaction + 2 Grafana dashboards (operational +
  security) + 6 alert rules; email + Discord webhook at MVP.
- **DE/EN user-facing 429 copy** for 10 distinct reasons;
  never reveals exact thresholds.
- **Future-proof extensions** provisioned (B2B per-org tier,
  paid-tier burst credit, WebSocket / SSE quotas, distributed
  quota multi-VM path).

**Closes F1 Q5 + F2 FU-5 + F3 FU-9.** Surfaces 6 minimal
product Q&A (all defaults confirmed) + 9 follow-ups
(FU-1..FU-9) anchored to E10 / E11 / observability-runbook /
calendar / when-triggered.
## Transfer market blueprint active (2026-05-17)

[[../60-Research/transfer-market-simulation]] is the current binding
research synthesis for the active transfer market. It promotes Nico's attached
research into the project model:

- market value is a reference range, not a final price;
- AI selling compares `sellPressure` against `protectionScore` and uses hard
  floors to prevent token-fee sales of protected players;
- offers are multi-part clause packages priced by cash-equivalent value;
- club agreement and player / agent terms are separate gates;
- full negotiation depth is tiered by world proximity for D9 PWA budgets.

Nico resolved the initial open decisions on 2026-05-17:

- full clause-family integration belongs in the MVP foundation;
- Expert UI should show clear numeric values when knowledge supports them,
  with confidence / source breakdown;
- Transfer Scope should be a save setting with Focused / Standard / Deep /
  Custom presets;
- training compensation / solidarity become simplified visible training rewards
  (net-only in Quick, full waterfall in Expert);
- agents stay simple at MVP but use stable future-ready profiles.

Implementation should start from
[[../10-Architecture/transfer-market-architecture]],
[[../50-Game-Design/transfer-market-and-contracts]] and
[[../20-Features/feature-transfer-market-ai-and-contracts]].

## Accepted architecture (Wave 2/3)

- **ADR-0019 Service-ready Modular Monolith with DDD** (accepted
  2026-05-16, gap B1). Eleven bounded contexts, strict storage
  isolation, network-transparent contracts. The MVP ships as one
  process but every context is extractable into its own service
  without code changes - only deployment / infra changes.
  FMX-16 proposes Manager & Legacy as a draft twelfth context; this is not
  accepted until ADR-0051 is ratified.
  See [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]
  and [[../10-Architecture/bounded-context-map]].
- **ADR-0020 Hybrid-online MVP, Offline-ready Architecture** (accepted
  2026-05-18). Supersedes ADR-0002 for MVP scope. MVP progression is
  server-confirmed; Dexie stores caches, drafts and future export/sync staging;
  selective offline-first singleplayer and export/import are post-MVP but
  reserved by contracts and save-envelope design.
- **ADR-0011 Server-Authoritative Multiplayer** (accepted 2026-05-16,
  gap B2). Server is the only authority for MP state. New product
  rules locked in this gap:
  - **Hotseat handoff**: a local hotseat save can be promoted into an
    async MP group via a one-way server-validated upload. After
    acceptance the device save is read-only for the promoted club.
  - **AI vs AI match policy**: server simulates every fixture with the
    same deterministic engine contract and a relevance-based quality
    profile. Human-involving matches store full event logs. AI vs AI
    matches store seed + lineups + tactics + quality profile + summary
    and re-simulate deterministically on demand (watch-party / audit).
  - **Encrypted saves**: AES-GCM 256 via Web Crypto API, PBKDF2 KDF
    from account secret + device salt. Tampering breaks the save.
    Mandatory in ADR-0005 (locked by B2).
  - **Offline conflict policy**: hard-reject with `rejected_with_reason`
    + show new state. No auto-rebase at MVP.
- **Narrative Content & Authoring Pipeline** (locked 2026-05-17, gap D15) -
  [[../60-Research/narrative-content-pipeline]]:
  - **Authoring format**: Markdown + frontmatter source
    (`packages/game-content/src/**/*.md`) → compiled locale-split
    JSON catalogues + typed TS message IDs + story-arc graph JSON.
    Writer-friendly (Git-reviewable; diffable) + dev-friendly
    (type-safe; lintable). Build pipeline: parse → validate → ICU
    syntax check → placeholder check → voice-card lint → locale-
    split compile → typed catalog emit.
  - **ICU library**: FormatJS / `intl-messageformat`. Generated TS
    types for message IDs + variable shapes (missing/extra vars
    fail CI). Plural / select / number / date formatting + nested
    ICU + gender-aware DE variants.
  - **Event family taxonomy**: **106 stable event family IDs** across
    10 groups (Match 18 / Squad-Player 20 / Board-Finance 16 /
    Tactical-Training 6 / Career 9 / Competition 9 / National Team
    6 / Personal Life 6 / Rumours-Press 9 / Records-World 7). Stable
    save-compatibility; variants/tones hang off families.
  - **Reactive variants**: 3-7 per family by tone + context flags
    (`opponent_strength`, `rivalry_level`, `streak_before`,
    `xg_diff`, `is_decider`, `owner_archetype`, `manager_archetype`).
    Storylet quality-gate model adapted from Failbetter Games.
    Variant selection via deterministic seed
    `hash(eventId + managerId + triggerDate)`.
  - **Priority + frequency caps**: HIGH always-shown (match results
    / sackings / takeovers / major transfers / trophy + relegation
    turning points; max 3/day); MEDIUM 3-4/week (transfer rumours /
    wantaway / board confidence / form streaks / national call-ups /
    records); LOW 1-2/week (opinion columns / fan reactions /
    rumours / personal life / tactical identity). Spam guard with
    catch-up summary on rollover.
  - **6 story arc state machines** at MVP:
    - **Transfer Saga** (4-6 beats): rumour → bid → negotiation →
      decision → aftermath
    - **Takeover Saga** (3-5 beats): rumour → confirmation → manager
      uncertainty → integration → retrospective
    - **Player Crisis** (4-7 beats): form dip → leaks → agent
      contact → press escalation → resolution → epilogue
    - **Bankruptcy / Administration** (5-8 beats; per D6 §6.4):
      warning → operational pain → admin → fire sale → White Knight
      OR decay → heroic save path → retrospective
    - **Rivalry Storyline** (ongoing per-season): per-rival H2H
      tracking + provocative press + manager succession
    - **National Team Tournament** (5 beats; per D6 §4): pre-
      tournament → group stage → knockouts → final → post-
      tournament
    - Each arc = `arcInstanceId + currentBeat + participants +
      flags + history + seedKey + startedAt + expiresAt`; saved in
      `narrative_arcs` IndexedDB object store; resumable across
      reloads.
  - **Press conferences** (5 tones × 4 contexts):
    - **5 tones**: Calm-Diplomatic / Critical / Defiant /
      Self-Deprecating-Humorous / Ambitious-Bullish
    - **4 contexts**: pre-match (vs important opponent / rival /
      underdog) / post-match (after win / draw / loss) / transfer
      window (signing / sale / rumour denial) / scandal-crisis
      (player issue / financial concern)
    - 2-4 questions per presser
    - **Cumulative effects** over season: `media_reputation` tag
      (RESPECTED / OUTSPOKEN / FIREBRAND / CHARISMATIC / BOLD /
      DULL) + `player_morale[mentioned]` deltas + `board_trust`
      deltas + `fan_sentiment` deltas. Stored in `press_history`
      per season.
  - **Newspaper generation** (auto from event log, per D6 §11.5):
    - Weekly: 2-4 headline candidates (upset factor / scoreline /
      narrative richness)
    - Monthly: opinion piece with `OVERACHIEVING` /
      `UNDERACHIEVING` / `MANAGER_UNDER_PRESSURE` flags
    - End-of-season: champions / promoted / relegated / surprise
      package / flop / top scorer
    - Decade retrospective: era labels + dynasty narratives + rival
      arcs
    - All deterministic via `hash(worldSeed + week + leagueId +
      'newspaper-weekly')` etc.
  - **Multi-layer voice consistency system**:
    - **Per-sender voice cards** (D5 locked; 10 senders): tone
      keywords + signature phrases + banned phrases + address style
      per locale + contractions allowed / forbidden + sentence
      length + emotional range + signoff allowed + 3 sample
      sentences per locale
    - **Per-AI-archetype reaction styles** (D4's 10 archetypes ×
      event-family tone weights = ~1500-2000 reaction-context
      slots). E.g. Chaos Motivator after heavy loss: DEFIANT 0.6 /
      CRITICAL 0.3 / CALM 0.1. Stabilizer after heavy loss: CALM
      0.6 / ANALYTICAL 0.3 / RESPONSIBLE 0.1.
    - **CI lint rules**: "Chairman never uses contractions" /
      "Assistant Manager must use 'boss' or 'Chef' in ≥ 1 in 3
      messages" / "Journalist must use a rhetorical question in
      70 % of messages" / "Family messages must avoid tactical
      jargon" / etc. Lint runs in `pnpm narrative:lint`; blocks PR
      on violations.
  - **Personal life events layer** (Anstoss flavour; toggleable):
    - 6 family types: `LIFE_FAMILY_COMPLAINT_TIME` /
      `LIFE_HEALTH_BURNOUT_WARNING` /
      `LIFE_VACATION_OPPORTUNITY_OFF_SEASON` /
      `LIFE_PUBLIC_APPEARANCE_TV_OR_INTERVIEW` /
      `LIFE_CHARITY_EVENT_OR_LOCAL_COMMUNITY_STORY` /
      `LIFE_OFF_FIELD_SCANDAL_RISK`
    - Tied to manager `stressLevel` quality (0-100), updated based
      on event log (high-pressure events increase stress; trophies
      / wins decrease)
    - **Settings toggle**: On (full) / Reduced (1 per in-game
      month) / Off (none)
  - **Build-time LLM assistance** (NEVER runtime per D8):
    - Variant draft generation (3-5 alternatives per template)
    - Tone drift detection (catches voice-card violations rule-
      based linter missed)
    - DE phrasing alternatives suggestions in PR comments
    - Cross-locale consistency check
    - Always human-reviewed before merge
    - **Optional at MVP** (can ship without; add post-MVP at scale)
  - **Writer + translator workflow** at MVP:
    - Markdown + frontmatter source in Git
    - Custom React preview app (`pnpm narrative:preview`): variable
      picker + locale toggle + voice-card view + lint panel + diff
      view + search
    - Translator workflow: same Markdown files (EN + DE sections
      adjacent); CI validates ICU syntax + placeholder consistency
      + missing translations
    - **Post-MVP platform evaluation**: Inlang (typed message
      workflows; modern dev-friendly) OR Tolgee (in-context
      translation). Avoid Lokalise / Crowdin / Phrase at indie
      MVP scale.
  - **Determinism + RNG**: extends D8 stream #9 `GeneratorRng`
    with `generator:narrative:*` sub-labels per D8 §2.3 future-
    proof. Save snapshot includes active arc states + press
    conference history + newspaper archive + personal life state →
    byte-identical replay.
  - **Performance + storage**:
    - Bundle: ~95-145 KB gzipped per locale lazy-loaded (within
      D9 per-route ≤ 200 KB)
    - IndexedDB: per save ~3-5 MB narrative data over 50 years
    - MVP content: 80-120 templates × ~60 words avg = ~10k words
      per locale; Phase 2: ~30k; Phase 3: ~60k.
  - **First PWA manager to combine**: FM tagged event system + Anstoss Zeitung
    templating + Club Boss inbox cast + Failbetter storylet quality-
    gates + Disco Elysium voice consistency + Ink-style state-
    machine arcs, all deterministic + offline-ready.
- **Late-Game Systems** (locked 2026-05-17, gap D6) -
  [[../60-Research/late-game-systems]]:
  - **Continental cup stack** (IP-safe per ADR-0007):
    - Fictional governing bodies: **IFC** (global) / **EFC**
      (Europe) / **AFU** (Americas) / **APFC** (Asia-Pacific) /
      **AFA** (Africa).
    - **3 tiers per continent**: Champions Cup / Continental League
      / Challenge Trophy.
    - **Global**: IFC Club World Masters (32 clubs from continental
      Champions Cups; pre-season super-tournament).
    - **Format**: classic 32-team groups + knockout at MVP (Swiss
      model deferred). Group winners drop into Tier-2 KO; cup winners
      auto-qualify higher tier next season.
    - **Qualification**: per-country slot allocation by initial
      ranking (EN/ES/IT 4 / DE/FR 3 / PT/NL 2 in Champions Cup);
      defending Champions Cup holder auto-qualifies; Continental
      League winner gets next Champions Cup slot.
    - **Country coefficient**: 5-year rolling window; biennial slot
      adjustment (+1 for top 3 / -1 for bottom 2; capped 1-5).
    - **Calendar**: continental midweek windows (Tue/Wed/Thu);
      league fixtures auto-rescheduled; "continental batch days"
      for perf.
    - **Prize money** (illustrative): Champions Cup max ~74.5M
      (10 participation + 8.5 group + 9 R16 + 10 QF + 12 SF + 25
      winner); Continental League ~30-35M max; Challenge Trophy
      ~12-15M max.
    - Anti-staleness integration with D4: rep boosts on
      qualification + winning; Rising Rival flagging via Continental
      League / Challenge Trophy overachievement.
    - National team competitions: **IFC Nations Championship**
      every 4y + **Continental Championships** offset 2y → big
      tournament every 2y.
  - **National team mode** (Bundestrainer arc):
    - **Dual-role** with **3 engagement levels**: Full Control /
      Match-Only (AI prepares squad; user one-tap confirms) / Light
      Touch (user only handles major tournaments).
    - Default level matches D5 experience question (Veteran = Full
      Control / Bit = Match-Only / Newbie = Light Touch).
    - **Top-nav toggle** `[Club] / [Nation]` with "Next Action" bar
      showing context.
    - **Unlock**: manager rep ≥ 75 AND (5+ seasons OR 3+ major club
      trophies).
    - **Job offers** spawn post-tournament + on board confidence
      < 20. Direct offer if user in top 3 candidates; "Apply" via
      Job Center otherwise. Priority: matching nationality + recent
      success in country + global rep.
    - **Squad**: 23 players (3 GKs + 20 outfield) for tournaments
      AND call-up windows.
    - **Eligibility** per D2 §10.4: birth + up to 2 heritage
      countries. Friendly caps don't lock; first competitive senior
      match permanently commits.
    - **Call-up windows**: Friendly (2 matches) + Qualifying (2
      matches); save & reuse "squad templates".
    - **Caps + international retirement**: 30+ players may retire
      from internationals; persuasion dialog for stars.
    - **Captaincy**: defaults from leadership + caps; vice = second.
    - **Calendar conflict**: international windows fixed FIFA-style;
      league matches auto-reschedule; same-day clash forces "which
      bench will you take?" with auto-managed for the other.
    - **Tournament management UX**: 23-man squad selection + 3-focus
      training camp (Tactical / Physical / Spirit) → group stage 3
      matches in 10 days with rotation pressure → single-elim
      knockouts with penalty shootout UX → post-tournament media
      debrief (3 dialogue choices) + board review.
  - **Make Your Career manager creator** (FM-style replayability):
    - **Background**: Sunday League (low start, underdog) / Semi-Pro
      / Ex-Pro Player (high start; Motivator+Tactician weighted) /
      Ex-DoF (Transfer Guru weighted). Affects starting rep +
      talent-tree seed.
    - **Coaching Badge**: National C / B / A / Pro. Studyable over
      time (costs money + time; yields attribute / talent unlock +
      rep boost).
    - **Tactical Specialisation** (primary + secondary): Attacking /
      Defensive / Possession / Pressing / Youth Focus / Set-Piece
      Specialist. Affects D3 tactical familiarity speed + club
      hiring bias.
    - **Nationality + 2 languages**: affects job offers (matching-
      language easier) + national team job priority + player
      communication bonuses.
  - **5-branch manager talent tree** (CK3-inspired, simplified for
    PWA):
    - 1 skill point per season + bonus on major trophies; unlocks
      from season 2.
    - Branches: **Tactician** (familiarity speed + in-match
      adaptation) / **Motivator** (morale + big-match + penalty
      shootouts) / **Youth Developer** (top-potential regen chance +
      U21 progression) / **Transfer Guru** (scouting info + wage
      demands + potential estimates) / **International Specialist**
      (national team cohesion + reduced club-vs-country tension).
    - Capstones: Tournament Whisperer (+5 % knockout match
      performance) / Academy Legend (club youth intake baseline
      raised).
  - **Region-based reputation**: per country + continent + global.
    Local dominance bleeds into continental + global slowly.
    Affects job offers + national team priority. Ties to I12 P1.
  - **Legendary detection** (per D4 §9.5) extended: legendary at 3+
    league titles OR 2+ continental trophies OR 5+ promotions.
    Unlocks special cosmetic titles ("The Architect" / "The
    General") + +1 extra talent point per season + drift cap ±0.25
    + future-saves Legacy bonus (rep + pre-unlocked skill).
  - **6 owner archetypes** (data-driven Owner Profiles):
    - **Sugar Daddy** (Rising Rival driver): mid-table large city;
      €150-300M cash injection + ×1.5-2.0 wage budget 5 seasons +
      ×2-3 transfer budget 3 seasons; aggressive bidding with
      10-20 % over-valuation. User club takeover triggers Align /
      Resist / Leave decision.
    - **Asset Stripper**: over-leveraged club; -30-50 % wage
      reduction + forced top-3-earner sale; user gets directives "We
      must sell X".
    - **Foundation-Community** (Hattrick + 50+1 culture): strict
      wage cap 55-60 % revenue; no long-term debt; very low
      takeover probability; youth + local focus.
    - **Petrol-State** (Final Boss of save): €300-500M injection +
      ×2.5 wages 8-10 seasons + near-max reputation; **FFP
      investigation** after 3-5 seasons of overspending (transfer
      ban / fines / point deductions possible).
    - **Murky Owner**: shady backgrounds; moderate investment with
      sudden withdrawal risk + FFP breaches + protests; possible
      money-laundering investigation → forced sale.
    - **Foreign Business**: marketing-driven; stable balanced
      investment; frequent stadium / naming-rights offers + friendly
      tours in owner's home market; "sign player from country X"
      board objectives.
    - **Frequency**: ~1 takeover / 5-7 seasons per league; max 2
      meaningful / season globally.
    - **Trigger model**: annual `instability_score` (financial
      stress + performance + ownership_age factors); if ≥ 3 →
      takeover candidate. Determinism via
      `worldAiMgmt:structural:year:<year>:takeover:<clubId>`
      sub-stream.
  - **Bankruptcy / Administration system**:
    - **Trigger**: 3 consecutive losing seasons + wage > 90-100 %
      revenue + cash < -0.5 × annual revenue + no investor.
    - **Effects on entry**: -10 to -15 points + transfer embargo +
      forced star sale + wage cap 40-50 % revenue + reputation -0.5
      stars + sponsor deals worsen.
    - **Pre-warning season**: board "We're on the brink; finish
      position X or admin".
    - **Heroic save path**: survival + net positive transfer window
      → "White Knight" investor event triggered + Hall of Fame
      "Saved the Club" credit + heavy underdog HoF bonus.
    - **Escape path**: leave before admin → "Abandoned sinking
      ship" tag (slight HoF penalty for that club).
    - If finances not stabilised within 2 seasons → optional
      enforced relegation / liquidation.
  - **Hall of Fame** (3-layer):
    - **Manager HoF per-save** (top 20): score = weighted trophies
      × competition strength × difficulty × underdog + longevity +
      loyalty - scandal penalties. Trophy values: domestic league
      100 / domestic cup 40 / Champions Cup 200 / IFC World Masters
      220 / IFC Nations Championship 220. Difficulty multipliers:
      Sim ×1.3 / Hard ×1.15 / Normal ×1.0 / Easy ×0.7. UI shows
      portrait + crests + timeline + signature titles.
    - **Manager HoF cross-save global** (top 10-20): stored in
      separate local-storage meta file; **read-only by sim**
      (deterministic-safe per D8). Filter by difficulty / era / club.
    - **Club HoF per-save**: trophy cabinet timeline + era detection
      algorithm (3-8 year above-average spans → "Golden Era" /
      "Resurgence Era") + XI-of-decade auto-calculated every 10
      seasons + record signings + milestones (first promotion / first
      continental qualification / invincible season).
    - **Player Legends per-save**: detection = 5+ seasons + ≥ 150
      apps + ≥ 2 of (role in trophy seasons / club record holder /
      iconic match rating ≥ 9.5 in final / derby). Tiers: **Icon**
      (statue / stand naming; shirt retirement if 10+ years + record
      goals) / **Legend** (profile flag + Legends tab) / **Favourite
      / Hero** (smaller flag).
  - **3-option Legacy mode** at career end (D4 §9.4 retirement Normal(67, 4) cap [60, 75]):
    - **A) Retire as Chairman / DoF**: low-touch meta role (budget +
      youth policy + style direction); game fast-forwards seasons.
    - **B) Start new manager at lower club in same universe**:
      former players may become rival managers; previous manager
      appears as retired legend.
    - **C) Hard retire + Career retrospective**: timeline screen
      with season-by-season achievements + map of clubs managed +
      graphs → save to global HoF → start new save with **Legacy
      bonuses** (§9.3).
    - **Manager statue** if Icon at club + (10+ years OR 5+ major
      trophies): "Stadium stand named after you" cosmetic + club
      history reference.
  - **3-tier cross-save Legacy perks** (deterministic-safe per D8):
    - Stored in global meta file (local storage), separate from save
      files.
    - **Read ONLY at world-gen as parameters; NEVER at runtime**.
    - Save snapshot includes all parameters used at gen → byte-
      identical world on replay/restore. Reload ignores any meta
      progression earned since snapshot.
    - **Tier 1** (after first 10+ season career): Tactician (+1
      tactic slot; D3 §6.6: 3 → 4) / Networker (better initial
      scouting) / Youth Whisperer (5 % chance of one special high-
      potential youth in season 1).
    - **Tier 2** (after ≥ 3 careers + HoF thresholds): Global
      Reputation (moderate starting rep) / Financial Savvy (higher
      initial board confidence).
    - **Tier 3** (after triple continental winner): Legendary Name
      (rare regen with user's surname + slight potential bias).
  - **50-year save longevity stack** (full 6 systems):
    - **Career phases UI**: timeline labels (Build-up Y1-3 / Ascent
      Y4-7 / Dynasty Defence Y8-15 / Legacy Y15+) on Manager Profile.
    - **Generational regens**: 5-10 years after a Club Legend
      retires, 5 % chance of regen with "Son of [Player X]" tag +
      position bias + +5 % max potential + special debut headlines.
    - **Year-X events**: 25-year anniversaries (commemorative match
      + special kit + attendance spike) / league reforms every 15-20
      seasons (size change / playoff intro; pre-announced 2-3
      seasons ahead) / stadium expansions every 8-12 years for big
      clubs / regional festivals bi-tri-annual.
    - **Cross-decade continental power shifts**: 10-year rolling
      Club World Masters + IFC Nations results → era labels
      ("European Dominance" / "South American Renaissance" /
      "Asia-Pacific Rise" / "African Awakening"). 8+ years
      dominance → rep + financial boost to that region's leagues +
      increased transfer outflow from weaker regions.
    - **Anstoss-style newspaper archive**: per-season summaries (3-7
      headlines per season) + tabs by year + filter "My club only" /
      "Major world events" + **decade retrospectives** auto-
      compressed for seasons > 10 years old ("The 2040s: Era of
      [Club X] and [Star Player Y]").
    - **Records book**: team records (most goals in a season /
      fewest conceded / win streak / unbeaten run / consecutive
      titles + promotions) + player records (most goals / apps /
      oldest/youngest scorer / fastest hat-trick) + club records.
      Auto-checked on every match; broken record triggers event +
      newspaper headline.
  - **Performance + storage**: ~115-155 KB gzipped late-game bundle
    lazy-loaded (within D9 per-route ≤ 200 KB budget); per-save
    IndexedDB ~400 KB late-game data; cross-save meta file < 100 KB.
  - **First PWA manager to ship this stack** — combines Anstoss-3
    Bundestrainer arc + FM-PC long-save depth + CK3-style cross-save
    Hall of Fame + Civ-style era system + Hattrick record books.
- **Onboarding Strategy** (locked 2026-05-17, gap D5) -
  [[../60-Research/onboarding-strategy]] +
  [[../50-Game-Design/onboarding-and-tutorial]] (new `approved` GDD):
  - **60-second FTUE** in 4 steps: experience question (Newbie / Bit
    / Veteran) silently mapping to UI tier + difficulty + recommended
    club tier + tutorial verbosity → mode picker upfront (Roguelite
    playable, Career visible as "comes later" per 2026-05-18 MVP scope) → club
    picker with recommended-club default + "Advanced setup" escape
    to full 5-screen New Save wizard → Home dashboard with first
    inbox tutorial card. Target < 60 s to first tactical choice;
    < 3 min to first match.
  - **12-message first-season inbox tutorial arc** over 4 in-game
    weeks teaching match week / tactics / goals / match report /
    training / rotation / transfers / contracts / board confidence /
    set pieces / youth / soft-transition. Week-4 closing message:
    "You've got the basics. From now on I'll only step in when
    something important comes up." Pacing 4-6 msg/week arc → 3-4/wk
    rest of season 1 → 2-3/wk season 2+.
  - **10-sender inbox cast**: 4 core (Assistant Manager ~50 % /
    Chairman 15 % / Director of Football 20 % / Head Scout 10 %) +
    6 supporting (Head of Youth / Player Agent / Journalist /
    Sponsors / Family Personal Life / Anonymous Tips). Per-sender
    voice cards live in `packages/game-data/src/inbox/voice-cards/`
    with tone keywords, address style, signature lines, 3 sample
    sentences each.
  - **Configurable named Assistant Manager** - default name "Alex"
    (gender-neutral, works in DE + EN; locale-default variants);
    3-5 portrait presets + "No portrait" accessibility option;
    name + portrait editable in Settings → Assistant. Voice
    consistent across inbox + coach marks + match commentary +
    "Ask Assistant" sticky FAB on Home / Match / Tactics / Training
    / Transfers screens.
  - **Per-difficulty assistant intensity auto-scaling** (with user
    override in Settings → Assistance):
    - **Easy**: proactive — "I recommend bringing on a fresh left-
      back. Tap here to do it now." Auto-surfaces suggestions in
      feed cards. "Do something for me" available with one-tap
      auto-complete.
    - **Normal**: suggestive — "Their winger is finding space on
      our left. A defensive sub there could help." No auto-complete.
    - **Hard**: sparse — "Left side overloaded. Consider adjustment."
      Coach marks minimal; rarely interrupts in-match.
    - **Sim**: silent — no in-match interventions. Post-match
      analysis only. "Ask Assistant" still pull-only.
  - **Feed-card daily action queue** as Home dashboard primary UI
    (Nico's choice over inbox-primary): 3-5 priority cards per
    in-game day. Card = title + urgency tag (colour + icon + text
    for accessibility) + 1-2 line summary + impact line + primary
    CTA + snooze/dismiss + overflow. Gmail-inspired swipe: right =
    complete/open; left = snooze with undo snackbar. Priority
    algorithm = timePressureScore (5-40) + impactTypeScore (5-30) +
    playerBehaviourAdjust (-10 to +10). Guardrails: always ≥ 1
    match card if match in 3 days; ≤ 2 admin cards in top 5;
    ≥ 1 "Easy win" card per day on Easy. Per-difficulty queue
    behaviour (Easy auto-handles low-impact / Hard shows more
    cards + fewer helpers / Sim strategic only).
  - **Tutorial overlay hierarchy** (used sparingly per modern mobile
    best practice):
    - **Spotlight overlay**: 3-4 max total over the whole game;
      absolutely critical FTUE moments only.
    - **Coach marks**: speech bubble with Assistant avatar + arrow.
      Max 2-3 per screen, sequential. First-visit only. "Got it" +
      "Tell me more" + "Skip tips for this screen" first-focusable.
    - **Hint chips**: subtle bottom-pill suggestions. Auto-hide
      after 2 dismissals.
    - **Modal full-screen**: 1-2 per major system (tactics basics,
      transfers basics). Re-accessible via Help / Ask Assistant.
  - **"While you were away" recap** triggered after ≥ 7 in-game
    days OR ≥ 14 real days absent. Auto-shown top feed-card with
    3-4 bullet summary. "Review key events" opens chronological
    timeline with deep-link buttons. "Resume where you left off"
    CTA using last-known navigation state. Very-long-absence
    (≥ 30 real days) adds soft re-onboarding hint chip ("Tactics
    quick-tour: 2 min").
  - **Veteran skip + safety net**: experience question "Veteran"
    option triggers modal confirmation; skipped users get
    micro-tooltips (max 2-3 per screen) instead of full overlays;
    inbox tutorial arc still runs with shorter copy + skip-ahead
    links; "Ask Assistant" always available. Settings → Assistance:
    "Tutorial & tips" toggle (Off / Essential / Full) + "Reset
    first-time tips" button. Auto-detection of struggle (5+ losses
    in a row on Easy; 10+ ignored feed-card CTAs) triggers optional
    Assistant inbox message "Tough run? Want more guidance?".
  - **Subtle achievement celebrations** (each with "Don't show this
    type again" overflow):
    - First match played: none (no celebration; just match report).
    - First match won: banner + tiny confetti (disabled with
      reduced-motion) + [View match report].
    - First transfer signed: player reveal card + crest + 3 key
      attributes + "Add to starting XI?" follow-up.
    - First cup victory / first promotion: dedicated screen +
      static trophy art (2-3 s auto-play; tap to continue) +
      season snapshot + forward-looking choice ("Board expectations
      for next season: Consolidate / Push for top half / Go for
      promotion").
    - First autosave: one-time Assistant inbox message explaining
      autosave.
  - **PWA install prompt** triggers (per D9 budget): `sessions ≥ 3`
    AND first success (first match win OR first transfer completed
    OR first season objective ticked) AND
    `total_playtime > 20 min` OR `current_session > 2 min`.
    Placement: bottom sheet after a positive-result screen, NOT
    session start. Chrome / Edge Android uses native
    `beforeinstallprompt`. iOS Safari uses custom 3-step
    Add-to-Home-Screen walkthrough with annotated screenshots.
    Snooze 7d / 5 sessions on explicit dismiss; 3 sessions on
    ignore; max 5 lifetime prompts.
  - **WCAG 2.2 AA + BITV 2.0 accessibility**:
    - No critical info exclusive to overlays — every tutorial step
      has DOM equivalent in Help → Tutorials.
    - Onboarding flow as linear semantic pages (`<h1>` per step,
      routes `/onboarding/experience`, `/onboarding/mode`,
      `/onboarding/club`), not modal-only.
    - Coach marks: focus moves into bubble on appear; trapped until
      dismissed; ESC closes; "Skip tutorial" Tab-reachable as first
      focusable element. Auto-dismiss timers disabled (WCAG 2.2
      timing-independent rule).
    - `prefers-reduced-motion` honoured via CSS media query + in-game
      "Limit animations" toggle.
    - Redundant encodings: urgency tags = colour + icon + text;
      tactic arrows = colour + line pattern + label; role/duty
      badges = colour + abbreviation + role-family icon.
    - WCAG 2.2 AA contrast 4.5:1 body / 3:1 large text + UI elements.
    - Inbox messages have "Read aloud" button (`SpeechSynthesisUtterance`
      / native TTS); user-controlled with play/pause/stop; highlights
      sentence being read; auto-pauses on app background.
    - One-handed mode: large bottom-aligned primary actions in
      thumb zone for halftime panic moments.
    - Voice-control-friendly labels (text + icon; no icon-only
      critical actions; disambiguated repeated labels).
    - Touch targets 44 × 44 px enforced per D9.
  - **Onboarding-state IndexedDB schema** under `onboarding_state`
    object store keyed by `save_id`. Fields: experience_level,
    initial_tier, initial_difficulty, initial_mode,
    ftue_completed_at, tutorial_arc_status (current message +
    completed list + arc_completed_at + soft_transition_shown),
    screen_tips_seen (per-screen flags), pwa_install
    (eligibility + prompt count + dismissed_until + installed),
    assistance (coaching_intensity + auto_handle + assistant name
    + portrait_id), recap_state (last session end +
    last_in_game_date_at_exit + recap_shown), celebrations_shown
    (per-milestone flags). Local-first per ADR-0005.
  - **Locale strategy**: EN source language + DE second locale at
    MVP. ~80-120 inbox templates × ~60 words = ~7-10k words per
    locale. Templates use placeholders ({playerName} / {clubName} /
    {position} / {opponentName} / {form} / {leaguePosition}).
    Subject ≤ 40 EN / ≤ 60 DE characters; body ≤ 80 EN / ≤ 100 DE
    words.
  - **Bundle**: onboarding-related JS ~110-150 KB gzipped
    lazy-loaded (within D9 per-route ≤ 200 KB budget). Inbox copy
    JSON ~50-80 KB per locale.
  - **Target retention**: D1 ≥ 30 % / D7 ≥ 12 % / D30 ≥ 5 % —
    between Top Eleven gold-standard (~35-40 % D1) and FM Mobile
    (~25-30 % D1). Reaches "best-in-class mobile manager" tier.
- **Tactics & Formations** (locked 2026-05-17, gap D3) -
  [[../60-Research/tactics-and-formations]] + [[../50-Game-Design/tactics-system]]
  (promoted from `draft` to `approved`):
  - **20 formations** total approaching FM PC depth on mobile. Core 8
    visible at all tiers (4-4-2 Flat / 4-3-3 / 4-2-3-1 / 3-5-2 /
    4-1-2-1-2 Diamond / 5-3-2 / 3-4-3 / 4-5-1) + advanced 12 hidden
    at Quick tier (4-1-4-1 / 4-2-2-2 / 4-3-2-1 Christmas Tree /
    3-4-1-2 / 3-4-2-1 / 4-2-3-1 Wide / 5-4-1 / 4-1-2-3 / 3-3-3-1 /
    5-2-3 / 4-4-2 Asymmetric / 4-3-3 DM Pivot).
  - **50 roles** across 8 position groups (GK 3 / CB 5 / FB-WB 6 /
    DM 5 / CM 7 / AMC 6 / Wide-W 7 / ST 8 + 3 cross-position).
    Tier exposure: Quick = no role UI; Standard = top 3 per
    position (~22 visible); Expert = all 50.
  - **Duties**: 3 globally (Defend / Support / Attack) constrained
    per role. Single-duty (Anchor, Poacher, Trequartista, etc.);
    dual; triple (CM / Winger / IF / AF / TM).
  - **Player instructions** per tier: 0 / 6 / 18. Standard 6 =
    high-impact (width / runs / press / passing risk / shoot /
    marking). Expert 18 in 4 groups (Positioning & movement 6 /
    Ball use 6 / Defensive 4 / Set-piece 2).
  - **Team instructions** per tier: 1 / 5 / 8. Quick = Mentality
    only. Standard adds Pressing / Defensive Line / Width / Tempo.
    Expert adds Build-up Style / Time-Wasting / Focus of Play.
  - **Mentality model**: 5 visible bands (VeryDef / Def / Balanced /
    Att / VeryAtt) + 7 internal steps (hidden Cautious + Positive
    half-steps for engine nuance).
  - **Phase logic** at MVP: Standard tier single global; Expert
    tier light per-phase overrides for OoP (Pressing + Defensive
    Line + press triggers), IP (Width + Build-up Style),
    Transition-to-Attack (Counter / Regroup / Balanced + tempo
    override), Transition-to-Defend (Counter-Press / Drop / Balanced).
  - **Tactical familiarity model** (full FM-style):
    - Single bar 0-100 per tactic slot.
    - Growth: TrainingGain (+4 / +2 / 0 for Primary / Secondary /
      unused) + MatchGain (+3 / match full usage) + ContinuityBonus
      (+0.2 to +2 based on new players in XI) + weekly cap 8.
    - Decay: 2/week non-use; floor 20 (never fully forgets).
    - SwitchModifier per match (1.0 last match → 0.6 if 11+ ago).
    - Penalty curve (piecewise): 0 → 0.4× shape multiplier; 50 →
      0.85×; 80 → 1.0× baseline; 100 → 1.04× mastery reward.
    - ContinuityMatchFactor (rotation penalty per match):
      0-1 new players in XI → 1.0; 8+ → 0.80.
    - New manager Similarity: new_familiarity = old × (0.5 + 0.5 ×
      Similarity); partial carryover based on formation +
      mentality + pressing alignment (0.4 ≤ Sim ≤ 1.0).
    - Pace: 30 → 90 in ~8 weeks with focus + same XI; ~12 weeks
      with half focus + some rotation.
  - **Tactic slots + saved presets** per tier: 2 / 3 / 3 slots
    (with familiarity, designated Primary / Secondary /
    Experimental) + 0 / 10 / 50 saved presets (no familiarity).
  - **Quick tier 5 starter presets** locked: Solid 4-4-2 /
    Counter-Attack 4-3-3 / High-Pressing 4-2-3-1 / Park the Bus
    5-3-2 / Balanced 4-3-3.
  - **3-layer opposition template system**:
    - **Layer 1** (8 archetypes): vs Deep Block / vs High Press /
      vs Wide Overloads / vs Target Man / vs Playmaker 10 / vs
      Counter-Attacking / vs 3-5-2 / vs 4-2-3-1. Templates are
      deltas on base tactic.
    - **Layer 2** (~25-30 sub-archetype variants, 3-4 per main):
      e.g. `vs_high_press/direct_bypass`, `/playmaker_dribble`,
      `/wing_bypass`, `/draw_and_release`.
    - **Layer 3** (manager-signature templates): each of the 10 D4
      AI archetypes has 1-3 signature templates they favour. Gives
      AI managers distinct tactical character; user can scout
      manager archetype to predict counters.
    - **Emergent club character**: clubs accumulate counter-template
      history (last 50 matches); surfaced in opposition analysis as
      "tactical fingerprint". No competitor surfaces this.
  - **3 universal touchline shouts** at all tiers (no tier gating):
    Encourage / Demand More / All-Out Attack. 10-min cooldown
    (20 min for All-Out Attack). Max 8 per match. Effects as
    multipliers on mentality / pressing / tempo / discipline /
    energy. Deferred shouts (Focus-Regroup, Time-Waste, Tackle
    Harder) added post-MVP via same mechanic.
  - **Tactical predictability penalty** (ties to D4 arms race):
    `Predictability = UsageScore - 0.5`; `LeagueAdaptationFactor =
    1 - clamp(Predictability × 0.1, 0, 0.05)`. Up to 5 % offensive-
    effectiveness reduction for 100 % single-tactic usage.
    Counter-templates cancel half. Encourages variety without
    forcing it.
  - **Tactic preset sharing** per ADR-0016: URL-encoded share
    codes `TACTIC-<crc32>-<base64-LZ-compressed-JSON>`. Local-only
    at MVP; no server backend. Expert tier UI: import / export
    with formation / style / use-case / vs-archetype tag filters.
  - **Touch-first UI patterns**: tap-to-place formation editing
    primary (long-press drag only in Expert); bottom-sheet role
    pickers preserve pitch context; segmented controls for team
    tactics (5-band mentality + 3/4-step pressing/line/width/tempo);
    accordion player instructions with override visual state +
    inline reset; halftime 3-tile modal (subs + mentality + 1
    tactical tweak) + "Open Full Editor"; 44 × 44 px touch targets
    enforced (positions get 36 px visual + invisible 48 px hit);
    WCAG 2.2 AA / BITV 2.0 (screen-reader labels per position;
    arrow-key roving tabindex; colour-independent D/S/A badges).
  - **Attribute schema reconciled with D2** (mechanical fix): 16
    visible + 4 GK + 8 hidden on 1-20 scale. Replaces previous
    incorrect "10 + 8 + 10 + 5 = 33 on 1-10 scale" claim from the
    original draft GDD. Per-tier player-strength display now follows
    **Impact Lens**: Quick = qualitative Impact bands + availability
    warnings; Standard = Role Impact + category bars + status icons;
    Expert = full 1-20 visible attributes + Impact formula breakdown +
    scout-uncertainty bands for 8 hidden. No global OVR.
- **Player Strength Presentation / Impact Lens** (locked 2026-05-17) -
  [[../60-Research/player-strength-presentation]]:
  - No global player Overall / OVR / universal star rating in squad,
    tactics, scouting or transfer lists.
  - Role Impact is a deterministic integer read projection for a player in a
    specific role, duty, tactic and availability context.
  - Category scores summarise Technical / Mental / Physical / GK from the
    locked D2 1-20 attribute schema; status signals stay visible separately.
  - Poorly scouted players show labels, ranges and trust levels rather than
    false precision.
  - `ImpactLensProjection` is a Squad & Player read model exposed via
    `queryGateway`, cacheable in Dexie, refreshed by Live Queries, never
    workflow authority and never a cross-context JOIN.
- **AI Manager Behaviour** (locked 2026-05-17, gap D4) -
  [[../60-Research/ai-manager-behaviour]]:
  - **Three-layer architecture**: utility AI core + light FSM
    situation classifier (TitleRace / EuropePush / MidtableSafe /
    RelegationBattle / Rebuild / FinancialCrisis) + heuristic
    constraints (hard caps preventing pathological behaviour).
    Industry consensus for 2026 sports/management games. Rejects
    behaviour trees (wrong abstraction), GOAP/HTN (too heavy), ML
    (bundle bloat + tuning friction).
  - **Personality system**: **8 primary continuous traits** [0, 1]
    (`tacticalAttacking`, `pressingPreference`, `youthTrust`,
    `starPreference`, `transferAggressiveness`, `bargainSeeking`,
    `riskTaking`, `tinkering`) + **3 derived** (`loyalty`,
    `fitnessFocus`, `wageDiscipline`). Personality modulates utility
    weights by max ±30 %; never overrides decision structure.
    Drifts ±0.2 over career based on success/failure.
  - **10 manager archetypes** at MVP: Park-the-Bus Pragmatist,
    Counter-Attacking Reactive, High-Pressing Aggressor, Possession
    Maestro, Youth Developer, Galáctico Collector, Moneyball
    Director, Tinkerman, Conservative Stabilizer, Chaos Motivator.
    Each is a preset trait vector + preferred formations.
  - **4 difficulty modes** (Easy / Normal / Hard / Sim) — FM-style
    "constraints + AI optimisation" approach, NOT Civ-style "AI gets
    free resources". No AI stat cheats on Normal / Hard / Sim. Easy
    gives minor user help only (+1 attrs, generous finances, 80 %
    AI competence) for onboarding.
  - **Per-difficulty knob table** (~20 knobs): AI tactical quality
    weight, in-match adaptation frequency, transfer success rate,
    scouting depth, board patience, FFP enforcement, star ambition
    pressure, injury frequency, tactical familiarity build rate.
  - **Out-of-match weekly tick** per club (~5-6 ms budget): squad
    gap analysis → transfer targeting (top 60 candidates per role,
    max 3 priority roles) → bidding with multi-club escalation +
    walk-away rules → contract renewals (monthly) → squad rotation
    + training focus → board confidence update → seasonal facilities.
  - **In-match decision pipeline**: trigger-based at HT, 60', 75',
    85', 90' + event triggers (goal, red card, injury, opponent
    sub). 15-25 decision passes per match, < 1 ms each. Decision
    order: mentality → formation change → substitutions →
    instructions → set-piece takers. Total cost ~20-25 ms / match
    (within 30-50 ms budget).
  - **World drift / dynasty anti-staleness**: moderate explicit
    mechanics — wage inflation tied to success (3 top-4 finishes =
    +10-20 % renewal demands); progressive FFP penalties (warning
    → transfer ban → point deductions on Sim); talent diffusion
    (40 % elite regens spawn at non-elite clubs); tactical arms
    race (opposition memory + counter-template application scaling
    by difficulty); board expectation escalation +1 tier per
    overperformance season.
  - **Structural events** every 5-10 in-game years:
    - **Rising Rival** (~5y cycle): mid-table club gets New Investor
      + funds boost + high-rep manager hire. Anti-staleness driver.
    - **Giant Collapse** (~10y cycle): top club enters financial
      crisis, fire-sale stars at -20 %, transfer ban for 1 window.
  - **AI manager career arcs** at MVP:
    - Job churn 10-20 % of managers per season (via board
      confidence < 30 threshold + recent-form check).
    - Retirement via `Normal(67, 4)` clamped [60, 75].
    - Legendary detection (3+ league titles OR 2+ continentals
      OR 5+ promotions) → boosted job security + relaxed personality
      drift caps + Hall of Fame surfaces.
    - **Rival tracking**: per user club, the AI manager with highest
      head-to-head PPG + most title-race meetings becomes the user's
      "primary rival". Persists across club changes (rival follows
      user's manager career, not just their current club).
  - **Late-game content** phased:
    - **MVP**: 12 dynasty achievements (5-in-a-row league titles,
      domestic treble, continental double, invincibles season,
      100-point season, 100+ goals, top-scorer 3 consecutive,
      ladder climb through all 5 divisions, win-with-each-archetype,
      generational squad, 1000 career wins, 50-year save longevity)
      + tactical arms race + board expectation escalation.
    - **Post-MVP**: national team dual-role (unlock at manager rep
      ≥ 75); Manager Hall of Fame; legacy mode (retire-as-manager /
      continue-as-chairman); roguelite-mode integration with
      Create-A-Club.
  - **Determinism**: uses pre-allocated `WorldAiMgmtRng` (stream #2)
    + `MatchAiRng` (stream #4) from D8 with hierarchical sub-labels
    (`worldAiMgmt:club:<id>:weekly:<week>`, etc.). New AI sub-systems
    add labels under existing streams — no schema changes; future-
    proof per D8 §2.3.
  - **Performance** (per D9): out-of-match 700 clubs in ~3.5-4.2 s
    (within 5 s budget); in-match ~25 ms / match (within 30-50 ms
    budget). Lazy expansion of Tier C AI managers (compact 16-byte
    profile, expand on first user interaction).
  - **Package**: `packages/ai-manager/` is framework-agnostic
    (no React, no DOM, no fetch). Same code path runs client-side
    (singleplayer) AND server-side post-MVP (async MP per ADR-0011).
    Bundle target ~60-80 KB gzipped.
- **ADR-0007 Naming Schema + Data Generators** (accepted 2026-05-17, gap D2) -
  [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]] +
  [[../60-Research/data-generators]]:
  - **Procedural worldgen from a single seed**; IP-clean by
    construction. No real club / player / coach / referee / stadium
    / sponsor names ever.
  - **Name generation**: hybrid wordlist + phonotactic fallback.
    Tier-1 locale buckets at MVP (DACH / British Isles / FR / ES /
    IT / Low Countries / Lusophone — 7 buckets). Tier-2 (post-MVP):
    Nordic / Eastern Europe / Hispanic LATAM / Turkey / Asia (JP/KR/
    CN) / Arabic / Africa (3 buckets).
  - **Corpus sources**: Wikidata CC0 primary; UK ONS / US SSA / INSEE
    / ISTAT / CBS / Statbel / Destatis / IBGE national open-data;
    GeoNames CC-BY 4.0 for regions + Bloom filter. Forbidden: Behind
    the Name, Wikipedia raw text (CC-BY-SA), Common Crawl,
    unlicensed GitHub corpora. Living-person filter on Wikidata pull.
  - **Locale composition rules** at MVP must-have: Spanish two-
    surname, Portuguese particles, Dutch tussenvoegsel, German `von`
    with low probability. Deferred to Tier 2: Polish gendered,
    Japanese family-name-first, Korean two-syllable, Arabic
    patronymics.
  - **City / location**: real region (GeoNames CC-BY 4.0, attribution
    in credits) + fictional city via phonotactic recombination of
    region-typical syllables; Bloom-filter rejection of real GeoNames
    cities. Allows `Borussia Schwarzwald` (real region, fictional
    club + city) without `FC Dortmund`-style real-pair collisions.
  - **Crest generation**: grammar-based hybrid. 7 shields × 8
    divisions × 10 region-biased palettes × 40-50 charges × 4
    borders × 3 banners → ~5 M unique crests. Pure TS → SVG
    (no WebGL, no raster, no 3D per D9). At world creation: only
    `CrestDesign` struct (~6 bytes packed) stored per club. SVG
    rendered on first display (~1-3 ms); cached as data URI in
    IndexedDB. Crest module bundle ~30-40 KB gzipped.
  - **Crest icon library**: ~40 charge icons inlined as TS path
    strings, restyled from Game-Icons.net (CC-BY 3.0, attribution)
    + Heroicons (MIT) + Tabler (MIT). No national emblems, military
    insignia, religious iconography. No CC-BY-SA Wikimedia sources.
    Region-biased shape and palette priors per locale (DE → more
    heater + yellow-black; IT → more roundel + blue-white).
  - **Club tier model**: 5 tiers per country. Country × Tier finance
    matrix locked for 10 countries (DE, EN, ES, IT, FR, PT, NL, BR,
    AR, JP). Log-normal money + attendance distributions; prestige
    0-100 via tier_base + country_offset + history_bonus + recent_
    success + facilities + fanbase + noise. Stadium model: bimodal
    age distribution (modern / hybrid / old); tier-weighted naming
    patterns (traditional / arena / sponsor).
  - **Player attribute schema**: **16 visible** (7 Technical + 5
    Mental + 4 Physical) + **4 GK-only extras** (reflexes, handling,
    aerial reach, distribution) + **8 hidden meta** (potential,
    consistency, pressure, professionalism, determination,
    adaptability, injury proneness, big matches) on 1-20 integer
    scale. Maps to match-engine basis-points contest math via
    `attr × 500 = success_bp`. FM Mobile-style simplification; fits
    Quick / Standard / Expert progressive-disclosure tiers.
  - **Player generation algorithm**: hybrid archetype-first + CA
    budget allocator. ~50 archetypes (sweeper keeper, ball-playing
    CB, inverted FB, deep-lying playmaker, box-to-box CM, inside
    forward, poacher, target man, ...). Pipeline: pick `(nation,
    club_tier, age_band, position, archetype)` → sample PA from
    skewed nation × club-quality distribution → sample CA from age
    + environment → Dirichlet allocation of CA across attributes per
    archetype weights → hidden meta + physicals + name + nationality
    + assemble.
  - **Lazy expansion** (the big perf trick): only Tier A + B players
    (top 2 leagues per active nation, ~10-15 % of total) get full
    attribute generation at world creation. Tier C players (~85-90 %)
    store a 12-byte compact profile; full attrs generated on demand
    when scouted / drafted / faced in a match. Cuts Large-world
    storage from ~3 M attribute values to ~78 KB compact + ~7.5k
    expanded.
  - **Performance** (per D9): Small world ≤ 2 s; Medium ≤ 5 s;
    Large ≤ 8 s on Snapdragon 695, all in a dedicated Web Worker
    with batched yields. IndexedDB delta ≤ 25 MB for Large world.
  - **Determinism**: adds RNG stream **#9 `GeneratorRng`** to D8
    (label-derived; future-proof per D8 §2.3 — does not break any
    existing replay). Hierarchical sub-labels per subsystem (country
    / league / club / crest / stadium / staff / player / name /
    nationality). Same `worldSeed` → byte-identical world.
  - **CI enforcement**: lint blocks `Math.random` in
    `packages/game-data/src/`; build emits `CORPUS-PROVENANCE.md`;
    test rule rejects any real-club / player / coach name match in
    shipped corpora; golden tests on 10 canonical seeds for
    byte-identical output.
- **Performance budgets** (locked 2026-05-17, gap D9) -
  [[../60-Research/performance-budgets]]:
  - **Device matrix** - four tiers:
    - **Premium**: Snapdragon 8 Gen 2+ / A15+, 6+ GB RAM, Android 14+/iOS 17+, Chromium 120+. Full features; 60 fps canvas match.
    - **Standard** (optimisation target): Snapdragon 695 / 4 Gen 2 / 6 Gen 1 / Helio G99 / Exynos 1330 / A13/A14, 4-6 GB RAM, Android 12+/iOS 16+, Chromium 100+. Full features tuned; 30-60 fps canvas match.
    - **Floor**: 3 GB RAM, A12, Android 10+/iOS 15+, Chromium 90+. Reduced features + one-time warning banner; **Text & Stats match mode forced**; Small world only; ≤ 1 heavy Worker.
    - **Off-target**: < 3 GB / Android < 10 / iOS < 15 / Chromium < 90. HTML fallback page, ≤ 20 KB compressed.
  - **CWV product targets (p75 mobile)**: LCP ≤ 2.0 s, INP ≤ 120 ms on primary flows, CLS ≤ 0.05. Tighter than the standard "Good" cutoffs.
  - **Lighthouse**: mobile lab ≥ 90 (block deploy < 85), desktop ≥ 95 (block < 90). Replaces the placeholder in arc42 §Crosscutting.
  - **JS bundle budgets** (post-gzip transfer): initial critical ≤ 200 KB (hard cap 250); total session ≤ 700 KB (hard cap 1 MB); per-route lazy heavy ≤ 100 KB; per-route lazy small ≤ 50 KB; third-party ≤ 50 KB; match engine package 80-100 KB; service worker ≤ 80 KB.
  - **DOM + render**: all tables virtualised via TanStack Virtual (≤ 40-60 rows on mobile, fixed-height); DOM nodes per route ≤ 1500 (hard cap 3000); no heavy CSS (`backdrop-filter`, animated `filter`); honour `prefers-reduced-motion`.
  - **Frame budget** (p95 main-thread): ≤ 12 ms; no single task > 25 ms; no matchday task > 50 ms.
  - **Memory** (heap, steady-state): Premium ≤ 200 + ≤ 100 MB; Standard ≤ 150 + ≤ 80 MB; Floor ≤ 100 + ≤ 50 MB.
  - **World-size presets** chosen at New Save (immutable per save for determinism):
    - Small (1 nation, 2 leagues, ~5 MB) - Floor default + forced.
    - Medium (3 nations, 6 leagues, ~15 MB) - Standard default.
    - Large (8 nations, 20 leagues, ~50 MB) - Premium default; Standard opt-in with warning.
  - **Match render policy** - **no interactive or authoritative browser 3D match view** (permanent product decision; scoped by [[../10-Architecture/09-Decisions/ADR-0029-3d-presentation-layer]] on 2026-05-20 and tightened by [[../10-Architecture/09-Decisions/ADR-0041-presentation-renderer-strategy]] on 2026-05-22). Two modes only:
    - **Text & Stats** (first-class, not a fallback): DOM list at 1-2 Hz, stats sidebar; default on Floor; user-selectable everywhere.
    - **2D canvas** (primary, mandatory): HTML Canvas 2D (NOT WebGL); 30 fps cap on Standard, 60 fps on Premium; 720p internal resolution, DPR clamp at 2.0.
  - **3D Presentation Layer** (post-MVP, Phase 2, accepted 2026-05-20 via [[../10-Architecture/09-Decisions/ADR-0029-3d-presentation-layer]], tightened 2026-05-22 by [[../10-Architecture/09-Decisions/ADR-0041-presentation-renderer-strategy]]) - Three.js + React Three Fiber for isometric stadium / campus view, kuratierte Event-Cutscenes (walkout, trophy lift, goal celebration) and static highlight backdrops. Gated by `SceneDescriptor` contract, mandatory 2D fallback on Floor / `prefers-reduced-motion` / Save-Data / iOS context-loss trip. Lives parallel to (not inside) the match renderer; match render itself follows [[../10-Architecture/09-Decisions/ADR-0024-match-renderer-abstraction]] (Canvas 2D first; PixiJS no longer planned) behind [[../10-Architecture/09-Decisions/ADR-0026-match-frame-contract]].
  - **Battery-saver / reduced-motion / data-saver** auto-honoured via `prefers-reduced-motion`, `navigator.connection.saveData`, `prefers-reduced-data`.
  - **CI perf gate** (Phase 1, MVP, mandatory): Lighthouse CI + Playwright + injected `web-vitals` library on every PR; bundle-size CI per the budgets; match-engine perf gate per D1; storage assertion per A2.
  - **Phase 2** (post-MVP): add LambdaTest 1-slot weekly real-device job (~€1.5 k/yr) on Galaxy A54 / Pixel 7a / iPhone SE 3-class hardware.
  - **Phase 3** (optional, only if Phase 2 insufficient): build 5-device hardware rig (~€2.4 k one-off + €800/yr amortised).
  - **ADR-0003 Match Engine** (accepted 2026-05-16, gap A3) -
  [[../10-Architecture/09-Decisions/ADR-0003-match-engine]]:
  - Historical TypeScript-first target only. FMX-10 reopens this decision and
    proposes [[../10-Architecture/09-Decisions/ADR-0049-swappable-spatial-event-match-engine]]
    as the replacement target.
  - Current proposed rule: consumers depend on a versioned `MatchEnginePort`,
    not on a concrete `packages/match-engine` runtime. The first implementation
    may be TypeScript only as spike/reference adapter; Rust-native is the
    default production candidate if the TS-vs-Rust spike shows no clear
    disadvantage.
  - Match output is committed event log + spatial samples + summary. Canvas 2D,
    live ticker, reports and replay are projections of those facts.
  - **Performance**: old ≤ 50 ms Web Worker budget is historical. ADR-0049
    requires the runtime spike to set p95 budgets for each quality profile and
    prove golden replay, statistical and adapter parity.
  - **Engine version**: every canonical match record carries engine id, contract
    version, RNG version and input hash; old-engine replay fallback is required
    before replacing an engine.
  - **Quality profiles**: `competitive-full`,
    `interactive-standard`, `background-detailed`, `background-fast`.
    The selected profile is part of `MatchInputs` and replay inputs.
- **Match Engine Simulation Model** (locked 2026-05-16, gap D1) -
  [[../60-Research/match-engine-simulation-model]]:
  - **Simulation model**: hybrid Markov + attribute rolls. Macro
    Markov chain over `{teamInPossession, zoneId, phase,
    pressureLevel}` picks event type + target zone; micro
    attribute-vs-attribute integer contests resolve outcomes.
  - **Tick model**: per-event with integer-second `simClock`
    jumps; event durations sampled per type (passes 3-10 s, set
    pieces 20-40 s, subs 60-90 s); clamped at period boundaries.
  - **Event schema**: required core (sim_clock_s, duration_s,
    period, event_type, outcome, team_id, player_ids, start/end_pos
    in integer mm, start/end_zone_id) + typed optional payloads
    (Pass/Shot/Duel/Foul/Card/SetPiece/Sub/TacticalChange/Injury/Misc)
    + optional delta-encoded `tactical_context`.
  - **Formation interaction**: hybrid zone + role influence; per-
    player zone weights from formation + role + duty + instructions
    + traits; aggregated to per-zone team scores
    (attacking/defending/pressing/support); per-zone deltas
    modulate Markov transitions + attribute thresholds.
  - **RNG separation**: `MatchCoreRng` (physics + duration sampling
    + injuries) vs `MatchAiRng` (in-match AI tactical decisions).
    Allows AI refactor without breaking physical replays.
  - **Performance budget**: historical Web Worker target; FMX-10 moves the
    authoritative match-engine budget to the runtime spike in ADR-0049.
  - **Worker bridge**: historical client adapter source. Future client preview,
    replay or offline adapters must still sit behind `MatchEnginePort`.
  - **Test pyramid**: full - unit + integration + 10 canonical
    golden replays + statistical envelope tests (1k-5k nightly
    matches) + property-based (fast-check + pure-rand) + CI perf
    gate.
- **ADR-0002 Offline-first** (superseded 2026-05-18 by ADR-0020):
  - Historical full offline-first MVP decision. Do not implement for MVP.
  - Current MVP posture is [[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]:
    app shell, safe cached reads and local drafts; server-confirmed
    authoritative progression; full selective offline later.
- **ADR-0005 Save Format** (accepted 2026-05-16, gap A5) -
  [[../10-Architecture/09-Decisions/ADR-0005-save-format]]:
  - **Two export modes**: 'Device backup' (account-secret +
    device-salt KDF; auto-restores when signed into same account)
    and 'Portable export' (user passphrase + per-export 32-byte
    salt; account-independent, shareable, "forgot = lost" UX).
  - **Encryption**: AES-GCM 256 via Web Crypto. AEAD tag binds the
    envelope header (schemaVersion, saveVersion, engineVersion,
    saveMode, …) to the ciphertext so headers can't be tampered.
  - **KDF**: PBKDF2-SHA256, **600 000 iterations** (OWASP 2026
    minimum). Argon2 / scrypt deferred to Phase 2 if needed.
  - **Compression**: `CompressionStream('gzip')` — native cross-
    browser, zero bundle cost, Web-Worker. ~70-80 % size reduction.
    Pipeline: `JSON → gzip → AES-GCM-encrypt`.
  - **Versioning**: three independent fields — `envelopeVersion`
    (envelope itself), `saveVersion` (payload shape),
    `engineVersion` (per D8 deterministic replay). Phased rename
    migrations. Old-engine dynamic-import for legacy save replay.
  - **Payload**: full per-save context snapshots + RNG state for
    all 8 named streams (per D8). Outbox + audit explicitly NOT
    in saves (live in platform DB).
  - **Save lifecycle**: `active → archived → deleted` (with 30-day
    grace period before per-save DB drop). Soft 10 / hard 50
    quota per user (per A4).
- **Data model** (accepted 2026-05-19, supersedes ADR-0004) -
  [[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]] +
  [[../30-Implementation/postgres-drizzle-integration]]:
  - **Storage topology**: PostgreSQL **schema-per-save** — platform data
    in `public`; each save in its own `save_<uuidv7hex>` schema; delete =
    `DROP SCHEMA ... CASCADE` after the 30-day grace window.
  - **Schema strategy**: SCHEMAFULL governance = typed Drizzle columns +
    `CHECK` constraints; SCHEMALESS = `jsonb` + per-event Zod at producer
    and consumer.
  - **Generator**: Drizzle `pgTable` is the single source of truth.
    `drizzle-kit generate` emits forward-only SQL; `drizzle-zod` derives
    runtime validators; a small `tsx` codegen writes a standalone Zod
    mirror into `packages/db-schema/src/generated/**`. CI gate
    `pnpm db:generate && git diff --exit-code` blocks drift.
  - **Migrations**: A2 lazy on save-open — per-save `schema_version` in
    `save_registry`; `QueryGateway.withSave` applies pending migrations
    before serving. Deploy stays O(1).
  - **Numeric model**: integers / basis-points throughout simulation
    logic (per D8) — `bigint(mode:'number')` for cents, `integer` + CHECK
    for basis points, `smallint` + CHECK for attributes, `integer` mm for
    coordinates.
  - **IDs**: **app-generated UUIDv7** everywhere (not
    `gen_random_uuid()`, which is v4); cross-context refs are opaque
    `uuid` columns with branded TypeScript types — **no Drizzle
    `references()` across context boundaries** (intra-context FKs are
    fine).
  - **Relationship modelling**: junction tables with surrogate UUIDv7 PK
    + `joined_at/role/left_at` for RELATE-style edges; `jsonb` for small
    immutable embedded data (stadium, traits).
  - **Isolation enforcement**: mechanical — `QueryGateway.withSave`
    sets `LOCAL search_path = save_<hex>, public`; a wrong scope yields
    *relation-not-found*, never a silent cross-tenant read.
  - **Save quotas**: soft UX 10 active + server-side hard cap 50
    (active + archived) per user; no tiering at MVP (preserved from
    ADR-0004).
  - **Save export envelope**: client-side AES-GCM 256 + PBKDF2 KDF
    (ADR-0005, substrate-agnostic, unchanged).
  - **Forward additivity**: `gender_eligibility` set on player +
    `gender_restriction` text+CHECK on competition (preserved from
    ADR-0004 §9).
- **Determinism / RNG / Replay** (locked 2026-05-16, gap D8) -
  [[../60-Research/determinism-and-replay]]:
  - **PRNG**: PCG32 via `pure-rand` (32-bit JS, no BigInt). RNG state
    serialised as 4 × Uint32 inside encrypted saves.
  - **RNG streams**: 8 named streams (World / WorldAiMgmt / MatchCore
    per match / MatchAi per match / Weather / Injury / Transfer /
    News). Seeded from masterSeed via xxhash32(label, parentSeed).
    Adding new streams later is safe.
  - **Replay format**: `(seed, lineups, tactics, engineVersion)` is the
    canonical truth for every match. **Human-involving matches**
    additionally store the **full event log** (every pass / duel /
    shot, ~5-20 KB / match) for fast UI + audit. **AI vs AI** stays
    seed-only with on-demand re-sim per ADR-0011.
  - **Numeric representation**: integers / basis-points (money in
    cents, probabilities 0-10000, attributes 0-100, coordinates
    integer-mm). Floats only inside engine internals.
  - **12 save-determinism rules** (lint-enforced where possible): no
    `Math.random`, no `Date.now`, no transcendental math in decisions,
    sorted-key iteration, stable sort with tie-breakers, Worker-
    message-driven sim, complete-state saves, integer-comparison
    branching, versioned engine, deterministic input ordering, no
    object-identity branching, cross-browser CI gate.
  - **CI gate**: Chromium-only at MVP; WebKit + Firefox added in
    Phase-2 hardening.
- **ADR-0028 Postgres Transactional Outbox** (accepted 2026-05-19,
  supersedes ADR-0013).
  - **Storage**: outbox rows are written in the same PostgreSQL
    transaction as state changes.
  - **Publisher**: hybrid polling floor + `LISTEN/NOTIFY`; polling is
    the correctness floor, NOTIFY is a latency hint.
  - **Retention**: native declarative range partitioning by month for
    the cold archive.
  - **Fan-out**: publish through ADR-0023 realtime transport (SSE now,
    Centrifugo planned), never direct DB coupling.
  - **Historical note**: ADR-0013's SurrealDB + Redis Streams substrate
    is superseded; only the transactional-outbox intent carries forward.
- **ADR-0017 Observability and Logging** (accepted 2026-05-17, gap
  D11/C6/E3). Self-hosted operational monitoring is the default:
  OpenTelemetry JS instrumentation; Grafana Loki, Prometheus, Tempo,
  Alloy and Grafana for logs/metrics/traces/dashboards; GlitchTip via
  Sentry-compatible SDKs for crash/error reporting. Client diagnostics
  are privacy-minimised, redacted before local queueing/sending and
  capped when stored offline. Product analytics are deferred to H7/G3
  and must not be mixed into operational logs.
- **ADR-0018 Systemic Events and Player Lifecycle Architecture**
  (accepted 2026-05-17). Player development, mentoring, injuries,
  systemic events, narrative rendering and venue operations are
  **domain-owned policies coordinated by deterministic event
  orchestration**, not one random-event context. The existing 11
  bounded contexts remain authoritative: Training computes load and
  development signals; Squad & Player owns player/injury state; Match
  emits match injury facts; Club Management owns stadium, venue,
  sponsors and fans; Notification renders deterministic narrative
  projections. Runtime AI text is a separate research track and is not
  approved for runtime simulation or narrative output.

## Closed Documentation Gap State (2026-05-22)

Former promotion items are classified by
[[Documentation-V1]]:

- ADR-0012 / 0014 / 0015 / 0016 are future-scope or optional cleanup until an
  owner decision promotes them.
- ADR-0001..0009 are either accepted, superseded or future-scope depth cleanup;
  do not treat old Wave 3 depth-pass labels as active work.
- arc42, feature, game-design and player-doc notes are covered at the current
  temporal layer. Future player-facing docs are output documentation after
  playable mechanics exist, not an architecture gap.
- Per-system "Future-scope notes" text in historical/draft notes is a tuning
  parking lot unless re-opened by the baseline, this page or a current issue.
