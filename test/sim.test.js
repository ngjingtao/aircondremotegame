/* ═══════════════════════════════════════════════════════════
   test/sim.test.js — checks the simulation numbers the README quotes

   The state models are pure logic, so they can be run headlessly in
   Node. Each one is loaded into a sandbox with a minimal window,
   then stepped and asserted. No test framework, no dependencies.
   ═══════════════════════════════════════════════════════════ */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const WWW = path.join(__dirname, '..', 'www');

let passed = 0, failed = 0;
const failures = [];

function check(label, actual, lo, hi, unit) {
  const ok = typeof actual === 'number' && actual >= lo && actual <= hi;
  if (ok) { passed++; console.log('  ok   ' + label.padEnd(52) + fmt(actual) + (unit || '')); }
  else {
    failed++;
    failures.push(label + ': got ' + fmt(actual) + ', expected ' + lo + '…' + hi);
    console.log('  FAIL ' + label.padEnd(52) + fmt(actual) + '  (want ' + lo + '…' + hi + ')');
  }
}
function eq(label, actual, want) {
  const ok = actual === want;
  if (ok) { passed++; console.log('  ok   ' + label.padEnd(52) + actual); }
  else { failed++; failures.push(label + ': got ' + actual + ', expected ' + want); console.log('  FAIL ' + label.padEnd(52) + actual + '  (want ' + want + ')'); }
}
function fmt(n) { return typeof n === 'number' ? (Math.round(n * 100) / 100) : String(n); }

/* load an activity's modules into a fake browser */
function load(app, files) {
  const sandbox = {
    console,
    performance: { now: () => Date.now() },
    setTimeout, clearTimeout, Math, Date, JSON, Number, String, Array, Object, isFinite, NaN, Infinity,
    navigator: { language: 'en' },
    localStorage: (() => {
      const m = {};
      return { getItem: k => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); }, removeItem: k => { delete m[k]; } };
    })()
  };
  sandbox.window = sandbox;
  sandbox.document = {
    querySelectorAll: () => [],
    getElementById: () => null,
    addEventListener() {},
    removeEventListener() {},
    documentElement: {
      lang: '',
      classList: { add() {}, remove() {}, toggle() {}, contains: () => false }
    }
  };
  vm.createContext(sandbox);

  const load = f => vm.runInContext(fs.readFileSync(path.join(WWW, f), 'utf8'), sandbox, { filename: f });
  load('shared/store.js');
  files.forEach(load);
  return sandbox.ARG;
}

