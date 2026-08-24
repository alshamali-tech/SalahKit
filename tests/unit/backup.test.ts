import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Dexie from 'dexie';
import 'fake-indexeddb/auto';
import { DB_NAME } from '../../src/lib/core/constants';
import { getDb, getSettings, resetDbInstance, saveSettings, upsertPrayerLog } from '../../src/lib/db/db';
import { exportBackup, importBackup, isValidBackup } from '../../src/lib/db/backup';

async function wipe(): Promise<void> {
  getDb().close();
  await Dexie.delete(DB_NAME);
  resetDbInstance();
}

beforeEach(() => wipe());
afterEach(() => wipe());

describe('exportBackup', () => {
  it('serializes every table with metadata', async () => {
    await saveSettings({ city: 'dubai' });
    const parsed = JSON.parse(await exportBackup()) as Record<string, unknown>;
    expect(parsed.app).toBe(DB_NAME);
    expect(typeof parsed.exportedAt).toBe('string');
    const tables = parsed.tables as Record<string, unknown[]>;
    expect(Array.isArray(tables.settings)).toBe(true);
    expect(Array.isArray(tables.prayerLog)).toBe(true);
    expect(Array.isArray(tables.tasbih)).toBe(true);
    expect(tables.settings.length).toBe(1);
  });
});

describe('isValidBackup', () => {
  it('accepts real backups and rejects impostors', async () => {
    const good = JSON.parse(await exportBackup()) as unknown;
    expect(isValidBackup(good)).toBe(true);
    expect(isValidBackup(null)).toBe(false);
    expect(isValidBackup({ app: DB_NAME, version: 1 })).toBe(false);
    expect(isValidBackup({ app: 'other-app', version: 1, tables: { settings: [] } })).toBe(false);
  });
});

describe('importBackup', () => {
  it('rejects malformed input', async () => {
    await expect(importBackup('this is not json')).rejects.toThrow(/not valid JSON/);
    await expect(importBackup('{"app":"nope"}')).rejects.toThrow(/not a valid SalahKit backup/);
  });

  it('restores rows after a full wipe (validate + merge)', async () => {
    await saveSettings({ city: 'istanbul', madhab: 'hanafi' });
    await upsertPrayerLog('2026-02-02', { fajr: true, isha: true });
    const json = await exportBackup();

    await wipe();
    expect((await getSettings()).city).toBe('makkah');

    const { merged } = await importBackup(json);
    expect(merged).toBeGreaterThanOrEqual(2);
    const settings = await getSettings();
    expect(settings.city).toBe('istanbul');
    expect(settings.madhab).toBe('hanafi');
    const log = await getDb().prayerLog.where('dateISO').equals('2026-02-02').first();
    expect(log?.fajr).toBe(true);
    expect(log?.isha).toBe(true);
  });
});
