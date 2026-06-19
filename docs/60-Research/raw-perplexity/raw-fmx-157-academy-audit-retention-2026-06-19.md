---
title: Raw Perplexity - FMX-157 Academy Audit and Cohort Retention
status: raw
tags: [research, raw, perplexity, fmx-157, youth, academy, retention, audit]
created: 2026-06-19
updated: 2026-06-19
type: research
binding: false
linear: FMX-157
sourceType: raw-perplexity
related:
  - [[../manager-legacy-scouting-youth-feed-followups-2026-06-19]]
  - [[raw-fmx-157-source-checks-2026-06-19]]
  - [[../../40-Execution/fmx-157-manager-legacy-scouting-youth-feed-decision-queue-2026-06-19]]
  - [[../../10-Architecture/09-Decisions/ADR-0060-youth-academy-context]]
---

# Raw Perplexity - FMX-157 Academy Audit and Cohort Retention

## Prompt focus

Research real-world academy category audits and long-save sports-management
history retention. Turn the findings into FMX options for ADR-0060's
EPPP-analogue category-audit follow-up, 20+ season cohort history and Manager &
Legacy youth signal feed.

## Captured findings

- Premier League EPPP is a long-term youth-development system from U9 to U23.
  Academies are independently audited into Category 1-4, with audit factors
  that include productivity, facilities, coaching, education and welfare.
- Category level drives funding and expectation, so the FMX analogue should not
  be a cosmetic label only. It should be a club-level academy capability signal
  with clear inputs and consequences.
- The raw pass suggested a two-season category-audit cadence, but that cadence
  came from secondary/corroborative material rather than a strong official
  primary source. Treat it as a game-design proposal, not a real-world fact.
- Long saves need history that remains inspectable after 20+ seasons without
  carrying detailed per-player/cohort payload forever in hot projections.
- Comparable management games create long-tail memory through hall-of-fame,
  records, development centre histories, historical stat lines and season
  summaries. The durable lesson is not exact UI parity, but retaining meaningful
  milestones and summaries after detailed working data cools.

## Raw recommendation

Use a hybrid retention model:

- Youth Academy owns the current and warm cohort detail.
- Full detail stays hot for the latest 5 academy seasons.
- Older cohorts keep annual summaries plus milestones for at least 20 in-game
  seasons: academy category, productivity score band, intake size band,
  promoted/loaned/released counts, top prospect references, major honours or
  senior-team breakthrough markers.
- Manager & Legacy consumes immutable season/run summary facts, not live cohort
  tables.
- A proposed academy audit Process Manager runs every 2 seasons, but the exact
  cadence and downgrade/upgrade thresholds need Nico approval and calibration.

## Source-quality notes

- The official Premier League EPPP page is strong support for the category,
  audit and factor model.
- The two-season audit cadence is weak as an external fact. It can still be a
  game-design cadence because it is readable, testable and slow enough to avoid
  churn.
- DFB/NLZ source checks were not strong enough in this pass to cite as primary
  evidence for FMX-157. Existing FMX youth research may keep DFB/NLZ as
  corroborative background, but this packet should lean on the stronger PL EPPP
  source for audit structure.

## Related

- [[../manager-legacy-scouting-youth-feed-followups-2026-06-19]]
- [[raw-fmx-157-source-checks-2026-06-19]]
- [[../../40-Execution/fmx-157-manager-legacy-scouting-youth-feed-decision-queue-2026-06-19]]
- [[../../10-Architecture/09-Decisions/ADR-0060-youth-academy-context]]
