const CACHE_NAME = 'robrowser-cache-v1';
const urlsToCache = [
//  Add other critical assets here
];

// Install event - Cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }).then(() => self.skipWaiting()) // Activate worker after caching
  );
});

// Activate event - Ensure that updated service worker is activated immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch event - Serve from cache if available, else fetch from network
self.addEventListener('fetch', (event) => {
  // Bypass cache for CORS-enabled external requests
  if (new URL(event.request.url).origin !== self.location.origin) {
    event.respondWith(fetch(event.request));
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
