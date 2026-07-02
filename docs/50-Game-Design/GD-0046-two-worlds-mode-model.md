---
title: GD-0046 Two-Worlds Mode Model
status: accepted
tags: [game-design, gddr, dual-mode, two-worlds, progressive-disclosure, tiers, parity, fmx-212, fmx-213]
context: [tactics, match, identity-access, league-orchestration]
created: 2026-07-02
updated: 2026-07-02
type: gddr
binding: false
linear: [FMX-212, FMX-213, FMX-224]
supersedes:
superseded_by:
related:
  - [[README]]
  - [[progressive-disclosure-ui]]
  - [[tactics-system]]
  - [[onboarding-and-tutorial]]
  - [[GD-0004-tactics]]
  - [[GD-0012-onboarding]]
  - [[GD-0016-mobile-ux-loop]]
  - [[GD-0043-gameplay-calibration-ownership-and-acceptance-gate]]
  - [[../60-Research/dual-mode-precedents-sports-management-2026-07-01]]
  - [[../60-Research/mode-choice-switching-and-competitive-labeling-2026-07-02]]
  - [[../60-Research/dual-mode-vault-delta-reconciliation-2026-07-02]]
  - [[../60-Research/raw-perplexity/raw-two-worlds-naming-branding-2026-07-02]]
  - [[../60-Research/tactic-preset-coverage-and-counters-2026-07-01]]
  - [[../60-Research/tier-parity-measurement-calibration-2026-07-01]]
  - [[../60-Research/assisted-play-parity-auto-coach-2026-07-01]]
  - [[../60-Research/off-pitch-parity-measurement-economy-loop-2026-07-02]]
  - [[../60-Research/asymmetric-interface-fairness-multiplayer-2026-07-02]]
  - [[../60-Research/management-delegation-and-easy-mode-surfaces-2026-07-02]]
  - [[../60-Research/stadium-construction-expansion-models-2026-07-02]]
  - [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]]
  - [[../10-Architecture/09-Decisions/ADR-0082-manager-style-signal-and-run-analysis-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0135-tier-parity-and-assist-strength-calibration-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0136-delegation-to-staff-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0137-stadium-construction-and-expansion-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0138-mode-state-placement-and-integrity]]
---

# GD-0046: Two-Worlds Mode Model

> **Decision gate.** This GDDR encodes directions Nico ratified live on
> 2026-07-01/02 (FMX-212, D1–D4 plus the Easy tactic surface). The *record
> itself* is `status: draft` / `binding: false` per the current phase (all
> GDDRs reopened): the encoded directions are Nico's, but this note becomes
> the binding cover only when Nico ratifies it. Open forks below carry
> ★-recommendations that are **recommendations, not decisions**.

> **Cover-note semantics (single source for world semantics).** Per the
> ★-recommendation of NEW-branding-encoding-mechanism in
> [[../60-Research/dual-mode-vault-delta-reconciliation-2026-07-02]] (Option A),
> this note is the **one** place that defines the two-worlds branding and the
> world→tier mapping. The existing Quick/Standard/Expert artefacts
> ([[progressive-disclosure-ui]], `TacticTier` in
> [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]], the ADR-0082
> disclosure table, all per-area tier tables) keep their internal tier
> vocabulary unchanged; they are read *through* the mapping defined here.
> There is no vault-wide rename.

## Status

accepted

## Ratification

Ratified by Nico 2026-07-02 (FMX-224, enacting the [[../40-Execution/fmx-212-ratification-agenda-decision-queue-2026-07-02|FMX-223 agenda]]). `status: accepted`; `binding` stays `false` — decided but not in force pre-development (FMX-211 D2/D14; ADR-0104 precedent). Engine-gated numbers remain OPEN.

**World names — DECIDED (A1, override of the drafted ★ Spieltag/Taktiktafel):** the two worlds are named **Bauchgefühl** (Easy world) and **Spielidee** (Pro world) — the collision-free pair (avoids the *Spieltag* fixture-round homonym). This is the selected pair; it is subject only to the final GD-0015/ADR-0007 IP-clean + confusable/edit-distance + native-speaker verification gate (a verification task, not an open decision). Onboarding presentation (experience-goal question, equal tiles, persistent "switch anytime"), the mode-blind competitive framing, and the player-promise copy are accepted as recommended.

## Date

2026-07-02

## Player experience goal

