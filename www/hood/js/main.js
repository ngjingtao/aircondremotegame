/* ═══════════════════════════════════════════
   hood/js/main.js — boot + loop
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

  /* what to say about the current state */
  function currentFact() {
    const S = ARG.sim.s;
    if (S.fan === 0) return 'tOff';
    if (S.dirty) return 'tDirty';
    if (S.mode === 'recirc') return 'tRecirc';
    return 'tDuct';
  }

  function handleAction(action, el) {
    const res = ARG.sim.press(action, el);
    if (!res) return;
    if (res.sound && typeof ARG.audio[res.sound] === 'function') ARG.audio[res.sound]();
    else ARG.audio.blip();

    /* narrate what just changed */
    if (action === 'fan') {
      const S = ARG.sim.s;
      ARG.voice.stop();
      if (S.fan === 0) ARG.voice.speak(ARG.i18n.t('tOff'));
      else ARG.voice.speak(ARG.i18n.t('tBlower'));
    } else if (action === 'filter') {
      ARG.voice.stop();
      ARG.voice.speak(ARG.i18n.t(ARG.sim.s.dirty ? 'tDirty' : 'tFilter'));
      ARG.scene.toast(ARG.i18n.t(ARG.sim.s.dirty ? 'washIt' : 'clean'), !ARG.sim.s.dirty);
    } else if (action === 'mode') {
      ARG.voice.stop();
      ARG.voice.speak(ARG.i18n.t(ARG.sim.s.mode === 'recirc' ? 'tRecirc' : 'tDuct'));
    }

    ARG.panel.render();
    ARG.scene.render(0.016);
  }

  let last = 0, running = true, lastNote = null;

  function loop(now) {
    if (!running) return;
    const dt = last ? (now - last) / 1000 : 0.016;
    last = now;

    ARG.sim.tick(dt);

    /* if the situation changes on its own, say so */
    const f = currentFact();
    if (ARG.voice.enabled && lastNote === null) lastNote = f;
    else if (ARG.voice.enabled && f !== lastNote && ARG.sim.s.fan !== 0) {
      lastNote = f;
      ARG.voice.speak(ARG.i18n.t(f));
    } else lastNote = f;

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
