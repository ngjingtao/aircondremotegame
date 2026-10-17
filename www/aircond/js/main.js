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

    if (ARG.shell && ARG.shell.isCollapsed()) {


      panel.style.flexBasis = '0px';


      return;


    }


    const totalW = mainEl.clientWidth;
    const availH = panel.clientHeight - 16;
    /* "tablet" = roomy in both directions; a landscape phone has the width but not the height */
    const tablet = totalW >= 700 && mainEl.clientHeight >= 560;

    /* the remote column never eats more than this share of the screen */
    const maxPanelW = Math.min(totalW * (tablet ? 0.48 : 0.56), tablet ? 560 : 430);
    const maxScale = tablet ? 1.4 : 1.15;

    let scale = Math.min((maxPanelW - 20) / RW, availH / RH);
    scale = Math.max(0.30, Math.min(scale, maxScale));

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
    ARG.voice.attach();
    ARG.shell.attach();
    ARG.a11y.init();

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

    ARG.sim.setScoreHook((kind, combo) => {
      const t = ARG.i18n.t;
      if (kind === 'recover') {
        ARG.audio.chime();
        ARG.room.toast('+' + (100 * combo) + '   ' + t('combo') + ' x' + combo, true);
      } else if (kind === 'weather') {
        ARG.audio.cheer();
        ARG.room.toast('+150   ' + t('rodeItOut'), true);
      } else if (kind === 'slip') {
        ARG.audio.warn();
      }
    });

    ARG.sim.setMissionHook((result, stars, reason) => {
      ARG.room.showResult(result, stars, reason);
    });

    /* tapping the open door closes it */
    ARG.room.onDoor(() => handleAction('closedoor'));

    /* ── free play → challenge → mission → free play ── */
    const ORDER = ['free', 'challenge', 'mission'];
    const modeKey = m => (m === 'mission' ? 'mission' : (m === 'challenge' ? 'challenge' : 'freePlay'));
    const uiMode = () => (ARG.sim.s.mission >= 0 ? 'mission' : (ARG.sim.s.challenge ? 'challenge' : 'free'));

    function paintMode() {
      $('btn-mode-label').textContent = ARG.i18n.t(modeKey(uiMode()));
    }

    function setMode(m) {
      ARG.room.hideResult();
      /* leaving a mission is the only thing that rebuilds the world */
      if (ARG.sim.s.mission >= 0) ARG.sim.leaveMission();

      if (m === 'mission') {
        const n = ARG.sim.unlocked();
        ARG.sim.startMission(n);
        ARG.room.toast(ARG.i18n.t(ARG.sim.MISSIONS[n].key), true);
      } else {
        ARG.sim.s.challenge = (m === 'challenge');
        if (!ARG.sim.s.challenge) {
          ARG.sim.s.score = 0; ARG.sim.s.combo = 1;
          if (ARG.sim.s.event) { ARG.sim.s.event.undo(); ARG.sim.s.event = null; ARG.sim.s.eventLeft = 0; }
        }
        ARG.room.toast(ARG.i18n.t(modeKey(m)), true);
      }
      ARG.audio.chime();
      paintMode();
      ARG.room.render();
    }

    $('btn-mode').addEventListener('click', () => {
      setMode(ORDER[(ORDER.indexOf(uiMode()) + 1) % ORDER.length]);
    });

    $('mr-retry').addEventListener('click', () => {
      ARG.room.hideResult();
      ARG.sim.startMission(ARG.sim.s.mission);
      ARG.room.render();
    });

    $('mr-next').addEventListener('click', () => {
      ARG.room.hideResult();
      const n = Math.min(ARG.sim.s.mission + 1, ARG.sim.MISSIONS.length - 1);
      ARG.sim.startMission(n);
      ARG.room.toast(ARG.i18n.t(ARG.sim.MISSIONS[n].key), true);
      ARG.room.render();
    });

    paintMode();

    /* top bar */
    $('btn-lang').addEventListener('click', () => {
      ARG.i18n.toggle();
      ARG.voice.syncLang();
      ARG.i18n.apply();
      ARG.remote.render();
      ARG.room.render();
      paintMode();
      /* the result card is written imperatively, so rebuild it in the new language */
      const s = ARG.sim.s;
      if (!$('mission-result').hidden && s.result) ARG.room.showResult(s.result, s.stars, s.failReason);
    });

    $('btn-sound').addEventListener('click', e => {
      const on = ARG.audio.toggle();
      e.currentTarget.textContent = on ? '🔊' : '🔇';
    });
    $('btn-sound').textContent = ARG.audio.enabled ? '🔊' : '🔇';

    /* the mode button itself is wired above, with the missions */

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
