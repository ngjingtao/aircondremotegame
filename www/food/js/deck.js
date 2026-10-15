/* ═══════════════════════════════════════════
   food/js/deck.js — the left control deck
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.deck = (function () {

  const T = () => ARG.i18n.t;
  const M = () => ARG.sim.s;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  let els = {};
  let onAction = null;
  let lastActions = '';
  let lastFood = '__';

  const METERS = [
    ['mChew', 'chew'],
    ['mSaliva', 'saliva'],
    ['mAcid', 'acid'],
    ['mNutrient', 'nutrient'],
    ['mWater', 'water'],
    ['mEnergy', 'energy']
  ];

  const seen = {};

  function build(handler) {
    onAction = handler;
    els.tray = document.getElementById('tray');
    els.actions = document.getElementById('actions');
    els.meters = document.getElementById('meters');

    /* food buttons */
    let html = '';
    ARG.sim.FOODS.forEach(f => {
      html += `<button class="food" data-action="pick" data-food="${f.id}">
        <span class="food-emoji">${f.emoji}</span>
        <span class="food-name" data-i18n="f${cap(f.id)}">${f.id}</span>
      </button>`;
    });
    els.tray.innerHTML = html;

    /* meters */
    let m = '';
    METERS.forEach(([label]) => {
      m += `<div class="meter" data-meter="${label}">
        <span class="meter-label" data-i18n="${label}">${label}</span>
        <span class="meter-bar"><i></i></span>
        <b class="meter-val">0%</b>
      </div>`;
    });
    els.meters.innerHTML = m;

    els.actions.addEventListener('pointerdown', onPress);
    els.tray.addEventListener('pointerdown', onPress);
  }

  function onPress(ev) {
    const b = ev.target.closest('button');
    if (!b || b.disabled) return;
    ev.preventDefault();
    if (navigator.vibrate) { try { navigator.vibrate(12); } catch (e) {} }
    flash(b);
    onAction(b.dataset.action, b);
  }

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function flash(b) {
    b.classList.add('pressed');
    setTimeout(() => b.classList.remove('pressed'), 120);
  }

  /* ─────────── contextual action buttons ─────────── */
  function actionMarkup(s) {
    switch (s.stage) {
      case 'MOUTH':
        if (!s.food) return `<button class="big-btn ghost" disabled>${T()('needFood')}</button>`;
        return `<button class="big-btn primary" data-action="chew">🦷 ${T()('bChew')}<i>${s.chewCount}</i></button>
                <button class="big-btn ${s.chew >= 0.85 ? 'go' : 'dim'}" data-action="swallow">👅 ${T()('bSwallow')}</button>`;
      case 'ESOPHAGUS':
        return `<button class="big-btn ghost" disabled>⬇ ${T()('swallowing')}</button>`;
      case 'STOMACH':
        return `<button class="big-btn primary" data-action="churn">🫧 ${T()('bChurn')}</button>`;
      case 'SMALL':
        return `<button class="big-btn ghost" disabled>🌀 ${T()('absorbing')}</button>`;
      case 'LARGE':
        return `<button class="big-btn ghost" disabled>💧 ${T()('squeezing')}</button>`;
      case 'OUT':
        return `<button class="big-btn go" data-action="poop">🚽 ${T()('bPoop')}</button>`;
      default:
        return '';
    }
  }

  /* ─────────── render ─────────── */
  function render() {
    const s = M();

    /* action buttons only when the shape changes */
    const sig = s.stage + '|' + (s.food || '') + '|' + (s.chew >= 0.85 ? 1 : 0);
    if (sig !== lastActions) {
      lastActions = sig;
      els.actions.innerHTML = actionMarkup(s);
      ARG.i18n.apply(els.actions);
    }

    /* tray: dim everything once a bite is on the tongue */
    if (lastFood !== s.food) {
      lastFood = s.food;
      els.tray.querySelectorAll('.food').forEach(b => {
        b.classList.toggle('chosen', b.dataset.food === s.food);
        b.disabled = s.stage !== 'MOUTH' || !!s.food;
      });
    }
    els.tray.classList.toggle('locked', s.stage !== 'MOUTH');

    /* meters */
    const val = {
      chew: s.chew,
      saliva: s.saliva,
      acid: s.acid,
      nutrient: s.nutrient,
      water: s.water,
      energy: s.energy / 100
    };
    METERS.forEach(([label, key]) => {
      const row = els.meters.querySelector(`[data-meter="${label}"]`);
      if (!row) return;
      const v = clamp(val[key] || 0, 0, 1);
      const pct = Math.round(v * 100);
      if (seen[label] !== pct) {
        seen[label] = pct;
        row.querySelector('i').style.width = pct + '%';
        row.querySelector('.meter-val').textContent = pct + '%';
      }
      row.classList.toggle('hot', key === 'nutrient' && v > 0.55);
      row.classList.toggle('low', (key === 'chew' || key === 'acid' || key === 'nutrient') && v < 0.25);
    });

    /* HUD */
    const belly = Math.round(s.belly);
    if (seen.belly !== belly) {
      seen.belly = belly;
      document.getElementById('hud-belly').textContent = belly + '%';
    }
    const en = Math.round(s.energy);
    if (seen.energy !== en) {
      seen.energy = en;
      document.getElementById('hud-energy').textContent = en;
    }
  }

  return { build, render };
})();
