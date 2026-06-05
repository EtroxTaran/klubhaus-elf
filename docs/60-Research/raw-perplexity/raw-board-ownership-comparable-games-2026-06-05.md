---
title: "RAW Perplexity — Board/ownership/bankruptcy in comparable games (FMX-89)"
status: raw
tags: [research, raw, perplexity, board, ownership, bankruptcy, games, fm, ootp, eafc, dynasty, fmx-89]
created: 2026-06-05
updated: 2026-06-05
type: research-raw
binding: false
related:
  - [[../dynasty-board-ownership-bankruptcy-2026-06-05]]
  - [[../../10-Architecture/09-Decisions/ADR-0079-dynasty-board-ownership-and-bankruptcy]]
---

# RAW — Board confidence, ownership & bankruptcy in comparable games

Verbatim Perplexity (Sonar) capture. Prompt: how Football Manager, OOTP and EA
SPORTS FC / FIFA Career Mode implement board confidence, expectations, dynamic
ownership/takeovers and club administration — with concrete tiers/mechanics —
plus what players/reviewers criticise and what the best implementations do well.
Captured 2026-06-05 for FMX-89. **Status: raw** — not implementation authority;
the synthesis is [[../dynasty-board-ownership-bankruptcy-2026-06-05]].

---

How the main shipped games handle these systems (community reverse-engineering where numbers aren't published).

## 1. Football Manager (SI)

### 1.1 Board confidence / manager performance ("Timeline")
Board / Club Vision screens show an overall **Job Security** text state — typical tiers: Very Secure → Secure → Stable/Satisfied → Insecure → Very Insecure → Job Under Review → On the Brink → Sacked. A multi-panel **board confidence** breakdown by domain: **Club Vision / Culture** (e.g. "Play attacking football", "Sign young players"), **Competition performance** (League, Cups, Continental), **Matches** (recent results), **Transfers**, **Finance**, **Squad Atmosphere / Support**. Each panel has a satisfaction text (Very pleased → Pleased → Satisfied → Disappointed → Very Disappointed) + a trending bar. Newer FMs add a **Manager Timeline** logging milestone events (big wins/derbies, cup wins, promotions; record signings; embarrassing losses) tagged with sentiment, feeding board+fan confidence over long periods. Model: a **short-term score** (last 5-10 matches, form-weighted) + **medium-term** (season vs expectations) + **long-term legacy** (milestones give permanent ±X).

### 1.2 Expectations set & shown
Pre-season the board offers **target tiers tied to budget** (e.g. Avoid Relegation / Mid-table / Top-half / Europa qualification); higher target → higher budget → harsher evaluation. Shown as **primary competition targets** ("League: Top-half", "FA Cup: Reach Fifth Round", "CL: Reach Quarter Final") + **Club Vision** multi-year objectives ("Within 3 seasons: Qualify for CL"; "Work within wage budget"). During season each objective has a defined minimum stage/position + instant-fail thresholds; UI status labels **On Course / Very Pleased / Disappointed / Failed** + a Delighted↔Very Disappointed bar. Pattern: each objective = **Target + Minimum acceptable**; meeting → +score, slightly under → neutral/−small, far under → large negative + immediate "threatened" state.

### 1.3 What moves confidence & how sacking works
Positive: exceeding position vs expectation; overachieving cup runs; beating rivals; signing high-rep / fits-vision players; profits / under wage budget; high dressing-room support. Negative: below the position expectation for too long (FM tracks projected as well as current); early cup exits (if board cared); long winless streaks / heavy defeats; unrest ("lost the dressing room"); financial losses. Community model: a hidden score per category combined into a global manager score that decays (recent results weigh more) with thresholds → states. **Board meeting & sacking flow:** below a threshold → **Board Confidence Meeting** with dialogue choices (defend yourself) sometimes granting a time-limited stay with a **short-term mini-objective** ("Take 10 points from next 5 matches"); fail → automatic sacking. Essentially a **2-phase system**: soft warning (meeting + temporary override objective) then hard cutoff.

### 1.4 Takeovers, ownership, ambition
Takeover types: internal board reshuffle / new chairman (same ownership, different personality); consortium / fan-consortium; tycoon (very rich, high ambition); local businessman (medium money). Fire as news + short "talks": transfer embargo while in progress; succeeds/fails after weeks; outcomes — injection of transfer funds (variable), new club vision & expectations (more ambition → higher targets/budgets), occasionally a new owner wanting a different manager → immediate sacking or end-of-season review. **Owner/chairman attributes** (partly exposed, community-discovered): **Ambition**, **Patience**, **Interference / Hands-On**, **Business/Finance**, **Loyalty**. High ambition + high patience → big budgets, time to achieve; high ambition + low patience → volatile; low ambition + high finance → frugal.

### 1.5 Administration, bankruptcy, points, fire-sales
Club enters **administration** → automatic points deduction (varies; e.g. −9 in many English leagues) + immediate transfer embargo + forced player sales (AI accepts lower bids, "must sell"; "administrators accepted a bid over your head"); budgets slashed, high earners pushed out. Later: takeover (new owner) or continued strict restriction. Pattern: bankruptcy is a **multi-system event** (competition penalty + forced economic contraction + ownership pipeline).

## 2. OOTP & FM — owner archetypes and budget behaviour
**OOTP** has a more explicit owner model. Owner attributes (OOTP 23-25 era): Personality — *Big Spender* vs *Penny Pincher*, *Hands-Off* vs *Interfering*, *Win Now* vs *Patient rebuild*, *Fan of star players* vs *prefers prospects*; Goals — win X games, reach playoffs / win championship within N years, acquire/keep a star, improve attendance/profit. **Owner sets your budgets** (payroll cap, scouting, development, intl FA). End-of-season review vs goals: pleased → raise payroll %, become more ambitious (tougher goals); displeased → cut budget, hot-seat warning, or fire. Requesting more budget = a dialogue, success chance by personality. Lessons: make the **owner the source of budget** (not an abstract club); explicit **owner goals**; **owner traits** for predictable, playable behaviour. **FM vs OOTP:** FM owner personality is hidden/indirect; OOTP foregrounds the owner as a character with explicit traits + written goals tied to budget.

## 3. EA SPORTS FC / FIFA Career Mode
**Board Objectives system:** start-of-season objectives grouped by priority — **Critical** (highest weight; failing can sack you even if all else is fine), **High**, **Medium**, **Low** — across areas: Domestic Success, Continental Success, Youth Development, Brand Exposure, Financial. Each objective has a numeric/stage target + a 0-100% progress bar. **Board Confidence / Manager Rating** meter (0-100), ~80-90 to start, up with objective completion + key wins, down with failures/poor form; overall rating = weighted combo of objective completion + recent form + position vs expectation. **Club Prestige (1-10)** sets the class of objectives + tolerance for failure (big clubs with Critical objectives sack quicker). **Sacking:** rating below a threshold (community-inferred ~40) → warning emails → immediate sacking → Job Search; failing a **Critical** objective (badly missing league target; financial failure; Critical youth/brand) or long poor form triggers it. Heavily UI-exposed and deterministic, though weighting feels opaque.

## 4. Criticisms & what works well
**FM criticisms:** arbitrary/opaque board behaviour (expectations disconnected from reality; unclear weighting → sudden sackings); static/shallow club vision over time; **takeovers feel cosmetic** (modest budget bump + a line of text; ownership type doesn't change a decade of play); **bankruptcy mostly punitive, not systemic** (one-time crisis, no creditor negotiation, no multi-season recovery arc). FM does well: holistic evaluation (not just position — competitions, finances, promises, mood); **board meetings with negotiation** (argue for time / renegotiate expectations); long-term vision objectives.
**OOTP criticisms:** owner goals sometimes gamey/random; very conservative finances (refusing increases after success → late-game stagnation); limited personality evolution. Does well: **explicit legible archetypes**; goal-based evaluation; direct budget control as a character's decision.
**FIFA/EA FC criticisms:** objectives feel arbitrary/immersion-breaking ("sign 3 players from Asia"; "increase shirt sales"); incoherent rating (win the league + CL yet fired for a youth/financial objective); short-termist & scripted (no ownership/board personality, no meaningful takeovers, expectations barely evolve); late-game stagnation (objectives reset similarly each year). Does well: clear UI-exposed objectives (Critical/High/Medium/Low); single transparent 0-100 rating; variety of objective types pushing engagement with multiple systems.

## 5. Design takeaways
**Board confidence & expectations:** multi-channel evaluation (Competition, Vision, Finances, Squad Mood, Transfers); board stance = hidden score per channel (−100..+100) + visible qualitative label; explicit season expectations (Target + Minimum acceptable per competition; multi-year vision goals with deadlines); negotiation hooks (pre-season target/budget tier choice; mid-season meetings to request time / altered goals / budget).
**Dynamic ownership & ambition (OOTP clarity + FM long-termism):** owner archetypes on axes (Ambition, Patience, Interference, Financial Prudence, Narrative Quirks); explicit 1-year + 3-5-year goals; budget changes & sacking thresholds = f(goal completion, ambition, patience); takeovers swap archetype, hard-reset budget philosophy + expectations, optionally re-evaluate the manager.
**Bankruptcy & crisis:** automatic competitive penalty (points, embargo); switch to an **administrator owner** with rigid rules (must-sell over a value threshold; hard wage cap; no new long contracts); a **takeover-search arc** (each buyer an archetype + offer, chance to fail per attempt); player interaction (negotiate with administrators; survive to earn long-term narrative rewards — "Legend for saving the club").
**Avoiding pain points:** surface the board score + top-3 helping / top-3 hurting factors; only mark realistically-sackable goals as Critical; make takeovers consequential (budget, expectations, stadium plans, youth, style); build in **evolution** (owner/board priorities drift over years; aging owner more risk-averse; successor more ambitious).

### Citations
[1] https://gamesbeat.com/why-and-how-systems-based-game-design-works/
[2] https://www.youtube.com/watch?v=im49swPfWIo
[3] https://discussions.unity.com/t/how-to-build-a-football-manager-like-game-need-tutorials-assets/565498
[4] https://www.level99store.com/blogs/design-series/system-oriented-design
[5] https://www.gamedeveloper.com/design/a-guide-to-systems-based-game-development
[6] https://steamcommunity.com/app/872790/discussions/0/1742229167198377690/
