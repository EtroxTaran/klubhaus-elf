---
title: "RAW — Set-piece-coach effect-readiness multiplier curve"
status: raw
tags: [research, raw, perplexity, set-pieces, staff, training, tactics, match, fmx-69]
created: 2026-06-04
updated: 2026-06-04
type: research
related: [[../setpiece-coach-readiness-2026-06-04]], [[../../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]], [[../../10-Architecture/09-Decisions/ADR-0067-set-piece-variant-selection-determinism]], [[../../50-Game-Design/set-pieces]], [[../../50-Game-Design/training-load-and-medicine]]
---

# RAW Perplexity capture — Set-piece-coach readiness (FMX-69)

> Unprocessed research capture and source notes. Synthesised into
> [[../setpiece-coach-readiness-2026-06-04]]. Do not implement from raw.
> Captured 2026-06-04 (Sonar). Perplexity citations are model-provided and were
> cross-checked only where promoted into the synthesis. Four prompts: real-world
> coaching effect, learning-curve math, comparable games, calibration ranges.

## Prompt 1 — Real-world set-piece coaching effect size, embedding time, diminishing returns

**Key findings:**
- League-average set-piece share ≈ **21.5%** of goals (last 5 PL seasons); top
  specialist sides reach **27–35%**. [premierleague.com 2468880]
- **Arsenal / Jover**: <10% of goals from corners/wide FK pre-Jover → ~¼ in first
  season; **22 set-piece league goals 2022/23** (matched PL record). [ESPN 42706216]
- **Aston Villa / MacPhee**: >¼ of goals from set plays; 7.94 set-piece xG through
  15 games (2nd to Arsenal's 8.84). **Spurs / Vio**: 19 set-piece goals 2022/23.
- **Brentford / Frank**: "optimizing set pieces can yield a dozen or more goals
  annually"; you don't get them without a full-time specialist. Adoption: 3 PL clubs
  with a specialist at start of 2021/22 → ≥12 a couple of seasons later.
- **Effect-size range for the model**: first well-integrated specialist ≈ **+5 to
  +10 set-piece goals/xG per 38-game season** over a non-specialist baseline of the
  same squad; extreme cases +10 to +12. Central default ≈ **+7 goals after 1–2
  seasons**.
- **Diminishing returns (strong)**: no→average specialist ≈ **+4–5 goals**;
  average→elite specialist ≈ **+2–3 goals**. First specialist captures **~60–80%**
  of the available gain.
- **Embedding time**: simple tweak match-usable in 2–3 sessions (3–7 days); a
  brand-new complex routine needs **2–3 weeks / 5–8 sessions / 60–120 full-speed
  reps**. Macro ramp: **30–50% of eventual gain by ~10 league games, 70–100% by end
  of season 1**. Per-routine: ~40% effectiveness at debut → ~90% by match 5–6 with
  continued training. Weekly time on set pieces ≈ 20–30% (up to 40%), 2–5 blocks/wk.
- **Coach vs players**: players (delivery + aerial targets + aggression) ≈ **60–70%**
  of the ceiling P; coaching/system ≈ **30–40%**. Coach moves chance **volume**
  (+30–60% set-piece shots) and **quality** (shot xG ~0.07→0.10–0.12); players
  convert. Suggested decomposition: ΔG_setpiece ≈ P · C · T (potential × coach ×
  training-time), C: none 0.2–0.3, average 0.6–0.7, elite 0.8–1.0.
- Sources: premierleague.com/news/2468880; espn.com .../42706216; mbpschool.com;
  sportsdatacampus.com; pasoti.co.uk thread.

## Prompt 2 — Learning-curve / skill-acquisition formulations + where coach multiplier enters

**Key findings:**
- **Bounded exponential** `p(t)=L−(L−p₀)·e^(−k·t)` recommended default: bounded,
  simplest, interpretable via **half-life** `t₁/₂=ln2/k` and "weeks to X% of gap
  closed" `t_x=−ln(1−x)/k` (so weeks-to-90% = ln10/k). Designer workflow: pick
  "good coach → 80% in 4 weeks", derive k₀, let coach scale it.
- **Power law** `T(P)=X+N·P^c` fits practice data well historically (Oxford skill-
  acquisition chapter), expresses diminishing returns, but unbounded in raw form and
  less intuitive to tune.
- **Logistic** `1/(1+e^(−k(t−t₀)))` gives slow-start→breakthrough→plateau; symmetric
  S can be less realistic when improvement is fast-early.
- **Heathcote, Brown & Mewhort (2000)**: apparent population power-law can arise from
  averaging/mixtures of **exponential** individual processes → no universal winner;
  pick by gameplay semantics. For a single routine, exponential/logistic easier to
  justify and tune than raw power law.
- **Where coach quality enters** — most defensible default: **scale the rate k**
  (`k=k₀·q`) → faster maturity, same ceiling → fair, tunable, avoids "super-coach"
  long-run imbalance. Raising the **ceiling L(q)** only if coach changes ultimate
  tactical quality (stronger long-run advantage). Scaling **both** → runaway
  dominance; avoid unless intended. Clean mixed form:
  `p(t)=L(q)−(L(q)−p₀)·e^(−k₀·q·t)` with L capped near 1.
- **Gate**: threshold + **hysteresis** to stop flapping. θ_on ≈ 0.8–0.95,
  θ_off ≈ θ_on − 0.05..0.15. Optional 3-band: locked < θ_off < selectable-but-risky
  < θ_on ≤ fully-ready.
- Sources: academic.oup.com (skill-acquisition chapter); act-r.psy.cmu.edu
  Tenison&Anderson 2015; perceptionaction.com; PMC10696298.

## Prompt 3 — How comparable games model set-piece coaching / training / familiarity

**Key findings:**
- **Football Manager (FM24)**: set-piece coaching is a **distinct staff role**;
  coaches filtered by a **Set Pieces** attribute; set-piece coach profile shows
  set-piece preferences. Role framed around corners/short FK/long FK/throw-ins.
  Community testing: the coach's **set-piece skill** is the dominant input (tactical
  knowledge smaller/inconsistent). Higher set-piece skill → more corner goals/season;
  default routine notably worse than a custom/strong-coach routine. **Routine
  creator** + preview/evaluation loop (place players in roles, preview XI). Implied:
  repeated use + training build readiness; no public formula. Set-piece coaching is
  an **investment lever** without per-drill micromanagement.
