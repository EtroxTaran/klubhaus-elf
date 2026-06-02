---
title: Competition & Season registry sub-aggregate (FMX-79)
status: current
tags: [research, league, competition, season, fixture, ddd, bounded-context, gap-g1, fmx-79]
created: 2026-06-02
updated: 2026-06-02
type: research
binding: false
linear: FMX-79
sourceType: external
related:
  - [[raw-perplexity/raw-competition-registry-sub-aggregate-2026-06-02]]
  - [[../10-Architecture/09-Decisions/ADR-0066-competition-registry-sub-aggregate]]
  - [[../50-Game-Design/GD-0009-league-structure]]
  - [[../10-Architecture/bounded-context-map]]
  - [[../10-Architecture/state-machines/league-week]]
  - [[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]]
  - [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]
  - [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]]
  - [[../50-Game-Design/GD-0015-ip-clean-data]]
  - [[domain-model-audit-and-backlog-2026-06-02]]
  - [[../30-Implementation/domain-research-workflow]]
---

# Competition & Season registry sub-aggregate (FMX-79)

## Question

GD-0009 (binding) ratifies the *design direction* — mirrored real-world league
structures with fictional names, a promotion/relegation pyramid + multiple
parallel cups, an Aug–May calendar, cups post-MVP — but the
`league`/`competition`/`fixture` **domain schema** (gap **R2-14**, `prio:critical`;
confirmed audit gap **G1**, the single critical structural gap in the vault) was
never locked. The bounded-context map names **League Orchestration** the owner of
"Season, week, match-day, mode" and asserts it supplies `FixtureCommercialProfile`
/ `CompetitionRevenueProfile` / `SeasonAdvanced` to four downstream contexts, yet
**no aggregate / entity / value-object / invariant set** exists for the
competition/season registry that would produce those facts.

