/* ═══════════════════════════════════════════
   Water Cycle — i18n
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.i18n = (function () {

  const DICT = {
    en: {
      title: 'Water Cycle',
      menu: 'Menu',

      hudStep: 'Stage',
      hudMode: 'Mode',
      modeStep: 'STEP',
      modeWatch: 'WATCH',

      c1: 'Evaporation',
      c2: 'Transpiration',
      c3: 'Condensation',
      c4: 'Precipitation',
      c5: 'Runoff',
      c6: 'River',
      c7: 'Lake & groundwater',
      c8: 'Back to the sea',

      cf1: 'The sun heats the sea and lakes. Water molecules escape into the air as vapour. About 86 % of the world’s evaporation comes from the oceans.',
      cf2: 'Plants pull water up from the soil and release it as vapour through tiny holes called stomata. Evaporation plus transpiration is called evapotranspiration.',
      cf3: 'The vapour rises, cools, and condenses on tiny dust or sea-salt particles. Clouds are made of tiny droplets — not water vapour.',
      cf4: 'Droplets bump together and grow until they are heavy enough to fall as rain, snow or hail. A raindrop is usually about 0.5–5 mm across.',
      cf5: 'Water flows over the ground into streams. Plants, soil and ponds slow it down, giving it time to soak in instead of rushing away.',
      cf6: 'Streams join into rivers. A river carries water and soil downhill toward the sea, and a river gauge measures its level and flow.',
      cf7: 'Some water collects in lakes. Some soaks deep into the ground and fills aquifers, where it can stay for years. Wells and plants use it.',
      cf8: 'The river reaches the sea, and the sun begins lifting the water again. The same water has been going round this cycle for billions of years.',

      next: 'NEXT',
      back: 'BACK',
      watch: 'WATCH',
      stopWatch: 'STOP',
      restart: 'START AGAIN',
      note: 'Watch the blue drop move through every stage. Tap any stage to read it again.',
      noteEnd: 'You followed one drop all the way around. The cycle has no start or end.',

      lead: 'Water cycle',
      statusStep: 'Following the drop',
      statusWatch: 'Watching',
      statusDone: 'Cycle complete',

      resultText: 'You followed a drop from the sea, into the sky, back to the land and home to the sea.',
      sticker: 'Water cycle',

      lSea: 'sea',
      lEvap: 'evaporation',
      lPlant: 'transpiration',
      lCloud: 'condensation',
      lRain: 'precipitation',
      lRunoff: 'runoff',
      lRiver: 'river',
      lLake: 'lake',
      lGround: 'groundwater',

      helpTitle: 'The water cycle',
      helpBody: `
        <h3>One drop, going round and round</h3>
        <ul>
          <li><b>Evaporation</b> — the sun lifts water from the sea and lakes as vapour.</li>
          <li><b>Transpiration</b> — plants release water vapour through their leaves.</li>
          <li><b>Condensation</b> — vapour cools and forms cloud droplets around dust and salt.</li>
          <li><b>Precipitation</b> — droplets grow and fall as rain, snow or hail.</li>
          <li><b>Runoff</b> — water flows over the land into streams.</li>
          <li><b>River</b> — streams join and carry the water downhill.</li>
          <li><b>Lake and groundwater</b> — some water is stored in lakes or underground aquifers.</li>
          <li><b>Back to the sea</b> — and the cycle begins again.</li>
        </ul>
        <h3>Two things to remember</h3>
        <ul>
          <li>Clouds are made of <b>tiny liquid droplets</b>, not water vapour.</li>
          <li>The cycle is driven by the sun and by gravity. It has no beginning and no end.</li>
        </ul>
      `
    },

    zh: {
      title: '水循环',
      menu: '菜单',

      hudStep: '阶段',
      hudMode: '模式',
      modeStep: '手动',
      modeWatch: '自动',

      c1: '蒸发',
      c2: '蒸腾',
      c3: '凝结',
      c4: '降水',
      c5: '地表径流',
      c6: '河流',
      c7: '湖泊与地下水',
      c8: '回到大海',

      cf1: '太阳把海水和湖水晒热，水分子变成水蒸气跑进空气里。全球大约 86% 的蒸发来自海洋。',
      cf2: '植物从土里吸水，再通过叶片上的气孔把水蒸气放出来。蒸发加蒸腾，合起来叫“蒸散”。',
      cf3: '水蒸气往上升，遇冷后凝结在细小的灰尘或海盐颗粒上。云是由小水滴组成的，不是水蒸气。',
      cf4: '小水滴互相碰撞、慢慢变大，重到一定程度就落下来，成为雨、雪或冰雹。一颗雨滴通常只有 0.5–5 毫米。',
      cf5: '水沿着地面流进小溪。植物、泥土和水塘会让它慢下来，给它时间渗进土里，而不是一下子冲走。',
      cf6: '小溪汇成河流。河流带着水和泥沙往低处流，最后奔向大海；水位计会测量它的水位和流量。',
      cf7: '有些水积在湖泊里，有些渗进地下，储存在含水层里，可以待上好几年。井和植物都会用到它。',
      cf8: '河流回到大海，太阳又开始把水抬起来。同样的水，已经在这个循环里转了几十亿年。',

      next: '下一步',
      back: '上一步',
      watch: '自动播放',
      stopWatch: '停止',
      restart: '重新开始',
      note: '看着蓝色水滴走过每个阶段。点任意一个阶段，可以再读一次。',
      noteEnd: '你跟着一滴水走完了一整圈。水循环没有起点，也没有终点。',

      lead: '水循环',
      statusStep: '跟着水滴',
      statusWatch: '自动播放中',
      statusDone: '循环完成',

      resultText: '你跟着一滴水从大海升上天空，又回到陆地，最后回到大海。',
      sticker: '水循环',

      lSea: '大海',
      lEvap: '蒸发',
      lPlant: '蒸腾',
      lCloud: '凝结',
      lRain: '降水',
      lRunoff: '径流',
      lRiver: '河流',
      lLake: '湖泊',
      lGround: '地下水',

      helpTitle: '水循环',
      helpBody: `
        <h3>一滴水，转了一圈又一圈</h3>
        <ul>
          <li><b>蒸发</b> — 太阳把海水和湖水变成水蒸气抬到空中。</li>
          <li><b>蒸腾</b> — 植物通过叶子把水蒸气放出来。</li>
          <li><b>凝结</b> — 水蒸气遇冷，围着灰尘和海盐形成云滴。</li>
          <li><b>降水</b> — 云滴变大，落成雨、雪或冰雹。</li>
          <li><b>径流</b> — 水沿着地面流进小溪。</li>
          <li><b>河流</b> — 小溪汇成河，把水带向低处。</li>
          <li><b>湖泊与地下水</b> — 一部分水储存在湖里或地下含水层。</li>
          <li><b>回到大海</b> — 然后重新开始。</li>
        </ul>
        <h3>记住两件事</h3>
        <ul>
          <li>云是<b>小水滴</b>组成的，不是水蒸气。</li>
          <li>水循环靠太阳和重力推动，没有开始，也没有结束。</li>
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
