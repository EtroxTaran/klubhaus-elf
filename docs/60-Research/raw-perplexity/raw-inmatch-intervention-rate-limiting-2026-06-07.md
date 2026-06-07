---
title: "Raw — In-match intervention rate-limiting in sims + RTS/MOBA command queues (FMX-101)"
status: raw
tags: [research, raw, perplexity, match, intervention-buffer, rate-limiting, prior-art, ifab, rts, determinism, fmx-101]
created: 2026-06-07
updated: 2026-06-07
type: research
binding: false
linear: FMX-101
related:
  - [[../live-match-intervention-buffer-and-pause-vote-2026-06-07]]
  - [[raw-deterministic-intervention-buffering-2026-06-03]]
---

# Raw capture — in-match intervention rate-limiting + command-queue caps (Perplexity, 2026-06-07)

Verbatim-faithful capture of the Perplexity strand on how football/sports management sims
bound the rate/volume of in-match interventions, the IFAB substitution law, and how
RTS/MOBA engines cap and deterministically order queued commands. Synthesis in
[[../live-match-intervention-buffer-and-pause-vote-2026-06-07]]. Complements the FMX-100
capture [[raw-deterministic-intervention-buffering-2026-06-03]] (which covers the
*acceptance-point/binding* mechanics).

## Prompt (summary)

How is the rate/volume of in-match manager interventions BOUNDED to prevent spam and keep
matches readable/fair? (1) Football Manager: shout/opposition-instruction/mentality/
tactic-tweak/substitution cooldowns or caps + "unavailable/too late" feedback; (2) EA FC /
FIFA & OOTP / EHM intervention limits; (3) real football laws (IFAB 5-sub/3-window,
no coach timeouts, cooling/drinks breaks); (4) RTS/MOBA command-queue caps per tick/entity
+ deterministic ordering of simultaneous commands (tie-break by player/command id). Then
recommend an "intervention buffer policy" for a deterministic football sim (per-point caps,
per-type caps, ordering/tie-break, rejection-feedback categories) and which numbers should
be calibration-tunable vs fixed.

## Answer (verbatim)

In most football/soccer management and live-strategy titles, in-match manager interventions are bounded indirectly (by real-world substitution laws, UI friction, animation/latency, and "too late to execute" checks) rather than by explicit numeric cooldowns or command-queue caps. Where explicit limits exist (e.g. MOBA/RTS command queues), they are usually engine-side caps per tick and per entity, processed in a deterministic order.

### 1. Football Manager (touchline, tactics, subs)

Sports Interactive do not publish detailed "cooldown" numbers for shouts or tactical changes, nor hard caps on queued actions. Observable behaviour (FM21–FM24):

- **Touchline shouts:** can generally only be issued when the ball is out of play / at stoppages; spam → "You cannot shout instructions at this time" or greyed buttons. Some shouts have a soft "effect duration" (~10–15 in-game min) but this is not an enforced cooldown. Functionally: stoppages are discrete acceptance points (≤1 meaningful shout between them); shouts aren't queued — last selection wins before the engine locks in.
- **Opposition instructions & tactical tweaks:** formation/roles/duties/team & opposition instructions adjustable any time, but only active once confirmed and the engine reaches a break point (usually next dead ball). When paused you can stack many tweaks; **no visible cap** on the number of parameters in one go. Engine takes a **snapshot** of tactical state at the acceptance point; still-editing at restart → deferred to next stoppage. No "max N changes per minute" or "max pending instructions"; only the final configuration at a break is applied (last-write-wins).
- **Mentality:** another team instruction; flip frequently but applies at next break; no numeric cap; only the latest at that break is used.
- **Substitutions:** follow IFAB via competition rules data — typically **5 subs** (older comps fewer); **3 windows + half-time**. You can **queue multiple subs** for the next break; no visible hard cap beyond remaining subs and 11-on-field. Exceeding remaining subs → rejected with an error; subbing a now-unavailable (sent-off/injured) player → cancelled with a notification. A sub queued very near full-time may stay "pending" and never execute (no hard "too late" at click time); buttons disabled after the final whistle.
- **Explicit cooldowns/caps/feedback (summary):** no numeric cooldown timers; only "cannot do during live play" gating + effect durations. No formal queue length (tactics = last-write-wins at next point; subs limited by remaining subs + 11-player constraint, multiple queueable per break). Feedback: greyed buttons when a category is globally disabled; error popups on rule violations; quiet failure when something becomes impossible after queuing.

### 2. EA Sports FC / FIFA and OOTP / EHM

- **EA FC / FIFA (Career & Pro Clubs):** action-first; intervention constrained by real-time play + fixed channels rather than formal queue limits. Tactics/instructions via pause menu or D-pad quick tactics — no formal cap, natural limit = input speed/UI friction. D-pad presets toggle any time, no cooldown. Subs follow competition rules (commonly 3 or 5); multiple lined up at once, execute at next ball-out; may not execute if no stoppage before full time. Pro Clubs: each human controls a player; managerial intervention mostly pre-match/basic presets; no command queue beyond immediate processing. Generally no "action unavailable" messages except obvious cases (sub a red-carded player).
- **OOTP (baseball):** turn-based at the pitch level. Before each pitch/at-bat you can change strategy/shifts/subs; **no cap** on toggles before "Play next pitch" (the decision phase is a single acceptance point); subs bound by baseball rules, no numeric cap on total pitching changes beyond realism; **no queue** of future changes — only current state at advance is used. Rate/volume naturally bounded by step-wise progression.
- **EHM (ice hockey):** FM-like. Tactics/lines/special-teams set any time, take effect when the engine processes them; line-change buttons spammable but engine respects fatigue/play; goalie pull etc. limited by hockey rules/engine, not queue length. No documented "max queued commands"; relies on real-time gating + rule legality + UI friction.

