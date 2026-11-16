/* ═══════════════════════════════════════════
   Electricity — the lesson data

   Six steps. `scene` is the part the picture lights up; `words` are the
   key words the child can tap to hear what they mean.
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  const STEPS = [
    {
      scene: 'battery', title: 's1t', fact: 's1f',
      words: [{ term: 'wCell', def: 'wCellD' }, { term: 'wPole', def: 'wPoleD' }]
    },
    {
      scene: 'loop', title: 's2t', fact: 's2f',
      words: [{ term: 'wCircuit', def: 'wCircuitD' }, { term: 'wCurrent', def: 'wCurrentD' }]
    },
    {
      scene: 'switch', title: 's3t', fact: 's3f',
      words: [{ term: 'wSwitch', def: 'wSwitchD' }]
    },
    {
      scene: 'bulb', title: 's4t', fact: 's4f',
      words: [{ term: 'wFilament', def: 'wFilamentD' }, { term: 'wEnergy', def: 'wEnergyD' }]
    },
    {
      scene: 'conductors', title: 's5t', fact: 's5f',
      words: [{ term: 'wConductor', def: 'wConductorD' }, { term: 'wInsulator', def: 'wInsulatorD' }]
    },
    {
      scene: 'safe', title: 's6t', fact: 's6f',
      words: [{ term: 'wMains', def: 'wMainsD' }, { term: 'wSafe', def: 'wSafeD' }]
    }
  ];

  const s = { step: 0, seenAll: false };

  /* the shared lesson engine owns navigation; this keeps the usual
     sim.press(...) shape so the rest of the app reads the same */
  function press(action, el) {
    if (ARG.lesson && ARG.lesson.press) return ARG.lesson.press(action, el);
    return false;
  }

  function tick() { /* a lesson has no clock */ }

  return { STEPS, s, press, tick };
})();
