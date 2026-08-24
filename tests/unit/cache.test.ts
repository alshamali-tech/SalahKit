import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Dexie from 'dexie';
import 'fake-indexeddb/auto';
import { DB_NAME } from '../../src/lib/core/constants';
import { getDb, resetDbInstance } from '../../src/lib/db/db';
import { evictExpired, getCached, makeCacheKey, setCached } from '../../src/lib/db/cache';

async function wipe(): Promise<void> {
  getDb().close();
  await Dexie.delete(DB_NAME);
  resetDbInstance();
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

beforeEach(() => wipe());
afterEach(() => wipe());

describe('makeCacheKey', () => {
  it('is stable for identical inputs', () => {
    const a = makeCacheKey('aladhan', 'timings', 'https://api.aladhan.com/v1/timings?x=1');
    const b = makeCacheKey('aladhan', 'timings', 'https://api.aladhan.com/v1/timings?x=1');
    expect(a).toBe(b);
  });

  it('differs for different payloads and keeps a readable prefix', () => {
    const a = makeCacheKey('aladhan', 'gToH', '11-03-2024');
    const b = makeCacheKey('aladhan', 'gToH', '12-03-2024');
    expect(a).not.toBe(b);
    expect(a.startsWith('aladhan:gToH:')).toBe(true);
  });
});

describe('getCached / setCached', () => {
  it('round-trips JSON payloads', async () => {
    await setCached('k1', { fajr: '05:12' }, 60000);
    expect(await getCached<{ fajr: string }>('k1')).toEqual({ fajr: '05:12' });
  });

  it('returns null for unknown keys', async () => {
    expect(await getCached('missing')).toBeNull();
  });

  it('expires entries past their TTL and evicts them', async () => {
    await setCached('short', { a: 1 }, 5);
    await setCached('long', { b: 2 }, 60000);
    await sleep(25);
    expect(await getCached('short')).toBeNull();
    expect(await getCached('long')).toEqual({ b: 2 });
  });
});

describe('evictExpired', () => {
  it('removes stale rows and reports the count', async () => {
    await setCached('stale1', 1, 1);
    await setCached('stale2', 2, 1);
    await setCached('fresh', 3, 60000);
    await sleep(20);
    expect(await evictExpired()).toBe(2);
    expect(await getDb().extCache.count()).toBe(1);
  });
});
