/* ═══════════════════════════════════════════
   motor/js/state.js — a small DC motor model

   Speed, current and coil temperature. The point is not a perfect motor
   model; it is to show three real effects:
     • more load  → more current, less speed, more heat
     • a held shaft (stall) → no back EMF → current spike → burn
     • turning a disconnected motor → it generates
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  const VOLTS = [3, 6, 9, 12];
  const LOADS = [
    { id: 0,   key: 'loadFan' },
    { id: 40,  key: 'loadLight' },
    { id: 75,  key: 'loadHeavy' },
    { id: 100, key: 'loadBrake' }
  ];

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function fresh() {
    return {
      power: false,
      volt: 6,
      load: 40,
      hold: false,
      hand: false,
      speed: 0,
      current: 0,
      temp: 25,
      angle: 0,
      burnt: false,
      gen: false,
      seen: { spin: false, load: false, stall: false, hot: false },
      done: false
    };
  }

  let S = fresh();

  function statusKey() {
    if (S.burnt) return 'statusBurnt';
    if (S.gen) return 'statusGen';
    if (S.hold && S.power) return 'statusStall';
    if (S.temp > 100) return 'statusHot';
    if (S.power && S.speed > 120) return 'statusRun';
    if (S.hand) return 'statusHand';
    return 'statusIdle';
  }

  function factKey() {
    if (S.burnt) return 'factBurnt';
    if (S.gen) return 'factGen';
    if (S.hold && S.power) return 'factStall';
    if (S.temp > 95) return 'factHot';
    if (S.load >= 75 && S.power) return 'factLoad';
    if (S.power && S.speed > 120) return 'factRun';
    if (S.hand) return 'factHand';
    return 'factIdle';
  }

  function tick(dt) {
    dt = Math.min(dt, 0.08);

    if (S.burnt) {
      S.speed += (0 - S.speed) * Math.min(1, dt * 2);
      S.current += (0 - S.current) * Math.min(1, dt * 4);
      S.temp = Math.max(25, S.temp - dt * 7);
      S.angle = (S.angle + S.speed * dt * 0.01) % 360;
      S.gen = false;
      return S;
    }

    const base = S.power ? S.volt * 240 : 0;      // no-load rpm at this voltage
    let target = S.power ? base * (1 - S.load / 135) : 0;
    if (S.hold) target = 0;
    if (S.hand) target = S.power ? target + 380 : 900;  // hand crank

    S.speed += (target - S.speed) * Math.min(1, dt * 2.4);
    if (S.speed < 2) S.speed = 0;

    let tc = 0;
    if (S.power) {
      tc = 0.25 + S.load * 0.028 + Math.max(0, 1 - S.speed / Math.max(1, base)) * 2.2;
      if (S.hold) tc += 4.0;
    } else if (S.hand) {
      tc = 0.35;
    }
    S.current += (tc - S.current) * Math.min(1, dt * 3.5);
    if (S.current < 0.02) S.current = 0;

    const heat = S.current * S.current * 1.35;
    S.temp += (heat - (S.temp - 25) * 0.22) * dt;
    S.temp = clamp(S.temp, 25, 180);

    if (S.temp > 135) {
      S.burnt = true;
      S.power = false;
      S.current = 0;
      S.temp = 150;
    }

    S.gen = !S.power && S.hand && S.speed > 120;
    if (S.speed > 600) S.seen.spin = true;
    if (S.load >= 75) S.seen.load = true;
    if (S.hold && S.power) S.seen.stall = true;
    if (S.temp > 80) S.seen.hot = true;
    if (!S.done && S.seen.spin && S.seen.load && S.seen.stall && S.seen.hot) S.done = true;

    S.angle = (S.angle + S.speed * dt * 0.02) % 360;
    return S;
  }

  const ACTIONS = {
    power() {
      if (S.burnt) return { sound: 'deny' };
      S.power = !S.power;
      return { sound: S.power ? 'powerOn' : 'powerOff', say: true };
    },
    volt(el) {
      if (S.burnt) return { sound: 'deny' };
      const v = +(el && el.dataset ? el.dataset.volt : 0);
      if (VOLTS.indexOf(v) < 0) return { sound: 'deny' };
      S.volt = v;
      return { sound: 'beep', say: true };
    },
    load(el) {
      if (S.burnt) return { sound: 'deny' };
      const v = +(el && el.dataset ? el.dataset.load : -1);
      if (!LOADS.some(l => l.id === v)) return { sound: 'deny' };
      S.load = v;
      return { sound: 'notch', say: true };
    },
    hold() {
      if (S.burnt) return { sound: 'deny' };
      S.hold = !S.hold;
      return { sound: S.hold ? 'deny' : 'blip', say: true };
    },
    hand() {
      if (S.burnt) return { sound: 'deny' };
      S.hand = !S.hand;
      return { sound: 'blip', say: true };
    },
    reset() {
      S = fresh();
      return { sound: 'chime', say: true };
    }
  };

  function press(action, el) {
    const fn = ACTIONS[action];
    if (!fn) return null;
    return fn(el) || { sound: 'blip' };
  }

  return {
    get s() { return S; },
    press, tick, fresh: () => { S = fresh(); return S; },
    statusKey, factKey,
    VOLTS, LOADS,
    clamp
  };
})();
