---
title: "Monetization legal gates evidence (FMX-194)"
status: current
tags: [compliance, legal, monetization, payment, refund, age-gate, consumer-law, gdpr, retention, security, webhook, fmx-194, fmx-186, fmx-187]
context: audit-security
created: 2026-06-13
updated: 2026-06-16
type: compliance
binding: false
linear: FMX-194
related:
  - [[README]]
  - [[../60-Research/monetization-legal-gates-2026-06-13]]
  - [[../60-Research/raw-perplexity/raw-monetization-legal-source-checks-2026-06-13]]
  - [[../10-Architecture/09-Decisions/ADR-0109-payment-provider-and-monetization-legal-gates]]
  - [[../40-Execution/fmx-194-monetization-legal-gates-decision-queue-2026-06-13]]
  - [[payment-retention-legal-review-evidence-2026-06-16]]
  - [[../10-Architecture/09-Decisions/ADR-0127-erasure-vs-hgb-retention-field-partition]]
  - [[webhook-receiver-security-evidence-2026-06-16]]
  - [[../10-Architecture/09-Decisions/ADR-0128-webhook-receiver-security-contract]]
---

# Monetization legal gates evidence (FMX-194)

## Status

Current planning checklist. **Not legally approved.** This checklist becomes a
hard release gate only if Nico approves FMX-194 D5 and ADR-0109 is accepted.

## Paid activation gate

No real-money payment flow should be enabled in web/PWA or app-shell builds until
all required entries are green and legal review signs off.

| Gate | Required evidence | Owner before launch | Status |
|---|---|---|---|
| Terms / AGB / EULA | Dated version, public URL or artifact snapshot, legal-reviewed purchase and account clauses. | Legal / Nico | proposed |
| Withdrawal waiver | Separate immediate-delivery consent and acknowledgement text, no pre-tick, version id stored on purchase. | Legal / Product | proposed |
| Order confirmation | Email template with purchase, price/tax, timestamp, support contact and withdrawal consequence. | Legal / Product | proposed |
| Imprint | German DDG §5-style provider identification page, public URL, legal entity data verified. | Legal / Ops | proposed |
| Privacy policy | GDPR policy with account, payment, telemetry, support, retention, user rights and minors handling. | Legal / Privacy | proposed |
| Payment/receipt retention partition | FMX-186 field table, HGB/AO 10/8/6 bucket confirmation, finance-key separation and DSAR retained-set behavior reviewed via [[payment-retention-legal-review-evidence-2026-06-16]]. | Legal / Accounting / Privacy | proposed |
| DPA / AVV register | Hosting, email, analytics, payment, support and logging processors listed with contract status. | Legal / Ops | proposed |
| Payment provider contract | MoR/direct PSP/IAP terms, fee/tax responsibility, data processing role, payout and dispute terms reviewed. | Legal / Finance | proposed |
| Refund runbook | Withdrawal, defects, unauthorized/minor purchase, chargeback, goodwill and abuse workflows. | Legal / Support | proposed |
| Age-gate concept | Declared-age flow, under-16 Germany behavior, no optional tracking/marketing for minors, escalation triggers. | Product / Privacy | proposed |
| Rating evidence | IARC/USK/PEGI or store rating questionnaire/result for app-shell release; web self-classification note. | Product / Legal | proposed |
| Provider sandbox smoke | Checkout, ADR-0128 webhook verification/replay/dedupe, refund/void/revoke and reconciliation smoke results saved via [[webhook-receiver-security-evidence-2026-06-16]]. | Engineering | proposed |
| Kill switch | Feature flag and operational runbook that can disable paid checkout and grant flows. | Engineering / Ops | proposed |
| No-P2W check | Evidence that paid entitlement has no shared/ranked/async/export/future-MP effect per ADR-0108 if accepted. | Product / Engineering | proposed |
| Legal sign-off | Named reviewer, date, scope, known residual risks and go/no-go decision. | Nico / Legal | proposed |

## Required source trails

The live source trail for the current FMX-194 proposal is
[[../60-Research/raw-perplexity/raw-monetization-legal-source-checks-2026-06-13]].
Before launch, re-check current official/provider docs for:

- Apple App Review / StoreKit / App Store Server Notifications;
- Google Play Billing / payments policy / RTDN / Voided Purchases API;
- selected MoR or direct PSP docs and contracts;
- EU/German consumer-law and imprint requirements;
- GDPR/DPA/AVV vendor contracts;
- IARC/USK/PEGI rating questionnaire outputs.

## Open risks

- This checklist does not draft legal text.
- Payment provider legal role depends on the final contract, not marketing copy.
- Payment/receipt erasure-vs-retention partitioning is now a separate FMX-186
  review gate under accepted ADR-0127; legal/accounting review must still
  confirm provider-specific retained fields before paid activation.
- Webhook receiver security is now a separate FMX-187 evidence gate under
  accepted ADR-0128; paid activation must prove provider verification, replay
  rejection, two-layer dedupe, reconciliation and focused pentest evidence.
- Age-gate strictness can change if FMX later adds UGC, chat, betting-like
  mechanics, paid random rewards, adult content or more aggressive monetization.
- Legal review may choose a stricter refund policy than the current recommended
  unspent-only/no-gameplay-rollback posture.
