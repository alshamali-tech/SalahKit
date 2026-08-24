import { describe, expect, it } from 'vitest';
import {
  assertFinite,
  clamp,
  isFiniteNumber,
  isNonEmptyString,
  isValidHijri,
  isValidISODate,
  isValidLatitude,
  isValidLongitude,
  parseNumber,
  sanitizeCount,
  toISODate,
} from '../../src/lib/core/validator';

describe('numeric guards', () => {
  it('isFiniteNumber rejects NaN, Infinity and non-numbers', () => {
    expect(isFiniteNumber(42)).toBe(true);
    expect(isFiniteNumber(Number.NaN)).toBe(false);
    expect(isFiniteNumber(Number.POSITIVE_INFINITY)).toBe(false);
    expect(isFiniteNumber('42')).toBe(false);
    expect(isFiniteNumber(null)).toBe(false);
  });

  it('clamp confines values to the range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('validates latitude and longitude ranges', () => {
    expect(isValidLatitude(21.42)).toBe(true);
    expect(isValidLatitude(-90)).toBe(true);
    expect(isValidLatitude(90.01)).toBe(false);
    expect(isValidLongitude(180)).toBe(true);
    expect(isValidLongitude(-180.5)).toBe(false);
  });

  it('parseNumber falls back on junk input', () => {
    expect(parseNumber('12.5', 0)).toBe(12.5);
    expect(parseNumber('  7 ', 0)).toBe(7);
    expect(parseNumber('', 3)).toBe(3);
    expect(parseNumber('abc', 3)).toBe(3);
  });

  it('assertFinite throws a descriptive TypeError', () => {
    expect(() => assertFinite(Number.NaN, 'cash')).toThrow(TypeError);
    expect(() => assertFinite(10, 'cash')).not.toThrow();
  });
});

describe('date guards', () => {
  it('accepts real calendar dates only', () => {
    expect(isValidISODate('2024-02-29')).toBe(true);
    expect(isValidISODate('2023-02-29')).toBe(false);
    expect(isValidISODate('2026-13-01')).toBe(false);
    expect(isValidISODate('2026-00-10')).toBe(false);
    expect(isValidISODate('2026-04-31')).toBe(false);
    expect(isValidISODate('not-a-date')).toBe(false);
  });

  it('formats local dates as YYYY-MM-DD', () => {
    expect(toISODate(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(toISODate(new Date(2026, 11, 31))).toBe('2026-12-31');
  });
});

describe('sanitizeCount', () => {
  it('floors, clamps and defaults safely', () => {
    expect(sanitizeCount(3.7)).toBe(3);
    expect(sanitizeCount(-5)).toBe(0);
    expect(sanitizeCount('x')).toBe(0);
    expect(sanitizeCount(100001)).toBe(100000);
    expect(sanitizeCount(Number.NaN)).toBe(0);
  });
});

describe('string and Hijri guards', () => {
  it('isNonEmptyString rejects blanks and non-strings', () => {
    expect(isNonEmptyString('hi')).toBe(true);
    expect(isNonEmptyString('   ')).toBe(false);
    expect(isNonEmptyString(5)).toBe(false);
  });

  it('isValidHijri enforces component ranges', () => {
    expect(isValidHijri(1445, 9, 1)).toBe(true);
    expect(isValidHijri(1445, 12, 30)).toBe(true);
    expect(isValidHijri(1445, 13, 1)).toBe(false);
    expect(isValidHijri(0, 1, 1)).toBe(false);
    expect(isValidHijri(1445, 1, 31)).toBe(false);
    expect(isValidHijri(1445.5, 1, 1)).toBe(false);
  });
});
