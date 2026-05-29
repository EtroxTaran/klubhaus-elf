---
title: Stadium and Club Campus - Build-out and On-grounds Economy
status: draft
tags: [game-design, stadium, infrastructure, anstoss, commercial, contract-lifecycle, breach, season-tickets, matchday, operations, fmx-41, fmx-43, fmx-44, fmx-46]
created: 2026-05-16
updated: 2026-05-29
type: game-design
binding: true
related: [[README]], [[../60-Research/anstoss-series-deep-dive]], [[../60-Research/systems-design-synthesis]], [[../60-Research/systemic-events-player-development-venue-ops]], [[../60-Research/presentation-renderer-strategy]], [[../60-Research/club-economy-blueprint-2026-05-27]], [[../60-Research/club-economy-impact-map-and-commercial-contracts-2026-05-28]], [[../60-Research/fan-demand-price-elasticity-2026-05-28]], [[../60-Research/season-ticket-lifecycle-and-accounting-2026-05-28]], [[../60-Research/commercial-contract-lifecycle-and-breach-model-2026-05-28]], [[../60-Research/matchday-operating-costs-and-risk-cost-settlement-2026-05-29]], [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]], [[../10-Architecture/09-Decisions/ADR-0041-presentation-renderer-strategy]], [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]], [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]], [[../10-Architecture/09-Decisions/ADR-0061-club-management-sub-aggregate-audit]], [[../30-Implementation/club-economy-commercial-contracts]], [[economy-system]], [[GD-0022-economy-commercial-impact-and-contracts]], [[audience-and-atmosphere]], [[regulations-and-compliance]]
---

# Stadium and Club Campus - Build-out and On-grounds Economy

> Approved by the systemic events / player lifecycle pass (2026-05-17).
> Venue operations are now owned by the Stadium Operations bounded context
> (ADR-0061). They have football, commercial and ledger consequences, but they
> are not a detached tycoon minigame.

The stadium is the **economic and emotional heart** of the club. Anstoss 3
proved that buildings on the grounds (Würstchenbude, Bierzelt, Fanshop,
Disco) carry more long-term player engagement than any tactic screen. This
is one of our three flagship differentiators - see
[[../60-Research/systems-design-synthesis]] §4.

FMX-32 clarifies the boundary: Stadium Operations owns stadium/campus
operational facts and venue-operation state. CommercialPortfolio consumes those
facts for ticketing, commercial contracts and matchday operating settlement.
Club Management remains the sole finance ledger writer described in
[[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]].

## 1. Three stadium layers

| Layer | Concern | Effect |
|---|---|---|
| **Capacity & seat mix** | Standing / seated / premium / suites | Throughput + per-seat revenue + atmosphere |
| **Experience quality** | Sightlines, comfort, access, cleanliness, security, connectivity | Fan happiness, sponsor appeal, dwell time |
| **Commercial layer** | Catering, fan shop, fan zone, sponsor surfaces, events | Per-visitor revenue, sponsor inventory |

## 2. Capacity tiers

Tiers are league-bound (see [[regulations-and-compliance]] for the
country/tier obligations). Player upgrades capacity in stages:

| Tier | Approx capacity | Mix | Use case |
|---|---|---|---|
| Amateur | 1 - 5 k | Standing dominant | Verbandsliga / lower steps |
| Lower semi-pro | 5 - 15 k | Mixed standing/seating | Regionalliga / National League South |
| Pro entry | 15 - 30 k | Seating dominant, basic premium | 3. Liga / Championship lower |
| Pro mid | 30 - 50 k | Full premium tier | 2. Bundesliga / Championship top |
| Top tier | 50 - 80 k+ | Full luxury, multi-tier hospitality | Bundesliga / Premier League |

Each tier change triggers compliance checks
([[regulations-and-compliance]]).

## 3. Seat-mix trade-offs

