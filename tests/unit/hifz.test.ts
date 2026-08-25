import { describe, expect, it } from 'vitest';
import {
  addDaysLocal,
  chunkId,
  computeStreak,
  globalAyahIndex,
  gradeChunk,
  intervalLabel,
  JUZ_STARTS,
  juzCoverage,
  splitChunkRanges,
  surahCoverage,
  TOTAL_AYAHS,
} from '../../src/lib/core/hifz';
import type { HifzChunkRow } from '../../src/types';

function chunk(partial: Partial<HifzChunkRow>): HifzChunkRow {
  return {
    id: 'x',
    surahNum: 2,
    ayahStart: 1,
    ayahEnd: 3,
    status: 'learning',
    intervalDays: 0,
    reps: 0,
    lapses: 0,
    dueISO: '2026-01-01',
    memorizedAt: null,
    lastGradedISO: null,
    updatedAt: 0,
    ...partial,
  };
}

describe('splitChunkRanges', () => {
  it('splits evenly', () => {
    expect(splitChunkRanges(6, 3)).toEqual([
      { start: 1, end: 3 },
      { start: 4, end: 6 },
    ]);
  });

  it('merges a trailing single ayah into the previous chunk', () => {
    expect(splitChunkRanges(7, 3)).toEqual([
      { start: 1, end: 3 },
      { start: 4, end: 7 },
    ]);
  });

  it('keeps a trailing pair separate', () => {
    expect(splitChunkRanges(8, 3)).toEqual([
      { start: 1, end: 3 },
      { start: 4, end: 6 },
      { start: 7, end: 8 },
    ]);
  });

  it('handles single-ayah surahs and chunk size 1', () => {
    expect(splitChunkRanges(1, 3)).toEqual([{ start: 1, end: 1 }]);
    expect(splitChunkRanges(3, 1)).toHaveLength(3);
  });
});

describe('gradeChunk scheduler', () => {
  const today = '2026-02-10';
  const now = '2026-02-10T12:00:00.000Z';

  it('gives new chunks 1/2/4/7 day starts', () => {
    expect(gradeChunk(null, 'again', today, now).intervalDays).toBe(1);
    expect(gradeChunk(null, 'hard', today, now).intervalDays).toBe(2);
    expect(gradeChunk(null, 'good', today, now).intervalDays).toBe(4);
    expect(gradeChunk(null, 'easy', today, now).intervalDays).toBe(7);
    expect(gradeChunk(null, 'good', today, now).dueISO).toBe('2026-02-14');
  });

  it('grows intervals ×2.5 on good and caps at 90', () => {
    const c = chunk({ intervalDays: 30, reps: 4 });
    expect(gradeChunk(c, 'good', today, now).intervalDays).toBe(75);
    const c2 = chunk({ intervalDays: 75, reps: 5 });
    expect(gradeChunk(c2, 'good', today, now).intervalDays).toBe(90);
  });

  it('lapses on again and demotes memorized chunks', () => {
    const c = chunk({ intervalDays: 45, reps: 5, status: 'memorized', memorizedAt: now });
    const out = gradeChunk(c, 'again', today, now);
    expect(out.intervalDays).toBe(1);
    expect(out.lapses).toBe(1);
    expect(out.status).toBe('learning');
  });

  it('graduates at the 30-day threshold and stamps memorizedAt once', () => {
    const c = chunk({ intervalDays: 14, reps: 3 });
    const out = gradeChunk(c, 'good', today, now);
    expect(out.intervalDays).toBe(35);
    expect(out.status).toBe('memorized');
    expect(out.memorizedAt).toBe(now);
  });
});

describe('computeStreak', () => {
  it('counts consecutive days ending today', () => {
    expect(computeStreak(['2026-02-08', '2026-02-09', '2026-02-10'], '2026-02-10')).toBe(3);
  });

  it('allows the streak to start yesterday', () => {
    expect(computeStreak(['2026-02-09'], '2026-02-10')).toBe(1);
  });

  it('returns zero when the latest activity is older than yesterday', () => {
    expect(computeStreak(['2026-02-07'], '2026-02-10')).toBe(0);
  });

  it('tolerates duplicates, order and month boundaries', () => {
    expect(
      computeStreak(['2026-02-01', '2026-01-31', '2026-01-31', '2026-01-30'], '2026-02-01')
    ).toBe(3);
  });

  it('breaks on a gap', () => {
    expect(computeStreak(['2026-02-10', '2026-02-09', '2026-02-07'], '2026-02-10')).toBe(2);
  });
});

describe('juz coverage graph', () => {
  it('knows the standard 30 juz start points', () => {
    expect(JUZ_STARTS).toHaveLength(30);
    expect(JUZ_STARTS[0]).toEqual({ surah: 1, ayah: 1 });
    expect(JUZ_STARTS[29]).toEqual({ surah: 78, ayah: 1 });
    expect(TOTAL_AYAHS).toBe(6236);
  });

  it('computes juz 30 coverage from memorized chunks', () => {
    const chunks = [chunk({ id: '1:1-7', surahNum: 1, ayahStart: 1, ayahEnd: 7 })];
    const fractions = juzCoverage(chunks);
    expect(fractions).toHaveLength(30);
    expect(fractions[0]).toBe(0);
    expect(fractions[29]).toBeGreaterThan(0);
    expect(fractions[29]).toBeLessThan(1);
  });

  it('maps surah fractions and never exceeds 1', () => {
    const chunks = [chunk({ id: '1:1-7', surahNum: 1, ayahStart: 1, ayahEnd: 7 })];
    const cov = surahCoverage(chunks);
    expect(cov.get(1)).toBe(1);
    expect(cov.get(2)).toBeUndefined();
  });

  it('indexes ayahs globally in mushaf order', () => {
    expect(globalAyahIndex(1, 1)).toBe(0);
    expect(globalAyahIndex(1, 7)).toBe(6);
    expect(globalAyahIndex(2, 1)).toBe(7);
  });
});

describe('small helpers', () => {
  it('addDaysLocal crosses months and years', () => {
    expect(addDaysLocal('2026-01-31', 1)).toBe('2026-02-01');
    expect(addDaysLocal('2026-12-31', 1)).toBe('2027-01-01');
  });

  it('intervalLabel reads naturally', () => {
    expect(intervalLabel(1)).toBe('tomorrow');
    expect(intervalLabel(4)).toBe('4 days');
    expect(intervalLabel(60)).toBe('2 months');
    expect(intervalLabel(90)).toBe('3 months');
  });

  it('chunkId is stable', () => {
    expect(chunkId(2, { start: 140, end: 142 })).toBe('2:140-142');
  });
});
