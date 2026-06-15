---
title: "FMX-183 BfDI breach notification playbook"
status: wrapped
tags: [meta, execution, handoff, gdpr, privacy, incident-response, breach-notification, bfdi, fmx-183]
created: 2026-06-15
updated: 2026-06-15
type: handoff
binding: false
linear: FMX-183
related:
  - [[../../60-Research/breach-notification-runbook-2026-06-15]]
  - [[../fmx-183-breach-notification-decision-queue-2026-06-15]]
  - [[../../30-Implementation/incident-response]]
  - [[../../30-Implementation/privacy-and-consent]]
---

# Handoff: FMX-183 BfDI breach notification playbook (2026-06-15)

## Goals

- Claim FMX-183 and wire the BfDI breach-notification operational drill into
  the incident-response runbook.
- Preserve Perplexity discovery, source checks, synthesis and decision packet.
- Close privacy-and-consent FU-7 without making a new binding decision for Nico.

## Completed

- Claimed FMX-183 in Linear as `In Progress`.
- Fetched current `origin/main` and created clean branch/worktree
  `codex/fmx-183-bfdi-breach-playbook`.
- Ran Perplexity discovery on GDPR Art. 33/34 breach notification for a small
  Germany-based online game/PWA.
- Source-checked GDPR Art. 33/34, EDPB routing, EDPB Guidelines 9/2022 and the
  BfDI Lucom form.
- Added raw research, source checks and synthesis:
  [[../../60-Research/breach-notification-runbook-2026-06-15]].
- Added decision queue
  [[../fmx-183-breach-notification-decision-queue-2026-06-15]].
- Updated [[../../30-Implementation/incident-response]] with BfDI form link,
  72-hour checkpoints, RACI, severity mapping, Art. 33 checklist, Art. 34 handoff
  and drill cadence.
- Closed [[../../30-Implementation/privacy-and-consent]] FU-7 by linking the
  operational BfDI runbook.

## Open Tasks

- Nico decision needed: D1-D5 in the decision queue.
- If accepted, promote front-door wording from decision-pending to accepted and
  keep the operational home split stable.
- Push/open the PR and link it to Linear.

## Decisions Made

- No architecture, privacy or legal decision made by the agent. Recommended
  packet is D1-D5 = A/A/A/A/A, pending Nico.

## Blockers

- Competent-authority routing cannot be treated as a permanent legal conclusion
  until Nico confirms entity/main-establishment posture or counsel validates it.

## Durable Notes Updated

- [[../../60-Research/breach-notification-runbook-2026-06-15]]
- [[../../60-Research/raw-perplexity/raw-breach-notification-runbook-2026-06-15]]
- [[../../60-Research/raw-perplexity/raw-breach-notification-runbook-source-checks-2026-06-15]]
- [[../fmx-183-breach-notification-decision-queue-2026-06-15]]
- [[../../30-Implementation/incident-response]]
- [[../../30-Implementation/privacy-and-consent]]
- Front-door maps and indexes for research, implementation, Current-State,
  Decision-Log and handoffs.

## Promotion Needed

- After Nico approval, treat D1-D5 as accepted. Do not convert the broader
  incident-response note to binding unless Nico explicitly wants that governance
  change.
