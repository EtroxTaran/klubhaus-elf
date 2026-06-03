---
title: Handoff FMX-99 Onboarding 60-second flow and guided first season
status: wrapped
tags: [meta, execution, handoff, onboarding, ftue, guided-season, fmx-99]
created: 2026-06-03
updated: 2026-06-03
type: handoff
binding: false
related:
  - [[../../60-Research/onboarding-guided-first-season-2026-06-03]]
  - [[../../60-Research/raw-perplexity/raw-onboarding-guided-first-season-2026-06-03]]
  - [[../../50-Game-Design/GD-0012-onboarding]]
  - [[../../50-Game-Design/onboarding-and-tutorial]]
  - [[../../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]]
---

# Handoff: FMX-99 Onboarding guided first season (2026-06-03)

## Goals

- Resolve GD-0012 R2-05: exact 60-second FTUE definition, guided first-season
  sequence, deterministic feed-card priority formula and onboarding a11y path.
- Ground decisions in mobile FTUE best practice, football-manager genre precedent
  and real first-season manager priorities.
- Keep the work docs-vault-only; no app implementation exists in this phase.

## Completed

- Synced local `main` to `origin/main` (`09a2f02`, includes FMX-98 and FMX-91).
- Claimed Linear FMX-99 by moving it to `In Progress`.
- Created branch `codex/fmx-99-onboarding-guided-first-season`.
- Ran Perplexity research on mobile FTUE, genre onboarding comparisons and
  real-world lower/mid-tier first-season manager priorities; cross-checked WCAG
  2.2 against W3C.
- Recorded raw research:
  [[../../60-Research/raw-perplexity/raw-onboarding-guided-first-season-2026-06-03]].
- Added synthesis:
  [[../../60-Research/onboarding-guided-first-season-2026-06-03]].
- Updated [[../../50-Game-Design/GD-0012-onboarding]] to `approved`, closing R2-05
  after Nico selected current FTUE path / Objective roadmap / Wage runway.
- Updated [[../../50-Game-Design/onboarding-and-tutorial]] so Season 1 is an
  objective roadmap with the 12-message inbox arc as support.
- Anchored Current-State, Research-Map, Game-Design-Map, Game Design Hub and raw
  Perplexity index.

## Open Tasks

- Run `node scripts/docs-check.mjs`.
- Commit, push and open PR with first body line `Closes FMX-99`.
- Move Linear FMX-99 to `In Review` after the PR exists.

## Decisions Made

- **D1:** 60-second target measures first meaningful tactical choice, not match kickoff.
- **D2:** Current FTUE path remains: experience -> mode -> Roguelite setup ->
  Home feed-card -> playstyle.
- **D3:** Season 1 uses a feed-card Objective roadmap; inbox supports with voice/context.
- **D4:** First economy lesson is wage runway, not matchday revenue or full finance cockpit.
- **D5:** `playerBehaviourAdjust` is per-save only; no cross-save profiling.
- **D6:** Assistant can prepare drafts on Easy/Normal but cannot submit authoritative
  actions without explicit user confirmation.

## Blockers

- No product blocker. Live stopwatch evidence is impossible until a prototype exists; the
  GDDR now records the test protocol and build gate.

## Durable Notes Updated

- `docs/60-Research/raw-perplexity/raw-onboarding-guided-first-season-2026-06-03.md`
- `docs/60-Research/onboarding-guided-first-season-2026-06-03.md`
- `docs/50-Game-Design/GD-0012-onboarding.md`
- `docs/50-Game-Design/onboarding-and-tutorial.md`
- `docs/00-Index/Current-State.md`
- `docs/00-Index/Research-Map.md`
- `docs/00-Index/Game-Design-Map.md`
- `docs/50-Game-Design/README.md`
- `docs/60-Research/raw-perplexity/README.md`

## Promotion Needed

- None inside the docs phase. A future implementation beat must run the stopwatch
  protocol before claiming the 60-second target is empirically met.
