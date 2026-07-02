---
title: In-Match Live Controls per Mode — Gating the Live Kit
status: draft
tags: [research, dual-mode]
created: 2026-07-01
updated: 2026-07-01
type: research
binding: false
linear:
sourceType: external
context: [match, tactics]
related:
  - [[raw-perplexity/raw-in-match-controls-tier-gating-2026-07-01]]
  - [[../50-Game-Design/GD-0025-in-match-controls]]
  - [[../50-Game-Design/GD-0035-live-coaching-intervention-and-pause-rules]]
  - [[../50-Game-Design/GD-0004-tactics]]
  - [[../50-Game-Design/progressive-disclosure-ui]]
  - [[../10-Architecture/09-Decisions/ADR-0072-in-match-control-seam]]
  - [[../10-Architecture/09-Decisions/ADR-0087-live-match-intervention-buffer-and-pause-vote]]
  - [[in-match-controls-and-presentation-2026-06-03]]
---

# In-Match Live Controls per Mode — Gating the Live Kit

## Question

GD-0025 ships **one** live-control tier at MVP (subs · 4 mentality presets ·
formation swap among pre-saved shapes · 3 cooldown shouts · 3 speeds + free
pause) and explicitly reserves per-tier gating. When the permanent easy/pro
mode split lands: what should easy vs pro see and do **during** a match, does
pro get *more live levers* or *the same kit plus deeper pre-match tactics*, and
does live-kit asymmetry break the D3 parity requirement (easy players must
remain competitively viable) — all without touching the deterministic
intervention contract (ADR-0072 `InterventionCommand`/`ExecutionBinding`,
ADR-0087 buffer caps)?

## Summary

The strongest external evidence says the live match layer is the **cheapest
place in the whole game to keep the modes at parity** — provided the shout
channel is handled carefully. FM community mechanism testing found that manual
live control vs letting the AI run the match produces statistically identical
xG and goals **except** for the touchline-shout/morale channel, which testers
call "essential" at a ~15–20 sim-minute cadence and which is fully delegable
to a good assistant. FM's own product ladder (desktop → Touch/Console →
Mobile) cuts team talks, the full shout palette and the data tablet as it goes
down-market, and the community reads that as a pace/depth trade, not a broken
competitive tier. Anstoss precedent puts the easy live kit at "subs + coarse
team-level tactic change, watch the rest"; mobile live-manager games
(Top Eleven) bound the live-attendance edge to fixed, discrete bonuses. Total
War's auto-resolve is the cautionary tale: when the assisted path
under-performs manual play too hard, players feel *forced* into
micro-management — exactly the D3 failure mode. Conclusion (recommendation,
not a decision): give **both modes the same five-group live kit** — it is
already thin, discrete, cooldown-bounded and capped per acceptance point by
GD-0035, so nobody can out-APM anyone — and let pro's extra depth live in
*what the levers load* (deeper pre-saved `TacticSnapshot`s), plus an optional
live auto-assistant for easy that keeps the shout channel at near-parity. The
ADR-0072/0087 contracts need zero change for any option examined.

## Findings

