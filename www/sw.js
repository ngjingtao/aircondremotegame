/* ═══════════════════════════════════════════════════════════
   sw.js — offline cache for Play & Learn

   Everything is static, so we precache the lot and then serve
   cache-first while quietly refreshing in the background.
   Bump CACHE when you ship a change.
   ═══════════════════════════════════════════════════════════ */

const CACHE = 'play-learn-31-2';

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
  'shared/prepaint.js',
  'shared/store.js',
  'shared/lang.js',
  'shared/progress.js',
  'shared/audio.js',
  'shared/voice.js',
  'shared/shell.js',
  'shared/a11y.js',
  'shared/lesson.js',
  'shared/lesson.css',

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

  'indah/index.html',
  'indah/indah.css',
  'indah/js/i18n.js',
  'indah/js/state.js',
  'indah/js/scene.js',
  'indah/js/panel.js',
  'indah/js/main.js',

  'hood/index.html',
  'hood/hood.css',
  'hood/js/i18n.js',
  'hood/js/state.js',
  'hood/js/scene.js',
  'hood/js/panel.js',
  'hood/js/main.js',

  'laundry/index.html',
  'laundry/laundry.css',
  'laundry/js/i18n.js',
  'laundry/js/state.js',
  'laundry/js/scene.js',
  'laundry/js/panel.js',
  'laundry/js/main.js',

  'tree/index.html',
  'tree/tree.css',
  'tree/js/i18n.js',
  'tree/js/state.js',
  'tree/js/scene.js',
  'tree/js/panel.js',
  'tree/js/main.js',

  'sandwich/index.html',
  'sandwich/sandwich.css',
  'sandwich/js/i18n.js',
  'sandwich/js/state.js',
  'sandwich/js/scene.js',
  'sandwich/js/panel.js',
  'sandwich/js/main.js',

  'waterhome/index.html',
  'waterhome/waterhome.css',
  'waterhome/js/i18n.js',
  'waterhome/js/state.js',
  'waterhome/js/scene.js',
  'waterhome/js/panel.js',
  'waterhome/js/main.js',

  'cycle/index.html',
  'cycle/cycle.css',
  'cycle/js/i18n.js',
  'cycle/js/state.js',
  'cycle/js/scene.js',
  'cycle/js/panel.js',
  'cycle/js/main.js',

  'weather/index.html',
  'weather/weather.css',
  'weather/js/i18n.js',
  'weather/js/state.js',
  'weather/js/scene.js',
  'weather/js/panel.js',
  'weather/js/main.js',

  'engine/index.html',
  'engine/engine.css',
  'engine/js/i18n.js',
  'engine/js/state.js',
  'engine/js/scene.js',
  'engine/js/panel.js',
  'engine/js/main.js',

  'electric/index.html',
  'electric/electric.css',
  'electric/js/i18n.js',
  'electric/js/state.js',
  'electric/js/scene.js',
  'electric/js/main.js',

  'magnet/index.html',
  'magnet/magnet.css',
  'magnet/js/i18n.js',
  'magnet/js/state.js',
  'magnet/js/scene.js',
  'magnet/js/main.js',

  'light/index.html',
  'light/light.css',
  'light/js/i18n.js',
  'light/js/state.js',
  'light/js/scene.js',
  'light/js/main.js',

  'sunbear/index.html',
  'sunbear/sunbear.css',
  'sunbear/js/i18n.js',
  'sunbear/js/state.js',
  'sunbear/js/scene.js',
  'sunbear/js/main.js',

  'speaker/index.html',
  'speaker/speaker.css',
  'speaker/js/i18n.js',
  'speaker/js/state.js',
  'speaker/js/scene.js',
  'speaker/js/main.js',

  'computer/index.html',
  'computer/computer.css',
  'computer/js/i18n.js',
  'computer/js/state.js',
  'computer/js/scene.js',
  'computer/js/main.js',

  'power/index.html',
  'power/power.css',
  'power/js/i18n.js',
  'power/js/state.js',
  'power/js/scene.js',
  'power/js/main.js',

  'safety/index.html',
  'safety/safety.css',
  'safety/js/i18n.js',
  'safety/js/state.js',
  'safety/js/scene.js',
  'safety/js/main.js',

  'motor/index.html',
  'motor/motor.css',
  'motor/js/i18n.js',
  'motor/js/state.js',
  'motor/js/scene.js',
  'motor/js/panel.js',
  'motor/js/main.js',

  'camera/index.html',
  'camera/camera.css',
  'camera/js/i18n.js',
  'camera/js/state.js',
  'camera/js/scene.js',
  'camera/js/panel.js',
  'camera/js/main.js',

  'testpanel/index.html',
  'testpanel/testpanel.css',
  'testpanel/js/i18n.js',
  'testpanel/js/state.js',
  'testpanel/js/scene.js',
  'testpanel/js/panel.js',
  'testpanel/js/main.js',

  'kitlab/index.html',
  'kitlab/kitlab.css',
  'kitlab/js/i18n.js',
  'kitlab/js/state.js',
  'kitlab/js/scene.js',
  'kitlab/js/panel.js',
  'kitlab/js/main.js',

  'ear/index.html',
  'ear/ear.css',
  'ear/js/i18n.js',
  'ear/js/state.js',
  'ear/js/scene.js',
  'ear/js/main.js',

  'eye/index.html',
  'eye/eye.css',
  'eye/js/i18n.js',
  'eye/js/state.js',
  'eye/js/scene.js',
  'eye/js/main.js',

  'rainbow/index.html',
  'rainbow/rainbow.css',
  'rainbow/js/i18n.js',
  'rainbow/js/state.js',
  'rainbow/js/scene.js',
  'rainbow/js/main.js',

  'baggage/index.html',
  'baggage/baggage.css',
  'baggage/js/i18n.js',
  'baggage/js/state.js',
  'baggage/js/scene.js',
  'baggage/js/panel.js',
  'baggage/js/main.js'
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

  /* Narration must never come from the offline cache: it is synthesized on
     demand and can fail; the page has a device-voice fallback for that. */
  if (/\/tts\/?$/.test(url.pathname)) return;

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
