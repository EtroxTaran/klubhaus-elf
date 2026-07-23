---
title: ADR-0142 Continuum type immutability, depopulated-MP persistence & late-join
status: proposed
tags: [adr, architecture, world-lifecycle, continuum, multiplayer, sp-mp-boundary, fmx-242, fmx-228]
context: [league-orchestration, identity-access]
created: 2026-07-23
updated: 2026-07-23
type: adr
binding: false
linear: [FMX-242, FMX-228]
supersedes:
superseded_by:
related:
  - [[ADR-0139-persistent-container-ubiquitous-language]]
  - [[ADR-0011-server-authoritative-multiplayer]]
  - [[ADR-0027-postgres-data-model]]
  - [[../../50-Game-Design/async-multiplayer-private-group]]
  - [[../../50-Game-Design/singleplayer-baseline]]
---

# ADR-0142: Continuum type immutability, depopulated-MP persistence & late-join

## Status

proposed

Authored `proposed` per the never-self-accept rule; Nico ratifies. `binding: false`.
FMX-242 (epic FMX-228), run through the Research / Decision loop; grounded by a dynamic
research workflow (Diablo/PoE/NBA-2K competitive-integrity precedents + FM/OOTP/Paradox
same-file norm + persistent-league depopulation/late-join norms + a DDD/vault analysis).
Promotes ADR-0139's deferred one-liner ("immutably typed SP or MP") into a decided rule and
fills the two gaps ADR-0139 deferred here. **Reinforces binding ADR-0011 — it does not
reopen it** — and proposes one explicitly-flagged clarifying amendment to ADR-0011's
operating-modes table.

## Context

A Continuum (ADR-0139) is the persistent container created once per new game. FMX-242 (T33)
decides: (1) is its SP-vs-MP **type** immutable? (2) when an MP Continuum **depopulates**,
does it persist / stay solo-playable? (3) **late-join** semantics.

Research found two norms: the FM/OOTP/Paradox "same-file, convert freely" convenience (works
only because a human commissioner is the trust anchor, no engine-enforced cross-player
integrity) vs the Diablo/PoE/NBA-2K/verified-roguelite **immutable-type** norm (type set at
creation, tamperable local state can migrate *out of* but never *into* verified/competitive
status). FMX already chose category B: ADR-0011 makes SP and MP "absolutely separate" and
server-authoritative; the world-persistence guardrail is "no mechanical carry-advantage,
esp. in MP".

## Decision

A Continuum has three **orthogonal** axes: **Type** (`continuum_type` ∈ {singleplayer,
multiplayer}, immutable), **Lifecycle** (`lifecycle_state` FSM, mutable), and
**Population/control** (human count + per-club human-vs-AI, mutable). Population and lifecycle
change over a Continuum's life; **type never does**.

### D1 — Continuum type is immutable (no conversion, either direction)

