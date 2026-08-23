#!/usr/bin/env bash
# SalahKit bundle budget gate (S13): initial JS must stay under 200KB.
# Runs after `npm run build` and exits non-zero when over budget.
set -euo pipefail

DIST_DIR="dist/assets"
LIMIT_KB=200

if [ ! -d "$DIST_DIR" ]; then
  echo "check-bundle: $DIST_DIR not found. Run 'npm run build' first."
  exit 1
fi

TOTAL_BYTES=0
for file in "$DIST_DIR"/*.js; do
  [ -f "$file" ] || continue
  size=$(wc -c < "$file" | tr -d '[:space:]')
  TOTAL_BYTES=$((TOTAL_BYTES + size))
  echo "check-bundle: $(basename "$file") = $((size / 1024))KB"
done

TOTAL_KB=$((TOTAL_BYTES / 1024))
echo "check-bundle: total initial JS = ${TOTAL_KB}KB (limit ${LIMIT_KB}KB)"

if [ "$TOTAL_KB" -gt "$LIMIT_KB" ]; then
  echo "check-bundle: OVER BUDGET. Reduce the initial bundle."
  exit 1
fi

echo "check-bundle: OK, within budget."
