---
title: "ADR-0046: Team Topology & Multi-Lead Scaling"
status: accepted
tags: [adr, architecture, process, scaling, future-scope]
created: 2026-05-27
updated: 2026-06-08
type: adr
binding: false
supersedes:
superseded_by:
related: [[../bounded-context-map]], [[ADR-0019-modular-monolith-ddd]], [[../../90-Meta/collaboration-and-decision-protocol]], [[ADR-0044-cicd-and-merge-policy]], [[../../00-Index/Decision-Log]]
---

# ADR-0046: Team Topology & Multi-Lead Scaling

## Status

draft

> **Future-scope.** Activates when a second lead joins. Until then Nico holds all
> roles; nothing here changes the solo setup today — it records the prepared path so
> the migration is additive, not a rewrite.

## Date

2026-05-27

## Context

Today solo (Nico). The project will grow to **multiple leads**, each likely owning a
domain (e.g. Player Development, Finance) and working with agents or directly. The
foundations must be ready so adding a lead is additive. The seams already exist: the
**11 bounded contexts** ([[../bounded-context-map]], [[ADR-0019-modular-monolith-ddd]])
are the natural ownership units (Conway's law), and the vault/Linear/git conventions are
author-agnostic.

## Options Considered

- Keep everything Nico-centric and refactor later · **prepare a documented, additive
  migration path now** (roles, ownership map, CODEOWNERS-by-domain, trigger).
- Linear: one team + area labels · sub-teams per domain.

## Decision

Prepare (not yet activate) the following, triggered when the **second lead** joins:

1. **Roles:** **Lead Architect** (cross-cutting/architecture, one-way doors) +
   **Domain Leads** (decide within their bounded context). The ask-first gate becomes
   "ask the owning Lead; architecture-wide → Lead Architect". Add label
   `needs:lead-decision` beside `needs:nico-decision`.
2. **Ownership map:** an explicit **bounded context ↔ Lead/team** mapping, mirrored in
   **`.github/CODEOWNERS` by domain** (teams, not individuals — avoids bus-factor) and
   in Linear (assignee = responsible human; sub-team or area-label per context).
3. **Flow at scale:** trunk-based + short-lived branches + **feature flags**;
   **merge queue**; a rotating **"flow captain"** owning CI health (~5+ leads).
   Commits authored per human; Linear assignee = the responsible human (not Nico).
4. **Until the trigger:** solo — Nico is Lead Architect + every Domain Lead; CODEOWNERS
   stays `@EtroxTaran`; merge policy per [[ADR-0044-cicd-and-merge-policy]].

## Rationale

Aligning teams to bounded contexts (Conway) means a lead can own, rebuild and scale a
module independently — exactly the modularity ADR-0019 already buys. Defaulting
ownership to teams and using CODEOWNERS routing prevents single-person bottlenecks as
the group grows, without changing anything while solo.

## Consequences

Positive:

- Adding a lead is a config/doc change (CODEOWNERS, roles, Linear), not a rewrite.
- Clear domain accountability; review routing scales with the team.

Negative:

- Requires discipline to keep the ownership map + CODEOWNERS in sync with contexts.
- Role model itself is a `needs:nico-decision` to ratify when the time comes.

## Supersedes

None.

## Related Docs

- [[../bounded-context-map]] · [[ADR-0019-modular-monolith-ddd]]
- [[../../90-Meta/collaboration-and-decision-protocol]] · [[ADR-0044-cicd-and-merge-policy]]
