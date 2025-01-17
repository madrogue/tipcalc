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
        // Return the cached response if found, otherwise fetch from network
        return response || fetch(event.request).then(networkResponse => {
          // Cache the new response for future requests
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      }).catch(() => {
        // Fallback to a default offline page or asset if both cache and network fail
        if (event.request.mode === 'navigate') {
          return caches.match('/tipcalc/index.html');
        }
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});