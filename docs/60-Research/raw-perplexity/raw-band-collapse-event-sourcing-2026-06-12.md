---
title: "Raw — Event-sourced range→amount collapse policies, versioning, bias, seeded draws (FMX-149)"
status: raw
tags: [research, raw, perplexity, event-sourcing, determinism, replay, money-band, collapse, rng, fmx-149]
created: 2026-06-12
updated: 2026-06-12
type: research
binding: false
linear: FMX-149
related:
  - [[../moneyband-amountminor-collapse-rule-2026-06-12]]
---

# Raw capture — Range-collapse in event-sourced ledgers (Perplexity, 2026-06-12)

Verbatim-faithful capture of the Perplexity strand on deterministic range→single-amount collapse
in event-sourced systems for FMX-149 (ADR-0101 D2). Synthesis in
[[../moneyband-amountminor-collapse-rule-2026-06-12]].

## Prompt (summary)

Event-sourced ledger with byte-identical replay. Asked for sourced practice on: (1) established
"collapse policy" patterns reducing a band {low, high} to one posted amount (midpoint / floor /
ceiling / expected value / stochastic draw); (2) policy versioning so old events replay under the
old rule; (3) systematic bias/drift of midpoint vs floor over many periods; (4) replay-safety and
audit-acceptability of a seeded within-band draw with persisted seed + draw indices.

## Key findings (faithful condensation)

### (1) Collapse policies

- No single canonical "range-collapse" pattern is named in event-sourcing literature, but the
  building blocks are established: **policy objects / versioned rules in DDD**, projections as
  disposable views rebuilt from immutable events (microservices.io, MS Azure event-sourcing
  guidance).
- Dominant best practice: **do not hide the uncertainty** — keep the band explicitly in the
  event/envelope, and post a single policy-derived amount **tagged with the policy used**
  (`collapse_policy_id`, optional `collapsed_from_low/high` for audit).
- Standard collapse policy menu: lower bound (floor, conservative, understates), upper bound
  (ceiling), **midpoint** (unbiased if true value uniform within band), expected value
  (probability-weighted, needs a distribution model), **stochastic draw** from a deterministic
  seeded RNG.
- Core rule: the range→amount mapping **must be a pure function of persisted inputs** (policy id,
  parameters, seeds all stored in the event), so replay always yields the same projection.

### (2) Policy versioning / temporal-policy pattern

- Never change past events; change how new events are produced. Encode the policy **in the event
  data**, not in projection code paths keyed off timestamps.
- Anti-pattern: `if (event.timestamp < newPolicyDate) useFloor() else useMidpoint()` — hidden
  temporal logic. Correct pattern: the writer stamps `collapse_policy_id`/version at event-creation
  time; the projection switches strictly on that field. Old events replay byte-identically forever.
- Policy change ⇒ **new version value in newly emitted events**; never reinterpret old events
  (matches the schema-evolution guidance: explicit version fields, compensation/revision events
  for true corrections).

### (3) Bias / drift math (midpoint vs floor, uniform-within-band assumption)

- Floor: Bias = (L − H)/2 < 0 per posting; over n periods of constant band width w the expected
  understatement grows **linearly**: −n·w/2. Floor is conservative but systematically biased.
- Midpoint: Bias = 0 per posting and in aggregate; it is the minimum-variance unbiased estimator
  of a uniform distribution's mean given the bounds. Both floor and midpoint have **zero variance**
  conditional on the band (fully deterministic ledger for given bands).
- If the true value is believed non-uniform within the band, expected value under the believed
  distribution minimises bias; midpoint then over/understates accordingly.

### (4) Seeded within-band draw

- **Replay-safe iff** the system persists enough to make the draw a pure function:
  fixed RNG algorithm (e.g. PCG/xorshift family), per-event seed or global-seed+draw-index,
  fixed integer mapping (avoid floating-point platform divergence), all versioned behind the
  same policy id: `draw(low, high, seed, policy_version) → amount`.
- **Audit-acceptable** in a simulation context when transparent and immutable: seed/algorithm
  documented, persisted alongside events, same inputs → same outputs across versions via the
  policy id. (Real-world accounting would not randomize booked numbers — deterministic estimation
  policies are preferred there — but Monte Carlo engines with fixed documented seeds are accepted
  by regulators for scenario analysis.)
- Known precedents: lockstep RTS determinism, seeded roguelike runs, reproducible Monte Carlo
  risk runs — all "log seed + inputs, re-run PRNG, bit-identical reconstruction".

## Sources cited by Perplexity

- https://microservices.io/patterns/data/event-sourcing.html
- https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing
- https://softwaremill.com/things-i-wish-i-knew-when-i-started-with-event-sourcing-part-1/
- https://www.kurrent.io/blog/a-recipe-for-gradually-migrating-from-crud-to-event-sourcing/
- https://artium.ai/insights/event-sourcing-when-is-it-right-to-use
- (bias math: standard estimation theory, reasoned in-answer; seeded-run precedents: general
  game-dev/risk-engineering practice, flagged as domain knowledge by the model)
