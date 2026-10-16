/* ═══════════════════════════════════════════
   aircare/js/scene.js — the refrigerant loop + the wash overlays
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.scene = (function () {

  const T = () => ARG.i18n.t;
  const M = () => ARG.sim.s;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* The refrigerant loop, in flow order:
     expansion valve -> evaporator -> compressor -> condenser -> back to the valve */
  const LOOP = [
    [262, 156],   // 0  expansion valve outlet   (cold again)
    [246, 156],
    [246, 138],   // 2  evaporator inlet
    [58, 138], [58, 118], [246, 118], [246, 98], [58, 98], [58, 78],
    [246, 78],    // 9  evaporator outlet        (cold gas)
    [292, 78], [292, 200], [292, 320], [258, 356],
    [150, 392],   // 14 compressor inlet
    [96, 404],    // 15 compressor outlet        (HOT gas)
    [96, 420],    // 16 condenser inlet
    [250, 420], [250, 438], [96, 438], [96, 456],
    [250, 456],   // 21 condenser outlet         (warm liquid)
    [292, 456], [306, 380], [306, 220],
    [306, 168]    // 25 back into the indoor unit
  ];

  const I_EVAP_OUT = 9;
  const I_COMP_OUT = 15;
  const I_COND_OUT = 21;

  const COL_COLD = '#6fd2ff';
  const COL_COLDGAS = '#a6e4ff';
  const COL_HOT = '#ff5433';
  const COL_WARM = '#ffb347';

  const PARTICLES = 16;
  const SAMPLES = 260;

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

  let els = {};
  let parts = [];
  let airIn = [], airOut = [], outAir = [];
  let stops = [];
  let samples = null;
  let total = 0;
  const seen = {};

  function build() {
    els.scene = document.getElementById('scene');
    els.loop = document.getElementById('loop');
    els.drops = document.getElementById('drops');
    els.airflow = document.getElementById('airflow');
    els.fanBlades = document.getElementById('fanBlades');
    els.cycleList = document.getElementById('cycle-list');
    els.paneNote = document.getElementById('pane-note');
    els.toast = document.getElementById('toast');
    els.status = document.getElementById('scene-status');
    els.evapTint = document.getElementById('evapTint');
    els.condTint = document.getElementById('condTint');

    const d = smooth(LOOP, true);

    /* tube + the four colour zones on top */
    els.loop.innerHTML =
      '<path id="tube" d="' + d + '" fill="none" stroke="rgba(226,240,255,.18)" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path id="tints" d="' + d + '" fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<g id="parts"></g>';

    els.tints = document.getElementById('tints');
    els.parts = document.getElementById('parts');

    /* cumulative length so we know where each stage sits */
    const cum = [0];
    let len = 0;
    for (let i = 0; i < LOOP.length; i++) {
      const a = LOOP[i], b = LOOP[(i + 1) % LOOP.length];
      len += Math.hypot(b[0] - a[0], b[1] - a[1]);
      cum.push(len);
    }
    total = len;
    stops = [
      { f: 0, c: COL_COLD },
      { f: cum[I_EVAP_OUT] / total, c: COL_COLDGAS },
      { f: cum[I_COMP_OUT] / total, c: COL_HOT },
      { f: cum[I_COND_OUT] / total, c: COL_WARM },
      { f: cum[25] / total, c: COL_COLD }
    ];

    /* sample the path once — never call getPointAtLength per frame */
    const probe = document.getElementById('tube');
    samples = new Array(SAMPLES + 1);
    for (let i = 0; i <= SAMPLES; i++) {
      try { samples[i] = probe.getPointAtLength(total * i / SAMPLES); }
      catch (e) { samples[i] = { x: 150, y: 200 }; }
    }

    /* refrigerant particles */
    let html = '';
    for (let i = 0; i < PARTICLES; i++) html += '<circle class="rf" r="3.4"/>';
    els.parts.innerHTML = html;
    parts = Array.prototype.slice.call(els.parts.children);
    parts.forEach((p, i) => { p._f = i / PARTICLES; });

    /* airflow particles */
    let air = '';
    for (let i = 0; i < 6; i++) air += '<circle class="ai" r="3"/>';
    for (let i = 0; i < 6; i++) air += '<circle class="ao" r="3.2"/>';
    for (let i = 0; i < 6; i++) air += '<circle class="oh" r="3.2"/>';
    els.airflow.innerHTML = air;
    airIn = Array.prototype.slice.call(els.airflow.querySelectorAll('.ai'));
    airOut = Array.prototype.slice.call(els.airflow.querySelectorAll('.ao'));
    outAir = Array.prototype.slice.call(els.airflow.querySelectorAll('.oh'));

    buildCycleList();
  }

  function buildCycleList() {
    const list = [
      ['cComp', 'cCompSub', 'tComp'],
      ['cCond', 'cCondSub', 'tCond'],
      ['cValve', 'cValveSub', 'tValve'],
      ['cEvap', 'cEvapSub', 'tEvap']
    ];
    els.cycleList.innerHTML = list.map(([a, b, spoken], i) =>
      `<button class="cyc" data-cyc="${i}" data-action="speakPart" data-part="${i}" data-speak="${spoken}">
         <span class="cyc-n">${i + 1}</span>
         <div><b data-i18n="${a}"></b><i data-i18n="${b}"></i></div>
         <span class="cyc-spk">🔊</span>
       </button>`).join('');
  }

  function pointAt(f) {
    if (!samples) return { x: 150, y: 200 };
    if (!isFinite(f)) f = 0;
    f = ((f % 1) + 1) % 1;
    const x = f * SAMPLES;
    const i = Math.floor(x);
    const t = x - i;
    const a = samples[i], b = samples[i + 1] || samples[0];
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  }

  function colourAt(f) {
    let c = stops[0].c;
    for (let i = 0; i < stops.length; i++) if (f >= stops[i].f) c = stops[i].c;
    return c;
  }

  /* ─────────── render ─────────── */
  function render(dt) {
    const S = M();
    const d = dt || 0.016;
    const t = T();

    els.scene.classList.toggle('mode-how', S.mode === 'how');
    els.scene.classList.toggle('mode-wash', S.mode === 'wash');
    els.scene.dataset.washStep = String(S.step);

    /* ── the four colour zones of the tube ── */
    if (S.running) {
      let grad = '';
      for (let i = 0; i < stops.length - 1; i++) {
        const a = stops[i], b = stops[i + 1];
        grad += `<stop offset="${(a.f * 100).toFixed(1)}%" stop-color="${a.c}"/>`;
        grad += `<stop offset="${(b.f * 100).toFixed(1)}%" stop-color="${b.c}"/>`;
      }
      grad += `<stop offset="100%" stop-color="${stops[stops.length - 1].c}"/>`;
      if (seen.grad !== grad) {
        seen.grad = grad;
        els.tints.setAttribute('stroke', `url(#rfGrad)`);
        let defs = document.getElementById('rfGrad');
        if (!defs) {
          defs = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
          defs.setAttribute('id', 'rfGrad');
          defs.setAttribute('gradientUnits', 'userSpaceOnUse');
          defs.setAttribute('x1', '0'); defs.setAttribute('y1', '60');
          defs.setAttribute('x2', '0'); defs.setAttribute('y2', '470');
          els.art_defs = defs;
          document.getElementById('art').querySelector('defs').appendChild(defs);
        }
        defs.innerHTML = grad;
      }
      els.tints.setAttribute('opacity', (0.35 + S.speed * 0.55).toFixed(2));
    } else {
      els.tints.setAttribute('opacity', '0.08');
    }

    /* ── the coils get cold / hot ── */
    els.evapTint.setAttribute('opacity', (S.power ? 0.16 + (14 - S.evapTemp) / 14 * 0.55 : 0.05).toFixed(2));
    els.condTint.setAttribute('opacity', (S.power ? 0.14 + (S.condTemp - 30) / 30 * 0.55 : 0.05).toFixed(2));

    /* ── refrigerant particles ── */
    const spd = 0.05 + S.speed * 0.055;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      p._f = (p._f + spd * d) % 1;
      if (!isFinite(p._f)) p._f = i / PARTICLES;
      const pt = pointAt(p._f);
      p.setAttribute('cx', pt.x.toFixed(1));
      p.setAttribute('cy', pt.y.toFixed(1));
      const c = colourAt(p._f);
      if (p._c !== c) { p._c = c; p.setAttribute('fill', c); }
      p.setAttribute('opacity', (0.35 + S.speed * 0.65).toFixed(2));
    }

    /* ── airflow ── */
    const fanSpin = S.running ? 1 : 0;
    if (seen.spin !== fanSpin) {
      seen.spin = fanSpin;
      els.fanBlades.style.animationPlayState = fanSpin ? 'running' : 'paused';
      els.fanBlades.style.animationDuration = (1.1 / Math.max(0.25, S.speed)).toFixed(2) + 's';
    }

    const airT = S.mode === 'how' ? 1 : 0;
    if (seen.airT !== airT) { seen.airT = airT; els.airflow.setAttribute('opacity', airT ? '1' : '0'); }

    const phase = (performance.now() / 1000) % 1;
    airIn.forEach((a, i) => {
      let f = (phase + i / airIn.length) % 1;
      a.setAttribute('cx', (70 + i * 34).toFixed(1));
      a.setAttribute('cy', (12 + f * 44).toFixed(1));
      a.setAttribute('opacity', (0.15 + 0.7 * Math.sin(f * Math.PI)).toFixed(2));
    });
    airOut.forEach((a, i) => {
      let f = (phase + i / airOut.length) % 1;
      a.setAttribute('cx', (54 + i * 38).toFixed(1));
      a.setAttribute('cy', (188 + f * 52).toFixed(1));
      a.setAttribute('opacity', (0.15 + 0.7 * Math.sin(f * Math.PI)).toFixed(2));
    });
    outAir.forEach((a, i) => {
      let f = (phase + i / outAir.length) % 1;
      a.setAttribute('cx', (298 + f * 40).toFixed(1));
      a.setAttribute('cy', (368 + i * 9).toFixed(1));
      a.setAttribute('opacity', (0.15 + 0.7 * Math.sin(f * Math.PI)).toFixed(2));
    });

    /* ── cycle list highlight ── */
    const idx = S.running ? S.stage : -1;
    if (seen.stage !== idx) {
      seen.stage = idx;
      els.cycleList.querySelectorAll('.cyc').forEach((el, i) => el.classList.toggle('on', i === idx));
    }
    const labels = { 0: 'comp', 1: 'cond', 2: null, 3: 'evap' };
    const lit = labels[idx];
    if (seen.lit !== lit) {
      seen.lit = lit;
      document.querySelectorAll('#labels .lab').forEach(l => l.classList.toggle('on', l.dataset.lab === lit));
    }

    /* ── wash: which part is lit ── */
    if (S.mode === 'wash') {
      const step = ARG.sim.STEPS[S.step] || ARG.sim.STEPS[0];
      if (seen.litWash !== step.lit) {
        seen.litWash = step.lit;
        document.querySelectorAll('#labels .lab').forEach(l => {
          l.classList.toggle('wash-on',
            (step.lit === 'filters' && l.dataset.lab === 'filter') ||
            (step.lit === 'coil' && l.dataset.lab === 'evap') ||
            (step.lit === 'drain' && l.dataset.lab === 'drain') ||
            (step.lit === 'outcoil' && l.dataset.lab === 'cond') ||
            (step.lit === 'plug' && false));
        });
      }
      const key = step.key;
      if (seen.note !== key) {
        seen.note = key;
        els.paneNote.textContent = t(step.fact);
        els.paneNote.classList.add('show');
      }
    } else {
      const idea = t('rendering');
      if (seen.note !== idea) { seen.note = idea; els.paneNote.textContent = idea; els.paneNote.classList.add('show'); }
    }

    /* ── status chip ── */
    const st = S.mode === 'wash'
      ? (S.step + 1) + ' / ' + ARG.sim.STEPS.length
      : (S.power ? t('on') : t('off'));
    if (seen.status !== st) {
      seen.status = st;
      els.status.textContent = st;
      els.scene.classList.toggle('off', !S.power && S.mode === 'how');
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
