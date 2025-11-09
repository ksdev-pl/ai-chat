# ---- Stage 1: The Builder ----
FROM node:24-alpine AS builder

# Enable pnpm via Corepack
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy only lockfile + manifest first to maximize layer cache
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

# Copy the rest of the source
COPY . .

# Build production assets
RUN pnpm run build

# ---- Stage 2: The Final Image (Caddy) ----
FROM caddy:2-alpine

# Copy built assets to Caddy's default web root
COPY --from=builder /app/dist /usr/share/caddy

# Caddy configuration
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 5173
