/* ═══════════════════════════════════════════════════════════
   sw.js — offline cache for Play & Learn

   Everything is static, so we precache the lot and then serve
   cache-first while quietly refreshing in the background.
   Bump CACHE when you ship a change.
   ═══════════════════════════════════════════════════════════ */

const CACHE = 'play-learn-v2';

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
  'shared/store.js',
  'shared/audio.js',

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
  'aircare/js/main.js'
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

  event.respondWith(
    caches.match(req).then(hit => {
      /* refresh the cached copy in the background */
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
