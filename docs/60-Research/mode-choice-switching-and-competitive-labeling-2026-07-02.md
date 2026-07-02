---
title: "Mode choice, switching and competitive labeling UX (two worlds, switch anytime)"
status: draft
tags: [research, dual-mode]
created: 2026-07-02
updated: 2026-07-02
type: research
binding: false
linear: FMX-212
sourceType: external
context: [league-orchestration, identity-access]
related:
  - [[raw-perplexity/raw-mode-choice-switching-and-competitive-labeling-2026-07-02]]
  - [[dual-mode-precedents-sports-management-2026-07-01]]
  - [[assisted-play-parity-auto-coach-2026-07-01]]
  - [[tier-parity-measurement-calibration-2026-07-01]]
  - [[in-match-controls-tier-gating-2026-07-01]]
  - [[../50-Game-Design/onboarding-and-tutorial]]
  - [[../50-Game-Design/GD-0012-onboarding]]
  - [[../50-Game-Design/progressive-disclosure-ui]]
  - [[../50-Game-Design/GD-0004-tactics]]
  - [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]]
---

# Mode choice, switching and competitive labeling UX

## Question

Given the ratified two-worlds decisions — D1 (3 internal tiers branded as 2
worlds), D2 (switch anytime, everywhere — decided; this note researches its
best *implementation*, not whether to allow it), D3 (bounded pro edge via a
floor+cap envelope, EASY never dominated) and D4 (full sweep) — how should FMX
(a) present the world/mode choice at onboarding, (b) design the switch UX, and
(c) treat world/tier in leaderboards and competitions under switch-anytime,
and (d) name/frame the two worlds so neither reads as the lesser game? What do
comparable games (difficulty locks vs free switching, racing-sim assist
ladders, crossplay aim-assist fairness, chess time-control ladders, the
"Story Mode" naming trend, FM Touch / Madden game styles) document about
player sentiment for each option?

## Summary

External evidence strongly validates D2's switch-anytime posture: free
difficulty switching is the modern accessibility norm and is consistently
praised, while per-save locks are accepted only as clearly-branded, opt-in
challenge modes (Ironman, BG3 Honor Mode) whose value is precisely the visible
commitment — a pattern FMX can reuse later as an *optional* prestige flag
rather than a default lock. Naming evidence is equally clear: "Easy" is a
stigmatized, competence-judging label; purpose-framed names (God of War's
"Give Me Story", Spider-Man's "Friendly Neighborhood", Celeste's "Assist
Mode") measurably shift self-selection, and Celeste even patched its Assist
Mode copy because a "we recommend playing without it" line read as gatekeeping
— a direct lesson for the onboarding experience question and switch dialogs.
The competitive picture is more sobering for the two-worlds ambition: in no
surveyed sports title did the lighter mode become competitively first-class
(FM Touch drifted to Apple Arcade as the "accessible" edition; Madden ranked
standardizes on Competitive; EA FC forces low-assist settings in ranked), and
racing communities tolerate mixed-assist ladders only while assists are
speed-neutral-or-slower — the moment an aid is perceived as faster,
"feels like cheating" debates erupt (GT7 countersteering assist). Because D3
deliberately preserves a measurable pro edge (52–57% head-to-head placeholder),
an *unlabeled* shared ranked ladder would import the crossplay aim-assist
controversy; chess's co-equal per-format rating ladders (blitz specialists are
respected, both formats have world championships) are the best-documented
model for making two worlds competitively first-class in post-MVP async MP.
For MVP single-player leaderboards, a transparent world badge on entries plus
optional Pro-only prestige boards (the Forza "hardcore board" pattern) covers
the gap without segregating the player base.

## Findings

1. **Finding:** Freely switchable difficulty is the documented modern norm and
   is praised as player-friendly; per-save locks draw negative sentiment
   ("archaic", "punitive") *except* when the lock is a clearly-communicated
   opt-in challenge mode (Paradox/XCOM Ironman, BG3 Honor Mode) where the
   commitment itself is the feature. This validates D2 and simultaneously
   shows the one pattern worth reserving: an optional, explicitly-branded
   commitment flag.
   **Source:** ResetEra "Locking difficulty modes behind completion — why does
   this archaic practice still exist" (resetera.com/threads/1303629);
   r/patientgamers thread on one-save/no-save top difficulties; Larian Honor
   Mode documentation coverage — see raw note Q1.
   **Confidence:** high

