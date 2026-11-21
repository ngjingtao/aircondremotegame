/* camera/js/panel.js — controls and tasks */
window.ARG = window.ARG || {};

ARG.panel = (function () {

  const T = () => ARG.i18n.t;
  let els = {};
  let onAction = null;
  let lastFact = '';

  function $(id) { return document.getElementById(id); }
  function setText(el, v) { if (el && el.textContent !== v) el.textContent = v; }

  function build(handler) {
    onAction = handler;
    els.fact = $('camera-fact');
    els.scenes = $('scene-row');
    els.shutter = $('shutter-row');
    els.iso = $('iso-row');
    els.aperture = $('aperture-row');
    els.tasks = $('camera-tasks');
    els.hudShutter = $('hud-shutter');
    els.hudIso = $('hud-iso');
    els.hudAperture = $('hud-aperture');

    const sim = ARG.sim;
    if (els.scenes) {
      els.scenes.innerHTML = sim.SCENES.map((s, i) =>
        '<button class="seg-btn" data-action="scene" data-i="' + i + '"><b data-i18n="' + s.key + '"></b></button>'
      ).join('');
    }
    if (els.shutter) {
      els.shutter.innerHTML = sim.SHUTTERS.map((s, i) =>
        '<button class="seg-btn" data-action="shutter" data-i="' + i + '"><b>' + s.label + '</b></button>'
      ).join('');
    }
    if (els.iso) {
      els.iso.innerHTML = sim.ISOS.map((v, i) =>
        '<button class="seg-btn" data-action="iso" data-i="' + i + '"><b>' + v + '</b></button>'
      ).join('');
    }
    if (els.aperture) {
      els.aperture.innerHTML = sim.APERTURES.map((a, i) =>
        '<button class="seg-btn" data-action="aperture" data-i="' + i + '"><b>' + a.label + '</b></button>'
      ).join('');
    }
    if (els.tasks) {
      els.tasks.innerHTML = sim.SCENES.map(s =>
        '<span class="task" data-task="' + s.id + '"><i>○</i><b data-i18n="task' + s.id.charAt(0).toUpperCase() + s.id.slice(1) + '"></b></span>'
      ).join('');
    }

    const ctl = $('ctl');
    if (ctl) {
      ctl.addEventListener('pointerdown', ev => {
        const b = ev.target && ev.target.closest ? ev.target.closest('[data-action]') : null;
        if (!b) return;
        ev.preventDefault();
        if (navigator.vibrate) { try { navigator.vibrate(10); } catch (e) {} }
        b.classList.add('pressed');
        setTimeout(() => b.classList.remove('pressed'), 130);
        onAction(b.dataset.action, b);
      });
    }
  }

  function render() {
    const S = ARG.sim.s;
    const t = T();

    const fk = S.focus === 'iso' ? 'factIso' : (S.focus === 'aperture' ? 'factAperture' : 'factShutter');
    if (fk !== lastFact) { lastFact = fk; setText(els.fact, t(fk)); }

    if (els.scenes) els.scenes.querySelectorAll('[data-i]').forEach(b => b.classList.toggle('on', +b.dataset.i === S.scene));
    if (els.shutter) els.shutter.querySelectorAll('[data-i]').forEach(b => b.classList.toggle('on', +b.dataset.i === S.shutter));
    if (els.iso) els.iso.querySelectorAll('[data-i]').forEach(b => b.classList.toggle('on', +b.dataset.i === S.iso));
    if (els.aperture) els.aperture.querySelectorAll('[data-i]').forEach(b => b.classList.toggle('on', +b.dataset.i === S.aperture));

    if (els.hudShutter) setText(els.hudShutter, ARG.sim.shutter().label);
    if (els.hudIso) setText(els.hudIso, String(ARG.sim.iso()));
    if (els.hudAperture) setText(els.hudAperture, ARG.sim.aperture().label);

    if (els.tasks) {
      els.tasks.querySelectorAll('[data-task]').forEach(el => {
        const done = S.seen.indexOf(el.dataset.task) >= 0;
        el.classList.toggle('done', done);
        const i = el.querySelector('i');
        if (i) i.textContent = done ? '●' : '○';
      });
    }
  }

  function refresh() { lastFact = ''; }

  return { build, render, refresh };
})();
