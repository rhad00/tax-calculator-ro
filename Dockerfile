# Multi-stage build: Vite frontend served by nginx

# Stage 1: Build frontend with Vite
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source
COPY client ./client
COPY components.json tsconfig.json tsconfig.node.json vite.config.ts ./

# Build Vite frontend
RUN pnpm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy built frontend to nginx
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# Copy nginx config for SPA routing
RUN echo 'server { listen 3000; location / { root /usr/share/nginx/html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
