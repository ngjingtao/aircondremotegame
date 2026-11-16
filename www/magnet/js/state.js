/* ═══════════════════════════════════════════
   Magnets — the lesson data
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  const STEPS = [
    {
      scene: 'attract', title: 's1t', fact: 's1f',
      words: [{ term: 'wMagnet', def: 'wMagnetD' }, { term: 'wIron', def: 'wIronD' }]
    },
    {
      scene: 'poles', title: 's2t', fact: 's2f',
      words: [{ term: 'wPole', def: 'wPoleD' }, { term: 'wNorth', def: 'wNorthD' }]
    },
    {
      scene: 'pairs', title: 's3t', fact: 's3f',
      words: [{ term: 'wAttract', def: 'wAttractD' }, { term: 'wRepel', def: 'wRepelD' }]
    },
    {
      scene: 'field', title: 's4t', fact: 's4f',
      words: [{ term: 'wField', def: 'wFieldD' }, { term: 'wFilings', def: 'wFilingsD' }]
    },
    {
      scene: 'chain', title: 's5t', fact: 's5f',
      words: [{ term: 'wMagnetise', def: 'wMagnetiseD' }]
    },
    {
      scene: 'compass', title: 's6t', fact: 's6f',
      words: [{ term: 'wCompass', def: 'wCompassD' }, { term: 'wEarth', def: 'wEarthD' }]
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
