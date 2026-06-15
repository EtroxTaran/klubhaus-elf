---
title: "Raw - gameplay calibration simulation precedents (FMX-141)"
status: raw
tags: [research, raw, perplexity, gameplay, calibration, simulation, balance, fmx-141]
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

# Raw - gameplay calibration simulation precedents (FMX-141)

## Research prompt

Perplexity was asked how simulation/management games calibrate non-economy
gameplay systems, covering Football Manager, OOTP, Eastside Hockey Manager,
Paradox grand-strategy games and real-world sports analytics analogues. The
prompt requested match outcomes, event rates, player development, tactics,
AI balance, dynasty/long-run simulation balance and balance-patch methodology.

## Source-quality note

The Perplexity answer was directionally useful but over-claimed several
Football Manager / EHM internals and returned weak citations. This capture is
therefore treated as precedent input, not authoritative evidence. FMX-141 uses
the stronger source-check capture for cited claims and marks Klubhaus Elf-specific
governance as design inference.

## Extracted findings

- Simulation-heavy management games tune against **population-level
  distributions**, not single dramatic outcomes.
- Public OOTP material gives the strongest direct game precedent: league totals
  and modifiers are exposed as tuning surfaces, and historical play can
  auto-adjust league totals modifiers after each season for historical accuracy.
- Paradox-style grand-strategy balancing is a useful analogue for FMX long-run
  worlds: observe hands-off/AI-only runs, log history, then adjust AI weights,
  event weights and guardrail modifiers when long-run worlds drift into
  degenerate outcomes.
- Football Manager is a genre precedent for player trust in rich watched
  matches, training/recruitment/owner surfaces and post-match statistical
  explanations, but public sources do not expose its exact calibration harness.
- Real football analytics gives stronger validation anchors than game-dev
  marketing:
  - score models such as Poisson / Dixon-Coles for result distributions;
  - xG-style shot-quality models for separating process from finishing noise;
  - event-frequency distributions for shots, cards, injuries, possession and
    pressing proxies.
- Practical FMX lesson: use domain-specific slot targets, because match, media,
  transfer pressure, dialogue trust, weather and dynasty drift do not share the
  same evidence source or acceptance horizon.

## Risks extracted

- **Overfitting to seed fixtures:** exact replay tests prove determinism but not
  realism.
- **Generic economy ownership:** if all non-economy magnitudes remain "FMX-52",
  gameplay systems lose clear metrics, harness tiers and approval paths.
- **Opaque realism claims:** public genre sources are often too vague; FMX should
  cite real analytics where possible and label game-precedent inferences.
- **Long-run drift:** worlds can look plausible in short seasons while dynasty,
  ownership, media and transfer pressure flatten after decades.

## Source trail

- Perplexity research pass, 2026-06-13: simulation/management-game calibration
  precedents for non-economy gameplay.
- OOTP manual, "Stats and AI" / league totals modifiers:
  <https://manuals.ootpdevelopments.com/index.php?man=ootp22&page=ootp9-help_game_create_new_game_page.strategy>
- Paradox HOI4 dev diary search result identifying "History Logger" as a tool
  for observing AI and history tuning:
  <https://forum.paradoxplaza.com/forum/threads/hoi4-dev-diary-ai-feature-updates.1332546/page-5>
- Paradox Victoria 3 QA dev diary, balance and QA framing:
  <https://www.paradoxinteractive.com/games/victoria-3/news/victoria-3-dev-diary-62-qa>
- ZenGM sports simulation design essay:
  <https://zengm.com/blog/2019/07/so-you-want-to-write-a-sports-sim-game/>

## Related

- [[../gameplay-calibration-ownership-and-harness-2026-06-13]]
- [[../../50-Game-Design/GD-0043-gameplay-calibration-ownership-and-acceptance-gate]]

