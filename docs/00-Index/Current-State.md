---
title: Current State
status: current
tags: [meta, current-state, execution, hot]
created: 2026-05-16
updated: 2026-05-18
type: index
binding: true
related: [[Agent-Onboarding]], [[Project-Goals]], [[Decision-Log]]
---

# Current State

Hot-memory snapshot. Update this in the same PR as any change to architecture,
scope, operations, or status. Move durable detail into ADRs, approved specs, or
current research notes.

This page is the first stop for active project context. If another note conflicts
with this page, prefer the accepted ADR or approved/current note linked here.

## Active Product Direction

- [Project Goals](Project-Goals.md) defines mission, boundaries, and milestones.
- The game is an offline-first, IP-clean football manager PWA.
- German is the primary UI language.
- User-facing docs are output documentation, not implementation authority.
- Game design lives in approved system notes and the GDDR decision-record set in
  [[../50-Game-Design/README]]. Implement only from approved records; conflicts
  between approved game-design records are stop conditions until superseded.

## Approved product rules (Wave 2, 2026-05-16)

- **Mode matrix**: one simulation core, two content modes
  ([[../50-Game-Design/mode-create-a-club-roguelite|Create-a-Club Roguelite]]
  and [[../50-Game-Design/mode-manage-a-club-career|Manage-a-Club Career]]),
  two session modes
  ([[../50-Game-Design/singleplayer-baseline|Singleplayer]] and
  [[../50-Game-Design/async-multiplayer-private-group|Private Async Group]]).
  Private groups are locked to one content mode at creation.
- **Async cadence**: two rule sets, **Fixed** (default) and **Dynamic**
  (quorum + countdown). Switch only at season boundary.
  ([[../50-Game-Design/async-multiplayer-private-group]])
- **Progressive disclosure**: three explicit UI tiers - Quick / Standard /
  Expert. Default Standard.
  ([[../50-Game-Design/progressive-disclosure-ui]])
- **Player strength presentation**: Impact-first, no global OVR. Squad,
  tactic, scouting and transfer recommendations use role/tactic-contextual
  Impact Lens projections, category bars, status signals and scouting
  confidence instead of universal stars or Overall ratings.
  ([[../60-Research/player-strength-presentation]],
  [[../50-Game-Design/progressive-disclosure-ui]],
  [[../50-Game-Design/tactics-system]])
- **Singleplayer is the baseline**: every system ships first in
  singleplayer; multiplayer rules are additive constraints.
  ([[../50-Game-Design/singleplayer-baseline]])
- **Match engine gameplay profile**: event-based 2D simulation with
  intervention points, Result / Event / Spatial / Analytics output
  layers, explicit match-depth profiles and server-authoritative MP.
  ([[../50-Game-Design/match-engine]])
- **Player lifecycle and systemic events**: squad structure, player
  development, training/medicine, stadium/campus and match-day event
  specs are approved. Development is weekly and causal; PA is true hidden
  potential plus scouting uncertainty; injuries are multifactor risk
  events; venue operations are weekly/event-based Club Management rules;
  narrative is deterministic rendering of structured facts.
  ([[../60-Research/systemic-events-player-development-venue-ops]],
  [[../50-Game-Design/squad-and-club-structure]],
  [[../50-Game-Design/youth-academy-and-development]],
  [[../50-Game-Design/training-load-and-medicine]],
  [[../50-Game-Design/stadium-and-campus]],
  [[../50-Game-Design/matchday-event-engine]])

## Active Architecture

- [Decision Log](Decision-Log.md) lists accepted, draft and proposed ADRs.
- The stack baseline is TanStack Start/Router, React, shadcn/ui, Tailwind,
  SurrealDB, Dexie, Vitest, Playwright, Biome, Docker, Dokploy, and pnpm.
- Server-only secrets stay behind server functions or server-only modules.
- SurrealDB access flows through the project DB client and parameterized queries.
- Game saves live in IndexedDB via Dexie.
- Observability is self-hosted by default: OpenTelemetry JS +
  Grafana Loki / Prometheus / Tempo / Alloy + Grafana, with GlitchTip
  for crash/error reporting. See
  [[../10-Architecture/09-Decisions/ADR-0017-observability-logging]].

## Proposed architecture direction (Wave 2, 2026-05-16)

The Wave 2 ingestion proposes ADR-0010..ADR-0016 (see
[[Decision-Log]]). They are non-binding until Nico promotes them. Highlights:

- DDD modular monolith with 11 bounded contexts
  ([[../10-Architecture/bounded-context-map]]).
- Server-authoritative multiplayer with command-only clients.
- Both async cadence models, switchable at season boundary.
- Transactional outbox for reliable domain-event publication.
- Explicit state machines for League / Transfer / Watch-Party / Match.
- Watch parties via spectator snapshot streaming with delay.
- Community datasets via versioned override packs.

## Active Vault Rules

- [../90-Meta/vault-governance.md](../90-Meta/vault-governance.md)
- [../90-Meta/agent-memory-protocol.md](../90-Meta/agent-memory-protocol.md)
- Superseded notes are historical only.
- New approaches must update this page or the relevant map.

## Active Maps

- [Architecture Map](Architecture-Map.md)
- [Game Design Map](Game-Design-Map.md)
- [Feature Map](Feature-Map.md)
- [Research Map](Research-Map.md)
- [Implementation Map](Implementation-Map.md)
- [User Docs Map](User-Docs-Map.md)

## Wave 3 backlog active (2026-05-16)

[[../60-Research/wave-3-gap-analysis]] is the **single backlog of record**
for all remaining documentation + architecture work. 123 gap entries
across 12 groups (A-L), prioritised P0-P3, with a per-gap workflow of
Perplexity MCP research → synthesis + Q&A → final vault docs.
Wave 2 gaps ([[../60-Research/research-wave-2-gaps]]) are superseded; their
R2-01..R2-19 IDs are preserved under Wave 3 group D for traceability.

Start critical-path work from W3.A (P0): data model, match engine,
offline-first, auth, GDPR, CI/CD, threat model, SurrealDB schemas.

## Threat model active (2026-05-18)

[[../60-Research/threat-model]] is the binding security reference for
the project (Wave 3 gap F1). It locks:

- **Attacker scope** (T0-T4 in, T5-T6 partial, T7-T9 out) — any
  expansion needs an ADR + update to this note.
- **STRIDE catalogue** of 41 concrete threats per bounded context with
  bound controls referencing ADR-0002 / 0005 / 0011 / 0013 / 0017 /
  0019 + OWASP ASVS v5 L2 + NIST SP 800-38D / 63B / 92 / 190 +
  SLSA v1.0.
- **Trust-boundary diagram** across Client / Edge / App / Match Worker
  / DB / Redis / Observability planes.
- **Cryptographic refinements** to ADR-0005: PBKDF2 stays MVP, Argon2id
  when portable-export UI ships; 1M-encryption soft cap per content
  key; compress-then-encrypt safe at rest; no XChaCha20-Poly1305 at
  MVP.
- **9 residual risks** explicitly accepted with re-evaluation triggers.

Anchors downstream gaps F2 / F3 / F5 / F6 / F10 / F11 / F12 / F13 /
C6 / C8 / D18. Seven product-level open questions surfaced for Nico
(see §8 of the note).

## Auth flows locked (2026-05-18)

[[../30-Implementation/auth-flows]] is the binding spec for the
user-facing auth surfaces (Wave 3 gap F2). It locks:

- **Credential model** — passkey-first sign-up + login with password
  fallback; opt-in TOTP / WebAuthn-as-MFA; 10 single-use recovery
  codes; "cannot recover" stance if all credentials are lost
  (matches privacy-first posture).
- **Sensitive-op catalogue + step-up MFA** with `stepup_mfa_max_age`
  15 min and `reauth_max_age` 12 h.
- **Cookie + token shape** F3 must implement: opaque session-ID +
  Redis lookup (not JWT); `session_id` SameSite=Lax, `refresh_token`
  SameSite=Strict on Path=`/api/auth/refresh`, refresh-token
  rotation with reuse detection.
- **Three-layer CSRF defence** — SameSite + `Origin`/`Sec-Fetch-Site`
  enforcement + double-submit token.
- **`accountSecret` bootstrap contract** — once-per-device delivery
  via `GET /api/auth/account-secret/bootstrap` after authenticated
  session, immediately wrapped client-side as a non-extractable
  AES-GCM `CryptoKey` per F1 §5.4 and ADR-0005 §3.
- **No external IdP / no CAPTCHA / no SMS at MVP** — schema +
  abstraction provisioned now (`user_identity` table,
  `ExternalIdentity` value-object, `openid-client` chosen) so post-
  MVP addition is additive.
- **Redis-based progressive throttling** and **anomaly signal
  starter set** (new-device, new-country, impossible-travel,
  credential-stuffing, password-reset storm, signup storm, global
  fail spike); no auto-lockout at MVP.
- **Argon2id** for password storage with calibrated 2026 params
  (128 MiB / time 3 / parallelism 1, ~150–250 ms target).

Anchors F1 (threat model). Binds inputs for F3 Session management,
F5 Account recovery (stable account-master-key envelope), F6 GDPR
compliance (DSAR + DPIA on `accountSecret`), F12 Rate limiting.
Surfaces 7 product-owner Q&A questions and 9 follow-up tasks
(FU-1..FU-9) for the downstream gaps.
## Session management locked (2026-05-18)

[[../30-Implementation/session-management]] is the binding spec for
the server-side session and refresh-token lifecycle (Wave 3 gap F3).
It locks:

- **Redis hot store + SurrealDB outbox audit mirror** as the
  persistence model; AOF + RDB on the Hetzner box; SurrealDB never
  rehydrates Redis on cold start (force re-sign-in is the simplest
  safe behaviour).
- **Lifetimes**: 30 min idle / 12 h absolute on `session_id`;
  30 d refresh-family absolute; **15-second rotation grace window**
  with strict reuse detection outside it.
- **Slide-on-meaningful-activity** with 60 s rate-limit on Redis
  writes (Service-Worker and background prefetch never bump the
  timer).
- **Cross-tab logout/login broadcast** via BroadcastChannel +
  localStorage sentinel fallback; SSE push deferred to FU-2.
- **Revocation matrix**: 15 triggers (explicit logout, log-out-
  everywhere, per-device, password change/reset, MFA changes,
  recovery-code use, accountSecret rotation, email change, account
  lock, account delete, refresh-token reuse, operator emergency,
  idle/absolute expiry) × scope × outbox event; **hybrid
  `tokenVersion` + family-revoke** so identity-changing events take
  one atomic write while session-table family-revoke handles
  granular per-device cleanup.
- **`device` SCHEMAFULL table** with explicit separation between
  user-visible "Devices" (only after successful auth) and
  operational sessions; client-generated 128-bit `device_id` in
  IndexedDB; **no browser fingerprinting**.
