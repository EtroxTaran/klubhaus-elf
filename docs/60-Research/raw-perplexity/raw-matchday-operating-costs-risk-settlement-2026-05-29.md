---
title: Raw Matchday Operating Costs and Risk-Cost Settlement Research 2026-05-29
status: raw
tags: [research, raw, perplexity, economy, matchday, security, stadium, sanctions, fmx-46]
created: 2026-05-29
updated: 2026-05-29
type: research
binding: false
linear: FMX-46
sourceType: external
related:
  - [[../matchday-operating-costs-and-risk-cost-settlement-2026-05-29]]
  - [[../club-economy-impact-map-and-commercial-contracts-2026-05-28]]
  - [[../cup-and-competition-revenue-profiles-2026-05-28]]
  - [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../../50-Game-Design/economy-system]]
  - [[../../50-Game-Design/regulations-and-compliance]]
  - [[../../50-Game-Design/matchday-event-engine]]
  - [[../../50-Game-Design/rivalry-system]]
  - [[../../50-Game-Design/stadium-and-campus]]
  - [[../../30-Implementation/club-economy-commercial-contracts]]
---

# Raw Matchday Operating Costs and Risk-Cost Settlement Research 2026-05-29

This note preserves the FMX-46 raw prompt/source log. It is not authoritative
for implementation. The promoted synthesis is
[[../matchday-operating-costs-and-risk-cost-settlement-2026-05-29]].

## Perplexity prompts

### Prompt 1 - cost categories and settlement

```text
Research football/soccer matchday operating cost categories and risk-cost
settlement. What official or credible sources define categories such as
stewarding, security, policing-style costs, medical/emergency services,
cleaning/waste, energy/utilities, temporary staff/contractors, pitch
damage/recovery, insurance/compliance overhead, sanctions, sector closures,
ghost matches, alcohol bans and away-fan restrictions? Provide source URLs and
extract game-design-relevant patterns, not exact copied data.
```

### Prompt 2 - Top-5 country comparison

```text
Compare Germany, England, Spain, Italy and France for football matchday
security / operating-cost differences relevant to a management game:
stewarding/security categorisation, policing or public-order cost allocation,
alcohol rules, away-fan restrictions, sector closures / behind-closed-doors
sanctions, and stadium safety regulation. Include official or credible source
URLs and note source confidence. Keep it IP-clean and game-design oriented.
```

## Perplexity answer summary

The answer pattern was consistent: public sources do not publish one universal
matchday-cost formula, but they do expose enough official categories to model a
profile-driven cost/risk settlement.

Recurring cost categories:

- stewarding and crowd management;
- private security/search/segregation;
- policing or public-order contribution where the jurisdiction charges it;
- medical, emergency and first-aid provision;
- cleaning, waste and sanitation;
- energy, water and technical systems;
- temporary staff, contractors and match officials;
- pitch damage and recovery;
- insurance, certification and compliance overhead;
- fines, sanctions, sector closures, ghost matches and away-fan restrictions.

Recurring design patterns:

- separate club-paid stewarding/security from policing/public-order costs;
- use risk tiers instead of fixed legal formulas;
- make country differences profile modifiers, not code branches;
- show warnings and mitigation before high-cost incidents settle;
- model alcohol bans and away-fan restrictions as both revenue and risk
  modifiers;
- sector closures and ghost matches remove revenue but leave many fixed and
  required operating costs in place;
- incident memory should raise future risk tier and sanction exposure.

## Source URLs captured

