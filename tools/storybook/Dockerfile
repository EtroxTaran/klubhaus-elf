# Standalone deployable UI showcase: builds the app's Storybook into a static
# bundle and serves it with nginx. Independent of the game app runtime and
# SurrealDB. Build context is the repo root (the pnpm workspace is required to
# resolve @soccer-manager/web and its design-system source).

FROM node:22 AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

COPY . .
# Frozen install across the workspace, then build only the web Storybook.
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @soccer-manager/web build-storybook

FROM nginx:alpine AS runtime
COPY tools/storybook/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/storybook-static /usr/share/nginx/html
EXPOSE 80