- **"Trust this device"** opt-in 30-day MFA-skip with hard cap and
  anomaly-downgrade; never bypasses primary factor or step-up.
- **Per-device revoke** signs out sessions but does NOT rotate
  `accountSecret` by default (offline-first parity with Signal /
  1Password / Bitwarden); a separate "Sign out everywhere AND
  rotate security key" flow exists for known-compromise.
- **Offline-first reconnect**: silent refresh when family is still
  valid; non-modal "Cloud sync paused" banner when family expired;
  local progress never lost.
- **TanStack Start integration patterns**: `getSessionFromRequest`
  server helper, `createAuthedServerFn` higher-order wrapper
  enforcing `authorize(actor, action, resource)` + CSRF + Origin /
  `Sec-Fetch-Site` + optional step-up; `_authed/` route guard via
  `beforeLoad`; SSR hydration of minimal actor blob; singleton
  client-side CSRF interceptor; Workbox SW network-first on authed
  HTML + complete bypass of `/api/auth/**`.
- **Admin CLI** for emergency revoke at MVP (admin UI deferred to
  post-MVP).
- **Future-proof extension fields** provisioned now (`idp_provider`,
  `idp_sub`, `org_id`, `org_roles`, `session_purpose`, DPoP
  reservation per RFC 9449).
- **Compliance**: full ASVS v5.0 V7 + V8 mapping + NIST SP 800-63B
  rev. 4 §7 anchors + RFC 6819 / OAuth 2.1 draft refresh-token
  guidance.

Anchors F1 (threat model) and F2 (auth flows). Binds inputs for
F5 (stable account-master-key envelope, FU-7), F6 (DSAR + DPIA,
FU-8), F12 (edge WAF + per-endpoint quotas, FU-9). Surfaces 7
product-owner Q&A questions and 9 follow-up tasks.
## Account recovery locked (2026-05-18)

[[../30-Implementation/account-recovery]] is the binding spec for
the master-key envelope and the full recovery-flow set (Wave 3 gap
F5). It locks the architectural shift that closes F2 FU-1 and
F3 FU-7: a stable inner master key `K` survives all rotations of
the user-visible secret; only the small envelope is re-wrapped.

- **Stable inner `K`** (256-bit AES-GCM, non-extractable on every
  device, never seen by server) + **canonical user-level envelope**
  `Env_user = AES-GCM-256(K, KEK_user)` with
  `KEK_user = PBKDF2-SHA256(accountSecret, userSalt, 600 000)`.
- **No cross-device protocol on rotation**: re-wrap `Env_user` once;
  other devices fetch the new `Env_user` on re-login. Per-device
  envelopes are an optional offline-cache optimisation, not a
  security primitive.
- **Three recovery flows**: email password reset (mandatory
  `accountSecret` rotation, full session revoke); recovery-code
  use (10 single-use codes with their own envelopes, mandatory
  regeneration of the full set + `userSalt` rotation on use);
  "Sign out everywhere AND rotate security key" (Settings).
- **Cannot-recover cliff confirmed**: passkey + password + all 10
  codes lost → account unrecoverable by design; portable-export
  with remembered passphrase is the only escape path.
- **F2 → F5 lazy migration**: per user on first F5-enabled login;
  one-shot save re-encryption inside the migration transaction
  (~1-2 s for a typical user); idempotent; offline-compatible.
- **Atomic rotation algorithm** with Redis `rotation_lock` + 60-s
  TTL + idempotency-key replay protection + SurrealDB transaction
  wrapping `accountSecret` update + `env_user` swap +
  `account_secret_version++` + `envelope_version` bump +
  `token_version++` + cache wipe + outbox emission.
- **Versioned envelope wire format** with full AAD binding;
  `envelopeVersion = 2` reserved for Argon2id (post-MVP portable
  export UI), `envelopeVersion = 3` reserved for HPKE / RFC 9180
  (post-quantum migration), `wrapMode = 'shared_save'` reserved
  for Phase-2 cloud MP per-member content keys.
- **Web Crypto mechanics** spelled out: generate `K` as
  `extractable: true` for the wrap step, then re-import as
  `extractable: false` for runtime use; `wrapKey/unwrapKey`
  semantics keep `K` out of JS heap; `CryptoKey` survives
  `IndexedDB.put()` round-trip on Chrome / Edge / Firefox /
  Safari 16+; constant-time error UX via uniform
  `InvalidEnvelopeError`.
- **10-row attack mitigation matrix** on recovery surfaces
  (reset-email intercept, recovery-code phishing / stuffing /
  replay, oracle timing, email-change → reset chain, server
  compromise, rollback, envelope transplant).
- **Compliance**: full NIST SP 800-130 + 800-63B §6 + 800-132 +
  800-38D + 800-57 Pt. 1 + OWASP ASVS v5 V6 + V11 mapping.

Anchors on F1 (threat model) + F2 (auth flows) + F3 (session
management); closes F2 FU-1 + F3 FU-7. Surfaces 6 Q&A questions
(all defaults sensible) and 9 deferred follow-ups (FU-1..FU-9)
to F4 / F6 / E10 / E11 / post-MVP.

## Transfer market blueprint active (2026-05-17)

[[../60-Research/transfer-market-simulation]] is the current binding
research synthesis for the active transfer market. It promotes Nico's attached
research into the project model:

- market value is a reference range, not a final price;
- AI selling compares `sellPressure` against `protectionScore` and uses hard
  floors to prevent token-fee sales of protected players;
- offers are multi-part clause packages priced by cash-equivalent value;
- club agreement and player / agent terms are separate gates;
- full negotiation depth is tiered by world proximity for D9 PWA budgets.

Nico resolved the initial open decisions on 2026-05-17:

- full clause-family integration belongs in the MVP foundation;
- Expert UI should show clear numeric values when knowledge supports them,
  with confidence / source breakdown;
- Transfer Scope should be a save setting with Focused / Standard / Deep /
  Custom presets;
- training compensation / solidarity become simplified visible training rewards
  (net-only in Quick, full waterfall in Expert);
- agents stay simple at MVP but use stable future-ready profiles.

Implementation should start from
[[../10-Architecture/transfer-market-architecture]],
[[../50-Game-Design/transfer-market-and-contracts]] and
[[../20-Features/feature-transfer-market-ai-and-contracts]].

## Accepted architecture (Wave 2/3)

- **ADR-0019 Service-ready Modular Monolith with DDD** (accepted
  2026-05-16, gap B1). Eleven bounded contexts, strict storage
  isolation, network-transparent contracts. The MVP ships as one
  process but every context is extractable into its own service
  without code changes - only deployment / infra changes.
  See [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]
  and [[../10-Architecture/bounded-context-map]].
- **ADR-0011 Server-Authoritative Multiplayer** (accepted 2026-05-16,
  gap B2). Server is the only authority for MP state. New product
  rules locked in this gap:
  - **Hotseat handoff**: a local hotseat save can be promoted into an
    async MP group via a one-way server-validated upload. After
    acceptance the device save is read-only for the promoted club.
  - **AI vs AI match policy**: server simulates every fixture with the
    same deterministic engine contract and a relevance-based quality
    profile. Human-involving matches store full event logs. AI vs AI
    matches store seed + lineups + tactics + quality profile + summary
    and re-simulate deterministically on demand (watch-party / audit).
  - **Encrypted saves**: AES-GCM 256 via Web Crypto API, PBKDF2 KDF
    from account secret + device salt. Tampering breaks the save.
    Mandatory in ADR-0005 (locked by B2).
  - **Offline conflict policy**: hard-reject with `rejected_with_reason`
    + show new state. No auto-rebase at MVP.
