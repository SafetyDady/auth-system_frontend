# Railway Proxy + Static Files Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (all of them for building)
RUN npm install --legacy-peer-deps

# Copy all source files
COPY . .

# Build the application
RUN npm run build

# Copy server.js to dist directory for proxy
RUN cp server.js dist/

# Install only production dependencies for runtime
RUN npm ci --only=production --legacy-peer-deps && npm cache clean --force

# Expose port
EXPOSE 3000

# Start the proxy server instead of serve
CMD ["npm", "start"]
