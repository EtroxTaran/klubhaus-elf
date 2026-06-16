---
title: FMX-140 Live Match Pause Ratification Decision Queue
status: current
tags: [execution, decision-queue, match, watch-party, pause-vote, tactics-pause, reputation, accepted, fmx-140]
created: 2026-06-16
updated: 2026-06-16
type: decision-queue
binding: false
linear: FMX-140
related:
  - [[../60-Research/live-match-pause-ratification-2026-06-16]]
  - [[../60-Research/raw-perplexity/raw-live-match-pause-ratification-2026-06-16]]
  - [[../60-Research/raw-perplexity/raw-live-match-pause-source-checks-2026-06-16]]
  - [[../10-Architecture/09-Decisions/ADR-0087-live-match-intervention-buffer-and-pause-vote]]
  - [[../50-Game-Design/GD-0035-live-coaching-intervention-and-pause-rules]]
  - [[../10-Architecture/state-machines/match]]
  - [[../10-Architecture/state-machines/watch-party]]
---

# FMX-140 Live Match Pause Ratification Decision Queue

## Context

FMX-140 asked to ratify the pause-vote and intervention-buffer dependencies and
priority after FMX-101. Live triage found no active FMX-140 branch/PR/worktree,
then Linear FMX-140 moved from Backlog to In Progress on 2026-06-16 before
vault work began.

The issue text was stale: [[../10-Architecture/09-Decisions/ADR-0087-live-match-intervention-buffer-and-pause-vote]]
was already `accepted` / `binding: true`, but its body, both state-machine
amendments and [[../50-Game-Design/GD-0035-live-coaching-intervention-and-pause-rules]]
still carried draft-era copy. FMX-140 is therefore a ratification cleanup plus
small accepted amendment for tactics pause, local reputation and role
privileges.

## Decisions asked and answered

| ID | Question | Options presented | Nico decision |
|---|---|---|---|
| D1 | Should a deliberate active-manager pause stop authoritative match progression or only pause presentation? | Design 1: stop authoritative sim at deterministic points. Design 2: presentation-only for active managers. Design 3: mode-specific split. | **Design 1**. Active-manager deliberate pauses suspend sim progression at deterministic safe points; passive spectator pause/replay stays presentation-only. |
| D2 | Should a longer tactics pause ship in MVP? | MVP one-half. Post-MVP. Ordinary pause only. | **MVP one-half**. One longer tactics pause per managed side per half, strict auto-resume/calibration profile. |
| D3 | Should role/reputation pause privileges ship in MVP? | Full MVP. Hooks only. Post-MVP. | **Full MVP**. Role and local trust-tier privileges are in scope. |
| D4 | Should pause reputation be global or local? | Local trust tier. Global account score. No reputation. | **Local trust tier**. Watch Party owns per-group/competition pause-trust from completed matches and audit facts; no global social score. |
| D5 | What privilege shape is allowed? | Small additive. Broad host powers. Cosmetic-only badges. | **Small additive**. Head Coach/host gets +1 ordinary deliberate pause per half and one veto override; trusted tier gets +1 ordinary deliberate pause per half, all under hard ceilings. |
| D6 | How are extra privileges revoked? | Audit-gated. Manual admin only. Automatic opaque decay. | **Audit-gated**. Abandon/report/cooldown facts can revoke privileges via a versioned policy profile. |

## Accepted packet

- ADR-0087 remains accepted/binding; no bounded-context-map change.
- `match.md §5.1` and `watch-party.md §5.2` are current amendments, not draft.
- Deliberate active-manager pauses suspend authoritative Match progression at
  deterministic safe points; spectator replay controls are presentation-only.
- MVP has three pause kinds in the Watch Party policy surface:
  `deliberate`, `tactics` and `disconnect`.
- Tactics pause is one per managed side per half, longer than ordinary
  deliberate pause, never banked, always auto-resumed and governed by
  `pausePrivilegePolicyVersion`.
- `PauseTrustTier` is local to a watch party group/competition and based on
  auditable completed-match, abandon/report and cooldown facts.
- Head Coach/host and trusted-tier privileges are additive only and stay below
  platform ceilings for single-pause duration, total paused time per half,
  auto-resume and audit.

## Evidence

- Raw Perplexity:
  [[../60-Research/raw-perplexity/raw-live-match-pause-ratification-2026-06-16]]
- Source checks:
  [[../60-Research/raw-perplexity/raw-live-match-pause-source-checks-2026-06-16]]
- Synthesis:
  [[../60-Research/live-match-pause-ratification-2026-06-16]]

## Follow-up

No further architecture decision is needed for FMX-140. Future calibration
belongs to GD-0043 / FMX-52 and should tune exact durations, cooldowns, trust
thresholds, audit-report windows and test vectors once the playable system
exists.

