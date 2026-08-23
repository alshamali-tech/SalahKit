/**
 * localStorage helpers (S3: utils/storage.ts).
 * Per S6, only theme + feature flags live in localStorage;
 * everything else belongs in IndexedDB.
 */
import { STORAGE_KEYS } from '../core/constants';
import type { ThemeMode } from '../core/types';

/**
 * Reads a localStorage value without throwing.
 * @param key - Storage key.
 * @returns Stored string or null.
 */
export function safeGet(key: string): string | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Writes a localStorage value without throwing.
 * @param key - Storage key.
 * @param value - Value to store.
 */
export function safeSet(key: string, value: string): void {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
  } catch {
    // Storage full or blocked - fail silently, app keeps working in-memory.
  }
}

/**
 * Removes a localStorage key without throwing.
 * @param key - Storage key.
 */
export function safeRemove(key: string): void {
  try {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
  } catch {
    // Non-fatal.
  }
}

/**
 * Reads a JSON value with a typed fallback.
 * @param key - Storage key.
 * @param fallback - Returned when missing or unparseable.
 * @returns Parsed value or fallback.
 */
export function getJSON<T>(key: string, fallback: T): T {
  const raw = safeGet(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Writes a JSON-serializable value.
 * @param key - Storage key.
 * @param value - Value to serialize.
 */
export function setJSON(key: string, value: unknown): void {
  safeSet(key, JSON.stringify(value));
}

/**
 * Reads the stored theme preference.
 * @returns 'light' | 'dark' or null when unset.
 */
export function getStoredTheme(): ThemeMode | null {
  const raw = safeGet(STORAGE_KEYS.theme);
  return raw === 'light' || raw === 'dark' ? raw : null;
}

/**
 * Persists the theme preference.
 * @param theme - Theme to store.
 */
export function setStoredTheme(theme: ThemeMode): void {
  safeSet(STORAGE_KEYS.theme, theme);
}

/**
 * Applies the theme to <html data-theme="..."> for CSS variable switching.
 * @param theme - Theme to apply.
 */
export function applyThemeToDocument(theme: ThemeMode): void {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
