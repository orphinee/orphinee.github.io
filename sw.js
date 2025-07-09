
const CACHE_NAME = 'latihan-pwa-cache-v4'; 
const urlsToCache = [
    '/tugasPWA.html',
    '/style.css',
    '/script.js', 
    '/manifest.json',
    '/penguin.jpg'
];

self.addEventListener('install', (event) => {
    console.log('Service Worker: Menginstal...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Menyimpan shell aplikasi');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Service Worker: Gagal menyimpan', error);
            })
    );
});


self.addEventListener('activate', (event) => {
    console.log('Service Worker: Mengaktifkan...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Menghapus cache lama', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    console.log('Service Worker: Melayani dari cache', event.request.url);
                    return response;
                }

                console.log('Service Worker: Mengambil dari jaringan', event.request.url);
                return fetch(event.request)
                    .then((networkResponse) => {
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        const responseToCache = networkResponse.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    })
                    .catch(error => {
                        console.error('Service Worker: Pengambilan gagal; jaringan tidak tersedia.', error);
                    });
            })
    );
});
