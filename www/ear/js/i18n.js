/* ear/js/i18n.js */
window.ARG = window.ARG || {};

ARG.i18n = (function () {
  const DICT = {
    en: {
      title: 'How the Ear Hears',
      menu: 'Menu',
      hudStep: 'Step',
      lead: 'The human ear',
      status: 'Following the sound',
      back: 'BACK', next: 'NEXT', again: 'START AGAIN',
      readAgain: 'Read again',
      note: 'Tap a key word to hear what it means.',
      result: 'You followed the sound all the way to the brain.',

      s1t: 'Sound is vibration',
      s1f: 'A sound starts with something vibrating — a string, a drum, a voice. The vibration pushes the air into pressure waves, and those waves travel to your ear.',
      s2t: 'The outer ear',
      s2f: 'The pinna — the part you can see — funnels sound into the ear canal. The canal is about 2.5 cm long and leads to the eardrum.',
      s3t: 'The eardrum',
      s3f: 'The eardrum is a thin membrane stretched across the end of the canal. Sound waves make it vibrate, just like a drum.',
      s4t: 'Three tiny bones',
      s4f: 'The malleus, incus and stapes are the three smallest bones in the body. They pass the vibration on and amplify it before it reaches the inner ear.',
      s5t: 'The cochlea',
      s5f: 'The cochlea is a snail-shaped tube filled with fluid. Thousands of tiny hair cells turn the vibration into electrical signals; high and low pitches move different hairs.',
      s6t: 'The brain — and protection',
      s6f: 'The auditory nerve carries the signals to the brain, which recognises the sound. Protect the hair cells: loud sound damages them permanently, so keep the volume down and use earplugs.',

      wSound: 'sound', wSoundD: 'A vibration travelling through air, water or a solid.',
      wPitch: 'pitch', wPitchD: 'How high or low a sound is. Faster vibration means a higher pitch.',
      wPinna: 'pinna', wPinnaD: 'The visible flap of the outer ear. It collects and funnels sound.',
      wCanal: 'ear canal', wCanalD: 'The short tunnel from the pinna to the eardrum.',
      wEardrum: 'eardrum', wEardrumD: 'A thin membrane that vibrates when sound reaches it.',
      wVibrate: 'vibrate', wVibrateD: 'To move quickly back and forth.',
      wOssicles: 'ossicles', wOssiclesD: 'The three tiny bones of the middle ear: malleus, incus and stapes.',
      wAmplify: 'amplify', wAmplifyD: 'To make a vibration stronger.',
      wCochlea: 'cochlea', wCochleaD: 'The snail-shaped organ that turns vibration into nerve signals.',
      wHair: 'hair cells', wHairD: 'Tiny cells in the cochlea that sense different pitches. Loud sound can damage them for good.',
      wNerve: 'auditory nerve', wNerveD: 'The nerve that carries hearing signals to the brain.',
      wDecibel: 'decibel (dB)', wDecibelD: 'The unit for loudness. Above about 85 dB can damage hearing over time.',

      helpTitle: 'How hearing works',
      helpSub: 'From a sound wave to a signal in the brain',
      helpBody: `
        <h3>The journey</h3>
        <ul>
          <li><code>1 Sound</code> — something vibrates and pushes the air.</li>
          <li><code>2 Pinna + canal</code> — the outer ear collects and funnels it.</li>
          <li><code>3 Eardrum</code> — the membrane vibrates.</li>
          <li><code>4 Ossicles</code> — three tiny bones amplify the movement.</li>
          <li><code>5 Cochlea</code> — hair cells turn it into electrical signals.</li>
          <li><code>6 Brain</code> — the auditory nerve carries the signal; the brain hears it.</li>
        </ul>
        <h3>Protect your ears</h3>
        <p>Hair cells do not grow back. Keep headphones at about 60% for no more than 60 minutes, move away from very loud speakers, and wear earplugs at concerts or when using noisy tools. If a sound hurts or makes your ears ring, it is too loud.</p>`
    },
    zh: {
      title: '耳朵怎样听见',
      menu: '菜单',
      hudStep: '步骤',
      lead: '人的耳朵',
      status: '跟着声音走',
      back: '上一步', next: '下一步', again: '重新开始',
      readAgain: '再读一次',
      note: '点一下关键词，听听它是什么意思。',
      result: '你跟着声音一直走到了大脑。',

      s1t: '声音是振动',
      s1f: '声音从振动开始——琴弦、鼓面或声带。振动推动空气形成压力波，这些波传到耳朵。',
      s2t: '外耳',
      s2f: '耳廓（你能看到的部分）把声音收进耳道。耳道大约 2.5 厘米长，通向鼓膜。',
      s3t: '鼓膜',
      s3f: '鼓膜是一层薄膜，横在耳道尽头。声波让它振动，就像敲鼓一样。',
      s4t: '三块小骨头',
      s4f: '锤骨、砧骨和镫骨是人体最小的三块骨头。它们把振动传下去，并在到达内耳前把它放大。',
      s5t: '耳蜗',
      s5f: '耳蜗是蜗牛形的管子，里面充满液体。成千上万的毛细胞把振动变成电信号；高音和低音会让不同位置的毛细胞动起来。',
      s6t: '大脑——和保护',
      s6f: '听觉神经把信号送到大脑，大脑识别出声音。要保护毛细胞：巨大的声音会造成永久损伤，所以音量别太大，吵的地方戴耳塞。',

      wSound: '声音', wSoundD: '在空气、水或固体中传播的振动。',
      wPitch: '音高', wPitchD: '声音的高低。振动越快，音高越高。',
      wPinna: '耳廓', wPinnaD: '外耳可见的软骨片，负责收集和引导声音。',
      wCanal: '耳道', wCanalD: '从耳廓通向鼓膜的小通道。',
      wEardrum: '鼓膜', wEardrumD: '一层薄膜，声音到达时会振动。',
      wVibrate: '振动', wVibrateD: '快速地来回运动。',
      wOssicles: '听小骨', wOssiclesD: '中耳的三块小骨头：锤骨、砧骨和镫骨。',
      wAmplify: '放大', wAmplifyD: '让振动变得更强。',
      wCochlea: '耳蜗', wCochleaD: '蜗牛形的器官，把振动变成神经信号。',
      wHair: '毛细胞', wHairD: '耳蜗里感受不同音高的微小细胞。巨大的声音会造成永久损伤。',
      wNerve: '听觉神经', wNerveD: '把听觉信号送到大脑的神经。',
      wDecibel: '分贝（dB）', wDecibelD: '表示响度的单位。大约超过 85 分贝，时间久了会损伤听力。',

      helpTitle: '听觉怎样工作',
      helpSub: '从声波到大脑里的信号',
      helpBody: `
        <h3>声音的旅程</h3>
        <ul>
          <li><code>1 声音</code>——物体振动，推动空气。</li>
          <li><code>2 耳廓 + 耳道</code>——外耳收集并引导声音。</li>
          <li><code>3 鼓膜</code>——薄膜开始振动。</li>
          <li><code>4 听小骨</code>——三块小骨头把振动放大。</li>
          <li><code>5 耳蜗</code>——毛细胞把振动变成电信号。</li>
          <li><code>6 大脑</code>——听觉神经把信号送到大脑，大脑听见声音。</li>
        </ul>
        <h3>保护耳朵</h3>
        <p>毛细胞不会再长回来。耳机音量大约不超过 60%，连续不超过 60 分钟；远离很响的喇叭；去演唱会或使用吵闹工具时戴耳塞。如果声音让你觉得疼或耳朵嗡嗡响，那就太大声了。</p>`
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