1. **Finding:** FM's Instant Result is not a neutral skip: an AI proxy (shaped
   by assistant attributes) performs team talks, substitutions and shouts, and
   in some implementations may tweak the human's tactic. The live-vs-instant
   edge therefore has no fixed sign — a strong assistant can *beat* a weak
   human, and vice versa. No SI or community study publishes a fixed
   percentage edge.
   **Source:** FM-Arena "Playing Games Vs Instant Result"
   (https://fm-arena.com/thread/18461-playing-games-vs-instant-result/);
   FM-Base "INSTANT RESULT : WARNING"
   (https://fm-base.co.uk/threads/instant-result-warning.143773/).
   **Confidence:** high (mechanism), medium (no quantitative edge exists —
   absence claim).
2. **Finding:** In FM's engine the measurable *live* edge concentrates almost
   entirely in the shout/morale channel: a 1–2-month community mechanism test
   reports "'Player Control' vs 'Holiday' shows identical xG and actual
   goals… Only real difference: team morale boost from 'Shouting'. Without
   shouting, manual control provides zero statistical advantage."
   **Source:** FM-Arena mechanism mega-test
   (https://fm-arena.com/thread/15288-some-mechanism-detailed-tests-it-took-me-1-2-months/).
   **Confidence:** medium (single community test, large sample, one engine —
   directionally strong, not transferable as an exact number).
3. **Finding:** The shout channel itself is high-value but *delegable*:
   FM-Arena testers call touchline instructions "essential… a huge advantage"
   at a ~15–20 sim-minute cadence, and explicitly recommend delegating them to
   an assistant with high Motivating/People-Management if the player does not
   want the chore. Shout guides add that shouts are contextual and can
   backfire (complacency/anxiety) — a risk/reward channel, not a pure buff.
   **Source:** FM-Arena "Touchline Shouts in FM"
   (https://fm-arena.com/thread/628-touchline-shouts-in-fm/); ZaZ Blue thread
   (https://fm-arena.com/thread/1831-zaz-blue-4-0/page-21/); Passion4FM shout
   guide
   (https://www.passion4fm.com/how-to-use-touchline-shouts-in-football-manager/).
   **Confidence:** medium.
4. **Finding:** The *tactical-depth* edge (the thing pro mode's deeper
   pre-match editor buys) is empirically bounded and squad-quality-dependent:
   in FM-Arena's equal-squad test league the gap between a top tactic and a
   clearly weaker one is ~7–14 points over a 38-game season (~6–12% of the 114
   possible points), shrinking to ~2–5 points when the squad is strong —
   "the better your players compared with your opponents, the less your
   tactic matters."
   **Source:** FM-Arena testing methodology note
   (https://fm-arena.com/thread/8922-understanding-the-results-of-fm-arena-tactic-testing).
   **Confidence:** medium.
5. **Finding:** Anstoss precedent for the easy live kit: matches are watchable
   presentations where the player "can exchange players, adapt tactics to new
   situations or weather conditions, but [doesn't] participate directly" —
   i.e. subs + coarse team-level tactic change, no per-player live
   instructions, no documented multi-option shout system.
   **Source:** MobyGames, Anstoss 2 entry
   (https://www.mobygames.com/game/4436/anstoss-2-der-fu%C3%9Fballmanager/).
   **Confidence:** high (for what is documented); Anstoss speed/pause
   specifics are unverified.
6. **Finding:** FM's own edition ladder is a live natural experiment in tier
   gating: desktop = full kit (talks, shout palette, mid-match role editing,
   data tablet); Touch/Console keeps subs + mentality + tactic editing but
   drops/automates talks, the full shout set and the dense data views; Mobile
   keeps subs + coarse mentality/tactic switch + speed/highlights only.
   Community verdict: down-ladder players lose min-max margin but "win and
   lose in broadly similar ways" — perceived as a pace trade, not a broken
   tier. (Exact Touch/Console shout removal is inferred from SI marketing +
   community threads, not an SI changelog.)
   **Source:** SI edition comparison
   (https://www.footballmanager.com/compare-games); r/footballmanagergames
   FM26 edition thread
   (https://www.reddit.com/r/footballmanagergames/comments/1oocgsv/).
   **Confidence:** high (ladder), medium (exact per-feature cuts).
7. **Finding:** Mobile live-manager genre pattern: live attendance yields a
   **bounded, fixed** advantage. Top Eleven grants a match-wide
   possession/team-play bonus for showing up once (it does not scale with
   continued presence) plus a small discrete live kit (tactic/formation/player
   changes, boosters); OSM/Soccer Manager are simulation-first with coarse
   live adjustment only; Retro Bowl has no live-manager layer at all.
   **Source:** Top Eleven official help
   (https://www.topeleven.com/old-site/help/); r/topeleven possession-bonus
   thread
   (https://www.reddit.com/r/topeleven/comments/9r71zf/how_does_the_possession_bonus_work_for_watching_a/).
   **Confidence:** high (Top Eleven), medium (OSM/Soccer Manager — weak
   primary sourcing).
8. **Finding:** Auto/assist-vs-manual over one simulation (Total War
   auto-resolve as the canonical case): designers tune the assisted path to
   "competent but not expert"; when it punishes too hard, players feel
   *forced* to micro-manage every battle and it becomes a top balance
   complaint and modding target ("auto-resolve viable for routine, manual
   keeps a clear edge at the top"). This is the exact failure mode an easy
   mode must avoid on matchdays. No dedicated GDC talk on bounding
   auto-vs-manual gaps was found; heuristics come from community/mod design
   statements.
   **Source:** Total War wiki Autoresolve
   (https://totalwarwarhammer.fandom.com/wiki/Autoresolve); CA forum
   "Let's Talk About Autoresolve…"
   (https://community.creative-assembly.com/total-war/total-war-warhammer/forums/8-general-discussion/threads/6939);
   rebalance-mod design statements
   (https://steamcommunity.com/sharedfiles/filedetails/?id=2858465652).
   **Confidence:** medium.
9. **Finding (internal synthesis):** FMX's ratified contracts already contain
   the parity instruments a mode split needs, unchanged: (a) GD-0035 buffer
   caps (≤3 subs, **1** tactical package, **1** shout per acceptance point,
   global ~8) mean live intervention *frequency* is bounded by sim-state
   boundaries, not player dexterity — a pro cannot out-APM an easy player;
   (b) shout cooldowns bound cadence identically for both modes; (c) ADR-0072
   C1–C6 make every intervention's effect a pure function of sim state, so a
   mode flag can never change *when or how* a command binds — only *which UI
   affordances emit commands* and *what a `TacticSnapshotRef` contains*.
   **Source:** [[../50-Game-Design/GD-0035-live-coaching-intervention-and-pause-rules]] §1/§3;
   [[../10-Architecture/09-Decisions/ADR-0072-in-match-control-seam]] invariants.
   **Confidence:** high (internal, ratified).

## Inputs For Decisions

### D1 — Two modes vs three tiers vs two modes + per-area override

- The live-match area gives D1 an unusually cheap answer: **the MVP kit
  already is the easy kit.** GD-0025 deliberately built a thin, discrete,
  one-handed surface; Anstoss's documented live kit (subs + coarse tactic
  change, Finding 5) is a strict subset of it, and FM Mobile's surviving live
  kit (subs + mentality + speed, Finding 6) matches it almost exactly. No
  *additional* simplification layer is evidenced as necessary for easy mode
  during the match.
- Conversely, no evidence supports giving pro *more live levers* (live
  per-player instructions, live role editing): FM's genre lesson (GD-0025
  rationale, reconfirmed by Finding 6) is that dense live matrices are a
  desktop artifact, and FM's engine data (Finding 2) shows live micro beyond
  shouts/subs/tactic-timing buys ~nothing measurable anyway.
- **Input:** for the `match` area specifically, "two modes sharing one live
  HUD" and "three tiers" collapse into the same thing — differentiation that
  matters lives pre-match (tactics depth) and in delegation defaults, which
  also makes a per-area override for Match nearly free.
- *Recommendation, not a decision:* treat the live kit as **mode-invariant**;
  spend the mode split on pre-match tactics depth and on assistant/delegation
  defaults, not on gating live levers.

### D2 — Mode permanence

- If the live kit is mode-invariant (D1 input above), switching modes
  mid-save has **zero live-match state cost**: no lever appears/disappears
  mid-competition, and the intervention log stays identically interpretable.
  Only delegation defaults (auto-shout on/off) and the pre-match editor depth
  change. FM players switch the equivalent surface (delegating shouts/talks
  to the assistant) per-match today (Finding 3).
- In competitive multiplayer the relevant lock is already ratified elsewhere:
  GD-0035's caps + pause budgets bind *both* modes identically, so a
  mid-competition mode switch confers no live-control advantage to police.
- *Recommendation, not a decision:* from the match context's perspective,
  "switch anytime" is safe; if Nico wants locks, they only need to bind the
  pre-match tactics surface, not the live kit.

### D3 — Parity target (does live-kit asymmetry break it?)

- **Bounding the live edge.** Decompose the live edge into its only three
  channels under the ratified kit: (1) shout usage, (2) reactive subs,
  (3) reactive mentality/formation timing. FM engine evidence (Finding 2)
  says channel (1) is the only one with a measured standalone statistical
  effect, and it is delegable at near-parity (Finding 3). Channels (2)/(3)
  are bounded structurally by GD-0035 caps and by shout/lever cooldowns —
  identical for both modes — so the residual pro live edge is *decision
  quality within the same small action budget*, not action quantity.
- **Quantification (best available):** with the shout channel equalised
  (easy auto-delegates, pro fires manually), FM data shows ≈0 measurable
  live-micro edge (Finding 2). The genuinely bounded-edge lever is pre-match
  tactical depth: ~6–12% of possible season points between strong and weak
  tactics at equal squads, shrinking to ~2–5 points with squad superiority
  (Finding 4). That lands naturally inside the D3 option-B band ("bounded pro
  edge ~5–15%") **without any special mechanism**, and supports option A
  (near-parity 90–95%) *for the live layer specifically* if easy's
  auto-assistant is tuned to ~90–95% of optimal shout/sub-timing value.
- **The one asymmetry that would break D3:** shipping easy mode *without*
  shouts and *without* an auto-shout assistant. That reproduces the FM
  finding in reverse — pro gets the only live channel that measurably scores
  (Finding 2/3) and easy cannot match it, an unbounded-feeling structural
  gap. Equally, tuning the easy assistant clearly below "competent" recreates
  the Total War auto-resolve trap (Finding 8): easy players feel forced to
  switch modes to stay viable, which defeats the mode's purpose.
- **Contract impact: none.** All options below keep ADR-0072's
  `InterventionCommand`/`ExecutionBinding`, determinism invariants C1–C9 and
  ADR-0087's buffer/pause machinery byte-identical. Mode only selects UI
  affordances and delegation policy; an assistant-issued shout is the same
  deterministic command with the same `commandId` ordering. The GD-0043
  `match.liveControl` harness (T1/T2 intervention sweeps, xG-swing metrics)
  can measure the easy-vs-pro live gap directly and becomes the enforcement
  tool for whatever D3 band Nico picks.
- Live-kit options (each honours the contract unchanged):
  - **L1 — Same kit, deeper payloads (recommendation, not a decision).**
    Both modes get all five GD-0025 groups. Pro's formation-swap slots hold
    hand-built deep `TacticSnapshot`s; easy's hold Auto-Coach/preset-built
    snapshots ("3 up front, 5 at the back" + aggressiveness maps to a
    mentality preset + generated snapshot). Easy defaults auto-shout
    delegation ON (visible, toggleable). Evidence: Findings 2/3/6/9. Risk:
    easy HUD shows a lever (3 distinct shouts) some casuals ignore —
    mitigable by presentation, see NEW fork below.
  - **L2 — Anstoss-faithful subset for easy.** Easy sees subs + mentality +
    speed/pause; the 3 shouts collapse into one "Anfeuern/Coach!" button or
    are silently assistant-run; formation swap hidden behind the mentality
    preset. Precedent: Findings 5/6. Risk: if the merged/auto shout is not at
    near-parity effectiveness, this is exactly the D3-breaking asymmetry
    above; also creates a second live-UX to maintain.
  - **L3 — Extra live levers for pro (advise against).** Live per-player
    instructions/role tweaks for pro only. Contradicts GD-0025's ratified
    "no live drag-editing" stance, multiplies `match.liveControl` calibration
    debt, and the evidence says it buys little measurable edge (Finding 2)
    while *feeling* obligatory — the worst parity optics for the least
    simulation value.

### D4 — Sweep scope

- If a parity sweep is run per area, **Match/live-control is the reference
  area to include first**: it is the only area whose parity is already
  instrumented (GD-0025/GD-0035 calibration slots measure effect latency, xG
  swing per intervention, buffer usage), so an easy-vs-pro gap here is
  cheaply measurable in T1/T2 sweeps before any other area's parity
  methodology exists.
- *Recommendation, not a decision:* whatever D4 scope is chosen, define the
  parity metric ("expected points delta per season between an optimal-play
  pro and an optimal-play easy manager with equal squads") on the match area
  first and reuse the definition elsewhere.

### NEW-easy-shout-surface — how easy mode exposes the shout channel

Discovered fork (feeds D1/D3; needs Nico): given shouts are the one live
channel with measured impact (Findings 2/3), easy mode must ship one of:

- **A. Full 3-shout kit, same as pro** — simplest, one UX, parity by
  identity; slight cognitive load for "did I win?" players.
- **B. One merged context-aware "Coach!" button** — Anstoss-flavoured; the
  game picks Encourage/Attack/Tighten from match state; keeps expressiveness
  with one thumb; needs a deterministic selection rule (pure function of sim
  state) to stay inside ADR-0072 C1.
- **C. Auto-delegation by default (assistant fires shouts), player can
  toggle** — FM-evidenced parity mechanism (Finding 3); assistant
  effectiveness becomes an explicit `match.liveControl` calibration value
  (recommend ~90–95% of optimal manual value, per the D3 band).
- *Recommendation, not a decision:* **A + C combined** — same visible kit,
  delegation default ON in easy, OFF in pro. B is a viable flavour layer on
  top of A later.

### NEW-live-assist-parity-number — the assistant effectiveness constant

Discovered decision input: if easy mode delegates any live channel, the
delegated performance level relative to optimal manual play (e.g. 0.9–0.95)
**is** the live half of the D3 parity target and should be decided/owned as a
GD-0043 `match.liveControl` calibration value with a harness metric, not left
implicit. (Evidence that this constant dominates outcomes: Findings 1/2/8.)

## Future-scope notes (classified future-scope)

- Question: should the pro-only depth ladder eventually include a *pre-armed
  conditional instruction* ("if trailing at 75', switch to snapshot X") that
  executes as a normal boundary-bound command? It stays inside ADR-0072 C1
  and would be a pro lever with zero live-APM asymmetry — worth researching
  when post-MVP tiers open.
- Question: watch-party spectators of an easy-mode manager — does the tactics
  pause (GD-0035) show the easy or pro tactics surface to co-viewers? Cosmetic
  today, relevant once shared-screen coaching lands.
- Anstoss 2/3 exact speed/pause and any "Anfeuern" mechanic remain
  undocumented in accessible sources; a German-language retro-press pass
  (PC Player/PowerPlay archives) could close this before final easy-mode
  flavour decisions.
- FM26's official Instant Result (Finding 1) will generate fresh community
  A/B data on live-vs-instant parity within a year — re-check FM-Arena before
  locking the assistant-effectiveness constant.
