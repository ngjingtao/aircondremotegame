/* testpanel/js/i18n.js */
window.ARG = window.ARG || {};

ARG.i18n = (function () {
  const DICT = {
    en: {
      title: 'Test & Check Panel',
      menu: 'Menu',
      lead: 'Test & check board',
      hudW: 'Power', hudKwh: 'Energy', hudRcd: 'Safety',
      load: 'Plug a load',
      loadNone: 'Nothing', loadFluor: 'Fluorescent', loadLed: 'LED tube',
      loadE27: 'E27 bulb', loadE14: 'E14 bulb', loadMr16: 'MR16 lamp',
      loadCharger: 'Charger (no phone)',
      rcdOff: 'SWITCH OFF', rcdOn: 'SWITCH ON',
      test: 'PRESS TO TEST', reset: 'RESET RCD',
      statusNoLoad: 'No load · 0 W', statusOff: 'Switched off',
      statusTripped: 'RCD tripped', statusStandby: 'Standby', statusOn: 'Running',
      taskNone: 'Prove 0 W with no load', taskLoad: 'Run a real load',
      taskStandby: 'Find standby power', taskTest: 'Trip the RCD',
      factNoLoad: 'No load means no current. The meter stays at 0 W: the switch and the RCD are not using energy, so leaving the safety on with nothing plugged in does not cost anything.',
      factOff: 'The safety switch is off. Nothing can run until it is switched back on.',
      factLoad: 'A load is connected, so current flows and the meter counts. Compare the fluorescent tube with the LED: same light, less power.',
      factStandby: 'A charger with no phone can still draw a little standby power. Unplug it to get a true 0 W.',
      factTripped: 'The RCD tripped. That is the safety switch doing its job: it cut the power. Find the fault, then reset.',
      toastDone: 'Test & Check badge earned — no-load, load, standby and trip.',
      helpTitle: 'What the board teaches',
      helpSub: 'No load, no current — but safety still matters',
      helpBody: `
        <h3>No load, no energy</h3>
        <p>With nothing plugged in, the circuit is open. No current flows, the meter reads 0 W and no energy is used. The RCD and the switch are safety devices, not appliances — they do not use power just by being on.</p>
        <h3>Loads</h3>
        <ul>
          <li><code>Fluorescent</code> — 36 W; an older tube with a magnetic ballast.</li>
          <li><code>LED tube</code> — 18 W; about half the power for the same light.</li>
          <li><code>E27 / E14</code> — screw bulbs; 60 W and 40 W here.</li>
          <li><code>MR16</code> — a small spotlight, 20 W.</li>
          <li><code>Charger with no phone</code> — a tiny standby load, about 0.3 W.</li>
        </ul>
        <h3>Safety</h3>
        <p><b>Leaving the RCD on with no load does not waste energy.</b> Still switch off and isolate before changing a lamp or touching a holder. Press <code>TEST</code> to see the RCD trip; reset it after the fault is cleared.</p>`
    },
    zh: {
      title: '测试面板',
      menu: '菜单',
      lead: '测试与检查面板',
      hudW: '功率', hudKwh: '电量', hudRcd: '安全',
      load: '接一个负载',
      loadNone: '什么都不接', loadFluor: '日光灯管', loadLed: 'LED 灯管',
      loadE27: 'E27 灯泡', loadE14: 'E14 灯泡', loadMr16: 'MR16 射灯',
      loadCharger: '充电器（没接手机）',
      rcdOff: '开关关', rcdOn: '开关开',
      test: '按下测试', reset: '复位漏电保护',
      statusNoLoad: '没有负载 · 0 瓦', statusOff: '已关电',
      statusTripped: '漏电保护跳闸', statusStandby: '待机', statusOn: '运行中',
      taskNone: '证明没负载是 0 瓦', taskLoad: '接一个真实负载',
      taskStandby: '找到待机耗电', taskTest: '让漏电保护跳闸',
      factNoLoad: '没有负载就没有电流，电表停在 0 瓦。开关和漏电保护器本身不耗电，所以什么都没插时，让安全开关开着并不会浪费电。',
      factOff: '安全开关关着，什么都不能用，直到重新打开。',
      factLoad: '接了负载，电流才会流动，电表才开始计数。比较日光灯和 LED：同样的光，LED 更省电。',
      factStandby: '充电器没接手机也可能有待机耗电。拔掉它，才是真正的 0 瓦。',
      factTripped: '漏电保护跳闸了。这是安全开关在工作：它切断了电源。先找到故障，再复位。',
      toastDone: '测试面板徽章到手——空载、负载、待机和跳闸都看过了。',
      helpTitle: '这块面板教什么',
      helpSub: '没有负载就没有电流，但安全仍然重要',
      helpBody: `
        <h3>没有负载，就不耗电</h3>
        <p>什么都没插时，电路是断开的。没有电流，电表显示 0 瓦，也不消耗电能。漏电保护器和开关是安全装置，不是用电器——开着本身不耗电。</p>
        <h3>负载</h3>
        <ul>
          <li><code>日光灯</code>——36 瓦，老式电感镇流器。</li>
          <li><code>LED 灯管</code>——18 瓦，同样的光大约只用一半电。</li>
          <li><code>E27 / E14</code>——螺口灯泡；这里分别是 60 瓦和 40 瓦。</li>
          <li><code>MR16</code>——小射灯，20 瓦。</li>
          <li><code>没接手机的充电器</code>——很小的待机耗电，大约 0.3 瓦。</li>
        </ul>
        <h3>安全</h3>
        <p><b>没有负载时让漏电保护开着，不会浪费电。</b>但换灯管或碰灯座之前，仍然要关电、隔离。按 <code>测试</code> 看漏电保护跳闸；排除故障后再复位。</p>`
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
