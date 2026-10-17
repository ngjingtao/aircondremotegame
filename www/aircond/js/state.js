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

      /* ── mission ── */
      mission: -1,          // -1 = free play / challenge
      missionT: 0,          // seconds left
      missionLen: 0,
      missionIn: 0,         // seconds spent comfortable
      missionFirstOk: -1,   // when he first got comfortable, in seconds
      missionSlips: 0,      // times he fell back out of the comfort zone
      eventIndex: 0,        // how far through the mission's event schedule we are
      energyWh: 0,
      stars: 0,
      result: null,         // 'win' | 'lose' | null
      failReason: '',
      toastId: 0,

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

  /* ─────────── weather events ───────────
     Each event saves what it is about to change and puts it back afterwards.
     They used to restore hard-coded defaults (33 °C, 62 % humidity), which is
     right in challenge mode but wrong the moment a mission changes the weather
     — a cold snap in the winter mission used to "end" by turning it into a
     33 °C summer afternoon. */
  const EVENTS = [
    {
      id: 'heatwave', key: 'eventHeatwave', dur: 18,
      apply() {
        this._prev = { outdoorTemp: S.outdoorTemp, humBase: S.humBase };
        S.outdoorTemp = 42; S.humBase = 82; S.humidity = Math.min(96, S.humidity + 12);
      },
      undo() {
        if (this._prev) { S.outdoorTemp = this._prev.outdoorTemp; S.humBase = this._prev.humBase; }
      }
    },
    {
      id: 'coldsnap', key: 'eventColdSnap', dur: 16,
      apply() {
        this._prev = { outdoorTemp: S.outdoorTemp, humBase: S.humBase };
        S.outdoorTemp = 18; S.humBase = 58;
      },
      undo() {
        if (this._prev) { S.outdoorTemp = this._prev.outdoorTemp; S.humBase = this._prev.humBase; }
      }
    },
    {
      id: 'door', key: 'eventDoor', dur: 12,
      apply() { S.doorOpen = true; },
      undo() { S.doorOpen = false; }
    },
    {
      id: 'humid', key: 'eventHumid', dur: 20,
      apply() {
        this._prev = { humBase: S.humBase };
        S.humBase = 88; S.humidity = Math.min(96, S.humidity + 20);
      },
      undo() { if (this._prev) S.humBase = this._prev.humBase; }
    }
  ];

  /* ─────────── missions ───────────
     Same thermal model, but with a goal, a clock and a price.

     The star rules are deliberately in tension: getting him comfortable FAST
     means turbo and a high fan, which burns energy — so three stars means
     finding the balance rather than just blasting the cold. */
  const MISSIONS = [
    { key: 'mSpring', day: 'daySpring', weather: 'mild',
      len: 90, outdoor: 29, humBase: 52, clock: 14, start: 31, setStart: 26,
      energy: 20, events: [] },
    { key: 'mSummer', day: 'daySummer', weather: 'heat',
      len: 120, outdoor: 38, humBase: 80, clock: 15, start: 34, setStart: 27,
      energy: 46,
      /* a designed sequence, not dice: a heatwave early, the door at the
         halfway mark, then a humidity surge to finish on */
      events: [ { at: 28, id: 'heatwave' }, { at: 62, id: 'door' }, { at: 94, id: 'humid' } ] },
    { key: 'mWinter', day: 'dayWinter', weather: 'cold',
      len: 120, outdoor: 11, humBase: 56, clock: 18, start: 12, setStart: 22,
      energy: 54,
      events: [ { at: 34, id: 'coldsnap' }, { at: 76, id: 'door' } ] }
  ];

  const STORE_STARS = n => 'arg.stars.' + n;

  function bestStars(n) { return Number(ARG.store.get(STORE_STARS(n)) || 0); }

  /* the mission you are allowed to start is the first one you have not aced */
  function unlocked() {
    for (let i = 0; i < MISSIONS.length; i++) if (bestStars(i) < 3) return i;
    return MISSIONS.length - 1;
  }

  function startMission(n) {
    n = clamp(Math.floor(n) || 0, 0, MISSIONS.length - 1);
    const m = MISSIONS[n];
    const keep = { best: S.best, score: S.score, challenge: S.challenge };
    S = fresh();
    S.best = keep.best; S.score = keep.score; S.challenge = keep.challenge;

    S.mission = n;
    S.missionLen = m.len;
    S.missionT = m.len;
    S.outdoorTemp = m.outdoor;
    S.humBase = m.humBase;
    S.clockH = m.clock;
    S.setTemp = m.setStart;
    S.roomTemp = m.start;
    S.humidity = clamp(m.humBase + 6, 20, 98);
    S.energyWh = 0;

    /* a mission starts with the room shut and the machine ready */
    S.doorOpen = false;
    S.power = true;
    S.mode = m.weather === 'cold' ? 'HEAT' : 'COOL';
    S.event = null; S.eventLeft = 0; S.eventIndex = 0;
    return S;
  }

  function leaveMission() {
    const keep = { best: S.best, score: S.score, challenge: S.challenge };
    S = fresh();
    S.best = keep.best; S.score = keep.score; S.challenge = keep.challenge;
    return S;
  }

  /* the price of comfort, in watts, right now */
  function powerNow() {
    if (!S.power) return 0;
    if (S.selfClean > 0) return 30;
    if (S.mode === 'FAN') return 60;
    /* the compressor works harder the further the room is from the set point */
    const gap = Math.abs(S.roomTemp - S.setTemp);
    let w = 620 + Math.min(680, gap * 90);
    if (S.fan === 'HIGH') w *= 1.25;
    else if (S.fan === 'LOW') w *= 0.85;
    if (S.turbo === 'TURBO') w *= 1.45;
    else if (S.turbo === 'QUIET') w *= 0.75;
    if (S.eco) w *= 0.72;
    if (S.mode === 'HEAT') w *= 1.15;
    return Math.round(w);
  }

  /* why it went wrong — the screen has to be able to say, in one line */
  function failReason() {
    if (!S.power) return 'failPower';
    if (S.doorOpen) return 'failDoor';
    if (S.mode === 'FAN') return 'failFan';
    if (S.setTemp >= 28) return 'failSetHigh';
    if (S.setTemp <= 19) return 'failSetLow';
    if (S.mood === 'hot' || S.mood === 'veryhot') return 'failNotEnough';
    if (S.mood === 'cold' || S.mood === 'freezing') return 'failTooMuch';
    return 'failTime';
  }

  /* 1 star for finishing with him comfortable, +1 for never letting him slip
     back out once you had him there, +1 for doing it without burning through
     the power.

     The second star is what makes it a game rather than a thermostat: holding
     a room steady through a heatwave and a door left open takes attention.
     And it is in direct tension with the third — the easy way to never slip is
     to run the machine hard, which is exactly what costs you the energy star. */
  function rateMission() {
    const m = MISSIONS[S.mission];
    if (!m || S.mood !== 'ok') return 0;
    let stars = 1;
    if (S.missionSlips === 0) stars++;
    if (S.energyWh <= m.energy) stars++;
    return stars;
  }

  let onEvent = null;      // callback(event | null)
  let onScore = null;      // callback('recover'|'slip'|'weather', combo)
  let onClockHour = null;
  let onMission = null;    // callback(result, stars, reason)

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

    /* what it is costing, right now */
    S.energyWh += powerNow() * dt / 3600;

    /* mood */
    S.feelsLike = feelsLike();
    const prevMood = S.mood;
    S.mood = moodFor(S.feelsLike);

    /* ── weather events ──
       In challenge they are random, because that mode is meant to be endless
       and varied. In a MISSION they run on a fixed schedule.

       Two reasons. A two-minute challenge with a designed sequence of problems
       is a better game than random noise — the child can learn "the door goes
       at about the halfway mark". And a random mission makes the outcome
       unreproducible, which made the test suite flaky: the same play could win
       or lose depending on the dice. */
    const inMission = S.mission >= 0;

    if (S.event) {
      S.eventLeft -= dt;
      if (S.eventLeft <= 0) {
        S.event.undo();
        S.event = null;
        S.eventJustEnded = true;
        if (onEvent) onEvent(null);
      }
    }

    if (inMission && !S.result) {
      const next = MISSIONS[S.mission].events[S.eventIndex];
      if (next && (S.missionLen - S.missionT) >= next.at) {
        S.eventIndex++;
        /* a scheduled event always fires, replacing whatever is running */
        if (S.event) { S.event.undo(); S.event = null; }
        const ev = EVENTS.find(e => e.id === next.id);
        if (ev) {
          ev.apply();
          S.event = ev;
          S.eventLeft = next.dur || ev.dur;
          if (onEvent) onEvent(ev);
        }
      }
    } else if (S.challenge && !S.event) {
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

    /* ── the mission clock ── */
    if (S.mission >= 0 && !S.result) {
      S.missionT = Math.max(0, S.missionT - dt);
      if (S.mood === 'ok') {
        S.missionIn += dt;
        if (S.missionFirstOk < 0) S.missionFirstOk = S.missionLen - S.missionT;
      } else if (prevMood === 'ok' && S.missionFirstOk >= 0) {
        /* he was comfortable and he is not any more — that costs the second star */
        S.missionSlips++;
      }
      if (S.missionT <= 0) {
        S.stars = rateMission();
        S.result = S.stars > 0 ? 'win' : 'lose';
        S.failReason = S.result === 'lose' ? failReason() : '';
        if (S.stars > bestStars(S.mission)) ARG.store.set(STORE_STARS(S.mission), String(S.stars));
        if (onMission) onMission(S.result, S.stars, S.failReason);
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
    setMissionHook: fn => { onMission = fn; },
    startMission, leaveMission, bestStars, unlocked,
    MODES, FANS, TURBO, MODE_ICON, HOUR_SECONDS,
    MISSIONS, EVENTS, powerNow, rateNow: rateMission,
    feelsLike, moodFor, clamp
  };
})();
