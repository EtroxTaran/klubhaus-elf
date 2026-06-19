---
title: Raw Perplexity - FMX-148 Legal Privacy UGC
status: raw
tags: [research, raw, perplexity, fmx-148, gdpr, dsa, privacy, ugc, supporter-groups]
created: 2026-06-19
updated: 2026-06-19
type: research
binding: false
linear: FMX-148
sourceType: perplexity
related:
  - [[../named-supporter-group-consent-dsa-naming-2026-06-19]]
  - [[raw-fmx-148-source-checks-2026-06-19]]
  - [[../../40-Execution/fmx-148-named-supporter-group-decision-record-2026-06-19]]
---

# Raw Perplexity - FMX-148 Legal Privacy UGC

## Prompt

Research GDPR Article 6 lawful basis, GDPR Article 9 special-category data risk,
and EU Digital Services Act Article 16 notice-and-action requirements as they
apply to fictional/generated in-game supporter groups, supporter
representatives, and local vs hosted community-created content packs. Focus on
EU/Germany product design implications for a game. Include official source URLs
and best-practice recommendations.

## Raw answer capture

Perplexity framed the deciding product question as whether the feature processes
personal data or special-category data at all. Purely fictional/generated
supporter groups and representatives have the lowest risk when they are not
linked to real players, accounts, handles, photos, voice, membership lists or
other identifiable people.

Key points returned:

- GDPR Article 6 requires one lawful basis per processing purpose. Likely game
  bases are contract for core account/service delivery, legitimate interest for
  security and limited platform integrity after an LIA-style purpose/necessity/
  balancing test, and consent for optional identity-sharing/community features.
- GDPR Article 9 adds a separate risk layer for data revealing racial or ethnic
  origin, political opinions, religious or philosophical beliefs, trade union
  membership, genetic/biometric data, health, sex life or sexual orientation.
  Supporter names, banners, tags or moderation logs can become special-category
  data if tied to identifiable real people.
- Product guidance: avoid fields that encode real-world political, religious,
  ethnic, health, sexuality or comparable traits for supporters; if optional
  self-expression is ever allowed, it needs explicit consent and moderation.
- DSA Article 16 matters for hosted UGC/community packs. A hosted pack workflow
  needs a user-friendly notice/reporting mechanism for specific items of
  illegal content, acknowledgement/review/takedown handling, and appeal or
  reinstatement flow.
- Local-only packs have much lower platform exposure if the game does not host,
  sync, index, recommend, scan or upload the content. A launcher/sharing hub or
  server distribution path reopens GDPR/DSA duties.
- EU/Germany launch posture should use data minimization, separate account,
  creator, moderation and gameplay identities, keep non-essential sharing
  default-off, and retain moderation logs only as long as needed.

Official URLs Perplexity named:

- GDPR official text: `https://eur-lex.europa.eu/eli/reg/2016/679/oj`
- DSA official text: `https://eur-lex.europa.eu/eli/reg/2022/2065/oj`
- European Commission DSA overview:
  `https://digital-strategy.ec.europa.eu/en/policies/digital-services-act-package`
- EDPB legitimate-interest guidance:
  `https://www.edpb.europa.eu/system/files/2024-10/edpb_guidelines_202401_legitimateinterest_en.pdf`

## Research handling

This raw pass is discovery only. The synthesis uses the source-check file for
which legal claims are strong enough to canonize.

## Related

- [[../named-supporter-group-consent-dsa-naming-2026-06-19]]
- [[raw-fmx-148-source-checks-2026-06-19]]
- [[../../40-Execution/fmx-148-named-supporter-group-decision-record-2026-06-19]]
