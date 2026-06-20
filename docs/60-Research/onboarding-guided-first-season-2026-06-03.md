---
title: Onboarding guided first season — FMX-99
status: current
tags: [research, onboarding, ftue, guided-season, feed-cards, accessibility, fmx-99]
context: [narrative-dialogue, notification]
created: 2026-06-03
updated: 2026-06-03
type: research
binding: true
linear: FMX-99
sourceType: external
related:
  - [[raw-perplexity/raw-onboarding-guided-first-season-2026-06-03]]
  - [[onboarding-strategy]]
  - [[mobile-route-map-ia-and-client-state-2026-06-03]]
  - [[../50-Game-Design/GD-0012-onboarding]]
  - [[../50-Game-Design/onboarding-and-tutorial]]
  - [[../50-Game-Design/GD-0017-mvp-scope-and-mode-sequencing]]
  - [[../50-Game-Design/GD-0008-finance-economy]]
  - [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]]
---

# Onboarding guided first season — FMX-99

## Question

How should GD-0012 R2-05 close the exact 60-second onboarding flow, guided
first-season progression, feed-card ordering and accessibility path without
turning the first playable into a PC-style setup wizard?

## Summary

FMX-99 resolves R2-05 by keeping the already-designed **current FTUE path** and
making the first season an **objective roadmap** rather than a long inbox
tutorial. Nico selected:

- **FTUE shape:** current path — experience question -> mode step -> Roguelite
  setup -> Home feed-card -> first playstyle choice.
- **Season arc:** objective roadmap — 30/60/90-day learning phases driven by
  feed-card objectives, with inbox/assistant copy as context.
- **Economy lesson:** wage runway — wage budget, free agents/loans and board
  expectations before broader matchday revenue or full finance cockpit.

The design stays aligned with [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]]:
each FTUE step is a route, Home feed-cards are the task hub, and authoritative
progression remains server-confirmed while drafts/help state live locally.

## Findings

- **Mobile FTUE best practice supports a short mandatory path.** Public mobile
  FTUE guidance emphasizes rapid entry, low setup friction, progressive
  disclosure and funnel instrumentation. For FMX this means measuring first
  tactical choice at about 60 seconds and first match entry at about three
  minutes, not teaching every system before play.
- **Genre precedent splits PC depth from mobile speed.** Football Manager PC is
  valuable for inbox, staff and board realism, but its setup density is the wrong
  default for mobile. Top Eleven/OSM/Soccer Manager and EA objective systems
  support a checklist/objective spine with reward-backed next actions.
- **Real first-season priorities favor wage runway.** Lower/mid-tier manager
  practice starts with squad audit, simple tactical identity, training load,
  wage room, free agents/loans and board expectations. This is more realistic
  and less overwhelming than starting with full commercial finance.
- **The 12-message inbox arc becomes support, not the spine.** Inbox remains the
  emotional/tutorial voice, but Home feed-card objectives own action priority.
  This avoids inbox spam and matches the ADR-0008 Home task-hub.
- **Accessibility is part of the route contract.** Experience and mode screens
  must be semantic pages, keyboard-first and screen-reader compatible. Critical
  guidance cannot live only in overlays; WCAG 2.2 AA target size, focus,
  non-drag alternatives and status-message expectations apply.
- **No live stopwatch evidence exists yet.** The repo is docs-vault-only; FMX-99
  therefore records a stopwatch protocol and design-time budget. The first
  executable prototype must collect real timing/drop-off data before a build
  beat claims the target is empirically met.

## Decision Inputs

### D1 — FTUE target definition

Recommendation: measure **60 seconds to first meaningful tactical choice**, not
first match kickoff.

Rationale: the existing GD-0012/ADR-0008 flow already targets first tactical
choice under 60 seconds and first match under three minutes. Mobile FTUE sources
support fast action, but a football manager also needs one setup and one
playstyle decision so the choice feels like management, not an autoplay demo.

