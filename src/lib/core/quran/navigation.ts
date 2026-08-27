/**
 * Quran navigation maps (lib/core/quran/navigation.ts).
 * Juz boundaries, global ayah indexing, prev/next surah, and an
 * approximate Madani page estimate. Pure and deterministic.
 */
import { ALL_SURAHS, getSurahInfo } from '../quran-meta';

/** A location in the Quran as surah + ayah (both 1-based). */
export interface AyahRef {
  surah: number;
  ayah: number;
}

/** Start (surah:ayah) of each of the 30 juz, 1-based. */
export const JUZ_STARTS: readonly AyahRef[] = [
  { surah: 1, ayah: 1 }, { surah: 2, ayah: 142 }, { surah: 2, ayah: 253 },
  { surah: 3, ayah: 93 }, { surah: 4, ayah: 24 }, { surah: 4, ayah: 148 },
  { surah: 5, ayah: 82 }, { surah: 6, ayah: 111 }, { surah: 7, ayah: 88 },
  { surah: 8, ayah: 41 }, { surah: 9, ayah: 93 }, { surah: 11, ayah: 6 },
  { surah: 12, ayah: 53 }, { surah: 15, ayah: 1 }, { surah: 17, ayah: 1 },
  { surah: 18, ayah: 75 }, { surah: 21, ayah: 1 }, { surah: 23, ayah: 1 },
  { surah: 25, ayah: 21 }, { surah: 27, ayah: 56 }, { surah: 29, ayah: 46 },
  { surah: 33, ayah: 31 }, { surah: 36, ayah: 28 }, { surah: 39, ayah: 32 },
  { surah: 41, ayah: 47 }, { surah: 46, ayah: 1 }, { surah: 51, ayah: 31 },
  { surah: 58, ayah: 1 }, { surah: 67, ayah: 1 }, { surah: 78, ayah: 1 },
];

/** Total ayahs in the Quran. */
export const TOTAL_AYAHS: number = ALL_SURAHS.reduce((sum, s) => sum + s.ayahCount, 0);

/** Madani mushaf page count (approximate). */
export const MADANI_PAGES = 604;

const SURAH_START_INDEX: Map<number, number> = (() => {
  const map = new Map<number, number>();
  let acc = 0;
  for (const s of ALL_SURAHS) {
    map.set(s.num, acc);
    acc += s.ayahCount;
  }
  return map;
})();

/**
 * Global 0-based index of an ayah across the whole Quran.
 * @param surah - Surah number 1-114.
 * @param ayah - Ayah number within the surah.
 * @returns 0-based global index.
 */
export function globalIndex(surah: number, ayah: number): number {
  return (SURAH_START_INDEX.get(surah) ?? 0) + ayah - 1;
}

/**
 * Resolves a global 0-based index back to a surah:ayah reference.
 * @param index - Global index.
 * @returns The ayah reference.
 * @throws Error when index is out of range.
 */
export function refAtGlobal(index: number): AyahRef {
  if (index < 0 || index >= TOTAL_AYAHS) throw new Error('SalahKit: ayah index out of range.');
  let acc = 0;
  for (const s of ALL_SURAHS) {
    if (index < acc + s.ayahCount) return { surah: s.num, ayah: index - acc + 1 };
    acc += s.ayahCount;
  }
  throw new Error('SalahKit: ayah index out of range.');
}

/**
 * The juz (1-30) containing a given ayah.
 * @param ref - Ayah reference.
 * @returns Juz number 1-30.
 */
export function juzOf(ref: AyahRef): number {
  const idx = globalIndex(ref.surah, ref.ayah);
  let juz = 1;
  for (let j = 0; j < JUZ_STARTS.length; j += 1) {
    const start = JUZ_STARTS[j];
    if (start && globalIndex(start.surah, start.ayah) <= idx) juz = j + 1;
  }
  return juz;
}

/**
 * Approximate Madani page (1-604) of an ayah, by proportional position.
 * @param ref - Ayah reference.
 * @returns Estimated page number.
 */
export function pageOf(ref: AyahRef): number {
  const frac = (globalIndex(ref.surah, ref.ayah) + 1) / TOTAL_AYAHS;
  return Math.min(MADANI_PAGES, Math.max(1, Math.ceil(frac * MADANI_PAGES)));
}

/**
 * Previous surah number, or null at the start.
 * @param surah - Current surah 1-114.
 * @returns Previous surah number or null.
 */
export function prevSurah(surah: number): number | null {
  return surah > 1 ? surah - 1 : null;
}

/**
 * Next surah number, or null at the end.
 * @param surah - Current surah 1-114.
 * @returns Next surah number or null.
 */
export function nextSurah(surah: number): number | null {
  return surah < ALL_SURAHS.length ? surah + 1 : null;
}

/**
 * Clamps an ayah number into a surah's valid range.
 * @param surah - Surah number.
 * @param ayah - Candidate ayah number.
 * @returns Clamped ayah number.
 */
export function clampAyah(surah: number, ayah: number): number {
  const count = getSurahInfo(surah).ayahCount;
  return Math.min(count, Math.max(1, Math.round(ayah)));
}

/**
 * Serializes an ayah reference to the canonical "surah:ayah" string.
 * @param ref - Ayah reference.
 * @returns String like "2:255".
 */
export function refToString(ref: AyahRef): string {
  return `${ref.surah}:${ref.ayah}`;
}

/**
 * Parses a "surah:ayah" string into a reference.
 * @param text - String like "2:255".
 * @returns The parsed reference, or null when malformed.
 */
export function parseRef(text: string): AyahRef | null {
  const m = /^(\d{1,3}):(\d{1,3})$/.exec(text.trim());
  if (!m) return null;
  const surah = Number(m[1]);
  const ayah = Number(m[2]);
  if (surah < 1 || surah > ALL_SURAHS.length) return null;
  return { surah, ayah: clampAyah(surah, ayah) };
}
