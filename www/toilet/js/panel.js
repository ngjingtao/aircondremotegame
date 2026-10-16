/* ═══════════════════════════════════════════
   toilet/js/panel.js — the left control panel
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.panel = (function () {

  const T = () => ARG.i18n.t;
  const M = () => ARG.sim.s;

  let els = {};
  let onAction = null;
  let lastMode = null, lastStep = null;
  const seen = {};

  function build(handler) {
    onAction = handler;
    els.tabs = document.querySelectorAll('.tab');
    els.paneFlush = document.getElementById('pane-flush');
    els.paneTreat = document.getElementById('pane-treat');
    els.stepsFlush = document.getElementById('steps-flush');
    els.stepsTreat = document.getElementById('steps-treat');
    els.fact = document.getElementById('fact');
    els.nextBtn = document.getElementById('next-btn');
    els.flushBtn = document.getElementById('flush-btn');

    renderStepLists();

    [els.stepsFlush, els.stepsTreat].forEach(host => {
      host.addEventListener('pointerdown', ev => {
        const b = ev.target.closest('button');
        if (!b) return;
        ev.preventDefault();
        onAction('jump', b);
      });
    });

    document.querySelectorAll('[data-action]').forEach(b => {
      if (b.classList.contains('step')) return;      // handled above
      b.addEventListener('pointerdown', ev => {
        ev.preventDefault();
        if (navigator.vibrate) { try { navigator.vibrate(10); } catch (e) {} }
        b.classList.add('pressed');
        setTimeout(() => b.classList.remove('pressed'), 130);
        onAction(b.dataset.action, b);
      });
    });
  }

  function renderStepLists() {
    els.stepsFlush.innerHTML = ARG.sim.FLUSH.map((s, i) =>
      `<button class="step" data-action="jump" data-step="${i}">
         <span class="st-n">${i + 1}</span><span class="st-t" data-i18n="${s.key}"></span>
       </button>`).join('');
    els.stepsTreat.innerHTML = ARG.sim.TREAT.map((s, i) =>
      `<button class="step" data-action="jump" data-step="${i}">
         <span class="st-n">${i + 1}</span><span class="st-t" data-i18n="${s.key}"></span>
       </button>`).join('');
    ARG.i18n.apply(els.stepsFlush);
    ARG.i18n.apply(els.stepsTreat);
  }

  function render() {
    const S = M();
    const t = T();

    if (lastMode !== S.mode) {
      lastMode = S.mode;
      els.tabs.forEach(b => b.classList.toggle('on', b.dataset.mode === S.mode));
      els.paneFlush.hidden = S.mode !== 'flush';
      els.paneTreat.hidden = S.mode !== 'treat';
      lastStep = null;
    }

    if (lastStep !== S.step) {
      lastStep = S.step;
      const list = S.mode === 'flush' ? ARG.sim.FLUSH : ARG.sim.TREAT;
      const host = S.mode === 'flush' ? els.stepsFlush : els.stepsTreat;
      host.querySelectorAll('.step').forEach((b, i) => {
        b.classList.toggle('on', i === S.step);
        b.classList.toggle('done', i < S.step);
      });
      els.fact.textContent = t(list[S.step].fact);
      const last = S.step >= list.length - 1;
      els.nextBtn.textContent = last ? t('restart') : t('next');
      els.nextBtn.disabled = false;
    }

    /* the flush button lights up while it is running */
    const busy = S.mode === 'flush' && S.flushing;
    if (seen.busy !== busy) {
      seen.busy = busy;
      els.flushBtn.classList.toggle('busy', busy);
    }
  }

  function refresh() {
    for (const k in seen) delete seen[k];
    lastMode = null; lastStep = null;
    renderStepLists();
  }

  return { build, render, refresh };
})();
