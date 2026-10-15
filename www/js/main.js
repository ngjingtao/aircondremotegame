/* ═══════════════════════════════════════════
   main.js — bootstrap, loop, HUD wiring
   ═══════════════════════════════════════════ */
(function () {

  const RW = 300;   // remote design width
  const RH = 640;   // remote design height

  const $ = id => document.getElementById(id);

  /* ─────────── responsive remote scaling ─────────── */
  function layout() {
    const mainEl = document.querySelector('main');
    const panel  = $('remote-panel');
    const scaler = $('remote-scaler');
    if (!mainEl || !panel) return;

    const totalW = mainEl.clientWidth;
    const availH = panel.clientHeight - 16;
    /* the remote column never eats more than this share of the screen */
    const maxPanelW = Math.min(totalW * 0.56, 430);

    let scale = Math.min((maxPanelW - 20) / RW, availH / RH);
    scale = Math.max(0.3, Math.min(scale, 1.1));

    document.documentElement.style.setProperty('--scale', scale);
    scaler.style.width  = (RW * scale) + 'px';
    scaler.style.height = (RH * scale) + 'px';
    panel.style.flexBasis = (RW * scale + 20) + 'px';
  }

  /* ─────────── key handling ─────────── */
  function handleAction(action, el) {
    const res = ARG.sim.press(action, el);
    if (!res) return;

    if (res.locked) {
      ARG.audio.deny();
      ARG.room.toast(ARG.i18n.t('locked'), false);
      return;
    }

    if (res.sound && typeof ARG.audio[res.sound] === 'function') ARG.audio[res.sound]();
    else ARG.audio.beep();

    if (res.signal) ARG.room.signal();
    if (res.say)    ARG.room.say(res.say);
    if (res.msg)    ARG.room.toast(res.msg, true);

    ARG.remote.render();
    ARG.room.render();
  }

  /* ─────────── simulation loop ─────────── */
  let last = 0;
  let running = true;

  function loop(now) {
    if (!running) return;
    const dt = last ? (now - last) / 1000 : 0.016;
    last = now;

    ARG.sim.tick(dt);
    ARG.remote.render();
    ARG.room.render();

    requestAnimationFrame(loop);
  }

  /* ─────────── boot ─────────── */
  function boot() {
    ARG.i18n.apply();

    ARG.remote.init(handleAction);
    ARG.room.init();

    ARG.sim.setEventHook(ev => {
      if (!ev) {
        ARG.room.toast(ARG.i18n.t('eventBack'), true);
        ARG.audio.chime();
      } else {
        ARG.room.toast(ARG.i18n.t(ev.key), false);
        ARG.audio.toast();
      }
    });

    ARG.sim.setHourHook(() => {
      /* soft chime on the hour */
      if (ARG.sim.s.challenge) ARG.audio.beep();
    });

    /* top bar */
    $('btn-lang').addEventListener('click', () => {
      ARG.i18n.toggle();
      ARG.i18n.apply();
      ARG.remote.render();
      ARG.room.render();
    });

    $('btn-sound').addEventListener('click', e => {
      const on = ARG.audio.toggle();
      e.currentTarget.textContent = on ? '🔊' : '🔇';
    });
    $('btn-sound').textContent = ARG.audio.enabled ? '🔊' : '🔇';

    $('btn-mode').addEventListener('click', () => {
      const s = ARG.sim.s;
      s.challenge = !s.challenge;
      $('btn-mode-label').textContent = ARG.i18n.t(s.challenge ? 'challenge' : 'freePlay');
      if (!s.challenge) {
        s.score = 0; s.combo = 1;
        if (s.event) { s.event.undo(); s.event = null; s.eventLeft = 0; }
      }
      ARG.audio.chime();
      ARG.room.toast(ARG.i18n.t(s.challenge ? 'challenge' : 'freePlay'), true);
      ARG.room.render();
    });

    const overlay = $('help-overlay');
    $('btn-help').addEventListener('click', () => { overlay.hidden = false; });
    $('help-close').addEventListener('click', () => { overlay.hidden = true; });
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.hidden = true; });

    /* first-run help */
    if (!ARG.store.get('arg.seenHelp')) {
      overlay.hidden = false;
      ARG.store.set('arg.seenHelp', '1');
    }

    /* layout */
    layout();
    window.addEventListener('resize', layout);
    window.addEventListener('orientationchange', () => setTimeout(layout, 250));
    if (window.ResizeObserver) {
      const mainEl = document.querySelector('main');
      new ResizeObserver(layout).observe(mainEl);
    }
    /* the first paint may not have settled yet */
    setTimeout(layout, 60);
    setTimeout(layout, 400);

    /* pause when hidden */
    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
      if (running) { last = 0; requestAnimationFrame(loop); }
    });

    /* block pinch-zoom / double-tap zoom */
    document.addEventListener('gesturestart', e => e.preventDefault());
    let lastTouch = 0;
    document.addEventListener('touchend', e => {
      const now = Date.now();
      if (now - lastTouch < 300) e.preventDefault();
      lastTouch = now;
    }, { passive: false });

    ARG.room.render();
    requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

})();
