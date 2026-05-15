<!--
id: R-002
title: [research] Deep dive classic Anstoss design patterns
labels: type:research, area:research, area:gamedata, prio:high, size:m, parallel:safe
milestone: M1 Research & Architecture
depends_on: none
output: docs/60-Research/anstoss-series-deep-dive.md
-->

# [research] Deep dive classic Anstoss design patterns

**ID:** R-002  
**Labels:** `type:research`, `area:research`, `area:gamedata`, `prio:high`, `size:m`, `parallel:safe`  
**Milestone:** M1 Research & Architecture  
**Depends on:** none  
**Primary output:** `docs/60-Research/anstoss-series-deep-dive.md`

## Goal

Capture the design DNA of the Anstoss series as product inspiration while avoiding direct copying.

## Research questions

- Which mechanics define the Anstoss feeling: pacing, humor, abstraction, depth, weekly rhythm?
- How do training, transfers, finances, stadium, fans, media, and matchday connect?
- What balance exists between simulation realism and lightweight interaction?
- Which naming/fictionalization patterns help avoid real-world licenses?
- What should be modernized for mobile-first PWA play?

## Required sources

- Public retrospectives, manuals, videos, fan wikis, and reviews.
- Use source links and avoid copying copyrighted manual text.

## Output

Write findings to `docs/60-Research/anstoss-series-deep-dive.md` with front matter.

## Acceptance criteria

- [ ] Mechanics map grouped by manager subsystem.
- [ ] Season/weekly rhythm diagram in Mermaid.
- [ ] UI/UX takeaways for mobile-first adaptation.
- [ ] IP-safe inspiration notes and hard boundaries.
- [ ] At least 10 recommendations for our MVP and post-MVP.
- [ ] Source list with retrieval date.

## Agent prompt

Research the classic Anstoss series and write a design-pattern deep dive in `docs/60-Research/anstoss-series-deep-dive.md`. Keep it IP-clean and source-linked. Do not edit app code, configs, ADRs, or other research files except a summary link if needed.

## Independence check

- File exclusivity: writes only `anstoss-series-deep-dive.md` plus optional summary link.
- Interface stability: no API/schema changes.
- Config exclusivity: no config changes.
- Parallel label: `parallel:safe`.
