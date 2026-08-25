/**
 * Daily adhkar and duas dataset (S3: duas-data.ts).
 * A complete Hisnul-Muslim-scale collection: 136 authentic duas across
 * 11 life situations. Sources: Quran, Bukhari, Muslim, Abu Dawud,
 * Tirmidhi, Nasa'i, Ibn Majah, Ahmad, Muwatta (public domain).
 * Pure TypeScript — no framework imports.
 */
import type { Dua, DuaCategory } from './types';
import { MORNING_ADHKAR } from './duas/adhkar-morning';
import { EVENING_ADHKAR } from './duas/adhkar-evening';
import { PRAYER_DUAS } from './duas/duas-prayer';
import { QURAN_DUAS } from './duas/duas-quran';
import { PROPHETIC_DUAS } from './duas/duas-prophetic';
import { HOME_DUAS } from './duas/duas-home';
import { DAILY_DUAS } from './duas/duas-daily';
import { TRAVEL_DUAS } from './duas/duas-travel';
import { NATURE_DUAS } from './duas/duas-nature';
import { HARDSHIP_DUAS } from './duas/duas-hardship';
import { SLEEP_DUAS } from './duas/duas-sleep';

/** The complete collection, in canonical category order. */
export const DUAS: readonly Dua[] = [
  ...MORNING_ADHKAR,
  ...EVENING_ADHKAR,
  ...PRAYER_DUAS,
  ...QURAN_DUAS,
  ...PROPHETIC_DUAS,
  ...HOME_DUAS,
  ...DAILY_DUAS,
  ...TRAVEL_DUAS,
  ...NATURE_DUAS,
  ...HARDSHIP_DUAS,
  ...SLEEP_DUAS,
];

/** Display labels for every category plus the combined view. */
export const DUA_CATEGORY_LABELS: Readonly<Record<DuaCategory | 'all', string>> = {
  all: 'All',
  morning: 'Morning',
  evening: 'Evening',
  salah: 'Salah',
  quran: 'Quranic',
  prophetic: 'Prophetic',
  home: 'Home & Masjid',
  daily: 'Food & Daily',
  travel: 'Travel',
  nature: 'Nature',
  hardship: 'Hardship',
  sleep: 'Sleep',
};

/** Category ids in display order. */
export const DUA_CATEGORY_ORDER: readonly DuaCategory[] = [
  'morning',
  'evening',
  'salah',
  'quran',
  'prophetic',
  'home',
  'daily',
  'travel',
  'nature',
  'hardship',
  'sleep',
];

/**
 * Filters duas by category.
 * @param category - Category to filter by, or 'all'.
 * @returns Matching duas in canonical order.
 */
export function getDuas(category: DuaCategory | 'all'): readonly Dua[] {
  if (category === 'all') return DUAS;
  return DUAS.filter((d) => d.category === category);
}

/**
 * Filters any subset of duas by a text query across Arabic,
 * transliteration, translation, source and category label.
 * @param duas - Source list (e.g. one category or favorites).
 * @param query - Search text (case-insensitive).
 * @returns Matching duas; the input list when query is empty.
 */
export function filterDuas(duas: readonly Dua[], query: string): readonly Dua[] {
  const q = query.trim().toLowerCase();
  if (q === '') return duas;
  return duas.filter(
    (d) =>
      d.arabic.includes(q) ||
      d.transliteration.toLowerCase().includes(q) ||
      d.translation.toLowerCase().includes(q) ||
      d.source.toLowerCase().includes(q) ||
      DUA_CATEGORY_LABELS[d.category].toLowerCase().includes(q)
  );
}

/**
 * Searches the full collection (all categories).
 * @param query - Search text.
 * @returns Matching duas; the full set when query is empty.
 */
export function searchDuas(query: string): readonly Dua[] {
  return filterDuas(DUAS, query);
}

/**
 * Number of duas in a category.
 * @param category - Category id or 'all'.
 * @returns Count.
 */
export function countDuas(category: DuaCategory | 'all'): number {
  return category === 'all' ? DUAS.length : DUAS.filter((d) => d.category === category).length;
}
