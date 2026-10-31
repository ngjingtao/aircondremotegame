/* ═══════════════════════════════════════════
   cycle/js/state.js — follow one drop around the water cycle
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  const STEPS = [
    { key: 'c1', fact: 'cf1', part: 'sea' },
    { key: 'c2', fact: 'cf2', part: 'plant' },
    { key: 'c3', fact: 'cf3', part: 'cloud' },
    { key: 'c4', fact: 'cf4', part: 'rain' },
    { key: 'c5', fact: 'cf5', part: 'runoff' },
    { key: 'c6', fact: 'cf6', part: 'river' },
    { key: 'c7', fact: 'cf7', part: 'lake' },
    { key: 'c8', fact: 'cf8', part: 'sea' }
  ];

  const WATCH_SECONDS = 4;

  function fresh() {
    return {
      step: 0,
      stepT: 0,
      auto: false,
      seenAll: false
    };
  }

  let S = fresh();

  const atEnd = () => S.seenAll;

  function go(n) {
    S.step = ((n % STEPS.length) + STEPS.length) % STEPS.length;
    S.stepT = 0;
    if (S.step === STEPS.length - 1) S.seenAll = true;
  }

  const ACTIONS = {
    next() { go(S.step + 1); return { sound: 'blip' }; },
    prev() { go(S.step - 1); return { sound: 'notch' }; },
    jump(el) {
      const n = el && el.dataset ? +el.dataset.step : -1;
      if (!(n >= 0 && n < STEPS.length)) return { sound: 'deny' };
      go(n);
      return { sound: 'blip' };
    },
    watch() {
      S.auto = !S.auto;
      S.stepT = 0;
      return { sound: S.auto ? 'powerOn' : 'powerOff' };
    },
    restart() {
      S = fresh();
      return { sound: 'chime' };
    }
  };

  function press(action, el) {
    const fn = ACTIONS[action];
    if (!fn) return null;
    return fn(el) || { sound: 'blip' };
  }

  function tick(dt) {
    dt = Math.min(dt, 0.08);
    if (!S.auto) return S;
    S.stepT += dt;
    if (S.stepT >= WATCH_SECONDS) {
      S.stepT = 0;
      go(S.step + 1);
    }
    return S;
  }

  return {
    get s() { return S; },
    press, tick,
    fresh: () => { S = fresh(); return S; },
    STEPS, WATCH_SECONDS,
    atEnd
  };
})();