2. **Finding:** Baldur's Gate 3 Honor Mode implements a **one-way visible
   downgrade**: a failed/abandoned honor run can continue as a custom-mode
   save, but the honor status is permanently nullified for that save. This is
   the cleanest precedent for reconciling switch-anytime with competitive
   integrity: switching is never blocked, but a competition-scoped flag
   records it.
   **Source:** BG3 Honor Mode feature coverage (raw note Q1); widely
   documented in Larian patch 5 notes.
   **Confidence:** high

3. **Finding:** Celeste's Assist Mode is toggleable anytime, carries no
   achievement penalty, and its menu copy was **patched in v1.3.0.0** after
   community feedback because the original "we recommend playing without
   Assist Mode for the first time" wording "unintentionally could have sounded
   gatekeepy"; the replacement frames assists as fitting "your specific
   needs". Designer Maddy Thorson initially opposed the mode ("felt like a
   betrayal of the precious experience") and chose assists over a difficulty
   select because per-difficulty level redesign was unworkable — "maximal
   impact for the player but minimal consequences to the system", which is
   structurally the same argument as FMX's one-core/one-contract design.
   **Source:** celeste.ink/wiki/Assist_Mode (copy history); Film Stories
   interview with Maddy Thorson (filmstories.co.uk, 2022-02-15); Vice/Waypoint
   "The Small But Important Change 'Celeste' Made…" (2019-09-16).
   **Confidence:** high

