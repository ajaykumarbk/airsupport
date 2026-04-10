# Stage 1: Build React/Vite app
FROM node:18-alpine AS builder
WORKDIR /app

# Pass the production URL during build time
ARG VITE_API_BASE=https://admin-collab-tool.datanetwork.online/api
ENV VITE_API_BASE=$VITE_API_BASE

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Custom Nginx config to handle React Router (Single Page App)
COPY --from=builder /app/dist /usr/share/nginx/html
# Optional: Copy a custom nginx.conf if you need specific routing
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]