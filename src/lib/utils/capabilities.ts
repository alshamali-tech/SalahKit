/**
 * Capability registry + storage-survival triad (P0).
 * Detect once, degrade gracefully: persistence requests, private-mode
 * heuristics, visit-gap tracking (iOS 7-day risk), vibration/wake-lock/
 * notification support, and QuotaExceededError recognition.
 */

/** localStorage key recording the last visit (day-granularity). */
const LAST_VISIT_KEY = 'salahkit:last-visit';
/** localStorage key recording the last successful backup timestamp. */
const LAST_BACKUP_KEY = 'salahkit:last-backup';

/** Snapshot of platform/storage capabilities. */
export interface StorageSnapshot {
  /** Bytes used, null when the API is unavailable. */
  usage: number | null;
  /** Quota bytes, null when unavailable. */
  quota: number | null;
  /** True when the browser granted persistent storage. */
  persisted: boolean | null;
  /** Heuristic: likely private/ephemeral or pressure-sensitive mode. */
  likelyEphemeral: boolean;
}

/**
 * Queries the StorageManager for usage, quota and persisted state.
 * @returns A snapshot; nulls where the API is missing.
 */
export async function storageSnapshot(): Promise<StorageSnapshot> {
  const nav = navigator as Navigator & {
    storage?: { estimate?: () => Promise<{ usage?: number; quota?: number }>; persisted?: () => Promise<boolean> };
  };
  let usage: number | null = null;
  let quota: number | null = null;
  let persisted: boolean | null = null;
  try {
    const est = await nav.storage?.estimate?.();
    usage = est?.usage ?? null;
    quota = est?.quota ?? null;
  } catch {
    // Unavailable (older engines) — snapshot stays partial.
  }
  try {
    persisted = (await nav.storage?.persisted?.()) ?? null;
  } catch {
    persisted = null;
  }
  // Heuristic: very small quotas indicate private/ephemeral contexts.
  const likelyEphemeral = quota !== null && quota < 200 * 1024 * 1024;
  return { usage, quota, persisted, likelyEphemeral };
}

/**
 * Requests persistent storage (granted when installed/engaged).
 * Safe no-op where unsupported.
 * @returns True when persistence is (now) granted.
 */
export async function ensurePersistentStorage(): Promise<boolean> {
  const nav = navigator as Navigator & { storage?: { persist?: () => Promise<boolean> } };
  try {
    return (await nav.storage?.persist?.()) ?? false;
  } catch {
    return false;
  }
}

/** localStorage key holding the gap computed on today's first visit. */
const VISIT_GAP_KEY = 'salahkit:visit-gap';

/**
 * Records today's visit and reports the gap since the previous one.
 * Used for the iOS-style "data at risk after long absence" notice.
 * Idempotent within a day: the gap is stored so later reads agree.
 * @returns Days between the previous visit and today (0 on first run).
 */
export function touchLastVisit(): number {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const prev = localStorage.getItem(LAST_VISIT_KEY);
    localStorage.setItem(LAST_VISIT_KEY, today);
    let gap = 0;
    if (prev && prev !== today) {
      const diff = Date.parse(today) - Date.parse(prev);
      gap = Number.isFinite(diff) ? Math.round(diff / 86400000) : 0;
    }
    localStorage.setItem(VISIT_GAP_KEY, String(gap));
    return gap;
  } catch {
    return 0;
  }
}

/**
 * The visit gap recorded when the app opened today.
 * @returns Days absent before this visit (0 normally).
 */
export function getVisitGapDays(): number {
  try {
    const raw = Number(localStorage.getItem(VISIT_GAP_KEY) ?? '0');
    return Number.isFinite(raw) ? raw : 0;
  } catch {
    return 0;
  }
}

/** @returns ISO date of the last successful backup, or null. */
export function getLastBackupAt(): string | null {
  try {
    return localStorage.getItem(LAST_BACKUP_KEY);
  } catch {
    return null;
  }
}

/** Records a successful backup for the storage-health card. */
export function markBackedUp(): void {
  try {
    localStorage.setItem(LAST_BACKUP_KEY, new Date().toISOString());
  } catch {
    // Best-effort bookkeeping only.
  }
}

/** True when vibration hardware is reachable. */
export function supportsVibration(): boolean {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator;
}

/** True when the Screen Wake Lock API exists. */
export function supportsWakeLock(): boolean {
  return typeof navigator !== 'undefined' && 'wakeLock' in navigator;
}

/** True when the Web Notifications API exists. */
export function supportsNotifications(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/** True when running as an installed standalone PWA. */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const nav = navigator as Navigator & { standalone?: boolean };
  return Boolean(window.matchMedia?.('(display-mode: standalone)').matches || nav.standalone);
}

/**
 * Recognizes QuotaExceededError across engines so writes can degrade
 * to a helpful toast instead of a silent failure.
 * @param err - Caught error.
 * @returns True when storage is full.
 */
export function isQuotaError(err: unknown): boolean {
  if (typeof DOMException !== 'undefined' && err instanceof DOMException) {
    return err.name === 'QuotaExceededError' || err.code === 22;
  }
  return err instanceof Error && err.name === 'QuotaExceededError';
}
