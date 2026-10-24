/* ═══════════════════════════════════════════
   From Seed to Tree — i18n
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.i18n = (function () {

  const DICT = {
    en: {
      title: 'From Seed to Tree',
      menu: 'Menu',

      hudStage: 'Phase',
      hudHealth: 'Health',
      hudWater: 'Water',

      s0: 'Seed',
      s1: 'Germination',
      s2: 'Seedling',
      s3: 'Sapling',
      s4: 'Young tree',
      s5: 'Flowering',
      s6: 'Fruiting',
      s7: 'Dispersal',

      f0: 'A seed is a tiny plant in a tough coat, packed with its own food. It waits for warmth and moisture — some seeds can sleep for years.',
      f1: 'Water softens the coat. The seed swells, a root pushes down and a shoot pushes up. It still lives on stored food, not sunlight.',
      f2: 'The shoot opens its first leaves and starts making food from sunlight, water and air. The roots are shallow, so the soil must stay damp.',
      f3: 'The stem turns woody and the tree grows taller than a seedling. Its roots spread wider than its branches above, hunting for water and minerals.',
      f4: 'Every year the trunk adds a ring of wood under the bark. The canopy catches light, and the roots anchor the tree and store food.',
      f5: 'Flowers are the tree’s reproductive organs. Pollen must travel from one flower to another — by insects, birds, wind or even bats.',
      f6: 'The flower’s ovary swells into fruit. The fruit protects the seeds, and its ripe colour attracts animals that carry them away.',
      f7: 'Seeds travel by wind, water or animals. Most never grow; the few that land in light, water and space begin the cycle again.',

      n0: 'Damp soil · shade',
      n1: 'Damp soil · shade',
      n2: 'Damp soil · part sun',
      n3: 'Steady water · full sun',
      n4: 'Deep water · full sun',
      n5: 'Steady water · full sun',
      n6: 'Steady water · full sun',
      n7: 'Less water · full sun',

      sunLabel: 'LIGHT',
      sunShade: 'SHADE',
      sunPart: 'PART SUN',
      sunFull: 'FULL SUN',
      moisture: 'SOIL MOISTURE',
      waterBtn: 'WATER',
      plantBtn: 'PLANT THE SEED',
      pauseBtn: 'PAUSE',
      resumeBtn: 'RESUME',
      again: 'PLANT AGAIN',
      waterTaps: 'taps',

      adviceIdle: 'Press PLANT THE SEED. Keep the soil damp and the light right for each phase.',
      adviceOk: 'The conditions are right — it is growing.',
      adviceDry: 'Too dry. Give it a drink.',
      adviceWet: 'Too wet. Let the soil dry out a little.',
      adviceSun: 'Wrong light for this phase. Check what it needs.',
      advicePaused: 'Paused. The tree will wait for you.',
      adviceDone: 'The cycle is complete — a new seed is ready to travel.',
      adviceWilted: 'It wilted. Plant a new seed and try again.',

      treePerfect: 'A healthy tree from start to finish. Well looked after.',
      treeCareful: 'A healthy tree, though it had a few stressful moments.',
      treeTired: 'It reached the end, but the leaves are tired from stress.',
      treeThirsty: 'It dried out and wilted before it could make seeds.',
      treeDrowned: 'Its roots drowned in too much water.',
      treeSunburn: 'It could not cope with the light at that phase.',

      lead: 'Life cycle',
      statusIdle: 'Ready',
      statusGrowing: 'Growing',
      statusPaused: 'Paused',
      statusDone: 'Complete',
      statusWilted: 'Wilted',

      lSeed: 'seed',
      lRoots: 'roots',
      lShoot: 'shoot',
      lLeaves: 'leaves',
      lTrunk: 'trunk',
      lCanopy: 'canopy',
      lFlowers: 'flowers',
      lFruit: 'fruit',
      lSeeds: 'seeds',
      lSun: 'sun',
      lSoil: 'soil',

      toastPhase: 'New phase!',
      toastDone: 'A new seed is ready!',
      toastWilt: 'It wilted…',

      helpTitle: 'From seed to tree',
      helpBody: `
        <h3>Keep it alive, phase by phase</h3>
        <ul>
          <li>Press <code>PLANT THE SEED</code>, then watch the soil moisture and the light.</li>
          <li>Each phase needs a different band of moisture and a different amount of sun. The card tells you what it needs; the green band on the meter is the safe range.</li>
          <li>Press <code>WATER</code> to top up the soil. Water evaporates faster in full sun, so watch the marker.</li>
          <li>Too dry, too wet or the wrong light stops growth and drains health. Fix it before the plant wilts.</li>
          <li>Use <code>PAUSE</code> if you want to read without the clock running.</li>
        </ul>
        <h3>The eight phases</h3>
        <ul>
          <li><b>Seed</b> — a tiny plant with a packed lunch, waiting for warmth and water.</li>
          <li><b>Germination</b> — the root goes down, the shoot goes up, all on stored food.</li>
          <li><b>Seedling</b> — the first leaves start photosynthesis. Part sun is enough.</li>
          <li><b>Sapling</b> — a woody stem, and roots spreading wider than the branches.</li>
          <li><b>Young tree</b> — a new ring of wood every year, and a canopy catching light.</li>
          <li><b>Flowering</b> — pollen travels between flowers.</li>
          <li><b>Fruiting</b> — the ovary becomes fruit, protecting the seeds inside.</li>
          <li><b>Dispersal</b> — seeds travel by wind, water or animals, and the cycle begins again.</li>
        </ul>
        <h3>Three stars</h3>
        <ul>
          <li>★ reach the seed-dispersal phase.</li>
          <li>★★ finish with the tree’s health at least 75%.</li>
          <li>★★★ never let its health fall below 95% — a calm, steady hand.</li>
        </ul>
      `
    },

    zh: {
      title: '从种子到大树',
      menu: '菜单',

      hudStage: '阶段',
      hudHealth: '健康',
      hudWater: '浇水',

      s0: '种子',
      s1: '发芽',
      s2: '幼苗',
      s3: '小树',
      s4: '成长',
      s5: '开花',
      s6: '结果',
      s7: '传播',

      f0: '种子是一个裹在硬壳里的小生命，还带着自己的“便当”。它在等温暖和水分 — 有些种子能睡上好几年。',
      f1: '水把种皮泡软。种子胀大，根往下钻，芽往上顶。这时它靠的还是种子里的养料，不是阳光。',
      f2: '芽张开第一对叶子，开始用阳光、水和空气制造养分。根还很浅，所以土要保持湿润。',
      f3: '茎变硬变木，长得比幼苗高。根比上面的枝条伸得更宽，到处找水和矿物质。',
      f4: '每一年，树皮下面都会多一圈木头。树冠接住阳光，根把树固定住，也储存养料。',
      f5: '花是树的繁殖器官。花粉要从一朵花去到另一朵花 — 靠昆虫、鸟、风，甚至蝙蝠。',
      f6: '花的子房胀成果实。果实保护里面的种子，成熟后的颜色会吸引动物把它们带走。',
      f7: '种子靠风、水或动物旅行。大多数都不会发芽；少数落到有光、有水、有空间的地方，就重新开始一轮。',

      n0: '湿土 · 遮阴',
      n1: '湿土 · 遮阴',
      n2: '湿土 · 半日照',
      n3: '稳定供水 · 全日照',
      n4: '深层浇水 · 全日照',
      n5: '稳定供水 · 全日照',
      n6: '稳定供水 · 全日照',
      n7: '少浇水 · 全日照',

      sunLabel: '光照',
      sunShade: '遮阴',
      sunPart: '半日照',
      sunFull: '全日照',
      moisture: '土壤水分',
      waterBtn: '浇水',
      plantBtn: '种下种子',
      pauseBtn: '暂停',
      resumeBtn: '继续',
      again: '再种一棵',
      waterTaps: '次',

      adviceIdle: '按“种下种子”。每个阶段都要把土里的水分和光照调对。',
      adviceOk: '条件刚好 — 它正在长大。',
      adviceDry: '太干了，给它喝点水。',
      adviceWet: '太湿了，让土稍微干一点。',
      adviceSun: '这个阶段的光照不对，看看它需要什么。',
      advicePaused: '已暂停。小树会等你。',
      adviceDone: '生命周期完成了 — 新的种子可以去旅行了。',
      adviceWilted: '它枯萎了。重新种一颗种子吧。',

      treePerfect: '从种子到传播，全程都很健康。照顾得真好。',
      treeCareful: '树很健康，不过中间有过几次紧张的时刻。',
      treeTired: '它走到了最后，但叶子被折腾得很累。',
      treeThirsty: '它还没结出种子就干枯了。',
      treeDrowned: '根泡在太多水里，烂掉了。',
      treeSunburn: '这个阶段的光照太强，它受不了。',

      lead: '生命周期',
      statusIdle: '待机',
      statusGrowing: '正在长大',
      statusPaused: '已暂停',
      statusDone: '完成',
      statusWilted: '枯萎了',

      lSeed: '种子',
      lRoots: '根',
      lShoot: '芽',
      lLeaves: '叶子',
      lTrunk: '树干',
      lCanopy: '树冠',
      lFlowers: '花',
      lFruit: '果实',
      lSeeds: '种子',
      lSun: '阳光',
      lSoil: '土壤',

      toastPhase: '进入新阶段！',
      toastDone: '新的种子准备好了！',
      toastWilt: '它枯萎了……',

      helpTitle: '从种子到大树',
      helpBody: `
        <h3>一个阶段一个阶段地照顾它</h3>
        <ul>
          <li>按 <code>种下种子</code>，然后盯着土壤水分和光照。</li>
          <li>每个阶段需要的水分范围不一样，光照也不一样。卡片会告诉你需要什么，水分计上的绿色区域就是安全范围。</li>
          <li>按 <code>浇水</code> 给土加水。全日照下水分蒸发得快，要留意水分标记。</li>
          <li>太干、太湿或光照不对，生长就会停下，健康也会下降。在它枯萎前赶紧调整。</li>
          <li>想慢慢读说明时，可以按 <code>暂停</code>。</li>
        </ul>
        <h3>八个阶段</h3>
        <ul>
          <li><b>种子</b> — 一个带着“便当”的小生命，等温暖和水。</li>
          <li><b>发芽</b> — 根往下、芽往上，靠的是种子储存的养料。</li>
          <li><b>幼苗</b> — 第一对叶子开始光合作用，半日照就够了。</li>
          <li><b>小树</b> — 茎变木质，根比枝条伸得更宽。</li>
          <li><b>成长</b> — 每年多一圈年轮，树冠接住阳光。</li>
          <li><b>开花</b> — 花粉在花与花之间旅行。</li>
          <li><b>结果</b> — 子房变成果实，保护里面的种子。</li>
          <li><b>传播</b> — 种子靠风、水或动物旅行，然后重新开始。</li>
        </ul>
        <h3>三颗星</h3>
        <ul>
          <li>★ 走到传播种子的阶段。</li>
          <li>★★ 结束时树的健康不低于 75%。</li>
          <li>★★★ 全程健康都不低于 95% — 稳稳地照顾它。</li>
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
