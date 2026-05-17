# storybook (deployable UI showcase)

Builds `apps/web` Storybook into a static bundle and serves it with nginx, as
the `showcase` service in `../../docker-compose.docs.yml` (separate subdomain,
**same** fail-closed basic-auth as the docs vault). See
`../docs-preview/README.md` for the combined two-site ops.

```bash
docker compose -f docker-compose.docs.yml up -d --build   # docs + showcase
```

## What the design system is / how to use the showcase

That is documentation, not ops — it lives in the vault:
`docs/10-Architecture/09-Design-System.md` (§1–12 = how the design system
works; §13 = using the showcase as a reference + the story-authoring
convention) and `docs/00-Index/UI-Showcase.md`.

## Build mechanics (why this exists)

- `Dockerfile`: `node:22` + corepack pnpm → `pnpm install --frozen-lockfile`
  → `pnpm --filter @soccer-manager/web build-storybook` → static output copied
  into `nginx:alpine`. Build context is the repo root (the pnpm workspace is
  required to resolve `@soccer-manager/web`).
- **TanStack Start is excluded from the Storybook Vite build** in
  `apps/web/.storybook/main.ts` (`viteFinal`). `@storybook/builder-vite`
  inherits the app `vite.config.ts`; left in, `tanstackStart()` hijacks the
  build (server/client split + PWA) and Storybook never emits `iframe.html`.
  Symptom if it regresses: blank manager, `iframe.html … 404`, console
  `received channelCreated but was unable to determine the source`.
- `nginx.conf`: serves **real files only** (`try_files $uri $uri/ =404`), no
  SPA `/index.html` fallback. Storybook static ships real `index.html` +
  `iframe.html` + `assets/` + `index.json` and routes via query/hash; a
  catch-all fallback would serve the manager HTML in place of the preview
  iframe and break the manager↔preview channel.

## Deploy notes

- Point the showcase domain at **container port 80** (nginx), not 3000.
- `SHOWCASE_DOMAIN` needs its own DNS A record at the Traefik host.
- A broken/missing story fails the CI `build-storybook` job before deploy.
