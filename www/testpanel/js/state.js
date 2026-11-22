/* ═══════════════════════════════════════════
   testpanel/js/state.js — the Test & Check board

   No load → 0 W. The RCD is a safety switch, not an energy consumer.
   Bulb models let you compare LED and incandescent. A short circuit
   bypasses the load, spikes the current and trips the RCD.
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  const MODELS = {
    e27: [
      { id: 'e27led5',  key: 'mE27Led5',  watts: 5 },
      { id: 'e27led9',  key: 'mE27Led9',  watts: 9 },
      { id: 'e27inc40', key: 'mE27Inc40', watts: 40 },
      { id: 'e27inc60', key: 'mE27Inc60', watts: 60 }
    ],
    e14: [
      { id: 'e14led4',  key: 'mE14Led4',  watts: 4 },
      { id: 'e14inc25', key: 'mE14Inc25', watts: 25 }
    ]
  };

  const LOADS = [
    { id: 'none',    key: 'loadNone',    watts: 0,    current: 0,     part: null },
    { id: 'fluor',   key: 'loadFluor',   watts: 36,   current: 0.29,  part: 'fluor' },
    { id: 'led',     key: 'loadLed',     watts: 18,   current: 0.09,  part: 'led' },
    { id: 'e27',     key: 'loadE27',     watts: 0,    current: 0,     part: 'e27', models: 'e27' },
    { id: 'e14',     key: 'loadE14',     watts: 0,    current: 0,     part: 'e14', models: 'e14' },
    { id: 'mr16',    key: 'loadMr16',    watts: 20,   current: 0.09,  part: 'mr16' },
    { id: 'charger', key: 'loadCharger', watts: 0.3,  current: 0.002, part: 'charger', standby: true }
  ];
  const BY_ID = {};
  LOADS.forEach(l => { BY_ID[l.id] = l; });

  function fresh() {
    return {
      rcd: true,
      tripped: false,
      short: false,
      load: 'none',
      model: 0,
      energy: 0,
      seconds: 0,
      seen: { none: false, load: false, standby: false, test: false, short: false },
      done: false
    };
  }

  let S = fresh();

  function load() {
    const base = BY_ID[S.load] || BY_ID.none;
    if (!base.models) return base;
    const list = MODELS[base.models];
    const m = list[S.model] || list[0];
    return Object.assign({}, base, { watts: m.watts, current: m.watts / 230, model: m });
  }

  function modelList() {
    const base = BY_ID[S.load];
    return base && base.models ? MODELS[base.models] : null;
  }

  function powered() { return S.rcd && !S.tripped && !S.short; }
  function power() { return powered() ? load().watts : 0; }
  function current() { return powered() ? load().current : 0; }

  function factKey() {
    if (S.short && S.tripped) return 'factShort';
    if (S.short) return 'factShortOff';
    if (S.tripped) return 'factTripped';
    if (!S.rcd) return 'factOff';
    const l = load();
    if (l.id === 'none') return 'factNoLoad';
    if (l.standby) return 'factStandby';
    if (l.models) return 'factBulb';
    return 'factLoad';
  }

  function statusKey() {
    if (S.tripped) return 'statusTripped';
    if (S.short) return 'statusShort';
    if (!S.rcd) return 'statusOff';
    if (load().id === 'none') return 'statusNoLoad';
    if (load().standby) return 'statusStandby';
    return 'statusOn';
  }

  function checkDone() {
    if (!S.done && S.seen.none && S.seen.load && S.seen.standby && S.seen.test && S.seen.short) S.done = true;
  }

  function tick(dt) {
    dt = Math.min(dt, 0.08);
    if (!powered()) { checkDone(); return S; }
    const w = power();
    if (w > 0) {
      S.energy += (w * dt) / 3600000;
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
      S.model = 0;
      return { sound: 'notch', say: true };
    },
    model(el) {
      const list = modelList();
      if (!list) return { sound: 'deny' };
      const i = +(el && el.dataset ? el.dataset.i : -1);
      if (!(i >= 0 && i < list.length)) return { sound: 'deny' };
      S.model = i;
      return { sound: 'notch', say: true };
    },
    rcd() {
      if (S.tripped) return { sound: 'deny' };
      if (!S.rcd) {
        S.rcd = true;
        if (S.short) {
          S.tripped = true;
          S.seen.short = true;
          checkDone();
          return { sound: 'warn', say: true };
        }
        return { sound: 'powerOn', say: true };
      }
      S.rcd = false;
      return { sound: 'powerOff', say: true };
    },
    test() {
      if (!S.rcd || S.tripped || S.short) return { sound: 'deny' };
      S.tripped = true;
      S.seen.test = true;
      checkDone();
      return { sound: 'warn', say: true };
    },
    short() {
      if (S.short) return { sound: 'deny' };
      S.short = true;
      if (S.rcd && !S.tripped) {
        S.tripped = true;
        S.seen.short = true;
        checkDone();
        return { sound: 'warn', say: true };
      }
      return { sound: 'warn', say: true };
    },
    reset() {
      S.tripped = false;
      S.rcd = true;
      S.short = false;
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
    factKey, statusKey, power, current, powered, modelList,
    LOADS, BY_ID, MODELS
  };
})();
