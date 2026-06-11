---
title: GD-0012 Onboarding & New Game
status: accepted
tags: [game-design, gddr, onboarding, fmx-99]
created: 2026-05-17
updated: 2026-06-11
type: game-design
binding: true
related: [[README]], [[onboarding-and-tutorial]], [[GD-0008-finance-economy]], [[GD-0016-mobile-ux-loop]], [[GD-0017-mvp-scope-and-mode-sequencing]], [[../00-Index/MVP-Scope]], [[../60-Research/onboarding-strategy]], [[../60-Research/onboarding-guided-first-season-2026-06-03]], [[../60-Research/raw-perplexity/raw-onboarding-guided-first-season-2026-06-03]], [[../60-Research/club-boss-analysis]], [[../60-Research/anstoss-series-deep-dive]], [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]], [[../10-Architecture/09-Decisions/ADR-0006-i18n]]
---

# GD-0012: Onboarding & New Game

## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `approved`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

> **Accepted** (re-ratified 2026-06-08, PR #153) — the **Decided / strong** section is ratified design
> direction; an ADR or implementation must not contradict it. The
> **Open (Wave 2)** items are NOT approved and not implementable until
> Wave 2 research closes.
>
> **MVP amendment (2026-05-18):** [[GD-0017-mvp-scope-and-mode-sequencing]]
> supersedes this note where it implies all modes are playable in MVP. The MVP
> shows Roguelite as active and Career as "comes later".
>
> **FMX-99 amendment (2026-06-03):** R2-05 is resolved. Nico selected the current
> FTUE path, a Season-1 objective roadmap, and wage runway as the first economy
> lesson. This note is now ratified as the implementable onboarding decision
> record; [[onboarding-and-tutorial]] is the detailed system spec and
> [[../60-Research/onboarding-guided-first-season-2026-06-03]] is the research
> synthesis.

## Date

2026-05-17

## Player experience goal

Be managing a club in ~60 seconds, and understand *why money matters* by the
end of season one — the single biggest churn risk solved.

## Decided / strong

- **Frictionless ~60-second start**: pick Roguelite → pick country → pick fictional club →
  optional manager avatar; full editor/custom data is **post-MVP**
  (anstoss-series-deep-dive §5 takeaway 7, §7 rec. 10).
- **Strategic onboarding, not just controls**: a guided first season that
  *teaches financial sustainability* through wage runway first — wage budget,
  board expectations, free agents and loans before broader matchday revenue or a
  finance cockpit.
- MVP UX must **beat Anstoss on first-session clarity** (competitor-matrix
  "Tutorialisation" risk).
- No real-world data import in MVP; editor edits fictional entities only
  (anstoss-series-deep-dive §7 rec. 10).
- **R2-05 FTUE shape**: experience question → mode step → Roguelite setup →
  Home feed-card → first playstyle choice. The first match remains a secondary
  target (<3 minutes), while the primary 60-second target is the first
  meaningful tactical choice.
- **R2-05 guided season**: Season 1 is an objective roadmap. Inbox messages and
  Assistant voice add context; they do not own the action order.
- **R2-05 feed-card ordering**: Home cards use a deterministic integer score
  from onboarding stage, time pressure, impact type and per-save behaviour
  adjustment. No cross-save player profiling is used.
- **R2-05 accessibility**: onboarding steps are semantic routes with
  keyboard-first selection, WCAG 2.2 AA contrast/focus/target expectations and
  no critical information exclusive to overlays.

## Open (Wave 2)

- None for R2-05. Full inbox body copy/localization, player-facing help-center
  articles and in-match controls remain separate follow-ups (D15/E22/K1/FMX-100).

## R2-05 implementation contract

### FTUE timing definition

The primary stopwatch target is **time to first meaningful tactical choice**,
not match kickoff.

| Step | Route / surface | Target | Required action |
|---|---|---:|---|
| New game entry | `/new` | 0-3s | start new run |
| Experience | `/onboarding/experience` | 5-7s | choose Newbie / Bit / Veteran |
| Mode | `/onboarding/mode` | 5-8s | choose active Create-a-Club Roguelite |
| Roguelite setup | `/onboarding/club` | 15-25s | accept or adjust generated club/region |
| First Home | `/` | 3-5s | open top playstyle feed-card |
| Playstyle | `/tactics` | <=60s total | choose one of three presets |
| First match | `/match/:matchId` | <=180s total | start first match |

The "≤2 required decision screens before first match" rule counts management
decision screens after classification/routing: Roguelite setup and playstyle.
The experience and mode steps are still measured funnel steps, but each is a
one-tap classification/route step.

### Guided first-season objective roadmap

| Phase | Time | Primary lesson | Required objective examples |
|---|---|---|---|
| Kickoff | Day 0-7 | club identity, XI, playstyle, first result | confirm XI; choose playstyle; play first match; view report |
| Stabilize | Week 2 | training load and rotation | pick training focus; rotate one tired player; avoid overload |
| Runway | Week 3-4 | wage room, free/loan recruitment, board expectations | review wage room; shortlist one free agent/loan; compare wage impact |
| Adjust | Days 31-60 | tactical fit, morale, squad depth | react to form; solve one weak position; review morale |
| Review | Days 61-90 | board confidence and runway checkpoint | review objective progress; update wage runway; set next objective |
| Rhythm | Rest of season | recurring manager loop with less tutorial pressure | match prep, training, wage warning only when relevant, transfer-window prompts |

The existing 12-message inbox arc maps onto this table as narrative support.
Home feed-cards are the canonical primary action surface.

### Feed-card priority formula

```text
priorityScore =
  onboardingStageBoost
  + timePressureScore
  + impactTypeScore
  + playerBehaviourAdjust
```

| Factor | Values |
|---|---|
| `onboardingStageBoost` | +80 current required objective; +35 newly unlocked system; +20 returning-user recap; 0 otherwise |
| `timePressureScore` | +100 overdue/today hard deadline; +80 due <=1 day; +55 due <=3 days; +30 due <=7 days; +10 next-step relevant; 0 informational |
| `impactTypeScore` | +70 match-critical; +65 wage runway / board confidence; +60 tutorial progression; +50 morale/fitness/availability; +45 transfer opportunity; +25 narrative/open loop; +10 info-only |
| `playerBehaviourAdjust` | +10 per ignored high-impact CTA, max +30; +20 struggle trigger; -20 same type dismissed twice; -30 completed/snoozed recently; -20 tutorial card for Veteran/Minimal help |

Guardrails:

- Show 3-5 cards per in-game day by default.
- If a fixture is due in <=3 days, include at least one match-prep card.
- Include at most one tutorial card and at most one wage/finance card per day,
  unless `wageRunwayState = danger`.
- Respect `snoozeUntil` unless the card becomes hard-deadline critical.
- Tie-break deterministically by score, due date, category order and stable
  `cardId`.
- `playerBehaviourAdjust` persists per save only through local onboarding/read
  state; it is not cross-save or identity profiling.

### Assistant auto-handling boundary

At MVP, Assistant auto-handling can prepare drafts or prefill low-impact actions
on Easy/Normal, but no authoritative mutation is submitted without explicit
confirmation. Transfers, finances, match-affecting commands and progression
remain user-confirmed and server-confirmed.

### Accessibility requirements

- Each onboarding step is a route with one `<h1>`, one main landmark and visible
  controls.
- Experience choices are a radio group; mode tiles expose active/disabled state.
  Career is visible as "comes later" and not selectable.
- Keyboard order is skip link -> heading -> instruction -> option cards ->
  Advanced/help link -> footer. `Enter`/`Space` selects.
- No required action depends on hover, drag, color alone or timed auto-dismiss.
- Dynamic selection feedback is exposed through polite status text.
- Focus is visible and not obscured by sticky chrome; minimum hit targets follow
  the project 44px rule.

### Stopwatch evidence gate

The repo is docs-vault-only, so FMX-99 records the test protocol and design-time
budget. A future prototype/build beat must run stopwatch tests before claiming
the 60-second target as empirically met:

- p50 <=60s to first playstyle choice; p90 <=90s.
- p50 <=180s to first match kickoff.
- no unresolved keyboard/screen-reader blocker on experience or mode routes.

## Rationale

Systems are taught everywhere; strategy is taught nowhere. Research for FMX-99
shows that mobile FTUE needs fast action, genre realism needs a real manager
decision, and real first-season management starts with squad fit and wage
runway. The objective roadmap keeps action in Home feed-cards while preserving
Anstoss-style inbox personality.

## Consequences

Positive:

- Fast start + a player who understands the economy = retention.

Negative / constraints:

- Live stopwatch evidence is still a prototype/build gate because the repo has
  no app implementation in the current docs-only phase.
- Full copy/tone remains tied to ADR-0006 and the narrative/localization
  pipeline.

## Supersedes

None

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]] (R2-05 input block)
- [[../10-Architecture/09-Decisions/ADR-0006-i18n]] (onboarding copy/tone)

## Related

- Research: [[../60-Research/onboarding-guided-first-season-2026-06-03]] · [[../60-Research/onboarding-strategy]] · [[../60-Research/club-boss-analysis]] · [[../60-Research/anstoss-series-deep-dive]]
- [[README]] — hub · siblings: [[GD-0008-finance-economy]] · [[GD-0016-mobile-ux-loop]] · [[GD-0013-narrative-inbox]]
