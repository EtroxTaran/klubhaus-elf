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
RUN git clone --depth 1 --branch "${QUARTZ_REF}" https://github.com/jackyzha0/quartz.git .
# Quartz uses npm internally; isolated to this image, never the pnpm workspace.
RUN npm install

# Mirror the vault into Quartz's content dir, drop Obsidian's private state,
# surface the vault entry point (00-Index/Home.md) as the landing page, and
# point Quartz's baseUrl at the real domain so sitemap/RSS/OG URLs are correct.
COPY docs/ ./content/
RUN rm -rf content/.obsidian \
  && cp content/00-Index/Home.md content/index.md \
  && sed -i -E "s|baseUrl: \"[^\"]*\"|baseUrl: \"${DOCS_DOMAIN}\"|; s|baseUrl: '[^']*'|baseUrl: \"${DOCS_DOMAIN}\"|" quartz.config.ts \
  && npx quartz build

FROM nginx:alpine AS runtime
COPY --from=build /build/public /usr/share/nginx/html
EXPOSE 80
