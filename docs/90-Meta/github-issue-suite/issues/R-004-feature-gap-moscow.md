<!--
id: R-004
title: [research] Produce MVP feature-gap and MoSCoW scope
labels: type:research, area:research, area:feature, prio:high, size:m, parallel:after-R-001-R-002-R-003
milestone: M1 Research & Architecture
depends_on: R-001, R-002, R-003
output: docs/60-Research/feature-gap-analysis.md
-->

# [research] Produce MVP feature-gap and MoSCoW scope

**ID:** R-004  
**Labels:** `type:research`, `area:research`, `area:feature`, `prio:high`, `size:m`, `parallel:after-R-001-R-002-R-003`  
**Milestone:** M1 Research & Architecture  
**Depends on:** `R-001`, `R-002`, `R-003`  
**Primary output:** `docs/60-Research/feature-gap-analysis.md`

## Goal

Turn research inputs into a MoSCoW feature-scope recommendation for MVP through M8.

## Inputs

- R-001 Club Boss analysis
- R-002 Anstoss deep dive
- R-003 Competitor matrix
- Project briefing feature scope

## Output

Write `docs/60-Research/feature-gap-analysis.md`.

## Acceptance criteria

- [ ] MoSCoW table for all major systems: league, match sim, squad, training, transfer, finance/stadium, youth, cup, save/PWA, media/fans.
- [ ] MVP cut recommendation no later than M8.
- [ ] Explicit out-of-scope list for M0-M8.
- [ ] Dependencies and sequencing notes for backlog creation.
- [ ] Risks where scope is too large for independent beats.
- [ ] Candidate issue titles for M2-M8 implementation epics.

## Agent prompt

Using completed research notes, write a MoSCoW feature-gap analysis at `docs/60-Research/feature-gap-analysis.md`. Do not modify ADRs or implementation code. If upstream research is incomplete, clearly mark assumptions and missing inputs.

## Independence check

- File exclusivity: writes `feature-gap-analysis.md` only.
- Interface stability: no API/schema changes.
- Config exclusivity: no config changes.
- Parallel label: `parallel:after-R-001-R-002-R-003`.