### D2 — Guided first-season structure

Recommendation: use a **Season 1 objective roadmap** as the primary progression
spine.

Rationale: mobile manager/objective systems teach best through concrete next
actions. The 12-message inbox arc remains valuable as voice/context, but if it
owns the learning path the Home task hub becomes secondary and the user reads
more than acts.

### D3 — First economy lesson

Recommendation: teach **wage runway** first.

Rationale: real lower/mid-tier management and FM-style play both make wage room,
free agents/loans and board expectations the most actionable early economy
lesson. Matchday revenue and commercial contracts are important but belong after
the player understands squad cost and survival runway.

### D4 — Feed-card behaviour memory

Recommendation: keep `playerBehaviourAdjust` **per-save only**.

Rationale: it is an onboarding/read-model aid, not cross-save profiling. This
keeps behaviour adaptation deterministic for a save, PII-minimized and easy to
reset through assistance settings.

### D5 — Assistant auto-handling

Recommendation: MVP assistant auto-handling may prefill or draft low-impact
actions on Easy/Normal, but **authoritative mutations still require explicit
user confirmation**.

Rationale: this preserves user agency, avoids hidden gameplay decisions, and
fits the hybrid-online authority model. "Do something for me" can prepare a
lineup/training draft; it cannot silently submit transfers, finance choices or
match-affecting commands.

## Spec Inputs

### FTUE route and timing budget

| Step | Route/surface | Target | Required action | Notes |
|---|---|---:|---|---|
| 0 | `/new` | 0-3s | open new game | No account/notification prompt. |
| 1 | `/onboarding/experience` | 5-7s | choose Newbie / Bit / Veteran | One tap; maps tier, difficulty, tutorial verbosity. |
| 2 | `/onboarding/mode` | 5-8s | choose active Roguelite | Career visible as "comes later", not playable. |
| 3 | `/onboarding/club` | 15-25s | accept or adjust generated club/region | Advanced setup remains an escape hatch. |
| 4 | `/` Home | 3-5s | open top playstyle feed-card | Home read-model drives action. |
| 5 | `/tactics` | by <=60s | choose playstyle preset | First meaningful tactical choice. |
| 6 | `/match/:matchId` | by <=180s | start first match | FMX-100 owns in-match controls. |

`<=2 required decision screens before first match` means two management
decision screens after the lightweight classification/routing steps: club/setup
and playstyle. Experience/mode are still instrumented as funnel steps.

### Season 1 objective roadmap

| Phase | Time | Primary lesson | Objective examples | Unlock / surface |
|---|---|---|---|---|
| Kickoff | Day 0-7 | Identity, XI, playstyle, first result | choose playstyle; confirm XI; play first match; view report | Home, Squad, Tactics, Match Report |
| Stabilize | Week 2 | Training load and rotation | pick training focus; rotate one tired player; avoid overload | Training card, Squad card |
| Runway | Week 3-4 | Wage runway, free/loan recruitment, board expectations | review wage room; shortlist one free agent/loan; compare wage impact; read board expectation | Finances summary card, Transfer shortlist, Inbox context |
| Adjust | Days 31-60 | Tactical fit, morale, squad depth | react to form; solve weak position; review morale/role promise | Tactics, Squad, Transfers |
| Review | Days 61-90 | Board confidence and runway checkpoint | review points target; update wage runway; set next objective | Home objective board, board inbox |
| Season rhythm | Rest of season | Recurring loop with less tutorial pressure | match prep, training, wage warning only when relevant, transfer window prompts | 3-5 cards/day, 2-3 inbox messages/week |

The inbox arc maps to these objectives as narrative context. It does not own the
action order.

### Feed-card deterministic ordering

