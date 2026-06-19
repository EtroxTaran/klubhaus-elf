---
title: ADR-0111 Rivalry Commercial Signal Contract Reconciliation
status: accepted
tags: [adr, architecture, ddd, rivalry, commercial, derby, bounded-context, contract, fmx-134, accepted]
created: 2026-06-14
updated: 2026-06-19
type: adr
binding: true
amends:
  - [[ADR-0057-rivalry-system-context]]
  - [[ADR-0058-club-economy-commercial-impact-boundary]]
supersedes:
superseded_by:
related:
  - [[../../60-Research/rivalry-commercial-signal-contract-2026-06-14]]
  - [[../../60-Research/raw-perplexity/raw-rivalry-commercial-signal-ddd-2026-06-14]]
  - [[../../60-Research/raw-perplexity/raw-rivalry-commercial-signal-realworld-2026-06-14]]
  - [[../../60-Research/raw-perplexity/raw-rivalry-commercial-signal-games-2026-06-14]]
  - [[../../60-Research/raw-perplexity/raw-rivalry-commercial-signal-source-checks-2026-06-14]]
  - [[../../40-Execution/fmx-134-rivalry-commercial-signal-decision-queue-2026-06-14]]
  - [[../bounded-context-map]]
---

# ADR-0111: Rivalry Commercial Signal Contract Reconciliation

> **RATIFIED on 2026-06-19.** Nico approved the linked FMX decision
> queue via `APPROVE ALL RECOMMENDED`; this ADR/amendment is now
> binding according to its approved scope.


## Status

accepted

> **Decision gate.** This ADR is the non-binding FMX-134 proposal. It becomes
> binding only if Nico approves D1-D3 in
> [[../../40-Execution/fmx-134-rivalry-commercial-signal-decision-queue-2026-06-14]].
> Until then it is planning context and must not be implemented from.

## Date

- Drafted: 2026-06-14 (FMX-134)

## Context

The accepted commercial boundary currently has an orphan contract:

- [[ADR-0058-club-economy-commercial-impact-boundary|ADR-0058]] says Rivalry
  supplies `RivalryCommercialSignal`.
- [[../bounded-context-map]] repeats that wording in one CommercialPortfolio
  paragraph.
- [[ADR-0057-rivalry-system-context|ADR-0057]] does not publish
  `RivalryCommercialSignal`; it publishes Rivalry language: score/tier queries,
  `DerbyContext(matchId)` and `RivalryTierTransitioned`.
- The bounded-context map later says CommercialPortfolio consumes
  `RivalryTierTransitioned` for top-match pricing and sponsor-fit risk, which
  is the cleaner contract line.

FMX-134 decides whether to add the missing signal to ADR-0057 or remove the
orphan from ADR-0058/map and make CommercialPortfolio's local derivation
explicit.

## Options considered

### D1 - Rivalry commercial contract shape

| Option | Shape | Assessment |
|---|---|---|
| A. Rivalry publishes `RivalryCommercialSignal` | Add a dedicated commercial-facing event/read model to ADR-0057. | Viable only if a stable shared "rivalry commercial grade" exists across multiple consumers. Higher coupling and extra versioning otherwise. |
| **B. CommercialPortfolio derives locally** | Rivalry publishes `RivalryTierTransitioned`, `DerbyContext(matchId)`, score/tier queries and evidence; CommercialPortfolio maps them through a local ACL/projection. | **Recommended.** Keeps Rivalry language clean and keeps commercial policy in CommercialPortfolio. |
| C. Leave unresolved | Keep current accepted-doc contradiction. | Reject as a code-phase blocker. |

### D2 - fan-demand / `derby_factor` owner

| Option | Shape | Assessment |
|---|---|---|
| **A. Audience & Atmosphere owns fan-side `derby_factor`** | Rivalry facts flow into Audience & Atmosphere for fan demand/atmosphere/trust; CommercialPortfolio consumes those facts plus Rivalry facts for money conversion. | **Recommended.** One fan-sentiment owner, one money-policy owner. |
| B. CommercialPortfolio owns full `derby_factor` interpretation | CommercialPortfolio directly converts rivalry facts into fan demand and money policy. | Simpler but blurs fan-sentiment ownership. |
| C. Rivalry owns `derby_factor` | Rivalry publishes a scalar for fan and commercial consumers. | Reject; it repeats the commercial-signal leakage problem. |

### D3 - cleanup application after approval

| Option | Shape | Assessment |
|---|---|---|
| **A. Apply accepted-doc cleanup** | Amend ADR-0057/ADR-0058 and `bounded-context-map.md` to remove `RivalryCommercialSignal`, document the ACL/local projection and keep `derby_factor` ownership unique. | **Recommended.** Resolves FMX-134 fully. |
| B. Keep this draft ADR only | Leave accepted ADRs/map untouched until a larger sweep. | Keeps current implementation ambiguity. |
| C. Defer cleanup to a follow-up issue | Accept the line but open a separate issue for applying it. | Only useful if Nico wants to bundle multiple commercial-contract cleanups. |

## Proposed decision

Approve **D1=B, D2=A, D3=A**.

If accepted, this ADR amends ADR-0057 and ADR-0058 as follows:

- Rivalry System does **not** publish `RivalryCommercialSignal`.
- Rivalry System's published language remains rivalry-native:
  `RivalryTierTransitioned`, `DerbyContext(matchId)`, rivalry score/tier
  queries and evidence snapshots.
- CommercialPortfolio owns the ACL/local projection that maps Rivalry and
  Audience/Stadium/League facts into fixture commercial attractiveness,
  top-match pricing, sponsor-fit risk, hospitality/merchandise uplift,
  matchday operating-risk inputs and settlement modifiers.
- Audience & Atmosphere owns fan-side `derby_factor`, fan demand,
  atmosphere/trust and supporter-mood interpretation. CommercialPortfolio may
  consume these facts but does not own fan sentiment.
- The bounded-context map removes `RivalryCommercialSignal` and uses one
  contract line for Rivalry -> CommercialPortfolio:
  `RivalryTierTransitioned` / `DerbyContext(matchId)` consumed through a
  CommercialPortfolio ACL/local projection.

## Consequences

- `RivalryCommercialSignal` becomes null/deleted rather than added to ADR-0057.
- Commercial policy can change without versioning a Rivalry-owned event.
- Rivalry remains reusable by Audience & Atmosphere, Matchday-Event-Engine,
  Watch Party, Manager & Legacy, Notification, Match, Tactics and Regulations.
- CommercialPortfolio still receives enough signal to model top-match pricing,
  sponsor-fit risk and fixture settlement, because it can combine Rivalry facts
  with FanDemandForecast, TicketingTrustState, StadiumCommercialSnapshot,
  HospitalityInventorySnapshot, FixtureCommercialProfile and MatchResolved.

## Proposed map patch

Apply after Nico approval:

```text
Rivalry supplies `RivalryTierTransitioned`, `DerbyContext(matchId)` and
rivalry score/tier queries. CommercialPortfolio consumes those facts through a
local ACL/projection for top-match pricing, sponsor-fit risk and settlement
policy. Rivalry does not publish `RivalryCommercialSignal`.
```

## Related

- [[../../60-Research/rivalry-commercial-signal-contract-2026-06-14]]
- [[../../40-Execution/fmx-134-rivalry-commercial-signal-decision-queue-2026-06-14]]
- [[ADR-0057-rivalry-system-context]]
- [[ADR-0058-club-economy-commercial-impact-boundary]]
- [[../bounded-context-map]]

