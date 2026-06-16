---
title: Raw - HoF Induction Voting RNG Reconciliation
status: raw
tags: [research, raw, perplexity, hall-of-fame, determinism, seeded-variance, fmx-151]
created: 2026-06-16
updated: 2026-06-16
type: research
binding: false
linear: FMX-151
related:
  - [[../hof-induction-voting-reconciliation-2026-06-16]]
  - [[raw-hof-induction-voting-source-checks-2026-06-16]]
  - [[../../10-Architecture/09-Decisions/ADR-0083-awards-honours-records-and-hall-of-fame-contract]]
  - [[../../50-Game-Design/GD-0032-awards-honours-records-and-hall-of-fame]]
---

# Raw - HoF Induction Voting RNG Reconciliation

Perplexity discovery pass for FMX-151, run after live triage found that the
vault already records the Hall-of-Fame induction decision as decided on
2026-06-08. This raw capture is preserved as a source-check supplement, not as a
new decision source.

## Prompt

For a docs-first football-manager PWA, evaluate whether in-world
Hall-of-Fame induction should be a pure deterministic formula or a
stochastic/seeded simulated voting system. Include real-world sports Hall of
Fame and football awards precedent, comparable game precedent, best-practice
recommendation for an offline/replay-safe simulation with 50-100 season saves,
and risks/mitigation knobs.

## Captured answer

Perplexity recommended a hybrid: a deterministic Hall Score formula plus a
deterministic ballot/committee presentation layer, with at most seeded
micro-variation for tie-breaking or borderline flavor. It argued this balances
real-world voting flavor with replay safety, inspectability and long-save
tuning.

Real-world patterns it cited:

- Eligibility delay / waiting periods before first consideration.
- Nomination, shortlist and reduction stages before final selection.
- Committee voting thresholds, class-size bounds and separate categories for
  players, managers/coaches and contributors.
- Opaque real-world deliberation creates drama but is hard to audit; a game
  should expose reasons, scores and ballot history.

Comparable-game patterns it claimed:

- Management/franchise games usually keep awards, records and HoF-like history
  formulaic or threshold-driven, often presented as voting.
- OOTP was described as the richest comparable HoF precedent, with formula
  preselection plus voting-style output.
- Football Manager, EHM, EA FC Career and NBA 2K-style modes were described as
  emphasizing honours, records, history pages, milestones or probability-style
  formulae rather than a fully opaque stochastic election.

Design risks and knobs:

- Long-save dilution: manage with era normalization, class-size caps,
  category-specific quotas and catch-up/historical-review paths.
- Opaque unfairness: expose the score breakdown, reasons, shortlist/decline
  text and ballot support trend.
- Replay non-determinism: use stable candidate ordering, deterministic keys,
  fixed formula versions and no wall-clock/external randomness.
- Rebalance drift: persist raw facts and formula version, and keep all HoF
  magnitudes in calibration debt.

## Raw recommendation

Perplexity's answer is stronger when read as support for FMX's existing
ratified shape than as a reason to reopen it:

- Keep the MVP decision engine pure deterministic.
- Render "voting" as deterministic presentation over the formula.
- Reserve a future seeded sub-label seam only if Nico explicitly reopens the
  feature for stochastic voting later.

## Source list returned

- Pro Football Hall of Fame selection process:
  https://www.profootballhof.com/hall-of-famers/selection-process
- College Football Hall of Fame selection process:
  https://www.cfbhall.com/selection-process/
- The Athletic explainer on Pro Football Hall of Fame voting:
  https://www.nytimes.com/athletic/7005102/2026/01/29/pro-football-hall-of-fame-voting-process-explainer/
- Yahoo Sports article on Pro Football Hall of Fame voting:
  https://sports.yahoo.com/nfl/article/bill-belichick-misses-the-hall-of-fame-explaining-the-voting-process-that-rejected-the-patriots-legend-020940141.html
- Sports Illustrated article on Pro Football Hall of Fame process debate:
  https://www.si.com/nfl/how-to-fix-pro-football-hall-of-fame-voting-process

## Related

- [[../hof-induction-voting-reconciliation-2026-06-16]]
- [[raw-hof-induction-voting-source-checks-2026-06-16]]
- [[../../10-Architecture/09-Decisions/ADR-0083-awards-honours-records-and-hall-of-fame-contract]]
- [[../../50-Game-Design/GD-0032-awards-honours-records-and-hall-of-fame]]
