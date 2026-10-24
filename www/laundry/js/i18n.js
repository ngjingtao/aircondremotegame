/* ═══════════════════════════════════════════
   Laundry Day — i18n
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.i18n = (function () {

  const DICT = {
    en: {
      title: 'Laundry Day',
      menu: 'Menu',

      tabWash: 'WASH',
      tabDry: 'DRY',

      loadLabel: 'LOAD',
      loadMixed: 'EVERYDAY',
      loadGym: 'GYM KIT',
      loadWool: 'WOOLLENS',

      program: 'PROGRAMME',
      progQuick: 'QUICK',
      progCotton: 'COTTON',
      progHeavy: 'HEAVY',
      progWool: 'WOOL',

      temp: 'WATER',
      spin: 'SPIN',
      detergent: 'DETERGENT',
      detLow: 'LOW',
      detNormal: 'NORMAL',
      detHigh: 'HIGH',

      start: 'START',
      stop: 'STOP',
      again: 'AGAIN',
      toDryer: 'TO THE DRYER',

      phIdle: 'Ready',
      phFill: 'Filling',
      phWash: 'Washing',
      phDrain: 'Draining',
      phRinse: 'Rinsing',
      phSpin: 'Spinning',
      phDone: 'Washed',

      dryProgram: 'PROGRAMME',
      proSensor: 'SENSOR',
      proTimed: 'TIMED',
      dryness: 'DRYNESS',
      dryIron: 'IRON DRY',
      dryCupboard: 'CUPBOARD',
      dryExtra: 'EXTRA DRY',
      heat: 'HEAT',
      heatLow: 'LOW',
      heatHigh: 'HIGH',

      dhIdle: 'Ready',
      dhHeat: 'Heating',
      dhDry: 'Drying',
      dhCool: 'Cooling',
      dhDone: 'Dry',

      hudClean: 'Clean',
      hudMoisture: 'Moisture',

      leadWash: 'Washing machine',
      leadDry: 'Tumble dryer',
      statusIdle: 'Ready',
      statusWash: 'Washing',
      statusDry: 'Drying',
      statusDone: 'Finished',

      lWasher: 'washer',
      lDryer: 'dryer',
      lDrum: 'drum',
      lDetergent: 'detergent',
      lLint: 'lint filter',
      lVent: 'vent',
      lBasket: 'basket',

      washPerfect: 'Sparkling clean, cared for, and not a drop wasted.',
      washDirty: 'Still dirty. Try a longer programme, warmer water or a little more detergent.',
      washCare: 'Clean, but the heat or the spin was too rough for this load.',
      washDamage: 'This load is ruined. Wool cannot take hot water and a fast spin.',
      washWaste: 'Clean and safe, but that cycle used more water and power than it needed.',

      dryPerfect: 'Dry, soft, and not over-dried. Just right.',
      dryDamp: 'Still damp. Give it a little longer, or a warmer setting.',
      dryOver: 'Over-dried. The fibres are scorched and the creases are set in.',
      dryDamage: 'That heat was too much for this fabric, and it has been damaged.',
      dryCare: 'Dry, but the load was already damaged in the wash.',
      dryWaste: 'Dry, but the timed cycle burned more energy than it needed.',

      tWashIntro: 'A washing machine needs three things: water, detergent, and the drum turning the clothes over and over.',
      tDryIntro: 'A dryer does not just heat the clothes. It tumbles them through warm air so the water can evaporate.',
      tTemp: 'Warm water lifts grease and dirt better, but hot water can shrink wool and fade colours.',
      tDetergent: 'More detergent does not mean cleaner clothes. Too much makes foam that traps dirt and leaves residue behind.',
      tSpin: 'A fast spin pulls more water out, so the dryer has less work to do. It also creases the clothes and can damage delicates.',
      tGym: 'Sweaty gym kit needs the heavy programme. Cotton alone is not quite enough for this load.',
      tWool: 'Wool has its own gentle programme. Cotton agitates it too hard and can felt the fibres.',
      tSensor: 'The moisture sensor stops the dryer when the clothes are ready. A timed cycle keeps going, even after they are dry.',
      tTimed: 'A timed cycle keeps heating until the clock runs out, dry or not. The sensor programme is gentler on the clothes and the power bill.',
      tHeatCare: 'Woollens and gym kit need low heat. High heat can shrink wool and damage stretchy fibres.',
      tOverdry: 'Over-drying sets creases in and makes fibres brittle. If you are going to iron, take clothes out while still a little damp.',
      tLint: 'The lint filter catches loose fibres. A clogged filter cuts the airflow, so the dryer runs slow, hot and wasteful.',
      tSort: 'Sort first: colours with colours, towels apart from delicates, and always check the care label.',
      tStopped: 'Stopped. The clothes are still wet. Start again when you are ready.',

      toastWashDone: 'Washed!',
      toastDryDone: 'Dry!',
      toastFail: 'Not quite — try again',

      helpTitle: 'Washing and drying',
      helpBody: `
        <h3>The washing machine</h3>
        <ul>
          <li><b>Sort first.</b> Colours with colours, heavy towels apart from delicate wool.</li>
          <li><b>Water + detergent + movement</b> lift the dirt. The drum turns the clothes through the soapy water.</li>
          <li><b>Temperature:</b> warm water cleans better, but hot water shrinks wool and fades colours.</li>
          <li><b>Detergent:</b> too much makes foam, traps dirt and leaves residue. Normal is usually right.</li>
          <li><b>Spin:</b> the faster it spins, the less water is left for the dryer — but the rougher it is on the clothes.</li>
        </ul>
        <h3>The dryer</h3>
        <ul>
          <li>A dryer tumbles the clothes through warm air. The water turns into vapour and is carried away.</li>
          <li><code>SENSOR</code> stops when the clothes are ready. <code>TIMED</code> keeps going until the clock runs out.</li>
          <li><b>Low heat</b> for wool and stretchy gym clothes. <b>High heat</b> is for tough cottons.</li>
          <li>Over-drying sets creases in and makes fibres brittle, so it wastes power and shortens the life of the clothes.</li>
          <li>Clean the <b>lint filter</b>. A clogged filter cuts the airflow and makes the dryer slow and hot.</li>
        </ul>
        <h3>Three stars</h3>
        <ul>
          <li><b>Wash:</b> clean, then undamaged, then without wasting water and power.</li>
          <li><b>Dry:</b> dry enough, then not over-dried, then using the sensor on the right heat.</li>
          <li>Wash first: a fast spin leaves less water, so the dryer finishes sooner.</li>
        </ul>
      `
    },

    zh: {
      title: '洗衣日',
      menu: '菜单',

      tabWash: '洗衣',
      tabDry: '烘干',

      loadLabel: '衣物',
      loadMixed: '日常衣物',
      loadGym: '运动服',
      loadWool: '羊毛衫',

      program: '程序',
      progQuick: '快洗',
      progCotton: '棉织物',
      progHeavy: '强力',
      progWool: '羊毛',

      temp: '水温',
      spin: '脱水',
      detergent: '洗衣液',
      detLow: '少',
      detNormal: '正常',
      detHigh: '多',

      start: '开始',
      stop: '停止',
      again: '再来一次',
      toDryer: '去烘干',

      phIdle: '待机',
      phFill: '进水',
      phWash: '洗涤',
      phDrain: '排水',
      phRinse: '漂洗',
      phSpin: '脱水',
      phDone: '洗好了',

      dryProgram: '程序',
      proSensor: '湿度感应',
      proTimed: '定时',
      dryness: '干度',
      dryIron: '熨烫干',
      dryCupboard: '入柜干',
      dryExtra: '特干',
      heat: '温度',
      heatLow: '低温',
      heatHigh: '高温',

      dhIdle: '待机',
      dhHeat: '预热',
      dhDry: '烘干中',
      dhCool: '冷却',
      dhDone: '烘好了',

      hudClean: '洁净',
      hudMoisture: '水分',

      leadWash: '洗衣机',
      leadDry: '烘干机',
      statusIdle: '待机',
      statusWash: '正在洗衣',
      statusDry: '正在烘干',
      statusDone: '完成',

      lWasher: '洗衣机',
      lDryer: '烘干机',
      lDrum: '滚筒',
      lDetergent: '洗衣液盒',
      lLint: '绒毛滤网',
      lVent: '排气口',
      lBasket: '洗衣篮',

      washPerfect: '洗得干干净净，衣服没受损，也没有浪费一滴水。',
      washDirty: '还是脏的。试试更长的程序、更暖的水，或者多一点点洗衣液。',
      washCare: '洗干净了，但水温或脱水太猛，这桶衣服有点受损。',
      washDamage: '这桶衣服被洗坏了。羊毛不能承受高温和高速脱水。',
      washWaste: '干净又安全，但这个程序用的水和电比需要的多。',

      dryPerfect: '干得刚刚好，蓬松柔软，没有烘过头。',
      dryDamp: '还有点湿。再烘久一点，或者把温度调高。',
      dryOver: '烘过头了。纤维被烤得发脆，皱褶也定住了。',
      dryDamage: '这个温度对它们太高了，衣服已经受损。',
      dryCare: '烘干了，但这桶衣服在洗涤时已经受损。',
      dryWaste: '已经干了，但定时烘干比需要的更费电。',

      tWashIntro: '洗衣机靠三样东西洗衣服：水、洗衣液，还有滚筒不停地翻动。',
      tDryIntro: '烘干机不只是加热。它让衣服在暖空气里翻滚，水汽才能跑掉。',
      tTemp: '温水去油污更厉害，但热水会让羊毛缩水，也会让颜色变淡。',
      tDetergent: '洗衣液不是越多越干净。太多会起很多泡，把脏东西又带回衣服上。',
      tSpin: '脱水转得越快，衣服里留下的水越少，烘干机就越省时间。但太快会压出皱褶，也可能伤到细致衣物。',
      tGym: '运动服又汗又脏，要用强力程序。只用棉织物程序还不够干净。',
      tWool: '羊毛有专门的轻柔程序。用棉织物程序会搅得太厉害，纤维会毡化。',
      tSensor: '湿度感应会在衣服干透时自动停下。定时程序时间到了才停，可能已经烘过头。',
      tTimed: '定时程序不管衣服干没干都会一直转。用感应程序对衣服和电费都更友好。',
      tHeatCare: '羊毛衫和运动服只能用低温烘。高温会让羊毛缩水，也会破坏弹性纤维。',
      tOverdry: '烘得太干会把皱褶定住，纤维也会变脆。如果要熨，留一点湿气更好。',
      tLint: '绒毛滤网会拦住松散的纤维。滤网堵住，风就走不动，烘干又慢又热又费电。',
      tSort: '先分类：深色和浅色分开，毛巾和细致衣物分开，还要看看衣服上的洗涤标签。',
      tStopped: '已经停下，衣服还是湿的。准备好后再按开始。',

      toastWashDone: '洗好了！',
      toastDryDone: '烘好了！',
      toastFail: '差一点，再试一次',

      helpTitle: '洗衣和烘干',
      helpBody: `
        <h3>洗衣机</h3>
        <ul>
          <li><b>先分类。</b>深色和浅色分开，厚毛巾和娇贵的羊毛分开。</li>
          <li><b>水 + 洗衣液 + 翻动</b> 才能把脏东西弄下来。滚筒让衣服在肥皂水里不停翻滚。</li>
          <li><b>水温：</b>温水洗得更干净，但热水会让羊毛缩水、颜色变淡。</li>
          <li><b>洗衣液：</b>太多会起泡，把脏东西又带回衣服上，还会留下残留。通常“正常”就够。</li>
          <li><b>脱水：</b>转得越快，留给烘干机的水越少，但对衣服也更粗鲁。</li>
        </ul>
        <h3>烘干机</h3>
        <ul>
          <li>烘干机让衣服在暖空气里翻滚，水变成水汽被带走。</li>
          <li><code>湿度感应</code>在衣服干时自动停；<code>定时</code>时间到了才停。</li>
          <li>羊毛和弹性运动服要用<b>低温</b>；结实的棉织物才用<b>高温</b>。</li>
          <li>烘过头会把皱褶定住、让纤维变脆，既浪费电又伤衣服。</li>
          <li>记得清理<b>绒毛滤网</b>。滤网堵住，风走不动，烘干又慢又热。</li>
        </ul>
        <h3>三颗星</h3>
        <ul>
          <li><b>洗衣：</b>先洗干净，再不伤衣服，最后是不浪费水和电。</li>
          <li><b>烘干：</b>先烘干，再不烘过头，最后是用感应程序配对的温度。</li>
          <li>先洗衣：脱水快一点，衣服带的水少，烘干就更快。</li>
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
