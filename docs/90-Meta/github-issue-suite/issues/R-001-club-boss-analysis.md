<!--
id: R-001
title: [research] Analyze Club Boss gameplay and UX patterns
labels: type:research, area:research, area:gamedata, prio:high, size:m, parallel:safe
milestone: M1 Research & Architecture
depends_on: none
output: docs/60-Research/club-boss-analysis.md
-->

# [research] Analyze Club Boss gameplay and UX patterns

**ID:** R-001  
**Labels:** `type:research`, `area:research`, `area:gamedata`, `prio:high`, `size:m`, `parallel:safe`  
**Milestone:** M1 Research & Architecture  
**Depends on:** none  
**Primary output:** `docs/60-Research/club-boss-analysis.md`

## Goal

Analyze Club Boss as the closest product reference and capture transferable mechanics without copying IP, assets, naming, or UI.

## Research questions

- What are the core game loops and retention loops?
- Which manager systems are present: league, cups, transfers, youth, training, stadium, finances, fans, media?
- What UX patterns make mobile play fast or frustrating?
- Which reviews or public comments reveal strengths, pain points, monetization friction, or missing features?
- Which ideas are safe inspiration vs. IP-sensitive copying risks?

## Required sources

- Google Play listing and public screenshots: https://play.google.com/store/apps/details?id=com.GamesbyJoe.ClubBoss
- Public reviews and descriptions available without credentials.
- Public gameplay videos/articles if accessible.

## Output

Write findings to `docs/60-Research/club-boss-analysis.md` with front matter.

## Acceptance criteria

- [ ] Feature inventory grouped by system.
- [ ] UX pattern inventory with screenshots/links described in text, not copied into repo unless license-safe.
- [ ] Strengths and weaknesses table.
- [ ] At least 10 actionable product takeaways.
- [ ] IP risk notes for anything that must not be copied.
- [ ] Links/sources section with retrieval date.
- [ ] Update `docs/60-Research/00-summary.md` with a short placeholder link/reference only; do not consolidate yet.

## Agent prompt

Research Club Boss deeply. Do not copy protected assets or names. Write a structured vault note at `docs/60-Research/club-boss-analysis.md`. Keep the work independent: do not edit ADRs, app code, package manifests, or other research files except adding a single link in `docs/60-Research/00-summary.md`.

## Independence check

- File exclusivity: writes only `club-boss-analysis.md` plus optional summary link.
- Interface stability: no API/schema changes.
- Config exclusivity: no config changes.
- Parallel label: `parallel:safe`.
