---
title: Raw Perplexity — FMX-99 onboarding and guided first season
status: raw
tags: [research, raw, perplexity, onboarding, ftue, guided-season, fmx-99]
created: 2026-06-03
updated: 2026-06-03
type: research
binding: false
linear: FMX-99
related:
  - [[../onboarding-guided-first-season-2026-06-03]]
  - [[../onboarding-strategy]]
  - [[../../50-Game-Design/GD-0012-onboarding]]
  - [[../../50-Game-Design/onboarding-and-tutorial]]
  - [[../../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]]
---

# Raw Perplexity — FMX-99 onboarding and guided first season

Raw research capture for FMX-99. This note preserves the substantive findings
from Perplexity passes used to resolve GD-0012 R2-05. It is source input only;
the decision-ready synthesis is
[[../onboarding-guided-first-season-2026-06-03]].

## Pass 1 — Mobile FTUE, progressive disclosure and instrumentation

Prompt: current 2025-2026 best practices for mobile game FTUE, onboarding length,
step count before first meaningful action, tutorial fatigue, progressive
disclosure, accessibility and retention instrumentation for a deep
strategy/management game on mobile/PWA.

### Findings

- **Fast compulsory onboarding.** Current mobile-game FTUE practice converges on
  minimizing barriers, putting players into the game quickly, and delaying
  account creation, notification prompts and detailed settings until after the
  first meaningful loop. For FMX this supports a default flow that reaches a
  tactical choice in about 60 seconds and first match entry within about three
  minutes.
- **Teach through decisions, not lectures.** Sources warn against button-pushing
  tours that remove agency. The first FMX lesson should be a real manager
  decision with immediate feedback: playstyle, XI, training or wage/runway
  trade-off, not a static feature tour.
- **Progressive disclosure.** Deep systems should be previewed without becoming
  required early input. Later features should unlock when the player has a live
  reason to use them.
- **Narrative hook plus goals.** FTUE should show long-term potential through
  short, clear goals and open loops. For FMX this maps naturally to board
  expectations, assistant feed-cards and a season-one roadmap.
- **Tutorial fatigue control.** Guidance should become skippable and contextual
  after the first critical actions. FMX should cap full overlays and rely on
  feed-cards, inbox and optional help after the first route sequence.
- **Early agency without form friction.** Simple identity/cosmetic choices can
  build ownership if they are optional and defaulted. Text entry and full editor
  flows should stay behind Advanced setup.
- **Accessibility as FTUE design.** The first routes need large targets,
  keyboard/screen-reader paths, readable text and redundant visual encodings.
  Critical information must not live only inside overlays.
- **Stepwise funnel instrumentation.** Track each FTUE step and core-loop event:
  launch, experience choice, mode choice, setup, first feed-card, first tactical
  choice, first match start, result seen and first objective tick. The useful
  question is not only where users drop, but why they do not continue.
- **Open loops and return hooks.** End the first session with a clear next
  reason to return: scout report, board check, next match, wage runway warning or
  season objective.

### Sources returned

- GameAnalytics FTUE guidance:
  https://www.gameanalytics.com/blog/tips-for-a-great-first-time-user-experience-ftue-in-f2p-games
- Game Developer FTUE best practices:
  https://www.gamedeveloper.com/design/best-practices-for-a-successful-ftue-first-time-user-experience-
- Skillz FTUE practice-match guidance:
  https://docs.skillz.com/docs/29.2.22/first-time-user-experience/
- UserTesting mobile-game FTUE research:
  https://www.usertesting.com/blog/8-elements-of-first-time-user-experience-in-mobile-game-research
- Zco 2026 mobile-game development guide:
  https://www.zco.com/blog/mobile-game-development-guide-2026/
- Stepico 2026 mobile-game marketing strategy:
  https://stepico.com/blog/mobile-game-marketing-strategy-in-2026/

## Pass 2 — Football and sports-manager onboarding comparison

Prompt: compare onboarding and first-session design in Football Manager PC,
FM Mobile, Top Eleven, OSM, Hattrick, Soccer Manager, Club Boss,
Anstoss/We Are Football and adjacent EA FC objective systems.

### Findings

- **PC manager games teach depth slowly.** Football Manager PC starts through
  profile, club, responsibilities, inbox, board expectations and squad review.
  It is valuable precedent for realism and delegation, but too dense for a
  60-second mobile/PWA first run.
- **FM Mobile compresses but still expects genre patience.** It supports faster
  first-match entry through presets and simplified screens, but does not force a
  short guided first loop.
- **Mobile F2P managers drive first match quickly.** Top Eleven, OSM and Soccer
  Manager-style flows emphasize club identity, XI/tactics, an early match or
  scheduled match setup, and reward-backed next steps.
- **Checklists/objectives are the strongest mobile learning spine.** OSM, Top
  Eleven and EA FC objective trees use task lists to teach systems without a
  long tutorial. This supports making FMX Season 1 an objective roadmap, with
  inbox messages as explanation and emotion.
