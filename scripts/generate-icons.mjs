#!/usr/bin/env node
/**
 * Icon generator: renders every PNG the site references from the two
 * master SVGs (favicon.svg + og-image.svg). Run after editing either
 * SVG, and commit the PNGs — CI (validate-data.mjs) checks they exist.
 *
 * Usage: node scripts/generate-icons.mjs
 */
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pub = (f) => resolve(root, 'public', f);

const favicon = readFileSync(pub('favicon.svg'));
const og = readFileSync(pub('og-image.svg'));

/** Renders an SVG buffer to a PNG at the given size. */
async function toPng(svg, file, width, height) {
  await sharp(svg, { density: 300 })
    .resize(width, height)
    .png()
    .toFile(pub(file));
  console.log(`icons: wrote public/${file} (${width}×${height})`);
}

// Referenced by index.html + JSON-LD:
await toPng(favicon, 'apple-touch-icon.png', 180, 180); // iOS home screen
await toPng(favicon, 'favicon.png', 512, 512);          // JSON-LD logo
await toPng(og, 'og-image.png', 1200, 630);             // social previews

// PWA manifest icons (installability on Android/Chrome):
await toPng(favicon, 'icon-192.png', 192, 192);
await toPng(favicon, 'icon-512.png', 512, 512);
await toPng(favicon, 'icon-maskable-512.png', 512, 512);

console.log('icons: done.');