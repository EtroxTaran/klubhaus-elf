<!--
id: A-004
title: [adr] Finalize club/player/league data model ADR
labels: type:adr, area:docs, prio:high, size:s, parallel:after-research
milestone: M1 Research & Architecture
depends_on: R-004, R-005, R-007
output: docs/10-Architecture/09-Decisions/ADR-0004-data-model.md
-->

# [adr] Finalize club/player/league data model ADR

**ID:** A-004  
**Labels:** `type:adr`, `area:docs`, `prio:high`, `size:s`, `parallel:after-research`  
**Milestone:** M1 Research & Architecture  
**Depends on:** `R-004`, `R-005`, `R-007`  
**Primary output:** `docs/10-Architecture/09-Decisions/ADR-0004-data-model.md`

## Goal

Turn the draft ADR into a review-ready architectural decision using Phase 1 research.

## Output

Update `docs/10-Architecture/09-Decisions/ADR-0004-data-model.md`.

## Acceptance criteria

- [ ] ADR has Context, Decision, Alternatives considered, Consequences, and Status.
- [ ] Links to relevant research notes and source ADR dependencies.
- [ ] Explicit constraints and non-goals.
- [ ] Clear follow-up issues if implementation work is needed.
- [ ] Status is `review` if Nico needs approval, or `stable` if no decision remains.

## Agent prompt

Read the Phase 1 summary and related research notes, then finalize `docs/10-Architecture/09-Decisions/ADR-0004-data-model.md`. Keep edits scoped to this ADR unless a broken cross-link needs correction. Do not change source code or schemas.

## Independence check

- File exclusivity: writes this ADR only.
- Interface stability: no implementation contract changes.
- Config exclusivity: no config changes.
- Parallel label: `parallel:after-research`.
