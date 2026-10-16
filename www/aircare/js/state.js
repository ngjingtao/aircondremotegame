/* ═══════════════════════════════════════════
   aircare/js/state.js — the refrigeration cycle + the wash steps
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ── the wash procedure ── */
  const STEPS = [
    { key: 'w0', fact: 'f0', scene: 'indoor', lit: 'plug' },
    { key: 'w1', fact: 'f1', scene: 'indoor', lit: 'panel' },
    { key: 'w2', fact: 'f2', scene: 'indoor', lit: 'filters' },
    { key: 'w3', fact: 'f3', scene: 'indoor', lit: 'filters' },
    { key: 'w4', fact: 'f4', scene: 'indoor', lit: 'coil' },
    { key: 'w5', fact: 'f5', scene: 'indoor', lit: 'drain' },
    { key: 'w6', fact: 'f6', scene: 'outdoor', lit: 'outcoil' },
    { key: 'w7', fact: 'f7', scene: 'outdoor', lit: 'all' }
  ];

  function fresh() {
    return {
      mode: 'how',            // how | wash
      step: 0,

      /* how-it-works */
      power: true,
      setTemp: 24,
      roomTemp: 30,
      running: true,          // compressor on
      speed: 1,               // refrigerant speed multiplier
      stage: 0,               // which part is highlighted 0..3
      stageT: 0,

      /* derived each tick */
      evapTemp: 5,
      condTemp: 45,
      heatMoved: 0
    };
  }

  let S = fresh();
  let seen = {};

  /* ─────────── actions ─────────── */
  const ACTIONS = {
    mode(el) {
      const m = el && el.dataset ? el.dataset.mode : null;
      if (m !== 'how' && m !== 'wash') return { sound: 'deny' };
      if (S.mode === m) return { sound: 'blip' };
      S.mode = m;
      if (m === 'wash') S.step = 0;
      return { sound: m === 'wash' ? 'squirt' : 'blip' };
    },

    power() {
      S.power = !S.power;
      S.running = S.power;
      return { sound: S.power ? 'powerOn' : 'powerOff' };
    },

    tempUp() {
      S.setTemp = clamp(S.setTemp + 1, 16, 30);
      return { sound: 'beep' };
    },

    tempDown() {
      S.setTemp = clamp(S.setTemp - 1, 16, 30);
      return { sound: 'beep' };
    },

    stepUp() {
      if (S.step < STEPS.length - 1) {
        S.step++;
        return { sound: S.step === 3 || S.step === 4 ? 'squirt' : 'blip', cheer: S.step === STEPS.length - 1 };
      }
      return { sound: 'blip' };
    },

    stepDown() {
      if (S.step > 0) { S.step--; return { sound: 'notch' }; }
      return { sound: 'deny' };
    },

    restart() {
      S.step = 0;
      return { sound: 'chime' };
    }
  };

  function press(action, el) {
    const fn = ACTIONS[action];
    if (!fn) return null;
    const res = fn(el) || { sound: 'blip' };
    return res;
  }

  /* ─────────── tick ─────────── */
  function tick(dt) {
    dt = Math.min(dt, 0.08);

    /* the compressor eases on and off */
    const target = S.power ? 1 : 0;
    S.speed += (target - S.speed) * 1.6 * dt;
    S.running = S.speed > 0.06;

    /* how cold the evaporator gets, and how hot the condenser gets */
    const evapTarget = S.power ? clamp(2 + (S.setTemp - 16) * 0.45, 2, 12) : S.roomTemp;
    const condTarget = S.power ? 42 + (34 - S.setTemp) * 1.1 : S.roomTemp;
    S.evapTemp += (evapTarget - S.evapTemp) * 0.9 * dt;
    S.condTemp += (condTarget - S.condTemp) * 0.7 * dt;

    /* the room only cools while it is running */
    if (S.power) {
      const pull = 0.06 * (S.roomTemp - S.setTemp);
      S.roomTemp -= Math.max(0, pull) * dt;
      S.roomTemp += (32 - S.roomTemp) * 0.004 * dt;      // leak from outside
      S.heatMoved += Math.abs(pull) * dt;
    } else {
      S.roomTemp += (32 - S.roomTemp) * 0.012 * dt;
    }
    S.roomTemp = clamp(S.roomTemp, 16, 34);

    /* walk the highlight round the four parts */
    if (S.running) {
      S.stageT += dt;
      if (S.stageT > 1.5) { S.stageT = 0; S.stage = (S.stage + 1) % 4; }
    }
    return S;
  }

  return {
    get s() { return S; },
    press, tick,
    fresh: () => { S = fresh(); return S; },
    STEPS, clamp
  };
})();
