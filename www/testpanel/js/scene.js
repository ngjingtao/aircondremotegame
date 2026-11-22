/* testpanel/js/scene.js — the yellow board, meter and RCD */
window.ARG = window.ARG || {};

ARG.scene = (function () {
  let els = {};

  function $(id) { return document.getElementById(id); }
  function setText(el, v) { if (el && el.textContent !== v) el.textContent = v; }
  function opacity(el, v) { if (el) el.style.opacity = String(v); }

  function build() {
    els.meterW = $('meter-w');
    els.meterKwh = $('meter-kwh');
    els.rcd = $('rcd');
    els.lever = $('rcd-lever');
    els.trip = $('rcd-trip');
    els.glow = $('load-glow');
    els.status = $('scene-status');
    els.scene = $('scene');
  }

  function render() {
    const S = ARG.sim.s;
    const t = ARG.i18n.t;
    const watts = ARG.sim.power();
    const current = ARG.sim.current();

    if (els.meterW) setText(els.meterW, (watts < 1 && watts > 0 ? watts.toFixed(1) : Math.round(watts)) + ' W');
    if (els.meterKwh) setText(els.meterKwh, S.energy.toFixed(3) + ' kWh');

    document.querySelectorAll('.load-part').forEach(el => {
      el.classList.toggle('on', S.load === el.dataset.part);
    });
    if (els.glow) opacity(els.glow, watts > 0 ? 0.32 : 0);

    if (els.lever) els.lever.setAttribute('y', S.rcd && !S.tripped ? '164' : '174');
    if (els.rcd) {
      els.rcd.classList.toggle('off', !S.rcd || S.tripped);
      els.rcd.classList.toggle('tripped', S.tripped);
    }
    if (els.trip) opacity(els.trip, S.tripped ? 0.95 : 0.35);

    const key = ARG.sim.statusKey();
    if (els.status) {
      const text = t(key);
      setText(els.status, text + (watts > 0 ? ' · ' + (watts < 1 ? watts.toFixed(1) : Math.round(watts)) + ' W' : ''));
      els.status.classList.toggle('busy', key === 'statusTripped' || key === 'statusStandby');
    }
    if (els.scene) els.scene.dataset.status = key;
    void current;
  }

  return { build, render };
})();
