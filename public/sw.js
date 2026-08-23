/**
 * SalahKit service worker (S3: public/sw.js).
 * Offline-first: precache the app shell, cache-first for static assets,
 * network-first with cache fallback for navigations. No analytics, no
 * third-party requests. Version the cache name to force refresh.
 */
const CACHE_NAME = 'salahkit-v1';

/** App shell assets precached on install. */
const PRECACHE_URLS = ['/', '/index.html', '/manifest.json', '/favicon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/**
 * Cache-first for same-origin GETs; stale entries are refreshed in the
 * background (stale-while-revalidate) so the app works fully offline.
 * @param {Request} request - Incoming request.
 * @returns {Promise<Response>} Cached or fresh response.
 */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
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
  event.respondWith(cacheFirst(request));
});
