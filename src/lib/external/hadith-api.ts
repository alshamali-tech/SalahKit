/**
 * Hadith streaming service (S5 external-data pattern).
 * The full Sahihayn live on the free, keyless fawazahmed0/hadith-api
 * CDN — nothing is bundled. Sections are fetched on demand, cached
 * 30 days in IndexedDB (extCache), soft rate-limited, and degrade to
 * the bundled highlights when offline.
 */
import { API_FETCH_TIMEOUT_MS, STORAGE_KEYS } from '../core/constants';
import { getCached, makeCacheKey, setCached } from '../db/cache';
import { isOnline } from '../utils/offline';
import { getJSON, setJSON } from '../utils/storage';

/** 30-day TTL: hadith text is immutable. */
const HADITH_TTL_MS = 30 * 24 * 60 * 60 * 1000;
/** Soft daily budget (the CDN is keyless; this guards against loops). */
const HADITH_MAX_CALLS_PER_DAY = 120;

const CDN = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1';

/** A browsable collection. */
export interface HadithCollection {
  /** Stable id, used in cache keys + favorites. */
  id: 'bukhari' | 'muslim';
  /** English name. */
  name: string;
  /** Arabic name. */
  nameAr: string;
  /** Arabic edition code on the CDN. */
  arEdition: string;
  /** English edition code on the CDN. */
  enEdition: string;
  /** Number of sections (books) in the collection. */
  sections: number;
}

/** The two Sahih collections. */
export const HADITH_COLLECTIONS: readonly HadithCollection[] = [
  {
    id: 'bukhari', name: 'Sahih al-Bukhari', nameAr: 'صحيح البخاري',
    arEdition: 'ara-bukhari', enEdition: 'eng-bukhari', sections: 97,
  },
  {
    id: 'muslim', name: 'Sahih Muslim', nameAr: 'صحيح مسلم',
    arEdition: 'ara-muslim', enEdition: 'eng-muslim', sections: 56,
  },
];

/** Section metadata (title + hadith range). */
export interface HadithSectionMeta {
  section: number;
  title: string;
  titleAr: string;
  first: number;
  last: number;
}

/** One hadith as rendered by the library. */
export interface RemoteHadith {
  /** In-book number. */
  num: number;
  arabic: string;
  english: string;
  /** Grading, e.g. "Sahih". */
  grade: string;
  /** Global stable id for favorites: `${collection}:${num}`. */
  id: string;
}

/** Checks and consumes one unit of the daily hadith budget. */
function consumeBudget(): boolean {
  const today = new Date().toISOString().slice(0, 10);
  const budget = getJSON<{ date: string; count: number }>(
    STORAGE_KEYS.hadithCallCounts ?? 'salahkit:hadith-calls',
    { date: today, count: 0 }
  );
  if (budget.date !== today) {
    setJSON(STORAGE_KEYS.hadithCallCounts ?? 'salahkit:hadith-calls', { date: today, count: 1 });
    return true;
  }
  if (budget.count >= HADITH_MAX_CALLS_PER_DAY) return false;
  setJSON(STORAGE_KEYS.hadithCallCounts ?? 'salahkit:hadith-calls', { date: today, count: budget.count + 1 });
  return true;
}

/** Timeout-guarded JSON fetch; null on any failure. */
async function fetchJson<T>(url: string): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

interface RawSection {
  metadata?: {
    name?: { ar?: string; eng?: string };
    section?: { hadithnumber_first?: number; hadithnumber_last?: number };
  };
  hadiths?: {
    hadithnumber?: number;
    text?: string;
    grades?: { grade?: string }[];
  }[];
}

/**
 * Fetches one section (both languages), cache-first.
 * @param coll - Collection.
 * @param section - 1-based section number.
 * @returns Metadata + hadiths, or null when unavailable offline.
 */
export async function fetchHadithSection(
  coll: HadithCollection,
  section: number
): Promise<{ meta: HadithSectionMeta; hadiths: RemoteHadith[] } | null> {
  const key = makeCacheKey('hadith', coll.id, `section-${section}`);
  try {
    const cached = await getCached<{ meta: HadithSectionMeta; hadiths: RemoteHadith[] }>(key);
    if (cached) return cached;
  } catch {
    // Cache unreadable; try the network.
  }
  if (!isOnline() || !consumeBudget()) return null;
  const [ar, en] = await Promise.all([
    fetchJson<RawSection>(`${CDN}/editions/${coll.arEdition}/sections/${section}.json`),
    fetchJson<RawSection>(`${CDN}/editions/${coll.enEdition}/sections/${section}.json`),
  ]);
  if (!ar?.hadiths) return null;
  const enByNum = new Map<number, string>();
  (en?.hadiths ?? []).forEach((h) => {
    if (typeof h.hadithnumber === 'number' && h.text) enByNum.set(h.hadithnumber, h.text);
  });
  const meta: HadithSectionMeta = {
    section,
    title: ar.metadata?.name?.eng ?? en?.metadata?.name?.eng ?? `Section ${section}`,
    titleAr: ar.metadata?.name?.ar ?? coll.nameAr,
    first: ar.metadata?.section?.hadithnumber_first ?? 0,
    last: ar.metadata?.section?.hadithnumber_last ?? 0,
  };
  const hadiths: RemoteHadith[] = ar.hadiths
    .filter((h) => typeof h.hadithnumber === 'number')
    .map((h) => ({
      num: h.hadithnumber as number,
      arabic: h.text ?? '',
      english: enByNum.get(h.hadithnumber as number) ?? '',
      grade: h.grades?.[0]?.grade ?? '',
      id: `${coll.id}:${h.hadithnumber}`,
    }));
  const result = { meta, hadiths };
  try {
    await setCached(key, result, HADITH_TTL_MS);
  } catch {
    // Served for this session even if persistence fails.
  }
  return result;
}

/**
 * Reads a cached section without any network access.
 * @param coll - Collection.
 * @param section - Section number.
 * @returns Cached section or null.
 */
export async function getCachedSection(
  coll: HadithCollection,
  section: number
): Promise<{ meta: HadithSectionMeta; hadiths: RemoteHadith[] } | null> {
  try {
    return await getCached(makeCacheKey('hadith', coll.id, `section-${section}`));
  } catch {
    return null;
  }
}

/**
 * Resolves section titles for a range, filling from cache first and
 * fetching the rest in small batches. Returns as each batch lands.
 * @param coll - Collection.
 * @param sections - Section numbers to resolve.
 * @param onBatch - Called with resolved metadata as batches complete.
 * @returns Resolves when every section is attempted.
 */
export async function resolveSectionTitles(
  coll: HadithCollection,
  sections: readonly number[],
  onBatch: (metas: HadithSectionMeta[]) => void
): Promise<void> {
  for (let i = 0; i < sections.length; i += 4) {
    const batch = sections.slice(i, i + 4);
    const metas = await Promise.all(
      batch.map(async (n) => {
        const result = await fetchHadithSection(coll, n);
        return result?.meta ?? null;
      })
    );
    onBatch(metas.filter((m): m is HadithSectionMeta => m !== null));
  }
}
