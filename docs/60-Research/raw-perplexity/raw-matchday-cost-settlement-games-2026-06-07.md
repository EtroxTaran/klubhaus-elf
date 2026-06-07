---
title: "Raw — How sims settle finances/costs for non-watched (background) matches (FMX-92)"
status: raw
tags: [research, raw, perplexity, games, prior-art, background-sim, economy, two-tier-fidelity, fmx-92]
created: 2026-06-07
updated: 2026-06-07
type: research
binding: false
linear: FMX-92
related:
  - [[../background-fast-cost-settlement-2026-06-07]]
---

# Raw capture — prior-art games: background-match finance settlement (Perplexity, 2026-06-07)

Verbatim-faithful capture of the Perplexity strand on how management/large-world sims settle
finances/costs for matches the player does not watch. Synthesis in
[[../background-fast-cost-settlement-2026-06-07]].

## Prompt (summary)

How do football/sports management sims and other large-world sims settle finances/costs for
non-watched (background/simulated) fixtures — hundreds/thousands per matchday? Context: 4 quality
profiles (full interactive, standard interactive, background-detailed re-simmable, background-fast
result+injuries+economy only). (1) FM, EA FC/FIFA Manager, OOTP, OOTP/FHM, EHM: simplified
aggregate finance for AI-vs-AI vs detailed for player's club? (2) coarse formula (attendance ×
price + lump-sum cost) vs itemised? (3) two-tier fidelity pattern best practices + pitfalls
(economy drift, save bloat); (4) on-demand upgrade reconciliation (overwrite vs adjust).

## Answer (verbatim)

Most commercial sports-management and large-world sims use a **coarse, deterministic financial
model for non-watched AI fixtures** (attendance × prices × a few lump-sum costs), with **no
per-event financial stream**, and then layer any detailed financial UX only for the human-facing
club or league. Where re-simulation is allowed, they generally **overwrite** or **soft-lock**
results rather than trying to reconcile two competing balance sheets.

Because explicit documentation is thin, I'll separate **confirmed behaviour** from **inferred
patterns** based on known systems in sports sims and other large-scale sims (Paradox GSG,
city-builders, etc.).

### 1. How big sports sims handle finances for AI-vs-AI / non-watched matches

**Football Manager (SI Games).** SI separate match simulation from club finances and run all
world fixtures each matchday at different fidelities: a full 3D/2D event model for watched
matches and an "instant result" / fast sim for most AI fixtures.[4] The financial side is not
routed through the minute-by-minute event log; gate receipts and costs are attached to the final
match object. Attendance is generated from club reputation, competition importance, ticket prices,
stadium capacity, form, etc., then multiplied by ticket price — identically whether or not you
watch. Matchday costs (stewards, policing, utilities) are modeled as **simple per-match formulas**
based on attendance, stadium size and competition level, not itemized events. Staff/player wages
are on a **calendar schedule**, independent of match detail. The FM UI shows only aggregate
matchday finances (gate receipts, a rough "matchday expenses" number) — no per-event financial
trace. Instant-result matches for your own club yield finances consistent with watched matches
over a season, implying the same coarse formula across all fidelities.

**EA Sports FC / FIFA Manager.** No public per-fixture cost model. Career/franchise economy =
wages, transfer fees, ticket revenue, sponsors; operating costs abstracted into a few categories.
Simulated matches still yield gate money and pay wages without instantiating per-minute events.
Pattern (as with NHL/Madden franchises): gate revenue = attendance × ticket price computed once
per simulated match; operating cost = one or two lump-sum expenses per game (generic "arena
operations", maybe scaled by attendance), not itemized.

**OOTP / Franchise Hockey Manager / Eastside Hockey Manager.** More transparent economies make
the pattern clear: revenues (gate, concessions, media, merch) and expenses (salaries, staff,
scouting, development, misc) are predominantly **seasonal/monthly/annual**, not per-game itemized.
Game income is primarily **attendance-based** (market size, loyalty, performance, stars × ticket
price). No need to run the pitch-by-pitch engine for finances. Unwatched games skip rendering and
keep an abbreviated log; finances settle once per game from attendance + seasonal costs. EHM/FHM:
wages weekly/bi-weekly; per-game revenue = gate receipts; per-game expenses minimal, rolled into a
generic "game expenses"/"other expenses" line.

**Takeaway (Q1):** confirmed — these games use the same financial abstraction for watched and
unwatched matches, and that abstraction is already coarse/aggregate (attendance-based revenue,
lump-sum generic costs). They rely heavily on seasonal/non-match costs (wages, scouting,
facilities) to shape finances, so per-fixture costs can remain simple without breaking
believability.

### 2. Coarse formulas vs itemised costs for background matches

Typical pattern across these sims: an **attendance-estimation step** per fixture (inputs:
reputations/market size, league level, form, rivalry, capacity, ticket price, day/time, weather →
single integer attendance, capped); **revenue** = attendance × ticket price (+ optional per-head
concession/merch factor); **costs** = base per-match cost × f(attendance, stadium size,
competition level), possibly with a few **step functions** (e.g. policing threshold when
attendance > X); TV/competition revenue added fixed or per-round. Cheap, deterministic, and does
not depend on minute-by-minute events. They keep finances believable at season scale by
calibrating the attendance/wage models (not matchday micro-costs) and using soft constraints on AI
(clamped debt, board injections, regulated budgets), so per-match costs can be dramatically
simplified without players noticing.

Illustrative analogue offered:

```text
attendance = f(team_rep, league_rep, form, rivalry, capacity, ticket_price, weekday, weather)
ticket_revenue = attendance * ticket_price
concession_revenue = attendance * concession_per_head[league_level]
tv_revenue = tv_pool_per_round[competition] / n_matches_in_round
operating_cost = base_cost[league_level] + (attendance * per_fan_cost[league_level]) +
                 (stadium_size * per_seat_maintenance_factor)   // optional
match_profit = ticket_revenue + concession_revenue + tv_revenue - operating_cost
```

Computed once per background fixture regardless of match fidelity.

### 3. Two-tier fidelity: best practices and pitfalls

Common across sports sims, Paradox GSG (EU4/CK3/Victoria), city/colony sims (SimCity, Cities:
Skylines, RimWorld, Dwarf Fortress). High-fidelity tier (on-screen) = detailed event stream,
fine-grained steps, rich per-event state. Low-fidelity tier (off-screen) = aggregated state at
coarse time steps, no detailed logs, tuned formulas that approximate the *distribution* of
outcomes, not the exact path.

Best practices: (1) **Same invariants, different resolution** — conservation of money, contracts
respected, competition rules identical; difference is *how* you reach the result, not *what* is
allowed. (2) **Shared parameterization, different solvers** — same core parameters
(ticket_price, base_match_cost, tv_pool…), simpler approximation in the low tier; reduces drift
because you tune one economics parameter set. (3) **Stochastic consistency** — match distributions
between tiers; tune the background formula to the average and variance of high-fidelity runs.
(4) **No per-event logs in the low tier** — store only aggregate match facts (teams, score,
injuries, attendance, profit/loss, maybe xG); use roll-ups for stats; discard granular event data
unless needed for replay/highlights. (5) **Tiers differ by 'how', not 'what'** — don't give the
high tier economic features the low tier can't mimic (dynamic ticket pricing, in-match incident
fines) without low-tier equivalents, or finances diverge systematically.

