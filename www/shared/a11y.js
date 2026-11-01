/* ═══════════════════════════════════════════════════════════
   shared/a11y.js — accessibility helpers

   1. gives every icon-only button a real accessible name
   2. makes the whole app usable from a keyboard

   The controls listen on `pointerdown` for instant response, which
   a keyboard never fires. Real <button>s DO fire `click` from
   Enter/Space, so we bridge that across — while ignoring the click
   that a touch or mouse also generates, so nothing fires twice.
   ═══════════════════════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.a11y = (function () {

  const NAMES = {
    'btn-lang': 'Language / 语言',
    'btn-sound': 'Sound effects / 音效',
    'btn-voice': 'Spoken narration / 朗读',
    'btn-help': 'Help / 帮助',
    'btn-panel': 'Show or hide the controls / 显示或隐藏控制',
    'btn-quiz': 'Start the quiz / 开始小测验',
    'btn-home': 'Back to the menu / 返回菜单'
  };

  let lastPointer = 0;

  function label() {
    Object.keys(NAMES).forEach(id => {
      const b = document.getElementById(id);
      if (b && !b.getAttribute('aria-label')) b.setAttribute('aria-label', NAMES[id]);
    });
    /* anything that only shows an emoji still needs a spoken name */
    document.querySelectorAll('button').forEach(b => {
      if (b.getAttribute('aria-label')) return;
      /* a title is already a usable name — promote it to aria-label */
      const title = b.getAttribute('title');
      if (title) { b.setAttribute('aria-label', title); return; }
      const txt = (b.textContent || '').replace(/\s+/g, ' ').trim();
      if (!txt) return;
      /* a label that is only symbols or emoji */
      if (!/[\u4e00-\u9fa5a-zA-Z0-9]/.test(txt)) b.setAttribute('aria-label', txt);
    });
    /* the decorative SVGs should not be announced */
    document.querySelectorAll('svg').forEach(s => {
      if (!s.getAttribute('aria-hidden')) s.setAttribute('aria-hidden', 'true');
    });
  }

  /* keyboard: turn Enter/Space clicks into the same pointerdown path */
  function keyboard() {
    document.addEventListener('pointerdown', () => { lastPointer = Date.now(); }, true);
    document.addEventListener('keydown', ev => {
      if (ev.key !== 'Enter' && ev.key !== ' ' && ev.key !== 'Spacebar') return;
      const el = ev.target;
      if (!el || el.tagName !== 'BUTTON' || el.disabled) return;
      ev.preventDefault();
      /* a real press, so the pointerdown handlers hear it */
      try {
        el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, pointerType: 'keyboard' }));
      } catch (e) {
        el.click();
      }
    });
  }

  /* a visible focus ring for keyboard users only */
  function focusRing() {
    document.addEventListener('keydown', ev => {
      if (ev.key === 'Tab') document.documentElement.classList.add('kb-nav');
    }, true);
    document.addEventListener('pointerdown', () => {
      document.documentElement.classList.remove('kb-nav');
    }, true);
  }

  function title() {
    if (!ARG.i18n || !ARG.i18n.t) return;
    const name = ARG.i18n.t('title');
    if (!name || name === 'title') return;
    const suffix = ARG.i18n.lang === 'zh' ? ' · 边玩边学' : ' · Play & Learn';
    if (document.title !== name + suffix) document.title = name + suffix;
  }

  function init() {
    label();
    keyboard();
    focusRing();
    title();
    if (window.MutationObserver) {
      new MutationObserver(title).observe(document.documentElement, {
        attributes: true, attributeFilter: ['lang']
      });
    }
    /* the language has now been applied — fade the app in */
    document.documentElement.classList.remove('i18n-pending');
    /* some panels rebuild their buttons later */
    setTimeout(label, 400);
    setTimeout(label, 1500);
  }

  return { init, label, title };
})();