function settle(sim, seconds, step) {
  const dt = step || 0.05;
  for (let i = 0; i < seconds / dt; i++) sim.tick(dt);
}
console.log('\n— Play Aircond —');
{
  const ARG = load('aircond', ['aircond/js/state.js']);
  const sim = ARG.sim;
  const cur = () => sim.s;                    // fresh() swaps the object, so always re-read
  const settle = (s) => { for (let i = 0; i < s / 0.05; i++) sim.tick(0.05); };
  const set = (o) => { Object.assign(cur(), o); return cur(); };

  set({ setTemp: 25, fan: 'HIGH', roomTemp: 30, humidity: 62, outdoorTemp: 33 });
  settle(300);
  check('set 25 °C settles in the comfort band', sim.feelsLike(), 21, 27, ' °C');
  eq('  → mood is ok', sim.moodFor(sim.feelsLike()), 'ok');

  sim.fresh();
  set({ setTemp: 30, fan: 'HIGH', roomTemp: 30, humidity: 62, outdoorTemp: 33 });
  settle(300);
  eq('set 30 °C leaves him very hot', sim.moodFor(sim.feelsLike()), 'veryhot');

  sim.fresh();
  set({ setTemp: 16, fan: 'HIGH', roomTemp: 30, humidity: 62, outdoorTemp: 33 });
  settle(300);
  eq('set 16 °C leaves him cold', sim.moodFor(sim.feelsLike()), 'cold');

  sim.fresh();
  set({ setTemp: 24, fan: 'HIGH', roomTemp: 26, humidity: 70, outdoorTemp: 33, doorOpen: true });
  settle(300);
  check('open door defeats the aircon', cur().roomTemp, 27.5, 30, ' °C');

  /* the door must be closable by the player */
  sim.fresh();
  set({ doorOpen: true });
  sim.press('closedoor');
  eq('an open door can be closed by the player', !cur().doorOpen, true);

  /* the COOL key must reach every mode */
  sim.fresh();
  const seen = {};
  for (let i = 0; i < 6; i++) { sim.press('mode', { dataset: { mode: 'COOL' } }); seen[cur().mode] = true; }
  sim.press('mode', { dataset: { mode: 'DRY' } });
  seen[cur().mode] = true;
  eq('the mode key reaches COOL', !!seen.COOL, true);
  eq('  → and DRY', !!seen.DRY, true);
  eq('  → and HEAT', !!seen.HEAT, true);
  eq('  → and FAN', !!seen.FAN, true);

  /* challenge mode must reward rescuing him, not standing still */
  sim.fresh();
  set({ challenge: true, eventTimer: 9999, setTemp: 25, fan: 'HIGH', roomTemp: 25, humidity: 62, outdoorTemp: 33, mood: 'ok' });
  settle(45);
  check('idling in the comfort zone scores nothing', cur().score, 0, 0);

  sim.fresh();
  set({ challenge: true, eventTimer: 9999, setTemp: 25, fan: 'HIGH', roomTemp: 29, humidity: 62, outdoorTemp: 33, mood: 'hot' });
  settle(40);
  check('rescuing him scores', cur().score, 100, 1000);
  eq('  → and a rescue is recorded', cur().rescues >= 1, true);
  eq('  → and he ends up comfortable', cur().mood, 'ok');
}

