/**
 * Cross-tab store sync (P19).
 * Two open tabs share one IndexedDB but have independent in-memory
 * state; every mutation broadcasts a bump so other tabs re-read from
 * the database instead of drifting.
 */

const CHANNEL_NAME = 'salahkit-sync';
const BUMP_KEY = 'salahkit:sync-bump';

type Listener = () => void;
const listeners = new Set<Listener>();
let channel: BroadcastChannel | null = null;

/** Lazily opens the channel and wires the message listener once. */
function ensureChannel(): void {
  if (channel || typeof BroadcastChannel === 'undefined') return;
  channel = new BroadcastChannel(CHANNEL_NAME);
  channel.onmessage = (event: MessageEvent) => {
    if (event.data === 'bump') listeners.forEach((l) => l());
  };
}

/**
 * Subscribes to cross-tab invalidation events.
 * @param listener - Called whenever another tab writes.
 * @returns Unsubscribe function.
 */
export function onStoreBump(listener: Listener): () => void {
  ensureChannel();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Announces a local write so other tabs refresh from IndexedDB.
 * Safe no-op when BroadcastChannel is unsupported.
 */
export function announceStoreBump(): void {
  try {
    localStorage.setItem(BUMP_KEY, String(Date.now()));
  } catch {
    // Bookkeeping only — the channel message still propagates.
  }
  try {
    ensureChannel();
    channel?.postMessage('bump');
  } catch {
    // Channel closed or unavailable — other tabs simply stay put.
  }
}