Pitfalls: (1) **Economy drift between tiers** — classic Paradox problem; in sports sims, watched
matches yield systematically more/less revenue than instant results, compounding over 5–10 seasons
into the player club being richer/poorer than peers (mitigate by comparing rolling per-club
averages of watched vs unwatched and adjusting). (2) **Inconsistent competitive balance** if
low-tier goal distributions differ — why FM/OOTP stress that instant-result uses the *same* core
probability model. (3) **Save-bloat from logs & histories** — storing event logs across thousands
of fixtures/year is prohibitive; limit detailed logs to watched/special/rolling-window matches and
store aggregated season stats. (4) **Player perception of fairness** — keep the financial UI
consistent across watched/unwatched; a simple matchday-profit figure that behaves sensibly over
time is enough; players don't expect a per-invoice breakdown.

### 4. On-demand upgrade: reconciling cheap vs detailed re-simulation

Most commercial sports sims avoid fully "upgrading" a resolved match into a newly simulated result
because it causes narrative and accounting issues (changing score → table, GD, stats, form,
morale, injuries; changing finances → cash balance at that date, downstream transfer eligibility).
Typical patterns:

- **A. "Soft-lock" once played/resolved (most common).** Once a result is committed, it is never
  recomputed automatically; replaying it (match viewer / earlier save) is a separate timeline, not
  reconciled. Re-simulation tools are framed as editor/what-if features. For finances: revenue and
  costs were computed once and are canonical — no reconciliation needed.
- **B. Overwrite with full recomputation (rare; dev tools).** Re-simulate, overwrite all
  downstream derived data (tables, stats, finances from scratch). Only feasible if state is
  derivable from the chronological sequence and a replay pipeline exists (e.g. OOTP historical
  replays). Expensive and fragile.
- **C. Partial overwrite with compensating adjustments (possible, messy).** Store the initial
  cheap result; later, on detailed re-sim, either overwrite everything (breaks history from the
  user's POV) or **lock the outcome (score, attendance, match_profit) and only regenerate event
  detail** — the safer option. This mirrors how some 4X/GSG games fake battle replays: the
  outcome/casualties are fixed from the original quick-resolve and the "detailed replay" is a
  fabricated event sequence consistent with known totals.

Recommended practical pattern: **commit** the cheap outcome at first settlement (store
`match_profit`, `attendance`); if later upgraded, **keep `attendance` and `match_profit` fixed**
and use the engine only to generate event detail / shots / xG / injuries; for any detailed cost
categories shown in the upgraded view, **partition the already-known total** rather than
recomputing — so there is no accounting reconciliation; the upgrade is purely representational.
No public evidence FM/OOTP/EA allow "re-run an already-settled match at higher fidelity and merge
results into the same timeline" in the user-facing loop; the safe pattern is "event-level detail
can change, but aggregate results (score, finances) are immutable."

### 5. Concrete suggestions

Single financial abstraction for all profiles (one deterministic formula run once per fixture at
first resolution); profiles control only how scoreline/injuries are generated and what extra data
is stored. On-demand upgrade: treat finances as **frozen** (use original values; split totals into
categories if needed). Calibrate background-fast formulas to reproduce the distributions of large
high-fidelity AI-vs-AI batches.

## Citations (as returned)

- [1] https://www.youtube.com/watch?v=Gwk5IyN6OAI
- [2] https://play.google.com/store/apps/details?id=com.rfm&hl=en_US
- [3] http://redzoneaction.org
- [4] https://www.sports-interactive.com/games/football-manager-live
- [5] https://www.metacritic.com/browse/game/all/soccer-management/
- [6] https://www.financialfootball.com
- [7] https://www.onpapersports.com/blog/best-football-management-games
- [8] https://playmfl.com

> **Caveat (synthesis note):** FM/OOTP/EA internal finance formulae are not publicly documented to
> numeric precision; the per-game-specifics above are informed inference from observable behaviour,
> not cited dev disclosure. The *pattern* (coarse aggregate finance for all fidelities; freeze on
> upgrade) is robustly consistent across the genre.
