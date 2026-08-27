/**
 * Internationalisation core (S16). The UI chrome, navigation, landing
 * page and common actions are localised; Quran text is ALWAYS Arabic
 * and is never translated. Right-to-left locales flip <html dir>.
 *
 * Only English and Arabic are offered. The English dictionary ships
 * in the initial bundle; Arabic is code-split and fetched the moment
 * it is chosen (or restored from storage).
 */
import { en } from './locales/en';
import type { TranslationKeys, LocaleId } from './keys';

export type { TranslationKeys, LocaleId };

/** Locale metadata (names + direction); the dictionary is resolved lazily. */
export interface LocaleInfo {
  id: LocaleId;
  /** Native name shown in the switcher. */
  native: string;
  /** English name. */
  english: string;
  /** BCP-47 tag for <html lang>. */
  lang: string;
  /** Right-to-left script. */
  rtl: boolean;
  /** Dictionary of UI strings (English until the locale finishes loading). */
  dict: TranslationKeys;
}

interface LocaleMeta {
  id: LocaleId;
  native: string;
  english: string;
  lang: string;
  rtl: boolean;
}

/** All supported locales, in switcher order. */
export const LOCALES: readonly LocaleMeta[] = [
  { id: 'en', native: 'English', english: 'English', lang: 'en', rtl: false },
  { id: 'ar', native: 'العربية', english: 'Arabic', lang: 'ar', rtl: true },
  { id: 'ur', native: 'اردو', english: 'Urdu', lang: 'ur', rtl: true },
  { id: 'fr', native: 'Français', english: 'French', lang: 'fr', rtl: false },
  { id: 'tr', native: 'Türkçe', english: 'Turkish', lang: 'tr', rtl: false },
  { id: 'id', native: 'Bahasa Indonesia', english: 'Indonesian', lang: 'id', rtl: false },
];

/** Default interface language. */
export const DEFAULT_LOCALE: LocaleId = 'en';

/** localStorage key holding the chosen interface locale. */
export const STORAGE_LOCALE_KEY = 'salahkit:locale';

/** Loaded dictionaries; every locale starts on English and upgrades. */
const dicts: Partial<Record<LocaleId, TranslationKeys>> = { en };

/** Code-split loaders — one chunk per non-English language. */
const loaders: Partial<Record<LocaleId, () => Promise<Record<string, TranslationKeys>>>> = {
  ar: () => import('./locales/ar'),
  ur: () => import('./locales/ur'),
  fr: () => import('./locales/fr'),
  tr: () => import('./locales/tr'),
  id: () => import('./locales/id'),
};

const dictListeners = new Set<() => void>();

/** Subscribes to dictionary-load events (for reactive hooks). */
export function onDictLoaded(cb: () => void): () => void {
  dictListeners.add(cb);
  return () => {
    dictListeners.delete(cb);
  };
}

/**
 * Ensures a locale's dictionary is loaded (idempotent).
 * @param id - Locale id.
 * @returns Resolves when the dictionary is available for rendering.
 */
export function ensureLocale(id: LocaleId): Promise<void> {
  if (dicts[id]) return Promise.resolve();
  const load = loaders[id];
  if (!load) {
    dicts[id] = en;
    return Promise.resolve();
  }
  return load()
    .then((mod) => {
      // Each locale module has a single named export matching its id.
      dicts[id] = mod[id] ?? en;
    })
    .catch(() => {
      dicts[id] = en;
    })
    .then(() => {
      dictListeners.forEach((l) => l());
    });
}

/**
 * Resolves a locale id, falling back to English for unknown values.
 * @param id - Candidate locale id.
 * @returns A valid LocaleInfo (dictionary may still be loading).
 */
export function getLocale(id: string): LocaleInfo {
  const meta = LOCALES.find((l) => l.id === id) ?? (LOCALES[0] as LocaleMeta);
  return { ...meta, dict: dicts[meta.id] ?? en };
}

/**
 * Looks up a UI string in a dictionary, falling back to English so a
 * missing key — or a still-loading dictionary — never renders blank.
 * @param locale - Active locale info.
 * @param key - Dot-path key, e.g. "nav.settings".
 * @returns The localized string.
 */
export function translate(locale: LocaleInfo, key: string): string {
  const pick = (dict: TranslationKeys): string | undefined => {
    const parts = key.split('.');
    let node: unknown = dict;
    for (const p of parts) {
      if (node && typeof node === 'object' && p in (node as Record<string, unknown>)) {
        node = (node as Record<string, unknown>)[p];
      } else {
        return undefined;
      }
    }
    return typeof node === 'string' ? node : undefined;
  };
  return pick(locale.dict) ?? pick(en) ?? key;
}

/**
 * Applies a locale to the document (lang + direction).
 * @param locale - Locale info to apply.
 */
export function applyLocaleToDocument(locale: LocaleInfo): void {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = locale.lang;
  document.documentElement.dir = locale.rtl ? 'rtl' : 'ltr';
}
