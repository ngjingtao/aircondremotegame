/* ═══════════════════════════════════════════════════════════
   shared/prepaint.js — set the language before the first paint

   This has to be a real file rather than an inline <script> so the
   Content-Security-Policy does not need 'unsafe-inline' for scripts.
   A plain <script src> in the <head> is render-blocking, so it still runs
   before anything is painted — which is the whole point.

   It reads ARG.config, so shared/config.js must be loaded first.
   ═══════════════════════════════════════════════════════════ */
(function () {
  var d = document.documentElement, l = 'zh';
  var lock = (window.ARG && ARG.config) ? ARG.config.lockLang : null;
  try { l = lock || localStorage.getItem('arg.lang') || 'zh'; } catch (e) { l = lock || 'zh'; }
  if (l !== 'zh' && l !== 'en') l = 'zh';
  d.lang = l === 'zh' ? 'zh-CN' : 'en';
  d.classList.add('i18n-pending');
  setTimeout(function () { d.classList.remove('i18n-pending'); }, 1500);
})();
