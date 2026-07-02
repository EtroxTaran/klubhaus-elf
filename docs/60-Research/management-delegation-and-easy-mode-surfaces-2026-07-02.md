---
title: Management Delegation and Easy-Mode Surfaces
status: draft
tags: [research, dual-mode]
context: [staff-operations, training, scouting, club-management-economy]
created: 2026-07-02
updated: 2026-07-02
type: research
binding: false
linear: FMX-212
sourceType: external
related:
  - [[raw-perplexity/raw-management-delegation-and-easy-mode-surfaces-2026-07-02]]
  - [[assisted-play-parity-auto-coach-2026-07-01]]
  - [[dual-mode-precedents-sports-management-2026-07-01]]
  - [[tier-parity-measurement-calibration-2026-07-01]]
  - [[anstoss-series-deep-dive]]
  - [[../50-Game-Design/progressive-disclosure-ui]]
  - [[../50-Game-Design/GD-0004-tactics]]
  - [[../50-Game-Design/GD-0008-finance-economy]]
  - [[../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]]
  - [[../50-Game-Design/GD-0028-dialogue-intent-taxonomy-effect-matrix]]
  - [[../50-Game-Design/GD-0033-national-team-dual-role]]
  - [[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]]
  - [[../10-Architecture/09-Decisions/ADR-0084-national-team-dual-role-and-international-window-contract]]
---

# Management Delegation and Easy-Mode Surfaces

## Question

Easy world (Quick + Standard tiers, per D1) must let training, scouting,
transfers, finance and stadium "just run" acceptably without pro-level input —
but the vault has **no general delegation system**: only the national-team
dual-role's Full Control / Match-Only / Light Touch levels
([[../10-Architecture/09-Decisions/ADR-0084-national-team-dual-role-and-international-window-contract|ADR-0084]],
[[../50-Game-Design/GD-0033-national-team-dual-role|GD-0033]]) and a lone
`staff.delegate_topic` dialogue intent
([[../50-Game-Design/GD-0028-dialogue-intent-taxonomy-effect-matrix|GD-0028]]).
How do comparable games model per-area delegation/autopilot (FM Staff
Responsibilities, OOTP Team Control Settings, NBA 2K MyGM, the Anstoss
assistant), who executes delegated decisions, how does delegation quality
relate to staff skill, and how should this map onto easy (default-on?) vs pro
(default-off) — given that the ratified easy-tactics decision (native dials,
2026-07-02) puts **tactics out of delegation scope**?

## Summary

The genre's most-praised delegation model is Out of the Park Baseball's Team
Control Settings: a per-area "who is responsible" assignment (you vs a named
in-world staff actor), scoped down to per-affiliate granularity, changeable
anytime, with the explicit onboarding pattern "automate everything, then
gradually take areas back as you learn". Football Manager delegates a similar
breadth through role-matched staff, but its community-documented quality
complaints concentrate exactly where FMX's D3 envelope is most sensitive —
transfers/contract value and adaptive decisions — while official SI guidance
confirms (without formulas) that staff attribute quality drives delegated
outcomes. NBA 2K's implicit automation (staff ratings as parameters of sim
logic, no explicit delegation surface) is the weaker precedent; Anstoss pairs
accept-a-proposal assistance with natively coarse stadium/finance surfaces,
matching FMX's ratified dials-not-delegation tactics decision. No published
doctrine exists on deterministic vs persona-driven delegated decisions — but
FMX already has its own stronger precedent in ADR-0084's deterministic
auto-management, and the Wave-1
[[assisted-play-parity-auto-coach-2026-07-01|throttled-expert Auto-Coach]]
mechanism generalizes cleanly to per-area delegated execution: one shared
expert-policy family per domain, with staff skill (via GD-0021's
`PipelineCoverageSnapshot` bands) setting the throttle position inside the D3
corridor. The main genuinely new fork this packet surfaces is the **consent
model**: the vault's Auto-Coach "proposes only, never overwrites" rule cannot
by itself deliver an easy world that "just runs" — standing delegation needs
act-and-report authority with a review feed, which is a different contract
than propose-approve. All options below are inputs; nothing here is decided.

## Findings

1. **Finding:** Football Manager delegates nearly the entire non-tactic club
   surface through role-matched staff: training/media/friendlies → assistant
   manager, transfers + contract renewals → director of football, scouting →
   chief scout, youth intake → head of youth development, medical → medical
   staff. Official SI framing is workload relief, and the FM26 article
   explicitly ties delegation quality to filling roles "with the candidates
   who have the most relevant Attributes" — staff skill is stated (not
   quantified) to drive delegated-outcome quality.
   **Source:** footballmanager.com "Delegating for success in Football
   Manager 26"; passion4fm.com Staff Responsibilities guide (raw Q1).
   **Confidence:** high.

