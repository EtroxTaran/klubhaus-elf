# Standalone deployable docs site: builds the Obsidian vault (docs/) into a
# static Quartz v4 site and serves it with nginx. Independent of the game app
# and SurrealDB. Build context is the repo root.
#
# NOTE: this copies the whole build context once (`COPY . /ctx`) instead of
# selective `COPY docs/ …` / `COPY README.md …`. Selective COPY makes BuildKit
# compute restrictive include-patterns; intersecting those with the `**/…`
# excludes in .dockerignore triggers a BuildKit/fsutil bug ("error from
# sender: failed to match includepatterns: syntax error in pattern") that
# aborts the whole compose build. The showcase image already uses the
# whole-context path and builds fine with the same .dockerignore, so docs
# does the same and assembles what it needs with `cp`.

# Debian-based node (not alpine): Quartz's CLI uses a `#!/usr/bin/env -S node`
# shebang, and BusyBox `env` on alpine does not support `-S`. The Debian image
# has GNU coreutils env and ships git, so no extra package install is needed.
FROM node:22 AS build
WORKDIR /build

ARG QUARTZ_REF=v4
ARG DOCS_DOMAIN=docs.soccer-manager.etrox.de
ARG SHOWCASE_DOMAIN=showcase.soccer-manager.etrox.de
RUN git clone --depth 1 --branch "${QUARTZ_REF}" https://github.com/jackyzha0/quartz.git .
# Quartz uses npm internally; isolated to this image, never the pnpm workspace.
RUN npm install

# Whole repo context (proven-safe path; see header note).
COPY . /ctx

# Mirror the vault into Quartz's content dir, drop Obsidian's private state,
# surface the vault entry point (00-Index/Home.md) as the landing page, mirror
# the repo-root onboarding docs in (self-contained wiki), point Quartz's
# baseUrl at the real domain, and shrink Quartz's default ignorePatterns
# (["private","templates",".obsidian"]) so 90-Meta/templates is not dropped.
RUN cp -r /ctx/docs/. ./content/ \
  # Onboarding docs are "nice to have" — a missing/odd one must never fail the
  # deploy (CLAUDE.md was historically a dangling symlink on Linux).
  && for m in "README.md:Repository-README.md" "CONTRIBUTING.md:Contributing.md" "AGENTS.md:Agent-Guide.md" "CLAUDE.md:Claude-Guide.md"; do \
       src="/ctx/${m%%:*}"; dst="./content/00-Index/${m##*:}"; \
       [ -f "$src" ] && cp "$src" "$dst" || echo "skip missing $src"; \
     done \
  && cp /ctx/tools/docs-preview/nginx.conf /build/nginx.conf \
  && cp /ctx/tools/docs-preview/sanitize-frontmatter.mjs /build/sanitize-frontmatter.mjs \
  # Default Quartz styling: custom.scss is intentionally empty (FMX-11), copied
  # over Quartz's own empty custom.scss. NEVER add `@import url(...)` (breaks build).
  && cp /ctx/tools/docs-preview/custom.scss /build/quartz/styles/custom.scss \
  && rm -rf content/.obsidian /ctx \
  && cp content/00-Index/Home.md content/index.md \
  && sed -i -E "s|baseUrl: \"[^\"]*\"|baseUrl: \"${DOCS_DOMAIN}\"|; s|baseUrl: '[^']*'|baseUrl: \"${DOCS_DOMAIN}\"|" quartz.config.ts \
  && sed -i -E "s|ignorePatterns: \[[^]]*\]|ignorePatterns: [\"private\"]|" quartz.config.ts \
  && sed -i "s|SHOWCASE_DOMAIN_PLACEHOLDER|${SHOWCASE_DOMAIN}|g" content/00-Index/UI-Showcase.md \
  # Obsidian writes invalid-YAML wikilink frontmatter (`related: [[A]], [[B]]`)
  # across ~165 notes; Quartz's strict parser aborts on the first one.
  # Normalise it to valid YAML before building.
  && node /build/sanitize-frontmatter.mjs content \
  && npx quartz build

FROM nginx:alpine AS runtime
COPY --from=build /build/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /build/public /usr/share/nginx/html
EXPOSE 80
