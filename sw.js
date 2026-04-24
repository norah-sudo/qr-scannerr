const CACHE_NAME = 'qr-guard-v1';
const urlsToCache = [
    './',
    './index.html',
    './scan.html',
    './result.html',
    './manifest.json',
    'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js'
];

// Install
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .catch(err => console.log('[SW] Cache failed:', err))
    );
});

// Fetch
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) return response;
                return fetch(event.request);
            })
            .catch(() => {
                return new Response('Offline', { status: 200 });
            })
    );
});

// Activate
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
