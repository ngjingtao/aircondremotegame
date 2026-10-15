/* ═══════════════════════════════════════════
   food/js/body.js — the see-through boy and his gut
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.body = (function () {

  const T = () => ARG.i18n.t;
  const M = () => ARG.sim.s;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ─────────────────────────────────────────
     Geometry.  All points are in the 260×420 viewBox.
     One point list drives the drawing AND the food's path.
     ───────────────────────────────────────── */

  const MOUTH_ESO = [
    [130, 84], [130, 106], [129, 128], [127, 148]
  ];

  const STOMACH = [
    [127, 148], [112, 156], [102, 168], [104, 180], [118, 186], [132, 186]
  ];

  const DUODENUM = [
    [132, 186], [148, 192], [156, 202]
  ];

  /* small intestine: a coil of horizontal passes joined by u-turns */
  function coilPoints() {
    const pts = [[156, 202]];
    const left = 94, right = 168;
    let y = 210;
    for (let i = 0; i < 4; i++) {
      pts.push([right, y], [left, y]);
      y += 15;
      pts.push([left, y], [right, y]);
      y += 15;
    }
    pts.push([left, y]);
    pts.push([(left + right) / 2, y + 12]);
    return pts;
  }

  const ILIUM_END = [[126, 284]];

  const LARGE = [
    [126, 284], [160, 290], [182, 282], [190, 256], [190, 210],
    [186, 196], [160, 190], [110, 190], [80, 195],
    [68, 208], [66, 242], [70, 268], [82, 284],
    [102, 294], [118, 304], [124, 316]
  ];

  /* Catmull-Rom → cubic bezier, so hand-placed points look organic */
  function smooth(pts) {
    if (pts.length < 2) return '';
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const c1x = p1[0] + (p2[0] - p0[0]) / 6;
      const c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6;
      const c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2[0]},${p2[1]}`;
    }
    return d;
  }

  const COIL = coilPoints();

  const FULL = [].concat(MOUTH_ESO, STOMACH, DUODENUM, COIL, ILIUM_END, LARGE);

  const D = {
    eso: smooth(MOUTH_ESO),
    stomachOutline: smooth(STOMACH),
    duo: smooth(DUODENUM),
    coil: smooth(COIL),
    large: smooth(LARGE),
    full: smooth(FULL)
  };

  /* ─────────────────────────────────────────
     DOM build
     ───────────────────────────────────────── */
  let els = {};
  let foodPath = null;
  let pathLen = 0;
  let lastP = -1;

  const STAGE_ICON = { MOUTH: '👄', ESOPHAGUS: '⬇', STOMACH: '🫙', SMALL: '🌀', LARGE: '💧', OUT: '🚽' };

  function build() {
    const tract = document.getElementById('tract');
    const fx = document.getElementById('fx');
    const foodLayer = document.getElementById('foodLayer');
    const labels = document.getElementById('labels');

    ns(tract, `
      <path d="${D.large}" fill="none" class="organ large"/>
      <path d="${D.coil}" fill="none" class="organ coil"/>
      <path d="${D.duo}" fill="none" class="organ duo"/>
      <path class="organ stomach" fill="url(#stomachGrad)"
            d="M128,146 C115,147 103,156 100,171 C97,187 108,201 124,202 C140,203 151,193 150,179 C149,166 142,155 133,150 Z"/>
      <path d="${D.eso}" fill="none" class="organ eso"/>
      <path id="foodPath" d="${D.full}" fill="none" class="food-path"/>
    `);

    ns(fx, `
      <g id="peri" class="fx-peri">
        <ellipse cx="129" cy="100" rx="9" ry="3.4"/>
        <ellipse cx="129" cy="120" rx="9" ry="3.4"/>
        <ellipse cx="128" cy="140" rx="9" ry="3.4"/>
      </g>
      <g id="acid" class="fx-acid">
        <circle cx="106" cy="176" r="3"/>
        <circle cx="118" cy="182" r="2.4"/>
        <circle cx="126" cy="172" r="2.8"/>
        <circle cx="112" cy="164" r="2.2"/>
        <circle cx="122" cy="162" r="2"/>
      </g>
      <g id="sparks" class="fx-sparks">
        <circle cx="120" cy="230" r="2.6"/>
        <circle cx="140" cy="246" r="2.2"/>
        <circle cx="112" cy="262" r="2.4"/>
        <circle cx="152" cy="222" r="2"/>
        <circle cx="132" cy="276" r="2.6"/>
        <circle cx="104" cy="240" r="2"/>
      </g>
      <g id="drops" class="fx-drops">
        <circle cx="60" cy="230" r="3"/>
        <circle cx="196" cy="240" r="3"/>
        <circle cx="72" cy="260" r="2.6"/>
        <circle cx="186" cy="220" r="2.6"/>
        <circle cx="126" cy="300" r="2.8"/>
      </g>
      <g id="stink" class="fx-stink">
        <path d="M120 350 q-6 -10 0 -18" />
        <path d="M134 352 q6 -10 0 -18" />
        <path d="M127 340 q-5 -8 0 -14" />
      </g>
    `);

    ns(foodLayer, `
      <circle id="foodHalo" cx="0" cy="0" r="16" fill="url(#foodGlow)"/>
      <text id="foodEmoji" x="0" y="0" text-anchor="middle" dominant-baseline="central" font-size="19"></text>
      <circle id="foodTrail" cx="0" cy="0" r="3.4" fill="#ffd166" opacity="0.75"/>
    `);

    const LABELS = [
      ['MOUTH', 'lMouth', 130, 84, 'right', 8],
      ['ESOPHAGUS', 'lEso', 128, 112, 'left', 6],
      ['STOMACH', 'lStomach', 104, 170, 'left', 10],
      ['SMALL', 'lSmall', 118, 244, 'left', -4],
      ['LARGE', 'lLarge', 190, 232, 'right', -6],
      ['OUT', 'lRectum', 124, 310, 'right', -10]
    ];
    let lab = '';
    LABELS.forEach(([stage, key, ax, ay, side, dy]) => {
      const lx = side === 'left' ? 2 : 262;
      const ly = ay + dy;
      lab += `<g class="organ-label" data-stage="${stage}">
        <path class="leader" d="M${ax},${ay} L${side === 'left' ? lx + 58 : lx - 58},${ly}" />
        <text x="${lx}" y="${ly + 3}" text-anchor="${side === 'left' ? 'start' : 'end'}" data-i18n="${key}"></text>
      </g>`;
    });
    ns(labels, lab);

    foodPath = document.getElementById('foodPath');
    els.foodHalo = document.getElementById('foodHalo');
    els.foodEmoji = document.getElementById('foodEmoji');
    els.foodTrail = document.getElementById('foodTrail');
    els.body = document.getElementById('body');
    els.mouth = document.getElementById('mouth');
    els.tongue = document.getElementById('tongue');
    els.toilet = document.getElementById('toilet');
    els.dropped = document.getElementById('dropped');
    els.bellyBulge = document.getElementById('bellyBulge');
    els.factText = document.getElementById('fact-text');
    els.speech = document.getElementById('speech');
    els.stageIcon = document.getElementById('stage-icon');
    els.stageLabel = document.getElementById('stage-label');
    els.stageCount = document.getElementById('stage-count');
    els.sceneStage = document.getElementById('scene-stage');
    els.sceneMood = document.getElementById('scene-mood');
    els.stagePips = document.getElementById('stage-pips');

    /* stage pips */
    let pips = '';
    ARG.sim.STAGES.forEach((st, i) => {
      pips += `<button class="pip" data-stage="${st}" title="${i + 1}"><span>${i + 1}</span></button>`;
    });
    els.stagePips.innerHTML = pips;

    try { pathLen = foodPath.getTotalLength(); } catch (e) { pathLen = 0; }
  }

  function ns(parent, markup) {
    /* innerHTML on SVG elements works in every Chromium/WebKit build Capacitor uses */
    parent.insertAdjacentHTML('beforeend', markup);
  }

  /* ─────────────────────────────────────────
     Render
     ───────────────────────────────────────── */
  let chewPulse = 0;
  let lastStage = null;
  let lastFact = null;
  const seen = {};

  function bite() { chewPulse = 1; }

  function render(dt) {
    const s = M();
    const t = T();
    const snap = ARG.sim;

    if (lastStage !== s.stage) {
      lastStage = s.stage;
      els.body.dataset.stage = s.stage;
      const idx = snap.STAGES.indexOf(s.stage);
      els.stageIcon.textContent = STAGE_ICON[s.stage];
      els.stageLabel.textContent = t('s' + s.stage);
      els.stageCount.textContent = (idx + 1) + ' / 6';
      els.sceneStage.textContent = t('s' + s.stage);
      els.stagePips.querySelectorAll('.pip').forEach((p, i) => {
        p.classList.toggle('done', i < idx);
        p.classList.toggle('active', i === idx);
      });
      /* toilet appears for the last stage */
      els.toilet.style.opacity = s.stage === 'OUT' ? '1' : '0';
    }

    if (seen.mood !== s.mood) {
      seen.mood = s.mood;
      els.body.dataset.mood = s.mood;
      els.sceneMood.textContent = t('mood' + cap(s.mood));
      els.sceneMood.className = 'scene-mood m-' + s.mood;
    }

    /* chewing mouth */
    chewPulse = Math.max(0, chewPulse - (dt || 0.016) * 4.5);
    const open = s.stage === 'MOUTH' && s.food ? 4.5 + chewPulse * 7 : 4.5;
    els.mouth.setAttribute('ry', open.toFixed(1));
    els.tongue.setAttribute('cy', (74 + open * 0.32).toFixed(1));

    /* food along the path */
    const p = snap.clamp(s.p, 0, 1);
    if (foodPath && pathLen && Math.abs(p - lastP) > 0.0006) {
      lastP = p;
      try {
        const pt = foodPath.getPointAtLength(pathLen * p);
        const wob = s.stage === 'STOMACH' ? Math.sin(s.stageT * 9) * 5 : 0;
        const wobY = s.stage === 'STOMACH' ? Math.cos(s.stageT * 7) * 4 : 0;
        place(els.foodHalo, pt.x + wob, pt.y + wobY);
        place(els.foodEmoji, pt.x + wob, pt.y + wobY);
        const back = Math.max(0, p - 0.015);
        const pb = foodPath.getPointAtLength(pathLen * back);
        place(els.foodTrail, pb.x, pb.y);
      } catch (e) { /* path not measurable yet */ }
    }

    const f = snap.food;
    const emoji = f ? f.emoji : '';
    if (seen.emoji !== emoji) {
      seen.emoji = emoji;
      els.foodEmoji.textContent = emoji;
      els.foodHalo.style.opacity = emoji ? '1' : '0';
      els.foodTrail.style.opacity = emoji ? '0.75' : '0';
      els.foodEmoji.style.opacity = emoji ? '1' : '0';
    }

    /* belly grows with what has been eaten */
    if (els.bellyBulge) {
      const b = clamp(s.belly / 100, 0, 1);
      const rx = (50 + b * 16).toFixed(1);
      const ry = (34 + b * 14).toFixed(1);
      if (seen.belly !== rx) {
        seen.belly = rx;
        els.bellyBulge.setAttribute('rx', rx);
        els.bellyBulge.setAttribute('ry', ry);
        els.bellyBulge.setAttribute('opacity', (0.12 + b * 0.42).toFixed(2));
      }
    }

    /* fact card follows the stage, switching to the "chewed badly" warning */
    let factKey = s.stage.toLowerCase();
    if ((s.stage === 'SMALL' || s.stage === 'LARGE') && s.chewQuality > 0 && s.chewQuality < 0.5) {
      factKey = 'nochew';
    }
    if (lastFact !== factKey) {
      lastFact = factKey;
      els.factText.innerHTML = factKey === 'nochew'
        ? t('factNoChew')
        : ARG.i18n.fact(factKey);
    }
  }

  function place(el, x, y) {
    el.setAttribute('cx', x.toFixed(1));
    el.setAttribute('cy', y.toFixed(1));
    if (el.tagName === 'text') {
      el.setAttribute('x', x.toFixed(1));
      el.setAttribute('y', y.toFixed(1));
    }
  }

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* ─────────────────────────────────────────
     Speech + drop effects
     ───────────────────────────────────────── */
  let speechTimer = null;
  function say(text) {
    if (!text) return;
    els.speech.textContent = text;
    els.speech.classList.add('show');
    clearTimeout(speechTimer);
    speechTimer = setTimeout(() => els.speech.classList.remove('show'), 2600);
  }

  function dropPoo() {
    const s = M();
    ns(els.dropped, `<text x="189" y="352" text-anchor="middle" font-size="18" class="plop">💩</text>`);
    setTimeout(() => {
      const list = els.dropped.querySelectorAll('.plop');
      if (list.length) list[0].remove();
    }, 1400);
  }

  function refreshLabels() {
    /* force the next render to re-emit every translated string */
    lastStage = null;
    lastFact = null;
    seen.mood = null;
    seen.emoji = null;
    ARG.i18n.apply(document.getElementById('labels'));
  }

  return { build, render, bite, say, dropPoo, refreshLabels };
})();
