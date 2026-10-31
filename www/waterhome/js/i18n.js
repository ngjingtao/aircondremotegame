/* ═══════════════════════════════════════════
   Water at Home — i18n
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.i18n = (function () {

  const DICT = {
    en: {
      title: 'Water at Home',
      menu: 'Menu',

      tabSupply: 'FROM THE RIVER',
      tabHeater: 'HOT WATER',

      hudTemp: 'Tank',
      hudDrawn: 'Draws',

      w1: 'Source',
      w2: 'Screens & grit',
      w3: 'Coagulation',
      w4: 'Sedimentation',
      w5: 'Filtration',
      w6: 'Disinfection',
      w7: 'Storage & pumps',
      w8: 'Meter & tap',

      wf1: 'The journey starts in a river, a reservoir or underground. Protecting that source from pollution is the cheapest and most important step.',
      wf2: 'Metal bars and screens catch sticks, leaves and plastic. Grit — sand and small stones — settles out in a slow channel.',
      wf3: 'A tiny dose of alum or an iron salt is mixed in. It makes the fine dirt particles stick together into larger clumps called flocs.',
      wf4: 'The water rests in a large tank. The flocs settle to the bottom as sludge, and the clearer water flows off the top.',
      wf5: 'The water trickles through beds of sand and gravel. The remaining particles are trapped; activated carbon can also remove some tastes and chemicals.',
      wf6: 'Chlorine, chloramine, ozone or ultraviolet light kills bacteria and viruses. A little chlorine is left in the water to protect it all the way through the pipes.',
      wf7: 'Clean water is stored in a covered tank or service reservoir, then pumps push it into the mains. The pipes are kept under pressure so water reaches upstairs taps.',
      wf8: 'A meter at the boundary measures how much you use. The supply pipe brings water into the house, and the pressure pushes it out of the tap.',

      stepLabel: 'STEP',
      next: 'NEXT',
      back: 'BACK',
      doneSupply: 'That is the whole journey — river to tap.',

      power: 'POWER',
      on: 'ON',
      off: 'OFF',
      setpoint: 'SETPOINT',
      tankTemp: 'HOT WATER',
      bottomTemp: 'BOTTOM',
      draw: 'DRAW HOT WATER',
      upperElementShort: 'UPPER ELEMENT',
      lowerElementShort: 'LOWER ELEMENT',
      reliefShort: 'T&P VALVE',
      heating: 'Heating',
      upperHeating: 'Heating upper',
      lowerHeating: 'Heating lower',
      ready: 'At setpoint',
      cold: 'Cold',
      heaterFact: 'Cold water comes in through the dip tube and is delivered near the bottom. The upper element heats the top first; when the upper thermostat is satisfied, the lower element takes over.',

      tSupply: 'Follow the water from its source to your tap. Each step is a real part of a water-treatment works.',
      tHeater: 'Set a temperature and watch the two elements work. The upper element heats the top first, then the lower element heats the rest. Draw hot water and see the mixing valve at the tap.',
      tSafety: 'Store hot water at 60 °C or above to kill Legionella bacteria. A mixing valve then blends it down to about 50 °C at the tap so nobody is scalded.',
      tAnode: 'The magnesium or aluminium anode rod sacrifices itself to protect the steel tank from rust. The pressure-relief valve lets expanding water escape safely.',
      tUpper: 'The upper element is heating the top of the tank. Hot water rises, so the top gets hot first and the upper thermostat switches it off.',
      tLower: 'The upper thermostat is satisfied. The lower element now heats the bottom, so the whole tank reaches temperature.',
      tReadyHeater: 'Both thermostats are satisfied. The tank is at the setpoint and ready to draw.',
      nUpper: 'Upper element heats the top first.',
      nLower: 'Then the lower element heats the bottom.',
      nMix: 'The mixing valve caps the tap at about 50 °C.',

      waterPerfect: 'You followed the water from river to tap, and stored it at 60 °C or more before drawing it. Safe and efficient.',
      waterGood: 'The supply journey is complete and hot water works, but storing below 60 °C lets Legionella bacteria survive.',
      waterCold: 'You drew water before the tank was hot. Heat it to the setpoint first.',

      leadSupply: 'Supply journey',
      leadHeater: 'Hot-water cylinder',
      statusSupply: 'Following',
      statusHeater: 'Heating',
      statusUpper: 'Upper element',
      statusLower: 'Lower element',
      statusReady: 'Ready',
      statusDone: 'Complete',

      lSource: 'source',
      lScreens: 'screens',
      lCoag: 'coag',
      lSettle: 'settle',
      lFilter: 'filter',
      lDisinfect: 'disinfection',
      lTank: 'storage',
      lMeter: 'meter',
      lTap: 'tap',
      lColdIn: 'cold in',
      lHotOut: 'hot out',
      lElement: 'element',
      lThermostat: 'thermostat',
      lAnode: 'anode',
      lMix: 'mixing valve',
      lInsulation: 'insulation',
      lUpperElement: 'upper element',
      lLowerElement: 'lower element',
      lDipTube: 'dip tube',
      lUpperThermostat: 'upper thermostat',
      lLowerThermostat: 'lower thermostat',
      lRelief: 'T&P valve',
      lDrain: 'drain valve',

      helpTitle: 'Water at home',
      helpBody: `
        <h3>From the river to the tap</h3>
        <ul>
          <li><b>Source</b> — river, reservoir or groundwater.</li>
          <li><b>Screens and grit</b> — remove sticks, leaves, plastic and sand.</li>
          <li><b>Coagulation</b> — alum makes tiny dirt particles clump into flocs.</li>
          <li><b>Sedimentation</b> — the flocs settle out as sludge.</li>
          <li><b>Filtration</b> — sand and gravel trap what is left.</li>
          <li><b>Disinfection</b> — chlorine, ozone or UV kills germs; a chlorine residual protects the pipes.</li>
          <li><b>Storage and pumps</b> — keeps the mains under pressure.</li>
          <li><b>Meter and tap</b> — measures your use and delivers the water.</li>
        </ul>
        <h3>The hot-water cylinder</h3>
        <ul>
          <li>Cold water enters through the <b>dip tube</b> and is delivered near the bottom, so it does not mix with the hot water at the top.</li>
          <li>The <b>upper element</b> heats the top first. When its thermostat is satisfied it switches off, and the <b>lower element</b> takes over.</li>
          <li>The tank is insulated, and the <b>anode rod</b> sacrifices itself to protect the steel from rust.</li>
          <li>The <b>T&amp;P relief valve</b> lets expanding water escape safely.</li>
          <li>Store at <b>60 °C or above</b> to kill Legionella; a mixing valve blends it to about 50 °C at the tap.</li>
        </ul>
        <h3>Three stars</h3>
        <ul>
          <li>★ finish the supply journey and draw hot water.</li>
          <li>★★ heat the tank to its setpoint before drawing.</li>
          <li>★★★ store it at 60 °C or more, then draw it.</li>
        </ul>
      `
    },

    zh: {
      title: '家里的水',
      menu: '菜单',

      tabSupply: '从河到水龙头',
      tabHeater: '热水器',

      hudTemp: '水箱',
      hudDrawn: '取水',

      w1: '水源',
      w2: '格栅与沉砂',
      w3: '混凝',
      w4: '沉淀',
      w5: '过滤',
      w6: '消毒',
      w7: '储存与泵送',
      w8: '水表与水龙头',

      wf1: '旅程从河流、水库或地下水开始。保护水源不被污染，是最便宜也最重要的一步。',
      wf2: '金属格栅拦住树枝、落叶和塑料。沙子和小石子这类沉砂，会在缓慢的水道里沉下来。',
      wf3: '加入一点点明矾或铁盐，快速搅拌。细小的脏颗粒会粘在一起，变成更大的“絮体”。',
      wf4: '水在很大的池子里静置。絮体沉到底部变成污泥，比较清的水从上面流走。',
      wf5: '水慢慢流过沙子和砾石层。剩下的颗粒被拦住；活性炭还能吸附一些味道和化学物质。',
      wf6: '氯、氯胺、臭氧或紫外线可以杀死细菌和病毒。水里会留一点氯，保护它一路流过管道。',
      wf7: '干净的水储存在有盖的水池或服务水库里，再由水泵送进主管。管道保持压力，水才能上到楼上的水龙头。',
      wf8: '边界上的水表记录你用了多少水。进户管把水带进家里，压力把水从水龙头推出来。',

      stepLabel: '第',
      next: '下一步',
      back: '上一步',
      doneSupply: '这就是全部旅程 — 从河到水龙头。',

      power: '电源',
      on: '开',
      off: '关',
      setpoint: '设定温度',
      tankTemp: '热水温度',
      bottomTemp: '底部',
      draw: '放出热水',
      upperElementShort: '上加热棒',
      lowerElementShort: '下加热棒',
      reliefShort: '泄压阀',
      heating: '正在加热',
      upperHeating: '上加热棒',
      lowerHeating: '下加热棒',
      ready: '到达设定',
      cold: '冷水',
      heaterFact: '冷水从进水管（dip tube）送到水箱底部。上面的加热棒先加热顶部；上恒温器满足后，下面的加热棒再接手。',

      tSupply: '跟着水从水源一路走到水龙头。每一步都是真实自来水厂的一部分。',
      tHeater: '设定温度，看两根加热棒怎么工作。上面的加热棒先加热顶部，下面的再加热其余部分。放热水时看看混水阀后的水温。',
      tSafety: '热水要储存在 60°C 以上，才能杀死军团菌。混水阀再把水降到约 50°C，防止烫伤。',
      tAnode: '镁或铝阳极棒会“牺牲”自己，保护钢制水箱不生锈。压力释放阀则把膨胀的水安全放掉。',
      tUpper: '上面的加热棒正在加热水箱顶部。热水往上升，所以顶部先变热，上恒温器先断电。',
      tLower: '上恒温器已经满足。现在下面的加热棒加热底部，让整箱水都达到温度。',
      tReadyHeater: '两个恒温器都满足了。水箱已经达到设定温度，可以放热水了。',
      nUpper: '上加热棒先加热顶部。',
      nLower: '接着下加热棒加热底部。',
      nMix: '混水阀把出水限制在约 50°C。',

      waterPerfect: '你跟着水从河走到水龙头，还把水加热到 60°C 以上才使用。安全又节能。',
      waterGood: '供水旅程完成了，热水也能用；但储水低于 60°C，军团菌可能存活。',
      waterCold: '水还没热你就放水了。先加热到设定温度。',

      leadSupply: '供水旅程',
      leadHeater: '热水器剖面',
      statusSupply: '跟着水流',
      statusHeater: '正在加热',
      statusUpper: '上加热棒',
      statusLower: '下加热棒',
      statusReady: '已到达',
      statusDone: '完成',

      lSource: '水源',
      lScreens: '格栅',
      lCoag: '混凝',
      lSettle: '沉淀',
      lFilter: '过滤',
      lDisinfect: '消毒',
      lTank: '储水',
      lMeter: '水表',
      lTap: '水龙头',
      lColdIn: '冷水进',
      lHotOut: '热水出',
      lElement: '加热棒',
      lThermostat: '恒温器',
      lAnode: '阳极棒',
      lMix: '混水阀',
      lInsulation: '保温层',
      lUpperElement: '上加热棒',
      lLowerElement: '下加热棒',
      lDipTube: '进水管',
      lUpperThermostat: '上恒温器',
      lLowerThermostat: '下恒温器',
      lRelief: '泄压阀',
      lDrain: '排水阀',

      helpTitle: '家里的水',
      helpBody: `
        <h3>从河到水龙头</h3>
        <ul>
          <li><b>水源</b> — 河流、水库或地下水。</li>
          <li><b>格栅与沉砂</b> — 拦住树枝、落叶、塑料和沙子。</li>
          <li><b>混凝</b> — 明矾让细小的脏颗粒粘成絮体。</li>
          <li><b>沉淀</b> — 絮体沉到底部变成污泥。</li>
          <li><b>过滤</b> — 沙子和砾石拦住剩下的颗粒。</li>
          <li><b>消毒</b> — 氯、臭氧或紫外线杀死病菌；余氯继续保护管道。</li>
          <li><b>储存与泵送</b> — 让主管保持压力。</li>
          <li><b>水表与水龙头</b> — 记录用水，把水送到家。</li>
        </ul>
        <h3>热水器</h3>
        <ul>
          <li>冷水从<b>进水管（dip tube）</b>送到水箱底部，不会和顶部的热水混在一起。</li>
          <li><b>上加热棒</b>先加热顶部；上恒温器满足后断电，<b>下加热棒</b>再接手。</li>
          <li>水箱有<b>保温层</b>，<b>阳极棒</b>会牺牲自己保护钢制水箱不生锈。</li>
          <li><b>泄压阀</b>把膨胀的水安全放掉。</li>
          <li>储水要保持在 <b>60°C 以上</b> 杀死军团菌；混水阀再降到约 50°C 出水。</li>
        </ul>
        <h3>三颗星</h3>
        <ul>
          <li>★ 走完供水旅程，并放出热水。</li>
          <li>★★ 把水加热到设定温度后再放水。</li>
          <li>★★★ 储水达到 60°C 以上，再使用。</li>
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
