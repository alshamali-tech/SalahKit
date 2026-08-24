/**
 * SalahKit service worker (S3: public/sw.js).
 * Offline-first strategy:
 *  - Navigations: network-first, cached shell as fallback (stale HTML
 *    is never served while a fresh build exists).
 *  - Same-origin assets: cache-first with background refresh.
 * Bump CACHE_NAME on every deploy so activate() purges old caches.
 */
const CACHE_NAME = 'salahkit-v3';

/** App shell precached on install (failures do not block install). */
const PRECACHE_URLS = ['/', '/index.html', '/manifest.json', '/favicon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        Promise.allSettled(
          PRECACHE_URLS.map((url) =>
            fetch(url, { cache: 'no-store' })
              .then((res) => (res && res.ok ? cache.put(url, res.clone()) : undefined))
              .catch(() => undefined)
          )
        )
      )
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
 * Network-first for HTML navigations: always try the latest build,
 * fall back to the cached shell when offline.
 * @param {Request} request - Navigation request.
 * @returns {Promise<Response>} Fresh shell or cached shell.
 */
async function networkFirstNavigation(request) {
  try {
    const response = await fetch(request, { cache: 'no-store' });
    if (response && response.ok) {
      const copy = response.clone();
      const cache = await caches.open(CACHE_NAME);
      await cache.put('/index.html', copy);
    }
    return response;
  } catch (err) {
    const cached =
      (await caches.match(request)) ||
      (await caches.match('/index.html')) ||
      (await caches.match('/'));
    return cached || Response.error();
  }
}

/**
 * Cache-first with stale-while-revalidate for same-origin assets.
 * @param {Request} request - Asset request.
 * @returns {Promise<Response>} Cached or fresh response.
 */
async function cacheFirstAsset(request) {
  const cached = await caches.match(request);
  const refresh = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      }
      return response;
    })
    .catch(() => null);
  if (cached) return cached;
  const fresh = await refresh;
  return fresh || Response.error();
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  let url;
  try {
    url = new URL(request.url);
  } catch (err) {
    return;
  }
  if (url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request));
    return;
  }
  event.respondWith(cacheFirstAsset(request));
});
