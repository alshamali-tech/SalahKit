#!/usr/bin/env bash
# SalahKit bundle budget gate (S13): initial JS under 200KB gzipped.
# Measures the compressed transfer size (what the user downloads) of
# the entry chunk only; lazy tool chunks are exempt by design.
set -euo pipefail

DIST_DIR="dist/assets"
LIMIT_KB=200

if [ ! -d "$DIST_DIR" ]; then
  echo "check-bundle: $DIST_DIR not found. Run 'npm run build' first."
  exit 1
fi

# The entry chunk is the one referenced by dist/index.html.
ENTRY=$(grep -o 'assets/index-[^"]*\.js' dist/index.html | head -n 1 || true)
if [ -z "$ENTRY" ] || [ ! -f "dist/$ENTRY" ]; then
  echo "check-bundle: could not locate the entry chunk in dist/index.html."
  exit 1
fi

for file in "$DIST_DIR"/*.js; do
  [ -f "$file" ] || continue
  raw=$(wc -c < "$file" | tr -d '[:space:]')
  gz=$(gzip -c "$file" | wc -c | tr -d '[:space:]')
  echo "check-bundle: $(basename "$file") = $((raw / 1024))KB raw, $((gz / 1024))KB gzip"
done

ENTRY_GZ=$(gzip -c "dist/$ENTRY" | wc -c | tr -d '[:space:]')
ENTRY_KB=$((ENTRY_GZ / 1024))
echo "check-bundle: initial JS ($ENTRY) = ${ENTRY_KB}KB gzipped (limit ${LIMIT_KB}KB)"

if [ "$ENTRY_KB" -gt "$LIMIT_KB" ]; then
  echo "check-bundle: OVER BUDGET. Reduce the initial bundle."
  exit 1
fi

echo "check-bundle: OK, initial bundle within budget."
