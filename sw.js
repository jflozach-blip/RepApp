const CACHE_NAME = 'pwa-mobile-1783258007770';

const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './version.json',
  './offline.html',
  './install.js',
  './icons/icon-72.png',
  './icons/icon-96.png',
  './icons/icon-128.png',
  './icons/icon-144.png',
  './icons/icon-152.png',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-384.png',
  './icons/icon-512.png'
];

// Install
self.addEventListener('install', event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {

      const results = await Promise.allSettled(
        PRECACHE.map(url => cache.add(url))
      );

      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.warn('Failed to cache:', PRECACHE[index]);
        }
      });

    })
  );
});

// Activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch
self.addEventListener('fetch', event => {

  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {

        // Don't cache bad responses
        if (!response || response.status !== 200) {
          return response;
        }

        const copy = response.clone();

        caches.open(CACHE_NAME)
          .then(cache => cache.put(event.request, copy))
          .catch(() => {});

        return response;
      })
      .catch(async () => {

        const cached = await caches.match(event.request);

        if (cached) {
          return cached;
        }

        return caches.match('./offline.html');
      })
  );

});
