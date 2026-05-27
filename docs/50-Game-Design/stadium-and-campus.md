---
title: Stadium and Club Campus - Build-out and On-grounds Economy
status: draft
tags: [game-design, stadium, infrastructure, anstoss]
created: 2026-05-16
updated: 2026-05-22
type: game-design
binding: true
related: [[README]], [[../60-Research/anstoss-series-deep-dive]], [[../60-Research/systems-design-synthesis]], [[../60-Research/systemic-events-player-development-venue-ops]], [[../60-Research/presentation-renderer-strategy]], [[../60-Research/club-economy-blueprint-2026-05-27]], [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]], [[../10-Architecture/09-Decisions/ADR-0041-presentation-renderer-strategy]], [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]], [[economy-system]], [[fan-ecology]], [[regulations-and-compliance]]
---

# Stadium and Club Campus - Build-out and On-grounds Economy

> Approved by the systemic events / player lifecycle pass (2026-05-17).
> Venue operations are a Club Management system with football consequences,
> not a detached tycoon minigame.

The stadium is the **economic and emotional heart** of the club. Anstoss 3
proved that buildings on the grounds (Würstchenbude, Bierzelt, Fanshop,
Disco) carry more long-term player engagement than any tactic screen. This
is one of our three flagship differentiators - see
[[../60-Research/systems-design-synthesis]] §4.

FMX-13 clarifies the accounting boundary: stadium and campus decisions do not
own their own money model. They emit facility, matchday and venue-operation
facts that Club Management posts into [[economy-system]] through the accounting
ledger described in
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
weather. See [[fan-ecology]] §4.

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

## 8. UI tiers

| Tier | Surface |
|---|---|
| Quick | "Build wizard": recommend next 1-3 upgrades + cost |
| Standard | Tile map of grounds + module list |
| Expert | SimCity-style grid, plot pricing, queueing, blueprint optimisation |

## 8.1 Visual presentation direction

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

## 9. Promotion compliance hooks

When the team is promoted, the [[regulations-and-compliance]] system
checks the current stadium against the destination tier. Player options:

- Crash-build (expensive, fast).
- Special permit (penalty, conditional).
- Ground-share with another club (rent cost, lower revenue).
- Refuse promotion (only in roguelite mode - run consequence).

## 10. Future-scope notes (classified future-scope)

- Should we model travel time inside the campus (Anstoss "Flugplatz" gave
  +20 % away wins)? Yes, but as a soft modifier (+5 % at most) so it can't
  be exploited.
- Are weather-protected stand types modelled (roof / partial roof)? Yes -
  modifier on weather event impact ([[matchday-event-engine]]).
- Multiple stadium owners (community stadium) - in scope post-MVP only.
- Manual venue booking depth - start with policy presets + highlighted
  accept/reject decisions; consider Expert manual booking only after the
  first stadium prototype proves the added depth is fun.