| Move | Pro | Con |
|---|---|---|
| Add standing terrace | ↑ atmosphere, ↑ ultras density | ↓ per-seat revenue |
| Convert standing to seating | ↑ per-seat revenue, ↑ hospitality eligibility | ↓ atmosphere |
| Add VIP suites | ↑ revenue, ↑ sponsor deals | Possible ultras alienation |
| Add fan zone | ↑ dwell time, ↑ catering | Costs floor space, staff, security |
| Construction phase | Long-term gain | Temporary capacity + revenue drop |

## 4. Stadium modules (the Anstoss-3 wing)

The on-grounds attractions inventory, deliberately broader than capacity
upgrades:

| Module | Primary effect | Secondary effect |
|---|---|---|
| Extra stand | Capacity | Maintenance + staffing |
| VIP suites | Revenue / seat | Sponsor tier upgrade |
| Beer stand / Würstchenbude | Match-day revenue | Fan mood, dwell |
| Fan shop | Merch revenue | Brand bonding |
| Fan zone | Atmosphere, sponsor activation | Security + event cost |
| WiFi / app infrastructure | In-app revenue, CRM | Sponsor digital inventory |
| Museum / club shop | Non-match-day revenue | Prestige |
| Event area | Non-match-day revenue | Pitch + logistics load |
| Outdoor screen | Atmosphere | Family-friendly fan zone |
| Boutique hotel | Hospitality bookings + match-day stays | Long-term real estate value |

Source pattern: [[../60-Research/raw-perplexity/raw-feature-library]] §3 (Anstoss 3
buildings) + [[../60-Research/anstoss-series-deep-dive]] §3.

## 4.1 Venue operations calendar

Multi-use arenas have a separate event calendar next to matches and
training. It is evaluated weekly or at event boundaries, not with a
visitor-by-visitor simulation.

| Event type | Benefit | Football consequence |
|---|---|---|
| Concert | high rental / catering revenue | pitch wear, setup/teardown conflict |
| Conference | stable weekday revenue | low pitch impact, sponsor synergy |
| Fan festival | mood and brand lift | security/staffing cost |
| Museum special | prestige and non-matchday spend | low operational risk |
| Community day | family/local segment mood | moderate staff cost, sponsor fit |

Venue event rules include eligibility tags, setup days, teardown days,
pitch impact, revenue range, operating cost, sponsor affinity, fan segment
effects and conflict rules.

The player should normally choose policies or accept/reject highlighted
events rather than micromanage every booking.

## 5. Club campus (beyond the stadium)

Often co-located, often on a separate site:

- Training pitches (grass / turf / sand) - quality + specialisation.
- Rehab / medical centre.
- Performance diagnostics + sport science.
- Youth academy + boarding.
- Scouting + analysis centre.
- Media + sponsor lounge.

These don't directly bump numbers - they change **process quality**:

- Less downtime per injury.
- Better post-match regeneration.
- Sharper scout reports.
- Faster youth integration.
- Higher-value sponsor visits.

## 6. Build economics

```text
build_cost = base_cost
           * regional_construction_factor
           * urgency_factor          # crash-build is expensive
construction_time_weeks = base_time / construction_capacity
maintenance_cost_per_year = base_maintenance * age_factor
```

Buildings age. Without renovation, modifiers decay over 5-10 years. This
forces the player to keep reinvesting, not just hoard upgrades.

Accounting effects:

- Build commitments create scheduled cash obligations and a capitalised
  facility asset in the Expert view.
- Maintenance is a recurring weekly cost.
- Renovation resets decay and posts both cash and asset-value effects.
- Crash-build for promotion compliance posts a premium cost and may temporarily
  reduce capacity.

## 7. Match-day revenue calculation

```text
matchday_revenue = ticket_revenue
                 + catering_revenue
                 + hospitality_revenue
                 + merch_revenue
                 + sponsor_activation_revenue
                 - matchday_cost
```

Each component depends on attendance, dwell time, fan-segment mix and
weather. See [[audience-and-atmosphere]].

Non-matchday revenue is separate:

```text
venue_event_profit =
  event_revenue
  + sponsor_activation_revenue
  - operating_cost
  - pitch_recovery_cost
  - security_cost
```

High event density can reduce future match pitch quality or raise
operational incident risk. Good hybrid turf, logistics, security and
maintenance upgrades reduce the downside.

