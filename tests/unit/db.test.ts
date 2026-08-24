import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Dexie from 'dexie';
import 'fake-indexeddb/auto';
import { DB_NAME } from '../../src/lib/core/constants';
import {
  addTasbih,
  addZakatRecord,
  deleteZakatRecord,
  getDb,
  getFlags,
  getLogForDate,
  getSettings,
  listPrayerLogs,
  listZakatRecords,
  resetDbInstance,
  saveFlags,
  saveSettings,
  sumTasbihToday,
  upsertPrayerLog,
} from '../../src/lib/db/db';

async function wipe(): Promise<void> {
  getDb().close();
  await Dexie.delete(DB_NAME);
  resetDbInstance();
}

beforeEach(() => wipe());
afterEach(() => wipe());

describe('settings', () => {
  it('creates defaults on first launch', async () => {
    const settings = await getSettings();
    expect(settings.id).toBe('current');
    expect(settings.calcMethod).toBe('MWL');
    expect(settings.city).toBe('makkah');
  });

  it('merges partial updates and keeps the same row', async () => {
    await saveSettings({ city: 'istanbul', latitude: 41.0082, longitude: 28.9784 });
    const next = await saveSettings({ madhab: 'hanafi' });
    expect(next.city).toBe('istanbul');
    expect(next.madhab).toBe('hanafi');
    expect(await getDb().settings.count()).toBe(1);
  });
});

describe('flags', () => {
  it('creates zeroed flags and merges updates', async () => {
    const flags = await getFlags();
    expect(flags.useCount).toBe(0);
    expect(flags.donationDismissedAt).toBeNull();
    const next = await saveFlags({ useCount: 5 });
    expect(next.useCount).toBe(5);
    expect(await getDb().userFlags.count()).toBe(1);
  });
});

describe('prayerLog', () => {
  it('upserts one row per date', async () => {
    const first = await upsertPrayerLog('2026-03-20', { fajr: true });
    const second = await upsertPrayerLog('2026-03-20', { dhuhr: true });
    expect(second.id).toBe(first.id);
    expect(second.fajr).toBe(true);
    expect(second.dhuhr).toBe(true);
    expect(await getDb().prayerLog.count()).toBe(1);
  });

  it('fetches by date and lists newest first', async () => {
    await upsertPrayerLog('2026-03-19', { fajr: true });
    await upsertPrayerLog('2026-03-21', { isha: true });
    expect((await getLogForDate('2026-03-21'))?.isha).toBe(true);
    expect(await getLogForDate('2000-01-01')).toBeUndefined();
    const logs = await listPrayerLogs();
    expect(logs[0]?.dateISO).toBe('2026-03-21');
    expect(logs[1]?.dateISO).toBe('2026-03-19');
  });
});

describe('tasbih', () => {
  it('stores sanitized counts and sums today', async () => {
    await addTasbih('subhanallah', 33);
    await addTasbih('tahlil', 67);
    await addTasbih('bad', -5);
    expect(await sumTasbihToday()).toBe(100);
  });
});

describe('zakatRecords', () => {
  it('adds, lists and deletes records', async () => {
    const row = await addZakatRecord({
      goldG: 20,
      silverG: 0,
      cash: 5000,
      investments: 0,
      debts: 0,
      zakatDue: 125,
    });
    expect(row.id.length).toBeGreaterThan(10);
    expect(row.dateISO).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect((await listZakatRecords()).length).toBe(1);
    await deleteZakatRecord(row.id);
    expect((await listZakatRecords()).length).toBe(0);
  });
});
