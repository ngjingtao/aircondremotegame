/* ═══════════════════════════════════════════════════════════
   indah/js/scene.js — the sewer journey and the treatment works
   ═══════════════════════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.scene = (function () {

  const T = () => ARG.i18n.t;
  const M = () => ARG.sim.s;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const X0 = 40, X1 = 300;

  /* the six stages of an extended-aeration works, top to bottom,
     exactly the six labels down the middle of the Indah Water diagram */
  const STAGES = [
    { key: 'p0', label: 'oPump',      y: 40,  h: 54,  tag: 'pump',      water: '#6b4a25' },
    { key: 'p1', label: 'oScreens',   y: 104, h: 66,  tag: 'screens',   water: '#7a5830' },
    { key: 'p2', label: 'oAeration',  y: 180, h: 120, tag: 'aeration',  water: '#6f8046' },
    { key: 'p3', label: 'oSplit',     y: 310, h: 40,  tag: 'split',     water: '#8d9a72' },
    { key: 'p4', label: 'oClarifier', y: 360, h: 96,  tag: 'clarifier', water: '#9fb3a6' },
    { key: 'p5', label: 'oEffluent',  y: 466, h: 44,  tag: 'effluent',  water: '#7fd0ff' }
  ];

  /* `hidden` is not reflected on SVG elements, so toggle the attribute */
  function show(el, on) {
    if (!el) return;
    if (on) el.removeAttribute('hidden');
    else el.setAttribute('hidden', '');
  }

  /* ── the route the wastewater takes, as point lists, so the particles
        follow the actual pipes instead of guessing at them ── */
  const NET_PTS = [
    [96, 184], [106, 204], [132, 266], [152, 276], [184, 288],
    [200, 302], [218, 318], [240, 336], [252, 358], [280, 412],
    [296, 452], [314, 488]
  ];

  /* the works is a serpentine: the water crosses each tank, then drops to the
     next one and crosses back the other way */
  function plantPts() {
    const pts = [];
    STAGES.forEach((st, i) => {
      const cy = st.y + st.h / 2;
      if (i % 2 === 0) pts.push([X0 + 14, cy], [X1 - 14, cy]);
      else pts.push([X1 - 14, cy], [X0 + 14, cy]);
    });
    return pts;
  }
  const PLANT_PTS = plantPts();

  const pathFrom = pts => pts.map((p, i) => (i ? 'L' : 'M') + p[0] + ',' + p[1]).join(' ');

  function at(pts, k) {
    const n = pts.length - 1;
    const f = clamp(k, 0, 1) * n;
    const i = Math.min(n - 1, Math.floor(f));
    const u = f - i;
    const a = pts[i], b = pts[i + 1];
    return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
  }

  let els = {};
  let netDots = [];
  let plantParts = [];
  let bubbles = [];
  const seen = {};

  function build() {
    els.scene = document.getElementById('scene');
    els.networkScene = document.getElementById('networkScene');
    els.plantScene = document.getElementById('plantScene');
    els.labelsNetwork = document.getElementById('labels-network');
    els.labelsPlant = document.getElementById('labels-plant');
    els.netFlow = document.getElementById('netFlow');
    els.plantFlow = document.getElementById('plantFlow');
    els.netWater = document.getElementById('netWater');
    els.stages = document.getElementById('stages');
    els.paneNote = document.getElementById('pane-note');
    els.status = document.getElementById('scene-status');
    els.lead = document.getElementById('scene-lead');
    els.toast = document.getElementById('toast');
    els.stepNetwork = document.getElementById('steps-network');
    els.stepPlant = document.getElementById('steps-plant');
    els.hudStage = document.getElementById('hud-stage');
    els.hudVal = document.getElementById('hud-val');
    els.hudLabel2 = document.getElementById('hud-label2');
    els.airBtn = document.getElementById('air-btn');
    els.airTxt = document.getElementById('air-txt');

    buildStages();
    buildNetParticles();
    buildPlantParticles();
  }

  /* ─────────── the works ─────────── */
  function stageDetail(st, i) {
    const y = st.y, h = st.h;

    if (st.tag === 'pump') {
      /* a wet well with two submersible pumps and the rising main */
      let s = '<g class="well">' +
        `<rect x="${X0 + 6}" y="${y + h - 22}" width="150" height="18" rx="4" fill="#3a2a18"/>` +
        `<circle cx="${X0 + 34}" cy="${y + h - 13}" r="8"/>` +
        `<circle cx="${X0 + 66}" cy="${y + h - 13}" r="8"/>` +
        '</g>';
      s += `<rect class="riser" x="${X0 + 150}" y="${y + 6}" width="10" height="${h - 6}" rx="4"/>`;
      s += `<rect class="riser" x="${X0 + 150}" y="${y + 6}" width="86" height="10" rx="4"/>`;
      return s;
    }

    if (st.tag === 'screens') {
      /* a bar screen, a grit channel and a measuring flume */
      let bars = '';
      for (let x = X0 + 14; x < X0 + 96; x += 9) {
        bars += `<rect x="${x}" y="${y + 10}" width="3" height="${h - 26}" fill="#55647a"/>`;
      }
      let flume = '';
      for (let k = 0; k < 4; k++) {
        flume += `<line x1="${X0 + 190}" y1="${y + 14 + k * 11}" x2="${X0 + 234}" y2="${y + 14 + k * 11}" stroke="#4a596e" stroke-width="1.6"/>`;
      }
      return `<g class="bars">${bars}</g>` + flume +
        `<g class="grit"><ellipse cx="${X0 + 58}" cy="${y + h - 10}" rx="9" ry="4"/>` +
        `<ellipse cx="${X0 + 84}" cy="${y + h - 9}" rx="7" ry="3.5"/>` +
        `<ellipse cx="${X0 + 132}" cy="${y + h - 10}" rx="6" ry="3"/></g>` +
        `<rect class="rake" x="${X0 + 12}" y="${y + 8}" width="86" height="4" rx="2"/>`;
    }

    if (st.tag === 'aeration') {
      /* the aeration tank: a diffuser grid along the floor, and the blower
         main running up the left-hand side */
      let grid = '';
      for (let x = X0 + 20; x < X1 - 20; x += 34) {
        grid += `<rect x="${x}" y="${y + h - 16}" width="20" height="8" rx="3"/>`;
      }
      return `<g class="diffuser">${grid}</g>` +
        `<rect class="blower-pipe" x="${X0 + 8}" y="${y + 10}" width="8" height="${h - 24}" rx="3"/>` +
        `<g class="bubbles"></g>`;
    }

    if (st.tag === 'split') {
      /* a small dividing weir with two outlets */
      return `<path class="divider" d="M${X0 + 100},${y + 6} L${X0 + 130},${y + h - 8} L${X0 + 160},${y + 6} Z"/>` +
        `<rect class="outlet" x="${X0 + 110}" y="${y + h - 10}" width="10" height="8" rx="2"/>` +
        `<rect class="outlet" x="${X0 + 142}" y="${y + h - 10}" width="10" height="8" rx="2"/>`;
    }

    if (st.tag === 'clarifier') {
      /* clear water on top, a sludge bed on the floor, a scraper, a weir */
      return `<rect class="sludge-bed" x="${X0 + 8}" y="${y + h - 26}" width="${X1 - X0 - 16}" height="20" rx="7"/>` +
        `<g class="scraper"><rect x="${X0 + 30}" y="${y + h - 30}" width="${X1 - X0 - 60}" height="4" rx="2"/>` +
        `<rect x="${X0 + 46}" y="${y + h - 30}" width="4" height="14"/>` +
        `<rect x="${X0 + 110}" y="${y + h - 30}" width="4" height="14"/>` +
        `<rect x="${X0 + 174}" y="${y + h - 30}" width="4" height="14"/></g>` +
        `<rect class="weir" x="${X1 - 16}" y="${y + 24}" width="12" height="20" rx="3"/>`;
    }

    if (st.tag === 'effluent') {
      /* out of the works and away down the drain */
      return `<path class="out-arrow" d="M${X0 + 170},${y + h / 2} h64 m0,0 l-12,-7 m12,7 l-12,7"/>` +
        `<g class="riffle"><path d="M${X0 + 10},${y + h / 2} q10,-6 20,0 t20,0 t20,0 t20,0 t20,0 t20,0"/></g>`;
    }

    return '';
  }

  function buildStages() {
    const d = pathFrom(PLANT_PTS);
    let html =
      `<path id="plantPipeOut" d="${d}" fill="none" stroke="#0a1119" stroke-width="19" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path id="plantPipe" d="${d}" fill="none" stroke="#8fa0b4" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path id="plantWater" d="${d}" fill="none" stroke="#6aa9d8" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="0 1"/>`;

    STAGES.forEach((st, i) => {
      html += `<g class="stage" data-lab="${st.tag}">
        <rect x="${X0}" y="${st.y}" width="${X1 - X0}" height="${st.h}" rx="10"
              fill="url(#tankGrad)" stroke="#2b3a4e" stroke-width="1.6"/>
        <rect class="stage-water" x="${X0 + 5}" y="${st.y + 5}" width="${X1 - X0 - 10}"
              height="${st.h - 10}" rx="7" fill="${st.water}" opacity="0.62"/>
        ${stageDetail(st, i)}
        <text class="stage-name" x="${X0 + 12}" y="${st.y + 16}" data-i18n="${st.label}"></text>
      </g>`;
    });

    els.stages.innerHTML = html;
    els.plantWater = document.getElementById('plantWater');
    const holder = els.stages.querySelector('.bubbles');
    if (holder) {
      let b = '';
      for (let i = 0; i < 16; i++) {
        const x = X0 + 24 + Math.random() * (X1 - X0 - 48);
        const y = STAGES[2].y + 26 + Math.random() * (STAGES[2].h - 56);
        b += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(1.6 + Math.random() * 2.6).toFixed(1)}"/>`;
      }
      holder.innerHTML = b;
      bubbles = Array.prototype.slice.call(holder.children);
    }
  }

  /* ─────────── particles ─────────── */
  function buildNetParticles() {
    let html = '';
    for (let i = 0; i < 9; i++) html += '<circle class="fp" r="3.4"/>';
    els.netFlow.innerHTML = html;
    netDots = Array.prototype.slice.call(els.netFlow.children);
  }

  function buildPlantParticles() {
    let html = '';
    for (let i = 0; i < 12; i++) html += '<circle class="pp" r="3.4"/>';
    els.plantFlow.innerHTML = html;
    plantParts = Array.prototype.slice.call(els.plantFlow.children);
  }

  /* ─────────── render ─────────── */
  function render(dt) {
    const S = M();
    const t = T();
    const d = dt || 0.016;

    const net = S.tab === 'network';
    els.scene.classList.toggle('tab-network', net);
    els.scene.classList.toggle('tab-plant', !net);
    els.scene.dataset.step = String(S.step);
    show(els.networkScene, net);
    show(els.plantScene, !net);
    show(els.labelsNetwork, net);
    show(els.labelsPlant, !net);

    if (net) renderNetwork(S, t, d);
    else renderPlant(S, t, d);

    /* ── the fact for this stage ── */
    const list = net ? ARG.sim.NETWORK : ARG.sim.PLANT;
    const st = list[S.step] || list[0];

    if (seen.note !== st.key) {
      seen.note = st.key;
      els.paneNote.textContent = t(st.fact);
      document.querySelectorAll('.step').forEach((b, i) => {
        b.classList.toggle('on', i === S.step);
        b.classList.toggle('done', i < S.step);
      });
    }

    /* ── highlight the part this step is about ── */
    if (seen.lit !== st.lit) {
      seen.lit = st.lit;
      /* one step can point at a whole mechanism, so `lit` is a list */
      const want = String(st.lit || '').split(/\s+/).filter(Boolean);
      const on = el => el.classList.toggle('on', want.indexOf(el.dataset.lab) >= 0);
      netLabs().forEach(on);
      netParts().forEach(on);
      els.stages.querySelectorAll('.stage').forEach(on);
    }

    /* ── status + hud ── */
    const status = t(st.key);
    if (seen.status !== status) {
      seen.status = status;
      els.status.textContent = status;
    }
    const lead = net ? t('tabNetwork') : t('tabPlant');
    if (seen.lead !== lead) { seen.lead = lead; els.lead.textContent = lead; }

    const stageTxt = (S.step + 1) + ' / ' + list.length;
    if (seen.stage !== stageTxt) { seen.stage = stageTxt; els.hudStage.textContent = stageTxt; }

    const q = S.clean < 0.25 ? t('cleanRaw') : (S.clean < 0.8 ? t('cleanHalf') : t('cleanDone'));
    if (seen.q !== q) {
      seen.q = q;
      els.hudLabel2.textContent = t('waterQ');
      els.hudVal.textContent = q;
      els.hudVal.style.color = S.clean < 0.25 ? '#c9a86a' : (S.clean < 0.8 ? '#9fb3a6' : '#7fd0ff');
    }
    if (S.air !== seen.air) {
      seen.air = S.air;
      els.plantScene.classList.toggle('no-air', !S.air);
      els.airTxt.textContent = S.air ? t('airOn') : t('airOff');
      els.airBtn.classList.toggle('off', !S.air);
    }
  }

  function netLabs() {
    return Array.prototype.slice.call(els.labelsNetwork.querySelectorAll('.lab'));
  }

  /* the drawn parts of the journey — the house, the chambers, the two halves
     of the pipe. Each carries a data-lab that a step can point at. */
  function netParts() {
    return Array.prototype.slice.call(els.networkScene.querySelectorAll('[data-lab]'));
  }

  /* ── 1. the journey ── */
  function renderNetwork(S, t, d) {
    /* the pipe fills up as the wastewater works its way to the plant */
    els.netWater.setAttribute('stroke-dasharray', clamp(S.flow, 0, 1).toFixed(3) + ' 1');

    els.netFlow.setAttribute('opacity', '1');
    for (let i = 0; i < netDots.length; i++) {
      const p = netDots[i];
      /* every particle sits a little behind the leading edge, and the whole
         stream stops at whatever the water has reached */
      const f = S.flow * (1 - i / (netDots.length * 1.6)) - (i % 3) * 0.012;
      if (f <= 0.005) { p.setAttribute('opacity', '0'); continue; }
      const q = at(NET_PTS, f);
      p.setAttribute('cx', q[0].toFixed(1));
      p.setAttribute('cy', q[1].toFixed(1));
      p.setAttribute('opacity', '0.95');
    }
  }

  /* ── 2. the works ── */
  function renderPlant(S, t, d) {
    els.plantWater.setAttribute('stroke-dasharray', clamp(S.flow, 0, 1).toFixed(3) + ' 1');

    for (let i = 0; i < plantParts.length; i++) {
      const p = plantParts[i];
      const f = S.flow * (1 - i / (plantParts.length * 1.6)) - (i % 3) * 0.012;
      if (f <= 0.005) { p.setAttribute('opacity', '0'); continue; }
      const q = at(PLANT_PTS, f);
      p.setAttribute('cx', q[0].toFixed(1));
      p.setAttribute('cy', q[1].toFixed(1));
      /* the water gets cleaner as it goes: brown first, blue at the outfall */
      const stage = Math.min(STAGES.length - 1, Math.floor(f * STAGES.length));
      p.setAttribute('fill', S.clean > 0.8 ? '#bfe8ff' : STAGES[stage].water);
      p.setAttribute('opacity', '0.95');
    }

    /* the bacteria only work while the blowers are running */
    const on = S.blower > 0.15;
    bubbles.forEach((b, i) => {
      if (!on) { b.setAttribute('opacity', '0'); return; }
      const base = +b.getAttribute('data-by') || (b.getAttribute('cy') | 0);
      if (!b.getAttribute('data-by')) b.setAttribute('data-by', base);
      const top = STAGES[2].y + 14, bot = STAGES[2].y + STAGES[2].h - 18;
      const y = bot - ((performance.now() / 14 + i * 90) % (bot - top));
      b.setAttribute('cy', y.toFixed(1));
      b.setAttribute('opacity', (0.25 + 0.6 * ((y - top) / (bot - top)) * S.blower).toFixed(2));
    });

    /* the return-sludge pump only turns while there is air */
    if (els.plantScene) els.plantScene.classList.toggle('sludge-off', S.sludge < 0.5);
  }

  /* ─────────── toast ─────────── */
  let toastTimer = null;
  function toast(msg, good) {
    if (!msg) return;
    els.toast.textContent = msg;
    els.toast.classList.toggle('good', good !== false);
    els.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove('show'), 2600);
  }

  return { build, render, toast, STAGES };
})();
