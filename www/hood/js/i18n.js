/* ═══════════════════════════════════════════
   Kitchen Hood — i18n
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.i18n = (function () {

  const DICT = {
    en: {
      title: 'Kitchen Hood',
      menu: 'Menu',
      fan: 'FAN',
      fOff: 'OFF', f1: 'LOW', f2: 'MED', f3: 'HIGH',
      light: 'LIGHT',
      modeDuct: 'OUTSIDE',
      modeRecirc: 'RECIRCULATE',
      filter: 'FILTER',
      clean: 'CLEAN', dirty: 'DIRTY',
      washIt: 'WASH IT',
      on: 'ON', off: 'OFF',
      cooking: 'COOKING', idleState: 'IDLE',

      mAir: 'Airflow',
      mCaught: 'Smoke caught',
      mNoise: 'Noise',
      unitAir: 'm³/h',
      unitNoise: 'dB',

      ducted: 'Air goes outside',
      recirc: 'Air comes back in',
      blowing: 'Blowing',
      idle: 'Off',

      lHood: 'hood', lBlower: 'blower', lFilter: 'grease filter',
      lCup: 'oil cup', lDuct: 'duct', lDamper: 'damper',
      lStove: 'stove', lWok: 'wok', lGrille: 'grille',
      lCarbon: 'carbon filter', lOutside: 'OUTSIDE',

      tOff: 'The fan is off. Hot smoke simply rises and spreads around your kitchen.',
      tDirty: 'The grease filter is clogged. Air cannot get through, so the fan pulls less, runs louder and catches less smoke. Take it out and wash it in hot soapy water.',
      tRecirc: 'This hood has no duct. It pulls the air through a carbon filter and blows it back into the kitchen. The grease is caught, but the smell stays in the room.',
      tDuct: 'A ducted hood pushes the air right out through the wall or the roof. Grease, steam and smell all leave the house.',
      tGood: 'Hot air rises by itself, and the spinning blower makes a low-pressure area above the stove, so the smoke is pushed up into the hood.',
      tFilter: 'The mesh filter is the first stop. Grease droplets hit the metal and stick to it. The oil runs down the slope and drips into the little cup you can pull out.',
      tBlower: 'The blower is a wheel with many curved blades. It throws air outwards, which leaves a low pressure in the middle — so air keeps rushing in. That is what makes the suction.',
      tDamper: 'The little flap in the duct is a damper. Air pushes it open when the fan runs. When you switch off it falls shut, so smells, draughts and birds stay outside.',
      tDuct2: 'The duct is the pipe that carries the air away. Keep it short and wide — a long, narrow duct is like breathing through a straw, and the fan cannot move much air.',

      helpTitle: 'How a kitchen hood works',
      helpBody: `
        <h3>The journey of the smoke</h3>
        <ul>
          <li><code>1</code> Cooking makes hot smoke and steam, and hot air rises.</li>
          <li><code>2</code> The blower spins and creates low pressure above the stove.</li>
          <li><code>3</code> Higher pressure in the room pushes the smoke up into the hood.</li>
          <li><code>4</code> The <b>grease filter</b> catches the oil; it drips into the oil cup.</li>
          <li><code>5</code> The clean air goes up the <b>duct</b> and outside, past the <b>damper</b>.</li>
        </ul>
        <h3>Try these experiments</h3>
        <ul>
          <li>Turn the fan to <code>OFF</code> and watch the smoke escape into the room.</li>
          <li>Press <code>FILTER → DIRTY</code>. The airflow drops, the noise goes up and smoke starts escaping — exactly what a clogged filter does in a real kitchen.</li>
          <li>Switch between <code>OUTSIDE</code> and <code>RECIRCULATE</code> to see where the air ends up.</li>
        </ul>
        <h3>Two things to remember</h3>
        <ul>
          <li>A hood does not "suck" like a vacuum cleaner. It makes a <b>low-pressure area</b>, and the air around it pushes the smoke up.</li>
          <li>Wash the grease filter regularly. A greasy filter is the number one reason a hood stops working well.</li>
        </ul>
      `
    },

    zh: {
      title: '抽油烟机',
      menu: '菜单',
      fan: '风速',
      fOff: '关闭', f1: '低速', f2: '中速', f3: '高速',
      light: '灯光',
      modeDuct: '排到室外',
      modeRecirc: '室内循环',
      filter: '滤网',
      clean: '干净', dirty: '脏了',
      washIt: '去洗一洗',
      on: '开', off: '关',
      cooking: '正在做菜', idleState: '空闲',

      mAir: '风量',
      mCaught: '吸走油烟',
      mNoise: '噪音',
      unitAir: '立方米/时',
      unitNoise: '分贝',

      ducted: '空气排到室外',
      recirc: '空气回到室内',
      blowing: '正在排风',
      idle: '已关闭',

      lHood: '烟机', lBlower: '风轮', lFilter: '滤油网',
      lCup: '油杯', lDuct: '排烟管', lDamper: '止回阀',
      lStove: '灶台', lWok: '炒锅', lGrille: '出风口',
      lCarbon: '活性炭', lOutside: '室外',

      tOff: '风机没开。热油烟只会往上升，然后散到整个厨房里。',
      tDirty: '滤油网被油堵住了。空气过不去，风量变小、噪音变大、吸走的油烟也变少。把滤网拆下来用热水加洗洁精洗一洗。',
      tRecirc: '这种烟机没有排烟管。它把空气抽过活性炭，再吹回厨房里。油是拦住了，但味道还留在屋里。',
      tDuct: '外排式烟机把空气直接推到墙外或屋顶外。油烟、水汽和味道都离开了这个家。',
      tGood: '热空气自己就会上升，转动的风轮在灶台上方造成一个低压区，所以油烟被周围较高的气压推上去。',
      tFilter: '金属滤网是第一道关。油滴撞到网上就粘住了。油顺着斜面往下流，滴进那个可以抽出来倒掉的小油杯里。',
      tBlower: '风轮是一个有很多弯叶片的大轮子。它把空气往外甩，中间就留下一个低压区，空气于是不断被吸进来。吸力就是这么来的。',
      tDamper: '排烟管里那片小翻板叫止回阀。风机一开，风把它吹开；一关机，它就自己落下来，把味道、倒灌的风和鸟都挡在外面。',
      tDuct2: '排烟管负责把空气送走。它越短越粗越好 — 又长又细的管子就像用吸管呼吸，风机根本抽不动多少空气。',

      helpTitle: '抽油烟机是怎么工作的',
      helpBody: `
        <h3>油烟的一段旅程</h3>
        <ul>
          <li><code>1</code> 做菜会产生热的油烟和水汽，热空气会往上升。</li>
          <li><code>2</code> 风轮转起来，在灶台上方形成一个低压区。</li>
          <li><code>3</code> 厨房里较高的气压把油烟推上去，进了烟机。</li>
          <li><code>4</code> <b>滤油网</b>把油拦下来，油滴进<b>油杯</b>里。</li>
          <li><code>5</code> 干净的空气顺着<b>排烟管</b>往外走，推开<b>止回阀</b>排到室外。</li>
        </ul>
        <h3>做几个实验</h3>
        <ul>
          <li>把风速按到 <code>关闭</code>，看油烟怎么跑进屋里。</li>
          <li>按 <code>滤网 → 脏了</code>。风量掉下来、噪音变大、油烟开始外漏 — 这就是真厨房里滤网堵住的样子。</li>
          <li>在 <code>排到室外</code> 和 <code>室内循环</code> 之间切换，看空气最后去了哪里。</li>
        </ul>
        <h3>记住两件事</h3>
        <ul>
          <li>烟机不是像吸尘器那样“吸”。它只是造出一个<b>低压区</b>，是周围的空气把油烟压上去的。</li>
          <li>滤油网要定期清洗。滤网一油，烟机就基本废了 — 这是最主要的原因。</li>
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
