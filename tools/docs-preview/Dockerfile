# Standalone deployable docs site: builds the Obsidian vault (docs/) into a
# static Quartz v4 site and serves it with nginx. Independent of the game app
# and SurrealDB. Build context is the repo root.

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

# Mirror the vault into Quartz's content dir, drop Obsidian's private state,
# surface the vault entry point (00-Index/Home.md) as the landing page, point
# Quartz's baseUrl at the real domain, and shrink Quartz's default
# ignorePatterns (["private","templates",".obsidian"]) so the vault's
# 90-Meta/templates notes are NOT silently dropped — .obsidian is already
# removed above, "private" is kept as a deliberate opt-out escape hatch.
COPY docs/ ./content/
# Repo-root onboarding docs live outside the vault — mirror them in so the
# deployed wiki is self-contained (see 00-Index/Repository.md).
COPY README.md ./content/00-Index/Repository-README.md
COPY CONTRIBUTING.md ./content/00-Index/Contributing.md
COPY AGENTS.md ./content/00-Index/Agent-Guide.md
COPY CLAUDE.md ./content/00-Index/Claude-Guide.md
RUN rm -rf content/.obsidian \
  && cp content/00-Index/Home.md content/index.md \
  && sed -i -E "s|baseUrl: \"[^\"]*\"|baseUrl: \"${DOCS_DOMAIN}\"|; s|baseUrl: '[^']*'|baseUrl: \"${DOCS_DOMAIN}\"|" quartz.config.ts \
  && sed -i -E "s|ignorePatterns: \[[^]]*\]|ignorePatterns: [\"private\"]|" quartz.config.ts \
  && sed -i "s|SHOWCASE_DOMAIN_PLACEHOLDER|${SHOWCASE_DOMAIN}|g" content/00-Index/UI-Showcase.md \
  && npx quartz build

FROM nginx:alpine AS runtime
COPY tools/docs-preview/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /build/public /usr/share/nginx/html
EXPOSE 80
