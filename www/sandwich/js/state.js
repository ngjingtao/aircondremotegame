/* ═══════════════════════════════════════════
   sandwich/js/state.js — build, cook and rate a breakfast sandwich

   Choices set the balance; the pan is a timing game. The egg has a
   target time for each heat, and the green band on the timer is the
   window where it is cooked but not rubbery.
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const BREADS = [
    { id: 'white', key: 'bWhite', ico: '🍞', health: 0.25 },
    { id: 'wholemeal', key: 'bWhole', ico: '🍞', health: 1.00 },
    { id: 'sourdough', key: 'bSour', ico: '🥖', health: 0.60 }
  ];
  const SPREADS = [
    { id: 'butter', key: 'sButter', ico: '🧈', health: 0.25, barrier: 1 },
    { id: 'avocado', key: 'sAvo', ico: '🥑', health: 1.00, barrier: 1 },
    { id: 'mayo', key: 'sMayo', ico: '🥛', health: 0.05, barrier: 1 },
    { id: 'none', key: 'sNone', ico: '🚫', health: 0.00, barrier: 0 }
  ];
  const FILLINGS = [
    { id: 'egg', key: 'fEgg', ico: '🍳', health: 0.70 },
    { id: 'cheese', key: 'fCheese', ico: '🧀', health: 0.45 },
    { id: 'eggcheese', key: 'fEggCheese', ico: '🍳', health: 1.00 },
    { id: 'bacon', key: 'fBacon', ico: '🥓', health: 0.20 }
  ];
  const VEGGIES = [
    { id: 'tomato', key: 'vTomato', ico: '🍅', health: 1.00, wet: true },
    { id: 'spinach', key: 'vSpinach', ico: '🥬', health: 1.00, wet: false },
    { id: 'lettuce', key: 'vLettuce', ico: '🥗', health: 0.80, wet: false },
    { id: 'none', key: 'vNone', ico: '🚫', health: 0.00, wet: false }
  ];
  const HEATS = [
    { id: 'low', key: 'hLow', target: 8.0 },
    { id: 'med', key: 'hMed', target: 5.0 },
    { id: 'high', key: 'hHigh', target: 3.5 }
  ];

  const find = (list, id) => list.filter(x => x.id === id)[0] || list[0];

  function fresh() {
    return {
      phase: 'build',       // build | cook | ready | done
      bread: 'white',
      spread: 'butter',
      filling: 'egg',
      veg: 'tomato',
      heat: 'med',
      cooking: false,
      cookT: 0,
      cookQuality: 0,
      built: false,
      health: 0,
      soggy: false,
      stars: 0,
      reason: ''
    };
  }

  let S = fresh();

  const choice = (list, id) => find(list, id);

  function heatTarget() { return choice(HEATS, S.heat).target; }

  function balance() {
    const b = choice(BREADS, S.bread).health;
    const sp = choice(SPREADS, S.spread).health;
    const f = choice(FILLINGS, S.filling).health;
    const v = choice(VEGGIES, S.veg).health;
    return clamp((b + sp + f + v) / 4, 0, 1);
  }

  function stopCooking() {
    S.cooking = false;
    const target = heatTarget();
    const err = Math.abs(S.cookT - target);
    S.cookQuality = clamp(1 - err / (target * 0.38), 0, 1);
    S.phase = 'ready';
  }

  function build() {
    S.built = true;
    S.phase = 'done';
    S.health = balance();
    S.soggy = S.spread === 'none' && choice(VEGGIES, S.veg).wet;

    let stars = 1;
    if (S.cookQuality >= 0.75) stars = 2;
    if (S.cookQuality >= 0.75 && S.health >= 0.8 && !S.soggy) stars = 3;
    S.stars = stars;

    if (S.cookT < heatTarget() - 0.6) S.reason = 'sandwichRunny';
    else if (S.cookT > heatTarget() + 0.9) S.reason = 'sandwichBurnt';
    else if (S.soggy) S.reason = 'sandwichSoggy';
    else if (stars === 3) S.reason = 'sandwichPerfect';
    else if (S.cookQuality < 0.75) S.reason = 'sandwichCook';
    else S.reason = 'sandwichPlain';
  }

  const ACTIONS = {
    set(el) {
      const key = el && el.dataset ? el.dataset.key : null;
      const value = el && el.dataset ? el.dataset.value : null;
      if (!key || value == null) return { sound: 'deny' };

      if (key === 'heat') {
        if (S.phase !== 'cook' || S.cooking) return { sound: 'deny' };
        if (!HEATS.some(h => h.id === value)) return { sound: 'deny' };
        S.heat = value;
        return { sound: 'beep' };
      }
      if (S.phase !== 'build') return { sound: 'deny' };
      const lists = { bread: BREADS, spread: SPREADS, filling: FILLINGS, veg: VEGGIES };
      const list = lists[key];
      if (!list || !list.some(x => x.id === value)) return { sound: 'deny' };
      S[key] = value;
      return { sound: 'beep' };
    },

    action() {
      if (S.phase === 'build') {
        S.phase = 'cook';
        S.cookT = 0;
        S.cookQuality = 0;
        return { sound: 'powerOn' };
      }
      if (S.phase === 'cook') {
        if (!S.cooking) { S.cooking = true; S.cookT = 0; return { sound: 'powerOn' }; }
        stopCooking();
        return { sound: 'powerOff' };
      }
      if (S.phase === 'ready') {
        build();
        return { sound: 'chime' };
      }
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
    if (S.phase !== 'cook' || !S.cooking) return S;
    S.cookT += dt;
    if (S.cookT > heatTarget() * 1.7) {
      S.cooking = false;
      S.cookQuality = 0;
      S.phase = 'ready';
      S.reason = 'sandwichBurnt';
    }
    return S;
  }

  return {
    get s() { return S; },
    press, tick,
    fresh: () => { S = fresh(); return S; },
    balance, heatTarget,
    BREADS, SPREADS, FILLINGS, VEGGIES, HEATS,
    clamp
  };
})();
