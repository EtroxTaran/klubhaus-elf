---
title: Quality
status: current
tags: [architecture, quality]
created: 2026-05-15
updated: 2026-05-22
type: architecture
binding: false
related:
  - [[08-Crosscutting]]
  - [[../30-Implementation/ci-and-review-process]]
  - [[09-Decisions/ADR-0001-tech-stack]]
---

# Quality

Quality gates are Biome, TypeScript strict, Vitest coverage, Playwright offline
smoke coverage, Lighthouse budgets, Cursor hook syntax checks, and Bugbot review.

`main`/`develop` are kept green by default; the enforcement model, flake
policy, and the (rare) override policy are defined in
[[../30-Implementation/ci-and-review-process]].
## Related

- [[08-Crosscutting]]
- [[../30-Implementation/ci-and-review-process]]
- [[09-Decisions/ADR-0001-tech-stack]]
