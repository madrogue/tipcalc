// Bump this version string on every deploy to trigger a cache refresh
const CACHE_NAME = 'tipcalc-v2';

const ASSETS = [
  '/tipcalc/',
  '/tipcalc/index.html',
  '/tipcalc/styles.css',
  '/tipcalc/app.js',
  '/tipcalc/assets/icon-192x192.png',
  '/tipcalc/assets/icon-512x512.png',
  '/tipcalc/assets/android-icon-36x36.png',
  '/tipcalc/assets/android-icon-48x48.png',
  '/tipcalc/assets/android-icon-72x72.png'
];

self.addEventListener('install', event => {
  // skipWaiting is chained AFTER caching so the SW never activates with an empty cache
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Allow the page to manually trigger activation (used by the update banner)
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', event => {
  // Delete any old caches, then claim open tabs so they get the new SW
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    }).catch(() => {
      if (event.request.mode === 'navigate') {
        return caches.match('/tipcalc/index.html');
      }
    })
  );
});