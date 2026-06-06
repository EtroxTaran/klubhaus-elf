---
title: ADR-0084 National-Team Dual-Role Scope & International-Window Contract
status: proposed
tags: [adr, architecture, league-orchestration, manager, legacy, national-team, international-window, calendar, determinism, fmx-84]
created: 2026-06-06
updated: 2026-06-06
type: adr
binding: false
supersedes:
superseded_by:
related:
  - [[ADR-0066-competition-registry-sub-aggregate]]
  - [[ADR-0068-fixture-scheduling-contract]]
  - [[ADR-0056-regulations-compliance-context]]
  - [[ADR-0051-manager-and-legacy-context]]
  - [[ADR-0083-awards-honours-records-and-hall-of-fame-contract]]
  - [[ADR-0075-loan-orchestration-process-manager]]
  - [[ADR-0071-ai-world-simulation-context-and-drift-contract]]
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0007-naming-schema]]
  - [[../bounded-context-map]]
  - [[../../50-Game-Design/GD-0033-national-team-dual-role]]
  - [[../../50-Game-Design/GD-0011-career-progression]]
  - [[../../60-Research/national-team-dual-role-2026-06-06]]
  - [[../../60-Research/raw-perplexity/raw-national-team-dual-role-realworld-2026-06-06]]
  - [[../../60-Research/raw-perplexity/raw-national-team-dual-role-games-2026-06-06]]
  - [[../../60-Research/raw-perplexity/raw-national-team-dual-role-mvp-gating-2026-06-06]]
---

# ADR-0084: National-Team Dual-Role Scope & International-Window Contract

## Status

proposed

> **`proposed` / `binding: false`.** Decisions D1–D4 were put to Nico live on 2026-06-06
> (ask-first gate) and chosen below; authored `proposed` per the never-self-accept rule — Nico
> ratifies (merge). This ADR **adds** the international-window contract to the **accepted**
> League Orchestration calendar (ADR-0066/0068) and **reserves** the dual-role prestige seam in
> the **accepted** Manager & Legacy context (ADR-0051) — both **additively** (new ADR + one-line
> "Related" pointers; **no rewrite** of the binding ADRs — vault-governance supersession
> discipline, same pattern as ADR-0082/0083). It resolves late-game gap **G2 / R2-06** (FMX-84,
> E5 epic FMX-61) and **introduces no new bounded context**.

## Date

- Proposed: 2026-06-06 (FMX-84; D1–D4 chosen live by Nico)

## Context

`late-game-systems.md §4` fully designs a club + national-team ("Bundestrainer") dual role but it
is research-tier and **three docs disagree on scope and the unlock gate** (`ai-manager-behaviour.md
§11.2` = post-MVP, rep ≥ 75 + 5 seasons; `late-game-systems.md §4.2` = rep ≥ 75 AND (5 seasons OR
3 trophies); `GD-0011`, approved = the "club legend → national-team coach" narrative spine but the
arc is undesigned Wave-2). Two concrete architecture gaps block the late-game arc:

1. **No context owns the international-window calendar.** The Competition Registry (ADR-0066) owns
   competition structure + season `CalendarWindow`s; the fixture scheduler (ADR-0068) emits a
   self-contained `FixturesPublished` and is **club-agnostic** — neither models *international
   windows* (the dates national teams assemble and clubs must release players). So the schedule
   cannot reserve windows, and a club↔nation calendar-conflict cannot be expressed as a contract.
2. **No reserved seam for national-team prestige.** ADR-0083 (FMX-95) explicitly left national-team
   caps/tournament honours a **reserved stub pending FMX-84**.

Grounded in [[../../60-Research/national-team-dual-role-2026-06-06]] (+ three raw captures:
real-world dual-role + FIFA calendar, comparable games, late-game MVP-gating). Prior art is
consistent: dual roles are reputation-gated, run alongside the club, are light to operate
(delegation/tournament-centric), and the international calendar is a small set of season-scoped
windows the schedule reserves around. Best-practice for a niche late-unlocked aspiration is a
**telegraphed reserved stub**, not a cut feature.

