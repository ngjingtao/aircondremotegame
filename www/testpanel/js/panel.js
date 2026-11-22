/* testpanel/js/panel.js — loads, RCD and tasks */
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
    els.fact = $('panel-fact');
    els.loads = $('load-row');
    els.modelWrap = $('model-wrap');
    els.models = $('model-row');
    els.rcd = $('btn-rcd');
    els.short = $('btn-short');
    els.test = $('test-btn');
    els.reset = $('reset-btn');
    els.tasks = $('panel-tasks');
    els.hudW = $('hud-w');
    els.hudKwh = $('hud-kwh');
    els.hudRcd = $('hud-rcd');

    const sim = ARG.sim;
    if (els.loads) {
      els.loads.innerHTML = sim.LOADS.map(l =>
        '<button class="load-btn" data-action="load" data-load="' + l.id + '"><b data-i18n="' + l.key + '"></b></button>'
      ).join('');
    }
    if (els.tasks) {
      els.tasks.innerHTML = ['none', 'load', 'standby', 'test', 'short'].map(k =>
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

  function renderModels() {
    const list = ARG.sim.modelList();
    if (!els.modelWrap || !els.models) return;
    if (!list) { els.modelWrap.hidden = true; return; }
    els.modelWrap.hidden = false;
    const sig = list.map(m => m.id).join(',') + '|' + ARG.sim.s.model;
    if (els.models.dataset.sig !== sig) {
      els.models.dataset.sig = sig;
      els.models.innerHTML = list.map((m, i) =>
        '<button class="model-btn" data-action="model" data-i="' + i + '"><b data-i18n="' + m.key + '"></b></button>'
      ).join('');
      ARG.i18n.apply(els.models);
    }
    els.models.querySelectorAll('[data-i]').forEach(b => b.classList.toggle('on', +b.dataset.i === ARG.sim.s.model));
  }

  function render() {
    const S = ARG.sim.s;
    const t = T();
    renderModels();

    const fk = ARG.sim.factKey();
    if (fk !== lastFact) { lastFact = fk; setText(els.fact, t(fk)); }

    if (els.loads) els.loads.querySelectorAll('[data-load]').forEach(b => b.classList.toggle('on', b.dataset.load === S.load));
    if (els.rcd) {
      setText(els.rcd.querySelector('b'), t(S.rcd && !S.tripped ? 'rcdOff' : 'rcdOn'));
      els.rcd.classList.toggle('on', S.rcd && !S.tripped);
      els.rcd.disabled = S.tripped;
    }
    if (els.test) els.test.disabled = S.tripped || !S.rcd || S.short;
    if (els.short) els.short.disabled = S.tripped || S.short;
    if (els.reset) els.reset.disabled = !(S.tripped || S.short);

    if (els.hudW) setText(els.hudW, Math.round(ARG.sim.power() * 10) / 10 + ' W');
    if (els.hudKwh) setText(els.hudKwh, S.energy.toFixed(3));
    if (els.hudRcd) setText(els.hudRcd, S.tripped ? 'TRIP' : (S.short ? 'SHORT' : (S.rcd ? 'ON' : 'OFF')));

    if (els.tasks) {
      els.tasks.querySelectorAll('[data-task]').forEach(el => {
        const done = !!S.seen[el.dataset.task];
        el.classList.toggle('done', done);
        const i = el.querySelector('i');
        if (i) i.textContent = done ? '●' : '○';
      });
    }
  }

  function refresh() { lastFact = ''; }

  return { build, render, refresh };
})();
