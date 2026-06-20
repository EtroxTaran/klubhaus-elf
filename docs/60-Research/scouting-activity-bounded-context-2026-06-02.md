---
title: Scouting Activity bounded-context ownership (FMX-27)
status: draft
tags: [research, scouting, transfer, squad-club, ddd, bounded-context, fmx-27]
context: scouting
created: 2026-06-02
updated: 2026-06-02
type: research
binding: false
linear: FMX-27
sourceType: external
related:
  - [[raw-perplexity/raw-scouting-activity-bounded-context-2026-06-02]]
  - [[../10-Architecture/09-Decisions/ADR-0064-scouting-activity-context]]
  - [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../10-Architecture/09-Decisions/ADR-0060-youth-academy-context]]
  - [[../10-Architecture/bounded-context-map]]
  - [[../50-Game-Design/scouting-and-recruitment]]
  - [[../50-Game-Design/GD-0006-transfers]]
  - [[transfer-market-simulation]]
  - [[../10-Architecture/transfer-market-architecture]]
  - [[../30-Implementation/domain-research-workflow]]
---

# Scouting Activity bounded-context ownership (FMX-27)

## Question

Who owns **scout *activity*** — scout assignments (region/league/player
routing + expiry), the scout-report lifecycle (file → age → refresh → stale),
network coverage tiers, long-list / short-list persistence, and hidden-flag
surfacing — given that ADR-0052 (draft) already places the Chief Scout / Data
Analyst *as a Person* in the People context? Three candidate landings:
**(A)** sub-aggregate in Transfer, **(B)** sub-aggregate in Squad & Player,
**(C)** its own *Scouting* bounded context.

## Summary

