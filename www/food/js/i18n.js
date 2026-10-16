/* ═══════════════════════════════════════════
   Food Eating — i18n: UI strings + science facts
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.i18n = (function () {

  const DICT = {
    en: {
      title: 'Food Eating',
      menu: 'Menu',
      stage: 'Stage',
      pickFood: 'Pick a food',
      watch: 'Watch',
      manual: 'Manual',
      eatAgain: 'Eat again',
      emptyTray: 'Tray empty — bite again',
      needFood: 'Pick a food first',

      /* stages */
      sMOUTH: 'Mouth', sESOPHAGUS: 'Oesophagus', sSTOMACH: 'Stomach',
      sSMALL: 'Small intestine', sLARGE: 'Large intestine', sOUT: 'Out',

      /* organ labels on the body */
      oMouth: 'Mouth', oEso: 'Oesophagus', oStomach: 'Stomach',
      oSmall: 'Small intestine', oLarge: 'Large intestine', oRectum: 'Rectum',
      lMouth: 'mouth', lEso: 'food pipe', lStomach: 'stomach',
      lSmall: 'small int.', lLarge: 'large int.', lRectum: 'rectum',

      /* buttons */
      bChew: 'CHEW', bSwallow: 'SWALLOW', bChurn: 'CHURN',
      bPoop: 'GO TO TOILET', bBite: 'BITE', bQuiz: 'START QUIZ',
      swallowing: 'Swallowing…', absorbing: 'Absorbing…', squeezing: 'Squeezing…',
      churning: 'Churning…',

      /* meters */
      mChew: 'Chewed', mSaliva: 'Saliva', mAcid: 'Acid', mChurn: 'Churn',
      mNutrient: 'Nutrients', mWater: 'Water', mEnergy: 'Energy', mBelly: 'Belly',
      mWaste: 'Waste',

      /* foods */
      fRice: 'Rice', fApple: 'Apple', fBurger: 'Burger', fMilk: 'Milk',
      fBroccoli: 'Broccoli', fCandy: 'Candy', fWater: 'Water', fEgg: 'Egg',

      /* moods */
      moodHungry: 'Hungry', moodEating: 'Eating', moodHappy: 'Happy',
      moodFull: 'Very full', moodAche: 'Tummy ache', moodToilet: 'Needs the toilet',
      moodRelieved: 'Relieved',

      sayHungry: ['My tummy is rumbling…', 'I am hungry!', 'What can I eat?'],
      sayEating: ['Nom nom nom…', 'Yummy!', 'Chew, chew, chew!'],
      saySwallow: ['Gulp!', 'Down it goes!', 'Swallowed!'],
      sayHappy: ['That was tasty!', 'I feel good!', 'Yum, thanks!'],
      sayFull: ['I am so full…', 'My belly is stuffed!', 'No more, thank you!'],
      sayAche: ['Ouch, my tummy hurts…', 'I ate too fast…', 'I should chew more!'],
      sayToilet: ['I need the toilet!', 'Hurry, hurry!', 'My tummy feels heavy.'],
      sayRelieved: ['Ahh, much better!', 'That is a relief.', 'All clean!'],
      sayChew: ['Chew, chew…', 'Getting mushy!', 'Mmm, sweeter now!'],
      sayChurn: ['My tummy is mixing!', 'Gurgle gurgle…', 'It is churning!'],
      sayAbsorb: ['Goodness is going into my blood!', 'I can feel the energy!', 'Absorbing!'],
      sayWater: ['Soaking up the water…', 'My body is saving water!'],
      saySwallowEarly: ['I swallowed it too fast!', 'That was a big lump…'],

      toastNoChew: '⚠ Chewed too little — it will be hard to digest',
      toastWellChewed: '✔ Well chewed — good for digestion',
      toastAche: '😖 Tummy ache! Chew better next time',
      toastEnergy: '⚡ Energy gained from nutrients',
      toastWaste: '💧 Water absorbed, waste is forming',
      toastPoop: '🚽 Out it goes!',
      toastDone: '✨ Journey complete — start the quiz!',
      watchOn: '▶ Watching the journey',
      watchOff: '✋ Manual control',

      /* fact card */
      factLabel: 'Did you know?',
      factNoChew: 'You barely chewed! Big lumps are much harder for your stomach and intestines to break down. Saliva also needs time to start working on starch.',

      /* quiz */
      quizTitle: 'Quiz time!',
      quizQ1: 'Where does your body absorb most nutrients?',
      quizQ2: 'What does saliva start to break down?',
      quizQ3: 'What does the large intestine mainly absorb?',
      quizQ4: 'What pushes food down the oesophagus?',
      quizA1: 'Small intestine', quizA1b: 'Stomach', quizA1c: 'Lungs',
      quizA2: 'Starch (carbohydrate)', quizA2b: 'Water', quizA2c: 'Bones',
      quizA3: 'Water', quizA3b: 'Protein', quizA3c: 'Air',
      quizA4: 'Muscle waves (peristalsis)', quizA4b: 'Gravity only', quizA4c: 'A pump',
      quizRight: 'Correct! 🎉',
      quizWrong: 'Not quite — ',
      quizScore: 'You got {n} of {t}!',
      quizDone: 'Finish',

      helpTitle: 'How food travels through you',
      helpSub: 'Six stops, about 1–2 days',
      helpBody: `
        <h3>The journey</h3>
        <ul>
          <li><code>1 Mouth</code> — chew into a soft bolus, saliva starts on starch.</li>
          <li><code>2 Oesophagus</code> — peristalsis squeezes it down in ~7 seconds.</li>
          <li><code>3 Stomach</code> — acid + pepsin + churning make chyme (2–4 h).</li>
          <li><code>4 Small intestine</code> — ~6 m of villi absorb nutrients into blood.</li>
          <li><code>5 Large intestine</code> — ~1.5 m absorbs water; bacteria make vitamin K.</li>
          <li><code>6 Out</code> — what is left leaves as stool (12–48 h in total).</li>
        </ul>
        <h3>How to play</h3>
        <ul>
          <li>Tap a food, then <code>CHEW</code> several times. The more you chew, the better the nutrients are absorbed.</li>
          <li><code>SWALLOW</code> when it is mushy. Swallow early and you may get a tummy ache.</li>
          <li><code>CHURN</code> in the stomach, then watch absorption happen.</li>
          <li><code>GO TO TOILET</code> at the end.</li>
          <li><code>WATCH</code> plays the whole journey for you.</li>
        </ul>
      `
    },

    zh: {
      title: '吃东西',
      menu: '菜单',
      stage: '阶段',
      pickFood: '选一样食物',
      watch: '观看',
      manual: '手动',
      eatAgain: '再吃一次',
      emptyTray: '盘子空了 — 再吃一口',
      needFood: '先选一样食物',

      sMOUTH: '口腔', sESOPHAGUS: '食道', sSTOMACH: '胃',
      sSMALL: '小肠', sLARGE: '大肠', sOUT: '排出',

      oMouth: '口腔', oEso: '食道', oStomach: '胃',
      oSmall: '小肠', oLarge: '大肠', oRectum: '直肠',
      lMouth: '口腔', lEso: '食道', lStomach: '胃',
      lSmall: '小肠', lLarge: '大肠', lRectum: '直肠',

      bChew: '咀嚼', bSwallow: '吞下', bChurn: '搅拌',
      bPoop: '去厕所', bBite: '咬一口', bQuiz: '开始测验',
      swallowing: '正在吞咽……', absorbing: '正在吸收……', squeezing: '正在挤压……',
      churning: '正在搅拌……',

      mChew: '咀嚼', mSaliva: '唾液', mAcid: '胃酸', mChurn: '搅拌',
      mNutrient: '营养', mWater: '水分', mEnergy: '能量', mBelly: '肚子',
      mWaste: '废物',

      fRice: '米饭', fApple: '苹果', fBurger: '汉堡', fMilk: '牛奶',
      fBroccoli: '西兰花', fCandy: '糖果', fWater: '水', fEgg: '鸡蛋',

      moodHungry: '饿了', moodEating: '在吃', moodHappy: '开心',
      moodFull: '好饱', moodAche: '肚子疼', moodToilet: '想上厕所',
      moodRelieved: '舒服了',

      sayHungry: ['肚子咕咕叫……', '我饿了！', '有什么可以吃？'],
      sayEating: ['嗯嗯嗯……', '好好吃！', '嚼一嚼，嚼一嚼！'],
      saySwallow: ['咕咚！', '吞下去了！', '咽下去啦！'],
      sayHappy: ['真好吃！', '我感觉很好！', '谢谢，真香！'],
      sayFull: ['我好饱……', '肚子鼓鼓的！', '吃不下啦，谢谢！'],
      sayAche: ['哎哟，肚子疼……', '我吃太快了……', '我应该多嚼几下！'],
      sayToilet: ['我要上厕所！', '快点快点！', '肚子好沉。'],
      sayRelieved: ['啊，舒服多了！', '轻松啦。', '干干净净！'],
      sayChew: ['嚼嚼嚼……', '越来越烂了！', '咦，变甜了！'],
      sayChurn: ['我的胃在搅拌！', '咕噜咕噜……', '正在搅拌！'],
      sayAbsorb: ['营养进入血液了！', '我感觉有能量啦！', '正在吸收！'],
      sayWater: ['正在把水吸走……', '身体在回收水分！'],
      saySwallowEarly: ['我吞得太快了！', '好大一块……'],

      toastNoChew: '⚠ 嚼得太少 — 会很难消化',
      toastWellChewed: '✔ 嚼得很细 — 好消化',
      toastAche: '😖 肚子疼！下次要好好嚼',
      toastEnergy: '⚡ 吸收营养，获得能量',
      toastWaste: '💧 水分被吸收，废物在形成',
      toastPoop: '🚽 排出去了！',
      toastDone: '✨ 旅程完成 — 来做个测验吧！',
      watchOn: '▶ 自动观看整个旅程',
      watchOff: '✋ 手动控制',

      factLabel: '你知道吗？',
      factNoChew: '你几乎没有咀嚼！大块的食物对胃和肠来说很难分解，唾液也需要时间才能开始分解淀粉。',

      quizTitle: '小测验！',
      quizQ1: '身体在哪里吸收大部分营养？',
      quizQ2: '唾液开始分解什么？',
      quizQ3: '大肠主要吸收什么？',
      quizQ4: '是什么把食物推下食道？',
      quizA1: '小肠', quizA1b: '胃', quizA1c: '肺',
      quizA2: '淀粉（碳水化合物）', quizA2b: '水', quizA2c: '骨头',
      quizA3: '水分', quizA3b: '蛋白质', quizA3c: '空气',
      quizA4: '肌肉的波浪式蠕动', quizA4b: '只靠重力', quizA4c: '一个泵',
      quizRight: '答对了！🎉',
      quizWrong: '不太对 — ',
      quizScore: '你答对了 {n} / {t} 题！',
      quizDone: '完成',

      helpTitle: '食物在身体里的旅程',
      helpSub: '六个站点，大约 1–2 天',
      helpBody: `
        <h3>旅程</h3>
        <ul>
          <li><code>1 口腔</code> — 嚼成柔软的食团，唾液开始分解淀粉。</li>
          <li><code>2 食道</code> — 靠蠕动挤压下去，大约 7 秒。</li>
          <li><code>3 胃</code> — 胃酸 + 胃蛋白酶 + 搅拌，变成食糜（2–4 小时）。</li>
          <li><code>4 小肠</code> — 约 6 米长的绒毛把营养吸进血液。</li>
          <li><code>5 大肠</code> — 约 1.5 米，吸收水分；细菌制造维生素 K。</li>
          <li><code>6 排出</code> — 剩下的变成粪便排出（全程 12–48 小时）。</li>
        </ul>
        <h3>怎么玩</h3>
        <ul>
          <li>点一样食物，然后按 <code>咀嚼</code> 几下。嚼得越多，营养吸收得越好。</li>
          <li>嚼烂后按 <code>吞下</code>。太早吞可能会肚子疼。</li>
          <li>在胃里按 <code>搅拌</code>，然后看营养被吸收。</li>
          <li>最后按 <code>去厕所</code>。</li>
          <li>按 <code>观看</code> 可以自动播放整个旅程。</li>
        </ul>
      `
    }
  };

  let lang = ARG.store.get('arg.lang');
  if (!lang || !DICT[lang]) lang = 'zh';   // Chinese unless you switch it

  /* science facts, shown one per stage */
  const FACTS = {
    en: {
      mouth: `Teeth tear and grind food into small pieces. Saliva makes it slippery and contains <b>amylase</b>, an enzyme that starts turning starch into sugar. The mushy ball you swallow is called a <b>bolus</b>. That is why rice or bread tastes sweeter the longer you chew it.`,
      esophagus: `This tube is about 25 cm long. It does not rely on gravity — ring-shaped muscles squeeze in waves, a movement called <b>peristalsis</b>, pushing the bolus down in roughly 7 seconds. It is why astronauts can still swallow in zero gravity.`,
      stomach: `A muscular bag that holds about 1 litre. It churns roughly 3 times a minute and releases <b>hydrochloric acid</b> (pH 1.5–3.5) plus <b>pepsin</b>, which snips protein into smaller chains. A layer of <b>mucus</b> stops the acid digesting the stomach itself. After 2–4 hours the food is a soup called <b>chyme</b>.`,
      small: `About 6 metres long, folded into your belly. Its wall is covered in finger-like <b>villi</b>, and each villus is covered in even tinier <b>microvilli</b> — together roughly the area of a tennis court (about 30 m²). Sugars, amino acids, fats, vitamins and minerals cross into the blood, which takes them to the <b>liver</b> first.`,
      large: `About 1.5 metres long and home to trillions of friendly <b>bacteria</b>. It absorbs <b>water</b> and minerals, turning the leftover soup into solid waste. Those bacteria also make <b>vitamin K</b> and some B vitamins for you. <b>Fibre</b> keeps everything moving so you do not get constipated.`,
      out: `Whatever your body cannot use leaves as <b>stool</b>. Its brown colour comes from worn-out red blood cells. The whole journey, from plate to toilet, usually takes 12–48 hours. Water and fibre keep it comfortable.`
    },
    zh: {
      mouth: `牙齿把食物切碎磨烂。唾液让食物变滑，里面含有<b>淀粉酶</b>，开始把淀粉分解成糖。吞下去的那团软糊叫<b>食团</b>。所以米饭或面包越嚼越甜。`,
      esophagus: `食道大约 25 厘米长。它不是靠重力，而是靠环形肌肉一波一波地挤压，叫做<b>蠕动</b>，大约 7 秒就把食团推下去。所以宇航员在失重时也能吞咽。`,
      stomach: `胃是一个肌肉口袋，能装大约 1 升。它每分钟搅拌约 3 次，分泌<b>盐酸</b>（pH 1.5–3.5）和<b>胃蛋白酶</b>，把蛋白质切成小段。胃壁上的<b>黏液</b>保护自己不被消化。2–4 小时后，食物变成糊状的<b>食糜</b>。`,
      small: `小肠大约 6 米长，盘曲在肚子里。肠壁布满手指状的<b>绒毛</b>，每根绒毛上还有更细的<b>微绒毛</b>，摊开的面积差不多有一个网球场大（约 30 平方米）。糖、氨基酸、脂肪、维生素和矿物质透过肠壁进入血液，先送到<b>肝脏</b>。`,
      large: `大肠大约 1.5 米长，里面住着上万亿个有益的<b>细菌</b>。它吸收<b>水分</b>和矿物质，把剩下的糊状物变成固体废物。这些细菌还能帮你制造<b>维生素 K</b> 和部分 B 族维生素。<b>纤维</b>能让肠道保持通畅，不容易便秘。`,
      out: `身体用不到的东西就以<b>粪便</b>排出。它之所以是棕色，是因为里面有老旧红细胞分解的产物。从餐桌到厕所，整个旅程通常要 12–48 小时。多喝水、多吃纤维，肚子才舒服。`
    }
  };

  function t(key) {
    const v = DICT[lang][key];
    if (v !== undefined) return v;
    return DICT.en[key] !== undefined ? DICT.en[key] : key;
  }

  function pick(key) {
    const v = DICT[lang][key];
    if (Array.isArray(v)) return v[Math.floor(Math.random() * v.length)];
    return t(key);
  }

  function fact(stageKey) {
    return FACTS[lang][stageKey] || FACTS.en[stageKey] || '';
  }

  function apply(root) {
    (root || document).querySelectorAll('[data-i18n]').forEach(el => {
      const v = DICT[lang][el.dataset.i18n];
      if (v !== undefined) el.textContent = v;
    });
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    const lt = document.getElementById('help-title');
    if (lt) lt.textContent = t('helpTitle');
    const ls = document.getElementById('help-sub');
    if (ls) ls.textContent = t('helpSub');
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
    t, pick, fact, apply, setLang,
    toggle: () => setLang(lang === 'en' ? 'zh' : 'en'),
    get lang() { return lang; }
  };
})();