`continuum_type` is a **write-once** VO set in `Continuum.create(type, masterDataSnapshot)`,
stored on the platform-tier `public.save_registry` row (authority-owner explicit: MP row +
`mp_group` server-owned per ADR-0011; SP row locally authoritative). No domain command mutates
it. Defense-in-depth: factory-set VO with no setter + a DB `UPDATE` trigger that raises on
change + a CI/lint gate (extending ADR-0011's rules) asserting no MP↔SP conversion command
exists + a write-once test. In-place conversion **is** the SP→MP promotion ADR-0011 forbids or
the MP→SP export it leaves undecided; one Continuum ≈ one schema (ADR-0027), so authority class
is a **container-level** property and "converting" would silently re-home authority (a
laundering vector). **Escape hatch (non-violating):** if MP→SP export ever becomes scope
(separate ADR per ADR-0011), it **mints a NEW SP Continuum** from an exported copy — never an
in-place mutation.

### D2 — A depopulated MP Continuum persists and is solo-playable while STAYING MP

Add lifecycle state **`dormant`** (recoverable, distinct from terminal `closed`). When active
human population drops below threshold (≤1 or 0), the MP Continuum auto-transitions
`active → dormant`; it **persists** (world-persistence pillar), does not auto-Close, and is
**playable solo while remaining `multiplayer`-typed and server-authoritative.** Runtime command
routing keys off immutable `continuum_type`, **never off live population** — the lone human
plays via server-validated MP commands against the server-owned schema (AI backfills vacated
clubs, async-mp §11); they do **not** acquire local authority (that would be a silent MP→SP
conversion). A Dormant MP world cannot be exported into a fresh competitive Continuum (immutable
type + export-mints-new-SP-only), so solo grinding cannot launder a carry-advantage into MP.

### D3 — Late-join into an existing MP Continuum

Server-authoritative admin **AddMember** (async-mp §9) → server validates → assigns the joiner
to an **AI-held / vacant / promoted-relegated club** via the §11 backfill flow. The joiner
brings **NO** save/roster/economy/ledger/standings/entitlement state (ADR-0011 restated at
Continuum level): they take over the club's **current** situation as-is. Effective at the next
**season/run boundary**, never mid-week/mid-match (async cadence + FMX-243/244 boundary rule).
Late-join into a Dormant Continuum is itself the `dormant → active` re-activation trigger.
Weak-slot fairness is handled **out-of-band** (framing, boundary timing, optional stabilization
grace — a mild lever, armed-later); expansion-draft seeding and mechanical catch-up are
declared-now / **armed-later**, out of scope. SP has no late-join.

### Data-model seam (forward-additive, ADR-0027 convention)

On `public.save_registry`: `continuum_type` (write-once, trigger+lint+test) and
`lifecycle_state` (`setup|active|paused|dormant|closed`), kept **orthogonal** to ADR-0027's
`state (active|archived|deleted)` storage axis (a Dormant/Closed Continuum can independently be
archived-to-blob and unarchived). MP population lives on an `mp_group` participation projection
(threshold input for `active ⇄ dormant`), not on type/lifecycle. async-mp §10 FSM is reconciled
as the **MP refinement** of this shared FSM by adding the `dormant` state it currently lacks.

### Proposed sub-decisions (recommendations; Nico ratifies)

- **Q1 — D1 immutability = a stated product/fairness/security rule** (like ADR-0011's SP/MP
  wall), CI/lint-enforced — **Yes**.
- **Q2 — ADR-0011 modes-table amendment:** add a *"1 human inside an MP Continuum → Authority:
  Server; Network: required"* row (NOT the Singleplayer/local row) — **Approve as a separately-
  flagged proposed amendment to ADR-0011** (not a stealth edit).
- **Q3 — distinct UX label for "solo-while-MP"** so players know it's still MP-typed
  (server-authoritative, rejoinable, connectivity required) — **Yes**.
- **Q4 — late-join timing** — **boundary-only now; mid-season takeover armed-later**.
- **Q5 — late-joiner stabilization grace** — **armed-later** (declare the seam; it's a mild
  mechanical lever vs the no-carry-advantage guardrail).
- **Q6 — depopulation-to-zero retention** — **persist as Dormant + auto archive-to-blob after a
  TTL (unarchive on late-join)**; never auto-Close.
- **Q7 — ownership** — **a small dedicated platform-tier "Continuum Lifecycle" bounded context**
  owning only the container (ContinuumType VO, lifecycle FSM, `save_registry` row, provisioning
  handshake), publishing `ContinuumCreated/Activated/Dormant/Closed` consumed by League
  Orchestration + the Run context (FMX-245) + MP coordination. (bounded-context-map annotation
  lands on ratification.)

## Consequences

- Fully reinforces ADR-0011 + ADR-0027; the only edit to a binding record is the flagged Q2
  modes-table clarification (proposed separately).
- Two forward-additive `save_registry` columns + trigger/lint/test; a new `dormant` lifecycle
  state; a small new bounded context. No new architectural direction.
- Unblocks FMX-245 (roguelite persistence within a Continuum) and the SP/MP-boundary cluster.

## Alternatives considered

- **D1-B one-way SP→MP promotion** (FM norm) — rejected: directly reopens ADR-0011 (SP save =
  tamperable seed).
- **D2-B depopulated MP auto-converts to SP** — rejected: a silent MP→SP conversion + laundering
  vector.
- **D2-C close-after-TTL** — rejected: contradicts the persistence pillar + every league
  precedent (folding is a social decision, not an engine event).
- **D3-B expansion-draft / D3-C mechanical catch-up** — declared-now / armed-later (catch-up
  boosts conflict with the no-carry-advantage guardrail).
