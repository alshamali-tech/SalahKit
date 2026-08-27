/**
 * Hadith search & grading (lib/core/hadith/search.ts).
 * Tolerant keyword matching (Arabic diacritic-insensitive) plus a
 * grading filter for streamed narrations. Pure and deterministic.
 */
import type { RemoteHadith } from '../../external/hadith-api';
import { normalize } from '../quran/search';

/** Coarse grade buckets a narration can fall into. */
export type GradeBucket = 'sahih' | 'hasan' | 'daif' | 'unknown';

/**
 * Maps a free-text grade string onto a coarse bucket.
 * @param grade - Raw grade, e.g. "Sahih", "Hasan", "Da'if".
 * @returns The bucket.
 */
export function gradeBucket(grade: string): GradeBucket {
  const g = grade.trim().toLowerCase();
  if (g.includes('sahih') || g.includes('صحيح')) return 'sahih';
  if (g.includes('hasan') || g.includes('حسن')) return 'hasan';
  if (g.includes('da') || g.includes('ضعيف') || g.includes('weak')) return 'daif';
  return 'unknown';
}

/**
 * Filters streamed hadiths to a grade bucket.
 * @param hadiths - Narrations to filter.
 * @param bucket - Target bucket, or 'all'.
 * @returns Filtered narrations.
 */
export function filterByGrade(
  hadiths: readonly RemoteHadith[],
  bucket: GradeBucket | 'all'
): readonly RemoteHadith[] {
  if (bucket === 'all') return hadiths;
  return hadiths.filter((h) => gradeBucket(h.grade) === bucket);
}

/**
 * Tolerant keyword search over streamed hadiths (Arabic + English).
 * @param hadiths - Narrations to search.
 * @param query - Search text.
 * @returns Matching narrations; the input when query is empty.
 */
export function searchStreamed(
  hadiths: readonly RemoteHadith[],
  query: string
): readonly RemoteHadith[] {
  const q = normalize(query);
  if (q === '') return hadiths;
  const plain = query.trim().toLowerCase();
  return hadiths.filter(
    (h) =>
      normalize(h.arabic).includes(q) ||
      h.english.toLowerCase().includes(plain) ||
      h.grade.toLowerCase().includes(plain) ||
      String(h.num) === plain
  );
}

/**
 * Counts hadiths per grade bucket.
 * @param hadiths - Narrations to tally.
 * @returns Map of bucket to count.
 */
export function gradeCounts(hadiths: readonly RemoteHadith[]): Record<GradeBucket, number> {
  const counts: Record<GradeBucket, number> = { sahih: 0, hasan: 0, daif: 0, unknown: 0 };
  for (const h of hadiths) counts[gradeBucket(h.grade)] += 1;
  return counts;
}
