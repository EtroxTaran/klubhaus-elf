---
title: "Raw Perplexity — League↔Regulations eligibility hand-off (FMX-74)"
status: current
tags: [research, raw, perplexity, league, regulations, compliance, eligibility, handoff, gap-g1, fmx-74, risk-legal]
created: 2026-06-03
updated: 2026-06-03
type: research
binding: false
linear: FMX-74
sourceType: external
related:
  - [[../league-regulations-eligibility-handoff-2026-06-03]]
  - [[../../10-Architecture/09-Decisions/ADR-0069-league-regulations-eligibility-handoff]]
---

# Raw Perplexity capture — FMX-74

> Unedited capture of three Perplexity (Sonar) queries grounding the FMX-74
> dossier and ADR-0069. Synthesis at
> [[../league-regulations-eligibility-handoff-2026-06-03]].
>
> **Citation caveat (Q3).** The DDD-pattern query (Q3) returned *mismatched*
> citations — Arizona "DDD" (Division of Developmental Disabilities) social-services
> pages, an acronym collision. Those citations are **unusable** and are NOT relied
> upon. Q3's substantive guidance is canonical DDD (Evans/Vernon) and is instead
> grounded on Vernon *Implementing Domain-Driven Design* (Process Managers chapter)
> + the vault's own precedent (ADR-0056 eligibility-chain pattern; ADR-0066's
> stateful Pyramid-rollover Process Manager). Q1 and Q2 citations are usable.

## Q1 — Real-world regulatory eligibility gates + timing

**Prompt (verbatim):** In real-world professional football, what are the distinct
REGULATORY ELIGIBILITY GATES that determine whether a club (and its players) can
participate in a competition, and at WHICH point in the season lifecycle does each
fire? Separating: (1) club-level admission/licensing (UEFA club licensing & FFP;
EFL ground-grading + financial criteria; DFL Lizenzierungsverfahren); (2)
promotion/relegation compliance — can a club be denied promotion / refused a
higher-tier licence on infrastructure/financial grounds, with real examples; (3)
squad registration — windows, squad-size limits, homegrown/locally-trained quotas,
deadlines relative to matchday (UEFA List A/B, PL 25-man); (4) transfer windows vs
registration deadlines; (5) matchday player eligibility (suspensions, cup-tied,
registration cutoffs). For each: who owns/enforces, consequence of failure, timing
relative to (a) competition scheduling, (b) season start, (c) matchday.

**Answer (verbatim, condensed to substance):**

Five distinct gates, each owned by a different regulator, firing at different times.
Pre-season/pre-competition: club licensing/admission; promotion/relegation
compliance. Around season start & mid-season: squad registration; transfer-window
registration. Per matchday: player-by-player eligibility.

**1. Club-level admission/licensing.** The competition licence/admission criteria
(financial, legal, sporting, administrative, infrastructure) to be *allowed to
enter* a league or UEFA competition. Examples: UEFA Club Licensing & Financial
Sustainability (formerly FFP) for CL/EL/ECL; DFL Lizenzierungsverfahren for
Bundesliga/2.Bundesliga; EFL membership & ground/financial criteria; emerging
Independent Football Regulator (IFR) in England. Owners/enforcers: UEFA (via
national associations as first filter), domestic top leagues (DFL, EFL/PL),
national associations (FA, DFB), forthcoming statutory IFR. **Timing:** assessed
*before* entry confirmed and fixtures drawn — UEFA licensing typically spring
(Mar–May) of the prior season, decisions before the access list locks + June/July
draws; DFL April/May for the following season; EFL before AGM/fixture release. So
**before competition scheduling**, weeks-to-months **before season start**, **not
matchday-specific** (mid-season withdrawal = structural sanction). **Failure:**
refusal of licence/entry (no place even if qualified on merit); forced
relegation/expulsion (Germany: DFL licence failure relegates below
Bundesliga/2.Bundesliga); fines / squad-cost controls / withheld prize money under
FSR; IFR could suspend/revoke operating licence + penalties up to a % of revenue.

