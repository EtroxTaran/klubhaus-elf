---
title: "Raw - age rating IARC/USK evidence (FMX-185)"
status: raw
tags: [research, raw, perplexity, iarc, usk, pegi, ratings, compliance, fmx-185]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
linear: FMX-185
related:
  - [[../age-assurance-and-iarc-rating-2026-06-14]]
  - [[raw-age-assurance-source-checks-2026-06-14]]
  - [[../../40-Compliance/age-assurance-and-rating-evidence]]
  - [[../../10-Architecture/09-Decisions/ADR-0112-age-assurance-and-rating-evidence-posture]]
  - [[../../40-Execution/fmx-185-age-assurance-decision-queue-2026-06-14]]
---

# Raw - age rating IARC/USK evidence (FMX-185)

## Query

2026-06-14 Perplexity/Sonar query: IARC/USK/PEGI/app-store rating readiness for
a Germany/EU indie PWA football manager with no loot boxes, no gambling,
fictional clubs/players and possible future fixed-price non-random purchases.
Required axes: IARC cost, artifacts to save, USK direct classification triggers
and contents of a `docs/40-Compliance` evidence home.

No FMX private data, secrets or user data were sent.

## Captured answer

Perplexity recommended a compact build-specific evidence pack that can prove
what the game contains, what it does not contain, what was submitted and when
rating-relevant scope changed.

| Evidence bucket | Captured items |
|---|---|
| Game content | Representative gameplay/screens, content inventory, fictional naming evidence and absence evidence for gambling, loot boxes, paid random rewards, casino metaphors and adult content. |
| Monetization | Current monetization spec, every SKU/entitlement, fixed-price vs random distinction, store IAP screenshots and dated diffs when monetization changes. |
| Rating submission | Completed IARC questionnaire export/screenshots, IARC certificate/code, regional ratings, store metadata values, reviewer correspondence and resubmission trail. |
| Release/change | Build hash/version, release notes and rating-impact changelog for content, online features, ads, chat/UGC and purchases. |

## Source-quality notes

The answer mixed official IARC/USK links with secondary startup/legal articles.
Official follow-up checks in [[raw-age-assurance-source-checks-2026-06-14]]
confirm the important parts: IARC is no-cost to developers through
participating storefronts, IARC ratings are tied to IARC storefronts, physical
Germany releases require standard USK classification, and online/digital offers
must display applicable age labels/descriptors where required.

## Working interpretation for FMX-185

Create one stable compliance home:
[[../../40-Compliance/age-assurance-and-rating-evidence]]. It should hold the
current age-gate concept, IARC/USK evidence checklist, rating-relevant content
inventory, release/change trigger log, youth-protection-officer trigger and
legal-review status. FMX-194 keeps paid-checkout legal gates; FMX-185 owns the
general age-assurance/rating evidence home.
