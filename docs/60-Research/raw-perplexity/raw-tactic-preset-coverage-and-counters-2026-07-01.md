---
title: Raw Capture - Tactic Preset Coverage and Counters (Dual-Mode Research)
status: raw
tags: [research, raw, dual-mode]
context: tactics
created: 2026-07-01
updated: 2026-07-01
type: research
binding: false
sourceType: external
related:
  - [[../tactic-preset-coverage-and-counters-2026-07-01]]
---

# Raw Capture - Tactic Preset Coverage and Counters

Raw web-research capture for the dual-mode parity research packet
`tactic-preset-coverage-and-counters` (2026-07-01). Queries ran via
Perplexity Sonar and Exa web search. Substantive answers and quotes below,
with source URLs. Editorial judgement lives in the synthesis note, not here.

## Query 1 — Rock-paper-scissors / intransitive balance, dominant-strategy prevention (Perplexity)

Prompt: how designers use intransitive (RPS) mechanics to keep small option
sets balanced; minimum options for a non-degenerate intransitive metagame;
soft vs hard counters. Asked for named sources (Sirlin, GDC, Schreiber).

Key returned claims + sources:

- Sirlin: balanced games need many **meaningful, non-dominated options**;
  designers should "remove dominant moves" and "build-in systems of
  counters"; a single RPS round is the degenerate extreme with "nearly no
  basis to choose one option over another".
  - <https://www.sirlin.net/articles/balancing-multiplayer-games-part-1-definitions>
  - GDC 2009 Sirlin handout:
    <https://static1.squarespace.com/static/50f14d35e4b0d70ab5fc4f24/t/53ef1dbae4b0a6d424125a6f/1408179642248/GDC+2009+sirlin+handout6.pdf>
  - <https://www.sirlin.net/articles/designing-yomi> (RPS core only works
    when choices have different payoffs and are hard to compute perfectly).
- Ian Schreiber, Game Design Concepts / Game Balance Concepts (Level 16,
  "Game Balance"): **intransitive relationships** are one of the main ways
  to balance game objects; a cycle needs at least 3 options.
  - <https://gamedesignconcepts.wordpress.com/2009/08/20/level-16-game-balance/>
- "Doing RPS Right" (Law of Game Design): weighted RPS is dangerous when it
  **locks in results at the selection moment** — the game becomes only
  interesting during character/tactic selection; mitigate by letting pieces
  serve multiple roles and by softening counter magnitudes.
  - <https://lawofgamedesign.com/2015/04/22/theory-doing-rps-right/>
- "In Defense of Hard Counters in RTS Games" (Game Developer): hard
  counters are acceptable only if the disadvantaged side keeps meaningful
  tactical options; otherwise matchups collapse into "did you build the
  right unit".
  - <https://www.gamedeveloper.com/design/in-defense-of-hard-counters-in-real-time-strategy-games>
- Evolving Developer, multiplayer balance part 1 (secondary):
  <https://evolvingdeveloper.com/multiplayer-game-balance-part-1/>

Synthesis offered by the model: >=3 options for a true cycle; prefer soft
(percentage) counters; add secondary dimensions (payoffs, context value,
hidden info) so the metagame is not solved at pick time; option set small
enough to understand, large enough not to degenerate.

## Query 2 — FM meta-tactic / downloaded super-tactic problem (Perplexity)

Prompt: documented FM super-tactic examples, why they arise, how SI or
others attempted fixes.

Key returned claims + sources:

- "BROKEN FM20" gegenpress 4-3-3/4-1-4-1 (two Mezzalas, two Inside
  Forwards, Advanced Forward, attacking mentality, intense counter-press)
  still worked plug-and-play in FM23.
  - <https://www.youtube.com/watch?v=FQw6yf-HwKo>,
    <https://www.youtube.com/watch?v=fgE52eAzYxE>
- "ZaZ Blue 4.0" (FM23): 4-1-5 with inverted wing-backs, called "a bit of a
  cheat code" usable with almost any team in the top Reddit thread on
  broken FM23 tactics.
  - <https://www.reddit.com/r/footballmanagergames/comments/117ekxt/what_is_the_most_broken_tactic_of_fm23/>
- SortitoutSI "Win Every Game with This Overpowered FM23 Tactic" (4-1-3-2,
  120+ goals with an underdog).
  - <https://sortitoutsi.net/fmtv/video/33635>
