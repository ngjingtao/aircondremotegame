/* restaurant/js/i18n.js */
window.ARG = window.ARG || {};

ARG.i18n = (function () {
  const DICT = {
    en: {
      title: 'Bunny Restaurant',
      menu: 'Menu',
      lead: 'Bunny restaurant',
      hudEarned: 'Earned', hudRound: 'Customer',
      order: 'Order', serve: 'Tap the food the customer ordered',
      total: 'What is the total?', pay: 'Choose a note to pay', change: 'How much change?',
      start: 'START', reset: 'NEW SHIFT', again: 'PLAY AGAIN',
      factServe: 'Read the order, then tap each dish in the menu to put it on the tray.',
      factTotal: 'Add the prices. Choose the correct total.',
      factPay: 'Choose a note that is enough to pay. The customer will need change.',
      factChange: 'Subtract the total from the note. Give back the right change.',
      factDone: 'Shift complete. Count the money you earned.',
      statusServe: 'Taking the order', statusPay: 'Ready to pay', statusDone: 'Shift complete',
      feedbackServe: 'That dish is not on this order.',
      wrongTotal: 'Not the right total — add again.',
      notEnough: 'That note is not enough.',
      wrongChange: 'Wrong change — try again.',
      paid: 'Paid correctly!',
      resultTitle: 'Shift complete',
      resultText: 'You served {s} of {n} customers and earned {m}.',
      toastDone: 'Restaurant badge earned!',
      helpTitle: 'Bunny Restaurant',
      helpSub: 'Take orders, add prices, give change',
      helpBody: `
        <h3>How to play</h3>
        <ul>
          <li>Read the customer's order.</li>
          <li>Tap the ordered dishes in the menu.</li>
          <li>Add the prices and choose the total.</li>
          <li>Choose a note big enough to pay.</li>
          <li>Work out the change and give it back.</li>
        </ul>
        <h3>Money skills</h3>
        <p>Adding prices, recognising notes (RM 5, 10, 20, 50), and subtracting to make change. Prices use one decimal place, like RM 4.50.</p>`
    },
    zh: {
      title: '兔子餐厅',
      menu: '菜单',
      lead: '兔子餐厅',
      hudEarned: '收入', hudRound: '顾客',
      order: '点单', serve: '点一下顾客要的菜',
      total: '一共多少钱？', pay: '选一张钞票付钱', change: '要找回多少钱？',
      start: '开始', reset: '重新值班', again: '再玩一次',
      factServe: '看清点单，然后在菜单里点出顾客要的每一道菜，放到托盘上。',
      factTotal: '把价格加起来，选出正确的总数。',
      factPay: '选一张足够付钱的钞票，顾客还要找零。',
      factChange: '用钞票减去总数，找回正确的零钱。',
      factDone: '值班结束，数一数你赚了多少钱。',
      statusServe: '正在点单', statusPay: '准备付钱', statusDone: '值班结束',
      feedbackServe: '这道菜不在这张点单上。',
      wrongTotal: '总数不对——再算一次。',
      notEnough: '这张钞票不够。',
      wrongChange: '找零不对——再试一次。',
      paid: '付对了！',
      resultTitle: '值班结束',
      resultText: '你服务了 {s} / {n} 位顾客，赚了 {m}。',
      toastDone: '兔子餐厅徽章到手！',
      helpTitle: '兔子餐厅',
      helpSub: '点单、加价格、找零',
      helpBody: `
        <h3>怎样玩</h3>
        <ul>
          <li>看清顾客的点单。</li>
          <li>在菜单里点出要的菜。</li>
          <li>把价格加起来，选出总数。</li>
          <li>选一张足够付钱的钞票。</li>
          <li>算出要找的零钱，找给顾客。</li>
        </ul>
        <h3>金钱技能</h3>
        <p>加价格、认识钞票（RM 5、10、20、50）、用减法找零。价格保留一位小数，例如 RM 4.50。</p>`
    }
  };

  /* menu */
  const M = {
    mSoup: ['Carrot soup', '胡萝卜汤', 4.5, '🥣'],
    mRice: ['Fried rice', '炒饭', 6.6, '🍚'],
    mNoodle: ['Noodles', '面条', 8.8, '🍜'],
    mDumpling: ['Dumplings', '饺子', 5.5, '🥟'],
    mJuice: ['Juice', '果汁', 3.5, '🧃'],
    mCake: ['Carrot cake', '胡萝卜蛋糕', 7.2, '🍰']
  };
  Object.keys(M).forEach(k => {
    DICT.en[k] = M[k][0];
    DICT.zh[k] = M[k][1];
    DICT.en[k + 'Price'] = 'RM ' + M[k][2].toFixed(2);
    DICT.zh[k + 'Price'] = 'RM ' + M[k][2].toFixed(2);
  });

  let lang = ARG.store.get('arg.lang');
  if (!lang || !DICT[lang]) lang = 'zh';
  if (ARG.config && ARG.config.lockLang) lang = ARG.config.lockLang;

  const t = k => (DICT[lang] && DICT[lang][k] !== undefined) ? DICT[lang][k] : k;

  function apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = DICT[lang][el.dataset.i18n];
      if (v !== undefined) el.textContent = v;
    });
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    const ht = document.getElementById('help-title');
    if (ht) ht.textContent = t('helpTitle');
    const hs = document.getElementById('help-sub');
    if (hs) hs.textContent = t('helpSub');
    const hb = document.getElementById('help-body');
    if (hb) hb.innerHTML = DICT[lang].helpBody;
    const bl = document.getElementById('btn-lang');
    if (bl) {
      bl.textContent = lang === 'en' ? '中文' : 'EN';
      if (ARG.config && ARG.config.lockLang) bl.hidden = true;
    }
  }

  function setLang(l) {
    if (ARG.config && ARG.config.lockLang) l = ARG.config.lockLang;
    if (!DICT[l]) l = 'en';
    lang = l;
    ARG.store.set('arg.lang', l);
    apply();
  }

  return {
    t, apply, setLang,
    toggle: () => setLang(lang === 'en' ? 'zh' : 'en'),
    get lang() { return lang; }
  };
})();
