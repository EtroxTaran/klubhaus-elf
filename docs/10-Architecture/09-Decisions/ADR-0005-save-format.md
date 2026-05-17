---
title: ADR-0005 Save Format and Versioning
status: accepted
tags: [adr, save]
created: 2026-05-15
updated: 2026-05-17
type: adr
binding: true
supersedes:
superseded_by:
related: [[ADR-0002-offline-first]]
---

# ADR-0005: Save Format and Versioning

## Status

accepted

## Date

2026-05-15

## Context

Careers run for many in-game seasons across app updates. Save schema will
change while existing local saves must keep loading. There is no server to
re-migrate data centrally.

## Options Considered

- Versioned saves with forward-only migrations (chosen).
- Unversioned JSON with best-effort parsing.
- Bidirectional migrations (forward + backward).

## Decision

Version every career save and support forward migrations only.

## Rationale

Forward-only migrations are simple to reason about and test, and match the
offline-first model where an old client never has to read a newer save.
Bidirectional migration doubles the test surface for no MVP benefit.

## Consequences

Positive:

- Deterministic, testable upgrade path for local saves.

Negative:

- Breaking save changes must ship with migration tests; no localStorage or ad
  hoc JSON parsing fallback is permitted.

## Supersedes

None

## Related Docs

- [[ADR-0002-offline-first]]
- [[../../30-Implementation/pwa-offline-strategy]]
