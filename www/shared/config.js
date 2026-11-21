/* ═══════════════════════════════════════════════════════════
   shared/config.js — build-time switches

   ┌─────────────────────────────────────────────────────────┐
   │  ENGLISH IS UNLOCKED BY THE MATHS GATE:                 │
   │  5 correct one-digit sums → English for 5 minutes.      │
   │  Set  lockLang: 'zh'  below to hard-lock Chinese again. │
   └─────────────────────────────────────────────────────────┘
   ═══════════════════════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.config = {

  /* The language button is gated by shared/lang.js: a 5-question one-digit
     addition quiz unlocks English for 5 minutes, then it returns to Chinese.
     Chinese is always the default. Set 'zh' here to hard-lock it again. */
  lockLang: null,

  /* Neural narration through the server's /tts route.
     mode: 'auto'   — neural on desktop and Android, device voices on iPad
           'cloud'  — always try the neural voice first
           'system' — never use the network; device voices only
           'off'    — same as the voice button being off
     base: '' means same origin. The Android/iOS app runs on localhost, so it
     points at the public server instead. */
  /* Optional AI-generated illustrations. Leave these false until the files
     exist; docs/art/ explains the exact paths and prompts. */
  art: {
    lessons: false,
    tiles: false
  },

  tts: {
    enabled: true,
    mode: 'auto',
    base: (typeof location !== 'undefined' &&
           (location.protocol === 'file:' || location.hostname === 'localhost'))
      ? 'https://jk-play-n-learn.onrender.com'
      : ''
  }

};
