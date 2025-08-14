# Build stage
FROM node:22.17.0-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci || npm install

# Copy source code and env
COPY . .
COPY .env.production .env.production

# Set environment for build
ENV NODE_ENV=production

# Build the Next.js app
RUN npm run build

# Production stage
FROM node:22.17.0-alpine

WORKDIR /app

# Disable telemetry
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy built assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose port and start app
EXPOSE 3000
CMD ["npm", "start"]
