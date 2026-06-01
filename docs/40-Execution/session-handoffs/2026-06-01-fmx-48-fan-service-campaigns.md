---
title: Handoff FMX-48 Fan-Service Campaign Catalog and Effects
status: wrapped
tags: [meta, execution, handoff, economy, fans, fan-service, sponsorship, travel, alcohol, safety, fmx-48]
created: 2026-06-01
updated: 2026-06-01
type: handoff
binding: false
related:
  - [[../../60-Research/fan-service-campaign-catalog-and-effects-2026-06-01]]
  - [[../../60-Research/raw-perplexity/raw-fan-service-campaign-catalog-and-effects-2026-06-01]]
  - [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../../50-Game-Design/economy-system]]
  - [[../../50-Game-Design/audience-and-atmosphere]]
  - [[../../50-Game-Design/stadium-and-campus]]
  - [[../../50-Game-Design/matchday-event-engine]]
  - [[../../50-Game-Design/sponsorship-portfolio]]
  - [[../../20-Features/feature-club-economy-mvp-pillar]]
  - [[../../30-Implementation/club-economy-commercial-contracts]]
  - [[../../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
---

# Handoff: FMX-48 Fan-Service Campaign Catalog and Effects (2026-06-01)

## Linear

- Issue: FMX-48 - Research fan-service campaign catalog and effects
  (`type:research`, `type:game-design`, `needs:nico-decision`, Medium).
- Branch: `codex/fmx-48-fan-service-campaign-catalog-effects` (off `main`).
- Sibling/parallel: none active when this beat continued; prior FMX-46/47/53
  docs were already on `main`.

## Done this session

- Ran grounded follow-up research across away trains/buses/flights,
  fan/family/community events, choreo/SLO/dialogue, alcohol/beverage campaigns
  and sponsorship activation measurement. Source anchors are preserved in the
  raw note.
- New synthesis
  [[../../60-Research/fan-service-campaign-catalog-and-effects-2026-06-01]] and
  raw transcript
  [[../../60-Research/raw-perplexity/raw-fan-service-campaign-catalog-and-effects-2026-06-01]].
- Refined drafts: GD-0022, economy-system, Audience & Atmosphere, Stadium &
  Campus, Matchday Event Engine, Sponsorship Portfolio, Club Economy MVP pillar
  and the commercial-contract implementation surface.
- ADR-0050: added fan-service campaign settlement events and read-model hook.
  ADR-0058: added the FMX-48 amendment with no boundary change.
- Indexes: Current-State banner, Research-Map entry, 60-Research/00-summary
  section, raw-perplexity/README row and this handoff.

## Key proposed direction

- `FanEventCampaign` is a CommercialPortfolio-owned lifecycle:
  `draft -> scheduled -> active -> settled -> reviewed`, with `cancelled` and
  `breached` exits.
- First catalog is at least eight, likely ten, campaign kinds: `away-train`,
  `bus-subsidy`, `flight-subsidy`, `family-day`, `summer-party` /
  `fan-festival`, `community-ticket-day`, `choreo-support`,
  `supporter-dialogue`, `beer-per-goal` / beverage reward and
  `digital-fan-challenge`.
- Direct settlement and fan effects stay separate: Club Management posts costs,
  sponsor contributions, refunds and make-goods; Audience & Atmosphere owns
  mood, trust, atmosphere, demand and cooldown memory.
- Campaign fields include target segments, capacity, eligibility, sponsor
  contribution, fulfilment model, KPI targets, cooldown, make-good, risk flags
  and provenance.
- Travel, alcohol, safety, child/family and digital/UGC risks are profile-gated.
  Non-alcoholic beverage variants are the safe default fallback.

## Open / next step

- Nico decisions: first-playable campaign catalog size, Quick-mode abstraction,
  beer/alcohol naming versus beverage abstraction, cooldown hardness, SLO staff
  depth, travel disruption/refund/damage-reserve depth and sponsor make-good
  visibility.
- Downstream economy beats still in Todo: FMX-49 (financing tools), FMX-50
  (Investor compliance), FMX-51 (AI club economy), FMX-52 (calibration &
  soak-test).

## Blockers

- None. Research/planning only; nothing implemented. All values remain ranges or
  hooks pending Nico calibration. ADR-0050/0058 stay accepted/binding with
  additive amendments only.

## Changed vault paths

- `docs/60-Research/fan-service-campaign-catalog-and-effects-2026-06-01.md`
  (new)
- `docs/60-Research/raw-perplexity/raw-fan-service-campaign-catalog-and-effects-2026-06-01.md`
  (new)
- `docs/40-Execution/session-handoffs/2026-06-01-fmx-48-fan-service-campaigns.md`
  (new)
- `docs/50-Game-Design/GD-0022-economy-commercial-impact-and-contracts.md`
  (refined)
- `docs/50-Game-Design/economy-system.md` (refined)
- `docs/50-Game-Design/audience-and-atmosphere.md` (refined)
- `docs/50-Game-Design/stadium-and-campus.md` (refined)
- `docs/50-Game-Design/matchday-event-engine.md` (refined)
- `docs/50-Game-Design/sponsorship-portfolio.md` (refined)
- `docs/20-Features/feature-club-economy-mvp-pillar.md` (refined)
- `docs/30-Implementation/club-economy-commercial-contracts.md` (refined)
- `docs/10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger.md`
  (events + read model)
- `docs/10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary.md`
  (FMX-48 amendment)
- `docs/00-Index/Current-State.md` (banner)
- `docs/00-Index/Research-Map.md` (entry)
- `docs/60-Research/00-summary.md` (section)
- `docs/60-Research/raw-perplexity/README.md` (row)
- `docs/40-Execution/session-handoffs/README.md` (entry)
