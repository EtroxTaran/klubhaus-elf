---
title: "Dual-Mode / Two-Worlds Research Index (FMX-212 Stage-1 corpus)"
status: draft
tags: [research, dual-mode, index]
created: 2026-07-02
updated: 2026-07-02
type: research
binding: false
linear: FMX-212
sourceType: internal
context: [tactics, match, staff-operations, stadium-operations, league-orchestration]
related:
  - [[dual-mode-precedents-sports-management-2026-07-01]]
  - [[assisted-play-parity-auto-coach-2026-07-01]]
  - [[tier-parity-measurement-calibration-2026-07-01]]
  - [[tactic-preset-coverage-and-counters-2026-07-01]]
  - [[in-match-controls-tier-gating-2026-07-01]]
  - [[management-delegation-and-easy-mode-surfaces-2026-07-02]]
  - [[stadium-construction-expansion-models-2026-07-02]]
  - [[mode-choice-switching-and-competitive-labeling-2026-07-02]]
  - [[dual-mode-vault-delta-reconciliation-2026-07-02]]
  - [[asymmetric-interface-fairness-multiplayer-2026-07-02]]
  - [[mode-state-contract-placement-and-integrity-2026-07-02]]
  - [[off-pitch-parity-measurement-economy-loop-2026-07-02]]
  - [[../50-Game-Design/GD-0046-two-worlds-mode-model]]
  - [[../10-Architecture/09-Decisions/ADR-0135-tier-parity-and-assist-strength-calibration-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0136-delegation-to-staff-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0137-stadium-construction-and-expansion-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0138-mode-state-placement-and-integrity]]
  - [[../50-Game-Design/progressive-disclosure-ui]]
---

# Dual-Mode / Two-Worlds Research Index (FMX-212 Stage-1 corpus)

## Question

Which research notes make up the FMX-212 Stage-1 dual-mode/two-worlds corpus,
what does each one establish, which ratified decision or open fork does it
feed, and where do the open forks travel into Stage-2? This is the master
index of the corpus; it establishes no new facts and decides nothing.

## Summary

FMX-212's mission: make the dual-mode requirement — an Easy world of coarse
Anstoss-style controls and a Pro world of FM-style depth on **one simulation
core**, with Easy players staying competitively viable — decision-ready.
Stage-1 produced twelve research notes in three batches: **Wave 1**
(2026-07-01, five notes: precedents, auto-coach parity, parity measurement,
tactic presets, in-match controls), **Wave 2** (2026-07-02, five notes:
delegation, stadium construction, mode-choice/labeling UX, vault delta
reconciliation, MP interface fairness), and **two critic follow-ups**
(2026-07-02: mode-state contract placement/integrity and off-pitch parity
measurement), commissioned after an adversarial review of Waves 1–2 flagged
those two gaps. Eleven notes have Perplexity raw captures under
`raw-perplexity/`; the vault-delta note is a purely internal audit. The
corpus grounds the ratified decisions D1–D4 plus the Easy tactic surface
(restated below with dates, including the 2026-07-02 D3 revision) and hands
eight open forks to the Stage-2 notes
[[../50-Game-Design/GD-0046-two-worlds-mode-model|GD-0046]],
[[../10-Architecture/09-Decisions/ADR-0135-tier-parity-and-assist-strength-calibration-contract|ADR-0135]],
[[../10-Architecture/09-Decisions/ADR-0136-delegation-to-staff-contract|ADR-0136]],
[[../10-Architecture/09-Decisions/ADR-0137-stadium-construction-and-expansion-contract|ADR-0137]]
and
[[../10-Architecture/09-Decisions/ADR-0138-mode-state-placement-and-integrity|ADR-0138]].

## Ratified decision state (context for every entry below)

Ratified by Nico; **not re-opened by this corpus or by Stage-2**:

