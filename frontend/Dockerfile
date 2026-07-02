# ── PropAI Frontend ───────────────────────────────────────────────────────────
# Vite + React 18 · Node 20 Alpine · Nginx 1.25
# (Replaced react-scripts with Vite to fix ajv/Node 20 incompatibility)
#
# API_URL is now a RUNTIME env var, not a build-time ARG. The previous
# VITE_API_URL build arg baked the API URL into the compiled JS bundle at
# `docker build` time, meaning the same image could never be deployed to
# two different environments without a separate rebuild for each. Now,
# docker-entrypoint.sh generates env.js from env.template.js at container
# startup using the real API_URL env var -- one built image works in any
# environment (local docker-compose, staging, production Kubernetes), just
# by setting a different API_URL env var per deployment.
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:1.25-alpine AS runtime
RUN rm -rf /usr/share/nginx/html/*
# Vite outputs to dist/ (not build/)
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY env.template.js /usr/share/nginx/html/env.template.js
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://127.0.0.1/ || exit 1
ENTRYPOINT ["/docker-entrypoint.sh"]
