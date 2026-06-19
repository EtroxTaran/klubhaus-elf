---
title: Source Checks - FMX-148 Named Supporter Group Surface
status: raw
tags: [research, raw, source-checks, fmx-148, gdpr, dsa, slo, fan-engagement, games, naming]
created: 2026-06-19
updated: 2026-06-19
type: research
binding: false
linear: FMX-148
sourceType: source-check
related:
  - [[../named-supporter-group-consent-dsa-naming-2026-06-19]]
  - [[raw-fmx-148-legal-privacy-ugc-2026-06-19]]
  - [[raw-fmx-148-supporter-representation-2026-06-19]]
  - [[raw-fmx-148-game-precedents-naming-2026-06-19]]
  - [[../../40-Execution/fmx-148-named-supporter-group-decision-record-2026-06-19]]
---

# Source Checks - FMX-148 Named Supporter Group Surface

## Strong sources

| Source | Checked fact | FMX use |
|---|---|---|
| GDPR Article 6 official text, `https://eur-lex.europa.eu/eli/reg/2016/679/oj`; accessible text mirror checked at `https://gdpr-info.eu/art-6-gdpr/` | Article 6 lists lawful bases including consent, contract, legal obligation, vital interests, public task and legitimate interests. | Supports feature-by-feature lawful-basis mapping if FMX ever processes real user/creator/supporter personal data. |
| GDPR Article 9 official text, `https://eur-lex.europa.eu/eli/reg/2016/679/oj`; accessible text mirror checked at `https://gdpr-info.eu/art-9-gdpr/` | Article 9 covers special-category data including racial/ethnic origin, political opinions, religious/philosophical beliefs, trade union membership, genetic/biometric data, health and sex life/orientation. | Supports a hard block on real-world special-category-like supporter labels, handles, photos, membership lists or identity imports. |
| European Commission DSA overview, `https://digital-strategy.ec.europa.eu/en/policies/digital-services-act-package`; official DSA text URL `https://eur-lex.europa.eu/eli/reg/2022/2065/oj` | Commission overview confirms easy illegal-content flagging, response to reports and appeal options as DSA platform rights/obligations. | Supports keeping hosted community-pack distribution future-scope until notice/action, moderation and appeal workflows exist. |
| UEFA Club Licensing and Financial Sustainability Regulations 2025 Article 45, `https://documents.uefa.com/r/UEFA-Club-Licensing-and-Financial-Sustainability-Regulations-2025/Article-45-Supporter-liaison-officer-Online` | Browser extraction showed Article 45.01 requiring an appointed supporter liaison officer as key contact point, and 45.02 requiring regular collaboration with relevant club personnel. | Strong support for a Supporter Relations/SLO contact abstraction rather than individual supporter dossiers. |
| Premier League Fan Engagement Standard launch, `https://www.premierleague.com/en/news/3117739` | The FES introduces a framework, Fan Advisory Boards, Fan Engagement Plans, a nominated board-level official, reporting/review and consultation with fan group representatives. | Supports representative forums and issue clusters as real-world inspiration. |
| Football Manager Supporter Confidence, `https://www.footballmanager.com/features/supporter-confidence` | FM exposes a Supporter Profile with six categories and Supporter Confidence against match performance, transfers, tactics and squad. | Strong game precedent for aggregate fan segments plus visible mood feedback rather than simulating individual fans. |
| FMX-54 synthesis, [[../fan-persona-privacy-and-naming-2026-06-01]] | Nico already chose local/P2P Community Overlay, fictional aggregate fan reps and policy+test naming depth. | FMX-148 can lift the vague gate by folding these choices into ADR-0062. |

## Weak or downgraded sources

| Source area | Result | FMX handling |
|---|---|---|
| DFB/DFL exact SLO concept | This pass did not locate a strong official DFB/DFL primary page good enough to quote for current exact mechanics. | Keep DFB/DFL as background already named in ADR-0062; do not use it as the deciding source for FMX-148. UEFA/Premier League sources are sufficient for the representative-contact pattern. |
| Anstoss / We Are Football, Hattrick, Top Eleven, OOTP/EHM/CK3/Cities supporter systems | Perplexity did not surface reliable public sources for exact supporter-group mechanics. | Use only as unsourced design intuition if needed; do not canonize claims. |
| General supporters' group pages | Useful for broad social context but not product/legal authority. | Treat as background only. |
| EUR-Lex HTML extraction | The official URLs are the source of record, but the available browser/curl extraction hit JavaScript/portal limitations for full text. | Cite official URLs plus accessible mirrors/Commission overview; avoid long verbatim legal text and keep final legal sign-off as future gate. |

## Source-check implications

- FMX's safest MVP line is generated fictional supporter groups and reps,
  default-off/opt-in, with no real private-person data, supporter membership
  data, social handles, photos or special-category-like labels.
- Local/P2P community packs stay the MVP posture. Hosted sharing, discovery or
  marketplace distribution reopens DSA notice/action, appeal, moderation-log,
  repeat-abuse and privacy notice/RoPA work.
- A&A should model representative groups and issue clusters. People can own
  representative actor/persona cards by opaque ref; A&A should not own
  personhood.
- The strong game precedent is readable fan segments plus visible confidence
  feedback, not individualized fan tracking.

## Related

- [[../named-supporter-group-consent-dsa-naming-2026-06-19]]
- [[raw-fmx-148-legal-privacy-ugc-2026-06-19]]
- [[raw-fmx-148-supporter-representation-2026-06-19]]
- [[raw-fmx-148-game-precedents-naming-2026-06-19]]
- [[../../40-Execution/fmx-148-named-supporter-group-decision-record-2026-06-19]]
