#!/bin/sh
set -e

# Default to the same localhost value the old build-time ARG used, so
# behavior is unchanged if API_URL isn't set (e.g. someone runs this image
# directly without configuring it -- fails safe to local-dev-like behavior
# rather than breaking outright).
: "${API_URL:=http://localhost:8080}"

sed "s|__API_URL__|${API_URL}|g" /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env.js

exec nginx -g 'daemon off;'
