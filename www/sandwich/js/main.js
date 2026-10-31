/* ═══════════════════════════════════════════
   sandwich/js/main.js — boot + loop
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

  function handleAction(action, el) {
    const res = ARG.sim.press(action, el);
    if (!res) return;
    if (res.sound && typeof ARG.audio[res.sound] === 'function') ARG.audio[res.sound]();
    else ARG.audio.blip();

    const S = ARG.sim.s;
    if (action === 'action' && S.phase === 'cook' && S.cooking) {
      ARG.voice.stop();
      ARG.voice.speak(ARG.i18n.t('tCook'));
    }

    ARG.panel.render();
    ARG.scene.render(0.016);
  }

  let last = 0, running = true;
  let lastPhase = 'build';

  function loop(now) {
    if (!running) return;
    const dt = last ? (now - last) / 1000 : 0.016;
    last = now;

    ARG.sim.tick(dt);
    ARG.scene.render(dt);
    ARG.panel.render();

    const S = ARG.sim.s;

    if (S.phase !== lastPhase) {
      if (S.phase === 'cook') {
        ARG.voice.stop();
        ARG.voice.speak(ARG.i18n.t('tCook'));
      } else if (S.phase === 'ready') {
        ARG.voice.stop();
        const burnt = S.cookQuality === 0 && S.cookT > ARG.sim.heatTarget() * 1.6;
        ARG.voice.speak(ARG.i18n.t(burnt ? 'sandwichBurnt' : 'tReady'));
        ARG.scene.toast(ARG.i18n.t('statusReady'), true);
      } else if (S.phase === 'done') {
        ARG.scene.toast(ARG.i18n.t(S.stars > 0 ? 'statusDone' : 'sandwichBurnt'), S.stars > 0);
        if (S.stars > 0) ARG.audio.cheer(); else ARG.audio.warn();
        ARG.voice.stop();
        ARG.voice.speak(ARG.i18n.t(S.reason));
        if (S.stars > 0) ARG.progress.award('sandwich', S.stars);
      } else if (S.phase === 'build') {
        ARG.voice.stop();
        ARG.voice.speak(ARG.i18n.t('tBuild'));
      }
      lastPhase = S.phase;
    }

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
