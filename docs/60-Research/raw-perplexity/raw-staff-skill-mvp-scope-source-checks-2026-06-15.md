---
title: "Raw - staff skill MVP scope source checks (FMX-152)"
status: raw
tags: [research, raw, source-check, staff, skills, football-manager, ea-fc, ddd, cqrs, fmx-152]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-152
related:
  - [[../staff-skill-mvp-scope-2026-06-15]]
  - [[raw-staff-skill-mvp-scope-realworld-2026-06-15]]
  - [[raw-staff-skill-mvp-scope-games-2026-06-15]]
  - [[raw-staff-skill-mvp-scope-ddd-2026-06-15]]
  - [[../../40-Execution/fmx-152-staff-skill-mvp-scope-decision-queue-2026-06-15]]
---

# Raw - staff skill MVP scope source checks (FMX-152)

Checked on 2026-06-15.

## Game and football-domain checks

| Source | Observed fact | FMX-152 use |
|---|---|---|
| Sports Interactive manual - Football Manager 2024 staff page | Staff overview is organized by backroom departments; staff attributes use a 1-20 scale for non-players. Coaching attributes such as attacking, defending, fitness, goalkeeper coaching, mental, set pieces, tactical, technical and working with youngsters each affect specific advice, training, preparation, youth or player-development outputs. | Strong support for role-specific staff attributes and pipeline-level effects. |
| Sports Interactive manual - medical/knowledge attributes | Physiotherapy is used for fitness tests, transfer medicals and injury-proneness assessment; sports science manages fitness level and injury risk; judging ability/potential affects scouting reports and evaluations. | Strong support that staff skills should affect medical/readiness/scouting pipelines, not global buffs. |
| Sports Data Campus MSc in Set Pieces in Football | The program frames set pieces as a specialist coaching/analysis/execution field, with elite staff, real footage/data projects, KPIs, opponent reports and playbooks. | Medium support for real-world staff specialization and set-piece pipeline abstraction. |
| EA SPORTS FC 26 Career Mode official Pitch Notes | FC 26 adds staff-market refresh notifications, head-coach tactical-vision familiarity boosts, training/sharpness/energy management, improved scouting/youth systems and player archetypes. | Useful contrast: mainstream career mode can compress staff influence, but it still uses staff/coach quality and progression systems. Not evidence for full staff cards. |
| Existing FMX staff-backroom research | [[../staff-backroom-bounded-context-2026-05-28]] already places staff lifecycle, role assignment, pipeline coverage and wage events in Staff Operations, with People supplying identity/persona/skills. | Strong internal precedent for Option B's People -> Staff Operations -> consumer-context flow. |

## Architecture checks

| Source | Observed fact | FMX-152 use |
|---|---|---|
| Microsoft Learn domain analysis | Services should be designed around business capabilities with loose coupling and high cohesion; DDD uses bounded contexts and each bounded context contains a model for a specific subdomain. | Supports not sharing a universal staff-card domain model across People, Staff Operations and consumers. |
| Martin Fowler bounded-context reference | DDD handles large models by dividing them into explicit bounded contexts; different contexts may have different models of shared concepts and map between them. | Supports context-local interpretation of staff skill facts. |
| Microsoft Learn CQRS pattern | Queries should not alter data; read models can be separated from write models; read models can be DTOs/projections optimized for presentation while write models keep validation and business logic. | Supports visible staff cards/bands as read models, with narrow write contracts and pipeline modifiers. |

## Source URLs

- Sports Interactive manual - Staff:
  <https://community.sports-interactive.com/sigames-manual/football-manager-2024-touch-and-console/staff-r4982/>
- Sports Data Campus MSc in Set Pieces in Football:
  <https://english-programs.sportsdatacampus.com/msc-degree-in-set-pieces-in-football/>
- EA SPORTS FC 26 Career Mode Deep Dive:
  <https://www.ea.com/en/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-career-mode-deep-dive>
- Microsoft Learn - Use domain analysis to model microservices:
  <https://learn.microsoft.com/en-us/azure/architecture/microservices/model/domain-analysis>
- Microsoft Learn - CQRS pattern:
  <https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs>
- Martin Fowler - Bounded Context:
  <https://martinfowler.com/bliki/BoundedContext.html>
- FMX internal source:
  [[../staff-backroom-bounded-context-2026-05-28]]

## Decision supported

Option B is the best current recommendation:

- Keep `StaffSkillProfileSnapshot` as People-owned capability truth.
- Let Staff Operations translate assigned staff profiles into explicit pipeline
  quality/modifier snapshots.
- Let Training, Scouting, Medical and Match-Day consume those pipeline snapshots
  through their own context rules.
- Allow visible bands/explanations in MVP, but avoid full visible staff
  skill-card gameplay until a separate catalog/UI/balance decision accepts it.

## Related

- [[../staff-skill-mvp-scope-2026-06-15]]
- [[../../40-Execution/fmx-152-staff-skill-mvp-scope-decision-queue-2026-06-15]]
