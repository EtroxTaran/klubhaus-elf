---
title: Raw - Tactics Persistence Ownership Research (FMX-28)
status: raw
tags: [research, raw, perplexity, tactics, set-pieces, bounded-context, fmx-28]
created: 2026-05-28
updated: 2026-05-28
type: raw-research
binding: false
linear: FMX-28
sourceType: perplexity
related:
  - [[../tactics-persistence-bounded-context-2026-05-28]]
  - [[../tactics-and-formations]]
---

# Raw - Tactics Persistence Ownership Research (FMX-28)

> Three Perplexity queries run during FMX-28 to support the
> tactics-library-ownership recommendation. Match owns the per-match
> tactic-lock snapshot; the persistent tactic library (templates, saved
> presets, set-piece routines, opposition templates) currently has no
> named owner. This raw note archives the supporting external evidence;
> synthesis in [[../tactics-persistence-bounded-context-2026-05-28]]
> reconciles with the vault and produces the FMX-28 recommendation.

## Why these queries

The bounded-context-map §1 currently lists Match as owning "Line-up,
**tactic lock**, simulation, results". That is the per-match snapshot
only. `tactics-system.md` §10 specifies tier-based slots (Quick 2 /
Standard 3 / Expert 3) plus saved presets (0 / 10 / 50) but does not
attribute ownership to any context. `set-pieces.md` describes routine
variants embedded in tactic objects (`tactic.set_pieces[type]`) with no
named library owner. ADR-0051 (Manager & Legacy, accepted) captures
"Tactical identity" as a *post-run signal* but does not own the library.
ADR-0053 (Staff Operations, accepted) owns Set-Piece Coach as a role
slot but does not name effect-readiness signals into tactics.

Three queries target the residual question from three angles:

1. **Genre precedent** - how do football sims separate persistent
   tactical preset catalog from per-match tactic state?
2. **DDD authority** - is "library / template / catalog vs instance /
   snapshot" a recognised DDD pattern that warrants its own bounded
   context?
3. **Real-world grounding** - do modern clubs treat the tactical
   playbook as coach-owned IP, sporting-director archive, or
   data-platform-managed knowledge system?

## Query 1 - Football management sim tactic library vs match snapshot

### Prompt

How do football management simulations model the persistent tactical
playbook / library vs the per-match tactical snapshot? Compare FM, EA
FC Career 24/25/26, OOTP, FIFA Manager and Anstoss. Sub-questions: (1)
catalog separate from per-match state? (2) tier-based UI complexity as
data structures vs UI layers? (3) set-piece routine libraries inside
tactic or separate? (4) opposition tactical templates? (5) cross-save
vs in-save persistence and unlocks? (6) developer citations.

### Output summary

- **Universal pattern across all surveyed titles: persistent template
  catalog separate from per-match state.** FM has `.ftc` files; EA FC
  has Custom Tactics / Game Plans persisted per save; OOTP has manager
  strategy profiles; FIFA Manager has tactic files; Anstoss has team
  default tactics. Not conflated.
- **FM is the clearest precedent** for the FMX design: explicit
  persistent tactic catalog (`.ftc` files cross-save-shareable + in-save
  slots) + per-match tactic instance with familiarity/instruction state.
- **Tier-based UI complexity is universally UI-layer**, not separate
  data schemas:
  - FM: beginner/intermediate/expert + wizard vs advanced screens write
    to one tactic object.
  - EA FC: Basic vs Advanced modes write to one Custom Tactics object.
  - OOTP: simple vs detailed strategy screens write to one strategy
    preference structure.
  - All games: the underlying data is one record; tiers are different
    editor surfaces.
- **Set-piece routine libraries vary by game:**
  - FM: BOTH - separate set-piece library (savable, shareable
    independently) AND tactic references chosen routines.
  - EA FC: inside tactic object (set-piece preferences as
    parameters/assignments).
  - OOTP (baseball analogue): separate situational strategy tables
    inside manager strategy config.
  - FIFA Manager / Anstoss: mostly inside tactic object.
  - FM's both-pattern is the strongest evidence for set-piece routines
    as a separately addressable concern even when embedded in tactic
    structure.
- **Opposition tactical templates**: across all games, stored as
  **manager/team profiles in DB**, not as per-opponent saved plans. AI
  managers have preferred tactics/styles; engine retrieves profile and
  applies conditional logic at match time.