**2. Promotion/relegation compliance (higher-tier licence).** Even if you finish in
a promotion place you must meet the higher division's ground-grading,
infrastructure, financial and sometimes professional-status requirements; failure =
denied promotion, or in severe cases demotion / placement elsewhere. Owners: league
organisers (EFL for Championship/L1/L2; National League; Serie B/Ligue 2 analogues;
DFL; DFB/regional for 3.Liga), co-regulated with national associations. **Timing:**
end of season but before the new division is constituted (Apr–June), settled before
league AGMs + fixture lists → **before the higher-tier fixture list is finalized**,
weeks-to-months before kickoff, not per-match. **Real examples:** Germany — clubs
refused a 3.Liga (or higher) licence and therefore relegated/denied promotion for
failing financial criteria (insolvency, no going-concern proof); DFL licensing has
historically pushed financially unsound clubs down rather than letting them
continue professionally. England — non-League clubs winning promotion to the
EFL/National League historically *denied promotion* on ground grading (capacity,
floodlights/undersoil heating, seating); within the EFL promotion can be made
conditional pending stadium work. Scotland — lower-tier champions (Highland/Lowland
League) not promoted for failing SPFL ground/infrastructure criteria. **Failure:**
promotion refused / stay down despite sporting success; forced relegation if minimum
standards unmet; conditional admission (upgrade deadlines) with later sanctions.

**3. Squad registration (competition-wide eligibility lists).** *Which specific
players may play at all in this competition this season/half-season* — squad-size
limits (e.g. 25), homegrown/locally-trained quotas, age-based exemptions (U-21
lists). Systems: UEFA List A/B; PL 25-man + homegrown; EFL/Serie A/La Liga/Bundesliga
analogues. Owners: competition organisers (UEFA, PL, EFL, DFL, La Liga), enforced
administratively via registration systems. **Timing:** windows tied to transfer
periods + phase starts. UEFA: List A (cap 25, homegrown reqs) + List B submitted by
fixed deadlines ahead of group stage + each knockout phase; limited changes per
phase (e.g. up to three new before knockouts). PL: 25-man squad list submitted
*after* each transfer window closes; unlisted (non-U21) players cannot play league
matches until the next window. Relative to: **(a)** deadlines set vs phase start;
**(b)** within days of the transfer window at season start + again mid-season;
**(c)** lists lodged days/hours before the phase's first match, then team sheets
pick from the registered pool. **Failure:** unregistered player ineligible →
fielding him = forfeit (3–0) + fines; squad-size/homegrown breach → registration
rejected until compliant / List A capped.

**4. Transfer windows vs registration deadlines.** Distinct. Transfer windows
(FIFA RSTP, implemented per national association: summer ~Jun–early Sep, winter
~Jan) govern *movement of players between clubs* + registering new contracts.
Competition registration deadlines govern playing eligibility for a *specific
competition* even for already-contracted players: e.g. sign 1 Sep (inside window)
but if the UEFA List A group-stage deadline was 30 Aug he can't play the group
stage (addable later). **Failure:** signed-outside-window → no registration until
next window (narrow exceptions: free agents, emergency GK); missed competition
deadline → employee but can't play that competition until next opportunity.

**5. Matchday player eligibility (per fixture).** Suspensions (red/accumulated
yellows per competition disciplinary rules), cup-tied status (already played for
another club in the same competition-season), registration cut-off before the
fixture (registered + ITC received by e.g. noon the prior working day), age/foreign
caps/work permits. Owners: competition organisers + national FA disciplinary
committees; officials/admin verify from registration systems. **Timing:** per
matchday at/before team-sheet submission; suspensions can carry across season
boundaries. **Failure:** fielding an ineligible player = forfeit (3–0)/annulment +
fines, sometimes points deductions.

**Chronology:** Gate 1–2 (licensing & promotion) decide *if/where the club competes
at all* (pre-season, before draw); Gate 3–4 (registration & transfers) decide *which
players are choosable in principle* (around season start + mid-season window); Gate 5
(matchday) decides *who actually plays this game*.

**Citations (as returned, usable):** lcp.com IFR regulatory/licensing; gov.uk
Football Governance Bill fact-sheet; skadden.com England's new IFR; thefa.com
financial regulation; whust.org Football Governance Act; Wikipedia UEFA Financial
Fair Play Regulations.

## Q2 — How football-management SIM GAMES model eligibility/registration

