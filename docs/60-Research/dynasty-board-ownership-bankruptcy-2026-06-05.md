---
title: "Dynasty board, ownership & bankruptcy — research synthesis (FMX-89)"
status: draft
tags: [research, dynasty, board, confidence, ownership, takeover, bankruptcy, administration, determinism, fmx-89]
context: club-management-economy
created: 2026-06-05
updated: 2026-06-05
type: research
binding: false
linear: FMX-89
sourceType: external
related:
  - [[raw-perplexity/raw-board-confidence-real-world-2026-06-05]]
  - [[raw-perplexity/raw-club-takeover-administration-real-world-2026-06-05]]
  - [[raw-perplexity/raw-board-ownership-comparable-games-2026-06-05]]
  - [[raw-perplexity/raw-deterministic-long-sim-patterns-2026-06-05]]
  - [[determinism-and-replay]]
  - [[late-game-systems]]
  - [[ai-manager-behaviour]]
  - [[ai-world-drift-algorithm-2026-06-03]]
  - [[../10-Architecture/09-Decisions/ADR-0079-dynasty-board-ownership-and-bankruptcy]]
  - [[../50-Game-Design/GD-0030-dynasty-board-and-ownership]]
  - [[../10-Architecture/state-machines/dynasty-board-and-ownership]]
  - [[../10-Architecture/bounded-context-map]]
  - [[../30-Implementation/economy-calibration-and-soak-test-runbook]]
---

# Dynasty board, ownership & bankruptcy — research synthesis (FMX-89)

Grounds **FMX-89** (epic E5 — AI World Simulation & Dynasty Arc; gaps **G2/G20**
late-game arc): promote the research-tier board-ambition, ownership-transition and
bankruptcy/administration prose into ratified, deterministic, calibratable design.
Four Perplexity strands were captured verbatim — real-world board confidence
([[raw-perplexity/raw-board-confidence-real-world-2026-06-05]]), real-world
takeovers/administration
([[raw-perplexity/raw-club-takeover-administration-real-world-2026-06-05]]),
comparable games
([[raw-perplexity/raw-board-ownership-comparable-games-2026-06-05]]) and
deterministic long-sim patterns
([[raw-perplexity/raw-deterministic-long-sim-patterns-2026-06-05]]). This note
distils them; decisions land in
[[../10-Architecture/09-Decisions/ADR-0079-dynasty-board-ownership-and-bankruptcy]]
(architecture) and [[../50-Game-Design/GD-0030-dynasty-board-and-ownership]]
(design), with the FSMs in
[[../10-Architecture/state-machines/dynasty-board-and-ownership]]. Status `draft`
— direction, not authority.

## 1. What the vault already fixes (pre-existing constraints)

- **Club Management is the sole finance-ledger writer** and *already owns* "budget
  envelopes, **board pressure** and staged **insolvency state**"
  ([[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]];
  [[../10-Architecture/bounded-context-map]] §1). Other contexts emit facts via
  **Customer-Supplier + ACL**; nobody else posts ledger rows.
- **Manager & Legacy** owns manager identity, run analysis, style signals and
  cross-save meta, with the rule *"cross-save meta read only at save creation,
  never during a running save"*
  ([[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]).
- **FMX-91 / ADR-0071** (AI World Simulation, proposed) already publishes
  `RisingRivalTriggered` / `GiantCollapseTriggered` / `ContinentalEraShifted` and
  pinned the **`instability_score`** model (≥3 → takeover candidate) and the RNG
  sub-labels `worldAiMgmt:structural:year:<y>:takeover:<clubId>` and
  `worldAiMgmt:drift:season:<s>:owner-resistance:<clubId>`. FMX-89 **consumes**
  these drift facts; it does not redefine them.
- **Determinism** ([[determinism-and-replay]]): stream **#1 `WorldRng`** (world
  drift, league restructure, board events) and **#2 `WorldAiMgmtRng`**
  (out-of-match AI-management decisions). Seed by `xxhash32(label, masterSeed)`;
  adding a new label never perturbs existing streams (the future-proofing
  property). Every stochastic draw declares a sub-label
  ([[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]] §3).
