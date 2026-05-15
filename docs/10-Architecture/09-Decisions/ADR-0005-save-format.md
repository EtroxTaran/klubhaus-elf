---
title: ADR-0005 Save Format and Versioning
status: draft
tags: [adr, save]
updated: 2026-05-15
---

# ADR-0005: Save Format and Versioning

## Decision

Version every career save and support forward migrations only.

## Consequences

Breaking save changes must ship with migration tests and cannot rely on
localStorage or ad hoc JSON parsing.