- **D1 (2026-07-01)** — keep **three tiers internally** (Quick / Standard /
  Expert), branded and marketed as **two worlds**: Easy world =
  Quick+Standard, Pro world = Expert.
- **D2 (2026-07-01)** — mode/tier is **switchable anytime, everywhere**.
- **D3 (2026-07-02, revises the 2026-07-01 near-parity call)** — **bounded
  pro edge** via a floor+cap envelope on a floor-normalized parity ratio.
  Evidence-shaped placeholders: R ≈ 0.85–0.95, head-to-head 52–57 % — the
  **exact numbers are explicitly open** until the simulation harness exists.
  The pro edge is confined to **adaptation decision classes** and never comes
  from degrading the assistant's static picks; Easy is **never a dominated
  strategy**.
- **D4 (2026-07-01)** — **full sweep**: the mode split applies to every
  decision-bearing management area.
- **Easy tactic surface (2026-07-02)** — Easy tactics are **native coarse
  dials/presets** compiling deterministically into the **same tactic
  contract** Pro writes (Anstoss pattern); **delegation is reserved for
  non-tactic areas**.

All ★ marks in this index restate the research packets' recommendations —
**recommendations, not decisions**; the forks stay open until Nico rules.

## Wave 1 (2026-07-01) — precedents and the parity core

### 1. [[dual-mode-precedents-sports-management-2026-07-01]]

How management games shipped casual + deep control in one product. Finds
three packaging patterns — separate SKUs (FM Touch, discontinued when
per-SKU economics failed), one mode with per-area toggles (NBA 2K MyNBA,
most flexible, with a locked "Ranked" variant), and per-moment
control-granularity choice (FIFA's match launcher; Anstoss' coarse dials plus
optional per-player layer in one UI). Anstoss is direct evidence that a
coarse surface on the same engine as a deep layer can avoid structural
outclassing; Football Chairman Pro is the failure signal (removing causal
levers makes losses read as unfair RNG). No precedent publishes a numeric
parity target — that gap is FMX's to define.
**Feeds:** grounded D1/D2/D4 as decided; frames the per-area-override and
competitive-labeling forks.
**Raw capture:** [[raw-perplexity/raw-dual-mode-precedents-sports-management-2026-07-01]]

### 2. [[assisted-play-parity-auto-coach-2026-07-01]]

Specifies how Auto-Coach strength can be an engineered, measured property
instead of a vibe. Comparable assistants fail from one of two sides (FM/Civ:
safe-but-weak, failures concentrated in adaptation; Battle Legion: automation
strong enough to kill strategy); chess (Stockfish UCI_Elo, Maia) shows
strength as an externally anchored number produced by full-strength search
plus throttled candidate selection — never fake noise. Proposes the strength
target as a normalized score between naive and expert reference agents,
specified per decision class, owned by an `assist.autoCoach` calibration slot
under [[../50-Game-Design/GD-0043-gameplay-calibration-ownership-and-acceptance-gate|GD-0043]].
**Feeds:** D3's "edge confined to adaptation classes / never degrade static
picks" shape; the throttled-expert executor reused by the delegation fork;
ADR-0135's slot design.
**Raw capture:** [[raw-perplexity/raw-assisted-play-parity-auto-coach-2026-07-01]]

### 3. [[tier-parity-measurement-calibration-2026-07-01]]

Gives "Easy reaches X % of pro-optimal output" a formal, testable shape: easy
mode as a restriction of the decision space (Jaffe restricted-play), the
pro-optimal anchor as an approximate best response under a fixed versioned
search budget, and the metric as an xPts delta over a scripted policy ladder
on the GD-0042 Monte-Carlo harness. Industry precedent shows non-50/50 target
envelopes as first-class calibration objectives (metagame autobalancing, Apex
aim-assist constants with split telemetry and per-patch re-tune). Keeping
parity true over patches requires a dedicated slot with floor+cap envelopes,
mandatory re-runs on `match.core`/tactics changes, and re-derivation of the
anchor policy each time.
**Feeds:** D3's floor+cap envelope form (the R and head-to-head placeholders
originate here); the parity-band-numbers fork; the per-area-override parity
gating caveat; ADR-0135.
**Raw capture:** [[raw-perplexity/raw-tier-parity-measurement-calibration-2026-07-01]]

