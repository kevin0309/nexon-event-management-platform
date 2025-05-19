FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy source files
COPY src ./src

ENV MOCK_SERVER_PORT=3000

# Expose port
EXPOSE ${MOCK_SERVER_PORT}

# Start application
CMD ["node", "src/index.js"] 