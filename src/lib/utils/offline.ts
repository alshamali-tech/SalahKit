/**
 * Connectivity helpers (S3: utils/offline.ts).
 * SalahKit is offline-first; these utilities let the UI reflect
 * network state without ever blocking on it.
 */

/**
 * Current online status. Treats unknown environments as online.
 * @returns True when the browser reports network connectivity.
 */
export function isOnline(): boolean {
  return typeof navigator === 'undefined' ? true : navigator.onLine;
}

/**
 * Subscribes to online/offline transitions.
 * @param callback - Invoked with the new online state on each change.
 * @returns Unsubscribe function that removes both listeners.
 */
export function watchConnectivity(callback: (online: boolean) => void): () => void {
  if (typeof window === 'undefined') {
    return () => undefined;
  }
  const goOnline = (): void => callback(true);
  const goOffline = (): void => callback(false);
  window.addEventListener('online', goOnline);
  window.addEventListener('offline', goOffline);
  return () => {
    window.removeEventListener('online', goOnline);
    window.removeEventListener('offline', goOffline);
  };
}
