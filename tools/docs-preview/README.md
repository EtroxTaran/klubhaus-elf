# docs-preview

Browser preview of the Obsidian vault (`docs/`) using [Quartz v5].

```bash
pnpm docs:preview
```

Then open <http://localhost:8080>. The vault homepage (`docs/00-Index/Home.md`)
is the landing page; wikilinks, frontmatter and the graph view work as in
Obsidian.

## How it works

`preview.mjs`:

1. Clones Quartz v5 into `.quartz/` (gitignored) on first run.
2. Installs Quartz's own dependencies **inside that checkout only** — Quartz
   uses npm internally. This is a vendored tool, isolated from the pnpm
   workspace, so the repo's pnpm-only rule is not violated.
3. Mirrors `docs/` into `.quartz/content/` (excluding `.obsidian/`), and also
   mirrors the repo-root onboarding docs (`README.md`, `CONTRIBUTING.md`,
   `AGENTS.md`, `CLAUDE.md`) into `00-Index/` so the wiki is self-contained.
4. Copies `00-Index/Home.md` to `content/index.md` as the landing page, and
   resolves the `UI-Showcase` link to `SHOWCASE_DOMAIN`.
5. Creates `quartz.config.yaml` from Quartz's default and applies deploy tweaks
   via `configure-quartz.mjs`: `baseUrl`, keep `90-Meta/templates` (drop it from
   the default `ignorePatterns`), and `parseTags: false` on
   obsidian-flavored-markdown — a v5.0.0 tag-parser workaround (we use
   frontmatter `tags:`, not inline `#tags`).
6. Restores the community plugins (`npx quartz plugin restore`) and runs
   `npx quartz build --serve`.

## Notes

- Refresh the Quartz checkout: delete `tools/docs-preview/.quartz/` and re-run.
- Pin a reproducible Quartz version: `QUARTZ_REF=<tag> pnpm docs:preview`
  (defaults to the pinned `v5.0.0` release; the rolling `v5` branch drifts).
- Nothing here is tracked by Git — see the root `.gitignore`.

## Deploying (one stack, two internal sites)

`../../docker-compose.docs.yml` is a single Dokploy stack, independent of the
game app and SurrealDB, that serves **two** auth-gated sites:

| Service | Source | URL | What |
|---|---|---|---|
| `docs` | `tools/docs-preview/Dockerfile` (Quartz → nginx) | `DOCS_DOMAIN` | Obsidian vault |
| `showcase` | `tools/storybook/Dockerfile` (Storybook → nginx) | `SHOWCASE_DOMAIN` | UI design-system showcase |

### Keeping the deployed sites current (important)

Both sites are **static builds baked into their images** — they do **not**
update when a PR merges to `main`. Until rebuilt, the deployed showcase keeps
showing an old story set (e.g. missing `Composites/Pitch2D`).

Automated: `.github/workflows/redeploy-showcase.yml` pings Dokploy deploy
webhooks on every push to `main`. Wire it once:

1. Dokploy → `showcase` service → **Deployments → Webhook**, copy the URL.
2. GitHub → repo **Settings → Secrets → Actions** → add
   `DOKPLOY_SHOWCASE_WEBHOOK` (and `DOKPLOY_DOCS_WEBHOOK` for the vault).
3. Done — every merge to `main` now auto-rebuilds the sites. Unset secrets
   are skipped, so the workflow is harmless until configured.

Manual one-off (until the secrets are set): hit the same webhook, or click
**Deploy** on the `showcase` service in Dokploy.

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
into `quartz.config.yaml` at build time), so a single value keeps routing and
generated absolute URLs in sync. Locally, `DOCS_DOMAIN=... pnpm docs:preview`
applies the same patch.

[Quartz v5]: https://github.com/jackyzha0/quartz
