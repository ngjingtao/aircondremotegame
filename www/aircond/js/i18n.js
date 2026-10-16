/* ═══════════════════════════════════════════
   i18n.js — Play Aircond, bilingual EN / 中文
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.i18n = (function () {

  const DICT = {
    en: {
      title: 'Play Aircond',
      feeling: 'Feeling',
      score: 'Score',
      freePlay: 'Free Play',
      challenge: 'Challenge',
      brand: 'Haier',
      lockBanner: '🔒 Remote is locked — press LOCK',
      menu: 'Menu',

      'btn.turbo': 'TURBO', 'btn.quiet': '/ QUIET',
      'btn.cool': 'COOL', 'btn.self': 'SELF', 'btn.clean': 'CLEAN', 'btn.dry': 'DRY',
      'btn.temp': 'TEMP', 'btn.swing': 'SWING',
      'btn.health': 'HEALTH', 'btn.sleep': 'SLEEP',
      'btn.extra1': 'EXTRA', 'btn.extra2': 'FUNCTION',
      'btn.time': 'TIME', 'btn.on': 'ON', 'btn.off': 'OFF',
      'btn.confirm': 'CONFIRM', 'btn.cancel': 'CANCEL',
      'btn.lock': 'LOCK', 'btn.light': 'LIGHT', 'btn.reset': 'RESET',

      modeCool: 'COOL', modeHeat: 'HEAT', modeDry: 'DRY', modeFan: 'FAN',
      fanAuto: 'AUTO', fanLow: 'LOW', fanMed: 'MED', fanHigh: 'HIGH',

      moodFreezing: 'Freezing', moodCold: 'Cold', moodOk: 'Just right',
      moodHot: 'Hot', moodVeryHot: 'Very hot',

      sayFreezing: ['F-f-freezing... c-cold!', 'T-turn it up, please!', 'I am an ice cube!'],
      sayCold: ['A bit chilly...', 'Hmm, slightly cold.', 'Can we go warmer?'],
      sayOk: ['Ahh, just right~', 'Perfect temperature!', 'This is lovely.', 'Very comfortable~'],
      sayHot: ['Phew, it is warm...', 'A little hot in here.', 'Turn it cooler?'],
      sayVeryHot: ['So hot! I am melting!', 'Too hot!! Help!', 'I need cold air now!'],

      sayPowerOn: 'Air-con is on!',
      sayPowerOff: 'Wait, why off?!',
      sayTurbo: 'Whoa, turbo!',
      sayQuiet: 'So quiet...',
      saySelfClean: 'Cleaning the air-con...',
      sayHealth: 'Fresh ion air~',
      saySleep: 'Sleep mode... zzz',
      sayEco: 'Eco mode, saving power.',
      sayLockOn: 'Locked the buttons.',
      sayLockOff: 'Buttons unlocked.',
      sayLight: 'Light toggled.',
      sayReset: 'Everything reset.',

      locked: 'LOCKED',
      eventHeatwave: '🔥 HEATWAVE! Outside is boiling!',
      eventColdSnap: '❄ COLD SNAP! A chill blows in!',
      eventDoor: '🚪 DOOR OPEN! All the cold air is escaping!',
      eventHumid: '💧 HUMIDITY SURGE! It feels sticky!',
      eventBack: 'Air is back to normal.',

      acOff: 'OFF',
      acClean: 'SELF CLEAN',
      timerOn: 'ON',
      timerOff: 'OFF',

      helpTitle: 'How to play',
      helpBody: `
        <h3>Goal</h3>
        <ul><li>Keep the boy comfortable. His face shows exactly how he feels.</li></ul>
        <h3>Remote keys</h3>
        <ul>
          <li><code>Power</code> (green circle) — turn the air-con on / off.</li>
          <li><code>COOL</code> — cycles the mode: COOL → HEAT → FAN → COOL. (LCD shows the active mode.)</li>
          <li><code>DRY</code> — dehumidify mode. Removes humidity slowly.</li>
          <li><code>TEMP ▲ / ▼</code> — set 16 °C to 30 °C.</li>
          <li><code>SWING ◀ / ▶</code> — vertical and horizontal louvre swing.</li>
          <li><code>🌀</code> (centre) — fan speed: AUTO → LOW → MED → HIGH.</li>
          <li><code>TURBO / QUIET</code> — boost or silence the airflow.</li>
          <li><code>SELF CLEAN</code> — the unit runs a cleaning cycle.</li>
          <li><code>HEALTH</code> — fresh-ion air, keeps the boy fresher.</li>
          <li><code>SLEEP</code> — night mode, temperature creeps up gently.</li>
          <li><code>EXTRA FUNCTION</code> — toggles ECO (gentle, power saving).</li>
          <li><code>TIME ON / TIME OFF</code> — add 1 hour, then <code>CONFIRM</code> to arm the timer.</li>
          <li><code>LOCK</code> — child lock. <code>LIGHT</code> — screen backlight. <code>RESET</code> — restore defaults.</li>
        </ul>
        <h3>Comfort zone</h3>
        <ul><li>Roughly <b>21 – 27 °C</b>. High humidity makes it feel hotter.</li></ul>
        <h3>Challenge mode</h3>
        <ul><li>Score climbs while he is comfortable and a combo builds. Weather events will disturb the room — react fast!</li>
        <li>In-game timers run fast: 1 hour ≈ 15 seconds.</li></ul>
        <h3>Tip</h3>
        <ul><li>The boy's own remote in his hand mirrors your settings.</li></ul>
      `,

      helpTitleZh: ''
    },

    zh: {
      title: '玩空调',
      feeling: '感受',
      score: '分数',
      freePlay: '自由模式',
      challenge: '挑战模式',
      brand: '海尔',
      lockBanner: '🔒 遥控器已锁定 — 按 LOCK 解锁',
      menu: '菜单',

      'btn.turbo': '强力', 'btn.quiet': '/ 静音',
      'btn.cool': '制冷', 'btn.self': '自', 'btn.clean': '清洁', 'btn.dry': '除湿',
      'btn.temp': '温度', 'btn.swing': '摆风',
      'btn.health': '健康', 'btn.sleep': '睡眠',
      'btn.extra1': '附加', 'btn.extra2': '功能',
      'btn.time': '定时', 'btn.on': '开', 'btn.off': '关',
      'btn.confirm': '确认', 'btn.cancel': '取消',
      'btn.lock': '童锁', 'btn.light': '灯光', 'btn.reset': '复位',

      modeCool: '制冷', modeHeat: '制热', modeDry: '除湿', modeFan: '送风',
      fanAuto: '自动', fanLow: '低速', fanMed: '中速', fanHigh: '高速',

      moodFreezing: '冻僵了', moodCold: '有点冷', moodOk: '刚刚好',
      moodHot: '有点热', moodVeryHot: '热死了',

      sayFreezing: ['冷……冷死了！', '快调高一点！', '我变成冰块了！'],
      sayCold: ['有点凉……', '稍微冷了点。', '能暖一点吗？'],
      sayOk: ['啊～好舒服～', '温度刚刚好！', '太舒服了。', '真惬意～'],
      sayHot: ['呼，有点热……', '屋子里好热。', '调低一点吧？'],
      sayVeryHot: ['热死了！我要化了！', '太热了！！救命！', '快给我冷气！'],

      sayPowerOn: '空调开啦！',
      sayPowerOff: '欸？怎么关了？！',
      sayTurbo: '哇，强力模式！',
      sayQuiet: '好安静……',
      saySelfClean: '正在自清洁……',
      sayHealth: '清新负离子～',
      saySleep: '睡眠模式…… 呼噜',
      sayEco: '节能模式，省电中。',
      sayLockOn: '按钮已锁定。',
      sayLockOff: '按钮已解锁。',
      sayLight: '灯光已切换。',
      sayReset: '已恢复默认设置。',

      locked: '已锁定',
      eventHeatwave: '🔥 热浪来袭！外面要烤熟了！',
      eventColdSnap: '❄ 寒流来了！冷风灌进来！',
      eventDoor: '🚪 门开了！冷气全跑掉了！',
      eventHumid: '💧 湿度飙升！黏糊糊的！',
      eventBack: '空气恢复正常了。',

      acOff: '关机',
      acClean: '自清洁',
      timerOn: '开',
      timerOff: '关',

      helpTitle: '玩法说明',
      helpBody: `
        <h3>目标</h3>
        <ul><li>让小男孩保持舒适。他的表情会直接反映体感。</li></ul>
        <h3>遥控器按键</h3>
        <ul>
          <li><code>电源</code>（绿色圆键）— 开 / 关空调。</li>
          <li><code>制冷</code> — 循环切换模式：制冷 → 制热 → 送风 → 制冷。（屏幕显示当前模式）</li>
          <li><code>除湿</code> — 除湿模式，缓慢降低湿度。</li>
          <li><code>温度 ▲ / ▼</code> — 设定 16 ℃ 到 30 ℃。</li>
          <li><code>摆风 ◀ / ▶</code> — 上下与左右导风板摆动。</li>
          <li><code>🌀</code>（中间）— 风速：自动 → 低 → 中 → 高。</li>
          <li><code>强力 / 静音</code> — 增强或降低风量。</li>
          <li><code>自清洁</code> — 空调执行清洁循环。</li>
          <li><code>健康</code> — 负离子清新空气，让人更舒爽。</li>
          <li><code>睡眠</code> — 睡眠模式，温度缓慢上升。</li>
          <li><code>附加功能</code> — 切换 ECO 节能模式。</li>
          <li><code>定时开 / 定时关</code> — 每次加 1 小时，按 <code>确认</code> 启动定时。</li>
          <li><code>童锁</code> — 儿童锁。<code>灯光</code> — 屏幕背光。<code>复位</code> — 恢复默认。</li>
        </ul>
        <h3>舒适区</h3>
        <ul><li>大约 <b>21 – 26.5 ℃</b>。湿度越高，体感越热。</li></ul>
        <h3>挑战模式</h3>
        <ul><li>他舒适时分数持续增加，连击会叠加。天气事件会扰乱房间，要快速应对！</li>
        <li>游戏内时间加速：1 小时 ≈ 15 秒。</li></ul>
        <h3>小提示</h3>
        <ul><li>他手里的小遥控器会同步显示你的设置。</li></ul>
      `,

      helpTitleZh: '玩法说明'
    }
  };

  let lang = ARG.store.get('arg.lang');
  if (!lang || !DICT[lang]) lang = 'zh';   // Chinese unless you switch it

  function t(key) {
    const v = DICT[lang][key];
    return v === undefined ? (DICT.en[key] !== undefined ? DICT.en[key] : key) : v;
  }

  function pick(key) {
    const v = DICT[lang][key];
    if (Array.isArray(v)) return v[Math.floor(Math.random() * v.length)];
    return t(key);
  }

  function apply(root) {
    (root || document).querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = t(el.dataset.i18n);
    });
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    const lt = document.getElementById('help-title');
    if (lt) lt.textContent = t('helpTitle');
    const hb = document.getElementById('help-body');
    if (hb) hb.innerHTML = DICT[lang].helpBody;
    const bl = document.getElementById('btn-lang');
    if (bl) bl.textContent = lang === 'en' ? 'EN' : '中文';
    const bm = document.getElementById('btn-mode-label');
    if (bm) bm.textContent = t('freePlay');
  }

  function setLang(l) {
    if (!DICT[l]) l = 'en';
    lang = l;
    ARG.store.set('arg.lang', l);
    apply();
  }

  function toggle() { setLang(lang === 'en' ? 'zh' : 'en'); }

  return { t, pick, apply, setLang, toggle, get lang() { return lang; } };
})();
