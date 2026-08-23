/**
 * Hijri (Islamic) calendar conversion (S3: hijri.ts).
 * Implements the tabular Islamic calendar (Kuwaiti / civil algorithm,
 * Friday epoch JDN 1948440 = 1 Muharram 1 AH). The 'ummAlQura' variant
 * shares this algorithm locally; exact Umm al-Qura dates differ by at
 * most 1-2 days and are refined online via the AlAdhan gToH endpoint
 * (see lib/external/aladhan.ts + lib/db/cache.ts).
 * Pure TypeScript — no framework imports, no side effects.
 */
import { HIJRI_MONTHS } from './constants';
import { isValidHijri } from './validator';
import { gregorianToJDN, jdnToGregorian } from './solar-math';
import type { HijriCalendar, HijriDate } from './types';

const EPOCH_JDN = 1948439;
const CYCLE_DIVISOR = 30;

/**
 * True when a Hijri year is a leap year in the civil 30-year cycle
 * (leap years: 2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29).
 * @param year - Hijri year.
 * @returns True for leap years (Dhul-Hijjah has 30 days).
 */
export function isLeapHijriYear(year: number): boolean {
  return ((11 * year + 3) % CYCLE_DIVISOR) >= 19;
}

/**
 * Number of days in a Hijri month (odd months 30, even 29, leap Dhul-Hijjah 30).
 * @param year - Hijri year.
 * @param month - Month 1-12.
 * @returns Month length in days (29 or 30).
 */
export function hijriMonthLength(year: number, month: number): number {
  if (month === 12) return isLeapHijriYear(year) ? 30 : 29;
  return month % 2 === 1 ? 30 : 29;
}

/**
 * Julian Day Number for a Hijri date (inverse of the Kuwaiti algorithm).
 * @param y - Hijri year.
 * @param m - Month 1-12.
 * @param d - Day 1-30.
 * @returns Julian Day Number.
 */
export function hijriToJDN(y: number, m: number, d: number): number {
  const daysBeforeMonth = 30 * (m - 1) - Math.floor((m - 1) / 2);
  const leapDays = Math.floor((11 * y + 3) / CYCLE_DIVISOR);
  return d + daysBeforeMonth + 354 * (y - 1) + leapDays + EPOCH_JDN;
}

/**
 * Converts a Gregorian Date (local civil date) to a Hijri date.
 * @param date - Gregorian date.
 * @param calendar - 'tabular' (default, exact civil algorithm) or
 *   'ummAlQura' (locally approximated; refined online when available).
 * @returns Hijri year/month/day.
 */
export function gregorianToHijri(date: Date, calendar: HijriCalendar = 'tabular'): HijriDate {
  void calendar;
  const jdn = gregorianToJDN(date.getFullYear(), date.getMonth() + 1, date.getDate());
  return jdnToHijri(jdn);
}

/**
 * Kuwaiti algorithm: Julian Day Number to Hijri date.
 * @param jdn - Julian Day Number.
 * @returns Hijri year/month/day.
 */
export function jdnToHijri(jdn: number): HijriDate {
  let l = jdn - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
    Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l =
    l -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * l) / 43) +
    29;
  const month = Math.floor((24 * l) / 709);
  const day = l - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  return { year, month, day };
}

/**
 * Converts a Hijri date back to a Gregorian Date (local midnight).
 * @param hijri - Hijri year/month/day.
 * @returns Gregorian Date at local midnight.
 * @throws Error when Hijri components are out of range.
 */
export function hijriToGregorian(hijri: HijriDate): Date {
  if (!isValidHijri(hijri.year, hijri.month, hijri.day)) {
    throw new Error('SalahKit: invalid Hijri date components.');
  }
  const jdn = hijriToJDN(hijri.year, hijri.month, hijri.day);
  const [y, m, d] = jdnToGregorian(jdn);
  return new Date(y, m - 1, d);
}

/**
 * English name of a Hijri month.
 * @param month - Month 1-12.
 * @returns Month name; 'Unknown' for out-of-range input.
 */
export function hijriMonthName(month: number): string {
  return HIJRI_MONTHS[month - 1] ?? 'Unknown';
}
