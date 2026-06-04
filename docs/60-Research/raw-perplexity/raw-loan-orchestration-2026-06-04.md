---
title: "RAW — Loan-orchestration: FIFA RSTP loan rules + management-game loan models"
status: raw
tags: [research, raw, perplexity, transfer, loan, squad, match, regulations, fmx-85]
created: 2026-06-04
updated: 2026-06-04
type: research
related: [[../loan-orchestration-process-manager-2026-06-04]], [[../../10-Architecture/09-Decisions/ADR-0075-loan-orchestration-process-manager]], [[../../10-Architecture/state-machines/loan-orchestration]]
---

# RAW Perplexity capture — Loan-orchestration Process Manager (FMX-85)

> Unprocessed research capture. Synthesised into
> [[../loan-orchestration-process-manager-2026-06-04]]. Do not implement from raw.
> Captured 2026-06-04 (Sonar). Perplexity citations are model-provided and were
> cross-checked only where promoted into the synthesis. Two prompts were run:
> (1) real-world FIFA RSTP loan rules; (2) management-game loan models + FSM/quality.

---

## Prompt 1 — Real-world loan rules (FIFA RSTP Art. 10, 2024–2026)

**System:** Football-regulation research assistant; precise current (2024–2026) facts,
cite governing rule/article, concrete numbers + effective dates.

**User:** For a football manager simulation, accurate real-world rules governing player
LOANS as of 2024–2026: (1) FIFA RSTP loan limits introduced 2022, phased in by 2024/25 —
max loaned OUT / IN per window, phase-in schedule, same-two-clubs cap, age/home-grown
exemptions; (2) min/max loan DURATION, whole vs part-season, mid-season recall conditions;
(3) sub-loan prohibition; (4) typical contractual clauses — recall, minimum-minutes/playing-
time guarantee, wage-contribution split, loan fee, option-to-buy vs obligation-to-buy,
anti-tapping/no-play-against-parent; (5) registration-window synchronisation. Structured,
sourced summary I can turn into a deterministic state machine.

### Answer (verbatim)

Here is a structured, rule-focused summary of the **international loan rules under FIFA RSTP (Article 10, 2022 reform, as applied in 2024/25 and beyond)**, plus how they interact with typical contractual practice. This is framed so you can model it as a deterministic state machine.

#### 1. FIFA loan *limits* (number of loans in/out, phased in 2022–2025)

- New FIFA loan rules are in **Article 10 RSTP (July 2022 edition and later)** and apply **to international loans of professional players**. Member associations must adapt their **domestic** loan rules to be consistent (not identical) with FIFA's structure by **1 July 2025**.
- Phased global cap on professional players a club may have on loan OUT / IN at any given time in a season (international loans):
  - **2022/23:** max **8** OUT, **8** IN.
  - **2023/24:** max **7** OUT, **7** IN.
  - **From 2024/25 onward (full regime):** max **6** OUT, **6** IN.
  - These are *simultaneous* numbers: if a loan ends early, the slot can be reused later the same season.
  - Domestic associations may set a different numeric limit (e.g. 9) but must keep it consistent with the FIFA aim of preventing hoarding → model as an association parameter.
- Limit on loans between the **same two clubs**: max **3** professionals loaned in either direction between the same two clubs in one season (international).
- **Age / home-grown exemptions:** caps **do not apply** to players **aged 21 or younger** (season of 21st birthday) or **club-trained / home-grown** players (continuous registration with the club for a specified period between ~15–21; exact local definition per association). Practical rule: for the IN/OUT and same-two-clubs caps, count only professionals **older than 21 AND not club-trained** at their current club.

#### 2. Loan duration (min, max, early termination/recall)

