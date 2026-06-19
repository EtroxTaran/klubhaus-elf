---
title: "Age assurance and IARC rating evidence (FMX-185)"
status: current
tags: [research, synthesis, age-gate, age-assurance, gdpr, jmstv, kjm, iarc, usk, compliance, fmx-185]
created: 2026-06-14
updated: 2026-06-19
type: research
binding: false
linear: FMX-185
related:
  - [[raw-perplexity/raw-age-assurance-legal-posture-2026-06-14]]
  - [[raw-perplexity/raw-age-rating-iarc-usk-evidence-2026-06-14]]
  - [[raw-perplexity/raw-football-manager-age-rating-precedents-2026-06-14]]
  - [[raw-perplexity/raw-age-assurance-source-checks-2026-06-14]]
  - [[raw-perplexity/raw-age-assurance-freshness-check-2026-06-19]]
  - [[../40-Compliance/age-assurance-and-rating-evidence]]
  - [[../10-Architecture/09-Decisions/ADR-0112-age-assurance-and-rating-evidence-posture]]
  - [[../40-Execution/fmx-185-age-assurance-decision-queue-2026-06-14]]
  - [[gdpr-compliance]]
  - [[../30-Implementation/privacy-and-consent]]
  - [[../30-Implementation/auth-flows]]
  - [[../30-Implementation/client-telemetry]]
---

# Age assurance and IARC rating evidence (FMX-185)

## Scope

FMX-185 turns PM-2026-05-20-18-F-06 into a durable age-gate,
age-assurance and age-rating evidence packet for the current PWA planning
phase.

This note is research and product/compliance planning, not legal advice. The
binding decision home is
[[../10-Architecture/09-Decisions/ADR-0112-age-assurance-and-rating-evidence-posture|ADR-0112]]
and the HITL decision record is
[[../40-Execution/fmx-185-age-assurance-decision-queue-2026-06-14]].

## Evidence synthesis

### GDPR / age gate

The existing FMX privacy posture is mostly right: a 16+ self-declaration gate,
no date of birth, no parental-consent flow at MVP and successful-account
persistence only as `attested_age_band = '16+'`.

FMX-185 corrects the legal footing:

- GDPR Art. 8 sets 16 as the default age for a child's own consent to
  information-society-service processing and lets Member States lower it only
  down to 13.
- Official BDSG source checks found no child-consent lowering section; the
  older "BDSG §12" reference is wrong because §12 concerns the Federal
  Commissioner's official relationship.
- FMX's core account processing remains Art. 6(1)(b) contract, not a
  consent-based child processing model. The 16+ gate is still important because
  future optional analytics/marketing or high-risk features cannot rely on an
  under-16 user's own consent.

### Telemetry and under-16 refusal

For this proposal, PM-18 F-06 is treated as the stricter product safety
requirement:

- the age question must appear before account creation fields and before any
  optional analytics/marketing SDK initialises;
- the "No, under 16" path must not create an account, must not persist the
  refusal, must not write optional telemetry and must route to no-account
  offline play only;
- strictly necessary security/technical logs can exist only if minimised,
  disclosed and kept separate from optional analytics/product telemetry.

### JMStV / KJM AVS

KJM-grade AVS is not the current FMX baseline. Official KJM/USK checks point to
strong AVS for closed adult groups and harmful/adult telemedia content, with
adult identification plus per-session authentication. Current FMX scope has no
adult content, gambling, betting, paid random rewards, free-text UGC/chat or
harmful-content positioning, so full AVS is disproportionate.

Strong age verification becomes a re-evaluation trigger if FMX adds adult,
harmful, gambling/betting-like, paid-random, high-risk social/UGC or comparable
scope.

### Youth protection officer

The pre-mortem's "50k MAU" trigger is not supported as a legal threshold by the
current official checks. JMStV §7 is content/business-risk based: generally
accessible telemedia that can impair development or endanger youth need a
youth protection officer. Small providers with fewer than 50 employees or
fewer than 10 million monthly average accesses per year have a statutory
self-regulation carve-out if they join a voluntary self-regulation body and
assign it the duties.

Recommended FMX stance: document a watch trigger now and re-check before public
launch, monetization, USK/IARC rating submission, any USK 12+ content signal,
chat/UGC or sustained commercial operation. Do not encode "50k MAU" as law.

