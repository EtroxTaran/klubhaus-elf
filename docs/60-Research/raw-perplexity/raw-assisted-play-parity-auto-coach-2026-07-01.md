---
title: Raw - Assisted-Play Parity and Auto-Coach Strength Calibration
status: raw
tags: [research, raw, dual-mode]
created: 2026-07-01
updated: 2026-07-01
type: research
binding: false
sourceType: external
---

# Raw - Assisted-Play Parity and Auto-Coach Strength Calibration

Raw capture for the dual-mode parity research packet
`assisted-play-parity-auto-coach` (2026-07-01). Four grounding queries
(Perplexity Sonar x3, Exa web search x1). Substantive answers condensed;
source URLs preserved. Synthesis:
[[../assisted-play-parity-auto-coach-2026-07-01]].

## Query 1 (Perplexity) — Football Manager assistant delegation and its weaknesses

Question asked: how the FM assistant-manager / Staff Responsibilities
delegation works, documented weaknesses, and how a fully-delegated
"holiday mode" save compares to a hands-on player.

Key raw findings:

- FM24/FM26 let the player delegate almost every day-to-day task
  (training, friendlies, media, scouting, contracts, staff hiring) via
  the **Staff Responsibilities** screen, but tactical *creation* and
  competitive match control cannot be fully delegated the same way —
  the assistant *advises* on selection and opposition instructions
  rather than owning tactics.
  Sources: official FM26 article "Delegating for success"
  (https://www.footballmanager.com/the-dugout/delegating-success-football-manager-26);
  sortitoutsi Staff Responsibilities guide
  (https://sortitoutsi.net/content/67233/staff-responsibilities-guide).
- Delegated staff quality depends on staff attributes; weak assistants
  produce generic training schedules and quietly degrade coaching-staff
  quality over seasons ("only realised seasons into the save that my
  coaches were poor").
  Sources: The Higher Tempo Press, "The responsibilities I delegate in
  Football Manager"
  (https://www.thehighertempopress.com/2025/08/the-responsibilities-i-delegate-in-football-manager/);
  Reddit r/footballmanagergames on coaching attributes under delegation
  (https://www.reddit.com/r/footballmanagergames/comments/w6vbbi/do_coaching_attributes_matter_if_i_delegate/).
- An FM24 YouTube experiment comparing self-made vs assistant-run
  training found the difference "not huge" — delegating training to a
  decent assistant is acceptable; a well-optimised human schedule is
  somewhat better (https://www.youtube.com/watch?v=DzFsRA8pkqQ).
- Community consensus on full "holiday mode" seasons: the holiday save
  roughly reflects intrinsic squad strength, while a skilled hands-on
  human significantly outperforms it. Reported assistant weaknesses
  concentrate in *adaptation*: conservative match plans, odd
  substitutions, little half-time/game-state reaction, no long-run
  tactical evolution, short-termist transfers. This is forum/experiment
  consensus, not an SI-published benchmark — treat magnitudes as
  unverified.

## Query 2 (Perplexity) — Chess engine strength limiting as calibration analogy

Question asked: Stockfish UCI_LimitStrength / UCI_Elo / Skill Level
mechanisms, Maia Chess, and how limited strength is measured.

Key raw findings:

- Stockfish official wiki: `UCI_LimitStrength` enables weaker play
  aiming at the Elo set by `UCI_Elo` (range ~1320-3190); the Elo mapping
  "has been calibrated at a time control of 120s+1s and anchored to
  CCRL 40/4" — i.e. the strength target is defined against an external
  rating list at a stated time control, and is explicitly
  time-control-specific.
  Source: https://official-stockfish.github.io/docs/stockfish-wiki/UCI-&-Commands.html
- Stockfish `Skill Level` (0-20): internally enables MultiPV and, with
  a probability depending on the level, plays a weaker move from the
  candidate set — i.e. full-strength search, probabilistic selection
  among top-N candidates. Same source as above.
- MadChess documents its `UCI_LimitStrength` algorithm: as target Elo
  decreases it simultaneously attenuates evaluation knowledge, slows
  search, and increases blunder probability/severity, then verifies the
  resulting Elo by engine-vs-engine testing.
  Source: https://www.madchess.net/the-madchess-uci_limitstrength-algorithm/
- Maia Chess: instead of weakening a strong engine, trains separate
  neural networks per human rating band on Lichess games to *predict
  the move humans at that band actually play*; strength and
  human-likeness validated via move-agreement rates and matches.
  Sources: Maia project (https://maiachess.com); McIlroy-Young et al.,
  "Aligning Superhuman AI with Human Behavior: Chess as a Model
  System", KDD 2020 (paper identity known; not re-fetched in this
  session — details medium confidence).
- Lichess GUI levels combine Skill Level with movetime and depth caps
  per level (forum: https://lichess.org/forum/general-chess-discussion/stockfish-is-weakened?page=4).
- Transferable calibration loop suggested by these sources: pick a
  weakening mechanism → sweep parameters → measure vs reference agent
  in self-play → fit parameter-to-strength mapping → expose a
  user-facing scale.

## Query 3 (Perplexity) — Advisor / auto-manage / auto-resolve failure modes

Question asked: Civilization advisors and automation, Paradox
automation, Total War auto-resolve, sports "sim match", and the design
tension strong-vs-weak automation.

Key raw findings:

- Civilization: advisors are heuristic suggestion systems; automated
  workers/governors are greedy, short-horizon local optimisers that
  ignore the player's long-term strategy; long-standing community
  complaints about automated workers making poor decisions.
  Sources: https://civilization.fandom.com/wiki/Advisor;
  CivFanatics threads (https://forums.civfanatics.com/threads/7-myths-about-civ-players-that-fooled-developers-at-firaxis.698530/).
- Ed Beach (Civ VI lead designer): "To some extent, automation is a
  sign that your game design is weak… Hitting the automate button and
  then not looking at that unit, there are no interesting decisions at
  all there" — builder automation was removed from Civ VI.
  Source trail: The Verge Civ design piece
  (https://www.theverge.com/2013/2/20/4008912/civilization-v-design)
  and the quote-thread
  (https://www.reddit.com/r/4Xgaming/comments/4l9rl1/to_some_extent_automation_is_a_sign_that_your/);
  exact venue of the quote not independently re-verified — medium
  confidence.
- Paradox: automation (Stellaris sectors, HoI4 battleplans) is
  deliberately "competent but conservative", partly role-play-driven
  (CK vassals act by personality, intentionally non-optimal); dev-diary
  and forum consensus that automation must not beat a skilled human.
  (Perplexity gave genre consensus without single canonical URLs —
  medium/low confidence per claim.)
- Total War auto-resolve: hidden numerical strength formula; community
  consensus that it undervalues micro-intensive units and is tuned
  "good enough to skip trivial battles, not so good that manual play is
  pointless"; opacity produces perceived unfairness. (Community
  consensus; no single canonical URL — medium/low confidence.)
- Cross-genre failure-mode summary from the answer: greedy local
  optimisation; opacity / no explanations; no configurable priorities;
  difficulty tuned assuming manual control so automation users
  effectively self-handicap; patch over/under-correction oscillation.
- Human-factors research parallel: people over-trust automation and
  stop correcting its errors as reliability drops (~70% cited),
  i.e. weak automation still gets used and silently punishes its users.
  Source: https://pmc.ncbi.nlm.nih.gov/articles/PMC4221095/

## Query 4 (Exa) — "Too strong" side: optimizing the fun out

Key raw findings (direct sources):

- Soren Johnson, "Water Finds a Crack" (Designer Notes / Game
  Developer column): "Given the opportunity, players will optimize the
  fun out of a game"; designers should put the player in control of
  their own experience (exploits as opt-in toggles).
  Source: https://www.designer-notes.com/game-developer-column-17-water-finds-a-crack/
- Soren Johnson, "Game AI & Our Cheatin' Hearts" (Game Developer):
  perception is reality — hidden mechanics that look unfair must be
  changed even if technically fair; single events based on hidden
  mechanics need great care.
  Source: https://www.gamedeveloper.com/game-platforms/analysis-game-ai-our-cheatin-hearts
- Jeff Witt, ggDigest (Medium): Battle Legion case study — when
  auto-battle is strong enough to auto-battle *to victory*, "efforts to
  simplify strategy gameplay … accomplished killing the strategy of the
  game"; players left with little to care about.
  Source: https://medium.com/ggdigest/auto-battling-your-way-to-victory-is-not-a-good-design-109937a1f236
- Adam Telfer, MobileFreeToPlay: auto-battle done well is a *bet*:
  "Do I send my fighters out without my control… or do I think the AI
  will mess up this battle, so I should do it manually for the next 10
  minutes?" — manual play buys a bounded edge over automation, and
  auto-battle shifts the interesting decisions to the meta layer.
  Source: https://mobilefreetoplay.com/free-to-play-games-that-dont-want-you-to-play-them/
- Soren Johnson, "When Choice is Bad": more options/agency is not
  automatically better; choice must be traded against time, complexity,
  repetition. Source: https://www.designer-notes.com/gd-column-25-when-choice-is-bad/

## Query 5 (Perplexity) — Recommenders in auto-battlers/deck games; agent-based calibration metrics

Key raw findings:

- In-client recommenders (Hearthstone smart deck completion, TFT item
  hints, Marvel Snap sample decks) are curated/rule-based, collection-
  constrained, and deliberately *not* meta-optimal; official framing is
  onboarding/accessibility, not competitive optimisation. Players
  relying only on in-client suggestions typically plateau at mid ranks;
  top ranks are dominated by external meta-site lists plus adaptation
  skill. (Pattern consensus; per-game details medium confidence.)
- Auto-battler balance research: "Lineup Mining and Balance Analysis of
  Auto Battler" (ACM, https://dl.acm.org/doi/10.1145/3434581.3434611):
  neural-network strength evaluator over combat outcomes + genetic
  search for strong lineups; balance metrics = predicted win rate,
  strength distributions, diversity/overlap of strong lineups (to
  detect meta centralisation). Warns that recommending only
  highest-strength lineups flattens diversity.
- King / Candy Crush: AI playtesting bots at varying skill levels used
  to calibrate level difficulty via win rate per level, attempts to
  clear, score percentiles (industry-known; matches Gudmundsson et al.,
  "Human-Like Playtesting with Deep Learning", IEEE CIG 2018 — not
  re-fetched, medium confidence).
- Agent capability anchored to human percentiles: AlphaStar rated via
  ladder MMR/Elo vs human distribution (Grandmaster level); OpenAI Five
  via win rate vs named pro teams. (Well-known published results; not
  re-fetched this session.)
- Assistant-quality metrics named across sources: win rate vs reference
  agent; Elo within an agent league; **agreement rate with an oracle
  policy**; **regret** (expected-value gap between recommended action
  and oracle action); strategy-diversity metrics when recommendations
  are active.
- Databricks games-recommender overview (two-stage candidate
  generation + re-ranking, A/B validation):
  https://www.databricks.com/blog/personalizing-players-experiences-recommendation-systems
