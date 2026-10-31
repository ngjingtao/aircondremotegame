/* ═══════════════════════════════════════════
   How a Car Engine Works — i18n
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.i18n = (function () {

  const DICT = {
    en: {
      title: 'How a Car Engine Works',
      menu: 'Menu',

      hudStroke: 'Stroke',
      hudRpm: 'RPM',

      e1: 'Intake',
      e2: 'Compression',
      e3: 'Power',
      e4: 'Exhaust',

      ef1: 'The piston moves down and the intake valve opens. Air rushes in and carries fuel with it. The crankshaft is already turning from the other cylinders.',
      ef2: 'Both valves close. The piston moves up and squeezes the mixture into a small space — about one tenth of its original volume. Squeezing also heats it.',
      ef3: 'The spark plug fires. The burning gas expands and slams the piston down. This is the only stroke that makes power; the connecting rod turns the up-and-down motion into rotation.',
      ef4: 'The exhaust valve opens. The piston moves up and pushes the burnt gas out. Then the cycle starts again.',

      tIdle: 'IDLE',
      tCruise: 'CRUISE',
      tRev: 'REV',
      run: 'RUN',
      step: 'STEP',
      start: 'START',
      stop: 'STOP',
      next: 'NEXT',
      back: 'BACK',
      again: 'WATCH AGAIN',

      lead: 'Four-stroke engine',
      statusStopped: 'Stopped',
      statusRunning: 'Running',
      statusStep: 'Step mode',
      slow: 'At idle, a real engine does this about 13 times every second. This animation is slowed down so you can see each stroke.',
      stepHint: 'Use NEXT and BACK to walk through the four strokes.',

      engineDone: 'You have seen all four strokes — intake, compression, power and exhaust.',
      resultText: 'Four strokes make one cycle, and one cycle takes two turns of the crankshaft.',

      lSpark: 'spark plug',
      lIntakeValve: 'intake valve',
      lExhaustValve: 'exhaust valve',
      lPiston: 'piston',
      lRod: 'connecting rod',
      lCrank: 'crankshaft',
      lCylinder: 'cylinder',
      lIntake: 'air + fuel',
      lExhaust: 'exhaust',
      lChamber: 'combustion chamber',

      helpTitle: 'How a four-stroke engine works',
      helpBody: `
        <h3>Four strokes, two turns</h3>
        <ul>
          <li><b>Intake</b> — the piston goes down, the intake valve opens, and air + fuel are drawn in.</li>
          <li><b>Compression</b> — both valves close and the piston squeezes the mixture to about a tenth of its volume.</li>
          <li><b>Power</b> — the spark plug ignites it. The expanding gas pushes the piston down, and the connecting rod turns the crankshaft.</li>
          <li><b>Exhaust</b> — the exhaust valve opens and the piston pushes the burnt gas out.</li>
        </ul>
        <h3>The parts</h3>
        <ul>
          <li><b>Piston</b> — slides up and down in the cylinder.</li>
          <li><b>Connecting rod</b> — joins the piston to the crankshaft and turns straight motion into rotation.</li>
          <li><b>Crankshaft</b> — the shaft that delivers the power; it turns twice for every four strokes.</li>
          <li><b>Camshaft</b> — opens the valves at the right moment, at half the crankshaft speed.</li>
          <li><b>Spark plug</b> — ignites the mixture at the end of compression.</li>
        </ul>
        <h3>Try it</h3>
        <ul>
          <li>Press <code>START</code> and change <code>IDLE</code>, <code>CRUISE</code> or <code>REV</code> to change the speed.</li>
          <li>Switch to <code>STEP</code> to freeze one stroke at a time and read its card.</li>
          <li>Only the power stroke makes power. The other three are preparation and clean-up.</li>
        </ul>
      `
    },

    zh: {
      title: '汽车发动机怎样工作',
      menu: '菜单',

      hudStroke: '冲程',
      hudRpm: '转速',

      e1: '进气',
      e2: '压缩',
      e3: '做功',
      e4: '排气',

      ef1: '活塞往下走，进气门打开。空气冲进气缸，也把燃油带进来。曲轴这时已经被其他气缸带着转动了。',
      ef2: '两个气门都关闭。活塞往上走，把混合气压缩到很小的空间 — 大约只剩原来的十分之一。压缩也会让它变热。',
      ef3: '火花塞点火。燃烧的气体膨胀，把活塞猛地推下去。这是唯一真正产生动力的冲程；连杆把上下运动变成旋转。',
      ef4: '排气门打开。活塞往上走，把烧过的废气推出去。然后整个循环重新开始。',

      tIdle: '怠速',
      tCruise: '巡航',
      tRev: '高转',
      run: '运行',
      step: '单步',
      start: '启动',
      stop: '停止',
      next: '下一步',
      back: '上一步',
      again: '再看一次',

      lead: '四冲程发动机',
      statusStopped: '已停止',
      statusRunning: '运行中',
      statusStep: '单步模式',
      slow: '怠速时，真实发动机每秒大约完成 13 次循环。这个动画放慢了，才能看清每个冲程。',
      stepHint: '用“下一步”和“上一步”走完四个冲程。',

      engineDone: '你已经看完了四个冲程 — 进气、压缩、做功和排气。',
      resultText: '四个冲程是一个循环，一个循环要曲轴转两圈。',

      lSpark: '火花塞',
      lIntakeValve: '进气门',
      lExhaustValve: '排气门',
      lPiston: '活塞',
      lRod: '连杆',
      lCrank: '曲轴',
      lCylinder: '气缸',
      lIntake: '空气 + 燃油',
      lExhaust: '废气',
      lChamber: '燃烧室',

      helpTitle: '四冲程发动机怎样工作',
      helpBody: `
        <h3>四个冲程，曲轴转两圈</h3>
        <ul>
          <li><b>进气</b> — 活塞往下，进气门打开，空气和燃油被吸进来。</li>
          <li><b>压缩</b> — 两个气门关闭，活塞把混合气压到大约十分之一的体积。</li>
          <li><b>做功</b> — 火花塞点火，膨胀的气体把活塞推下去，连杆带动曲轴旋转。</li>
          <li><b>排气</b> — 排气门打开，活塞把废气推出去。</li>
        </ul>
        <h3>里面的零件</h3>
        <ul>
          <li><b>活塞</b> — 在气缸里上下滑动。</li>
          <li><b>连杆</b> — 把活塞和曲轴连起来，把直线运动变成旋转。</li>
          <li><b>曲轴</b> — 把动力送出去；每四个冲程转两圈。</li>
          <li><b>凸轮轴</b> — 在对的时刻打开气门，转速是曲轴的一半。</li>
          <li><b>火花塞</b> — 在压缩结束时点燃混合气。</li>
        </ul>
        <h3>试一试</h3>
        <ul>
          <li>按 <code>启动</code>，再切换 <code>怠速</code>、<code>巡航</code> 或 <code>高转</code> 改变速度。</li>
          <li>切到 <code>单步</code>，一次停在一个冲程上，读一读它的说明。</li>
          <li>只有做功冲程产生动力。其他三个冲程是在准备和清理。</li>
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
