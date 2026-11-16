/* ═══════════════════════════════════════════
   Speaker — the picture

   A cutaway speaker: signal, magnet and coil on the left, the cone and
   the sound waves on the right. Each step lights the part it is about;
   the pitch and volume steps swap the waveform.
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.scene = (function () {

  const $ = id => document.getElementById(id);
  let root = null;

  const CLASSES = ['speaker', 'motor', 'signal', 'cone', 'pitch', 'volume'];

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
