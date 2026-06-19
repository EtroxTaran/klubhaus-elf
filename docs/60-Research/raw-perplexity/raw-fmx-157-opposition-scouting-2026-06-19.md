---
title: Raw Perplexity - FMX-157 Opposition Scouting
status: raw
tags: [research, raw, perplexity, fmx-157, scouting, opposition, tactics]
created: 2026-06-19
updated: 2026-06-19
type: research
binding: false
linear: FMX-157
sourceType: raw-perplexity
related:
  - [[../manager-legacy-scouting-youth-feed-followups-2026-06-19]]
  - [[raw-fmx-157-source-checks-2026-06-19]]
  - [[../../40-Execution/fmx-157-manager-legacy-scouting-youth-feed-decision-queue-2026-06-19]]
  - [[../../10-Architecture/09-Decisions/ADR-0064-scouting-activity-context]]
  - [[../../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]]
---

# Raw Perplexity - FMX-157 Opposition Scouting

## Prompt focus

Research real-world opposition analysis, comparable football-manager UX and DDD
ownership options for the reserved `OppositionScoutingRequested` hook in
ADR-0064, without reopening ADR-0080's accepted Tactics/AI World/Match split.

## Captured findings

- Real-world opposition preparation is usually a match-week analysis workflow:
  analysts collect video/data, coaches turn it into a match plan, and players
  receive condensed instructions.
- Football-management player expectations include opposition reports,
  opposition instructions, pre-match tactical advice and confidence bands.
  These are useful UX precedents, but public sources do not expose actual engine
  ownership.
- The raw pass recommended keeping Scouting/Intelligence responsible for report
  collection and freshness while Tactics owns match-plan interpretation.
- A pure Tactics-owned opposition-scouting model is simpler for UI, but risks
  turning Tactics into an intelligence-gathering context.
- A pure Scouting-owned match-plan model is wrong in the other direction: it
  would make scouts choose tactical responses that belong to Tactics/coaching.

## Raw recommendation

Use a split hook:

- Scouting owns `OppositionScoutingRequested` execution: assignment, coverage,
  report freshness, confidence, source mix and published report snapshot.
- Tactics owns how a report is interpreted into `MatchPlan` /
  `OppositionTemplateSelectedForMatchV1` inputs.
- AI World Simulation can request or schedule reports for AI clubs as planning
  source, but it does not own Scouting's report data or Tactics' selector.
- Match consumes only frozen Tactics snapshots and never reads live scouting.

## Source-quality notes

- The Perplexity pass leaned heavily on community/manual-style material and
  analyst workflow articles. Treat it as player-expectation and workflow
  discovery, not strong canonical evidence.
- Targeted source checks did not find a strong official Sports Interactive
  opposition-report internals source or stable job-description evidence good
  enough to canonize.
- ADR-0080 and the FMX DDD boundary rules are stronger local authority than the
  external game-community material.

## Related

- [[../manager-legacy-scouting-youth-feed-followups-2026-06-19]]
- [[raw-fmx-157-source-checks-2026-06-19]]
- [[../../40-Execution/fmx-157-manager-legacy-scouting-youth-feed-decision-queue-2026-06-19]]
- [[../../10-Architecture/09-Decisions/ADR-0064-scouting-activity-context]]
- [[../../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]]
