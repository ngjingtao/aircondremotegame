/* ═══════════════════════════════════════════
   tree/js/scene.js — the seed, the roots, the tree
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.scene = (function () {

  const T = () => ARG.i18n.t;
  const M = () => ARG.sim.s;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const NS = 'http://www.w3.org/2000/svg';

  const BASE_X = 170;
  const BASE_Y = 400;

  let els = {};
  let drops = [], seeds = [];
  let lastNote = null, lastLead = null, lastStatus = null;
  let toastTimer = null;

  function mk(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    if (attrs) Object.keys(attrs).forEach(k => e.setAttribute(k, attrs[k]));
    return e;
  }

  function build() {
    els.scene = document.getElementById('scene');
    els.sunRays = document.getElementById('sunRays');
    els.sunGlow = document.getElementById('sunGlow');
    els.shadeNet = document.getElementById('shadeNet');
    els.soilMoisture = document.getElementById('soilMoisture');
    els.waterCan = document.getElementById('waterCan');
    els.waterDrops = document.getElementById('waterDrops');
    els.seedParticles = document.getElementById('seedParticles');
    els.wiltLeaves = document.getElementById('wiltLeaves');
    els.lead = document.getElementById('scene-lead');
    els.status = document.getElementById('scene-status');
    els.paneNote = document.getElementById('pane-note');
    els.toast = document.getElementById('toast');

    if (els.waterDrops) {
      for (let i = 0; i < 8; i++) {
        const d = mk('circle', { r: (1.7 + (i % 3) * 0.6).toFixed(1), class: 'drop', opacity: '0' });
        els.waterDrops.appendChild(d);
        drops.push(d);
      }
    }

    if (els.seedParticles) {
      for (let i = 0; i < 7; i++) {
        const s = mk('g', { class: 'flySeed', opacity: '0' });
        s.appendChild(mk('ellipse', { rx: '4.2', ry: '2.6', fill: '#a8824d', stroke: '#7a5b33', 'stroke-width': '.7' }));
        s.appendChild(mk('path', { d: 'M-2,0 H2', stroke: '#6b4a2a', 'stroke-width': '.7' }));
        els.seedParticles.appendChild(s);
        seeds.push(s);
      }
    }
  }

  function render(dt) {
    const S = M();
    const t = T();
    const d = dt || 0.016;
    const now = performance.now() / 1000;

    if (els.scene) {
      els.scene.setAttribute('data-stage', S.stage);
      els.scene.setAttribute('data-sun', S.sun);
      els.scene.classList.toggle('wilting', S.health < 0.5 || S.phase === 'wilted');
      els.scene.classList.toggle('done', S.phase === 'done');
      els.scene.classList.toggle('paused', S.phase === 'paused');
    }

    /* the active stage grows a little within its phase */
    const active = document.getElementById('t' + S.stage);
    if (active) {
      const scale = 0.94 + clamp(S.growth, 0, 1) * 0.06;
      active.setAttribute('transform',
        'translate(' + BASE_X + ' ' + BASE_Y + ') scale(1 ' + scale.toFixed(3) + ') translate(' + (-BASE_X) + ' ' + (-BASE_Y) + ')');
    }

    /* light and shade */
    const rayOpacity = [0.16, 0.55, 1][S.sun];
    if (els.sunRays) els.sunRays.setAttribute('opacity', String(rayOpacity));
    if (els.sunGlow) els.sunGlow.setAttribute('opacity', String([0.15, 0.45, 0.9][S.sun]));
    if (els.shadeNet) els.shadeNet.setAttribute('opacity', String([0.92, 0.45, 0][S.sun]));

    /* wet soil is darker and bluer */
    if (els.soilMoisture) {
      els.soilMoisture.setAttribute('opacity', (0.08 + S.water * 0.38).toFixed(2));
    }
    if (els.wiltLeaves) {
      els.wiltLeaves.setAttribute('opacity', (S.phase === 'wilted' && S.stage >= 2) ? '1' : '0');
    }

    /* the watering can and its drops */
    const pulse = clamp(S.waterPulse, 0, 1);
    if (els.waterCan) els.waterCan.setAttribute('opacity', pulse > 0.03 ? String(0.5 + pulse * 0.5) : '0');
    for (let i = 0; i < drops.length; i++) {
      const dr = drops[i];
      const f = ((now * 1.25 + i / drops.length) % 1);
      dr.setAttribute('cx', (86 + (i % 4) * 7 + Math.sin(now * 4 + i) * 1.5).toFixed(1));
      dr.setAttribute('cy', (232 + f * 150).toFixed(1));
      dr.setAttribute('opacity', (pulse > 0.03 ? pulse * Math.sin(f * Math.PI) * 0.9 : 0).toFixed(2));
    }

    /* seeds let go at the end */
    const flying = S.stage === 7 && (S.phase === 'growing' || S.phase === 'paused' || S.phase === 'done');
    for (let i = 0; i < seeds.length; i++) {
      const s = seeds[i];
      const f = ((now * 0.24 + i / seeds.length) % 1);
      const x = 186 + f * 138;
      const y = 242 + Math.sin(f * 2.4 + i) * 26 - f * 18;
      s.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + (f * 180 + i * 31).toFixed(1) + ')');
      s.setAttribute('opacity', flying ? (Math.sin(f * Math.PI) * 0.9).toFixed(2) : '0');
    }

    /* labels come and go with the phase */
    document.querySelectorAll('#labels .lab').forEach(l => {
      const from = +(l.dataset.from || 0);
      const to = +(l.dataset.to || 7);
      l.classList.toggle('hide', S.stage < from || S.stage > to);
    });

    /* chrome */
    const lead = t('lead');
    if (lastLead !== lead) { lastLead = lead; if (els.lead) els.lead.textContent = lead; }

    const status = S.phase === 'idle' ? t('statusIdle')
      : S.phase === 'growing' ? t('statusGrowing')
      : S.phase === 'paused' ? t('statusPaused')
      : S.phase === 'done' ? t('statusDone')
      : t('statusWilted');
    if (lastStatus !== status) {
      lastStatus = status;
      if (els.status) {
        els.status.textContent = status;
        els.status.classList.toggle('busy', S.phase === 'growing');
        els.status.classList.toggle('bad', S.phase === 'wilted');
      }
    }

    const note = t(ARG.sim.adviceKey());
    if (lastNote !== note) {
      lastNote = note;
      if (els.paneNote) els.paneNote.textContent = note;
    }
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
