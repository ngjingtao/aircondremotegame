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
  lockLang: 'zh'

};
