---
title: Raw Perplexity - Account deletion and purchase retention in games/platforms
status: raw
tags: [research, raw, perplexity, account-deletion, purchases, games, app-store, google-play, gdpr, payments, fmx-186]
created: 2026-06-16
updated: 2026-06-16
type: research
binding: false
linear: FMX-186
related:
  - [[../erasure-vs-hgb-retention-partition-2026-06-16]]
  - [[raw-erasure-hgb-retention-source-checks-2026-06-16]]
  - [[../../10-Architecture/09-Decisions/ADR-0127-erasure-vs-hgb-retention-field-partition]]
  - [[../../40-Execution/fmx-186-erasure-hgb-retention-decision-queue-2026-06-16]]
---

# Raw Perplexity - Account Deletion and Purchase Retention in Games/Platforms

## Query

Research account-deletion and purchase-retention patterns in games, app stores
and digital-service platforms. Focus on realistic user experience and game-world
knowledge:

- what happens to purchase history, invoices and entitlements when an account
  is deleted;
- how games represent deleted users in historical multiplayer/game records;
- how platforms disclose retained purchase/security/regulatory data;
- what FMX should copy or avoid for a future hybrid-online football manager.

## Perplexity Discovery Notes

The game/platform pattern is consistent even when individual sources differ:

- Account deletion removes or de-links profile, social, gameplay access and
  player-facing account surfaces.
- Purchase/invoice data may remain in back-office systems for tax, fraud,
  refund/chargeback and regulatory compliance.
- The user should be told before confirming deletion that certain purchase or
  invoice records may be retained for legal reasons.
- The user should be able to export or view purchase/invoice records before
  deletion where the platform holds them.
- Deleted accounts should not keep live gameplay entitlements. Historical
  records should show anonymized placeholders or non-identifying participant
  labels rather than expose the old profile name forever.
- "Restore purchases" after deletion is platform-specific and should not be
  promised unless the entitlement model supports it. For FMX, the safer rule is
  no post-deletion gameplay access or entitlement restoration from retained
  finance facts.

## Comparable-Game / Platform Takeaways

| Pattern | FMX implication |
|---|---|
| App platforms require an in-app or web account-deletion route when apps support account creation. | FMX already has a Settings -> Privacy delete flow; future paid flows must not hide deletion behind support-only contact. |
| Platform policies allow retention for security, fraud prevention or regulatory compliance when disclosed. | FMX can retain finance/tax records under legal obligation, but must disclose it clearly in Privacy Notice and deletion modal. |
| Games commonly turn deleted multiplayer/social participants into generic/deleted-profile records. | Historical FMX multiplayer/watch-party/game records should reference `Deleted manager` / pseudonymous participant ids, not email/display name. |
| Purchase records are often kept separately from profile and social data. | FMX should isolate `finance_records` and keep the account-to-finance mapping erasable. |
| Entitlement ledgers are not the same as tax records. | Payment/tax evidence can remain while gameplay entitlement state is revoked, anonymized or deleted with the account. |

## UX Requirements Derived From Discovery

FMX should add these user-facing requirements if ADR-0127 is accepted:

1. The delete-account confirmation explains that account/profile/save/social
   data is destroyed, while minimal invoice/payment facts may be retained under
   German commercial/tax law until their statutory expiry.
2. Before final deletion, the Privacy Center offers a purchase/invoice export
   if any finance records exist.
3. The DSAR export separates active account data from retained finance records.
   Retained records show purpose, legal basis, expiry date and the retained
   fields.
4. After final erasure, normal product surfaces cannot restore purchases,
   premium cash, supporter status or cosmetics from retained finance facts.
5. Historical multiplayer/watch-party/game records should show deleted-user
   placeholders and opaque ids, not stale display names or emails.

## Source-Quality Notes

- Perplexity produced some community/forum/game-guide citations. They are not
  canonized. They were useful only as UX/player-expectation signals.
- Official source checks were used for Apple and Google platform policy
  requirements. Those sources support the deletion-route and disclosure
  requirements, but do not define German HGB/AO retention fields.
- FMX should treat store policy, payment provider terms and legal obligations
  as separate gates. One does not override the others.
