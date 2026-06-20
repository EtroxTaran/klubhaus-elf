---
title: Player discipline sub-aggregate
status: current
tags: [research, discipline, suspension, appeals, regulations, match, squad, narrative, ddd, fmx-80]
context: [squad-player, regulations-compliance]
created: 2026-06-05
updated: 2026-06-05
type: research
binding: false
related:
  - [[raw-perplexity/raw-player-discipline-sub-aggregate-2026-06-05]]
  - [[../10-Architecture/09-Decisions/ADR-0078-player-discipline-suspension-contracts]]
  - [[../10-Architecture/state-machines/player-discipline]]
  - [[../10-Architecture/state-machines/match]]
  - [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]]
  - [[../10-Architecture/09-Decisions/ADR-0076-narrative-newsworthiness-event-contracts]]
  - [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
  - [[domain-model-audit-and-backlog-2026-06-02]]
---

# Player discipline sub-aggregate (FMX-80)

Grounds FMX-80 / audit gap G18. Raw capture:
[[raw-perplexity/raw-player-discipline-sub-aggregate-2026-06-05]].

Promoted source checks:

- IFAB Law 12 - Fouls and Misconduct:
  <https://theifab.com/laws/chapter/32/section/94/>
- The FA "Essential Information For Players 2025-26":
  <https://www.thefa.com/football-rules-governance/discipline/player-essentials>
- FA 2025-26 player essentials PDF:
  <https://www.thefa.com/-/media/files/thefaportal/governance-docs/player-essentials/2025-26/essential-information-for-players-2025-26---english-version.ashx>
- Premier League suspension explainer:
  <https://www.premierleague.com/en/news/4425344>
- MLS Competition Guidelines:
  <https://www.mlssoccer.com/league-reports/competition-guidelines/>
- Football Manager:
  <https://www.footballmanager.com/>
- Soccer Manager 2026:
  <https://play.google.com/store/apps/details?id=com.invinciblesstudioltd.soccermanager2025&hl=en_US>

## 1. Problem

The domain audit marks G18 as a weak-domain gap: Match can emit card events and
Regulations owns sanction catalog/rule profiles, but no FMX note owns
card-accumulation state, suspension windows, appeal state or the canonical
`PlayerSuspended` event that Narrative needs.

FMX-83 deliberately avoided defining `PlayerSuspended` and listed only
Narrative projection requirements. FMX-80 closes that ownership gap without
ratifying a new bounded context or runtime implementation.

## 2. Decisions recorded for FMX-80

Nico selected these planning choices live on 2026-06-05. The linked ADR remains
`proposed` / `binding: false` until ratified.

| # | Decision | Landing |
|---|---|---|
| D1 | Accumulation and suspension state owner | **Squad & Player process manager/sub-aggregate.** Match emits card facts; Regulations owns rule profiles; Squad & Player owns player ledger, suspension windows, appeal state and availability projection. |
| D2 | MVP appeal scope | **Straight-red appeal only.** Second-yellow and yellow-accumulation cases are not appealable in MVP, except for future administrative correction. |
| D3 | Suspension scope | **Profile-driven scopes.** Regulations profiles define whether a sanction applies to the same competition, domestic group or all competitions. |
| D4 | Appeal timing | **Pre-next-relevant-fixture resolution.** Appeal review resolves in post-match processing before the next fixture that could consume the suspension. |

## 3. Real-world takeaways

- IFAB standardises in-match caution and sending-off semantics. It does not
  decide cross-match ban length, accumulation thresholds or competition scope.
- Real competitions keep configurable card ledgers: long seasons use staged
  thresholds and cut-off dates; tournaments use lower thresholds and wipe rules.
- Red-card suspensions and yellow-accumulation suspensions can have different
  scopes. Yellow accumulation is often competition-specific, while some red-card
  bans can carry across domestic competitions.
- Appeal paths are intentionally narrow. Straight-red wrongful-dismissal review
  is a clean manager-facing mechanic; broad appeals for routine accumulation
  would add legal/admin complexity without strong gameplay value.
- Numeric thresholds, offence lengths and good-behaviour reductions are
  regulation-profile data and later calibration, not FMX-80 architecture.

## 4. Game and genre takeaways

- Football-management games usually expose discipline as availability and
  planning information: profile counters, squad-screen blocks, "one booking away"
  warnings, post-match inbox items and simple appeal prompts.
- The manager-facing decision is whether to risk a player close to suspension,
  rotate them, or appeal a straight red. The system should not turn every card
  into manual admin.
- Appeals should be a high-salience inbox choice with a bounded outcome, not a
  tribunal minigame. Frivolous appeal penalties can be future calibration if
  needed.
- Narrative value comes from explaining why a player is unavailable and whether
  an appeal changed the outcome. Narrative must not calculate bans.

## 5. FMX design conclusions

- Do **not** add a new Discipline bounded context for MVP. FMX can revisit that
  only if later regulator-case management expands beyond player availability.
- Do **not** move player suspension state into Regulations. ADR-0056 makes
  Regulations the versioned policy/profile source; consuming business processes
  own application state.
- Match remains the only source of card facts and in-match sending-off effects.
- Squad & Player owns the `PlayerDisciplineLedger`, `SuspensionWindow`,
  `DisciplineAppealCase`, `PlayerEligibilitySnapshot` and canonical
  `PlayerSuspended` event.
- Regulations owns `DisciplineProfile` / sanction catalog versions, thresholds,
  scope policy, appeal eligibility policy and serve policy.
- Narrative and Notification consume self-contained events. They render stories,
  warnings and inbox items, but never own discipline truth.

## 6. Open follow-ups

- FMX-52 calibration owns exact thresholds, ban lengths, appeal success rates,
  frivolous-appeal penalties, warning timing and good-behaviour incentives.
- Regulations follow-up owns the initial fictional `DisciplineProfile` catalog
  for league, cup, continental and friendly fixtures.
- UI/UX follow-up should design squad-screen blocked-state, "at risk" warnings
  and appeal inbox flow once the mobile route/workflow lane starts.
- A future Discipline bounded context can be reconsidered only if staff bans,
  club fines, regulator hearings and multi-party legal processes become central.

## Related

- [[raw-perplexity/raw-player-discipline-sub-aggregate-2026-06-05]]
- [[../10-Architecture/09-Decisions/ADR-0078-player-discipline-suspension-contracts]]
- [[../10-Architecture/state-machines/player-discipline]]
- [[../10-Architecture/state-machines/match]]
- [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
- [[../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]]
- [[../10-Architecture/09-Decisions/ADR-0076-narrative-newsworthiness-event-contracts]]
- [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
