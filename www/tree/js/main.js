/* ═══════════════════════════════════════════
   tree/js/main.js — boot + loop
   ═══════════════════════════════════════════ */
(function () {

  const CW = 300;
  const CH = 640;
  const $ = id => document.getElementById(id);

  function layout() {
    const mainEl = document.querySelector('main');
    const panel = $('ctl-panel');
    const scaler = $('ctl-scaler');
    if (!mainEl || !panel) return;

    if (ARG.shell && ARG.shell.isCollapsed()) {
      panel.style.flexBasis = '0px';
      return;
    }

    /* a portrait phone stacks the scene above a scrollable control sheet */
    if (ARG.shell && ARG.shell.isStacked && ARG.shell.isStacked()) {
      ARG.shell.stackPanel({ panel: panel, scaler: scaler, w: CW, h: CH, varName: '--ctl-scale' });
      return;
    }

    const totalW = mainEl.clientWidth;
    const availH = panel.clientHeight - 16;
    const tablet = totalW >= 700 && mainEl.clientHeight >= 560;

    const maxPanelW = Math.min(totalW * (tablet ? 0.48 : 0.56), tablet ? 520 : 430);
    const maxScale = tablet ? 1.4 : 1.15;

    let scale = Math.min((maxPanelW - 20) / CW, availH / CH);
    scale = Math.max(0.30, Math.min(scale, maxScale));

    document.documentElement.style.setProperty('--ctl-scale', scale);
    scaler.style.width = (CW * scale) + 'px';
    scaler.style.height = (CH * scale) + 'px';
    panel.style.flexBasis = (CW * scale + 20) + 'px';
  }

  function speakStage() {
    const S = ARG.sim.s;
    const st = ARG.sim.stage();
    ARG.voice.stop();
    ARG.voice.speakLinked($('pane-note'), ARG.i18n.t(st.key) + '。' + ARG.i18n.t(st.fact));
    ARG.scene.toast(ARG.i18n.t('s' + S.stage), true);
  }

  function handleAction(action, el) {
    const before = ARG.sim.s.phase;
    const res = ARG.sim.press(action, el);
    if (!res) return;

    if (res.sound && typeof ARG.audio[res.sound] === 'function') ARG.audio[res.sound]();
    else ARG.audio.blip();

    if (action === 'start' || action === 'again') {
      if (before === 'growing') {
        ARG.voice.stop();
        ARG.voice.speak(ARG.i18n.t('advicePaused'));
      } else if (before === 'paused') {
        ARG.voice.stop();
        ARG.voice.speak(ARG.i18n.t('adviceOk'));
      } else {
        speakStage();
      }
      lastStage = ARG.sim.s.stage;
    }

    ARG.panel.render();
    ARG.scene.render(0.016);
  }

  let last = 0, running = true;
  let lastStage = 0, lastDone = false, lastWilt = false;

  function loop(now) {
    if (!running) return;
    const dt = last ? (now - last) / 1000 : 0.016;
    last = now;

    ARG.sim.tick(dt);
    ARG.scene.render(dt);
    ARG.panel.render();

    const S = ARG.sim.s;

    if (S.phase === 'growing' && S.stage !== lastStage) {
      lastStage = S.stage;
      speakStage();
    }

    if (S.phase === 'done' && !lastDone) {
      ARG.scene.toast(ARG.i18n.t('toastDone'), true);
      ARG.audio.cheer();
      ARG.voice.stop();
      ARG.voice.speak(ARG.i18n.t(S.reason));
      if (S.stars > 0) ARG.progress.award('tree', S.stars);
    }

    if (S.phase === 'wilted' && !lastWilt) {
      ARG.scene.toast(ARG.i18n.t('toastWilt'), false);
      ARG.audio.warn();
      ARG.voice.stop();
      ARG.voice.speak(ARG.i18n.t(S.reason));
    }

    lastDone = S.phase === 'done';
    lastWilt = S.phase === 'wilted';
    if (S.phase === 'idle' || S.phase === 'growing' || S.phase === 'paused') lastStage = S.stage;

    requestAnimationFrame(loop);
  }

  function boot() {
    ARG.scene.build();
    ARG.panel.build(handleAction);
    ARG.i18n.apply();
    ARG.voice.attach();
    ARG.shell.attach();
    ARG.a11y.init();

    $('btn-lang').addEventListener('click', () => {
      ARG.i18n.toggle();
      ARG.voice.syncLang();
      ARG.i18n.apply();
      ARG.panel.refresh();
      ARG.panel.render();
      ARG.scene.render(0.016);
    });

    $('btn-sound').addEventListener('click', e => {
      const on = ARG.audio.toggle();
      e.currentTarget.textContent = on ? '🔊' : '🔇';
    });
    $('btn-sound').textContent = ARG.audio.enabled ? '🔊' : '🔇';

    const help = $('help-overlay');
    $('btn-help').addEventListener('click', () => { help.hidden = false; });
    $('help-close').addEventListener('click', () => { help.hidden = true; });
    help.addEventListener('click', e => { if (e.target === help) help.hidden = true; });

    ARG.voice.speakOnTap($('help-body'));
    ARG.voice.speakOnTap($('pane-note'));

    layout();
    window.addEventListener('resize', layout);
    window.addEventListener('orientationchange', () => setTimeout(layout, 250));
    if (window.ResizeObserver) new ResizeObserver(layout).observe(document.querySelector('main'));
    setTimeout(layout, 60);
    setTimeout(layout, 400);

    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
      if (running) { last = 0; requestAnimationFrame(loop); }
    });

    document.addEventListener('gesturestart', e => e.preventDefault());
    let lastTouch = 0;
    document.addEventListener('touchend', e => {
      const now = Date.now();
      if (now - lastTouch < 300) e.preventDefault();
      lastTouch = now;
    }, { passive: false });

    ARG.scene.render(0.016);
    ARG.panel.render();
    requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

})();
