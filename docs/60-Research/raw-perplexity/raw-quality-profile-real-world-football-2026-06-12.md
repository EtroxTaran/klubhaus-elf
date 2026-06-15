---
title: "Raw - real-world fixture categorisation and risk routing (FMX-147)"
status: raw
tags: [research, raw, perplexity, football, fixture, risk, safety, commercial, quality-profile, fmx-147]
created: 2026-06-12
updated: 2026-06-12
type: research
binding: false
linear: FMX-147
related:
  - [[../quality-profile-enum-settlement-path-2026-06-12]]
  - [[../../10-Architecture/09-Decisions/ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract]]
  - [[../../10-Architecture/09-Decisions/ADR-0070-fixture-commercial-revenue-profile-contract]]
  - [[../matchday-operating-costs-and-risk-cost-settlement-2026-05-29]]
---

# Raw - real-world fixture categorisation and risk routing (FMX-147)

## Research prompt

Perplexity was asked how real football differentiates fixtures by match importance, risk, broadcast/commercial profile and operational handling, and what that implies for a game contract that decides whether a match uses foreground per-event settlement or cheaper background settlement.

## Key findings

- Football operations treat match risk as event-specific and dynamic. Safety planning uses the venue, event type, crowd profile, security threat, timing, weather and expected attendance, not just the competition name.
- Stewarding, policing and emergency-service planning are resourced from event category/risk assessment. A high-risk fixture can change staffing and operational costs even if the core fixture rule facts are unchanged.
- Commercial categorisation is a real club practice. Clubs can expose match-category tables and price tiers by opponent/competition/category.
- Match type and competition stage matter. Finals, derbies, playoffs, continental fixtures and title/relegation pressure carry different crowd, media and commercial weight from routine league fixtures.
- Real-world categories are multi-axis. Risk, commercial category, sporting importance and broadcast selection are related but not the same concept.

## Klubhaus Elf-specific extraction

| Real-world pattern | FMX implication |
|---|---|
| Event-specific risk assessment | Quality profile and settlement path should be explicit per fixture/version, not inferred globally from competition type |
| Staffing and operations scale with category/risk | Foreground per-event settlement is justified for high-impact/high-risk/showpiece matches |
| Clubs expose commercial match categories | ADR-0070 can carry commercial category/rule facts separately from the match-engine quality profile |
| Category axes differ | Do not overload `qualityProfile` with risk or commercial importance; it should route simulation/settlement depth, while risk/commercial fields remain separate |
| Postponement/cancellation can follow unsafe risk | Detailed foreground paths need enough event detail for sanctions, closure, abandonment and reversal/repost flows |

## Source trail

- Perplexity research pass, 2026-06-12: football fixture category, risk and commercial-pricing evidence.
- Sports Grounds Safety Authority, risk assessments - event-specific/dynamic risk assessment, event categorisation and operational consequences such as modification, delay, postponement or cancellation: <https://sgsa.org.uk/safety-management/risk-management/risk-assessments/>
- Sports Grounds Safety Authority, stewarding plan - stewarding numbers and mobile steward ratios depend on ground configuration, event nature, attendance, spectator profile, timing, security threat and risk assessment: <https://sgsa.org.uk/safety-management/stewarding/stewarding-plan/>
- Arsenal, ticket categories and pricing - club-facing example of match categories used for ticket pricing: <https://www.arsenal.com/tickets/ticket-categories-and-pricing>
- Arsenal, match categories - match category table by competition/opponent/category: <https://www.arsenal.com/tickets/matchcategories>
- FIFA men's ranking procedure - lightweight support that football bodies weight match types/importance differently; used only as background, not as a settlement-contract authority: <https://inside.fifa.com/fifa-world-ranking/procedure-men>

## Notes for synthesis

Real football supports an explicit, per-fixture routing contract: showpiece/high-risk matches should have detailed settlement available, while routine background fixtures can use cheaper paths. It does not support collapsing risk, commercial category and simulation quality into one opaque three-value class.
