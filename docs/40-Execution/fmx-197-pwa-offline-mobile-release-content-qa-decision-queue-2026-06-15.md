---
title: FMX-197 PWA offline mobile release content QA decision queue
status: current
tags: [execution, decision-queue, pwa, offline, mobile, rollback, content-qa, localization, llm, quality, fmx-197]
created: 2026-06-15
updated: 2026-06-15
type: decision-queue
binding: false
linear: FMX-197
related:
  - [[../60-Research/pwa-offline-mobile-release-content-qa-gates-2026-06-15]]
  - [[../40-Quality/pwa-offline-mobile-release-content-qa-gates]]
  - [[../10-Architecture/09-Decisions/ADR-0124-pwa-offline-mobile-release-content-qa-gates]]
  - [[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
  - [[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
---

# FMX-197 PWA offline mobile release content QA decision queue

This is the HITL decision packet for FMX-197. No option below is accepted until
Nico decides.

## D1 - offline/degradation scope

| Option | Meaning | Assessment |
|---|---|---|
| **A. Hybrid-online offline contract** | App shell, confirmed read caches and local drafts work offline; final actions and progression require server confirmation. | **Recommended.** Matches ADR-0020/0090 and keeps offline useful without creating local authority. |
| B. Read-only offline | Shell and confirmed read cache only; no offline draft writes. | Lower data-loss risk but weak for tactical/planning play. |
| C. Local-authoritative MVP | Offline progression/matches with later reconciliation. | Reopens anti-cheat, conflict and save-trust scope. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D2 - storage budget and eviction policy

| Option | Meaning | Assessment |
|---|---|---|
| **A. Tiered storage budgets and eviction UX** | Critical drafts, rehydratable read/content caches and disposable media/diagnostics have separate caps and failure behavior. | **Recommended.** Browser storage is useful but evictable and quota-limited. |
| B. Best-effort only | Store data and handle failures with a generic error. | Too weak for local-only draft trust. |
| C. Large offline world by default | Cache large data/history/content packs locally. | High iOS/mobile quota and stale-data risk. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D3 - service-worker update and rollback

| Option | Meaning | Assessment |
|---|---|---|
| **A. User-mediated update plus rescue SW** | Waiting-worker prompt, versioned caches, last-known-good artifacts, no-op/rescue SW drill and emergency-only `Clear-Site-Data`. | **Recommended.** Fits stateful sessions and Chrome/Workbox guidance. |
| B. Auto activate every update | Always use `skipWaiting`/claim immediately. | Can interrupt sessions and mixed static assets. |
| C. No rollback contract | Fix forward only. | Too risky for SW/storage releases. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D4 - rollout and release evidence

| Option | Meaning | Assessment |
|---|---|---|
| **A. Internal/beta/staged release gates** | Progressive exposure, halt criteria, monitoring and rollback/fix-forward record. | **Recommended.** Mirrors Google Play and Apple phased-release controls. |
| B. Big-bang deploy | Release to all users after CI. | Too risky for SW/content/storage changes. |
| C. Store-only staged gates later | Defer rollout discipline until native wrappers. | Misses PWA source-of-truth risk. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D5 - content-pack validation gates

| Option | Meaning | Assessment |
|---|---|---|
| **A. Manifested packs and validators** | Pack version/hash/dependencies/provenance/compatibility plus schema, football, IP, localization and Narrative fallback checks. | **Recommended.** Makes content activation auditable and rollbackable. |
| B. Manual copy review only | Human sample review without structured validation. | Too weak for large football data. |
| C. Runtime correction | Ship and patch content live when issues are found. | Bad trust posture for long saves. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D6 - generated/localized content safety

| Option | Meaning | Assessment |
|---|---|---|
| **A. Template-first, generated content only after gates** | No runtime LLM authority; generated/build-time assisted content enters packs only after schema, safety, IP and human-review checks. | **Recommended.** Aligns ADR-0030/0065/0117 and OWASP guidance. |
| B. Authored-only MVP | No generated content in MVP packs. | Lowest risk but less useful for content tooling. |
| C. Runtime LLM player-visible prose by default | Online generated output shown directly in UX. | Reopens safety, replay, cost and provenance decisions. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D7 - evidence retention and rebaseline

| Option | Meaning | Assessment |
|---|---|---|
| **A. Versioned evidence and approval-gated rebaseline** | Keep release evidence, content reports, rollout/halt/rollback records and decide rebaselines explicitly. | **Recommended.** Prevents silent release-quality drift. |
| B. CI summaries only | Keep pass/fail summaries. | Too little for rollback/content forensics. |
| C. Store all artifacts indefinitely | Keep every trace/report. | Storage/noise burden without retention policy. |

**Recommendation:** A.

**Decision:** Pending Nico.

## Decision record

- 2026-06-15: FMX-197 selected after live Linear triage and FMX-177 follow-up
  split.
- 2026-06-15: FMX-197 moved from `Backlog` to `In Progress`.
- 2026-06-15: clean worktree/branch created:
  `codex/fmx-197-pwa-offline-mobile-release-qa`.
- 2026-06-15: Perplexity-first research saved and weak citations separated
  from source-checked evidence.
- 2026-06-15: Decision-pending synthesis, draft ADR-0124 and draft quality
  runbook prepared.

## Proposed packet

Recommended selection: **D1=A, D2=A, D3=A, D4=A, D5=A, D6=A, D7=A**.

If accepted, promote
[[../10-Architecture/09-Decisions/ADR-0124-pwa-offline-mobile-release-content-qa-gates]]
to `accepted` / `binding: true` and
[[../40-Quality/pwa-offline-mobile-release-content-qa-gates]] to `current` /
`binding: true`. Patch [[../40-Quality/test-strategy]] so the FMX-197 matrix
is listed as accepted rather than follow-up.

## Questions for Nico

- Do you accept the recommended **all A** packet?
- If not, which specific decision should change: D1, D2, D3, D4, D5, D6 or D7?
- Should any release/content evidence be kept longer than the recommended
  versioned evidence record?

## Related

- [[../60-Research/pwa-offline-mobile-release-content-qa-gates-2026-06-15]]
- [[../60-Research/raw-perplexity/raw-pwa-offline-mobile-release-content-qa-2026-06-15]]
- [[../60-Research/raw-perplexity/raw-pwa-offline-mobile-release-content-qa-source-checks-2026-06-15]]
- [[../40-Quality/pwa-offline-mobile-release-content-qa-gates]]
- [[../10-Architecture/09-Decisions/ADR-0124-pwa-offline-mobile-release-content-qa-gates]]
