---
title: GD-0025 In-Match Controls & Live-Control Kit
status: accepted
tags: [game-design, gddr, ux, mobile, match, controls, halftime, shouts, fmx-100]
context: match
created: 2026-06-03
updated: 2026-06-13
type: game-design
binding: false
related: [[README]], [[GD-0016-mobile-ux-loop]], [[GD-0017-mvp-scope-and-mode-sequencing]], [[GD-0004-tactics]], [[GD-0002-match-engine]], [[match-engine]], [[progressive-disclosure-ui]], [[GD-0043-gameplay-calibration-ownership-and-acceptance-gate]], [[../30-Implementation/gameplay-calibration-and-soak-test-runbook]], [[../10-Architecture/09-Decisions/ADR-0072-in-match-control-seam]], [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]], [[../10-Architecture/09-Decisions/ADR-0024-match-renderer-abstraction]], [[../10-Architecture/state-machines/match]], [[../60-Research/in-match-controls-and-presentation-2026-06-03]]
---

# GD-0025: In-Match Controls & Live-Control Kit

## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `draft`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

> **History (pre-ratification banner, demoted 2026-06-11 per ADR-0092 / FMX-143):**
> **Draft / `binding: false`.** Resolves the gameplay half of GD-0016 **R2-16**
> (match-controls UX). Decisions D1–D4 below were put to Nico live on 2026-06-03
> (ask-first gate) and chosen; the document as a whole awaits ratification, and the
> finer values flagged **(playtest / Nico-gated)** are not locked. The
> engine↔renderer architecture seam is in
> [[../10-Architecture/09-Decisions/ADR-0072-in-match-control-seam]]. Implement
> gameplay only once `approved`.

## Date

2026-06-03

## Player experience goal

The match is the emotional core of the first playable. The player should feel like
a touchline manager with a small set of **expressive, legible, one-handed** moves —
not a desktop tactics matrix. One interaction tier ships first: powerful enough to
matter, thin enough to use at a tram stop, consistent with the GD-0016 one-handed /
one-primary-action loop.

## Decided / strong (proposed)

### D4 — MVP live-control kit (one interaction tier)

Ships the **Full kit**. Five control groups, all reachable in the bottom thumb
zone, ≤~6 visible HUD affordances:

1. **Substitutions** — queue multiple → **Confirm** → **pending badge**; the swap
   applies at the next dead-ball (heavy command). Bench strip + tap-starter →
   tap-bench → swap preview. Max queued subs follows competition rules
   **(value Nico-gated; default 5 + window rules deferred to Regulations
   coupling)**.
2. **Mentality / game-plan preset** — discrete presets *Defensive / Balanced /
   Attacking / All-Out* (light command, next tick). No live sliders mid-match.
3. **Formation swap** — switch among **pre-saved shapes** prepared before the match
   (heavy command, next dead-ball). No free drag-editing during live play
   (that stays one level deep / pre-match, per GD-0004).
4. **Shouts** — exactly **3**, as cooldown abilities: *Encourage / Attack More /
   Tighten Up* (light command, next tick). Each shows available/cooling state with
   a cooldown ring + a feedback banner + at least one commentary line on apply.
   Cooldown length + mechanical effect magnitudes are **provisional / playtest-
   tunable** (see Shout-effect contract).
5. **Speed & pause** — **3 discrete speeds** (1× / 2× / 3×) **(step count Nico-gated:
   3 vs 4)** + **free pause** any time, plus auto-pause on key events (goal, red
   card, halftime). Speed is presentation only; pause is operational (D2).

A **Key-Highlights vs Commentary-Only** follow mode is offered at match start and in
settings; an "instant result" skip lives under a More menu, never in the main HUD
(accidental-skip guard).

### Halftime modal

A **hard-pause planning hub** (no countdown), realised as a bottom sheet:

