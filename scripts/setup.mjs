#!/usr/bin/env node
/**
 * Developer setup (Blueprint S3: scripts/setup.mjs).
 * Checks the Node version, installs dependencies, seeds .env.local from
 * the template and stamps a build version (package version + git sha).
 */
import { execSync } from 'node:child_process';
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = resolve(root, '.env.local');
const envExample = resolve(root, '.env.example');

// 1. Node version gate (pinned by .nvmrc).
const wanted = readFileSync(resolve(root, '.nvmrc'), 'utf8').trim();
const current = process.versions.node;
const currentMajor = Number(current.split('.')[0]);
const wantedMajor = Number(wanted.replace(/^v/, '').split('.')[0]);
if (currentMajor < wantedMajor) {
  process.stderr.write(`setup: Node ${wanted}+ required (found v${current}). See .nvmrc.\n`);
  process.exit(1);
}
process.stdout.write(`setup: Node v${current} OK (>= ${wanted})\n`);

// 2. Install dependencies.
process.stdout.write('setup: installing dependencies (npm ci)...\n');
try {
  execSync('npm ci', { cwd: root, stdio: 'inherit' });
} catch {
  process.stderr.write('setup: npm ci failed — try removing node_modules and package-lock.json.\n');
  process.exit(1);
}

// 3. Seed the env file.
if (!existsSync(envPath) && existsSync(envExample)) {
  copyFileSync(envExample, envPath);
  process.stdout.write('setup: created .env.local from .env.example\n');
}

// 4. Version stamp: package version + git short sha (falls back to 'dev').
let sha = 'dev';
try {
  sha = execSync('git rev-parse --short HEAD', { cwd: root }).toString().trim();
} catch {
  // Not a git checkout — keep 'dev'.
}
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
const stamp = `${pkg.version ?? '0.0.0'}+${sha}`;
if (existsSync(envPath)) {
  let env = readFileSync(envPath, 'utf8');
  env = env.replace(/^VITE_APP_VERSION=.*$/m, `VITE_APP_VERSION=${stamp}`);
  if (!env.includes('VITE_APP_VERSION=')) env += `\nVITE_APP_VERSION=${stamp}\n`;
  writeFileSync(envPath, env);
}
process.stdout.write(`setup: version stamp ${stamp}\n`);
process.stdout.write("setup: done — start with 'npm run dev'\n");
