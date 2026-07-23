---
title: Singleplayer ↔ Multiplayer boundary — consolidated reference
status: accepted
tags: [reference, architecture, singleplayer, multiplayer, boundary, fmx-246, fmx-230]
context: [offline-sync]
created: 2026-07-23
updated: 2026-07-23
type: reference
binding: false
linear: [FMX-246, FMX-230]
related:
  - [[09-Decisions/ADR-0011-server-authoritative-multiplayer]]
  - [[09-Decisions/ADR-0142-continuum-type-immutability-lifecycle-late-join]]
  - [[09-Decisions/ADR-0145-singleplayer-self-manipulation-and-paid-advantage-boundary]]
  - [[../50-Game-Design/singleplayer-baseline]]
  - [[../50-Game-Design/async-multiplayer-private-group]]
---

# Singleplayer ↔ Multiplayer boundary — consolidated reference

**Confirm-and-point.** This note is a single place to read the Singleplayer (SP) ↔ Multiplayer
(MP) boundary. It **decides nothing new** — the binding source of truth is
[[09-Decisions/ADR-0011-server-authoritative-multiplayer]] (`status: accepted`, `binding: true`).
Where records stated the same rule with drifting wording, the canonical phrasing is fixed here and
should be used going forward. Produced for FMX-246 (Cluster B).

## Status of the underlying records (read honestly)

| Record | Status | Role in this boundary |
|---|---|---|
| ADR-0011 server-authoritative-multiplayer | **accepted / binding** | **SSOT** — the wall, MP start lifecycle, offline-conflict policy, determinism |
| ADR-0142 continuum-type immutability | proposed / non-binding | type write-once, `dormant`, late-join — **awaiting ratification** |
| ADR-0145 SP self-manipulation & paid-advantage | proposed / non-binding | the victimless-sandbox SP advantage line (companion to this note) |
| singleplayer-baseline.md | draft / non-binding | descriptive SP capabilities; not ratified — ADR-0011 binds |
| async-multiplayer-private-group.md | draft / non-binding | descriptive MP-group behaviour; not ratified — ADR-0011 binds |

## The rule, canonically

### 1. SP and MP are absolutely separate (canonical phrasing)

> **Singleplayer and multiplayer are absolutely separate.** Singleplayer, hotseat, local and
> imported saves are non-competitive authority classes and must never **seed, enter, or mutate**
> server-authoritative multiplayer state.

Source: ADR-0011 §"Mode separation amendment (FMX-189 outcome)". Origin/provenance: FMX-189
decision record + investor-mp-transition research. Use the verb triple **"seed, enter, or mutate"**
as canonical (records elsewhere say "seed or join" / "seed or enter" — same rule).

### 2. MP is server-born; never seeded from SP (canonical seed-blocklist)

MP create/join/import APIs MUST reject, with a typed policy reason **before any domain mutation**,
any attempt to use as MP seed data an SP-authority payload. Canonical enumeration (union of the
three drifting lists in ADR-0011):

> singleplayer/hotseat/portable-import/local **save exports**, and any SP-scoped **roster, squad,
> progress, cash/ledger, transfer budget, standings, fixtures/schedule, history, or entitlement
> payload**.

This is a **product/fairness rule**, not merely an anti-cheat detail. MP state is *born on the
server* and advanced only by validated MP commands. Source: ADR-0011 §Mode-separation + §Compliance.

### 3. Continuum type is immutable (no in-place SP↔MP conversion) — *proposed*

`continuum_type ∈ {singleplayer, multiplayer}` is write-once; no command converts a Continuum
between SP and MP in place. A future MP→SP export (if ever scoped, per ADR-0011) **mints a new SP
Continuum** from a copy — never an in-place mutation. Source: ADR-0142 (**proposed** — mark as
pending ratification; do not cite as settled canon yet).

### 4. MP start lifecycle (server-authoritative)

1. Players create or join an MP lobby/group.
2. The server authenticates members and creates the MP save/session from **MP-owned setup state**.
3. Clients submit **only** multiplayer commands.
4. The server validates against MP state and is the **only** authority for matches, transfers,
   training, fixtures, squads, standings, economy, and shared history.

Source: ADR-0011 §"Mode separation amendment". (async-mp §2 describes the admin-driven group-setup
form; async-mp §10 is the group lifecycle FSM, reconciled by ADR-0142 adding `dormant`.)

### 5. Offline-conflict policy (MVP)

A queued offline command replayed against server state that has moved on is **hard-rejected** with
a typed reason (`state_changed` · `resource_unavailable` · `deadline_passed` · `forbidden`) and the
new state is surfaced for the player to redo. **No auto-rebase at MVP.** Source: ADR-0011 §"Offline
conflict policy". *(Stale-state commit UX — warn-and-proceed vs hard-reject — is the open question
tracked in FMX-248, not decided here.)*

### 6. Determinism & authority

MP matches are **always server-simulated**; the engine is deterministic given seed + lineups +
tactics, so any match re-sims from its pinned `engine_id`/`contract_version`/`rng_version`. SP is
**server-confirmed at MVP**, and may become local-authoritative only in a later selective-offline
phase. Source: ADR-0011 §"AI vs AI match policy" + singleplayer-baseline §6.

## What SP is (pointer)

SP is the **full, pausable, single-player reference experience** — all actions delegable to
assistants, save/pace freely, opt-in casual/sandbox customization. Its self-manipulation &
paid-advantage boundary (the "victimless sandbox — one wall + one gate" rule) is decided in
[[09-Decisions/ADR-0145-singleplayer-self-manipulation-and-paid-advantage-boundary]]. Descriptive
detail lives in [[../50-Game-Design/singleplayer-baseline]] (draft).

## Related open Cluster-B questions (not decided here)

- **FMX-247** — SP-variance/glory vs MP-determinism as a deliberate design dial.
- **FMX-248** — stale-state commit UX (warn-and-proceed vs hard-reject).
- **FMX-249** — co-managed single-club (multi-human) model, or mark it a non-goal.
