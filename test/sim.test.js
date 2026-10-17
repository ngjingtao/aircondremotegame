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
  sandbox.document = { querySelectorAll: () => [], getElementById: () => null, addEventListener() {}, removeEventListener() {} };
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

console.log('\n— Toilet & Indah Water —');
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

console.log('\n' + '─'.repeat(72));
console.log(passed + ' passed, ' + failed + ' failed');
if (failed) {
  console.log('\nfailures:');
  failures.forEach(f => console.log('  • ' + f));
}
process.exit(failed ? 1 : 0);
