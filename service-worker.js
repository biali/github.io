const CACHE_NAME = 'robrowser-cache-v1';
const urlsToCache = [
    '/',
    '/Online.js'
//   '/styles/index.css',
//   '/styles/style.css',
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
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
