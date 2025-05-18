# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Set environment variables
ENV API_GW_SERVER_PORT=3000
ENV AUTH_SERVICE_URL=""

# Expose port
EXPOSE ${API_GW_SERVER_PORT}

# Start application
CMD ["node", "dist/main"] 