/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'nutrino-cache-v1';
const urlsToCache = [
  '/nutrition-calculator/',
  '/nutrition-calculator/index.html',
  '/nutrition-calculator/favicon.ico',
  '/nutrition-calculator/logo192.png',
  '/nutrition-calculator/logo512.png',
  '/nutrition-calculator/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.forEach(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});