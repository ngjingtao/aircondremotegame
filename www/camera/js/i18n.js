/* camera/js/i18n.js */
window.ARG = window.ARG || {};

ARG.i18n = (function () {
  const DICT = {
    en: {
      title: 'Photo Camera',
      menu: 'Menu',
      lead: 'Sony camera',
      hudShutter: 'Shutter', hudIso: 'ISO', hudAperture: 'Aperture',
      challenge: 'Challenge', shutter: 'Shutter speed', iso: 'ISO', aperture: 'Aperture',
      shoot: 'TAKE PHOTO', reset: 'RESET',
      sceneRunner: 'Freeze the runner', sceneWaterfall: 'Silky waterfall', scenePortrait: 'Blurry background',
      taskRunner: 'Freeze the runner', taskWaterfall: 'Silky water', taskPortrait: 'Blurry background',
      factShutter: 'Shutter speed is time. 1/1000 s freezes a runner; 1/30 s blurs moving water — and camera shake.',
      factIso: 'ISO is sensitivity. 100 is clean; 6400 is brighter but noisy. Raise it only when you cannot open the aperture or slow the shutter.',
      factAperture: 'Aperture is the hole. f/1.8 lets in lots of light and blurs the background; f/16 is sharp everywhere but needs more light.',
      shotPass: 'Great shot! Exposure and the effect both work.',
      shotUnder: 'Too dark — open the aperture, slow the shutter, or raise ISO.',
      shotOver: 'Too bright — close the aperture, speed up the shutter, or lower ISO.',
      shotSoft: 'Exposure is good, but the effect is not right yet.',
      tipRunner: 'Freeze the runner with 1/500 or faster.',
      tipWaterfall: 'Silky water needs a slow shutter, about 1/30.',
      tipPortrait: 'Blurry background needs a wide aperture, f/1.8–f/2.8.',
      toastDone: 'Camera badge earned — all three shots!',
      helpTitle: 'Taking the photo',
      helpSub: 'Shutter, ISO and aperture',
      helpBody: `
        <h3>The three controls</h3>
        <ul>
          <li><code>Shutter</code> — how long the sensor sees. Fast freezes; slow blurs.</li>
          <li><code>ISO</code> — how sensitive the sensor is. High is brighter but noisier.</li>
          <li><code>Aperture</code> — how big the hole is. Wide (f/1.8) lets in light and blurs the background; narrow (f/16) is sharp everywhere.</li>
        </ul>
        <h3>Exposure</h3>
        <p>For a correct exposure, the light has to balance: if you close the aperture, slow the shutter or raise ISO. The camera shows the estimate; use the challenges to practise.</p>
        <h3>Try</h3>
        <ul>
          <li>Runner: 1/500 or faster.</li>
          <li>Waterfall: about 1/30, f/11, ISO 100.</li>
          <li>Portrait: f/1.8, then balance with shutter and ISO.</li>
        </ul>`
    },
    zh: {
      title: '拍照',
      menu: '菜单',
      lead: '索尼相机',
      hudShutter: '快门', hudIso: 'ISO', hudAperture: '光圈',
      challenge: '挑战', shutter: '快门速度', iso: 'ISO', aperture: '光圈',
      shoot: '按下快门', reset: '重置',
      sceneRunner: '定格跑步的人', sceneWaterfall: '丝滑瀑布', scenePortrait: '背景虚化',
      taskRunner: '定格跑步', taskWaterfall: '丝滑水流', taskPortrait: '背景虚化',
      factShutter: '快门就是时间。1/1000 秒能定格跑步的人；1/30 秒会让流水和手抖都变模糊。',
      factIso: 'ISO 是感光度。100 最干净；6400 更亮但噪点多。只有在光圈和快门都不够时，才提高 ISO。',
      factAperture: '光圈是进光的洞。f/1.8 进光多、背景虚；f/16 远近都清楚，但需要更多光。',
      shotPass: '拍得好！曝光和效果都对了。',
      shotUnder: '太暗了——开大光圈、放慢快门，或者提高 ISO。',
      shotOver: '太亮了——缩小光圈、加快快门，或者降低 ISO。',
      shotSoft: '曝光对了，但效果还不对。',
      tipRunner: '定格跑步：用 1/500 或更快。',
      tipWaterfall: '丝滑流水：用慢快门，大约 1/30。',
      tipPortrait: '背景虚化：用大光圈，f/1.8–f/2.8。',
      toastDone: '相机徽章到手——三张挑战都拍好了！',
      helpTitle: '怎样拍一张照片',
      helpSub: '快门、ISO 和光圈',
      helpBody: `
        <h3>三个控制</h3>
        <ul>
          <li><code>快门</code>——传感器看多久。快快门定格，慢快门会糊。</li>
          <li><code>ISO</code>——传感器多敏感。高 ISO 更亮，但噪点多。</li>
          <li><code>光圈</code>——洞有多大。大光圈（f/1.8）进光多、背景虚；小光圈（f/16）远近都清楚。</li>
        </ul>
        <h3>曝光</h3>
        <p>曝光要平衡：缩小光圈，就要放慢快门或提高 ISO。相机给出估算，用挑战来练。</p>
        <h3>试一试</h3>
        <ul>
          <li>跑步：1/500 或更快。</li>
          <li>瀑布：大约 1/30，f/11，ISO 100。</li>
          <li>人像：f/1.8，再用快门和 ISO 平衡。</li>
        </ul>`
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
