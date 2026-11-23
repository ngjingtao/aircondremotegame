/* ear/js/state.js — six steps of hearing */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  const STEPS = [
    {
      scene: 'sound', title: 's1t', fact: 's1f',
      words: [{ term: 'wSound', def: 'wSoundD' }, { term: 'wPitch', def: 'wPitchD' }]
    },
    {
      scene: 'pinna', title: 's2t', fact: 's2f',
      words: [{ term: 'wPinna', def: 'wPinnaD' }, { term: 'wCanal', def: 'wCanalD' }]
    },
    {
      scene: 'eardrum', title: 's3t', fact: 's3f',
      words: [{ term: 'wEardrum', def: 'wEardrumD' }, { term: 'wVibrate', def: 'wVibrateD' }]
    },
    {
      scene: 'ossicles', title: 's4t', fact: 's4f',
      words: [{ term: 'wOssicles', def: 'wOssiclesD' }, { term: 'wAmplify', def: 'wAmplifyD' }]
    },
    {
      scene: 'cochlea', title: 's5t', fact: 's5f',
      words: [{ term: 'wCochlea', def: 'wCochleaD' }, { term: 'wHair', def: 'wHairD' }]
    },
    {
      scene: 'brain', title: 's6t', fact: 's6f',
      words: [{ term: 'wNerve', def: 'wNerveD' }, { term: 'wDecibel', def: 'wDecibelD' }]
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
