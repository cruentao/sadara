# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first to leverage Docker layer caching
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy source and compile TypeScript
COPY . .
RUN npx prisma generate
RUN npm run build

# ─── Stage 2: Production ──────────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps

# Copy compiled output and Prisma artifacts from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# Run pending migrations then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
