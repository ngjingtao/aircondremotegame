/* ═══════════════════════════════════════════
   Power — i18n
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.i18n = (function () {

  const DICT = {
    en: {
      title: 'From Power Plant to Home',
      menu: 'Menu',
      hudStep: 'Step',
      lead: 'Power journey',
      status: 'Following the electricity',

      s1t: 'Making electricity',
      s2t: 'Stepping the voltage up',
      s3t: 'High-voltage transmission',
      s4t: 'The substation',
      s5t: 'Distribution and the meter',
      s6t: 'At the socket',

      s1f: 'A power plant burns coal or gas, or uses moving water or wind, to spin a turbine. The turbine turns a generator, and that makes electricity. Solar panels make electricity straight from sunlight.',
      s2f: 'The electricity has a long way to go. A transformer raises the voltage first: higher voltage means a smaller current, so less energy is lost on the way.',
      s3f: 'Thick cables on tall steel pylons carry the high-voltage electricity across the country.',
      s4f: 'At a substation, transformers bring the voltage down step by step until it is safe for homes and shops.',
      s5f: 'Distribution cables take it to your neighbourhood, and the meter on your house records how much you use.',
      s6f: 'In Malaysia a wall socket supplies 230 volts at 50 hertz. Once the electricity is home, using it safely matters most.',

      wTurbine: 'turbine',
      wTurbineD: 'A wheel spun by steam, moving water or wind.',
      wGenerator: 'generator',
      wGeneratorD: 'A machine that makes electricity when it is turned.',
      wTransformer: 'transformer',
      wTransformerD: 'A device that raises or lowers voltage.',
      wHighVoltage: 'high voltage',
      wHighVoltageD: 'A very high voltage, used to send electricity a long way.',
      wSubstation: 'substation',
      wSubstationD: 'A place where transformers lower the voltage for a town.',
      wMeter: 'meter',
      wMeterD: 'The box that measures how much electricity a home uses.',
      wVolt: 'volt',
      wVoltD: 'The unit of voltage, written V. A wall socket in Malaysia is 230 V.',
      wHertz: 'hertz',
      wHertzD: 'The unit of frequency — how many times per second. Malaysia uses 50 Hz.',

      lPlant: 'power plant',
      lStepup: 'step-up',
      lGrid: 'high voltage',
      lSub: 'substation',
      lMeter: 'meter',
      lSocket: 'socket 230 V',

      note: 'Look at one step, read it, then tap NEXT. Tap any key word to hear what it means.',
      readAgain: 'Read again',
      back: 'BACK',
      next: 'NEXT',
      again: 'START AGAIN',
      result: 'You followed electricity from the generator all the way to a wall socket.',

      helpTitle: 'The journey of electricity',
      helpBody: `
        <h3>From movement to electricity</h3>
        <ul>
          <li>Coal, gas, moving water or wind spins a <b>turbine</b>; solar panels make electricity straight from sunlight.</li>
          <li>The turbine turns a <b>generator</b>, which makes electricity.</li>
        </ul>
        <h3>Why high voltage?</h3>
        <ul>
          <li>A <b>transformer</b> raises the voltage before the long journey.</li>
          <li>Higher voltage means a smaller current, so less energy is lost as heat in the cables.</li>
          <li>Near towns, <b>substations</b> lower it again.</li>
        </ul>
        <h3>At home</h3>
        <ul>
          <li>The <b>meter</b> records how much you use.</li>
          <li>Malaysian sockets give <b>230 V at 50 Hz</b>. Treat every socket with care.</li>
        </ul>
      `
    },

    zh: {
      title: '电从发电厂到家里',
      menu: '菜单',
      hudStep: '步骤',
      lead: '电的旅程',
      status: '跟着电走',

      s1t: '发电',
      s2t: '把电压升高',
      s3t: '高压输电',
      s4t: '变电站',
      s5t: '配电和电表',
      s6t: '到插座',

      s1f: '发电厂烧煤、烧天然气，或者用流水、风推动涡轮。涡轮带着发电机转，就产生了电。太阳能板则直接把阳光变成电。',
      s2f: '电要走很远。先用变压器把电压升高：电压高、电流小，路上损失的电就少。',
      s3f: '高压电沿着粗粗的电缆和高高的铁塔，穿过城市和乡村。',
      s4f: '到了变电站，变压器把电压一级一级降下来，才适合家庭和商店使用。',
      s5f: '配电线路把电送到你家附近，电表记录你家用了多少电。',
      s6f: '马来西亚的插座是 230 伏、50 赫兹。电到了家，安全使用最重要。',

      wTurbine: '涡轮',
      wTurbineD: '被蒸汽、流水或风推动转动的轮子。',
      wGenerator: '发电机',
      wGeneratorD: '转动起来就能产生电的机器。',
      wTransformer: '变压器',
      wTransformerD: '把电压升高或降低的设备。',
      wHighVoltage: '高压',
      wHighVoltageD: '很高的电压，用来把电送到很远的地方。',
      wSubstation: '变电站',
      wSubstationD: '把高压电降下来，再分给城镇的地方。',
      wMeter: '电表',
      wMeterD: '记录一个家庭用了多少电的盒子。',
      wVolt: '伏特',
      wVoltD: '电压的单位，符号是 V。马来西亚的插座是 230 伏。',
      wHertz: '赫兹',
      wHertzD: '频率的单位，表示每秒多少次。马来西亚用 50 赫兹。',

      lPlant: '发电厂',
      lStepup: '升压',
      lGrid: '高压电',
      lSub: '变电站',
      lMeter: '电表',
      lSocket: '插座 230 伏',

      note: '看一步，读一步。按“下一步”继续；点关键词，听听它是什么意思。',
      readAgain: '再读一次',
      back: '上一步',
      next: '下一步',
      again: '重新开始',
      result: '你跟着电从发电机一路走到了墙上的插座。',

      helpTitle: '电的旅程',
      helpBody: `
        <h3>从运动到电</h3>
        <ul>
          <li>煤、天然气、流水或风推动<b>涡轮</b>；太阳能板则直接把阳光变成电。</li>
          <li>涡轮带着<b>发电机</b>转，就产生了电。</li>
        </ul>
        <h3>为什么要高压？</h3>
        <ul>
          <li>上路前，先用<b>变压器</b>把电压升高。</li>
          <li>电压高、电流小，电缆里因发热损失的电就少。</li>
          <li>到了城镇附近，<b>变电站</b>再把电压降下来。</li>
        </ul>
        <h3>到了家里</h3>
        <ul>
          <li><b>电表</b>记录你家用了多少电。</li>
          <li>马来西亚的插座是 <b>230 伏、50 赫兹</b>，一定要小心使用。</li>
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
