---
title: FMX-185 age assurance handoff
status: promoted
tags: [execution, handoff, age-gate, age-assurance, compliance, fmx-185]
created: 2026-06-14
updated: 2026-06-19
type: handoff
binding: false
linear: FMX-185
related:
  - [[2026-06-19-fmx-185-age-assurance-promotion]]
  - [[../../60-Research/age-assurance-and-iarc-rating-2026-06-14]]
  - [[../../40-Compliance/age-assurance-and-rating-evidence]]
  - [[../../10-Architecture/09-Decisions/ADR-0112-age-assurance-and-rating-evidence-posture]]
  - [[../fmx-185-age-assurance-decision-queue-2026-06-14]]
---

# FMX-185 age assurance handoff

> **Promoted 2026-06-19 by [[2026-06-19-fmx-185-age-assurance-promotion]].**
> Nico approved D1-D6 = A/A/A/A/A/A; ADR-0112 is now accepted/binding. This
> older handoff remains the original research-session record.

## Goals

- Preserve raw research and source checks for age-gate, age-assurance and
  IARC/USK rating readiness.
- Correct stale legal wording around BDSG §12 and the 50k MAU
  youth-protection-officer trigger.
- Prepare a non-binding Nico decision packet.

## Completed

- Claimed branch/worktree:
  `codex/fmx-185-age-gate-age-assurance`.
- Saved raw Perplexity captures and official/source checks under
  `docs/60-Research/raw-perplexity/`.
- Added synthesis:
  [[../../60-Research/age-assurance-and-iarc-rating-2026-06-14]].
- Added compliance evidence home:
  [[../../40-Compliance/age-assurance-and-rating-evidence]].
- Added draft ADR:
  [[../../10-Architecture/09-Decisions/ADR-0112-age-assurance-and-rating-evidence-posture]].
- Added HITL queue:
  [[../fmx-185-age-assurance-decision-queue-2026-06-14]].
- Updated privacy/auth/telemetry docs and front-door indexes.

## Open Tasks

- Legal review still required before public release or any paid activation.

## Decisions Made

No binding project decisions were made in this original research session.
Nico approved the recommended D1/D2/D3/D4/D5/D6 = A/A/A/A/A/A packet later on
2026-06-19; see [[2026-06-19-fmx-185-age-assurance-promotion]].

## Blockers

- Historical blocker resolved 2026-06-19. ADR-0112 is accepted/binding.

## Durable Notes Updated

- [[../../60-Research/age-assurance-and-iarc-rating-2026-06-14]]
- [[../../40-Compliance/age-assurance-and-rating-evidence]]
- [[../../10-Architecture/09-Decisions/ADR-0112-age-assurance-and-rating-evidence-posture]]
- [[../fmx-185-age-assurance-decision-queue-2026-06-14]]
- [[../../30-Implementation/privacy-and-consent]]
- [[../../30-Implementation/auth-flows]]
- [[../../30-Implementation/client-telemetry]]
- [[../../60-Research/gdpr-compliance]]

## Promotion Needed

None. Promotion completed 2026-06-19 in
[[2026-06-19-fmx-185-age-assurance-promotion]].
