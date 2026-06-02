---
title: "Raw Perplexity — Competition/Season registry DDD + IP (FMX-79)"
status: current
tags: [research, raw, perplexity, league, competition, ddd, ip, fmx-79]
created: 2026-06-02
updated: 2026-06-02
type: research
binding: false
linear: FMX-79
sourceType: external
related:
  - [[../competition-registry-sub-aggregate-2026-06-02]]
  - [[../../10-Architecture/09-Decisions/ADR-0066-competition-registry-sub-aggregate]]
---

# Raw Perplexity capture — FMX-79

> Unedited capture of the two Perplexity (Sonar) queries that ground the FMX-79
> dossier and ADR-0066. Retained per the domain-research-workflow raw-archive
> rule. Synthesis lives in [[../competition-registry-sub-aggregate-2026-06-02]].

## Query 1 — DDD aggregate design for a competition/season registry

**Prompt (verbatim):** DDD for a football management sim — model a
Competition & Season registry as a sub-aggregate inside a League Orchestration
bounded context. (1) one polymorphic Competition aggregate with a league/cup
discriminator vs separate aggregate types; (2) aggregate-root boundary: Season
root owning competitions vs each Competition referencing a Season — how do
OpenFootball / StatsBomb / Opta + Vernon/Evans handle season vs competition vs
edition; (3) multi-tier pyramid with promotion/relegation as VOs, total +
acyclic tier order; (4) parallel competitions so a club can be in 2+ at once
without ownership conflict; (5) competition format as an extensible VO.

**Answer (verbatim):**

You will almost certainly want:
- Separate aggregate roots for Competition and Season
- Separate aggregate types for league vs cup (with a shared abstraction), not
  "one big polymorphic Competition with a discriminator"
- Clubs as their own aggregate in a different bounded context, with competitions
  referencing them by ID

### 1. League vs Cup: one polymorphic Competition or separate aggregates?
Two forces: a unified "competition" concept (UI, reporting, scheduling) vs very
different invariants/behaviour for league vs cup. **Recommendation:** a
Competition *abstraction* (interface/abstract concept) + two distinct aggregates
`LeagueSeason` and `CupSeason`. Both fulfil the "Competition" concept but are
different aggregate types. Why not a single polymorphic aggregate with a
discriminator: conditional logic everywhere (`if type == League`), many fields
that apply to only one type (`numberOfRounds`, `groupStageDefinition`,
`twoLeggedTies`), and hard-to-maintain invariants (league: each pair plays
home & away once; cup: knockout ties must yield a winner, bracket integrity). In
DDD aggregate design is invariant-driven (Evans, Vernon); when invariants and
lifecycle differ significantly, separate aggregates are favoured. Benefits:
clear per-aggregate invariants, simpler isolated logic (no god-object), easier
extensibility (add `ContinentalCupSeason` later without disturbing league
logic). Still keep a shared concept — the registry exposes a polymorphic view
(`CompetitionSeason` with Id / CompetitionId / SeasonId / Kind) but the actual
aggregates behind it are distinct.

### 2. Aggregate root: Competition vs Season
Two mainstream patterns: (1) Competition + Season + Edition; (2) CompetitionSeason
as the main unit. Real football data models strongly distinguish **Competition**
(long-lived concept: "Premier League", "FA Cup") from **Season/Edition** (yearly
instance: "Premier League 2023-24"). OpenFootball: `leagues.yml` (competition) +
separate season files (`en.1-2023-24.txt`). StatsBomb / Opta: Competition (id,
name, country, type) + Season (id, name/year) + a competition-season join/edition
that matches belong to. DDD recommendation: Competition = long-lived entity
(small aggregate / reference entity); Season = long-lived calendar concept
(startYear/endYear); **the aggregate root that matters for domain rules is the
CompetitionSeason** (`LeagueSeason` / `CupSeason`), referencing CompetitionId +
SeasonId. Do NOT make a giant Season aggregate owning all competitions — it
couples all competitions and creates a concurrency hot spot (every update to any
competition touches Season). Per Vernon: aggregate roots enforce one consistent
invariant set, support concurrency/distribution, avoid becoming coordination
hubs. The registry holds registrations of CompetitionSeason aggregates and
provides lookups ("all competitions in season 2024-25").

### 3. Multi-tier pyramid
Capture tiers/divisions with absolute ordering (Tier 1 top … Tier N) and
promotion/relegation rules between adjacent tiers. Model: `LeagueTier` VO
(`PyramidId` + `TierRank`); `LeagueSeason` aggregate per division-season (Tier
VO + ParticipantClubIds + Promotion/RelegationSlots VOs); `PyramidConfiguration`
aggregate managing structure + rules (list of `TierConfiguration`: TierRank,
CompetitionIds at that level, PromotionRule/RelegationRule to adjacent ranks).
Acyclic total order enforced by: positive-integer TierRank, no duplicate ranks
in a pyramid, no upward refs that skip levels or form cycles. PromotionRule /
RelegationRule as VOs (numberDirect, hasPlayoff, playoff participants/winners).
Cross-tier movement orchestrated by a Pyramid Orchestration domain service /
process manager listening to end-of-season events — keeps league-season
aggregates focused on their own invariants (Vernon process-manager guidance).