console.log('\n— Play Aircond: missions —');
{
  const ARG = load('aircond', ['aircond/js/state.js']);
  const sim = ARG.sim;
  const cur = () => sim.s;

  /* play a whole mission with one strategy and report how it ended */
  function play(n, strat, watchful) {
    sim.startMission(n);
    let t = 0;
    strat(cur(), t);
    while (!cur().result && t < 400) {
      sim.tick(0.05); t += 0.05;
      strat(cur(), t);
      if (watchful && cur().doorOpen) sim.press('closedoor');
    }
    return cur();
  }

  eq('there are three missions', ARG.sim.MISSIONS.length, 3);
  eq('the first one has no weather events', ARG.sim.MISSIONS[0].events.length, 0);
  /* every event a mission schedules must be a real event, at a real time */
  const badSched = [];
  ARG.sim.MISSIONS.forEach((m, i) => m.events.forEach(e => {
    if (typeof e.at !== 'number' || e.at <= 0 || e.at >= m.len) badSched.push(i + ':' + e.at);
    if (!ARG.sim.EVENTS.some(ev => ev.id === e.id)) badSched.push(i + ':' + e.id);
  }));
  eq('every scheduled event is real and inside the clock', badSched.join(' ') || 'none', 'none');

  /* a mission hands you an uncomfortable room and a running clock */
  sim.startMission(0);
  eq('a mission takes over the model', cur().mission, 0);
  eq('  → the clock is set to its length', cur().missionT, ARG.sim.MISSIONS[0].len);
  eq('  → and he does not start comfortable', cur().mood === 'ok', false);
  eq('  → and the power is already on', cur().power, true);
  settle(sim, 5);
  eq('  → the clock counts down', cur().missionT < ARG.sim.MISSIONS[0].len, true);
  check('  → and the meter is running', cur().energyWh, 0.01, 200, ' Wh');

  /* the goal: comfortable when the clock stops */
  const good = play(0, S => { S.mode = 'COOL'; S.setTemp = 25; S.fan = 'AUTO'; });
  eq('a sensible setting wins the mission', good.result, 'win');
  eq('  → and it pays at least one star', good.stars >= 1, true);

  const lazy = play(0, S => { S.mode = 'COOL'; S.setTemp = 30; });
  eq('an unreasonable setting loses it', lazy.result, 'lose');
  eq('  → with no stars', lazy.stars, 0);
  eq('  → and a reason it can name', lazy.failReason, 'failSetHigh');

  const off = play(0, S => { S.power = false; });
  eq('so does never switching it on', off.failReason, 'failPower');
  const fan = play(0, S => { S.mode = 'FAN'; });
  eq('and so does fan-only', fan.failReason, 'failFan');

  /* ── the trade-off ──
     blasting it cold gets the room right but costs the energy star, while the
     thrifty setting keeps the star — that is the whole design */
  const blast = play(0, S => { S.mode = 'COOL'; S.setTemp = 20; S.fan = 'HIGH'; S.turbo = 'TURBO'; });
  const thrift = play(0, S => { S.mode = 'COOL'; S.setTemp = 26; S.fan = 'LOW'; S.eco = true; });
  eq('blasting it cold burns more power', blast.energyWh > thrift.energyWh * 2, true);
  eq('  → so it loses the energy star', blast.stars < 3, true);
  eq('the thrifty setting keeps the energy star', thrift.stars, 3);

  /* ── the second star: the steady hand ──
     Tested on the mechanic itself rather than on a strategy, because a strategy
     is a moving target. Put him in the band, shove the room out, and the
     counter has to notice. */
  sim.startMission(0);
  cur().roomTemp = 24; cur().outdoorTemp = 24; cur().humidity = 55; cur().power = false;
  settle(sim, 1);
  eq('he can be comfortable mid-mission', cur().mood, 'ok');
  eq('  → and the moment is recorded', cur().missionFirstOk >= 0, true);
  const slipsBefore = cur().missionSlips;
  cur().roomTemp = 40;
  settle(sim, 2);
  eq('letting the room drift out is counted', cur().missionSlips, slipsBefore + 1);
  eq('  → and it costs the steady-hand star', ARG.sim.rateNow() < 3, true);

  /* ── a weather event must give the mission's own weather back ──
     They used to restore hard-coded defaults, so the winter mission's cold snap
     "ended" by turning it into a 33 °C summer afternoon. */
  sim.startMission(2);
  const winterOut = ARG.sim.MISSIONS[2].outdoor;
  eq('winter starts at its own outdoor temperature', cur().outdoorTemp, winterOut);
  settle(sim, 36);                                  // the cold snap fires at 34 s
  eq('  → the cold snap is running', cur().outdoorTemp, 18);
  settle(sim, 20);                                  // and lasts 16 s
  eq('  → and it hands the winter weather back', cur().outdoorTemp, winterOut);
  eq('  → not the default', cur().outdoorTemp !== 33, true);

  /* ── winter: heating to below the band is a real, nameable failure ── */
  const tooCold = play(2, S => { S.mode = 'HEAT'; S.setTemp = 20; S.fan = 'AUTO'; });
  eq('heating to below the comfort band loses winter', tooCold.result, 'lose');
  eq('  → and it says he ended up too cold', tooCold.failReason, 'failTooMuch');

  /* ── summer is winnable, but not by every strategy ── */
  const summerGood = play(1, S => { S.mode = 'COOL'; S.setTemp = 24; S.fan = 'AUTO'; }, true);
  eq('summer can be won', summerGood.result, 'win');
  const summerSlow = play(1, S => { S.mode = 'COOL'; S.setTemp = 26; S.fan = 'LOW'; S.eco = true; }, true);
  eq('  → but not by being too gentle', summerSlow.result, 'lose');

  /* ── stars are remembered, and unlock the next mission ── */
  eq('a finished mission remembers its stars', ARG.sim.bestStars(0) >= 1, true);
  eq('and the first unfinished one is unlocked', ARG.sim.unlocked() >= 0, true);

  /* leaving a mission puts everything back */
  sim.leaveMission();
  eq('leaving the mission clears it', cur().mission, -1);
  eq('  → and the clock with it', cur().missionT, 0);
}

