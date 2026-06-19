---
title: Raw Perplexity - FMX-148 Supporter Representation
status: raw
tags: [research, raw, perplexity, fmx-148, supporters, slo, fan-engagement, football-governance]
created: 2026-06-19
updated: 2026-06-19
type: research
binding: false
linear: FMX-148
sourceType: perplexity
related:
  - [[../named-supporter-group-consent-dsa-naming-2026-06-19]]
  - [[raw-fmx-148-source-checks-2026-06-19]]
  - [[../../10-Architecture/09-Decisions/ADR-0062-audience-and-atmosphere-context]]
---

# Raw Perplexity - FMX-148 Supporter Representation

## Prompt

Research real-world football supporter-representation handling relevant to game
design: UEFA Supporter Liaison Officer licensing guidance, DFB/DFL SLO concept,
Premier League fan engagement / Fan Advisory Board requirements, and any
practical pattern for representative fan contact without storing real individual
fan data. Include source URLs and game-design implications for a fictional
football manager game.

## Raw answer capture

Perplexity identified UEFA's Supporter Liaison Officer model as the clearest
real-world baseline: an appointed club contact point and bridge for supporter
dialogue, not an owner of all fan identity data and not a direct simulation of
every individual supporter.

Key points returned:

- UEFA Club Licensing Article 45 requires the licence applicant to appoint a
  Supporter Liaison Officer as the key contact point for supporters and to meet
  with relevant club personnel on supporter-related matters.
- UEFA guidance frames the SLO as a communications and relationship bridge:
  information flow, feedback collection, supporter-group relationships and
  matchday stakeholder coordination.
- The German SLO concept is described in secondary/background material as the
  origin pattern for dialogue, service and prevention. This pass did not
  produce a strong official DFB/DFL primary source for exact current
  mechanics.
- Premier League fan engagement uses formal consultation structures rather than
  individual fan dossiers. Perplexity pointed to Fan Advisory Board/Fan
  Engagement Standard patterns.
- Product implication: model a Supporter Relations role/SLO and representative
  groups with issue clusters, not individual supporter profiles.
- Data implication: store topic, urgency, sentiment, match association and
  aggregate issue summaries; avoid permanent names/contact details except when
  follow-up is operationally necessary.

URLs Perplexity named:

- UEFA Article 45:
  `https://documents.uefa.com/r/UEFA-Club-Licensing-and-Financial-Sustainability-Regulations-2025/Article-45-Supporter-liaison-officer-Online`
- UEFA practical guide:
  `https://editorial.uefa.com/resources/026f-13cca3e5461b-a462a58818bb-1000/uefa_practical_guide_to_supporter_liaison.pdf`
- Football Supporters Europe SLO overview:
  `https://www.fanseurope.org/supporter-liaison-officer/`
- Premier League Fan Engagement Standard source was verified separately in
  [[raw-fmx-148-source-checks-2026-06-19]].

## Research handling

Strong claims retained: UEFA Article 45 and Premier League FES. German-origin
SLO detail is background only unless a stronger DFB/DFL primary source is added
later.

## Related

- [[../named-supporter-group-consent-dsa-naming-2026-06-19]]
- [[raw-fmx-148-source-checks-2026-06-19]]
- [[../../10-Architecture/09-Decisions/ADR-0062-audience-and-atmosphere-context]]