2. **Finding:** FM's delegated-quality complaints are area-specific and
   concentrate in *value-sensitive and adaptive* decisions: the director of
   football selling players for poor fees at bad times (loudest complaint;
   "never delegate selling"), delegated scouting drifting generic/misaligned
   with squad needs, delegated training "safe but unambitious". Media and
   friendlies delegation draws almost no quality complaints. No SI-published
   benchmark exists; magnitudes are community-reported.
   **Source:** thehighertempopress.com delegation essay;
   r/footballmanagergames "What do you delegate and why?"; FM24 guide video
   (raw Q1). Consistent with
   [[assisted-play-parity-auto-coach-2026-07-01]] Finding 2 (assistant
   weakness concentrates in adaptation).
   **Confidence:** medium.

3. **Finding:** OOTP's Team Control Settings is the genre's most granular and
   most explicitly documented delegation model: an official per-area
   responsibility table — lineups/depth/pitching staff, transactions
   (signing/releasing), minor-league personnel, minor-league
   signings/releases, minor-league day-to-day — each assignable to "yourself"
   or "your team's Manager" / "the Manager of each minor league team". The
   manual specifies the executor and cadence: "your Manager will make
   adjustments weekly, or any time that you or the AI makes a roster move."
   Role-scoped presets (Manager only / GM only / GM + Manager) bundle these
   toggles into recognisable jobs.
   **Source:** OOTP official manual, Team Control Settings / Manager Options
   pages (manuals.ootpdevelopments.com, verified verbatim, raw Q3); OOTP
   wiki mirror.
   **Confidence:** high.

