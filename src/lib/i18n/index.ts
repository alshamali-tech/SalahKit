/**
 * Internationalisation core (S16). The UI chrome, navigation, landing
 * page and common actions are localised; Quran text is ALWAYS Arabic
 * and is never translated. Right-to-left locales flip <html dir>.
 */
import type { TranslationKeys, LocaleId } from './keys';

export type { TranslationKeys, LocaleId };

/** One supported interface language. */
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
  /** Dictionary of UI strings. */
  dict: TranslationKeys;
}

import { en } from './locales/en';
import { ar } from './locales/ar';
import { fr } from './locales/fr';
import { ur } from './locales/ur';
import { tr } from './locales/tr';
import { id } from './locales/id';

/** All supported locales, in switcher order. */
export const LOCALES: readonly LocaleInfo[] = [
  { id: 'en', native: 'English', english: 'English', lang: 'en', rtl: false, dict: en },
  { id: 'ar', native: 'العربية', english: 'Arabic', lang: 'ar', rtl: true, dict: ar },
  { id: 'fr', native: 'Français', english: 'French', lang: 'fr', rtl: false, dict: fr },
  { id: 'ur', native: 'اردو', english: 'Urdu', lang: 'ur', rtl: true, dict: ur },
  { id: 'tr', native: 'Türkçe', english: 'Turkish', lang: 'tr', rtl: false, dict: tr },
  { id: 'id', native: 'Bahasa Indonesia', english: 'Indonesian', lang: 'id', rtl: false, dict: id },
];

/** Default interface language. */
export const DEFAULT_LOCALE: LocaleId = 'en';

/** localStorage key holding the chosen interface locale. */
export const STORAGE_LOCALE_KEY = 'salahkit:locale';

/** Locales that render right-to-left. */
export const RTL_LOCALES: ReadonlySet<LocaleId> = new Set<LocaleId>(['ar', 'ur']);

/**
 * Resolves a locale id, falling back to English for unknown values.
 * @param id - Candidate locale id.
 * @returns A valid LocaleInfo.
 */
export function getLocale(id: string): LocaleInfo {
  return LOCALES.find((l) => l.id === id) ?? LOCALES[0];
}

/**
 * Looks up a UI string in a dictionary, falling back to English so a
 * missing key never renders blank.
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
  return pick(locale.dict) ?? pick((LOCALES[0] as LocaleInfo).dict) ?? key;
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