- **Narrative Content & Authoring Pipeline** (locked 2026-05-17, gap D15) -
  [[../60-Research/narrative-content-pipeline]]:
  - **Authoring format**: Markdown + frontmatter source
    (`packages/game-content/src/**/*.md`) → compiled locale-split
    JSON catalogues + typed TS message IDs + story-arc graph JSON.
    Writer-friendly (Git-reviewable; diffable) + dev-friendly
    (type-safe; lintable). Build pipeline: parse → validate → ICU
    syntax check → placeholder check → voice-card lint → locale-
    split compile → typed catalog emit.
  - **ICU library**: FormatJS / `intl-messageformat`. Generated TS
    types for message IDs + variable shapes (missing/extra vars
    fail CI). Plural / select / number / date formatting + nested
    ICU + gender-aware DE variants.
  - **Event family taxonomy**: **106 stable event family IDs** across
    10 groups (Match 18 / Squad-Player 20 / Board-Finance 16 /
    Tactical-Training 6 / Career 9 / Competition 9 / National Team
    6 / Personal Life 6 / Rumours-Press 9 / Records-World 7). Stable
    save-compatibility; variants/tones hang off families.
  - **Reactive variants**: 3-7 per family by tone + context flags
    (`opponent_strength`, `rivalry_level`, `streak_before`,
    `xg_diff`, `is_decider`, `owner_archetype`, `manager_archetype`).
    Storylet quality-gate model adapted from Failbetter Games.
    Variant selection via deterministic seed
    `hash(eventId + managerId + triggerDate)`.
  - **Priority + frequency caps**: HIGH always-shown (match results
    / sackings / takeovers / major transfers / trophy + relegation
    turning points; max 3/day); MEDIUM 3-4/week (transfer rumours /
    wantaway / board confidence / form streaks / national call-ups /
    records); LOW 1-2/week (opinion columns / fan reactions /
    rumours / personal life / tactical identity). Spam guard with
    catch-up summary on rollover.
  - **6 story arc state machines** at MVP:
    - **Transfer Saga** (4-6 beats): rumour → bid → negotiation →
      decision → aftermath
    - **Takeover Saga** (3-5 beats): rumour → confirmation → manager
      uncertainty → integration → retrospective
    - **Player Crisis** (4-7 beats): form dip → leaks → agent
      contact → press escalation → resolution → epilogue
    - **Bankruptcy / Administration** (5-8 beats; per D6 §6.4):
      warning → operational pain → admin → fire sale → White Knight
      OR decay → heroic save path → retrospective
    - **Rivalry Storyline** (ongoing per-season): per-rival H2H
      tracking + provocative press + manager succession
    - **National Team Tournament** (5 beats; per D6 §4): pre-
      tournament → group stage → knockouts → final → post-
      tournament
    - Each arc = `arcInstanceId + currentBeat + participants +
      flags + history + seedKey + startedAt + expiresAt`; saved in
      `narrative_arcs` IndexedDB object store; resumable across
      reloads.
  - **Press conferences** (5 tones × 4 contexts):
    - **5 tones**: Calm-Diplomatic / Critical / Defiant /
      Self-Deprecating-Humorous / Ambitious-Bullish
    - **4 contexts**: pre-match (vs important opponent / rival /
      underdog) / post-match (after win / draw / loss) / transfer
      window (signing / sale / rumour denial) / scandal-crisis
      (player issue / financial concern)
    - 2-4 questions per presser
    - **Cumulative effects** over season: `media_reputation` tag
      (RESPECTED / OUTSPOKEN / FIREBRAND / CHARISMATIC / BOLD /
      DULL) + `player_morale[mentioned]` deltas + `board_trust`
      deltas + `fan_sentiment` deltas. Stored in `press_history`
      per season.
  - **Newspaper generation** (auto from event log, per D6 §11.5):
    - Weekly: 2-4 headline candidates (upset factor / scoreline /
      narrative richness)
    - Monthly: opinion piece with `OVERACHIEVING` /
      `UNDERACHIEVING` / `MANAGER_UNDER_PRESSURE` flags
    - End-of-season: champions / promoted / relegated / surprise
      package / flop / top scorer
    - Decade retrospective: era labels + dynasty narratives + rival
      arcs
    - All deterministic via `hash(worldSeed + week + leagueId +
      'newspaper-weekly')` etc.
  - **Multi-layer voice consistency system**:
    - **Per-sender voice cards** (D5 locked; 10 senders): tone
      keywords + signature phrases + banned phrases + address style
      per locale + contractions allowed / forbidden + sentence
      length + emotional range + signoff allowed + 3 sample
      sentences per locale
    - **Per-AI-archetype reaction styles** (D4's 10 archetypes ×
      event-family tone weights = ~1500-2000 reaction-context
      slots). E.g. Chaos Motivator after heavy loss: DEFIANT 0.6 /
      CRITICAL 0.3 / CALM 0.1. Stabilizer after heavy loss: CALM
      0.6 / ANALYTICAL 0.3 / RESPONSIBLE 0.1.
    - **CI lint rules**: "Chairman never uses contractions" /
      "Assistant Manager must use 'boss' or 'Chef' in ≥ 1 in 3
      messages" / "Journalist must use a rhetorical question in
      70 % of messages" / "Family messages must avoid tactical
      jargon" / etc. Lint runs in `pnpm narrative:lint`; blocks PR
      on violations.
  - **Personal life events layer** (Anstoss flavour; toggleable):
    - 6 family types: `LIFE_FAMILY_COMPLAINT_TIME` /
      `LIFE_HEALTH_BURNOUT_WARNING` /
      `LIFE_VACATION_OPPORTUNITY_OFF_SEASON` /
      `LIFE_PUBLIC_APPEARANCE_TV_OR_INTERVIEW` /
      `LIFE_CHARITY_EVENT_OR_LOCAL_COMMUNITY_STORY` /
      `LIFE_OFF_FIELD_SCANDAL_RISK`
    - Tied to manager `stressLevel` quality (0-100), updated based
      on event log (high-pressure events increase stress; trophies
      / wins decrease)
    - **Settings toggle**: On (full) / Reduced (1 per in-game
      month) / Off (none)
  - **Build-time LLM assistance** (NEVER runtime per D8):
    - Variant draft generation (3-5 alternatives per template)
    - Tone drift detection (catches voice-card violations rule-
      based linter missed)
    - DE phrasing alternatives suggestions in PR comments
    - Cross-locale consistency check
    - Always human-reviewed before merge
    - **Optional at MVP** (can ship without; add post-MVP at scale)
  - **Writer + translator workflow** at MVP:
    - Markdown + frontmatter source in Git
    - Custom React preview app (`pnpm narrative:preview`): variable
      picker + locale toggle + voice-card view + lint panel + diff
      view + search
    - Translator workflow: same Markdown files (EN + DE sections
      adjacent); CI validates ICU syntax + placeholder consistency
      + missing translations
    - **Post-MVP platform evaluation**: Inlang (typed message
      workflows; modern dev-friendly) OR Tolgee (in-context
      translation). Avoid Lokalise / Crowdin / Phrase at indie
      MVP scale.
  - **Determinism + RNG**: extends D8 stream #9 `GeneratorRng`
    with `generator:narrative:*` sub-labels per D8 §2.3 future-
    proof. Save snapshot includes active arc states + press
    conference history + newspaper archive + personal life state →
    byte-identical replay.
  - **Performance + storage**:
    - Bundle: ~95-145 KB gzipped per locale lazy-loaded (within
      D9 per-route ≤ 200 KB)
    - IndexedDB: per save ~3-5 MB narrative data over 50 years
    - MVP content: 80-120 templates × ~60 words avg = ~10k words
      per locale; Phase 2: ~30k; Phase 3: ~60k.
  - **First PWA manager to combine**: FM tagged event system + Anstoss Zeitung
    templating + Club Boss inbox cast + Failbetter storylet quality-
    gates + Disco Elysium voice consistency + Ink-style state-
    machine arcs, all deterministic + offline-first.
