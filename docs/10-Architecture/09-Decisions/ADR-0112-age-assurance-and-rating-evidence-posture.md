---
title: ADR-0112 Age Assurance and Rating Evidence Posture
status: accepted
tags: [adr, architecture, privacy, compliance, age-gate, age-assurance, iarc, usk, fmx-185]
context: audit-security
created: 2026-06-14
updated: 2026-06-19
type: adr
binding: true
amends:
  - [[ADR-0017-observability-logging]]
  - [[ADR-0063-investor-entitlement-and-payment-boundary]]
supersedes:
superseded_by:
related:
  - [[../../60-Research/age-assurance-and-iarc-rating-2026-06-14]]
  - [[../../60-Research/raw-perplexity/raw-age-assurance-legal-posture-2026-06-14]]
  - [[../../60-Research/raw-perplexity/raw-age-rating-iarc-usk-evidence-2026-06-14]]
  - [[../../60-Research/raw-perplexity/raw-football-manager-age-rating-precedents-2026-06-14]]
  - [[../../60-Research/raw-perplexity/raw-age-assurance-source-checks-2026-06-14]]
  - [[../../60-Research/raw-perplexity/raw-age-assurance-freshness-check-2026-06-19]]
  - [[../../40-Compliance/age-assurance-and-rating-evidence]]
  - [[../../40-Execution/fmx-185-age-assurance-decision-queue-2026-06-14]]
  - [[../../30-Implementation/privacy-and-consent]]
  - [[../../30-Implementation/auth-flows]]
  - [[../../30-Implementation/client-telemetry]]
---

# ADR-0112: Age Assurance and Rating Evidence Posture

## Status

accepted

> **Accepted 2026-06-19.** Nico approved D1-D6 = A/A/A/A/A/A from
> [[../../40-Execution/fmx-185-age-assurance-decision-queue-2026-06-14]] after
> a Perplexity freshness pass and source check preserved in
> [[../../60-Research/raw-perplexity/raw-age-assurance-freshness-check-2026-06-19]].
> This ADR is binding planning truth for age-assurance and rating-evidence
> posture. It is still not legal advice; public release, storefront submission
> and paid activation remain gated by named legal/store review evidence.

## Date

- Drafted: 2026-06-14 (FMX-185)
- Accepted: 2026-06-19 (Nico approved D1-D6 = A/A/A/A/A/A)

## Context

PM-2026-05-20-18-F-06 asked for an age check before telemetry/account creation,
no persisted telemetry for "under 16, exit", IARC self-rating evidence and a
youth-protection-officer trigger. Existing FMX privacy docs already define a
16+ self-declaration gate, but two issues remained:

- the old source wording cited BDSG §12 for the 16+ threshold, which official
  source checks show is incorrect;
- `docs/40-Compliance/` now exists from FMX-194, but there is no general
  age-assurance/rating evidence home.

## Options considered

### D1 - age-gate data model

| Option | Shape | Assessment |
|---|---|---|
| **A. 16+ self-declaration, no DOB** | Keep a single radio before signup fields; store only successful `attested_age_band = '16+'`; do not store refusals. | **Recommended.** Best data-minimisation fit for current low-risk scope. |
| B. DOB converted to age bands | Ask DOB, derive `<13` / `13-15` / `16+`, store age band only. | Stronger signal but collects more data and implies youth-account policy now. |
| C. Parent/guardian consent flow | Allow under-16 accounts with verified parent consent. | Reject for MVP; high ops/legal burden and not needed for target audience. |

### D2 - under-16 refusal and telemetry

| Option | Shape | Assessment |
|---|---|---|
| **A. Hard no-account refusal, no persisted refusal, no optional telemetry** | "No" routes to offline/no-account play; optional analytics/marketing never initialises; only strictly necessary security/technical logs may exist. | **Recommended.** Satisfies PM-18 F-06 and avoids creating a children's-data record. |
| B. Persist a minor flag | Store `<16` to block future consent-based processing. | Useful only if under-16 accounts are allowed, which FMX does not plan at MVP. |
| C. Allow account with restricted features | Youth accounts with disabled analytics/purchases/social. | Defer; reopens product scope and parental-control policy. |

