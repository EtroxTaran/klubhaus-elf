---
title: ADR-0009 Cursor Cloud Agent Orchestration
status: draft
tags: [adr, meta]
updated: 2026-05-15
---

# ADR-0009: Cursor Cloud Agent Orchestration

## Decision

Use Plan Mode outputs in `.cursor/plans/`, serialize schema/interface/config
changes, and fan out only independent beats after file, interface, and config
exclusivity checks.

## Consequences

Cloud Agent branches use `cursor/*`; every branch needs CI, Bugbot, docs, and a
draft PR before merge.