| Source | URL | Use in synthesis |
|---|---|---|
| UEFA Safety and Security Regulations | <https://documents.uefa.com/r/Technical-Regulations/UEFA-Safety-and-Security-Regulations-Online> | Safety officer, match organisation, segregation and safety/security responsibility categories. |
| UEFA Disciplinary Regulations | <https://documents.uefa.com/v/u/Technical-Regulations/UEFA-Disciplinary-Regulations-Edition-2024-Online> | Disciplinary measures, behind-closed-doors and partial-closure sanctions. |
| UEFA attendance sanctions page | <https://www.uefa.com/running-competitions/disciplinary/stadium-bans/> | Current examples of partial stadium closure and behind-closed-doors sanction classes. |
| SGSA stewarding factsheet | <https://www.gov.uk/government/publications/sports-grounds-safety-authority-stewarding-factsheets/sgsa-stewarding-factsheet-2-safety-security-and-non-safety-critical-roles> | Distinction between safety, security and non-safety-critical steward roles. |
| SGSA Green Guide / certification | <https://sgsa.org.uk/wp-content/uploads/2024/12/Guide-to-Safety-Certification.pdf> | Safety certification, safety management and operations plan precedent. |
| House of Commons Library - football policing costs | <https://commonslibrary.parliament.uk/research-briefings/cdp-2025-0208/> | England/Wales special police services and chargeability uncertainty. |
| UK Sporting Events alcohol law | <https://www.legislation.gov.uk/ukpga/1985/57> | England/Wales football alcohol restrictions. |
| FIFA facility management | <https://inside.fifa.com/innovation/stadium-guidelines/general-process-guidelines/operations/facility-management> | Facility management, maintenance and cleaning as safety/asset-preservation responsibilities. |
| FIFA turf and pitch design | <https://inside.fifa.com/innovation/stadium-guidelines/general-process-guidelines/design/turf-and-pitch-design> | Pitch design, maintenance and event-impact hooks. |
| FIFA technical systems and services | <https://inside.fifa.com/innovation/stadium-guidelines/technical-guidelines/stadiums-guidelines/technical-systems-and-services> | Energy, water, power, technical system and maintenance hooks. |
| DFB safety rules / implementation provisions | <https://assets.dfb.de/uploads/000/320/642/original_Heft_05_Durchfuehrungsbestimmungen_20250401.pdf> | Germany safety officers, security concept, stadium order and match organisation. |
| DFB safety guidelines page | <https://www.dfb.de/pinnwand-1/sicherheitsrichtlinien> | Routing to current DFB safety provisions. |
| Bremen policing-cost ruling summary | <https://www.senatspressestelle.bremen.de/pressemitteilungen/bremen-gewinnt-vor-dem-bundesverfassungsgericht-im-polizeikostenstreit-460166> | Germany high-risk policing-cost contribution precedent. |
| DFL policing-cost statement | <https://www.dfl.de/de/aktuelles/dfl-nimmt-stellung-zum-polizeikosten-urteil-des-bundesverfassungsgerichts/> | DFL view on high-risk policing costs and collaboration network. |
| Spain Ley 19/2007 | <https://www.boe.es/eli/es/l/2007/07/11/19> | Spain anti-violence, racism, xenophobia and intolerance framework. |
| Spain Real Decreto 203/2010 | <https://www.boe.es/eli/es/rd/2010/02/26/203> | Spain regulation for prevention of violence/intolerance in sport. |
| FIGC Codice di Giustizia Sportiva | <https://figc.it/it/federazione/norme/codice-di-giustizia-sportiva/> | Italy disciplinary sanction classes. |
| FIGC sector closure example | <https://figc.it/it/federazione/giustizia-sportiva/massimetfn/10tfn2024-2025a/> | Italy sector closure and alternative ticket treatment example. |
| France supporter travel bans | <https://www.service-public.gouv.fr/particuliers/vosdroits/F35116> | France match-specific supporter travel-ban mechanism. |
| France stadium security | <https://www.service-public.fr/particuliers/vosdroits/F1318?lang=en> | France stadium safety/security and supporter-ban hooks. |
| LFP disciplinary decisions | <https://www.lfp.fr/article/commission-de-discipline-les-decisions-du-12-fevrier-2025> | France discipline example including stand closure and pyro/pitch-invasion context. |
| LFP regulations 2024/2025 PDF | <https://www.lfp.fr/assets/24_25_Reglement_Integral_26_07_2024_1_2c3930f8d5.pdf> | France professional-football disciplinary sanction surface. |
| FFF regulations index | <https://www.fff.fr/11-les-reglements/index.html> | France federation disciplinary and competition rule routing. |

## Confidence notes

- High confidence: stewarding/security as separate operating categories;
  stadium safety certification and safety-management obligations; disciplinary
  sanctions such as fines, partial closures, behind-closed-doors matches and
  away-fan restrictions.
- Medium confidence: relative country profiles for baseline stewarding,
  alcohol and public-order strictness. These vary by local authority,
  competition, venue and fixture.
- Low confidence for exact money constants. Public information does not support
  stable, generalisable police invoice formulas across countries. FMX should
  use profile bands and provenance, then calibrate later.
