/* ═══════════════════════════════════════════
   waterhome/js/scene.js — the supply journey and the hot tank
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.scene = (function () {

  const T = () => ARG.i18n.t;
  const M = () => ARG.sim.s;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const NS = 'http://www.w3.org/2000/svg';

  let els = {};
  let dots = [], drawDrops = [];
  let lastNote = null, lastStatus = null, lastLead = null;
  let toastTimer = null;

  function mk(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    if (attrs) Object.keys(attrs).forEach(k => e.setAttribute(k, attrs[k]));
    return e;
  }

  function build() {
    els.scene = document.getElementById('scene');
    els.supplyScene = document.getElementById('supplyScene');
    els.heaterScene = document.getElementById('heaterScene');
    els.supplyDots = document.getElementById('supplyDots');
    els.hotLayer = document.getElementById('hotLayer');
    els.warmLayer = document.getElementById('warmLayer');
    els.upperGlow = document.getElementById('upperGlow');
    els.lowerGlow = document.getElementById('lowerGlow');
    els.upperLed = document.getElementById('upperLed');
    els.lowerLed = document.getElementById('lowerLed');
    els.heaterTemp = document.getElementById('heaterTemp');
    els.drawDrops = document.getElementById('drawDrops');
    els.lead = document.getElementById('scene-lead');
    els.status = document.getElementById('scene-status');
    els.paneNote = document.getElementById('pane-note');
    els.toast = document.getElementById('toast');

    if (els.supplyDots) {
      for (let i = 0; i < 12; i++) {
        const c = mk('circle', { r: '2.4', class: 'wdot' });
        els.supplyDots.appendChild(c);
        dots.push(c);
      }
    }
    if (els.drawDrops) {
      for (let i = 0; i < 6; i++) {
        const c = mk('circle', { r: '2.6', class: 'ddrop', opacity: '0' });
        els.drawDrops.appendChild(c);
        drawDrops.push(c);
      }
    }
  }

  function show(id, on) {
    const e = document.getElementById(id);
    if (e) e.classList.toggle('off', !on);
  }

  function render(dt) {
    const S = M();
    const t = T();
    const now = performance.now() / 1000;
    const rating = ARG.sim.rating();

    show('supplyScene', S.tab === 'supply');
    show('heaterScene', S.tab === 'heater');

    /* supply: highlight the current part and run the water dots */
    if (S.tab === 'supply') {
      const lit = ARG.sim.SUPPLY[S.step].lit;
      document.querySelectorAll('#supplyScene .part').forEach(p => {
        p.classList.toggle('on', p.dataset.part === lit);
      });
      document.querySelectorAll('#supplyScene .lab').forEach(l => {
        l.classList.toggle('on', l.dataset.part === lit);
      });
      for (let i = 0; i < dots.length; i++) {
        const f = ((now * 0.13 + i / dots.length) % 1);
        const x = 36 + f * 264;
        let y = 358;
        if (f > 0.62 && f < 0.78) y = 358 - ((f - 0.62) / 0.16) * 54;
        else if (f >= 0.78 && f < 0.9) y = 304;
        else if (f >= 0.9) y = 304 + ((f - 0.9) / 0.1) * 54;
        dots[i].setAttribute('cx', x.toFixed(1));
        dots[i].setAttribute('cy', y.toFixed(1));
      }
    }

    /* heater: the hot layer grows from the top, the active element glows */
    if (S.tab === 'heater') {
      const tankTop = 162, tankH = 204;
      const frac = clamp((S.temp - ARG.sim.AMBIENT) / 50, 0, 1);
      if (els.hotLayer) {
        els.hotLayer.setAttribute('y', (tankTop + tankH - frac * tankH).toFixed(1));
        els.hotLayer.setAttribute('height', (frac * tankH).toFixed(1));
      }
      if (els.warmLayer) {
        const wFrac = clamp((S.bottom - ARG.sim.AMBIENT) / 50, 0, 1);
        els.warmLayer.setAttribute('y', (tankTop + tankH - wFrac * tankH).toFixed(1));
        els.warmLayer.setAttribute('height', (wFrac * tankH).toFixed(1));
      }
      if (els.upperGlow) els.upperGlow.setAttribute('opacity', S.upperOn ? '0.9' : '0.04');
      if (els.lowerGlow) els.lowerGlow.setAttribute('opacity', S.lowerOn ? '0.9' : '0.04');
      if (els.upperLed) els.upperLed.setAttribute('fill', S.upperOn ? '#ffb37a' : '#5d6b7c');
      if (els.lowerLed) els.lowerLed.setAttribute('fill', S.lowerOn ? '#ffb37a' : '#5d6b7c');
      if (els.heaterTemp) els.heaterTemp.textContent = Math.round(S.temp) + '°C';
      for (let i = 0; i < drawDrops.length; i++) {
        const d = drawDrops[i];
        const f = ((now * 1.4 + i / drawDrops.length) % 1);
        d.setAttribute('cx', (300 + Math.sin(now * 3 + i) * 2).toFixed(1));
        d.setAttribute('cy', (270 + f * 58).toFixed(1));
        d.setAttribute('opacity', (S.drawPulse > 0.03 ? S.drawPulse * (1 - f) * 0.9 : 0).toFixed(2));
      }
    }

    /* chrome */
    const lead = S.tab === 'supply' ? t('leadSupply') : t('leadHeater');
    if (lastLead !== lead) { lastLead = lead; if (els.lead) els.lead.textContent = lead; }

    const status = S.tab === 'supply' ? (S.supplyDone ? t('statusDone') : t('statusSupply'))
      : rating.stars > 0 ? t('statusDone')
      : S.upperOn ? t('statusUpper')
      : S.lowerOn ? t('statusLower')
      : S.temp >= S.setTemp - 0.5 ? t('statusReady')
      : t('statusHeater');
    if (lastStatus !== status) {
      lastStatus = status;
      if (els.status) {
        els.status.textContent = status;
        els.status.classList.toggle('busy', S.tab === 'heater' && S.heating);
      }
    }

    let note;
    if (S.tab === 'supply') note = S.supplyDone ? t('doneSupply') : t('tSupply');
    else if (rating.stars > 0) note = t(rating.reason);
    else if (S.setTemp < 60) note = t('tSafety');
    else if (S.upperOn) note = t('tUpper');
    else if (S.lowerOn) note = t('tLower');
    else if (S.temp >= S.setTemp - 0.5) note = t('tReadyHeater');
    else note = t('tHeater');
    if (lastNote !== note) { lastNote = note; if (els.paneNote) els.paneNote.textContent = note; }
  }

  function toast(msg, good) {
    if (!msg || !els.toast) return;
    els.toast.textContent = msg;
    els.toast.classList.toggle('good', good !== false);
    els.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove('show'), 2600);
  }

  return { build, render, toast };
})();
