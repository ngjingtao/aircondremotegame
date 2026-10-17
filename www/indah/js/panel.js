/* ═══════════════════════════════════════════
   indah/js/panel.js — the left control panel
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.panel = (function () {

  const T = () => ARG.i18n.t;
  const M = () => ARG.sim.s;

  let els = {};
  let onAction = null;
  let lastTab = null, lastStep = null;

  const stepBtn = (s, i) =>
    `<button class="step" data-action="jump" data-step="${i}">
       <span class="st-n">${i + 1}</span><span class="st-t" data-i18n="${s.key}"></span>
     </button>`;

  function build(handler) {
    onAction = handler;
    els.tabs = document.querySelectorAll('.tab');
    els.paneNetwork = document.getElementById('pane-network');
    els.panePlant = document.getElementById('pane-plant');
    els.stepsNetwork = document.getElementById('steps-network');
    els.stepsPlant = document.getElementById('steps-plant');
    els.fact = document.getElementById('fact');
    els.nextBtn = document.getElementById('next-btn');

    renderStepLists();

    [els.stepsNetwork, els.stepsPlant].forEach(host => {
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
    els.stepsNetwork.innerHTML = ARG.sim.NETWORK.map(stepBtn).join('');
    els.stepsPlant.innerHTML = ARG.sim.PLANT.map(stepBtn).join('');
    ARG.i18n.apply(els.stepsNetwork);
    ARG.i18n.apply(els.stepsPlant);
  }

  function render() {
    const S = M();
    const t = T();
    const net = S.tab === 'network';

    if (lastTab !== S.tab) {
      lastTab = S.tab;
      els.tabs.forEach(b => b.classList.toggle('on', b.dataset.tab === S.tab));
      els.paneNetwork.hidden = !net;
      els.panePlant.hidden = net;
      lastStep = null;
    }

    if (lastStep !== S.step) {
      lastStep = S.step;
      const list = net ? ARG.sim.NETWORK : ARG.sim.PLANT;
      const host = net ? els.stepsNetwork : els.stepsPlant;
      host.querySelectorAll('.step').forEach((b, i) => {
        b.classList.toggle('on', i === S.step);
        b.classList.toggle('done', i < S.step);
      });
      els.fact.textContent = t(list[S.step].fact);
      const last = S.step >= list.length - 1;
      els.nextBtn.textContent = last ? t('restart') : t('next');
      els.nextBtn.disabled = false;
    }
  }

  function refresh() {
    lastTab = null; lastStep = null;
    renderStepLists();
  }

  return { build, render, refresh };
})();
