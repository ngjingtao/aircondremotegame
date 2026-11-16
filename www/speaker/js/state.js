/* ═══════════════════════════════════════════
   Speaker — the lesson data
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  const STEPS = [
    {
      scene: 'speaker', title: 's1t', fact: 's1f',
      words: [{ term: 'wSpeaker', def: 'wSpeakerD' }, { term: 'wSignal', def: 'wSignalD' }]
    },
    {
      scene: 'motor', title: 's2t', fact: 's2f',
      words: [{ term: 'wCoil', def: 'wCoilD' }, { term: 'wMagnet', def: 'wMagnetD' }]
    },
    {
      scene: 'signal', title: 's3t', fact: 's3f',
      words: [{ term: 'wVibrate', def: 'wVibrateD' }]
    },
    {
      scene: 'cone', title: 's4t', fact: 's4f',
      words: [{ term: 'wDiaphragm', def: 'wDiaphragmD' }]
    },
    {
      scene: 'pitch', title: 's5t', fact: 's5f',
      words: [{ term: 'wFrequency', def: 'wFrequencyD' }, { term: 'wPitch', def: 'wPitchD' }]
    },
    {
      scene: 'volume', title: 's6t', fact: 's6f',
      words: [{ term: 'wAmplitude', def: 'wAmplitudeD' }, { term: 'wVolume', def: 'wVolumeD' }]
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
