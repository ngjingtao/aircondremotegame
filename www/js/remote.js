/* ═══════════════════════════════════════════
   remote.js — the Haier remote: keys + LCD
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.remote = (function () {

  const T = () => ARG.i18n.t;
  const M = () => ARG.sim.s;

  let els = {};
  let pressHandler = null;

  function cache() {
    els.remote   = document.getElementById('remote');
    els.glow     = document.getElementById('remote-glow');
    els.lcd      = document.getElementById('lcd');
    els.modeIcon = document.getElementById('lcd-mode-icon');
    els.modeName = document.getElementById('lcd-mode-name');
    els.temp     = document.getElementById('lcd-temp');
    els.fanName  = document.getElementById('lcd-fan-name');
    els.fanBars  = Array.from(document.querySelectorAll('.fan-bar'));
    els.swingIcons = Array.from(document.querySelectorAll('.sw-icon'));
    els.timerTxt = document.getElementById('lcd-timer-txt');
    els.inds     = {};
    document.querySelectorAll('.lcd-ind').forEach(el => { els.inds[el.dataset.ind] = el; });
    els.powerKey = document.querySelector('[data-action="power"]');
    els.turboKey = document.querySelector('[data-action="turbo"]');
    els.fanKey   = document.querySelector('[data-action="fan"]');
    els.tempUp   = document.querySelector('[data-action="tempup"]');
    els.tempDown = document.querySelector('[data-action="tempdown"]');
    els.swingL   = document.querySelector('[data-action="swingv"]');
    els.swingR   = document.querySelector('[data-action="swingh"]');
    els.healthK  = document.querySelector('[data-action="health"]');
    els.sleepK   = document.querySelector('[data-action="sleep"]');
    els.extraK   = document.querySelector('[data-action="extra"]');
    els.confirmK = document.querySelector('[data-action="confirm"]');
    els.lockK    = document.querySelector('[data-action="lock"]');
    els.lightK   = document.querySelector('[data-action="light"]');
    els.keys     = Array.from(document.querySelectorAll('.key'));
  }

  /* ─────────── LCD rendering ─────────── */
  function render() {
    const s = M();
    const t = T();

    els.lcd.classList.toggle('on', s.power);
    els.lcd.classList.toggle('off', !s.power);
    els.lcd.classList.toggle('backlit', s.light);

    els.modeIcon.textContent = ARG.sim.MODE_ICON[s.mode];
    els.modeName.textContent = s.selfClean > 0 ? '--' : t('mode' + cap(s.mode));

    els.temp.textContent = '';
    els.temp.appendChild(document.createTextNode(String(s.setTemp)));
    const deg = document.createElement('span');
    deg.className = 'lcd-deg';
    deg.textContent = '°C';
    els.temp.appendChild(deg);

    const fanIdx = { AUTO: 0, LOW: 1, MED: 2, HIGH: 3 }[s.fan];
    els.fanBars.forEach((b, i) => b.classList.toggle('active', fanIdx > 0 && i < fanIdx));
    els.fanName.textContent = t('fan' + cap(s.fan));

    els.swingIcons.forEach(el => {
      const on = el.dataset.sw === 'v' ? s.swingV : s.swingH;
      el.classList.toggle('active', !!on);
    });

    setInd('power', s.power);
    setInd('lock', s.lock);
    setInd('sleep', s.sleep);
    setInd('health', s.health);
    setInd('turbo', s.turbo === 'TURBO');
    setInd('quiet', s.turbo === 'QUIET');
    setInd('eco', s.eco);
    setInd('clean', s.selfClean > 0);

    const showTimer = s.timerArmed && (s.timerOnLeft > 0 || s.timerOffLeft > 0);
    setInd('timer', showTimer);
    if (showTimer) {
      if (s.timerOnLeft > 0) els.timerTxt.textContent = t('timerOn') + ' ' + fmtH(s.timerOnLeft);
      else if (s.timerOffLeft > 0) els.timerTxt.textContent = t('timerOff') + ' ' + fmtH(s.timerOffLeft);
    } else {
      els.timerTxt.textContent = s.timerOnH > 0 ? t('timerOn') + ' ' + s.timerOnH + 'h'
                             : s.timerOffH > 0 ? t('timerOff') + ' ' + s.timerOffH + 'h' : '--';
    }

    /* key states */
    els.powerKey.classList.toggle('on', s.power);
    els.turboKey.classList.toggle('active-state', s.turbo !== 'OFF');
    els.fanKey.classList.toggle('spinning', s.power && s.selfClean <= 0);
    els.tempUp.classList.toggle('active-state', s.setTemp >= 30);
    els.tempDown.classList.toggle('active-state', s.setTemp <= 16);
    els.swingL.classList.toggle('active-state', s.swingV);
    els.swingR.classList.toggle('active-state', s.swingH);
    els.healthK.classList.toggle('active-state', s.health);
    els.sleepK.classList.toggle('active-state', s.sleep);
    els.extraK.classList.toggle('active-state', s.eco);
    els.confirmK.classList.toggle('active-state', s.timerArmed);
    els.lockK.classList.toggle('on', s.lock);
    els.lightK.classList.toggle('on', s.light);

    document.querySelectorAll('[data-action="mode"]').forEach(k => {
      k.classList.toggle('active-state', k.dataset.mode === s.mode);
    });
  }

  function setInd(name, on) {
    const el = els.inds[name];
    if (el) el.classList.toggle('active', !!on);
  }

  function cap(s) { return s.charAt(0) + s.slice(1).toLowerCase(); }
  function fmtH(h) {
    const total = Math.max(0, h);
    const hh = Math.floor(total);
    const mm = Math.round((total - hh) * 60);
    return hh + ':' + String(mm).padStart(2, '0');
  }

  /* ─────────── feedback ─────────── */
  function flash(el) {
    if (!el) return;
    el.classList.add('k-flash');
    setTimeout(() => el.classList.remove('k-flash'), 140);
    el.classList.add('pressed');
    setTimeout(() => el.classList.remove('pressed'), 110);
  }

  function pulse() {
    els.glow.classList.add('pulse');
    setTimeout(() => els.glow.classList.remove('pulse'), 260);
  }

  /* ─────────── wiring ─────────── */
  function init(handler) {
    cache();
    pressHandler = handler;

    els.keys.forEach(key => {
      const fire = (ev) => {
        ev.preventDefault();
        const action = key.dataset.action;
        flash(key);
        pulse();
        if (navigator.vibrate) { try { navigator.vibrate(12); } catch (e) {} }
        pressHandler(action, key);
      };
      key.addEventListener('pointerdown', fire);
      key.addEventListener('contextmenu', e => e.preventDefault());
    });

    render();
  }

  return { init, render, flash, pulse };
})();
