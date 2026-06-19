---
title: Raw Perplexity - FMX-166 Deferral Governance Triggers
status: raw
tags: [research, raw, perplexity, fmx-166, governance, adr, technology-radar, decision-gate, surrealdb]
created: 2026-06-19
updated: 2026-06-19
type: research
binding: false
linear: FMX-166
sourceType: perplexity
related:
  - [[../surrealdb-deferral-reevaluation-watch-2026-06-19]]
  - [[raw-fmx-166-surrealdb-deferral-source-checks-2026-06-19]]
  - [[../../40-Execution/fmx-166-surrealdb-deferral-watch-decision-queue-2026-06-19]]
  - [[../../10-Architecture/11-Risks]]
---

# Raw Perplexity - FMX-166 Deferral Governance Triggers

## Prompt

Find best-practice governance patterns for deferred technology adoption:
re-evaluation triggers, owner/watch cadence, technology radar posture,
decision-queue criteria and what a specialized datastore must prove before
moving from deferred to trial or adopt.

## Raw capture

Perplexity proposed four trigger classes:

- **time cadence:** a light scheduled review so stale wording is found before
  implementation;
- **context change:** re-evaluate when the product has a concrete feature that
  needs the deferred technology;
- **risk change:** re-evaluate on major release, security advisory, migration,
  backup or operational changes;
- **experience feedback:** re-evaluate when prototypes or incidents prove the
  current stack cannot meet a target.

It mapped the posture to a technology-radar style:

- **Assess:** learn, track, keep options open;
- **Trial:** build a bounded, reversible prototype with success criteria;
- **Adopt:** production commitment after operational evidence, rollback and
  ownership are proven;
- **Hold:** avoid or stop using until a blocker clears.

For a datastore, Perplexity recommended that "Trial" require:

- non-authoritative, rebuildable projection data only;
- source-of-record remains elsewhere;
- explicit rebuild and disable path;
- measured latency/cost/operational target;
- backup/migration/restore evidence;
- observability and on-call ownership;
- time-boxed prototype with a written exit decision.

## Source-quality note

Several Perplexity citations for governance were weak or unrelated to software
architecture. The synthesis therefore keeps only the generic trigger/radar
pattern and source-checks it against established architecture practice and the
FMX decision protocol.