- **Header:** score, minute, one short summary line (e.g. "Dominating possession,
  few clear chances").
- **Body:** starting XI list with condition + rating; bench strip for subs.
- **Actions (thumb zone):** one **primary** *Start Second Half*; secondary *Make
  Subs / Adjust Mentality / Change Formation / Send Shout / Open Full Editor*.
  Satisfies the match-FSM "halftime modal (3 controls minimum)" requirement
  ([[../10-Architecture/state-machines/match]] §4) — exact secondary set is
  **Nico-gated** (recommended: Subs + Mentality + Formation as the three minimum,
  Shout + Full Editor as overflow).
- **A11y / motion:** WCAG 2.2 AA — ≥24px targets (primary ≥44px), focus-trap
  (focus in, background inert, ESC returns focus), focus appearance (2.4.11);
  `prefers-reduced-motion` → fade/instant, no slide.

### Shout-effect contract (provisional)

Each shout is a bounded, deterministic team-level modifier applied as a *light*
command at the next tick (never mid-tick), with a cooldown and a finite effect
window. Effect = small modifiers on team intensity / pressing / mentality-leaning
weights — **NOT** stat cheats and **NOT** prose feeding mechanics. All magnitudes,
cooldown lengths and windows are **provisional `match.liveControl` calibration
inputs under [[GD-0043-gameplay-calibration-ownership-and-acceptance-gate|GD-0043]]**,
not locked constants (mirrors the GD-0019 "ship hooks, tune later" stance):

| Shout | Provisional intent | Provisional cooldown | Effect window |
|---|---|---|---|
| Encourage | small morale/composure lift | ~10–15 sim-min | a few sim-min |
| Attack More | mentality-lean attacking, higher tempo | ~10–15 sim-min | until changed/decay |
| Tighten Up | mentality-lean cautious, compactness | ~10–15 sim-min | until changed/decay |

Every shout must produce visible feedback (banner + commentary) to avoid the
genre's "shouts do nothing" complaint.

### Accessibility path (binding intent)

Text & Stats is the **accessible/screen-reader path**: the animated canvas is
decorative for assistive tech; DOM exposes score/clock/event-log + stats with
ARIA-live (polite routine / assertive goals) and a verbosity toggle. The match clock
is an essential real-time event (WCAG 2.2.1 exception) because the free pause exists.

## Open (Nico-gated / playtest)

- Exact halftime secondary-action set + ordering.
- Speed-step count (**3 vs 4**) and labels.
- Shout cooldown lengths + effect magnitudes + decay (`match.liveControl`
  calibration slot).
- Max queued subs + competition-rule / Regulations coupling.
- Whether mentality presets expose a 5th "Contain"/"Park the bus" step.
- Per-UI-tier exposure (Quick/Standard/Expert per [[progressive-disclosure-ui]]):
  MVP ships one tier; tier gating of the kit is reserved.

## Rationale

Cross-game evidence ([[../60-Research/in-match-controls-and-presentation-2026-06-03]]
§1) shows a thin, expressive kit + strong feedback + halftime-as-decision-beat is
what works on mobile, and that scaling down a desktop matrix is what fails. Shouts
add cheap expressive feel but their effects need balancing, so the contract ships
with hooks + provisional values and defers magnitudes to playtest.

## Consequences

Positive: a legible, one-handed, feedback-rich match that fits the GD-0016 loop and
gives the first playable a strong headline surface.

Negative / constraints: shout-effect magnitudes + several values are calibration
debt owed to the `match.liveControl` slot in
[[GD-0043-gameplay-calibration-ownership-and-acceptance-gate|GD-0043]]; one tier
only at MVP (richer tactical depth is reserved).

## Calibration slot (FMX-141)

- Slot: `match.liveControl`
- Parameter pack: `liveControlModelVersion`
- Harness: T0 exact replay for command timing + T1/T2 intervention scenario
  sweeps in [[../30-Implementation/gameplay-calibration-and-soak-test-runbook]].
- Metrics: effect latency, xG swing after shout/control change, fatigue delta,
  cooldown length, effect decay and player-visible feedback timing.

## Supersedes

None. Resolves GD-0016 **R2-16** (match-controls gameplay half).

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0072-in-match-control-seam]] — the
  intervention DTO, determinism seam, render thread + perf-validation.
- [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]] — client-state +
  worker bridge the controls ride on.

## Related

- Research: [[../60-Research/in-match-controls-and-presentation-2026-06-03]]
  (+ four raw captures).
- Game design: [[GD-0016-mobile-ux-loop]] · [[GD-0004-tactics]] · [[match-engine]] ·
  [[progressive-disclosure-ui]]
- [[README]] — hub.
