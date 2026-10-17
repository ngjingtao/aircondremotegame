/* ═══════════════════════════════════════════
   state.js — air-con + room simulation
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  const MODES = ['COOL', 'DRY', 'HEAT', 'FAN'];
  const FANS = ['AUTO', 'LOW', 'MED', 'HIGH'];
  const TURBO = ['OFF', 'TURBO', 'QUIET'];

  /* crossing the mode button cycles through EVERY mode, so nothing is unreachable;
     the DRY key still jumps straight there */
  const CYCLE = ['COOL', 'DRY', 'HEAT', 'FAN'];

  const HOUR_SECONDS = 15;   // 1 in-game hour = 15 real seconds

  function fresh() {
    return {
      /* ── remote settings ── */
      power: true,
      mode: 'COOL',
      setTemp: 26,
      fan: 'AUTO',
      swingV: true,
      swingH: false,
      turbo: 'OFF',
      health: false,
      sleep: false,
      eco: false,
      lock: false,
      light: true,
      timerOnH: 0,
      timerOffH: 0,
      timerArmed: false,
      timerOnLeft: 0,
      timerOffLeft: 0,
      selfClean: 0,

      /* ── environment ── */
      roomTemp: 28.8,
      outdoorTemp: 33.0,
      humidity: 72,
      humBase: 62,
      clockH: 14.0,

      /* ── game ── */
      challenge: false,
      score: 0,
      best: Number(ARG.store.get('arg.best') || 0),
      combo: 1,
      comboTimer: 0,
      rescues: 0,
      slips: 0,
      weatherSurvived: 0,
      lastGain: 0,
      gainT: 0,
      eventJustEnded: false,
      eventTimer: 16,
      event: null,
      eventLeft: 0,
      doorOpen: false,

      /* ── derived (updated by tick) ── */
      mood: 'hot',
      feelsLike: 31,
      lastAction: '',
      actionAt: 0
    };
  }

  let S = fresh();

  /* ─────────── helpers ─────────── */
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function feelsLike() {
    return S.roomTemp + (S.humidity - 55) * 0.03;
  }

  function moodFor(f) {
    if (f < 15.5) return 'freezing';
    if (f < 20.5) return 'cold';
    if (f <= 27.0) return 'ok';
    if (f <= 29.5) return 'hot';
    return 'veryhot';
  }

  /* ─────────── remote actions ─────────── */
  const ACTIONS = {

    power() {
      S.power = !S.power;
      if (!S.power) { S.selfClean = 0; }
      return { sound: S.power ? 'powerOn' : 'powerOff', say: S.power ? 'sayPowerOn' : 'sayPowerOff', signal: true };
    },

    mode(el) {
      const m = el.dataset.mode;
      if (m === 'DRY') {
        /* the DRY key goes straight to dry */
        S.mode = 'DRY';
      } else {
        /* the COOL key is the mode key: it steps through every mode, so HEAT
           and FAN are always reachable and nothing loops back on itself */
        const i = CYCLE.indexOf(S.mode);
        S.mode = CYCLE[(i + 1) % CYCLE.length];
      }
      if (!S.power) S.power = true;
      return { sound: 'beep', signal: true, msg: S.mode };
    },

    /* the door the weather forgot to shut */
    closedoor() {
      if (!S.doorOpen) return { sound: 'deny' };
      S.doorOpen = false;
      if (S.event && S.event.id === 'door') {
        S.event = null;
        S.eventLeft = 0;
        S.eventTimer = 14 + Math.random() * 10;
      }
      return { sound: 'air', say: 'sayDoorShut', toast: 'toastDoorShut' };
    },

    tempup() {
      S.setTemp = clamp(S.setTemp + 1, 16, 30);
      if (!S.power) S.power = true;
      return { sound: 'beep', signal: true };
    },

    tempdown() {
      S.setTemp = clamp(S.setTemp - 1, 16, 30);
      if (!S.power) S.power = true;
      return { sound: 'beep', signal: true };
    },

    fan() {
      S.fan = FANS[(FANS.indexOf(S.fan) + 1) % FANS.length];
      if (!S.power) S.power = true;
      return { sound: 'beep', signal: true, msg: S.fan };
    },

    swingv() {
      S.swingV = !S.swingV;
      return { sound: 'beep', signal: true };
    },

    swingh() {
      S.swingH = !S.swingH;
      return { sound: 'beep', signal: true };
    },

    turbo() {
      S.turbo = TURBO[(TURBO.indexOf(S.turbo) + 1) % TURBO.length];
      if (!S.power) S.power = true;
      const say = S.turbo === 'TURBO' ? 'sayTurbo' : S.turbo === 'QUIET' ? 'sayQuiet' : null;
      return { sound: 'beep', signal: true, say };
    },

    selfclean() {
      S.selfClean = 5;
      S.power = true;
      return { sound: 'clean', signal: true, say: 'saySelfClean' };
    },

    health() {
      S.health = !S.health;
      return { sound: 'beep', signal: true, say: S.health ? 'sayHealth' : null };
    },

    sleep() {
      S.sleep = !S.sleep;
      if (!S.power) S.power = true;
      return { sound: 'beep', signal: true, say: S.sleep ? 'saySleep' : null };
    },

    extra() {
      S.eco = !S.eco;
      return { sound: 'beep', signal: true, say: S.eco ? 'sayEco' : null };
    },

    timeon() {
      S.timerOnH = (S.timerOnH + 1) % 13;
      S.timerArmed = false;
      return { sound: 'beep', signal: true, msg: '⏰ON ' + S.timerOnH + 'h' };
    },

    timeoff() {
      S.timerOffH = (S.timerOffH + 1) % 13;
      S.timerArmed = false;
      return { sound: 'beep', signal: true, msg: '⏰OFF ' + S.timerOffH + 'h' };
    },

    confirm() {
      if (S.timerArmed) {
        S.timerArmed = false;
        S.timerOnLeft = S.timerOffLeft = 0;
        return { sound: 'beep', msg: '⏰ cancel' };
      }
      if (S.timerOnH === 0 && S.timerOffH === 0) {
        return { sound: 'deny', msg: '⏰ --' };
      }
      S.timerArmed = true;
      S.timerOnLeft = S.timerOnH;
      S.timerOffLeft = S.timerOffH;
      return { sound: 'chime', signal: true };
    },

    lock() {
      S.lock = !S.lock;
      return { sound: 'beep', say: S.lock ? 'sayLockOn' : 'sayLockOff', signal: false };
    },

    light() {
      S.light = !S.light;
      return { sound: 'beep', say: 'sayLight' };
    },

    reset() {
      const keepLangScore = { best: S.best, score: S.score, challenge: S.challenge };
      S = fresh();
      S.best = keepLangScore.best;
      S.score = keepLangScore.score;
      S.challenge = keepLangScore.challenge;
      return { sound: 'beep', say: 'sayReset', signal: true };
    }
  };

  function press(action, el) {
    if (S.lock && action !== 'lock') {
      return { sound: 'deny', locked: true };
    }
    const fn = ACTIONS[action];
    if (!fn) return null;
    S.lastAction = action;
    S.actionAt = performance.now();
    return fn(el) || { sound: 'beep' };
  }

  /* ─────────── weather events ─────────── */
  const EVENTS = [
    {
      id: 'heatwave', key: 'eventHeatwave', dur: 18,
      apply() { S.outdoorTemp = 42; S.humBase = 82; S.humidity = Math.min(96, S.humidity + 12); },
      undo() { S.outdoorTemp = 33; S.humBase = 62; }
    },
    {
      id: 'coldsnap', key: 'eventColdSnap', dur: 16,
      apply() { S.outdoorTemp = 18; S.humBase = 58; },
      undo() { S.outdoorTemp = 33; S.humBase = 62; }
    },
    {
      id: 'door', key: 'eventDoor', dur: 12,
      apply() { S.doorOpen = true; },
      undo() { S.doorOpen = false; }
    },
    {
      id: 'humid', key: 'eventHumid', dur: 20,
      apply() { S.humBase = 88; S.humidity = Math.min(96, S.humidity + 20); },
      undo() { S.humBase = 62; }
    }
  ];

  let onEvent = null;      // callback(event | null)
  let onScore = null;      // callback('recover'|'slip'|'weather', combo)
  let onClockHour = null;

  /* ─────────── main tick ─────────── */
  function tick(dt) {
    dt = Math.min(dt, 0.08);

    /* clock */
    const before = Math.floor(S.clockH);
    S.clockH = (S.clockH + dt / HOUR_SECONDS) % 24;
    if (Math.floor(S.clockH) !== before && onClockHour) onClockHour();

    /* self clean */
    if (S.selfClean > 0) S.selfClean = Math.max(0, S.selfClean - dt);

    /* timers */
    if (S.timerArmed) {
      if (S.timerOnLeft > 0) {
        S.timerOnLeft -= dt / HOUR_SECONDS;
        if (S.timerOnLeft <= 0) { S.timerOnLeft = 0; S.power = true; S.timerOnH = 0; }
      }
      if (S.timerOffLeft > 0) {
        S.timerOffLeft -= dt / HOUR_SECONDS;
        if (S.timerOffLeft <= 0) { S.timerOffLeft = 0; S.power = false; S.timerOffH = 0; }
      }
      if (S.timerOnLeft === 0 && S.timerOffLeft === 0) S.timerArmed = false;
    }

    const cooling = S.power && S.selfClean <= 0;

    /* heat exchange with outside */
    let leak = cooling ? 0.0045 : 0.010;
    if (S.doorOpen) leak *= 5;
    S.roomTemp += (S.outdoorTemp - S.roomTemp) * leak * dt;

    /* air-conditioning effect */
    if (cooling && S.mode !== 'FAN') {
      const fanMul = { AUTO: 0.9, LOW: 0.62, MED: 1.0, HIGH: 1.28 }[S.fan];
      const turboMul = S.turbo === 'TURBO' ? 1.6 : S.turbo === 'QUIET' ? 0.62 : 1;
      const ecoMul = S.eco ? 0.7 : 1;
      const base = S.mode === 'DRY' ? 0.030 : 0.055;
      const pull = base * fanMul * turboMul * ecoMul;

      let target = S.setTemp;
      if (S.sleep) target += 1.6;             // sleep mode lets the room creep up
      if (S.mode === 'DRY') target = Math.min(target, 26);
      target = clamp(target, 16, 30);

      /* a cooler only cools, a heater only heats */
      let delta = target - S.roomTemp;
      if (S.mode === 'HEAT') delta = Math.max(0, delta);
      else delta = Math.min(0, delta);

      /* the compressor has a hard ceiling — it cannot beat a wide-open door */
      const MAX_RATE = 0.11;                  // °C per second
      let rate = delta * pull * 1.6;
      rate = clamp(rate, -MAX_RATE, MAX_RATE);
      S.roomTemp += rate * dt;
    }

    /* fan-only mode still stirs the air slightly */
    if (cooling && S.mode === 'FAN') {
      S.roomTemp += (S.outdoorTemp - S.roomTemp) * 0.004 * dt;
    }

    /* humidity */
    let humTarget = S.humBase;
    if (S.doorOpen) humTarget = Math.min(96, humTarget + 22);
    if (cooling && S.mode === 'DRY') humTarget = 38;
    const humRate = (cooling && S.mode === 'DRY') ? 0.05 : 0.02;
    S.humidity += (humTarget - S.humidity) * humRate * dt;
    S.humidity = clamp(S.humidity, 20, 98);

    S.roomTemp = clamp(S.roomTemp, 5, 48);

    /* mood */
    S.feelsLike = feelsLike();
    const prevMood = S.mood;
    S.mood = moodFor(S.feelsLike);

    /* weather events (challenge only) */
    if (S.challenge) {
      if (S.event) {
        S.eventLeft -= dt;
        if (S.eventLeft <= 0) {
          S.event.undo();
          S.event = null;
          S.eventJustEnded = true;
          if (onEvent) onEvent(null);
        }
      } else {
        S.eventTimer -= dt;
        if (S.eventTimer <= 0) {
          const ev = EVENTS[Math.floor(Math.random() * EVENTS.length)];
          ev.apply();
          S.event = ev;
          S.eventLeft = ev.dur;
          S.eventTimer = 15 + Math.random() * 12;
          if (onEvent) onEvent(ev);
        }
      }
    }

    /* ── scoring ──
       Points come from RESULTS, not from sitting still. You score when he
       comes back into the comfort zone, and you score more for a longer run
       of rescues. Set a temperature and walk away and you get nothing. */
    if (S.challenge) {
      const recovered = prevMood !== 'ok' && S.mood === 'ok';
      const slipped = prevMood === 'ok' && S.mood !== 'ok';

      if (recovered) {
        S.combo = Math.min(5, S.combo + 1);
        S.score += 100 * S.combo;
        S.rescues++;
        S.lastGain = 100 * S.combo;
        S.gainT = 1.4;
        if (onScore) onScore('recover', S.combo);
      } else if (slipped) {
        S.combo = 1;
        S.slips++;
        if (onScore) onScore('slip', 0);
      }

      /* riding out a weather event without losing him pays a bonus */
      if (S.eventJustEnded) {
        S.eventJustEnded = false;
        if (S.mood === 'ok') {
          S.score += 150;
          S.weatherSurvived++;
          S.lastGain = 150;
          S.gainT = 1.8;
          if (onScore) onScore('weather', 0);
        }
      }

      if (S.gainT > 0) S.gainT = Math.max(0, S.gainT - dt);
      if (S.score > S.best) {
        S.best = S.score;
        ARG.store.set('arg.best', String(Math.floor(S.best)));
      }
    }

    return { moodChanged: prevMood !== S.mood, mood: S.mood };
  }

  /* ─────────── labels ─────────── */
  const MODE_ICON = { COOL: '❄', HEAT: '☀', DRY: '💧', FAN: '🌀' };

  return {
    get s() { return S; },
    press, tick, fresh: () => { S = fresh(); return S; },
    setEventHook: fn => { onEvent = fn; },
    setScoreHook: fn => { onScore = fn; },
    setHourHook: fn => { onClockHour = fn; },
    MODES, FANS, TURBO, MODE_ICON, HOUR_SECONDS,
    feelsLike, moodFor, clamp
  };
})();
