/**
 * PWA update detection & application.
 * The service worker ships with a versioned cache: each deployment
 * registers a new worker that waits until we activate it. This module
 * finds that worker, surfaces it to the UI, and applies the update by
 * posting SKIP_WAITING and reloading once the new worker takes over.
 * Works the same on mobile (installed PWA) and desktop browsers.
 */

/** Lifecycle states surfaced to the UI. */
export type UpdateStatus =
  | 'unsupported'
  | 'active'
  | 'checking'
  | 'update-available'
  | 'up-to-date';

type UpdateListener = (status: UpdateStatus) => void;

const listeners = new Set<UpdateListener>();
let current: UpdateStatus = 'unsupported';
let refreshing = false;
let initialized = false;

/** Publishes a new status to all subscribers. */
function setStatus(status: UpdateStatus): void {
  current = status;
  listeners.forEach((l) => l(status));
}

/**
 * Subscribes to update-status changes (replays the current value).
 * @param cb - Listener.
 * @returns Unsubscribe function.
 */
export function onUpdateStatus(cb: UpdateListener): () => void {
  listeners.add(cb);
  cb(current);
  return () => {
    listeners.delete(cb);
  };
}

/** @returns The current update status. */
export function getUpdateStatus(): UpdateStatus {
  return current;
}

/** True when the browser supports service workers in this context. */
function swAvailable(): boolean {
  try {
    return (
      typeof navigator !== 'undefined' &&
      'serviceWorker' in navigator &&
      typeof window.isSecureContext === 'boolean' &&
      window.isSecureContext
    );
  } catch {
    return false;
  }
}

/**
 * Applies a pending update: tells the waiting worker to skip waiting,
 * then reloads once when the new controller takes over.
 */
export function applyUpdate(): void {
  if (!swAvailable()) return;
  void navigator.serviceWorker.getRegistration().then((reg) => {
    if (reg?.waiting) {
      reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      // Safety net: if the worker never claims, reload anyway shortly.
      window.setTimeout(() => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      }, 4000);
    }
  });
}

/**
 * Forces an immediate update check against the network.
 * @returns The resulting status ('update-available' or 'up-to-date').
 */
export async function checkForUpdates(): Promise<UpdateStatus> {
  if (!swAvailable()) {
    setStatus('unsupported');
    return 'unsupported';
  }
  setStatus('checking');
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    if (!reg) {
      setStatus('up-to-date');
      return 'up-to-date';
    }
    await reg.update();
    if (reg.waiting && navigator.serviceWorker.controller) {
      setStatus('update-available');
      return 'update-available';
    }
    setStatus('up-to-date');
    return 'up-to-date';
  } catch {
    setStatus('up-to-date');
    return 'up-to-date';
  }
}

/**
 * Boots the watcher: registers the worker, listens for new versions,
 * and re-checks every 30 minutes and whenever the tab regains focus.
 * Call once at app startup (idempotent).
 */
export function initUpdateWatcher(): void {
  if (initialized || !swAvailable()) {
    if (!swAvailable()) setStatus('unsupported');
    return;
  }
  initialized = true;

  navigator.serviceWorker
    .register('/sw.js')
    .then((reg) => {
      setStatus(navigator.serviceWorker.controller ? 'active' : 'up-to-date');
      // A deployed update is already waiting.
      if (reg.waiting && navigator.serviceWorker.controller) {
        setStatus('update-available');
      }
      reg.addEventListener('updatefound', () => {
        const installing = reg.installing;
        if (!installing) return;
        installing.addEventListener('statechange', () => {
          if (installing.state === 'installed' && navigator.serviceWorker.controller) {
            setStatus('update-available');
          }
        });
      });
    })
    .catch(() => {
      // Offline-first app: SW is an enhancement, not a requirement.
      setStatus('up-to-date');
    });

  // When the new worker takes over, reload once to run the new bundle.
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });

  // Periodic + visibility-triggered checks keep installed apps fresh.
  window.setInterval(() => {
    void checkForUpdates();
  }, 30 * 60 * 1000);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void checkForUpdates();
  });
}
