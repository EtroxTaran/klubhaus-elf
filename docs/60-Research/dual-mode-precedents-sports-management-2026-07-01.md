---
title: "Dual-mode precedents in sports-management games (casual + deep in one product)"
status: draft
tags: [research, dual-mode]
created: 2026-07-01
updated: 2026-07-01
type: research
binding: false
linear:
sourceType: external
context: [tactics, match]
related:
  - [[raw-perplexity/raw-dual-mode-precedents-sports-management-2026-07-01]]
  - [[anstoss-series-deep-dive]]
  - [[progressive-disclosure-research]]
  - [[../50-Game-Design/progressive-disclosure-ui]]
  - [[../50-Game-Design/GD-0004-tactics]]
  - [[../50-Game-Design/GD-0016-mobile-ux-loop]]
  - [[../50-Game-Design/GD-0017-mvp-scope-and-mode-sequencing]]
---

# Dual-mode precedents in sports-management games

## Question

How have management games shipped a casual control layer and a deep control
layer in ONE product (or product family), what did the easy vs deep surface
expose, were both competitively viable, how were they received, and why were
some discontinued — as evidence for Nico's open decisions D1 (two modes vs
three tiers vs two-modes+per-area-override), D2 (mode permanence), D3 (parity
target) and D4 (sweep scope)?

## Summary

The genre's strongest precedents split into three packaging patterns. (1)
**Separate SKUs** (Football Manager full/Console/Touch/Mobile; Motorsport
Manager PC vs mobile): each product is internally coherent, but FM's mid-depth
Touch SKU was discontinued on PC/Mac/tablet after FM21 because — per Sports
Interactive's own statement — sales "fell significantly" once console editions
modelled on Touch shipped, and per-SKU cost-benefit no longer closed; the
casual tier survived only where a platform partner (Apple Arcade, Switch)
subsidised distribution. (2) **One mode with per-area toggles** (NBA 2K's
MyNBA, which merged MyGM/MyLeague into toggleable "Role-Playing Elements" and
per-team automation of scouting, staff, lineups and roster moves): this was
the most flexible model, praised by mix-and-match players, with a locked
"Ranked" variant for competitive fairness; 2K's later re-split shows the axis
is contested, not settled. (3) **Per-moment control-granularity choice**
(FIFA 21+'s Quick Sim / Interactive Match Sim / Play Match launcher; Anstoss'
own coarse dials plus optional per-player placement in one UI): depth is
chosen per match, not per profile, and reviewers received it as strictly
positive. Anstoss itself is direct evidence that a coarse "stove" surface
(7-step orientation, 5-step effort, 5-step aggression, players-per-line
formation) can sit on the same engine as a per-player layer with bounded,
roughly symmetric modifiers, so the coarse player is never structurally
outclassed. The clearest failure signal for easy modes is Football Chairman
Pro: when the casual surface removes causal levers entirely, losses read as
unfair RNG. No precedent publishes a numeric parity target; that gap is FMX's
to define.

## Findings

1. **Finding:** Sports Interactive discontinued FM Touch on PC/Mac/tablet
   after FM21 for explicitly stated commercial reasons: Touch as a standalone
   was "initially … very successful", but sales "have fallen significantly"
   once the Switch (2018) and Xbox Edition (2020) — "both of which are closely
   modelled on Touch" — shipped; Android tablet hardware fragmentation made
   development "very challenging"; the decision followed a per-SKU
   cost-benefit analysis. Touch survived only on Switch (FM22) and then as an
   Apple Arcade exclusive (FM23+).
   **Source:** SI, "Major Changes for FM22 Touch and Beyond"
   (footballmanager.com/news/major-changes-fm22-touch-and-beyond); FM Scout
   summary (fmscout.com/a-fm22-touch-only-on-nintendo-switch.html); SI, "FM23
   Touch returns to iOS through Apple Arcade" (footballmanager.com).
   **Confidence:** high (primary developer statement).

