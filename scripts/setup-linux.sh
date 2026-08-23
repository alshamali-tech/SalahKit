#!/usr/bin/env bash
# SalahKit developer setup - Linux / macOS.
# Installs dependencies and activates git hooks.
set -euo pipefail

echo "SalahKit setup: checking Node.js..."
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js 20+ is required. Install it from https://nodejs.org"
  exit 1
fi
echo "SalahKit setup: Node $(node --version), npm $(npm --version)"

echo "SalahKit setup: installing dependencies..."
npm ci

echo "SalahKit setup: activating git hooks..."
if [ -d ".git" ]; then
  npx --no-install husky install 2>/dev/null || echo "SalahKit setup: husky not installed; hooks will activate after 'npm i -D husky'."
  chmod +x .husky/pre-commit .husky/pre-push 2>/dev/null || true
else
  echo "SalahKit setup: not a git repository; skipping hooks."
fi

if [ ! -f ".env.local" ] && [ -f ".env.example" ]; then
  cp .env.example .env.local
  echo "SalahKit setup: created .env.local from template."
fi

echo "SalahKit setup: done. Start with 'npm run dev'."
