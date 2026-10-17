/* ═══════════════════════════════════════════════════════════
   test/render.test.js — every page must boot AND keep running

   sim.test.js checks the numbers the state models produce. It says
   nothing about the part that puts pixels on the screen — the
   scene is never called.

   That gap hid a real bug: a scene render() referenced an undefined
   helper (`clamp`), which threw on every frame. main.js calls
   render() *before* it schedules requestAnimationFrame, so the
   throw killed the animation loop at boot. The whole game sat
   frozen — no tick, no motion — while all 56 simulation
   assertions passed.

   So this boots each real page — the exact <script> list from its
   own HTML, in order — inside a small fake DOM, then drives the
   requestAnimationFrame loop the way a browser would. Any throw,
   on boot or on any later frame, fails the page.
   ═══════════════════════════════════════════════════════════ */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const WWW = path.join(__dirname, '..', 'www');

let passed = 0, failed = 0;
const failures = [];

function ok(label, extra) {
  passed++;
  console.log('  ok   ' + label.padEnd(54) + (extra === undefined ? '' : extra));
}
function bad(label, err) {
  failed++;
  const line = label + ': ' + err;
  failures.push(line);
  console.log('  FAIL ' + label.padEnd(54) + err);
}
function eq(label, actual, want) {
  if (actual === want) ok(label, String(actual));
  else bad(label, 'got ' + actual + ', expected ' + want);
}

/* ─────────── the smallest DOM the pages need ─────────── */

function makeStyle() {
  const s = {};
  s.setProperty = (k, v) => { s[k] = v; };
  s.removeProperty = k => { delete s[k]; };
  s.getPropertyValue = k => s[k] || '';
  return s;
}

function makeClassList(set) {
  return {
    add: (...c) => { c.forEach(x => set.add(x)); },
    remove: (...c) => { c.forEach(x => set.delete(x)); },
    toggle: (c, on) => {
      if (on === undefined) { if (set.has(c)) set.delete(c); else set.add(c); }
      else if (on) set.add(c);
      else set.delete(c);
      return set.has(c);
    },
    contains: c => set.has(c),
    item: i => Array.from(set)[i] || null,
    get length() { return set.size; }
  };
}

/* A very small selector matcher: tag names, .classes and [attributes], with no
   combinators and no pseudo-classes. That is all the activities ever query, and
   it means a test can build a few stub elements and check what the renderer
   actually applies its classes to. */
function matchesSel(el, sel) {
  const tag = (sel.match(/^[a-zA-Z][\w-]*/) || [])[0];
  if (tag && el.tagName !== tag.toUpperCase()) return false;
  const classes = (sel.match(/\.([\w-]+)/g) || []).map(c => c.slice(1));
  for (const c of classes) if (!el.classList.contains(c)) return false;
  const attrs = (sel.match(/\[([\w-]+)\]/g) || []).map(a => a.slice(1, -1));
  for (const a of attrs) if (!(a in el._attrs)) return false;
  return classes.length > 0 || attrs.length > 0 || !!tag;
}

function queryAll(root, sel) {
  const sels = String(sel).split(',').map(s => s.trim()).filter(Boolean);
  const out = [];
  (function walk(el) {
    for (const c of el.children) {
      if (sels.some(s => matchesSel(c, s))) out.push(c);
      walk(c);
    }
  })(root);
  return out;
}

