---
title: "RAW Perplexity — Real-world board expectations & confidence (FMX-89)"
status: raw
tags: [research, raw, perplexity, board, confidence, ownership, dynasty, fmx-89]
created: 2026-06-05
updated: 2026-06-05
type: research-raw
binding: false
related:
  - [[../dynasty-board-ownership-bankruptcy-2026-06-05]]
  - [[../../10-Architecture/09-Decisions/ADR-0079-dynasty-board-ownership-and-bankruptcy]]
---

# RAW — Real-world board expectations & board confidence

Verbatim Perplexity (Sonar) capture. Prompt: how board expectations and board
confidence in a real professional football club work over a season and across
seasons — expectation-setting inputs, confidence drivers, the happy→sacked
escalation ladder with timelines, the cross-season over/under-performance
ratchet, and real examples — for realistic modelling in a manager sim. Captured
2026-06-05 for FMX-89. **Status: raw** — not implementation authority; the
synthesis is [[../dynasty-board-ownership-bankruptcy-2026-06-05]].

---

In real clubs, **season expectations** are a mix of owner ambition, financial model and recent performance, and **board confidence** moves mostly with results vs those expectations, fan mood, and internal politics. You can model it as a tiered ladder with clear triggers: pre-season targets → rolling evaluation vs target bands → soft warnings / media "vote of confidence" → internal review → sacking or reset, with expectations ratcheting up or down across seasons.

## 1. How boards set seasonal expectations

### Who sets expectations and how formal it is
The effective "board" for sporting expectations is usually: **Owner / majority shareholder** (sets ambition level — survival vs Europe vs titles); **Chairman / president + CEO** (translate ambition into concrete targets and budgets); **Sporting director / director of football** (aligns expectations with squad quality and recruitment). Communicated to the manager in **job interviews / hiring** ("minimum top-10, push for Europe") and a **start-of-season meeting** where budget, style and targets are agreed. The expectation may be *stated* cautiously in public ("consolidate in the division") while *internally* being higher.

### Core inputs that drive expectation level
1. **Club size & wage/transfer budget** — boards look at **wage-bill rank** and **squad value** as a proxy for where they "should" finish; in the PL, wage-bill rank correlates strongly with finish; top-6 wages → expected European places. (Newcastle post-takeover: explicit "top six" talk.)
2. **Previous finish & recent trend** — a club finishing 8th twice rarely accepts "avoid relegation"; baseline becomes "top half" / "challenge for Europe". Newly promoted side with limited spend → "avoid relegation / finish 17th or higher".
3. **Owner ambition / project phase** — Consolidation/survival; Growth/European push; Title/Champions League cycle. Elite clubs default to titles + deep UCL runs.
4. **Financial constraints & regulations** — UEFA financial sustainability + domestic cost controls; CEOs judged on staying within wage-to-revenue/loss limits while competitive. Expectations may be conditional ("qualify for Europe *if* within wage budget"; "sell to buy; mid-table acceptable").
5. **Club status & fan culture** — historic big clubs in lower leagues (Leeds, Hamburg) face fan pressure for promotion; fan-owned/community clubs may set survival + sustainable finances explicitly.

### How expectations are expressed (good game hooks)
Tiers: **League position** (avoid relegation / mid-table / play-offs / qualify for Europe / win title); **Cup performance** ("reach QF/SF" — looser; deep run can offset league disappointment); **European competition** ("reach group stage / knockout"); **Non-result objectives** (use academy/younger players; implement a style; net transfer profit). In a game: a **primary league target + secondary cup targets + 1-2 strategic objectives**, weighted differently per board type.

## 2. How board confidence rises and falls

### Core driver: results vs expectation bands
Confidence is driven by *distance from an invisible band*, not one precise target. **Safe band** (roughly at expectation), **over-performance band** (comfortably above), **under-performance band** (below). Boards look at points-per-game & league position vs budget/target, **trend over last 5-10 matches**, and **context** (injuries, fixture difficulty).

### Concrete events that move confidence
**Positive:** sustained over-performance vs expectation; big wins in high-profile matches (derbies, statement wins); cup runs (deep run offsets middling league form; giant-killing for lower-league clubs); successful integration of signings / academy players; fan backing / atmosphere ("manager's name sung").
**Negative:** under-performance vs expectation (well below minimum trajectory); losing streaks (6-8 winless often triggers internal review even if on target); heavy defeats (4-0/5-0, esp. at home); derby/key-rival losses; cup humiliation (knocked out by much lower tier); fan unrest (protests, "manager out" banners); transfer-market friction (manager publicly criticising the board; disputes over selling key players).
**Non-result factors:** alignment with board strategy (buys/sells as agreed, sensible wages, develops assets → more time); media conduct & reputation; internal relationships (conflicts with SD/CEO/stars can shortcut the ladder).

In a game each can be a discrete confidence modifier, with results the largest weight and context modifiers on top.

## 3. Realistic escalation ladder: happy → sacked
(August-May European season assumed.)