- **Existing research to promote:** [[late-game-systems]] §6 (`OwnerProfile`,
  6 archetypes, `instability_score`, §6.4 bankruptcy/administration) and
  [[ai-manager-behaviour]] §9.1 (board confidence formula), §10.5 (8-tier
  expectation ladder + ±1-tier ratchet), §4.3 (personality-drift caps as
  archetype-resistance).

## 2. Real-world rails (what reality looks like)

**Board expectations** are set from wage/squad-value rank + prior finish + owner
ambition + financial-regulation headroom, expressed as a league target + cup
targets + 1-2 strategy goals; over/under-performance **ratchets** next season's
baseline (a weighted average of the last 2-3 seasons). **Board confidence** tracks
*distance from an invisible band*, weighted heavily by recent results and trend,
modified by marquee/derby/cup events, fan unrest and board-relationship factors.
The dismissal ladder is a recognisable sequence: **Satisfied → Concerned →
Under review (internal target window) → public Vote-of-confidence (ultimatum) →
Last chance (hidden do-or-die) → Sacked**, compressed at elite clubs.

**Ownership change** is triggered by owner distress/fatigue, ambition plateaus,
asset/real-estate plays, brand/portfolio logic, distressed-debt opportunism,
sovereign prestige, or supporter rescue — gated by a **fit-and-proper / Owners' &
Directors' Test** (criminal/disqualification/sanctions/insolvency flags). The
recurring **owner archetypes** map cleanly onto the vault's six: Custodian/
Foundation, Sugar-Daddy, Leveraged/Asset-Stripper, Distressed-Debt/Turnaround,
Sovereign/State (≈ Petrol-State), Corporate/PE + Fan-owned (≈ Foreign-Business/
Murky variants).

**Financial distress → administration → bankruptcy** is a staged descent:
stress (wages > ~80-100% turnover) → cash-flow crisis → missed payroll/HMRC →
winding-up petition → **administration** (EFL automatic **−12 points** + transfer
embargo + administrator fire-sale) → fork: **CVA / new-owner rescue** (creditors
take pence in the pound; survival with lasting reputation damage) vs **liquidation
→ phoenix club** (assets/IP sold, league expulsion, supporters restart far down
the pyramid). Named patterns: Portsmouth (double administration → fan rescue),
Leeds (over-optimistic leverage → fire-sale), Bolton/Wigan (funding withdrawal →
admin → relegation), Derby (FFP-stacked deductions), Bury (expulsion → phoenix).

## 3. Genre lessons (what games get right and wrong)

- **FM** does **holistic, multi-channel** confidence (competition / vision /
  finance / squad mood / transfers) + a **2-phase sacking** (board-confidence
  meeting with a temporary override objective → hard cutoff) + **board meetings
  with negotiation**. Its weaknesses are exactly our targets: **takeovers feel
  cosmetic** (a budget bump + a line of text), and **bankruptcy is one-shot
  punitive** (no recovery arc).
- **OOTP** foregrounds the **owner as a character** with legible **trait axes**
  (Big-Spender↔Penny-Pincher, Hands-Off↔Interfering, Win-Now↔Patient,
  Stars↔Prospects) and explicit owner goals that drive budgets — the clearest
  template for *playable* ownership. Its weakness: conservative finances cause
  late-game stagnation.
- **EA FC** exposes **priority-tiered objectives** (Critical/High/Medium/Low) and
  a single 0-100 rating that is easy to read but feels arbitrary (off-theme
  Critical goals; you can win everything and still be fired).
- **Synthesis for FMX-89:** keep FM's holistic confidence + 2-phase sacking, adopt
  OOTP's **legible owner archetypes-as-trait-points**, and fix the two genre
  failures by making **ownership change consequential** (archetype swap → budget
  philosophy + expectation reset) and bankruptcy a **real arc** (heroic-save vs
  abandon) — while staying transparent (surface the score + top helping/hurting
  factors; only realistically-sackable goals are Critical).

