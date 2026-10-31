/* ═══════════════════════════════════════════════════════════
   shared/shell.js — the collapsible control panel

   Adds the ◧ button that folds the controls away, marks the
   pages that have a control panel, and — on a portrait phone —
   stacks the scene above a full-width, scrollable control sheet
   so neither the illustration nor the text is squeezed.
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

  /* A phone in portrait cannot show a 300×640 control panel beside the scene:
     the panel would be about 220 px wide and the illustration 170 px. The
     media query in ui.css stacks them instead — scene on top, controls in a
     full-width sheet below. The class marks the pages that have a panel at
     all, so the train (which uses a bottom cab bar) is left alone. */
  function isStacked() {
    return !!(window.matchMedia &&
      window.matchMedia('(max-width:699px) and (orientation:portrait)').matches);
  }

  function stackPanel(o) {
    if (!o || !o.panel || !o.scaler) return;
    /* scale by the width of the screen, not its height: the sheet scrolls, so
       the controls get bigger instead of shrinking to fit the whole design */
    const scale = Math.max(0.5,
      Math.min((o.panel.clientWidth - 16) / o.w, o.maxScale || 1.25));
    document.documentElement.style.setProperty(o.varName, scale);
    o.scaler.style.width = (o.w * scale) + 'px';
    o.scaler.style.height = (o.h * scale) + 'px';
    o.panel.style.flexBasis = '';
  }

  function attach() {
    const b = document.getElementById('btn-panel');
    const panel = document.getElementById('ctl-panel') ||
      document.getElementById('remote-panel') ||
      document.getElementById('deck-panel') ||
      document.getElementById('panel-panel');
    const main = document.querySelector('main');
    if (panel && main) main.classList.add('has-panel');
    if (!b) return;
    /* always start expanded so the controls are right there — the fold button
       is there for when you want the whole screen for the illustration */
    const start = ARG.store.get(KEY) === '1';
    apply(start);
    b.addEventListener('click', () => { toggle(); ARG.audio && ARG.audio.blip && ARG.audio.blip(); });
  }

  return { attach, toggle, isCollapsed, isStacked, stackPanel };
})();