4. **Finding:** OOTP's community-documented onboarding pattern is delegation
   as a **learning ramp**: "automate everything, then gradually start
   disabling things as you get to grips with the game" — with the accepted
   cost that a fully-empowered AI assistant "might trade your favorite
   players ... that is the price you pay to let somebody else take charge."
   This is the two-worlds bridge FMX wants: the same toggles serve the
   never-wants-depth player and the gradually-graduating player (supports
   D1's Quick+Standard = one Easy world, and D2 switch-anytime).
   **Source:** Steam OOTP21 community thread "Is there automation" (raw Q3).
   **Confidence:** medium (community, but directly on point and consistent
   with the official model).

5. **Finding:** OOTP couples staff ratings to automated quality *unevenly and
   deliberately*: manager development/mechanics/aging ratings are the main
   personnel levers (development esp. for growth under auto-management);
   the bench coach is "far less important than the manager"; the assistant
   GM mainly affects cohesion and its trade suggestions are "not especially
   effective". Reviews still call delegated execution "occasionally as janky
   as you'd expect". Lesson: even the best-in-genre model keeps the
   staff-skill coupling narrow and readable rather than simulating a full
   second brain per staff member.
   **Source:** OOTP 24 personnel tutorial (developer-adjacent, raw Q2); OOTP
   forums staff-autonomy thread; loudpoet.com OOTP26 review.
   **Confidence:** medium.

6. **Finding:** NBA 2K MyGM/MyNBA has **no explicit per-task delegation
   surface**; automation is implicit in staff roles + AI settings (ACE
   adaptive coaching, auto-scouting whose accuracy scales with scout
   ratings/badges, 2K26's Normal/Smarter/Faster sim-logic trade-off) under a
   governor Directives/approval layer. The pattern worth keeping is *staff
   ratings as the declared parameters of automated decision quality*; the
   pattern to avoid is the implicitness — players cannot see or scope what
   is delegated, which conflicts with FMX's explainability rule.
   **Source:** nba.2k.com 2K26 MyNBA courtside report; ESPN 2K26 coverage;
   nba2k.fandom MyGM wiki (raw Q4).
   **Confidence:** medium.

7. **Finding:** The Anstoss assistant is **accept-a-proposal, not standing
   autopilot**: the Co-Trainer proposes lineup ("Aufstellung übernehmen") and
   training plans that the player confirms per action; stadium and finance
   are natively coarse surfaces (discrete lump-sum build projects that
   auto-progress; low/medium/high budget sliders) rather than delegated
   detail. Anstoss thus solves easy-mode stadium/finance with **surface
   design, not delegation** — the same pattern Nico ratified for tactics
   (native dials compiling into the shared contract).
   **Source:** Perplexity synthesis over Kultboy/fan retrospectives (raw
   Q4); [[anstoss-series-deep-dive]]. Exact menu labels could not be
   verified against a primary page.
   **Confidence:** medium for the pattern, low for exact labels.

8. **Finding:** Staff-skill → automation-quality coupling is a documented
   cross-genre pattern (FM attribute descriptions; OOTP development ratings;
   Paradox leader skill scaling automated systems; Two Point Hospital staff
   skills; Motorsport Manager engineer stats), but in **every** precedent the
   coupling is descriptive/banded — no title publishes formulas, and exact
   weights are community reverse-engineering. A banded coupling (GD-0021's
   existing `PipelineCoverageSnapshot` explanation bands) is therefore
   genre-standard, not a simplification FMX needs to apologise for.
   **Source:** raw Q5 (multi-title survey); official FM26 delegation article
   for the FM leg;
   [[../50-Game-Design/GD-0021-player-staff-development-and-decision-influence|GD-0021]].
   **Confidence:** high for the pattern, medium for per-title specifics.

9. **Finding:** No published designer doctrine exists on whether delegated
   decisions should be deterministic or personality-driven, nor on
   default-on automation for easy modes — searches found only general
   automation-UX writing ("automate low-judgment chores; keep decisions that
   *are* the fun manual"). Industry practice is seeded-stochastic under a
   fixed per-save RNG stream. This absence means FMX's own precedents govern:
   ADR-0084 NT5 (unattended side auto-managed **deterministically**, no RNG)
   and Nico's standing preference for bounded seeded variance via an existing
   stream over both pure determinism and free randomness.
   **Source:** raw Q5 (explicit not-found result); uxtools.co
   stochastic-vs-deterministic design;
   [[../10-Architecture/09-Decisions/ADR-0084-national-team-dual-role-and-international-window-contract|ADR-0084]].
   **Confidence:** high that no doctrine was found; the practice claim is
   medium (inference).

10. **Finding:** The Wave-1 "throttled expert" Auto-Coach mechanism
    ([[assisted-play-parity-auto-coach-2026-07-01]], NEW-autocoach-strength-
    mechanism Option A) generalizes to per-area delegation: OOTP's executor
    is effectively one AI-manager policy per domain invoked on triggers
    ("weekly, or any time a roster move happens"), and FM's separately
    authored assistant heuristics are precisely the architecture whose
    adaptation-gap weakness profile is documented (Finding 2 here; Findings
    2/5 there). Reusing the AI-league manager evaluation per domain, with a
    throttle set by the staff-skill band instead of a global temperature,
    yields one policy family serving three consumers: AI clubs, Auto-Coach
    proposals, and delegated execution.
    **Source:** synthesis over OOTP manual (raw Q3), FM complaints (raw Q1)
    and the Wave-1 sibling note — an inference, not an external citation.
    **Confidence:** medium.

## Inputs For Decisions

### OPEN fork: delegation model shape (primary customer of this packet)

Scope guard: per the ratified 2026-07-02 easy-tactics decision, **tactics is
out of delegation scope** (native dials/presets compile into the shared
tactic contract). Delegation covers the non-tactic decision-bearing areas of
the D4 sweep: training, scouting, transfers/contracts, finance/financing,
stadium, plus low-stakes chores (media, friendlies). Genre evidence
independently endorses exactly this split: Operation Sports' FM26 guidance is
"for tactics, don't delegate — use a pre-built tactic as your foundation"
(raw Q3).

**Option A — OOTP-pattern per-area responsibility assignment (standing
autopilot, act-and-report).** Each area has a `delegated | manual`
responsibility fact naming the responsible staff role (chief scout for
scouting, sporting-director-type role for transfers, coach roles for
training, board/CFO-type surface for finance). The executing agent is the
**owning domain context's own policy** issuing its **own existing commands**
on its normal triggers; Staff Operations owns only the delegation-assignment
facts and the staff-skill inputs (role assignment + pipeline bands), never
the domain commands — consistent with
[[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context|ADR-0053]]'s
boundary ("concrete gameplay effects remain in the consuming contexts") and
with GD-0028's `staff.delegate_topic` intent, which already records a
"delegation preference fact" in Staff Operations/Notification.
*Pros:* the genre's most-praised model (Findings 3-4); per-area granularity
is what makes D2 switch-anytime real (take back one area without leaving the
world); clean DDD fit; the delegating staff actor is visible and thematic.
*Cons:* needs a per-area policy of acceptable quality in five-plus domains —
the calibration surface Wave-1 already warned about (per-area strength
specs); toggle matrix must be presented as bundles or it becomes pro-mode UI
inside easy mode.

**Option B — FM-pattern role-first delegation with advice layer.** Delegate
by staff role (a "responsibilities" screen), with the staff member surfacing
advice/reports the player may act on.
*Pros:* familiar to genre players; strong fantasy of a backroom team.
*Cons:* FM's documented weakness profile lives here — separately authored
assistant heuristics drift from the engine and fail in value-sensitive areas
(Finding 2); the advice layer still demands attention, so easy mode does not
"just run".

**Option C — Anstoss-pattern per-action proposals only (no standing
autopilot).** Everything stays manual; assistants generate one-tap proposals
per decision (the current Auto-Coach rule extended everywhere).
*Pros:* maximally consistent with the existing "proposes only" rule; no
delegated-quality liability.
*Cons:* fails the packet's requirement — a Quick-tier player still has to
touch every area every week; Anstoss itself only made this work because its
*surfaces* were coarse (Finding 7), which FMX replicates for tactics but
cannot replicate for, e.g., contract-renewal queues.

*Recommendation (recommendation, not a decision):* **Option A**, executed by
the owning domain's throttled-expert policy (Finding 10), with Option C's
proposal mode retained as the *Standard-tier middle setting* per area (see
consent-model fork below). Option B's role-matching is kept as flavour — the
assignment fact names the staff role — without adopting FM's separate
heuristic brains.

**Sub-input — deterministic vs persona-influenced execution.** Evidence
(Finding 9) shows no external doctrine; internal precedent is decisive:
ADR-0084 resolves unattended matches deterministically, and GD-0028 confines
persona to availability gates + bounded scaling with the owning domain
authoritative. *Recommendation (not a decision):* delegated execution is a
**deterministic function of (domain state, staff-skill band, policy
version)** — replay-safe like ADR-0084 NT5 — with at most bounded seeded
variance drawn from an existing domain stream if Nico wants texture
(matching his seeded-variance preference); staff **persona** influences only
narration/advice tone via GD-0028 surfaces, never the mechanical outcome.
Persona-driven mechanical delegation (OOTP's "managers take your
recommendations differently") is charming but couples save outcomes to an
opaque personality layer — the trust failure Wave-1 Finding 10 warns about.

**Sub-input — staff-skill coupling (GD-0021).** Reuse the accepted FMX-152
chain unchanged: People owns `StaffSkillProfileSnapshot` → Staff Operations
maps role assignment into staff-skill-aware `PipelineCoverageSnapshot` bands
→ the delegated policy in each consuming domain reads its pipeline band and
sets its throttle position. This adds **no new stat and no new ownership**;
delegation becomes the third consumer of the same bands (after quality
multipliers and explanations). Genre evidence says banded coupling is the
documented norm (Finding 8), and "you're only as good as the staff you
delegate to" (raw Q3) gives easy-world players their meaningful lever: squad
of decisions collapses into *hire good people*. **D3 stress note:** the
coupling must be floor-respecting — the worst legal staff band positions the
delegated agent *low inside* the D3 corridor, never below the easy floor;
otherwise a neglected easy save becomes a dominated strategy through the
back door (the FM self-handicap failure, Finding 2).

**Sub-input — easy default-on vs pro default-off.** No published doctrine
(Finding 9), but the OOTP learning-ramp evidence (Finding 4) plus
automation-UX guidance support: **Quick tier = all non-tactic areas
delegated by default** (act-and-report), **Standard = mixed defaults**
(chores delegated, transfers/finance in propose mode), **Expert = all
manual** — with the identical toggle set present in every tier so D1's
two-worlds branding is presentation only and D2 switching never migrates
state. *Recommendation, not a decision.*

### OPEN fork: stadium expansion model (easy surface input only)

Anstoss precedent (Finding 7) and
[[../50-Game-Design/progressive-disclosure-ui]] §3 already agree: the easy
stadium surface is a **build wizard offering 1-3 next-upgrade project cards**
(discrete lump-sum projects that auto-progress), not a delegated grid. Input
for the open fork: whichever expansion model Nico picks (tile map vs
module-project model), it must be **compilable into 1-3 ranked project
cards** — i.e. the pro model needs a canonical "next best upgrades" query,
exactly as the tactic dials compile into the shared tactic contract. Coarse
surface first, delegation optional on top (a facilities-manager staff role
auto-accepting maintenance-class projects only), because Anstoss shows
surface coarseness alone carries the easy stadium experience. Finance is the
same shape and already specified: GD-0008 mandates Quick = runway +
action cards over the identical ledger; the delegable slice of finance is
routine ops (renewing routine sponsors, small-facility spend), while
financing instruments (loans, factoring — FMX-49) should arguably stay
player-confirmed in every tier given their run-ending stakes.
*Recommendation, not a decision.*

### OPEN forks: competitive labeling and MP treatment (secondary inputs)

- Delegated execution being a deterministic policy function (above) is what
  makes delegation **measurable and labelable**: each area's delegated agent
  gets a strength spec against the same N/E anchors as the Auto-Coach
  ([[tier-parity-measurement-calibration-2026-07-01]] machinery), so a
  competitive label can truthfully state what autopilot does and how well.
- For MP: a persona-influenced or unseeded delegated agent would make
  "delegation on" a hidden variance source between players; the
  deterministic-policy recommendation removes that objection and leaves MP
  treatment a pure fairness/labeling question rather than a technical one.

### NEW-delegation-consent-model (newly discovered fork)

The vault's Auto-Coach rule ("proposes only, never overwrites",
[[../50-Game-Design/progressive-disclosure-ui]] §4) and a "just runs" easy
world are in direct tension: a proposal queue is still a queue. Per-area
consent levels resolve it:

- **Option A — three consent levels per area:** `manual` (silence) /
  `propose` (assistant proposes, player confirms — today's Auto-Coach
  contract) / `delegate` (staff acts, player gets an act-and-report feed
  with review/undo-where-domain-allows). ADR-0084's Full Control /
  Match-Only / Light Touch is this exact ladder for the national team, so
  the pattern already exists in an accepted contract. *Pros:* one grammar
  everywhere; the NT dual-role becomes a specialisation, not a snowflake.
  *Cons:* three states × ~6 areas needs careful bundling into tier presets.
- **Option B — keep propose-only everywhere, make Quick auto-confirm
  proposals after a timeout.** *Pros:* no new authority contract. *Cons:*
  auto-confirm *is* delegation with worse legibility; timeout mechanics feel
  arbitrary.
- **Option C — binary manual/delegate.** *Pros:* simplest. *Cons:* loses the
  propose middle that Standard tier and graduating players need (Finding 4's
  ramp; GD-0033's Match-Only level shows the middle is load-bearing).

*Recommendation (recommendation, not a decision):* Option A, with two
invariants carried over unchanged: delegated staff **never overwrite manual
pins** (the player can pin any individual item — a shortlist target, a
protected player — and delegation routes around it; preserves the
tier-switch guarantee of progressive-disclosure-ui §7), and every delegated
action lands in the **report feed with a GD-0028-style explanation** (the
trust requirement of Wave-1 Finding 10).

### NEW-delegation-strength-spec (newly discovered fork)

Does the `assist.autoCoach` calibration slot proposed by
[[assisted-play-parity-auto-coach-2026-07-01]] cover delegated agents, or do
delegated areas get sibling slots (`assist.delegation.training`,
`assist.delegation.scouting`, `assist.delegation.transfers`,
`assist.delegation.finance`)? Evidence for siblings: FM shows delegated
quality degrades area-unevenly (Finding 2), and each area has a different
owning context and harness; a single slot would hide exactly the per-area
floor D3 needs. Evidence against: slot proliferation, and the anchors
(N/E agents, season-sim Monte Carlo) are shared machinery.
*Recommendation (not a decision):* one slot **family** with shared
methodology and per-area parameter packs — mirroring how GD-0043 already
scopes slots per system — plus the hard invariant that every delegated
area's worst staff-band strength stays above the easy floor.

## Future-scope notes (classified future-scope)

- **Delegation persona flavour (post-MVP):** once the deterministic policy
  layer is stable, staff persona could colour *which* of several
  equal-scoring candidate actions is taken (seeded, bounded — OOTP's
  "managers differ" charm without save-outcome opacity). Needs its own
  HITL gate; explicitly not part of the MVP recommendation.
- **Delegation and the NT dual-role:** when the playable Bundestrainer role
  ships (GD-0033 post-MVP), its engagement levels should be re-expressed as
  the general consent ladder rather than kept bespoke.
- **Staff continuity effects:** GD-0021 lists staff turnover/disruption as
  post-MVP; once active, a delegated area should visibly wobble when its
  responsible staff member leaves — a natural narrative hook.
- **Delegation telemetry:** the act-and-report feed is a future data source
  for measuring where real players take areas back — direct evidence for
  re-tuning tier defaults.
- **Could not verify:** exact Anstoss menu labels/behaviour for assistant
  delegation (community retrospectives only); any SI or 2K published
  benchmark of delegated-AI quality; OOTP's internal decision algorithms.
  None are load-bearing for the recommendations above.
