/* ═══════════════════════════════════════════
   Food Eating — digestion simulation
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  const STAGES = ['MOUTH', 'ESOPHAGUS', 'STOMACH', 'SMALL', 'LARGE', 'OUT'];

  /* path fraction where each stage begins / ends */
  const RANGE = {
    MOUTH:     [0.000, 0.040],
    ESOPHAGUS: [0.040, 0.200],
    STOMACH:   [0.200, 0.345],
    SMALL:     [0.345, 0.720],
    LARGE:     [0.720, 0.950],
    OUT:       [0.950, 1.000]
  };

  /* rough nutrition per 100 g — used for the meters and the facts */
  const FOODS = [
    { id: 'rice',     emoji: '🍚', carb: 28,  prot: 2.7, fat: 0.3, fiber: 0.4, water: 12,  sugar: 0.1, bulk: 20 },
    { id: 'apple',    emoji: '🍎', carb: 14,  prot: 0.3, fat: 0.2, fiber: 2.4, water: 86,  sugar: 10,  bulk: 16 },
    { id: 'burger',   emoji: '🍔', carb: 30,  prot: 15,  fat: 15,  fiber: 2,   water: 50,  sugar: 5,   bulk: 30 },
    { id: 'milk',     emoji: '🥛', carb: 5,   prot: 3.4, fat: 3.3, fiber: 0,   water: 88,  sugar: 5,   bulk: 14 },
    { id: 'broccoli', emoji: '🥦', carb: 7,   prot: 2.8, fat: 0.4, fiber: 2.6, water: 89,  sugar: 1.7, bulk: 15 },
    { id: 'candy',    emoji: '🍬', carb: 98,  prot: 0,   fat: 0,   fiber: 0,   water: 1,   sugar: 70,  bulk: 10 },
    { id: 'water',    emoji: '💧', carb: 0,   prot: 0,   fat: 0,   fiber: 0,   water: 100, sugar: 0,   bulk: 8 },
    { id: 'egg',      emoji: '🥚', carb: 1,   prot: 13,  fat: 11,  fiber: 0,   water: 75,  sugar: 1,   bulk: 14 }
  ];

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const FOOD_BY_ID = {};
  FOODS.forEach(f => { FOOD_BY_ID[f.id] = f; });

  function fresh() {
    return {
      mode: 'MANUAL',          // MANUAL | WATCH
      food: null,
      stage: 'MOUTH',
      stageT: 0,
      p: 0,

      chew: 0,                 // progress of the current bite 0..1
      chewCount: 0,
      saliva: 0,
      chewQuality: 0,          // quality locked in at the swallow
      churn: 0,
      acid: 0,
      breakdown: 0,

      nutrient: 0,             // absorbed fraction 0..1
      water: 0,
      waste: 0,

      energy: 40,
      belly: 10,
      ache: false,
      acheFlash: 0,
      relievedT: 0,

      journeys: 0,
      bestAbsorb: 0,
      quizOpen: false,
      quizDone: false,

      lastEvent: '',
      mood: 'hungry'
    };
  }

  let S = fresh();

  /* ─────────── helpers ─────────── */
  function setStage(st) {
    S.stage = st;
    S.stageT = 0;
  }

  function mood() {
    if (S.relievedT > 0) return 'relieved';
    if (S.ache) return 'ache';
    if (S.stage === 'OUT') return 'toilet';
    if (S.stage === 'MOUTH') return S.food ? 'eating' : 'hungry';
    if (S.belly > 88) return 'full';
    return 'happy';
  }

  function note(key) { S.lastEvent = key; }

  /* ─────────── actions ─────────── */
  const ACTIONS = {

    pick(el) {
      const id = el && el.dataset ? el.dataset.food : null;
      const f = FOOD_BY_ID[id];
      if (!f) return { sound: 'deny' };
      if (S.stage !== 'MOUTH' || S.food) return { sound: 'deny' };

      S.food = id;
      S.chew = 0; S.chewCount = 0; S.saliva = 0;
      S.churn = 0; S.acid = 0; S.breakdown = 0;
      S.nutrient = 0; S.water = 0; S.waste = 0;
      S.ache = false; S.relievedT = 0;
      S.p = RANGE.MOUTH[0];
      S.belly = clamp(S.belly + f.bulk, 0, 100);
      if (S.belly > 94) S.ache = true;          // ate far too much
      note('sayEating');
      return { sound: 'blip', say: 'sayEating', toast: S.ache ? 'toastAche' : null };
    },

    chew() {
      if (S.stage !== 'MOUTH' || !S.food) return { sound: 'deny', say: 'needFood' };
      if (S.chew >= 1) return { sound: 'blip' };
      S.chewCount++;
      S.chew = clamp(S.chew + 0.17 + (S.saliva < 0.5 ? 0.05 : 0), 0, 1);
      S.saliva = clamp(S.saliva + 0.22, 0, 1);
      if (S.chewCount === 3) note('sayChew');
      return { sound: 'chomp', say: S.chewCount === 3 ? 'sayChew' : null };
    },

    swallow() {
      if (S.stage !== 'MOUTH' || !S.food) return { sound: 'deny', say: 'needFood' };
      if (S.chew < 0.85) {
        /* swallowing a lump */
        S.chewQuality = S.chew;
        S.ache = S.chew < 0.5 || S.belly > 88;
        setStage('ESOPHAGUS');
        S.stageT = 0.6;                            // skip a little
        return { sound: 'gulp', say: 'saySwallowEarly', toast: 'toastNoChew' };
      }
      S.chewQuality = 1;
      setStage('ESOPHAGUS');
      if (S.belly > 88) S.ache = true;
      return { sound: 'gulp', say: 'saySwallow', toast: S.ache ? 'toastAche' : 'toastWellChewed' };
    },

    churn() {
      if (S.stage !== 'STOMACH') return { sound: 'deny' };
      S.churn = clamp(S.churn + 0.15, 0, 1);
      S.acid = clamp(S.acid + 0.18, 0, 1);
      S.breakdown = clamp(S.churn * 0.6 + S.acid * 0.4, 0, 1);
      if (S.chewQuality < 0.5) S.breakdown *= 0.7;   // big lumps resist acid
      return { sound: 'squirt', say: S.churn > 0.6 ? 'sayChurn' : null };
    },

    poop() {
      if (S.stage !== 'OUT') return { sound: 'deny' };
      S.waste = 0;
      S.belly = clamp(S.belly - 26, 0, 100);
      S.relievedT = 3.2;
      S.journeys++;
      setStage('MOUTH');
      S.food = null;
      S.chew = 0; S.chewCount = 0; S.saliva = 0;
      S.churn = 0; S.acid = 0; S.breakdown = 0;
      S.nutrient = 0; S.water = 0;
      S.ache = false;
      S.p = RANGE.MOUTH[0];
      return { sound: 'flush', say: 'sayRelieved', toast: 'toastPoop', cheer: true };
    },

    again() {
      if (S.stage !== 'MOUTH') return { sound: 'deny' };
      S.food = null;
      return { sound: 'blip' };
    }
  };

  let onToast = null;

  function press(action, el) {
    const fn = ACTIONS[action];
    if (!fn) return null;
    const res = fn(el) || { sound: 'deny' };
    S.mood = mood();                 // reflect the change immediately
    if (res.toast && onToast) onToast(res.toast, res.cheer ? 'good' : null);
    return res;
  }

  /* ─────────── tick ─────────── */
  function tick(dt) {
    dt = Math.min(dt, 0.08);
    S.stageT += dt;

    const f = S.food ? FOOD_BY_ID[S.food] : null;
    const r = RANGE[S.stage];

    /* auto-play */
    if (S.mode === 'WATCH') autoStep();

    switch (S.stage) {
      case 'MOUTH':
        /* saliva keeps rising slowly while chewing */
        if (f) S.saliva = clamp(S.saliva + dt * 0.02, 0, 1);
        S.p = r[0];
        break;

      case 'ESOPHAGUS': {
        const t = clamp(S.stageT / 3.0, 0, 1);
        /* peristalsis: moves in little pushes */
        const e = t - 0.06 * Math.sin(t * Math.PI * 6);
        S.p = r[0] + (r[1] - r[0]) * clamp(e, 0, 1);
        if (t >= 1) { setStage('STOMACH'); if (onToast) onToast('sayChurn', null); }
        break;
      }

      case 'STOMACH': {
        S.p = r[0] + (r[1] - r[0]) * clamp(S.churn, 0, 1);
        /* acid keeps working */
        S.acid = clamp(S.acid + dt * 0.06, 0, 1);
        S.breakdown = clamp(S.churn * 0.6 + S.acid * 0.4, 0, 1);
        if (S.chewQuality < 0.5) S.breakdown *= 0.7;
        if (S.churn >= 1) { setStage('SMALL'); }
        break;
      }

      case 'SMALL': {
        const dur = 7.0;
        const t = clamp(S.stageT / dur, 0, 1);
        S.p = r[0] + (r[1] - r[0]) * t;
        S.nutrient = clamp(t * absorb(), 0, 1);
        if (t >= 1) { setStage('LARGE'); if (onToast) onToast('toastEnergy', 'good'); }
        break;
      }

      case 'LARGE': {
        const dur = 5.5;
        const t = clamp(S.stageT / dur, 0, 1);
        S.p = r[0] + (r[1] - r[0]) * t;
        S.water = clamp(t * ((f ? f.water : 60) / 100), 0, 1);
        S.waste = clamp(t * 1.05, 0, 1);
        if (t >= 1) { setStage('OUT'); if (onToast) onToast('toastWaste', null); }
        break;
      }

      case 'OUT':
        S.p = r[0] + (r[1] - r[0]) * clamp(S.stageT / 1.2, 0, 1);
        if (S.stageT > 1.2 && S.stageT - dt <= 1.2) {
          if (onToast) onToast('toastDone', 'good');
        }
        break;
    }

    /* energy from absorbed nutrients */
    if (S.stage === 'SMALL' && f) {
      const gain = (nutrientValue(f) / 100) * absorb() * dt * 6.5;
      S.energy = clamp(S.energy + gain, 0, 100);
    } else {
      S.energy = clamp(S.energy - dt * 0.12, 0, 100);
    }

    if (S.relievedT > 0) S.relievedT = Math.max(0, S.relievedT - dt);
    if (S.acheFlash > 0) S.acheFlash = Math.max(0, S.acheFlash - dt);

    S.mood = mood();
    return S.mood;
  }

  /* how much of the food's goodness actually gets absorbed */
  function absorb() {
    return clamp(S.chewQuality * 0.5 + S.breakdown * 0.5, 0.1, 1);
  }

  function nutrientValue(f) {
    return clamp(f.prot * 3 + f.carb * 0.8 + f.fiber * 2.2 - f.sugar * 0.35, 5, 100);
  }

  /* ─────────── auto play ─────────── */
  let autoT = 0;
  function autoStep() {
    autoT += 1 / 60;
    const step = 0.7;
    if (autoT < step) return;
    autoT = 0;

    if (S.stage === 'MOUTH') {
      if (!S.food) {
        const pick = FOODS[Math.floor(Math.random() * 4)];   // only wholesome foods
        ACTIONS.pick({ dataset: { food: pick.id } });
      } else if (S.chew < 0.9) {
        ACTIONS.chew();
      } else {
        ACTIONS.swallow();
      }
    } else if (S.stage === 'STOMACH') {
      ACTIONS.churn();
    } else if (S.stage === 'OUT') {
      if (S.stageT > 2.2) ACTIONS.poop();
    }
  }

  return {
    get s() { return S; },
    get food() { return S.food ? FOOD_BY_ID[S.food] : null; },
    FOODS, FOOD_BY_ID, STAGES, RANGE,
    press, tick, fresh: () => { S = fresh(); return S; },
    setToastHook: fn => { onToast = fn; },
    nutrientValue, absorb, clamp,
    setMode(m) { S.mode = m; autoT = 0; }
  };
})();
