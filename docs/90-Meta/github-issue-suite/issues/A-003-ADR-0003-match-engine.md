<!--
id: A-003
title: [adr] Finalize deterministic match-engine ADR
labels: type:adr, area:docs, prio:high, size:s, parallel:after-research
milestone: M1 Research & Architecture
depends_on: R-002, R-004, R-007
output: docs/10-Architecture/09-Decisions/ADR-0003-match-engine.md
-->

# [adr] Finalize deterministic match-engine ADR

**ID:** A-003  
**Labels:** `type:adr`, `area:docs`, `prio:high`, `size:s`, `parallel:after-research`  
**Milestone:** M1 Research & Architecture  
**Depends on:** `R-002`, `R-004`, `R-007`  
**Primary output:** `docs/10-Architecture/09-Decisions/ADR-0003-match-engine.md`

## Goal

Turn the draft ADR into a review-ready architectural decision using Phase 1 research.

## Output

Update `docs/10-Architecture/09-Decisions/ADR-0003-match-engine.md`.

## Acceptance criteria

- [ ] ADR has Context, Decision, Alternatives considered, Consequences, and Status.
- [ ] Links to relevant research notes and source ADR dependencies.
- [ ] Explicit constraints and non-goals.
- [ ] Clear follow-up issues if implementation work is needed.
- [ ] Status is `review` if Nico needs approval, or `stable` if no decision remains.

## Agent prompt

Read the Phase 1 summary and related research notes, then finalize `docs/10-Architecture/09-Decisions/ADR-0003-match-engine.md`. Keep edits scoped to this ADR unless a broken cross-link needs correction. Do not change source code or schemas.

## Independence check

- File exclusivity: writes this ADR only.
- Interface stability: no implementation contract changes.
- Config exclusivity: no config changes.
- Parallel label: `parallel:after-research`.
