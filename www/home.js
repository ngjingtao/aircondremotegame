/* ═══════════════════════════════════════════
   home.js — activity picker
   ═══════════════════════════════════════════ */
(function () {

  const $ = id => document.getElementById(id);

  const DICT = {
    en: {
      appName: 'Play & Learn',
      pickOne: 'What shall we play?',
      pickSub: 'Tap a picture to start',
      tileAirTitle: 'Play Aircond',
      tileAirSub: 'Drive the remote, make the boy happy, cold or hot',
      tileFoodTitle: 'Food Eating',
      tileFoodSub: 'Follow food from the mouth all the way out',
      tileTrainTitle: 'Train Driving',
      tileTrainSub: 'Drive the train, stop at the station, ding ding at the crossing',
      tileBreathTitle: 'Breathing & Blood',
      tileBreathSub: 'Run experiments: breathe, hold your breath, run and climb a mountain',
      tileCareTitle: 'Inside the Aircon',
      tileCareSub: 'See how it works — then learn how to wash it, step by step',
      tileToiletTitle: 'Toilet & Indah Water',
      tileToiletSub: 'See what a flush really does — then follow the water to the treatment plant',
      tileHoodTitle: 'Kitchen Hood',
      tileHoodSub: 'Turn the fan up and watch how it pulls the smoke, grease and smell out of the kitchen',
      foot: 'Made for curious kids',
      help: '?',
      helpTitle: 'Seven activities',
      helpBody: `
        <h3>❄ Play Aircond</h3>
        <ul>
          <li>A Haier-style remote on the left, a boy and his air-con on the right.</li>
          <li>Every key changes the remote screen, the air-con <b>and</b> the boy's mood.</li>
          <li>Keep him in the comfort zone. Free Play to explore, Challenge for score + weather events.</li>
        </ul>
        <h3>🍎 Food Eating</h3>
        <ul>
          <li>Pick a food, chew it, swallow it and follow it all the way through the body.</li>
          <li>Six stages: mouth → oesophagus → stomach → small intestine → large intestine → out.</li>
          <li>Real science facts at every stop, plus a quiz at the end.</li>
          <li>Press <code>WATCH</code> to sit back and let the journey play by itself.</li>
        </ul>
        <h3>🚆 Train Driving</h3>
        <ul>
          <li>Notch up the throttle and feel how heavy a train is. Brakes need a long distance.</li>
          <li>Stop with the front of the train on the white mark at each station.</li>
          <li>Listen for <code>ding, ding, ding</code> at every level crossing — red lights flash and the barrier comes down.</li>
          <li>Horn, bell, headlights and doors all work. Doors must be shut before you move.</li>
        </ul>
        <h3>🫁 Breathing &amp; Blood</h3>
        <ul>
          <li>Choose an experiment: <code>Sleep</code>, <code>Rest</code>, <code>Walk</code>, <code>Run</code> or <code>High altitude</code>.</li>
          <li>Watch the lungs inflate and the heart beat faster when the body needs more oxygen.</li>
          <li>Press <code>TAKE A BREATH</code>, or <code>HOLD BREATH</code> and see the oxygen fall until the body forces a gasp.</li>
          <li>Blue blood cells carry carbon dioxide; they turn red in the lungs. The bubble shows the gas exchange.</li>
        </ul>
        <h3>❄ Inside the Aircon</h3>
        <ul>
          <li><code>How it works</code> — follow the refrigerant round its loop: compressor, condenser, expansion valve, evaporator.</li>
          <li>Watch the tube turn red where it is hot and blue where it is cold, and see heat coming in from your room and going out of the outdoor unit.</li>
          <li><code>How to wash it</code> — an eight-step service, from unplugging it to running the fan dry.</li>
        </ul>
        <h3>🚽 Toilet &amp; Indah Water</h3>
        <ul>
          <li><code>How it flushes</code> — press the button and watch the cistern empty, the jet fill the S-bend, and the siphon pull everything away.</li>
          <li><code>How it gets cleaned</code> — eight stages through an Indah Water plant: screens, grit, primary tank, aeration, clarifier, disinfection, river.</li>
          <li>Tap any stage, or use NEXT, to hear what happens at each one.</li>
        </ul>
        <h3>🍳 Kitchen Hood</h3>
        <ul>
          <li>Turn the fan to <code>OFF</code> and watch the smoke escape into the room.</li>
          <li>Press <code>FILTER → DIRTY</code>: the airflow drops, the noise goes up and smoke starts leaking — exactly what a clogged filter does.</li>
          <li>Switch between <code>OUTSIDE</code> and <code>RECIRCULATE</code> to see where the air ends up.</li>
        </ul>
        <h3>Buttons in the top bar</h3>
        <ul>
          <li><code>‹ Menu</code> — back to this screen (inside an activity).</li>
          <li><code>EN / 中文</code> — switch language.</li>
          <li><code>🔊 / 🔇</code> — sound on or off.</li>
        </ul>
      `
    },
    zh: {
      appName: '边玩边学',
      pickOne: '今天玩什么？',
      pickSub: '点一下图片就开始',
      tileAirTitle: '玩空调',
      tileAirSub: '操作遥控器，看看男孩是舒服、冷还是热',
      tileFoodTitle: '吃东西',
      tileFoodSub: '跟着食物从嘴巴一路走到外面',
      tileTrainTitle: '开火车',
      tileTrainSub: '开动火车、停准站台，道口叮叮叮',
      tileBreathTitle: '呼吸与血液循环',
      tileBreathSub: '做实验：呼吸、屏气、跑步、上高山',
      tileCareTitle: '空调的秘密',
      tileCareSub: '看它怎么工作 — 再一步步学会清洗空调',
      tileToiletTitle: '马桶与英达丽水',
      tileToiletSub: '看看冲水到底发生了什么 — 再跟着水去污水厂走一趟',
      tileHoodTitle: '抽油烟机',
      tileHoodSub: '把风速调大，看它怎么把油烟、油和味道抽走',
      foot: '给充满好奇心的小朋友',
      help: '?',
      helpTitle: '七个小游戏',
      helpBody: `
        <h3>❄ 玩空调</h3>
        <ul>
          <li>左边是海尔风格的遥控器，右边是男孩和他的空调。</li>
          <li>每按一个键，遥控器屏幕、空调<b>和</b>男孩的表情都会一起变化。</li>
          <li>让他一直舒服。自由模式随便玩，挑战模式有分数和天气事件。</li>
        </ul>
        <h3>🍎 吃东西</h3>
        <ul>
          <li>选一样食物，咀嚼、吞下，然后跟着它走遍全身。</li>
          <li>六个阶段：口腔 → 食道 → 胃 → 小肠 → 大肠 → 排出。</li>
          <li>每一站都有真实的科学知识，最后还有小测验。</li>
          <li>按 <code>观看</code> 可以放手不管，让旅程自己播放。</li>
        </ul>
        <h3>🚆 开火车</h3>
        <ul>
          <li>推动油门，感受火车有多重。刹车需要很长的距离。</li>
          <li>让车头停在每个车站的白色标线上。</li>
          <li>每个道口都要听 <code>叮、叮、叮</code> — 红灯闪烁，栏杆落下。</li>
          <li>风笛、铃声、车灯、车门都能用。门没关好火车不会动。</li>
        </ul>
        <h3>🫁 呼吸与血液循环</h3>
        <ul>
          <li>选择实验：<code>睡觉</code>、<code>休息</code>、<code>走路</code>、<code>跑步</code> 或 <code>高海拔</code>。</li>
          <li>看肺怎么鼓起来，身体需要更多氧气时心脏怎么跳得更快。</li>
          <li>按 <code>深吸一口气</code>；或按 <code>屏住呼吸</code>，看含氧量一直下降直到身体逼你吸气。</li>
          <li>蓝色的血细胞带着二氧化碳，到肺里就变成红色。小圆窗展示气体交换。</li>
        </ul>
        <h3>❄ 空调的秘密</h3>
        <ul>
          <li><code>怎么工作的</code> — 跟着制冷剂走一圈：压缩机、冷凝器、节流阀、蒸发器。</li>
          <li>看管子哪里变红（热）、哪里变蓝（冷），屋里吸热、室外放热。</li>
          <li><code>怎么清洗</code> — 从断电到开送风干燥，一共八个步骤。</li>
        </ul>
        <h3>🚽 马桶与英达丽水</h3>
        <ul>
          <li><code>怎么冲水</code> — 按下按钮，看水箱排空、水流灌满 S 形弯管、虹吸把东西拉走。</li>
          <li><code>怎么变干净</code> — 走过污水厂的八个阶段：格栅、沉砂、初沉、曝气、二沉、消毒、排河。</li>
          <li>点任意一个阶段，或按“下一步”，听听每一段发生了什么。</li>
        </ul>
        <h3>🍳 抽油烟机</h3>
        <ul>
          <li>把风速按到 <code>关闭</code>，看油烟怎么跑进屋里。</li>
          <li>按 <code>滤网 → 脏了</code>：风量掉下来、噪音变大、油烟开始外漏 — 这就是滤网堵住的样子。</li>
          <li>在 <code>排到室外</code> 和 <code>室内循环</code> 之间切换，看空气最后去了哪里。</li>
        </ul>
        <h3>顶栏按钮</h3>
        <ul>
          <li><code>‹ 菜单</code> — 回到这个页面（在小游戏里）。</li>
          <li><code>EN / 中文</code> — 切换语言。</li>
          <li><code>🔊 / 🔇</code> — 开关声音。</li>
        </ul>
      `
    }
  };

  let lang = ARG.store.get('arg.lang');
  if (!lang || !DICT[lang]) lang = 'zh';   // Chinese unless you switch it

  function apply() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = DICT[lang][el.dataset.i18n];
      if (v !== undefined) el.textContent = v;
    });
    $('btn-lang').textContent = lang === 'en' ? 'EN' : '中文';
    $('help-title').textContent = DICT[lang].helpTitle;
    $('help-body').innerHTML = DICT[lang].helpBody;
  }

  function boot() {
    $('btn-lang').addEventListener('click', () => {
      lang = lang === 'en' ? 'zh' : 'en';
      ARG.store.set('arg.lang', lang);
      apply();
      ARG.voice.syncLang();
      ARG.audio.blip();
    });

    $('btn-sound').addEventListener('click', e => {
      const on = ARG.audio.toggle();
      e.currentTarget.textContent = on ? '🔊' : '🔇';
    });
    $('btn-sound').textContent = ARG.audio.enabled ? '🔊' : '🔇';

    ARG.voice.attach();
    ARG.a11y.init();

    const overlay = $('help-overlay');
    $('btn-help').addEventListener('click', () => { overlay.hidden = false; });
    $('help-close').addEventListener('click', () => { overlay.hidden = true; });
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.hidden = true; });

    document.querySelectorAll('.tile').forEach(t => {
      t.addEventListener('pointerdown', () => ARG.audio.blip());
    });

    /* tap the help text to have it read out */
    ARG.voice.speakOnTap($('help-body'));

    apply();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

})();
