const CACHE_NAME = 'calc-v2'; // 🔁 Bump this version whenever you update files
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/icon.png'
];

// 🔧 Install: Cache all essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // 🚀 Activate the new service worker immediately
});

// 🧹 Activate: Delete old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    )
  );
  self.clients.claim(); // ✅ Take control of all clients immediately
});

// 🌐 Fetch: Respond with cached file or network fallback
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).catch(() =>
          new Response('⚠️ Offline & not cached', {
            status: 503,
            statusText: 'Offline',
          })
        )
      );
    })
  );
});
