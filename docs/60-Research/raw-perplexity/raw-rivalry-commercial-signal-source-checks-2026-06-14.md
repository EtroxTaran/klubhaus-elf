---
title: "Raw - Rivalry commercial signal: source checks (FMX-134)"
status: raw
tags: [research, raw, source-check, ddd, football, games, rivalry, commercial, fmx-134]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
linear: FMX-134
related:
  - [[../rivalry-commercial-signal-contract-2026-06-14]]
  - [[raw-rivalry-commercial-signal-ddd-2026-06-14]]
  - [[raw-rivalry-commercial-signal-realworld-2026-06-14]]
  - [[raw-rivalry-commercial-signal-games-2026-06-14]]
---

# Raw capture - Rivalry commercial signal source checks (2026-06-14)

Targeted source checks for **FMX-134**. Status `raw`: this is source input only;
the synthesis is [[../rivalry-commercial-signal-contract-2026-06-14]].

No FMX private data, secrets or user data were sent.

## DDD checks

- Dev.to AWS Builders, "Modeling shared entities across bounded contexts in
  Domain-Driven Design":
  <https://dev.to/aws-builders/modeling-shared-entities-across-bounded-contexts-in-domain-driven-design-5hih>
  - Relevant finding: model each bounded context independently; use events/APIs
    and anti-corruption layers rather than sharing one entity/model across
    contexts.
- Microsoft MSDN Magazine archive, "Best Practice - An Introduction to
  Domain-Driven Design":
  <https://learn.microsoft.com/en-us/archive/msdn-magazine/2009/february/best-practice-an-introduction-to-domain-driven-design>
  - Relevant finding: bounded contexts make model language explicit; ACLs keep
    foreign/non-domain concepts from leaking into the core model.
- Rise8 Delivery Playbooks, "Domain-Driven Design":
  <https://delivery-playbooks.rise8.us/content/practices/domain-driven-design/>
  - Relevant finding: context mapping and explicit boundaries let each domain
    own its model and implementation.

## Football checks

- Kemper and Breuer, "Dynamic ticket pricing and the impact of time":
  <https://www.easm.net/download/easm_essential_sport_management_collection/sport_funding_and_finance/Dynamic-ticket-pricing-and-the-impact-of-time-an-analysis-of-price-paths-of-the-English-soccer-club-Derby-County.pdf>
  - Relevant finding: Derby County's 2013/14 dynamic ticket-pricing data showed
    prices rising over time; variable ticket pricing differentiates by factors
    such as opponent and day of week.
- PLOS One, "They are not all the same: Demand for the stadium sectors":
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC10374137/>
  - Relevant finding: football demand differs by stadium sector and product
    type, including hospitality; a single rivalry-derived commercial scalar
    would hide useful commercial policy dimensions.
- UK Hansard, "Cost of Policing Football":
  <https://hansard.parliament.uk/commons/2019-06-04/debates/7FBCA7DA-C3B1-4CC1-8C3C-FFC9F31115E2/CostOfPolicingFootball>
  - Relevant finding: high-profile derby policing costs can be material and
    partly unrecoverable from clubs, so rivalry can increase both revenue
    opportunity and operating/risk costs.
- Arsenal, "Match Categories":
  <https://www.arsenal.com/tickets/matchcategories>
  - Relevant finding: club ticketing uses fixture/opponent category structures.
    The page does not prove rivalry-specific pricing by itself.

## Comparable-game checks

- Sports Interactive Community, "Dynamic rivalries question":
  <https://community.sports-interactive.com/forums/topic/373137-dynamic-rivalries-question/>
  - Relevant finding: SI staff describe named derbies as database/researcher
    facts while rivalry level can grow dynamically. This supports a
    Rivalry-owned relationship/tier model.
- Hattrick Wiki, "Fans": <https://wiki.hattrick.org/wiki/Fans>
  - Relevant finding: supporter mood and fan-club size influence attendance and
    sponsor money. This supports fan/commercial systems consuming fan context
    rather than upstream Rivalry publishing a commercial event.
- OOTP manual, "The team financial model":
  <https://manuals.ootpdevelopments.com/index.php?man=ootp19&page=the_team_financial_model>
  - Relevant finding: gate revenue is calculated from ticket price and
    attendance; media revenue and attendance are influenced by market/fan
    variables. Commercial calculation stays in the financial model.

## Source quality note

UEFA safety/security online documentation was visible only through a script-heavy
index during this pass. It is adequate as a general route to the regulation set,
but the FMX-134 recommendation does not depend on a specific UEFA article.