console.log('\n— Food Eating —');
{
  const ARG = load('food', ['food/js/state.js']);
  const sim = ARG.sim;
  sim.fresh();
  settle(sim, 1);
  /* the oesophagus has to finish before the stomach will churn */
  function eat(food, chews) {
    sim.fresh();
    sim.press('pick', { dataset: { food } });
    for (let i = 0; i < chews; i++) sim.press('chew');
    sim.press('swallow');
    settle(sim, 4);                       // oesophagus: ~3 s
    for (let i = 0; i < 12; i++) sim.press('churn');
    settle(sim, 9);                       // small intestine: ~7 s
  }
  // well chewed food absorbs well
  eat('rice', 8);
  check('well-chewed rice absorbs well', sim.s.nutrient, 0.9, 1);
  eq('  → no tummy ache', sim.s.ache, false);
  // swallowed as a lump, it does not
  eat('rice', 2);
  check('a lump absorbs poorly', sim.s.nutrient, 0, 0.8);
  eq('  → and gives a tummy ache', sim.s.ache, true);
}

console.log('\n— Train Driving —');
{
  const ARG = load('train', ['train/js/state.js']);
  const sim = ARG.sim;
  // acceleration from rest
  sim.fresh();
  for (let i = 0; i < 4; i++) sim.press('throttleUp');
  settle(sim, 10);
  check('10 s at full power', sim.s.kmh, 30, 45, ' km/h');
  settle(sim, 50);
  /* top speed is 120 km/h and it sits exactly on the clamp, so allow the float slop */
  check('60 s at full power', sim.s.kmh, 100, 121, ' km/h');
  // braking distance: this is the number the game is built around
  sim.fresh();
  const S = sim.s;
  S.x = 0; S.speed = 60 / 3.6; S.brake = 3;
  let dist = 0, t = 0;
  while (Math.abs(S.speed) > 0.05 && t < 60) { sim.tick(0.05); dist += Math.abs(S.speed) * 0.05; t += 0.05; }
  check('stopping distance from 60 km/h', dist, 130, 200, ' m');
  // the station index must not skip the station you are on
  sim.fresh(); sim.s.x = 290;
  settle(sim, 1);
  eq('standing on the platform counts as this station', sim.s.nextIdx, 0);
  eq('  → atPlatform', sim.s.atPlatform, true);

  /* ── a crossing now has consequences ── */
  const cross = (speedKmh) => {
    sim.fresh();
    const S = sim.s;
    S.x = 628;                        // just past the first crossing, at 620
    S.speed = speedKmh / 3.6;
    S.brake = 0;
    S.crossed = {};
    S.score = 500;                    // start with a score so a penalty is visible
    S.servedStations.st0 = true;      // pretend we stopped at station 0 already
    S.servedStations.st1 = true;
    for (let i = 0; i < 12; i++) sim.tick(0.05);
    return { after: S.score, good: S.goodCrossings, rough: S.roughCrossings };
  };
  const fast = cross(110);
  const slow = cross(50);
  eq('blasting a crossing costs 60 points', fast.after, 440);
  eq('  → and is counted as rough', fast.rough, 1);
  eq('easing off earns 40 points', slow.after, 540);
  eq('  → and is counted as good', slow.good, 1);

  /* ── missing a platform is a real miss ── */
  sim.fresh();
  sim.s.x = 340; sim.s.speed = 8;
  settle(sim, 4);
  eq('overshooting counts as a miss', sim.s.missed, 1);
  check('  → and costs more than it used to', sim.s.score, 0, 0);
}

