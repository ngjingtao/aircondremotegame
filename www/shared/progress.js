/* ═══════════════════════════════════════════════════════════
   shared/progress.js — the sticker book

   Every activity records what a child has managed; the home screen shows it
   all as one collection. That is the only thing that ties the thirty activities
   together into one world, so it lives here rather than in any of them.

   Ids are strings and the value is 1..3 stars, or 0 for "not done yet".
   ═══════════════════════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.progress = (function () {

  const KEY = 'arg.progress';      // one JSON blob, so a write is atomic

  /* Every sticker the book can hold, in the order it is shown. The activities
     award these ids; `label` is an i18n key describing how to earn it. */
  const STICKERS = [
    { id: 'air-0',   activity: 'aircond', label: 'stAir0' },
    { id: 'air-1',   activity: 'aircond', label: 'stAir1' },
    { id: 'air-2',   activity: 'aircond', label: 'stAir2' },
    { id: 'train-0', activity: 'train',   label: 'stTrain0' },
    { id: 'train-1', activity: 'train',   label: 'stTrain1' },
    { id: 'train-2', activity: 'train',   label: 'stTrain2' },
    { id: 'food',    activity: 'food',    label: 'stFood' },
    { id: 'breath',  activity: 'breath',  label: 'stBreath' },
    { id: 'aircare', activity: 'aircare', label: 'stCare' },
    { id: 'toilet',  activity: 'toilet',  label: 'stToilet' },
    { id: 'indah',   activity: 'indah',   label: 'stIndah' },
    { id: 'hood',    activity: 'hood',    label: 'stHood' },
    { id: 'laundry-wash', activity: 'laundry', label: 'stWash' },
    { id: 'laundry-dry',  activity: 'laundry', label: 'stDry' },
    { id: 'tree',    activity: 'tree',    label: 'stTree' },
    { id: 'sandwich', activity: 'sandwich', label: 'stSandwich' },
    { id: 'water',   activity: 'waterhome', label: 'stWater' },
    { id: 'cycle',   activity: 'cycle',   label: 'stCycle' },
    { id: 'weather', activity: 'weather', label: 'stWeather' },
    { id: 'engine',  activity: 'engine',  label: 'stEngine' },
    { id: 'electric', activity: 'electric', label: 'stElectric' },
    { id: 'magnet',  activity: 'magnet',  label: 'stMagnet' },
    { id: 'light',   activity: 'light',   label: 'stLight' },
    { id: 'sunbear', activity: 'sunbear', label: 'stSunbear' },
    { id: 'speaker', activity: 'speaker', label: 'stSpeaker' },
    { id: 'computer', activity: 'computer', label: 'stComputer' },
    { id: 'power', activity: 'power', label: 'stPower' },
    { id: 'safety', activity: 'safety', label: 'stSafety' },
    { id: 'motor', activity: 'motor', label: 'stMotor' },
    { id: 'camera', activity: 'camera', label: 'stCamera' },
    { id: 'testpanel', activity: 'testpanel', label: 'stPanel' },
    { id: 'kitlab', activity: 'kitlab', label: 'stKitlab' },
    { id: 'ear', activity: 'ear', label: 'stEar' },
    { id: 'eye', activity: 'eye', label: 'stEye' },
    { id: 'rainbow', activity: 'rainbow', label: 'stRainbow' }
  ];

  const IDS = STICKERS.map(s => s.id);

  /* parsed once and kept, so a render loop calling `starsOf` every frame is
     not re-parsing JSON every frame */
  let cache = null;

  function all() {
    if (cache) return cache;
    let o = {};
    try { o = JSON.parse(ARG.store.get(KEY) || '{}') || {}; } catch (e) { o = {}; }
    if (typeof o !== 'object' || Array.isArray(o)) o = {};
    cache = o;
    return cache;
  }

  function save() { ARG.store.set(KEY, JSON.stringify(cache)); }

  /* Record a sticker. Awards only ever go up, so calling this from a render
     loop is safe — it is a no-op unless the result is better than before. */
  function award(id, stars) {
    if (IDS.indexOf(id) < 0) return 0;
    const s = clamp(stars === undefined ? 1 : stars, 1, 3);
    const o = all();
    const had = o[id] || 0;
    if (had >= s) return had;
    o[id] = s;
    save();
    return s;
  }

  function starsOf(id) { return all()[id] || 0; }

  /* the whole book, for the home screen to draw */
  function book() {
    return STICKERS.map(s => ({ id: s.id, activity: s.activity, label: s.label, stars: starsOf(s.id) }));
  }

  function earned() { return STICKERS.filter(s => starsOf(s.id) > 0).length; }
  function total() { return STICKERS.reduce((n, s) => n + starsOf(s.id), 0); }

  function reset() { cache = {}; save(); }

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  return {
    award, starsOf, book, earned, total, reset,
    get count() { return STICKERS.length; },
    STICKERS
  };
})();
