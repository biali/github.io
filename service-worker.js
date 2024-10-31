// Define cache names and versioning
// Increment version when changes are made. eg dynamic-cache-v2
const CACHE_NAME = 'dynamic-cache-v1'; 

// Precache specific resources on install (if needed)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Add assets to cache if needed
      return cache.addAll([
        // '/',
        // Add any other assets you want pre-cached
      ]);
    })
  );
});

// Activate event to delete old caches when a new worker activates
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME) // Remove old cache versions
          .map((name) => caches.delete(name))
      );
    })
  );
  return self.clients.claim(); // Take control of all clients immediately
});

// Fetch event with stale-while-revalidate caching strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Update cache with the latest version
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        
        // Return cached response if available, otherwise wait for network
        return cachedResponse || fetchPromise;
      })
    )
  );
});

// Listen for messages from the main thread to cache specific resources dynamically
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_URLS') {
    cacheUrls(event.data.payload);
  }
});

// Helper function to add URLs to the cache dynamically
async function cacheUrls(urls) {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(urls);
}
