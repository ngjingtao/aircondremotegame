/* ═══════════════════════════════════════════
   hood/js/state.js — fan, airflow and capture
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* what the fan can actually shift, in cubic metres per hour */
  const FAN_AIR = [0, 380, 600, 830];
  const FAN_DB = [0, 47, 55, 63];

  function fresh() {
    return {
      fan: 2,                 // 0..3
      light: true,
      mode: 'duct',           // duct | recirc
      dirty: false,
      boiling: true,          // something is cooking

      /* derived */
      air: 0,
      capture: 0,
      escape: 0,
      noise: 0,
      spin: 0,
      damper: 0,              // 0 shut .. 1 open
      cooking: 0
    };
  }

  let S = fresh();

  /* ─────────── actions ─────────── */
  const ACTIONS = {
    fan(el) {
      const n = el && el.dataset ? +el.dataset.fan : null;
      if (n === null || isNaN(n)) {
        S.fan = (S.fan + 1) % 4;
      } else {
        S.fan = clamp(n, 0, 3);
      }
      return { sound: S.fan === 0 ? 'powerOff' : 'powerOn' };
    },
    light() { S.light = !S.light; return { sound: 'blip' }; },
    mode(el) {
      const m = el && el.dataset ? el.dataset.mode : null;
      if (m !== 'duct' && m !== 'recirc') return { sound: 'deny' };
      S.mode = m;
      return { sound: 'air' };
    },
    filter() { S.dirty = !S.dirty; return { sound: S.dirty ? 'warn' : 'clean' }; },
    cooking() { S.boiling = !S.boiling; return { sound: S.boiling ? 'blip' : 'powerOff' }; }
  };

  function press(action, el) {
    const fn = ACTIONS[action];
    if (!fn) return null;
    return fn(el) || { sound: 'blip' };
  }

  function tick(dt) {
    dt = Math.min(dt, 0.08);

    /* the blower takes a moment to spin up */
    const target = S.fan / 3;
    S.spin += (target - S.spin) * 2.4 * dt;

    /* a dirty filter chokes the airflow, and a duct that bends chokes it a bit more */
    const dirtyF = S.dirty ? 0.55 : 1;
    const modeF = S.mode === 'recirc' ? 0.88 : 1;
    const airTarget = FAN_AIR[S.fan] * dirtyF * modeF;
    S.air += (airTarget - S.air) * 2.0 * dt;

    /* how much of the smoke the hood can catch */
    const catching = clamp(S.air / 620, 0, 1);
    S.capture += (catching - S.capture) * 2.0 * dt;
    S.capture = clamp(S.capture, 0, 1);
    S.escape = clamp(1 - S.capture, 0, 1);

    /* noise: more speed, and a choked filter is louder */
    const noiseTarget = S.fan === 0 ? 0 : FAN_DB[S.fan] + (S.dirty ? 4 : 0);
    S.noise += (noiseTarget - S.noise) * 2.2 * dt;

    /* the damper is pushed open by the moving air */
    const damperTarget = S.mode === 'rectic' ? 0 : clamp(S.air / 300, 0, 1);
    S.damper += (damperTarget - S.damper) * 2.6 * dt;

    /* a pot that is cooking makes its own smoke */
    S.cooking += ((S.boiling ? 1 : 0) - S.cooking) * 1.5 * dt;

    return S;
  }

  return {
    get s() { return S; },
    press, tick,
    fresh: () => { S = fresh(); return S; },
    FAN_AIR, FAN_DB, clamp
  };
})();
