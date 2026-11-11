const scope = new URL(self.registration.scope);
const cachePrefix = `dice-roller:${scope.pathname}:`;
const cacheName = cachePrefix + "4cfd32c0e03014160fdc6feb6e6de1a0b08c69fc4e361bd0c6de6822ad30d9e6";
const precache = new Set(["main.js", "android-chrome-192x192.png", "android-chrome-512x512.png", "app.js", "apple-touch-icon.png", "favicon-16x16.png", "favicon-32x32.png", "favicon.ico", "index.html", "instrument-sans-OFL.txt", "instrument-sans.woff2", "manifest.json", "style.css", "icons/icons.json", "offline-icons.json"].map((path) => new URL(path, scope).href));
const indexUrl = new URL('index.html', scope).href;
const iconPackUrl = new URL('offline-icons.json', scope).href;
let iconPack;

self.addEventListener('install', (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open(cacheName);
        // Bypass the HTTP cache when installing a new version of these URLs.
        await cache.addAll([...precache].map((url) => new Request(url, { cache: 'reload' })));
        await self.skipWaiting();
    })());
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const names = await caches.keys();
        await Promise.all(names.filter((name) => name !== cacheName && (
            name.startsWith(cachePrefix) || name === 'dice-roller-v1'
        )).map((name) => caches.delete(name)));
        await self.clients.claim();
    })());
});

async function cachedAsset(url) {
    return (await caches.open(cacheName)).match(url);
}

async function serveIcon(path, request) {
    // Keep all pictograms available offline with one download.
    iconPack ??= cachedAsset(iconPackUrl).then((response) => response?.json());
    const svg = (await iconPack)?.[path];
    if (svg === undefined) {
        return fetch(request);
    }
    return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
}

self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);
    if (request.method !== 'GET' || url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) {
        return;
    }

    const path = url.pathname.slice(scope.pathname.length);
    if (request.mode === 'navigate' && (path === '' || path === 'index.html')) {
        // Shared state lives in the query string and uses the same app shell.
        event.respondWith(cachedAsset(indexUrl).then((response) => response || fetch(request)));
    } else if (precache.has(url.href)) {
        event.respondWith(cachedAsset(url.href).then((response) => response || fetch(request)));
    } else if (path.startsWith('icons/') && path.endsWith('.svg')) {
        event.respondWith(serveIcon(path, request));
    }
});
