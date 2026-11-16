/* ═══════════════════════════════════════════
   Computer — the lesson data
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  const STEPS = [
    {
      scene: 'input', title: 's1t', fact: 's1f',
      words: [{ term: 'wInput', def: 'wInputD' }]
    },
    {
      scene: 'cpu', title: 's2t', fact: 's2f',
      words: [{ term: 'wCpu', def: 'wCpuD' }]
    },
    {
      scene: 'ram', title: 's3t', fact: 's3f',
      words: [{ term: 'wRam', def: 'wRamD' }]
    },
    {
      scene: 'storage', title: 's4t', fact: 's4f',
      words: [{ term: 'wStorage', def: 'wStorageD' }]
    },
    {
      scene: 'output', title: 's5t', fact: 's5f',
      words: [{ term: 'wOutput', def: 'wOutputD' }]
    },
    {
      scene: 'program', title: 's6t', fact: 's6f',
      words: [{ term: 'wProgram', def: 'wProgramD' }, { term: 'wBinary', def: 'wBinaryD' }]
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
