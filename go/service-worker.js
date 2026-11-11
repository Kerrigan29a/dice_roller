const scope = new URL(self.registration.scope);
const cachePrefix = `dice-roller:${scope.pathname}:`;
const cacheName = cachePrefix + "bbcd9d1badb36aeb842085189e5f7639d1d0a2f7459191d5d3a3cbab08841263";
const assets = ["PinClipart.com_d20-clipart_5238132.png", "android-chrome-192x192.png", "android-chrome-512x512.png", "app.wasm", "apple-touch-icon.png", "favicon-16x16.png", "favicon-32x32.png", "favicon.ico", "index.html", "main.js", "manifest.json", "style.css", "wasm_exec.js"];
const indexUrl = new URL('index.html', scope).href;

self.addEventListener('install', (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open(cacheName);
        await cache.addAll(assets.map((path) => new Request(new URL(path, scope), { cache: 'reload' })));
        await self.skipWaiting();
    })());
});
self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(keys.filter((key) => key.startsWith(cachePrefix) && key !== cacheName)
            .map((key) => caches.delete(key)));
        await self.clients.claim();
    })());
});
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    if (event.request.method !== 'GET' || url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
    const path = url.pathname.slice(scope.pathname.length);
    const key = event.request.mode === 'navigate' && (path === '' || path === 'index.html') ? indexUrl : event.request;
    event.respondWith(caches.open(cacheName).then(async (cache) => (await cache.match(key)) || fetch(event.request)));
});
