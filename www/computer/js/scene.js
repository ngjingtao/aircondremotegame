/* ═══════════════════════════════════════════
   Computer — the picture

   A laptop above, its inside below. Each step lights one job: input,
   processor, memory, storage, output, and the program/binary layer.
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.scene = (function () {

  const $ = id => document.getElementById(id);
  let root = null;

  const CLASSES = ['input', 'cpu', 'ram', 'storage', 'output', 'program'];

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

    if (ARG.art) ARG.art.show('computer', n);
    const status = $('scene-status');
    if (status) status.textContent = ARG.i18n.t(step.title);
    const note = $('pane-note');
    if (note) note.textContent = ARG.i18n.t('note');
  }

  return { build, show };
})();
