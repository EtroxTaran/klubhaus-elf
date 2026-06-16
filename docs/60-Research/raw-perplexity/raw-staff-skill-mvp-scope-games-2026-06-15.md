---
title: "Raw - staff skill MVP scope game precedents (FMX-152)"
status: raw
tags: [research, raw, perplexity, staff, skills, game-precedent, football-manager, ea-fc, fmx-152]
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
---

# Raw - staff skill MVP scope game precedents (FMX-152)

## Research prompt

Perplexity was asked on 2026-06-15:

> For comparable football/sports management games, how do games model staff
> skills or role-specific staff influence? Compare Football Manager, EA SPORTS FC
> career mode/player archetypes if relevant, Out of the Park Baseball/Eastside
> Hockey Manager if sourceable, and any sports manager genre lessons. Evaluate
> target-only vs narrow pipeline modifiers vs full visible staff skill cards for
> MVP. Provide findings, source URLs, recommendation, and caveats about source
> strength.

## Source-quality note

Perplexity correctly identified Football Manager as the strongest genre
precedent, but much of its returned evidence used community guides and videos.
Out of the Park Baseball and Eastside Hockey Manager were described from genre
knowledge without sourceable URLs in the response, so they are not promoted as
source-backed findings here. The synthesis relies on official Sports
Interactive manual lines and official EA FC 26 Career Mode notes for stronger
game-source checks.

## Extracted findings

- Football Manager is the clearest precedent for role-specific staff
  attributes: coaching, mental, medical, scouting/knowledge and negotiation
  attributes each influence different outputs.
- Football Manager surfaces staff as inspectable staff profiles, but the
  gameplay value comes through role-specific effects such as training advice,
  player development, scouting report reliability, injury/risk handling and
  staff responsibilities.
- The genre expectation from Football Manager-like games is not pure target-only
  hidden staff. Staff should be understandable as persistent people with
  strengths and weaknesses.
- EA SPORTS FC Career Mode is a useful low-cognitive-load contrast: it leans on
  simplified career systems, staff-market reminders, tactical-vision coach
  familiarity, training/sharpness, player archetypes and youth/scouting
  quality-of-life changes, not a deep staff-card simulation.
- Perplexity initially recommended a blend of **visible staff cards + pipeline
  modifiers**. FMX-152 narrows this for MVP: Option B can expose staff strengths
  as bands/explanations while reserving full staff skill-card gameplay for
  Option C or post-MVP.
- Full visible staff cards are genre-rich but require catalog, UI, balance,
  formulas, staff progression and long-save tuning that exceed the current
  docs-vault-only decision.

## Perplexity recommendation surfaced

Perplexity recommended a lean **B/C hybrid**:

- Give staff a small visible profile with 3-6 role-relevant attributes.
- Connect each attribute to one or two pipeline hooks.
- Use simple summary outputs such as training/scouting/medical quality bands.
- Keep staff impact incremental and explainable.
- Defer staff long-term PA/CA, deep personality and staff-card metagame depth.

FMX-152 synthesis converts this into the repo's existing GD-0021 choice set:
recommend **B - Narrow pipeline modifiers** with visible explanation bands in
MVP, and defer **C - Full staff skill cards** unless Nico explicitly wants that
larger slice.

## Perplexity citations surfaced

- FM Scout staff attributes/training guide:
  <https://www.fmscout.com/a-staff-attributes-and-training-ratings-explained.html>
- Andrew Gaffney Football Manager staff guide:
  <https://andrewgaffney.wordpress.com/2020/05/13/the-idiots-guide-to-football-manager-2020-choosing-the-right-staff-assigning-them-the-correct-roles-and-aiding-your-teams-development/>
- Football Manager staff video tests/guides:
  <https://www.youtube.com/watch?v=iv-dUGr3MVk>,
  <https://www.youtube.com/watch?v=Zn_mVcpGxRU>
- FMM Vibe coaching staff guide:
  <https://fmmvibe.com/forums/topic/49935-coaches-a-guide-to-coaching-staff/>
- Weak/community-only citations returned and not promoted as source-backed:
  <https://www.reddit.com/r/footballmanagergames/comments/lumxx5/do_staff_attributes_improve_over_time/>,
  <https://fm-base.co.uk/threads/backroom-staff-and-key-attributes.102683/>,
  <https://steamcommunity.com/app/2252570/discussions/0/5715692378864746688/>

## Related

- [[../staff-skill-mvp-scope-2026-06-15]]
- [[raw-staff-skill-mvp-scope-source-checks-2026-06-15]]
- [[../../40-Execution/fmx-152-staff-skill-mvp-scope-decision-queue-2026-06-15]]