### 3. Real-world football (IFAB Laws)

- **Substitutions:** max **5** per team for most competitions (some lower levels 3); **3 substitution opportunities** in normal time **plus half-time** (half-time not counted among the 3); extra time may add a sub + window. Only at natural stoppages with referee permission.
- **Other interventions:** **no coach-initiated timeouts** — only the referee stops play. **Cooling breaks** (~90s) and **drinks breaks** (~60s) in high heat, at referee discretion (~30'/75'), function like timeouts but are rare and referee-controlled.
- Real-world model: continuous play, no managerial timeouts, limited sub count + windows, structural changes only at dead-ball opportunities. Most sims mirror this at least at the substitution level.

### 4. RTS / MOBA command-queue design (explicit numeric bounds + deterministic ordering)

- **Command-queue caps:** per-unit order-queue limit, often small (commonly 16–32 commands/unit; sometimes lower); per-frame/per-tick input processing limit (fixed max commands per client per tick) to mitigate spam/DOS. Examples (inferred from engine analyses/modding docs): **SC/BW/SC2** units store a limited order queue (16 orders/unit is a common RTS number); excess overwrites the last or is rejected. **WC3/Dota 2** units/heroes have a Shift-queue; engine caps queue length per entity; excess ignored; a ~30 Hz server tick batches client commands. **League of Legends** processes input per tick with a practical input-rate limit (a few dozen/s) at networking/engine layers; excess/malformed dropped. Reasons: performance (replay size/CPU) and fairness (anti-bot micro-spam).
- **Deterministic ordering of simultaneous commands:** sort by server tick (earlier wins); within a tick, tie-break by **player ID / connection ID**, then **unit ID / command sequence number**. Replay records a linearised `(tick, player, seq_id, command_type, params)` sequence; applying it deterministically reproduces the game. Conflicting commands on the same unit in the same tick → last in linearised order wins (earlier overwritten/truncated). This is exactly the model a deterministic football sim wants.

### 5. Recommended "intervention buffer policy" for a deterministic football sim

Assume discrete **acceptance points** (each dead ball + maybe once/sec of live play for some instruction types); at each point, process a bounded buffer.

- **Types:** Substitution; Tactical config change (formation/roles/duties/team & opposition instructions/mentality); Touchline shout / emotional instruction; Misc control (set-piece taker, keeper distribution…).
- **Per-acceptance-point caps (small, tunable):** global max buffered per point **8–12** (calibration-tunable, not hard-coded); per-type defaults: **subs ≤3/point** (real "triple change"); **tactical = 1 "package"/point** (one package may bundle many parameter changes but counts as a single intervention); **shouts = 1/point**; **misc = 2–3/point**. Rationale: tactics are coherent and should apply atomically; shouts deliberately scarce; subs limited by rules, 3 in one break realistic.
- **Per-match meta-caps (optional, for readability):** tactical packages/team/match e.g. **max 10**; shouts/team/match e.g. **max 12** (~1 per 7.5'); subs governed by competition data (typically 5) + windows, no extra meta-cap. All calibration-tunable in a ruleset, not hard-coded.
- **Deterministic ordering / conflict resolution:** each intervention carries `match_time` (tick), `team_id`, `manager_id`, `command_seq` (monotonic per manager), `type`, payload. At each point: collect interventions with `match_time ≤ now`, not yet processed; filter to legal + within meta-caps; sort by `match_time → team_id → manager_id → command_seq`; walk the sorted list into the per-point buffer until the global or per-type cap is hit. Conflict resolution: **subs** — same player referenced twice → keep first accepted, reject later as duplicate/conflict; **tactical** — keep last package in sorted order (others "superseded") or hard "1 package/team/point"; **shouts** — 1/team/point, keep last, reject others as duplicate; **misc** — apply all unless same target parameter (last wins). Deterministic sort + monotonic seq → replaying the raw log reproduces the accepted set + outcomes.
- **Feedback categories:** **Accepted** (pending badge); **Buffer full** (global/per-type cap hit — "too many changes already scheduled for this stoppage"); **Window closed** (action no longer allowed — subs after final whistle / all windows used; shouts during live play); **Duplicate/Superseded** ("this player is already scheduled to be substituted" / "this tactical change has been superseded by a later instruction"); **Illegal** (exceeds remaining subs / would leave <7 / disallowed role); **Too late to execute** (accepted but no acceptance point before match end — surface a notification). Log all interventions with final status for debugging/replay/tuning.
- **Tunable vs fixed:** **calibration-tunable** — global per-point cap; per-type per-point caps; per-match meta-caps (tactical packages, shouts); definition/frequency of acceptance points; tie-break hierarchy (stable but engine-iterable). **Hard / rule-data-driven** — IFAB sub limits + windows (competition data); min/max on-field players (≤11, ≥7); fundamental legality (formation must cover required positions).

---

Citations (as returned):
[1] youtube.com/watch?v=KJ_69__2UGQ · [2] youtube.com/watch?v=XzHK3UM75mM ·
[3] footballmanager.com/features/fm24-quality-life-upgrades-part-two ·
[4] youtube.com/watch?v=s7VuE5GCLEk · [5] pmc.ncbi.nlm.nih.gov/articles/PMC10955741/

> Note: IFAB 5-sub/3-window and RTS lockstep ordering are well-established and corroborate
> the FMX-100 capture; SI/EA exact internals are observational (no published cooldown
> numbers), so all magnitudes are routed to **FMX-52** calibration rather than asserted.