What is the right domain model — aggregate roots, child entities, value objects,
invariants — for a Competition & Season registry, owned as a **sub-aggregate
cluster inside League Orchestration**, future-proofed for post-MVP cups and
continental competitions without foreclosing any GD-0009 open item (R2-06
continental, R2-13 women's calendar)?

## Summary

Decision-ready recommendation, grounded in DDD best practice (Evans / Vernon),
public football data models (OpenFootball, StatsBomb/Opta) and IP doctrine:

- **Placement:** a **sub-aggregate cluster inside League Orchestration** (not a
  new bounded context). The map already assigns "Season, week, match-day" to
  League Orchestration (line 37); the league-week state machine is the *clock*,
  the registry is the *structure/format* the clock advances over. **[recommended]**
- **Aggregate shape:** a shared **`CompetitionSeason` concept** with **distinct
  aggregate roots per format family** (`LeagueCompetitionSeason`,
  `CupCompetitionSeason` reserved) — **not** one god polymorphic aggregate with a
  league/cup boolean. Invariant-driven aggregate design (Evans/Vernon) and every
  surveyed real data model separate the long-lived **Competition** concept from
  the per-year **Season/Edition** instance. **[recommended; departs from the
  issue's "one discriminated competition" phrasing — Nico decides]**
- **Reference entities:** `Competition` (long-lived concept) + `Season` (calendar
  concept) are small reference entities; the **CompetitionSeason edition** is the
  aggregate root that owns participants, format, schedule/standings or bracket.
- **Pyramid:** a separate **`PyramidConfiguration`** aggregate holds the
  total-ordered, acyclic tier ranking + promotion/relegation slot rules; cross-tier
  movement is a **Process Manager**, not an aggregate method.
- **Parallel competitions:** participants are **`ClubId` references + a seeding
  snapshot**, never the Club aggregate — so one club sits in league + N cups in a
  season with zero ownership conflict (Club is owned by Club Management).
- **Format:** an immutable **discriminated-union value object**
  (round-robin / knockout / group-then-knockout) with behaviour in
  scheduling/advancement **policies** (domain services), so continental formats
  are added as new policies + VO shapes without touching existing aggregates.
- **IP:** confirmed — formats/structures are **unprotectable systems** (17 USC
  §102(b); CJEU *FAPL*); only names/logos (trademark) and curated rosters+histories
  (EU Database Directive 96/9/EC) are protected. All naming routes through the
  IP-clean fictional catalog (GD-0015 / ADR-0007); no real names in schema or
  examples. GD-0009's "mirror structure, generate names" is the established safe path.

Four shaping questions are **escalated to Nico** (see §Open questions) and carried
as option sets in ADR-0066 (`Status: proposed`, `needs:nico-decision`). Nothing
here is self-accepted.

## Inputs (vault, binding/relevant)

- **GD-0009** (`binding: true`, approved): Decided/strong block — mirror
  structures, fictional names, promotion/relegation pyramid + multiple parallel
  cups, Aug–May, default sandbox `Aurelia Premier`, cups post-MVP. Open: R2-06
  (continental), R2-13 (women's offset), **R2-14 (this work — domain schema)**.
- **bounded-context-map** line 37: League Orchestration owns "Season, week,
  match-day, mode, pause, quorum"; published-language clauses (L82–88, L296–297)
  already promise `FixtureCommercialProfile` / `CompetitionRevenueProfile` /
  `SeasonAdvanced` to CommercialPortfolio, Regulations and Rivalry.
- **league-week.md** state machine: the weekly lifecycle
  (`week_open → … → post_match_reports`) assumes fixtures exist; it owns the clock,
  not the structure. The registry feeds it.
- **ADR-0027 Postgres data model** (current; supersedes the SurrealDB sketch in
  ADR-0004 / surrealdb-schema-patterns.md): per-save schema, cross-context refs as
  opaque branded UUIDv7 columns, embedded lists as `jsonb`. The domain model here
  is persistence-agnostic and Zod-describable; it maps cleanly onto ADR-0027.
- **surrealdb-schema-patterns.md** (superseded, historical): the platform DB owns
  `catalog_competition_template` + `catalog_region` — the IP-clean fictional naming
  source the registry draws from.
- **M3-001** (historic milestone seed, predates the 19-context map): "one fictional
  league, fixtures, table rules, promotion/relegation-*ready* model" — a single-tier
  MVP seed, not a domain spec; informs the MVP tier-depth question.

## Findings

### F1 — League Orchestration is the right home; this is a sub-aggregate cluster, not a new BC
The map already assigns season/competition structure to League Orchestration; the
published-language promises are *already made* from League Orchestration. Splitting
a "Competition & Fixtures" BC out would orphan those promises and duplicate the
season clock. The registry is the structural substrate the league-week clock runs
over — same context, distinct aggregate cluster. (Matches GD-0009 issue framing's
recommended option and the map.)

### F2 — Distinct aggregate roots behind a shared concept beats a god polymorphic aggregate
League and cup have materially different invariants (league: each pair plays
home & away once, total schedule completeness, standings + tiebreakers; cup:
bracket integrity, advancement, seeding, ties yield a winner) and lifecycles.
DDD aggregate design is invariant-driven (Evans; Vernon IDDD): when invariants
differ this much, separate aggregate **types** are favoured, unified by a shared
`CompetitionSeason` concept the registry exposes polymorphically. A single
`Competition{type: league|cup, …}` aggregate accretes type-conditional logic and
one-type-only fields and becomes a god-object. **For MVP only the league family
ships; the cup family is a reserved seam.**

### F3 — Competition (concept) vs Season (calendar) vs CompetitionSeason (edition)
Every surveyed real model separates a long-lived **Competition** ("Aurelia
Premier") from its per-year **Season/Edition** ("Aurelia Premier 2027/28"):
OpenFootball (`leagues.yml` + per-season files), StatsBomb/Opta
(Competition + Season + a competition-season join that matches belong to). The
**edition** (`CompetitionSeason`) is the aggregate root that owns participants,
format, schedule/standings/bracket. A giant `Season`-owns-everything aggregate is
an anti-pattern (concurrency hot spot; Vernon: roots shouldn't be coordination
hubs). `Season` is a small reference/calendar entity; `Competition` is a small
long-lived concept entity.

### F4 — Pyramid: a dedicated PyramidConfiguration aggregate + Process Manager
Tier ordering + promotion/relegation belongs in its own `PyramidConfiguration`
aggregate (TierRank total order; positive ints, no duplicate ranks, no cycles →
**total + acyclic by construction**; `PromotionRule`/`RelegationRule` VOs between
adjacent tiers). Actual club movement between tiers at season rollover is a
**Pyramid-rollover Process Manager / domain service** listening to end-of-season
events, so per-edition aggregates stay focused on their own invariants.

### F5 — Parallel competitions via ClubId reference + seeding snapshot
Club is an aggregate root in **Club Management**; the registry never owns it.
Each edition holds a `Participant` (local id, `ClubId` ref, registration snapshot:
name-at-entry, seeding/coefficient, entry round, association). One `ClubId` can be
referenced by a league edition and N cup editions in the same season — **no
ownership conflict** (acceptance criterion satisfied). Qualification flows
(cup winner → continental entry) are domain **events**, not object references.

### F6 — Format as an immutable discriminated-union VO + policies
`CompetitionFormat` discriminated union (`RoundRobin` {legs, balancedHomeAway,
PointsRule} / `Knockout` {rounds, twoLegged, TieBreaker, Draw} /
`GroupThenKnockout` {GroupStage + Knockout}). Behaviour lives in
`SchedulingPolicy` / `AdvancementPolicy` domain services keyed by format kind;
adding continental/multi-phase formats = new policy + VO shape, **no change to
existing aggregates**. Format is immutable, chosen at edition creation; mid-season
format change is forbidden (model a new edition). This is the **reserved seam** for
R2-06 continental and is format-agnostic to R2-13 women's-calendar offset.

### F7 — IP: structure is free, names/datasets are not (confirms GD-0009/GD-0015/ADR-0007)
Formats/structures (double round-robin, knockout, group+knockout, pyramid,
Aug–May, seeding/draw) are unprotectable systems/methods: US 17 USC §102(b)
idea/expression dichotomy; EU CJEU *Football Association Premier League* (matches
are not "works", no other IP right). Protected and to be avoided: real
names/logos/branding (trademark + copyright — incl. confusingly-similar names) and
a real league's **complete roster + exact promotion/relegation history** as a
curated dataset (EU Database Directive 96/9/EC sui generis right). **Mitigation
already in the vault:** all competition/season/club naming routes through the
IP-clean fictional catalog (`catalog_competition_template`, GD-0015, ADR-0007);
histories are generated, not copied. No real competition names appear in the
schema or examples (acceptance criterion satisfied).

## Options matrix (carried into ADR-0066 for Nico)

### D1 — Bounded-context placement
| Option | Verdict |
|---|---|
| **A. Sub-aggregate cluster inside League Orchestration** | **Recommended.** Matches map line 37; keeps the season clock + structure together; honours existing published-language promises. |
| B. New "Competition & Fixtures" bounded context | Orphans existing promises; duplicates the season clock; heavier. Reserve only if the registry later grows its own team/lifecycle. |

### D2 — Aggregate granularity
| Option | Verdict |
|---|---|
| **A. Shared `CompetitionSeason` concept + distinct aggregate roots per format family** (league ships; cup reserved) | **Recommended.** Invariant-driven; future-proof; no god-object. Departs from the issue's "one discriminated competition" wording → Nico decides. |
| B. One polymorphic `Competition` aggregate with a league/cup discriminator | Simpler initially; accretes type-conditional logic + one-type fields; harder invariants. Issue's literal phrasing. |

### D3 — Parallel-cup modelling (future-proofing)
| Option | Verdict |
|---|---|
| **A. Sibling competition editions under one Season, linked by participant references** | **Recommended.** Clubs shared by `ClubId`; cups are just more editions; minimal coupling. |
| B. Dedicated cup-calendar aggregate | Heavier; only justified if midweek cup-rotation scheduling needs its own lifecycle — reserve as a post-MVP seam. |

### D4 — MVP tier depth
| Option | Verdict |
|---|---|
| **A. Model pyramid depth >1 in the schema, ship single-tier data at MVP** | **Recommended.** `PyramidConfiguration` supports N tiers; MVP seeds one tier (per M3-001) without foreclosing promotion/relegation. |
| B. Single-league only, no pyramid abstraction | Cheaper now; expensive re-model when promotion/relegation arrives — contradicts GD-0009 "Decided/strong". |

## Open questions for Nico (HITL — not self-decided)

1. **Placement** (D1): sub-aggregate inside League Orchestration **[rec. A]** vs
   separate Competition & Fixtures BC.
2. **Aggregate granularity** (D2): shared concept + distinct roots **[rec. A]** vs
   one polymorphic competition aggregate (the issue's literal wording).
3. **Parallel cups** (D3): sibling editions under one season **[rec. A]** vs
   dedicated cup-calendar aggregate.
4. **MVP tier depth** (D4): schema depth >1 + single-tier data at MVP **[rec. A]**
   vs single-league only.
5. **Cup seeding source** — prior-season standings / coefficient / draw —
   **reserved for R2-06**, not designed here (model leaves a `SeedingValue` seam).

## Sources

- Internal: GD-0009, bounded-context-map (L37/L82–88/L296–297), league-week.md,
  ADR-0027, ADR-0019, ADR-0007, GD-0015, surrealdb-schema-patterns.md (historical),
  M3-001, domain-model-audit-and-backlog-2026-06-02 (gap G1 / R2-14).
- External (raw at [[raw-perplexity/raw-competition-registry-sub-aggregate-2026-06-02]]):
  Vernon *Implementing DDD* + Evans *DDD* (invariant-driven aggregates, IDs,
  process managers); OpenFootball + StatsBomb/Opta competition/season/edition
  schemas; US 17 USC §102(b); CJEU *Football Association Premier League*; EU
  Database Directive 96/9/EC; A&O Shearman "IP rights in football"; Entertainment
  & Sports Law Journal; canellacamaiora "how to protect a sports competition".
