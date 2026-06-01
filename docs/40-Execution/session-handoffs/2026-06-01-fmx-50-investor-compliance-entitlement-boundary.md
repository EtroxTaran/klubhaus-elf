---
title: Handoff FMX-50 Investor Compliance and Entitlement Boundary
status: wrapped
tags: [meta, execution, handoff, economy, investor, monetization, entitlement, compliance, legal, fmx-50]
created: 2026-06-01
updated: 2026-06-01
type: handoff
binding: false
related:
  - [[../../60-Research/investor-compliance-and-entitlement-boundary-2026-06-01]]
  - [[../../60-Research/raw-perplexity/raw-investor-compliance-and-entitlement-boundary-2026-06-01]]
  - [[../../10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary]]
  - [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../../30-Implementation/club-economy-commercial-contracts]]
  - [[../../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  - [[../../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
---

# Handoff: FMX-50 Investor Compliance and Entitlement Boundary (2026-06-01)

## Linear

- Issue: FMX-50 — Research Investor compliance and entitlement boundary
  (`type:adr`, `type:research`, `risk:legal`, `needs:nico-decision`, High).
- Branch: `claude/fmx-50-research-investor-compliance-and-entitlement-boundary`
  (off `main` after #106/#107/#108 merged).

## Done this session

- Ran 3 grounded Perplexity passes (Apple/Google consumable-IAP rules + web PSP;
  IARC/PEGI/USK age rating + EU/DE/UK/US consumer law; payment-provider
  architecture / MoR-vs-Stripe / OSS tax / idempotency / fraud / analytics).
  Sources preserved.
- New research synthesis
  [[../../60-Research/investor-compliance-and-entitlement-boundary-2026-06-01]] +
  raw transcript.
- **New proposed ADR-0063** Investor Entitlement and Payment Boundary
  (`status: draft`, options A/B/C + recommendation Option B, `risk:legal`).
- Refined GD-0022 (Investor section + open decisions),
  club-economy-commercial-contracts (`InvestorEntitlementGrant` state machine,
  fields, account-binding rules), ADR-0058 (Investor events + FMX-50 note),
  ADR-0050 (`InvestorEntitlementCashReversed` event).
- Indexes: Current-State banner, Research-Map, 60-Research/00-summary,
  raw-perplexity/README, Decision-Log row (ADR-0063).

## Key proposed direction (gameplay rule unchanged; numbers = calibration)

- `PaymentProviderPort` (apple-iap / google-iap / web-psp): consumable IAP in app
  builds, web PSP / Merchant-of-Record in the PWA; entitlement account-bound, not
  save-bound.
- Server-authoritative idempotent entitlement state machine
  (`created → paid → entitled → refunded|revoked`); exactly-once grant deduped by
  provider transaction id; one `InvestorCashGrantPosted` (ADR-0050 sole writer);
  refund/revocation via Apple ASSN / Google void + reconciliation job.
- Plain "In-Game Purchases" age rating (no random items); EU/DE/UK/US consumer-law
  disclosure (pay-obligation button + VAT price, withdrawal-right waiver, price
  transparency, no dark patterns); abuse prevention + audit; SP-allowed /
  MP-denied / offline-deferred / imported-save-rebound allow matrix.

## Open / next step (HITL / legal gates)

- Payment vendor: Merchant-of-Record first (Paddle-type) vs Stripe-direct.
- Refunded-already-spent-cash policy (reverse-to-negative vs accept-loss + flag).
- Age-gate strictness; web-path availability; soft-launch activation timing.
- Whether a separate Monetization GDDR is needed (PM-04-F-01) or GD-0022 +
  ADR-0063 suffice.
- Remaining economy Todos: FMX-48 (fan-service campaigns), FMX-49 (financing
  tools), FMX-51 (AI club economy), FMX-52 (calibration & soak-test capstone).

## Blockers

- None for the research/planning beat. **Nothing ships without legal sign-off**
  (PM-2026-05-20-04-F-06, PM-2026-05-20-08). ADR-0063 stays `draft`; ADR-0050/0058
  stay accepted (events/notes added, no decision reversed). secrets-management
  needs a store/PSP credential category when payments are built (noted, not edited).

## Changed vault paths

- `docs/60-Research/investor-compliance-and-entitlement-boundary-2026-06-01.md` (new)
- `docs/60-Research/raw-perplexity/raw-investor-compliance-and-entitlement-boundary-2026-06-01.md` (new)
- `docs/10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary.md` (new)
- `docs/40-Execution/session-handoffs/2026-06-01-fmx-50-investor-compliance-entitlement-boundary.md` (new)
- `docs/50-Game-Design/GD-0022-economy-commercial-impact-and-contracts.md` (refined)
- `docs/30-Implementation/club-economy-commercial-contracts.md` (refined)
- `docs/10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary.md` (events + note)
- `docs/10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger.md` (event)
- `docs/00-Index/Current-State.md` (banner), `docs/00-Index/Research-Map.md`,
  `docs/00-Index/Decision-Log.md`, `docs/60-Research/00-summary.md`,
  `docs/60-Research/raw-perplexity/README.md`
