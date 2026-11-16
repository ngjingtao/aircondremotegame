/* ═══════════════════════════════════════════
   Light — i18n
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.i18n = (function () {

  const DICT = {
    en: {
      title: 'Light & Shadow',
      menu: 'Menu',
      hudStep: 'Step',
      lead: 'Light & shadow',
      status: 'Following the light',

      s1t: 'Where light comes from',
      s2t: 'Light travels straight',
      s3t: 'The shadow appears',
      s4t: 'Shadows change',
      s5t: 'Reflection',
      s6t: 'Refraction',

      s1f: 'The Sun, a lamp and a firefly all make their own light — they are light sources. We see things when light enters our eyes.',
      s2f: 'Light travels in straight lines. It does not bend around corners, which is why you cannot see what is behind a wall.',
      s3f: 'When light hits something opaque, it cannot pass through, so a shadow forms behind it. A shadow is a place the light cannot reach.',
      s4f: 'The closer the light source, the bigger the shadow. Light from the left makes a shadow on the right — always on the opposite side.',
      s5f: 'Light bounces off a mirror. We can see things that do not glow because they reflect light into our eyes.',
      s6f: 'Light changes direction when it goes from air into water. That is why a straw in a glass looks broken.',

      wSource: 'light source',
      wSourceD: 'Something that makes its own light, such as the Sun or a lamp.',
      wEye: 'eye',
      wEyeD: 'Light enters the eye, and that is how we see.',
      wStraight: 'travels straight',
      wStraightD: 'Light moves in a straight line and does not bend by itself.',
      wBlock: 'block',
      wBlockD: 'An object in the way stops light from passing.',
      wShadow: 'shadow',
      wShadowD: 'The dark place behind an object where light cannot reach.',
      wOpaque: 'opaque',
      wOpaqueD: 'A material that light cannot pass through, such as wood or metal.',
      wDirection: 'direction',
      wDirectionD: 'A shadow always falls on the side opposite the light.',
      wSize: 'size',
      wSizeD: 'The closer the light, the larger the shadow.',
      wReflect: 'reflection',
      wReflectD: 'Light bounces back off a surface such as a mirror.',
      wMirror: 'mirror',
      wMirrorD: 'A very smooth surface that reflects light back.',
      wRefract: 'refraction',
      wRefractD: 'Light bends when it passes from one material into another.',
      wStraw: 'straw',
      wStrawD: 'A straw in water looks broken because of refraction.',

      lSource: 'light source',
      lLight: 'light',
      lShadow: 'shadow',
      lTree: 'tree',
      lMirror: 'mirror',
      lGlass: 'glass',
      lStraw: 'straw',
      lEye: 'eye',

      note: 'Look at one step, read it, then tap NEXT. Tap any key word to hear what it means.',
      readAgain: 'Read again',
      back: 'BACK',
      next: 'NEXT',
      again: 'START AGAIN',
      result: 'You followed the light, made a shadow, and saw it bounce and bend.',

      helpTitle: 'Light and shadow',
      helpBody: `
        <h3>The three ideas</h3>
        <ul>
          <li><b>Sources</b> — the Sun, lamps and fireflies make their own light. We see things when light enters our eyes.</li>
          <li><b>Straight lines</b> — light does not bend around corners.</li>
          <li><b>Shadows</b> — an opaque object blocks light and leaves a dark shape behind it.</li>
        </ul>
        <h3>Two more</h3>
        <ul>
          <li><b>Reflection</b> — light bounces off a mirror. We see most objects by reflected light.</li>
          <li><b>Refraction</b> — light bends when it moves from air into water or glass.</li>
        </ul>
        <h3>Try it</h3>
        <ul>
          <li>Use a torch and your hand: make the shadow bigger by moving the torch closer.</li>
          <li>Put a pencil in a glass of water and look from the side.</li>
        </ul>
      `
    },

    zh: {
      title: '光和影子',
      menu: '菜单',
      hudStep: '步骤',
      lead: '光和影子',
      status: '跟着光走',

      s1t: '光从哪里来',
      s2t: '光走直线',
      s3t: '影子出现了',
      s4t: '影子会变',
      s5t: '光的反射',
      s6t: '光的折射',

      s1f: '太阳、灯、萤火虫都会发光，它们叫光源。有光进入眼睛，我们才能看见东西。',
      s2f: '光沿直线传播，不会自己拐弯。所以墙后面有什么，我们看不到。',
      s3f: '光被不透明的物体挡住，过不去，就在后面留下影子。影子就是光照不到的地方。',
      s4f: '光源离物体越近，影子越大；光从左边照，影子就在右边。影子的方向总在光源的对面。',
      s5f: '光照到镜子会弹回来，这叫反射。我们能看见不发光的物体，是因为它把光反射进了眼睛。',
      s6f: '光从空气进入水里会改变方向，这叫折射。所以插在水里的吸管，看起来像断了一样。',

      wSource: '光源',
      wSourceD: '会自己发光的物体，比如太阳和灯。',
      wEye: '眼睛',
      wEyeD: '光进入眼睛，我们才能看见东西。',
      wStraight: '直线传播',
      wStraightD: '光沿着直线前进，不会自己拐弯。',
      wBlock: '挡住',
      wBlockD: '物体挡在路上，光就过不去。',
      wShadow: '影子',
      wShadowD: '光被挡住后，后面照不到的地方。',
      wOpaque: '不透明',
      wOpaqueD: '光穿不过去的物体，比如木头和铁。',
      wDirection: '方向',
      wDirectionD: '影子总在光源的对面。',
      wSize: '大小',
      wSizeD: '光源离得越近，影子就越大。',
      wReflect: '反射',
      wReflectD: '光碰到镜面会弹回来。',
      wMirror: '镜子',
      wMirrorD: '表面很光滑，能把光反射回去。',
      wRefract: '折射',
      wRefractD: '光从一种物质进入另一种物质时，方向会改变。',
      wStraw: '吸管',
      wStrawD: '插在水里的吸管看起来“折断”，就是折射造成的。',

      lSource: '光源',
      lLight: '光',
      lShadow: '影子',
      lTree: '树',
      lMirror: '镜子',
      lGlass: '水杯',
      lStraw: '吸管',
      lEye: '眼睛',

      note: '看一步，读一步。按“下一步”继续；点关键词，听听它是什么意思。',
      readAgain: '再读一次',
      back: '上一步',
      next: '下一步',
      again: '重新开始',
      result: '你跟着光走，做出了影子，还看见光会弹回来、会拐弯。',

      helpTitle: '光和影子',
      helpBody: `
        <h3>三个重要的想法</h3>
        <ul>
          <li><b>光源</b> — 太阳、灯、萤火虫会自己发光。光进入眼睛，我们才看得见。</li>
          <li><b>直线传播</b> — 光不会自己绕过墙角。</li>
          <li><b>影子</b> — 不透明的物体挡住光，后面就留下黑黑的影子。</li>
        </ul>
        <h3>还有两个</h3>
        <ul>
          <li><b>反射</b> — 光碰到镜子会弹回来。大多数东西，我们是靠反射的光看见的。</li>
          <li><b>折射</b> — 光从空气进入水或玻璃时，会改变方向。</li>
        </ul>
        <h3>试一试</h3>
        <ul>
          <li>用手电筒和手：把手电筒靠近手，影子就变大。</li>
          <li>把铅笔放进水杯里，从侧面看看。</li>
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