**Prompt (verbatim):** How do football-management simulation games (FM/SI, EA FC
Manager, OOTP, Anstoss, Championship Manager, We Are Football, mobile) model
competition/league eligibility + registration gating? Cover: (1) squad registration
— is it forced (PL 25-man/homegrown, CL List A/B, cup-tied)? what if you fail to
register enough — hard block, warning, or just unavailable on matchday? (2)
promotion/relegation licensing — do any block promotion / enforce a stadium/financial
licence (ground grading)? (3) continental/cup entry — is club licensing (FFP,
infrastructure) ever a gate to entry? (4) player-friendliness vs realism — which
hard-block vs warn, what's good UX, auto-handle vs manual registration? (5)
determinism/timing — when do checks happen (season start, transfer deadline, before
a match)?

**Answer (verbatim, condensed to substance):**

Games split eligibility into three layers: competition entry (can the club enter?),
squad registration (which players are eligible in that competition?), matchday
validation (can the selected XI/bench be used today?). Football Manager is the
best-known implementation; others simplify or automate.

**(1) Squad registration.** FM models registration as a real *competition-rule
layer* (not cosmetic): the rules editor exposes squad registration periods, max
squad size, and squad-selection rules incl. homegrown constraints. A competition can
require a registered list before matches are playable; the eligible pool is
constrained by competition rules, not just your roster; an unregistered player is
treated as *unavailable for that competition* rather than silently ignored. Missing
requirements: *not enough eligible players registered* → the competition still
exists but you cannot field ineligible players + you get warnings/forced omissions;
the sources show **no save-ending hard block**, registration is an enforcement
layer, with repeated warning messages when registration settings are changed badly.
Premier-League-style 25-man + homegrown, CL List A/B, registration windows + selection
rules are the right model. Cup-tied: not documented in sources; in practice a
per-competition eligibility flag (appeared for one club → ineligible for another in
that competition until next cycle) — same kind of gating, separate rule layer.
Online Football Manager: lighter, account/team-level participation rules, no FM-like
List A/B.

**(2) Promotion/relegation licensing.** FM's rules editor encodes promotion/relegation
structure + competition constraints; promotion is *not always automatic* if rules
demand more than sporting position. But the sources do **not** demonstrate a fully
simulated stadium/financial licensing gate like a real licensing body — FM supports
*rule-based eligibility* more than it proves a universal *licence-approval workflow*.
Other named games: no strong evidence of licensing-heavy promotion gates.
**Design takeaway:** soft-gate most clubs (promotion succeeds, then warn about
missing infrastructure + apply sanctions/funding limits); hard-gate only when the
rule is fundamental to the league's identity (minimum capacity, professional status).

**(3) Continental/cup entry.** Qualification resolved by league position, domestic
cup performance, cup-priority rules, association coefficients, country entries; FM
handles continental comps as distinct competitions with their own fixture + squad
rules, separate from domestic. FM can separate *entry* from *registration*; but the
sources do **not** show a clear "club licensing blocks entry to Europe" simulation.

**(4) Player-friendliness vs realism.** Hard-block things the player can't sensibly
override (unregistered player; age/foreign-cap; club not eligible because the format
requires a licensed entrant; entry not earned on the pitch). Warn for recoverable
problems (squad too large; not enough homegrown; stadium too small for next year;
finances below threshold; deadline approaching). Poor warning cadence becomes
annoying fast → warnings should be informative + time-boxed, not spammy. Strong UX:
auto-handle default registration for lower-stakes comps; manual for marquee comps;
pre-submit validation before a deadline; automatic eligibility filtering so
unregistered players simply can't be picked. FM is more manual/realistic; lighter
games automate to reduce friction.

**(5) Determinism/timing.** FM checks eligibility at several points: season start
(initial registration); registration-window deadlines (squad lists); before matchday
(player availability); when a competition is entered (structural eligibility);
sometimes after transfers (re-registration).

**Citations (as returned, usable):** youtube.com FM editor walkthroughs (C6rjIQCXb5E,
E8sRHWVZIGc); en.onlinefootballmanager.com/Rules; fmrte.com squad-registration forum;
steamcommunity.com registration-period discussion.

## Q3 — DDD: eligibility Saga vs domain service; failure semantics; replay-safe verdicts

