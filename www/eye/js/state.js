/* eye/js/state.js — six steps of seeing */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  const STEPS = [
    {
      scene: 'light', title: 's1t', fact: 's1f',
      words: [{ term: 'wLight', def: 'wLightD' }, { term: 'wRay', def: 'wRayD' }]
    },
    {
      scene: 'cornea', title: 's2t', fact: 's2f',
      words: [{ term: 'wCornea', def: 'wCorneaD' }, { term: 'wRefract', def: 'wRefractD' }]
    },
    {
      scene: 'pupil', title: 's3t', fact: 's3f',
      words: [{ term: 'wPupil', def: 'wPupilD' }, { term: 'wIris', def: 'wIrisD' }]
    },
    {
      scene: 'lens', title: 's4t', fact: 's4f',
      words: [{ term: 'wLens', def: 'wLensD' }, { term: 'wAccommodation', def: 'wAccommodationD' }]
    },
    {
      scene: 'retina', title: 's5t', fact: 's5f',
      words: [{ term: 'wRetina', def: 'wRetinaD' }, { term: 'wRodsCones', def: 'wRodsConesD' }]
    },
    {
      scene: 'brain', title: 's6t', fact: 's6f',
      words: [{ term: 'wOpticNerve', def: 'wOpticNerveD' }, { term: 'wProtect', def: 'wProtectD' }]
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
