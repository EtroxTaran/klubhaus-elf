---
title: FMX-87 Dialogue Intent Taxonomy and Effect Matrix
status: open
linear: FMX-87
created: 2026-06-05
updated: 2026-06-05
---

# FMX-87 Dialogue Intent Taxonomy and Effect Matrix

## Goal

Close gap G13 by defining the finite `DialogueIntent` taxonomy, availability
rules and deterministic effect matrix for Full Dialogue, while preserving the
ADR-0030 rule that prose and LLM output never mutate authoritative state.

## Decisions

Nico selected the planning defaults live on 2026-06-05:

| # | Question | Selected default |
|---|---|---|
| D1 | Dialogue surface scope | Broad MVP: player, staff, board, press/media, fan-rep and agent surfaces. |
| D2 | Effect precision | Banded effects only; exact numbers route to FMX-52 calibration. |
| D3 | Persona policy | Persona can gate availability and apply explicit bounded scaling, resolved by owning domains. |

## Work items

- [x] Claim FMX-87 by moving Linear to `In Progress`.
- [x] Sync `main` and create `codex/fmx-87-dialogue-intent-taxonomy-mechanical-effect-matrix`.
- [x] Run Perplexity research for comparable sports-manager games, real-world football communication and deterministic storylet / DDD patterns.
- [x] Add raw research capture and synthesis note.
- [x] Add draft GD-0027.
- [x] Update ADR-0030, ADR-0054, GD-0018, feature/testing notes and vault maps.
- [x] Run docs validation and diff checks.
- [x] Commit, push and open draft PR #136.
- [x] Move Linear to `In Review`.