**Scope (this ADR):** the MVP-vs-post-MVP scope ruling; the **international-window contract**
(owner + event + query + conflict-resolution seam) expressed with **no cross-context join**; the
reserved national-team prestige handoff into Manager & Legacy / ADR-0083; determinism + IP-clean
invariants. **Out of scope:** the full playable dual-role build (post-MVP); the international
*competition schema* / national-tournament fixture generation (Competition Registry reserved cup
/continental seams); HoF metric definitions (ADR-0083 / GD-0032); all numeric magnitudes (FMX-52).

## Decision options

### D1 — MVP scope of the dual-role

| Option | Description | Trade-off |
|---|---|---|
| **A. Reserved-stub + telegraphed** | Ratify design + thresholds now; MVP ships only the reserved international-window contract + early foreshadowing; full playable role = post-MVP fast-follow. | **Chosen by Nico.** Reconciles all three source docs; protects MVP scope; keeps the late-game carrot vs the flatline; reserved seam = minimal later refactor. Matches research best-practice. |
| B. First-playable in MVP | Build the full playable dual-role for launch. | Largest scope risk; distracts from validating the core club loop; research advises against shipping niche aspirational content in v1. |
| C. Full defer, no stub | Cut entirely; no architectural seam. | Flattens the long-term fantasy; no telegraph → worsens the flatline; forces a later refactor of the calendar/save structure. |

### D2 — Owner of the international-window calendar

| Option | Description | Trade-off |
|---|---|---|
| **A. League Orchestration** | It already owns the season calendar (ADR-0066 `CalendarWindow`, ADR-0068 `FixturesPublished`/`SeasonAdvanced`). Add `InternationalWindow` + `InternationalWindowsPublished` as a self-contained fact; release *eligibility* stays with Regulations/Squad. | **Chosen by Nico.** Windows are calendar facts; reuses an existing seam; the scheduler already reserves `CalendarWindow`s. No new BC. |
| B. Regulations & Compliance | It owns rule catalogs + the `CurrentTransferWindow` query — reuse that query shape. | Splits calendar ownership across two contexts; windows are *when*, not regulatory verdicts. (We still **mirror** its query shape — see §2.) |
| C. New International/Competition BC | A dedicated context. | Boundary proliferation against the stable 19-context map; unwarranted for a small calendar fact. |

### D3 — Unlock gate

| Option | Description | Trade-off |
|---|---|---|
| A. `rep ≥ 75 AND (5 seasons OR 3 trophies)` *(recommended)* | The richer `late-game-systems.md §4.2` gate; trophies path lets fast over-achievers unlock without pure time-gating. | Two-path gate is slightly less legible; research favours time+achievement combos. |
| **B. `rep ≥ 75 AND 5 in-game seasons`** | The `ai-manager-behaviour.md §11.2` gate; single conjunctive condition; "OR 3 trophies" dropped. | **Chosen by Nico.** Simpler/legible; reputation already rewards trophies via the region-rep model, so a separate trophy path is redundant. Both values banded (FMX-52). |
| C. Reputation-only | Unlock on rep ≥ 75 alone. | Too easy via one dominant season; loses the dynasty-longevity signal. |

### D4 — Engagement model + same-day clash resolution

| Option | Description | Trade-off |
|---|---|---|
| **A. 3 levels + forced-choice clash** | Full Control / Match-Only / Light Touch (default by FTUE self-id); same-day clash = forced bench choice, unattended side auto-managed with the user's tactics, **deterministic (no RNG)**, media story beat. | **Chosen by Nico.** Matches Anstoss prestige-side-job + FM delegation; deterministic resolution is replay-safe; preserves the club-vs-country emotional hook. |
| B. 2 levels (Full vs Auto) | Collapse to Full Control vs fully-delegated Auto. | Smaller surface but loses the "Light Touch = tournaments only" middle that suits the side-job fantasy. |
| C. Always club-priority, no choice | Nation match always auto-managed; club always takes priority. | Deterministic + simple but removes the dramatic club-vs-country decision. |

