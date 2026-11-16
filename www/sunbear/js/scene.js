/* ═══════════════════════════════════════════
   Sun Bear — the picture

   A rainforest scene with one sun bear. Each step brings forward the
   thing it is about: the size ruler, the sun-shaped chest patch, the long
   tongue reaching a hive, the food on the forest floor, the climb up the
   trunk, and the conservation shield.
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.scene = (function () {

  const $ = id => document.getElementById(id);
  let root = null;

  const CLASSES = ['size', 'patch', 'tongue', 'food', 'climb', 'protect'];

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

    const status = $('scene-status');
    if (status) status.textContent = ARG.i18n.t(step.title);
    const note = $('pane-note');
    if (note) note.textContent = ARG.i18n.t('note');
  }

  return { build, show };
})();
