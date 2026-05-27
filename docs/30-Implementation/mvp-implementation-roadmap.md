---
title: MVP Implementation Roadmap
status: current
tags: [implementation, mvp, roadmap, roguelite, slices]
created: 2026-05-19
updated: 2026-05-19
type: implementation
binding: false
related:
  - [[../00-Index/MVP-Scope]]
  - [[../20-Features/feature-roguelite-mvp-first-playable]]
  - [[../50-Game-Design/GD-0017-mvp-scope-and-mode-sequencing]]
  - [[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
  - [[hybrid-online-pwa-strategy]]
---

# MVP Implementation Roadmap

This is the **ordered build plan** for the Create-a-Club Roguelite first
playable. Product scope lives in [[../00-Index/MVP-Scope]]; this note defines
**how** to ship it in small, clickable slices.

Each slice must ship with: vault delta (if behaviour changes), tests per
`testing-strategy` (planned), Storybook for touched UI, and green CI per
[[ci-and-review-process]].

## Slice template

| Field | Purpose |
|---|---|
| Goal | User-visible outcome |
| Contexts | Bounded contexts touched |
| Vault inputs | Feature spec, GDDR, ADR, context contract |
| UI | Required Storybook stories |
| Tests | unit / contract / integration / e2e minimum |
| Authority | server-confirmed vs local draft/cache |
| DoD | Same PR: implementation + tests + vault + green checks |

## Slices (build order)

### Slice 0 — Auth shell

| Field | Value |
|---|---|
| Goal | User can register, verify email, log in, log out; game routes require auth |
| Contexts | Identity & Access |
| Vault | `auth-mvp-launch-slice` (planned), [[auth-flows]], [[session-management]] |
| UI | Sign-up, verify-email, login screens + stories |
| Tests | Unit (validators), integration (auth API), e2e: register → verify → login |
| Authority | Server (Identity) — sessions via F3 |
| DoD | `_authed/` routes blocked when logged out |

### Slice 1 — Roguelite gate

| Field | Value |
|---|---|
| Goal | Mode step: Roguelite playable; Career visible as "comes later" |
| Contexts | — (UI + onboarding only) |
| Vault | [[../50-Game-Design/GD-0017-mvp-scope-and-mode-sequencing]], [[../20-Features/feature-roguelite-mvp-first-playable]] |
| UI | `ModePicker`, onboarding step 1 — stories updated |
| Tests | Component test + e2e: Career button disabled |
| Authority | UI only |
| DoD | Maps to existing onboarding foundation; no Career flow entry |

### Slice 2 — Run create

| Field | Value |
|---|---|
| Goal | Create fictional club; server-confirmed roguelite run exists |
| Contexts | Club, Squad (starter), League (minimal), Identity |
| Vault | [[../50-Game-Design/mode-create-a-club-roguelite]], `context-contracts/club` (planned) |
| UI | Onboarding steps 2–4, club identity — stories |
| Tests | Contract (CreateRun command), integration (PostgreSQL), e2e: complete onboarding → run id |
| Authority | Server-confirmed; Dexie may cache read model after confirm |
| DoD | No real club names; reload shows confirmed run |

### Slice 3 — Home dashboard

| Field | Value |
|---|---|
| Goal | Feed-card home after run; primary next action visible |
| Contexts | Notification (projections), Club (read) |
| Vault | [[../20-Features/feature-roguelite-mvp-first-playable]], [[../50-Game-Design/GD-0016-mobile-ux-loop]] |
| UI | Office hub / home — stories |
| Tests | e2e: land on home with feed-card after run create |
| Authority | Cached read + server refresh |
| DoD | Stale cache labelled if offline |

### Slice 4 — Tactics draft

| Field | Value |
|---|---|
| Goal | Edit tactic; local draft when offline; confirm requires connection |
| Contexts | Match (tactic lock draft), Offline Sync |
| Vault | [[hybrid-online-pwa-strategy]], `context-contracts/sync` (planned) |
| UI | Tactics screen + `ConnectionBanner` — stories |
| Tests | Unit (`saveTacticDraft`), e2e: offline edit shows draft copy |
| Authority | Dexie draft → server command on confirm |
| DoD | Draft never shown as final until `confirmed` |

### Slice 5 — First match

| Field | Value |
|---|---|
| Goal | Start and resolve first match via authoritative command |
| Contexts | Match, League (fixture) |
| Vault | [[../50-Game-Design/match-engine]], `context-contracts/match` (planned) |
| UI | Match flow / report — stories |
| Tests | Contract (ResolveMatch), integration; e2e: play first match |
| Authority | Server-confirmed (stub engine acceptable for slice) |
| DoD | Match report visible; deterministic seed documented |

### Slice 6 — Run feedback

| Field | Value |
|---|---|
| Goal | Cash / run-risk feedback after match |
| Contexts | Club (finance signals), Notification |
| Vault | [[../50-Game-Design/mode-create-a-club-roguelite]] |
| UI | Home or post-match summary — stories |
| Tests | e2e: see cash/run-risk after first match |
| Authority | Server read model |
| DoD | Completes first playable loop per feature spec |

## After slice 6

Deeper systems (transfers, training depth, async MP) follow
[[../95-Archive/gap-reports/feature-gap-analysis]] Phase 2+ — not this roadmap.

## Phase 2 — Presentation polish (post-MVP)

Authoritative: [[../10-Architecture/09-Decisions/ADR-0029-3d-presentation-layer]].
Architecture detail: [[3d-presentation-architecture]]. Feature spec:
[[../20-Features/feature-3d-presentation-layer]].

Three small thin slices, each its own PR with vault delta + tests +
Storybook (3D and 2D pendant) + green CI. None are MVP blockers; they
build on top of the loop validated by slices 0–6.

### Slice 7a — 3D Foundation + Iso-Stadium

| Field | Value |
|---|---|
| Goal | `/stadion` renders isometric 3D on Standard / Premium and existing 2D on Floor; same read-model on both paths |
| Contexts | Club (read), Notification (telemetry events) |
| Vault | [[../10-Architecture/09-Decisions/ADR-0029-3d-presentation-layer]], [[3d-presentation-architecture]], [[../20-Features/feature-3d-presentation-layer]] |
| UI | `SceneCanvas`, `CapabilityGate`, `IsoStadium` (+ 2D pendant story); 2D `stadium/*` composites preserved |
| Tests | Unit (`scene-mapper/club-iso-stadium`), component (`CapabilityGate` all 6 branches), R3F snapshot (≤ 150 draw calls), e2e (provoked `WEBGL_lose_context`) |
| Authority | Read-only (consumes confirmed club read-model) |
| DoD | Bundle initial-critical unchanged; `scene-3d` chunk lazy-loaded; LICENSES.md complete |

### Slice 7b — Stadium Backdrop

| Field | Value |
|---|---|
| Goal | Optional static 3D backdrop behind `/anpfiff` and `/halbzeit` |
| Contexts | — (UI only) |
| Vault | [[../20-Features/feature-3d-presentation-layer]] (Slice 7b criteria) |
| UI | `<StadiumBackdrop>` with three presets + 2D pendant fallback |
| Tests | Component + Storybook; bundle increment < 60 kB gz |
| Authority | UI only |
| DoD | `frameloop="never"` after first frame; HDRI lazy-loaded |

### Slice 7c — Trophy-Lift Cutscene

| Field | Value |
|---|---|
| Goal | Pokal-Heben Cutscene plays on `RogueliteRunCompletedEvent` |
| Contexts | Match (event), Notification |
| Vault | [[../20-Features/feature-3d-presentation-layer]] (Slice 7c criteria) |
| UI | `<TrophyLiftCutscene>` skippable; 2D pokal card on Floor |
| Tests | Unit (`scene-mapper/match-trophy-lift`), Storybook isolated playback, e2e: skip path |
| Authority | Reads `MatchResolved` + run-complete event from server-confirmed state |
| DoD | Skippable; 2D fallback works |

### Slice 7d — Walkout Cutscene (optional)

Decide before starting whether ROI is there given asset cost. Same
skippable + 2D-fallback rules as 7c.
## Related

- [[../00-Index/MVP-Scope]]
- [[../20-Features/feature-roguelite-mvp-first-playable]]
- [[../50-Game-Design/GD-0017-mvp-scope-and-mode-sequencing]]
- [[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
- [[hybrid-online-pwa-strategy]]
