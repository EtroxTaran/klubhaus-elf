---
title: Rivalry commercial signal contract reconciliation
status: current
tags: [research, ddd, rivalry, commercial, derby, bounded-context, contract, fmx-134]
context: [rivalry, commercial-portfolio]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
linear: FMX-134
sourceType: synthesis
related:
  - [[raw-perplexity/raw-rivalry-commercial-signal-ddd-2026-06-14]]
  - [[raw-perplexity/raw-rivalry-commercial-signal-realworld-2026-06-14]]
  - [[raw-perplexity/raw-rivalry-commercial-signal-games-2026-06-14]]
  - [[raw-perplexity/raw-rivalry-commercial-signal-source-checks-2026-06-14]]
  - [[../10-Architecture/09-Decisions/ADR-0057-rivalry-system-context]]
  - [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  - [[../10-Architecture/09-Decisions/ADR-0111-rivalry-commercial-signal-contract-reconciliation]]
  - [[../10-Architecture/bounded-context-map]]
  - [[../40-Execution/fmx-134-rivalry-commercial-signal-decision-queue-2026-06-14]]
---

# Rivalry commercial signal contract reconciliation

## Question

FMX-134 asks whether the vault should keep `RivalryCommercialSignal` as a
published Rivalry System contract, or remove it and have CommercialPortfolio
derive commercial uplift from Rivalry-owned facts such as
`RivalryTierTransitioned` and `DerbyContext(matchId)`.

The current vault is contradictory:

- [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary|ADR-0058]]
  and [[../10-Architecture/bounded-context-map]] mention
  `RivalryCommercialSignal`.
- [[../10-Architecture/09-Decisions/ADR-0057-rivalry-system-context|ADR-0057]]
  and [[../50-Game-Design/rivalry-system]] publish rivalry events/read models,
  but no commercial signal.
- The bounded-context map also separately says CommercialPortfolio consumes
  `RivalryTierTransitioned` for top-match pricing and sponsor-fit risk.

## Evidence summary

### DDD boundary

DDD guidance supports keeping upstream Rivalry language free of
consumer-specific commercial policy. Rivalry owns the rivalry graph,
sub-scores, tier FSM, derby classification and rivalry fixture context.
CommercialPortfolio owns commercial interpretation: pricing, sponsor-fit,
hospitality, merchandising, contract side conditions and settlement. If a
downstream context needs commercial language, it should translate through an
anti-corruption layer or local projection.

### Real-world football

Derbies and major rivalries clearly affect commercial operations, but through
multiple levers: opponent/fixture category, time-to-match pricing, demand by
stadium sector, premium hospitality, safety/policing risk and fan atmosphere.
The evidence is strongest for ticketing, demand and security cost. Sponsor/media
and merchandise uplift are plausible, but should remain CommercialPortfolio
policy and calibration, not a single upstream Rivalry fact.

### Comparable games

Sports-management precedent also points to upstream relationship/fan facts and
downstream economy effects. Football Manager treats rivalries as club
relationship/database facts with dynamic rivalry strength; Hattrick links fan
mood/fan-club size to attendance and sponsor money; OOTP keeps gate/media
calculation inside the financial model. None of the checked sources requires an
explicit upstream "commercial rivalry signal".

## Options assessed

| Option | Shape | Assessment |
|---|---|---|
| A. Keep `RivalryCommercialSignal` as a Rivalry event/read model | ADR-0057 gains a commercial signal that ADR-0058 consumes. | Only justified if FMX wants a shared, stable "rivalry commercial grade" used by multiple domains. Otherwise it leaks CommercialPortfolio language into Rivalry and adds another contract to version. |
| **B. Remove `RivalryCommercialSignal`; CommercialPortfolio derives locally** | Rivalry publishes `RivalryTierTransitioned`, `DerbyContext(matchId)`, rivalry score/tier and evidence. CommercialPortfolio maps those through a local projection/ACL into fixture attractiveness, top-match pricing, sponsor-fit risk and settlement. | **Recommended.** Keeps one Rivalry truth, preserves CommercialPortfolio policy ownership and aligns with real-world/game precedent. |
| C. Split fan-demand and commercial ownership explicitly | Rivalry publishes rivalry facts; Audience & Atmosphere owns fan-demand/atmosphere/trust/`derby_factor`; CommercialPortfolio consumes both and owns monetary uplift. | Useful clarification layered onto Option B. It avoids making CommercialPortfolio the owner of fan sentiment while still making it the owner of money policy. |

## Recommended packet

Approve **D1=B, D2=A, D3=A** in
[[../40-Execution/fmx-134-rivalry-commercial-signal-decision-queue-2026-06-14]].

That means:

- Rivalry System does **not** publish `RivalryCommercialSignal`.
- Rivalry System publishes rivalry facts in Rivalry language:
  `RivalryTierTransitioned`, `DerbyContext(matchId)`, score/tier queries and
  evidence snapshots.
- CommercialPortfolio derives commercial interpretation locally:
  fixture commercial attractiveness, top-match pricing, sponsor-fit risk,
  hospitality/merchandise uplift, operating-cost risk inputs and settlement
  modifiers.
- Audience & Atmosphere keeps fan-demand/atmosphere/trust interpretation,
  including any fan-side `derby_factor`. CommercialPortfolio may consume those
  fan facts but does not become the fan-sentiment owner.
- The bounded-context map should be cleaned to remove
  `RivalryCommercialSignal` and keep one flow:
  `RivalryTierTransitioned` / `DerbyContext` -> CommercialPortfolio ACL/local
  projection.

## Decision status

This research note is `current` but **not binding**. The proposed architecture
home is draft
[[../10-Architecture/09-Decisions/ADR-0111-rivalry-commercial-signal-contract-reconciliation|ADR-0111]].
No accepted ADR/map contract should be implemented from ADR-0111 until Nico
approves the decision queue.

## Non-goals

- Does not change rivalry score weights, thresholds, decay or incident inputs.
- Does not change ticketing formulas, price-elasticity magnitudes or sponsor
  scoring magnitudes.
- Does not move commercial settlement, ledger posting or fan-demand ownership.
- Does not implement code; this is a docs-vault contract packet.

## Related

- [[raw-perplexity/raw-rivalry-commercial-signal-ddd-2026-06-14]]
- [[raw-perplexity/raw-rivalry-commercial-signal-realworld-2026-06-14]]
- [[raw-perplexity/raw-rivalry-commercial-signal-games-2026-06-14]]
- [[raw-perplexity/raw-rivalry-commercial-signal-source-checks-2026-06-14]]
- [[../10-Architecture/09-Decisions/ADR-0111-rivalry-commercial-signal-contract-reconciliation]]
- [[../40-Execution/fmx-134-rivalry-commercial-signal-decision-queue-2026-06-14]]

