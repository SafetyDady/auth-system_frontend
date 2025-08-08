# Railway Frontend Deployment - Optimized for Railway platform
FROM node:20-alpine

WORKDIR /app

# Copy package files for better Docker layer caching
COPY package*.json ./

# Install dependencies with legacy peer deps for compatibility
RUN npm ci --legacy-peer-deps --only=production --silent

# Copy source code
COPY . .

# Build the application for production
RUN npm run build

# Install serve globally for static file serving
RUN npm install -g serve@14

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S frontend -u 1001

# Change ownership of app directory
RUN chown -R frontend:nodejs /app
USER frontend

# Expose Railway's PORT (Railway auto-assigns)
EXPOSE $PORT

# Health check for Railway monitoring
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/ || exit 1

# Start the application using serve
CMD ["sh", "-c", "serve -s dist -p $PORT"]