function makeEl(tag) {
  const classSet = new Set();
  const el = {
    tagName: String(tag || 'div').toUpperCase(),
    nodeType: 1,
    id: '',
    hidden: false,
    disabled: false,
    checked: false,
    value: '',
    title: '',
    textContent: '',
    innerHTML: '',
    style: makeStyle(),
    children: [],
    childNodes: [],
    parentNode: null,
    firstChild: null,
    lastChild: null,
    clientWidth: 1200,
    clientHeight: 700,
    offsetWidth: 1200,
    offsetHeight: 700,
    scrollTop: 0,
    _attrs: {},
    _listeners: {},
    addEventListener(type, fn) { (this._listeners[type] = this._listeners[type] || []).push(fn); },
    removeEventListener(type, fn) {
      const a = this._listeners[type];
      if (a) { const i = a.indexOf(fn); if (i >= 0) a.splice(i, 1); }
    },
    dispatchEvent(ev) {
      (this._listeners[ev && ev.type] || []).forEach(fn => fn.call(this, ev));
      return true;
    },
    insertAdjacentHTML(pos, html) {
      if (pos === 'afterbegin' || pos === 'beforeend') this.innerHTML += html;
      else this.innerHTML = html + this.innerHTML;
    },
    insertAdjacentElement(pos, el) { return this.appendChild(el); },
    setAttribute(k, v) { this._attrs[k] = String(v); },
    getAttribute(k) { return k in this._attrs ? this._attrs[k] : null; },
    removeAttribute(k) { delete this._attrs[k]; },
    hasAttribute(k) { return k in this._attrs; },
    appendChild(c) { this.children.push(c); this.childNodes.push(c); c.parentNode = this; return c; },
    insertBefore(c) { this.children.unshift(c); c.parentNode = this; return c; },
    removeChild(c) { const i = this.children.indexOf(c); if (i >= 0) this.children.splice(i, 1); return c; },
    replaceChild(n, o) { this.removeChild(o); return this.appendChild(n); },
    contains() { return false; },
    closest() { return null; },
    matches() { return false; },
    focus() {}, blur() {}, click() {}, scrollIntoView() {},
    getBoundingClientRect() {
      return { x: 0, y: 0, top: 0, left: 0, right: 1200, bottom: 700, width: 1200, height: 700 };
    },
    getBBox() { return { x: 0, y: 0, width: 10, height: 10 }; },
    getScreenCTM() { return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0, inverse() { return this; } }; },
    getCTM() { return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }; },
    querySelector(sel) { return queryAll(this, sel)[0] || bySelector(sel); },
    querySelectorAll(sel) { return queryAll(this, sel); },
    getElementsByTagName() { return []; },
    getElementsByClassName() { return []; }
  };
  el.classList = makeClassList(classSet);

  /* dataset writes the real data-* attribute, the way a browser does — the
     activities read parts back with `el.dataset.lab`, and a matcher that could
     not see [data-lab] would silently match nothing. */
  const camel = k => String(k).replace(/[A-Z]/g, m => '-' + m.toLowerCase());
  el.dataset = new Proxy({}, {
    get: (t, k) => (k in t ? t[k] : el._attrs['data-' + camel(k)]),
    set: (t, k, v) => { t[k] = String(v); el._attrs['data-' + camel(k)] = String(v); return true; },
    has: (t, k) => (k in t) || ('data-' + camel(k)) in el._attrs
  });

  Object.defineProperty(el, 'className', {
    get: () => Array.from(classSet).join(' '),
    set: v => {
      classSet.clear();
      String(v).split(/\s+/).filter(Boolean).forEach(c => classSet.add(c));
    }
  });
  return el;
}

/* same selector → same element, so a page that stores an element and looks
   it up again later is talking about the same node */
const selectorCache = new Map();
function bySelector(sel) {
  if (!selectorCache.has(sel)) selectorCache.set(sel, makeEl('div'));
  return selectorCache.get(sel);
}

/* ─────────── boot one page ─────────── */

function scriptsOf(pageDir) {
  const file = path.join(WWW, pageDir, 'index.html');
  const html = fs.readFileSync(file, 'utf8');
  const out = [];
  const re = /<script\s+src="([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) {
    const abs = path.resolve(path.join(WWW, pageDir), m[1]);
    out.push(path.relative(WWW, abs).split(path.sep).join('/'));
  }
  return out;
}

