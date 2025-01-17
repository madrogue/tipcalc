const CACHE_NAME = 'tip-calculator-cache-v1';
const urlsToCache = [
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