FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/web/package.json apps/web/package.json
COPY packages/match-engine/package.json packages/match-engine/package.json
COPY packages/game-data/package.json packages/game-data/package.json
COPY packages/db-schema/package.json packages/db-schema/package.json
COPY packages/ui/package.json packages/ui/package.json
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
RUN pnpm build

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app .
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/healthz || exit 1
CMD ["pnpm", "--filter", "@soccer-manager/web", "start"]
