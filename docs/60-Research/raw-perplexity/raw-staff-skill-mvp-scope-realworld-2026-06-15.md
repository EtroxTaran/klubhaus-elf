---
title: "Raw - staff skill MVP scope real-world backroom specialization (FMX-152)"
status: raw
tags: [research, raw, perplexity, staff, skills, backroom, coaching, scouting, medical, fmx-152]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-152
related:
  - [[../staff-skill-mvp-scope-2026-06-15]]
  - [[raw-staff-skill-mvp-scope-source-checks-2026-06-15]]
  - [[../../40-Execution/fmx-152-staff-skill-mvp-scope-decision-queue-2026-06-15]]
  - [[../../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]]
  - [[../../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]]
---

# Raw - staff skill MVP scope real-world backroom specialization (FMX-152)

## Research prompt

Perplexity was asked on 2026-06-15:

> Should staff skills in a football manager MVP be target-only, narrow pipeline
> modifiers, or full visible staff skill-card gameplay? Analyze real-world
> football backroom specialization from 2024-2026: coaching, scouting,
> medical/sports science, set-piece, youth/performance roles. Focus on what
> realistic gameplay abstraction follows from real clubs. Provide 6-10 findings,
> source URLs, and a recommendation with caveats.

## Source-quality note

Perplexity was useful as a discovery pass, but the returned source set mixed
specialist-course pages, videos and social sources. Those citations are
preserved below as raw discovery, not treated as canonical proof. FMX-152 then
source-checked the strongest claims against Sports Interactive's official staff
manual, EA's official FC 26 Career Mode notes, Microsoft/Fowler DDD references,
Sports Data Campus set-piece specialization material and existing FMX staff
research. Those checks are preserved in
[[raw-staff-skill-mvp-scope-source-checks-2026-06-15]].

## Extracted findings

- Modern backrooms are specialized by process: set-piece, youth development,
  scouting/recruitment, sports science/medical, analysis and performance roles.
- Staff impact is usually indirect and pipeline-specific. A set-piece specialist
  shapes set-piece preparation and execution; scouts shape discovery/report
  quality; sports science and medical staff shape load, readiness, injury risk
  and rehabilitation rather than global match buffs.
- Real-world specialization argues against one generic staff rating and against
  completely target-only background modifiers.
- Real-world practice also does not require full visible card gameplay in MVP:
  much staff work is mediated through club processes, reports, training plans
  and match preparation.
- The realistic MVP abstraction is narrow role/pipeline modifiers, preferably
  with coarse visible strengths or explanations rather than a complete staff
  skill-card metagame.
- Youth and development roles should be long-horizon modifiers, not instant
  player boosts.
- Scouting staff should affect information quality, discovery scope, report
  speed and bias/error, not player ability.
- Medical and sports-science staff should affect readiness, risk and recovery
  envelopes, not one-off player attribute spikes.

## Perplexity recommendation surfaced

Perplexity recommended **Option B - Narrow pipeline modifiers with selectively
visible staff strengths**:

- Align staff categories with club departments.
- Give each staff member a small number of domain skills.
- Map each skill to a pipeline stage rather than a global buff.
- Surface tiers/bands instead of full formula detail for MVP.
- Defer synergy trees, collectible-card behavior and deep staff progression.

FMX-152 synthesis accepts this as directionally consistent with existing FMX
GD-0021/ADR-0053, but does not ratify it without Nico.

## Perplexity citations surfaced

- Sports Data Campus MSc in Set Pieces in Football:
  <https://english-programs.sportsdatacampus.com/msc-degree-in-set-pieces-in-football/>
- Sports Management Worldwide football GM/scouting course:
  <https://www.sportsmanagementworldwide.com/courses/football-gm-scouting>
- The Scouting Academy:
  <https://scoutingacademy.com>
- USA Football education/training:
  <https://usafootball.com/education-and-training>
- YouTube / practitioner videos:
  <https://www.youtube.com/watch?v=sj19JKQz1T0>,
  <https://www.youtube.com/watch?v=asDWXXVaKxk>
- Social sources returned by Perplexity and treated as weak discovery only:
  <https://www.facebook.com/groups/2603635568/posts/10164247244715569/>,
  <https://www.instagram.com/reel/DWg4qg0jlPH/>,
  <https://www.tiktok.com/@fit_4_football/video/7286932983695592736>

## Related

- [[../staff-skill-mvp-scope-2026-06-15]]
- [[raw-staff-skill-mvp-scope-source-checks-2026-06-15]]
- [[../../40-Execution/fmx-152-staff-skill-mvp-scope-decision-queue-2026-06-15]]
