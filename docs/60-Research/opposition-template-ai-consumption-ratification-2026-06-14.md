---
title: "Opposition-template AI consumption ratification cleanup (FMX-136)"
status: current
tags: [research, synthesis, tactics, opposition, ai-world, match, determinism, replay, snapshot, fmx-136, fmx-67]
context: [tactics, ai-world-simulation]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
linear: FMX-136
sourceType: external
related:
  - [[raw-perplexity/raw-opposition-template-ai-consumption-ratification-2026-06-14]]
  - [[opposition-template-ai-consumption-contract-2026-06-05]]
  - [[raw-perplexity/raw-opposition-template-ai-consumption-2026-06-05]]
  - [[../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]]
  - [[../10-Architecture/09-Decisions/ADR-0071-ai-world-simulation-context-and-drift-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0067-set-piece-variant-selection-determinism]]
  - [[../10-Architecture/bounded-context-map]]
  - [[../10-Architecture/state-machines/match]]
  - [[determinism-and-replay]]
---

# Opposition-template AI consumption ratification cleanup (FMX-136)

FMX-136 closes the ratification cleanup left after FMX-67 and the 2026-06-08
ADR sweep. ADR-0080 was already `accepted`, but its `binding` flag, appendix
status and source-owner wording still reflected the older pre-AI-World shape.
Raw refresh:
[[raw-perplexity/raw-opposition-template-ai-consumption-ratification-2026-06-14]].

## Current constraints

- [[../10-Architecture/09-Decisions/ADR-0055-tactics-context|ADR-0055]]
  already makes **Tactics** the owner of `OppositionTemplate` records and the
  producer of the lock-time `TacticSnapshot`.
- [[../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract|ADR-0080]]
  already chooses the split event model, final immutability at
  `lineup_locked` and a dedicated `WorldAiMgmtRng` sub-label.
- [[../10-Architecture/09-Decisions/ADR-0071-ai-world-simulation-context-and-drift-contract|ADR-0071]]
  is accepted. AI World Simulation is now the canonical owner for AI
  manager/club planning decisions and world-drift policy that were previously
  described as scattered League / Club / Transfer policy.
- [[../10-Architecture/09-Decisions/ADR-0067-set-piece-variant-selection-determinism|ADR-0067]]
  and [[../10-Architecture/09-Decisions/ADR-0026-match-frame-contract|ADR-0026]]
  require replay-bearing Match inputs to be frozen in the `TacticSnapshot`.

## Evidence synthesis

Real-world football supports a prepared-but-adaptable model: analysts and
coaches collaborate on opponent reports, the head coach owns the match plan,
and late opponent changes are handled through pre-planned branches or explicit
touchline changes. That maps to a prepared AI World planning context plus a
Tactics-owned selector, not Match-side hidden replanning.

Comparable games support the same player-facing structure. Football Manager's
opposition instructions are pre-match defaults that can be adjusted before
kick-off once opponent selection and shape are known, and its match plans are
scenario-triggered explicit tactical changes. Adjacent management games expose
strategy tendencies and scouting reports as prepared inputs. Public game
sources do not prove internal replay architecture, so they are genre precedent,
not implementation evidence.

Deterministic replay practice supports a stricter snapshot contract. A
replay-bearing decision must be logged or embedded with stable inputs, model
version, input hash, RNG label and provenance. Future Tactics catalog edits or
AI World model changes must not alter an already-locked match.

## Options considered

### D4 - planning source after ADR-0071

| Option | Shape | Assessment |
|---|---|---|
| **A. AI World Simulation canonical source** | `planningContext.sourceContext` is `ai-world-simulation`; League, Club and Transfer provide input facts/projections only. | **Accepted.** Matches ADR-0071 and removes the stale "may become" wording without moving Tactics catalog ownership. |
| B. Keep four-source union | Leave League / Club / Transfer / AI World as possible sources. | Preserves historical flexibility, but keeps an already-ratified owner ambiguous. |
| C. Legacy lane until implementation | Keep the old League / Club / Transfer split until code exists. | Lowest doc churn, but contradicts the accepted AI World map. |

### D5 - no valid selection at `lineup_locked`

| Option | Shape | Assessment |
|---|---|---|
| **A. Fail fast** | Match lock fails with `opposition_template_selection_missing`. | **Accepted.** Best replay safety; no hidden default can enter an authoritative match. |
| B. Explicit default event | Tactics may emit a versioned fallback-template event. | Useful later if product wants soft failure, but it needs its own gameplay contract and audit surface. |
| C. Mode split | Competitive matches fail; background matches fallback. | Too complex now and risks divergent replay semantics. |

### D6 - replay-safe payload

| Option | Shape | Assessment |
|---|---|---|
| **A. Snapshot in `TacticSnapshot`** | `OppositionTemplateSelectedForMatchV1` carries identity/provenance/hash; `BuildTacticSnapshotForMatch` embeds the minimal immutable selected-template slice. | **Accepted.** Smallest payload that gives Match replay independence from live Tactics or AI World state. |
| B. Full template body only on event | Event stores the whole selected template; `TacticSnapshot` keeps only the event ref. | Auditable but heavier and forces Match replay to dereference event storage. |
| C. ID + version only | Store template id/version and recompute from Tactics catalog. | Too weak; catalog/model edits can alter replay behavior. |

## Decision - Nico 2026-06-14

Nico approved **D4=A, D5=A, D6=A**:

1. **Planning source:** AI World Simulation is canonical for
   `planningContext.sourceContext`. League Orchestration, Club Management and
   Transfer provide input facts/projections, not source ownership.
2. **Missing selection:** no silent default fallback. A missing valid
   selection at `lineup_locked` fails the Match lock with
   `opposition_template_selection_missing`.
3. **Replay payload:** Match receives the selected opposition template as an
   immutable slice inside `TacticSnapshot`, including selected-template event
   id, template id/version, behavior-affecting archetype keys, provenance and
   `templateSnapshotHash`.

## Accepted contract delta

- ADR-0080 becomes `binding: true`.
- `planningContext.sourceContext` narrows to `'ai-world-simulation'`.
- `selectedTemplate` gains `templateSnapshotHash`.
- `BuildTacticSnapshotForMatch` returns a `TacticSnapshot` with an embedded
  `oppositionTemplate` slice. Replays use that slice, not live Tactics tables
  or AI World planning state.
- Any future fallback path requires a new explicit Tactics-published event or
  ADR amendment; Match still never invents the template.

## Deferred

- Template taxonomy, weights, manager-style coefficients and
  scouting-confidence effects remain calibration/design debt.
- Player-facing opposition-analysis UX remains outside FMX-136.
- If implementation later needs a soft fallback for background matches, that is
  a new decision fork because it changes authoritative Match lock behavior.

## Sources

- Hudl, "High Performance Analysis Workflows: Pre-Match Opposition Analysis":
  https://www.hudl.com/blog/workflows-pre-match-opposition-analysis
- Sports Interactive, Football Manager 2024 manual - Tactics:
  https://community.sports-interactive.com/sigames-manual/football-manager-2024/tactics-r4960/
- AWS Durable Execution SDK, "Determinism during replay":
  https://docs.aws.amazon.com/durable-execution/patterns/best-practices/determinism/