## Decision (chosen — Nico 2026-06-06)

**D1 = A, D2 = A, D3 = B, D4 = A.** Ship the dual-role as a **telegraphed reserved stub**;
**League Orchestration owns the international-window calendar**; unlock = **`rep ≥ 75 AND 5
seasons`** (no trophy path); **3 engagement levels + a deterministic forced-choice same-day
clash**. Game-design model in
[[../../50-Game-Design/GD-0033-national-team-dual-role|GD-0033]].

### 1. Ownership map

| Concern | Owner | Note |
|---|---|---|
| International-window **calendar** (when nations assemble; schedule reservation) | **League Orchestration** | new `InternationalWindow` reference VO alongside `CalendarWindow` (ADR-0066) |
| Player-release **eligibility** (who may be called up / must be released) | **Regulations & Compliance** + **Squad & Player** | reuse the `CurrentTransferWindow`-style window pattern (ADR-0056); not re-derived here |
| Dual-role **process** (offers, engagement level, conflict resolution) | **Manager & Legacy** orchestration (post-MVP), Vernon process-manager pattern (ADR-0075) | reserved seam in MVP; consumes window facts + fixtures, no cross-context join |
| National-team **caps / tournament honours → prestige / HoF** | **Manager & Legacy** (ADR-0051) / ADR-0083 | forward-additive reserved input; populated post-MVP |

**No new bounded context.**

### 2. International-window contract (the reserved seam — MVP-active)

Published by League Orchestration at season creation; **self-contained** (every consumer field in
the payload — ADR-0068 invariant F6 style); **no cross-context join**. Query shape **mirrors**
Regulations' `CurrentTransferWindow` (ADR-0056) for consistency.

```ts
// Reference VO inside League Orchestration (parallel to ADR-0066 CalendarWindow).
type IntlWindowKind = 'qualifier' | 'friendly' | 'tournament';
InternationalWindow = {
  seasonId: SeasonId,
  windowId: string,            // stable id within the season
  kind: IntlWindowKind,
  windowStart: DateOnly,
  windowEnd: DateOnly,
  // tournament blocks carry an opaque competition ref (IP-clean catalog), null for plain windows
  competitionRef?: CompetitionId,
};

// Self-contained published fact (consumed by Competition Registry scheduler + clubs).
InternationalWindowsPublished = {
  seasonId: SeasonId,
  windows: InternationalWindow[],   // all intl windows in the season
  publishedAtSeq: number,           // monotone with SeasonAdvanced
};

// Query mirroring Regulations CurrentTransferWindow (ADR-0056); pure read, no join.
CurrentInternationalWindow = (date: DateOnly) => InternationalWindow | null;

// Reserved conflict-resolution seam (deterministic; activated with the post-MVP playable role).
type ClashResolution = 'attend_club' | 'attend_nation';   // chosen by the player; no RNG
DualRoleFixtureClash = {
  managerId: ManagerId, clubId: ClubId, seasonId: SeasonId,
  clubFixtureId: FixtureId, internationalWindowId: string,
  matchDate: DateOnly,
  resolution: ClashResolution,      // unattended side auto-managed with the player's tactics
};
```

**Scheduler honouring (Competition Registry, ADR-0066/0068):** `GenerateFixtures` reads published
`InternationalWindow`s and **avoids scheduling league matches inside a window**; lower-priority
cups/friendlies may fall inside a window (clubs play with absentees); a residual **same-day
club↔nation collision** surfaces as a `DualRoleFixtureClash` for the player to resolve. This holds
**regardless of when the playable role ships** — the schedule reserves windows from MVP.

### 3. Determinism

- Window publication is a **pure function** of season context + the locked international-calendar
  template; `publishedAtSeq` is monotone with `SeasonAdvanced` (ADR-0066). **No new `*Rng`**.
