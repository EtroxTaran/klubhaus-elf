---
title: Raw Capture — Delegation Contract Hardening (FMX-219 four sub-forks)
status: raw
tags: [research, raw, dual-mode, fork-hardening]
created: 2026-07-02
updated: 2026-07-02
type: research
binding: false
linear: FMX-219
sourceType: external
---

# Raw Capture — Delegation Contract Hardening (FMX-219)

External re-grounding sweep for the four load-bearing delegation sub-forks
that ADR-0136 carries to Nico (open forks 7, 8, 9, 4):

1. GD-0021 staff-skill scope — fixed staff-independent competence floor vs
   extending staff-skill coupling to transfer-negotiation / finance-routine /
   stadium-maintenance.
2. Cross-domain per-tick resource-arbitration order (deterministic + balance
   lever).
3. Feed salience threshold under DL2b (material / irreversible / fan-salient
   individual+undo vs routine digest).
4. Determinism vs bounded seeded variance at v1 (isolated reserved sub-label
   if variance ships).

Tools: `mcp__perplexity-ask__perplexity_ask` (Sonar), `mcp__exa__web_search_exa`.
Nothing here is a decision; raw capture only. URLs recorded verbatim from the
tool responses; where a source is community/secondary it is flagged.

---

## Q1 (Perplexity) — Which delegated areas are staff-skill-coupled vs run on a fixed floor?

**Query:** In sports-management sims (FM, OOTP, NBA 2K MyGM, Motorsport
Manager), is the quality of *delegated* transfer/contract negotiation, routine
finance/budget, and stadium/facilities maintenance tied to a NAMED staff
attribute, or does it run on a fixed club-level baseline? Distinguish areas
with a dedicated staff-skill lever from areas on a fixed floor.

**Substantive answer.**

- **Football Manager is the ONE clear staff-skill coupling, and only for
  negotiation.** The `Negotiating` staff attribute is documented (SI / FMInside
  / passion4fm): "A non-player involved in transfer or contract negotiations
  will seek better financial deals if they are a more skilled negotiator, while
  someone less skilled will be somewhat more likely to agree to less favourable
  packages." When you delegate contract/transfer negotiation to a Director of
  Football, that staff member's `Negotiating` (plus `Judging Staff Ability` for
  staff signings) drives the terms. This is a genuine per-attribute lever.
- **Routine finance/budget has NO named staff skill in ANY of the four
  titles.** In FM the board sets budget caps / FFP limits; routine financial
  stability is board + economic-model rules, not an "accountant" attribute.
  Staff `Negotiating` affects *how efficiently existing budget is spent in
  deals*, never the *size or safety* of the budget. OOTP: owner sets preferred
  payroll, AI policies are generic, no finance attribute. NBA 2K: cap/luxury-tax
  rules + generic AI. Motorsport Manager: economic model + board expectations.
- **Stadium/facilities maintenance has NO named staff skill in ANY of the four
  titles.** FM facilities upgrades are board-driven requests + club finances;
  no "facilities" attribute governs maintenance/upgrade quality (staff
  `Sports Science`/coaching affect outcomes *inside* facilities, not the
  facilities decisions themselves). OOTP ballpark, NBA 2K arena upgrade tree,
  Motorsport Manager HQ buildings are all menu/cost-driven owner decisions, not
  staff-attribute-scaled.
- **Negotiation itself is fixed-floor in OOTP / NBA 2K / Motorsport Manager** —
  only FM exposes a `Negotiating` staff attribute; the others run negotiation on
  generic AI + market/owner context with no swappable staff lever.

