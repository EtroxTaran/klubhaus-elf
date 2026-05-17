---
title: Quality
status: draft
tags: [architecture, quality]
created: 2026-05-15
updated: 2026-05-17
type: arch
related: [[08-Crosscutting]], [[../30-Implementation/ci-and-review-process]], [[09-Decisions/ADR-0001-tech-stack]]
---

# Quality

Quality gates are Biome, TypeScript strict, Vitest coverage, Playwright offline
smoke coverage, Lighthouse budgets, Cursor hook syntax checks, and Bugbot review.

`main`/`develop` are kept green by default; the enforcement model, flake
policy, and the (rare) override policy are defined in
[[../30-Implementation/ci-and-review-process]].

## Related

- [[../30-Implementation/ci-and-review-process]] — enforcement model · [[../30-Implementation/agent-workflow-pattern]] — review phases
- [[09-Decisions/ADR-0001-tech-stack]] — toolchain decision
- [[08-Crosscutting]] — arc42 sibling