2. **Finding:** The FM product family implements casual-vs-deep as **separate
   purchasable products** (full FM → Console → Touch → Mobile in SI's own
   depth ranking), not as in-product modes; saves do not move between SKUs and
   each SKU carries its own dev/QA cost. The middle tier was the one squeezed
   out; the platform-partner strategy afterwards grew FM from ~2M to 5M+
   players (FM23). Lesson: a mid-depth *separate product* competing on the
   same store as the deep product gets cannibalised; casual reach via
   modes/platforms, not via a paid sibling SKU.
   **Source:** footballmanager.com/compare-games; SI, "The Future of Football
   Manager" (footballmanager.com/news/future-football-manager).
   **Confidence:** high.

3. **Finding:** FM Touch's easy surface kept the full match engine and squad
   layer but cut/simplified media, interactions and team talks and added
   **Instant Result** (delegate the entire match); critics called Touch the
   "sweet spot" between Mobile and full FM. There is no published data that
   Touch players underperformed — the sim is the same; depth removed was
   *ritual*, not *power*.
   **Source:** footballmanager.com/compare-games; TouchArcade FM24
   multi-platform review (toucharcade.com, 2023-11-14).
   **Confidence:** medium (feature cuts high-confidence; "no competitive
   penalty" is inferred, SI publishes no comparative data).

4. **Finding:** The Anstoss "stove": Anstoss 1's match model works on summed
   line strengths, so the tactic is literally "how many players in defence /
   midfield / attack" plus counter-picking the opponent's strongest line;
   Anstoss 3 formalised the coarse surface as three team dials — Ausrichtung
   (7 steps, Abwehrriegel→Brechstange), Einsatz (5 steps, costs freshness) and
   Härte (5 steps, Nonnenhockey→brutal) — plus conditional in-match rules
   ("Taktik-Tisch": if score/minute/player-count then change dial).
   **Source:** wiki.anstoss-online.de/index.php/Taktik; forum.anstoss-online.de
   guide "#5 Aufstellung und Taktik"; angryflo.de/strat-anstoss.htm.
   **Confidence:** high for the model; medium for Anstoss-1 details
   (fan-site reconstruction).

5. **Finding:** Anstoss' coarse dials were balanced as **bounded, roughly
   symmetric trade-offs**, not power options: per the official tips booklet
   (community-transcribed), Abwehrriegel = defence +22% of attack value but
   attack −40%, Brechstange the mirror image, "Normal" penalty-free — so the
   community meta concluded "Normal" is usually net-optimal; Härte extremes
   were worth only about ±3–5% with red-card risk scaling against referee
   strictness. Expert players extracted their edge from squad-building,
   training and freshness management, not from hidden tactical superiority.
   This is the strongest genre precedent that a coarse tactic surface can be
   competitively honest by construction.
   **Source:** anstoss-juenger.de topic 2879 ("Tipps und Tricks - A2G", citing
   TippsTricks booklet p.77); anstoss-juenger.de topic 1135.
   **Confidence:** medium (community-transcribed numbers from an official
   booklet; not independently re-derivable).

6. **Finding:** Anstoss 3 already shipped **both surfaces in one UI with no
   mode wall**: the coarse dials coexisted with an opt-in per-player layer
   (free placement with action areas/"Aktionsbereiche", per-player pass risk,
   positional discipline, pressing, offside trap). Contemporary reviews
   praised exactly this "complexity without losing usability". The vault's
   own deep-dive confirms click-depth-per-task as core series DNA.
   **Source:** anstoss-juenger.de topic 1135; de.wikipedia.org/wiki/Anstoss_(Computerspiel);
   [[anstoss-series-deep-dive]] §2.
   **Confidence:** high.

7. **Finding:** FIFA 21+ (EA FC) career mode offers a **per-match, three-step
   control-granularity choice**: Quick Sim (instant result), Interactive Match
   Sim (top-down 2x-speed sim with live subs/tactics and jump-in/jump-out "as
   many times as you want", with suggested opt-ins at key moments) and Play
   Match. It is a per-moment choice, never a profile-level commitment, and
   previews/reviews received it as a straight improvement ("you don't have to
   feel completely helpless on the sidelines"). Community threads report quick
   sim feels more volatile/punishing than playing — a caution that the
   lowest-effort path must not systematically underperform.
   **Source:** EA "Pitch Notes – FIFA 21 Career Mode Deep Dive" (ea.com);
   EA "Getting Started in FIFA 21 Career Mode" (ea.com); PlayStation Blog
   2020-08-13; Game Informer 2020-08-13; volatility claim: r/FifaCareers
   threads via Perplexity (weak sourcing).
   **Confidence:** high for the mechanism (primary EA sources); low for the
   sim-volatility reception claim.

8. **Finding:** NBA 2K's franchise layer is the genre's richest experiment on
   the D1 axis, and it **oscillated**: separate MyGM (narrative, constrained)
   vs MyLeague (full sandbox with per-team automation menus for scouting,
   staff, lineups/minutes and roster moves, each Manual/Auto) → NBA 2K20's
   MyGM pivot to action-points/leaderboards "stripped away the near limitless
   customization … more of an arcade-like mode" and disappointed its
   community → 2K21 next-gen **merged everything into MyNBA** where the old
   MyGM features became toggleable "Role-Playing Elements" ("former MyLEAGUE
   players can now pick and choose"); the dev blog states the old split
   existed because merging "took a tremendous amount of development and design
   work", i.e. it was a cost artefact, not a design ideal → later 2Ks
   re-split MyGM/MyNBA, which some players welcomed and others mourned ("you
   could mix and match elements of both modes"). Ranked variants lock
   customisation for competitive fairness.
   **Source:** Operation Sports "NBA 2K21 Next-Gen MyNBA Revealed" (dev-blog
   reprint); Operation Sports NBA 2K20 MyGM/MyLeague review; Operation Sports
   forum "MyNBA has lost its way…" (2024-11); nba.2k.com/2k26/courtside-report/mynba/.
   **Confidence:** high.

9. **Finding:** Motorsport Manager solved casual-vs-deep as **two separate
   products by platform** — the mobile line is deliberately lighter and the
   PC version "an entirely different ball game … unparalleled depth" (founder
   interview) — but *inside* the deep PC game it embedded assists for novices:
   a setup guidance bar "for those who are less mechanically minded", info
   "split into chunks", three race speeds. Reviews called the PC game
   "complex … while still being fairly accessible to newcomers". Both
   products were well received; neither was discontinued in favour of the
   other (they serve disjoint platforms, unlike FM Touch on PC).
   **Source:** motorsport.com founder interview (2016-05-27); autosport.com
   review (2016-08-17); digitallydownloaded.net review (2016-11).
   **Confidence:** high (console-edition simplification details could NOT be
   verified and are excluded).

10. **Finding:** Football Chairman Pro (chairman-style coarse mobile manager)
    shows the failure boundary of easy surfaces: the game strips tactics and
    lineups entirely (the AI manager owns them; the player does budgets,
    stadium, tickets, hiring/firing). Reception praises "exactly the right
    depth for a game played on the go", but the recurring criticisms are
    "limited direct control over team tactics and player selections",
    manager decisions made "without chairman input", and results that "can
    feel unfair" — i.e. **when the easy surface removes causal levers, normal
    outcome variance is read as unfairness**. An easy mode needs few but
    genuinely causal levers, plus legible feedback tying results to them.
    **Source:** gamebrain.co/game/football-chairman-pro (review aggregation);
    iosgames.net Football Chairman Pro page; Google Play listing.
    **Confidence:** high for the criticism pattern (consistent across
    sources); the underlying sim may actually respond to chairman decisions —
    the *perception* failure is the datum.

## Inputs For Decisions

### D1 — two modes vs three tiers vs two-modes+per-area-override

- **Option A: two named modes (EASY/PRO), hard-partitioned.** Pros: clearest
  onboarding promise and marketing; matches the Anstoss-vs-FM identity split
  Nico wants. Cons: NBA 2K's history shows hard-partitioned modes repeatedly
  frustrated players who wanted one element from the other side (Finding 8);
  a hard wall invites the FM-family outcome where one surface withers
  (Finding 1–2 — though that was SKU-level, a stronger wall than modes).
- **Option B: three named tiers (current draft Quick/Standard/Experte,
  [[../50-Game-Design/progressive-disclosure-ui]]).** Pros: matches
  progressive-disclosure literature; Standard gives a soft landing. Cons: the
  only genre precedent for a *named middle tier as its own product surface*
  is FM Touch, and the middle tier is exactly what got squeezed from both
  sides (Finding 1); three named modes triple tutorial/copy/QA surface
  (GD-0016's one-UI constraint makes every named tier a full parallel surface
  across ~10 areas per the draft's area matrix).
- **Option C: two named modes implemented as bundles of per-area depth
  toggles (2K MyNBA pattern).** Pros: strongest positive precedent — the
  merged MyNBA with toggleable Role-Playing Elements was praised precisely
  for mix-and-match ("Quick everywhere except tactics", which the
  progressive-disclosure draft §10 already anticipates as a future-scope
  toggle); the 2K dev blog frames separation as a cost artefact, not a
  design good (Finding 8); Anstoss proves coarse+deep can share one screen
  family (Finding 6). Cons: settings surface grows; needs a clear "which
  bundle am I in?" identity so the modes stay legible; risk of choice
  paralysis if toggles are advertised too early (2K buries them in setup).
- **Recommendation (recommendation, not a decision):** Option C — market two
  modes, implement them as preset bundles over per-area disclosure levels,
  with per-area override as a settings-level power feature (not in
  onboarding). The existing three-tier draft table (progressive-disclosure-ui
  §3) survives as the *internal* area-by-area disclosure spec: EASY ≈ Quick
  column, PRO ≈ Expert column, and today's "Standard" column becomes default
  toggle positions rather than a third named mode.

### D2 — mode permanence

- **Switch anytime:** supported by every in-product precedent that worked —
  FIFA's launcher is per *match* (Finding 7), 2K automation toggles are per
  save at any time (Finding 8), Anstoss' depth is per *screen visit*
  (Finding 6), and the vault draft already specifies "tier change preserves
  all underlying state" + Auto-Coach-never-overwrites
  ([[../50-Game-Design/progressive-disclosure-ui]] §7). No precedent was
  found where free switching in singleplayer harmed the game.
- **Locked per save-run:** no positive genre precedent found; the only hard
  locks in the corpus are SKU walls (FM Touch), which are the failure case.
  A roguelite-run flavour lock (GD-0017 context) would be novel, not
  precedent-backed.
- **Locked-declared in competitive only:** direct precedent — NBA 2K Ranked
  limits customisation while Unranked allows everything (Findings 8);
  competitive integrity is handled by *locking the ruleset*, not the UI depth.
- **Recommendation (recommendation, not a decision):** switch anytime in
  singleplayer (mode = UI/preset state, save stores tactic state
  mode-agnostically per ADR-0005 direction); in competitive/multiplayer
  contexts require a declared mode per competition entry if D3 gives PRO a
  bounded edge — the 2K Ranked pattern. Note the interaction: if D3 lands on
  near-parity, D2 competitive locking loses most of its motivation.

### D3 — parity target

- **Evidence for "coarse surface can be honest by construction":** Anstoss
  balanced its dials as bounded symmetric trade-offs with a penalty-free
  default, so coarse players were never structurally outclassed; expert edge
  came from knowledge (squad, freshness, counter-picking), not from access to
  more controls (Findings 4–5). This supports a design where EASY controls
  compile to near-optimal PRO configurations and the PRO edge is bounded.
- **Evidence for "the floor matters more than the ceiling":** Football
  Chairman shows that if the easy path feels non-causal, variance reads as
  unfairness (Finding 10); FIFA community perception that Quick Sim
  underperforms playing is a standing grievance (Finding 7, low confidence).
  Whatever the numeric target, the EASY path must never be the *strictly
  dominated* path, or its players churn.
- **Evidence gap:** no studied game publishes a numeric parity target
  (90–95% vs 5–15% edge); FM never published Touch-vs-full performance data.
  The specific band is genuinely FMX's decision to make and then to enforce
  via sim-level testing (EASY-bot vs PRO-bot leagues), not something
  precedent can settle.
- **Recommendation (recommendation, not a decision):** treat "EASY is
  near-parity vs AI and never dominated" as the hard floor (precedent-backed),
  and a small bounded PRO edge in human-vs-human as acceptable (2K/FIFA
  players demonstrably accept skill-expression edges from taking more
  control). Publishing the intended band in-game ("PRO gives you more levers,
  not better players") echoes Anstoss' transparent modifier philosophy.

### D4 — sweep scope

- Precedents show the casual surface is needed **per area, not just for
  tactics**: 2K automates scouting, staff, lineups, contracts and trades
  individually (Finding 8); FM Touch's cuts were mostly off-pitch ritual
  (media/interactions) while keeping match depth (Finding 3); Football
  Chairman's *whole game* is the off-pitch easy surface (Finding 10); the
  vault draft already specifies an area-by-area matrix across stadium,
  finance, training, scouting, transfers, fans
  ([[../50-Game-Design/progressive-disclosure-ui]] §3).
- **Recommendation (recommendation, not a decision):** the parity/viability
  sweep should cover every decision-bearing area (tactics, training,
  scouting, transfers, finance, stadium, fans/board), because reception
  evidence shows off-pitch areas are where easy surfaces most often feel
  either overwhelming (FM media) or non-causal (Football Chairman) — the two
  failure poles the sweep must steer between.

### NEW-easy-tactic-vocabulary — how the EASY tactic surface maps to the core

A fork the precedents expose that D1–D4 do not name: is the EASY mode
(a) **delegation** — the pro-grade controls exist and an assistant/AI sets
them (FM Instant Result / DoF, 2K automation, Football Chairman's manager) —
or (b) a **native coarse vocabulary** — genuinely different, fewer controls
(Anstoss dials: orientation/effort/aggression + players-per-line) that
compile deterministically into the same tactics contract the PRO editor
writes (GD-0004 / ADR-0072 `TacticSnapshot` direction)?

- Delegation pros: one canonical control model; EASY inherits every future
  PRO feature for free. Cons: Football Chairman shows pure delegation feels
  non-causal (Finding 10); the assistant becomes a competitive actor whose
  strength defines EASY viability (hard to tune, harder to explain).
- Coarse-vocabulary pros: Anstoss proves it is legible, loved and honest
  (Findings 4–6); the "stove" is itself the fantasy Nico wants to preserve;
  deterministic compile-down keeps one sim contract (per
  [[progressive-disclosure-research]] §7 the engine already must serve all
  tiers from one event log). Cons: two authoring surfaces must be kept
  balanced against each other forever; needs an explicit mapping spec
  (which PRO settings a dial position pins, and what stays at role defaults).
- **Recommendation (recommendation, not a decision):** (b) for tactics —
  native coarse dials compiling to the shared tactic contract — with (a)
  delegation reserved for non-tactic areas (training/scouting auto-modes),
  mirroring where each pattern succeeded in the corpus.

## Future-scope notes (classified future-scope)

- **EASY-vs-PRO telemetry**: none of the precedents published adoption or
  performance splits; if FMX wants to defend the parity band, plan for
  sim-harness bot leagues (EASY-preset bot vs PRO-optimised bot) as a CI-able
  balance test before any competitive mode ships.
- **Platform-partner casual SKU**: FM Touch's survival on Apple Arcade shows
  a subscription platform can fund a casual tier that cannot pay for itself
  at retail — relevant only if FMX ever considers a store-distributed sibling
  of the PWA; not an MVP question.
- **Ranked ruleset lock**: if async multiplayer (post-MVP per GD-0017) gets
  ranked contexts, the 2K Ranked/Unranked split is the reference pattern for
  D2's competitive branch.
- **Assistant strength as difficulty**: if the EASY mode uses any delegation,
  the assistant's competence becomes a hidden difficulty dial; precedents
  offer no tuning guidance — would need its own research packet.
