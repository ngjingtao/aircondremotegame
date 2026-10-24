/* ═══════════════════════════════════════════
   tree/js/state.js — seed to tree, one stage at a time

   The tree only grows when the soil moisture is in the current
   stage's band and the light matches what that stage needs. Wrong
   conditions stall growth and drain health; too long and it wilts.
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ── the eight phases of a tree's life ── */
  const STAGES = [
    { key: 's0', fact: 'f0', need: 'n0', icon: '🌰', water: [0.45, 0.85], sun: 0 },
    { key: 's1', fact: 'f1', need: 'n1', icon: '🌱', water: [0.55, 0.90], sun: 0 },
    { key: 's2', fact: 'f2', need: 'n2', icon: '🌿', water: [0.40, 0.75], sun: 1 },
    { key: 's3', fact: 'f3', need: 'n3', icon: '🌳', water: [0.35, 0.70], sun: 2 },
    { key: 's4', fact: 'f4', need: 'n4', icon: '🌳', water: [0.30, 0.65], sun: 2 },
    { key: 's5', fact: 'f5', need: 'n5', icon: '🌸', water: [0.35, 0.70], sun: 2 },
    { key: 's6', fact: 'f6', need: 'n6', icon: '🍎', water: [0.30, 0.65], sun: 2 },
    { key: 's7', fact: 'f7', need: 'n7', icon: '🌰', water: [0.20, 0.55], sun: 2 }
  ];

  const SUNS = [
    { id: 0, key: 'sunShade', ico: '🌥️' },
    { id: 1, key: 'sunPart', ico: '⛅' },
    { id: 2, key: 'sunFull', ico: '☀️' }
  ];

  const WATER_TAP = 0.12;
  const GROW_RATE = 0.11;      // about 9 seconds of good conditions per phase
  const EVAP = [0.006, 0.014, 0.024];   // shade / part / full sun

  function fresh() {
    return {
      phase: 'idle',        // idle | growing | paused | done | wilted
      stage: 0,
      growth: 0,
      health: 1,
      minHealth: 1,
      water: 0.60,
      sun: 0,
      waterUsed: 0,
      day: 0,
      waterPulse: 0,
      wiltCause: '',
      stars: 0,
      reason: ''
    };
  }

  let S = fresh();

  const running = () => S.phase === 'growing' || S.phase === 'paused';
  const stage = () => STAGES[S.stage] || STAGES[0];

  /* ─────────── actions ─────────── */
  const ACTIONS = {
    start() {
      if (S.phase === 'growing') { S.phase = 'paused'; return { sound: 'blip' }; }
      if (S.phase === 'paused') { S.phase = 'growing'; return { sound: 'blip' }; }
      S = fresh();
      S.phase = 'growing';
      return { sound: 'powerOn' };
    },

    again() {
      S = fresh();
      S.phase = 'growing';
      return { sound: 'chime' };
    },

    water() {
      if (!running()) return { sound: 'deny' };
      S.water = clamp(S.water + WATER_TAP, 0, 1);
      S.waterUsed++;
      S.waterPulse = 1;
      return { sound: 'squirt' };
    },

    set(el) {
      const key = el && el.dataset ? el.dataset.key : null;
      const value = el && el.dataset ? el.dataset.value : null;
      if (key !== 'sun') return { sound: 'deny' };
      const n = +value;
      if (!SUNS.some(s => s.id === n)) return { sound: 'deny' };
      if (!running()) return { sound: 'deny' };
      S.sun = n;
      return { sound: 'beep' };
    }
  };

  function press(action, el) {
    const fn = ACTIONS[action];
    if (!fn) return null;
    return fn(el) || { sound: 'blip' };
  }

  /* ─────────── getting it right ─────────── */
  function inside(st, water) {
    return water >= st.water[0] && water <= st.water[1];
  }

  function adviceKey() {
    if (S.phase === 'done') return 'adviceDone';
    if (S.phase === 'wilted') return 'adviceWilted';
    if (S.phase === 'idle') return 'adviceIdle';
    if (S.phase === 'paused') return 'advicePaused';

    const st = stage();
    if (S.water < st.water[0]) return 'adviceDry';
    if (S.water > st.water[1]) return 'adviceWet';
    if (S.sun !== st.sun) return 'adviceSun';
    return 'adviceOk';
  }

  function finish() {
    S.phase = 'done';
    S.growth = 1;
    let stars = 1;
    if (S.minHealth >= 0.75) stars = 2;
    if (S.minHealth >= 0.95) stars = 3;
    S.stars = stars;

    if (stars === 3) S.reason = 'treePerfect';
    else if (stars === 2) S.reason = 'treeCareful';
    else S.reason = 'treeTired';
  }

  function wilt(problem) {
    S.phase = 'wilted';
    S.health = 0;
    S.minHealth = 0;
    S.stars = 0;
    S.wiltCause = problem;
    S.reason = problem === 'dry' ? 'treeThirsty'
      : problem === 'wet' ? 'treeDrowned'
      : 'treeSunburn';
  }

  /* ─────────── tick ─────────── */
  function tick(dt) {
    dt = Math.min(dt, 0.08);
    S.waterPulse = Math.max(0, S.waterPulse - 2.6 * dt);

    if (S.phase !== 'growing') return S;

    S.day += dt;
    const st = stage();

    /* the sun dries the soil */
    S.water = clamp(S.water - EVAP[S.sun] * dt, 0, 1);

    const wet = inside(st, S.water);
    const lit = S.sun === st.sun;

    if (wet && lit) {
      S.growth += GROW_RATE * dt;
      S.health = clamp(S.health + 0.012 * dt, 0, 1);

      if (S.growth >= 1) {
        if (S.stage >= STAGES.length - 1) {
          finish();
        } else {
          S.stage++;
          S.growth = 0;
        }
      }
    } else {
      let dist = 0, problem = 'sun';
      if (S.water < st.water[0]) { dist = st.water[0] - S.water; problem = 'dry'; }
      else if (S.water > st.water[1]) { dist = S.water - st.water[1]; problem = 'wet'; }

      S.health -= (0.022 + dist * 0.55 + (lit ? 0 : 0.035)) * dt;
      S.minHealth = Math.min(S.minHealth, S.health);
      if (S.health <= 0) wilt(problem);
    }

    return S;
  }

  return {
    get s() { return S; },
    press, tick,
    fresh: () => { S = fresh(); return S; },
    isRunning: running,
    stage,
    adviceKey,
    STAGES, SUNS,
    WATER_TAP,
    EVAP, GROW_RATE,
    clamp
  };
})();
