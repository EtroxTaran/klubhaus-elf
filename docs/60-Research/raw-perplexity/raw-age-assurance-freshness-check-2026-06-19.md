---
title: "Raw age assurance freshness check (FMX-185)"
status: raw
tags: [research, raw, perplexity, source-check, age-gate, age-assurance, gdpr, jmstv, kjm, iarc, usk, ratings, compliance, fmx-185]
created: 2026-06-19
updated: 2026-06-19
type: research
binding: false
linear: FMX-185
sourceType: source-check
related:
  - [[../age-assurance-and-iarc-rating-2026-06-14]]
  - [[raw-age-assurance-legal-posture-2026-06-14]]
  - [[raw-age-rating-iarc-usk-evidence-2026-06-14]]
  - [[raw-football-manager-age-rating-precedents-2026-06-14]]
  - [[raw-age-assurance-source-checks-2026-06-14]]
  - [[../../10-Architecture/09-Decisions/ADR-0112-age-assurance-and-rating-evidence-posture]]
  - [[../../40-Compliance/age-assurance-and-rating-evidence]]
  - [[../../40-Execution/fmx-185-age-assurance-decision-queue-2026-06-14]]
---

# Raw age assurance freshness check (FMX-185)

## Capture metadata

- **Issue:** FMX-185
- **Date:** 2026-06-19
- **Purpose:** Re-check the June 14 age-assurance and IARC/USK decision packet
  before promoting ADR-0112 after Nico approved D1-D6 = A/A/A/A/A/A.
- **Status:** Raw discovery and source-check input. Binding outcome lives in
  [[../../10-Architecture/09-Decisions/ADR-0112-age-assurance-and-rating-evidence-posture]]
  and the decision record
  [[../../40-Execution/fmx-185-age-assurance-decision-queue-2026-06-14]].

## Prompt

FMX-185 has a proposed A-set for a German/EU football-manager PWA: D1 16+
self-declaration before account fields and optional telemetry, no DOB; D2 no
under-16 account/refusal persistence/optional telemetry trail; D3 no KJM-grade
AVS at MVP, only triggers for adult/harmful/gambling/paid-random/high-risk
UGC/chat scope; D4 IARC-first/USK direct only for physical or non-IARC
channels; D5 replace stale 50k MAU youth-protection-officer threshold with
JMStV §7 content/business-risk review; D6 keep responsible-gaming/no-dark-pattern
work in FMX-193.

Freshness-check whether this remains defensible as of 2026-06-19. Look for
recent changes or corrections in GDPR Art. 8 / German child consent, KJM AVS,
JMStV youth-protection representative obligations, IARC/USK digital rating
procedure and comparable low-risk football-manager game rating posture. Return
clear risks, best-practice recommendation and what should still be legal/store
review gated.

## Raw Perplexity answer summary

Perplexity did not identify a material reason to change the recommended A-set.
Its useful claims were:

- GDPR Art. 8 still supports a 16+ default child-consent threshold unless a
  Member State lowers it, and this pass did not identify a German lowering rule
  for FMX's current posture.
- A privacy-minimal self-declaration is still proportionate for a low-risk
  football-management PWA with no adult content, gambling/betting, paid random
  rewards, free-text UGC/chat or child-directed positioning.
- KJM-grade age-verification systems remain tied to adult/harmful or comparable
  high-risk access-control contexts, not to this current MVP posture.
- IARC/USK remains the right first path for participating digital storefronts;
  physical Germany distribution or non-IARC channels still require direct
  USK/legal handling.
- The old "50k MAU" trigger should not be canonized as law. Youth-protection
  representative review should stay content/business-risk and launch-operation
  based.
- Comparable football-manager precedent remains usable only as scope pressure:
  low-risk ratings depend on avoiding ads-at-launch, paid random items,
  gambling-like mechanics and uncontrolled social/UGC features.

The answer's recommendation was to promote D1-D6 as A/A/A/A/A/A, but keep
release, storefront and paid activation blocked on named legal/store review
evidence.

## Citation-quality warning

The Perplexity result is discovery input only. Durable conclusions below rely on
official or directly relevant source checks plus the June 14 raw captures:
[[raw-age-assurance-legal-posture-2026-06-14]],
[[raw-age-rating-iarc-usk-evidence-2026-06-14]],
[[raw-football-manager-age-rating-precedents-2026-06-14]] and
[[raw-age-assurance-source-checks-2026-06-14]].

## Sources checked

| Source | Relevant finding | FMX implication | Confidence |
|---|---|---|---|
| GDPR Article 8 accessible text mirror, <https://gdpr-info.eu/art-8-gdpr/>; official EU source is Regulation (EU) 2016/679 | Article 8 sets 16 as the default age at which a child may consent to information-society-service processing, allows Member States to lower that no lower than 13, and requires reasonable efforts to verify parental authorization when consent is relied on below the threshold. | The 16+ self-declaration remains the conservative MVP eligibility gate for optional consent-dependent processing. Because FMX does not plan under-16 accounts, there is no need to build a parental-consent path now. | High |
| USK IARC procedure, <https://usk.de/en/home/age-classification-for-games-and-apps/games-and-apps-in-the-iarc-system/> | USK explains that selected digital storefronts use IARC; developers answer a questionnaire in the store onboarding flow; ratings/descriptors are generated per the IARC matrix and quality-monitored by USK. | D4 stays A: IARC-first for participating digital storefronts, with saved questionnaire/certificate/rating artifacts per submitted build. | High |
| USK content-provider obligations, <https://usk.de/en/home/obligations-for-content-providers/> | USK distinguishes ordinary online game/app obligations from 16/18/adult/harmful-content handling; harmful or adult content requires closed adult-user-group treatment. | Full adult-grade AVS is a trigger-only future path, not an MVP default for the current low-risk football-management scope. | High |
| KJM technical youth protection, <https://www.kjm-online.de/themen/technischer-jugendmedienschutz/> | KJM distinguishes technical safeguards for impairing content from age-verification systems for unlawful/adult content in closed adult groups. | D3 stays A: do not deploy KJM-grade AVS unless adult/harmful or comparable high-risk scope enters planning. | High |
| USK Youth Protection Representative service, <https://usk.de/en/home/services/youth-protection-representative/> | USK frames the youth-protection representative obligation around generally accessible telemedia that may impair or harm minors, notes possible fines for non-appointment and does not present a simple 50k MAU legal threshold. | D5 stays A: replace the stale 50k MAU wording with JMStV §7 content/business-risk review before launch, monetization, rating submission, 12+ signal, chat/UGC or sustained commercial operation. | High |

## Freshness conclusion

- Promote ADR-0112 as binding because Nico approved D1-D6 and the source
  refresh did not reveal a contrary current fact.
- Keep legal/store sign-off separate: this research supports planning posture,
  not final compliance approval.
- Keep AVS, DOB, parental-consent and youth-account flows future HITL/legal
  decisions triggered only by scope changes.
- Continue to use the June 14 game-precedent research for comparable
  football-manager rating pressure; do not infer exact future store ratings from
  comparable titles.

## Related

- [[../age-assurance-and-iarc-rating-2026-06-14]]
- [[../../10-Architecture/09-Decisions/ADR-0112-age-assurance-and-rating-evidence-posture]]
- [[../../40-Compliance/age-assurance-and-rating-evidence]]
- [[../../40-Execution/fmx-185-age-assurance-decision-queue-2026-06-14]]
