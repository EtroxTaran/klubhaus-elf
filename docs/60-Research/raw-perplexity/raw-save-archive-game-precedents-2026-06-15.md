---
title: "Raw Perplexity - Save archive game precedents"
status: raw
tags: [research, raw, perplexity, save-games, archive, football-manager, ootp, steam-cloud, cloud-saves, fmx-170]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-170
related:
  - [[../postgres-schema-ceiling-slo-benchmark-2026-06-15]]
  - [[../../10-Architecture/09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]]
  - [[../../40-Execution/fmx-170-postgres-schema-ceiling-decision-queue-2026-06-15]]
---

# Raw Perplexity - Save archive game precedents

## Prompt

Research product and game precedents for limiting active saves/worlds while
preserving archived or cloud saves. Include Football Manager, OOTP,
Hattrick/online manager games if public evidence exists, Steam/console
cloud-save quotas if relevant, and SaaS/archive patterns for cold
storage/reactivation. Goal: inform whether a football manager should use
user-driven archive only, automatic LRU under capacity pressure, or a hybrid
with warnings.

## Raw discovery synthesis

Perplexity's useful discovery line was:

- FM-style career saves are primary player work products with high emotional
  value. Silent deletion or opaque eviction is a major trust risk.
- Football Manager's official save FAQ presents save compatibility as dependent
  on still having the save files, and says the transfer count is limited by
  device storage, not by an in-game automatic pruning policy.
- SEGA's cloud-save help page presents explicit user deletion from a Cloud tab
  for Steam/Epic/Xbox cloud saves; the user selects a save and deletes it.
- Online manager games often avoid the problem by limiting a user to one club
  or a small number of server-side worlds. That is a different product model,
  not a precedent for silently evicting multi-year FM-style careers.
- Steam/console/cloud-storage systems impose quota pressure, but generally
  surface warnings/conflicts or require user cleanup; the game should not
  quietly delete or archive valued careers.
- SaaS cold-storage precedent supports visible tiers, explicit retention
  policies, restore paths and grace notices. Auto-removal is acceptable for
  logs/backups or explicit retention policies, not primary user-created worlds.

## Option implications

| Option | Perplexity assessment | FMX implication |
|---|---|---|
| User-driven archive only | Strong player-trust posture; capacity pressure blocks new active saves until the user archives/deletes. | Safe but can be more friction when the user does not care which old save moves cold. |
| Automatic LRU archive | Operationally simple, but surprising for long-running careers. | Rejected for active saves; it looks like data loss even if technically recoverable. |
| User-confirmed hybrid | Best balance: capacity UI blocks activation, recommends the least-recently-played candidate, and requires explicit confirmation. | Recommended for FMX. LRU is a suggestion/order, not an autonomous mutation. |

## Design takeaways before source check

- Use player-facing terms such as active careers and archived careers.
- At soft pressure, warn and offer archive management.
- At hard pressure, block new active save creation/reactivation until the player
  archives or deletes one active save.
- Preselect the least-recently-played active save only as a suggestion in the
  confirmation UI.
- Archived saves remain visible and restorable; any future permanent archive
  retention policy needs a separate legal/product decision.

## URLs surfaced by Perplexity

- https://www.footballmanager.com/help/savegamefaq
- https://support.sega.com/hc/en-gb/articles/19454114381457-How-to-remove-Football-Manager-saves-from-my-cloud-storage
- https://partner.steamgames.com/doc/features/cloud
- https://www.reddit.com/r/footballmanagergames/comments/1nmip2r/help_fm_save_stuck_at_407_mb_on_cloud_gaming/
- https://culturedvultures.com/football-manager-24-enable-cloud-saves/

## Source-quality notes

- Official Football Manager and SEGA support pages are used as primary game
  precedent.
- Steamworks documentation is used only for platform cloud-save behaviour; it
  does not define FMX's product contract.
- Reddit/community examples are preserved as weak discovery signals and are not
  canonized.

## Related

- [[../postgres-schema-ceiling-slo-benchmark-2026-06-15]]
- [[raw-postgres-schema-ceiling-source-checks-2026-06-15]]
- [[../../10-Architecture/09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]]
