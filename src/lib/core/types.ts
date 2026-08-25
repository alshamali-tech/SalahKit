/**
 * SalahKit core domain types.
 * Pure TypeScript — no framework imports allowed in this layer.
 */

/** Supported prayer-time calculation method identifiers. */
export type CalcMethodId = 'MWL' | 'ISNA' | 'Egypt' | 'Karachi' | 'UmmAlQura';

/** Juristic method for the Asr prayer shadow factor. */
export type Madhab = 'shafi' | 'hanafi';

/** The six daily solar/prayer events computed by the engine. */
export type PrayerName = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

/** A geographic coordinate pair in decimal degrees (WGS84). */
export interface GeoPoint {
  /** Latitude in degrees, -90 (south) to 90 (north). */
  latitude: number;
  /** Longitude in degrees, -180 (west) to 180 (east). */
  longitude: number;
}

/** A supported city with fixed coordinates. */
export interface City extends GeoPoint {
  /** Stable kebab-case identifier, e.g. "makkah". */
  id: string;
  /** Display name, e.g. "Makkah". */
  name: string;
  /** Country name, e.g. "Saudi Arabia". */
  country: string;
}

/** Definition of a calculation method preset. */
export interface CalcMethod {
  /** Method identifier. */
  id: CalcMethodId;
  /** Human-readable name. */
  name: string;
  /** Fajr twilight angle in degrees below the horizon. */
  fajrAngle: number;
  /** Isha twilight angle in degrees below the horizon (ignored when ishaIntervalMin is set). */
  ishaAngle: number;
  /** Optional fixed interval in minutes after Maghrib for Isha (Umm al-Qura style). */
  ishaIntervalMin?: number;
}

/** Result of a prayer-time computation for one local calendar date. */
export interface PrayerTimesResult {
  /** The local calendar date the times belong to. */
  dateISO: string;
  /** Latitude used for the computation. */
  latitude: number;
  /** Longitude used for the computation. */
  longitude: number;
  /** Calculation method used. */
  method: CalcMethodId;
  /** Madhab used for the Asr shadow factor. */
  madhab: Madhab;
  /** Absolute Date (UTC instant) for each prayer event, keyed by name. */
  times: Record<PrayerName, Date>;
}

/** A date in the Hijri (Islamic) calendar. */
export interface HijriDate {
  /** Hijri year (1 = 622 CE). */
  year: number;
  /** Month number, 1 (Muharram) to 12 (Dhul-Hijjah). */
  month: number;
  /** Day of month, 1 to 30. */
  day: number;
}

/** Which Hijri calendar variant a conversion used. */
export type HijriCalendar = 'tabular' | 'ummAlQura';

/** Numeric inputs for a Zakat computation (currency-agnostic). */
export interface ZakatInput {
  /** Gold holdings in grams. */
  goldGrams: number;
  /** Silver holdings in grams. */
  silverGrams: number;
  /** Cash and bank balances. */
  cash: number;
  /** Stocks, funds, crypto and other investments at market value. */
  investments: number;
  /** Other zakatable assets (business inventory, rent due, etc.). */
  otherAssets: number;
  /** Immediate debts and liabilities to subtract. */
  debts: number;
  /** Current market price of gold per gram, in the chosen currency. */
  goldPricePerGram: number;
  /** Current market price of silver per gram, in the chosen currency. */
  silverPricePerGram: number;
}

/** Result of a Zakat computation. */
export interface ZakatResult {
  /** Gross value of all zakatable assets. */
  totalAssets: number;
  /** totalAssets minus debts. */
  netAssets: number;
  /** Value of the gold nisab threshold (87.48 g). */
  goldNisabValue: number;
  /** Value of the silver nisab threshold (612.36 g). */
  silverNisabValue: number;
  /** True when netAssets reach the (silver) nisab. */
  nisabMet: boolean;
  /** Zakat due: 2.5% of netAssets when nisab is met, else 0. */
  zakatDue: number;
}

/** A supplication (dua) or remembrance (dhikr). */
export interface Dua {
  /** Stable identifier. */
  id: string;
  /** Category for filtering. */
  category: DuaCategory;
  /** Arabic text. */
  arabic: string;
  /** Latin transliteration. */
  transliteration: string;
  /** English translation. */
  translation: string;
  /** Hadith/classical source reference. */
  source: string;
  /** Suggested repetition count, when traditional. */
  repeat?: number;
}

/** Dua categories used by the duas dataset and UI. */
export type DuaCategory =
  | 'morning'
  | 'evening'
  | 'salah'
  | 'quran'
  | 'prophetic'
  | 'home'
  | 'daily'
  | 'travel'
  | 'nature'
  | 'hardship'
  | 'sleep';

/** One of the 99 Names of Allah. */
export interface DivineName {
  /** Ordinal position 1-99. */
  n: number;
  /** Arabic text with diacritics. */
  arabic: string;
  /** Latin transliteration. */
  transliteration: string;
  /** Concise English meaning. */
  meaning: string;
}

/** Supported translation languages for Quran verses. */
export type TranslationLang = 'en' | 'ur' | 'fr';

/** Metadata for a surah available in the local dataset. */
export interface SurahMeta {
  /** Surah number in the Mushaf (1-114). */
  num: number;
  /** Arabic name. */
  nameArabic: string;
  /** Transliterated name. */
  name: string;
  /** English meaning of the name. */
  meaning: string;
  /** Number of verses in the full surah. */
  ayahCount: number;
  /** Place of revelation. */
  revelation: 'Makkan' | 'Madanan';
}

/** A single Quran verse with three translations. */
export interface Ayah {
  /** Surah number. */
  surah: number;
  /** Ayah number within the surah. */
  ayah: number;
  /** Arabic text (Uthmani-style orthography). */
  arabic: string;
  /** English translation. */
  en: string;
  /** Urdu translation. */
  ur: string;
  /** French translation. */
  fr: string;
}

/** Theme modes supported by the app. */
export type ThemeMode = 'light' | 'dark';