**Prompt (verbatim):** In DDD, a regulatory/policy bounded context owns a versioned
rule catalog + exposes an Open Host Service + Published Language (EligibilityCheck,
EffectiveRuleSet snapshot). Downstream contexts must not cross-context-join; a
multi-context eligibility chain runs as a Process Manager/Saga INSIDE the consuming
context. (1) Canonical way to model an eligibility-validation Saga/Process Manager
that orchestrates several synchronous QUERIES (not long-running async steps)? When is
it a true long-running Saga (state + compensation) vs a stateless policy/domain
service that fans out queries + aggregates a verdict? (2) For a gate firing at a
discrete lifecycle moment (e.g. before fixtures published), standard FAILURE/BLOCKING
semantics — hard-block vs warn-and-proceed vs quarantine — and interaction with
idempotency + replay-safety? (3) Replay-safe deterministic verdict over an immutable
per-save snapshot — recompute vs cache/memoize? (4) Naming: is "eligibility check as
a Saga" an overreach with no compensating actions; what would Vernon call a
synchronous composite-verdict policy?

**Answer (verbatim, condensed to substance — see citation caveat above):**

The canonical DDD answer: a Saga/Process Manager is for coordinating *stateful
business transactions*, not for merely aggregating synchronous reads. If the
eligibility flow only fans out to query other contexts' read models and returns a
verdict, Vernon would call that a **domain service** (or application/policy service),
not a true Saga.

**(1) Saga vs stateless composite policy.** A true Saga/Process Manager is justified
with durable intermediate state, timeouts/retries, human/external waiting, or
compensating actions if a later step invalidates earlier committed changes — i.e. the
orchestration spans more than one transactional boundary and can partially succeed.
If it's just: fetch rule snapshot → query several upstream read models → compute
verdict → return Eligible/Not-Eligible, the canonical shape is a **stateless
policy/domain service** that fans out reads + aggregates a decision. The determinant
is not how many queries but *whether the process must remember progress + manage
failure across time*. Rule: domain service/policy when it's pure decision logic over
current facts or a supplied snapshot recomputable deterministically; Saga/Process
Manager when it must survive crashes, span time, await callbacks, or drive
compensation after committing side effects.

**(2) Block / warn / quarantine at a lifecycle gate.** Make the outcome explicit in
the ubiquitous language + model the transition accordingly; the literature prescribes
no single semantic — follow the *business meaning of violating the rule*.
- Hard-block: command rejected, no transition → easiest to replay safely (no durable
  side effect). Use when the rule is **mandatory** → model a guard that prevents the
  transition rather than a post-hoc warning.
- Warn-and-proceed: transition happens, violation/advisory recorded (domain event +
  breach flag) → replay must not duplicate warnings; advisories idempotent (derive
  from aggregate state or emit once via outbox/inbox dedup). Use when *important but
  not fatal* — a conscious business choice, not implementation convenience.
- Quarantine/provisional: aggregate enters a pending state until resolved (separate
  lifecycle state + later approval/rejection) → requires an explicit state machine +
  idempotent re-processing. Use when the business requires later review/escalation;
  don't overload "warning" to mean "needs approval".

**(3) Deterministic verdict from immutable snapshot.** Make the verdict a **pure
function of** command input + aggregate persisted state + immutable snapshot/version
identifier + other explicitly-versioned facts. The important property is *versioned
inputs*, not caching. Prefer **recomputation** on replay from the stored
snapshot/version (cleanest audit trail); cache/memoize only as a perf optimization,
never the source of truth; if you persist the verdict, persist it **with the rule
version + input hash** to detect stale/non-replay-safe decisions. Treat the immutable
per-save snapshot as a value object versioned by identity, not a live lookup.

**(4) Naming.** Yes — calling it a Saga is an overreach if there are no compensating
actions + no durable orchestration over time. Vernon's terms: **domain service** for
synchronous composite decision logic; **process manager/Saga** only for a multi-step
process with state over time. Cleaner names: Eligibility Policy, Eligibility Domain
Service, Decision Service, Policy Orchestrator. Most opinionated guidance: *model the
semantics, not the implementation shape* — a synchronous fan-out of queries is a
**policy**; a durable, compensatable workflow is a **Saga**.

**Citations (as returned — UNUSABLE, acronym collision):** several "Arizona Department
of Economic Security / DDD" developmental-disabilities-services pages + an unrelated
court opinion. Discarded; see caveat at top of file. Substantive guidance grounded on
Vernon IDDD + vault ADR-0056/ADR-0066 precedent instead.
