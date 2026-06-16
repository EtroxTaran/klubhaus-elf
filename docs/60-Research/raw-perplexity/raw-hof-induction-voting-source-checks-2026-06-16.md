---
title: Raw Source Checks - HoF Induction Voting RNG
status: raw
tags: [research, raw, source-check, hall-of-fame, determinism, seeded-variance, fmx-151]
created: 2026-06-16
updated: 2026-06-16
type: research
binding: false
linear: FMX-151
related:
  - [[../hof-induction-voting-reconciliation-2026-06-16]]
  - [[raw-hof-induction-voting-rng-2026-06-16]]
  - [[raw-awards-honours-records-hof-games-2026-06-06]]
  - [[raw-awards-honours-records-hof-realworld-2026-06-06]]
  - [[raw-awards-honours-records-hof-determinism-2026-06-06]]
  - [[../../10-Architecture/09-Decisions/ADR-0083-awards-honours-records-and-hall-of-fame-contract]]
  - [[../../50-Game-Design/GD-0032-awards-honours-records-and-hall-of-fame]]
---

# Raw Source Checks - HoF Induction Voting RNG

## Checked sources

| Source | Type | Useful evidence | Limits |
|---|---|---|---|
| Pro Football Hall of Fame, "Selection Process", https://www.profootballhof.com/hall-of-famers/selection-process | Primary Hall of Fame process | Committee selection, annual selection meeting, class-size bounds, 80% approval threshold, five-season player waiting rule, separate seniors/coach/contributor handling. | American football, not association football; useful for selection structure, not exact FMX thresholds. |
| College Football Hall of Fame, "Inductees Selection Process", https://www.cfbhall.com/selection-process/ | Primary Hall of Fame process | Eligibility criteria, ten-season player delay, 50-year window, coach criteria, screening committees, national ballot and Honors Court final class decision. | College-specific and values citizen/academic criteria; use as a model for multi-stage filters and published rules only. |
| Premier League Hall of Fame public material and reporting surfaced by search | Football-domain precedent | Public shortlist/fan-vote/panel patterns and player eligibility constraints support a player-facing ballot presentation layer. | Public pages were less stable through search than Pro/College HOF pages; use as football color, not as a hard source for FMX architecture. |
| [[raw-awards-honours-records-hof-games-2026-06-06]] | Existing FMX Perplexity capture | Comparable-game pattern: save-bound history, OOTP-like hybrid HoF, FM/EHM history and records, design lessons favoring deterministic inspectable induction when predictability matters. | The file itself warns that citations were general; use as genre-pattern evidence, not primary proof of exact product internals. |
| [[raw-awards-honours-records-hof-realworld-2026-06-06]] | Existing FMX Perplexity capture | Real-world taxonomy: eligibility waiting period, categories, nomination/balloting/vote thresholds, formal HoF vs narrative legend split. | Taxonomy synthesis, not direct law or official football governance. |
| [[raw-awards-honours-records-hof-determinism-2026-06-06]] | Existing FMX Perplexity capture | Determinism pattern: raw facts, immutable snapshots, versioned formula, fixed-point scores, cross-save read-only-at-world-gen, and top-N profile index. | Architecture reasoning aligned to FMX; not an external standard. |
| [[../../40-Execution/decision-queue-2026-06-08-ratified]] | FMX decision record | ADR-0083 scope call was decided: pure deterministic HoF induction in MVP, reserve existing-stream sub-label seam for later seeded voting, keep D4=B full HoF in MVP. | Historical ratification record; this FMX-151 beat reconciles stale downstream wording to it. |
| [[../../00-Index/Open-Decisions-Dossier]] | FMX front-door decision dossier | Mini point M2 already records pure formula for MVP and later stochastic voting only via an existing stream sub-label, not a new top-level RNG. | Some nearby text still mentions ADR-0113 pending principle; do not reinterpret accepted ADR-0083 from draft ADR-0113. |

## Source-check conclusions

1. **Real-world precedent supports structure, not hidden dice.** Hall processes
   use eligibility gates, class bounds, categories, committees and thresholds.
   FMX should borrow those as deterministic rules and player-facing ceremony,
   not as opaque randomness.
2. **Comparable-game evidence is pattern-level.** Prior FMX captures support the
   genre pattern of formulaic or thresholded awards/history/HoF systems, but the
   direct citations are too weak to canonize exact OOTP/FM/NBA 2K internals.
3. **FMX determinism evidence is decisive.** ADR-0051, FMX-90, ADR-0081 and
   ADR-0083 already require raw facts, versioned formulas, immutable watermarks
   and read-only-at-world-gen cross-save state.
4. **The June 8 record closes FMX-151's live fork.** The active decision is pure
   deterministic induction for MVP. Future stochastic voting is a fresh Nico
   decision, constrained to an existing owner stream sub-label.
5. **No exact RNG sub-label should be pinned now.** Pinning a future stochastic
   label during a reconciliation beat would create unneeded surface area and
   contradict the "no active seeded voting" MVP decision.

## Related

- [[../hof-induction-voting-reconciliation-2026-06-16]]
- [[raw-hof-induction-voting-rng-2026-06-16]]
- [[../../10-Architecture/09-Decisions/ADR-0083-awards-honours-records-and-hall-of-fame-contract]]
- [[../../50-Game-Design/GD-0032-awards-honours-records-and-hall-of-fame]]
