---
title: Implementation (Map of Content)
status: current
tags: [implementation, moc]
created: 2026-05-17
updated: 2026-05-17
type: index
binding: true
related: [[../00-Index/Home]], [[agent-workflow-pattern]], [[../10-Architecture/README]]
---

# Implementation — Map of Content

Hub for the implementation domain — process, CI, infra, and integration notes.
Each note links back here and to the ADRs/modules it realizes.

## Process & workflow

- [[agent-workflow-pattern]] — **single source of truth for how agents work**
- [[cursor-cloud-agent-workflow]] — cloud-agent operational steps
- [[linear-task-tracking]] — operational task tracker
- [[ci-and-review-process]] — green-by-default enforcement
- [[design-sync-workflow]] — design export → codebase

## Infrastructure & integration

- [[deployment-dokploy]] — Dokploy/Hetzner deployment
- [[surrealdb-integration]] — schema & migrations
- [[pwa-offline-strategy]] — PWA/offline implementation
- [[secrets-rotation]] — credential policy

## Up

- [[../00-Index/Home]] — vault hub · [[../00-Index/Current-State]] — live state
- [[../10-Architecture/README]] — architecture MOC · [[../60-Research/00-summary]] — research MOC
- [[../90-Meta/agent-memory-protocol]] — memory protocol