One game, two first-class ways to live it: an Easy world where a smart
five-minute manager can win the league, and a Pro world where deep control
earns a real but bounded edge — freely switchable, never a lesser edition on
either side.

## Decision record (ratified directions)

### D1 — Three internal tiers, two branded worlds (2026-07-01)

The game keeps the **three internal UI tiers** Quick / Standard / Expert
(defined in [[progressive-disclosure-ui]]) but brands and markets them as
**two worlds**: the **Easy world** (= Quick + Standard depths) and the
**Pro world** (= Expert). The tier enum stays the internal and contract-level
vocabulary; the world is a presentation/branding layer above it.

*Rationale / grounding:* hard-partitioned modes repeatedly frustrated players
and separate mid-depth SKUs got squeezed out (FM Touch), while
bundles-over-disclosure-levels is the strongest positive precedent (NBA 2K
MyNBA) — [[../60-Research/dual-mode-precedents-sports-management-2026-07-01]]
(Findings 1–2, 8; D1 input). Keeping the tiers internal makes ~60 vault
references a presentation delta instead of a rename and leaves `TacticTier`,
slot sizing 2/3/3 and preset counts 0/10/50 untouched —
[[../60-Research/dual-mode-vault-delta-reconciliation-2026-07-02]]
(Findings 1–2).

### D2 — Switch anytime, everywhere (2026-07-01)

World and tier are switchable at any time, in every context. A switch
preserves all underlying state; the save never embeds the tier
([[progressive-disclosure-ui]] §7,
[[../10-Architecture/09-Decisions/ADR-0005-save-format|ADR-0005]] direction).

*Rationale / grounding:* free switching is the documented modern norm and no
surveyed precedent shows singleplayer harm from it; per-save locks are
accepted only as clearly branded opt-in challenge modes —
[[../60-Research/mode-choice-switching-and-competitive-labeling-2026-07-02]]
(Findings 1–3); every in-product genre precedent that worked switches freely —
[[../60-Research/dual-mode-precedents-sports-management-2026-07-01]]
(D2 input). The engine already taxes opportunistic switching via familiarity
and the predictability penalty —
[[../60-Research/tactic-preset-coverage-and-counters-2026-07-01]] (D2 input).

### D3 — Bounded pro edge via floor+cap envelope (2026-07-02; revises the 2026-07-01 near-parity call)

> **Supersede note.** The original 2026-07-01 D3 direction was
> **near-parity**. On **2026-07-02 Nico revised D3**: the target is a
> **bounded pro edge** expressed as a floor+cap envelope on a
> floor-normalized parity ratio. This note records the revised direction;
> the 2026-07-01 near-parity wording is superseded and must not be cited as
> current.

The revised D3:

- **Envelope, not exact parity:** a floor+cap envelope on the
  floor-normalized parity ratio, with **evidence-shaped placeholders**
  R ≈ 0.85–0.95 and Easy-vs-Pro head-to-head ≈ 52–57 % pro win probability
  (season-scale ≈ ≤ 4–8 league points at equal squads). **The exact numbers
  are explicitly OPEN** until the sim harness exists (open fork below).
- **Edge source constraint:** the pro edge comes only from **adaptation
  decision classes** (reading the opponent, sharper counters, timing) —
  never from degrading the assistant's static picks or handicapping the Easy
  surface.
- **Hard floor:** **Easy is never a dominated strategy** — globally, in every
  decision-bearing area.

*Rationale / grounding:* the envelope model (floor+cap on a normalized ratio,
plus a head-to-head band, with the AI-field check as an always-on subset) is
the ★-recommended Option B of
[[../60-Research/tier-parity-measurement-calibration-2026-07-01]]; envelopes
can tighten later, exact parity cannot cheaply re-grow an edge. A ~5–15 %
bounded tactical edge is empirically the natural size once exploits are
excluded (FM-Arena equal-squad experiments), and the pro edge delivered
through information/adaptation depth rather than raw multipliers is exactly
the "Recommended Counter vs sharper sub-archetype" shape —
[[../60-Research/tactic-preset-coverage-and-counters-2026-07-01]]
(Finding 5; D3 input; "Recommended Counter across modes"). The floor is the
load-bearing half: easy surfaces that feel non-causal or dominated churn
their players —
[[../60-Research/dual-mode-precedents-sports-management-2026-07-01]]
(Finding 10; D3 input);
[[../60-Research/mode-choice-switching-and-competitive-labeling-2026-07-02]]
(stress-evidence for D3).

