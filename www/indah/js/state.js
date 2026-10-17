/* ═══════════════════════════════════════════════════════════
   indah/js/state.js — Indah Water: the sewer journey + the works

   Two halves, following the connected-sewerage diagram:
     1. network — how wastewater gets from a house to the plant
     2. plant   — the extended-aeration works that cleans it

   Pure logic: no DOM, so it can be tested headlessly.
   ═══════════════════════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ── 1. the connected sewerage system ──
     Everything on your side of the boundary is yours to look after; the
     public pipeline from the manhole onwards belongs to Indah Water. */
  const NETWORK = [
    { key: 'n0', fact: 'g0', lit: 'house' },
    { key: 'n1', fact: 'g1', lit: 'private' },
    { key: 'n2', fact: 'g2', lit: 'chamber' },
    { key: 'n3', fact: 'g3', lit: 'boundary manhole' },
    { key: 'n4', fact: 'g4', lit: 'public' },
    { key: 'n5', fact: 'g5', lit: 'inlet' }
  ];

  /* ── 2. the plant: an extended-aeration works ──
     The six stages labelled down the middle of the diagram, in order. */
  const PLANT = [
    { key: 'p0', fact: 'w0', lit: 'pump' },
    { key: 'p1', fact: 'w1', lit: 'screens' },
    { key: 'p2', fact: 'w2', lit: 'aeration' },
    { key: 'p3', fact: 'w3', lit: 'split' },
    { key: 'p4', fact: 'w4', lit: 'clarifier' },
    { key: 'p5', fact: 'w5', lit: 'effluent' }
  ];

  const LISTS = { network: NETWORK, plant: PLANT };

  function fresh() {
    return {
      tab: 'network',       // network | plant
      step: 0,

      /* 0..1: how far along the current journey the wastewater has reached */
      flow: 0,
      /* 0..1: how clean it is. Raw when it arrives, clear at the outfall. */
      clean: 0.05,

      /* the aeration blowers, which you can switch off to see what happens */
      air: true,
      blower: 0,            // 0..1 how spun-up the blowers are
      sludge: 0,            // 0..1 the return-sludge pump
      rake: 0,              // 0..1 one sweep of the screen rake

      airT: 0
    };
  }

  let S = fresh();

  /* ─────────── actions ─────────── */
  const ACTIONS = {
    tab(el) {
      const t = el && el.dataset ? el.dataset.tab : null;
      if (!LISTS[t]) return { sound: 'deny' };
      if (S.tab === t) return { sound: 'blip' };
      S.tab = t;
      S.step = 0;
      S.flow = 0;
      return { sound: t === 'plant' ? 'air' : 'blip' };
    },

    stepUp() {
      const list = LISTS[S.tab];
      if (S.step < list.length - 1) {
        S.step++;
        return { sound: S.step === list.length - 1 ? 'chime' : 'blip', cheer: S.step === list.length - 1 };
      }
      return { sound: 'blip' };
    },

    stepDown() {
      if (S.step > 0) { S.step--; return { sound: 'notch' }; }
      return { sound: 'deny' };
    },

    jump(el) {
      const n = el && el.dataset ? +el.dataset.step : 0;
      S.step = clamp(n, 0, LISTS[S.tab].length - 1);
      return { sound: 'blip' };
    },

    air() {
      S.air = !S.air;
      return { sound: S.air ? 'air' : 'blip' };
    },

    restart() { S.step = 0; S.flow = 0; return { sound: 'chime' }; }
  };

  function press(action, el) {
    const fn = ACTIONS[action];
    if (!fn) return null;
    return fn(el) || { sound: 'blip' };
  }

  /* ─────────── tick ─────────── */
  function tick(dt) {
    dt = Math.min(dt, 0.08);

    /* the wastewater creeps towards the stage you are reading about */
    const target = (S.step + 0.5) / LISTS[S.tab].length;
    S.flow += (target - S.flow) * 2.2 * dt;

    /* raw sewage while it is on its way; the plant is what makes it clean */
    S.clean = S.tab === 'network' ? 0.05 : clamp(S.flow * 1.3 - 0.15, 0, 1);

    /* the blowers spin up and down — with them off the tank goes quiet and
       the bacteria stop working, which is the whole point of the stage */
    const bt = S.air ? 1 : 0;
    S.blower += (bt - S.blower) * 3.2 * dt;
    S.airT += dt;

    /* return activated sludge is pumped back while the air is on */
    const st = S.air ? 1 : 0;
    S.sludge += (st - S.sludge) * 1.6 * dt;

    /* one sweep of the screen rake, over and over */
    S.rake = (S.rake + dt * (0.45 + S.flow * 0.5)) % 1;

    return S;
  }

  return {
    get s() { return S; },
    press, tick,
    fresh: () => { S = fresh(); return S; },
    NETWORK, PLANT,
    clamp
  };
})();
