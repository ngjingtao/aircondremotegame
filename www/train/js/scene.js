/* ═══════════════════════════════════════════
   train/js/scene.js — track, scenery, train, crossing
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.scene = (function () {

  const T = () => ARG.i18n.t;
  const M = () => ARG.sim.s;

  const NOSE_FRAC = 0.30;        // where the front of the train sits on screen
  const TRAIN_FRAC = 0.62;       // the train takes this share of the scene width
  const SCENERY_SPACING = 18;    // metres between scenery items
  const POLE_SPACING = 46;       // metres between catenary masts

  let els = {};
  let sceneW = 0, sceneH = 0;
  let ppm = 4;                   // pixels per metre
  let frame = 0;
  let wheels = [];
  let lastDing = -1;

  const sceneryPool = new Map();
  const polePool = new Map();
  const bigPool = new Map();

  /* deterministic pseudo-random so scenery never flickers */
  function rnd(i, salt) {
    let h = (i * 374761393 + (salt || 0) * 668265263) | 0;
    h = (h ^ (h >> 13)) * 1274126177 | 0;
    return ((h ^ (h >> 16)) >>> 0) / 4294967296;
  }

  /* ─────────── train markup ─────────── */
  function wheelRow() {
    return '<div class="bogie">' +
      '<span class="wh"><i></i></span><span class="wh"><i></i></span>' +
      '</div>';
  }

  function locoHTML() {
    return '' +
      '<div class="panto"><span class="pa-arm"></span><span class="pa-bar"></span></div>' +
      '<div class="v-body loco-body">' +
        '<div class="roof"></div>' +
        '<div class="cab-win"><i></i><i></i></div>' +
        '<div class="side-win"></div>' +
        '<div class="livery"></div>' +
        '<div class="skirt"></div>' +
        '<div class="nose-lamp"></div>' +
        '<div class="mark">E 101</div>' +
      '</div>' +
      wheelRow() + wheelRow();
  }

  function coachHTML() {
    return '' +
      '<div class="v-body coach-body">' +
        '<div class="roof"></div>' +
        '<div class="windows"></div>' +
        '<div class="livery"></div>' +
        '<div class="doors"></div>' +
      '</div>' +
      wheelRow() + wheelRow();
  }

  function buildTrain() {
    const train = els.train;
    let html = '';
    for (let i = 0; i < ARG.sim.COACHES; i++) {
      html += '<div class="veh coach" style="width:calc(var(--ppm) * ' + ARG.sim.COACH_LEN + 'px)">' + coachHTML() + '</div>';
    }
    html += '<div class="veh loco" style="width:calc(var(--ppm) * ' + ARG.sim.LOCO_LEN + 'px)">' + locoHTML() + '</div>';
    train.innerHTML = html;
    wheels = Array.prototype.slice.call(train.querySelectorAll('.wh'));
    /* the leading coach of the train is the loco, drawn last so it is on the right */
  }

  /* ─────────── object templates ─────────── */
  function sceneryHTML(type) {
    switch (type) {
      case 'tree': return '<div class="o-tree"><i class="trunk"></i><b class="leaf l1"></b><b class="leaf l2"></b><b class="leaf l3"></b></div>';
      case 'bush': return '<div class="o-bush"><b></b><b></b><b></b></div>';
      case 'house': return '<div class="o-house"><i class="roof"></i><b class="wall"></b><span class="door"></span><span class="win"></span></div>';
      case 'fence': return '<div class="o-fence"><i></i><i></i><i></i><i></i><b></b><b></b></div>';
      case 'hay': return '<div class="o-hay"><i></i></div>';
      default: return '<div class="o-tree"><i class="trunk"></i><b class="leaf l1"></b><b class="leaf l2"></b></div>';
    }
  }

  function poleHTML() {
    return '<div class="o-pole"><i class="post"></i><i class="arm"></i><i class="drop"></i></div>';
  }

  function signalHTML() {
    return '<div class="o-signal"><i class="post"></i><b class="head"><span class="lamp g"></span><span class="lamp r"></span></b><i class="ladder"></i></div>';
  }

  function stationHTML(n) {
    return '<div class="o-station">' +
      '<div class="plat"></div>' +
      '<div class="shelter"><i class="s-roof"></i><b class="s-wall"></b><span class="s-bench"></span></div>' +
      '<div class="sign"><b data-station="' + n + '">Station</b></div>' +
      '<div class="mark"></div>' +
      '<div class="lamp-post"><i></i></div>' +
      '<div class="clock"><b>--:--</b></div>' +
      '</div>';
  }

  function crossingHTML() {
    return '<div class="o-crossing">' +
      '<div class="mast">' +
        '<i class="pole"></i>' +
        '<div class="xbuck"><i class="bar a"></i><i class="bar b"></i></div>' +
        '<div class="lights"><span class="rl l"></span><span class="rl r"></span></div>' +
        '<div class="bell-box"><i></i></div>' +
      '</div>' +
      '<div class="gate"><i class="arm"></i></div>' +
      '<div class="car"><i class="c-body"></i><b class="c-top"></b><span class="c-w1"></span><span class="c-w2"></span><span class="c-lamp"></span></div>' +
      '</div>';
  }

  /* ─────────── pool helpers ─────────── */
  function get(pool, key, cls, html) {
    let el = pool.get(key);
    if (!el) {
      el = document.createElement('div');
      el.className = cls;
      el.innerHTML = html;
      els.objs.appendChild(el);
      pool.set(key, el);
    }
    el._t = frame;
    return el;
  }

  function sweep(pool) {
    pool.forEach((el, key) => {
      if (el._t !== frame) { el.remove(); pool.delete(key); }
    });
  }

  function place(el, worldX) {
    const sx = (worldX - M().x) * ppm + sceneW * NOSE_FRAC;
    el.style.transform = 'translateX(' + sx.toFixed(1) + 'px) translateX(-50%)';
  }

  /* ─────────── build ─────────── */
  function build() {
    els.scene = document.getElementById('scene');
    els.train = document.getElementById('train');
    els.objs = document.getElementById('objs');
    els.track = document.getElementById('track');
    els.sleepers = document.getElementById('sleepers');
    els.foreground = document.getElementById('foreground');
    els.clouds = document.getElementById('clouds');
    els.clouds2 = document.getElementById('clouds2');
    els.hills = document.getElementById('hills');
    els.mid = document.getElementById('mid');
    els.headlight = document.getElementById('headlight');
    els.hudKmh = document.getElementById('hud-kmh');
    els.hudNext = document.getElementById('hud-next');
    els.hudNextName = document.getElementById('hud-next-name');
    els.hudNextDist = document.getElementById('hud-next-dist');
    els.stFill = document.getElementById('st-fill');
    els.stTrain = document.getElementById('st-train');
    els.flag = document.getElementById('crossing-flag');
    els.toast = document.getElementById('toast');

    buildTrain();
    layoutPixels();
  }

  function layoutPixels() {
    if (!els.scene) return;
    const r = els.scene.getBoundingClientRect();
    sceneW = r.width;
    sceneH = r.height;
    ppm = Math.max(1.2, sceneW * TRAIN_FRAC / ARG.sim.TRAIN_LEN);
    els.scene.style.setProperty('--ppm', ppm.toFixed(3));
    els.scene.style.setProperty('--nose-right', ((1 - NOSE_FRAC) * 100).toFixed(2) + '%');
  }

  /* ─────────── render ─────────── */
  const seen = {};
  let toastTimer = null;

  function toast(key, good) {
    if (!key) return;
    els.toast.textContent = T()(key);
    els.toast.classList.toggle('good', good !== false);
    els.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove('show'), 2400);
  }

  function render(dt) {
    const S = M();
    frame++;

    /* ── scale (cheap guard: only when the scene resizes) ── */
    const w = els.scene.clientWidth;
    if (Math.abs(w - sceneW) > 0.5) { buildTrain(); layoutPixels(); }

    /* ── parallax: shift wide tiled layers by the remainder of their period ── */
    const camM = S.x;
    els.clouds.style.transform = 'translateX(' + (-(camM * ppm * 0.06) % 300).toFixed(1) + 'px)';
    els.clouds2.style.transform = 'translateX(' + (-(camM * ppm * 0.17) % 340).toFixed(1) + 'px)';
    els.hills.style.transform = 'translateX(' + (-(camM * ppm * 0.32) % 300).toFixed(1) + 'px)';
    els.mid.style.transform = 'translateX(' + (-(camM * ppm * 0.58) % 46).toFixed(1) + 'px)';
    els.sleepers.style.transform = 'translateX(' + (-(camM * ppm) % 30).toFixed(1) + 'px)';
    els.foreground.style.transform = 'translateX(' + (-(camM * ppm * 1.7) % 36).toFixed(1) + 'px)';

    /* ── visible world window ── */
    const nosePx = sceneW * NOSE_FRAC;
    const mLeft = camM - nosePx / ppm;
    const mRight = camM + (sceneW - nosePx) / ppm;

    /* ── scenery ── */
    const i0 = Math.floor(mLeft / SCENERY_SPACING) - 1;
    const i1 = Math.ceil(mRight / SCENERY_SPACING) + 1;
    for (let i = i0; i <= i1; i++) {
      const r = rnd(i, 7);
      let type;
      if (r < 0.40) type = 'tree';
      else if (r < 0.58) type = 'bush';
      else if (r < 0.72) type = 'house';
      else if (r < 0.86) type = 'fence';
      else type = 'hay';
      const x = i * SCENERY_SPACING + rnd(i, 3) * 12;
      const el = get(sceneryPool, 's' + i, 'obj scenery ' + type, sceneryHTML(type));
      const far = rnd(i, 11) < 0.5;
      el.classList.toggle('far', far);
      el.style.transform = 'translateX(' + (((x - camM) * ppm + nosePx).toFixed(1)) + 'px) translateX(-50%)';
    }
    sweep(sceneryPool);

    /* ── catenary masts ── */
    const p0 = Math.floor(mLeft / POLE_SPACING) - 1;
    const p1 = Math.ceil(mRight / POLE_SPACING) + 1;
    for (let p = p0; p <= p1; p++) {
      const el = get(polePool, 'p' + p, 'obj pole', poleHTML());
      place(el, p * POLE_SPACING + 6);
    }
    sweep(polePool);

    /* ── stations & crossings ── */
    const seenBig = {};
    const base = Math.floor(camM / ARG.sim.CYCLE);
    for (let n = base - 1; n <= base + 2; n++) {
      /* station */
      const sx = ARG.sim.stationX(n);
      if (sx > mLeft - 140 && sx < mRight + 140) {
        const key = 'st' + n;
        seenBig[key] = 1;
        const el = get(bigPool, key, 'obj station' + (S.servedStations[key] ? ' done' : ''), stationHTML(n));
        const nameEl = el.querySelector('[data-station]');
        const nm = ARG.i18n.station(n);
        if (nameEl.textContent !== nm) nameEl.textContent = nm;
        place(el, sx + ARG.sim.PLATFORM_LEN / 2);
      }
      /* crossing */
      const cx = ARG.sim.crossingX(n);
      if (cx > mLeft - 170 && cx < mRight + 170) {
        const key = 'cx' + n;
        seenBig[key] = 1;
        const gk = 'c' + n;
        const gate = S.gates[gk] || 0;
        const active = S.activeCrossings.indexOf(n) >= 0;
        const el = get(bigPool, key, 'obj crossing' + (active ? ' active' : ''), crossingHTML());
        place(el, cx);
        const arm = el.querySelector('.gate');
        if (arm) arm.style.transform = 'rotate(' + (-84 * (1 - gate)).toFixed(1) + 'deg)';
        el.classList.toggle('flash-a', active && S.flashPhase === 0);
        el.classList.toggle('flash-b', active && S.flashPhase === 1);
      }
      /* signal a little before each station */
      const gx = ARG.sim.stationX(n) - 120;
      if (gx > mLeft - 60 && gx < mRight + 60) {
        const key = 'sg' + n;
        seenBig[key] = 1;
        const el = get(bigPool, key, 'obj signal' + (S.distToStation > 0 && S.distToStation < 140 ? ' caution' : ''), signalHTML());
        place(el, gx);
      }
    }
    bigPool.forEach((el, key) => {
      if (!seenBig[key]) { el.remove(); bigPool.delete(key); }
    });

    /* ── wheels ── */
    const circumference = Math.PI * 1.1;
    const deg = (-S.x / circumference * 360) % 360;
    const rot = 'rotate(' + deg.toFixed(1) + 'deg)';
    for (let i = 0; i < wheels.length; i++) {
      if (wheels[i]._r !== rot) { wheels[i]._r = rot; wheels[i].style.transform = rot; }
    }

    /* ── headlight ── */
    els.headlight.className = 'headlight lit' + S.lights;

    /* ── HUD ── */
    const kmh = Math.round(S.kmh);
    if (seen.kmh !== kmh) { seen.kmh = kmh; els.hudKmh.textContent = kmh; }
    els.hudKmh.classList.toggle('fast', kmh > 90);

    const dist = Math.round(S.distToStation);
    const atP = S.atPlatform;
    const title = atP ? T()('atStation') : (dist > 0 ? T()('nextStop') : T()('noStop'));
    if (seen.nextT !== title + S.nextIdx) { seen.nextT = title + S.nextIdx; }
    els.hudNextName.textContent = atP ? T()('atStation') : ARG.i18n.station(S.nextIdx);
    els.hudNextDist.textContent = atP ? (Math.round(S.distToMark) + ' ' + T()('metres')) : (dist + ' ' + T()('metres'));
    els.hudNext.classList.toggle('near', !atP && dist >= 0 && dist < 250);
    els.hudNext.classList.toggle('at', atP);

    /* the little progress track between the last station and the next */
    const prevX = ARG.sim.stationX(S.nextIdx - 1);
    const nextX = ARG.sim.stationX(S.nextIdx);
    const span = Math.max(1, nextX - prevX);
    const prog = clamp((S.x - prevX) / span, 0, 1);
    if (els.stFill) {
      els.stFill.style.width = (prog * 100).toFixed(1) + '%';
      els.stTrain.style.left = (prog * 100).toFixed(1) + '%';
    }

    /* ── crossing flag ── */
    els.flag.classList.toggle('on', S.activeCrossings.length > 0);
    els.flag.classList.toggle('a', S.flashPhase === 0);
    els.flag.classList.toggle('b', S.flashPhase === 1);
    els.flag.classList.toggle('ding', S.dingNow);

    /* ── message toast ── */
    if (S.msgT > 0) {
      if (seen.msg !== S.msg) { seen.msg = S.msg; toast(S.msg, S.msgGood); }
    } else if (seen.msg) {
      seen.msg = '';
    }
  }

  return { build, render, layoutPixels, toast, get ppm() { return ppm; } };
})();