### D4 — Full sweep (2026-07-01)

The two-worlds model and the D3 envelope apply to **every decision-bearing
management area** (tactics, training, scouting, transfers, finance, stadium,
fans/board, match), not to tactics alone.

*Rationale / grounding:* reception evidence shows off-pitch areas are where
easy surfaces most often fail (overwhelming ritual or non-causal levers) —
[[../60-Research/dual-mode-precedents-sports-management-2026-07-01]]
(D4 input); per-area anchors and measurement classes for the off-pitch sweep
are specified in
[[../60-Research/off-pitch-parity-measurement-economy-loop-2026-07-02]];
the community will industrially search the meta whether we sweep or not —
[[../60-Research/tactic-preset-coverage-and-counters-2026-07-01]] (D4 input).

### Easy tactic surface — native coarse dials, one contract (2026-07-02)

The Easy world's tactic surface is a **native coarse vocabulary** — dials and
curated presets in the Anstoss pattern ("N up front / N in defence",
aggressiveness, preset pick) — that **compiles deterministically into the
SAME tactic contract** the Pro editor writes (ADR-0055 `TacticSnapshot`
direction). **Delegation is reserved for non-tactic areas.**

*Rationale / grounding:* Anstoss proves a coarse dial surface on the shared
engine is legible, loved and competitively honest by construction, while pure
delegation reads as non-causal —
[[../60-Research/dual-mode-precedents-sports-management-2026-07-01]]
(Findings 4–6, 10; NEW-easy-tactic-vocabulary ★, which Nico ratified);
the preset library, counter-cycle shape and dial→contract mapping evidence is
in [[../60-Research/tactic-preset-coverage-and-counters-2026-07-01]]. The
surface spec itself lives in [[tactics-system]] (Stage-2 revision) — this
note only fixes the decision.

## World mapping (normative)

| World (player-facing) | Internal tier(s) | Depth inside the world | Tier notes (unchanged, read through this mapping) |
|---|---|---|---|
| **Easy world** | Quick, Standard | Quick = default lean depth; Standard = "Mehr Details" depth (open fork below on the exact surface) | [[progressive-disclosure-ui]] §2–§3 Quick/Standard rows |
| **Pro world** | Expert | single depth | [[progressive-disclosure-ui]] §2–§3 Expert rows |

Rules:

1. **The tier enum is internal.** Quick/Standard/Expert never appear in
   player-facing copy ([[../60-Research/mode-choice-switching-and-competitive-labeling-2026-07-02]],
   naming-fork copy rules); contracts (`TacticTier`, ADR-0082 disclosure
   bands, quality budgets) keep tier vocabulary with **zero renames**
   ([[../60-Research/dual-mode-vault-delta-reconciliation-2026-07-02]]
   Finding 2).
2. **The world is the first-class player choice** — in onboarding (the
   experience question's answers name the worlds), in Settings (world-first,
   with the Easy-world depth surface inside), and in marketing (two co-equal
   fantasies, never "full vs streamlined"). Co-equal branding is a hard
   requirement, not a nicety: the moment marketing ranks the worlds by depth,
   the community ranks the players
   ([[../60-Research/mode-choice-switching-and-competitive-labeling-2026-07-02]]
   Finding 9, stress-evidence for D1).
3. **Existing per-area tier tables map cleanly:** Quick+Standard rows = Easy
   world, Expert rows = Pro world
   ([[../60-Research/dual-mode-vault-delta-reconciliation-2026-07-02]]
   Finding 10). Where a note says "tier", this mapping supplies the world
   reading; the notes themselves are not rewritten (accepted records get
   additive pointers only, per ADR-0092 no-silent-rewrite).
4. **The world must never share a name with the difficulty axis.** "Easy
   world" vs "Easy difficulty" is a real collision (DE: "Einfach" twice) —
   [[../60-Research/dual-mode-vault-delta-reconciliation-2026-07-02]]
   (conflict C1). "Easy/Pro" therefore stay **vault-internal shorthand**;
   the player-facing pair comes from the naming fork below.

## Switch-anytime UX (implements D2)

### Onboarding presentation — ★ Option C (mode-choice packet)

