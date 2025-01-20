/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/static/js/bundle.js',
    '/static/js/main.chunk.js',
    '/static/js/0.chunk.js',
    '/static/css/main.css',
    '/manifest.json',
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(urlsToCache);
        })
    );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[ServiceWorker] Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Interceptar solicitudes de red
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
// Exportar la función register para el uso en el archivo index.js
export function register() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
            navigator.serviceWorker
                .register(swUrl)
                .then((registration) => {
                    console.log('Service Worker registrado con éxito:', registration);
                })
                .catch((error) => {
                    console.log('Error al registrar el Service Worker:', error);
                });
        });
    }
}