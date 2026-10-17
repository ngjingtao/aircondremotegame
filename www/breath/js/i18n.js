/* ═══════════════════════════════════════════
   Breathing & Blood — i18n
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.i18n = (function () {

  const DICT = {
    en: {
      title: 'Breathing & Blood',
      menu: 'Menu',
      experiment: 'Experiment',
      scRest: 'Rest', scSleep: 'Sleep', scWalk: 'Walk', scRun: 'Run', scAlt: 'High altitude',

      bBreathe: 'TAKE A BREATH',
      bHold: 'HOLD BREATH',
      bRelease: 'BREATHE AGAIN',

      mLung: 'Lungs',
      mRate: 'Breaths / min',
      mHeart: 'Heart rate',
      mSpo2: 'Oxygen in blood',
      mCo2: 'Carbon dioxide',
      mUrge: 'Urge to breathe',
      bpm: 'bpm',

      labelO2: 'O₂',
      labelCo2: 'CO₂',
      exchange: 'Gas exchange in the alveoli',

      oMouth: 'mouth', oTrachea: 'windpipe', oLung: 'lung', oHeart: 'heart',
      oBody: 'body', oBlood: 'blood',

      legRedO2: 'Oxygen-rich blood',
      legBlueCo2: 'Oxygen-poor blood',

      sayRest: ['Nice and calm.', 'Just breathing gently.'],
      saySleep: ['Zzz… slow and steady.', 'Fast asleep.'],
      sayWalk: ['A little more air, please.', 'Walking keeps me fit.'],
      sayRun: ['I need lots of oxygen!', 'My heart is pounding!'],
      sayAlt: ['The air is thin up here…', 'Less oxygen in every breath!'],
      sayHold: ['I am holding my breath…', 'How long can I last?'],
      sayGasp: ['Phew! I had to breathe!', 'My body made me gasp!'],

      msgRest: 'Heart and breathing slow down.',
      msgSleep: 'Deeply relaxed — the slowest rate.',
      msgWalk: 'Muscles want more oxygen.',
      msgRun: 'Working hard — heart and lungs speed up!',
      msgAlt: 'Thin air: less oxygen per breath, so you breathe faster.',
      msgBox: 'Box breathing: in 4, hold 4, out 4, hold 4. It calms the heart.',
      msgRelax: 'Relaxing 4-7-8: in 4, hold 7, out 8. Very calming.',
      msgFast: 'Fast breathing blows off carbon dioxide — watch it drop.',
      msgBreathe: 'Big breath — oxygen goes up.',
      msgHold: 'Holding your breath…',
      msgGasp: 'Too long! Your body forced a breath.',
      msgLowO2: 'Oxygen is getting low!',
      msgRecovered: 'Oxygen back to normal.',

      /* breathing patterns */
      pattern: 'Breathing pattern',
      pAuto: 'Normal', pBox: 'Box 4-4-4-4', pRelax: 'Relax 4-7-8', pFast: 'Fast',
      paceIn: 'Breathe in', paceHold: 'Hold', paceOut: 'Breathe out', paceRest: 'Hold',
      guided: 'Breathe with the circle',
      paceOff: 'Tap NORMAL to breathe on your own again',

      /* alveoli zoom */
      zoomHint: 'tap to look closer',
      zoomTitle: 'Inside one alveolus',
      zoomBody: 'An alveolus is a tiny air sac at the end of your airways — you have about 300 million of them, giving a surface about the size of a tennis court. The wall is only one cell thick and wrapped in capillaries. Oxygen slips across into the blood, where it sticks to haemoglobin in red blood cells. Carbon dioxide slips the other way, out of the blood and into the air you breathe out.',
      zoomO2: 'Oxygen in',
      zoomCo2: 'Carbon dioxide out',

      /* quiz */
      quizBtn: 'Quiz',
      quizTitle: 'Quick quiz',
      quizQ1: 'What does breathing actually do?',
      quizQ1a: 'Brings oxygen in and takes carbon dioxide out',
      quizQ1b: 'Makes cold air',
      quizQ1c: 'Fills the lungs with water',
      quizQ2: 'Which blood cells carry oxygen around?',
      quizQ2a: 'Red blood cells, using haemoglobin',
      quizQ2b: 'White blood cells',
      quizQ2c: 'Bone cells',
      quizQ3: 'If you breathe very fast, what happens to your carbon dioxide?',
      quizQ3a: 'It drops — you blow it off',
      quizQ3b: 'It rises',
      quizQ3c: 'It stays exactly the same',
      quizQ4: 'Why does your heart beat faster when you run?',
      quizQ4a: 'To deliver oxygen to the muscles faster',
      quizQ4b: 'To warm the blood up',
      quizQ4c: 'Because it is bored',
      quizRight: 'Correct! 🎉',
      quizWrong: 'Not quite — ',
      quizScore: 'You got {n} of {t}!',
      quizDone: 'Finish',

      helpTitle: 'How breathing and blood work',
      helpBody: `
        <h3>The two jobs</h3>
        <ul>
          <li><b>Breathing</b> brings oxygen in and takes carbon dioxide out.</li>
          <li><b>Circulation</b> carries that oxygen to every cell, and brings the carbon dioxide back.</li>
          <li>They work as one team: lungs load the blood, the heart pumps it.</li>
        </ul>
        <h3>Run the experiments</h3>
        <ul>
          <li><code>Rest / Sleep / Walk / Run</code> — change how much oxygen your muscles need, and watch the heart rate and breathing rate follow.</li>
          <li><code>High altitude</code> — there is less oxygen in every breath, so you breathe faster and your blood carries less.</li>
          <li><code>TAKE A BREATH</code> — a deep breath. Watch the oxygen meter rise.</li>
          <li><code>HOLD BREATH</code> — stop breathing and watch the oxygen fall and the carbon dioxide climb until your body forces a gasp.</li>
        </ul>
        <h3>What to look at</h3>
        <ul>
          <li>The <b>lungs</b> inflate and deflate with every breath.</li>
          <li>The <b>heart</b> beats faster when you need more oxygen.</li>
          <li>Blood cells are <b>blue</b> when they carry carbon dioxide and turn <b>red</b> in the lungs.</li>
          <li>The bubble shows <b>gas exchange</b>: oxygen in, carbon dioxide out.</li>
        </ul>
      `
    },

    zh: {
      title: '呼吸与血液循环',
      menu: '菜单',
      experiment: '小实验',
      scRest: '休息', scSleep: '睡觉', scWalk: '走路', scRun: '跑步', scAlt: '高海拔',

      bBreathe: '深吸一口气',
      bHold: '屏住呼吸',
      bRelease: '继续呼吸',

      mLung: '肺',
      mRate: '呼吸 / 分钟',
      mHeart: '心率',
      mSpo2: '血液含氧量',
      mCo2: '二氧化碳',
      mUrge: '想呼吸的冲动',
      bpm: '次/分',

      labelO2: 'O₂',
      labelCo2: 'CO₂',
      exchange: '肺泡里的气体交换',

      oMouth: '口腔', oTrachea: '气管', oLung: '肺', oHeart: '心脏',
      oBody: '身体', oBlood: '血液',

      legRedO2: '富含氧气的血',
      legBlueCo2: '缺氧的血',

      sayRest: ['很平静。', '轻轻地呼吸。'],
      saySleep: ['呼…… 又慢又稳。', '睡得好香。'],
      sayWalk: ['需要多一点空气。', '走路让我更健康。'],
      sayRun: ['我需要好多氧气！', '心脏咚咚跳！'],
      sayAlt: ['这里的空气好稀薄……', '每口气里的氧气都变少了！'],
      sayHold: ['我屏住呼吸……', '我能坚持多久？'],
      sayGasp: ['呼！我不得不呼吸了！', '身体逼我吸气了！'],

      msgRest: '心跳和呼吸都慢下来了。',
      msgSleep: '完全放松 — 呼吸最慢。',
      msgWalk: '肌肉需要更多氧气。',
      msgRun: '用力了 — 心肺都加快！',
      msgAlt: '空气稀薄：每口气含氧更少，所以呼吸变快。',
      msgBox: '箱式呼吸：吸 4 秒、停 4 秒、呼 4 秒、停 4 秒。可以安抚心跳。',
      msgRelax: '放松 4-7-8：吸 4 秒、停 7 秒、呼 8 秒，非常放松。',
      msgFast: '快速呼吸会把二氧化碳吹掉 — 看它往下掉。',
      msgBreathe: '深吸一口气 — 含氧量上升。',
      msgHold: '屏住呼吸……',
      msgGasp: '太久了！身体强迫你吸气。',
      msgLowO2: '氧气越来越少了！',
      msgRecovered: '氧气恢复正常。',

      /* breathing patterns */
      pattern: '呼吸节奏',
      pAuto: '自然', pBox: '箱式 4-4-4-4', pRelax: '放松 4-7-8', pFast: '快速',
      paceIn: '吸气', paceHold: '屏住', paceOut: '呼气', paceRest: '屏住',
      guided: '跟着圆圈一起呼吸',
      paceOff: '按“自然”就可以自己呼吸了',

      /* alveoli zoom */
      zoomHint: '点一下，看仔细',
      zoomTitle: '一个肺泡里面',
      zoomBody: '肺泡是气道末端的小气囊，你大约有三亿个，摊开的面积差不多有一个网球场那么大。肺泡壁只有一层细胞厚，外面包着毛细血管。氧气从这里溜进血液，粘在红细胞里的血红蛋白上；二氧化碳则从血液溜出来，跟着你呼出的气跑掉。',
      zoomO2: '氧气进来',
      zoomCo2: '二氧化碳出去',

      /* quiz */
      quizBtn: '小测验',
      quizTitle: '快速小测验',
      quizQ1: '呼吸到底在做什么？',
      quizQ1a: '把氧气吸进来，把二氧化碳排出去',
      quizQ1b: '制造冷空气',
      quizQ1c: '往肺里灌水',
      quizQ2: '血液里靠什么把氧气运走？',
      quizQ2a: '红细胞，靠血红蛋白',
      quizQ2b: '白细胞',
      quizQ2c: '骨细胞',
      quizQ3: '如果呼吸得非常快，二氧化碳会怎样？',
      quizQ3a: '下降 — 被吹掉了',
      quizQ3b: '上升',
      quizQ3c: '完全不变',
      quizQ4: '跑步时心跳为什么变快？',
      quizQ4a: '为了更快把氧气送到肌肉',
      quizQ4b: '为了把血加热',
      quizQ4c: '因为心脏无聊',
      quizRight: '答对了！🎉',
      quizWrong: '不太对 — ',
      quizScore: '你答对了 {n} / {t} 题！',
      quizDone: '完成',

      helpTitle: '呼吸和血液是怎么工作的',
      helpBody: `
        <h3>两个任务</h3>
        <ul>
          <li><b>呼吸</b>把氧气吸进来，把二氧化碳排出去。</li>
          <li><b>血液循环</b>把氧气送到每个细胞，再把二氧化碳带回来。</li>
          <li>它们是一个团队：肺给血液装氧，心脏把血泵出去。</li>
        </ul>
        <h3>做实验</h3>
        <ul>
          <li><code>休息 / 睡觉 / 走路 / 跑步</code> — 改变肌肉需要的氧气量，看心率和呼吸怎么跟着变。</li>
          <li><code>高海拔</code> — 每口气里的氧气更少，所以呼吸会变快，血液含氧也会降低。</li>
          <li><code>深吸一口气</code> — 看含氧量上升。</li>
          <li><code>屏住呼吸</code> — 看氧气下降、二氧化碳上升，最后身体逼你吸气。</li>
        </ul>
        <h3>看什么</h3>
        <ul>
          <li><b>肺</b>随着每次呼吸变大变小。</li>
          <li>需要更多氧气时，<b>心脏</b>跳得更快。</li>
          <li>血细胞带着二氧化碳时是<b>蓝色</b>的，到了肺里就变成<b>红色</b>。</li>
          <li>小圆窗展示了<b>气体交换</b>：氧气进去，二氧化碳出来。</li>
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

  function pick(key) {
    const v = DICT[lang][key];
    if (Array.isArray(v)) return v[Math.floor(Math.random() * v.length)];
    return t(key);
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
    t, pick, apply, setLang,
    toggle: () => setLang(lang === 'en' ? 'zh' : 'en'),
    get lang() { return lang; }
  };
})();