Reframe the existing one-tap experience question's answers as
**experience-goal statements that name the worlds**, keeping the silent
mapping to tier + difficulty + verbosity and the veteran-skip flow intact:
"I want quick matchdays" → Easy world (Quick depth), middle answer → Easy
world (Standard depth), "give me full control" → Pro world (Expert); plus a
persistent "you can switch worlds anytime" line. This keeps the ratified
FTUE shape, the ≤2-decision-screen rule and the 60-second budget of
[[GD-0012-onboarding]] untouched while replacing the competence-framed
Newbie/Bit/Veteran answers (the stigma anti-pattern) with purpose framing —
[[../60-Research/mode-choice-switching-and-competitive-labeling-2026-07-02]]
(Findings 4, 10; onboarding fork ★ C). *Recommendation, not a decision* on
the copy; the mapping-table change itself follows from ratified D1.

Anti-stigma rider: the tiles are equal-weight with no pre-selected card and no
"Recommended" badge, and the persistent "Du kannst die Welt jederzeit
wechseln" line stays. The middle (Standard-depth) answer is framed as a richer
Easy world — "**Spieltag mit mehr Details**" — and **never** as
"Normal/Standard/Empfohlen": the "Normal trap" implies a default the player
should be able to handle, which re-stigmatises the lean answer. Final middle
wording is Nico's taste. *Recommendation, not a decision.*

### Switch ceremony — ★ B+C with A underneath (mode-choice packet)

- **B — first-class world switcher:** a named surface (Club/More sheet per
  ADR-0008) showing both worlds as equal cards, a "what changes" preview per
  area, the explicit non-destructive guarantee, instant apply, instant undo,
  entry points to depth/consent settings.
- **C — adaptive switch prompts:** struggle and mastery signals *offer* —
  never force — a world/depth change via the Assistant, symmetrically in both
  directions (suggest Pro to masters, not only Easy to strugglers); tone must
  pass the Celeste gatekeeping test both ways.
- **A — the plain settings toggle** remains underneath as the low-level
  mechanism.

Mid-run switches in the roguelite are **recorded on the run record** (per-run
world snapshot); the resulting badge is **informational only** — the switcher
itself never warns, shames or discounts anything. Grounding:
[[../60-Research/mode-choice-switching-and-competitive-labeling-2026-07-02]]
(switch-UX fork ★ B+C; Findings 2, 11). *Recommendation, not a decision.*

### Non-destructive guarantee (restated, owned by progressive-disclosure-ui)

Auto-Coach and every assistant **propose only and never overwrite** manual
choices; a world/tier switch preserves all underlying state
([[progressive-disclosure-ui]] §4/§7 — the normative home of this rule;
[[../60-Research/assisted-play-parity-auto-coach-2026-07-01]] carries the
parity evidence). This guarantee is the reassurance the switcher UI leads
with.

### Depth surface inside the Easy world — ★ Option A (vault-delta packet)

The Quick↔Standard boundary inside the Easy world is exposed as an **explicit,
reversible depth toggle** ("Mehr Details"), silently pre-set at onboarding —
honest, testable, D2-compatible; adaptive/auto depth is rejected for
unpredictability, and the flat 3-way tier setting is acceptable only as a
transitional Stage-2 default —
[[../60-Research/dual-mode-vault-delta-reconciliation-2026-07-02]]
(NEW-easy-world-depth-surface ★ A). *Recommendation, not a decision.*

## Player promise (communication rules)

1. **No-domination invariant, promised globally:** "Easy is never a losing
   strategy." This is the one parity claim label copy may assert everywhere —
   [[../60-Research/off-pitch-parity-measurement-economy-loop-2026-07-02]]
   (competitive-labeling input ★).
2. **Percent-of-optimal language is reserved** for optimizer-anchored areas
   (match/tactics, training, stadium timing); transfers and scouting get
   reference-relative + no-domination statements only — a single "easy
   reaches X % of pro-optimal everywhere" claim would overclaim exactly where
   the easy floor is most at risk
   ([[../60-Research/off-pitch-parity-measurement-economy-loop-2026-07-02]],
   Finding 9 and labeling input).
3. **Bounded-edge communication guardrails** (risk R5/R1 of
   [[../60-Research/asymmetric-interface-fairness-multiplayer-2026-07-02]]):
   communicate the *invariants*, never the raw number as marketing — e.g.
   "smart calls in Easy can win the league; Pro adds adaptation tools, roughly
   a one-extra-win-in-twenty edge at equal skill — never an auto-win". Exact
   envelope numbers live in docs/patch notes for those who look, never as a
   storefront claim; no fairness claim ships without a backing test
   (ADR-0108 copy gate). Publish the fairness *rules*, not just outcomes, so
   losses stay attributable instead of reading as rigging.
