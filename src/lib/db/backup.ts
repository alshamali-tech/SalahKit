/**
 * Backup & restore (S3: db/backup.ts). JSON export of every table,
 * validated import with merge semantics.
 */
import { getDb } from './db';
import { REQUIRED_BACKUP_TABLES } from './schema';
import { DB_NAME, DB_VERSION } from '../core/constants';
import { uuid } from '../utils/uuid';
import type { BackupFile, DuaFavoriteRow } from '../../types';

/** Table keys that every valid backup must contain (v1-compatible). */
const BACKUP_TABLE_KEYS = REQUIRED_BACKUP_TABLES as unknown as (keyof BackupFile['tables'])[];

/**
 * Exports every table to a JSON string.
 * @returns Serialized BackupFile.
 */
export async function exportBackup(): Promise<string> {
  const db = getDb();
  const backup: BackupFile = {
    app: DB_NAME,
    version: DB_VERSION,
    exportedAt: new Date().toISOString(),
    tables: {
      settings: await db.settings.toArray(),
      prayerLog: await db.prayerLog.toArray(),
      tasbih: await db.tasbih.toArray(),
      zakatRecords: await db.zakatRecords.toArray(),
      quranCache: await db.quranCache.toArray(),
      extCache: await db.extCache.toArray(),
      userFlags: await db.userFlags.toArray(),
      duaFavorites: await db.duaFavorites.toArray(),
      hifzProgress: await db.hifzProgress.toArray(),
    },
  };
  return JSON.stringify(backup, null, 2);
}

/**
 * Validates a parsed backup object.
 * @param raw - Parsed JSON value.
 * @returns True when the shape matches a SalahKit backup.
 */
export function isValidBackup(raw: unknown): raw is BackupFile {
  if (typeof raw !== 'object' || raw === null) return false;
  const candidate = raw as Record<string, unknown>;
  if (candidate.app !== DB_NAME || typeof candidate.version !== 'number') return false;
  const tables = candidate.tables as Record<string, unknown> | undefined;
  if (typeof tables !== 'object' || tables === null) return false;
  return BACKUP_TABLE_KEYS.every((key) => Array.isArray(tables[key]));
}

/** Ensures every row in a table has a string primary key.
 * @param rows - Raw rows from a backup.
 * @returns Rows with id (or key) guaranteed.
 */
function ensureKeys<T extends { id?: unknown }>(rows: T[]): T[] {
  return rows.map((row) =>
    typeof row.id === 'string' && row.id.length > 0 ? row : { ...row, id: uuid() }
  );
}

/**
 * Merges a typed table's rows via bulk upsert.
 * @param table - Dexie table to write to.
 * @param rows - Rows to merge (keys auto-filled when missing).
 * @returns Number of rows written.
 */
async function mergeTable<T extends { id?: unknown }, K>(
  table: { bulkPut: (items: T[]) => Promise<K> },
  rows: T[]
): Promise<number> {
  const safe = ensureKeys(rows);
  await table.bulkPut(safe);
  return safe.length;
}

/**
 * Validates and merges a backup into the database (bulk upsert).
 * @param json - Serialized BackupFile from exportBackup.
 * @returns Number of rows merged across all tables.
 * @throws Error when the JSON is invalid or not a SalahKit backup.
 */
export async function importBackup(json: string): Promise<{ merged: number }> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('SalahKit: backup file is not valid JSON.');
  }
  if (!isValidBackup(parsed)) {
    throw new Error('SalahKit: file is not a valid SalahKit backup.');
  }
  const db = getDb();
  let merged = 0;
  const favorites: DuaFavoriteRow[] = (parsed.tables.duaFavorites ?? []).filter(
    (row) => typeof row.duaId === 'string' && row.duaId.length > 0
  );
  const hifzRows = (parsed.tables.hifzProgress ?? []).filter(
    (row) => typeof row.id === 'string' && typeof row.surahNum === 'number'
  );
  await db.transaction(
    'rw',
    [db.settings, db.prayerLog, db.tasbih, db.zakatRecords, db.userFlags, db.duaFavorites, db.hifzProgress],
    async () => {
      merged += await mergeTable(db.settings, parsed.tables.settings);
      merged += await mergeTable(db.prayerLog, parsed.tables.prayerLog);
      merged += await mergeTable(db.tasbih, parsed.tables.tasbih);
      merged += await mergeTable(db.zakatRecords, parsed.tables.zakatRecords);
      merged += await mergeTable(db.userFlags, parsed.tables.userFlags);
      if (favorites.length > 0) {
        await db.duaFavorites.bulkPut(favorites);
        merged += favorites.length;
      }
      if (hifzRows.length > 0) {
        await db.hifzProgress.bulkPut(hifzRows);
        merged += hifzRows.length;
      }
    }
  );
  return { merged };
}
