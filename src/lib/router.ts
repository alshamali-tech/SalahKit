/**
 * Hash router — the SPA equivalent of the blueprint's S8 routes
 * (/, /tools, /tools/[module], /privacy, /terms). Pure TypeScript.
 */
import type { ModuleId } from '../types';

/** All routable tool modules. */
const MODULE_IDS: readonly ModuleId[] = [
  'dashboard',
  'prayer',
  'qibla',
  'hijri',
  'quran',
  'dhikr',
  'zakat',
  'duas',
  'names',
  'tracker',
  'calendar',
  'hifz',
  'hadith',
  'tajweed',
  'arabic',
  'privacy',
  'terms',
];

/** A parsed route. */
export type Route =
  | { view: 'landing' }
  | { view: 'tools'; module: ModuleId };

/**
 * Type guard for module ids.
 * @param value - Candidate string.
 * @returns True for known module ids.
 */
export function isModuleId(value: string): value is ModuleId {
  return (MODULE_IDS as readonly string[]).includes(value);
}

/**
 * Parses a location.hash value into a Route. Unknown paths fall back
 * to the landing page so deep links never dead-end.
 * @param hash - Raw location.hash (may include the leading '#').
 * @returns The parsed route.
 */
export function parseHash(hash: string): Route {
  const path = hash.replace(/^#/, '');
  const clean = path === '' || path === '/' ? '/' : path.startsWith('/') ? path : `/${path}`;
  if (clean === '/') return { view: 'landing' };
  if (clean === '/privacy') return { view: 'tools', module: 'privacy' };
  if (clean === '/terms') return { view: 'tools', module: 'terms' };
  if (clean === '/tools' || clean === '/dashboard') return { view: 'tools', module: 'dashboard' };
  const match = clean.match(/^\/tools\/([a-z-]+)\/?$/);
  if (match && match[1] && isModuleId(match[1])) {
    return { view: 'tools', module: match[1] };
  }
  return { view: 'landing' };
}

/**
 * Serializes a route back to a hash path (without '#').
 * @param route - Route to serialize.
 * @returns Path string like '/tools/qibla'.
 */
export function routeToPath(route: Route): string {
  if (route.view === 'landing') return '/';
  if (route.module === 'privacy') return '/privacy';
  if (route.module === 'terms') return '/terms';
  return `/tools/${route.module}`;
}

/**
 * Navigates by setting location.hash (triggers the route watcher).
 * @param path - Target path, e.g. '/tools/qibla'.
 */
export function navigate(path: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.location.hash = path;
  } catch {
    // Sandboxed contexts may block location writes; routing degrades
    // to in-memory state, which setModule already applied.
  }
}

/**
 * Subscribes to route changes (hashchange).
 * @param callback - Invoked with the parsed route on each change.
 * @returns Unsubscribe function.
 */
export function watchRoute(callback: (route: Route) => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const handler = (): void => callback(parseHash(window.location.hash));
  window.addEventListener('hashchange', handler);
  return () => window.removeEventListener('hashchange', handler);
}