- **Minimum duration** (Art. 10(1)(d)) = time **between two registration periods** (one window to the next). Cannot be a few weeks within the same window.
- **Maximum duration** = **1 year**; a clause providing longer "shall not be recognised". Renewable for additional periods of **up to 1 year each**, but **only with the player's written consent**.
- **Window alignment:** loan start must occur within a registration period (narrow Art. 6 exceptions); loan **end date must fall within a registration period of the former club's association**; at expiry registration reverts to the former club, processed like a return-from-loan transfer in that window.
- **Whole-season** = start pre-season window, end next pre-season (or mid-season) window. **Part-season** = start mid-season window, end following pre-season window.
- **Early termination / recall:** during the loan the former (home) club's employment contract is **suspended** unless otherwise agreed; if the loanee club's contract is **prematurely terminated**, the player has a **right to return**, must inform the former club, and if they return the former club must reintegrate immediately and the original contract is **reinstated from the date of reintegration** (incl. wages). Loan can be cut short by mutual agreement or a **recall clause**. Re-registration to play for another club is still constrained to the next registration window unless the original contract revives.

#### 3. Sub-loans

- FIFA treats loan as a transfer of registration A→B. A player on loan from A to B **cannot be sub-loaned B→C** as if B owned him. To move to C: **terminate A–B loan (player returns to A), then a new A→C loan or transfer**. Sub-loan while A–B active = **prohibited state**.

#### 4. Typical contractual clauses (practice, not RSTP-mandated)

- **Recall clause:** parent may recall unilaterally at certain times (e.g. only in a window, or after a minimum time) or by mutual consent. Exercising recall → early-termination logic + registration-window constraints.
- **Minimum-minutes / playing-time guarantee:** loanee club commits to minimum minutes / a role; breach triggers penalty payments, higher loan fee, or early-recall right. **Enforceable as a contractual promise but FIFA does not guarantee selection — only financial/contractual consequences apply.** Model: `playing_time_obligation` + `breach_consequence` → `recall_allowed = true` or `penalty_due`.
- **Wage-contribution split:** player usually employed by the loanee club (home contract suspended); RSTP explicitly allows the home club to pay part of remuneration. Params: `wage_total`, `wage_paid_by_loanee`, `wage_paid_by_home`. On early termination home club resumes full wage obligation.
- **Loan fee:** often payable loanee→home, sometimes zero; fixed / instalments / conditional on appearances, promotion, staying up.
- **Option-to-buy vs obligation-to-buy:** option = right (not duty) to buy at agreed price by a date, else player returns. Obligation = contractually obliged to buy at loan end, often conditional (plays X matches, avoids relegation); if conditions met, permanent transfer auto-triggers at loan end, executed in the window via TMS. Model states: `loan_end_pending_option` → `option_exercised`→`permanent_transfer` / `option_not_exercised`→`return_to_home_club`; `loan_end_with_obligation_conditionally` → evaluate conditions → `permanent_transfer` or `return_to_home_club`.
- **No-play-against-parent:** common in some leagues (e.g. England) per domestic regulation/clause, not FIFA-mandated. Model `no_play_vs_home` flag blocking eligibility when opponent == home_club.
- **Anti-tampering / no-tapping:** clauses forbidding negotiating permanent terms with third clubs during the loan without home-club consent; complements RSTP Art. 17.

#### 5. Registration-window synchronisation

- All transfers/loans must occur within registration periods (windows), limited exceptions. First (pre-season) window 8–12 weeks; second (mid-season) 4–8 weeks; total ≤16 weeks.
- Starting an international loan requires both associations' windows open + TMS entry.
- Ending a loan / across a mid-season window: loan ending in mid-season window → player returns and is registered that window; a loan that **spans** a mid-season window is unaffected by that window opening/closing — the player cannot be moved during it unless the loan is terminated/recalled and a new move processed within the window. Numeric caps are **per season**, not per window; recompute `current_loans_out/in` at season start.

