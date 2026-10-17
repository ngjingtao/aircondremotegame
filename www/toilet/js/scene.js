/* ═══════════════════════════════════════════
   toilet/js/scene.js — the flush cutaway + the treatment train
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.scene = (function () {

  const T = () => ARG.i18n.t;
  const M = () => ARG.sim.s;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* the eight tanks of a treatment plant, top to bottom.
     Each one gets a little dirtier-looking water until it comes out clean. */
  const TANKS = [
    { key: 's0', label: 'pScreen',    y: 40,  h: 44, colour: '#6b4a25', tag: '' },
    { key: 's1', label: 'pScreen',    y: 92,  h: 46, colour: '#7a5830', tag: 'bars' },
    { key: 's2', label: 'pGrit',      y: 146, h: 46, colour: '#8a6a3a', tag: 'grit' },
    { key: 's3', label: 'pPrimary',   y: 200, h: 62, colour: '#9c7d48', tag: 'settle' },
    { key: 's4', label: 'pAeration',  y: 270, h: 92, colour: '#7d7a45', tag: 'air' },
    { key: 's5', label: 'pClarifier', y: 370, h: 62, colour: '#9fb3a6', tag: 'settle' },
    { key: 's6', label: 'pDisinfect', y: 440, h: 42, colour: '#bcdcea', tag: 'clean' },
    { key: 's7', label: 'pRiver',     y: 490, h: 30, colour: '#7fd0ff', tag: 'river' }
  ];

  const X0 = 40, X1 = 300;

  /* `hidden` is an HTML property — it is NOT reflected on SVG elements, so
     `svgGroup.hidden = true` silently does nothing and an authored `hidden`
     attribute can never be turned back off. Toggle the attribute instead. */
  function show(el, on) {
    if (!el) return;
    if (on) el.removeAttribute('hidden');
    else el.setAttribute('hidden', '');
  }

  let els = {};
  let parts = [];          // flush particles
  let treatParts = [];     // treatment particles
  let bubbles = [];
  const seen = {};

  function build() {
    els.scene = document.getElementById('scene');
    els.flushScene = document.getElementById('flushScene');
    els.treatScene = document.getElementById('treatScene');    els.labelsFlush = document.getElementById('labels-flush');
    els.labelsTreat = document.getElementById('labels-treat');
    els.flushFlow = document.getElementById('flushFlow');
    els.treatFlow = document.getElementById('treatFlow');
    els.tanks = document.getElementById('tanks');
    els.cisternWater = document.getElementById('cisternWater');
    els.bowlWater = document.getElementById('bowlWater');
    els.bowlWave = document.getElementById('bowlWave');
    els.bowlWave2 = document.getElementById('bowlWave2');
    els.trapWater = document.getElementById('trapWater');
    els.flapper = document.getElementById('flapper');
    els.chain = document.getElementById('chain');
    els.flushButton = document.getElementById('flushButton');
    els.float = document.getElementById('float');
    els.paneNote = document.getElementById('pane-note');
    els.status = document.getElementById('scene-status');
    els.lead = document.getElementById('scene-lead');
    els.toast = document.getElementById('toast');
    els.stepFlush = document.getElementById('steps-flush');
    els.stepTreat = document.getElementById('steps-treat');
    els.hudStage = document.getElementById('hud-stage');
    els.hudVal = document.getElementById('hud-val');
    els.hudLabel2 = document.getElementById('hud-label2');
    els.airBtn = document.getElementById('air-btn');
    els.airTxt = document.getElementById('air-txt');

    buildTanks();
    buildFlushParticles();
    buildTreatParticles();
  }

  /* ── the treatment train ── */
  function buildTanks() {
    let html = '';
    TANKS.forEach((tk, i) => {
      html += `<g class="tank" data-tank="${i}">
        <rect x="${X0}" y="${tk.y}" width="${X1 - X0}" height="${tk.h}" rx="10" fill="#16202e" stroke="#2b3a4e" stroke-width="1.6"/>
        <rect class="tank-water" x="${X0 + 4}" y="${tk.y + 4}" width="${X1 - X0 - 8}" height="${tk.h - 8}" rx="7" fill="${tk.colour}" opacity="0.55"/>
        ${tankDetail(tk, i)}
        <text class="tank-name" x="${X0 + 10}" y="${tk.y + 15}" data-i18n="${tk.label}"></text>
        ${i < TANKS.length - 1 ? `<rect x="${X0 + 22}" y="${tk.y + tk.h}" width="10" height="${TANKS[i + 1].y - tk.y - tk.h}" fill="#2b3a4e"/>` : ''}
      </g>`;
    });
    els.tanks.innerHTML = html;

    /* labels on the right of the scene */
    let lab = '';
    TANKS.forEach((tk, i) => {
      lab += `<g class="tlab" data-lab="${i}">
        <text x="${X1 + 6}" y="${tk.y + tk.h / 2 + 3}" data-i18n="${tk.label}"></text>
      </g>`;
    });
    els.labelsTreat.innerHTML = lab;
  }

  function tankDetail(tk, i) {
    if (tk.tag === 'bars') {
      let s = '';
      for (let x = X0 + 16; x < X1 - 16; x += 11) s += `<rect x="${x}" y="${tk.y + 6}" width="3" height="${tk.h - 12}" fill="#3a4a5f"/>`;
      return s;
    }
    if (tk.tag === 'grit') {
      return `<g class="grit"><ellipse cx="${X0 + 60}" cy="${tk.y + tk.h - 12}" rx="7" ry="4"/>
              <ellipse cx="${X0 + 110}" cy="${tk.y + tk.h - 10}" rx="5" ry="3"/>
              <ellipse cx="${X0 + 170}" cy="${tk.y + tk.h - 13}" rx="8" ry="4"/>
              <ellipse cx="${X0 + 220}" cy="${tk.y + tk.h - 11}" rx="6" ry="3.5"/></g>`;
    }
    if (tk.tag === 'settle') {
      return `<g class="sludge-bed"><rect x="${X0 + 8}" y="${tk.y + tk.h - 16}" width="${X1 - X0 - 16}" height="12" rx="5"/></g>
              <g class="grease"><ellipse cx="${X0 + 70}" cy="${tk.y + 10}" rx="16" ry="4"/>
              <ellipse cx="${X0 + 150}" cy="${tk.y + 9}" rx="22" ry="5"/>
              <ellipse cx="${X0 + 220}" cy="${tk.y + 11}" rx="14" ry="3.5"/></g>`;
    }
    if (tk.tag === 'air') {
      return `<g class="aerator">${(() => {
        let s = '';
        for (let x = X0 + 20; x < X1 - 20; x += 26) s += `<circle cx="${x}" cy="${tk.y + tk.h - 12}" r="5"/>`;
        return s;
      })()}</g><g class="bubbles"></g>`;
    }
    if (tk.tag === 'clean') {
      return `<g class="uv">${(() => {
        let s = '';
        for (let x = X0 + 30; x < X1 - 20; x += 34) s += `<rect x="${x}" y="${tk.y + 8}" width="6" height="${tk.h - 16}" rx="3"/>`;
        return s;
      })()}</g>`;
    }
    if (tk.tag === 'river') {
      return `<path class="river" d="M${X0 + 4} ${tk.y + 10} q 20 8 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0" fill="none" stroke="#bfe8ff" stroke-width="3" opacity="0.7"/>`;
    }
    return '';
  }

  /* ── particles ── */
  function buildFlushParticles() {
    let html = '';
    for (let i = 0; i < 8; i++) html += '<circle class="fp" r="3"/>';
    els.flushFlow.innerHTML = html;
    parts = Array.prototype.slice.call(els.flushFlow.children);
  }

  function buildTreatParticles() {
    let html = '';
    for (let i = 0; i < 14; i++) html += '<circle class="tp" r="3"/>';
    els.treatFlow.innerHTML = html;
    treatParts = Array.prototype.slice.call(els.treatFlow.children);

    /* aeration bubbles */
    const holder = els.tanks.querySelector('.bubbles');
    if (holder) {
      let b = '';
      for (let i = 0; i < 14; i++) {
        const x = X0 + 24 + Math.random() * (X1 - X0 - 48);
        const y = TANKS[4].y + 20 + Math.random() * (TANKS[4].h - 40);
        b += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(1.6 + Math.random() * 2.4).toFixed(1)}"/>`;
      }
      holder.innerHTML = b;
      bubbles = Array.prototype.slice.call(holder.children);
    }
  }

  function tankY(i, f) {
    const a = TANKS[i], b = TANKS[Math.min(i + 1, TANKS.length - 1)];
    return a.y + 12 + (b.y - a.y) * f;
  }

  /* ─────────── render ─────────── */
  function render(dt) {
    const S = M();
    const t = T();
    const d = dt || 0.016;

    const flushMode = S.mode === 'flush';
    els.scene.classList.toggle('mode-flush', flushMode);
    els.scene.classList.toggle('mode-treat', !flushMode);
    els.scene.dataset.step = String(S.step);
    show(els.flushScene, flushMode);
    show(els.treatScene, !flushMode);
    show(els.labelsFlush, flushMode);
    show(els.labelsTreat, !flushMode);

    if (flushMode) renderFlush(S, t, d);
    else renderTreat(S, t, d);

    /* ── note + step list highlight ── */
    const list = flushMode ? ARG.sim.FLUSH : ARG.sim.TREAT;
    const st = list[S.step] || list[0];

    if (seen.note !== st.key) {
      seen.note = st.key;
      els.paneNote.textContent = t(st.fact);
      els.paneNote.classList.add('show');
      document.querySelectorAll('.step').forEach((b, i) => {
        b.classList.toggle('on', i === S.step);
        b.classList.toggle('done', i < S.step);
      });
    }

    /* ── which part is highlighted ── */
    if (seen.lit !== st.lit) {
      seen.lit = st.lit;
      /* one step can point at several parts, so `lit` is a space-separated list */
      const want = String(st.lit || '').split(/\s+/).filter(Boolean);
      els.labelsFlush.querySelectorAll('.lab').forEach(l => l.classList.toggle('on', want.indexOf(l.dataset.lab) >= 0));
      els.tanks.querySelectorAll('.tank').forEach((el, i) => el.classList.toggle('on', i === S.step));
      els.labelsTreat.querySelectorAll('.tlab').forEach((el, i) => el.classList.toggle('on', i === S.step));
    }

    /* ── status ── */
    const status = flushMode
      ? (S.flushing ? t('flushing') : t('ready'))
      : ((S.step + 1) + ' / ' + list.length);
    if (seen.status !== status) {
      seen.status = status;
      els.status.textContent = status;
      els.status.classList.toggle('busy', flushMode && S.flushing);
    }
    const lead = flushMode ? t('tabFlush') : t('tabTreat');
    if (seen.lead !== lead) { seen.lead = lead; els.lead.textContent = lead; }

    const stageTxt = (S.step + 1) + ' / ' + list.length;
    if (seen.stage !== stageTxt) { seen.stage = stageTxt; els.hudStage.textContent = stageTxt; }

    /* the second chip shows something different in each mode */
    const label2 = flushMode ? t('oSeal') : t('pAeration');
    const val2 = flushMode
      ? (S.bowl > 0.66 ? t('yes') : '—')
      : (S.air ? t('airOn') : t('airOff'));
    if (seen.val2 !== label2 + val2) {
      seen.val2 = label2 + val2;
      els.hudLabel2.textContent = label2;
      els.hudVal.textContent = val2;
      els.hudVal.style.color = flushMode ? '#7dd3fc' : (S.air ? '#8ef0b4' : '#93a3bd');
    }
    if (S.air !== seen.air) {
      seen.air = S.air;
      els.treatScene.classList.toggle('no-air', !S.air);
      els.airTxt.textContent = S.air ? t('airOn') : t('airOff');
      els.airBtn.classList.toggle('off', !S.air);
    }
  }

  /* the trapway centreline, so the flow particles can follow the pipe
     instead of guessing at it */
  const TRAP_PTS = [
    [170, 368], [172, 392], [178, 410], [190, 424],
    [202, 427], [208, 412], [208, 380], [208, 352],
    [214, 340], [226, 340], [232, 356], [232, 460]
  ];

  function trapAt(k) {
    const n = TRAP_PTS.length - 1;
    const f = clamp(k, 0, 1) * n;
    const i = Math.min(n - 1, Math.floor(f));
    const u = f - i;
    const a = TRAP_PTS[i], b = TRAP_PTS[i + 1];
    return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
  }

  function renderFlush(S, t, d) {
    /* cistern water level (the tank interior is 100 units deep) */
    const cH = 100 * clamp(S.cistern, 0, 1);
    els.cisternWater.setAttribute('y', (180 - cH).toFixed(1));
    els.cisternWater.setAttribute('height', cH.toFixed(1));

    /* the float rides on the water; it is drawn at y=72 when the tank is full */
    const floatY = 172 - cH;
    els.float.setAttribute('transform', 'translate(0 ' + (floatY - 72).toFixed(1) + ')');

    /* pressing the button lifts the chain, and the chain lifts the far end of
       the flapper — which is hinged on the overflow tube at (196,180) */
    const lift = S.flushing && S.flushT < 3.2;
    const deg = lift ? 40 : 0;
    els.flapper.setAttribute('transform', 'rotate(' + deg + ' 196 180)');
    const rad = deg * Math.PI / 180;
    els.chain.setAttribute('d', 'M152,79 L' +
      (196 - 48 * Math.cos(rad)).toFixed(1) + ',' + (180 - 48 * Math.sin(rad)).toFixed(1));
    els.flushButton.setAttribute('transform', S.flushing && S.flushT < 0.35 ? 'translate(0 5)' : 'translate(0 0)');

    /* bowl water surface.
       At rest (bowl = 0.75) this lands on y = 332, which is exactly the crest
       of the weir — water can only stand as high as the weir, so the seal
       level and the weir are the same height. Raising the weir without moving
       this line would leave the seal sitting at the wrong level. */
    const bowlTop = 280 + (1 - clamp(S.bowl, 0, 1)) * 208;
    els.bowlWater.setAttribute('y', bowlTop.toFixed(1));
    els.bowlWater.setAttribute('height', Math.max(0, 376 - bowlTop).toFixed(1));
    if (els.bowlWave) {
      els.bowlWave.setAttribute('cy', (bowlTop + 3).toFixed(1));
      els.bowlWave.setAttribute('opacity', S.flushing ? '0.75' : '0.5');
      els.bowlWave2.setAttribute('cy', (bowlTop + 7).toFixed(1));
      els.bowlWave2.setAttribute('opacity', S.flushing ? '0.5' : '0.3');
    }

    /* trapway: full and fast while siphoning */
    els.trapWater.setAttribute('opacity', S.siphoning ? '1' : (S.flushing ? '0.95' : '0.85'));
    els.trapWater.setAttribute('stroke-width', S.siphoning ? '26' : '22');

    /* flow particles: cistern → under the rim → down the bowl → round the trap */
    const active = S.flushing && S.flushT >= 0;
    els.flushFlow.setAttribute('opacity', active ? '1' : '0');
    if (active) {
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        const f = ((S.flushT * 0.55) + i / parts.length) % 1;
        let x, y;
        if (f < 0.28) {                       /* falling out of the cistern */
          const k = f / 0.28;
          x = 170; y = 184 + k * 24;
        } else if (f < 0.52) {                /* out from under the rim */
          const k = (f - 0.28) / 0.24;
          x = 170 - k * 56; y = 210 + k * 40;
        } else if (f < 0.78) {                /* down the bowl to the outlet */
          const k = (f - 0.52) / 0.26;
          x = 114 + k * 56; y = 250 + k * 122;
        } else {                              /* round the U and over the weir */
          const q = trapAt((f - 0.78) / 0.22);
          x = q[0]; y = q[1];
        }
        p.setAttribute('cx', x.toFixed(1));
        p.setAttribute('cy', y.toFixed(1));
        p.setAttribute('opacity', (0.9 - Math.abs(0.5 - f) * 0.5).toFixed(2));
      }
    }
  }

  function renderTreat(S, t, d) {
    /* the water creeps down the train */
    const flow = clamp(S.flow, 0, 1);
    els.treatFlow.setAttribute('opacity', '1');

    for (let i = 0; i < treatParts.length; i++) {
      const p = treatParts[i];
      let f = ((performance.now() / 2600) + i / treatParts.length) % 1;
      /* only show the part of the stream the water has actually reached */
      if (f > flow + 0.06) { p.setAttribute('opacity', '0'); continue; }
      const span = f * TANKS.length;
      const ti = Math.min(TANKS.length - 1, Math.floor(span));
      const tf = span - ti;
      p.setAttribute('cx', (X0 + 30 + ((i * 37) % (X1 - X0 - 60))).toFixed(1));
      p.setAttribute('cy', tankY(ti, tf).toFixed(1));
      p.setAttribute('fill', TANKS[ti].colour);
      p.setAttribute('opacity', '0.9');
    }

    /* aeration bubbles rise only while the air is on */
    const on = S.air;
    bubbles.forEach((b, i) => {
      if (!on) { b.setAttribute('opacity', '0'); return; }
      const base = +b.getAttribute('data-by') || (b.getAttribute('cy') | 0);
      if (!b.getAttribute('data-by')) b.setAttribute('data-by', base);
      const top = TANKS[4].y + 12, bot = TANKS[4].y + TANKS[4].h - 10;
      let y = bot - ((performance.now() / 14 + i * 90) % (bot - top));
      b.setAttribute('cy', y.toFixed(1));
      b.setAttribute('opacity', (0.25 + 0.6 * ((y - top) / (bot - top))).toFixed(2));
    });

    /* light the tank the water is in */
    if (seen.tank !== S.step) {
      seen.tank = S.step;
      els.tanks.querySelectorAll('.tank').forEach((el, i) => el.classList.toggle('on', i === S.step));
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
