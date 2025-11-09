# ---- Stage 1: The Builder ----
# Use a Node.js image to build the project
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the source code
COPY . .

# Run the production build
RUN npm run build

# ---- Stage 2: The Final Image (Using Caddy) ----
# Use a lightweight Caddy image
FROM caddy:2-alpine

# Copy the built assets from the 'builder' stage to Caddy's default web root
COPY --from=builder /app/dist /usr/share/caddy

# Copy the Caddy configuration file
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 5173
