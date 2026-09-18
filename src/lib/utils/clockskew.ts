/**
 * Device clock skew detection (P20).
 * Prayer countdowns trust the device clock. When online, a HEAD
 * request's `Date` header reveals the true time; a large offset means
 * the countdown is wrong and the user deserves a warning.
 */

/** Probe endpoint: the Quran CDN root (keyless; allowed by connect-src in public/_headers). */
const PROBE_URL = 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/1.mp3';
/** Offset above which we warn (ms). */
export const SKEW_WARN_MS = 2 * 60 * 1000;

/**
 * Measures the difference between the device clock and network time.
 * @returns Skew in ms (device − server), or null when undetectable.
 */
export async function measureClockSkewMs(): Promise<number | null> {
  try {
    const before = Date.now();
    const res = await fetch(PROBE_URL, { method: 'HEAD' });
    const after = Date.now();
    const header = res.headers.get('Date');
    if (!header) return null;
    const server = Date.parse(header);
    if (!Number.isFinite(server)) return null;
    // Correct for half the round trip.
    return before + (after - before) / 2 - server;
  } catch {
    return null;
  }
}

/**
 * True when the measured skew is large enough to mislead countdowns.
 * @param skewMs - Value from measureClockSkewMs.
 * @returns Whether a warning should be shown.
 */
export function isSkewSignificant(skewMs: number | null): boolean {
  return skewMs !== null && Math.abs(skewMs) > SKEW_WARN_MS;
}

/**
 * Human-readable skew, e.g. "+5 min" / "-90 s".
 * @param skewMs - Skew in ms.
 * @returns Compact offset string.
 */
export function formatSkew(skewMs: number): string {
  const sign = skewMs > 0 ? '+' : '−';
  const abs = Math.abs(skewMs);
  if (abs >= 60000) return `${sign}${Math.round(abs / 60000)} min`;
  return `${sign}${Math.round(abs / 1000)} s`;
}
