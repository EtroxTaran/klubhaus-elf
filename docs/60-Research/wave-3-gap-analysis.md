---
title: Wave 3 Gap Analysis and Execution Backlog
status: proposal
tags: [research, planning, gap-analysis, wave-3, backlog]
created: 2026-05-16
updated: 2026-05-16
type: research-backlog
binding: false
supersedes: [[research-wave-2-gaps]]
related: [[00-summary]], [[../00-Index/Current-State]], [[../00-Index/Research-Map]], [[../00-Index/Decision-Log]]
---

# Wave 3 Gap Analysis and Execution Backlog

> This is the **plan-of-record** for completing the project's starting
> documentation and architecture. After Wave 1 (competitor + IP +
> PWA-offline research) and Wave 2 (game design + bounded contexts + 7
> proposed ADRs) the vault has a strong product/design layer, but most
> architecture, implementation, security, ops and product-business
> documentation is still stub-level. Wave 3 catalogues every remaining
> gap, prioritises it P0-P3 and defines the per-gap workflow.

## 1. Why this exists

The vault's purpose is to be **durable project memory**
([[../90-Meta/vault-governance]]). A 5-line stub ADR or a 1-sentence
arc42 chapter cannot drive implementation. Wave 3 closes the gap between
"we made a decision" and "an agent can implement it from the vault
alone".

Wave 3 also absorbs the 19 already-listed technical research items
([[research-wave-2-gaps]] R2-01..R2-19) under group **D** below, so we
have one backlog of record.

## 2. Methodology

Gaps were identified by auditing:

- Every accepted/draft ADR in [[../10-Architecture/09-Decisions/]].
- Every arc42 chapter under [[../10-Architecture/]].
- Every implementation note under [[../30-Implementation/]].
- The "Open questions" sections inside the 25 Wave-2 game-design notes
  under [[../50-Game-Design/]].
- The pre-existing R2-01..R2-19 backlog in [[research-wave-2-gaps]].
- The Project Goals + Glossary + Current-State indexes for missing
  product / business / operations content.

The result is **123 gap entries** across twelve groups (A-L). Each entry
follows a fixed template so it can be executed gap-by-gap without
re-opening this document.

## 3. How to read this document

Gap IDs are stable. Each ID maps to a single execution session (or a
small batch). When a gap is executed:

1. Read the entry below.
2. Run the listed Perplexity / Ref research.
3. Draft synthesis + the Q&A questions for Nico.
4. Get Nico's answers.
5. Write the listed output files.
6. Update [[../00-Index/Current-State]] and maps so future agents reach
   the new material.

When a gap is **done**, append "(done YYYY-MM-DD)" to its title and add
a "Done outputs" line listing the final vault paths.

## 4. Per-gap workflow (agent-led)

```mermaid
flowchart LR
    Pick["Pick next gap"] --> Research["Agent: Perplexity MCP research<br/>+ Ref docs for libraries"]
    Research --> Synth["Agent: draft synthesis +<br/>Q&A questions"]
    Synth --> QA["User: answer Q&A"]
    QA --> Docs["Agent: write final vault docs<br/>(synthesis + ADR/arc42/feature/etc.)"]
    Docs --> Promote["Agent: update Current-State + Maps + Decision-Log"]
    Promote --> Done["Mark gap done in this doc"]
    Done --> Pick
```

### Per-gap entry template (fixed)

Every entry below uses the following template:

- **Priority**: P0 / P1 / P2 / P3
- **Why now**: 1-2 lines explaining why this matters.
- **Scope**: 3-6 bullets describing what is in scope.
- **Research questions**: 3-6 questions to send to Perplexity / Ref.
- **Q&A questions for Nico**: 2-4 questions that need a product owner
  decision.
- **Output files**: vault paths the gap produces or updates.
- **Promotes / supersedes**: ADRs / notes that are promoted or
  superseded when the gap is done.
- **Dependencies**: other gap IDs that must complete first (if any).
- **Estimated effort**: S (≤ 1 session), M (1-2 sessions), L (multiple
  sessions).

## 5. Prioritisation legend

| Priority | Meaning |
|---|---|
| **P0 - Critical / Blocking** | Blocks an accepted ADR, a milestone start (M2-M8), or has a hard real-world deadline (legal / GDPR) |
| **P1 - High** | Unblocks a draft ADR rewrite or an arc42 chapter that future agents read for orientation |
| **P2 - Medium** | Improves clarity, reduces tech debt, expected before public beta |
| **P3 - Nice-to-have** | Post-MVP polish or operational maturity |

## 6. Gap catalogue

### A. ADR depth rewrites (Wave 1 stubs)

Rewrite each Wave-1 ADR from a 5-20 line stub to a full Decision Record:
**Context → Drivers → Options Considered → Decision → Consequences →
Compliance → Sources**.

#### A1. ADR-0001 Tech Stack — depth pass

- **Priority**: P1.
- **Why now**: [[../10-Architecture/09-Decisions/ADR-0001-tech-stack]] is 8 lines today. Every subsequent ADR references the stack but the trade-offs that pinned it are not documented.
- **Scope**: Rewrite the ADR with full context (offline-first PWA, IP-clean, agent-friendly CI), considered alternatives (Next.js, Remix, Astro, Phoenix LiveView, native Capacitor-first), decision, consequences per layer, compliance rules.
- **Research questions**: 2026 status of TanStack Start beta API stability; current shadcn/ui release model; SurrealDB 2.x stability + migration story; Biome 2.x parity vs Prettier; pnpm 10.x workspace patterns.
- **Q&A questions for Nico**: Lock TanStack Start as the SSR framework or keep a fallback? Pin SurrealDB version range? Allow Bun/Deno experiments or pnpm-only?
- **Output files**: rewrite [[../10-Architecture/09-Decisions/ADR-0001-tech-stack]] to `status: accepted`.
- **Promotes / supersedes**: promotes itself from `draft` to `accepted`.
- **Dependencies**: none.
- **Estimated effort**: M.

#### A2. ADR-0002 Offline-first — depth pass (done 2026-05-16)

- **Priority**: P0.
- **Why now**: Drove every save / sync decision but only 12 lines.
- **Q&A outcome (2026-05-16)** — Perplexity research + Nico locked six decisions in addition to the upstream locks from B2 / D8 / A4 / A5 / B4:
  - **SW tooling**: `vite-plugin-pwa` with `injectManifest` (custom SW + Workbox 7 plugins).
  - **Update strategy**: **hybrid smart** — auto-`skipWaiting` if no in-progress state (match in progress, draft transfer, active watch-party); `workbox-window` prompt otherwise.
  - **Outbox replay triggers**: cross-browser primary (startup + `online` event + `visibilitychange`) + Chromium-only `BackgroundSyncPlugin` as optional accelerator + post-MVP Web Push sync-hint for installed PWAs.
  - **Storage budget**: soft cap ~300 MB; warn at 70% of `navigator.storage.estimate().quota`; encourage export of saves > 6 months old; `navigator.storage.persist()` on Chromium/Firefox; iOS treated as fragile (no-op).
  - **Install UX**: never on first load; surface after first match completed OR first save created + ≥ 3 sessions; dismissible card with 7-day snooze; quota-warning override copy; manifest + icons spec'd; iOS Share→Add-to-Home-Screen guide for Safari.
  - **Outbox visibility**: dedicated Sync/Activity view + nav badge + `setAppBadge()` + non-modal banner on hard-reject + Recreate shortcut; transient errors retry with `0/10s/30s/2min/5min` exponential backoff cap at 7; hard-reject business errors never auto-retry; per-`rejected_with_reason` copy table.
- **Output files**: rewrote [[../10-Architecture/09-Decisions/ADR-0002-offline-first]] from 12-line stub to full Decision Record (8 decision rules + capability matrix + Workbox config + manifest + Compliance + CI enforcement, ~14 KB).
- **Done outputs**: [[../10-Architecture/09-Decisions/ADR-0002-offline-first]] (accepted).
- **Promotes / supersedes**: ADR-0002 promoted from `draft` to `accepted`.
- **Dependencies**: D8 (done), B2 (done), A4 (done), A5 (done), B4 (done). D11 (telemetry/privacy) still open.
- **Estimated effort**: M (actual: M).

#### A3. ADR-0003 Match Engine — depth pass (done 2026-05-16)

- **Priority**: P0.
- **Why now**: Match engine is the heart of the product; current ADR was 10 lines.
- **Q&A outcome (2026-05-16)** — Perplexity research + Nico locked three remaining decisions on top of the D1 + D8 + A4 + B2 lockdowns:
  - **Formation zone weights authoring**: TS literal in `packages/match-engine/src/data/formations/` as canonical source-of-truth + JSON-based community override packs (per ADR-0016).
  - **Set-piece routines**: hybrid delivered incrementally - MVP = canonical TS-literal library (~15-25 routines) exposed as dropdowns at all UI tiers; Phase 2 = per-club editor for Expert tier with replay-embedded routine definitions; community packs add library-grade routines.
  - **Routine + formation ID naming**: namespaced slug pattern (`category/name` for core, `mod.<pack>.category/name` for community, `club:<id>.<slug>` for per-club, `n-n-n` for formations, short uppercase for roles). Stable IDs forever; semantic changes = new ID + compatibility stub.
- **Output files**: rewrote [[../10-Architecture/09-Decisions/ADR-0003-match-engine]] from 10-line stub to full Decision Record (9 decision rules + package layout + public API + Consequences + Compliance + CI enforcement, ~12 KB).
- **Done outputs**: [[../10-Architecture/09-Decisions/ADR-0003-match-engine]] (accepted).
- **Promotes / supersedes**: ADR-0003 promoted from `draft` to `accepted`.
- **Dependencies**: D1 (done), D8 (done), A4 (done), B2 (done), A5 (done), A2 (done), B7/ADR-0016 (proposed).
- **Estimated effort**: S (actual: S).

#### A4. ADR-0004 Data Model — depth pass (done 2026-05-16)

- **Priority**: P0.
- **Why now**: Every bounded context needs a schema. Current ADR was 11 lines; schemas live nowhere yet.
- **Q&A outcome (2026-05-16)** — Perplexity research + Nico locked all four open questions:
  - **Save quotas**: soft UX limit (10 active) + archive flow + server-side hard cap (50 total per user). No tiering at MVP.
  - **Schema generator**: custom TS-first generator in `packages/db-schema` emits `.surql` + Zod + TS types. CI gate `pnpm db:generate && git diff --exit-code` blocks drift.
  - **Cloud-sync format (Phase 2)**: hybrid — initial encrypted full snapshot per device + encrypted incremental ops + periodic checkpoints (every 100 deltas or 5 MB). Save-level content key wrapped per member for shared MP saves.
  - **Women's football additivity**: structured `gender_eligibility` set on player + `gender_restriction` enum on competition + season calendar lives on competition (not gender). Supports women's, men's, mixed, open, junior open and future non-binary edge cases without migration redesign.
- **Output files**: rewrote [[../10-Architecture/09-Decisions/ADR-0004-data-model]] from 11-line stub to full Decision Record (9 decision rules + Consequences + Compliance + CI enforcement).
- **Done outputs**: [[../10-Architecture/09-Decisions/ADR-0004-data-model]] (accepted; 8 KB of binding decisions covering storage topology, schema strategy, generator, relationships, numeric representation, save lifecycle, identity model, cross-context coordination, forward additivity).
- **Promotes / supersedes**: ADR-0004 promoted from `draft` to `accepted`.
- **Dependencies**: D14 (done), D8 (done), B2 (done), B4 (done). D2 (R2-02 procedural generators) and D13 (R2-13 women's football) remain as separate gaps but the schema is now additive-safe for them.
- **Estimated effort**: M (actual: M).

#### A5. ADR-0005 Save Format — depth pass (done 2026-05-16)

- **Priority**: P0.
- **Why now**: Saves are versioned but the format and migration policy were unspecified beyond 17 lines.
- **Q&A outcome (2026-05-16)** — Perplexity research + Nico locked the two remaining open questions:
  - **Export model**: two explicit export modes - **'Device backup'** (account-secret + device-salt key, auto-restores when signed in) + **'Portable export'** (user-supplied passphrase + per-export salt, shareable, "forgot = lost" UX). Matches Bitwarden / 1Password / Obsidian Sync / Standard Notes industry norms.
  - **KDF**: PBKDF2-SHA256, **600 000 iterations** (OWASP 2026 minimum), 32-byte random salt per export. Web Crypto native, no bundle cost. Argon2id rejected (~30-50 KB WASM bundle for marginal gain).
  - **Compression**: `CompressionStream('gzip')` only - native cross-browser (Chromium/WebKit/Firefox), zero bundle, Web-Worker compatible, ~70-80% reduction. Pipeline: `JSON → gzip → AES-GCM-encrypt`. Envelope carries `compression: 'gzip'` for future swap.
  - **Versioning**: three independent version fields - `envelopeVersion` (envelope format), `saveVersion` (payload shape), `engineVersion` (per D8 deterministic replay). Phased rename pattern per A4 §6.3; old-engine dynamic-import for legacy save replay.
- **Output files**: rewrote [[../10-Architecture/09-Decisions/ADR-0005-save-format]] from 17-line stub to full Decision Record (11 decision rules + restore flowcharts + Consequences + Compliance + CI enforcement).
- **Done outputs**: [[../10-Architecture/09-Decisions/ADR-0005-save-format]] (accepted; ~12 KB binding decisions covering envelope schema, encryption with AAD-bound header, KDF detail, compression-then-encrypt pipeline, RNG state snapshot per D8, three-version migration model, restore + import flows).
- **Promotes / supersedes**: ADR-0005 promoted from `draft` to `accepted`.
- **Dependencies**: D8 (done), B2 (done), A4 (done).
- **Estimated effort**: S (actual: S).

#### A6. ADR-0006 i18n — depth pass

- **Priority**: P1.
- **Why now**: i18n choice is locked but copy strategy, namespace policy, tone guide are missing.
- **Scope**: i18next config, namespace strategy (per route group), lazy-load patterns under TanStack Start, ICU MessageFormat, de-DE primary tone vs en-GB fallback, Intl API usage.
- **Research questions**: i18next vs FormatJS vs lingui bundle sizes in 2026; TanStack Start SSR + lazy translations; football vocabulary tone references (Anstoss humour vs FM dry register).
- **Q&A questions for Nico**: Default tone for de-DE (Anstoss tabloid vs dry)? Translation workflow (in-house, community, or contracted)? RTL languages in scope?
- **Output files**: rewrite [[../10-Architecture/09-Decisions/ADR-0006-i18n]]; new [[../30-Implementation/i18n-and-tone-guide]].
- **Promotes / supersedes**: promotes ADR-0006 to `accepted`.
- **Dependencies**: D10 (R2-10), D15 (R2-15).
- **Estimated effort**: M.

#### A7. ADR-0007 Naming Schema — depth pass

- **Priority**: P1.
- **Why now**: IP-clean is mission-critical and the current ADR is 11 lines.
- **Scope**: Document algorithmic name generation, denylist + bloom-filter pipeline, heraldic crest synthesiser, league + currency analogues, scenario pack import rules (community vs core).
- **Research questions**: Behind-the-Name CC BY-SA viral risk in build pipeline; Wikidata bloom filter size + FP rate; SVG heraldry generators (`svg.js`, `paper.js`, `@svgdotjs/svg.js`); recent IP cases (Manchester United v Sega 2020, Mishcon de Reya FM analysis).
- **Q&A questions for Nico**: Hard denylist (real club names + permutations) or also soft denylist (sound-alikes)? Scenario pack opt-in disclaimer wording? Crest style (heraldic vs modernist vs hybrid)?
- **Output files**: rewrite [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]]; new [[../30-Implementation/data-generators]] (per R2-02).
- **Promotes / supersedes**: promotes ADR-0007 to `accepted`.
- **Dependencies**: D2 (R2-02).
- **Estimated effort**: L.

#### A8. ADR-0008 Mobile-first UI — depth pass

- **Priority**: P1.
- **Why now**: The 3-tier progressive disclosure decision needs a concrete UI architecture.
- **Scope**: Document route inventory, navigation pattern (bottom-nav / drawer / hub-tile), shadcn/ui primitives in scope at MVP, design tokens, WCAG 2.2 AA commitments, touch targets, motion preferences.
- **Research questions**: TanStack Router file-based routing patterns at scale; bottom-nav vs drawer mobile FM patterns in 2026; shadcn/ui touch + a11y posture; WCAG 2.2 vs BITV 2.0 differences.
- **Q&A questions for Nico**: Bottom nav or hub-tile home? Dark mode at MVP or Phase 2? PWA install prompt UX?
- **Output files**: rewrite [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]]; new [[../30-Implementation/mobile-ux-ia-a11y]] (per R2-07).
- **Promotes / supersedes**: promotes ADR-0008 to `accepted`.
- **Dependencies**: D3 (R2-03), D5 (R2-05), D7 (R2-07), D16 (R2-16), D17 (R2-17).
- **Estimated effort**: L.

#### A9. ADR-0009 Cursor Orchestration — depth pass

- **Priority**: P2.
- **Why now**: Operational rather than gameplay-critical; needs updating once analytics + telemetry decisions land.
- **Scope**: Document Cursor IDE + Cloud + CLI integration, hooks, Bugbot review gates, Linear linkage, MCP servers in use.
- **Research questions**: Cursor 2026 hook / MCP ecosystem updates; Bugbot review rules patterns; Linear MCP cleanup.
- **Q&A questions for Nico**: Any new MCP servers to enable (Datadog, Sentry, Slack)? Auto-merge policy for Cursor agents?
- **Output files**: rewrite [[../10-Architecture/09-Decisions/ADR-0009-cursor-orchestration]].
- **Promotes / supersedes**: promotes ADR-0009 to `accepted`.
- **Dependencies**: D11 (R2-11).
- **Estimated effort**: S.

