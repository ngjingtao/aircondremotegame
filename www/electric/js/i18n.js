/* ═══════════════════════════════════════════
   Electricity — i18n
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.i18n = (function () {

  const DICT = {
    en: {
      title: 'Electricity',
      menu: 'Menu',
      hudStep: 'Step',
      lead: 'Electricity',
      status: 'Following the current',

      s1t: 'The battery',
      s2t: 'A closed circuit',
      s3t: 'The switch',
      s4t: 'The bulb',
      s5t: 'Conductors & insulators',
      s6t: 'Electrical safety',

      s1f: 'A battery stores chemical energy, with a positive and a negative terminal. Think of it as a little reservoir of electricity.',
      s2f: 'Current only flows around one complete loop: out of the battery, through the wires and the bulb, and back again. Break the loop and the current stops.',
      s3f: 'The switch is a gate for the current. Close it and the circuit is complete; open it and the current cannot get through.',
      s4f: 'Current pushes through the thin filament, which gets hot and glows. Electrical energy turns into light and heat.',
      s5f: 'Copper, iron and aluminium let current pass easily — they are conductors. Plastic, rubber and wood do not — they are insulators.',
      s6f: 'A wall socket carries 230 volts. Never touch it with your fingers, metal, or wet hands.',

      wCell: 'battery',
      wCellD: 'A battery stores chemical energy and turns it into electrical energy.',
      wPole: 'terminals',
      wPoleD: 'The two ends of a battery. Current leaves the positive end and returns to the negative end.',
      wCircuit: 'circuit',
      wCircuitD: 'The complete loop that current travels around.',
      wCurrent: 'current',
      wCurrentD: 'Electric charge flowing through a wire is called current.',
      wSwitch: 'switch',
      wSwitchD: 'A part that closes or opens a circuit.',
      wFilament: 'filament',
      wFilamentD: 'The thin metal wire inside a bulb. Current makes it hot and bright.',
      wEnergy: 'electrical energy',
      wEnergyD: 'Electricity can do work, make heat and make light.',
      wConductor: 'conductor',
      wConductorD: 'A material that lets current pass easily, such as copper or iron.',
      wInsulator: 'insulator',
      wInsulatorD: 'A material that blocks current, such as plastic or rubber.',
      wMains: 'mains electricity',
      wMainsD: 'The 230-volt supply in a wall socket. It is very dangerous.',
      wSafe: 'electrical safety',
      wSafeD: 'Never touch a socket. Keep wet hands away from appliances, and tell a grown-up about damaged wires.',

      lBattery: 'battery',
      lWire: 'wire',
      lSwitch: 'switch',
      lBulb: 'bulb',
      lConductor: 'conductor',
      lInsulator: 'insulator',
      lDanger: 'danger',

      note: 'Look at one step, read it, then tap NEXT. Tap any key word to hear what it means.',
      readAgain: 'Read again',
      back: 'BACK',
      next: 'NEXT',
      again: 'START AGAIN',
      result: 'You followed the current all the way round — and met conductors and insulators.',

      helpTitle: 'Electricity',
      helpBody: `
        <h3>One loop, one current</h3>
        <ul>
          <li><b>Battery</b> — stores chemical energy and pushes current out of its positive terminal.</li>
          <li><b>Circuit</b> — a complete loop. Break it anywhere and the current stops.</li>
          <li><b>Switch</b> — a gate that closes or opens the loop.</li>
          <li><b>Bulb</b> — the filament gets hot and glows, turning electricity into light and heat.</li>
        </ul>
        <h3>Conductors and insulators</h3>
        <ul>
          <li><b>Conductors</b> — copper, iron and aluminium let current pass.</li>
          <li><b>Insulators</b> — plastic, rubber and wood block it. The plastic around a wire keeps you safe.</li>
        </ul>
        <h3>⚠️ Safety</h3>
        <ul>
          <li>Wall sockets carry 230 V. Never poke anything into one.</li>
          <li>Keep water and wet hands away from plugs and switches.</li>
          <li>If a wire is damaged, stop and tell a grown-up.</li>
        </ul>
      `
    },

    zh: {
      title: '电的旅行',
      menu: '菜单',
      hudStep: '步骤',
      lead: '电的旅行',
      status: '跟着电流走',

      s1t: '电池',
      s2t: '闭合电路',
      s3t: '开关',
      s4t: '灯泡',
      s5t: '导体和绝缘体',
      s6t: '安全用电',

      s1f: '电池把化学能存起来，两头是正极和负极。它就像电的“水库”。',
      s2f: '电流只走一条完整的路：从电池出发，经过电线和灯泡，再回到电池。路断了一处，电流就停了。',
      s3f: '开关是电流的门。合上开关，电路接通；打开开关，电流就过不去。',
      s4f: '电流通过细细的灯丝，灯丝变热、发亮。电变成了光和热。',
      s5f: '铜、铁、铝容易让电流通过，叫导体。塑料、橡胶、木头不容易让电流通过，叫绝缘体。',
      s6f: '家里的插座是 230 伏的市电，非常危险。不要用手指、金属或湿手碰它。',

      wCell: '电池',
      wCellD: '把化学能变成电能的装置。',
      wPole: '正极和负极',
      wPoleD: '电池的两头。电流从正极流出，最后回到负极。',
      wCircuit: '电路',
      wCircuitD: '电流走的一整圈路。',
      wCurrent: '电流',
      wCurrentD: '电荷在导线里流动，就叫电流。',
      wSwitch: '开关',
      wSwitchD: '控制电路接通或断开的零件。',
      wFilament: '灯丝',
      wFilamentD: '灯泡里细细的金属丝，通电会发热发光。',
      wEnergy: '电能',
      wEnergyD: '电可以做功、发热、发光。',
      wConductor: '导体',
      wConductorD: '容易让电流通过的物体，比如铜和铁。',
      wInsulator: '绝缘体',
      wInsulatorD: '不容易让电流通过的物体，比如塑料和橡胶。',
      wMains: '市电',
      wMainsD: '墙上插座里的电，230 伏，非常危险。',
      wSafe: '安全用电',
      wSafeD: '不碰插座，不用湿手摸电器，发现电线破损要马上告诉大人。',

      lBattery: '电池',
      lWire: '电线',
      lSwitch: '开关',
      lBulb: '灯泡',
      lConductor: '导体',
      lInsulator: '绝缘体',
      lDanger: '危险',

      note: '看一步，读一步。按“下一步”继续；点关键词，听听它是什么意思。',
      readAgain: '再读一次',
      back: '上一步',
      next: '下一步',
      again: '重新开始',
      result: '你跟着电流走完了一整圈，还认识了导体和绝缘体。',

      helpTitle: '电的旅行',
      helpBody: `
        <h3>一条路，一股电流</h3>
        <ul>
          <li><b>电池</b> — 把化学能存起来，从正极推出电流。</li>
          <li><b>电路</b> — 一整圈路。哪里断了，电流就停了。</li>
          <li><b>开关</b> — 控制电路接通或断开的门。</li>
          <li><b>灯泡</b> — 灯丝变热发亮，把电变成光和热。</li>
        </ul>
        <h3>导体和绝缘体</h3>
        <ul>
          <li><b>导体</b> — 铜、铁、铝，电流容易通过。</li>
          <li><b>绝缘体</b> — 塑料、橡胶、木头，电流不容易通过。电线外面的塑料就是保护我们的。</li>
        </ul>
        <h3>⚠️ 安全</h3>
        <ul>
          <li>墙上插座是 230 伏，千万不要用手指或金属去碰。</li>
          <li>水和湿手要远离插头和开关。</li>
          <li>看到电线破损，停下来，马上告诉大人。</li>
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
      bl.textContent = lang === 'en' ? '中文' : 'EN';
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
