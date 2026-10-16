/* ═══════════════════════════════════════════
   breath/js/panel.js — the experiment panel
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.panel = (function () {

  const T = () => ARG.i18n.t;
  const M = () => ARG.sim.s;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const SCENARIOS = [
    { id: 'sleep', ico: '😴' },
    { id: 'rest',  ico: '🧘' },
    { id: 'walk',  ico: '🚶' },
    { id: 'run',   ico: '🏃' },
    { id: 'alt',   ico: '🏔️' }
  ];

  const METERS = [
    ['mRate',  'rate',  '#7dd3fc'],
    ['mHeart', 'heart', '#ff8a7a'],
    ['mSpo2',  'spo2',  '#8ef0b4'],
    ['mCo2',   'co2',   '#c9b3ff'],
    ['mUrge',  'urge',  '#ffd166']
  ];

  let els = {};
  let onAction = null;
  let lastScenario = null;
  let lastHold = null;
  const seen = {};

  function build(handler) {
    onAction = handler;
    els.scenarios = document.getElementById('scenarios');
    els.meters = document.getElementById('meters');
    els.lungFill = document.getElementById('lung-fill');
    els.holdBtn = document.getElementById('hold-btn');
    els.holdTxt = document.getElementById('hold-txt');
    els.phBpm = document.getElementById('ph-bpm');
    els.phIcon = document.getElementById('ph-icon');
    els.phWave = document.querySelector('.ph-line');
    els.hudSpo2 = document.getElementById('hud-spo2');
    els.hudHr = document.getElementById('hud-hr');

    els.scenarios.innerHTML = SCENARIOS.map(s =>
      `<button class="sc" data-action="scenario" data-scenario="${s.id}">
         <span class="sc-ico">${s.ico}</span>
         <span class="sc-txt" data-i18n="sc${s.id.charAt(0).toUpperCase() + s.id.slice(1)}">${s.id}</span>
       </button>`).join('');

    els.meters.innerHTML = METERS.map(([label]) =>
      `<div class="meter" data-meter="${label}">
         <span class="meter-label" data-i18n="${label}">${label}</span>
         <span class="meter-bar"><i></i></span>
         <b class="meter-val">0</b>
       </div>`).join('');

    document.querySelectorAll('.sc, .pl-btn').forEach(b => {
      b.addEventListener('pointerdown', ev => {
        ev.preventDefault();
        if (navigator.vibrate) { try { navigator.vibrate(10); } catch (e) {} }
        b.classList.add('pressed');
        setTimeout(() => b.classList.remove('pressed'), 120);
        onAction(b.dataset.action, b);
      });
    });
  }

  function render() {
    const S = M();
    const t = T();

    /* scenario buttons */
    if (lastScenario !== S.scenario) {
      lastScenario = S.scenario;
      els.scenarios.querySelectorAll('.sc').forEach(b => {
        b.classList.toggle('on', b.dataset.scenario === S.scenario);
      });
    }

    /* lungs */
    const lv = clamp(S.lungVol, 0, 1);
    const lvp = Math.round(lv * 100);
    if (seen.lung !== lvp) {
      seen.lung = lvp;
      els.lungFill.style.height = (6 + lv * 94).toFixed(1) + '%';
      els.lungFill.classList.toggle('full', lv > 0.75);
      els.lungFill.classList.toggle('low', lv < 0.3);
    }

    /* hold button */
    if (lastHold !== S.holding) {
      lastHold = S.holding;
      els.holdBtn.classList.toggle('on', S.holding);
      els.holdTxt.textContent = S.holding ? t('bRelease') : t('bHold');
    }

    /* meters */
    const val = {
      rate:  clamp(S.breathsPerMin / 45, 0, 1),
      heart: clamp((S.heartRate - 40) / 150, 0, 1),
      spo2:  clamp((S.spo2 - 70) / 30, 0, 1),
      co2:   clamp((S.co2 - 32) / 30, 0, 1),
      urge:  clamp(S.urge, 0, 1)
    };
    const text = {
      rate:  Math.round(S.breathsPerMin),
      heart: Math.round(S.heartRate),
      spo2:  Math.round(S.spo2) + '%',
      co2:   Math.round(S.co2),
      urge:  Math.round(S.urge * 100) + '%'
    };
    METERS.forEach(([label, key]) => {
      const row = els.meters.querySelector(`[data-meter="${label}"]`);
      if (!row) return;
      const pct = Math.round(val[key] * 100);
      if (seen[label] !== pct + text[key]) {
        seen[label] = pct + text[key];
        row.querySelector('i').style.width = pct + '%';
        row.querySelector('.meter-val').textContent = text[key];
      }
      row.classList.toggle('warn', (key === 'spo2' && S.spo2 < 93) || (key === 'urge' && S.urge > 0.7));
    });

    /* heart readout */
    const bpm = Math.round(S.heartRate);
    if (seen.bpm !== bpm) {
      seen.bpm = bpm;
      els.phBpm.textContent = bpm;
      els.phBpm.classList.toggle('fast', bpm > 110);
      /* the ECG line scrolls at the real heart rate */
      els.phWave.style.animationDuration = (60 / Math.max(40, S.heartRate)).toFixed(2) + 's';
    }
    /* the icon thumps on every beat */
    const beatOn = S.beatPhase < 0.16;
    if (seen.beat !== beatOn) {
      seen.beat = beatOn;
      els.phIcon.classList.toggle('beat', beatOn);
    }

    /* top-bar chips */
    const sp = Math.round(S.spo2) + '%';
    if (seen.hudSp !== sp) {
      seen.hudSp = sp;
      els.hudSpo2.textContent = sp;
      els.hudSpo2.style.color = S.spo2 < 93 ? '#f87171' : '#8ef0b4';
    }
    if (seen.hudHr !== bpm) { seen.hudHr = bpm; els.hudHr.textContent = bpm; }
  }

  function refresh() { for (const k in seen) delete seen[k]; lastScenario = null; lastHold = null; }

  return { build, render, refresh };
})();
