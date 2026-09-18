import { describe, expect, it } from 'vitest';
import {
  addDaysISO,
  computePrayerTimes,
  nextPrayer,
  previousPrayer,
} from '../../src/lib/core/prayer-engine';
import type { CalcMethodId } from '../../src/lib/core/types';

const MAKKAH = { lat: 21.4225, lng: 39.8262 };
const DATE = '2026-03-20';
const METHODS: CalcMethodId[] = ['MWL', 'ISNA', 'Egypt', 'Karachi', 'UmmAlQura'];

describe('computePrayerTimes', () => {
  it.each(METHODS)('produces strictly ordered times for %s', (method) => {
    const day = computePrayerTimes(DATE, MAKKAH.lat, MAKKAH.lng, method, 'shafi');
    const t = day.times;
    expect(t.fajr.getTime()).toBeLessThan(t.sunrise.getTime());
    expect(t.sunrise.getTime()).toBeLessThan(t.dhuhr.getTime());
    expect(t.dhuhr.getTime()).toBeLessThan(t.asr.getTime());
    expect(t.asr.getTime()).toBeLessThan(t.maghrib.getTime());
    expect(t.maghrib.getTime()).toBeLessThan(t.isha.getTime());
  });

  it('keeps Makkah wall-clock times within sensible daily bands', () => {
    const t = computePrayerTimes(DATE, MAKKAH.lat, MAKKAH.lng, 'MWL', 'shafi').times;
    expect(t.fajr.getHours()).toBeGreaterThanOrEqual(3);
    expect(t.fajr.getHours()).toBeLessThanOrEqual(6);
    expect(t.dhuhr.getHours()).toBeGreaterThanOrEqual(11);
    expect(t.dhuhr.getHours()).toBeLessThanOrEqual(14);
    expect(t.maghrib.getHours()).toBeGreaterThanOrEqual(17);
    expect(t.maghrib.getHours()).toBeLessThanOrEqual(20);
  });

  it('sets Isha 90 minutes after Maghrib for UmmAlQura', () => {
    const t = computePrayerTimes(DATE, MAKKAH.lat, MAKKAH.lng, 'UmmAlQura', 'shafi').times;
    expect(t.isha.getTime() - t.maghrib.getTime()).toBe(90 * 60 * 1000);
  });

  it('computes a later Asr for the Hanafi madhab', () => {
    const shafi = computePrayerTimes(DATE, MAKKAH.lat, MAKKAH.lng, 'MWL', 'shafi').times.asr;
    const hanafi = computePrayerTimes(DATE, MAKKAH.lat, MAKKAH.lng, 'MWL', 'hanafi').times.asr;
    expect(hanafi.getTime()).toBeGreaterThan(shafi.getTime());
  });

  it('computes an earlier Fajr for the wider 18-degree angle (MWL vs ISNA)', () => {
    const mwl = computePrayerTimes(DATE, MAKKAH.lat, MAKKAH.lng, 'MWL', 'shafi').times.fajr;
    const isna = computePrayerTimes(DATE, MAKKAH.lat, MAKKAH.lng, 'ISNA', 'shafi').times.fajr;
    expect(mwl.getTime()).toBeLessThan(isna.getTime());
  });

  it('handles winter and summer solstice dates without errors', () => {
    const winter = computePrayerTimes('2026-12-21', 51.5074, -0.1278, 'MWL', 'shafi');
    const summer = computePrayerTimes('2026-06-21', 51.5074, -0.1278, 'MWL', 'shafi');
    expect(winter.times.fajr.getTime()).toBeLessThan(winter.times.isha.getTime());
    expect(summer.times.fajr.getTime()).toBeLessThan(summer.times.isha.getTime());
  });
});

describe('addDaysISO', () => {
  it('rolls over months and leap years', () => {
    expect(addDaysISO('2026-01-31', 1)).toBe('2026-02-01');
    expect(addDaysISO('2024-02-28', 1)).toBe('2024-02-29');
    expect(addDaysISO('2026-12-31', 1)).toBe('2027-01-01');
  });
});

describe('nextPrayer / previousPrayer', () => {
  const today = computePrayerTimes(DATE, MAKKAH.lat, MAKKAH.lng, 'MWL', 'shafi');
  const tomorrow = computePrayerTimes(addDaysISO(DATE, 1), MAKKAH.lat, MAKKAH.lng, 'MWL', 'shafi');

  it('skips sunrise and finds Dhuhr after Fajr has passed', () => {
    const now = new Date(today.times.fajr.getTime() + 60000);
    expect(nextPrayer(today, tomorrow, now).name).toBe('dhuhr');   // sunrise is not a prayer
  });

  it('finds Fajr itself before the day begins', () => {
    const now = new Date(today.times.fajr.getTime() - 60000);
    expect(nextPrayer(today, tomorrow, now).name).toBe('fajr');
  });

  it('wraps to tomorrow Fajr after Isha', () => {
    const now = new Date(today.times.isha.getTime() + 60000);
    const next = nextPrayer(today, tomorrow, now);
    expect(next.name).toBe('fajr');
    expect(next.at.getTime()).toBe(tomorrow.times.fajr.getTime());
  });

  it('reports the previous prayer correctly mid-afternoon', () => {
    const now = new Date((today.times.dhuhr.getTime() + today.times.asr.getTime()) / 2);
    expect(previousPrayer(today, now).name).toBe('dhuhr');
  });
});
