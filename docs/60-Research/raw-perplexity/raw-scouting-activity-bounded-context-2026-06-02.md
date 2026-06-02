---
title: Raw research — Scouting Activity bounded-context ownership (FMX-27)
status: raw
tags: [research, raw, scouting, transfer, squad-club, ddd, fmx-27]
created: 2026-06-02
updated: 2026-06-02
type: research
binding: false
linear: FMX-27
sourceType: external
related: [[../scouting-activity-bounded-context-2026-06-02]], [[../../10-Architecture/09-Decisions/ADR-0064-scouting-activity-context]]
---

# Raw research — Scouting Activity bounded-context ownership (FMX-27)

Raw archive of the three Perplexity queries mandated by FMX-27 (per the
FMX-24 domain-research workflow Phase 2) plus the FMX-18 tooling-currency
lookup. Lightly condensed; citations preserved verbatim. Synthesis lives in
[[../scouting-activity-bounded-context-2026-06-02]].

---

## Q1 — Genre best-practice: scout assignment + report lifecycle (FM / EA FC / Anstoss / OOTP)

**Prompt:** How is the scouting subsystem modeled in FM, EA FC Career, Anstoss,
OOTP — assignment/tasking + expiry, report lifecycle (generation, knowledge
accumulation, aging/staleness, refresh), network coverage tiers, long-list vs
short-list persistence, hidden-flag reveal timing.

**Key findings:**

- **Shared model across all titles:** scouting is a *constrained information
  system* — direct a limited pool of scouts to regions/leagues/players; they
  generate imperfect reports whose quality depends on time × scout ability ×
  network coverage; reports age and lose reliability. Recurring primitives:
  assignment queues, % knowledge bars, star-rating confidence, region coverage
  tiers, gates on hidden-attribute reveal.
- **Assignment / tasking:**
  - FM — explicit assignment menu by **region/nation, competition, team, or
    specific player** + player-type filters (position, role, age, contract
    status, min potential). Assignments are **ongoing** (cancel/recall to end)
    or **fixed-length** (scout returns to pool on completion). "Fully scout" a
    player queues views until a **knowledge threshold** (~90–100%) is reached.
    *Next-opposition* / match scouting is a **separate** analyst assignment that
    auto-rolls to the next fixture.
  - EA FC — more abstract; youth scouts sent to a **country** with an
    assignment type, continuous monthly candidate batches; first-team via the
    **Global Transfer Network** with persistent **search-profile instructions**;
    one scout actively searches one region at a time.
  - Anstoss — hire observers, assign to leagues/countries/competitions or a
    known player; **fixed missions** with expected duration; pay premium for
    broader-but-shallower season coverage.
  - OOTP — Head Scout with per-area accuracy ratings; allocate **scouting focus
    budgets** per area (MLB / minors / amateur / international) rather than
    per-region micromanagement; persistent focus settings + finite player
    assignments.
