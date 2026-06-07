---
title: "Raw — Deliberate-pause governance in multiplayer games & real sports (FMX-101)"
status: raw
tags: [research, raw, perplexity, watch-party, pause-vote, anti-grief, multiplayer, prior-art, real-sport, fmx-101]
created: 2026-06-07
updated: 2026-06-07
type: research
binding: false
linear: FMX-101
related:
  - [[../live-match-intervention-buffer-and-pause-vote-2026-06-07]]
---

# Raw capture — deliberate-pause governance (Perplexity, 2026-06-07)

Verbatim-faithful capture of the Perplexity strand on how multiplayer games and real
team sports bound **deliberate** (manager-initiated) pauses to prevent stalling/griefing.
Synthesis in [[../live-match-intervention-buffer-and-pause-vote-2026-06-07]].

> **Citation-quality caveat.** This Sonar run returned **off-topic web citations**
> (UK football-governance bills, election-finance docs) — a grounding failure. The
> *game/sport facts* it states (CS tactical timeouts 4×30s; NBA 7/regulation, ≤2 in
> final 3 min; NFL 3/half no carry-over; coach's-challenge tied to a timeout; cricket
> DRS per-innings budget; tennis Hawk-Eye 3/set; chess Fischer/Bronstein; football has
> no manager timeout, only referee cooling/drinks breaks) are **standard and
> independently verifiable** and are what the synthesis relies on. The off-topic URLs
> are recorded verbatim below for honesty but are **not** treated as sources.

## Prompt (summary)

Designing a deliberate pause-vote for a synchronous multiplayer "watch party" (2+ human
managers co-watch/coach one live match), distinct from an automatic disconnect-pause.
Research and contrast how competitive/co-op games AND real team sports bound deliberate
pauses/stoppages against stalling/griefing, covering: (1) pause BUDGET per player/team
per period; (2) COOLDOWN between pauses; (3) QUORUM/consent — unilateral vs vote, who
resumes; (4) MAX duration + AUTO-RESUME; (5) audit/notification of who paused. Concrete
numbers from SC2 / Dota 2 / CS pauses, fighting-game tournament rules, online chess
clocks, and real-sport analogues (NBA/NFL timeouts, coach's challenge, cricket DRS,
tennis challenges, VAR). Then recommend casual-friendly-but-fair football defaults and
flag per-group-configurable vs fixed.

## Answer (verbatim)

You want deliberate pauses to be useful and social, but *bounded* so one manager cannot stall or grief the session. The best patterns from competitive multiplayer and real sports are: small **per-player pause budgets**, enforced **cooldowns**, some form of **shared consent or resume power**, **short hard caps with auto-resume**, and clear **attribution in UI/logs**.

### 1. Competitive & Co-op Multiplayer: how deliberate pauses are governed

**StarCraft II.** Ladder/custom allow limited pauses; tournaments override with stricter admin rules. Budget: typically **1–3 pauses per player/team per game** (tournament rules, not hardcoded); ESL/WCS-style often 1–2 personal pauses. Cooldown: no client cooldown — admin discretion. Quorum/consent: any player can unilaterally pause and unpause (after a short grace); tournaments add "no unpausing without referee permission" socially. Max duration / auto-resume: SC2 does **not** auto-resume; tournaments govern (e.g. 5 min to resolve or forfeit). Audit: "Game paused by [Player]" / resumed messages. **Takeaway:** base game very permissive; anti-stall is out-of-game. A public service needs stronger built-in limits.

**Dota 2.** Structured team pause system, heavily used competitively. Budget: pubs can pause freely; tournaments cap total technical pause time per team per map (e.g. ~10 min, varies). Cooldown: minor friction — unpause has a short countdown; opponents can re-pause. Quorum/consent: **any player can pause, any can unpause** (incl. opponents); some formats require a minimum connected players before unpause. Max duration/auto-resume: no strict client cap; tournaments enforce. Audit: clear overlay "Game is paused. [Player] has paused the game." **Takeaway:** pub criticism is exactly that one player can grief-pause; avoid "anyone can pause/unpause at will" for co-op coaching.

