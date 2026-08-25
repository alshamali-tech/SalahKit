/**
 * Magnetic declination via the free, keyless NOAA Geomag API.
 * Same S5 discipline as AlAdhan: cache-first (30-day TTL in the
 * extCache table), max 3 calls/day, graceful zero fallback so the
 * compass works fully offline. Never throws into the UI.
 */
import {
  API_FETCH_TIMEOUT_MS,
  API_MAX_CALLS_PER_DAY,
  DECLINATION_TTL_MS,
  STORAGE_KEYS,
} from '../core/constants';
import { getCached, makeCacheKey, setCached } from '../db/cache';
import { isOnline } from '../utils/offline';
import { getJSON, setJSON } from '../utils/storage';

const NOAA_URL = 'https://www.ngdc.noaa.gov/api/v1/magdecl';

/** Result of a declination lookup. */
export interface DeclinationResult {
  /** Declination in degrees (east positive). 0 when unavailable. */
  value: number;
  /** Where the value came from. */
  source: 'noaa' | 'cache' | 'unavailable';
}

interface NoaaPoint {
  declination?: unknown;
}

interface NoaaResponse {
  result?: NoaaPoint[];
}

/**
 * Checks and consumes one unit of the daily NOAA budget.
 * @returns True when a call is still allowed today.
 */
function consumeDeclinationBudget(): boolean {
  const today = new Date().toISOString().slice(0, 10);
  const budget = getJSON<{ date: string; count: number }>(
    STORAGE_KEYS.declinationCallCounts,
    { date: today, count: 0 }
  );
  if (budget.date !== today) {
    setJSON(STORAGE_KEYS.declinationCallCounts, { date: today, count: 1 });
    return true;
  }
  if (budget.count >= API_MAX_CALLS_PER_DAY) return false;
  setJSON(STORAGE_KEYS.declinationCallCounts, { date: today, count: budget.count + 1 });
  return true;
}

/**
 * Fetches JSON with a timeout; resolves to null on any failure.
 * @param url - Request URL.
 * @returns Parsed body or null.
 */
async function fetchJson(url: string): Promise<NoaaResponse | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    return (await res.json()) as NoaaResponse;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Looks up magnetic declination for a coordinate: cached value first,
 * then a rate-limited NOAA call, else zero (magnetic-north assumption).
 * @param latitude - Observer latitude in degrees.
 * @param longitude - Observer longitude in degrees.
 * @returns Declination result with provenance.
 */
export async function fetchDeclination(
  latitude: number,
  longitude: number
): Promise<DeclinationResult> {
  const key = makeCacheKey(
    'noaa',
    'declination',
    `${latitude.toFixed(2)},${longitude.toFixed(2)}`
  );
  try {
    const cached = await getCached<{ declination: number }>(key);
    if (cached && Number.isFinite(cached.declination)) {
      return { value: cached.declination, source: 'cache' };
    }
  } catch {
    // Cache unreadable; fall through to network.
  }
  if (!isOnline() || !consumeDeclinationBudget()) {
    return { value: 0, source: 'unavailable' };
  }
  const url = `${NOAA_URL}?latitude=${latitude.toFixed(4)}&longitude=${longitude.toFixed(4)}&result=json`;
  const body = await fetchJson(url);
  const value = Number(body?.result?.[0]?.declination);
  if (!Number.isFinite(value) || Math.abs(value) > 45) {
    return { value: 0, source: 'unavailable' };
  }
  try {
    await setCached(key, { declination: value }, DECLINATION_TTL_MS);
  } catch {
    // Value still served for this session even if persistence fails.
  }
  return { value, source: 'noaa' };
}
