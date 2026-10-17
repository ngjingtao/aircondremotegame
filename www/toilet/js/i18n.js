/* ═══════════════════════════════════════════
   Toilet — i18n

   The journey to the treatment plant is its own activity now.
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.i18n = (function () {

  const DICT = {
    en: {
      title: 'Toilet',
      menu: 'Menu',
      tabFlush: 'How it flushes',

      flushBtn: 'PRESS TO FLUSH',
      flushing: 'Flushing…',
      ready: 'Ready',
      stage: 'Stage',

      f0: 'Press the button',
      f1: 'Water rushes into the bowl',
      f2: 'The jet fills the trapway',
      f3: 'The siphon starts',
      f4: 'Everything is sucked away',
      f5: 'The bowl refills',

      d0: 'The button lifts a big rubber flapper at the bottom of the cistern. The water above it starts to drop.',
      d1: 'About six litres falls in two or three seconds. Some of it runs out of holes under the rim and rinses the sides of the bowl.',
      d2: 'A jet of water shoots into the S-bend and pushes the water up and over the hump, called the weir.',
      d3: 'Once the trapway is completely full, the falling water drags the rest after it. That is a siphon — it is not pushing the waste, it is pulling it.',
      d4: 'The siphon keeps pulling until air gets in and breaks it. That is the gurgle you hear at the end.',
      d5: 'Fresh water refills the bowl down to the water line. That little pool, the water seal, is what stops sewer smells coming back up into the room.',

      next: 'NEXT',
      prev: 'BACK',
      restart: 'START AGAIN',

      oCistern: 'cistern', oFlapper: 'flapper', oWeir: 'weir',
      oTrap: 'S-bend', oSeal: 'water seal', oDrain: 'drain',
      oButton: 'flush button', oFill: 'fill valve', oFloat: 'float',
      oOverflow: 'overflow tube', oRim: 'rim jets', oJet: 'siphon jet',

      yes: 'yes',

      helpTitle: 'What a flush really does',
      helpBody: `
        <h3>The one big idea</h3>
        <ul>
          <li>A toilet does not <b>push</b> the waste away — it <b>siphons</b> it. Once the S-bend fills with water, the falling water pulls the rest after it.</li>
          <li>You hear the siphon break at the end of every flush. That is the gurgle.</li>
          <li>The little pool of water left in the bowl is the <b>water seal</b>. It is the only thing stopping sewer smells coming back up into the room.</li>
        </ul>
        <h3>The parts, in the order they do something</h3>
        <ul>
          <li><b>Button → chain → flapper.</b> The flapper is hinged on the overflow tube and seals the big hole in the floor of the cistern.</li>
          <li><b>Rim jets.</b> Holes under the rim rinse the sides of the bowl on the way past.</li>
          <li><b>Siphon jet.</b> A second jet low in the bowl pushes water into the trapway to get the siphon going.</li>
          <li><b>Overflow tube.</b> A safety pipe: if the fill valve ever sticks, the water runs down here into the bowl instead of over the floor.</li>
          <li><b>Fill valve and float.</b> The float rides on the water and shuts the valve off when the cistern is full. The refill tube tops the bowl's water seal back up.</li>
        </ul>
        <h3>Where it goes next</h3>
        <ul>
          <li>Out of the S-bend and into the drain. To follow it from there — through your own pipes, the manhole at the boundary and on to the treatment plant — open <b>Indah Water</b> on the menu.</li>
        </ul>
        <h3>Never flush</h3>
        <ul>
          <li>Wet wipes, cotton buds, cooking oil or sanitary items. They do not break down and they block the pumps downstream.</li>
        </ul>
      `
    },

    zh: {
      title: '马桶',
      menu: '菜单',
      tabFlush: '怎么冲水',

      flushBtn: '按一下冲水',
      flushing: '正在冲水……',
      ready: '待命',
      stage: '阶段',

      f0: '按下冲水按钮',
      f1: '水箱的水冲进马桶',
      f2: '水流灌满弯管',
      f3: '虹吸开始了',
      f4: '全部被吸走',
      f5: '马桶重新蓄水',

      d0: '按钮抬起水箱底部那块大橡皮阀，上面的水就开始往下冲。',
      d1: '大约六升水在两三秒内冲下来。一部分从马桶边缘的小孔流出来，把内壁冲洗干净。',
      d2: '一股水流射进 S 形弯管，把里面的水推过那道高起来的坎（叫做溢流堰）。',
      d3: '等弯管被灌满之后，往下落的水就会把后面的水一起拉下去。这就是虹吸 — 它不是把脏东西推走，而是拉走。',
      d4: '虹吸会一直拉，直到空气进去把它打断。最后那声“咕噜”就是这么来的。',
      d5: '新水重新注入，停在存水线那里。这一小池水叫做水封，就是它挡住下水道的臭气，不让气味跑回房间。',

      next: '下一步',
      prev: '上一步',
      restart: '重新开始',

      oCistern: '水箱', oFlapper: '橡胶阀', oWeir: '溢流堰',
      oTrap: 'S 形弯管', oSeal: '水封', oDrain: '排水管',
      oButton: '冲水按钮', oFill: '进水阀', oFloat: '浮球',
      oOverflow: '溢流管', oRim: '冲水孔', oJet: '喷射孔',

      yes: '有',

      helpTitle: '冲水到底做了什么',
      helpBody: `
        <h3>最重要的一个概念</h3>
        <ul>
          <li>马桶不是把脏东西<b>推</b>走，而是<b>虹吸</b>拉走。弯管灌满水之后，下落的水会把后面的水一起拉下去。</li>
          <li>每次冲水最后那一声“咕噜”，就是虹吸被空气打断的声音。</li>
          <li>马桶里留下的那一小池水叫<b>水封</b>，就是它挡住下水道的臭气，不让气味跑回房间。</li>
        </ul>
        <h3>按干活的先后顺序看这些零件</h3>
        <ul>
          <li><b>按钮 → 链条 → 橡胶阀。</b>橡胶阀铰在溢流管上，平时封住水箱底部那个大出水口。</li>
          <li><b>冲水孔。</b>马桶边缘下面一圈小孔，冲水时把内壁冲洗干净。</li>
          <li><b>喷射孔。</b>碗底另一个小孔，往弯管里射一股水，把虹吸带起来。</li>
          <li><b>溢流管。</b>保险用的：万一进水阀坏了关不上，水会顺着它流进马桶，而不是溢到地板上。</li>
          <li><b>进水阀和浮球。</b>浮球浮在水面上，水箱满就把进水关掉；补水软管顺便把马桶的水封补回原来的水位。</li>
        </ul>
        <h3>接下来它去哪里</h3>
        <ul>
          <li>出弯管，进排水管。想继续跟着走 — 经过自家的管子、围墙下的人孔，一直到污水厂 — 请打开菜单里的<b>英达丽水</b>。</li>
        </ul>
        <h3>这些东西千万别冲</h3>
        <ul>
          <li>湿纸巾、棉签、废油、卫生用品。它们不会分解，会堵住下游的水泵。</li>
        </ul>
      `
    }
  };

  let lang = ARG.store.get('arg.lang');
  if (!lang || !DICT[lang]) lang = 'zh';   // Chinese unless you switch it
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
