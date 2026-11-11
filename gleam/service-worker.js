const scope = new URL(self.registration.scope);
const assets = new URL('../assets/', scope);
const cachePrefix = `dice-roller:${scope.pathname}:`;
const cacheName = cachePrefix + "8b2f3d93eb1892d0b7c75f3ba5b38b94d569ba3fc61cf9a1e03fa046ffbb8da2";
const precache = new Set(["index.html", "manifest.json", "app.js", "../assets/android-chrome-192x192.png", "../assets/android-chrome-512x512.png", "../assets/apple-touch-icon.png", "../assets/brand-die.png", "../assets/dm-sans-OFL.txt", "../assets/dm-sans.woff2", "../assets/favicon-16x16.png", "../assets/favicon-32x32.png", "../assets/favicon.ico", "../assets/ibm-plex-mono-OFL.txt", "../assets/ibm-plex-mono-medium.woff2", "../assets/ibm-plex-mono-regular.woff2", "../assets/inter-OFL.txt", "../assets/inter.woff2", "../assets/offline-icons.json", "../assets/style.css", "../assets/icons/icons.json"].map((path) => new URL(path, scope).href));
const indexUrl = new URL('index.html', scope).href;
const iconPackUrl = new URL('offline-icons.json', assets).href;
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
        await Promise.all(names.filter((name) => name !== cacheName && name.startsWith(cachePrefix))
            .map((name) => caches.delete(name)));
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
    if (request.method !== 'GET' || url.origin !== scope.origin || (!url.pathname.startsWith(scope.pathname) && !url.pathname.startsWith(assets.pathname))) {
        return;
    }

    const path = url.pathname.startsWith(assets.pathname) ? url.pathname.slice(assets.pathname.length) : url.pathname.slice(scope.pathname.length);
    if (request.mode === 'navigate' && (path === '' || path === 'index.html')) {
        // Shared state lives in the query string and uses the same app shell.
        event.respondWith(cachedAsset(indexUrl).then((response) => response || fetch(request)));
    } else if (precache.has(url.href)) {
        event.respondWith(cachedAsset(url.href).then((response) => response || fetch(request)));
    } else if (path.startsWith('icons/') && path.endsWith('.svg')) {
        event.respondWith(serveIcon(path, request));
    }
});
