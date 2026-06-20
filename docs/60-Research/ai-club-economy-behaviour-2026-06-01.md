---
title: AI Club Economy Behaviour - Research Synthesis 2026-06-01
status: draft
tags: [research, economy, ai, ai-clubs, world-simulation, debt, wages, transfers, homeostasis, fmx-51]
context: [ai-world-simulation, club-management-economy]
created: 2026-06-01
updated: 2026-06-01
type: research
binding: false
linear: FMX-51
sourceType: external
related:
  - [[raw-perplexity/raw-ai-club-economy-behaviour-2026-06-01]]
  - [[ai-manager-behaviour]]
  - [[transfer-market-simulation]]
  - [[determinism-and-replay]]
  - [[performance-budgets]]
  - [[top5-country-economy-profiles-2026-05-29]]
  - [[club-economy-impact-map-and-commercial-contracts-2026-05-28]]
  - [[catering-and-merchandise-operations-2026-06-01]]
  - [[investor-compliance-and-entitlement-boundary-2026-06-01]]
  - [[../50-Game-Design/GD-0023-ai-club-economy-behaviour]]
  - [[../50-Game-Design/GD-0010-ai-world]]
  - [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../50-Game-Design/economy-system]]
  - [[../50-Game-Design/GD-0008-finance-economy]]
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
  - [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  - [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
---

# AI Club Economy Behaviour - Research Synthesis 2026-06-01

## Question

The club economy (weekly ledger, full accounting, commercial impact, country
profiles, staged insolvency, Investor) has been designed from the **human player's**
seat. FMX-51 asks: how should the **AI-controlled clubs** that fill the world behave
as economic actors — setting ticket/season-ticket policy, disciplining wages and
transfers, tolerating and managing debt, choosing sponsor/catering/merch deals, and
reacting to promotion, relegation, cup windfalls, European money and revenue shocks —
so the player is not the only club making economic decisions, leagues rise and fall
believably, and the calibration/soak-test capstone ([[#^fmx52|FMX-52]]) has a stable
economy to validate?

This beat is mostly **synthesis**: it wires the genre/real-world/AI-design evidence
into the systems the vault already locked, rather than inventing new machinery.

## Nico defaults carried in (confirmed this session)

1. **Compose existing systems** — reuse the ten manager archetypes in
   [[ai-manager-behaviour]] and add a thin **club financial-policy layer** from the
   five real-world archetypes, modulated by board **ambition + patience** and the
   `CountryEconomyProfile` ([[top5-country-economy-profiles-2026-05-29]]). Nothing new
   invented; everything plugs into hooks the economy beats already reserved.
2. **Soft, diegetic homeostasis only — no hidden rubber-banding.** Same rules for
   player and AI (consistent with the locked "no AI stat cheats" rule).
3. **Staged distress with rare, bounded insolvency** — AI clubs traverse the existing
   insolvency FSM and can occasionally enter administration/rescue; a hard survival
   floor + restructuring keep collapse rare so leagues stay coherent.
4. **Deliverable** = this synthesis + draft GDDR [[../50-Game-Design/GD-0023-ai-club-economy-behaviour]]
   + small hook updates to GD-0010 / GD-0022. No new ADR (fits accepted ADR-0050 /
   ADR-0051 / ADR-0058 and the locked ai-manager-behaviour + transfer-market research).
5. **Tiered fidelity** — Tier 0 (player's division + key rivals) full weekly loop,
   Tier 1 simplified, Tier 2-3 banded/statistical; lazy-expand; stay inside the locked
   out-of-match per-club weekly budget ([[performance-budgets]], [[ai-manager-behaviour]]).
6. **Active commercial choices for Tier 0, banded below.**
7. **Structured rationale tags now, news/narrative integration later** (deferred hook
   to [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]).

## Already locked upstream (do NOT re-litigate)

- **AI architecture & budget:** utility-AI core + light FSM situation classifier +
  heuristic constraints; ten archetypes; four difficulty modes with **no AI stat
  cheats**; out-of-match weekly per-club tick (already lists *loans / board /
  sponsors / facilities*) within the locked CPU budget; world drift = wage inflation,
  progressive FFP, talent diffusion, tactical arms race, board-expectation escalation,
  Rising Rival / Giant Collapse structural events ([[ai-manager-behaviour]]).
- **Transfer behaviour:** AI sell model `sellPressure` vs `protectionScore`,
  cash-equivalent clause pricing, valuation bands, and **Tier 0/1/2-3 fidelity by
  world proximity** ([[transfer-market-simulation]]).
- **Determinism:** AI economy must draw only from `WorldAiMgmtRng` with hierarchical
  sub-labels (`worldAiMgmt:club:<id>:*`, `worldAiMgmt:board:<id>:*`); never
  `Math.random` ([[determinism-and-replay]]).
- **Ledger ownership:** Club Management is the sole finance-ledger writer (ADR-0050);
  CommercialPortfolio owns commercial policy + settlement (ADR-0058). AI club
  decisions must flow through the **same** event/ledger model as the player's club.
- **Reserved hooks for this beat:** FMX-44 reserved `cashUrgency`, `fanFitWeight`,
  `serviceQualityWeight`, `renewalBias` for FMX-51; FMX-47 exposes read-only catering/
  merch **band/profile** hooks so AI clubs get plausible outcomes without a full
  operational sim ([[catering-and-merchandise-operations-2026-06-01]]).
- **Country rails:** `CountryEconomyProfile.financialControlRegime` already encodes
  PSR / DFL licensing / LaLiga cap / DNCG / FIGC differences
  ([[top5-country-economy-profiles-2026-05-29]]).
- **Investor is out of scope here:** it is a singleplayer real-money entitlement
  ([[investor-compliance-and-entitlement-boundary-2026-06-01]]); AI clubs never
  purchase it. AI "owner support" is a separate **in-fiction** mechanic (below).

## Summary

The research answer is a **policy-gated, utility-ranked club-finance agent**, the
same shape as the locked manager AI, with five additions:

1. **A club financial-policy layer** on top of the manager archetype: each AI club
   carries a `financialPolicy` archetype (selling / sugar-daddy / prudent /
   over-leveraged / yo-yo) + `ambition` + `patience`, seeded at world-genesis from
   club size, country and board, and drifting slowly over a career.
2. **Three financial regimes** — `Healthy / Stressed / Distressed` — chosen by a
   cheap FSM from budget ratios, gating which actions are even considered; utility
   then ranks candidate actions within the regime. This mirrors the locked
   manager-AI three-layer design and keeps behaviour deterministic and debuggable.
3. **Event-driven re-budgeting** on promotion / relegation / cup / European /
   shock, with archetype- and country-specific responses (parachute cushion only
   where the country profile grants it).
4. **Soft diegetic homeostasis** — progressive costs, revenue-indexed wage-growth
   caps, reference pricing, solidarity/parachute pools, ROI decay, a hard survival
   floor and a PI-controller-style mean-reversion on the wage ratio — all applied
   identically to player and AI, no hidden catch-up.
5. **Structured rationale tags** attached to every AI economic decision, rendered
   into simple board/news strings now and reserved for full narration later.

Tiered fidelity keeps it cheap: Tier 0 runs the full loop and makes active
commercial choices; Tier 1 runs a simplified loop; Tier 2-3 get banded outcomes.
All ratio bands here are **research benchmarks, IP-clean and non-final** — final
constants are set by FMX-52 calibration.

## Source base

| Area | Primary sources | Confidence | FMX use |
|---|---|---|---|
| Genre AI-club economy mechanics | FM finance guides (fmscout); MWM Football Club Management; game-economy AI comparative study (scitepress 102123); OOTP/EA FC/Anstoss/We Are Football/Capitalism Lab conventions | medium-high | Budget-envelope + protection-from-collapse norm; archetype + explainability + MVP-bounded patterns |
| Real-club financial archetypes + ratios | lawinsport football-financing; Deloitte Football Money League 2026; tandfonline 2024 (profit vs sporting); PMC 10704374 (club financial distress) | medium-high (bands), medium (exact %) | The five `financialPolicy` archetypes, wage/turnover bands, reinvestment + debt tolerance, event reactions, wage-inflation propagation |
| AI architecture + long-run stability | scitepress 102123 (rule-based beats ML for sim economy); machinations.io economy design; multi-agent finance references | medium-high | Policy-gating + utility-ranking; anti-runaway/anti-zombie dampers; PI-controller mean-reversion; soak-test KPIs/failure signatures |
| Regulatory rails (per country) | UEFA CLFSR 2025; morgansl FFP 2.0; swissramble; ESPN/Kaufcan FSR (shared with FMX-49) | high (existence), medium (thresholds) | Country distress "personality"; staged embargo→points-deduction→relegation/restart path |
| Vault locked inputs | [[ai-manager-behaviour]], [[transfer-market-simulation]], [[determinism-and-replay]], [[performance-budgets]], [[top5-country-economy-profiles-2026-05-29]], ADR-0050/0051/0058 | binding | Architecture, tiering, RNG, budget, ledger ownership, country profile, manager archetypes |

Confidence: **high** that genre AI is budget-envelope + collapse-protected and that a
layered heuristic/utility agent is the right architecture; **medium-high** on the
archetype taxonomy and ratio bands (well-attested but club-specific); **medium** on
exact thresholds (treat as FMX-52 calibration). Real leagues/clubs are research inputs
only — shipped data is IP-clean and banded ([[ip-and-licensing]], ADR-0007).

## AI economy decision loop

The same three-layer shape as the locked manager AI, specialised to club finance:

1. **Regime FSM (cheap, per tick/per season):** classify the club into
   `Healthy / Stressed / Distressed` from budget ratios (cash runway, wage/revenue,
   debt/revenue, debt-service cover, compliance headroom from the country regime).
   The regime **gates** the candidate action set.
2. **Utility ranking (within regime):** score candidate actions (raise/cut wage
   budget, buy/sell, take/repay debt, set ticket/commercial policy, defer wages, sell
   an asset) against archetype weights + situation. Reject any action that violates a
   hard budget constraint or country compliance rule.
3. **Heuristic constraints + determinism:** hard floors/caps, country compliance,
   and `WorldAiMgmtRng` sub-labels for any stochastic tie-break.

**Cadence (hierarchical decision frequency):** a **per-season strategic re-budget**
(wage envelope, transfer envelope, debt plan, commercial policy) plus **event-triggered**
re-budgets (promotion/relegation/cup/Euro/shock); the existing **weekly tick** only
re-evaluates the cheap regime FSM + any pending obligations. This keeps cost inside the
locked out-of-match per-club budget.

**Tier fidelity** (reusing [[transfer-market-simulation]]):

| Tier | Scope | Economy behaviour |
|---|---|---|
| Tier 0 | Player's division + key rivals | Full loop; **active** commercial choices (ticket stance, season-ticket push, catering operating-model, sponsor/renewal bias) via reserved hooks; full debt/insolvency traversal |
| Tier 1 | Near leagues / likely opponents | Simplified loop; regime + envelope + buy/sell pressure; commercial = profile bands |
| Tier 2-3 | Distant leagues | Banded/statistical outcomes; regime only flips on large shocks; lazy-expand to Tier 1 on first interaction |

## Financial-policy archetypes

A thin layer **on top of** the manager archetype (not a replacement). Bands are
research benchmarks, not final constants.

| `financialPolicy` | Wage/turnover band | Transfer reinvestment | Debt tolerance | Signature behaviour |
|---|---|---|---|---|
| Selling / player-trading | 55-70% | ~50-70% of net sales; net seller over a cycle | Low-moderate (≤~0.8x rev) | Sells above internal value; replaces one star with several upside buys |
| Sugar-daddy / benefactor | 70-100%+ | 100% of sales + owner top-up | High via owner loans/equity (solvent only while owner committed) | Wage premiums → drives inflation; plugs shocks with owner money |
| Prudent self-sustaining | 50-65% | 60-100% over medium term, gradual | Moderate, long-term infra debt (<~1x rev) | Budgets off conservative revenue; cuts wages if revenue drops |
| Over-leveraged gambler | 80-120%+ | 100% + borrowing when chasing | High (1-2x+, secured/instalment/factoring) | Doubles down on promotion; fire-sales on shock |
| Yo-yo / parachute-reliant | 60-85% top tier; 70-100% 2nd tier w/ parachute | Mild in top tier, moderate in 2nd | Moderate; parachute as implicit collateral | Relegation wage-cut/release clauses; promotion within 1-3 seasons |

**Composition:** `archetype = managerArchetype (style)` × `financialPolicy (money)` ×
`ambition` × `patience` × `CountryEconomyProfile`. Example: a *Moneyball* manager at a
*Selling* club in the *Germany-like* profile keeps a tight wage ratio, sells high,
avoids leverage, and is bound early by preventive-licensing headroom. **Assignment** is
generated at world-genesis from club size/reputation, country and board, with optional
authored overrides for signature clubs (open decision 1).

**Owner ambition + patience** are two sliders that modulate any archetype: high
ambition pushes envelopes and resists star sales (and bids up wages → inflation); low
patience drives manager churn, panic buys and deadline overpaying, nudging a club
toward sugar-daddy/over-leveraged behaviour. These reuse the board-pressure /
club-DNA signals already in the manager AI and club-DNA notes.

## Event responses

Re-budget triggers, intensity scaled by archetype and gated by the country profile:

- **Promotion** — revenue jump (2-4x at the top step); wage/transfer envelope grows;
  parachute *expectation* only where the profile grants it. Selling clubs upgrade
  modestly; sugar-daddy/over-leveraged escalate hard; prudent keeps the ratio in check.
- **Relegation** — revenue cliff (>50-60% at the top step); relegation wage-cut/
  release clauses fire; parachute cushion **only in England-like** profiles; over-
  leveraged clubs risk fire-sale / distress; prudent clubs trim to the new revenue.
- **Cup run windfall** — treated as volatile upside: infra/reserves/debt-service
  (prudent, selling), bonus spend (sugar-daddy), debt-service relief or
  over-extension (gambler). Consumes the `CompetitionRevenueProfile` (FMX-45).
- **European qualification / loss** — large UCL-style uplift; over-leveraged clubs
  that *assumed* qualification enter crisis on failure (a deliberate distress driver).
- **Revenue shock** (sponsor loss, sanctions, ghost matches) — player sales, cost
  cuts, wage deferral, or owner top-up by archetype.

## Debt & insolvency behaviour

AI clubs use the **same** financing tools the player has (FMX-49, in progress) and
traverse the **same** staged insolvency FSM in [[economy-system]] §8
(`Healthy → Watch → Overdraft → Freeze → Arrears → LicenceReview → Recovery | RunEnd`):

- **Healthy** — normal policy. **Stressed** (Watch/Overdraft) — austerity: freeze
  non-essential transfers, prefer sales, cut discretionary spend, restructure debt.
  **Distressed** (Freeze/Arrears/LicenceReview) — mandatory cuts, forced sales, seek
  rescue; rare administration with country-specific consequences.
- **Rare, bounded insolvency:** a **hard survival floor** (minimum viable wage/staff/
  matchday spend) + debt-restructuring rules keep most distressed clubs alive;
  administration/points-deduction and phoenix/relegation outcomes are possible but
  uncommon, so divisions don't empty out. Target frequency is an FMX-52 calibration
  band (open decision 2).
- **Per-country distress personality** from `financialControlRegime`:
  - **England-like** — debt-tolerant + owner injections; **automatic points
    deduction** on administration; football-creditor priority; parachute cushion.
  - **Germany-like** — **preventive licensing** (rarely reaches formal insolvency in
    the top tiers); **50+1** blocks leveraged buyouts; licence refusal → relegation.
  - **Spain-like** — revenue-linked squad-cost cap; debt **lowers the cap** →
    self-penalising; over-spend simply blocks registration.
  - **France-like** — interventionist **DNCG**: transfer bans, wage caps, **admin
    relegation for finances alone**.
  - **Italy-like** — **bankruptcy → phoenix restart** lower in the pyramid.
- **AI owner support is in-fiction, never the real-money Investor.** Where an
  archetype/board permits, distress can be met by a fictional **owner equity
  injection or director soft loan** (with strings: wage caps, transfer limits,
  reduced board trust). This is world-simulation, categorically separate from the
  singleplayer IAP Investor ([[investor-compliance-and-entitlement-boundary-2026-06-01]]).

## Commercial decision hooks

AI clubs reach the commercial system through the hooks reserved for this beat:

- **Tier 0 (active):** light, legible choices — ticket-price stance, season-ticket
  push, catering `operatingModel`, sponsor/renewal bias — expressed via `cashUrgency`,
  `fanFitWeight`, `serviceQualityWeight`, `renewalBias` (FMX-44) and the FMX-47
  catering/merch band hooks. CommercialPortfolio settles; Club Management posts the
  ledger entries (unchanged ownership).
- **Tier 1+ (banded):** profile-driven commercial outcomes; no active policy choice.

This stays inside ADR-0058 / ADR-0061 boundaries and reuses FMX-42/43/44/47 models —
AI clubs are **consumers** of the commercial contracts, not a new commercial engine.

## Homeostasis / anti-runaway (no hidden cheats)

All dampers are **diegetic** and apply **identically to player and AI** (the locked
"no AI stat cheats" rule). Composed from several small negative feedbacks rather than
one nerf:

- **Progressive costs / soft caps** — elite wages, fees and agent commissions rise
  nonlinearly with wealth/success; marginal cost rises as payroll/debt rises.
- **Revenue-indexed wage-growth caps + reference pricing** — wages indexed to league
  revenue, not peak transfers; AI bids from the **market median**, not the single
  highest recent fee (curbs the inflation ratchet); reuses the locked world-drift
  wage-inflation + progressive-FFP levers.
- **Solidarity / parachute pools + ROI decay + promotion-relegation churn** — keep
  advantage from freezing; diminishing returns on spend.
- **Anti-zombie floor** — the hard survival floor + automatic austerity + conditional
  rescue prevent permanent death spirals.
- **PI-controller mean-reversion** — correct an AI club's wage ratio toward its
  archetype target with conservative gains
  (`aggressiveness = base + kp·error + ki·Σerror`) to avoid boom-bust oscillation.

Damper **aggressiveness** (slopes/gains/cap levels) is kept as tunables; final values
are FMX-52's job (open decision 3).

## Wage / transfer inflation propagation

Modelled as a network effect feeding FMX-52 KPIs: top spenders set the ceiling →
positional/status benchmarks → league TV-money effects → cascade down the pyramid
(parachute clubs inject top-tier wages into the 2nd tier) → **ratchet** (wages fall
only via relegation clauses, non-renewals, sales). The homeostasis levers above are
exactly what keeps this index bounded over 50-100 seasons.

## Explainability

Every AI economic decision emits **structured fields** + a small fixed set of
**rationale tags**, rendered into simple board/news strings now:

- Tags (initial set, final vocabulary = open decision 4):
  `wage-pressure`, `debt-reduction`, `cup-windfall-reinvest`, `promotion-upgrade`,
  `relegation-trim`, `squad-balance`, `replace-aging-value`, `strategic-rebuild`,
  `owner-backed-push`, `compliance-forced-sale`, `austerity-freeze`.
- Surfaced as: decision reason, policy/regime state, the binding constraint, the
  trade-off. Thresholds and raw utility scores are **not** exposed; explanations stay
  consistent across similar situations.
- **Narration deferral:** full integration into the Narrative context
  ([[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]])
  is a documented hook, not built here — the tag set is designed to be the structured
  input that pipeline later consumes.

## Determinism & performance

- All stochastic choices use `WorldAiMgmtRng` sub-labels
  (`worldAiMgmt:club:<id>:finance:*`, `worldAiMgmt:board:<id>:*`); no `Math.random`;
  adding these labels does not perturb existing streams ([[determinism-and-replay]]).
- Cost stays within the locked out-of-match per-club weekly budget by **tiering** +
  **hierarchical cadence** (cheap weekly regime check; expensive re-budget only
  per-season or on events) + **lazy expansion** of distant clubs
  ([[performance-budgets]], [[ai-manager-behaviour]]).

## Acceptance scenarios

1. **Promotion shock** — a promoted Tier 0 AI club's revenue and wage/transfer
   envelopes grow per its profile; a *prudent* club keeps wage/turnover < its band
   while a *sugar-daddy* escalates; the ledger and a `promotion-upgrade` rationale are
   observable.
2. **Relegation shock** — a relegated club's relegation wage-cut clauses fire; an
   England-like club draws parachute cushioning while a France-like club faces DNCG
   wage caps; an over-leveraged club may enter `Distressed` and force sales.
3. **Cup windfall** — a deep cup run posts a windfall; a *selling* club routes it to
   reserves/infra (`cup-windfall-reinvest`), a *gambler* to debt-service or
   over-extension — without a hidden cash loss on elimination (FMX-45 EV model).
4. **Wage spiral prevented** — over 50 seasons the transfer-fee/wage inflation index
   stays bounded: reference pricing + revenue-indexed caps + progressive costs keep
   the rich club's marginal gains shrinking; no club converts one windfall into
   permanent dominance (title-concentration KPI stays under the FMX-52 band).
5. **Debt recovery (non-zombie)** — a `Stressed` club enters austerity, restructures
   debt, sells an asset, and returns to `Healthy` within a bounded window; the
   survival floor prevents a permanent death spiral.
6. **Rare administration** — occasionally a `Distressed` club enters administration:
   England-like → automatic points deduction + football-creditor priority; Italy-like
   → phoenix restart lower down — at a frequency within the FMX-52 band, leaving the
   division populated.
7. **No-cheat invariant** — disabling the homeostasis dampers changes player and AI
   identically (a determinism/fairness regression check); no AI-only stat boost or
   market hostility exists.
8. **Investor isolation** — no AI club ever holds or purchases an Investor
   entitlement; AI "owner support" only ever posts as in-fiction equity/loan.

<span id="^fmx52"></span>

## Open questions / Nico decisions (defaults applied; flag for review)

1. **Archetype-to-club assignment** — generated from club size/country/board at
   world-genesis (default), vs authored per signature club, vs hybrid (default =
   generated with optional authored overrides).
2. **Insolvency frequency target** — acceptable AI administration rate per division
   per decade (default: rare; exact band set by FMX-52 failure signatures).
3. **Homeostasis aggressiveness** — PI-controller gains, soft-cap slopes and
   wage-growth caps kept as tunables; final constants are FMX-52, not this beat.
4. **Rationale-tag vocabulary** — confirm/extend the initial fixed tag set above.
5. **Tier 0 commercial-choice breadth** — exactly which commercial levers Tier 0 AI
   may actively set (ticket stance + season-ticket push + catering model + renewal
   bias proposed; sponsor-seeking depth optional).
6. **GD-0010 R2-04/R2-06** — whether GD-0023 **absorbs** the economy slice of these
   open AI-world items or merely links them (default: GD-0023 owns the *economy*
   slice; tactical/world-drift detail stays in ai-manager-behaviour / GD-0010).
7. **AI owner-support availability** — whether the in-fiction owner equity/soft-loan
   rescue is enabled for all profiles or gated (e.g. disabled under Germany-like 50+1
   leveraged-control limits).

## Related

- [[raw-perplexity/raw-ai-club-economy-behaviour-2026-06-01]] — raw transcript (4 passes)
- [[ai-manager-behaviour]] — locked AI architecture, archetypes, difficulty, world drift, budget
- [[transfer-market-simulation]] — locked AI sell model + tier fidelity this reuses
- [[determinism-and-replay]] — `WorldAiMgmtRng` streams the AI economy must use
- [[performance-budgets]] — out-of-match per-club budget that bounds the loop
- [[top5-country-economy-profiles-2026-05-29]] — `CountryEconomyProfile` distress personalities
- [[club-economy-impact-map-and-commercial-contracts-2026-05-28]] — reserved AI-club hooks (FMX-44)
- [[catering-and-merchandise-operations-2026-06-01]] — read-only catering/merch band hooks (FMX-47)
- [[investor-compliance-and-entitlement-boundary-2026-06-01]] — Investor isolation (not AI)
- [[../50-Game-Design/GD-0023-ai-club-economy-behaviour]] — draft GDDR this feeds
- [[../50-Game-Design/GD-0010-ai-world]] — AI-world goals / R2-04/R2-06 this resolves the economy slice of
- [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]] — sole ledger writer
- [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]] — manager identity/archetype source
- [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]] — commercial ownership
- [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]] — deferred narration hook