## 8. Commercial snapshot

FMX-41 makes the stadium a structured input to ticketing, catering,
merchandise, hospitality and fan-service campaigns. The venue layer publishes a
`StadiumCommercialSnapshot` for [[economy-system]] and
[[../30-Implementation/club-economy-commercial-contracts]].

Minimum outputs:

- capacity by seat class: standing, seated, family, premium, suites and away;
- available capacity after construction, sanctions, accessibility rules and
  allocations;
- season-ticket eligible home capacity by seat class, excluding away inventory;
- protected family and accessibility quotas;
- expected no-show / utilisation pressure by seat class if supplied by the
  ticketing campaign;
- catering throughput and queue quality;
- merch shop / fulfilment throughput;
- hospitality quality and inventory;
- fan-zone quality and sponsor-activation slots;
- ownership or lease model;
- fixed operating cost and matchday variable-cost bands;
- stewarding/staffing density bands;
- private-security and search/segregation capability bands;
- medical/emergency capacity band;
- cleaning/waste and sanitation cost bands;
- energy/utility and technical-system cost bands;
- pitch condition, recovery cost and fixture-density risk;
- ingress/egress and away-fan separation constraints;
- current sector closures, ghost-match flags and accessibility restrictions;
- event eligibility for concerts, conferences, fan parties and community days.

The same stadium can therefore produce different financial results depending on
fan composition and contract model: an in-house catering club has higher upside
and cost risk; a concession club has lower upside and more stable cash.

FMX-44 adds the contract-lifecycle inputs needed for venue-linked commercial
deals. The snapshot must be rich enough for Club Management to evaluate:

- venue activation slots and blackout dates;
- catering and hospitality service-level inputs such as queue, stockout,
  open-stand and premium-service bands;
- merchandise shop / fulfilment service-level inputs;
- supplier exclusivity dependencies, especially beer, food, soft drink, energy
  and POS categories;
- breach-relevant incident hooks: safety, alcohol-policy, health, crowding,
  cancellation and fulfilment failure.

The stadium does not open or resolve commercial breaches or finance postings.
It publishes facts; CommercialPortfolio evaluates contract and matchday
operating policy, and Club Management posts the ledger effects.

## 9. UI tiers

| Tier | Surface |
|---|---|
| Quick | "Build wizard": recommend next 1-3 upgrades + cost |
| Standard | Tile map of grounds + module list |
| Expert | SimCity-style grid, plot pricing, queueing, blueprint optimisation |

## 9.1 Visual presentation direction

Stadium/campus presentation starts as a readable management surface, not a
free-build 3D game:

- MVP / first build-out: curated slots, module cards, 2D or isometric board,
  KPI overlays and clear upgrade stages.
- Phase 2+: infrastructure overlays for fan flow, queue pressure, security
  load, hospitality utilisation, sponsor activation and revenue per zone.
- Optional later: 2.5D/3D stadium or campus viewer behind
  [[../10-Architecture/09-Decisions/ADR-0041-presentation-renderer-strategy]].
  It consumes venue read models only and does not change build economics.

Free placement is not the default path. Slot-based or curated build fields are
better for mobile, balance, DDD modelling and deterministic saves.

## 10. Promotion compliance hooks

When the team is promoted, the [[regulations-and-compliance]] system
checks the current stadium against the destination tier. Player options:

- Crash-build (expensive, fast).
- Special permit (penalty, conditional).
- Ground-share with another club (rent cost, lower revenue).
- Refuse promotion (only in roguelite mode - run consequence).

## 11. Future-scope notes (classified future-scope)

- Should we model travel time inside the campus (Anstoss "Flugplatz" gave
  +20 % away wins)? Yes, but as a soft modifier (+5 % at most) so it can't
  be exploited.
- Are weather-protected stand types modelled (roof / partial roof)? Yes -
  modifier on weather event impact ([[matchday-event-engine]]).
- Multiple stadium owners (community stadium) - in scope post-MVP only.
- Manual venue booking depth - start with policy presets + highlighted
  accept/reject decisions; consider Expert manual booking only after the
  first stadium prototype proves the added depth is fun.
