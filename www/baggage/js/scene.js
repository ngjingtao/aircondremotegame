/* baggage/js/scene.js — belt, scanner and bag movement */
window.ARG = window.ARG || {};

ARG.scene = (function () {
  let els = {};

  function $(id) { return document.getElementById(id); }
  function setText(el, v) { if (el && el.textContent !== v) el.textContent = v; }
  function opacity(el, v) { if (el) el.style.opacity = String(v); }

  function build() {
    els.bag = $('bag-token');
    els.code = $('bag-code');
    els.scan = $('scan-beam');
    els.status = $('scene-status');
    els.scene = $('scene');
  }

  function render() {
    const S = ARG.sim.s;
    const t = ARG.i18n.t;
    const b = ARG.sim.bag();
    const pct = S.running ? Math.min(1, S.t / S.duration) : (S.done ? 1 : 0);
    const x = 90 + pct * 160;

    if (els.bag) els.bag.setAttribute('transform', 'translate(' + x.toFixed(1) + ' 0)');
    if (els.code) setText(els.code, b.code);
    if (els.scan) opacity(els.scan, (S.running && pct > 0.15 && pct < 0.45) ? 0.95 : 0.2);

    const key = S.done ? 'statusDone' : (S.running ? 'statusRun' : 'statusIdle');
    if (els.status) setText(els.status, t(key));
    if (els.scene) els.scene.dataset.state = S.done ? 'done' : (S.running ? 'run' : 'idle');
  }

  return { build, render };
})();
