---
title: Raw FMX-132 DDD Context-boundary Research
status: raw
tags: [research, raw, perplexity, ddd, bounded-context, context-map, published-language, acl, sporting-core, fmx-132]
created: 2026-06-16
updated: 2026-06-16
type: research-raw
binding: false
linear: FMX-132
related:
  - [[../sporting-core-context-definition-maturity-2026-06-16]]
  - [[../../10-Architecture/09-Decisions/ADR-0129-match-context-definition]]
  - [[../../10-Architecture/09-Decisions/ADR-0130-training-context-definition]]
  - [[../../10-Architecture/09-Decisions/ADR-0131-squad-and-player-context-definition]]
---

# Raw FMX-132 DDD Context-boundary Research

## Prompt

FMX-132 research pass 1: For a DDD/docs-vault football manager game, should
Match, Training, and Squad & Player be separate bounded-context definition ADRs
or kept as fragmented concern rows/per-feature ADRs? Research DDD best
practices for bounded context definition documents, context maps, published
language, ACLs, aggregate inventory, and decision records. Include 2-3 options,
a recommendation, and citations.

## Perplexity Capture

Perplexity recommended treating Match, Training and Squad & Player as candidate
bounded contexts and capturing them in strategic ADR/context-map docs, with
lower-level per-feature ADRs kept beneath them.

Options returned:

- **A. One context-definition ADR per major football subdomain.** Create
  separate ADRs for Match, Training and Squad & Player. Each records purpose,
  inside/outside scope, local language, aggregate inventory, integration
  relationships, published language and ACL responsibilities. This was the
  strongest recommendation.
- **B. One Game Domain Contexts ADR plus annexes.** One larger strategic ADR
  records the context map and includes annexes for Match, Training and Squad &
  Player. Lower document count, but higher risk of becoming a heavy mixed file.
- **C. Only per-feature ADRs.** Tag feature decisions with a context field and
  skip context-definition ADRs. Lowest overhead, but weakest for strategic DDD
  because shared terms like fitness, form, availability and match-readiness can
  drift without a boundary doc.

Perplexity's recommended structure per context-definition ADR:

- intent and served business capabilities;
- inside/outside scope;
- ubiquitous-language terms;
- aggregate inventory and key invariants;
- upstream/downstream relationships;
- published language and ACL responsibilities;
- relationship to feature ADRs.

Perplexity also advised a hybrid rule: keep the context-definition ADRs stable
and let per-feature ADRs update them only when a feature materially changes the
boundary or public contract.

## Source Check

The Perplexity citation set mixed strong and weak sources. Source-checked
evidence used in synthesis:

- Martin Fowler, "Bounded Context", states that bounded context is central to
  DDD strategic design, that DDD handles large models by dividing them into
  bounded contexts, and that the interrelationships are worth depicting in a
  context map:
  https://martinfowler.com/bliki/BoundedContext.html
- Microsoft Learn, "Use domain analysis to model microservices", was updated
  2026-02-25 and is useful even though FMX is a modular-monolith target. It
  separates strategic DDD from tactical DDD, recommends defining bounded
  contexts before aggregates/services, documents context maps, and names
  Customer/Supplier, Open Host Service, Published Language and ACL patterns:
  https://learn.microsoft.com/en-us/azure/architecture/microservices/model/domain-analysis
- Context Mapper's language semantics page confirms that OHS and Published
  Language belong to upstream contexts, while ACL and Conformist are downstream
  roles. It is useful for keeping FMX context-map wording precise:
  https://contextmapper.org/docs/language-model/

Rejected or weak Perplexity sources for canon:

- Generic blogs, StackOverflow, Reddit, YouTube and LinkedIn posts are useful
  for practitioner wording only. They are not used as hard evidence for FMX's
  context-definition rule.

## Local Source Check

Local FMX evidence is stronger than generic public examples:

- [[../../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]] already
  requires context-owned data and public contracts, not shared internals.
- [[../../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]
  and [[../bounded-context-merge-review-gate-2026-06-16]] keep the 28-context
  map as current catalog under a merge-review gate.
- [[../../10-Architecture/bounded-context-map]] already lists Match, Training
  and Squad & Player as Original-11 Sporting Core contexts but lacks the
  context-definition ADR detail requested by FMX-132.

