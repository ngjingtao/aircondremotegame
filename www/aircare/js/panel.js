/* ═══════════════════════════════════════════
   aircare/js/panel.js — the left control panel
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.panel = (function () {

  const T = () => ARG.i18n.t;
  const M = () => ARG.sim.s;

  let els = {};
  let onAction = null;
  let lastMode = null, lastStep = null, lastPower = null, lastTemp = null;
  const seen = {};

  function build(handler) {
    onAction = handler;
    els.tabs = document.querySelectorAll('.tab');
    els.paneHow = document.getElementById('pane-how');
    els.paneWash = document.getElementById('pane-wash');
    els.steps = document.getElementById('steps');
    els.fact = document.getElementById('fact');
    els.powerState = document.getElementById('power-state');
    els.tempVal = document.getElementById('temp-val');
    els.nextBtn = document.getElementById('next-btn');
    els.hudRoom = document.getElementById('hud-room');
    els.hudEvap = document.getElementById('hud-evap');

    els.steps.innerHTML = ARG.sim.STEPS.map((s, i) =>
      `<button class="step" data-action="jump" data-step="${i}">
         <span class="st-n">${i + 1}</span><span class="st-t" data-i18n="${s.key}"></span>
       </button>`).join('');

    els.steps.addEventListener('pointerdown', ev => {
      const b = ev.target.closest('button');
      if (!b) return;
      ev.preventDefault();
      onAction('jumpStep', b);
    });

    document.querySelectorAll('[data-action]').forEach(b => {
      b.addEventListener('pointerdown', ev => {
        ev.preventDefault();
        if (b.classList.contains('step')) return;      // handled above
        if (navigator.vibrate) { try { navigator.vibrate(10); } catch (e) {} }
        b.classList.add('pressed');
        setTimeout(() => b.classList.remove('pressed'), 130);
        onAction(b.dataset.action, b);
      });
    });
  }

  function render() {
    const S = M();
    const t = T();

    if (lastMode !== S.mode) {
      lastMode = S.mode;
      els.tabs.forEach(b => b.classList.toggle('on', b.dataset.mode === S.mode));
      els.paneHow.hidden = S.mode !== 'how';
      els.paneWash.hidden = S.mode !== 'wash';
    }

    if (S.mode === 'how') {
      if (lastPower !== S.power) {
        lastPower = S.power;
        els.powerState.textContent = S.power ? t('on') : t('off');
        els.powerState.classList.toggle('on', S.power);
        document.querySelector('.ctl-btn.power').classList.toggle('on', S.power);
      }
      if (lastTemp !== S.setTemp) {
        lastTemp = S.setTemp;
        els.tempVal.textContent = S.setTemp;
      }
    } else {
      if (lastStep !== S.step) {
        lastStep = S.step;
        els.steps.querySelectorAll('.step').forEach((b, i) => {
          b.classList.toggle('done', i < S.step);
          b.classList.toggle('on', i === S.step);
        });
        els.nextBtn.disabled = S.step >= ARG.sim.STEPS.length - 1;
        els.nextBtn.textContent = S.step >= ARG.sim.STEPS.length - 1 ? t('restart') : t('next');
        els.fact.textContent = t(ARG.sim.STEPS[S.step].fact);
      }
    }

    const room = S.roomTemp.toFixed(1) + '°';
    if (seen.room !== room) { seen.room = room; els.hudRoom.textContent = room; }
    const evap = Math.round(S.evapTemp) + '°';
    if (seen.evap !== evap) {
      seen.evap = evap;
      els.hudEvap.textContent = evap;
      els.hudEvap.style.color = S.evapTemp < 10 ? '#7dd3fc' : '#93a3bd';
    }
  }

  function refresh() { for (const k in seen) delete seen[k]; lastMode = lastStep = lastPower = lastTemp = null; }

  return { build, render, refresh };
})();
