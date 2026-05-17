# docs-preview

Browser preview of the Obsidian vault (`docs/`) using [Quartz v4].

```bash
pnpm docs:preview
```

Then open <http://localhost:8080>. The vault homepage (`docs/00-Index/Home.md`)
is the landing page; wikilinks, frontmatter and the graph view work as in
Obsidian.

## How it works

`preview.mjs`:

1. Clones Quartz v4 into `.quartz/` (gitignored) on first run.
2. Installs Quartz's own dependencies **inside that checkout only** — Quartz
   uses npm internally. This is a vendored tool, isolated from the pnpm
   workspace, so the repo's pnpm-only rule is not violated.
3. Mirrors `docs/` into `.quartz/content/` (excluding `.obsidian/`) and copies
   `00-Index/Home.md` to `content/index.md` as the landing page.
4. Runs `npx quartz build --serve`.

## Notes

- Refresh the Quartz checkout: delete `tools/docs-preview/.quartz/` and re-run.
- Pin a reproducible Quartz version: `QUARTZ_REF=v4.5.1 pnpm docs:preview`
  (defaults to Quartz's rolling `v4` stable branch).
- Nothing here is tracked by Git — see the root `.gitignore`.

## Deploying (one stack, two internal sites)

`../../docker-compose.docs.yml` is a single Dokploy stack, independent of the
game app and SurrealDB, that serves **two** auth-gated sites:

| Service | Source | URL | What |
|---|---|---|---|
| `docs` | `tools/docs-preview/Dockerfile` (Quartz → nginx) | `DOCS_DOMAIN` | Obsidian vault |
| `showcase` | `tools/storybook/Dockerfile` (Storybook → nginx) | `SHOWCASE_DOMAIN` | UI design-system showcase |

Both sit behind the **same** fail-closed basic-auth (`DOCS_BASIC_AUTH` guards
both). `nginx.conf` in each tool dir handles clean URLs (Quartz `/a/b` →
`/a/b.html`; Storybook SPA fallback to `/index.html`).

```bash
docker compose -f docker-compose.docs.yml up -d --build
```

### Access control (required)

The docs site is internal. The Traefik basic-auth middleware is **fail-closed**:
the stack will not start unless `DOCS_BASIC_AUTH` is set.

1. Generate credentials: `htpasswd -nbB <user> <pass>`
2. In the deploy environment (Dokploy env / `.env`), set `DOCS_BASIC_AUTH` to
   that value. In a compose `.env` file every `$` must be doubled to `$$`:
   `DOCS_BASIC_AUTH=docs:$$2y$$05$$....`
3. Optional overrides: `DOCS_DOMAIN` (default `docs.soccer-manager.etrox.de`,
   also sets Quartz `baseUrl` so sitemap/RSS/OG URLs are correct),
   `SHOWCASE_DOMAIN` (default `showcase.soccer-manager.etrox.de`),
   `QUARTZ_REF` (Quartz version pin).

Each site needs a DNS A record (`DOCS_DOMAIN`, `SHOWCASE_DOMAIN`) pointing at
the Traefik host so Let's Encrypt can issue certs.

To intentionally make a site public, remove its `...-auth` middleware labels
from `docker-compose.docs.yml`.

`DOCS_DOMAIN` drives both the Traefik host rule and Quartz's `baseUrl` (patched
into `quartz.config.ts` at build time), so a single value keeps routing and
generated absolute URLs in sync. Locally, `DOCS_DOMAIN=... pnpm docs:preview`
applies the same patch.

[Quartz v4]: https://github.com/jackyzha0/quartz
