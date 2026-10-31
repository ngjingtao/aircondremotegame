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

      instOpen: 'HOW EVERY INSTRUMENT WORKS',
      instIndexTitle: 'The instruments',
      instIndexHint: 'Tap an instrument for what it measures, how it works, and how to read it.',
      instBack: '‹ All instruments',
      instClose: 'OK',
      instRead: '🔊 Read aloud',

      instBarometerName: 'Barometer',
      instBarometerBody: `
        <h3>What it measures</h3>
        <p>Air pressure — the weight of the air above the station — in hectopascals (hPa). Standard sea-level pressure is about 1013 hPa.</p>
        <h3>How it works</h3>
        <p>An aneroid barometer has a sealed, partly evacuated metal capsule. Higher pressure squeezes it; lower pressure lets it expand. Levers magnify the movement and turn the needle. A mercury barometer balances the air against a column of mercury about 760 mm high.</p>
        <h3>How to read it</h3>
        <ul>
          <li>Above about 1013 hPa: sinking, drier air — often fair.</li>
          <li>Below about 1013 hPa: rising air — cloud and rain.</li>
          <li>The trend matters most. Falling pressure warns that a low or front is arriving.</li>
        </ul>
      `,

      instHygrometerName: 'Hygrometer',
      instHygrometerBody: `
        <h3>What it measures</h3>
        <p>Relative humidity — how full the air is with water vapour, as a percentage of the most it can hold at that temperature.</p>
        <h3>How it works</h3>
        <p>A hair hygrometer uses a bundle of human hair that lengthens as it absorbs water. Electronic sensors measure the capacitance of a polymer film. A wet-and-dry-bulb psychrometer compares two thermometers, one wrapped in a damp cloth.</p>
        <h3>How to read it</h3>
        <ul>
          <li>Below 40 %: dry air.</li>
          <li>Above 70 %: damp; cloud and rain become more likely.</li>
          <li>At 100 % the air is saturated and water condenses as dew, fog or cloud.</li>
        </ul>
      `,

      instThermometerName: 'Thermometer',
      instThermometerBody: `
        <h3>What it measures</h3>
        <p>Air temperature in degrees Celsius (°C).</p>
        <h3>How it works</h3>
        <p>In a liquid-in-glass thermometer, alcohol or mercury expands and rises up a thin capillary as it warms. Electronic thermometers use a thermistor: a resistor whose resistance changes predictably with temperature.</p>
        <h3>How to read it</h3>
        <ul>
          <li>Warm air can hold more water vapour than cold air.</li>
          <li>The dew point is the temperature at which the air becomes saturated.</li>
          <li>A sharp fall in temperature often follows a cold front or a storm.</li>
        </ul>
      `,

      instAnemometerName: 'Anemometer',
      instAnemometerBody: `
        <h3>What it measures</h3>
        <p>Wind speed, usually in kilometres per hour (km/h).</p>
        <h3>How it works</h3>
        <p>Three or four cups on a spindle catch the wind and spin. The faster the wind, the faster the cups turn. A magnet and reed switch, or an optical sensor, count the turns and convert them to speed.</p>
        <h3>How to read it</h3>
        <ul>
          <li>Under 1 km/h: calm.</li>
          <li>10–20 km/h: a light breeze.</li>
          <li>Over 40 km/h: strong wind; 60 km/h or more is a gale.</li>
          <li>Strengthening wind often means a front or a low is approaching.</li>
        </ul>
      `,

      instVaneName: 'Wind vane',
      instVaneBody: `
        <h3>What it measures</h3>
        <p>Wind direction — where the wind blows <b>from</b>, given as a compass point or in degrees.</p>
        <h3>How it works</h3>
        <p>A flat fin and a pointer pivot freely on a vertical shaft. The wind pushes the tail downwind, so the pointer faces into the wind. A magnet and encoder, or a set of switches, report the angle.</p>
        <h3>How to read it</h3>
        <ul>
          <li>“NW” means the wind comes from the north-west and blows towards the south-east.</li>
          <li>A shift from south-west to north-west often marks a cold front passing.</li>
          <li>Direction plus speed tells you which way the weather is moving.</li>
        </ul>
      `,

      instRainGaugeName: 'Rain gauge',
      instRainGaugeBody: `
        <h3>What it measures</h3>
        <p>Rainfall depth in millimetres (mm). 1 mm is one litre of rain on every square metre.</p>
        <h3>How it works</h3>
        <p>A funnel collects the rain into a measuring tube. In a tipping-bucket gauge, every 0.2 mm tips a small bucket and closes a switch; the logger counts the tips. The game's gauge fills from the bottom.</p>
        <h3>How to read it</h3>
        <ul>
          <li>0 mm: dry.</li>
          <li>2–10 mm: light to moderate rain.</li>
          <li>20 mm or more in a day: heavy rain and possible flooding.</li>
          <li>The river keeps rising after the rain, because water takes time to drain off the land.</li>
        </ul>
      `,

      instRiverGaugeName: 'River gauge',
      instRiverGaugeBody: `
        <h3>What it measures</h3>
        <p>The height of the river — its stage — in metres above a fixed datum.</p>
        <h3>How it works</h3>
        <p>A staff gauge is a marked board standing in the water. A float in a stilling well, or a pressure sensor bubbling air through a tube, records the level continuously and sends it to the station.</p>
        <h3>How to read it</h3>
        <ul>
          <li>Compare the level with the normal bank mark.</li>
          <li>A rise after heavy rain shows the catchment is still draining.</li>
          <li>Fast rises and high levels mean flood risk downstream.</li>
        </ul>
      `,

      instSunshineName: 'Sunshine recorder',
      instSunshineBody: `
        <h3>What it measures</h3>
        <p>Bright sunshine — the hours when direct sun is strong enough to cast a clear shadow (above about 120 W/m²).</p>
        <h3>How it works</h3>
        <p>A Campbell–Stokes recorder uses a glass sphere to focus sunlight and burn a trace on a card. Modern stations use a photodiode or a rotating mirror to detect direct sun.</p>
        <h3>How to read it</h3>
        <ul>
          <li>0 h: overcast.</li>
          <li>4–6 h: a mixed day.</li>
          <li>8 h or more: clear, settled weather — usually with high pressure.</li>
        </ul>
      `,

      helpTitle: 'How to predict the weather',
      helpBody: `
        <h3>Read the instruments</h3>
        <ul>
          <li><b>Tap any reading — or any instrument in the picture</b> — to see what it measures, how it works, and how to read it.</li>
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

      instOpen: '每个仪器怎么工作',
      instIndexTitle: '气象仪器',
      instIndexHint: '点一个仪器，看看它测什么、怎么工作、怎么读数。',
      instBack: '‹ 全部仪器',
      instClose: '好',
      instRead: '🔊 朗读',

      instBarometerName: '气压计',
      instBarometerBody: `
        <h3>测什么</h3>
        <p>气压 — 测站上方空气的重量，单位百帕（hPa）。海平面标准气压约 1013 百帕。</p>
        <h3>怎么工作</h3>
        <p>空盒气压计里有一个密封、抽掉部分空气的金属盒。气压升高时盒子被压扁，气压降低时盒子膨胀；杠杆把微小形变放大，带动指针。水银气压计则用约 760 毫米高的水银柱平衡空气压力。</p>
        <h3>怎么读</h3>
        <ul>
          <li>高于约 1013 百帕：空气下沉、比较干燥，多半是好天气。</li>
          <li>低于约 1013 百帕：空气上升，容易有云和雨。</li>
          <li>最重要的是趋势：气压下降，说明低压或锋面正在靠近。</li>
        </ul>
      `,

      instHygrometerName: '湿度计',
      instHygrometerBody: `
        <h3>测什么</h3>
        <p>相对湿度 — 空气里的水汽占该温度下最多能容纳水汽的百分比。</p>
        <h3>怎么工作</h3>
        <p>毛发湿度计用一束人的头发，吸湿后变长；电子湿度计测量聚合物薄膜的电容变化；干湿球湿度计比较两支温度计，其中一支包着湿布。</p>
        <h3>怎么读</h3>
        <ul>
          <li>低于 40%：空气干燥。</li>
          <li>高于 70%：潮湿，容易起云下雨。</li>
          <li>到 100% 时空气饱和，水汽会凝结成露、雾或云。</li>
        </ul>
      `,

      instThermometerName: '温度计',
      instThermometerBody: `
        <h3>测什么</h3>
        <p>气温，单位摄氏度（°C）。</p>
        <h3>怎么工作</h3>
        <p>玻璃液体温度计里，酒精或水银受热膨胀，沿细管上升。电子温度计用热敏电阻，电阻会随温度可预测地变化。</p>
        <h3>怎么读</h3>
        <ul>
          <li>暖空气能容纳的水汽比冷空气多。</li>
          <li>露点就是空气刚好饱和的温度。</li>
          <li>冷锋或暴风雨过后，气温常常明显下降。</li>
        </ul>
      `,

      instAnemometerName: '风速仪',
      instAnemometerBody: `
        <h3>测什么</h3>
        <p>风速，常用公里/小时（km/h）。</p>
        <h3>怎么工作</h3>
        <p>三四个风杯装在一根转轴上，风一吹就转。风越大，转得越快；磁铁和干簧管（或光电传感器）数转速，再换算成风速。</p>
        <h3>怎么读</h3>
        <ul>
          <li>低于 1 km/h：无风。</li>
          <li>10–20 km/h：微风。</li>
          <li>超过 40 km/h：强风；60 km/h 以上是大风。</li>
          <li>风突然变大，往往是锋面或低压在靠近。</li>
        </ul>
      `,

      instVaneName: '风向标',
      instVaneBody: `
        <h3>测什么</h3>
        <p>风向 — 风从哪个方向吹来，用方位或角度表示。</p>
        <h3>怎么工作</h3>
        <p>尾翼和指针可以绕竖轴自由转动。风把尾翼吹向下风方向，所以指针迎风。磁铁和编码器（或一组开关）读出角度。</p>
        <h3>怎么读</h3>
        <ul>
          <li>“西北”表示风从西北吹来，往东南吹。</li>
          <li>风向从西南转到西北，常常是冷锋经过。</li>
          <li>风向加上风速，就知道天气往哪里移动。</li>
        </ul>
      `,

      instRainGaugeName: '雨量筒',
      instRainGaugeBody: `
        <h3>测什么</h3>
        <p>降雨深度，单位毫米（mm）。1 毫米等于每平方米一升雨。</p>
        <h3>怎么工作</h3>
        <p>漏斗把雨收进量筒。翻斗式雨量计每接 0.2 毫米就翻一次斗，闭合一次开关，记录器数翻斗次数。游戏里的雨量筒从底部涨上来。</p>
        <h3>怎么读</h3>
        <ul>
          <li>0 毫米：没下雨。</li>
          <li>2–10 毫米：小到中雨。</li>
          <li>一天 20 毫米以上：大雨，可能积水。</li>
          <li>雨停后河水还会继续上涨，因为地面的水要时间才排进河里。</li>
        </ul>
      `,

      instRiverGaugeName: '水位计',
      instRiverGaugeBody: `
        <h3>测什么</h3>
        <p>河水高度（水位），以固定基准面以上的米数表示。</p>
        <h3>怎么工作</h3>
        <p>水尺是立在河里的带刻度标尺。静水井里的浮子，或往管里冒泡的压力传感器，会连续记录水位并传到气象站。</p>
        <h3>怎么读</h3>
        <ul>
          <li>和正常河岸标记比较。</li>
          <li>大雨后水位上涨，说明流域还在排水。</li>
          <li>水位涨得快、水位高，下游就有洪水风险。</li>
        </ul>
      `,

      instSunshineName: '日照计',
      instSunshineBody: `
        <h3>测什么</h3>
        <p>日照时数 — 太阳直射足够强、能投出清晰影子的时间（约 120 瓦/平方米以上）。</p>
        <h3>怎么工作</h3>
        <p>坎贝尔-斯托克斯日照计用玻璃球把阳光聚焦，在记录卡上烧出痕迹。现代气象站用光电二极管或旋转镜面来检测直射阳光。</p>
        <h3>怎么读</h3>
        <ul>
          <li>0 小时：阴天。</li>
          <li>4–6 小时：多云间晴。</li>
          <li>8 小时以上：晴朗稳定，通常气压较高。</li>
        </ul>
      `,

      helpTitle: '怎样预测天气',
      helpBody: `
        <h3>读仪器</h3>
        <ul>
          <li><b>点一下任意读数 — 或者图里的仪器</b> — 看看它测什么、怎么工作、怎么读数。</li>
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
