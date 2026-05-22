---
title: System Interplay - The Five Master Feedback Loops
status: draft
tags: [game-design, system-design, feedback-loop]
created: 2026-05-16
updated: 2026-05-17
type: game-design
binding: false
related: [[README]], [[../60-Research/systems-design-synthesis]], [[../60-Research/transfer-market-simulation]], [[transfer-market-and-contracts]]
---

# System Interplay - The Five Master Feedback Loops

The single design principle of the game: **no system is implemented in
isolation**. Every mechanic that changes a state must declare which other
systems read that state. The loops below are the contracts.

## 1. Loop 1: Fans â†’ Atmosphere â†’ Sport â†’ Marketing

```mermaid
flowchart LR
    Fans["Fan segments"] --> Atmos["Atmosphere"]
    Atmos --> HomeAdv["Home advantage"]
    Atmos --> Appeal["Match-day appeal"]
    HomeAdv --> Sport["Sporting result"]
    Appeal --> Util["Utilisation %"]
    Sport --> Bonding["Bonding"]
    Bonding --> Util
    Util --> Sponsor["Sponsor value"]
    Util --> Merch["Merch"]
    Sponsor --> Squad["Squad + infra spend"]
    Merch --> Squad
    Squad --> Sport
```

Detail:

- [[fan-ecology]] Â§3 atmosphere engine
- [[match-engine]] Â§1.1 home advantage input
- [[sponsorship-portfolio]] Â§3 valuation factors

## 2. Loop 2: Infrastructure â†’ Development â†’ Squad Value â†’ Finance

```mermaid
flowchart LR
    Infra["Stadium + campus"] --> Dev["Player development rate"]
    Dev --> Avail["Squad availability"]
    Dev --> Quality["Squad quality"]
    Avail --> Sport["Sporting result"]
    Quality --> Sport
    Quality --> Value["Squad value"]
    Value --> Sales["Transfer sales"]
    Sales --> Cash["Liquidity"]
    Cash --> Infra
```

Detail:

- [[stadium-and-campus]] Â§5 campus modifiers
- [[youth-academy-and-development]] Â§7 development math
- [[economy-system]] Â§2 revenue
- [[scouting-and-recruitment]] Â§10 free agents
- [[transfer-market-and-contracts]] Â§9 economy integration

## 3. Loop 3: Sponsors â†’ Stadium â†’ Experience â†’ Sponsors

```mermaid
flowchart LR
    Sponsor["Sponsor partners"] --> Funds["Funding"]
    Funds --> Build["Stadium build-out"]
    Build --> Exp["Match-day experience"]
    Build --> Inv["Sponsor inventory"]
    Exp --> Dwell["Dwell time"]
    Dwell --> Per["Per-cap revenue"]
    Inv --> SponsorVal["Sponsor value"]
    Per --> Operating["Operating result"]
    SponsorVal --> Sponsor
```

Detail:

- [[sponsorship-portfolio]] Â§2 asset inventory
- [[stadium-and-campus]] Â§4 modules
- [[fan-ecology]] Â§4 per-cap revenue math

## 4. Loop 4: Tactics â†’ Squad Need â†’ Recruitment â†’ Tactics

```mermaid
flowchart LR
    Tactics["Play model"] --> RoleNeed["Role need profile"]
    RoleNeed --> Scout["Scouting target"]
    Scout --> Sign["Signing"]
    Sign --> Familiar["Tactical familiarity rate"]
    Familiar --> Execute["Execution quality"]
    Execute --> Validation["Model validation"]
    Validation --> Tactics
```

Detail:

- [[tactics-system]] Â§6 familiarity
- [[scouting-and-recruitment]] Â§1 funnel
- [[match-engine]] Â§3 familiarity multiplier

## 5. Loop 5: Risk â†’ Debt â†’ Pressure â†’ Decisions

```mermaid
flowchart LR
    Invest["Aggressive investment"] --> Liquidity["Liquidity â†“"]
    Liquidity --> Risk["Risk reserve â†“"]
    Invest --> Wage["Wage ratio â†‘"]
    Wage --> Operating["Operating result â†“"]
    Operating --> Pressure["Board pressure â†‘"]
    Risk --> Pressure
    Pressure --> Panic["Panic transfers /<br/>icon sale"]
    Panic --> Fans["Fan anger â†‘"]
    Panic --> Squad["Squad weakening"]
    Squad --> Sport["Bad results"]
    Sport --> Pressure
    Fans --> Pressure
```

This is the engine of the [[mode-create-a-club-roguelite]] death spiral.
The transfer market is where the pressure becomes visible: boards can demand
wage cuts, owners can force sales, players can become wantaway and protected
stars only move when `sellPressure` exceeds `protectionScore` or the buyer
offers a genuinely exceptional package.

Detail:

- [[economy-system]] Â§6 spiral mechanics
- [[club-dna-and-governance]] Â§3 pressure loop
- [[fan-ecology]] Â§5 protest events
- [[transfer-market-and-contracts]] Â§8 AI club behaviour

## 6. Cross-cutting rules

- No mechanic may modify two pillar states atomically without an event
  trail. Every change must be observable in another system later.
- Every state value has a "where read" list - the design doc must declare
  which other systems read it.
- New mechanics are reviewed against the five loops first: which loop
  does this mechanic strengthen? does it create unintended feedback?

## 7. Future-scope notes (classified future-scope)

- Are there additional emergent loops we should track? Examples flagged
  for Phase 2:
  - Rivalry â†’ Security events â†’ Sanctions â†’ Fan attendance â†’ Atmosphere.
  - Sponsor side-condition breach â†’ Fines â†’ Liquidity â†’ Investment cap.
- Do we expose loop visualisations in the UI? In the Expert tier as a
  "club health" diagram, yes; not in Quick / Standard.
