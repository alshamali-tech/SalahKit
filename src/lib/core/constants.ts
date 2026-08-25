/**
 * SalahKit shared constants: enums (as const maps), magic numbers, keys.
 * Pure TypeScript — no framework imports allowed in this layer.
 */
import type { PrayerName } from './types';

/** Coordinates of the Kaaba in Masjid al-Haram, Makkah (WGS84). */
export const KAABA: Readonly<{ latitude: number; longitude: number }> = {
  latitude: 21.422487,
  longitude: 39.826206,
};

/** Gold nisab threshold in grams (equivalent of 20 dinars). */
export const GOLD_NISAB_GRAMS = 87.48;

/** Silver nisab threshold in grams (equivalent of 200 dirhams). */
export const SILVER_NISAB_GRAMS = 612.36;

/** Zakat rate: 2.5%. */
export const ZAKAT_RATE = 0.025;

/** Donation prompt: minimum tool uses before the first prompt (never on first visit). */
export const DONATION_MIN_USE_COUNT = 5;

/** Donation prompt cooldown in milliseconds (7 days). */
export const DONATION_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

/** External API: maximum calls per day per source (S5 rate limit). */
export const API_MAX_CALLS_PER_DAY = 3;

/** External API cache TTLs (S5). */
export const API_TTL_PRAYER_MS = 24 * 60 * 60 * 1000;
export const API_TTL_HIJRI_MS = 30 * 24 * 60 * 60 * 1000;
/** Declination drifts slowly; a month of cache is ample. */
export const DECLINATION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** Fetch timeout for external calls, in milliseconds. */
export const API_FETCH_TIMEOUT_MS = 6000;

/** IndexedDB database name and version.
 * v2 adds duaFavorites, v3 adds hifzProgress (additive; Dexie migrates
 * in place, legacy data untouched). */
export const DB_NAME = 'salahkit-db';
export const DB_VERSION = 3;

/** Hifz: interval (days) at which a chunk graduates to 'memorized'. */
export const HIFZ_GRADUATION_INTERVAL_DAYS = 30;

/** Hifz: hard ceiling for review intervals. */
export const HIFZ_MAX_INTERVAL_DAYS = 90;

/** localStorage / sessionStorage keys (single source of truth). */
export const STORAGE_KEYS = {
  theme: 'salahkit:theme',
  featureFlags: 'salahkit:features',
  apiCallCounts: 'salahkit:api-calls',
  declinationCallCounts: 'salahkit:declination-calls',
  donationSessionShown: 'salahkit:donation-session',
  settingsCache: 'salahkit:settings-cache',
} as const;

/** Ordered prayer names used across the app. */
export const PRAYER_ORDER: readonly PrayerName[] = [
  'fajr',
  'sunrise',
  'dhuhr',
  'asr',
  'maghrib',
  'isha',
] as const;

/** English display labels for each prayer event. */
export const PRAYER_LABELS: Record<PrayerName, string> = {
  fajr: 'Fajr',
  sunrise: 'Sunrise',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

/** Arabic display labels for each prayer event. */
export const PRAYER_LABELS_AR: Record<PrayerName, string> = {
  fajr: 'الفجر',
  sunrise: 'الشروق',
  dhuhr: 'الظهر',
  asr: 'العصر',
  maghrib: 'المغرب',
  isha: 'العشاء',
};

/** Hijri month names (1-12). */
export const HIJRI_MONTHS: readonly string[] = [
  'Muharram',
  'Safar',
  'Rabi al-Awwal',
  'Rabi al-Thani',
  'Jumada al-Awwal',
  'Jumada al-Thani',
  'Rajab',
  'Shaban',
  'Ramadan',
  'Shawwal',
  'Dhul-Qadah',
  'Dhul-Hijjah',
];

/** Arabic Hijri month names (1-12). */
export const HIJRI_MONTHS_AR: readonly string[] = [
  'محرم',
  'صفر',
  'ربيع الأول',
  'ربيع الثاني',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة',
];

/** Default Asr shadow factors per madhab. */
export const ASR_SHADOW_FACTOR: Readonly<Record<'shafi' | 'hanafi', number>> = {
  shafi: 1,
  hanafi: 2,
};

/** Solar depression angle (degrees) for sunrise/sunset, per IAU convention. */
export const SUNRISE_SUNSET_ANGLE = 0.833;

/** Minimum sensible countdown tick interval in ms. */
export const TICK_INTERVAL_MS = 1000;

/** Tasbih default target counts. */
export const TASBIH_TARGETS: readonly number[] = [33, 99, 100];

/** Maximum tasbih count accepted per entry. */
export const TASBIH_MAX_COUNT = 100000;
