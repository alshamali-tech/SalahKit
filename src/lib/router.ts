/**
 * History router — the SPA equivalent of the blueprint's S8 routes
 * (/, /tools, /tools/[module], /privacy, /terms). Pure TypeScript.
 *
 * Cloudflare Pages serves index.html for every path via /_redirects,
 * so clean URLs (/tools/quran) resolve to the app shell and this
 * router maps location.pathname onto the correct view.
 *
 * Legacy hash URLs (/#/tools/quran) are upgraded once in main.tsx
 * before React mounts, so bookmarks and old shared links keep working.
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
  'donate',
  'about',
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
 * Parses a location.pathname value into a Route. Unknown paths fall
 * back to the landing page so deep links never dead-end.
 * @param pathname - Raw location.pathname (e.g. "/tools/quran").
 * @returns The parsed route.
 */
export function parsePath(pathname: string): Route {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/') return { view: 'landing' };
  if (clean === '/privacy') return { view: 'tools', module: 'privacy' };
  if (clean === '/terms') return { view: 'tools', module: 'terms' };
  if (clean === '/donate') return { view: 'tools', module: 'donate' };
  if (clean === '/about') return { view: 'tools', module: 'about' };
  if (clean === '/tools' || clean === '/dashboard') {
    return { view: 'tools', module: 'dashboard' };
  }
  const match = clean.match(/^\/tools\/([a-z-]+)$/);
  if (match && match[1] && isModuleId(match[1])) {
    return { view: 'tools', module: match[1] };
  }
  return { view: 'landing' };
}

/**
 * Serializes a route back to its clean path.
 * @param route - Route to serialize.
 * @returns Path string like '/tools/qibla'.
 */
export function routeToPath(route: Route): string {
  if (route.view === 'landing') return '/';
  if (route.module === 'privacy') return '/privacy';
  if (route.module === 'terms') return '/terms';
  if (route.module === 'donate') return '/donate';
  if (route.module === 'about') return '/about';
  if (route.module === 'dashboard') return '/dashboard';
  return `/tools/${route.module}`;
}

/**
 * Navigates via the History API (pushState + a synthetic popstate so
 * the store watcher stays the single source of route changes).
 * @param path - Target path, e.g. '/tools/qibla'.
 */
export function navigate(path: string): void {
  if (typeof window === 'undefined') return;
  try {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    window.dispatchEvent(new PopStateEvent('popstate'));
  } catch {
    // Sandboxed contexts may block history writes; routing degrades
    // to in-memory state, which setModule already applied.
  }
}

/**
 * Subscribes to route changes (popstate: back/forward + navigate()).
 * @param callback - Invoked with the parsed route on each change.
 * @returns Unsubscribe function.
 */
export function watchRoute(callback: (route: Route) => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const handler = (): void => callback(parsePath(window.location.pathname));
  window.addEventListener('popstate', handler);
  return () => window.removeEventListener('popstate', handler);
}