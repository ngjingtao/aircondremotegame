/* ═══════════════════════════════════════════
   engine/js/state.js — one cylinder, four strokes

   The crank angle runs 0…720°: two revolutions, four strokes.
   Intake 0–180, compression 180–360, power 360–540, exhaust 540–720.
   The animation is deliberately slow; the HUD shows the real rpm.
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  const STROKES = [
    { key: 'e1', fact: 'ef1', ico: '⬇️' },
    { key: 'e2', fact: 'ef2', ico: '🗜️' },
    { key: 'e3', fact: 'ef3', ico: '💥' },
    { key: 'e4', fact: 'ef4', ico: '💨' }
  ];

  const THROTTLES = [
    { id: 'idle', key: 'tIdle', rpm: 800, seconds: 4.0 },
    { id: 'cruise', key: 'tCruise', rpm: 2500, seconds: 2.2 },
    { id: 'rev', key: 'tRev', rpm: 5000, seconds: 1.1 }
  ];

  function fresh() {
    return {
      mode: 'run',          // run | step
      running: false,
      throttle: 'idle',
      angle: 0,
      step: 0,
      rpm: 0,
      seen: [false, false, false, false],
      done: false,
      stars: 0,
      reason: ''
    };
  }

  let S = fresh();

  const throttle = () => THROTTLES.filter(t => t.id === S.throttle)[0] || THROTTLES[0];
  const strokeFromAngle = a => Math.floor((a % 720) / 180) % 4;
  const current = () => S.mode === 'step' ? S.step : strokeFromAngle(S.angle);

  function markSeen() {
    S.seen[current()] = true;
    if (!S.done && S.seen.every(Boolean)) {
      S.done = true;
      S.stars = 1;
      S.reason = 'engineDone';
    }
  }

  function setAngleForStep() {
    S.angle = S.step * 180 + 90;
    markSeen();
  }

  const ACTIONS = {
    mode(el) {
      const m = el && el.dataset ? el.dataset.mode : null;
      if (m !== 'run' && m !== 'step') return { sound: 'deny' };
      if (m === S.mode) return { sound: 'blip' };
      const was = current();
      S.mode = m;
      S.running = false;
      if (m === 'step') {
        S.step = was;
        setAngleForStep();
      } else {
        S.angle = S.step * 180 + 90;
      }
      return { sound: 'blip' };
    },

    start() {
      if (S.mode !== 'run') return { sound: 'deny' };
      S.running = !S.running;
      if (S.running) markSeen();
      return { sound: S.running ? 'powerOn' : 'powerOff' };
    },

    throttle(el) {
      const id = el && el.dataset ? el.dataset.throttle : null;
      if (!THROTTLES.some(t => t.id === id)) return { sound: 'deny' };
      S.throttle = id;
      return { sound: 'beep' };
    },

    next() {
      if (S.mode !== 'step') return { sound: 'deny' };
      S.step = (S.step + 1) % 4;
      setAngleForStep();
      return { sound: 'blip' };
    },

    prev() {
      if (S.mode !== 'step') return { sound: 'deny' };
      S.step = (S.step + 3) % 4;
      setAngleForStep();
      return { sound: 'notch' };
    },

    jump(el) {
      const n = el && el.dataset ? +el.dataset.stroke : -1;
      if (!(n >= 0 && n < 4)) return { sound: 'deny' };
      S.mode = 'step';
      S.running = false;
      S.step = n;
      setAngleForStep();
      return { sound: 'blip' };
    },

    again() {
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
    if (S.mode !== 'run') { S.rpm = 0; return S; }
    if (!S.running) { S.rpm = 0; return S; }

    const t = throttle();
    S.rpm = t.rpm;
    S.angle = (S.angle + (720 / t.seconds) * dt) % 720;
    markSeen();
    return S;
  }

  return {
    get s() { return S; },
    press, tick,
    fresh: () => { S = fresh(); return S; },
    current, throttle,
    strokeFromAngle,
    STROKES, THROTTLES,
    rating: () => S.done ? { stars: 1, reason: 'engineDone' } : { stars: 0, reason: '' }
  };
})();
