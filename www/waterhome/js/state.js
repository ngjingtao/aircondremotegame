/* ═══════════════════════════════════════════
   waterhome/js/state.js — from the river to the tap, and the hot tank

   Two halves: a supply journey with eight steps, and a live hot-water
   cylinder that heats, cycles on its thermostat and mixes at the tap.
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const SUPPLY = [
    { key: 'w1', fact: 'wf1', lit: 'source' },
    { key: 'w2', fact: 'wf2', lit: 'screens' },
    { key: 'w3', fact: 'wf3', lit: 'coag' },
    { key: 'w4', fact: 'wf4', lit: 'settle' },
    { key: 'w5', fact: 'wf5', lit: 'filter' },
    { key: 'w6', fact: 'wf6', lit: 'disinfect' },
    { key: 'w7', fact: 'wf7', lit: 'tank' },
    { key: 'w8', fact: 'wf8', lit: 'tap' }
  ];

  const SETPOINTS = [40, 50, 60, 70];
  const HEAT_RATE = 1.6;       // °C per second in the game's time-lapse
  const AMBIENT = 20;

  function fresh() {
    return {
      tab: 'supply',
      step: 0,
      supplyDone: false,

      power: true,
      setTemp: 60,
      temp: 20,
      bottom: 15,
      maxTemp: 20,
      heating: false,
      upperOn: false,
      lowerOn: false,
      used: false,
      drawn: 0,
      drawPulse: 0,
      energy: 0
    };
  }

  let S = fresh();

  const rating = () => {
    if (!S.supplyDone || !S.used) return { stars: 0, reason: '' };
    let stars = 1;
    if (S.maxTemp >= S.setTemp - 1) stars = 2;
    if (S.setTemp >= 60 && S.maxTemp >= 59) stars = 3;
    const reason = stars === 3 ? 'waterPerfect' : stars === 2 ? 'waterGood' : 'waterCold';
    return { stars, reason };
  };

  const ACTIONS = {
    tab(el) {
      const m = el && el.dataset ? el.dataset.tab : null;
      if (m !== 'supply' && m !== 'heater') return { sound: 'deny' };
      S.tab = m;
      return { sound: 'blip' };
    },

    stepUp() {
      if (S.tab !== 'supply') return { sound: 'deny' };
      if (S.step < SUPPLY.length - 1) {
        S.step++;
        if (S.step === SUPPLY.length - 1) S.supplyDone = true;
        return { sound: 'blip' };
      }
      S.supplyDone = true;
      return { sound: 'blip' };
    },

    stepDown() {
      if (S.tab !== 'supply' || S.step <= 0) return { sound: 'deny' };
      S.step--;
      return { sound: 'notch' };
    },

    jump(el) {
      if (S.tab !== 'supply') return { sound: 'deny' };
      const n = el && el.dataset ? +el.dataset.step : -1;
      if (!(n >= 0 && n < SUPPLY.length)) return { sound: 'deny' };
      S.step = n;
      if (n === SUPPLY.length - 1) S.supplyDone = true;
      return { sound: 'blip' };
    },

    power() {
      S.power = !S.power;
      return { sound: S.power ? 'powerOn' : 'powerOff' };
    },

    set(el) {
      const key = el && el.dataset ? el.dataset.key : null;
      const value = el && el.dataset ? +el.dataset.value : NaN;
      if (key !== 'setTemp') return { sound: 'deny' };
      if (SETPOINTS.indexOf(value) < 0) return { sound: 'deny' };
      S.setTemp = value;
      return { sound: 'beep' };
    },

    draw() {
      if (S.tab !== 'heater') return { sound: 'deny' };
      if (S.temp < 30) return { sound: 'deny' };
      S.drawn++;
      S.used = true;
      S.drawPulse = 1;
      S.temp = clamp(S.temp - 7, AMBIENT, 75);
      S.bottom = clamp(S.bottom - 5, AMBIENT - 5, 75);
      return { sound: 'flush' };
    }
  };

  function press(action, el) {
    const fn = ACTIONS[action];
    if (!fn) return null;
    return fn(el) || { sound: 'blip' };
  }

  function tick(dt) {
    dt = Math.min(dt, 0.08);
    S.drawPulse = Math.max(0, S.drawPulse - 2.2 * dt);

    /* a real electric cylinder usually has two elements: the upper one
       heats the top first, then the lower one takes over. */
    const upperNeed = S.temp < S.setTemp - 0.4;
    const lowerNeed = !upperNeed && S.bottom < S.setTemp - 5.4;

    S.upperOn = S.power && upperNeed;
    S.lowerOn = S.power && lowerNeed;
    S.heating = S.upperOn || S.lowerOn;

    if (S.upperOn) {
      S.temp = clamp(S.temp + HEAT_RATE * dt, AMBIENT, 75);
      S.bottom = clamp(S.bottom + HEAT_RATE * 0.22 * dt, AMBIENT - 5, S.temp - 3);
      S.energy += dt;
    } else if (S.lowerOn) {
      S.bottom = clamp(S.bottom + HEAT_RATE * 0.85 * dt, AMBIENT - 5, S.setTemp - 5);
      if (S.temp < S.setTemp) S.temp = clamp(S.temp + HEAT_RATE * 0.04 * dt, AMBIENT, 75);
      S.energy += dt;
    } else {
      /* standing losses, and the hottest water stays at the top */
      S.temp = clamp(S.temp - 0.03 * dt, AMBIENT, 75);
      S.bottom = clamp(S.bottom - 0.05 * dt, AMBIENT - 5, S.temp - 3);
    }

    S.bottom = Math.min(S.bottom, S.temp - 3);
    S.maxTemp = Math.max(S.maxTemp, S.temp);
    return S;
  }

  return {
    get s() { return S; },
    press, tick,
    fresh: () => { S = fresh(); return S; },
    rating,
    SUPPLY, SETPOINTS,
    HEAT_RATE, AMBIENT,
    clamp
  };
})();
