/* ═══════════════════════════════════════════
   hood/js/panel.js — the control panel
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.panel = (function () {

  const T = () => ARG.i18n.t;
  const M = () => ARG.sim.s;

  const FANS = [
    { n: 0, key: 'fOff', ico: '⏻' },
    { n: 1, key: 'f1', ico: '🍃' },
    { n: 2, key: 'f2', ico: '💨' },
    { n: 3, key: 'f3', ico: '🌪️' }
  ];

  const METERS = [
    ['mAir', 'air', '#7dd3fc', 'm³/h', 900],
    ['mCaught', 'capture', '#8ef0b4', '%', 1],
    ['mNoise', 'noise', '#ffb37a', 'dB', 80]
  ];

  let els = {};
  let onAction = null;
  let lastFan = null, lastMode = null, lastDirty = null, lastLight = null, lastCook = null;
  const seen = {};

  function build(handler) {
    onAction = handler;
    els.fanRow = document.getElementById('fan-row');
    els.meters = document.getElementById('meters');
    els.filterState = document.getElementById('filter-state');
    els.lightState = document.getElementById('light-state');
    els.cookBtn = document.getElementById('cook-btn');
    els.cookTxt = document.getElementById('cook-txt');
    els.filterBtn = document.querySelector('.ctl-btn.filter');
    els.lightBtn = document.querySelector('.ctl-btn.light');
    els.modeBtns = document.querySelectorAll('.mode-btn');

    els.fanRow.innerHTML = FANS.map(f =>
      `<button class="fan-btn" data-action="fan" data-fan="${f.n}">
         <span class="fn-ico">${f.ico}</span><b data-i18n="${f.key}">${f.key}</b>
       </button>`).join('');

    els.meters.innerHTML = METERS.map(([label]) =>
      `<div class="meter" data-meter="${label}">
         <span class="meter-label" data-i18n="${label}">${label}</span>
         <span class="meter-bar"><i></i></span>
         <b class="meter-val">0</b>
       </div>`).join('');

    document.querySelectorAll('[data-action]').forEach(b => {
      b.addEventListener('pointerdown', ev => {
        ev.preventDefault();
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

    if (lastFan !== S.fan) {
      lastFan = S.fan;
      els.fanRow.querySelectorAll('.fan-btn').forEach(b => {
        b.classList.toggle('on', +b.dataset.fan === S.fan);
      });
    }
    if (lastLight !== S.light) {
      lastLight = S.light;
      els.lightBtn.classList.toggle('on', S.light);
      els.lightState.textContent = S.light ? 'ON' : 'OFF';
    }
    if (lastDirty !== S.dirty) {
      lastDirty = S.dirty;
      els.filterState.textContent = S.dirty ? t('dirty') : t('clean');
      els.filterBtn.classList.toggle('warn', S.dirty);
    }
    if (lastMode !== S.mode) {
      lastMode = S.mode;
      els.modeBtns.forEach(b => b.classList.toggle('on', b.dataset.mode === S.mode));
    }
    if (lastCook !== S.boiling) {
      lastCook = S.boiling;
      els.cookBtn.classList.toggle('on', S.boiling);
      els.cookTxt.textContent = S.boiling ? 'COOKING' : 'IDLE';
    }

    const val = {
      air: Math.round(S.air),
      capture: Math.round(Math.min(1, S.capture) * 100),
      noise: Math.round(S.noise)
    };
    METERS.forEach(([label, key, colour, unit, max]) => {
      const row = els.meters.querySelector(`[data-meter="${label}"]`);
      if (!row) return;
      const v = Math.min(1, (val[key] || 0) / max);
      const pct = Math.round(v * 100);
      if (seen[label] !== pct + val[key]) {
        seen[label] = pct + val[key];
        row.querySelector('i').style.width = pct + '%';
        row.querySelector('.meter-val').textContent = val[key] + ' ' + unit;
      }
      row.classList.toggle('warn', key === 'capture' && v < 0.7);
    });
  }

  function refresh() { for (const k in seen) delete seen[k]; lastFan = lastMode = lastDirty = lastLight = lastCook = null; }

  return { build, render, refresh };
})();
