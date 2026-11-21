/* ═══════════════════════════════════════════
   camera/js/state.js — shutter, ISO, aperture

   This is a teaching model, not a light meter. It gets the three trades right:
     shutter  → motion blur (and camera shake)
     ISO      → brightness, at the cost of noise
     aperture → light and depth of field (background blur)
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  const SHUTTERS = [
    { v: 1000, label: '1/1000' },
    { v: 500,  label: '1/500' },
    { v: 250,  label: '1/250' },
    { v: 125,  label: '1/125' },
    { v: 60,   label: '1/60' },
    { v: 30,   label: '1/30' }
  ];
  const ISOS = [100, 200, 400, 800, 1600, 3200, 6400];
  const APERTURES = [
    { v: 1.8, label: 'f/1.8' },
    { v: 2.8, label: 'f/2.8' },
    { v: 4,   label: 'f/4' },
    { v: 5.6, label: 'f/5.6' },
    { v: 8,   label: 'f/8' },
    { v: 11,  label: 'f/11' },
    { v: 16,  label: 'f/16' }
  ];
  const SCENES = [
    { id: 'runner',    key: 'sceneRunner',    ev: 15, speed: 1.4 },
    { id: 'waterfall', key: 'sceneWaterfall', ev: 12, speed: 0.28 },
    { id: 'portrait',  key: 'scenePortrait',  ev: 12, speed: 0 }
  ];

  function fresh() {
    return {
      shutter: 3,          // 1/125
      iso: 0,              // 100
      aperture: 4,         // f/5.6
      scene: 0,            // runner
      focus: 'shutter',
      result: null,
      seen: [],
      done: false
    };
  }

  let S = fresh();

  function scene() { return SCENES[S.scene]; }
  function shutter() { return SHUTTERS[S.shutter]; }
  function iso() { return ISOS[S.iso]; }
  function aperture() { return APERTURES[S.aperture]; }

  function metrics() {
    const sc = scene();
    const t = 1 / shutter().v;
    const N = aperture().v;
    const isoV = iso();

    /* EV = log2(N² / t); at ISO 100 that is the scene EV. */
    const evSet = Math.log2((N * N) / t) - Math.log2(isoV / 100);
    /* positive stops = more light than the scene needs (overexposed) */
    const stops = sc.ev - evSet;
    const exposure = Math.abs(stops) <= 0.75 ? 'good' : (stops > 0 ? 'over' : 'under');

    const motion = sc.speed * (t * 1000) * 1.2;          // px of blur
    const bg = sc.id === 'portrait' ? 8 / N : 0;         // background blur
    const noise = Math.max(0, Math.log2(isoV / 100) * 1.2);

    let pass = exposure === 'good';
    if (sc.id === 'runner') pass = pass && motion < 4;
    if (sc.id === 'waterfall') pass = pass && motion >= 6 && motion <= 16;
    if (sc.id === 'portrait') pass = pass && bg >= 2.5;

    return { t, N, isoV, evSet, stops, exposure, motion, bg, noise, pass };
  }

  function shoot() {
    const m = metrics();
    const sc = scene();
    const stars = m.pass ? 3 : (m.exposure === 'good' ? 1 : 0);
    S.result = Object.assign({ scene: sc.id, stars: stars }, m);
    if (m.pass && S.seen.indexOf(sc.id) < 0) S.seen.push(sc.id);
    if (!S.done && SCENES.every(x => S.seen.indexOf(x.id) >= 0)) S.done = true;
    return { sound: m.pass ? 'chime' : 'notch', result: S.result };
  }

  const ACTIONS = {
    shutter(el) {
      const i = +(el && el.dataset ? el.dataset.i : -1);
      if (!(i >= 0 && i < SHUTTERS.length)) return { sound: 'deny' };
      S.shutter = i; S.focus = 'shutter'; S.result = null;
      return { sound: 'notch' };
    },
    iso(el) {
      const i = +(el && el.dataset ? el.dataset.i : -1);
      if (!(i >= 0 && i < ISOS.length)) return { sound: 'deny' };
      S.iso = i; S.focus = 'iso'; S.result = null;
      return { sound: 'notch' };
    },
    aperture(el) {
      const i = +(el && el.dataset ? el.dataset.i : -1);
      if (!(i >= 0 && i < APERTURES.length)) return { sound: 'deny' };
      S.aperture = i; S.focus = 'aperture'; S.result = null;
      return { sound: 'notch' };
    },
    scene(el) {
      const i = +(el && el.dataset ? el.dataset.i : -1);
      if (!(i >= 0 && i < SCENES.length)) return { sound: 'deny' };
      S.scene = i; S.result = null;
      return { sound: 'blip' };
    },
    shoot() {
      return shoot();
    },
    reset() {
      S = fresh();
      return { sound: 'chime' };
    }
  };

  function press(action, el) {
    const fn = ACTIONS[action];
    if (!fn) return null;
    return fn(el) || { sound: 'blip' };
  }

  return {
    get s() { return S; },
    press, fresh: () => { S = fresh(); return S; },
    metrics, scene, shutter, iso, aperture,
    SHUTTERS, ISOS, APERTURES, SCENES
  };
})();
