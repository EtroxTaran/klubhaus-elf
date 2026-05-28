---
title: Handoff FMX-29 Youth Academy Ownership
status: wrapped
tags: [meta, execution, handoff, fmx-29]
created: 2026-05-28
updated: 2026-05-28
type: handoff
binding: false
related:
  - [[../../60-Research/youth-academy-bounded-context-2026-05-28]]
  - [[../../60-Research/raw-perplexity/raw-youth-academy-2026-05-28]]
  - [[../../10-Architecture/09-Decisions/ADR-0060-youth-academy-context]]
  - [[../../10-Architecture/state-machines/youth-academy]]
  - [[../../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]]
  - [[../../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
  - [[../../50-Game-Design/GD-0007-youth]]
  - [[../../50-Game-Design/youth-academy-and-development]]
  - [[../../30-Implementation/domain-research-workflow]]
---

# Handoff: FMX-29 Youth Academy Ownership (2026-05-28)

## Linear

- Issue: FMX-29
- Parent: FMX-24
- Unblocks: 16-context map's unowned annual academy lifecycle; ADR-0053
  Staff Operations + ADR-0018 Systemic Events references to academy
  resolve cleanly; GD-0007 + youth-academy-and-development binding
  gameplay surface gets a named implementation owner; Manager & Legacy
  (ADR-0051) gets the youth-pipeline-quality signal channel for
  GD-0019 archetype hook aggregation.

## Done this session

- Followed the six-phase
  [[../../30-Implementation/domain-research-workflow]] (binding via
  PR #83).
- Identified the gap: the bounded-context map (16 contexts post-FMX-40)
  names **no Youth Academy owner**. GD-0007 (`binding: true`) and
  youth-academy-and-development (`binding: true`) jointly specify the
  pipeline + intake event + promotion gate + investment slider as
  gameplay-binding requirements. ADR-0053 Staff Operations owns Head
  of Youth + U-team-coach roles as quality multipliers (per §Decision
  "Staff Operations does not own player contracts, wages or transfers");
  ADR-0018 Systemic Events splits weekly development across Training
  (signals) + Squad & Player (persistence) and explicitly does not
  carve out academy. The intake-event FSM + cohort lifecycle +
  investment ledger + home-grown share signal + promotion-gate
  enforcement have no named home.
- Ran three focused Perplexity queries:
  1. Genre - football management sim academy lifecycle (FM 23-26,
     EA FC CM 24-26, OOTP 24-26, FIFA Manager legacy, Anstoss series).
     **Medium-high confidence.** Universal pattern: every major sim
     treats academy as structurally separate persistent area with
     distinct UI + staff + budget + lifecycle. FM is the closest direct
     precedent (annual March intake, HoYD + Youth Recruitment + Junior
     Coaching + Facilities multi-input quality model, Development
     Centre aggregate area).
  2. DDD - cohort lifecycle with annual cadence as own bounded context
     vs sub-aggregate (Vaughn Vernon IDDD, Eric Evans Blue Book, Martin
     Fowler bliki, Context Mapper SummerSoC, Microsoft Learn DDD,
     Schimak / Rücker process-manager). **High confidence.** Six
     canonical criteria for own-BC: own ubiquitous language, own FSM,
     own storage, multiple consumers + cross-cutting role, low co-
     change, organisational alignment. Real-world DDD analogues:
     university admissions cohort + clinical-trial subject cohort +
     apprenticeship lifecycle = textbook own-BC. HR talent pipeline =
     borderline. Pattern: Vernon long-running-process + Process
     Manager / Saga + Snapshot (cohort → senior roster).
  3. Real-world - European football academy operations 2023-2026
     (Premier League EPPP Categories 1-4 + DFB-NLZ Lizenzhandbuch +
     UEFA Home-Grown Player + Academy Director organisational chain +
     La Masia + De Toekomst + City Football Academy + Hohenbuschei +
     Liefering + Brexit-GBE + FIFA Article 19 + NCAA NIL).
     **Medium-high confidence.** Academy Director reports to Sporting
     Director, **not** Head Coach. Multi-year EPPP audit cycle.
     Categories 1-4 (England) and 1-3 (Germany) encode tier-specific
     coaching hours, facilities, education provision, productivity
     scores. UEFA HGP rule (8/25 with 4 club-trained 15-21) creates
     economic shadow cost incentivising academy investment.
- Archived raw findings to
  [[../../60-Research/raw-perplexity/raw-youth-academy-2026-05-28]].
- Synthesised
  [[../../60-Research/youth-academy-bounded-context-2026-05-28]] with
  six numbered findings F1-F6 (each with source + confidence + key
  takeaways).
- Authored new draft ADR
  [[../../10-Architecture/09-Decisions/ADR-0060-youth-academy-context]]:
  `status: proposed`, `binding: false`. Four options (A Squad &
  Player sub-aggregate / B Training sub-aggregate / C own context /
  D Staff Operations sub-aggregate) + §Recommendation = Option C with
  three converging justifications (DDD canonical criteria + real-world
  organisational + regulatory precedent + genre precedent). §Public
  contract direction (commands / events / read models / consumed
  facts). §Determinism and storage rules (per-save schema per
  ADR-0027 + save-creation-only legacy seeds per ADR-0051 + community-
  overlay semantic validation per Vernon when ADR-0059 ratifies +
  `IntakeRng(saveId, clubId, year)` sub-label of `WorldRng` per
  ADR-0018 §3). §Map patch proposal as five fenced ```diff``` blocks
  (order-tolerant - applies as 17th or 18th depending on ADR-0059
  ratification order).
- Authored new state-machine note
  [[../../10-Architecture/state-machines/youth-academy]]:
  `status: draft`, `binding: false`. Four coordinated FSMs:
  `AcademySeason` (planning → intake-active → review → promotion-
  window → archived), `YouthCohort` (scouted → invited → intake-
  event → review-decided → published → archived), `CohortMember`
  (generated → opinion-pending → opinion-received → decided-* →
  published-*), `AcademyInvestmentLevel` (pending-budget → approved
  → effective → superseded). State-machines README index updated
  with new row (proposed).
- ADR number is **ADR-0060** (next available after ADR-0059 Community
  Overlay Pipeline; deliberately avoids ADR-0058 club-economy-
  commercial-impact-boundary which codex took during the wave).
- **`risk:legal` label set** - IP-clean rule terminology hardline
  applies: no real EPPP / NLZ / UEFA naming inside gameplay-facing
  surfaces; abstract category-tier model encodes the pattern. Same
  hardline as ADR-0056 (Regulations) and ADR-0059 (Community Overlay
  Pipeline).
- Updated [[../../00-Index/Decision-Log]] with new ADR-0060 row
  (`proposed`) and added the synthesis under "Current Binding Non-ADR
  Inputs".
- Added FMX-29 anchor block to
  [[../../00-Index/Current-State]] above the FMX-33 / FMX-34 / FMX-40
  block.

## Open / next step

**Nico Accept Option C (recommended), choose A / B / D, or Defer
call on ADR-0060 is the next gate.**

- *Accept Option C (recommended)*: open follow-up apply-PR analogous
  to FMX-35 / FMX-36 / FMX-37 / FMX-39 / FMX-40. Flip ADR-0060
  `status: proposed` → `accepted` and `binding: false` → `true`.
  Apply §Map patch (five parts) to `bounded-context-map.md` in the
  same PR. Update Decision-Log status column. Update Architecture-Map
  / 05-Building-Blocks / Current-State "16 → 17 (or 18 if ADR-0059
  ratified first) bounded contexts" prose. Flip state-machine note to
  `binding: true`. Optional editorial update to
  youth-academy-and-development.md cross-reference (mark "owned by
  ADR-0060 Youth Academy").
- *Choose Option A (Squad & Player sub-aggregate)*: edit ADR-0060;
  synthesis F4 + F5 + F2 are the load-bearing arguments against (DDD
  cadence + ubiquitous-language mismatch; real-world Academy Director
  separation; genre Development-Centre / Youth-Academy-screen
  precedent).
- *Choose Option B (Training sub-aggregate)*: edit ADR-0060;
  synthesis names "Training's tick is weekly; academy's tick is
  annual" + "ADR-0018 Systemic Events explicitly maps weekly
  development to Training but does not assign academy" + "cadence-
  mismatch is Vernon's anti-pattern" as load-bearing arguments
  against.
- *Choose Option D (Staff Operations sub-aggregate)*: edit ADR-0060;
  synthesis names "ratified ADR-0053 §Decision explicitly excludes
  player ownership" + "real-world Academy Director reports to
  Sporting Director, organisationally separate from Staff Operations
  HR-ops layer" as load-bearing arguments against. This is the
  closest competitor to Option C and merits explicit naming if
  rejected.
- *Defer*: leave ADR-0060 `proposed`; document deferral on FMX-29.
  Note: GD-0007 + youth-academy-and-development binding gameplay
  requirements remain implementation-unblocked but BC-unowned. ADR-
  0018 + ADR-0053 references to academy stay implicit. Manager &
  Legacy youth-pipeline-quality signal channel stays unspecified.

The ten future-scope items in §Future-scope notes (loan environment
Process Manager, EPPP-analogue category audit cycle, reserve-team
B-team-in-real-league pattern, Brexit + GBE + FIFA Article 19
regulatory shifts, NIL / NCAA college-pipeline analogue, Wonderkid
emergent tagging, intake regional yield community overrides, per-
region "youth nations" dynamic drift, manager-archetype "youth-
pipeline-yield" signal weight calibration, cohort-history retention
policy) remain `future-scope` regardless of the ratification call.

## Blockers

- No implementation authority for Youth Academy until ADR-0060 is
  `accepted` and `binding: true`.
- GD-0007 binding gameplay (intake event, promotion gate, investment
  slider) remains implementation-unblocked but BC-unowned.
- youth-academy-and-development binding gameplay (pipeline, weekly
  dev formula, loan system) shares the same blocker.
- Manager & Legacy archetype-hook aggregation per GD-0019 cannot
  emit youth-pipeline-quality signals until contract owner is named.
- FMX-31 (Media / Press) and FMX-32 (Club Management audit) do not
  have direct dependencies on FMX-29 / ADR-0060.
- ADR-0059 (Community Overlay Pipeline, proposed) and ADR-0060 are
  parallel; the §Map patch in ADR-0060 is order-tolerant. Whichever
  ratifies second renumbers the prose accordingly.

## Changed vault paths

- `docs/60-Research/raw-perplexity/raw-youth-academy-2026-05-28.md` *(new)*
- `docs/60-Research/youth-academy-bounded-context-2026-05-28.md` *(new)*
- `docs/10-Architecture/09-Decisions/ADR-0060-youth-academy-context.md` *(new)*
- `docs/10-Architecture/state-machines/youth-academy.md` *(new)*
- `docs/10-Architecture/state-machines/README.md` *(index row added)*
- `docs/00-Index/Decision-Log.md` *(ADR-0060 row + Current Binding Non-ADR Inputs entry)*
- `docs/00-Index/Current-State.md` *(FMX-29 anchor block)*
- `docs/40-Execution/session-handoffs/2026-05-28-fmx-29-youth-academy.md` *(this file, new)*
- `docs/40-Execution/session-handoffs/README.md` *(new entry)*

## Needs promotion

- ADR-0060 can move to `accepted` / `binding: true` only after Nico
  accepts Option C (or chooses A / B / D).
- [[../../10-Architecture/state-machines/youth-academy]] can move to
  `binding: true` together with ADR-0060 acceptance.
- [[../../60-Research/youth-academy-bounded-context-2026-05-28]]
  stays `draft` as a synthesis; not a promotion gate.
- `bounded-context-map.md` patch applies only on ADR-0060 acceptance.
- youth-academy-and-development.md may optionally be annotated with
  "owned by ADR-0060 Youth Academy" in the apply-PR; not status-
  changing.

## Ratify-ask

**Accept Option C (recommended), choose Option A / B / D, or Defer?**

§Recommendation in ADR-0060 names Option C (own bounded context) as
the call. Synthesis F4 + F5 + F2 are the load-bearing arguments:

- **F4 (strongest in wave)**: six-of-six DDD split criteria fire
  (equal to FMX-33 wave high; stronger than FMX-26 / 28 / 30 / 34
  where five-of-six fired). Own ubiquitous language (intake / cohort
  / promotion-gate / EPPP-category), own FSM (annual cadence with
  four sub-FSMs), own storage (cohort + intake + investment +
  productivity + home-grown counters), multiple consumers (Squad &
  Player + Training + Club Management + Manager & Legacy +
  Notification + Regulations + Fan Ecology + bidirectional with
  Staff Operations + Scouting), cross-cutting role (home-grown =
  regulatory + board + fan + roguelite), low co-change. Vernon's
  canonical long-running-process + Process Manager / Saga + Snapshot
  pattern is the direct DDD analogue. Real-world DDD textbook
  precedents (university admissions, clinical-trial cohort,
  apprenticeship) all separate cohort lifecycle.
- **F5 (real-world)**: Premier League EPPP Categories 1-4 + DFB-NLZ +
  UEFA HGP rule + Academy Director reporting to Sporting Director
  all treat academy as separate audited organisational unit with own
  budget, own KPIs, own multi-year audit cycle, own director.
  La Masia + De Toekomst + City Football Academy + Hohenbuschei +
  Liefering all structurally separate.
- **F2 (genre)**: all five major football management sims (FM, EA FC
  CM, OOTP, FIFA Manager, Anstoss) treat the academy as structurally
  separate persistent area with distinct UI + staff + budget +
  lifecycle. Player-mental-model agreement is universal.

`risk:legal` label set. IP-clean rule terminology contained in one
bounded context per GD-0015 + ADR-0007.
