/* ═══════════════════════════════════════════
   Inside the Aircon — i18n
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.i18n = (function () {

  const DICT = {
    en: {
      title: 'Inside the Aircon',
      menu: 'Menu',
      tabHow: 'How it works',
      tabWash: 'How to wash it',

      /* how-it-works */
      power: 'POWER',
      on: 'ON', off: 'OFF',
      tempUp: 'WARMER', tempDown: 'COOLER',
      cycle: 'Refrigerant cycle',
      cComp: 'Compressor',
      cCond: 'Condenser',
      cValve: 'Expansion valve',
      cEvap: 'Evaporator',
      cCompSub: 'squeezes it → hot',
      cCondSub: 'gives heat away',
      cValveSub: 'pressure drops → cold',
      cEvapSub: 'takes heat from your room',
      hotSide: 'HOT side',
      coldSide: 'COLD side',
      inside: 'Inside',
      outside: 'Outside',
      bigIdea: 'An air conditioner does not make cold. It moves heat from inside your room to outside.',
      heatOut: 'heat out',
      heatIn: 'heat in',
      roomAir: 'warm room air',
      coolAir: 'cool air',
      rendering: 'Follow the refrigerant around the loop',
      tapPart: 'Tap a part to hear it',
      readAll: 'READ IT TO ME',

      /* spoken explanations */
      tComp: 'Part one, the compressor. It squeezes the refrigerant gas. Squeezing something heats it up, so what leaves the compressor is a very hot gas under high pressure.',
      tCond: 'Part two, the condenser. That hot gas flows through the coil in the outdoor unit. The fan blows outside air across the coil, the heat goes into the air, and the gas cools down until it turns into a liquid.',
      tValve: 'Part three, the expansion valve. The liquid is forced through a tiny hole. The pressure drops all at once, and when pressure drops the temperature drops with it, so the refrigerant comes out very cold.',
      tEvap: 'Part four, the evaporator. The cold refrigerant flows through the coil in your indoor unit. Warm room air is blown across it, the heat moves into the refrigerant, and cool air comes out of the vent. The refrigerant boils back into a gas and returns to the compressor, and the loop starts again.',
      tIdea: 'Here is the big idea. An air conditioner does not make cold. It moves heat. It picks heat up from the air inside your room, carries it outside, and lets it go. That is why the outdoor unit blows out hot air.',
      tCycleAll: 'Let us follow the refrigerant all the way round. ',
      tWashIntro: 'Now let us wash it. Follow me, step by step. Always start by switching the power off.',

      /* wash */
      step: 'Step',
      next: 'NEXT',
      prev: 'BACK',
      restart: 'START AGAIN',
      washDone: 'All done! Your aircon is clean.',

      w0: 'Switch off and unplug',
      w1: 'Open the front panel',
      w2: 'Take out the air filters',
      w3: 'Wash the filters and let them dry',
      w4: 'Clean the coil',
      w5: 'Clear the drain',
      w6: 'Clean the outdoor unit',
      w7: 'Put it back and run the fan',

      f0: 'Never work on a live unit. Unplug it, or switch off the breaker. The fan can start by itself.',
      f1: 'The front panel hinges up. Gently lift it until it clicks and stays open.',
      f2: 'Slide each filter up a little, then pull it towards you. Most units have two.',
      f3: 'Rinse from the clean side so dust falls out. Never scrub hard or use hot water — the mesh tears. Let them dry in the shade, never in direct sun.',
      f4: 'Spray coil cleaner on the fins and leave it 10 minutes. The foam lifts the dirt off; a soft brush finishes it. Sharp fins — go gently.',
      f5: 'If water drips in the room, the drain is blocked. Flush the pan and the pipe with water until it runs clear outside.',
      f6: 'The outdoor coil dumps all your room heat. Brush the fins and clear leaves. Turn the power off first!',
      f7: 'Filters back in, panel shut, power on. Run FAN only for 2 hours to dry everything inside.',

      /* labels in the scene */
      oPanel: 'front panel', oFilter: 'filter', oCoil: 'coil', oDrum: 'blower',
      oDrain: 'drain', oFan: 'fan', oComp: 'compressor',
      plugOff: 'POWER OFF',
      water: 'water', foam: 'foam', brush: 'brush',

      helpTitle: 'How an aircon works, and how to wash it',
      helpBody: `
        <h3>Two things to look at</h3>
        <ul>
          <li><code>How it works</code> — follow the refrigerant around its loop and see where heat is picked up and where it is thrown away.</li>
          <li><code>How to wash it</code> — a step-by-step service, from unplugging to running the fan dry.</li>
        </ul>
        <h3>The big idea</h3>
        <ul>
          <li>An air conditioner <b>does not make cold</b>. It <b>moves heat</b> out of your room and dumps it outside.</li>
          <li>Four parts do it: <b>compressor</b> → <b>condenser</b> → <b>expansion valve</b> → <b>evaporator</b>, then round again.</li>
          <li>The refrigerant is squeezed hot, gives its heat away outside, is released through a tiny hole so it goes cold, then soaks up heat from your room.</li>
        </ul>
        <h3>Safety first when washing</h3>
        <ul>
          <li><b>Unplug it first.</b> The fan can start on its own.</li>
          <li>Never pour water on the electrics.</li>
          <li>Let the filters dry completely before putting them back.</li>
        </ul>
      `
    },

    zh: {
      title: '空调的秘密',
      menu: '菜单',
      tabHow: '怎么工作的',
      tabWash: '怎么清洗',

      power: '电源',
      on: '开', off: '关',
      tempUp: '调高', tempDown: '调低',
      cycle: '制冷剂循环',
      cComp: '压缩机',
      cCond: '冷凝器',
      cValve: '节流阀',
      cEvap: '蒸发器',
      cCompSub: '加压 → 变热',
      cCondSub: '把热放出去',
      cValveSub: '压力骤降 → 变冷',
      cEvapSub: '吸走房间的热',
      hotSide: '热的一侧',
      coldSide: '冷的一侧',
      inside: '室内',
      outside: '室外',
      bigIdea: '空调不会“制造冷”。它只是把热量从屋里搬到屋外。',
      heatOut: '放热',
      heatIn: '吸热',
      roomAir: '房间里的热空气',
      coolAir: '冷风',
      rendering: '跟着制冷剂走一圈',
      tapPart: '点一下部件，听它讲解',
      readAll: '念给我听',

      tComp: '第一部分，压缩机。它把制冷剂气体压缩起来。压缩会让它变热，所以从压缩机出来的是又热、压力又高的气体。',
      tCond: '第二部分，冷凝器。热气体流到室外机的盘管里。风扇把外面的空气吹过盘管，热量就跑到空气里，气体慢慢冷却，变成液体。',
      tValve: '第三部分，节流阀。液体被压过一个小小的孔。压力一下子降低，而压力降低，温度也跟着降低，所以出来的制冷剂非常冷。',
      tEvap: '第四部分，蒸发器。冷的制冷剂流进室内机的盘管。屋里的热空气被吹过盘管，热量跑进制冷剂里，吹出来的就是冷风。制冷剂又变回气体，回到压缩机，循环重新开始。',
      tIdea: '重点来了。空调不会“制造冷”，它是把热量搬走：从屋里的空气里吸走热量，带到室外放掉。所以室外机吹出来的是热风。',
      tCycleAll: '我们跟着制冷剂走一整圈。',
      tWashIntro: '现在我们来清洗它。跟着我一步一步做。第一步永远是先断电。',

      step: '第',
      next: '下一步',
      prev: '上一步',
      restart: '重新开始',
      washDone: '全部完成！空调干净了。',

      w0: '断电、拔掉插头',
      w1: '打开前面板',
      w2: '取出空气滤网',
      w3: '清洗滤网并晾干',
      w4: '清洗蒸发器翅片',
      w5: '疏通排水管',
      w6: '清洗室外机',
      w7: '装回去，开送风干燥',

      f0: '千万不要带电作业。拔掉插头或关掉空气开关。风扇可能自己转起来。',
      f1: '前面板是向上翻开的，轻轻抬起到卡住的位置就好。',
      f2: '把每片滤网先往上推一点，再往外拉。大多数空调有两片。',
      f3: '从干净的一面冲水，灰尘才会掉下来。不要用力刷，也别用热水 — 网会破。放在阴凉处晾干，不要暴晒。',
      f4: '把清洗剂喷在翅片上，等 10 分钟。泡沫会把脏东西顶起来，再用软刷轻轻带一下。翅片很锋利，要小心。',
      f5: '如果室内滴水，说明排水管堵了。用水冲接水盘和排水管，直到室外出水通畅。',
      f6: '室外机负责把屋里的热量排出去。刷掉翅片上的灰，清掉树叶。先断电！',
      f7: '装回滤网、关好面板、通电。只开送风两小时，把里面吹干。',

      oPanel: '前面板', oFilter: '滤网', oCoil: '翅片', oDrum: '风轮',
      oDrain: '排水', oFan: '风扇', oComp: '压缩机',
      plugOff: '已断电',
      water: '水', foam: '泡沫', brush: '刷子',

      helpTitle: '空调怎么工作，怎么清洗',
      helpBody: `
        <h3>两件事</h3>
        <ul>
          <li><code>怎么工作的</code> — 跟着制冷剂走一圈，看它在哪儿吸热、在哪儿放热。</li>
          <li><code>怎么清洗</code> — 从断电到开送风干燥，一步一步来。</li>
        </ul>
        <h3>核心概念</h3>
        <ul>
          <li>空调<b>不会制造冷</b>，它是把<b>热量搬走</b>：从屋里搬到屋外。</li>
          <li>四个部件完成这件事：<b>压缩机</b> → <b>冷凝器</b> → <b>节流阀</b> → <b>蒸发器</b>，然后再来一圈。</li>
          <li>制冷剂被加压变热，先在室外把热放掉；再通过一个小孔，压力骤降就变冷，然后吸走屋里的热。</li>
        </ul>
        <h3>清洗要注意安全</h3>
        <ul>
          <li><b>先断电。</b>风扇可能自己启动。</li>
          <li>不要把水浇到电器部分。</li>
          <li>滤网一定要完全晾干再装回去。</li>
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
