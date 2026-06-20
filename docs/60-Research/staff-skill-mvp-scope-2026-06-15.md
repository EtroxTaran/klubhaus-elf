---
title: "Staff skill MVP scope packet (FMX-152)"
status: current
tags: [research, synthesis, staff, skills, player-development, backroom, game-precedent, ddd, fmx-152]
context: [people-persona-skills, staff-operations]
created: 2026-06-15
updated: 2026-06-16
type: research
binding: false
linear: FMX-152
related:
  - [[raw-perplexity/raw-staff-skill-mvp-scope-realworld-2026-06-15]]
  - [[raw-perplexity/raw-staff-skill-mvp-scope-games-2026-06-15]]
  - [[raw-perplexity/raw-staff-skill-mvp-scope-ddd-2026-06-15]]
  - [[raw-perplexity/raw-staff-skill-mvp-scope-source-checks-2026-06-15]]
  - [[../40-Execution/fmx-152-staff-skill-mvp-scope-decision-queue-2026-06-15]]
  - [[../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]]
  - [[../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]]
  - [[../20-Features/feature-eos-player-skills-and-people-context]]
  - [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]]
---

# Staff skill MVP scope packet (FMX-152)

## Scope

FMX-152 resolves the now-closed GD-0021 question: are staff skills target-only,
narrow MVP pipeline modifiers, or full visible staff skill-card gameplay?

This packet is intentionally non-binding research. It preserves the
Perplexity-first research chain, source checks, recommendation and Nico's
accepted D1-D4 outcome. The binding gameplay rule is promoted in GD-0021.

`raw Perplexity -> source checks -> this synthesis -> Nico D1-D4 accepted -> GD-0021 promotion`

## Accepted recommendation

Nico accepted **D1-D4 = B/A/A/A** on 2026-06-16.

Staff skills should become MVP-active only through Staff Operations pipeline
quality read models consumed by Training, Scouting, Medical and Match-Day. The
MVP can show player-facing bands/reasons such as "excellent set-piece coaching"
or "weak rehab coverage", but should not yet introduce full staff skill-card
gameplay, a visible staff skill catalog, staff synergy trees or staff RPG
progression.

Why:

- Real football backrooms are specialized by process: coaching, set pieces,
  scouting, sports science, medical, analysis and youth development.
- Sports Interactive's Football Manager manual models staff attributes as
  role-specific influences on coaching, advice, training, youth, scouting and
  medical outputs.
- DDD/CQRS guidance supports narrow context contracts and richer read models,
  not a universal staff-card schema shared by every context.
- Existing FMX ADR-0052/ADR-0053 already has the right seam:
  People supplies `StaffSkillProfileSnapshot`; Staff Operations owns role and
  pipeline translation; consumers apply their own rules.

## Source-backed findings

### F1 - Comparable games make staff skills role-specific, not generic

Sports Interactive's official staff manual documents non-player staff attributes
on a 1-20 scale. Coaching attributes map to specific football work such as
attacking, defending, fitness, goalkeeper coaching, set pieces, tactical,
technical and working-with-youngsters outputs. Medical attributes affect fitness
tests, transfer medicals, injury proneness, fitness level and injury risk.
Judging ability/potential affects scouting reports and player evaluations.

Implication: a serious football-manager game should not make staff skills a
single generic buff. It should also avoid letting staff skills directly override
player truth; the genre pattern is mediated influence through training,
scouting, medical and advice/report surfaces.

### F2 - Real-world specialization points at process/pipeline effects

The source-checked real-world evidence is strongest for specialization, not for
exact effect sizes. Sports Data Campus frames set pieces as a dedicated
coaching/analysis/execution discipline with real footage/data projects, KPIs,
opponent reports and playbooks. Existing FMX staff-backroom research already
captured the modern club pattern of distinct football-operations, coaching,
scouting, performance and medical roles.

Implication: set-piece, youth, scouting and sports-science skills should affect
their own pipelines. They should not become global morale, form or match-result
bonuses.

### F3 - Full staff cards are a product/UI option, not a required domain contract

Perplexity's game-precedent pass leaned toward a visible staff-card plus
pipeline-modifier hybrid. Source checks support the visible-explanation part,
but not the need to ratify full card gameplay in MVP. EA FC 26's Career Mode
notes show mainstream career mode can compress staff/coach impact into
notifications, tactical-vision familiarity, training/sharpness and scouting/youth
quality-of-life surfaces while using richer progression for player archetypes.

Implication: FMX can expose staff strengths in bands/explanations now and keep
full skill cards as an intentional later feature.

