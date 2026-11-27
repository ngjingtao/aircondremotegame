/* restaurant/js/state.js — bunny restaurant money game */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  const MENU = [
    { id: 'soup', key: 'mSoup', price: 4.5, ico: '🥣' },
    { id: 'rice', key: 'mRice', price: 6.6, ico: '🍚' },
    { id: 'noodle', key: 'mNoodle', price: 8.8, ico: '🍜' },
    { id: 'dumpling', key: 'mDumpling', price: 5.5, ico: '🥟' },
    { id: 'juice', key: 'mJuice', price: 3.5, ico: '🧃' },
    { id: 'cake', key: 'mCake', price: 7.2, ico: '🍰' }
  ];
  const BY_ID = {};
  MENU.forEach(m => { BY_ID[m.id] = m; });

  const ORDERS = [
    { items: ['soup', 'juice'] },
    { items: ['rice', 'juice'] },
    { items: ['noodle', 'juice'] },
    { items: ['dumpling', 'cake'] },
    { items: ['soup', 'rice', 'juice'] }
  ];

  const NOTES = [5, 10, 20, 50];

  function fresh() {
    return {
      round: 0,
      phase: 'serve',
      served: [],
      note: 0,
      totalOptions: [],
      changeOptions: [],
      score: 0,
      mistakes: 0,
      earned: 0,
      done: false,
      feedback: '',
      feedbackOk: false
    };
  }

  let S = fresh();

  function order() { return ORDERS[S.round] || ORDERS[ORDERS.length - 1]; }
  function orderItems() { return order().items.map(id => BY_ID[id]); }
  function total() {
    return orderItems().reduce((n, m) => n + m.price, 0);
  }
  function money(v) { return 'RM ' + v.toFixed(2); }
  function stars() {
    if (!S.done) return 0;
    if (S.mistakes === 0) return 3;
    if (S.mistakes <= 2) return 2;
    return 1;
  }

  function options(correct, count) {
    const out = [correct];
    const deltas = [1.5, -1.5, 2.5, -2.5, 1, -1];
    for (const d of deltas) {
      const v = Math.round((correct + d) * 100) / 100;
      if (v >= 0 && out.indexOf(v) < 0) out.push(v);
      if (out.length >= (count || 3)) break;
    }
    return out.slice(0, count || 3);
  }

  function beginRound() {
    S.phase = 'serve';
    S.served = [];
    S.note = 0;
    S.totalOptions = options(total(), 3);
    S.changeOptions = [];
    S.feedback = '';
  }

  function start() {
    if (S.done) return { sound: 'deny' };
    if (S.phase !== 'serve' || S.served.length) return { sound: 'blip' };
    return { sound: 'powerOn', say: true };
  }

  function serve(el) {
    if (S.phase !== 'serve') return { sound: 'deny' };
    const id = el && el.dataset ? el.dataset.item : null;
    const m = BY_ID[id];
    if (!m) return { sound: 'deny' };
    if (order().items.indexOf(id) < 0) {
      S.feedback = 'feedbackServe';
      S.feedbackOk = false;
      return { sound: 'deny', wrong: true };
    }
    if (S.served.indexOf(id) >= 0) return { sound: 'blip' };
    S.served.push(id);
    S.feedback = '';
    if (S.served.length >= order().items.length) {
      S.phase = 'total';
      S.totalOptions = options(total(), 3);
    }
    return { sound: 'blip' };
  }

  function pickTotal(el) {
    if (S.phase !== 'total') return { sound: 'deny' };
    const v = +(el && el.dataset ? el.dataset.value : NaN);
    if (!isFinite(v)) return { sound: 'deny' };
    if (Math.abs(v - total()) < 0.005) {
      S.phase = 'pay';
      S.feedback = '';
      return { sound: 'chime' };
    }
    S.mistakes++;
    S.feedback = 'wrongTotal';
    S.feedbackOk = false;
    return { sound: 'warn' };
  }

  function pay(el) {
    if (S.phase !== 'pay') return { sound: 'deny' };
    const v = +(el && el.dataset ? el.dataset.value : NaN);
    if (!isFinite(v)) return { sound: 'deny' };
    if (v < total() - 0.005) {
      S.feedback = 'notEnough';
      S.feedbackOk = false;
      return { sound: 'deny' };
    }
    S.note = v;
    S.changeOptions = options(Math.round((v - total()) * 100) / 100, 3);
    S.phase = 'change';
    S.feedback = '';
    return { sound: 'blip' };
  }

  function pickChange(el) {
    if (S.phase !== 'change') return { sound: 'deny' };
    const v = +(el && el.dataset ? el.dataset.value : NaN);
    if (!isFinite(v)) return { sound: 'deny' };
    const want = Math.round((S.note - total()) * 100) / 100;
    if (Math.abs(v - want) < 0.005) {
      S.score++;
      S.earned = Math.round((S.earned + total()) * 100) / 100;
      S.round++;
      if (S.round >= ORDERS.length) {
        S.done = true;
        S.phase = 'done';
        S.feedback = 'paid';
        S.feedbackOk = true;
      } else {
        beginRound();
        S.feedback = 'paid';
        S.feedbackOk = true;
      }
      return { sound: 'chime', say: true };
    }
    S.mistakes++;
    S.feedback = 'wrongChange';
    S.feedbackOk = false;
    return { sound: 'warn' };
  }

  function reset() {
    S = fresh();
    S.totalOptions = options(total(), 3);
    return { sound: 'chime' };
  }

  const ACTIONS = { start, serve, total: pickTotal, pay, change: pickChange, reset };

  function press(action, el) {
    const fn = ACTIONS[action];
    if (!fn) return null;
    return fn(el) || { sound: 'blip' };
  }

  function factKey() {
    if (S.done) return 'factDone';
    if (S.phase === 'serve') return 'factServe';
    if (S.phase === 'total') return 'factTotal';
    if (S.phase === 'pay') return 'factPay';
    if (S.phase === 'change') return 'factChange';
    return 'factServe';
  }

  S.totalOptions = options(total(), 3);

  return {
    get s() { return S; },
    press, reset, fresh: () => { S = fresh(); S.totalOptions = options(total(), 3); return S; },
    order, orderItems, total, money, stars, factKey,
    MENU, BY_ID, ORDERS, NOTES
  };
})();
