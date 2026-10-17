/* ═══════════════════════════════════════════
   Train Driving — i18n
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.i18n = (function () {

  const DICT = {
    en: {
      title: 'Train Driving',
      menu: 'Menu',
      speedUnit: 'km/h',

      gaugeSpeed: 'SPEED',
      throttle: 'THROTTLE',
      brake: 'BRAKE',
      notches: ['OFF', '25%', '50%', '75%', '100%'],
      brakeNotches: ['RELEASE', 'STEP 1', 'STEP 2', 'STEP 3', 'FULL', 'EMERGENCY'],

      bHorn: 'HORN',
      bBell: 'BELL',
      bLights: 'LIGHTS',
      bDoors: 'DOORS',
      lightsName: ['OFF', 'DIM', 'BRIGHT'],
      doorsOpen: 'OPEN',
      doorsShut: 'SHUT',

      nextStop: 'Next stop',
      atStation: 'At the platform',
      noStop: 'No station ahead',
      metres: 'm',
      score: 'Score',
      served: 'Stops',
      distance: 'Distance',

      /* ── missions ── */
      mission: 'Mission',
      freeDrive: 'Free drive',
      mMorning: 'Morning service',
      mRush: 'The rush',
      mNight: 'Night run',
      goalStops: 'Stations',
      timeLeft: 'Time',
      trWin: 'Everyone is here!',
      trLose: 'Not everyone made it',
      trStar1: 'You delivered everyone in time',
      trStar2: 'You never ran past a platform',
      trStar3: 'And every crossing was taken under the limit',
      trMiss2: 'You ran past a platform',
      trMiss3: 'You took a crossing too fast',
      failLate: 'The clock ran out.',
      failOverrun: 'You ran past a platform.',
      failRough: 'You took a level crossing too fast.',
      tryAgain: 'TRY AGAIN',
      nextMission: 'NEXT MISSION',
      bestStars: 'Best',
      crossing: 'Crossing',
      crossingActive: 'CROSSING ACTIVE',
      ding: 'DING',

      msgPerfect: 'Perfect stop! Right on the mark.',
      msgGood: 'Good stop.',
      msgLong: 'A bit far from the mark — try stopping closer.',
      msgOvershoot: 'You went past the platform!',
      msgDoorsOpen: 'Doors are open — close them before you move.',
      msgDoorsShut: 'Doors closed. Ready to go.',
      msgDoorsNeedStop: 'Stop at the platform to open the doors.',
      msgGoodCrossing: '✔ Nice — eased off over the crossing.',
      msgRoughCrossing: '✘ Too fast over the crossing! Slow to 80 km/h.',
      msgHorn: 'Two-tone horn!',
      msgBell: 'Bell ringing.',
      msgLightsOn: 'Headlights on.',
      msgLightsOff: 'Headlights off.',
      msgEmergency: 'EMERGENCY BRAKE!',
      msgOverspeed: 'Mind the speed through the station.',

      helpTitle: 'How to drive the train',
      helpBody: `
        <h3>Your desk</h3>
        <ul>
          <li><code>THROTTLE ▲▼</code> — notch up or down: OFF, 25, 50, 75, 100%. A real train pulls away slowly: heavy, with lots of momentum.</li>
          <li><code>BRAKE ▲▼</code> — RELEASE, step 1–3, FULL, EMERGENCY. Brakes act on the whole train and take a long distance to stop you. Plan ahead.</li>
          <li><code>HORN</code> — the two-tone horn. Use it before a crossing.</li>
          <li><code>BELL</code> — rings the bell.</li>
          <li><code>LIGHTS</code> — headlights off, dim, bright.</li>
          <li><code>DOORS</code> — only open at a platform, and the train will not move until they are shut again.</li>
        </ul>
        <h3>Your job</h3>
        <ul>
          <li>Stop with the front of the train on the <b>white mark</b> at each station. The closer, the more points.</li>
          <li><b>Slow to 80 km/h over a level crossing.</b> Blasting through costs you 60 points; easing off earns 40.</li>
          <li>An automatic bell rings at every crossing — listen for <code>ding, ding, ding</code>.</li>
          <li>Watch the red lights and the barrier come down at the crossing.</li>
          <li>The track under the sign shows how far you are between the two stations.</li>
        </ul>
      `
    },

    zh: {
      title: '开火车',
      menu: '菜单',
      speedUnit: '公里/时',

      gaugeSpeed: '速度',
      throttle: '油门',
      brake: '刹车',
      notches: ['关闭', '25%', '50%', '75%', '100%'],
      brakeNotches: ['缓解', '1 级', '2 级', '3 级', '全力', '紧急'],

      bHorn: '鸣笛',
      bBell: '摇铃',
      bLights: '车灯',
      bDoors: '车门',
      lightsName: ['关闭', '弱光', '强光'],
      doorsOpen: '打开',
      doorsShut: '关闭',

      nextStop: '下一站',
      atStation: '已到站台',
      noStop: '前方没有车站',
      metres: '米',
      score: '得分',
      served: '停靠',
      distance: '里程',

      /* ── 任务 ── */
      mission: '任务',
      freeDrive: '自由驾驶',
      mMorning: '早班车',
      mRush: '赶高峰',
      mNight: '夜班车',
      goalStops: '车站',
      timeLeft: '时间',
      trWin: '乘客都送到了！',
      trLose: '没能全部送到',
      trStar1: '你按时把大家都送到了',
      trStar2: '一次都没冲过站台',
      trStar3: '而且每个道口都没超速',
      trMiss2: '你冲过了站台',
      trMiss3: '有道口超速了',
      failLate: '时间到了。',
      failOverrun: '你冲过了站台。',
      failRough: '过道口的时候超速了。',
      tryAgain: '再试一次',
      nextMission: '下一个任务',
      bestStars: '最好成绩',
      crossing: '道口',
      crossingActive: '道口报警',
      ding: '叮',

      msgPerfect: '完美停车！正好对准标线。',
      msgGood: '停得不错。',
      msgLong: '离标线有点远，试着停近一点。',
      msgOvershoot: '你冲过站台了！',
      msgDoorsOpen: '车门还开着 — 先关门再开车。',
      msgDoorsShut: '车门已关，可以出发了。',
      msgDoorsNeedStop: '停到站台才能开门。',
      msgGoodCrossing: '✔ 很好 — 过道口前减速了。',
      msgRoughCrossing: '✘ 过道口太快了！减速到 80 公里/时。',
      msgHorn: '双音风笛！',
      msgBell: '铃响了。',
      msgLightsOn: '车灯已打开。',
      msgLightsOff: '车灯已关闭。',
      msgEmergency: '紧急制动！',
      msgOverspeed: '进站注意限速。',

      helpTitle: '怎么开火车',
      helpBody: `
        <h3>驾驶台</h3>
        <ul>
          <li><code>油门 ▲▼</code> — 逐级加减：关闭、25、50、75、100%。真火车起步很慢，又重又有惯性。</li>
          <li><code>刹车 ▲▼</code> — 缓解、1–3 级、全力、紧急。刹车作用于整列车，需要很长距离才能停下，要提前预判。</li>
          <li><code>鸣笛</code> — 双音风笛，过道口前拉一下。</li>
          <li><code>摇铃</code> — 响铃。</li>
          <li><code>车灯</code> — 关闭、弱光、强光。</li>
          <li><code>车门</code> — 只能在站台开门，门没关好火车不会动。</li>
        </ul>
        <h3>你的任务</h3>
        <ul>
          <li>让车头停在每个车站的<b>白色标线</b>上，越准分越高。</li>
          <li><b>过道口要减速到 80 公里/时。</b>冲过去扣 60 分，减速通过加 40 分。</li>
          <li>每个铁路道口都会自动响铃 — 注意听 <code>叮、叮、叮</code>。</li>
          <li>看道口的红灯闪烁和栏杆落下。</li>
          <li>站牌下面的那条小轨道，显示你在两站之间走到哪儿了。</li>
        </ul>
      `
    }
  };

  const STATIONS = {
    en: ['Maple Halt', 'Riverside', 'Oakfield', 'Hillcrest', 'Stonebridge'],
    zh: ['枫树站', '河畔站', '橡树站', '山巅站', '石桥站']
  };

  let lang = ARG.store.get('arg.lang');
  if (!lang || !DICT[lang]) lang = 'zh';   // Chinese unless you switch it
  if (ARG.config && ARG.config.lockLang) lang = ARG.config.lockLang;

  function t(key) {
    const v = DICT[lang][key];
    if (v !== undefined) return v;
    return DICT.en[key] !== undefined ? DICT.en[key] : key;
  }

  function station(n) {
    const list = STATIONS[lang] || STATIONS.en;
    return list[n % list.length];
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
    t, station, apply, setLang,
    toggle: () => setLang(lang === 'en' ? 'zh' : 'en'),
    get lang() { return lang; }
  };
})();
