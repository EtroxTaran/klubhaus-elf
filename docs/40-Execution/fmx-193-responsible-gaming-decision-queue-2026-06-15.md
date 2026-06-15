---
title: FMX-193 Responsible gaming decision queue
status: current
tags: [execution, decision-queue, responsible-gaming, dark-patterns, monetization, compliance, fmx-193]
created: 2026-06-15
updated: 2026-06-15
type: decision-queue
binding: false
linear: FMX-193
related:
  - [[../60-Research/responsible-gaming-binding-record-2026-06-15]]
  - [[../40-Compliance/responsible-gaming]]
  - [[../10-Architecture/09-Decisions/ADR-0122-responsible-gaming-and-dark-pattern-invariant]]
  - [[../10-Architecture/09-Decisions/ADR-0107-pricing-and-iap-monetization-boundary]]
  - [[../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
  - [[../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]]
---

# FMX-193 Responsible gaming decision queue

This is the HITL decision packet for FMX-193. No option below is accepted until
Nico decides.

## D1 - record shape

| Option | Meaning | Assessment |
|---|---|---|
| **A. Dedicated ADR-0122 plus compliance home** | Create a standalone draft ADR and a durable responsible-gaming compliance note. | **Recommended.** Auditable and separate from monetization SKU/fairness debates. |
| B. Fold into ADR-0107/ADR-0108 only | Add responsible gaming to the existing monetization/no-P2W drafts. | Mixes player-wellbeing, rating evidence and competitive fairness into overloaded records. |
| C. Compliance note only | Keep the checklist without an ADR. | Too weak for cross-cutting product and architecture gates. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D2 - paid random rewards

| Option | Meaning | Assessment |
|---|---|---|
| **A. Hard ban** | No paid random rewards, loot boxes, paid packs, paid mystery awards or paid trading path. | **Recommended.** Strongest trust posture and cleanest IARC/USK evidence. |
| B. Re-evaluate post-MVP | Keep MVP clean but allow a later research re-open. | Acceptable only as a future explicit ADR, not as hidden optionality. |
| C. Allow paid random cosmetics with disclosure | Paid random cosmetic-only items if odds and descriptors are disclosed. | Not recommended; still creates rating, youth, spend-control and trust risk. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D3 - dark-pattern gate

| Option | Meaning | Assessment |
|---|---|---|
| **A. Ban plus release self-audit** | Block false urgency, guilt copy, hidden defaults, confirmshaming, roach-motel friction, punitive absence and paid pressure relief; save audit evidence. | **Recommended.** Aligns DSA/design best practice and keeps rating evidence current. |
| B. Guideline only | Document examples but no explicit gate. | Too easy to drift under marketing/live-ops pressure. |
| C. Decide later | Defer until there is an app UI. | Late; product copy and monetization assumptions would already be shaped. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D4 - wellness/session reminders

| Option | Meaning | Assessment |
|---|---|---|
| **A. Optional local reminders, default off for 18+** | A settings-controlled local session timer with neutral prompts and no required telemetry. | **Recommended.** Trust signal without tracking or paternalism. |
| B. Default on for all users | Show session reminders by default. | Higher friction; may feel preachy for adult strategy-game players. |
| C. No reminders | Rely only on public statement and no dark patterns. | Leaves a cheap wellbeing tool unused. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D5 - public responsible-gaming statement

| Option | Meaning | Assessment |
|---|---|---|
| **A. Versioned statement now, product route later** | Keep the statement in the vault now and publish `/responsible-gaming` when the app/site exists. | **Recommended.** Prevents copy drift and creates launch-ready proof. |
| B. Wait until public launch | Draft only when marketing/site work starts. | Risk of late legal/product copy conflict. |
| C. Marketing-only copy | Treat it as landing-page copy, not a compliance artifact. | Too weak and not auditable. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D6 - PM-18 scope split

| Option | Meaning | Assessment |
|---|---|---|
| **A. Responsible-gaming only** | FMX-193 resolves responsible-gaming findings; OSS/license findings need a separate issue. | **Recommended.** Keeps this issue small and avoids blocking on license strategy. |
| B. Include OSS/license matrix too | Combine both halves of PM-18 in one ADR. | Over-scoped; founder/legal license choices are separate. |
| C. Defer whole record until OSS is ready | Wait for license strategy before responsible gaming. | Leaves responsible-gaming risks orphaned. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D7 - relation to monetization drafts

| Option | Meaning | Assessment |
|---|---|---|
| **A. Bind guardrails independently if accepted** | Responsible-gaming bans can become binding even while ADR-0107/0108/GD-0041 remain draft. | **Recommended.** No paid randomness/no dark patterns are safer than final SKU details. |
| B. Wait for monetization ratification | Keep all responsible-gaming rules draft until monetization is approved. | Unnecessarily delays invariant-level guardrails. |
| C. Ratify monetization through FMX-193 | Use this issue to accept ADR-0107/0108/GD-0041. | Not recommended; FMX-193 did not research all monetization decisions. |

**Recommendation:** A.

**Decision:** Pending Nico.

## Decision record

- 2026-06-15: FMX-193 selected from live Linear after main was updated to
  `bc8dadc`.
- 2026-06-15: FMX-193 moved from `Backlog` to `In Progress`.
- 2026-06-15: clean worktree/branch created:
  `codex/fmx-193-responsible-gaming-binding-record`.
- 2026-06-15: Perplexity-first research saved and weak citations separated
  from source-checked evidence.
- 2026-06-15: Decision-pending synthesis, draft ADR-0122 and draft compliance
  home prepared.

## Proposed packet

Recommended selection: **D1=A, D2=A, D3=A, D4=A, D5=A, D6=A, D7=A**.

If accepted, promote
[[../10-Architecture/09-Decisions/ADR-0122-responsible-gaming-and-dark-pattern-invariant]]
to `accepted` / `binding: true` and
[[../40-Compliance/responsible-gaming]] to `current` / `binding: true`.
ADR-0107, ADR-0108 and GD-0041 remain separate decision gates unless Nico
explicitly ratifies them.

## Related

- [[../60-Research/responsible-gaming-binding-record-2026-06-15]]
- [[../60-Research/raw-perplexity/raw-responsible-gaming-legal-regulatory-2026-06-15]]
- [[../60-Research/raw-perplexity/raw-responsible-gaming-game-precedents-2026-06-15]]
- [[../60-Research/raw-perplexity/raw-responsible-gaming-source-checks-2026-06-15]]
- [[../40-Compliance/responsible-gaming]]
- [[../10-Architecture/09-Decisions/ADR-0122-responsible-gaming-and-dark-pattern-invariant]]

