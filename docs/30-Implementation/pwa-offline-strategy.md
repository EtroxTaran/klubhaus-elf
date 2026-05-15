---
title: PWA Offline Strategy
status: draft
tags: [pwa, implementation]
updated: 2026-05-15
---

# PWA Offline Strategy

Bootstrap uses `vite-plugin-pwa` with an injected service worker. Game saves will
use Dexie-backed IndexedDB. Mutating HTTP responses must not be cached.
