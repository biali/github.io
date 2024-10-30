const CACHE_NAME = 'robrowser-cache-v1';
const urlsToCache = [
  '/styles/index.css',
  '/styles/style.css'
  // Add other critical assets here
];

// Install event - Cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event - Serve from cache if available
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