4. **Copy rules from the naming evidence** (apply regardless of the naming
   fork's outcome): never "recommended for beginners" / "the full
   experience"; no reduced-edition language ("lite", "streamlined") in the
   Easy world's self-description; rewards are never revoked or discounted for
   world choice — Pro-exclusive prestige is *additional* opt-in surface, not
   devaluation
   ([[../60-Research/mode-choice-switching-and-competitive-labeling-2026-07-02]]
   Findings 3–4, naming-fork copy rules). Additive rule (applies regardless of
   the naming outcome): the Pro world's noun must read warm / human /
   football-concrete (a place, object or philosophy), never heroic or
   command-center (no Zentrale / Kommando / Feldherr / Masterplan-as-genius) —
   a heroic Pro noun makes the Easy world the visible consolation in trailers
   and store banners. Present the two names only as a paired question with
   identical visual weight (equal tile containers, matched icons), never
   stacked as a ranked list — a toggle-silhouette hierarchy is inferred before
   copy is read
   ([[../60-Research/raw-perplexity/raw-two-worlds-naming-branding-2026-07-02]]).
5. **One competition, honestly labeled — never split.** Both worlds share a
   single competition sorted only by how you perform; the world you play is
   shown as a prestige-neutral, informational badge (per run, and in
   multiplayer per match), and any Pro-only prestige is only ever an optional
   "pure" view over that same board and the same rating — never a separate
   class, ladder, ranking, or matchmaking bracket. We tell you the fairness
   rules — the Pro edge is bounded, adaptation-only, and Easy is never a losing
   strategy — but never a raw win-percentage, so a defeat reads as "they
   out-adapted me," not "the game is rigged." When you do lose, we say so
   plainly and offer you Pro's tools for next time — your choice, instantly, at
   no cost — because the world you play is always yours to change.

## Open (Wave 2) — OPEN forks for Nico

All ★ marks below are the research packets' recommendations —
**recommendations, not decisions**; each fork stays open until Nico rules.

1. **World naming (player-facing pair, DE-first).** ★ Purpose/place-framed,
   session-identity pair (never a depth/skill ladder; depth-scale names like
   "Easy/Profi" stay rejected per the evidence and conflict C1). All pairs are
   placeholders pending Nico's taste + the formal IP-clean / confusable /
   edit-distance / competitor-mark gate (Anstoss / Fussball Manager / Football
   Manager / FIFA / eFootball + adjacent-gaming marks) + a DE copy test;
   connotation claims are medium-confidence native-speaker synthesis
   ([[../60-Research/raw-perplexity/raw-two-worlds-naming-branding-2026-07-02]]).
   Ranked shortlist (★ = recommendation, not a decision):
   1. **TOP — "Spieltag" (Easy) / "Taktiktafel" (Pro)** (EN: Matchday /
      Tactics Board). This **upgrades** the note's prior illustration: prefer
      "**Taktiktafel**" over "Taktikzentrale" — the whiteboard is a human,
      prestige-neutral image that both worlds' coaches use, whereas
      "-zentrale"/HQ silently tilts prestige to the Pro world and breaks
      co-equality in toggles and screenshots. **Condition:** "Spieltag" is
      already the standard DE fixture-round / matchday UI term, so adopting it
      as a world name requires reserving the word exclusively for the world
      label and renaming the fixture-round UI concept (candidate: Spielwoche /
      Ligarunde / Runde) — see the new open sub-fork below.
   2. **TOP FALLBACK (collision-free, fully DE-native) — "Bauchgefühl"
      (Easy) / "Spielidee" (Pro)** (EN: Instinct / Playing-idea). Replaces the
      Denglisch "Masterplan" with the idiomatic Pep-era "Spielidee"; both are
      respected, co-equal coaching philosophies (Intuition vs Konzeption),
      neither is reserved UI vocabulary (no homonym), and the two ~3-syllable
      nouns give the best toggle-silhouette symmetry. **Promote to top if Nico
      declines the Spieltag UI rename.**
   3. **FALLBACK — "Trainerbank" (Easy) / "Taktiktafel" (Pro)** (EN:
      Touchline / Board). Milder homonym (Trainerbank ≈ the bench UI element);
      keep only as a serious-managerial fallback.

   Reject as the Pro-world noun any heroic / HQ / militaristic word
   (Taktikzentrale, Masterplan-as-hero, Feldherr, Kommandostand) — co-equality
   is bidirectional (a try-hard Pro label re-brands the Easy player an
   amateur), and "Feldherr" additionally carries a live registered-mark
   collision.
2. **World-name / UI-term homonym resolution (gates the Spieltag pick).**
   If "Spieltag" is chosen as the Easy-world name, decide whether to reserve it
   exclusively for the world label and rename the fixture-round UI concept
   (candidate: Spielwoche / Ligarunde / Runde), OR take the collision-free
   "Bauchgefühl" / "Spielidee" alternate. Touches UI vocabulary → needs Nico.
   ★ Reserve-and-rename if Spieltag is the taste pick; else the alternate.
   *Recommendation, not a decision.*
3. **Parity band numbers (D3 envelope constants).** The placeholders
   (R ≈ 0.85–0.95; head-to-head 52–57 %; season ≤ ~4–8 points) are
   evidence-shaped, not decided. ★ Keep them as the starting envelope and set
   the final numbers only from the calibration harness (equal-squad
   round-robins, EASY-bot vs PRO-bot leagues) under the GD-0043 slot
   machinery, expressed as testable invariants (contract shape:
   [[../10-Architecture/09-Decisions/ADR-0135-tier-parity-and-assist-strength-calibration-contract|ADR-0135]],
   same FMX-212 wave) —
   [[../60-Research/tier-parity-measurement-calibration-2026-07-01]] (★ B);
   [[../60-Research/tactic-preset-coverage-and-counters-2026-07-01]]
   (D3 input).
4. **Competitive labeling.** ★ One main leaderboard with a
   **prestige-neutral world badge** on every entry (backed by the per-run
   world snapshot) **plus opt-in Pro-pure prestige boards** (entries qualify
   only if the whole run stayed Pro) — mode-choice labeling fork ★ B+D;
   mode-blind boards fail under a deliberate edge, separate boards split a
   small population. For MP the same transparency-without-locks pattern is
   the sibling packet's ★ (visible mode badge + per-match mode log,
   [[../60-Research/asymmetric-interface-fairness-multiplayer-2026-07-02]]
   labeling ★ A). Mid-competition switches are re-badged BG3-style (never
   blocked, never silent).
