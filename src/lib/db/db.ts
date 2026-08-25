/**
 * Database singleton and entity CRUD (S3: db/db.ts).
 * Optimistic-UI friendly: every call returns a Promise the caller can
 * await after already rendering local state.
 */
import { SalahKitDB } from './schema';
import { uuid } from '../utils/uuid';
import { toISODate, sanitizeCount } from '../core/validator';
import { DEFAULT_CITY_ID } from '../core/geo';
import type {
  PrayerLogRow,
  SettingsRow,
  TasbihRow,
  UserFlagsRow,
  ZakatRecordRow,
} from '../../types';

let instance: SalahKitDB | null = null;

/**
 * Returns the shared Dexie instance, creating it on first use.
 * @returns The SalahKit database.
 */
export function getDb(): SalahKitDB {
  if (!instance) instance = new SalahKitDB();
  return instance;
}

/** Drops the singleton reference (used after a full wipe). */
export function resetDbInstance(): void {
  instance = null;
}

/** Default settings applied on first launch. */
export const DEFAULT_SETTINGS: SettingsRow = {
  id: 'current',
  calcMethod: 'MWL',
  latitude: 21.4225,
  longitude: 39.8262,
  city: DEFAULT_CITY_ID,
  theme: 'light',
  madhab: 'shafi',
  notifPref: false,
};

/**
 * Loads settings, creating defaults on first launch.
 * @returns The persisted or default settings row.
 */
export async function getSettings(): Promise<SettingsRow> {
  const db = getDb();
  const existing = await db.settings.get(DEFAULT_SETTINGS.id);
  if (existing) return existing;
  await db.settings.put({ ...DEFAULT_SETTINGS });
  return { ...DEFAULT_SETTINGS };
}

/**
 * Persists a partial settings update.
 * @param patch - Fields to update.
 * @returns The merged settings row.
 */
export async function saveSettings(patch: Partial<SettingsRow>): Promise<SettingsRow> {
  const db = getDb();
  const current = await getSettings();
  const next: SettingsRow = { ...current, ...patch, id: current.id };
  await db.settings.put(next);
  return next;
}

/** Default user flags for first launch. */
export const DEFAULT_FLAGS: UserFlagsRow = {
  id: 'flags',
  donationDismissedAt: null,
  useCount: 0,
  lastToastDate: null,
};

/**
 * Loads user flags, creating defaults on first launch.
 * @returns The persisted or default flags row.
 */
export async function getFlags(): Promise<UserFlagsRow> {
  const db = getDb();
  const existing = await db.userFlags.get(DEFAULT_FLAGS.id);
  if (existing) return existing;
  await db.userFlags.put({ ...DEFAULT_FLAGS });
  return { ...DEFAULT_FLAGS };
}

/**
 * Persists a partial flags update.
 * @param patch - Fields to update.
 * @returns The merged flags row.
 */
export async function saveFlags(patch: Partial<UserFlagsRow>): Promise<UserFlagsRow> {
  const db = getDb();
  const current = await getFlags();
  const next: UserFlagsRow = { ...current, ...patch, id: current.id };
  await db.userFlags.put(next);
  return next;
}

/**
 * Loads the prayer log for a given date, if any.
 * @param dateISO - Local date YYYY-MM-DD.
 * @returns The log row or undefined.
 */
export async function getLogForDate(dateISO: string): Promise<PrayerLogRow | undefined> {
  return getDb().prayerLog.where('dateISO').equals(dateISO).first();
}

/**
 * Creates or updates the prayer log for a date (upsert by dateISO).
 * @param dateISO - Local date YYYY-MM-DD.
 * @param patch - Prayer toggles and/or note.
 * @returns The saved row.
 */
export async function upsertPrayerLog(
  dateISO: string,
  patch: Partial<Omit<PrayerLogRow, 'id' | 'dateISO'>>
): Promise<PrayerLogRow> {
  const db = getDb();
  const existing = await getLogForDate(dateISO);
  const base: PrayerLogRow = existing ?? {
    id: uuid(),
    dateISO,
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
    note: '',
  };
  const next: PrayerLogRow = { ...base, ...patch, dateISO };
  await db.prayerLog.put(next);
  return next;
}

/**
 * Lists all prayer logs, newest date first.
 * @returns Array of prayer log rows.
 */
export async function listPrayerLogs(): Promise<PrayerLogRow[]> {
  return getDb().prayerLog.orderBy('dateISO').reverse().toArray();
}

/**
 * Records a completed tasbih session.
 * @param dhikrType - Dhikr identifier.
 * @param count - Completed count (sanitized to a safe integer).
 * @returns The stored row.
 */
export async function addTasbih(dhikrType: string, count: number): Promise<TasbihRow> {
  const row: TasbihRow = {
    id: uuid(),
    timestamp: Date.now(),
    dhikrType,
    count: sanitizeCount(count),
  };
  await getDb().tasbih.add(row);
  return row;
}

/**
 * Sums all tasbih counts recorded today (local time).
 * @returns Total dhikr count for today.
 */
export async function sumTasbihToday(): Promise<number> {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const rows = await getDb().tasbih.where('timestamp').aboveOrEqual(start.getTime()).toArray();
  return rows.reduce((sum, r) => sum + r.count, 0);
}

/**
 * Saves a Zakat calculation record.
 * @param record - Record without id/dateISO (auto-filled).
 * @returns The stored row.
 */
export async function addZakatRecord(
  record: Omit<ZakatRecordRow, 'id' | 'dateISO'>
): Promise<ZakatRecordRow> {
  const row: ZakatRecordRow = { ...record, id: uuid(), dateISO: toISODate() };
  await getDb().zakatRecords.add(row);
  return row;
}

/**
 * Lists Zakat records, newest first.
 * @returns Array of Zakat records.
 */
export async function listZakatRecords(): Promise<ZakatRecordRow[]> {
  return getDb().zakatRecords.orderBy('dateISO').reverse().toArray();
}

/**
 * Deletes a Zakat record by id.
 * @param id - Record id.
 */
export async function deleteZakatRecord(id: string): Promise<void> {
  await getDb().zakatRecords.delete(id);
}

/**
 * Loads the set of favorited dua ids.
 * @returns Set of dua ids the user has favorited.
 */
export async function getFavoriteDuaIds(): Promise<Set<string>> {
  try {
    const rows = await getDb().duaFavorites.toArray();
    return new Set(rows.map((r) => r.duaId));
  } catch {
    return new Set();
  }
}

/**
 * Toggles a dua in the favorites list (optimistic-UI friendly).
 * @param duaId - Dua identifier.
 * @returns True when the dua is now favorited, false when removed.
 */
export async function toggleDuaFavorite(duaId: string): Promise<boolean> {
  const db = getDb();
  const existing = await db.duaFavorites.get(duaId);
  if (existing) {
    await db.duaFavorites.delete(duaId);
    return false;
  }
  await db.duaFavorites.put({ duaId, addedAt: Date.now() });
  return true;
}
