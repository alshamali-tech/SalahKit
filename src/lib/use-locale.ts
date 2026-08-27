/**
 * Locale state + `t()` accessor for React components (S16).
 * The active locale lives in localStorage (a UI preference, like the
 * theme) and is mirrored into <html lang/dir> immediately; the locale
 * dictionary streams in asynchronously and re-renders once loaded.
 */
import { useCallback, useSyncExternalStore } from 'react';
import {
  getLocale,
  applyLocaleToDocument,
  translate,
  ensureLocale,
  onDictLoaded,
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
/** Bumped whenever the active dictionary changes, to re-render hooks. */
let dictVersion = 0;
const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach((l) => l());
}

// Re-render subscribers when any dictionary finishes loading.
onDictLoaded(() => {
  dictVersion += 1;
  notify();
});

/**
 * Applies a locale to storage + document immediately, then streams in
 * its dictionary (English renders in the meantime).
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
  notify();
  void ensureLocale(id);
}

/** Applies the persisted locale once at boot and preloads its dictionary. */
export function initLocale(): void {
  applyLocaleToDocument(getLocale(current));
  void ensureLocale(current);
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): string {
  return `${current}:${dictVersion}`;
}

/** Returns the current LocaleInfo reactively (updates on dict load). */
function useLocaleInfo(): LocaleInfo {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return getLocale(snap.split(':')[0] ?? DEFAULT_LOCALE);
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
