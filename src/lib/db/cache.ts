/**
 * External API cache layer (S3: db/cache.ts, S5 strategy).
 * TTL-based entries stored in the extCache IndexedDB table.
 */
import { getDb } from './db';
import type { ExtCacheRow } from '../../types';

/**
 * Builds a short stable cache key from parts (djb2 hash of the joined string).
 * @param parts - Key components, e.g. ['aladhan', 'timings', url].
 * @returns Key string like "aladhan:timings:9f3a21bc".
 */
export function makeCacheKey(...parts: string[]): string {
  const joined = parts.join('|');
  let hash = 5381;
  for (let i = 0; i < joined.length; i += 1) {
    hash = ((hash << 5) + hash + joined.charCodeAt(i)) | 0;
  }
  const hex = (hash >>> 0).toString(16).padStart(8, '0');
  const prefix = parts.slice(0, -1).join(':');
  return prefix ? `${prefix}:${hex}` : hex;
}

/**
 * Returns cached data when present and fresh, evicting stale entries.
 * @param key - Cache key from makeCacheKey.
 * @returns Cached payload or null when missing/expired.
 */
export async function getCached<T>(key: string): Promise<T | null> {
  const db = getDb();
  const row: ExtCacheRow | undefined = await db.extCache.get(key);
  if (!row) return null;
  const fresh = Date.now() - row.fetchedAt < row.ttlMs;
  if (!fresh) {
    await db.extCache.delete(key);
    return null;
  }
  return row.data as T;
}

/**
 * Stores a payload with a TTL.
 * @param key - Cache key.
 * @param data - JSON-serializable payload.
 * @param ttlMs - Time-to-live in milliseconds.
 */
export async function setCached(key: string, data: unknown, ttlMs: number): Promise<void> {
  const row: ExtCacheRow = { key, data, fetchedAt: Date.now(), ttlMs };
  await getDb().extCache.put(row);
}

/**
 * Removes all expired cache entries.
 * @returns Number of evicted rows.
 */
export async function evictExpired(): Promise<number> {
  const db = getDb();
  const now = Date.now();
  const all = await db.extCache.toArray();
  const stale = all.filter((row) => now - row.fetchedAt >= row.ttlMs);
  if (stale.length > 0) {
    await db.extCache.bulkDelete(stale.map((row) => row.key));
  }
  return stale.length;
}
