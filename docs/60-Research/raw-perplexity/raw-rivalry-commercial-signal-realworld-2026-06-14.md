---
title: "Raw - Rivalry commercial signal: real-world football precedent (FMX-134)"
status: raw
tags: [research, raw, perplexity, football, rivalry, derby, ticketing, security, commercial, fmx-134]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
linear: FMX-134
related:
  - [[../rivalry-commercial-signal-contract-2026-06-14]]
  - [[../../10-Architecture/09-Decisions/ADR-0057-rivalry-system-context]]
  - [[../../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  - [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
---

# Raw capture - Rivalry commercial signal real-world football precedent (Perplexity, 2026-06-14)

Perplexity capture for **FMX-134**. Status `raw`: this is source input only; the
synthesis is [[../rivalry-commercial-signal-contract-2026-06-14]].

No FMX private data, secrets or user data were sent. Prompt was generic
football-domain product research.

## Prompt

**Prompt.** Research how football derbies and rivalries affect real-world club
commercial operations: match category pricing, attendance demand, security and
policing cost, sponsor/media value, hospitality/merchandise and fan-demand
trade-offs. Identify which effects are directly evidenced and which should be
treated as inference for a football-manager game economy model. Include
sources.

## Key captured findings

- The strongest direct evidence is for attendance, ticketing and price-path
  effects. Football clubs use fixture/opponent category structures and dynamic
  pricing, and academic work on Derby County found matchday prices increased as
  the fixture approached.
- Rivalry/derby fixtures are commercially attractive because they are marquee
  fixtures, but the commercial model should still run through fixture profile,
  demand, stadium inventory and price elasticity rather than a hard-coded
  "rivalry revenue" fact.
- Safety and policing are a real counterweight. UK parliamentary debate on the
  cost of football policing cited Sheffield's derby as one of the most
  expensive matches to police in England and Wales, with costs above GBP
  200,000 for the named examples.
- Sector-level demand matters. Research using stadium sector data shows
  attendance determinants differ by seating sector and hospitality product, so a
  commercial system should combine rivalry facts with stadium/seat/hospitality
  inventory rather than publish one universal commercial score.
- Sponsor/media and merchandise uplift are plausible product effects for
  marquee fixtures, but the public evidence found in this pass is more indirect
  than the ticketing/security evidence. Treat those as CommercialPortfolio
  policy knobs calibrated from fixture attractiveness and audience reach.

## Useful sources returned

- Kemper and Breuer, "Dynamic ticket pricing and the impact of time: an
  analysis of price paths of the English soccer club Derby County":
  <https://www.easm.net/download/easm_essential_sport_management_collection/sport_funding_and_finance/Dynamic-ticket-pricing-and-the-impact-of-time-an-analysis-of-price-paths-of-the-English-soccer-club-Derby-County.pdf>
- PLOS One, "They are not all the same: Demand for the stadium sectors":
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC10374137/>
- UK Hansard, "Cost of Policing Football":
  <https://hansard.parliament.uk/commons/2019-06-04/debates/7FBCA7DA-C3B1-4CC1-8C3C-FFC9F31115E2/CostOfPolicingFootball>
- Arsenal, "Match Categories":
  <https://www.arsenal.com/tickets/matchcategories>
- UEFA, "Safety and Security Regulations" online index:
  <https://documents.uefa.com/r/Technical-Regulations/UEFA-Safety-and-Security-Regulations-Online>

## Source quality note

Perplexity also returned rivalry-list articles and one future-dated/low-quality
ticket-pricing item. Those were not used as decision evidence. Rivalry-list
articles are useful only for player-facing framing of marquee derbies, not for
FMX contract ownership.

