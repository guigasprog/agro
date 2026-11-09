#!/bin/sh
set -e

if [ -n "$API_URL" ]; then
  cat <<EOF > /usr/share/nginx/html/env.js
(function (window) {
  window.__env = window.__env || {};
  window.__env.apiUrl = '${API_URL}';
})(this);
EOF
fi

