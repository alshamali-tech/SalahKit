/**
 * Dexie database schema (S3: db/schema.ts, S4 data model).
 * All persistent SalahKit state lives in IndexedDB via this schema.
 */
import Dexie, { type Table } from 'dexie';
import { DB_NAME, DB_VERSION } from '../core/constants';
import type {
  DuaFavoriteRow,
  ExtCacheRow,
  HifzChunkRow,
  PrayerLogRow,
  QuranCacheRow,
  SettingsRow,
  TasbihRow,
  UserFlagsRow,
  ZakatRecordRow,
} from '../../types';

/** Table name constants (single source of truth). */
export const TABLE_NAMES = {
  settings: 'settings',
  prayerLog: 'prayerLog',
  tasbih: 'tasbih',
  zakatRecords: 'zakatRecords',
  quranCache: 'quranCache',
  extCache: 'extCache',
  userFlags: 'userFlags',
  duaFavorites: 'duaFavorites',
  hifzProgress: 'hifzProgress',
} as const;

/** Tables that must exist in every backup file (v1+). */
export const REQUIRED_BACKUP_TABLES = [
  'settings',
  'prayerLog',
  'tasbih',
  'zakatRecords',
  'quranCache',
  'extCache',
  'userFlags',
] as const;

/**
 * SalahKit IndexedDB schema.
 * Indexes follow S4: prayerLog.dateISO, tasbih.timestamp,
 * zakatRecords.dateISO, quranCache [surahNum+ayahNum], extCache.key.
 */
export class SalahKitDB extends Dexie {
  public settings!: Table<SettingsRow, string>;
  public prayerLog!: Table<PrayerLogRow, string>;
  public tasbih!: Table<TasbihRow, string>;
  public zakatRecords!: Table<ZakatRecordRow, string>;
  public quranCache!: Table<QuranCacheRow, [number, number]>;
  public extCache!: Table<ExtCacheRow, string>;
  public userFlags!: Table<UserFlagsRow, string>;
  public duaFavorites!: Table<DuaFavoriteRow, string>;
  public hifzProgress!: Table<HifzChunkRow, string>;

  /** Creates the schema definition. Called once by the db singleton.
   * Versions are declared explicitly so v1 databases upgrade in place
   * (v2 only adds the duaFavorites table). */
  public constructor() {
    super(DB_NAME);
    this.version(1).stores({
      [TABLE_NAMES.settings]: 'id',
      [TABLE_NAMES.prayerLog]: 'id, dateISO',
      [TABLE_NAMES.tasbih]: 'id, timestamp',
      [TABLE_NAMES.zakatRecords]: 'id, dateISO',
      [TABLE_NAMES.quranCache]: '[surahNum+ayahNum]',
      [TABLE_NAMES.extCache]: 'key',
      [TABLE_NAMES.userFlags]: 'id',
    });
    if (DB_VERSION >= 2) {
      this.version(2).stores({
        [TABLE_NAMES.duaFavorites]: 'duaId',
      });
    }
    if (DB_VERSION >= 3) {
      this.version(3).stores({
        [TABLE_NAMES.hifzProgress]: 'id, surahNum, dueISO, status',
      });
    }
  }
}
