/* ═══════════════════════════════════════════
   toilet/js/state.js — the flush cycle + the treatment train
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* the six moments of a flush */
  const FLUSH = [
    { key: 'f0', fact: 'd0', lit: 'button' },
    { key: 'f1', fact: 'd1', lit: 'cistern' },
    { key: 'f2', fact: 'd2', lit: 'trap' },
    { key: 'f3', fact: 'd3', lit: 'trap' },
    { key: 'f4', fact: 'd4', lit: 'drain' },
    { key: 'f5', fact: 'd5', lit: 'seal' }
  ];

  /* the eight stages of an Indah Water treatment plant */
  const TREAT = [
    { key: 's0', fact: 'e0', lit: 'inlet' },
    { key: 's1', fact: 'e1', lit: 'screen' },
    { key: 's2', fact: 'e2', lit: 'grit' },
    { key: 's3', fact: 'e3', lit: 'primary' },
    { key: 's4', fact: 'e4', lit: 'aeration' },
    { key: 's5', fact: 'e5', lit: 'clarifier' },
    { key: 's6', fact: 'e6', lit: 'disinfect' },
    { key: 's7', fact: 'e7', lit: 'river' }
  ];

  function fresh() {
    return {
      mode: 'flush',        // flush | treat
      step: 0,

      /* ── flush ── */
      flushT: -1,           // seconds into a flush, -1 = idle
      flushing: false,
      cistern: 1,           // 1 full .. 0 empty
      bowl: 0.75,           // bowl water level (1 = at the rim)
      trap: 0.35,           // how full the S-bend is
      siphoning: false,
      airT: 0,

      /* ── treatment ── */
      flow: 0,              // 0..1 how far the water has travelled
      air: true,
      bubbles: []
    };
  }

  let S = fresh();
  let autoT = 0;

  /* ─────────── actions ─────────── */
  const ACTIONS = {
    flush() {
      if (S.flushing) return { sound: 'deny' };
      S.flushing = true;
      S.flushT = 0;
      S.step = 0;
      return { sound: 'flush' };
    },

    mode(el) {
      const m = el && el.dataset ? el.dataset.mode : null;
      if (m !== 'flush' && m !== 'treat') return { sound: 'deny' };
      if (S.mode === m) return { sound: 'blip' };
      S.mode = m;
      S.step = 0;
      return { sound: m === 'treat' ? 'air' : 'blip' };
    },

    stepUp() {
      const list = S.mode === 'flush' ? FLUSH : TREAT;
      if (S.step < list.length - 1) {
        S.step++;
        if (S.mode === 'flush') { S.flushing = true; S.flushT = 0; }
        return { sound: S.mode === 'treat' && S.step === 4 ? 'air' : 'blip', cheer: S.step === list.length - 1 };
      }
      return { sound: 'blip' };
    },

    stepDown() {
      if (S.step > 0) {
        S.step--;
        if (S.mode === 'flush') { S.flushing = true; S.flushT = 0; }
        return { sound: 'notch' };
      }
      return { sound: 'deny' };
    },

    restart() { S.step = 0; S.flushing = false; S.flushT = -1; return { sound: 'chime' }; },

    jump(el) {
      const n = el && el.dataset ? +el.dataset.step : 0;
      S.step = clamp(n, 0, (S.mode === 'flush' ? FLUSH : TREAT).length - 1);
      if (S.mode === 'flush') { S.flushing = true; S.flushT = 0; }
      return { sound: 'blip' };
    },

    air() {
      S.air = !S.air;
      return { sound: S.air ? 'air' : 'blip' };
    }
  };

  function press(action, el) {
    const fn = ACTIONS[action];
    if (!fn) return null;
    return fn(el) || { sound: 'blip' };
  }

  /* the timing of one flush, in seconds */
  const T_NEXT = 1.35;      // time per step while auto-playing

  function tick(dt) {
    dt = Math.min(dt, 0.08);

    /* ── flush ── */
    if (S.flushing) {
      S.flushT += dt;

      /* step 1..4 advance on their own so it feels like a flush */
      const auto = Math.floor(S.flushT / T_NEXT);
      if (auto > S.step && auto < FLUSH.length) S.step = auto;

      const t = S.flushT;
      S.cistern = clamp(1 - t / 2.6, 0, 1);
      if (t < 0.5) S.bowl = 0.75 + t * 0.4;
      else if (t < 2.2) S.bowl = clamp(0.95 + Math.sin((t - 0.5) * 4) * 0.04, 0, 1);
      else S.bowl = clamp(0.95 - (t - 2.2) * 0.5, 0.62, 1);
      S.trap = clamp(0.35 + t * 0.42, 0, 1);
      S.siphoning = t > 1.5 && t < 3.4;
      if (S.siphoning) S.trap = clamp(S.trap - dt * 0.25, 0.6, 1);

      if (t > 3.6) {
        /* refill */
        S.cistern = clamp(0.55 + (t - 3.6) * 0.35, 0, 1);
        S.bowl = clamp(0.62 + (t - 3.6) * 0.09, 0, 0.75);
        S.trap = clamp(0.62 + (t - 3.6) * 0.05, 0, 0.72);
      }
      if (t > 6.2) {
        S.flushing = false;
        S.flushT = -1;
        S.cistern = 1; S.bowl = 0.75; S.trap = 0.68;
        S.siphoning = false;
        S.step = FLUSH.length - 1;
      }
    } else {
      S.cistern = clamp(S.cistern + dt * 0.25, 0, 1);
    }

    /* ── treatment: the water creeps along the train ── */
    const target = (S.step + 0.5) / TREAT.length;
    S.flow += (target - S.flow) * 2.2 * dt;

    /* auto-advance while you watch */
    autoT += dt;
    if (autoT > 3.6) {
      autoT = 0;
      if (!S.flushing) {
        if (S.mode === 'treat' && S.step < TREAT.length - 1) S.step++;
      }
    }

    return S;
  }

  return {
    get s() { return S; },
    press, tick,
    fresh: () => { S = fresh(); autoT = 0; return S; },
    FLUSH, TREAT, clamp
  };
})();