Inputs come from the Home read-model and local onboarding state only:
`category`, `dueInDays`, `impactTypes`, `requiredForCurrentObjective`,
`tutorialStage`, `difficulty`, `snoozeUntil`, `ignoredCount`, `dismissedCount`,
`completedRecently`, `currentForm`, `wageRunwayState`, `fixtureWindow`.

```text
priorityScore =
  onboardingStageBoost
  + timePressureScore
  + impactTypeScore
  + playerBehaviourAdjust
```

Score tables:

| Factor | Values |
|---|---|
| `onboardingStageBoost` | +80 current required objective; +35 newly unlocked system; +20 returning-user recap; 0 otherwise |
| `timePressureScore` | +100 overdue/today hard deadline; +80 due <=1 day; +55 due <=3 days; +30 due <=7 days; +10 no deadline but next-step relevant; 0 informational |
| `impactTypeScore` | +70 match-critical; +65 wage runway / board confidence; +60 tutorial progression; +50 morale/fitness/squad availability; +45 transfer opportunity; +25 narrative/open loop; +10 info-only |
| `playerBehaviourAdjust` | +10 per ignored high-impact CTA, max +30; +20 struggle trigger; -20 same type dismissed twice; -30 completed/snoozed recently; -20 tutorial card for Veteran/Minimal help |

Guardrails:

- Show 3-5 cards/day by default.
- If a fixture is due in <=3 days, include at least one match-prep card.
- Include at most one tutorial card and at most one wage/finance card per day,
  unless `wageRunwayState = danger`.
- Respect `snoozeUntil` unless the card becomes hard-deadline critical.
- Stable tie-break: higher score -> earlier due date -> category order
  `match`, `wage`, `objective`, `squad`, `transfer`, `training`, `inbox`,
  `recap` -> stable `cardId`.

### Accessibility contract for experience and mode screens

- Each step is a route with one `<h1>`, one main landmark and visible Back/Next
  or direct-selection controls.
- Experience cards are a radio group; mode tiles are buttons/links with
  explicit active/disabled state. Career uses visible "comes later" copy and
  `aria-disabled="true"` semantics.
- Keyboard order: skip link -> heading -> short instruction -> option cards ->
  Advanced/help link -> footer. `Enter`/`Space` selects; arrow-key card
  navigation is additive, not required.
- Dynamic mapping feedback is exposed through polite status text, not only
  animation.
- No required interaction depends on dragging, hover, color alone or timed
  auto-dismiss.
- Focus is never hidden under sticky chrome; visible focus meets WCAG 2.2 AA
  expectations and the project uses 44px minimum hit targets.

## Playtest Protocol

Because there is no rendered product in the docs-only phase, FMX-99 produces a
protocol and target budget rather than live measurement evidence.

1. Recruit at least five first-time players and two genre veterans per test
   slice.
2. Measure on a floor mobile device and a standard mobile device.
3. Start timer at `/new` rendered; stop primary timer at first playstyle preset
   selected; stop secondary timer at first match kickoff.
4. Record screen-by-screen time, backtracks, hesitations over five seconds,
   help opens, skip use and abandonment.
5. Ask three questions: what felt like the first real decision, what was
   unclear, and whether they would continue after the first match.
6. Gate: p50 <=60s to first tactical choice; p90 <=90s; p50 <=180s to first
   match; no unresolved keyboard/screen-reader blocker.

## Future-scope notes

- Full inbox copy and localization remain D15/E22 work.
- FMX-100 owns match controls and rendering.
- Full finance cockpit, matchday revenue teaching and commercial contracts stay
  after the wage-runway lesson.
- PWA install prompt copy uses the existing onboarding strategy; it is not part
  of the first-minute path.

## Related

- [[raw-perplexity/raw-onboarding-guided-first-season-2026-06-03]]
- [[onboarding-strategy]]
- [[mobile-route-map-ia-and-client-state-2026-06-03]]
- [[../50-Game-Design/GD-0012-onboarding]]
- [[../50-Game-Design/onboarding-and-tutorial]]
- [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]]
