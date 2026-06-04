---
title: "RAW — Football-analytics operational definitions for tactical-style signals"
status: raw
tags: [research, raw, perplexity, match, tactics, analytics, fingerprint, fmx-68]
created: 2026-06-03
updated: 2026-06-03
type: research
related: [[../tactical-identity-fingerprint-2026-06-03]]
---

# RAW Perplexity capture — Tactical-style signal metrics (FMX-68)

> Unprocessed transcript. Synthesised into
> [[../tactical-identity-fingerprint-2026-06-03]]. Do not implement from raw.
> Captured 2026-06-03 (Sonar). Citations are the model's own.

## Prompt

System: sports-analytics research assistant; precise operational definitions,
concrete formulas + typical value ranges, cite concrete sources, distinguish
established vs contested metrics.

User: For five managerial-style dimensions (possession, pressing, risk/directness,
adaptation, set-piece reliance) give the standard real-world football-analytics
operational definition(s), exact formula, required input event data, typical
normalisation range / league-average value (to scale 0..1), and small-sample
stability (matches until reliable, for confidence bounds). Cite sources.

## Response

### 1) POSSESSION style

**Basic possession %** — action-based: `Possession%_A = Passes_A / (Passes_A + Passes_B)`
(or broader on-ball actions). Inputs: pass counts per team. Typical season ranges:
deep sides 40–45%, average 48–52%, elite 60–65%+. Normalise e.g. 0 at 35%, 0.5 at 50%,
1 at 65%+: `s = clip((Poss% - 35)/(65-35), 0, 1)`. **Stability:** stabilises after
8–10 league matches, very reliable 15+; noisy over 3–5.

**Possession with purpose** — Field tilt: `FieldTilt_A = P_A,att3 / (P_A,att3 + P_B,att3)`
(final-third passes/touches share; final third = last 33.3% of pitch). Ranges: low
35–40%, avg 50%, high 60–65%. Final-third touch share: `Touches_att3 / Total touches`
— deep 18–22%, balanced 22–28%, territorial 28–35%. **Stability:** ~10–12 matches
(opponent-quality dependent).

### 2) PRESSING intensity

**PPDA** (passes allowed per defensive action): `PPDA_A = P_B,oppHalf / DA_A,oppHalf`,
where defensive actions = tackles + interceptions + fouls + challenges/duels (+ pressures
if available), measured in the opponent half (high/central zone; provider-varying). Inputs:
event type + team + location. **Typical PL season:** very high press PPDA ~7–9; moderately
high ~9–11; average 11–13; low/deep-block 13–18+ (>20 in small samples). Lower = more
intense → invert to normalise: `s = clip((18 - PPDA)/(18-6), 0, 1)` (6→1, 12→0.5, 18→0).
**Stability:** 8–10 matches to stabilise, reliable 15+; sensitive to score state.

**High turnovers / counterpress** — high turnovers per 90 (recoveries in opp half/third);
shot-from-high-turnover rate; counterpress% (defensive action ≤5s after losing ball).
Ranges: high-press ~6–9 per 90 opp half (~2–4 final third); low-press ~2–4 (0.5–1.5).
Noisier (rarer events): want 10–12 matches.

### 3) RISK / directness

**Directness index** — sequence directness `= (x_end - x_start) / total path length`,
team mean over sequences; or vertical gain per pass. Patient teams ~0.35–0.5 seq
directness; very direct ~0.6–0.8. Vertical gain/pass: short 3–5 m, direct 6–9 m.
**Progressive passes/carries** — pass moving ≥~25–30% pitch closer to goal (≥15% in opp
half). Progressive-pass share: patient 8–12%, aggressive vertical 13–18%. **Long-ball
share** — passes ≥35 m: short build-up 5–10%, balanced 10–15%, route-one 15–25%+.
**Pace of play** — vertical speed (m/s toward goal): slow 0.8–1.2, balanced 1.2–1.6,
transition-oriented 1.6–2.0+. **Shot selection risk** — xG per shot (open play): high-risk
0.06–0.09, balanced 0.10–0.12, patient/high-value 0.13–0.18; risk normalise
`s = clip((0.14 - xG/shot)/(0.14-0.07), 0, 1)`. Low-prob-shot share (xG<0.05 or >23m):
patient 20–35%, shoot-on-sight 40–60%+. **Stability:** behaviour-of-possession metrics
8–10 matches; xG-per-shot slower 10–12 (limited shots/match).

### 4) ADAPTATION / in-game management

**Least standardised — no single accepted metric; proxies only.**
- **Substitution timing/usage:** avg first-sub minute (≈60–65' common; <55' proactive,
  >70' conservative); proactive-sub rate (subs ≤60' when level/behind); sub impact
  (GD_post - GD_pre, or xG-diff). Noisy; need 20–30 matches.
- **Formation changes:** flexibility index (formation changes / matches); behind-switch
  rate. Public data scarce; rare events → 20+ matches. Often authored as a trait.
- **Tactical response to game state:** ΔPPDA when behind vs level (1–3 typical); Δdirectness
  when behind (+0.05–0.15). Needs minutes in each game-state bucket → often a full season.
  Recommendation: treat adaptation as a manager trait lightly updated from data, not a
  small-sample stat.

### 5) SET-PIECE reliance

**Goal share:** `SPGoalShare = G_SP / G_NP` (corners, FKs, set-piece routines; exclude
penalties). League baseline ~25–35% of non-penalty goals from set pieces; low 15–20%,
specialists 40–50%+. Goals sparse → noisy, need 20–25 matches. **xG-based (preferred):**
SP xG per match (league avg ~0.3–0.5) and SP xG share `= xG_SP / xG_TOT` (typical 20–30%,
heavy 30–40%+). Normalise share `s = clip((SPxGShare - 0.15)/(0.40-0.15), 0, 1)`.
**Stability:** xG-based ~10–12 matches (faster than goals).

### Putting into a simulation (model's closing advice)
1. Pick 1–2 core metrics per dimension. 2. Rolling average over N (8–10 possession/
pressing/directness; 10–12 xG-based; 20+ adaptation/subs); clipped linear transform to 0–1.
3. Combine within-dimension as weighted average (e.g. possession 0.7·poss% + 0.3·field tilt;
pressing 0.6·PPDA-inv + 0.4·high-turnovers; risk = blend; set-piece = SPxG share primary).
4. Small samples → Bayesian shrinkage toward league/archetype prior, weight rising with n.

Citations (model's own): [1] PMC11524524 (xG) · [2] sportbotai xG · [3] Hudl xG ·
[4] expectinggoals set-piece revolution · [5] AWS Bundesliga set-piece threat ·
[6] StatsPerform/Opta event definitions.