- **Report lifecycle:** generation → **knowledge % accumulation** over repeat
  viewings/training/data (diminishing-returns curve: 30→60% fast, 80→100% slow,
  needs better access / higher Judging-Ability scout) → **aging** ("Last
  scouted on" date; UI warns "out of date") → **re-scout** uses existing
  knowledge as baseline, refreshes faster than initial. OOTP makes the
  scouted-vs-actual split explicit: scout error margin shrinks with exposure;
  re-scout can radically revise a prospect ("we were wrong about this kid").
- **Network coverage:** FM has explicit **Scouting Packages** (Domestic →
  World) × per-scout **regional knowledge** → coverage tiers
  (**fully / partially / uncovered**) driving discovery chance, knowledge-gain
  speed, and baseline error. Uncovered leagues: players invisible unless
  high-reputation, or known only at low knowledge with wide bands. Building the
  network (scouts with complementary region knowledge) is a strategic layer.
- **Long-list vs short-list:** FM **Scouted Players** list (de-facto long list)
  + curated **Shortlist** (manual add; agents proactively update you; keep
  X months / indefinitely; saved with the save, exportable). EA/Anstoss/OOTP
  all persist watch/short lists across seasons until cleared or player retires.
- **Hidden-flag reveal:** threshold-gated. FM — personality label + injury
  comments need **medium-high knowledge%**; subtle hidden attrs (consistency,
  big-match) only after long observation or once the player is at your club.
  EA — traits (Leadership, Injury-Prone, "special something") hidden until
  fully scouted/signed. OOTP — durability/work-ethic/leadership surface as
  text snippets after sufficient scouting/coaching exposure.

Citations: [1] https://steamcommunity.com/app/872790/discussions/0/1742229167198377690/
· [2] https://discussions.unity.com/t/how-to-build-a-football-manager-like-game-need-tutorials-assets/565498
· [3] https://gamingretro.substack.com/p/classic-football-management-mixed
· [4] https://www.onpapersports.com/blog/best-football-management-games
· [5] https://www.kinephanos.ca/2016/football-manager/

---

## Q2 — DDD: scouting as own context vs transfer sub-aggregate

**Prompt:** When does a scouting/intelligence subsystem warrant its OWN bounded
context vs remaining a sub-aggregate of a transfer/recruitment context? Canonical
split signals (Evans, Vernon, Brandolini event-storming); real software analogues
(CRM lead vs opportunity, observability vs incident, research vs trading, ATS vs
HR); trade-offs (coupling, test isolation, service extraction, data sovereignty).

**Key findings:**

- **Verdict:** a scouting/intelligence subsystem deserves its **own bounded
  context** when the people who do scouting use a meaningfully different
  language, have different goals/workflows, and need to evolve their model
  independently of the transaction (transfer) side. This commonly maps to a
  distinct team and lifecycle (scouting → pipeline → decision).
- **Split criteria that fire for scouting:**
  1. **Different ubiquitous language** — scouting: assignment, region, coverage
     tier, report file/age/stale/archive, long-list/short-list, hidden flags,
     network coverage, focus campaigns, confidence. Transfer: offer, bid,
     counter-offer, valuation, wage demands, agent fees, clauses, window,
     registration. Same word, different concept (a "target" to a scout ≠ a
     "target" to a negotiator) = canonical Same-Term-Different-Concept signal.
  2. **Distinct lifecycle / workflow** — scouting is long-running, cyclic
     (assign → recurring reports → age → refresh → stale → archive); transfer
     is episodic, deadline-driven. Event-storming shows two largely independent
     event chains with only a few cross-events ("Player promoted to short-list"
     → "Transfer opportunity opened").
  3. **Different optimization goals/KPIs** — scouting: coverage %, fresh-report
     count, lead-time to discovery, recommendation hit-rate. Transfer: deal
     conversion, budget adherence, squad balance, wage structure.
  4. **Different change cadence** — improving scouting (assignment algorithms,
     new flags/report fields) typically doesn't touch negotiation/contract code,
     and vice-versa ("things that change together" heuristic).
  5. **Organizational/role separation** — Head of Scouting + data scouts +
     coverage managers vs Director of Football + negotiators + legal; Fowler:
     human-culture/team seams are often the dominant boundary factor.
  6. **Different external integrations** — scouting integrates with data
     providers / video platforms; transfer with regulatory / contract /
     financial systems. Distinct integration surfaces = classic boundary.
- **Keep it inside Transfer/Recruitment only if** the org doesn't distinguish
  scouting from recruitment, vocabulary is heavily intertwined, "reports" are
  created only once a transfer is actively considered (no continuous coverage
  activity), the code changes together, and there's no intent to give scouting
  its own roadmap/team/deployment. Then scouting is a cluster of aggregates
  (`ScoutingReport`, `CandidateList`) inside one context.
- **Real software analogues — intelligence split from transaction:** CRM
  **Lead/Marketing** context vs **Sales/Opportunity** context (qualify maps Lead
  → Opportunity); trading **Research/Analytics** vs **Execution**; observability
  **Telemetry/Analytics** vs **Incident/Operational**; **ATS / Talent
  Acquisition** vs **HR Core** (hired candidate transitions ATS → HR). In each,
  the gathering/intelligence context owns *uncertain, evolving, confidence-rated*
  information, has looser/probabilistic invariants, and **feeds but does not
  control** the commitment/transaction context.
- **Recommended shape for this domain:** a **Scouting (Intelligence) context**
  with aggregates `Scout`, `ScoutAssignment`, `ScoutingReport`, `CoveragePlan`,
  `CandidateList`; events `ScoutAssigned`, `ReportFiled`, `ReportRefreshed`,
  `ReportBecameStale`, `PlayerAddedToLongList`, `PlayerPromotedToShortList`;
  policy "when promoted to short-list with rating ≥ X, publish
  `CandidateIdentifiedForRecruitment`." Transfer consumes these and keeps its
  own `TransferTarget`/`Opportunity`. As a modular monolith this gives clean
  model separation with cheap in-process integration; "you can collapse later
  if it proves unnecessary, but the DDD signals point strongly to Scouting as
  its own bounded context."
- **Trade-offs:** separate context reduces conceptual coupling + sharpens test
  isolation (scouting tests need no transfer fixtures) + eases later service
  extraction + enforces data sovereignty (scouting owns report/flag data;
  transfer consumes views/events, accepts eventual consistency). Cost:
  integration complexity (events/ACL), and you give up trivial strong-consistency
  transactions across both — but over-exposing scouting internals to negotiation
  logic makes a later split painful.

Citations: [1] https://ozimmer.ch/modeling/2022/11/23/ContextMapperInsights.html
· [2] https://www.martinfowler.com/bliki/BoundedContext.html
· [3] https://www.youtube.com/watch?v=ez9GWESKG4I (Nick Tune — autonomy contexts)
· [4] https://dev.to/andremw/using-f-and-ddd-to-create-an-online-card-game-part-2-27nl
· [5] https://vaadin.com/blog/ddd-part-1-strategic-domain-driven-design (Vernon supporting-subdomain)

---

## Q3 — Real-world scouting/recruitment workflows (2023–2026)

**Prompt:** Modern pro-club scouting network structure; report lifecycle
(live/video → long-list → short-list → committee, aging/revalidation); data
platforms (StatsBomb, Wyscout/Hudl, SciSports, Opta) vs eye-test and how they
combine; hidden intelligence (character, adaptability, injury, off-field flags)
and how it is validated.

**Key findings:**

- **Hybrid systems** are now standard: territory live scouts identify/verify on
  the ground; data/video scouts narrow large pools to shortlists; a recruitment
  committee decides whether a player advances to an offer. Canonical pipeline:
  **long list → data filter → video review → live re-scout → committee
  decision**, with reports revisited if not signed quickly or if conditions
  change.
- **Network structure:** **Head of recruitment / lead scout** owns market
  strategy and profile priorities and coordinates handoffs; **regional/territory
  scouts** own a geography/competition cluster feeding a shared database;
  **technical/data scouts** use Hudl StatsBomb+Wyscout / SciSports / Opta to
  find role-benchmark matches and attach clips+metrics; **loan scouts** track
  the club's own young players and loan destinations (different decision: not
  "can he help us?" but "will this loan maximize development + preserve asset
  value?").
- **Report lifecycle:** live report captures context video misses (body language
  after mistakes, communication, response to adversity, tactical adaptation) →
  video scouting reviews multiple matches → long list (data filters reduce
  "thousands of players" to a shortlist) → shortlist (role criteria + ≥1 video
  round) → committee (head of recruitment + senior scouts + analysts + coach +
  sporting director). **Aging/revalidation:** recommendations are not static;
  clubs re-check older reports after a delay (form, fitness, role, price change)
  and re-watch/re-score stale reports before deciding.
- **Data platforms vs eye test:** data = scale + consistency + benchmarking
  (best for early screening + revalidation); eye test = context, decision-making,
  body language, tactical discipline, fit (best for final verification). Hudl's
  enhanced StatsBomb/Wyscout puts **data + video side-by-side** — filter to
  identify, then instantly watch the relevant actions. StatsBomb's recruitment
  course frames modern recruitment as **integrating** data + traditional
  scouting, not replacing one with the other.
- **Hidden intelligence beyond on-pitch ability:** character/professionalism
  (work rate, coachability, consistency, reaction to feedback); personality/
  communication (how he interacts, organizes, behaves under pressure);
  adaptability (new role/league/country/culture — key for cross-border);
  injury history/durability (cross-checked before committing); off-field red
  flags (attitude, discipline, lifestyle) — gathered via repeated live viewing,
  local references, academy contacts, agents, internal network. **Validation:**
  repeat viewing (consistent impression across matches), cross-checking sources
  (live vs video vs data vs other scouts), contextual reference checks (coaches,
  academy staff, former teammates), and committee discussion to reconcile
  competing views (data says yes, eye test raises doubts, or vice-versa).

Citations: [1] https://www.hudl.com/blog/modern-scouting-workflows-player-archetypes-statsbomb
· [2] https://breakingthelines.com/opinion/4-clever-tools-behind-modern-football-analysis/
· [8] https://courses.statsbomb.com/courses/modern-scouting-and-data-driven-recruitment
· [9] https://360scouting.com/football-scouting-guide/best-football-scouting-courses/

---

## Tooling currency lookup (FMX-18 governance)

The scout-report lifecycle (`filed → updated/refreshed → aged → stale →
archived`) and `ScoutAssignment` (active → completed/expired/cancelled) are
deterministic finite-state machines. Library currency checked via context7:

- **XState** — latest stable **v5.20.1** (actor-based state management +
  statecharts for JS/TS). Context7 IDs `/statelyai/xstate` (v5),
  `/statelyai/docs`. v5 is actor-model-first; a clear successor to the v4 line.
- **Note:** consistent with sibling context ADRs (ADR-0057 Rivalry, ADR-0062
  Audience & Atmosphere), the concrete FSM-library binding is **deferred to the
  implementation phase** — this ADR specifies the FSM *shape*, not the library.
  XState v5 is recorded as the current TS-FSM candidate; final selection (XState
  v5 vs a lightweight deterministic in-house FSM, given ADR-0018 determinism +
  RNG-sub-label rules) is an implementation-phase decision and must re-verify
  currency at that time per the project's latest-stable policy.
