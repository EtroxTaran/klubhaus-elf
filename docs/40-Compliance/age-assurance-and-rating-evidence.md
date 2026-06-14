---
title: "Age assurance and rating evidence"
status: current
tags: [compliance, legal, age-gate, age-assurance, ratings, iarc, usk, pegi, privacy, fmx-185]
created: 2026-06-14
updated: 2026-06-14
type: compliance
binding: false
linear: FMX-185
related:
  - [[README]]
  - [[../60-Research/age-assurance-and-iarc-rating-2026-06-14]]
  - [[../60-Research/raw-perplexity/raw-age-assurance-source-checks-2026-06-14]]
  - [[../10-Architecture/09-Decisions/ADR-0112-age-assurance-and-rating-evidence-posture]]
  - [[../40-Execution/fmx-185-age-assurance-decision-queue-2026-06-14]]
  - [[../30-Implementation/privacy-and-consent]]
  - [[../30-Implementation/auth-flows]]
  - [[../30-Implementation/client-telemetry]]
---

# Age assurance and rating evidence

## Status

Current planning checklist. **Not legal advice and not legally approved.** This
note becomes a release blocker only if Nico accepts ADR-0112 or a later legal
review promotes it.

## Current posture

| Surface | Current evidence / requirement | Status |
|---|---|---|
| Age gate | 16+ self-declaration before account fields; no DOB; successful account stores only `attested_age_band = '16+'`. | proposed |
| Under-16 refusal | No account, no persisted "No", no optional telemetry; route to no-account offline play. | proposed |
| Optional telemetry | No analytics/marketing SDK before age/consent eligibility. MVP has no product analytics. | proposed |
| Strong AVS | Not required for current low-risk MVP; trigger on adult/harmful/gambling/betting-like/paid-random/high-risk UGC/chat scope. | proposed |
| IARC evidence | Save questionnaire export/screenshots, certificate/code, regional ratings, descriptors and storefront metadata per submitted build. | proposed |
| USK path | Digital IARC storefront path first; physical Germany release or non-IARC channel requires direct USK/legal review. | proposed |
| Youth protection officer | Re-check JMStV §7 before public launch, monetization, USK/IARC submission, USK 12+ signal, chat/UGC or sustained commercial operation; do not use 50k MAU as a legal threshold. | proposed |
| Legal review | Named reviewer, date, scope, residual risks and go/no-go before public release or paid activation. | proposed |

## Evidence to save per rating-relevant release

| Bucket | Required evidence |
|---|---|
| Build identity | Release id, build hash/artifact id, date, platform/storefront and submitted package/source snapshot. |
| Content inventory | Rating-relevant content matrix: violence, fear, language, sexuality, drugs, gambling/betting, paid random items, ads, chat/UGC, user interaction, location/internet access. |
| Fictional-content proof | Naming-schema/IP-safe generation evidence and screens showing no real club/player data in FMX-authored content. |
| Age-gate proof | Screens/spec for the 16+ question, refusal copy, offline-route copy and no-persist/no-telemetry enforcement test. |
| Monetization proof | All SKUs, prices, entitlements, fixed-price/non-random statement and no-P2W linkage if paid scope is active. |
| IARC/USK artifacts | Completed questionnaire export/screenshots, IARC certificate/code, regional ratings, descriptors, store metadata and any reviewer correspondence. |
| Change log | Dated rating-impact changes for content, online features, ads, chat/UGC, purchases or age-assurance flow. |
| Review trail | Product/legal sign-off, known residual risks and next re-check date. |

## Re-check triggers

- Any optional analytics, marketing, ad network or profiling scope.
- Any real-money flow, paid currency, subscription, supporter pack or native
  app-shell IAP.
- Any paid random item, loot-box-like mechanic, gambling/betting-like theme or
  casino metaphor.
- Any free-text chat, UGC hosting, public profile sharing or user-to-user
  messaging.
- Any content likely to move rating to USK 12+/PEGI 12+/Teen or adult/harmful
  territory.
- Any non-IARC distribution channel, physical/retail Germany release or use of
  rating labels outside the connected IARC platform.
- Sustained commercial operation or launch-readiness review that may trigger
  JMStV §7 youth-protection-officer handling.

## Related

- [[../60-Research/age-assurance-and-iarc-rating-2026-06-14]]
- [[../10-Architecture/09-Decisions/ADR-0112-age-assurance-and-rating-evidence-posture]]
- [[../40-Execution/fmx-185-age-assurance-decision-queue-2026-06-14]]
- [[../30-Implementation/privacy-and-consent]]
- [[monetization-legal-gates-evidence-2026-06-13]]