- Same-day-clash resolution is **deterministic** — the player's `ClashResolution` choice is the
  only input; the unattended side is auto-managed with the player's existing tactics; **no RNG**,
  byte-replay-safe.
- Post-MVP job-offer draws (if stochastic) will reuse the existing `WorldAiMgmtRng` grammar
  (ADR-0071/0079) under a reserved sub-label `national-team:offers:<seasonId>` — **declared here,
  not drawn in MVP** (ADR-0018 §3 isolation).

### 4. Reserved prestige handoff (forward-additive)

National-team caps + tournament honours are a **reserved input** into Manager & Legacy prestige /
ADR-0083 HoF scoring, added as a new keyed `factId` in the forward-additive `LegacyFactBucket`
(ADR-0083 §4 / ADR-0027): old builds ignore it, new builds read it; **no migration, no
save-format break**. Populated when the playable role ships; ADR-0083's "national-team inputs
reserved — FMX-84" stub points here.

### 5. Reuse, don't invent

- **Consume** `FixturesPublished` / `SeasonAdvanced` (ADR-0066/0068) for the schedule; do **not**
  modify fixture generation beyond honouring windows.
- **Mirror** Regulations' `CurrentTransferWindow` query (ADR-0056) for `CurrentInternationalWindow`;
  release eligibility stays Regulations/Squad — not re-derived.
- **Follow** the ADR-0075 process-manager / saga pattern for the post-MVP dual-role process
  (commands + queries/read-models + events, no cross-context joins).
- **Extend** `ManagerLegacyProfile` / `PrestigeLadder` (ADR-0051) + ADR-0083 buckets rather than a
  new cross-save meta container.

## Invariants