function boot(pageDir) {
  const errors = [];
  const byId = new Map();
  const rafQueue = [];
  const timers = [];
  let rafCount = 0;
  let nowMs = 0;
  let timerId = 0;

  const document = {
    readyState: 'complete',            // scripts sit at the end of <body>
    hidden: false,
    visibilityState: 'visible',
    documentElement: makeEl('html'),
    body: makeEl('body'),
    head: makeEl('head'),
    currentScript: makeEl('script'),
    createElement: t => makeEl(t),
    createElementNS: (ns, t) => makeEl(t),
    createDocumentFragment: () => makeEl('fragment'),
    createTextNode: t => ({ nodeType: 3, textContent: t }),
    getElementById(id) {
      if (!byId.has(id)) { const el = makeEl('div'); el.id = id; byId.set(id, el); }
      return byId.get(id);
    },
    querySelector: sel => bySelector(sel),
    querySelectorAll: sel => queryAll(document.documentElement, sel),
    getElementsByTagName: () => [],
    getElementsByClassName: () => [],
    addEventListener() {}, removeEventListener() {}, dispatchEvent() { return true; }
  };

  const sandbox = {
    console: {
      log() {}, info() {}, warn() {}, debug() {},
      error(...a) { errors.push('console.error: ' + a.join(' ')); }
    },
    document,
    location: {
      protocol: 'file:', host: '', hostname: '', port: '',
      href: 'file:///' + pageDir, pathname: '/' + pageDir, search: '', hash: '',
      reload() {}, assign() {}, replace() {}
    },
    navigator: {
      language: 'en-US', languages: ['en-US'], userAgent: 'node-smoke-test',
      maxTouchPoints: 0, vibrate() {}, standalone: false
    },
    localStorage: (() => {
      const m = {};
      return {
        getItem: k => (k in m ? m[k] : null),
        setItem: (k, v) => { m[k] = String(v); },
        removeItem: k => { delete m[k]; },
        clear() { for (const k in m) delete m[k]; }
      };
    })(),
    performance: { now: () => nowMs },
    setTimeout(fn, ms) { timers.push({ id: ++timerId, fn }); return timerId; },
    clearTimeout(id) { const i = timers.findIndex(t => t.id === id); if (i >= 0) timers.splice(i, 1); },
    setInterval(fn) { timers.push({ id: ++timerId, fn, every: true }); return timerId; },
    clearInterval(id) { const i = timers.findIndex(t => t.id === id); if (i >= 0) timers.splice(i, 1); },
    requestAnimationFrame(cb) { rafCount++; rafQueue.push(cb); return rafCount; },
    cancelAnimationFrame() {},
    innerWidth: 1200, innerHeight: 700, devicePixelRatio: 1,
    matchMedia: () => ({ matches: false, media: '', addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }),
    getComputedStyle: () => ({ getPropertyValue: () => '', transform: 'none', transformOrigin: '0px 0px', transformBox: 'view-box' }),
    addEventListener() {}, removeEventListener() {}, dispatchEvent() { return true; },
    scrollTo() {}, focus() {}, open() {},
    ResizeObserver: class { observe() {} unobserve() {} disconnect() {} },
    PointerEvent: class { constructor(type, o) { Object.assign(this, o || {}); this.type = type; } },
    Event: class { constructor(type, o) { Object.assign(this, o || {}); this.type = type; } },
    CustomEvent: class { constructor(type, o) { Object.assign(this, o || {}); this.type = type; } },
    SpeechSynthesisUtterance: class { constructor(t) { this.text = t; } },
    speechSynthesis: {
      getVoices: () => [], speak() {}, cancel() {}, pause() {}, resume() {},
      addEventListener() {}, removeEventListener() {}
    },
    AudioContext: class {
      constructor() { this.state = 'running'; this.currentTime = 0; this.sampleRate = 8000; this.destination = {}; }
      resume() {}
      createOscillator() {
        return { type: '', frequency: { setValueAtTime() {}, value: 0 }, connect() {}, start() {}, stop() {} };
      }
      createGain() {
        return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {}, value: 0 }, connect() {} };
      }
      createBuffer(ch, len) { return { getChannelData: () => new Float32Array(len) }; }
      createBufferSource() { return { buffer: null, connect() {}, start() {} }; }
      createBiquadFilter() { return { type: '', frequency: { value: 0 }, Q: { value: 0 }, connect() {} }; }
    }
  };
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);

  /* load the page's scripts in exactly the order the HTML does */
  let bootError = null;
  for (const f of scriptsOf(pageDir)) {
    try {
      vm.runInContext(fs.readFileSync(path.join(WWW, f), 'utf8'), sandbox, { filename: f });
    } catch (e) {
      bootError = f + ' → ' + e.message;
      break;
    }
  }

  function flushTimers() {
    const due = timers.splice(0);
    for (const t of due) {
      try { t.fn(); } catch (e) { errors.push('timer → ' + e.message); }
    }
  }

  /* drive the animation loop the way a browser does */
  function pump(frames) {
    for (let i = 0; i < frames; i++) {
      nowMs += 16;
      const due = rafQueue.splice(0);
      for (const cb of due) {
        try { cb(nowMs); } catch (e) { errors.push('frame → ' + e.message); }
      }
      flushTimers();
    }
  }

  return { ARG: sandbox.ARG, document, errors, pump, get rafCount() { return rafCount; }, bootError };
}