### 4. [[tactic-preset-coverage-and-counters-2026-07-01]]

Sizes and shapes the Easy preset library. Balance literature demands
non-dominated options and soft counters; Hattrick's 7+1 fixed tactics stayed
healthy for two decades; Anstoss warns that dead options and a collapsed meta
kill a small set; FM-Arena's 9M-match testing shows unconstrained pro editors
breed super-tactics but also that tactic spread among reasonable tactics
compresses to ~5 % — a bounded pro tactical edge is empirically achievable
and measurable. Converges on 6–8 hand-tuned presets in a soft-counter cycle
over the 8 opposition archetypes, an aggressiveness dial reusing the 5-band
mentality, and the ADR-0080 selector serving both modes ("Recommended
Counter" for Easy, full library for Pro).
**Feeds:** the ratified Easy-tactic-surface decision's mechanics; the open
preset-count/aggressiveness-mapping fork (★ 6–8 presets; one macro dial →
per-preset mentality/pressing lookup), carried by GD-0046.
**Raw capture:** [[raw-perplexity/raw-tactic-preset-coverage-and-counters-2026-07-01]]

### 5. [[in-match-controls-tier-gating-2026-07-01]]

Whether the live-match kit splits per mode. FM community testing shows manual
live control vs AI-run matches produces statistically identical xG/goals
except the touchline-shout/morale channel; Total War auto-resolve is the
cautionary tale of an assisted path so weak it forces micromanagement — the
exact D3 failure mode. ★ Give both modes the same five-group GD-0025 live kit
(already discrete, cooldown-bounded, APM-proof); pro depth lives in what the
levers load (deeper pre-saved `TacticSnapshot`s) plus an optional live
auto-assistant keeping Easy's shout channel near parity. ADR-0072/ADR-0087
contracts need zero change under every option examined.
**Feeds:** D3 and D4 at the match surface; live-kit input to GD-0046 and
ADR-0135's per-decision-class envelope cells.
**Raw capture:** [[raw-perplexity/raw-in-match-controls-tier-gating-2026-07-01]]

## Wave 2 (2026-07-02) — the full sweep and the two-worlds packaging

### 6. [[management-delegation-and-easy-mode-surfaces-2026-07-02]]

The delegation system the vault lacks, for the non-tactic areas D4 sweeps.
OOTP's per-area Team Control Settings (named in-world staff, per-affiliate
granularity, changeable anytime, "automate everything, then take areas back")
is the genre's most-praised model; FM's delegated quality complaints
concentrate exactly where D3 is most sensitive (transfers/contract value,
adaptive decisions); Anstoss pairs accept-a-proposal assistance with natively
coarse surfaces, matching the ratified dials-not-delegation tactics call. The
Wave-1 throttled-expert Auto-Coach generalizes to per-area delegated
execution with staff skill setting the throttle inside the D3 corridor
(deterministic, per the ADR-0084 precedent). Surfaces the **consent model**
as the genuinely new fork: "proposes only, never overwrites" cannot hold for
areas that must "just run".
**Feeds:** the open delegation-shape + consent-ladder fork (★ throttled
per-area delegation with a `manual`/`propose`/`delegate` consent ladder,
deterministic execution, never-overwrite pins), carried by ADR-0136; the
per-area-override fork.
**Raw capture:** [[raw-perplexity/raw-management-delegation-and-easy-mode-surfaces-2026-07-02]]

### 7. [[stadium-construction-expansion-models-2026-07-02]]

