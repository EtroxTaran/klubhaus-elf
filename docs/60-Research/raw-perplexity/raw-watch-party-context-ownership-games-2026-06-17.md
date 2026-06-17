---
title: "Raw - Watch Party comparable games and platforms (FMX-159)"
status: raw
tags: [research, raw, perplexity, watch-party, games, football-manager, discord, spectator, conference, fmx-159]
created: 2026-06-17
updated: 2026-06-17
type: research
binding: false
linear: FMX-159
related:
  - [[../watch-party-context-ownership-2026-06-17]]
  - [[raw-watch-party-context-ownership-source-checks-2026-06-17]]
  - [[../../40-Execution/fmx-159-watch-party-context-ownership-decision-queue-2026-06-17]]
  - [[../../10-Architecture/09-Decisions/ADR-0133-watch-party-context-definition]]
---

# Raw - Watch Party comparable games and platforms (FMX-159)

## Research prompt

Perplexity was asked on 2026-06-17:

> Research comparable game/platform precedents for a football-manager Watch
> Party and conference mode: sports management games, esports spectator modes,
> Discord/Steam/platform co-play or Activities, Twitch/stream watch parties,
> synchronized watch rooms. What should FMX copy or avoid? How should it
> differentiate: one primary match per party, server-authoritative replay
> stream, chat/markers, host controls, conference mode? Provide recommendations
> and citations.

## Source-quality note

This pass mixed official/platform sources with weak community/forum links and
inferred esports patterns. FMX-159 keeps the raw analogies for product thinking,
but only canonizes source-checked official docs and current FMX architecture
constraints.

## Extracted findings

- Football Manager has synchronous multiplayer precedent through Versus Mode,
  but not a native rich Watch Party ownership model.
- Football Manager's official Versus Mode page is still useful because it names
  head-to-head online manager sessions and explicitly mentions spectator delay
  as a real UX issue.
- Discord Activities are a strong platform precedent for a hosted social
  experience with lifecycle, launch/auth/handshake, commands and events between
  host client and embedded app.
- Esports spectator systems are a useful analogy for separating authoritative
  game state from observer/host/viewer roles and overlays, but Perplexity's
  specific esport claims were not source-checked enough to treat as canonical.
- Steam Remote Play / host-device streaming is a weak and mostly negative
  analogy for FMX. FMX should not compress the authoritative match into a host
  video stream when the committed event log exists.
- Generic watch-room products support the simple pattern of one room, primary
  content, shared playback state and chat/reactions, but they miss FMX's
  differentiator: structured match-event metadata.

## Design recommendations surfaced

- MVP Watch Party should have one primary match. Conference mode may attach
  secondary matches and switch primary focus by host action or event prompt.
- Shared playback should be server-authoritative over ADR-0099's event-log
  stream, not host-device video.
- Party chat and markers should be event-time or cursor-time aligned so they
  remain useful in replay.
- Host/co-host/viewer roles should be explicit; free-for-all seek/pause is a
  grief risk.
- FMX should differentiate through manager-grade context: event markers,
  tactics/replay review, table-swing/conference prompts and post-match
  annotated replay artifacts.

## Perplexity citations surfaced

- Official Football Manager Versus Mode article:
  <https://www.footballmanager.com/news/versus-mode-returns-football-manager-fmfc-members>
- FM Scout Versus Mode guide:
  <https://www.fmscout.com/a-versus-mode-guide.html>
- Reddit Football Manager spectator discussion:
  <https://www.reddit.com/r/footballmanagergames/comments/1ly3a98/is_it_possible_to_play_this_game_with_minimal/>
- Steam community request for watching tournament matches:
  <https://steamcommunity.com/app/3551340/discussions/0/565911090118291797/>
- Discord Activities docs:
  <https://docs.discord.com/developers/activities/overview>
  <https://docs.discord.com/developers/activities/how-activities-work>

## Related

- [[../watch-party-context-ownership-2026-06-17]]
- [[raw-watch-party-context-ownership-source-checks-2026-06-17]]
- [[../../40-Execution/fmx-159-watch-party-context-ownership-decision-queue-2026-06-17]]
