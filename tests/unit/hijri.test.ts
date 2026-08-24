import { describe, expect, it } from 'vitest';
import {
  gregorianToHijri,
  hijriMonthLength,
  hijriToGregorian,
  hijriToJDN,
  isLeapHijriYear,
  jdnToHijri,
} from '../../src/lib/core/hijri';

describe('civil tabular calendar', () => {
  it('round-trips Gregorian -> Hijri -> Gregorian over many dates', () => {
    const start = new Date(2020, 0, 1).getTime();
    for (let i = 0; i < 200; i += 1) {
      const date = new Date(start + i * 17 * 86400000);
      const hijri = gregorianToHijri(date);
      const back = hijriToGregorian(hijri);
      expect(back.getFullYear()).toBe(date.getFullYear());
      expect(back.getMonth()).toBe(date.getMonth());
      expect(back.getDate()).toBe(date.getDate());
    }
  });

  it('anchors the epoch: 1 Muharram 1 AH maps back to itself', () => {
    const epoch = hijriToGregorian({ year: 1, month: 1, day: 1 });
    expect(gregorianToHijri(epoch)).toEqual({ year: 1, month: 1, day: 1 });
  });

  it('matches known modern anchors within one day', () => {
    const hijri = gregorianToHijri(new Date(2024, 2, 11));
    expect(hijri.year).toBe(1445);
    expect(hijri.month).toBe(9);
    expect([1, 2]).toContain(hijri.day);
  });
});

describe('leap years and month lengths', () => {
  it('flags leap years per the 30-year civil cycle', () => {
    expect(isLeapHijriYear(2)).toBe(true);
    expect(isLeapHijriYear(5)).toBe(true);
    expect(isLeapHijriYear(1)).toBe(false);
    expect(isLeapHijriYear(3)).toBe(false);
  });

  it('gives odd months 30 days, even months 29, Dhul-Hijjah per leap rule', () => {
    expect(hijriMonthLength(1445, 1)).toBe(30);
    expect(hijriMonthLength(1445, 2)).toBe(29);
    expect(hijriMonthLength(1445, 11)).toBe(30);
    for (const year of [1444, 1445, 1446, 1447]) {
      expect(hijriMonthLength(year, 12)).toBe(isLeapHijriYear(year) ? 30 : 29);
    }
  });
});

describe('JDN conversion symmetry', () => {
  it('jdnToHijri inverts hijriToJDN', () => {
    const samples = [
      { year: 1, month: 1, day: 1 },
      { year: 1400, month: 6, day: 15 },
      { year: 1445, month: 9, day: 1 },
      { year: 1500, month: 12, day: 29 },
    ];
    for (const s of samples) {
      expect(jdnToHijri(hijriToJDN(s.year, s.month, s.day))).toEqual(s);
    }
  });
});

describe('validation', () => {
  it('rejects impossible Hijri dates', () => {
    expect(() => hijriToGregorian({ year: 1445, month: 13, day: 1 })).toThrow();
    expect(() => hijriToGregorian({ year: 0, month: 1, day: 1 })).toThrow();
    expect(() => hijriToGregorian({ year: 1445, month: 1, day: 31 })).toThrow();
  });
});
