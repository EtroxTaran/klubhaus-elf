---
title: ADR-0145 Singleplayer self-manipulation & paid-advantage boundary (victimless sandbox)
status: proposed
tags: [adr, architecture, singleplayer, multiplayer, monetization, fairness, responsible-gaming, save-trust, fmx-246, fmx-230, fmx-228]
context: [audit-security, club-management-economy]
created: 2026-07-23
updated: 2026-07-23
type: adr
binding: false
linear: [FMX-246, FMX-230]
supersedes:
superseded_by:
related:
  - [[ADR-0011-server-authoritative-multiplayer]]
  - [[ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
  - [[ADR-0063-investor-entitlement-and-payment-boundary]]
  - [[ADR-0122-responsible-gaming-and-dark-pattern-invariant]]
  - [[ADR-0116-save-trust-levels-and-provenance-posture]]
  - [[ADR-0142-continuum-type-immutability-lifecycle-late-join]]
  - [[../../50-Game-Design/singleplayer-baseline]]
  - [[../../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]]
---

# ADR-0145: Singleplayer self-manipulation & paid-advantage boundary (victimless sandbox)

## Status

proposed

Authored `proposed` per the never-self-accept rule; Nico ratifies. `binding: false`.
FMX-246 (Cluster B / epic FMX-228), run through the Research / Decision loop. Draws the line
FMX-246 (thought T17) left open — how far a **singleplayer** player may pay for, or self-apply,
advantage/manipulation — by reconciling the binding fairness/monetization/responsible-gaming/
save-trust records. Grounded by a vault synthesis (ADR-0011/0108/0063/0122/0116, GD-0041,
singleplayer-baseline) + external precedent (FM paid In-Game Editor for offline play; OOTP
free commissioner "god mode"; industry norm: offline editing is victimless customization,
cheating only online). The SP↔MP boundary itself is consolidated in the companion reference
note [[../sp-mp-boundary-reference]] (confirm-and-point on binding ADR-0011).

## Context

The vault already permits **isolated singleplayer paid assistance** (ADR-0108: *"real money may
unlock … strictly isolated singleplayer assistance, but it must have zero effect on competitive
shared state"*; ADR-0063: the Investor **singleplayer clean-cash grant**) and already ships
state-altering singleplayer toggles (singleplayer-baseline §8: *"casual finance mode"*, time
travel). Yet singleplayer-baseline §2 states *"Cheat modes are not supported (per safety rules)."*
The word **"cheat" is undefined** and does rhetorical, not definitional, work — §8 already sells
the very state-altering advantages §2 rhetorically forbids, and ADR-0063's Investor is itself a
paid state injection. FMX-246 (T17) asked to decide, deliberately: where does permitted SP
advantage end and prohibited manipulation begin?

Key finding: **singleplayer is victimless.** An SP save is `singleplayer_only` (ADR-0063), can
**never** seed or enter multiplayer (ADR-0011's binding SP/MP wall), and any modified/assisted run
loses official public standing (ADR-0116 `invalid-or-modified` → *"remain playable as local/casual/
sandbox saves"*, stripped of `eligible-public`). Therefore ADR-0108's competitive-fairness test
(*"zero effect on competitive shared state"*) passes trivially for anything SP-internal — ADR-0108
does not constrain SP-internal advantage; it only fences SP off from MP. The **only** invariant
that still binds an isolated SP save is **ADR-0122 responsible-gaming** (no paid randomness, no
dark patterns, no *"paid relief from pressure the product created"*), which binds independently of
the monetization SKUs (ADR-0122 §D7).

## Decision — victimless sandbox: one wall + one gate

Singleplayer MAY offer broad self-advantage and self-manipulation — free toggles, the paid Investor
(ADR-0063), and an optional editor-class tool — as **explicit, opt-in, clearly-labelled** features.
Because SP is victimless, exactly **two** constraints apply, and no third:

- **The wall (unchanged, binding ADR-0011):** none of it may seed, enter, or advantage
  multiplayer. MP is server-born and never accepts an SP payload. This ADR changes nothing here.
- **The gate (binding ADR-0122):** every SP advantage/manipulation feature stays inside the
  responsible-gaming envelope — **no paid randomness, no dark patterns, no manufactured-pressure-
  relief-for-sale, no confirmshaming/false-scarcity**. Paid SP advantage must be a fixed-price,
  deterministic, mechanically-transparent purchase (the Investor pattern), never a gacha/pressure loop.

- **Consequence, not a third constraint (derived, ADR-0116):** applying any manipulation or paid/
  free advantage **auto-derives** a save-trust downgrade (`invalid-or-modified` / assisted), which
  **permanently** bars that run from seeding MP and from any `eligible-public` surface (Hall of
  Fame, leaderboards, official comparisons). The player is never blocked from playing; they simply
  forfeit competitive/public standing for that run. This is derived from existing state, not an
  upfront choice the player must pre-commit.

### Definitions (fills the vocabulary gap FMX-246 surfaced)

- **Assistance** — automation or advice for actions the player could already perform manually
  (delegation to staff, auto-training/line-ups, recommendations, auto-sim). Governed by
  singleplayer-baseline §4; **never** downgrades trust (the player retains authority; the assistant
  never overrides a manual decision).
- **Self-manipulation (sandbox)** — opt-in, labelled changes to the save's own state that a player
  could **not** reach through normal play (editor edits, clean-cash Investor, "casual finance mode",
  time-travel, difficulty/realism benders). **Permitted in SP**, bounded by the gate, and
  trust-flagged per the consequence above.
- **"Cheat" (retired term)** — no longer used as a feature category. What §2 called "cheat modes"
  is either (a) permitted, labelled sandbox self-manipulation, or (b) a responsible-gaming
  violation (paid randomness / dark pattern) — which is forbidden for an entirely different reason
  than "cheating". The rhetorical term is dropped to remove the §2-vs-§8 contradiction.

## Lockstep touch (applied in this PR)

- **singleplayer-baseline §2** — retire *"Cheat modes are not supported (per safety rules)"* and
  reframe as: singleplayer supports explicit, opt-in, clearly-labelled sandbox/casual customization
  (state benders, editor-class tools, the Investor), bounded by ADR-0122 and trust-flagged per
  ADR-0116; nothing is a hidden or unsupported "cheat". (singleplayer-baseline is `draft`/
  `binding: false`; the reframe is additive and attributed to this proposed ADR.)

## Invariants (normative)

- **S-a (MP wall untouched):** ADR-0011 binds verbatim — no SP advantage of any kind reaches MP.
- **S-b (victimless scope):** SP-internal advantage has no competitive victim; ADR-0108's shared-
  state test is satisfied by isolation, so it imposes no SP-internal limit.
- **S-c (responsible-gaming is the sole limiter):** ADR-0122 fully binds SP; paid SP advantage is
  fixed-price + deterministic + transparent, never random/pressure-based.
- **S-d (trust is derived, play is never blocked):** manipulation/advantage derives an ADR-0116
  downgrade that forfeits MP-seeding + public eligibility; it never prevents continued solo play.
- **S-e (labelling):** every SP advantage/manipulation surface is explicit, opt-in, and labelled
  (GD-0041 SP-boundary condition 3); none is default-on or disguised as legitimate progression.

## Consequences

- Removes the standing §2-vs-§8 contradiction and gives "assistance / manipulation / cheat" real
  definitions the whole vault can point to.
- Confirms the Investor (ADR-0063) and the §8 casual toggles as first-class, principled examples of
  the same victimless-sandbox rule rather than grandfathered exceptions.
- Leaves room to later ship an optional editor-class tool (FM precedent) without a new fairness
  decision — the wall + gate + trust-flag already bound it.
- Changes nothing about MP, monetization no-P2W (GD-0041), or responsible-gaming (ADR-0122); those
  bind unchanged.

## Alternatives considered

- **B — assistance-only bright line** (SP may only automate/advise, no state edits; §8 toggles +
  Investor as named exceptions): rejected — contradicts the already-shipped §8 toggles and the
  Investor precedent, and denies the victimless logic without a fairness reason.
- **C — two-tier per-save Integrity/Sandbox declaration** (player pre-commits each save):
  rejected as the primary model — adds an upfront choice where ADR-0116 already derives the same
  trust downgrade automatically; kept in reserve if a dedicated "verified SP" public surface later
  needs an explicit opt-in.
