# ── Build stage ────────────────────────────────────────────────────────────────
FROM node:22-alpine AS build

RUN corepack enable && corepack prepare pnpm@10.6.5 --activate

WORKDIR /app

# Copy workspace root files
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json turbo.json ./

# Copy all package.json files for install
COPY apps/web/package.json apps/web/
COPY packages/domain/package.json packages/domain/
COPY packages/data/package.json packages/data/
COPY packages/copy/package.json packages/copy/
COPY packages/ui/package.json packages/ui/
COPY packages/config/package.json packages/config/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/ packages/
COPY apps/web/ apps/web/

# Set API URL at build time (overridable)
ARG VITE_API_BASE_URL=http://localhost:3000
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build
RUN pnpm --filter @mindflow/domain build 2>/dev/null || true
RUN pnpm --filter @mindflow/data build 2>/dev/null || true
RUN pnpm --filter @mindflow/copy build 2>/dev/null || true
RUN pnpm --filter @mindflow/ui build 2>/dev/null || true
RUN pnpm --filter @mindflow/web build

# ── Serve stage ───────────────────────────────────────────────────────────────
FROM nginx:alpine

COPY --from=build /app/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
