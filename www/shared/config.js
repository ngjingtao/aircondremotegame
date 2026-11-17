/* ═══════════════════════════════════════════════════════════
   shared/config.js — build-time switches

   ┌─────────────────────────────────────────────────────────┐
   │  TO BRING THE ENGLISH OPTION BACK:                      │
   │  change  lockLang: 'zh'   to   lockLang: null           │
   │  (that one word is the only thing you need to edit)     │
   └─────────────────────────────────────────────────────────┘
   ═══════════════════════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.config = {

  /* Lock the whole app to one language and hide the EN / 中文 button.
     'zh' = Chinese only,  'en' = English only,  null = switcher enabled. */
  lockLang: 'zh',

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