console.log('\n— Train Driving: missions —');
{
  const ARG = load('train', ['train/js/state.js']);
  const sim = ARG.sim;
  const cur = () => sim.s;

  /* a simple driver: ease off in time to stop on the mark, and slow down for a
     crossing when told to */
  function drive(opts) {
    const S = cur();
    let i = S.nextIdx;
    while (S.servedStations['st' + i]) i++;          // the next station that needs serving
    const canStop = Math.sqrt(Math.max(0, (sim.stationX(i) + 40) - S.x) * 1.05) * (opts.margin || 0.92);

    let cap = opts.limit;
    if (opts.careCrossings) {
      const base = Math.floor(S.x / sim.CYCLE);
      for (let k = base; k < base + 4; k++) {
        const d = sim.crossingX(k) - S.x;
        if (d > 0 && d < 170) cap = Math.min(cap, 21.5);   // just under the 80 km/h limit
      }
    }

    const want = Math.min(cap, canStop);
    if (S.speed > want + 0.4) { if (S.throttle > 0) sim.press('throttleDown'); else sim.press('brakeUp'); }
    else if (S.speed < want - 0.6) { if (S.brake > 0) sim.press('brakeDown'); else if (S.throttle < 4) sim.press('throttleUp'); }
    else if (S.throttle > 2) sim.press('throttleDown');
  }

  function run(n, opts) {
    sim.startMission(n);
    let t = 0;
    while (!cur().result && t < 600) { drive(opts); sim.tick(0.05); t += 0.05; }
    return cur();
  }

  eq('there are three missions', ARG.sim.MISSIONS.length, 3);
  eq('each asks for at least as much as the last',
     ARG.sim.MISSIONS[1].stops >= ARG.sim.MISSIONS[0].stops &&
     ARG.sim.MISSIONS[2].stops >= ARG.sim.MISSIONS[1].stops, true);
  eq('and the night run is tighter than the rush',
     ARG.sim.MISSIONS[2].len < ARG.sim.MISSIONS[1].len, true);

  sim.startMission(0);
  eq('a mission takes over the model', cur().mission, 0);
  eq('  → the clock is set to its length', cur().misT, ARG.sim.MISSIONS[0].len);
  eq('  → the train is at a standstill', cur().kmh, 0);
  eq('  → and the brake is on, as it always starts', cur().brake > 0, true);
  eq('  → with nothing served yet', cur().served, 0);

  const careful = run(0, { limit: 22, careCrossings: true });
  eq('a careful run delivers everyone', careful.result, 'win');
  eq('  → with all three stars', careful.stars, 3);
  eq('  → having served every station asked for', careful.served, 2);

  const rough = run(0, { limit: 25, careCrossings: false });
  eq('ignoring the crossings still gets there', rough.result, 'win');
  eq('  → but it really did take one too fast', rough.roughCrossings > 0, true);
  eq('  → and that costs the crossing star', rough.stars < 3, true);

  /* the rush is tight enough that crawling does not make it */
  const rush = run(1, { limit: 22, careCrossings: true });
  eq('the second mission is winnable', rush.result, 'win');
  const crawl = run(1, { limit: 12, careCrossings: true, margin: 0.98 });
  eq('  → but crawling does not make it', crawl.result, 'lose');
  eq('  → and it says the clock ran out', crawl.failReason, 'failLate');
  eq('  → with no stars', crawl.stars, 0);

  /* running past a platform is the other way to fail, and it is named */
  sim.startMission(0);
  cur().served = 1;            // pretend the first stop happened
  cur().missed = 1;            // and that we ran past the second
  cur().misT = 0.01;           // with the clock about to stop
  settle(sim, 0.2);
  eq('running past a platform is named as the reason', cur().failReason, 'failOverrun');
  eq('  → and that is a loss', cur().result, 'lose');

  eq('a finished mission remembers its stars', ARG.sim.bestStars(0) >= 1, true);
  eq('and has a next one to unlock', ARG.sim.unlocked() >= 0, true);

  sim.leaveMission();
  eq('leaving the mission clears it', cur().mission, -1);
  eq('  → and the train goes back to the start', cur().x, 150);
}

