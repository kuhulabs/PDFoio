// PDFo.io service worker
// Strategy:
//   - Hashed build assets (Vite emits filenames with content hashes under
//     /assets/) -> cache-first, immutable.
//   - HTML navigations -> network-first with offline fallback to the last
//     cached shell. This keeps users on a fresh build.
//   - Cross-origin fonts (Google Fonts) -> stale-while-revalidate.
// Bump CACHE_VERSION when shipping breaking SW changes; old caches are
// purged on activate.

const CACHE_VERSION = 'v1';
const STATIC_CACHE = `pdfo-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `pdfo-runtime-${CACHE_VERSION}`;
const FONT_CACHE = `pdfo-fonts-${CACHE_VERSION}`;

const APP_SHELL = ['/', '/favicon.svg', '/site.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(APP_SHELL).catch(() => {}))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (k) =>
                k.startsWith('pdfo-') &&
                ![STATIC_CACHE, RUNTIME_CACHE, FONT_CACHE].includes(k),
            )
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

function isHashedAsset(url) {
  // Vite outputs /assets/<name>-<hash>.<ext>
  return url.pathname.startsWith('/assets/');
}

function isFontRequest(url) {
  return (
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com'
  );
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // Skip API + dev/HMR traffic.
  if (sameOrigin && (url.pathname.startsWith('/api/') || url.pathname.startsWith('/@'))) {
    return;
  }

  // Cache-first for hashed build assets — they are immutable.
  if (sameOrigin && isHashedAsset(url)) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        const hit = await cache.match(req);
        if (hit) return hit;
        const res = await fetch(req);
        if (res.ok) cache.put(req, res.clone());
        return res;
      }),
    );
    return;
  }

  // Stale-while-revalidate for Google Fonts.
  if (isFontRequest(url)) {
    event.respondWith(
      caches.open(FONT_CACHE).then(async (cache) => {
        const hit = await cache.match(req);
        const fetchPromise = fetch(req)
          .then((res) => {
            if (res.ok) cache.put(req, res.clone());
            return res;
          })
          .catch(() => hit);
        return hit || fetchPromise;
      }),
    );
    return;
  }

  // Network-first for HTML navigations with offline fallback.
  const isNavigation =
    req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html');
  if (sameOrigin && isNavigation) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put('/', copy));
          return res;
        })
        .catch(async () => {
          const cached = await caches.match('/');
          return cached || new Response('Offline', { status: 503 });
        }),
    );
    return;
  }
});
