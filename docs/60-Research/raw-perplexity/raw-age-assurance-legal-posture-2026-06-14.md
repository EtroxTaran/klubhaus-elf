---
title: "Raw - age assurance legal posture (FMX-185)"
status: raw
tags: [research, raw, perplexity, age-gate, age-assurance, gdpr, jmstv, privacy, legal, fmx-185]
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

# Raw - age assurance legal posture (FMX-185)

## Query

2026-06-14 Perplexity/Sonar query: Germany/EU age-gate and age-assurance
posture for an indie PWA football manager with account signup, no gambling,
no loot boxes, no UGC hosting at MVP, no optional analytics at MVP and possible
future fixed-price cosmetics/supporter purchases. Required axes: GDPR Art. 8
Germany threshold, BDSG lowering clause, JMStV/KJM strong age-verification
triggers, telemetry before account creation, under-16 refusal persistence and
whether a self-declared 16+ gate without DOB is proportionate.

No FMX private data, secrets or user data were sent.

## Captured answer

Perplexity recommended a lightweight-to-proportional approach, not full
identity-grade age verification, because the current MVP has no adult content,
gambling, paid random rewards, free-text UGC/chat or high-risk profiling.

| Topic | Captured finding |
|---|---|
| GDPR Art. 8 | Germany should be treated as age 16 for child consent. Perplexity found no German BDSG lowering clause. |
| BDSG | The answer said BDSG does not lower the GDPR Art. 8 age below 16. This needed official source checking because older vault text incorrectly cited BDSG §12. |
| JMStV/KJM AVS | Strong AVS is for adult/harmful closed-user-group content. Self-declaration is not enough there, but that is not the current FMX scope. |
| Telemetry before account | Strictly necessary security/technical logs can exist if minimised and disclosed; optional analytics/tracking should not initialise before age/consent eligibility. |
| Under-16 refusal | Perplexity suggested a minimal persistent minor flag for services that allow under-16 accounts. FMX currently refuses under-16 accounts; the stronger data-minimised line is not to store the refusal. |
| Self-declared 16+ | Adequate only as a low-risk contractual/eligibility signal, not proof of age. DOB age bands are stronger but collect more data. |

## Source-quality notes

Perplexity returned several secondary age-verification-provider and industry
links. The synthesis therefore uses this capture only as directional input and
leans on [[raw-age-assurance-source-checks-2026-06-14]] for official sources.

## Working interpretation for FMX-185

Recommend **privacy-minimal 16+ self-declaration with no DOB** because FMX
currently excludes under-16 accounts and has no optional analytics, gambling,
paid random items or adult content. Store only successful
`attested_age_band = '16+'`; do not persist the under-16 refusal; add hard
triggers for DOB/parental-consent or stronger assurance if scope changes.
