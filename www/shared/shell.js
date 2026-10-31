/* ═══════════════════════════════════════════════════════════
   shared/shell.js — the collapsible control panel

   Adds the ◧ button that folds the controls away, marks the
   pages that have a control panel, and — on a portrait phone —
   stacks the scene above a full-width, scrollable control sheet
   so neither the illustration nor the text is squeezed.
   ═══════════════════════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.shell = (function () {

  const KEY = 'arg.panelCollapsed';

  function isCollapsed() {
    return document.documentElement.classList.contains('panel-collapsed');
  }

  function apply(collapsed) {
    document.documentElement.classList.toggle('panel-collapsed', collapsed);
    const b = document.getElementById('btn-panel');
    if (b) {
      b.textContent = collapsed ? '▣' : '◧';
      b.title = collapsed ? 'Show controls' : 'Hide controls';
      b.classList.toggle('on', collapsed);
    }
  }

  function toggle() {
    const next = !isCollapsed();
    apply(next);
    ARG.store.set(KEY, next ? '1' : '0');
    if (window.dispatchEvent) window.dispatchEvent(new Event('resize'));
    return next;
  }

  /* A phone in portrait cannot show a 300×640 control panel beside the scene:
     the panel would be about 220 px wide and the illustration 170 px. The
     media query in ui.css stacks them instead — scene on top, controls in a
     full-width sheet below. The class marks the pages that have a panel at
     all, so the train (which uses a bottom cab bar) is left alone. */
  function isStacked() {
    return !!(window.matchMedia &&
      window.matchMedia('(max-width:699px) and (orientation:portrait)').matches);
  }

  const CARD_SEL = '.ctl, .panel, .deck, .remote';
  let cfg = null;
  let fitTimer = 0;
  let fitQueued = false;

  function cardFor(panel) {
    return panel ? panel.querySelector(CARD_SEL) : null;
  }

  /* A note card or a stretched pane should not count as content. Walk down to
     the deepest visible boxes (buttons, labels, readings) and take the bottom
     of the last one, relative to the card and divided by its scale. */
  function measureContent(card, scale) {
    if (!card || !scale) return 0;
    const cardRect = card.getBoundingClientRect();
    if (!cardRect.height) return 0;
    let max = 0;
    const shown = el => {
      const cs = getComputedStyle(el);
      return cs.display !== 'none' && cs.visibility !== 'hidden' &&
        cs.opacity !== '0' && el.getBoundingClientRect().height > 1;
    };
    const walk = el => {
      if (!shown(el)) return;
      const kids = [];
      for (const c of el.children) if (shown(c)) kids.push(c);
      if (!kids.length) {
        const bottom = (el.getBoundingClientRect().bottom - cardRect.top) / scale;
        if (bottom > max) max = bottom;
      } else {
        for (const c of kids) walk(c);
      }
    };
    for (const c of card.children) walk(c);
    return max;
  }

  /* Let the card be exactly as tall as its controls. Measuring happens at the
     full design height, then the card is shrunk before the next paint. */
  function fitCard(o) {
    if (!o || !o.panel || !o.scaler) return o ? o.h : 0;
    const card = cardFor(o.panel);
    if (!card) return o.h;
    const scale = parseFloat(document.documentElement.style.getPropertyValue(o.varName)) ||
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue(o.varName)) || 1;
    card.classList.remove('fit-card');
    void card.offsetHeight;
    const content = measureContent(card, scale);
    let height = o.h;
    if (content > 80) {
      const padBottom = parseFloat(getComputedStyle(card).paddingBottom) || 0;
      height = Math.min(o.h, Math.max(160, content + padBottom));
    }
    card.style.setProperty('--card-h', height + 'px');
    card.classList.add('fit-card');
    o.scaler.style.height = (height * scale) + 'px';
    return height;
  }

  function stackPanel(o) {
    if (!o || !o.panel || !o.scaler) return;
    cfg = o;
    /* scale by the width of the screen, not its height: the sheet scrolls, so
       the controls get bigger instead of shrinking to fit the whole design */
    const scale = Math.max(0.5,
      Math.min((o.panel.clientWidth - 16) / o.w, o.maxScale || 1.25));
    document.documentElement.style.setProperty(o.varName, scale);
    o.scaler.style.width = (o.w * scale) + 'px';
    const height = fitCard(o) || o.h;
    o.panel.style.flexBasis = '';

    /* a short pane gets a short sheet; a tall one keeps the half-screen
       maximum and scrolls instead of leaving a white card behind */
    const cs = getComputedStyle(o.panel);
    const pad = (parseFloat(cs.paddingTop) || 0) +
      (parseFloat(cs.paddingBottom) || 0) +
      (parseFloat(cs.borderTopWidth) || 0) +
      (parseFloat(cs.borderBottomWidth) || 0);
    const main = o.panel.parentElement;
    const maxSheet = Math.max(240, (main ? main.clientHeight : window.innerHeight) * 0.5);
    const ideal = height * scale + pad;
    document.documentElement.style.setProperty('--sheet-h',
      Math.min(maxSheet, ideal).toFixed(1) + 'px');
  }

  function fitRow() {
    if (!cfg || isCollapsed() || isStacked()) return;
    fitCard(cfg);
  }

  function scheduleFit(delay) {
    if (fitTimer) clearTimeout(fitTimer);
    fitTimer = setTimeout(function () {
      fitTimer = 0;
      if (isCollapsed()) return;
      if (isStacked()) stackPanel(cfg); else fitRow();
    }, delay || 120);
  }

  /* Runs in a microtask: the first fact text is filled in just after boot, and
     an iframe that is not being painted can have its timers held back. A
     microtask still runs, and it coalesces a burst of text changes. */
  function queueFit() {
    if (fitQueued) return;
    fitQueued = true;
    const run = function () {
      fitQueued = false;
      if (!cfg || isCollapsed()) return;
      if (isStacked()) stackPanel(cfg); else fitRow();
    };
    if (window.Promise) Promise.resolve().then(run);
    else run();
  }

  function configFor(panel) {
    if (!panel) return null;
    const byId = id => document.getElementById(id);
    if (panel.id === 'remote-panel') {
      return { panel, scaler: byId('remote-scaler'), w: 300, h: 640, varName: '--scale' };
    }
    if (panel.id === 'deck-panel') {
      return { panel, scaler: byId('deck-scaler'), w: 320, h: 660, varName: '--deck-scale' };
    }
    if (panel.id === 'panel-panel') {
      return { panel, scaler: byId('panel-scaler'), w: 300, h: 640, varName: '--panel-scale' };
    }
    return { panel, scaler: byId('ctl-scaler'), w: 300, h: 640, varName: '--ctl-scale' };
  }

  function attach() {
    const b = document.getElementById('btn-panel');
    const panel = document.getElementById('ctl-panel') ||
      document.getElementById('remote-panel') ||
      document.getElementById('deck-panel') ||
      document.getElementById('panel-panel');
    const main = document.querySelector('main');
    if (panel && main) main.classList.add('has-panel');

    cfg = configFor(panel);
    if (panel && cfg && cfg.scaler) {
      /* panes switch with [hidden]; facts and labels are filled just after
         boot, and result cards appear the same way */
      if (window.MutationObserver) {
        new MutationObserver(queueFit).observe(panel, {
          subtree: true,
          attributes: true,
          attributeFilter: ['hidden'],
          childList: true,
          characterData: true
        });
      }
      panel.addEventListener('pointerdown', queueFit, { passive: true });
      const lang = document.getElementById('btn-lang');
      if (lang) lang.addEventListener('click', queueFit);
      window.addEventListener('resize', function () { scheduleFit(80); });
      window.addEventListener('orientationchange', function () { scheduleFit(350); });
      /* the activity's 60/400 ms layouts can arrive after the first paint */
      [300, 1000, 2000].forEach(function (ms) {
        setTimeout(function () {
          if (isCollapsed()) return;
          if (isStacked()) stackPanel(cfg); else fitRow();
        }, ms);
      });
      queueFit();
    }

    if (!b) return;
    /* always start expanded so the controls are right there — the fold button
       is there for when you want the whole screen for the illustration */
    const start = ARG.store.get(KEY) === '1';
    apply(start);
    b.addEventListener('click', () => { toggle(); ARG.audio && ARG.audio.blip && ARG.audio.blip(); });
  }

  return { attach, toggle, isCollapsed, isStacked, stackPanel };
})();
