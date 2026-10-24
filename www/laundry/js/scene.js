/* ═══════════════════════════════════════════
   laundry/js/scene.js — the washer, the dryer and the clothes
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.scene = (function () {

  const T = () => ARG.i18n.t;
  const M = () => ARG.sim.s;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const NS = 'http://www.w3.org/2000/svg';
  const WX = 89, WY = 310;       // washer drum centre
  const DX = 249, DY = 310;      // dryer drum centre

  let els = {};
  let bubbles = [], steam = [], dirtSpecks = [], drySpecks = [];
  let washerAngle = 0, dryerAngle = 0;
  let lastNote = null, lastLead = null, lastStatus = null;
  let lastWashDisplay = null, lastDryDisplay = null;

  function mk(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    if (attrs) Object.keys(attrs).forEach(k => e.setAttribute(k, attrs[k]));
    return e;
  }

  function clothes(host, cx, cy, colours) {
    const shirt = 'M-9,-7 L-4,-10 L4,-10 L9,-7 L6,-3 L4,-4 V9 H-4 V-4 L-6,-3 Z';
    const sock = 'M-4,-8 H4 V3 Q4,8 0,8 Q-4,8 -4,3 Z';
    const towel = 'M-7,-6 H7 V6 H-7 Z';
    const items = [
      { d: shirt, dx: -11, dy: -3, rot: -16, s: 1.00 },
      { d: sock,  dx: 12,  dy: 10, rot: 34,  s: 1.10 },
      { d: shirt, dx: 5,   dy: -15, rot: 104, s: 0.72 },
      { d: towel, dx: 10,  dy: -1, rot: 14,  s: 0.86 }
    ];
    items.forEach((it, i) => {
      host.appendChild(mk('path', {
        d: it.d,
        fill: colours[i % colours.length],
        stroke: 'rgba(255,255,255,.28)',
        'stroke-width': '0.9',
        transform: 'translate(' + (cx + it.dx) + ' ' + (cy + it.dy) + ') rotate(' + it.rot + ') scale(' + it.s + ')'
      }));
    });
  }

  function specks(host, cx, cy, out, fill) {
    for (let i = 0; i < 10; i++) {
      const a = i * 2.399;
      const r = 10 + (i % 4) * 6;
      const c = mk('circle', {
        cx: (cx + Math.cos(a) * r).toFixed(1),
        cy: (cy + Math.sin(a) * r).toFixed(1),
        r: (1.1 + (i % 3) * 0.5).toFixed(1),
        fill: fill || '#7a5b33',
        opacity: '0'
      });
      host.appendChild(c);
      out.push(c);
    }
  }

  function build() {
    els.scene = document.getElementById('scene');
    els.washer = document.getElementById('washer');
    els.dryer = document.getElementById('dryer');
    els.washerDrum = document.getElementById('washerDrum');
    els.washerClothes = document.getElementById('washerClothes');
    els.washerWater = document.getElementById('washerWater');
    els.washerFoam = document.getElementById('washerFoam');
    els.washerDisplay = document.getElementById('washerDisplay');
    els.washerKnob = document.getElementById('washerKnob');
    els.dryerDrum = document.getElementById('dryerDrum');
    els.dryerClothes = document.getElementById('dryerClothes');
    els.dryerGlow = document.getElementById('dryerGlow');
    els.dryerSteam = document.getElementById('dryerSteam');
    els.dryerDisplay = document.getElementById('dryerDisplay');
    els.dryerKnob = document.getElementById('dryerKnob');
    els.lead = document.getElementById('scene-lead');
    els.status = document.getElementById('scene-status');
    els.paneNote = document.getElementById('pane-note');
    els.toast = document.getElementById('toast');

    /* clothes inside each drum */
    if (els.washerClothes) {
      clothes(els.washerClothes, WX, WY, ['#67e8f9', '#f6bb8a', '#a8e2ff', '#8ecf72']);
      specks(els.washerClothes, WX, WY, dirtSpecks);
    }
    if (els.dryerClothes) {
      clothes(els.dryerClothes, DX, DY, ['#ffb37a', '#a8e2ff', '#f0d0a0', '#c4b5fd']);
      specks(els.dryerClothes, DX, DY, drySpecks, '#7fd6ff');
    }

    /* foam */
    for (let i = 0; i < 14; i++) {
      const b = mk('circle', { r: (1.8 + (i % 4) * 0.8).toFixed(1), class: 'bubble', opacity: '0' });
      if (els.washerFoam) els.washerFoam.appendChild(b);
      bubbles.push(b);
    }

    /* steam out of the dryer vent */
    for (let i = 0; i < 10; i++) {
      const s = mk('circle', { r: (2.6 + (i % 3) * 1.2).toFixed(1), class: 'steam', opacity: '0' });
      if (els.dryerSteam) els.dryerSteam.appendChild(s);
      steam.push(s);
    }
  }

  /* ─────────── what the panel note should say ─────────── */
  function noteKey() {
    const S = M();

    if (S.tab === 'wash') {
      if (S.phase === 'spin') return 'tSpin';
      if (S.phase === 'wash' || S.phase === 'rinse') {
        if (S.detergent === 'high') return 'tDetergent';
        if (S.load === 'wool' && S.temp > 30) return 'tTemp';
        if (S.load === 'wool' && S.program !== 'wool') return 'tWool';
        if (S.load === 'gym' && S.program !== 'heavy') return 'tGym';
        return 'tWashIntro';
      }
      if (S.washDone) return S.washReason;
      if (S.load === 'wool' && S.temp > 30) return 'tTemp';
      if (S.load === 'wool' && S.program !== 'wool') return 'tWool';
      if (S.load === 'gym' && S.program !== 'heavy') return 'tGym';
      return 'tSort';
    }

    if (S.phase === 'heat' || S.phase === 'dry') {
      if (S.load !== 'mixed' && S.heat === 'high') return 'tHeatCare';
      return S.dryProgram === 'sensor' ? 'tSensor' : 'tTimed';
    }
    if (S.dryDone) return S.dryReason;
    if (S.load !== 'mixed' && S.heat === 'high') return 'tHeatCare';
    return 'tDryIntro';
  }

  /* ─────────── render ─────────── */
  function render(dt) {
    const S = M();
    const t = T();
    const d = dt || 0.016;
    const now = performance.now() / 1000;

    const washRun = ARG.sim.isWashing();
    const dryRun = ARG.sim.isDrying();

    /* the drums turn, fastest during the spin */
    const wSpeed = S.phase === 'spin' ? 900 : S.phase === 'wash' ? 120 : S.phase === 'rinse' ? 80 : 0;
    washerAngle = (washerAngle + wSpeed * d) % 360;
    if (els.washerDrum) {
      els.washerDrum.setAttribute('transform', 'rotate(' + washerAngle.toFixed(1) + ' ' + WX + ' ' + WY + ')');
    }

    const dSpeed = S.phase === 'dry' ? 110 : S.phase === 'heat' ? 60 : S.phase === 'cool' ? 45 : 0;
    dryerAngle = (dryerAngle + dSpeed * d) % 360;
    if (els.dryerDrum) {
      els.dryerDrum.setAttribute('transform', 'rotate(' + dryerAngle.toFixed(1) + ' ' + DX + ' ' + DY + ')');
    }

    if (els.washerKnob) {
      els.washerKnob.setAttribute('transform',
        'rotate(' + (ARG.sim.PROG_ORDER.indexOf(S.program) * 42 - 40) + ' 134 158)');
    }
    if (els.dryerKnob) {
      els.dryerKnob.setAttribute('transform',
        'rotate(' + (S.dryProgram === 'timed' ? 34 : -30) + ' 294 158)');
    }

    /* water level in the washer, 0 .. 0.65 */
    let level = 0;
    if (S.phase === 'fill') level = 0.65 * clamp(S.phaseT / ARG.sim.PHASES.fill, 0, 1);
    else if (S.phase === 'wash') level = 0.65;
    else if (S.phase === 'drain') level = 0.65 * (1 - clamp(S.phaseT / ARG.sim.PHASES.drain, 0, 1));
    else if (S.phase === 'rinse') level = 0.40;
    else if (S.phase === 'spin') level = 0.12 * (1 - clamp(S.phaseT / ARG.sim.PHASES.spin, 0, 1));

    const waterH = level * 78;
    const waterTop = WY + 44 - waterH;
    if (els.washerWater) {
      els.washerWater.setAttribute('y', waterTop.toFixed(1));
      els.washerWater.setAttribute('height', waterH.toFixed(1));
      els.washerWater.setAttribute('opacity', level > 0.01 ? '0.9' : '0');
    }

    /* foam sits on the waterline */
    for (let i = 0; i < bubbles.length; i++) {
      const b = bubbles[i];
      const f = ((now * 0.5 + i / bubbles.length) % 1);
      const x = WX + Math.sin(i * 2.1 + now * 0.7) * 26;
      const y = waterTop + 5 - f * 16;
      b.setAttribute('cx', x.toFixed(1));
      b.setAttribute('cy', y.toFixed(1));
      const a = level > 0.02 ? S.bubbles * (0.25 + 0.75 * Math.sin(f * Math.PI)) : 0;
      b.setAttribute('opacity', a.toFixed(2));
    }

    /* dirt slowly disappears from the clothes */
    const load = ARG.sim.loadById(S.load);
    const dirt = clamp(S.dirt / Math.max(0.01, load.dirt), 0, 1);
    for (let i = 0; i < dirtSpecks.length; i++) {
      dirtSpecks[i].setAttribute('opacity', (dirt * 0.9).toFixed(2));
    }

    /* ── the dryer ── */
    if (els.dryerGlow) {
      els.dryerGlow.setAttribute('opacity', (S.heatLevel * 0.9).toFixed(2));
    }
    for (let i = 0; i < drySpecks.length; i++) {
      drySpecks[i].setAttribute('opacity', (clamp(S.moisture, 0, 1) * 0.35).toFixed(2));
    }

    const steamStrength = dryRun ? clamp(S.moisture * 1.8, 0, 1) * (S.phase === 'cool' ? 0.4 : 1) : 0;
    for (let i = 0; i < steam.length; i++) {
      const s = steam[i];
      const f = ((now * 0.28 + i / steam.length) % 1);
      s.setAttribute('cx', (304 + Math.sin(now * 0.9 + i * 1.7) * 7).toFixed(1));
      s.setAttribute('cy', (102 - f * 88).toFixed(1));
      s.setAttribute('opacity', (steamStrength * Math.sin(f * Math.PI) * 0.8).toFixed(2));
    }

    /* ── displays ── */
    let wtxt;
    if (S.phase === 'done') wtxt = '✓';
    else if (washRun) wtxt = S.temp + '° ' + Math.round(S.progress * 100) + '%';
    else wtxt = S.temp + '°';
    if (lastWashDisplay !== wtxt) {
      lastWashDisplay = wtxt;
      if (els.washerDisplay) els.washerDisplay.textContent = wtxt;
    }

    const dtext = Math.round(S.moisture * 100) + '%';
    if (lastDryDisplay !== dtext) {
      lastDryDisplay = dtext;
      if (els.dryerDisplay) els.dryerDisplay.textContent = dtext;
    }

    /* ── chrome ── */
    if (els.scene) {
      els.scene.classList.toggle('mode-wash', S.tab === 'wash');
      els.scene.classList.toggle('mode-dry', S.tab === 'dry');
      els.scene.classList.toggle('running', washRun || dryRun);
      els.scene.classList.toggle('spinning', S.phase === 'spin');
      els.scene.classList.toggle('heating', dryRun);
      els.scene.classList.toggle('foamy', S.bubbles > 0.45);
      els.scene.classList.toggle('done', S.phase === 'done');
    }
    if (els.washer) els.washer.classList.toggle('active', S.tab === 'wash' || washRun);
    if (els.dryer) els.dryer.classList.toggle('active', S.tab === 'dry' || dryRun);

    const lead = S.tab === 'wash' ? t('leadWash') : t('leadDry');
    if (lastLead !== lead) { lastLead = lead; if (els.lead) els.lead.textContent = lead; }

    const status = S.phase === 'idle' ? t('statusIdle')
      : S.phase === 'done' ? t('statusDone')
      : washRun ? t('statusWash') : t('statusDry');
    if (lastStatus !== status) {
      lastStatus = status;
      if (els.status) {
        els.status.textContent = status;
        els.status.classList.toggle('busy', washRun || dryRun);
      }
    }

    const note = t(noteKey());
    if (lastNote !== note) {
      lastNote = note;
      if (els.paneNote) els.paneNote.textContent = note;
    }
  }

  let toastTimer = null;
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
