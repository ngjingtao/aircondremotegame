/* ═══════════════════════════════════════════
   train/js/cab.js — the driver's desk
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.cab = (function () {

  const T = () => ARG.i18n.t;
  const M = () => ARG.sim.s;

  let els = {};
  let throttles = [];
  let brakes = [];
  let onAction = null;
  const seen = {};

  function build(handler) {
    onAction = handler;

    els.needle = document.getElementById('g-needle');
    els.gValue = document.getElementById('g-value');
    els.ticks = document.getElementById('g-ticks');

    els.thrBar = document.getElementById('thr-bar');
    els.brkBar = document.getElementById('brk-bar');
    els.thrName = document.getElementById('thr-name');
    els.brkName = document.getElementById('brk-name');

    els.lightsState = document.getElementById('lights-state');
    els.doorsState = document.getElementById('doors-state');
    els.statusLamp = document.getElementById('cs-lamp');
    els.statusTitle = document.getElementById('cs-title');
    els.statusSub = document.getElementById('cs-sub');

    /* gauge ticks */
    const CX = 60, CY = 74, R = 46;
    let ticks = '';
    for (let v = 0; v <= 120; v += 20) {
      const rad = (180 - (v / 120) * 180) * Math.PI / 180;
      const x1 = CX + Math.cos(rad) * (R - 1);
      const y1 = CY - Math.sin(rad) * (R - 1);
      const x2 = CX + Math.cos(rad) * (R - 8);
      const y2 = CY - Math.sin(rad) * (R - 8);
      ticks += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
    }
    els.ticks.innerHTML = ticks;

    /* notch bars */
    let h = '';
    for (let i = 0; i < ARG.sim.THROTTLE.length; i++) h += '<i></i>';
    els.thrBar.innerHTML = h;
    throttles = Array.prototype.slice.call(els.thrBar.children);

    h = '';
    for (let i = 0; i < ARG.sim.BRAKE.length - 1; i++) h += '<i></i>';   // emergency shares the last lamp
    els.brkBar.innerHTML = h;
    brakes = Array.prototype.slice.call(els.brkBar.children);

    /* buttons */
    document.querySelectorAll('.lv-btn, .cb-btn').forEach(b => {
      b.addEventListener('pointerdown', ev => {
        ev.preventDefault();
        if (navigator.vibrate) { try { navigator.vibrate(10); } catch (e) {} }
        b.classList.add('pressed');
        setTimeout(() => b.classList.remove('pressed'), 110);
        onAction(b.dataset.action, b);
      });
    });
  }

  function render() {
    const S = M();
    const t = T();

    /* ── speedometer ── */
    const v = Math.min(S.kmh, 120);
    const deg = -(v / 120) * 180;
    if (seen.deg !== deg.toFixed(1)) {
      seen.deg = deg.toFixed(1);
      els.needle.setAttribute('transform', 'rotate(' + deg.toFixed(1) + ' 60 74)');
    }
    const kmh = Math.round(S.kmh);
    if (seen.gv !== kmh) {
      seen.gv = kmh;
      els.gValue.textContent = kmh;
      els.gValue.setAttribute('fill', kmh > 100 ? '#ff8b7a' : kmh > 80 ? '#ffd166' : '#8ef0b4');
    }

    /* ── levers ── */
    if (seen.thr !== S.throttle) {
      seen.thr = S.throttle;
      throttles.forEach((el, i) => el.classList.toggle('on', i <= S.throttle && i > 0));
      throttles.forEach((el, i) => el.classList.toggle('off', i === 0 && S.throttle === 0));
      els.thrName.textContent = t('notches')[S.throttle];
      els.thrName.className = S.throttle > 0 ? 'on' : '';
    }
    if (seen.brk !== S.brake) {
      seen.brk = S.brake;
      brakes.forEach((el, i) => el.classList.toggle('on', i < S.brake));
      els.brkName.textContent = t('brakeNotches')[S.brake];
      els.brkName.className = S.brake >= ARG.sim.BRAKE.length - 1 ? 'emg' : (S.brake > 0 ? 'on' : '');
      els.brkBar.classList.toggle('emg', S.brake >= ARG.sim.BRAKE.length - 1);
    }

    /* ── buttons ── */
    const ls = t('lightsName')[S.lights];
    if (seen.ls !== ls) { seen.ls = ls; els.lightsState.textContent = ls; }
    const ds = S.doors ? t('doorsOpen') : t('doorsShut');
    if (seen.ds !== ds) {
      seen.ds = ds;
      els.doorsState.textContent = ds;
      els.doorsState.classList.toggle('on', S.doors);
    }
    document.querySelector('.cb-btn.bell') && null;

    /* ── status ── */
    let title, sub, lamp;
    if (S.doors) {
      lamp = 'green';
      title = t('doorsOpen') + ' · ' + ARG.i18n.station(S.servedStations['st' + S.nextIdx] ? S.nextIdx - 1 : S.nextIdx);
      sub = t('msgDoorsOpen');
    } else if (S.atPlatform && Math.abs(S.speed) < 0.35) {
      const off = Math.round(S.distToMark);
      lamp = Math.abs(off) <= 6 ? 'green' : 'amber';
      title = t('atStation');
      sub = (off === 0 ? '±0' : (off > 0 ? '+' : '') + off) + ' ' + t('metres') + ' →';
    } else {
      const d = Math.round(S.distToStation);
      lamp = d < 200 ? 'amber' : 'off';
      title = t('nextStop') + ' · ' + ARG.i18n.station(S.nextIdx);
      sub = d + ' ' + t('metres');
    }
    if (S.overspeed) { lamp = 'red'; sub = t('msgOverspeed'); }

    if (seen.st !== title + sub + lamp) {
      seen.st = title + sub + lamp;
      els.statusTitle.textContent = title;
      els.statusSub.textContent = sub;
      els.statusLamp.className = 'cs-lamp ' + lamp;
    }
  }

  /* clear the value caches so the next render re-emits translated text */
  function refresh() {
    for (const k in seen) delete seen[k];
  }

  return { build, render, refresh };
})();