- **Late-Game Systems** (locked 2026-05-17, gap D6) -
  [[../60-Research/late-game-systems]]:
  - **Continental cup stack** (IP-safe per ADR-0007):
    - Fictional governing bodies: **IFC** (global) / **EFC**
      (Europe) / **AFU** (Americas) / **APFC** (Asia-Pacific) /
      **AFA** (Africa).
    - **3 tiers per continent**: Champions Cup / Continental League
      / Challenge Trophy.
    - **Global**: IFC Club World Masters (32 clubs from continental
      Champions Cups; pre-season super-tournament).
    - **Format**: classic 32-team groups + knockout at MVP (Swiss
      model deferred). Group winners drop into Tier-2 KO; cup winners
      auto-qualify higher tier next season.
    - **Qualification**: per-country slot allocation by initial
      ranking (EN/ES/IT 4 / DE/FR 3 / PT/NL 2 in Champions Cup);
      defending Champions Cup holder auto-qualifies; Continental
      League winner gets next Champions Cup slot.
    - **Country coefficient**: 5-year rolling window; biennial slot
      adjustment (+1 for top 3 / -1 for bottom 2; capped 1-5).
    - **Calendar**: continental midweek windows (Tue/Wed/Thu);
      league fixtures auto-rescheduled; "continental batch days"
      for perf.
    - **Prize money** (illustrative): Champions Cup max ~74.5M
      (10 participation + 8.5 group + 9 R16 + 10 QF + 12 SF + 25
      winner); Continental League ~30-35M max; Challenge Trophy
      ~12-15M max.
    - Anti-staleness integration with D4: rep boosts on
      qualification + winning; Rising Rival flagging via Continental
      League / Challenge Trophy overachievement.
    - National team competitions: **IFC Nations Championship**
      every 4y + **Continental Championships** offset 2y → big
      tournament every 2y.
  - **National team mode** (Bundestrainer arc):
    - **Dual-role** with **3 engagement levels**: Full Control /
      Match-Only (AI prepares squad; user one-tap confirms) / Light
      Touch (user only handles major tournaments).
    - Default level matches D5 experience question (Veteran = Full
      Control / Bit = Match-Only / Newbie = Light Touch).
    - **Top-nav toggle** `[Club] / [Nation]` with "Next Action" bar
      showing context.
    - **Unlock**: manager rep ≥ 75 AND (5+ seasons OR 3+ major club
      trophies).
    - **Job offers** spawn post-tournament + on board confidence
      < 20. Direct offer if user in top 3 candidates; "Apply" via
      Job Center otherwise. Priority: matching nationality + recent
      success in country + global rep.
    - **Squad**: 23 players (3 GKs + 20 outfield) for tournaments
      AND call-up windows.
    - **Eligibility** per D2 §10.4: birth + up to 2 heritage
      countries. Friendly caps don't lock; first competitive senior
      match permanently commits.
    - **Call-up windows**: Friendly (2 matches) + Qualifying (2
      matches); save & reuse "squad templates".
    - **Caps + international retirement**: 30+ players may retire
      from internationals; persuasion dialog for stars.
    - **Captaincy**: defaults from leadership + caps; vice = second.
    - **Calendar conflict**: international windows fixed FIFA-style;
      league matches auto-reschedule; same-day clash forces "which
      bench will you take?" with auto-managed for the other.
    - **Tournament management UX**: 23-man squad selection + 3-focus
      training camp (Tactical / Physical / Spirit) → group stage 3
      matches in 10 days with rotation pressure → single-elim
      knockouts with penalty shootout UX → post-tournament media
      debrief (3 dialogue choices) + board review.
  - **Make Your Career manager creator** (FM-style replayability):
    - **Background**: Sunday League (low start, underdog) / Semi-Pro
      / Ex-Pro Player (high start; Motivator+Tactician weighted) /
      Ex-DoF (Transfer Guru weighted). Affects starting rep +
      talent-tree seed.
    - **Coaching Badge**: National C / B / A / Pro. Studyable over
      time (costs money + time; yields attribute / talent unlock +
      rep boost).
    - **Tactical Specialisation** (primary + secondary): Attacking /
      Defensive / Possession / Pressing / Youth Focus / Set-Piece
      Specialist. Affects D3 tactical familiarity speed + club
      hiring bias.
    - **Nationality + 2 languages**: affects job offers (matching-
      language easier) + national team job priority + player
      communication bonuses.
  - **5-branch manager talent tree** (CK3-inspired, simplified for
    PWA):
    - 1 skill point per season + bonus on major trophies; unlocks
      from season 2.
    - Branches: **Tactician** (familiarity speed + in-match
      adaptation) / **Motivator** (morale + big-match + penalty
      shootouts) / **Youth Developer** (top-potential regen chance +
      U21 progression) / **Transfer Guru** (scouting info + wage
      demands + potential estimates) / **International Specialist**
      (national team cohesion + reduced club-vs-country tension).
    - Capstones: Tournament Whisperer (+5 % knockout match
      performance) / Academy Legend (club youth intake baseline
      raised).
  - **Region-based reputation**: per country + continent + global.
    Local dominance bleeds into continental + global slowly.
    Affects job offers + national team priority. Ties to I12 P1.
  - **Legendary detection** (per D4 §9.5) extended: legendary at 3+
    league titles OR 2+ continental trophies OR 5+ promotions.
    Unlocks special cosmetic titles ("The Architect" / "The
    General") + +1 extra talent point per season + drift cap ±0.25
    + future-saves Legacy bonus (rep + pre-unlocked skill).
  - **6 owner archetypes** (data-driven Owner Profiles):
    - **Sugar Daddy** (Rising Rival driver): mid-table large city;
      €150-300M cash injection + ×1.5-2.0 wage budget 5 seasons +
      ×2-3 transfer budget 3 seasons; aggressive bidding with
      10-20 % over-valuation. User club takeover triggers Align /
      Resist / Leave decision.
    - **Asset Stripper**: over-leveraged club; -30-50 % wage
      reduction + forced top-3-earner sale; user gets directives "We
      must sell X".
    - **Foundation-Community** (Hattrick + 50+1 culture): strict
      wage cap 55-60 % revenue; no long-term debt; very low
      takeover probability; youth + local focus.
    - **Petrol-State** (Final Boss of save): €300-500M injection +
      ×2.5 wages 8-10 seasons + near-max reputation; **FFP
      investigation** after 3-5 seasons of overspending (transfer
      ban / fines / point deductions possible).
    - **Murky Owner**: shady backgrounds; moderate investment with
      sudden withdrawal risk + FFP breaches + protests; possible
      money-laundering investigation → forced sale.
    - **Foreign Business**: marketing-driven; stable balanced
      investment; frequent stadium / naming-rights offers + friendly
      tours in owner's home market; "sign player from country X"
      board objectives.
    - **Frequency**: ~1 takeover / 5-7 seasons per league; max 2
      meaningful / season globally.
    - **Trigger model**: annual `instability_score` (financial
      stress + performance + ownership_age factors); if ≥ 3 →
      takeover candidate. Determinism via
      `worldAiMgmt:structural:year:<year>:takeover:<clubId>`
      sub-stream.
  - **Bankruptcy / Administration system**:
    - **Trigger**: 3 consecutive losing seasons + wage > 90-100 %
      revenue + cash < -0.5 × annual revenue + no investor.
    - **Effects on entry**: -10 to -15 points + transfer embargo +
      forced star sale + wage cap 40-50 % revenue + reputation -0.5
      stars + sponsor deals worsen.
    - **Pre-warning season**: board "We're on the brink; finish
      position X or admin".
    - **Heroic save path**: survival + net positive transfer window
      → "White Knight" investor event triggered + Hall of Fame
      "Saved the Club" credit + heavy underdog HoF bonus.
    - **Escape path**: leave before admin → "Abandoned sinking
      ship" tag (slight HoF penalty for that club).
    - If finances not stabilised within 2 seasons → optional
      enforced relegation / liquidation.
  - **Hall of Fame** (3-layer):
    - **Manager HoF per-save** (top 20): score = weighted trophies
      × competition strength × difficulty × underdog + longevity +
      loyalty - scandal penalties. Trophy values: domestic league
      100 / domestic cup 40 / Champions Cup 200 / IFC World Masters
      220 / IFC Nations Championship 220. Difficulty multipliers:
      Sim ×1.3 / Hard ×1.15 / Normal ×1.0 / Easy ×0.7. UI shows
      portrait + crests + timeline + signature titles.
    - **Manager HoF cross-save global** (top 10-20): stored in
      separate local-storage meta file; **read-only by sim**
      (deterministic-safe per D8). Filter by difficulty / era / club.
    - **Club HoF per-save**: trophy cabinet timeline + era detection
      algorithm (3-8 year above-average spans → "Golden Era" /
      "Resurgence Era") + XI-of-decade auto-calculated every 10
      seasons + record signings + milestones (first promotion / first
      continental qualification / invincible season).
    - **Player Legends per-save**: detection = 5+ seasons + ≥ 150
      apps + ≥ 2 of (role in trophy seasons / club record holder /
      iconic match rating ≥ 9.5 in final / derby). Tiers: **Icon**
      (statue / stand naming; shirt retirement if 10+ years + record
      goals) / **Legend** (profile flag + Legends tab) / **Favourite
      / Hero** (smaller flag).
  - **3-option Legacy mode** at career end (D4 §9.4 retirement Normal(67, 4) cap [60, 75]):
    - **A) Retire as Chairman / DoF**: low-touch meta role (budget +
      youth policy + style direction); game fast-forwards seasons.
    - **B) Start new manager at lower club in same universe**:
      former players may become rival managers; previous manager
      appears as retired legend.
    - **C) Hard retire + Career retrospective**: timeline screen
      with season-by-season achievements + map of clubs managed +
      graphs → save to global HoF → start new save with **Legacy
      bonuses** (§9.3).
    - **Manager statue** if Icon at club + (10+ years OR 5+ major
      trophies): "Stadium stand named after you" cosmetic + club
      history reference.
  - **3-tier cross-save Legacy perks** (deterministic-safe per D8):
    - Stored in global meta file (local storage), separate from save
      files.
    - **Read ONLY at world-gen as parameters; NEVER at runtime**.
    - Save snapshot includes all parameters used at gen → byte-
      identical world on replay/restore. Reload ignores any meta
      progression earned since snapshot.
    - **Tier 1** (after first 10+ season career): Tactician (+1
      tactic slot; D3 §6.6: 3 → 4) / Networker (better initial
      scouting) / Youth Whisperer (5 % chance of one special high-
      potential youth in season 1).
    - **Tier 2** (after ≥ 3 careers + HoF thresholds): Global
      Reputation (moderate starting rep) / Financial Savvy (higher
      initial board confidence).
    - **Tier 3** (after triple continental winner): Legendary Name
      (rare regen with user's surname + slight potential bias).
  - **50-year save longevity stack** (full 6 systems):
    - **Career phases UI**: timeline labels (Build-up Y1-3 / Ascent
      Y4-7 / Dynasty Defence Y8-15 / Legacy Y15+) on Manager Profile.
    - **Generational regens**: 5-10 years after a Club Legend
      retires, 5 % chance of regen with "Son of [Player X]" tag +
      position bias + +5 % max potential + special debut headlines.
    - **Year-X events**: 25-year anniversaries (commemorative match
      + special kit + attendance spike) / league reforms every 15-20
      seasons (size change / playoff intro; pre-announced 2-3
      seasons ahead) / stadium expansions every 8-12 years for big
      clubs / regional festivals bi-tri-annual.
    - **Cross-decade continental power shifts**: 10-year rolling
      Club World Masters + IFC Nations results → era labels
      ("European Dominance" / "South American Renaissance" /
      "Asia-Pacific Rise" / "African Awakening"). 8+ years
      dominance → rep + financial boost to that region's leagues +
      increased transfer outflow from weaker regions.
    - **Anstoss-style newspaper archive**: per-season summaries (3-7
      headlines per season) + tabs by year + filter "My club only" /
      "Major world events" + **decade retrospectives** auto-
      compressed for seasons > 10 years old ("The 2040s: Era of
      [Club X] and [Star Player Y]").
    - **Records book**: team records (most goals in a season /
      fewest conceded / win streak / unbeaten run / consecutive
      titles + promotions) + player records (most goals / apps /
      oldest/youngest scorer / fastest hat-trick) + club records.
      Auto-checked on every match; broken record triggers event +
      newspaper headline.
  - **Performance + storage**: ~115-155 KB gzipped late-game bundle
    lazy-loaded (within D9 per-route ≤ 200 KB budget); per-save
    IndexedDB ~400 KB late-game data; cross-save meta file < 100 KB.
  - **First PWA manager to ship this stack** — combines Anstoss-3
    Bundestrainer arc + FM-PC long-save depth + CK3-style cross-save
    Hall of Fame + Civ-style era system + Hattrick record books.
- **Onboarding Strategy** (locked 2026-05-17, gap D5) -
  [[../60-Research/onboarding-strategy]] +
  [[../50-Game-Design/onboarding-and-tutorial]] (new `approved` GDD):
  - **60-second FTUE** in 4 steps: experience question (Newbie / Bit
    / Veteran) silently mapping to UI tier + difficulty + recommended
    club tier + tutorial verbosity → mode picker upfront (both
    Career + Roguelite available day 0 per Nico's choice) → club
    picker with recommended-club default + "Advanced setup" escape
    to full 5-screen New Save wizard → Home dashboard with first
    inbox tutorial card. Target < 60 s to first tactical choice;
    < 3 min to first match.
  - **12-message first-season inbox tutorial arc** over 4 in-game
    weeks teaching match week / tactics / goals / match report /
    training / rotation / transfers / contracts / board confidence /
    set pieces / youth / soft-transition. Week-4 closing message:
    "You've got the basics. From now on I'll only step in when
    something important comes up." Pacing 4-6 msg/week arc → 3-4/wk
    rest of season 1 → 2-3/wk season 2+.
  - **10-sender inbox cast**: 4 core (Assistant Manager ~50 % /
    Chairman 15 % / Director of Football 20 % / Head Scout 10 %) +
    6 supporting (Head of Youth / Player Agent / Journalist /
    Sponsors / Family Personal Life / Anonymous Tips). Per-sender
    voice cards live in `packages/game-data/src/inbox/voice-cards/`
    with tone keywords, address style, signature lines, 3 sample
    sentences each.
  - **Configurable named Assistant Manager** - default name "Alex"
    (gender-neutral, works in DE + EN; locale-default variants);
    3-5 portrait presets + "No portrait" accessibility option;
    name + portrait editable in Settings → Assistant. Voice
    consistent across inbox + coach marks + match commentary +
    "Ask Assistant" sticky FAB on Home / Match / Tactics / Training
    / Transfers screens.
  - **Per-difficulty assistant intensity auto-scaling** (with user
    override in Settings → Assistance):
    - **Easy**: proactive — "I recommend bringing on a fresh left-
      back. Tap here to do it now." Auto-surfaces suggestions in
      feed cards. "Do something for me" available with one-tap
      auto-complete.
    - **Normal**: suggestive — "Their winger is finding space on
      our left. A defensive sub there could help." No auto-complete.
    - **Hard**: sparse — "Left side overloaded. Consider adjustment."
      Coach marks minimal; rarely interrupts in-match.
    - **Sim**: silent — no in-match interventions. Post-match
      analysis only. "Ask Assistant" still pull-only.
  - **Feed-card daily action queue** as Home dashboard primary UI
    (Nico's choice over inbox-primary): 3-5 priority cards per
    in-game day. Card = title + urgency tag (colour + icon + text
    for accessibility) + 1-2 line summary + impact line + primary
    CTA + snooze/dismiss + overflow. Gmail-inspired swipe: right =
    complete/open; left = snooze with undo snackbar. Priority
    algorithm = timePressureScore (5-40) + impactTypeScore (5-30) +
    playerBehaviourAdjust (-10 to +10). Guardrails: always ≥ 1
    match card if match in 3 days; ≤ 2 admin cards in top 5;
    ≥ 1 "Easy win" card per day on Easy. Per-difficulty queue
    behaviour (Easy auto-handles low-impact / Hard shows more
    cards + fewer helpers / Sim strategic only).
  - **Tutorial overlay hierarchy** (used sparingly per modern mobile
    best practice):
    - **Spotlight overlay**: 3-4 max total over the whole game;
      absolutely critical FTUE moments only.
    - **Coach marks**: speech bubble with Assistant avatar + arrow.
      Max 2-3 per screen, sequential. First-visit only. "Got it" +
      "Tell me more" + "Skip tips for this screen" first-focusable.
    - **Hint chips**: subtle bottom-pill suggestions. Auto-hide
      after 2 dismissals.
    - **Modal full-screen**: 1-2 per major system (tactics basics,
      transfers basics). Re-accessible via Help / Ask Assistant.
  - **"While you were away" recap** triggered after ≥ 7 in-game
    days OR ≥ 14 real days absent. Auto-shown top feed-card with
    3-4 bullet summary. "Review key events" opens chronological
    timeline with deep-link buttons. "Resume where you left off"
    CTA using last-known navigation state. Very-long-absence
    (≥ 30 real days) adds soft re-onboarding hint chip ("Tactics
    quick-tour: 2 min").
  - **Veteran skip + safety net**: experience question "Veteran"
    option triggers modal confirmation; skipped users get
    micro-tooltips (max 2-3 per screen) instead of full overlays;
    inbox tutorial arc still runs with shorter copy + skip-ahead
    links; "Ask Assistant" always available. Settings → Assistance:
    "Tutorial & tips" toggle (Off / Essential / Full) + "Reset
    first-time tips" button. Auto-detection of struggle (5+ losses
    in a row on Easy; 10+ ignored feed-card CTAs) triggers optional
    Assistant inbox message "Tough run? Want more guidance?".
  - **Subtle achievement celebrations** (each with "Don't show this
    type again" overflow):
    - First match played: none (no celebration; just match report).
    - First match won: banner + tiny confetti (disabled with
      reduced-motion) + [View match report].
    - First transfer signed: player reveal card + crest + 3 key
      attributes + "Add to starting XI?" follow-up.
    - First cup victory / first promotion: dedicated screen +
      static trophy art (2-3 s auto-play; tap to continue) +
      season snapshot + forward-looking choice ("Board expectations
      for next season: Consolidate / Push for top half / Go for
      promotion").
    - First autosave: one-time Assistant inbox message explaining
      autosave.
  - **PWA install prompt** triggers (per D9 budget): `sessions ≥ 3`
    AND first success (first match win OR first transfer completed
    OR first season objective ticked) AND
    `total_playtime > 20 min` OR `current_session > 2 min`.
    Placement: bottom sheet after a positive-result screen, NOT
    session start. Chrome / Edge Android uses native
    `beforeinstallprompt`. iOS Safari uses custom 3-step
    Add-to-Home-Screen walkthrough with annotated screenshots.
    Snooze 7d / 5 sessions on explicit dismiss; 3 sessions on
    ignore; max 5 lifetime prompts.
  - **WCAG 2.2 AA + BITV 2.0 accessibility**:
    - No critical info exclusive to overlays — every tutorial step
      has DOM equivalent in Help → Tutorials.
    - Onboarding flow as linear semantic pages (`<h1>` per step,
      routes `/onboarding/experience`, `/onboarding/mode`,
      `/onboarding/club`), not modal-only.
    - Coach marks: focus moves into bubble on appear; trapped until
      dismissed; ESC closes; "Skip tutorial" Tab-reachable as first
      focusable element. Auto-dismiss timers disabled (WCAG 2.2
      timing-independent rule).
    - `prefers-reduced-motion` honoured via CSS media query + in-game
      "Limit animations" toggle.
    - Redundant encodings: urgency tags = colour + icon + text;
      tactic arrows = colour + line pattern + label; role/duty
      badges = colour + abbreviation + role-family icon.
    - WCAG 2.2 AA contrast 4.5:1 body / 3:1 large text + UI elements.
    - Inbox messages have "Read aloud" button (`SpeechSynthesisUtterance`
      / native TTS); user-controlled with play/pause/stop; highlights
      sentence being read; auto-pauses on app background.
    - One-handed mode: large bottom-aligned primary actions in
      thumb zone for halftime panic moments.
    - Voice-control-friendly labels (text + icon; no icon-only
      critical actions; disambiguated repeated labels).
    - Touch targets 44 × 44 px enforced per D9.
  - **Onboarding-state IndexedDB schema** under `onboarding_state`
    object store keyed by `save_id`. Fields: experience_level,
    initial_tier, initial_difficulty, initial_mode,
    ftue_completed_at, tutorial_arc_status (current message +
    completed list + arc_completed_at + soft_transition_shown),
    screen_tips_seen (per-screen flags), pwa_install
    (eligibility + prompt count + dismissed_until + installed),
    assistance (coaching_intensity + auto_handle + assistant name
    + portrait_id), recap_state (last session end +
    last_in_game_date_at_exit + recap_shown), celebrations_shown
    (per-milestone flags). Local-first per ADR-0005.
  - **Locale strategy**: EN source language + DE second locale at
    MVP. ~80-120 inbox templates × ~60 words = ~7-10k words per
    locale. Templates use placeholders ({playerName} / {clubName} /
    {position} / {opponentName} / {form} / {leaguePosition}).
    Subject ≤ 40 EN / ≤ 60 DE characters; body ≤ 80 EN / ≤ 100 DE
    words.
  - **Bundle**: onboarding-related JS ~110-150 KB gzipped
    lazy-loaded (within D9 per-route ≤ 200 KB budget). Inbox copy
    JSON ~50-80 KB per locale.
  - **Target retention**: D1 ≥ 30 % / D7 ≥ 12 % / D30 ≥ 5 % —
    between Top Eleven gold-standard (~35-40 % D1) and FM Mobile
    (~25-30 % D1). Reaches "best-in-class mobile manager" tier.
- **Tactics & Formations** (locked 2026-05-17, gap D3) -
  [[../60-Research/tactics-and-formations]] + [[../50-Game-Design/tactics-system]]
  (promoted from `draft` to `approved`):
  - **20 formations** total approaching FM PC depth on mobile. Core 8
    visible at all tiers (4-4-2 Flat / 4-3-3 / 4-2-3-1 / 3-5-2 /
    4-1-2-1-2 Diamond / 5-3-2 / 3-4-3 / 4-5-1) + advanced 12 hidden
    at Quick tier (4-1-4-1 / 4-2-2-2 / 4-3-2-1 Christmas Tree /
    3-4-1-2 / 3-4-2-1 / 4-2-3-1 Wide / 5-4-1 / 4-1-2-3 / 3-3-3-1 /
    5-2-3 / 4-4-2 Asymmetric / 4-3-3 DM Pivot).
  - **50 roles** across 8 position groups (GK 3 / CB 5 / FB-WB 6 /
    DM 5 / CM 7 / AMC 6 / Wide-W 7 / ST 8 + 3 cross-position).
    Tier exposure: Quick = no role UI; Standard = top 3 per
    position (~22 visible); Expert = all 50.
  - **Duties**: 3 globally (Defend / Support / Attack) constrained
    per role. Single-duty (Anchor, Poacher, Trequartista, etc.);
    dual; triple (CM / Winger / IF / AF / TM).
  - **Player instructions** per tier: 0 / 6 / 18. Standard 6 =
    high-impact (width / runs / press / passing risk / shoot /
    marking). Expert 18 in 4 groups (Positioning & movement 6 /
    Ball use 6 / Defensive 4 / Set-piece 2).
  - **Team instructions** per tier: 1 / 5 / 8. Quick = Mentality
    only. Standard adds Pressing / Defensive Line / Width / Tempo.
    Expert adds Build-up Style / Time-Wasting / Focus of Play.
  - **Mentality model**: 5 visible bands (VeryDef / Def / Balanced /
    Att / VeryAtt) + 7 internal steps (hidden Cautious + Positive
    half-steps for engine nuance).
  - **Phase logic** at MVP: Standard tier single global; Expert
    tier light per-phase overrides for OoP (Pressing + Defensive
    Line + press triggers), IP (Width + Build-up Style),
    Transition-to-Attack (Counter / Regroup / Balanced + tempo
    override), Transition-to-Defend (Counter-Press / Drop / Balanced).
  - **Tactical familiarity model** (full FM-style):
    - Single bar 0-100 per tactic slot.
    - Growth: TrainingGain (+4 / +2 / 0 for Primary / Secondary /
      unused) + MatchGain (+3 / match full usage) + ContinuityBonus
      (+0.2 to +2 based on new players in XI) + weekly cap 8.
    - Decay: 2/week non-use; floor 20 (never fully forgets).
    - SwitchModifier per match (1.0 last match → 0.6 if 11+ ago).
    - Penalty curve (piecewise): 0 → 0.4× shape multiplier; 50 →
      0.85×; 80 → 1.0× baseline; 100 → 1.04× mastery reward.
    - ContinuityMatchFactor (rotation penalty per match):
      0-1 new players in XI → 1.0; 8+ → 0.80.
    - New manager Similarity: new_familiarity = old × (0.5 + 0.5 ×
      Similarity); partial carryover based on formation +
      mentality + pressing alignment (0.4 ≤ Sim ≤ 1.0).
    - Pace: 30 → 90 in ~8 weeks with focus + same XI; ~12 weeks
      with half focus + some rotation.
  - **Tactic slots + saved presets** per tier: 2 / 3 / 3 slots
    (with familiarity, designated Primary / Secondary /
    Experimental) + 0 / 10 / 50 saved presets (no familiarity).
  - **Quick tier 5 starter presets** locked: Solid 4-4-2 /
    Counter-Attack 4-3-3 / High-Pressing 4-2-3-1 / Park the Bus
    5-3-2 / Balanced 4-3-3.
  - **3-layer opposition template system**:
    - **Layer 1** (8 archetypes): vs Deep Block / vs High Press /
      vs Wide Overloads / vs Target Man / vs Playmaker 10 / vs
      Counter-Attacking / vs 3-5-2 / vs 4-2-3-1. Templates are
      deltas on base tactic.
    - **Layer 2** (~25-30 sub-archetype variants, 3-4 per main):
      e.g. `vs_high_press/direct_bypass`, `/playmaker_dribble`,
      `/wing_bypass`, `/draw_and_release`.
    - **Layer 3** (manager-signature templates): each of the 10 D4
      AI archetypes has 1-3 signature templates they favour. Gives
      AI managers distinct tactical character; user can scout
      manager archetype to predict counters.
    - **Emergent club character**: clubs accumulate counter-template
      history (last 50 matches); surfaced in opposition analysis as
      "tactical fingerprint". No competitor surfaces this.
  - **3 universal touchline shouts** at all tiers (no tier gating):
    Encourage / Demand More / All-Out Attack. 10-min cooldown
    (20 min for All-Out Attack). Max 8 per match. Effects as
    multipliers on mentality / pressing / tempo / discipline /
    energy. Deferred shouts (Focus-Regroup, Time-Waste, Tackle
    Harder) added post-MVP via same mechanic.
  - **Tactical predictability penalty** (ties to D4 arms race):
    `Predictability = UsageScore - 0.5`; `LeagueAdaptationFactor =
    1 - clamp(Predictability × 0.1, 0, 0.05)`. Up to 5 % offensive-
    effectiveness reduction for 100 % single-tactic usage.
    Counter-templates cancel half. Encourages variety without
    forcing it.
  - **Tactic preset sharing** per ADR-0016: URL-encoded share
    codes `TACTIC-<crc32>-<base64-LZ-compressed-JSON>`. Local-only
    at MVP; no server backend. Expert tier UI: import / export
    with formation / style / use-case / vs-archetype tag filters.
  - **Touch-first UI patterns**: tap-to-place formation editing
    primary (long-press drag only in Expert); bottom-sheet role
    pickers preserve pitch context; segmented controls for team
    tactics (5-band mentality + 3/4-step pressing/line/width/tempo);
    accordion player instructions with override visual state +
    inline reset; halftime 3-tile modal (subs + mentality + 1
    tactical tweak) + "Open Full Editor"; 44 × 44 px touch targets
    enforced (positions get 36 px visual + invisible 48 px hit);
    WCAG 2.2 AA / BITV 2.0 (screen-reader labels per position;
    arrow-key roving tabindex; colour-independent D/S/A badges).
  - **Attribute schema reconciled with D2** (mechanical fix): 16
    visible + 4 GK + 8 hidden on 1-20 scale. Replaces previous
    incorrect "10 + 8 + 10 + 5 = 33 on 1-10 scale" claim from the
    original draft GDD. Per-tier player-strength display now follows
    **Impact Lens**: Quick = qualitative Impact bands + availability
    warnings; Standard = Role Impact + category bars + status icons;
    Expert = full 1-20 visible attributes + Impact formula breakdown +
    scout-uncertainty bands for 8 hidden. No global OVR.
- **Player Strength Presentation / Impact Lens** (locked 2026-05-17) -
  [[../60-Research/player-strength-presentation]]:
  - No global player Overall / OVR / universal star rating in squad,
    tactics, scouting or transfer lists.
  - Role Impact is a deterministic integer read projection for a player in a
    specific role, duty, tactic and availability context.
  - Category scores summarise Technical / Mental / Physical / GK from the
    locked D2 1-20 attribute schema; status signals stay visible separately.
  - Poorly scouted players show labels, ranges and trust levels rather than
    false precision.
  - `ImpactLensProjection` is a Squad & Player read model exposed via
    `queryGateway`, cacheable in Dexie, refreshed by Live Queries, never
    workflow authority and never a cross-context JOIN.
- **AI Manager Behaviour** (locked 2026-05-17, gap D4) -
  [[../60-Research/ai-manager-behaviour]]:
  - **Three-layer architecture**: utility AI core + light FSM
    situation classifier (TitleRace / EuropePush / MidtableSafe /
    RelegationBattle / Rebuild / FinancialCrisis) + heuristic
    constraints (hard caps preventing pathological behaviour).
    Industry consensus for 2026 sports/management games. Rejects
    behaviour trees (wrong abstraction), GOAP/HTN (too heavy), ML
    (bundle bloat + tuning friction).
  - **Personality system**: **8 primary continuous traits** [0, 1]
    (`tacticalAttacking`, `pressingPreference`, `youthTrust`,
    `starPreference`, `transferAggressiveness`, `bargainSeeking`,
    `riskTaking`, `tinkering`) + **3 derived** (`loyalty`,
    `fitnessFocus`, `wageDiscipline`). Personality modulates utility
    weights by max ±30 %; never overrides decision structure.
    Drifts ±0.2 over career based on success/failure.
  - **10 manager archetypes** at MVP: Park-the-Bus Pragmatist,
    Counter-Attacking Reactive, High-Pressing Aggressor, Possession
    Maestro, Youth Developer, Galáctico Collector, Moneyball
    Director, Tinkerman, Conservative Stabilizer, Chaos Motivator.
    Each is a preset trait vector + preferred formations.
  - **4 difficulty modes** (Easy / Normal / Hard / Sim) — FM-style
    "constraints + AI optimisation" approach, NOT Civ-style "AI gets
    free resources". No AI stat cheats on Normal / Hard / Sim. Easy
    gives minor user help only (+1 attrs, generous finances, 80 %
    AI competence) for onboarding.
  - **Per-difficulty knob table** (~20 knobs): AI tactical quality
    weight, in-match adaptation frequency, transfer success rate,
    scouting depth, board patience, FFP enforcement, star ambition
    pressure, injury frequency, tactical familiarity build rate.
  - **Out-of-match weekly tick** per club (~5-6 ms budget): squad
    gap analysis → transfer targeting (top 60 candidates per role,
    max 3 priority roles) → bidding with multi-club escalation +
    walk-away rules → contract renewals (monthly) → squad rotation
    + training focus → board confidence update → seasonal facilities.
  - **In-match decision pipeline**: trigger-based at HT, 60', 75',
    85', 90' + event triggers (goal, red card, injury, opponent
    sub). 15-25 decision passes per match, < 1 ms each. Decision
    order: mentality → formation change → substitutions →
    instructions → set-piece takers. Total cost ~20-25 ms / match
    (within 30-50 ms budget).
  - **World drift / dynasty anti-staleness**: moderate explicit
    mechanics — wage inflation tied to success (3 top-4 finishes =
    +10-20 % renewal demands); progressive FFP penalties (warning
    → transfer ban → point deductions on Sim); talent diffusion
    (40 % elite regens spawn at non-elite clubs); tactical arms
    race (opposition memory + counter-template application scaling
    by difficulty); board expectation escalation +1 tier per
    overperformance season.
  - **Structural events** every 5-10 in-game years:
    - **Rising Rival** (~5y cycle): mid-table club gets New Investor
      + funds boost + high-rep manager hire. Anti-staleness driver.
    - **Giant Collapse** (~10y cycle): top club enters financial
      crisis, fire-sale stars at -20 %, transfer ban for 1 window.
  - **AI manager career arcs** at MVP:
    - Job churn 10-20 % of managers per season (via board
      confidence < 30 threshold + recent-form check).
    - Retirement via `Normal(67, 4)` clamped [60, 75].
    - Legendary detection (3+ league titles OR 2+ continentals
      OR 5+ promotions) → boosted job security + relaxed personality
      drift caps + Hall of Fame surfaces.
    - **Rival tracking**: per user club, the AI manager with highest
      head-to-head PPG + most title-race meetings becomes the user's
      "primary rival". Persists across club changes (rival follows
      user's manager career, not just their current club).
  - **Late-game content** phased:
    - **MVP**: 12 dynasty achievements (5-in-a-row league titles,
      domestic treble, continental double, invincibles season,
      100-point season, 100+ goals, top-scorer 3 consecutive,
      ladder climb through all 5 divisions, win-with-each-archetype,
      generational squad, 1000 career wins, 50-year save longevity)
      + tactical arms race + board expectation escalation.
    - **Post-MVP**: national team dual-role (unlock at manager rep
      ≥ 75); Manager Hall of Fame; legacy mode (retire-as-manager /
      continue-as-chairman); roguelite-mode integration with
      Create-A-Club.
  - **Determinism**: uses pre-allocated `WorldAiMgmtRng` (stream #2)
    + `MatchAiRng` (stream #4) from D8 with hierarchical sub-labels
    (`worldAiMgmt:club:<id>:weekly:<week>`, etc.). New AI sub-systems
    add labels under existing streams — no schema changes; future-
    proof per D8 §2.3.
  - **Performance** (per D9): out-of-match 700 clubs in ~3.5-4.2 s
    (within 5 s budget); in-match ~25 ms / match (within 30-50 ms
    budget). Lazy expansion of Tier C AI managers (compact 16-byte
    profile, expand on first user interaction).
  - **Package**: `packages/ai-manager/` is framework-agnostic
    (no React, no DOM, no fetch). Same code path runs client-side
    (singleplayer) AND server-side post-MVP (async MP per ADR-0011).
    Bundle target ~60-80 KB gzipped.
- **ADR-0007 Naming Schema + Data Generators** (accepted 2026-05-17, gap D2) -
  [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]] +
  [[../60-Research/data-generators]]:
  - **Procedural worldgen from a single seed**; IP-clean by
    construction. No real club / player / coach / referee / stadium
    / sponsor names ever.
  - **Name generation**: hybrid wordlist + phonotactic fallback.
    Tier-1 locale buckets at MVP (DACH / British Isles / FR / ES /
    IT / Low Countries / Lusophone — 7 buckets). Tier-2 (post-MVP):
    Nordic / Eastern Europe / Hispanic LATAM / Turkey / Asia (JP/KR/
    CN) / Arabic / Africa (3 buckets).
  - **Corpus sources**: Wikidata CC0 primary; UK ONS / US SSA / INSEE
    / ISTAT / CBS / Statbel / Destatis / IBGE national open-data;
    GeoNames CC-BY 4.0 for regions + Bloom filter. Forbidden: Behind
    the Name, Wikipedia raw text (CC-BY-SA), Common Crawl,
    unlicensed GitHub corpora. Living-person filter on Wikidata pull.
  - **Locale composition rules** at MVP must-have: Spanish two-
    surname, Portuguese particles, Dutch tussenvoegsel, German `von`
    with low probability. Deferred to Tier 2: Polish gendered,
    Japanese family-name-first, Korean two-syllable, Arabic
    patronymics.
  - **City / location**: real region (GeoNames CC-BY 4.0, attribution
    in credits) + fictional city via phonotactic recombination of
    region-typical syllables; Bloom-filter rejection of real GeoNames
    cities. Allows `Borussia Schwarzwald` (real region, fictional
    club + city) without `FC Dortmund`-style real-pair collisions.
  - **Crest generation**: grammar-based hybrid. 7 shields × 8
    divisions × 10 region-biased palettes × 40-50 charges × 4
    borders × 3 banners → ~5 M unique crests. Pure TS → SVG
    (no WebGL, no raster, no 3D per D9). At world creation: only
    `CrestDesign` struct (~6 bytes packed) stored per club. SVG
    rendered on first display (~1-3 ms); cached as data URI in
    IndexedDB. Crest module bundle ~30-40 KB gzipped.
  - **Crest icon library**: ~40 charge icons inlined as TS path
    strings, restyled from Game-Icons.net (CC-BY 3.0, attribution)
    + Heroicons (MIT) + Tabler (MIT). No national emblems, military
    insignia, religious iconography. No CC-BY-SA Wikimedia sources.
    Region-biased shape and palette priors per locale (DE → more
    heater + yellow-black; IT → more roundel + blue-white).
  - **Club tier model**: 5 tiers per country. Country × Tier finance
    matrix locked for 10 countries (DE, EN, ES, IT, FR, PT, NL, BR,
    AR, JP). Log-normal money + attendance distributions; prestige
    0-100 via tier_base + country_offset + history_bonus + recent_
    success + facilities + fanbase + noise. Stadium model: bimodal
    age distribution (modern / hybrid / old); tier-weighted naming
    patterns (traditional / arena / sponsor).
  - **Player attribute schema**: **16 visible** (7 Technical + 5
    Mental + 4 Physical) + **4 GK-only extras** (reflexes, handling,
    aerial reach, distribution) + **8 hidden meta** (potential,
    consistency, pressure, professionalism, determination,
    adaptability, injury proneness, big matches) on 1-20 integer
    scale. Maps to match-engine basis-points contest math via
    `attr × 500 = success_bp`. FM Mobile-style simplification; fits
    Quick / Standard / Expert progressive-disclosure tiers.
  - **Player generation algorithm**: hybrid archetype-first + CA
    budget allocator. ~50 archetypes (sweeper keeper, ball-playing
    CB, inverted FB, deep-lying playmaker, box-to-box CM, inside
    forward, poacher, target man, ...). Pipeline: pick `(nation,
    club_tier, age_band, position, archetype)` → sample PA from
    skewed nation × club-quality distribution → sample CA from age
    + environment → Dirichlet allocation of CA across attributes per
    archetype weights → hidden meta + physicals + name + nationality
    + assemble.
  - **Lazy expansion** (the big perf trick): only Tier A + B players
    (top 2 leagues per active nation, ~10-15 % of total) get full
    attribute generation at world creation. Tier C players (~85-90 %)
    store a 12-byte compact profile; full attrs generated on demand
    when scouted / drafted / faced in a match. Cuts Large-world
    storage from ~3 M attribute values to ~78 KB compact + ~7.5k
    expanded.
  - **Performance** (per D9): Small world ≤ 2 s; Medium ≤ 5 s;
    Large ≤ 8 s on Snapdragon 695, all in a dedicated Web Worker
    with batched yields. IndexedDB delta ≤ 25 MB for Large world.
  - **Determinism**: adds RNG stream **#9 `GeneratorRng`** to D8
    (label-derived; future-proof per D8 §2.3 — does not break any
    existing replay). Hierarchical sub-labels per subsystem (country
    / league / club / crest / stadium / staff / player / name /
    nationality). Same `worldSeed` → byte-identical world.
  - **CI enforcement**: lint blocks `Math.random` in
    `packages/game-data/src/`; build emits `CORPUS-PROVENANCE.md`;
    test rule rejects any real-club / player / coach name match in
    shipped corpora; golden tests on 10 canonical seeds for
    byte-identical output.
- **Performance budgets** (locked 2026-05-17, gap D9) -
  [[../60-Research/performance-budgets]]:
  - **Device matrix** - four tiers:
    - **Premium**: Snapdragon 8 Gen 2+ / A15+, 6+ GB RAM, Android 14+/iOS 17+, Chromium 120+. Full features; 60 fps canvas match.
    - **Standard** (optimisation target): Snapdragon 695 / 4 Gen 2 / 6 Gen 1 / Helio G99 / Exynos 1330 / A13/A14, 4-6 GB RAM, Android 12+/iOS 16+, Chromium 100+. Full features tuned; 30-60 fps canvas match.
    - **Floor**: 3 GB RAM, A12, Android 10+/iOS 15+, Chromium 90+. Reduced features + one-time warning banner; **Text & Stats match mode forced**; Small world only; ≤ 1 heavy Worker.
    - **Off-target**: < 3 GB / Android < 10 / iOS < 15 / Chromium < 90. HTML fallback page, ≤ 20 KB compressed.
  - **CWV product targets (p75 mobile)**: LCP ≤ 2.0 s, INP ≤ 120 ms on primary flows, CLS ≤ 0.05. Tighter than the standard "Good" cutoffs.
  - **Lighthouse**: mobile lab ≥ 90 (block deploy < 85), desktop ≥ 95 (block < 90). Replaces the placeholder in arc42 §Crosscutting.
  - **JS bundle budgets** (post-gzip transfer): initial critical ≤ 200 KB (hard cap 250); total session ≤ 700 KB (hard cap 1 MB); per-route lazy heavy ≤ 100 KB; per-route lazy small ≤ 50 KB; third-party ≤ 50 KB; match engine package 80-100 KB; service worker ≤ 80 KB.
  - **DOM + render**: all tables virtualised via TanStack Virtual (≤ 40-60 rows on mobile, fixed-height); DOM nodes per route ≤ 1500 (hard cap 3000); no heavy CSS (`backdrop-filter`, animated `filter`); honour `prefers-reduced-motion`.
  - **Frame budget** (p95 main-thread): ≤ 12 ms; no single task > 25 ms; no matchday task > 50 ms.
  - **Memory** (heap, steady-state): Premium ≤ 200 + ≤ 100 MB; Standard ≤ 150 + ≤ 80 MB; Floor ≤ 100 + ≤ 50 MB.
  - **World-size presets** chosen at New Save (immutable per save for determinism):
    - Small (1 nation, 2 leagues, ~5 MB) - Floor default + forced.
    - Medium (3 nations, 6 leagues, ~15 MB) - Standard default.
    - Large (8 nations, 20 leagues, ~50 MB) - Premium default; Standard opt-in with warning.
  - **Match render policy** - **no 3D match view on the roadmap, ever** (permanent product decision). Two modes only:
    - **Text & Stats** (first-class, not a fallback): DOM list at 1-2 Hz, stats sidebar; default on Floor; user-selectable everywhere.
    - **2D canvas** (primary, mandatory): HTML Canvas 2D (NOT WebGL); 30 fps cap on Standard, 60 fps on Premium; 720p internal resolution, DPR clamp at 2.0.
  - **Battery-saver / reduced-motion / data-saver** auto-honoured via `prefers-reduced-motion`, `navigator.connection.saveData`, `prefers-reduced-data`.
  - **CI perf gate** (Phase 1, MVP, mandatory): Lighthouse CI + Playwright + injected `web-vitals` library on every PR; bundle-size CI per the budgets; match-engine perf gate per D1; storage assertion per A2.
  - **Phase 2** (post-MVP): add LambdaTest 1-slot weekly real-device job (~€1.5 k/yr) on Galaxy A54 / Pixel 7a / iPhone SE 3-class hardware.
  - **Phase 3** (optional, only if Phase 2 insufficient): build 5-device hardware rig (~€2.4 k one-off + €800/yr amortised).
- **ADR-0003 Match Engine** (accepted 2026-05-16, gap A3) -
  [[../10-Architecture/09-Decisions/ADR-0003-match-engine]]:
  - **Package**: `packages/match-engine/` is framework-agnostic
    (no React, no DOM, no `fetch`). Same engine runs in the client
    Web Worker (singleplayer) and the server Match Worker (MP).
  - **Public API**: `simulate(MatchInputs) → MatchResult`,
    `simulateStreaming(MatchInputs) → AsyncIterable<MatchEvent>`,
    `replay(MatchInputs) → AsyncIterable<MatchEvent>`. All
    deterministic given the same seeds + lineups + tactics +
    weather + referee_profile + engine_version.
  - **Canonical data**: formation zone weights live as **TS
    literals** in `packages/match-engine/src/data/formations/`
    with strongly-typed `FormationId` × `RoleId` unions and
    DRY pattern constants. Set-piece routines live as TS literals
    in `data/set-piece-routines/` (canonical library, ~15-25
    routines at MVP).
  - **Community overrides** (per ADR-0016): packs may ship a
    `formations` JSON section + library-grade routines, applied
    at engine init. Determinism preserved via
    `dataset_pack_version` in `engine_version`.
  - **Set-piece routines hybrid**: MVP = canonical library only;
    Phase 2 = per-club editor for Expert tier with full routine
    definitions embedded in match records for replay stability.
  - **ID naming**: namespaced slug pattern - `category/name` core,
    `mod.<pack>.category/name` community, `club:<id>.<slug>`
    per-club, `n-n-n` formations, short uppercase role IDs.
    Stable forever; semantic changes = new ID + compatibility stub.
  - **Worker bridge**: postMessage with discriminated-union types
    (no comlink at MVP); events batched per virtual minute or
    every 20 events; `abortSignal` in `MatchInputs` for streaming
    cancellation.
  - **Performance**: ≤ 50 ms / match on 2022 mid-range Android;
    30-40 ms soft alert; ≤ 30 ms for AI-vs-AI batch (no
    narrative).
  - **Engine version**: semver (`2.3.0`) embedded in every match
    record + save envelope; engine modules vendored per version
    inside the PWA bundle for offline replay.
  - **Runtime strategy update** (2026-05-17): TypeScript remains the MVP
    authoritative engine for client Web Worker and server Match Worker.
    Post-MVP Rust/polyglot extraction is allowed only after the gate in
    [[../60-Research/match-engine-runtime-strategy]] passes: measured need,
    stable DTO contract, golden replay parity, statistical parity,
    determinism parity, operational readiness and old-engine replay fallback.
  - **Quality profiles**: `competitive-full`,
    `interactive-standard`, `background-detailed`, `background-fast`.
    The selected profile is part of `MatchInputs` and replay inputs.
- **Match Engine Simulation Model** (locked 2026-05-16, gap D1) -
  [[../60-Research/match-engine-simulation-model]]:
  - **Simulation model**: hybrid Markov + attribute rolls. Macro
    Markov chain over `{teamInPossession, zoneId, phase,
    pressureLevel}` picks event type + target zone; micro
    attribute-vs-attribute integer contests resolve outcomes.
  - **Tick model**: per-event with integer-second `simClock`
    jumps; event durations sampled per type (passes 3-10 s, set
    pieces 20-40 s, subs 60-90 s); clamped at period boundaries.
  - **Event schema**: required core (sim_clock_s, duration_s,
    period, event_type, outcome, team_id, player_ids, start/end_pos
    in integer mm, start/end_zone_id) + typed optional payloads
    (Pass/Shot/Duel/Foul/Card/SetPiece/Sub/TacticalChange/Injury/Misc)
    + optional delta-encoded `tactical_context`.
  - **Formation interaction**: hybrid zone + role influence; per-
    player zone weights from formation + role + duty + instructions
    + traits; aggregated to per-zone team scores
    (attacking/defending/pressing/support); per-zone deltas
    modulate Markov transitions + attribute thresholds.
  - **RNG separation**: `MatchCoreRng` (physics + duration sampling
    + injuries) vs `MatchAiRng` (in-match AI tactical decisions).
    Allows AI refactor without breaking physical replays.
  - **Performance budget**: ≤ 50 ms per full match in Web Worker
    on 2022 mid-range Android; soft alert 30-40 ms. AI-vs-AI
    batch ≤ 30 ms (no narrative).
  - **Worker bridge**: `simulate(MatchInputs)` /
    `simulateStreaming` / `replay`; postMessage with discriminated-
    union types; events batched per virtual minute or every ~20
    events.
  - **Test pyramid**: full - unit + integration + 10 canonical
    golden replays + statistical envelope tests (1k-5k nightly
    matches) + property-based (fast-check + pure-rand) + CI perf
    gate.
- **ADR-0002 Offline-first** (accepted 2026-05-16, gap A2) -
  [[../10-Architecture/09-Decisions/ADR-0002-offline-first]]:
  - **Capability matrix**: singleplayer + draft / read / save / export
    work offline; mutating multiplayer effects need server
    confirmation; live realtime needs online.
  - **SW tooling**: `vite-plugin-pwa` with **`injectManifest`** +
    Workbox 7. Hand-authored SW at `apps/web/src/sw.ts`.
  - **Update strategy**: **hybrid smart** — auto-`skipWaiting` if
    no in-progress state (match / draft / watch-party); else
    `workbox-window` prompt. Preserves in-progress game state.
  - **Outbox replay**: cross-browser primary triggers (startup +
    `online` + `visibilitychange`) + Chromium-only
    `BackgroundSyncPlugin` as accelerator. Post-MVP push-driven
    sync hints for installed PWAs.
  - **Storage budget**: soft ~300 MB cap, warn at 70 %, encourage
    export of saves > 6 months. `navigator.storage.persist()` on
    Chromium/Firefox; iOS treated as fragile (no-op).
  - **Install UX**: never on first load; surface after first match
    completed OR first save created + ≥ 3 sessions; dismissible
    card; 7-day snooze; iOS Share→Add-to-Home-Screen guide.
  - **Outbox UX**: dedicated **Sync / Activity view** + nav badge
    + `setAppBadge()` + non-modal banner on hard-reject; transient
    retry `0/10s/30s/2min/5min` cap 7; hard-reject never
    auto-retried; per-`rejected_with_reason` copy table.
- **ADR-0005 Save Format** (accepted 2026-05-16, gap A5) -
  [[../10-Architecture/09-Decisions/ADR-0005-save-format]]:
  - **Two export modes**: 'Device backup' (account-secret +
    device-salt KDF; auto-restores when signed into same account)
    and 'Portable export' (user passphrase + per-export 32-byte
    salt; account-independent, shareable, "forgot = lost" UX).
  - **Encryption**: AES-GCM 256 via Web Crypto. AEAD tag binds the
    envelope header (schemaVersion, saveVersion, engineVersion,
    saveMode, …) to the ciphertext so headers can't be tampered.
  - **KDF**: PBKDF2-SHA256, **600 000 iterations** (OWASP 2026
    minimum). Argon2 / scrypt deferred to Phase 2 if needed.
  - **Compression**: `CompressionStream('gzip')` — native cross-
    browser, zero bundle cost, Web-Worker. ~70-80 % size reduction.
    Pipeline: `JSON → gzip → AES-GCM-encrypt`.
  - **Versioning**: three independent fields — `envelopeVersion`
    (envelope itself), `saveVersion` (payload shape),
    `engineVersion` (per D8 deterministic replay). Phased rename
    migrations. Old-engine dynamic-import for legacy save replay.
  - **Payload**: full per-save context snapshots + RNG state for
    all 8 named streams (per D8). Outbox + audit explicitly NOT
    in saves (live in platform DB).
  - **Save lifecycle**: `active → archived → deleted` (with 30-day
    grace period before per-save DB drop). Soft 10 / hard 50
    quota per user (per A4).
- **ADR-0004 Data Model** (accepted 2026-05-16, gap A4) -
  [[../10-Architecture/09-Decisions/ADR-0004-data-model]]:
  - **Storage topology**: hybrid (shared `platform` DB + one DB per
    save in `soccer_manager` namespace).
  - **Schema strategy**: SCHEMAFULL for stable core, SCHEMALESS for
    event/log/payload tables.
  - **Generator**: custom TS-first mirror in `packages/db-schema`
    emits `.surql` + Zod + TS types. CI gate `pnpm db:generate &&
    git diff --exit-code` blocks drift.
  - **Numeric model**: integers / basis-points throughout simulation
    logic (per D8).
  - **Save quotas**: soft UX limit 10 active saves + archive flow +
    server-side hard cap 50 (active + archived) per user. No tiering
    at MVP.
  - **Save export envelope**: `{schemaVersion, saveVersion,
    engineVersion, createdAt, saveMode, aeadHeader, ciphertext}`.
    Encrypted with AES-GCM 256 + PBKDF2 KDF from account secret +
    device salt.
  - **Phase-2 cloud sync**: hybrid - initial encrypted snapshot per
    device + encrypted delta ops + periodic checkpoints (every 100
    deltas or 5 MB). Save-level content key wrapped per member for
    shared MP saves. MVP does NOT ship cloud sync.
  - **IDs**: UUIDv7 (per ADR-0013); record links across contexts;
    raw strings forbidden.
  - **Forward additivity**: `gender_eligibility` set on player +
    `gender_restriction` enum on competition; season calendars on
    competition (not gender). Future-proof for women's football,
    junior open, mixed-eligibility competitions.
- **SurrealDB Schema Patterns** (locked 2026-05-16, gap D14) -
  [[../60-Research/surrealdb-schema-patterns]]:
  - **Per-save isolation**: hybrid. One shared `platform` DB
    (identity, save registry, outbox, audit, IP-clean catalog) + one
    DB per save (mutable game state). Single namespace
    `soccer_manager`.
  - **Schema strategy**: hybrid. SCHEMAFULL for stable core
    (player, club, league, match, transfer_offer, sponsor, …);
    SCHEMALESS for event / log / payload tables (match_event,
    outbox_event, audit_log, notification).
  - **Relationship modelling**: per-relationship rule. Record links
    for one-to-many references (club → players); linked rows for
    paged or append-only sets (match → match_events); RELATE only
    for edges with their own lifecycle metadata (watch_party →
    participants); document tables for transactional entities
    (transfer, sponsor_contract, rivalry).
  - **Migrations + types**: TS-first schema mirror in
    `packages/db-schema` is the single source; custom generator
    emits `.surql` + Zod + TS types. Explicit `pnpm db:migrate`
    release step (not boot-time). Forward-only, idempotent, phased
    renames.
  - **Browser offline store**: Dexie / IndexedDB only at MVP.
    SurrealDB WASM kept as a post-MVP research track (trigger:
    Capacitor / native packaging, server-cost constraint, or WASM
    bundle < 500 KB).
  - **Live Queries**: UI projection updates only; never workflow
    authority. Each bounded context's `index.ts` exports a
    `queryGateway` wrapping queries + Live Query subscriptions.
- **Determinism / RNG / Replay** (locked 2026-05-16, gap D8) -
  [[../60-Research/determinism-and-replay]]:
  - **PRNG**: PCG32 via `pure-rand` (32-bit JS, no BigInt). RNG state
    serialised as 4 × Uint32 inside encrypted saves.
  - **RNG streams**: 8 named streams (World / WorldAiMgmt / MatchCore
    per match / MatchAi per match / Weather / Injury / Transfer /
    News). Seeded from masterSeed via xxhash32(label, parentSeed).
    Adding new streams later is safe.
  - **Replay format**: `(seed, lineups, tactics, engineVersion)` is the
    canonical truth for every match. **Human-involving matches**
    additionally store the **full event log** (every pass / duel /
    shot, ~5-20 KB / match) for fast UI + audit. **AI vs AI** stays
    seed-only with on-demand re-sim per ADR-0011.
  - **Numeric representation**: integers / basis-points (money in
    cents, probabilities 0-10000, attributes 0-100, coordinates
    integer-mm). Floats only inside engine internals.
  - **12 save-determinism rules** (lint-enforced where possible): no
    `Math.random`, no `Date.now`, no transcendental math in decisions,
    sorted-key iteration, stable sort with tie-breakers, Worker-
    message-driven sim, complete-state saves, integer-comparison
    branching, versioned engine, deterministic input ordering, no
    object-identity branching, cross-browser CI gate.
  - **CI gate**: Chromium-only at MVP; WebKit + Firefox added in
    Phase-2 hardening.
- **ADR-0013 Transactional Outbox** (accepted 2026-05-16, gap B4).
  Five decisions locked via Perplexity research + Nico Q&A:
  - **Storage**: SurrealDB outbox (atomic with state) + **Redis Streams**
    for fan-out via consumer groups. Source of truth = SurrealDB;
    Redis is a rebuildable hot buffer.
  - **Idempotency**: UUIDv7 event IDs + per-consumer
    `consumer_event_offset` table (60-day retention).
  - **Retention**: tiered hot 60 days + monthly-partitioned cold
    archive **forever**. The outbox **is** the audit trail.
  - **Schema versioning**: JSON + Zod + forward-compat (consumers
    ignore unknown fields). Optional `schema_version` metadata.
  - **Backpressure**: time-based lag alerting (warning > 1 min,
    critical > 5 min) + count fallback (> 10 k pending). MVP =
    monitoring only.
- **ADR-0017 Observability and Logging** (accepted 2026-05-17, gap
  D11/C6/E3). Self-hosted operational monitoring is the default:
  OpenTelemetry JS instrumentation; Grafana Loki, Prometheus, Tempo,
  Alloy and Grafana for logs/metrics/traces/dashboards; GlitchTip via
  Sentry-compatible SDKs for crash/error reporting. Client diagnostics
  are privacy-minimised, redacted before local queueing/sending and
  capped when stored offline. Product analytics are deferred to H7/G3
  and must not be mixed into operational logs.
- **ADR-0018 Systemic Events and Player Lifecycle Architecture**
  (accepted 2026-05-17). Player development, mentoring, injuries,
  systemic events, narrative rendering and venue operations are
  **domain-owned policies coordinated by deterministic event
  orchestration**, not one random-event context. The existing 11
  bounded contexts remain authoritative: Training computes load and
  development signals; Squad & Player owns player/injury state; Match
  emits match injury facts; Club Management owns stadium, venue,
  sponsors and fans; Notification renders deterministic narrative
  projections. Runtime AI text is a separate research track and is not
  approved for runtime simulation or narrative output.

## Needs Promotion

- ADR-0012, ADR-0014, ADR-0015, ADR-0016 proposed - awaiting Nico's
  accept / reject. Tracked as Wave 3 group **B** (B3, B5, B6, B7).
- ADR-0001..0009 are stubs - tracked as Wave 3 group **A** depth-rewrites.
- arc42 chapters 01-04, 07-08, 10-11 are stubs - tracked as Wave 3 group
  **C**.
- Feature specs are seeded (10 stubs in [[../20-Features/README]]) but
  need scoping per implementation beat.
- Game design notes for the 25 systems are mostly `draft`; mode + UI notes,
  tactics and match-engine gameplay are now `approved`. Per-system "Open
  questions" tuning is Wave 3 group **I**.
- Player-facing docs should be written after playable mechanics exist
  (Wave 3 group **K**, P3).
