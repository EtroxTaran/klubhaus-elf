---
title: "Opposition-template AI consumption contract - research synthesis (FMX-67)"
status: draft
tags: [research, tactics, opposition, ai, match, determinism, replay, fmx-67]
context: [tactics, ai-world-simulation]
created: 2026-06-05
updated: 2026-06-05
type: research
binding: false
linear: FMX-67
sourceType: external
related:
  - [[raw-perplexity/raw-opposition-template-ai-consumption-2026-06-05]]
  - [[../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]]
  - [[../10-Architecture/09-Decisions/ADR-0026-match-frame-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0067-set-piece-variant-selection-determinism]]
  - [[../10-Architecture/09-Decisions/ADR-0071-ai-world-simulation-context-and-drift-contract]]
  - [[../10-Architecture/state-machines/match]]
  - [[tactics-and-formations]]
  - [[determinism-and-replay]]
---

# Opposition-template AI consumption contract - research synthesis (FMX-67)

Grounds **FMX-67** (E2 epic FMX-58, gap **G11**) by deciding how the AI
opponent-prep layer consumes Tactics-owned `OppositionTemplate` records and how
Match receives a replay-safe selection at lock-time. Raw capture:
[[raw-perplexity/raw-opposition-template-ai-consumption-2026-06-05]]. Proposed
decision:
[[../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]].

## 1. Internal constraints already fixed

- [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]] owns the
  persistent tactic library: presets, set-piece routine variants,
  `OppositionTemplate`, role/duty configuration and tactical-style signal
  aggregation. It explicitly keeps Match limited to the per-match snapshot.
- [[../10-Architecture/state-machines/match]] freezes line-up and tactics at
  `lineup_locked`; Match RNG is seeded at that point; accepted interventions
  during `simulating` become replay events.
- [[../10-Architecture/09-Decisions/ADR-0067-set-piece-variant-selection-determinism]]
  closes FMX-70 / G9: set-piece variant choice is a pure function over the
  frozen `TacticSnapshot`, a dead-ball context, event-log-derived
  `deadBallIndex` and isolated `MatchCoreRng` sub-labels.
- [[../10-Architecture/bounded-context-map]] forbids cross-context joins. Match
  may consume self-contained events and snapshots; it must not query live Tactics
  tables or mutable AI planning state during replay.
- [[determinism-and-replay]] already separates `WorldAiMgmtRng` for
  out-of-match AI-management decisions from Match RNG. Opposition-template
  selection is out-of-match planning; Match execution remains a separate stream.

## 2. External research takeaways

**Real-world football.** Opposition preparation is a match-week workflow:
analysts and data/video staff build opponent profiles; coaches turn them into a
game plan; players and matchday staff get condensed delivery. Late surprises are
usually handled by conditional plans for likely shapes, scorelines, substitutions
and coach tendencies. This supports pre-match planning plus explicit in-match
intervention events rather than hidden Match-side improvisation.

**Comparable games.** Football Manager exposes opposition instructions as
pre-match instructions that can be tweaked before kick-off based on the actual
opponent lineup/shape, and OOTP exposes strategy tables by time and score with
staff-generated strategies. Public sources do not expose internal engine code,
so they are genre precedents only, but they converge on
prep-before-sim-execution.

**Deterministic replay.** Replay systems stay stable by recording initial
conditions, seed material and inputs/events instead of storing full state. AI
decisions that should survive future AI-code changes should be logged as
decisions, not recomputed from mutable live state.

## 3. Decision matrix

| Question | Options | Selected line |
|---|---|---|
| Consumption model | Match selects at lock-time; early fixed pre-match; split event model | **Split event model.** AI-planning context is assembled before lock; Tactics resolves/publishes the selected template; Match freezes it at `lineup_locked`. |
| Immutability timing | `lineup_open`; `lineup_locked`; worker start | **`lineup_locked`.** A candidate may exist during `lineup_open`, but only the final event becomes immutable at the lock boundary. |
| RNG lane | no RNG; MatchCoreRng; WorldAiMgmtRng | **WorldAiMgmtRng.** Template selection is out-of-match AI-management planning and must not perturb MatchCoreRng or set-piece sub-labels. |

Nico selected all three recommended options live on 2026-06-05.

## 4. Proposed model

The authoritative flow is:

1. **AI-management planning** builds an `OppositionPlanningContext` from public
   facts: fixture, opponent style projection, scouting confidence, manager style,
   rivalry/stakes and the requesting club's current tactical identity. This may
   be owned by the current AI-management lane (League/Club/Transfer per the
   current map) or by **AI World Simulation** if
   [[../10-Architecture/09-Decisions/ADR-0071-ai-world-simulation-context-and-drift-contract]]
   is ratified.
2. **Tactics** owns the catalog and the deterministic selector. It evaluates
   eligible `OppositionTemplate` records from the supplied context and publishes
   `OppositionTemplateSelectedForMatchV1`.
3. **Match** consumes that self-contained event at `lineup_locked` and embeds
   the selected template into the frozen `TacticSnapshot`. Match never selects
   or queries templates itself.
4. **In-match changes** remain explicit intervention events per
   [[../10-Architecture/09-Decisions/ADR-0072-in-match-control-seam]] and the
   match state machine; they do not mutate the original selected template.

## 5. Contract inputs

`OppositionTemplateSelectedForMatchV1` must be self-contained enough for Match
to freeze without cross-context joins:

- fixture/match refs and team refs;
- selected template ref + template version/model version;
- selector owner (`Tactics`) and planning-source context;
- `inputHash` of the planning context;
- `rngStream = WorldAiMgmtRng`, `rngLabel`, `rngVersion`;
- timing (`candidateDuring = lineup_open`, `immutableAt = lineup_locked`);
- provenance and idempotency key.

Query shape:

- `SelectOppositionTemplateForMatch(query)` is owned by Tactics and returns a
  selected template plus audit/provenance fields.
- `BuildTacticSnapshotForMatch(query)` is owned by Tactics and returns the
  lock-time `TacticSnapshot` consumed by Match; it accepts the selected
  opposition-template ref, line-up facts and already-defined set-piece fields.

## 6. Open / deferred

- Template content, archetype taxonomy, weights, manager-style coefficients and
  scouting-confidence effects remain calibration/design debt.
- The exact AI-management owner can later move to AI World Simulation if
  ADR-0071 is ratified; ADR-0080 keeps the published language stable so that
  migration is a producer swap, not a Match contract change.
- UI for pre-match opposition analysis remains in the Tactics / scouting UX lane,
  not FMX-67.

## 7. Sources

- Hudl pre-match opposition analysis workflow:
  https://www.hudl.com/blog/workflows-pre-match-opposition-analysis
- Scott Martin opposition-scouting framework:
  https://scottmartinmedia.com/blogs/news/how-to-effectively-scout-your-opposition-2023-advent-calendar-series
- Sports Interactive Football Manager 2024 tactics manual:
  https://community.sports-interactive.com/sigames-manual/football-manager-2024/tactics-r4960/
- OOTP Team Strategy manual:
  https://manuals.ootpdevelopments.com/index.php?man=ootp12&page=help_team_page.strategy
- Game Developer replay-system article:
  https://www.gamedeveloper.com/programming/developing-your-own-replay-system

