/* eye/js/i18n.js */
window.ARG = window.ARG || {};

ARG.i18n = (function () {
  const DICT = {
    en: {
      title: 'How the Eye Sees',
      menu: 'Menu',
      hudStep: 'Step',
      lead: 'The human eye',
      status: 'Following the light',
      back: 'BACK', next: 'NEXT', again: 'START AGAIN',
      readAgain: 'Read again',
      note: 'Tap a key word to hear what it means.',
      result: 'You followed the light all the way to the brain.',

      s1t: 'Light comes in',
      s1f: 'You see because light bounces off things and travels into your eye. Light is a wave; it carries colour and brightness.',
      s2t: 'The cornea',
      s2f: 'The cornea is the clear front window of the eye. It does most of the bending that focuses light, before the light even reaches the lens.',
      s3t: 'The pupil and iris',
      s3f: 'The iris is the coloured ring; its muscles change the size of the pupil, the hole in the middle. In bright light the pupil shrinks; in the dark it widens.',
      s4t: 'The lens',
      s4f: 'The lens fine-focuses light onto the retina. Ciliary muscles change its shape — flatter for far things, rounder for near things. This is called accommodation.',
      s5t: 'The retina',
      s5f: 'The retina lines the back of the eye. About 120 million rods see in dim light and about 6 million cones see colour. The image lands upside down.',
      s6t: 'The brain — and protection',
      s6f: 'The optic nerve carries the signals to the brain, which flips the image and recognises what you see. Protect your eyes: sunglasses for UV, the 20-20-20 screen break, and regular eye checks.',

      wLight: 'light', wLightD: 'The waves that let us see colour and brightness.',
      wRay: 'light ray', wRayD: 'A straight line that shows the direction light travels.',
      wCornea: 'cornea', wCorneaD: 'The clear curved front of the eye that bends light.',
      wRefract: 'refract', wRefractD: 'To bend light as it passes from one material into another.',
      wPupil: 'pupil', wPupilD: 'The black hole in the iris. It lets light into the eye.',
      wIris: 'iris', wIrisD: 'The coloured muscle ring that widens or narrows the pupil.',
      wLens: 'lens', wLensD: 'The flexible part that fine-focuses light on the retina.',
      wAccommodation: 'accommodation', wAccommodationD: 'The lens changing shape to focus near or far.',
      wRetina: 'retina', wRetinaD: 'The light-sensitive lining at the back of the eye.',
      wRodsCones: 'rods & cones', wRodsConesD: 'Rods see dim light; cones see colour and detail.',
      wOpticNerve: 'optic nerve', wOpticNerveD: 'The nerve that carries signals from the retina to the brain.',
      wProtect: 'eye protection', wProtectD: 'Sunglasses for UV, the 20-20-20 screen rule, and regular eye checks.',

      helpTitle: 'How seeing works',
      helpSub: 'From light to the picture in your brain',
      helpBody: `
        <h3>The journey</h3>
        <ul>
          <li><code>1 Light</code> — bounces off objects and enters the eye.</li>
          <li><code>2 Cornea</code> — the clear front bends the light.</li>
          <li><code>3 Pupil + iris</code> — the hole and the muscle that sets its size.</li>
          <li><code>4 Lens</code> — changes shape to fine-focus.</li>
          <li><code>5 Retina</code> — rods and cones turn light into signals.</li>
          <li><code>6 Optic nerve + brain</code> — the brain flips and interprets the picture.</li>
        </ul>
        <h3>Protect your eyes</h3>
        <p>Wear sunglasses in strong sun, follow 20-20-20 when using a screen (every 20 minutes, look 20 feet away for 20 seconds), keep sharp things away, and have regular eye checks. Never look directly at the sun or a laser.</p>`
    },
    zh: {
      title: '眼睛怎样看见',
      menu: '菜单',
      hudStep: '步骤',
      lead: '人的眼睛',
      status: '跟着光线走',
      back: '上一步', next: '下一步', again: '重新开始',
      readAgain: '再读一次',
      note: '点一下关键词，听听它是什么意思。',
      result: '你跟着光线一直走到了大脑。',

      s1t: '光进来了',
      s1f: '你能看见，是因为光从物体上反射，进入眼睛。光是一种波，带来颜色和亮度。',
      s2t: '角膜',
      s2f: '角膜是眼睛前面透明的窗口。它在光线到达晶状体之前，就完成了大部分的弯折和聚焦。',
      s3t: '瞳孔和虹膜',
      s3f: '虹膜是彩色的环，它的肌肉改变中间瞳孔的大小。光线强时瞳孔缩小，光线暗时瞳孔放大。',
      s4t: '晶状体',
      s4f: '晶状体把光精细地聚焦到视网膜上。睫状肌改变它的形状——看远变扁，看近变圆。这叫做调节。',
      s5t: '视网膜',
      s5f: '视网膜铺在眼球后壁。大约 1.2 亿个视杆细胞负责暗光，约 600 万个视锥细胞负责颜色。图像是倒着的。',
      s6t: '大脑——和保护',
      s6f: '视神经把信号送到大脑，大脑把图像翻转过来，认出你看到的东西。保护眼睛：强光戴太阳镜、看屏幕用 20-20-20 规则、定期检查视力。',

      wLight: '光', wLightD: '让我们看见颜色和亮度的波。',
      wRay: '光线', wRayD: '表示光传播方向的直线。',
      wCornea: '角膜', wCorneaD: '眼睛前面透明的弧形窗口，会弯折光线。',
      wRefract: '折射', wRefractD: '光从一种材料进入另一种材料时发生弯折。',
      wPupil: '瞳孔', wPupilD: '虹膜中间的黑孔，让光进入眼睛。',
      wIris: '虹膜', wIrisD: '彩色的肌肉环，控制瞳孔放大或缩小。',
      wLens: '晶状体', wLensD: '有弹性的结构，把光精细聚焦到视网膜上。',
      wAccommodation: '调节', wAccommodationD: '晶状体改变形状，看清近处或远处。',
      wRetina: '视网膜', wRetinaD: '眼球后壁对光敏感的内层。',
      wRodsCones: '视杆和视锥细胞', wRodsConesD: '视杆细胞看暗光，视锥细胞看颜色和细节。',
      wOpticNerve: '视神经', wOpticNerveD: '把视网膜的信号送到大脑的神经。',
      wProtect: '保护眼睛', wProtectD: '强光戴太阳镜、遵守 20-20-20 屏幕规则、定期检查视力。',

      helpTitle: '看见东西的过程',
      helpSub: '从光线到大脑里的画面',
      helpBody: `
        <h3>光的旅程</h3>
        <ul>
          <li><code>1 光</code>——从物体反射，进入眼睛。</li>
          <li><code>2 角膜</code>——透明的前窗把光弯折。</li>
          <li><code>3 瞳孔 + 虹膜</code>——中间的孔和控制大小的肌肉。</li>
          <li><code>4 晶状体</code>——改变形状来精细聚焦。</li>
          <li><code>5 视网膜</code>——视杆和视锥细胞把光变成信号。</li>
          <li><code>6 视神经 + 大脑</code>——大脑翻转并解释画面。</li>
        </ul>
        <h3>保护眼睛</h3>
        <p>太阳很强时戴太阳镜；看屏幕遵守 20-20-20（每 20 分钟看 20 英尺外 20 秒）；远离尖锐物品；定期检查视力。绝对不要直视太阳或激光。</p>`
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