Closes the Stadium Operations contract gap (no capacity-expansion or
construction command in the ADR-0061-ratified surface). Anstoss 3's Stadionbau
worked via visible plot-based growth, economically meaningful per-stand
choices and real construction time; FM's board-request model reads as passive;
tycoon analyses locate busywork in non-interacting parameter counts.
Real-world anchors give calibration bands (expansion duration/cost per seat,
hospitality revenue share, safe-standing density); financing maps onto the
existing `FinancingFacility` layer plus two stadium-flavoured instruments.
Lays out three scoped model options.
**Feeds:** the open stadium-expansion-model fork (★ ratify the Option B
construction-project FSM contract now, ship the Option A Quick wizard as the
Easy compile-down over the same contract — mirroring the tactic-dials
pattern — and defer the Option C plot builder post-MVP), carried by ADR-0137.
**Raw capture:** [[raw-perplexity/raw-stadium-construction-expansion-models-2026-07-02]]

### 8. [[mode-choice-switching-and-competitive-labeling-2026-07-02]]

Onboarding, switch UX, leaderboard treatment and world naming under the
decided D1/D2/D3. Free switching is the modern accessibility norm (locks
survive only as opt-in prestige modes — Ironman/Honor Mode); "Easy" is a
stigmatized label, purpose-framed names measurably shift self-selection
(Celeste even patched gatekeeping copy); no surveyed sports title made its
lighter mode competitively first-class, and mixed-assist ladders stay calm
only while aids are speed-neutral — so under D3's deliberate edge an
unlabeled shared ranked ladder would import the crossplay aim-assist
controversy. Chess's co-equal per-format rating ladders are the
best-documented model for two first-class worlds in post-MVP MP; for MVP
single-player boards, transparent world badges plus optional Pro-only
prestige boards cover the gap.
**Feeds:** the open world-naming fork (★ purpose-/identity-framed DE-first
pair, never depth-scale names) and competitive-labeling fork (★ one main
board with a prestige-neutral world badge + opt-in Pro-pure prestige boards),
both carried by GD-0046; switch-UX input to ADR-0138.
**Raw capture:** [[raw-perplexity/raw-mode-choice-switching-and-competitive-labeling-2026-07-02]]

### 9. [[dual-mode-vault-delta-reconciliation-2026-07-02]]

Internal audit (no external research, no raw capture): where the decided
two-worlds path touches the existing vault. Of ~60 notes referencing the
Quick/Standard/Expert trio, most are no-change or one-line wording deltas
because D1 keeps the internal tier vocabulary canonical (ADR-0055 slot
sizing, ADR-0082 disclosure bands need zero renames). Structural work
concentrates in [[../50-Game-Design/progressive-disclosure-ui]] (world layer,
D3 envelope, D2 guarantees), the tactics pair (Easy dial-to-contract
compiler) and the onboarding mapping table. Three real semantic conflicts:
"Easy world" vs the existing Easy **difficulty** axis (C1), the undefined
Quick-vs-Standard surface inside the Easy world (C2, new fork), and the
future-scope per-area override crossing the world boundary (C4). Cheapest
mechanism: one binding branding/mapping cover note plus targeted edits, not a
vault-wide rename.
**Feeds:** the Stage-2 edit plan and ordering; GD-0046's conflict handling;
the per-area-override and competitive-labeling forks.
**Raw capture:** none (sourceType: internal).

### 10. [[asymmetric-interface-fairness-multiplayer-2026-07-02]]

