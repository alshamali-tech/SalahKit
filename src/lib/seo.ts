/**
 * SEO helpers (S3: lib/seo.ts, S10).
 * Titles, meta descriptions and JSON-LD builders. Pure TypeScript.
 */
import type { ModuleId } from '../types';

/** Product name used everywhere (S9 legal: own name only in UI/code). */
export const APP_NAME = 'SalahKit';

/** Canonical base URL; override with VITE_APP_URL at build time. */
export function getAppBaseUrl(): string {
  const env = (import.meta as { env?: Record<string, string | undefined> }).env;
  return env?.VITE_APP_URL ?? 'https://salahkit.app';
}

/** App version; override with VITE_APP_VERSION at build time. */
export function getAppVersion(): string {
  const env = (import.meta as { env?: Record<string, string | undefined> }).env;
  return env?.VITE_APP_VERSION ?? '1.0.0';
}

/** Per-module page titles (S10 pattern). */
export const MODULE_TITLES: Readonly<Record<ModuleId, string>> = {
  prayer: 'Free Prayer Times',
  qibla: 'Qibla Direction',
  hijri: 'Hijri Calendar Converter',
  quran: 'Quran Reader',
  dhikr: 'Dhikr & Tasbih Counter',
  zakat: 'Zakat Calculator',
  duas: 'Daily Duas & Adhkar',
  names: '99 Names of Allah',
  tracker: 'Prayer Tracker',
  calendar: 'Hijri Calendar',
  hifz: 'Hifz Trainer',
  hadith: 'Hadith Library',
  privacy: 'Privacy Policy',
  terms: 'Terms of Service',
};

/**
 * Builds the document title for a module or the landing page (S10).
 * @param module - Optional module id.
 * @returns Title string like "Zakat Calculator | SalahKit – Free Offline Islamic Tools".
 */
export function buildPageTitle(module?: ModuleId): string {
  if (!module) return `${APP_NAME} – Free Offline Islamic Tools`;
  return `${MODULE_TITLES[module]} | ${APP_NAME} – Free Offline Islamic Tools`;
}

/**
 * Builds a meta description (S10 keywords, competitor phrase allowed
 * ONLY in meta per S9 legal rules).
 * @param module - Optional module id.
 * @returns Meta description string.
 */
export function buildMetaDescription(module?: ModuleId): string {
  const base =
    'Free, offline-first Islamic tools: prayer times, Qibla, Hijri calendar, Quran, dhikr counter and Zakat calculator. No ads, no sign-up, no tracking - a privacy-first alternative to Muslim Pro.';
  if (!module) return base;
  return `${MODULE_TITLES[module]}: free, offline, no ads, no sign-up. Part of ${APP_NAME}, the privacy-first alternative to Muslim Pro.`;
}

/**
 * JSON-LD SoftwareApplication entity (S10): price 0, OS Web.
 * @returns Serializible JSON-LD object.
 */
export function softwareApplicationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: APP_NAME,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web',
    url: getAppBaseUrl(),
    version: getAppVersion(),
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: buildMetaDescription(),
  };
}

/** All indexable paths, used by the sitemap generator. */
export const SITEMAP_PATHS: readonly string[] = [
  '/',
  '/tools',
  '/tools/prayer',
  '/tools/qibla',
  '/tools/hijri',
  '/tools/quran',
  '/tools/dhikr',
  '/tools/zakat',
  '/tools/duas',
  '/tools/names',
  '/tools/tracker',
  '/tools/calendar',
  '/tools/hifz',
  '/tools/hadith',
  '/privacy',
  '/terms',
];
