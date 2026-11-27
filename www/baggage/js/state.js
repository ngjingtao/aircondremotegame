/* baggage/js/state.js — airport baggage sortation game */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  const DESTS = [
    { code: 'KUL', city: 'Kuala Lumpur', color: '#5fb6ef' },
    { code: 'SIN', city: 'Singapore', color: '#f0a03a' },
    { code: 'BKI', city: 'Kota Kinabalu', color: '#6fbf5f' }
  ];

  const BAGS = [
    { code: 'KUL', flight: 'AK 101' },
    { code: 'SIN', flight: 'TR 453' },
    { code: 'BKI', flight: 'AK 626' },
    { code: 'KUL', flight: 'MH 714' },
    { code: 'SIN', flight: 'SQ 118' },
    { code: 'BKI', flight: 'AK 628' },
    { code: 'KUL', flight: 'AK 103' },
    { code: 'SIN', flight: 'TR 457' }
  ];

  function fresh() {
    return {
      i: 0,
      running: false,
      t: 0,
      duration: 6,
      score: 0,
      mistakes: 0,
      results: [],
      feedback: '',
      feedbackOk: false,
      done: false
    };
  }

  let S = fresh();

  function bag() { return BAGS[S.i] || BAGS[BAGS.length - 1]; }
  function dest() { return DESTS.filter(d => d.code === bag().code)[0]; }
  function stars() {
    if (!S.done) return 0;
    if (S.mistakes === 0) return 3;
    if (S.mistakes <= 2) return 2;
    return 1;
  }

  function nextBag() {
    S.i++;
    S.t = 0;
    if (S.i >= BAGS.length) {
      S.done = true;
      S.running = false;
    }
  }

  function start() {
    if (S.done) return { sound: 'deny' };
    if (S.running) return { sound: 'blip' };
    S.running = true;
    S.t = 0;
    S.feedback = '';
    return { sound: 'powerOn' };
  }

  function sort(el) {
    if (!S.running) return { sound: 'deny' };
    const chute = +(el && el.dataset ? el.dataset.chute : -1);
    if (!(chute >= 0 && chute < DESTS.length)) return { sound: 'deny' };
    const want = bag().code;
    if (DESTS[chute].code === want) {
      S.score++;
      S.results.push('ok');
      S.feedback = 'ok';
      S.feedbackOk = true;
      nextBag();
      return { sound: 'chime', ok: true };
    }
    S.mistakes++;
    S.results.push('wrong');
    S.feedback = 'wrong';
    S.feedbackOk = false;
    nextBag();
    return { sound: 'warn', wrong: true };
  }

  function tick(dt) {
    if (!S.running) return S;
    S.t += Math.min(dt, 0.08);
    if (S.t >= S.duration) {
      S.mistakes++;
      S.results.push('miss');
      S.feedback = 'miss';
      S.feedbackOk = false;
      nextBag();
    }
    return S;
  }

  function reset() {
    S = fresh();
    return { sound: 'chime' };
  }

  const ACTIONS = {
    start,
    sort,
    reset,
    next() {
      if (S.running) return { sound: 'deny' };
      if (S.done) return { sound: 'deny' };
      S.running = true;
      S.t = 0;
      return { sound: 'blip' };
    }
  };

  function press(action, el) {
    const fn = ACTIONS[action];
    if (!fn) return null;
    return fn(el) || { sound: 'blip' };
  }

  function factKey() {
    if (S.done) return 'factDone';
    if (S.running) return 'factSort';
    return 'factIntro';
  }

  return {
    get s() { return S; },
    press, tick, reset, bag, dest, stars, factKey,
    DESTS, BAGS, fresh: () => { S = fresh(); return S; }
  };
})();
