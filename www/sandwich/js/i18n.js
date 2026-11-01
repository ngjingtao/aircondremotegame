/* ═══════════════════════════════════════════
   Breakfast Sandwich — i18n
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.i18n = (function () {

  const DICT = {
    en: {
      title: 'Breakfast Sandwich',
      menu: 'Menu',

      hudBalance: 'Balance',
      hudPan: 'Pan',

      bWhite: 'WHITE',
      bWhole: 'WHOLEMEAL',
      bSour: 'SOURDOUGH',
      sButter: 'BUTTER',
      sAvo: 'AVOCADO',
      sMayo: 'MAYO',
      sNone: 'NONE',
      fEgg: 'FRIED EGG',
      fCheese: 'CHEESE',
      fEggCheese: 'EGG + CHEESE',
      fBacon: 'BACON',
      vTomato: 'TOMATO',
      vSpinach: 'SPINACH',
      vLettuce: 'LETTUCE',
      vNone: 'NONE',

      bread: 'BREAD',
      spread: 'SPREAD',
      filling: 'FILLING',
      veg: 'VEGETABLE',
      heat: 'HEAT',
      hLow: 'LOW',
      hMed: 'MEDIUM',
      hHigh: 'HIGH',

      toPan: 'TO THE PAN',
      startCook: 'START COOKING',
      stopCook: 'STOP',
      buildIt: 'BUILD IT',
      again: 'MAKE ANOTHER',

      lead: 'Breakfast',
      statusBuild: 'Ready',
      statusCook: 'Cooking',
      statusReady: 'Cooked',
      statusDone: 'Served',

      lPan: 'pan',
      lEgg: 'egg',
      lBread: 'bread',
      lSpread: 'spread',
      lFilling: 'filling',
      lVeg: 'veg',
      lPlate: 'plate',

      cookSafety: 'Ask an adult: a real pan and stove get very hot. This is a simulation — cook with a grown-up.',
      cookAdult: '👤 Ask an adult for the real stove',

      tBuild: 'Wholemeal bread, avocado, egg and a vegetable make a balanced breakfast. A spread also stops a wet tomato making the bread soggy.',
      tCook: 'Watch the egg. Stop while the marker is in the green band — too early is runny, too late is rubbery.',
      tReady: 'Stack it: bread, spread, filling, vegetables, then the top slice. Cut it in half so you can see the layers.',
      tBalance: 'A balanced breakfast has a slow-release carbohydrate, some protein, some healthy fat and a fruit or vegetable.',
      tEgg: 'Cook eggs until both the white and the yolk are set. Heat kills the bacteria; a runny yolk is a risk for young children and older people.',
      tSoggy: 'Spread the bread first. Butter, avocado or mayo makes a thin water-proof layer, so tomato juice does not soak into the bread.',

      sandwichPerfect: 'A balanced breakfast, and the egg is cooked just right.',
      sandwichRunny: 'Tasty, but the egg is still runny. Cook it a little longer so the white and yolk are set.',
      sandwichBurnt: 'The egg is rubbery and browned. Next time, stop earlier — the green band is the target.',
      sandwichSoggy: 'The bread is soggy. With no spread, the tomato juice soaked straight in.',
      sandwichCook: 'A little under or over — aim for the green band so the egg is just set.',
      sandwichPlain: 'A good sandwich, but not quite a balanced breakfast. Try wholemeal, avocado, egg and a vegetable.',

      helpTitle: 'Make a breakfast sandwich',
      helpBody: `
        <h3>Build it</h3>
        <ul>
          <li>Choose a bread, a spread, a filling and a vegetable.</li>
          <li><b>Wholemeal</b> gives fibre; <b>avocado</b> gives healthy fat; <b>egg</b> gives protein; <b>tomato or spinach</b> adds vitamins and fibre.</li>
          <li><b>Spread matters:</b> it makes a barrier so tomato juice does not turn the bread soggy.</li>
        </ul>
        <h3>Cook it</h3>
        <ul>
          <li>Press <code>TO THE PAN</code>, choose a heat, then <code>START COOKING</code>.</li>
          <li>Stop while the marker is in the green band. Low heat takes about 8 s, medium about 5 s, high about 3.5 s.</li>
          <li>Too early leaves the egg runny; too late makes it rubbery and browned.</li>
        </ul>
        <h3>Safety</h3>
        <ul>
          <li><b>Ask an adult.</b> A real pan, oil and stove get very hot. Cook with a grown-up and turn the handle away from the edge.</li>
          <li>Wash your hands before and after touching food, and cook the egg until the white and yolk are set.</li>
        </ul>
        <h3>Three stars</h3>
        <ul>
          <li>★ build a complete sandwich.</li>
          <li>★★ stop the egg in the green band.</li>
          <li>★★★ do that <b>and</b> make it balanced, with no soggy bread.</li>
        </ul>
      `
    },

    zh: {
      title: '早餐三明治',
      menu: '菜单',

      hudBalance: '均衡',
      hudPan: '煎锅',

      bWhite: '白面包',
      bWhole: '全麦面包',
      bSour: '酸种面包',
      sButter: '黄油',
      sAvo: '牛油果',
      sMayo: '蛋黄酱',
      sNone: '不涂',
      fEgg: '煎蛋',
      fCheese: '芝士',
      fEggCheese: '蛋 + 芝士',
      fBacon: '培根',
      vTomato: '番茄',
      vSpinach: '菠菜',
      vLettuce: '生菜',
      vNone: '不加',

      bread: '面包',
      spread: '涂抹',
      filling: '馅料',
      veg: '蔬菜',
      heat: '火力',
      hLow: '小火',
      hMed: '中火',
      hHigh: '大火',

      toPan: '去煎锅',
      startCook: '开始煎',
      stopCook: '关火',
      buildIt: '叠起来',
      again: '再做一份',

      lead: '早餐',
      statusBuild: '待制作',
      statusCook: '正在煎',
      statusReady: '煎好了',
      statusDone: '可以吃了',

      lPan: '煎锅',
      lEgg: '蛋',
      lBread: '面包',
      lSpread: '涂抹',
      lFilling: '馅料',
      lVeg: '蔬菜',
      lPlate: '盘子',

      cookSafety: '请大人帮忙：真实的煎锅和炉子很烫。这是模拟游戏，真的煎蛋要和大人在厨房里做。',
      cookAdult: '👤 真炉子要请大人帮忙',

      tBuild: '全麦面包、牛油果、蛋和蔬菜，就是一份均衡的早餐。先涂一层酱，还能防止番茄的水把面包泡软。',
      tCook: '盯着蛋。水分标记停在绿色区域时关火 — 太早会流心，太晚会变橡皮。',
      tReady: '按顺序叠：面包、涂抹、馅料、蔬菜，再盖上另一片。切成两半，就能看到每一层。',
      tBalance: '均衡的早餐要有缓慢释放的碳水、蛋白质、健康脂肪，还有水果或蔬菜。',
      tEgg: '蛋要煎到蛋白和蛋黄都凝固。高温能杀死细菌；流心蛋对小朋友和老人有风险。',
      tSoggy: '先在面包上涂一层。黄油、牛油果或蛋黄酱会形成防水层，番茄汁就不会直接渗进面包。',

      sandwichPerfect: '一份均衡的早餐，蛋也煎得刚刚好。',
      sandwichRunny: '很好吃，但蛋还是流心的。再多煎一会儿，让蛋白和蛋黄都凝固。',
      sandwichBurnt: '蛋变橡皮了，还煎焦了。下次早点关火 — 绿色区域才是目标。',
      sandwichSoggy: '面包湿了。没有涂酱，番茄汁直接渗进去了。',
      sandwichCook: '有点太生或太熟 — 让蛋停在绿色区域，刚刚凝固最好。',
      sandwichPlain: '三明治不错，但还不算均衡的早餐。试试全麦、牛油果、蛋和蔬菜。',

      helpTitle: '做一份早餐三明治',
      helpBody: `
        <h3>先搭配</h3>
        <ul>
          <li>选面包、涂抹、馅料和蔬菜。</li>
          <li><b>全麦</b>提供纤维，<b>牛油果</b>提供健康脂肪，<b>蛋</b>提供蛋白质，<b>番茄或菠菜</b>补充维生素和纤维。</li>
          <li><b>涂抹很重要：</b>它像一层防水墙，番茄汁就不会把面包泡软。</li>
        </ul>
        <h3>再煎蛋</h3>
        <ul>
          <li>按 <code>去煎锅</code>，选火力，再按 <code>开始煎</code>。</li>
          <li>水分标记停在绿色区域时关火。小火约 8 秒，中火约 5 秒，大火约 3.5 秒。</li>
          <li>太早蛋是流心的；太晚蛋会变橡皮，还会煎焦。</li>
        </ul>
        <h3>安全</h3>
        <ul>
          <li><b>请大人帮忙。</b>真实的煎锅、油和炉子很烫。和大人在厨房里做，锅柄要转离炉边。</li>
          <li>碰食物前后要洗手；蛋要煎到蛋白和蛋黄都凝固。</li>
        </ul>
        <h3>三颗星</h3>
        <ul>
          <li>★ 做出完整的三明治。</li>
          <li>★★ 在绿色区域关火。</li>
          <li>★★★ 做到以上两点，<b>而且</b>搭配均衡、面包不湿。</li>
        </ul>
      `
    }
  };

  let lang = ARG.store.get('arg.lang');
  if (!lang || !DICT[lang]) lang = 'zh';
  if (ARG.config && ARG.config.lockLang) lang = ARG.config.lockLang;

  function t(key) {
    const v = DICT[lang][key];
    if (v !== undefined) return v;
    return DICT.en[key] !== undefined ? DICT.en[key] : key;
  }

  function apply(root) {
    (root || document).querySelectorAll('[data-i18n]').forEach(el => {
      const v = DICT[lang][el.dataset.i18n];
      if (v !== undefined) el.textContent = v;
    });
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    const lt = document.getElementById('help-title');
    if (lt) lt.textContent = t('helpTitle');
    const hb = document.getElementById('help-body');
    if (hb) hb.innerHTML = DICT[lang].helpBody;
    const bl = document.getElementById('btn-lang');
    if (bl) {
      bl.textContent = lang === 'en' ? 'EN' : '中文';
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