What D3's bounded edge means in post-MVP async MP. Competitive games resolve
interface asymmetry by segregating, normalizing or accepting it as skill —
and the split tracks *why* the asymmetry exists: device-imposed capability
gaps force segregation, while **freely chosen decision-depth asymmetry is
broadly accepted as skill**, which is FMX's case (same tactic contract, mode
is a choice). Hattrick's 20-year async precedent openly markets the D3
promise without engagement-segregated leagues; fairness-perception research
says the danger is an **invisible or opaque** edge, not a bounded one; the
async structure turns the 52–57 % head-to-head into season-scale table drift
rather than legible per-match beatings.
**Feeds:** the open MP-treatment fork (★ mode-blind unified competition with
strong mode transparency — visible badge + per-match mode log — rather than
segregated ladders or normalization boosts), carried by GD-0046/ADR-0138;
labeling input to the competitive-labeling fork.
**Raw capture:** [[raw-perplexity/raw-asymmetric-interface-fairness-multiplayer-2026-07-02]]

## Critic follow-ups (2026-07-02) — gaps flagged by the adversarial review

### 11. [[mode-state-contract-placement-and-integrity-2026-07-02]]

Where the four new mode fact families live contractually: (1) world/tier
**preference**, (2) **per-run/per-competition world snapshot** + mode log,
(3) per-area **consent/delegation assignments** + act-and-report feed, (4)
**MP group mode composition**. Finds the vault already has the machinery —
the gap is assignment, not invention: preference vs competitive record split
across owners (Lichess/Valorant pattern; ADR-0090 already carves LWW
preferences from server-authoritative state), snapshots on the rated units
League Orchestration owns (Forza per-entry assist flags, BG3 one-way
downgrade), and integrity via command-derived facts rather than client-
asserted flags (per ADR-0115/ADR-0116).
**Feeds:** ADR-0138 directly (this packet is its evidence base); consent-fact
placement input to ADR-0136; badge substrate for the competitive-labeling and
MP-treatment forks.
**Raw capture:** [[raw-perplexity/raw-mode-state-contract-placement-and-integrity-2026-07-02]]

### 12. [[off-pitch-parity-measurement-economy-loop-2026-07-02]]

