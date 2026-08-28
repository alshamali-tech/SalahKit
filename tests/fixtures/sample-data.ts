/**
 * Minimal deterministic fixtures for unit/integration tests
 * (Blueprint: tests/fixtures/sample-data.ts). Pure data, no framework.
 */
import type { PrayerLogRow, TasbihRow, ZakatRecordRow } from '../../src/types';

/** A known city used across prayer/qibla tests (Makkah). */
export const MAKKAH = {
  id: 'makkah',
  latitude: 21.4225,
  longitude: 39.8262,
} as const;

/** A distant city for bearing/distance assertions (London). */
export const LONDON = {
  id: 'london',
  latitude: 51.5074,
  longitude: -0.1278,
} as const;

/** A sample prayer-log row. */
export function samplePrayerLog(dateISO: string): PrayerLogRow {
  return {
    id: `log-${dateISO}`,
    dateISO,
    fajr: true,
    dhuhr: true,
    asr: false,
    maghrib: true,
    isha: false,
    note: '',
  };
}

/** A sample tasbih row. */
export function sampleTasbih(count: number): TasbihRow {
  return {
    id: `tasbih-${count}-${Date.now()}`,
    timestamp: Date.now(),
    dhikrType: 'subhanallah',
    count,
  };
}

/** A sample zakat record. */
export function sampleZakat(zakatDue: number): ZakatRecordRow {
  return {
    id: `zakat-${zakatDue}-${Date.now()}`,
    dateISO: '2026-01-15',
    goldG: 0,
    silverG: 0,
    cash: zakatDue * 40,
    investments: 0,
    debts: 0,
    zakatDue,
  };
}

/** A well-formed Gregorian date known to convert cleanly to Hijri. */
export const KNOWN_GREGORIAN = { year: 2024, month: 3, day: 11 };

/** Its expected Hijri equivalent (Umm al-Qura, 1 Ramadan 1445). */
export const KNOWN_HIJRI = { year: 1445, month: 9, day: 1 };
