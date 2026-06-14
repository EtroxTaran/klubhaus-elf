---
title: "RAW Perplexity/Web - Opposition-template ratification cleanup (FMX-136)"
status: raw
tags: [research, raw, perplexity, web, tactics, opposition, ai-world, match, determinism, replay, snapshot, fmx-136, fmx-67]
created: 2026-06-14
updated: 2026-06-14
type: research-raw
binding: false
linear: FMX-136
related:
  - [[../opposition-template-ai-consumption-ratification-2026-06-14]]
  - [[../../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]]
  - [[../../10-Architecture/09-Decisions/ADR-0055-tactics-context]]
  - [[../../10-Architecture/09-Decisions/ADR-0071-ai-world-simulation-context-and-drift-contract]]
  - [[../../10-Architecture/bounded-context-map]]
  - [[../opposition-template-ai-consumption-contract-2026-06-05]]
  - [[raw-opposition-template-ai-consumption-2026-06-05]]
---

# RAW - Opposition-template ratification cleanup (FMX-136)

Perplexity/Web capture for **FMX-136**. Status `raw`: this preserves the
research input used to reconcile the already-accepted ADR-0080 with later
AI World and replay contracts. The synthesis is
[[../opposition-template-ai-consumption-ratification-2026-06-14]] and the
canonical ADR is
[[../../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]].

## Prompt 1 - Real-world football opposition preparation refresh

**Prompt.** Research professional football opposition analysis workflows
circa 2020-2026. Focus on who prepares opponent analysis, who owns the match
plan, when the plan becomes stable, how final lineup surprises are handled and
how analysts/coaches hand off to matchday staff.

**Key captured findings.**

- Opposition analysis is a multi-person process: analysts and data/video staff
  gather clips, event data and recent-match patterns; coaches/head coach turn
  that into the match plan; player-facing delivery is filtered by team, unit or
  individual need.
- The plan is built across match week and normally becomes stable before the
  final tactical session. Late surprises are handled through prepared branches,
  touchline changes and explicit staff intervention, not by the match engine
  silently inventing a new plan.
- This supports FMX's split: AI World prepares the opponent-planning context,
  Tactics selects a catalog template, and Match consumes a locked snapshot.

**Useful sources returned / checked.**

- Hudl, "High Performance Analysis Workflows: Pre-Match Opposition Analysis",
  2021-11-24:
  https://www.hudl.com/blog/workflows-pre-match-opposition-analysis
- PFSA Level 2 Opposition Analysis:
  https://thepfsa.co.uk/pfsa-level-2-opposition-analysis-in-football/
- Soccer Interaction, "Good Opposition Analysis":
  https://soccerinteraction.com/good-opposition-analysis
- Liam Henshaw, "The Tools Every Football Analyst Should Know":
  https://www.liamhenshaw.com/writing/the-tools-every-football-analyst-should-know

## Prompt 2 - Football and sports-management game precedent refresh

**Prompt.** Research how Football Manager and adjacent sports-management games
surface opponent preparation, assistant recommendations, strategy tendencies
and match plans. Separate player-facing genre precedent from claims about
undocumented internal engines.

**Key captured findings.**

- Football Manager exposes opposition instructions as pre-match defaults that
  can be tweaked before kick-off once the opponent selection and shape are
  known; assistant delegation is supported.
- Football Manager match plans model scenario-triggered tactical changes. That
  is a strong player-facing precedent for explicit conditional plans or
  intervention events rather than hidden Match-owned replanning.
- OOTP-style adjacent sims expose strategy/tendency tables and scouting reports
  as prepared management inputs. Public sources do not expose replay internals,
  so this remains genre precedent only.

**Useful sources returned / checked.**

- Sports Interactive, Football Manager 2024 manual - Tactics:
  https://community.sports-interactive.com/sigames-manual/football-manager-2024/tactics-r4960/
- FootballManager.com, "Using Opposition Instructions for marginal gains":
  https://www.footballmanager.com/node/508
- OOTP manual, Team Strategy:
  https://manuals.ootpdevelopments.com/index.php?man=ootp12&page=help_team_page.strategy
- OOTP manual, Scouting:
  https://manuals.ootpdevelopments.com/index.php?man=ootp16&page=scouting

## Prompt 3 - Deterministic replay and snapshot contract refresh

**Prompt.** Research deterministic replay and durable-simulation best practices
for a contract where one bounded context chooses a replay-relevant AI decision
before a match and another bounded context runs the match.

**Key captured findings.**

- Replay-bearing code must not read mutable state, wall-clock time, external
  services or fresh random values when replaying. Inputs need to be immutable,
  checkpointed or logged.
- Decision results that may change after future model/catalog edits should be
  logged or embedded into the match-start snapshot, with model/input hashes for
  audit.
- Fail-fast is safer than a silent fallback for a missing replay-bearing
  decision. A fallback can be added later only as an explicit, versioned
  Tactics event if product design wants it.
- Idempotency keys, schema versions, input hashes and RNG stream labels are the
  required audit spine for FMX's `OppositionTemplateSelectedForMatchV1`.

**Useful sources returned / checked.**

- AWS Durable Execution SDK, "Determinism during replay":
  https://docs.aws.amazon.com/durable-execution/patterns/best-practices/determinism/
- Antithesis, deterministic simulation testing resources:
  https://antithesis.com/docs/resources/deterministic_simulation_testing/
- Resonate Journal, deterministic simulation testing:
  https://journal.resonatehq.io/p/deterministic-simulation-testing
- WarpStream, deterministic simulation testing for SaaS:
  https://www.warpstream.com/blog/deterministic-simulation-testing-for-our-entire-saas

## Decision input captured live

Nico approved the recommended FMX-136 closure line on 2026-06-14:

- **D4 planning source = AI World Simulation** as canonical
  `planningContext.sourceContext`.
- **D5 missing selection = fail fast** with
  `opposition_template_selection_missing`; no silent default fallback.
- **D6 replay payload = snapshot in `TacticSnapshot`**, carrying the selected
  template identity, version, provenance and hash so Match never joins live
  Tactics or AI World state.
