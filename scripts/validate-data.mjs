#!/usr/bin/env node
/**
 * Data & PWA asset validator (Blueprint S3, run in CI).
 * The SalahKit datasets ship as typed TS modules (src/lib/core/*-data.ts),
 * so this script validates the *public* contract instead: every asset
 * the PWA manifest, service worker, sitemap, robots file and index.html
 * reference must exist and be well-formed. Fails CI on any violation.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pub = (p) => resolve(root, 'public', p);
let failures = 0;

/** Records a pass/fail line. */
function check(label, ok, detail = '') {
  const mark = ok ? 'PASS' : 'FAIL';
  process.stdout.write(`  [${mark}] ${label}${detail ? ` — ${detail}` : ''}\n`);
  if (!ok) failures += 1;
}

process.stdout.write('validate-data: public PWA assets\n');

// 1. index.html contract.
const indexHtml = readFileSync(resolve(root, 'index.html'), 'utf8');
check('index.html has #root mount', indexHtml.includes('id="root"'));
check('index.html links the manifest', indexHtml.includes('/manifest.json'));
check('index.html links the favicon', indexHtml.includes('/favicon.svg'));
check('index.html declares a theme-color', indexHtml.includes('theme-color'));

// 2. PWA manifest shape.
const manifestPath = pub('manifest.json');
check('manifest.json exists', existsSync(manifestPath));
if (existsSync(manifestPath)) {
  let manifest = null;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    check('manifest.json parses as JSON', true);
  } catch {
    check('manifest.json parses as JSON', false);
  }
  if (manifest) {
    check('manifest has name', typeof manifest.name === 'string' && manifest.name.length > 0);
    check('manifest has start_url', manifest.start_url === '/');
    check('manifest display is standalone', manifest.display === 'standalone');
    check('manifest has at least one icon', Array.isArray(manifest.icons) && manifest.icons.length > 0);
    for (const icon of manifest.icons ?? []) {
      const src = String(icon.src ?? '').replace(/^\//, '');
      check(`icon exists: ${icon.src}`, existsSync(pub(src)));
    }
  }
}

// 3. Service worker + offline fallback.
const swPath = pub('sw.js');
check('sw.js exists', existsSync(swPath));
if (existsSync(swPath)) {
  const sw = readFileSync(swPath, 'utf8');
  check('sw.js versions its cache', /CACHE_VERSION\s*=\s*['"]salahkit-v\d+['"]/.test(sw));
  check('sw.js precaches the offline page', sw.includes('/offline.html'));
  check('sw.js handles fetch events', sw.includes("addEventListener('fetch'"));
}
check('offline.html exists', existsSync(pub('offline.html')));
check('favicon.svg exists', existsSync(pub('favicon.svg')));
check('og image exists', existsSync(pub('og-image.svg')));

// 4. SEO files.
const sitemap = pub('sitemap.xml');
check('sitemap.xml exists', existsSync(sitemap));
if (existsSync(sitemap)) {
  const xml = readFileSync(sitemap, 'utf8');
  check('sitemap is a urlset', xml.includes('<urlset') && xml.includes('</urlset>'));
  const locs = xml.match(/<loc>/g) ?? [];
  const closes = xml.match(/<\/loc>/g) ?? [];
  check('sitemap loc tags balanced', locs.length === closes.length, `${locs.length} urls`);
  check('sitemap has 10+ urls', locs.length >= 10);
}
const robots = pub('robots.txt');
check('robots.txt exists', existsSync(robots));
if (existsSync(robots)) {
  const txt = readFileSync(robots, 'utf8');
  check('robots allows all', txt.includes('User-agent: *') && txt.includes('Allow: /'));
  check('robots points at sitemap', txt.includes('Sitemap:'));
}

process.stdout.write(failures === 0 ? 'validate-data: all checks passed\n' : `validate-data: ${failures} check(s) FAILED\n`);
process.exit(failures === 0 ? 0 : 1);
