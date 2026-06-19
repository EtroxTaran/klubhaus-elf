---
title: "Session handoff: FMX-185 Age Assurance Promotion"
status: current
tags: [handoff, fmx-185, age-gate, age-assurance, compliance, ratings, iarc, usk]
created: 2026-06-19
updated: 2026-06-19
type: handoff
binding: false
linear: FMX-185
related:
  - [[../../10-Architecture/09-Decisions/ADR-0112-age-assurance-and-rating-evidence-posture]]
  - [[../../40-Execution/fmx-185-age-assurance-decision-queue-2026-06-14]]
  - [[../../40-Compliance/age-assurance-and-rating-evidence]]
  - [[../../60-Research/age-assurance-and-iarc-rating-2026-06-14]]
  - [[../../60-Research/raw-perplexity/raw-age-assurance-freshness-check-2026-06-19]]
  - [[2026-06-14-fmx-185-age-assurance]]
---

# Session handoff: FMX-185 Age Assurance Promotion

## Goals

Promote FMX-185 after Nico approved the recommended D1-D6 A-set, preserve the
freshness/source-check trail, and remove stale pending/non-binding wording from
the vault front doors.

## Completed

- Moved Linear FMX-185 to `In Progress` for the approved promotion sweep.
- Worked from clean worktree `/tmp/fmx-185-age-assurance-promotion-20260619` on
  branch `codex/fmx-185-age-assurance-promotion`, based on current
  `origin/main`.
- Preserved the 2026-06-19 Perplexity freshness pass and official/source checks
  in [[../../60-Research/raw-perplexity/raw-age-assurance-freshness-check-2026-06-19]].
- Recorded Nico's D1-D6 = A/A/A/A/A/A approval in
  [[../../40-Execution/fmx-185-age-assurance-decision-queue-2026-06-14]].
- Promoted
  [[../../10-Architecture/09-Decisions/ADR-0112-age-assurance-and-rating-evidence-posture]]
  to accepted/binding.
- Promoted [[../../40-Compliance/age-assurance-and-rating-evidence]] to a
  binding planning checklist while keeping named legal/store review as a release
  gate.
- Updated privacy, auth and telemetry implementation-facing notes plus
  front-door maps and summaries.

## Open Tasks

- Run vault validators and open the PR for FMX-185.
- Legal/store review evidence is still required before public release,
  storefront submission or paid activation.
- Future DOB, parental-consent, youth-account or AVS flows remain HITL/legal
  decisions triggered only by ADR-0112 re-check conditions.

## Decisions Made

- Nico approved D1-D6 = A/A/A/A/A/A:
  - D1: 16+ self-declaration, no DOB.
  - D2: no under-16 account/refusal persistence/optional telemetry trail.
  - D3: no KJM-grade AVS at MVP.
  - D4: stable age/rating evidence home with IARC-first digital rating path.
  - D5: JMStV §7 content/business-risk watch, not a 50k MAU legal threshold.
  - D6: FMX-185 stays age assurance/rating only; responsible-gaming remains
    FMX-193.

## Blockers

No blocker remains for promoting ADR-0112. Release/legal evidence remains an
intentional downstream gate, not a blocker for this docs promotion.

## Durable Notes Updated

- [[../../60-Research/raw-perplexity/raw-age-assurance-freshness-check-2026-06-19]]
- [[../../60-Research/raw-perplexity/README]]
- [[../../60-Research/age-assurance-and-iarc-rating-2026-06-14]]
- [[../../10-Architecture/09-Decisions/ADR-0112-age-assurance-and-rating-evidence-posture]]
- [[../../40-Execution/fmx-185-age-assurance-decision-queue-2026-06-14]]
- [[../../40-Compliance/age-assurance-and-rating-evidence]]
- [[../../40-Compliance/README]]
- [[../../30-Implementation/privacy-and-consent]]
- [[../../30-Implementation/auth-flows]]
- [[../../30-Implementation/client-telemetry]]
- [[../../00-Index/Current-State]]
- [[../../00-Index/Decision-Log]]
- [[../../00-Index/Architecture-Map]]
- [[../../00-Index/Implementation-Map]]
- [[../../00-Index/Research-Map]]
- [[../../60-Research/00-summary]]
- [[README]]
- [[2026-06-14-fmx-185-age-assurance]]

## Promotion Needed

None for FMX-185. ADR-0112 and the age-assurance/rating evidence checklist are
now binding planning truth; release/legal artifacts remain downstream evidence
work.
