/* ═══════════════════════════════════════════
   Sun Bear — the lesson data
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  const STEPS = [
    {
      scene: 'size', title: 's1t', fact: 's1f',
      words: [{ term: 'wBear', def: 'wBearD' }, { term: 'wRain', def: 'wRainD' }]
    },
    {
      scene: 'patch', title: 's2t', fact: 's2f',
      words: [{ term: 'wPatch', def: 'wPatchD' }, { term: 'wPrint', def: 'wPrintD' }]
    },
    {
      scene: 'tongue', title: 's3t', fact: 's3f',
      words: [{ term: 'wTongue', def: 'wTongueD' }, { term: 'wComb', def: 'wCombD' }]
    },
    {
      scene: 'food', title: 's4t', fact: 's4f',
      words: [{ term: 'wTermite', def: 'wTermiteD' }, { term: 'wHoneybear', def: 'wHoneybearD' }]
    },
    {
      scene: 'climb', title: 's5t', fact: 's5f',
      words: [{ term: 'wClimb', def: 'wClimbD' }, { term: 'wClaw', def: 'wClawD' }]
    },
    {
      scene: 'protect', title: 's6t', fact: 's6f',
      words: [{ term: 'wVulnerable', def: 'wVulnerableD' }, { term: 'wProtect', def: 'wProtectD' }]
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
