---
title: National-team (Bundestrainer) dual-role — research synthesis
status: synthesized
tags: [research, national-team, dual-role, late-game, international-calendar, fmx-84]
context: league-orchestration
created: 2026-06-06
updated: 2026-06-06
type: research
linear: FMX-84
related:
  - [[raw-perplexity/raw-national-team-dual-role-realworld-2026-06-06]]
  - [[raw-perplexity/raw-national-team-dual-role-games-2026-06-06]]
  - [[raw-perplexity/raw-national-team-dual-role-mvp-gating-2026-06-06]]
  - [[late-game-systems]]
  - [[ai-manager-behaviour]]
  - [[../50-Game-Design/GD-0011-career-progression]]
  - [[../50-Game-Design/GD-0033-national-team-dual-role]]
  - [[../10-Architecture/09-Decisions/ADR-0084-national-team-dual-role-and-international-window-contract]]
---

# National-team (Bundestrainer) dual-role — research synthesis (FMX-84)

> **Decision basis** for [[../50-Game-Design/GD-0033-national-team-dual-role|GD-0033]] +
> [[../10-Architecture/09-Decisions/ADR-0084-national-team-dual-role-and-international-window-contract|ADR-0084]].
> Three raw Perplexity captures: [[raw-perplexity/raw-national-team-dual-role-realworld-2026-06-06|real-world]],
> [[raw-perplexity/raw-national-team-dual-role-games-2026-06-06|comparable games]],
> [[raw-perplexity/raw-national-team-dual-role-mvp-gating-2026-06-06|MVP-gating/late-game design]].
> IP-safe naming applies (GD-0015 / ADR-0007): no real federation/nation branding on gameplay
> surfaces; nationality via real ISO data only.

## 1. Why FMX-84 exists

`late-game-systems.md §4` fully designs a club + national-team ("Bundestrainer") dual role
(3 engagement levels, an unlock gate, an international-window / same-day-clash policy) but it
is research-tier and unratified, and **three docs contradict each other**:

- `ai-manager-behaviour.md §11.2` lists "National team dual role" under **Post-MVP scope**
  (unlock at reputation ≥ 75 + 5 in-game seasons; no trophy alternative).
- `late-game-systems.md §4.2` gives the richer gate **rep ≥ 75 AND (5 seasons OR 3 major
  trophies)** and designs the whole feature.
- `GD-0011` (approved) makes "**club legend → national-team coach**" the *intended narrative
  spine* yet lists the national-team arc as undesigned **Open (Wave 2) R2-06**.

No bounded context owns the **international-window calendar**, so the Competition Registry
(ADR-0066/0068) cannot reserve international windows; ADR-0083 (FMX-95) left national-team
caps/tournament inputs a reserved stub pending FMX-84.

## 2. Real-world evidence (raw 1)

- Dual club + nation roles are **not banned** by FIFA/UEFA (RSTP regulates *player* release,
  not coaches) but are **rare at the top level** today — contractual exclusivity, workload,
  conflict-of-interest, media pressure, calendar congestion. Examples: **Hiddink** (PSV +
  Australia 2005–06; Chelsea + Russia 2009 interim), **Taylor** (Hull + England U-21).
- **FIFA International Match Calendar**: ~**4–5 windows/season** (Sep/Oct/Nov/Mar, occasional
  Jun), each ~7–10 days, usually **2 matches**; leagues "break". Tournament blocks: World Cup
  every 4y (~4–5 wks), EURO/Copa every 4y (Jun–Jul), **AFCON every 2y mid-season (Jan–Feb)**.
- **Club vs country**: clubs must release players on calendar dates; major leagues build
  fixtures so no league match falls in a window; mid-season tournaments can't move months →
  clubs play without internationals.
- **Career path** is club → nation, *later in career*; international management = building a
  settled group in short windows, a distinct rhythm.

→ **Design implications:** model international windows as a small number of season-scoped
calendar windows the schedule reserves around; the dual role is a **late-career aspiration**,
not an early option; "club vs country" same-day clashes are real but rare.

## 3. Comparable games (raw 2)

- **FM, FIFA Manager, Championship Manager, EHM** all support a **reputation-gated club+nation
  dual role**; offers driven by reputation + results + nationality/language; international
  fixtures pre-scheduled; players unavailable on duty; **heavy delegation / auto-sim** for the
  national job; FM lets you *not* rest players in the nation you yourself manage.
- **Anstoss (Bundestrainer)** — our closest reference: club + German NT simultaneously, **earned
  by club success/reputation**, domestic play pauses for major tournaments, **light manual
  workload**, framed as a **prestige "side job" / end-game fantasy**.
- **OOTP / NBA 2K** treat national/all-star duty as **part-time, event-driven** windows.
- Recurring critique: FM international management is **structurally shallow** (dead time between
  breaks) — a reason to keep our MVP surface light and tournament-centric.

→ **Design implications:** keep the three engagement levels (Full / Match-Only / Light Touch)
with delegation defaults; frame the role as an earned prestige side-job; avoid building a heavy
parallel management sim — tournaments are the payoff.

## 4. Late-game scope & gating best-practice (raw 3)

- A niche, late-unlocked aspirational feature should usually be a **telegraphed reserved stub**:
  ship the data model + interface seam + early foreshadowing in MVP; build the full playable
  feature post-launch. Cutting it **entirely** flattens the long-term fantasy and worsens the
  mid-game flatline (our FMX-90 season 4–6 problem).
- Gate with **banded thresholds**, **telegraph the goal early**, make it a **reward for mastery**,
  **combine time + achievement** (avoid pure time-walls), give **intermediate rewards**.
- Reserved-stub principle: preserve **design intent + technical seam** so activation needs
  minimal refactor — critical for save-structure/progression-dependent late-game systems.

→ **Design implications:** the scope ruling and the architectural seam (the international-window
contract) are the deliverable; the playable role is a post-MVP fast-follow.

## 5. Decisions taken (Nico, live, 2026-06-06) — D1–D4 = A, A, B, A

| # | Question | Decision |
|---|---|---|
| **D1** | MVP scope | **A — Reserved-stub + telegraphed.** Ratify design + thresholds now; MVP ships only the reserved international-window contract + foreshadowing; full playable role = post-MVP fast-follow. |
| **D2** | International-window calendar owner | **A — League Orchestration** (it owns the season calendar; ADR-0066/0068). Release *eligibility* stays with Regulations / Squad & Player. No new BC. |
| **D3** | Unlock gate | **B — `reputation ≥ 75 AND 5 in-game seasons`** (the `ai-manager-behaviour.md §11.2` gate). The `late-game-systems.md` "OR 3 trophies" path is **dropped**. Reputation = global aggregate of the region-based model (`late-game-systems.md §5.3`); values banded for FMX-52. |
| **D4** | Engagement + clash | **A — 3 levels (Full Control / Match-Only / Light Touch) + forced-choice same-day clash**; unattended side auto-managed with the user's tactics; deterministic (no RNG); media story beat. |

## 6. Open / deferred

- Full playable dual-role (tournament UX, squad-building, job-offer market) — **post-MVP**.
- All numeric magnitudes (`reputationMin`, `minSeasons`, offer-window timings, board-confidence
  floor) — **FMX-52 calibration** (banded in the runbook §13).
- Job-offer candidate-scoring formula, nationality multiplier, region-rep aggregation curve —
  reserved to the post-MVP build (directions only here).
- National-team caps/tournament honours → Manager & Legacy prestige / ADR-0083 HoF inputs:
  contract seam reserved; populated when the playable role ships.
