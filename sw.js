// Service Worker for PWA offline support
const CACHE_NAME = 'shaun-portfolio-v7';
const OFFLINE_URL = '/offline.html';

// API domains that should NEVER be intercepted by the service worker
// These requests go directly to the network without any caching
const API_DOMAINS = [
    'api.solidrust.ai',
    'console.solidrust.ai',
    'artemis.hq.solidrust.net'
];

const urlsToCache = [
    '/',
    '/index.html',
    '/offline.html',
    '/manifest.json',
    // CSS files
    '/assets/css/main.css',
    '/assets/css/z-index.css',
    '/assets/css/dynamic.css',
    '/assets/css/github-integration.css',
    '/assets/css/accessibility.css',
    '/assets/css/chat.css',
    '/assets/css/resume.css',
    // JS files
    '/assets/js/main.js',
    '/assets/js/theme.js',
    '/assets/js/animations.js',
    '/assets/js/github-integration.js',
    '/assets/js/testimonials.js',
    '/assets/js/pwa-install.js',
    '/assets/js/accessibility.js',
    '/assets/js/chat.js',
    '/assets/js/resume.js',
    // Other assets
    '/shaun-prince-resume.pdf',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// External CDN resources (cache on first use)
const cdnResources = [
    'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js',
    'https://cdn.jsdelivr.net/npm/typed.js@2.0.12',
    'https://unpkg.com/aos@2.3.1/dist/aos.css',
    'https://unpkg.com/aos@2.3.1/dist/aos.js'
];

// Install Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                // Cache local resources first
                return cache.addAll(urlsToCache.filter(url => !url.startsWith('http')))
                    .then(() => {
                        // Then try to cache external resources (don't fail if they're unavailable)
                        return Promise.allSettled(
                            urlsToCache.filter(url => url.startsWith('http'))
                                .map(url => cache.add(url).catch(err => console.log('Could not cache:', url)))
                        );
                    });
            })
            .then(() => self.skipWaiting())
    );
});

// Activate Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch strategy: Network first, falling back to cache, then offline page
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip chrome-extension and other non-http(s) requests
    if (!event.request.url.startsWith('http')) {
        return;
    }

    // IMPORTANT: Skip API domains entirely - let them go directly to network
    // This prevents CORS issues and ensures API requests are never cached
    const url = new URL(event.request.url);
    if (API_DOMAINS.some(domain => url.hostname === domain)) {
        return;
    }

    event.respondWith(
        // Try network first
        fetch(event.request)
            .then(response => {
                // Check if valid response
                if (!response || response.status !== 200) {
                    return response;
                }

                // Clone the response
                const responseToCache = response.clone();

                // Cache the response for future use
                caches.open(CACHE_NAME)
                    .then(cache => {
                        // Only cache same-origin requests or explicitly allowed CDN resources
                        if (event.request.url.startsWith(self.location.origin) ||
                            cdnResources.some(cdn => event.request.url.startsWith(cdn.split('/').slice(0, 3).join('/')))) {
                            cache.put(event.request, responseToCache);
                        }
                    });

                return response;
            })
            .catch(() => {
                // Network failed, try cache
                return caches.match(event.request)
                    .then(cachedResponse => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }

                        // If it's a navigation request, show offline page
                        if (event.request.mode === 'navigate') {
                            return caches.match(OFFLINE_URL);
                        }

                        // For other resources, return a simple error response
                        return new Response('Network error', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
            })
    );
});

// Handle messages from the main thread
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Background sync for form submissions (if supported)
self.addEventListener('sync', event => {
    if (event.tag === 'contact-form-sync') {
        event.waitUntil(syncContactForm());
    }
});

async function syncContactForm() {
    // This would handle background form sync when online
    // Implementation depends on your backend
    console.log('Background sync triggered for contact form');
}
