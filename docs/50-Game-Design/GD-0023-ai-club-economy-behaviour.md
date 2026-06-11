---
title: GD-0023 AI Club Economy Behaviour
status: accepted
tags: [game-design, gddr, ai, ai-clubs, economy, world-simulation, fmx-51]
created: 2026-06-01
updated: 2026-06-11
type: game-design
binding: false
related: [[README]], [[GD-0010-ai-world]], [[GD-0008-finance-economy]], [[GD-0022-economy-commercial-impact-and-contracts]], [[economy-system]], [[../60-Research/ai-club-economy-behaviour-2026-06-01]], [[../60-Research/ai-manager-behaviour]], [[../60-Research/transfer-market-simulation]], [[../60-Research/top5-country-economy-profiles-2026-05-29]], [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]], [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]], [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]], [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
---

# GD-0023: AI Club Economy Behaviour

## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `draft`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

## Date

2026-06-01

## Player experience goal

A world where **every** club — not just the player's — prices tickets, disciplines
wages and transfers, takes on and works off debt, signs commercial deals and reacts
to promotion, relegation, cup nights and revenue shocks. Rivals rise and fall for
**legible, in-fiction reasons**; the player can read *why* an AI club sold its star or
froze its budget, and never feels the game is secretly helping or hurting anyone.

## Decided / strong (proposed)

- **Compose, do not invent.** AI club economy is the locked manager-AI agent
  ([[../60-Research/ai-manager-behaviour]]) plus a thin **club financial-policy
  layer** — it reuses the manager archetypes, the transfer sell model + tier fidelity
  ([[../60-Research/transfer-market-simulation]]), the weekly ledger + staged
  insolvency ([[economy-system]]), and the `CountryEconomyProfile`
  ([[../60-Research/top5-country-economy-profiles-2026-05-29]]).
- **Five financial-policy archetypes** layered on the manager archetype: *selling /
  player-trading*, *sugar-daddy / benefactor*, *prudent self-sustaining*,
  *over-leveraged gambler*, *yo-yo / parachute-reliant* — each with research-banded
  wage/turnover, transfer-reinvestment and debt-tolerance defaults, modulated by board
  **ambition + patience** and the country profile.
- **Three financial regimes** `Healthy / Stressed / Distressed`, set by a cheap FSM
  from budget ratios, gate the action set; **utility ranking** chooses within the
  regime; **heuristic constraints + country compliance** bound the result. Same
  three-layer shape as the locked manager AI.
- **Tiered fidelity:** Tier 0 (player's division + key rivals) full loop + **active**
  commercial choices; Tier 1 simplified; Tier 2-3 banded/statistical; lazy-expand —
  within the locked out-of-match per-club budget.
- **Soft, diegetic homeostasis only — no AI stat cheats.** Progressive costs, soft
  caps, revenue-indexed wage-growth caps, reference pricing, solidarity/parachute
  pools, ROI decay, a hard survival floor and PI-controller mean-reversion, all
  applied **identically to player and AI**.
- **Staged distress with rare, bounded insolvency:** AI clubs traverse the existing
  insolvency FSM; a survival floor + restructuring keep collapse rare; administration/
  points-deduction/phoenix outcomes are possible but uncommon, differentiated by the
  country `financialControlRegime`.
- **AI owner support is in-fiction** (equity injection / director soft loan with
  strings) — **never** the singleplayer real-money Investor, which no AI club holds or
  buys ([[../60-Research/investor-compliance-and-entitlement-boundary-2026-06-01]]).
- **Explainability via structured rationale tags** rendered to board/news strings now;
  full Narrative-context integration deferred as a hook.

## Ownership & boundaries (unchanged)

- **Club Management** stays the sole finance-ledger writer (ADR-0050); AI club
  finance flows through the **same** events/ledger as the player's club.
- **CommercialPortfolio** owns commercial policy + settlement (ADR-0058); AI clubs are
  **consumers** of commercial contracts via the reserved hooks (`cashUrgency`,
  `fanFitWeight`, `serviceQualityWeight`, `renewalBias`; FMX-47 catering/merch bands).
- **Manager & Legacy** (ADR-0051) supplies manager identity/archetype; AI economic
  personality composes with it.
- Determinism: AI economy draws only from `WorldAiMgmtRng` sub-labels.

## Open (Nico-gated; defaults in the research note)

- Archetype-to-club **assignment** (generated vs authored vs hybrid).
- **Insolvency frequency** band (FMX-52 calibration).
- **Homeostasis aggressiveness** (gains/slopes/caps; FMX-52 calibration).
- **Rationale-tag vocabulary** (confirm/extend the initial set).
- **Tier 0 commercial-choice breadth**.
- Whether GD-0023 **absorbs** the economy slice of GD-0010 R2-04/R2-06 or links them
  (default: owns the economy slice; tactical/world-drift stays in ai-manager-behaviour
  / GD-0010).
- Whether **AI owner-support** is enabled for all profiles or gated (e.g. 50+1).

## Rationale

Long-term retention depends on a living economy of rival clubs (GD-0010). The genre
norm is budget-envelope AI protected from collapse; research shows a layered
heuristic/utility agent with diegetic dampers produces believable, stable, explainable
behaviour cheaply, while hidden rubber-banding reads as unfair. Composing existing
locked systems avoids duplicate machinery and keeps the world coherent.

## Consequences

Positive:

- Decades-long saves stay alive; the transfer market has credible counter-parties;
  FMX-52 has a stable, observable economy to calibrate.

Negative / constraints:

- Adds a financial-policy layer + regime FSM to the world tick (bounded by tiering +
  cadence); calibration of bands/dampers is deferred to and depended on by FMX-52;
  several values remain Nico-gated draft.

## Supersedes

None. Resolves the **economy slice** of GD-0010 R2-04 (AI archetypes) / R2-06
(world-drift) for club finance; tactical and world-drift detail remain with
[[../60-Research/ai-manager-behaviour]] and [[GD-0010-ai-world]].

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]] — AI finance uses the same ledger
- [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]] — AI as commercial-contract consumer
- [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]] — manager-archetype composition
- [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]] — deferred rationale→narration hook

## Related

- Research: [[../60-Research/ai-club-economy-behaviour-2026-06-01]] (FMX-51 synthesis) ·
  [[../60-Research/ai-manager-behaviour]] · [[../60-Research/transfer-market-simulation]] ·
  [[../60-Research/top5-country-economy-profiles-2026-05-29]]
- [[README]] — hub · siblings: [[GD-0010-ai-world]] · [[GD-0008-finance-economy]] ·
  [[GD-0022-economy-commercial-impact-and-contracts]] · [[economy-system]]