5. **Per-area override ("Easy everywhere except Pro tactics").** Stays
   future-scope and is additionally **gated on the MP-treatment and
   labeling forks** because it makes the world label untruthful for
   straddling players (vault-delta conflict C4). ★ If/when it ships, parity
   gating covers whole-mode policy families plus at most 2–3 sentinel
   override combos — an ungated combinatorial space cannot carry a parity
   promise ([[../60-Research/tier-parity-measurement-calibration-2026-07-01]]
   D1 input).

Forks open but **owned by sibling packets** (listed for completeness, not
restated here): delegation model shape + consent ladder
(★ throttled per-area delegation with a `manual`/`propose`/`delegate` consent
ladder, deterministic execution, never-overwrite pins —
[[../60-Research/management-delegation-and-easy-mode-surfaces-2026-07-02]];
Stage-2 carrier
[[../10-Architecture/09-Decisions/ADR-0136-delegation-to-staff-contract|ADR-0136]]);
stadium expansion model (★ one construction contract with the wizard as its
Quick compile-down, same pattern as the tactic dials —
[[../60-Research/stadium-construction-expansion-models-2026-07-02]];
Stage-2 carrier
[[../10-Architecture/09-Decisions/ADR-0137-stadium-construction-and-expansion-contract|ADR-0137]]);
MP treatment (★ mode-blind unified competition + full transparency —
[[../60-Research/asymmetric-interface-fairness-multiplayer-2026-07-02]];
mode-state substrate
[[../10-Architecture/09-Decisions/ADR-0138-mode-state-placement-and-integrity|ADR-0138]];
co-equal per-world ladders remain the mode-choice packet's documented
alternative for a large-population future). Preset count (★ 6–8 spanning a
soft-counter cycle) and aggressiveness mapping (★ one macro dial → per-preset
(mentality, pressing) lookup) are owned by
[[../60-Research/tactic-preset-coverage-and-counters-2026-07-01]] and land in
the [[tactics-system]] Stage-2 revision.

## Rationale

