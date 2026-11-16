/* ═══════════════════════════════════════════
   Electrical Safety — the lesson data
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  const STEPS = [
    {
      scene: 'socket', title: 's1t', fact: 's1f',
      words: [{ term: 'wSocket', def: 'wSocketD' }, { term: 'wInsulation', def: 'wInsulationD' }]
    },
    {
      scene: 'water', title: 's2t', fact: 's2f',
      words: [{ term: 'wInsulation', def: 'wInsulationD' }, { term: 'wSocket', def: 'wSocketD' }]
    },
    {
      scene: 'overload', title: 's3t', fact: 's3f',
      words: [{ term: 'wOverload', def: 'wOverloadD' }]
    },
    {
      scene: 'cord', title: 's4t', fact: 's4f',
      words: [{ term: 'wInsulation', def: 'wInsulationD' }]
    },
    {
      scene: 'earth', title: 's5t', fact: 's5f',
      words: [{ term: 'wEarth', def: 'wEarthD' }, { term: 'wRcd', def: 'wRcdD' }]
    },
    {
      scene: 'storm', title: 's6t', fact: 's6f',
      words: [{ term: 'wShort', def: 'wShortD' }, { term: 'wStorm', def: 'wStormD' }]
    }
  ];

  const s = { step: 0, seenAll: false };

  function press(action, el) {
    if (ARG.lesson && ARG.lesson.press) return ARG.lesson.press(action, el);
    return false;
  }

  function tick() { /* a lesson has no clock */ }

  return { STEPS, s, press, tick };
})();
