---
title: "GD Re-Audit — Cluster G1: Core loop / Onboarding / Save / Mobile UX / MVP scope / Data-gen (2026-06-08)"
status: draft
tags: [research, gd-audit, game-design, core-loop, onboarding, save, mobile-ux, mvp-scope, data-gen, ip-clean, cluster-g1]
created: 2026-06-08
updated: 2026-06-09
type: research
binding: false
related:
  - [[../50-Game-Design/GD-0001-core-loop]]
  - [[../50-Game-Design/GD-0012-onboarding]]
  - [[../50-Game-Design/GD-0014-save-career-model]]
  - [[../50-Game-Design/GD-0015-ip-clean-data]]
  - [[../50-Game-Design/GD-0016-mobile-ux-loop]]
  - [[../50-Game-Design/GD-0017-mvp-scope-and-mode-sequencing]]
  - [[../10-Architecture/09-Decisions/ADR-0003-match-engine]]
  - [[../10-Architecture/09-Decisions/ADR-0005-save-format]]
  - [[../10-Architecture/09-Decisions/ADR-0006-i18n]]
  - [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]]
  - [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]]
  - [[../10-Architecture/09-Decisions/ADR-0010-design-system]]
  - [[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
  - [[adr-re-audit-master-2026-06-08]]
  - [[adr-re-audit-c1-2026-06-08]]
  - [[adr-re-audit-c2-2026-06-08]]
  - [[adr-re-audit-c3-2026-06-08]]
  - [[../00-Index/MVP-Scope]]
  - [[../00-Index/Non-Goals]]
  - [[../00-Index/Decision-Log]]
---

# GD Re-Audit — Cluster G1: Core loop / Onboarding / Save / Mobile UX / MVP scope / Data-gen

Read-only decision-readiness audit of the six G1 GDDRs for the PLANNING-MODE ratification
sweep. All six were reset to `status: draft` on 2026-05-27, so each needs an explicit
disposition in the Decision-Queue — including the ones whose *content* is fine. Ground truth
respected: offline-first PWA (ADR-0002), LLM out of authoritative state (ADR-0030), Dokploy
deploy (ADR-0044), narrow cloud-sync (ADR-0090), Postgres = system-of-record. **Propose only —
Nico ratifies; nothing here is accepted.** This note builds on the ADR re-audit cluster notes
[[adr-re-audit-master-2026-06-08]] (C1–C9) and does not relitigate their verdicts; it reuses
their already-proposed superseding ADRs (ADR-0094 i18n, ADR-0096 determinism, ADR-0098
save-format) as the closure path for the open Wave-2 items these GDs still carry.

Key observation up front: **four of the six GDs are content-sound and ratify essentially
unchanged** — they were already re-ratified live (GD-0012 via FMX-99, GD-0016's R2-07/16/17
via FMX-98/100), or restate accepted constraints (GD-0014, GD-0015). The audit's job here is
mostly to (a) confirm each is clean, and (b) record where a GD's **own "Open (Wave 2)" list**
now has an answer in the new draft-ADR portfolio, so the reopen→re-ratify pass can close those
loops rather than leave them dangling.

## Per-GD verdicts

### GD-0001 Core Career Loop & Weekly Rhythm — **sound** · disposition ratify-as-is · confidence high
The 7-day-tick + separate match-tick model, single "advance" verb, canonical Mon–Sun week,
~7-week pre-season → league → cup → winter-break → review → window arc, and the mobile inner
loop are well-grounded in `anstoss-series-deep-dive` / `club-boss-analysis` and feed ADR-0003
(match-tick) + ADR-0008 (advance verb). No contradiction with any binding ADR; the match-tick
vs day-tick split it imposes is exactly the constraint ADR-0003/ADR-0026/`determinism-and-replay`
already build on. **One residual open item:** the `tick`(engine) vs `day`(UI) terminology
disambiguation (R2-19) — a glossary/naming hygiene task, *not* a design decision, and it overlaps
the cross-cluster "shared vocabulary" cleanup the master note routes to ADR-0101 / glossary work.
**Recommendation:** ratify the Decided/strong block as-is; the tick/day glossary item is a
documentation follow-up, not a blocker and not a GD-level open question. dependsOn: none
(ADR-0003/0008 are downstream, not prerequisites).

### GD-0012 Onboarding & New Game — **sound (already re-ratified live)** · disposition ratify-as-is · confidence high
This is the most thoroughly closed GD in the cluster. R2-05 was resolved live in FMX-99
(2026-06-03): the FTUE path, the Season-1 objective roadmap, the deterministic feed-card
priority formula (no cross-save profiling — coheres with ADR-0030's no-LLM-authority and the
project's privacy posture), the Assistant auto-handling boundary (no authoritative mutation
without explicit + server confirmation — consistent with ADR-0020/ADR-0090), and the WCAG 2.2 AA
route-semantics. Its "Open (Wave 2)" list is explicitly **"None for R2-05."** The MVP amendment
correctly subordinates it to GD-0017 (Career shown as "comes later"). **The only live tether** is
that onboarding copy/tone feeds ADR-0006 (i18n) — and ADR-0006 is stale, already slated for
supersession by **ADR-0094** (Paraglide + 5 MVP locales) per C1. That is an inherited dependency,
not a defect in GD-0012. **Recommendation:** ratify-as-is; note the copy/tone dependency on the
ADR-0094 successor (no onboarding *design* change implied). The 60-second target keeps its own
prototype-stage stopwatch evidence gate (p50 ≤60s / p90 ≤90s) — correctly framed as a future
build-beat gate, not a docs-phase claim. dependsOn: ADR-0094 (i18n successor) for copy only;
GD-0017 (already ratified-first by MVP-sequencing precedence).

### GD-0014 Save & Career Model — **sound rules, one critical open item now answerable** · disposition ratify-with-amendment · confidence high
The ratified rules are solid and restate accepted ADR-0005 + Non-Goals: versioned forward-only
migrations, no localStorage/ad-hoc-JSON fallback, multiple parallel saves per profile (improving
on Anstoss single-slot), three rotating autosave slots + manual + explicit "Restore previous"
(never silent), no `Date` objects (ISO strings, structured-cloneable), and cloud-sync /
local-authoritative / user-facing export-import correctly deferred post-MVP behind reserved
contracts. The MVP amendment under ADR-0020 is clean. **Why amendment, not as-is:** GD-0014's own
"Open (Wave 2)" block lists **R2-08 (critical) — save-determinism/replay format (event log vs
snapshot vs delta)** as still open. The ADR re-audit has since answered the determinism axis:
[[adr-re-audit-c3-2026-06-08]] + the master note route it to **ADR-0096** (mandatory
integer/fixed-point numeric surface; **resim-from-kickoff committed event-log is the only replay
model — NO persisted snapshots**; `MatchFrame` derived-never-persisted), and the save-envelope
side to **ADR-0098** (KDF upgrade + `activePacks` refs). So R2-08's "event log vs snapshot vs
delta" sub-question is effectively decided in favour of **committed-event-log + forward-migrated
snapshot envelope (no per-minute snapshot persistence)** by the binding `determinism-and-replay`
contract — GD-0014 just hasn't been updated to record it. The amendment is to **close R2-08 by
reference** (point at ADR-0096/ADR-0098, not re-decide it here) so the save model and the replay
contract have one head. R2-12 (hotseat multi-manager) stays open (defer; tied to ADR-0004). The
optional extras (export encryption passphrase, save-format linter CLI, autosave quota-eviction)
are correctly optional/post-MVP. **Recommendation:** ratify with the R2-08-closure amendment.
dependsOn: ADR-0096 (determinism/replay), ADR-0098 (save-format successor), ADR-0005 (origin).

### GD-0015 IP-clean Data Generation — **sound rules; the open algorithm + two needs-decision sub-items are genuine scope calls** · disposition ratify-with-amendment · confidence high
The full-IP-clean v1 posture (no real clubs/players/crests/protected names; league *structures*
mirrored as uncopyrightable facts; deterministic `gameId`-seeded denylist-driven naming with the
`pnpm gamedata:lint` CI gate; real-country-names+ISO for nationality but fictional league branding;
blocked abbreviations FCB/BVB/PSG; no real-club name on the *input* side) restates accepted
ADR-0007 and `ip-and-licensing §9`, and the FMX-54 amendment correctly extends IP-cleanliness to
the social/commercial world (fan groups, reps, journalists, agents, sponsor brands, chants) with
no real supporter lists / handles / special-category data — fully consistent with the vault-wide
"evocative-but-clearly-not-real" naming rule and the GDPR posture. The Decided block ratifies
cleanly. **Why amendment, not as-is:** GD-0015 carries **R2-02 (critical) — the generation
*algorithm* itself** as explicitly NOT approved, plus **two `needs-decision` product items** that a
workflow cannot pre-decide: (1) community datapack opt-in (current default: off, revisit M5+);
(2) editor-typed real names (current default: EULA + dialog). These two are real product/scope/legal
calls — they trade off community reach vs IP/DSA exposure — so they surface as `scopeCallForNico`
D-questions, with the conservative status-quo default recommended for MVP. R2-02 (which name model:
Markov/n-gram/LM; crest SVG synthesis; CC BY-SA viral-risk handling for player-name corpora) is a
research-then-decision item that should stay deferred to its own grounded pass — it is not blocking
MVP scope and the *rules* it must satisfy are already fixed. **Recommendation:** ratify the rules;
record R2-02 as deferred (own research pass) and put the two community/editor `needs-decision` items
to Nico as scope calls with status-quo defaults. dependsOn: ADR-0007 (origin), ADR-0004 (data-model).

### GD-0016 Mobile UX Gameplay Loop — **sound (R2-07/16/17 resolved live; only R2-10/i18n remains)** · disposition ratify-as-is · confidence high
One mobile-first responsive UI, single "this week" home with next-match + 3–4 contextual cards,
tap-only chairman loop, hub+drill-down nav, tabular→cards, halftime 30s modal, "guardrails at the
edges / freedom at the centre", sort/filter from day one, delivered via ADR-0010 Klubhaus Design-System.
The big open items are **already resolved**: R2-07 (route map + IA) and R2-17 (layered client-state
+ narrow Zustand v5 slice, reconciling the old GD-0016↔ADR-0021 Zustand contradiction) by **ADR-0008
(FMX-98, accepted 2026-06-03)**; R2-16 (in-match controls + render seam) by **GD-0025 + ADR-0072
(FMX-100)**. The only remaining open thread is **R2-10 (i18n, medium)** — and that is the *same*
ADR-0006→ADR-0094 supersession C1 already owns; it is not a GD-0016 design defect. The GD's
`locales/{de,en}.ts` mention inherits the stale 2-locale assumption that ADR-0094 (5 MVP locales)
corrects — a downstream touch-point to migrate with the i18n ADR, not a reason to amend GD-0016.
**Recommendation:** ratify-as-is; the i18n locale-count/library question is owned by ADR-0094, and
the `{de,en}` reference should be updated when that ADR lands (editorial, fold into the ADR-0094
migration touch-point list). dependsOn: ADR-0008 (realises it, already accepted), ADR-0010, ADR-0094
(i18n successor, for the locales reference only).

### GD-0017 MVP Scope and Mode Sequencing — **sound, fully canonical-aligned; a pure product/scope call** · disposition ratify-as-is · confidence high · **scopeCallForNico**
MVP = Create-a-Club Roguelite playable, Manage-a-Club Career "comes later", singleplayer as
long-term reference, async-MP / watch-parties / human-to-human negotiation post-MVP, hybrid-online
(not full offline-first) for MVP with offline as a future selective capability, export/import
post-MVP behind reserved envelope. This is **verbatim consistent** with the canonical
[[../00-Index/MVP-Scope]] and [[../00-Index/Non-Goals]] (checked: same mode flow, same "comes later"
language, same hybrid-online posture, same export/import deferral), and it correctly self-declares
as the supersede-head for older "both modes day-0 / full-offline-MVP" notes. There is **no technical
open question** — the entire content is a product/scope prioritisation (which mode is the first
playable, what is deferred). That makes it the one card in G1 that is a genuine
`scopeCallForNico = true`: a workflow cannot pre-decide MVP scope, even though every dependency is
already aligned to this exact answer. **Recommendation:** ratify-as-is as a confirmed scope call;
no amendment, no open D-question beyond Nico re-affirming the MVP boundary. dependsOn: ADR-0020
(hybrid-online MVP, already the architecture head).

## Cross-GD observations within G1

1. **Most G1 open items are already answered by the ADR re-audit portfolio — the sweep should
   *close by reference*, not re-decide.** GD-0014's R2-08 → ADR-0096/ADR-0098; GD-0012 + GD-0016's
   i18n tether (R2-10, `{de,en}`) → ADR-0094; GD-0001's tick/day glossary → glossary/ADR-0101
   vocabulary work. Ratifying these GDs is mostly recording those closures so no loop dangles.

2. **Only two genuinely open *decisions* live in G1, both in GD-0015** (community datapack opt-in;
   editor-typed real names). Everything else is either resolved or a documentation/reference update.
   These two are product/legal scope calls (community reach vs IP/DSA/privacy exposure), not
   technical defaults — they belong to Nico with the conservative status-quo recommended for MVP.

3. **GD-0017 is the scope anchor and should ratify early.** GD-0012 (Career "comes later") and
   GD-0014 (export/import + full-offline deferred) both defer to it; it is already canonical in
   MVP-Scope/Non-Goals. Ratifying GD-0017 first makes the "comes later / post-MVP" framing in the
   others non-contentious.

4. **No harmful coupling and no content contradiction found** across the six. The historically
   risky seam (GD-0016 "no Zustand god-store" vs ADR-0021's Zustand v5) was already reconciled by
   ADR-0008 §D2 (narrow client-only slice allowed) and needs no further action here.

5. **Stopwatch / evidence gates are correctly framed as future build-beats, not docs-phase claims**
   (GD-0012's p50≤60s/p90≤90s, p50≤180s-to-kickoff). The reopen→re-ratify pass should preserve those
   gates verbatim, not treat them as already-met.

## Open decisions surfaced for Nico (Decision-Queue inputs)

- **GD-0014 / R2-08 closure (amendment):** record that the save-determinism/replay-format axis is
  decided by the binding `determinism-and-replay` contract via ADR-0096 (committed-event-log,
  resim-from-kickoff, no persisted snapshots) + ADR-0098 (envelope) — i.e. **event-log over
  snapshot/delta**. Confidence high. dependsOn ADR-0096/0098.
- **GD-0015 / community datapack opt-in (scope call):** options (A) keep default-off, revisit M5+
  [recommended — minimal IP/DSA surface for MVP]; (B) opt-in import with best-effort validation now;
  (C) hosted pack distribution now [rejected for MVP — needs DSA/UGC/privacy gate]. Confidence high
  for (A).
- **GD-0015 / editor-typed real names (scope call):** options (A) EULA + warning dialog, local-only,
  never shipped/synced [recommended — current default, lowest exposure]; (B) hard-block real names at
  input even locally; (C) allow + sync. Confidence high for (A).
- **GD-0017 (scope confirmation):** re-affirm Roguelite-first / Career-comes-later / hybrid-online
  MVP boundary. Pure product call; no technical alternative to weigh. Confidence high it should
  ratify as-is.

## Sources
- Internal (authoritative): [[adr-re-audit-master-2026-06-08]] (R2-08→ADR-0096/0098; i18n→ADR-0094;
  vocabulary→ADR-0101), [[adr-re-audit-c1-2026-06-08]] (ADR-0006 stale → Paraglide/5-locale ADR-0094),
  [[adr-re-audit-c3-2026-06-08]] (resim-from-kickoff, no persisted snapshots = the binding replay
  model), [[../00-Index/MVP-Scope]] + [[../00-Index/Non-Goals]] (GD-0017 alignment confirmed),
  [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]] (Accepted; IP-clean generator contract),
  [[../10-Architecture/09-Decisions/ADR-0005-save-format]] (Accepted; envelope/versioning).
- No external lookup was required: every G1 assumption is either grounded in already-cited internal
  research (`anstoss-series-deep-dive`, `club-boss-analysis`, `pwa-offline-patterns`,
  `ip-and-licensing`, `determinism-and-replay`) or is a product/scope call with no external fact to
  verify. The genuinely uncertain technical axis (name-generation algorithm, R2-02) is *deferred* by
  GD-0015 itself, so it is parked for its own grounded research pass rather than pre-judged here.
