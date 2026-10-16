/* ═══════════════════════════════════════════
   Toilet & Indah Water — i18n
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.i18n = (function () {

  const DICT = {
    en: {
      title: 'Toilet & Indah Water',
      menu: 'Menu',
      tabFlush: 'How it flushes',
      tabTreat: 'How it gets cleaned',

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

      s0: 'Wastewater arrives',
      s1: 'Screening',
      s2: 'Grit removal',
      s3: 'Primary tank',
      s4: 'Aeration tank',
      s5: 'Secondary clarifier',
      s6: 'Disinfection',
      s7: 'Out to the river',

      e0: 'Everything from your house — toilet, shower, sink, washing machine — flows downhill through pipes to a sewage treatment plant. In Malaysia most of these plants are run by Indah Water.',
      e1: 'Big bar screens catch rags, wet wipes, cotton buds and plastic. These are the worst things for blocking pipes, so they come out first.',
      e2: 'The flow slows right down so sand, grit and coffee grounds sink to the bottom and are scraped away.',
      e3: 'The water is left to sit still. Heavy solids sink to the bottom as sludge, and grease and oil float to the top where they are skimmed off.',
      e4: 'This is the clever part. Air is pumped in and billions of bacteria eat the organic waste. It is a biological process — exactly how a river cleans itself, only thousands of times faster.',
      e5: 'The water is left to settle again. The bacteria clump together and sink to the bottom. Some are pumped back to the aeration tank to keep working — that is called return activated sludge.',
      e6: 'The now-clear water is disinfected to kill the germs that are left, so it is safe to release.',
      e7: 'Now it is clean enough to meet the government standard and go back into the river. The leftover sludge is thickened, dried and used as fertiliser.',

      next: 'NEXT',
      prev: 'BACK',
      restart: 'START AGAIN',

      oCistern: 'cistern', oFlapper: 'flapper', oWeir: 'weir',
      oTrap: 'S-bend', oSeal: 'water seal', oDrain: 'drain',
      pScreen: 'screen', pGrit: 'grit', pPrimary: 'primary',
      pAeration: 'aeration', pClarifier: 'clarifier', pDisinfect: 'disinfection',
      pRiver: 'river', pSludge: 'sludge',

      yes: 'yes',
      airOn: 'AIR ON',
      airOff: 'AIR OFF',
      sludge: 'SLUDGE → fertiliser',
      clean: 'clean water',

      helpTitle: 'Where it goes after you flush',
      helpBody: `
        <h3>Two halves</h3>
        <ul>
          <li><code>How it flushes</code> — what actually happens inside a toilet when you press the button.</li>
          <li><code>How it gets cleaned</code> — the journey through an Indah Water sewage treatment plant, all the way back to the river.</li>
        </ul>
        <h3>The two big ideas</h3>
        <ul>
          <li>A toilet does not push the waste away — it <b>siphons</b> it. Once the S-bend fills with water, the falling water pulls the rest after it.</li>
          <li>The little pool of water left in the bowl, the <b>water seal</b>, is what stops sewer smells coming back up.</li>
          <li>Sewage is cleaned mostly by <b>living bacteria</b>. People build tanks and pump in air; the bacteria do the actual work.</li>
        </ul>
        <h3>Never flush</h3>
        <ul>
          <li>Wet wipes, cotton buds, cooking oil or sanitary items. They do not break down and they block the pumps.</li>
        </ul>
      `
    },

    zh: {
      title: '马桶与英达丽水',
      menu: '菜单',
      tabFlush: '怎么冲水',
      tabTreat: '怎么变干净',

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

      s0: '污水来了',
      s1: '格栅拦污',
      s2: '沉砂',
      s3: '初沉池',
      s4: '曝气池',
      s5: '二沉池',
      s6: '消毒',
      s7: '排回河里',

      e0: '家里所有用过的水 — 马桶、洗澡、洗碗、洗衣机 — 顺着管道一路流到污水处理厂。在马来西亚，这些厂大多由英达丽水（Indah Water）运营。',
      e1: '粗格栅先把抹布、湿纸巾、棉签和塑料拦住。这些东西最容易堵管道，所以要最先拿掉。',
      e2: '水流慢下来，沙子、砂砾和咖啡渣沉到底部，被刮走。',
      e3: '让水静静待着。重的固体沉到池底变成污泥，油脂浮到水面被刮掉。',
      e4: '这是最聪明的一步。往水里打空气，上亿个细菌把有机废物吃掉。这是生物过程 — 河流自净也是靠它，只是这里快上几千倍。',
      e5: '再让水静下来。细菌抱团沉到池底。一部分被抽回曝气池继续干活，这叫回流污泥。',
      e6: '已经变清的水要消毒，把剩下的病菌杀掉，才能安全排放。',
      e7: '这时水已经干净到符合政府标准，可以排回河里。剩下的污泥经过浓缩、干化，还能当肥料。',

      next: '下一步',
      prev: '上一步',
      restart: '重新开始',

      oCistern: '水箱', oFlapper: '橡胶阀', oWeir: '溢流堰',
      oTrap: 'S 形弯管', oSeal: '水封', oDrain: '排水管',
      pScreen: '格栅', pGrit: '沉砂池', pPrimary: '初沉池',
      pAeration: '曝气池', pClarifier: '二沉池', pDisinfect: '消毒',
      pRiver: '河流', pSludge: '污泥',

      yes: '有',
      airOn: '曝气中',
      airOff: '停止曝气',
      sludge: '污泥 → 肥料',
      clean: '干净的水',

      helpTitle: '冲完之后它去了哪里',
      helpBody: `
        <h3>两个部分</h3>
        <ul>
          <li><code>怎么冲水</code> — 按下按钮时，马桶内部到底发生了什么。</li>
          <li><code>怎么变干净</code> — 跟着水流走一趟英达丽水的污水处理厂，一直到回到河里。</li>
        </ul>
        <h3>两个重点</h3>
        <ul>
          <li>马桶不是把脏东西“推”走，而是<b>虹吸</b>拉走。弯管灌满水之后，下落的水会把后面的水一起拉下去。</li>
          <li>马桶里留下的那一小池水叫<b>水封</b>，就是它挡住下水道的臭气。</li>
          <li>污水主要是靠<b>活着的细菌</b>变干净的。人只是建池子、打空气；真正干活的是细菌。</li>
        </ul>
        <h3>这些东西千万别冲</h3>
        <ul>
          <li>湿纸巾、棉签、废油、卫生用品。它们不会分解，还会堵住水泵。</li>
        </ul>
      `
    }
  };

  let lang = ARG.store.get('arg.lang');
  if (!lang || !DICT[lang]) lang = 'zh';   // Chinese unless you switch it

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
    if (bl) bl.textContent = lang === 'en' ? 'EN' : '中文';
  }

  function setLang(l) {
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
