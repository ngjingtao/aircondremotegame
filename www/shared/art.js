/* ═══════════════════════════════════════════════════════════
   shared/art.js — optional illustrated plates for the lessons

   The lesson scenes are hand-drawn SVG today. When AI-generated
   illustrations exist, this swaps in one plate per step and keeps the
   SVG as the fallback. Nothing is requested until config.art.lessons
   is true, so a missing folder never produces 404s.

   Contract: www/art/lessons/<activity>/<01..06>.webp, 1024×1536,
   no baked-in text; see docs/art/.
   ═══════════════════════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.art = (function () {

  function enabled(name) {
    return !!(ARG.config && ARG.config.art && ARG.config.art[name]);
  }

  function show(dir, step) {
    if (!enabled('lessons')) return false;
    const img = document.getElementById('art-plate');
    if (!img) return false;
    const svg = document.getElementById('art');
    const src = '../art/lessons/' + dir + '/' + String(step + 1).padStart(2, '0') + '.webp';
    if (img.getAttribute('data-src') === src) return true;
    img.setAttribute('data-src', src);

    img.onload = function () {
      img.hidden = false;
      if (svg) svg.style.display = 'none';
    };
    img.onerror = function () {
      img.hidden = true;
      if (svg) svg.style.display = '';
    };
    img.src = src;
    return true;
  }

  return { show: show, enabled: enabled };
})();
