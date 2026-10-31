/* ═══════════════════════════════════════════
   weather/js/state.js — read the instruments, make a forecast

   Three rounds. Each round has a set of real instrument readings; the
   player chooses fair / rain / storm. The weather is revealed after the
   guess, so the sky cannot give the answer away first.
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  const ROUNDS = [
    {
      key: 'r1', forecast: 'fair',
      pressure: 1024, trend: 'rising', humidity: 48, temp: 28,
      wind: 8, dir: 315, rain: 0, river: 1.1, sun: 8
    },
    {
      key: 'r2', forecast: 'rain',
      pressure: 1006, trend: 'falling', humidity: 78, temp: 24,
      wind: 22, dir: 225, rain: 5, river: 1.6, sun: 2
    },
    {
      key: 'r3', forecast: 'storm',
      pressure: 993, trend: 'falling', humidity: 92, temp: 22,
      wind: 48, dir: 270, rain: 22, river: 2.7, sun: 0.5
    }
  ];

  const FORECASTS = [
    { id: 'fair', key: 'fFair', ico: '☀️' },
    { id: 'rain', key: 'fRain', ico: '🌧️' },
    { id: 'storm', key: 'fStorm', ico: '⛈️' }
  ];

  function fresh() {
    return {
      round: 0,
      phase: 'read',       // read | reveal | done
      guess: '',
      correct: 0,
      revealT: 0,
      stars: 0,
      reason: ''
    };
  }

  let S = fresh();

  const current = () => ROUNDS[S.round] || ROUNDS[0];

  function rate() {
    if (S.phase !== 'done') return { stars: 0, reason: '' };
    const stars = S.correct >= 3 ? 3 : S.correct === 2 ? 2 : 1;
    const reason = S.correct >= 3 ? 'weatherPerfect' : S.correct === 2 ? 'weatherGood' : 'weatherTry';
    return { stars, reason };
  }

  const ACTIONS = {
    guess(el) {
      if (S.phase !== 'read') return { sound: 'deny' };
      const f = el && el.dataset ? el.dataset.forecast : null;
      if (!FORECASTS.some(x => x.id === f)) return { sound: 'deny' };
      S.guess = f;
      return { sound: 'beep' };
    },

    submit() {
      if (S.phase !== 'read') return { sound: 'deny' };
      if (!S.guess) return { sound: 'deny' };
      S.phase = 'reveal';
      S.revealT = 0;
      if (S.guess === current().forecast) S.correct++;
      return { sound: S.correct > 0 ? 'chime' : 'warn' };
    },

    next() {
      if (S.phase === 'done') {
        S = fresh();
        return { sound: 'chime' };
      }
      if (S.phase !== 'reveal') return { sound: 'deny' };
      if (S.round < ROUNDS.length - 1) {
        S.round++;
        S.phase = 'read';
        S.guess = '';
        S.revealT = 0;
        return { sound: 'blip' };
      }
      S.phase = 'done';
      const r = rate();
      S.stars = r.stars;
      S.reason = r.reason;
      return { sound: 'cheer' };
    },

    again() {
      S = fresh();
      return { sound: 'chime' };
    }
  };

  function press(action, el) {
    const fn = ACTIONS[action];
    if (!fn) return null;
    return fn(el) || { sound: 'blip' };
  }

  function tick(dt) {
    dt = Math.min(dt, 0.08);
    if (S.phase === 'reveal') S.revealT += dt;
    return S;
  }

  return {
    get s() { return S; },
    press, tick,
    fresh: () => { S = fresh(); return S; },
    current, rate,
    ROUNDS, FORECASTS
  };
})();