### IARC / USK evidence

IARC is the right digital-storefront evidence path when FMX ships through a
participating storefront. Official IARC/USK checks confirm that:

- developers complete the IARC questionnaire through participating storefront
  ingestion;
- ratings via IARC are free of cost to developers at this time;
- the certificate/code and regional ratings/descriptors should be saved;
- IARC ratings are platform-bound and physical Germany releases require
  standard USK classification.

FMX therefore needs a stable evidence home that stores build-versioned
questionnaire, content inventory, interactive-element disclosures, store
metadata, rating certificate IDs and rating-impact change logs.

### Comparable games

Football-management genre precedent supports a low-risk rating target only if
FMX keeps its safer scope:

- Football Manager 26 Touch on Apple Arcade is 4+, no ads and no IAP.
- Top Eleven, OSM and Soccer Manager can carry low Google/Apple ratings while
  using ads/IAP; Top Eleven and OSM also expose "includes random items" style
  descriptors.
- Hattrick is a long-running free web football manager with optional Supporter
  subscription for analysis/customisation/interaction tools.

FMX should choose the lower-risk side of that precedent: no paid random items,
no launch ads, no launch free-text chat/UGC, and exact rating artifacts saved
before any app-shell/store release.

## 2026-06-19 freshness and approval delta

Nico approved the recommended D1-D6 packet as A/A/A/A/A/A on 2026-06-19, after
the freshness pass and official/source checks preserved in
[[raw-perplexity/raw-age-assurance-freshness-check-2026-06-19]]. That pass did
not find a material reason to change the June 14 recommendation:

- GDPR Art. 8 still supports using 16 as the conservative child-consent
  threshold for optional consent-dependent processing.
- KJM-grade AVS remains a trigger-only future path for adult/harmful or
  comparable high-risk scope, not the current low-risk MVP default.
- IARC/USK remains the preferred digital-storefront rating path for
  participating storefronts; physical Germany/non-IARC channels still require
  direct USK/legal handling.
- The old "50k MAU" youth-protection-officer trigger remains unsupported as a
  legal threshold and is replaced by JMStV §7 content/business-risk review.

## Approved packet

| Decision | Approved option | Rationale |
|---|---|---|
| D1 age-gate data model | **A. Keep 16+ self-declaration, no DOB, store only successful `attested_age_band = '16+'`.** | Best data-minimisation fit for current low-risk MVP and existing privacy surface. |
| D2 under-16 refusal and telemetry | **A. Hard no-account refusal, no persisted refusal, no optional telemetry; offline/no-account route only.** | Satisfies PM-18 F-06 while avoiding a children's-data record. |
| D3 AVS strictness | **A. No KJM-grade AVS at MVP; re-check only on adult/harmful/gambling/UGC/high-risk scope.** | Official KJM AVS criteria are for closed adult groups, not this MVP scope. |
| D4 IARC/USK evidence home | **A. Stable `docs/40-Compliance/age-assurance-and-rating-evidence.md`.** | One place to reconstruct rating and age-assurance decisions per build/release. |
| D5 youth protection officer trigger | **A. Replace 50k MAU with JMStV §7 content/business-risk watch plus self-regulation carve-out.** | Current source checks do not support 50k MAU as law. |
| D6 scope split | **A. Keep FMX-185 to age assurance/rating evidence; leave responsible-gaming/no-dark-pattern statement to FMX-193.** | Prevents overlapping legal/product packets while preserving cross-links. |

## Decision outcome

ADR-0112 is accepted/binding for planning. Legal/store review remains required
before public release, storefront submission or paid activation.

## Related

- [[raw-perplexity/raw-age-assurance-legal-posture-2026-06-14]]
- [[raw-perplexity/raw-age-rating-iarc-usk-evidence-2026-06-14]]
- [[raw-perplexity/raw-football-manager-age-rating-precedents-2026-06-14]]
- [[raw-perplexity/raw-age-assurance-source-checks-2026-06-14]]
- [[raw-perplexity/raw-age-assurance-freshness-check-2026-06-19]]
- [[../40-Compliance/age-assurance-and-rating-evidence]]
- [[../10-Architecture/09-Decisions/ADR-0112-age-assurance-and-rating-evidence-posture]]
- [[../40-Execution/fmx-185-age-assurance-decision-queue-2026-06-14]]
