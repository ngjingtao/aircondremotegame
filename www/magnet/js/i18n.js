/* ═══════════════════════════════════════════
   Magnets — i18n
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.i18n = (function () {

  const DICT = {
    en: {
      title: 'Magnets',
      menu: 'Menu',
      hudStep: 'Step',
      lead: 'Magnets',
      status: 'Feeling the pull',

      s1t: 'What magnets attract',
      s2t: 'Two poles',
      s3t: 'Attract and repel',
      s4t: 'The invisible field',
      s5t: 'Magnetising',
      s6t: 'Compass and Earth',

      s1f: 'A magnet pulls on iron, steel and nickel. It cannot pull plastic, wood, glass or paper.',
      s2f: 'The two ends of a magnet are its poles — one north (N) and one south (S). The pull is strongest at the ends.',
      s3f: 'Like poles repel: N pushes N away. Opposite poles attract: N and S pull together.',
      s4f: 'A magnet is surrounded by an invisible magnetic field. Sprinkle iron filings near it and they line up to show the field.',
      s5f: 'Stroke a nail with a magnet and the nail becomes a temporary magnet. Now it can pick up paperclips.',
      s6f: 'A compass needle is a tiny magnet. It points north because the Earth itself behaves like a huge magnet.',

      wMagnet: 'magnet',
      wMagnetD: 'An object that pulls on iron and nickel, and has a magnetic field around it.',
      wIron: 'iron',
      wIronD: 'A metal that a magnet can pull.',
      wPole: 'pole',
      wPoleD: 'One of the two ends of a magnet, where the pull is strongest.',
      wNorth: 'north pole (N)',
      wNorthD: 'The end of a magnet that points towards the Earth\u2019s north.',
      wAttract: 'attract',
      wAttractD: 'Two different poles pull towards each other.',
      wRepel: 'repel',
      wRepelD: 'Two of the same poles push each other away.',
      wField: 'magnetic field',
      wFieldD: 'The invisible area of force around a magnet.',
      wFilings: 'iron filings',
      wFilingsD: 'Tiny bits of iron that show the shape of a magnetic field.',
      wMagnetise: 'magnetise',
      wMagnetiseD: 'To make a piece of iron act like a magnet for a while.',
      wCompass: 'compass',
      wCompassD: 'A small magnet on a pivot that always turns to point north.',
      wEarth: 'Earth\u2019s magnetism',
      wEarthD: 'The Earth behaves like a giant magnet with a north and a south pole.',

      lMagnet: 'magnet',
      lNail: 'iron nail',
      lClip: 'paperclip',
      lEraser: 'eraser',
      lWood: 'wood',
      lRuler: 'plastic ruler',
      lField: 'magnetic field',
      lCompass: 'compass',
      lRepel: 'repel',
      lAttract: 'attract',

      note: 'Look at one step, read it, then tap NEXT. Tap any key word to hear what it means.',
      readAgain: 'Read again',
      back: 'BACK',
      next: 'NEXT',
      again: 'START AGAIN',
      result: 'You found the two poles, saw the field, and made a nail into a magnet.',

      helpTitle: 'Magnets',
      helpBody: `
        <h3>What a magnet does</h3>
        <ul>
          <li>It pulls <b>iron, steel and nickel</b>. It does not pull plastic, wood, glass or paper.</li>
          <li>Every magnet has a <b>north pole</b> and a <b>south pole</b>. The pull is strongest at the poles.</li>
          <li><b>Like poles repel</b> (N–N), <b>opposite poles attract</b> (N–S).</li>
        </ul>
        <h3>Two useful ideas</h3>
        <ul>
          <li>The <b>magnetic field</b> is invisible, but iron filings line up along it.</li>
          <li><b>Magnetising</b> — stroking iron with a magnet makes it a temporary magnet.</li>
          <li>A <b>compass</b> works because its needle is a tiny magnet and the Earth is a giant one.</li>
        </ul>
        <h3>Try it</h3>
        <ul>
          <li>Test things around you: which ones does a fridge magnet stick to?</li>
        </ul>
      `
    },

    zh: {
      title: '磁铁的秘密',
      menu: '菜单',
      hudStep: '步骤',
      lead: '磁铁的秘密',
      status: '感受磁力',

      s1t: '磁铁吸什么',
      s2t: '两个磁极',
      s3t: '相吸和相斥',
      s4t: '看不见的磁场',
      s5t: '磁化',
      s6t: '指南针和地球',

      s1f: '磁铁能吸铁、钢、镍这些金属。塑料、木头、玻璃和纸，它吸不住。',
      s2f: '磁铁的两头叫磁极，一头是北极（N），一头是南极（S）。磁力在两头最强。',
      s3f: '同极相斥，异极相吸：N 对 N 会推开，N 对 S 会吸在一起。',
      s4f: '磁铁周围有看不见的磁场。铁屑撒在磁铁旁边，会排成一条条线，那就是磁场的形状。',
      s5f: '把铁钉在磁铁上摩擦，铁钉会暂时变成小磁铁，能吸起回形针。',
      s6f: '指南针的针本身就是小磁铁，它总是指向北方，因为地球像一块巨大的磁铁。',

      wMagnet: '磁铁',
      wMagnetD: '能吸铁和镍的物体，周围有磁场。',
      wIron: '铁',
      wIronD: '一种能被磁铁吸引的金属。',
      wPole: '磁极',
      wPoleD: '磁铁的两头，磁力最强的地方。',
      wNorth: '北极（N）',
      wNorthD: '磁铁指向地球北方的那一端。',
      wAttract: '吸引',
      wAttractD: '两个不同的磁极靠近时，会拉在一起。',
      wRepel: '排斥',
      wRepelD: '两个相同的磁极靠近时，会互相推开。',
      wField: '磁场',
      wFieldD: '磁铁周围看不见的磁力范围。',
      wFilings: '铁屑',
      wFilingsD: '细小的铁粉，撒在磁铁旁能显示磁场的形状。',
      wMagnetise: '磁化',
      wMagnetiseD: '让原来没有磁性的铁，暂时变成磁铁。',
      wCompass: '指南针',
      wCompassD: '里面有一根小磁针，总会转过来指向北方。',
      wEarth: '地磁',
      wEarthD: '地球本身就像一块大磁铁，也有南北两个磁极。',

      lMagnet: '磁铁',
      lNail: '铁钉',
      lClip: '回形针',
      lEraser: '橡皮',
      lWood: '木块',
      lRuler: '塑料尺',
      lField: '磁场',
      lCompass: '指南针',
      lRepel: '排斥',
      lAttract: '吸引',

      note: '看一步，读一步。按“下一步”继续；点关键词，听听它是什么意思。',
      readAgain: '再读一次',
      back: '上一步',
      next: '下一步',
      again: '重新开始',
      result: '你找到了两个磁极，看见了磁场，还把铁钉变成了小磁铁。',

      helpTitle: '磁铁的秘密',
      helpBody: `
        <h3>磁铁会做什么</h3>
        <ul>
          <li>它能吸<b>铁、钢和镍</b>，吸不住塑料、木头、玻璃和纸。</li>
          <li>每块磁铁都有<b>北极</b>和<b>南极</b>，两头磁力最强。</li>
          <li><b>同极相斥</b>（N–N），<b>异极相吸</b>（N–S）。</li>
        </ul>
        <h3>两个有用的想法</h3>
        <ul>
          <li><b>磁场</b>看不见，但撒上铁屑就能看到它的形状。</li>
          <li><b>磁化</b>：用磁铁摩擦铁钉，铁钉会暂时变成磁铁。</li>
          <li><b>指南针</b>能指北，因为针是小磁铁，地球是大磁铁。</li>
        </ul>
        <h3>试一试</h3>
        <ul>
          <li>拿一块冰箱贴，去试试家里的东西：哪些能吸住？</li>
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
