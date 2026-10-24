/* ═══════════════════════════════════════════
   laundry/js/state.js — the wash cycle and the dry cycle

   Everything is a real (if simplified) trade-off:
   • warmer water cleans better, but hot water shrinks wool
   • a faster spin leaves less water for the dryer, but roughs up delicates
   • too much detergent makes foam, traps dirt and leaves residue
   • a sensor dry stops in time; a timed dry keeps heating and over-dries
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ── the three loads a child can choose ── */
  const LOADS = [
    {
      id: 'mixed', key: 'loadMixed', dirt: 0.55,
      tempMax: 60, spinMax: 1400, heatMax: 'high',
      washBudget: 80, dryBudget: 24
    },
    {
      id: 'gym', key: 'loadGym', dirt: 0.85,
      tempMax: 40, spinMax: 1000, heatMax: 'low',
      washBudget: 95, dryBudget: 20
    },
    {
      id: 'wool', key: 'loadWool', dirt: 0.35,
      tempMax: 30, spinMax: 600, heatMax: 'low',
      washBudget: 55, dryBudget: 20
    }
  ];

  /* ── wash programmes ── */
  const PROGRAMS = {
    quick:  { key: 'progQuick',  len: 8,  power: 0.75, water: 38 },
    cotton: { key: 'progCotton', len: 14, power: 0.95, water: 60 },
    heavy:  { key: 'progHeavy',  len: 18, power: 1.05, water: 75 },
    wool:   { key: 'progWool',   len: 10, power: 0.78, water: 45 }
  };
  const PROG_ORDER = ['quick', 'cotton', 'heavy', 'wool'];

  const TEMPS = [20, 30, 40, 60];
  const TEMP_F = { 20: 0.55, 30: 0.70, 40: 0.85, 60: 1.00 };

  const SPINS = [600, 1000, 1400];
  const SPIN_WET = { 600: 0.75, 1000: 0.52, 1400: 0.32 };

  const DETERGENTS = {
    low:    { key: 'detLow',    factor: 0.85, residue: 0.02, foam: 0.15 },
    normal: { key: 'detNormal', factor: 1.00, residue: 0.00, foam: 0.35 },
    high:   { key: 'detHigh',   factor: 1.04, residue: 0.18, foam: 1.00 }
  };
  const DET_ORDER = ['low', 'normal', 'high'];

  /* ── dryer settings ── */
  const DRY_PROGRAMS = {
    sensor: { key: 'proSensor' },
    timed:  { key: 'proTimed', len: 22 }
  };
  const DRY_PROG_ORDER = ['sensor', 'timed'];

  const DRYNESS = { iron: 0.16, cupboard: 0.06, extra: 0.02 };
  const DRYNESS_ORDER = ['iron', 'cupboard', 'extra'];

  const HEATS = {
    low:  { key: 'heatLow',  rate: 0.035, power: 0.60 },
    high: { key: 'heatHigh', rate: 0.050, power: 1.00 }
  };
  const HEAT_ORDER = ['low', 'high'];

  /* ── how long each phase takes ── */
  const PHASES = {
    fill: 3,
    drain: 3,
    rinse: 6,
    spin: 5,
    heat: 3,
    cool: 4
  };

  const WASH_PHASES = ['fill', 'wash', 'drain', 'rinse', 'spin'];
  const DRY_PHASES = ['heat', 'dry', 'cool'];

  const find = (list, id) => list.filter(x => x.id === id)[0] || null;

  function fresh() {
    return {
      tab: 'wash',

      /* settings */
      load: 'mixed',
      program: 'cotton',
      temp: 30,
      spin: 1000,
      detergent: 'normal',
      dryProgram: 'sensor',
      dryness: 'cupboard',
      heat: 'high',

      /* the machine */
      phase: 'idle',
      phaseT: 0,
      progress: 0,
      cycleT: 0,

      /* the clothes */
      dirt: 0.55,
      clean: 0,
      care: 1,
      residue: 0,
      wetness: 0.52,
      moisture: 0.52,

      /* results */
      washDone: false,
      dryDone: false,
      washStars: 0,
      dryStars: 0,
      washReason: '',
      dryReason: '',
      washEnergy: 0,
      dryEnergy: 0,

      /* visuals */
      bubbles: 0,
      heatLevel: 0,

      /* the plan fixed at the moment START is pressed */
      washPlan: null,
      dryStart: 0
    };
  }

  let S = fresh();

  const running = () => WASH_PHASES.indexOf(S.phase) >= 0 || DRY_PHASES.indexOf(S.phase) >= 0;
  const washing = () => WASH_PHASES.indexOf(S.phase) >= 0;
  const drying = () => DRY_PHASES.indexOf(S.phase) >= 0;

  function loadById(id) { return find(LOADS, id) || LOADS[0]; }

  function resetLoad() {
    const L = loadById(S.load);
    S.dirt = L.dirt;
    S.clean = 0;
    S.care = 1;
    S.residue = 0;
    S.wetness = 0.52;
    S.moisture = 0.52;
    S.washDone = false;
    S.dryDone = false;
    S.washStars = 0;
    S.dryStars = 0;
    S.washReason = '';
    S.dryReason = '';
    S.washEnergy = 0;
    S.dryEnergy = 0;
    S.phase = 'idle';
    S.phaseT = 0;
    S.progress = 0;
    S.cycleT = 0;
    S.bubbles = 0;
    S.heatLevel = 0;
    S.washPlan = null;
  }

  /* ─────────── what the settings will do ─────────── */
  function planWash() {
    const L = loadById(S.load);
    const P = PROGRAMS[S.program];
    const D = DETERGENTS[S.detergent];

    /* a wool programme is gentler AND better at lifting dirt from wool */
    const woolBonus = (S.load === 'wool' && S.program === 'wool') ? 1.15 : 1;
    const power = clamp(P.power * TEMP_F[S.temp] * D.factor * woolBonus, 0, 1.1);
    const clean = clamp(1 - L.dirt * (1 - clamp(power, 0, 1)), 0, 1);

    let care = 1;
    if (S.temp > L.tempMax) care -= (S.temp - L.tempMax) * 0.02;
    if (S.spin > L.spinMax) care -= 0.25;
    if (S.detergent === 'high') care -= 0.06;
    if (S.load === 'wool' && S.program === 'cotton') care -= 0.12;
    care = clamp(care, 0, 1);

    const energy = P.water * (0.5 + S.temp / 60) + (S.spin / 1400) * 3;

    return {
      clean,
      care,
      energy,
      wetness: SPIN_WET[S.spin],
      residue: D.residue
    };
  }

  /* ─────────── result cards ─────────── */
  function rateWash() {
    const L = loadById(S.load);

    let stars = 0;
    if (S.clean >= 0.85 && S.care >= 0.55) stars = 1;
    if (stars === 1 && S.care >= 0.85) stars = 2;
    if (stars === 2 && S.washEnergy <= L.washBudget &&
        S.detergent !== 'high' && S.residue < 0.05) stars = 3;
    S.washStars = stars;

    if (S.clean < 0.85) S.washReason = 'washDirty';
    else if (S.care < 0.55) S.washReason = 'washDamage';
    else if (stars < 2) S.washReason = 'washCare';
    else if (stars < 3) S.washReason = 'washWaste';
    else S.washReason = 'washPerfect';
  }

  function rateDry() {
    const L = loadById(S.load);
    const target = DRYNESS[S.dryness];
    const washCare = S.care;

    let care = S.care;
    if (S.heat === 'high' && L.heatMax === 'low') care -= 0.30;
    if (S.moisture < 0.018) care -= 0.12;
    if (S.moisture < 0.008) care -= 0.08;
    care = clamp(care, 0, 1);
    S.care = care;

    let stars = 0;
    if (S.moisture <= target + 0.006) stars = 1;
    if (stars === 1 && care >= 0.85 && S.moisture >= 0.018) stars = 2;
    if (stars === 2 && S.dryEnergy <= L.dryBudget && S.dryProgram === 'sensor') stars = 3;
    S.dryStars = stars;

    if (S.moisture > target + 0.006) S.dryReason = 'dryDamp';
    else if (care < 0.55) S.dryReason = 'dryDamage';
    else if (care < 0.85 && S.heat === 'high' && L.heatMax === 'low') S.dryReason = 'dryDamage';
    else if (care < washCare - 0.01) S.dryReason = 'dryOver';
    else if (stars < 2) S.dryReason = 'dryCare';
    else if (stars < 3) S.dryReason = 'dryWaste';
    else S.dryReason = 'dryPerfect';
  }

  /* ─────────── start / stop ─────────── */
  function startWash() {
    const L = loadById(S.load);
    const P = PROGRAMS[S.program];

    S.washPlan = planWash();
    S.phase = 'fill';
    S.phaseT = 0;
    S.progress = 0;
    S.cycleT = 0;
    S.washDone = false;
    S.washStars = 0;
    S.washReason = '';
    S.washEnergy = 0;
    S.dirt = L.dirt;
    S.clean = 0;
    S.care = 1;
    S.residue = 0;
    S.bubbles = DETERGENTS[S.detergent].foam * 0.35;
    S.totalWash = PHASES.fill + P.len + PHASES.drain + PHASES.rinse + PHASES.spin;
  }

  function startDry() {
    if (S.moisture <= 0.001) S.moisture = 0.52;
    S.phase = 'heat';
    S.phaseT = 0;
    S.progress = 0;
    S.dryDone = false;
    S.dryStars = 0;
    S.dryReason = '';
    S.dryEnergy = 0;
    S.dryStart = Math.max(S.moisture, DRYNESS[S.dryness] + 0.02);
  }

  /* ─────────── actions ─────────── */
  const ACTIONS = {
    tab(el) {
      const m = el && el.dataset ? el.dataset.tab : null;
      if (m !== 'wash' && m !== 'dry') return { sound: 'deny' };
      S.tab = m;
      return { sound: 'blip' };
    },

    set(el) {
      const key = el && el.dataset ? el.dataset.key : null;
      const value = el && el.dataset ? el.dataset.value : null;
      if (!key || value == null) return { sound: 'deny' };

      /* settings stay fixed while a machine is running */
      if (key === 'dryProgram' || key === 'dryness' || key === 'heat') {
        if (drying()) return { sound: 'deny' };
      } else if (running()) {
        return { sound: 'deny' };
      }

      if (key === 'load') {
        if (!find(LOADS, value)) return { sound: 'deny' };
        S.load = value;
        resetLoad();
        return { sound: 'blip' };
      }
      if (key === 'program') {
        if (!PROGRAMS[value]) return { sound: 'deny' };
        S.program = value;
      } else if (key === 'detergent') {
        if (!DETERGENTS[value]) return { sound: 'deny' };
        S.detergent = value;
      } else if (key === 'temp') {
        const n = +value;
        if (TEMPS.indexOf(n) < 0) return { sound: 'deny' };
        S.temp = n;
      } else if (key === 'spin') {
        const n = +value;
        if (SPINS.indexOf(n) < 0) return { sound: 'deny' };
        S.spin = n;
      } else if (key === 'dryProgram') {
        if (!DRY_PROGRAMS[value]) return { sound: 'deny' };
        S.dryProgram = value;
      } else if (key === 'dryness') {
        if (!DRYNESS[value]) return { sound: 'deny' };
        S.dryness = value;
      } else if (key === 'heat') {
        if (!HEATS[value]) return { sound: 'deny' };
        S.heat = value;
      } else {
        return { sound: 'deny' };
      }
      return { sound: 'beep' };
    },

    start() {
      if (running()) return { sound: 'deny' };
      if (S.tab === 'wash') startWash();
      else startDry();
      return { sound: 'powerOn' };
    },

    stop() {
      if (!running()) return { sound: 'deny' };
      S.phase = 'idle';
      S.phaseT = 0;
      S.progress = 0;
      S.heatLevel = 0;
      S.bubbles = 0;
      return { sound: 'powerOff' };
    },

    next() {
      if (washing()) return { sound: 'deny' };
      S.tab = 'dry';
      return { sound: 'blip' };
    },

    again() {
      if (running()) return { sound: 'deny' };
      resetLoad();
      return { sound: 'chime' };
    }
  };

  function press(action, el) {
    const fn = ACTIONS[action];
    if (!fn) return null;
    return fn(el) || { sound: 'blip' };
  }

  /* ─────────── the wash cycle ─────────── */
  function tickWash(dt) {
    const P = PROGRAMS[S.program];
    const plan = S.washPlan;

    S.cycleT += dt;
    S.washEnergy = plan.energy * clamp(S.cycleT / S.totalWash, 0, 1);

    if (S.phase === 'fill') {
      S.phaseT += dt;
      S.progress = clamp(S.phaseT / PHASES.fill, 0, 1);
      if (S.phaseT >= PHASES.fill) { S.phase = 'wash'; S.phaseT = 0; S.progress = 0; }
    } else if (S.phase === 'wash') {
      S.phaseT += dt;
      S.progress = clamp(S.phaseT / P.len, 0, 1);
      S.clean = plan.clean * S.progress;
      S.dirt = Math.max(0, loadById(S.load).dirt * (1 - S.clean));
      S.residue = plan.residue;
      if (S.phaseT >= P.len) { S.phase = 'drain'; S.phaseT = 0; S.progress = 0; }
    } else if (S.phase === 'drain') {
      S.phaseT += dt;
      S.progress = clamp(S.phaseT / PHASES.drain, 0, 1);
      if (S.phaseT >= PHASES.drain) { S.phase = 'rinse'; S.phaseT = 0; S.progress = 0; }
    } else if (S.phase === 'rinse') {
      S.phaseT += dt;
      S.progress = clamp(S.phaseT / PHASES.rinse, 0, 1);
      S.residue = plan.residue * (1 - 0.7 * S.progress);
      if (S.phaseT >= PHASES.rinse) { S.phase = 'spin'; S.phaseT = 0; S.progress = 0; }
    } else if (S.phase === 'spin') {
      S.phaseT += dt;
      S.progress = clamp(S.phaseT / PHASES.spin, 0, 1);
      S.wetness = 0.95 - (0.95 - plan.wetness) * S.progress;
      S.residue = plan.residue * 0.3;
      if (S.phaseT >= PHASES.spin) {
        S.clean = plan.clean;
        S.care = plan.care;
        S.wetness = plan.wetness;
        S.moisture = plan.wetness;
        S.residue = plan.residue * 0.3;
        S.washEnergy = plan.energy;
        S.dirt = Math.max(0, loadById(S.load).dirt * (1 - S.clean));
        S.phase = 'done';
        S.phaseT = 0;
        S.progress = 1;
        S.washDone = true;
        S.dryDone = false;
        S.dryStars = 0;
        S.dryReason = '';
        rateWash();
      }
    }
  }

  /* ─────────── the dry cycle ─────────── */
  function tickDry(dt) {
    const target = DRYNESS[S.dryness];
    const heat = HEATS[S.heat];

    if (S.phase === 'heat') {
      S.phaseT += dt;
      S.progress = clamp(S.phaseT / PHASES.heat, 0, 1) * 0.1;
      if (S.phaseT >= PHASES.heat) { S.phase = 'dry'; S.phaseT = 0; S.progress = 0; }
    } else if (S.phase === 'dry') {
      S.phaseT += dt;

      /* the water leaves faster when there is more of it, and high heat pulls harder */
      S.moisture = Math.max(0, S.moisture - heat.rate * (0.3 + S.moisture * 1.4) * dt);
      S.dryEnergy += heat.power * dt;

      if (S.dryProgram === 'sensor') {
        const span = Math.max(0.02, S.dryStart - target);
        S.progress = clamp(1 - (S.moisture - target) / span, 0, 1);
      } else {
        S.progress = clamp(S.phaseT / DRY_PROGRAMS.timed.len, 0, 1);
      }

      const sensorDone = S.dryProgram === 'sensor' && S.moisture <= target;
      const timedDone = S.dryProgram === 'timed' && S.phaseT >= DRY_PROGRAMS.timed.len;
      if (sensorDone || timedDone) {
        S.phase = 'cool';
        S.phaseT = 0;
        S.progress = 1;
      }
    } else if (S.phase === 'cool') {
      S.phaseT += dt;
      if (S.phaseT >= PHASES.cool) {
        S.phase = 'done';
        S.phaseT = 0;
        S.progress = 1;
        S.wetness = S.moisture;
        S.dryDone = true;
        rateDry();
      }
    }
  }

  /* ─────────── tick ─────────── */
  function tick(dt) {
    dt = Math.min(dt, 0.08);

    /* foam and heat ease in and out whether or not a cycle is running */
    const foamTarget = (S.phase === 'wash' || S.phase === 'rinse')
      ? DETERGENTS[S.detergent].foam : 0;
    S.bubbles += (foamTarget - S.bubbles) * 2.0 * dt;

    const heatTarget = S.phase === 'dry' ? (S.heat === 'high' ? 1 : 0.55)
      : S.phase === 'heat' ? 0.85 : 0;
    S.heatLevel += (heatTarget - S.heatLevel) * 2.2 * dt;

    if (washing()) tickWash(dt);
    else if (drying()) tickDry(dt);

    return S;
  }

  return {
    get s() { return S; },
    press, tick,
    fresh: () => { S = fresh(); return S; },
    isRunning: running,
    isWashing: washing,
    isDrying: drying,
    loadById,
    LOADS, PROGRAMS, PROG_ORDER,
    TEMPS, TEMP_F, SPINS, SPIN_WET,
    DETERGENTS, DET_ORDER,
    DRY_PROGRAMS, DRY_PROG_ORDER,
    DRYNESS, DRYNESS_ORDER,
    HEATS, HEAT_ORDER,
    PHASES, WASH_PHASES, DRY_PHASES,
    clamp
  };
})();
