/* ═══════════════════════════════════════════════════════════
   shared/shell.js — the collapsible control panel

   On a phone the two-column layout gives the illustration only
   about half the width. This adds a ◧ button in the top bar that
   folds the control panel away so the scene gets the whole screen.
   ═══════════════════════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.shell = (function () {

  const KEY = 'arg.panelCollapsed';

  function isCollapsed() {
    return document.documentElement.classList.contains('panel-collapsed');
  }

  function apply(collapsed) {
    document.documentElement.classList.toggle('panel-collapsed', collapsed);
    const b = document.getElementById('btn-panel');
    if (b) {
      b.textContent = collapsed ? '▣' : '◧';
      b.title = collapsed ? 'Show controls' : 'Hide controls';
      b.classList.toggle('on', collapsed);
    }
  }

  function toggle() {
    const next = !isCollapsed();
    apply(next);
    ARG.store.set(KEY, next ? '1' : '0');
    if (window.dispatchEvent) window.dispatchEvent(new Event('resize'));
    return next;
  }

  function attach() {
    const b = document.getElementById('btn-panel');
    if (!b) return;
    /* always start expanded so the controls are right there — the fold button
       is there for when you want the whole screen for the illustration */
    const start = ARG.store.get(KEY) === '1';
    apply(start);
    b.addEventListener('click', () => { toggle(); ARG.audio && ARG.audio.blip && ARG.audio.blip(); });
  }

  return { attach, toggle, isCollapsed };
})();
