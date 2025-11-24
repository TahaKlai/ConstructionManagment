# Multi-stage build for Angular frontend
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY ConstructionManagmentFront/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY ConstructionManagmentFront/ .

# Build for production
RUN npm run build -- --configuration production

# Stage 2: Serve with nginx
FROM nginx:stable-alpine

# Remove default nginx config
RUN rm -rf /etc/nginx/conf.d/*

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular app
COPY --from=builder /app/dist/ConstructionManagmentFront /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/index.html || exit 1

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
