# ── Build stage (install all deps) ─────────────────────────────────────────────
FROM node:22-alpine AS build

RUN corepack enable && corepack prepare pnpm@10.6.5 --activate

WORKDIR /app

# Copy workspace root files
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json turbo.json ./

# Copy all package.json files needed for install
COPY apps/server/package.json apps/server/
COPY packages/domain/package.json packages/domain/
COPY packages/config/package.json packages/config/

# Install all dependencies (need tsx + tsc for build)
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy source code
COPY packages/domain/ packages/domain/
COPY packages/config/ packages/config/
COPY apps/server/ apps/server/

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@10.6.5 --activate

WORKDIR /app

# Copy everything from build stage (deps + source)
COPY --from=build /app ./

EXPOSE 3000

WORKDIR /app/apps/server

# Use tsx to handle TypeScript workspace imports at runtime
CMD ["sh", "-c", "npx tsx src/migrate.ts && npx tsx src/index.ts"]
