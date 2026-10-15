/* ═══════════════════════════════════════════
   room.js — the boy, the air-con, the room
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.room = (function () {

  const T = () => ARG.i18n.t;
  const M = () => ARG.sim.s;

  let els = {};
  let speechTimer = null;
  let toastTimer = null;
  let lastMood = null;
  let lastMode = null;
  let lastPower = null;
  let armTimer = null;

  function cache() {
    els.wall     = document.getElementById('room-wall');
    els.panel    = document.getElementById('room-panel');
    els.winSky   = document.getElementById('win-sky');
    els.winSun   = document.getElementById('win-sun');
    els.out      = document.getElementById('env-out');
    els.roomT    = document.getElementById('env-room');
    els.hum      = document.getElementById('env-hum');
    els.clock    = document.getElementById('env-clock');
    els.ac       = document.getElementById('ac');
    els.acTemp   = document.getElementById('ac-temp-txt');
    els.acLed    = document.getElementById('ac-led');
    els.vaneV    = document.getElementById('ac-vane-v');
    els.vaneH    = document.getElementById('ac-vane-h');
    els.airflow  = document.getElementById('airflow');
    els.acStatus = document.getElementById('ac-status');
    els.boy      = document.getElementById('boy');
    els.boyWrap  = document.getElementById('boy-wrap');
    els.armR     = document.getElementById('boy-arm-r');
    els.miniTemp = document.getElementById('mini-temp');
    els.speech   = document.getElementById('speech');
    els.signal   = document.getElementById('signal');
    els.toast    = document.getElementById('toast');
    els.lockBan  = document.getElementById('lock-banner');
    els.moodHud  = document.getElementById('hud-mood');
    els.scoreHud = document.getElementById('hud-score');
    els.comboHud = document.getElementById('hud-combo');
    els.scoreChip = document.getElementById('hud-score-chip');

    /* build airflow streams */
    els.airflow.innerHTML = '';
    for (let i = 0; i < 10; i++) {
      const d = document.createElement('div');
      d.className = 'stream';
      els.airflow.appendChild(d);
    }
  }

  /* ─────────── mood colours ─────────── */
  function roomTint(roomTemp) {
    const t = (roomTemp - 18) / 16; // 18 → 34
    const c = Math.max(0, Math.min(1, t));
    if (c < 0.5) {
      const a = 1 - c * 2;
      return 'rgba(90,150,255,' + (a * 0.16).toFixed(3) + ')';
    }
    const a = (c - 0.5) * 2;
    return 'rgba(255,110,70,' + (a * 0.18).toFixed(3) + ')';
  }

  function wallColour(roomTemp) {
    const c = Math.max(0, Math.min(1, (roomTemp - 18) / 16));
    const cold = [205, 224, 246];
    const warm = [250, 232, 214];
    const mid  = [236, 240, 248];
    let r, g, b;
    if (c < 0.5) {
      const k = c * 2;
      r = cold[0] + (mid[0] - cold[0]) * k;
      g = cold[1] + (mid[1] - cold[1]) * k;
      b = cold[2] + (mid[2] - cold[2]) * k;
    } else {
      const k = (c - 0.5) * 2;
      r = mid[0] + (warm[0] - mid[0]) * k;
      g = mid[1] + (warm[1] - mid[1]) * k;
      b = mid[2] + (warm[2] - mid[2]) * k;
    }
    return 'linear-gradient(180deg, rgb(' + (r | 0) + ',' + (g | 0) + ',' + (b | 0) + '), rgb(' + ((r * 0.92) | 0) + ',' + ((g * 0.92) | 0) + ',' + ((b * 0.95) | 0) + '))';
  }

  /* ─────────── public render ─────────── */
  function render() {
    const s = M();
    const t = T();

    /* environment readouts */
    els.out.textContent = s.outdoorTemp.toFixed(1) + '°';
    els.roomT.textContent = s.roomTemp.toFixed(1) + '°';
    els.hum.textContent = Math.round(s.humidity) + '%';
    const hh = Math.floor(s.clockH);
    const mm = Math.floor((s.clockH - hh) * 60);
    els.clock.textContent = String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0');

    /* outside weather look */
    const night = s.clockH < 6.5 || s.clockH > 18.5;
    if (night) {
      els.winSky.style.background = 'linear-gradient(180deg,#122045,#2b3f6e)';
      els.winSun.style.opacity = '0';
    } else {
      const heat = s.outdoorTemp > 35;
      els.winSky.style.background = heat
        ? 'linear-gradient(180deg,#ffb95e,#ffdca8)'
        : 'linear-gradient(180deg,#8ec9f0,#cfe8fb)';
      els.winSun.textContent = heat ? '☀️' : '⛅';
      els.winSun.style.opacity = '1';
    }

    /* room tint */
    els.panel.style.setProperty('--room-tint', roomTint(s.roomTemp));
    els.wall.style.background = wallColour(s.roomTemp);

    /* air-con */
    const on = s.power && s.selfClean <= 0;
    els.ac.classList.toggle('off', !s.power);
    els.acTemp.textContent = s.power ? String(s.setTemp) : '--';
    els.acLed.classList.toggle('off', !s.power);

    if (lastPower !== s.power) {
      els.acLed.style.fill = s.power ? '#3ddc84' : '';
      lastPower = s.power;
    }

    els.vaneV.classList.toggle('open', !!s.swingV || on);
    els.vaneH.classList.toggle('open', !!s.swingH || on);

    const fanCls = 'fan-' + ({ AUTO: 2, LOW: 1, MED: 3, HIGH: 4 }[s.fan]);
    const clean = s.selfClean > 0;
    els.airflow.className = 'airflow'
      + (on || clean ? ' on' : '')
      + ' ' + fanCls
      + (s.mode === 'HEAT' ? ' heat' : '')
      + (s.swingH ? ' swing-h' : '');

    if (clean) {
      els.acStatus.textContent = '✨ ' + t('acClean');
      els.acStatus.classList.remove('hot');
    } else if (!s.power) {
      els.acStatus.textContent = '⏻ ' + t('acOff');
      els.acStatus.classList.remove('hot');
    } else {
      els.acStatus.textContent = ARG.sim.MODE_ICON[s.mode] + ' ' + t('mode' + cap(s.mode))
        + ' · ' + s.setTemp + '°C · ' + t('fan' + cap(s.fan));
      els.acStatus.classList.toggle('hot', s.mode === 'HEAT');
    }

    /* boy */
    els.boy.dataset.mood = s.mood;
    els.miniTemp.textContent = s.power ? String(s.setTemp) : '--';

    if (lastMood !== s.mood) {
      lastMood = s.mood;
      say(t('moodSay_' + s.mood));
    }

    /* HUD */
    els.moodHud.textContent = t('mood' + capMood(s.mood));
    els.moodHud.style.color = ({
      freezing: '#7dd3fc', cold: '#93c5fd', ok: '#3ddc84', hot: '#fbbf24', veryhot: '#f87171'
    })[s.mood];

    els.scoreChip.hidden = !s.challenge;
    if (s.challenge) {
      els.scoreHud.textContent = Math.floor(s.score);
      els.comboHud.textContent = 'x' + s.combo;
      els.comboHud.style.color = s.combo > 1 ? '#fbbf24' : '#93a3bd';
    }

    els.lockBan.hidden = !s.lock;
  }

  function cap(s) { return s.charAt(0) + s.slice(1).toLowerCase(); }
  function capMood(m) {
    return ({ freezing: 'Freezing', cold: 'Cold', ok: 'Ok', hot: 'Hot', veryhot: 'VeryHot' })[m];
  }

  /* ─────────── speech bubble ─────────── */
  function say(textKeyOrText) {
    if (!textKeyOrText) return;
    const txt = textKeyOrText.indexOf('say') === 0 || textKeyOrText.indexOf('moodSay_') === 0
      ? (textKeyOrText.indexOf('moodSay_') === 0
          ? ARG.i18n.pick('say' + capMood(textKeyOrText.slice(8)))
          : ARG.i18n.pick(textKeyOrText))
      : textKeyOrText;
    els.speech.textContent = txt;
    els.speech.classList.add('show');
    clearTimeout(speechTimer);
    speechTimer = setTimeout(() => els.speech.classList.remove('show'), 2600);
  }

  /* ─────────── signal + arm ─────────── */
  function signal() {
    els.signal.classList.remove('fire');
    void els.signal.offsetWidth;
    els.signal.classList.add('fire');
    setTimeout(() => els.signal.classList.remove('fire'), 1400);

    els.armR.classList.add('raised');
    clearTimeout(armTimer);
    armTimer = setTimeout(() => els.armR.classList.remove('raised'), 520);
  }

  /* ─────────── toast ─────────── */
  function toast(text, isGood) {
    if (!text) return;
    els.toast.textContent = text;
    els.toast.style.background = isGood
      ? 'linear-gradient(135deg,#22c55e,#0ea5e9)'
      : 'linear-gradient(135deg,#f97316,#ef4444)';
    els.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove('show'), 2400);
  }

  return { init: cache, render, say, signal, toast };
})();
