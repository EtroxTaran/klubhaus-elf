---
title: FMX-160 Context Portfolio Gate Decision Record
status: current
tags: [execution, decision-record, bounded-context, ddd, portfolio, merge-review, fmx-160]
created: 2026-06-16
updated: 2026-06-16
type: execution
binding: false
linear: FMX-160
related:
  - [[../60-Research/bounded-context-merge-review-gate-2026-06-16]]
  - [[../60-Research/raw-perplexity/raw-bounded-context-merge-review-gate-2026-06-16]]
  - [[../60-Research/raw-perplexity/raw-bounded-context-merge-review-gate-source-checks-2026-06-16]]
  - [[../50-Game-Design/GD-0038-bounded-context-portfolio-trim-merge-review-gate]]
  - [[../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]
  - [[../10-Architecture/09-Decisions/ADR-0093-joint-ratification-wave-async-coordination-foundation]]
  - [[decision-queue-2026-06-08-ratified]]
---

# FMX-160 Context Portfolio Gate Decision Record

## Context

Linear FMX-160 asks to reconcile the bounded-context portfolio count and the
standing merge-review gate. The live vault already contains the later decision
trail:

- [[decision-queue-2026-06-08-ratified]] decided **GD-0038 / ADR-0089 =
  Option B**: adopt the reconciled 28-context map as the canonical count source,
  but keep the count under a standing merge-review gate.
- [[../50-Game-Design/GD-0038-bounded-context-portfolio-trim-merge-review-gate]]
  had accepted frontmatter but stale draft body wording.
- [[../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]
  still described D1 as "A" / "28 final" instead of the ratify-with-amendment
  outcome.
- [[../10-Architecture/09-Decisions/ADR-0093-joint-ratification-wave-async-coordination-foundation]]
  still listed the 28-final-vs-gate axis as open.

## Nico Decision

2026-06-08: Nico selected **B** for GD-0038 / ADR-0089 in the ratification
ledger.

2026-06-16: Nico selected FMX-160 for implementation from the live triage
shortlist. This beat applies the existing ratified decision and does not create
a new architecture fork.

## Result

| Decision | Outcome |
|---|---|
| Current catalog source | ADR-0089 remains the canonical 28-context catalog, ordinal key and six-cluster source. |
| Count posture | 28 is an actively managed ceiling under GD-0038's standing merge-review gate, not an immutable final target. |
| Gate effect now | No immediate merge. The GD-0038 watch-list is a review agenda, not a pre-decided collapse. |
| Merge mechanism | Any merge requires demonstrated co-change and a new draft ADR/GDDR amendment; no silent map edits. |
| Owner/cadence | Lead Architect / portfolio owner today; milestone review plus triggered review when repeated co-change appears. |

## Follow-ups

- Future code-phase history can add a numeric co-change threshold once PR/file
  data exists.
- Named cluster/context stewards can be added when the team structure exists.
- A future split-review can mirror the merge gate if a context grows too large.

## Related

- [[../60-Research/bounded-context-merge-review-gate-2026-06-16]]
- [[../50-Game-Design/GD-0038-bounded-context-portfolio-trim-merge-review-gate]]
- [[../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]
- [[../10-Architecture/09-Decisions/ADR-0093-joint-ratification-wave-async-coordination-foundation]]

