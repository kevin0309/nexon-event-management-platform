# Build stage
FROM node:18-alpine as builder

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

# Environment variables
ENV AUTH_SERVER_PORT=3000
ENV MONGODB_URI=""
ENV JWT_SECRET=""
ENV JWT_EXPIRATION=""
ENV REFRESH_TOKEN_EXPIRATION=""

# Expose port
EXPOSE $AUTH_SERVER_PORT

# Start application
CMD ["npm", "run", "start:prod"] 