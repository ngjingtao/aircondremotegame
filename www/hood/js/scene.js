/* ═══════════════════════════════════════════
   hood/js/scene.js — smoke, blower, damper, airflow
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.scene = (function () {

  const T = () => ARG.i18n.t;
  const M = () => ARG.sim.s;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const SMOKE = 16;      // rising from the wok
  const ESCAPED = 10;    // drifting into the room
  const DUCTP = 8;       // going up the duct
  const RECIRCP = 8;     // coming back out of the grille

  let els = {};
  let smoke = [], escaped = [], ductP = [], recircP = [];
  let baseX = [];
  let blowerAngle = 0;
  let greaseT = 0;
  const seen = {};

  function build() {
    els.scene = document.getElementById('scene');
    els.smoke = document.getElementById('smoke');
    els.escaped = document.getElementById('escaped');
    els.ductP = document.getElementById('ductP');
    els.recircP = document.getElementById('recircP');
    els.blower = document.getElementById('blower');
    els.damper = document.getElementById('damper');
    els.filterGrease = document.getElementById('filterGrease');
    els.oilLevel = document.getElementById('oilLevel');
    els.lamp = document.getElementById('lamp');
    els.lampGlow = document.getElementById('lampGlow');
    els.lightCone = document.getElementById('lightCone');
    els.flame = document.getElementById('flame');
    els.grille = document.getElementById('recircGrille');
    els.lead = document.getElementById('scene-lead');
    els.status = document.getElementById('scene-status');
    els.paneNote = document.getElementById('pane-note');
    els.toast = document.getElementById('toast');
    els.hudAir = document.getElementById('hud-air');
    els.hudCatch = document.getElementById('hud-catch');

    /* the blower wheel */
    let blades = '';
    for (let i = 0; i < 9; i++) {
      blades += `<path class="blade" d="M170,214 m0,-4 a4,4 0 0 1 4,4 q0,16 -6,22 q-6,-8 -4,-22 z" transform="rotate(${i * 40} 170 214)"/>`;
    }
    els.blower.innerHTML = blades + '<circle class="hub" cx="170" cy="214" r="6"/>';

    /* particles */
    let h = '';
    for (let i = 0; i < SMOKE; i++) {
      h = `<circle class="sm" r="${(3 + Math.random() * 3).toFixed(1)}"/>`;
      els.smoke.insertAdjacentHTML('beforeend', h);
      baseX.push(126 + Math.random() * 88);
    }
    smoke = Array.prototype.slice.call(els.smoke.children);

    h = '';
    for (let i = 0; i < ESCAPED; i++) h += `<circle class="es" r="${(3 + Math.random() * 3).toFixed(1)}"/>`;
    els.escaped.innerHTML = h;
    escaped = Array.prototype.slice.call(els.escaped.children);

    h = '';
    for (let i = 0; i < DUCTP; i++) h += '<circle class="dp" r="2.6"/>';
    els.ductP.innerHTML = h;
    ductP = Array.prototype.slice.call(els.ductP.children);

    h = '';
    for (let i = 0; i < RECIRCP; i++) h += '<circle class="rp" r="2.6"/>';
    els.recircP.innerHTML = h;
    recircP = Array.prototype.slice.call(els.recircP.children);
  }

  /* ─────────── render ─────────── */
  function render(dt) {
    const S = M();
    const t = T();
    const d = dt || 0.016;
    const now = performance.now() / 1000;

    /* the wheel spins at a speed that follows the fan */
    blowerAngle = (blowerAngle + S.spin * 620 * d) % 360;
    els.blower.setAttribute('transform', `rotate(${blowerAngle.toFixed(1)} 170 214)`);

    /* the damper is pushed open by the moving air */
    const ang = -(1 - clamp(S.damper, 0, 1)) * 78;
    els.damper.setAttribute('transform', `rotate(${ang.toFixed(1)} 136 56)`);

    /* the lamp */
    els.lamp.setAttribute('opacity', S.light ? '0.95' : '0.12');
    els.lampGlow.setAttribute('opacity', S.light ? '0.85' : '0.05');
    if (els.lightCone) els.lightCone.setAttribute('opacity', S.light ? '0.95' : '0');
    els.flame.setAttribute('opacity', S.boiling ? '0.85' : '0.12');

    /* a dirty filter looks oily */
    els.filterGrease.setAttribute('opacity', S.dirty ? '0.55' : '0.08');

    /* the oil cup slowly fills while frying */
    greaseT = clamp(greaseT + (S.boiling ? S.capture * 0.0006 * d * 60 : 0), 0, 1);
    els.oilLevel.setAttribute('height', (2 + greaseT * 14).toFixed(1));
    els.oilLevel.setAttribute('y', (282 - (2 + greaseT * 14)).toFixed(1));

    /* ── smoke rising from the wok ── */
    const rate = S.boiling ? 1 : 0.15;
    const capture = clamp(S.capture, 0, 1);
    for (let i = 0; i < smoke.length; i++) {
      const p = smoke[i];
      const f = ((now * 0.42 * (0.55 + S.spin * 0.9) + i / smoke.length) % 1);
      /* the plume bends towards the hood when the fan is strong */
      const pull = capture * (1 - f);
      const x = baseX[i] + (170 - baseX[i]) * pull * 0.9;
      const y = 392 - f * (392 - 250);
      p.setAttribute('cx', x.toFixed(1));
      p.setAttribute('cy', y.toFixed(1));
      const a = Math.sin(f * Math.PI) * rate * (0.55 + capture * 0.45);
      p.setAttribute('opacity', (a * (f > 0.86 ? (1 - f) / 0.14 : 1)).toFixed(2));
    }

    /* ── the smoke that gets away ── */
    const esc = clamp(S.escape * rate, 0, 1);
    for (let i = 0; i < escaped.length; i++) {
      const p = escaped[i];
      const f = ((now * 0.30 + i / escaped.length) % 1);
      const dir = i % 2 ? 1 : -1;
      const x = 170 + dir * (30 + f * 120) + Math.sin(now * 0.8 + i) * 8;
      const y = 360 - f * 150;
      p.setAttribute('cx', x.toFixed(1));
      p.setAttribute('cy', y.toFixed(1));
      p.setAttribute('opacity', (esc * Math.sin(f * Math.PI) * 0.85).toFixed(2));
    }

    /* ── air going up the duct ── */
    const ductOn = S.mode === 'duct';
    els.ductP.setAttribute('opacity', ductOn ? '1' : '0');
    if (ductOn) {
      for (let i = 0; i < ductP.length; i++) {
        const p = ductP[i];
        const f = ((now * 0.75 * (0.4 + S.spin) + i / ductP.length) % 1);
        p.setAttribute('cx', (146 + (i % 4) * 16).toFixed(1));
        p.setAttribute('cy', (140 - f * 124).toFixed(1));
        p.setAttribute('opacity', (S.spin * 0.85 * Math.min(1, f * 6)).toFixed(2));
      }
    }

    /* ── recirculating: air comes back out of the front grille ── */
    const recircOn = S.mode === 'recirc';
    els.grille.setAttribute('opacity', recircOn ? '1' : '0');
    els.recircP.setAttribute('opacity', recircOn ? '1' : '0');
    if (recircOn) {
      for (let i = 0; i < recircP.length; i++) {
        const p = recircP[i];
        const f = ((now * 0.6 * (0.4 + S.spin) + i / recircP.length) % 1);
        p.setAttribute('cx', (124 + (i % 4) * 30).toFixed(1));
        p.setAttribute('cy', (222 + f * 90).toFixed(1));
        p.setAttribute('opacity', (S.spin * 0.8 * (1 - f)).toFixed(2));
      }
    }

    /* ── labels for the mode ── */
    els.scene.classList.toggle('mode-duct', ductOn);
    els.scene.classList.toggle('mode-recirc', recircOn);
    els.scene.classList.toggle('dirty', S.dirty);
    els.scene.classList.toggle('off', S.fan === 0);
    document.querySelectorAll('.lab').forEach(l => {
      const k = l.dataset.lab;
      l.classList.toggle('hide',
        (k === 'outside' && recircOn) ||
        (k === 'grille' && ductOn) ||
        (k === 'damper' && recircOn));
    });

    /* ── the teaching note ── */
    let note;
    if (S.fan === 0) note = t('tOff');
    else if (S.dirty) note = t('tDirty');
    else if (recircOn) note = t('tRecirc');
    else note = t('tDuct');
    if (seen.note !== note) {
      seen.note = note;
      els.paneNote.textContent = note;
    }

    /* ── status + chips ── */
    const lead = recircOn ? t('recirc') : t('ducted');
    if (seen.lead !== lead) { seen.lead = lead; els.lead.textContent = lead; }
    const st = S.fan === 0 ? t('idle') : t('blowing');
    if (seen.status !== st) {
      seen.status = st;
      els.status.textContent = st;
      els.status.classList.toggle('busy', S.fan > 0);
    }

    const air = Math.round(S.air);
    if (seen.air !== air) { seen.air = air; els.hudAir.textContent = air; }
    const cc = Math.round(clamp(S.capture, 0, 1) * 100) + '%';
    if (seen.cc !== cc) {
      seen.cc = cc;
      els.hudCatch.textContent = cc;
      els.hudCatch.style.color = S.capture > 0.9 ? '#8ef0b4' : S.capture > 0.6 ? '#fbbf24' : '#f87171';
    }
  }

  let toastTimer = null;
  function toast(msg, good) {
    if (!msg) return;
    els.toast.textContent = msg;
    els.toast.classList.toggle('good', good !== false);
    els.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove('show'), 2600);
  }

  return { build, render, toast };
})();