#### Minimal schema recap (model)
`Loan { home_club, loanee_club, start_date, end_date, duration_valid (window-to-window, ≤1yr), age_exempt, club_trained_exempt, recall_clause, no_play_vs_home, option_to_buy, obligation_to_buy, wage_split, loan_fee, playing_time_clause, state ∈ {planned, active, terminated_early, expired, converted_to_permanent} }`. Creation must be in registration period(s), respect global + same-two-clubs caps (ignoring exempt players), duration window-to-window and ≤1yr. `active → terminated_early` allowed on mutual consent or recall (reinstate home contract, reapply registration rules). Sub-loans disallowed.

**Citations (model-provided):**
[1] morgansl.com — new FIFA loan rules / contractual consequences ·
[2] FIFA RSTP (ICSSPE PDF) ·
[3] FIFA RSTP January 2025 edition (fas.org.sg PDF) ·
[4] verfassungsblog.de — transfer-system rules ·
[5] inside.fifa.com — clearing house regulations ·
[6] support.fifatms.com — FIFA regulations.

---

## Prompt 2 — Management-game loan models + FSM / loan-quality

**System:** Game-design research assistant for football-management sims; concrete per-game
modelling, cite versions/years, distinguish UX from underlying state.

**User:** Designing a deterministic, replay-safe LOAN system (saga / process manager). How do
leading games model loans? Compare FM (FM24): offer flow, length options, recall, future-fee/
option/obligation-to-buy, wage-contribution %, squad-role/playing-time agreement + breakage,
youth loans, loan list; EA FC / FIFA Career loan-to-buy, length, wage split; OOTP option/minors
as development-loan analogue; Anstoss/older games. For each: discrete states (agreed→active→
recalled/terminated/completed), triggers, minutes-guarantee enforcement vs cosmetic, loan
success/quality computation. Extract a clean FSM + loan-quality signal model.

### Answer (verbatim, condensed to the load-bearing detail)

> A loan = a small **saga over a contract sub-object**: offer → negotiating → agreed → active
> → completed/terminated, with orthogonal flags (recallable, option-to-buy, wage split,
> playing-time promise).

**1) Football Manager (FM23–FM24).** Loan dialog knobs: **length** (end of season / end of next
season / fixed months 3·6·12, constrained by windows + registration); **wage contribution %**
slider in 10% steps; optional **loan fee** (monthly + per-appearance / unused-monthly in
Additional Clauses); **option-to-buy** (optional future fee + add-ons + sell-on) or
**obligation-to-buy** (triggered at loan end or conditional on appearances / avoiding
relegation); **recall** checkbox (sometimes "cannot recall until X"); per-competition flags
(cup-tie, can-play-against-parent); **playing-time / squad-status agreement** (Star / Important /
Regular Starter / Squad / Fringe / Impact Sub / Emergency Backup) — **explicitly tracked** and
used by AI for how often the loanee *should* play and how the parent reacts. **Development
List / Loan List** = a filter/flag; staff can be tasked to "find development loans".
Underlying FSM: `None → Listed/SeekingLoan → OfferProposed (AwaitingParent / AwaitingPlayer /
Negotiating) → AgreedPendingStart → Active (flags: Recallable/NotRecallable, OptionToBuy/
ObligationToBuy, PlayingTimePromise) → TerminatedEarly (RecalledByParent / EndedByLoanClub /
Invalidated) | Completed → PermanentTransfer (obligation met / option exercised) | Return`.
**Playing-time is mechanically enforced** via relationships: system tracks appearances/minutes
vs promised role; under-use → player "unhappy with playing time" → complains to parent manager
→ interaction "Talk to club about loan player" → if unresolved and recallable, parent gets a
"recall?" decision / auto-recall if delegated. Model a separate **PlayingTimeMonitor**
{OnTrack, BelowExpectation, Critical} fed by match log → complaint event → recall. **Loan
quality** has no single scalar but players develop more with **regular minutes**, appropriate/
higher **competition level**, good **training facilities/coaches**, good **morale/form**;
approximated as `Q = w1·MinutesRatio + w2·LeagueQualityFactor + w3·TrainingQuality +
w4·PerformanceRating`, manifested via attribute changes, dev-centre comments, market value.