**Bearing on Fork 1 (GD-0021 scope).** The genre strongly supports the ★
recommendation: a **fixed staff-independent competence floor at MVP** for
transfer-negotiation, finance-routine and stadium-maintenance is *genre-normal*,
not a simplification to apologise for. Only FM couples negotiation to a staff
attribute, and even there finance and facilities run on fixed club/board rules.
FMX's accepted GD-0021 / FMX-152 Option B (bands only for
Training/Scouting/Medical/Match-Day; Recruitment gives Transfer only
discovery/shortlist quality) is thus *aligned with the best-documented genre
practice*. Extending GD-0021 to add negotiation/CFO/facilities bands would put
FMX slightly ahead of OOTP/2K/MM (matching only FM's negotiation leg) and is a
legitimate post-MVP option — but nothing in the corpus makes it *necessary* for
parity. Note the asymmetry to preserve honesty: FM *does* prove a negotiation
skill lever is viable and player-legible, so the post-MVP extension for the
Transfer area specifically has the strongest external precedent of the three.

**Sources (Q1):**
- https://fminside.net/guides/basic-guides/27-staff-attributes-in-  (FM staff attributes incl. Negotiating)
- https://www.passion4fm.com/football-manager-staff-attributes/  (Negotiating definition; delegated deal quality)
- https://www.youtube.com/watch?v=ncQ1Q3FJLPg  (FM24 staff roles — Negotiating useful to Director of Football; community/secondary)
- https://www.reddit.com/r/footballmanagergames/comments/1bp08lg/football_manager_2024_staff_attributes_weighting/  (FM24 pre-game editor attribute weighting; community)
- https://www.fmscout.com/q-24225-Staff-Negotiating-and-Sports-Science-Attributes.html  (Negotiating + Sports Science scope; community)

---

## Q2 (Perplexity) — Deterministic canonical order when multiple automated policies draw one shared budget

**Query:** When multiple automated agents/policies draw from the same finite
resource (weekly budget / wage pool / ledger) in a single tick, what patterns
give a canonical deterministic order so the outcome is reproducible? Interested
in (1) fixed priority ordering of subsystems, (2) "last in line gets starved"
as a balance lever, (3) documented patterns from strategy/management games.

**Substantive answer.**

- **Canonical evaluation order per tick is THE standard determinism pattern.**
  Define a total order over all actors that touch shared resources; process them
  in that order every tick; all peers/runs use the same order + rules. Concrete
  sort key given: `(subsystem priority, entity id, request type)`, applied in a
  single ordered pass against the shared pool. As long as the sort key never
  changes, allocation *and starvation* patterns are reproducible.
- **Ordering sources:** static subsystem order hard-coded in the sim loop
  (economy → production → upkeep → AI → UI); stable ordering by unique ID /
  creation time with ties broken by entity id; explicit priority classes
  (P0 critical upkeep, P1 salaries, P2 discretionary). Ubisoft's For Honor GDC
  talk ("Deterministic vs Replicated AI") feeds inputs through the same pipeline
  in the same order on every peer for identical sequencing.
- **"Last in line gets starved" IS a documented, intended balance knob.** With
  a fixed order, tail-starvation is predictable and tunable: high-priority
  systems (loan interest, wages, maintenance) are processed first and never
  starve; low-priority systems (scouting, youth, marketing) become the "shock
  absorbers" when budget is tight. Designers tune the *order* until the emergent
  pattern of who starves matches intended difficulty. "Soft caps via starvation"
  — allow requests, deterministically deny late/low-priority ones when the pool
  is exhausted — "feels emergent to players but is entirely deterministic."
- **Recommended patterns:** canonical update loop; priority-based allocation
  pass (`sort by (priority desc, subsystem order, entity id)`, allocate until
  empty); two-phase "reserve then commit" (each subsystem computes desired claim
  from last-known state; a central allocator commits/rejects in order); stable
  tie-breaking by fixed keys; avoid hash-map iteration without stable order.
- Explicit per-department budget allocators for named Paradox/management titles
  are rarely published; the answer grounds the *pattern* in engine-determinism
  literature (CARLA/Unreal determinism paper; deterministic simulation testing)
  and applies it, flagged as synthesis rather than a title-specific citation.

**Bearing on Fork 2 (resource-arbitration order).** Directly confirms ADR-0136's
framing: a fixed per-tick order is a hard determinism requirement AND doubles as
a balance lever, and the two are inseparable ("last-in-line is starved"). The ★
starting proposal (Training → Scouting → Transfer → Finance → Stadium) is a
legitimate priority list, but the literature is explicit that *the order itself
is the tuning knob for who starves* — so it is correctly surfaced to Nico as a
gameplay-balance call, not an architecture default. The two-phase reserve/commit
and stable tie-break (by area, then command id) are the concrete mechanism to
recommend. DL9's aggregate per-tick spend guard is the natural companion: the
allocator's single ordered pass is exactly where a joint run-ending threshold
can be detected before commit.

**Sources (Q2):**
- https://arxiv.org/abs/2104.06262  ("On Determinism of Game Engines used for Simulation-Based Development", CARLA/Unreal)
- https://journal.resonatehq.io/p/deterministic-simulation-testing  (Tornow — "only one possible trace of external events")
- https://www.youtube.com/watch?v=4Z0aUEBp_Os  (Ubisoft GDC — "Deterministic vs Replicated AI: Building the Battlefield of For Honor")
- https://www.youtube.com/watch?v=U1gxsRGwr7o  (XTDB deterministic-simulation-testing talk — reorder observable side effects, lock canonical order)
- https://www.reddit.com/r/gamedev/comments/187axcy/any_resources_for_developing_deterministic/  (deterministic RTS reservations, tie-break by id; community)

---

## Q3 (Perplexity + Exa) — Salience threshold: individual+undo vs digest

**Query:** In notification/automation-transparency UX, which "act-and-report"
actions get surfaced INDIVIDUALLY (with undo/intervene) vs batched into a
DIGEST? Taxonomy along (1) material vs immaterial, (2) reversible vs
irreversible, (3) emotionally-salient/high-trust (e.g. selling a fan-favorite).
Cite NN/g; give FM / OOTP inbox examples.

**Substantive answer.**

- **Three-axis taxonomy, recommended treatment matrix (verbatim shape):**
  - Material + Reversible + High-salience → **individual + undo/intervene**.
  - Material + Reversible + Low-salience → individual snackbar + undo,
    optionally bundled into a daily activity log for later review.
  - Material + Irreversible + High-salience → **individual, often pre-action
    confirmation; strong explanation; NEVER digest-only**.
  - Material + Irreversible + Low-salience → individual notice without undo; may
    be summarised later in a digest ("3 minor transfers completed").
  - Immaterial + Reversible/Irreversible + Low-salience → **digest or silent
    housekeeping** ("we archived 23 old reports").
- **NN/g grounding:** transactional notifications must be concise, timely,
  focused on essential state changes, with a summary/headline + consequences +
  next steps. Undo pattern (toast, 5–10s window) is preferred for quick low-risk
  reversible actions; **confirmation dialogs are reserved for truly
  irreversible, high-stakes actions** (deleting accounts, permanent data
  destruction, billing, actions affecting others) — over-use causes "dialog
  blindness". "User Control and Freedom" (heuristic #3) backs undo/exit for
  automated actions. NN/g "Five Mistakes in Push Notifications": avoid burst;
  if >5 at once, combine into one message — quality over quantity.
- **Batch/throttle rule (Human Standards):** combine events in a time window,
  show a count not individual items ("3 items deleted" not three toasts),
  batch routine into digests, keep *important* notifications distinct from
  routine ("signal clarity").
- **Management-sim examples:** FM surfaces board budget changes, completed
  delegated transfers ("Player X has agreed terms"), injuries, broken promises,
  and — critically — **fan-favorite / star sales individually even when the
  Director of Football is delegated**, with fan/board reaction context; routine
  training summaries and ongoing scouting are grouped into periodic reports.
  OOTP surfaces trades, FA signings, waiver claims, major injuries, owner-goal
  changes, milestones (no-hitters, retirements) as discrete items; consolidates
  league-wide scouting updates and other-team minor news into a browsable feed.
- **Operable decision rules given:** "Would I want to be interrupted for this?"
  / "Is immediate action required or strongly beneficial?" / "Is this a
  user-rule applied that might need per-instance veto?" / "Does this touch
  favorites, promises, reputation?" / "Is the cost of being *surprised* high?"
  Discovering a star was sold only via digest is called out as "unacceptable".

**Bearing on Fork 3 (DL2b salience threshold).** Gives a directly usable
concrete taxonomy for DL2b. Recommended encoding: an act surfaces
**individually with one-tap undo/protect** if it is (material AND irreversible)
OR fan-salient OR a user-pinned-rule application needing per-instance veto;
otherwise it rolls into the periodic digest. Emotional-salience is a *first-class
third axis*, not a subset of "material" — the fan-favorite-sale case is the
canonical example and must never be digest-only (mirrors DL1 pins + DL8/DL9
financing confirmations). NN/g's confirmation-vs-undo split maps cleanly:
FMX's `propose` consent level ≈ pre-action confirmation for the highest-stakes
irreversible acts; `delegate` + individual-surface-with-undo ≈ the undo-toast
pattern for reversible material acts; digest ≈ batch/throttle for routine. This
also validates the DL2b prohibition on an unfiltered per-action feed (the "burst
notifications" / ">5 → combine" NN/g anti-pattern).

**Sources (Q3):**
- https://www.nngroup.com/articles/transactional-notifications/  (NN/g — transactional notification characteristics)
- https://www.nngroup.com/articles/confirmation-dialog/  (NN/g — confirmations for irreversible high-stakes only; dialog blindness)
- https://www.nngroup.com/articles/user-control-and-freedom/  (NN/g heuristic #3 — undo/exit)
- https://www.nngroup.com/articles/push-notification/  (NN/g — avoid burst; >5 → combine into one)
- https://www.nngroup.com/articles/indicators-validations-notifications/  (NN/g — pick the right status-communication option)
- https://www.humanstandards.org/interaction-patterns/notifications-feedback/  (batch & throttle; undo 5–10s window; signal clarity)
- https://www.courier.com/guides/how-to-build-a-notification-center/chapter-3-best-practices-for-notification-centers  (batching events sharing a topic; secondary)

---

## Q4 (Exa) — Determinism vs seeded stochastic; isolated per-subsystem RNG streams

**Query:** Deterministic vs seeded-stochastic AI automation in simulation games;
replay safety; isolated per-subsystem RNG streams for reproducibility and MP
fairness.

**Substantive answer.**

- **Simulation-context isolation (Warman lockstep dev blog).** Split code into a
  `ForwardSimulation()` context (everything affecting game state, once per tick,
  deterministic) vs the rendering/UI context (per frame, any API). `UnityEngine.
  Random` is seeded from system time and its state persists across calls, so any
  code path (including engine internals) that draws advances the shared
  sequence — "a reliable way to desync". **Per-event seeds eliminate ordering
  dependency:** each event's random calls are isolated to a fresh instance
  seeded from deterministic state, so Event A's rolls do not affect Event B's
  regardless of processing order — two events processed in different sequences
  still produce the same individual outcomes. Canonical determinism test: run
  from the same start with the same input sequence twice and diff the state;
  any difference is a bug; running sequentially in the same process is enough to
  catch most issues.
- **Record inputs, not state; seeded RNG as explicit dependency (multiple
  sources).** Openturn: use the engine's deterministic RNG for every random
  decision, never `Math.random` / `Date.now` / `crypto.randomUUID`; the engine
  passes a seeded RNG and a fixed `now` into every transition; every draw is
  recorded in the match's RNG trace and the replay reruns the same draws.
  Bugnet: fixed timestep + seeded RNG + deterministic iteration/math + record
  inputs not state. Forges of Karinth: `Math.random()` banned by ESLint inside
  the engine; every function needing randomness receives it as a parameter;
  "Replay contract: same seed plus same action log must reproduce any historical
  battle, unless an ADR explicitly unlocks the contract"; nondeterminism
  simultaneously destroys "replay correctness, property-based testing, balance
  evidence, incident triage, and anti-cheat validation."
- **Independent sub-RNG streams are a first-class, off-the-shelf pattern (OSL
  Deterministic Core, Unity Asset Store).** "Supports deriving multiple
  statistically independent sub-RNGs from a single master seed using different
  stream IDs, isolating subsystems so that modifying one roll sequence does not
  affect others." Integer-first probability (`RollPermille`/`RollProbability`)
  avoids float drift across CPUs. This is exactly the "isolated reserved
  sub-label per area" mechanism ADR-0136 / ADR-0084 §3 / ADR-0018 §3 require.

**Bearing on Fork 4 (determinism vs seeded variance).** The external corpus is
one-directional on the *mechanism*: IF any variance is armed, it MUST be an
isolated, independently-seeded sub-stream keyed per area, drawn only inside the
deterministic simulation context, with inputs recorded — never a shared or
ambient stream. This confirms ADR-0136's *unconditional* correction (isolated
reserved sub-label per area regardless of the pure-vs-variance choice) and
Nico's standing seeded-variance preference remains viable **provided** it rides
an isolated per-area sub-label. The literature slightly *leans pure/minimal* on
the multi-domain surface (every extra draw is a desync/replay risk and each
consumer that draws advances shared state), which matches ADR-0136's recorded
"determinism lens leans pure at v1" — but this is presented **co-equally beside
Nico's seeded-variance preference**, both viable, the choice his. The
per-event-seed finding is a strong additional argument: with per-area isolated
seeds, the cross-domain arbitration order (Fork 2) does not perturb each area's
variance outcome, so Forks 2 and 4 compose cleanly (ordering affects *budget
allocation*, not *RNG draws*).

**Sources (Q4):**
- https://play-warman.com/blog/determinism-in-a-lockstep-simulation/  (Warman — sim/Unity context split; per-event seeds; UnityEngine.Random desync)
- https://openturn.io/docs/how-to/handle-randomness  (Openturn — seeded RNG + fixed now, record inputs, replay reruns draws)
- https://bugnet.io/blog/how-to-make-a-game-simulation-deterministic-for-replays  (Bugnet — fixed timestep, seeded RNG, deterministic iteration, record inputs)
- https://danjohnson.dev/work/forges-of-karinth  (Forges of Karinth — Math.random banned, replay contract, nondeterminism poison list)
- https://assetstore-fallback.unity.com/packages/tools/utilities/osldeterministic-381680  (OSL Deterministic Core — independent sub-RNG streams by stream ID; integer-first probability)

---

## Cross-cutting notes

- **Nothing in the corpus reopens D1–D4 or the ADR-0136 shape (O1=A/O2=A/O3
  deterministic/O4=C1).** All four findings *harden* the already-recommended
  proposal rather than shifting it.
- **Fork composition:** Fork 2 (arbitration order) and Fork 4 (RNG isolation)
  compose cleanly *because* per-area isolated seeds make RNG order-independent
  (Warman per-event-seed finding) — the tick order governs budget allocation,
  not random draws.
- **Honesty flag (Fork 1):** FM's `Negotiating` attribute is real external
  precedent that a negotiation staff-skill lever is player-legible and viable,
  so the post-MVP GD-0021 extension for the *Transfer* area specifically is
  better-grounded than for finance/facilities (which no surveyed title couples
  to a staff attribute). This should be reflected if the extension fork is ever
  taken.
- **Could not verify:** exact per-department budget-allocator implementations in
  named Paradox / management titles (public writing is scarce; Q2 grounds the
  pattern in engine-determinism literature + applies it); exact FM/OOTP internal
  digest-vs-individual thresholds (community-observed inbox behaviour only, not
  a published spec). None are load-bearing for the recommendations.
