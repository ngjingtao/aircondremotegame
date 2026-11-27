/* restaurant/js/scene.js — bunny, tray and bell */
window.ARG = window.ARG || {};

ARG.scene = (function () {
  let els = {};

  function $(id) { return document.getElementById(id); }
  function setText(el, v) { if (el && el.textContent !== v) el.textContent = v; }

  function build() {
    els.bunny = $('bunny');
    els.tray = $('tray-items');
    els.bell = $('bell');
    els.status = $('scene-status');
    els.scene = $('scene');
  }

  function render() {
    const S = ARG.sim.s;
    const t = ARG.i18n.t;

    if (els.tray) {
      const items = S.served.map(id => ARG.sim.BY_ID[id].ico).join(' ');
      setText(els.tray, items || '🍽️');
    }
    if (els.bunny) {
      els.bunny.classList.toggle('happy', !!S.feedbackOk);
      els.bunny.classList.toggle('waiting', S.phase === 'serve');
    }
    if (els.bell) {
      els.bell.classList.remove('ring');
      if (S.feedbackOk) {
        void els.bell.offsetWidth;
        els.bell.classList.add('ring');
      }
    }

    const key = S.done ? 'statusDone' : (S.phase === 'pay' || S.phase === 'change' ? 'statusPay' : 'statusServe');
    if (els.status) setText(els.status, t(key));
    if (els.scene) els.scene.dataset.phase = S.phase;
  }

  return { build, render };
})();
