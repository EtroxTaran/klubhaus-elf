---
title: GD-0036 Transfer Escalation & Inactivity Pressure
status: accepted
tags: [game-design, gddr, transfer, escalation, inactivity, player-unrest, async-multiplayer, fmx-102]
created: 2026-06-07
updated: 2026-06-13
type: gddr
binding: false
linear: FMX-102
related:
  - [[../10-Architecture/09-Decisions/ADR-0088-async-escalation-fsm-and-watch-party-deadline-source-of-truth]]
  - [[../10-Architecture/state-machines/transfer]]
  - [[transfer-market-and-contracts]]
  - [[transfer-negotiations-p2p]]
  - [[async-multiplayer-private-group]]
  - [[GD-0027-hidden-attribute-substrate-mapping]]
  - [[GD-0043-gameplay-calibration-ownership-and-acceptance-gate]]
  - [[../60-Research/fmx-102-async-escalation-and-deadline-source-of-truth-2026-06-07]]
  - [[../60-Research/async-multiplayer-research]]
  - [[../30-Implementation/gameplay-calibration-and-soak-test-runbook]]
---

# GD-0036: Transfer Escalation & Inactivity Pressure

> **Status `draft`.** The gameplay-design companion to **ADR-0088** (architecture/contracts; the
> deadline source-of-truth half is purely architectural and lives there). Authored after Nico chose
> FMX-102 live (2026-06-07: escalation **D1–D4 = A/A/A/B**). All numeric magnitudes are **GD-0043
> `transfer.escalation` calibration** behind `escalationModelVersion` — this note pins *stages, feel and direction*, not
> final values. Cross-linked from `async-multiplayer-research.md §4` and
> `async-multiplayer-private-group.md §7`.

## Why this exists

A transfer saga that ends in a player going on strike should feel **earned** — the product of weeks of
being ignored — not a light-switch that flips the first time you reject a bid. Today the design
collapses the whole thing into one `escalated` lump (gap **G25**): no stages to read, nothing to tune,
and the "no instant strike" promise is just a sentence. FMX-102 turns it into a **staged, reversible
pressure system** that mirrors how real transfer stand-offs actually unfold (Suárez, Gerrard, Rooney,
Van Dijk, Kane, Mahrez — all handed-in/agitated and many *reconciled and played on*), and how every
management game (FM, EA FC, OOTP, Football Chairman) models escalating unhappiness: a ladder of stages,
advanced by accumulated pressure, that **cools off** when the pressure stops.

## 1. The escalation ladder (D1 — five stages)

Pressure climbs one rung at a time. Each rung is a recognisable football moment with its own
consequence; you can always see which rung a situation is on.

| Stage | What the world sees | Consequence (owning system applies it) |
|---|---|---|
| **S1 Expired & ignored** | Your bids keep lapsing with no reply. | Quiet — pressure starts accumulating. No player drama yet. |
| **S2 Registered interest** | The pursuing club / agent goes public ("we admire the player"). | A visible interest flag; mild mood nudge. |
| **S3 Unrest & request** | The player is unsettled and (eventually) **hands in a transfer request**. | Squad & Player/People apply unrest; a formal request is filed. |
| **S4 Media leak / strike-threat** | Leaks, agent briefings, talk of refusing to train. | A stand-off **signal** — Narrative renders the noise; it is *never* itself a strike. |
| **S5 Public unrest** | Supporters take sides; the story dominates the club. | Audience & Atmosphere reacts (fan mood, banners). |

**Every rung is reversible.** A new/improved contract, a manager reconciliation, an agreed sale, or
simply the window closing steps the situation **back down** the ladder (see §3).

## 2. How a player climbs (D2/D3 — accumulated pressure that decays)

Think of a **pressure meter** per pursuit. Things that signal "you're being ignored / I want out" add
pressure (a lapsed bid, repeatedly ignored strong interest, inactivity); the **bigger the snub, the
bigger the jump**. When the meter crosses a rung's line, the player climbs to that stage.

Crucially, the meter **leaks** when the pressure stops:

