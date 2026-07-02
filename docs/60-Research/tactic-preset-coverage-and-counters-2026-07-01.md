---
title: Tactic Preset Library - Coverage, Counters, Meta-Viability (Dual-Mode)
status: draft
tags: [research, dual-mode]
context: tactics
created: 2026-07-01
updated: 2026-07-01
type: research
binding: false
linear:
sourceType: external
related:
  - [[raw-perplexity/raw-tactic-preset-coverage-and-counters-2026-07-01]]
  - [[../50-Game-Design/tactics-system]]
  - [[../50-Game-Design/GD-0004-tactics]]
  - [[../50-Game-Design/progressive-disclosure-ui]]
  - [[tactics-and-formations]]
  - [[anstoss-series-deep-dive]]
  - [[ai-manager-behaviour]]
  - [[../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]]
---

# Tactic Preset Library - Coverage, Counters, Meta-Viability (Dual-Mode)

## Question

If easy mode's tactic surface is a small preset library ("3 up front, 5 in
defence" + aggressiveness), how many presets does it need, how should
counters and aggressiveness map onto the drafted 5-band mentality +
pressing model, how are presets kept competitively viable against pro-mode
hand-tuning, and how does the 3-layer opposition-template system
(ADR-0080, [[tactics-and-formations]] §9) serve easy mode ("Recommended
Counter") versus pro mode?

## Summary

Balance literature (Sirlin, Schreiber) says small option sets stay healthy
when every option is non-dominated, counters are **soft** (percentage
advantages, not shut-outs), and the choice is not decided at pick time.
Hattrick is the strongest genre proof: a fixed set of 7 tactics + Normal
has stayed non-dominated for two decades because every tactic
**redistributes** chance types and pays an explicit ratings cost, with a
trained tactic-skill level gating the payoff. Anstoss proves the coarse
"stove" surface works but also warns twice: its community meta collapsed
to a narrow "normal→offensiv" band, and RNG-testing exposed dead options
that did nothing — a tiny preset set must have every option carry real,
tested weight. FM shows the opposite failure: an unconstrained pro editor
plus non-adaptive AI produced downloadable super-tactics (FM-Arena tested
4,671 tactics over 9M matches per patch); crucially, FM-Arena's own
control experiment found tactic spread among reasonable tactics compresses
to ~5% when squad quality dominates, which shows a bounded pro tactical
edge is empirically achievable and measurable. For FMX this converges on:
6-8 hand-tuned presets forming a soft-counter cycle that spans the 8
opposition archetypes, an easy-mode aggressiveness dial that reuses the
existing 5-band mentality (optionally coupled with pressing), preset
viability enforced by an FM-Arena-style calibration harness plus the
already-drafted predictability penalty (§11) and familiarity model, and
the ADR-0080 selector serving both modes — one-button "Recommended
Counter" (`candidateScope: 'quick'`) for easy, full template library for
pro.

## Findings

1. **Intransitive (RPS) structures need ≥3 options and prefer soft
   counters; dominance is the failure mode.**
   - Finding: A true counter cycle needs at least 3 mutually-countering
     options; balance requires "many meaningful, non-dominated options"
     and explicit removal of dominant moves. Hard counters are only
     acceptable when the countered side keeps meaningful play; weighted
     RPS that decides the result at selection time makes the rest of the
     match "going through the motions".
   - Source: Sirlin, *Balancing Multiplayer Games Part 1*
     (sirlin.net/articles/balancing-multiplayer-games-part-1-definitions);
     Sirlin GDC 2009 handout; Schreiber, *Game Design Concepts* Level 16
     (gamedesignconcepts.wordpress.com); *Doing RPS Right*
     (lawofgamedesign.com); *In Defense of Hard Counters in RTS Games*
     (gamedeveloper.com).
   - Confidence: high.

2. **Hattrick is the genre-proven model for a small non-dominated tactic
   set: redistribute, don't add.**
   - Finding: Hattrick's 7 special tactics + Normal stay balanced because
     each tactic (a) *redistributes* chance types rather than adding raw
     strength (Attack on Wings converts 34-52% of central attacks to wing
     attacks, scaling with a trained tactic-skill level), (b) pays an
     explicit ratings penalty (weaker wing defence, weaker midfield), and
     (c) only pays off under stated preconditions (Counter-attacks
     requires much stronger defence than the opposing attack). Normal is
     the community-recommended choice for ≥50% of matches — i.e. specials
     are situational tools, not defaults. Counters are conditional and
     rating-based, not a hard tactic-vs-tactic RPS table.
   - Source: wiki.hattrick.org/wiki/Tactics; Hattrick engine
     reverse-engineering paper (arxiv.org/pdf/2504.09499); *The ABC of
     Tactics in Hattrick* (scribd.com/document/953023823).
   - Confidence: high.

3. **Anstoss's coarse dial surface worked, but its tiny option set still
   developed a mild dominant band and contained dead options.**
   - Finding: Anstoss's tactic surface is three dials — Ausrichtung (7
     steps, Abwehrriegel→Brechstange), Einsatz (5 steps), Härte (5 steps)
     — with community-reconstructed symmetric trade-offs (Brechstange
     ≈ -40% defence / +22% attack; high Einsatz/Härte cost cards and
     freshness, interacting with referee strictness). Yet the community
     meta collapsed to "normal → kontrollierte Offensive → offensiv" with
     Einsatz normal/rauh ("other settings bring red cards or heavy
     defeats"), and seed-controlled fan testing found several options had
     **no measurable effect** (Positionstreue, "Schießt aus allen Lagen!",
     low-level Pressing, Abseitsfalle at low skill). Walkthroughs state
     "Eine immer geltende optimale Taktik gibt es bei ANSTOSS 2 nicht" —
     squad-fit mattered more, with up to 20% penalties for shapes the
     squad cannot support.
   - Source: anstoss-zone.de/anstoss3/a3_tipps.php;
     pcgamesdatabase.de/artikel.php?aid=222 (100 Tipps & Tricks);
     anstoss-juenger.de topics 159 + 2879 (RNG tests);
     forum.anstoss-online.de Guides #5; mogelpower.de Lösung id=17145.
     (All community reconstructions, not developer docs.)
   - Confidence: medium (consistent across several independent fan
     sources, but no primary developer documentation).

4. **FM's super-tactic problem: an open pro editor + non-adaptive AI
   produces downloadable exploits that outperform regardless of squad.**
   - Finding: Documented plug-and-play meta tactics include "BROKEN FM20"
     (gegenpress 4-3-3 with double Mezzala/Inside-Forward overloads, still
     dominant in FM23), "ZaZ Blue 4.0" (FM23 4-1-5 with inverted
     wing-backs, called "a bit of a cheat code" usable with any team) and
     older near-post corner exploits. Community analyses attribute them to
     engine blind spots (under-penalised constant pressing, central
     overload defending, rigid set-piece marking) and to AI managers that
     react with incremental tweaks instead of systemic counters. The
     FM-Arena testing league industrialises the search: 4,671 tactics /
     9,023,600 simulated matches for one FM24 patch alone.
   - Source: reddit.com/r/footballmanagergames thread 117ekxt ("most
     broken tactic of FM23"); sortitoutsi.net/fmtv/video/33635;
     fm-arena.com/table/30-patch-24-4-0-db3-0; YouTube tactic-test videos
     (FQw6yf-HwKo, fgE52eAzYxE). SI's own framing of causes could NOT be
     pinned to primary dev-blog URLs — treat "SI said" claims as
     unverified.
   - Confidence: high for the tactic examples and FM-Arena scale; low for
     paraphrased SI statements.

5. **FM-Arena's control experiment quantifies that tactic edge is bounded
   by squad quality — direct evidence a 5-15% pro cap is realistic.**
   - Finding: With equal test squads, three well-regarded community
     tactics scored 63 / 56 / 49 points (a ~30% spread). When the tested
     team's players were boosted to top-club level, the same three tactics
     converged to ~100 / 98 / 95 points (~5% spread): "an advantage in the
     players' quality neglects any weakness in your tactic." So even in
     FM's unbounded editor, the *achievable* tactic-choice edge between
     sensible tactics compresses sharply as squad-quality deltas grow —
     the large exploit gaps appear between hand-optimised exploits and
     naive setups at equal squads.
   - Source: fm-arena.com/thread/8922-understanding-the-results-of-fm-arena-tactic-testing.
   - Confidence: high (primary published experiment, though single-site
     methodology).

6. **Shipped "recommended counter" systems work when they are soft,
   reasoned and non-exclusive.**
   - Finding: Effective counter-hint precedents (Pokémon type chart, Fire
     Emblem weapon triangle, FM assistant advice, EA FC D-pad game plans,
     OSM community counter tables) share properties: the counter is a
     modest percentage advantage, it is clearly telegraphed with a *reason*
     ("deeper line because of their pace"), and it is presented as one of
     2-3 options rather than a single "best" answer. Hidden counters feel
     unfair; single prescribed hard counters collapse depth. OSM shows the
     demand side: with tiny option sets, communities build formation-vs-
     formation counter tables themselves if the game does not.
   - Source: remptongames.com (Cut, Crush and Cover pt 2);
     gamedeveloper.com hard-counters piece; r/gamedesign thread a3h0fw;
     OSM/EA FC specifics are synthesis-level without a pinned primary URL.
   - Confidence: medium.

7. **Curated preset sets in shipped games cluster at 4-8 per context.**
   - Finding: EA FC ships ~5 D-pad game plans (Ultra-Defensive →
     Ultra-Attacking); Hattrick has 7 specials + Normal; OSM/Top Eleven
     expose ~5 formations/styles; card games surface a handful of labelled
     archetypes (aggro/midrange/control/combo). Choice-overload / Hick's
     law-style UI guidance favours small, strongly-labelled,
     visually-distinct sets, with advanced customisation gated behind an
     opt-in. FMX's drafted Quick tier (5 starter presets,
     [[tactics-and-formations]] §6.7) already sits inside this band.
   - Source: raw capture Query 4 (multiple secondary sources);
     gamedesignskills.com/game-design/combat-design; vault:
     [[tactics-and-formations]] §2.1 competitor table.
   - Confidence: medium (convergent but partly common-knowledge level).

8. **The vault already contains the three preset-viability mechanisms the
   evidence calls for; they need to be wired together, not invented.**
   - Finding: (a) The tactical predictability penalty
     ([[../50-Game-Design/tactics-system]] §16 / [[tactics-and-formations]]
     §11: up to 5% offensive penalty for >50% single-tactic usage;
     counter-templates cancel half) is exactly the anti-super-tactic
     mechanism FM lacks by default; (b) the familiarity model (§6.5, floor
     20, switch modifier) is SI's own documented anti-plug-and-play lever;
     (c) ADR-0080's selector already carries `candidateScope: 'quick' |
     'standard' | 'expert' | 'ai-full'`, so a deterministic one-button
     "Recommended Counter" for easy mode and a full library for pro mode
     are the *same* contract at different scopes — no new architecture is
     required for dual-mode counter-play.
   - Source: internal — [[../50-Game-Design/tactics-system]],
     [[tactics-and-formations]],
     [[../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]].
   - Confidence: high.

## Inputs For Decisions

### D1 — Two modes vs three tiers vs two-modes+override

- Evidence input: the preset-library surface the mission describes for
  easy mode **already exists as the drafted Quick tier** (5 locked
  presets + Mentality 5-band + "Recommended Counter" + 3 shouts,
  [[../50-Game-Design/tactics-system]] §13). Genre precedent (Anstoss's
  three dials, Hattrick's 7 tactics, OSM/Top Eleven) confirms a coarse
  preset surface is a complete, playable tactic mode on its own — not a
  degraded pro mode. So for tactics specifically, "easy mode" is a
  renaming/repackaging question, not a redesign question: the two-mode cut
  would map easy≈Quick and pro≈Expert, with Standard's fate being the real
  fork.
- Evidence against dropping the middle tier silently: FM's ecosystem shows
  most engaged-but-not-expert players live between the extremes (FM
  Mobile/Touch depth cut, [[tactics-and-formations]] §2.2); a per-area
  override (D1 option C) is the pattern the vault already flagged as
  future-scope in [[../50-Game-Design/progressive-disclosure-ui]] §10.
- Recommendation (recommendation, not a decision): whatever the mode
  count, keep the easy tactic surface = curated preset library + one
  aggressiveness control + Recommended Counter; it is genre-proven and
  already drafted. If two modes are chosen, treat Standard's tactic
  surface as pro-mode's default view rather than deleting it.

### D2 — Mode permanence

- Evidence input: Hattrick's tactic-skill level and FMX's own familiarity
  model are **time-investment locks**: a player who switches to pro
  mid-save to hand-tune a tactic and switches back does not instantly gain
  the pro edge, because familiarity (floor 20, 8/week cap) and the
  predictability penalty apply regardless of mode. This weakens the case
  for hard mode-locking on balance grounds alone: the simulation already
  taxes opportunistic switching.
- FM-Arena evidence cuts the other way for *competitive* play: imported
  hand-tuned tactics are the single biggest known balance hole in the
  genre. If easy-mode players can import share-code super-tactics
  ([[tactics-and-formations]] §6.8 limits import to Expert tier — worth
  preserving), or freely toggle to pro for one match, competitive parity
  claims become untestable.
- Recommendation (recommendation, not a decision): free switching in solo
  play (engine taxes handle it); in competitive/challenge contexts, a
  declared-at-entry mode (or at minimum "declared tactic source: preset vs
  hand-tuned vs imported") is what the FM exploit history argues for.

### D3 — Parity target

- Evidence input (strongest external number in this packet): FM-Arena's
  boost experiment (Finding 5) shows tactic-choice spread among reasonable
  tactics is ~30% between equal squads but compresses to ~5% when squad
  quality dominates. Two implications: (a) a bounded pro edge of ~5-15% is
  empirically the natural size of "good tactic vs decent tactic" once
  exploits are excluded — it does not require exotic engineering, it
  requires **excluding exploits** (calibration harness + AI counter-
  adaptation + predictability penalty); (b) parity must be defined
  per-matchup at equal squad strength, because squad quality otherwise
  masks the measurement.
- Soft-counter literature (Finding 1) adds a shape constraint: whatever
  the target, preset-vs-preset and preset-vs-hand-tuned modifiers should
  be percentage-band ("soft") advantages; a hand-tuned tactic that *hard*
  counters a preset would make easy mode non-viable even at 10% average
  edge.
- Recommendation (recommendation, not a decision): express D3 as a
  testable calibration invariant — e.g. "in an FM-Arena-style equal-squad
  round-robin, the best hand-tuned tactic beats the best-fitting preset by
  at most X% expected points, and no preset falls below Y% of the preset-
  pool mean in any matchup" — with X set by Nico's D3 choice (5-15% band
  matches the external evidence) and enforced in the calibration harness.

### D4 — Sweep scope

- Evidence input: FM-Arena demonstrates that the community will run
  millions of matches to find the meta whether or not the studio does;
  Anstoss shows even tiny option sets ship dead options when untested
  (Finding 3). The only defence is to run the sweep ourselves: an
  automated equal-squad preset round-robin (each preset vs each preset ×
  each opposition archetype × aggressiveness bands, seeded/deterministic
  per D8) is cheap given the deterministic engine and directly produces
  the soft-counter matrix and the D3 invariant measurements.
- Recommendation (recommendation, not a decision): include "preset-library
  round-robin + counter-matrix calibration" in the sweep scope as a
  standing CI-adjacent harness (ties to the existing gameplay-calibration
  ownership note), not a one-off study.

### NEW-preset-count — How many easy-mode presets

- Options with evidence:
  - **A. Keep 5** (current draft §6.7): matches EA FC (~5 game plans) and
    the mentality axis; but the drafted 5 are mostly a
    defensive↔attacking spectrum (Park-the-Bus / Counter / Solid /
    Balanced / High-Press) — a 1-dimensional line, not a cycle. Under
    Finding 1 a pure spectrum risks a dominant band exactly like
    Anstoss's "normal→offensiv" collapse (Finding 3).
  - **B. 6-8 presets spanning a style cycle** (recommended): add ~2-3
    style-differentiated presets (e.g. wide/flank-overload 3-4-3 or 4-4-2
    wide; possession/patient 4-2-3-1; direct/target 4-4-2) so that the
    library covers counters to all 8 opposition archetypes
    ([[tactics-and-formations]] §9.1) and forms at least one intransitive
    triangle (press beats possession-build, direct/long beats press,
    possession beats deep-block/direct — mirroring Hattrick's
    AoW/AIM/CA/Pressing trade-off web). 6-8 stays inside the shipped-game
    4-8 band (Finding 7) and inside choice-overload guidance.
  - **C. 10-12 presets**: better archetype coverage but exceeds every
    shipped easy-surface precedent found; pushes easy mode toward being a
    worse Standard tier.
- Recommendation (recommendation, not a decision): Option B — 6-8, each
  preset authored with (a) an explicit "strong vs / weak vs" pair of
  opposition archetypes, (b) a squad-fit requirement (Anstoss/Hattrick
  precedent: presets should key off squad strengths, e.g. the flank preset
  needs wingers — the availability warnings already drafted for Quick-tier
  player display support this), and (c) zero dead options — every preset
  must be the best answer to something in the calibration matrix.

### NEW-aggressiveness-mapping — What the easy-mode aggressiveness dial controls

- Context: the draft gives Quick tier Mentality only (5 visible bands / 7
  internal, [[tactics-and-formations]] §6.3); pressing intensity is baked
  into each preset. Anstoss's surface had *three* dials (Ausrichtung /
  Einsatz / Härte) with distinct costs (goals-vs-goals trade-off; fitness;
  cards).
- Options with evidence:
  - **A. Mentality-only (as drafted)**: simplest; but "aggressiveness" in
    Nico's brief connotes intensity/physicality, which mentality alone
    does not express; Anstoss players distinguished the dials and the
    distinction carried real trade-offs.
  - **B. One macro "Aggressiveness" dial** mapping each of the 5 bands to
    a (mentality band, pressing step) pair per preset — e.g. band 4 on the
    High-Press preset = Attacking + High press, band 4 on Park-the-Bus =
    Balanced + Medium press. Keeps one control, honours the brief, and the
    trade-off cost (stamina drain from pressing per §8 shout mechanics,
    card risk later) makes high aggression non-dominant, per
    Hattrick-Pressing and Anstoss-Einsatz evidence.
  - **C. Two dials (mentality + intensity)**: closest to Anstoss, still
    tiny; but doubles the easy-mode decision surface and the calibration
    matrix.
- Recommendation (recommendation, not a decision): Option B. It preserves
  the 5-band internal model unchanged (the dial is a per-preset lookup
  table into existing team instructions — no engine change) and gives the
  seeded-variance-friendly "one lever, real trade-off" feel Nico's brief
  asks for.

### NEW-counter-matrix-authoring — Emergent vs authored soft-counter matrix

- Options with evidence:
  - **A. Purely emergent** (counters arise only from engine physics/zone
    weights): most simulationist, but FM proves emergent-only balance
    ships blind spots that communities industrially exploit (Finding 4).
  - **B. Authored soft-counter matrix** (explicit bounded style-vs-style
    modifiers): guarantees the cycle but reads as "gamey" and fights the
    match-engine's simulation identity.
  - **C. Emergent + calibrated + capped (hybrid)**: counters emerge from
    the engine, the round-robin harness (D4 input) *measures* the matrix,
    authoring tweaks preset parameters (not matchup multipliers) until the
    matrix is a soft cycle within the D3 band. The predictability penalty
    §16 and counter-templates remain the only explicit matchup
    multipliers.
- Recommendation (recommendation, not a decision): Option C — it is the
  Hattrick pattern (numeric engine, no rule-based RPS, but every tactic's
  parameters tuned so trade-offs hold) and it keeps ADR-0080/D8
  determinism untouched.

### Recommended Counter across modes (feeds D1/D3, uses ADR-0080)

- Evidence input: ADR-0080's `SelectOppositionTemplateForMatchQuery`
  already scopes candidates (`'quick' | 'standard' | 'expert' |
  'ai-full'`); the drafted Quick UX (§9.5) already specifies the
  one-button "Recommended Counter" auto-applying the best layer-2
  sub-archetype. Design guidance from Finding 6 adds three requirements:
  (1) the recommendation must state its *reason* one line ("They press
  high — this plays direct behind it"), (2) in pro mode show 1-3 suggested
  templates with trade-offs, never a single "best" (matches §9.6's
  "Suggested 1-3 + reason" Expert row), and (3) the easy-mode auto-apply
  should be genuinely good but not strictly optimal — e.g. it picks the
  archetype-correct counter deterministically while pro players can pick
  the sharper sub-archetype for the specific opponent, which *is* the
  bounded pro edge D3 wants, delivered through information depth rather
  than raw multipliers. The counter-template's existing effect (cancels
  half the predictability penalty, §16) makes the button mechanically
  meaningful for easy-mode viability without new mechanics.

## Future-scope notes (classified future-scope)

- Question: should the calibration harness publish its preset matchup
  matrix to players (transparency à la Pokémon type chart) or keep it
  discoverable? Publishing supports easy-mode trust; hiding supports
  simulation identity. Defer until the harness exists.
- Question: community share-code tactics (Expert import, ADR-0016) in
  competitive contexts — FM-Arena-style community optimisation will
  eventually find our engine's blind spots; a "verified/curated pack only"
  flag for competitive seasons is likely needed post-MVP.
- Question: per-preset squad-fit scoring ("this preset suits your squad
  87%") as the easy-mode analogue of pro role-impact analysis — natural
  Phase 2 extension of the availability-warning surface.
- Question: whether AI managers should learn counter-preferences against
  *the player's* overused preset beyond the flat §16 penalty (true arms
  race, D4 ai-manager-behaviour extension) — deferred; interacts with
  difficulty perception for easy-mode players.
