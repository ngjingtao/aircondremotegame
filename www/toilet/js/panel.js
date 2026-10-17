/* ═══════════════════════════════════════════
   toilet/js/panel.js — the left control panel
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.panel = (function () {

  const T = () => ARG.i18n.t;
  const M = () => ARG.sim.s;

  let els = {};
  let onAction = null;
  let lastStep = null;
  const seen = {};

  function build(handler) {
    onAction = handler;
    els.stepsFlush = document.getElementById('steps-flush');
    els.fact = document.getElementById('fact');
    els.nextBtn = document.getElementById('next-btn');
    els.flushBtn = document.getElementById('flush-btn');

    renderStepLists();

    els.stepsFlush.addEventListener('pointerdown', ev => {
      const b = ev.target.closest('button');
      if (!b) return;
      ev.preventDefault();
      onAction('jump', b);
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
    ARG.i18n.apply(els.stepsFlush);
  }

  function render() {
    const S = M();
    const t = T();

    if (lastStep !== S.step) {
      lastStep = S.step;
      els.stepsFlush.querySelectorAll('.step').forEach((b, i) => {
        b.classList.toggle('on', i === S.step);
        b.classList.toggle('done', i < S.step);
      });
      els.fact.textContent = t(ARG.sim.FLUSH[S.step].fact);
      const last = S.step >= ARG.sim.FLUSH.length - 1;
      els.nextBtn.textContent = last ? t('restart') : t('next');
      els.nextBtn.disabled = false;
    }

    /* the flush button lights up while it is running */
    const busy = S.flushing;
    if (seen.busy !== busy) {
      seen.busy = busy;
      els.flushBtn.classList.toggle('busy', busy);
    }
  }

  function refresh() {
    for (const k in seen) delete seen[k];
    lastStep = null;
    renderStepLists();
  }

  return { build, render, refresh };
})();
