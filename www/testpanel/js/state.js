/* ═══════════════════════════════════════════
   testpanel/js/state.js — the Test & Check board

   The teaching point: with no load, no current flows and the meter stays at
   0 W. The RCD/switch is a safety device, not an energy consumer. A charger
   with no phone is a small standby load — that is not "no load".
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  const LOADS = [
    { id: 'none',    key: 'loadNone',    watts: 0,    current: 0,     part: null },
    { id: 'fluor',   key: 'loadFluor',   watts: 36,   current: 0.29,  part: 'fluor' },
    { id: 'led',     key: 'loadLed',     watts: 18,   current: 0.09,  part: 'led' },
    { id: 'e27',     key: 'loadE27',     watts: 60,   current: 0.26,  part: 'e27' },
    { id: 'e14',     key: 'loadE14',     watts: 40,   current: 0.18,  part: 'e14' },
    { id: 'mr16',    key: 'loadMr16',    watts: 20,   current: 0.09,  part: 'mr16' },
    { id: 'charger', key: 'loadCharger', watts: 0.3,  current: 0.002, part: 'charger', standby: true }
  ];
  const BY_ID = {};
  LOADS.forEach(l => { BY_ID[l.id] = l; });

  function fresh() {
    return {
      rcd: true,
      tripped: false,
      load: 'none',
      energy: 0,          // kWh
      seconds: 0,
      seen: { none: false, load: false, standby: false, test: false },
      done: false
    };
  }

  let S = fresh();

  function load() { return BY_ID[S.load] || BY_ID.none; }
  function powered() { return S.rcd && !S.tripped; }
  function power() { return powered() ? load().watts : 0; }
  function current() { return powered() ? load().current : 0; }

  function factKey() {
    if (S.tripped) return 'factTripped';
    if (!S.rcd) return 'factOff';
    const l = load();
    if (l.id === 'none') return 'factNoLoad';
    if (l.standby) return 'factStandby';
    return 'factLoad';
  }

  function statusKey() {
    if (S.tripped) return 'statusTripped';
    if (!S.rcd) return 'statusOff';
    if (load().id === 'none') return 'statusNoLoad';
    if (load().standby) return 'statusStandby';
    return 'statusOn';
  }

  function checkDone() {
    if (!S.done && S.seen.none && S.seen.load && S.seen.standby && S.seen.test) S.done = true;
  }

  function tick(dt) {
    dt = Math.min(dt, 0.08);
    if (!powered()) { checkDone(); return S; }
    const w = power();
    if (w > 0) {
      S.energy += (w * dt) / 3600000;     // W·s → kWh
      S.seconds += dt;
    }
    if (load().id === 'none') S.seen.none = true;
    if (w > 0 && !load().standby) S.seen.load = true;
    if (load().standby) S.seen.standby = true;
    checkDone();
    return S;
  }

  const ACTIONS = {
    load(el) {
      const id = el && el.dataset ? el.dataset.load : null;
      if (!BY_ID[id]) return { sound: 'deny' };
      S.load = id;
      return { sound: 'notch', say: true };
    },
    rcd() {
      if (S.tripped) return { sound: 'deny' };
      S.rcd = !S.rcd;
      return { sound: S.rcd ? 'powerOn' : 'powerOff', say: true };
    },
    test() {
      if (!S.rcd || S.tripped) return { sound: 'deny' };
      S.tripped = true;
      S.seen.test = true;
      checkDone();
      return { sound: 'warn', say: true };
    },
    reset() {
      S.tripped = false;
      S.rcd = true;
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
    get load() { return load(); },
    press, tick, fresh: () => { S = fresh(); return S; },
    factKey, statusKey, power, current, powered,
    LOADS, BY_ID
  };
})();