### B. ADR promotion (Wave 2 proposed → accepted)

Each Wave-2 ADR is currently `proposed`. Promotion is a small per-ADR
session: re-read, refine if Nico asks, then flip status to `accepted` and
update [[../00-Index/Decision-Log]].

#### B1. Promote ADR-0010 Modular Monolith + DDD (done 2026-05-16)

- **Priority**: P0.
- **Why now**: Foundational architecture decision; everything else depends on bounded contexts being agreed.
- **Scope**: Read ADR with Nico, accept or refine bounded-context list, decide on `domain/` folder convention, accept.
- **Q&A questions for Nico**: Confirm 11 bounded contexts? Any context to split / merge?
- **Q&A outcome (2026-05-16)**:
  - All 11 contexts accepted as-is.
  - Strict storage isolation accepted (no cross-context table reads).
  - Nico raised the bar: **maximum service-architecture readiness** —
    deploy as monolith for MVP but design every context's contract as
    if it were a separate service. Service extraction must be a
    deployment change, not a refactor.
- **Output files**: ADR-0010 status flipped `proposed` → `accepted`; ADR title widened to "Service-ready Modular Monolith"; [[../10-Architecture/bounded-context-map]] revised with strict storage rule + service-extraction order; [[../00-Index/Decision-Log]] + [[../00-Index/Architecture-Map]] + [[../00-Index/Current-State]] updated.
- **Done outputs**: [[../10-Architecture/09-Decisions/ADR-0010-modular-monolith-ddd]] (accepted); [[../10-Architecture/bounded-context-map]] (status: current).
- **Dependencies**: none.
- **Estimated effort**: S (actual: S).

#### B2. Promote ADR-0011 Server-Authoritative Multiplayer (done 2026-05-16)

- **Priority**: P0.
- **Why now**: Trust model for multiplayer; required before any MP feature work.
- **Q&A questions for Nico**: Singleplayer locally authoritative (yes by default) - confirm. Are there hybrid scenarios (e.g. hotseat)?
- **Q&A outcome (2026-05-16)**:
  - **Hotseat**: local-authoritative on device; a hotseat save can later
    be **promoted** into an async MP group via a one-way handoff with
    server-side integrity validation. From the moment the save is
    accepted server-side, that club's truth lives on the server; the
    device save becomes read-only for the promoted club. No demote
    path.
  - **AI vs AI matches**: Perplexity research applied →
    **hybrid server-sim + on-demand re-simulation**. Server simulates
    every fixture with the full 2D engine. Human-involving matches
    store the full event log. AI vs AI matches store only
    `seed + lineups + tactics + summary` and re-simulate deterministically
    on demand when a watch-party or audit requests the full log.
  - **Save integrity**: saves are encrypted at rest with AES-GCM 256 via
    Web Crypto; key derivation PBKDF2 from account secret + device salt.
    Tampering breaks the save.
  - **Offline conflict**: hard-reject with `rejected_with_reason` + show
    new state. No auto-rebase at MVP.
- **Output files**: ADR-0011 flipped `proposed` → `accepted` with all four edge cases encoded; [[../10-Architecture/state-machines/match]] persistence extended with `engine_version`, `match_type`, and the AI vs AI seed-only storage policy; [[../00-Index/Decision-Log]] + [[../00-Index/Architecture-Map]] + [[../00-Index/Current-State]] updated; gap A5 + D12 entries updated with locked-from-B2 constraints.
- **Done outputs**: [[../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]] (accepted), [[../10-Architecture/state-machines/match]] (extended persistence schema).
- **Dependencies**: B1 (done).
- **Estimated effort**: S (actual: S; Perplexity research subroutine added ~15 min).

#### B3. Promote ADR-0012 Async Cadence Models

- **Priority**: P1.
- **Why now**: Defines the dual cadence (Fixed + Dynamic) that the league state machine respects.
- **Q&A questions for Nico**: Confirm default = Fixed Cadence. Confirm season-boundary switch policy.
- **Output files**: flip status; update Decision-Log.
- **Dependencies**: B1, B2.
- **Estimated effort**: S.

#### B4. Promote ADR-0013 Transactional Outbox (done 2026-05-16)

- **Priority**: P0.
- **Why now**: Domain-event reliability is foundational; many downstream features depend on it.
- **Q&A questions for Nico**: Outbox table in SurrealDB or separate queue (Redis Streams)? Retention policy?
- **Q&A outcome (2026-05-16)** - all five Perplexity-backed recommendations accepted:
  - **Storage backend**: SurrealDB outbox (atomic with state) + Redis Streams (rebuildable hot fan-out buffer with consumer groups). Fallback = pure SurrealDB outbox if Redis proves problematic.
  - **Retention**: tiered hot 60 days + monthly-partitioned cold archive forever. Outbox is the audit trail. ~10 GB/year storage on Hetzner.
  - **Idempotency**: UUIDv7 event IDs + separate correlation-id; consumer-side `consumer_event_offset` table; 60-day prune.
  - **Schema versioning**: JSON + Zod + forward-compat. Optional `schema_version` metadata. No Avro/Protobuf registry; no per-version handlers; no per-version event types.
  - **Backpressure**: time-based lag alerts (warning >1 min, critical >5 min) + count fallback (>10k). MVP = monitoring only; soft backpressure only if real overload observed.
- **Output files**: ADR-0013 flipped `proposed` → `accepted` with full pipeline + table schema + envelope + observability spec; gap E14 (jobs) gets full implementation scope; gap E1 (SurrealDB integration) gets outbox-table + claim-by-CAS pattern; gap F10 (audit trail) gets "outbox IS the audit trail" lock; gap D14 (SurrealDB schemas) gets outbox-table + `consumer_event_offset` + archive partition policy.
- **Done outputs**: [[../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]] (accepted).
- **Dependencies**: B1 (done).
- **Estimated effort**: S (actual: M; Perplexity research subroutine produced strong recommendations that warranted full documentation).

#### B5. Promote ADR-0014 State Machines

- **Priority**: P1.
- **Why now**: Locks the "no ad-hoc booleans" rule.
- **Q&A questions for Nico**: TypeScript discriminated-union or external library (XState)?
- **Output files**: flip status; update Decision-Log.
- **Dependencies**: B1.
- **Estimated effort**: S.

#### B6. Promote ADR-0015 Spectator Snapshot Streaming

- **Priority**: P2.
- **Why now**: Drives watch-party + replay architecture, but only matters once async multiplayer is implemented.
- **Q&A questions for Nico**: Confirm separate spectator service; default delay value (15 / 30 / 60 s)?
- **Output files**: flip status; update Decision-Log; informs E15.
- **Dependencies**: B2, B4.
- **Estimated effort**: S.

#### B7. Promote ADR-0016 Community Dataset Overrides

- **Priority**: P2.
- **Why now**: Editor design is locked but pack file format + manifest must be approved before implementation.
- **Q&A questions for Nico**: Pack distribution = file-only (no marketplace) - confirm. Optional signature scheme?
- **Output files**: flip status; update Decision-Log; informs E22 + F9.
- **Dependencies**: A4 (data model).
- **Estimated effort**: S.

### C. arc42 chapter completion

Each chapter currently 5-20 lines; expand to a real chapter with
subsections, diagrams and links to ADRs.

#### C1. arc42-01 Introduction — full chapter

- **Priority**: P1.
- **Scope**: Goals (offline-first manager, async friend leagues, fictional universe), stakeholders (player, manager / coach, sponsor, board, fans), out-of-scope, requirements overview, quality goals.
- **Research questions**: arc42 7.0 template conventions; sample managers' GDDs structure.
- **Q&A questions for Nico**: Primary stakeholder ranking? Any non-player stakeholders (publishers / press / community)?
- **Output files**: rewrite [[../10-Architecture/01-Introduction]].
- **Dependencies**: G1 (mission expansion).
- **Estimated effort**: M.

#### C2. arc42-02 Constraints — full chapter

- **Priority**: P1.
- **Scope**: Technical (offline-first PWA, TypeScript strict, pnpm, Biome, no real-IP), organisational (small team, agent-led), regulatory (GDPR, DMA / sport governance), legal (IP).
- **Research questions**: 2026 PWA store policies (Apple App Store, Google Play); GDPR + ePrivacy current state.
- **Q&A questions for Nico**: Any constraints to add (team size, budget, target launch date)?
- **Output files**: rewrite [[../10-Architecture/02-Constraints]].
- **Dependencies**: F6 (GDPR).
- **Estimated effort**: M.

#### C3. arc42-03 Context — full chapter

- **Priority**: P1.
- **Scope**: Business context (player, league host, community modder, sponsor for press kit), technical context (client PWA, server functions, SurrealDB, OS push services, optional Discord webhooks).
- **Q&A questions for Nico**: Any third-party integrations to declare now (e.g. Discord, Twitch, paid analytics)?
- **Output files**: rewrite [[../10-Architecture/03-Context]] with mermaid context diagrams.
- **Estimated effort**: M.

#### C4. arc42-04 Solution Strategy — full chapter

- **Priority**: P1.
- **Scope**: Top-level decisions table (modular monolith / DDD / offline-first / server-authoritative MP / progressive disclosure UI), trade-offs, ADR pointers.
- **Output files**: rewrite [[../10-Architecture/04-Solution-Strategy]].
- **Dependencies**: B1-B7.
- **Estimated effort**: M.

#### C5. arc42-07 Deployment — full chapter

- **Priority**: P0.
- **Why now**: Need a clear deployment topology before M2 starts producing artifacts.
- **Scope**: Environments (dev / staging / prod), Dokploy on Hetzner setup, secrets (sops + age + direnv), CI/CD pipeline, container registry, runtime workers (match worker, scheduler), zero-downtime deploy.
- **Research questions**: Dokploy 2026 features; sops + age workflow in CI; Workbox build integration with Vite + TanStack Start.
- **Q&A questions for Nico**: Number of envs (dev only? + staging?). Any non-Hetzner targets (Vercel preview, Cloudflare)? Native build pipeline (post-MVP)?
- **Output files**: rewrite [[../10-Architecture/07-Deployment]]; update [[../30-Implementation/deployment-dokploy]].
- **Dependencies**: E10 (CI/CD).
- **Estimated effort**: L.

#### C6. arc42-08 Crosscutting Concerns — full chapter

- **Priority**: P1.
- **Scope**: Logging, errors, security baseline, accessibility (WCAG 2.2 AA / BITV 2.0), performance budgets, observability, PWA update strategy, internationalisation.
- **Output files**: rewrite [[../10-Architecture/08-Crosscutting]].
- **Dependencies**: F1 (threat model), F11 (secrets).
- **Done 2026-05-17**: [[../10-Architecture/08-Crosscutting]] rewritten with ADR-0017 logging/observability rules, error taxonomy, telemetry privacy links, metrics/alerts, PWA/offline constraints and security baseline. F1/F11 can still deepen threat-model and secrets specifics later.
- **Done outputs**: [[../10-Architecture/08-Crosscutting]], [[../10-Architecture/09-Decisions/ADR-0017-observability-logging]].
- **Estimated effort**: L.

#### C7. arc42-10 Quality — full chapter

- **Priority**: P1.
- **Scope**: Quality goals (offline reliability, save durability, MP fairness, accessibility, performance, IP cleanliness), quality scenarios per goal, metrics, gates.
- **Output files**: rewrite [[../10-Architecture/10-Quality]].
- **Dependencies**: E11 (test strategy), D9 (R2-09 perf).
- **Estimated effort**: M.

#### C8. arc42-11 Risks — full chapter

- **Priority**: P1.
- **Scope**: Full risk register: technical (TanStack Start beta, SW eviction), legal (IP, GDPR), product (MP balance, casual/expert tension), operational (agent reliability).
- **Output files**: rewrite [[../10-Architecture/11-Risks]].
- **Dependencies**: D18 (R2-18 risk register research).
- **Estimated effort**: M.

### D. Technical research (R2-01..R2-19)

Each entry below corresponds 1:1 to an R2-xx item in
[[research-wave-2-gaps]]. The Wave 2 doc is preserved for traceability;
its IDs are mirrored here verbatim. Wave 3 adds explicit per-gap research
+ Q&A.

#### D1. R2-01 Deterministic match-engine simulation model (done 2026-05-16)

- **Priority**: P0.
- **Q&A outcome (2026-05-16)** — Perplexity research + Nico locked six decisions:
  - **Simulation model**: hybrid Markov + attribute rolls. Macro Markov chain over `{teamInPossession, zoneId, phase, pressureLevel}` decides event type + target zone; micro attribute-vs-attribute integer contests resolve outcomes.
  - **Tick granularity**: per-event with integer-second `simClock` jumps; event durations sampled from typed ranges (passes 3-10s, set pieces 20-40s, etc.); clamped at period boundaries; UI derives per-minute via `floor(sim_clock_s/60)`.
  - **Event schema**: required core (id, match_id, engine_version, sim_clock_s, duration_s, period, event_type, outcome, team_id, player_ids, start/end_pos in integer mm, start/end_zone_id) + typed optional payloads (Pass/Shot/Duel/Foul/Card/SetPiece/Sub/TacticalChange/Injury/Misc) + optional delta-encoded `tactical_context`.
  - **Formation interaction**: hybrid zone + role influence. Per-player zone influence weights (attacking/defending/pressing/support) from formation+role+duty+instructions+traits, aggregated to per-zone team scores; per-zone deltas modulate Markov transition probabilities + attribute roll thresholds. Recomputed at kickoff, tactical_change, substitution only.
  - **RNG separation**: strict - `MatchCoreRng` for physics (Markov + attribute rolls + duration sampling + injuries), `MatchAiRng` for in-match AI tactical decisions (subs, formation tweaks, time-wasting). Allows AI refactor without perturbing physical event sequences.
  - **Test pyramid**: full - unit (95% coverage of pure functions) + integration (single-possession sims, fast-check determinism + monotonic tactic properties) + 10 canonical golden replays (covering symmetric / low-block / press mismatch / width mismatch / overload / set-piece / cards / injuries / one-sided / 0-0 stalemate) + statistical envelope tests (1k-5k nightly matches with 0-0 rate 6-10%, avg goals 2.4-3.0, scores in 0-3 range 80-90%, formation effect directionality) + CI perf gate (≤ 50 ms hard / 30-40 ms soft alert).
- **Output files**: new [[match-engine-simulation-model]] research note (status: current, binding: true). 14 KB with locked simulation model, time model, event schema (~10 typed payloads), formation influence algorithm, test pyramid, three-phase implementation roadmap.
- **Done outputs**: [[match-engine-simulation-model]] (locked decisions ready to paste into A3 + E11 + E13 + I8).
- **Dependencies**: D8 (done), A4 (done).
- **Estimated effort**: L (actual: L).

#### D2. R2-02 Player & club generator algorithms (done 2026-05-17)

- **Priority**: P0.
- **Why now**: Fundamental for every downstream system (scouting, youth, transfer market, async-MP). Must lock IP-safe naming + procedural worldgen before any feature work can land. ADR-0007 had been a 10-line stub since Wave 1.
- **Q&A outcome (2026-05-17)** — Perplexity research (4 deep dives: name-gen algorithms + corpora + legal-safe sources, heraldic SVG crest grammar, club tier model + Country × Tier finance matrix + stadium / prestige formulas, player attribute taxonomy + generation pipeline + lazy-expansion strategy) plus comparative analysis across FM / FM Mobile / Anstoss random worlds / Hattrick / Top Eleven / OSM / SM24 / EA FC Career / Champ Man, plus 8-question Q&A with Nico:
  - **Locale list at MVP**: 7 Tier-1 buckets (DACH, British Isles, France, Spain, Italy, Low Countries, Lusophone). Tier-2 post-MVP: Nordic, Eastern Europe, Hispanic LATAM, Turkey, Asia (JP/KR/CN), Arabic, Africa (3 buckets).
  - **Name generation algorithm**: hybrid wordlist (Wikidata CC0 + national open-data) + phonotactic fallback. Per-locale composition rules at MVP: Spanish two-surname, Portuguese particles, Dutch tussenvoegsel, German "von" with low probability.
  - **Crest generation**: grammar-based hybrid (7 shields × 8 divisions × 10 region-biased palettes × 40-50 charges × 4 borders × 3 banners → ~5 M unique crests). Pure TS → SVG (no WebGL, no 3D per D9). Lazy generation: `CrestDesign` struct (~6 bytes) stored at world-gen; SVG rendered + cached on first display.
  - **Crest icon source**: custom ~40-icon library inlined as TS path strings, restyled from Game-Icons.net (CC-BY 3.0 with attribution) + Heroicons / Tabler (MIT).
  - **City naming**: "real-region + fictional city" policy. GeoNames CC-BY 4.0 for real regions; fictional cities via phonotactic recombination of region-typical syllables; Bloom-filter rejection of real GeoNames cities.
  - **Club tier model**: 5 tiers + 10-country starting Country × Tier matrix (DE / EN / ES / IT / FR / PT / NL / BR / AR / JP); log-normal money; prestige formula clamped 0-100.
  - **Player attribute schema**: 16 visible (7 Technical + 5 Mental + 4 Physical) + 4 GK-only extras + 8 hidden meta on 1-20 scale. FM Mobile-style simplification.
  - **Player generation**: hybrid archetype-first + CA budget Dirichlet allocator across ~50 archetypes (sweeper keeper, ball-playing CB, inverted FB, deep-lying playmaker, box-to-box CM, inside forward, poacher, target man, etc.). **Lazy expansion** for Tier C players (~85-90 % of total) — store 12-byte compact profile; expand to full attributes on demand. Big perf + storage trick.
