/* ═══════════════════════════════════════════
   breath/js/main.js — boot + loop
   ═══════════════════════════════════════════ */
(function () {

  const BW = 300;   // panel design width
  const BH = 640;   // panel design height

  const $ = id => document.getElementById(id);

  /* ─────────── responsive panel scaling ─────────── */
  function layout() {
    const mainEl = document.querySelector('main');
    const panel = $('panel-panel');
    const scaler = $('panel-scaler');
    if (!mainEl || !panel) return;

    const totalW = mainEl.clientWidth;
    const availH = panel.clientHeight - 16;
    const tablet = totalW >= 700 && mainEl.clientHeight >= 560;

    const maxPanelW = Math.min(totalW * (tablet ? 0.46 : 0.50), tablet ? 520 : 400);
    const maxScale = tablet ? 1.4 : 1.15;

    let scale = Math.min((maxPanelW - 20) / BW, availH / BH);
    scale = Math.max(0.30, Math.min(scale, maxScale));

    document.documentElement.style.setProperty('--panel-scale', scale);
    scaler.style.width = (BW * scale) + 'px';
    scaler.style.height = (BH * scale) + 'px';
    panel.style.flexBasis = (BW * scale + 20) + 'px';
  }

  /* ─────────── actions ─────────── */
  function handleAction(action, el) {
    const res = ARG.sim.press(action, el);
    if (!res) return;

    if (res.sound && typeof ARG.audio[res.sound] === 'function') ARG.audio[res.sound]();
    else ARG.audio.blip();

    ARG.panel.render();
    ARG.scene.render(0.016);
  }

  /* ─────────── loop ─────────── */
  let last = 0, running = true;
  let lastBeat = -1;

  /* ─────────── narration ─────────── */
  let lastSpokenSc = null;

  function speakWatch() {
    const s = ARG.sim.s;
    if (!ARG.voice.enabled) return;
    if (lastSpokenSc === null) { lastSpokenSc = s.scenario; return; }   // quiet on load
    if (s.scenario === lastSpokenSc) return;
    lastSpokenSc = s.scenario;
    const cap = s.scenario.charAt(0).toUpperCase() + s.scenario.slice(1);
    ARG.voice.speak(ARG.i18n.t('sc' + cap) + '。' + ARG.i18n.t('msg' + cap));
  }

  function loop(now) {
    if (!running) return;
    const dt = last ? (now - last) / 1000 : 0.016;
    last = now;

    const S = ARG.sim.tick(dt);

    /* a soft heartbeat once per beat */
    if (S.beats !== lastBeat) {
      lastBeat = S.beats;
      if (S.heartRate < 130) ARG.audio.thump();
    }
    /* the whoosh of each breath in and out */
    if (S.breathCue === 'in') ARG.audio.breatheIn();
    else if (S.breathCue === 'out') ARG.audio.breatheOut();

    ARG.scene.render(dt);
    ARG.panel.render();
    speakWatch();

    requestAnimationFrame(loop);
  }

  /* ─────────── boot ─────────── */
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

    /* tap the fact card to hear it */
    ARG.voice.speakOnTap($('fact-text'));

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