- **EA Sports FC / FIFA**: set pieces are a **practice/execution** feature (drills,
  arena), **no** FM-style specialist coaching role evidenced.
- **Championship Manager / Anstoss / On the Ball**: classic pattern = **coach quality
  affects training speed / development** (no isolated set-piece module). Established
  the genre idea that better staff = long-term advantage without supervising drills.
- **FM tactical familiarity / fluidity bar** = best **UX precedent** for a readiness
  indicator: green segmented bar that accumulates with repeated use and **decays**
  on change; shows when a tactic is reliable and rewards stability. (Exact decay
  rules not public — claim the UI pattern + intent, not the equation.)
- **Design lessons**: (a) **specialization** — separate set-piece coaching so hiring
  a specialist is a comparable decision; (b) **delayed payoff** — staff + rehearsal
  pay off over time = strategic investment, not instant buff; (c) **gated usability**
  — routines work better at high staff quality + familiarity, can't copy an elite
  routine for instant peak. Make readiness **visible enough to plan around, not so
  granular you micromanage**. "Specialist raises the ceiling, rehearsal raises the
  floor, UI shows current state + cost of change."
- Sources: givemesport.com FM24 best set-piece coaches; youtube (FM set-piece
  creator/tester); jobsinfootball.com set-piece analyst; nutmegfc.co.uk.

## Prompt 4 — Calibration ranges (base weeks, coach speed-up, k, decay, granularity)

**Key findings:**
- **(1) base_weeks_to_learn to ~90% ready, no specialist**: **3–8 weeks** at one
  weekly block; **~5 weeks** default. Simple corner/FK 3–4; typical modular 5–6;
  complex multi-phase 7–8+. (Balancing heuristic, not a direct empirical conversion.)
- **(2) Top specialist speed-up**: **1.5×–2.5×**, target **~2.0×**, upper bound ~3×
  only for simple routines. Implement as multiplicative weeks reduction with a clamp.
- **(3) Specialisation score + k**: score on **0..1** (or 1..20 normalised
  `(s−1)/19`). Linear `weeks=base·(1−k·score)` → **k=0.25–0.40, default 0.33**
  (33% reduction at score=1) but risks zero-week at high k. **Safer bounded
  reciprocal** `weeks=base/(1+k·score)` → **k=0.5–1.0**; **recommended k=0.75** →
  top coach ≈ **1.75×** speed-up, no zero-week. (Equivalently rate form
  `rate=base_rate·(1+k·score)`.)
- **(4) Decay when untrained**: **1–3 percentage-points/week**; embedded routines
  (≥70–80% readiness) decay at **~half** the rate. Exponential decay to a floor
  `R(t)=R_floor+(R₀−R_floor)·e^(−d·t)`, fresh d≈0.12–0.18/wk, embedded d≈0.04–0.08/wk.
  Grounded in forgetting-curve (Ebbinghaus) + motor-skill retention: rapid early
  forgetting that slows; well-learned skills persist. Don't decay so fast players are
  forced into rote weekly maintenance.
- **(5) Granularity**: best = **two-layer** — **category/module familiarity**
  (offensive corners, defensive corners, wide FK…) that transfers partially +
  **per-variant readiness** for the exact scripted routine. Per-variant-only = max
  depth but UI-heavy; category-only = legible but generic; team-wide single = simplest
  but least interesting. Two-layer: category familiarity speeds learning a new variant
  in that category; variant readiness sets match-day precision.
- Suggested config: base 5 wk, top coach 2.0×, score 0..1 with reciprocal k=0.75,
  decay 1–2 pp/wk embedded & 2–3 fresh, two-layer category+variant.
- Sources: coachnotes.co.uk set-pieces best practices; soccerinteraction.com;
  fifatrainingcentre.com; 343coaching.com; Ebbinghaus/motor-retention (general).
