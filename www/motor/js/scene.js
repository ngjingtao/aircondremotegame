/* ═══════════════════════════════════════════
   motor/js/scene.js — rotor, fan, heat and smoke
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.scene = (function () {

  let els = {};

  function $(id) { return document.getElementById(id); }
  function setText(el, v) { if (el && el.textContent !== v) el.textContent = v; }
  function opacity(el, v) { if (el) el.style.opacity = String(v); }

  function build() {
    els.rotor = $('rotor');
    els.fan = $('fan');
    els.led = $('gen-led');
    els.heat = $('heat-glow');
    els.smoke = $('smoke');
    els.sparks = $('sparks');
    els.hand = $('hand-icon');
    els.hold = $('hold-icon');
    els.wireTop = $('wire-top');
    els.wireBot = $('wire-bot');
    els.status = $('scene-status');
    els.scene = $('scene');
  }

  function render() {
    const S = ARG.sim.s;
    const t = ARG.i18n.t;

    if (els.rotor) els.rotor.setAttribute('transform', 'rotate(' + S.angle.toFixed(1) + ' 194 246)');
    if (els.fan) els.fan.setAttribute('transform', 'rotate(' + (S.angle * 1.7).toFixed(1) + ' 330 246)');

    const heat = Math.max(0, Math.min(1, (S.temp - 45) / 95));
    opacity(els.heat, heat);
    opacity(els.smoke, S.temp > 105 ? Math.min(1, (S.temp - 105) / 40) : 0);
    opacity(els.sparks, S.burnt ? 1 : 0);
    opacity(els.hand, S.hand ? 1 : 0);
    opacity(els.hold, S.hold ? 1 : 0);
    opacity(els.led, S.gen ? 1 : (S.power ? 0.08 : 0.16));

    const live = S.power && S.current > 0.1;
    if (els.wireTop) els.wireTop.classList.toggle('live', live);
    if (els.wireBot) els.wireBot.classList.toggle('live', live);
    const dur = live ? (1.1 / Math.max(0.3, S.current)).toFixed(2) + 's' : '';
    if (els.wireTop) els.wireTop.style.animationDuration = dur;
    if (els.wireBot) els.wireBot.style.animationDuration = dur;

    const key = ARG.sim.statusKey();
    if (els.status) {
      setText(els.status, t(key));
      els.status.classList.toggle('busy', /Stall|Hot|Burnt|Gen/.test(key));
    }
    if (els.scene) els.scene.dataset.status = key;
  }

  return { build, render };
})();
