import { describe, expect, it } from 'vitest';
import { newCard, review, isDue, clampEase, nextInterval, queueOrder } from '../../src/lib/core/srs/sm2';
import { currentStreak, bestStreak, completionPercent } from '../../src/lib/core/streaks/streak';
import type { DayCompletion } from '../../src/lib/core/streaks/streak';
import {
  globalIndex, refAtGlobal, juzOf, pageOf, prevSurah, nextSurah,
  clampAyah, refToString, parseRef, TOTAL_AYAHS, JUZ_STARTS,
} from '../../src/lib/core/quran/navigation';
import { normalize, searchQuran } from '../../src/lib/core/quran/search';
import { gradeBucket, filterByGrade, searchStreamed, gradeCounts } from '../../src/lib/core/hadith/search';
import type { RemoteHadith } from '../../src/lib/external/hadith-api';

const DAY = 86_400_000;

describe('SM-2 scheduler', () => {
  it('starts a card due immediately with ease 2.5', () => {
    const c = newCard(0);
    expect(c.ease).toBe(2.5);
    expect(isDue(c, 0)).toBe(true);
  });

  it('first success -> 1 day, second -> 6 days', () => {
    let c = review(newCard(0), 4, 0);
    expect(c.intervalDays).toBe(1);
    c = review(c, 4, c.dueAt);
    expect(c.intervalDays).toBe(6);
  });

  it('grades below 3 lapse the card back to day 1', () => {
    let c = review(newCard(0), 5, 0);
    c = review(c, 5, c.dueAt);
    const at = c.dueAt;
    c = review(c, 2, at);
    expect(c.intervalDays).toBe(0);
    expect(c.lapses).toBe(1);
    expect(c.dueAt).toBe(at + DAY);   // due tomorrow from the review instant
  });

  it('ease never drops below 1.3', () => {
    let c = newCard(0);
    for (let i = 0; i < 20; i += 1) c = review(c, 0, c.dueAt);
    expect(clampEase(c.ease)).toBeGreaterThanOrEqual(1.3);
  });

  it('intervals grow monotonically on repeated success', () => {
    let c = newCard(0);
    let prev = 0;
    for (let i = 0; i < 6; i += 1) {
      c = review(c, 5, c.dueAt);
      expect(c.intervalDays).toBeGreaterThan(prev);
      prev = c.intervalDays;
    }
  });

  it('queueOrder sorts earliest-due first', () => {
    const a = { ...newCard(100), dueAt: 300 };
    const b = { ...newCard(100), dueAt: 100 };
    const c = { ...newCard(100), dueAt: 200 };
    expect(queueOrder([a, b, c]).map((x) => x.dueAt)).toEqual([100, 200, 300]);
  });
});

describe('streaks', () => {
  const day = (done: number, total = 5): DayCompletion => ({ done, total });

  it('counts consecutive complete days ending today', () => {
    const days = new Map<string, DayCompletion>([
      ['2024-01-01', day(5)], ['2024-01-02', day(5)], ['2024-01-03', day(5)],
    ]);
    expect(currentStreak(days, new Date('2024-01-03T12:00:00'))).toBe(3);
  });

  it('survives an incomplete today', () => {
    const days = new Map<string, DayCompletion>([
      ['2024-01-01', day(5)], ['2024-01-02', day(5)], ['2024-01-03', day(2)],
    ]);
    expect(currentStreak(days, new Date('2024-01-03T12:00:00'))).toBe(2);
  });

  it('breaks on a missed middle day', () => {
    const days = new Map<string, DayCompletion>([
      ['2024-01-01', day(5)], ['2024-01-02', day(0)], ['2024-01-03', day(5)],
    ]);
    expect(currentStreak(days, new Date('2024-01-03T12:00:00'))).toBe(1);
  });

  it('bestStreak finds the longest run', () => {
    const days = new Map<string, DayCompletion>([
      ['2024-01-01', day(5)], ['2024-01-02', day(5)], ['2024-01-03', day(0)],
      ['2024-01-04', day(5)], ['2024-01-05', day(5)], ['2024-01-06', day(5)],
    ]);
    expect(bestStreak(days)).toBe(3);
  });

  it('completionPercent averages done/total', () => {
    const days = new Map<string, DayCompletion>([
      ['2024-01-01', day(5)], ['2024-01-02', day(3)],
    ]);
    expect(completionPercent(days)).toBe(80);
  });
});

