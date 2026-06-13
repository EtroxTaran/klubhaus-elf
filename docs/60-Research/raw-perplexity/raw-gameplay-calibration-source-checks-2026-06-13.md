---
title: "Raw - gameplay calibration source checks (FMX-141)"
status: raw
tags: [research, raw, perplexity, web, source-check, gameplay, calibration, fmx-141]
created: 2026-06-13
updated: 2026-06-13
type: research
binding: false
linear: FMX-141
related:
  - [[../gameplay-calibration-ownership-and-harness-2026-06-13]]
  - [[../../50-Game-Design/GD-0043-gameplay-calibration-ownership-and-acceptance-gate]]
  - [[../../30-Implementation/gameplay-calibration-and-soak-test-runbook]]
---

# Raw - gameplay calibration source checks (FMX-141)

## Research prompt

Perplexity was asked to source-check the proposed FMX-141 decisions:
gameplay-wide calibration ownership, GDDR-level slots, deterministic replay plus
multi-seed Monte Carlo acceptance, separate domain slots, and human approval for
taxonomy / harness tiers / metrics / rebaseline authority / realism-vs-fun
philosophy.

Targeted web checks were then run because Perplexity's first and third answers
contained weak or irrelevant citations.

## Support matrix

| Proposed FMX-141 decision | Support level | Evidence |
|---|---|---|
| Calibration cannot stay economy-only | Inference, strongly project-specific | General game/simulation practice supports modular tuning; no public source maps to FMX-52. |
| Every GDDR needs a calibration slot with metrics/harness/rebaseline | Inference supported by QA/simulation governance | Simulation V&V and game modifier precedents support explicit targets and baselines. |
| Deterministic replay plus multi-seed acceptance | Strong | Seed replay supports reproducibility; Monte Carlo/distribution checks support realism and avoids single-seed overfitting. |
| Specific FMX slot taxonomy | Product inference | Public sources support many surfaces, but not the exact FMX list. Requires Nico approval. |
| Human approval for slot taxonomy and rebaseline authority | Project governance | Required by FMX collaboration rules; external sources support reviewed model governance in principle. |

## Verified source trail

- OOTP manual: league totals modifiers and historical auto-adjustment are direct
  evidence that sports sims expose calibration targets/modifiers:
  <https://manuals.ootpdevelopments.com/index.php?man=ootp22&page=ootp9-help_game_create_new_game_page.strategy>
- OOTP forum explanation of league totals/modifiers as rates for average
  pitcher/hitter matchups:
  <https://forums.ootpdevelopments.com/showthread.php?t=169727>
- Paradox HOI4 dev diary result: "History Logger" used to observe AI/history
  tuning, useful analogue for FMX long-run hands-off simulation:
  <https://forum.paradoxplaza.com/forum/threads/hoi4-dev-diary-ai-feature-updates.1332546/page-5>
- Paradox Victoria 3 QA diary: balance and QA timing in a complex simulation:
  <https://www.paradoxinteractive.com/games/victoria-3/news/victoria-3-dev-diary-62-qa>
- Sports simulation probability/distribution model example:
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC10929675/>
- xG model evidence:
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC11524524/>
- Hudl xG explainer:
  <https://www.hudl.com/blog/expected-goals-xg-explained>
- Dixon-Coles football score modelling DOI:
  <https://doi.org/10.1111/1467-9876.00065>
- ZenGM sports simulation design essay:
  <https://zengm.com/blog/2019/07/so-you-want-to-write-a-sports-sim-game/>

## Caveats for synthesis

- Do not state that Football Manager publicly documents its calibration harness.
  It is a genre precedent, not a source for exact FMX governance.
- Do not state that Paradox or OOTP use FMX-style GDDR slots. They are analogues
  for target modifiers, observation runs and long-run balance workflows.
- Keep the slot taxonomy and rebaseline authority as `draft` until Nico approves.