- **It cools off over time** if nothing new happens — but **later rungs cool slower** (a media
  stand-off lingers far longer than mild concern). This stickiness is deliberate.
- **A boundary has a little "give"** (you need clearly more pressure to climb than to fall back), so a
  situation doesn't flicker between two stages over one borderline week.
- **You can only climb one rung at a time**, and the strike-threat rung (S4) can **never** be reached
  from a single event — it requires sustained pressure that has already sat at S3. This is the
  hard-coded expression of *"no strike from one ignored offer."*

**Personality colours the curve** (ties into GD-0027's hidden substrate): an **ambitious** player
climbs faster and cools slower; a **loyal / professional** one tolerates far more before stirring.
Personality shifts the *thresholds*, so two players in the same situation can react differently — but
the same player in the same save always reacts the same way (see §4).

## 3. Coming back down (de-escalation)

Pressure isn't a one-way street — that's what makes it a *negotiation*, not a doom timer. Escalation
steps **down** when:

- the player **signs a new/improved contract** or is given the role they wanted;
- a **manager conversation** reconciles them (within their personality's tolerance);
- a **sale/loan is agreed** — the case freezes, the drama stops;
- the **transfer window closes** and the move is off the table for now;
- or simply **time passes with no new snub** (the meter leaks down).

Each step-down emits a clear event so the inbox/feed can say *"[Player] has recommitted after talks."*

## 4. Determinism note (D4 — seeded, replay-safe variance)

This is multiplayer and replay-safe, so escalation must reproduce identically on a re-watch. **Nico
chose seeded variance (D4 = B)**: the system stays fully replayable, but borderline calls (does a
wavering player tip over a rung this week, exactly how long do they sulk) carry a little **seeded
randomness drawn from the existing transfer RNG** — the same stream that already decides player
acceptance/refusal. The seed and the draw order are saved with the game, so two people watching the
same save see the same outcome. The randomness lives **inside the rails**: it can nudge a borderline
case, but it can **never** skip a rung or trigger a strike-threat out of nowhere — the structural gates
in §2 hold regardless. (Architecture + invariants: ADR-0088 ES1–ES5.)

## 5. Default magnitudes (provisional — `transfer.escalation`, GD-0043)

Indicative starting points to tune on a running build; **none are locked from intuition**:

| Knob | Provisional default | Owner / tunable |
|---|---|---|
| Pressure per lapsed strong-interest bid | medium increment | Transfer → `transfer.escalation` |
| Pressure per ignored-complaint / inactivity tick | small increment | Transfer → `transfer.escalation` |
| Decay rate — early stages (S1–S2) | faster leak | `transfer.escalation` |
| Decay rate — late stages (S4–S5) | slower leak (sticky) | `transfer.escalation` |
| Hysteresis gap (climb vs fall-back) | modest band | `transfer.escalation` |
| `pressureSinceStageEntry` to reach S4 (strike-threat) | high, multi-event | `transfer.escalation`; **gate is structural, not just numeric** |
| Seeded-variance bound on borderline tips | small, bounded | `transfer.escalation` (drawn from existing `TransferRng`) |
| Personality threshold modifiers (ambition/loyalty) | ± band | `transfer.escalation` (via GD-0027 substrate) |

## 6. Reserved for later (post-MVP)

- Escalation that spans **multiple windows** with long-memory grudges (real sagas often do).
- Squad-wide **dressing-room contagion** (a star's unrest nudging teammates), à la FM.
- Manager **promise tracking** as an explicit pressure input (broken promise → jump), beyond the
  bid/inactivity inputs in MVP.

## Calibration slot (FMX-141)

- Slot: `transfer.escalation`
- Parameter pack: `escalationModelVersion`
- Harness: T0 exact replay for pressure-stage transitions + T1/T2 transfer saga
  sweeps in [[../30-Implementation/gameplay-calibration-and-soak-test-runbook]].
- Metrics: pressure increments, decay, hysteresis, stage dwell, reversibility,
  seeded edge variance and no-instant-strike invariant.
