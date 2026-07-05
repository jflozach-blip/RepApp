const CACHE_NAME = 'union-rep-app-v3-5-8-fixed-2';

const PRECACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/version.json',
  '/offline.html',
  '/install.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const url of PRECACHE) {
        try {
          const response = await fetch(url, { cache: 'reload' });

          if (response.ok) {
            await cache.put(url, response);
          } else {
            console.warn('Not cached:', url, response.status);
          }
        } catch (err) {
          console.warn('Cache failed:', url, err);
        }
      }
    })
  );
});

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

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, copy).catch(() => {});
          });
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        return cached || caches.match('/offline.html');
      })
  );
});