describe('quran navigation', () => {
  it('knows 30 juz and 6236 ayahs', () => {
    expect(JUZ_STARTS).toHaveLength(30);
    expect(TOTAL_AYAHS).toBe(6236);
  });

  it('globalIndex and refAtGlobal are inverses', () => {
    expect(globalIndex(1, 1)).toBe(0);
    expect(refAtGlobal(0)).toEqual({ surah: 1, ayah: 1 });
    expect(refAtGlobal(globalIndex(2, 255))).toEqual({ surah: 2, ayah: 255 });
  });

  it('Ayat al-Kursi is in juz 3', () => {
    expect(juzOf({ surah: 2, ayah: 255 })).toBe(3);
  });

  it('first ayah is juz 1, last is juz 30', () => {
    expect(juzOf({ surah: 1, ayah: 1 })).toBe(1);
    expect(juzOf({ surah: 114, ayah: 6 })).toBe(30);
  });

  it('pageOf stays within 1-604', () => {
    expect(pageOf({ surah: 1, ayah: 1 })).toBeGreaterThanOrEqual(1);
    expect(pageOf({ surah: 114, ayah: 6 })).toBeLessThanOrEqual(604);
  });

  it('prev/next surah bounds', () => {
    expect(prevSurah(1)).toBeNull();
    expect(nextSurah(114)).toBeNull();
    expect(prevSurah(2)).toBe(1);
    expect(nextSurah(1)).toBe(2);
  });

  it('clampAyah respects surah length', () => {
    expect(clampAyah(1, 99)).toBe(7);
    expect(clampAyah(1, 0)).toBe(1);
  });

  it('refToString and parseRef round-trip', () => {
    expect(refToString({ surah: 2, ayah: 255 })).toBe('2:255');
    expect(parseRef('2:255')).toEqual({ surah: 2, ayah: 255 });
    expect(parseRef('garbage')).toBeNull();
    expect(parseRef('999:1')).toBeNull();
  });
});

describe('quran search', () => {
  it('normalize folds Arabic variants and diacritics', () => {
    expect(normalize('الفَاتِحَة')).toBe('الفاتحه');
    expect(normalize('Ya-Sin')).toBe('yasin');
  });

  it('finds Al-Fatihah by name', () => {
    const hits = searchQuran('fatihah');
    expect(hits[0]?.surah.num).toBe(1);
  });

  it('finds by number', () => {
    const hits = searchQuran('36');
    expect(hits[0]?.surah.num).toBe(36);
  });

  it('returns all 114 for empty query', () => {
    expect(searchQuran('')).toHaveLength(114);
  });
});

describe('hadith search', () => {
  const mk = (num: number, grade: string, arabic = '', english = ''): RemoteHadith => ({
    num, arabic, english, grade, id: `bukhari:${num}`,
  });

  it('buckets grades', () => {
    expect(gradeBucket('Sahih')).toBe('sahih');
    expect(gradeBucket('Hasan')).toBe('hasan');
    expect(gradeBucket("Da'if")).toBe('daif');
    expect(gradeBucket('')).toBe('unknown');
  });

  it('filters by grade', () => {
    const set = [mk(1, 'Sahih'), mk(2, 'Hasan'), mk(3, 'Sahih')];
    expect(filterByGrade(set, 'sahih')).toHaveLength(2);
    expect(filterByGrade(set, 'all')).toHaveLength(3);
  });

  it('searches by number and text', () => {
    const set = [mk(1, 'Sahih', '', 'mercy'), mk(2, 'Sahih', '', 'patience')];
    expect(searchStreamed(set, '1')).toHaveLength(1);
    expect(searchStreamed(set, 'mercy')).toHaveLength(1);
    expect(searchStreamed(set, '')).toHaveLength(2);
  });

  it('counts grades', () => {
    const set = [mk(1, 'Sahih'), mk(2, 'Hasan')];
    expect(gradeCounts(set).sahih).toBe(1);
    expect(gradeCounts(set).hasan).toBe(1);
  });
});