- **Cross-save vs in-save persistence:**
  - FM: explicit cross-save export/import via `.ftc` files + set-piece
    files; Steam Workshop and FMScout/FM tactic-sharing community
    revolve around these.
  - EA FC: no native cross-save export of individual tactics; modding
    only.
  - OOTP: explicit cross-save export/import of manager strategy
    profiles via built-in tools.
  - FIFA Manager: cross-save reuse via editor / DB import.
  - Anstoss: no official cross-save tactic export.
- **Unlocking formations/roles across saves**: NONE of the surveyed
  games unlocks formations/roles progressively. All systems available
  from start. This contradicts a "Cross-save unlock tactics via Manager
  & Legacy" model and supports FMX's GD-0019 "MVP ships hooks, not
  unlocks" stance.
- **Developer documentation is sparse to absent**: FM tactical
  preset/wizard features mentioned in patch notes; OOTP manual describes
  Manager Strategies + presets explicitly; EA Pitch Notes describe
  custom tactics tuning. No public schema or architecture-level
  documentation for any title.

### Citations Perplexity returned

- [1] YouTube - FM tactical UI walkthrough
- [2] YouTube - FM Set Pieces tutorial
- [3] YouTube - tactical creator guide
- [4] Steam Community - FM Default Tactic Is Best?
- [5] intechopen.com - football tactics research chapter
- [6] FMScout - FM24 tactics shared via files

### Confidence

**Medium-high.** Pattern is consistent across 5 independent titles.
The "template catalog separate from per-match state" finding is
unambiguous. Set-piece library question has one strong precedent (FM's
both-pattern). Source weakness on architectural detail flagged
explicitly by Perplexity, but behavioural evidence (Workshop sharing,
file formats, manual documentation) is solid.

## Query 2 - DDD canonical pattern for template/library vs instance

### Prompt

DDD canonical pattern for separating "master catalog / template /
library" from per-instance snapshots? Sub-questions: (1) when does a
library/catalog warrant own bounded context vs sub-aggregate? (2)
real-world DDD examples (CMS template/page, recipe/meal-log,
workout-template/session, lesson plan/class, contract template/signed
contract); cite Evans/Vernon/Fowler. (3) snapshot-at-instance-creation
pattern with template never re-read. (4) multiple consuming contexts
with different views: Published Language + per-consumer read model +
ACL. (5) catalog has own lifecycle while instances are independent -
does that strengthen the case for separation?

### Output summary

- **Yes - this is a recognised DDD pattern and the answer is strongly
  "separate bounded contexts with clear translation / snapshot
  semantics."** Evans (Bounded Context, Published Language,
  Anti-Corruption Layer) and Vernon (Customer-Supplier, strategic
  design, Product Catalog vs Ordering example) both support the carve.
- **Split criteria (Evans/Vernon/Fowler consolidated):**
  - Catalog has distinct lifecycle (create → edit → version → publish
    → retire) independent of instance execution lifecycle. ✓
  - Catalog has different invariants than instances. ✓
  - Catalog used by multiple consumers each with different language and
    constraints. ✓
  - Catalog becomes distinct technical team / service. (Partial in FMX;
    architectural coupling argument still applies.)
- **Keep as sub-aggregate only if** templates are simple configuration
  objects meaningful only inside one context, no independent lifecycle,
  template is really a Value Object for initialising aggregates.
- **Canonical example (Vernon): Product Catalog vs Ordering.**
  Catalog is own bounded context; order lines copy *descriptive*
  information (price-at-order-time, name-at-order-time) instead of
  treating the catalog record as the same entity over time. Reference +
  Snapshot.
- **Real-world examples Perplexity surveyed:**
  - CMS Page Template vs Rendered Page - separate Content Authoring +
    Content Delivery BCs.
  - Contract Template vs Signed Contract - Legal Template / Product
    Catalog BC + Contract Management BC; signed contracts are immutable.
  - Recipe / Workout / Lesson Plan vs Execution Log - same pattern.
