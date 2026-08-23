/**
 * Astronomical prayer-time engine (S3: prayer-engine.ts).
 * Computes all five prayers plus sunrise for any date and location using
 * solar position math. 100% local — no network required.
 * Pure TypeScript — no framework imports, no side effects.
 */
import { ASR_SHADOW_FACTOR, SUNRISE_SUNSET_ANGLE } from './constants';
import { getCalcMethod } from './calc-methods';
import {
  asrAltitudeDeg,
  equationOfTimeMin,
  gregorianToJDN,
  hourAngleDeg,
  julianCentury,
  sunDeclinationDeg,
} from './solar-math';
import { isValidLatitude, isValidLongitude, isValidISODate } from './validator';
import type { CalcMethodId, Madhab, PrayerName, PrayerTimesResult } from './types';

const HOURS_PER_DEG = 1 / 15;

/**
 * Converts fractional UTC hours on a calendar date into an absolute Date.
 * Date.UTC natively absorbs negative or >24 hour values across day edges.
 * @param dateISO - Calendar date (YYYY-MM-DD).
 * @param utcHours - Fractional hours in UTC.
 * @returns Absolute instant as a Date.
 */
function utcHoursToDate(dateISO: string, utcHours: number): Date {
  const [y, m, d] = dateISO.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 0, Math.round(utcHours * 60)));
}

/**
 * Core computation: raw UTC hours for all six events on one date.
 * @param dateISO - Local calendar date.
 * @param latitude - Observer latitude in degrees.
 * @param longitude - Observer longitude in degrees.
 * @param method - Calculation method id.
 * @param madhab - Madhab for the Asr shadow factor.
 * @returns Map of prayer name to fractional UTC hours.
 */
function computeRawHours(
  dateISO: string,
  latitude: number,
  longitude: number,
  method: CalcMethodId,
  madhab: Madhab
): Record<PrayerName, number> {
  const [y, m, d] = dateISO.split('-').map(Number);
  const t = julianCentury(gregorianToJDN(y, m, d));
  const dec = sunDeclinationDeg(t);
  const eot = equationOfTimeMin(t);
  const noon = 12 - eot / 60 - longitude * HOURS_PER_DEG;
  const preset = getCalcMethod(method);
  const sunriseHA = hourAngleDeg(latitude, dec, -SUNRISE_SUNSET_ANGLE);
  const fajrHA = hourAngleDeg(latitude, dec, -preset.fajrAngle);
  const asrAlt = asrAltitudeDeg(latitude, dec, ASR_SHADOW_FACTOR[madhab]);
  const asrHA = hourAngleDeg(latitude, dec, asrAlt);
  const sunset = noon + sunriseHA * HOURS_PER_DEG;
  const isha =
    preset.ishaIntervalMin !== undefined
      ? sunset + preset.ishaIntervalMin / 60
      : noon + hourAngleDeg(latitude, dec, -preset.ishaAngle) * HOURS_PER_DEG;
  return {
    fajr: noon - fajrHA * HOURS_PER_DEG,
    sunrise: noon - sunriseHA * HOURS_PER_DEG,
    dhuhr: noon + 2 / 60,
    asr: noon + asrHA * HOURS_PER_DEG,
    maghrib: sunset + 1 / 60,
    isha,
  };
}

/**
 * Computes prayer times for one local calendar date.
 * @param dateISO - Local date as YYYY-MM-DD.
 * @param latitude - Observer latitude (-90 to 90).
 * @param longitude - Observer longitude (-180 to 180).
 * @param method - Calculation method preset id.
 * @param madhab - Madhab for the Asr shadow factor.
 * @returns Complete result including absolute Date objects per prayer.
 * @throws Error when the date or coordinates are invalid.
 */
export function computePrayerTimes(
  dateISO: string,
  latitude: number,
  longitude: number,
  method: CalcMethodId,
  madhab: Madhab
): PrayerTimesResult {
  if (!isValidISODate(dateISO)) throw new Error(`SalahKit: invalid date "${dateISO}".`);
  if (!isValidLatitude(latitude)) throw new Error('SalahKit: latitude out of range.');
  if (!isValidLongitude(longitude)) throw new Error('SalahKit: longitude out of range.');
  const raw = computeRawHours(dateISO, latitude, longitude, method, madhab);
  const times = {} as Record<PrayerName, Date>;
  (Object.keys(raw) as PrayerName[]).forEach((name) => {
    times[name] = utcHoursToDate(dateISO, raw[name]);
  });
  return { dateISO, latitude, longitude, method, madhab, times };
}

/** Adds n days to an ISO date string.
 * @param dateISO - Base date YYYY-MM-DD.
 * @param days - Days to add (may be negative).
 * @returns New ISO date string.
 */
export function addDaysISO(dateISO: string, days: number): string {
  const [y, m, d] = dateISO.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  const mm = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(dt.getUTCDate()).padStart(2, '0');
  return `${dt.getUTCFullYear()}-${mm}-${dd}`;
}

const PRAYERS_ONLY: readonly PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

/**
 * Finds the next prayer after `now`, rolling to tomorrow's Fajr if needed.
 * @param today - Times for the current local date.
 * @param tomorrow - Times for the following local date.
 * @param now - Current instant.
 * @returns Name and absolute time of the next prayer.
 */
export function nextPrayer(
  today: PrayerTimesResult,
  tomorrow: PrayerTimesResult,
  now: Date
): { name: PrayerName; at: Date } {
  for (const name of PRAYERS_ONLY) {
    const at = today.times[name];
    if (at.getTime() > now.getTime()) return { name, at };
  }
  return { name: 'fajr', at: tomorrow.times.fajr };
}

/**
 * Finds the previous prayer at or before `now` (yesterday's Isha as floor).
 * @param today - Times for the current local date.
 * @param now - Current instant.
 * @returns Name and absolute time of the most recent prayer.
 */
export function previousPrayer(today: PrayerTimesResult, now: Date): { name: PrayerName; at: Date } {
  let prev: { name: PrayerName; at: Date } = { name: 'isha', at: today.times.fajr };
  for (const name of PRAYERS_ONLY) {
    const at = today.times[name];
    if (at.getTime() <= now.getTime()) prev = { name, at };
  }
  return prev;
}
