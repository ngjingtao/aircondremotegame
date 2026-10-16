/* ═══════════════════════════════════════════
   breath/js/scene.js — lungs, heart, blood circuit
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.scene = (function () {

  const T = () => ARG.i18n.t;
  const M = () => ARG.sim.s;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ── the circuit: heart → lungs → heart → body → heart ──
     Listed in the direction blood flows. Index 5 is where the blood
     picks up oxygen (lungs) and index 11 where it drops it off (body). */
  const CIRCUIT = [
    [145, 268],   // 0  right side of the heart
    [170, 230],   // 1  pulmonary artery
    [176, 190],   // 2  right lung
    [152, 158],   // 3
    [108, 158],   // 4
    [84, 190],    // 5  LEFT LUNG  → blood turns red here
    [100, 224],   // 6  pulmonary vein
    [116, 248],   // 7  left side of the heart
    [152, 280],   // 8  aorta
    [190, 312],   // 9
    [186, 344],   // 10
    [130, 356],   // 11 BODY       → blood turns blue here
    [74, 344],    // 12
    [70, 312],    // 13
    [114, 282]    // 14 vena cava
  ];
  const LUNG_I = 5;
  const BODY_I = 11;
  const CELLS = 16;

  function smooth(pts, closed) {
    const n = pts.length;
    const at = i => pts[closed ? ((i % n) + n) % n : clamp(i, 0, n - 1)];
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
      const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2[0]},${p2[1]}`;
    }
    return d + (closed ? ' Z' : '');
  }

  const PATH_D = smooth(CIRCUIT, true);

  let els = {};
  let circuitLen = 0;
  let lungFrac = 0, bodyFrac = 0;
  let cells = [];
  let airDots = [];
  let lastBeats = -1;
  const seen = {};

  /* The circuit is sampled once into a lookup table — calling
     getPointAtLength() for every cell on every frame is far too slow. */
  const SAMPLES = 240;
  let samplePts = null;

  function samplePath() {
    samplePts = new Array(SAMPLES + 1);
    for (let i = 0; i <= SAMPLES; i++) {
      try { samplePts[i] = els.highlight.getPointAtLength(circuitLen * i / SAMPLES); }
      catch (e) { samplePts[i] = { x: 130, y: 260 }; }
    }
  }

  function build() {
    els.scene = document.getElementById('scene');
    els.svg = document.getElementById('body');
    els.cells = document.getElementById('cells');
    els.toast = document.getElementById('toast');
    els.speech = document.getElementById('speech');
    els.status = document.getElementById('scene-status');
    els.alveoli = document.getElementById('alveoli');
    els.lungs = document.getElementById('lungs');
    els.heart = document.getElementById('heart');
    els.trachea = document.getElementById('trachea');
    els.airflow = document.getElementById('airflow');
    els.highlight = document.getElementById('highlight');

    /* vessels: a plain tube, then the oxygen-rich stretch in red on top */
    els.vessel = document.getElementById('vessel');
    els.vesselRed = document.getElementById('vesselRed');
    els.vessel.setAttribute('d', PATH_D);
    els.vesselRed.setAttribute('d', PATH_D);
    els.highlight.setAttribute('d', PATH_D);

    /* work out where the lung and body exchange points sit along the path */
    let total = 0;
    const cum = [0];
    for (let i = 0; i < CIRCUIT.length; i++) {
      const a = CIRCUIT[i], b = CIRCUIT[(i + 1) % CIRCUIT.length];
      total += Math.hypot(b[0] - a[0], b[1] - a[1]);
      cum.push(total);
    }
    circuitLen = total;
    lungFrac = cum[LUNG_I] / total;
    bodyFrac = cum[BODY_I] / total;

    const redLen = (bodyFrac - lungFrac) * total;
    els.vesselRed.setAttribute('stroke-dasharray', redLen.toFixed(1) + ' ' + (total + 10).toFixed(1));
    els.vesselRed.setAttribute('stroke-dashoffset', (-lungFrac * total).toFixed(1));

    /* blood cells */
    let html = '';
    for (let i = 0; i < CELLS; i++) html += '<circle class="cell" r="3.1"/>';
    els.cells.innerHTML = html;
    cells = Array.prototype.slice.call(els.cells.children);
    cells.forEach((c, i) => { c._f = i / CELLS; });

    /* air particles in the windpipe */
    let air = '';
    for (let i = 0; i < 5; i++) air += '<circle class="air" cx="130" r="2.4"/>';
    els.airflow.innerHTML = air;
    airDots = Array.prototype.slice.call(els.airflow.children);

    samplePath();
  }

  function pointAt(f) {
    if (!samplePts) return { x: 130, y: 260 };
    if (!isFinite(f)) f = 0;
    f = ((f % 1) + 1) % 1;
    const x = f * SAMPLES;
    const i = Math.floor(x);
    const t = x - i;
    const a = samplePts[i];
    const b = samplePts[i + 1] || samplePts[0];
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  }

  /* ─────────── render ─────────── */
  function render(dt) {
    const S = M();
    const t = T();
    const d = dt || 0.016;

    /* ── lungs inflate / deflate ── */
    const lungScale = 1 + (S.lungVol - 0.2) * 0.16;
    els.lungs.setAttribute('transform', `translate(130 200) scale(${lungScale.toFixed(3)}) translate(-130 -200)`);

    /* ── the heart beats: lub-dub ── */
    const bp = S.beatPhase;
    let pulse = 0;
    if (bp < 0.13) pulse = Math.sin((bp / 0.13) * Math.PI);
    else if (bp > 0.17 && bp < 0.32) pulse = Math.sin(((bp - 0.17) / 0.15) * Math.PI) * 0.42;
    const hs = 1 + pulse * 0.11;
    els.heart.setAttribute('transform', `translate(130 258) scale(${hs.toFixed(3)}) translate(-130 -258)`);

    /* ── air moving in the windpipe ── */
    const cyc = S.phase / (Math.PI * 2);
    airDots.forEach((dot, i) => {
      let f = (cyc + i * 0.2) % 1;
      if (f < 0) f += 1;
      if (S.holding) { dot.setAttribute('opacity', '0'); return; }
      const y = S.inhaling ? 100 + f * 50 : 150 - f * 50;
      dot.setAttribute('cy', y.toFixed(1));
      dot.setAttribute('opacity', (0.2 + 0.75 * Math.sin(f * Math.PI)).toFixed(2));
    });

    /* ── blood cells flow round the circuit ── */
    const speed = isFinite(S.loopSpeed) ? S.loopSpeed : 0.07;
    for (let i = 0; i < cells.length; i++) {
      const c = cells[i];
      c._f = (c._f + speed * d) % 1;
      if (!isFinite(c._f)) c._f = i / CELLS;
      const p = pointAt(c._f);
      c.setAttribute('cx', p.x.toFixed(1));
      c.setAttribute('cy', p.y.toFixed(1));
      const oxygenated = c._f >= lungFrac && c._f < bodyFrac;
      const red = oxygenated;
      if (c._red !== red) {
        c._red = red;
        c.setAttribute('fill', red ? '#e8453c' : '#3f7fd0');
      }
    }

    /* the oxygen-rich stretch of the vessel glows brighter when blood is well loaded */
    els.vesselRed.setAttribute('opacity', (0.35 + S.redness * 0.5).toFixed(2));

    /* ── the alveolus bubble breathes at the same rate ── */
    const gasPeriod = clamp(60 / Math.max(6, S.breathsPerMin), 0.9, 5.5);
    if (seen.gas !== gasPeriod.toFixed(1)) {
      seen.gas = gasPeriod.toFixed(1);
      els.alveoli.style.setProperty('--gas', gasPeriod.toFixed(2) + 's');
    }
    els.alveoli.classList.toggle('rich', S.spo2 > 94);
    els.alveoli.classList.toggle('poor', S.spo2 <= 94);

    /* ── speech on scenario change ── */
    if (S.sayingT > 0) {
      if (seen.saying !== S.saying) {
        seen.saying = S.saying;
        els.speech.textContent = ARG.i18n.pick(S.saying);
        els.speech.classList.add('show');
      }
    } else if (seen.saying) {
      seen.saying = '';
      els.speech.classList.remove('show');
    }

    /* ── toast ── */
    if (S.msgT > 0) {
      if (seen.msg !== S.msg) {
        seen.msg = S.msg;
        els.toast.textContent = t(S.msg);
        els.toast.classList.toggle('good', S.msgGood !== false);
        els.toast.classList.add('show');
      }
    } else if (seen.msg) {
      seen.msg = '';
      els.toast.classList.remove('show');
    }

    /* ── status chip ── */
    const name = t('sc' + S.scenario.charAt(0).toUpperCase() + S.scenario.slice(1));
    if (seen.status !== name) { seen.status = name; els.status.textContent = name; }

    return S;
  }

  return { build, render, get breathCue() { return M().breathCue; } };
})();