Decision-ready recommendation: **Option C — Scouting as its own (20th)
bounded context.** People (ADR-0052) supplies scout *identity* by query;
Scouting owns scout *activity*; Transfer, Squad & Player and Notification are
downstream consumers of published scout read models / events. Across all three
research dimensions (genre, DDD, real-world) the intelligence/gathering side
separates cleanly from the transaction/decision side, and Option C is the only
landing that does **not** violate the binding Impact-Lens boundary rule
(`bounded-context-map.md` §3.1 — a Squad-owned read model "MUST NOT query
another context's internal tables").

Nico ratified the four shaping decisions on 2026-06-02 (see Inputs):
ownership = **C**; opposition/match-prep scouting = **recruitment-only + a
reserved published hook**; youth boundary = **Scouting discovers → Youth
Academy intakes**; hidden flags = **Scouting gates the confidence-based reveal,
the source contexts (People / Squad & Player) keep the truth**.

## Findings

### F1 — Scout activity is genuinely unowned today (vault)

- **Finding:** Transfer only *consumes* scout output. `transfer-market-
  architecture.md` ownership table lists offer/negotiation lifecycle, valuation
  bands, clause packages, window/registration, inbox projection — **no scout
  assignment, network, coverage, or report-lifecycle row**. Persistence shape
  lists `transfer_opportunity` / `transfer_negotiation_case` / `transfer_offer`
  / … — **no `scout_*` tables.** `transfer-market-simulation.md` §tiering:
  "better scouts, better analysts, regional knowledge … narrow the band" —
  scout reports are an *input* to valuation, not a Transfer-owned thing.
- **Source:** `transfer-market-architecture.md` (binding/current);
  `transfer-market-simulation.md` (binding/current). **Confidence:** high.

- **Finding:** People (ADR-0052, draft) owns the Chief Scout / Data Analyst as
  a **Person** (identity + persona substrate + skill profile) but **explicitly
  excludes** scout activity — no scout-assignment, coverage, or report-lifecycle
  state; "agent negotiation state owned by Transfer/Contracts." People can hold
  a scout only as an `ActorRef`; operational state lives elsewhere.
- **Source:** `ADR-0052-people-persona-and-skills-context.md` (draft).
  **Confidence:** high.

- **Finding:** Squad & Player owns the **Impact-Lens** read model, which may
  combine facts from "tactics, training, match and **scouting** only through
  public queries, published domain events, or denormalised projection inputs
  already copied into Squad-owned storage" and **MUST NOT query another
  context's internal tables** (§3.1). This is the decisive architectural
  constraint: it forbids Option A (scouting inside Transfer would force Squad to
  read Transfer internals), and it presumes scouting is an *external publisher*
  of facts into Squad — i.e. either a Squad sub-aggregate (B) or its own context
  (C), not a Transfer sub-aggregate.
- **Source:** `bounded-context-map.md` §3.1 (binding/current). **Confidence:**
  high.

- **Finding:** The scouting *game design* is rich and binding-direction but
  ownership-silent: a seven-step funnel (Needs → Long list → Short list → Deep
  scouting → Risk assessment → Negotiation → Integration), six scout attributes,
  three player-report opacity layers, persistent long/short lists, a scouting
  **budget allocation** with a Chief-Scout default proposal, and five hidden
  flags (injury-proneness, big-match temperament, professionalism, adaptability,
  ambition) revealed only by deep + repeated scouting.
- **Source:** `scouting-and-recruitment.md` (draft GDDR), `GD-0006-transfers.md`
  (approved). **Confidence:** high.

- **Map baseline:** 19 bounded contexts after the FMX-32 ratification (Stadium
  Operations + Audience & Atmosphere + CommercialPortfolio). ADR-0059 (Community
  Overlay) and ADR-0060 (Youth Academy) are still proposed/draft and have not
  grown the map. Latest ADR = ADR-0063; latest GD = GD-0023.

### F2 — Genre best-practice: scouting is a constrained information system

- **Finding:** FM, EA FC Career, Anstoss and OOTP all model scouting as a
  *constrained information system distinct from the transaction*: a finite scout
  pool directed by **assignment** (region / competition / club / specific player
  + type filters), **ongoing vs fixed-length** missions, a report lifecycle with
  a **knowledge%** confidence bar that accumulates over repeat viewings, an
  explicit **aging → "out of date" → re-scout** staleness loop, **coverage
  tiers** (fully / partially / uncovered) driving discovery + error bars,
  persistent **long-list vs short-list**, and **threshold-gated reveal** of
  hidden flags. FM keeps **next-opposition / match scouting as a separate
  analyst assignment** from recruitment scouting — direct support for the
  recruitment-only + reserved-hook decision.
- **Source:** Perplexity Q1 (genre). **Confidence:** medium-high (manuals +
  in-game UIs + community reverse-engineering; SI/EA do not publish internals).

### F3 — DDD: the intelligence side warrants its own context

- **Finding:** A scouting/intelligence subsystem deserves its own bounded
  context when it has a distinct ubiquitous language, a long-running cyclic
  lifecycle, different KPIs, a different change cadence, organizational/role
  separation, and distinct external integrations — all of which hold here. The
  DDD split signals fire across the board:
  1. **Distinct language** (assignment / coverage tier / report freshness /
     confidence / long-list vs offer / clause / window / registration) — incl.
     Same-Term-Different-Concept ("target" to a scout ≠ to a negotiator). ✓
  2. **Distinct lifecycle** — scouting is long-running/cyclic, transfer is
     episodic/deadline-driven; event-storming shows two near-independent chains
     with few cross-events. ✓
  3. **Distinct KPIs** — coverage %, lead-time, hit-rate vs deal-conversion,
     budget adherence. ✓
  4. **Low co-change** — report-field / assignment-algorithm changes don't touch
     negotiation/contract code. ✓
  5. **Org/role separation** — Head of Scouting + data scouts vs Director of
     Football + negotiators (Fowler: team/culture seams dominate boundaries). ✓
  6. **Distinct integrations** — data/video providers vs regulatory/contract/
     finance systems. ✓
- **Real software analogues (intelligence split from transaction):** CRM
  Lead/Marketing vs Sales/Opportunity, trading Research/Analytics vs Execution,
  observability Telemetry vs Incident, **ATS / Talent Acquisition vs HR Core**.
  In each the gathering context owns *uncertain, confidence-rated, evolving*
  information and **feeds but does not control** the transaction context — the
  exact relationship scouting has to Transfer here.
- **Source:** Perplexity Q2 (DDD; Fowler bliki BoundedContext, Vernon IDDD
  supporting-subdomain, Nick Tune autonomy contexts, Context Mapper).
  **Confidence:** high.

### F4 — Real-world workflow confirms the producer→consumer split

- **Finding:** Modern clubs run **hybrid** networks: head of recruitment +
  territory scouts + data scouts (Hudl StatsBomb/Wyscout, SciSports, Opta) +
  loan scouts. Pipeline = **long list → data filter → video → live re-scout →
  committee**, with **aging/revalidation** of stale reports. Hidden intelligence
  (character, adaptability, injury durability, off-field flags) is **triangulated
  + committee-reconciled**, separately from the contract/negotiation function.
  This mirrors a Scouting context that *produces* confidence-rated intelligence
  consumed by a separate recruitment/transfer decision step — and confirms the
  hidden-flag decision (Scouting reveals on confidence; truth is validated/owned
  elsewhere).
- **Source:** Perplexity Q3 (Hudl, StatsBomb course, Breaking The Lines).
  **Confidence:** medium-high (workflow well-sourced; club-by-club org charts
  partly inferred — SciSports/Opta workflow detail thin in sources).

### F5 — DDD criteria scorecard

Applying the wave's six-of-six split-criteria rubric (same as FMX-29 / 32 / 33):

1. **Own ubiquitous language ✓ strong** — assignment, coverage tier, report
   freshness/knowledge%, staleness, long-list/short-list, hidden-flag confidence,
   network, focus campaign.
2. **Own FSM ✓** — `ScoutAssignment` (active → completed/expired/cancelled) +
   `ScoutingReport` (filed → refreshed → aged → stale → archived).
3. **Own storage ✓** — assignments, reports + knowledge%, coverage map, long/
   short lists, hidden-flag reveal ledger.
4. **Multiple consumers ✓** — Transfer (valuation-confidence + candidate
   handoff), Squad & Player (Impact-Lens scouting inputs), Youth Academy
   (discovery handoff), Notification (report-filed / new-target inbox items),
   Manager & Legacy (recruitment-style signal, future).
5. **Cross-cutting role ✓** — intelligence feeds valuation + squad assessment +
   youth intake + inbox narrative; it is a horizontal knowledge layer.
6. **Low co-change with neighbours ✓** — assignment/coverage/report-aging loops
   evolve independently of negotiation, the window calendar, and the ledger.

Total: **6/6** — matches the FMX-29 / 32 / 33 wave high.

## Inputs For Decisions

- **ADR input (ADR-0064):** Recommend **Option C** (own Scouting context).
  People = identity source (query); Transfer / Squad & Player / Youth Academy /
  Notification = consumers via published read models + events; Club Management
  posts any scouting-budget expense to the ledger (ADR-0050) via the
  Staff-Operations-style Customer-Supplier + ACL pattern. No cross-context join.
- **Nico decisions (2026-06-02, HITL):**
  1. **Ownership = C** (own Scouting context, 20th BC).
  2. **Opposition/match-prep scouting = recruitment-only now + a reserved
     published hook** (`OppositionScoutingRequested` placeholder); opposition
     analysis stays coupled to Tactics/Match where consumed. Mirrors FM's
     recruitment-scout vs analyst split.
  3. **Youth boundary = Scouting discovers → Youth Academy intakes.** Scouting
     owns external discovery + reports for **all ages up to the academy gate**;
     Youth Academy (ADR-0060, if ratified) owns intake/cohort lifecycle once a
     prospect is taken in. Clean producer→owner handoff
     (`ExternalYouthProspectIdentified` → Youth Academy).
  4. **Hidden flags = Scouting gates the reveal, owners keep the truth.**
     Underlying truth stays in People (persona) / Squad & Player (injury);
     Scouting owns only the confidence-gated reveal (`HiddenFlagSurfaced`) keyed
     to knowledge%. Facts arrive via query/event into Scouting's read view — no
     cross-context join.
- **Game-design input:** amend `scouting-and-recruitment.md` with an
  Activity-Owner section pinning the above (done in the same PR; stays draft).
- **Map input:** order-tolerant `bounded-context-map.md` patch attached to
  ADR-0064 (not applied to the map until Nico ratifies).

## Future-scope notes (classified future-scope)

- **Opposition/match-prep scouting** full model (analyst assignment, opposition
  report lifecycle, Tactics consumption) — reserved hook only at MVP; full
  design is a later ticket once Tactics opposition-template needs firm up.
- **Data-scout vs eye-test duality** as an explicit in-game mechanic (data
  coverage vs live-view confidence as separate knowledge channels) — design
  depth question, not a boundary question.
- **Agent-sourced free-agent tips** feeding the long list (`scouting-and-
  recruitment.md` §10) — interaction with the Scouting context's discovery loop.
- **FSM library** (XState v5 vs in-house deterministic FSM) — implementation-
  phase decision per ADR-0018 determinism rules; re-verify currency then.
- **Scouting-budget granularity** and whether the Chief-Scout default-allocation
  proposal is a Scouting read model or a Staff Operations output — settle at
  implementation.
