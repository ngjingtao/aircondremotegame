/* rainbow/js/i18n.js */
window.ARG = window.ARG || {};

ARG.i18n = (function () {
  const DICT = {
    en: {
      title: 'Rainbow & Light',
      menu: 'Menu',
      hudStep: 'Step',
      lead: 'Rainbows and light',
      status: 'Following the light',
      back: 'BACK', next: 'NEXT', again: 'START AGAIN',
      readAgain: 'Read again',
      note: 'Tap a key word to hear what it means.',
      result: 'You followed white light all the way to a rainbow.',

      s1t: 'White light is a mixture',
      s1f: 'White sunlight looks plain, but it is a mixture of colours. Isaac Newton showed this by passing sunlight through a glass prism.',
      s2t: 'Refraction',
      s2f: 'When light passes from air into water or glass, it slows down and bends. This bending is called refraction.',
      s3t: 'The prism',
      s3f: 'Each colour bends by a slightly different amount. A prism spreads white light into a fan of colours called a spectrum.',
      s4t: 'Inside a raindrop',
      s4f: 'A raindrop is a tiny prism. Sunlight enters, bends, reflects once inside the back of the drop, and bends again as it leaves. The colours fan out towards you.',
      s5t: 'The colours',
      s5f: 'Red has the longest wavelength and bends least; violet is shortest and bends most. That is why red is on the outside of a rainbow and violet on the inside.',
      s6t: 'Make one safely',
      s6f: 'Stand with the sun behind you and spray water in front. A rainbow appears about 42° from the direction opposite the sun. Never look directly at the sun; wear sunglasses.',

      wWhite: 'white light', wWhiteD: 'Light that contains all the colours mixed together.',
      wSpectrum: 'spectrum', wSpectrumD: 'The band of colours that white light splits into.',
      wRefraction: 'refraction', wRefractionD: 'The bending of light when it enters a different material.',
      wBend: 'bend', wBendD: 'To change direction because the light slows down or speeds up.',
      wPrism: 'prism', wPrismD: 'A triangular piece of glass that spreads light into colours.',
      wDispersion: 'dispersion', wDispersionD: 'Different colours bending by different amounts, so they separate.',
      wDrop: 'raindrop', wDropD: 'A small drop of water that acts like a tiny prism and mirror.',
      wRainbow: 'rainbow', wRainbowD: 'The arc of colours made when sunlight passes through many raindrops.',
      wWavelength: 'wavelength', wWavelengthD: 'The distance between two crests of a light wave; it sets the colour.',
      wOrder: 'colour order', wOrderD: 'Red, orange, yellow, green, blue, indigo, violet — from outside to inside.',
      wAngle: '42°', wAngleD: 'The angle from the direction opposite the sun where the main rainbow appears.',
      wProtect: 'eye safety', wProtectD: 'Never look at the sun; sunglasses protect your eyes while you look for a rainbow.',

      helpTitle: 'How a rainbow is made',
      helpSub: 'Sunlight, raindrops and a little bending',
      helpBody: `
        <h3>The path</h3>
        <ul>
          <li><code>1 White light</code> — sunlight is a mixture of colours.</li>
          <li><code>2 Refraction</code> — entering water slows and bends the light.</li>
          <li><code>3 Prism</code> — each colour bends differently, so they separate.</li>
          <li><code>4 Raindrop</code> — refract, reflect inside, refract out.</li>
          <li><code>5 Colours</code> — red outside, violet inside; ROYGBIV.</li>
          <li><code>6 Make one</code> — sun behind you, water spray in front, about 42°.</li>
        </ul>
        <h3>Try it safely</h3>
        <p>On a sunny day, stand with the sun behind you and spray a fine mist in front. Look for the arc but never at the sun. A second, fainter rainbow can appear outside the first, with the colours reversed.</p>`
    },
    zh: {
      title: '彩虹与光',
      menu: '菜单',
      hudStep: '步骤',
      lead: '彩虹和光',
      status: '跟着光线走',
      back: '上一步', next: '下一步', again: '重新开始',
      readAgain: '再读一次',
      note: '点一下关键词，听听它是什么意思。',
      result: '你跟着白光一直走到了彩虹。',

      s1t: '白光是混合色',
      s1f: '白色阳光看起来很普通，其实是多种颜色混在一起。牛顿让阳光穿过玻璃棱镜，证明了这一点。',
      s2t: '折射',
      s2f: '光从空气进入水或玻璃时会变慢并弯折。这种弯折叫做折射。',
      s3t: '棱镜',
      s3f: '每种颜色弯折的程度略有不同。棱镜把白光展开成一条彩色光带，叫做光谱。',
      s4t: '雨滴里面',
      s4f: '雨滴就像一个小棱镜。阳光进入后弯折，在雨滴后壁反射一次，出来时再弯折。颜色就朝你散开。',
      s5t: '颜色',
      s5f: '红光波长最长，弯得最少；紫光波长最短，弯得最多。所以彩虹外圈是红色，内圈是紫色。',
      s6t: '安全地做一个',
      s6f: '背对太阳，在前面喷水，就能看到彩虹。主彩虹出现在背对太阳方向约 42° 的位置。绝对不要直视太阳；戴太阳镜。',

      wWhite: '白光', wWhiteD: '包含所有颜色混合在一起的光。',
      wSpectrum: '光谱', wSpectrumD: '白光分开后形成的一条彩色光带。',
      wRefraction: '折射', wRefractionD: '光进入不同材料时发生弯折。',
      wBend: '弯折', wBendD: '光因为变慢或变快而改变方向。',
      wPrism: '棱镜', wPrismD: '三角形的玻璃块，把光展开成颜色。',
      wDispersion: '色散', wDispersionD: '不同颜色弯折程度不同，于是分开。',
      wDrop: '雨滴', wDropD: '小水滴，像小棱镜和小镜子一样工作。',
      wRainbow: '彩虹', wRainbowD: '阳光穿过许多雨滴后形成的彩色圆弧。',
      wWavelength: '波长', wWavelengthD: '光波两个波峰之间的距离，决定颜色。',
      wOrder: '颜色顺序', wOrderD: '红、橙、黄、绿、蓝、靛、紫——从外到内。',
      wAngle: '42°', wAngleD: '主彩虹出现在背对太阳方向约 42° 的位置。',
      wProtect: '眼睛安全', wProtectD: '不要直视太阳；找彩虹时戴太阳镜保护眼睛。',

      helpTitle: '彩虹怎样形成',
      helpSub: '阳光、雨滴和一点点弯折',
      helpBody: `
        <h3>光的路径</h3>
        <ul>
          <li><code>1 白光</code>——阳光是多种颜色的混合。</li>
          <li><code>2 折射</code>——进入水里会变慢并弯折。</li>
          <li><code>3 棱镜</code>——每种颜色弯得不同，于是分开。</li>
          <li><code>4 雨滴</code>——折射、内部反射、再折射出来。</li>
          <li><code>5 颜色</code>——外红内紫；红橙黄绿蓝靛紫。</li>
          <li><code>6 做一个</code>——背对太阳，前面喷水，约 42°。</li>
        </ul>
        <h3>安全地试一试</h3>
        <p>晴天背对太阳，在前面喷出细雾，就能看到彩色圆弧。找彩虹时不要看太阳。主彩虹外面还可能有一道更淡的副虹，颜色顺序是反的。</p>`
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
