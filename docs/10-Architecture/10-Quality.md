---
title: Quality
status: draft
tags: [architecture, quality]
updated: 2026-05-15
---

# Quality

Quality gates are Biome, TypeScript strict, Vitest coverage, Playwright offline
smoke coverage, Lighthouse budgets, Cursor hook syntax checks, and Bugbot review.

`main`/`develop` are kept green by default; the enforcement model, flake
policy, and the (rare) override policy are defined in
[[../30-Implementation/ci-and-review-process]].