- **State 1 – Satisfied / Confident.** Position within expectation band; supportive public comments; normal budget discussions.
- **State 2 – Concerned but supportive.** After 4-6 poor results in 8-10 games, or a little below expected position. Month 2-4: board privately raises concerns; public "full confidence" with caveats; informal internal checkpoint ("improvement over the next month").
- **State 3 – Under review / first explicit warning.** Clearly underachieving (relegation zone when aiming mid-table; 10+ points off a realistic top-4 target by Christmas) or severe slump. Month 3-6: crisis meetings; off-the-record media briefings ("situation monitored"; "next few games crucial"); sometimes a formal internal performance review. In-game: "The board are concerned… they expect X points from the next Y matches." Confidence drops to "orange".
- **State 4 – Public 'vote of confidence' / ultimatum.** Chairman/CEO publicly backs the manager *while* making expectations clear. Internally, replacements may already be sounded out; the vote often means close to sacking. Informal ultimatum (improve over 3-5 games). Typically Nov-Mar. In-game: "Your position is under serious threat. We require at least [target] from the next [N] fixtures."
- **State 5 – Last chance / internal decision window.** An unpublicised final game or two; replacement shortlist identified; one bad result (derby loss, cup exit, catastrophic home defeat) → auto-sack; a good win can move back up one state. Often invisible to the player; drives high volatility.
- **State 6 – Manager sacked.** Hard failure vs target becomes likely; fan unrest + results + politics align; or relationship breakdown regardless of results. Timing: early season (8-12 games) if start disastrous; mid-season Nov-Feb common; late season if relegation/target-miss near-certain. Model a hidden "sack threshold" combining current confidence, probability of meeting the seasonal target, and political modifiers.

## 4. The "ratchet" effect (cross-season expectations)
**Over-performance ratchet (up):** significant over-achievement → new/improved contract; public framing changes ("avoid relegation" → "push for Europe"); next-season baseline rises (relegation→mid-table; mid-table→Europe; Europe→top-4 minimum). Risk: regression to mean means the same manager is judged against a higher "new normal" and faces pressure sooner. **Excellent seasons should both boost immediate confidence and tighten future expectations.**
**Under-performance ratchet (down or replace):** Option A sack (ambitious clubs keep target high for the next manager); Option B reset expectations lower (if finances/squad/league context worsened); Option C rebuild phase (lower short-term expectations + demand visible progress — youth, style). Model a **moving baseline** = weighted average of last 2-3 seasons, adjusted by resources + board-ambition type.

## 5. Real examples (patterns)
- **A. Over-performance raises expectations, then tighter leash.** Modest start → unexpected top-6/European qualification → next season benchmarked as a European team → form regresses → confidence drops *faster* because the baseline moved.
- **B. Big-club under-performance, compressed ladder.** Expectation = title + deep UCL run → poor start → quick confidence drop, media speculation, internal review → heavy defeat in a marquee game (rival / UCL knockout) → immediate sacking. Threshold for "under review" only a few points below title pace; marquee matches double-weighted.
- **C. Public vote of confidence → dismissal.** Start below expectations → "manager under pressure" rumours → public vote of confidence → behind-the-scenes ultimatum → two more bad results, toxic atmosphere → sacked.

## Turning this into a tiered system
- **Expectation tiers** (per season): Survive (17th+), Lower mid, Upper mid, Europe, Champions League, Title, + domestic-cup & European-cup targets, + 1-2 strategy goals.
- **Confidence states:** 1) Confident 2) Concerned 3) Under review (internal target window) 4) Vote of confidence (explicit ultimatum) 5) Last chance (hidden do-or-die) 6) Sacked.
- **Drivers each week/month:** result (weighted by opponent strength, home/away, league vs cup); deviation from expected league trajectory; streak modifier; special-match flags (rival, derby, cup upset, humiliation); fan mood; board-relation modifiers (transfer-support alignment, public comments).
- **Ratchet across seasons:** new target = f(last finish, wage rank, owner ambition, over/under-shoot last season). Over-performance ↑ both starting confidence and expectations; under-performance → sack or lower future expectations + "rebuild" narrative.

### Citations
[1] https://blogs.usafootball.com/blog/4861/the-guide-for-setting-expectations-in-your-football-program
[2] https://avecsport.com/blog/a-complete-guide-to-football-club-roles
[3] https://thefsa.org.uk/fan-resources/resource-training/community-owned-clubs/board-best-practice/roles-and-responsibilities/
[4] https://www.emerald.com/sbm/article/doi/10.1108/SBM-09-2025-0226/1360500/Board-composition-in-professional-football-clubs
[5] https://www.spencerstuart.com/-/media/2024/02/moving-goalposts/moving-the-goalposts-the-new-rules-for-football-club-ceos.pdf
[6] https://forums.operationsports.com/forums/forum/soccer/ea-sports-fc-and-fifa/ea-sports-fifa-last-gen/621266-board-expectations
