/**
 * Quran surah search (lib/core/quran/search.ts).
 * Transliteration- and Arabic-tolerant matching over surah metadata.
 * Pure and deterministic.
 */
import { ALL_SURAHS } from '../quran-meta';
import type { SurahInfo } from '../quran-meta';

/** A scored search hit. */
export interface SurahHit {
  surah: SurahInfo;
  /** Higher is better. */
  score: number;
  /** Which field matched, for highlighting. */
  matched: 'num' | 'name' | 'meaning' | 'arabic';
}

/**
 * Normalizes text for tolerant matching: lowercases, strips Arabic
 * diacritics and tatweel, and folds common letter variants.
 * @param text - Raw input.
 * @returns Normalized string.
 */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u064b-\u065f\u0670\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^\p{L}\p{N} ]/gu, '')
    .trim();
}

/**
 * Searches surahs by number, name, meaning or Arabic name.
 * Results are scored: exact number > name prefix > name contains >
 * meaning contains > Arabic contains.
 * @param query - Search text (empty returns all in order).
 * @returns Scored hits, best first.
 */
export function searchQuran(query: string): readonly SurahHit[] {
  const q = normalize(query);
  if (q === '') return ALL_SURAHS.map((surah) => ({ surah, score: 0, matched: 'num' as const }));
  const asNum = Number(query.trim());
  const hits: SurahHit[] = [];
  for (const surah of ALL_SURAHS) {
    if (Number.isInteger(asNum) && surah.num === asNum) {
      hits.push({ surah, score: 100, matched: 'num' });
      continue;
    }
    const name = normalize(surah.name);
    const meaning = normalize(surah.meaning);
    const arabic = normalize(surah.nameArabic);
    if (name.startsWith(q)) hits.push({ surah, score: 80, matched: 'name' });
    else if (name.includes(q)) hits.push({ surah, score: 60, matched: 'name' });
    else if (meaning.includes(q)) hits.push({ surah, score: 40, matched: 'meaning' });
    else if (arabic.includes(q)) hits.push({ surah, score: 30, matched: 'arabic' });
  }
  return hits.sort((a, b) => b.score - a.score || a.surah.num - b.surah.num);
}
