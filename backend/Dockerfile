# Flora Alchemy — Backend Dockerfile
# Multi-stage build for production

# ── Build stage ──────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# ── Production stage ─────────────────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

# Security: run as non-root
RUN addgroup -g 1001 -S flora && adduser -S flora -u 1001 -G flora

# Copy dependencies and source
COPY --from=builder --chown=flora:flora /app .

USER flora

EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:4000/api/health || exit 1

CMD ["node", "server.js"]
