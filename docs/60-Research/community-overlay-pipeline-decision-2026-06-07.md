---
title: Community Overlay Pipeline — decision grounding 2026-06-07
status: draft
tags: [research, community, overlay, import, ddd, dsa, bounded-context, fmx-33, fmx-54]
context: community-overlay
created: 2026-06-07
updated: 2026-06-07
type: research
binding: false
sourceType: external
related:
  - [[../10-Architecture/09-Decisions/ADR-0059-community-overlay-pipeline-context]]
  - [[community-overlay-pipeline-bounded-context-2026-05-28]]
  - [[../10-Architecture/bounded-context-map]]
---

# Community Overlay Pipeline — decision grounding (2026-06-07)

Fresh grounding to close the open Nico choice on **ADR-0059** (drafted/recommended, but never
ratified). Confirms the existing Option-D recommendation and the local-import-only MVP posture.

## Two open calls

- **D1 — own bounded context vs platform service** (Option D vs Option A).
- **D2 — MVP distribution: local-file/P2P import only vs hosted marketplace** (DSA exposure).

## What best practice says (Perplexity Sonar, 2026-06-07)

- **D1 → own bounded context.** An import/ingestion pipeline with its **own ubiquitous language**
  (pack, manifest, validation report, provenance, staging, activation, dependency, version),
  **own lifecycle** (upload → syntactic validate → semantic-validate-delegated → stage → activate →
  deactivate/migrate), **own data model**, and **integration-heavy** delegation to owning domains is a
  *real bounded context* (a **supporting subdomain** coordinating core subdomains) — **not** a thin
  ACL or a generic cross-cutting platform service. Each owning domain (Regulations/Rivalry/Tactics)
  acts as a **validation authority** for its slice; the pipeline aggregates verdicts and owns the
  activate/reject decision. This is exactly ADR-0059's Option D.
- **Ecosystem precedent confirms the split:** Factorio Mod Portal (`info.json` manifest + version +
  dependency constraints; fail-fast at load), Paradox launcher (Workshop + Paradox Mods; version/DLC/
  dependency metadata, incompatibility flagging), Steam Workshop (item metadata + report/takedown).
  All separate a **mod ingestion/distribution context** from the **core simulation**, feeding it a
  validated, version-pinned mod set.
- **D2 → local-import-only for MVP.** Running a **hosted** sharing platform makes you an "online
  platform hosting user content" under the **EU DSA**: notice-and-action, trusted flaggers, annual
  transparency reports, moderation logs/appeals. **Local-file/P2P import keeps you out of own-backend
  platform scope** (EULA + local-safety only) while you still build the strong ingestion BC.
  Recommendation: ship local-only, design the BC so a hosted/Workshop adapter can plug in later.
- **Determinism/safety:** treat an activated pack as **versioned, immutable input** (store pack
  ids+versions+hashes in the save; replay uses the exact versions); **data-only, no executable code**;
  syntactic validation in the pipeline + **semantic validation delegated** to owning domains;
  fail-fast at activation, never mid-sim — matching Factorio/Paradox and ADR-0051's save-creation
  determinism rule.

## Recommendation

**D1 = Option D (own bounded context); D2 = local-import-only MVP** (FMX-54 privacy/naming gate on the
IPGate; hosted distribution blocked until DSA notice-and-action + moderation + DSAR are built). This is
the existing ADR-0059 landing — now externally re-grounded and ready to ratify. Two already-binding
ADRs (0056 Regulations, 0057 Rivalry) name "FMX-33 Community Overlay Pipeline" as their upstream
orchestrator, so ratifying resolves dangling references; deferring leaves architectural debt.

## Sources

Perplexity Sonar 2026-06-07 (DDD ingestion-context vs ACL; Steam Workshop / Paradox / Factorio mod
architecture; EU DSA notice-and-action / trusted-flaggers / transparency; deterministic untrusted-input
validation). Prior synthesis [[community-overlay-pipeline-bounded-context-2026-05-28]].
