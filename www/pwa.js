/* ═══════════════════════════════════════════════════════════
   pwa.js — registers the service worker

   Included by every page. Works out its own path from the <script>
   src so it does not matter whether the page is at the root or one
   level down.
   ═══════════════════════════════════════════════════════════ */
(function () {

  /* service workers need http(s) — skip file:// and old browsers */
  if (!('serviceWorker' in navigator)) return;
  if (location.protocol !== 'http:' && location.protocol !== 'https:') return;

  var me = document.currentScript;
  if (!me) {
    var all = document.getElementsByTagName('script');
    me = all[all.length - 1];
  }
  var src = (me && me.getAttribute('src')) || 'pwa.js';
  var swUrl = src.replace(/pwa\.js(\?.*)?$/, 'sw.js');

  window.addEventListener('load', function () {
    navigator.serviceWorker.register(swUrl).catch(function () { /* offline is a bonus, never fatal */ });
  });

  /* A new worker precaches new HTML and JS. Without this, a tab that was
     open during a deploy can keep the old scripts while the network serves
     the new HTML — which is how the topic menu can look empty. */
  var hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (!hadController || window.__swReloading) return;
    window.__swReloading = true;
    window.location.reload();
  });

  /* standalone (home-screen) mode gets a class so CSS can tweak if needed */
  var standalone = ('standalone' in navigator && navigator.standalone) ||
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
    (window.matchMedia && window.matchMedia('(display-mode: fullscreen)').matches);
  if (standalone) {
    document.documentElement.classList.add('standalone');
  }

})();