/* ─────────── run ─────────── */

const PAGES = [
  { dir: '.', name: 'home menu', loop: false },      // a static menu: no game loop
  { dir: 'aircond', name: 'Play Aircond' },
  { dir: 'food', name: 'Food Eating' },
  { dir: 'train', name: 'Train Driving' },
  { dir: 'breath', name: 'Breathing & Blood' },
  { dir: 'aircare', name: 'Inside the Aircon' },
  { dir: 'toilet', name: 'Toilet' },
  { dir: 'indah', name: 'Indah Water' },
  { dir: 'hood', name: 'Kitchen Hood' }
];

console.log('\n— Every page boots —');

for (const page of PAGES) {
  const label = page.name;

  let p;
  try { p = boot(page.dir); }
  catch (e) { bad(label + ' — loads', e.message); continue; }

  if (p.bootError) { bad(label + ' — boots clean', p.bootError); continue; }
  ok(label + ' — boots clean');

  if (page.loop === false) {
    /* no animation loop to drive, but it must still paint and stay quiet */
    p.pump(30);
    if (p.errors.length) { bad(label + ' — paints without throwing', p.errors[0]); continue; }
    ok(label + ' — paints without throwing');
    continue;
  }

  /* the loop must have been scheduled, or the page is frozen on frame one */
  if (p.rafCount < 1) { bad(label + ' — starts its animation loop', 'requestAnimationFrame was never called'); continue; }
  ok(label + ' — starts its animation loop', p.rafCount + ' scheduled');

  /* ... and it must survive a few seconds of real frames */
  const before = p.rafCount;
  p.pump(180);
  if (p.errors.length) { bad(label + ' — renders 180 frames', p.errors[0]); continue; }
  if (p.rafCount <= before) { bad(label + ' — keeps its loop alive', 'the loop did not reschedule'); continue; }
  ok(label + ' — renders 180 frames without throwing');
}

/* ─────────── the reported bug, as a behaviour ─────────── */
console.log('\n— Train: the throttle actually moves it —');
{
  const p = boot('train');
  if (p.bootError) { bad('train — boots', p.bootError); }
  else {
    const sim = p.ARG.sim;
    const startX = sim.s.x;

    /* this is what tapping ▲ on the throttle lever does */
    sim.press('throttleUp');
    if (sim.s.throttle !== 1 || sim.s.brake !== 0) {
      bad('throttle takes off the brake', 'throttle=' + sim.s.throttle + ' brake=' + sim.s.brake);
    } else {
      ok('throttle takes off the brake', 'notch 1');
    }

    /* the loop alone must drive it — no manual tick() */
    p.pump(400);            // ~6.4 s of frames

    const moved = sim.s.x - startX;
    if (moved <= 0.5) {
      bad('the train rolls under its own power', 'moved only ' + moved.toFixed(2) + ' m');
    } else {
      ok('the train rolls under its own power', moved.toFixed(2) + ' m, ' + sim.s.kmh.toFixed(1) + ' km/h');
    }

    if (p.errors.length) bad('train — no errors while driving', p.errors[0]);
    else ok('train — no errors while driving');
  }
}