- **Assistants are useful when they centralize guidance.** Assistant/coaches
  should reduce menu friction and recommend actions, but not become constant
  interruptions. This supports Alex as the single tutorial voice across inbox,
  coach marks and feed-cards.
- **Economy teaching differs by business model.** F2P games teach currencies
  explicitly; simulation-first games teach wage/transfer budgets and board
  expectations. FMX should teach club-economy realism first, not premium-resource
  loops.
- **Veterans need a real fast path.** PC sims allow self-skip through delegation;
  mobile games allow tutorial dismiss. FMX needs explicit Veteran mapping plus
  micro-tooltips and resettable help.
- **Mobile friction must be lower than PC realism.** Defaults, one-tap actions,
  short text, thumb-reachable CTAs and recommended presets are more important
  than comprehensive setup in the first minute.

### Sources returned

- Football Manager 26 reimagined UI:
  https://www.footballmanager.com/fm26/features/fm26s-reimagined-user-interface
- Genre/video references returned by Perplexity:
  https://www.youtube.com/watch?v=6AUQ6dP6fOE
  https://www.youtube.com/watch?v=u6wPJifxvvw&vl=en
- Visual/UI community references returned as weak comparative inputs only:
  https://dribbble.com/search/football-onboarding
  https://www.figma.com/community/file/1554833764747092898/football-manager-26-ui-recreation

Confidence: medium. Public official onboarding documentation for competitor
first sessions is thin; use these as product-pattern evidence, not exact timing
claims.

## Pass 3 — Real-world first-season manager priorities

Prompt: real-world first-season priorities for a newly appointed lower/mid-tier
football manager: first 30/60/90 days, squad assessment, tactical identity,
training load, finances/wage budget, transfers/loans/free agents, board
expectations, player morale, fan/media communication and match preparation.

### Findings

- **First 30 days: assessment and control.** A new lower/mid-tier manager first
  audits squad depth, weak positions, fitness, role coverage, morale, wage room
  and board expectations.
- **Tactical identity should fit the squad.** The early identity is functional
  and simple, not a perfect philosophy imposed on unready players.
- **Wage budget matters before transfer spend.** Lower-tier improvement often
  comes from wage flexibility, free agents, loans and short-term depth rather
  than transfer fees.
- **Recruitment starts practical.** Free agents, loans and expiring contracts
  are the first realistic market lessons for a club with limited cash.
- **Training load and staff quality are operational basics.** The game should
  teach rotation and injury-risk control before deep staff optimization.
- **Morale and role promises are part of squad control.** Playing time,
  selection consistency and communication affect early stability.
- **Board goals frame the first season.** Survival, top-half, youth or cup
  expectations determine which actions matter now.
- **Media/fan communication should be simple and modest early.** It is a trust
  and pressure layer, not a first-minute system.
- **First 90 days are observation plus adjustment.** The player should see a
  loop of choose, watch result, adjust tactic/training/recruitment, then review
  wage runway and board confidence.

### Sources returned

- Football Manager lower-league guide:
  https://www.operationsports.com/football-manager-26-how-to-manage-in-the-lower-leagues/
- FMM Vibe lower-league walkthrough:
  https://fmmvibe.com/forums/topic/50919-walkthrough-lowest-league-to-premier-league/
- Football Manager teams-to-manage article:
  https://www.footballmanager.com/the-dugout/top-10-teams-manage-fm26
- Genre/video references returned by Perplexity:
  https://www.youtube.com/watch?v=rPSJeltwwGs
  https://www.youtube.com/watch?v=f01cvWbpVXc

Confidence: medium. Some inputs are guide/community sources; the design value is
the pattern convergence: assessment, simple tactic, wage discipline, free/loan
recruitment and board expectation alignment.

## Official accessibility cross-check

Manual web check, 2026-06-03:

- W3C WCAG 2.2 Recommendation:
  https://www.w3.org/TR/WCAG22/
- W3C "What's New in WCAG 2.2":
  https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- W3C Understanding WCAG 2.2:
  https://www.w3.org/WAI/WCAG22/Understanding/

FMX-99 relevance: the experience and mode routes must account for focus not
obscured, dragging alternatives, target size, redundant entry, accessible
authentication where account flows later touch onboarding, and status messages.

## Raw decision options sent to Nico

- FTUE shape:
  - Current path: experience -> mode -> Roguelite setup -> Home feed-card ->
    playstyle.
  - Instant match: pull match kickoff aggressively forward.
  - Squad-fix first: make squad/transfer repair the first action.
- Season arc:
  - Objective roadmap.
  - 12 inbox arc as primary path.
  - Fully adaptive cards.
- Economy lesson:
  - Wage runway.
  - Matchday revenue.
  - Full finance cockpit.

Nico selected: Current path, Objective roadmap, Wage runway.

## Related

- [[../onboarding-guided-first-season-2026-06-03]]
- [[../onboarding-strategy]]
- [[../../50-Game-Design/GD-0012-onboarding]]
- [[../../50-Game-Design/onboarding-and-tutorial]]
- [[../../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]]
