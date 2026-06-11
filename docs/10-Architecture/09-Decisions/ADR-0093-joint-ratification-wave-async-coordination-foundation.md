---
title: ADR-0093 Joint ratification wave — promote the async-coordination foundation (ADR-0012 cadence + ADR-0014 state machines) and land ADR-0088 + ADR-0089
status: accepted
tags: [adr, architecture, governance, ratification, async, cadence, state-machine, bounded-context, fmx-64, fmx-102, fmx-105]
created: 2026-06-08
updated: 2026-06-11
type: adr
binding: false
supersedes:
superseded_by:
related:
  - [[ADR-0011-server-authoritative-multiplayer]]
  - [[ADR-0012-async-cadence-models]]
  - [[ADR-0013-transactional-outbox]]
  - [[ADR-0014-state-machines]]
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[ADR-0088-async-escalation-fsm-and-watch-party-deadline-source-of-truth]]
  - [[ADR-0089-bounded-context-portfolio-reconciliation]]
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[ADR-0030-llm-out-of-authoritative-state]]
  - [[../state-machines/README]]
  - [[../state-machines/transfer]]
  - [[../state-machines/league-week]]
  - [[../state-machines/watch-party]]
  - [[../bounded-context-map]]
  - [[../../50-Game-Design/GD-0036-transfer-escalation-and-inactivity-pressure]]
  - [[../../60-Research/determinism-and-replay]]
  - [[../../00-Index/Open-Decisions-Dossier]]
---

# ADR-0093: Joint ratification wave — promote the async-coordination foundation (ADR-0012 cadence + ADR-0014 state machines) and land ADR-0088 + ADR-0089

## Status

accepted

> Adopted `accepted` 2026-06-08 — authored and ratified in the same sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `draft`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

> **History (pre-ratification banner, demoted 2026-06-11 per ADR-0092 / FMX-143):**
> **`draft` / `binding: false`.** Authored 2026-06-08. This is a **governance/sequencing** ADR, not a
> new technical decision: it proposes to ratify **four interdependent ADRs in one wave** so that no
> downstream ADR rests on a still-parked dependency. It **does not edit** any of the four target ADRs
> (ratify gate) — promotion notes and the stale-citation redirects below describe what the apply-PR
> does when Nico ratifies. Nothing here is accepted; awaiting Nico ratify.

## Date

2026-06-08

## Context

Two of the oldest, most load-bearing architecture ADRs are still **`proposed` / parked, "do not
implement"**, yet everything built since rests on them:

- **[[ADR-0012-async-cadence-models]]** fixes the two cadence rule sets (Fixed / Dynamic) on **one**
  `LeagueWeek` state machine and the invariant that **cadence parameters never change mid-cycle**
  (both modes emit the same `MatchdayOpened`; the command validator rejects mid-week / mid-cycle
  mutation). Its own banner says *"keep parked (owner directive 2026-05-19; gate is owner review,
  currently paused — not the stack)."*
- **[[ADR-0014-state-machines]]** mandates **explicit, typed state machines** for every time-critical
  workflow (League/Week, Transfer, Watch Party, Match) and is cited by **[[ADR-0011-server-authoritative-multiplayer]]**
  (which is itself `binding: true`) and by every doc under [[../state-machines/README]]. It too is
  parked.

The dependency knot:

1. **[[ADR-0088-async-escalation-fsm-and-watch-party-deadline-source-of-truth]]** (FMX-102, D1–D7 =
   A/A/A/B/A/A/A) is the **last open backlog item** — on ratify, **E8 / FMX-64 closes**
   ([[../../00-Index/Current-State.md]] §G25). But ADR-0088 is a **new escalation FSM** (so it leans
   on ADR-0014) whose deadline half is an explicit **reconciliation of ADR-0012's no-mid-cycle-mutation
   rule**. ADR-0088 is effectively **un-ratifiable while ADR-0012 and ADR-0014 are parked** — you
   cannot promote a contract that resolves a rule whose owning ADR is still "do not implement".
