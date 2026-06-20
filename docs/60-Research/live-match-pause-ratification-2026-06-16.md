---
title: Live Match Pause Ratification
status: current
tags: [research, synthesis, match, watch-party, pause-vote, tactics-pause, reputation, anti-grief, determinism, fmx-140]
context: [watch-party, match]
created: 2026-06-16
updated: 2026-06-16
type: research
binding: false
linear: FMX-140
related:
  - [[raw-perplexity/raw-live-match-pause-ratification-2026-06-16]]
  - [[raw-perplexity/raw-live-match-pause-source-checks-2026-06-16]]
  - [[../40-Execution/fmx-140-live-match-pause-ratification-decision-queue-2026-06-16]]
  - [[../10-Architecture/09-Decisions/ADR-0087-live-match-intervention-buffer-and-pause-vote]]
  - [[../50-Game-Design/GD-0035-live-coaching-intervention-and-pause-rules]]
  - [[../10-Architecture/state-machines/match]]
  - [[../10-Architecture/state-machines/watch-party]]
  - [[../30-Implementation/gameplay-calibration-and-soak-test-runbook]]
---

# Live Match Pause Ratification

## Scope

FMX-140 reconciles the live-match pause-vote and intervention-buffer packet
after ADR-0087 was already accepted/binding. It does not reopen ADR-0072,
create a new bounded context or lock final numeric magnitudes. It:

- removes stale draft/proposed caveats from ADR-0087, `match.md` and
  `watch-party.md`;
- promotes the FMX-140 answers for pause semantics, tactics pause,
  role/reputation privileges and abuse revocation into GD-0035/ADR-0087;
- preserves all numeric magnitudes as GD-0043 / FMX-52 calibration debt behind
  versioned policy profiles.

## Source-backed synthesis

Real football is the anchor, but not the exact mechanic. IFAB Law 7 gives the
referee control over time allowance for substitutions, injuries, wasting time,
disciplinary sanctions and other significant restart delays. IFAB Law 3 keeps
substitution entry/exit referee-controlled and, in the 2026/27 law text, adds a
10-second substitution-exit consequence that reinforces anti-delay design.
There is no manager-controlled timeout in the Laws; FMX's deliberate pause is a
game-world fairness affordance.

Comparable games and esports are treated as weak-pattern evidence only:
short tactical timeouts, separate technical pauses, host/admin override,
cooldowns and logs are useful patterns, but Perplexity did not surface stable
primary rulebook citations for exact values. FMX therefore canonizes the shape,
not imported timeout counts.

Deterministic simulation evidence supports the existing ADR-0072/0087 line:
the authoritative simulation should consume ordered inputs at stable ticks or
semantic boundaries. A pause cannot inject wall-clock into Match. Watch Party
may decide *when* to emit `PauseMatch` / `ResumeMatch`, but Match decides only
from ordered commands/events and pauses at a deterministic boundary.

## Ratified FMX-140 decisions

| ID | Question | Nico decision | Resulting FMX rule |
|---|---|---|---|
| D1 | Pause semantics | Design 1 | Active-manager deliberate pause suspends authoritative sim progression at deterministic safe points. Spectator pause/replay is presentation-only. |
| D2 | Tactics pause | MVP one-half | MVP includes a separate longer tactics pause, one per managed side per half, strict auto-resume and calibration profile. |
| D3 | Role/reputation pause privileges | Full MVP | MVP includes local trust-tier and Head Coach/host pause privileges. |
| D4 | Reputation scope | Local trust tier | Watch Party owns per-group/competition `PauseTrustTier` from completed matches, abuse reports and audit facts. No global social score. |
| D5 | Privilege shape | Small additive | Head Coach/host gets +1 ordinary deliberate pause per half and one veto override; trusted tier gets +1 ordinary deliberate pause per half, all under hard platform ceilings. |
| D6 | Abuse guardrail | Audit-gated | Extra privileges are revocable through abandon/report/cooldown facts and thresholded behind a versioned pause policy profile. |

## Product/architecture consequences

- Ordinary deliberate pause keeps ADR-0087's hybrid veto/quorum and discrete
  budget model.
- Tactics pause is a distinct `pauseKind = tactics`, not a larger ordinary
  deliberate pause. It is longer, one per managed side per half, and cannot be
  banked or stacked.
- Disconnect pause remains distinct and system-triggered.
- Head Coach/host and trusted-tier extras are additive only; they cannot exceed
  platform ceilings for max single pause duration, total paused time per half,
  auto-resume and audit.
- Local trust tier belongs to Watch Party/group competition scope and is based
  on auditable session facts. It is not an account-wide reputation score.
- `pausePrivilegePolicyVersion` and `interventionPolicyVersion` identify the
  calibration/policy pack used for budgets, thresholds, cooldowns and ceilings.

## Follow-up

FMX-140 closes the open ratification cleanup. Remaining work is calibration, not
decision:

- exact pause durations, cooldowns, trust thresholds and audit-report windows;
- deterministic test vectors for pause/intervention ordering after the code
  phase exists;
- player-facing copy/UX validation for how trusted-tier and Head Coach
  privileges are explained without encouraging entitlement or abuse.

## Related

- Raw Perplexity capture:
  [[raw-perplexity/raw-live-match-pause-ratification-2026-06-16]]
- Source checks:
  [[raw-perplexity/raw-live-match-pause-source-checks-2026-06-16]]
- Decision queue:
  [[../40-Execution/fmx-140-live-match-pause-ratification-decision-queue-2026-06-16]]
- Architecture:
  [[../10-Architecture/09-Decisions/ADR-0087-live-match-intervention-buffer-and-pause-vote]]
- Game design:
  [[../50-Game-Design/GD-0035-live-coaching-intervention-and-pause-rules]]