4. **Finding:** Difficulty-label stigma is a real, mechanistically-understood
   effect: labeling + negative stereotyping + status separation deters people
   from beneficial choices (Link & Phelan stigma model), and games that mock
   their low tier (Wolfenstein II's "Can I play, Daddy?" with baby-bonnet art)
   are cited as the canonical negative example. The counter-pattern is
   purpose-framed naming — God of War's "Give Me Story / Give Me a Challenge",
   Spider-Man's "Friendly Neighborhood", Fire Emblem's "Classic vs Casual"
   (style/identity, not ability) — which names the *experience sought* rather
   than judging the player. Design-community consensus: descriptive or
   diegetic names, never a hierarchy of worth, never revoke rewards for
   assisted play.
   **Source:** Link & Phelan stigma framework summary (Wiley,
   doi:10.1111/jep.13684); r/gamedesign difficulty-naming thread; raw note Q5
   compilation of GoW/Spider-Man/Wolfenstein naming coverage.
   **Confidence:** high for the design pattern and the named examples; medium
   for the strength of the underlying transfer from health-stigma research
   (no controlled study on game-difficulty labels was found).

5. **Finding:** Racing games run **mixed-assist main leaderboards plus opt-in
   "pure" boards**: Forza's community-documented hardcore leaderboards require
   all assists off, while main boards mix assists and career mode adjusts
   *payout*, not ranking. Sentiment is stable as long as assists are
   speed-neutral or slower ("Assists don't make you faster… so you're
   definitely not at disadvantage" — GTPlanet); the GT7 countersteering assist
   shows the failure mode: an aid perceived as *unrealistically faster*
   triggers "for me it feels like cheating" threads even though it is legal in
   ranked Sport Mode.
   **Source:** forums.forza.net/t/hardcore-leaderboards…/23620 and
   /t/leader-boards-assists/96209; gtplanet.net threads 419842 and 427710;
   dg-edge.com Daily C Nürburgring CSA discussion.
   **Confidence:** high for the patterns and sentiment (forum-sourced, but
   convergent across communities); medium for exact current Forza board rules.

6. **Finding:** GT Sport/GT7 ranked Sport Mode runs a **single ladder** where
   assists are permitted settings within race regulations and Balance of
   Performance equalizes *cars*, not player aids; iRacing and F1 esports use
   rule-based assist restriction on a single ladder rather than score
   adjustments. No surveyed racing title applies a lap-time multiplier or
   rating discount for assists.
   **Source:** Perplexity synthesis flagged partly as inference (raw note Q2);
   corroborated for GT7 by GTPlanet/DG-EDGE threads showing assists legal in
   ranked dailies.
   **Confidence:** medium (primary rulebook text not fetched for GT/iRacing/F1
   esports — explicitly unverified against official regulations).

7. **Finding:** The crossplay aim-assist debate demonstrates what happens when
   two input/assist populations share one competitive pool with a *known,
   deliberate* capability difference: fairness is "managed, not solved"
   (Washington Post), sentiment stays permanently divided, and the industry
   converged on three coping patterns — (A) segregate by input (Halo Infinite
   ranked input queues, XDefiant pools), (B) mix with tuning (Fortnite
   input-based matchmaking, CoD), (C) mix with transparency/labeling (input
   icons). Developers consistently frame the assist as accessibility, not
   parity. For FMX this is the direct analogy for the OPEN MP-treatment fork:
   D3's intentional 52–57% pro edge is analogous to an input-capability gap.
   **Source:** washingtonpost.com/video-games/esports/2020/10/16/aim-assist-debate/;
   r/esports "Is aim assist fair?"; EA Apex forums thread 8583770; Blizzard OW
   forums thread 985290.
   **Confidence:** high

8. **Finding:** Chess is the strongest precedent for **co-equal parallel
   ladders**: Lichess (Glicko-2), Chess.com and FIDE all keep separate ratings
   per time control (and per variant), justified by different dominant skills,
   rating-model homogeneity and distinct populations. Having multiple ratings
   is normal and non-stigmatizing — blitz specialists are respected within
   their ladder and rapid/blitz have their own official world championships —
   though classical retains traditional prestige. Assistance policy draws the
   line at *live competition* (engine/explorer use in any live human game is
   cheating, rated or casual), not at ladder membership.
   **Source:** lichess.org/faq (per-time-control Glicko-2 ratings);
   chess.com rating-categories blog; lichess feedback forum threads on
   per-format ratings (raw note Q4).
   **Confidence:** high

9. **Finding:** In the surveyed sports/management titles, **no lighter mode
   ever became competitively first-class**, and branding contributed: SI's own
   compare page ranks full FM as "most in-depth and immersive" with Touch as
   "streamlined… accessible" (Touch was removed from PC/Mac and moved to Apple
   Arcade/Switch); Madden ranked and MCS standardize on the *Competitive*
   game style; EA FC's "Competitive Master Switch" forces low-assist settings
   in FUT Rivals/Champions; F1 esports requires Expert-equivalent settings.
   Community defenses of FM Touch ("it IS the full core game") confirm the
   lesser-edition perception it fought. This is stress-evidence for D1/D3:
   FMX is attempting something the genre has not delivered, and it will hinge
   on (a) the one-contract compilation already decided for the Easy tactic
   surface and (b) naming/labeling that never brands the Easy world as the
   reduced edition.
   **Source:** footballmanager.com/compare-games; FM26 Touch App Store page;
   r/footballmanagergames thread 79fla8; radiotimes.com FM24 editions
   explainer; Madden/EA FC details per raw note Q6.
   **Confidence:** high for FM (primary marketing pages); medium for
   Madden/NBA 2K/F1/EA FC specifics (secondary synthesis, primary rule pages
   not fetched).

10. **Finding:** The existing FMX onboarding already matches best practice in
    shape: one silent experience question with one-tap answers mapping to
    tier/difficulty (GD-0012, onboarding-and-tutorial §1.4/§2), override
    anytime in Settings, and Auto-Coach's never-overwrite guarantee protects
    switchers' manual work (progressive-disclosure-ui §4, §7). What is
    missing for the two-worlds branding is that the experience question's
    answers are competence-framed ("Newbie / Bit / Veteran"), i.e. exactly the
    self-assessment framing the stigma evidence advises against, and the world
    identity is never surfaced or celebrated at all.
    **Source:** internal — [[../50-Game-Design/GD-0012-onboarding]],
    [[../50-Game-Design/onboarding-and-tutorial]] §1.4/§2/§10,
    [[../50-Game-Design/progressive-disclosure-ui]] §4/§7/§8.
    **Confidence:** high

11. **Finding:** Tier/world is currently a **profile-level UI preference not
    embedded in the save** (progressive-disclosure-ui §7/§9). Every surveyed
    competitive treatment (Honor-flag, assist-flagged boards, per-format
    ratings) instead requires a **per-run / per-competition record of the mode
    actually used**. Under switch-anytime, leaderboard or ladder semantics are
    only implementable if league-orchestration snapshots the active
    world/tier per rated unit (run, season, competition entry) and
    identity-access keeps the preference vs. the competitive record separate.
    This is a new cross-context data requirement, not a decision reversal.
    **Source:** internal ([[../50-Game-Design/progressive-disclosure-ui]] §7,
    §9) combined with external patterns in findings 2, 5, 8.
    **Confidence:** high

## Inputs For Decisions

All recommendations below are **recommendations, not decisions** — the forks
stay open for Nico.

### Open fork: Competitive labeling (how results/leaderboards show the world)

Options for MVP-era single-player/roguelite leaderboards (local + future
hosted):

- **Option A — No labeling (mode-blind boards).** Pros: zero stigma surface;
  simplest. Cons: racing evidence (finding 5) shows mode-blind mixing is only
  accepted while the assisted path is speed-neutral-or-slower; D3 deliberately
  grants Pro an edge, so mode-blind boards would understate Easy achievements
  *and* let Pro players suspect nothing distinguishes their result — the GT7
  CSA "feels like cheating" dynamic in reverse.
- **Option B — Transparent world badge on every entry (label, don't
  segregate).** Each leaderboard entry carries the world(s) used during the
  run (finding 11's snapshot). Pros: matches the shooter "transparency"
  pattern (finding 7C) and scoreboard input icons; keeps one board; badge is
  identity ("which game I play"), not a rank discount. Cons: badge design must
  be prestige-neutral or it becomes a stigma icon (finding 4).
- **Option C — Separate boards per world.** Pros: chess-clean comparisons.
  Cons: splits a small early population; overkill for non-zero-sum
  single-player scores; makes switching mid-run awkward to classify.
- **Option D — One main board + opt-in Pro-only "pure" prestige boards**
  (Forza hardcore pattern), entries qualifying only if the whole run stayed in
  the Pro world. Pros: gives Expert players the "compare like with like" venue
  they demonstrably want (finding 5) without demoting Easy; composes with B.
  Cons: small extra surface; needs the per-run world snapshot.

**Recommendation (not a decision):** B + D — one main board with a
prestige-neutral world badge, plus an opt-in Pro-pure board, backed by the
finding-11 per-run snapshot. A is viable only for purely casual/local boards;
C is deferred to MP.

### Open fork: MP treatment (post-MVP async multiplayer under switch-anytime)

- **Option A — Single mixed ranked pool with tuning** (CoD/Fortnite-mix
  pattern): rely on the D3 envelope to keep the gap bounded, show world
  badges. Pros: one population, fastest matchmaking. Cons: the aim-assist
  record (finding 7) shows a *deliberate, measurable* capability gap in one
  shared ranked pool produces a permanent fairness controversy that tuning
  never closes — and D3's 52–57% head-to-head is exactly such a gap.
- **Option B — Match/segregate by world** (Halo/XDefiant input-queue pattern):
  Easy queue, Pro queue, mixed opt-in queue. Pros: clean fairness story;
  proven pattern. Cons: splits population; frames the worlds as incompatible.
- **Option C — Co-equal rated ladders per world (chess model):** each world
  has its own rating/ladder/championship framing; ratings are independent;
  players may hold both; cross-world play is always possible as
  unrated/friendly (and later as explicit mixed events). Pros: strongest
  documented precedent where neither ladder is "lesser" (finding 8 — blitz
  specialists respected, per-format world championships); naturally absorbs
  switch-anytime (a switch just means you're playing the other ladder today);
  aligns with D1's "two worlds" branding — two ladders literally *are* two
  worlds. Cons: two leaderboard economies to maintain; classical-style
  prestige drift toward the Pro ladder is likely and must be countered by
  co-equal presentation and rewards.
- **Interaction with D2 (settled, implementation input):** rated MP units
  (a season, a cup entry) should snapshot the world at entry; switching
  mid-competition should follow the BG3 one-way-flag pattern (finding 2) —
  never blocked, but the entry is re-badged (e.g. to "mixed") rather than
  silently keeping its original classification.

**Recommendation (not a decision):** C as the target MP architecture, with
unrated cross-world friendlies from day one and B's mixed opt-in queue as the
bridge for players who explicitly want cross-world ranked; avoid A for ranked
play. Reuse the finding-2 re-badging rule for mid-competition switches.

### NEW fork: World naming & branding (neither world reads as the lesser game)

Evidence base: findings 3, 4, 9. Constraints: German UI primary, IP-clean,
names must survive marketing use (D1 brands the tiers as two worlds).

- **Option A — Depth-scale names** ("Easy/Pro", "Lite/Full", "Quick/Expert"
  surfaced to players). Pros: instantly understood. Cons: exactly the
  stigmatized hierarchy the evidence warns about; FM Touch shows "the
  accessible edition" branding becomes "the lesser edition" perception
  (finding 9). Not viable for D1's intent.
- **Option B — Purpose/experience-framed pair** (the "Give Me Story" pattern):
  names describe what the player wants from a session, e.g. the
  matchday-feel world vs. the deep-control world (illustrative EN/DE
  placeholder pairs, not proposals: "Matchday" / "Spieltag" world vs
  "Masterplan" / "Taktikzentrale" world). Pros: strongest evidence for
  stigma-free self-selection (finding 4); maps cleanly onto the onboarding
  question ("what do you want your week to feel like?"). Cons: needs careful
  copy so the deep world doesn't sound like "the real game" by implication.
- **Option C — Role/identity-framed pair** (Fire Emblem "Classic/Casual"
  pattern done right): both names are prestigious manager identities — e.g.
  the touchline-instinct coach vs. the whiteboard tactician. Pros: identity
  framing turns the choice into self-expression, fits the Anstoss heritage
  (the "stove" is itself an identity artifact); both can be marketed as
  first-class fantasies. Cons: Fire Emblem shows the "Classic" slot can still
  accrue "true way to play" prestige; requires deliberate co-equal marketing.
- **Copy rules regardless of option (Celeste lesson, finding 3):** never
  "recommended for beginners"/"we recommend the full experience"; frame as
  needs/preference ("fits how you want to manage"); internal tier names
  Quick/Standard/Expert stay internal and never appear in player-facing copy;
  no reduced-edition language ("streamlined", "lite") in the Easy world's
  self-description; rewards/achievements never revoked or discounted for
  world choice (Celeste/Hades pattern), with any Pro-exclusive prestige
  expressed as *additional* opt-in boards (competitive-labeling Option D),
  not as devaluation.

**Recommendation (not a decision):** B or C (or a B-name with C-flavored
copy); reject A. Run the eventual name pair through the GD-0015/ADR-0007
IP-clean check and a DE-first copy test, since the German pair is the primary
surface.

### NEW fork: Onboarding presentation of the world choice

Current state: one silent competence-framed experience question
(Newbie/Bit/Veteran) silently maps to tier+difficulty (GD-0012; finding 10).
D1/D2 are decided; the open question is presentation.

- **Option A — Keep the silent question unchanged**, worlds surface only in
  Settings. Pros: zero FTUE cost; GD-0012 timing contract untouched. Cons:
  wastes the two-worlds branding moment; competence-framed answers are the
  stigma anti-pattern; players never learn switching exists until they dig.
- **Option B — Explicit two-world choice step** with equal-weight illustrated
  cards replacing the experience question. Pros: worlds become the identity
  moment; equal visual weight = co-equal framing (Fire Emblem/GoW pattern).
  Cons: risks a second decision screen and violating the ≤2-required-screens
  / <60s contract if not one-tap; conflates world (UI depth) with difficulty,
  which GD-0012 currently maps separately.
- **Option C — Reframe the existing question's answers as experience-goal
  statements that name the worlds** (still one tap, still silently mapping to
  tier+difficulty+verbosity): answers describe the desired experience ("I
  want quick matchdays" → Easy world/Quick; "give me full control" → Pro
  world/Expert; middle answer → Easy world/Standard), with a persistent
  "you can switch worlds anytime" line and unchanged veteran-skip flow.
  Pros: keeps the 60s budget and the silent mapping (GD-0012 intact); adopts
  purpose-framing (finding 4); makes D2 discoverable from minute one; the
  Celeste copy lesson is applied at the highest-leverage spot. Cons: copy
  must avoid implying the middle answer is "Normal" and the others deviant.

**Recommendation (not a decision):** C. It upgrades framing without touching
the ratified FTUE shape, timing targets or the ≤2-decision-screen rule.

### NEW fork: Switch UX ceremony (implementing decided D2)

- **Option A — Settings toggle only** (current draft: Settings → Assistance /
  Game Settings). Pros: minimal. Cons: switching is a headline D1/D2 feature
  and the FM-Touch lesson says the lighter surface must not feel like a
  buried concession; discoverability of per-area overrides
  (progressive-disclosure-ui §10) suffers.
- **Option B — First-class world switcher**: a named surface (profile/Club
  sheet entry per ADR-0008's Club/More bottom sheet) showing both worlds as
  equal cards, a "what changes" preview per area (tactics, training, finance,
  stadium…), the explicit non-destructive guarantee ("your tactic and all
  settings are kept; Auto-Coach only proposes, never overwrites" —
  progressive-disclosure-ui §4/§7), instant apply, instant undo, and entry
  points to per-area overrides. Pros: makes D2 marketable; the
  never-overwrite guarantee is exactly the reassurance switchers need; the
  preview answers "what am I signing up for" that a silent toggle can't.
  Cons: one more designed surface; preview content must stay in sync with the
  D4 full-sweep area matrix.
- **Option C — Adaptive switch prompts**: reuse the onboarding safety-net
  struggle detector (onboarding-and-tutorial §10: 5+ losses on Easy, ignored
  CTAs) plus a mastery signal (e.g. sustained manual overrides of Auto-Coach
  proposals) to *offer* — never force — a world/tier change via an Assistant
  inbox message. Pros: matches the "offer help, don't judge" pattern the
  evidence favors; symmetric (suggest Pro to masters, not only Easy to
  strugglers) which itself de-stigmatizes. Cons: prompt fatigue risk; tone
  must pass the Celeste gatekeeping test in both directions.

**Recommendation (not a decision):** B + C together, with A retained as the
low-level setting underneath. Mid-run switches in the roguelite are recorded
on the run record (finding 11) so competitive surfaces can badge them; the
switcher itself never warns or shames — the badge is the only competitive
consequence, per the labeling fork above.

### Stress-evidence for ratified decisions (not re-opened)

- **D2:** unanimously supported by the external record (finding 1); the only
  competitive cost is solved by per-unit snapshots + re-badging (findings 2,
  11), not by locks.
- **D3:** the racing and crossplay records (findings 5–7) show that a
  deliberate, measurable edge for one population inside one shared ranked
  pool is the single most reliable generator of fairness controversy in
  modern multiplayer. This does not argue against the bounded envelope — it
  argues that D3's envelope must be paired with the labeling/ladder choices
  above wherever results are comparative, and it reinforces the floor
  ("EASY never dominated") as the load-bearing half of the decision.
- **D1:** the FM Touch trajectory (finding 9) is the cautionary precedent for
  two-worlds branding: the moment marketing ranks the worlds by depth
  ("most in-depth" vs "most accessible"), the community ranks the players.
  Co-equal branding is a hard requirement for D1 to land, not a nicety.

## Future-scope notes (classified future-scope)

- Question: optional **commitment flag** ("Ironman-style" pro-world-only or
  no-Auto-Coach run flag) as a *later* prestige feature riding on the same
  per-run snapshot — clearly opt-in, BG3-style one-way re-badge on abandon.
  Not needed for MVP; do not conflate with the default switch-anytime UX.
- Question: hosted leaderboards and any MP ladder need identity-access to
  separate "current preference" from "competitive history" (finding 11) —
  schema input for the eventual league-orchestration/identity-access ADRs.
- Question: whether mixed cross-world *rated* events (beyond friendlies) ever
  ship, and if so whether they use envelope-informed seeding instead of
  handicaps — depends on the tier-parity calibration work in
  [[tier-parity-measurement-calibration-2026-07-01]].
- Unverified externals to close before any ADR cites them as fact: exact
  current Forza leaderboard assist rules, GT7 Sport Mode written regulations,
  iRacing rookie assist policy, current F1 Esports assist rulebook, and
  primary Madden/EA FC competitive-settings documentation (all graded medium
  or lower above).
- German-first naming exploration for the two worlds (IP-clean per GD-0015 /
  ADR-0007, evocative-but-clearly-not-real) is copywriting work outside this
  packet; this note only fixes the framing principles.
