---
title: Bounded-context merge-review gate reconciliation
status: current
tags: [research, synthesis, bounded-context, ddd, context-map, portfolio, merge-review, cognitive-load, fmx-160]
created: 2026-06-16
updated: 2026-06-16
type: research
binding: false
linear: FMX-160
related:
  - [[raw-perplexity/raw-bounded-context-merge-review-gate-2026-06-16]]
  - [[raw-perplexity/raw-bounded-context-merge-review-gate-source-checks-2026-06-16]]
  - [[../40-Execution/fmx-160-context-portfolio-gate-decision-record-2026-06-16]]
  - [[../50-Game-Design/GD-0038-bounded-context-portfolio-trim-merge-review-gate]]
  - [[../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]
  - [[../10-Architecture/09-Decisions/ADR-0093-joint-ratification-wave-async-coordination-foundation]]
  - [[../10-Architecture/bounded-context-map]]
  - [[bounded-context-portfolio-reconciliation-2026-06-07]]
---

# Bounded-context Merge-review Gate Reconciliation

## Intent

FMX-160 is a reconciliation issue. The current vault already contains Nico's
2026-06-08 answer:

- adopt the reconciled 28-context map as the canonical catalog/count source;
- do not treat 28 as an immutable final target;
- keep the count under a standing merge-review gate;
- trim candidates only when they demonstrably always co-change.

This note preserves the FMX-160 Perplexity-first pass, source checks and the
exact reconciliation line applied to GD-0038, ADR-0089, ADR-0093 and the
bounded-context map.

## Evidence

DDD evidence supports explicit bounded contexts with local language and
documented relationships, but does not reward context count for its own sake.
Fowler and the Azure Architecture Center both emphasize boundaries and context
maps. Azure also makes team/boundary coherence a review signal. Vaadin's
practitioner guidance adds two useful heuristics: shared-kernel growth can mean
two contexts should merge, and teams should avoid hunting for contexts that are
not really present.

FMX's local evidence is stronger than public comparable-game material:

- [[bounded-context-portfolio-reconciliation-2026-06-07]] already justified the
  28-context catalog, six clusters and no-shared-table invariant while calling
  out cognitive-load and co-change review.
- [[../40-Execution/decision-queue-2026-06-08-ratified]] explicitly chose
  GD-0038 / ADR-0089 **B**: canonical 28 map plus standing merge-review gate.
- The drift was in body text and front-door summaries, not in Nico's decision.

Comparable sports-management games are useful only as breadth precedent. Their
public pages show large feature domains, but they do not prove internal
bounded-context seams. FMX should therefore use comparable games to sanity-check
product coverage, and DDD/FM X co-change evidence to decide merge/split shape.

## Current Reconciled Truth

| Question | Current answer |
|---|---|
| Is the 28-context catalog current? | Yes. ADR-0089 remains the canonical catalog, ordinal key and six-cluster source. |
| Is 28 final/immutable? | No. FMX-160 applies the ratified Option B wording: 28 is a ceiling under a standing merge-review gate. |
| Does the gate merge anything now? | No. The watch-list is evidence-seeking, not pre-approval for merges. |
| What triggers a merge proposal? | Demonstrated repeated co-change plus weak independent language/lifecycle/invariant/consumer value. |
| How does a merge land? | A new draft ADR/GDDR amendment with explicit supersede/amend links; never a silent catalog edit. |
| Who owns the gate today? | Lead Architect / portfolio owner under the collaboration protocol; future context or cluster stewards may supply evidence. |
| Cadence today | Milestone review plus triggered review when repeated co-change appears. No numeric threshold before code/PR history exists. |

## Watch-list

The accepted GD-0038 watch-list stays illustrative until evidence exists:

| Candidate | Current handling |
|---|---|
| Scouting <-> Transfer | Watch inside the Recruitment, People & Career cluster; keep distinct unless scouting lifecycle/language fails to justify a boundary. |
| Statistics & Analytics as projection-only | Watch whether projection-only ownership earns an independent lifecycle or becomes a cluster-level read side. |
| Media Ecology <-> Narrative | Watch Engagement & Narrative co-change; keep separate while outlet operations and coverage lifecycle remain distinct. |
| Environment & Climate | Watch whether weather/pitch derivation remains independent from Match/Stadium; ADR-0077/FMX-142 already keep pitch-state ownership in Stadium Operations. |

## Decision Status

No new Nico decision is required for FMX-160 itself. The issue applies the
already-ratified 2026-06-08 Option B and removes stale "draft", "awaiting Nico",
"28 final" and "open question" wording.

Optional future refinements, if Nico wants a stricter operating model later:

- define a numeric co-change threshold after code and PR history exist;
- appoint named cluster stewards once a team structure exists;
- add a symmetric split-review if one context grows too large.

## Recommended Wording

Use this sentence wherever the portfolio count is summarized:

> The canonical portfolio catalog currently contains 28 bounded contexts; FMX-160 / GD-0038 frames 28 as an actively managed ceiling under a standing merge-review gate, not an immutable final target.

## Related

- [[raw-perplexity/raw-bounded-context-merge-review-gate-2026-06-16]]
- [[raw-perplexity/raw-bounded-context-merge-review-gate-source-checks-2026-06-16]]
- [[../40-Execution/fmx-160-context-portfolio-gate-decision-record-2026-06-16]]
- [[../50-Game-Design/GD-0038-bounded-context-portfolio-trim-merge-review-gate]]
- [[../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]
- [[../10-Architecture/09-Decisions/ADR-0093-joint-ratification-wave-async-coordination-foundation]]
- [[../10-Architecture/bounded-context-map]]

