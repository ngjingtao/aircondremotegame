/* ═══════════════════════════════════════════
   Light — the picture

   One lamp, one wall, one tree. Each step brings forward the diagram it
   is about: the source and the eye, a straight beam through a slit, the
   tree's shadow, the same shadow when the lamp comes closer, a mirror,
   and a straw in a glass of water.
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.scene = (function () {

  const $ = id => document.getElementById(id);
  let root = null;

  const CLASSES = ['sources', 'straight', 'shadow', 'near', 'mirror', 'refract'];

  function build() {
    root = $('art');
  }

  function show(i) {
    const list = ARG.sim.STEPS;
    const n = Math.max(0, Math.min(list.length - 1, i));
    const step = list[n];
    if (!step) return;

    if (!root) root = $('art');
    if (root) {
      CLASSES.forEach((c, k) => root.classList.toggle(c, k === n));
      const parts = root.querySelectorAll('[data-lab]');
      Array.prototype.forEach.call(parts, p => {
        const labs = String(p.dataset.lab || '').split(/\s+/);
        p.classList.toggle('on', labs.indexOf(step.scene) >= 0);
      });
    }

    if (ARG.art) ARG.art.show('light', n);
    const status = $('scene-status');
    if (status) status.textContent = ARG.i18n.t(step.title);
    const note = $('pane-note');
    if (note) note.textContent = ARG.i18n.t('note');
  }

  return { build, show };
})();
