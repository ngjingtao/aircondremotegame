/* ═══════════════════════════════════════════
   Power — the lesson data
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  const STEPS = [
    {
      scene: 'plant', title: 's1t', fact: 's1f',
      words: [{ term: 'wTurbine', def: 'wTurbineD' }, { term: 'wGenerator', def: 'wGeneratorD' }]
    },
    {
      scene: 'stepup', title: 's2t', fact: 's2f',
      words: [{ term: 'wTransformer', def: 'wTransformerD' }, { term: 'wHighVoltage', def: 'wHighVoltageD' }]
    },
    {
      scene: 'grid', title: 's3t', fact: 's3f',
      words: [{ term: 'wHighVoltage', def: 'wHighVoltageD' }, { term: 'wVolt', def: 'wVoltD' }]
    },
    {
      scene: 'sub', title: 's4t', fact: 's4f',
      words: [{ term: 'wSubstation', def: 'wSubstationD' }, { term: 'wTransformer', def: 'wTransformerD' }]
    },
    {
      scene: 'meter', title: 's5t', fact: 's5f',
      words: [{ term: 'wMeter', def: 'wMeterD' }, { term: 'wVolt', def: 'wVoltD' }]
    },
    {
      scene: 'socket', title: 's6t', fact: 's6f',
      words: [{ term: 'wVolt', def: 'wVoltD' }, { term: 'wHertz', def: 'wHertzD' }]
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
