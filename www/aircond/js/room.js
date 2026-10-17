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
  let lastPower = null;
  let armTimer = null;
  const seen = {};                       // last rendered values, to avoid needless DOM work

  function changed(key, value) {
    if (seen[key] === value) return false;
    seen[key] = value;
    return true;
  }

  /* flash the little status pill for a moment when its number changes */
  const bumpTimers = {};
  function bump(el, kind) {
    if (!el) return;
    const pill = el.closest ? el.closest('.env-item') : el.parentElement;
    if (!pill) return;
    pill.classList.remove('bump', 'hot', 'cold');
    void pill.offsetWidth;
    pill.classList.add('bump');
    if (kind) pill.classList.add(kind);
    const id = pill.dataset.key || (pill.dataset.key = 'k' + Math.random().toString(36).slice(2));
    clearTimeout(bumpTimers[id]);
    bumpTimers[id] = setTimeout(() => pill.classList.remove('bump', 'hot', 'cold'), 620);
  }

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

    /* build airflow streams + direction arrows */
    els.airflow.innerHTML = '';
    for (let i = 0; i < 10; i++) {
      const d = document.createElement('div');
      d.className = 'stream';
      els.airflow.appendChild(d);
    }
    for (let i = 0; i < 4; i++) {
      const a = document.createElement('div');
      a.className = 'arrow';
      els.airflow.appendChild(a);
    }
    els.arrows = Array.from(els.airflow.querySelectorAll('.arrow'));
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

    /* environment readouts (throttled to visible changes) */
    const outTxt = s.outdoorTemp.toFixed(1) + '°';
    if (changed('outT', outTxt)) {
      els.out.textContent = outTxt;
      bump(els.out, s.outdoorTemp > 35 ? 'hot' : (s.outdoorTemp < 22 ? 'cold' : ''));
    }

    const roomTxt = s.roomTemp.toFixed(1) + '°';
    if (changed('roomT', roomTxt)) {
      els.roomT.textContent = roomTxt;
      bump(els.roomT, s.roomTemp > 29 ? 'hot' : (s.roomTemp < 21 ? 'cold' : ''));
    }

    const humTxt = Math.round(s.humidity) + '%';
    if (changed('hum', humTxt)) {
      els.hum.textContent = humTxt;
      bump(els.hum, s.humidity > 78 ? 'hot' : '');
    }

    const hh = Math.floor(s.clockH);
    const mm = Math.floor((s.clockH - hh) * 60);
    const clockTxt = String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0');
    if (changed('clock', clockTxt)) els.clock.textContent = clockTxt;

    /* outside weather look */
    const night = s.clockH < 6.5 || s.clockH > 18.5;
    const heat = s.outdoorTemp > 35;
    const storm = s.humidity > 82 && !night;
    const freeze = s.outdoorTemp < 22;
    const skyKey = night ? 'night' : (heat ? 'hot' : 'day');
    if (changed('sky', skyKey)) {
      if (night) {
        els.winSky.style.background = 'linear-gradient(180deg,#122045,#2b3f6e)';
        els.winSun.style.opacity = '0';
        els.winSun.textContent = '🌙';
      } else {
        els.winSky.style.background = heat
          ? 'linear-gradient(180deg,#ffb95e,#ffdca8)'
          : 'linear-gradient(180deg,#8ec9f0,#cfe8fb)';
        els.winSun.textContent = heat ? '☀️' : (storm ? '⛅' : '⛅');
        els.winSun.style.opacity = '1';
      }
      els.rays = els.rays || document.getElementById('win-rays');
      if (els.rays) els.rays.style.opacity = night ? '0' : (storm ? '0.12' : '0.55');
    }

    /* weather inside the window */
    const wetKey = storm ? 'rain' : (freeze ? 'snow' : 'dry');
    if (changed('wet', wetKey)) {
      const rain = document.getElementById('win-rain');
      const snow = document.getElementById('win-snowfall');
      const hills = document.getElementById('win-hills');
      if (rain) rain.style.opacity = storm ? '0.55' : '0';
      if (snow) snow.style.opacity = freeze ? '0.6' : '0';
      if (hills) {
        hills.style.filter = freeze ? 'saturate(.5) brightness(1.15)' : (heat ? 'saturate(1.1) sepia(.25)' : 'none');
      }
      const w = document.getElementById('room-window');
      if (w) w.classList.toggle('storm', storm);
    }

    /* room tint — rounded so we do not restyle every single frame */
    const bucket = Math.round(s.roomTemp * 4) / 4;
    if (changed('tint', bucket)) {
      els.panel.style.setProperty('--room-tint', roomTint(bucket));
      els.wall.style.background = wallColour(bucket);
    }

    /* air-con */
    const on = s.power && s.selfClean <= 0;
    els.ac.classList.toggle('off', !s.power);

    const acTemp = s.power ? String(s.setTemp) : '--';
    if (changed('acTemp', acTemp)) els.acTemp.textContent = acTemp;

    if (lastPower !== s.power) {
      els.acLed.classList.toggle('off', !s.power);
      els.acLed.style.fill = s.power ? '#3ddc84' : '';
      lastPower = s.power;
    }

    els.vaneV.classList.toggle('open', !!s.swingV || on);
    els.vaneH.classList.toggle('open', !!s.swingH || on);

    const clean = s.selfClean > 0;
    const fanCls = 'airflow' + (on || clean ? ' on' : '')
      + ' fan-' + ({ AUTO: 2, LOW: 1, MED: 3, HIGH: 4 }[s.fan])
      + (s.mode === 'HEAT' ? ' heat' : '')
      + (s.swingH ? ' swing-h' : '');
    if (changed('airflow', fanCls)) els.airflow.className = fanCls;

    let status, hot = false;
    if (clean) {
      status = '✨ ' + t('acClean');
    } else if (!s.power) {
      status = '⏻ ' + t('acOff');
    } else {
      status = ARG.sim.MODE_ICON[s.mode] + ' ' + t('mode' + cap(s.mode))
        + ' · ' + s.setTemp + '°C · ' + t('fan' + cap(s.fan));
      hot = s.mode === 'HEAT';
    }
    if (changed('acStatus', status)) {
      els.acStatus.textContent = status;
      els.acStatus.classList.toggle('hot', hot);
    }

    /* boy */
    if (changed('boyMood', s.mood)) els.boy.dataset.mood = s.mood;

    const miniTxt = s.power ? String(s.setTemp) : '--';
    if (changed('mini', miniTxt)) els.miniTemp.textContent = miniTxt;

    if (lastMood !== s.mood) {
      lastMood = s.mood;
      say(t('moodSay_' + s.mood));
    }

    /* HUD */
    const moodTxt = t('mood' + capMood(s.mood));
    if (changed('moodHud', moodTxt + s.mood)) {
      els.moodHud.textContent = moodTxt;
      els.moodHud.style.color = ({
        freezing: '#7dd3fc', cold: '#93c5fd', ok: '#3ddc84', hot: '#fbbf24', veryhot: '#f87171'
      })[s.mood];
    }

    els.scoreChip.hidden = !s.challenge;
    if (s.challenge) {
      const sc = Math.floor(s.score);
      if (changed('score', sc)) els.scoreHud.textContent = sc;
      if (changed('combo', s.combo)) {
        els.comboHud.textContent = 'x' + s.combo;
        els.comboHud.style.color = s.combo > 1 ? '#fbbf24' : '#93a3bd';
      }
    }

    if (changed('lockBan', s.lock)) els.lockBan.hidden = !s.lock;
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
