/**
 * Locale state + `t()` accessor for React components (S16).
 * The active locale lives in localStorage (a UI preference, like the
 * theme) and is mirrored into <html lang/dir> for correct rendering.
 */
import { useCallback, useSyncExternalStore } from 'react';
import {
  getLocale,
  applyLocaleToDocument,
  translate,
  DEFAULT_LOCALE,
  STORAGE_LOCALE_KEY,
} from './i18n';
import type { LocaleInfo } from './i18n';
import type { LocaleId } from './i18n/keys';

/** Reads the persisted locale id, defaulting to English. */
function readStoredLocale(): LocaleId {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_LOCALE_KEY) : null;
    return (raw ?? DEFAULT_LOCALE) as LocaleId;
  } catch {
    return DEFAULT_LOCALE;
  }
}

let current: LocaleId = readStoredLocale();
const listeners = new Set<() => void>();

/**
 * Applies a locale to storage + document and notifies subscribers.
 * @param id - Locale to activate.
 */
export function setLocaleGlobal(id: LocaleId): void {
  current = id;
  try {
    localStorage.setItem(STORAGE_LOCALE_KEY, id);
  } catch {
    // Storage unavailable; keep the in-memory choice.
  }
  applyLocaleToDocument(getLocale(id));
  listeners.forEach((l) => l());
}

/** Applies the persisted locale once at boot. */
export function initLocale(): void {
  applyLocaleToDocument(getLocale(current));
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): LocaleId {
  return current;
}

/** Returns the current LocaleInfo reactively. */
function useLocaleInfo(): LocaleInfo {
  const id = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return getLocale(id);
}

/**
 * Translation hook.
 * @returns An object with the active locale, a `t(key)` function and
 *   a `setLocale` setter.
 */
export function useT(): {
  locale: LocaleInfo;
  t: (key: string) => string;
  setLocale: (id: LocaleId) => void;
} {
  const locale = useLocaleInfo();
  const t = useCallback((key: string) => translate(locale, key), [locale]);
  return { locale, t, setLocale: setLocaleGlobal };
}
