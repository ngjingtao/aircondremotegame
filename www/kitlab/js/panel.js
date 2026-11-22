/* kitlab/js/panel.js — experiments, tray, run */
window.ARG = window.ARG || {};

ARG.panel = (function () {
  const T = () => ARG.i18n.t;
  let els = {}, onAction = null, lastFact = '';

  function $(id) { return document.getElementById(id); }
  function setText(el, v) { if (el && el.textContent !== v) el.textContent = v; }

  function build(handler) {
    onAction = handler;
    els.fact = $('kit-fact');
    els.exps = $('exp-row');
    els.parts = $('part-row');
    els.built = $('built-row');
    els.run = $('btn-run');
    els.dots = $('kit-dots');
    els.hudDone = $('hud-done');
    els.hudRead = $('hud-read');

    if (els.exps) {
      els.exps.innerHTML = ARG.sim.EXPERIMENTS.map((e, i) =>
        '<button class="exp-btn" data-action="exp" data-i="' + i + '"><span>' + e.ico + '</span><b data-i18n="' + e.key + '"></b></button>'
      ).join('');
    }
    if (els.parts) {
      els.parts.innerHTML = ARG.sim.COMPONENTS.map(c =>
        '<button class="part-btn" data-action="place" data-part="' + c.id + '"><span>' + c.ico + '</span><b data-i18n="' + c.key + '"></b></button>'
      ).join('');
    }
    if (els.dots) {
      els.dots.innerHTML = ARG.sim.EXPERIMENTS.map((e, i) =>
        '<i data-dot="' + i + '" title="' + i + '"></i>'
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
    const ex = ARG.sim.ex();

    if (els.exps) els.exps.querySelectorAll('[data-i]').forEach(b => b.classList.toggle('on', +b.dataset.i === S.exp));
    if (els.parts) els.parts.querySelectorAll('[data-part]').forEach(b => {
      b.classList.toggle('on', S.built.indexOf(b.dataset.part) >= 0);
    });
    if (els.built) {
      const parts = S.built.map(id => {
        const c = ARG.sim.BY_ID[id];
        return c ? '<span class="chip"><span>' + c.ico + '</span><b data-i18n="' + c.key + '"></b></span>' : '';
      }).join('');
      if (els.built.dataset.sig !== parts) {
        els.built.dataset.sig = parts;
        els.built.innerHTML = parts;
        ARG.i18n.apply(els.built);
      }
    }
    if (els.run) els.run.disabled = !ARG.sim.ready();

    const fk = ARG.sim.factKey();
    if (fk !== lastFact) { lastFact = fk; setText(els.fact, t(fk)); }

    if (els.dots) els.dots.querySelectorAll('[data-dot]').forEach(d => {
      d.classList.toggle('done', S.runs.indexOf(ARG.sim.EXPERIMENTS[+d.dataset.dot].id) >= 0);
      d.classList.toggle('on', +d.dataset.dot === S.exp);
    });

    if (els.hudDone) setText(els.hudDone, S.runs.length + ' / ' + ARG.sim.EXPERIMENTS.length);
    if (els.hudRead) setText(els.hudRead, S.run ? ex.read : '—');
  }

  function refresh() { lastFact = ''; }

  return { build, render, refresh };
})();