| # | Invariant |
|---|---|
| **NT1** | The international-window **calendar** is owned by **League Orchestration**; player-release **eligibility** stays with Regulations & Compliance / Squad & Player. **No new bounded context.** |
| **NT2** | `InternationalWindowsPublished` is **self-contained** (every consumer field in the payload); consumers apply their own policy; **no cross-context table joins**. |
| **NT3** | The Competition Registry scheduler (ADR-0066/0068) **reserves** international windows (no league match inside a window) from MVP, independent of the playable role's ship date. |
| **NT4** | Window publication declares **no new `*Rng`** and is pure over season context + the locked calendar template; `publishedAtSeq` is monotone with `SeasonAdvanced`. |
| **NT5** | Same-day club↔nation clash resolution is **deterministic** (player choice only; unattended side auto-managed with the player's tactics; no RNG); **byte-replay-safe**. |
| **NT6** | National-team caps/honours feed Manager & Legacy prestige / ADR-0083 HoF as a **forward-additive** keyed `factId` — adding it needs **no migration / no save-format break** (ADR-0027). |
| **NT7** | Cross-save prestige aggregation is **read-only-at-world-gen** (ADR-0051 §Determinism / ADR-0083 D8); a running save never reads mutable cross-save meta after creation. |
| **NT8** | **IP-clean** (GD-0015 / ADR-0007): nation/federation/competition **branding** routes through the fictional catalog; only player/persona *nationality* uses real ISO data; no real federation/nation names embedded as samples. |
| **NT9** | The **playable dual-role** (job-offer market, squad-building, tournament UX, engagement-level operation, clash modal) is **post-MVP**; MVP ships only the reserved window contract + foreshadowing + reserved prestige seam. |
| **NT10** | All magnitudes (`reputationMin`, `minSeasons`, offer-window timings, board-confidence floor, post-MVP weights) are **FMX-52 calibration debt**; the gate is `rep ≥ 75 AND seasons ≥ 5` (no trophy path). |

## Consequences

**Positive:** closes G2/R2-06's architecture half with no new context; gives League Orchestration a
concrete `InternationalWindow` contract so fixtures reserve international windows from MVP; the
reserved prestige seam fills ADR-0083's national-team stub without rework; the deterministic clash
resolution stays replay-safe; reuses the ADR-0056 window-query and ADR-0075 saga patterns rather
than inventing machinery; the telegraphed reserved-stub keeps the late-game carrot against the
flatline while protecting MVP scope.

**Negative / constraints:** the playable role is deferred (full pay-off post-MVP; mitigated by
early foreshadowing); some inputs depend on still-`proposed` upstreams (FMX-91/ADR-0071 world-drift
for rising-nations context; ADR-0083 HoF); D3=B drops the richer trophies-or-seasons gate for a
simpler one; all magnitudes await FMX-52 playtest.

## Proposed bounded-context-map patch (NOT applied — ratify gate)

League Orchestration row, **Owns** column — append: `…, international-window calendar
(InternationalWindow / InternationalWindowsPublished; schedule reservation)`. **Exposes** — append:
`InternationalWindowsPublished; CurrentInternationalWindow`. **No context-count change** (no new
BC). Manager & Legacy row gains a reserved national-team prestige-input note. The map is **not**
edited in this PR (ratify gate); the patch lands when Nico accepts.

## Amendments (additive cross-references only)

- [[ADR-0066-competition-registry-sub-aggregate]] / [[ADR-0068-fixture-scheduling-contract]] gain a
  one-line "Related" pointer to this ADR (the international-window contract their scheduler
  honours). Their decisions/contracts are **unchanged** — no rewrite.
- [[ADR-0051-manager-and-legacy-context]] / [[ADR-0083-awards-honours-records-and-hall-of-fame-contract]]
  gain a one-line pointer: this ADR fills the "national-team inputs reserved — FMX-84" stub. No
  rewrite (vault-governance additive discipline, same pattern as ADR-0082/0083).

## Supersedes

None. Resolves the `late-game-systems.md §4` ↔ `ai-manager-behaviour.md §11.2` ↔ `GD-0011`
contradiction by making GD-0033 + this ADR the current truth (research docs left intact, linked).

## HITL gate

`proposed` / `binding: false`. D1–D4 chosen live by Nico 2026-06-06 = **A/A/B/A** (D3=B is Nico's
choice of the simpler gate over the recommended trophies-or-seasons variant). All numeric
magnitudes are **FMX-52 calibration debt** and do not block ratification of the contract shape. The
full playable dual-role remains post-MVP. Awaiting Nico ratify + merge; the additive ADR pointers
and the bounded-context-map patch apply in the ratifying PR.

## Related Docs

- [[../../60-Research/national-team-dual-role-2026-06-06]] — FMX-84 synthesis (decision basis).
- [[../../60-Research/raw-perplexity/raw-national-team-dual-role-realworld-2026-06-06]] — real-world dual-role + FIFA calendar.
- [[../../60-Research/raw-perplexity/raw-national-team-dual-role-games-2026-06-06]] — comparable management sims.
- [[../../60-Research/raw-perplexity/raw-national-team-dual-role-mvp-gating-2026-06-06]] — late-game MVP-gating / reserved-stub design.
- [[ADR-0066-competition-registry-sub-aggregate]] / [[ADR-0068-fixture-scheduling-contract]] — season calendar + fixtures this contract extends/honours.
- [[ADR-0056-regulations-compliance-context]] — `CurrentTransferWindow` query pattern mirrored; release eligibility owner.
- [[ADR-0051-manager-and-legacy-context]] — prestige/legacy owner; reserved national-team seam extends it.
- [[ADR-0083-awards-honours-records-and-hall-of-fame-contract]] — HoF/prestige; fills its reserved national-team-inputs stub.
- [[ADR-0075-loan-orchestration-process-manager]] — cross-context process-manager/saga pattern for the post-MVP dual-role process.
- [[ADR-0018-systemic-events-and-player-lifecycle]] — §3 RNG/determinism discipline (declares no new `*Rng` in MVP).
- [[ADR-0027-postgres-data-model]] — forward-additive invariant for the reserved prestige bucket.
- [[../../50-Game-Design/GD-0033-national-team-dual-role]] — the game-design model this contract serves.
- [[../../50-Game-Design/GD-0011-career-progression]] — the "club legend → national-team coach" spine (R2-06).
