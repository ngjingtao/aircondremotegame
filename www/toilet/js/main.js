/* ═══════════════════════════════════════════
   toilet/js/main.js — boot + loop
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

  /* ─────────── narration ─────────── */
  function speakStep() {
    const S = ARG.sim.s;
    const list = S.mode === 'flush' ? ARG.sim.FLUSH : ARG.sim.TREAT;
    const st = list[S.step];
    if (!st) return;
    const n = S.step + 1;
    const head = ARG.i18n.lang === 'zh' ? ('第 ' + n + ' 步，') : ('Step ' + n + '. ');
    ARG.voice.speak(head + ARG.i18n.t(st.key) + '。' + ARG.i18n.t(st.fact));
  }

  function handleAction(action, el) {
    if (action === 'jump') {
      ARG.sim.press('jump', el);
      ARG.audio.blip();
      speakStep();
      ARG.panel.render();
      ARG.scene.render(0.016);
      return;
    }

    const res = ARG.sim.press(action, el);
    if (!res) return;
    if (res.sound && typeof ARG.audio[res.sound] === 'function') ARG.audio[res.sound]();
    else ARG.audio.blip();

    if (action === 'stepUp' || action === 'stepDown') speakStep();
    if (action === 'flush') {
      ARG.voice.stop();
      ARG.voice.speak(ARG.i18n.t(ARG.sim.s.mode === 'flush' ? 'd3' : 'e4'));
    }
    if (action === 'mode') {
      ARG.voice.stop();
      const S = ARG.sim.s;
      ARG.voice.speak(S.mode === 'flush' ? ARG.i18n.t('d0') : ARG.i18n.t('e0'));
    }

    ARG.panel.render();
    ARG.scene.render(0.016);
  }

  /* ─────────── loop ─────────── */
  let last = 0, running = true, lastStep = -1, lastMode = null;

  function loop(now) {
    if (!running) return;
    const dt = last ? (now - last) / 1000 : 0.016;
    last = now;

    const S = ARG.sim.tick(dt);

    /* announce each stage as the water reaches it */
    if (ARG.voice.enabled) {
      if (lastMode !== S.mode) { lastMode = S.mode; lastStep = S.step; }
      else if (S.step !== lastStep) { lastStep = S.step; speakStep(); }
    }

    ARG.scene.render(dt);
    ARG.panel.render();

    requestAnimationFrame(loop);
  }

  function boot() {
    ARG.scene.build();
    ARG.panel.build(handleAction);
    ARG.i18n.apply();
    ARG.voice.attach();

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
