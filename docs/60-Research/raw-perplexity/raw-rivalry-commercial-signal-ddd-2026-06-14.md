---
title: "Raw - Rivalry commercial signal: DDD contract boundary (FMX-134)"
status: raw
tags: [research, raw, perplexity, ddd, bounded-context, rivalry, commercial, contract, fmx-134]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
linear: FMX-134
related:
  - [[../rivalry-commercial-signal-contract-2026-06-14]]
  - [[../../10-Architecture/09-Decisions/ADR-0057-rivalry-system-context]]
  - [[../../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  - [[../../10-Architecture/09-Decisions/ADR-0111-rivalry-commercial-signal-contract-reconciliation]]
  - [[../../10-Architecture/bounded-context-map]]
---

# Raw capture - Rivalry commercial signal DDD boundary (Perplexity, 2026-06-14)

Perplexity capture for **FMX-134**. Status `raw`: this is source input only; the
synthesis is [[../rivalry-commercial-signal-contract-2026-06-14]].

No FMX private data, secrets or user data were sent. Prompt was generic
architecture/product research, using the FMX issue only as a shape reference.

## Prompt

**Prompt.** In domain-driven design, how should a Rivalry bounded context
publish facts to a CommercialPortfolio bounded context? Compare publishing a
dedicated `RivalryCommercialSignal` from Rivalry versus having
CommercialPortfolio derive commercial uplift from generic rivalry facts such as
`RivalryTierTransitioned` and `DerbyContext`. Research best practices for
bounded-context ownership, published language, anti-corruption layers and
avoiding commercial leakage into upstream scoring domains. Include sources.

## Key captured findings

- Bounded contexts should keep their own ubiquitous language. A Rivalry context
  should publish rivalry facts in rivalry language: score/tier changes, derby
  classification, sub-score evidence and fixture-context snapshots.
- A downstream CommercialPortfolio context should own commercial policy:
  ticket-price uplift, sponsor-fit risk, hospitality/merchandising modifiers,
  demand elasticity and settlement treatment.
- Publishing a dedicated `RivalryCommercialSignal` from Rivalry is only clean
  when the commercial classification is itself a stable shared-domain concept
  used consistently by multiple downstream contexts. Otherwise it couples an
  upstream rivalry model to one consumer's pricing and sponsor policy.
- The lower-coupling default is an anti-corruption layer or local projection in
  CommercialPortfolio that converts `RivalryTierTransitioned`,
  `DerbyContext(matchId)` and audience/stadium facts into commercial terms.
- If consumers lack sufficient rivalry evidence, enrich the generic rivalry
  published language rather than adding consumer-specific commercial semantics
  to Rivalry.

## Useful sources returned

- Dev.to AWS Builders, "Modeling shared entities across bounded contexts in
  Domain-Driven Design": <https://dev.to/aws-builders/modeling-shared-entities-across-bounded-contexts-in-domain-driven-design-5hih>
- Rise8 Delivery Playbooks, "Domain-Driven Design":
  <https://delivery-playbooks.rise8.us/content/practices/domain-driven-design/>
- Microsoft MSDN Magazine archive, "Best Practice - An Introduction to
  Domain-Driven Design":
  <https://learn.microsoft.com/en-us/archive/msdn-magazine/2009/february/best-practice-an-introduction-to-domain-driven-design>
- Eric Evans, "What I've learned about DDD since the book":
  <https://www.youtube.com/watch?v=am-HXycfalo>

## Source quality note

The useful source set was general DDD guidance, not a game-specific contract
example. The synthesis treats the DDD finding as a boundary rule and combines it
with football and sports-management precedent in the other FMX-134 captures.

