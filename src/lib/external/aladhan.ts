/**
 * AlAdhan API helpers (S3/S5: external data, keyless & free).
 * Strategy: IndexedDB cache first, strict rate limit (3 calls/day per
 * source), graceful null on any failure so the local engine remains
 * the source of truth. Never blocks or throws into the UI.
 */
import {
  API_FETCH_TIMEOUT_MS,
  API_MAX_CALLS_PER_DAY,
  API_TTL_HIJRI_MS,
  API_TTL_PRAYER_MS,
  STORAGE_KEYS,
} from '../core/constants';
import { getCached, makeCacheKey, setCached } from '../db/cache';
import { isOnline } from '../utils/offline';
import { getJSON, setJSON } from '../utils/storage';
import type { CalcMethodId, HijriDate } from '../core/types';

const BASE_URL = 'https://api.aladhan.com/v1';

/** AlAdhan numeric method codes for the presets SalahKit supports. */
const METHOD_CODES: Readonly<Record<CalcMethodId, number>> = {
  MWL: 3,
  ISNA: 2,
  Egypt: 5,
  Karachi: 1,
  UmmAlQura: 4,
};

/** Prayer timings as returned by AlAdhan ("HH:MM" 24h strings). */
export interface RemoteTimings {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

/**
 * Checks and consumes one unit of the daily API budget.
 * @returns True when a call is still allowed today.
 */
function consumeRateBudget(): boolean {
  const today = new Date().toISOString().slice(0, 10);
  const budget = getJSON<{ date: string; count: number }>(STORAGE_KEYS.apiCallCounts, {
    date: today,
    count: 0,
  });
  if (budget.date !== today) {
    setJSON(STORAGE_KEYS.apiCallCounts, { date: today, count: 1 });
    return true;
  }
  if (budget.count >= API_MAX_CALLS_PER_DAY) return false;
  setJSON(STORAGE_KEYS.apiCallCounts, { date: today, count: budget.count + 1 });
  return true;
}

/**
 * Fetches JSON with a timeout; resolves to null on any failure.
 * @param url - Request URL.
 * @returns Parsed JSON body or null.
 */
async function fetchJson(url: string): Promise<Record<string, unknown> | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Strips AlAdhan's "(TZ)" suffix from a timing string.
 * @param raw - Raw timing like "05:12 (+03)".
 * @returns Clean "HH:MM" string.
 */
export function cleanTiming(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return raw.split(' ')[0]?.trim() ?? '';
}

/**
 * Fetches today's prayer timings from AlAdhan (24h TTL cache).
 * @param latitude - Observer latitude.
 * @param longitude - Observer longitude.
 * @param dateISO - Date as DD-MM-YYYY consumer passes formatted date.
 * @param method - Calculation method id.
 * @returns Remote timings or null (offline/rate-limited/failed).
 */
export async function fetchAlAdhanTimings(
  latitude: number,
  longitude: number,
  dateISO: string,
  method: CalcMethodId
): Promise<RemoteTimings | null> {
  const key = makeCacheKey('aladhan', 'timings', `${latitude},${longitude}`, dateISO, method);
  const cached = await getCached<RemoteTimings>(key);
  if (cached) return cached;
  if (!isOnline() || !consumeRateBudget()) return null;
  const url = `${BASE_URL}/timings/${dateISO}?latitude=${latitude}&longitude=${longitude}&method=${METHOD_CODES[method]}`;
  const body = await fetchJson(url);
  const timings = (body as { data?: { timings?: Record<string, unknown> } } | null)?.data
    ?.timings;
  if (!timings) return null;
  const result: RemoteTimings = {
    fajr: cleanTiming(timings.Fajr),
    sunrise: cleanTiming(timings.Sunrise),
    dhuhr: cleanTiming(timings.Dhuhr),
    asr: cleanTiming(timings.Asr),
    maghrib: cleanTiming(timings.Maghrib),
    isha: cleanTiming(timings.Isha),
  };
  await setCached(key, result, API_TTL_PRAYER_MS);
  return result;
}

/**
 * Fetches the Hijri date for a Gregorian date (30d TTL cache).
 * @param dateISO - Gregorian date as DD-MM-YYYY.
 * @returns Hijri date or null (offline/rate-limited/failed).
 */
export async function fetchAlAdhanHijri(dateISO: string): Promise<HijriDate | null> {
  const key = makeCacheKey('aladhan', 'gToH', dateISO);
  const cached = await getCached<HijriDate>(key);
  if (cached) return cached;
  if (!isOnline() || !consumeRateBudget()) return null;
  const body = await fetchJson(`${BASE_URL}/gToH/${dateISO}`);
  const hijri = (body as { data?: { hijri?: Record<string, unknown> } } | null)?.data?.hijri;
  if (!hijri) return null;
  const year = Number(hijri.year);
  const monthRaw = hijri.month as { number?: unknown } | undefined;
  const month = Number(monthRaw?.number);
  const day = Number(hijri.day);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;
  const result: HijriDate = { year, month, day };
  await setCached(key, result, API_TTL_HIJRI_MS);
  return result;
}
