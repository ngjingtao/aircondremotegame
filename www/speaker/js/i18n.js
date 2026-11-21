/* ═══════════════════════════════════════════
   Speaker — i18n
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.i18n = (function () {

  const DICT = {
    en: {
      title: 'Speaker',
      menu: 'Menu',
      hudStep: 'Step',
      lead: 'Speaker',
      status: 'Following the sound',

      s1t: 'What a speaker does',
      s2t: 'Magnet and coil',
      s3t: 'The signal moves it',
      s4t: 'The cone moves air',
      s5t: 'Frequency is pitch',
      s6t: 'Amplitude is volume',

      s1f: 'A speaker turns an electrical signal into sound. Phones, televisions and headphones all have one.',
      s2f: 'Inside a speaker there is a magnet and a coil of wire. When current flows through the coil, the coil becomes an electromagnet.',
      s3f: 'When the current changes direction, the push on the coil changes too, so the coil moves back and forth. The signal carries the sound.',
      s4f: 'The coil moves the diaphragm — the cone — back and forth. The cone pushes the air, and the vibrating air reaches your ear as sound.',
      s5f: 'The faster the vibration, the higher the pitch. The slower the vibration, the lower the pitch. We measure this as frequency, in hertz.',
      s6f: 'The bigger the vibration, the louder the sound. The smaller the vibration, the quieter it is. That size is called amplitude.',

      wSpeaker: 'speaker',
      wSpeakerD: 'A device that turns electrical signals into sound.',
      wSignal: 'signal',
      wSignalD: 'A changing electric current that carries the sound information.',
      wCoil: 'coil',
      wCoilD: 'Wire wound into a spiral. Current through it makes a magnetic field.',
      wMagnet: 'magnet',
      wMagnetD: 'It has a north and a south pole, and it pushes and pulls the coil.',
      wDiaphragm: 'diaphragm',
      wDiaphragmD: 'The cone or film inside a speaker that moves the air.',
      wVibrate: 'vibrate',
      wVibrateD: 'To move quickly back and forth.',
      wFrequency: 'frequency',
      wFrequencyD: 'How many vibrations happen each second. It sets the pitch.',
      wPitch: 'pitch',
      wPitchD: 'How high or low a sound is.',
      wAmplitude: 'amplitude',
      wAmplitudeD: 'How big the vibration is. It sets the volume.',
      wVolume: 'volume',
      wVolumeD: 'How loud or quiet a sound is.',

      lMagnet: 'magnet',
      lCoil: 'coil',
      lCone: 'cone',
      lSound: 'sound',
      lSignal: 'signal',
      lFrequency: 'frequency',
      lAmplitude: 'amplitude',

      note: 'Look at one step, read it, then tap NEXT. Tap any key word to hear what it means.',
      readAgain: 'Read again',
      back: 'BACK',
      next: 'NEXT',
      again: 'START AGAIN',
      result: 'You followed a signal from the coil to the cone and into the air.',

      helpTitle: 'How a speaker works',
      helpBody: `
        <h3>Electricity to movement</h3>
        <ul>
          <li>A coil sits in the gap of a magnet.</li>
          <li>Current through the coil makes it an <b>electromagnet</b>, so the magnet pushes or pulls it.</li>
          <li>When the current reverses, the push reverses — the coil moves back and forth.</li>
        </ul>
        <h3>Movement to sound</h3>
        <ul>
          <li>The coil is glued to the <b>cone</b> (the diaphragm).</li>
          <li>The cone pushes the air, making pressure waves that reach your ear.</li>
          <li><b>Frequency</b> (vibrations per second) sets pitch; <b>amplitude</b> sets volume.</li>
        </ul>
        <h3>Try it</h3>
        <ul>
          <li>Rest your fingers lightly on a playing speaker — you can feel the cone vibrating.</li>
          <li>Play a low note and a high note: the cone moves more slowly and more quickly.</li>
        </ul>
      `
    },

    zh: {
      title: '扬声器',
      menu: '菜单',
      hudStep: '步骤',
      lead: '扬声器',
      status: '跟着声音走',

      s1t: '扬声器做什么',
      s2t: '磁铁和线圈',
      s3t: '信号让它动起来',
      s4t: '振膜推动空气',
      s5t: '频率决定音高',
      s6t: '振幅决定音量',

      s1f: '扬声器把电信号变成声音。手机、电视和耳机里都有它。',
      s2f: '扬声器里有磁铁和线圈。电流通过线圈，线圈就变成电磁铁。',
      s3f: '电流的方向一变，线圈受到的力也改变方向，于是前后运动。信号就是这样带着声音的变化。',
      s4f: '线圈带动振膜（纸盆）前后振动，推动空气。空气的振动传到耳朵里，就是声音。',
      s5f: '振动越快，音高越高；振动越慢，音高越低。这个快慢叫频率，用赫兹（Hz）表示。',
      s6f: '振动幅度越大，声音越响；幅度越小，声音越轻。振动的大小叫振幅。',

      wSpeaker: '扬声器',
      wSpeakerD: '把电信号变成声音的装置。',
      wSignal: '信号',
      wSignalD: '带着声音信息的、不断变化的电流。',
      wCoil: '线圈',
      wCoilD: '绕成圈的导线，通电后会产生磁场。',
      wMagnet: '磁铁',
      wMagnetD: '有南北极，会推拉线圈。',
      wDiaphragm: '振膜',
      wDiaphragmD: '扬声器里前后运动、推动空气的膜或纸盆。',
      wVibrate: '振动',
      wVibrateD: '物体快速地来回运动。',
      wFrequency: '频率',
      wFrequencyD: '每秒振动的次数，决定音高。',
      wPitch: '音高',
      wPitchD: '声音是高还是低。',
      wAmplitude: '振幅',
      wAmplitudeD: '振动的大小，决定音量。',
      wVolume: '音量',
      wVolumeD: '声音是响还是轻。',

      lMagnet: '磁铁',
      lCoil: '线圈',
      lCone: '振膜',
      lSound: '声音',
      lSignal: '信号',
      lFrequency: '频率',
      lAmplitude: '振幅',

      note: '看一步，读一步。按“下一步”继续；点关键词，听听它是什么意思。',
      readAgain: '再读一次',
      back: '上一步',
      next: '下一步',
      again: '重新开始',
      result: '你跟着信号从线圈走到振膜，再走进空气里。',

      helpTitle: '扬声器怎样工作',
      helpBody: `
        <h3>从电到运动</h3>
        <ul>
          <li>线圈放在磁铁的缝隙里。</li>
          <li>电流通过线圈，线圈变成<b>电磁铁</b>，磁铁就会推它或拉它。</li>
          <li>电流方向反过来，推力也反过来，线圈就来回运动。</li>
        </ul>
        <h3>从运动到声音</h3>
        <ul>
          <li>线圈和<b>振膜</b>（纸盆）连在一起。</li>
          <li>振膜推动空气，形成压力波，传到耳朵里。</li>
          <li><b>频率</b>（每秒振动次数）决定音高；<b>振幅</b>决定音量。</li>
        </ul>
        <h3>试一试</h3>
        <ul>
          <li>轻轻把手指放在正在响的扬声器上，能感觉到振膜在振动。</li>
          <li>播放低音和高音，感受振膜动得慢和动得快。</li>
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