### F4 - Bounded contexts should not share one staff-card schema

Microsoft's domain-analysis guidance supports services/contexts organized around
business capabilities with loose coupling and high cohesion. Fowler's bounded
context note emphasizes that different contexts can model shared concepts
differently and map between them.

Implication: People should not force Training, Scouting, Medical and Match-Day
to speak a single card vocabulary. People can own capability truth; Staff
Operations and consumer contexts translate it into their own read models and
rules.

### F5 - CQRS supports visible staff cards later without making them write truth

Microsoft's CQRS guidance separates commands/write models from query/read
models. Read models can be projections optimized for presentation, while write
models keep validation, consistency and business rules.

Implication: if FMX later wants full staff skill cards, they should be a
read-model/UI projection over People + Staff Operations + consumer-context
outputs. They should not become the cross-context integration contract.

## Option matrix

| Option | Meaning | Assessment |
|---|---|---|
| A - Target-only | Staff skills stay documented for future design only; staff has lifecycle, roles, coverage and specializations but no active skill-profile mechanics. | Safest for scope and balance, but leaves staff skills mostly cosmetic and fails to close the GD-0021 "staff matters mechanically" gap. |
| **B - Narrow pipeline modifiers** | Staff skills affect only Staff Operations pipeline-quality/modifier read models consumed by Training, Scouting, Medical and Match-Day. | **Accepted.** Smallest active gameplay slice that matches real-world specialization, FM genre precedent and DDD boundaries. |
| C - Full staff skill cards | Staff profiles are visible and mechanically active across systems with a staff skill catalog, UI and cross-system effects. | Richest fantasy, but too broad for MVP without catalog, UI, balance, replay and staff-progression decisions. |

## Accepted contract shape

Planning names only, not approved public APIs:

- People owns `StaffSkillProfileSnapshot`.
- Staff Operations consumes the People snapshot plus role assignment and extends
  the existing `PipelineCoverageSnapshot` vocabulary with staff-skill-aware
  modifier/explanation bands.
- Training, Scouting, Medical and Match-Day consume the staff-pipeline snapshot
  and apply their own bounded formulas.
- UI may show banded reasons:
  - `set_piece_coaching: strong`
  - `youth_development_support: average`
  - `rehab_coverage: weak`
  - `scouting_report_reliability: strong`
- No final numeric weights, thresholds, skill names, caps, card layout or
  progression rates are approved by this packet.

## Decisions accepted by Nico

See
[[../40-Execution/fmx-152-staff-skill-mvp-scope-decision-queue-2026-06-15]]
for the full options, recommendations and accepted record.

Short version:

- D1: Staff-skill MVP scope - accepted B.
- D2: GDDR promotion shape - accepted A, update GD-0021 rather than creating a
  new GDDR.
- D3: MVP visibility - accepted A, banded pipeline explanations rather than
  full cards.
- D4: Contract boundary - accepted A, People profile truth -> Staff Operations
  pipeline projection -> consumer-context application.

## Sources

- Raw Perplexity real-world capture:
  [[raw-perplexity/raw-staff-skill-mvp-scope-realworld-2026-06-15]]
- Raw Perplexity game-precedent capture:
  [[raw-perplexity/raw-staff-skill-mvp-scope-games-2026-06-15]]
- Raw Perplexity DDD/contracts capture:
  [[raw-perplexity/raw-staff-skill-mvp-scope-ddd-2026-06-15]]
- Source checks:
  [[raw-perplexity/raw-staff-skill-mvp-scope-source-checks-2026-06-15]]
- Sports Interactive manual - Staff:
  <https://community.sports-interactive.com/sigames-manual/football-manager-2024-touch-and-console/staff-r4982/>
- EA SPORTS FC 26 Career Mode Deep Dive:
  <https://www.ea.com/en/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-career-mode-deep-dive>
- Sports Data Campus MSc in Set Pieces in Football:
  <https://english-programs.sportsdatacampus.com/msc-degree-in-set-pieces-in-football/>
- Microsoft Learn - domain analysis:
  <https://learn.microsoft.com/en-us/azure/architecture/microservices/model/domain-analysis>
- Microsoft Learn - CQRS:
  <https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs>
- Martin Fowler - Bounded Context:
  <https://martinfowler.com/bliki/BoundedContext.html>
- Existing FMX staff-backroom synthesis:
  [[staff-backroom-bounded-context-2026-05-28]]

## Related

- [[../40-Execution/fmx-152-staff-skill-mvp-scope-decision-queue-2026-06-15]]
- [[../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]]
- [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
- [[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]]
