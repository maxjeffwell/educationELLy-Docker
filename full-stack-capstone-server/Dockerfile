# Build stage
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (with build tools for native modules)
RUN --mount=type=cache,target=/root/.npm \
    apk add --no-cache python3 make g++ && \
    npm ci --omit=dev && \
    apk del python3 make g++

# Development stage
FROM node:20-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (BuildKit cache speeds up repeated builds)
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy application code
COPY . .

# Expose port
EXPOSE 8080

# Start development server with nodemon
CMD ["npm", "run", "dev"]

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files and install production dependencies (BuildKit cache speeds up repeated builds)
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    apk add --no-cache python3 make g++ && \
    npm ci --omit=dev && \
    apk del python3 make g++

# Copy application code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8080/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Start production server
CMD ["npm", "start"]
