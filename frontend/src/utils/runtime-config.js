// Runtime configuration, populated by /env.js (generated at container
// startup by docker-entrypoint.sh from real environment variables -- see
// frontend/Dockerfile and frontend/env.template.js).
//
// This replaces the previous build-time import.meta.env.VITE_API_URL
// approach: that baked the API URL into the compiled JS bundle at
// `docker build` time, meaning the same image could never be deployed to
// two different environments (e.g. staging vs production) without a
// separate rebuild for each. Reading from window.__ENV__ at runtime means
// one built image works everywhere -- the API URL is injected at
// container startup, not compile time.
//
// Falls back to import.meta.env.VITE_API_URL (then a hardcoded localhost
// default) for local `npm run dev` usage, where there's no nginx/entrypoint
// step to generate window.__ENV__ at all.
export const API_BASE_URL =
  window.__ENV__?.API_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:8080'
