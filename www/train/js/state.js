/* ═══════════════════════════════════════════
   train/js/state.js — driving physics + route
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  /* ── the consist ── */
  const LOCO_LEN = 16;
  const COACH_LEN = 16;
  const COACHES = 2;
  const TRAIN_LEN = LOCO_LEN + COACH_LEN * COACHES;      // 48 m

  /* ── route ── */
  const CYCLE = 900;             // metres per repeating stretch
  const STATION_OFFSET = 250;
  const CROSSING_OFFSET = 620;
  const PLATFORM_LEN = 80;
  const MARK_AT = STATION_OFFSET + 40;                   // stop mark inside the platform
  const START_X = 150;

  /* ── physics ── */
  const MAX_KMH = 120;
  const MAX_MS = MAX_KMH / 3.6;
  const THROTTLE = [0, 25, 50, 75, 100];
  const BRAKE = [0, 25, 50, 75, 100, 130];               // last one is EMERGENCY

  const ACTIVATE_M = 300;        // crossing warns from this far out
  const CLEAR_M = 40;            // ... and clears this far past
  const CROSSING_LIMIT = 80;     // km/h — you must ease off over a crossing

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function fresh() {
    return {
      throttle: 0,
      brake: 1,                 // start with the brake applied
      speed: 0,                 // m/s
      x: START_X,               // metres (train nose)
      lights: 2,
      doors: false,
      hornT: 0,
      bellT: 0,

      score: 0,
      served: 0,
      servedStations: {},
      overshot: {},
      crossed: {},
      roughCrossings: 0,
      goodCrossings: 0,
      missed: 0,

      /* ── mission ── */
      mission: -1,
      misLen: 0,
      misT: 0,
      stars: 0,
      result: null,         // 'win' | 'lose' | null
      failReason: '',

      msg: '',
      msgT: 0,
      msgGood: true,

      stoppedFor: 0,
      lastStopResult: '',

      /* derived each tick */
      kmh: 0,
      nextIdx: 0,
      distToStation: 0,
      distToMark: 0,
      atPlatform: false,
      activeCrossings: [],
      gates: {},
      flashPhase: 0,
      dingNow: false,
      bellOn: false,
      overspeed: false
    };
  }

  let S = fresh();

  const stationX = n => n * CYCLE + STATION_OFFSET;
  const crossingX = n => n * CYCLE + CROSSING_OFFSET;

  function say(key, good) {
    S.msg = key;
    S.msgT = 3.4;
    S.msgGood = good !== false;
  }

  /* ─────────── driver actions ─────────── */
  const ACTIONS = {
    throttleUp() {
      if (S.doors) return { sound: 'warn', msg: 'msgDoorsOpen', good: false };
      if (S.throttle < THROTTLE.length - 1) {
        S.throttle++;
        if (S.brake > 0) S.brake = 0;               // power off the brake
        return { sound: 'notch', msg: S.throttle === 0 ? null : null, throttle: true };
      }
      return { sound: 'notch' };
    },
    throttleDown() {
      if (S.throttle > 0) { S.throttle--; return { sound: 'notch' }; }
      return { sound: 'notch' };
    },
    brakeUp() {
      if (S.brake < BRAKE.length - 1) {
        S.brake++;
        if (S.brake > 0) S.throttle = 0;            // brake takes over from power
        if (S.brake === BRAKE.length - 1) return { sound: 'squeal', msg: 'msgEmergency', good: false };
        return { sound: 'notch' };
      }
      return { sound: 'warn' };
    },
    brakeDown() {
      if (S.brake > 0) {
        S.brake--;
        if (S.brake === 0) return { sound: 'air' };
        return { sound: 'notch' };
      }
      return { sound: 'notch' };
    },
    horn() {
      S.hornT = 1.3;
      return { sound: 'horn', msg: 'msgHorn' };
    },
    bell() {
      S.bellT = 1.6;
      return { sound: 'ding', msg: 'msgBell' };
    },
    lights() {
      S.lights = (S.lights + 1) % 3;
      return { sound: 'notch', msg: S.lights === 0 ? 'msgLightsOff' : 'msgLightsOn' };
    },
    doors() {
      if (S.doors) {
        S.doors = false;
        return { sound: 'doorChime', msg: 'msgDoorsShut' };
      }
      if (!S.atPlatform || Math.abs(S.speed) > 0.35) {
        return { sound: 'warn', msg: 'msgDoorsNeedStop', good: false };
      }
      S.doors = true;
      return { sound: 'doorChime', msg: 'msgDoorsOpen' };
    }
  };

  let onCross = null;

  /* ─────────── missions ───────────
     A timetabled run. Get the passengers to N stations before the clock runs
     out, without running past a platform and without taking a level crossing
     too fast.

     The stars pull against each other exactly as they do in Play Aircond:
     hurrying is what makes you overshoot a platform and what makes a crossing
     rough, so three stars means driving it properly rather than quickly. */
  const MISSIONS = [
    { key: 'mMorning', len: 150, stops: 2 },
    { key: 'mRush',    len: 190, stops: 3 },
    { key: 'mNight',   len: 178, stops: 3 }
  ];

  const STORE_STARS = n => 'arg.trainStars.' + n;
  const BOOK = n => 'train-' + n;

  /* The sticker book is the one place a result lives. The old per-mission key
     is still read, so a player who earned stars before the book existed keeps
     them — but nothing writes it any more. */
  function bestStars(n) {
    const book = ARG.progress ? ARG.progress.starsOf(BOOK(n)) : 0;
    return Math.max(book, Number(ARG.store.get(STORE_STARS(n)) || 0));
  }

  /* the mission you are allowed to start is the first one you have not aced */
  function unlocked() {
    for (let i = 0; i < MISSIONS.length; i++) if (bestStars(i) < 3) return i;
    return MISSIONS.length - 1;
  }

  function startMission(n) {
    n = clamp(Math.floor(n) || 0, 0, MISSIONS.length - 1);
    S = fresh();
    S.mission = n;
    S.misLen = MISSIONS[n].len;
    S.misT = MISSIONS[n].len;
    S.doors = false;
    return S;
  }

  function leaveMission() { S = fresh(); return S; }

  /* 1 star for getting everyone there in time, +1 for never running past a
     platform, +1 for never taking a crossing over the limit */
  function rateMission() {
    const m = MISSIONS[S.mission];
    if (!m || S.served < m.stops) return 0;
    let stars = 1;
    if (S.missed === 0) stars++;
    if (S.roughCrossings === 0) stars++;
    return stars;
  }

  /* why it went wrong, in one line the screen can show */
  function failReason() {
    if (S.missed > 0) return 'failOverrun';
    if (S.roughCrossings > 0) return 'failRough';
    return 'failLate';
  }

  function finishMission() {
    S.stars = rateMission();
    S.result = S.stars > 0 ? 'win' : 'lose';
    S.failReason = S.result === 'lose' ? failReason() : '';
    /* straight into the sticker book — the single record of a result */
    if (ARG.progress) ARG.progress.award(BOOK(S.mission), S.stars);
    if (onMission) onMission(S.result, S.stars, S.failReason);
  }

  let onMission = null;

  function press(action) {
    const fn = ACTIONS[action];
    if (!fn) return null;
    const res = fn() || { sound: 'notch' };
    if (res.msg) say(res.msg, res.good);
    return res;
  }

  /* ─────────── tick ─────────── */
  function tick(dt) {
    dt = Math.min(dt, 0.08);

    /* ── physics ── */
    let v = S.speed;
    const thr = THROTTLE[S.throttle] / 100;
    const brk = BRAKE[S.brake];
    let a = 0;

    if (thr > 0 && !S.doors) {
      /* tractive effort falls away as the train gets faster */
      const eff = Math.max(0.06, 1 - Math.abs(v) / 64);
      a += thr * 1.15 * eff;
    }

    if (brk > 0) {
      const b = brk >= 130 ? 1.55 : (brk / 100) * 1.05;
      if (Math.abs(v) < 0.25 && thr === 0) {
        S.speed = 0;
        v = 0;
        a = 0;
      } else {
        a -= Math.sign(v || 1) * b;
      }
    }

    /* running resistance: rolling + air drag */
    if (Math.abs(v) > 0.01) a -= Math.sign(v) * (0.03 + 0.00014 * v * v);

    const vPrev = v;
    v += a * dt;
    if (brk > 0 && thr === 0 && ((vPrev > 0 && v < 0) || (vPrev < 0 && v > 0))) v = 0;
    v = clamp(v, -MAX_MS, MAX_MS);

    S.speed = v;
    S.kmh = Math.abs(v) * 3.6;
    S.x += v * dt;

    /* ── which station are we heading for / standing at? ──
       the first one whose platform we have not completely passed yet */
    let n = Math.ceil((S.x - STATION_OFFSET - PLATFORM_LEN - 4) / CYCLE);
    if (n < 0) n = 0;
    S.nextIdx = n;
    const stX = stationX(n);
    S.distToStation = stX - S.x;
    S.distToMark = (stX + 40) - S.x;
    S.atPlatform = S.x >= stX - 4 && S.x <= stX + PLATFORM_LEN + 4;

    /* stopped at a station? */
    if (Math.abs(S.speed) < 0.35) S.stoppedFor += dt; else S.stoppedFor = 0;

    const key = 'st' + n;
    if (S.stoppedFor > 0.35 && S.atPlatform && !S.servedStations[key]) {
      S.servedStations[key] = true;
      const off = Math.abs(S.distToMark);
      let gained, msg;
      if (off <= 6) { gained = 150; msg = 'msgPerfect'; }
      else if (off <= 16) { gained = 80; msg = 'msgGood'; }
      else { gained = 30; msg = 'msgLong'; }
      S.score += gained;
      S.served++;
      S.lastStopResult = msg;
      say(msg, true);
    }

    /* rolled past the previous platform without stopping */
    const prev = n - 1;
    if (prev >= 0) {
      const pk = 'st' + prev;
      const px = stationX(prev);
      if (!S.servedStations[pk] && !S.overshot[pk] && S.x > px + PLATFORM_LEN + 4) {
        S.overshot[pk] = true;
        S.servedStations[pk] = true;
        S.score = Math.max(0, S.score - 60);
        S.missed++;
        S.lastStopResult = 'msgOvershoot';
        say('msgOvershoot', false);
        if (onCross) onCross('missed');
      }
    }

    /* ── level crossings ── */
    const active = [];
    let ding = false;
    let bellOn = false;
    const base = Math.floor(S.x / CYCLE);
    for (let i = base - 1; i <= base + 1; i++) {
      const cx = crossingX(i);
      const d = cx - S.x;
      const isActive = d < ACTIVATE_M && d > -CLEAR_M;
      const gk = 'c' + i;
      const target = isActive ? 1 : 0;
      const cur = S.gates[gk] === undefined ? 0 : S.gates[gk];
      const rate = target > cur ? 0.55 : 0.30;   // barrier drops faster than it lifts
      S.gates[gk] = cur + Math.sign(target - cur) * Math.min(rate * dt, Math.abs(target - cur));
      if (isActive) { active.push(i); bellOn = true; }

      /* ── you must slow down over a crossing ──
         A crossing has a speed restriction. Blast through it and it is a
         rough ride for everyone on board; ease off and it is a good crossing. */
      const ck = 'cx' + i;
      if (!S.crossed[ck] && d < -6 && d > -40) {
        S.crossed[ck] = true;
        if (S.kmh > CROSSING_LIMIT) {
          S.score = Math.max(0, S.score - 60);
          S.roughCrossings++;
          say('msgRoughCrossing', false);
          if (onCross) onCross('rough');
        } else if (S.kmh > 5) {
          S.score += 40;
          S.goodCrossings++;
          say('msgGoodCrossing', true);
          if (onCross) onCross('good');
        }
      }
    }
    S.activeCrossings = active;
    S.bellOn = bellOn || S.bellT > 0;

    /* ding, ding, ding */
    S.dingNow = false;
    if (active.length) {
      S.crossingT = (S.crossingT || 0) + dt;
      S.dingAcc = (S.dingAcc || 0) + dt;
      if (S.dingAcc >= 0.44) { S.dingAcc = 0; S.dingNow = true; }
      S.flashPhase = (S.crossingT % 0.9) < 0.45 ? 0 : 1;
    } else {
      S.crossingT = 0;
      S.dingAcc = 0;
      S.flashPhase = -1;
    }

    /* ── housekeeping ── */
    if (S.hornT > 0) S.hornT = Math.max(0, S.hornT - dt);
    if (S.bellT > 0) S.bellT = Math.max(0, S.bellT - dt);
    if (S.msgT > 0) S.msgT = Math.max(0, S.msgT - dt);

    /* gentle nudge about station speed */
    S.overspeed = S.atPlatform && S.kmh > 60;

    /* ── the mission ──
       It ends the moment the last passenger is delivered, or when the clock
       runs out. rateMission() decides whether that counts. */
    if (S.mission >= 0 && !S.result) {
      S.misT = Math.max(0, S.misT - dt);
      if (S.served >= MISSIONS[S.mission].stops || S.misT <= 0) finishMission();
    }

    return S;
  }

  return {
    get s() { return S; },
    press, tick,
    fresh: () => { S = fresh(); return S; },
    setCrossHook: fn => { onCross = fn; },
    setMissionHook: fn => { onMission = fn; },
    startMission, leaveMission, bestStars, unlocked, rateNow: rateMission,
    MISSIONS,
    stationX, crossingX,
    THROTTLE, BRAKE, MAX_KMH, MAX_MS,
    TRAIN_LEN, LOCO_LEN, COACH_LEN, COACHES,
    CYCLE, PLATFORM_LEN, MARK_AT, ACTIVATE_M,
    clamp
  };
})();
