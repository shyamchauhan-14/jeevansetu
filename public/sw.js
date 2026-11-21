// JeevanSetu 2.0 Service Worker (Offline-First App Shell & Protocol Cache)
const CACHE_NAME = 'jeevansetu-v2-cache';
const STATIC_ASSETS = [
  './',
  './index.html',
  './favicon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        // Return cached, revalidate in background
        fetch(event.request)
          .then((networkRes) => {
            if (networkRes.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkRes));
            }
          })
          .catch(() => {});
        return cached;
      }

      return fetch(event.request).catch(() => {
        // Fallback for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html') as Promise<Response>;
        }
        return new Response('Network offline. Resource unavailable.', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});
