---
title: Hall-of-Fame Induction Voting Reconciliation
status: current
tags: [research, synthesis, hall-of-fame, determinism, seeded-variance, fmx-151]
created: 2026-06-16
updated: 2026-06-16
type: research
binding: false
linear: FMX-151
related:
  - [[raw-perplexity/raw-hof-induction-voting-rng-2026-06-16]]
  - [[raw-perplexity/raw-hof-induction-voting-source-checks-2026-06-16]]
  - [[../40-Execution/fmx-151-hof-induction-reconciliation-decision-record-2026-06-16]]
  - [[../10-Architecture/09-Decisions/ADR-0083-awards-honours-records-and-hall-of-fame-contract]]
  - [[../50-Game-Design/GD-0032-awards-honours-records-and-hall-of-fame]]
  - [[../00-Index/Open-Decisions-Dossier]]
---

# Hall-of-Fame Induction Voting Reconciliation

## Intent

FMX-151 looked like a live pure-formula-vs-seeded-voting decision in Linear, but
the current vault already records that fork as decided in the 2026-06-08
ratification wave:

- MVP in-world Hall-of-Fame induction stays a **pure deterministic formula**.
- "Voting" is presentation over the formula output.
- A genuinely stochastic voting layer is future scope and requires a fresh Nico
  decision.
- If it is reopened later, it must use a sub-label under an existing owner RNG
  stream, never a new top-level `LegacyRng` or `HoFRng`.

This note preserves the FMX-151 research/source-check pass and records why the
reconciliation closes stale "open ratification item" wording rather than
creating a new decision.

## Evidence

Real-world Hall of Fame processes provide a strong structure for FMX: public
eligibility rules, waiting periods, categories, finalist reduction, committee
or court review, vote thresholds and class-size bounds. The Pro Football Hall
of Fame publishes committee selection, annual election, 80% approval and class
size bounds; the College Football Hall of Fame publishes eligibility criteria,
screening committees, national ballot and Honors Court finalization.

Comparable-game evidence is useful but lower confidence. The older FMX-95 raw
captures describe the genre pattern: per-save history and records dominate,
deep cross-save HoF is uncommon, and OOTP-like systems are best treated as
hybrid formula/ballot precedent. Those captures already warned that the public
citations were general, so FMX-151 only uses them as pattern evidence.

FMX's internal determinism sources are the load-bearing evidence:

- ADR-0051 and FMX-90 require cross-save legacy state to be snapshot-at-creation
  and read-only while a save runs.
- ADR-0081 provides immutable Statistics handoff snapshots.
- ADR-0083 already defines raw facts, fixed-point versioned scoring and
  inspectable era-normalized induction.
- The ratified 2026-06-08 queue records the HoF choice: pure deterministic in
  MVP, with only a future existing-stream sub-label seam for stochastic voting.

## Decision Record

| Question | Answer |
|---|---|
| Is FMX-151 a fresh model decision? | No. It is a reconciliation issue because the vault already has the June 8 ratified choice. |
| What is the MVP HoF induction model? | Pure deterministic formula over immutable raw facts and context snapshots. |
| What is "voting" in MVP? | Deterministic presentation flavor over formula-preselect output, with inspectable reasons. |
| Is seeded stochastic voting active now? | No. It is future scope and needs a fresh Nico decision. |
| Should an exact future RNG sub-label be pinned now? | No. The only current rule is "existing owner stream sub-label, not a new top-level stream." |

## Recommended Wording

Use "resolved ratification item" instead of "open ratification item" in
ADR-0083 and GD-0032. Keep the future path explicit but conditional:

> Future stochastic voting is allowed only after a fresh Nico decision and only
> as a sub-label of an existing owner RNG stream; MVP has no `LegacyRng` /
> `HoFRng` and no active seeded voting layer.

## Related

- [[raw-perplexity/raw-hof-induction-voting-rng-2026-06-16]]
- [[raw-perplexity/raw-hof-induction-voting-source-checks-2026-06-16]]
- [[../40-Execution/fmx-151-hof-induction-reconciliation-decision-record-2026-06-16]]
- [[../10-Architecture/09-Decisions/ADR-0083-awards-honours-records-and-hall-of-fame-contract]]
- [[../50-Game-Design/GD-0032-awards-honours-records-and-hall-of-fame]]
