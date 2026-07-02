---
title: Raw Capture — In-Match Live Controls per Mode (Tier Gating the Live Kit)
status: raw
tags: [research, raw, dual-mode]
created: 2026-07-01
updated: 2026-07-01
type: research
binding: false
sourceType: external
---

# Raw Capture — In-Match Live Controls per Mode (Tier Gating the Live Kit)

Raw query log for [[../in-match-controls-tier-gating-2026-07-01]]. Queries run
2026-07-01 via Perplexity (Sonar) and Exa web search. Substantive answers are
condensed to the load-bearing claims with their cited sources; marketing filler
removed. Perplexity synthesis text is itself secondary — the named URLs are the
evidence.

## Q1 — FM Instant Result vs live management: who decides, how big is the edge?

**Query:** In Football Manager, what is known about the competitive difference
between watching/managing matches live versus using Instant Result (FM Touch /
FM Mobile / desktop skins)? Does Instant Result use the assistant manager for
in-match decisions? Is there community/dev evidence that live intervenors get
measurably better results, and how big is the edge? What did SI say about
balancing Instant Result?

**Substantive answer (condensed):**

- Instant Result is not holiday mode: the match is credited to the human
  manager, but the AI/assistant proxy performs the in-match decisions — "your
  assistant manager does the team talks, substitutions and the shouts and if
  he's better than you in those areas then you'll get better results with
  Instant Result and if he's worse than you then you'll get worse results"
  (FM-Arena, "Playing Games Vs Instant Result",
  https://fm-arena.com/thread/18461-playing-games-vs-instant-result/).
- Some implementations let the AI tweak the human's tactic (roles, mentality,
  instructions) during Instant Result (FM-Base "INSTANT RESULT : WARNING",
  https://fm-base.co.uk/threads/instant-result-warning.143773/).
- No published quantitative SI or community study fixes a percentage edge for
  live play vs Instant Result; the evidence is mechanistic + anecdotal, and the
  sign of the gap depends on assistant quality vs human quality.
- FM26 makes Instant Result an official standard feature (previously
  Touch/Mobile/skins only); SI messaging frames it as a play-style/pace choice,
  not a difficulty choice.
- Reddit context thread:
  https://www.reddit.com/r/footballmanagergames/comments/17ulnb5/instant_result_functionality_question/

## Q2 — Anstoss 2/3 live-match interaction

**Query:** How did Anstoss (Ascaron, esp. Anstoss 2/3) handle live match
interaction — subs, tactic changes, sideline shouts, speed, pause — and how
coarse were the controls vs Football Manager?

**Substantive answer (condensed):**

- MobyGames on Anstoss 2: "The matches are presented in 3D cutscenes. You can
  exchange players, adapt tactics to new situations or weather conditions, but
  don't participate directly."
  (https://www.mobygames.com/game/4436/anstoss-2-der-fu%C3%9Fballmanager/)
- Documented live interaction = substitutions + coarse team-level tactic
  changes (formation, attack/defence lean, weather adaptation). No documented
  multi-option shout system; if a sideline "Anfeuern"-style action existed it
  was cosmetic/coarse, not a control system. (Same MobyGames source;
  PCGamingWiki entry
  https://www.pcgamingwiki.com/wiki/Anstoss_2:_Der_Fu%C3%9Fballmanager gives no
  live-control detail.)
- Speed/pause specifics are NOT documented in accessible sources — flagged
  unverified.
- Series positioning: business/club management focus, matches one part of the
  whole, hence lightweight live control (Kevin Toms retrospective post,
  https://www.facebook.com/KevinTomsGames/posts/1480957377377030/).

## Q3 — Mobile football-manager live-match interaction patterns

**Query:** How do mobile football manager games (Top Eleven, OSM, Soccer
Manager, matchday-style games, Retro Bowl) handle live match interaction, and
do live attendees get a bounded or unbounded advantage?

**Substantive answer (condensed):**

- Top Eleven (official help, https://www.topeleven.com/old-site/help/): Live
  Match lets you "react if needed by changing your tactic, formation or players
  in real time"; boosters (heal/rest/morale) usable live.
- Top Eleven live-attendance possession/team-play bonus is a **fixed
  match-wide bonus** granted for showing up once, not a scaling reward for
  continuous presence (community:
  https://www.reddit.com/r/topeleven/comments/9r71zf/how_does_the_possession_bonus_work_for_watching_a/,
  official forum
  https://forum.topeleven.com/top-eleven-general-discussion/73420).
- OSM / Soccer Manager: simulation-first, pre-match setup dominates; live
  interaction limited to coarse tactical adjustment — attendance edge minimal
  and bounded. (Perplexity synthesis; no strong primary URL — treat as medium
  confidence.)
- Retro Bowl: no manager-style live layer at all; edge comes from roster
  building + a few game-time calls.
- Pattern across the genre: live attendance helps **only within fixed discrete
  systems** (a bonus, a small set of tactical knobs), never via unbounded
  continuous micro-control.

## Q4 — Auto/assist vs manual over one simulation: bounding the gap

**Query:** In games offering both auto/assist and manual micro-management over
the same simulation (Total War auto-resolve, coach/sim modes in sports games,
auto-battle), what is known about the performance gap and how designers bound
it?

**Substantive answer (condensed):**

- Total War auto-resolve: compares army power via formula + hidden modifiers
  (difficulty-dependent, settlement defence); tuned to approximate a
  "competent but not expert" player. Community consensus: auto-resolve ≈
  competent manual play in routine battles; skilled manual play clearly
  outperforms in complex/exploitable battles (unit preservation, terrain).
  Sources: Total War wiki autoresolve page
  (https://totalwarwarhammer.fandom.com/wiki/Autoresolve); CA forum thread
  "Let's Talk About Autoresolve and Why it Needs A Revision Bad"
  (https://community.creative-assembly.com/total-war/total-war-warhammer/forums/8-general-discussion/threads/6939);
  rebalance mods stating design goals explicitly
  (https://steamcommunity.com/sharedfiles/filedetails/?id=3501256396,
  https://steamcommunity.com/sharedfiles/filedetails/?id=2858465652).
- When auto-resolve punishes too hard, players feel **forced** to fight
  manually — a top-tier balance complaint; the modding target is "auto-resolve
  viable for easy/routine, manual retains a clear edge at the top end".
- No widely-cited dedicated GDC talk on bounding auto-vs-manual gaps was found
  — flagged as an evidence gap; heuristics come from community/mod design
  statements.

## Q5 — FM full vs Touch/Console vs Mobile in-match kits + quantified shout/team-talk value

**Query:** Compare the live-match feature sets of FM desktop vs FM
Touch/Console vs FM Mobile (FM23–FM26); what did Touch/Mobile cut; is there
quantitative testing (FM-Arena) on how much team talks/shouts affect results?

**Substantive answer (condensed):**

- SI's own edition comparison (https://www.footballmanager.com/compare-games):
  desktop = "most complete… full tactical control, team talks…"; Console/Touch
  = "streamlined… cleaner, faster matchday experience"; Mobile = "stripped-back
  interface and fewer in-depth options".
- Cut ladder (SI page + community threads,
  https://www.reddit.com/r/footballmanagergames/comments/1oocgsv/): Touch/
  Console keeps subs + mentality + mid-match tactic editing but drops/automates
  manual team talks, the full shout palette and the data-dense "touchline
  tablet"; Mobile drops team talks and interactive shouts entirely, keeps subs
  + coarse mentality/tactic switch + speed/highlight control.
- Community verdict: Touch/Mobile players are seen as mildly disadvantaged for
  min-maxing but "you win and lose in broadly similar ways" — a pace/depth
  trade, not a broken tier.

**Exa follow-up (FM-Arena primary threads):**

- FM-Arena mechanism mega-test
  (https://fm-arena.com/thread/15288-some-mechanism-detailed-tests-it-took-me-1-2-months/):
  "'Player Control' vs 'Holiday' shows identical xG and actual goals… Only real
  difference: team morale boost from 'Shouting'. Without shouting, manual
  control provides zero statistical advantage." (i.e. in FM's engine the whole
  measurable live edge concentrates in the shout/morale channel, which is
  delegable to the assistant.)
- FM-Arena touchline-shouts test
  (https://fm-arena.com/thread/628-touchline-shouts-in-fm/ + ZaZ Blue thread
  https://fm-arena.com/thread/1831-zaz-blue-4-0/page-21/): "we've tested the
  Touchline Instructions and found that they are essential and give a huge
  advantage. It requires releasing Touchline Instructions every 15-20 minutes…
  if you don't want to be bothered… you can delegate them to your assistant
  manager." Shout cadence ~every 10–20 in-game minutes; team-wide shouts beat
  individual ones.
- FM-Arena tactic-testing methodology note
  (https://fm-arena.com/thread/8922-understanding-the-results-of-fm-arena-tactic-testing):
  between a top tactic and a clearly weaker one the gap is ~7–14 points over a
  38-game season in equal-squad testing, shrinking to ~2–5 points once squad
  quality is high — "the better/worse your players compared with your opponent
  players, the less your tactic matters."
- Qualitative shout guides (Passion4FM
  https://www.passion4fm.com/how-to-use-touchline-shouts-in-football-manager/;
  FM Story
  https://footballmanagerstory.com/football-manager-touchline-shouts-guide-change-the-game/):
  shouts are contextual morale/body-language tools that can backfire
  (complacency, anxiety) — an expressive risk/reward channel, not a pure buff.
- No formal points-per-season isolation study of team talks/shouts exists;
  FM-Arena's public quantitative work centres on tactic shapes. Flagged as an
  evidence gap.
