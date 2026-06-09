<!--
id: R-003
title: [research] Build football manager competitor matrix
labels: type:research, area:research, prio:high, size:m, parallel:safe
milestone: M1 Research & Architecture
depends_on: none
output: docs/60-Research/competitor-matrix.md
-->

# [research] Build football manager competitor matrix

**ID:** R-003  
**Labels:** `type:research`, `area:research`, `prio:high`, `size:m`, `parallel:safe`  
**Milestone:** M1 Research & Architecture  
**Depends on:** none  
**Primary output:** `docs/60-Research/competitor-matrix.md`

## Goal

Compare key football manager products to clarify differentiation, MVP scope, and feature expectations.

## Products to cover

- Anstoss series
- Football Manager
- Top Eleven
- EA Fußball Manager
- Online Soccer Manager / OSM
- We Are Football
- Soccer Manager 2024/2025
- Club Boss, cross-linked to R-001 but not duplicated

## Output

Write findings to `docs/60-Research/competitor-matrix.md` with front matter.

## Acceptance criteria

- [ ] Matrix with platforms, business model, offline support, depth, mobile fit, strengths, weaknesses.
- [ ] Feature coverage table for league, transfers, training, youth, stadium, finance, match sim, save/cloud.
- [ ] Differentiation opportunities for Klubhaus Elf.
- [ ] Risks where competitors set user expectations that MVP might miss.
- [ ] Source list with retrieval date.

## Agent prompt

Create a sourced competitor matrix for football manager games. Write only `docs/60-Research/competitor-matrix.md` except optional summary link. Focus on actionable product scope and differentiation.

## Independence check

- File exclusivity: writes only `competitor-matrix.md` plus optional summary link.
- Interface stability: no API/schema changes.
- Config exclusivity: no config changes.
- Parallel label: `parallel:safe`.
