/**
 * Hifz engine (pure TypeScript, zero side effects).
 * Implements the memorization model behind the Hifz Trainer:
 * - chunk splitting of surahs into learnable ranges
 * - a spaced-repetition scheduler (again/hard/good/easy branches)
 * - streak computation from grading history
 * - a 30-juz coverage graph over memorized chunks
 */
import { HIFZ_GRADUATION_INTERVAL_DAYS, HIFZ_MAX_INTERVAL_DAYS } from './constants';
import { ALL_SURAHS } from './quran-meta';
import type { HifzChunkRow, HifzGrade, HifzStatus } from '../../types';

/** A contiguous ayah range within one surah. */
export interface ChunkRange {
  start: number;
  end: number;
}

/** Start (surah, ayah) of each of the 30 juz, 1-based. */
export const JUZ_STARTS: readonly { surah: number; ayah: number }[] = [
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

/** Total ayahs in the Quran, derived from the metadata set. */
export const TOTAL_AYAHS: number = ALL_SURAHS.reduce((sum, s) => sum + s.ayahCount, 0);

/**
 * Splits a surah into learnable chunk ranges. A trailing single ayah
 * is merged into the previous chunk so no chunk is ever one verse.
 * @param ayahCount - Number of ayahs in the surah.
 * @param chunkSize - Desired chunk size (1, 3 or 5).
 * @returns Ordered, contiguous, complete ranges.
 */
export function splitChunkRanges(ayahCount: number, chunkSize: number): ChunkRange[] {
  const size = Math.max(1, Math.floor(chunkSize));
  const ranges: ChunkRange[] = [];
  for (let start = 1; start <= ayahCount; start += size) {
    ranges.push({ start, end: Math.min(ayahCount, start + size - 1) });
  }
  const last = ranges[ranges.length - 1];
  const prev = ranges[ranges.length - 2];
  if (last && prev && size > 1 && last.end - last.start === 0 && prev.end - prev.start + 1 === size) {
    prev.end = last.end;
    ranges.pop();
  }
  return ranges;
}

/** Outcome of grading one chunk. */
export interface GradeOutcome {
  intervalDays: number;
  dueISO: string;
  reps: number;
  lapses: number;
  status: HifzStatus;
  memorizedAt: string | null;
}

/**
 * Adds days to an ISO date (local calendar).
 * @param iso - Base date YYYY-MM-DD.
 * @param days - Days to add.
 * @returns New ISO date.
 */
export function addDaysLocal(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d + days);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(
    dt.getDate()
  ).padStart(2, '0')}`;
}

/**
 * The spaced-repetition decision tree for one grade:
 * again → tomorrow (lapse), hard → ×1.2, good → ×2.5, easy → ×3.5,
 * capped at 90 days; a chunk graduates to 'memorized' at 30+ days.
 * @param chunk - Existing chunk row, or null for a brand-new chunk.
 * @param grade - Self-assessment grade.
 * @param todayISO - Today's date YYYY-MM-DD.
 * @param nowISO - Current ISO datetime string.
 * @returns The resulting scheduling state.
 */
export function gradeChunk(
  chunk: HifzChunkRow | null,
  grade: HifzGrade,
  todayISO: string,
  nowISO: string
): GradeOutcome {
  const base = chunk?.intervalDays ?? 0;
  const reps = chunk?.reps ?? 0;
  let intervalDays: number;
  let lapses = chunk?.lapses ?? 0;
  let newReps = reps;
  if (grade === 'again') {
    intervalDays = 1;
    if (reps > 0) lapses += 1;
  } else if (grade === 'hard') {
    intervalDays = base === 0 ? 2 : Math.max(1, Math.round(base * 1.2));
    newReps = reps + 1;
  } else if (grade === 'good') {
    intervalDays = base === 0 ? 4 : Math.min(HIFZ_MAX_INTERVAL_DAYS, Math.max(2, Math.round(base * 2.5)));
    newReps = reps + 1;
  } else {
    intervalDays = base === 0 ? 7 : Math.min(HIFZ_MAX_INTERVAL_DAYS, Math.max(3, Math.round(base * 3.5)));
    newReps = reps + 1;
  }
  const status: HifzStatus = intervalDays >= HIFZ_GRADUATION_INTERVAL_DAYS ? 'memorized' : 'learning';
  const memorizedAt =
    status === 'memorized' ? chunk?.memorizedAt ?? nowISO : status === 'learning' && grade === 'again' ? null : chunk?.memorizedAt ?? null;
  return { intervalDays, dueISO: addDaysLocal(todayISO, intervalDays), reps: newReps, lapses, status, memorizedAt };
}

/**
 * Human label for a scheduling interval.
 * @param days - Interval in days.
 * @returns e.g. "tomorrow", "4 days", "3 months".
 */
export function intervalLabel(days: number): string {
  if (days <= 1) return 'tomorrow';
  if (days < 30) return `${days} days`;
  if (days < 90) return `${Math.round(days / 30)} month${days >= 60 ? 's' : ''}`;
  return '3 months';
}

/**
 * Stable id for a chunk row.
 * @param surahNum - Surah number.
 * @param range - Ayah range.
 * @returns Id like "2:140-142".
 */
export function chunkId(surahNum: number, range: ChunkRange): string {
  return `${surahNum}:${range.start}-${range.end}`;
}

/**
 * Streak of consecutive active days ending today or yesterday.
 * @param datesISO - Activity dates YYYY-MM-DD (any order, dupes ok).
 * @param todayISO - Today's date.
 * @returns Streak length in days.
 */
export function computeStreak(datesISO: readonly string[], todayISO: string): number {
  const unique = [...new Set(datesISO)].sort().reverse();
  if (unique.length === 0) return 0;
  if (unique[0] !== todayISO && unique[0] !== addDaysLocal(todayISO, -1)) return 0;
  let streak = 1;
  for (let i = 1; i < unique.length; i += 1) {
    if (unique[i] === addDaysLocal(unique[i - 1], -1)) streak += 1;
    else break;
  }
  return streak;
}

/** Global (mushaf-order) index helpers, precomputed once. */
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
 * Global 0-based index of an ayah in mushaf order.
 * @param surah - Surah number.
 * @param ayah - Ayah number (1-based).
 * @returns Global index.
 */
export function globalAyahIndex(surah: number, ayah: number): number {
  return (SURAH_START_INDEX.get(surah) ?? 0) + ayah - 1;
}

/**
 * Juz coverage graph: fraction of each juz's ayahs that are memorized.
 * @param chunks - All hifz chunk rows.
 * @returns 30 fractions in [0, 1], juz 1 first.
 */
export function juzCoverage(chunks: readonly HifzChunkRow[]): number[] {
  const memorized = new Set<number>();
  for (const c of chunks) {
    for (let a = c.ayahStart; a <= c.ayahEnd; a += 1) memorized.add(globalAyahIndex(c.surahNum, a));
  }
  const fractions: number[] = [];
  for (let j = 0; j < JUZ_STARTS.length; j += 1) {
    const startIdx = globalAyahIndex(JUZ_STARTS[j].surah, JUZ_STARTS[j].ayah);
    const endIdx =
      j + 1 < JUZ_STARTS.length
        ? globalAyahIndex(JUZ_STARTS[j + 1].surah, JUZ_STARTS[j + 1].ayah) - 1
        : TOTAL_AYAHS - 1;
    let hit = 0;
    for (let idx = startIdx; idx <= endIdx; idx += 1) if (memorized.has(idx)) hit += 1;
    fractions.push(hit / Math.max(1, endIdx - startIdx + 1));
  }
  return fractions;
}

/**
 * Per-surah memorized-ayah fraction.
 * @param chunks - All hifz chunk rows.
 * @returns Map of surahNum → fraction in [0, 1].
 */
export function surahCoverage(chunks: readonly HifzChunkRow[]): Map<number, number> {
  const map = new Map<number, number>();
  for (const c of chunks) {
    map.set(c.surahNum, (map.get(c.surahNum) ?? 0) + (c.ayahEnd - c.ayahStart + 1));
  }
  for (const [num, count] of map) {
    const total = ALL_SURAHS.find((s) => s.num === num)?.ayahCount ?? 1;
    map.set(num, Math.min(1, count / total));
  }
  return map;
}
