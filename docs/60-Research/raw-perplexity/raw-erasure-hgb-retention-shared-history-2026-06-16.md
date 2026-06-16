---
title: Raw Perplexity - Erasure and shared game history
status: raw
tags: [research, raw, perplexity, gdpr, erasure, retention, shared-history, multiplayer, ugc, moderation, fraud, fmx-186]
created: 2026-06-16
updated: 2026-06-16
type: research
binding: false
linear: FMX-186
related:
  - [[../erasure-vs-hgb-retention-partition-2026-06-16]]
  - [[raw-account-deletion-purchase-retention-game-platforms-2026-06-16]]
  - [[raw-erasure-hgb-retention-source-checks-2026-06-16]]
  - [[../../10-Architecture/09-Decisions/ADR-0127-erasure-vs-hgb-retention-field-partition]]
  - [[../../40-Execution/fmx-186-erasure-hgb-retention-decision-queue-2026-06-16]]
---

# Raw Perplexity - Erasure and Shared Game History

## Query

For an EU/Germany hybrid-online football-manager game, research how GDPR
Article 17 account deletion should treat shared game history, multiplayer
records, UGC/community packs, posts/chat, moderation evidence, fraud evidence,
chargeback evidence and audit events. Focus on the difference between private
singleplayer data, shared world history and legally necessary safety/evidence
records.

## Perplexity Discovery Notes

Perplexity recommended a hybrid delete/anonymize/retain model:

- Private account/profile data and private singleplayer saves should be deleted
  or cryptographically erased.
- Shared multiplayer, league, watch-party and economy history that affects
  other users should not be blindly deleted if that would corrupt other players'
  records. The account identity should instead be replaced by a deleted-profile
  placeholder or pseudonymous participant id.
- UGC/community packs need content-specific handling: remove personal author
  identity, delete or redact personal content, but do not necessarily break
  dependent pack histories where other users rely on the pack and the content
  is not personal data.
- Moderation, fraud, chargeback and legal-claim records can be retained where
  needed, but the retained set must be minimal, purpose-limited, access-limited
  and time-bounded.
- Pseudonymization is not anonymization. If a support, invoice, PSP, moderation
  or legal-hold process can re-identify the person, the record remains personal
  data and needs GDPR controls.
- The deletion UX should tell users that private account/game data is deleted
  while minimal shared-history or legal/safety records may remain in anonymized
  or pseudonymous form.

## Shared-History Classification From Discovery

| Surface | Discovery classification | Rationale |
|---|---|---|
| Private singleplayer saves | Delete / cryptographically erase | No other player depends on the record. |
| Shared MP league table, fixture result, transaction/event history | Anonymize participant identity and retain shared fact | Other players' histories and standings rely on these facts. |
| Watch-party/chat/social display name | Delete or replace with deleted-profile placeholder | Old display names are not required once the account is erased. |
| UGC author profile | Detach/delete author identity | Authorship identity is account data unless a separate legal/license basis exists. |
| UGC content itself | Case-by-case: retain non-personal pack content; delete/redact personal content | Content may be shared game data, but personal data inside it still needs erasure/redaction. |
| Moderation evidence | Retain minimal pseudonymous evidence while appeals/legal/safety purpose exists | Needed for enforcement, legal claims or repeated-abuse defense. |
| Fraud/chargeback evidence | Retain minimal pseudonymous evidence while dispute/legal purpose exists | Needed for payment dispute and anti-abuse defense. |
| General telemetry/analytics | Delete or aggregate/anonymize quickly | Not a shared-history or finance-retention fact. |

## FMX Product Takeaways

FMX should avoid both extremes:

- Do not delete every historical record involving the user, because that can
  break other players' shared leagues, watch-party history, economy evidence or
  moderation continuity.
- Do not preserve old user-facing names/profile links in shared history, because
  that defeats the user's erasure expectation.

The accepted game-world posture is:

```text
private_account_and_save_data -> delete/crypto-erase
shared_history_identity -> deleted manager placeholder / pseudonymous participant
shared_non-personal_fact -> retain if other users or historical integrity depend on it
moderation_fraud_legal_evidence -> retain minimal pseudonymous evidence with purpose and expiry
```

## Source-Quality Notes

- Perplexity's examples were useful as pattern discovery, but not treated as a
  legal template.
- Official source checks for GDPR Article 17, Apple/Google deletion policy and
  Steam's privacy disclosure were used to source-check the accepted direction.
- Final policy still needs legal review before real-money, public UGC hosting or
  formal moderation retention goes live.
