/* ═══════════════════════════════════════════
   breath/js/state.js — breathing + circulation
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  /* how much oxygen the body is asking for, and whether the air is thin */
  const SCENARIOS = {
    sleep: { demand: 0.04, alt: 0 },
    rest:  { demand: 0.14, alt: 0 },
    walk:  { demand: 0.45, alt: 0 },
    run:   { demand: 0.92, alt: 0 },
    alt:   { demand: 0.58, alt: 1 }
  };

  /* guided breathing patterns. 'auto' just follows the scenario above. */
  const PATTERNS = {
    auto:  null,
    box:   { phases: [['in', 4], ['hold', 4], ['out', 4], ['rest', 4]] },
    relax: { phases: [['in', 4], ['hold', 7], ['out', 8]] },
    fast:  { phases: [['in', 1], ['out', 1]] }
  };

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  /* ease so the lungs fill and empty the way real ones do, not linearly */
  const ease = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  function fresh() {
    return {
      scenario: 'rest',
      demand: 0.14,          // smoothed
      alt: 0,                // 0..1 thin-air factor (smoothed)
      o2Avail: 1,            // 1 = sea level, 0.74 = high altitude

      /* guided breathing */
      pattern: 'auto',
      pacerT: 0,
      pacerRounds: 0,        // full guided rounds completed, for the sticker book
      pacerPhase: 'in',
      pacerLeft: 4,
      pacerProg: 0,
      pacerVol: 0.35,
      pacerCue: '',
      pacerIdx: -1,

      breathing: true,
      holding: false,
      holdT: 0,
      phase: 0,              // breath cycle, 2π per breath
      lungVol: 0.35,
      deep: 0,               // extra-deep breath that fades

      breathsPerMin: 14,
      heartRate: 70,

      spo2: 98,
      co2: 40,
      urge: 0,

      beatPhase: 0,
      beats: 0,
      breaths: 0,

      /* these are refreshed every tick, but seed them so a render that
         happens before the first tick still draws something sane */
      inhaling: false,
      loopSpeed: 0.07,
      redness: 1,
      breathCue: '',
      didBeat: false,
      forcedGasp: false,

      msg: '', msgT: 0, msgGood: true,
      saying: '', sayingT: 0,
      lowO2Warned: false,
      cells: null
    };
  }

  let S = fresh();

  function say(key, good) { S.msg = key; S.msgT = 3.6; S.msgGood = good !== false; }
  function speak(key) { S.saying = key; S.sayingT = 2.6; }

  /* ─────────── actions ─────────── */
  const ACTIONS = {
    scenario(el) {
      const id = el && el.dataset ? el.dataset.scenario : null;
      if (!SCENARIOS[id]) return { sound: 'blip' };
      S.scenario = id;
      const k = 'msg' + id.charAt(0).toUpperCase() + id.slice(1);
      say(k);
      speak('say' + id.charAt(0).toUpperCase() + id.slice(1));
      return { sound: id === 'run' ? 'alarm' : 'blip' };
    },

    pattern(el) {
      const id = el && el.dataset ? el.dataset.pattern : null;
      if (!PATTERNS.hasOwnProperty(id)) return { sound: 'deny' };
      S.pattern = id;
      S.pacerT = 0;
      S.pacerCue = '';
      say(id === 'auto' ? 'paceOff' : 'msg' + id.charAt(0).toUpperCase() + id.slice(1));
      return { sound: 'blip' };
    },

    breathe() {
      if (S.holding) return { sound: 'warn' };
      S.deep = 1;
      S.phase = Math.PI * 1.5;          // jump to the start of an inhale
      S.breaths++;
      say('msgBreathe');
      return { sound: 'breatheIn' };
    },

    hold() {
      if (S.pattern !== 'auto') return { sound: 'deny', say: 'paceOff' };
      if (S.holding) {
        S.holding = false;
        S.holdT = 0;
        S.deep = 0.7;
        S.phase = Math.PI * 1.5;
        say('msgRecovered');
        return { sound: 'gasp' };
      }
      S.holding = true;
      S.holdT = 0;
      say('msgHold');
      speak('sayHold');
      return { sound: 'breatheOut' };
    }
  };

  function press(action, el) {
    const fn = ACTIONS[action];
    if (!fn) return null;
    const res = fn(el) || { sound: 'blip' };
    return res;
  }

  /* ─────────── tick ─────────── */
  let breatheSound = 0;

  function tick(dt) {
    dt = Math.min(dt, 0.08);
    const sc = SCENARIOS[S.scenario] || SCENARIOS.rest;

    /* ── the body eases toward the scenario ── */
    S.demand += (sc.demand - S.demand) * 1.1 * dt;
    S.alt += (sc.alt - S.alt) * 0.8 * dt;
    S.o2Avail = 1 - S.alt * 0.26;             // thin air = ~74 % of the oxygen

    /* ── how fast the heart and lungs should run ── */
    /* a slow guided pattern calms the heart, fast panting winds it up */
    const paceHR = S.pattern === 'fast' ? 18 : S.pattern === 'relax' ? -9 : S.pattern === 'box' ? -6 : 0;
    const hrTarget = 58 + S.demand * 118 + S.alt * 16 + paceHR + (S.holding ? 10 + S.urge * 22 : 0);
    S.heartRate += (hrTarget - S.heartRate) * 0.55 * dt;

    const brTarget = 10 + S.demand * 30 + S.alt * 12 + (S.spo2 < 94 ? (94 - S.spo2) * 1.2 : 0);
    S.breathsPerMin += (brTarget - S.breathsPerMin) * 0.7 * dt;

    /* ── the breath cycle ── */
    S.deep = Math.max(0, S.deep - dt * 0.55);
    const amplitude = 0.55 + S.deep * 0.45;

    const P = PATTERNS[S.pattern];
    if (P) {
      /* a guided pattern drives the breath exactly */
      const total = P.phases.reduce((a, p) => a + p[1], 0);
      S.pacerT += dt;
      if (S.pacerT >= total) { S.pacerT -= total; S.pacerRounds++; }

      let acc = 0, ph = P.phases[0], idx = 0;
      for (let i = 0; i < P.phases.length; i++) {
        if (S.pacerT < acc + P.phases[i][1]) { ph = P.phases[i]; idx = i; break; }
        acc += P.phases[i][1];
      }
      const wasCue = S.pacerCue;
      S.pacerPhase = ph[0];
      S.pacerLeft = acc + ph[1] - S.pacerT;
      S.pacerProg = clamp((S.pacerT - acc) / ph[1], 0, 1);
      S.pacerCue = (S.pacerProg < 0.06 || idx !== S.pacerIdx) ? ph[0] : '';
      S.pacerIdx = idx;

      const FULL = 0.92, EMPTY = 0.20;
      if (ph[0] === 'in') S.pacerVol = EMPTY + (FULL - EMPTY) * ease(S.pacerProg);
      else if (ph[0] === 'out') S.pacerVol = FULL - (FULL - EMPTY) * ease(S.pacerProg);
      else S.pacerVol = idx === 0 ? EMPTY : FULL;

      S.lungVol = S.pacerVol;
      S.breathsPerMin = 60 / total;
      S.phase = (S.pacerT / total) * Math.PI * 2;
      S.holding = false;
    } else if (S.holding) {
      S.holdT += dt;
      S.lungVol += (0.85 - S.lungVol) * 2.0 * dt;
      S.pacerVol = S.lungVol;
      S.pacerCue = '';
    } else {
      S.phase += (S.breathsPerMin / 60) * Math.PI * 2 * dt;
      if (S.phase > Math.PI * 2) { S.phase -= Math.PI * 2; S.breaths++; }
      const inhale = Math.sin(S.phase - Math.PI / 2);      // -1 exhaled … +1 inhaled
      S.lungVol = 0.22 + ((inhale + 1) / 2) * amplitude * 0.78;
      S.pacerVol = S.lungVol;
      S.pacerCue = '';
    }

    /* how much fresh air is arriving right now */
    const inflow = S.holding ? 0 : Math.max(0, Math.sin(S.phase)) * amplitude;

    /* ── oxygen in the blood ── */
    const target = 99 * (0.62 + 0.38 * S.o2Avail) - S.demand * 2.6;
    if (S.holding) {
      S.spo2 -= (0.45 + S.demand * 1.15) * dt;
    } else {
      const k = 0.12 + inflow * 2.2;
      S.spo2 += (target - S.spo2) * k * dt;
    }
    S.spo2 = clamp(S.spo2, 52, 100);

    /* ── carbon dioxide ──
       The body makes it all the time; you blow it off in proportion to how
       much you ventilate (rate x depth). Holding your breath stops the
       blow-off, so it climbs until the body insists on a breath. */
    const drive = S.holding ? 0 : (S.breathsPerMin / 14) * (0.55 + amplitude * 0.65);
    const made = 0.55 + S.demand * 1.9;
    S.co2 += (made - Math.max(0, S.co2 - 36) * drive * 0.30) * dt;
    S.co2 = clamp(S.co2, 34, 62);

    /* ── the urge to breathe comes from CO2 and from holding on ── */
    S.urge = clamp((S.co2 - 44) / 16 + S.holdT / 50, 0, 1);

    /* ── the body will not let you hold forever ── */
    if (S.holding && (S.urge > 0.97 || S.spo2 < 84)) {
      S.holding = false;
      S.holdT = 0;
      S.deep = 1;
      S.phase = Math.PI * 1.5;
      say('msgGasp', false);
      speak('sayGasp');
      S.forcedGasp = true;
    }

    /* low-oxygen nudge */
    if (S.spo2 < 92 && !S.lowO2Warned) { S.lowO2Warned = true; say('msgLowO2', false); }
    if (S.spo2 > 96) S.lowO2Warned = false;

    /* ── heartbeat ── */
    S.beatPhase += (S.heartRate / 60) * dt;
    if (S.beatPhase >= 1) {
      S.beatPhase -= 1;
      S.beats++;
      S.didBeat = true;
    } else {
      S.didBeat = false;
    }

    /* ── breath whoosh, once per half cycle ── */
    if (!S.holding) {
      const inh = Math.sin(S.phase) > 0;
      if (breatheSound !== (inh ? 1 : 0)) {
        breatheSound = inh ? 1 : 0;
        S.breathCue = inh ? 'in' : 'out';
      } else {
        S.breathCue = '';
      }
    } else {
      S.breathCue = '';
    }

    /* ── timers ── */
    if (S.msgT > 0) S.msgT = Math.max(0, S.msgT - dt);
    if (S.sayingT > 0) S.sayingT = Math.max(0, S.sayingT - dt);

    /* ── derived for the renderer ── */
    S.inhaling = !S.holding && Math.sin(S.phase) > 0;
    S.loopSpeed = 0.055 + ((S.heartRate - 60) / 110) * 0.11;   // circuits per second
    S.redness = clamp((S.spo2 - 70) / 28, 0.25, 1);

    return S;
  }

  return {
    get s() { return S; },
    press, tick,
    fresh: () => { S = fresh(); breatheSound = 0; return S; },
    PATTERNS, clamp
  };
})();
