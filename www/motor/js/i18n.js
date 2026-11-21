/* ═══════════════════════════════════════════
   motor/js/i18n.js — strings
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.i18n = (function () {

  const DICT = {
    en: {
      title: 'Electric Motor',
      menu: 'Menu',
      lead: 'Motor cutaway',
      hudRpm: 'Speed', hudAmp: 'Current', hudTemp: 'Coil',
      voltage: 'Voltage', load: 'Load',
      powerOn: 'POWER ON', powerOff: 'POWER OFF',
      hold: 'HOLD SHAFT', hand: 'TURN BY HAND',
      reset: 'RESET MOTOR',
      loadFan: 'Fan', loadLight: 'Light', loadHeavy: 'Heavy', loadBrake: 'Brake',
      taskSpin: 'Spin it', taskLoad: 'Add load', taskStall: 'Hold the shaft', taskHot: 'See the heat',
      taskDone: 'Badge earned',
      factIdle: 'No current, no magnetic field. The motor is still.',
      factRun: 'Current flows through the coil. The magnet pushes it, the commutator flips the current, and the shaft spins.',
      factLoad: 'More load needs more torque, so the current rises and the speed drops. Heat starts to build.',
      factStall: 'The shaft is held still. There is no back EMF, so the current spikes — the coil turns almost all the energy into heat.',
      factHot: 'The coil is hot. Release the shaft or lower the load before the insulation cooks.',
      factBurnt: 'Burnt coil. The insulation failed and the motor is damaged. Reset and try again — never hold a powered motor.',
      factGen: 'No battery, but turning the shaft makes voltage: a motor is also a generator. The LED lights up.',
      factHand: 'You are turning the shaft by hand. With power on, helping it spin raises back EMF and lowers the current.',
      statusIdle: 'Stopped', statusRun: 'Spinning', statusStall: 'Stalled', statusHot: 'Hot!',
      statusBurnt: 'Burnt', statusGen: 'Generating', statusHand: 'By hand',
      toastDone: 'Motor badge earned — you saw spin, load, stall and heat.',
      toastBurn: '⚠ The coil is burnt! Reset and try again.',
      helpTitle: 'How the motor works',
      helpSub: 'A coil, a magnet and a commutator',
      helpBody: `
        <h3>The parts</h3>
        <ul>
          <li><code>Battery</code> pushes current through the coil.</li>
          <li><code>Magnet</code> (N and S) pushes the current-carrying coil.</li>
          <li><code>Commutator</code> flips the current every half turn so the push continues.</li>
          <li><code>Shaft + fan</code> is the output; the load resists it.</li>
        </ul>
        <h3>Try this</h3>
        <ul>
          <li>Power on and watch the fan spin.</li>
          <li>Add load: the current rises and the speed drops.</li>
          <li>Hold the shaft while powered: the current spikes and the coil heats up.</li>
          <li>Turn it by hand with the power off: the LED lights — it is a generator.</li>
        </ul>
        <p><b>Never hold a powered motor.</b> A stalled motor has no back EMF, so the current is limited only by the coil resistance. The heat can burn the insulation.</p>`
    },
    zh: {
      title: '电动机',
      menu: '菜单',
      lead: '电动机剖面',
      hudRpm: '转速', hudAmp: '电流', hudTemp: '线圈',
      voltage: '电压', load: '负载',
      powerOn: '通电', powerOff: '断电',
      hold: '抓住转轴', hand: '用手转动',
      reset: '重置电机',
      loadFan: '风扇', loadLight: '轻载', loadHeavy: '重载', loadBrake: '刹车',
      taskSpin: '让它转起来', taskLoad: '加重负载', taskStall: '抓住转轴', taskHot: '看到发热',
      taskDone: '徽章到手',
      factIdle: '没有电流，就没有磁场。电动机静止。',
      factRun: '电流通过线圈，磁铁推动线圈；换向器每半圈改变电流方向，转轴就持续旋转。',
      factLoad: '负载越大，需要的力矩越大，电流升高、转速下降，线圈开始发热。',
      factStall: '转轴被抓住不动，没有反电动势，电流猛增——能量几乎全变成热。',
      factHot: '线圈已经很热。快松开转轴或减小负载，别让绝缘层烧坏。',
      factBurnt: '线圈烧了。绝缘层损坏，电动机报废。重置再来——千万不要抓住通电的电机。',
      factGen: '没有电池，用手转动转轴也会产生电压：电动机反过来就是发电机，LED 会亮。',
      factHand: '你正在用手转动转轴。通电时顺着转，会增加反电动势，电流反而下降。',
      statusIdle: '停止', statusRun: '旋转', statusStall: '堵转', statusHot: '过热！',
      statusBurnt: '烧毁', statusGen: '发电', statusHand: '手动',
      toastDone: '电动机徽章到手——你看到了旋转、负载、堵转和发热。',
      toastBurn: '⚠ 线圈烧了！重置再试。',
      helpTitle: '电动机怎样工作',
      helpSub: '线圈、磁铁和换向器',
      helpBody: `
        <h3>零件</h3>
        <ul>
          <li><code>电池</code>把电流送进线圈。</li>
          <li><code>磁铁</code>（N 和 S）推动有电流的线圈。</li>
          <li><code>换向器</code>每半圈改变电流方向，推力就能继续。</li>
          <li><code>转轴 + 风扇</code>是输出；负载会阻碍它。</li>
        </ul>
        <h3>试一试</h3>
        <ul>
          <li>通电，看风扇转起来。</li>
          <li>加负载：电流升高，转速下降。</li>
          <li>通电时抓住转轴：电流猛增，线圈发热。</li>
          <li>断电后用手转：LED 亮起——它变成了发电机。</li>
        </ul>
        <p><b>千万不要抓住通电的电机。</b>堵转时没有反电动势，电流只受线圈电阻限制，热量会烧坏绝缘层。</p>`
    }
  };

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
