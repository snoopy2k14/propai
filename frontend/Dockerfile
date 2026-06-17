# ── PropAI Frontend ───────────────────────────────────────────────────────────
# Vite + React 18 · Node 20 Alpine · Nginx 1.25
# (Replaced react-scripts with Vite to fix ajv/Node 20 incompatibility)
# ─────────────────────────────────────────────────────────────────────────────

FROM node:20-alpine AS builder
WORKDIR /app

ARG VITE_API_URL=http://localhost:8080
ARG VITE_WS_URL=ws://localhost:8085
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL

COPY package.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

FROM nginx:1.25-alpine AS runtime
RUN rm -rf /usr/share/nginx/html/*
# Vite outputs to dist/ (not build/)
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