/* ─────────── the toilet cutaway must be mechanically honest ─────────── */
console.log('\n— Toilet: a real gravity-flush mechanism —');
{
  const html = fs.readFileSync(path.join(WWW, 'toilet', 'index.html'), 'utf8');
  const attr = (id, name) => {
    const re = new RegExp('id="' + id + '"[^>]*?\\s' + name + '="([^"]+)"');
    const m = html.match(re);
    return m ? m[1] : null;
  };

  /* every part the drawing claims to have must actually be drawn */
  ['chain', 'float', 'flapper', 'rimJets', 'siphonJet', 'trapTube', 'trapWater', 'overflowTube']
    .forEach(id => eq('the diagram draws the ' + id, html.indexOf('id="' + id + '"') >= 0, true));

  /* the trapway is ONE continuous pipe, not a cup under the bowl */
  const tube = attr('trapTube', 'd') || '';
  eq('the trapway is a single unbroken path', (tube.match(/M/g) || []).length, 1);
  const tubeEnd = (tube.trim().split(/\s+/).pop() || '0,0').split(',');
  eq('  → and it runs through the floor', Number(tubeEnd[1]) >= 500, true);

  /* the still water can only stand as high as the weir, so the two must be
     the same height. Moving one without the other breaks the physics. */
  const waterD = attr('trapWater', 'd') || '';
  const crest = (waterD.trim().split(/\s+/).pop() || '0,0').split(',');
  const crestY = Number(crest[1]);
  eq('the trapway water tops out at the weir', isFinite(crestY), true);

  const p = boot('toilet');
  if (p.bootError) { bad('toilet — boots', p.bootError); }
  else {
    const s = p.ARG.sim.s;
    s.bowl = 0.75;                       // the level it rests at when idle
    s.cistern = 1;
    p.ARG.scene.render(0.016);
    const waterY = Number(p.document.getElementById('bowlWater')._attrs.y);
    eq('the resting water seal is level with the weir', waterY, crestY);

    /* a step that points at a part which does not exist highlights nothing */
    const labels = new Set();
    let m2;
    const labRe = /data-lab="([^"]+)"/g;
    while ((m2 = labRe.exec(html))) labels.add(m2[1]);

    const lit = new Set();
    p.ARG.sim.FLUSH.forEach(st => String(st.lit).split(/\s+/).filter(Boolean).forEach(k => lit.add(k)));

    const missing = [...lit].filter(k => !labels.has(k));
    eq('every step points at a part that exists', missing.join(' ') || 'none', 'none');

    const unlit = [...labels].filter(k => !lit.has(k));
    eq('every labelled part is used by some step', unlit.join(' ') || 'none', 'none');
  }
}

/* ─────────── the sewer journey and the works ─────────── */
console.log('\n— Indah Water: the journey and the works —');
{
  const html = fs.readFileSync(path.join(WWW, 'indah', 'index.html'), 'utf8');

  /* the two halves must really swap. `hidden` is an HTML property and is NOT
     reflected on SVG elements, so `svgGroup.hidden = x` is a silent no-op —
     which once left the second tab permanently invisible. */
  const p = boot('indah');
  if (p.bootError) { bad('indah — boots', p.bootError); }
  else {
    const sd = p.document;
    const isHidden = id => 'hidden' in sd.getElementById(id)._attrs;

    eq('the journey tab shows the journey scene', isHidden('networkScene'), false);
    eq('  → and hides the works', isHidden('plantScene'), true);

    p.ARG.sim.press('tab', { dataset: { tab: 'plant' } });
    p.ARG.scene.render(0.016);
    eq('switching to the works hides the journey', isHidden('networkScene'), true);
    eq('  → and reveals the works', isHidden('plantScene'), false);

    p.ARG.sim.press('tab', { dataset: { tab: 'network' } });
    p.ARG.scene.render(0.016);
    eq('  → and switching back restores the journey', isHidden('networkScene'), false);

    /* six stages, in the order the diagram labels them */
    eq('the works has six stages', p.ARG.scene.STAGES.length, 6);
    eq('  → the first is the pumping station', p.ARG.scene.STAGES[0].tag, 'pump');
    eq('  → the last is the outfall', p.ARG.scene.STAGES[5].tag, 'effluent');

    /* every stage has a step pointing at it, and every step names a stage */
    const stageTags = p.ARG.scene.STAGES.map(s => s.tag);
    const litTags = p.ARG.sim.PLANT.map(s => s.lit);
    eq('every stage is pointed at by a step', stageTags.filter(t => litTags.indexOf(t) < 0).join(' ') || 'none', 'none');
    eq('every plant step names a real stage', litTags.filter(t => stageTags.indexOf(t) < 0).join(' ') || 'none', 'none');

    /* and the same for the journey */
    const parts = new Set();
    let m;
    const labRe = /data-lab="([^"]+)"/g;
    while ((m = labRe.exec(html))) parts.add(m[1]);
    const netLit = new Set();
    p.ARG.sim.NETWORK.forEach(s => String(s.lit).split(/\s+/).filter(Boolean).forEach(k => netLit.add(k)));
    eq('every journey step points at a part that exists', [...netLit].filter(k => !parts.has(k)).join(' ') || 'none', 'none');
    eq('every labelled part is used by some step', [...parts].filter(k => !netLit.has(k)).join(' ') || 'none', 'none');

    /* the blowers are the whole teaching point of the aeration stage */
    const s2 = p.ARG.sim.s;
    s2.tab = 'plant';
    eq('the blowers start on', s2.air, true);
    p.pump(120);
    const spun = s2.blower;
    p.ARG.sim.press('air');
    p.pump(120);
    eq('switching them off does spin them down', s2.blower < spun, true);

    /* every single step, on both tabs, must light something up on screen.
       A `lit` key with a typo — or a part that never got a data-lab — silently
       highlights nothing, and no screenshot of any other step would show it.
       The fake DOM has no HTML parser, so hand the renderer the same parts the
       real markup has, read straight out of it. */
    const labs = new Set();
    let lm; const labRe2 = /data-lab="([^"]+)"/g;
    while ((lm = labRe2.exec(html))) labs.add(lm[1]);

    const mk = (cls, lab) => {
      const e = p.document.createElement('g');
      e.className = cls;
      e.dataset.lab = lab;
      return e;
    };
    const netHost = p.document.getElementById('networkScene');
    const labHost = p.document.getElementById('labels-network');
    labs.forEach(l => { netHost.appendChild(mk('part', l)); labHost.appendChild(mk('lab', l)); });
    const stageHost = p.document.getElementById('stages');
    p.ARG.scene.STAGES.forEach(s => stageHost.appendChild(mk('stage', s.tag)));

    const misses = [];
    ['network', 'plant'].forEach(tab => {
      p.ARG.sim.press('tab', { dataset: { tab } });
      const list = tab === 'network' ? p.ARG.sim.NETWORK : p.ARG.sim.PLANT;
      const host = tab === 'network' ? netHost : stageHost;
      for (let i = 0; i < list.length; i++) {
        p.ARG.sim.s.step = i;
        p.ARG.scene.render(0.016);
        if (!host.querySelectorAll('.on').length) misses.push(tab + '#' + (i + 1) + ' ' + list[i].key);
      }
    });
    eq('every step lights something up on screen', misses.join(', ') || 'none', 'none');
  }
}

