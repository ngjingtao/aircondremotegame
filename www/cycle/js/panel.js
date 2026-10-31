/* ═══════════════════════════════════════════
   cycle/js/panel.js — stages and controls
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.panel = (function () {

  const T = () => ARG.i18n.t;
  const M = () => ARG.sim.s;
  let els = {};
  let onAction = null;
  const seen = {};

  function $(id) { return document.getElementById(id); }
  function setText(el, v) { if (el && el.textContent !== v) el.textContent = v; }

  function build(handler) {
    onAction = handler;
    els.steps = $('cycle-steps');
    els.fact = $('cycle-fact');
    els.back = $('cycle-back');
    els.next = $('cycle-next');
    els.watch = $('cycle-watch');
    els.restart = $('cycle-restart');
    els.result = $('cycle-result');
    els.hudStep = $('hud-step');
    els.hudMode = $('hud-mode');

    const sim = ARG.sim;
    if (els.steps) {
      els.steps.innerHTML = sim.STEPS.map((s, i) =>
        '<button class="wstep" data-action="jump" data-step="' + i + '">' +
          '<span class="ws-n">' + (i + 1) + '</span><b data-i18n="' + s.key + '"></b>' +
        '</button>').join('');
    }

    const ctl = $('ctl');
    if (ctl) {
      ctl.addEventListener('pointerdown', ev => {
        const b = ev.target && ev.target.closest ? ev.target.closest('button') : null;
        if (!b || !b.dataset || !b.dataset.action) return;
        ev.preventDefault();
        if (navigator.vibrate) { try { navigator.vibrate(10); } catch (e) {} }
        b.classList.add('pressed');
        setTimeout(() => b.classList.remove('pressed'), 130);
        onAction(b.dataset.action, b);
      });
    }
  }

  function render() {
    const S = M();
    const t = T();
    const sim = ARG.sim;

    if (els.steps) {
      els.steps.querySelectorAll('.wstep').forEach((b, i) => {
        b.classList.toggle('on', i === S.step);
        b.classList.toggle('done', S.seenAll || i < S.step);
      });
    }
    if (seen.step !== S.step) {
      seen.step = S.step;
      setText(els.fact, t(sim.STEPS[S.step].fact));
    }
    if (els.back) els.back.disabled = S.step === 0;
    if (els.watch) setText(els.watch, t(S.auto ? 'stopWatch' : 'watch'));
    if (els.watch) els.watch.classList.toggle('on', S.auto);
    if (els.restart) els.restart.hidden = !S.seenAll;

    if (els.result) els.result.hidden = !S.seenAll;
    if (S.seenAll) setText($('cycle-res-text'), t('resultText'));

    const stage = (S.step + 1) + ' / ' + sim.STEPS.length;
    if (seen.stage !== stage) { seen.stage = stage; setText(els.hudStep, stage); }
    const mode = S.auto ? t('modeWatch') : t('modeStep');
    if (seen.mode !== mode) { seen.mode = mode; setText(els.hudMode, mode); }
  }

  function refresh() { for (const k in seen) delete seen[k]; }

  return { build, render, refresh };
})();