### D3 - strong age verification

| Option | Shape | Assessment |
|---|---|---|
| **A. No KJM-grade AVS at MVP** | Use low-risk self-declaration and re-check if scope changes. | **Recommended.** KJM AVS is for closed adult/harmful content groups, not current FMX. |
| B. Plug-ready external AVS seam | Design but do not activate an AV provider seam. | Accept only when a high-risk feature enters planning. |
| C. Deploy AVS now | ID/liveness/eID-style checks before signup. | Reject; disproportionate and privacy-heavy for current scope. |

### D4 - rating evidence home

| Option | Shape | Assessment |
|---|---|---|
| **A. Stable compliance evidence note** | `docs/40-Compliance/age-assurance-and-rating-evidence.md` stores age gate, IARC/USK evidence and re-check triggers. | **Recommended.** One durable home across releases. |
| B. Keep only FMX-194 paid checklist | Age/rating evidence remains nested under monetization. | Reject; FMX-185 is broader than paid checkout. |
| C. Per-release folders now | Create release-specific evidence trees before any release exists. | Overkill in docs phase; use the stable note plus future release artifacts. |

### D5 - youth protection officer trigger

| Option | Shape | Assessment |
|---|---|---|
| **A. JMStV §7 content/business-risk watch** | Replace the stale 50k MAU trigger with content/rating/commercial-operation review and the small-provider self-regulation carve-out. | **Recommended.** Matches current official checks. |
| B. Appoint external JmSchB immediately | External officer/USK membership now. | Conservative but premature for docs-only low-risk MVP planning. |
| C. Keep 50k MAU threshold | Preserve pre-mortem wording unchanged. | Reject; source checks did not support it as a legal threshold. |

### D6 - scope split

| Option | Shape | Assessment |
|---|---|---|
| **A. FMX-185 owns age/rating only** | Responsible-gaming/no-dark-pattern statement remains FMX-193, with cross-links. | **Recommended.** Avoids duplicate compliance records. |
| B. Merge FMX-193 into FMX-185 | Add responsible-gaming statement now. | Too broad for one legal beat. |

## Decision

Accepted **D1=A, D2=A, D3=A, D4=A, D5=A, D6=A**:

- Account signup keeps a mandatory 16+ self-declaration before account fields.
- The account system stores only successful `attested_age_band = '16+'`; it
  stores no DOB and no under-16 refusal.
- The refusal path creates no account, no optional telemetry and no queued
  optional event; it routes only to no-account offline play.
- Optional analytics/marketing SDKs remain disabled until age/consent
  eligibility exists and a future consent layer is approved.
- Full KJM-style AVS is a trigger-only future path for adult, harmful,
  gambling/betting-like, paid-random, high-risk social/UGC or comparable scope.
- Rating evidence lives in
  [[../../40-Compliance/age-assurance-and-rating-evidence]].
- "50k MAU Jugendschutzbeauftragter trigger" is replaced by JMStV §7
  content/business-risk review plus the statutory self-regulation carve-out
  for small providers.

## Consequences

- FMX keeps a privacy-minimal age posture and avoids DOB processing.
- The age gate is not represented as proof of age; it is a proportional
  low-risk eligibility signal.
- Future analytics, ads, paid flows, UGC/chat, paid random items or app-store
  releases have explicit re-check triggers.
- FMX-194 remains the paid-activation legal gate; FMX-185 supplies the general
  age/rating evidence home that FMX-194 can reference.

## Related

- [[../../60-Research/age-assurance-and-iarc-rating-2026-06-14]]
- [[../../60-Research/raw-perplexity/raw-age-assurance-freshness-check-2026-06-19]]
- [[../../40-Compliance/age-assurance-and-rating-evidence]]
- [[../../40-Execution/fmx-185-age-assurance-decision-queue-2026-06-14]]
- [[../../30-Implementation/privacy-and-consent]]
- [[../../30-Implementation/auth-flows]]
- [[../../30-Implementation/client-telemetry]]
