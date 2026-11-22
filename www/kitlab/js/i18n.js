/* kitlab/js/i18n.js */
window.ARG = window.ARG || {};

ARG.i18n = (function () {
  const DICT = {
    en: {
      title: 'Electromagnet Kit Lab',
      menu: 'Menu',
      lead: 'Build from the kit',
      hudDone: 'Experiments', hudRead: 'Reading', hudState: 'Circuit',
      experiment: 'Experiment', parts: 'Tap the parts you need',
      built: 'On the bench', run: 'RUN', reset: 'CLEAR',
      statusBuild: 'Build it', statusReady: 'Ready — press RUN', statusRun: 'Running',
      toastWrong: 'That part is not needed for this experiment.',
      toastDone: 'Kit Lab badge earned — all eight experiments!',
      helpTitle: 'The kit, piece by piece',
      helpSub: 'Batteries, meters, coils, motors and more',
      helpBody: `
        <h3>How to play</h3>
        <p>Pick an experiment, then tap the parts it needs from the tray. When the bench is complete, press <code>RUN</code>. Tapping a part that is not needed will not work — the experiment tells you what it needs.</p>
        <h3>The experiments</h3>
        <ul>
          <li><code>Bulb</code> — a closed loop with a switch.</li>
          <li><code>Ammeter</code> — measure current in series; a resistor limits it.</li>
          <li><code>Electromagnet</code> — a coil on an iron nail picks up paperclips.</li>
          <li><code>Motor</code> — current in a coil turns a fan.</li>
          <li><code>Generator</code> — turning the crank lights an LED.</li>
          <li><code>Solar</code> — light makes voltage and turns the fan.</li>
          <li><code>Magnet</code> — a compass and iron filings show the field.</li>
          <li><code>Static</code> — fur and a rubber rod charge an electroscope.</li>
        </ul>
        <p>The kit also contains a rheostat, bell, photoresistor, magnetic car, ring magnets, alligator clips, copper and zinc sheets and more — they are in the tray for future experiments.</p>`
    },
    zh: {
      title: '电磁实验箱',
      menu: '菜单',
      lead: '从实验箱里搭建',
      hudDone: '实验', hudRead: '读数', hudState: '电路',
      experiment: '实验', parts: '点选需要的零件',
      built: '实验台上', run: '运行', reset: '清空',
      statusBuild: '开始搭建', statusReady: '准备好了——按运行', statusRun: '运行中',
      toastWrong: '这个实验不需要这个零件。',
      toastDone: '实验箱徽章到手——八个实验都完成了！',
      helpTitle: '实验箱里的零件',
      helpSub: '电池、电表、线圈、电动机等等',
      helpBody: `
        <h3>怎样玩</h3>
        <p>先选一个实验，再从左边的零件盘里点出它需要的零件。实验台搭好后按 <code>运行</code>。不需要的零件点不上去——实验会告诉你缺什么。</p>
        <h3>八个实验</h3>
        <ul>
          <li><code>小灯泡</code>——电池、开关、灯泡和导线组成闭合回路。</li>
          <li><code>电流表</code>——串联测电流；电阻限制电流。</li>
          <li><code>电磁铁</code>——线圈绕在铁钉上，通电吸起回形针。</li>
          <li><code>电动机</code>——线圈通电，带动风扇转。</li>
          <li><code>手摇发电机</code>——摇动手柄，点亮 LED。</li>
          <li><code>太阳能</code>——光照产生电压，带动风扇。</li>
          <li><code>磁场</code>——磁铁、指南针和铁粉显示磁场。</li>
          <li><code>静电</code>——毛皮摩擦橡胶棒，验电器张开。</li>
        </ul>
        <p>箱里还有滑动变阻器、电铃、光敏电阻、磁力小车、环形磁铁、鳄鱼夹、铜片和锌片等，都放在零件盘里，留给以后的实验。</p>`
    }
  };

  /* components */
  const C = {
    cBattery: ['Battery box', '电池盒'],
    cSwitch: ['Switch', '开关'],
    cBulb: ['Bulb + holder', '小灯泡和灯座'],
    cWires: ['Wires', '导线'],
    cResistor: ['10 Ω resistor', '10 欧电阻'],
    cAmmeter: ['Ammeter', '电流表'],
    cVoltmeter: ['Voltmeter', '电压表'],
    cRheostat: ['Rheostat', '滑动变阻器'],
    cBell: ['Electric bell', '电铃'],
    cMotor: ['Small motor', '小马达'],
    cFan: ['Fan blade', '小扇叶'],
    cCoil: ['Coil', '线圈'],
    cNail: ['Iron nail', '铁钉'],
    cClips: ['Paperclips', '回形针'],
    cHandgen: ['Hand generator', '手摇发电机'],
    cLed: ['LED', '发光二极管'],
    cSolar: ['Solar panel', '太阳能板'],
    cMagnet: ['Bar magnet', '条形磁铁'],
    cCompass: ['Compass', '指南针'],
    cPowder: ['Iron filings', '铁粉'],
    cElectroscope: ['Electroscope', '验电器'],
    cFur: ['Fur', '毛皮'],
    cRod: ['Rubber rod', '橡胶棒'],
    cSilk: ['Silk', '丝绸'],
    cPhoto: ['Photoresistor', '光敏电阻'],
    cScrewdriver: ['Screwdriver', '螺丝刀'],
    cCar: ['Magnetic car', '磁力小车'],
    cRing: ['Ring magnet', '环形磁铁'],
    cAlligator: ['Alligator clips', '鳄鱼夹'],
    cCopper: ['Copper sheet', '铜片'],
    cZinc: ['Zinc sheet', '锌片'],
    cTube: ['Hollow copper tube', '空心铜管'],
    cStraw: ['Straw', '吸管'],
    cSandpaper: ['Sandpaper', '砂纸'],
    cRuler: ['Ruler', '绘图尺'],
    cGuide: ['Guidebook', '实验指导书']
  };
  Object.keys(C).forEach(k => {
    DICT.en[k] = C[k][0];
    DICT.zh[k] = C[k][1];
  });

  /* experiment names / instructions / facts */
  const X = {
    exBulb: ['Light the bulb', '点亮小灯泡'],
    howBulb: ['Place the battery, switch, bulb and wires.', '放上电池盒、开关、小灯泡和导线。'],
    factBulb: ['The loop is closed, so current flows and the bulb glows. Opening the switch breaks the loop.', '回路闭合，电流流动，灯泡发光。打开开关就断开回路。'],

    exMeter: ['Measure current', '测量电流'],
    howMeter: ['Place the battery, switch, 10 Ω resistor, ammeter and wires.', '放上电池盒、开关、10 欧电阻、电流表和导线。'],
    factMeter: ['The ammeter is in series. The resistor limits the current to about 0.12 A.', '电流表串联在电路里。电阻把电流限制在约 0.12 安。'],

    exMagnet: ['Make an electromagnet', '做一个电磁铁'],
    howMagnet: ['Place the battery, switch, coil, iron nail, paperclips and wires.', '放上电池盒、开关、线圈、铁钉、回形针和导线。'],
    factMagnet: ['Current in the coil turns the nail into a magnet. More turns or more current make it stronger.', '线圈通电后铁钉变成磁铁。圈数越多或电流越大，磁性越强。'],

    exMotor: ['Spin the fan', '让风扇转'],
    howMotor: ['Place the battery, switch, motor, fan blade and wires.', '放上电池盒、开关、小马达、扇叶和导线。'],
    factMotor: ['Current in the motor coil is pushed by the magnets; the commutator keeps it turning.', '马达线圈通电后被磁铁推动；换向器让它持续转动。'],

    exGen: ['Hand generator', '手摇发电机'],
    howGen: ['Place the hand generator, LED and wires.', '放上手摇发电机、LED 和导线。'],
    factGen: ['Turning the crank moves a magnet past a coil; that induces a voltage and lights the LED.', '摇动手柄让磁铁扫过线圈，产生感应电压，点亮 LED。'],

    exSolar: ['Solar fan', '太阳能风扇'],
    howSolar: ['Place the solar panel, motor, fan blade and wires.', '放上太阳能板、小马达、扇叶和导线。'],
    factSolar: ['Light on the panel makes a voltage; that drives the motor. More light means more voltage and speed.', '光照在太阳能板上产生电压，驱动马达。光越强，电压越高，转得越快。'],

    exField: ['See the field', '看见磁场'],
    howField: ['Place the bar magnet, compass and iron filings.', '放上条形磁铁、指南针和铁粉。'],
    factField: ['The compass needle follows the field. Iron filings line up along it, from N to S.', '指南针指针顺着磁场。铁粉会沿磁感线排列，从 N 到 S。'],

    exStatic: ['Static charge', '静电'],
    howStatic: ['Place the fur, rubber rod and electroscope.', '放上毛皮、橡胶棒和验电器。'],
    factStatic: ['Rubbing the rod with fur transfers charge. The electroscope leaves repel and spread apart.', '用毛皮摩擦橡胶棒会转移电荷。验电器的金属片互相排斥而张开。']
  };
  Object.keys(X).forEach(k => {
    DICT.en[k] = X[k][0];
    DICT.zh[k] = X[k][1];
  });

  let lang = ARG.store.get('arg.lang');
  if (!lang || !DICT[lang]) lang = 'zh';
  if (ARG.config && ARG.config.lockLang) lang = ARG.config.lockLang;

  const t = k => (DICT[lang] && DICT[lang][k] !== undefined) ? DICT[lang][k] : k;

  function apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = DICT[lang][el.dataset.i18n];
      if (v !== undefined) el.textContent = v;
    });
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    const ht = document.getElementById('help-title');
    if (ht) ht.textContent = t('helpTitle');
    const hs = document.getElementById('help-sub');
    if (hs) hs.textContent = t('helpSub');
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
