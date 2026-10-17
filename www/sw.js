/* ═══════════════════════════════════════════════════════════
   sw.js — offline cache for Play & Learn

   Everything is static, so we precache the lot and then serve
   cache-first while quietly refreshing in the background.
   Bump CACHE when you ship a change.
   ═══════════════════════════════════════════════════════════ */

const CACHE = 'play-learn-4a3e547';

const ASSETS = [
  './',
  'index.html',
  'home.css',
  'home.js',
  'manifest.webmanifest',
  'pwa.js',

  'icons/icon-120.png',
  'icons/icon-152.png',
  'icons/icon-167.png',
  'icons/icon-180.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/icon-32.png',

  'shared/ui.css',
  'shared/config.js',
  'shared/store.js',
  'shared/audio.js',
  'shared/voice.js',
  'shared/shell.js',
  'shared/a11y.js',

  'aircond/index.html',
  'aircond/aircond.css',
  'aircond/js/i18n.js',
  'aircond/js/state.js',
  'aircond/js/remote.js',
  'aircond/js/room.js',
  'aircond/js/main.js',

  'food/index.html',
  'food/food.css',
  'food/js/i18n.js',
  'food/js/state.js',
  'food/js/body.js',
  'food/js/deck.js',
  'food/js/main.js',

  'train/index.html',
  'train/train.css',
  'train/js/i18n.js',
  'train/js/state.js',
  'train/js/scene.js',
  'train/js/cab.js',
  'train/js/main.js',

  'breath/index.html',
  'breath/breath.css',
  'breath/js/i18n.js',
  'breath/js/state.js',
  'breath/js/scene.js',
  'breath/js/panel.js',
  'breath/js/main.js',

  'aircare/index.html',
  'aircare/aircare.css',
  'aircare/js/i18n.js',
  'aircare/js/state.js',
  'aircare/js/scene.js',
  'aircare/js/panel.js',
  'aircare/js/main.js',

  'toilet/index.html',
  'toilet/toilet.css',
  'toilet/js/i18n.js',
  'toilet/js/state.js',
  'toilet/js/scene.js',
  'toilet/js/panel.js',
  'toilet/js/main.js',

  'hood/index.html',
  'hood/hood.css',
  'hood/js/i18n.js',
  'hood/js/state.js',
  'hood/js/scene.js',
  'hood/js/panel.js',
  'hood/js/main.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (e) { return; }
  if (url.origin !== self.location.origin) return;

  /* Page loads go to the network first, so a new deploy is picked up on the
     very next launch — no waiting for a cache-version bump or a double refresh.
     If there is no connection, we fall back to the cached copy. */
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(req).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => caches.match(req).then(hit => hit || caches.match('index.html')))
    );
    return;
  }

  /* Everything else is cache-first with a background refresh: instant, and
     still available with no connection. */
  event.respondWith(
    caches.match(req).then(hit => {
      const fresh = fetch(req).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => hit);

      return hit || fresh;
    })
  );
});
