---
title: "Raw - DriftConsumerPolicyRef comparable-game precedent research"
status: raw
tags: [research, raw, perplexity, football-manager, sports-sim, rulesets, finance, hidden-attributes, world-drift, fmx-139]
created: 2026-06-17
updated: 2026-06-17
type: research
binding: false
linear: FMX-139
related:
  - [[../drift-consumer-policy-ref-contract-2026-06-17]]
  - [[raw-drift-consumer-policy-ref-source-checks-2026-06-17]]
  - [[../../40-Execution/fmx-139-drift-consumer-policy-ref-decision-queue-2026-06-17]]
  - [[../../10-Architecture/09-Decisions/ADR-0071-ai-world-simulation-context-and-drift-contract]]
---

# Raw - DriftConsumerPolicyRef comparable-game precedent research

## Prompt

Research comparable game precedents for a football manager or long-running
sports/grand-strategy sim event schema: Football Manager, OOTP, Paradox-style
sims, or similar. Focus on how games expose rule sets, financial restrictions,
player-facing explanations, hidden attributes/long-save drift, and versioned
data/rule packs.

## Perplexity Capture

Perplexity's game pass supported policy-centric rule exposure and event
explanations, but many returned sources were community or general web pages.
The official Sports Interactive manual pages were source-checked separately.

Raw findings:

- Comparable sports/strategy sims separate rule sets, financial systems, hidden
  model data and versioned data/rule packs.
- Competition rules, transfer rules, squad registration and financial constraints
  are normally exposed as player-facing rule screens, budget screens, warning
  messages and news items rather than raw internal ids.
- Hidden attributes and long-save drift are normally surfaced indirectly through
  scouting, reports, performance patterns, board/news messages and changing
  world conditions.
- Event schemas should reference policy ids for traceability, but player-facing
  views should resolve those refs into localized labels, visible thresholds,
  warnings and "why" explanations.
- A save should record active rule/data versions; events should not silently
  reinterpret old outcomes through latest rule packs.

Raw schema implications:

- `policy_refs` should map event text and consumer effects to an active ruleset
  version.
- Event templates should include localization keys and explanation keys rather
  than raw catalog names.
- Financial restrictions should be modeled as constraints that can generate
  warnings, sanctions or board-response events.
- Rule/data versions should be immutable for old saves; major reinterpretations
  need explicit new events or new rule-pack activation.

## Raw Source URLs Returned

Perplexity cited:

- <https://en.wikipedia.org/wiki/Football_Manager>
- <https://discussions.unity.com/t/how-to-build-a-football-manager-like-game-need-tutorials-assets/565498>
- <https://hive.blog/hive-140217/@clintaribs/i-m-building-a-football-manager-game-part-1>
- plus weak YouTube, Reddit and design-gallery links.

## Source-Quality Notes

The synthesis does not rely on the weak community links above for authority.
Official Sports Interactive manual pages for Football Manager 2024 were
source-checked in
[[raw-drift-consumer-policy-ref-source-checks-2026-06-17]] and are the usable
game-precedent anchor for FMX-139.

