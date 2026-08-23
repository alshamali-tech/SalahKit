# SalahKit developer setup - Windows PowerShell.
# Installs dependencies and activates git hooks.
$ErrorActionPreference = 'Stop'

Write-Host 'SalahKit setup: checking Node.js...'
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Error 'Node.js 20+ is required. Install it from https://nodejs.org'
  exit 1
}
Write-Host ("SalahKit setup: Node " + (node --version) + ", npm " + (npm --version))

Write-Host 'SalahKit setup: installing dependencies...'
npm ci

Write-Host 'SalahKit setup: activating git hooks...'
if (Test-Path '.git') {
  try { npx --no-install husky install } catch {
    Write-Host "SalahKit setup: husky not installed; hooks will activate after 'npm i -D husky'."
  }
} else {
  Write-Host 'SalahKit setup: not a git repository; skipping hooks.'
}

if ((Test-Path '.env.example') -and -not (Test-Path '.env.local')) {
  Copy-Item '.env.example' '.env.local'
  Write-Host 'SalahKit setup: created .env.local from template.'
}

Write-Host "SalahKit setup: done. Start with 'npm run dev'."
