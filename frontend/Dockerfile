FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
RUN apk add --no-cache dumb-init
COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx-default.conf /etc/nginx/conf.d/default.conf
RUN addgroup -g 101 -S nginx && adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -c "nginx user" -G nginx nginx || true
COPY --from=builder /app/dist /usr/share/nginx/html
RUN mkdir -p /var/cache/nginx /var/run/nginx && \
  chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/run/nginx /etc/nginx
USER nginx
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1
ENTRYPOINT ["/sbin/dumb-init", "--"]
CMD ["nginx", "-g", "daemon off;"]
