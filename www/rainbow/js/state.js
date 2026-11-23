/* rainbow/js/state.js — six steps of light and rainbows */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  const STEPS = [
    {
      scene: 'white', title: 's1t', fact: 's1f',
      words: [{ term: 'wWhite', def: 'wWhiteD' }, { term: 'wSpectrum', def: 'wSpectrumD' }]
    },
    {
      scene: 'refract', title: 's2t', fact: 's2f',
      words: [{ term: 'wRefraction', def: 'wRefractionD' }, { term: 'wBend', def: 'wBendD' }]
    },
    {
      scene: 'prism', title: 's3t', fact: 's3f',
      words: [{ term: 'wPrism', def: 'wPrismD' }, { term: 'wDispersion', def: 'wDispersionD' }]
    },
    {
      scene: 'drop', title: 's4t', fact: 's4f',
      words: [{ term: 'wDrop', def: 'wDropD' }, { term: 'wRainbow', def: 'wRainbowD' }]
    },
    {
      scene: 'colours', title: 's5t', fact: 's5f',
      words: [{ term: 'wWavelength', def: 'wWavelengthD' }, { term: 'wOrder', def: 'wOrderD' }]
    },
    {
      scene: 'make', title: 's6t', fact: 's6f',
      words: [{ term: 'wAngle', def: 'wAngleD' }, { term: 'wProtect', def: 'wProtectD' }]
    }
  ];

  const s = { step: 0, seenAll: false };

  function press(action, el) {
    if (ARG.lesson && ARG.lesson.press) return ARG.lesson.press(action, el);
    return false;
  }

  function tick() {}

  return { STEPS, s, press, tick };
})();