**2) EA Sports FC / FIFA Career.** Much simpler — loan is a "temporary contract" object.
**Standard loan** or **loan-to-buy** (optional future transfer at pre-agreed fee; obligations
rare/absent). Length: short-term (~6 mo) / season / occasionally 2-year. **Wage split** %
negotiated; usually no recurring loan fee. **No playing-time promises, no development list, no
staff automation.** FSM: `None → OfferProposed → AgreedPendingStart → Active (LoanToBuyOption +
BuyFee, WageShare) → Completed (option exercised → permanent | else return) → (CancelledEarly
rare)`. **Playing time not modelled**; loan quality ≈ OVR/attribute delta over the active
period driven by minutes + training, not loan-specific logic.

**3) OOTP (baseball) options/minors** = development-loan analogue. Player on 40-man roster has
**option years**; can be freely assigned to the minors (still under parent contract, no second
club, unilateral). `MajorLeagueActive ↔ MinorLeagueAssignment (+ RehabilitationAssignment)`.
Development via hidden talent/potential + level-of-competition vs ability + playing time +
coaching + age/injury. Suggests modelling **development separately from the legal contract**
(AssignmentLeagueLevel vs CurrentAbility, PlayingTimeFraction, TrainingQuality), longer-season
DevelopmentDelta. No playing-time promises.

**4) Anstoss / older games.** Coarse: length usually "until end of season"; simple wage-coverage
% or flat fee; options-to-buy absent or scripted post-loan event; often no explicit recall;
no role promises (opaque AI selection). FSM: `None → OfferProposed → Active → Completed |
TerminatedEarly(rare/scripted)`. Loan quality ≈ did he get matches + did attributes/value rise;
`Q = g(GamesPlayed, Age, BaseGrowthRate)`.

**5) Extracted canonical FSM + quality model.** Core states: `Idle/NotOnLoan → SeekingLoan
(optional) → Proposed → Negotiating → AgreedPendingStart → Active → {TerminatedEarly(RecallByParent
/ MutualTermination / Administrative) | Completed}`; `Completed` → if obligation satisfied or
option exercised → spawn `PermanentTransfer` + move EmploymentContract, else revert to parent.
Layer a deterministic **PlayingTimeMonitor** {OnTrack, Warning, Failing} over Active: inputs
minutesPlayed/started vs promisedRole target; on Warning → "player complains"; on Critical &&
recallable → parent may recall. **Loan-quality** (deterministic, pure function of logged match +
environment data + a fixed weights table, *no random rolls*):
`LoanQuality = w1·MinutesRatio + w2·LeagueFactor + w3·TrainingFactor + w4·PerformanceFactor +
w5·MoraleFactor` → attribute deltas + narrative + a category {Excellent/Good/Neutral/Poor/
Disastrous}. Suggested commands: `ProposeLoan, AcceptLoan, StartLoan, RecordLoanMatchMinutes,
EvaluateLoanPeriod, RecallLoanee`.

**Citations (model-provided):** fmprojects.substack.com (loan-out profit guide), sortitoutsi.net
FM24 loan guide, FM YouTube guides, steamcommunity EA FC career discussions.

---

## Reviewer notes (cross-checks promoted into synthesis)

- RSTP **6/6 simultaneous + 3 between same two clubs + U21/club-trained exemption + window-to-
  window min / 1-year max + sub-loan prohibition** are the load-bearing rule facts; promoted.
  Numeric **domestic** cap parameters left to Regulations data follow-up (associations diverge).
- **Minutes guarantee is contractual-only and never overrides selection** in both the real rules
  and FM — this directly grounds D3 (breach → recall *right* + penalty, not forced selection).
- The **deterministic, no-RNG loan-quality function** from logged facts grounds D4 (Transfer
  read-model emitting `LoanQualityAssessed`; numeric weights → FMX-52).
- FM's mechanically-tracked squad-role promise + PlayingTimeMonitor is the closest precedent for
  the layered monitor sub-process.