Whether Wave-1's match-slice parity machinery honestly transfers to
multi-season, compounding areas (transfers, finance/stadium timing, training,
scouting). It does **not** transfer wholesale: no documented expert benchmark
exists for long-horizon management decisions anywhere in the comparable-games
record, the academic long-horizon literature uses scripted expert heuristics
plus outcome distributions rather than best-response anchors, and
feasibility is area-uneven (optimizer anchors realistic for stadium/financing
timing and training; transfers/scouting are adversarial and combinatorial —
exactly where FM's delegated quality collapses). Honest v1: a **two-class
anchor scheme** — optimum-relative gates where computable,
reference-relative corridors (scripted `E_ref` + soak distributions + a hard
no-domination invariant) elsewhere — with the anchor class a first-class
field in the new `assist.*` slot family.
**Feeds:** D3's claim strength per area under the D4 sweep; the
parity-band-numbers fork; ADR-0135's slot family and the GD-0043
gameplay/economy runbook split.
**Raw capture:** [[raw-perplexity/raw-off-pitch-parity-measurement-economy-loop-2026-07-02]]

## Consolidated open forks → Stage-2 carriers

The corpus leaves eight forks open for Nico. Each is carried — with the
research ★-recommendation restated as a recommendation, not a decision — by
one of the Stage-2 notes:
[[../50-Game-Design/GD-0046-two-worlds-mode-model|GD-0046]],
[[../10-Architecture/09-Decisions/ADR-0135-tier-parity-and-assist-strength-calibration-contract|ADR-0135]],
[[../10-Architecture/09-Decisions/ADR-0136-delegation-to-staff-contract|ADR-0136]],
[[../10-Architecture/09-Decisions/ADR-0137-stadium-construction-and-expansion-contract|ADR-0137]],
and
[[../10-Architecture/09-Decisions/ADR-0138-mode-state-placement-and-integrity|ADR-0138]].

| # | Open fork | ★ recommendation (not a decision) | Stage-2 carrier | Grounding |
| --- | --- | --- | --- | --- |
| 1 | **Delegation model shape + consent ladder** | Throttled per-area delegation to named staff (OOTP shape, throttled-expert executor, staff skill sets throttle) with a `manual`/`propose`/`delegate` consent ladder, deterministic execution, never-overwrite pins | ADR-0136 | [[management-delegation-and-easy-mode-surfaces-2026-07-02]], [[assisted-play-parity-auto-coach-2026-07-01]] |
| 2 | **Stadium expansion model choice** | One construction-project FSM contract now (Option B); Quick wizard as the Easy compile-down over the same contract; plot-based Expert builder deferred post-MVP | ADR-0137 | [[stadium-construction-expansion-models-2026-07-02]] |
| 3 | **Competitive labeling** | One main leaderboard with a prestige-neutral world badge per entry, plus opt-in Pro-pure prestige boards; mid-competition switches re-badged, never blocked or silent | GD-0046 (badge substrate: ADR-0138) | [[mode-choice-switching-and-competitive-labeling-2026-07-02]], [[asymmetric-interface-fairness-multiplayer-2026-07-02]] |
| 4 | **MP treatment** | Mode-blind unified competition with full transparency (visible mode badge + per-match mode log); co-equal per-world ladders as documented large-population alternative | GD-0046 / ADR-0138 | [[asymmetric-interface-fairness-multiplayer-2026-07-02]], [[mode-choice-switching-and-competitive-labeling-2026-07-02]] |
| 5 | **World naming (player-facing pair, DE-first)** | Purpose-/identity-framed pair, never depth-scale "Easy/Profi"; placeholder pairs listed in GD-0046 pending IP-clean check and DE-first copy test | GD-0046 | [[mode-choice-switching-and-competitive-labeling-2026-07-02]], [[dual-mode-vault-delta-reconciliation-2026-07-02]] (conflict C1) |
| 6 | **Parity band numbers (D3 envelope constants)** | Keep R ≈ 0.85–0.95 / head-to-head 52–57 % as the evidence-shaped starting envelope; final numbers only from the calibration harness under the GD-0043 slot machinery, with per-area anchor classes declared | ADR-0135 (player-facing framing: GD-0046) | [[tier-parity-measurement-calibration-2026-07-01]], [[off-pitch-parity-measurement-economy-loop-2026-07-02]] |
| 7 | **Preset count / aggressiveness mapping** | 6–8 hand-tuned presets in a soft-counter cycle over the 8 opposition archetypes; one macro aggressiveness dial → per-preset (mentality, pressing) lookup | GD-0046 | [[tactic-preset-coverage-and-counters-2026-07-01]] |
| 8 | **Per-area override ("Easy everywhere except Pro tactics")** | Keep future-scope, additionally gated on forks 3–4; if it ever ships, parity-gate whole-mode policy families plus at most 2–3 sentinel override combos | GD-0046 (consent facts: ADR-0136/ADR-0138) | [[dual-mode-precedents-sports-management-2026-07-01]], [[tier-parity-measurement-calibration-2026-07-01]], [[dual-mode-vault-delta-reconciliation-2026-07-02]] (conflict C4) |

The vault-delta audit also surfaced a ninth, smaller fork — the
Quick-vs-Standard surface *inside* the Easy world (conflict C2) — which
GD-0046 carries alongside the world-naming question.

## Inputs For Decisions

- ADR input: ADR-0135, ADR-0136, ADR-0137 and ADR-0138 each restate the
  relevant ★-recommendations from this corpus as draft, non-binding options
  for Nico's ratification.
- Feature/game design input: GD-0046 is the two-worlds model SSOT candidate;
  the [[dual-mode-vault-delta-reconciliation-2026-07-02]] edit plan governs
  which existing notes absorb targeted deltas after ratification.

## Future-scope notes (classified future-scope)

- Question: per-area world override (fork 8) and co-equal per-world MP
  ladders (fork 4 alternative) are explicitly post-MVP; both re-enter via the
  forks above, not via new research.
