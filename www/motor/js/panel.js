/* ═══════════════════════════════════════════
   motor/js/panel.js — power, volts, load, tasks
   ═══════════════════════════════════════════ */
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
    els.fact = $('motor-fact');
    els.power = $('motor-power');
    els.volts = $('volt-row');
    els.loads = $('load-row');
    els.hold = $('btn-hold');
    els.hand = $('btn-hand');
    els.tasks = $('motor-tasks');
    els.heat = $('heat-fill');
    els.heatNum = $('heat-num');
    els.rpm = $('hud-rpm');
    els.amp = $('hud-amp');
    els.temp = $('hud-temp');

    const sim = ARG.sim;
    if (els.volts) {
      els.volts.innerHTML = sim.VOLTS.map(v =>
        '<button class="seg-btn" data-action="volt" data-volt="' + v + '"><b>' + v + 'V</b></button>'
      ).join('');
    }
    if (els.loads) {
      els.loads.innerHTML = sim.LOADS.map(l =>
        '<button class="seg-btn" data-action="load" data-load="' + l.id + '"><b data-i18n="' + l.key + '"></b></button>'
      ).join('');
    }
    if (els.tasks) {
      els.tasks.innerHTML = ['spin', 'load', 'stall', 'hot'].map(k =>
        '<span class="task" data-task="' + k + '"><i>○</i><b data-i18n="task' + k.charAt(0).toUpperCase() + k.slice(1) + '"></b></span>'
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

    const fk = ARG.sim.factKey();
    if (fk !== lastFact) {
      lastFact = fk;
      setText(els.fact, t(fk));
    }

    if (els.rpm) setText(els.rpm, String(Math.round(S.speed)));
    if (els.amp) setText(els.amp, S.current.toFixed(1));
    if (els.temp) setText(els.temp, String(Math.round(S.temp)));

    if (els.power) {
      setText(els.power.querySelector('b'), t(S.power ? 'powerOff' : 'powerOn'));
      els.power.classList.toggle('on', S.power);
      els.power.disabled = S.burnt;
    }
    if (els.volts) {
      els.volts.querySelectorAll('[data-volt]').forEach(b => {
        b.classList.toggle('on', +b.dataset.volt === S.volt);
        b.disabled = S.burnt;
      });
    }
    if (els.loads) {
      els.loads.querySelectorAll('[data-load]').forEach(b => {
        b.classList.toggle('on', +b.dataset.load === S.load);
        b.disabled = S.burnt;
      });
    }
    if (els.hold) {
      els.hold.classList.toggle('on', S.hold);
      els.hold.disabled = S.burnt;
    }
    if (els.hand) {
      els.hand.classList.toggle('on', S.hand);
      els.hand.disabled = S.burnt;
    }

    const pct = Math.max(0, Math.min(100, (S.temp - 25) / 125 * 100));
    if (els.heat) {
      els.heat.style.width = pct + '%';
      els.heat.classList.toggle('hot', S.temp > 80);
      els.heat.classList.toggle('burnt', S.burnt);
    }
    if (els.heatNum) setText(els.heatNum, Math.round(S.temp) + '°');

    if (els.tasks) {
      els.tasks.querySelectorAll('[data-task]').forEach(el => {
        const key = el.dataset.task;
        const done = !!S.seen[key];
        el.classList.toggle('done', done);
        const i = el.querySelector('i');
        if (i) i.textContent = done ? '●' : '○';
      });
    }
  }

  function refresh() { lastFact = ''; }

  return { build, render, refresh };
})();
