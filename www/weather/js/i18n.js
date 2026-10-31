/* ═══════════════════════════════════════════
   Weather Station — i18n
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.i18n = (function () {

  const DICT = {
    en: {
      title: 'Weather Station',
      menu: 'Menu',

      hudRound: 'Round',
      hudScore: 'Score',

      pressure: 'PRESSURE',
      trend: 'TREND',
      humidity: 'HUMIDITY',
      temp: 'TEMPERATURE',
      wind: 'WIND',
      rain: 'RAIN',
      river: 'RIVER LEVEL',
      sun: 'SUNSHINE',
      rising: 'rising',
      falling: 'falling',

      fFair: 'FAIR',
      fRain: 'RAIN',
      fStorm: 'STORM',
      forecastLabel: 'FORECAST',
      submit: 'MAKE THE FORECAST',
      next: 'NEXT ROUND',
      again: 'TRY AGAIN',
      round: 'ROUND',
      of: 'of',

      tRead: 'Read every instrument before you choose. Pressure, humidity and wind together tell the story — the sky does not.',
      tPressure: 'Falling pressure means air is rising. Rising air cools, water vapour condenses and clouds grow. High, rising pressure usually means fair weather.',
      tHumidity: 'High humidity means the air is close to saturation. When it reaches 100 %, the vapour condenses into cloud and rain.',
      tWind: 'Strengthening wind and a falling barometer often mean a weather front is arriving. The wind vane shows direction; the anemometer shows speed.',
      tRiver: 'A river gauge measures the water level. The river keeps rising after heavy rain, because water takes time to drain off the land.',
      tSun: 'A sunshine recorder measures how long the sun has been out. Strong sun and high pressure usually go together.',

      right: 'Right!',
      wrong: 'Not quite.',
      r1why: 'High, rising pressure, dry air and a light wind: a fair day.',
      r2why: 'The pressure is falling, humidity is high and the wind is strengthening: rain is on the way.',
      r3why: 'A deep low, very high humidity, strong wind and 22 mm of rain: a storm.',

      weatherPerfect: 'Three out of three. You read the instruments like a forecaster.',
      weatherGood: 'Two out of three. You caught the pattern — check the pressure and the trend first.',
      weatherTry: 'One or none right this time. Remember: falling pressure + rising humidity + stronger wind = rain.',

      lead: 'Weather station',
      statusRead: 'Reading',
      statusReveal: 'Weather arriving',
      statusDone: 'Forecast complete',

      lAnemometer: 'anemometer',
      lVane: 'wind vane',
      lRainGauge: 'rain gauge',
      lThermometer: 'thermo',
      lHygrometer: 'hygro',
      lBarometer: 'baro',
      lSunshine: 'sunshine recorder',
      lRiverGauge: 'river gauge',
      lStation: 'station',

      helpTitle: 'How to predict the weather',
      helpBody: `
        <h3>Read the instruments</h3>
        <ul>
          <li><b>Barometer — pressure.</b> High and rising usually means fair weather. Low and falling means rising air, cloud and rain.</li>
          <li><b>Hygrometer — humidity.</b> The closer to 100 %, the more likely cloud and rain.</li>
          <li><b>Anemometer and wind vane — wind.</b> Strengthening wind often arrives with a front.</li>
          <li><b>Rain gauge — rainfall.</b> Millimetres: 1 mm is one litre of rain on every square metre.</li>
          <li><b>Thermometer — temperature.</b> Warm air can hold more water vapour than cold air.</li>
          <li><b>Sunshine recorder — hours of sun.</b> A bright, high-pressure day has more sunshine.</li>
          <li><b>River gauge — water level.</b> It rises after rain, often lagging behind it.</li>
        </ul>
        <h3>The short version</h3>
        <ul>
          <li><b>Fair:</b> high/rising pressure, low humidity, light wind, no rain.</li>
          <li><b>Rain:</b> falling pressure, humidity rising, wind picking up, some rain.</li>
          <li><b>Storm:</b> deep low, very high humidity, strong wind, heavy rain, river rising.</li>
        </ul>
      `
    },

    zh: {
      title: '气象站',
      menu: '菜单',

      hudRound: '轮次',
      hudScore: '得分',

      pressure: '气压',
      trend: '趋势',
      humidity: '湿度',
      temp: '气温',
      wind: '风',
      rain: '降雨',
      river: '河水水位',
      sun: '日照',
      rising: '上升',
      falling: '下降',

      fFair: '晴天',
      fRain: '下雨',
      fStorm: '暴风雨',
      forecastLabel: '预报',
      submit: '做出预报',
      next: '下一轮',
      again: '再试一次',
      round: '第',
      of: '轮，共',

      tRead: '先读完所有仪器再选。气压、湿度和风一起说明问题 — 光看天空是不准的。',
      tPressure: '气压下降，说明空气在上升。上升的空气变冷，水汽凝结，云就长起来。气压高而且在上升，通常是好天气。',
      tHumidity: '湿度高，说明空气快要饱和了。到 100% 时，水汽就凝结成云和雨。',
      tWind: '风变大、气压下降，往往说明天气锋面要来了。风向标看方向，风速仪看速度。',
      tRiver: '水位计测量河水高度。大雨之后河水还会继续上涨，因为地面的水需要时间才流进河里。',
      tSun: '日照计记录太阳出来了多久。阳光强和高气压通常一起出现。',

      right: '答对了！',
      wrong: '差一点。',
      r1why: '气压高而且在上升，空气干燥，风又小：好天气。',
      r2why: '气压下降、湿度很高、风在增强：雨要来了。',
      r3why: '气压很低、湿度非常高、风很大，还下了 22 毫米雨：暴风雨。',

      weatherPerfect: '三轮全对。你像真正的预报员一样读懂了仪器。',
      weatherGood: '三轮对了两轮。你已经看出规律 — 先看气压和趋势。',
      weatherTry: '这次对得不多。记住：气压下降 + 湿度上升 + 风变大 = 要下雨。',

      lead: '气象站',
      statusRead: '正在读数',
      statusReveal: '天气来了',
      statusDone: '预报完成',

      lAnemometer: '风速仪',
      lVane: '风向标',
      lRainGauge: '雨量筒',
      lThermometer: '温度计',
      lHygrometer: '湿度计',
      lBarometer: '气压计',
      lSunshine: '日照计',
      lRiverGauge: '水位计',
      lStation: '气象站',

      helpTitle: '怎样预测天气',
      helpBody: `
        <h3>读仪器</h3>
        <ul>
          <li><b>气压计。</b>气压高而且在上升，通常是好天气；气压低而且在下降，说明空气上升，容易有云和雨。</li>
          <li><b>湿度计。</b>越接近 100%，越容易起云和下雨。</li>
          <li><b>风速仪和风向标。</b>风突然变大，常常是天气锋面到了。</li>
          <li><b>雨量筒。</b>毫米：1 毫米等于每平方米一升雨。</li>
          <li><b>温度计。</b>暖空气能装的水汽比冷空气多。</li>
          <li><b>日照计。</b>高气压的晴天，日照时间更长。</li>
          <li><b>水位计。</b>雨停后河水往往还会继续上涨。</li>
        </ul>
        <h3>简单记法</h3>
        <ul>
          <li><b>晴天：</b>气压高/上升，湿度低，风小，没有雨。</li>
          <li><b>下雨：</b>气压下降，湿度上升，风变大，开始有雨。</li>
          <li><b>暴风雨：</b>气压很低，湿度非常高，风大，雨大，河水上涨。</li>
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
