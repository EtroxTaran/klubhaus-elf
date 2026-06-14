---
title: Raw monorepo workspace game production precedents
status: raw
tags: [research, raw, perplexity, monorepo, game-production, simulation, ui, content-pipeline, football-manager, fmx-179]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
related:
  - [[../monorepo-workspace-bootstrap-2026-06-14]]
  - [[../../10-Architecture/09-Decisions/ADR-0114-monorepo-workspace-bootstrap]]
  - [[../../40-Execution/fmx-179-monorepo-workspace-bootstrap-decision-queue-2026-06-14]]
---

# Raw monorepo workspace game production precedents

## Prompt

Research game-development and sports-management/comparable-game production
precedents relevant to monorepo/module boundaries for a football manager game:
Unity/Unreal modular code patterns, deterministic simulation/gameplay core
separation, Football Manager/OOTP/FIFA Manager public information where
available, and content/data pipeline separation.

## Perplexity capture

The answer strongly supported hard separation between deterministic simulation,
contract/API surface, UI/presentation and content/data pipeline.

Key points preserved from the answer:

- Sports Interactive's Football Manager 25 UI migration talk was used as the
  central genre precedent: the answer describes a move away from bespoke UI
  panels pulling directly from game data toward a data-driven UI, a UI data
  store/handler layer and a single constrained entry point between UI and game
  logic.
- Hobby Unity football-manager projects were treated as negative precedent:
  UI scripts often call simulation methods directly and mutate league tables or
  fixture state. This is fast to start but brittle at scale.
- Large game architecture practice supports a headless deterministic core that
  does not import UI, rendering, input, platform I/O or uncontrolled randomness.
- Presentation should subscribe to or query read models; it should not own
  football rules or authoritative state transitions.
- Content pipelines should stay separate from runtime code: authoring data,
  schemas, validation, generated IDs and provenance should be package-level
  concerns.

## Recommended FMX boundary lessons

| Boundary | Lesson |
|---|---|
| UI vs simulation | `apps/web` and `packages/ui` compose and present; they consume contracts/read models and never import authoritative simulation internals. |
| Simulation contracts | Neutral contracts such as `packages/match-contract` should be leaf packages with no UI or DB dependency. |
| Game data | `packages/game-data` remains the IP-clean data/content pipeline and should have validation/provenance gates before feature slices consume it. |
| Match engine runtime | `packages/match-engine` should not be created as an empty package; introduce it when the accepted engine runtime slice has real code and determinism tests. |
| Tools | Editors and pipelines should reuse the same contracts/schemas as the game instead of duplicating hidden paths. |

## Source URLs returned

- Football Manager 25 UI architecture talk:
  https://www.youtube.com/watch?v=im49swPfWIo
- Football Manager 25 development update:
  https://www.footballmanager.com/news/development-update-football-manager-25
- Unity discussion on football-manager-like games:
  https://discussions.unity.com/t/how-to-build-a-football-manager-like-game-need-tutorials-assets/565498
- Unity tutorial example showing direct UI/sim coupling:
  https://www.youtube.com/watch?v=BjvuD6BhHRw
- Open-source football-manager-style project used as a cautionary coupling
  example:
  https://github.com/rotexpro/Football-Manager-Project

## Claim confidence

| Claim | Confidence | Handling in synthesis |
|---|---|---|
| UI/presentation must stay outside authoritative simulation. | High | Use as direct package-boundary rationale. |
| Data/content pipeline should be a separate package surface. | High | Use to justify `packages/game-data`. |
| FM25's public talk proves SI's exact internal package structure. | Low | Avoid claiming exact repo/package structure; cite only the UI/data-decoupling lesson. |
| Hobby Unity projects are negative coupling examples. | Medium | Use as caution, not as best practice. |

## Related

- [[../monorepo-workspace-bootstrap-2026-06-14]]
- [[../../10-Architecture/09-Decisions/ADR-0114-monorepo-workspace-bootstrap]]
- [[../../40-Execution/fmx-179-monorepo-workspace-bootstrap-decision-queue-2026-06-14]]
