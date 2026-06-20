---
title: Compliance Evidence
status: current
tags: [compliance, legal, evidence, monetization, privacy, consumer-law, age-assurance, ratings, gdpr, retention, security, webhook, fmx-186, fmx-187]
context: audit-security
created: 2026-06-13
updated: 2026-06-19
type: index
binding: false
related:
  - [[../00-Index/Home]]
  - [[../00-Index/Current-State]]
  - [[../60-Research/monetization-legal-gates-2026-06-13]]
  - [[../60-Research/age-assurance-and-iarc-rating-2026-06-14]]
  - [[../60-Research/responsible-gaming-binding-record-2026-06-15]]
  - [[../60-Research/erasure-vs-hgb-retention-partition-2026-06-16]]
  - [[monetization-legal-gates-evidence-2026-06-13]]
  - [[age-assurance-and-rating-evidence]]
  - [[responsible-gaming]]
  - [[payment-retention-legal-review-evidence-2026-06-16]]
  - [[webhook-receiver-security-evidence-2026-06-16]]
---

# Compliance Evidence

This folder is the vault home for legal/compliance evidence, artifact checklists
and review gates. It is not a substitute for legal advice. A note here becomes a
release blocker only when an accepted ADR, approved GDDR, implementation spec or
Linear issue explicitly promotes it.

## Current notes

- [[webhook-receiver-security-evidence-2026-06-16]] - FMX-187 evidence hook
  for ADR-0128 receiver implementation: provider docs re-check, raw-body
  preservation, signature/JWT/signed-payload verification, replay/dedupe tests,
  provider reconciliation smoke, metrics/audit, payload-retention review,
  focused pentest and later bug-bounty readiness.
- [[payment-retention-legal-review-evidence-2026-06-16]] - FMX-186
  legal/accounting review gate for payment/receipt retention fields, HGB/AO
  buckets, provider split, mapping expiry and DSAR retained-set behavior.
  Promoted by accepted ADR-0127; still open before real paid activation.
- [[responsible-gaming]] - FMX-193 draft responsible-gaming compliance home:
  public statement, no paid random rewards/no dark-pattern guardrails and
  release self-audit evidence. Non-binding until ADR-0122 is accepted.
- [[monetization-legal-gates-evidence-2026-06-13]] - FMX-194 compliance artifact
  checklist for first paid monetization activation.
- [[age-assurance-and-rating-evidence]] - FMX-185 binding planning checklist
  promoted by accepted ADR-0112 for MVP age assurance, optional telemetry
  gating, IARC/USK rating evidence and youth-protection review triggers; named
  legal/store review still gates release, storefront submission and paid
  activation.
