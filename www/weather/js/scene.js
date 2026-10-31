/* ═══════════════════════════════════════════
   weather/js/scene.js — the station and the sky
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.scene = (function () {

  const T = () => ARG.i18n.t;
  const M = () => ARG.sim.s;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  let els = {};
  let cupAngle = 0;
  let lastNote = null, lastStatus = null, lastLead = null;
  let toastTimer = null;

  function build() {
    els.scene = document.getElementById('scene');
    els.art = document.getElementById('art');
    els.anemometer = document.getElementById('anemometer');
    els.vane = document.getElementById('vane');
    els.rainFill = document.getElementById('rainGaugeFill');
    els.thermoFill = document.getElementById('thermoFill');
    els.hygroNeedle = document.getElementById('hygroNeedle');
    els.baroNeedle = document.getElementById('baroNeedle');
    els.sunshineGlow = document.getElementById('sunshineGlow');
    els.riverFill = document.getElementById('riverGaugeFill');
    els.fairSun = document.getElementById('fairSun');
    els.neutralCloud = document.getElementById('neutralCloud');
    els.stormClouds = document.getElementById('stormClouds');
    els.rainGroup = document.getElementById('rainGroup');
    els.windLines = document.getElementById('windLines');
    els.lead = document.getElementById('scene-lead');
    els.status = document.getElementById('scene-status');
    els.paneNote = document.getElementById('pane-note');
    els.toast = document.getElementById('toast');

    if (els.art) {
      els.art.addEventListener('pointerdown', ev => {
        let n = ev.target;
        while (n && n !== els.art) {
          const key = n.getAttribute && n.getAttribute('data-instrument');
          if (key) {
            ev.preventDefault();
            ARG.panel.showInstrument(key);
            if (ARG.audio) ARG.audio.blip();
            return;
          }
          n = n.parentNode;
        }
      });
    }
  }

  function render(dt) {
    const S = M();
    const t = T();
    const d = dt || 0.016;
    const r = ARG.sim.current();

    /* instruments */
    cupAngle = (cupAngle + (r.wind / 50) * 420 * d) % 360;
    if (els.anemometer) els.anemometer.setAttribute('transform', 'rotate(' + cupAngle.toFixed(1) + ' 79 150)');
    if (els.vane) els.vane.setAttribute('transform', 'rotate(' + r.dir + ' 109.5 160)');

    if (els.rainFill) {
      const h = clamp(r.rain / 25, 0, 1) * 34;
      els.rainFill.setAttribute('y', (400 - h).toFixed(1));
      els.rainFill.setAttribute('height', h.toFixed(1));
    }
    if (els.thermoFill) {
      const h = clamp((r.temp - 10) / 30, 0, 1) * 44;
      els.thermoFill.setAttribute('y', (346 - h).toFixed(1));
      els.thermoFill.setAttribute('height', h.toFixed(1));
    }
    if (els.baroNeedle) {
      const a = ((r.pressure - 980) / 60) * 120 - 60;
      els.baroNeedle.setAttribute('transform', 'rotate(' + a.toFixed(1) + ' 225 312)');
    }
    if (els.hygroNeedle) {
      const a = (r.humidity / 100) * 140 - 70;
      els.hygroNeedle.setAttribute('transform', 'rotate(' + a.toFixed(1) + ' 185 312)');
    }
    if (els.sunshineGlow) els.sunshineGlow.setAttribute('opacity', clamp(r.sun / 8, 0, 1).toFixed(2));
    if (els.riverFill) {
      const h = clamp((r.river - 0.5) / 2.5, 0, 1) * 36;
      els.riverFill.setAttribute('y', (490 - h).toFixed(1));
      els.riverFill.setAttribute('height', h.toFixed(1));
    }

    /* the sky only tells the story after the forecast */
    const reveal = S.phase === 'reveal' || S.phase === 'done';
    const f = r.forecast;
    if (els.fairSun) els.fairSun.setAttribute('opacity', String(!reveal ? 0.35 : f === 'fair' ? 1 : 0));
    if (els.neutralCloud) els.neutralCloud.setAttribute('opacity', String(!reveal ? 0.9 : f === 'fair' ? 0.55 : 0));
    if (els.stormClouds) els.stormClouds.setAttribute('opacity', String(reveal && f !== 'fair' ? 1 : 0));
    if (els.rainGroup) els.rainGroup.setAttribute('opacity', String(reveal && f !== 'fair' ? (f === 'storm' ? 1 : 0.6) : 0));
    if (els.windLines) els.windLines.setAttribute('opacity', String(reveal && f === 'storm' ? 1 : 0));

    if (els.scene) {
      els.scene.classList.toggle('reveal', reveal);
      els.scene.classList.toggle('storm', reveal && f === 'storm');
    }

    const lead = t('lead');
    if (lastLead !== lead) { lastLead = lead; if (els.lead) els.lead.textContent = lead; }

    const status = S.phase === 'read' ? t('statusRead')
      : S.phase === 'reveal' ? t('statusReveal')
      : t('statusDone');
    if (lastStatus !== status) {
      lastStatus = status;
      if (els.status) {
        els.status.textContent = status;
        els.status.classList.toggle('busy', S.phase === 'reveal');
      }
    }

    let note;
    if (S.phase === 'read') note = t('tRead');
    else if (S.phase === 'reveal') {
      const right = S.guess === r.forecast;
      note = t(right ? 'right' : 'wrong') + ' ' + t(r.key + 'why');
    } else note = t(S.reason);
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
