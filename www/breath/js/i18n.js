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
      msgBreathe: 'Big breath — oxygen goes up.',
      msgHold: 'Holding your breath…',
      msgGasp: 'Too long! Your body forced a breath.',
      msgLowO2: 'Oxygen is getting low!',
      msgRecovered: 'Oxygen back to normal.',

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
      msgBreathe: '深吸一口气 — 含氧量上升。',
      msgHold: '屏住呼吸……',
      msgGasp: '太久了！身体强迫你吸气。',
      msgLowO2: '氧气越来越少了！',
      msgRecovered: '氧气恢复正常。',

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
  if (!lang || !DICT[lang]) {
    lang = (navigator.language || 'en').toLowerCase().startsWith('zh') ? 'zh' : 'en';
  }

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
