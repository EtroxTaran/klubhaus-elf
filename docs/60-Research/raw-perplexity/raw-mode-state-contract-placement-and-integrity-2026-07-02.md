---
title: "Raw: mode-state contract placement and integrity (dual-mode Wave 2)"
status: raw
tags: [research, raw, dual-mode]
created: 2026-07-02
updated: 2026-07-02
type: research
binding: false
sourceType: external
---

# Raw capture: mode-state contract placement and integrity

Raw external research for
[[../mode-state-contract-placement-and-integrity-2026-07-02]] (FMX-212,
dual-mode Wave 2). Four queries: tamper-evident competitive metadata for
offline-capable games; per-entry assist flags on leaderboards (Forza); the
BG3 Honour-Mode save flag; preference-vs-record placement and settings-sync
practice; web attestation availability.

## Q1 (Perplexity): tamper-evident mode/difficulty flags in offline-capable games

Prompt: how do offline-capable / client-authoritative games keep competitive
metadata (difficulty, assist, honor-mode flags) tamper-evident for later sync
— server-attested-on-sync vs client-signed hash-chained logs vs
accept-and-flag trust tiers; named examples.

Substantive answer (condensed):

- Games make such metadata "tamper-evident, not fully tamper-proof": either
  **re-derive it on sync from an authoritative log**, or attach it to an
  **append-only, hash-chained, signed event history**, or fall back to
  **trust tiers** ("accepted but flagged", separate verified/unverified
  boards, moderation).