The two-worlds model resolves the tension the vault has carried since
[[GD-0004-tactics]] ("depth that is opt-in") and [[progressive-disclosure-ui]]
(three tiers, one core): the genre evidence says a mid-depth *named product
surface* gets squeezed (FM Touch) while per-area disclosure bundles thrive
(MyNBA), so FMX keeps the granular internal tiers for contracts and
calibration but sells exactly two identities. D3's revision from near-parity
to a bounded, floor-guarded envelope makes the Pro world's depth *mean*
something without ever making the Easy world a trap — the precedents show the
floor (never dominated, always causal) is what retains casual players, and
the envelope is what keeps the edge testable, communicable and honest.
One simulation core, one contract per area, deterministic compile-down from
every coarse surface: the worlds differ in authoring surface, never in
simulation truth.

## Consequences

Positive:

- Marketing gets two co-equal fantasies; contracts and ~60 vault notes need
  no rename ([[../60-Research/dual-mode-vault-delta-reconciliation-2026-07-02]]
  work-list).
- D3 becomes a regression-testable calibration invariant instead of a vibe,
  wired into the GD-0043 slot machinery.
- Switch-anytime plus the per-run world snapshot gives competitive surfaces
  honest data without locks.

Negative / constraints:

- The genre has never delivered a competitively first-class lighter mode
  (mode-choice Finding 9); FMX is attempting it, and it hinges on
  compile-down parity plus co-equal branding — both now hard requirements.
- Two authoring surfaces per area must be kept balanced forever; the
  calibration harness (parity-band fork) becomes load-bearing
  infrastructure before any competitive mode ships.
- World semantics live in exactly one note (this one); readers of tier-worded
  notes must follow one hop.

## Supersedes

None at note level. Within the decision ledger, the **2026-07-02 D3
direction recorded here revises the 2026-07-01 near-parity D3 direction**
(see supersede note in the D3 section).

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]] — additive
  amendment / new ADR for the `CoarseTacticInput` → tactic-contract
  deterministic compile seam (never a rewrite).
- Future league-orchestration / identity-access ADR(s) — per-run/per-entry
  world snapshot separate from the profile preference
  ([[../60-Research/mode-choice-switching-and-competitive-labeling-2026-07-02]]
  Finding 11); reserved world field, not encoded into MP contracts in
  Stage-2 ([[../60-Research/dual-mode-vault-delta-reconciliation-2026-07-02]]
  MP input).
- [[../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
  — the D3 envelope and its copy gate extend the existing fairness surface.

## Related

- Research: [[../60-Research/dual-mode-precedents-sports-management-2026-07-01]] ·
  [[../60-Research/mode-choice-switching-and-competitive-labeling-2026-07-02]] ·
  [[../60-Research/dual-mode-vault-delta-reconciliation-2026-07-02]] ·
  [[../60-Research/tactic-preset-coverage-and-counters-2026-07-01]] ·
  [[../60-Research/tier-parity-measurement-calibration-2026-07-01]] ·
  [[../60-Research/off-pitch-parity-measurement-economy-loop-2026-07-02]] ·
  [[../60-Research/asymmetric-interface-fairness-multiplayer-2026-07-02]] ·
  [[../60-Research/management-delegation-and-easy-mode-surfaces-2026-07-02]] ·
  [[../60-Research/stadium-construction-expansion-models-2026-07-02]] ·
  [[../60-Research/assisted-play-parity-auto-coach-2026-07-01]]
- Decisions: [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]] ·
  [[../10-Architecture/09-Decisions/ADR-0082-manager-style-signal-and-run-analysis-contract]]
- Same FMX-212 wave:
  [[../10-Architecture/09-Decisions/ADR-0135-tier-parity-and-assist-strength-calibration-contract|ADR-0135]]
  (D3 envelope contract) ·
  [[../10-Architecture/09-Decisions/ADR-0136-delegation-to-staff-contract|ADR-0136]]
  (delegation contract) ·
  [[../10-Architecture/09-Decisions/ADR-0137-stadium-construction-and-expansion-contract|ADR-0137]]
  (stadium construction contract) ·
  [[../10-Architecture/09-Decisions/ADR-0138-mode-state-placement-and-integrity|ADR-0138]]
  (mode-state placement & integrity)
- [[README]] — Game Design Log (hub) · siblings: [[GD-0004-tactics]] ·
  [[GD-0012-onboarding]] · [[GD-0016-mobile-ux-loop]] ·
  [[GD-0043-gameplay-calibration-ownership-and-acceptance-gate]]
