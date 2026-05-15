---
title: Dokploy Deployment
status: draft
tags: [deployment, implementation]
updated: 2026-05-15
---

# Dokploy Deployment

## Target apps

- `soccer-manager-dev`: branch `develop`, domain `dev.soccer-manager.etrox.de`
- `soccer-manager-prod`: branch `main`, domain `soccer-manager.etrox.de`

## Required Nico-provided access

- Dokploy URL and account/API access.
- DNS status for `*.etrox.de`.
- GitHub App/webhook permissions.
- Staging-only environment variables.

## Health check

Use `/healthz` on the app container.
