/* ═══════════════════════════════════════════
   Electrical Safety — i18n
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.i18n = (function () {

  const DICT = {
    en: {
      title: 'Electrical Safety',
      menu: 'Menu',
      hudStep: 'Step',
      lead: 'Electrical safety',
      status: 'Staying safe',

      s1t: 'Never poke a socket',
      s2t: 'Water and electricity',
      s3t: 'Do not overload',
      s4t: 'Damaged cords',
      s5t: 'Earth and the RCD',
      s6t: 'Short circuits and storms',

      s1f: 'A wall socket carries 230 volts. Never put your fingers, wire or a key into the holes, and never push anything else in.',
      s2f: 'Water conducts electricity. Keep wet hands away from plugs, switches and appliances — water and electricity stay apart.',
      s3f: 'Too many appliances in one extension lead can overheat and even start a fire. High-power appliances need their own socket.',
      s4f: 'A cut or worn cord with bare copper showing is dangerous. Do not wrap it with tape yourself — tell a grown-up to replace it.',
      s5f: 'The third pin on a plug is the earth wire, which takes leaking current safely to the ground. An RCD cuts the power the moment it detects a leak.',
      s6f: 'A short circuit makes sparks and heat. If an appliance smokes or smells burnt, switch off the main switch, call a grown-up, and call 999 if there is a fire.',

      wSocket: 'socket',
      wSocketD: 'The wall outlet that supplies electricity. In Malaysia it is 230 volts.',
      wInsulation: 'insulation',
      wInsulationD: 'A material that does not conduct electricity, such as plastic or rubber.',
      wEarth: 'earth wire',
      wEarthD: 'A safety wire that takes leaking current safely into the ground.',
      wRcd: 'RCD',
      wRcdD: 'A safety switch that cuts the power when it detects a leak.',
      wOverload: 'overload',
      wOverloadD: 'Too many appliances drawing current from one socket or extension lead.',
      wShort: 'short circuit',
      wShortD: 'Current taking a shortcut instead of the proper path, making heat and sparks.',
      wStorm: 'thunderstorm',
      wStormD: 'Stormy weather with lightning — keep away from plugs and appliances.',

      lSocket: 'socket',
      lWater: 'water',
      lStrip: 'extension lead',
      lCord: 'damaged cord',
      lRcd: 'RCD',
      lEarth: 'earth',
      lStorm: 'lightning',

      note: 'Look at one step, read it, then tap NEXT. Tap any key word to hear what it means.',
      readAgain: 'Read again',
      back: 'BACK',
      next: 'NEXT',
      again: 'START AGAIN',
      result: 'You know the six rules that keep electricity safe at home.',

      helpTitle: 'Staying safe with electricity',
      helpBody: `
        <h3>The rules</h3>
        <ul>
          <li>Never poke anything into a socket — it carries 230 V.</li>
          <li>Keep water and wet hands away from plugs and switches.</li>
          <li>Do not overload one extension lead; high-power appliances get their own socket.</li>
          <li>Replace damaged cords — tape is not a repair.</li>
          <li>Use the earth pin, and test the RCD regularly.</li>
        </ul>
        <h3>If something goes wrong</h3>
        <ul>
          <li>Do not touch a smoking appliance or a sparking socket.</li>
          <li>Switch off at the main switch if it is safe to reach.</li>
          <li>Tell a grown-up. For a fire, get out and call 999.</li>
        </ul>
      `
    },

    zh: {
      title: '安全用电',
      menu: '菜单',
      hudStep: '步骤',
      lead: '安全用电',
      status: '安全第一',

      s1t: '不要碰插座',
      s2t: '水和电要分开',
      s3t: '不要过载',
      s4t: '破损电线要换',
      s5t: '接地和漏电保护',
      s6t: '短路、雷雨和怎么办',

      s1f: '插座里有 230 伏的电。不要用手指、铁丝或钥匙去碰插孔，也不要把别的东西塞进去。',
      s2f: '水会导电。湿手不要碰插头、开关和电器；水和电要分开。',
      s3f: '一个插线板插太多电器，会过热甚至起火。大功率电器要用自己的插座。',
      s4f: '电线破了、露出铜丝，很危险。不要用胶布自己缠，要告诉大人换新的。',
      s5f: '三脚插头有一根地线，能把漏出来的电引到地下；漏电保护器会在漏电时立刻断电。',
      s6f: '短路会冒火花、发热。发现电器冒烟或有焦味，先关总开关，叫大人，必要时打 999。',

      wSocket: '插座',
      wSocketD: '墙上的电源接口。马来西亚的插座是 230 伏。',
      wInsulation: '绝缘',
      wInsulationD: '不导电的材料，比如塑料和橡胶。',
      wEarth: '接地线',
      wEarthD: '把漏出来的电安全地引到地下的保护线。',
      wRcd: '漏电保护器',
      wRcdD: '发现漏电时立刻切断电源的安全开关。',
      wOverload: '过载',
      wOverloadD: '一个插座或插线板接了太多电器，电流太大。',
      wShort: '短路',
      wShortD: '电流不经过电器，直接走捷径，会发热冒火花。',
      wStorm: '雷雨',
      wStormD: '打雷下雨的天气，这时要远离插头和电器。',

      lSocket: '插座',
      lWater: '水',
      lStrip: '插线板',
      lCord: '破损电线',
      lRcd: '漏电保护器',
      lEarth: '接地',
      lStorm: '打雷',

      note: '看一步，读一步。按“下一步”继续；点关键词，听听它是什么意思。',
      readAgain: '再读一次',
      back: '上一步',
      next: '下一步',
      again: '重新开始',
      result: '你记住了让家里用电安全的六条规则。',

      helpTitle: '安全用电',
      helpBody: `
        <h3>要记住的规则</h3>
        <ul>
          <li>不要用手指或任何东西去碰插座——它是 230 伏。</li>
          <li>水和湿手要远离插头和开关。</li>
          <li>一个插线板不要接太多电器；大功率电器用自己的插座。</li>
          <li>电线破了要换新的，胶布不是修理。</li>
          <li>用三脚插头的地线，并定期测试漏电保护器。</li>
        </ul>
        <h3>出问题时</h3>
        <ul>
          <li>不要碰冒烟的电器或冒火花的插座。</li>
          <li>如果够得到，先关总开关。</li>
          <li>告诉大人；如果起火，先离开再打 999。</li>
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
