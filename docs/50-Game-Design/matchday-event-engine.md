---
title: Match-day Event Engine - Rule-based Trigger / Probability / Effect / Prevention
status: draft
tags: [game-design, events, matchday, weather, sanctions, operations, fan-service, safety, fmx-46, fmx-48]
created: 2026-05-16
updated: 2026-06-11
type: game-design
binding: false
related: [[README]], [[../60-Research/raw-perplexity/raw-environment-events]], [[../60-Research/systemic-events-player-development-venue-ops]], [[../60-Research/matchday-operating-costs-and-risk-cost-settlement-2026-05-29]], [[../60-Research/fan-service-campaign-catalog-and-effects-2026-06-01]], [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]], [[audience-and-atmosphere]], [[rivalry-system]], [[stadium-and-campus]], [[regulations-and-compliance]], [[GD-0022-economy-commercial-impact-and-contracts]]
---

# Match-day Event Engine - Rule-based Trigger / Probability / Effect / Prevention

> **Status note (2026-06-11, FMX-143):** This system/mode note is `status: draft` — it was
> reopened 2026-05-27 and was **not** among the 133 decisions ratified in the 2026-06-08
> sweep (#153). "Approved" wording below is **pre-reopen history**, not a current status
> claim; the product rules described here await individual re-approval (decided by Nico,
> 2026-06-11: keep `draft`, re-approval is a later HITL pass — see
> [[../40-Execution/ratification-status-inventory-2026-06-11|status inventory]]). Frontmatter
> is the status SSOT per
> [[../10-Architecture/09-Decisions/ADR-0092-vault-governance-status-ssot-and-reference-integrity-sweep|ADR-0092]].
> The ratified GDDR layer ([[README|Game Design Hub]]) may cover the same system — the GDDR
> is then the binding record.

> Approved by the systemic events / player lifecycle pass (2026-05-17).
> Match-day events are part of the wider systemic event architecture, but
> their rules remain owned by the relevant domains.

Match-day events ("the beer line froze", "a fan collapsed", "the catering
ran out") are **rule-based and deterministic given the same inputs + seed**.
Each event has a trigger, a conditional probability, an effect and a
prevention path. The point is to turn flavour into management.

## 1. Product rule

> **Every match-day event is defined by four fields: Trigger,
> Probability, Effect, Prevention. The Match-day Event Engine evaluates
> the active rule set before, during and after each match.**

The wider `WorldEventDirector` may schedule the match-day evaluation window,
but it does not own these rules or their state changes.

## 2. Event categories

| Category | Examples |
|---|---|
| **Weather** | Heat, frost, heavy rain, storm |
| **Infrastructure** | Frozen beer line, floodlight fault, turnstile outage, pitch problems |
| **Medical** | Fan collapses, paramedic call, match interruption |
| **Security** | Pyro, fan march, block clash, projectiles |
| **Catering** | Water demand spike, beer drop, sausages sold out |
| **Media / PR** | Protest banner, record attendance, boycott, choreo |
| **Fan-service** | Delayed away buses, fan festival weather fallback, choreo material dispute, low-uptake community block |

FMX-46 adds a cost-settlement contract: event effects may emit operating-cost
inputs such as `PitchRecoveryCostPosted`, `MatchdayMedicalEmergencyCostPosted`,
`MatchdayDamageReserveAdjusted`, `RiskTierReclassified` or a Regulations-owned
sanction command. The event engine resolves the incident; CommercialPortfolio
settles the commercial/operating cost; Club Management posts finance ledger
entries.

FMX-48 adds campaign outcome inputs: active `FanEventCampaign` choices can
change event probabilities or effects (for example coordinated away travel,
choreo support, supporter dialogue or fan festival crowd flow). The event
engine can resolve disruptions, safety incidents or low-uptake signals, but
CommercialPortfolio owns campaign settlement and Audience & Atmosphere owns
final fan mood/trust effects.

## 3. Event schema

```yaml
event:
  id: frozen_beer_line
  category: infrastructure
  trigger:
    - temperature_max_c: 0
    - maintenance_score_lte: 4
    - infra_age_years_gte: 8
  probability_pct: 35    # given trigger
  effect:
    beer_revenue_pct: -80
    fan_mood_ultras: -3
    fan_mood_casual: -2
    hospitality_complaint: 1
  prevention:
    - winterising_module: yes  # built in stadium
    - mobile_bars_available: yes
    - maintenance_score_gte: 7
  ui_card:
    title: "Frozen beer line"
    body: "The cold snap froze the main line. Expect a quiet third stand."
```

The engine reads this declarative schema; no per-event code is needed.

## 4. Trigger examples (verbatim from research)

### 4.1 Frozen beer line

| Field | Value |
|---|---|
| Trigger | Temperature < 0 °C, ageing infrastructure, low maintenance |
| Effect | Beer revenue -80 %, fan frustration +, hospitality - |
| Prevention | Winterising, maintenance, mobile bars |

### 4.2 Heatwave + water boom

| Field | Value |
|---|---|
| Trigger | 38-40 °C, sold-out stadium, low shade |
| Effect | Multiple medical incidents, match interruption, reputation damage, extra cost |
| Prevention | Water stations, shade, medical upgrade |

### 4.3 Pyro incident

| Field | Value |
|---|---|
| Trigger | High `rivalry_score`, recent fan-incident memory, low security upgrade |
| Effect | Fine, partial sector closure (next match), media event, risk-tier reclassification |
| Prevention | Security budget, fan dialogue project, ticket policy |

### 4.4 Floodlight outage

| Field | Value |
|---|---|
| Trigger | Old electricals, low maintenance, evening match |
| Effect | Match delay, reputation hit, possible replay |
| Prevention | Maintenance budget, electrical retrofit |

### 4.5 Pitch quality break

| Field | Value |
|---|---|
| Trigger | Heavy rain previous week + no undersoil + low groundskeeper budget |
| Effect | Tactical familiarity penalty for both teams (mud), injury risk +, pitch recovery cost |
| Prevention | Undersoil heating, drainage upgrade, groundskeeper budget |

## 5. Engine evaluation phases

```mermaid
flowchart LR
    Pre["Pre-match check"] --> Live["During match"]
    Live --> Post["Post-match"]
    Pre --> Cards["Inbox card if triggered"]
    Live --> Inj["Match interruptions / morale shifts"]
    Post --> San["Sanction triggers / media events"]
```

| Phase | Event types most likely |
|---|---|
| Pre-match | Weather, catering supply, infrastructure |
| Live | Medical, security, pitch |
| Post-match | Media, sanctions, fan-segment movement |

## 6. Sanction chain

Match-day security events feed into the **sanction chain** (sourced from
[[../60-Research/fan-culture-segmentation-research]] §6):

1. Fine.
2. Partial sector closure.
3. Visiting-fan restriction.
4. Alcohol ban / light beer only.
5. Partial ghost match.
6. Full ghost match.
7. Elevated risk classification for follow-up matches.

`SanctionService` (architecture: [[../10-Architecture/bounded-context-map]])
manages this chain.

## 7. Mechanical integration

Events feed into other systems, not just inbox cards:

- Catering & infrastructure events ←” [[economy-system]] revenue and KPIs.
- Security events ←” [[regulations-and-compliance]] sanction chain.
- Security, medical, pitch and infrastructure events ←”
  [[GD-0022-economy-commercial-impact-and-contracts]] matchday operating-cost
  settlement.
- Medical events ←” [[training-load-and-medicine]] injury record.
- Fan events ←” [[audience-and-atmosphere]] segment mood.
- Fan-service campaign incidents ←”
  [[GD-0022-economy-commercial-impact-and-contracts]] campaign settlement and
  [[audience-and-atmosphere]] segment effects.
- Media events ←” [[club-dna-and-governance]] media image.
- Pitch and venue conflicts ←” [[stadium-and-campus]] venue calendar,
  pitch wear and setup/teardown windows.

Domain ownership:

| Event source | Owner |
|---|---|
| Stadium and pitch effects | Stadium Operations |
| Catering, sponsor and commercial settlement effects | CommercialPortfolio |
| Fan mood, atmosphere and trust effects | Audience & Atmosphere |
| Fixture phase and match interruption facts | Match + League Orchestration |
| Injuries/availability | Squad & Player after Match/Training facts |
| Sanctions | Regulations & Compliance |
| Finance ledger entries | Club Management |
| User-facing cards | Notification/Narrative projection |

## 8. UI tiers

| Tier | Event surface |
|---|---|
| Quick | Top 1-2 events as cards with one preventive action |
| Standard | Per-match event log + suggested preventive investments |
| Expert | Full rule view: triggers, probabilities, effects, prevention coverage |

## 9. Authoring

Events live in `packages/game-data/events/` as YAML files. Community
packs ([[community-editor-and-datasets]]) can add or override events with
a manifest declaring their replacement scope.

Authoring rules:

- event IDs are stable;
- triggers must name their required state inputs;
- probability is conditional on eligibility, not global randomness;
- every effect names the owning context;
- every prevention action must be surfaced as a management decision,
  facility upgrade or policy;
- narrative copy references [[../60-Research/narrative-content-pipeline]]
  event families and never creates facts not present in the event payload.

## 10. Future-scope notes (classified future-scope)

- Recurring multi-match events (e.g. pyro investigation across 3 matches)
  - modelled as a parent event that spawns child events per match.
- Per-region weather patterns - hooked into `region_score` from
  [[club-dna-and-governance]].
- Counter-event prevention (e.g. "we tested the floodlight last week" auto
  -prevents floodlight outage for X matches) - yes, as a side effect of
  the prevention action itself.
