#!/bin/sh
set -e

sed -i "s|__BACKEND_URL__|${BACKEND_URL}|g" /usr/share/nginx/html/config.js
sed -i "s|__GOOGLE_CLIENT_ID__|${GOOGLE_CLIENT_ID}|g" /usr/share/nginx/html/config.js
sed -i "s|__MAPBOX_ACCESS_TOKEN__|${MAPBOX_ACCESS_TOKEN}|g" /usr/share/nginx/html/config.js

exec "$@"