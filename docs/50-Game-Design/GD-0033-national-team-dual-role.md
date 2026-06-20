---
title: GD-0033 National-Team (Bundestrainer) Dual-Role
status: accepted
tags: [game-design, gddr, national-team, dual-role, late-game, dynasty, prestige, career-progression, fmx-84]
context: [manager-legacy, league-orchestration]
created: 2026-06-06
updated: 2026-06-13
type: game-design
binding: false
linear: FMX-84
related:
  - [[../10-Architecture/09-Decisions/ADR-0084-national-team-dual-role-and-international-window-contract]]
  - [[../60-Research/national-team-dual-role-2026-06-06]]
  - [[GD-0011-career-progression]]
  - [[GD-0010-ai-world]]
  - [[GD-0019-manager-archetype-roguelite-progression]]
  - [[GD-0032-awards-honours-records-and-hall-of-fame]]
  - [[GD-0043-gameplay-calibration-ownership-and-acceptance-gate]]
  - [[GD-0015-ip-clean-data]]
  - [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
  - [[../10-Architecture/09-Decisions/ADR-0066-competition-registry-sub-aggregate]]
  - [[../10-Architecture/09-Decisions/ADR-0068-fixture-scheduling-contract]]
  - [[../30-Implementation/gameplay-calibration-and-soak-test-runbook]]
---

# GD-0033: National-Team (Bundestrainer) Dual-Role

> **`draft` / `binding: false`.** Game-design model for FMX-84 (gap **G2 / R2-06**, E5 epic
> FMX-61). Decisions D1–D4 were put to Nico live (2026-06-06, ask-first gate): **D1=A**
> reserved-stub + telegraphed · **D2=A** League Orchestration owns the international-window
> calendar · **D3=B** unlock = reputation ≥ 75 AND 5 seasons (Nico chose the simpler gate; the
> "OR 3 trophies" path is dropped) · **D4=A** 3 engagement levels + forced-choice same-day
> clash. Architecture in
> [[../10-Architecture/09-Decisions/ADR-0084-national-team-dual-role-and-international-window-contract|ADR-0084]];
> grounding in [[../60-Research/national-team-dual-role-2026-06-06]]. **IP-safe naming applies**
> (GD-0015 / ADR-0007): nation/federation **branding** uses the fictional catalog; player/persona
> *nationality* uses real ISO data only; every sample name below is fictional and illustrative.

## 1. Intent

The national-team ("Bundestrainer") dual-role is the **headline late-game aspiration** of a club
dynasty: a club legend earns the chance to *also* lead a nation. It is the design pay-off of the
`GD-0011` narrative spine ("club legend → national-team coach") and a direct counter to the
season 4–6 engagement flatline ([[../60-Research/national-team-dual-role-2026-06-06]], FMX-90):
a fresh, telegraphed long-horizon goal that reframes the same systems through tournament football.

Prior art (Anstoss's Bundestrainer, FM/FIFA Manager/CM/EHM) is unanimous on the shape: a
**reputation-gated, earned prestige "side job"** that runs *alongside* the club, is **light to
operate** (heavy delegation, tournament-centric), and frames leading the nation at a major
tournament as the end-game fantasy. FM's lesson — international management feels **structurally
shallow** if over-built between breaks — keeps our surface deliberately lean.

**Scope ruling (D1):** the design + thresholds + calendar policy are ratified **now**, but in MVP
we ship only (a) the **reserved international-window contract** (so the schedule reserves windows
correctly) and (b) **early foreshadowing** of the goal. The **full playable dual-role is a
post-MVP fast-follow** — a *telegraphed reserved stub*, not a cut feature.

## 2. Unlock gate (D3)

A manager may be offered a national-team role once **both** hold:

| Gate | Value (banded; `legacy.nationalTeam` slot) | Source / note |
|---|---|---|
| Manager reputation | **≥ 75** | global aggregate of the region-based reputation model (`late-game-systems.md §5.3`: per-country → continental → global) |
| Tenure | **≥ 5 in-game seasons** managed | `ai-manager-behaviour.md §11.2` |

The richer `late-game-systems.md §4.2` "**OR 3 major trophies**" alternative is **dropped** (D3=B):
the gate is a single conjunctive `rep ≥ 75 AND seasons ≥ 5`. Rationale: Nico chose the simpler,
more legible gate; reputation already rewards trophies indirectly via the region-rep model, so a
separate trophy path is redundant. Both numbers are **banded** for calibration, not locked.

**Telegraphing (MVP-relevant):** the aspiration is surfaced *early* (career/legacy screen shows
"National-team management unlocks at reputation 75 + 5 seasons" with progress), so the goal is a
visible carrot from the first hours — the research's "name the possibility, telegraph the path"
rule — even though the playable role ships post-MVP.

**Job-offer windows** (design intent, post-MVP build): a **main hiring window** ~1 month after a
major tournament, plus a **secondary window** when a sitting national coach's board confidence
falls below a floor; rare random vacancies. Candidate selection favours strong **regional +
national reputation** and nationality fit. Exact timings + candidate-scoring =
post-MVP + GD-0043 `legacy.nationalTeam`.

## 3. Engagement levels (D4)

Three levels control how much of the national job the player operates vs delegates; the rest is
auto-managed by the assistant using the player's tactics. Default is seeded from the FTUE
self-identification (GD-0012):

| Level | Player operates | Auto-managed | FTUE default |
|---|---|---|---|
| **Full Control** | Everything — squad, training camp, friendlies, tactics, tournaments | — | Veteran |
| **Match-Only** | Confirms AI-proposed squads/training (one tap); plays/auto-resolves matches | Squad/training proposals | Bit |
| **Light Touch** | Major tournaments only, with high-level choices (youth-focus vs results-focus) | Qualifiers + friendlies auto-simmed | Newbie |

The level is changeable in-role. Workload framing (not hard time-budget numbers): Full ≈ a second
club; Match-Only ≈ matchday + sign-off; Light Touch ≈ tournament bursts only. Concrete time-budget
splits are **post-MVP calibration**, not fixed here.

## 4. International-window & club↔nation calendar-conflict policy (D2, D4)

The **international-window calendar** is owned by **League Orchestration** (it already owns the
season calendar; ADR-0066 `CalendarWindow`, ADR-0068 `FixturesPublished`/`SeasonAdvanced`).
Player-release **eligibility** (who may be called up / must be released) stays with Regulations &
Compliance / Squad & Player. Windows are published as a **self-contained fact** the Competition
Registry and clubs honour (contract in
[[../10-Architecture/09-Decisions/ADR-0084-national-team-dual-role-and-international-window-contract|ADR-0084]]).

Policy (mirrors real-world handling, raw 1):

- **League fixtures** auto-schedule **around** international windows (no league match inside a
  window) — the schedule reserves windows even before the dual-role is playable.
- **Lower-priority cups / friendlies** still run inside windows; the club plays with called-up
  players absent (banner: *"4 players on international duty (3 starters, 1 sub)"*).
- **Same-day club↔nation clash** (rare under compressed schedules): the player is **forced to
  choose which bench to take** ("You cannot attend both matches"). The **unattended side is
  auto-managed with the player's tactics**; resolution is **deterministic** (no RNG —
  replay-safe), and produces a **media story beat** (*"Media question your absence from the
  [club/nation] match"*). There is **no fixed "club always wins" rule** — the dramatic choice is
  the feature's emotional hook.

## 5. MVP surfaces (D1 = reserved-stub + telegraphed)

In MVP we ship **only**:

- **Foreshadowing**: the dual-role goal + unlock gate (rep 75 / 5 seasons) shown with progress on
  the career/legacy surface — a visible late-game carrot.
- **Reserved international-window calendar**: League Orchestration publishes
  `InternationalWindow`s so the fixture schedule reserves them correctly **regardless of when the
  playable role ships** (the issue's "reserved contract note").
- **Reserved prestige seam**: national-team caps/tournament honours are a reserved input into
  Manager & Legacy prestige / ADR-0083 HoF (forward-additive; populated post-MVP).

The **playable dual-role** (job-offer market, squad-building, tournament UX, engagement-level
operation, same-day-clash modal) is **post-MVP** — designed here, built later against the reserved
seam with minimal refactor.

## 6. Open ratification items

- **Job-offer market model** (candidate-scoring formula, nationality multiplier, window timings)
  — design directions only here; ratify with the post-MVP build.
- **Region-rep → single "manager reputation" aggregation curve** — directions only
  (`late-game-systems.md §5.3`); exact curve = post-MVP + GD-0043 `legacy.nationalTeam`.
- **National-team contribution to HoF / prestige scoring** — reserved input shape only; weights
  belong to ADR-0083's `legacyScoreFormulaVersion` (`legacy.hof` slot, GD-0043).

## 7. Calibration debt (`legacy.nationalTeam`, GD-0043)

`nationalTeam.unlock.reputationMin` (~75), `nationalTeam.unlock.minSeasons` (~5),
`nationalTeam.offerWindow.postTournamentDays`, `nationalTeam.offerWindow.boardConfidenceFloor`,
plus post-MVP: engagement-level time-budget splits, candidate-scoring weights, nationality
multiplier, same-day-clash frequency. All banded in
[[../30-Implementation/gameplay-calibration-and-soak-test-runbook]] §9; tuned at playtest, not
locked from intuition.

## 8. Out of scope

The actual international **competition schema** / fixture generation for national tournaments
(Competition Registry, ADR-0066 reserved cup/continental seams); board/ownership FSMs (GD-0030);
flatline + HoF metric definitions (FMX-90 / GD-0032); the full playable dual-role build itself
(post-MVP); final constants (GD-0043 `legacy.nationalTeam`).

## Rationale

Genre precedent is unanimous (Anstoss Bundestrainer as the canonical "earned prestige side-job /
end-game fantasy"; FM/FIFA Manager/CM/EHM reputation-gated dual roles with delegation), and the
real-world model (FIFA windows, club-vs-country release, club→nation career path) maps cleanly
onto a small set of reserved season-scoped windows + a rare same-day-clash choice. Design best-
practice (raw 3) says a niche late-unlocked aspiration should be a **telegraphed reserved stub**,
not a cut feature — cutting it flattens the long-term fantasy and worsens the flatline. Ratifying
the design + the window seam now lets the schedule reserve windows correctly and lets the playable
role activate post-MVP without a refactor.

## Consequences

**Positive:** locks the headline late-game aspiration and its thresholds; gives League
Orchestration a concrete window contract so fixtures reserve international windows from MVP;
preserves the telegraphed carrot against the season 4–6 flatline; keeps the MVP surface lean
(foreshadow + reserve only) per the FM "don't over-build international management" lesson; the
reserved prestige seam keeps ADR-0083's national-team stub fillable without rework.

**Negative / constraints:** the playable role is deferred, so the *full* pay-off lands post-MVP
(mitigated by early telegraphing); all magnitudes are GD-0043 `legacy.nationalTeam` debt until playtest; some inputs
depend on still-`proposed` upstreams (FMX-91 world-drift, ADR-0083 HoF). D3=B trades the richer
"trophies OR seasons" gate for a simpler, more legible one.

## Calibration slot (FMX-141)

- Slot: `legacy.nationalTeam`
- Parameter pack: `nationalTeamModelVersion`
- Harness: T2/T3 unlock/offer/career sweeps in
  [[../30-Implementation/gameplay-calibration-and-soak-test-runbook]].
- Metrics: reputation threshold, season threshold, job-offer cadence, candidate
  scoring, clash frequency, engagement workload and HoF/prestige contribution
  handoff.

## Supersedes

None. Resolves the `late-game-systems.md §4` ↔ `ai-manager-behaviour.md §11.2` ↔ `GD-0011`
contradiction by ratifying this as the current design of record (research docs left intact and
linked).

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0084-national-team-dual-role-and-international-window-contract]]

## Related

- Research: [[../60-Research/national-team-dual-role-2026-06-06]] · [[../60-Research/late-game-systems]] · [[../60-Research/ai-manager-behaviour]]
- [[README]] — hub · siblings: [[GD-0011-career-progression]] · [[GD-0010-ai-world]] · [[GD-0030-dynasty-board-and-ownership]] · [[GD-0032-awards-honours-records-and-hall-of-fame]]
