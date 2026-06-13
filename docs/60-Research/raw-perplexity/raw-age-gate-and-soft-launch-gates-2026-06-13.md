---
title: "Raw - age gate and paid soft-launch gates (FMX-194)"
status: raw
tags: [research, raw, perplexity, monetization, age-gate, age-assurance, soft-launch, legal, gdpr, youth-protection, dark-patterns, fmx-194]
created: 2026-06-13
updated: 2026-06-13
type: research
binding: false
linear: FMX-194
related:
  - [[../monetization-legal-gates-2026-06-13]]
  - [[raw-monetization-legal-source-checks-2026-06-13]]
  - [[../../40-Compliance/monetization-legal-gates-evidence-2026-06-13]]
  - [[../../10-Architecture/09-Decisions/ADR-0109-payment-provider-and-monetization-legal-gates]]
  - [[../../40-Execution/fmx-194-monetization-legal-gates-decision-queue-2026-06-13]]
---

# Raw - age gate and paid soft-launch gates (FMX-194)

## Query

2026-06-13 Perplexity/Sonar query: age-gate/age-assurance and paid soft-launch
compliance gates for a Germany/EU indie football-management game with in-game
purchases, no gambling, no loot boxes, fictional clubs, hybrid online/PWA plus
later app shells. Required axes: GDPR/minors, German youth/media protection,
DSA/dark-pattern risk, IARC/USK/PEGI ratings, legal artifacts required before
first paid soft launch and examples from games/platforms.

## Captured answer

Perplexity recommended **moderate, proportional age assurance**, not full
KJM-style adult verification, because the current game scope has no gambling,
loot boxes, explicit adult content or real-money betting.

| Option | Raw assessment |
|---|---|
| A. Lightweight self-declared age gate | Low friction and privacy-minimal. Adequate only if purchase UX is conservative and no under-16 consent or targeting risk is created. |
| **B. Moderate age assurance** | Self-declared DOB/age, email verification, platform ratings/parental controls, under-16 Germany restrictions for optional tracking/marketing and conservative purchase controls. Recommended as a stronger soft-launch posture. |
| C. Full KJM-approved age-verification system | Needed for adult/18+ restricted content, gambling/betting-style pivots or other high-risk adult-only services. Overkill for current football-manager scope. |

## Paid soft-launch gates

The answer treated paid soft launch as a production legal event, not a harmless
beta. Before paid activation, FMX should require at minimum:

- AGB/Terms and EULA;
- imprint under German commercial-service rules;
- GDPR privacy notice with data categories, legal bases, retention and user
  rights;
- processor contracts / AVV / DPA list for hosting, email, analytics and payment
  providers;
- checkout with no pre-ticked boxes and no pressure-selling;
- VAT-inclusive price and clear one-off item description;
- separate ToS/privacy acknowledgement and withdrawal/immediate-delivery waiver;
- order confirmation email with purchase, price, tax, support and withdrawal
  consequence;
- refund/chargeback/minor-purchase runbook;
- provider sandbox smoke and webhook/reconciliation test;
- feature flag/killswitch for paid flows;
- age-rating / IARC/USK/PEGI evidence for app shells when applicable.

## Game/platform precedent captured

- Mainstream non-adult games rely on ratings, parental controls and declared-age
  flows rather than identity-grade adult verification.
- Germany's strict closed-user-group / KJM-grade age verification is aimed at
  adult-only harmful content; it would be triggered by a future gambling, betting
  or explicit-content pivot, not by the current non-random football-manager cash
  pack.
- In-game purchases and online risks can affect ratings and disclosure even when
  no loot boxes are present.

## Source-quality notes

Some source links returned by Perplexity were secondary or industry sources. The
age and soft-launch conclusions are therefore treated as planning evidence and
must be legal-reviewed before launch. Current official anchors used by the
synthesis include Apple/Google policy, EU consumer-protection summaries,
USK/IARC/PEGI-style rating checks and German statute URLs listed in
[[raw-monetization-legal-source-checks-2026-06-13]].

## Working interpretation for FMX-194

Use **B as the recommendation** for Nico: proportional age assurance and a hard
paid-activation compliance gate. Do not require full identity-grade AVS unless
the product later adds adult-only/gambling/betting-like features or legal review
says the risk profile changed.