- **Snapshot-at-creation pattern (canonical DDD shape):**
  - Instance aggregate stores `TemplateId + Version` (reference).
  - Plus an *embedded snapshot as Value Objects* of all template fields
    needed to preserve the instance's invariants.
  - Inside the instance BC, snapshot is part of the instance aggregate
    and obeys the instance context's invariants.
  - Template BC publishes Domain Event at creation time
    (`TemplateVersionCreated`, `TemplateVersionPublished`).
  - Instance BC consumes the event and builds its own read model /
    triggers instance creation.
  - Immutable copy semantics: once instance is created, snapshot fields
    are immutable from template-evolution perspective.
- **Multiple consuming contexts with different views:**
  - **Published Language** from the template BC (stable set of events
    or DTOs describing templates in catalog's own terms).
  - **Separate read models per consumer** (one optimised per consuming
    BC's needs - rendering BC needs structural view, analytics BC needs
    derived statistics, recommendation BC needs derived signals).
  - **Anti-Corruption Layer per consumer** when consumer language
    diverges significantly from Published Language.
- **Independent lifecycles strongly strengthen the case** for separate
  bounded contexts. Vernon's Product Catalog vs Ordering is the
  canonical reference: same shape applies any time "template catalog"
  and "instance / execution / tracking" can change independently.

### Citations Perplexity returned

- [1] YouTube - DDD context boundaries
- [2] martinfowler.com/bliki/BoundedContext.html (Fowler/Evans
  canonical)
- [3] bitsrc.io - bounded context in microservices
- [4] github.com/ddd-crew/bounded-context-canvas
- [5] miro.com - DDD design bounded contexts template
- [6] vaadin.com - DDD Part 1 Strategic Domain-Driven Design (Vernon
  example)

### Confidence

**High.** Multiple DDD authorities cited (Fowler canonical page,
Vernon strategic design, Context Mapper). Template-vs-instance with
catalog-as-own-BC is textbook DDD. Vernon's Product Catalog vs Ordering
is the direct analogue.

## Query 3 - Real-world football club tactical playbook ownership

### Prompt

Modern professional football clubs (2023-2026): who owns the tactical
playbook (coach IP vs sporting director archive vs club-wide tactical
archive)? Opposition game-plans creation/storage/reuse. Set-piece coach
library across seasons. Tactical archives across head-coach changes.
Cite Athletic / Premier League / UEFA / academic sources.

### Output summary

- **At modern elite clubs the CLUB owns the tactical playbook, not the
  head coach** - even though specific IP and language may be associated
  with the coach. The playbook lives in video/data platforms (Hudl,
  Wyscout, StatsBomb, in-house DBs), curated by analysts and specialist
  coaches.
- **Three-layer ownership in practice:**
  - Club game model / playing philosophy (sporting director / technical
    director / academy director).
  - Head coach's game model (must fit the framework).
  - Performance analysis and data department (maintains the digital
    archive: video, tags, training, set pieces, opposition reports).
- **Coach IP vs club IP boundary:**
  - Coach IP: methodologies, terminology, design concepts (often
    follows coach between clubs).
  - Club IP: actual recorded material (video clips, session plans on
    club time, internal documents, set-piece animations).
- **Opposition game-plans:**
  - Created per-game as pre-match packs: data profile, video clipped by
    phase (build-up, press, rest defence, offensive/defensive set
    pieces), written match plan.
  - Stored in video platforms (Hudl Sportscode, Wyscout, Spiideo,
    StatsBomb IQ/360, InStat) and internal servers.
  - **Indexed by opponent AND by structures/behaviours** (e.g., "versus
    aggressive high press 4-3-3", "versus deep 5-4-1 block", "versus
    back-three with double pivot"). The latter dimension dominates
    because coaches change frequently.
- **Set-piece coach library** (Brentford, Arsenal, Brighton):
  - **15-40 offensive routines + 10-20 defensive structures typical at
    well-resourced clubs**, refined over multiple seasons.
  - Tagged by starting position, run patterns, blockers, target zones,
    required player types.
  - Per-match: coach chooses 4-8 offensive corner routines and a
    handful of free-kick / long-throw patterns; tweaks existing
    patterns rather than inventing fresh.
  - Premier League 2025/26 data: long-throw xG more than double any
    previous season - reflects deliberate set-piece-coach work.
  - Brentford, Arsenal, Brighton documented as exemplars.
- **Tactical archives across head-coach changes:**
  - **Club-led model** (Brentford, Brighton, Red Bull, City Group, many
    Bundesliga clubs): high continuity. Game model persists above the
    coach; new coach receives previous structures, set-piece library,
    training data; strong pressure to keep major principles.
  - **Coach-centric model** (traditional big clubs, many Serie A / La
    Liga): on-pitch tactical identity can reboot with each coach.
    Archives still exist as scouting/history resource.
- **What's always passed across coach changes:**
  - Full match video archive and tagged events.
  - Opposition profiles and historical match plans.
  - Set-piece video catalogue and xG/performance data.
- **What's coach-specific:** specific language, rule hierarchies,
  decision trees, exact pressing-rules nuances, trigger phrasing.
- **2026 trend (FSI tactical analysis material):** clubs build their
  own "game model database" with match principles and reference clips,
  managed by analysts and integrated into video analysis tools rather
  than existing only as coach's private documents.

### Citations Perplexity returned

- [3] breakingthelines.com - modern football tactics changes (set-piece
  NFL-style plays)
- [4] premierleague.com news - four tactical trends 2025/26 (long-throw
  xG)
- [6] FSI training 2026 - football tactical analysis (game-model
  database, opposition profiles, set-piece tagging)
- [8] totalfootballanalysis.com - Brighton / Brentford case studies

### Confidence

**High.** FSI 2026 material is current and explicit on
data-platform-managed tactical archives. Premier League 2025/26 data
confirms set-piece-coach-driven systematisation. Multiple independent
analyst sources converge on the Brentford / Arsenal / Brighton library
pattern.

## Combined implications for FMX-28 recommendation

1. **Genre precedent (Query 1, medium-high confidence) is consistent
   and supports the carve.** Template catalog separate from per-match
   state is universal. FM's separately-saveable set-piece library is
   the strongest direct precedent for the FMX design. No surveyed game
   conflates the two.

2. **DDD answer is decisive (Query 2, high confidence) - and it's the
   FMX-26 / Staff Operations pattern repeated.** Template-vs-instance
   with catalog-as-own-bounded-context is textbook DDD. Vernon's
   Product Catalog vs Ordering is the direct analogue. Match-as-instance
   side, Tactics-as-catalog side, with Reference + Snapshot at
   Tactic-Lock.

3. **Real-world precedent (Query 3, high confidence) mirrors Option
   C.** Modern clubs treat the playbook as club-owned, data-platform
   managed, analyst-curated. Set-piece coaches maintain seasonal
   libraries (15-40 offensive routines) tagged by patterns; per-match
   customisation sits on top. Tactical archives carry across coach
   changes specifically because they're club property, not coach IP.

4. **The five-of-six DDD split criteria approach from FMX-26 / Staff
   Operations applies cleanly here:**
   - Own ubiquitous language ✓ (formation, role, duty, instruction,
     preset, routine, opposition template, game-plan, family/archetype).
   - Own light FSM ✓ (preset lifecycle: saved → active → archived;
     routine lifecycle: drafted → published → retired).
   - Own storage boundary ✓ (presets + routines in own schema; match
     snapshot copies fields at lock-time).
   - Multiple consumers ✓ (Match, Training, Transfer, Manager &
     Legacy, Staff Operations, Watch Party for live tactical commentary).
   - Cross-cutting role ✓ (tactical-identity-signal, role-profile,
     target-role-profile, set-piece-coach-effect cross multiple
     contexts).
   - Co-change counterargument ✗ (tactic library does not always
     change with any single consumer's transaction).

5. **No surveyed game unlocks formations/roles across saves** -
   reinforces GD-0019 §Decided "MVP ships hooks, not the full meta
   system." FMX-28 plans the library structure and the
   tactical-identity signal channel; cross-save unlock mechanics stay
   future-scope.

6. **Set-piece coach effect-readiness** (Staff Operations → Tactics) is
   real and the strongest practical case for the carve. Brentford /
   Arsenal / Brighton set-piece coaches refine routines over seasons -
   a tactic library that owns the routines and consumes
   `SetPieceCoachReadinessUpdated` events from Staff Operations matches
   industry practice exactly.

The combined evidence reinforces **Option C (Tactics as own bounded
context)** as the recommendation. No finding contradicts; the strongest
cite (DDD, Query 2) actively supports it; real-world precedent (Query
3) mirrors the carve.