2. ADR-0088 **embeds a draft FMX-102 amendment inside ADR-0012** ("Watch-party deadline reconciliation
   (draft — FMX-102)", `ADR-0012 §`) that is explicitly *"not binding until ratified"*. That amendment
   **dangles** until ADR-0012 and ADR-0088 flip **together**.
3. **[[ADR-0089-bounded-context-portfolio-reconciliation]]** fixes the **19 → 28** context catalog and
   the canonical ordinal key that resolves the multiply-claimed "20th". It is the **natural place to
   retire ADR-0019's stale wording**: [[ADR-0019-modular-monolith-ddd]] §69 still reads *"eleven
   bounded contexts"*, three counts behind the ratified 19 and now nine behind the proposed 28. ADR-0089
   already supersedes the per-ADR "19→20" patch language; landing it is what makes the ordinal catalog
   the single source of count.

**Stale citations to fix in the promotion note** (not by editing the parked ADRs): both ADR-0012 and
ADR-0014 route their outbox claim through **[[ADR-0013-transactional-outbox]]**, which is itself
**superseded by [[ADR-0028-postgres-transactional-outbox]]**. ADR-0088 already uses ADR-0028 and notes
the redirect; the promotion of ADR-0012/0014 must carry the **ADR-0013 → ADR-0028** redirect so the
foundation does not promote with a dead citation.

**Boundary to state at promotion (do not relitigate):** ADR-0088's deadline anchoring is
**wall-clock scheduling** (`broadcast_at` as an explicit event timestamp; `computeLockDeadlines` is
pure arithmetic), which is **distinct from** the **seeded match engine** — locked-9 RNG streams,
`TransferRng = stream #7`, no wall-clock in the engine ([[ADR-0018-systemic-events-and-player-lifecycle]],
[[../../60-Research/determinism-and-replay]]). Promoting the cadence/FSM foundation must restate this
wall-clock-scheduling-vs-seeded-engine boundary so the two are never conflated.

This ADR does **not** re-open any of the four technical decisions; it sequences their ratification.

## Options considered

- **A. Ratify all four together as one wave ← recommended.** Promote ADR-0012 and ADR-0014 to
  `accepted` / `binding: true`, and land ADR-0088 + ADR-0089, in a single ratify wave. At ratify, make
  the `WatchPartyScheduled` / `MatchdayOpened` `contract_version` bump **explicit** (their payloads gain
  the derived-lock / anchor fields per ADR-0088 §"Public contract direction (B)"). Carry the ADR-0013 →
  ADR-0028 redirect and the wall-clock-vs-seeded-engine boundary in the **promotion note**, not by
  editing the parked ADRs.
- **B. Ratify piecemeal.** Promote them one at a time as review bandwidth allows. **Risk:** a downstream
  ADR (ADR-0088, and transitively the FSM docs and `binding: true` ADR-0011) ends up resting on a
  still-parked dependency — exactly the state we are trying to exit; the dangling ADR-0012 §FMX-102
  amendment stays dangling.
- **C. Keep parked pending a broader governance pass.** Defer until a wider sweep re-reviews all parked
  ADRs together. **Risk:** leaves ADR-0088 (the **last** backlog item) un-ratifiable indefinitely and
  blocks E8/FMX-64 from closing for a reason unrelated to its own content.

## Decision

Propose, awaiting Nico: **Option A — one joint ratification wave.**

The four form a single dependency cluster: ADR-0012 + ADR-0014 are the **foundation** (cadence
invariant + explicit FSMs); ADR-0088 is a **contract that resolves ADR-0012's rule and adds an FSM**;
ADR-0089 is the **catalog** that the whole context portfolio (including the contexts ADR-0088 spans)
re-derives its count from. Ratifying them out of order leaves a load-bearing ADR resting on a parked
one. Ratifying them together makes the foundation everything is built on **formally binding** and lets
**E8/FMX-64 close** cleanly.

At ratify (apply-PR, not this ADR):

1. **ADR-0012 → `accepted` / `binding: true`.** Its draft FMX-102 amendment flips to current
   simultaneously with ADR-0088. Carry the **ADR-0013 → ADR-0028** redirect.
2. **ADR-0014 → `accepted` / `binding: true`.** Carry the **ADR-0013 → ADR-0028** redirect (it cites
   ADR-0013 twice for outbox emission). Restate the **wall-clock-scheduling-vs-seeded-engine** boundary
   in the promotion note.
3. **ADR-0088 lands** (D1–D7 = A/A/A/B/A/A/A); its four state-machine draft amendments flip to current.
   **Make the `contract_version` bump explicit** on `WatchPartyScheduled` and `MatchdayOpened` (new
   derived-lock / anchor fields). This MUST NOT be silently skipped on already-ratified events.
4. **ADR-0089 lands** (D1/D2/D3 = A/A/A); the bounded-context-map adopts the 28-context catalog and the
   six clusters. **Retire ADR-0019's stale "eleven bounded contexts" wording** via ADR-0089's catalog
   as the single source of count — addressed in ADR-0089's map-patch, not by editing ADR-0019.

## Rationale

A modular-monolith / DDD vault treats **decision provenance** as a first-class invariant: one current
truth per fact, supersede rather than silently overwrite ([[../../90-Meta/vault-governance.md]]). A
`binding: true` ADR (ADR-0011) and an entire `state-machines/` corpus citing a **parked** ADR-0014 is a
provenance gap; promoting the foundation closes it. Ratifying the dependency *root* (0012/0014) in the
same wave as its *dependents* (0088/0089) is the standard way to avoid a "ratified-on-sand" state where
a binding contract leans on a "do not implement" parent. The `contract_version` discipline is the same
event-versioning rule ADR-0011 already pins (`engine_id, contract_version, rng_version`, input hash) —
extending a ratified event payload is a version bump by construction, never a silent edit.

## Consequences

Positive:

- The cadence + FSM **foundation everything is built on becomes formally binding**; ADR-0011 and the
  `state-machines/` docs stop citing a parked parent.
- **E8 / FMX-64 closes** on ratify (ADR-0088 was the last open backlog item).
- The dangling ADR-0012 §FMX-102 amendment flips to current **with** ADR-0088, never in isolation.
- The multiply-claimed **"20th context"** knot is resolved by ADR-0089's ordinal catalog, and ADR-0019's
  stale "eleven" wording retires against a single source of count.
- The **ADR-0013 → ADR-0028** redirect is carried forward, so the foundation does not promote with a
  dead outbox citation.

Negative / constraints:

- **28 contexts is a large surface** for a pre-MVP small team (see [[GD-0038-bounded-context-portfolio-trim-merge-review-gate|GD-0038]] below); the cluster grouping +
  catalog are the agreed mitigation, but the wave makes the large count *binding*.
- The **`contract_version` bump on already-ratified events** (`WatchPartyScheduled`, `MatchdayOpened`)
  must not be silently skipped — it is a discipline cost the apply-PR must honour explicitly.
- A joint wave is a larger single ratify decision than four small ones; the gate review is heavier in
  one sitting.

## Risks

- **Large binding surface.** Making 28 contexts binding in the same wave that promotes the foundation
  concentrates a lot of architecture into one ratify. Mitigation: ADR-0089's clusters/catalog +
  standing merge-review; the merge-review can stay an open gate (see open questions) without blocking
  the foundation promotion.
- **Silent contract bump.** If the apply-PR extends `WatchPartyScheduled` / `MatchdayOpened` without an
  explicit `contract_version` increment, replay/audit (ADR-0011, ADR-0028) breaks silently. Mitigation:
  make the bump an explicit checklist item at ratify.
- **Boundary conflation.** Promoting ADR-0012/0014 without restating the boundary risks a future reader
  treating `broadcast_at` wall-clock scheduling as if it were inside the seeded engine. Mitigation: the
  promotion note states the wall-clock-vs-seeded-engine split.

## Open questions

- Is **ADR-0089 D1 (accept 28)** final at this ratify, or kept **open as a merge-review gate** — i.e.
  ratify the foundation (0012/0014/0088) now and hold the 28-count as a standing review item (per the
  GD below)? Both are coherent; this ADR recommends ratifying together but flags the gate option.
- Confirm at ratify: **`TransferRng = stream #7`** (locked-9 unchanged, no new `*Rng`) and the
  **`contract_version` discipline** on `WatchPartyScheduled` / `MatchdayOpened`.

## Confidence

**High** — on the *sequencing* recommendation (ratify the dependency root with its dependents). The
underlying technical decisions are out of scope here; their own confidence lives in ADR-0088 and
ADR-0089. The one genuinely open axis (28 final vs 28-as-gate) is surfaced as an open question for Nico.

## Supersedes

None. This ADR **sequences** the ratification of ADR-0012, ADR-0014, ADR-0088 and ADR-0089; it does not
replace or edit any of them. Promotion notes, the ADR-0013 → ADR-0028 redirect, the
wall-clock-vs-seeded-engine boundary statement, and ADR-0019's "eleven" retirement are applied by the
respective apply-PRs (and ADR-0089's map-patch), never by this ADR.

## Related Docs

- [[ADR-0012-async-cadence-models]] / [[ADR-0014-state-machines]] — the parked foundation promoted by
  this wave (cadence no-mid-cycle-mutation invariant; explicit typed FSMs).
- [[ADR-0088-async-escalation-fsm-and-watch-party-deadline-source-of-truth]] — the last backlog item;
  lands in the wave (closes E8/FMX-64).
- [[ADR-0089-bounded-context-portfolio-reconciliation]] — the 28-context catalog + ordinal key; lands in
  the wave and retires ADR-0019's "eleven".
- [[ADR-0011-server-authoritative-multiplayer]] — `binding: true`, cites parked ADR-0014; provenance gap
  this wave closes.
- [[ADR-0013-transactional-outbox]] → [[ADR-0028-postgres-transactional-outbox]] — the redirect carried
  in the promotion note.
- [[ADR-0019-modular-monolith-ddd]] — §69 "eleven bounded contexts" stale wording retired via ADR-0089.
- [[ADR-0018-systemic-events-and-player-lifecycle]] / [[../../60-Research/determinism-and-replay]] —
  locked-9 RNG streams, `TransferRng` = stream #7; the seeded-engine side of the boundary.
- [[../../50-Game-Design/GD-0036-transfer-escalation-and-inactivity-pressure]] — the game-design driver
  behind ADR-0088's escalation FSM.
- [[../../00-Index/Open-Decisions-Dossier]] — consolidated open-decision Q&A.