/* ─────────── the train's sky tiles must not clip their own clouds ─────────── */
console.log('\n— Train: sky layers —');
{
  const css = fs.readFileSync(path.join(WWW, 'train', 'train.css'), 'utf8');

  /* pull one rule body out of the stylesheet */
  const rule = name => {
    const i = css.indexOf(name + '{');
    if (i < 0) return null;
    return css.slice(i + name.length + 1, css.indexOf('}', i));
  };

  ['clouds', 'clouds2'].forEach(name => {
    const body = rule('.' + name);
    if (!body) { bad('.' + name + ' exists', 'rule not found'); return; }

    const size = body.match(/background-size:\s*([\d.]+)px\s+([\d.]+)px/);
    if (!size) { bad('.' + name + ' has a tile', 'no background-size'); return; }
    const tileH = Number(size[2]);

    /* the element must be at least as tall as the tile, or the bottom of the
       tile — and anything drawn in it — gets sliced off flat */
    const h = body.match(/height:\s*([\d.]+)px/);
    const elH = h ? Number(h[1]) : null;
    eq('.' + name + ' is tall enough for its tile', elH !== null && elH >= tileH, true);

    /* and no single puff may overhang the tile */
    const puffs = body.match(/circle\s+([\d.]+)px\s+at\s+[\d.]+px\s+([\d.]+)px/g) || [];
    eq('.' + name + ' has puffs to check', puffs.length > 0, true);

    let worst = 0;
    puffs.forEach(p => {
      const m = p.match(/circle\s+([\d.]+)px\s+at\s+[\d.]+px\s+([\d.]+)px/);
      worst = Math.max(worst, Number(m[2]) + Number(m[1]));
    });
    /* a truncated puff is what drew the seam, so this must never come back */
    eq('.' + name + ' puffs all fit inside the tile', worst <= tileH, true);
  });
}

/* ─────────── report ─────────── */
console.log('\n' + '─'.repeat(72));
console.log(passed + ' passed, ' + failed + ' failed');
if (failed) {
  console.log('\nFailures:');
  failures.forEach(f => console.log('  • ' + f));
  process.exit(1);
}
