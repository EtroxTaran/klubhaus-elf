---
title: Handoff FMX-83 newsworthiness event contracts
status: wrapped
tags: [meta, execution, handoff, narrative, newsworthiness, events, contracts, fmx-83]
created: 2026-06-04
updated: 2026-06-04
type: handoff
binding: false
related:
  - [[../../60-Research/newsworthiness-event-publication-semantics-2026-06-04]]
  - [[../../60-Research/raw-perplexity/raw-newsworthiness-event-publication-semantics-2026-06-04]]
  - [[../../10-Architecture/09-Decisions/ADR-0075-narrative-newsworthiness-event-contracts]]
  - [[../../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[../../10-Architecture/09-Decisions/ADR-0065-narrative-media-press-content-ownership]]
  - [[../../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
  - [[../../20-Features/feature-ai-narration-mvp-pillar]]
  - [[../../30-Implementation/ai-narration-contract-testing-framework]]
---

# Handoff: FMX-83 newsworthiness event contracts (2026-06-04)

## Linear

- Issue: FMX-83
- Status: In Progress -> ready for In Review after PR creation.

## Done this session

- Checked live Linear/GitHub/worktree state, found no open PR collision and
  selected FMX-83 from the high-priority Backlog candidates because it is
  unclaimed and upstream of media/dialogue work.
- Moved FMX-83 to `In Progress`.
- Synced `main` and created branch
  `codex/fmx-83-newsworthiness-event-contracts`.
- Ran Perplexity research on real football media/newsworthiness, comparable
  game/storylet patterns and DDD integration-event contracts.
- Cross-checked promoted claims against Reuters sourcing practice, football
  injury time-loss consensus, FIFA discipline references, official Football
  Manager UI/news pages, Failbetter storylet references, Microsoft DDD/event
  guidance and Zod 4 docs.
- Recorded raw research:
  [[../../60-Research/raw-perplexity/raw-newsworthiness-event-publication-semantics-2026-06-04]].
- Added synthesis:
  [[../../60-Research/newsworthiness-event-publication-semantics-2026-06-04]].
- Added proposed:
  [[../../10-Architecture/09-Decisions/ADR-0075-narrative-newsworthiness-event-contracts]].
- Updated Narrative ADR/feature/GDDR/testing notes and vault maps so the
  contract is discoverable.

## Proposed decisions awaiting Nico ratify

| # | Proposed default |
|---|---|
| D1 | Distinct source-owned event contracts plus shared `NarrativeNewsFactProjection`. |
| D2 | Transfer emits `TransferRumourPublished`; Narrative renders only. |
| D3 | FMX-83 consumes future FMX-80/Discipline `PlayerSuspended`; it does not define the schema. |
| D4 | Banded, display-ready, self-contained payloads with source/confidence/legal/privacy metadata. |

## Open / next step

- Run `node scripts/docs-check.mjs` and `git diff --check`.
- Commit, push and open a PR titled
  `[FMX-83] Define newsworthiness event contracts` with body first line
  `Closes FMX-83`.
- Move Linear FMX-83 to `In Review` after the PR exists.

## Blockers

- No docs blocker.
- Implementation remains blocked until Narrative contracts are ratified.
- Suspension stories remain blocked on FMX-80/Discipline defining the canonical
  `PlayerSuspended` schema.

## Changed vault paths

- `.cursor/plans/fmx-83-newsworthiness-event-contracts.md`
- `docs/60-Research/raw-perplexity/raw-newsworthiness-event-publication-semantics-2026-06-04.md`
- `docs/60-Research/newsworthiness-event-publication-semantics-2026-06-04.md`
- `docs/10-Architecture/09-Decisions/ADR-0075-narrative-newsworthiness-event-contracts.md`
- `docs/10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework.md`
- `docs/50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue.md`
- `docs/20-Features/feature-ai-narration-mvp-pillar.md`
- `docs/30-Implementation/ai-narration-contract-testing-framework.md`
- `docs/00-Index/Decision-Log.md`
- `docs/00-Index/Current-State.md`
- `docs/00-Index/Architecture-Map.md`
- `docs/00-Index/Research-Map.md`
- `docs/00-Index/Game-Design-Map.md`
- `docs/00-Index/Feature-Map.md`
- `docs/60-Research/00-summary.md`
- `docs/60-Research/raw-perplexity/README.md`

## Needs promotion

- ADR-0075 remains `proposed` until Nico ratifies.
- ADR-0054/ADR-0065/GD-0018 remain draft/proposed and non-binding.
- FMX-80, FMX-82 and FMX-87 remain follow-up decision owners.

