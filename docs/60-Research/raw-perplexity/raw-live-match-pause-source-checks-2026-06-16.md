---
title: Raw Source Checks - Live Match Pause Ratification
status: raw
tags: [research, raw, source-check, match, watch-party, pause-vote, tactics-pause, anti-grief, determinism, fmx-140]
created: 2026-06-16
updated: 2026-06-16
type: research
binding: false
linear: FMX-140
related:
  - [[../live-match-pause-ratification-2026-06-16]]
  - [[raw-live-match-pause-ratification-2026-06-16]]
  - [[../../10-Architecture/09-Decisions/ADR-0087-live-match-intervention-buffer-and-pause-vote]]
  - [[../../50-Game-Design/GD-0035-live-coaching-intervention-and-pause-rules]]
  - [[../../10-Architecture/state-machines/match]]
  - [[../../10-Architecture/state-machines/watch-party]]
---

# Raw Source Checks - Live Match Pause Ratification

## Checked sources

| Source | Type | Useful evidence | Limits |
|---|---|---|---|
| IFAB Law 7, Duration of the Match, https://www.theifab.com/laws/latest/the-duration-of-the-match/ | Primary football law | Two equal 45-minute halves, halftime interval, referee allowance for time lost through substitutions, injuries, wasting time, disciplinary sanctions, medical stoppages, VAR checks, goal celebrations and other significant restart delays. | Does not discuss video-game pause; "no manager timeout" is an inference from the absence of any manager-controlled stoppage right and the referee-owned time allowance. |
| IFAB Law 3, The Players, https://www.theifab.com/laws/latest/the-players/ | Primary football law | Substitution procedure is referee-controlled and tied to stoppage/permission. The 2026/27 text includes a 10-second exit consequence for substituted players, reinforcing anti-delay design. | Competition-specific substitution counts/windows still come from competition rules; FMX must keep them data-driven. |
| The Guardian, "MLS's experimental rule changes...", 2026-02-27, https://www.theguardian.com/football/2026/feb/27/mls-rule-changes-ifab-time-wasting | Credible secondary reporting | Explains the timed-substitution and off-field-treatment anti-time-wasting experiments moving toward global IFAB adoption; useful as historical context for why strict timing guardrails matter. | News article, not law text; the IFAB laws above remain the authority. |
| Gaffer On Games, "Deterministic Lockstep", https://gafferongames.com/post/deterministic_lockstep/ | Engineering/game-networking source | Deterministic simulation depends on identical initial state + same inputs at the same frame; input/frame buffering is necessary because the simulation cannot safely advance without the relevant input. Supports FMX's boundary-buffer and pause-at-safe-point contract. | Physics/networking article, not FMX-specific and not an authoritative server architecture standard. Use as design evidence, not copied implementation. |
| [[../../10-Architecture/09-Decisions/ADR-0072-in-match-control-seam]] | FMX accepted ADR | Existing control seam: light commands bind next tick, heavy commands bind at semantic boundaries through immutable `TacticSnapshot`. | Leaves pause/buffer governance to ADR-0087/FMX-140. |
| [[../../10-Architecture/09-Decisions/ADR-0087-live-match-intervention-buffer-and-pause-vote]] | FMX accepted ADR | Current accepted architecture for intervention buffer and deliberate pause-vote, already ratified before FMX-140. | Body/front-door text still carried draft-era caveats before this cleanup. |
| [[../../50-Game-Design/GD-0035-live-coaching-intervention-and-pause-rules]] | FMX accepted GDDR | Current design record for live coaching and pause fairness. | Body still parked tactics pause, reputation and Head Coach privilege as post-MVP before Nico's FMX-140 answers. |

## Source-check conclusions

1. **Real-world realism:** football has referee-managed stoppage and added
   time, not manager timeouts. FMX should clearly treat deliberate pause as a
   game-world fairness affordance, not realism.
2. **Sport-shaped timing:** substitutions and halftime provide the strongest
   real-football analogies for safe tactical intervention. Heavy changes stay
   bound to stoppage/restart/halftime boundaries.
3. **Anti-grief shape:** the 10-second substitution-exit rule and broader
   anti-time-wasting direction support hard caps, no carry-over, auto-resume
   and audit.
4. **Determinism:** active-manager pauses may suspend simulation progression
   only at deterministic positions. Wall-clock belongs in Watch Party; Match
   sees ordered commands/events.
5. **Spectators:** spectator pause/replay must remain presentation-only and
   never advance, rewind or mutate the authoritative match stream.
6. **Weak precedent handling:** esports and Football Manager precedent are
   useful design analogies, but FMX-140 should not encode exact timeout numbers
   from unsourced tournament/community claims.
