---
title: GD-0024 AI World-Drift Algorithm
status: accepted
tags: [game-design, gddr, ai-world, world-drift, dynasty, determinism, policy-catalog, fmx-91, fmx-139, accepted]
created: 2026-06-03
updated: 2026-06-19
type: game-design
binding: true
related: [[README]], [[GD-0010-ai-world]], [[GD-0011-career-progression]], [[GD-0023-ai-club-economy-behaviour]], [[GD-0043-gameplay-calibration-ownership-and-acceptance-gate]], [[../60-Research/ai-world-drift-algorithm-2026-06-03]], [[../60-Research/raw-perplexity/raw-ai-world-drift-algorithm-2026-06-03]], [[../60-Research/drift-consumer-policy-ref-contract-2026-06-17]], [[../60-Research/raw-perplexity/raw-drift-consumer-policy-ref-ddd-2026-06-17]], [[../60-Research/raw-perplexity/raw-drift-consumer-policy-ref-realworld-2026-06-17]], [[../60-Research/raw-perplexity/raw-drift-consumer-policy-ref-games-2026-06-17]], [[../60-Research/raw-perplexity/raw-drift-consumer-policy-ref-source-checks-2026-06-17]], [[../40-Execution/fmx-139-drift-consumer-policy-ref-decision-queue-2026-06-17]], [[../60-Research/ai-manager-behaviour]], [[../60-Research/late-game-systems]], [[../60-Research/determinism-and-replay]], [[../10-Architecture/09-Decisions/ADR-0071-ai-world-simulation-context-and-drift-contract]], [[../30-Implementation/gameplay-calibration-and-soak-test-runbook]], [[../30-Implementation/economy-calibration-and-soak-test-runbook]]
---

# GD-0024: AI World-Drift Algorithm

> **RATIFIED on 2026-06-19.** Nico approved the linked FMX decision
> queue via `APPROVE ALL RECOMMENDED`; this game-design record is now
> binding according to its approved scope.


## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `draft`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

> **History (pre-ratification banner, demoted 2026-06-11 per ADR-0092 / FMX-143):**
> FMX-91 draft. Nico selected the four core planning options on 2026-06-03:
> AI World Simulation as proposed bounded context, hybrid RNG allocation,
> reputation-first rising-nations scope and two-level caps. This pre-ratification
> banner is historical; the current frontmatter is the binding status source.

> **FMX-139 proposed amendment (2026-06-17, accepted by Nico 2026-06-19):**
> `DriftConsumerPolicyRef` becomes a hybrid ref/snapshot proposal with AI World
> Simulation owning `WorldDriftPolicyCatalog` identity/versioning, while
> GD-0043/FMX-52 keeps final values and consumer contexts apply their own
> effects. See
> [[../40-Execution/fmx-139-drift-consumer-policy-ref-decision-queue-2026-06-17]].

## Date

2026-06-03

## Player experience goal

A 50-year save should feel like a living football world: rivals emerge for
readable reasons, giants can decline through visible pressure, and regions/leagues
can drift in strength without the player feeling hidden rubber-banding.

## Decided / strong (proposed)

- **World drift is structural and legible.** Every drift event is driven by
  visible inputs: title vacuum, financial stress, owner/board profile, coefficient
  trend, reputation and squad-cycle pressure.
- **AI World Simulation orchestrates drift.** The proposed context owns
  candidate scoring, cooldowns, drift-event publication and calibration sheets.
  It does not own fixtures, ledgers, regulations, youth generation or
  commercial settlement.
- **Three MVP drift families:** Rising Rival, Giant Collapse and Continental
  Era Shift / rising nations.
- **No hidden catch-up buff.** Drift emits in-fiction facts and forecasts; all
  effects are consumed by the owning contexts.
- **No final constants in this GDDR.** Thresholds, probabilities and magnitudes
  are banded parameter families routed to GD-0043 `world.drift` calibration.
- **Consumer policy refs are explainable contract handles, not hidden buffs.**
  FMX-139 proposes that each ref carries a catalog version, target context,
  effect family, label/explanation keys and minimal resolved snapshot so
  consumers can project effects without current AI World table reads.

## Drift loop

Each season-end structural pass runs after competition results, finance audit and
promotion/relegation confirmation:

```text
1. Build candidate sets from published facts.
2. Score candidates with deterministic metrics.
3. Apply owner/manager/club resistance modifiers.
4. Check global MVP caps + mechanism cooldowns.
5. Use labelled RNG only for timing/shape inside eligible bands.
6. Publish a self-contained WorldDrift event.
7. Consumer contexts apply their own policies.
```

Same `worldSeed`, same engine version and same save facts must produce the same
world-drift event sequence.

## Drift mechanisms

### Rising Rival

Purpose: create a credible new challenger when a region/division has lacked a
serious title or continental-breakthrough candidate for too long.

Candidate inputs:

- title-vacuum window;
- market/fanbase/city-size band;
- stadium and youth-track-record band;
- owner-attractiveness band;
- league reputation and transfer-pull band;
- recent financial stability.

Effects:

- `RisingRivalTriggered` with investment-project profile id;
- wage-budget and transfer-pull band for a limited horizon;
- reputation and media-storyline lift;
- CommercialPortfolio and Club Management consume facts through their own
  policies; AI World does not post money.

### Giant Collapse

Purpose: prevent permanent superclub lock-in when success, wage burden, age and
ownership instability combine.

Candidate inputs:

- recent success / reputation band;
- wage-to-revenue pressure;
- debt/loss/owner-fatigue pressure;
- aging-core and contract-expiry cluster;
- `instability_score` from [[../60-Research/late-game-systems]];
- missed continental revenue or regulatory pressure.

Effects:

- `GiantCollapseTriggered` with crisis-profile id;
- forced-sale mandate / wage-band reduction / transfer-restriction policy refs;
- board/ownership crisis fact consumed by FMX-89 dynasty/ownership work;
- aftermath states remain visible through news, board reports and finances.

### Continental Era Shift / rising nations

Purpose: make league/region power drift over decades without directly owning
Youth/Data Generator internals.

Candidate inputs:

- 10-year rolling continental performance;
- league reputation trend;
- transfer import/export balance;
- commercial/revenue band trend;
- region/league talent-pull band.

Effects:

- `ContinentalEraShifted` with region/league profile delta;
- coefficient/slot-pressure facts for future League work;
- reputation, commercial and transfer-pull modifiers;
- `youthDiffusionHint` as a follow-up interface only. FMX-139 recommends making
  this a reserved typed `DriftConsumerPolicyRef` with
  `effectFamily: youth-diffusion` and `activationStatus: reserved`, not an active
  youth-generation mechanic.

## Pacing

MVP uses strict global drama caps so the world does not become chaotic. The
schema reserves per-confederation caps for future multi-continent saves.

Rules:

- only one major Rising Rival project may become active in a configured global
  window;
- Giant Collapse has a longer global cooldown than Rising Rival;
- Continental Era Shift is slower and based on 10-year rolling windows;
- per-confederation caps are inactive until multi-continent simulation depth is
  ratified.

## Player-facing legibility

Every major drift event needs:

- a forecast signal before it fires when feasible;
- a public explanation after it fires;
- a compact "why" breakdown in Quick/Standard/Expert depth;
- a season-history entry for the newspaper/archive layer.
- policy-ref labels and explanation tags resolved into player-facing text rather
  than raw `policyRefId` values.

Examples of explanation facts: title vacuum, owner investment project,
financial stress, wage burden, aging core, coefficient trend and regional
commercial lift. The game must not say or imply that the system secretly nerfed
the player.

## Calibration handoff

GD-0043 `world.drift` owns final gameplay values. This GDDR contributes
parameter families:

- candidate thresholds;
- trigger probabilities;
- effect magnitudes;
- cooldowns/caps;
- resistance modifiers;
- region/reputation drift bands.

Soak metrics include title concentration, new-champion frequency, event density,
event diversity, wage/revenue Gini, revenue Gini, league-strength volatility and
byte-identical event sequence under identical seeds.

## Open (Nico-gated before approval)

- Final parameter bands and default calibration values through GD-0043
  `world.drift`.
- Whether AI World Simulation is ratified as a bounded context or kept as a
  League/Club/Transfer orchestration policy.
- How future Youth/Data Generator work consumes `youthDiffusionHint`.
- Whether multi-continent per-confederation caps activate before post-MVP
  continental competitions.
- Whether Nico accepts FMX-139 D1-D4: hybrid `DriftConsumerPolicyRef`, AI World
  Simulation `WorldDriftPolicyCatalog` ownership, reserved typed
  `youthDiffusionHint` and proposed-only promotion path.

## Calibration slot (FMX-141)

- Slot: `world.drift`
- Parameter pack: `worldDriftModelVersion`
- Harness: T2/T3 AI-only long-horizon drift sweeps in
  [[../30-Implementation/gameplay-calibration-and-soak-test-runbook]].
- Metrics: Rising Rival / Giant Collapse / Continental Era Shift event density,
  cap breaches, title concentration, new-champion frequency, reputation drift,
  league-strength volatility and downstream economy invariants.

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0071-ai-world-simulation-context-and-drift-contract]]

## Related

- Research: [[../60-Research/ai-world-drift-algorithm-2026-06-03]] ·
  [[../60-Research/raw-perplexity/raw-ai-world-drift-algorithm-2026-06-03]] ·
  [[../60-Research/ai-manager-behaviour]] · [[../60-Research/late-game-systems]] ·
  [[../60-Research/determinism-and-replay]]
- Siblings: [[GD-0010-ai-world]] · [[GD-0011-career-progression]] ·
  [[GD-0023-ai-club-economy-behaviour]]
