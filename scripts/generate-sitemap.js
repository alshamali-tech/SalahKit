#!/usr/bin/env node
/**
 * SalahKit sitemap generator (S3/S10).
 * Writes public/sitemap.xml from the canonical path list. Also used by
 * the deploy workflow to refresh the shipped sitemap before upload.
 */
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE_URL = process.env.VITE_APP_URL || 'https://salahkit.app';

/** All indexable routes (mirrors SITEMAP_PATHS in src/lib/seo.ts). */
const PATHS = [
  '/', '/tools',
  '/tools/prayer', '/tools/qibla', '/tools/hijri', '/tools/quran',
  '/tools/dhikr', '/tools/zakat', '/tools/duas', '/tools/names',
  '/tools/tracker', '/tools/calendar',
  '/privacy', '/terms',
];

/** Priorities: landing highest, tools next, legal pages lowest. */
function priorityOf(path) {
  if (path === '/') return '1.0';
  if (path === '/tools') return '0.9';
  if (path.startsWith('/tools/')) return '0.8';
  return '0.4';
}

/**
 * Builds the sitemap XML string.
 * @param {string} base - Canonical base URL.
 * @param {string} lastmod - ISO date for lastmod tags.
 * @returns {string} Sitemap XML.
 */
function buildSitemap(base, lastmod) {
  const urls = PATHS.map(
    (p) => `  <url>
    <loc>${base}${p}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priorityOf(p)}</priority>
  </url>`
  ).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

const here = dirname(fileURLToPath(import.meta.url));
const target = resolve(here, '..', 'public', 'sitemap.xml');
const xml = buildSitemap(BASE_URL.replace(/\/$/, ''), new Date().toISOString().slice(0, 10));
writeFileSync(target, xml, 'utf8');
process.stdout.write(`sitemap: wrote ${PATHS.length} URLs to ${target}\n`);