### 4. Parallel competitions
Core rule: Club is an aggregate root in its own bounded context; competitions
never own the Club aggregate — they own a participant representation referencing
the club. `Participant` (entity/VO) inside LeagueSeason/CupSeason: ParticipantId
(optional, local), ClubId (ref to Club BC), snapshot info (name at registration,
seeding/coefficient/entry round, association/country). No ownership conflict;
a club can be in many competitions simultaneously, each with its own Participant
pointing at the same ClubId. Seeding = `SeedingValue` VO (ranking, pot,
coefficient) used by CupSeason to build brackets. Qualification expressed via
domain events (`ClubWonCup` → continental orchestration creates an entry
Participant). Cross-aggregate relationships by ID + events, not object refs.

### 5. Competition format as an extensible VO
CompetitionSeason owns current state (matches/standings/bracket) + a `Format` VO
describing how to generate/transition state. `CompetitionFormat` (Kind:
RoundRobin / Knockout / GroupThenKnockout) with `RoundRobinFormat`
(numberOfLegs, balancedHomeAway, PointsRule), `KnockoutFormat` (numberOfRounds,
twoLeggedTies, TieBreakerRule, DrawRule), `GroupThenKnockoutFormat`
(GroupStageFormat + KnockoutFormat). Reserved seams: sealed/discriminated-union
pattern, behaviour centralised in domain services (`ISchedulingPolicy`,
`IAdvancementPolicy`) not giant if-chains; adding continental formats = new
policies + new format VO shapes without changing existing aggregates. Format is
immutable, part of the CompetitionSeason aggregate, chosen at creation; changing
format mid-season is forbidden or modelled as a new season instance.

**Citations (as returned):** Microsoft "Intro to DDD"
(learn.microsoft.com/.../domain-driven-design), exploreddd.com, plus generic
results. (DDD substance corroborated against Vernon IDDD + Evans + OpenFootball
/ StatsBomb-Opta public schemas; design-competition citations were off-topic
noise and ignored.)

## Query 2 — IP: are competition formats/structures protectable?

**Prompt (verbatim):** Fictional football management game mirroring real-world
competition STRUCTURES with fictional names. (1) Are formats/structures
(double round-robin, knockout brackets, group+knockout, promotion/relegation
pyramid, Aug–May calendar, seeding/draw) copyrightable/protectable, or
uncopyrightable systems/methods/facts (idea/expression, 17 USC §102(b), EU
equivalents)? (2) What IS protected: real names/logos (trademarks), and the
protected combination of a real league's exact roster + promotion history (EU
Database Directive 96/9/EC). (3) Best practice for IP-clean fictional naming +
generic structure.

**Answer (verbatim, condensed to substance):**

**1. Formats/structures — not protected.** US: 17 USC §102(b) — copyright "does
not extend to any idea, procedure, process, system, method of operation,
concept, principle, or discovery," only to expressive form. A league format
(double round-robin, knockout, group+knockout, promotion/relegation pyramid,
Aug–May calendar, seeding/draw) is a system/method of organising competition,
not expressive content. EU: CJEU requires a "work" = author's own intellectual
creation; sporting events/football matches are governed by rules leaving "no
room for creative freedom" and are not "works." CJEU *Football Association
Premier League (FAPL)* held football matches cannot enjoy copyright as works and
EU law does not protect them under any other IP right. The abstract structure of
a league/tournament is a set of competition rules — functional regulations, not
expressive works. Not protectable: using a 20-team double round-robin, knockout
brackets, group+knockout, a 3-up/3-down pyramid, an Aug–May calendar, generic
seeding/draw. Protectable only: specific expressive renderings (rulebook text,
original graphics) — not the underlying system. **Mirroring real-world
structures with your own names/visual designs sits squarely on the
"unprotectable system" side.**

**2. What is protected.** (a) Names/logos/branding via trademark + copyright —
do NOT use real competition names ("Premier League", "Bundesliga", "UEFA
Champions League", "LaLiga", "Serie A"), real logos/emblems/shields or close
imitations, or recognisable graphic identities (colour schemes, trophy
silhouettes, anthems). (b) Database/compilation rights — EU sui generis database
right (Directive 96/9/EC) for databases with substantial investment in
obtaining/verifying/presenting contents. A single fact ("club X finished 5th in
year Y") is not protected, but a complete structured set of clubs/seasons/
tables/results + full promotion/relegation history can be a protected database;
copying a real league's complete roster + exact historical record risks taking a
"substantial part." Publishers avoid this by licensing official data OR using
fictional clubs/competitions.

**3. Best practice.** Use entirely fictional competition names (avoid confusing
similarity — "EPL" risky; "Elite National League" safer); create original
logos/visual identities; freely mirror generic formats/structures (multi-tier
pyramids, domestic knockout cups, continental group+knockout, realistic
calendars, seeding/draw — unprotectable rules/systems); avoid copying
proprietary datasets wholesale (invent your own clubs + histories); avoid
suggesting official affiliation. This is the established IP-clean approach used
by unlicensed sports management games.

**Citations (as returned):** entsportslawjournal.com/article/id/835;
aoshearman.com "IP rights in football: avoiding an own goal";
legalblogs.wolterskluwer.com copyright-and-football-matches;
en.wikipedia.org/wiki/Laws_of_the_Game; canellacamaiora.com
"how to protect a sports competition"; klgates.com (UEFA/FIFA competition law).
