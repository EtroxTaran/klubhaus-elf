---
title: ADR-0143 Roguelite Run-end world persistence (living world + guardrails)
status: proposed
tags: [adr, architecture, world-lifecycle, continuum, roguelite, persistence, mp-fairness, fmx-245, fmx-228]
context: [league-orchestration, identity-access]
created: 2026-07-23
updated: 2026-07-23
type: adr
binding: false
linear: [FMX-245, FMX-228]
supersedes:
superseded_by:
related:
  - [[ADR-0139-persistent-container-ubiquitous-language]]
  - [[ADR-0079-dynasty-board-ownership-and-bankruptcy]]
  - [[ADR-0051-manager-and-legacy-context]]
  - [[ADR-0052-people-persona-and-skills-context]]
  - [[ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
  - [[../../50-Game-Design/GD-0044-create-a-club-roguelite-run-tuning]]
  - [[../../50-Game-Design/mode-create-a-club-roguelite]]
---

# ADR-0143: Roguelite Run-end world persistence (living world + guardrails)

## Status

proposed

Authored `proposed` per the never-self-accept rule; Nico ratifies. `binding: false`.
FMX-245 (epic FMX-228), run through the Research / Decision loop; grounded by a dynamic
research workflow (Dwarf Fortress/Cataclysm persistent-world-across-characters + FM/OOTP
career continuity + Hades/Nemesis/CK entity-memory + a fairness/DDD analysis).

## Context

Nico (T16/T31/T34): after a roguelite Run ends (bankruptcy / control-loss), the **Continuum**
should keep the old club (rescued or asset-stripped but present) and the youth star you raised,
and your next Run could re-sign him via a personal connection — versus today's model
(mode-create-a-club-roguelite §1/§6 permadeath + squad/reputation reset; §5 legacy is a
read-only echo; GD-0044 caps carries; ADR-0108 forbids mechanical carry-advantage).

The load-bearing insight: the permadeath "tension" is a category error that predates ADR-0139.
**Permadeath belongs to the Run; persistence belongs to the Continuum.** Once those are separate
aggregate lifecycles, Nico gets both with almost no new mechanics, and ADR-0108 stays provably
intact. Research validated this exact hybrid (persistent world hosting sequential characters,
entity memory that is relational not mechanical) and flagged the one pitfall the guardrail
already closes: never let persistence become a stat carry.

## Decision — Living World + Guardrails (Option B; Option C armed-later)

Permadeath is a property of the **Run** (manager-and-club tenure), not of the **Continuum**
(ADR-0139). A Run ends irrevocably; the world it lived in persists.

### D-A — The old club persists as ordinary Continuum world-state via existing FSMs

On Run-end the human's manager-tenure/BoardRelationship terminates (the one genuinely new seam:
`ManagerTenureDetached`). The club is **not deleted** — it becomes an AI-controlled Continuum
club and its fate resolves through **already-decided ADR-0079 branches**, mapped by cause:

- **Control-loss (solvent) / retirement** → *survives-as-AI* under an `OwnerProfile`; a new AI
  manager takes the BoardRelationship. Cleanest "club survives" case, no insolvency path.
- **Insolvency** → ADR-0079 `InsolvencyCase` FSM → **`ClubRescued`** or **Asset-Stripper**
  takeover (survives-but-stripped).
- **Forced dissolution / liquidation** → `ClubLiquidated → PhoenixClubFounded` stays **RESERVED
  post-MVP** (ADR-0079 DB9); for MVP the detachment path tops out at administration / rescue /
  asset-strip, players dispersing as free agents/transfers rather than vanishing.

Club-fate reuses ADR-0079's `WorldAiMgmtRng` sub-labels — **no new RNG stream**; determinism free.

### D-B — Former players persist as living, re-signable entities

The star you raised persists as an ordinary Squad/Player entity in the **same Continuum** — ages,
develops and transfers under AI World Simulation, and is **genuinely re-signable** by a new Run
through normal Transfer/Contracts negotiation, **at current market value, no discount, no
exclusivity, no preserved squad value**. This upgrades mode §5 from an inert read-only echo to a
*living but non-advantaging* entity. Because it is same-save in-Continuum state, re-signing is an
ordinary deterministic in-save transfer that **never crosses ADR-0051's cross-save boundary** —
strictly safer than the old cross-save echo. Re-sign is **same-Continuum only**; wanting the star
in a *different* Continuum stays cross-save meta and remains read-only/narrative (ADR-0051 +
GD-0044 §5).

### D-C — "Personal connection" = data on the world, zero mechanical effect (MVP)

The connection is a **read-only `Relationship` edge in the People context (ADR-0052)** between the
manager identity and the Player, carrying provenance ADR-0052 already owns ("developed-by /
managed-at Club X, seasons N–M"). At MVP it delivers **recognition + narrative only**: a
"Homecoming" reunion beat, a cosmetic *Protégé of [Manager]* tag, unique press lines, a
club-history entry. It is **not a stat** — it does not lower his fee, cut wage demands, alter
availability, or raise sign-on odds.

**Binding ADR-0108 zero-effect constraint:** given identical authoritative inputs + seed,
competitive outputs must be identical whether or not the connection edge exists — enforced by a
property-based zero-effect test ("strip/shuffle relationship edges → identical competitive
outputs") in the ADR-0108 CI gate.

Any future mechanical "warmth" lever (a willingness-gate flipping a hard refusal; asymmetric info
reveal) is authored **declare-now / arm-later**: it **must** be symmetric (AI rivals get the same
lever from their own histories → a world rule, not a player privilege), **MP-off**, and
**Nico-gated**. Out of MVP scope.

### Orthogonality invariant (the whole safety argument)

Two facts must **never** touch: (1) the Continuum retains the old club + players as living state;
(2) the new Run starts from the GD-0044 baseline (1→3 functional carry slots; no
finance/squad/reputation boost). Persistence of your old star does **not** feed the new Run's
starting package. This orthogonality is the invariant to test.

## Preserves (does not reopen)

- **mode §1 permadeath** — the Run still ends irrevocably (no undo). Add a clarifying sentence:
  permadeath is a **Run** property; the Continuum persists the world.
- **mode §6 / GD-0044 carry caps** — the reset (squad value, cash, reputation, attribute floors)
  stays fully intact **for the new Run's founding package**. Clarifying clause (mode §6 + GD-0044
  §4): "these reset" = they do not enter your new club; it does **not** mean the old club/players
  are deleted from the Continuum. *(Lockstep edits land on ratification.)*

## Seams

`ManagerTenureDetached { continuumId, runId, clubId, cause }`, `RunEnded { continuumId, runId,
clubFateInitiated }` → club fate flows through existing ADR-0079 events. Owners: Club Management
(ADR-0079 FSMs), Squad & Player (players persist), People/ADR-0052 (relationship edge), Manager &
Legacy/ADR-0051 (cross-Run identity; the legacy echo upgrades from a dead record to a pointer to a
live Continuum entity, still read-only for the new Run's founding package). **The owner of the new
`Run` aggregate is an open bounded-context call (see below), coupled to ADR-0142 Q7.**

## Open questions (recommendations; Nico ratifies)

- **Connection lever MVP scope** — narrative/data-only vs arm a soft-negotiation effect →
  **data-only** (keeps ADR-0108 provably intact).
- **Manager identity across Runs (blocking dep on FMX-262)** — same persistent identity vs fresh
  character. Provisional: **same persistent manager identity carries the edge** (best matches "re-
  sign via personal connection"); **do not finalize until FMX-262 lands.**
- **`Run` aggregate ownership** — **a lightweight Run aggregate in League Orchestration** with the
  manager-tenure-detachment seam (ties to ADR-0142 Q7 Continuum-Lifecycle context). Nico's call.
- **Connection into dormant-MP takeovers / late-join** — **no** (restates ADR-0142 "zero imported
  state"; only new ties build after take-over).
- **Liquidation→Phoenix** — stays **RESERVED post-MVP** (ADR-0079 DB9).

## Alternatives considered

- **A — keep permadeath/read-only echo (status quo):** discards Nico's idea. Rejected.
- **C — soft-negotiation connection (info reveal / willingness-gate):** genuine competitive
  asymmetry needing an ADR-0108-compatible symmetric design + FMX-262 — **deferred (armed-later)**,
  not rejected.
