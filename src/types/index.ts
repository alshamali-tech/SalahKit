/**
 * Shared application types, including IndexedDB row shapes (S4 data model).
 */
import type { CalcMethodId, Madhab, ThemeMode } from '../lib/core/types';

export * from '../lib/core/types';

/** Revelation place of a surah. */
export type Revelation = 'Makkan' | 'Madinan';

/** Tool modules available in the app shell. */
export type ModuleId =
  | 'prayer'
  | 'qibla'
  | 'hijri'
  | 'quran'
  | 'dhikr'
  | 'zakat'
  | 'duas'
  | 'names'
  | 'tracker'
  | 'calendar'
  | 'privacy'
  | 'terms';

/** Settings table row (S4). */
export interface SettingsRow {
  /** Primary key (UUID). */
  id: string;
  /** Selected calculation method id. */
  calcMethod: CalcMethodId;
  /** Observer latitude. */
  latitude: number;
  /** Observer longitude. */
  longitude: number;
  /** Selected city id from the static geo list. */
  city: string;
  /** UI theme. */
  theme: ThemeMode;
  /** Madhab for Asr. */
  madhab: Madhab;
  /** Whether the user wants (future) notifications. */
  notifPref: boolean;
}

/** Prayer tracker row: one per logged day (S4). */
export interface PrayerLogRow {
  id: string;
  /** Local calendar date YYYY-MM-DD (indexed). */
  dateISO: string;
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  /** Optional free-text note. */
  note: string;
}

/** Tasbih session entry (S4). */
export interface TasbihRow {
  id: string;
  /** Epoch milliseconds (indexed). */
  timestamp: number;
  /** Dhikr phrase identifier. */
  dhikrType: string;
  /** Completed count. */
  count: number;
}

/** Zakat computation record (S4). */
export interface ZakatRecordRow {
  id: string;
  /** Local date the calculation was saved (indexed). */
  dateISO: string;
  goldG: number;
  silverG: number;
  cash: number;
  investments: number;
  debts: number;
  zakatDue: number;
}

/** Cached Quran verse row (S4), compound key [surahNum+ayahNum]. */
export interface QuranCacheRow {
  surahNum: number;
  ayahNum: number;
  arabic: string;
  translationEN: string;
  translationUR: string;
  translationFR: string;
}

/** External API cache row (S4). */
export interface ExtCacheRow {
  /** Stable key (URL hash). */
  key: string;
  /** Cached JSON payload. */
  data: unknown;
  /** Epoch ms when fetched. */
  fetchedAt: number;
  /** Time-to-live in milliseconds. */
  ttlMs: number;
}

/** User behavior flags for donation logic (S4). */
export interface UserFlagsRow {
  /** Singleton id 'flags'. */
  id: string;
  /** ISO datetime the user dismissed the donation prompt (7-day cooldown start). */
  donationDismissedAt: string | null;
  /** Number of tool uses since first launch. */
  useCount: number;
  /** YYYY-MM-DD of the last donation toast shown (max 1/day). */
  lastToastDate: string | null;
}

/** Dua favorites row: one per favorited dua (schema v2). */
export interface DuaFavoriteRow {
  /** Dua id (primary key). */
  duaId: string;
  /** Epoch ms when favorited. */
  addedAt: number;
}

/** Backup file envelope produced by backup.ts. */
export interface BackupFile {
  /** Always the DB name, used for validation. */
  app: string;
  /** Backup format version. */
  version: number;
  /** ISO datetime of export. */
  exportedAt: string;
  /** All table contents. */
  tables: {
    settings: SettingsRow[];
    prayerLog: PrayerLogRow[];
    tasbih: TasbihRow[];
    zakatRecords: ZakatRecordRow[];
    quranCache: QuranCacheRow[];
    extCache: ExtCacheRow[];
    userFlags: UserFlagsRow[];
    /** Present in v2+ backups; absent in legacy v1 exports. */
    duaFavorites?: DuaFavoriteRow[];
  };
}
