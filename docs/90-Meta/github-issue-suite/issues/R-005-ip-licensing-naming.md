<!--
id: R-005
title: [research] Define IP, licensing, and naming constraints
labels: type:research, area:research, area:gamedata, prio:critical, size:m, parallel:safe, needs-decision
milestone: M1 Research & Architecture
depends_on: none
output: docs/60-Research/ip-and-licensing.md
-->

# [research] Define IP, licensing, and naming constraints

**ID:** R-005  
**Labels:** `type:research`, `area:research`, `area:gamedata`, `prio:critical`, `size:m`, `parallel:safe`, `needs-decision`  
**Milestone:** M1 Research & Architecture  
**Depends on:** none  
**Primary output:** `docs/60-Research/ip-and-licensing.md`

## Goal

Produce the legal/product constraints needed for IP-clean club, player, league, crest, and stadium generation.

## Research questions

- Which football data sources are usable, and under which licenses?
- What can be safely modeled from real-world league structures?
- What must be avoided for DFL, FIFA/FIFPro, EPL, UEFA, clubs, logos, player likenesses, and stadium names?
- What concrete fictional naming schema should ADR-0007 adopt?
- Which edge cases require Nico decision?

## Output

Write `docs/60-Research/ip-and-licensing.md`.

## Acceptance criteria

- [ ] License matrix for candidate data sources, including openfootball/football.json.
- [ ] Protected-IP hard-stop list.
- [ ] Proposed club naming schema with examples and rejected examples.
- [ ] Proposed player-name generation constraints.
- [ ] Crest/color/stadium guidance.
- [ ] Clear decision section for Nico if any gray area remains.
- [ ] Direct input section for ADR-0007.

## Agent prompt

Research IP and licensing boundaries for an IP-clean football manager. Write `docs/60-Research/ip-and-licensing.md` and include a concrete ADR-0007 input section. Do not add real clubs/players/assets.

## Independence check

- File exclusivity: writes `ip-and-licensing.md` only.
- Interface stability: no API/schema changes.
- Config exclusivity: no config changes.
- Parallel label: `parallel:safe`.