- Strongest documented pattern is **server-attested-on-sync**: "the client's
  value is treated as a claim, and the server verifies it from signed
  gameplay telemetry or authoritative state rather than trusting the local
  flag." The AEPD video-game guidance explicitly distinguishes client-side
  logs from authoritative server-side telemetry
  (https://www.aepd.es/en/guides/videogames-recommendations-industry.pdf).
- **RFC 9162 (Certificate Transparency v2)** named as the clearest published
  construction for tamper-evident append-only logs (Merkle tree / hash
  chain); "not a game standard, but the clearest named source for the
  underlying anti-tamper construction."
- **Client-signed hash-chained logs** caveat: "signatures only help if the
  signing key is protected from trivial extraction... a modified client can
  often sign its own fabricated history, so this pattern is best used as
  tamper-evident *evidence*, not absolute proof, unless combined with
  hardware-backed attestation or server-side cross-checking."
- **PWA/browser limitation:** "browser-based clients and PWAs generally do
  not have the same access to device attestation APIs as native apps...
  browser/PWA competitive integrity [is] more dependent on server
  reconciliation, replayable logs, and trust-tier moderation."
- Named examples graded by the answer itself: speedrun.com = documented
  trust-tier/moderation pattern; Steam leaderboards = well-known
  "never trust the client" doctrine but weak canonical documentation; BG3
  Honor Mode = "game-state enforcement with mode invalidation", **no
  evidence of a cryptographically tamper-evident design**; Forza =
  "metadata tagging plus validation/segregation", cryptographic detail
  undocumented; iRacing = server-hosted, prevents untrusted result creation
  up front.
- Practical synthesis offered: offline play → append-only hash-chained,
  signed session log verified on sync; rankings → derive flags server-side
  from authoritative events, treat client-asserted values as hints; high
  cheat risk → flagged/unverified tier with later promotion.

Weakness flagged in-answer: for BG3/Forza/Trackmania/Steam, public sources
show the *policy outcome*, not the wire-level verification design. Several of
the auto-citations returned by the engine were generic tamper-evidence pages
(packaging/security), not game sources — treated as noise; only the AEPD
guide and RFC 9162 are carried into the synthesis, at reduced confidence.

## Q2 (Exa): Forza leaderboard assist flags per entry

Query: Forza leaderboard entries showing which assists each driver used per
lap record.

Substantive results:

- "Leader Boards + assists" — Official Forza Community Forums,
  https://forums.forza.net/t/leader-boards-assists/96209 (2020): leaderboard
  UI shows the assists leading drivers used per time.
- "Hardcore Leaderboard" — https://forums.forza.net/t/hardcore-leaderboard/22995
  (2015): the hardcore board is a **filter over the recorded assist metadata
  of your single best lap**: "the game only tracks your very best lap time
  for a given event or track/class combo. if that time doesn't qualify as
  Hardcore, you won't see it on that board"; "Yep its just a filter so if
  you have already set a faster lap with assists you'll have to beat that
  without first". Also: steering-assist granularity is *not* distinguished
  ("Leaderboards don't appear to make any distinction between normal and
  sim steering, only the other assists").
- "[Q] Exclamation mark on Laptimes" —
  https://forums.forza.net/t/q-exclamation-mark-on-laptimes/85660 (2018):
  per-lap **invalidation flag** ("dirty lap") for rewind use, friction
  assist, cutting, or **changing assists mid-lap**; "invalidated times are
  ranked lower than 'clean' ones, even if they are faster" — an
  accept-and-flag pattern on the rated unit itself.
- "Forza 6 - Leaderboards/Rivals" —
  https://forums.forza.net/t/forza-6-leaderboards-rivals/17492: community
  debate confirming per-entry assist visibility and the
  softcore/hardcore dual-board idea.
- "The Friction Assist Glitch" —
  https://forums.forza.net/t/the-friction-assist-glitch/66083 (2017): a
  client-side assist mislabeling bug polluted "clean" boards until patched —
  evidence that flag integrity, not flag existence, is the hard part.

All forum-sourced (community + legacy official forums): pattern confidence
high, exact current rules medium/low.

## Q3 (Exa): BG3 Honour-Mode flag behavior and forgeability

Query: BG3 honour mode save flag, downgrade to custom mode, modified saves.

Substantive results:

- Larian Community Update #25 (baldursgate3.game/news/community-update-25):
  Honour Mode = single save, save-scumming disabled; on death "you can
  continue your adventure, which will then disable Honour Mode"; finishing
  without dying awards the Golden D20 — the canonical **one-way visible
  downgrade** (never blocks play, permanently re-badges the run).
- Larian Hotfix #26 notes (forums.larian.com Number=950578): switching
  between Honour and non-Honour saves leaked Legendary Actions across modes
  — evidence that per-save mode state, not account state, drives rules.
- Steam Community guide "How to convert a failed Honour Mode Run back to
  Honour Mode from Custom Difficulty"
  (https://steamcommunity.com/sharedfiles/filedetails/?id=3537088929, 2025)
  and bg3.wiki "Guide:Circumventing Honour Mode Save File Restrictions"
  (https://bg3.wiki/wiki/Guide:Circumventing_Honour_Mode_Save_File_Restrictions):
  the honour flag is a **plainly editable save-file fact**; the community
  routinely restores failed honour runs by editing/backing up files. The
  flag is honor-system for anything local — a direct warning for any design
  that stores a competitive mode badge as a client-held flag.

## Q4 (Perplexity): preference vs competitive record placement; settings sync practice

Prompt: (1) games separating account-level preference from per-match /
per-season records of what was actually used (Halo input queues, chess
per-time-control ratings, GT7 assists, FM save-scoped responsibilities);
(2) documented cloud-save practice for settings vs progress.

Substantive answer (condensed):

- **Chess (verified):** Lichess FAQ — "Lichess ratings are Glicko-2 ratings,
  one per game variant" (https://lichess.org/faq); Chess.com keeps separate
  Blitz/Bullet/Rapid/Daily ratings under one account/profile. One account
  identity, multiple per-format competitive records.
- **Valorant (verified):** account-level progression (Account Level/AP,
  https://playvalorant.com/en-us/news/game-updates/valorant-account-leveling-explained/)
  is stored and displayed separately from per-mode competitive rank
  (https://support.riotgames.com/en-us/valorant/gameplay/valorant-competitive-mode-faq).
- **Halo Infinite (behavior verified, schema not):** ranked input-based
  pools exist and the game knows the input used when you joined a match; no
  public engineering doc states how/where the per-match input fact is
  stored. Flagged unverifiable at schema level.
- **GT7 (partially inferred):** assists/setups configurable and persisted
  per car/event and reflected in results/replays; internal data model not
  public. Flagged.
- **Football Manager (behavioral):** staff responsibilities/delegation are
  set per career and do not carry to a new save — save-scoped facts, not
  account profile facts; no official technical statement. Flagged.
- **Settings vs progress sync (documented):** Steam Cloud is file-based
  sync with **Cloud Conflict dialogs** when local and cloud differ
  (Steamworks docs); Google Play Games separates the **Play Games profile**
  (name/avatar/preferences) from **game progress linked to the account**,
  managed separately (https://support.google.com/googleplay/answer/14641155);
  Game Accessibility Guidelines recommend settings saved to portable
  profiles
  (https://gameaccessibilityguidelines.com/allow-settings-to-be-saved-to-different-profiles-at-either-game-or-platform-level/).
  The exact phrase "LWW for preferences, authoritative/merge for progress"
  appears in no single official paragraph — it is the consistent pattern
  across these docs, flagged as synthesis.
- Competitive rankings are uniformly **server-authoritative**; "client
  devices generally do not merge or resolve ranking data."

## Q5 (Exa): web attestation availability for PWAs

Query: Google abandoning Web Environment Integrity; device attestation for
web apps.

Substantive results:

- Official explainer repo: "⚠️ NOTE: This proposal is no longer pursued."
  (https://github.com/explainers-by-googlers/Web-Environment-Integrity).
- The Register, 2023-11-02: "the Web Environment Integrity proposal is no
  longer being considered by the Chrome team"
  (https://www.theregister.com/software/2023/11/02/google-abandons-web-environment-integrity-api-proposal/).
- Ars Technica, 2023-11-06: WEI killed for the open web; Google pivoted to
  an **Android WebView Media Integrity API** only; Play Integrity remains a
  native-Android capability
  (https://arstechnica.com/google/2023/11/google-kills-web-integrity-drm-for-the-web-still-wants-an-android-version/).
- Wikipedia "Web Environment Integrity": prototype removed from Chromium
  Nov 2023 (https://en.wikipedia.org/wiki/Web_Environment_Integrity).

Net: there is **no device/runtime attestation API for the open web** as of
the knowledge horizon — a PWA cannot prove client integrity; client
signatures remain evidence, not authority (consistent with ADR-0115's own
wording).