**Counter-Strike (CS:GO/CS2) tactical & technical pauses** — one of the cleanest bounded models. Budget per team: **4 tactical timeouts per match, 30 seconds each** (some formats 1×60s/half; 4×30s is the modern default). Cooldown: cannot stack — timeout only during freeze time, at most one per round (≥1 full round between timeouts). Quorum/consent: any player on a team (or designated IGL by config) can request the team's timeout; unilateral at team level, enemy can't veto; auto-expire, opponent can't resume early. Max duration/auto-resume: hard-capped 30s, auto-resume at timer end. Audit: HUD shows which team + countdown; "Team X called a tactical timeout." **Takeaway:** small discrete budget, short fixed duration, automatic resume, unambiguous attribution — exactly the structure to want.

**Fighting-game tournament pause rules** — zero-tolerance. Mid-round deliberate pauses effectively not allowed; accidental pause → loss of current round (sometimes game on repeat). No cooldown (pauses penalized not rationed). No voting — pause = infraction unless ref-authorized between rounds. **Takeaway:** the more critical the timing information, the harsher the anti-stall rule (here, remove the feature).

**Online chess clocks (FIDE, Fischer, Bronstein delay).** Not "paused" but time-governed — same anti-stall goal. Budget: fixed time bank (classical 90'/40 then 30'; online rapid/blitz e.g. 3+2, 10+0). Fischer increment: gain fixed time per move (e.g. +30s). Bronstein/US delay: per-move grace (e.g. 5s) before the clock ticks down. Auto-enforced: time at 0 → loss. **Takeaway:** chess solves stalling via **shared time budgets, not shared pauses** — you could treat deliberate pauses as consuming "timeout time" rather than freezing for free.

### 2. Real-sport analogues

**Association football (IFAB/FIFA).** Managers have **no direct timeout power**; only the referee stops play. Anti-stall: added stoppage time, yellow card for time-wasting; VAR informal speed expectations. **Takeaway:** you are effectively inventing a digital referee (the pause system) that all managers must trust.

**NBA timeouts.** Budget: **7 charged timeouts per regulation**, but **no more than 2 in the final 3 minutes** of Q4; **2 per OT**. Cooldown: implicit endgame restrictions. Quorum/consent: player on floor or head coach can request; opponent can't veto. Max/auto-resume: full (75s) or shorter timeouts, hard caps, auto-resume. **Takeaway:** close to CS — small finite budget, strict endgame controls, hard caps.

**NFL timeouts & coach's challenge.** **3 timeouts per half**, no carry-over to second half. Coach's challenge: **2 per game** (+1 if both successful); must have ≥1 timeout to challenge; no challenge in last 2 min of a half (replay official initiates). Reviews expected quick (~<60s benchmark). **Takeaway:** "challenge tied to a timeout" — if you want to slow the game with a review you spend from a limited budget.

**Cricket DRS.** Tests: **2 unsuccessful reviews per team per innings** (some formats 3); limited-overs ~1; successful reviews don't decrement. Captain/batter signals within ~15s; opponent no veto. **Takeaway:** small discrete per-team budget for "stop and review."

**Tennis Hawk-Eye.** **3 incorrect challenges per set** (+1 in a tiebreak); correct ones don't count; must challenge immediately after the point. **Takeaway:** limited budget again.

