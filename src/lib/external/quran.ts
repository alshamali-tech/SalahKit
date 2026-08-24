/**
 * Full-Quran data layer (extends S4 quranCache table).
 * Verse text streams from the free, keyless AlQuran Cloud API on
 * demand and is cached permanently in IndexedDB, so every surah read
 * once stays readable offline forever. Local short-surah dataset
 * remains the offline floor. Never throws into the UI.
 */
import { getDb } from '../db/db';
import { API_FETCH_TIMEOUT_MS } from '../core/constants';
import { isOnline } from '../utils/offline';
import { getSurahInfo } from '../core/quran-meta';
import type { QuranCacheRow } from '../../types';

const API_BASE = 'https://api.alquran.cloud/v1';

/** Editions fetched in one call: Uthmani Arabic + three translations. */
export const QURAN_EDITIONS = 'quran-uthmani,en.sahih,ur.jalandhry,fr.hamidullah';

/** Attribution line shown under the reader (S14 content sourcing). */
export const QURAN_ATTRIBUTION =
  'Uthmani text with Sahih International (EN), Fateh Muhammad Jalandhry (UR) and Muhammad Hamidullah (FR) meanings, via the free AlQuran Cloud API.';

/** One resolved verse. */
export interface ResolvedAyah {
  /** Verse number within the surah (1-based). */
  ayahNum: number;
  /** Arabic Uthmani text. */
  arabic: string;
  /** English translation. */
  en: string;
  /** Urdu translation. */
  ur: string;
  /** French translation. */
  fr: string;
}

/** Fetch result for one surah. */
export interface FullSurah {
  num: number;
  /** 'cache' when served from IndexedDB, 'network' when freshly fetched. */
  source: 'cache' | 'network';
  ayahs: ResolvedAyah[];
}

interface ApiAyah {
  numberInSurah?: number;
  text?: string;
}

interface ApiEdition {
  ayahs?: ApiAyah[];
}

interface ApiResponse {
  code?: number;
  data?: ApiEdition[];
}

/**
 * Reads a fully cached surah from IndexedDB.
 * @param num - Surah number 1-114.
 * @returns The surah when every verse is cached, otherwise null.
 */
export async function getCachedSurah(num: number): Promise<FullSurah | null> {
  try {
    const rows = await getDb()
      .quranCache.where('surahNum')
      .equals(num)
      .sortBy('ayahNum');
    const expected = getSurahInfo(num).ayahCount;
    if (rows.length < expected) return null;
    return {
      num,
      source: 'cache',
      ayahs: rows.slice(0, expected).map((row: QuranCacheRow) => ({
        ayahNum: row.ayahNum,
        arabic: row.arabic,
        en: row.translationEN,
        ur: row.translationUR,
        fr: row.translationFR,
      })),
    };
  } catch {
    return null;
  }
}

/**
 * Whether a surah is complete in the local cache (no fetch needed).
 * @param num - Surah number 1-114.
 * @returns True when all verses are stored.
 */
export async function isSurahCached(num: number): Promise<boolean> {
  try {
    const count = await getDb().quranCache.where('surahNum').equals(num).count();
    return count >= getSurahInfo(num).ayahCount;
  } catch {
    return false;
  }
}

/**
 * Fetches one surah (Arabic + three translations) in a single request
 * and stores every verse permanently.
 * @param num - Surah number 1-114.
 * @returns The surah, or null when offline/unavailable/invalid.
 */
export async function fetchFullSurah(num: number): Promise<FullSurah | null> {
  const cached = await getCachedSurah(num);
  if (cached) return cached;
  if (!isOnline()) return null;
  const response = await requestSurah(num);
  if (!response) return null;
  await storeSurah(num, response);
  return getCachedSurah(num) ?? mapResponse(num, response);
}

/**
 * Performs the network request with a timeout.
 * @param num - Surah number.
 * @returns Parsed payload or null on any failure.
 */
async function requestSurah(num: number): Promise<ApiResponse | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), Math.max(API_FETCH_TIMEOUT_MS, 12000));
  try {
    const res = await fetch(`${API_BASE}/surah/${num}/editions/${QURAN_EDITIONS}`, {
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const body = (await res.json()) as ApiResponse;
    return body.code === 200 && Array.isArray(body.data) && body.data.length >= 4 ? body : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Persists all verses of one surah to the quranCache table.
 * @param num - Surah number.
 * @param body - Validated API payload.
 */
async function storeSurah(num: number, body: ApiResponse): Promise<void> {
  const editions = body.data as ApiEdition[];
  const arabic = editions[0]?.ayahs ?? [];
  const en = editions[1]?.ayahs ?? [];
  const ur = editions[2]?.ayahs ?? [];
  const fr = editions[3]?.ayahs ?? [];
  const rows: QuranCacheRow[] = arabic.map((ayah, i) => ({
    surahNum: num,
    ayahNum: ayah.numberInSurah ?? i + 1,
    arabic: ayah.text ?? '',
    translationEN: en[i]?.text ?? '',
    translationUR: ur[i]?.text ?? '',
    translationFR: fr[i]?.text ?? '',
  }));
  try {
    await getDb().quranCache.bulkPut(rows);
  } catch {
    // Cache write failed; the in-memory copy still renders this session.
  }
}

/**
 * Maps a validated payload without relying on the cache write.
 * @param num - Surah number.
 * @param body - Validated API payload.
 * @returns In-memory surah.
 */
function mapResponse(num: number, body: ApiResponse): FullSurah | null {
  const editions = body.data as ApiEdition[];
  const arabic = editions[0]?.ayahs ?? [];
  if (arabic.length === 0) return null;
  return {
    num,
    source: 'network',
    ayahs: arabic.map((ayah, i) => ({
      ayahNum: ayah.numberInSurah ?? i + 1,
      arabic: ayah.text ?? '',
      en: editions[1]?.ayahs?.[i]?.text ?? '',
      ur: editions[2]?.ayahs?.[i]?.text ?? '',
      fr: editions[3]?.ayahs?.[i]?.text ?? '',
    })),
  };
}
