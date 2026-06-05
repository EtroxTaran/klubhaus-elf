---
title: "RAW - Player discipline sub-aggregate"
status: raw
tags: [research, raw, perplexity, discipline, suspension, appeals, regulations, match, squad, narrative, fmx-80]
created: 2026-06-05
updated: 2026-06-05
type: research
related:
  - [[../player-discipline-sub-aggregate-2026-06-05]]
  - [[../../10-Architecture/09-Decisions/ADR-0078-player-discipline-suspension-contracts]]
  - [[../../10-Architecture/state-machines/player-discipline]]
  - [[../../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]]
  - [[../../10-Architecture/09-Decisions/ADR-0076-narrative-newsworthiness-event-contracts]]
  - [[../../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
---

# RAW Perplexity capture - player discipline sub-aggregate (FMX-80)

> Unprocessed research capture and source notes. Synthesised into
> [[../player-discipline-sub-aggregate-2026-06-05]].
> Do not implement from raw. Captured 2026-06-05 via Perplexity Sonar,
> targeted official-source checks and vault review.

## Prompt 1 - Real-world football discipline and game implications

System: football operations and game-design researcher. Separate real-world
football rules, comparable game precedent and design implications for an
IP-clean football manager game. Prefer official sources and avoid copying rule
text verbatim.

User: research current football player discipline systems relevant to a
management game: yellow-card accumulation, second-yellow and straight-red
suspensions, competition vs domestic/all-competition scope, appeal/rescind
patterns, and how Football Manager/Soccer Manager-like games surface
suspensions and appeals. Return concise findings, source URLs, and a
best-practice ownership recommendation for DDD contexts: Match, Squad & Player,
Regulations, Narrative/Notifications.

## Captured answer 1 - Summary

- In-match discipline is Law-of-the-Game territory: a yellow card cautions, two
  cautions in one match lead to a sending-off, and a straight red sends the
  player off immediately. The match official's facts belong to the match.
- Cross-match discipline is competition-rule territory. Competitions define
  accumulation thresholds, cut-off dates, reset/wipe policies, scope and ban
  length.
- Yellow-card accumulation commonly uses per-competition or per-competition-
  group ledgers. Long leagues often use staged thresholds; short tournaments
  use lower thresholds and stage wipes. FMX should not copy real numeric tables;
  it should carry configurable profiles.
- Red-card sanctions usually start from a minimum ban and can be extended for
  offence bands such as denial of obvious goal-scoring opportunity, offensive
  language, serious foul play or violent conduct. Second-yellow reds are often
  simpler than straight reds.
- Scope is not universal. Yellow accumulation is usually competition-scoped;
  some domestic red-card suspensions carry across domestic competitions; serious
  misconduct can be made broader by the governing profile.
- Appeals are best modelled narrowly. Straight-red wrongful-dismissal appeal is
  the useful manager-facing MVP mechanic. Second-yellow and accumulation cases
  should be non-appealable except for future administrative correction.
- Football-manager genre precedent surfaces discipline through player profile
  counters, squad-selection blocks, "one card from suspension" warnings,
  post-match inbox items and simple appeal prompts. The manager should not run a
  full tribunal minigame.

## Prompt 2 - FMX-specific ownership cross-check

System: DDD architecture reviewer for FMX. Consider existing FMX decisions:
Match owns match facts; Squad & Player owns player availability and player
contract/fitness records; Regulations owns the versioned rule catalog and
published verdict/profile contracts, but consuming business processes own their
own sagas; Narrative and Notification render/deliver only.

User: evaluate whether FMX-80 should create a new Discipline bounded context,
put discipline state inside Regulations, or assign a Squad & Player
sub-aggregate/process manager that consumes Match card facts and Regulations
profiles. Include trade-offs and recommendation.

## Captured answer 2 - Summary

- Generic DDD recommendation from a blank slate is "Regulations/Discipline owns
  both rule profile and sanction state", because the terminology is regulatory
  and appeal-driven.
- FMX is not a blank slate. ADR-0056 already limits Regulations to rule catalog,
  sanction catalog, licence/window/work-permit profiles and published verdicts;
  consuming contexts own the process managers that apply those profiles.
- A separate Discipline bounded context is defensible only if FMX later needs
  broad regulator case management, staff/club sanctions, hearings, fines and
  compliance workflows that are independent of player availability.
- For FMX-80, the lower-coupling path is a Squad & Player-owned discipline
  sub-aggregate/process manager:
  - Match emits immutable card facts.
  - Regulations returns a `DisciplineProfile` / `DisciplineVerdict`.
  - Squad & Player owns `PlayerDisciplineLedger`, `SuspensionWindow`,
    appeal state and availability read models.
  - Narrative/Notification consume `PlayerSuspended` and appeal events only.
- This keeps the line-up lock and squad availability model cohesive while
  preserving Regulations as the reusable policy source.

## Targeted source checks

- IFAB Law 12 - Fouls and Misconduct:
  <https://theifab.com/laws/chapter/32/section/94/>
  used for the in-match caution/sending-off baseline.
- The FA "Essential Information For Players 2025-26":
  <https://www.thefa.com/football-rules-governance/discipline/player-essentials>
  and PDF
  <https://www.thefa.com/-/media/files/thefaportal/governance-docs/player-essentials/2025-26/essential-information-for-players-2025-26---english-version.ashx>
  used as a current official example for caution thresholds, red-card sanction
  bands, competition-specific suspensions and wrongful-dismissal appeal framing.
- Premier League suspension explainer:
  <https://www.premierleague.com/en/news/4425344>
  used as an official league-facing example that yellow suspensions and red-card
  suspensions can have different domestic competition scopes.
- MLS Competition Guidelines:
  <https://www.mlssoccer.com/league-reports/competition-guidelines/>
  used as an official example for accumulation, suspension handling and a
  good-behaviour incentive profile.
- Football Manager official product/features:
  <https://www.footballmanager.com/>
  used for genre positioning around squad availability, discipline messages and
  manager-facing interaction surfaces.
- Soccer Manager 2026 product page:
  <https://play.google.com/store/apps/details?id=com.invinciblesstudioltd.soccermanager2025&hl=en_US>
  used only as broad genre evidence for mobile football-manager squad-status
  surfaces.

Perplexity also returned weaker community/explainer sources. They are not
promoted as design evidence; the synthesis and ADR use official sources plus
existing FMX ADRs.

## Nico decisions captured before synthesis

| # | Decision | Selected |
|---|---|---|
| D1 | Accumulation and suspension state owner | Squad & Player process manager/sub-aggregate; no new bounded context for MVP. |
| D2 | MVP appeal scope | Straight-red appeal only. |
| D3 | Suspension scope | Profile-driven scopes from Regulations (`competition`, `domestic`, `all`). |
| D4 | Appeal flow timing | Appeal resolves during post-match/pre-next-relevant-fixture processing. |