- **Locked from D8 §2.3**: adds **RNG stream #9 `GeneratorRng`** with hierarchical sub-labels; label-derived seeding means no existing replay is invalidated (D8 future-proof property exercised for the first time).
- **Locked from D9**: fits ≤ 8 s Large-world genesis budget on Snapdragon 695 via lazy expansion + dedicated Web Worker. IndexedDB delta ≤ 25 MB for Large world.
- **Locked from ADR-0004**: SCHEMAFULL `player` + `club` schemas already in place; D2 fills generation logic only, no schema changes needed.
- **Best-of-competitors techniques adopted**: wordlist-based name gen with cultural rules (FM, FIFA, Hattrick); CA/PA split with hidden potential (FM newgens); archetype-first player generation (FM's role+duty model); lazy expansion (Hattrick server-side, adapted to client-side via determinism); Country × Tier finance matrix (FM real-world data + Anstoss random worlds); log-normal money distributions (real economics); hierarchical seed derivation (modern PRNG practice).
- **Our unique style**: Wikidata CC0 + GeoNames CC-BY 4.0 IP-safe corpus (legal-cleanliness as marketing differentiator); region-biased crest grammar with cultural priors (nobody else does this well); procedural crests as a polish point rather than afterthought; lazy expansion enables client-side feasibility without burning IndexedDB.
- **Output files**: wrote [[data-generators]] (new, 15-section binding research note with full Country × Tier matrix, ~50-archetype library, complete pipeline spec). Promoted [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]] from 10-line stub to full Decision Record (13 decision rules + CI enforcement + IP compliance contract). Updated [[determinism-and-replay]] §2.2 (added stream #9) + §2.3 (exercised future-proof property).
- **Promotes / supersedes**: ADR-0007 promoted from `draft` to `accepted`; [[data-generators]] is `current binding`. Future R2 / I-tier items (D13 women's football, D15 narrative content, I4 wonderkid tagging) build on this foundation.
- **Dependencies**: D8 (done), D9 (done), A4 (done), A5 (done), ADR-0007 (was draft).
- **Estimated effort**: L (actual: L).

#### D3. R2-03 Tactics & formation depth on mobile (done 2026-05-17)

- **Priority**: P1.
- **Why now**: D4 (AI manager behaviour) just locked what AI opponents do; D3 is the user-facing counterpart — what the user does to control their own team. Tactics is the single most-played UI of a manager game. Pre-existing `tactics-system.md` GDD was `draft` with attribute-schema mismatch to D2.
- **Q&A outcome (2026-05-17)** — Perplexity research (4 deep dives: mobile-first tactics UX, formation taxonomy + role catalogue + instructions, tactical familiarity + opposition tactics + touchline shouts, competitor analysis) + 8-question Q&A with Nico:
  - **Formations**: **20** total (Nico chose maximum depth) - core 8 (4-4-2 / 4-3-3 / 4-2-3-1 / 3-5-2 / 4-1-2-1-2 Diamond / 5-3-2 / 3-4-3 / 4-5-1) + advanced 12 (4-1-4-1 / 4-2-2-2 / 4-3-2-1 Christmas Tree / 3-4-1-2 / 3-4-2-1 / 4-2-3-1 Wide / 5-4-1 / 4-1-2-3 / 3-3-3-1 / 5-2-3 / 4-4-2 Asymmetric / 4-3-3 DM Pivot).
  - **Roles**: **50** total across 8 position groups (Nico chose FM PC depth) - GK 3 / CB 5 / FB-WB 6 / DM 5 / CM 7 / AMC 6 / Wide-W 7 / ST 8 + 3 cross-position alternates.
  - **Instructions per tier**: 0/6/18 player + 1/5/8 team. Standard player 6 = high-impact; Expert player 18 in 4 groups. Standard team 5 = Mentality + Pressing + Defensive Line + Width + Tempo; Expert team 8 adds Build-up Style + Time-Wasting + Focus of Play.
  - **Mentality**: 5 visible bands + 7 internal steps.
  - **Phase logic**: Standard global only; Expert light per-phase overrides (4 phases × 2-4 overrides).
  - **Familiarity**: full FM-style with squad-continuity factor + new-manager Similarity (Nico's accepted). Single bar 0-100; growth +4/+2/0 training × +3/match × continuity bonus × weekly cap 8; decay 2/wk floor 20; SwitchModifier 1.0-0.6; piecewise penalty curve (0→0.4×, 80→1.0×, 100→1.04×); ContinuityMatchFactor 1.0-0.80; new-manager Similarity (0.5+0.5×Sim) partial carryover.
  - **Tactic slots + presets**: 2/3/3 slots with familiarity + 0/10/50 saved presets per tier.
  - **Opposition tactics**: **3-layer template system** (Nico's refinement) - 8 archetypes + ~25-30 sub-archetype variants (3-4 per main archetype with distinct philosophies) + manager-signature templates per D4's 10 AI archetypes + emergent club character (clubs accumulate historic counter-template fingerprint over manager history). Nobody else does this.
  - **Touchline shouts**: **3 universal** at all tiers (no tier gating, Nico's refinement) - Encourage / Demand More / All-Out Attack. 10-min cooldown, 5-10 min duration, multipliers on mentality/pressing/tempo/discipline. Future shouts (Focus-Regroup, Time-Waste, Tackle Harder) deferred post-MVP.
  - **Tactical predictability penalty**: up to 5 % offensive-effectiveness reduction for 100 % single-tactic usage; counter-templates cancel half. Ties to D4 arms race.
  - **Tactic preset sharing**: URL-encoded share codes per ADR-0016 (TACTIC-<hash>-<base64-LZ-JSON>); local-only at MVP.
- **Locked from D2**: 16+4+8 attribute schema on 1-20 scale (replaces tactics-system.md GDD's incorrect "10+8+10+5 on 1-10" claim as a mechanical fix).
- **Locked from A3**: 20-formation zone-weight authoring (~500-650 unique entries with DRY pattern reuse; fits 80-100 KB bundle).
- **Locked from D4**: 10 AI archetypes drive Layer-3 manager-signature templates.
- **Locked from D9**: touch target 44 × 44 px enforced; per-tier UI complexity matches Quick/Standard/Expert progressive disclosure.
- **Best-of-competitors techniques adopted**: single familiarity bar (FM Mobile); 3 registered tactic slots (FM PC); tap-to-place editing (EA FC Mobile, FM Mobile); bottom-sheet role pickers (modern mobile UI); preset-first formation library (Top Eleven, FM Mobile); segmented controls (Hattrick, OSM); URL share codes (FM community); touchline shouts as morale modifiers (FM).
- **Our unique style**: 3 in-app tiers user can switch (rare; FM has separate Touch vs PC products); touch-first interaction model (better than FM Mobile's drag-drop port); explicit ContinuityMatchFactor + new-manager Similarity (FM has familiarity but mechanics are opaque); 3-layer opposition template system with emergent club character (no competitor surfaces tactical fingerprint per club); tactical predictability penalty; deterministic + replay-stable for global challenge seasons.
- **Output files**: wrote [[tactics-and-formations]] (new, 15-section binding research note: 20-formation taxonomy + 50-role catalogue + per-tier instructions + familiarity formulas + 3-layer opposition system + mobile UX patterns + WCAG accessibility); promoted [[../50-Game-Design/tactics-system]] from `draft` to `approved` with reconciled D2 attribute schema; cross-linked from [[../50-Game-Design/match-engine]] + [[../50-Game-Design/set-pieces]] + [[../50-Game-Design/progressive-disclosure-ui]].
- **Promotes / supersedes**: locks [[tactics-and-formations]] as `current binding`; promotes [[../50-Game-Design/tactics-system]] from `draft` to `approved`; closes I6 (mentality slider vs bands - locked as 5 visible bands + 7 internal steps) effectively; opens up A8 follow-up (ADR-0008 Mobile-first UI needs to absorb this note's per-tier exposure tables + touch-target rules).
- **Dependencies**: D2 (done), D4 (done), A3 (done), D9 (done), D8 (done).
- **Estimated effort**: M (actual: M).
- **Estimated effort**: M.

#### D4. R2-04 AI manager / opponent behaviour (done 2026-05-17)

- **Priority**: P1.
- **Why now**: Without AI opponents, the match engine has nothing to do. After A3 (match engine) + D2 (data generators) + D9 (perf budgets), AI behaviour was the next P0-equivalent piece — the world has players + clubs + a sim engine but no opponents to populate it.
- **Q&A outcome (2026-05-17)** — Perplexity research (5 deep dives: AI architecture comparison, in-match decisions, out-of-match decisions, competitor analysis, difficulty + world drift + dynasty) plus 8-question Q&A with Nico:
  - **AI architecture**: utility AI core + light FSM situation classifier + heuristic constraints (industry consensus for 2026). Rejected behaviour trees (wrong abstraction), GOAP/HTN (too heavy), ML (bundle bloat + tuning friction), pure rules (brittle).
  - **Personality system**: 8 primary continuous traits [0,1] (`tacticalAttacking`, `pressingPreference`, `youthTrust`, `starPreference`, `transferAggressiveness`, `bargainSeeking`, `riskTaking`, `tinkering`) + 3 derived (`loyalty`, `fitnessFocus`, `wageDiscipline`). Personality drifts ±0.2 over career.
  - **10 manager archetypes** at MVP: Park-the-Bus Pragmatist, Counter-Attacking Reactive, High-Pressing Aggressor, Possession Maestro, Youth Developer, Galáctico Collector, Moneyball Director, Tinkerman, Conservative Stabilizer, Chaos Motivator.
  - **4 difficulty modes** (Easy / Normal / Hard / Sim) — FM-style "constraints + AI optimisation" approach. No AI stat cheats on Normal/Hard/Sim; only Easy gets minor user help. 20-knob per-tier table.
  - **World drift**: moderate explicit mechanics — wage inflation tied to success; progressive FFP; talent diffusion (40 % elite regens spawn at non-elite clubs); tactical arms race with opposition memory; board expectation escalation +1 tier per overperformance season.
  - **Structural events**: Rising Rival every ~5 in-game years (mid-table club gets New Investor + funds boost) + Giant Collapse every ~10 years (top club enters financial crisis, fire-sale).
  - **AI career arcs** full at MVP: job churn 10-20 % / season, retirement at 60-70 via Normal(67, 4), legendary detection (3+ titles or 2+ continentals), rival tracking (user's primary AI rival follows their manager career, not just current club).
  - **Late-game content** phased: 12 dynasty achievements + arms race + expectation escalation at MVP; national team / Hall of Fame / legacy mode post-MVP.
- **Locked from D8**: uses pre-allocated `WorldAiMgmtRng` (stream #2) + `MatchAiRng` (stream #4) with hierarchical sub-labels. New AI sub-systems add labels under existing streams — no schema changes (per D8 §2.3 future-proof property).
- **Locked from A3**: AI lives outside `packages/match-engine/` but invokes via `simulate(input)`; in-match AI runs in the same Web Worker as the match engine.
- **Locked from ADR-0011**: AI-vs-AI matches use seed-only storage + on-demand re-sim via same AI code path. Hot-seat → async-MP promotion uses same `packages/ai-manager/` on server post-MVP.
- **Locked from D2**: AI managers generated per `generator:manager:<id>` sub-label with archetype + jitter; lazy expansion of Tier C managers (compact 16-byte profile) per same pattern.
- **Locked from D9**: out-of-match ~5-6 ms / club / week (700 clubs in 3.5-4.2 s); in-match ~25 ms / match. Bundle target 60-80 KB gzipped.
- **Locked from bounded-context-map**: AI decisions split across League (structural events) + Club (per-club personality + decisions) + Transfer (market mechanics) contexts.
- **Best-of-competitors techniques adopted**: utility AI as core (FM essentially; 4X games); manager personality vector (Anstoss 3 Erni Buntspecht; FM subtler); trigger-based in-match decisions (FM Touchline Tablet; FIFA Career); per-role squad gap analysis (FM); multi-club bid escalation (FM gold standard); job-security as continuous value (FM, Anstoss); wage inflation tied to success (real-world football, FM); progressive FFP (UEFA/DFL).
- **Our unique style**: determinism + replay-stable AI (no competitor guarantees; enables global challenge seasons); per-manager difficulty in shared async-MP worlds (no competitor has this); roguelite mode as built-in dynasty refresh (solves late-game staleness natively); lazy expansion of AI managers; Web Worker-batched weekly tick fitting Snapdragon 695 (desktop competitors take 30-60 s for similar work, we fit ~5 s in a PWA).
- **Output files**: wrote [[ai-manager-behaviour]] (new, 15-section comprehensive research note: AI architecture + personality system + archetype library + out-of-match per-system decisions + in-match decision pipeline + 4-tier difficulty model with 20-knob table + world drift mechanics + AI career arcs + late-game content + determinism + perf budget). Cross-linked from [[../50-Game-Design/tactics-system]], [[../50-Game-Design/mode-manage-a-club-career]], [[../10-Architecture/bounded-context-map]].
- **Promotes / supersedes**: locks [[ai-manager-behaviour]] as `current binding`; supersedes "AI manager decisions ... detailed in R2-04" pointer in bounded-context-map; resolves the open question from D8 about who consumes `WorldAiMgmtRng` + `MatchAiRng`.
- **Dependencies**: D8 (done), A3 (done), B2/ADR-0011 (done), D2 (done), D9 (done), bounded-context-map (current).
- **Estimated effort**: L (actual: L).

#### D5. R2-05 Strategic onboarding (done 2026-05-17)

- **Priority**: P1.
- **Why now**: After locking D2 + D3 + D4 (clubs, players, AI managers, tactics with 20 formations / 50 roles / 18 instructions / 3-layer opposition), the depth becomes a barrier without strong onboarding. Without D5 the simulation is impressive but unapproachable.
- **Q&A outcome (2026-05-17)** — Perplexity research (3 deep dives: FTUE patterns + retention benchmarks + competitor comparison, inbox-as-narrative tutorial + sender voice cards + 12-message arc, feed-cards + Assistant UX + accessibility) + 8-question Q&A with Nico:
  - **FTUE 60-second flow** (Nico's refinement): single experience question PLUS visible "Advanced setup" escape hatch. Default fast path = 4 steps (experience → mode → club → home with first tutorial card); Advanced path = full 5-screen wizard for power users.
  - **Mode picker upfront** (Nico's choice): both Manage-a-Club Career + Create-a-Club Roguelite available from day 0 as launch tiles. Veterans head straight to Roguelite; new players default to Career.
  - **12-message first-season inbox tutorial arc** over 4 in-game weeks; 10-sender cast (4 core: Assistant ~50% / Chairman 15% / DoF 20% / Head Scout 10%; 6 supporting: Head of Youth / Player Agent / Journalist / Sponsors / Family / Anonymous Tips); per-sender voice cards.
  - **Configurable named Assistant Manager** ("Alex" default + 3-5 portrait presets + "No portrait" accessibility option). "Ask Assistant" sticky FAB on key screens. Voice consistent across inbox + coach marks + match commentary + Ask Assistant button.
  - **Feed-card daily action queue** as Home dashboard primary UI (Nico's choice over inbox-primary): 3-5 priority cards per in-game day; Gmail-style swipe semantics (right=complete/open, left=snooze+undo); priority algorithm time-pressure + impact-type + player-behaviour.
  - **Per-difficulty assistant intensity auto-scaling** with user override (Settings → Assistance: Full / Standard / Minimal + Allow auto-handle minor tasks on Easy/Normal).
  - **"While you were away" recap** auto-shown after 7+ in-game days OR 14+ real days absent.
  - **Veteran skip with safety net** (micro-tooltips + Settings reset + auto-detection of struggle).
- **Locked from D9**: PWA install prompt timing (after sessions ≥ 3 + first success + 20 min total playtime); UI tier auto-mapping; touch targets 44 × 44 px.
- **Locked from D4**: 4 difficulty modes + AI archetypes → assistant intensity scaling.
- **Locked from D3**: 3 UI tiers + per-tier tactics complexity → tutorial depth scaling + Quick tier's 5 starter presets (Solid 4-4-2 / Counter-Attack 4-3-3 / High-Pressing 4-2-3-1 / Park the Bus 5-3-2 / Balanced 4-3-3) become the "Choose Playstyle" picker after FTUE.
- **Locked from D2**: world-size presets visible only in Advanced setup wizard; recommended-club logic uses D2's procedural club generation.
- **Locked from Wave 1**: [[club-boss-analysis]] inbox-as-narrative pattern + [[anstoss-series-deep-dive]] sender voice references.
- **Best-of-competitors techniques adopted**: single experience-question FTUE (Top Eleven); recommended-club default (Top Eleven, OSM); inbox-as-narrative tutorial (Anstoss 1-3, Club Boss); named Assistant Manager (FM Mobile, EA FC); coach marks max 2-3 per screen (modern mobile games); feed-card daily action queue (Top Eleven, EA FC objectives); "While you were away" recap (modern returning-user UX); PWA install after first success + 3 sessions (Web.dev best practice); per-difficulty assistant intensity (FM implicit, our explicit); mode unlock progression (Career-first default per Nico).
- **Our unique style**: 3-in-1 silent tier auto-mapping (single question → UI tier + difficulty + recommended-club tier; no competitor does this); Anstoss-style 10-sender inbox cast on mobile (PC-only previously); Gmail-inspired feed-card swipe semantics (novel for genre); explicit soft-transition message ending tutorial at week 4 (no competitor handles tutorial→narrative handover gracefully); mode picker upfront with both available day 0 (Nico's choice; veterans rewarded with agency); per-difficulty assistant intensity + user override toggle (best of FM manual help + casual mobile proactive coach); deterministic + offline-first onboarding works fully offline + PWA prompt timed to first success not session 1.
- **Output files**: wrote [[onboarding-strategy]] (new, 18-section binding research note: full FTUE flow + New Save wizard + 12-message tutorial arc with EN+DE subjects + 10-sender voice cards + Assistant Manager UX + feed-card priority algorithm + tutorial overlay patterns + returning-user recap + accessibility paths + PWA install + achievement celebrations + IndexedDB schema + perf budget + sources). Created [[../50-Game-Design/onboarding-and-tutorial]] (new `approved` GDD; 14 sections). Cross-linked from [[../50-Game-Design/mode-manage-a-club-career]] + [[../50-Game-Design/mode-create-a-club-roguelite]] + [[../50-Game-Design/progressive-disclosure-ui]].
- **Promotes / supersedes**: locks [[onboarding-strategy]] as `current binding`; creates [[../50-Game-Design/onboarding-and-tutorial]] as `approved` GDD; opens A8 follow-up (ADR-0008 Mobile-first UI needs to absorb feed-card + coach mark + halftime modal patterns); opens K1 + K3 follow-ups (player-onboarding docs + tutorial scripts) for full body-copy authoring.
- **Dependencies**: D2 (done), D3 (done), D4 (done), D9 (done), Wave 1 [[club-boss-analysis]] + [[anstoss-series-deep-dive]] (done).
- **Estimated effort**: M (actual: M).

#### D6. R2-06 Late-game / end-game systems (done 2026-05-17)

- **Priority**: P1.
- **Why now**: After locking the user-facing journey D5 → D3 → D4 → A3, the question "what keeps the user playing past season 10?" became blocking. D4 §11 had explicitly deferred national team / Hall of Fame / legacy mode to post-MVP; D6 specifies them. EA FC Career dies ~season 5; FM has 50-year saves; we need to position closer to FM than EA.
- **Q&A outcome (2026-05-17)** — Perplexity research (3 deep dives: continental cups + competition formats, Bundestrainer + manager meta-progression + Make Your Career, ownership transitions + Hall of Fame + Legacy mode + 50-year longevity) + 10-question Q&A with Nico. **All 10 recommendations accepted as-is** — maximum scope locked:
  - **Continental stack**: 3 tiers per continent (Champions Cup / Continental League / Challenge Trophy) + global IFC Club World Masters. IP-safe fictional bodies (IFC / EFC / AFU / APFC / AFA).
  - **Competition format**: classic 32-team groups + knockout at MVP (FM-like, safer AI/UI); Swiss model deferred to Phase 2.
  - **National team mode**: dual-role with 3 engagement levels (Full Control / Match-Only / Light Touch) - FM-depth + PWA ergonomics. Unlock at rep ≥ 75 + (5 seasons OR 3 trophies).
  - **Owner archetypes**: 6 at MVP (Sugar Daddy / Asset Stripper / Foundation-Community / Petrol-State / Murky / Foreign Business) covering anti-staleness + narrative variety + FFP/regulatory hooks.
  - **Bankruptcy / Administration**: include at MVP with Heroic Save path → "Saved the Club" HoF credit.
  - **Hall of Fame**: full 3-layer (Manager per-save + Manager cross-save + Club per-save + Player Legends) - CK3 + Civ + FM combined.
  - **Legacy mode**: 3 options (Chairman / new manager / hard retire) - CK3-style generational continuity.
  - **Cross-save persistence**: full meta-file with 3-tier Legacy perks; meta-only NEVER feeds runtime sim (deterministic-safe per D8 - same seed + same legacy config at gen → byte-identical world).
  - **Make Your Career creator**: full (Background + Coaching Badge + Tactical Specialisation + Nationality + Languages) - FM-proven replayability.
  - **50-year save longevity**: full stack (Career phases UI + generational regens + Year-X events + continental power shifts + Anstoss newspaper archive + records book) - first PWA manager to ship this depth.
- **Locked from D4**: extends D4 §10.4 (Rising Rival + Giant Collapse), §11 (deferred national team / HoF / legacy now specified), §9.5 (legendary detection extended).
- **Locked from D5**: 12 dynasty achievements feed cross-save HoF metadata; Assistant Manager voice carries into post-tournament debriefs.
- **Locked from D8**: cross-save Legacy perks are world-gen-time parameters only (meta-only, never runtime input). Same `worldSeed` + same legacy config at creation → byte-identical world.
- **Locked from D2**: national team eligibility via D2 §10.4 birth + heritage; archetype generation extended to owner archetypes (6 new types added via existing pattern).
- **Locked from ADR-0007**: all continental cup + governing body + national team competition names must be fictional (locked in §3.1-3.2 of [[late-game-systems]]).
- **Best-of-competitors techniques adopted**: 3-tier continental cup stack (UEFA 2021+); classic 32-team groups + knockout (FM / EA FC / PES); country coefficient with 5-year rolling window (UEFA); dual-role club + national team (FM PC / Anstoss 3); Bundestrainer arc (Anstoss 3 iconic feature); 4-year tournament cycles + 2-year continental offset (FIFA + UEFA); manager + club + player legend detection (FM PC); era detection (FM + CK3); 6 owner archetypes (FM + Anstoss); cross-save Hall of Fame (Civ + CK3); Legacy perks (CK3 dynasty); generational regens (FM + The Sims); league reform (CK3 + real football); newspaper archive (Anstoss + FM news); records book (Hattrick + FM); manager creator (FM PC).
- **Our unique style**: CK3-style cross-save Hall of Fame with deterministic-safe Legacy perks (FM has per-save only); 3-engagement-level dual-role for PWA tablet ergonomics (FM only Full Control); 6 data-driven Owner archetypes with explicit user takeover decision points (FM implicit; Anstoss binary); Civ-style career phases UI explicit on timeline (FM emergent); continental power shift era labels explicit on global overview (no competitor surfaces this); Anstoss newspaper + Hattrick records unified (each game has one or other); generational regens with "Son of X" narrative tagging + media headlines (FM has regens but no narrative continuity); deterministic + offline-first entire system enables global challenge seasons with cross-save bragging.
- **Output files**: wrote [[late-game-systems]] (new, 15-section binding research note: continental cup stack design + Bundestrainer arc + Make Your Career creator + 5-branch talent tree + region-based reputation + 6 owner archetypes + bankruptcy / administration + 3-layer Hall of Fame + 3-option Legacy mode + 3-tier cross-save Legacy perks + full 50-year save longevity stack + IndexedDB schemas + perf budget; ~1000 lines). Cross-linked from [[../50-Game-Design/mode-manage-a-club-career]] §7 (Bundestrainer stub now expanded) + [[../50-Game-Design/regulations-and-compliance]] §8 (continental cups now designed).
- **Promotes / supersedes**: locks [[late-game-systems]] as `current binding`; closes D4 §11.2 deferred items (national team dual-role + Hall of Fame + legacy mode + roguelite-mode integration); expands `mode-manage-a-club-career.md` §7 Bundestrainer stub.
- **Dependencies**: D4 (done), D5 (done), D8 (done), D2 (done), A3 (done), D3 (done), ADR-0007 (accepted).
- **Estimated effort**: L (actual: L).

#### D7. R2-07 Mobile UX, IA & accessibility

- **Priority**: P1.
- **Scope**: Route inventory, navigation, shadcn primitives, WCAG 2.2 AA, touch targets.
- **Q&A questions for Nico**: Bottom-nav vs hub-tile? Dark mode at MVP?
- **Output files**: [[mobile-ux-ia-a11y]] (new); updates A8.
- **Estimated effort**: L.

#### D8. R2-08 Determinism, RNG, replay (done 2026-05-16)

- **Priority**: P0.
- **Scope**: Seedable PRNG choice, RNG-stream isolation, replay format, save-determinism rules.
- **Q&A outcome (2026-05-16)** — all locked in [[determinism-and-replay]]:
  - **PRNG**: PCG32 in 32-bit JS (no BigInt). Library: `pure-rand` (TS-first, used by fast-check). Fallback: roll-our-own 30-line PCG32.
  - **RNG streams**: 8 named streams - WorldRng, WorldAiMgmtRng, MatchCoreRng(matchId), MatchAiRng(matchId), WeatherRng, InjuryRng, TransferRng, NewsRng/PresentationRng. Seeded from masterSeed via xxhash32(label, parentSeed). Adding new streams later is safe (no perturbation of existing streams).
  - **Replay format**: hybrid - `(seed, lineups, tactics, engineVersion)` is canonical truth for every match (already locked in ADR-0011); human-involving matches additionally store the **FULL event log** (every pass/duel/dribble/shot/foul/sub/card/goal/HT/FT, ~5-20 KB/match) for fast UI + audit. AI-vs-AI stays seed-only.
  - **Numeric representation**: integers / basis-points (money in cents, probabilities 0-10000, attributes 0-100, coordinates integer-mm). No transcendental math in deterministic decision logic.
  - **12 save-determinism rules** locked (lint-enforced where possible).
  - **CI determinism gate**: Chromium-only at MVP via Playwright; WebKit + Firefox added in Phase-2 hardening.
- **Output files**: new [[determinism-and-replay]] research note.
- **Done outputs**: [[determinism-and-replay]] (status: current, binding: true).
- **Estimated effort**: M (actual: M).

#### D9. R2-09 Performance budgets on low-end Android & iOS (done 2026-05-17)

- **Priority**: P1.
- **Why now**: arc42 §Crosscutting carried a placeholder "Lighthouse mobile ≥ 90 until D9 defines the full device matrix"; D1 / A2 / D8 had locked the match-engine, storage, and determinism budgets but no overarching device matrix or CI strategy.
- **Q&A outcome (2026-05-17)** — Perplexity research (CWV / Lighthouse, device matrix, JS budgets, test-rig comparison, comparative analysis of FM Mobile / Top Eleven / OSM / SM24 / Hattrick / EA FC Mobile / others) + Nico:
  - **Three-tier supported device matrix**: Premium / Standard (optimisation target) / Floor (with warning banner); plus Off-target (HTML fallback). Standard tier = Snapdragon 695 / 4 Gen 2 / 6 Gen 1 / Helio G99 / Exynos 1330 / A13/A14, 4-6 GB RAM, Android 12+/iOS 16+. Floor tier = 3 GB RAM / A12 / Android 10+ / iOS 15+ / Chromium 90+.
  - **Tight CWV product targets**: LCP p75 mobile ≤ 2.0 s, INP ≤ 120 ms on primary flows, CLS ≤ 0.05. Lighthouse mobile ≥ 90 (block deploy < 85); desktop ≥ 95 (block < 90).
  - **Balanced JS bundle budgets**: initial critical ≤ 200 KB (hard cap 250 KB); total session ≤ 700 KB (hard cap 1 MB); per-route lazy heavy ≤ 100 KB; per-route lazy small ≤ 50 KB; third-party ≤ 50 KB.
  - **Phased CI test rig**: Phase 1 (MVP) emulated CI only (Lighthouse CI + Playwright + injected web-vitals + bundle-size CI + match-engine perf gate); Phase 2 (post-MVP) add LambdaTest weekly real-device job (~€1.5 k/yr); Phase 3 (optional, only if needed) build 5-device hardware rig (~€2.4 k one-off).
  - **World-size presets** (FM-style): Small / Medium / Large at New Save; Floor tier forced Small; Medium default on Standard.
  - **Match render policy**: explicit **no 3D ever** (permanent product decision; supersedes prior "post-MVP / deferred" classification). Two modes only - Text & Stats (first-class, Floor default) + 2D canvas (primary, mandatory, 30/60 fps cap by tier).
  - **Best-of-competitors techniques adopted**: discrete-event sim (FM/OSM/Champ Man — already locked in D1), text-first match mode (OSM/Hattrick/Top Eleven), world-size slider (FM Mobile's #1 perf lever), compact binary saves (already locked in A5), virtualised tables + minimal DOM (FM26 UI Speed Patch lesson), graphics scalability (FM/SM/FC Mobile), small assets + LRU eviction (Top Eleven/FC Mobile), throttle + yield (FM processing screens), battery saver + reduced motion (SI recommendations + `prefers-reduced-motion`), incremental updates (every scalable manager).
  - **Our unique twist**: deterministic match engine + Worker-based "simulate-to-completion → playback" architecture gives our local-sim PWA the same client-side perf profile as Hattrick/OSM's server-thin clients.
- **Output files**: wrote [[performance-budgets]] (new, comprehensive, 16-section research note with §12 cheat-sheet table); updated [[../10-Architecture/08-Crosscutting]] §Performance to incorporate the device matrix + budgets + match render policy; propagated "no 3D" decision into [[../50-Game-Design/match-engine]] §7 and moved 3D match view from "Could (deferred)" to "Won't (out of scope)" in [[feature-gap-analysis]] §4.
- **Promotes / supersedes**: locks [[performance-budgets]] as `current binding`; supersedes "Lighthouse ≥ 90 placeholder" in arc42 §Crosscutting; supersedes "3D match view post-MVP" in match-engine GDD + feature-gap-analysis.
- **Dependencies**: D1 (done), A2 (done), D8 (done), A3 (done), D11 (done, telemetry for RUM CWV).
- **Estimated effort**: S (actual: S).

#### D10. R2-10 i18n, copy tone & localisation strategy

- **Priority**: P2.
- **Scope**: Library shortlist, namespace strategy, tone register, Intl API.
- **Q&A questions for Nico**: Default tone? RTL languages in scope? Translation workflow?
- **Output files**: [[i18n-and-tone]] (new); updates A6.
- **Estimated effort**: M.

#### D11. R2-11 Telemetry, privacy, GDPR for offline-first PWA

- **Priority**: P2.
- **Scope**: Threat model, self-hosted analytics stack (Plausible / PostHog / Umami), error reporting, consent UX, save encryption.
- **Q&A questions for Nico**: Self-hosted vs SaaS analytics? Default opt-in vs opt-out (jurisdictional)?
- **Output files**: [[telemetry-privacy]] (new); updates A2, A9, F6.
- **Done 2026-05-17**: Self-hosted observability direction locked by [[telemetry-privacy]] and promoted to [[../10-Architecture/09-Decisions/ADR-0017-observability-logging]]. Product analytics (Umami/Plausible/PostHog) deferred to H7/G3; operational diagnostics use OpenTelemetry + Grafana stack + GlitchTip.
- **Done outputs**: [[telemetry-privacy]], [[../10-Architecture/09-Decisions/ADR-0017-observability-logging]], [[../30-Implementation/client-telemetry]], [[../30-Implementation/observability-runbook]].
- **Estimated effort**: L.

#### D12. R2-12 Hotseat & async friend leagues feasibility

- **Priority**: P2.
- **Scope**: Pass-and-play UX, **hotseat → async MP promotion handoff** (locked in gap B2), async friend leagues via export/import vs cloud-relay, conflict resolution, anti-cheat.
- **Q&A questions for Nico**: Pass-and-play at MVP? Cloud relay tier (free / paid)? Hotseat handoff UX detail (one-time only, or repeated re-uploads allowed)?
- **Locked from gap B2**: Hotseat is local-authoritative; a hotseat save can be promoted into an async MP group via a one-way handoff with server-side integrity validation (decrypt → schema → optional event-log replay → accept canonical state); from that point the device save is read-only for the promoted club; no demote path.
- **Locked from gap D14**: Promotion mechanic = **snapshot-and-import between per-save DBs**, not row-level cross-DB joins. The server creates a new MP-flavoured save DB and imports the validated snapshot from the source hotseat save DB; the `save_registry` row in the `platform` DB links new → source.
- **Output files**: [[multiplayer-feasibility]] (new); updates A4.
- **Dependencies**: B2 (done), D14 (done; snapshot-and-import handoff path locked).
- **Estimated effort**: M.

#### D13. R2-13 Women's football data model readiness

- **Priority**: P2.
- **Scope**: Gender field shape, cross-league constraints, calendar offsets, value distribution.
- **Q&A questions for Nico**: Women's football at MVP (no), but schema additive (yes)? Mirror calendar shift?
- **Output files**: [[womens-football-data-model]] (new); updates A4.
- **Estimated effort**: S.

#### D14. R2-14 SurrealDB schema patterns (done 2026-05-16)

- **Priority**: P0.
- **Scope**: Schemafull `DEFINE TABLE` patterns, record-link vs embedded, RELATE graph, query patterns via `src/db/client.ts`, per-save isolation, migrations, embedded SurrealDB WASM, **outbox + consumer_event_offset tables** and the **monthly archive partition policy** (locked from B4).
- **Q&A outcome (2026-05-16)** — all locked in [[surrealdb-schema-patterns]]:
  - **Per-save isolation**: hybrid - shared `platform` DB (identity, save registry, outbox, audit, IP-clean catalog) + one DB per save in the same `soccer_manager` namespace.
  - **Schema strategy**: hybrid - SCHEMAFULL for stable core entities (player, club, league, match, transfer_offer, sponsor, training_plan, staff, user, mp_group); SCHEMALESS for event/log/payload tables (match_event, outbox_event, audit_log, narrative_event_log, notification).
  - **Relationship modelling**: per-relationship choice. club→players = record link; match→match_events = linked rows; transfer_offer→counter-offers = linked rows + parent_offer; transfer = document table; watch_party→participants = RELATE edge with metadata; club→stadium / player→traits / training_plan→drills = embedded.
  - **Migrations + type-gen**: TS-first schema mirror in `packages/db-schema`; custom generator emits `.surql` + Zod + TS types; explicit `pnpm db:migrate` release step (not boot-time); forward-only with phased rename pattern.
  - **Browser offline store**: Dexie / IndexedDB only at MVP. SurrealDB WASM kept as **post-MVP research track** (trigger: Capacitor / native packaging in scope, or server cost constraint, or WASM bundle < 500 KB with PWA persistence guarantees).
  - **Live Queries**: UI projection updates only; never workflow authority. Per-context `queryGateway` abstraction exported from `src/domain/<context>/index.ts`.
  - Skeleton schemas authored for all 11 bounded contexts.
- **Locked from B4** (already integrated): `outbox_event` + `consumer_event_offset` + `outbox_event_archive_YYYY_MM` tables live in the `platform` DB with the indexes from B4.
- **Output files**: new [[surrealdb-schema-patterns]] research note (status: current, binding: true).
- **Done outputs**: [[surrealdb-schema-patterns]] (locked decisions ready to paste into A4 + E1).
- **Dependencies**: B4 (done; outbox-table schema locked).
- **Estimated effort**: L (actual: L).

#### D15. R2-15 Narrative event content & authoring pipeline (done 2026-05-17)

- **Priority**: P1.
- **Why now**: D5 locked 12 inbox tutorial messages + 10-sender cast + voice cards but only subjects + CTAs - no full bodies. D6 locked Anstoss-style newspaper archive + takeover narrative + bankruptcy events + national tournament dialogues all needing content authoring. D4 board confidence + manager career arcs + rival tracking + AI archetype reactions need flavour. D15 owns the authoring format + ICU localisation + deterministic seeding + voice-card system + writer workflow connecting all of these.
- **Q&A outcome (2026-05-17)** — Perplexity research (2 deep dives covering authoring formats + competitor analysis + ICU best practices + event family taxonomy + story arcs + voice consistency + press conferences + newspaper generation + personal life + workflow + LLM assistance) + 9-question Q&A with Nico. **All 9 recommendations accepted as-is** — maximum scope locked:
  - **Authoring format**: Markdown + frontmatter source → compiled locale-split JSON + typed TS catalogues. Best balance writer + dev ergonomics.
  - **ICU library**: FormatJS / `intl-messageformat`. Industry standard; mature TS.
  - **Event taxonomy**: full ~50 families (actually 106 stable IDs across 10 groups). Future-proof.
  - **Story arcs**: all 6 at MVP. Maximum narrative depth.
  - **Press conferences**: 5 tones × 4 contexts with cumulative season effects. FM + NBA 2K reference.
  - **Voice consistency**: voice cards + AI archetype reactions + CI lint rules. Disco Elysium-level consistency.
  - **Translation workflow**: Git + Markdown + custom React preview app at MVP; evaluate Inlang/Tolgee post-MVP.
  - **Personal life layer**: 6 family types toggleable (On/Reduced/Off). Anstoss-iconic.
  - **LLM assistance**: build-time only + human-reviewed + optional post-MVP. Preserves D8 determinism.
- **Locked from D5**: 10-sender cast + voice card structure; 12 tutorial messages get their full body copy via this pipeline.
- **Locked from D6**: newspaper archive generation algorithm + 6 owner archetype takeover narratives + bankruptcy arc + national tournament dialogues.
- **Locked from D4**: 10 AI manager archetypes feed reaction-tone weighting matrix (~1500-2000 reaction-context slots).
- **Locked from D8**: deterministic variant selection via extended RNG stream #9 `GeneratorRng` with `generator:narrative:*` sub-labels (future-proof per D8 §2.3).
- **Locked from D9**: bundle ~95-145 KB gzipped lazy-loaded per locale; IndexedDB ~3-5 MB narrative data per 50-year save.
- **Locked from ADR-0007**: all names fictional; placeholder system enforces this at compile time.
- **Best-of-competitors techniques adopted**: tagged event-family system (FM story engine FM23+); template-based newspaper with stat slots (Anstoss 3 Zeitung); cast of senders (Club Boss inbox); storylet model with quality gates (Failbetter Games Fallen London / Sunless Sea); authored branching scenes for special decisions (Ink 80 Days); voice consistency master class (Disco Elysium); press conference tone choices with effects (FM + NBA 2K career mode); per-AI-archetype reaction patterns (FM hidden personality); ICU MessageFormat industry standard; Markdown + frontmatter authoring (modern dev docs + SSGs); compiled-catalog runtime (Lingui / FormatJS); deterministic seeded variant selection (roguelikes + procedural narrative).
- **Our unique style**: deterministic + offline-first narrative pipeline (FM/Anstoss/EA FC all have runtime variation); voice-card linting in CI (no competitor lints voice consistency in CI); per-AI-archetype reaction patterns mapped explicitly from D4 (FM implicit; we make explicit + tuneable); personal life events as toggleable flavour layer (most competitors hardcode or omit); storylet quality-gate model adapted to football (novel for manager genre); Markdown + Git workflow for indie team (most competitors use proprietary tools); bundle determinism for PWA caching; build-time LLM only (never runtime — preserves D8 determinism).
- **Output files**: wrote [[narrative-content-pipeline]] (new, 18-section binding research note ~1500 lines: full authoring pipeline + ICU MessageFormat patterns + 106 event families taxonomy + 6 story arc state machines + press conference design + newspaper generation logic + voice consistency multi-layer + personal life layer + writer/translator workflow + LLM assistance design + determinism + RNG usage + perf budgets + IndexedDB schemas + open follow-ups + sources). Cross-linked from [[../50-Game-Design/onboarding-and-tutorial]].
- **Promotes / supersedes**: locks [[narrative-content-pipeline]] as `current binding`; provides the content authoring + i18n pipeline for D5 onboarding inbox + D6 newspaper archive + D4 AI manager reactions + all in-game text beyond UI labels. Opens follow-ups for A6 (ADR-0006 i18n depth pass should incorporate this pipeline), D10 (per-locale tone register), E22 (full localisation workflow for Tier-2 locales), K3 (full body copy for the 12-message D5 tutorial arc).
- **Dependencies**: D5 (done), D6 (done), D4 (done), D8 (done), D2 (done), D9 (done), ADR-0007 (accepted).
- **Estimated effort**: M (actual: M-L; comprehensive scope).

#### D16. R2-16 Match-presentation rendering tech

- **Priority**: P1.
- **Scope**: Text feed, 2D ticker (SVG / Canvas2D / CSS), Lottie / Rive, sound, 3D post-MVP, match controls UX.
- **Q&A questions for Nico**: 2D engine tech (SVG vs Canvas)? Sound at MVP? Haptics?
- **Output files**: [[match-presentation-rendering]] (new); updates A8.
- **Estimated effort**: L.

#### D17. R2-17 React + TanStack client state without Redux/Zustand

- **Priority**: P1.
- **Scope**: Decision tree for client state (Router search params, TanStack Query, useReducer, signals); Worker-bridge pattern; Dexie ↔ React bridge.
- **Q&A questions for Nico**: Preact Signals or `@tanstack/react-store`? Worker port fan-out pattern?
- **Output files**: [[client-state-management]] (new); updates A1, A8.
- **Estimated effort**: M.

#### D18. R2-18 Risk register & consolidated threat model

- **Priority**: P2.
- **Scope**: Risk taxonomy, likelihood × impact, mitigation owners, cross-link to `needs-decision` items.
- **Output files**: [[risk-register]] (new); updates C8, F1.
- **Estimated effort**: M.

#### D19. R2-19 Game domain glossary & terminology

- **Priority**: P2.
- **Scope**: Audit Wave 1 + 2 docs for terms, de + en lemmas, subsystem ownership.
- **Output files**: [[game-glossary]] (new); update [[../00-Index/Glossary]].
- **Estimated effort**: M.

### E. Implementation guides

#### E1. SurrealDB integration depth

- **Priority**: P0.
- **Why now**: `surrealdb-integration.md` is 2 paragraphs; M2+ work cannot proceed without schemas + query patterns.
- **Scope**: Document `src/db/client.ts` API surface, parameterised query pattern, transaction patterns (including outbox row written inside same tx as state change), schema migration runner, type-gen integration, live-query subscriptions, queryGateway pattern, save-quota enforcement.
- **Locked from D14**: hybrid per-save isolation; SCHEMAFULL/SCHEMALESS hybrid; TS-first generator; `pnpm db:migrate` runner walks platform first then every save DB enumerated via `save_registry`; `queryGateway` per context; Live Queries for UI projections only.
- **Locked from A4**: server-side enforcement of soft 10 / hard 50 quota; `save_registry` row state machine `active → archived → deleted` with 30-day grace before per-save DB drop; archive-flow query patterns; cross-context queries via the owning context's `queryGateway` (never raw cross-context SurrealDB reads).
- **Locked from B4**: state-change command writes its outbox row inside the same SurrealDB transaction; outbox claim pattern `UPDATE outbox_event SET status='publishing' WHERE status='pending' ... RETURN ...`.
- **Research questions** (remaining): SurrealDB 2.x Node SDK performance; transaction-isolation level for the outbox-write; multi-publisher claim semantics; `EXPLAIN` + index tuning.
- **Q&A questions for Nico**: Live-query consumer pattern (TanStack Query subscription invalidation vs custom observable bridge)? Per-context connection isolation, or shared pool?
- **Output files**: update [[../30-Implementation/surrealdb-integration]].
- **Dependencies**: A4 (done), D14 (done), B4 (done).
- **Estimated effort**: M (reduced from L because D14 + A4 lock the schema + isolation + quota strategy).

#### E2. PWA offline strategy depth

- **Priority**: P0.
- **Scope**: Implementation guide for the offline-first contract — Workbox runtime config, cache namespace versioning, install-update prompt UI component, iOS Add-to-Home-Screen walkthrough.
- **Locked from A2**: SW tooling = `vite-plugin-pwa` `injectManifest`; SW scope `/`; hybrid smart update strategy (auto vs prompt based on `getAppActivityState()`); precache app shell + engine modules + manifest icons + offline-fallback HTML; runtime caching strategies (network-first navigations, SwR for read-only API, never-cache for mutating, LRU media); install prompt timing locked.
- **Research questions** (remaining): exact `getAppActivityState()` selector implementation (state shape, which contexts contribute); offline-fallback HTML layout (full app shell vs minimal "you're offline" page); icon design pipeline.
- **Q&A questions for Nico**: Offline-fallback HTML = full app shell (more bytes) or minimal "you're offline" + retry button (smaller)? Should we ship a custom install-card design or use shadcn primitives?
- **Output files**: update [[../30-Implementation/pwa-offline-strategy]].
- **Dependencies**: A2 (done).
- **Estimated effort**: S (downgraded from M because A2 locks the strategy).

#### E3. Dokploy deployment depth

- **Priority**: P1.
- **Scope**: Compose files per env, healthchecks, log shipping, blue-green or rolling deploys, runtime workers (match worker, scheduler).
- **Research questions**: Dokploy 2026 feature set; Hetzner CCM for Hetzner Cloud k8s if applicable.
- **Q&A questions for Nico**: Dokploy environments to provision (dev + prod, or +staging)? Backup target (S3-compatible bucket)?
- **Output files**: update [[../30-Implementation/deployment-dokploy]].
- **Dependencies**: C5.
- **Done 2026-05-17**: [[../30-Implementation/deployment-dokploy]] updated with ADR-0017 observability services, routing/access rules, volumes, retention, backups, alert delivery and upgrade cadence. Compose files themselves remain a later implementation task.
- **Estimated effort**: M.

#### E4. Secrets rotation

- **Priority**: P1.
- **Scope**: sops + age + direnv runbook, key rotation cadence, secret types, recovery.
- **Output files**: rewrite [[../30-Implementation/secrets-rotation]].
- **Dependencies**: F11.
- **Estimated effort**: S.

#### E5. Cursor cloud-agent workflow

- **Priority**: P2.
- **Scope**: Cloud agent setup, branch convention, PR review gate, Bugbot integration, MCP servers in use.
- **Output files**: update [[../30-Implementation/cursor-cloud-agent-workflow]].
- **Estimated effort**: S.

#### E6. Linear task tracking

- **Priority**: P2.
- **Scope**: Issue templates, labels, priorities, wave epics, vault-to-Linear handoff rules.
- **Output files**: update [[../30-Implementation/linear-task-tracking]].
- **Dependencies**: L1.
- **Estimated effort**: S.

#### E7. TanStack Start integration patterns

- **Priority**: P1.
- **Scope**: Server functions, loaders, route tree generation pattern, SSR + hydration, command/query layer mapping.
- **Research questions**: TanStack Start beta API stability (2026); deferred data + streaming SSR; route validation patterns.
- **Output files**: [[../30-Implementation/tanstack-start-patterns]] (new).
- **Dependencies**: A1, D17.
- **Estimated effort**: M.

#### E8. shadcn/ui design system + design tokens

- **Priority**: P1.
- **Scope**: Token catalogue (colour, type, spacing, motion), shadcn primitives in MVP, dark-mode strategy, custom variants.
- **Research questions**: shadcn/ui 2026 update cadence; Radix vs Ariakit; design token formats (Style Dictionary, CSS variables only).
- **Output files**: [[../30-Implementation/design-system-and-tokens]] (new).
- **Dependencies**: A8, D7.
- **Estimated effort**: M.

#### E9. Capacitor native packaging

- **Priority**: P3.
- **Scope**: PWA → native wrapping, native plugin needs (push, secure storage), App Store + Play Store submission flows.
- **Output files**: [[../30-Implementation/capacitor-native-packaging]] (new).
- **Dependencies**: A2, E20.
- **Estimated effort**: L.

#### E10. CI/CD pipeline (GitHub Actions)

- **Priority**: P0.
- **Scope**: Workflows (lint / typecheck / test / e2e / build / deploy), caching, parallelism, required checks, Lighthouse CI, performance gate.
- **Research questions**: GitHub Actions 2026 features (matrix improvements, reusable workflows); `pnpm/action-setup` best practices.
- **Output files**: [[../30-Implementation/ci-cd-pipeline]] (new).
- **Dependencies**: E11.
- **Estimated effort**: M.

#### E11. Test strategy

- **Priority**: P0.
- **Scope**: Vitest config + coverage, Playwright config + offline-first scenarios, property-based testing with fast-check, golden replays for match engine, contract tests for bounded contexts, mutation testing posture.
- **Research questions** (remaining): Vitest 2.x watch + browser; Playwright 1.x networkmocks for offline; mutation testing tool choice (Stryker vs not at MVP).
- **Locked from gap D8**: `fast-check` + `pure-rand` shared; ≥ 10 golden-replay matches with byte-identical CI assertion; save round-trip determinism test; Chromium-only CI gate at MVP; per-state-machine determinism test.
- **Locked from gap D1**: full test pyramid for match-engine (unit + integration + 10 golden + statistical envelopes + property-based + perf gate); 10 canonical golden replay scenarios named (symmetric / low-block / press / width / overload / set-piece / cards / injuries / one-sided / 0-0); statistical envelope bands locked (0-0 rate 6-10%, avg goals 2.4-3.0, scores in 0-3 80-90%, etc.); CI perf gate 50 ms hard / 30-40 ms soft alert.
- **Q&A questions for Nico**: Mutation testing at MVP (Stryker) or post-MVP only? Per-PR subset of golden replays (2-3) or all 10?
- **Output files**: [[../30-Implementation/test-strategy]] (new).
- **Dependencies**: D8 (done), D1 (done).
- **Estimated effort**: M (downgraded from L; match-engine test strategy already locked).

#### E12. Build pipeline

- **Priority**: P1.
- **Scope**: Vite + Workbox + TanStack Start config, code-splitting strategy, bundle budgets, SSR/CSR split.
- **Research questions**: vite-plugin-pwa compatibility with TanStack Start SSR; Workbox runtime caching policies.
- **Output files**: [[../30-Implementation/build-pipeline]] (new).
- **Dependencies**: A1, E2, E10.
- **Estimated effort**: M.

#### E13. Web Worker bridge for match engine

- **Priority**: P0.
- **Scope**: postMessage protocol, message-port fan-out, transferable objects, replay scrubbing, error propagation.
- **Locked from D1**: bridge interface = `simulate(MatchInputs) → MatchResult`, `simulateStreaming(MatchInputs) → AsyncIterable<MatchEventCore>`, `replay(MatchInputs) → AsyncIterable<MatchEventCore>`; `MatchInputs` shape (engine_version, seeds, lineups, tactics, weather, referee_profile, emit_full_event_log flag); events batched per virtual minute or every ~20 events; postMessage with discriminated-union types.
- **Locked from D8**: Worker MUST NOT call `setTimeout`, `requestAnimationFrame`, `Date.now()`, `Math.random()`.
- **Research questions** (remaining): comlink vs hand-rolled discriminated-union postMessage protocol; transferable objects for large event batches (ArrayBuffer vs structured-clone); abort/cancel semantics for streaming sim.
- **Q&A questions for Nico**: comlink or hand-rolled? Allow simulation cancellation (e.g. user navigates away mid-match)? If yes, abort signal in `MatchInputs`?
- **Output files**: [[../30-Implementation/worker-bridge]] (new).
- **Dependencies**: D1 (done), D17.
- **Estimated effort**: S (downgraded from M; interface locked).

#### E14. Job queue + scheduler architecture

- **Priority**: P0.
- **Scope**: Outbox publisher worker (claim-by-CAS over SurrealDB outbox rows; push to Redis Streams), scheduled-job runner (timers for countdowns), retry policy (exponential backoff, cap at 20 retries), supervisor patterns, Prometheus metrics + Grafana dashboard.
- **Locked from B4**:
  - Storage = SurrealDB outbox + Redis Streams (consumer groups).
  - Stream naming = `events:<aggregate_type>` (or single `events:all` - choose in this gap).
  - Idempotency = UUIDv7 event IDs + per-consumer `consumer_event_offset` table.
  - Backpressure thresholds locked (outbox_oldest_age_seconds > 60 s warning / > 300 s critical; outbox_pending_count > 10 000 critical).
  - Archiver job runs nightly and moves published rows > 60 days to monthly cold partitions.
- **Research questions** (remaining): BullMQ vs custom polling worker; scheduled-job runner for countdowns (Redis sorted sets vs SurrealDB scheduled-tasks); supervisor / restart strategy on Dokploy.
- **Q&A questions for Nico**: One stream per aggregate type or one `events:all` stream? BullMQ or roll-our-own publisher? Use Redis sorted sets for countdowns or SurrealDB-native schedule tables?
- **Output files**: [[../30-Implementation/jobs-and-scheduler]] (new).
- **Dependencies**: B4 (done).
- **Done 2026-05-17**: [[../30-Implementation/jobs-and-scheduler]] created with worker roles, default stream naming, retry policy, Prometheus metrics, log fields, traces and supervision rules. Remaining implementation choice: keep `events:<aggregate_type>` default or collapse to `events:all` after operational testing.
- **Estimated effort**: M.

#### E15. Snapshot / replay storage

- **Priority**: P2.
- **Scope**: Replay storage policy, snapshot frequency, archive policy, redaction for community sharing.
- **Output files**: [[../30-Implementation/snapshot-and-replay]] (new).
- **Dependencies**: B6.
- **Estimated effort**: M.

#### E16. Realtime channel

- **Priority**: P1.
- **Scope**: SurrealDB Live Queries vs alternative (WebSocket / SSE), backpressure, subscription lifecycle.
- **Output files**: [[../30-Implementation/realtime-channel]] (new).
- **Dependencies**: D14, D17.
- **Estimated effort**: M.

#### E17. Service Worker architecture detail

- **Priority**: P0.
- **Scope**: Concrete SW source (apps/web/src/sw.ts) — install, activate, fetch, message event implementations; Workbox plugin registration; precache manifest injection point; outbox-replay handler hooked to `online` / `visibilitychange` proxies from the main thread; `BackgroundSyncPlugin` registration (Chromium-only); SKIP_WAITING handshake; engine module per-version precaching.
- **Locked from A2**: tooling = `injectManifest`; scope = `/`; cache strategies per route family; hybrid smart update; outbox replay triggers; Workbox plugins.
- **Locked from D8**: engine modules vendored per version into the PWA bundle so offline replay is deterministic.
- **Locked from B4**: SW MUST NOT decide command success — only transport. Outbox commands are server-validated.
- **Research questions** (remaining): exact `getAppActivityState()` IPC contract (page → SW); cache-namespace versioning convention.
- **Q&A questions for Nico**: Engine module precache as `engine-v{N}.js` (separate file per version) or single bundle with dynamic switch? IPC contract — `postMessage` with discriminated-union types or comlink?
- **Output files**: [[../30-Implementation/service-worker-architecture]] (new).
- **Dependencies**: A2 (done), E2, E19, D8 (done).
- **Estimated effort**: M.

#### E18. IndexedDB schema design

- **Priority**: P0.
- **Scope**: Dexie schema, table definitions, indices, migrations, per-save isolation, quotas, **outbox table** (client-side queue replayed on reconnect per ADR-0011 §Offline conflict policy), encrypted-blob storage of save snapshots.
- **Locked from A4**: one logical save per IndexedDB DB inside the browser; saves table mirrors the platform's `save_registry` for offline browsing; encrypted save snapshots stored as opaque blobs (decrypted only into memory via Web Crypto); client-side soft quota (10 active saves) mirrors the server-side rule; archive flow available offline.
- **Locked from D8**: RNG state lives inside the encrypted save blob (4 × Uint32 per stream × 8 streams).
- **Locked from B2 + B4**: client outbox table for pending commands; UUIDv7 request IDs; reject with `rejected_with_reason` on server-side conflict (no client auto-rebase).
- **Locked from A5**: envelope shape `{envelopeVersion, saveVersion, engineVersion, saveMode, saveId, createdAt, compression: 'gzip', kdfAlgo: 'pbkdf2-sha256', kdfIterations: 600 000, iv, ciphertext, authTag, deviceBackup | portableExport}`; the Dexie row stores the envelope as a single binary blob + a JSON header copy for offline browsing; restore flow loads + Zod-parses on demand.
- **Output files**: [[../30-Implementation/indexeddb-schema]] (new).
- **Dependencies**: A5 (done), A4 (done), D8 (done), B2 (done), B4 (done).
- **Estimated effort**: S (further downgraded from M because A5 locks the envelope shape).

#### E19. Background sync implementation

- **Priority**: P1.
- **Scope**: Concrete client outbox + Workbox `BackgroundSyncPlugin` accelerator; replay scheduler; retry policy implementation.
- **Locked from A2**:
  - Primary triggers (startup + `online` + `visibilitychange`) cross-browser.
  - Chromium-only Workbox `BackgroundSyncPlugin` accelerator layered on top of our IndexedDB outbox (our outbox is source of truth, plugin opportunistically retries earlier).
  - Transient error retry: `0/10s/30s/2min/5min` exponential backoff, cap at 7 attempts.
  - Hard-reject business errors NEVER auto-retry (per ADR-0011).
  - `setAppBadge()` reflects pending + failed count (Chromium / installed PWAs).
- **Locked from B4**: UUIDv7 request IDs; idempotent consumers; outbox claim semantics via SurrealDB on the server.
- **Q&A questions for Nico**: How many parallel replay attempts (1 sequential or N parallel by aggregate-id)? Should the badge reflect pending only, failed only, or both?
- **Output files**: [[../30-Implementation/background-sync]] (new).
- **Dependencies**: A2 (done), E17, B4 (done).
- **Estimated effort**: M.

#### E20. Push notification implementation

- **Priority**: P2.
- **Scope**: Web Push API, payload structure, opt-in UX, throttling, native Capacitor push plug-in.
- **Output files**: [[../30-Implementation/push-notifications]] (new).
- **Dependencies**: A2.
- **Estimated effort**: M.

#### E21. Asset pipeline (crests, kits, sounds)

- **Priority**: P1.
- **Scope**: SVG crest generation, kit colour rules, sound sourcing (CC-licensed), asset registry, build-time compression.
- **Research questions**: SVG optimisation tools 2026; CC0 sound libraries (Freesound, OpenGameArt) for football.
- **Output files**: [[../30-Implementation/asset-pipeline]] (new).
- **Dependencies**: A7, D2.
- **Estimated effort**: M.

#### E22. Localization workflow

- **Priority**: P2.
- **Scope**: Translator handoff (per-key vs file-based), QA workflow, IP-clean copy review.
- **Output files**: [[../30-Implementation/localization-workflow]] (new).
- **Dependencies**: A6, D10, D15.
- **Estimated effort**: S.

#### E23. Audio / sound design

- **Priority**: P3.
- **Scope**: Sound categories (crowd, match events, UI), mixing strategy, mute / haptics fallback.
- **Output files**: [[../30-Implementation/audio-sound-design]] (new).
- **Estimated effort**: M.

#### E24. Performance testing setup

- **Priority**: P1.
- **Scope**: Match-engine benchmark suite, Lighthouse CI gates, real-device testing strategy.
- **Output files**: [[../30-Implementation/performance-testing]] (new).
- **Dependencies**: D9.
- **Estimated effort**: M.

### F. Security & privacy

#### F1. Detailed threat model

- **Priority**: P0.
- **Why now**: Crosscutting concern that every other security gap references.
- **Scope**: STRIDE model per bounded context, attacker model (anonymous user, authenticated user, malicious member, compromised dependency), assets, controls.
- **Research questions**: OWASP STRIDE templates 2026; threat model for offline-first PWAs; web crypto best practices.
- **Q&A questions for Nico**: Out-of-scope threats (state-level attacker)? Include side-channel?
- **Output files**: [[threat-model]] (new); updates C6, C8, D18.
- **Estimated effort**: L.

#### F2. Auth flows

- **Priority**: P0.
- **Scope**: Login, signup, password reset, optional MFA, OAuth (if any), session creation.
- **Research questions**: WebAuthn 2026 adoption; passkey patterns; secure cookie attributes.
- **Q&A questions for Nico**: OAuth providers (Google / Discord / none)? Passkeys at MVP?
- **Output files**: [[../30-Implementation/auth-flows]] (new).
- **Dependencies**: F1.
- **Estimated effort**: M.

#### F3. Session management

- **Priority**: P0.
- **Scope**: Token format (JWT vs opaque), refresh strategy, idle timeout, device list, revocation.
- **Output files**: [[../30-Implementation/session-management]] (new).
- **Dependencies**: F2.
- **Estimated effort**: M.

#### F4. Multi-device sync model

- **Priority**: P2.
- **Scope**: Same account on multiple devices, save merge policy, last-write-wins vs conflict prompt.
- **Locked from A4 + A5**: Phase-2 cloud sync is **hybrid** (initial encrypted snapshot per device + encrypted delta ops + periodic checkpoint snapshots every 100 deltas or 5 MB). Save-level content key wrapped per member for shared MP saves. Envelope reused for the initial snapshot; delta ops are a separate wire format added in this gap. Per-device deviceSalt + device-backup key already exist (per A5 §3); cross-device sync introduces a save-level content key in addition.
- **Output files**: [[../30-Implementation/multi-device-sync]] (new).
- **Dependencies**: D12, A5 (done; envelope locked), A4 (done; cloud-sync direction locked).
- **Estimated effort**: M.

#### F5. Account recovery

- **Priority**: P1.
- **Scope**: Email recovery, recovery codes, lockout behaviour, attack mitigation, **save-key recovery** when account secret rotates.
- **Locked from A5**: device-backup saves are decryptable from `PBKDF2(accountSecret, deviceSalt)` only; account-secret rotation breaks decryption unless we wrap the device-backup KDF in a stable account-key envelope (decision deferred to this gap). Portable exports survive account recovery because they use the user passphrase.
- **Research questions** (new from A5): how to support account-secret rotation without breaking existing device-backup saves? Options: (a) store a stable account-key in the platform DB, encrypted by `PBKDF2(currentAccountSecret)`; rotate the wrapping key on password change; (b) require users to re-export saves to portable format before changing password.
- **Output files**: [[../30-Implementation/account-recovery]] (new).
- **Dependencies**: F2, A5 (done; KDF + envelope locked).
- **Estimated effort**: M (upgraded from S because A5 surfaced the account-rotation concern).

#### F6. Privacy & GDPR compliance

- **Priority**: P0.
- **Scope**: Data inventory, lawful basis per category, retention, user rights (access / rectify / delete / portability), DPIA stance.
- **Research questions**: GDPR + ePrivacy 2026 state; consent UX patterns; PWA-specific guidance.
- **Q&A questions for Nico**: Self-hosted analytics? Email vendor (transactional)? DPO required?
- **Output files**: [[gdpr-compliance]] (new); [[../30-Implementation/privacy-and-consent]] (new).
- **Dependencies**: D11.
- **Estimated effort**: L.

#### F7. Cookie policy

- **Priority**: P1.
- **Scope**: Cookie inventory, consent banner UX, third-party cookies stance.
- **Output files**: [[../40-User-Docs/cookie-policy]] (new draft).
- **Dependencies**: F6.
- **Estimated effort**: S.

#### F8. Terms of service draft

- **Priority**: P2.
- **Scope**: User obligations, content moderation, community editor disclaimer, IP user-content rules.
- **Output files**: [[../40-User-Docs/terms-of-service]] (new draft).
- **Dependencies**: F9.
- **Estimated effort**: M.

#### F9. Content moderation for community editor

- **Priority**: P2.
- **Scope**: User-supplied pack content rules, reporting, takedown process, hosting boundary (we don't host packs).
- **Output files**: [[../30-Implementation/content-moderation]] (new).
- **Dependencies**: B7.
- **Estimated effort**: M.

#### F10. Audit trail spec

- **Priority**: P1.
- **Scope**: Auditable events catalogue, immutability, retention, admin access UI, query patterns over hot + cold archive.
- **Locked from B4**: The outbox **is** the audit trail. Retention = tiered hot 60 days + monthly cold archive forever. No separate audit-only event store needed. Admin access UI must query both hot and cold archive transparently via the Audit context query layer.
- **Research questions**: Admin UI patterns for time-range + aggregate-id audit queries; tamper-evident logging (hash-chain in archive partitions, optional).
- **Q&A questions for Nico**: Hash-chain archive for tamper evidence (yes / no)? Admin-only or also user-facing audit (e.g. "what happened with my transfer offer")?
- **Output files**: [[../30-Implementation/audit-trail]] (new).
- **Dependencies**: B4 (done).
- **Done 2026-05-17**: [[../30-Implementation/audit-trail]] created, separating SurrealDB outbox/archive domain audit from short-retention operational logs. Hash-chain tamper evidence remains an explicit F10 follow-up decision.
- **Estimated effort**: M.

#### F11. Secrets management runbook

- **Priority**: P1.
- **Scope**: sops + age + direnv flow, key rotation, secret-injection in CI, accidental-leak response.
- **Output files**: [[../30-Implementation/secrets-management]] (new); updates E4.
- **Dependencies**: F1.
- **Estimated effort**: M.

#### F12. Rate limiting / anti-abuse

- **Priority**: P1.
- **Scope**: Per-endpoint quotas, anti-griefing in transfers, login throttling, distributed-rate-limit pattern.
- **Output files**: [[../30-Implementation/rate-limiting-anti-abuse]] (new).
- **Dependencies**: F1.
- **Estimated effort**: M.

#### F13. Penetration testing strategy

- **Priority**: P3.
- **Scope**: Pentest scope, vendor selection, frequency, remediation SLA.
- **Output files**: [[../30-Implementation/pentest-strategy]] (new).
- **Dependencies**: F1.
- **Estimated effort**: S.

### G. Product / Business / GTM

#### G1. Mission / vision expansion

- **Priority**: P1.
- **Scope**: Expand [[../00-Index/Project-Goals]] with full mission, positioning statement, success criteria, non-goals.
- **Research questions**: Football manager market sizing 2026; community sentiment on FM25 cancellation; Anstoss / We Are Football reception.
- **Q&A questions for Nico**: Primary differentiator framing (offline-first vs roguelite vs async-friends)? Long-term ambition (lifestyle product vs studio scale-up)?
- **Output files**: rewrite [[../00-Index/Project-Goals]] expanding mission + adding missing files referenced today.
- **Estimated effort**: M.

#### G2. Target user personas

- **Priority**: P1.
- **Scope**: 3-5 personas (lapsed FM fan, Anstoss veteran, mobile casual, async-friends-group, modder), pains, gains, scenarios.
- **Output files**: [[../00-Index/user-personas]] (new).
- **Dependencies**: G1.
- **Estimated effort**: M.

#### G3. Success metrics / KPIs

- **Priority**: P1.
- **Scope**: Activation, retention (D7 / D30), session length, save longevity, NPS, store rating.
- **Q&A questions for Nico**: KPI floors / targets per metric?
- **Output files**: [[../00-Index/success-metrics]] (new).
- **Dependencies**: G1, D11.
- **Estimated effort**: S.

#### G4. Monetisation strategy

- **Priority**: P1.
- **Why now**: Affects every economic + community decision (no P2W, store policy, etc.).
- **Scope**: One-time paid vs freemium vs cosmetic-only vs ad-supported.
- **Research questions**: 2026 mobile manager monetisation patterns; PWA storefront constraints; player perception of monetisation (Top Eleven / OSM critique).
- **Q&A questions for Nico**: Hard constraint = no P2W (confirm). Acceptable monetisation models? Free demo / time-limited trial?
- **Output files**: [[../00-Index/monetisation]] (new).
- **Dependencies**: G1.
- **Estimated effort**: M.

#### G5. Pricing model

- **Priority**: P2.
- **Scope**: Tiered pricing, regional pricing, discounts, family-share considerations.
- **Output files**: [[../00-Index/pricing-model]] (new).
- **Dependencies**: G4.
- **Estimated effort**: S.

#### G6. Beta program / TestFlight strategy

- **Priority**: P2.
- **Scope**: Closed alpha, open beta, TestFlight / Play console internal testing, feedback channels.
- **Output files**: [[../30-Implementation/beta-program]] (new).
- **Dependencies**: E9, G7.
- **Estimated effort**: M.

#### G7. Marketing site / landing page brief

- **Priority**: P2.
- **Scope**: One-page brief: messaging, hero copy, screenshots, FAQ, mailing list.
- **Output files**: [[../00-Index/marketing-site-brief]] (new).
- **Dependencies**: G1, G2.
- **Estimated effort**: S.

#### G8. Support workflow

- **Priority**: P2.
- **Scope**: Channels (email / Discord / forum), tooling, SLA, escalation.
- **Output files**: [[../30-Implementation/support-workflow]] (new).
- **Estimated effort**: S.

#### G9. Community management plan

- **Priority**: P3.
- **Scope**: Discord setup, code of conduct, moderation, community programmes (modder spotlights).
- **Output files**: [[../30-Implementation/community-management]] (new).
- **Estimated effort**: M.

#### G10. Press kit + media list

- **Priority**: P3.
- **Scope**: Press kit assets, contacts, embargo policy.
- **Output files**: [[../00-Index/press-kit-brief]] (new).
- **Dependencies**: G7.
- **Estimated effort**: S.

#### G11. Launch checklist

- **Priority**: P2.
- **Scope**: T-30 to T-0 to T+30 task list across product / dev / marketing / support.
- **Output files**: [[../00-Index/launch-checklist]] (new).
- **Dependencies**: G3-G10.
- **Estimated effort**: S.

### H. Operations & release

#### H1. Incident response runbook

- **Priority**: P1.
- **Scope**: Severity levels, on-call, comms, post-mortem template.
- **Output files**: [[../30-Implementation/incident-response]] (new).
- **Dependencies**: F1.
- **Done 2026-05-17**: [[../30-Implementation/incident-response]] created with severity levels, first-15-minute flow, telemetry evidence sources, legal hold, communication cadence, common playbooks and post-incident review. F1 can later deepen security-specific response.
- **Estimated effort**: M.

#### H2. On-call setup

- **Priority**: P2.
- **Scope**: Rotation policy, alerting tool, escalation chain.
- **Output files**: [[../30-Implementation/on-call]] (new).
- **Dependencies**: H1.
- **Estimated effort**: S.

#### H3. Backup & recovery procedures

- **Priority**: P1.
- **Scope**: SurrealDB backups, retention, restore test cadence, customer save recovery.
- **Output files**: [[../30-Implementation/backup-and-recovery]] (new).
- **Dependencies**: E3, C5.
- **Estimated effort**: M.

#### H4. Production DB migration strategy

- **Priority**: P1.
- **Scope**: Zero-downtime migrations, schema rollouts, data backfills, rollback plan.
- **Output files**: [[../30-Implementation/db-migration-strategy]] (new).
- **Dependencies**: A4, E1.
- **Estimated effort**: M.

#### H5. Feature flag system

- **Priority**: P2.
- **Scope**: Flag types (boolean / percentage / segment), targeting, kill switches, audit.
- **Output files**: [[../30-Implementation/feature-flags]] (new).
- **Estimated effort**: M.

#### H6. A/B testing framework

- **Priority**: P3.
- **Scope**: Experiment definitions, allocation, analysis, ethics.
- **Output files**: [[../30-Implementation/ab-testing]] (new).
- **Dependencies**: F6, H5.
- **Estimated effort**: M.

#### H7. Analytics / metrics implementation

- **Priority**: P2.
- **Scope**: Event catalogue, schema, ingestion, dashboards.
- **Output files**: [[../30-Implementation/analytics-events]] (new).
- **Dependencies**: D11, F6.
- **Estimated effort**: M.

#### H8. Live-ops capabilities

- **Priority**: P3.
- **Scope**: Push campaigns, in-game messages, seasonal events, remote config.
- **Output files**: [[../30-Implementation/live-ops]] (new).
- **Dependencies**: E20, H5.
- **Estimated effort**: M.

#### H9. Release strategy + versioning

- **Priority**: P1.
- **Scope**: Semantic versioning policy, release cadence, branching, changelog discipline.
- **Output files**: [[../30-Implementation/release-strategy]] (new).
- **Dependencies**: A5.
- **Estimated effort**: S.

#### H10. Hotfix workflow

- **Priority**: P2.
- **Scope**: Hotfix branch policy, fast-track CI, post-hotfix backport.
- **Output files**: [[../30-Implementation/hotfix-workflow]] (new).
- **Dependencies**: H9.
- **Estimated effort**: S.

#### H11. Status page / public uptime

- **Priority**: P3.
- **Scope**: Status page choice, components, subscriber list.
- **Output files**: [[../30-Implementation/status-page]] (new).
- **Dependencies**: H1.
- **Estimated effort**: S.

### I. Game-design refinement (resolves Wave-2 "Open questions")

Each entry lifts the "Open questions" section of a `50-Game-Design/`
note from `draft` toward `approved`.

#### I1. Economy: currency + inflation

- **Priority**: P2.
- **Scope**: Currency model decision (per-country fictional or unified credits); inflation drift; owner injection effect on DNA.
- **Output files**: update [[../50-Game-Design/economy-system]].
- **Estimated effort**: S.

#### I2. Sponsor: stadium-naming policy per DNA

- **Priority**: P2.
- **Scope**: Tradition score threshold for naming acceptance; fan-segment penalty; long-term contract minimum.
- **Output files**: update [[../50-Game-Design/sponsorship-portfolio]].
- **Estimated effort**: S.

#### I3. Squad: multi-position roles + reserve-team modelling

- **Priority**: P2.
- **Scope**: Multi-position slot rules, "natural" badge, reserve-team match abstraction at MVP vs full sim Phase 2.
- **Output files**: update [[../50-Game-Design/squad-and-club-structure]].
- **Estimated effort**: S.

#### I4. Youth: partner schools + wonderkid tagging

- **Priority**: P2.
- **Scope**: Pre-academy partner schools (Phase 2), wonderkid emergent-tag rules.
- **Output files**: update [[../50-Game-Design/youth-academy-and-development]].
- **Estimated effort**: S.

#### I5. Training: training-camp + wellness

- **Priority**: P2.
- **Scope**: Training-camp special week-block, wellness/sleep flavour cards.
- **Output files**: update [[../50-Game-Design/training-load-and-medicine]].
- **Estimated effort**: S.

#### I6. Tactics: mentality slider vs bands + opponent-specific tactics (done 2026-05-17 - folded into D3)

- **Priority**: P2.
- **Scope**: Slider for Expert tier, bands for Standard; opposition-template library policy.
- **Done 2026-05-17**: locked by [[tactics-and-formations]] §6.3 (5 visible bands + 7 internal steps; no fiddly 21-step slider) and §9 (3-layer opposition template system: 8 archetypes + ~25-30 sub-archetypes + manager-signature templates + emergent club character).
- **Done outputs**: [[tactics-and-formations]] §6.3 + §9; [[../50-Game-Design/tactics-system]] §7 + §14.
- **Output files**: update [[../50-Game-Design/tactics-system]].
- **Estimated effort**: S.

#### I7. Set pieces: throw-in routines depth

- **Priority**: P3.
- **Scope**: Long-throw vs short-build, specialist sub-on-set-piece rule.
- **Output files**: update [[../50-Game-Design/set-pieces]].
- **Estimated effort**: S.

#### I8. Match engine: zone granularity + tick rate (done 2026-05-16)

- **Priority**: P1.
- **Q&A outcome (2026-05-16)** — locked in [[match-engine-simulation-model]]:
  - **18-zone grid** (3 vertical × 6 horizontal). Divides the 105 000 × 68 000 integer-mm pitch cleanly.
  - **Per-event tick** with integer-second `simClock` jumps; event durations sampled from typed ranges; clamped at period boundaries.
- **Done outputs**: [[match-engine-simulation-model]] §2 + §4 lock both. [[../50-Game-Design/match-engine]] §1.2 + §10 already reflect 18 zones; needs minor update to note per-event tick policy.
- **Dependencies**: D1 (done), D8 (done).
- **Estimated effort**: S (actual: S; folded into D1).

#### I9. Fans: per-segment churn + named ultras

- **Priority**: P2.
- **Scope**: Family→Core churn timing; aggregate vs named ultras at MVP.
- **Output files**: update [[../50-Game-Design/fan-ecology]].
- **Estimated effort**: S.

#### I10. Rivalry: cross-country rivalries

- **Priority**: P3.
- **Scope**: Continental-cup-driven rivalries, sub-score adjustments.
- **Output files**: update [[../50-Game-Design/rivalry-system]].
- **Estimated effort**: S.

#### I11. Roguelite: carry-slot growth + N-month insolvency tuning

- **Priority**: P1.
- **Why now**: Tunes the failure cadence of the signature mode.
- **Scope**: Carry-slot growth function (linear / log), N-month threshold (2-3 months), board-veto fail seasons (2 in a row).
- **Output files**: update [[../50-Game-Design/mode-create-a-club-roguelite]].
- **Estimated effort**: S.

#### I12. Career: confidence thresholds + reputation per-region

- **Priority**: P1.
- **Scope**: Warning vs sack threshold (30 / 15 tentative), per-region reputation vs global aggregate.
- **Output files**: update [[../50-Game-Design/mode-manage-a-club-career]].
- **Estimated effort**: S.

#### I13. Watch party: max-per-week + recording sharing

- **Priority**: P2.
- **Scope**: Max watch parties / week (1 tentative); replay-sharing outside the group (no).
- **Output files**: update [[../50-Game-Design/watch-party-and-conference]].
- **Estimated effort**: S.

#### I14. Community editor: league editor depth + scenario partial overlays

- **Priority**: P2.
- **Scope**: League editor depth at MVP vs Phase 2; partial-overlay scenario packs (e.g. alternate champion 2017).
- **Output files**: update [[../50-Game-Design/community-editor-and-datasets]].
- **Estimated effort**: S.

### J. Glossary & vocabulary

#### J1. Domain glossary expansion

- **Priority**: P1.
- **Scope**: ≥ 60 terms, de + en lemmas, subsystem owners, links to introducing notes.
- **Output files**: rewrite [[../00-Index/Glossary]]; [[game-glossary]] (new, per D19).
- **Dependencies**: D19.
- **Estimated effort**: M.

### K. User docs

#### K1. Player onboarding docs

- **Priority**: P3.
- **Scope**: First-time-user guide, tutorial mode walkthrough.
- **Output files**: [[../40-User-Docs/onboarding]] (new).
- **Dependencies**: D5.
- **Estimated effort**: M.

#### K2. Help-centre structure

- **Priority**: P3.
- **Scope**: Topic taxonomy, search, FAQ, support form.
- **Output files**: [[../40-User-Docs/help-centre-structure]] (new).
- **Dependencies**: G8.
- **Estimated effort**: S.

#### K3. Tutorial scripts

- **Priority**: P3.
- **Scope**: In-game tutorial steps, onboarding copy.
- **Output files**: [[../40-User-Docs/tutorial-scripts]] (new).
- **Dependencies**: K1.
- **Estimated effort**: M.

### L. Linear / project-management hygiene

#### L1. Wave-3 Linear epic

- **Priority**: P1.
- **Scope**: Create the "Wave-3 documentation backlog" epic in Linear; one sub-issue per Wave-3 gap entry above; cross-link to vault.
- **Output files**: Linear issues + back-references; no new vault file beyond a section in [[../30-Implementation/linear-task-tracking]].
- **Estimated effort**: M.

#### L2. Linear-vs-vault handoff audit

- **Priority**: P2.
- **Scope**: Verify Linear issues link back to final vault paths; align labels with current waves.
- **Output files**: update [[../30-Implementation/linear-task-tracking]].
- **Dependencies**: L1.
- **Estimated effort**: S.

#### L3. Cross-link audit

- **Priority**: P2.
- **Scope**: Every vault note must be reachable from a map; orphan list.
- **Output files**: update [[../00-Index/Home]] + the six maps.
- **Estimated effort**: S.

## 7. Dependency graph (high-level)

The diagram below shows only inter-group dependencies; intra-group
dependencies are listed in each entry.

```mermaid
flowchart TB
    subgraph D [D Tech Research]
      D1["R2-01 Match"]
      D2["R2-02 Generators"]
      D8["R2-08 Determinism"]
      D14["R2-14 SurrealDB"]
      D18["R2-18 Risk"]
    end

    subgraph A [A ADR rewrites]
      A2 --> D8
      A3 --> D1
      A3 --> D8
      A4 --> D2
      A4 --> D14
      A5 --> D8
      A7 --> D2
    end

    subgraph B [B ADR promotion]
      B4["B4 Outbox"]
      B6["B6 Spectator"]
      B7["B7 Editor"]
    end

    subgraph E [E Implementation]
      E1["E1 SurrealDB"] --> A4
      E1 --> D14
      E14["E14 Jobs"] --> B4
      E15["E15 Replay"] --> B6
      E18["E18 IDB schema"] --> A5
    end

    subgraph F [F Security]
      F1["F1 Threat model"]
      F6["F6 GDPR"] --> D11["R2-11 Telemetry"]
      F9["F9 Moderation"] --> B7
    end

    subgraph C [C arc42]
      C5["C5 Deployment"]
      C8["C8 Risks"] --> D18
    end

    subgraph H [H Ops]
      H3["H3 Backup"] --> C5
      H4["H4 DB Migrations"] --> A4
    end

    D --> A
    A --> B
    A --> E
    B --> E
    F1 --> C
    F1 --> H
```

## 8. Suggested execution waves

Each wave is a sensible batch of gaps that can be executed in a few
days. The waves are *not* strict; we may interleave gaps when
dependencies allow.

| Wave | Gaps | Goal |
|---|---|---|
| W3.0 | This document | Lock the backlog |
| **W3.A — Critical path** | A2, A3, A4, A5, B1, B2, B4, C5, D1, D8, D14, E1, E10, E11, E13, E14, E17, E18, F1, F2, F3, F6 | P0 baseline: data + match + offline + auth + GDPR + CI |
| **W3.B — Architecture and product foundations** | A1, A6, A7, A8, B3, B5, B6, B7, C1, C2, C3, C4, C6, C7, C8, D2, D3, D4, D5, D6, D7, D9, D11, D12, D13, D15, D16, D17, E2, E3, E7, E8, E12, E16, F5, F10, F11, F12, G1, G2, G3, G4, H1, H3, H4, H9, I8, I11, I12, J1, L1 | P1 batch: architecture + product + ops basics |
| **W3.C — Polish + completeness** | A9, D10, D18, D19, E4, E5, E6, E9, E15, E19, E20, E21, E22, E24, F4, F7, F8, F9, F13, G5, G6, G7, G8, G11, H2, H5, H7, H10, I1, I2, I3, I4, I5, I6, I9, I13, I14, L2, L3 | P2 batch |
| **W3.D — Nice-to-have** | E23, G9, G10, H6, H8, H11, I7, I10, K1, K2, K3 | P3 batch |

The wave column simply guides priority. Inside each wave we still pick
gap-by-gap based on dependencies.

## 9. Cross-references

- Plan-of-record this supersedes: [[research-wave-2-gaps]] (R2-01..R2-19
  IDs preserved verbatim in group D).
- Indexes updated when this lands: [[../00-Index/Current-State]],
  [[../00-Index/Research-Map]], [[00-summary]].
- Decision log: [[../00-Index/Decision-Log]].
- Vault governance + status rules: [[../90-Meta/vault-governance]].

## 10. Completion ledger

Append to this section as gaps complete. Format:

```text
- 2026-MM-DD  Gap <ID>  <Title>  →  <output file(s)>
```

- 2026-05-16  Gap **B1**  Promote ADR-0010 Modular Monolith + DDD  →  [[../10-Architecture/09-Decisions/ADR-0010-modular-monolith-ddd]] (accepted, retitled "Service-ready Modular Monolith"), [[../10-Architecture/bounded-context-map]] (status: current; strict storage isolation + service-extraction order)
- 2026-05-16  Gap **B2**  Promote ADR-0011 Server-Authoritative Multiplayer  →  [[../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]] (accepted; hotseat handoff + hybrid server-sim AI matches + encrypted saves + hard-reject offline conflict), [[../10-Architecture/state-machines/match]] (extended persistence with engine_version + match_type + AI vs AI seed-only storage), gap A5 (encryption locked as mandatory) and D12 (hotseat handoff locked) updated.
- 2026-05-16  Gap **B4**  Promote ADR-0013 Transactional Outbox  →  [[../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]] (accepted; SurrealDB outbox + Redis Streams; UUIDv7; tiered retention 60d hot + monthly cold archive forever; JSON+Zod forward-compat schema versioning; time-based lag alerting). Gaps E14, F10, E1, D14 updated with locked-from-B4 constraints.
- 2026-05-16  Gap **D8**  R2-08 Determinism / RNG / Replay  →  [[determinism-and-replay]] (PCG32 via pure-rand, 8 named RNG streams seeded via xxhash32, full-event-log replay for human matches + seed-only for AI vs AI, integers/basis-points throughout, 12 save-determinism rules, Chromium-only CI gate at MVP). Gaps A2, A3, A5, E11, I8 updated with locked-from-D8 constraints.
- 2026-05-16  Gap **D14**  R2-14 SurrealDB Schema Patterns  →  [[surrealdb-schema-patterns]] (hybrid per-save isolation = shared platform DB + DB per save; hybrid schema = SCHEMAFULL core + SCHEMALESS event tables; per-relationship modelling table; TS-first `packages/db-schema` mirror with `.surql` + Zod + types emit; explicit `pnpm db:migrate` release step; Dexie-only browser store at MVP, SurrealDB WASM as post-MVP research track; Live Queries for UI projections only + per-context `queryGateway` abstraction; skeleton schemas for all 11 bounded contexts). Gaps A4, E1, D12 updated with locked-from-D14 constraints.
- 2026-05-16  Gap **A4**  ADR-0004 Data Model depth rewrite (with Perplexity-backed Q&A) → [[../10-Architecture/09-Decisions/ADR-0004-data-model]] (accepted; rewritten from 11-line stub to full Decision Record: storage topology, SCHEMAFULL/SCHEMALESS hybrid, custom TS-first generator, per-relationship modelling, integer numeric representation, save lifecycle with soft 10 / hard 50 quota + archive flow, encrypted save envelope, Phase-2 hybrid cloud-sync, UUIDv7 IDs, multi-context coordination via queryGateway, forward additivity for women's football). Gaps A5, E1, E18 updated with locked-from-A4 constraints.
- 2026-05-16  Gap **A5**  ADR-0005 Save Format depth rewrite (with Perplexity-backed Q&A) → [[../10-Architecture/09-Decisions/ADR-0005-save-format]] (accepted; rewritten from 17-line stub to full Decision Record: two export modes [device-backup + portable-export-with-passphrase], AES-GCM 256, PBKDF2-SHA256 @ 600 000 iter., `CompressionStream('gzip')` compress-then-encrypt, three independent version fields, RNG state snapshot per D8, phased migration, restore + import flowcharts). Gaps E18, F4, F5 updated with locked-from-A5 constraints.
- 2026-05-16  Gap **A2**  ADR-0002 Offline-first depth rewrite (with Perplexity-backed Q&A) → [[../10-Architecture/09-Decisions/ADR-0002-offline-first]] (accepted; rewritten from 12-line stub to full Decision Record: capability matrix, `vite-plugin-pwa` `injectManifest`, hybrid smart update strategy, cross-browser outbox replay triggers + Chromium `BackgroundSyncPlugin` accelerator, conservative ~300 MB soft cap with 70 % warning, install UX after first match/save + ≥3 sessions, dedicated Sync/Activity view + badge + non-modal hard-reject banner + per-`rejected_with_reason` copy table, transient retry `0/10s/30s/2min/5min` cap 7). Gaps E2, E17, E19 updated with locked-from-A2 constraints.
- 2026-05-16  Gap **D1**  R2-01 Match Engine Simulation Model → [[match-engine-simulation-model]] (status: current, binding; hybrid Markov + attribute rolls, per-event tick with integer-second `simClock`, event schema with typed payloads, hybrid zone+role formation influence, strict `MatchCoreRng`/`MatchAiRng` separation, ≤ 50 ms / match perf budget, full test pyramid with 10 canonical golden replays + statistical envelopes + property-based + perf gate, three-phase implementation roadmap). Gaps A3, D9, E13, E11 downgraded effort due to locked foundation; I8 closed (folded into D1).
- 2026-05-16  Gap **A3**  ADR-0003 Match Engine depth rewrite (with Perplexity-backed Q&A) → [[../10-Architecture/09-Decisions/ADR-0003-match-engine]] (accepted; rewritten from 10-line stub to full Decision Record: package layout, framework-agnostic public API, hybrid Markov + attribute-rolls model, per-event tick, event schema, TS-literal formation zone weights + JSON community overrides, hybrid set-piece routines [MVP canonical library + Phase-2 per-club editor + community packs], namespaced slug ID convention, Worker bridge contract, engine-version semantics, ≤ 50 ms perf gate). Closes the match-engine track entirely.
- 2026-05-17  Gap **D9**  Performance budgets on low-end Android & iOS (with Perplexity-backed comparative competitor analysis + Q&A) → [[performance-budgets]] (status: current binding; comprehensive research note). Four-tier device matrix (Premium / Standard / Floor / Off-target). Tight CWV product targets (LCP p75 mobile ≤ 2.0 s, INP ≤ 120 ms primary flows, CLS ≤ 0.05). Lighthouse mobile ≥ 90 (block < 85), desktop ≥ 95. JS budgets initial ≤ 200 KB / total ≤ 700 KB. DOM ≤ 1500 nodes per route; tables virtualised. Frame budget p95 ≤ 12 ms; no matchday task > 50 ms. Heap by tier. World-size presets Small / Medium / Large. **Permanent product decision: no 3D match view ever**; two modes only - Text & Stats (Floor default) + 2D canvas (primary). Phased CI rig: emulated MVP → LambdaTest post-MVP → hardware rig only if needed. Carried into arc42 §Crosscutting §Performance; propagated to match-engine GDD + feature-gap-analysis (3D moved from "Could (deferred)" to "Won't"). Closes the perf-budgets track.
- 2026-05-17  Gap **D2**  Player & club generator algorithms (with Perplexity-backed comparative competitor analysis across 9 manager games + 8-question Q&A) → [[data-generators]] (status: current binding; comprehensive 15-section research note) + [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]] (accepted; rewritten from 10-line stub to full Decision Record).
- 2026-05-17  Gap **D15**  Narrative event content & authoring pipeline (with Perplexity-backed 2-axis research + comparative competitor analysis across 10 games + 9-question Q&A) → [[narrative-content-pipeline]] (status: current binding; comprehensive 18-section research note ~1500 lines). **All 9 recommendations accepted as-is — maximum scope locked.** **Authoring format**: Markdown + frontmatter source → compiled locale-split JSON + typed TS message-ID catalogues + story-arc graph JSON. **ICU library**: FormatJS / `intl-messageformat`. **Event taxonomy**: 106 stable event family IDs across 10 groups (Match 18 / Squad-Player 20 / Board-Finance 16 / Tactical-Training 6 / Career 9 / Competition 9 / National Team 6 / Personal Life 6 / Rumours-Press 9 / Records-World 7) with 3-7 reactive variants per family + storylet quality-gate model from Failbetter. Priority + frequency caps + spam guard with catch-up summary. **6 story arc state machines** (Transfer Saga / Takeover / Player Crisis / Bankruptcy / Rivalry / National Tournament). **5-tone press conferences** (Calm / Critical / Defiant / Self-Deprecating / Ambitious) × 4 contexts with cumulative season effects on media reputation + player morale + board trust + fan sentiment. **Auto-generated Anstoss-style newspaper** (weekly + monthly + season + decade per D6). **Multi-layer voice consistency**: per-sender voice cards (D5 10 senders) + per-AI-archetype reactions (D4 10 archetypes × ~106 event families × 3-7 tones = ~1500-2000 reaction-context slots) + CI lint rules ("Chairman never uses contractions" / "Assistant must use 'boss' or 'Chef' ≥ 1 in 3 messages" / etc.). **Personal life events layer** (Anstoss flavour; 6 family types toggleable On/Reduced/Off) tied to manager stressLevel quality. **Build-time-only LLM assistance** (NEVER runtime per D8); generates draft variants + tone drift detection + DE phrasing alternatives; human-reviewed; optional at MVP. **Translation workflow**: Markdown + Git + custom React preview app at MVP (variable picker + locale toggle + voice-card view + lint panel + diff). Post-MVP: Inlang or Tolgee. Avoid Lokalise/Crowdin/Phrase at indie scale. **Determinism**: extends D8 stream #9 with `generator:narrative:*` sub-labels (future-proof per D8 §2.3). Save snapshot includes active arc states + press conference history + newspaper archive + personal life state → byte-identical replay. **Performance**: ~95-145 KB gzipped per locale lazy-loaded; per save ~3-5 MB IndexedDB over 50 years. **Content scale**: MVP 80-120 templates → Phase 2 ~250 → Phase 3 ~500. **First PWA manager** to combine FM tagged event system + Anstoss Zeitung templating + Club Boss inbox cast + Failbetter storylet quality-gates + Disco Elysium voice consistency + Ink-style state-machine arcs, all deterministic + offline-first. **Closes the narrative content authoring track entirely** — paired with D5 (onboarding) + D6 (late-game) + D4 (AI managers) provides the full content pipeline for all in-game text.
- 2026-05-17  Gap **D6**  Late-game / end-game systems (with Perplexity-backed 3-axis research across continental cups + Bundestrainer + ownership/HoF/legacy/longevity + comparative competitor analysis across 10 manager games + CK3 + Civ + 10-question Q&A) → [[late-game-systems]] (status: current binding; comprehensive 15-section research note ~1000 lines). All 10 recommendations accepted as-is - maximum scope locked. **3-tier continental cup stack per continent** + **global IFC Club World Masters** with IP-safe fictional governing bodies (IFC / EFC / AFU / APFC / AFA). Classic 32-team groups + knockout at MVP; Swiss model deferred. Country coefficient with 5-year rolling window + biennial slot adjustment. Calendar with continental midweek windows + auto-rescheduling. Full prize money model. **Dual-role Bundestrainer mode** with 3 engagement levels (Full Control / Match-Only / Light Touch). Unlock at manager rep ≥ 75 + (5 seasons OR 3 trophies). IFC Nations Championship every 4y + Continental Championships offset 2y → big tournament every 2y. Full tournament management UX (training camp + group stage + knockouts + post-tournament). **Make Your Career creator** (Background + Coaching Badge + Tactical Specialisation + Nationality + Languages). **5-branch manager talent tree** (Tactician / Motivator / Youth Developer / Transfer Guru / International Specialist + capstones). **Region-based reputation** per country + continent + global. **6 owner archetypes**: Sugar Daddy / Asset Stripper / Foundation-Community / Petrol-State / Murky / Foreign Business. **Bankruptcy / administration** at MVP with Heroic Save HoF credit. **3-layer Hall of Fame**: Manager per-save + Manager cross-save global + Club per-save + Player Legends. **3-option Legacy mode**: Chairman / new manager / hard retire. **3-tier cross-save Legacy perks** (meta-only, world-gen-time only; deterministic-safe per D8). **Full 50-year save longevity stack**: career phases UI + generational regens ("Son of X") + Year-X events + cross-decade continental power shifts + Anstoss-style newspaper archive + records book. First PWA manager to ship this stack - combines Anstoss-3 Bundestrainer + FM-PC long-save depth + CK3 cross-save HoF + Civ era system + Hattrick record books. **Closes the late-game / endgame meta-layer track entirely** — paired with D5 (onboarding) + D3 (tactics) + D4 (AI managers) + A3 (match engine) + D2 (world) + D9 (perf), the entire user-facing arc from launch → first match → mastery → dynasty → legacy → cross-save bragging is locked.
- 2026-05-17  Gap **D5**  Strategic onboarding (with Perplexity-backed 3-axis research + comparative competitor analysis across 10 manager games + 8-question Q&A) → [[onboarding-strategy]] (status: current binding; comprehensive 18-section research note) + [[../50-Game-Design/onboarding-and-tutorial]] (new `approved` GDD; 14 sections). 60-second FTUE with single experience question silently mapping to UI tier + difficulty + recommended-club tier + tutorial verbosity. Mode picker upfront (both Career + Roguelite available day 0 per Nico's choice). "Advanced setup" escape opens full 5-screen New Save wizard. 12-message first-season inbox tutorial arc over 4 in-game weeks teaching match week / tactics / goals / match report / training / rotation / transfers / contracts / board confidence / set pieces / youth / soft-transition. 10-sender cast (Assistant ~50% / Chairman 15% / DoF 20% / Head Scout 10% + 6 supporting). Per-sender voice cards in `packages/game-data/src/inbox/voice-cards/`. Configurable named Assistant Manager ("Alex" default + 3-5 portraits + "No portrait" accessibility option) with sticky "Ask Assistant" FAB on key screens. Per-difficulty assistant intensity auto-scaling (Easy proactive → Sim silent) + user override toggle. Feed-card daily action queue as Home dashboard primary UI (Nico's choice over inbox-primary); 3-5 cards/day; Gmail-style swipe (right=complete/open, left=snooze+undo); priority algorithm time-pressure + impact-type + player-behaviour; per-difficulty queue behaviour. Tutorial overlay hierarchy (spotlight 3-4 max / coach marks 2-3 per screen first-visit only / hint chips / modal full-screen 1-2 per major system). "While you were away" recap auto-card after 7+ in-game days OR 14+ real days absent. Veteran skip with safety net (micro-tooltips + Settings reset + auto-detection of struggle). PWA install prompt per D9 budget. Subtle achievement celebrations. WCAG 2.2 AA / BITV 2.0 (linear semantic onboarding pages, focus-trapped coach marks, prefers-reduced-motion, redundant encodings, inbox Read-aloud via Web Speech API, one-handed mode, voice-control-friendly labels). Onboarding-state IndexedDB schema. Locale strategy EN source + DE second; ~80-120 templates × ~60 words = ~7-10k words per locale. Bundle ~110-150 KB gzipped lazy-loaded. Target retention D1 ≥ 30% / D7 ≥ 12% / D30 ≥ 5% (between Top Eleven gold-standard and FM Mobile). **Closes the user-facing journey track entirely** — paired with D3 + D4 the system now has: onboarding (D5) → tactics (D3) → AI opponents (D4) → match engine (A3) → world (D2) → perf budgets (D9). Every user-facing surface from launch to first match is locked.
- 2026-05-17  Gap **D3**  Tactics & formation depth on mobile (with Perplexity-backed 4-axis research + comparative competitor analysis across 10 manager games + 8-question Q&A) → [[tactics-and-formations]] (status: current binding; comprehensive 15-section research note) + [[../50-Game-Design/tactics-system]] (promoted from `draft` to `approved`). 20 formations (8 core + 12 advanced) approaching FM PC depth on mobile. 50 roles across 8 position groups. 0/6/18 player instructions + 1/5/8 team instructions per Quick/Standard/Expert. 5-band visible mentality + 7 internal steps. Standard global team instructions; Expert light per-phase overrides (4 phases). Full FM-style tactical familiarity (single bar 0-100, growth +4/+2/0 training × +3/match × continuity × weekly cap 8; decay 2/wk floor 20; SwitchModifier; piecewise penalty curve; ContinuityMatchFactor 1.0→0.80; new-manager Similarity partial carryover). Tactic slots 2/3/3 + saved presets 0/10/50 per tier. **3-layer opposition template system**: 8 archetypes + ~25-30 sub-archetype variants (3-4 per main) + manager-signature templates per D4's 10 AI archetypes + emergent club character (clubs accumulate historic counter-template fingerprint - no competitor does this). 3 universal touchline shouts (Encourage / Demand More / All-Out Attack). Tactical predictability penalty up to 5% (ties to D4 arms race). URL-encoded share codes per ADR-0016. Touch-first UI (tap-to-place primary, drag in Expert only; bottom-sheet role pickers; segmented controls; accordion instructions; 44×44 px touch targets). **Attribute schema reconciled with D2** (16 visible + 4 GK + 8 hidden on 1-20 scale; replaces previous incorrect "10+8+10+5 on 1-10" GDD claim). Closes I6 (mentality slider vs bands) effectively. Opens A8 (ADR-0008 Mobile-first UI) follow-up. **Closes the user-facing tactics track entirely** — paired with D4 (AI manager) the system now has clear inputs from both sides (user + AI) into the locked A3 match engine.
- 2026-05-17  Gap **D4**  AI manager / opponent behaviour (with Perplexity-backed 5-axis research + comparative competitor analysis across 10 manager games + 8-question Q&A) → [[ai-manager-behaviour]] (status: current binding; comprehensive 15-section research note). Three-layer architecture: utility AI core + light FSM situation classifier + heuristic constraints. 8 primary continuous personality traits + 3 derived; 10 starting manager archetypes; personality drifts ±0.2 over career. 4 difficulty modes (Easy / Normal / Hard / Sim) with FM-style "constraints + AI optimisation" approach (no AI stat cheats on Normal/Hard/Sim; Easy only gives minor user help). Out-of-match weekly tick per club within ~5-6 ms (transfers / contracts / squad / tactics / board / loans / youth / sponsors / facilities). In-match trigger-based decisions at HT/60/75/85/90 + event triggers (15-25 decision passes per match, ~25 ms total). World drift: wage inflation tied to success, progressive FFP, talent diffusion (40 % elite regens off-top), tactical arms race with opposition memory, board expectation escalation +1 tier per overperformance. Structural events: Rising Rival (~5y cycle) + Giant Collapse (~10y cycle). Full AI career arcs at MVP: job churn, retirement at 60-70, legendary detection, rival tracking (rival follows user's manager career not just current club). 12 dynasty achievements + arms race + expectation escalation at MVP; national team / Hall of Fame / legacy mode post-MVP. Uses pre-allocated `WorldAiMgmtRng` + `MatchAiRng` from D8 with hierarchical sub-labels. Bundle target 60-80 KB gzipped. Same `packages/ai-manager/` code path runs client-side (singleplayer) AND server-side post-MVP (async MP per ADR-0011). **Closes the simulation-can-run track entirely**: with D2 (clubs + players + crests) + D4 (AI managers) + A3 (match engine) + D9 (perf budgets), the world has clubs + players + AI managers + a deterministic engine to simulate them; the simulation is no longer empty. Fully procedural worldgen from a single seed; IP-clean by construction. Hybrid wordlist + phonotactic name gen across 7 Tier-1 locale buckets (DACH / British Isles / FR / ES / IT / Low Countries / Lusophone). Approved corpus sources: Wikidata CC0 + UK ONS + INSEE + ISTAT + CBS + GeoNames CC-BY 4.0; forbidden: Behind the Name, Wikipedia raw CC-BY-SA, Common Crawl, unlicensed GitHub. Living-person filter on Wikidata pull. "Real-region + fictional city" location policy with Bloom-filter rejection of real GeoNames cities. Grammar-based crest generation (7 shields × 8 divisions × 10 region-biased palettes × 40-50 charges) with lazy SVG render + IndexedDB cache; ~30-40 KB gzipped crest module. Pure SVG (no WebGL / 3D per D9). 5-tier × 10-country club finance matrix (DE / EN / ES / IT / FR / PT / NL / BR / AR / JP) with log-normal money + truncated-normal prestige. 16 visible + 4 GK + 8 hidden meta player attribute schema on 1-20 scale. Hybrid archetype-first + CA budget Dirichlet allocator across ~50 archetypes; **lazy expansion** for Tier C players (compact 12-byte profile; full attrs on demand) fitting ≤ 8 s Large-world genesis on Snapdragon 695. Adds RNG stream #9 `GeneratorRng` to D8 (future-proof per D8 §2.3 - first exercise of label-derived seed extensibility). CI enforces 0 real club / player / coach names in shipped corpora. Closes the worldgen track entirely.
