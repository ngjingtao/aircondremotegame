/* ═══════════════════════════════════════════
   Light — the lesson data
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  const STEPS = [
    {
      scene: 'sources', title: 's1t', fact: 's1f',
      words: [{ term: 'wSource', def: 'wSourceD' }, { term: 'wEye', def: 'wEyeD' }]
    },
    {
      scene: 'straight', title: 's2t', fact: 's2f',
      words: [{ term: 'wStraight', def: 'wStraightD' }, { term: 'wBlock', def: 'wBlockD' }]
    },
    {
      scene: 'shadow', title: 's3t', fact: 's3f',
      words: [{ term: 'wShadow', def: 'wShadowD' }, { term: 'wOpaque', def: 'wOpaqueD' }]
    },
    {
      scene: 'near', title: 's4t', fact: 's4f',
      words: [{ term: 'wDirection', def: 'wDirectionD' }, { term: 'wSize', def: 'wSizeD' }]
    },
    {
      scene: 'mirror', title: 's5t', fact: 's5f',
      words: [{ term: 'wReflect', def: 'wReflectD' }, { term: 'wMirror', def: 'wMirrorD' }]
    },
    {
      scene: 'refract', title: 's6t', fact: 's6f',
      words: [{ term: 'wRefract', def: 'wRefractD' }, { term: 'wStraw', def: 'wStrawD' }]
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