console.log('\n— Breathing & Blood —');
{
  const ARG = load('breath', ['breath/js/state.js']);
  const sim = ARG.sim;
  const row = (scenario, pattern) => {
    sim.fresh();
    if (scenario) sim.press('scenario', { dataset: { scenario } });
    if (pattern) sim.press('pattern', { dataset: { pattern } });
    settle(sim, 120);
    return sim.s;
  };
  check('rest: heart rate', row('rest').heartRate, 68, 82, ' bpm');
  check('run: heart rate', row('run').heartRate, 150, 180, ' bpm');
  check('high altitude: oxygen', row('alt').spo2, 84, 92, ' %');
  check('box breathing calms the heart', row('rest', 'box').heartRate, 62, 74, ' bpm');
  check('4-7-8 calms it most', row('rest', 'relax').heartRate, 60, 72, ' bpm');
  check('fast breathing blows off CO2', row('rest', 'fast').co2, 34, 40);
  // holding your breath must eventually force a gasp
  sim.fresh(); sim.press('scenario', { dataset: { scenario: 'rest' } });
  settle(sim, 20);
  sim.press('hold');
  let held = 0;
  while (sim.s.holding && held < 90) { sim.tick(0.05); held += 0.05; }
  check('the body forces a gasp', held, 8, 60, ' s');
  eq('  → and it recovers', sim.s.holding, false);
}

console.log('\n— Inside the Aircon —');
{
  const ARG = load('aircare', ['aircare/js/state.js']);
  const sim = ARG.sim;
  sim.fresh();
  settle(sim, 60);
  check('evaporator runs cold', sim.s.evapTemp, 2, 12, ' °C');
  check('condenser runs hot', sim.s.condTemp, 40, 60, ' °C');
  sim.fresh(); sim.press('power');
  settle(sim, 30);
  check('switched off, the coil warms up', sim.s.evapTemp, 20, 34, ' °C');
}

console.log('\n— Toilet —');
{
  const ARG = load('toilet', ['toilet/js/state.js']);
  const sim = ARG.sim;
  sim.fresh();
  sim.press('flush');
  eq('flush starts', sim.s.flushing, true);
  /* it must actually siphon part way through */
  let sawSiphon = false, t = 0;
  while (sim.s.flushing && t < 20) { sim.tick(0.05); t += 0.05; if (sim.s.siphoning) sawSiphon = true; }
  eq('the siphon engages', sawSiphon, true);
  check('a full flush takes', t, 5, 8, ' s');
  eq('the cistern refills', sim.s.cistern > 0.95, true);
  check('the water seal is restored', sim.s.bowl, 0.7, 0.8);
}

console.log('\n— Indah Water —');
{
  const ARG = load('indah', ['indah/js/state.js']);
  const sim = ARG.sim;
  const cur = () => sim.s;

  /* the two halves of the connected-sewerage diagram */
  eq('the journey has six steps', ARG.sim.NETWORK.length, 6);
  eq('the works has six stages', ARG.sim.PLANT.length, 6);

  sim.fresh();
  eq('it opens on the journey', cur().tab, 'network');
  eq('  → at step 0', cur().step, 0);

  /* each step must name a part, and no step may be left pointing at nothing */
  const noLit = ARG.sim.NETWORK.concat(ARG.sim.PLANT).filter(s => !s.lit || !s.lit.trim());
  eq('every step highlights something', noLit.length, 0);

  /* the water creeps towards the stage you are reading about */
  sim.fresh();
  const f0 = cur().flow;
  settle(sim, 3);
  eq('the wastewater moves along', cur().flow > f0, true);

  /* raw all the way to the plant; clean only once the works has done its job */
  sim.fresh();
  for (let i = 0; i < 5; i++) { sim.press('stepUp'); settle(sim, 3); }
  check('it is still raw sewage on the journey', cur().clean, 0, 0.1);

  sim.press('tab', { dataset: { tab: 'plant' } });
  eq('switching to the works resets to stage 0', cur().step, 0);
  eq('  → and to the start of the pipe', cur().flow < 0.2, true);
  for (let i = 0; i < 5; i++) { sim.press('stepUp'); settle(sim, 4); }
  check('by the outfall it is clean', cur().clean, 0.85, 1);

  /* the blowers are the teaching point of the aeration stage */
  sim.fresh();
  sim.press('tab', { dataset: { tab: 'plant' } });
  settle(sim, 3);
  eq('the blowers run', cur().blower > 0.8, true);
  eq('  → and the return sludge is pumping', cur().sludge > 0.8, true);
  sim.press('air');
  settle(sim, 5);
  eq('switching the blowers off spins them down', cur().blower < 0.1, true);
  eq('  → and the sludge pump stops with them', cur().sludge < 0.1, true);
  sim.press('air');
  settle(sim, 5);
  eq('  → and switching them back on restarts them', cur().blower > 0.8, true);
}