**VAR (football).** No fixed number; **referee-initiated** (managers have no challenge button); informal pressure to keep checks short. More about flow than anti-stall (teams can't invoke it).

### 3. Core design levers for the deliberate pause-vote

(1) pause budget per manager per half; (2) cooldown between pauses; (3) quorum/consent;
(4) max duration + auto-resume; (5) attribution + social friction. Two extra constraints
vs e-sports: it is **co-op viewing/coaching** of the same match, and the grief target is
**other human viewers** (no in-game opponent). That moves it toward **co-op lobby
governance** rather than PvP.

### 4. Recommended defaults for a casual-friendly-but-fair football watch party

Assumptions: 2×45' (or virtual equiv) + halftime; 2–6 active managers; pauses used to
discuss tactics, analyze a key event, or handle a short interruption.

- **(1) Budget per manager per half:** **2 per half per manager** default; global per-half
  cap `min(totalManagers × 2, 6)`. Mirrors NFL/NBA order of magnitude. **No carry-over**
  to the second half (NFL-style).
- **(2) Cooldown:** **global 90s of in-match time** before any further deliberate pause
  (configurable down to 30/60s); global, not per-user (can't bypass by switching who
  initiates). Analogous to CS "≥1 round between timeouts"; 90s ≈ 1–2 possessions.
- **(3) Quorum/consent — hybrid:** **2-player** → either may request; 3s "pending pause"
  countdown with a visible **veto** key; if vetoed, no pause and credit **not** consumed;
  else pause activates and consumes the **requester's** credit (veto-not-vote). **3+
  players** → short time-limited vote: a 3s "propose pause" toast; if **≥50% of active
  managers incl. requester** agree within the window, pause triggers; else no pause, no
  credit consumed. **Resume:** any manager may request resume → 3s "Resuming in 3…2…1"
  overlay during which any other manager may **re-pause once** (consumes their own credit;
  global cooldown does not start while still paused); if nobody re-pauses, resume and
  start the cooldown. Simpler v1 alternative: unilateral pause, but only the pauser can
  resume before a 5s minimum hold, then anyone.
- **(4) Max duration + auto-resume:** **per-pause hard cap 20s** default (configurable
  10–30s, never >60s). Auto-resume at the cap with a 3s "Resuming…" banner; no extending
  the same pause — only a new pause after cooldown. (~CS 30s order of magnitude.) Optional
  separate "tactics pause" type: 30s but only 1/half/manager, UI locked to tactics
  (mirrors NBA full vs 20-second timeout).
- **(5) Audit/notification:** every pause → overlay "Game paused by [Name] (Pause 1/2
  this half)" + a session-log entry; resume → "Game resumed by [Name]"; failed attempts
  → private "no pauses remaining this half" / "you can request a new pause in 00:41";
  end-of-half summary of pauses used. Logs feed moderation/abuse-reporting.

### 5. Per-group configurable vs platform-fixed

**Per-group knobs:** budget per manager per half (0–4, default 2); global per-half cap
(2–10, default 6); max pause duration (10–30s, default 20); global cooldown (30–180s,
default 90); quorum model (veto for 2 / majority for 3+ / trust-based); who may pause
(any / host / host+co-host).

**Platform-fixed (non-negotiable):** absolute max per-pause duration (e.g. 60s); absolute
max total paused time per half (e.g. 5 min) then further pauses rejected ("Max paused
time reached this half"); auto-resume always present (no "paused until host says so" in
public); event logging + attribution always on; **no carry-over** of unused pauses
between halves.

### 6. Optional anti-grief extras

Reputation-sensitive guardrails (track avg pauses/half + % vetoed → longer personal
cooldowns / reduced budget for abusers); role-based privileges (a designated "Head Coach"
gets +1 pause/half and one veto-override/half, like a coach's challenge that always
fires); UI integration (auto-open tactics panel on pause: "changes apply after resume");
and a clearly-separate automatic disconnect pause (no budget consumed, longer cap ~60–90s,
labelled "Auto-paused: [Name] disconnected", deliberate budget left intact).

---

### Off-topic citations returned by Sonar (NOT used — grounding failure, recorded for honesty)

[1] hansardsociety.org.uk/.../parliament-matters-podcast-e59-transcript ·
[2] playthegame.org/news/new-research-alternative-voting-systems... ·
[3] eac.gov/.../Voluntary_Voting_System_Guidelines_Version_2_0.pdf ·
[4] insights.lcp.com/.../LCP-Football-Governance-Bill-March-2025.pdf ·
[5] gov.uk/.../reforming-club-football-governance ·
[6] assets.publishing.service.gov.uk/.../Regulating_Election_Finance... ·
[7] morningstaronline.co.uk/.../football-governance-bill-set-be-paused...
