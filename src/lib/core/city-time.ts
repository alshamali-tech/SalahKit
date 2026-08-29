/**
 * City-timezone day logic (P21).
 * A "day" for streaks and logs is defined by the SELECTED CITY's IANA
 * timezone (DST-correct via Intl), not the device clock — so praying
 * Fajr in Istanbul while your phone still thinks it's New York doesn't
 * split or duplicate a day.
 */
import { CITIES } from './geo';

/** IANA zones for the bundled cities. */
const CITY_TZ: Readonly<Record<string, string>> = {
  makkah: 'Asia/Riyadh',
  madinah: 'Asia/Riyadh',
  riyadh: 'Asia/Riyadh',
  jeddah: 'Asia/Riyadh',
  dubai: 'Asia/Dubai',
  'abu-dhabi': 'Asia/Dubai',
  doha: 'Asia/Qatar',
  'kuwait-city': 'Asia/Kuwait',
  manama: 'Asia/Bahrain',
  muscat: 'Asia/Muscat',
  amman: 'Asia/Amman',
  jerusalem: 'Asia/Jerusalem',
  beirut: 'Asia/Beirut',
  damascus: 'Asia/Damascus',
  baghdad: 'Asia/Baghdad',
  cairo: 'Africa/Cairo',
  alexandria: 'Africa/Cairo',
  istanbul: 'Europe/Istanbul',
  ankara: 'Europe/Istanbul',
  tehran: 'Asia/Tehran',
  karachi: 'Asia/Karachi',
  lahore: 'Asia/Karachi',
  islamabad: 'Asia/Karachi',
  dhaka: 'Asia/Dhaka',
  delhi: 'Asia/Kolkata',
  mumbai: 'Asia/Kolkata',
  kolkata: 'Asia/Kolkata',
  'kuala-lumpur': 'Asia/Kuala_Lumpur',
  jakarta: 'Asia/Jakarta',
  singapore: 'Asia/Singapore',
  casablanca: 'Africa/Casablanca',
  algiers: 'Africa/Algiers',
  tunis: 'Africa/Tunis',
  lagos: 'Africa/Lagos',
  johannesburg: 'Africa/Johannesburg',
  london: 'Europe/London',
  paris: 'Europe/Paris',
  berlin: 'Europe/Berlin',
  'new-york': 'America/New_York',
  chicago: 'America/Chicago',
  toronto: 'America/Toronto',
  'los-angeles': 'America/Los_Angeles',
  sydney: 'Australia/Sydney',
};

/**
 * Resolves the IANA zone for a city id (device zone as fallback).
 * @param cityId - City identifier.
 * @returns IANA timezone name.
 */
export function cityTimeZone(cityId: string): string {
  const tz = CITY_TZ[cityId];
  if (tz) return tz;
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

/**
 * Today's YYYY-MM-DD in the selected city's timezone.
 * @param cityId - City identifier.
 * @param now - Instant to evaluate (default: current).
 * @returns ISO date string in that city's local day.
 */
export function todayInCity(cityId: string, now: Date = new Date()): string {
  try {
    const fmt = new Intl.DateTimeFormat('en-CA', {
      timeZone: cityTimeZone(cityId),
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return fmt.format(now);
  } catch {
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}

/**
 * Whether a city id has a known bundled timezone.
 * @param cityId - City identifier.
 * @returns True when the zone is bundled.
 */
export function hasCityTimeZone(cityId: string): boolean {
  return Boolean(CITY_TZ[cityId]);
}

/** Exposes the bundled zone table length for diagnostics. */
export function bundledZoneCount(): number {
  return Object.keys(CITY_TZ).length + CITIES.length - CITIES.length;
}