console.log('\n— Kitchen Hood —');
{
  const ARG = load('hood', ['hood/js/state.js']);
  const sim = ARG.sim;
  sim.fresh(); sim.s.fan = 3; settle(sim, 20);
  check('fan 3 airflow', sim.s.air, 800, 870, ' m³/h');
  check('fan 3 catches the smoke', sim.s.capture, 0.9, 1);
  sim.fresh(); sim.s.fan = 0; settle(sim, 20);
  eq('fan off catches nothing', sim.s.capture < 0.05, true);
  // the whole teaching point: a dirty filter chokes it
  sim.fresh(); sim.s.fan = 3; sim.s.dirty = true; settle(sim, 20);
  check('a dirty filter halves the airflow', sim.s.air, 400, 500, ' m³/h');
  check('  → and it is louder too', sim.s.noise, 64, 72, ' dB');
  check('  → and it catches less', sim.s.capture, 0.6, 0.85);
}

console.log('\n— The sticker book —');
{
  const ARG = load('shared', ['shared/progress.js']);
  const p = ARG.progress;

  p.reset();
  eq('the book has twelve stickers', p.count, 12);
  eq('and starts empty', p.earned(), 0);
  eq('  → with no stars', p.total(), 0);

  eq('earning one gives back its stars', p.award('toilet'), 1);
  eq('  → it is remembered', p.starsOf('toilet'), 1);
  eq('  → and it shows in the book', p.earned(), 1);

  p.award('air-0', 3);
  eq('a rated sticker keeps its rating', p.starsOf('air-0'), 3);
  p.award('air-0', 1);
  eq('and can never be lowered', p.starsOf('air-0'), 3);
  eq('  → not even by a silly value', p.award('air-0', 99), 3);

  eq('a sticker that does not exist is ignored', p.award('not-a-sticker', 3), 0);
  eq('  → and never enters the book', p.earned(), 2);
  eq('the total adds the stars up', p.total(), 4);

  const book = p.book();
  eq('every catalogue sticker is in the book', book.length, 12);
  eq('  → each knows its activity', book[0].activity, 'aircond');
  eq('  → and has a label to explain it', typeof book[0].label, 'string');
  const acts = {};
  book.forEach(c => { acts[c.activity] = (acts[c.activity] || 0) + 1; });
  eq('every activity in the app contributes', Object.keys(acts).length, 8);
  eq('  → the two with missions contribute three each',
     acts.aircond === 3 && acts.train === 3, true);

  /* a corrupt store must not take the home screen down with it */
  const ARG2 = load('shared', ['shared/progress.js']);
  ARG2.store.set('arg.progress', '{{{ not json at all');
  eq('a corrupt book reads as empty rather than throwing', ARG2.progress.earned(), 0);
  ARG2.store.set('arg.progress', '[1,2,3]');
  eq('  → and so does one of the wrong shape', ARG2.progress.earned(), 0);
}

console.log('\n— Language lock —');
{
  const ARG = load('aircond', ['shared/config.js', 'aircond/js/i18n.js']);
  const lock = ARG.config.lockLang;
  eq('a language lock is configured', !!lock, true);
  eq('the interface starts in the locked language', ARG.i18n.lang, lock);
  ARG.i18n.toggle();
  eq('  → and the toggle cannot move it', ARG.i18n.lang, lock);
  ARG.i18n.setLang('en');
  eq('  → and setLang cannot either', ARG.i18n.lang, lock);
  eq('  → and the strings really are the locked ones',
     ARG.i18n.t('title') !== 'Play Aircond', true);
}

console.log('\n' + '─'.repeat(72));
console.log(passed + ' passed, ' + failed + ' failed');
if (failed) {
  console.log('\nfailures:');
  failures.forEach(f => console.log('  • ' + f));
}
process.exit(failed ? 1 : 0);