## 4. Determinism patterns (how to keep 50 years volatile but fair)

- **Layered, seasonal-cadence simulation:** structural decisions (ownership,
  administration, board-ambition shifts) resolve on a **season-end structural
  pass**, not per-tick — matching FMX-91's `generatedBy: 'season-end-structural-
  pass'`. Continuous ticks stay for finance/form.
- **Named sub-streams, partitioned by semantic domain** (not event count) so
  adding an event type never desyncs old saves — exactly the property
  [[determinism-and-replay]] §2.3 already relies on.
- **Hard caps + cooldowns + an instability budget:** eligibility check → bounded
  probability → cap/cooldown gate → deterministic apply. Mirrors §6.3's existing
  caps (≤1 takeover/league/5-7 seasons; ≤2 globally/season).
- **Archetype-resistance as continuous modifiers, not exceptions:** an owner's
  trait vector damps/amplifies event weights (stable Foundation suppresses
  giant-collapse/takeover; reckless Asset-Stripper amplifies administration risk)
  — the §4.3 drift-cap substrate generalised.
- **Anti-flatline = power-scaled resistance + structural turnover + soft
  catch-up**, with **locality / attribution / bounded severity** guardrails so
  drama never reads as arbitrary. This is the direct answer to GD-0010's named
  "Club Boss late-game flatline" retention-failure mode.

## 5. How this maps to the decisions (D1-D4)

| Q | Decision | Research basis |
|---|---|---|
| **D1** | All three FSMs = a **Board & Ownership sub-aggregate set in Club Management** | ADR-0050 already owns board pressure + insolvency stage + is sole ledger writer ⇒ bankruptcy/ownership ledger effects need no cross-context ACL; no new BC (governance prefers a stable map). |
| **D2** | **Core MVP + reserved tail** (ratify entry→−12→embargo→fire-sale→rescue/survival; reserve liquidation→phoenix + CVA) | FM ships exactly the core; phoenix/liquidation touch league registration + save structure (highest blast radius) → defer. |
| **D3** | Ownership/bankruptcy stochastic draws on **`WorldAiMgmtRng`**; **board-ambition escalation deterministic** | Reuses FMX-91's `worldAiMgmt:structural:...` grammar; the ±1-tier ladder is a pure function of finish-vs-target (no draw) — cleanest replay. (Reconciles the [[determinism-and-replay]] "board events → WorldRng" wording: impersonal board *events* may still draw `WorldRng`, but the AI-management ownership/insolvency decisions follow FMX-91 on `WorldAiMgmtRng`; the board ladder needs no stream at all.) |
| **D4** | **6 named archetype presets** on a **continuous 6-axis trait space** | OOTP-style legibility + the research's "continuous, not binary" replay-stability; preserves the existing §6.2 archetypes. |

## 6. Open / deferred (to calibration or later issues)

- **All numeric magnitudes** — instability factors + threshold, takeover
  caps/cooldown, admin points-deduction band, embargo wage-cap %, escalation
  tier deltas, confidence decay/weights, archetype budget multipliers — are
  **FMX-52 calibration** (banded ranges, evidence gate), never locked from
  intuition.
- **Liquidation → phoenix club + creditor-CVA negotiation** — reserved post-MVP
  (D2); named hooks only.
- **Late-game UI** (board-meeting dialogue surfaces, ownership news) — gaps
  G4-G6, separate issues.
- **National-team dual-role** (FMX-84) and **engagement-flatline + HoF metrics**
  (FMX-90) — sibling E5 issues this one unblocks.

## 7. Sources

Real-world board confidence, real-world takeover/administration, comparable
games and deterministic long-sim patterns — verbatim captures linked in the
frontmatter. Vault: [[late-game-systems]] §6/§11.4, [[ai-manager-behaviour]]
§4.3/§9.1/§10.5, [[ai-world-drift-algorithm-2026-06-03]], [[determinism-and-replay]],
ADR-0050 / ADR-0051 / ADR-0071 / ADR-0018, [[../50-Game-Design/GD-0010-ai-world]].
