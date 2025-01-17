const CACHE_NAME = 'tip-calculator-cache-v1';
const urlsToCache = [
  '/tipcalc/',
  '/tipcalc/src/index.html',
  '/tipcalc/src/styles.css',
  '/tipcalc/src/app.js',
  '/tipcalc/icon-192x192.png',
  '/tipcalc/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});