/**
 * SalahKit service worker — versioned offline shell.
 * Bump CACHE_VERSION on every deploy: the new worker installs a fresh
 * cache, waits for activation, then purges old caches on takeover.
 * Navigations are network-first (always fresh when online), static
 * assets cache-first with background refresh (instant offline).
 */
const CACHE_VERSION = 'salahkit-v3';

/** App shell precached on install. */
const PRECACHE_URLS = ['/', '/index.html', '/manifest.json', '/favicon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() =>
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({ type: 'SW_ACTIVATED', version: CACHE_VERSION });
          });
        })
      )
  );
});

// Controlled updates: the app posts SKIP_WAITING when the user accepts.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * Network-first for navigations: installed apps always get the newest
 * index.html when online, falling back to the cached shell offline.
 * @param {Request} request - Incoming navigation request.
 * @returns {Promise<Response>} Fresh or cached document.
 */
async function navigationStrategy(request) {
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put('/', response.clone());
    }
    return response;
  } catch {
    const cached = (await caches.match('/index.html')) || (await caches.match('/'));
    return cached || Response.error();
  }
}

/**
 * Cache-first with stale-while-revalidate for static assets: instant
 * loads offline, silent refresh when a connection returns.
 * @param {Request} request - Incoming asset request.
 * @returns {Promise<Response>} Cached or fetched asset.
 */
async function assetStrategy(request) {
  const cached = await caches.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
      }
      return response;
    })
    .catch(() => null);
  if (cached) return cached;
  const fresh = await network;
  if (fresh) return fresh;
  return Response.error();
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(navigationStrategy(request));
    return;
  }
  event.respondWith(assetStrategy(request));
});