- Recurring causes named by community analyses: pressing stamina
  under-penalised, central-overload defending blind spots (IWB/Mezzala
  waves), rigid set-piece marking (older "broken corners"), and AI managers
  reacting with incremental tweaks instead of systemic counters.
- SI mitigation levers cited: match-engine patches, role rebalancing,
  tactical-familiarity + cohesion systems reducing plug-and-play value,
  preset styles steering casual players.
- CAVEAT recorded: the model flagged that its SI-philosophy claims were
  partly extrapolated beyond the retrieved sources ("rely partly on broader
  knowledge of SI's dev communications"). Treat SI-statement claims as
  low/medium confidence; the tactic examples themselves are grounded.

## Query 3 — Anstoss simple tactic set effectiveness (Exa)

Query: Anstoss 2/3 Taktik Einstellungen Spielweise Einsatz Härte guides.

- Anstoss Coaching Zone, Anstoss 3 Tipps
  (<https://www.anstoss-zone.de/anstoss3/a3_tipps.php>): community meta
  collapsed to a narrow band — "Die besten Taktiken sind zwischen 'normal'
  über die 'kontrollierte Offensive', bis hin zu 'offensiv'"; Einsatz
  "normal" oder "rauh"; other settings bring red cards or heavy defeats.
- PC Games Database, "Anstoss 2 — 100 Tipps & Tricks"
  (<https://www.pcgamesdatabase.de/artikel.php?aid=222&seite=3>): documented
  symmetric trade-off table for the 7-step Ausrichtung dial: Abwehrriegel
  +22% defence-effect / -40% attack ... Brechstange -40% defence / +22%
  attack (community-reconstructed numbers); warnings against playing 120%
  or 150% Einsatz (card/fitness cost).
- Anstoss-Jünger test threads
  (<https://www.anstoss-juenger.de/index.php/topic,159.0.html>,
  <https://www.anstoss-juenger.de/index.php/topic,2879.0.html>): RNG-seed
  testing found several tactic options had **no measurable effect**
  (Positionstreue, "Schießt aus allen Lagen!", "Bälle hinten konsequent
  raushauen!", weak Pressing levels, Abseitsfalle at low skill) — dead
  options in a tiny option set; tactical settings change individual scenes,
  not the whole match calculation; Härte interacts with referee strictness
  (Gewalttätig ≈ +3% performance vs Nonnenhockey -5%, per Tipps&Tricks-Heft
  p.77 as cited by the thread).
- Anstoss-Online community guide
  (<https://forum.anstoss-online.de/index.php?article%2F24-guides-tipps-5-aufstellung-und-taktik%2F=>):
  the Anstoss-style control surface formalised as three dials —
  Ausrichtung 7 steps (Abwehrriegel→Brechstange), Einsatz 5 steps,
  Härte 5 steps — plus a condition-matrix "Taktik-Tisch" for in-match
  automation.
- Mogelpower Anstoss 2 Lösung
  (<https://www.mogelpower.de/cheats/loesung.php?id=17145>): "Eine immer
  geltende optimale Taktik gibt es bei ANSTOSS 2 nicht" — but general
  advice is to play as offensively as the squad allows; formation must
  match player material (penalties up to 20% for unsupported shapes,
  e.g. three central strikers without wings).

## Query 4 — Recommended-counter systems + preset library sizing (Perplexity)

Prompt: in-game recommended-counter examples and design guidance; preset
count / choice overload.

Key returned claims + sources:

- Counter-hint precedents: Pokémon type effectiveness, Fire Emblem weapon
  triangle, Pokkén attack triangle — soft, clearly telegraphed counters as
  "balance safety valves".
  - <https://remptongames.com/2018/02/24/cut-crush-and-cover-pt-2-rock-paper-scissors-strategy-in-other-games/>
- Hard-counter debate: hard counters reduce depth if a single obvious
  answer is prescribed; disadvantaged side must keep meaningful play.
  - <https://www.gamedeveloper.com/design/in-defense-of-hard-counters-in-real-time-strategy-games>
  - <https://www.reddit.com/r/gamedesign/comments/a3h0fw/are_hard_counters_bad_game_design/>
- Design guidance distilled: recommendations should be (1) soft modifiers
  not shut-outs, (2) presented as 2-3 options with trade-offs, (3) coupled
  with a reason ("deeper line because of their pace"), (4) avoid "best"
  language, (5) shown in comparison views. FM assistant advice and EA FC
  D-pad game plans (Ultra-Defensive→Ultra-Attacking, ~5 presets) cited as
  shipped sports-game practice (model-level synthesis; individual EA FC/FM
  UI claims not tied to a single URL — treat as medium confidence).
- Preset sizing: shipped curated sets cluster at 4-8 per context (Clash
  Royale deck slots/suggestions, Hearthstone starter deck per class + 4
  archetype labels, EA FC ~5 game plans); Hick's-law-style guidance —
  small, well-grouped, strongly-labelled sets; distinguish starter presets
  from advanced customisation. (General HCI practice; no single primary
  URL — medium confidence.)

## Query 5 — FM-Arena tactic-testing league (Exa)

- FM-Arena FM24 patch table
  (<https://fm-arena.com/table/30-patch-24-4-0-db3-0/>): "4,671 Tactics
  Tested — 9,023,600 Matches Simulated" — the scale of the community
  meta-tactic search process; FM26 table already live
  (<https://fm-arena.com/table/fm26-hall-of-fame/>).
- FM-Arena, "Understanding the results of FM-Arena tactic testing"
  (<https://fm-arena.com/thread/8922-understanding-the-results-of-fm-arena-tactic-testing/>):
  with equal test squads, three well-regarded tactics scored 63 / 56 / 49
  points; when the controlled team was boosted to top-club level the same
  tactics converged to ~100 / 98 / 95 points — "an advantage in the
  players' quality neglects any weakness in your tactic. The better/worse
  your players compared with your opponent players, the less your tactic
  matters." I.e. tactic-choice spread among reasonable tactics compresses
  to ~5% at high squad-quality deltas but is large (~30%) between equal
  squads.
- FM-Arena discussion threads on what the testing league measures:
  <https://fm-arena.com/thread/8733-fm-arena-tactic-testing-league-thoughts/>,
  <https://fm-arena.com/thread/7448-why-do-some-tactics-not-perform-in-the-fm-arena-test/>.

## Query 6 — Hattrick / Top Eleven / OSM small tactic sets (Perplexity)

Prompt: how Hattrick keeps its 7-tactic set non-dominated; community
counter relationships; OSM/Top Eleven counter tables.

Key returned claims + sources:

- Hattrick tactic model: each tactic has a trained **tactic skill level**,
  a primary effect that redistributes chance types (e.g. Attack on Wings
  converts 34-52% of central attacks to wing attacks depending on skill)
  and an explicit ratings penalty (e.g. weaker wing defence); Normal is the
  recommended baseline for ~50%+ of matches; Counter-attacks only pays off
  under strict rating preconditions; Pressing reduces total chances for
  both sides (underdog tool); Long Shots is strong but predictable and
  counterable.
  - <https://wiki.hattrick.org/wiki/Tactics>
  - <https://arxiv.org/pdf/2504.09499> (Hattrick engine reverse-engineering
    paper; numeric rating-driven, not rule-based RPS)
  - <https://www.scribd.com/document/953023823/The-ABC-of-Tactics-in-Hattrick>
    ("use tactics when you gain more from the redirection of attacks than
    you lose from the weakening of the defense")
  - <https://www.reddit.com/r/hattrick/comments/1r766pk/tactic/>
- Community verdict: conditional counters, no dominant tactic, no pure
  tactic-vs-tactic RPS table — counters are rating/positional, engine is
  numeric.
- OSM: community-shared **counter-tactics tables** (per opponent formation
  → recommended formation/mentality/press) are widespread but unofficial
  and disputed — heuristic RPS guidance layered on a small option set
  (model synthesis; no single primary URL — medium confidence).
- Top Eleven: no official counter table; community heuristics only.

## Unverified / flagged

- Perplexity's paraphrases of **SI's own statements** about match-engine
  blind spots and AI adaptation limits were explicitly self-flagged as
  partly extrapolated; no primary SI dev-blog URL captured. LOW confidence.
- EA FC game-plan preset count (~5) and FM assistant-advice phrasing:
  common knowledge level, not pinned to a primary URL in this capture.
  MEDIUM confidence.
- Anstoss percentage tables are community reconstructions (PC Games
  Database tip list, fan-forum RNG tests), not developer documentation.
